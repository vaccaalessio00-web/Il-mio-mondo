import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle, Share, PlusSquare, X } from 'lucide-react';
import { APP_CUSTOM_LOGO } from '../../assets/logo';

export const PWAInstallSection: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    const success = await installApp();
    if (success) {
      setJustInstalled(true);
    }
  };

  const logoSrc = APP_CUSTOM_LOGO || '/pwa-192x192.png';

  return (
    <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-emerald-50 shrink-0 shadow-xs flex items-center justify-center">
          <img
            src={logoSrc}
            alt="MyWorld Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-slate-800 text-sm font-['Quicksand']">
              Scarica l'App MyWorld
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Icona personalizzata sul tuo schermo, avvio a schermo intero e uso offline
          </p>
        </div>
      </div>

      {isInstalled || justInstalled ? (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-2xl border border-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>MyWorld è già installata sul tuo dispositivo! ✨</span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isIOS ? (
            <>
              <Smartphone className="w-4 h-4" />
              <span>Aggiungi a Schermata Home (iOS) 📲</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Installa App sul Dispositivo 📲</span>
            </>
          )}
        </button>
      )}

      {/* iOS Modal instructions */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border-2 border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-200">
                  <img src={logoSrc} alt="MyWorld Logo" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm font-['Quicksand']">
                  Installa MyWorld su iPhone/iPad
                </h4>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
                <div className="p-1.5 bg-white text-emerald-700 rounded-xl shadow-2xs font-bold text-[11px] shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    Tocca <Share className="w-3.5 h-3.5 text-blue-600 inline" /> Condividi
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nella barra inferiore di Safari, tocca il pulsante di condivisione (il quadrato con la freccia verso l'alto).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
                <div className="p-1.5 bg-white text-emerald-700 rounded-xl shadow-2xs font-bold text-[11px] shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    Tocca <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" /> Aggiungi a schermata Home
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scorri le opzioni verso il basso e seleziona "Aggiungi a schermata Home".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
                <div className="p-1.5 bg-white text-emerald-700 rounded-xl shadow-2xs font-bold text-[11px] shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Conferma con "Aggiungi" ✨
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    L'icona MyWorld apparirà sulla schermata principale del tuo iPhone come una vera app nativa!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-xs"
            >
              Ho capito!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
