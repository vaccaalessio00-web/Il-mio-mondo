import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Check, X, Compass, Dumbbell, Brain, ClipboardList, PlusCircle, Trophy } from 'lucide-react';
import { NavTab } from './Navbar';
import puff1Img from '../assets/images/Puff.png';
import puff2Img from '../assets/images/puff2.png';
import puff3Img from '../assets/images/puff3.png';
import puff4Img from '../assets/images/puff4.png';
import puff5Img from '../assets/images/Puff.5.png';
import puff6Img from '../assets/images/Puff.6.png';

// Immagini personalizzate di Puff caricate per ciascuno dei 6 step della guida (da 1 a 6)
const PUFF_GUIDE_IMAGES = [
  puff1Img,
  puff2Img,
  puff3Img,
  puff4Img,
  puff5Img,
  puff6Img
];

interface ChibiGuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: NavTab) => void;
}

interface TourStep {
  title: string;
  badge: string;
  badgeColor: string;
  tabKey?: NavTab;
  tabLabel?: string;
  speech: string;
  tip: string;
  chibiPose: 'waving' | 'workout' | 'builder' | 'trophy' | 'calm' | 'cheering';
}

export const ChibiGuidedTour: React.FC<ChibiGuidedTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      title: 'Benvenuta in MyWorld!',
      badge: '✨ PUFF TI GUIDA! 🐾',
      badgeColor: 'bg-emerald-600 text-white',
      speech:
        'Ciao! Sono Puff! ✨ Lascia che ti mostri come gestire le tue schede e dove trovare i nostri fantastici minigiochi rilassanti! Sarò la tua guida passo dopo passo in MyWorld!',
      tip: 'Suggerimento: puoi riaprire questa guida quando vuoi toccando Puff ✨ in alto a destra!',
      chibiPose: 'waving'
    },
    {
      title: '1. Gestione Schede di Allenamento',
      badge: '📋 SCHEDE',
      badgeColor: 'bg-teal-600 text-white',
      tabKey: 'routines',
      tabLabel: 'Schede',
      speech:
        'Nella barra in basso, tocca "Schede"! Qui trovi tutti i tuoi programmi divisi per giorni di allenamento. Con un tocco su "Inizia Allenamento" avvii il timer, puoi segnare i carichi sollevati, le ripetizioni e monitorare i recuperi!',
      tip: 'Puoi anche importare schede già pronte o sfogliare il catalogo con centinaia di esercizi.',
      chibiPose: 'workout'
    },
    {
      title: '2. Crea Nuove Schede su Misura',
      badge: '✍️ CREA SCHEDA',
      badgeColor: 'bg-blue-600 text-white',
      tabKey: 'builder',
      tabLabel: 'Crea',
      speech:
        'Vuoi costruire una routine personalizzata da zero? Tocca "Crea" (+)! Dai un nome alla tua scheda, scegli gli esercizi, imposta serie, carichi target e note. Potrai modificarla ogni volta che vuoi con la massima flessibilità!',
      tip: 'Troverai video, descrizioni e muscoli target per ogni esercizio.',
      chibiPose: 'builder'
    },
    {
      title: '3. Storico, Volume e Record',
      badge: '🏆 PROGRESSI',
      badgeColor: 'bg-amber-500 text-slate-950',
      tabKey: 'history',
      tabLabel: 'Storico & Progressi',
      speech:
        'In "Storico" trovi il diario cronologico di tutti i tuoi workout con date e statistiche. In "Progressi" ammiri i grafici dei tuoi pesi, volume di lavoro e completi le Missioni giornaliere per vincere splendidi trofei!',
      tip: 'Puoi salvare e sincronizzare tutto con Google Drive per tenere al sicuro i tuoi dati!',
      chibiPose: 'trophy'
    },
    {
      title: '4. Come Accedere ai Minigiochi!',
      badge: '🌸 OASI CALMWORLD',
      badgeColor: 'bg-purple-600 text-white',
      tabKey: 'calm',
      tabLabel: 'CalmWorld e Minigiochi',
      speech:
        'Finita la sessione o hai solo bisogno di distenderti? Tocca "CalmWorld" in basso! Qui trovi la respirazione guidata, il diario anti-ansia e la griglia con gli 11 minigiochi esclusivi: Bacini a volontà, Ora Ora, Passo dopo Passo, La Bottega di Papà, Magi cosa fai, Ile in azione e tanti altri!',
      tip: 'Tutti i minigiochi hanno la lampadina delle regole in alto e musiche rilassanti.',
      chibiPose: 'calm'
    },
    {
      title: 'Tutto Pronto! Let\'s Go!',
      badge: '🎉 EVVIVA!',
      badgeColor: 'bg-rose-500 text-white',
      speech:
        'Che meraviglia! Ora conosci tutti i segreti di MyWorld. Sei prontissima per allenarti al meglio e rilassarti con i nostri minigiochi ogni volta che ne senti il bisogno. Io sarò sempre qui a fare il tifo per te!',
      tip: 'Pronta a cominciare la tua avventura?',
      chibiPose: 'cheering'
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (steps[nextIdx].tabKey && onNavigateTab) {
        onNavigateTab(steps[nextIdx].tabKey!);
      }
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (steps[prevIdx].tabKey && onNavigateTab) {
        onNavigateTab(steps[prevIdx].tabKey!);
      }
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('fitworld_chibi_tour_seen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleJumpToTab = (tab: NavTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    // Chiudi il popup del tour così la schermata richiesta si apre immediatamente!
    try {
      localStorage.setItem('fitworld_chibi_tour_seen', 'true');
    } catch {
      // ignore
    }
    onClose();

    // Se si va a CalmWorld, scorri direttamente alla griglia dei minigiochi
    if (tab === 'calm') {
      setTimeout(() => {
        const el = document.getElementById('minigiochi-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={handleFinish}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-white via-white to-emerald-50/50 dark:from-[#111927] dark:via-[#131c2e] dark:to-[#0b1320] border-3 border-emerald-400 dark:border-emerald-600/70 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Comic background halftone dots texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:12px_12px]" />

        {/* Top bar with step counter and close */}
        <div className="flex items-center justify-between relative z-10 mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wider ${currentStep.badgeColor}`}>
              {currentStep.badge}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Guida {currentStepIndex + 1} di {steps.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
            title="Chiudi tour"
            aria-label="Chiudi tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================== */}
        {/* CHIBI MASCOT & SPEECH BUBBLE CONTAINER             */}
        {/* ================================================== */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 my-2 sm:my-3 relative z-10">
          
          {/* 1. CHIBI MASCOT (PUFFI LA PUZZOLA) - INTEGRATO MORBIDAMENTE SENZA CONTORNI NEL CERCHIO */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Diffuse ambient glow without hard borders or contours */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-200/40 via-teal-100/20 to-transparent dark:from-emerald-900/30 dark:via-teal-950/20 dark:to-transparent blur-md pointer-events-none" />

              {PUFF_GUIDE_IMAGES[currentStepIndex] ? (
                <motion.img
                  key={`puff-step-${currentStepIndex}`}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  src={PUFF_GUIDE_IMAGES[currentStepIndex]}
                  alt="Puff"
                  className="relative z-10 w-full h-full object-contain select-none pointer-events-none filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.18)]"
                />
              ) : (
                <svg viewBox="0 0 130 130" className="w-full h-full overflow-visible">
                <defs>
                  {/* Velvet Black Fur */}
                  <linearGradient id="skunkFur" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3f3f46" />
                    <stop offset="35%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </linearGradient>
                  {/* Pearly White Fur */}
                  <linearGradient id="skunkWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  {/* Rosy Pink */}
                  <linearGradient id="skunkPink" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                  {/* Sporty Mint Collar/Headband */}
                  <linearGradient id="skunkMint" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* ---------------------------------------------------- */}
                {/* 1. BIG FLUFFY SKUNK TAIL (THE ICONIC SKUNK FEATURE!) */}
                {/* ---------------------------------------------------- */}
                {currentStep.chibiPose === 'calm' ? (
                  // CALM POSE: Fluffy tail curled lovingly around the skunk like a warm blanket
                  <g>
                    <path
                      d="M 30,105 C 15,108 8,92 12,78 C 16,62 30,52 46,56 C 55,58 60,68 52,74 C 40,78 30,86 35,98 Z"
                      fill="url(#skunkFur)"
                    />
                    <path
                      d="M 28,102 C 18,102 14,90 18,78 C 22,66 34,60 44,62 C 34,68 28,78 30,94 Z"
                      fill="url(#skunkWhite)"
                    />
                  </g>
                ) : (
                  // ACTIVE POSES: Enormous fluffy tail arched high over the back!
                  <g>
                    {/* Tail main black fluff */}
                    <path
                      d="M 80,102 C 108,108 126,88 122,58 C 118,30 96,10 76,14 C 64,16 62,28 72,32 C 86,36 102,46 102,68 C 102,86 86,94 76,96 Z"
                      fill="url(#skunkFur)"
                      stroke="#09090b"
                      strokeWidth="1.5"
                    />
                    {/* Fluffy tail tuft spikes */}
                    <path d="M 120,48 Q 128,42 122,36 Q 124,30 116,26 Q 118,20 108,18" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    
                    {/* Iconic White Stripe on Tail */}
                    <path
                      d="M 84,98 C 104,100 114,82 112,60 C 110,38 92,20 78,22 C 86,26 98,38 98,58 C 98,78 86,88 80,94 Z"
                      fill="url(#skunkWhite)"
                    />
                    <path d="M 104,40 Q 112,34 106,30" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                    {/* Cute tail wagging motion lines */}
                    {(currentStep.chibiPose === 'waving' || currentStep.chibiPose === 'cheering') && (
                      <g opacity="0.8">
                        <path d="M 124,24 Q 130,30 126,38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M 128,44 Q 132,52 127,60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </g>
                    )}
                  </g>
                )}

                {/* ---------------------------------------------------- */}
                {/* 2. CHUBBY SKUNK BODY                                 */}
                {/* ---------------------------------------------------- */}
                {/* Rounded pear body */}
                <ellipse cx="60" cy="94" rx="24" ry="20" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.8" />
                
                {/* Soft Pearly White Chest Bib / Belly */}
                <path
                  d="M 50,82 C 50,82 60,86 70,82 C 72,98 68,110 60,111 C 52,110 48,98 50,82 Z"
                  fill="url(#skunkWhite)"
                />

                {/* Cute Little Feet / Paws */}
                <ellipse cx="44" cy="110" rx="9" ry="5.5" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.2" />
                <circle cx="44" cy="111" r="3" fill="#fda4af" opacity="0.75" />
                <ellipse cx="76" cy="110" rx="9" ry="5.5" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.2" />
                <circle cx="76" cy="111" r="3" fill="#fda4af" opacity="0.75" />

                {/* ---------------------------------------------------- */}
                {/* 3. CUTE EARS WITH PINK FLUFF                        */}
                {/* ---------------------------------------------------- */}
                {/* Left Ear */}
                <ellipse cx="36" cy="38" rx="9" ry="9" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.5" />
                <ellipse cx="36" cy="38" rx="5.5" ry="5.5" fill="url(#skunkPink)" />
                {/* Right Ear */}
                <ellipse cx="84" cy="38" rx="9" ry="9" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.5" />
                <ellipse cx="84" cy="38" rx="5.5" ry="5.5" fill="url(#skunkPink)" />

                {/* ---------------------------------------------------- */}
                {/* 4. CHUBBY SKUNK HEAD                                */}
                {/* ---------------------------------------------------- */}
                <ellipse cx="60" cy="56" rx="33" ry="28" fill="url(#skunkFur)" stroke="#09090b" strokeWidth="1.8" />

                {/* ICONIC WHITE STRIPE ON SKUNK HEAD (from forehead down to nose) */}
                <path
                  d="M 54,30 C 54,28 66,28 66,30 C 64,42 62,50 62,57 C 58,57 56,42 54,30 Z"
                  fill="url(#skunkWhite)"
                />
                {/* Forehead fluff tuft */}
                <path d="M 57,30 Q 60,20 63,30 Z" fill="#ffffff" />

                {/* Sporty FitWorld Mint Sweatband / Flower Band */}
                <path d="M 28,46 Q 60,36 92,46" stroke="url(#skunkMint)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <circle cx="60" cy="40" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                {/* Mini dumbbell icon on badge */}
                <path d="M 57.5,40 L 62.5,40" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />

                {/* ---------------------------------------------------- */}
                {/* 5. FACIAL FEATURES: BIG EYES, SNOUT & ROSY BLUSH    */}
                {/* ---------------------------------------------------- */}
                {/* Rosy anime blushing cheeks */}
                <ellipse cx="38" cy="65" rx="7.5" ry="4" fill="#ff70a6" opacity="0.65" />
                <ellipse cx="82" cy="65" rx="7.5" ry="4" fill="#ff70a6" opacity="0.65" />
                {/* Cute whiskers */}
                <path d="M 33,63 L 23,61" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 33,66 L 24,68" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 87,63 L 97,61" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 87,66 L 96,68" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />

                {/* Cute pink button nose */}
                <ellipse cx="60" cy="60" rx="3.5" ry="2.6" fill="url(#skunkPink)" stroke="#be123c" strokeWidth="0.8" />

                {/* Mouth & Expressions */}
                {currentStep.chibiPose === 'calm' ? (
                  // Sleeping peaceful eyes
                  <>
                    <path d="M 40,56 Q 47,50 54,56" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M 66,56 Q 73,50 80,56" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M 56,66 Q 60,69 64,66" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  // Big sparkling anime eyes
                  <>
                    {/* Left Eye */}
                    <ellipse cx="46" cy="54" rx="7.5" ry="9" fill="#09090b" />
                    <ellipse cx="46" cy="56" rx="6" ry="7" fill="#059669" />
                    <circle cx="48" cy="51" r="3" fill="#ffffff" />
                    <circle cx="44" cy="57" r="1.5" fill="#ffffff" />

                    {/* Right Eye */}
                    <ellipse cx="74" cy="54" rx="7.5" ry="9" fill="#09090b" />
                    <ellipse cx="74" cy="56" rx="6" ry="7" fill="#059669" />
                    <circle cx="76" cy="51" r="3" fill="#ffffff" />
                    <circle cx="72" cy="57" r="1.5" fill="#ffffff" />

                    {/* Happy anime eyebrows */}
                    <path d="M 41,45 Q 47,41 53,45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M 67,45 Q 73,41 79,45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

                    {/* Happy open smiling mouth */}
                    <path d="M 55,64 Q 60,73 65,64 Z" fill="#e11d48" stroke="#881337" strokeWidth="1" />
                    <path d="M 57,65 Q 60,68 63,65" fill="#fecdd3" />
                  </>
                )}

                {/* ---------------------------------------------------- */}
                {/* 6. DYNAMIC PAWS ACCORDING TO CURRENT POSE            */}
                {/* ---------------------------------------------------- */}
                {currentStep.chibiPose === 'waving' && (
                  <>
                    {/* Left paw resting on tummy */}
                    <ellipse cx="42" cy="92" rx="6" ry="6" fill="#18181b" stroke="#09090b" strokeWidth="1.4" />
                    <circle cx="42" cy="92" r="3" fill="#fda4af" opacity="0.8" />
                    {/* Right paw waving high with white tip! */}
                    <path d="M 76,86 Q 94,72 98,60" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="98" cy="58" r="6.5" fill="#ffffff" stroke="#09090b" strokeWidth="1.4" />
                    <circle cx="98" cy="58" r="3" fill="#fda4af" />
                    <path d="M 104,54 Q 109,58 107,64" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </>
                )}

                {currentStep.chibiPose === 'workout' && (
                  <>
                    {/* Left paw on tummy */}
                    <ellipse cx="42" cy="90" rx="6" ry="6" fill="#18181b" stroke="#09090b" strokeWidth="1.4" />
                    {/* Right paw holding cute turquoise dumbbell */}
                    <path d="M 76,86 Q 90,82 94,80" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="94" cy="78" r="6" fill="#ffffff" stroke="#09090b" strokeWidth="1.4" />
                    {/* Mini Dumbbell */}
                    <rect x="88" y="71" width="12" height="4" rx="1.5" fill="#334155" />
                    <circle cx="87" cy="73" r="3.5" fill="#0284c7" />
                    <circle cx="101" cy="73" r="3.5" fill="#0284c7" />
                  </>
                )}

                {currentStep.chibiPose === 'builder' && (
                  <>
                    {/* Left paw on chin/tummy */}
                    <ellipse cx="42" cy="90" rx="6" ry="6" fill="#18181b" stroke="#09090b" strokeWidth="1.4" />
                    {/* Right paw holding cute pencil */}
                    <path d="M 76,86 Q 92,78 94,70" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="94" cy="68" r="6" fill="#ffffff" stroke="#09090b" strokeWidth="1.4" />
                    <rect x="91" y="56" width="5" height="15" rx="1" fill="#f59e0b" transform="rotate(25 94 63)" />
                    <polygon points="97,52 100,57 95,56" fill="#e11d48" />
                  </>
                )}

                {currentStep.chibiPose === 'trophy' && (
                  <>
                    {/* Holding golden trophy with both paws */}
                    <path d="M 46,88 Q 52,82 56,80" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <path d="M 74,88 Q 68,82 64,80" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    {/* Golden Trophy Cup */}
                    <path d="M 54,75 L 66,75 L 63,85 L 57,85 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
                    <path d="M 52,76 Q 48,79 54,82" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
                    <path d="M 68,76 Q 72,79 66,82" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
                    <circle cx="60" cy="78" r="1.5" fill="#ffffff" />
                  </>
                )}

                {currentStep.chibiPose === 'calm' && (
                  <>
                    {/* Cute paws together in sweet rest */}
                    <circle cx="55" cy="88" r="5" fill="#18181b" stroke="#09090b" strokeWidth="1.2" />
                    <circle cx="65" cy="88" r="5" fill="#18181b" stroke="#09090b" strokeWidth="1.2" />
                    {/* Floating zen petal */}
                    <ellipse cx="60" cy="102" rx="9" ry="3.5" fill="#f472b6" opacity="0.65" />
                  </>
                )}

                {currentStep.chibiPose === 'cheering' && (
                  <>
                    {/* Both paws raised high in victory */}
                    <path d="M 44,86 Q 32,70 28,60" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <path d="M 76,86 Q 88,70 92,60" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <circle cx="28" cy="58" r="6" fill="#ffffff" stroke="#09090b" strokeWidth="1.4" />
                    <circle cx="92" cy="58" r="6" fill="#ffffff" stroke="#09090b" strokeWidth="1.4" />
                  </>
                )}
              </svg>
              )}
            </div>

            <span className="text-[11px] font-black tracking-wider text-slate-900 dark:text-emerald-200 uppercase bg-white/95 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-emerald-700 shadow-2xs -mt-1 font-['Quicksand'] flex items-center gap-1">
              <span>🐾</span> Puff
            </span>
          </div>

          {/* 2. COMIC SPEECH BALLOON ("FUMETTO") */}
          <div className="flex-1 bg-white dark:bg-[#1a2333] border-3 border-slate-900 dark:border-emerald-500/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)] relative">
            
            {/* Manga speech balloon pointer (tail) */}
            <div className="hidden sm:block absolute top-7 -left-3.5 w-4 h-4 bg-white dark:bg-[#1a2333] border-l-3 border-b-3 border-slate-900 dark:border-emerald-500/80 transform rotate-45" />
            <div className="sm:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#1a2333] border-t-3 border-l-3 border-slate-900 dark:border-emerald-500/80 transform rotate-45" />

            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 font-['Quicksand']">
              <span>{currentStep.title}</span>
            </h4>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
              {currentStep.speech}
            </p>

            {/* Tip box inside balloon */}
            <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2.5 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-emerald-900 dark:text-emerald-200 font-bold">
                {currentStep.tip}
              </p>
            </div>

            {/* If step relates to a specific tab, show quick navigation action */}
            {currentStep.tabKey && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Vuoi esplorarla subito?</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJumpToTab(currentStep.tabKey!);
                  }}
                  className="text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title={`Apri ${currentStep.tabLabel} e chiudi la guida`}
                >
                  <span>Vai a {currentStep.tabLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================================================== */}
        {/* BOTTOM ACTION BUTTONS & STEP DOTS                  */}
        {/* ================================================== */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          
          {/* Step dots */}
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  if (steps[idx].tabKey && onNavigateTab) {
                    onNavigateTab(steps[idx].tabKey!);
                  }
                }}
                className={`transition-all rounded-full ${
                  idx === currentStepIndex
                    ? 'w-6 h-2 bg-emerald-500'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Vai al passo ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Indietro
              </button>
            )}

            <button
              onClick={handleFinish}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Salta
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              {isLast ? (
                <>
                  <Check className="w-4 h-4" /> Ho capito, iniziamo!
                </>
              ) : (
                <>
                  <span>Avanti</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
