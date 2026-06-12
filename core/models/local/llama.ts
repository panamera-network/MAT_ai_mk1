// core/models/local/llama.ts
import { callOllamaStream } from './localManager';

export async function completeLlama(userText: string, systemInstruction: string, _event: any): Promise<string> {
  return callOllamaStream(userText, systemInstruction, 'llama3.1:8b', _event);
}

