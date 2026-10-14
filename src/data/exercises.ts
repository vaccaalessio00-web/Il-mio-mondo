import { Exercise, MuscleGroup, EquipmentType } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  // ================= 1. PETTO (PETTORALI) =================
  // Corpo Libero
  {
    id: 'pushup_classici',
    name: 'Piegamenti (Push-up) classici',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Allenano la parte centrale e generale del petto, tricipiti e stabilità del core.',
    targetMuscles: ['Grande pettorale', 'Tricipiti', 'Deltoidi anteriori', 'Core'],
    tips: 'Mantieni i gomiti a 45 gradi rispetto al busto e l\'addome ben contratto.'
  },
  {
    id: 'pushup_inclinati',
    name: 'Piegamenti inclinati (mani su rialzo)',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Focalizzati sulla parte inferiore del petto, ideali anche come versione facilitata.',
    targetMuscles: ['Pettorale inferiore', 'Tricipiti'],
    tips: 'Appoggia le mani su una panca, gradino o sedia stabile.'
  },
  {
    id: 'pushup_declinati',
    name: 'Piegamenti declinati (piedi su rialzo)',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Focalizzati sulla parte superiore (clavicolare) del petto e deltoidi anteriori.',
    targetMuscles: ['Pettorale superiore', 'Deltoidi anteriori', 'Tricipiti'],
    tips: 'Appoggia i piedi su un rialzo mantenendo la colonna ben allineata.'
  },
  {
    id: 'dips_parallele_sedie',
    name: 'Dips alle parallele / sedie',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Lavoro intenso su petto inferiore e tricipiti. Inclinando il busto in avanti si enfatizza il petto.',
    targetMuscles: ['Pettorale inferiore', 'Tricipiti', 'Spalle'],
    tips: 'Scendi fino a formare circa 90 gradi al gomito senza forzare le spalle.'
  },
  {
    id: 'archer_pushups',
    name: 'Piegamenti Archer (Archer Push-ups)',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Piegamenti asimmetrici in cui ci si sposta da un lato all\'altro, aumentando il carico sul singolo pettorale.',
    targetMuscles: ['Gran pettorale unilaterale', 'Tricipiti', 'Core'],
    tips: 'Il braccio opposto resta quasi completamente disteso come l\'arco di un arciere.'
  },
  {
    id: 'pushups_larghi_stretti',
    name: 'Piegamenti larghi / stretti',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Variazioni dell\'apertura delle mani per reclutare maggiormente la porzione esterna (larghi) o interna e tricipiti (stretti).',
    targetMuscles: ['Pettorali', 'Tricipiti'],
    tips: 'Alterna le ampiezze per uno stimolo completo della muscolatura pettorale.'
  },
  {
    id: 'pushups_esplosivi',
    name: 'Piegamenti esplosivi (Clap Push-ups)',
    muscleGroup: 'Petto',
    equipment: 'Corpo Libero',
    description: 'Piegamenti con stacco delle mani dal suolo (o battito di mani) per sviluppare potenza e forza esplosiva.',
    targetMuscles: ['Petto', 'Fibre a contrazione rapida', 'Tricipiti'],
    tips: 'Atterra morbidamente ammortizzando subito con la flessione dei gomiti.'
  },
  // Manubri Petto
  {
    id: 'distensioni_manubri_panca',
    name: 'Distensioni su panca piana / inclinata con manubri',
    muscleGroup: 'Petto',
    equipment: 'Manubri',
    description: 'Costruzione fondamentale di massa e forza per il petto con massima escursione di movimento.',
    targetMuscles: ['Grande pettorale', 'Pettorale clavicolare', 'Tricipiti'],
    tips: 'Adduci e deprimi le scapole prima di iniziare a spingere.'
  },
  {
    id: 'croci_manubri_panca',
    name: 'Croci su panca piana / inclinata',
    muscleGroup: 'Petto',
    equipment: 'Manubri',
    description: 'Isolamento del pettorale con ottimo allungamento nella fase eccentrica.',
    targetMuscles: ['Fibre sternali e clavicolari del petto'],
    tips: 'Mantieni i gomiti leggermente flessi durante tutta l\'esecuzione.'
  },
  {
    id: 'floor_press_manubri',
    name: 'Floor Press (distensioni a terra con manubri)',
    muscleGroup: 'Petto',
    equipment: 'Manubri',
    description: 'Alternativa alla panca per salvaguardare le spalle, limitando l\'iperestensione posteriore.',
    targetMuscles: ['Pettorali', 'Tricipiti'],
    tips: 'I gomiti toccano delicatamente il pavimento a ogni ripetizione prima di risalire.'
  },
  {
    id: 'hex_press_manubri',
    name: 'Press a presa neutrale (Hex Press / Svend Press)',
    muscleGroup: 'Petto',
    equipment: 'Manubri',
    description: 'Distensioni tenendo i due manubri costantemente premuti l\'uno contro l\'altro al centro del petto per massima contrazione isometrica.',
    targetMuscles: ['Pettorale interno / sterno', 'Tricipiti'],
    tips: 'Stringi attivamente i manubri insieme durante tutta la traiettoria.'
  },
  {
    id: 'floor_flyes_manubri',
    name: 'Croci a terra (Floor Flyes)',
    muscleGroup: 'Petto',
    equipment: 'Manubri',
    description: 'Ottima alternativa alle croci su panca per proteggere le spalle nel punto di massimo allungamento.',
    targetMuscles: ['Pettorali', 'Deltoidi anteriori'],
    tips: 'Il contatto con il pavimento agisce da fermo di sicurezza naturale.'
  },
  // Elastici Petto
  {
    id: 'pushup_con_elastico',
    name: 'Push-up con elastico',
    muscleGroup: 'Petto',
    equipment: 'Elastici',
    description: 'Elastico fatto passare dietro la schiena e tenuto tra le mani per aumentare la resistenza in chiusura.',
    targetMuscles: ['Pettorale', 'Tricipiti'],
    tips: 'Fornisce una curva di resistenza crescente dove il muscolo è più forte.'
  },
  {
    id: 'croci_in_piedi_elastico',
    name: 'Croci in piedi con elastico',
    muscleGroup: 'Petto',
    equipment: 'Elastici',
    description: 'Fissato a un supporto posteriore, simula perfettamente i cavi da palestra con tensione costante.',
    targetMuscles: ['Pettorali', 'Fibre sternali'],
    tips: 'Mantieni una leggera flessione del busto in avanti e chiudi al centro.'
  },
  {
    id: 'chest_press_in_piedi_elastico',
    name: 'Chest press in piedi con elastico',
    muscleGroup: 'Petto',
    equipment: 'Elastici',
    description: 'Distensioni orizzontali spingendo l\'elastico in avanti con ancoraggio posteriore.',
    targetMuscles: ['Pettorali', 'Tricipiti'],
    tips: 'Posiziona una gamba leggermente avanti per darti maggiore stabilità.'
  },
  {
    id: 'cross_body_press_singola_elastico',
    name: 'Cross-body press singola con elastico',
    muscleGroup: 'Petto',
    equipment: 'Elastici',
    description: 'Spinta diagonale con elastico ancorato lateralmente per isolare la chiusura della parte superiore/centrale del petto.',
    targetMuscles: ['Pettorale interno/superiore'],
    tips: 'Spingi la mano verso il pettorale opposto focalizzandoti sulla contrazione di picco.'
  },

  // ================= 2. DORSO (DORSALI, TRAPEZIO E LOMBARI) =================
  // Corpo Libero Dorso
  {
    id: 'trazioni_sbarra',
    name: 'Trazioni alla sbarra (Pull-up / Chin-up)',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Esercizio fondamentale per la larghezza dorsale, presa prona (pull-up) o supina (chin-up).',
    targetMuscles: ['Gran dorsale', 'Grande rotondo', 'Bicipiti', 'Trapezio'],
    tips: 'Tira con i gomiti verso i fianchi portando il petto alla sbarra.'
  },
  {
    id: 'australian_pullup',
    name: 'Australian Pull-up (Rematore inverso)',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Eseguito sotto un tavolo robusto o sbarra bassa, ottimo per lo spessore dorsale e scapole.',
    targetMuscles: ['Romboidi', 'Trapezio medio/basso', 'Gran dorsale', 'Bicipiti'],
    tips: 'Corpo rigido come una tavola, talloni a terra.'
  },
  {
    id: 'superman',
    name: 'Superman a terra',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Estensioni del busto e gambe a terra per rinforzare muscoli lombari, glutei ed erettori spinali.',
    targetMuscles: ['Erettori spinali', 'Zona lombare', 'Glutei'],
    tips: 'Solleva petto e cosce da terra, trattieni 2 secondi in alto.'
  },
  {
    id: 'australian_row_mono',
    name: 'Trazioni orizzontali a un braccio (Single-arm Australian Row)',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Variante unilaterale avanzata del rematore inverso per correggere asimmetrie e stimolare il core.',
    targetMuscles: ['Gran dorsale unilaterale', 'Anti-rotazione del core'],
    tips: 'Evita di ruotare eccessivamente il bacino durante la trazione.'
  },
  {
    id: 'reverse_hyperextension',
    name: 'Iperestensioni a terra (Reverse Hyperextension)',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Sdraiati a pancia in giù su panca o rialzo, sollevamento delle gambe per glutei ed erettori spinali.',
    targetMuscles: ['Lombari', 'Grande gluteo', 'Femorali'],
    tips: 'Movimento lento e controllato senza strappi sulla schiena.'
  },
  {
    id: 'scapular_pullups',
    name: 'Trazioni scapolari (Scapular Pull-ups)',
    muscleGroup: 'Dorso',
    equipment: 'Corpo Libero',
    description: 'Trazioni scapolari a gomiti tesi, fondamentali per la salute della spalla e la depressione delle scapole.',
    targetMuscles: ['Trapezio inferiore', 'Dentato anteriore', 'Scapole'],
    tips: 'Mantieni le braccia distese: il movimento nasce solo dall\'abbassare le scapole.'
  },
  // Manubri Dorso
  {
    id: 'rematore_manubrio',
    name: 'Rematore con manubrio (singolo o doppio)',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Sviluppo dello spessore del gran dorsale, romboidi e trapezi medi.',
    targetMuscles: ['Gran dorsale', 'Romboidi', 'Bicipiti'],
    tips: 'Traccia una linea a uncino portando il manubrio verso la tasca posteriore.'
  },
  {
    id: 'seal_row_manubri',
    name: 'Seal Row / Rematore su panca inclinata',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Isola la schiena eliminando qualsiasi compenso o carico gravoso sulla zona lombare.',
    targetMuscles: ['Romboidi', 'Trapezio', 'Dorsali'],
    tips: 'Busto completamente appoggiato alla panca a 30-45 gradi.'
  },
  {
    id: 'pullover_manubrio',
    name: 'Pull-over con manubrio',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Lavoro sull\'allungamento profondo del gran dorsale, del dentato e della gabbia toracica.',
    targetMuscles: ['Gran dorsale', 'Dentato anteriore', 'Pettorale'],
    tips: 'Gomiti leggermente flessi, inspira profondamente quando scendi dietro la testa.'
  },
  {
    id: 'renegade_row_manubri',
    name: 'Renegade Row con manubri',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Rematore in posizione di plank alto, allena contemporaneamente dorsali e stabilità ferrea del core.',
    targetMuscles: ['Gran dorsale', 'Core/Addominali', 'Spalle'],
    tips: 'Allarga leggermente i piedi per impedire alle anche di oscillare.'
  },
  {
    id: 'meadows_row_manubrio',
    name: 'Meadows Row con manubrio',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Rematore con traiettoria ad arco e busto ruotato per enfatizzare la parte bassa del gran dorsale.',
    targetMuscles: ['Gran dorsale basso', 'Grande rotondo'],
    tips: 'Usa una presa prona e gomito largo verso l\'esterno.'
  },
  {
    id: 'shrugs_manubri',
    name: 'Scrollate (Shrugs) con manubri',
    muscleGroup: 'Dorso',
    equipment: 'Manubri',
    description: 'Sollevamento verticale delle spalle per isolare la parte superiore del muscolo trapezio.',
    targetMuscles: ['Trapezio superiore'],
    tips: 'Solleva le spalle verso le orecchie senza ruotarle a cerchio.'
  },
  // Elastici Dorso
  {
    id: 'lat_pulldown_elastico',
    name: 'Lat pulldown con elastico',
    muscleGroup: 'Dorso',
    equipment: 'Elastici',
    description: 'Fissato in alto a una porta o barra, trazione verso il petto per stimolare la larghezza dorsale.',
    targetMuscles: ['Gran dorsale', 'Bicipiti'],
    tips: 'Siediti o inginocchiati, apri il petto e porta i gomiti verso il basso.'
  },
  {
    id: 'rematore_seduto_elastico',
    name: 'Rematore da seduto con elastico',
    muscleGroup: 'Dorso',
    equipment: 'Elastici',
    description: 'Elastico avvolto attorno ai piedi, tirata orizzontale verso l\'ombelico.',
    targetMuscles: ['Romboidi', 'Trapezio', 'Dorsali'],
    tips: 'Schiena eretta e stringi le scapole tra loro a fine corsa.'
  },
  {
    id: 'face_pull_elastico',
    name: 'Pulley / Face pull con elastico',
    muscleGroup: 'Dorso',
    equipment: 'Elastici',
    description: 'Fissato ad altezza viso, eccellente per deltoidi posteriori, cuffia e postura.',
    targetMuscles: ['Deltoidi posteriori', 'Trapezio medio/alto', 'Extrarotatori'],
    tips: 'Tira portando le mani all\'altezza delle tempie allargando i gomiti.'
  },
  {
    id: 'straight_arm_pulldown_elastico',
    name: 'Straight-Arm Pulldown con elastico',
    muscleGroup: 'Dorso',
    equipment: 'Elastici',
    description: 'Spinta delle braccia tese verso i fianchi con elastico in alto (isola il gran dorsale senza bicipiti).',
    targetMuscles: ['Gran dorsale isolato', 'Grande rotondo'],
    tips: 'Tieni le braccia quasi completamente dritte durante tutta la spinta.'
  },
  {
    id: 'good_morning_elastico',
    name: 'Good Morning con elastico',
    muscleGroup: 'Dorso',
    equipment: 'Elastici',
    description: 'Elastico sotto i piedi e attorno al collo per rinforzare la catena cinetica posteriore e lombare.',
    targetMuscles: ['Lombari', 'Femorali', 'Glutei'],
    tips: 'Fletti le anche spingendo il bacino all\'indietro mantenendo la schiena neutra.'
  },

  // ================= 3. SPALLE (DELTOIDI E CUFFIA DEI ROTATORI) =================
  // Corpo Libero Spalle
  {
    id: 'pike_pushups',
    name: 'Pike Push-up',
    muscleGroup: 'Spalle',
    equipment: 'Corpo Libero',
    description: 'Piegamenti a V rovesciata, focalizzati intensamente sul deltoide anteriore e mediale.',
    targetMuscles: ['Deltoidi anteriori', 'Deltoidi laterali', 'Tricipiti'],
    tips: 'Guarda verso i piedi e scendi diagonalmente verso avanti con la testa.'
  },
  {
    id: 'handstand_pushups',
    name: 'Handstand Push-up (piegamenti in verticale)',
    muscleGroup: 'Spalle',
    equipment: 'Corpo Libero',
    description: 'Esercizio avanzato di pura forza per le spalle con appoggio a muro o libera.',
    targetMuscles: ['Deltoidi', 'Tricipiti', 'Trapezi'],
    tips: 'Mantieni il corpo rigido e controlla la discesa centimetro per centimetro.'
  },
  {
    id: 'circonduzioni_ytw',
    name: 'Circonduzioni e Y-T-W a terra',
    muscleGroup: 'Spalle',
    equipment: 'Corpo Libero',
    description: 'Movimenti a corpo libero a terra per la stabilità, postura e salute articolare della spalla.',
    targetMuscles: ['Cuffia dei rotatori', 'Deltoidi posteriori', 'Trapezio basso'],
    tips: 'Concentrati sulla qualità del movimento e la contrazione delle scapole.'
  },
  {
    id: 'dolphin_pushups',
    name: 'Delfino / Dolphin Push-ups',
    muscleGroup: 'Spalle',
    equipment: 'Corpo Libero',
    description: 'Passaggio dal plank su avambracci alla V rovesciata, eccezionale per deltoide e dentato anteriore.',
    targetMuscles: ['Deltoide anteriore', 'Dentato anteriore', 'Core'],
    tips: 'Spingi attivamente con gli avambracci contro il pavimento.'
  },
  {
    id: 'scapular_pushups',
    name: 'Scapular Push-ups (Piegamenti scapolari)',
    muscleGroup: 'Spalle',
    equipment: 'Corpo Libero',
    description: 'Piegamenti a braccia tese per rinforzare il gran dentato e la salute/stabilità delle scapole.',
    targetMuscles: ['Dentato anteriore', 'Stabilità scapolare'],
    tips: 'Le braccia non si piegano mai: muovi solo il torace su e giù.'
  },
  // Manubri Spalle
  {
    id: 'military_press_manubri',
    name: 'Military Press / Shoulder Press con manubri',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Spinte verticali da seduto o in piedi per la massa e la forza complessiva delle spalle.',
    targetMuscles: ['Deltoide anteriore', 'Deltoide laterale', 'Tricipiti'],
    tips: 'Non inarcare la schiena, stringi i glutei se eseguito in piedi.'
  },
  {
    id: 'alzate_laterali_manubri',
    name: 'Alzate laterali con manubri',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Il re dell\'isolamento del deltoide mediale per dare alle spalle la classica forma rotonda e definita.',
    targetMuscles: ['Deltoide laterale/mediale'],
    tips: 'Pensa a spingere i manubri verso le pareti esterne, non solo verso l\'alto.'
  },
  {
    id: 'alzate_frontali_manubri',
    name: 'Alzate frontali con manubri',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Isolamento del capo anteriore del deltoide con presa prona o neutra.',
    targetMuscles: ['Deltoide anteriore'],
    tips: 'Solleva il manubrio fino all\'altezza degli occhi senza slancio con la schiena.'
  },
  {
    id: 'rear_delt_fly_manubri',
    name: 'Alzate a 90° (Rear Delt Fly)',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Lavoro fondamentale per il capo posteriore delle spalle, migliorando postura e completezza estetica.',
    targetMuscles: ['Deltoide posteriore', 'Romboidi'],
    tips: 'Busto inclinato a 90 gradi con la schiena dritta e gomiti morbidi.'
  },
  {
    id: 'arnold_press_manubri',
    name: 'Arnold Press con manubri',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Distensione sopra la testa con rotazione del polso durante la salita (coinvolge tutti e tre i capi).',
    targetMuscles: ['Deltoide anteriore', 'Deltoide laterale', 'Tricipiti'],
    tips: 'Inizia con palmi rivolti a te e finisci in alto con palmi in avanti.'
  },
  {
    id: 'bus_driver_manubrio',
    name: 'Bus Driver (Rotazioni con manubrio / disco)',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Tenendo un manubrio o disco in avanti a braccia tese, si ruota a destra e sinistra come un volante.',
    targetMuscles: ['Deltoide anteriore', 'Resistenza spalle', 'Core'],
    tips: 'Mantieni l\'altezza del manubrio costante all\'altezza del petto/spalle.'
  },
  {
    id: 'high_pull_manubri',
    name: 'High Pull con manubri',
    muscleGroup: 'Spalle',
    equipment: 'Manubri',
    description: 'Tirata alta esplosiva fino al petto/mento per deltoidi laterali e trapezio.',
    targetMuscles: ['Deltoide laterale', 'Trapezio'],
    tips: 'Guida il movimento sollevando i gomiti più in alto delle mani.'
  },
  // Elastici Spalle
  {
    id: 'shoulder_press_elastico',
    name: 'Shoulder press con elastico',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Calpestando la banda con i piedi e spingendo verso l\'alto sopra la testa.',
    targetMuscles: ['Deltoidi', 'Tricipiti'],
    tips: 'La tensione aumenta nel punto più alto, ottima per i blocchi articolari.'
  },
  {
    id: 'alzate_laterali_elastico',
    name: 'Alzate laterali con elastico',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Resistenza progressiva continua lungo tutto l\'arco del movimento per un bruciore intenso.',
    targetMuscles: ['Deltoide mediale'],
    tips: 'Fissa l\'elastico sotto un piede e apri lateralmente fino a 90°.'
  },
  {
    id: 'band_pull_apart',
    name: 'Band Pull-Apart',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Aperture orizzontali a braccia tese per deltoidi posteriori, scapole e correzione posturale.',
    targetMuscles: ['Deltoide posteriore', 'Romboidi', 'Trapezio'],
    tips: 'Tocca il petto con l\'elastico aprendo bene le braccia.'
  },
  {
    id: 'rotazioni_cuffia_elastico',
    name: 'Rotazioni esterne/interne con elastico',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Rinforzo specifico e prevenzione infortuni per la cuffia dei rotatori.',
    targetMuscles: ['Sottospinato', 'Piccolo rotondo', 'Sottoscapolare'],
    tips: 'Gomito attaccato al fianco a 90 gradi per tutto l\'esercizio.'
  },
  {
    id: 'lu_raises_elastico',
    name: 'Lu Raises con elastico',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Alzate laterali complete che proseguono oltre le spalle fino a toccarsi sopra la testa.',
    targetMuscles: ['Deltoidi', 'Trapezio', 'Dentato anteriore'],
    tips: 'Movimento ampio ed elegante, ottimo per la mobilità della spalla.'
  },
  {
    id: 'face_pull_extracompressione',
    name: 'Face Pull con extracompressione ed extrarotazione',
    muscleGroup: 'Spalle',
    equipment: 'Elastici',
    description: 'Face pull classico con decisa rotazione esterna dei gomiti e pollici rivolti all\'indietro.',
    targetMuscles: ['Deltoidi posteriori', 'Extrarotatori'],
    tips: 'Mantieni la contrazione per 1 secondo al picco.'
  },

  // ================= 4. GAMBE E GLUTEI =================
  // Corpo Libero Gambe
  {
    id: 'squat_corpolibero',
    name: 'Squat a corpo libero / Jump Squat',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Esercizio cardine per cosce e glutei, con variante Jump per potenza ed elevazione del battito.',
    targetMuscles: ['Quadricipiti', 'Grande gluteo', 'Femorali'],
    tips: 'Piedi larghezza spalle, ginocchia che seguono la punta dei piedi.'
  },
  {
    id: 'pistol_squat',
    name: 'Pistol Squat (Squat monofodale)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Esercizio avanzato di pura forza, equilibrio, mobilità della caviglia e controllo articolare su una gamba.',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Polpacci', 'Stabilizzatori caviglia'],
    tips: 'Puoi aiutarti inizialmente tenendoti leggermente a un supporto o sedendoti su un box.'
  },
  {
    id: 'affondi_corpolibero',
    name: 'Affondi (frontali, retro, camminati, bulgari a corpo libero)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Lavoro unilaterale supremo per tonificare cosce, glutei e correggere disequilibri.',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Femorali'],
    tips: 'Fai un passo lungo per attivare maggiormente il gluteo.'
  },
  {
    id: 'ponte_glutei_corpolibero',
    name: 'Ponte glutei / Hip Thrust a terra',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Focalizzato direttamente su contrazione dei glutei e catena posteriore.',
    targetMuscles: ['Grande gluteo', 'Femorali', 'Core'],
    tips: 'Stringi forte i glutei al massimo dell\'estensione per 2 secondi.'
  },
  {
    id: 'calf_raise_corpolibero',
    name: 'Calf raise (sollevamenti sulle punte)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Sollevamenti sui polpacci, eseguibili sul pavimento o con talloni nel vuoto su un gradino.',
    targetMuscles: ['Gastrocnemio', 'Soleo'],
    tips: 'Fai una pausa di 1 secondo in alto e controlla bene la discesa.'
  },
  {
    id: 'nordic_hamstring_curl',
    name: 'Nordic Hamstring Curl (a corpo libero assistito)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Flessione del ginocchio da ginocchioni con piedi ancorati, uno dei più potenti stimoli per i femorali.',
    targetMuscles: ['Bicipite femorale', 'Semimembranoso', 'Semitendinoso'],
    tips: 'Frena la caduta in avanti controllando con i femorali e spingi dolcemente con le mani a terra.'
  },
  {
    id: 'sissy_squat_corpolibero',
    name: 'Sissy Squat a corpo libero',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Flessione profonda delle ginocchia inclinando il busto indietro, isolamento estremo del quadricipite.',
    targetMuscles: ['Retto femorale', 'Vasto mediale e laterale'],
    tips: 'Mantieni linea retta tra ginocchia e spalle durante la discesa.'
  },
  {
    id: 'cossack_squat',
    name: 'Cossack Squat',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Squat laterale profondo che allena mobilità delle anche, adduttori e forza unilaterale.',
    targetMuscles: ['Adduttori', 'Quadricipiti', 'Glutei'],
    tips: 'Mantieni il tallone della gamba che si piega ben saldo a terra.'
  },
  {
    id: 'frog_pumps',
    name: 'Frog Pumps',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Corpo Libero',
    description: 'Ponte glutei con piante dei piedi a contatto stile "rana" per isolare il grande gluteo riducendo i femorali.',
    targetMuscles: ['Grande gluteo', 'Medio gluteo'],
    tips: 'Premi le piante dei piedi l\'una contro l\'altra mentre spingi in alto.'
  },
  // Manubri Gambe
  {
    id: 'goblet_squat_manubrio',
    name: 'Goblet Squat con manubrio',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Squat tenendo un manubrio stretto al petto: favorisce una postura perfetta ed eccellente profondità.',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Core'],
    tips: 'Tieni i gomiti verso il basso tra le ginocchia nella buca.'
  },
  {
    id: 'stacco_rumeno_manubri',
    name: 'Stacco rumeno (RDL) / Stacco a gambe semitese',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Fondamentale per la catena posteriore, dona definizione a femorali e glutei.',
    targetMuscles: ['Femorali', 'Glutei', 'Lombari'],
    tips: 'Spingi i fianchi indietro senza piegare eccessivamente le ginocchia.'
  },
  {
    id: 'affondi_bulgari_manubri',
    name: 'Affondi bulgari con manubri',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Uno degli esercizi più efficaci e amati per lo sviluppo e il sollevamento dei glutei.',
    targetMuscles: ['Glutei', 'Quadricipiti'],
    tips: 'Piede posteriore su panca/sedia, inclina leggermente il busto in avanti per più focus glutei.'
  },
  {
    id: 'step_up_manubri',
    name: 'Step-up su sedia / box con manubri',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Salita su rialzo con spinta dominante del tallone della gamba anteriore.',
    targetMuscles: ['Grande gluteo', 'Quadricipiti'],
    tips: 'Evita di spingere troppo con il piede a terra, fai lavorare la gamba in alto.'
  },
  {
    id: 'stacco_sumo_manubrio',
    name: 'Stacco Sumo con manubrio',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Stacco con passo largo e punte extraruotate per enfatizzare adduttori e glutei.',
    targetMuscles: ['Adduttori', 'Grande gluteo', 'Femorali'],
    tips: 'Tieni il manubrio tra le gambe con la schiena ben dritta.'
  },
  {
    id: 'landmine_goblet_rialzo',
    name: 'Landmine Squat / Goblet Squat profondo su rialzo',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Eseguito con i piedi su due rialzi o dischi per aumentare il raggio di movimento e allungamento.',
    targetMuscles: ['Quadricipiti', 'Glutei'],
    tips: 'Permette di scendere più in basso sentendo i glutei allungarsi a fondo.'
  },
  {
    id: 'stacco_monopodale_manubrio',
    name: 'Stacco mono-podale (Single-leg RDL) con manubrio',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Manubri',
    description: 'Stacco rumeno su una gamba sola con manubrio, per equilibrio e stabilità dell\'anca.',
    targetMuscles: ['Femorali', 'Gluteo medio e grande', 'Caviglia'],
    tips: 'La gamba libera si estende indietro allineata al busto.'
  },
  // Elastici Gambe
  {
    id: 'squat_legpress_elastico',
    name: 'Squat / Leg press con elastico',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Banda elastica sotto i piedi e sopra le spalle o spinta da sdraiati.',
    targetMuscles: ['Quadricipiti', 'Glutei'],
    tips: 'Resistenza aumentata man mano che ti avvicini all\'estensione completa.'
  },
  {
    id: 'monster_walk_miniband',
    name: 'Monster Walk / Crab Walk (con mini-band)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Camminata laterale o diagonale con elastico alle caviglie o ginocchia per attivare il medio gluteo.',
    targetMuscles: ['Medio gluteo', 'Piccolo gluteo', 'Tensore della fascia alata'],
    tips: 'Mantieni sempre la tensione sulla banda senza far collassare le ginocchia all\'interno.'
  },
  {
    id: 'leg_curl_sdraiato_elastico',
    name: 'Leg Curl da sdraiato con elastico',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Fissato ad un ancoraggio basso per isolare i femorali con movimento di flessione del ginocchio.',
    targetMuscles: ['Bicipite femorale'],
    tips: 'Tieni il bacino premuto contro il suolo mentre porti i talloni verso i glutei.'
  },
  {
    id: 'kickback_glutei_elastico',
    name: 'Kickback per glutei con elastico',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Spinte all\'indietro della gamba con elastico per isolare il picco superiore del gluteo.',
    targetMuscles: ['Grande gluteo'],
    tips: 'Calcia indietro e leggermente in diagonale, contrai 1 secondo in cima.'
  },
  {
    id: 'abduzioni_anca_miniband',
    name: 'Abduzioni dell\'anca con mini-band (sdraiati o in piedi)',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Isola il medio e piccolo gluteo, donando rotondità ai fianchi.',
    targetMuscles: ['Medio gluteo', 'Esterno coscia'],
    tips: 'Punta del piede leggermente ruotata verso il basso o neutra.'
  },
  {
    id: 'leg_extension_elastico',
    name: 'Leg Extension con elastico',
    muscleGroup: 'Gambe e Glutei',
    equipment: 'Elastici',
    description: 'Seduti su una sedia con elastico ancorato dietro alla caviglia, estensione per quadricipiti.',
    targetMuscles: ['Quadricipite'],
    tips: 'Blocca l\'estensione in alto per 1 secondo sentendo bruciare la coscia.'
  },

  // ================= 5. BRACCIA (BICIPITI, TRICIPITI E AVAMBRACCI) =================
  // Corpo Libero Braccia
  {
    id: 'dip_panca_sedia',
    name: 'Dip su panca / sedia',
    muscleGroup: 'Braccia',
    equipment: 'Corpo Libero',
    description: 'Lavoro mirato ed efficace per i tricipiti a corpo libero.',
    targetMuscles: ['Tricipiti', 'Deltoidi anteriori'],
    tips: 'Schiena vicina alla sedia durante tutta la discesa.'
  },
  {
    id: 'diamond_pushups',
    name: 'Piegamenti a diamante (Diamond Push-up)',
    muscleGroup: 'Braccia',
    equipment: 'Corpo Libero',
    description: 'Mani vicine a forma di diamante per spostare il carico primario sui tricipiti.',
    targetMuscles: ['Tricipiti', 'Pettorale interno'],
    tips: 'Se troppo duro, inizia con le ginocchia a terra.'
  },
  {
    id: 'chinup_presa_stretta',
    name: 'Chin-up (trazioni a presa stretta supina)',
    muscleGroup: 'Braccia',
    equipment: 'Corpo Libero',
    description: 'Trazione alla sbarra con palmi verso di sé, coinvolge pesantemente i bicipiti oltre al dorso.',
    targetMuscles: ['Bicipiti branchiali', 'Dorsali'],
    tips: 'Fletti con forza le braccia portando il mento sopra la sbarra.'
  },
  {
    id: 'bodyweight_triceps_ext',
    name: 'Bodyweight Triceps Extension (French press a corpo libero)',
    muscleGroup: 'Braccia',
    equipment: 'Corpo Libero',
    description: 'Inclinati contro tavolo o ringhiera, flessione dei gomiti portando la testa sotto le mani.',
    targetMuscles: ['Tricipiti (capo lungo)'],
    tips: 'Mantieni i gomiti stretti e fissi durante tutta la flessione.'
  },
  {
    id: 'pelican_curls',
    name: 'Pelican Curls (a corpo libero agli anelli o barra bassa)',
    muscleGroup: 'Braccia',
    equipment: 'Corpo Libero',
    description: 'Flessione delle braccia dietro il busto a corpo libero, stimolo unico in massimo allungamento per i bicipiti.',
    targetMuscles: ['Bicipiti (capo lungo in allungamento)'],
    tips: 'Movimento avanzato: procedi con gradualità.'
  },
  // Manubri Braccia
  {
    id: 'curl_manubri_alternato',
    name: 'Curl con manubri (alternato / concentrato / panca inclinata)',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Varianti regine per lo sviluppo e l\'isolamento del bicipite brachiale.',
    targetMuscles: ['Bicipite brachiale'],
    tips: 'Supina il polso (ruota il mignolo verso l\'alto) durante la salita.'
  },
  {
    id: 'hammer_curl_manubri',
    name: 'Curl a martello (Hammer Curl)',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Focus su muscolo brachiale e brachiordiale per dare spessore al braccio e avambraccio.',
    targetMuscles: ['Brachiale', 'Brachioradiale', 'Bicipiti'],
    tips: 'Presa neutra con pollici verso l\'alto per tutta l\'escursione.'
  },
  {
    id: 'french_press_manubri',
    name: 'French Press / Skullcrusher con manubri',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Estensioni per tricipiti da sdraiati portando i manubri verso le tempie.',
    targetMuscles: ['Tricipite (capo mediale e laterale)'],
    tips: 'Gomiti perpendicolari al suolo senza aprirli verso l\'esterno.'
  },
  {
    id: 'kickback_tricipiti_manubrio',
    name: 'Kickback tricipiti con manubrio',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Estensioni indietro del braccio con busto flesso per massima contrazione di picco.',
    targetMuscles: ['Tricipiti'],
    tips: 'Braccio parallelo al busto, distendi completamente il gomito indietro.'
  },
  {
    id: 'zottman_curl_manubri',
    name: 'Zottman Curl con manubri',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Salita in curl classico (palmi in alto) e discesa in pronazione (palmi in basso) per bicipiti e avambracci insieme.',
    targetMuscles: ['Bicipiti', 'Avambracci (estensori e flessori)'],
    tips: 'Ruota i polsi in alto e scendi lentamente controllando il peso.'
  },
  {
    id: 'tate_press_manubri',
    name: 'Tate Press con manubri',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Estensione per tricipiti su panca tenendo i manubri sul petto e spingendo verso l\'esterno.',
    targetMuscles: ['Tricipiti'],
    tips: 'I manubri si toccano all\'inizio sul petto e ruotano verso l\'esterno.'
  },
  {
    id: 'wrist_curl_manubri',
    name: 'Wrist Curl / Reverse Wrist Curl con manubri',
    muscleGroup: 'Braccia',
    equipment: 'Manubri',
    description: 'Flessione ed estensione dei polsi con avambraccio in appoggio per la forza della presa e avambracci.',
    targetMuscles: ['Muscoli flessori ed estensori dell\'avambraccio'],
    tips: 'Usa un peso leggero e controlla l\'escursione del polso.'
  },
  // Elastici Braccia
  {
    id: 'biceps_curl_elastico',
    name: 'Biceps Curl con elastico',
    muscleGroup: 'Braccia',
    equipment: 'Elastici',
    description: 'Calpestando l\'elastico e flettendo i gomiti per una tensione continua.',
    targetMuscles: ['Bicipiti'],
    tips: 'Gomiti bloccati ai fianchi, non farli avanzare.'
  },
  {
    id: 'pushdown_tricipiti_elastico',
    name: 'Pushdown tricipiti con elastico',
    muscleGroup: 'Braccia',
    equipment: 'Elastici',
    description: 'Elastico ancorato in alto (es. porta), spinta verso il basso per bruciare i tricipiti.',
    targetMuscles: ['Tricipiti'],
    tips: 'Apri leggermente le estremità dell\'elastico a fine corsa per aumentare la contrazione.'
  },
  {
    id: 'overhead_extension_elastico',
    name: 'Extension sopra la testa (Overhead Extension) con elastico',
    muscleGroup: 'Braccia',
    equipment: 'Elastici',
    description: 'Elastico ancorato in basso o sotto i piedi, spinta verso l\'alto per il capo lungo del tricipite.',
    targetMuscles: ['Capo lungo del tricipite'],
    tips: 'Permette di allenare il tricipite in massimo allungamento.'
  },
  {
    id: 'overhead_mono_elastico',
    name: 'Overhead Triceps Extension mono-braccio con elastico',
    muscleGroup: 'Braccia',
    equipment: 'Elastici',
    description: 'Estensione sopra la testa unilaterale con fascia di resistenza per isolare il capo lungo.',
    targetMuscles: ['Capo lungo tricipite unilaterale'],
    tips: 'Tieni il braccio vicino all\'orecchio mentre distendi la mano in alto.'
  },
  {
    id: 'hammer_curl_elastico',
    name: 'Hammer Curl con elastico',
    muscleGroup: 'Braccia',
    equipment: 'Elastici',
    description: 'Curl a presa neutra con fascia di resistenza per il muscolo brachiale.',
    targetMuscles: ['Brachiale', 'Bicipiti'],
    tips: 'Mantieni i pollici rivolti verso il soffitto per tutta la tirata.'
  },

  // ================= 6. ADDOME E CORE =================
  // Corpo Libero Addome
  {
    id: 'plank_frontale_laterale',
    name: 'Plank (frontale e laterale)',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Tenuta isometrica fondamentale per la stabilità di tutto il torchio addominale e colonna.',
    targetMuscles: ['Trasverso dell\'addome', 'Retto dell\'addome', 'Obliqui'],
    tips: 'Retroverti il bacino, contrai addome e glutei senza far cedere la schiena.'
  },
  {
    id: 'crunch_reverse_crunch',
    name: 'Crunch / Reverse Crunch',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Flessione della colonna per il retto dell\'addome (crunch) e parte inferiore/bacino (reverse).',
    targetMuscles: ['Retto dell\'addome superiore e inferiore'],
    tips: 'Espira tutta l\'aria quando ti chiudi sentendo l\'ombelico rientrare.'
  },
  {
    id: 'leg_raises_hollow_hold',
    name: 'Leg Raises / Hollow Body Hold',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Sollevamento gambe e tenuta barchetta ginnica per addome inferiore e forza profonda.',
    targetMuscles: ['Retto addominale basso', 'Flessori dell\'anca', 'Core profondo'],
    tips: 'La zona lombare deve restare costantemente incollata a terra.'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Lavoro dinamico e cardio per stabilità del core, spalle e bruciare calorie.',
    targetMuscles: ['Addome', 'Flessori anca', 'Spalle'],
    tips: 'Ginocchia che scattano veloci verso il petto mantenendo le anche basse.'
  },
  {
    id: 'dragon_flag',
    name: 'Dragon Flag (Bandiera del drago)',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Sollevamento del corpo in blocco sostenendosi solo con le spalle, esercizio avanzato di pura forza.',
    targetMuscles: ['Tutto il retto addominale', 'Core profondo'],
    tips: 'Non piegare il bacino: corpo dritto come una freccia.'
  },
  {
    id: 'deadbug',
    name: 'Deadbug',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Coordinazione e stabilizzazione lombare a terra a braccia e gambe controlaterali alternate.',
    targetMuscles: ['Trasverso dell\'addome', 'Multifido', 'Coordinazione'],
    tips: 'Muoviti lentamente e mantieni la schiena premuta a terra.'
  },
  {
    id: 'bird_dog',
    name: 'Bird-Dog',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'In quadrupedia, estensione alternata di braccio e gamba opposta per la stabilità posteriore e colonna.',
    targetMuscles: ['Erettori spinali', 'Glutei', 'Core'],
    tips: 'Crea una linea continua dita della mano - tallone opposto senza ruotare il bacino.'
  },
  {
    id: 'windshield_wipers',
    name: 'Windshield Wipers (Tergicristallo a terra)',
    muscleGroup: 'Addome e Core',
    equipment: 'Corpo Libero',
    description: 'Rotazioni delle gambe oscillate controllate da un lato all\'altro per la forza degli obliqui.',
    targetMuscles: ['Obliqui interni ed esterni', 'Retto addominale'],
    tips: 'Braccia a croce a terra per sostenere il busto mentre le gambe scendono controllate.'
  },
  // Manubri Addome
  {
    id: 'russian_twist_manubrio',
    name: 'Russian Twist con manubrio',
    muscleGroup: 'Addome e Core',
    equipment: 'Manubri',
    description: 'Rotazioni del busto da seduti a gambe sollevate tenendo un manubrio per scolpire gli obliqui.',
    targetMuscles: ['Obliqui', 'Retto addominale'],
    tips: 'Ruota con le spalle e il petto, non muovere solo le braccia.'
  },
  {
    id: 'side_bend_manubrio',
    name: 'Side Bend (piegamenti laterali) con manubrio',
    muscleGroup: 'Addome e Core',
    equipment: 'Manubri',
    description: 'Flessione laterale del busto per rinforzare e tonificare la fascia laterale del core.',
    targetMuscles: ['Obliqui', 'Quadrato dei lombi'],
    tips: 'Esegui tenendo un solo manubrio per lato, senza oscillare avanti o indietro.'
  },
  {
    id: 'suitcase_carry_manubrio',
    name: 'Suitcase Carry (Camminata della valigia con manubrio)',
    muscleGroup: 'Addome e Core',
    equipment: 'Manubri',
    description: 'Camminata tenendo un manubrio pesante in una sola mano per allenare l\'anti-flessione laterale del core.',
    targetMuscles: ['Core anti-flessione', 'Obliqui', 'Presa'],
    tips: 'Busto perfettamente verticale come se avessi due pesi bilanciati.'
  },
  {
    id: 'farmers_walk_manubri',
    name: 'Farmer\'s Walk (Camminata del contadino con manubri)',
    muscleGroup: 'Addome e Core',
    equipment: 'Manubri',
    description: 'Camminata con due manubri pesanti per la compattezza del core, trapezi e forza della presa.',
    targetMuscles: ['Core complessivo', 'Trapezi', 'Presa avambracci'],
    tips: 'Passi corti, petto fiero e spalle tirate indietro.'
  },
  // Elastici Addome
  {
    id: 'pallof_press_elastico',
    name: 'Pallof Press con elastico',
    muscleGroup: 'Addome e Core',
    equipment: 'Elastici',
    description: 'Esercizio anti-rotazionale eccellente per la stabilità del core e la protezione della colonna vertebrale.',
    targetMuscles: ['Core profondo anti-rotazionale', 'Obliqui', 'Glutei'],
    tips: 'Spingi le mani in avanti resistendo alla trazione laterale dell\'elastico.'
  },
  {
    id: 'woodchopper_elastico',
    name: 'Woodchopper (il taglialegna) con elastico',
    muscleGroup: 'Addome e Core',
    equipment: 'Elastici',
    description: 'Trazioni diagonali con elastico dall\'alto al basso o dal basso all\'alto per gli obliqui.',
    targetMuscles: ['Obliqui', 'Trasverso', 'Spalle'],
    tips: 'Ruota perno sulla caviglia posteriore trasferendo la forza dal bacino alle braccia.'
  }
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Petto',
  'Dorso',
  'Spalle',
  'Gambe e Glutei',
  'Braccia',
  'Addome e Core'
];

export const EQUIPMENT_TYPES: EquipmentType[] = [
  'Corpo Libero',
  'Manubri',
  'Elastici',
  'Altro'
];
