import React from 'react';
import { ClipboardList, PlusCircle, History, LineChart, Brain, Settings } from 'lucide-react';

export type NavTab = 'routines' | 'builder' | 'history' | 'progress' | 'calm' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveWorkout?: boolean;
  onOpenActiveWorkout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveWorkout = false,
  onOpenActiveWorkout
}) => {
  const tabs = [
    {
      id: 'routines' as NavTab,
      label: 'Schede',
      icon: ClipboardList
    },
    {
      id: 'calm' as NavTab,
      label: 'CalmWorld',
      icon: Brain
    },
    {
      id: 'history' as NavTab,
      label: 'Storico',
      icon: History
    },
    {
      id: 'progress' as NavTab,
      label: 'Progressi',
      icon: LineChart
    },
    {
      id: 'builder' as NavTab,
      label: 'Crea',
      icon: PlusCircle
    },
    {
      id: 'settings' as NavTab,
      label: 'Profilo',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-100 pb-safe shadow-[0_-4px_20px_rgba(16,185,129,0.06)]">
      {/* Floating mini pill if an active workout is in progress */}
      {hasActiveWorkout && currentTab !== 'routines' && onOpenActiveWorkout && (
        <div className="max-w-md mx-auto px-4 -mt-3.5 mb-1">
          <button
            onClick={onOpenActiveWorkout}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-md flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Sessione in corso! Torna all'allenamento</span>
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              Riprendi →
            </span>
          </button>
        </div>
      )}

      <nav className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-emerald-100/70 rounded-2xl -z-10 transition-all" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-600 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.id === 'routines' && hasActiveWorkout && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-['Quicksand']">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
