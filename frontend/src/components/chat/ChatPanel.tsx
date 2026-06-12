// frontend/src/components/chat/ChatPanel.tsx
import React from 'react'

interface ChatPanelProps {
  turns: ChatTurn[]
  bottomRef: React.RefObject<HTMLDivElement>
}

export function ChatPanel({ turns, bottomRef }: ChatPanelProps): JSX.Element {
  return (
    <div className="messages" role="log" aria-live="polite">
      {turns.length === 0 && (
        <div className="empty-hint">
          
          <p>
            <strong>MAT.ai</strong> sedia membantu. Taip soalan anda, atau guna <strong>Mic</strong>.
          </p>
          <p className="muted">
            Jika <code>OPENAI_API_KEY</code> ada dalam <code>.env</code>: Mic guna <strong>OpenAI Whisper</strong>{' '}
            (klik mula rakam, klik lagi berhenti & hantar ke chat). Tanpa kunci API, Mic cuba Web Speech.
          </p>
          <p className="muted">
            Pilihan: <code>OPENAI_TRANSCRIBE_LANGUAGE=ms</code> dalam <code>.env</code> untuk bias bahasa Melayu.
          </p>
          <p className="muted">
            DevTools: <code>MAT_AI_OPEN_DEVTOOLS=1</code> sebelum <code>npm run dev</code> jika perlu debug.
          </p>
        </div>
      )}

      {turns.map((t) => (
        <div key={t.id} className={`bubble-row ${t.role}`}>
          <div className="bubble-meta">{t.role === 'user' ? 'You' : 'MAT.ai'}</div>
          <div className={`bubble ${t.role}`}>
            
            {/* 📸 1. TAMBAH KAT SINI: Render gambar kalau objek attachment wujud */}
            {t.attachment && t.attachment.type === 'image' && (
              <div 
                className="chat-image-container" 
                style={{ 
                  marginBottom: '8px',
                  display: 'block',
                  maxWidth: '100%'
                }}
              >
                <img 
                  src={t.attachment.url} 
                  alt={t.attachment.name} 
                  style={{ 
                    maxWidth: '240px', 
                    maxHeight: '180px',
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
                <span style={{ fontSize: '10px', color: '#888', display: 'block', marginTop: '2px' }}>
                  🖼️ {t.attachment.name}
                </span>
              </div>
            )}

            {/* 2. Teks asal sembang kau */}
            <div className="bubble-text">{t.text}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}