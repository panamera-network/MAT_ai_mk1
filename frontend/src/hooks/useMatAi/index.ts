import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useChatLogic } from './chatLogic';
import { useVoiceLogic } from './voiceLogic';
import { getMatAiApi } from './utils';
import { createMicRecorder, isMicRecordingSupported } from '../../services/voiceRecorderService';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../../services/speechService';

export function useMatAi() {
  // 1. STATE
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  // Ganti baris state 14 & 15 dlm frontend/src/hooks/useMatAi/index.ts jadi macam ni mat:
  const [uiSelection, setUiSelection] = useState<'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'>('FAST_CLOUD');
  const [selectedLocalModel, setSelectedLocalModel] = useState<string>('gpt-4o-mini'); // 🎯 TUKAR JADI INI!
  const [bridgeReady, setBridgeReady] = useState(false);
  const [micEngine, setMicEngine] = useState<'whisper' | 'webspeech' | 'none'>('none');
  const sendRef = useRef<any>(null);
  const micRecorderRef = useRef<ReturnType<typeof createMicRecorder> | null>(null);
  const recogRef = useRef<any>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const kwsRef = useRef<any>(null);

  // Support checks
  const webSpeechSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const mediaRecorderSupported = useMemo(() => isMicRecordingSupported(), []);

  // 2. LOGIC HOOKS
  const { sendWithText } = useChatLogic(
    turns, setTurns, setBusy, setInput, sendRef, 
    uiSelection, selectedLocalModel, busy
  );

  // 🎯 FIX 1: Ambil stopFnRef dari useVoiceLogic kat sini!
  const { 
    listening, 
    setListening, 
    voiceBusy,
    stopWhisperAndTranscribe, 
    setupVAD, 
    analyserRef
  } = useVoiceLogic(sendWithText, setInput, setVoiceError, micRecorderRef, recogRef);

  // INTERFACE TOGGLE MIC

  const onMicToggle = useCallback(async () => {
    // KUNCI UTAMA: Elak double trigger masa tengah sibuk
    if (voiceBusy || busy) {
      console.log("🛑 MAT.ai: Sabar mat, sistem tengah busy susun teks...");
      return;
    }

    if (micEngine === 'whisper') {
      const rec = micRecorderRef.current;
      if (!rec) return;
      
      if (!listening) {
        try {
          setVoiceError(null);
          await rec.start();
          setListening(true);
          
          if (rec.stream) {
            // 🎯 PADU & RINGKAS: Pass stream sahaja mat! 
            // Logik auto-stop semua dah settle kat dalam voiceLogic.ts pakai globalStopFn.
            setupVAD(rec.stream); 
          }
        } catch (err) {
          setVoiceError('Gagal hidupkan mic');
        }
      } else {
        // User paksa stop manual guna klik butang
        console.log("⚡ MAT.ai: User tekan butang, force send instant!");
        
        // 🎯 Panggil terus fungsi stop asal dari useVoiceLogic
        await stopWhisperAndTranscribe();
      }
    } else if (micEngine === 'webspeech') {
      const r = recogRef.current;
      if (r) listening ? r.stop() : r.start();
    }
    // Dependency array yang dah dibersihkan dari stopFnRef hantu
  }, [listening, micEngine, voiceBusy, busy, setupVAD, stopWhisperAndTranscribe, setListening, setVoiceError]);
  
  // 3. EFFECTS (Setup System)
  // frontend/src/hooks/useMatAi/index.ts

// 🎯 EFFECT 1: Sambut Semboyan Wakeup (Kod kau yang dah sedia padu)
useEffect(() => {
  // 🎯 Paksa casting jadi 'any' supaya TypeScript tak bising pasal types window
  const electron = (window as any).electron;
  if (!electron) return; 

  const handleWakeupSignal = () => {
    console.log("📥 [FRONTEND]: Isyarat KWS Sherpa-ONNX diterima! Membuka mic utama...");
    void onMicToggle(); // 🔥 Automatik ON mic Whisper kau mat!
  };

  // Pasang listener IPC
  electron.on('mat-ai:wakeup-triggered', handleWakeupSignal);

  return () => {
    // Cuci listener masa unmount
    electron.off('mat-ai:wakeup-triggered', handleWakeupSignal);
  };
}, [onMicToggle]);


// 🔥 EFFECT 2 (TAMBAHAN WAJIB MAT): Pengurus Trafik KWS Automatik
useEffect(() => {
  const electron = (window as any).electron;
  if (!electron) return;

  // Jika Whisper tengah merakam (listening) ATAU chatbot tengah busy memproses audio (voiceBusy)
  if (listening || voiceBusy) {
    // Pastikan enjin background mati sepenuhnya, tak kacau hardware mic
    electron.send('mat-ai:stop-kws');
  } else {
    // Jika semua dah aman damai (idle), kejutkan semula telinga lintah kat backend!
    // Kita bagi delay 1.5 saat bagi ruang soundcard hardware kau tarik nafas lepas Whisper tutup
    const timer = setTimeout(() => {
      electron.send('mat-ai:start-kws');
    }, 1500);

    return () => clearTimeout(timer);
  }
}, [listening, voiceBusy]);

  
  useEffect(() => {
    const check = () => {
      if (typeof getMatAiApi()?.chat === 'function') {
        setBridgeReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const id = window.setInterval(() => { if (check()) clearInterval(id); }, 50);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!bridgeReady) return;
    const api = getMatAiApi();
    void (async () => {
      try {
        const caps = await api.checkVoiceCapabilities();
        if (caps.whisper && mediaRecorderSupported) setMicEngine('whisper');
        else if (webSpeechSupported) setMicEngine('webspeech');
      } catch {
        setMicEngine(webSpeechSupported ? 'webspeech' : 'none');
      }
    })();
  }, [bridgeReady, mediaRecorderSupported, webSpeechSupported]);

  useEffect(() => {
    if (!micRecorderRef.current) {
      micRecorderRef.current = createMicRecorder();
    }
    return () => {
      micRecorderRef.current?.dispose();
    };
  }, []);

  // frontend/src/hooks/useMatAi/index.ts


  // 4. RETURN VALUE
  return {
    turns, busy, input, setInput, listening, voiceBusy, voiceError,
    onMicToggle, sendWithText, uiSelection, setUiSelection, 
    selectedLocalModel, setSelectedLocalModel, bridgeReady, micEngine,
    analyserRef
  };

  
}