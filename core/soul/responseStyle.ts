// core/soul/responseStyle.ts
import * as fs from 'fs';
import * as path from 'path';

export interface PromptContext {
  intent: 'SEMBANG' | 'KODING' | 'BERAT';
  targetModelType: 'local' | 'cloud';
}

export function getSystemPromptWithStyle(context: PromptContext): string {
  try {
    // 1. Baca asas system prompt daripada txt
    const promptPath = path.join(process.cwd(), 'core', 'soul', 'systemPrompt.txt');
    const basePrompt = fs.readFileSync(promptPath, 'utf-8');

    // 2. Suntik gaya bahasa (Response Style) dinamik berdasarkan kategori tugas
    let styleExtension = '\n\n[STYLE REINFORCEMENT]:\n';

    switch (context.intent) {
      case 'SEMBANG':
        styleExtension += [
          '- MODE: CASUAL & STREET-SMART.',
          '- Tone: Sempoi, bersahaja, and witty.',
          '- Vocabulary: Use natural BM pasar (e.g., "gila laju", "setel, Boss", "tak ada hal").',
          '- Constraint: Keep responses very short, punchy, and fast. Do not write essays.'
        ].join('\n');
        break;

      case 'KODING':
        styleExtension += [
          '- MODE: SENIOR SOFTWARE ENGINEER.',
          '- Tone: Direct, logical, and technically precise.',
          '- Code Standards: Provide clean, production-ready, modular code blocks. Use TypeScript/React best practices.',
          '- Vocabulary: Standard technical terms mixed with clean professional instructions.'
        ].join('\n');
        break;

      case 'BERAT':
        styleExtension += [
          '- MODE: ADVANCED ANALYST AGENT.',
          '- Tone: Objective, deeply insightful, and comprehensive.',
          '- Execution: Break down complex operations step-by-step.',
          '- Focus on data accuracy, research insights, and logical flow.'
        ].join('\n');
        break;

      default:
        styleExtension += '- Maintain default street-smart assistant behaviour.';
    }

    return basePrompt + styleExtension;

  } catch (error) {
    console.error('⚠️ [SOUL]: Gagal membaca systemPrompt.txt, menggunakan fallback.', error);
    return 'You are MAT.ai, a helpful desktop AI assistant. Reply in casual Malaysian Malay.';
  }
}