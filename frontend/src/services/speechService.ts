//speechService.ts
/**
 * Speech-to-text for the **renderer** (browser APIs).
 *
 * Uses the Web Speech API (`SpeechRecognition`). Chromium (Electron) supports it;
 * recognition is often cloud-backed, so a working network path matters.
 */

export type RecognitionState = 'idle' | 'listening' | 'unsupported'

export interface SpeechRecognitionCallbacks {
  /** Fired once with the final transcript (same pattern as the old MicButton). */
  onFinalTranscript: (text: string) => void
  /** Optional error hook for UI messaging. */
  onError?: (message: string) => void
  /** Lets React show a “listening…” pulse without polling internal state. */
  onListeningChange?: (listening: boolean) => void
}

/**
 * Detects constructor for SpeechRecognition across Chromium prefixes.
 */
function getSpeechRecognitionCtor(): any {
  if (typeof window === 'undefined') return undefined
  
  const w = window as any
  // Dia akan cari standard atau prefix webkit bawaan Chromium Electron
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(getSpeechRecognitionCtor())
}

function describeSpeechError(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'MAT.ai: mikrofon / speech recognition ditolak. Semak kebenaran mikrofon dalam Tetapan Windows / macOS.'
    case 'no-speech':
      return 'MAT.ai: tiada suara dikesan. Cuba lagi dan cakap lebih dekat dengan mikrofon.'
    case 'audio-capture':
      return 'MAT.ai: tiada input audio (mikrofon sibuk atau tidak disambung).'
    case 'network':
      return 'MAT.ai: speech recognition memerlukan sambungan rangkaian (perkhidmatan cloud Chromium/Google).'
    case 'aborted':
      return 'MAT.ai: rakaman suara dibatalkan.'
    case 'service-not-allowed':
      return 'MAT.ai: perkhidmatan speech tidak dibenarkan pada persekitaran ini.'
    default:
      return `MAT.ai: speech error (${code}).`
  }
}

/**
 * Creates a one-shot recognizer configured for Malay (`ms-MY`) by default.
 * Call `start()` / `stop()` from your React component.
 */

// frontend/src/core/voice/speechService.ts

/**
 * Creates a one-shot recognizer configured for Malay (`ms-MY`) by default.
 * Call `start()` / `stop()` from your React component.
 */
export function createSpeechRecognizer(
  callbacks: SpeechRecognitionCallbacks,
  options?: { lang?: string; continuous?: boolean; interimResults?: boolean },
): {
  start: () => void
  stop: () => void
  getState: () => RecognitionState
} {
  const Ctor = getSpeechRecognitionCtor()
  if (!Ctor) {
    return {
      start: () => callbacks.onError?.('MAT.ai: speech recognition tidak disokong.'),
      stop: () => undefined,
      getState: () => 'unsupported' as const,
    }
  }

  const recognition = new Ctor()
  recognition.lang = options?.lang ?? 'ms-MY'
  recognition.continuous = options?.continuous ?? false
  recognition.interimResults = options?.interimResults ?? false
  recognition.maxAlternatives = 1

  let state: RecognitionState = 'idle'

  recognition.onnomatch = () => {
    state = 'idle'
    callbacks.onListeningChange?.(false)
  }

  // Web Speech API event types (SpeechRecognitionEvent / SpeechRecognitionErrorEvent)
  // are not in TS's DOM lib — the recognizer itself is already an untyped ctor above.
  recognition.onresult = (event: any) => {
    const firstResult = event.results[0]
    if (!firstResult || !firstResult[0]) {
      state = 'idle'
      callbacks.onListeningChange?.(false)
      return
    }
    const transcript = firstResult[0].transcript.trim()
    if (transcript) {
      callbacks.onFinalTranscript(transcript)
    }
    state = 'idle'
    callbacks.onListeningChange?.(false)
  }

  recognition.onerror = (event: any) => {
    state = 'idle'
    callbacks.onListeningChange?.(false)
    callbacks.onError?.(describeSpeechError(event.error))
  }

  recognition.onend = () => {
    state = 'idle'
    callbacks.onListeningChange?.(false)
  }

  return {
    start: () => {
      if (state === 'listening') return
      try {
        state = 'listening'
        callbacks.onListeningChange?.(true)
        recognition.start()
      } catch {
        state = 'idle'
        callbacks.onListeningChange?.(false)
        callbacks.onError?.(
          'MAT.ai: tidak dapat mulakan mikrofon. Cuba semula, atau semak kebenaran mikrofon dalam sistem.',
        )
      }
    },
    stop: () => {
      try {
        recognition.stop()
      } catch {
        // ignore
      }
      state = 'idle'
      callbacks.onListeningChange?.(false)
    },
    getState: () => state,
  }
}