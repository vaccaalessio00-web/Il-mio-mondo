// Cute Chibi Mascot Illustrations
import chibiEngineerGirl from './images/chibi_engineer_girl_1790975924961.jpg';
import chibiFitworldMascot from './images/chibi_fitworld_mascot_1790976664757.jpg';
import chibiProgressGirl from './images/chibi_curly_prog_1790975076566.jpg';
import chibiHistoryBook from './images/chibi_history_book_1790976022505.jpg';
import chibiCoachEngfa from './images/chibi_coach_engfa_1790978253730.jpeg';
import chibiFriendCharlotte from './images/chibi_friend_charlotte_1790978490098.jpeg';
import chibiBoyfriendPuzzola from './images/chibi_boyfriend_puzzola_1790978760758.jpg';
import chibiDogGyo from './images/gyo_mascot_1791104391445.jpeg';
import chibiRabbitPhalo from './images/phalo_mascot_1791104403671.jpeg';
import chibiTofuMascot from './images/tofu_mascot_1791104413474.jpeg';
import chibiDogDobby from './images/gyo_mascot_1791104391445.jpeg'; // Using existing as placeholder
import chibiRabbitKraprao from './images/phalo_mascot_1791104403671.jpeg'; // Using existing as placeholder

// Personalizzazioni inserite dall'utente nella cartella ./custom_mascots e ./logo
import { CUSTOM_MASCOTS } from './custom_mascots';
import { APP_CUSTOM_LOGO } from './logo';

export const CHIBI_MASCOT_MAIN = CUSTOM_MASCOTS.main || chibiEngineerGirl;
export const CHIBI_FITWORLD_MASCOT = APP_CUSTOM_LOGO || CUSTOM_MASCOTS.fitworld || chibiFitworldMascot; 
export const CHIBI_MASCOT_PROGRESS = chibiProgressGirl;
export const CHIBI_MASCOT_HISTORY = chibiHistoryBook;
export const CHIBI_COACH_ENGFA = CUSTOM_MASCOTS.engfa || chibiCoachEngfa;
export const CHIBI_FRIEND_CHARLOTTE = CUSTOM_MASCOTS.charlotte || chibiFriendCharlotte;
export const CHIBI_BOYFRIEND_PUZZOLA = CUSTOM_MASCOTS.puzzola || chibiBoyfriendPuzzola;
export const CHIBI_DOG_GYO = CUSTOM_MASCOTS.gyo || chibiDogGyo;
export const CHIBI_RABBIT_PHALO = CUSTOM_MASCOTS.phalo || chibiRabbitPhalo;
export const CHIBI_TOFU_MASCOT = CUSTOM_MASCOTS.tofu || chibiTofuMascot;
export const CHIBI_DOG_DOBBY = CUSTOM_MASCOTS.dobby || chibiDogDobby;
export const CHIBI_RABBIT_KRAPRAO = CUSTOM_MASCOTS.kraprao || chibiRabbitKraprao;

// ... (after quotes arrays)
export const GYO_QUOTES = [
    "Bau bau! Fai un respiro lento: inspira per 4 secondi, espira per 6.",
    "Concentrati su 3 cose che puoi vedere. Bau!",
    "Accetta la sensazione, non combatterla. Bau bau!",
    "Rilassa le spalle e la mascella.",
    "Sei al sicuro. Bau!",
    "Woof! Sei forte, credici!",
    "Un piccolo passo oggi, un grande traguardo domani.",
    "La calma è una superpotenza. Bau bau!",
    "Respira insieme a me, bau!",
    "Sono qui con te in ogni momento. Woof!"
];

export const PHALO_QUOTES = [
    "Squit! Fai un piccolo salto di gioia!",
    "Pensa a un prato verde e soffice. Squit squit!",
    "Mangia una carota croccante (metaforica).",
    "Muovi le orecchie e ascolta il silenzio. Squit!",
    "Sei leggera come un coniglietto. Squit squit!",
    "L'ansia è solo una nuvola che passa.",
    "Respira profondamente, sei brava.",
    "Squit! Credi nelle tue capacità.",
    "Sei al sicuro qui con me.",
    "Squit! Un passo alla volta, andrà bene."
];

