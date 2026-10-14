import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import { MARI_CUSTOM_IMAGE } from '../../assets/minigames';

const PALETTES = [
  { name: 'Lilla Profumato', h: 270, s: 45 },
  { name: 'Blu Polvere', h: 210, s: 40 },
  { name: 'Verde Salvia', h: 152, s: 38 },
  { name: 'Pesca Caldo', h: 26, s: 50 },
  { name: 'Rosa Cipria', h: 338, s: 42 },
  { name: 'Ambra Dorata', h: 42, s: 52 },
  { name: 'Acquamarina', h: 180, s: 42 },
  { name: 'Lavanda Chiaro', h: 285, s: 44 },
];

export const ChromaticSieve: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Natural level progression (Livello 1 -> 1 riga, Livello 2 -> 2 righe, etc.)
  const [level, setLevel] = useState<number>(1);
  const numRows = Math.min(4, Math.max(1, level));

  const [rowPalettes, setRowPalettes] = useState(() => [...PALETTES].sort(() => Math.random() - 0.5));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [mariQuote, setMariQuote] = useState<string>(
    '«Riordinare i colori dal più chiaro al più scuro aiuta la nostra mente a trovare calma e serenità, amica mia ✨»'
  );

  const generateLevelColors = (rows: number) => {
    const countPerRow = 6;
    const newColors = [];
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < countPerRow; i++) {
        newColors.push({
          id: r * countPerRow + i,
          row: r,
          l: 24 + (i * (56 / (countPerRow - 1))),
          completed: false,
        });
      }
    }
    const shuffledColors = [];
    for (let r = 0; r < rows; r++) {
      const rowItems = newColors.filter(c => c.row === r).sort(() => Math.random() - 0.5);
      shuffledColors.push(...rowItems);
    }
    return shuffledColors;
  };

  const [colors, setColors] = useState(() => generateLevelColors(1));

  const advanceToNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setComplete(false);
    setSelectedId(null);
    setRowPalettes([...PALETTES].sort(() => Math.random() - 0.5));
    const nextRows = Math.min(4, Math.max(1, nextLevel));
    setColors(generateLevelColors(nextRows));
    setMariQuote(`«Bravissima, cara! Ora siamo al Livello ${nextLevel}: nuova armonia cromatica per noi ✨»`);
  };

  const restartCurrentLevel = () => {
    setComplete(false);
    setSelectedId(null);
    setRowPalettes([...PALETTES].sort(() => Math.random() - 0.5));
    setColors(generateLevelColors(numRows));
    setMariQuote('«Rimescoliamo le tessere, cara! Rilassati e segui il flusso delle sfumature con me ✨»');
  };

  const checkOrder = (newColors: typeof colors) => {
    let allCompleted = true;
    let newlyCompletedRows = 0;

    const prevCompletedRows = new Set<number>();
    for (let r = 0; r < numRows; r++) {
      const rowItems = colors.filter(c => c.row === r);
      if (rowItems.length > 0 && rowItems.every(c => c.completed)) {
        prevCompletedRows.add(r);
      }
    }

    const updatedColors = newColors.map(colorItem => {
      if (colorItem.completed) return colorItem;

      const rowItems = newColors.filter(c => c.row === colorItem.row);
      const sortedAsc = [...rowItems].sort((a, b) => a.l - b.l);
      const sortedDesc = [...sortedAsc].slice().reverse();

      const isAsc = rowItems.every((c, i) => c.l === sortedAsc[i].l);
      const isDesc = rowItems.every((c, i) => c.l === sortedDesc[i].l);

      if (isAsc || isDesc) {
        return { ...colorItem, completed: true };
      }
      allCompleted = false;
      return colorItem;
    });

    for (let r = 0; r < numRows; r++) {
      const rowItems = updatedColors.filter(c => c.row === r);
      if (rowItems.length > 0 && rowItems.every(c => c.completed)) {
        if (!prevCompletedRows.has(r)) {
          newlyCompletedRows++;
        }
      } else {
        allCompleted = false;
      }
    }

    setColors(updatedColors);

    if (allCompleted) {
      setComplete(true);
      setMariQuote(`«Tutto in perfetto ordine cromatico! Livello ${level} superato con successo, sei bravissima cara! Grazie di cuore 💖»`);
      soundManager.playSieveComplete();
      setTimeout(advanceToNextLevel, 2200);
    } else if (newlyCompletedRows > 0 && numRows > 1) {
      setMariQuote('«Che meraviglia, tesoro! Questa riga adesso è in perfetta armonia ✨»');
      soundManager.playSieveRowComplete();
    }
  };

  // Scambio immediato con 1 solo click: clicchi la prima, clicchi la seconda e si scambiano di posto!
  const handleColorClick = (clickedId: number) => {
    if (complete) return;
    const clickedItem = colors.find(c => c.id === clickedId);
    if (!clickedItem) return;

    if (selectedId === null) {
      // 1° Click: seleziona la prima tessera all'istante
      setSelectedId(clickedId);
      soundManager.playTick();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    } else if (selectedId === clickedId) {
      // Cliccato di nuovo sulla stessa: deseleziona
      setSelectedId(null);
      soundManager.playTick();
    } else {
      // 2° Click: scambia di posto con la prima tessera selezionata CON UN SOLO CLICK!
      const firstItem = colors.find(c => c.id === selectedId);
      if (!firstItem) {
        setSelectedId(clickedId);
        soundManager.playTick();
        return;
      }

      // Se appartengono alla stessa riga: scambio immediato di posizione
      if (firstItem.row === clickedItem.row) {
        const idxA = colors.findIndex(c => c.id === selectedId);
        const idxB = colors.findIndex(c => c.id === clickedId);
        if (idxA !== -1 && idxB !== -1) {
          const newColors = [...colors];
          const temp = newColors[idxA];
          newColors[idxA] = newColors[idxB];
          newColors[idxB] = temp;
          setColors(newColors);
          setSelectedId(null);
          soundManager.playSieveMove();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(30);
          }
          checkOrder(newColors);
        }
      } else {
        // Se clicca su una riga diversa, sposta la selezione con un solo click
        setSelectedId(clickedId);
        soundManager.playTick();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-gradient-to-b from-[#faf5ff] via-[#f5f0fb] to-[#ede9fe] text-slate-800 flex flex-col justify-between items-center p-3 sm:p-4 select-none touch-manipulation overflow-hidden h-[100dvh] max-h-[100dvh]"
    >
      {/* ---------------------------------------------------- */}
      {/* ATMOSPHERIC ARTISTIC WATERCOLOR STUDIO SCENE          */}
      {/* ---------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft Ambient Studio Sunlight Halos */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[540px] h-[480px] bg-gradient-radial from-purple-200/40 via-pink-100/30 to-transparent dark:from-purple-900/25 dark:via-fuchsia-950/15 dark:to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-800/15 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-amber-200/25 dark:bg-amber-800/10 blur-2xl" />

        {/* Floating Soft Pastel Color Droplets (Creative Flow) */}
        <motion.div
          animate={{ y: [500, -40], x: [0, 20, -15, 10], scale: [0.8, 1.1, 0.9] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute left-[8%] bottom-0 w-7 h-7 rounded-full bg-purple-300/30 dark:bg-purple-500/20 blur-xs"
        />
        <motion.div
          animate={{ y: [560, -40], x: [0, -25, 15, -10], scale: [0.7, 1, 0.85] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 4 }}
          className="absolute right-[10%] bottom-0 w-8 h-8 rounded-full bg-pink-300/30 dark:bg-pink-500/20 blur-xs"
        />
        <motion.div
          animate={{ y: [520, -40], x: [0, 15, -20, 10] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 8 }}
          className="absolute left-[22%] bottom-0 w-6 h-6 rounded-full bg-amber-300/25 dark:bg-amber-500/15 blur-xs"
        />
      </div>

      {/* ================================================== */}
      {/* 1. TOP BAR (STANDARD CALMWORLD MINIGAME HEADER)     */}
      {/* ================================================== */}
      <header className="w-full max-w-md flex flex-col gap-2 shrink-0 z-30">
        <div className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          <div className="w-8" /> {/* Left spacer for perfect centering */}

          {/* Centered Pill with Title and Rules */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-4 py-1 rounded-full border border-purple-200 dark:border-purple-800 shadow-md">
            <h2 className="text-[#3b2d60] dark:text-[#ede7fa] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] drop-shadow-xs">
              I Colori di Mari
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-purple-700 dark:text-purple-300 hover:text-purple-950 active:scale-95 transition-all rounded-full hover:bg-purple-100/70 cursor-pointer"
              title="Regole del gioco"
              aria-label="Regole del gioco"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </button>
          </div>

          {/* Exit Button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
            aria-label="Esci dal gioco"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* ================================================== */}
      {/* 2. MARI PROTAGONIST BANNER (PLACED LOWER DOWN)     */}
      {/* ================================================== */}
      <div className="w-full max-w-md mx-auto z-20 shrink-0 mt-3 sm:mt-5 pt-1">
        <div className="calm-white-card p-2.5 sm:p-3 rounded-2xl border-2 border-purple-200/80 dark:border-purple-900/50 shadow-sm flex items-center gap-3">
          {/* Mari Avatar Column: Figure + Name Underneath */}
          <div className="shrink-0 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-14 h-16 sm:w-16 sm:h-20">
              {MARI_CUSTOM_IMAGE ? (
                <img
                  src={MARI_CUSTOM_IMAGE}
                  alt="Mari"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
                />
              ) : (
                <div className="w-12 h-16 relative flex items-center justify-center">
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                    <ellipse cx="50" cy="95" rx="30" ry="20" fill="#7c3aed" />
                    <circle cx="50" cy="50" r="26" fill="#fed7aa" />
                    <path d="M 22 52 C 16 32, 30 15, 50 15 C 70 15, 84 32, 78 52 C 72 70, 28 70, 22 52 Z" fill="#6d28d9" />
                    <circle cx="37" cy="54" r="3.5" fill="#f43f5e" opacity="0.35" />
                    <circle cx="63" cy="54" r="3.5" fill="#f43f5e" opacity="0.35" />
                    <ellipse cx="38" cy="46" rx="3" ry="3.5" fill="#1e1b4b" />
                    <circle cx="39.5" cy="44.5" r="1.2" fill="#ffffff" />
                    <ellipse cx="62" cy="46" rx="3" ry="3.5" fill="#1e1b4b" />
                    <circle cx="63.5" cy="44.5" r="1.2" fill="#ffffff" />
                    <path d="M 44 56 Q 50 61 56 56" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
            <span className="font-black text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-['Quicksand'] mt-0.5 text-center leading-none">
              Mari
            </span>
          </div>

          {/* Mari Dialogue & Quote: Entire Sentence Fits Completely */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Livello {level}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">
              {selectedId !== null
                ? '«1ª tessera selezionata! Ora tocca un\'altra tessera sulla stessa riga per scambiarle subito di posto ✨»'
                : mariQuote}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. COLOR PALETTES (RESPONSIVE WITHIN SCREEN BOUNDS)*/}
      {/* ================================================== */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center my-auto min-h-0 px-1 z-20 overflow-hidden">
        <div className="w-full flex flex-col gap-2.5 sm:gap-3.5 items-center justify-center">
          {Array.from({ length: numRows }).map((_, r) => {
            const rowItems = colors.filter(c => c.row === r);
            const isRowCompleted = rowItems.length > 0 && rowItems.every(c => c.completed);

            return (
              <div key={r} className="w-full flex flex-col items-center gap-1 sm:gap-1.5">
                {/* Palette Name & Status */}
                <div className="flex items-center justify-between w-full px-1 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs border border-white/60"
                      style={{ backgroundColor: `hsl(${rowPalettes[r]?.h || 200}, ${rowPalettes[r]?.s || 45}%, 52%)` }}
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold font-['Quicksand']">
                      {rowPalettes[r]?.name || `Tonalità ${r + 1}`}
                    </span>
                  </div>
                  {isRowCompleted && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Armonia perfetta!
                    </span>
                  )}
                </div>

                {/* Row of 6 Responsive Color Tiles: fits 100% horizontally on any mobile screen */}
                <div className="w-full flex gap-1.5 min-[380px]:gap-2 sm:gap-2.5 justify-center items-center">
                  {rowItems.map((c) => {
                    const isSelected = selectedId === c.id;

                    return (
                      <motion.button
                        key={c.id}
                        layout
                        type="button"
                        onClick={() => handleColorClick(c.id)}
                        className={`relative flex-1 max-w-[54px] aspect-[4/5] min-w-0 rounded-xl sm:rounded-2xl cursor-pointer transition-all shadow-sm focus:outline-hidden touch-manipulation select-none ${
                          isSelected
                            ? 'ring-3 sm:ring-4 ring-purple-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 shadow-lg z-20 brightness-105'
                            : 'active:scale-95'
                        } ${c.completed ? 'ring-2 ring-emerald-400' : ''}`}
                        style={{
                          backgroundColor: `hsl(${rowPalettes[r]?.h || 200}, ${rowPalettes[r]?.s || 45}%, ${c.l}%)`,
                        }}
                        transition={{ layout: { duration: 0.22, ease: 'easeOut' } }}
                        aria-label={`Colore luminosità ${Math.round(c.l)}%`}
                      >
                        {/* Soft satin sheen across the top */}
                        <div className="absolute inset-x-1 top-1 h-2 sm:h-3 rounded-t-lg bg-white/30 pointer-events-none" />

                        {/* Sparkle icon when completed */}
                        {c.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md pointer-events-none"
                          >
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
                          </motion.div>
                        )}

                        {/* Active Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-purple-600 text-white rounded-full border-2 border-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shadow-md z-30"
                          >
                            ✦
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================================================== */}
      {/* 4. FOOTER CONTROLS                                 */}
      {/* ================================================== */}
      <footer className="w-full max-w-md flex flex-col items-center gap-1 py-1 z-20 shrink-0">
        <button
          onClick={restartCurrentLevel}
          className="flex items-center gap-1.5 px-3.5 py-1 bg-white/80 dark:bg-slate-800/80 hover:bg-white active:scale-95 rounded-full text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
          title="Rimescola le tessere del livello corrente"
        >
          <RotateCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Rimescola</span>
        </button>
      </footer>

      {/* ================================================== */}
      {/* 5. RULES & STORY MODAL (MATCHING CALMWORLD STYLE)  */}
      {/* ================================================== */}
      <AnimatePresence>
        {showRules && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80]"
            onClick={() => setShowRules(false)}
          >
            <div
              className="calm-white-card border-2 border-purple-200 dark:border-purple-800 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-purple-900 dark:text-purple-200 font-black text-lg font-['Quicksand']">
                  I Colori di Mari
                </h3>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
                <div>
                  <p className="font-bold text-purple-800 dark:text-purple-300 mb-1">
                    Come si gioca:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                    <li>Tocca due tessere di colore sulla stessa riga per scambiarne il posto.</li>
                    <li>Ordina i colori in gradazione naturale: dal più chiaro al più scuro (o viceversa).</li>
                    <li>Quando una riga è in ordine perfetto, si illumina con un suono distensivo ✨.</li>
                    <li>Completate tutte le tavolozze, avanzerai naturalmente al livello successivo (con un massimo di 4 righe per non appesantire lo schermo).</li>
                    <li>Nessun timer o fretta: goditi il ritmo pacifico delle sfumature.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
              >
                Ho capito ✨
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
