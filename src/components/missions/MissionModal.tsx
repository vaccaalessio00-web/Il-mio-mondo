import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { X, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface Mission {
  id: string;
  title: string;
  category: string;
  xpReward: number;
}

const ALL_MISSIONS: Mission[] = [
  // Ansia, Respiro & Mente
  { id: 'm_mind_1', title: 'Medita per 10 minuti', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_2', title: 'Medita per 15 minuti', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_3', title: 'Esegui 5 minuti di respirazione diaframmatica', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_4', title: 'Fai 3 sessioni di respirazione 4-7-8 durante la giornata', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_5', title: 'Trascorri 10 minuti in silenzio totale senza musica o podcast', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_7', title: 'Spegni tutti gli schermi 45 minuti prima di dormire', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_8', title: 'Scrivi i pensieri o preoccupazioni sul diario prima di andare a letto', category: 'Ansia, Respiro & Mente', xpReward: 2 },
  { id: 'm_mind_9', title: 'Fai una doccia calda di 8 minuti concentrandoti solo sul rilassamento muscolare', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_10', title: 'Ascolta una sessione di Non-Sleep Deep Rest o Yoga Nidra da 10 minuti', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_11', title: 'Resta sdraiato con le gambe alzate al muro per 7 minuti', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_12', title: 'Fai 10 minuti di stretching per collo e spalle a metà giornata', category: 'Ansia, Respiro & Mente', xpReward: 1 },
  { id: 'm_mind_13', title: 'Trascorri 15 minuti all\'aperto sotto la luce naturale prima delle 10:00', category: 'Ansia, Respiro & Mente', xpReward: 1 },

  // Attività Fisica & Movimento
  { id: 'm_fit_16', title: 'Raggiungi 6.000 passi giornalieri', category: 'Attività Fisica & Movimento', xpReward: 1 },
  { id: 'm_fit_17', title: 'Raggiungi 8.000 passi giornalieri', category: 'Attività Fisica & Movimento', xpReward: 2 },
  { id: 'm_fit_18', title: 'Raggiungi 10.000 passi giornalieri', category: 'Attività Fisica & Movimento', xpReward: 3 },
  { id: 'm_fit_19', title: 'Fai una camminata rilassante all\'aperto di 20 minuti a passo lento', category: 'Attività Fisica & Movimento', xpReward: 1 },
  { id: 'm_fit_20', title: 'Fai una camminata di 10 minuti subito dopo il pranzo o la cena', category: 'Attività Fisica & Movimento', xpReward: 1 },
  { id: 'm_fit_21', title: 'Esegui 3 serie da 10 squat a corpo libero', category: 'Attività Fisica & Movimento', xpReward: 2 },
  { id: 'm_fit_22', title: 'Fai 3 serie da 8 piegamenti', category: 'Attività Fisica & Movimento', xpReward: 2 },
  { id: 'm_fit_23', title: 'Mantieni 45 secondi di Wall Sit per 3 volte', category: 'Attività Fisica & Movimento', xpReward: 1 },
  { id: 'm_fit_24', title: 'Fai 3 serie da 30 secondi di plank frontale', category: 'Attività Fisica & Movimento', xpReward: 1 },
  { id: 'm_fit_26', title: 'Fai 15 minuti di allenamento di forza con manubri o pesi', category: 'Attività Fisica & Movimento', xpReward: 3 },
  { id: 'm_fit_27', title: 'Completa 20 minuti di circuito full-body contro resistenza', category: 'Attività Fisica & Movimento', xpReward: 3 },
  { id: 'm_fit_28', title: 'Fai 10 minuti di mobilità per anche e colonna vertebrale', category: 'Attività Fisica & Movimento', xpReward: 1 },

  // Nutrizione & Surplus Calorico
  { id: 'm_nutr_29', title: 'Consuma 5 pasti o spuntini distribuiti nell\'arco della giornata', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_32', title: 'Aggiungi 2 cucchiai di olio extravergine d\'oliva in più nei tuoi piatti di oggi', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_33', title: 'Aggiungi 1 cucchiaio colmo di burro di arachidi a colazione o a merenda', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_34', title: 'Consuma una porzione di carboidrati complessi sia a pranzo che a cena', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_36', title: 'Consuma uno spuntino pre-nanna ad alto contenuto proteico 45 minuti prima di dormire', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_37', title: 'Bevi almeno 2 litri d\'acqua nel corso della giornata', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_41', title: 'Non saltare nessuno spuntino programmato per l\'intera giornata', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },
  { id: 'm_nutr_42', title: 'Aggiungi 1 porzione extra di carboidrati al piatto principale', category: 'Nutrizione & Surplus Calorico', xpReward: 1 },

  // Sonno, Recupero & Routine
  { id: 'm_recov_43', title: 'Dormi per almeno 8 ore consecutive stanotte', category: 'Sonno, Recupero & Routine', xpReward: 1 },
  { id: 'm_recov_44', title: 'Vai a letto entro le 23:00 per favorire il recupero ormonale', category: 'Sonno, Recupero & Routine', xpReward: 1 },
  { id: 'm_recov_46', title: 'Fai 10 minuti di lettura rilassante su carta a letto prima di spegnere la luce', category: 'Sonno, Recupero & Routine', xpReward: 1 },
  { id: 'm_recov_48', title: 'Fai 5 minuti di check-in corporeo a letto prima di addormentarti', category: 'Sonno, Recupero & Routine', xpReward: 1 },
  { id: 'm_recov_49', title: 'Registra il tuo livello di stress da 1 a 10 a fine giornata', category: 'Sonno, Recupero & Routine', xpReward: 1 },
];

// Pesi per far comparire molto più frequentemente le missioni preferite
const MISSION_WEIGHTS: Record<string, number> = {
  m_fit_17: 10,   // Raggiungi 8.000 passi giornalieri (frequenza notevolmente incrementata)
  m_recov_49: 10, // Registra il tuo livello di stress da 1 a 10 a fine giornata (frequenza notevolmente incrementata)
};

const selectWeightedDailyMissions = (missions: Mission[], count: number = 3): Mission[] => {
  const pool = [...missions];
  const selected: Mission[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const weights = pool.map(m => MISSION_WEIGHTS[m.id] || 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let randomVal = Math.random() * totalWeight;
    let chosenIndex = 0;

    for (let j = 0; j < pool.length; j++) {
      randomVal -= weights[j];
      if (randomVal <= 0) {
        chosenIndex = j;
        break;
      }
    }

    selected.push(pool[chosenIndex]);
    pool.splice(chosenIndex, 1);
  }

  return selected;
};

const getDailyMissions = () => {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `missions_${today}_v3`;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed: Mission[] = JSON.parse(saved);
      // Assicura che le missioni salvate appartengano alla lista aggiornata
      const valid = parsed.filter(m => ALL_MISSIONS.some(am => am.id === m.id));
      if (valid.length === 3) {
        return valid.map(m => ALL_MISSIONS.find(am => am.id === m.id) || m);
      }
    } catch {
      // fallback
    }
  }
  
  // Seleziona 3 missioni con estrazione pesata per dare priorità a 8k passi e stress
  const selected = selectWeightedDailyMissions(ALL_MISSIONS, 3);
  localStorage.setItem(storageKey, JSON.stringify(selected));
  return selected;
};

export const MissionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { profile, completeMission, undoMissionCompletion, measurements } = useWorkout();
  const [showRewards, setShowRewards] = useState(false);
  const [dailyMissions] = useState(() => getDailyMissions());
  const isSecretRewardUnlocked = measurements.some(m => m.weightKg > 42);

  const xpNeeded = profile.level * 8;
  const maxXp = profile.level >= 10 ? 999 : xpNeeded;
  const progressPercent = (profile.xp / maxXp) * 100;

  const handleMissionClick = (mission: Mission, isCompleted: boolean) => {
    if (isCompleted) {
      undoMissionCompletion(mission.id, mission.xpReward);
    } else {
      soundManager.playMissionComplete();
      completeMission(mission.id, mission.xpReward);
    }
  };

  const completedCount = dailyMissions.filter(m => profile.completedMissions.includes(m.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 animate-scaleUp flex flex-col max-h-[85vh]">
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-b border-emerald-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand']">
                {showRewards ? 'Ricompense Sbloccabili' : 'Missioni Giornaliere'}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {showRewards ? 'Raggiungi nuovi livelli' : `3 missioni di oggi (${completedCount}/3 completate)`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {showRewards ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-800 space-y-1">
                {profile.level < 2 && <p>🏆 <strong>Livello 2:</strong> Sblocca Charlotte e Phalo</p>}
                {profile.level < 3 && <p>🏆 <strong>Livello 3:</strong> Sblocca Coach Engfa e Tofu</p>}
                {profile.level < 4 && <p>🏆 <strong>Livello 4:</strong> Sblocca Dobby e Kraprao</p>}
                {profile.level < 9 && <p>🏆 <strong>Livelli 5-9:</strong> Regalo da Pop Mart</p>}
                {profile.level < 10 && <p>🏆 <strong>Livello 10:</strong> Mega Regalo da Pop Mart</p>}
                <div className="flex items-center gap-2">
                   <p>🏆 <strong>Ricompensa Segreta:</strong> {isSecretRewardUnlocked ? '-Viaggio-' : '???'}</p>
                </div>
              </div>
              <button onClick={() => setShowRewards(false)} className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200">
                Torna alle Missioni
              </button>
            </div>
          ) : (
            <>
              {/* Level Progress */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="text-xs font-bold text-slate-600 shrink-0 whitespace-nowrap">Livello {profile.level}</span>
                  <span className="text-xs font-bold text-emerald-600 shrink-0 whitespace-nowrap">
                    {profile.xp} / {profile.level >= 10 ? '999' : xpNeeded} XP
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Missions List (Daily 3 only) */}
              <div className="space-y-2">
                {dailyMissions.map(mission => {
                  const isCompleted = profile.completedMissions.includes(mission.id);
                  return (
                    <div
                      key={mission.id}
                      className={`flex items-center justify-between gap-2.5 p-3 rounded-2xl border transition-all ${
                        isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 mb-0.5">
                            {mission.category}
                          </span>
                          <p className={`text-xs font-bold leading-snug ${isCompleted ? 'text-emerald-800 line-through opacity-80' : 'text-slate-700'}`}>
                            {mission.title}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMissionClick(mission, isCompleted)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 whitespace-nowrap select-none transition-all ${
                          isCompleted
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-2xs'
                        }`}
                      >
                        {isCompleted ? 'Fatto' : `+${mission.xpReward}\u00A0XP`}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <button onClick={() => setShowRewards(true)} className="w-full py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-200">
                Visualizza Ricompense
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
