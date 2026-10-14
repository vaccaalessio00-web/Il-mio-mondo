import React, { useState, useEffect, useRef } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { CHIBI_COACH_ENGFA, ENGFA_QUOTES, CHIBI_FRIEND_CHARLOTTE, CHARLOTTE_QUOTES, CHIBI_BOYFRIEND_PUZZOLA, PUZZOLA_QUOTES, CHIBI_DOG_GYO, GYO_QUOTES, CHIBI_RABBIT_PHALO, PHALO_QUOTES, CHIBI_TOFU_MASCOT, TOFU_QUOTES, CHIBI_DOG_DOBBY, DOBBY_QUOTES, CHIBI_RABBIT_KRAPRAO, KRAPRAO_QUOTES } from '../../assets/mascot';
import { Sparkles, RefreshCw, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ChibiMascotBadgeProps {
  customMessage?: string;
  compact?: boolean;
}

const SingleLineScrollingQuote: React.FC<{ text: string; isSpecial: boolean }> = ({ text, isSpecial }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowDistance, setOverflowDistance] = useState(0);

  useEffect(() => {
    const calculate = () => {
      if (containerRef.current && textRef.current) {
        const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
        setOverflowDistance(diff > 4 ? diff + 12 : 0);
      }
    };
    calculate();
    const timer = setTimeout(calculate, 150);
    window.addEventListener('resize', calculate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculate);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0 overflow-hidden relative select-none py-0.5"
      style={{
        maskImage: overflowDistance > 0 
          ? 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)' 
          : 'none',
        WebkitMaskImage: overflowDistance > 0 
          ? 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)' 
          : 'none',
      }}
    >
      <motion.div
        key={text}
        animate={overflowDistance > 0 ? { x: [0, -overflowDistance, 0] } : { x: 0 }}
        transition={
          overflowDistance > 0
            ? {
                duration: Math.max(5.5, overflowDistance / 18),
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }
            : { duration: 0 }
        }
        className="inline-block whitespace-nowrap"
      >
        <span
          ref={textRef}
          className={`text-xs ${
            isSpecial ? 'text-white font-bold' : 'text-slate-700 dark:text-slate-100'
          } font-semibold leading-normal inline-block whitespace-nowrap`}
        >
          "{text}"
        </span>
      </motion.div>
    </div>
  );
};

const getLevelTitle = (level: number) => {
  if (level >= 10) return 'Leggenda del Fitness';
  if (level >= 7) return 'Atleta Pro';
  if (level >= 4) return 'Appassionato';
  return 'Principiante';
};

interface CoachTheme {
  gradient: string;
  border: string;
  badgeBg: string;
  nameSpan: string;
  button: string;
  xpBar: string;
  modalCard: string;
}

