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

import 'dotenv/config';
import { exec, execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { access, mkdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import clipboard from 'clipboardy';
import express, { type Request, type Response } from 'express';

const execFileAsync = promisify(execFile);

const PORT = Number(process.env.DESKTOP_MCP_PORT || 8881);
const PROTOCOL_VERSION = '2024-11-05';

// Real sandboxing for execute_terminal_command: every command now runs inside a
// throwaway Docker container instead of directly on the host. Previously this was
// raw child_process.exec() with the same privileges as this whole Electron app (full
// desktop access) — the regex denylist below was the ONLY defense, confirmed
// bypassable (e.g. "del /Q /F" without "/s", "rm -r -f" with a space, PowerShell
// "Remove-Item -Recurse -Force" all slip past it). The denylist stays as an extra
// layer (defense-in-depth, same philosophy as mat-ai-os's core/mcp_approvals.py) —
// it's just no longer the only thing standing between a command and the real
// filesystem.
//
// SANDBOX_WORKSPACE_ROOT is scoped per user_id (SANDBOX_WORKSPACE_ROOT/{user_id}/)
// even though only one user exists today — this is the concrete lever for an eventual
// multi-user upgrade without rearchitecting.
const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE || 'mat-ai-sandbox:latest';
const SANDBOX_WORKSPACE_ROOT = process.env.SANDBOX_WORKSPACE_ROOT || path.join(os.homedir(), 'mat-ai-sandbox-workspaces');
const SANDBOX_TIMEOUT_MS = Number(process.env.SANDBOX_TIMEOUT_MS || 120_000);
const SANDBOX_MEMORY = process.env.SANDBOX_MEMORY || '512m';
const SANDBOX_CPUS = process.env.SANDBOX_CPUS || '1';
const DEFAULT_USER_ID = 'farez';

// Self-heal v2: prepare_repo_workspace clones/refreshes a local, offline copy of this
// path into the sandbox so the coding agent can propose and test a real fix against
// real source, without ever touching the real repo itself (git clone/fetch only reads
// it). No hardcoded fallback — a machine-specific path belongs in .env only, same
// convention as every other config value in this file.
const MAT_AI_OS_REPO_PATH = process.env.MAT_AI_OS_REPO_PATH;

// Blocked command patterns — checked as a case-insensitive substring/regex match
// against the raw command string before it ever reaches a shell. Applied BEFORE the
// command ever reaches Docker (a command blocked here never even gets a container).
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
      'Run a shell command inside an isolated Docker sandbox (a per-user scoped workspace directory, no network access, git/node/npm/python/pip/pytest available — see docker/sandbox.Dockerfile). Destructive commands are still refused: rmdir /s, del /f /s, format, shutdown, rm -rf.',
    // user_id isn't part of this schema (it's not something the LLM should choose —
    // mat-ai-os's own call construction supplies it), but the runtime args object may
    // still carry one; callTool() reads args.user_id if present.
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
  {
    name: 'prepare_repo_workspace',
    description:
      "Clone-or-refresh a local, offline copy of the mat-ai-os source repo into this user's " +
      'sandbox workspace (appears as /workspace/mat-ai-os to execute_terminal_command). Safe: ' +
      'only ever reads the real repo (git clone/fetch, never push), and only writes into the ' +
      'disposable sandbox workspace.',
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

async function executeTerminalCommand(command: string, userId: string = DEFAULT_USER_ID): Promise<string> {
  if (isBlockedCommand(command)) {
    throw new Error(`Blocked: "${command}" matches a destructive-command pattern and was refused.`);
  }

  const workspace = path.join(SANDBOX_WORKSPACE_ROOT, userId);
  await mkdir(workspace, { recursive: true });

  // --network none: no network access at all in v1 (npm install/pip install/git
  // clone won't work inside the sandbox yet — a known, documented limitation, not a
  // silent gap; commands operating on code already on disk, e.g. git status, pytest,
  // npm test, work fine). "docker" itself is deliberately not in the sandbox's own
  // toolchain (see docker/sandbox.Dockerfile) — a sandboxed command must never be
  // able to invoke docker, which would allow mounting the Docker socket and escaping
  // the sandbox entirely.
  const dockerArgs = [
    'run',
    '--rm',
    '--network',
    'none',
    '--memory',
    SANDBOX_MEMORY,
    '--cpus',
    SANDBOX_CPUS,
    '-v',
    `${workspace}:/workspace`,
    '-w',
    '/workspace',
    SANDBOX_IMAGE,
    'sh',
    '-c',
    command,
  ];

  // execFile (argv array), not exec (shell string) — command reaches the container's
  // "sh -c" as a single argv element, no manual shell-quoting of an arbitrary user
  // command needed (and no risk of getting that quoting subtly wrong).
  return new Promise((resolve, reject) => {
    execFile('docker', dockerArgs, { timeout: SANDBOX_TIMEOUT_MS }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout || stderr || 'Command executed with no output.');
    });
  });
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function prepareRepoWorkspace(userId: string = DEFAULT_USER_ID): Promise<string> {
  if (!MAT_AI_OS_REPO_PATH) {
    throw new Error('MAT_AI_OS_REPO_PATH is not configured (set it in .env).');
  }

  const workspace = path.join(SANDBOX_WORKSPACE_ROOT, userId);
  await mkdir(workspace, { recursive: true });
  const target = path.join(workspace, 'mat-ai-os');

  const alreadyCloned = await pathExists(path.join(target, '.git'));
  if (!alreadyCloned) {
    // --no-hardlinks is NOT optional — a hardlinked local clone would make an "edit"
    // inside the sandbox mutate the SAME bytes as the real host source file, silently
    // defeating the entire point of a disposable sandbox. Costs a full object copy
    // instead of a hardlink; fine for a repo this size.
    await execFileAsync('git', ['clone', '--local', '--no-hardlinks', MAT_AI_OS_REPO_PATH, target], {
      timeout: SANDBOX_TIMEOUT_MS,
    });
    return 'Cloned a fresh copy of mat-ai-os into the sandbox (/workspace/mat-ai-os).';
  }

  // Refresh: only ever pulls in the real repo's currently-COMMITTED state (git fetch
  // never sees the host's uncommitted working-tree edits) — origin is
  // MAT_AI_OS_REPO_PATH from the initial --local clone above.
  await execFileAsync('git', ['-C', target, 'fetch', 'origin'], { timeout: SANDBOX_TIMEOUT_MS });
  await execFileAsync('git', ['-C', target, 'reset', '--hard', 'FETCH_HEAD'], { timeout: SANDBOX_TIMEOUT_MS });
  return "Refreshed the sandboxed copy of mat-ai-os to match the real repo's current commit.";
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'open_application':
      return { message: await openApplication(String(args.name ?? '')) };

    case 'execute_terminal_command': {
      const userId = typeof args.user_id === 'string' && args.user_id ? args.user_id : DEFAULT_USER_ID;
      return { output: await executeTerminalCommand(String(args.command ?? ''), userId) };
    }

    case 'get_clipboard':
      return { text: await clipboard.read() };

    case 'set_clipboard':
      await clipboard.write(String(args.text ?? ''));
      return { status: 'ok' };

    case 'take_screenshot': {
      const buffer = await takeScreenshot();
      return { image_base64: buffer.toString('base64'), format: 'png' };
    }

    case 'prepare_repo_workspace': {
      const userId = typeof args.user_id === 'string' && args.user_id ? args.user_id : DEFAULT_USER_ID;
      return { message: await prepareRepoWorkspace(userId) };
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
  console.log(
    '   Tools: open_application, execute_terminal_command, get_clipboard, set_clipboard, take_screenshot, prepare_repo_workspace',
  );
});
