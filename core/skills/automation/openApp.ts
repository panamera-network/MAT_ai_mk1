// core/skills/automation/openApp.ts
import { exec } from 'child_process';

/**
 * Membuka aplikasi desktop berdasarkan nama atau kata kunci yang dihantar oleh AI.
 * @param appName Nama aplikasi (contoh: "chrome", "vs code", "notepad")
 */
export function skillOpenApplication(appName: string): Promise<string> {
  return new Promise((resolve) => {
    let target = appName.toLowerCase().trim();

    // Kamus pemetaan kata kunci kasual ke command eksekusi Windows sebenar
    const appMap: Record<string, string> = {
      'vs code': 'code',
      'vscode': 'code',
      'code': 'code',
      'chrome': 'start chrome',
      'google chrome': 'start chrome',
      'browser': 'start chrome',
      'notepad': 'notepad',
      'text editor': 'notepad',
      'kalkulator': 'calc',
      'calculator': 'calc',
      'calc': 'calc',
      'task manager': 'taskmgr',
      'cmd': 'start cmd'
    };

    // Guna command dari map, kalau tak jumpa, kita cuba jalankan direct apa yang AI hantar
    const finalCommand = appMap[target] || target;

    console.log(`🚀 [SKILL: OPEN_APP]: Mengeksekusi command -> "${finalCommand}"`);

    exec(finalCommand, (error) => {
      if (error) {
        console.error(`❌ [SKILL: OPEN_APP] Gagal:`, error.message);
        resolve(`[EXECUTION FAILED]: Gagal membuka ${appName}. Ralat sistem: ${error.message}`);
      } else {
        console.log(`✅ [SKILL: OPEN_APP] Berjaya dibuka.`);
        resolve(`[EXECUTION SUCCESS]: Berjaya membuka ${appName} pada sistem komputer.`);
      }
    });
  });
}