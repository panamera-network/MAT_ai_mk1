//utils.ts - helper functions for MAT.ai integration, like detecting commands and accessing the API bridge.

export function getMatAiApi() {
  if (typeof window !== 'undefined' && 'matAi' in window) {
    return (window as any).matAi;
  }
  return undefined;
}

export function detectCommand(text: string): string | null {
  const lower = text.toLowerCase().trim();
  if (lower.includes('buka youtube') || lower.includes('youtube')) return 'open_youtube';
  if (lower.includes('buka vscode') || lower.includes('code')) return 'open_vscode';
  if (lower.includes('buka browser') || lower.includes('chrome')) return 'open_browser';
  if (lower.includes('buka kalkulator') || lower.includes('calc')) return 'calculator';
  return null;
}

export function isElectronUserAgent(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
}

export function describeMissingBridge(): string {
  const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
  return isElectron 
    ? 'MAT.ai: `window.matAi` tidak ditemui (preload tidak sambung).'
    : 'MAT.ai: Anda kelihatan membuka UI di pelayar web. Chat hanya wujud dalam aplikasi desktop.';
}