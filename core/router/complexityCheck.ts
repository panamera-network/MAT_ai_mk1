// core/router/complexityCheck.ts

export function checkComplexity(text: string): 'low' | 'high' {
  const lowerText = text.toLowerCase().trim();

  // 1. Kalau text terlalu pendek (bawah 15 huruf), selalunya sembang kosong jer ni
  if (text.length < 15) {
    return 'low';
  }

  // 2. Keyword yang menandakan user minta tugas berat (Coding, Analisis, Troubleshooting)
  const heavyKeywords = [
    'code', 'function', 'bug', 'ralat', 'error', 'fix', 'buatkan skrip',
    'analisis', 'summary', 'rumuskan', 'explain deeply', 'mengapa', 'bagaimana'
  ];

  const hasHeavyKeyword = heavyKeywords.some(keyword => lowerText.includes(keyword));
  if (hasHeavyKeyword) {
    return 'high';
  }

  // Default: Kalau tak ada apa-apa yang mencurigakan, bagi local model setelkan
  return 'low';
}