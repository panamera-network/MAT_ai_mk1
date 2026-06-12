// core/models/local/localManager.ts
import { shortTermMemory } from '../../memory/shortTerm';

// 1. Senarai rasmi model lokal kau yang wujud dekat PC
export const AVAILABLE_LOCAL_MODELS = [
  'phi4:14b',
  'llama3.2-vision',
  'gemma4:26b',
  'gemma4:e4b',
  'llama3.1:8b',
  'qwen3:4b',
  'qwen3.5:4b',
  'phi4-mini:latest',
  'command-r7b:7b',
  'openchat:7b',
  'nous-hermes:7b'
];

// 2. Fungsi Induk Stream Ollama (Reusable)
export async function callOllamaStream(
  userText: string,
  systemInstruction: string,
  modelName: string,
  _event: any,
  attachment?: { type: 'image'; name: string; url: string } // 🎯 TAMBAH PARAMETER KE-5
): Promise<string> {
  const sessionId = "default-user";
  
  try {
    const chatHistory = shortTermMemory.getHistory(sessionId);
    
    // 1. Ambil semua sejarah lama KECUALI mesej terakhir yang baru dimasukkan oleh router tadi
    // Supaya kita boleh custom balik mesej terakhir tu dengan data gambar yang betul!
    const historyTanpaMesejTerakhir = chatHistory.slice(0, -1);
    const mesejTerakhirAsal = chatHistory[chatHistory.length - 1];

    // 2. Bina senarai mesej asas untuk disuap ke Ollama
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...historyTanpaMesejTerakhir.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // 3. Masukkan balik mesej terakhir user
    const userCurrentMessage = {
      role: 'user',
      content: mesejTerakhirAsal ? mesejTerakhirAsal.content : userText
    };

    // 4. 🎯 LOKASI KEBANGKITAN MAT.AI: Semburan base64 ke dalam mesej semasa!
    if (attachment && attachment.type === 'image' && attachment.url) {
      console.log(`📸 [OLLAMA VISION ACTIVATED]: Menyumbat fail gambar ${attachment.name} ke dalam payload...`);
      
      // Potong prefix data URI supaya tinggal base64 tulen mengikut selera Ollama
      const cleanBase64 = attachment.url.split(',')[1] || attachment.url;
      
      // Sumbat array images tepat pada objek mesej user yang paling baru
      (userCurrentMessage as any).images = [cleanBase64];

      // Kalau user hantar gambar kosong tanpa taip apa-apa teks
      if (!userCurrentMessage.content || !userCurrentMessage.content.trim()) {
        userCurrentMessage.content = "Sila lihat dan terangkan gambar yang saya lampirkan ini, Boss.";
      }
    }

    // Masukkan mesej semasa yang dah siap diubah suai ke dalam array utama
    formattedMessages.push(userCurrentMessage);

    // 5. SEKARANG BARU KITA JALANKAN FETCH OLLAMA MACAM BIASA
    const response = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages: formattedMessages, // Payload baru yang dah sah ada mata vision!
        stream: true,
        options: {
          temperature: 0.2,
          top_p: 0.5,
          num_predict: 256
        }
      })
    });

    // ... (Seterusnya kod `if (!response.ok) ...` ke bawah kekalkan yang asal kau mat)

    if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullReply = "";

    if (!reader) return `Alamak BOSS, tiada data response dari model ${modelName}.`;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const perkataan = parsed.message?.content || "";
          
          if (perkataan) {
            fullReply += perkataan;
            // 🚀 SALUR CHUNK REAL-TIME KE FRONTEND
            _event.sender.send('mat-ai:stream-chunk', perkataan);
          }
        } catch (e) {}
      }
    }

    // Simpan dalam short term memori
    shortTermMemory.addMessage(sessionId, 'assistant', fullReply);
    return fullReply;

  } catch (error) {
    console.error(`Gagal run model ${modelName}:`, error);
    const errText = `\n⚠️ [LOCAL MODEL ERROR]: Model *${modelName}* gagal bertindak balas. Pastikan Ollama app tengah run kat taskbar!`;
    _event.sender.send('mat-ai:stream-chunk', errText);
    return errText;
  }
}