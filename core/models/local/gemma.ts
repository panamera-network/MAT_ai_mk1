// core/models/local/gemma.ts
import { callOllamaStream } from './localManager';

export async function completeGemma(
  userText: string, 
  systemInstruction: string, 
  modelVariant: 'gemma4:26b' | 'gemma4:e4b',
  _event: any
): Promise<string> {
  console.log(`⚡ [OLLAMA LOCAL]: Menghubungi Keluarga Gemma (${modelVariant})...`);
  return callOllamaStream(userText, systemInstruction, modelVariant, _event);
}