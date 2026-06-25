// electron/preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('matAi', {
  // 1. Fungsi untuk hantar mesej sembang (Menerima objek teks, selection mod & inputMode)
  chat: (payload: { userText: string; uiSelection: string; inputMode?: string; localModelName?: string; attachment?: any }) => 
    ipcRenderer.invoke('mat-ai:chat', payload),
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    // ... fungsi invoke sedia ada kau ...
  },

  // 2. Telinga Frontend: Dengar perkataan/huruf yang masuk live dari enjin AI
  onStreamChunk: (callback: (chunk: string) => void) => {
    const subscription = (_event: IpcRendererEvent, chunk: string) => callback(chunk);
    ipcRenderer.on('mat-ai:stream-chunk', subscription);
    
    // Pulangkan fungsi cleanup untuk elakkan memory leak kat frontend
    return () => {
      ipcRenderer.removeListener('mat-ai:stream-chunk', subscription);
    };
  },
  
  speak: (text: string) => ipcRenderer.invoke('mat-ai:cakap', text),

  // 3. Sesi sembang & status MAT-AI-OS backend
  newSession: () => ipcRenderer.invoke('mat-ai:new-session'),
  getOsStatus: () => ipcRenderer.invoke('mat-ai:os-status'),

  // 4. Utiliti Suara Whisper & Arahan Sistem
  checkVoiceCapabilities: () => ipcRenderer.invoke('mat-ai:voice-capabilities'),
  transcribeAudio: (audioBytes: Uint8Array) => ipcRenderer.invoke('mat-ai:transcribe', audioBytes),
  executeSystemCommand: (action: string) => ipcRenderer.invoke('mat-ai:execute-command', action)
});