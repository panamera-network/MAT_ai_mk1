// core/models/cloud/openai.ts
import { speakText } from '../../voice/textToSpeech'; // 🎯 Import pintu suara Kokoro mat!

export async function completeOpenAIFast(
  userText: string,
  systemInstruction: string,
  _event: any,
  attachment?: { type: 'image'; name: string; url: string }
): Promise<string> {
  
  // 1. Bina susunan mesej asas (Mesej Sistem dari Router + Memori)
  const messages: any[] = [
    { role: 'system', content: systemInstruction }
  ];

  // 2. Formatkan Mesej User ikut keadaan (Ada gambar vs Tiada gambar)
  if (attachment && attachment.type === 'image') {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userText || "Sila baca dan perhati gambar ini." },
        {
          type: 'image_url',
          image_url: {
            url: attachment.url // Base64 URI penuh
          }
        }
      ]
    });
  } else {
    messages.push({ role: 'user', content: userText });
  }
  
  let fullResponse = ""; // 🎯 Kunci utama untuk simpan jawapan penuh AI mat!

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env['OPENAI_API_KEY']}`
      },
      body: JSON.stringify({
        model: process.env['OPENAI_MODEL']?.trim() || 'gpt-4o-mini',
        messages: messages, // 🎯 Guna 'messages' yang dah siap digabung dengan memori tadi!
        stream: true 
      })
    });

    if (!response.ok) throw new Error(`OpenAI Error: ${response.statusText}`);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split('\n');

      for (const line of lines) {
        const bersih = line.trim();
        if (!bersih || bersih === 'data: [DONE]') continue;

        if (bersih.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(bersih.slice(6));
            const perkataan = parsed.choices[0]?.delta?.content || '';
            if (perkataan) {
              fullResponse += perkataan; // 🎯 Kumpul perkataan live masuk sini mat!
              _event.sender.send('mat-ai:stream-chunk', perkataan);
            }
          } catch (e) {}
        }
      }
    }

    // 🎙️ SEBUT JAWAPAN SELEPAS STREAM SELESAI (KOD SUCI MAT)
    if (fullResponse && fullResponse.length < 250) { 
      // Tapis teks dari markdown & emoji biar Puck tak pening
      const cleanSpeechText = fullResponse
        .replace(/\*\*|\*|_|#/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F200}-\u{1F2FF}]/gu, '');

      console.log(`🗣️ [OPENAI SUCCESS]: Menembak ayat penuh ke Kokoro -> "${cleanSpeechText}"`);
      speakText(cleanSpeechText); // <--- ZASSS panggil suara si Puck!
    }

    return fullResponse; // 🎯 Pulangkan respon penuh ke router!

  } catch (error) {
    console.error("Gagal panggil OpenAI Sembang:", error);
    return "Alamak BOSS, OpenAI Cloud sembang ada error.";
  }
}

// Ini fungsi asal kau yang ada internet/Tavily tu (untuk KODING/BERAT)
export async function completeChat(_userText: string): Promise<string> {
  return "Hasil heavy task kau...";
}