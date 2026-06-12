// core/agent/agentLoop.ts
import { getToolsSystemPrompt } from '../tool-router/toolRegistry';
import { parseToolCall } from '../tool-router/toolParser';
import { executeTool } from '../tool-router/toolExecutor';
import { completeOpenAIFast } from '../models/cloud/openai';

/**
 * Gelung Agentik: Menguruskan kitaran Fikir -> Sumpah Action -> Lihat Hasil -> Balas
 */
export async function runAgentAutonomousLoop(
  userRequirement: string,
  systemInstruction: string,
  _event: any
): Promise<string> {
  console.log(`🤖 [AGENT LOOP]: Memulakan operasi autonomi untuk: "${userRequirement}"`);

  let currentContext = userRequirement;
  const maxIterations = 3; // Elakkan ejen masuk loop tanpa henti (Infinite loop protection)
  
  // Gabungkan undang-undang identiti asal dengan arahan manual perkakas tool registry
  const agentInstruction = `${systemInstruction}\n\n${getToolsSystemPrompt()}`;

  for (let i = 1; i <= maxIterations; i++) {
    console.log(`🔄 [AGENT LOOP]: Pusingan Pemikiran Ke-${i}`);
    _event.sender.send('mat-ai:stream-chunk', `\n*(Mat tengah fikir jap... Pusingan ${i})*\n`);

    // 1. Tanya model apa tindakan yang perlu dibuat berdasarkan situasi semasa
    const aiResponse = await completeOpenAIFast(currentContext, agentInstruction, _event);
    
    // 2. Parse jawapan sama ada dia sekadar bercakap atau nak panggil kaki tangan (skills)
    const analysis = parseToolCall(aiResponse);

    if (analysis.isToolCall && analysis.toolName) {
      _event.sender.send('mat-ai:stream-chunk', `\n⚙️ *[MAT UTUSAN ACTION]: Menjalankan ${analysis.toolName}...*\n`);
      
      // 3. Jalankan tool/skill nyata tersebut
      const toolResult = await executeTool(analysis.toolName, analysis.args || {});
      
      // 4. Masukkan hasil kerja tool tadi ke dalam konteks baru untuk pusingan seterusnya
      currentContext += `\n[MESEJ SISTEM - HASIL TOOL ${analysis.toolName}]: ${toolResult}\nSila analisa hasil ini dan tentukan sama ada tugasan selesai atau perlukan tindakan lain.`;
      
    } else {
      // Kebetulan AI tak panggil tool, maksudnya dia dah jumpa jawapan penutup atau tugasan selesai!
      console.log(`✅ [AGENT LOOP]: Operasi selesai dengan jayanya pada pusingan ke-${i}.`);
      return aiResponse;
    }
  }

  return "Sori Boss, Mat dah cuba run 3 kali pusingan tapi proses tu terlalu panjang. Mat stop kat sini dulu demi keselamatan PC.";
}