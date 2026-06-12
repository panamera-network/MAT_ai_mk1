import React, { useEffect, useRef } from 'react';

export const Waveform = ({ audioStream, isListening }: { audioStream: MediaStream | null, isListening: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioStream || !isListening) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current!;
    const canvasCtx = canvas.getContext('2d')!;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = '#10B981'; // Warna hijau "Mat"

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        canvasCtx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
      }
    };
    draw();

    return () => { audioContext.close(); };
  }, [audioStream, isListening]);

  return <canvas ref={canvasRef} width={200} height={50} className="rounded-lg" />;
};