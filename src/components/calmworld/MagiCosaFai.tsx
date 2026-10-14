import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';
import userMagiSfondo from '../../assets/minigames/magi/sfondo/sfondo.jpg';
import userMagiPiange from '../../assets/minigames/magi/piange/piange.jpg';
import {
  MAGI_SFONDO_IMAGE,
  MAGI_TATUAGGI_IMAGES,
  MAGI_PIANGE_IMAGE,
  TATUAGGIO_100_IMAGE
} from '../../assets/minigames';

// Percorsi relativi predefiniti degli asset grafici
export const DEFAULT_MAGI_SFONDO = userMagiSfondo || '/magi/sfondo/sfondo.jpg';
export const DEFAULT_MAGI_PIANGE = userMagiPiange || '/magi/piange/piange.jpg';

const DEFAULT_TATTOO_PRESETS = [
  { id: 'farfalla', name: 'Farfalla', url: '/magi/tatuaggi/farfalla.svg' },
  { id: 'cuore', name: 'Cuore', url: '/magi/tatuaggi/cuore.svg' },
  { id: 'fiore', name: 'Fiore', url: '/magi/tatuaggi/fiore.svg' },
  { id: 'luna', name: 'Luna e Stelle', url: '/magi/tatuaggi/luna.svg' }
];

// Coordinate anatomiche RIGOROSAMENTE sulle PARTI ROSA (pelle visibile):
// - Clavicole / base del collo (decolleté alto sopra il reggiseno)
// - Spalle e braccia interne visibili sullo schermo
// - Addome e pancia (rigorosamente SOTTO il reggiseno, sopra l'acqua)
// - ZERO nei capelli, ZERO nel reggiseno, ZERO oltre i margini dello schermo
const SKIN_POSITIONS = [
  // 1. Decolleté e clavicole alte (sopra il reggiseno)
  { x: 46, y: 52, label: 'Clavicola sinistra' },
  { x: 52, y: 52, label: 'Clavicola destra' },
  { x: 39, y: 54, label: 'Decolleté sinistro' },
  { x: 61, y: 54, label: 'Decolleté destro' },
  { x: 49, y: 53, label: 'Centro decolleté' },

  // 2. Spalle e braccia interne (ben all'interno dello schermo visibile)
  { x: 36, y: 56, label: 'Spalla sinistra' },
  { x: 64, y: 56, label: 'Spalla destra' },
  { x: 35, y: 60, label: 'Braccio sinistro' },
  { x: 65, y: 60, label: 'Braccio destro' },

  // 3. Avambracci e polsi visibili sopra l'acqua
  { x: 36, y: 65, label: 'Avambraccio sinistro' },
  { x: 64, y: 65, label: 'Avambraccio destro' },
  { x: 39, y: 69, label: 'Polso sinistro' },
  { x: 61, y: 69, label: 'Polso destro' },

  // 4. Addome e pancia (rigorosamente SOTTO la fascia del reggiseno, sopra l'acqua)
  { x: 50, y: 67, label: 'Addome centro' },
  { x: 44, y: 68, label: 'Addome sinistro' },
  { x: 56, y: 68, label: 'Addome destro' },
  { x: 50, y: 70, label: 'Pancia sopra l\'acqua' }
];

export type WashingTool = 'sponge' | 'water' | 'towel';

export interface SkinTattoo {
  id: string;
  image: string;
  name: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  // Fasi sequenziali:
  // 0 = Sapone / Spugna (crea schiuma)
  // 1 = Risciacquo / Acqua (lava schiuma e sbiadisce tatuaggio)
  // 2 = Asciugatura / Asciugamano (pelle pulita, tatuaggio scompare)
  // 3 = Completamente pulito!
  step: 0 | 1 | 2 | 3;
  progress: number; // 0 - 100% all'interno dello step corrente
  bubbleCount: number;
}

const MAGI_SWEET_QUOTES = [
  '«Un bel bagno caldo e profumato per lavare via ogni pensiero... che pace! 🫧✨»',
  '«Prima la spugna soffice con il sapone, poi l\'acqua tiepida e infine l\'asciugamano! 🛁💕»',
  '«Senti come scivolano via i tatuaggi con dolcezza... niente fretta! 🌸»',
  '«La pelle torna pulita, morbida e rilassata sotto le bollicine! 🕊️»',
  '«Coccole di sapone, gocce d\'acqua tiepida e tanta serenità! 🍃»'
];

