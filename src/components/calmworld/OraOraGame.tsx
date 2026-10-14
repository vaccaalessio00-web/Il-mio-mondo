import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Lightbulb, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';
import {
  ORA_ORA_CUSTOM_ASSETS,
  ORA_ORA_BACKGROUND_IMAGES,
  ORA_ORA_FINALE_IMAGES,
  ORA_ORA_BACKGROUND_IMAGE,
  ORA_ORA_FINALE_IMAGE,
  ORA_ORA_SPECIAL_BG_1
} from '../../assets/minigames';
import { removeBackground } from '../../utils/imageCutout';

// Risoluzione logica interna fissa in formato 9:16
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export type BossState = 'hidden' | 'warning' | 'watching' | 'caught';
export type WatcherType = 'boss' | 'petegola1' | 'petegola2';

export interface AssetSlot {
  key: string;
  filename: string;
  label: string;
  category: 'background' | 'models' | 'friends' | 'boss';
  fallbackColor: string;
  fallbackBorder: string;
  customDataUrl?: string;
}

export const ORA_ORA_ASSET_SLOTS: AssetSlot[] = [
  { key: 'background', filename: 'background.png', label: 'Sfondo camerino 9:16', category: 'background', fallbackColor: '#2a1e35', fallbackBorder: '#78350f' },
  { key: 'finale', filename: 'finale.png', label: 'Immagine finale resoconto', category: 'background', fallbackColor: '#2a1e35', fallbackBorder: '#ec4899' },
  { key: 'models_idle', filename: 'models_idle.png', label: 'Modelle separate a riposo', category: 'models', fallbackColor: '#f43f5e22', fallbackBorder: '#ec4899' },
  { key: 'models_kissing', filename: 'models_kissing.png', label: 'Modelle che si baciano', category: 'models', fallbackColor: '#f43f5e44', fallbackBorder: '#f43f5e' },
  { key: 'friends_idle', filename: 'amiche_idle.png', label: 'Amiche a riposo alla scrivania', category: 'friends', fallbackColor: '#05966922', fallbackBorder: '#059669' },
  { key: 'friends_signal', filename: 'amiche_segnale.png', label: 'Amiche segnale "OK" via libera', category: 'friends', fallbackColor: '#22c55e33', fallbackBorder: '#22c55e' },
  { key: 'boss_hidden', filename: 'boss_hidden.png', label: 'Capo nascosto (trasparente)', category: 'boss', fallbackColor: 'transparent', fallbackBorder: 'transparent' },
  { key: 'boss_warning', filename: 'boss_warning.png', label: 'Capo in arrivo / allerta (!)', category: 'boss', fallbackColor: '#eab30833', fallbackBorder: '#eab308' },
  { key: 'boss_watching', filename: 'boss_watching.png', label: 'Capo che controlla la stanza', category: 'boss', fallbackColor: '#dc262633', fallbackBorder: '#dc2626' },
  { key: 'boss_caught', filename: 'boss_caught.png', label: 'Capo arrabbiato (sgamati!)', category: 'boss', fallbackColor: '#ef444444', fallbackBorder: '#b91c1c' },
  { key: 'petegola1_watching', filename: 'petegola1_watching.png', label: 'Pettegola 1 che sbircia', category: 'boss', fallbackColor: '#dc262633', fallbackBorder: '#dc2626' },
  { key: 'petegola1_caught', filename: 'petegola1_caught.png', label: 'Pettegola 1 (sgamate!)', category: 'boss', fallbackColor: '#ef444444', fallbackBorder: '#b91c1c' },
  { key: 'petegola2_watching', filename: 'petegola2_watching.png', label: 'Pettegola 2 in agguato', category: 'boss', fallbackColor: '#dc262633', fallbackBorder: '#dc2626' },
  { key: 'petegola2_caught', filename: 'petegola2_caught.png', label: 'Pettegola 2 (sgamate!)', category: 'boss', fallbackColor: '#ef444444', fallbackBorder: '#b91c1c' },
];

/**
 * Disegna un'immagine in modalità 'cover' (copre tutto lo spazio senza deformare o allungare)
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  alignX = 0.5,
  alignY = 0.25 // Inquadra maggiormente l'alto dell'immagine, posizionando lo sfondo più in basso
) {
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  if (!nw || !nh) {
    ctx.drawImage(img, x, y, w, h);
    return;
  }
  const imgRatio = nw / nh;
  const targetRatio = w / h;
  let sWidth = nw;
  let sHeight = nh;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sWidth = nh * targetRatio;
    sx = (nw - sWidth) * alignX;
    sy = 0;
  } else {
    sHeight = nw / targetRatio;
    sy = (nh - sHeight) * alignY;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

/**
 * Disegna un'immagine in modalità 'fit' (mantiene al 100% l'aspect ratio originale senza mai stretchare)
 * Applica un contorno di 0.1 pixel ad ogni immagine del gioco per isolare le figure e non far vedere lo sfondo dietro
 */
function drawFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  maxW: number,
  maxH: number,
  alignX = 0.5,
  alignY = 0.5,
  withContour = true
) {
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  if (!nw || !nh) {
    ctx.drawImage(img, x, y, maxW, maxH);
    return;
  }
  const scale = Math.min(maxW / nw, maxH / nh);
  const dw = nw * scale;
  const dh = nh * scale;
  const dx = x + (maxW - dw) * alignX;
  const dy = y + (maxH - dh) * alignY;

  if (withContour) {
    // Contorno perimetrale di 0.1 pixel ad ogni immagine del gioco per non far trasparire il dietro
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const cOffset = 0.1;
    ctx.drawImage(img, 0, 0, nw, nh, dx - cOffset, dy, dw, dh);
    ctx.drawImage(img, 0, 0, nw, nh, dx + cOffset, dy, dw, dh);
    ctx.drawImage(img, 0, 0, nw, nh, dx, dy - cOffset, dw, dh);
    ctx.drawImage(img, 0, 0, nw, nh, dx, dy + cOffset, dw, dh);
    ctx.restore();
  }

  // Disegno principale solido e nitido in primo piano
  ctx.drawImage(img, 0, 0, nw, nh, dx, dy, dw, dh);
}

export interface ComplicityStage {
  level: number;
  label: string;
  color: string;
}

export const COMPLICITY_STAGES: ComplicityStage[] = [
  { level: 0, label: 'Azzerata', color: '#ef4444' },
  { level: 1, label: 'Al limite', color: '#ef4444' },
  { level: 2, label: 'Tesa', color: '#f97316' },
  { level: 3, label: 'In allerta', color: '#eab308' },
  { level: 4, label: 'Forte', color: '#10b981' },
  { level: 5, label: 'Impeccabile', color: '#06b6d4' },
];

export const getComplicityStage = (lvl: number): ComplicityStage => {
  return COMPLICITY_STAGES.find(s => s.level === lvl) || COMPLICITY_STAGES[0];
};

const LAST_BG_STORAGE_KEY = 'ora_ora_last_background_url';

