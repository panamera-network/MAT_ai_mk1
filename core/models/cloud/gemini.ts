// core/models/cloud/gemini.ts
import { dbService } from '@core/services/db.service_old'
import { searchInternet } from '@core/services/searchService_old'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CORE_SYSTEM_PROMPT, SAFETY_LAYER_PROMPT, SEARCH_ENGINE_PROMPT } from '@core/soul/prompts'

// --- CONFIG GEMINI ---
function getGeminiApiKey(): string | undefined {
  return process.env['GEMINI_API_KEY']?.trim() || undefined
}

// =========================================================================
// 🧠 GEMINI CLOUD ENGINE
// =========================================================================
export async function completeChatgemini(userText: string): Promise<string> {
  const lowerText = userText.toLowerCase()
  
  // 1. Simpan mesej pengguna ke NeDB database
  try { dbService.saveMessage('user', userText) } catch (e) {}

  // 2. Cek Internet (Tavily)
  const sembangKosong = ['hai', 'hello', 'assalamualaikum', 'kau siapa', 'siapa nama kau', 'panggil kau apa']
  const adakahSembangKosong = sembangKosong.some(perkataan => lowerText === perkataan || lowerText.startsWith(perkataan))
  const perlukanInternet = !adakahSembangKosong

  let systemPromptLengkap = `${CORE_SYSTEM_PROMPT}\n${SAFETY_LAYER_PROMPT}`

  if (perlukanInternet) {
    try {
      const hasilCarian = await searchInternet(userText)
      systemPromptLengkap += `\n${SEARCH_ENGINE_PROMPT(hasilCarian)}`
    } catch (e) {}
  }

  // 3. Cek API Key Gemini
  const geminiKey = getGeminiApiKey()
  if (!geminiKey) {
    return 'Alamak BOSS, GEMINI_API_KEY tak ada dalam fail `.env` lah. Sila isi dulu!'
  }

  try {
    // 4. Setup Gemini SDK
    const ai = new GoogleGenerativeAI(geminiKey)
    const model = ai.getGenerativeModel({ model: 'models/gemini-1.5-pro' })

    console.log("[MAT.AI] Mengirim tugas ke Gemini Cloud...")

    // 5. Hantar ke Gemini dengan struktur kandungan yang betul
    const result = await model.generateContent({
      contents: [
        { role: 'system', parts: [{ text: systemPromptLengkap }] },
        { role: 'user', parts: [{ text: userText }] },
      ],
      generationConfig: {
        temperature: 0.7,
      }
    })

    const jawapanGemini = result.response.text()
    const jawapanDenganTag = `🧠 [GEMINI 1.5 PRO]:\n${jawapanGemini}`

    // 6. Simpan jawapan Gemini ke database
    try { dbService.saveMessage('assistant', jawapanDenganTag) } catch (e) {}

    return jawapanDenganTag

  } catch (error: any) {
    console.error("Gemini Engine Error:", error)
    return `[System] Gemini kantoi error pulak BOSS! Pesanan: ${error.message}`
  }
}