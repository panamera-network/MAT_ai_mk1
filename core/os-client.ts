// core/os-client.ts
//
// The ONLY place in MK1 that talks to the AI brain. Everything that used to be a
// direct OpenAI/Gemini/Ollama call now goes through MatOSClient → MAT-AI-OS
// (the Python/FastAPI backend at MAT_OS_URL, default http://localhost:8000).
//
// No silent fallback: if MAT-AI-OS isn't reachable, sendTask()/getStatus() return a
// clear {ok:false, error} the caller is expected to surface to the user as-is.

import { randomUUID } from 'crypto';

const MAT_OS_URL = (process.env.MAT_OS_URL || 'http://localhost:8000').replace(/\/+$/, '');

export interface MatOSAttachment {
  name: string;
  buffer: Buffer;
  mimeType?: string;
}

export interface MatOSTaskResult {
  ok: true;
  text: string;
  sessionId: string;
}

export interface MatOSError {
  ok: false;
  error: string;
}

interface TaskResponseBody {
  result?: string | null;
  session_id?: string | null;
  queued?: boolean;
  task_id?: string | null;
  status?: string | null;
}

const OFFLINE_MESSAGE = (url: string) =>
  `MAT-AI-OS backend not running (could not reach ${url}). Start the backend first, BOSS.`;

export class MatOSClient {
  private sessionId: string;

  constructor() {
    this.sessionId = randomUUID();
  }

  /** Current session id — reused across messages so MAT-AI-OS sees multi-turn context. */
  getSessionId(): string {
    return this.sessionId;
  }

  /** Start a brand-new conversation (e.g. a "New Chat" action). */
  newSession(): string {
    this.sessionId = randomUUID();
    return this.sessionId;
  }

  /**
   * Send one task to MAT-AI-OS. Uses POST /task/upload when a file is attached,
   * POST /task otherwise. Never throws — failures come back as {ok:false, error}.
   */
  async sendTask(message: string, sessionId?: string, file?: MatOSAttachment): Promise<MatOSTaskResult | MatOSError> {
    const activeSessionId = sessionId || this.sessionId;

    let response: Response;
    try {
      if (file) {
        const form = new FormData();
        form.append('task', message);
        form.append('session_id', activeSessionId);
        form.append('priority', 'normal');
        const bytes = new Uint8Array(file.buffer);
        form.append('file', new Blob([bytes], { type: file.mimeType || 'application/octet-stream' }), file.name);

        response = await fetch(`${MAT_OS_URL}/task/upload`, { method: 'POST', body: form });
      } else {
        response = await fetch(`${MAT_OS_URL}/task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: message, session_id: activeSessionId, priority: 'normal' }),
        });
      }
    } catch {
      // Network-level failure (connection refused, DNS, etc.) — backend is simply not up.
      return { ok: false, error: OFFLINE_MESSAGE(MAT_OS_URL) };
    }

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      return { ok: false, error: `MAT-AI-OS returned ${response.status}${bodyText ? `: ${bodyText}` : ''}` };
    }

    const data = (await response.json()) as TaskResponseBody;

    if (data.session_id) {
      this.sessionId = data.session_id;
    }

    if (data.queued) {
      return {
        ok: true,
        text: 'MAT-AI-OS is busy right now — your task has been queued and will run shortly, BOSS.',
        sessionId: this.sessionId,
      };
    }

    return { ok: true, text: data.result ?? '', sessionId: this.sessionId };
  }

  /** GET /health — used to show MAT-AI-OS's online/offline status in the UI. */
  async getStatus(): Promise<{ online: true; data: Record<string, unknown> } | { online: false; error: string }> {
    try {
      const response = await fetch(`${MAT_OS_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) {
        return { online: false, error: `HTTP ${response.status}` };
      }
      const data = (await response.json()) as Record<string, unknown>;
      return { online: true, data };
    } catch {
      return { online: false, error: OFFLINE_MESSAGE(MAT_OS_URL) };
    }
  }
}

export const matOsClient = new MatOSClient();
