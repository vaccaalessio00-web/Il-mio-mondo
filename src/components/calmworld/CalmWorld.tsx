import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { soundManager } from '../../utils/sound';
import { AnxietyJournal } from './AnxietyJournal';
import { ChromaticSieve } from './ChromaticSieve';
import { FloatingLanterns } from './FloatingLanterns';
import { IlGomitolo } from './IlGomitolo';
import { LuminescentSlate } from './LuminescentSlate';
import { PassoPassoNinni } from './PassoPassoNinni';
import { IlGiardinoMimmi } from './IlGiardinoMimmi';
import { LaBottegaDiPapa } from './LaBottegaDiPapa';
import { MagiCosaFai } from './MagiCosaFai';
import { BaciniAVolonta } from './BaciniAVolonta';
import { IleInAzione } from './IleInAzione';
import { OraOraGame } from './OraOraGame';

export const CalmWorld: React.FC = () => {
  const { anxietyJournalEntries, setAnxietyJournalEntries } = useWorkout();
  const [showJournal, setShowJournal] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showLanternsGame, setShowLanternsGame] = useState(false);
  const [showGomitoloGame, setShowGomitoloGame] = useState(false);
  const [showSlateGame, setShowSlateGame] = useState(false);
  const [showNinniGame, setShowNinniGame] = useState(false);
  const [showMimmiGame, setShowMimmiGame] = useState(false);
  const [showPapaGame, setShowPapaGame] = useState(false);
  const [showMagiGame, setShowMagiGame] = useState(false);
  const [showBaciniGame, setShowBaciniGame] = useState(false);
  const [showIleGame, setShowIleGame] = useState(false);
  const [showOraOraGame, setShowOraOraGame] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [clickCounts, setClickCounts] = useState<Record<string, {count: number, timer: number}>>({});

  const handleDeleteClick = (id: string) => {
    const current = clickCounts[id] || { count: 0, timer: 0 };
    if (current.timer) clearTimeout(current.timer);

    const newCount = current.count + 1;
    if (newCount === 3) {
      setAnxietyJournalEntries(prev => prev.filter(e => e.id !== id));
      setClickCounts(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      const timer = window.setTimeout(() => {
        setClickCounts(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 1000);
      setClickCounts(prev => ({ ...prev, [id]: { count: newCount, timer } }));
    }
  };

  // Breathing state
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const [breathingStep, setBreathingStep] = useState<number | null>(null); // 0: In, 1: Hold, 2: Out
  const [repetitions, setRepetitions] = useState(0);
  const timerRef = useRef<number | null>(null);

  const stopBreathing = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    setBreathingStep(null);
    setRepetitions(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    soundManager.stopBreathSounds();
  };

  const startBreathing = () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsRunning(true);
    setRepetitions(0);
    runCycle(0);
  };

  const runCycle = (count: number) => {
    if (!isRunningRef.current) return;
    if (count >= 5) {
      stopBreathing();
      return;
    }

    setRepetitions(count + 1);

    // Inhale 4s
    setBreathingStep(0);
    soundManager.playBreathIn();
    
    timerRef.current = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      // Hold 5s
      setBreathingStep(1);
      soundManager.playBreathHold();
      timerRef.current = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        // Exhale 8s
        setBreathingStep(2);
        soundManager.playBreathOut();
        timerRef.current = window.setTimeout(() => {
          if (!isRunningRef.current) return;
          runCycle(count + 1);
        }, 8000);
      }, 5000);
    }, 4000);
  };

  // Halt breathing exercise if any modal opens
  useEffect(() => {
    if (showJournal || showGame || showLanternsGame || showGomitoloGame || showSlateGame || showNinniGame || showMimmiGame || showPapaGame || showMagiGame || showBaciniGame || showIleGame || showOraOraGame) {
      stopBreathing();
    }
  }, [showJournal, showGame, showLanternsGame, showGomitoloGame, showSlateGame, showNinniGame, showMimmiGame, showPapaGame, showMagiGame, showBaciniGame, showIleGame, showOraOraGame]);

  // Halt breathing exercise on unmount or tab switch/visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopBreathing();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopBreathing();
    };
  }, []);

  const getBreathingText = () => {
    if (breathingStep === 0) return 'Inspira';
    if (breathingStep === 1) return 'Trattieni';
    if (breathingStep === 2) return 'Espira';
    return 'Tocca per iniziare';
  };

  return (
    <div className="space-y-6 pb-28 p-4">
      {/* Breathing Exercise */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs text-center space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Respirazione Guidata</h3>
        
        {/* Animated Breathing Circle */}
        <div className="w-40 h-40 mx-auto relative flex items-center justify-center">
            <motion.div
                className="bg-gradient-to-tr from-emerald-300 to-sky-300 rounded-full shadow-lg cursor-pointer"
                onClick={isRunning ? stopBreathing : startBreathing}
                initial={{ width: '80px', height: '80px' }}
                animate={{
                    width: breathingStep === 0 ? '160px' : (breathingStep === 1 ? '160px' : '80px'),
                    height: breathingStep === 0 ? '160px' : (breathingStep === 1 ? '160px' : '80px'),
                }}
                transition={{
                    duration: breathingStep === 0 ? 4 : (breathingStep === 1 ? 5 : 8),
                    ease: "easeInOut"
                }}
            />
        </div>
        
        <p onClick={isRunning ? stopBreathing : startBreathing} className="text-lg font-extrabold text-sky-700 cursor-pointer">{getBreathingText()}</p>
        {isRunning && <p className="text-sm text-slate-500">Ciclo: {repetitions} / 5</p>}
      </div>

      {/* Anxiety Journal */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-emerald-900">Diario Anti-Ansia</h3>
        <button
          onClick={() => setShowJournal(true)}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
        >
          <Sparkles className="w-4 h-4" /> Apri Diario
        </button>
      </div>

      {/* Minigiochi: disposti su righe da 3 nel nuovo ordine richiesto */}
      <div id="minigiochi-section" className="bg-white p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800 font-['Quicksand']">
              Minigiochi Rilassanti
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            11 giochi
          </span>
        </div>

        {/* Griglia su righe da 3: 1. Bacini, 2. Ora Ora, 3. Ninni, 4. Ile, 5. Magi, 6. Mimmi, 7. Mari, 8. Papa e poi gli altri */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* 1. Bacini a volontà */}
          <button
            onClick={() => setShowBaciniGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fdf2f8] to-[#fce7f3] hover:from-[#fce7f3] hover:to-[#fbcfe8] text-[#831843] border border-[#fbcfe8] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">❤️</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Bacini a volontà</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-pink-700 font-semibold mt-0.5 opacity-80 truncate max-w-full">Coccole & Baci</span>
          </button>

          {/* 2. Ora, Ora ! */}
          <button
            onClick={() => setShowOraOraGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fff1f2] to-[#ffe4e6] hover:from-[#ffe4e6] hover:to-[#fecdd3] text-[#9f1239] border border-[#fecdd3] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">👀</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Ora, Ora !</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-rose-700 font-semibold mt-0.5 opacity-80 truncate max-w-full">Tempismo & Baci</span>
          </button>

          {/* 3. Passo dopo Passo */}
          <button
            onClick={() => setShowNinniGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#edf8ee] to-[#d8eedb] hover:from-[#d8eedb] hover:to-[#c4e5c8] text-[#1c4d29] border border-[#bcdcb8] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🦴</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Passo dopo Passo</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#327a45] font-semibold mt-0.5 opacity-80 truncate max-w-full">Cane Ninni</span>
          </button>

          {/* 4. Ile in azione */}
          <button
            onClick={() => setShowIleGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd] hover:from-[#bae6fd] hover:to-[#7dd3fc] text-[#0369a1] border border-[#38bdf8] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🚓</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Ile in azione</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#0284c7] font-semibold mt-0.5 opacity-80 truncate max-w-full">Ronda & Città</span>
          </button>

          {/* 5. Magi, cosa fai?! */}
          <button
            onClick={() => setShowMagiGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#edf8ff] to-[#e0f2fe] hover:from-[#e0f2fe] hover:to-[#bae6fd] text-[#0369a1] border border-[#7dd3fc] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🛁</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Magi, cosa fai?!</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#0284c7] font-semibold mt-0.5 opacity-80 truncate max-w-full">Bagno & Tattoo</span>
          </button>

          {/* 6. Il Giardino di Mimmi */}
          <button
            onClick={() => setShowMimmiGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fef0ee] to-[#fae1dd] hover:from-[#fae1dd] hover:to-[#f7d3cc] text-[#703b30] border border-[#f3c6be] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🌸</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Il Giardino Mimmi</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#9e5344] font-semibold mt-0.5 opacity-80 truncate max-w-full">Fiori & Calma</span>
          </button>

          {/* 7. I Colori di Mari (Setaccio Cromatico) */}
          <button
            onClick={() => setShowGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#f3f0fb] to-[#e6e1f9] hover:from-[#e6e1f9] hover:to-[#dad2f5] text-[#433878] border border-[#d6ccf5] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🎨</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">I Colori di Mari</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#6d5ea6] font-semibold mt-0.5 opacity-80 truncate max-w-full">Setaccio Colori</span>
          </button>

          {/* 8. La Bottega di Papà */}
          <button
            onClick={() => setShowPapaGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fdf6ec] to-[#faedd9] hover:from-[#faedd9] hover:to-[#f5e0be] text-[#6d3e18] border border-[#ebd0ab] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🪵</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">La Bottega di Papà</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#a66224] font-semibold mt-0.5 opacity-80 truncate max-w-full">Legno & Intaglio</span>
          </button>

          {/* 9. La Lavagna a Scomparsa */}
          <button
            onClick={() => setShowSlateGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#edf2f7] to-[#dce4ec] hover:from-[#dce4ec] hover:to-[#ccd8e3] text-[#243b53] border border-[#c4d2df] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🖋️</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Lavagna Zen</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-slate-500 font-semibold mt-0.5 opacity-80 truncate max-w-full">Tracci a Scomparsa</span>
          </button>

          {/* 10. Il Gomitolo */}
          <button
            onClick={() => setShowGomitoloGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fdeeee] to-[#fad2cf] hover:from-[#fad2cf] hover:to-[#f7bcba] text-[#732622] border border-[#f2b5b0] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🧶</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Il Gomitolo</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#9e3a34] font-semibold mt-0.5 opacity-80 truncate max-w-full">Sbroglia il Filo</span>
          </button>

          {/* 11. Lampade Galleggianti */}
          <button
            onClick={() => setShowLanternsGame(true)}
            className="group flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#fef4ec] to-[#fde8d7] hover:from-[#fde8d7] hover:to-[#fbd7be] text-[#784318] border border-[#f7d0b3] shadow-2xs hover:shadow-sm active:scale-95 transition-all min-h-[88px] sm:min-h-[98px] cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">🏮</span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-extrabold leading-tight text-center line-clamp-2">Lanterne Zen</span>
            <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-[#a36329] font-semibold mt-0.5 opacity-80 truncate max-w-full">Luce & Flusso</span>
          </button>
        </div>
      </div>

      {showJournal && (
        <AnxietyJournal 
            onClose={() => {
                setShowJournal(false);
                setEditingEntry(null);
            }} 
            initialData={editingEntry}
        />
      )}

      {showGame && <ChromaticSieve onClose={() => setShowGame(false)} />}
      {showLanternsGame && <FloatingLanterns onClose={() => setShowLanternsGame(false)} />}
      {showGomitoloGame && <IlGomitolo onClose={() => setShowGomitoloGame(false)} />}
      {showSlateGame && <LuminescentSlate onClose={() => setShowSlateGame(false)} />}
      {showNinniGame && <PassoPassoNinni onClose={() => setShowNinniGame(false)} />}
      {showMimmiGame && <IlGiardinoMimmi onClose={() => setShowMimmiGame(false)} />}
      {showPapaGame && <LaBottegaDiPapa onClose={() => setShowPapaGame(false)} />}
      {showMagiGame && <MagiCosaFai onClose={() => setShowMagiGame(false)} />}
      {showBaciniGame && <BaciniAVolonta onClose={() => setShowBaciniGame(false)} />}
      {showIleGame && <IleInAzione onClose={() => setShowIleGame(false)} />}
      {showOraOraGame && <OraOraGame onClose={() => setShowOraOraGame(false)} />}

      {/* List of Anxiety Journal Entries */}
      {anxietyJournalEntries.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 mt-6">I tuoi diari passati</h3>
              {anxietyJournalEntries.map(entry => (
                  <div key={entry.id} className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-emerald-900">{entry.area || 'Nessuna area'}</p>
                        <p className="text-xs text-emerald-700 truncate">{entry.pensiero}</p>
                        <span className="text-[10px] text-emerald-400">{entry.date}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditingEntry(entry); setShowJournal(true); }} className="text-emerald-500"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleDeleteClick(entry.id)} className={`text-rose-400 ${(clickCounts[entry.id]?.count || 0) > 0 ? 'scale-125' : ''}`}>
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
