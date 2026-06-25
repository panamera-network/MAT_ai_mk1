// core/router/router.ts
//
// Used to be the central classifier + direct-LLM dispatcher (intent detection,
// system-prompt assembly, OpenAI/Ollama branching). All of that moved to MAT-AI-OS —
// this file is now a thin pass-through to MatOSClient. No classification, no prompt
// building, no fallback to a direct LLM call.

import { matOsClient, MatOSAttachment, MatOSTaskResult, MatOSError } from '../os-client';

export type MatAiMode = 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN';

export interface RouterAttachment {
  type: 'image' | 'text_file' | 'other';
  name: string;
  url?: string; // data: URL (images)
  content?: string; // raw text (text_file)
}

function attachmentToMatOSFile(attachment?: RouterAttachment): MatOSAttachment | undefined {
  if (!attachment) return undefined;

  if (attachment.type === 'image' && attachment.url) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(attachment.url);
    const mimeType = match?.[1];
    const base64 = match?.[2];
    if (mimeType && base64) {
      return { name: attachment.name, buffer: Buffer.from(base64, 'base64'), mimeType };
    }
  }

  if (attachment.type === 'text_file' && typeof attachment.content === 'string') {
    return { name: attachment.name, buffer: Buffer.from(attachment.content, 'utf-8'), mimeType: 'text/plain' };
  }

  return undefined;
}

/**
 * Send a user message to MAT-AI-OS. Returns the discriminated {ok, ...} union from
 * MatOSClient unchanged, so callers can tell a real reply apart from a connection
 * error (and the UI can render an error state instead of treating it as MAT.ai's
 * actual answer).
 *
 * `uiSelection`/`localModelName` are accepted for backward compatibility with the
 * existing IPC payload shape but are no longer consulted — MAT-AI-OS owns model/skill
 * selection now. No silent fallback to a direct LLM call if MAT-AI-OS is unreachable.
 */
export async function matAiRouter(
  userText: string,
  _uiSelection: MatAiMode,
  _event: unknown,
  _localModelName?: string,
  attachment?: RouterAttachment,
): Promise<MatOSTaskResult | MatOSError> {
  const messageText = attachment && !userText.trim() ? `[Attached: ${attachment.name}]` : userText;
  return matOsClient.sendTask(messageText, undefined, attachmentToMatOSFile(attachment));
}
