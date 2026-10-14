import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { CHIBI_MASCOT_MAIN } from '../../assets/mascot';
import {
  ShieldCheck,
  User,
  Volume1,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface SettingsViewProps {
  onOpenGoogleAuth?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenGoogleAuth }) => {
  const {
    profile,
    loginWithGoogle,
    logoutGoogle,
    updateProfile
  } = useWorkout();

  const [inputName, setInputName] = useState(profile.name);
  const [inputTargetWeight, setInputTargetWeight] = useState(profile.targetWeightKg ? profile.targetWeightKg.toString() : '');
  const [inputHeight, setInputHeight] = useState(profile.heightCm === 0 ? '' : profile.heightCm.toString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    const isUnderscore = trimmed.toLowerCase() === '_' || trimmed.toLowerCase() === 'underscore';
    updateProfile({
      name: trimmed,
      targetWeightKg: inputTargetWeight ? parseFloat(inputTargetWeight) : undefined,
      heightCm: inputHeight ? parseInt(inputHeight) : 0,
      ...(isUnderscore ? { level: 10, xp: 999 } : {})
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Settings Header */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-emerald-50">
            <img
              src={CHIBI_MASCOT_MAIN}
              alt="Chibi Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 font-['Quicksand']">
              Profilo & Impostazioni
            </h2>
            <p className="text-xs text-slate-500">
              Gestisci le tue informazioni e preferenze
            </p>
          </div>
        </div>
      </div>

      {/* Google Account Card */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Accesso Google
              </h3>
              <p className="text-[11px] text-slate-500">
                Sincronizza e tieni traccia dei progressi
              </p>
            </div>
          </div>

          {profile.isLoggedIn && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Sincronizzato
            </span>
          )}
        </div>

        {profile.isLoggedIn ? (
          <div className="bg-[#fafdfb] p-3.5 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">
                    {profile.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{profile.email}</p>
                </div>
              </div>

              <button
                onClick={logoutGoogle}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1"
              >
                Disconnetti
              </button>
            </div>
            <p className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-50">
              I tuoi allenamenti e le misurazioni corporee sono salvati in modo sicuro e accessibili ovunque.
            </p>
          </div>
        ) : (
          <div className="text-center p-3 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200">
            <p className="text-xs text-slate-600 mb-2">
              Accedi con il tuo account Google per salvare e sincronizzare tutte le schede e i progressi.
            </p>
            <button
              onClick={() => {
                if (onOpenGoogleAuth) {
                  onOpenGoogleAuth();
                } else {
                  loginWithGoogle();
                }
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs border border-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Accedi con Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Parameters Form (Target Weight, Height, Name) */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand'] flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            Dati Personali & Obiettivi
          </h3>
          {isSaved && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Salvato!
            </span>
          )}
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Nome o Nickname
            </label>
            <input
              type="text"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#043d2e] border border-emerald-200 dark:border-emerald-600 rounded-xl font-bold dark:text-emerald-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Altezza Base (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputHeight}
                  onChange={e => setInputHeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">
                  cm
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Obiettivo Peso (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={inputTargetWeight}
                  onChange={e => setInputTargetWeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-emerald-200 rounded-xl font-bold text-emerald-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 rounded-xl shadow-xs transition-colors"
        >
          Aggiorna Obiettivi
        </button>
      </form>

      {/* Preferences (Audio & Units) */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand'] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Preferenze App & Suoni
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Audio Chime Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#fafdfb] rounded-2xl border border-emerald-50">
            <div className="flex items-center gap-2">
              {profile.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <span className="font-bold text-slate-800 block">
                  Suoni & Campanella Recupero
                </span>
                <span className="text-[10px] text-slate-500">
                  Attiva o disattiva tutti i suoni dell'app
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const nextState = !profile.soundEnabled;
                updateProfile({ soundEnabled: nextState });
                soundManager.setSoundEnabled(nextState);
                if (nextState) {
                  soundManager.playVolumePreview();
                }
              }}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                profile.soundEnabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Regolazione Livello Volume */}
          <div className="p-3 bg-[#fafdfb] rounded-2xl border border-emerald-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(profile.soundVolume ?? 80) === 0 || !profile.soundEnabled ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (profile.soundVolume ?? 80) < 50 ? (
                  <Volume1 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">
                    Livello del Volume
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Regola l'intensità di timer, gomitolo e melodie
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                {profile.soundVolume ?? 80}%
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-2.5 pt-1">
              <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={profile.soundVolume ?? 80}
                onChange={e => {
                  const val = Number(e.target.value);
                  updateProfile({ soundVolume: val, soundEnabled: val > 0 ? true : profile.soundEnabled });
                  soundManager.setVolume(val / 100);
                  if (val > 0) {
                    soundManager.setSoundEnabled(true);
                  }
                  soundManager.playVolumePreview();
                }}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>

            {/* Pulsanti Rapidi Livello Volume */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              {[20, 40, 60, 80, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    updateProfile({ soundVolume: val, soundEnabled: true });
                    soundManager.setSoundEnabled(true);
                    soundManager.setVolume(val / 100);
                    soundManager.playVolumePreview();
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    (profile.soundVolume ?? 80) === val
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Unit System */}
          <div className="flex items-center justify-between p-2.5 bg-[#fafdfb] rounded-2xl border border-emerald-50">
            <div>
              <span className="font-bold text-slate-800 block">
                Unità di Misura
              </span>
              <span className="text-[10px] text-slate-500">
                Chilogrammi (kg) e Centimetri (cm)
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-xl">
              Metrico (standard)
            </span>
          </div>
        </div>
      </div>

      {/* App Info & Cute Footer */}
      <div className="text-center p-3 text-slate-400 space-y-1">
        <p className="text-[11px] font-bold text-slate-500">
          MyWorld v1.0.0 • Fitness & Benessere verde pastello 🍃👓
        </p>
        <p className="text-[10px]">
          Allenati con dolcezza, costanza e determinazione ✨
        </p>
      </div>
    </div>
  );
};
