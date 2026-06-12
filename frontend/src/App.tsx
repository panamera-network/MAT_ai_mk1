import { useEffect, useRef, useState } from 'react'
import { useMatAi } from './hooks/useMatAi/index'
import { ChatPanel } from './components/chat/ChatPanel'
import { MicButton } from './components/voice/MicButton'
import { MatWave } from './components/orb/MatWave'

// 🎯 1. IMPORT KOMPONEN ASLI KAU MAT!
import { ModelSelector } from './components/chat/ModelSelector' 
import './App.css'

export function App(): JSX.Element {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showModelMenu, setShowModelMenu] = useState<boolean>(false)

  // Ambil state penuh dari hook padu kau mat
  const {
  bridgeReady, input, setInput, turns, busy, voiceError, listening,
  voiceBusy, micEngine, onMicToggle, sendWithText,
  uiSelection, setUiSelection, selectedLocalModel, setSelectedLocalModel
} = useMatAi()

  const micDisabled = !bridgeReady || voiceBusy || micEngine === 'none';
  const micTitle = micEngine === 'whisper' ? 'OpenAI Whisper' : micEngine === 'webspeech' ? 'Web Speech' : 'Tiada Mic';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleSend = () => {
    if (!input.trim() || busy) return;
    sendWithText(input.trim());
    setInput('');
  }

  // 🎯 2. FUNGSI UNTUK TOGGLE BUKA/KATUP KOMPONEN MODELSELECTOR
  const handleModelClick = () => {
  setShowModelMenu(prev => !prev);
};

  return (
    <div className="app-shell">
      {/* ⚙️ Header Minimalis */}
      <header className="app-header">
        <div className="brand-name">MAT.ai</div>
        <button type="button" onClick={toggleTheme} className="settings-btn">
          ⚙️
        </button>
      </header>

      {/* 🌊 Pusat Utama */}
      <main className="main-content">
        <div className="jarvis-container">
          {/* 🎯 KITA HANTAR 3 VARIABLE SEBENAR DARI HOOK KAU MAT */}
          <MatWave 
            listening={listening} 
            busy={busy} 
            voiceBusy={voiceBusy} 
          />
        </div>

        <div className="chat-display-area">
          <ChatPanel turns={turns} bottomRef={bottomRef} />
        </div>
      </main>

      {/* 🎛️ Composer Bahagian Bawah */}
      <footer className="app-footer">
        {voiceError && <div className="voice-error">{voiceError}</div>}
        
        <div className="unified-input-wrapper">
          
          {/* Belah Kiri */}
          <div className="input-left-side">
            <button type="button" className="attach-btn" onClick={() => alert('Feature attach file coming soon mat!')}>+</button>
            <input 
              type="text"
              className="main-chat-input"
              placeholder="ask mat"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
          </div>

          {/* Belah Kanan */}
          <div className="input-actions-right" style={{ position: 'relative' }}>
            
            {/* Badge Model yang boleh diklik mat */}
            <div 
              className="model-badge-pill" 
              onClick={handleModelClick} 
              role="button"
              style={{ cursor: 'pointer' }}
            >
              {selectedLocalModel || 'gemini flash'}
            </div>

            {/* 🎯 FIX TYPESCRIPT: Guna showModelMenu & hantar nilai yang sepadan dengan jenis data hook kau */}
            {showModelMenu && (
              <ModelSelector
                currentMode={uiSelection} // Sbb error kata uiSelection ialah 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'
                selectedLocalModel={selectedLocalModel || 'llama3.1:8b'}
                onSelectModel={(mode, modelName) => {
                  // 1. Set jenis mod (FAST_LOCAL / FAST_CLOUD / BRAIN)
                  if (setUiSelection) {
                    setUiSelection(mode);
                  }
                  // 2. Set nama model pilihan (contoh: gpt-4o, llama, dll)
                  if (setSelectedLocalModel) {
                    setSelectedLocalModel(modelName);
                  }
                  // 3. Katup balik popover menu mat
                  setShowModelMenu(false);
                }}
              />
            )}

            {/* Butang Hantar */}
            <button type="button" className="send-plane-btn" onClick={handleSend} disabled={busy}>
              <svg viewBox="0 0 24 24" className="plane-icon">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>

            {/* Butang Mic */}
            <div className="mic-wrapper-circular">
              <MicButton
                micEngine={micEngine}
                listening={listening}
                voiceBusy={voiceBusy}
                micDisabled={micDisabled}
                micTitle={micTitle}
                onMicToggle={onMicToggle}
              />
            </div>

          </div>

        </div>
      </footer>
    </div>
  )
}