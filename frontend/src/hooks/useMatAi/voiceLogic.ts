// frontend/src/hooks/useMatAi/voiceLogic.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { getMatAiApi } from './utils';

// 🎯 KUNCI UTAMA: Letak kat LUAR fungsi useVoiceLogic supaya dia dikongsi secara global & real-time!
let globalStopFn: (() => Promise<void>) | null = null;
let vadTimeout: NodeJS.Timeout | null = null;
let vadActive = false;

export const useVoiceLogic = (sendWithText: any, setInput: any, setVoiceError: any, micRecorderRef: any, _recogRef: any) => {
  const [listening, setListening] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const analyserRef = useRef<any>(null);

  // Fungsi utama untuk stop & transkrip
  const stopWhisperAndTranscribe = useCallback(async () => {
    console.log("🎙️ MAT.ai: Memulakan proses stopWhisperAndTranscribe...");
    
    // Matikan VAD serta-merta
    vadActive = false;
    if (vadTimeout) {
      clearTimeout(vadTimeout);
      vadTimeout = null;
    }

    const api = getMatAiApi();
    const rec = micRecorderRef.current;
    
    if (!rec) {
      console.log("✨ MAT.ai: MicRecorder dah tiada. Skip aman.");
      setListening(false);
      setVoiceBusy(false);
      return;
    }

    setListening(false);
    setVoiceBusy(true);

    try {
      console.log("⏳ MAT.ai: Menghentikan rakaman daripada perkhidmatan...");
      const blob = await rec.stop();
      console.log("🎯 MAT.ai: Blob audio saiz:", blob.size);

      if (blob.size === 0) {
        console.warn("⚠️ MAT.ai: Fail audio kosong.");
        return;
      }

      console.log("🚀 MAT.ai: Menghantar data ke Whisper API...");
      const buf = new Uint8Array(await blob.arrayBuffer());
      const result = await api.transcribeAudio(buf);
      console.log("📝 MAT.ai: Respon Whisper:", result);

      if (result.ok && result.text?.trim()) {
        const teksBersih = result.text.trim();
        setInput(teksBersih);
        console.log("✈️ MAT.ai: Menembak teks ke chat panel:", teksBersih);
        void sendWithText(teksBersih, 'voice');
      }
    } catch (e: any) {
      console.error("💥 Ralat:", e);
      setVoiceError(e.message || 'Ralat mic');
    } finally {
      setVoiceBusy(false);
      console.log("🔓 MAT.ai: Selesai proses. Lock dilepaskan.");
    }
  }, [sendWithText, setInput, setVoiceError, micRecorderRef]);

  // 🎯 UPDATE GLOBAL FUNCTION SETIAP KALI IA BERUBAH
  useEffect(() => {
    globalStopFn = stopWhisperAndTranscribe;
  }, [stopWhisperAndTranscribe]);

  // Fungsi VAD yang bebas dari rintangan React hooks
  const setupVAD = useCallback((stream: MediaStream) => {
    if (vadTimeout) clearTimeout(vadTimeout);
    vadActive = true;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let isSilent = false;

    const checkAudio = () => {
      if (!vadActive || !stream.active) {
        audioContext.close();
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] ?? 0;
      }
      const average = sum / bufferLength;

      // Log tahap bising bilik
      if (Math.random() < 0.02) {
        console.log(`🎤 VAD Level: ${average.toFixed(1)}`);
      }

      if (average < 25) { 
        if (!isSilent) {
          isSilent = true;
          console.log("🤫 MAT.ai: Kau diam... Mula timer 2.5 saat...");
          
          vadTimeout = setTimeout(() => {
            if (vadActive && stream.active) {
              console.log("⏰ MAT.ai: Cukup 2.5 saat! Auto-stop dipicu!");
              vadActive = false;
              // 🔥 PANGGIL GLOBAL FUNCTION YANG GERENTI FRESH!
              if (globalStopFn) {
                void globalStopFn();
              }
            }
          }, 2500); 
        }
      } else {
        if (isSilent) {
          isSilent = false;
          console.log("🎙️ MAT.ai: Kau bunyi balik, timer di-reset.");
          if (vadTimeout) {
            clearTimeout(vadTimeout);
            vadTimeout = null;
          }
        }
      }

      if (vadActive) {
        requestAnimationFrame(checkAudio);
      }
    };

    requestAnimationFrame(checkAudio);
  }, []);

  return {
    listening,
    setListening,
    voiceBusy,
    stopWhisperAndTranscribe,
    setupVAD,
    analyserRef
  };
};