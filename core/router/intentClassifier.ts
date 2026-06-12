// core/router/intentClassifier.ts

export type UserIntent = 'chat' | 'action';

export function classifyIntent(text: string): UserIntent {
  const lowerText = text.toLowerCase().trim();

  // Keyword pemicu aksi (Automation, Apps, Files, Search)
  const actionKeywords = [
    'buka', 'open', 'launch', 'jalankan', 'run', 
    'cari fail', 'find file', 'padam', 'delete',
    'search', 'google', 'cari dekat internet',
    'volume', 'shutdown', 'restart', 'screenshot'
  ];

  // Check kalau ada perkataan aksi di dalam ayat user
  const isAction = actionKeywords.some(keyword => lowerText.includes(keyword));

  if (isAction) {
    return 'action';
  }

  // Jika setakat tanya khabar atau borak ilmu, ia adalah sembang (chat)
  return 'chat';
}