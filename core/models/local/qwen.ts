// core/models/local/qwen.ts
import { callOllamaStream } from './localManager';

export async function completeQwen(
  userText: string, 
  systemInstruction: string, 
  modelVariant: 'qwen3:4b' | 'qwen3.5:4b', 
  _event: any
): Promise<string> {
  return callOllamaStream(userText, systemInstruction, modelVariant, _event);
}