import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Lightbulb, RotateCcw, Droplets, Sun, Sprout, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';
import { MIMMI_CUSTOM_IMAGE } from '../../assets/minigames';

interface FlowerVariety {
  id: string;
  name: string;
  category: 'margherita' | 'tulipano' | 'rosa' | 'girasole' | 'dalia' | 'peonia' | 'ninfea' | 'generico';
  icon: string;
  petalColor: string;
  petalInnerColor: string;
  centerColor: string;
  petalCount: number;
  petalShape: 'round' | 'pointed' | 'layered' | 'fluffy';
  poetry: string;
  meaning: string;
}

const FLOWER_VARIETIES: FlowerVariety[] = [
  // ==========================================
  // MARGHERITE DI VARI COLORI
  // ==========================================
  {
    id: 'margherita-bianca',
    name: 'Margherita Bianca Classica',
    category: 'margherita',
    icon: '🌼',
    petalColor: '#ffffff',
    petalInnerColor: '#f1f5f9',
    centerColor: '#f59e0b',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'La semplicità che scioglie ogni pensiero pesante.',
    meaning: 'Innocenza, limpidezza e mente serena.'
  },
  {
    id: 'margherita-rosa',
    name: 'Margherita Rosa Delicata',
    category: 'margherita',
    icon: '🌸',
    petalColor: '#f9a8d4',
    petalInnerColor: '#f472b6',
    centerColor: '#f59e0b',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'Un sorriso discreto che riscalda le giornate grigie.',
    meaning: 'Dolcezza, tenerezza e ascolto interiore.'
  },
  {
    id: 'margherita-gialla',
    name: 'Margherita Gialla Solare',
    category: 'margherita',
    icon: '🌼',
    petalColor: '#fef08a',
    petalInnerColor: '#fde047',
    centerColor: '#d97706',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'Un raggio di luce dorata che accende la fiducia.',
    meaning: 'Gioia contagiosa, vitalità ed energia pacata.'
  },
  {
    id: 'margherita-lilla',
    name: 'Margherita Lilla Serena',
    category: 'margherita',
    icon: '💜',
    petalColor: '#ddd6fe',
    petalInnerColor: '#c4b5fd',
    centerColor: '#f59e0b',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'La quiete dell’ora blu, quando le spalle si rilassano.',
    meaning: 'Pace profonda, intuizione e respiro calmo.'
  },
  {
    id: 'margherita-celeste',
    name: 'Margherita Celeste Cielo',
    category: 'margherita',
    icon: '💠',
    petalColor: '#bae6fd',
    petalInnerColor: '#7dd3fc',
    centerColor: '#d97706',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'Come guardare le nuvole scivolare piano all’orizzonte.',
    meaning: 'Tranquillità, leggerezza e pensieri aperti.'
  },
  {
    id: 'margherita-pesca',
    name: 'Margherita Pesca Gentile',
    category: 'margherita',
    icon: '🌼',
    petalColor: '#fed7aa',
    petalInnerColor: '#fdba74',
    centerColor: '#ea580c',
    petalCount: 20,
    petalShape: 'round',
    poetry: 'Un abbraccio morbido che accoglie ogni emozione.',
    meaning: 'Empatia, gratitudine e comprensione.'
  },

  // ==========================================
  // TULIPANI DI VARI COLORI
  // ==========================================
  {
    id: 'tulipano-rosso',
    name: 'Tulipano Rosso Velluto',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#dc2626',
    petalInnerColor: '#b91c1c',
    centerColor: '#7f1d1d',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'La forza calda del cuore che batte a ritmo lento.',
    meaning: 'Amore puro, coraggio tranquillo e presenza.'
  },
  {
    id: 'tulipano-giallo',
    name: 'Tulipano Giallo Sole',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#facc15',
    petalInnerColor: '#eab308',
    centerColor: '#ca8a04',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'L’ottimismo del mattino che accoglie il nuovo giorno.',
    meaning: 'Allegria sincera, rinnovamento e solarità.'
  },
  {
    id: 'tulipano-rosa',
    name: 'Tulipano Rosa Confetto',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#ec4899',
    petalInnerColor: '#db2777',
    centerColor: '#9d174d',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'La grazia di chi si prende cura di sé con amore.',
    meaning: 'Affetto sincero, premura e delicatezza.'
  },
  {
    id: 'tulipano-viola',
    name: 'Tulipano Viola Ametista',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#9333ea',
    petalInnerColor: '#7e22ce',
    centerColor: '#581c87',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'L’eleganza del silenzio che rigenera lo spirito.',
    meaning: 'Saggezza, dignità interiore e contemplazione.'
  },
  {
    id: 'tulipano-arancio',
    name: 'Tulipano Arancio Tramonto',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#f97316',
    petalInnerColor: '#ea580c',
    centerColor: '#9a3412',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'Il calore dorato che scalda l’anima a fine giornata.',
    meaning: 'Creatività, entusiasmo e senso di casa.'
  },
  {
    id: 'tulipano-bianco',
    name: 'Tulipano Bianco Perla',
    category: 'tulipano',
    icon: '🌷',
    petalColor: '#f8fafc',
    petalInnerColor: '#e2e8f0',
    centerColor: '#cbd5e1',
    petalCount: 6,
    petalShape: 'layered',
    poetry: 'Una pagina bianca pronta per nuove dolci memorie.',
    meaning: 'Nuovo inizio, quiete e trasparenza.'
  },

  // ==========================================
  // ROSE DI VARI COLORI
  // ==========================================
  {
    id: 'rosa-rossa',
    name: 'Rosa Rossa Vellutata',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#e11d48',
    petalInnerColor: '#be123c',
    centerColor: '#881337',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'La bellezza profonda che protegge la propria unicità.',
    meaning: 'Passione armoniosa, dignità e calore vivo.'
  },
  {
    id: 'rosa-rosa',
    name: 'Rosa Cipria Pastello',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#f472b6',
    petalInnerColor: '#ec4899',
    centerColor: '#be185d',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'I petali di seta che accarezzano i pensieri agitati.',
    meaning: 'Gentilezza materna, cura ed eleganza.'
  },
  {
    id: 'rosa-bianca',
    name: 'Rosa Bianca Candore',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#ffffff',
    petalInnerColor: '#f1f5f9',
    centerColor: '#cbd5e1',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'La limpidezza di un cuore che non porta rancore.',
    meaning: 'Purezza, riconciliazione e pace dello spirito.'
  },
  {
    id: 'rosa-gialla',
    name: 'Rosa Gialla Amicizia',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#facc15',
    petalInnerColor: '#eab308',
    centerColor: '#ca8a04',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'Un legame sincero che non chiede nulla in cambio.',
    meaning: 'Lealtà, vicinanza emotiva e luce viva.'
  },
  {
    id: 'rosa-pesca',
    name: 'Rosa Corallo Alba',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#fb923c',
    petalInnerColor: '#f97316',
    centerColor: '#c2410c',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'La morbida sfumatura di un risveglio senza fretta.',
    meaning: 'Fiducia, calore accogliente e conforto.'
  },
  {
    id: 'rosa-lilla',
    name: 'Rosa Lilla Favola',
    category: 'rosa',
    icon: '🌹',
    petalColor: '#c084fc',
    petalInnerColor: '#a855f7',
    centerColor: '#7e22ce',
    petalCount: 16,
    petalShape: 'layered',
    poetry: 'Incanto e magia racchiusi in un profumo lieve.',
    meaning: 'Fascino gentile, sogni quieti e speranza.'
  },

  // ==========================================
  // GIRASOLI & ALTRE MERAVIGLIE DELLA NATURA
  // ==========================================
  {
    id: 'girasole',
    name: 'Girasole della Serenità',
    category: 'girasole',
    icon: '🌻',
    petalColor: '#eab308',
    petalInnerColor: '#ca8a04',
    centerColor: '#3f2212',
    petalCount: 18,
    petalShape: 'pointed',
    poetry: 'Cerca sempre la luce, anche nei giorni più lenti.',
    meaning: 'Calore, ottimismo e fiducia nel presente.'
  },
  {
    id: 'girasole-ambrato',
    name: 'Girasole Ambra Dorata',
    category: 'girasole',
    icon: '🌻',
    petalColor: '#f97316',
    petalInnerColor: '#c2410c',
    centerColor: '#2b1408',
    petalCount: 18,
    petalShape: 'pointed',
    poetry: 'La maturità dolce di chi sa aspettare il proprio tempo.',
    meaning: 'Pazienza premiata, abbondanza e radicamento.'
  },
  {
    id: 'dalia-corallo',
    name: 'Dalia Corallo Fiorito',
    category: 'dalia',
    icon: '🌸',
    petalColor: '#f87171',
    petalInnerColor: '#ef4444',
    centerColor: '#f59e0b',
    petalCount: 22,
    petalShape: 'fluffy',
    poetry: 'Ogni petalo trova il suo spazio con pazienza.',
    meaning: 'Armonia interiore e respiro profondo.'
  },
  {
    id: 'dalia-fucsia',
    name: 'Dalia Fucsia Radiosa',
    category: 'dalia',
    icon: '🌸',
    petalColor: '#e11d48',
    petalInnerColor: '#be123c',
    centerColor: '#f43f5e',
    petalCount: 22,
    petalShape: 'fluffy',
    poetry: 'Esprimere se stessi con grazia e senza timore.',
    meaning: 'Autostima positiva, bellezza e autenticità.'
  },
  {
    id: 'peonia-soffice',
    name: 'Peonia Rosa Soffice',
    category: 'peonia',
    icon: '🌺',
    petalColor: '#fbcfe8',
    petalInnerColor: '#f472b6',
    centerColor: '#db2777',
    petalCount: 20,
    petalShape: 'fluffy',
    poetry: 'La pienezza di un bocciolo che si apre al mondo.',
    meaning: 'Prosperità, guarigione del cuore e dolcezza.'
  },
  {
    id: 'peonia-cremisi',
    name: 'Peonia Rosso Rubino',
    category: 'peonia',
    icon: '🌺',
    petalColor: '#be123c',
    petalInnerColor: '#9f1239',
    centerColor: '#f59e0b',
    petalCount: 20,
    petalShape: 'fluffy',
    poetry: 'Intensità emotiva trasformata in amore protettivo.',
    meaning: 'Forza interiore, cura e prosperità affettiva.'
  },
  {
    id: 'fiordaliso-blu',
    name: 'Fiordaliso del Cielo Sereno',
    category: 'generico',
    icon: '🪻',
    petalColor: '#38bdf8',
    petalInnerColor: '#0284c7',
    centerColor: '#0369a1',
    petalCount: 12,
    petalShape: 'pointed',
    poetry: 'Uno sguardo aperto verso l’orizzonte calmo.',
    meaning: 'Leggerezza, distensione e respiro limpido.'
  },
  {
    id: 'papavero-rosso',
    name: 'Papavero dei Prati Dolci',
    category: 'generico',
    icon: '🌺',
    petalColor: '#ef4444',
    petalInnerColor: '#dc2626',
    centerColor: '#18181b',
    petalCount: 8,
    petalShape: 'fluffy',
    poetry: 'La bellezza effimera che insegna a godersi l’attimo.',
    meaning: 'Presenza nel qui e ora, riposo e sogno.'
  },
  {
    id: 'ninfea-bianca',
    name: 'Ninfea della Quiete',
    category: 'ninfea',
    icon: '🪷',
    petalColor: '#f8fafc',
    petalInnerColor: '#e2e8f0',
    centerColor: '#eab308',
    petalCount: 16,
    petalShape: 'pointed',
    poetry: 'Galleggiare sull’acqua calma senza paura di affondare.',
    meaning: 'Meditazione, limpidezza emotiva e distensione.'
  },
  {
    id: 'ninfea-loto',
    name: 'Fior di Loto Rosa',
    category: 'ninfea',
    icon: '🪷',
    petalColor: '#f472b6',
    petalInnerColor: '#db2777',
    centerColor: '#facc15',
    petalCount: 16,
    petalShape: 'pointed',
    poetry: 'Dalla terra scura nasce sempre il fiore più puro.',
    meaning: 'Rinascita, resilienza e calma imperturbabile.'
  },
  {
    id: 'lavanda',
    name: 'Lavanda Fiorita Dolce',
    category: 'generico',
    icon: '🪻',
    petalColor: '#a855f7',
    petalInnerColor: '#9333ea',
    centerColor: '#6b21a8',
    petalCount: 14,
    petalShape: 'layered',
    poetry: 'Il profumo del riposo che allenta le tensioni delle spalle.',
    meaning: 'Rilassamento muscolare e calma serale.'
  },
  {
    id: 'nontiscordardime',
    name: 'Non Ti Scordar di Me',
    category: 'generico',
    icon: '💠',
    petalColor: '#60a5fa',
    petalInnerColor: '#3b82f6',
    centerColor: '#facc15',
    petalCount: 10,
    petalShape: 'round',
    poetry: 'I piccoli gesti sono quelli che restano impressi nel cuore.',
    meaning: 'Memoria grata, fedeltà e affetto autentico.'
  },
  {
    id: 'camelia-rosa',
    name: 'Camelia Gentile Rosa',
    category: 'generico',
    icon: '🌸',
    petalColor: '#f43f5e',
    petalInnerColor: '#e11d48',
    centerColor: '#fef08a',
    petalCount: 14,
    petalShape: 'layered',
    poetry: 'Fiorire anche quando l’aria è fresca con costanza.',
    meaning: 'Stima profonda, perseveranza e tenerezza.'
  },
  {
    id: 'gerbera-arancio',
    name: 'Gerbera Arancio Vivace',
    category: 'margherita',
    icon: '🌼',
    petalColor: '#f97316',
    petalInnerColor: '#ea580c',
    centerColor: '#78350f',
    petalCount: 22,
    petalShape: 'round',
    poetry: 'Un raggio caldo che scioglie i dubbi e dona coraggio.',
    meaning: 'Vitalità accogliente, apertura e buonumore.'
  }
];

