// core/memory/shortTerm.ts

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export class ShortTermMemory {
  private memoryLimit: number;
  // Kita guna Map untuk simpan sesi perbualan ikut sessionId (senang kalau masa depan ada multi-chat)
  private sessions: Map<string, ChatMessage[]>;

  constructor(limit = 20) {
    this.memoryLimit = limit;
    this.sessions = new Map();
  }

  // 1. Ambil semua sejarah chat untuk satu sesi
  getHistory(sessionId: string): ChatMessage[] {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    return this.sessions.get(sessionId) || [];
  }

  // 2. Tambah mesej baru (Mesej user atau respon AI)
  addMessage(sessionId: string, role: 'user' | 'assistant' | 'system', content: string) {
    const history = this.getHistory(sessionId);

    history.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Konsep Sliding Window: Buang mesej lama kalau dah lebih had
    if (history.length > this.memoryLimit) {
      console.log(`🧹 [SHORT-TERM MEMORY]: Had token melebihi ${this.memoryLimit}. Membuang konteks lama.`);
      history.shift(); // Buang mesej paling lama di atas sekali
    }

    this.sessions.set(sessionId, history);
  }

  // 3. Clear memory kalau user klik butang "New Chat" dekat UI frontend
  clearSession(sessionId: string) {
    this.sessions.set(sessionId, []);
    console.log(`🗑️ [SHORT-TERM MEMORY]: Sesi ${sessionId} telah dikosongkan.`);
  }
}

// Export satu instance sedia ada untuk digunapakai merentas core/
export const shortTermMemory = new ShortTermMemory(20);