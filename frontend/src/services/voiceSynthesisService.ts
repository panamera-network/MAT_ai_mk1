// frontend/src/services/voiceSynthesisService.ts

export async function speak(text: string) {
  if (typeof window === 'undefined') return;

  // 1. Bersihkan audio lama (kita boleh simpan ref kat luar kalau perlu, 
  //    tapi kalau nak simple, biar dia handle local audio element sendiri)
  window.speechSynthesis.cancel();

  const encodedText = encodeURIComponent(text);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ms&client=tw-ob`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('TTS Gagal');
    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch {
    // Fallback kalau Google TTS down
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      window.speechSynthesis.speak(utterance);
    }
  }
}