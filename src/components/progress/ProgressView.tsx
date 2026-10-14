import React, { useState, useMemo } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { BodyMeasurement } from '../../types';
import { CHIBI_MASCOT_PROGRESS } from '../../assets/mascot';
import {
  TrendingUp,
  Scale,
  Ruler,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Check,
  X,
  Edit2
} from 'lucide-react';

type ChartMetric =
  | 'weightKg'
  | 'waistCm'
  | 'hipsCm'
  | 'chestCm'
  | 'thighLeftCm'
  | 'armLeftCm'
  | 'calfCm';

interface ProgressViewProps {
  onOpenGoogleAuth?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onOpenGoogleAuth }) => {
  const { measurements, addMeasurement, deleteMeasurement, profile, updateProfile } = useWorkout();

  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('weightKg');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<BodyMeasurement | null>(null);
  const [clickCounts, setClickCounts] = useState<Record<string, {count: number, timer: number}>>({});

  const handleDeleteMeasurementClick = (id: string) => {
    const current = clickCounts[id] || { count: 0, timer: 0 };
    if (current.timer) clearTimeout(current.timer);

    const newCount = current.count + 1;
    if (newCount === 3) {
      deleteMeasurement(id);
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

  // Sort measurements by date ascending for charts
  const sortedMeasurements = useMemo(() => {
    return [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [measurements]);

  // Latest measurement & First measurement
  const latest = sortedMeasurements[sortedMeasurements.length - 1];
  const previous = sortedMeasurements[sortedMeasurements.length - 2];
  const first = sortedMeasurements[0];

  const hasMeasurements = sortedMeasurements.length > 0;

  // BMI Calculation
  const currentHeight = latest?.heightCm || profile.heightCm || 0;
  const currentWeight = latest?.weightKg;
  const heightMeters = currentHeight > 0 ? currentHeight / 100 : 0;
  const bmi = currentWeight && heightMeters > 0 ? (currentWeight / (heightMeters * heightMeters)).toFixed(1) : null;

  const getBmiCategory = (val: number | null) => {
    if (!val) return { label: 'In attesa di dati', color: 'text-slate-500 bg-slate-50 border-slate-200' };
    if (val < 18.5) return { label: 'Sottopeso', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (val <= 24.9) return { label: 'Normopeso', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 29.9) return { label: 'Sovrappeso lieve', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Oltre la norma', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const bmiInfo = getBmiCategory(bmi ? parseFloat(bmi) : null);

  // Metric metadata
  const METRIC_CONFIG: Record<
    ChartMetric,
    { label: string; unit: string; color: string; stroke: string }
  > = {
    weightKg: { label: 'Peso', unit: 'kg', color: '#10b981', stroke: '#059669' },
    waistCm: { label: 'Vita', unit: 'cm', color: '#ec4899', stroke: '#db2777' },
    hipsCm: { label: 'Fianchi', unit: 'cm', color: '#8b5cf6', stroke: '#7c3aed' },
    chestCm: { label: 'Petto', unit: 'cm', color: '#06b6d4', stroke: '#0891b2' },
    thighLeftCm: { label: 'Coscia', unit: 'cm', color: '#f59e0b', stroke: '#d97706' },
    armLeftCm: { label: 'Braccio', unit: 'cm', color: '#6366f1', stroke: '#4f46e5' },
    calfCm: { label: 'Polpaccio', unit: 'cm', color: '#14b8a6', stroke: '#0d9488' }
  };

  // Form State for new measurement
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weightKg: '' as string | number,
    heightCm: '' as string | number,
    chestCm: '' as string | number,
    waistCm: '' as string | number,
    hipsCm: '' as string | number,
    armLeftCm: '' as string | number,
    armRightCm: '' as string | number,
    thighLeftCm: '' as string | number,
    thighRightCm: '' as string | number,
    calfCm: '' as string | number,
    notes: ''
  });

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeasurement) deleteMeasurement(editingMeasurement.id);
    addMeasurement({
      date: formData.date,
      weightKg: formData.weightKg ? Number(formData.weightKg) : 0,
      heightCm: formData.heightCm ? Number(formData.heightCm) : 0,
      chestCm: formData.chestCm ? Number(formData.chestCm) : undefined,
      waistCm: formData.waistCm ? Number(formData.waistCm) : undefined,
      hipsCm: formData.hipsCm ? Number(formData.hipsCm) : undefined,
      armLeftCm: formData.armLeftCm ? Number(formData.armLeftCm) : undefined,
      armRightCm: formData.armRightCm ? Number(formData.armRightCm) : undefined,
      thighLeftCm: formData.thighLeftCm ? Number(formData.thighLeftCm) : undefined,
      thighRightCm: formData.thighRightCm ? Number(formData.thighRightCm) : undefined,
      calfCm: formData.calfCm ? Number(formData.calfCm) : undefined,
      notes: formData.notes.trim() || undefined
    });

    if (formData.heightCm && Number(formData.heightCm) !== profile.heightCm) {
      updateProfile({ heightCm: Number(formData.heightCm) });
    }

    setShowAddModal(false);
    setEditingMeasurement(null);
  };

  // Prepare chart points
  const chartPoints = useMemo(() => {
    const valid = sortedMeasurements.filter(m => typeof m[selectedMetric] === 'number');
    if (valid.length === 0) return [];

    const values = valid.map(m => m[selectedMetric] as number);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    return valid.map((m, idx) => {
      const val = m[selectedMetric] as number;
      const x = valid.length === 1 ? 50 : (idx / (valid.length - 1)) * 100;
      // Invert Y for SVG coordinates (padding 15% top/bottom)
      const y = 85 - ((val - minVal) / range) * 70;
      return { x, y, value: val, date: m.date, measurement: m };
    });
  }, [sortedMeasurements, selectedMetric]);

  // Format date display
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Delta comparison helper
  const renderDelta = (currentVal?: number, prevVal?: number, unit = 'cm', invertGood = false) => {
    if (currentVal === undefined || prevVal === undefined) return null;
    const diff = +(currentVal - prevVal).toFixed(1);
    if (diff === 0) {
      return (
        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
          <Minus className="w-2.5 h-2.5" /> 0 {unit}
        </span>
      );
    }
    const isPositive = diff > 0;
    // For waist/hips usually reduction is desirable, for glutei maybe increase
    const colorClass = isPositive
      ? invertGood ? 'text-emerald-600' : 'text-slate-500'
      : invertGood ? 'text-slate-500' : 'text-emerald-600';

    return (
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${colorClass}`}>
        {isPositive ? (
          <ArrowUpRight className="w-2.5 h-2.5" />
        ) : (
          <ArrowDownRight className="w-2.5 h-2.5" />
        )}
        {diff > 0 ? `+${diff}` : diff} {unit}
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Banner with Mascot */}
      <div className="green-banner-card bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:bg-none dark:bg-[#064e3b] p-4 rounded-3xl border border-emerald-200 dark:border-emerald-700/80 shadow-sm flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-white/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700/60">
              Tracciamento Metrico ✨
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white font-['Quicksand'] leading-tight">
            I Tuoi Progressi Fisici
          </h2>
          <p className="text-xs text-slate-600 dark:text-emerald-100/90 mt-1">
            Ogni centimetro e ogni traguardo raccontano la tua forza e dedizione!
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
          <img
            src={CHIBI_MASCOT_PROGRESS}
            alt="Mascot Progress"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main KPI Stats Row: Peso, Altezza, BMI, Target */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Peso Attuale */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Peso Attuale</span>
            <Scale className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {currentWeight && currentWeight > 0 ? currentWeight : '--'}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <div className="mt-1">
            {currentWeight && currentWeight > 0 ? (
              renderDelta(latest?.weightKg, previous?.weightKg, 'kg')
            ) : (
              <span className="text-[10px] text-slate-400">Non registrato</span>
            )}
          </div>
        </div>

        {/* Altezza */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Altezza</span>
            <Ruler className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {currentHeight && currentHeight > 0 ? currentHeight : '--'}
            </span>
            <span className="text-xs font-bold text-slate-500">cm</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            {currentHeight && currentHeight > 0 ? `${(currentHeight / 100).toFixed(2)} metri` : '--'}
          </p>
        </div>

        {/* BMI */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">BMI Corporeo</span>
            <Activity className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 font-mono">
              {bmi || '--'}
            </span>
          </div>
          <div className="mt-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${bmiInfo.color}`}>
              {bmiInfo.label}
            </span>
          </div>
        </div>

        {/* Obiettivo Peso */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Target Peso</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-600 font-mono">
              {profile.targetWeightKg && profile.targetWeightKg > 0 ? profile.targetWeightKg.toFixed(1) : '--'}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {profile.targetWeightKg && profile.targetWeightKg > 0 && currentWeight && currentWeight > 0
              ? Math.abs(currentWeight - profile.targetWeightKg) < 0.1
                ? 'Obiettivo raggiunto! 🌸'
                : `${Math.abs(+(currentWeight - profile.targetWeightKg).toFixed(1))} kg dal target`
              : 'Non impostato'}
          </p>
        </div>
      </div>

      {/* Interactive Time Series Chart */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand']">
              Grafico nel Tempo
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Registra Misura
          </button>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {(Object.keys(METRIC_CONFIG) as ChartMetric[]).map(key => {
            const config = METRIC_CONFIG[key];
            const isSelected = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1 rounded-xl shrink-0 font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-emerald-50 text-slate-600 hover:bg-emerald-100'
                }`}
              >
                {config.label} ({config.unit})
              </button>
            );
          })}
        </div>

        {/* SVG Chart Area */}
        <div className="bg-[#fafdfb] rounded-2xl p-3 border border-emerald-50 relative">
          {chartPoints.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <p className="text-xs font-bold text-slate-700">Nessuna misurazione registrata 📏</p>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                I grafici compariranno non appena registrerai le tue prime misurazioni corporee!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registra Misura</span>
              </button>
            </div>
          ) : chartPoints.length === 1 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs font-bold text-slate-700">
                1 misurazione registrata ({chartPoints[0].value} {METRIC_CONFIG[selectedMetric].unit})
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Aggiungi una seconda misurazione per tracciare la linea del grafico nel tempo!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Primo: {chartPoints[0].value} {METRIC_CONFIG[selectedMetric].unit}</span>
                <span className="font-bold text-slate-700">
                  Ultimo: {chartPoints[chartPoints.length - 1].value} {METRIC_CONFIG[selectedMetric].unit}
                </span>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative h-44 w-full">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86efac" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#86efac" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="15" x2="100" y2="15" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.5" />
                  <line x1="0" y1="85" x2="100" y2="85" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.5" />

                  {/* Area fill */}
                  <polygon
                    points={`0,100 ${chartPoints.map(p => `${p.x},${p.y}`).join(' ')} 100,100`}
                    fill="url(#chartGradient)"
                  />

                  {/* Smooth curve line */}
                  <polyline
                    fill="none"
                    stroke={METRIC_CONFIG[selectedMetric].stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  />

                  {/* Data Points */}
                  {chartPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke={METRIC_CONFIG[selectedMetric].stroke}
                        strokeWidth="2"
                        className="transition-all hover:r-5 cursor-pointer"
                      />
                    </g>
                  ))}
                </svg>

                {/* Point Labels Overlay */}
                <div className="absolute inset-0 pointer-events-none flex justify-between items-end px-1 pb-1">
                  {chartPoints.map((p, idx) => (
                    <div
                      key={idx}
                      className="text-center"
                      style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        transform: 'translateX(-50%)',
                        bottom: '2px'
                      }}
                    >
                      <span className="text-[9px] font-mono text-slate-400 block whitespace-nowrap">
                        {formatDateLabel(p.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body Measurements Cards Grid (Petto, Vita, Fianchi, Coscia, Braccio, Polpaccio) */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand'] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Circonferenze Corporee (cm)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Vita */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Vita
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.waistCm || '--'}
              </span>
              <span className="text-xs text-slate-500">cm</span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.waistCm, previous?.waistCm, 'cm')}
            </div>
          </div>

          {/* Fianchi */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Fianchi / Glutei
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.hipsCm || '--'}
              </span>
              <span className="text-xs text-slate-500">cm</span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.hipsCm, previous?.hipsCm, 'cm', true)}
            </div>
          </div>

          {/* Petto */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Petto
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.chestCm || '--'}
              </span>
              <span className="text-xs text-slate-500">cm</span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.chestCm, previous?.chestCm, 'cm')}
            </div>
          </div>

          {/* Coscia */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Coscia (Sx / Dx)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.thighLeftCm || '--'}
              </span>
              <span className="text-xs text-slate-500">
                {latest?.thighRightCm ? `/ ${latest.thighRightCm} cm` : 'cm'}
              </span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.thighLeftCm, previous?.thighLeftCm, 'cm')}
            </div>
          </div>

          {/* Braccio */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Braccio (Sx / Dx)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.armLeftCm || '--'}
              </span>
              <span className="text-xs text-slate-500">
                {latest?.armRightCm ? `/ ${latest.armRightCm} cm` : 'cm'}
              </span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.armLeftCm, previous?.armLeftCm, 'cm')}
            </div>
          </div>

          {/* Polpaccio */}
          <div className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Polpaccio
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-800 font-mono">
                {latest?.calfCm || '--'}
              </span>
              <span className="text-xs text-slate-500">cm</span>
            </div>
            <div className="mt-1">
              {renderDelta(latest?.calfCm, previous?.calfCm, 'cm')}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Entries Timeline */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand'] flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Storico Registrazioni ({measurements.length})
        </h3>

        <div className="space-y-2.5">
          {measurements.length === 0 ? (
            <div className="text-center py-6 bg-[#fafdfb] rounded-2xl border border-dashed border-emerald-200 p-4">
              <p className="text-xs font-bold text-slate-700">Nessuna registrazione presente</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Le misurazioni del tuo corpo e del peso compariranno qui in ordine cronologico.
              </p>
            </div>
          ) : (
            [...measurements].reverse().map((m, idx) => (
            <div
              key={m.id}
              className="bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {new Date(m.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                        Più recente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1 text-slate-600 font-medium flex-wrap">
                    <span>
                      <strong className="text-emerald-700">{m.weightKg} kg</strong>
                    </span>
                    {m.waistCm && <span>Vita: <strong>{m.waistCm} cm</strong></span>}
                    {m.hipsCm && <span>Fianchi: <strong>{m.hipsCm} cm</strong></span>}
                    {m.thighLeftCm && <span>Coscia: <strong>{m.thighLeftCm} cm</strong></span>}
                  </div>
                  {m.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      "{m.notes}"
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                    <button onClick={() => { setEditingMeasurement(m); setFormData({
                        date: m.date,
                        weightKg: m.weightKg || '',
                        heightCm: m.heightCm || '',
                        chestCm: m.chestCm || '',
                        waistCm: m.waistCm || '',
                        hipsCm: m.hipsCm || '',
                        armLeftCm: m.armLeftCm || '',
                        armRightCm: m.armRightCm || '',
                        thighLeftCm: m.thighLeftCm || '',
                        thighRightCm: m.thighRightCm || '',
                        calfCm: m.calfCm || '',
                        notes: m.notes || ''
                    }); setShowAddModal(true); }} className="p-1.5 text-emerald-500 hover:text-emerald-600 rounded-lg transition-colors" title="Modifica misurazione">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeasurementClick(m.id)}
                      className={`p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all ${(clickCounts[m.id]?.count || 0) > 0 ? 'scale-125' : ''}`}
                      title="Elimina misurazione"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
              </div>
            </div>
          ))) }
        </div>
      </div>

      {/* Add Measurement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 animate-scaleUp">
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand']">
                    Nuova Misurazione Corporea
                  </h3>
                  <p className="text-xs text-slate-500">Inserisci i tuoi dati in unità metriche</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="p-4 space-y-3 text-xs">
              {/* Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Data Misurazione
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold"
                  required
                />
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    value={formData.weightKg}
                    onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Altezza (cm) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="250"
                    value={formData.heightCm}
                    onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase block mb-2">
                  Circonferenze in centimetri (cm)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Vita</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.waistCm}
                      onChange={e => setFormData({ ...formData, waistCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Fianchi</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.hipsCm}
                      onChange={e => setFormData({ ...formData, hipsCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Petto</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.chestCm}
                      onChange={e => setFormData({ ...formData, chestCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Coscia Sx</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.thighLeftCm}
                      onChange={e => setFormData({ ...formData, thighLeftCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Braccio Sx</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.armLeftCm}
                      onChange={e => setFormData({ ...formData, armLeftCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Polpaccio</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.calfCm}
                      onChange={e => setFormData({ ...formData, calfCm: e.target.value })}
                      className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      placeholder="cm"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Note Personali
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Es. Sensazione di sgonfiore, miglior definizione..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-xs"
                >
                  Salva Dati
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
