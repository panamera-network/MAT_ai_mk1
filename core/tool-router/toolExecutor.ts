// core/tool-router/toolExecutor.ts

import { skillOpenApplication } from '../skills/automation/openApp';
import { skillExecuteCommand } from '../skills/system/systemCmd';

export async function executeTool(toolName: string, args: Record<string, any>): Promise<string> {
  console.log(`🔧 [SKILLS MANAGER]: Memproses order -> ${toolName} dengan argumen:`, args);

  switch (toolName) {
    case 'open_application':
      return await skillOpenApplication(args.app_name);
    case 'execute_terminal_command':
      return await skillExecuteCommand(args.command);

    case 'search_internet':
      return `[RESULT]: Carian internet untuk "${args.query}" sedang dijalankan (Wiring Tavily dalam proses)...`;

    default:
      return `[ERROR]: Fungsi maklum balas untuk skill "${toolName}" belum disambungkan ke mana-mana fail core/skills.`;
  }
}

