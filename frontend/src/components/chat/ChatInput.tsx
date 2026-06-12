// frontend/src/components/chat/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react'
import { ModelSelector } from './ModelSelector'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  busy: boolean
  onSend: (attachedFile?: any) => void
  children?: React.ReactNode

  currentMode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'
  setCurrentMode: (mode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN') => void
  selectedLocalModel: string
  setSelectedLocalModel: (model: string) => void
}

export function ChatInput({
  input, setInput, busy, onSend, children,
  currentMode, setCurrentMode, selectedLocalModel, setSelectedLocalModel
}: ChatInputProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [attachment, setAttachment] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) // 🎯 Ref untuk jaga tinggi textarea

  // 1. Logik Auto-Resize Textarea (Membesar ikut panjang teks)
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' // Reset tinggi
      // Set tinggi baru mengikut scrollHeight (maksimum kita hadkan dalam CSS nanti)
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pilihModel = (mode: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN', modelName: string) => {
    setCurrentMode(mode)
    setSelectedLocalModel(modelName)
    setIsOpen(false)
  }

  const dapatkanLabelButang = () => {
    // 🎯 KUNCI UTAMA: Kalau mod Cloud, jangan baca state selectedLocalModel! 
    // Terus tulis GPT-Mini atau ChatGPT!
    if (currentMode === 'FAST_CLOUD') {
      return selectedLocalModel === 'gpt-4o-mini' ? '☁️ GPT-Mini' : '☁️ ChatGPT';
    }
    if (currentMode === 'BRAIN') {
      return '🧠 Autonomous';
    }
    return `⚡ ${selectedLocalModel.split(':')[0]}`;
  }

  // HTML5 Native Picker (100% Frontend Pasif)
  const handleSelectFile = () => {
    console.log("🎯 FRONTEND: Butang + diklik! Menggunakan HTML5 Native Picker.");
    const inputElemen = document.createElement('input');
    inputElemen.type = 'file';
    inputElemen.accept = '.png, .jpg, .jpeg, .txt, .md, .json';

    inputElemen.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const fail = target.files[0];
      const namaFail = fail.name;
      const ekstensi = namaFail.slice(namaFail.lastIndexOf('.')).toLowerCase();
      const reader = new FileReader();

      if (['.png', '.jpg', '.jpeg'].includes(ekstensi)) {
        reader.onload = () => {
          setAttachment({
            ok: true,
            type: 'image',
            name: namaFail,
            data: reader.result
          });
        };
        reader.readAsDataURL(fail);
      } else if (['.txt', '.md', '.json'].includes(ekstensi)) {
        reader.onload = () => {
          setAttachment({
            ok: true,
            type: 'text_file',
            name: namaFail,
            content: reader.result
          });
        };
        reader.readAsText(fail);
      }
    };
    inputElemen.click();
  };

  const handleMesejHantar = () => {
    console.log("🚀 MAT.ai Debug: Butang enter diketuk! Input semasa ialah:", input, "| Status busy ialah:", busy);
    const textTerkini = input.trim();
    if (!input.trim() && !attachment) return;
    
    // Hantar data ke fail induk
    onSend(attachment);
    
    setInput(''); 
    setAttachment(null); 
    
    // Reset balik tinggi textarea ke asal lepas hantar
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* 👑 CAPSULE BOX UTAMA (Kini memegang Preview & Textarea sekali) */}
      <div className="gemini-composer-container" style={{ 
        flexDirection: 'column', 
        alignItems: 'stretch',
        padding: '12px',
        gap: '10px',
        borderRadius: '16px'
      }}>
        
        {/* 🖼️ PREVIEW BANNER: Sekarang dia duduk DI DALAM capsule box, kat atas textarea! */}
        {attachment && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 10px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            alignSelf: 'flex-start',
            fontSize: '12px',
            marginBottom: '4px'
          }}>
            {attachment.type === 'image' ? (
              <img src={attachment.data} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '18px' }}>📄</span>
            )}
            <span style={{ fontWeight: '500', color: 'var(--text)' }}>{attachment.name}</span>
            <button 
              type="button"
              onClick={() => setAttachment(null)} 
              style={{ background: 'none', border: 'none', color: '#ffb4ab', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginLeft: '4px' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* BARISAN INPUT & BUTANG ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          
          {/* ➕ BUTANG ADD FILE */}
          <button
            type="button"
            className="gemini-plus-btn"
            onClick={handleSelectFile}
            title="Tambah fail atau gambar"
            style={{ marginBottom: '4px' }} // Kasih center sikit bila textarea meninggi
          >
            +
          </button>

          {/* ✍️ TEXTAREA (Ganti Input Baru!) */}
          <textarea
            ref={textareaRef}
            className="gemini-text-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya MAT.ai apa sahaja…"
            disabled={busy}
            rows={1}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              resize: 'none', // Sekat user dari tarik bucu manual
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '20px',
              padding: '6px 0',
              maxHeight: '200px', // Had tinggi maksimum sebelum keluar scrollbar
              overflowY: 'auto'
            }}
            onKeyDown={(e) => {
              // Kalau tekan Enter SAHAJA -> Hantar mesej
              // Kalau tekan Shift + Enter -> Turun baris baru
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleMesejHantar()
              }
            }}
          />

          {/* 🎯 PIL SELECTION MODEL */}
          <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="model-pill-trigger">
              <span>{dapatkanLabelButang()}</span>
              <span style={{ fontSize: '9px', marginLeft: '4px' }}>▼</span>
            </button>

            {/* FLOATING MENU POP-UP: Kini diganti sepenuhnya dengan pokok dinamik! */}
            {isOpen && (
              <ModelSelector 
                currentMode={currentMode}
                selectedLocalModel={selectedLocalModel}
                onSelectModel={pilihModel}
              />
            )}
          </div>

          {/* 🎙️ BUTANG MIC */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px', marginBottom: '2px' }}>
            {children}
          </div>

          {/* 🏹 TAMBAH NI MAT: BUTANG HANTAR TEKS BIASA */}
          <button
            type="button"
            onClick={handleMesejHantar}
            disabled={busy || (!input.trim() && !attachment)}
            className="gemini-send-btn"
            title="Hantar mesej"
            style={{
              background: input.trim() || attachment ? 'var(--primary, #3b82f6)' : 'rgba(255, 255, 255, 0.05)',
              color: input.trim() || attachment ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() || attachment ? 'pointer' : 'not-allowed',
              marginBottom: '2px',
              transition: 'all 0.2s ease',
              fontSize: '14px'
            }}
          >
            ✈️
          </button>

        </div>
      </div>
    </div>
  )
}