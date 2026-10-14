import React, { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { X, ShieldCheck, Check, Sparkles, UserCheck, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { CHIBI_MASCOT_MAIN } from '../../assets/mascot';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { profile, loginWithGoogle, logoutGoogle, isOnline, isSyncing, syncAccount, lastSyncedAt } = useWorkout();

  const [inputEmail, setInputEmail] = useState('under.underscore.00@gmail.com');
  const [inputName, setInputName] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (emailToUse: string, nameToUse?: string) => {
    setStatusMessage('Recupero dei dati del tuo account in corso...');
    setTimeout(() => {
      loginWithGoogle(emailToUse, nameToUse);
      setStatusMessage('Accesso completato! Schede e progressi recuperati.');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
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
              <h3 className="text-sm font-extrabold text-slate-800 font-['Quicksand']">
                Accesso con Google
              </h3>
              <p className="text-[11px] text-slate-500">Recupera e sincronizza i tuoi dati</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 bg-[#fafdfb] p-3 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-200 shrink-0">
              <img
                src={CHIBI_MASCOT_MAIN}
                alt="MyWorld Mascot"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Effettua l'accesso con il tuo account Google per salvare e recuperare le tue schede e tutti i tuoi progressi fisici su qualsiasi dispositivo! 🍃
            </p>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          {profile.isLoggedIn ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      Account Connesso
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 block">
                      {profile.email}
                    </span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {isOnline ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Wifi className="w-3.5 h-3.5" /> Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <WifiOff className="w-3.5 h-3.5" /> Offline
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => syncAccount()}
                    disabled={isSyncing || !isOnline}
                    className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 px-2 py-1 rounded-lg shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizzo...' : 'Sincronizza ora'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  I progressi effettuati offline si sincronizzano in automatico appena ti ricolleghi a internet.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    logoutGoogle();
                    onClose();
                  }}
                  className="flex-1 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
                >
                  Disconnetti Account
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-xs transition-colors"
                >
                  Fatto
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Quick 1-click button for user's account */}
              <button
                onClick={() => handleLogin('under.underscore.00@gmail.com', 'Utente MyWorld')}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    U
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block group-hover:text-emerald-700">
                      under.underscore.00@gmail.com
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tocca per accedere e recuperare i dati
                    </span>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-emerald-500" />
              </button>

              <div className="flex items-center gap-2 my-2 text-slate-300 text-[10px] uppercase font-bold">
                <div className="h-px bg-slate-200 flex-1" />
                <span>oppure inserisci un'altra email</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Custom Google Email input */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="nome@gmail.com"
                  value={inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                />

                <button
                  onClick={() => {
                    if (inputEmail.trim()) {
                      handleLogin(inputEmail.trim(), inputName.trim() || undefined);
                    }
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accedi & Recupera Dati</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
