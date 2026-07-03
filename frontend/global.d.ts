// frontend/src/global.d.ts

// 🎯 TIPS: Sebab ada export {} kat bawah, modul luar kena letak dlm 'declare global' mat!

interface ChatResponse {
  ok: boolean;
  text?: string;
  shouldSpeak?: boolean;
  error?: string;
}

interface TranscribeResponse {
  ok: boolean;
  text?: string;
  error?: string;
}

interface CommandResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

interface OsStatusResponse {
  online: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

// 🎯 KUNCI HALAU HANTU: Masukkan declare module CSS ke dalam skop GLOBAL!
declare global {
  module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }

  // Cari skop tetingkap Window global dan suntik entiti electron kita
  interface Window {
    matAi: { 
      chat(payload: {
        userText: string;
        uiSelection: import('../core/router/router').MatAiMode; 
        inputMode?: 'text' | 'voice' | 'image';
        localModelName?: string;
        attachment?: any;
      }): Promise<ChatResponse>;

      onStreamChunk(callback: (chunk: string) => void): () => void;
      newSession(): Promise<{ sessionId: string }>;
      getOsStatus(): Promise<OsStatusResponse>;
      checkVoiceCapabilities(): Promise<{ whisper: boolean }>;
      transcribeAudio(audioBytes: Uint8Array): Promise<TranscribeResponse>;
      executeSystemCommand(action: string): Promise<CommandResponse>;
      
      // 🔊 SUNTIKAN BARU: Berikan kebenaran untuk frontend paksa MAT.ai membebel!
      speak(text: string): Promise<{ success: boolean; error?: string }>;
    };
  }

  interface ChatTurn {
    id: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
    inputMode?: 'text' | 'voice' | 'image';
    attachment?: {
      type: string;
      name: string;
      url: string;
    };
  }
}

// Kekalkan ini untuk bagitahu TS yang ini adalah fail deklarasi module
export {};