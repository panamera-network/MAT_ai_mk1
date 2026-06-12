// frontend/src/hooks/useMatAi.ts
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createMicRecorder, isMicRecordingSupported } from '../services/voiceRecorderService'
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../services/speechService'

function getMatAiApi() {
  if (typeof window !== 'undefined' && 'matAi' in window) {
    return (window as any).matAi;
  }
  return undefined;
}

function isElectronUserAgent(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')
}

function describeMissingBridge(): string {
  if (!isElectronUserAgent()) {
    return 'MAT.ai: Anda kelihatan membuka UI di pelayar web (bukan tetingkap Electron).\n\nChat & preload hanya wujud dalam aplikasi desktop.'
  }
  return 'MAT.ai: `window.matAi` tidak ditemui (preload tidak sambung).'
}

function detectCommand(text: string): string | null {
  const lower = text.toLowerCase().trim()
  if (lower.includes('buka youtube') || lower.includes('open youtube') || lower.includes('youtube')) return 'open_youtube'
  if (lower.includes('buka vscode') || lower.includes('open vscode') || lower.includes('buka code') || lower.includes('open code')) return 'open_vscode'
  if (lower.includes('buka browser') || lower.includes('open browser') || lower.includes('buka chrome') || lower.includes('open chrome')) return 'open_browser'
  if (lower.includes('buka calculator') || lower.includes('open calculator') || lower.includes('buka kalkulator') || lower.includes('kalkulator') || lower.includes('calc')) return 'calculator'
  return null
}

