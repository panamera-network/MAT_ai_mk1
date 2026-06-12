//system.ipc.ts

import { ipcMain, dialog } from 'electron'
import { exec } from 'node:child_process'
import * as fs from 'node:fs';
import * as path from 'node:path';

function executeCommand(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let command: string

    switch (action) {
      case 'open_vscode':
        command = 'code .'
        break
      case 'open_browser':
        command = 'start chrome'
        break
      case 'calculator':
        command = 'calc'
        break
      case 'open_youtube':
        command = 'start https://www.youtube.com'
        break
      default:
        reject(new Error(`Unknown action: ${action}`))
        return
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout || stderr || `Command "${action}" executed successfully`)
    })
  })
}

export function registerSystemIpc(): void {
  ipcMain.handle(
    'mat-ai:execute-command',
    async (_event, action: string): Promise<{ ok: true; message: string } | { ok: false; error: string }> => {
      try {
        const message = await executeCommand(action)
        return { ok: true, message }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    },
  )
}

ipcMain.handle('mat-ai:select-file', async () => {
  console.log("🎯 MAT.AI BACKEND: Channel 'mat-ai:select-file' BERJAYA DIKETUK!");
    try {
      const result = await dialog.showOpenDialog({
        title: 'Pilih gambar atau fail untuk MAT.ai',
        properties: ['openFile'],
        filters: [
          { name: 'Semua Fail', extensions: ['png', 'jpg', 'jpeg', 'txt', 'pdf', 'md', 'json'] },
          { name: 'Gambar', extensions: ['png', 'jpg', 'jpeg'] },
          { name: 'Dokumen teks', extensions: ['txt', 'md', 'json'] }
        ]
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { ok: false, reason: 'user_cancelled' };
      }

      const filePath = result.filePaths[0];
      const fileName = path.basename(filePath!); 
      const ext = path.extname(filePath!).toLowerCase();

      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const fileBuffer = fs.readFileSync(filePath!);
        const base64Data = fileBuffer.toString('base64');
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        
        return {
          ok: true,
          type: 'image',
          path: filePath,
          name: fileName,
          data: `data:${mimeType};base64,${base64Data}`
        };
      }

      if (['.txt', '.md', '.json'].includes(ext)) {
        const content = fs.readFileSync(filePath!, 'utf-8');
        return {
          ok: true,
          type: 'text_file',
          path: filePath,
          name: fileName,
          content: content
        };
      }

      return {
        ok: true,
        type: 'other',
        path: filePath,
        name: fileName
      };

    } catch (error: any) {
      console.error('Gagal buka file dialog:', error);
      return { ok: false, error: error.message };
    }
  });