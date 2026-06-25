// D:\MAT_ai_mk1\electron\ipc\ai.ipc.ts
import { ipcMain } from 'electron'
import { matAiRouter, MatAiMode } from '@core/router/router'
import { matOsClient } from '@core/os-client'
import { transcribeAudioBuffer } from '../../core/voice/speechToText';
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


  // 💬 Handle Sistem Sembang — semua AI calls pergi ke MAT-AI-OS (POST /task or /task/upload)
  ipcMain.handle(
  'mat-ai:chat',
  async (
    _event,
    { userText, uiSelection, inputMode, localModelName, attachment }:
    { userText: string; uiSelection: MatAiMode; inputMode?: 'text' | 'voice' | 'image'; localModelName?: string; attachment?: any }
  ): Promise<{ ok: true; text: string; shouldSpeak?: boolean } | { ok: false; error: string }> => {

    const trimmed = typeof userText === 'string' ? userText.trim() : ''

    if (!trimmed && !attachment) {
      return { ok: false, error: 'Mesej kosong, Boss.' }
    }

    console.log(`📥 [IPC AI]: Mesej Masuk -> Mod: ${uiSelection} | Input: ${inputMode} | Attachment: ${attachment ? attachment.name : 'Tiada'}`);

    const result = await matAiRouter(trimmed, uiSelection, _event, localModelName, attachment)

    if (!result.ok) {
      console.error("❌ [MAT-AI-OS]:", result.error);
      return { ok: false, error: result.error }
    }

    const shouldSpeak = inputMode === 'voice'
    if (shouldSpeak) {
      console.log("🎙️ [VOICE DETECTED]: Input dari suara. Memicu enjin Kokoro lokal...");
      void speakText(result.text);
    }

    return { ok: true, text: result.text, shouldSpeak }
  },
)

  // 🆕 Mula sesi sembang baru (reset session_id supaya MAT-AI-OS tak bawa konteks lama)
  ipcMain.handle('mat-ai:new-session', (): { sessionId: string } => {
    return { sessionId: matOsClient.newSession() }
  })

  // 📡 Semak status MAT-AI-OS backend (GET /health)
  ipcMain.handle('mat-ai:os-status', async () => {
    return matOsClient.getStatus()
  })
}