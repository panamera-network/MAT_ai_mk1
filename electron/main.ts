// electron/main.ts
import { app, BrowserWindow, session, systemPreferences, ipcMain } from 'electron'
import path from 'node:path'
import dotenv from 'dotenv'
import { spawn, exec } from 'child_process';
import fs from 'fs';
import http from 'http';

// Import kuli suara kita yang kita betulkan tadi mat!
import { janaSuaraMatAi, mainkanAudioLokal } from '../core/voice/textToSpeech';
import { startLocalWakeupWord, stopLocalWakeupWord } from './kwsService';

// Load .env dari root folder aplikasi
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Import kuli-kuli tingkap dan IPC kita
import { createWindow } from './window/createWindow'
import { registerAiIpc } from './ipc/ai.ipc'
import { registerSystemIpc } from './ipc/system.ipc'

function registerMatAiSessionPermissions(): void {
  const ses = session.defaultSession
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true)
      return
    }
    callback(false)
  })
}

async function ensureMicrophoneAccessIfNeeded(): Promise<void> {
  if (process.platform !== 'darwin') return
  try {
    const status = systemPreferences.getMediaAccessStatus('microphone')
    if (status === 'not-determined') {
      await systemPreferences.askForMediaAccess('microphone')
    }
  } catch {
    // Non-fatal
  }
}

// 🎯 KITA BUKA LUBANG PORT 3000 UTK PYTHON KETUK PINTU MAT!
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/wakeup') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      console.log("🚀🎉 [ELECTRON RECV]: PYTHON KETUK PINTU! Tuan panggil Mat AI!");
      
      // Kejutkan frontend Electron kau mat!
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('mat-ai:wakeup-triggered');
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Telinga lintah diterima mat!' }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Jalankan listener port 3000 kat PC kau
server.listen(3000, '127.0.0.1', () => {
  console.log("📡 [ELECTRON NET]: Jambatan HTTP port 3000 sedia menunggu isyarat Python...");
});

let pythonProcess: any = null; // Simpan rujukan proses Python untuk kawalan masa depan

function startKokoroVoiceServer() {
  const projectRoot = process.cwd(); 
  const pythonExecutable = path.join(projectRoot, 'core', 'voice', 'kokoro-backend', '.venv', 'Scripts', 'python.exe');
  const scriptPath = path.join(projectRoot, 'core', 'voice', 'kokoro-backend', 'api_server.py');

  console.log(`🚀 [MAT.AI LAUNCHER]: Menyemak enjin suara di: ${scriptPath}`);

  if (!fs.existsSync(pythonExecutable)) {
    console.error('❌ [LAUNCHER ERROR]: Fail python.exe dalam venv tak jumpa mat! Jgn risau, check path betul-betul.');
    return;
  }

  console.log('🔥 [MAT.AI LAUNCHER]: Menghidupkan enjin suara Kokoro secara senyap...');

  // Tembak run secara rahsia di belakang tabir!
  pythonProcess = spawn(pythonExecutable, [scriptPath], {
    cwd: path.dirname(scriptPath), // Pastikan Python sedar dia run dlm folder dia sendiri
    env: { 
      ...process.env, 
      PYTHONIOENCODING: 'utf-8' // 🎯 KUNCI UTAMA: Paksa Python outputkan UTF-8!
    }
  });

  pythonProcess.stdout.on('data', (data: any) => {
    console.log(`🐍 [PYTHON LOG]: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on('data', (data: any) => {
    console.error(`⚠️ [PYTHON WARN/LOG]: ${data.toString().trim()}`);
  });
}

// =====================================================================
// 🔌 INTERFACE BARU: JAMBATAN IPC MULUT MAT.AI (DARI FRONTEND/CORE)
// =====================================================================
ipcMain.handle('mat-ai:cakap', async (_event, teksJawapan: string) => {
  console.log(`🤖 [ELECTRON MAIN]: Dapat arahan sebut -> "${teksJawapan}"`);
  try {
    // 1. Tembak teks ke modul core TTS kita (Kokoro Lokal / ElevenLabs ikut .env)
    const pathAudioWav = await janaSuaraMatAi(teksJawapan);
    
    if (pathAudioWav) {
      // 2. Bunyikan terus dekat speaker PC!
      mainkanAudioLokal(pathAudioWav);
      return { success: true };
    }
    return { success: false, error: "Gagal jana fail audio wav." };
  } catch (error: any) {
    console.error(`❌ [IPC CAKAP ERROR]: ${error.message}`);
    return { success: false, error: error.message };
  }
});

// 🚀 INIT UTAMA ELECTRON
void app.whenReady().then(async () => {
  await ensureMicrophoneAccessIfNeeded()
  registerMatAiSessionPermissions()
  startKokoroVoiceServer(); // Hidupkan server suara sebelum buat window
  
  // Pasang semua jambatan IPC ke frontend!
  registerAiIpc()
  registerSystemIpc()
  
  createWindow()

  setTimeout(() => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      console.log("🔥 [MAIN BOOT]: Mengejutkan telinga lintah KWS buat kali pertama...");
      startLocalWakeupWord(mainWindow);
    }
  }, 1500);
})

ipcMain.on('mat-ai:start-kws', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    startLocalWakeupWord(mainWindow);
  } else {
    console.warn("⚠️ [MAIN]: Gagal start KWS sebab mainWindow belum wujud mat!");
  }
});

ipcMain.on('mat-ai:stop-kws', () => {
  stopLocalWakeupWord();
});

ipcMain.on('mat-ai:wakeup-triggered', () => {
  console.log("🤖 [MAIN LOOP]: Mat AI tengah layan arahan kau... Telinga lintah rehat kejap.");

  setTimeout(() => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      console.log("♻️ [MAIN LOOP]: Menghidupkan semula telinga lintah KWS secara automatik...");
      startLocalWakeupWord(mainWindow);
    }
  }, 5000); // Rehat 5 saat
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 🛑 AMBIL TINDAKAN DRSTIK BILA KELUAR APP
app.on('will-quit', () => {
  try {
    stopLocalWakeupWord();
  } catch (e) {}

  // 🐍 Bunuh server Kokoro dlm Windows/OS dengan bersih tanpa tinggalkan hantu background
  if (pythonProcess) {
    console.log('🛑 [MAT.AI LAUNCHER]: Mematikan enjin suara Kokoro...');
    if (process.platform === 'win32') {
      // Paksa pancung task tree dlm Windows supaya .venv python mati total!
      exec(`taskkill /pid ${pythonProcess.pid} /f /t`);
    } else {
      pythonProcess.kill('SIGTERM');
    }
  }
});