import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutRoutine, WorkoutExercise, Exercise } from '../../types';
import { ExerciseCatalogModal } from '../catalog/ExerciseCatalogModal';
import {
  Plus,
  Trash2,
  Save,
  Dumbbell,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Clock,
  Check,
  FileText,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NOTE_SUGGESTIONS = [
  'focus sulla contrazione',
  'usare fascia media',
  'discesa lenta 3 sec',
  'strizza i glutei al picco',
  'pausa in allungamento',
  'schiena dritta e addome saldo'
];

// Rich, categorized icon list with 140+ vibrant emojis across fitness, aesthetics, nutrition, and mindset
const EMOJI_CATEGORIES = [
  {
    name: '🏋️‍♀️ Fitness & Sport',
    emojis: [
      '🏋️‍♀️', '🏋️‍♂️', '💪', '🧘‍♀️', '🏃‍♀️', '🤸‍♀️', '💃', '🥊',
      '🚴‍♀️', '🏊‍♀️', '🔥', '⚡', '🎯', '🧗‍♀️', '👟', '⏱️',
      '🤾‍♀️', '🤸‍♂️', '🤺', '🛹', '🎾', '🏹', '🥋', '🛼'
    ]
  },
  {
    name: '🍑 Estetica & Glow',
    emojis: [
      '🍑', '🌸', '🎀', '✨', '🪷', '🌺', '💖', '💎',
      '🫧', '🦋', '👑', '💄', '🌷', '💅', '🪞', '🦩',
      '💐', '🩰', '💍', '🪄', '🦄', '🌹', '🪮', '🌼'
    ]
  },
  {
    name: '🥑 Nutrizione & Healthy',
    emojis: [
      '🥑', '🍓', '🍒', '🍉', '🥤', '🍵', '🍇', '🍏',
      '🥥', '🥝', '🍯', '🌿', '🥗', '🍋', '🍌', '🍍',
      '🫐', '🥕', '🍫', '🥞', '🌾', '☕', '💧', '🍎'
    ]
  },
  {
    name: '🥇 Vittorie & Traguardi',
    emojis: [
      '🥇', '🥈', '🥉', '🏆', '💯', '⭐', '🌟', '🚀',
      '🔮', '🛡️', '💫', '🧸', '🏅', '🎉', '🎊', '🎖️',
      '🎇', '🪐', '🎆', '🏷️', '🏵️', '🔱', '🧿', '👑'
    ]
  },
  {
    name: '🍃 Mindset & Natura',
    emojis: [
      '🍃', '🌿', '🌱', '🌙', '☀️', '🌈', '🌊', '☁️',
      '🏝️', '🌄', '🕯️', '🕊️', '🌾', '🍂', '🍁', '🪵',
      '🪴', '🌻', '🎋', '🍄', '🌍', '🐚', '⛅', '🌸'
    ]
  },
  {
    name: '⚡ Energia & Grinta',
    emojis: [
      '⚡', '💥', '🔥', '🧨', '🌋', '🌪️', '☄️', '💣',
      '⚔️', '🔋', '⚙️', '🚨', '🐅', '🐆', '🦅', '🦁',
      '🐺', '🐉', '🐲', '🏎️', '🏍️', '🚀', '🛠️', '🥊'
    ]
  }
];

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis);

interface WorkoutBuilderViewProps {
  initialRoutineId?: string | null;
  onFinished: () => void;
}

