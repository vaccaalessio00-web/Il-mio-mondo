import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../../data/exercises';
import { MuscleGroup, EquipmentType, Exercise } from '../../types';
import { Search, X, Dumbbell, Sparkles, Plus, Check } from 'lucide-react';

interface ExerciseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
}

export const ExerciseCatalogModal: React.FC<ExerciseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise
}) => {
  const { exercises, addCustomExercise } = useWorkout();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Tutti'>('Tutti');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'Tutti'>('Tutti');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // New Custom exercise form state
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Gambe e Glutei');
  const [customEquip, setCustomEquip] = useState<EquipmentType>('Manubri');
  const [customDesc, setCustomDesc] = useState('');
  const [customTips, setCustomTips] = useState('');

  if (!isOpen) return null;

  // Filter exercises
  const filtered = exercises.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMuscle = selectedMuscle === 'Tutti' || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'Tutti' || ex.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const created = addCustomExercise({
      name: customName.trim(),
      muscleGroup: customMuscle,
      equipment: customEquip,
      description: customDesc.trim() || 'Esercizio personalizzato.',
      targetMuscles: [customMuscle],
      tips: customTips.trim() || undefined
    });

    setCustomName('');
    setCustomDesc('');
    setCustomTips('');
    setShowAddCustom(false);

    if (onSelectExercise) {
      onSelectExercise(created);
    }
  };

  const getEquipmentBadgeColor = (eq: EquipmentType) => {
    switch (eq) {
      case 'Corpo Libero':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Manubri':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Elastici':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-emerald-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-['Quicksand']">
                Catalogo Esercizi Chibi
              </h2>
              <p className="text-xs text-slate-500">
                {filtered.length} esercizi disponibili (Corpo libero, Manubri, Elastici)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3.5 border-b border-emerald-50 bg-[#fafdfb] space-y-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              type="text"
              placeholder="Cerca per nome, muscolo (es. glutei, petto, squat)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-emerald-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Muscle Group horizontal scrollable pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedMuscle('Tutti')}
              className={`px-3 py-1 rounded-xl shrink-0 font-bold transition-colors ${
                selectedMuscle === 'Tutti'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              Tutti i muscoli
            </button>
            {MUSCLE_GROUPS.map(muscle => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-3 py-1 rounded-xl shrink-0 font-bold transition-colors ${
                  selectedMuscle === muscle
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          {/* Equipment selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0 mr-1">
              Attrezzatura:
            </span>
            <button
              onClick={() => setSelectedEquipment('Tutti')}
              className={`px-2.5 py-0.5 rounded-lg shrink-0 text-xs font-semibold ${
                selectedEquipment === 'Tutti'
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
              }`}
            >
              Tutte
            </button>
            {EQUIPMENT_TYPES.map(eq => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-0.5 rounded-lg shrink-0 text-xs font-semibold ${
                  selectedEquipment === eq
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Exercise Accordion / Toggle */}
        <div className="px-4 py-2 border-b border-emerald-100 bg-white">
          {!showAddCustom ? (
            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-dashed border-emerald-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aggiungi un nuovo esercizio personalizzato</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800">
                  Crea Esercizio Personalizzato ✨
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Annulla
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Nome dell'esercizio (es. Hip Thrust con bilanciere)..."
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Gruppo Muscolare</label>
                  <select
                    value={customMuscle}
                    onChange={e => setCustomMuscle(e.target.value as MuscleGroup)}
                    className="w-full px-2 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs"
                  >
                    {MUSCLE_GROUPS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600">Attrezzatura</label>
                  <select
                    value={customEquip}
                    onChange={e => setCustomEquip(e.target.value as EquipmentType)}
                    className="w-full px-2 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs"
                  >
                    {EQUIPMENT_TYPES.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Descrizione breve / esecuzione..."
                  value={customDesc}
                  onChange={e => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Salva nel catalogo
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm font-bold text-slate-600">Nessun esercizio trovato 🌸</p>
              <p className="text-xs text-slate-400 mt-1">
                Prova a cambiare i filtri o aggiungi un esercizio personalizzato.
              </p>
            </div>
          ) : (
            filtered.map(exercise => (
              <div
                key={exercise.id}
                className="bg-white border border-emerald-100 rounded-2xl p-3 hover:border-emerald-300 transition-all hover:shadow-xs group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {exercise.muscleGroup}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getEquipmentBadgeColor(exercise.equipment)}`}>
                        {exercise.equipment}
                      </span>
                      {exercise.isCustom && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                          Personalizzato ✨
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {exercise.description}
                    </p>

                    {exercise.tips && (
                      <div className="mt-2 text-[11px] bg-emerald-50/70 text-emerald-800 p-2 rounded-xl border border-emerald-100/80 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span><strong className="font-semibold">Consiglio Chibi:</strong> {exercise.tips}</span>
                      </div>
                    )}
                  </div>

                  {onSelectExercise && (
                    <button
                      onClick={() => {
                        onSelectExercise(exercise);
                        onClose();
                      }}
                      className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Aggiungi
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
