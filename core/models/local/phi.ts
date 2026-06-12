// core/models/local/phi.ts
import { shortTermMemory } from '../../memory/shortTerm';
import { callOllamaStream } from './localManager';
// 🎯 1. IMPORT PROMPT LOCK BAHASA DARI SOUL
import { CORE_SYSTEM_PROMPT, SAFETY_LAYER_PROMPT } from '../../soul/prompts'; 

export async function completePhi(
  userText: string, 
  systemInstruction: string, // Ini adalah isi teks dari systemPrompt.txt + memory.md dari router
  modelVariant: 'phi4:14b' | 'phi4-mini:latest',
  _event: any
): Promise<string> {
  console.log(`⚡ [OLLAMA LOCAL]: Menghubungi Keluarga Phi (${modelVariant})...`);

  // 🎯 2. KAHWINKAN SEGA-SEGALA PROMPT SUPAYA OTAK LOCAL MODEL TAK NYANYUK
  const finalBoosterInstruction = `
${systemInstruction}

==================================================
⚠️ CRITICAL LANGUAGE & BEHAVIOR LAYER (COMPULSORY) ⚠️
${CORE_SYSTEM_PROMPT}

${SAFETY_LAYER_PROMPT}
==================================================
`;

  // 🚀 3. HANTAR ARAHAN YANG DAH KEDAP UDARA NI KE OLLAMA
  return callOllamaStream(userText, finalBoosterInstruction, modelVariant, _event);
}