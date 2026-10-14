import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkoutRoutine,
  Exercise,
  BodyMeasurement,
  UserProfile,
  WorkoutSessionLog,
  WorkoutExercise,
  TargetSet
} from '../types';
import { INITIAL_EXERCISES } from '../data/exercises';
import { INITIAL_ROUTINES } from '../data/initialRoutines';
import { INITIAL_MEASUREMENTS } from '../data/initialProgress';
import { soundManager } from '../utils/sound';
import { Plane } from 'lucide-react'; // Import Plane icon

interface ActiveWorkoutState {
  routineId: string;
  routineTitle: string;
  dayId: string;
  dayName: string;
  exercises: WorkoutExercise[];
  startTime: number;
  restTimerSeconds: number;
  restTimerActive: boolean;
  restTimerTotal: number;
}

interface WorkoutContextType {
  routines: WorkoutRoutine[];
  activeRoutine: WorkoutRoutine | null;
  exercises: Exercise[];
  measurements: BodyMeasurement[];
  sessionLogs: WorkoutSessionLog[];
  profile: UserProfile;
  activeWorkout: ActiveWorkoutState | null;
  syncMessage: string | null;
  clearSyncMessage: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingOfflineChanges: number;
  syncAccount: () => Promise<boolean>;
  anxietyJournalEntries: any[];
  setAnxietyJournalEntries: React.Dispatch<React.SetStateAction<any[]>>;

  // Routine methods
  addRoutine: (routine: WorkoutRoutine) => void;
  updateRoutine: (routine: WorkoutRoutine) => void;
  deleteRoutine: (id: string) => void;
  setActiveRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;

  // Exercise methods
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => Exercise;
  deleteCustomExercise: (id: string) => void;

  // Measurements methods
  addMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
  deleteMeasurement: (id: string) => void;

  // Active workout methods
  startWorkout: (routineId: string, dayId: string) => void;
  toggleSetCompleted: (exerciseId: string, setIndex: number) => void;
  updateExerciseValues: (exerciseId: string, sets: TargetSet[]) => void;
  startRestTimer: (seconds: number) => void;
  pauseResumeRestTimer: () => void;
  addRestSeconds: (seconds: number) => void;
  stopRestTimer: () => void;
  finishWorkout: (notes?: string) => WorkoutSessionLog;
  cancelWorkout: () => void;
  deleteSessionLog: (id: string) => void;

  // Profile & Google Login
  loginWithGoogle: (email?: string, name?: string) => void;
  logoutGoogle: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  completeMission: (missionId: string, xpReward: number) => void;
  undoMissionCompletion: (missionId: string, xpReward: number) => void;
  addXp: (amount: number) => void;

