// core/router/router.ts
import * as fs from 'fs';
import * as path from 'path';
import { callOllamaStream } from '../models/local/localManager';
import { completeOpenAIFast } from '../models/cloud/openai';
import { shortTermMemory } from '../memory/shortTerm';
import { getSystemPromptWithStyle } from '../soul/responseStyle';
import { runAgentAutonomousLoop } from '../agent/agentloop';
// ❌ PADAM / BUANG IMPORT MEMORI LAMA NI MAT:
// import { getLongTermMemory } from '../memory/memoryManager';

export type MatAiMode = 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN';

/**
 * 🛠️ CONTEXT MANAGER: SISTEM CELIK MASA
 * Supaya AI sentiasa tahu hari, tarikh, dan waktu sesi terkini di Malaysia.
 */
function dapatkanKonteksMasa(): string {
  const sekarang = new Date();
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Kuala_Lumpur'
  };
  const masaString = sekarang.toLocaleDateString('ms-MY', options);

  const jam = sekarang.getHours();
  let waktuSesi = "Malam";
  if (jam >= 5 && jam < 12) waktuSesi = "Pagi";
  else if (jam >= 12 && jam < 17) waktuSesi = "Tengah Hari / Petang";
  else if (jam >= 17 && jam < 19) waktuSesi = "Petang (Hampir Maghrib)";

  return `[CONTEXT MANAGER: Sekarang hari ${masaString}. Sesi: ${waktuSesi}. Lokasi: Malaysia.]`;
}

export async function matAiRouter(
  userText: string, 
  uiSelection: MatAiMode, 
  _event: any,
  localModelName: string = 'llama3.1:8b',
  attachment?: { type: 'image'; name: string; url: string }
): Promise<string> {
  const sessionId = "default-user";

  const memoryText = attachment 
    ? `[User menghantar gambar: ${attachment.name}] ${userText}`.trim() 
    : userText;
  
  // Kekalkan shortTermMemory untuk ingatan sesi chat yang tengah aktif
  shortTermMemory.addMessage(sessionId, 'user', memoryText);

  let intent: 'SEMBANG' | 'KODING' | 'BERAT' = 'SEMBANG';
  let targetModelType: 'local' | 'cloud' = 'local';

  if (uiSelection === 'BRAIN') {
    intent = 'BERAT';
    targetModelType = 'cloud';
  } else if (uiSelection === 'FAST_CLOUD') {
    intent = 'SEMBANG';
    targetModelType = 'cloud';
  } else {
    intent = 'SEMBANG';
    targetModelType = 'local';
  }

  const dynamicSystemPrompt = getSystemPromptWithStyle({ intent, targetModelType });
  const konteksMasa = dapatkanKonteksMasa();

  // 🔥 PROMPT UTAMA GABUNGAN (Tanpa longTermMemory Node.js lama)
  const fullSystemInstruction = `
${dynamicSystemPrompt}

---
CURRENT TIME & LOCATION CONTEXT:
${konteksMasa}
  `.trim();

  console.log(`🚦 [MAT.AI ROUTER]: UI Selection = ${uiSelection} | Intent Style = ${intent} | Model = ${uiSelection === 'FAST_LOCAL' ? localModelName : 'Cloud'}`);

  let finalReply = "";

  switch (uiSelection) {
    case 'BRAIN':
    case 'FAST_CLOUD': // 🎯 MOD CLOUD: Hantar text + Prompt Utama ke Python untuk di-match dengan mem0!
      console.log(`🧠 [MOD ${uiSelection}]: Menghubungi Backend Python (OpenAI + Mem0)...`);
      try {
        const response = await fetch('http://127.0.0.1:8880/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: userText,
            system_prompt: fullSystemInstruction, // Seludup prompt agung Node.js ke Python
            user_id: "tuan_farez"
          })
        });

        if (!response.ok) {
          throw new Error(`Python API pulangkan status: ${response.status}`);
        }

        const data = await response.json() as { ok: boolean; text: string };
        finalReply = data.text;

      } catch (err: any) {
        console.error("❌ [ROUTER CLOUD ERROR]: Backend Python mati ke mat? Fallback ke fungsi lokal.", err);
        // Fallback kalau server Python crash/tutup mat:
        finalReply = await completeOpenAIFast(userText, fullSystemInstruction, _event, attachment);
      }
      break;

    case 'FAST_LOCAL':
      console.log(`⚡ [MOD FAST LOCAL]: Sembang offline via Ollama (${localModelName})...`);
      finalReply = await callOllamaStream(userText, fullSystemInstruction, localModelName, _event, attachment);
      break;
  }

  // Simpan respon bot dlm short term memory Node.js mat
  shortTermMemory.addMessage(sessionId, 'assistant', finalReply);

  return finalReply;
}