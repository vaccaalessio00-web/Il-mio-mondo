export type MuscleGroup =
  | 'Petto'
  | 'Dorso'
  | 'Spalle'
  | 'Gambe e Glutei'
  | 'Braccia'
  | 'Addome e Core';

export type EquipmentType =
  | 'Corpo Libero'
  | 'Manubri'
  | 'Elastici'
  | 'Altro';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType;
  description: string;
  targetMuscles: string[];
  tips?: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface TargetSet {
  reps: string;
  weightKg: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType;
  sets: TargetSet[]; // New structure
  restSeconds: number;
  notes?: string;
  completedSets?: boolean[];
  setsHistory?: WorkoutSet[];
}

export interface WorkoutDay {
  id: string;
  name: string; // e.g. "Giorno A - Gambe & Glutei"
  description?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  emoji: string;
  days: WorkoutDay[];
  isActive: boolean;
  createdAt: string;
  lastTrainedAt?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  weightKg: number;
  heightCm: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armLeftCm?: number;
  armRightCm?: number;
  thighLeftCm?: number;
  thighRightCm?: number;
  calfCm?: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
  targetWeightKg?: number;
  heightCm: number;
  mascotCheer: boolean;
  soundEnabled: boolean;
  soundVolume?: number; // 0 to 100
  themeColor: string;
  darkMode?: boolean;
  xp: number;
  level: number;
  completedMissions: string[];
  lastMissionDate: string;
  lastSyncedAt?: string;
}

export interface WorkoutSessionLog {
  id: string;
  routineId: string;
  routineTitle: string;
  dayName: string;
  date: string;
  durationMinutes: number;
  totalVolumeKg: number;
  completedExercisesCount: number;
  totalExercisesCount: number;
  notes?: string;
}
