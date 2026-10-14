import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Lightbulb, Wind, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';

interface SlateColor {
  id: string;
  name: string;
  hex: string;
  glow: string;
  subtleText: string;
}

const SLATE_COLORS: SlateColor[] = [
  {
    id: 'gold',
    name: 'Oro Caldo',
    hex: '#ffd166',
    glow: 'rgba(255, 209, 102, 0.65)',
    subtleText: 'text-amber-200'
  },
  {
    id: 'cyan',
    name: 'Ciano Tenue',
    hex: '#48cae4',
    glow: 'rgba(72, 202, 228, 0.65)',
    subtleText: 'text-cyan-200'
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    hex: '#c77dff',
    glow: 'rgba(199, 125, 255, 0.65)',
    subtleText: 'text-purple-200'
  },
  {
    id: 'ruby',
    name: 'Rosso Rubino',
    hex: '#ff5d73',
    glow: 'rgba(255, 93, 115, 0.65)',
    subtleText: 'text-rose-200'
  },
  {
    id: 'emerald',
    name: 'Verde Smeraldo',
    hex: '#38d39f',
    glow: 'rgba(56, 211, 159, 0.65)',
    subtleText: 'text-emerald-200'
  }
];

const SOOTHING_PROMPTS = [
  'Traccia ciò che senti, lascialo andare via ✨',
  'Tutto passa, anche questo 🌙',
  'Scrivi una paura e guardala svanire nel buio 💫',
  'Respira... ogni tensione è transitoria 🍃',
  'Scarica la tensione con un gesto libero 🌌'
];

interface StrokeSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  createdAt: number;
  lifetime: number; // in ms, ~3500ms
  width: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

interface PointerTrack {
  x: number;
  y: number;
  lastTime: number;
}