export function useMatAi() {
  const [bridgeReady, setBridgeReady] = useState(() => typeof getMatAiApi()?.chat === 'function')
  const [micEngine, setMicEngine] = useState<'whisper' | 'webspeech' | 'none'>('none')
  const [input, setInput] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [busy, setBusy] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const [voiceBusy, setVoiceBusy] = useState(false)
  
  const [uiSelection, setUiSelection] = useState<'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'>('FAST_LOCAL')
  const [selectedLocalModel, setSelectedLocalModel] = useState<string>('llama3.1:8b')

  const sendRef = useRef<(text: string, inputMode?: 'text' | 'voice' | 'image', attachment?: any) => Promise<void>>(async () => undefined)
  const recogRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null)
  const micRecorderRef = useRef<ReturnType<typeof createMicRecorder> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  const webSpeechSupported = useMemo(() => isSpeechRecognitionSupported(), [])
  const mediaRecorderSupported = useMemo(() => isMicRecordingSupported(), [])

  // Fungsi lama dikurung mat, tak panggil dah tapi simpan biar tak break compile
  const speak = useCallback(async (text: string) => {
    if (typeof window === 'undefined') return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    window.speechSynthesis.cancel()

    const encodedText = encodeURIComponent(text)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ms&client=tw-ob`

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const audioUrl = URL.createObjectURL(blob)
      audioUrlRef.current = audioUrl
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      await audio.play()
    } catch {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ms-MY'
        window.speechSynthesis.speak(utterance)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof getMatAiApi()?.chat === 'function') {
      setBridgeReady(true)
      return
    }
    const id = window.setInterval(() => {
      if (typeof getMatAiApi()?.chat === 'function') {
        setBridgeReady(true)
        window.clearInterval(id)
      }
    }, 50)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const api = getMatAiApi()
    if (!bridgeReady || !api) return
    void (async () => {
      try {
        const caps = await api.checkVoiceCapabilities()
        if (caps.whisper && mediaRecorderSupported) setMicEngine('whisper')
        else if (webSpeechSupported) setMicEngine('webspeech')
      } catch {
        setMicEngine(webSpeechSupported ? 'webspeech' : 'none')
      }
    })()
  }, [bridgeReady, mediaRecorderSupported, webSpeechSupported])

  useEffect(() => {
    micRecorderRef.current = createMicRecorder()
    return () => micRecorderRef.current?.dispose()
  }, [])

  const sendWithText = useCallback(async (
    text: string, 
    inputMode: 'text' | 'voice' | 'image' = 'text',
    attachment?: { name: string; data: string; type: string }
  ) => {
    const api = getMatAiApi()
    const trimmed = text.trim()
    
    if (!trimmed && !attachment) return
    if (busy) return

    if (!api) {
      setTurns(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed || `[Fail: ${attachment?.name}]`, inputMode }, { id: crypto.randomUUID(), role: 'assistant', text: describeMissingBridge() }])
      setInput('')
      return
    }

    const command = detectCommand(trimmed)
    if (command) {
      setTurns(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed, inputMode }])
      setInput('')
      setBusy(true)
      try {
        const result = await api.executeSystemCommand(command)
        setTurns(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: result.ok ? `✓ ${command} — ${result.message}` : `MAT.ai: gagal — ${result.error}` }])
      } catch (err: any) {
        setTurns(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: `MAT.ai ralat command: ${err.message || err}` }])
      } finally { setBusy(false) }
      return
    }

    const assistantTurnId = crypto.randomUUID()
    
    let uiAttachment = undefined
    if (inputMode === 'image' && attachment) {
      uiAttachment = {
        type: 'image',
        name: attachment.name,
        url: attachment.data.startsWith('data:') 
          ? attachment.data 
          : `data:${attachment.type || 'image/png'};base64,${attachment.data}`
      }
    }

    const userDisplayTeks = trimmed || `[Menghantar gambar: ${attachment?.name}]`
    
    setTurns(prev => [
      ...prev, 
      { 
        id: crypto.randomUUID(), 
        role: 'user', 
        text: userDisplayTeks, 
        inputMode,
        attachment: uiAttachment
      }, 
      { id: assistantTurnId, role: 'assistant', text: '' }
    ])
    setInput('')
    setBusy(true)

    const tutupWayarStream = api.onStreamChunk((perkataan: string) => {
      setTurns(prev => prev.map(turn => turn.id === assistantTurnId ? { ...turn, text: turn.text + perkataan } : turn))
    })

    try {
      let cleanAttachmentPayload = undefined
      
      if (inputMode === 'image' && attachment && attachment.data) {
        const imageUrl = attachment.data.startsWith('data:')
          ? attachment.data
          : `data:${attachment.type};base64,${attachment.data}`
        
        cleanAttachmentPayload = {
          type: 'image',
          name: attachment.name,
          url: imageUrl
        }
      }

      const result = await api.chat({
        userText: trimmed,
        uiSelection: uiSelection,
        inputMode: inputMode,
        localModelName: selectedLocalModel,
        attachment: cleanAttachmentPayload 
      })
      
      if (result.ok) {
        // 🛠️ DAH KEMAS MAT: Saja letak log kat sini tanda frontend tak payah melalak suara robot Windows
        console.log("🎯 [FRONTEND]: Backend sukses, menyekat suara robot lama.");
      } else {
        setTurns(prev => prev.map(turn => turn.id === assistantTurnId ? { ...turn, text: `MAT.ai Backend Error: ${result.error}` } : turn))
      }
    } catch (err: any) {
      // 🛠️ DAH KEMAS MAT: Blok catch dikembalikan ke jalan yang benar
      setTurns(prev => prev.map(turn => turn.id === assistantTurnId ? { ...turn, text: `MAT.ai Frontend Crash: ${err.message || err}` } : turn))
    } finally {
      tutupWayarStream()
      setBusy(false)
    }
  }, [busy, speak, uiSelection, selectedLocalModel])

  useEffect(() => { sendRef.current = sendWithText }, [sendWithText])

  const stopWhisperAndTranscribe = useCallback(async () => {
    const api = getMatAiApi()
    const rec = micRecorderRef.current
    if (!api?.transcribeAudio || !rec) return
    setListening(false)
    setVoiceBusy(true)
    try {
      const blob = await rec.stop()
      const buf = new Uint8Array(await blob.arrayBuffer())
      const result = await api.transcribeAudio(buf)
      if (result.ok && result.text?.trim()) {
        setInput(result.text.trim())
        void sendRef.current(result.text.trim(), 'voice')
      }
    } catch (e) {
      setVoiceError('Ralat mic')
    } finally { setVoiceBusy(false) }
  }, [])

  const onMicToggle = useCallback(async () => {
    if (micEngine === 'whisper') {
      const rec = micRecorderRef.current
      if (!rec || voiceBusy) return
      if (!listening) {
        await rec.start()
        setListening(true)
      } else {
        await stopWhisperAndTranscribe()
      }
    } else if (micEngine === 'webspeech') {
      const r = recogRef.current
      if (r) listening ? r.stop() : r.start()
    }
  }, [listening, micEngine, stopWhisperAndTranscribe, voiceBusy])

  const micDisabled = !bridgeReady || voiceBusy || micEngine === 'none'
  const micTitle = micEngine === 'whisper' ? 'OpenAI Whisper' : 'Web Speech'

  return {
    bridgeReady, input, setInput, turns, busy, voiceError, listening, voiceBusy,
    micEngine, micDisabled, micTitle, onMicToggle, sendWithText,
    uiSelection, setUiSelection,
    selectedLocalModel, setSelectedLocalModel
  }
}