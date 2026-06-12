// core/voice/speechToText.ts
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env untuk dapatkan OPENAI_API_KEY kau mat
dotenv.config({ path: path.join(process.cwd(), '.env') });

/**
 * 🎙️ [STT CORE]: Menukarkan buffer audio mentah dari frontend menjadi teks 
 * menggunakan OpenAI Whisper API (Lock Language: 'ms')
 */
export async function transcribeAudioBuffer(audioBuffer: Buffer): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("⚠️ [STT ERROR]: OPENAI_API_KEY tidak dijumpai dalam fail .env mat!");
  }

  // 1. Sediakan folder dan fail sementara untuk simpan audio mentah dlm bentuk .wav/.webm
  const tempFolder = path.join(process.cwd(), 'data', 'audio_temp');
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
  }

  const tempFilePath = path.join(tempFolder, `stt_${Date.now()}.wav`);
  fs.writeFileSync(tempFilePath, audioBuffer);

  console.log(`🎙️ [STT ENGINE]: Menembak fail audio ke Whisper API -> ${tempFilePath}`);

  try {
    // 2. Bina Form Data secara manual (Sesuai untuk native Fetch dlm Node.js v18+)
    const formData = new FormData();
    
    // Tukar file path jadi Blob untuk dihantar dlm request
    const fileBuffer = fs.readFileSync(tempFilePath);
    const audioBlob = new Blob([fileBuffer], { type: 'audio/wav' });
    
    formData.append('file', audioBlob, 'openai_whisper.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ms'); // 🔒 Kunci Bahasa Melayu ikut blueprint anti-halusinasi kau mat!

    // 3. Tembak ke OpenAI Cloud
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI Whisper Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const hasilTeks = data.text || '';

    console.log(`🎯 [STT SUCCESS]: Whisper dengar Boss cakap -> "${hasilTeks}"`);
    return hasilTeks;

  } catch (error: any) {
    console.error(`❌ [STT MASTER ERROR]: Gagal transkripsi suara: ${error.message}`);
    throw error;
  } finally {
    // 🧽 Bersihkan fail temporary tadi supaya tak semak hardisk PC kau
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (e) {}
  }
}