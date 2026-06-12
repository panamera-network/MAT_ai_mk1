// frontend/src/components/chat/ModelSelector.tsx
import React from 'react'

interface ModelSelectorProps {
  currentMode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'
  selectedLocalModel: string
  onSelectModel: (mode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN', modelName: string) => void
}

export function ModelSelector({ currentMode, selectedLocalModel, onSelectModel }: ModelSelectorProps): JSX.Element {
  
  // Trik fungsi pembantu untuk semak butang mana yang tengah aktif mat
  const checkActive = (mode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN', name: string) => {
    return currentMode === mode && selectedLocalModel === name ? 'active' : ''
  }

  return (
    <div 
      className="model-selector-popover"
      style={{
        width: '300px',
        maxHeight: '400px', 
        overflowY: 'auto',   
        backgroundColor: '#1e1e24',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        position: 'absolute',
        bottom: '40px', // Floating tepat kat atas butang pil
        right: '0',
        zIndex: 999
      }}
    >
      {/* ======================================================== */}
      {/* ⚡ FAST MODE SECTION */}
      {/* ======================================================== */}
      <div className="mode-section" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9f43', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
          <span>⚡ FAST MODE</span>
        </div>

        {/* --- LOCAL Sub-Section --- */}
        <div style={{ marginLeft: '8px', marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            ├─ Local Ollama
          </div>
          <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'llama3.1:8b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'llama3.1:8b')}`}>🦙 llama3.1:8b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'llama3.2-vision:latest')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'llama3.2-vision:latest')}`}>👁️ llama3.2-vision</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'phi4-mini:latest')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'phi4-mini:latest')}`}>🔬 phi4-mini:latest</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'phi4:14b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'phi4:14b')}`}>🔬 phi4:14b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'gemma4:e4b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'gemma4:e4b')}`}>💎 gemma4:e4b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'gemma4:26b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'gemma4:26b')}`}>💎 gemma4:26b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'qwen3:4b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'qwen3:4b')}`}>🇨🇳 qwen3:4b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'qwen3.5:4b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'qwen3.5:4b')}`}>🇨🇳 qwen3.5:4b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'qwen3-vl:4b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'qwen3-vl:4b')}`}>👁️ qwen3-vl:4b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'command-r7b:7b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'command-r7b:7b')}`}>📜 command-r7b</button>
            <button type="button" onClick={() => onSelectModel('FAST_LOCAL', 'nous-hermes:7b')} className={`model-item-btn ${checkActive('FAST_LOCAL', 'nous-hermes:7b')}`}>🧙‍♂️ nous-hermes</button>
          </div>
        </div>

        {/* --- CLOUD Sub-Section --- */}
        <div style={{ marginLeft: '8px' }}>
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            └─ Cloud API
          </div>
          <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button type="button" onClick={() => onSelectModel('FAST_CLOUD', 'gpt-4o-mini')} className={`model-item-btn ${checkActive('FAST_CLOUD', 'gpt-4o-mini')}`}>🟢 GPT-Mini</button>
            <button type="button" onClick={() => onSelectModel('FAST_CLOUD', 'gemini-2.5-flash')} className={`model-item-btn ${checkActive('FAST_CLOUD', 'gemini-2.5-flash')}`}>🔵 Gemini Flash</button>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '10px 0' }} />

      {/* ======================================================== */}
      {/* 🧠 BRAIN MODE SECTION */}
      {/* ======================================================== */}
      <div className="mode-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b6b', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
          <span>🧠 BRAIN MODE</span>
        </div>

        {/* --- LOCAL HEAVY Sub-Section --- */}
        <div style={{ marginLeft: '8px', marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            ├─ Local Heavy
          </div>
          <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button type="button" onClick={() => onSelectModel('BRAIN', 'gemma4:26b')} className={`model-item-btn ${checkActive('BRAIN', 'gemma4:26b')}`}>🦕 gemma4:26b</button>
          </div>
        </div>

        {/* --- CLOUD EXPERT Sub-Section --- */}
        <div style={{ marginLeft: '8px' }}>
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            └─ Cloud Expert
          </div>
          <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button type="button" onClick={() => onSelectModel('BRAIN', 'gpt-4o')} className={`model-item-btn ${checkActive('BRAIN', 'gpt-4o')}`}>🔥 GPT-4o</button>
            <button type="button" onClick={() => onSelectModel('BRAIN', 'gemini-2.5-pro')} className={`model-item-btn ${checkActive('BRAIN', 'gemini-2.5-pro')}`}>🌌 Gemini-Pro</button>
            <button type="button" onClick={() => onSelectModel('BRAIN', 'kimi-k2')} className={`model-item-btn ${checkActive('BRAIN', 'kimi-k2')}`}>🐱 Kimi K2</button>
            <button type="button" onClick={() => onSelectModel('BRAIN', 'claude-3.5-sonnet')} className={`model-item-btn ${checkActive('BRAIN', 'claude-3.5-sonnet')}`}>🧡 Claude 3.5</button>
          </div>
        </div>
      </div>

    </div>
  )
}