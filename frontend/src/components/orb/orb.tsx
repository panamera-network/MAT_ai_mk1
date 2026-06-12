// frontend/src/components/orb/orb.tsx
import { useState, useEffect } from 'react';
import '../../App.css'; // Pastikan fail CSS kau di-import mat

export function Orb() {
  // 🎯 State untuk kawal status Mat AI (true = aktif/melompat, false = standby/flat)
  const [isActive, setIsActive] = useState(true);

  // --- TEST DRIVE MANUAL ---
  useEffect(() => {
    // Lepas 3 saat, kita bagi dia standby (senyap)
    const timer1 = setTimeout(() => {
      setIsActive(false);
    }, 3000);

    // Lepas 7 saat, kita bangunkan dia balik!
    const timer2 = setTimeout(() => {
      setIsActive(true);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="jarvis-container">
      {/* 🎯 Kalau isActive itu false, dia akan tambah class 'silent' secara automatik mat! */}
      <div className="avatar-circle">
        <div className={`waveform ${!isActive ? 'silent' : ''}`}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      {/* Teks status bertukar ikut state React */}
      <p id="status-text" style={{ color: isActive ? '#00f2fe' : '#555' }}>
        {isActive ? 'MAT.AI: Sedia Dengar Tuan...' : 'MAT.AI: Standby...'}
      </p>
    </div>
  );
}

export default Orb;