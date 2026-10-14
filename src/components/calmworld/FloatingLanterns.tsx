import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lamp, Lightbulb } from 'lucide-react';
import { soundManager } from '../../utils/sound';

const PHRASES = [
    "Battito accelerato", "Respiro corto", "Tensione al petto", "Nodo alla gola", "Vertigine passeggera", 
    "Spalle contratte", "Formicolio", "Stomaco chiuso", "Sudore freddo", "Tensione muscolare", 
    "Paura dell'imprevisto", "Senso di vulnerabilità", "Mancanza di controllo", "Agitazione improvvisa", 
    "Sovraccarico emotivo", "Paura di svenire", "Peso sul cuore", "Paura dell'incertezza", "Frustrazione", 
    "Stanchezza mentale", "E se stessi male?", "Falso allarme", "Scenario peggiore", "Notifica spam della mente", 
    "Paura senza pericolo", "E se non passasse?", "Confusione tra timore e realtà", "Il film che crea la mente", 
    "Preoccupazione inutile", "Allarme antincendio a vuoto"
];

const LANTERN_STYLES = [
    { bg: 'bg-rose-200', text: 'text-rose-950', border: 'border-rose-400', shape: 'rounded-t-full rounded-b-lg' },
    { bg: 'bg-sky-200', text: 'text-sky-950', border: 'border-sky-400', shape: 'rounded-full' },
    { bg: 'bg-emerald-200', text: 'text-emerald-950', border: 'border-emerald-400', shape: 'rounded-lg' },
    { bg: 'bg-amber-200', text: 'text-amber-950', border: 'border-amber-400', shape: 'rounded-t-lg rounded-b-full' },
    { bg: 'bg-violet-200', text: 'text-violet-950', border: 'border-violet-400', shape: 'rounded-t-md rounded-b-md' },
    { bg: 'bg-lime-200', text: 'text-lime-950', border: 'border-lime-400', shape: 'rounded-full' },
    { bg: 'bg-fuchsia-200', text: 'text-fuchsia-950', border: 'border-fuchsia-400', shape: 'rounded-t-md rounded-b-3xl' },
    { bg: 'bg-cyan-200', text: 'text-cyan-950', border: 'border-cyan-400', shape: 'rounded-3xl' },
];

export const FloatingLanterns: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const lanternSeqRef = React.useRef(1);
    const [lanterns, setLanterns] = useState<{ id: number, thought: string, x: number, style: any }[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [customThought, setCustomThought] = useState('');

    const addLantern = (thought: string) => {
        let xPos = Math.random() * 70 + 15; // 15% to 85%
        let attempts = 0;
        while (lanterns.some(l => Math.abs(l.x - xPos) < 20) && attempts < 10) {
            xPos = Math.random() * 70 + 15;
            attempts++;
        }

        const style = LANTERN_STYLES[Math.floor(Math.random() * LANTERN_STYLES.length)];
        const nextId = ++lanternSeqRef.current;
        setLanterns(prev => [...prev, { id: nextId, thought, x: xPos, style }]);
        setShowInput(false);
        setCustomThought('');
        
        const freq = 150 + Math.random() * 150; // Lower frequency range
        soundManager.playLanternRelease(freq);
    };

    const addRandomLantern = () => {
        const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        addLantern(phrase);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[#070b19] to-[#0e1b2f] flex flex-col justify-between touch-manipulation select-none" style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Top Bar with Centered Title, Lightbulb info, and Exit button on the right */}
            <div className="relative w-full flex items-center justify-between p-3 sm:p-4 pt-4 sm:pt-5 z-30 shrink-0">
                <div className="w-8 sm:w-9" /> {/* Spacer balancing X on right */}
                
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-3.5 sm:px-4 py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-md">
                    <h2 className="text-[#78350f] dark:text-[#fef3c7] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] whitespace-nowrap drop-shadow-xs">
                        Lampade Galleggianti
                    </h2>
                    <button
                        onClick={() => setShowRules(true)}
                        className="p-1 text-amber-800 dark:text-amber-300 hover:text-amber-950 active:scale-95 transition-all rounded-full hover:bg-amber-100/70 cursor-pointer"
                        title="Regole del gioco"
                        aria-label="Regole del gioco"
                    >
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
                    aria-label="Esci dal gioco"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-100/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 relative">
                <AnimatePresence>
                    {lanterns.map(l => (
                        <motion.div
                            key={l.id}
                            className="absolute bottom-20 flex flex-col items-center"
                            style={{ left: `${l.x}%` }}
                            initial={{ y: 0, opacity: 1, scale: 1 }}
                            animate={{ y: -700, opacity: 0, scale: 0.2 }}
                            transition={{ duration: 15, ease: "linear" }}
                            onAnimationComplete={() => setLanterns(prev => prev.filter(p => p.id !== l.id))}
                        >
                            <motion.div 
                                animate={{ opacity: [0.6, 0.3, 0.6] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className={`w-24 h-28 ${l.style.bg} ${l.style.border} border-2 ${l.style.shape} shadow-[0_0_15px_5px_rgba(255,255,255,0.2)] flex items-center justify-center p-2 text-center text-sm font-bold ${l.style.text}`}
                            >
                                {l.thought}
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <div className="h-1/5 p-4 z-10 pb-10 flex flex-col gap-2">
                <div className="flex gap-2">
                    <button onClick={() => setShowInput(true)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold backdrop-blur-sm">
                        Tocca per accendere una lanterna
                    </button>
                    <button onClick={addRandomLantern} className="w-16 bg-white/10 text-amber-200 rounded-2xl flex items-center justify-center">
                        <Lamp className="w-8 h-8" />
                    </button>
                </div>
                <p className="text-amber-200 text-sm text-center font-bold">Lascia andare le tue ansie, non ti rappresentano!</p>
            </div>

            {showInput && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-20" onClick={() => setShowInput(false)}>
                    <div className="bg-[#0e1b2f] p-6 rounded-3xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="text-white font-bold mb-4">Cosa lasci andare?</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {PHRASES.slice(0, 4).map(t => <button key={t} onClick={() => addLantern(t)} className="p-2 bg-white/10 text-white text-xs rounded-xl">{t}</button>)}
                        </div>
                        <input value={customThought} onChange={e => setCustomThought(e.target.value)} placeholder="Oppure scrivi..." className="w-full p-3 bg-white/10 text-white rounded-xl mb-4" />
                        <button onClick={() => addLantern(customThought || 'Pensiero')} className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl">Lascia andare</button>
                    </div>
                </div>
            )}

            {showRules && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
                    onClick={() => setShowRules(false)}
                >
                    <div
                        className="calm-white-card border-2 border-amber-200 dark:border-amber-800 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-amber-950 dark:text-amber-200 font-black text-lg font-['Quicksand']">
                                Lampade Galleggianti
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
                                L'ansia spesso genera pensieri intrusivi o tensioni fisiche nel corpo. Lottare contro di essi li rende solo più pesanti.
                            </p>

                            <div>
                                <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                                    Come si gioca:
                                </p>

                                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                                    <li>Tocca <strong>"Tocca per accendere una lanterna"</strong> per scegliere una frase o scrivere direttamente ciò che ti appesantisce.</li>
                                    <li>Oppure tocca l'icona della <strong>Lanterna</strong> per affidare istantaneamente una frase o sintomo casuale alla fiamma.</li>
                                    <li>Osserva la lanterna salire dolcemente verso il cielo e dissolversi: il pensiero si allontana e la mente ritrova pace.</li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowRules(false)}
                            className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
                        >
                            Ho capito ✨
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
