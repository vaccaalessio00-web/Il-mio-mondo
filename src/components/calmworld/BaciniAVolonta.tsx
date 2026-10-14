import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import {
  BACINI_CENTRO_IMAGES,
  BACINI_FINE_IMAGES,
  BACINI_SFONDO_IMAGES,
  BACINI_CENTRO_IMAGE,
  BACINI_FINE_IMAGE,
  BACINI_SFONDO_IMAGE
} from '../../assets/minigames';
import { CHIBI_BOYFRIEND_PUZZOLA } from '../../assets/mascot';
import { removeBackground } from '../../utils/imageCutout';

interface BaciniAVolontaProps {
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  symbol: string;
  rotation: number;
  color: string;
}

const SWEET_REACTIONS = [
  'Smack! 💋',
  'Mmmh coccole! 🥰',
  'Altro bacino! 💕',
  'Che dolcezza... 💖',
  'Un bacetto soffice! ☁️',
  'Il mio cuoricino ringrazia! 🌸',
  'Ancora uno! ✨',
  'Pieno d’amore! 🍓',
  'Tutto per me! 🍯',
  'Sei dolcissimo! 🧸'
];

const HEART_ICONS = ['💋', '💖', '💕', '💗', '💓', '✨', '🌸', '🥰'];

export const BaciniAVolonta: React.FC<BaciniAVolontaProps> = ({ onClose }) => {
  const [showRules, setShowRules] = useState(false);

  // Pool di immagini centro e fine
  const availableCentro = BACINI_CENTRO_IMAGES.length > 0
    ? BACINI_CENTRO_IMAGES
    : (BACINI_CENTRO_IMAGE ? [BACINI_CENTRO_IMAGE] : [CHIBI_BOYFRIEND_PUZZOLA]);

  const availableFine = BACINI_FINE_IMAGES.length > 0
    ? BACINI_FINE_IMAGES
    : (BACINI_FINE_IMAGE ? [BACINI_FINE_IMAGE] : availableCentro);

  // Pool di sfondi
  const availableSfondi = BACINI_SFONDO_IMAGES.length > 0
    ? BACINI_SFONDO_IMAGES
    : (BACINI_SFONDO_IMAGE ? [BACINI_SFONDO_IMAGE] : []);

  // 1. Immagine del centro corrente (cambia ad ogni partita)
  const [centerImageSrc, setCenterImageSrc] = useState<string>(() => {
    let lastUsed = '';
    try {
      lastUsed = localStorage.getItem('bacini_last_centro') || '';
    } catch {}
    const candidates = availableCentro.filter(img => img !== lastUsed);
    const chosen = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : availableCentro[Math.floor(Math.random() * availableCentro.length)];
    try {
      if (chosen) localStorage.setItem('bacini_last_centro', chosen);
    } catch {}
    return chosen || availableCentro[0];
  });

  // Immagine scontornata (trasparente, senza cornice bianca)
  const [cutoutImageSrc, setCutoutImageSrc] = useState<string>(centerImageSrc);
  const [isCutoutLoading, setIsCutoutLoading] = useState<boolean>(true);

  // Scontorna automaticamente l'immagine del centro selezionata (se non già trasparente)
  useEffect(() => {
    // Sincronizza subito con la nuova immagine per non mostrare mai il centro precedente
    setCutoutImageSrc(centerImageSrc);
    let isCancelled = false;
    setIsCutoutLoading(true);

    removeBackground(centerImageSrc)
      .then(transparentUrl => {
        if (!isCancelled && transparentUrl) {
          setCutoutImageSrc(transparentUrl);
          setIsCutoutLoading(false);
        }
      })
      .catch(err => {
        console.warn('Errore scontorno centro:', err);
        if (!isCancelled) {
          setCutoutImageSrc(centerImageSrc);
          setIsCutoutLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [centerImageSrc]);

  // 2. Immagine di sfondo corrente: uno sfondo per partita!
  const [currentBgSrc, setCurrentBgSrc] = useState<string | null>(() => {
    if (availableSfondi.length > 0) {
      return availableSfondi[Math.floor(Math.random() * availableSfondi.length)];
    }
    return null;
  });

  // Funzione per cambiare lo sfondo e contemporaneamente il centro con uno random ad ogni nuova partita
  const changeBackgroundAndCenter = useCallback(() => {
    if (availableSfondi.length > 1) {
      setCurrentBgSrc(prev => {
        const candidates = availableSfondi.filter(s => s !== prev);
        return candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : availableSfondi[0];
      });
    } else if (availableSfondi.length === 1) {
      setCurrentBgSrc(availableSfondi[0]);
    }

    if (availableCentro.length > 1) {
      setCenterImageSrc(prev => {
        const candidates = availableCentro.filter(img => img !== prev);
        const chosen = candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : availableCentro[Math.floor(Math.random() * availableCentro.length)];
        try {
          localStorage.setItem('bacini_last_centro', chosen);
        } catch {}
        setCutoutImageSrc(chosen);
        return chosen;
      });
    } else if (availableCentro.length === 1) {
      setCenterImageSrc(availableCentro[0]);
      setCutoutImageSrc(availableCentro[0]);
    }
  }, [availableSfondi, availableCentro]);

  // Immagine a fine partita (selezionata casualmente tra quelle disponibili)
  const [fineImageSrc, setFineImageSrc] = useState<string>(() => {
    return availableFine[Math.floor(Math.random() * availableFine.length)];
  });

  // Soglia casuale tra 20 e 50 bacini
  const getRandomThreshold = () => Math.floor(Math.random() * (50 - 20 + 1)) + 20;
  const [targetKisses, setTargetKisses] = useState<number>(getRandomThreshold);
  const [kissesCount, setKissesCount] = useState(0);

  // Feedback visivi avatar
  const [isBlushing, setIsBlushing] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string>('Dammi un bacino... 🥰');
  const [reactionKey, setReactionKey] = useState(0);

  // Particelle cuoricini (esattamente 1 emoticon per tocco)
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextParticleId = useRef(0);

  // Pop-up vittoria finale
  const [isComplete, setIsComplete] = useState(false);

  // Avatar container ref per calcolare il centro
  const avatarRef = useRef<HTMLDivElement | null>(null);

  // Riproduzione particelle fluttuanti
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.22,
            rotation: p.rotation + 2.5,
            size: Math.max(0, p.size - 0.35)
          }))
          .filter(p => p.size > 8 && p.y > -80)
      );
    }, 25);
    return () => clearInterval(interval);
  }, [particles.length]);

  // Azione tocco / invio bacino
  const handleSendKiss = useCallback(
    (clientX?: number, clientY?: number) => {
      if (isComplete) return;

      const nextCount = kissesCount + 1;
      setKissesCount(nextCount);

      // Suono carino
      soundManager.playKissPop();

      // Vibrazione aptica leggera
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.(18);
        } catch {}
      }

      // Animazione avatar squish & blush
      setIsSquishing(true);
      setIsBlushing(true);
      setTimeout(() => setIsSquishing(false), 220);
      setTimeout(() => setIsBlushing(false), 900);

      // Frase dolce a rotazione
      const reaction = SWEET_REACTIONS[Math.floor(Math.random() * SWEET_REACTIONS.length)];
      setCurrentReaction(reaction);
      setReactionKey(k => k + 1);

      // Calcola punto di origine particella
      let spawnX = window.innerWidth / 2;
      let spawnY = window.innerHeight * 0.45;

      if (clientX !== undefined && clientY !== undefined) {
        spawnX = clientX;
        spawnY = clientY;
      } else if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        spawnX = rect.left + rect.width / 2;
        spawnY = rect.top + rect.height / 2;
      }

      // Genera ESATTAMENTE 1 SOLA emoticon per tocco
      const singleParticle: Particle = {
        id: nextParticleId.current++,
        x: spawnX + (Math.random() - 0.5) * 16,
        y: spawnY,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -3.8 - Math.random() * 2,
        size: 30,
        symbol: HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)],
        rotation: (Math.random() - 0.5) * 30,
        color: ['#f43f5e', '#ec4899', '#f472b6', '#fb7185'][Math.floor(Math.random() * 4)]
      };

      setParticles(prev => [...prev.slice(-20), singleParticle]);

      // Controllo vittoria / completamento
      if (nextCount >= targetKisses) {
        const randomFinal = availableFine[Math.floor(Math.random() * availableFine.length)];
        setFineImageSrc(randomFinal);

        setTimeout(() => {
          setIsComplete(true);
          soundManager.playKissCelebration();
        }, 300);
      }
    },
    [isComplete, kissesCount, targetKisses, availableFine]
  );

  // Riavvia il gioco dopo la ricompensa (nuova partita)
  const handleRestart = () => {
    setIsComplete(false);
    setKissesCount(0);
    setTargetKisses(getRandomThreshold());
    setCurrentReaction('Pronto per altri bacini! 🥰');
    setReactionKey(k => k + 1);

    // Nuovo sfondo e nuovo centro casuale per la nuova partita
    changeBackgroundAndCenter();
  };

  const progressPercent = Math.min(100, Math.round((kissesCount / targetKisses) * 100));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden font-['Quicksand'] text-slate-800 dark:text-slate-100">
      {/* ================================================== */}
      {/* 0. SFONDO DINAMICO A TUTTO SCHERMO                 */}
      {/* ================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <AnimatePresence mode="popLayout">
          {currentBgSrc ? (
            <motion.img
              key={currentBgSrc}
              src={currentBgSrc}
              alt="Sfondo del minigioco Bacini"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          ) : (
            <motion.div
              key="fallback-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-gradient-to-b from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8] dark:from-[#2a0e1b] dark:via-[#1e0712] dark:to-[#13030b]"
            />
          )}
        </AnimatePresence>

        {/* Overlay soffice per garantire contrasto e leggibilità impeccabile di testo e pulsanti */}
        <div className="absolute inset-0 bg-black/15 dark:bg-black/40 backdrop-blur-[0.5px] pointer-events-none" />

        {/* Nuvole luminose decorative d'atmosfera */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl opacity-60 bg-pink-300/40 dark:bg-pink-600/20 pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-3xl opacity-50 bg-rose-300/40 dark:bg-rose-600/20 pointer-events-none" />
      </div>

      {/* ================================================== */}
      {/* 1. TOP BAR                                         */}
      {/* ================================================== */}
      <header className="w-full max-w-md flex flex-col gap-2 shrink-0 z-30">
        <div className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          {/* Spaziatore per mantenere il titolo perfettamente centrato */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 invisible pointer-events-none" aria-hidden="true" />

          {/* Nome del gioco e icona regole */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-1 rounded-full border border-pink-200/80 dark:border-pink-900/60 shadow-md">
            <h2 className="text-pink-900 dark:text-pink-100 font-black text-base sm:text-xl tracking-wide font-['Quicksand'] drop-shadow-xs">
              Bacini a volontà
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-pink-700 dark:text-pink-300 hover:text-pink-900 active:scale-95 transition-all rounded-full hover:bg-pink-100/70 cursor-pointer"
              title="Regole del gioco"
              aria-label="Regole del gioco"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </button>
          </div>

          {/* Pulsante chiudi / esci */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-white/90 dark:bg-stone-900/90 hover:bg-white active:scale-95 text-slate-800 dark:text-slate-100 rounded-full shadow-md shrink-0 border border-slate-300/80 dark:border-slate-700 cursor-pointer backdrop-blur-md"
            aria-label="Esci dal gioco"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 2. Barra dei Bacini / Livello di Amore */}
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-pink-200/80 dark:border-pink-900/60 shadow-md space-y-1.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-pink-900 dark:text-pink-200">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              Barra dei Bacini
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-pink-700 dark:text-pink-300 bg-pink-100/90 dark:bg-pink-950/70 px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
              {kissesCount} / {targetKisses} bacini
            </span>
          </div>

          <div className="w-full h-3 sm:h-3.5 bg-pink-100/80 dark:bg-pink-950/50 rounded-full overflow-hidden p-0.5 border border-pink-200 dark:border-pink-800">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-full shadow-xs"
              style={{ width: `${progressPercent}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            />
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* 2. AREA CENTRALE: PERSONAGGIO SCONTORNATO          */}
      {/* ================================================== */}
      <main className="relative flex-1 w-full max-w-md flex flex-col items-center justify-center py-1 z-20">
        {/* Fumetto reazione dolce */}
        <div className="h-10 flex items-center justify-center mb-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={reactionKey}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 dark:bg-[#2b1022]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-200/80 dark:border-pink-800/60 shadow-lg text-xs sm:text-sm font-extrabold text-pink-900 dark:text-pink-200 flex items-center gap-1.5"
            >
              <span>{currentReaction}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Personaggio al centro (10% più grande, spostato leggermente più in alto e perfettamente opaco) */}
        <div
          ref={avatarRef}
          onPointerDown={e => {
            e.preventDefault();
            handleSendKiss(e.clientX, e.clientY);
          }}
          className="relative group cursor-pointer active:scale-95 transition-transform flex flex-col items-center justify-center my-auto touch-manipulation select-none -translate-y-4 sm:-translate-y-6"
        >
          {/* Figura animata del personaggio (ingrandita del 10%) */}
          <motion.div
            animate={
              isSquishing
                ? { scale: [1, 1.08, 0.94, 1], rotate: [0, -3, 3, 0] }
                : { y: [0, -7, 0] }
            }
            transition={
              isSquishing
                ? { duration: 0.28 }
                : { repeat: Infinity, duration: 3.8, ease: 'easeInOut' }
            }
            className="relative flex items-center justify-center scale-110"
          >
            {/* Immagine del personaggio al centro: 100% solida e opaca, non trasparente */}
            <img
              src={cutoutImageSrc}
              alt="Personaggio al centro da baciare"
              className="max-h-[42vh] sm:max-h-[49vh] w-auto max-w-[88vw] sm:max-w-[360px] object-contain select-none pointer-events-none block drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.16)] opacity-100 transition-transform duration-200"
              draggable={false}
            />

            {/* Micro-bacino al tocco */}
            {isBlushing && (
              <span className="absolute -top-3 -right-3 text-3xl sm:text-4xl animate-bounce pointer-events-none drop-shadow-md z-30">
                💋
              </span>
            )}
          </motion.div>
        </div>

        {/* Particelle di cuoricini fluttuanti (1 sola emoticon per tocco) */}
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'fixed',
              left: p.x,
              top: p.y,
              fontSize: `${p.size}px`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              pointerEvents: 'none',
              zIndex: 60,
              textShadow: '0 2px 6px rgba(244,63,94,0.35)'
            }}
          >
            {p.symbol}
          </div>
        ))}
      </main>

      {/* ================================================== */}
      {/* 3. FOOTER GUIDA AL TOCCO                           */}
      {/* ================================================== */}
      <footer className="w-full max-w-md flex flex-col items-center justify-center gap-1.5 z-30 shrink-0 pb-2">
        <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-[#2b1022]/90 backdrop-blur-md border border-pink-200/80 dark:border-pink-800/60 shadow-md">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-pink-900 dark:text-pink-200 tracking-wide text-center">
            Tocca per mandare bacini 💋
          </span>
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
        </div>
      </footer>

      {/* ================================================== */}
      {/* 4. MODAL VITTORIA & RICOMPENSA                     */}
      {/* ================================================== */}
      <AnimatePresence>
        {isComplete && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-2 border-pink-300 dark:border-pink-700 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl text-center z-60"
            >
              {/* Immagine di fine partita */}
              <div className="relative mx-auto max-h-[35vh] flex items-center justify-center p-2.5 bg-white/90 dark:bg-stone-800/80 rounded-3xl shadow-xl border-2 border-pink-200/60 dark:border-pink-800/50">
                <img
                  src={fineImageSrc}
                  alt="Avatar vittoria finale"
                  className="max-h-[28vh] w-auto max-w-[65vw] object-contain rounded-2xl select-none pointer-events-none transition-all duration-300"
                  draggable={false}
                />
                <span className="absolute -top-2 -right-2 text-3xl animate-bounce">💖</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-pink-900 dark:text-pink-100 font-['Quicksand']">
                  «io volere altri bacini»
                </h3>
              </div>

              <button
                onClick={handleRestart}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Dai altri bacini ✨</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================== */}
      {/* 5. MODAL REGOLE                                    */}
      {/* ================================================== */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-pink-200 dark:border-pink-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-pink-100 dark:border-pink-900/50 pb-3">
              <h3 className="font-extrabold text-base text-pink-900 dark:text-pink-200 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                Regole del gioco
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
                Un angolo di infinita dolcezza e affetto per sciogliere ogni tensione e riempirsi il cuore di coccole.
              </p>

              <div>
                <p className="font-bold text-pink-900 dark:text-pink-300 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                  <li>
                    <strong>Tocco d'Amore:</strong> tocca il personaggio al centro per inviare un bacio 💋.
                  </li>
                  <li>
                    <strong>Rilassati:</strong> nessun timer né fretta, goditi il calore di un momento dolce e cozy.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
