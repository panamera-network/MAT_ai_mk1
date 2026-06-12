// frontend/src/components/orb/mat-waveform.jsx
import { useState, useEffect, useRef } from "react";

const STATES = ["idle", "listening", "thinking"];
const NAMES = ["Idle", "Mendengar...", "Berfikir..."];
const LABELS = ["Ketuk untuk mula", "Bercakap sekarang", "Sedang memproses..."];
const DOT_COLORS = ["#555577", "#007AFF", "#AF52DE"];

function easeInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(c1, c2, t) {
  const h = s => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
  const [r1,g1,b1] = h(c1), [r2,g2,b2] = h(c2);
  return `#${Math.round(lerp(r1,r2,t)).toString(16).padStart(2,"0")}${Math.round(lerp(g1,g2,t)).toString(16).padStart(2,"0")}${Math.round(lerp(b1,b2,t)).toString(16).padStart(2,"0")}`;
}

function getLinePoints(time, W, H, COUNT, isListening) {
  const CY = H / 2;
  const pts = [];
  for (let i = 0; i <= COUNT; i++) {
    const prog = i / COUNT;
    const x = W * 0.06 + prog * (W * 0.88);
    let y = CY;
    if (isListening) {
      const phase = time * 2.2;
      const env = Math.sin(prog * Math.PI);
      y = CY + (
        -Math.sin(prog * Math.PI * 3 - phase) * (H * 0.33) +
         Math.sin(prog * Math.PI * 5 - phase * 0.7) * (H * 0.12) +
         Math.sin(prog * Math.PI * 8 - phase * 1.3) * (H * 0.05)
      ) * env;
    } else {
      y = CY + Math.sin(prog * Math.PI * 2 + time * 0.5) * (H * 0.018);
    }
    pts.push({ x, y });
  }
  return pts;
}

function getCirclePoints(time, W, H, COUNT) {
  const CX = W / 2, CY = H / 2;
  const R = Math.min(W, H) * 0.32;
  const pts = [];
  for (let i = 0; i <= COUNT; i++) {
    const angle = (i / COUNT) * 2 * Math.PI + time * 1.4;
    pts.push({ x: CX + Math.cos(angle) * R, y: CY + Math.sin(angle) * R });
  }
  return pts;
}

function lerpPoints(a, b, t) {
  return a.map((pa, i) => {
    const pb = b[Math.min(i, b.length - 1)];
    return { x: lerp(pa.x, pb.x, t), y: lerp(pa.y, pb.y, t) };
  });
}

function getGradientStops(s) {
  if (s === "idle")      return ["#3a3a6c", "#6655aa", "#3a3a6c"];
  if (s === "listening") return ["#007AFF", "#AF52DE", "#FF2D55"];
  if (s === "thinking")  return ["#AF52DE", "#5E5CE6", "#007AFF"];
  return ["#555577","#555577","#555577"];
}

// Build tapered segments — each is a short 2-point path with own strokeWidth
// strokeWidth = thin at edges, thick at center, following a sine envelope
// SEGMENTS = number of drawn segments (less than COUNT for performance)
const SEGMENTS = 60;

