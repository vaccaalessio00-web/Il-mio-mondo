import React, { useState, useEffect } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { CHIBI_COACH_ENGFA, CHIBI_FRIEND_CHARLOTTE, CHIBI_BOYFRIEND_PUZZOLA } from '../../assets/mascot';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Dumbbell,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Plus,
  Minus,
  FileText
} from 'lucide-react';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({ isOpen, onClose }) => {
  const {
    activeWorkout,
    toggleSetCompleted,
    updateExerciseValues,
    pauseResumeRestTimer,
    addRestSeconds,
    stopRestTimer,
    finishWorkout,
    cancelWorkout,
    profile
  } = useWorkout();

  const [notes, setNotes] = useState('');
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Coach mascot determination
  const coachType = sessionStorage.getItem('fitworld_coach_type') || 'random';
  const getCoachMascot = () => {
    let type = coachType;
    if (type === 'random') {
       const types = ['puzzola', 'charlotte', 'engfa'];
       type = types[Math.floor(Math.random() * types.length)];
    }
    try {
      const saved = localStorage.getItem('fitworld_custom_mascots');
      const customUrls = saved ? JSON.parse(saved) : {};
      if (customUrls[type]) return customUrls[type];
    } catch {}

    switch (type) {
        case 'charlotte': return CHIBI_FRIEND_CHARLOTTE;
        case 'puzzola': return CHIBI_BOYFRIEND_PUZZOLA;
        default: return CHIBI_COACH_ENGFA;
    }
  };
  const coachMascot = getCoachMascot();

  // Time elapsed counter
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!isOpen || !activeWorkout) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Calculate total sets and completed sets
  let totalSets = 0;
  let completedSetsCount = 0;
  activeWorkout.exercises.forEach(ex => {
    totalSets += ex.sets.length;
    completedSetsCount += (ex.completedSets || []).filter(Boolean).length;
  });

  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  const handleFinish = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#86efac', '#34d399', '#f472b6', '#a7f3d0', '#fde047']
    });

    finishWorkout(notes);
    setShowFinishConfirm(false);
    onClose();
  };

  const handleCancel = () => {
    cancelWorkout();
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f6fcf8] w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border-2 border-emerald-200">
        {/* Sticky Header */}
        <div className="bg-white px-4 py-3 border-b border-emerald-100 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-emerald-50 shrink-0">
              <img
                src={coachMascot}
                alt="Coach"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  In Allenamento
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-800 line-clamp-1 font-['Quicksand']">
                {activeWorkout.dayName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs text-slate-400 hover:text-rose-500 px-2 py-1 font-bold rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={() => setShowFinishConfirm(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Termina
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-emerald-100/60 h-2 w-full shrink-0 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Rest Timer Floating Banner (if active) */}
        {activeWorkout.restTimerSeconds > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white p-3 shrink-0 shadow-md flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200">
                  Tempo di Recupero
                </span>
                <p className="text-lg font-black font-mono leading-none">
                  {formatTime(activeWorkout.restTimerSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => addRestSeconds(15)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-lg"
              >
                +15s
              </button>
              <button
                onClick={() => addRestSeconds(30)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-lg"
              >
                +30s
              </button>
              <button
                onClick={pauseResumeRestTimer}
                className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg"
                title={activeWorkout.restTimerActive ? 'Pausa' : 'Riprendi'}
              >
                {activeWorkout.restTimerActive ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={stopRestTimer}
                className="bg-white/20 hover:bg-rose-500 text-white p-1.5 rounded-lg ml-1"
                title="Salta recupero"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Exercises Scroll List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-emerald-800">
              Serie completate: {completedSetsCount} / {totalSets} ({progressPercent}%)
            </span>
            <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              {activeWorkout.exercises.length} esercizi
            </span>
          </div>

          {activeWorkout.exercises.map((exercise, exIdx) => {
            const completedCount = (exercise.completedSets || []).filter(Boolean).length;
            const isFullyCompleted = completedCount === exercise.sets.length;
            const isExpanded = expandedExerciseId === exercise.id;

            return (
              <div
                key={exercise.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isFullyCompleted
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-emerald-100 shadow-xs'
                }`}
              >
                {/* Exercise Header */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {exIdx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                            {exercise.muscleGroup}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {exercise.equipment}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
                          {exercise.exerciseName}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Sets completion buttons */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">
                      Serie:
                    </span>
                    {exercise.sets.map((set, setIdx) => {
                      const isCompleted = !!exercise.completedSets?.[setIdx];
                      return (
                        <button
                          key={setIdx}
                          onClick={() => toggleSetCompleted(exercise.id, setIdx)}
                          className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all duration-150 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-xs scale-102 ring-2 ring-emerald-300'
                              : 'bg-emerald-50/80 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {setIdx + 1}ª {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-emerald-400" />}
                          </span>
                          <span className="font-mono text-[9px]">{set.weightKg}kg x {set.reps}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible details / quick weight steps */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-[#fafdfb] rounded-b-2xl">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2 mt-2">
                        Modifica Serie:
                    </span>
                    {exercise.sets.map((set, setIdx) => (
                        <div key={setIdx} className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold w-10">Set {setIdx + 1}:</span>
                            <div className="flex items-center gap-1 flex-1">
                                <input
                                    type="number"
                                    value={set.weightKg}
                                    onChange={e => {
                                        const newSets = [...exercise.sets];
                                        newSets[setIdx] = { ...set, weightKg: parseFloat(e.target.value) || 0 };
                                        updateExerciseValues(exercise.id, newSets);
                                    }}
                                    className="w-16 text-center text-xs font-bold text-emerald-700 bg-white border border-slate-200 rounded-lg py-1"
                                    placeholder="Kg"
                                />
                                <input
                                    type="text"
                                    value={set.reps}
                                    onChange={e => {
                                        const newSets = [...exercise.sets];
                                        newSets[setIdx] = { ...set, reps: e.target.value };
                                        updateExerciseValues(exercise.id, newSets);
                                    }}
                                    className="flex-1 text-center text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg py-1"
                                    placeholder="Reps"
                                />
                            </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Finish Confirmation Dialog */}
        {showFinishConfirm && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-emerald-200 text-center animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                Hai terminato l'allenamento? ✨
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ottimo lavoro! Hai completato {completedSetsCount} di {totalSets} serie totali in {formatTime(elapsedSeconds)}.
              </p>

              <div className="mt-3 text-left">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Note sulla sessione (opzionale):
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Come ti sei sentita? Bruciore glutei, carichi aumentati..."
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setShowFinishConfirm(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Continua ad allenarti
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-xs"
                >
                  Salva & Festeggia! 🎉
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {showCancelConfirm && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-rose-200 text-center">
              <h3 className="text-base font-extrabold text-slate-800">
                Vuoi annullare l'allenamento?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                I progressi di questa sessione attiva andranno persi.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Rimani
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl"
                >
                  Annulla allenamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