export const LuminescentSlate: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User Preferences & State
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [showIdlePrompt, setShowIdlePrompt] = useState(true);
  const [idlePromptIndex, setIdlePromptIndex] = useState(0);
  const [breezeFlash, setBreezeFlash] = useState(false);

  // References for ultra-smooth 60fps rendering without React re-render lag
  const segmentsRef = useRef<StrokeSegment[]>([]);
  const particlesRef = useRef<DustParticle[]>([]);
  const activePointersRef = useRef<Map<number, PointerTrack>>(new Map());
  const lastTouchTimeRef = useRef<number>(Date.now());
  const currentColorHexRef = useRef<string>(SLATE_COLORS[0].hex);
  const animationFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Sync color ref
  useEffect(() => {
    currentColorHexRef.current = SLATE_COLORS[selectedColorIndex].hex;
  }, [selectedColorIndex]);

  // Handle 6-second inactivity prompt
  const resetIdleTimer = useCallback(() => {
    lastTouchTimeRef.current = Date.now();
    setShowIdlePrompt(false);

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      setIdlePromptIndex(prev => (prev + 1) % SOOTHING_PROMPTS.length);
      setShowIdlePrompt(true);
    }, 6000);
  }, []);

  // Set up initial idle timer
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      soundManager.stopSlateTone(0.3);
    };
  }, [resetIdleTimer]);

  // "Soffio" / "Svanisci ora": dissolve all strokes with radiant wave
  const triggerBreezeDissolve = useCallback(() => {
    setBreezeFlash(true);
    window.setTimeout(() => setBreezeFlash(false), 600);

    soundManager.playSlateBreezeWhoosh();

    // Convert active segments into dispersing glowing particles
    const now = performance.now();
    const newParticles: DustParticle[] = [];
    segmentsRef.current.forEach(seg => {
      if (Math.random() < 0.25) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.2;
        newParticles.push({
          x: (seg.x1 + seg.x2) / 2,
          y: (seg.y1 + seg.y2) / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          color: seg.color,
          alpha: 0.9,
          size: 1.5 + Math.random() * 2,
          decay: 0.02 + Math.random() * 0.02
        });
      }
    });

    particlesRef.current.push(...newParticles.slice(0, 160));
    // Accelerate lifetime of remaining strokes so they vanish in 300ms
    segmentsRef.current.forEach(s => {
      s.createdAt = now - s.lifetime + 280;
    });

    resetIdleTimer();
  }, [resetIdleTimer]);

  // Canvas Main Render Loop (Optimized 60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const now = performance.now();

      // 1. Draw Deep Soothing Slate Canvas (#0d1117 with soft radial center)
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, '#151b24');
      grad.addColorStop(1, '#0d1117');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient stars / dust grains
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Draw & Age Stroke Segments
      const activeSegments: StrokeSegment[] = [];
      const segments = segmentsRef.current;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const age = (now - seg.createdAt) / seg.lifetime;

        if (age < 1.0) {
          activeSegments.push(seg);
          const alpha = Math.pow(1 - age, 1.3);

          ctx.strokeStyle = seg.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.shadowColor = seg.color;
          ctx.shadowBlur = 14 * alpha;
          ctx.lineWidth = seg.width * (0.65 + 0.35 * alpha);

          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }
      }
      ctx.restore();
      segmentsRef.current = activeSegments;

      // 3. Render Breeze Sparkle Particles
      const activeParticles: DustParticle[] = [];
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha > 0.01) {
          activeParticles.push(p);
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      particlesRef.current = activeParticles;

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Multi-Touch Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    activePointersRef.current.set(e.pointerId, { x, y, lastTime: now });
    resetIdleTimer();

    // Start or update ambient audio tone
    const xRatio = x / rect.width;
    const yRatio = y / rect.height;
    soundManager.startSlateTone(xRatio, yRatio);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    const prev = activePointersRef.current.get(e.pointerId);
    if (!prev) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const dx = x - prev.x;
    const dy = y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only record if moved a perceptible distance
    if (dist > 1.2) {
      // Dynamic line width based on speed for natural calligraphic glow
      const dt = Math.max(1, now - prev.lastTime);
      const speed = dist / dt;
      const strokeWidth = Math.max(4.5, Math.min(10, 8 - speed * 1.5));

      // Append segment with 3.5s life
      segmentsRef.current.push({
        x1: prev.x,
        y1: prev.y,
        x2: x,
        y2: y,
        color: currentColorHexRef.current,
        createdAt: now,
        lifetime: 3600, // ~3.6 seconds smooth dissolve
        width: strokeWidth
      });

      // Occasional soft trailing particle
      if (Math.random() < 0.15) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          color: currentColorHexRef.current,
          alpha: 0.8,
          size: 1.2 + Math.random() * 1.5,
          decay: 0.025
        });
      }

      activePointersRef.current.set(e.pointerId, { x, y, lastTime: now });
      resetIdleTimer();

      // Update ambient tone gliding smoothly
      soundManager.updateSlateTone(x / rect.width, y / rect.height);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);

    // If all fingers have released, start smooth 1-second fade out
    if (activePointersRef.current.size === 0) {
      soundManager.stopSlateTone(1.0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#0d1117] flex flex-col select-none touch-none overflow-hidden"
      style={{ height: '100vh', touchAction: 'none' }}
    >
      {/* Top Header Bar matching CalmWorld Minigames style */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-3 sm:p-4 pt-4 sm:pt-5 pointer-events-none">
        <div className="w-8 sm:w-9" /> {/* Left spacer for perfect centering */}

        <div className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-3.5 sm:px-4 py-1 rounded-full border border-slate-300 dark:border-slate-700 shadow-md">
          <h2 className="text-[#0f172a] dark:text-[#f8fafc] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] whitespace-nowrap drop-shadow-xs">
            La Lavagna a Scomparsa
          </h2>
          <button
            onClick={() => setShowRules(true)}
            className="p-1 text-slate-700 dark:text-slate-300 hover:text-slate-950 active:scale-95 transition-all rounded-full hover:bg-slate-100/70 cursor-pointer"
            title="Regole del gioco"
            aria-label="Regole del gioco"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </button>
        </div>

        {/* Exit Button positioned at top-right */}
        <button
          onClick={onClose}
          className="pointer-events-auto p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
          aria-label="Esci dal gioco"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Radiant Breeze Flash Overlay */}
      <AnimatePresence>
        {breezeFlash && (
          <motion.div
            key="slate-breeze-flash"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none z-10 bg-radial from-white/25 via-cyan-400/10 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Main Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="w-full h-full cursor-crosshair active:cursor-crosshair block touch-none select-none"
      />

      {/* 6-Second Idle Soothing Prompt */}
      <AnimatePresence>
        {showIdlePrompt && (
          <motion.div
            key="slate-idle-prompt"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none text-center px-8 z-15"
          >
            <div className="inline-flex flex-col items-center gap-2 max-w-xs sm:max-w-md bg-white/5 backdrop-blur-md py-3.5 px-6 rounded-3xl border border-white/10 shadow-2xl">
              <Sparkles className="w-4 h-4 text-amber-300/80 animate-pulse" />
              <p className="text-xs sm:text-sm font-semibold text-slate-200/90 leading-relaxed font-['Quicksand']">
                {SOOTHING_PROMPTS[idlePromptIndex]}
              </p>
              <span className="text-[10px] text-slate-400/80">
                Tocca e disegna per farlo dissolvere
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discreet Semi-transparent Floating Controls at Bottom */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-[#162032]/85 backdrop-blur-xl border border-slate-700/60 rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-3 sm:gap-4">
          {/* Color Selector (5 circles: Oro, Ciano, Lavanda, Rubino, Smeraldo) */}
          <div className="flex items-center gap-2 border-r border-slate-700/80 pr-3 sm:pr-4">
            {SLATE_COLORS.map((col, idx) => {
              const isSelected = selectedColorIndex === idx;
              return (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedColorIndex(idx);
                    resetIdleTimer();
                  }}
                  title={col.name}
                  aria-label={col.name}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all active:scale-90 flex items-center justify-center relative ${
                    isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: col.hex,
                    boxShadow: isSelected ? `0 0 14px ${col.glow}` : 'none'
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white/90 shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>

          {/* "Soffio" / "Svanisci ora" Button */}
          <button
            onClick={triggerBreezeDissolve}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            title="Dissolvi tutto con un soffio"
            aria-label="Dissolvi tutto"
          >
            <Wind className="w-4 h-4 text-cyan-300" />
            <span className="hidden xs:inline">Soffio</span>
          </button>
        </div>
      </div>

      {/* Rules & Therapeutic Explanation Modal */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-slate-300 dark:border-slate-700 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-slate-950 dark:text-slate-100 font-black text-lg font-['Quicksand']">
                La Lavagna a Scomparsa
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                Durante i picchi d'ansia o di rimuginio, il corpo accumula tensione. Questo spazio ti permette di <strong>scaricare liberamente quel sovraccarico</strong> tracciando linee, forme o parole pesanti.
              </p>

              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                  <li>
                    <strong>Multitouch:</strong> disegna anche con più dita contemporaneamente.
                  </li>
                  <li>
                    <strong>Tonalità:</strong> scegli tra Oro Caldo, Ciano, Lavanda, Rubino e Smeraldo.
                  </li>
                  <li>
                    <strong>Soffio:</strong> tocca l'icona del vento per dissolvere istantaneamente lo schermo.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white dark:text-slate-900 text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