export const getRandomBg = (excludeUrl?: string): string => {
  const pool = ORA_ORA_BACKGROUND_IMAGES && ORA_ORA_BACKGROUND_IMAGES.length > 0
    ? ORA_ORA_BACKGROUND_IMAGES
    : [ORA_ORA_BACKGROUND_IMAGE || '/assets/background.png'];
  if (pool.length <= 1) return pool[0];

  // Se non viene specificato excludeUrl, escludi l'ultimo sfondo utilizzato per non partire mai dallo stesso
  let toExclude = excludeUrl;
  if (!toExclude && typeof window !== 'undefined') {
    try {
      toExclude = localStorage.getItem(LAST_BG_STORAGE_KEY) || undefined;
    } catch {
      // ignore
    }
  }

  const filtered = toExclude ? pool.filter(b => b !== toExclude) : pool;
  const candidates = filtered.length > 0 ? filtered : pool;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LAST_BG_STORAGE_KEY, chosen);
    } catch {
      // ignore
    }
  }

  return chosen;
};

export const checkIsSpecialRightBg = (bgUrl?: string | null): boolean => {
  if (!bgUrl) return false;
  if (bgUrl === ORA_ORA_SPECIAL_BG_1) return true;
  const decoded = decodeURIComponent(bgUrl);
  return (
    decoded.includes('sfondo.png.jpg (1)') ||
    decoded.includes('sfondo.png.jpg%20(1)') ||
    (decoded.includes('sfondo.png.jpg') && decoded.includes('(1)'))
  );
};

const LAST_FINALE_STORAGE_KEY = 'ora_ora_last_finale_url';

export const getRandomFinale = (excludeUrl?: string): string => {
  const pool = ORA_ORA_FINALE_IMAGES && ORA_ORA_FINALE_IMAGES.length > 0
    ? ORA_ORA_FINALE_IMAGES
    : [ORA_ORA_FINALE_IMAGE];
  if (pool.length <= 1) return pool[0];

  let toExclude = excludeUrl;
  if (!toExclude && typeof window !== 'undefined') {
    try {
      toExclude = localStorage.getItem(LAST_FINALE_STORAGE_KEY) || undefined;
    } catch {
      // ignore
    }
  }

  // Non mettere mai di fila la stessa immagine finale
  const filtered = toExclude ? pool.filter(f => f !== toExclude) : pool;
  const candidates = filtered.length > 0 ? filtered : pool;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LAST_FINALE_STORAGE_KEY, chosen);
    } catch {
      // ignore
    }
  }

  return chosen;
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  char: string;
  opacity: number;
  rotation: number;
  vr: number;
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  vr: number;
}

interface OraOraGameProps {
  onClose: () => void;
}

