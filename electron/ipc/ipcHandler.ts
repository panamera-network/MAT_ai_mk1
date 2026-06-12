// D:\MAT_ai_mk1\electron\ipc\ipcHandler.ts
import { registerAiIpc } from './ai.ipc'
import { registerSystemIpc } from './system.ipc'

export function setupIpcHandlers(): void {
  console.log('🔌 [ELECTRON MAIN]: Memasang semua kabel sambungan IPC (Modular)...')
  
  registerAiIpc()     // Hidupkan sistem Sembang, Whisper, Router, DB History
  registerSystemIpc() // Hidupkan sistem kawalan OS (Buka VSCode, Chrome, Calc dll)
  
  // registerToolsIpc() // Buka komen ini nanti bila tools.ipc.ts dah diisi daging
}