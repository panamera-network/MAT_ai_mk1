// core/memory/memoryManager.ts
// Fungsi untuk baca memori jangka panjang dari fail markdown
import fs from 'fs';
import path from 'path';

export function getLongTermMemory(): string {
  try {
    const memoryPath = path.join(process.cwd(), 'core', 'memory', 'memory.md');
    return fs.readFileSync(memoryPath, 'utf-8');
  } catch (e) {
    console.error('⚠️ Gagal baca memory.md');
    return '';
  }
}