function buildSegmentPaths(pts, minW, maxW) {
  const total = pts.length - 1;
  const step = Math.floor(total / SEGMENTS);
  const paths = [];
  for (let s = 0; s < SEGMENTS; s++) {
    const i0 = s * step;
    const i1 = Math.min(i0 + step, total);
    const prog = (s + 0.5) / SEGMENTS; // centre of segment, 0..1

    // sine envelope: thin at edges, thick at center
    const env = Math.sin(prog * Math.PI);
    const sw = lerp(minW, maxW, env);

    // build mini path from i0 to i1
    let d = `M ${pts[i0].x.toFixed(1)} ${pts[i0].y.toFixed(1)}`;
    for (let k = i0 + 1; k <= i1; k++) {
      const mx = (pts[k-1].x + pts[k].x) / 2;
      const my = (pts[k-1].y + pts[k].y) / 2;
      d += ` Q ${pts[k-1].x.toFixed(1)} ${pts[k-1].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    paths.push({ d, sw, prog });
  }
  return paths;
}

// (Pastikan function easeInOut, lerp, getLinePoints, dll kat atas tu dikegalkan!)

export function MatWaveform({ stateIdx }) {
  const prevIdxRef = useRef(0);
  const morphRef   = useRef(1);
  const timeRef    = useRef(0);
  const frameRef   = useRef(null);

  const W = 340, H = 160, COUNT = 200;
  const [segments, setSegments] = useState([]);
  
  const grad1Ref = useRef(null);
  const grad2Ref = useRef(null);
  const grad3Ref = useRef(null);
  const circleMainRef  = useRef(null);
  const circleGlowRef  = useRef(null);
  const circleShineRef = useRef(null);

  // 🎯 KORANG PUNYA LOGIK UPDATE BILA STATEIDX BERUBAH
  useEffect(() => {
    morphRef.current = 0; // Reset morph setiap kali state bertukar mat!
    
    const animate = () => {
      timeRef.current += 0.016;
      if (morphRef.current < 1) morphRef.current = Math.min(1, morphRef.current + 0.014);

      const ease = easeInOut(morphRef.current);
      const cur  = STATES[stateIdx];
      const prev = STATES[prevIdxRef.current];
      const t    = timeRef.current;
      const morphDone = morphRef.current >= 0.98;

      const stopsA = getGradientStops(prev);
      const stopsB = getGradientStops(cur);
      const stops  = stopsA.map((c, i) => lerpColor(c, stopsB[i], ease));
      [grad1Ref, grad2Ref, grad3Ref].forEach(ref => {
        if (!ref.current) return;
        const ch = ref.current.children;
        if (ch[0]) ch[0].setAttribute("stop-color", stops[0]);
        if (ch[1]) ch[1].setAttribute("stop-color", stops[1]);
        if (ch[2]) ch[2].setAttribute("stop-color", stops[2]);
      });

      const R = Math.min(W, H) * 0.32;

      if (cur === "thinking" && morphDone) {
        const circlePts = [];
        for (let i = 0; i <= COUNT; i++) {
          const angle = (i / COUNT) * 2 * Math.PI + t * 1.4;
          circlePts.push({ x: (W/2) + Math.cos(angle) * R, y: (H/2) + Math.sin(angle) * R });
        }
        const segs = buildSegmentPaths(circlePts, 0.4, 5.5);
        setSegments(segs);
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const curPts  = cur === "thinking" ? getCirclePoints(t, W, H, COUNT) : getLinePoints(t, W, H, COUNT, cur === "listening");
      const prevPts = prev === "thinking" ? getCirclePoints(t, W, H, COUNT) : getLinePoints(t, W, H, COUNT, prev === "listening");
      const pts = morphRef.current >= 1 ? curPts : lerpPoints(prevPts, curPts, ease);

      const segs = buildSegmentPaths(pts, 0.4, 5.5);
      setSegments(segs);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      prevIdxRef.current = stateIdx; // Simpan index lama masa unmount/change
    };
  }, [stateIdx]);

  const curColor = DOT_COLORS[stateIdx];
  const CX = W / 2, CY = H / 2, R = Math.min(W, H) * 0.32;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: curColor, marginBottom: 12, transition: "color 0.6s", minHeight: 24 }}>
        {NAMES[stateIdx]}
      </div>

      <div style={{ width: W, height: H, position: "relative" }}>
        <div style={{ position: "absolute", inset: -24, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${curColor}1a 0%, transparent 70%)`, transition: "background 1s", pointerEvents: "none" }} />
        <svg width={W} height={H} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%" ref={grad1Ref}><stop offset="0%" stopColor="#3a3a6c" /><stop offset="50%" stopColor="#6655aa" /><stop offset="100%" stopColor="#3a3a6c" /></linearGradient>
            <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%" ref={grad2Ref}><stop offset="0%" stopColor="#3a3a6c" /><stop offset="50%" stopColor="#6655aa" /><stop offset="100%" stopColor="#3a3a6c" /></linearGradient>
            <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="0%" ref={grad3Ref}><stop offset="0%" stopColor="#3a3a6c" /><stop offset="50%" stopColor="#6655aa" /><stop offset="100%" stopColor="#3a3a6c" /></linearGradient>
          </defs>
          {segments.map((seg, i) => ( <path key={`g${i}`} d={seg.d} fill="none" stroke="url(#wg1)" strokeWidth={seg.sw * 4} strokeLinecap="round" strokeLinejoin="round" opacity={0.15} /> ))}
          {segments.map((seg, i) => ( <path key={`m${i}`} d={seg.d} fill="none" stroke="url(#wg2)" strokeWidth={seg.sw} strokeLinecap="round" strokeLinejoin="round" /> ))}
          {segments.map((seg, i) => ( <path key={`s${i}`} d={seg.d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={seg.sw * 0.28} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} /> ))}
        </svg>
      </div>
    </div>
  );
}