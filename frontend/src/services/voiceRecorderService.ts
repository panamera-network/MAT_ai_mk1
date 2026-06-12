/**
 * **Renderer-only** microphone capture using `MediaRecorder` (WebM/Opus when supported).
 * Audio is sent to the main process for OpenAI Whisper — no Google Web Speech API.
 */

function pickMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
  if (typeof MediaRecorder === 'undefined') return undefined
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return undefined
}

export function isMicRecordingSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  )
}

// 🛠️ DAH KEMAS MAT: Tambah property stream kat interface supaya TS tak marah
export interface MicRecorder {
  /** Access the current MediaStream for VAD or Audio Visualizers */
  readonly stream: MediaStream | null;
  /** Starts capturing from the default microphone. */
  start: () => Promise<void>
  /** Stops capture and returns one audio blob (WebM when supported). */
  stop: () => Promise<Blob>
  /** Releases microphone tracks (call on unmount / error). */
  dispose: () => void
}

/**
 * Factory for a single recording session (start → stop → dispose).
 */
export function createMicRecorder(): MicRecorder {
  let stream: MediaStream | null = null
  let recorder: MediaRecorder | null = null
  const chunks: Blob[] = []

  const dispose = () => {
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop()
      } catch {
        // ignore
      }
    }
    recorder = null
    if (stream) {
      for (const t of stream.getTracks()) {
        t.stop()
      }
      stream = null
    }
    chunks.length = 0
  }

  return {
    // 🛠️ DAH KEMAS MAT: Letak getter ni supaya fail luar (index.ts) boleh baca rec.stream
    get stream() {
      return stream;
    },

    async start() {
      dispose()
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('MAT.ai: getUserMedia tidak tersedia.')
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false,
        })
        const mime = pickMimeType()
        recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
        chunks.length = 0
        recorder.ondataavailable = (ev: BlobEvent) => {
          if (ev.data && ev.data.size > 0) chunks.push(ev.data)
        }
        await new Promise<void>((resolve, reject) => {
          if (!recorder) return reject(new Error('MAT.ai: recorder init failed.'))
          recorder.onerror = () => reject(new Error('MAT.ai: MediaRecorder error.'))
          recorder.onstart = () => resolve()
          recorder.start(250)
        })
      } catch (e) {
        dispose()
        throw e instanceof Error ? e : new Error(String(e))
      }
    },

    async stop() {
      if (!recorder || recorder.state === 'inactive') {
        dispose()
        throw new Error('MAT.ai: rakaman belum dimulakan.')
      }
      const finalBlob = await new Promise<Blob>((resolve, reject) => {
        if (!recorder) return reject(new Error('MAT.ai: recorder missing.'))
        recorder.onerror = () => reject(new Error('MAT.ai: MediaRecorder error on stop.'))
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' })
          resolve(blob)
        }
        try {
          recorder.stop()
        } catch (e) {
          reject(e instanceof Error ? e : new Error(String(e)))
        }
      })
      dispose()
      return finalBlob
    },

    dispose,
  }
}