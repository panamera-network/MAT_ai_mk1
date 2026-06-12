// core/tool-router/toolRegistry.ts

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

// 1. Kamus senarai skrin/kemahiran yang MAT.ai ada
export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    name: 'open_application',
    description: 'Mengaktifkan atau membuka software/aplikasi dalam komputer Windows seperti VS Code, Chrome, Notepad, atau Kalkulator.',
    parameters: {
      type: 'object',
      properties: {
        app_name: { 
          type: 'string', 
          description: 'Nama aplikasi atau command terminal (contoh: "code" untuk VS Code, "chrome", "notepad", "calc")' 
        }
      },
      required: ['app_name']
    }
  },
  {
    name: 'execute_terminal_command',
    description: 'Menjalankan arahan command terminal Windows (CMD) untuk menyemak sistem, status network, atau utiliti seperti "ipconfig", "ping google.com", atau "dir".',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Command CMD yang bersih dan lengkap' }
      },
      required: ['command']
    }
  },
  {
    name: 'search_internet',
    description: 'Melakukan carian maklumat terkini di internet (Google/Tavily) sekiranya user tanya pasal berita, harga saham live, atau isu semasa tahun 2026.',
    parameters: {
      type: 'object',
      properties: {
        query: { 
          type: 'string', 
          description: 'Ayat kunci carian yang padat dan tepat' 
        }
      },
      required: ['query']
    }
  }
];

// Fungsi untuk convert registry jadi string text supaya model lokal pun boleh baca & faham tools apa yang ada
export function getToolsSystemPrompt(): string {
  return `
[AVAILABLE TOOLS / SKILLS]:
Anda mempunyai akses kepada sistem automasi komputer desktop Windows pengguna melalui fungsi (tools) berikut. Jika arahan pengguna memerlukan tindakan ini, anda MESTI membalas dengan format JSON Tool Call sahaja (Rujuk Tool Parser).

${JSON.stringify(TOOL_REGISTRY, null, 2)}
  `.trim();
}