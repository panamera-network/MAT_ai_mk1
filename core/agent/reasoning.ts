// core/agent/reasoning.ts

export interface AgentThought {
  thought: string;
  actionRequired: boolean;
  toolName?: string;
  args?: Record<string, any>;
  finalAnswer?: string;
}

/**
 * Menganalisis maklum balas ejen untuk menentukan langkah seterusnya.
 */
export function analyzeNextStep(aiResponseText: string): AgentThought {
  const text = aiResponseText.trim();

  // Semak jika AI mengeluarkan isyarat mahu berfikir atau memanggil tools
  if (text.includes('"tool"') || text.includes('"name"')) {
    try {
      // Cuba cari pattern JSON dalam teks
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          thought: "Saya perlu menjalankan operasi sistem untuk tugasan ini.",
          actionRequired: true,
          toolName: parsed.tool || parsed.name,
          args: parsed.args || parsed.arguments || {}
        };
      }
    } catch (e) {}
  }

  // Jika tiada tool call, maksudnya ini adalah jawapan akhir sembang biasa
  return {
    thought: "Tugasan selesai. Sedia membalas kepada Boss.",
    actionRequired: false,
    finalAnswer: text
  };
}