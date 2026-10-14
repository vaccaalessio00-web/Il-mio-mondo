import React, { useState, useEffect } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { MyRoutinesView } from './components/routines/MyRoutinesView';
import { WorkoutBuilderView } from './components/routines/WorkoutBuilderView';
import { WorkoutHistoryView } from './components/history/WorkoutHistoryView';
import { ProgressView } from './components/progress/ProgressView';
import { CalmWorld } from './components/calmworld/CalmWorld';
import { SettingsView } from './components/settings/SettingsView';
import { ExerciseCatalogModal } from './components/catalog/ExerciseCatalogModal';
import { ActiveWorkoutModal } from './components/active-workout/ActiveWorkoutModal';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';
import { MissionModal } from './components/missions/MissionModal';
import { ChibiGuidedTour } from './components/ChibiGuidedTour';
import { Sparkles, X, WifiOff } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeWorkout, startWorkout, syncMessage, clearSyncMessage, profile, isOnline } = useWorkout();

  const [currentTab, setCurrentTab] = useState<NavTab>('routines');
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Automatically offer the tour on first visit if not yet completed
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem('fitworld_chibi_tour_seen');
      if (!tourSeen) {
        setIsTourOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Start workout and pop up active modal
  const handleStartWorkout = (routineId: string, dayId: string) => {
    startWorkout(routineId, dayId);
    setIsActiveWorkoutOpen(true);
  };

  // Switch to builder for editing
  const handleEditRoutine = (routineId: string) => {
    setEditingRoutineId(routineId);
    setCurrentTab('builder');
  };

  // Switch to builder for new
  const handleCreateNewRoutine = () => {
    setEditingRoutineId(null);
    setCurrentTab('builder');
  };

  return (
    <div className="min-h-screen bg-[#edf9f3] selection:bg-emerald-200 flex justify-center transition-colors duration-300">
      {/* Mobile container with smooth borders and subtle shadow */}
      <div className="w-full max-w-md min-h-screen bg-[#f4fcf7] border-x border-emerald-100/70 shadow-[0_0_40px_rgba(16,185,129,0.08)] flex flex-col relative transition-colors duration-300">
        {/* Sticky Header */}
        <Header
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenSettings={() => setCurrentTab('settings')}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          onOpenMissions={() => setIsMissionModalOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
        />
        
        {/* Modals */}
        {isMissionModalOpen && <MissionModal onClose={() => setIsMissionModalOpen(false)} />}

        {/* Offline notification banner */}
        {!isOnline && (
          <div className="mx-3.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3.5 py-2 rounded-2xl shadow-md text-xs font-bold flex items-center gap-2 animate-fadeIn z-20">
            <WifiOff className="w-4 h-4 text-amber-100 shrink-0" />
            <span className="leading-tight">
              Modalità Offline attiva ⚡ I tuoi dati sono al sicuro sul dispositivo e verranno sincronizzati automaticamente appena ti riconnetti.
            </span>
          </div>
        )}

        {/* Sync message banner notification */}
        {syncMessage && (
          <div className="mx-3.5 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-2 rounded-2xl shadow-md text-xs font-bold flex items-center justify-between animate-fadeIn z-20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
              <span className="whitespace-pre-line">{syncMessage}</span>
            </div>
            <button
              onClick={clearSyncMessage}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {currentTab === 'routines' && (
            <MyRoutinesView
              onStartWorkout={handleStartWorkout}
              onEditRoutine={handleEditRoutine}
              onCreateNewRoutine={handleCreateNewRoutine}
              onOpenCatalog={() => setIsCatalogOpen(true)}
              onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
            />
          )}

          {currentTab === 'builder' && (
            <WorkoutBuilderView
              initialRoutineId={editingRoutineId}
              onFinished={() => {
                setEditingRoutineId(null);
                setCurrentTab('routines');
              }}
            />
          )}

          {currentTab === 'history' && (
            <WorkoutHistoryView
              onGoToRoutines={() => setCurrentTab('routines')}
              onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)} />
          )}

          {currentTab === 'calm' && (
            <CalmWorld />
          )}

          {currentTab === 'settings' && (
            <SettingsView onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)} />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={tab => {
            if (tab === 'builder') {
              setEditingRoutineId(null);
            }
            setCurrentTab(tab);
          }}
          hasActiveWorkout={!!activeWorkout}
          onOpenActiveWorkout={() => setIsActiveWorkoutOpen(true)}
        />

        {/* Exercise Catalog Modal */}
        <ExerciseCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
        />

        {/* Active Live Workout Tracker Modal */}
        <ActiveWorkoutModal
          isOpen={isActiveWorkoutOpen && !!activeWorkout}
          onClose={() => setIsActiveWorkoutOpen(false)}
        />

        {/* Google Authentication Modal */}
        <GoogleAuthModal
          isOpen={isGoogleAuthOpen}
          onClose={() => setIsGoogleAuthOpen(false)}
        />

        {/* Chibi Guided Tour Modal */}
        <ChibiGuidedTour
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onNavigateTab={(tab) => {
            if (tab === 'builder') {
              setEditingRoutineId(null);
            }
            setCurrentTab(tab);
          }}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <MainApp />
    </WorkoutProvider>
  );
}