// 8 totally distinct color themes for each coach/mascot
const COACH_THEMES: Record<string, CoachTheme> = {
  // Puzzola: Blue Sapphire (kept blue as explicitly requested)
  blue: {
    gradient: 'from-blue-50 via-blue-100 to-blue-50 dark:from-[#0f1d33] dark:via-[#162a4a] dark:to-[#0d182b]',
    border: 'border-blue-200 dark:border-blue-700/60',
    badgeBg: 'bg-blue-600 dark:bg-blue-500',
    nameSpan: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950/80 dark:border dark:border-blue-800/60',
    button: 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200',
    xpBar: 'bg-blue-500 dark:bg-blue-400',
    modalCard: 'border-blue-200 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-400 bg-blue-50/60 dark:bg-blue-950/30'
  },
  // Charlotte: Pastel Rose Pink
  pink: {
    gradient: 'from-pink-50 via-pink-100 to-pink-50 dark:from-[#2a1324] dark:via-[#3b1932] dark:to-[#220f1c]',
    border: 'border-pink-200 dark:border-pink-700/60',
    badgeBg: 'bg-pink-600 dark:bg-pink-500',
    nameSpan: 'text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-950/80 dark:border dark:border-pink-800/60',
    button: 'text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-200',
    xpBar: 'bg-pink-500 dark:bg-pink-400',
    modalCard: 'border-pink-200 dark:border-pink-800/50 hover:border-pink-400 dark:hover:border-pink-400 bg-pink-50/60 dark:bg-pink-950/30'
  },
  // Coach Engfa: Modern Slate Graphite
  slate: {
    gradient: 'from-slate-50 via-slate-100 to-slate-50 dark:from-[#151d2a] dark:via-[#1e293b] dark:to-[#121924]',
    border: 'border-slate-300 dark:border-slate-700/60',
    badgeBg: 'bg-slate-700 dark:bg-slate-600',
    nameSpan: 'text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-800/90 dark:border dark:border-slate-700/60',
    button: 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
    xpBar: 'bg-slate-600 dark:bg-slate-400',
    modalCard: 'border-slate-200 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-400 bg-slate-50/60 dark:bg-slate-900/40'
  },
  // Gyo: Warm Amber Honey
  amber: {
    gradient: 'from-amber-50 via-amber-100 to-amber-50 dark:from-[#291e0f] dark:via-[#3a2914] dark:to-[#20170b]',
    border: 'border-amber-200 dark:border-amber-700/60',
    badgeBg: 'bg-amber-600 dark:bg-amber-500',
    nameSpan: 'text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/80 dark:border dark:border-amber-800/60',
    button: 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200',
    xpBar: 'bg-amber-500 dark:bg-amber-400',
    modalCard: 'border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-400 bg-amber-50/60 dark:bg-amber-950/30'
  },
  // Tofu: Fresh Emerald Mint
  emerald: {
    gradient: 'from-emerald-50 via-emerald-100 to-emerald-50 dark:from-[#0d261e] dark:via-[#13382c] dark:to-[#0a1e17]',
    border: 'border-emerald-200 dark:border-emerald-700/60',
    badgeBg: 'bg-emerald-600 dark:bg-emerald-500',
    nameSpan: 'text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/80 dark:border dark:border-emerald-800/60',
    button: 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200',
    xpBar: 'bg-emerald-500 dark:bg-emerald-400',
    modalCard: 'border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30'
  },
  // Phalo: Cool Cyan Aqua
  cyan: {
    gradient: 'from-cyan-50 via-cyan-100 to-cyan-50 dark:from-[#0f242d] dark:via-[#163642] dark:to-[#0c1c24]',
    border: 'border-cyan-200 dark:border-cyan-700/60',
    badgeBg: 'bg-cyan-600 dark:bg-cyan-500',
    nameSpan: 'text-cyan-800 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-950/80 dark:border dark:border-cyan-800/60',
    button: 'text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200',
    xpBar: 'bg-cyan-500 dark:bg-cyan-400',
    modalCard: 'border-cyan-200 dark:border-cyan-800/50 hover:border-cyan-400 dark:hover:border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/30'
  },
  // Dobby: Warm Coral Orange
  orange: {
    gradient: 'from-orange-50 via-orange-100 to-orange-50 dark:from-[#2c160e] dark:via-[#3e1f13] dark:to-[#22100a]',
    border: 'border-orange-200 dark:border-orange-700/60',
    badgeBg: 'bg-orange-600 dark:bg-orange-500',
    nameSpan: 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-950/80 dark:border dark:border-orange-800/60',
    button: 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200',
    xpBar: 'bg-orange-500 dark:bg-orange-400',
    modalCard: 'border-orange-200 dark:border-orange-800/50 hover:border-orange-400 dark:hover:border-orange-400 bg-orange-50/60 dark:bg-orange-950/30'
  },
  // Kraprao: Lavender Purple
  purple: {
    gradient: 'from-purple-50 via-purple-100 to-purple-50 dark:from-[#21112e] dark:via-[#311845] dark:to-[#190d24]',
    border: 'border-purple-200 dark:border-purple-700/60',
    badgeBg: 'bg-purple-600 dark:bg-purple-500',
    nameSpan: 'text-purple-800 bg-purple-100 dark:text-purple-300 dark:bg-purple-950/80 dark:border dark:border-purple-800/60',
    button: 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200',
    xpBar: 'bg-purple-500 dark:bg-purple-400',
    modalCard: 'border-purple-200 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-400 bg-purple-50/60 dark:bg-purple-950/30'
  }
};

