import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { ChevronLeft, ChevronRight, X, Sparkles, AlertCircle, Search, Lightbulb, CheckCircle } from 'lucide-react';
import { getRandomPuzzolaCalmingPhrase } from '../../data/calmingPhrases';
import { CHIBI_BOYFRIEND_PUZZOLA } from '../../assets/mascot';
import { DIARIO_PAGINA8_IMAGE, DIARIO_PAGINA8_IMAGES } from '../../assets/minigames';

export const AnxietyJournal: React.FC<{ onClose: () => void; initialData?: any }> = ({ onClose, initialData }) => {
  const { anxietyJournalEntries, setAnxietyJournalEntries } = useWorkout();
  const [currentStep, setCurrentStep] = useState(1);
  // Seleziona un'immagine a random tra quelle caricate per pagina 8
  const [page8Image] = useState<string>(() => {
    if (DIARIO_PAGINA8_IMAGES.length > 0) {
      return DIARIO_PAGINA8_IMAGES[Math.floor(Math.random() * DIARIO_PAGINA8_IMAGES.length)];
    }
    if (DIARIO_PAGINA8_IMAGE) return DIARIO_PAGINA8_IMAGE;
    try {
      const saved = localStorage.getItem('fitworld_custom_mascots');
      const custom = saved ? JSON.parse(saved) : {};
      if (custom.puzzola) return custom.puzzola;
    } catch {}
    return CHIBI_BOYFRIEND_PUZZOLA;
  });
  const [formData, setFormData] = useState({
    area: '',
    sensazione: '',
    pensiero: '',
    credenzaIniziale: 50,
    distorsioni: [] as string[],
    provePro: '',
    proveContro: '',
    spiegazione1: '',
    spiegazione2: '',
    nuovaProspettiva: '',
    credenzaFinale: 50,
    liberaLaMente: '',
    fraseCalmante: initialData?.fraseCalmante || getRandomPuzzolaCalmingPhrase(),
    ...initialData
  });

  const updateData = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const toggleDistorsione = (d: string) => {
    setFormData(prev => {
      if (prev.distorsioni.includes(d)) return { ...prev, distorsioni: prev.distorsioni.filter(item => item !== d) };
      if (prev.distorsioni.length >= 2) return prev;
      return { ...prev, distorsioni: [...prev.distorsioni, d] };
    });
  };

  const next = () => setCurrentStep(prev => Math.min(prev + 1, 8));
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-900 text-lg">Cosa ha attirato la tua attenzione?</h3>
            <p className="text-sm text-emerald-700/80">Descrivi solo il dato di fatto oggettivo, senza giudizi o diagnosi (es. "Ho sentito una fitta al petto", "Ho letto una notizia online").</p>
            <input placeholder="Area del corpo / Situazione" className="w-full p-3 bg-white border border-emerald-100 rounded-xl" value={formData.area} onChange={e => updateData('area', e.target.value)} />
            <textarea placeholder="Es. Ho avvertito un battito irregolare mentre ero seduto alla scrivania." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-24" value={formData.sensazione} onChange={e => updateData('sensazione', e.target.value)} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-900 text-lg">Qual è il pensiero automatico?</h3>
            <p className="text-sm text-emerald-700/80">Qual è la peggiore conclusione a cui la tua mente è saltata immediatamente?</p>
            <textarea placeholder="Es. Mi sta venendo un infarto e non farò in tempo a chiedere aiuto." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-24" value={formData.pensiero} onChange={e => updateData('pensiero', e.target.value)} />
            <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800">Quanto ci credi? ({formData.credenzaIniziale}%)</label>
                <input type="range" min="0" max="100" className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" value={formData.credenzaIniziale} onChange={e => updateData('credenzaIniziale', parseInt(e.target.value))} />
            </div>
          </div>
        );
      case 3:
        const distorsioni = [
            { id: 'cat', title: '⚠️ Catastrofizzazione', desc: 'Salto direttamente allo scenario peggiore possibile.' },
            { id: 'att', title: '🔍 Attenzione selettiva', desc: 'Mi concentro solo su questa sensazione ignorando tutto il resto.' },
            { id: 'emo', title: '💡 Ragionamento emotivo', desc: 'Lo sento come vero, quindi deve essere pericoloso.' },
            { id: 'inc', title: '🛑 Intolleranza incertezza', desc: 'Se non ho la certezza assoluta, sono malato.' },
        ];
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-900 text-lg">Che "trappola mentale" sta scattando?</h3>
            <p className="text-sm text-emerald-700/80">Le nostre menti usano schemi fissi quando siamo in allerta. Riconosci uno di questi?</p>
            {distorsioni.map(d => (
                <button key={d.id} onClick={() => toggleDistorsione(d.id)} className={`w-full text-left p-3 rounded-xl border ${formData.distorsioni.includes(d.id) ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-emerald-50'}`}>
                    <p className="font-bold text-emerald-900 text-sm">{d.title}</p>
                    <p className="text-xs text-emerald-700">{d.desc}</p>
                </button>
            ))}
          </div>
        );
      case 4:
        return (
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-900 text-lg">Mettiamo alla prova questo pensiero</h3>
              <textarea placeholder="Solo fatti medici oggettivi, non sensazioni (es. 'Ho solo la fitta al petto')." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-20" value={formData.provePro} onChange={e => updateData('provePro', e.target.value)} />
              <textarea placeholder="Es. 'Mi è già capitato 10 volte ed era solo reflusso/ansia', 'Ho fatto gli esami poco tempo fa ed erano nella norma'." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-24" value={formData.proveContro} onChange={e => updateData('proveContro', e.target.value)} />
            </div>
        );
      case 5:
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-emerald-900 text-lg">Quali sono le spiegazioni più probabili?</h3>
                <p className="text-sm text-emerald-700/80">Se un tuo caro amico provasse la stessa cosa, quale causa comune e innocua ipotizzeresti?</p>
                <input placeholder="Spiegazione alternativa 1 (Più probabile)" className="w-full p-3 bg-white border border-emerald-100 rounded-xl" value={formData.spiegazione1} onChange={e => updateData('spiegazione1', e.target.value)} />
                <input placeholder="Spiegazione alternativa 2 (Fattore ansia)" className="w-full p-3 bg-white border border-emerald-100 rounded-xl" value={formData.spiegazione2} onChange={e => updateData('spiegazione2', e.target.value)} />
            </div>
        );
      case 6:
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-emerald-900 text-lg">Il pensiero realistico</h3>
                <textarea placeholder="Riscrivi la situazione tenendo conto di tutte le alternative." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-24" value={formData.nuovaProspettiva} onChange={e => updateData('nuovaProspettiva', e.target.value)} />
                <div className="text-sm text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-100 italic">
                    "Anche se sento [sensazione], è molto più probabile che sia [spiegazione alternativa] piuttosto che [pensiero catastrofico]. Posso aspettare senza agire subito."
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-emerald-800">Quanto ci credi ORA? ({formData.credenzaFinale}%)</label>
                    <input type="range" min="0" max="100" className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" value={formData.credenzaFinale} onChange={e => updateData('credenzaFinale', parseInt(e.target.value))} />
                </div>
            </div>
        );
      case 7:
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-emerald-900 text-lg">Libera la mente / Note</h3>
                <p className="text-sm text-emerald-700/80">Usa questo spazio per aggiungere note extra, riflessioni libere o pensieri aggiuntivi.</p>
                <textarea placeholder="Scrivi qui..." className="w-full p-3 bg-white border border-emerald-100 rounded-xl h-40" value={formData.liberaLaMente} onChange={e => updateData('liberaLaMente', e.target.value)} />
            </div>
        );
      case 8: {
        return (
            <div className="space-y-4 text-center">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-200 shrink-0 shadow-sm bg-white flex items-center justify-center">
                    <img src={page8Image} alt="Mascotte Pagina 8" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 italic text-md text-emerald-900 font-semibold shadow-inner flex-1">
                      "{formData.fraseCalmante}"
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-emerald-800 tracking-wide whitespace-nowrap text-center">
                  Ricorda sempre che sei la mia culona stellare ✨
                </p>
            </div>
        );
      }
      default: return null;
    }
  };

  const saveEntry = () => {
    const entry = {
        ...formData,
        id: formData.id || Date.now().toString(),
        date: formData.date || new Date().toLocaleDateString('it-IT')
    };
    
    // If editing, replace, else add
    const exists = anxietyJournalEntries.find((e: any) => e.id === entry.id);
    if (exists) {
        setAnxietyJournalEntries(prev => prev.map((e: any) => e.id === entry.id ? entry : e));
    } else {
        setAnxietyJournalEntries(prev => [entry, ...prev]);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f4fcf7] p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-emerald-900">Diario Anti-Ansia</h2>
        <button onClick={onClose} className="p-2 bg-emerald-100/50 rounded-full text-emerald-900"><X className="w-5 h-5" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-6 scrollbar-none">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
        <button onClick={prev} disabled={currentStep === 1} className="p-3 bg-white border border-emerald-100 rounded-xl disabled:opacity-50"><ChevronLeft className="w-6 h-6 text-emerald-800" /></button>
        <span className="text-sm font-bold text-emerald-700">Step {currentStep} di 8</span>
        <button onClick={currentStep === 8 ? saveEntry : next} className="p-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">
            {currentStep === 8 ? 'Salva' : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
