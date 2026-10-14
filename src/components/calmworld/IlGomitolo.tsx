import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Sparkles, RotateCcw, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';

interface Palette {
  name: string;
  main: string;
  light: string;
  dark: string;
  strand: string;
  glow: string;
}

const YARN_PALETTES: Palette[] = [
  {
    name: 'Rosso Rubino',
    main: '#e11d48',
    light: '#fecdd3',
    dark: '#9f1239',
    strand: '#fff1f2',
    glow: 'rgba(225, 29, 72, 0.45)'
  },
  {
    name: 'Pesca Polveroso',
    main: '#f2a68d',
    light: '#fbd7cb',
    dark: '#d67c61',
    strand: '#ffece4',
    glow: 'rgba(242, 166, 141, 0.45)'
  },
  {
    name: 'Lavanda Tenue',
    main: '#b7a5dc',
    light: '#dfd6f5',
    dark: '#8b74ba',
    strand: '#f4effd',
    glow: 'rgba(183, 165, 220, 0.45)'
  },
  {
    name: 'Crema Soffice',
    main: '#ebd8b2',
    light: '#f9edd2',
    dark: '#cbb184',
    strand: '#fffbf0',
    glow: 'rgba(235, 216, 178, 0.45)'
  },
  {
    name: 'Salvia Gentile',
    main: '#9cc2a7',
    light: '#cce2d3',
    dark: '#6f9c7c',
    strand: '#eff8f2',
    glow: 'rgba(156, 194, 167, 0.45)'
  },
  {
    name: 'Azzurro Polvere',
    main: '#92bed7',
    light: '#c8e2f2',
    dark: '#659cbe',
    strand: '#ecf6fc',
    glow: 'rgba(146, 190, 215, 0.45)'
  },
  {
    name: 'Glicine Notturno',
    main: '#a78bfa',
    light: '#ddd6fe',
    dark: '#7c3aed',
    strand: '#f5f3ff',
    glow: 'rgba(167, 139, 250, 0.45)'
  },
  {
    name: 'Menta Rugiada',
    main: '#6ee7b7',
    light: '#d1fae5',
    dark: '#059669',
    strand: '#ecfdf5',
    glow: 'rgba(110, 231, 183, 0.45)'
  },
  {
    name: 'Rosa Pastello',
    main: '#f497aa',
    light: '#fcd1db',
    dark: '#db6f85',
    strand: '#fff0f4',
    glow: 'rgba(244, 151, 170, 0.45)'
  },
  {
    name: 'Oro Miele',
    main: '#f6c768',
    light: '#fdebc2',
    dark: '#d9a53d',
    strand: '#fff9e6',
    glow: 'rgba(246, 199, 104, 0.45)'
  },
  {
    name: 'Lilla Fiorito',
    main: '#c4b5fd',
    light: '#ede9fe',
    dark: '#9333ea',
    strand: '#faf5ff',
    glow: 'rgba(196, 181, 253, 0.45)'
  },
  {
    name: 'Matcha Dolce',
    main: '#86efac',
    light: '#dcfce7',
    dark: '#22c55e',
    strand: '#f0fdf4',
    glow: 'rgba(134, 239, 172, 0.45)'
  },
  {
    name: 'Turchese Calmo',
    main: '#67e8f9',
    light: '#cffafe',
    dark: '#0891b2',
    strand: '#ecfeff',
    glow: 'rgba(103, 232, 249, 0.45)'
  },
  {
    name: 'Corallo Dolce',
    main: '#fb923c',
    light: '#fed7aa',
    dark: '#ea580c',
    strand: '#fff7ed',
    glow: 'rgba(251, 146, 60, 0.45)'
  },
  {
    name: 'Perla d\'Argento',
    main: '#cbd5e1',
    light: '#f1f5f9',
    dark: '#64748b',
    strand: '#f8fafc',
    glow: 'rgba(203, 213, 225, 0.45)'
  },
  {
    name: 'Fico & Lampone',
    main: '#f472b6',
    light: '#fbcfe8',
    dark: '#db2777',
    strand: '#fdf2f8',
    glow: 'rgba(244, 114, 182, 0.45)'
  }
];

// Guaranteed non-repeating palette selector
const getNextRandomPaletteIndex = (prevIndex: number): number => {
  let next = Math.floor(Math.random() * YARN_PALETTES.length);
  while (next === prevIndex && YARN_PALETTES.length > 1) {
    next = Math.floor(Math.random() * YARN_PALETTES.length);
  }
  return next;
};

