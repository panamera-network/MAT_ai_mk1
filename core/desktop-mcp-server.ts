// core/desktop-mcp-server.ts
//
// A small standalone MCP server exposing desktop-only actions (open an app, run a
// shell command, clipboard, screenshot) that MAT-AI-OS's backend can't do on its own
// since it doesn't run on the user's desktop. MAT-AI-OS registers this server at
// startup (see core/orchestrator.py's _register_desktop_mcp_server) and calls into it
// the same way it calls any other MCP server — JSON-RPC 2.0 over HTTP, POSTed straight
// to this server's root URL (http://localhost:8881), matching the protocol MAT-AI-OS's
// own mcp_server.py speaks.
//
// Run standalone: npm run desktop-mcp

import { exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import clipboard from 'clipboardy';
import express, { type Request, type Response } from 'express';

const PORT = Number(process.env.DESKTOP_MCP_PORT || 8881);
const PROTOCOL_VERSION = '2024-11-05';

// Blocked command patterns — checked as a case-insensitive substring/regex match
// against the raw command string before it ever reaches a shell.
const BLOCKED_COMMAND_PATTERNS: RegExp[] = [
  /rmdir\s+\/s/i,
  /del\s+\/f\s+\/s/i,
  /\bformat\b/i,
  /\bshutdown\b/i,
  /rm\s+-rf/i,
];

function isBlockedCommand(command: string): boolean {
  return BLOCKED_COMMAND_PATTERNS.some((pattern) => pattern.test(command));
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

const TOOLS: ToolDefinition[] = [
  {
    name: 'open_application',
    description: 'Open a desktop application by name (e.g. "notepad", "chrome", "code").',
    inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
  },
  {
    name: 'execute_terminal_command',
    description:
      'Run a shell command on the desktop. Destructive commands are refused: rmdir /s, del /f /s, format, shutdown, rm -rf.',
    inputSchema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] },
  },
  {
    name: 'get_clipboard',
    description: 'Read the current clipboard text content.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_clipboard',
    description: 'Write text to the clipboard.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
  },
  {
    name: 'take_screenshot',
    description: 'Capture the current screen and return it as a base64-encoded PNG.',
    inputSchema: { type: 'object', properties: {} },
  },
];

function openApplication(name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    const command =
      platform === 'win32' ? `start "" "${name}"` : platform === 'darwin' ? `open -a "${name}"` : `${name} &`;

    exec(command, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`Opened "${name}".`);
    });
  });
}

function takeScreenshot(): Promise<Buffer> {
  // Shells out to PowerShell + System.Drawing rather than a third-party npm package
  // (screenshot-desktop's bundled extractor batch script doesn't reliably resolve its
  // own extracted .exe outside an Electron-packaged app) — this is a few lines of
  // .NET that ships with every Windows install, nothing extra to bundle.
  if (process.platform !== 'win32') {
    return Promise.reject(new Error('take_screenshot is only implemented for Windows.'));
  }

  const tmpFile = path.join(os.tmpdir(), `mat-ai-screenshot-${randomUUID()}.png`);
  const script = [
    'Add-Type -AssemblyName System.Windows.Forms',
    'Add-Type -AssemblyName System.Drawing',
    '$bounds = [System.Windows.Forms.SystemInformation]::VirtualScreen',
    '$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height',
    '$graphics = [System.Drawing.Graphics]::FromImage($bitmap)',
    '$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)',
    `$bitmap.Save('${tmpFile}', [System.Drawing.Imaging.ImageFormat]::Png)`,
    '$graphics.Dispose()',
    '$bitmap.Dispose()',
  ].join('; ');

  return new Promise((resolve, reject) => {
    exec(`powershell -NoProfile -NonInteractive -Command "${script}"`, { timeout: 15_000 }, async (error) => {
      if (error) {
        reject(error);
        return;
      }
      try {
        const buffer = await readFile(tmpFile);
        resolve(buffer);
      } catch (readError) {
        reject(readError);
      } finally {
        rm(tmpFile, { force: true }).catch(() => {});
      }
    });
  });
}

function executeTerminalCommand(command: string): Promise<string> {
  if (isBlockedCommand(command)) {
    return Promise.reject(new Error(`Blocked: "${command}" matches a destructive-command pattern and was refused.`));
  }

  return new Promise((resolve, reject) => {
    exec(command, { timeout: 30_000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout || stderr || 'Command executed with no output.');
    });
  });
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'open_application':
      return { message: await openApplication(String(args.name ?? '')) };

    case 'execute_terminal_command':
      return { output: await executeTerminalCommand(String(args.command ?? '')) };

    case 'get_clipboard':
      return { text: await clipboard.read() };

    case 'set_clipboard':
      await clipboard.write(String(args.text ?? ''));
      return { status: 'ok' };

    case 'take_screenshot': {
      const buffer = await takeScreenshot();
      return { image_base64: buffer.toString('base64'), format: 'png' };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: { name?: string; arguments?: Record<string, unknown> };
}

const app = express();
app.use(express.json());

app.post('/', async (req: Request<unknown, unknown, JsonRpcRequest>, res: Response) => {
  const { id, method, params } = req.body || {};

  try {
    if (method === 'initialize') {
      res.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: 'mat-ai-mk1-desktop', version: '1.0.0' },
        },
      });
      return;
    }

    if (method === 'tools/list') {
      res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name ?? '';
      const toolArgs = params?.arguments ?? {};
      const result = await callTool(toolName, toolArgs);
      res.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(result) }] } });
      return;
    }

    res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ [DESKTOP MCP]: tool call failed (method=${method}):`, message);
    res.json({ jsonrpc: '2.0', id, error: { code: -32000, message } });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🖥️  [DESKTOP MCP SERVER]: Listening on http://127.0.0.1:${PORT}`);
  console.log('   Tools: open_application, execute_terminal_command, get_clipboard, set_clipboard, take_screenshot');
});