// Marquee a riga singola per i pensieri di pace
const SingleLineMarquee: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowDistance, setOverflowDistance] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setOverflowDistance(diff > 4 ? diff + 18 : 0);
    }
  }, [text]);

  return (
    <div ref={containerRef} className="overflow-hidden whitespace-nowrap w-full">
      {overflowDistance > 0 ? (
        <motion.div
          className="inline-flex items-center"
          animate={{ x: [0, -overflowDistance, -overflowDistance, 0] }}
          transition={{
            repeat: Infinity,
            repeatDelay: 2.2,
            duration: Math.max(3.8, overflowDistance / 24),
            ease: 'easeInOut'
          }}
        >
          <span ref={textRef} className={className}>
            {text}
          </span>
        </motion.div>
      ) : (
        <span ref={textRef} className={className}>
          {text}
        </span>
      )}
    </div>
  );
};

interface MagiCosaFaiProps {
  onClose: () => void;
}

export const MagiCosaFai: React.FC<MagiCosaFaiProps> = ({ onClose }) => {
  // 1. GESTIONE ASSET GRAFICI (SFONDO VASCA & RAGAZZA CHE PIANGE)
  const CANDIDATE_SFONDI = [
    DEFAULT_MAGI_SFONDO,
    '/magi/sfondo/sfondo.jpg',
    '/magi/sfondo/sfondo.jpeg',
    '/magi/sfondo/sfondo.png',
    '/magi/sfondo/sfondo.svg'
  ];

  const CANDIDATE_PIANGE = [
    DEFAULT_MAGI_PIANGE,
    '/magi/piange/piange.jpg',
    '/magi/piange/piange.jpeg',
    '/magi/piange/piange.png',
    '/magi/piange/piange.svg'
  ];

  // Sfondo statico normale della vasca: usa direttamente l'immagine caricata
  const [activeSfondo, setActiveSfondo] = useState<string>(() => {
    const saved = localStorage.getItem('magi_custom_sfondo');
    if (saved && saved.startsWith('data:image/')) return saved;
    if (saved) localStorage.removeItem('magi_custom_sfondo');
    return DEFAULT_MAGI_SFONDO;
  });

  // Immagine della ragazza che piange a fine round
  const [activePiange, setActivePiange] = useState<string>(() => {
    return DEFAULT_MAGI_PIANGE;
  });

  const [candidateIndex, setCandidateIndex] = useState<number>(0);

  const handleImageError = () => {
    localStorage.removeItem('magi_custom_sfondo');
    if (activeSfondo !== DEFAULT_MAGI_SFONDO) {
      setActiveSfondo(DEFAULT_MAGI_SFONDO);
    } else if (candidateIndex < CANDIDATE_SFONDI.length - 1) {
      const nextIdx = candidateIndex + 1;
      setCandidateIndex(nextIdx);
      setActiveSfondo(CANDIDATE_SFONDI[nextIdx]);
    }
  };

  // 2. STATO TATUAGGI DISPONIBILI (I 50 tatuaggi dell'utente senza sfondo)
  const [availableTattoos] = useState<string[]>(() => {
    if (MAGI_TATUAGGI_IMAGES && MAGI_TATUAGGI_IMAGES.length > 0) {
      return MAGI_TATUAGGI_IMAGES;
    }
    return DEFAULT_TATTOO_PRESETS.map(p => p.url);
  });

  // 3. STATO FASE DI FINE PARTITA & GAME LOOP INFINITO
  const [isCryingPhase, setIsCryingPhase] = useState<boolean>(false);
  const isCryingPhaseRef = useRef<boolean>(false);
  isCryingPhaseRef.current = isCryingPhase;

  // 4. TATUAGGI ATTUALMENTE SULLA PELLE NEL ROUND CORRENTE
  const [activeTattoos, setActiveTattoos] = useState<SkinTattoo[]>([]);

  // 5. STRUMENTO CORRENTE SELEZIONATO
  const [currentTool, setCurrentTool] = useState<WashingTool>('sponge');

  // 6. MESSAGGI, MODALE REGOLE & DIALOGHI
  const [customMsg, setCustomMsg] = useState<string | null>(null);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [magiQuote, setMagiQuote] = useState<string>(() => MAGI_SWEET_QUOTES[0]);

  // Particelle effimere (bolle 🫧, gocce 💧, stelline ✨)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; char: string }>>([]);

  const showToast = (msg: string, dur = 2200) => {
    setCustomMsg(msg);
    setTimeout(() => {
      setCustomMsg(prev => (prev === msg ? null : prev));
    }, dur);
  };

  // Tracciamento dei tatuaggi apparsi nella partita precedente per evitare che compaiano due partite di fila
  const previousRoundTattoosRef = useRef<Set<string>>(new Set());

  // Genera casualmente i tatuaggi solo sulle parti rosa, rispettando rigorosamente tutte le regole:
  // 1. Tatuaggi più grandi del 5% (Math.round((28..36) * 1.05))
  // 2. Nessuna sovrapposizione tra i tatuaggi (distanza minima protetta)
  // 3. Unicità assoluta: nessun tatuaggio può comparire più di una volta per partita
  // 4. Nessuna partita consecutiva: nessun tatuaggio può apparire due partite di fila
  const spawnRandomRoundTattoos = useCallback(() => {
    if (availableTattoos.length === 0) return;

    // 1. Escludi i tatuaggi apparsi nella partita precedente (regola: non possono apparire due partite di fila)
    let candidatePool = availableTattoos.filter(t => !previousRoundTattoosRef.current.has(t));
    if (candidatePool.length < 3) {
      // Fallback solo se il pool totale di immagini caricate fosse inferiore a 3
      candidatePool = [...availableTattoos];
    }

    // 2. Seleziona posizioni senza alcuna sovrapposizione da SKIN_POSITIONS
    const shuffledPositions = [...SKIN_POSITIONS].sort(() => Math.random() - 0.5);
    const chosenPositions: Array<{ x: number; y: number; label: string }> = [];

    const isTooClose = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      const dx = (p1.x - p2.x) * 1.25;
      const dy = p1.y - p2.y;
      return Math.hypot(dx, dy) < 7.2;
    };

    for (const pos of shuffledPositions) {
      if (!chosenPositions.some(p => isTooClose(p, pos))) {
        chosenPositions.push(pos);
      }
    }

    // Numero di tatuaggi per partita (da 3 a 6 in base a posizioni sicure e pool)
    const maxPossible = Math.min(chosenPositions.length, candidatePool.length, 6);
    const targetCount = Math.max(3, Math.min(maxPossible, Math.floor(Math.random() * 3) + 4));
    const finalPositions = chosenPositions.slice(0, targetCount);

    // 3. Selezione tatuaggi univoci (regola: mai più di una volta per partita)
    const selectedUrls: string[] = [];
    const favoriteTattoo = TATUAGGIO_100_IMAGE || availableTattoos.find(t => t.includes('100')) || null;

    // Se il tatuaggio (100) è nel candidatePool (non presente nella partita precedente), compare con alta priorità (85%)
    const canUseFavorite = Boolean(
      favoriteTattoo &&
      candidatePool.includes(favoriteTattoo) &&
      Math.random() < 0.85
    );

    if (canUseFavorite && favoriteTattoo) {
      selectedUrls.push(favoriteTattoo);
    }

    // Riempi gli slot rimanenti con tatuaggi diversi (nessun duplicato)
    const remainingCandidates = candidatePool.filter(t => !selectedUrls.includes(t));
    const shuffledRemaining = [...remainingCandidates].sort(() => Math.random() - 0.5);

    for (const url of shuffledRemaining) {
      if (selectedUrls.length >= finalPositions.length) break;
      selectedUrls.push(url);
    }

    // Mescola l'assegnazione per varietà
    const shuffledUrls = [...selectedUrls].sort(() => Math.random() - 0.5);
    const newTattoos: SkinTattoo[] = [];

    for (let i = 0; i < finalPositions.length && i < shuffledUrls.length; i++) {
      const pos = finalPositions[i];
      const tattooUrl = shuffledUrls[i];
      // Tatuaggi resi più grandi del 5%: base 28-36px * 1.05 = ~30-38px
      const baseSize = 28 + Math.random() * 8;
      const sizePlus5Percent = Math.round(baseSize * 1.05);

      newTattoos.push({
        id: `tattoo-r${Date.now()}-${i}-${Math.random()}`,
        image: tattooUrl,
        name: tattooUrl === favoriteTattoo ? 'Tatuaggio 100' : `Tatuaggio ${i + 1}`,
        x: pos.x,
        y: pos.y,
        size: sizePlus5Percent,
        rotation: Math.floor((Math.random() - 0.5) * 20),
        step: 0, // Step 0: Sapone / Spugna
        progress: 0,
        bubbleCount: 0
      });
    }

    // Registra i tatuaggi di questa partita per escluderli dalla successiva (mai due partite di fila)
    previousRoundTattoosRef.current = new Set(newTattoos.map(t => t.image));

    setActiveTattoos(newTattoos);
    soundManager.playTattooPop();
  }, [availableTattoos]);

  // Precaricamento immediato delle immagini per evitare ritardi
  useEffect(() => {
    const img1 = new Image();
    img1.src = activeSfondo || DEFAULT_MAGI_SFONDO;
    const img2 = new Image();
    img2.src = activePiange || DEFAULT_MAGI_PIANGE;
  }, [activeSfondo, activePiange]);

  // Calcolo dinamico dei confini reali dell'immagine di sfondo a schermo intero (object-cover object-center 1792x2400)
  // per garantire che i tatuaggi rimangano sempre pixel-perfect ancorati ESCLUSIVAMENTE sulla pelle rosa su qualsiasi schermo
  const [imageBounds, setImageBounds] = useState({
    renderedW: typeof window !== 'undefined' ? window.innerWidth : 1000,
    renderedH: typeof window !== 'undefined' ? window.innerHeight : 1000,
    leftOffset: 0,
    topOffset: 0
  });

  const updateImageBounds = useCallback(() => {
    if (typeof window === 'undefined') return;
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;
    const naturalW = 1792;
    const naturalH = 2400;

    const containerAspect = containerW / containerH;
    const imageAspect = naturalW / naturalH;

    let renderedW: number;
    let renderedH: number;
    let leftOffset: number;
    let topOffset: number;

    if (containerAspect > imageAspect) {
      // Schermo più largo dell'immagine (desktop/tablet orizzontale)
      renderedW = containerW;
      renderedH = containerW / imageAspect;
      leftOffset = 0;
      topOffset = (containerH - renderedH) / 2;
    } else {
      // Schermo più alto dell'immagine (smartphone verticale)
      renderedH = containerH;
      renderedW = containerH * imageAspect;
      topOffset = 0;
      leftOffset = (containerW - renderedW) / 2;
    }

    setImageBounds({ renderedW, renderedH, leftOffset, topOffset });
  }, []);

  // Calcolo protetto delle coordinate a schermo: impedisce ai tatuaggi di apparire fuori dallo schermo
  const getTattooScreenCoords = useCallback((tattoo: { x: number; y: number; size: number }) => {
    const rawX = imageBounds.leftOffset + (tattoo.x / 100) * imageBounds.renderedW;
    const rawY = imageBounds.topOffset + (tattoo.y / 100) * imageBounds.renderedH;

    const containerW = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const containerH = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const halfSize = tattoo.size / 2;

    // Margini di sicurezza dai bordi laterali, dall'header in alto e dalla toolbar in basso
    const safeMinX = halfSize + 16;
    const safeMaxX = Math.max(safeMinX, containerW - halfSize - 16);
    const safeMinY = halfSize + 76;
    const safeMaxY = Math.max(safeMinY, containerH - halfSize - 110);

    return {
      screenX: Math.max(safeMinX, Math.min(safeMaxX, rawX)),
      screenY: Math.max(safeMinY, Math.min(safeMaxY, rawY))
    };
  }, [imageBounds]);

  useEffect(() => {
    updateImageBounds();
    window.addEventListener('resize', updateImageBounds);
    return () => window.removeEventListener('resize', updateImageBounds);
  }, [updateImageBounds]);

  // Avvio iniziale del round 1
  useEffect(() => {
    spawnRandomRoundTattoos();
  }, [spawnRandomRoundTattoos]);

  // Controllo e trigger del cambio di stato a fine round ("Ora mi farò altri tatuaggi")
  const triggerRoundComplete = useCallback(() => {
    if (isCryingPhaseRef.current) return;

    // Breve pausa per godersi la scomparsa dell'ultimo tatuaggio
    setTimeout(() => {
      setIsCryingPhase(true);
      soundManager.playMagiGiggle();

      // Mostra la reazione per 2.6 secondi, poi avvia la nuova partita
      setTimeout(() => {
        setIsCryingPhase(false);
        spawnRandomRoundTattoos();
      }, 2700);
    }, 400);
  }, [spawnRandomRoundTattoos]);

  // Riferimenti per lo strofinamento a tutto schermo
  const isPointerDownRef = useRef<boolean>(false);
  const lastScrubPerTattooRef = useRef<Record<string, { time: number; x: number; y: number }>>({});
  const lastWarnSoundTimeRef = useRef<number>(0);
  const lastParticleTimeRef = useRef<number>(0);

  // Logica di avanzamento per strofinamento (drag o tap)
  const performScrubAction = useCallback((tattooId: string, clientX: number, clientY: number) => {
    if (isCryingPhaseRef.current) return;

    setActiveTattoos(prevTattoos => {
      const target = prevTattoos.find(t => t.id === tattooId);
      if (!target || target.step === 3) return prevTattoos;

      const now = Date.now();

      // STEP 0: Sapone / Spugna 🧽
      if (target.step === 0) {
        if (currentTool !== 'sponge') {
          if (now - lastWarnSoundTimeRef.current > 900) {
            lastWarnSoundTimeRef.current = now;
            soundManager.playMagiGentleWarn();
          }
          return prevTattoos;
        }

        soundManager.playSpongeSoap();
        addParticle(clientX, clientY, '🫧');

        const newProg = Math.min(100, target.progress + 10);
        const isCompleted = newProg >= 100;

        if (isCompleted) {
          soundManager.playTattooPop();
        }

        return prevTattoos.map(t => {
          if (t.id !== tattooId) return t;
          return {
            ...t,
            step: isCompleted ? (1 as const) : (0 as const),
            progress: isCompleted ? 0 : newProg,
            bubbleCount: isCompleted ? 8 : Math.min(8, Math.floor(newProg / 12))
          };
        });
      }

      // STEP 1: Risciacquo / Acqua 🚿
      if (target.step === 1) {
        if (currentTool !== 'water') {
          if (now - lastWarnSoundTimeRef.current > 900) {
            lastWarnSoundTimeRef.current = now;
            soundManager.playMagiGentleWarn();
          }
          return prevTattoos;
        }

        soundManager.playWaterRinse();
        addParticle(clientX, clientY, '💧');

        const newProg = Math.min(100, target.progress + 10);
        const isCompleted = newProg >= 100;

        if (isCompleted) {
          soundManager.playMagiGiggle();
        }

        return prevTattoos.map(t => {
          if (t.id !== tattooId) return t;
          return {
            ...t,
            step: isCompleted ? (2 as const) : (1 as const),
            progress: isCompleted ? 0 : newProg,
            bubbleCount: isCompleted ? 0 : Math.max(0, 8 - Math.floor(newProg / 12))
          };
        });
      }

      // STEP 2: Asciugatura / Asciugamano 🧖‍♀️
      if (target.step === 2) {
        if (currentTool !== 'towel') {
          if (now - lastWarnSoundTimeRef.current > 900) {
            lastWarnSoundTimeRef.current = now;
            soundManager.playMagiGentleWarn();
          }
          return prevTattoos;
        }

        soundManager.playTowelPat();
        addParticle(clientX, clientY, '✨');

        const newProg = Math.min(100, target.progress + 12);
        const isCompleted = newProg >= 100;

        const nextList = prevTattoos.map(t => {
          if (t.id !== tattooId) return t;
          return {
            ...t,
            step: isCompleted ? (3 as const) : (2 as const),
            progress: isCompleted ? 100 : newProg
          };
        });

        if (isCompleted) {
          soundManager.playMagiGiggle();

          // Controllo: se tutti i tatuaggi del round sono ora completamente puliti (step 3)
          const allClean = nextList.every(t => t.step === 3);
          if (allClean) {
            triggerRoundComplete();
          }
        }

        return nextList;
      }

      return prevTattoos;
    });
  }, [currentTool, triggerRoundComplete]);

  // Strofinamento attivo su tutto lo schermo: ovunque scorra il dito/cursore, gli elementi e i tatuaggi funzionano!
  const handleScreenScrub = useCallback(
    (clientX: number, clientY: number) => {
      if (isCryingPhaseRef.current) return;

      const now = Date.now();

      // Scia di particelle effimere del tool corrente ovunque si scorra
      if (now - lastParticleTimeRef.current > 75) {
        lastParticleTimeRef.current = now;
        const char = currentTool === 'sponge' ? '🫧' : currentTool === 'water' ? '💧' : '✨';
        addParticle(clientX, clientY, char);
      }

      // Controlla ogni tatuaggio attivo: se il tocco scorre vicino, si pulisce
      activeTattoos.forEach(tattoo => {
        if (tattoo.step === 3) return;

        const { screenX, screenY } = getTattooScreenCoords(tattoo);
        const dist = Math.hypot(clientX - screenX, clientY - screenY);

        // Raggio d'azione morbido per consentire di scorrere su tutto lo schermo
        const hitRadius = Math.max(tattoo.size * 1.6, 52);

        if (dist <= hitRadius) {
          const last = lastScrubPerTattooRef.current[tattoo.id] || { time: 0, x: 0, y: 0 };
          const timeSince = now - last.time;
          const distMoved = Math.hypot(clientX - last.x, clientY - last.y);

          if (timeSince >= 50 || distMoved >= 8) {
            lastScrubPerTattooRef.current[tattoo.id] = { time: now, x: clientX, y: clientY };
            performScrubAction(tattoo.id, clientX, clientY);
          }
        }
      });
    },
    [activeTattoos, getTattooScreenCoords, currentTool, performScrubAction]
  );

  const addParticle = (clientX: number, clientY: number, char: string) => {
    const id = Date.now() + Math.random();
    setParticles(prev => [...prev.slice(-14), { id, x: clientX, y: clientY, char }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 700);
  };

  const uncleanedCount = activeTattoos.filter(t => t.step < 3).length;

  return (
    <div
      onPointerUp={() => { isPointerDownRef.current = false; }}
      onPointerCancel={() => { isPointerDownRef.current = false; }}
      className="fixed inset-0 z-[60] text-slate-800 flex flex-col justify-between items-center select-none overflow-hidden h-[100dvh] max-h-[100dvh] bg-slate-900"
    >
      {/* ================================================== */}
      {/* 1. SFONDO A SCHERMO INTERO: NESSUNA SCHERMATA BLU  */}
      {/* ================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-slate-900">
        {/* Sfondo normale della vasca: sempre visibile al 100% come base solida */}
        <img
          src={activeSfondo || DEFAULT_MAGI_SFONDO}
          alt="Ragazza nella vasca da bagno"
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Sfondo reazione a fine round: sovrapposto con dissolvenza fluida sopra lo sfondo normale */}
        <img
          src={activePiange || DEFAULT_MAGI_PIANGE}
          alt="Magi"
          onError={() => setActivePiange(DEFAULT_MAGI_PIANGE)}
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-300 ${
            isCryingPhase ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* ================================================== */}
      {/* 2. AREA DELLA PELLE CON I TATUAGGI (STROFINAMENTO SU TUTTO LO SCHERMO) */}
      {/* ================================================== */}
      <div
        onPointerDown={e => {
          isPointerDownRef.current = true;
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {}
          handleScreenScrub(e.clientX, e.clientY);
        }}
        onPointerMove={e => {
          if (isPointerDownRef.current || e.buttons > 0) {
            handleScreenScrub(e.clientX, e.clientY);
          }
        }}
        onPointerUp={e => {
          isPointerDownRef.current = false;
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerCancel={e => {
          isPointerDownRef.current = false;
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
        className="absolute inset-0 w-full h-full pointer-events-auto z-20 touch-none select-none cursor-crosshair overflow-hidden"
      >
        {!isCryingPhase &&
          activeTattoos.map(tattoo => {
            const isCleaned = tattoo.step === 3;
            const { screenX, screenY } = getTattooScreenCoords(tattoo);

            return (
              <motion.div
                key={tattoo.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isCleaned ? [1, 1.25, 0] : 1,
                  opacity: isCleaned ? [1, 0.8, 0] : 1
                }}
                transition={{ duration: isCleaned ? 0.45 : 0.25 }}
                style={{
                  position: 'absolute',
                  left: `${screenX}px`,
                  top: `${screenY}px`,
                  transform: `translate(-50%, -50%) rotate(${tattoo.rotation}deg)`,
                  width: `${tattoo.size}px`,
                  height: `${tattoo.size}px`
                }}
                className="pointer-events-none group flex flex-col items-center justify-center select-none"
              >
                {/* Immagine del tatuaggio con transizione visiva delle 3 fasi */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={tattoo.image}
                    alt={tattoo.name}
                    style={{
                      // Step 0: nitido; Step 1: sbiadito; Step 2: quasi scomparso; Step 3: invisibile
                      opacity:
                        tattoo.step === 0
                          ? 1
                          : tattoo.step === 1
                          ? Math.max(0.25, 0.85 - (tattoo.progress / 100) * 0.5)
                          : tattoo.step === 2
                          ? Math.max(0, 0.35 - (tattoo.progress / 100) * 0.35)
                          : 0,
                      filter:
                        tattoo.step === 0
                          ? 'contrast(1.15) saturate(1.1)'
                          : tattoo.step === 1
                          ? 'opacity(0.7) blur(0.5px)'
                          : 'opacity(0.3) blur(1px)',
                      mixBlendMode: 'multiply'
                    }}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-opacity"
                  />

                  {/* FASE 0 & 1: SCHIUMA DI SAPONE MAN MANO CHE SI PASSA LA SPUGNA */}
                  {tattoo.step === 0 && tattoo.progress > 0 && (
                    <motion.div
                      style={{
                        transform: `scale(${0.4 + (tattoo.progress / 100) * 0.7})`,
                        opacity: Math.min(1, 0.4 + (tattoo.progress / 100) * 0.6)
                      }}
                      className="absolute inset-0 rounded-full bg-white/75 backdrop-blur-2xs flex items-center justify-center border border-white pointer-events-none transition-all shadow-inner"
                    >
                      <span className="text-xl animate-pulse">🫧</span>
                    </motion.div>
                  )}

                  {/* FASE 1: SCHIUMA DA RISCIACQUARE CHE SVIADISCE CON L'ACQUA */}
                  {tattoo.step === 1 && (
                    <>
                      <div
                        style={{
                          transform: `scale(${Math.max(0.4, 1 - (tattoo.progress / 100) * 0.5)})`,
                          opacity: Math.max(0, 0.9 - (tattoo.progress / 100) * 0.9)
                        }}
                        className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center pointer-events-none transition-all"
                      >
                        <span className="text-base">🫧</span>
                      </div>
                      <div className="absolute -top-3 flex gap-1 pointer-events-none animate-bounce">
                        <span className="text-sm">💧</span>
                        <span className="text-xs">💧</span>
                      </div>
                    </>
                  )}

                  {/* FASE 2: STELLINE E PELLE CHE TORNA SPLENDENTE CON L'ASCIUGAMANO */}
                  {tattoo.step === 2 && (
                    <motion.div
                      animate={{ rotate: 360, scale: [0.9, 1.15, 0.9] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Sparkles className="w-8 h-8 text-amber-300 drop-shadow-md" />
                    </motion.div>
                  )}

                  {/* MINI INDICATORE INVISIBILE/DISCRETO DI PROGRESSIONE SUL TATUAGGIO */}
                  {!isCleaned && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/40 backdrop-blur-xs rounded-full overflow-hidden border border-white/60 pointer-events-none">
                      <div
                        className={`h-full transition-all duration-150 ${
                          tattoo.step === 0
                            ? 'bg-amber-400'
                            : tattoo.step === 1
                            ? 'bg-sky-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${tattoo.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* ================================================== */}
      {/* 3. PARTICELLE FLUTTUANTI (BOLLE, GOCCE, SCINTILLE)  */}
      {/* ================================================== */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: p.x,
              top: p.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 70
            }}
            className="pointer-events-none text-2xl font-bold select-none drop-shadow-md"
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ================================================== */}
      {/* 4. HEADER SUPERIORE: COERENTE CON GLI ALTRI GIOCHI */}
      {/* ================================================== */}
      <header className="relative w-full max-w-lg mx-auto px-3 pt-3 sm:pt-4 z-40 shrink-0 space-y-1.5">
        <div className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          {/* Spacer sinistro per bilanciare il pulsante X a destra come negli altri giochi */}
          <div className="w-8 sm:w-10" />

          {/* Nome del gioco e icona regole con stile identico agli altri minigiochi */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-4 py-1 rounded-full border border-sky-200 shadow-md">
            <h2 className="text-[#0c4a6e] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] drop-shadow-xs whitespace-nowrap">
              Magi, cosa fai?!
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-sky-800 hover:text-sky-950 active:scale-95 transition-all rounded-full hover:bg-sky-100/70 cursor-pointer"
              title="Regole del gioco"
              aria-label="Regole del gioco"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </button>
          </div>

          {/* Pulsante chiudi / esci */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
            aria-label="Esci dal gioco"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Barra di stato coerente con gli altri giochi */}
        <div className="calm-white-card/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-white/70 shadow-sm flex items-center justify-between gap-2">
          {/* Info personaggio */}
          <div className="flex items-center">
            <span className="text-xs sm:text-sm font-black text-[#0c4a6e] font-['Quicksand'] leading-none">
              Magi
            </span>
          </div>

          {/* Status info: Tatuaggi rimasti */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border shadow-2xs ${
                uncleanedCount === 0
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50/95 text-slate-700 border-slate-200'
              }`}
              title="Tatuaggi da lavare"
            >
              <span>Tatuaggi:</span>
              <span className="font-black text-sky-800">{uncleanedCount} rimasti</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* Banner fine round: una sola scritta alla volta solo a fine round */}
        {isCryingPhase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="calm-white-card border-2 border-sky-300 px-4 py-2 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-center"
          >
            <span className="text-base sm:text-lg">✨</span>
            <span className="text-xs sm:text-sm font-black text-sky-950 font-['Quicksand'] tracking-wide">
              Ora mi farò altri tatuaggi
            </span>
            <span className="text-base sm:text-lg">🎨</span>
          </motion.div>
        )}
      </header>

      {/* ================================================== */}
      {/* 5. TOOLBAR INFERIORE: [Spugna] [Acqua] [Asciugamano]*/}
      {/* ================================================== */}
      <footer className="relative w-full max-w-md mx-auto px-4 pb-4 sm:pb-6 z-40 shrink-0 space-y-2">
        <div className="magi-tool-box p-2 rounded-3xl border border-sky-200 shadow-2xl flex items-center justify-between gap-1.5 sm:gap-2">
          {/* 1. SPUGNA 🧽 */}
          <button
            onClick={() => {
              setCurrentTool('sponge');
              soundManager.playTick();
            }}
            className={`magi-tool-btn flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
              currentTool === 'sponge'
                ? 'magi-tool-btn-sponge-active scale-102 font-black'
                : 'opacity-85 font-bold hover:opacity-100'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🧽</span>
            <span className="text-[11px] sm:text-xs mt-0.5 leading-tight font-extrabold">1. Spugna</span>
          </button>

          {/* 2. ACQUA 🚿 */}
          <button
            onClick={() => {
              setCurrentTool('water');
              soundManager.playTick();
            }}
            className={`magi-tool-btn flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
              currentTool === 'water'
                ? 'magi-tool-btn-shower-active scale-102 font-black'
                : 'opacity-85 font-bold hover:opacity-100'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🚿</span>
            <span className="text-[11px] sm:text-xs mt-0.5 leading-tight font-extrabold">2. Acqua</span>
          </button>

          {/* 3. ASCIUGAMANO 🧖‍♀️ */}
          <button
            onClick={() => {
              setCurrentTool('towel');
              soundManager.playTick();
            }}
            className={`magi-tool-btn flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
              currentTool === 'towel'
                ? 'magi-tool-btn-towel-active scale-102 font-black'
                : 'opacity-85 font-bold hover:opacity-100'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🧖‍♀️</span>
            <span className="text-[11px] sm:text-xs mt-0.5 leading-tight font-extrabold">3. Asciuga</span>
          </button>
        </div>
      </footer>

      {/* ================================================== */}
      {/* 6. MODALE REGOLE & PERSONALIZZAZIONE               */}
      {/* ================================================== */}
      {showRules && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-sky-200 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-base text-sky-950 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                Regole del gioco
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-700 leading-relaxed font-medium">
              <p>
                Sulla pelle della ragazza compaiono i tatuaggi da lavare via. Per eliminarli, tieni premuto e <strong>sfrega con il cursore o il dito</strong> (drag) usando i 3 strumenti nell'ordine sequenziale:
              </p>

              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
                  <span className="text-2xl shrink-0">🧽</span>
                  <div>
                    <strong className="text-amber-950">1. Spugna / Sapone:</strong>
                    <p className="text-[11px] text-amber-900">Sfrega il tatuaggio per creare soffice schiuma bianca.</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2.5">
                  <span className="text-2xl shrink-0">🚿</span>
                  <div>
                    <strong className="text-sky-950">2. Risciacquo / Acqua:</strong>
                    <p className="text-[11px] text-sky-900">Sfrega con la doccetta: la schiuma e il tatuaggio sbiadiscono.</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5">
                  <span className="text-2xl shrink-0">🧖‍♀️</span>
                  <div>
                    <strong className="text-rose-950">3. Asciugatura:</strong>
                    <p className="text-[11px] text-rose-900">Tampona con l'asciugamano: la pelle torna pulita e splendente!</p>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500">
                A fine round, quando tutti i tatuaggi sono puliti, la pelle torna splendente e Magi è pronta per nuovi tatuaggi!
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
              >
                Ho capito ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
