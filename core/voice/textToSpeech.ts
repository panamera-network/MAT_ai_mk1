// core/voice/textToSpeech.ts
import os from 'os';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
// Nota: Pastikan kau dah npm install dotenv httpx / axios dlm root koding kau mat
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const PANGKAL_PROJEK = path.resolve(__dirname, '../..');
const FOLDER_AUDIO_TEMP = path.join(PANGKAL_PROJEK, 'data', 'audio_temp');

// 🎯 Pastikan folder simpanan audio sementara wujud, kalau takde kita auto-buat
if (!fs.existsSync(FOLDER_AUDIO_TEMP)) {
  fs.mkdirSync(FOLDER_AUDIO_TEMP, { recursive: true });
}

/**
 * 🌉 FUNGSI JAMBATAN (BRIDGE): Untuk selesaikan ralat Build dlm ai.ipc.ts dan openai.ts
 * Fungsi ini akan jana suara dan terus mainkan ke speaker secara automatik!
 */
export async function speakText(text: string): Promise<string | null> {
  console.log(`🔗 [TTS BRIDGE]: Menghubungkan fungsi speakText -> janaSuaraMatAi`);
  
  // 1. Jana fail .wav dlm folder temp
  const pathAudioWav = await janaSuaraMatAi(text);
  
  // 2. Kalau fail wujud, terus paksa speaker OS berbunyi mat!
  if (pathAudioWav && fs.existsSync(pathAudioWav)) {
    mainkanAudioLokal(pathAudioWav);
  }
  
  return pathAudioWav;
}

/**
 * 🔊 FUNGSI UTAMA: Menukarkan teks jawapan MAT.ai menjadi suara (.wav)
 * mengikut pembekal (KOKORO lokal atau ELEVENLABS cloud) dlm .env
 */
export async function janaSuaraMatAi(teks: string): Promise<string | null> {
  // Baca suis pembekal suara dari .env. Default kita pakai Kokoro lokal sbb free!
  const provider = (process.env.TTS_PROVIDER || 'KOKORO').toUpperCase();
  const namaFail = `tts_${Date.now()}.wav`;
  const pathFailOutput = path.join(FOLDER_AUDIO_TEMP, namaFail);

  console.log(`🔊 [CORE Node.js]: Menjana suara menggunakan enjin: ${provider}`);

  try {
    if (provider === 'ELEVENLABS') {
      // 🟣 ENJIN SIMPANAN: CLOUD ELEVENLABS (PLUG-AND-PLAY SLOT)
      const apiKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel default
      
      if (!apiKey) {
        console.log("⚠️ [TTS WARN]: ELEVENLABS_API_KEY tak jumpa mat! Auto-fallback ke Kokoro Lokal.");
        return await janaSuaraGunaKokoroLokal(teks, pathFailOutput);
      }

      return await janaSuaraGunaElevenLabs(teks, pathFailOutput, apiKey, voiceId);

    } else {
      // 🔵 ENJIN UTAMA (DEFAULT): KOKORO 82M LOKAL
      return await janaSuaraGunaKokoroLokal(teks, pathFailOutput);
    }
  } catch (err: any) {
    console.error(`❌ [TTS GLOBAL ERROR]: Gagal proses suara mat: ${err.message}`);
    return null;
  }
}

/**
 * 🔵 SUB-ENJIN 1: Tembak ke Server FastAPI Kokoro Lokal (Port 8880)
 */
async function janaSuaraGunaKokoroLokal(teks: string, pathOutput: string): Promise<string | null> {
  const urlKokoro = 'http://127.0.0.1:8880/v1/audio/speech';
  
  try {
    // Guna native fetch dlm Node.js v18+ (Tak payah install axios pun lepas mat)
    const response = await fetch(urlKokoro, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: teks,
        voice: process.env.KOKORO_VOICE_NAME || 'am_puck', // Suara kacak puck
        speed: 1.0
      })
    });

    if (!response.ok) {
      throw new Error(`Server Kokoro pulangkan status: ${response.status}`);
    }

    // Tukar response jadi buffer dan tulis jadi fail .wav dlm PC
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(pathOutput, buffer);
    
    console.log(`✅ [TTS KOKORO]: Fail audio suci berjaya disimpan -> ${pathOutput}`);
    return pathOutput;

  } catch (error: any) {
    console.error(`❌ [TTS KOKORO ERROR]: Server lokal mati ke mat? Detail: ${error.message}`);
    return null;
  }
}

/**
 * 🟣 SUB-ENJIN 2: Tembak ke ElevenLabs API Cloud (Jika bajet tebal)
 */
async function janaSuaraGunaElevenLabs(teks: string, pathOutput: string, apiKey: string, voiceId: string): Promise<string | null> {
  const urlEleven = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
  try {
    const response = await fetch(urlEleven, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: teks,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs pulangkan status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(pathOutput, buffer);
    
    console.log(`🔥 [TTS ELEVENLABS]: Audio gred Hollywood disedut -> ${pathOutput}`);
    return pathOutput;

  } catch (error: any) {
    console.error(`❌ [TTS ELEVENLABS ERROR]: Gagal rembat data cloud: ${error.message}`);
    return null;
  }
}

/**
 * 🎵 FUNGSI BONUS: Mainkan audio secara native ikut OS PC mat (Windows/Linux)
 * Supaya Electron kau tak payah pening kepala load HTML5 Player
 */
export function mainkanAudioLokal(pathAudio: string): void {
  if (!fs.existsSync(pathAudio)) return;

  const platform = os.platform();
  let arahanCli = '';

  if (platform === 'win32') {
    // Windows: Guna PowerShell untuk main audio senyap dlm background
    arahanCli = `powershell -c "(New-Object Media.SoundPlayer '${pathAudio}').PlaySync()"`;
  } else if (platform === 'darwin') {
    // Mac
    arahanCli = `afplay "${pathAudio}"`;
  } else {
    // Linux
    arahanCli = `aplay "${pathAudio}"`;
  }

  exec(arahanCli, (err) => {
    if (err) console.error(`❌ [AUDIO PLAYER ERROR]: Gagal bunyikan speaker OS: ${err.message}`);
    
    // Selesai main, kita auto-padam fail temp tu mat supaya hardisk tak penuh!
    try {
      fs.unlinkSync(pathAudio);
    } catch (e) {}
  });
}