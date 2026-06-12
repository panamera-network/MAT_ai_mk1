// frontend/src/components/voice/MicButton.tsx
import React from 'react';
import './MicButton.css'; // Kita akan buat fail CSS ni jap lagi mat!

interface MicButtonProps {
  micEngine: string;
  listening: boolean;
  voiceBusy: boolean;
  micDisabled: boolean;
  micTitle: string;
  onMicToggle: () => void;
}

export function MicButton({
  listening,
  voiceBusy,
  micDisabled,
  micTitle,
  onMicToggle
}: MicButtonProps): JSX.Element {
  
  // 🎯 Penentu keadaan: Kalau tengah dengar ATAU tengah sibuk proses, butang akan bertukar mod
  const isActive = listening || voiceBusy;

  return (
    <button
      type="button"
      className={`mic-circular-btn ${listening ? 'is-listening' : ''} ${voiceBusy ? 'is-busy' : ''}`}
      disabled={micDisabled}
      title={micTitle}
      onClick={onMicToggle}
    >
      {/* 🔮 PUSINGAN MAGIC DI SINI MAT */}
      {isActive ? (
        // Kalau tengah bercakap/thinking, tunjuk bulatan spinner yang berpusing padu
        <div className="button-spinner-container">
          <div className="button-spinner-ring" />
          <span className="button-status-text">
            {voiceBusy ? '🧠' : '🛑'}
          </span>
        </div>
      ) : (
        // Kalau idle biasa, tunjuk ikon mic asal kau mat
        <div className="button-idle-content">
          <span className="mic-emoji-icon">🎙️</span>
          
        </div>
      )}
    </button>
  );
}