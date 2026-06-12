// D:\MAT_ai_mk1\electron\ipc\ai.ipc.ts
import { ipcMain } from 'electron'
import { matAiRouter, MatAiMode } from '@core/router/router' 
import { transcribeAudioBuffer } from '../../core/voice/speechToText';
import { getHistory } from '@core/services/db.service_old'
import { speakText } from '../../core/voice/textToSpeech';

function toUint8Array(payload: unknown): Uint8Array | null {
  if (payload instanceof Uint8Array) return payload
  if (payload instanceof ArrayBuffer) return new Uint8Array(payload)
  if (ArrayBuffer.isView(payload)) {
    return new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
  }
  return null
}

// Fungsi helper semak API Key secara direct sebab fail lama dah padam
function isWhisperVoiceConfigured(): boolean {
  return Boolean(process.env['OPENAI_API_KEY']?.trim())
}


export function registerAiIpc(): void {
  // 🎙️ Handle Keupayaan Suara Whisper
  console.log("🔥 MAT.AI BACKEND: Fungsi registerAiIpc() BERJAYA DIJALANKAN!");
  
  ipcMain.handle('mat-ai:voice-capabilities', (): { whisper: boolean } => ({
    whisper: isWhisperVoiceConfigured(),
  }))

  // 📝 Handle Transkripsi Suara ke Teks
  ipcMain.handle(
    'mat-ai:transcribe',
    async (_event, payload: unknown): Promise<{ ok: true; text: string } | { ok: false; error: string }> => {
      const bytes = toUint8Array(payload)
      if (!bytes) return { ok: false, error: 'Invalid audio payload.' }
      
      try {
        // 🔥 DAUT SINI MAT: Tukar bytes (Uint8Array) jadi Buffer untuk fail baru kita
        const audioBuffer = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        const text = await transcribeAudioBuffer(audioBuffer)
        
        // Kalau fungsi pulangkan teks ralat dari try-catch dalam speechToText
        if (text.startsWith('[RALAT SUARA]:')) {
          return { ok: false, error: text }
        }

        return { ok: true, text }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    },
  )


  // 💬 Handle Sistem Sembang & Core Router AI Utama (Fast/Brain Hybrid)
  ipcMain.handle(
  'mat-ai:chat',
  async (
    _event, 
    // 🎯 1. KEMAS KINI: Terima 'attachment' sekali dari frontend dalam destructuring
    { userText, uiSelection, inputMode, localModelName = 'llama3.1:8b', attachment }: 
    { userText: string; uiSelection: MatAiMode; inputMode?: 'text' | 'voice' | 'image'; localModelName?: string; attachment?: any }
  ): Promise<{ ok: true; text: string; shouldSpeak?: boolean } | { ok: false; error: string }> => {
    
    const trimmed = typeof userText === 'string' ? userText.trim() : ''
    
    // 🎯 2. KEMAS KINI: Kalau teks kosong TAPI ada attachment gambar, jangan sekat! Bagi lepas.
    if (!trimmed && !attachment) {
      return { ok: false, error: 'Mesej kosong, Boss.' }
    }

    try {
      // Maklumkan dekat terminal status attachment sekali
      console.log(`📥 [IPC AI]: Mesej Masuk -> Mod: ${uiSelection} | Model: ${localModelName} | Input: ${inputMode} | Attachment: ${attachment ? attachment.name : 'Tiada'}`);

      // 🎯 3. KEMAS KINI ROUTER: Pass 'attachment' sebagai parameter ke-5 masuk ke router utama!
      // Nota: Kita hantar 'trimmed' (teks) ATAU string kosong kalau user cuma hantar gambar sahaja.
      const ayatPenuhAI = await matAiRouter(trimmed, uiSelection, _event, localModelName, attachment)

      // Tentukan sama ada MAT.ai perlu balas guna suara
      const shouldSpeak = inputMode === 'voice'

      // 👑 KUNCI UTAMA KAU KAT SINI MAT:
      if (shouldSpeak) {
        console.log("🎙️ [VOICE DETECTED]: Input dari suara. Memicu enjin Kokoro lokal...");
        // Jalankan fungsi speakText secara 'floating' (tak payah await supaya stream teks kat UI tak sangkut/lag)
        void speakText(ayatPenuhAI);
      } else {
        console.log("⌨️ [TEXT DETECTED]: User menaip/hantar gambar. Menyekat suara robot, Puck diam.");
      }

      return { 
        ok: true, 
        text: ayatPenuhAI, 
        shouldSpeak 
      }

    } catch (err) {
      const ralatSebenar = err instanceof Error ? err.message : String(err);
      console.error("❌ [MAIN PROCESS CRASH]:", err);
      return { ok: false, error: `Otak MAT.ai Sangkut: ${ralatSebenar}` };
    }
  },
)

  // 📜 Handle Sejarah Chat Database
  ipcMain.handle(
    'mat-ai:get-history',
    async (_event, limit = 15): Promise<{ ok: true; history: Array<{ role: 'user' | 'assistant'; content: string }>} | { ok: false; error: string }> => {
      try {
        const rows = await getHistory(limit)
        const safeRows = Array.isArray(rows) ? rows : []
        return {
          ok: true,
          history: safeRows.map((row: any) => ({ role: row.role, content: row.content })),
        }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    },
  )
}