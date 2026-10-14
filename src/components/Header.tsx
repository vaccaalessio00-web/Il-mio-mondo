import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Sparkles, ShieldCheck, Dumbbell, Trophy, Plane, WifiOff, RefreshCw } from 'lucide-react';
import { APP_CUSTOM_LOGO } from '../assets/logo';

interface HeaderProps {
  onOpenCatalog?: () => void;
  onOpenSettings: () => void;
  onOpenGoogleAuth?: () => void;
  onOpenMissions: () => void;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenGoogleAuth,
  onOpenMissions,
  onOpenTour
}) => {
  const { profile, measurements, isOnline, isSyncing, syncAccount, pendingOfflineChanges } = useWorkout();
  const isSecretRewardUnlocked = measurements.some(m => m.weightKg > 42);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 px-4 py-2.5 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Title: MyWorld Logo (Custom Logo or Globe with Dumbbell) */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {APP_CUSTOM_LOGO ? (
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-emerald-200 overflow-hidden shadow-xs flex items-center justify-center">
                <img
                  src={APP_CUSTOM_LOGO}
                  alt="MyWorld Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-xs relative overflow-hidden border-2 border-emerald-200">
                {/* Globe lines pattern */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-emerald-100/90"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                {/* Dumbbell centered over the world */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 p-1 rounded-full shadow-xs -rotate-45 border border-emerald-100">
                    <Dumbbell className="w-3.5 h-3.5 text-emerald-700 stroke-[2.4]" />
                  </div>
                </div>
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-1 h-1 bg-white rounded-full" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-800 tracking-tight font-['Quicksand']">
                My<span className="text-emerald-500">World</span>
              </h1>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Pastel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Schede & Benessere
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline / Syncing Indicator */}
          {!isOnline ? (
            <div
              className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 rounded-full text-[10px] font-extrabold shadow-2xs"
              title="Modalità offline: l'app funziona senza internet e salverà tutto sul dispositivo"
            >
              <WifiOff className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>Offline</span>
              {pendingOfflineChanges > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px]">
                  {pendingOfflineChanges}
                </span>
              )}
            </div>
          ) : isSyncing ? (
            <div
              className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-[10px] font-extrabold shadow-2xs animate-pulse"
              title="Sincronizzazione account in corso..."
            >
              <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
              <span>Sincronizzo...</span>
            </div>
          ) : null}

          {/* Chibi Guided Tour Trigger */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 dark:from-emerald-950/70 dark:to-teal-950/70 dark:text-emerald-200 text-emerald-800 rounded-full border border-emerald-300 dark:border-emerald-700 transition-all flex items-center justify-center active:scale-95 shadow-2xs cursor-pointer"
              title="Guida con Puff"
              aria-label="Guida con Puff"
            >
              <span className="text-base leading-none">🐾</span>
            </button>
          )}

          {isSecretRewardUnlocked && (
             <button onClick={() => alert("Direi che questo viaggio è meritato")} className="p-2 rounded-full border border-sky-100 hover:bg-sky-50 transition-colors">
                <Plane className="w-5 h-5 text-sky-500"/>
             </button>
          )}
          {/* Mission Button */}
          <button
            onClick={onOpenMissions}
            className="p-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors relative"
            title="Missioni Giornaliere"
          >
            <Trophy className="w-5 h-5" />
            {profile.completedMissions.length < 3 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
          
          {/* Google Sync Avatar / Profile */}
          <button
            onClick={() => {
              if (onOpenGoogleAuth) {
                onOpenGoogleAuth();
              } else {
                onOpenSettings();
              }
            }}
            className="relative flex items-center p-0.5 rounded-full border-2 border-emerald-300 hover:border-emerald-500 transition-colors bg-white shadow-2xs"
          >
            {profile.isLoggedIn ? (
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center text-xs font-bold text-emerald-800">
                  {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'GO'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-medium">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