export const WorkoutBuilderView: React.FC<WorkoutBuilderViewProps> = ({
  initialRoutineId,
  onFinished
}) => {
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useWorkout();

  // Find existing routine if editing, or create new scaffold
  const existing = initialRoutineId ? routines.find(r => r.id === initialRoutineId) : null;

  const [title, setTitle] = useState(existing?.title || 'Nuova Scheda');
  const [description, setDescription] = useState(
    existing?.description || 'Scheda personalizzata per tonificare e scolpire con regolarità.'
  );
  const [category, setCategory] = useState(existing?.category || 'Glutei & Tonificazione');
  const [emoji, setEmoji] = useState(existing?.emoji || '🌸');
  const [emojiCategory, setEmojiCategory] = useState<string>('all');
  const [isGridMode, setIsGridMode] = useState<boolean>(false);
  const emojiScrollRef = React.useRef<HTMLDivElement>(null);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollEmojis = (direction: 'left' | 'right') => {
    if (emojiScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      emojiScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeCategoryData = EMOJI_CATEGORIES.find(c => c.name === emojiCategory);
  const displayedEmojis = emojiCategory === 'all'
    ? ALL_EMOJIS
    : (activeCategoryData ? activeCategoryData.emojis : ALL_EMOJIS);

  // Single-day exercises list (no multi-day management)
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    if (existing?.days && existing.days.length > 0) {
      return existing.days.flatMap(d => d.exercises);
    }
    return [];
  });

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add exercise from catalog
  const handleAddExerciseFromCatalog = (ex: Exercise) => {
    const newWorkoutEx: WorkoutExercise = {
      id: 'we_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      equipment: ex.equipment,
      sets: Array(3).fill({ reps: '10-12', weightKg: ex.equipment === 'Manubri' ? 6 : 0 }),
      restSeconds: 60,
      notes: ex.tips || '',
      completedSets: [false, false, false]
    };

    setExercises(prev => [...prev, newWorkoutEx]);
  };

  // Update specific exercise field
  const handleUpdateExercise = (
    exIdx: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    setExercises(prev => {
      const updated = [...prev];
      const targetEx = { ...updated[exIdx], [field]: value };
      updated[exIdx] = targetEx;
      return updated;
    });
  };

  // Move exercise up/down
  const handleMoveExercise = (exIdx: number, direction: 'up' | 'down') => {
    setExercises(prev => {
      const list = [...prev];
      if (direction === 'up' && exIdx > 0) {
        const temp = list[exIdx];
        list[exIdx] = list[exIdx - 1];
        list[exIdx - 1] = temp;
      } else if (direction === 'down' && exIdx < list.length - 1) {
        const temp = list[exIdx];
        list[exIdx] = list[exIdx + 1];
        list[exIdx + 1] = temp;
      }
      return list;
    });
  };

  // Duplicate exercise
  const handleDuplicateExercise = (exIdx: number) => {
    setExercises(prev => {
      const ex = prev[exIdx];
      const copy: WorkoutExercise = {
        ...ex,
        id: 'we_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
      };
      const next = [...prev];
      next.splice(exIdx + 1, 0, copy);
      return next;
    });
  };

  // Remove exercise
  const handleRemoveExercise = (exIdx: number) => {
    setExercises(prev => prev.filter((_, idx) => idx !== exIdx));
  };

  // Save routine
  const handleSave = () => {
    if (!title.trim()) {
      alert('Inserisci un titolo per la tua scheda!');
      return;
    }

    if (exercises.length === 0) {
      alert('Aggiungi almeno un esercizio alla scheda!');
      return;
    }

    const routineData: WorkoutRoutine = {
      id: existing?.id || 'routine_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      emoji,
      color: '#86efac',
      days: [
        {
          id: existing?.days?.[0]?.id || 'day_' + Date.now(),
          name: title.trim(),
          exercises: exercises
        }
      ],
      isActive: existing ? existing.isActive : true,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
      lastTrainedAt: existing?.lastTrainedAt
    };

    if (existing) {
      updateRoutine(routineData);
    } else {
      addRoutine(routineData);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      onFinished();
    }, 800);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top action header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 font-['Quicksand'] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            {existing ? 'Modifica Scheda' : 'Crea Nuova Scheda'}
          </h2>
          <p className="text-xs text-slate-500">
            Personalizza esercizi, serie, carichi, note e tempi di recupero
          </p>
        </div>

        <div className="flex items-center gap-2">
          {existing && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors border border-slate-200"
              title="Elimina questa scheda"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold shadow-md transition-all ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvata! ✨</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salva Scheda</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Routine Metadata Card */}
      <div className="routine-name-emoji-card bg-white dark:bg-[#064e3b] p-4 rounded-3xl border border-emerald-100 dark:border-emerald-600 space-y-3.5 shadow-xs">
        {/* Emoji & Title */}
        <div className="flex items-start gap-2.5">
          {/* Main Selected Emoji Display */}
          <div className="shrink-0">
            <div
              className="routine-emoji-preview-box text-2xl w-14 h-14 bg-emerald-50 dark:bg-[#043d2e] border-2 border-emerald-200 dark:border-emerald-500 rounded-2xl flex items-center justify-center shadow-2xs"
              title="Icona selezionata"
            >
              <span>{emoji}</span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-emerald-200 uppercase">
              Nome della Scheda
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Es. Booty Builder & Glutei..."
              className="w-full font-bold text-sm text-slate-800 dark:text-white bg-[#f7faf8] dark:bg-[#043d2e] border border-emerald-200 dark:border-emerald-500 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Icon Selector: Full Scrolling across all icons + Category filter */}
        <div className="routine-emoji-selector-box bg-emerald-50/50 dark:bg-[#03382a] rounded-2xl p-3 border border-emerald-100 dark:border-emerald-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
              Icona Scheda
            </span>
            <button
              type="button"
              onClick={() => setIsGridMode(!isGridMode)}
              className="routine-emoji-btn text-[10px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-100 dark:hover:text-white bg-white hover:bg-emerald-100 dark:bg-[#064e3b] dark:hover:bg-[#0a634c] border border-emerald-200 dark:border-emerald-600 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
            >
              {isGridMode ? 'Vista Scorrevole' : 'Vista Griglia'}
            </button>
          </div>

          {/* Category Tabs with Smooth Scroll & Navigation */}
          <div className="relative flex items-center group">
            {/* Left Category Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="routine-emoji-btn absolute left-0 z-10 w-6 h-6 -ml-1 rounded-full bg-white/95 hover:bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-emerald-700 transition-all hover:scale-105"
              title="Scorri categorie indietro"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Scrollable Categories List */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto px-6 py-1 scroll-smooth scrollbar-none"
            >
              <button
                type="button"
                onClick={() => {
                  setEmojiCategory('all');
                  if (emojiScrollRef.current) emojiScrollRef.current.scrollLeft = 0;
                }}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all shrink-0 ${
                  emojiCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'routine-emoji-btn bg-white text-slate-600 border border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                Tutte
              </button>
              {EMOJI_CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setEmojiCategory(cat.name);
                    if (emojiScrollRef.current) emojiScrollRef.current.scrollLeft = 0;
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all shrink-0 ${
                    emojiCategory === cat.name
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'routine-emoji-btn bg-white text-slate-600 border border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right Category Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="routine-emoji-btn absolute right-0 z-10 w-6 h-6 -mr-1 rounded-full bg-white/95 hover:bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-emerald-700 transition-all hover:scale-105"
              title="Scorri categorie avanti"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Emojis Display: Smooth Horizontal Scroll with all icons OR Grid */}
          {!isGridMode ? (
            <div className="relative flex items-center group">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollEmojis('left')}
                className="routine-emoji-btn absolute left-0 z-10 w-7 h-7 -ml-1 rounded-full bg-white/95 hover:bg-white border border-emerald-200 shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-700 transition-all hover:scale-105"
                title="Scorri indietro"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Horizontal Scroll Area with ALL emojis rendered */}
              <div
                ref={emojiScrollRef}
                className="flex items-center gap-2 overflow-x-auto px-7 py-1.5 scroll-smooth scrollbar-thin text-xl"
              >
                {displayedEmojis.map((em, idx) => (
                  <button
                    key={`${em}_${idx}`}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      emoji === em
                        ? 'bg-emerald-500 scale-110 shadow-xs ring-2 ring-emerald-300'
                        : 'routine-emoji-btn bg-white hover:bg-emerald-100 border border-emerald-100 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span>{em}</span>
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollEmojis('right')}
                className="routine-emoji-btn absolute right-0 z-10 w-7 h-7 -mr-1 rounded-full bg-white/95 hover:bg-white border border-emerald-200 shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-700 transition-all hover:scale-105"
                title="Scorri avanti"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="routine-emoji-grid grid grid-cols-6 sm:grid-cols-12 gap-1.5 bg-white dark:bg-[#03382a] p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-700 max-h-56 overflow-y-auto">
              {displayedEmojis.map((em, idx) => (
                <button
                  key={`${em}_${idx}`}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    emoji === em
                      ? 'bg-emerald-500 scale-110 shadow-xs ring-2 ring-emerald-300'
                      : 'hover:bg-emerald-50 dark:hover:bg-[#064e3b] dark:bg-[#044a37] dark:text-white active:scale-95'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Categoria / Focus
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2"
            >
              <option value="Glutei & Tonificazione">Glutei & Tonificazione</option>
              <option value="Full Body Tonica">Full Body Tonica</option>
              <option value="Upper / Lower Split">Upper / Lower Split</option>
              <option value="Push / Pull / Legs">Push / Pull / Legs</option>
              <option value="Home & Elastici">Home & Elastici</option>
              <option value="Personalizzata">Personalizzata</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Descrizione o Obiettivo
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Es. Per glutei sodi e silhouette armoniosa..."
              className="w-full text-xs text-slate-700 bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Direct Exercises List (No multiple days) */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand']">
              Esercizi della Scheda ({exercises.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Aggiungi
          </button>
        </div>

        {/* Exercises */}
        {exercises.length === 0 ? (
          <div className="text-center py-10 bg-[#fafdfb] rounded-2xl border border-dashed border-emerald-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                Nessun esercizio ancora aggiunto
              </p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xs mx-auto leading-relaxed">
                Tocca il pulsante qui sotto per aggiungere gli esercizi dal nostro catalogo (Glutei, Gambe, Braccia, Addome, Schiena, Petto)!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-98"
            >
              + Apri Catalogo Esercizi
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((ex, exIdx) => (
              <div
                key={ex.id}
                className="bg-white p-3.5 rounded-2xl border border-emerald-100 hover:border-emerald-200 shadow-2xs space-y-2.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {exIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                          {ex.muscleGroup}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ex.equipment}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">
                        {ex.exerciseName}
                      </h4>
                    </div>
                  </div>

                  {/* Actions for exercise */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveExercise(exIdx, 'up')}
                      disabled={exIdx === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg"
                      title="Sposta su"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveExercise(exIdx, 'down')}
                      disabled={exIdx === exercises.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg"
                      title="Sposta giù"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateExercise(exIdx)}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg"
                      title="Duplica esercizio"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exIdx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                      title="Rimuovi esercizio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Serie</label>
                    <button
                      onClick={() => {
                        const updatedExercises = [...exercises];
                        updatedExercises[exIdx].sets.push({ reps: '10-12', weightKg: 0 });
                        setExercises(updatedExercises);
                      }}
                      className="text-[10px] text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded-lg"
                    >
                      + Aggiungi Serie
                    </button>
                  </div>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-[10px] font-bold text-slate-400">Set {setIdx + 1}</span>
                      <input
                        type="text"
                        value={set.reps}
                        onChange={e => {
                          const updated = [...exercises];
                          updated[exIdx].sets[setIdx].reps = e.target.value;
                          setExercises(updated);
                        }}
                        className="w-full text-center text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg py-1"
                        placeholder="Reps"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={set.weightKg}
                          onChange={e => {
                            const updated = [...exercises];
                            updated[exIdx].sets[setIdx].weightKg = parseFloat(e.target.value) || 0;
                            setExercises(updated);
                          }}
                          className="w-full text-center text-xs font-bold text-emerald-700 bg-white border border-slate-200 rounded-lg py-1"
                          placeholder="Kg"
                        />
                        <button
                          onClick={() => {
                            const updated = [...exercises];
                            updated[exIdx].sets.splice(setIdx, 1);
                            setExercises(updated);
                          }}
                          className="text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Notes Section */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-600" />
                      <span>Note Personalizzate Esercizio</span>
                    </label>
                    {ex.notes && (
                      <button
                        type="button"
                        onClick={() => handleUpdateExercise(exIdx, 'notes', '')}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                      >
                        Cancella
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={ex.notes || ''}
                      onChange={e => handleUpdateExercise(exIdx, 'notes', e.target.value)}
                      placeholder="Es. 'focus sulla contrazione', 'usare fascia media'..."
                      className="w-full text-xs text-slate-800 bg-[#f8fdfa] border border-emerald-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden placeholder:text-slate-400"
                    />
                  </div>

                  {/* Quick suggestion chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">Suggerimenti:</span>
                    {NOTE_SUGGESTIONS.map(sugg => {
                      const isAlreadyInNote = (ex.notes || '').toLowerCase().includes(sugg.toLowerCase());
                      return (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => {
                            const current = (ex.notes || '').trim();
                            if (!current) {
                              handleUpdateExercise(exIdx, 'notes', sugg);
                            } else if (!isAlreadyInNote) {
                              handleUpdateExercise(exIdx, 'notes', `${current}, ${sugg}`);
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium shrink-0 transition-colors ${
                            isAlreadyInNote
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                              : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200'
                          }`}
                        >
                          + {sugg}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Routine Action for Existing Routine */}
      {existing && (
        <div className="bg-white p-4 rounded-3xl border border-rose-100 flex items-center justify-between shadow-2xs">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Elimina questa scheda</h4>
            <p className="text-[11px] text-slate-500">Rimuove permanentemente la scheda e i suoi esercizi</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Elimina Scheda</span>
          </button>
        </div>
      )}

      {/* Catalog modal for picking exercises */}
      <ExerciseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectExercise={handleAddExerciseFromCatalog}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && existing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-rose-200 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Eliminare questa scheda?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Vuoi davvero eliminare la scheda <strong className="text-slate-800">"{existing.title}"</strong>?
              Questa azione non potrà essere annullata.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRoutine(existing.id);
                  setShowDeleteConfirm(false);
                  onFinished();
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