  // Backup, Reset & Samples
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetAllData: () => void;
  loadSampleTemplates: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

const DEFAULT_GUEST_PROFILE: UserProfile = {
  name: 'Ospite',
  email: '',
  isLoggedIn: false,
  avatarUrl: undefined,
  heightCm: 0,
  targetWeightKg: undefined,
  mascotCheer: true,
  soundEnabled: true,
  soundVolume: 80,
  themeColor: '#86efac',
  darkMode: false,
  xp: 0,
  level: 1,
  completedMissions: [],
  lastMissionDate: new Date().toISOString().split('T')[0]
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if an account was previously logged in on this browser
  const savedActiveEmail = typeof window !== 'undefined' ? localStorage.getItem('fitworld_active_email') : null;

  // Initial user data from authenticated storage if active
  const initialUserData = (() => {
    if (!savedActiveEmail) return null;
    try {
      const dataStr = localStorage.getItem(`fitworld_user_${savedActiveEmail}`);
      return dataStr ? JSON.parse(dataStr) : null;
    } catch {
      return null;
    }
  })();

  // 1. Routines: ZERO fake routines on download!
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    if (initialUserData && Array.isArray(initialUserData.routines)) {
      return initialUserData.routines;
    }
    return [];
  });

  // 2. Exercises: Standard library + custom
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    try {
      const saved = localStorage.getItem('fitworld_exercises');
      if (saved) {
        const parsed: Exercise[] = JSON.parse(saved);
        const customOnly = parsed.filter(e => e.isCustom);
        return [...INITIAL_EXERCISES, ...customOnly];
      }
      return INITIAL_EXERCISES;
    } catch {
      return INITIAL_EXERCISES;
    }
  });

  // 3. Measurements: ZERO fake measurements on download!
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    if (initialUserData && Array.isArray(initialUserData.measurements)) {
      return initialUserData.measurements;
    }
    return [];
  });

  // 4. Session Logs: ZERO fake logs on download!
  const [sessionLogs, setSessionLogs] = useState<WorkoutSessionLog[]>(() => {
    if (initialUserData && Array.isArray(initialUserData.sessionLogs)) {
      return initialUserData.sessionLogs;
    }
    return [];
  });
  
  // 5. Anxiety Journal Entries
  const [anxietyJournalEntries, setAnxietyJournalEntries] = useState<any[]>(() => {
      if (initialUserData && Array.isArray(initialUserData.anxietyJournalEntries)) {
        return initialUserData.anxietyJournalEntries;
      }
      return [];
  });

  // Daily mission reset
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastMissionDate !== today) {
      setProfile(prev => ({
        ...prev,
        completedMissions: [],
        lastMissionDate: today
      }));
    }
  }, []);

  // 5. Profile: Starts as logged out guest on fresh download
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedVolStr = typeof window !== 'undefined' ? localStorage.getItem('fitworld_sound_volume') : null;
    const savedVol = savedVolStr !== null ? Number(savedVolStr) : 80;
    const savedSoundEnabled = typeof window !== 'undefined' ? localStorage.getItem('fitworld_sound_enabled') !== 'false' : true;

    if (savedActiveEmail && initialUserData && initialUserData.profile) {
      return {
        ...DEFAULT_GUEST_PROFILE,
        soundVolume: typeof initialUserData.profile.soundVolume === 'number' ? initialUserData.profile.soundVolume : savedVol,
        soundEnabled: typeof initialUserData.profile.soundEnabled === 'boolean' ? initialUserData.profile.soundEnabled : savedSoundEnabled,
        darkMode: false,
        ...initialUserData.profile,
        isLoggedIn: true,
        email: savedActiveEmail
      };
    }
    return {
      ...DEFAULT_GUEST_PROFILE,
      soundVolume: savedVol,
      soundEnabled: savedSoundEnabled,
      darkMode: false
    };
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('fitworld_dark_mode');
    }
  }, []);

  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(() => {
    try {
      const saved = localStorage.getItem('fitworld_active_workout');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const clearSyncMessage = () => setSyncMessage(null);

  // Offline and Network Sync State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('fitworld_last_synced_at') : null;
  });
  const [pendingOfflineChanges, setPendingOfflineChanges] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fitworld_offline_pending');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Track offline changes whenever data modifications occur while disconnected
  useEffect(() => {
    if (!isOnline) {
      setPendingOfflineChanges(prev => {
        const next = prev + 1;
        try {
          localStorage.setItem('fitworld_offline_pending', String(next));
        } catch {}
        return next;
      });
    }
  }, [routines, measurements, sessionLogs, anxietyJournalEntries, exercises]);

  // Synchronize user account immediately and cleanly
  const syncAccount = async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      const fullIso = now.toISOString();
      const targetEmail = profile.email || localStorage.getItem('fitworld_active_email') || '';

      const updatedProfile: UserProfile = {
        ...profile,
        lastSyncedAt: fullIso
      };

      setProfile(updatedProfile);
      setLastSyncedAt(fullIso);
      try {
        localStorage.setItem('fitworld_last_synced_at', fullIso);
      } catch {}

      if (targetEmail) {
        const userData = {
          routines,
          measurements,
          sessionLogs,
          profile: updatedProfile,
          anxietyJournalEntries
        };
        try {
          localStorage.setItem(`fitworld_user_${targetEmail}`, JSON.stringify(userData));
          localStorage.setItem('fitworld_active_email', targetEmail);
        } catch {}
      }

      setPendingOfflineChanges(0);
      try {
        localStorage.setItem('fitworld_offline_pending', '0');
      } catch {}

      // Short visual delay for tactile feedback
      await new Promise(res => setTimeout(res, 500));

      soundManager.playSuccess();
      setSyncMessage(`Account sincronizzato con successo alle ${timeStr}! ✨\nTutti i progressi e le schede sono aggiornati.`);
      setTimeout(() => setSyncMessage(null), 5000);
      return true;
    } catch (e) {
      console.error('Account sync error:', e);
      setSyncMessage("Errore durante l'aggiornamento dell'account. Riprova tra poco.");
      setTimeout(() => setSyncMessage(null), 4000);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Reconnect listener: Automatically update account as soon as connection is restored!
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);

      // Perform instant reconnect sync
      setTimeout(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const fullIso = now.toISOString();
        const targetEmail = profile.email || localStorage.getItem('fitworld_active_email') || '';

        const updatedProfile: UserProfile = {
          ...profile,
          lastSyncedAt: fullIso
        };

        setProfile(updatedProfile);
        setLastSyncedAt(fullIso);
        try {
          localStorage.setItem('fitworld_last_synced_at', fullIso);
        } catch {}

        if (targetEmail) {
          const userData = {
            routines,
            measurements,
            sessionLogs,
            profile: updatedProfile,
            anxietyJournalEntries
          };
          try {
            localStorage.setItem(`fitworld_user_${targetEmail}`, JSON.stringify(userData));
            localStorage.setItem('fitworld_active_email', targetEmail);
          } catch {}
        }

        setPendingOfflineChanges(0);
        try {
          localStorage.setItem('fitworld_offline_pending', '0');
        } catch {}

        setIsSyncing(false);
        soundManager.playSuccess();
        setSyncMessage(`🌐 Connessione ristabilita! Account aggiornato e sincronizzato alle ${timeStr} ✨`);
        setTimeout(() => setSyncMessage(null), 5500);
      }, 600);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncMessage("⚡ Sei offline: tutte le funzioni rimangono attive!\nI tuoi dati verranno sincronizzati appena ti riconnetti.");
      setTimeout(() => setSyncMessage(null), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [profile, routines, measurements, sessionLogs, anxietyJournalEntries]);

  // Auto-sync current data to active user profile storage
  useEffect(() => {
    if (profile.isLoggedIn && profile.email) {
      try {
        const userData = {
          routines,
          measurements,
          sessionLogs,
          profile,
          anxietyJournalEntries
        };
        localStorage.setItem(`fitworld_user_${profile.email}`, JSON.stringify(userData));
        localStorage.setItem('fitworld_active_email', profile.email);
      } catch {}
    }
  }, [routines, measurements, sessionLogs, profile, anxietyJournalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('fitworld_exercises', JSON.stringify(exercises));
    } catch {}
  }, [exercises]);

  useEffect(() => {
    soundManager.setSoundEnabled(profile.soundEnabled);
    const vol = typeof profile.soundVolume === 'number' ? profile.soundVolume : 80;
    soundManager.setVolume(vol / 100);
    try {
      localStorage.setItem('fitworld_sound_volume', String(vol));
      localStorage.setItem('fitworld_sound_enabled', String(profile.soundEnabled));
    } catch {}
  }, [profile.soundEnabled, profile.soundVolume]);

  useEffect(() => {
    try {
      if (activeWorkout) {
        localStorage.setItem('fitworld_active_workout', JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem('fitworld_active_workout');
      }
    } catch {}
  }, [activeWorkout]);

  // Rest Timer Interval
  useEffect(() => {
    let timer: number | undefined;
    if (activeWorkout && activeWorkout.restTimerActive && activeWorkout.restTimerSeconds > 0) {
      timer = window.setInterval(() => {
        setActiveWorkout(prev => {
          if (!prev) return null;
          if (prev.restTimerSeconds <= 1) {
            soundManager.playTimerFinish();
            return {
              ...prev,
              restTimerSeconds: 0,
              restTimerActive: false
            };
          }
          if (prev.restTimerSeconds <= 4 && prev.restTimerSeconds > 1) {
            soundManager.playTick();
          }
          return {
            ...prev,
            restTimerSeconds: prev.restTimerSeconds - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeWorkout?.restTimerActive, activeWorkout?.restTimerSeconds]);

  // Active routine getter
  const activeRoutine = routines.find(r => r.isActive) || routines[0] || null;

  // Routine methods
  const addRoutine = (routine: WorkoutRoutine) => {
    setRoutines(prev => [routine, ...prev]);
  };

  const updateRoutine = (routine: WorkoutRoutine) => {
    setRoutines(prev => prev.map(r => (r.id === routine.id ? routine : r)));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const setActiveRoutine = (id: string) => {
    setRoutines(prev =>
      prev.map(r => ({
        ...r,
        isActive: r.id === id
      }))
    );
  };

  const duplicateRoutine = (id: string) => {
    const original = routines.find(r => r.id === id);
    if (!original) return;
    const duplicated: WorkoutRoutine = {
      ...original,
      id: 'routine_' + Date.now(),
      title: `${original.title} (Copia)`,
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoutines(prev => [duplicated, ...prev]);
  };

  // Custom Exercise methods
  const addCustomExercise = (ex: Omit<Exercise, 'id' | 'isCustom'>): Exercise => {
    const newEx: Exercise = {
      ...ex,
      id: 'custom_' + Date.now(),
      isCustom: true
    };
    setExercises(prev => [newEx, ...prev]);
    return newEx;
  };

  const deleteCustomExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Measurement methods
  const addMeasurement = (meas: Omit<BodyMeasurement, 'id'>) => {
    const newMeas: BodyMeasurement = {
      ...meas,
      id: 'meas_' + Date.now()
    };
    setMeasurements(prev => [newMeas, ...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  // Live Workout methods
  const startWorkout = (routineId: string, dayId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    const day = routine.days.find(d => d.id === dayId);
    if (!day) return;

    const exercisesCloned: WorkoutExercise[] = day.exercises.map(ex => ({
      ...ex,
      completedSets: Array(ex.sets.length).fill(false)
    }));

    setActiveWorkout({
      routineId: routine.id,
      routineTitle: routine.title,
      dayId: day.id,
      dayName: day.name,
      exercises: exercisesCloned,
      startTime: Date.now(),
      restTimerSeconds: 0,
      restTimerActive: false,
      restTimerTotal: 60
    });
  };

  const toggleSetCompleted = (exerciseId: string, setIndex: number) => {
    if (!activeWorkout) return;
    setActiveWorkout(prev => {
      if (!prev) return null;
      let triggerTimerSeconds = 0;
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const newCompleted = [...(ex.completedSets || Array(ex.sets.length).fill(false))];
          const willBeCompleted = !newCompleted[setIndex];
          newCompleted[setIndex] = willBeCompleted;
          if (willBeCompleted) {
            soundManager.playCheckSet();
            triggerTimerSeconds = ex.restSeconds || 60;
          }
          return {
            ...ex,
            completedSets: newCompleted
          };
        }
        return ex;
      });

      if (triggerTimerSeconds > 0) {
        return {
          ...prev,
          exercises: updatedExercises,
          restTimerSeconds: triggerTimerSeconds,
          restTimerTotal: triggerTimerSeconds,
          restTimerActive: true
        };
      }

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  const updateExerciseValues = (exerciseId: string, sets: TargetSet[]) => {
    if (!activeWorkout) return;
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, sets } : ex
        )
      };
    });
  };

  const startRestTimer = (seconds: number) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        restTimerSeconds: seconds,
        restTimerTotal: seconds,
        restTimerActive: true
      };
    });
  };

  const pauseResumeRestTimer = () => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        restTimerActive: !prev.restTimerActive
      };
    });
  };

  const addRestSeconds = (seconds: number) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      const newVal = Math.max(0, prev.restTimerSeconds + seconds);
      return {
        ...prev,
        restTimerSeconds: newVal,
        restTimerTotal: Math.max(prev.restTimerTotal, newVal),
        restTimerActive: newVal > 0
      };
    });
  };

  const stopRestTimer = () => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        restTimerSeconds: 0,
        restTimerActive: false
      };
    });
  };

  const finishWorkout = (notes?: string): WorkoutSessionLog => {
    if (!activeWorkout) throw new Error('Nessun allenamento attivo');

    const durationMinutes = Math.max(1, Math.round((Date.now() - activeWorkout.startTime) / 60000));
    let totalVolume = 0;
    let completedExCount = 0;

    activeWorkout.exercises.forEach(ex => {
      const setsDone = (ex.completedSets || []).filter(Boolean).length;
      if (setsDone > 0) completedExCount++;
      ex.sets.forEach((set, idx) => {
          if (ex.completedSets?.[idx]) {
            totalVolume += parseInt(set.reps, 10) * set.weightKg;
          }
      });
    });

    const newLog: WorkoutSessionLog = {
      id: 'log_' + Date.now(),
      routineId: activeWorkout.routineId,
      routineTitle: activeWorkout.routineTitle,
      dayName: activeWorkout.dayName,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      totalVolumeKg: Math.round(totalVolume),
      completedExercisesCount: completedExCount,
      totalExercisesCount: activeWorkout.exercises.length,
      notes: notes || undefined
    };

    setSessionLogs(prev => [newLog, ...prev]);

    setRoutines(prev =>
      prev.map(r => {
        if (r.id === activeWorkout.routineId) {
          return {
            ...r,
            lastTrainedAt: new Date().toISOString().split('T')[0],
            days: r.days.map(d => {
              if (d.id === activeWorkout.dayId) {
                return {
                  ...d,
                  exercises: d.exercises.map(origEx => {
                    const sessionEx = activeWorkout.exercises.find(e => e.id === origEx.id);
                    if (sessionEx) {
                      return {
                        ...origEx,
                        sets: sessionEx.sets
                      };
                    }
                    return origEx;
                  })
                };
              }
              return d;
            })
          };
        }
        return r;
      })
    );

    soundManager.playVictory();
    setActiveWorkout(null);
    return newLog;
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
  };

  const deleteSessionLog = (id: string) => {
    setSessionLogs(prev => prev.filter(l => l.id !== id));
  };

  // Google Login handling with data recovery for that specific account
  const loginWithGoogle = (email?: string, name?: string) => {
    const userEmail = email || 'under.underscore.00@gmail.com';
    const userName = name || userEmail.split('@')[0];

    // Retrieve saved data for this specific user account
    let restoredRoutines: WorkoutRoutine[] = [];
    let restoredMeasurements: BodyMeasurement[] = [];
    let restoredLogs: WorkoutSessionLog[] = [];
    let restoredProfile: Partial<UserProfile> = {};

    try {
      const savedDataStr = localStorage.getItem(`fitworld_user_${userEmail}`);
      if (savedDataStr) {
        const parsed = JSON.parse(savedDataStr);
        if (Array.isArray(parsed.routines)) restoredRoutines = parsed.routines;
        if (Array.isArray(parsed.measurements)) restoredMeasurements = parsed.measurements;
        if (Array.isArray(parsed.sessionLogs)) restoredLogs = parsed.sessionLogs;
        if (parsed.profile) restoredProfile = parsed.profile;
      }
    } catch {}

    setRoutines(restoredRoutines);
    setMeasurements(restoredMeasurements);
    setSessionLogs(restoredLogs);

    const updatedProfile: UserProfile = {
      ...DEFAULT_GUEST_PROFILE,
      ...restoredProfile,
      name: restoredProfile.name || userName,
      email: userEmail,
      isLoggedIn: true,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}&backgroundColor=bbf7d0`
    };

    setProfile(updatedProfile);
    localStorage.setItem('fitworld_active_email', userEmail);

    const message = restoredRoutines.length > 0 || restoredMeasurements.length > 0
      ? `Bentornata! Dati recuperati per ${userEmail} (${restoredRoutines.length} schede, ${restoredMeasurements.length} misurazioni) ✨`
      : `Accesso completato con ${userEmail}! Puoi iniziare a creare le tue schede. 🍃`;

    setSyncMessage(message);
    setTimeout(() => setSyncMessage(null), 5000);
  };

  // Logout Google: resets active screen to empty guest state
  const logoutGoogle = () => {
    setProfile(DEFAULT_GUEST_PROFILE);
    setRoutines([]);
    setMeasurements([]);
    setSessionLogs([]);
    setActiveWorkout(null);
    localStorage.removeItem('fitworld_active_email');
    setSyncMessage('Disconnesso. Sei in modalità ospite (schede azzerate).');
    setTimeout(() => setSyncMessage(null), 3500);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      let newLevel = updated.level !== undefined ? updated.level : prev.level;
      let newXp = updated.xp !== undefined ? updated.xp : prev.xp;

      // Cheat segreto: se il nome dei dati personali è underscore ('_' o 'underscore') -> livello 10
      if (updated.name !== undefined) {
        const cleanName = updated.name.trim().toLowerCase();
        if (cleanName === '_' || cleanName === 'underscore') {
          newLevel = 10;
          newXp = 999;
          soundManager.playVictory();
          setSyncMessage('🌟 Livello 10 Sbloccato con Successo! 🏆✨');
          setTimeout(() => setSyncMessage(null), 4500);
        }
      }

      return {
        ...prev,
        ...updated,
        level: newLevel,
        xp: newXp
      };
    });
  };

  const completeMission = (missionId: string, xpReward: number) => {
    setProfile(prev => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      
      if (prev.level < 10) {
          const xpNeededForLevelUp = prev.level * 8;
          if (newXp >= xpNeededForLevelUp) {
            newLevel = Math.min(prev.level + 1, 10);
            newXp = 0; // reset XP on level up
          }
      } else {
          newXp = Math.min(newXp, 999);
      }
      
      if (missionId === 'secret_mission_id') {
         soundManager.playVictory();
         setSyncMessage("Hai sbloccato la missione segreta! 🎉\nIl tuo viaggio ti attende");
         setTimeout(() => setSyncMessage(null), 5000);
      } else {
         soundManager.playMissionComplete();
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedMissions: [...prev.completedMissions, missionId]
      };
    });
  };

  const undoMissionCompletion = (missionId: string, xpReward: number) => {
    setProfile(prev => {
      // Simple undo: remove XP and remove from completed list
      // Note: This does not handle level down if they leveled up with this mission.
      // Keeping it simple as requested.
      return {
        ...prev,
        xp: Math.max(0, prev.xp - xpReward),
        completedMissions: prev.completedMissions.filter(id => id !== missionId)
      };
    });
  };

  const addXp = (amount: number) => {
    setProfile(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      
      const xpNeededForLevelUp = prev.level * 8;
      if (newXp >= xpNeededForLevelUp && prev.level < 10) {
        newLevel = Math.min(prev.level + 1, 10);
        newXp = newXp - xpNeededForLevelUp; // carry over remaining XP
        soundManager.playVictory();

        let unlockMsg = "";
        if (newLevel === 2) unlockMsg = "Hai sbloccato Charlotte e Phalo! 🌸🐰";
        else if (newLevel === 3) unlockMsg = "Hai sbloccato il Coach Engfa e Tofu! ✨🍱";
        else if (newLevel === 4) unlockMsg = "Hai sbloccato il Coach Dobby e Kraprao! 🐶🐰";

        // Force syncMessage update
        setSyncMessage(`Congratulazioni! Hai raggiunto il livello ${newLevel}! 🎉\n\n${unlockMsg}`);
        // Ensure message persists
        setTimeout(() => setSyncMessage(null), 6000);
      }

      if (newLevel >= 10) {
        newXp = Math.min(newXp, 999);
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  // Optional manual loader for sample templates (for user convenience in settings if requested)
  const loadSampleTemplates = () => {
    setRoutines(INITIAL_ROUTINES);
    setMeasurements(INITIAL_MEASUREMENTS);
    setSyncMessage('Schede di esempio e misurazioni guida caricate con successo! 🌸');
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // JSON Export / Import
  const exportDataJson = () => {
    const data = {
      version: '1.0',
      appName: 'MyWorld',
      exportedAt: new Date().toISOString(),
      profile,
      routines,
      measurements,
      sessionLogs,
      customExercises: exercises.filter(e => e.isCustom)
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.routines)) setRoutines(data.routines);
      if (Array.isArray(data.measurements)) setMeasurements(data.measurements);
      if (Array.isArray(data.sessionLogs)) setSessionLogs(data.sessionLogs);
      if (Array.isArray(data.customExercises)) {
        setExercises([...INITIAL_EXERCISES, ...data.customExercises]);
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    setRoutines([]);
    setMeasurements([]);
    setSessionLogs([]);
    setProfile(DEFAULT_GUEST_PROFILE);
    setActiveWorkout(null);
    localStorage.removeItem('fitworld_active_email');
    if (profile.email) {
      localStorage.removeItem(`fitworld_user_${profile.email}`);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        routines,
        activeRoutine,
        exercises,
        measurements,
        sessionLogs,
        profile,
        activeWorkout,
        syncMessage,
        clearSyncMessage,
        isOnline,
        isSyncing,
        lastSyncedAt,
        pendingOfflineChanges,
        syncAccount,
        anxietyJournalEntries,
        setAnxietyJournalEntries,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        setActiveRoutine,
        duplicateRoutine,
        addCustomExercise,
        deleteCustomExercise,
        addMeasurement,
        deleteMeasurement,
        startWorkout,
        toggleSetCompleted,
        updateExerciseValues,
        startRestTimer,
        pauseResumeRestTimer,
        addRestSeconds,
        stopRestTimer,
        finishWorkout,
        cancelWorkout,
        deleteSessionLog,
        loginWithGoogle,
        logoutGoogle,
        updateProfile,
        completeMission,
        undoMissionCompletion,
        addXp,
        exportDataJson,
        importDataJson,
        resetAllData,
        loadSampleTemplates
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
