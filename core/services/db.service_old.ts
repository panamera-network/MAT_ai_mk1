// core/services/db.service.ts
import Datastore from 'nedb-promises';
import { app } from 'electron';
import path from 'path';

class DbService {
  private db: any = null;

  // Kita buat fungsi "init" sendiri supaya dia tak jem masa startup
  private async initDb() {
    if (this.db) return this.db;

    const dbPath = path.join(app.getPath('userData'), 'mat_ai_memory.db');
    this.db = Datastore.create({
      filename: dbPath,
      autoload: true,
    });
    return this.db;
  }

  // Simpan chat
  async saveMessage(role: 'user' | 'assistant', content: string) {
    const db = await this.initDb(); // Tunggu DB ready baru jalan
    return await db.insert({
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  // Ambil sejarah
  async getHistory(limit: number = 15) {
    const db = await this.initDb(); // Tunggu DB ready baru jalan
    const history = await db
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit);
      
    return Array.isArray(history) ? history.reverse() : [];
  }
}

const dbService = new DbService();

export { dbService };
export const saveMessage = (role: 'user' | 'assistant', content: string) => dbService.saveMessage(role, content);
export const getHistory = (limit: number = 15) => dbService.getHistory(limit);
