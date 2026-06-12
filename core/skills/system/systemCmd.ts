// core/skills/system/systemCmd.ts
import { exec } from 'child_process';

/**
 * Menjalankan arahan command terminal (CMD/PowerShell) asas yang selamat.
 * @param command Teks command yang ingin dijalankan (contoh: "ipconfig", "dir")
 */
export function skillExecuteCommand(command: string): Promise<string> {
  return new Promise((resolve) => {
    const rawCmd = command.trim();
    
    // 🛡️ Tapis command berbahaya demi keselamatan PC kau (Basic Sanitization)
    const blacklistedCmds = ['rmdir /s', 'del /f', 'format', 'shutdown', 'mkfs'];
    const isDangerous = blacklistedCmds.some(bad => rawCmd.toLowerCase().includes(bad));

    if (isDangerous) {
      console.warn(`🚨 [SKILL: SYSTEM_CMD] Menghalang command berbahaya: "${rawCmd}"`);
      resolve(`[EXECUTION BLOCKED]: MAT.ai menghalang command ini atas faktor keselamatan PC Boss.`);
      return;
    }

    console.log(`⚡ [SKILL: SYSTEM_CMD]: Menjalankan terminal command -> "${rawCmd}"`);

    exec(rawCmd, (error, stdout, stderr) => {
      if (error) {
        resolve(`[EXECUTION ERROR]: Command gagal dijalankan. Ralat: ${error.message}`);
        return;
      }
      
      // Ambil output terminal (hadkan panjang teks supaya tak banjir dalam token AI)
      const output = stdout || stderr || '[SUCCESS]: Command selesai tanpa sebarang output teks.';
      resolve(`[TERMINAL OUTPUT]:\n${output.substring(0, 1500)}`);
    });
  });
}