// Random duration between 16s and 50s (+15% to +25%), peak around 35s-42s
const getRandomYarnDuration = (): number => {
  const r = (Math.random() + Math.random() + Math.random()) / 3;
  const raw = 16 + r * 34;
  const biased = raw * 0.75 + 36 * 0.25;
  return Math.max(16, Math.min(50, Math.round(biased)));
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  twinkle: number;
}

interface WaveLayer {
  amplitude: number;
  frequency: number;
  phase: number;
  yOffset: number;
  width: number;
}

export const IlGomitolo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Random starting palette so it never always starts with red/pesca
  const [paletteIndex, setPaletteIndex] = useState(() => Math.floor(Math.random() * YARN_PALETTES.length));
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gameplay Refs
  const progressRef = useRef(0); // 0 to 1
  const isDraggingRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const prevPointerPosRef = useRef({ x: 0, y: 0 });
  const ballAngleRef = useRef(0);
  const ballAngularVelocityRef = useRef(0);
  const tipLeadPosRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const depositedPilesRef = useRef<WaveLayer[]>([]);
  const lastKalimbaStepRef = useRef(0);
  const unwindSpeedRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const completionCountRef = useRef(0);
  const isAutoResettingRef = useRef(false);
  const targetDurationSecRef = useRef(getRandomYarnDuration());
  const dragNoteStepRef = useRef(0);

  const currentPalette = YARN_PALETTES[paletteIndex % YARN_PALETTES.length];

  // Initialize deposited wavy threads in the basket
  const initPiles = useCallback(() => {
    const layers: WaveLayer[] = [];
    for (let i = 0; i < 18; i++) {
      layers.push({
        amplitude: 4 + Math.random() * 6,
        frequency: 0.025 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
        yOffset: i * 4.5,
        width: 140 + Math.random() * 80
      });
    }
    depositedPilesRef.current = layers;
  }, []);

  const resetGame = useCallback((nextPalette = true) => {
    progressRef.current = 0;
    isDraggingRef.current = false;
    ballAngleRef.current = 0;
    ballAngularVelocityRef.current = 0;
    particlesRef.current = [];
    lastKalimbaStepRef.current = 0;
    unwindSpeedRef.current = 0;
    isAutoResettingRef.current = false;
    targetDurationSecRef.current = getRandomYarnDuration();
    setIsCompleted(false);
    setShowHint(false);
    initPiles();
    soundManager.stopWoolRustle();
    if (nextPalette) {
      setPaletteIndex(prev => getNextRandomPaletteIndex(prev));
    }
  }, [initPiles]);

  useEffect(() => {
    initPiles();
    soundManager.startWoolRustle();
    return () => {
      soundManager.stopWoolRustle();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initPiles]);

  // Main Canvas Rendering and Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    // Initial tip position
    const ballCenterY = height * 0.42;
    const ballCenterX = width * 0.5;
    tipLeadPosRef.current = { x: ballCenterX + 85, y: ballCenterY + 40 };

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const progress = progressRef.current;
      const currentRadiusMultiplier = Math.max(0, 1 - progress);
      const baseRadius = Math.min(width * 0.28, 105);
      const currentRadius = baseRadius * (0.28 + 0.72 * currentRadiusMultiplier);

      const cx = width * 0.5;
      const cy = height * 0.42;

      // Update ball rotation physics
      ballAngleRef.current += ballAngularVelocityRef.current * dt;
      ballAngularVelocityRef.current *= 0.94; // damping

      // Friction sound intensity decays when not unrolling
      unwindSpeedRef.current *= 0.88;
      soundManager.setWoolRustleIntensity(unwindSpeedRef.current);

      // Follower tip spring physics
      const targetTip = isDraggingRef.current
        ? pointerPosRef.current
        : {
            x: cx + Math.cos(ballAngleRef.current + 0.6) * (currentRadius + 26),
            y: cy + Math.sin(ballAngleRef.current + 0.6) * (currentRadius + 26) + 18
          };

      const tipFollowSpeed = isDraggingRef.current ? 18 : 6;
      tipLeadPosRef.current.x += (targetTip.x - tipLeadPosRef.current.x) * tipFollowSpeed * dt;
      tipLeadPosRef.current.y += (targetTip.y - tipLeadPosRef.current.y) * tipFollowSpeed * dt;

      // CLEAR CANVAS (Deep Slate #161b26 with soft vignette)
      ctx.clearRect(0, 0, width, height);

      // Ambient background gradient
      const bgGrad = ctx.createRadialGradient(cx, cy * 0.9, 40, cx, cy, Math.max(width, height) * 0.75);
      bgGrad.addColorStop(0, '#1c2230');
      bgGrad.addColorStop(0.65, '#161b26');
      bgGrad.addColorStop(1, '#0e121a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial dust / backdrop glows
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 18; i++) {
        const starX = (Math.sin(i * 99 + currentTime * 0.0003) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 33 + currentTime * 0.0002) * 0.5 + 0.5) * (height * 0.65);
        ctx.beginPath();
        ctx.arc(starX, starY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // BASKET / ACCUMULATION AREA AT BOTTOM
      const basketY = height - 110;
      const basketW = Math.min(width * 0.86, 340);
      const basketH = 95;
      const basketX = cx - basketW * 0.5;

      // Draw wicker basket base & shadow
      ctx.save();
      // Floor shadow
      const floorShadow = ctx.createRadialGradient(cx, height - 20, 20, cx, height - 20, basketW * 0.58);
      floorShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      floorShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorShadow;
      ctx.beginPath();
      ctx.ellipse(cx, height - 22, basketW * 0.55, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Basket body (warm wicker gradient)
      const basketGrad = ctx.createLinearGradient(basketX, basketY, basketX, basketY + basketH);
      basketGrad.addColorStop(0, '#352922');
      basketGrad.addColorStop(0.5, '#271e18');
      basketGrad.addColorStop(1, '#1b1410');
      ctx.fillStyle = basketGrad;

      // Rounded soft bowl shape
      ctx.beginPath();
      ctx.moveTo(basketX + 24, basketY);
      ctx.quadraticCurveTo(basketX - 6, basketY + basketH * 0.65, basketX + 38, basketY + basketH);
      ctx.lineTo(basketX + basketW - 38, basketY + basketH);
      ctx.quadraticCurveTo(basketX + basketW + 6, basketY + basketH * 0.65, basketX + basketW - 24, basketY);
      ctx.closePath();
      ctx.fill();

      // Basket rim
      ctx.strokeStyle = '#4e3d32';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.ellipse(cx, basketY, basketW * 0.48, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Wicker weave texture accents
      ctx.strokeStyle = 'rgba(100, 80, 68, 0.22)';
      ctx.lineWidth = 1.8;
      for (let xOff = -basketW * 0.42; xOff <= basketW * 0.42; xOff += 18) {
        ctx.beginPath();
        ctx.moveTo(cx + xOff, basketY + 8);
        ctx.lineTo(cx + xOff * 0.85, basketY + basketH - 8);
        ctx.stroke();
      }
      ctx.restore();

      // DRAW UNRAVELED YARN POOLING IN BASKET
      if (progress > 0.01) {
        ctx.save();
        const pileHeight = Math.min(progress * 65, 55);
        const layersToDraw = Math.min(Math.floor(progress * depositedPilesRef.current.length) + 1, depositedPilesRef.current.length);

        for (let l = 0; l < layersToDraw; l++) {
          const layer = depositedPilesRef.current[l];
          const layerY = basketY + 6 - (l / depositedPilesRef.current.length) * pileHeight;
          const layerWidth = layer.width * Math.min(1, 0.35 + progress * 0.7);

          ctx.strokeStyle = l % 3 === 0 ? currentPalette.light : (l % 2 === 0 ? currentPalette.main : currentPalette.dark);
          ctx.lineWidth = 3.6;
          ctx.lineCap = 'round';
          ctx.beginPath();

          for (let x = -layerWidth * 0.5; x <= layerWidth * 0.5; x += 6) {
            const waveY = Math.sin(x * layer.frequency + layer.phase + currentTime * 0.001) * layer.amplitude;
            const px = cx + x;
            const py = layerY + waveY;
            if (x === -layerWidth * 0.5) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // DRAW THE CONNECTING UNRAVELED STRAND (from ball tangent down to basket)
      if (currentRadiusMultiplier > 0.02) {
        ctx.save();
        const tangentX = cx + Math.cos(ballAngleRef.current + 1.2) * (currentRadius - 4);
        const tangentY = cy + Math.sin(ballAngleRef.current + 1.2) * (currentRadius - 4);

        const tipX = tipLeadPosRef.current.x;
        const tipY = tipLeadPosRef.current.y;

        // Shadow under the strand
        ctx.shadowColor = currentPalette.glow;
        ctx.shadowBlur = isDraggingRef.current ? 16 : 8;

        // Main thread from ball to tip (catenary/bezier curve)
        ctx.strokeStyle = currentPalette.strand;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tangentX, tangentY);

        // Control point influenced by gravity and drag displacement
        const cpX = (tangentX + tipX) * 0.5;
        const cpY = Math.max(tangentY, tipY) + (isDraggingRef.current ? 25 : 18);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        ctx.stroke();

        // Secondary descending thread trailing from tip down into the basket
        if (progress > 0.02) {
          ctx.strokeStyle = currentPalette.main;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          const basketTargetX = cx + (Math.sin(currentTime * 0.002) * 20);
          const basketTargetY = basketY - Math.min(progress * 40, 30);
          const trailCpX = tipX * 0.4 + basketTargetX * 0.6;
          const trailCpY = (tipY + basketTargetY) * 0.5 + 40;
          ctx.quadraticCurveTo(trailCpX, trailCpY, basketTargetX, basketTargetY);
          ctx.stroke();
        }

        // GLOWING FREE END / LEAD TIP
        const pulse = 1 + Math.sin(currentTime * 0.007) * 0.18;
        const tipGlow = ctx.createRadialGradient(tipX, tipY, 2, tipX, tipY, 22 * pulse);
        tipGlow.addColorStop(0, '#ffffff');
        tipGlow.addColorStop(0.35, currentPalette.light);
        tipGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 22 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // White nucleus dot on the thread tip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // DRAW THE FLUFFY BALL OF YARN AT CENTER
      if (currentRadiusMultiplier > 0.02) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ballAngleRef.current * 0.35);

        // Ambient ball soft drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;

        // Base gradient of the yarn ball
        const ballGrad = ctx.createRadialGradient(
          -currentRadius * 0.28,
          -currentRadius * 0.28,
          currentRadius * 0.12,
          0,
          0,
          currentRadius
        );
        ballGrad.addColorStop(0, currentPalette.light);
        ballGrad.addColorStop(0.55, currentPalette.main);
        ballGrad.addColorStop(0.9, currentPalette.dark);
        ballGrad.addColorStop(1, '#1b1419');

        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Remove shadow for internal details
        ctx.shadowColor = 'transparent';

        // Winding loops (curves that give the fluffy 3D ball texture)
        const numLoops = Math.floor(14 * currentRadiusMultiplier) + 6;
        for (let i = 0; i < numLoops; i++) {
          const loopAngle = (i * 0.72) + ballAngleRef.current * 0.15;
          const rx = currentRadius * (0.55 + 0.42 * Math.sin(i * 1.8));
          const ry = currentRadius * (0.85 + 0.12 * Math.cos(i * 1.2));

          ctx.save();
          ctx.rotate(loopAngle);

          // Alternating highlight and shadow strands
          ctx.strokeStyle = i % 2 === 0 ? currentPalette.light : currentPalette.dark;
          ctx.lineWidth = Math.max(2, 4.2 * currentRadiusMultiplier);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, -Math.PI * 0.75, Math.PI * 0.75);
          ctx.stroke();

          // Delicate strand cross-loops
          if (i % 3 === 0) {
            ctx.strokeStyle = currentPalette.strand;
            ctx.lineWidth = Math.max(1.5, 3.2 * currentRadiusMultiplier);
            ctx.beginPath();
            ctx.ellipse(rx * 0.15, 0, rx * 0.7, ry * 0.9, Math.PI * 0.25, 0, Math.PI * 1.5);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Fuzzy wool fibers around the ball's contour
        ctx.strokeStyle = currentPalette.light;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.55;
        for (let f = 0; f < 28; f++) {
          const fAngle = (f / 28) * Math.PI * 2;
          const rInner = currentRadius - 2;
          const rOuter = currentRadius + 3 + (Math.sin(f * 4 + currentTime * 0.003) * 2);
          ctx.beginPath();
          ctx.moveTo(Math.cos(fAngle) * rInner, Math.sin(fAngle) * rInner);
          ctx.lineTo(Math.cos(fAngle) * rOuter, Math.sin(fAngle) * rOuter);
          ctx.stroke();
        }

        ctx.restore();
      }

      // UPDATE & DRAW BURST PARTICLES
      if (particlesRef.current.length > 0) {
        ctx.save();
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // subtle gravity
          p.vx *= 0.985;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          const shimmer = p.radius * (1 + 0.3 * Math.sin(currentTime * 0.01 + p.twinkle));
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, shimmer, 0, Math.PI * 2);
          ctx.fill();

          // Star cross on larger particles
          if (p.radius > 2.5) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x - p.radius * 1.5, p.y);
            ctx.lineTo(p.x + p.radius * 1.5, p.y);
            ctx.moveTo(p.x, p.y - p.radius * 1.5);
            ctx.lineTo(p.x, p.y + p.radius * 1.5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPalette, initPiles]);

  // TOUCH & POINTER INTERACTIONS
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAutoResettingRef.current) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    isDraggingRef.current = true;
    setShowHint(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerPosRef.current = { x, y };
    prevPointerPosRef.current = { x, y };

    soundManager.setWoolRustleIntensity(0.12);
    // Tactile sound upon touching and dragging the strand
    soundManager.playYarnDragSound(dragNoteStepRef.current++);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isCompleted || isAutoResettingRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerPosRef.current = { x, y };

    const dx = x - prevPointerPosRef.current.x;
    const dy = y - prevPointerPosRef.current.y;
    prevPointerPosRef.current = { x, y };

    const width = rect.width;
    const height = rect.height;
    const cx = width * 0.5;
    const cy = height * 0.42;

    // Calculate angular motion around ball center
    const angle1 = Math.atan2(prevPointerPosRef.current.y - cy, prevPointerPosRef.current.x - cx);
    const angle2 = Math.atan2(y - cy, x - cx);
    let deltaAngle = angle2 - angle1;
    if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
    if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

    // Circular rotation, pulling downward or dragging in any direction unwinds the yarn!
    const downwardPull = Math.max(0, dy) * 1.2;
    const directDrag = Math.hypot(dx, dy) * 0.6;
    const angularContribution = Math.abs(deltaAngle) * 35;
    const movementScore = angularContribution + downwardPull + directDrag;

    if (movementScore > 0.4) {
      // Rotate the ball smoothly
      const rotationDelta = (deltaAngle !== 0 ? deltaAngle : dy * 0.02);
      ballAngleRef.current += rotationDelta;
      ballAngularVelocityRef.current = rotationDelta * 14;

      // Rate of unwinding feels fluid, smooth and therapeutic
      const divisor = Math.max(80, targetDurationSecRef.current * 75);
      const unwindDelta = movementScore / divisor;
      const nextProgress = Math.min(1, progressRef.current + unwindDelta);
      progressRef.current = nextProgress;

      // Tactile sound every time the user drags the finger: calm, harmonious, non-acute notes
      soundManager.playYarnDragSound(dragNoteStepRef.current++);

      // Update wool sliding sound (gentle and soothing)
      const speed = Math.min(1, movementScore / 25);
      unwindSpeedRef.current = Math.max(unwindSpeedRef.current, speed * 0.6);
      soundManager.setWoolRustleIntensity(unwindSpeedRef.current);

      // Harmonious Kalimba chime every ~4% of progress
      const currentStep = Math.floor(nextProgress / 0.04);
      if (currentStep > lastKalimbaStepRef.current) {
        lastKalimbaStepRef.current = currentStep;
        soundManager.playKalimbaChime(currentStep);
      }

      // CHECK COMPLETION
      if (nextProgress >= 1 && !isCompleted && !isAutoResettingRef.current) {
        triggerCompletion(cx, cy);
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    soundManager.setWoolRustleIntensity(0);
  };

  const triggerCompletion = (cx: number, cy: number) => {
    soundManager.stopWoolRustle();
    soundManager.playYarnDissolve();

    // Create glowing burst particles
    const burst: Particle[] = [];
    const colors = [
      '#ffffff',
      currentPalette.light,
      currentPalette.main,
      currentPalette.strand,
      '#fff8e7',
      '#fdf2f8'
    ];

    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 5.5;
      burst.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        radius: 1.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.008 + Math.random() * 0.012,
        twinkle: Math.random() * 10
      });
    }
    particlesRef.current = burst;

    // Show pop-up only the first time! Subsequent completions auto-renew seamlessly
    if (completionCountRef.current === 0) {
      setIsCompleted(true);
    } else {
      isAutoResettingRef.current = true;
      setToastMessage('Nodo sciolto ✨ Gomitolo rinnovato');
      window.setTimeout(() => {
        resetGame(true);
        setToastMessage(null);
      }, 1900);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#161b26] flex flex-col select-none touch-none overflow-hidden"
      style={{ height: '100vh', touchAction: 'none' }}
    >
      {/* Top Header Controls with Centered Title & Lightbulb */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-3 sm:p-4 pt-4 sm:pt-5 pointer-events-none">
        <div className="w-8 sm:w-9" /> {/* Spacer balancing X on right */}

        <div className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-3.5 sm:px-4 py-1 rounded-full border border-rose-200 dark:border-rose-900 shadow-md">
          <h2 className="text-[#881337] dark:text-[#ffe4e6] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] whitespace-nowrap drop-shadow-xs">
            Il Gomitolo
          </h2>
          <button
            onClick={() => setShowRules(true)}
            className="p-1 text-rose-800 dark:text-rose-300 hover:text-rose-950 active:scale-95 transition-all rounded-full hover:bg-rose-100/70 cursor-pointer"
            title="Regole del gioco"
            aria-label="Regole del gioco"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </button>
          <button
            onClick={() => setPaletteIndex(prev => getNextRandomPaletteIndex(prev))}
            className="p-1 text-slate-600 hover:text-slate-900 active:scale-95 transition-all rounded-full hover:bg-stone-100/70 flex items-center justify-center cursor-pointer"
            title={`Colore: ${currentPalette.name} (tocca per cambiare)`}
            aria-label="Cambia colore gomitolo"
          >
            <div
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-stone-300 dark:border-stone-600 shadow-2xs transition-transform active:scale-90"
              style={{ backgroundColor: currentPalette.main }}
            />
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

      {/* Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Gentle Hint (fades out after first interaction) */}
      <AnimatePresence>
        {showHint && !isCompleted && (
          <motion.div
            key="gomitolo-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="absolute top-20 left-0 right-0 pointer-events-none text-center px-6"
          >
            <p className="text-xs sm:text-sm font-medium text-amber-100/80 bg-white/5 backdrop-blur-md py-2 px-4 rounded-full inline-block border border-white/10 shadow-xs">
              Trascina il filo o gira in tondo per sciogliere il nodo 🧶
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast for subsequent completions without popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="gomitolo-toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute top-20 left-0 right-0 pointer-events-none text-center px-6 z-40"
          >
            <p className="text-xs sm:text-sm font-bold text-amber-200 bg-white/10 backdrop-blur-md py-2.5 px-5 rounded-full inline-flex items-center gap-2 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal / Card (Shown only on first completion) */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            key="gomitolo-completed-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="bg-gradient-to-b from-[#222a3a] to-[#1a202d] border border-white/15 p-6 rounded-3xl max-w-xs w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/15 border border-amber-300/30 flex items-center justify-center shadow-inner">
                <Sparkles className="w-7 h-7 text-amber-200" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white font-['Quicksand']">
                  Il nodo si è sciolto ✨
                </h3>
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-medium">
                  Fai un respiro profondo e senti le spalle leggere. Il groviglio si è allentato e sei al sicuro nel tuo corpo.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    completionCountRef.current = 1;
                    resetGame(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Sciogline un altro
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Torna alla schermata calma
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Explanation Modal */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-rose-200 dark:border-rose-900 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-rose-950 dark:text-rose-200 font-black text-lg font-['Quicksand']">
                Il Gomitolo
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
                L'ansia crea spesso la sensazione di un groviglio nel corpo o nel petto. Questo gioco ti aiuta a sciogliere la tensione corporea con un gesto distensivo e soddisfacente.
              </p>

              <div>
                <p className="font-bold text-rose-900 dark:text-rose-300 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                  <li>Tocca e trascina con il dito il capo luminoso del filo di lana.</li>
                  <li>Muovi il dito in cerchio attorno al gomitolo o scorri verso il basso per srotolarlo.</li>
                  <li>Nessun timer, nessun punteggio e nessuna fretta: procedi con calma finché il nodo non si scioglie del tutto.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