export const TOFU_QUOTES = [
    "Mantieni l'equilibrio interiore.",
    "Sei forte e stabile come un blocco di tofu.",
    "Respira con calma, tutto è in armonia.",
    "Non avere fretta, goditi il processo.",
    "Sei speciale così come sei.",
    "L'ansia non ti definisce.",
    "Sei pronta ad affrontare la giornata.",
    "Sii gentile con te stessa.",
    "Ascolta il tuo respiro.",
    "Sei calma, sei tranquilla."
];

export const DOBBY_QUOTES = [
    "Dobby è felice di aiutarti ad allenarti! Bau!",
    "Dobby ha portato un calzino, ma ora portiamo grinta!",
    "Sei libera, come Dobby! Bau bau!",
    "Ogni esercizio è un passo verso la libertà.",
    "Dobby è un elfo leale e tu sei una guerriera leale!",
    "Bau! Respira, sei una roccia.",
    "Non aver paura dell'ansia, superala!",
    "Woof! Sei pronta per questa sfida.",
    "Dobby crede in te. Bau bau!",
    "Sei fantastica, non dimenticarlo mai."
];

export const KRAPRAO_QUOTES = [
    "Il gusto piccante della vittoria! Squit!",
    "Un saltello e via, energia pura!",
    "Sii veloce come un coniglietto in cucina! Squit squit!",
    "Non aver paura di osare, come nel Kraprao!",
    "Sei saporita e fantastica! Squit!",
    "Respira, sei calma.",
    "Squit! Hai la forza necessaria.",
    "L'ansia passerà, tu sei forte.",
    "Squit squit! Fidati di te.",
    "Sei coraggiosa."
];

export const CHIBI_QUOTES = [
  'Ogni ripetizione ti rende più forte e radiosa! ✨',
  'Occhiali saldi e carica al massimo! Stai andando benissimo! 👓💪',
  'Bevi un po\' d\'acqua e respira! La costanza premia sempre! 💧',
  'La tecnica prima di tutto: precisione ed eleganza! 🌸',
  'I glutei ringrazieranno per questo sforzo! 🍑✨',
  'Fai una pausa, recupera il fiato e poi riparti con grinta! 🍃',
  'Un passo alla volta, giorno dopo giorno! Ti sostengo io con MyWorld! 🎀'
];

export const ENGFA_QUOTES = [
  'La disciplina è la chiave del successo. Non mollare ora.',
  'Ogni sforzo che fai oggi è un investimento nel tuo futuro.',
  'La costanza batte la motivazione ogni singolo giorno.',
  'Non scusarti per la fatica, sii orgogliosa di averla superata.',
  'Il tuo corpo è in grado di fare tutto, è la tua mente che devi convincere.',
  'La perfezione non esiste, esiste solo il miglioramento continuo.',
  'Ogni allenamento è una vittoria, celebrala con impegno.',
  'Focus totale, nessun errore, massimo rendimento.',
  'Non è questione di fortuna, è questione di preparazione.',
  'Il tuo unico limite sei tu. Superalo.'
];

export const CHARLOTTE_QUOTES = [
  'Ehi! Pronta per una sessione fantastica? Alleniamoci insieme!',
  'Adoro questo allenamento! Facciamolo diventare il nostro preferito!',
  'Non dimenticare di bere, amica mia! Sei forte!',
  'Che energia oggi! Vedrai che risultati otterremo!',
  'Un po\' di musica e via, questo esercizio è una passeggiata!',
  'Siamo una squadra imbattibile, continuiamo così!',
  'Sorridi! Fare fitness con te è la parte migliore della mia giornata!',
  'Dai, che siamo quasi alla fine! Ci divertiamo troppo!',
  'Il tuo sorriso è la mia motivazione, sei fantastica!',
  'Riposiamoci un secondo, amica mia, poi torniamo più cariche di prima!'
];

export const PUZZOLA_QUOTES = [
  'Vai mon Amour, ce la fai! Sono così orgoglioso di te!',
  'Sei stupenda mentre ti alleni, non mollare!',
  'Un altro sforzo e poi ci rilassiamo insieme, tesoro!',
  'Sei la mia guerriera preferita, continua così!',
  'Ogni goccia di sudore ti rende ancora più speciale ai miei occhi.',
  'Credo in te più di chiunque altro, forza amore mio!',
  'Sei una roccia! Ti amo tanto, non dimenticarlo mai!',
  'Ti guardo e mi stupisco di quanta forza hai, sei meravigliosa!',
  'Respira amore mio, sei a un passo dal tuo obiettivo.',
  'Sei incredibile, ogni giorno mi fai innamorare di più della tua determinazione.'
];
