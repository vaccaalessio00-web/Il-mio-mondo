import { WorkoutRoutine } from '../types';

export const INITIAL_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine_chibi_glowup',
    title: 'Chibi Glow Up - Glutei & Core Tonico',
    description: 'Scheda estetica e tonificante con focus su gambe, glutei rotondi, spalle definite e addome piatto.',
    category: 'Glutei & Tonificazione',
    color: '#86efac', // pastel mint green
    emoji: '🌸',
    isActive: true,
    createdAt: '2026-09-15',
    lastTrainedAt: '2026-10-01',
    days: [
      {
        id: 'day_a_glutei',
        name: 'Giorno A: Focus Glutei & Catena Posteriore',
        description: 'Attivazione e sollevamento glutei con femorali',
        exercises: [
          {
            id: 'we_1',
            exerciseId: 'affondi_bulgari_manubri',
            exerciseName: 'Affondi bulgari con manubri',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Manubri',
            sets: Array(4).fill({ reps: '10-12', weightKg: 8 }),
            restSeconds: 90,
            notes: 'Piede su panca, busto leggermente flesso in avanti per colpire il gluteo.',
            completedSets: [false, false, false, false]
          },
          {
            id: 'we_2',
            exerciseId: 'stacco_rumeno_manubri',
            exerciseName: 'Stacco rumeno (RDL) con manubri',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Manubri',
            sets: Array(3).fill({ reps: '12', weightKg: 12 }),
            restSeconds: 90,
            notes: 'Spingi indietro i fianchi e scendi fino a metà stinco.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_3',
            exerciseId: 'ponte_glutei_corpolibero',
            exerciseName: 'Ponte glutei / Hip Thrust a terra',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Corpo Libero',
            sets: Array(4).fill({ reps: '15', weightKg: 0 }),
            restSeconds: 60,
            notes: 'Trattieni 2 secondi in alto spremendo al massimo i glutei.',
            completedSets: [false, false, false, false]
          },
          {
            id: 'we_4',
            exerciseId: 'monster_walk_miniband',
            exerciseName: 'Monster Walk / Crab Walk (con mini-band)',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Elastici',
            sets: Array(3).fill({ reps: '20 passi', weightKg: 0 }),
            restSeconds: 45,
            notes: 'Banda appena sopra le ginocchia, non far collassare le gambe dentro.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_5',
            exerciseId: 'plank_frontale_laterale',
            exerciseName: 'Plank (frontale e laterale)',
            muscleGroup: 'Addome e Core',
            equipment: 'Corpo Libero',
            sets: Array(3).fill({ reps: '45 sec', weightKg: 0 }),
            restSeconds: 60,
            notes: 'Addome compatto, retroversione del bacino.',
            completedSets: [false, false, false]
          }
        ]
      },
      {
        id: 'day_b_upper',
        name: 'Giorno B: Parte Alta, Schiena & Spalle Chibi',
        description: 'Per una postura aperta, spalle rotonde e braccia snelle',
        exercises: [
          {
            id: 'we_6',
            exerciseId: 'rematore_manubrio',
            exerciseName: 'Rematore con manubrio',
            muscleGroup: 'Dorso',
            equipment: 'Manubri',
            sets: Array(3).fill({ reps: '12', weightKg: 8 }),
            restSeconds: 60,
            notes: 'Tira verso l\'anca senza slancio.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_7',
            exerciseId: 'alzate_laterali_manubri',
            exerciseName: 'Alzate laterali con manubri',
            muscleGroup: 'Spalle',
            equipment: 'Manubri',
            sets: Array(4).fill({ reps: '12-15', weightKg: 3 }),
            restSeconds: 60,
            notes: 'Gomiti leggermente flessi, pensa a spingere all\'esterno.',
            completedSets: [false, false, false, false]
          },
          {
            id: 'we_8',
            exerciseId: 'pushup_inclinati',
            exerciseName: 'Piegamenti inclinati (mani su rialzo)',
            muscleGroup: 'Petto',
            equipment: 'Corpo Libero',
            sets: Array(3).fill({ reps: '10', weightKg: 0 }),
            restSeconds: 60,
            notes: 'Mani su panca o tavolo, petto fiero.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_9',
            exerciseId: 'band_pull_apart',
            exerciseName: 'Band Pull-Apart',
            muscleGroup: 'Spalle',
            equipment: 'Elastici',
            sets: Array(3).fill({ reps: '15', weightKg: 0 }),
            restSeconds: 45,
            notes: 'Apertura a braccia tese per la postura.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_10',
            exerciseId: 'curl_manubri_alternato',
            exerciseName: 'Curl con manubri alternato',
            muscleGroup: 'Braccia',
            equipment: 'Manubri',
            sets: Array(3).fill({ reps: '12', weightKg: 4 }),
            restSeconds: 60,
            notes: 'Supinazione del polso in salita.',
            completedSets: [false, false, false]
          }
        ]
      },
      {
        id: 'day_c_fullbody',
        name: 'Giorno C: Full Body Burn & Core Scultura',
        description: 'Circuito metabolico per bruciare e definire',
        exercises: [
          {
            id: 'we_11',
            exerciseId: 'goblet_squat_manubrio',
            exerciseName: 'Goblet Squat con manubrio',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Manubri',
            sets: Array(4).fill({ reps: '12', weightKg: 10 }),
            restSeconds: 75,
            notes: 'Discesa profonda e spinta vigorosa dai talloni.',
            completedSets: [false, false, false, false]
          },
          {
            id: 'we_12',
            exerciseId: 'kickback_glutei_elastico',
            exerciseName: 'Kickback per glutei con elastico',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Elastici',
            sets: Array(3).fill({ reps: '15 per lato', weightKg: 0 }),
            restSeconds: 45,
            notes: 'Calcia indietro diagonale e mantieni la contrazione.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_13',
            exerciseId: 'dip_panca_sedia',
            exerciseName: 'Dip su panca / sedia',
            muscleGroup: 'Braccia',
            equipment: 'Corpo Libero',
            sets: Array(3).fill({ reps: '12', weightKg: 0 }),
            restSeconds: 60,
            notes: 'Tricipiti compatti, scendi a 90° con i gomiti.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_14',
            exerciseId: 'russian_twist_manubrio',
            exerciseName: 'Russian Twist con manubrio',
            muscleGroup: 'Addome e Core',
            equipment: 'Manubri',
            sets: Array(3).fill({ reps: '20 rotazioni', weightKg: 4 }),
            restSeconds: 60,
            notes: 'Gambe sollevate o piedi a terra se necessario.',
            completedSets: [false, false, false]
          },
          {
            id: 'we_15',
            exerciseId: 'deadbug',
            exerciseName: 'Deadbug',
            muscleGroup: 'Addome e Core',
            equipment: 'Corpo Libero',
            sets: Array(3).fill({ reps: '12 per lato', weightKg: 0 }),
            restSeconds: 45,
            notes: 'Schiena aderente al tappetino, movimento controllato.',
            completedSets: [false, false, false]
          }
        ]
      }
    ]
  },
  {
    id: 'routine_home_fitness',
    title: 'Tonificazione Dolce a Casa & Elastici',
    description: 'Perfetta per allenarsi in salotto con elastici e pesetti.',
    category: 'Home Workout',
    color: '#a7f3d0',
    emoji: '🍃',
    isActive: false,
    createdAt: '2026-09-20',
    days: [
      {
        id: 'day_home_1',
        name: 'Sessione 1: Gambe Snelle & Braccia',
        exercises: [
          {
            id: 'we_h1',
            exerciseId: 'squat_corpolibero',
            exerciseName: 'Squat a corpo libero / Jump Squat',
            muscleGroup: 'Gambe e Glutei',
            equipment: 'Corpo Libero',
            sets: Array(4).fill({ reps: '15', weightKg: 0 }),
            restSeconds: 60,
            completedSets: [false, false, false, false]
          },
          {
            id: 'we_h2',
            exerciseId: 'biceps_curl_elastico',
            exerciseName: 'Biceps Curl con elastico',
            muscleGroup: 'Braccia',
            equipment: 'Elastici',
            sets: Array(3).fill({ reps: '15', weightKg: 0 }),
            restSeconds: 45,
            completedSets: [false, false, false]
          },
          {
            id: 'we_h3',
            exerciseId: 'pushdown_tricipiti_elastico',
            exerciseName: 'Pushdown tricipiti con elastico',
            muscleGroup: 'Braccia',
            equipment: 'Elastici',
            sets: Array(3).fill({ reps: '15', weightKg: 0 }),
            restSeconds: 45,
            completedSets: [false, false, false]
          }
        ]
      }
    ]
  }
];