export const IlGiardinoMimmi: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Game Phase:
  // 1: Soil (touch and drag directly on the seed downwards to tuck it into the soil)
  // 2: Water (hold watering can to hydrate soil, duration randomized 5-20s)
  // 3: Sun & Growth (hold touch for radiant sunlight, duration randomized 5-20s)
  // 4: Celebration / Blooming display (random flower clearly visible, only "Pianta un nuovo fiore" button)
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  // Progress percentage (0 to 100)
  const [soilProgress, setSoilProgress] = useState(0);
  const [waterProgress, setWaterProgress] = useState(0);
  const [sunProgress, setSunProgress] = useState(0);

  // Dynamic game durations between 5 and 20 seconds maximum
  const [waterDuration, setWaterDuration] = useState<number>(() => Math.floor(Math.random() * 16) + 5);
  const [sunDuration, setSunDuration] = useState<number>(() => Math.floor(Math.random() * 16) + 5);

  // Accumulated active ms refs for precise duration calculation
  const waterAccumulatedMs = useRef<number>(0);
  const sunAccumulatedMs = useRef<number>(0);
  const lastActionTickTime = useRef<number>(0);

  // Flower selection (completely randomized at start and replant)
  const [flowerIndex, setFlowerIndex] = useState<number>(() => Math.floor(Math.random() * FLOWER_VARIETIES.length));
  const flower = FLOWER_VARIETIES[flowerIndex];

  // Character Mimmi's expression and speech
  const [mimmiState, setMimmiState] = useState<'idle' | 'happy' | 'gentle-warn' | 'proud'>('idle');
  const [mimmiSpeech, setMimmiSpeech] = useState<string>(
    'Ciao tesoro mio! Metti il dito sul semino e fallo scorrere dolcemente verso il basso per coprirlo di terra soffice 🌸'
  );

  // Visual effects
  const [dustPuff, setDustPuff] = useState(false);
  const [soilGlow, setSoilGlow] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [isSunActive, setIsSunActive] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Touch & Pointer Tracking Refs for Seed Drag
  const seedPointerStartY = useRef<number | null>(null);
  const seedLastMoveTime = useRef<number>(0);
  const isDraggingSeed = useRef(false);
  const warnTimeoutRef = useRef<number | null>(null);
  const hapticLastTime = useRef<number>(0);

  // Continuous watering & sun intervals
  const actionTimerRef = useRef<number | null>(null);

  // ----------------------------------------------------
  // FASE 1: DRAG DIRECTLY ON THE SEED DOWNWARDS OR TAP
  // ----------------------------------------------------
  const handlePlantDirectly = () => {
    if (phase !== 1) return;
    soundManager.playMimmiSoilDrag();
    // Animazione fluida verso il 100%
    setSoilProgress(prev => Math.min(100, Math.max(prev + 35, 100)));
    soundManager.playMimmiWaterComplete();
    setMimmiState('happy');
    setMimmiSpeech('Bravissima, tesoro mio! Il semino è al calduccio. Ora annaffialo con cura e dolcezza 💧');
    setTimeout(() => {
      setPhase(2);
      setMimmiState('idle');
    }, 600);
  };

  const handlePointerDownSeed = (e: React.PointerEvent) => {
    if (phase !== 1) return;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    seedPointerStartY.current = e.clientY;
    seedLastMoveTime.current = Date.now();
    isDraggingSeed.current = true;
    setMimmiState('happy');
    setMimmiSpeech('Bravissima, amore mio! Ora accompagnalo verso il basso con calma e dolcezza...');
  };

  const handlePointerMoveSeed = (e: React.PointerEvent) => {
    if (phase !== 1 || !isDraggingSeed.current || seedPointerStartY.current === null) return;
    e.stopPropagation();
    const now = Date.now();
    const currentY = e.clientY;
    const deltaY = currentY - seedPointerStartY.current;

    // GENTLE DOWNWARD SWIPE OR DRAG ON THE SEED
    if (deltaY > 0) {
      seedPointerStartY.current = currentY;
      seedLastMoveTime.current = now;
      soundManager.playMimmiSoilDrag();

      setSoilProgress(prev => {
        const next = Math.min(100, prev + Math.max(12, deltaY * 1.8));
        if (next >= 100) {
          isDraggingSeed.current = false;
          seedPointerStartY.current = null;
          soundManager.playMimmiWaterComplete();
          setMimmiState('happy');
          setMimmiSpeech('Bravissima, tesoro mio! Il semino è al calduccio. Ora annaffialo con cura e dolcezza 💧');
          setTimeout(() => {
            setPhase(2);
            setMimmiState('idle');
          }, 600);
        }
        return next;
      });
    }
  };

  const handlePointerUpSeed = (e?: React.PointerEvent) => {
    if (e) e.stopPropagation();
    isDraggingSeed.current = false;
    seedPointerStartY.current = null;
    
    // Se è stato rilasciato o cliccato durante la fase 1, completa la piantagione
    if (phase === 1) {
      handlePlantDirectly();
    }
  };

  // ----------------------------------------------------
  // FASE 2: WATERING (Hold watering can to cascade drops)
  // Total duration: waterDuration (5s to 20s)
  // ----------------------------------------------------
  const handleStartWatering = () => {
    if (phase !== 2) return;
    setIsWatering(true);
    setMimmiState('happy');
    setMimmiSpeech('Che freschezza, amore mio... la terra beve a piccoli sorsi.');
    lastActionTickTime.current = Date.now();

    if (actionTimerRef.current) clearInterval(actionTimerRef.current);
    actionTimerRef.current = window.setInterval(() => {
      const now = Date.now();
      const dt = Math.max(16, now - lastActionTickTime.current);
      lastActionTickTime.current = now;
      waterAccumulatedMs.current += dt;

      soundManager.playMimmiWaterDrop();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(22);
      }

      const currentPercent = Math.min(100, (waterAccumulatedMs.current / (waterDuration * 1000)) * 100);
      setWaterProgress(currentPercent);

      if (currentPercent >= 100) {
        if (actionTimerRef.current) clearInterval(actionTimerRef.current);
        actionTimerRef.current = null;
        setIsWatering(false);
        setSoilGlow(true);
        soundManager.playMimmiWaterComplete();
        setMimmiState('proud');
        setMimmiSpeech('Bravissima, tesoro mio! La terra è ben idratata. Ora tieni premuto per donarle il calore del sole ☀️');

        setTimeout(() => {
          setSoilGlow(false);
          setPhase(3);
          setMimmiState('idle');
        }, 950);
      }
    }, 100);
  };

  const handleStopWatering = () => {
    if (phase !== 2) return;
    setIsWatering(false);
    if (actionTimerRef.current) {
      clearInterval(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    if (waterProgress < 100) {
      setMimmiState('idle');
      setMimmiSpeech('Tieni premuto sull\'annaffiatoio, tesoro mio, finché il terriccio non è ben bagnato.');
    }
  };

  // ----------------------------------------------------
  // FASE 3: SUNLIGHT & PLANT GROWTH (Hold touch on screen)
  // Total duration: sunDuration (5s to 20s)
  // ----------------------------------------------------
  const handleStartSun = () => {
    if (phase !== 3) return;
    setIsSunActive(true);
    setMimmiState('happy');
    setMimmiSpeech('Senti che bel tepore, amore mio? Lascia splendere il sole con dolcezza...');
    lastActionTickTime.current = Date.now();

    if (actionTimerRef.current) clearInterval(actionTimerRef.current);
    actionTimerRef.current = window.setInterval(() => {
      const now = Date.now();
      const dt = Math.max(16, now - lastActionTickTime.current);
      lastActionTickTime.current = now;
      sunAccumulatedMs.current += dt;

      soundManager.playMimmiSunPulse();

      // Gentle rhythmic haptic pulse (~60 bpm)
      if (now - hapticLastTime.current > 950) {
        hapticLastTime.current = now;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 50]);
        }
      }

      const currentPercent = Math.min(100, (sunAccumulatedMs.current / (sunDuration * 1000)) * 100);
      setSunProgress(currentPercent);

      if (currentPercent >= 100) {
        if (actionTimerRef.current) clearInterval(actionTimerRef.current);
        actionTimerRef.current = null;
        setIsSunActive(false);
        soundManager.playMimmiBloom();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([70, 50, 120]);
        }

        setPhase(4);
        setMimmiState('proud');
        setMimmiSpeech(
          `Sei stata bravissima, amore mio! Guarda che splendida ${flower.name} hai fatto sbocciare con la tua calma e dolcezza 🌸`
        );
      }
    }, 100);
  };

  const handleStopSun = () => {
    if (phase !== 3) return;
    setIsSunActive(false);
    if (actionTimerRef.current) {
      clearInterval(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    if (sunProgress < 100) {
      setMimmiState('idle');
      setMimmiSpeech('Tocca o tieni premuto il vaso, tesoro mio, per continuare a riscaldare la piantina.');
    }
  };

  // Direct Tap on the Pot in Phase 2 & 3 for immediate responsive interaction
  const handleTapPot = () => {
    if (phase === 2) {
      soundManager.playMimmiWaterDrop();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(22);
      setWaterProgress(prev => {
        const next = Math.min(100, prev + 25);
        if (next >= 100) {
          setIsWatering(false);
          setSoilGlow(true);
          soundManager.playMimmiWaterComplete();
          setMimmiState('proud');
          setMimmiSpeech('Bravissima, tesoro mio! La terra è ben idratata. Ora tocca il vaso per donarle il calore del sole ☀️');
          setTimeout(() => {
            setSoilGlow(false);
            setPhase(3);
            setMimmiState('idle');
          }, 850);
        }
        return next;
      });
    } else if (phase === 3) {
      soundManager.playMimmiSunPulse();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([35, 45]);
      setSunProgress(prev => {
        const next = Math.min(100, prev + 25);
        if (next >= 100) {
          setIsSunActive(false);
          soundManager.playMimmiBloom();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([70, 50, 120]);
          }
          setPhase(4);
          setMimmiState('proud');
          setMimmiSpeech(
            `Sei stata bravissima, tesoro mio! Guarda che splendida ${flower.name} hai fatto sbocciare con la tua calma e dolcezza 🌸`
          );
        }
        return next;
      });
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (actionTimerRef.current) clearInterval(actionTimerRef.current);
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    };
  }, []);

  // Replant a fresh flower (completely randomized selection across all varieties)
  const handleReplant = useCallback(() => {
    let nextIndex = Math.floor(Math.random() * FLOWER_VARIETIES.length);
    if (nextIndex === flowerIndex && FLOWER_VARIETIES.length > 1) {
      nextIndex = (nextIndex + 1) % FLOWER_VARIETIES.length;
    }
    setFlowerIndex(nextIndex);
    setPhase(1);
    setSoilProgress(0);
    setWaterProgress(0);
    setSunProgress(0);
    waterAccumulatedMs.current = 0;
    sunAccumulatedMs.current = 0;

    const newWaterTime = Math.floor(Math.random() * 16) + 5;
    const newSunTime = Math.floor(Math.random() * 16) + 5;
    setWaterDuration(newWaterTime);
    setSunDuration(newSunTime);

    setMimmiState('idle');
    setMimmiSpeech(
      'Ecco un nuovo semino tutto per te, amore mio! Metti il dito sul semino e fallo scorrere con dolcezza verso il basso.'
    );
  }, [flowerIndex]);

  // ----------------------------------------------------
  // RENDER PURE BOTANICAL FLOWER BLOOMS
  // (NO ROTATING GOLD DISC, BEAUTIFULLY VISIBLE PETALS)
  // ----------------------------------------------------
  const renderFlowerBloom = (fl: FlowerVariety) => {
    // 1. ROSA: Rich layered velvety rose petals folding gracefully inward
    if (fl.category === 'rosa') {
      return (
        <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center">
          {/* Outer large petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <motion.div
              key={`outer-${i}`}
              className="absolute w-12 h-16 sm:w-14 sm:h-18 rounded-[48%_52%_60%_40%] shadow-sm"
              style={{
                backgroundColor: fl.petalColor,
                transformOrigin: '50% 70%',
                transform: `rotate(${deg}deg) translateY(-14px)`
              }}
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ repeat: Infinity, duration: 4, delay: i * 0.1 }}
            >
              <div
                className="w-8 h-11 rounded-full mx-auto mt-1 opacity-70"
                style={{ backgroundColor: fl.petalInnerColor }}
              />
            </motion.div>
          ))}

          {/* Middle tier overlapping rose petals */}
          {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
            <motion.div
              key={`mid-${i}`}
              className="absolute w-9 h-13 sm:w-10 sm:h-14 rounded-[50%_50%_62%_38%] shadow-xs"
              style={{
                backgroundColor: fl.petalInnerColor,
                transformOrigin: '50% 65%',
                transform: `rotate(${deg}deg) translateY(-8px)`
              }}
              animate={{ scale: [0.99, 1.01, 0.99] }}
              transition={{ repeat: Infinity, duration: 3.6, delay: i * 0.12 }}
            />
          ))}

          {/* Natural botanical spiraled rose bud core (NO GOLD CIRCLE) */}
          <div
            className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-inner flex items-center justify-center border border-white/30"
            style={{ backgroundColor: fl.centerColor }}
          >
            {/* Natural inner petal swirl folds */}
            <div
              className="w-6 h-6 rounded-[52%_48%_60%_40%] border-2 border-white/40 rotate-45 shadow-inner"
              style={{ backgroundColor: fl.petalInnerColor }}
            />
            <div
              className="absolute w-3 h-3 rounded-full shadow-inner"
              style={{ backgroundColor: fl.centerColor }}
            />
          </div>
        </div>
      );
    }

    // 2. TULIPANO: Elegant tall chalice tulip bloom
    if (fl.category === 'tulipano') {
      return (
        <div className="relative w-28 h-32 sm:w-32 sm:h-36 flex flex-col items-center justify-end pb-2">
          {/* Back petal */}
          <div
            className="absolute bottom-4 w-12 h-22 sm:w-14 sm:h-24 rounded-[50%_50%_50%_50%] opacity-90 shadow-xs"
            style={{ backgroundColor: fl.petalInnerColor }}
          />

          {/* Left petal */}
          <motion.div
            animate={{ rotate: [-24, -22, -24] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute bottom-3 left-1 w-11 h-21 sm:w-12 sm:h-23 rounded-[80%_20%_40%_60%] shadow-md border-t border-white/30"
            style={{
              backgroundColor: fl.petalColor,
              transformOrigin: 'bottom right'
            }}
          >
            <div
              className="w-6 h-14 rounded-full mt-2 ml-1 opacity-75"
              style={{ backgroundColor: fl.petalInnerColor }}
            />
          </motion.div>

          {/* Right petal */}
          <motion.div
            animate={{ rotate: [24, 22, 24] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute bottom-3 right-1 w-11 h-21 sm:w-12 sm:h-23 rounded-[20%_80%_60%_40%] shadow-md border-t border-white/30"
            style={{
              backgroundColor: fl.petalColor,
              transformOrigin: 'bottom left'
            }}
          >
            <div
              className="w-6 h-14 rounded-full mt-2 mr-1 opacity-75"
              style={{ backgroundColor: fl.petalInnerColor }}
            />
          </motion.div>

          {/* Front overlapping tulip petal with satin sheen */}
          <motion.div
            animate={{ scaleY: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="relative z-10 w-12 h-22 sm:w-14 sm:h-25 rounded-[45%_45%_55%_55%] shadow-lg border-t border-white/50 flex flex-col items-center justify-start pt-2"
            style={{ backgroundColor: fl.petalInnerColor }}
          >
            <div
              className="w-6 h-14 rounded-full opacity-60"
              style={{ backgroundColor: fl.petalColor }}
            />
          </motion.div>

          {/* Calyx base */}
          <div
            className="relative z-10 -mt-2.5 w-8 h-4 rounded-b-full shadow-2xs"
            style={{ backgroundColor: '#2d6a4f' }}
          />
        </div>
      );
    }

    // 3. MARGHERITA: Radiating long slender daisy petals & natural botanical disc center
    if (fl.category === 'margherita') {
      return (
        <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center">
          {/* Slender radiating daisy petals */}
          {[...Array(fl.petalCount)].map((_, idx) => {
            const angle = (idx * 360) / fl.petalCount;
            return (
              <motion.div
                key={idx}
                className="absolute w-4.5 h-13 sm:w-5 sm:h-15 rounded-full shadow-2xs border-t border-white/40"
                style={{
                  backgroundColor: fl.petalColor,
                  transformOrigin: '50% 100%',
                  transform: `rotate(${angle}deg) translateY(-20px)`
                }}
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ repeat: Infinity, duration: 3.8, delay: idx * 0.08 }}
              >
                <div
                  className="w-2.5 h-7 rounded-full mx-auto mt-1 opacity-70"
                  style={{ backgroundColor: fl.petalInnerColor }}
                />
              </motion.div>
            );
          })}

          {/* Natural compact botanical disc center (NO ROTATING CIRCLE, PROPORTIONATE) */}
          <div
            className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-md border border-amber-200/80 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: fl.centerColor }}
          >
            {/* Natural seed texture */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78350f_1.2px,transparent_1.2px)] bg-[size:3.5px_3.5px]" />
            <div className="w-4 h-4 rounded-full border border-white/30 opacity-50" />
          </div>
        </div>
      );
    }

    // 4. GIRASOLE: Warm pointed sun-ray petals & chocolate seed disk
    if (fl.category === 'girasole') {
      return (
        <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center">
          {/* Pointed ray petals */}
          {[...Array(fl.petalCount)].map((_, idx) => {
            const angle = (idx * 360) / fl.petalCount;
            return (
              <motion.div
                key={idx}
                className="absolute w-6 h-14 sm:w-7 sm:h-16 rounded-t-[75%] rounded-b-[25%] shadow-sm"
                style={{
                  backgroundColor: fl.petalColor,
                  transformOrigin: '50% 100%',
                  transform: `rotate(${angle}deg) translateY(-22px)`
                }}
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ repeat: Infinity, duration: 3.6, delay: idx * 0.09 }}
              >
                <div
                  className="w-3.5 h-8 rounded-full mx-auto mt-1 opacity-80"
                  style={{ backgroundColor: fl.petalInnerColor }}
                />
              </motion.div>
            );
          })}

          {/* Dark chocolate botanical seeded center */}
          <div
            className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-md border border-[#5c3a21] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: fl.centerColor }}
          >
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#fde047_1px,transparent_1px)] bg-[size:3px_3px]" />
            <div className="w-5 h-5 rounded-full border border-[#fde047]/30 opacity-40" />
          </div>
        </div>
      );
    }

    // 5. DALIA, PEONIA, NINFEA & ALTRI: Full, vibrant, natural multilayered petals
    return (
      <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center">
        {/* Tier 1: Outer petals */}
        {[...Array(fl.petalCount)].map((_, idx) => {
          const angle = (idx * 360) / fl.petalCount;
          return (
            <motion.div
              key={`outer-${idx}`}
              className={`absolute shadow-sm ${
                fl.petalShape === 'fluffy'
                  ? 'w-8 h-14 sm:w-9 sm:h-16 rounded-t-full rounded-b-2xl'
                  : 'w-7 h-13 sm:w-8 sm:h-15 rounded-full'
              }`}
              style={{
                backgroundColor: fl.petalColor,
                transformOrigin: '50% 100%',
                transform: `rotate(${angle}deg) translateY(-22px)`
              }}
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ repeat: Infinity, duration: 3.6, delay: idx * 0.08 }}
            >
              <div
                className="w-4 h-7 rounded-full mx-auto mt-1 opacity-75"
                style={{ backgroundColor: fl.petalInnerColor }}
              />
            </motion.div>
          );
        })}

        {/* Tier 2: Inner petals (offset by half an angle) */}
        {[...Array(Math.floor(fl.petalCount * 0.7))].map((_, idx) => {
          const count = Math.floor(fl.petalCount * 0.7);
          const angle = (idx * 360) / count + 15;
          return (
            <motion.div
              key={`inner-${idx}`}
              className="absolute w-5 h-10 sm:w-6 sm:h-12 rounded-full opacity-90 shadow-2xs"
              style={{
                backgroundColor: fl.petalInnerColor,
                transformOrigin: '50% 100%',
                transform: `rotate(${angle}deg) translateY(-14px)`
              }}
            />
          );
        })}

        {/* Natural delicate floral pistil center (NO ROTATING COIN) */}
        <div
          className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-inner border border-white/40 flex items-center justify-center"
          style={{ backgroundColor: fl.centerColor }}
        >
          <div className="w-3.5 h-3.5 rounded-full border border-white/50 opacity-60" />
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-gradient-to-b from-[#eaf8ee] via-[#f3fcf6] to-[#fbf7f0] dark:from-[#091512] dark:via-[#0e211b] dark:to-[#14261f] text-[#3e2b1d] dark:text-slate-100 flex flex-col justify-between select-none touch-none overflow-hidden font-sans w-full h-[100dvh] max-h-[100dvh]"
      style={{ touchAction: 'none' }}
    >
      {/* ---------------------------------------------------- */}
      {/* ATMOSPHERIC BOTANICAL GARDEN & GREENHOUSE SCENE      */}
      {/* ---------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Pastoral Morning Sunbeams & Sky Gradient */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-radial from-amber-200/50 via-emerald-100/35 to-transparent dark:from-emerald-900/35 dark:via-teal-950/20 dark:to-transparent rounded-full blur-3xl" />

        {/* Distant Sunny Garden Vista SVG (Rolling Green Hills, Trees & Glass Arches) */}
        <div className="absolute top-0 inset-x-0 h-72 sm:h-80 opacity-45 dark:opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="none">
            {/* Distant soft hills */}
            <path d="M 0,160 Q 90,110 200,140 T 400,120 L 400,240 L 0,240 Z" fill="#bbf7d0" opacity="0.6" />
            <path d="M 0,180 Q 120,130 250,160 T 400,150 L 400,240 L 0,240 Z" fill="#86efac" opacity="0.7" />
            
            {/* Pastel flowering trees in distance */}
            <circle cx="60" cy="140" r="22" fill="#fbcfe8" opacity="0.8" />
            <circle cx="85" cy="135" r="18" fill="#fed7aa" opacity="0.7" />
            <circle cx="330" cy="130" r="24" fill="#fbcfe8" opacity="0.8" />
            <circle cx="355" cy="135" r="19" fill="#fef08a" opacity="0.7" />
            
            {/* Elegant greenhouse glass arch framing */}
            <path d="M 0,0 L 400,0 L 400,240 L 0,240 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            <path d="M 200,0 L 200,240" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <path d="M 100,0 L 100,240 M 300,0 L 300,240" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <path d="M 0,80 L 400,80 M 0,160 L 400,160" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <path d="M 0,80 Q 100,40 200,40 Q 300,40 400,80" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Top Cascading Botanical Vines & Ivy (Left & Right) */}
        <div className="absolute top-0 inset-x-0 flex justify-between items-start px-1 sm:px-2 pointer-events-none opacity-85 dark:opacity-60">
          {/* Left cascading vine cluster */}
          <svg className="w-28 sm:w-36 h-28 sm:h-36" viewBox="0 0 100 100" fill="none">
            <path d="M 0,0 Q 20,25 15,55 Q 12,70 22,90" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 15,10 Q 40,30 35,65 Q 32,80 42,95" stroke="#40916c" strokeWidth="2" strokeLinecap="round" />
            <path d="M 30,0 Q 55,20 60,45" stroke="#52b788" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 12,25 C 2,20 0,35 14,35 C 22,35 20,22 12,25 Z" fill="#40916c" />
            <path d="M 22,45 C 10,40 12,58 24,56 C 32,54 28,42 22,45 Z" fill="#52b788" />
            <path d="M 16,68 C 8,65 10,80 20,78 C 26,76 22,66 16,68 Z" fill="#74c69d" />
            <path d="M 38,32 C 28,26 30,42 42,40 C 48,38 44,28 38,32 Z" fill="#2d6a4f" />
            <path d="M 35,58 C 25,52 28,68 38,66 C 45,64 42,54 35,58 Z" fill="#52b788" />
            <path d="M 55,22 C 45,18 48,32 58,30 C 64,28 62,20 55,22 Z" fill="#74c69d" />
            <circle cx="22" cy="38" r="3" fill="#f472b6" />
            <circle cx="34" cy="72" r="2.5" fill="#f472b6" />
            <circle cx="48" cy="48" r="3" fill="#fb7185" />
          </svg>

          {/* Right cascading vine cluster */}
          <svg className="w-28 sm:w-36 h-28 sm:h-36 -scale-x-100" viewBox="0 0 100 100" fill="none">
            <path d="M 0,0 Q 20,25 15,55 Q 12,70 22,90" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 15,10 Q 40,30 35,65 Q 32,80 42,95" stroke="#40916c" strokeWidth="2" strokeLinecap="round" />
            <path d="M 30,0 Q 55,20 60,45" stroke="#52b788" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 12,25 C 2,20 0,35 14,35 C 22,35 20,22 12,25 Z" fill="#40916c" />
            <path d="M 22,45 C 10,40 12,58 24,56 C 32,54 28,42 22,45 Z" fill="#52b788" />
            <path d="M 16,68 C 8,65 10,80 20,78 C 26,76 22,66 16,68 Z" fill="#74c69d" />
            <path d="M 38,32 C 28,26 30,42 42,40 C 48,38 44,28 38,32 Z" fill="#2d6a4f" />
            <path d="M 35,58 C 25,52 28,68 38,66 C 45,64 42,54 35,58 Z" fill="#52b788" />
            <circle cx="22" cy="38" r="3" fill="#f472b6" />
            <circle cx="34" cy="72" r="2.5" fill="#f472b6" />
          </svg>
        </div>

        {/* Flanking Greenhouse Plants on Sides */}
        {/* Left Monstera & Fern silhouette */}
        <div className="absolute bottom-28 -left-5 sm:left-1 w-20 sm:w-28 h-44 sm:h-56 opacity-50 dark:opacity-30 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 160" fill="none">
            <path d="M 20,150 Q 40,100 65,70 Q 75,55 55,40 Q 35,30 25,60 Z" fill="#2d6a4f" />
            <path d="M 10,140 Q 30,85 50,55" stroke="#1b4332" strokeWidth="2" />
            <path d="M 20,160 Q 60,120 85,95 Q 95,80 75,65 Q 55,60 40,90 Z" fill="#40916c" />
            <path d="M 20,160 Q 15,110 5,80" stroke="#52b788" strokeWidth="2" />
            <ellipse cx="10" cy="85" rx="7" ry="3" fill="#52b788" transform="rotate(-30 10 85)" />
            <ellipse cx="12" cy="100" rx="8" ry="3.5" fill="#74c69d" transform="rotate(-30 12 100)" />
          </svg>
        </div>

        {/* Right Potted Lavender & Daisies */}
        <div className="absolute bottom-28 -right-4 sm:right-1 w-20 sm:w-28 h-44 sm:h-56 opacity-50 dark:opacity-30 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 160" fill="none">
            <path d="M 50,150 Q 45,90 40,40" stroke="#3f6212" strokeWidth="2" />
            <path d="M 60,150 Q 65,95 70,50" stroke="#3f6212" strokeWidth="2" />
            <path d="M 75,150 Q 80,105 85,65" stroke="#3f6212" strokeWidth="2" />
            {[45, 55, 65, 75, 85].map((y, i) => (
              <ellipse key={`lav1-${i}`} cx="40" cy={y} rx="5" ry="3" fill="#a855f7" />
            ))}
            {[55, 65, 75, 85, 95].map((y, i) => (
              <ellipse key={`lav2-${i}`} cx="70" cy={y} rx="5" ry="3" fill="#c084fc" />
            ))}
            {[70, 80, 90].map((y, i) => (
              <ellipse key={`lav3-${i}`} cx="85" cy={y} rx="4.5" ry="3" fill="#a855f7" />
            ))}
          </svg>
        </div>

        {/* Gentle Animated Drifting Flower Petals */}
        <motion.div
          animate={{ x: [0, 40, -15, 30], y: [-20, 260, 520, 800], rotate: [0, 180, 360, 540] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute top-4 left-1/4 w-3.5 h-2.5 bg-pink-200/70 rounded-full shadow-2xs pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -35, 20, -25], y: [-20, 280, 540, 820], rotate: [45, 210, 420, 600] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 4 }}
          className="absolute top-8 right-1/4 w-3 h-2 bg-pink-100/80 rounded-full shadow-2xs pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 25, -20, 15], y: [-20, 240, 500, 780], rotate: [90, 270, 450, 630] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 8 }}
          className="absolute top-12 left-1/2 w-3 h-2.5 bg-amber-100/70 rounded-full shadow-2xs pointer-events-none"
        />

        {/* Cute Garden Butterfly Fluttering in Upper Corner */}
        <motion.div
          animate={{
            x: [0, 25, 10, 40, 0],
            y: [0, -12, 8, -6, 0],
            rotate: [0, 8, -6, 12, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-14 right-10 pointer-events-none opacity-80"
        >
          <div className="flex items-center text-sm drop-shadow-xs">
            🦋
          </div>
        </motion.div>

        {/* Ambient floating golden pollen sparkles */}
        <div className="absolute top-24 left-12 w-2 h-2 bg-amber-300/60 dark:bg-amber-300/40 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-36 right-16 w-2.5 h-2.5 bg-amber-200/60 dark:bg-amber-200/40 rounded-full blur-[1px] animate-ping" />
        <div className="absolute top-52 left-1/3 w-1.5 h-1.5 bg-emerald-200/60 rounded-full blur-[0.8px] animate-pulse" />

        {/* Cozy Botanical Potting Shelf at the Bottom with Props */}
        <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#8d633a] via-[#a87a4c] to-[#bc8c5c] dark:from-[#21160e] dark:via-[#332216] dark:to-[#422c1d] border-t-2 border-[#7c542d] dark:border-[#422c1d] shadow-2xl">
          {/* Wood Planks & Grain lines */}
          <div className="w-full h-0.5 bg-[#6b4724]/35 my-2.5" />
          <div className="w-full h-0.5 bg-[#6b4724]/30 my-4" />

          {/* Shelf Botanical Details: Miniature Vintage Watering Can on Left */}
          <div className="absolute bottom-4 left-3 sm:left-6 opacity-75 dark:opacity-60 flex items-end gap-1">
            <svg className="w-9 sm:w-11 h-9 sm:h-11" viewBox="0 0 40 40" fill="none">
              <ellipse cx="20" cy="27" rx="10" ry="7" fill="#6ee7b7" stroke="#059669" strokeWidth="1.2" />
              <path d="M 28,26 L 37,18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="37" cy="18" r="2.5" fill="#f59e0b" />
              <path d="M 12,24 Q 7,17 14,14 Q 21,14 21,20" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <div className="text-[10px] text-amber-950/70 dark:text-amber-200/60 font-black">
              🌱
            </div>
          </div>

          {/* Shelf Botanical Details: Tiny terracotta seed pots on Right */}
          <div className="absolute bottom-3 right-4 sm:right-8 opacity-75 dark:opacity-60 flex items-end gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] -mb-1">🌿</span>
              <div className="w-5 h-5 bg-[#c25e36] rounded-b-md border border-[#9c4524] shadow-xs" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] -mb-1">🌸</span>
              <div className="w-6 h-6 bg-[#b8562f] rounded-b-md border border-[#9c4524] shadow-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTAINER (GUARANTEED 100% IN-SCREEN FIT)       */}
      {/* ---------------------------------------------------- */}
      <div className="relative flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-3.5 py-2 sm:py-3 z-10 select-none overflow-hidden min-h-0">
        
        {/* ================================================== */}
        {/* 1. TOP BAR: Title, Lightbulb info, Exit button     */}
        {/* ================================================== */}
        <header className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          <div className="w-8" />

          <div className="flex items-center justify-center gap-1.5 calm-white-card px-3.5 py-1 rounded-full shadow-md border-2 border-stone-300">
            <h2 className="text-stone-950 font-black text-base sm:text-xl tracking-wide font-['Quicksand']">
              Il Giardino di Mimmi
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-amber-800 hover:text-amber-950 active:scale-95 transition-all rounded-full hover:bg-amber-100/70 cursor-pointer"
              title="Come prendersi cura del fiore"
              aria-label="Regole e spiegazione"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-stone-950 rounded-full shadow-md shrink-0 border-2 border-stone-300 cursor-pointer"
            aria-label="Esci dal giardino"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
          </button>
        </header>

        {/* ================================================== */}
        {/* 2. COMPACT STEPPER PILLS                           */}
        {/* ================================================== */}
        <nav aria-label="Fasi del giardino" className="flex justify-center items-center gap-1.5 shrink-0 my-0.5">
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-xs border-2 ${
              phase === 1
                ? 'bg-amber-800 text-white border-amber-900 scale-102 shadow-md'
                : phase > 1
                ? 'calm-white-card text-emerald-800 border-emerald-500'
                : 'calm-white-card text-stone-600 border-stone-300'
            }`}
          >
            <Sprout className="w-3 h-3" />
            <span>1. Terriccio</span>
          </div>
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-xs border-2 ${
              phase === 2
                ? 'bg-blue-600 text-white border-blue-700 scale-102 shadow-md'
                : phase > 2
                ? 'calm-white-card text-blue-900 border-blue-400'
                : 'calm-white-card text-stone-600 border-stone-300'
            }`}
          >
            <Droplets className="w-3 h-3" />
            <span>2. Acqua</span>
          </div>
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-xs border-2 ${
              phase === 3
                ? 'bg-orange-600 text-white border-orange-700 scale-102 shadow-md'
                : phase > 3
                ? 'calm-white-card text-orange-900 border-orange-400'
                : 'calm-white-card text-stone-600 border-stone-300'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>3. Sole</span>
          </div>
        </nav>

        {/* ================================================== */}
        {/* 3. MAMMA MIMMI (REDESIGNED) & SPEECH BUBBLE        */}
        {/* ================================================== */}
        <section aria-label="Guida di Mamma Mimmi" className="w-full flex items-center gap-2.5 shrink-0 my-1">
          {/* MIMMI CHARACTER: BEAUTIFUL FULL BROWN HAIR OR CUSTOM IMAGE */}
          <div className="shrink-0 relative flex flex-col items-center">
            <motion.div
              animate={{
                y: mimmiState === 'gentle-warn' ? [0, -2, 0] : [0, -1.2, 0],
                rotate: mimmiState === 'gentle-warn' ? [0, -1.5, 1.5, 0] : 0
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
              className="relative w-18 h-22 sm:w-22 sm:h-26 drop-shadow-md flex items-center justify-center"
            >
              {MIMMI_CUSTOM_IMAGE ? (
                <div className="w-18 h-22 sm:w-22 sm:h-26 flex items-center justify-center">
                  <img
                    src={MIMMI_CUSTOM_IMAGE}
                    alt="Mimmi"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-sm select-none"
                  />
                </div>
              ) : (
                <svg width="100%" height="100%" viewBox="0 0 120 135" className="overflow-visible">
                {/* 1. BACK FLOWING BROWN HAIR (Dark chocolate base) */}
                <path
                  d="M 18,65 C 14,35 24,18 60,15 C 96,18 106,35 102,65 C 106,95 99,122 88,127 C 76,121 44,121 32,127 C 21,122 14,95 18,65 Z"
                  fill="#3d2012"
                />

                {/* 2. CUTE HALF-UP HAIR BUN AT THE TOP */}
                <ellipse cx="60" cy="18" rx="16" ry="11" fill="#4a2716" />
                <ellipse cx="60" cy="16" rx="12" ry="7" fill="#5c321b" />
                {/* Floral hairpin / ribbon */}
                <circle cx="68" cy="22" r="4" fill="#fbc3bc" />
                <circle cx="68" cy="22" r="1.8" fill="#f6d365" />

                {/* 3. NECK */}
                <rect x="52" y="79" width="16" height="19" rx="5" fill="#fcd7be" />

                {/* 4. COZY PASTEL DUSTY-ROSE CARDIGAN & SHOULDERS */}
                <path
                  d="M 21,133 C 21,104 39,94 60,94 C 81,94 99,104 99,133 Z"
                  fill="#f8b4aa"
                />
                {/* Inner white tee collar neckline */}
                <path d="M 45,95 L 60,113 L 75,95 Z" fill="#fffbf5" />

                {/* 5. SAGE GREEN GARDENING APRON BIB */}
                <path
                  d="M 38,103 L 82,103 L 86,134 L 34,134 Z"
                  fill="#98be9f"
                />
                {/* Apron Pocket with Tiny Embroidered Daisy */}
                <rect x="48" y="114" width="24" height="18" rx="4" fill="#84ad8c" />
                <circle cx="60" cy="123" r="3" fill="#ffffff" />
                <circle cx="60" cy="123" r="1.3" fill="#f59e0b" />

                {/* 6. HEAD & FACE BASE */}
                <ellipse cx="60" cy="62" rx="27" ry="28" fill="#fcd7be" />

                {/* Cute ears with pearl earrings */}
                <circle cx="33" cy="64" r="5" fill="#fcd7be" />
                <circle cx="33" cy="65.5" r="2.2" fill="#ffffff" />
                <circle cx="87" cy="64" r="5" fill="#fcd7be" />
                <circle cx="87" cy="65.5" r="2.2" fill="#ffffff" />

                {/* 7. FULL, RICH, VOLUMINOUS BROWN HAIR */}
                <path
                  d="M 28,54 C 26,24 40,15 60,15 C 80,15 94,24 92,54 C 90,30 78,24 60,24 C 42,24 30,30 28,54 Z"
                  fill="#542c17"
                />

                {/* Silky Side-Swept Bangs covering upper forehead gracefully */}
                <path
                  d="M 29,52 C 33,35 46,27 63,27 C 78,27 89,33 91,48 C 87,38 75,32 61,33 C 46,34 35,42 29,52 Z"
                  fill="#5f341c"
                />

                {/* Layered Bangs strand over brow */}
                <path
                  d="M 32,50 C 37,36 53,30 70,35 C 57,37 44,45 36,54 Z"
                  fill="#6d3c21"
                />
                <path
                  d="M 64,33 C 74,33 85,38 89,49 C 85,42 77,37 66,36 Z"
                  fill="#6d3c21"
                />

                {/* Lush side locks framing the cheeks and flowing down past shoulders */}
                <path
                  d="M 30,49 C 25,65 29,84 35,92 C 37,82 34,68 35,51 Z"
                  fill="#4c2613"
                />
                <path
                  d="M 90,49 C 95,65 91,84 85,92 C 83,82 86,68 85,51 Z"
                  fill="#4c2613"
                />

                {/* Silky hair highlights & shine */}
                <path
                  d="M 44,22 C 52,18 68,18 76,22"
                  stroke="#91562e"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 40,31 C 48,27 60,27 69,30"
                  stroke="#91562e"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* 8. FACIAL FEATURES: SWEET, CALMING MOTHERLY EXPRESSION */}
                {/* Soft Rosy Cheeks */}
                <ellipse cx="44" cy="69" rx="6.5" ry="4" fill="#f8a5a5" opacity="0.65" />
                <ellipse cx="76" cy="69" rx="6.5" ry="4" fill="#f8a5a5" opacity="0.65" />

                {/* Gentle maternal eyebrows */}
                <path d="M 42,50 Q 48,46 54,49" stroke="#482412" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M 78,50 Q 72,46 66,49" stroke="#482412" strokeWidth="2.2" fill="none" strokeLinecap="round" />

                {/* Expressive loving eyes */}
                {mimmiState === 'gentle-warn' ? (
                  <>
                    <path d="M 44,57 Q 49,51 54,57" stroke="#361a0d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M 66,57 Q 71,51 76,57" stroke="#361a0d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="49" cy="60" r="4.2" fill="#361a0d" />
                    <circle cx="71" cy="60" r="4.2" fill="#361a0d" />
                    <circle cx="50.6" cy="58.2" r="1.6" fill="#ffffff" />
                    <circle cx="72.6" cy="58.2" r="1.6" fill="#ffffff" />
                    <circle cx="47.6" cy="61.4" r="0.8" fill="#ffffff" />
                    <circle cx="69.6" cy="61.4" r="0.8" fill="#ffffff" />
                    <path d="M 44,57 Q 49,54 54,57" stroke="#361a0d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <path d="M 66,57 Q 71,54 76,57" stroke="#361a0d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </>
                )}

                {/* Cute button nose */}
                <path d="M 58.5,63 Q 60,65.5 61.5,63" stroke="#d9826c" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Sweet caring motherly smile */}
                <path
                  d="M 52,73 Q 60,82 68,73"
                  stroke="#361a0d"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 55,75 Q 60,79 65,75"
                  stroke="#e57373"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Reassuring Hand raised gently when warning */}
                {mimmiState === 'gentle-warn' && (
                  <motion.g
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <ellipse cx="94" cy="94" rx="7.5" ry="9.5" fill="#fcd7be" />
                    <circle cx="94" cy="86" r="3.2" fill="#fcd7be" />
                  </motion.g>
                )}
              </svg>
            )}
          </motion.div>
            <span className="text-[10px] font-black tracking-wider text-stone-950 uppercase calm-white-card px-2.5 py-0.5 rounded-full border-2 border-stone-300 shadow-xs -mt-1">
              Mimmi
            </span>
          </div>

          {/* MIMMI'S SPEECH BALLOON */}
          <div className="flex-1 calm-white-card border-2 border-stone-400 rounded-2xl p-2.5 sm:p-3 shadow-md relative min-h-[56px] max-h-[72px] flex items-center overflow-hidden">
            <div className="absolute top-4 -left-2 w-3 h-3 bg-white border-l-2 border-b-2 border-stone-400 transform rotate-45" />
            <p className="text-xs sm:text-[13px] font-black text-stone-950 leading-snug line-clamp-3">
              {mimmiSpeech}
            </p>
          </div>
        </section>

        {/* ================================================== */}
        {/* 4. CENTRAL INTERACTIVE POT & PLANT SCENE           */}
        {/* ================================================== */}
        <div className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center my-auto overflow-hidden">
          {/* Plant Growth Display */}
          <div className="relative flex flex-col items-center">
            {/* Upper Plant Stem / Leaves / Bloom Area */}
            <div
              className={`h-34 sm:h-42 max-h-[30vh] w-48 flex items-end justify-center relative select-none ${
                phase === 2 || phase === 3 ? 'cursor-pointer active:scale-95 transition-transform' : ''
              }`}
              onPointerDown={(e) => {
                if (phase === 2) {
                  e.stopPropagation();
                  handleStartWatering();
                } else if (phase === 3) {
                  e.stopPropagation();
                  handleStartSun();
                }
              }}
              onPointerUp={(e) => {
                if (phase === 2) {
                  e.stopPropagation();
                  handleStopWatering();
                } else if (phase === 3) {
                  e.stopPropagation();
                  handleStopSun();
                }
              }}
              onPointerLeave={() => {
                if (phase === 2) handleStopWatering();
                if (phase === 3) handleStopSun();
              }}
              onPointerCancel={() => {
                if (phase === 2) handleStopWatering();
                if (phase === 3) handleStopSun();
              }}
            >
              {/* Floating Helper Tip to touch the pot in phase 2 and 3 */}
              {(phase === 2 || phase === 3) && (
                <div className="absolute -top-3 z-30 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border-2 border-amber-400 text-[11px] font-black text-amber-950 dark:text-amber-200 shadow-md pointer-events-none animate-pulse">
                  {phase === 2 ? '💧 Tocca o tieni premuto il vaso per bagnare' : '☀️ Tocca o tieni premuto il vaso per scaldare'}
                </div>
              )}
              {/* PHASE 1: THE SEED - USER MUST DRAG DIRECTLY ON IT OR TAP */}
              {phase === 1 && (
                <div
                  className="mb-1 flex flex-col items-center z-30 cursor-grab active:cursor-grabbing touch-none select-none transition-transform"
                  style={{
                    transform: `translateY(${(soilProgress / 100) * 85}px)`,
                    opacity: Math.max(0, 1 - (soilProgress / 100) * 0.85)
                  }}
                  onPointerDown={handlePointerDownSeed}
                  onPointerMove={handlePointerMoveSeed}
                  onPointerUp={handlePointerUpSeed}
                  onPointerCancel={handlePointerUpSeed}
                  onClick={handlePlantDirectly}
                >
                  <div className="relative p-3 -m-2 flex flex-col items-center cursor-pointer">
                    <motion.div
                      animate={isDraggingSeed.current ? { scale: 1.15 } : { scale: [1, 1.12, 1], y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2.4 }}
                      className="w-7 h-9 bg-gradient-to-b from-[#795548] to-[#4e342e] rounded-full border-2 border-[#3e2723] shadow-lg flex items-center justify-center relative ring-2 ring-amber-400/60"
                    >
                      <div className="w-2 h-2.5 bg-[#a5d6a7] rounded-full" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping opacity-75 pointer-events-none" />
                    </motion.div>
                    <span className="text-[10px] font-black text-amber-950 bg-amber-100/95 border border-amber-300 px-2.5 py-0.5 rounded-full mt-1.5 shadow-xs whitespace-nowrap">
                      🌱 Tocca o trascina giù
                    </span>
                  </div>
                </div>
              )}

              {/* PHASE 2, 3 & 4: Sprout Growing Upwards */}
              {(phase === 2 || phase === 3 || phase === 4) && (
                <div className="relative flex flex-col items-center z-10">
                  {/* Growing Green Stem */}
                  <motion.div
                    className="w-2.5 bg-gradient-to-t from-[#2d6a4f] via-[#40916c] to-[#74c69d] rounded-full shadow-2xs"
                    style={{
                      height:
                        phase === 2
                          ? 22 + waterProgress * 0.22
                          : phase === 3
                          ? 44 + sunProgress * 0.52
                          : 96
                    }}
                    transition={{ type: 'spring', damping: 20 }}
                  />

                  {/* Unfurling Leaves (Left & Right) */}
                  {(phase >= 2 && waterProgress > 35) || phase >= 3 ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-5 -left-7 w-7 h-4 bg-[#52b788] rounded-tl-full rounded-br-full origin-right shadow-2xs -rotate-25 border border-[#40916c]/40"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-11 -right-7 w-7 h-4 bg-[#52b788] rounded-tr-full rounded-bl-full origin-left shadow-2xs rotate-25 border border-[#40916c]/40"
                      />
                    </>
                  ) : null}

                  {/* Top extra leaves in Phase 3 & 4 */}
                  {phase >= 3 && sunProgress > 40 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-18 -left-5 w-5 h-3 bg-[#74c69d] rounded-tl-full rounded-br-full origin-right -rotate-15 shadow-2xs"
                    />
                  )}

                  {/* PHASE 4: THE BIG COLORFUL BLOOMED FLOWER (PROMINENT & CLEARLY VISIBLE) */}
                  {phase === 4 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 80 }}
                      className="absolute -top-14 sm:-top-16 w-32 h-32 sm:w-38 sm:h-38 flex items-center justify-center pointer-events-none z-20"
                    >
                      {renderFlowerBloom(flower)}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* TERRACOTTA POT (BALANCED & COZY SOIL BED - TOUCH/HOLD INTERACTIVE) */}
            <div
              className={`relative w-34 sm:w-38 flex flex-col items-center select-none touch-none transition-transform cursor-pointer active:scale-95 group`}
              onPointerDown={(e) => {
                if (phase === 1) {
                  e.stopPropagation();
                  handlePlantDirectly();
                } else if (phase === 2) {
                  e.stopPropagation();
                  handleStartWatering();
                } else if (phase === 3) {
                  e.stopPropagation();
                  handleStartSun();
                }
              }}
              onPointerUp={(e) => {
                if (phase === 2) {
                  e.stopPropagation();
                  handleStopWatering();
                } else if (phase === 3) {
                  e.stopPropagation();
                  handleStopSun();
                }
              }}
              onPointerLeave={() => {
                if (phase === 2) handleStopWatering();
                if (phase === 3) handleStopSun();
              }}
              onPointerCancel={() => {
                if (phase === 2) handleStopWatering();
                if (phase === 3) handleStopSun();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTapPot();
              }}
            >
              {/* Soil Dust Puff Animation (when swiping too fast) */}
              <AnimatePresence>
                {dustPuff && (
                  <motion.div
                    key="mimmi-dust-puff"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 0.9, scale: 1.2, y: -16 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    className="absolute -top-6 z-30 pointer-events-none flex gap-1.5 items-center"
                  >
                    <span className="text-lg">💨</span>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full shadow-2xs">
                      Troppo veloce!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Water Cascading Stream in Phase 2 */}
              <AnimatePresence>
                {isWatering && (
                  <motion.div
                    key="mimmi-watering-stream"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-9 z-20 pointer-events-none flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ y: [0, 26] }}
                      transition={{ repeat: Infinity, duration: 0.32, ease: 'linear' }}
                      className="flex gap-1.5"
                    >
                      <span className="text-blue-400 text-xs">💧</span>
                      <span className="text-blue-500 text-sm">💧</span>
                      <span className="text-blue-400 text-xs">💧</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terracotta Pot Rim Collar (No dark brown soil ellipse) */}
              <div
                className={`w-32 sm:w-36 h-5 sm:h-5.5 rounded-t-xl rounded-b-xs bg-gradient-to-b from-[#e58a6c] via-[#d97757] to-[#c46345] border-2 border-[#a54930] shadow-sm relative overflow-hidden transition-all duration-300 ${
                  soilGlow ? 'ring-3 ring-amber-300 shadow-amber-300/60' : ''
                }`}
              >
                {/* Ceramic highlight & rim bevel */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
                <div className="absolute bottom-0 inset-x-0 h-1 bg-[#8c361e]/25" />
              </div>

              {/* Pot Main Body (Warm Terracotta Pot) */}
              <div
                className={`w-28 sm:w-32 h-17 sm:h-19 bg-gradient-to-b from-[#d97757] via-[#c46345] to-[#9c452b] rounded-b-[2rem] border-2 border-t-0 shadow-md relative flex flex-col items-center justify-center overflow-hidden transition-all ${
                  phase === 2
                    ? 'border-blue-400 ring-4 ring-blue-300/40 shadow-blue-400/30'
                    : phase === 3
                    ? 'border-amber-400 ring-4 ring-amber-300/40 shadow-amber-400/30'
                    : 'border-[#a54930]'
                }`}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-white/20" />
                <div className="w-full h-0.5 bg-[#80311a]/40 my-0.5" />

                {/* Pot Badge */}
                <div className="w-6.5 h-6.5 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-[11px] shadow-inner">
                  {phase === 1 ? '🌾' : phase === 2 ? '💧' : phase === 3 ? '☀️' : flower.icon}
                </div>
              </div>

              {/* Bench Shadow */}
              <div className="w-28 sm:w-32 h-3.5 bg-[#6b4823]/25 rounded-[50%] blur-xs mt-0.5" />
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* 5. INTERACTIVE CONTROLS (ALWAYS WITHIN VIEWPORT)   */}
        {/* ================================================== */}
        <section aria-label="Controlli di gioco" className="w-full shrink-0 flex flex-col items-center gap-2 pt-1 pb-1">
          {/* FASE 1: Direct Soil Drag Guidance */}
          {phase === 1 && (
            <div
              onClick={handlePlantDirectly}
              className="w-full calm-white-card border-2 border-stone-400 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center gap-1.5 shadow-md cursor-pointer active:scale-98 transition-transform"
            >
              <div className="flex items-center justify-between w-full text-xs sm:text-sm font-black text-stone-950">
                <span className="flex items-center gap-1">
                  🌾 Tocca il semino o fallo scivolare giù nel vaso
                </span>
                <ChevronDown className="w-4 h-4 text-stone-900 animate-bounce" />
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden border border-stone-400">
                <div
                  className="bg-amber-700 h-full rounded-full transition-all duration-200"
                  style={{ width: `${soilProgress}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[10px] font-black text-stone-900">
                <span>Terriccio: {Math.round(soilProgress)}%</span>
                <span>Tocca o trascina verso il basso</span>
              </div>
            </div>
          )}

          {/* FASE 2: Press & Hold or Tap Pot to Water */}
          {phase === 2 && (
            <div className="w-full flex flex-col items-center gap-1.5">
              <button
                onPointerDown={handleStartWatering}
                onPointerUp={handleStopWatering}
                onPointerCancel={handleStopWatering}
                onClick={handleTapPot}
                className="w-full py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 select-none bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 cursor-pointer"
              >
                <Droplets className={`w-4 h-4 sm:w-5 sm:h-5 ${isWatering ? 'animate-bounce' : ''}`} />
                <span>
                  {isWatering
                    ? "L'acqua scorre con dolcezza... respira con calma 💧"
                    : "Tocca o tieni premuto il vaso per annaffiare 💧"}
                </span>
              </button>

              <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden border border-blue-300">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-100"
                  style={{ width: `${waterProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* FASE 3: Press & Hold or Tap Pot for Warm Sunshine */}
          {phase === 3 && (
            <div className="w-full flex flex-col items-center gap-1.5">
              <button
                onPointerDown={handleStartSun}
                onPointerUp={handleStopSun}
                onPointerCancel={handleStopSun}
                onClick={handleTapPot}
                className="w-full py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 select-none bg-amber-500 hover:bg-amber-400 text-stone-950 border-2 border-amber-600 cursor-pointer"
              >
                <Sun className={`w-4 h-4 sm:w-5 sm:h-5 ${isSunActive ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                <span>
                  {isSunActive
                    ? "Il sole riscalda la piantina... la vita fiorisce ☀️"
                    : "Tocca o tieni premuto il vaso per far splendere il sole ☀️"}
                </span>
              </button>

              <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden border border-amber-300">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-100"
                  style={{ width: `${sunProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* FASE 4: Celebration, Flower Info & Replant ONLY */}
          {phase === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full calm-white-card border-2 border-stone-400 p-2.5 sm:p-3 rounded-2xl shadow-md flex flex-col items-center gap-1.5 text-center"
            >
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-xs sm:text-sm font-black text-stone-950 flex items-center gap-1.5">
                  <span className="text-base sm:text-lg">{flower.icon}</span>
                  <span>{flower.name}</span>
                </span>
                <span className="text-[10px] font-black text-stone-950 bg-amber-200 px-2.5 py-0.5 rounded-full border border-stone-400">
                  {flower.meaning}
                </span>
              </div>

              <p className="text-[11px] font-bold text-stone-800 italic line-clamp-1">
                "{flower.poetry}"
              </p>

              <div className="w-full pt-1">
                <button
                  onClick={handleReplant}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all text-xs sm:text-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> <span className="text-white">Pianta un nuovo fiore 🌸</span>
                </button>
              </div>
            </motion.div>
          )}
        </section>
      </div>

      {/* ---------------------------------------------------- */}
      {/* RULES / EXPLANATION MODAL (MATCHING CALMWORLD STYLE) */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-stone-200 dark:border-stone-700 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-stone-950 dark:text-stone-100 font-black text-lg font-['Quicksand']">
                Il Giardino di Mimmi
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed font-medium">
              <p>
                Prenditi cura di una piantina insieme a Mimmi e riscopri la bellezza e la distensione della natura che cresce.
              </p>

              <div>
                <p className="font-bold text-stone-900 dark:text-stone-200 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                  <li>
                    <strong>1. Il Semino:</strong> tocca il semino e accompagnalo verso il basso nel vaso.
                  </li>
                  <li>
                    <strong>2. L'Acqua:</strong> tocca sopra la piantina o l'annaffiatoio per dissetare la terra finché non brilla.
                  </li>
                  <li>
                    <strong>3. Il Sole:</strong> tocca sopra la piantina o il sole per donarle calore e farla sbocciare.
                  </li>
                  <li>
                    <strong>Fiori a sorpresa:</strong> a ogni partita sboccerà un fiore casuale diverso (margherite, tulipani, rose, girasoli, peonie).
                  </li>
                  <li>
                    Nessun timer, nessun punteggio e nessuna fretta: rilassati e goditi ogni momento.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
