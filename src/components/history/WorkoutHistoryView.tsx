import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutSessionLog } from '../../types';
import { CHIBI_MASCOT_HISTORY } from '../../assets/mascot';
import {
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  Trash2,
  Zap,
  FileText,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trophy
} from 'lucide-react';

interface WorkoutHistoryViewProps {
  onGoToRoutines: () => void;
  onOpenGoogleAuth?: () => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({
  onGoToRoutines,
  onOpenGoogleAuth
}) => {
  const { sessionLogs, deleteSessionLog, profile } = useWorkout();

  const [selectedRoutineFilter, setSelectedRoutineFilter] = useState<string>('all');
  const [logToDelete, setLogToDelete] = useState<WorkoutSessionLog | null>(null);

  // Filter logs
  const filteredLogs = sessionLogs.filter(log => {
    if (selectedRoutineFilter === 'all') return true;
    return log.routineTitle === selectedRoutineFilter;
  });

  // Unique routine titles for filter dropdown
  const uniqueRoutines = Array.from(
    new Set(sessionLogs.map(log => log.routineTitle).filter(Boolean))
  );

  // Overall Stats
  const totalWorkouts = sessionLogs.length;
  const totalMinutes = sessionLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const totalVolumeKg = sessionLogs.reduce((acc, log) => acc + (log.totalVolumeKg || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  // Format date helper in Italian
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Banner with Mascot */}
      <div className="green-banner-card bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:bg-none dark:bg-[#064e3b] p-4 rounded-3xl border border-emerald-200 dark:border-emerald-700/80 shadow-sm flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-white/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              Diario di Bordo ✨
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white font-['Quicksand'] leading-tight">
            Storico Allenamenti
          </h2>
          <p className="text-xs text-slate-600 dark:text-emerald-100/90 mt-1">
            Ogni sessione completata è un passo avanti verso i tuoi traguardi!
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
          <img
            src={CHIBI_MASCOT_HISTORY}
            alt="MyWorld Coach con Diario"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Sessions */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Sessioni</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {totalWorkouts}
            </span>
            <span className="text-xs font-bold text-slate-400">fatte</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {totalWorkouts === 1 ? '1 allenamento' : `${totalWorkouts} allenamenti`}
          </p>
        </div>

        {/* Total Time */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Tempo Totale</span>
            <Clock className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {totalHours > 0 ? `${totalHours}h ${remainingMins}` : `${totalMinutes}`}
            </span>
            <span className="text-xs font-bold text-slate-400">min</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
            Media {avgDuration} min/sess
          </p>
        </div>

        {/* Total Volume */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Volume Totale</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-600 font-mono">
              {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}k` : totalVolumeKg}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Carico sollevato
          </p>
        </div>

        {/* Routine Count */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Schede Usate</span>
            <Dumbbell className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {uniqueRoutines.length}
            </span>
            <span className="text-xs font-bold text-slate-400">diverse</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Varietà di stimolo
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {sessionLogs.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-emerald-200 bg-emerald-50 mx-auto shadow-md">
            <img
              src={CHIBI_MASCOT_HISTORY}
              alt="MyWorld Mascot con Diario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-800 font-['Quicksand']">
              Nessun allenamento registrato
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Quando completi una sessione da <strong>"Mie Schede"</strong>, troverai qui
              tutti i dettagli: serie, carichi, durata e note personali!
            </p>
          </div>

          <div className="flex flex-col gap-2 max-w-xs mx-auto pt-1">
            <button
              onClick={onGoToRoutines}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-xs py-2.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Vai alle Schede & Inizia 🏋️‍♀️</span>
            </button>

            {!profile.isLoggedIn && onOpenGoogleAuth && (
              <button
                onClick={onOpenGoogleAuth}
                className="w-full bg-white hover:bg-emerald-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-2xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Accedi con Google per recuperare lo storico</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Logs List */
        <div className="space-y-3">
          {/* Header row with Filter */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 font-['Quicksand']">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Sessioni Completate ({filteredLogs.length})
            </h3>

            {uniqueRoutines.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedRoutineFilter}
                  onChange={e => setSelectedRoutineFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="all">Tutte le schede</option>
                  {uniqueRoutines.map(title => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Timeline Cards */}
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <div
                key={log.id}
                className="bg-white rounded-3xl p-4 border border-emerald-100/90 hover:border-emerald-200 shadow-sm transition-all relative overflow-hidden"
              >
                {/* Accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

                {/* Session Header */}
                <div className="flex items-start justify-between gap-2 border-b border-emerald-50 pb-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 capitalize block">
                      {formatDate(log.date)}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-tight mt-0.5">
                      {log.routineTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {log.dayName}
                    </p>
                  </div>

                  <button
                    onClick={() => setLogToDelete(log)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Elimina questa sessione dallo storico"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-[#fafdfb] p-2 rounded-xl border border-emerald-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-teal-500" />
                      Durata
                    </span>
                    <span className="text-xs font-black text-slate-800 font-mono mt-0.5 block">
                      {log.durationMinutes} min
                    </span>
                  </div>

                  <div className="bg-[#fafdfb] p-2 rounded-xl border border-emerald-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Esercizi
                    </span>
                    <span className="text-xs font-black text-slate-800 font-mono mt-0.5 block">
                      {log.completedExercisesCount} / {log.totalExercisesCount}
                    </span>
                  </div>

                  <div className="bg-[#fafdfb] p-2 rounded-xl border border-emerald-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Volume
                    </span>
                    <span className="text-xs font-black text-emerald-600 font-mono mt-0.5 block">
                      {log.totalVolumeKg ? `${log.totalVolumeKg.toLocaleString()} kg` : 'A corpo libero'}
                    </span>
                  </div>
                </div>

                {/* Notes if entered */}
                {log.notes && (
                  <div className="mt-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-2.5 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold text-emerald-800 uppercase block">
                        Note di Fine Allenamento:
                      </span>
                      <p className="text-xs text-slate-700 italic mt-0.5 leading-snug">
                        "{log.notes}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {logToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-rose-200 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Eliminare questa sessione?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Vuoi davvero eliminare l'allenamento di{' '}
              <strong className="text-slate-800">{formatDate(logToDelete.date)}</strong>?
              Questa azione non potrà essere annullata.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setLogToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  deleteSessionLog(logToDelete.id);
                  setLogToDelete(null);
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
