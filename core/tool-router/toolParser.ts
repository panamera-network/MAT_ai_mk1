// core/tool-router/toolParser.ts

export interface ToolCallResult {
  isToolCall: boolean;
  toolName?: string;
  args?: Record<string, any>;
}

export function parseToolCall(aiResponseText: string): ToolCallResult {
  const cleanText = aiResponseText.trim();

  // 1. Semak kalau teks kelihatan seperti objek JSON
  if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanText);
      
      // Pastikan ada property wajib: name/tool dan arguments/args
      if (parsed.tool || parsed.name) {
        return {
          isToolCall: true,
          toolName: parsed.tool || parsed.name,
          args: parsed.args || parsed.arguments || {}
        };
      }
    } catch (e) {
      // Gagal parse, maksudnya text biasa yang kebetulan ada kurungan curly braces
    }
  }

  // Fallback regex kalau AI ter-letak markdown code block ```json ...
  const jsonRegex = /json\s*([\s\S]*?)\s*/;
const match = cleanText.match(jsonRegex);
if (match && match[1]) {
try {
const parsed = JSON.parse(match[1].trim());
return {
isToolCall: true,
toolName: parsed.tool || parsed.name,
args: parsed.args || parsed.arguments || {}
};
} catch (e) {}
}

return { isToolCall: false };
}