export const ChibiMascotBadge: React.FC<ChibiMascotBadgeProps> = ({ customMessage, compact = false }) => {
  const { profile, measurements } = useWorkout();
  const isSecretRewardUnlocked = measurements.some(m => m.weightKg > 42);
  const [specialQuoteShown, setSpecialQuoteShown] = useState(() => localStorage.getItem('special_quote_shown') === 'true');
  const [showCoachModal, setShowCoachModal] = useState(false);

  const getAvailableTypes = (level: number): ('engfa' | 'charlotte' | 'puzzola' | 'gyo' | 'phalo' | 'tofu' | 'dobby' | 'kraprao')[] => {
    const types: ('engfa' | 'charlotte' | 'puzzola' | 'gyo' | 'phalo' | 'tofu' | 'dobby' | 'kraprao')[] = ['puzzola', 'gyo'];
    if (level >= 2) types.push('charlotte', 'phalo');
    if (level >= 3) types.push('engfa', 'tofu');
    if (level >= 4) types.push('dobby', 'kraprao');
    return types;
  };

  type CoachId = 'engfa' | 'charlotte' | 'puzzola' | 'gyo' | 'phalo' | 'tofu' | 'dobby' | 'kraprao';

  const [coachType, setCoachType] = useState<CoachId | 'random'>(() => {
    return (sessionStorage.getItem('fitworld_coach_type') as any) || 'random';
  });

  // Stato per il coach casuale stabile: NON cambia quando si completa una missione o si aggiornano gli XP
  const [randomCoach, setRandomCoach] = useState<CoachId>(() => {
    const saved = sessionStorage.getItem('fitworld_active_random_coach') as CoachId | null;
    const available = getAvailableTypes(profile.level);
    if (saved && available.includes(saved)) return saved;
    return available[Math.floor(Math.random() * available.length)];
  });

  const [quoteIdx, setQuoteIdx] = useState(0);

  // Il coach cambia SOLO ogni tot minuti (1-2 minuti variabili) quando è attiva la modalità casuale
  useEffect(() => {
    if (coachType !== 'random') return;

    let timerId: number;

    const scheduleNextRotation = () => {
      // Intervallo variabile tra 1 e 2 minuti (60.000 ms - 120.000 ms)
      const randomIntervalMs = 60000 + Math.random() * 60000;

      timerId = window.setTimeout(() => {
        setRandomCoach(prev => {
          const available = getAvailableTypes(profile.level);
          const candidates = available.length > 1 ? available.filter(c => c !== prev) : available;
          const next = candidates[Math.floor(Math.random() * candidates.length)];
          try {
            sessionStorage.setItem('fitworld_active_random_coach', next);
          } catch {}
          return next;
        });
        setQuoteIdx(0);
        scheduleNextRotation();
      }, randomIntervalMs);
    };

    scheduleNextRotation();

    return () => {
      clearTimeout(timerId);
    };
  }, [coachType, profile.level]);

  // Seleziona il coach effettivo: stabile in state, non ricalcolato ad ogni render
  const currentCoach: CoachId = coachType === 'random' ? randomCoach : coachType;

  useEffect(() => {
    const available = getAvailableTypes(profile.level);
    if (coachType !== 'random' && !available.includes(coachType as any)) {
      setCoachType('random');
      sessionStorage.setItem('fitworld_coach_type', 'random');
    }
  }, [profile.level, coachType]);

  const getCoachData = (type: 'engfa' | 'charlotte' | 'puzzola' | 'gyo' | 'phalo' | 'tofu' | 'dobby' | 'kraprao') => {
    const saved = localStorage.getItem('fitworld_custom_mascots');
    const customUrls = saved ? JSON.parse(saved) : {};
    
    let mascotUrl;
    let quotes;
    let name;
    let themeKey = 'slate';

    switch (type) {
      case 'puzzola': { quotes = PUZZOLA_QUOTES; mascotUrl = CHIBI_BOYFRIEND_PUZZOLA; name = 'Puzzola'; themeKey = 'blue'; break; }
      case 'charlotte': { quotes = CHARLOTTE_QUOTES; mascotUrl = CHIBI_FRIEND_CHARLOTTE; name = 'Charlotte'; themeKey = 'pink'; break; }
      case 'gyo': { quotes = GYO_QUOTES; mascotUrl = CHIBI_DOG_GYO; name = 'Gyo'; themeKey = 'amber'; break; }
      case 'tofu': { quotes = TOFU_QUOTES; mascotUrl = CHIBI_TOFU_MASCOT; name = 'Tofu'; themeKey = 'emerald'; break; }
      case 'phalo': { quotes = PHALO_QUOTES; mascotUrl = CHIBI_RABBIT_PHALO; name = 'Phalo'; themeKey = 'cyan'; break; }
      case 'dobby': { quotes = DOBBY_QUOTES; mascotUrl = CHIBI_DOG_DOBBY; name = 'Dobby'; themeKey = 'orange'; break; }
      case 'kraprao': { quotes = KRAPRAO_QUOTES; mascotUrl = CHIBI_RABBIT_KRAPRAO; name = 'Kraprao'; themeKey = 'purple'; break; }
      default: { quotes = ENGFA_QUOTES; mascotUrl = CHIBI_COACH_ENGFA; name = 'Coach Engfa'; themeKey = 'slate'; break; }
    }

    return { 
        quotes, 
        mascot: customUrls[type] || mascotUrl, 
        name, 
        themeKey,
        theme: COACH_THEMES[themeKey] || COACH_THEMES.blue
    };
  };

  const { quotes, mascot, name, theme } = getCoachData(currentCoach);

  const nextQuote = () => setQuoteIdx((prev) => (prev + 1) % quotes.length);

  let message = customMessage || quotes[quoteIdx];
  let isSpecialQuote = false;

  if (currentCoach === 'puzzola' && isSecretRewardUnlocked && !specialQuoteShown) {
    message = "parla col tuo amore, hai raggiunto un grande obbiettivo";
    isSpecialQuote = true;
    setSpecialQuoteShown(true);
    localStorage.setItem('special_quote_shown', 'true');
  }

  const selectCoach = (type: 'engfa' | 'charlotte' | 'puzzola' | 'gyo' | 'phalo' | 'tofu' | 'dobby' | 'kraprao' | 'random') => {
    setCoachType(type);
    sessionStorage.setItem('fitworld_coach_type', type);
    setShowCoachModal(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-full">
      <div className={`relative overflow-hidden w-full max-w-full bg-gradient-to-r ${theme.gradient} ${isSecretRewardUnlocked ? 'border-amber-400' : theme.border} border rounded-3xl p-3 sm:p-3.5 shadow-sm`}>
        <div className="flex items-center gap-3 sm:gap-3.5">
          <button onClick={() => setShowCoachModal(true)} className="relative shrink-0 outline-hidden cursor-pointer" title="Scegli il tuo Coach">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
              <img src={mascot} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <span className={`absolute -bottom-1 -right-1 ${theme.badgeBg} text-white p-1 rounded-full text-[10px] shadow-xs`}>
              <Sparkles className="w-3 h-3" />
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className={`text-[11px] font-bold tracking-wide uppercase ${theme.nameSpan} px-2 py-0.5 rounded-full`}>{name}</span>
              <button onClick={nextQuote} title="Altro consiglio" className={`${theme.button} p-1 rounded-lg transition-colors cursor-pointer outline-hidden`}><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
            <div className="w-full min-w-0">
              <SingleLineScrollingQuote text={message} isSpecial={isSpecialQuote} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1 items-center w-full max-w-full">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#162236] border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full w-full">
          <span>Livello {profile.level} • {getLevelTitle(profile.level)}</span>
          <span className="text-emerald-600 dark:text-emerald-400">{profile.xp} XP</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-[90%] mx-auto">
          <div className={`h-full ${theme.xpBar} transition-all duration-300`} style={{ width: `${(profile.xp / (profile.level >= 10 ? 999 : profile.level * 8)) * 100}%` }} />
        </div>
      </div>

      {showCoachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-hidden animate-fadeIn">
          <div className="bg-white dark:bg-[#152236] rounded-3xl p-4 sm:p-5 w-full max-w-[calc(100vw-24px)] sm:max-w-sm max-h-[85vh] flex flex-col border border-slate-100 dark:border-slate-700/60 shadow-2xl animate-scaleUp overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-700/60 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                  Scegli il tuo Coach
                </h3>
              </div>
              <button
                onClick={() => setShowCoachModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-hidden"
                title="Chiudi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Coach Grid with contained inset borders */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 overflow-y-auto p-1.5 pr-2 max-h-[62vh]">
              {getAvailableTypes(profile.level).map(t => {
                const data = getCoachData(t);
                const isCurrent = coachType === t;
                return (
                  <button
                    key={t}
                    onClick={() => selectCoach(t)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer outline-hidden ${data.theme.modalCard} ${
                      isCurrent ? 'ring-2 ring-inset ring-emerald-500 border-emerald-500 dark:border-emerald-400 shadow-xs' : ''
                    }`}
                  >
                    <div className="relative">
                      <img src={data.mascot} alt={data.name} className="w-14 h-14 rounded-full object-cover shadow-xs border-2 border-white dark:border-slate-800" />
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                      {data.name}
                    </span>
                  </button>
                );
              })}

              {(() => {
                const isRandomSelected = coachType === 'random';
                return (
                  <button
                    onClick={() => selectCoach('random')}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer outline-hidden ${
                      isRandomSelected
                        ? 'ring-2 ring-inset ring-emerald-500 border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                        : 'border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 rounded-full border-2 border-white dark:border-slate-800">
                        <RefreshCw className="w-6 h-6" />
                      </div>
                      {isRandomSelected && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300">
                      Casuale
                    </span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