export const OraOraGame: React.FC<OraOraGameProps> = ({ onClose }) => {
  // --- STATO DEL GIOCO ---
  const [currentBgUrl, setCurrentBgUrl] = useState<string>(() => getRandomBg());
  const currentBgUrlRef = useRef<string>(currentBgUrl);
  useEffect(() => {
    currentBgUrlRef.current = currentBgUrl;
  }, [currentBgUrl]);

  const [currentFinaleUrl, setCurrentFinaleUrl] = useState<string>(() => getRandomFinale());
  const currentFinaleUrlRef = useRef<string>(currentFinaleUrl);
  useEffect(() => {
    currentFinaleUrlRef.current = currentFinaleUrl;
  }, [currentFinaleUrl]);

  // Record del round massimo raggiunto
  const [maxRoundRecord, setMaxRoundRecord] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ora_ora_max_round_record');
      const parsed = saved ? parseInt(saved, 10) : 1;
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    } catch {
      return 1;
    }
  });

  const [caughtCountInRound, setCaughtCountInRound] = useState<number>(0);
  const caughtCountInRoundRef = useRef<number>(0);
  const [isFiveTimesResetting, setIsFiveTimesResetting] = useState<boolean>(false);

  const [loveMeter, setLoveMeter] = useState<number>(0); // 0 - 100%
  const [round, setRound] = useState<number>(1);
  const [complicityLevel, setComplicityLevel] = useState<number>(5); // 5 stadi di complicità
  const [bossState, setBossState] = useState<BossState>('hidden');
  const [watcherType, setWatcherType] = useState<WatcherType>('boss');
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isPausedCaught, setIsPausedCaught] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [blackoutSecondsLeft, setBlackoutSecondsLeft] = useState<number>(0);

  // Aggiorna il record quando il round sale
  useEffect(() => {
    if (round > maxRoundRecord) {
      setMaxRoundRecord(round);
      try {
        localStorage.setItem('ora_ora_max_round_record', round.toString());
      } catch {}
    }
  }, [round, maxRoundRecord]);

  // Rileva se lo sfondo corrente è quello denominato "sfondo.png.jpg (1)"
  const isSpecialRightBg = checkIsSpecialRightBg(currentBgUrl);
  const soundEnabled = true; // Audio sempre attivo senza pulsante di disattivazione
  const [showRules, setShowRules] = useState<boolean>(false);
  const [, setAssetStatuses] = useState<Record<string, boolean>>({});

  // Refs per animazione e loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPressingRef = useRef<boolean>(false);
  const loveMeterRef = useRef<number>(0);
  const bossStateRef = useRef<BossState>('hidden');
  const watcherTypeRef = useRef<WatcherType>('boss');
  const isPausedCaughtRef = useRef<boolean>(false);
  const isVictoryRef = useRef<boolean>(false);
  const isBlackoutRef = useRef<boolean>(false);
  const roundRef = useRef<number>(1);
  const bossTimerRef = useRef<number>(0);
  const kissSoundCooldownRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const confettiRef = useRef<Confetti[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Mappa di immagini HTML caricate
  const imagesMapRef = useRef<Record<string, HTMLImageElement | null>>({});

  // Pre-carica tutti gli sfondi disponibili per renderli immediatamente disponibili
  useEffect(() => {
    ORA_ORA_BACKGROUND_IMAGES.forEach(url => {
      if (url) {
        const pre = new Image();
        pre.src = url;
      }
    });
  }, []);

  // Carica immediatamente il background corrente ogni volta che cambia
  useEffect(() => {
    if (!currentBgUrl) return;
    const bgImg = new Image();
    bgImg.onload = () => {
      imagesMapRef.current['background'] = bgImg;
    };
    bgImg.src = currentBgUrl;
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      imagesMapRef.current['background'] = bgImg;
    }
  }, [currentBgUrl]);

  // Sincronizzazione Refs
  useEffect(() => {
    isPressingRef.current = isPressing;
  }, [isPressing]);

  useEffect(() => {
    loveMeterRef.current = loveMeter;
  }, [loveMeter]);

  useEffect(() => {
    bossStateRef.current = bossState;
  }, [bossState]);

  useEffect(() => {
    watcherTypeRef.current = watcherType;
  }, [watcherType]);

  useEffect(() => {
    isPausedCaughtRef.current = isPausedCaught;
  }, [isPausedCaught]);

  useEffect(() => {
    isVictoryRef.current = isVictory;
  }, [isVictory]);

  useEffect(() => {
    isBlackoutRef.current = isBlackout;
  }, [isBlackout]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  // Caricamento e monitoraggio immagini
  const loadGameAssets = useCallback(() => {
    const statuses: Record<string, boolean> = {};

    ORA_ORA_ASSET_SLOTS.forEach(slot => {
      // Carica l'immagine dalla cartella minigiochi (src/assets/minigames/oraora/)
      const minigameFolderUrl = slot.key === 'background'
        ? currentBgUrlRef.current
        : ORA_ORA_CUSTOM_ASSETS[slot.key];
      const primaryUrl = minigameFolderUrl || `/assets/${slot.filename}`;
      const fallbackUrl = `/assets/${slot.filename}`;

      const img = new Image();
      let hasTriedFallback = false;

      img.onload = () => {
        imagesMapRef.current[slot.key] = img;
        statuses[slot.key] = true;
        setAssetStatuses(prev => ({ ...prev, [slot.key]: true }));

        // Scontorna automaticamente eventuali immagini caricate esterne con sfondo solido
        // (le modelle e il capo sono già trasparenti con occhi, maglietta e dettagli intatti)
        if (slot.category !== 'background' && !slot.key.startsWith('models') && !slot.key.startsWith('boss')) {
          const cutoutOptions = slot.key === 'boss_warning'
            ? { threshold: 175, colorTolerance: 75 }
            : { threshold: 185, colorTolerance: 68 };

          removeBackground(primaryUrl, cutoutOptions)
            .then(transparentUrl => {
              if (transparentUrl && transparentUrl !== primaryUrl) {
                const cutoutImg = new Image();
                cutoutImg.onload = () => {
                  imagesMapRef.current[slot.key] = cutoutImg;
                };
                cutoutImg.src = transparentUrl;
              }
            })
            .catch(err => {
              console.warn('Errore scontorno asset:', slot.key, err);
            });
        }
      };

      img.onerror = () => {
        if (!hasTriedFallback && primaryUrl !== fallbackUrl) {
          hasTriedFallback = true;
          img.src = fallbackUrl;
        } else {
          imagesMapRef.current[slot.key] = null;
          statuses[slot.key] = false;
          setAssetStatuses(prev => ({ ...prev, [slot.key]: false }));
        }
      };

      img.src = primaryUrl;
    });

    setAssetStatuses(statuses);
  }, []);

  useEffect(() => {
    loadGameAssets();
  }, [loadGameAssets]);

  // Suoni di gioco dedicati (morbidi, caldi e anti-stress: zero onde stridule, zero sawtooth)
  const playSgamatiSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Morbido "oops" tipo marimba ovattata (onde sinusoidali pure, calde e basse)
      [240, 180, 140].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.11;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.1);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.055, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.23);
      });
    } catch {}
  }, [soundEnabled]);

  const playWarningChime = useCallback((isGentleDistant = false) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note pastello armoniche e dolci (Sol4 392Hz e Do5 523.25Hz): calma, rilassante
      const notes = isGentleDistant ? [392.00] : [392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.16;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.038, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.46);
      });
    } catch {}
  }, [soundEnabled]);

  const playLightSwitchSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // Morbido click interruttore a cupola (morbido e rilassante)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(230, now + 0.04);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }, [soundEnabled]);

  // Se il giocatore preme mentre il Capo o le Pettegole stanno guardando -> SGAMATO!
  // NOTA: Durante "Luci Spente" (isBlackout), c'è immunità totale al buio e non si viene scoperte!
  const triggerCaught = useCallback(() => {
    if (isPausedCaughtRef.current || isVictoryRef.current || isBlackoutRef.current) return;

    setIsPausedCaught(true);
    setBossState('caught');
    setIsPressing(false);
    playSgamatiSound();

    // Reset completo della barra a 0
    setLoveMeter(0);
    loveMeterRef.current = 0;

    const newCaught = caughtCountInRoundRef.current + 1;
    caughtCountInRoundRef.current = newCaught;
    setCaughtCountInRound(newCaught);

    // Fa scendere la complicità amiche ogni volta che si viene beccate (da 5 a 0)
    const newLevel = Math.max(0, 5 - newCaught);
    setComplicityLevel(newLevel);

    if (newCaught >= 5) {
      // REGOLA: Se si viene scoperta 5 volte, porta il livello amicizia a zero e rinizia il round con un nuovo sfondo
      setComplicityLevel(0);
      setIsFiveTimesResetting(true);

      window.setTimeout(() => {
        const nextBg = getRandomBg(currentBgUrlRef.current);
        setCurrentBgUrl(nextBg);
        currentBgUrlRef.current = nextBg;
        setLoveMeter(0);
        loveMeterRef.current = 0;
        setComplicityLevel(5);
        setCaughtCountInRound(0);
        caughtCountInRoundRef.current = 0;
        setBossState('hidden');
        setIsPausedCaught(false);
        setIsFiveTimesResetting(false);
      }, 2500);
    } else {
      // Pausa simpatica di 2 secondi con fumetto buffo, poi riprende subito
      window.setTimeout(() => {
        setBossState('hidden');
        setIsPausedCaught(false);
      }, 2000);
    }
  }, [playSgamatiSound]);

  // Gestione evento Luci Spente (intervallo 15 - 30 secondi, durata aumentata a 3 - 6 secondi)
  useEffect(() => {
    if (isVictory) return;

    let timeoutId: number;
    let countdownIntervalId: number;

    const scheduleBlackout = () => {
      // Intervallo casuale tra 15 e 30 secondi
      const interval = 15000 + Math.random() * 15000;
      timeoutId = window.setTimeout(() => {
        if (isVictoryRef.current) return;

        // Inizia blackout: durata casuale (3 - 6 secondi)
        const duration = 3000 + Math.random() * 3000;
        const endTime = Date.now() + duration;
        setIsBlackout(true);
        isBlackoutRef.current = true;
        setBlackoutSecondsLeft(duration / 1000);
        playLightSwitchSound();

        countdownIntervalId = window.setInterval(() => {
          const rem = Math.max(0, (endTime - Date.now()) / 1000);
          setBlackoutSecondsLeft(rem);
          if (rem <= 0) {
            window.clearInterval(countdownIntervalId);
          }
        }, 100);

        timeoutId = window.setTimeout(() => {
          window.clearInterval(countdownIntervalId);
          setIsBlackout(false);
          isBlackoutRef.current = false;
          setBlackoutSecondsLeft(0);
          playLightSwitchSound();
          if (!isVictoryRef.current) {
            scheduleBlackout();
          }
        }, duration);
      }, interval);
    };

    scheduleBlackout();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownIntervalId);
    };
  }, [isVictory, playLightSwitchSound]);

  // Gestione comparsa del capo e delle pettegole (Timer ciclico scalato con la difficoltà)
  useEffect(() => {
    if (isVictory || isPausedCaught) return;

    const activeTimeouts: number[] = [];
    const setSafeTimeout = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        const idx = activeTimeouts.indexOf(id);
        if (idx !== -1) activeTimeouts.splice(idx, 1);
        fn();
      }, ms);
      activeTimeouts.push(id);
      return id;
    };

    const scheduleNextBossCycle = () => {
      // A OGNI ROUND AUMENTA LA DIFFICOLTÀ: le persone appaiono sempre più frequentemente per catturarti!
      const currentRnd = roundRef.current || 1;
      const roundReduction = Math.min(3200, (currentRnd - 1) * 750);
      const r = (Math.random() + Math.random()) / 2;
      const baseDuration = Math.max(1800, 4500 - roundReduction);
      const randomSpread = Math.max(1500, 4500 - roundReduction);
      const hiddenDuration = baseDuration + r * randomSpread;

      bossTimerRef.current = setSafeTimeout(() => {
        if (isVictoryRef.current || isPausedCaughtRef.current) return;

        // Scegli casualmente chi si avvicina: Capo, Pettegola 1 o Pettegola 2
        const availableWatchers: WatcherType[] = ['boss', 'petegola1', 'petegola2'];
        const chosen = availableWatchers[Math.floor(Math.random() * availableWatchers.length)];
        setWatcherType(chosen);
        watcherTypeRef.current = chosen;

        if (chosen === 'petegola1') {
          // PATTERN SPECIALE PETTEGOLA 1:
          // Avviso sonoro dolce e discreto.
          // Rimane in allerta/ombra per molto tempo (2.4s - 3.0s),
          // comparendo a guardare sullo schermo solo dopo il segnale!
          playWarningChime(true);
          setBossState('warning');
          const warningDuration = 2400 + Math.random() * 600;

          setSafeTimeout(() => {
            if (isVictoryRef.current || isPausedCaughtRef.current) return;

            setBossState('watching');

            if (isPressingRef.current && !isBlackoutRef.current) {
              triggerCaught();
              return;
            }

            // PETTEGOLA 1: Dura sullo schermo più degli altri, almeno 1 secondo in più!
            // Boss dura 1.6s - 2.4s, Petegola 2 dura 0.9s - 1.7s.
            // Pettegola 1 dura 3.6s - 4.4s (ben oltre 1 secondo in più rispetto a chiunque altro)
            const watchingDuration = 3600 + Math.random() * 800;
            setSafeTimeout(() => {
              if (isVictoryRef.current || isPausedCaughtRef.current) return;
              setBossState('hidden');
              scheduleNextBossCycle();
            }, watchingDuration);
          }, warningDuration);

        } else if (chosen === 'petegola2') {
          // 1. Fase Avviso iniziale: (700ms - 1000ms)
          setBossState('warning');
          playWarningChime(false);

          const warningDuration = 700 + Math.random() * 300;

          setSafeTimeout(() => {
            if (isVictoryRef.current || isPausedCaughtRef.current) return;

            setBossState('watching');

            if (isPressingRef.current && !isBlackoutRef.current) {
              triggerCaught();
              return;
            }

            // SCHEMA SPECIALE PETTEGOLA 2:
            // Appare molto più spesso 2 volte di fila o 3 volte (richiesta utente)
            // 20% solo 1 volta, 50% 2 volte di fila, 30% 3 volte di fila (80% comparsa ripetuta)
            const randP2 = Math.random();
            const totalAppearances = randP2 < 0.20 ? 1 : randP2 < 0.70 ? 2 : 3;
            let appearancesCount = 1;

            const handlePetegola2WatchAndRetreat = (watchDuration: number) => {
              setSafeTimeout(() => {
                if (isVictoryRef.current || isPausedCaughtRef.current) return;

                setBossState('hidden');

                if (appearancesCount < totalAppearances) {
                  appearancesCount += 1;
                  const gapDuration = 250 + Math.random() * 300;

                  setSafeTimeout(() => {
                    if (isVictoryRef.current || isPausedCaughtRef.current) return;

                    setBossState('watching');

                    if (isPressingRef.current && !isBlackoutRef.current) {
                      triggerCaught();
                      return;
                    }

                    const nextWatchDuration = 900 + Math.random() * 500;
                    handlePetegola2WatchAndRetreat(nextWatchDuration);
                  }, gapDuration);
                } else {
                  scheduleNextBossCycle();
                }
              }, watchDuration);
            };

            const firstWatchDuration = 1200 + Math.random() * 500;
            handlePetegola2WatchAndRetreat(firstWatchDuration);
          }, warningDuration);

        } else {
          // CAPO: schema classico con avviso rilassato (900ms - 1300ms)
          setBossState('warning');
          playWarningChime(false);

          const warningDuration = 900 + Math.random() * 400;

          setSafeTimeout(() => {
            if (isVictoryRef.current || isPausedCaughtRef.current) return;

            setBossState('watching');

            if (isPressingRef.current && !isBlackoutRef.current) {
              triggerCaught();
              return;
            }

            const watchingDuration = 1600 + Math.random() * 800;

            setSafeTimeout(() => {
              if (isVictoryRef.current || isPausedCaughtRef.current) return;

              setBossState('hidden');
              scheduleNextBossCycle();
            }, watchingDuration);
          }, warningDuration);
        }
      }, hiddenDuration);
    };

    scheduleNextBossCycle();

    return () => {
      if (bossTimerRef.current) clearTimeout(bossTimerRef.current);
      activeTimeouts.forEach(id => clearTimeout(id));
    };
  }, [round, isVictory, isPausedCaught, playWarningChime, triggerCaught]);

  // Rilevamento pressione attiva
  const handlePointerStart = useCallback(() => {
    if (isPausedCaughtRef.current || isVictoryRef.current) return;

    // Se si preme mentre il capo sta già scrutando la stanza (a meno che non ci siano le luci spente!)
    if (bossStateRef.current === 'watching' && !isBlackoutRef.current) {
      triggerCaught();
      return;
    }

    setIsPressing(true);
    if (soundEnabled) soundManager.playKissPop();
  }, [soundEnabled, triggerCaught]);

  const handlePointerEnd = useCallback(() => {
    setIsPressing(false);
  }, []);

  // Gestione tastiera (Barra spaziatrice come richiesto dalla specifica)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handlePointerStart();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePointerEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePointerStart, handlePointerEnd]);

  // Generatore particelle cuori (allineate alle modelle in base allo sfondo attivo)
  const spawnKissParticles = (count: number = 2) => {
    const isSpecialBg = checkIsSpecialRightBg(currentBgUrlRef.current);
    const baseX = isSpecialBg ? 495 : 385;
    const isKissing = isPressingRef.current && !isPausedCaughtRef.current;
    const baseY = (isSpecialBg && isKissing) ? 930 : 985;

    for (let i = 0; i < count; i++) {
      const char = ['💖', '💕', '✨', '💋', '🌸'][Math.floor(Math.random() * 5)];
      particlesRef.current.push({
        id: Math.random() + Date.now(),
        x: baseX + Math.random() * 105,
        y: baseY + Math.random() * 80,
        vx: (Math.random() - 0.5) * 3,
        vy: -3.5 - Math.random() * 4,
        size: 30 + Math.random() * 22,
        char,
        opacity: 1,
        rotation: (Math.random() - 0.5) * 0.4,
        vr: (Math.random() - 0.5) * 0.05
      });
    }
  };

  // Generatore coriandoli vittoria
  const spawnConfetti = () => {
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      confettiRef.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -40 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 6,
        vy: 3 + Math.random() * 7,
        w: 14 + Math.random() * 18,
        h: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.15
      });
    }
  };

  // --- LOOP PRINCIPALE DI RENDERING CANVAS (HTML5 CANVAS + REQUEST ANIMATION FRAME) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. AGGIORNAMENTO LOGICA DI GIOCO
      if (!isPausedCaughtRef.current && !isVictoryRef.current) {
        // Se il giocatore tiene premuto il pulsante
        if (isPressingRef.current) {
          // Se nel frattempo il capo o le pettegole stanno guardando -> sgamati! (a meno che non ci sia il buio / luci spente)
          if (bossStateRef.current === 'watching' && !isBlackoutRef.current) {
            triggerCaught();
          } else {
            // Avanzamento barra Love Meter (durata aumentata di oltre 3 volte: ~20s)
            const speed = 5.0;
            const nextMeter = Math.min(100, loveMeterRef.current + speed * dt);
            loveMeterRef.current = nextMeter;
            setLoveMeter(nextMeter);

            // Genera particelle cuoricini
            if (Math.random() < 0.45) {
              spawnKissParticles(1);
            }

            // Suono intermittente delicato e rilassante
            kissSoundCooldownRef.current += dt;
            if (kissSoundCooldownRef.current >= 0.58) {
              kissSoundCooldownRef.current = 0;
              if (soundEnabled) soundManager.playKissPop();
            }

            // REGOLA: Al raggiungimento del 100% seleziona a random una delle immagini finali caricate (mai la stessa di fila)
            if (nextMeter >= 100) {
              const winFinale = getRandomFinale(currentFinaleUrlRef.current);
              setCurrentFinaleUrl(winFinale);
              currentFinaleUrlRef.current = winFinale;
              setIsVictory(true);
              setIsPressing(false);
              spawnConfetti();
              if (soundEnabled) soundManager.playKissCelebration();
            }
          }
        }
      }

      // Aggiornamento particelle cuoricini
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.opacity -= 0.7 * dt;
      });
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0);

      // Aggiornamento coriandoli se vittoria
      if (confettiRef.current.length > 0) {
        confettiRef.current.forEach(c => {
          c.x += c.vx;
          c.y += c.vy;
          c.rotation += c.vr;
        });
        confettiRef.current = confettiRef.current.filter(c => c.y < CANVAS_HEIGHT + 60);
      }

      // 2. RENDERING CANVAS (Risoluzione fissa 1080x1920)
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // A. DISEGNO SFONDO: cover completa di tutto il canvas 1080x1920 (nessuno stretch)
      const bgImg = imagesMapRef.current['background'];
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        drawCover(ctx, bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        renderFallbackSlot(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'background.png', 'Sfondo Backstage / Camerino', '#23182d', '#78350f', '🎭');
      }

      // B. PORTA / CAPO E PETTEGOLE: Inquadrati davanti alla porta (spostati leggermente più sotto)
      const currentBoss = bossStateRef.current;
      if (currentBoss === 'warning') {
        const warnImg = imagesMapRef.current['boss_warning'];
        if (warnImg && warnImg.complete && warnImg.naturalWidth > 0) {
          drawFit(ctx, warnImg, 725, 680, 348, 407, 0.5, 0.85);
        } else {
          renderFallbackSlot(ctx, 735, 685, 330, 397, 'boss_warning.jpg', 'Avviso in arrivo (!)', '#eab30844', '#eab308', '⚠️');
        }
      } else if (currentBoss === 'watching') {
        const curWatcher = watcherTypeRef.current;
        let watchSlot = 'boss_watching';
        let label = 'Capo che controlla la stanza';
        if (curWatcher === 'petegola1' && imagesMapRef.current['petegola1_watching']) {
          watchSlot = 'petegola1_watching';
          label = 'Pettegola 1 che sbircia';
        } else if (curWatcher === 'petegola2' && imagesMapRef.current['petegola2_watching']) {
          watchSlot = 'petegola2_watching';
          label = 'Pettegola 2 in agguato';
        }

        const watchImg = imagesMapRef.current[watchSlot] || imagesMapRef.current['boss_watching'];
        if (watchImg && watchImg.complete && watchImg.naturalWidth > 0) {
          if (curWatcher === 'petegola1' || curWatcher === 'petegola2') {
            // Pettegola 1 e Pettegola 2 entrambe ridotte del 5% (348x404)
            drawFit(ctx, watchImg, 724, 688, 348, 404, 0.5, 0.85);
          } else {
            drawFit(ctx, watchImg, 715, 670, 366, 425, 0.5, 0.85);
          }
        } else {
          if (curWatcher === 'petegola1' || curWatcher === 'petegola2') {
            renderFallbackSlot(ctx, 734, 692, 331, 394, `${curWatcher}_watching.png`, label, '#dc262644', '#dc2626', '👀');
          } else {
            renderFallbackSlot(ctx, 725, 675, 348, 415, 'boss_watching.png', label, '#dc262644', '#dc2626', '👀');
          }
        }
      } else if (currentBoss === 'caught') {
        const curWatcher = watcherTypeRef.current;
        let caughtSlot = 'boss_caught';
        let label = 'Beccate dal capo! 😱';
        if (curWatcher === 'petegola1' && imagesMapRef.current['petegola1_caught']) {
          caughtSlot = 'petegola1_caught';
          label = 'Siete state beccate! 😱';
        } else if (curWatcher === 'petegola2' && imagesMapRef.current['petegola2_caught']) {
          caughtSlot = 'petegola2_caught';
          label = 'Siete state beccate! 😱';
        }

        const caughtImg = imagesMapRef.current[caughtSlot] || imagesMapRef.current['boss_caught'];
        if (caughtImg && caughtImg.complete && caughtImg.naturalWidth > 0) {
          if (curWatcher === 'petegola1' || curWatcher === 'petegola2') {
            // Pettegola 1 e Pettegola 2 entrambe ridotte del 5% (399x428)
            drawFit(ctx, caughtImg, 698, 678, 399, 428, 0.5, 0.85);
          } else {
            drawFit(ctx, caughtImg, 687, 658, 420, 451, 0.5, 0.85);
          }
        } else {
          if (curWatcher === 'petegola1' || curWatcher === 'petegola2') {
            renderFallbackSlot(ctx, 707, 682, 380, 420, `${curWatcher}_caught.png`, label, '#b91c1c66', '#b91c1c', '💥');
          } else {
            renderFallbackSlot(ctx, 697, 662, 402, 443, 'boss_caught.png', label, '#b91c1c66', '#b91c1c', '💥');
          }
        }
      } else {
        // boss_hidden: trasparente o assente davanti alla porta
        const hiddenImg = imagesMapRef.current['boss_hidden'];
        if (hiddenImg && hiddenImg.complete && hiddenImg.naturalWidth > 0) {
          drawFit(ctx, hiddenImg, 873, 861, 65, 65, 0.5, 0.5);
        }
      }

      // C. MODELLE: Spostate più a destra SOLO quando lo sfondo attivo è "sfondo.png.jpg (1)"
      // e quando si baciano su questo specifico sfondo, portate leggermente più su (modelY 785)
      const isSpecialBg = checkIsSpecialRightBg(currentBgUrlRef.current);
      const modelX = isSpecialBg ? 295 : 185;
      const isKissing = isPressingRef.current && !isPausedCaughtRef.current;
      const modelY = (isSpecialBg && isKissing) ? 785 : 840;
      const modelSlotKey = isKissing ? 'models_kissing' : 'models_idle';
      const modelImg = imagesMapRef.current[modelSlotKey];

      // Disegnate PRIMA delle amiche così le modelle rimangono dietro
      if (modelImg && modelImg.complete && modelImg.naturalWidth > 0) {
        drawFit(ctx, modelImg, modelX, modelY, 506, 406, 0.5, 0.5);
      } else {
        if (isKissing) {
          renderFallbackSlot(ctx, modelX + 10, modelY + 10, 488, 388, 'models_kissing.png', 'Modelle che si baciano (Kissing)', '#f43f5e44', '#f43f5e', '👩‍❤️‍💋‍👩');
        } else {
          renderFallbackSlot(ctx, modelX + 10, modelY + 10, 488, 388, 'models_idle.png', 'Modelle a riposo (Separate)', '#ec489933', '#ec4899', '👯‍♀️');
        }
      }

      // D. DUE AMICHE: Posizionate leggerissimamente più a destra (left: 205, top: 1280, 740x417)
      const friendsSlotKey = isKissing ? 'friends_signal' : 'friends_idle';
      const friendsImg = imagesMapRef.current[friendsSlotKey];

      // Disegnate DOPO le modelle così coprono la parte inferiore stando in primo piano
      if (friendsImg && friendsImg.complete && friendsImg.naturalWidth > 0) {
        drawFit(ctx, friendsImg, 205, 1280, 740, 417, 0.5, 0.5);
      } else {
        if (isKissing) {
          renderFallbackSlot(ctx, 215, 1290, 721, 398, 'amiche_segnale.png', 'Amiche: Segnale "OK" via libera!', '#22c55e33', '#22c55e', '👌');
        } else {
          renderFallbackSlot(ctx, 215, 1290, 721, 398, 'amiche_idle.png', 'Amiche a riposo alla scrivania', '#05966922', '#059669', '👩‍💻');
        }
      }

      // E. DISEGNO PARTICELLE CUORICINI FLUTTUANTI
      particlesRef.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${Math.floor(p.size)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      // F. DISEGNO CORIANDOLI VITTORIA
      if (confettiRef.current.length > 0) {
        confettiRef.current.forEach(c => {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [soundEnabled, triggerCaught]);

  // Funzione di disegno segnaposto / fallback con etichetta leggibile come da requisito
  const renderFallbackSlot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    filename: string,
    label: string,
    bgColor: string,
    borderColor: string,
    icon: string
  ) => {
    ctx.save();
    // Rettangolo di sfondo
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);

    // Bordo tratteggiato
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(x, y, w, h);

    // Icona grande
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x + w / 2, y + h / 2 - 40);

    // Etichetta e percorso file relativo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(label, x + w / 2, y + h / 2 + 30);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`[${filename}]`, x + w / 2, y + h / 2 + 65);

    ctx.restore();
  };

  // Riavvio per Nuovo Round (con nuovo sfondo casuale e complicità amiche resettata)
  const startNextRound = () => {
    const nextBg = getRandomBg(currentBgUrlRef.current);
    setCurrentBgUrl(nextBg);
    currentBgUrlRef.current = nextBg;
    setLoveMeter(0);
    loveMeterRef.current = 0;
    setRound(prev => prev + 1);
    roundRef.current += 1;
    // Resetta la complicità delle amiche (livello massimo 5/5)
    setComplicityLevel(5);
    setCaughtCountInRound(0);
    caughtCountInRoundRef.current = 0;
    setBossState('hidden');
    bossStateRef.current = 'hidden';
    setIsVictory(false);
    isVictoryRef.current = false;
    setIsPausedCaught(false);
    isPausedCaughtRef.current = false;
    setIsBlackout(false);
    isBlackoutRef.current = false;
    setIsFiveTimesResetting(false);
    confettiRef.current = [];
    const nextFinale = getRandomFinale(currentFinaleUrlRef.current);
    setCurrentFinaleUrl(nextFinale);
    currentFinaleUrlRef.current = nextFinale;
  };

  const restartCurrentRound = () => {
    const nextBg = getRandomBg(currentBgUrlRef.current);
    setCurrentBgUrl(nextBg);
    currentBgUrlRef.current = nextBg;
    setLoveMeter(0);
    loveMeterRef.current = 0;
    // Resetta la complicità delle amiche (livello massimo 5/5)
    setComplicityLevel(5);
    setCaughtCountInRound(0);
    caughtCountInRoundRef.current = 0;
    setBossState('hidden');
    bossStateRef.current = 'hidden';
    setIsVictory(false);
    isVictoryRef.current = false;
    setIsPausedCaught(false);
    isPausedCaughtRef.current = false;
    setIsBlackout(false);
    isBlackoutRef.current = false;
    setIsFiveTimesResetting(false);
    confettiRef.current = [];
    const nextFinale = getRandomFinale(currentFinaleUrlRef.current);
    setCurrentFinaleUrl(nextFinale);
    currentFinaleUrlRef.current = nextFinale;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden h-[100dvh]">
      {/* Sfondo globale esteso a tutto lo schermo (cover completa e nitida, anche sotto ogni scritta) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src={currentBgUrl || ORA_ORA_BACKGROUND_IMAGE || '/assets/background.png'}
          alt="Sfondo Backstage"
          className="w-full h-full object-cover object-[center_70%] select-none"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* CONTENITORE PRINCIPALE: ASPECT RATIO 9:16 RESPONSIVE      */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full h-full max-h-[100dvh] aspect-[9/16] max-w-[560px] mx-auto flex flex-col justify-between overflow-hidden shadow-2xl bg-transparent">
        {/* Canvas a tutto schermo nel contenitore: da cima a fondo, visibile anche sotto le scritte */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* ========================================================= */}
        {/* 1. HEADER SUPERIORE: TRASLUCIDO, LO SFONDO SCORRE SOTTO   */}
        {/* ========================================================= */}
        <header className="relative z-30 w-full px-3 pt-3 pb-1 flex flex-col gap-1.5 shrink-0 bg-gradient-to-b from-black/45 via-black/20 to-transparent pointer-events-auto">
          <div className="flex items-center justify-between whitespace-nowrap gap-1">
            {/* Sinistra: Scrittura chiara del Round e Contatore Record Round Massimo Raggiunto */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-black px-2.5 sm:px-3 py-1.5 rounded-full calm-white-card text-pink-700 border border-pink-200 shadow-sm font-['Quicksand'] whitespace-nowrap">
                Round {round}
              </span>
              <span
                className="text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-300 shadow-sm font-['Quicksand'] whitespace-nowrap flex items-center gap-1"
                title="Record round massimo raggiunto"
              >
                <span className="text-[11px] sm:text-xs shrink-0">🏆</span>
                <span>Rec: {maxRoundRecord}</span>
              </span>
            </div>

            {/* Titolo Principale del Minigioco e Regole Uniformati agli altri giochi (senza emoticon) */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 calm-white-card px-3 sm:px-4 py-1 rounded-full border border-pink-200 shadow-md whitespace-nowrap">
              <h2 className="text-[#831843] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] drop-shadow-xs whitespace-nowrap">
                Ora, Ora !
              </h2>
              <button
                onClick={() => setShowRules(true)}
                className="p-1 text-pink-800 hover:text-pink-950 active:scale-95 transition-all rounded-full hover:bg-pink-100/70 cursor-pointer"
                title="Regole del gioco"
                aria-label="Regole del gioco"
              >
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </button>
            </div>

            {/* Pulsante chiudi / esci */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer transition-all"
              title="Chiudi gioco"
              aria-label="Esci"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* BARRA DEL PROGRESSO "LOVE METER" & COMPLICITÀ AMICHE     */}
          {/* ========================================================= */}
          <div className="w-full bg-black/35 backdrop-blur-md rounded-2xl p-2.5 border border-pink-400/30 shadow-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-pink-200 px-1 whitespace-nowrap">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Heart className={`w-3.5 h-3.5 fill-pink-500 text-pink-400 ${isPressing ? 'scale-125 animate-ping' : ''}`} />
                <span className="tracking-wide whitespace-nowrap">Love Meter</span>
              </div>

              {/* Percentuale di progresso */}
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-pink-300 font-extrabold text-xs whitespace-nowrap">{Math.floor(loveMeter)}%</span>
              </div>
            </div>

            {/* Barra di riempimento graduale rosa/rosso */}
            <div className="relative w-full h-3.5 bg-slate-900/80 rounded-full overflow-hidden border border-pink-400/40 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 transition-all duration-75 shadow-[0_0_12px_rgba(244,63,94,0.6)] relative overflow-hidden"
                style={{ width: `${loveMeter}%` }}
              >
                {/* Bagliore dinamico */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            {/* Indicatore Complicità Amiche (5 stadi: scende ad ogni cattura del capo, a 5 va a zero) */}
            <div className="flex items-center justify-between text-[11px] font-bold text-pink-200/90 pt-1.5 border-t border-pink-400/20 px-1 whitespace-nowrap">
              <span className="text-slate-300 whitespace-nowrap shrink-0">Complicità amiche:</span>
              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <div className="flex gap-1 items-center shrink-0">
                  {[1, 2, 3, 4, 5].map(step => (
                    <span
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-200 shrink-0 ${
                        step <= complicityLevel
                          ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                          : 'bg-slate-700/80 border border-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span
                  className="font-extrabold text-[11px] whitespace-nowrap shrink-0"
                  style={{ color: getComplicityStage(complicityLevel).color }}
                >
                  {getComplicityStage(complicityLevel).label} ({complicityLevel}/5)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* OVERLAY LUCI SPENTE A TUTTO SCHERMO (Schermo nero, scritta LUCI SPENTE su riga singola, immunità totale) */}
        <AnimatePresence>
          {isBlackout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 z-35 bg-black/98 flex flex-col items-center justify-center p-4 pointer-events-none select-none"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: [0.96, 1.04, 0.96] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center justify-center gap-2.5"
              >
                <div className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border-2 border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)] whitespace-nowrap">
                  <span className="text-xl sm:text-2xl shrink-0">💡</span>
                  <span className="text-xl sm:text-3xl font-black text-amber-300 tracking-wider uppercase font-['Quicksand'] whitespace-nowrap">
                    LUCI SPENTE
                  </span>
                  <span className="text-xl sm:text-2xl shrink-0">🌙</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-300 bg-black/80 px-4 py-1.5 rounded-full border border-slate-700 whitespace-nowrap shadow-md">
                  Al buio nessuno può vedervi: bacia in totale sicurezza!
                </p>
                {/* Timer piccolino sotto la scritta che c'è già */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-amber-400/50 shadow-inner text-amber-300 text-xs font-mono font-bold whitespace-nowrap">
                  <span className="text-xs shrink-0">⏱️</span>
                  <span>{Math.max(0, blackoutSecondsLeft).toFixed(1)}s</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* 2. AREA CENTRALE INTERATTIVA: BANNER SGAMATI              */}
        {/* ========================================================= */}
        <div className="relative z-20 flex-1 w-full pointer-events-none flex items-center justify-center px-2">
          {/* Banner fluttuante reazione comica "Sgamati!" - ogni scritta rigorosamente su una riga */}
          <AnimatePresence>
            {bossState === 'caught' && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: -20 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl border-2 border-white text-white font-black text-center shadow-2xl backdrop-blur-md z-40 max-w-[96%] w-auto whitespace-nowrap mx-auto flex flex-col items-center justify-center ${
                  isFiveTimesResetting ? 'bg-gradient-to-r from-red-700 via-rose-800 to-amber-700' : 'bg-red-600/95'
                }`}
              >
                {isFiveTimesResetting ? (
                  <>
                    <p className="text-sm min-[380px]:text-base sm:text-xl font-black tracking-wide text-amber-200 drop-shadow-md whitespace-nowrap leading-none py-0.5">
                      💥 SCOPERTE 5 VOLTE!
                    </p>
                    <p className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold text-white mt-1 whitespace-nowrap leading-none">
                      Livello amicizia a ZERO! Nuovo sfondo in arrivo...
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm min-[380px]:text-base sm:text-xl font-black tracking-wide drop-shadow-md whitespace-nowrap leading-none py-0.5">
                      {watcherType === 'boss'
                        ? 'BECCATE DAL CAPO! 😱'
                        : 'SIETE STATE BECCATE! 😱'}
                    </p>
                    <p className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-semibold text-red-100 mt-1 whitespace-nowrap leading-none">
                      {complicityLevel > 0
                        ? `Amicizia scesa a ${complicityLevel}/5 · Si riparte subito!`
                        : '2 secondi di tregua e si riparte subito!'}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* 3. FONDO SCHERMO: UNICO GRANDE PULSANTE INTERATTIVO       */}
        {/* ========================================================= */}
        <footer className="relative z-40 w-full p-3 pb-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent shrink-0 pointer-events-auto">
          <button
            onPointerDown={e => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              } catch {}
              handlePointerStart();
            }}
            onPointerUp={e => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {}
              handlePointerEnd();
            }}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
            disabled={isPausedCaught || isVictory}
            className={`w-full py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl font-black text-[11px] min-[360px]:text-xs sm:text-sm md:text-base tracking-wide uppercase transition-all duration-100 cursor-pointer select-none touch-none shadow-xl flex items-center justify-center gap-1.5 border whitespace-nowrap overflow-hidden ${
              isPausedCaught
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                : isBlackout
                ? isPressing
                  ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] scale-[0.98]'
                  : 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-amber-200 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse'
                : isPressing
                ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white border-pink-300 scale-[0.98] shadow-[0_0_25px_rgba(244,63,94,0.7)]'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white border-pink-400 hover:from-pink-400 hover:to-rose-500 active:scale-95 shadow-[0_6px_20px_rgba(244,63,94,0.4)]'
            }`}
          >
            {isFiveTimesResetting ? (
              <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-base sm:text-lg shrink-0">🔄</span>
                <span className="whitespace-nowrap shrink-0">AMICIZIA A ZERO · NUOVO SFONDO IN ARRIVO...</span>
              </span>
            ) : isPausedCaught ? (
              <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-base sm:text-lg shrink-0">💨</span>
                <span className="whitespace-nowrap shrink-0">
                  {watcherType === 'boss'
                    ? 'ASPETTA CHE IL CAPO VADA VIA...'
                    : 'ASPETTA CHE VADA VIA...'}
                </span>
              </span>
            ) : isBlackout ? (
              <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-lg sm:text-xl shrink-0">🌙</span>
                <span className="whitespace-nowrap shrink-0">
                  {isPressing ? 'BACIO AL BUIO IN CORSO...' : 'APPROFITTA DEL BUIO PER BACIARE!'}
                </span>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
              </span>
            ) : isPressing ? (
              <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-lg sm:text-xl animate-pulse shrink-0">💋</span>
                <span className="animate-pulse whitespace-nowrap shrink-0">BACIO IN CORSO...</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-spin shrink-0" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="text-lg sm:text-xl group-hover:scale-110 shrink-0">💖</span>
                <span className="whitespace-nowrap shrink-0">TIENI PREMUTO PER BACIARE</span>
              </span>
            )}
          </button>
          <p className="text-[10px] min-[360px]:text-[11px] text-pink-300/85 text-center mt-1.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis px-1">
            {isBlackout
              ? "Luci spente: approfitta dell'oscurità prima che torni la luce!"
              : "Tieni premuto a via libera · Rilascia per non farti scoprire!"}
          </p>
        </footer>

        {/* ========================================================= */}
        {/* MODALE DI VITTORIA ("LEVEL COMPLETE!")                     */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isVictory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 text-center select-none"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="w-full max-w-sm max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 to-pink-950 border-2 border-pink-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-3.5"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-2xl shadow-inner whitespace-nowrap">
                  🎉
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-pink-200 font-['Quicksand'] whitespace-nowrap">
                    Level Complete!
                  </h2>
                  <p className="text-[11px] sm:text-xs text-pink-300/90 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    Bacio perfetto! Round {round} superato con successo!
                  </p>
                </div>

                {/* Immagine di fine partita (cambia a random ad ogni vittoria) */}
                {(currentFinaleUrl || ORA_ORA_FINALE_IMAGE || imagesMapRef.current['finale']?.src) && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="relative mx-auto rounded-2xl overflow-hidden border-2 border-pink-400 shadow-2xl max-w-[240px] w-full aspect-square flex items-center justify-center bg-pink-950/20"
                  >
                    <img
                      src={currentFinaleUrl || ORA_ORA_FINALE_IMAGE || imagesMapRef.current['finale']?.src}
                      alt="Scena Finale"
                      className="w-full h-full object-cover rounded-xl block"
                    />
                  </motion.div>
                )}

                <div className="bg-black/40 rounded-2xl p-3 border border-pink-500/20 text-xs space-y-1.5 text-pink-200">
                  <div className="flex justify-between items-center whitespace-nowrap">
                    <span className="whitespace-nowrap">Love Meter:</span>
                    <span className="font-bold text-emerald-400 whitespace-nowrap">100% Completo</span>
                  </div>
                  <div className="flex justify-between items-center whitespace-nowrap">
                    <span className="whitespace-nowrap">Complicità amiche:</span>
                    <span
                      className="font-bold whitespace-nowrap"
                      style={{ color: getComplicityStage(complicityLevel).color }}
                    >
                      {getComplicityStage(complicityLevel).label} ({complicityLevel}/5)
                    </span>
                  </div>
                  <div className="flex justify-between items-center whitespace-nowrap pt-1 border-t border-pink-500/20">
                    <span className="whitespace-nowrap text-slate-300">Record Round:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1 whitespace-nowrap">
                      <span>🏆</span>
                      <span>Livello {Math.max(round, maxRoundRecord)}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    onClick={startNextRound}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg active:scale-95 transition-all cursor-pointer border border-pink-300 whitespace-nowrap"
                  >
                    Nuovo Round (Livello {round + 1}) ✨
                  </button>
                  <button
                    onClick={restartCurrentRound}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 font-bold text-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Rigioca questo Round
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODALE REGOLE (TESTO COMPLETO E LEGGIBILE A CAPO)         */}
        {/* ========================================================= */}
        {showRules && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
            onClick={() => setShowRules(false)}
          >
            <div
              className="calm-white-card border-2 border-pink-200 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-pink-100 pb-2.5">
                <h3 className="font-extrabold text-base text-pink-950 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Regole del gioco</span>
                </h3>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-all active:scale-95"
                  title="Chiudi regole"
                  aria-label="Chiudi regole"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-700 space-y-2.5 font-medium leading-relaxed">
                <p className="font-semibold text-pink-950">
                  Nel camerino mantieni vivo l'affetto senza farti scoprire:
                </p>

                <div className="space-y-2 pt-0.5">
                  <div className="text-xs text-slate-700 leading-relaxed bg-pink-50/80 p-2.5 rounded-xl border border-pink-100">
                    <strong className="text-pink-950 block mb-0.5 font-extrabold">1. Tieni premuto:</strong>
                    le modelle si baciano con passione e la barra del Love Meter sale!
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
                    <strong className="text-amber-950 block mb-0.5 font-extrabold">2. Allerta in arrivo:</strong>
                    fai attenzione al segnale prima che il capo o le pettegole controllino!
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed bg-rose-50/80 p-2.5 rounded-xl border border-rose-100">
                    <strong className="text-rose-950 block mb-0.5 font-extrabold">3. Rilascia in tempo:</strong>
                    se vieni scoperta la barra torna a zero (dopo 5 catture l'amicizia si azzera)!
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed bg-purple-50/80 p-2.5 rounded-xl border border-purple-100">
                    <strong className="text-purple-950 block mb-0.5 font-extrabold">4. Luci Spente:</strong>
                    quando le luci si spengono hai immunità totale: bacia senza sosta al buio!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Ho capito, giochiamo!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


