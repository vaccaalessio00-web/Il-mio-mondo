import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutRoutine } from '../../types';
import { ChibiMascotBadge } from '../mascot/ChibiMascotBadge';
import {
  Play,
  Calendar,
  Dumbbell,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Layers,
  Flame,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  FileText
} from 'lucide-react';

interface MyRoutinesViewProps {
  onStartWorkout: (routineId: string, dayId: string) => void;
  onEditRoutine: (routineId: string) => void;
  onCreateNewRoutine: () => void;
  onOpenCatalog: () => void;
  onOpenGoogleAuth?: () => void;
}

export const MyRoutinesView: React.FC<MyRoutinesViewProps> = ({
  onStartWorkout,
  onEditRoutine,
  onCreateNewRoutine,
  onOpenCatalog,
  onOpenGoogleAuth
}) => {
  const { routines, activeRoutine, setActiveRoutine, activeWorkout, deleteRoutine, profile } = useWorkout();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [routineToDelete, setRoutineToDelete] = useState<WorkoutRoutine | null>(null);

  // If activeRoutine has days, ensure day index is valid
  const currentRoutine = activeRoutine || routines[0];
  const currentDay = currentRoutine?.days[selectedDayIndex] || currentRoutine?.days[0];

  return (
    <div className="space-y-4 pb-24">
      {/* Chibi Coach Motivational Greeting */}
      <ChibiMascotBadge />

      {routines.length === 0 ? (
        /* Clean Empty State when no routines exist on fresh download */
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm text-center space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 font-['Quicksand']">
              Benvenuta in MyWorld! 🍃
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Non hai ancora nessuna scheda di allenamento impostata.
              Crea subito la tua prima routine su misura con gli esercizi che preferisci!
            </p>
          </div>

          <div className="flex flex-col gap-2 max-w-xs mx-auto pt-1">
            <button
              onClick={onCreateNewRoutine}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-xs py-2.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crea la tua prima Scheda ✨</span>
            </button>

            {!profile.isLoggedIn && onOpenGoogleAuth && (
              <button
                onClick={onOpenGoogleAuth}
                className="w-full bg-white hover:bg-emerald-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-2xl border border-emerald-200 transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Accedi con Google per recuperare i tuoi dati</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        <>
          {/* Routine Selector Carousel / Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 font-['Quicksand']">
                <Layers className="w-4 h-4 text-emerald-600" />
                Le tue Schede di Allenamento
              </h2>
              <button
                onClick={onCreateNewRoutine}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Nuova Scheda
              </button>
            </div>

            {/* Horizontal scroll of routines */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {routines.map(routine => {
                const isSelected = currentRoutine?.id === routine.id;
                return (
                  <button
                    key={routine.id}
                    onClick={() => {
                      setActiveRoutine(routine.id);
                      setSelectedDayIndex(0);
                    }}
                    className={`p-3 rounded-2xl shrink-0 text-left transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md border-emerald-400 scale-[1.02]'
                        : 'bg-white text-slate-700 border-emerald-100 hover:border-emerald-300 shadow-2xs'
                    } w-44`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{routine.emoji || '🌸'}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-white/25 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Attiva
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold line-clamp-1 leading-snug">
                      {routine.title}
                    </h3>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {routine.days.length} {routine.days.length === 1 ? 'giorno' : 'giorni'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {currentRoutine && (
            <div className="bg-white rounded-3xl border border-emerald-100/90 shadow-sm p-4 space-y-4">
              {/* Active Routine Header */}
              <div className="flex items-start justify-between gap-2 border-b border-emerald-50 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentRoutine.emoji || '🌸'}</span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 leading-tight font-['Quicksand']">
                        {currentRoutine.title}
                      </h3>
                      <span className="text-xs text-emerald-600 font-semibold">
                        {currentRoutine.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {currentRoutine.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditRoutine(currentRoutine.id)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                    title="Modifica scheda"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRoutineToDelete(currentRoutine)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Elimina questa scheda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days / Split Tabs (only if routine has multiple days) */}
              {currentRoutine.days.length > 1 && (
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5 px-0.5">
                    Seleziona Giorno / Split:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {currentRoutine.days.map((day, idx) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          selectedDayIndex === idx
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                        }`}
                      >
                        {day.name.split(':')[0] || `Giorno ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentDay && (
                <div className="space-y-3">
                  {/* Day info & Start Workout CTA */}
                  <div className="green-banner-card bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 dark:bg-none dark:bg-[#064e3b] p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-700/80 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-emerald-900 dark:text-white truncate">
                        {currentDay.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-200 mt-0.5">
                        <span>{currentDay.exercises.length} esercizi</span>
                        <span>•</span>
                        <span>~{currentDay.exercises.length * 8} min</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartWorkout(currentRoutine.id, currentDay.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Avvia Oggi</span>
                    </button>
                  </div>

                  {/* List of exercises in current day */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-extrabold text-slate-700">
                        Esercizi in programma ({currentDay.exercises.length})
                      </span>
                      <button
                        onClick={onOpenCatalog}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Guarda catalogo
                      </button>
                    </div>

                    {currentDay.exercises.length === 0 ? (
                      <div className="text-center py-8 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200 p-4">
                        <p className="text-xs font-bold text-slate-600">Nessun esercizio in questo giorno</p>
                        <button
                          onClick={() => onEditRoutine(currentRoutine.id)}
                          className="mt-2 text-xs text-emerald-600 font-bold underline"
                        >
                          Aggiungi esercizi ora
                        </button>
                      </div>
                    ) : (
                      currentDay.exercises.map((ex, idx) => (
                        <div
                          key={ex.id}
                          className="bg-white p-3 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-colors shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                    {ex.muscleGroup}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {ex.equipment}
                                  </span>
                                </div>
                                <h5 className="text-xs font-extrabold text-slate-800 mt-0.5">
                                  {ex.exerciseName}
                                </h5>
                                {''}
                              </div>
                            </div>
                          </div>

                          {/* Workout parameters: Serie, Reps, Carico, Recupero */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 bg-[#fafdfb] p-2 rounded-xl text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                              Serie (Kg x Reps)
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                              {ex.sets.map((set, setIdx) => (
                                <div key={setIdx} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg py-0.5">
                                  {set.weightKg}kg x {set.reps}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal to Delete Routine */}
      {routineToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-rose-200 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Eliminare questa scheda?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Vuoi davvero eliminare la scheda <strong className="text-slate-800">"{routineToDelete.title}"</strong>?
              Tutti i suoi giorni ed esercizi associati verranno rimossi.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setRoutineToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  deleteRoutine(routineToDelete.id);
                  setRoutineToDelete(null);
                  setSelectedDayIndex(0);
                }}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Sì, elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
