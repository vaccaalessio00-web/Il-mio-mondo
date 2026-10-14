import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Sparkles, Check, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import {
  ILE_CUSTOM_IMAGE,
  ILE_FUGGIASCHI_IMAGES,
  ILE_PASSANTI_IMAGES,
  ILE_SFONDO_IMAGE
} from '../../assets/minigames';

// Liste immagini caricate dall'utente in public/ile/
const LOCAL_FUGGIASCHI_STRADA = [
  '/ile/fuggiaschi/ladro.png',
  '/ile/fuggiaschi/ladro2.png',
  '/ile/fuggiaschi/ladro3.png',
  '/ile/fuggiaschi/ladro4.png',
  '/ile/fuggiaschi/ladro5.png',
  '/ile/fuggiaschi/ladro6.png',
  '/ile/fuggiaschi/ladro7.png',
  '/ile/fuggiaschi/ladro8.png'
];

const LOCAL_FUGGIASCHI_UCCELLI = [
  '/ile/fuggiaschi/ladrouccello.png'
];

const LOCAL_PASSANTI_STRADA = [
  '/ile/passanti/passanti.png',
  '/ile/passanti/passanti2.png',
  '/ile/passanti/passanti3.png',
  '/ile/passanti/passanti4.png',
  '/ile/passanti/passanti5.png',
  '/ile/passanti/passanti6.png',
  '/ile/passanti/passanti7.png',
  '/ile/passanti/passanti8.png',
  '/ile/passanti/passanti9.png',
  '/ile/passanti/passanti10.png'
];

const LOCAL_PASSANTI_UCCELLI = [
  '/ile/passanti/uccello.png',
  '/ile/passanti/uccello2.png'
];

const LOCAL_AGENTE_ILE = '/ile/agente/ile.png';
const LOCAL_SFONDO_CITTA = '/ile/sfondo/sfondo.png';

interface TargetEntity {
  id: number;
  type: 'target' | 'civilian';
  name: string;
  icon: string;
  customImage?: string;
  isBird: boolean;
  isPopup?: boolean; // Compare a sbalzi fermo sul posto, senza scorrere!
  x?: number; // Posizione orizzontale fissa per le entità a sbalzi
  startX: number; // percentage horizontal starting point
  endX: number; // percentage horizontal ending point
  y: number; // percentage vertical
  duration: number; // travel duration in seconds (slow movement)
  expiresAt: number;
  direction: 'left' | 'right';
  points?: number; // 10 base, 30 per ladro 2, 50 per ladro super veloce (+60% velocità)
  isFast?: boolean; // Ladro più veloce del 60%
  isLadro2?: boolean; // Ladro 2 (compare 20% meno spesso, vale 30 punti)
}

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

// Componente testo a riga singola: se il testo eccede la larghezza, scorre orizzontalmente
const SingleLineMarquee: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowDistance, setOverflowDistance] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setOverflowDistance(diff > 4 ? diff + 18 : 0);
    }
  }, [text]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      {overflowDistance > 0 ? (
        <motion.div
          key={text}
          animate={{ x: [0, -overflowDistance, 0] }}
          transition={{
            duration: Math.max(5, overflowDistance * 0.05 + 3.5),
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.2
          }}
          className="inline-block whitespace-nowrap will-change-transform"
        >
          <span ref={textRef}>{text}</span>
        </motion.div>
      ) : (
        <span ref={textRef} className="inline-block whitespace-nowrap">
          {text}
        </span>
      )}
    </div>
  );
};

// Messaggi milestone speciali detti DIRETTAMENTE da Agente Ile a "zii"
const MILESTONE_MESSAGES: Record<number, string> = {
  100: '«Zii splendida! Ti ricordo io in persona che sei bravissima e luminosa! 💖»',
  200: '«Fine pattuglia: ti porto a mangiare una pizza gigante stasera, promesso zii! 🍕»',
  300: '«Zii, per me sei la poliziotta più in gamba e dolce di tutto il pianeta! ⭐»',
  400: '«Respira piano zii... sono fierissima di te, ogni singolo momento della giornata 💕»',
  500: '«Coccole autorizzate da me per te, zii! Ti meriti tutto l\'affetto del mondo! 🍩»',
  600: '«Tranquilla zii, qualunque cosa accada io la tua Ile sono sempre al tuo fianco ✨»',
  700: '«Sei una forza della natura zii! Splendida e invincibile insieme a me! 🌸»',
  800: '«Quartiere in pace e cuore leggero: sei fantastica zii! Ti adoro! 💖»',
  900: '«Ti consegno la medaglia d\'oro dell\'affetto, sei la spalla più bella e speciale! 🥇»',
  1000: '«Leggenda assoluta zii! Tutta la città e io ti vogliamo un bene infinito! 🏆»',
  1100: '«Zii, con la tua dolcezza hai reso le nostre strade un paradiso di pace! 🌺»',
  1200: '«Io e tutta la città ti siamo grate, zii! Sei straordinaria e dolcissima! 🌟»'
};

const ILE_VOICE_QUOTES = [
  '«Tranquilla zii, qui ci penso io a tenere la città in pace con te! 🚓»',
  '«Zii, sei bravissima! Non ti scappa un birichino! ✨»',
  '«Grande zii, sei la poliziotta più in gamba e splendida della centrale! ⭐»',
  '«Zii, ti vedo concentratissima! Ricordati di fare un bel respiro ogni tanto 🌸»',
  '«Mamma mia zii che riflessi! Sei proprio una forza della natura! 💨»',
  '«Zii, guarda come splende il quartiere grazie a te oggi! 🕊️»',
  '«Rilassa le spalle zii, stiamo andando alla grande insieme! 💕»',
  '«Zii, sei la mia compagna di pattuglia preferita al mondo! 💖»',
  '«Acchiappato con classe! Sei troppo forte zii! 🦝»',
  '«Zii, confermo io: sei la poliziotta più stupenda del comando! 🌟»',
  '«Sei un po\' stanca zii? Quando vuoi premiamo Chiudi Turno e ci rilassiamo ☕»',
  '«Zii, un altro birichino convinto con dolcezza e affetto! 🎈»',
  '«Zii, ma quanto sei brava?! Ti meriti un monumento nel parco! 🏆»',
  '«Zero fretta zii, ogni secondo qui è fatto per farti stare serena 🌿»',
  '«Zii, la città non è mai stata così tranquilla e coccolosa! 🐱»',
  '«Fai un bel respiro profondo zii... espira tutta la tensione ✨»',
  '«Zii, stasera pizza gigante tutta per te, te la sei strameritata! 🍕»',
  '«Proteggiamo i passanti e seminiamo calma, sei magnifica zii! 🛡️»',
  '«Zii, sei una meraviglia di ragazza! Fierissima della mia spalla! ⭐»',
  '«Tutto sotto controllo zii, siamo una squadra imbattibile noi due! 🚓»',
  '«Zii, ogni furbetto che fermi porta un sorriso in più nel quartiere! 🌸»',
  '«Sei imbattibile zii! Mi fai fare sempre un figurone al comando! 🍩»',
  '«Dolcezza e polso fermo: sei la migliore del mondo, zii! 💖»',
  '«Prendiamocela comoda zii, la nostra ronda è una passeggiata di pace! 🕊️»',
  '«Zii, ti voglio un bene dell\'anima! Grazie per essere qui con me! 💕»',
  '«Zii, hai visto quel cagnolino come scodinzolava contento? Sei un angelo! 🐶»',
  '«Bravissima zii! Con te di guardia la città dorme sonni sereni e felici! 🌙»',
  '«Niente ansia zii, niente timer e zero pressioni: sei libera di goderti ogni attimo! 🌼»',
  '«Zii, sei la persona più dolce e determinata che conosca! 🧁»',
  '«Oggi splendi più delle sirene della volante, zii! ✨»',
  '«Zii, ogni turno con te è una dose pura di buonumore e serenità! 🌈»',
  '«Ti meriti una tazza gigante di cioccolata calda e tante coccole, zii! ☕»',
  '«Occhio vigile e cuore grande: non ti batte nessuno, zii! 🎯»',
  '«Un respiro dentro... e un respiro fuori... sei fortissima e dolcissima zii! 🍃»',
  '«Regalati un bel sorriso zii, stai facendo un lavoro meraviglioso! 😊»',
  '«Zii, chiudi pure il turno quando vuoi: la tua tranquillità è la cosa più preziosa! 🏡»',
  '«Sei una guerriera di tenerezza, zii! Nessun dubbio! 💫»',
  '«Zii, con te alla guida i furbetti si arrendono subito alla gentilezza! 🕵️‍♀️»',
  '«Adoro stare di pattuglia con te zii: mi trasmetti una pace infinita! 🤍»',
  '«Guarda che cielo limpido abbiamo regalato al quartiere oggi, zii! 🌻»',
  '«Sei unica zii, non dimenticartelo mai e poi mai! 🥇»',
  '«Se fossimo in una serie tv, saresti la poliziotta più amata e simpatica di tutte, zii! 🎬»',
  '«Tranquillità pura zii: assapora questo momento di quiete! 🌺»',
  '«La tua compagna Ile ti guarda le spalle in ogni secondo, zii! 🤝»',
  '«Bravissima e splendida zii! Continua al tuo ritmo senza pensieri! 🎈»',
  '«Zii, sei una calamita di cose belle e gesti gentili! 🧲✨»',
  '«Zii, oggi meriti solo relax, pensieri leggeri e un abbraccio fortissimo! 🧸»',
  '«Fai spazio alla leggerezza zii: sei bravissima, adorabile e super in gamba! 🌷»',
  '«Zii, hai una grazia e una mira pazzesca! Non c\'è fuggiasco che resista! 🎯»',
  '«Soffia via i pensieri pesanti zii: siamo qui solo per divertirci e rilassarci! 🌬️»',
  '«Zii, sei la regina del quartiere! Pace fatta ovunque passi tu! 👑»',
  '«Tranquilla zii, prenditi tutto il tempo che vuoi, qui il tempo è nostro alleato! ⏳🌿»',
  '«Zii, ti sei accorta di quanto sei preziosa? Io e tutta la città te lo ricordiamo! 💖»',
  '«Anche i passanti ti salutano con la manina zii: sei entrata nel cuore di tutti! 👋»',
  '«Zii, che stile impeccabile! Pattugliare con te è un vero piacere! 🕶️»',
  '«Zii, se senti un po\' di stanchezza ricordati che puoi fermarti quando vuoi, bravissima! 🛋️»',
  '«Sei fantastica zii! La tua dolcezza calma anche il furbetto più dispettoso! 🍪»',
  '«Un bel sorriso per la mia poliziotta preferita zii, oggi hai spaccato! 🌟»'
];

export const IleInAzione: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Punteggio (nessun livello, nessuna barra di stress)
  const [score, setScore] = useState<number>(0);
  const [capturedCount, setCapturedCount] = useState<number>(0);
  const [protectedCount, setProtectedCount] = useState<number>(0);
  const [donutCount, setDonutCount] = useState<number>(0);

  // Miglior record salvato su Cloud / localStorage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fitworld_ile_record');
      if (saved) return parseInt(saved, 10) || 0;
      const activeEmail = localStorage.getItem('fitworld_active_email');
      if (activeEmail) {
        const u = localStorage.getItem(`fitworld_user_${activeEmail}`);
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.ileRecord) return parsed.ileRecord;
        }
      }
    } catch {}
    return 0;
  });

  // Salva il record sul Cloud e sincronizza con l'account
  const saveRecordToCloud = useCallback((recordScore: number) => {
    try {
      localStorage.setItem('fitworld_ile_record', String(recordScore));
      const activeEmail = localStorage.getItem('fitworld_active_email');
      if (activeEmail) {
        const userKey = `fitworld_user_${activeEmail}`;
        const raw = localStorage.getItem(userKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.ileRecord = Math.max(parsed.ileRecord || 0, recordScore);
          localStorage.setItem(userKey, JSON.stringify(parsed));
          const pending = parseInt(localStorage.getItem('fitworld_offline_pending') || '0', 10);
          localStorage.setItem('fitworld_offline_pending', String(pending + 1));
        }
      }
    } catch (e) {
      console.warn('Errore salvataggio record su cloud:', e);
    }
  }, []);

  // Ile speech quotes pool
  const [ileQuote, setIleQuote] = useState<string>(() => {
    return ILE_VOICE_QUOTES[Math.floor(Math.random() * ILE_VOICE_QUOTES.length)];
  });

  const pickRandomQuote = useCallback(() => {
    setIleQuote(prev => {
      const candidates = ILE_VOICE_QUOTES.filter(q => q !== prev);
      return candidates[Math.floor(Math.random() * candidates.length)] || prev;
    });
  }, []);

  // Custom assets state (suports bundled src/assets/minigames/ile and static public/ile/)
  const [activeSfondo, setActiveSfondo] = useState<string | null>(ILE_SFONDO_IMAGE || LOCAL_SFONDO_CITTA);
  const [activeIleImage, setActiveIleImage] = useState<string | null>(ILE_CUSTOM_IMAGE || LOCAL_AGENTE_ILE);

  useEffect(() => {
    // Probing for images in public/ile/
    if (!activeSfondo) {
      const candidates = [
        '/ile/sfondo/sfondo.png',
        '/ile/sfondo/sfondo.jpeg',
        '/ile/sfondo/sfondo.jpg',
        '/ile/sfondo/sfondo.webp'
      ];
      for (const src of candidates) {
        const img = new Image();
        img.src = src;
        img.onload = () => setActiveSfondo(src);
      }
    }

    if (!activeIleImage) {
      const candidates = [
        '/ile/agente/ile.png',
        '/ile/agente/ile.jpeg',
        '/ile/agente/ile.jpg',
        '/ile/agente/agente.png'
      ];
      for (const src of candidates) {
        const img = new Image();
        img.src = src;
        img.onload = () => setActiveIleImage(src);
      }
    }
  }, [activeSfondo, activeIleImage]);

  // Entities & floating effects
  const [entities, setEntities] = useState<TargetEntity[]>([]);
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);

  // Conteggio fuggiaschi scappati (non toccati prima della scadenza)
  const [escapedCount, setEscapedCount] = useState<number>(0);
  const [isScarsaPaused, setIsScarsaPaused] = useState<boolean>(false);

  // Pausa traffico "ALT! Strada bloccata" (senza sfocatura)
  const [isTrafficBlocked, setIsTrafficBlocked] = useState<boolean>(false);
  const [showDonutPause, setShowDonutPause] = useState<boolean>(false);
  const [nextDonutThreshold, setNextDonutThreshold] = useState<number>(() => {
    return Math.floor(Math.random() * (500 - 200 + 1)) + 200; // tra 200 e 500
  });

  // Milestones speciali dette da Agente Ile: solo a 100, 300, 500 e dai 500 in su una ogni 500
  const [activeMilestoneMessage, setActiveMilestoneMessage] = useState<string | null>(null);
  const quoteMilestonesRef = useRef<Set<number>>(new Set());

  // End of duty & rules
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);

  // References for loop
  const nextEntityIdRef = useRef<number>(1);
  const nextEffectIdRef = useRef<number>(1);
  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isTrafficBlocked || showDonutPause || showSummary || isScarsaPaused;

  // Add floating effect
  const triggerFloatingEffect = useCallback((x: number, y: number, text: string, color: string) => {
    const id = nextEffectIdRef.current++;
    setFloatingEffects(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(e => e.id !== id));
    }, 1100);
  }, []);

  // Controllo traguardi voce: compare SOLO a 100, 300, 500 e dai 500 in su ogni 500 punti
  const checkVoiceQuoteMilestones = useCallback((prevScore: number, nextScore: number) => {
    const fixedMilestones = [100, 300, 500];
    for (const m of fixedMilestones) {
      if (prevScore < m && nextScore >= m && !quoteMilestonesRef.current.has(m)) {
        quoteMilestonesRef.current.add(m);
        const msg = MILESTONE_MESSAGES[m] || `«Traguardo ${m} punti raggiunto! Sei una favola, zii! 💖»`;
        setActiveMilestoneMessage(msg);
        setIleQuote(msg);
        soundManager.playMissionComplete();
        setTimeout(() => setActiveMilestoneMessage(null), 2500);
        return;
      }
    }
    // Dai 500 in su: una ogni 500 punti (1000, 1500, 2000, ...)
    if (nextScore >= 1000) {
      const step = Math.floor(nextScore / 500) * 500;
      if (step >= 1000 && prevScore < step && nextScore >= step && !quoteMilestonesRef.current.has(step)) {
        quoteMilestonesRef.current.add(step);
        const msg = MILESTONE_MESSAGES[step] || `«Traguardo ${step} punti superato! Sei leggendaria zii! 🏆»`;
        setActiveMilestoneMessage(msg);
        setIleQuote(msg);
        soundManager.playMissionComplete();
        setTimeout(() => setActiveMilestoneMessage(null), 2500);
      }
    }
  }, []);

  // Handle capturing targets or clicking pedestrians
  const handleEntityClick = (entity: TargetEntity, e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (isPausedRef.current) return;

    const effectX = entity.isPopup && typeof entity.x === 'number' ? entity.x : 50;

    if (entity.type === 'target') {
      // 1. CATTURA FUGGIASCO: punti differenziati (Ladro 2: 30pt, Veloce: 50pt, Altri: 10pt)
      const pointsWon = entity.points ?? (entity.isFast ? 50 : entity.isLadro2 ? 30 : 10);
      soundManager.playHandcuffCapture();

      const badgeLabel = entity.isFast
        ? `+${pointsWon} Sprint ⚡`
        : entity.isLadro2
        ? `+${pointsWon} Ladro 2 ⭐`
        : `+${pointsWon} Calma ✨`;

      const badgeColor = entity.isFast
        ? 'text-purple-600 font-black'
        : entity.isLadro2
        ? 'text-amber-600 font-black'
        : 'text-amber-500';

      triggerFloatingEffect(effectX, entity.y, badgeLabel, badgeColor);

      setEntities(prev => prev.filter(item => item.id !== entity.id));
      setCapturedCount(prev => prev + 1);

      setScore(prevScore => {
        const nextScore = prevScore + pointsWon;

        // Se supera il record precedente, aggiorna e salva sul Cloud
        if (nextScore > highScore) {
          setHighScore(nextScore);
          saveRecordToCloud(nextScore);
        }

        // Controlla se abbiamo raggiunto uno dei traguardi voce specificati (100, 300, 500, o multipli di 500)
        checkVoiceQuoteMilestones(prevScore, nextScore);

        // Check Donut Pause threshold (random 200 - 500)
        if (nextScore >= nextDonutThreshold) {
          setShowDonutPause(true);
          setDonutCount(d => d + 1);
          soundManager.playDonutChime();
          const nextInterval = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
          setNextDonutThreshold(nextScore + nextInterval);
        }

        return nextScore;
      });
    } else {
      // 2. PASSANTE / CIVILE TOCCATO PER ERRORE:
      // Nessuna vita persa, nessun punto perso! Stop rilassante di almeno 3 secondi!
      soundManager.playTrafficPause();
      triggerFloatingEffect(effectX, entity.y, 'Zona Protetta 🛡️', 'text-emerald-500');
      setProtectedCount(prev => prev + 1);

      // Cartello "ALT! Strada bloccata" per almeno 3 secondi (3500ms, senza sfocatura sullo sfondo)
      setIsTrafficBlocked(true);
      setTimeout(() => {
        setIsTrafficBlocked(false);
      }, 3500);
    }
  };

  // Calcolo della posizione orizzontale stimata di un'entità per evitare qualsiasi sovrapposizione
  const getEntityCurrentX = (entity: TargetEntity, now: number): number => {
    if (entity.isPopup) {
      return entity.x ?? 50;
    }
    const totalMs = entity.duration * 1000;
    const elapsed = Math.max(0, now - (entity.expiresAt - totalMs));
    const progress = Math.min(1, elapsed / totalMs);
    return entity.startX + (entity.endX - entity.startX) * progress;
  };

  // Verifica rigorosa anti-sovrapposizione:
  // - Nessuna entità può generarsi sopra o troppo vicino ad altre
  // - Se la differenza verticale Y è < 4.5%, la corsia è considerata occupata
  // - Se Y è entro 7.5%, la distanza orizzontale X deve essere di almeno 22%
  const isPositionConflicting = (candX: number, candY: number, activeList: TargetEntity[], now: number): boolean => {
    return activeList.some(existing => {
      // Stessa corsia: collisione vietata
      if (Math.abs(existing.y - candY) < 4.5) {
        return true;
      }
      // Corsie adiacenti ravvicinate: verifica distanza orizzontale
      if (Math.abs(existing.y - candY) < 7.5) {
        const curX = getEntityCurrentX(existing, now);
        if (Math.abs(curX - candX) < 22) {
          return true;
        }
      }
      return false;
    });
  };

  // Spawner loop:
  // - COMPARSA FREQUENTE DI PERSONE: più passanti e ladri sulla strada come richiesto
  // - ANTI-SOVRAPPOSIZIONE ASSOLUTA: corsie separate e controllo distanza
  // - A sbalzi senza scorrere (~35%) oppure scorrimento lento
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (isPausedRef.current) return;

      setEntities(prev => {
        const now = Date.now();

        // 1. CONTEGGIO FUGGIASCHI SCAPPATI (non toccati prima della scadenza: soglia impostata a 5)
        const newlyExpiredTargets = prev.filter(e => e.expiresAt <= now && e.type === 'target');
        if (newlyExpiredTargets.length > 0) {
          setEscapedCount(oldEsc => {
            const nextEsc = oldEsc + newlyExpiredTargets.length;
            if (nextEsc >= 5) {
              setIsScarsaPaused(true);
              soundManager.playNinniAlert();
            }
            return nextEsc;
          });
        }

        // Clear entities that finished traversing or expired
        const filtered = prev.filter(e => e.expiresAt > now);
        // Consenti fino a 10 entità contemporanee per avere una città viva e popolata
        if (filtered.length >= 10) return filtered;

        // Maggioranza di persone per strada (passanti e ladri) ~75%, e uccelli nel cielo ~25%
        const existingBirdsCount = filtered.filter(e => e.isBird).length;
        const isBird = existingBirdsCount < 1 ? Math.random() < 0.45 : Math.random() < 0.25;

        // Bilanciamento fuggiaschi e passanti: circa 50% ladri e 50% passanti
        const isTarget = Math.random() < 0.50;

        // BILANCIAMENTO COMPARSA:
        // - Ai lati tra i palazzi (~45%): SOLO a comparsa (fermi sul posto, non scorrono)
        // - Sulla strada (~55%): scorrono attraverso la via a velocità più rapida
        const isPopup = Math.random() < 0.45;

        let customImage: string | undefined;
        let name: string;
        let icon: string;
        let points = 10;
        let isFast = false;
        let isLadro2 = false;

        if (isTarget) {
          if (isBird) {
            name = 'Uccello Fuggiasco';
            icon = '🦅';
            customImage = LOCAL_FUGGIASCHI_UCCELLI[Math.floor(Math.random() * LOCAL_FUGGIASCHI_UCCELLI.length)];
          } else {
            // SELEZIONE LADRI SU STRADA:
            // Ladro 2 compare il 20% meno spesso degli altri (peso 0.8 rispetto a 1.0)
            const weightedThieves = LOCAL_FUGGIASCHI_STRADA.map(path => ({
              path,
              weight: path.includes('ladro2') ? 0.8 : 1.0,
              isLadro2: path.includes('ladro2')
            }));
            const totalW = weightedThieves.reduce((s, t) => s + t.weight, 0);
            let rnd = Math.random() * totalW;
            let chosen = weightedThieves[0];
            for (const item of weightedThieves) {
              if (rnd < item.weight) {
                chosen = item;
                break;
              }
              rnd -= item.weight;
            }

            customImage = chosen.path;
            isLadro2 = chosen.isLadro2;

            // OGNI TANTO LADRI PIÙ VELOCI DEL 60% (~18% dei casi): danno 50 punti!
            if (Math.random() < 0.18) {
              isFast = true;
              points = 50;
              name = 'Ladro Sprint Veloce';
              icon = '⚡';
            } else if (isLadro2) {
              points = 30;
              name = 'Ladro 2 Furbo';
              icon = '🥷';
            } else {
              points = 10;
              name = 'Ladro Fuggiasco';
              icon = '🥷';
            }
          }
        } else {
          if (isBird) {
            name = 'Uccellino Pacifico';
            icon = '🕊️';
            customImage = LOCAL_PASSANTI_UCCELLI[Math.floor(Math.random() * LOCAL_PASSANTI_UCCELLI.length)];
          } else {
            name = 'Passante Gentile';
            icon = '🚶‍♀️';
            customImage = LOCAL_PASSANTI_STRADA[Math.floor(Math.random() * LOCAL_PASSANTI_STRADA.length)];
          }
        }

        // CORSIE VERTICALI PREDEFINITE:
        // - Uccelli: SOLO in alto in tutta la fascia del cielo (6% - 42%)
        // - Persone e ladri: SOLO sotto nella strada e marciapiedi (64% - 78%)
        const candidateLanes = isBird
          ? [6, 11, 16, 21, 26, 31, 36, 41]
          : [64, 68, 72, 75, 78];
        const shuffledLanes = [...candidateLanes].sort(() => Math.random() - 0.5);

        let selectedY: number | null = null;
        let selectedDirection: 'left' | 'right' = Math.random() < 0.5 ? 'right' : 'left';
        let startX = 0;
        let endX = 0;
        let duration = 0;
        let popupX: number | undefined;

        if (isPopup) {
          // COMPARSA:
          // - Persone: solo sotto nella strada/marciapiedi ai lati (64% - 78%)
          // - Uccelli: in tutta la fascia in alto del cielo (6% - 41%)
          const lateralSpotsX = isBird
            ? [12, 22, 32, 45, 55, 65, 75, 85]
            : [6, 12, 17, 23, 77, 83, 88, 94];
          const possibleSpotsX = [...lateralSpotsX].sort(() => Math.random() - 0.5);

          for (const candY of shuffledLanes) {
            const laneOccupied = filtered.some(e => Math.abs(e.y - candY) < 4.0);
            if (laneOccupied) continue;

            for (const candX of possibleSpotsX) {
              if (!isPositionConflicting(candX, candY, filtered, now)) {
                selectedY = candY;
                popupX = candX;
                startX = candX;
                endX = candX;
                // Rivolti verso l'interno della scena/strada
                selectedDirection = candX <= 30 ? 'right' : 'left';
                duration = isBird ? 4.5 : (isFast ? 2.8 : 4.0);
                break;
              }
            }
            if (selectedY !== null) break;
          }
        } else {
          // ENTITÀ CHE SCORRONO (Uccelli in alto nel cielo, Persone solo sotto nella strada)
          // Si muovono completamente fuori dal bordo per evitare che si incastrino visivamente
          const directions: Array<'left' | 'right'> = selectedDirection === 'right' ? ['right', 'left'] : ['left', 'right'];

          for (const candY of shuffledLanes) {
            const laneOccupied = filtered.some(e => Math.abs(e.y - candY) < 4.0);
            if (laneOccupied) continue;

            for (const dir of directions) {
              const candStartX = dir === 'right' ? -20 : 120;
              if (!isPositionConflicting(candStartX, candY, filtered, now)) {
                selectedY = candY;
                selectedDirection = dir;
                startX = candStartX;
                endX = dir === 'right' ? 120 : -25;
                let baseDur = isBird ? (5.2 + Math.random() * 1.8) : (5.8 + Math.random() * 2.0);
                if (isFast) {
                  baseDur = baseDur / 1.6;
                }
                duration = baseDur;
                break;
              }
            }
            if (selectedY !== null) break;
          }
        }

        // Se tutti i punti disponibili sono al momento occupati, salta il ciclo: zero sovrapposizioni
        if (selectedY === null) {
          return filtered;
        }

        const newEntity: TargetEntity = {
          id: nextEntityIdRef.current++,
          type: isTarget ? 'target' : 'civilian',
          name,
          icon,
          customImage,
          isBird,
          isPopup,
          x: popupX,
          startX,
          endX,
          y: selectedY,
          duration,
          expiresAt: now + Math.round(duration * 1000),
          direction: selectedDirection,
          points,
          isFast,
          isLadro2
        };

        return [...filtered, newEntity];
      });
    }, 950); // Frequenza veloce (~0.95s) per popolare la strada di persone e ladri

    return () => clearInterval(spawnTimer);
  }, []);

  const handleRestartGame = () => {
    setScore(0);
    setCapturedCount(0);
    setProtectedCount(0);
    setDonutCount(0);
    setEscapedCount(0);
    setIsScarsaPaused(false);
    setEntities([]);
    setShowSummary(false);
    quoteMilestonesRef.current.clear();
    setNextDonutThreshold(Math.floor(Math.random() * (500 - 200 + 1)) + 200);
    pickRandomQuote();
  };

  return (
    <div
      className="fixed inset-0 z-[60] text-slate-800 flex flex-col justify-between select-none touch-manipulation overflow-hidden font-sans w-full h-[100dvh] max-h-[100dvh]"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ========================================================================= */}
      {/* SFONDO DELLA CITTÀ SPOSTATO PIÙ IN ALTO ("porta più su lo sfondo")        */}
      {/* ========================================================================= */}
      {(activeSfondo || LOCAL_SFONDO_CITTA) ? (
        <img
          src={(activeSfondo || LOCAL_SFONDO_CITTA)!}
          alt="Sfondo della città"
          style={{ objectPosition: 'center 35%' }}
          className="absolute -top-10 sm:-top-16 inset-x-0 w-full h-[calc(100%+2.5rem)] sm:h-[calc(100%+4rem)] object-cover pointer-events-none select-none z-0"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 pointer-events-none z-0" />
      )}

      {/* Sfumatura leggera per garantire leggibilità e contrasto */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/15 via-transparent to-slate-950/20 pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 1. TOP BAR UNIFORMATA AGLI ALTRI GIOCHI NEL TITOLO E NELLE REGOLE         */}
      {/* ========================================================================= */}
      <header className="relative w-full max-w-lg mx-auto px-3 pt-3 sm:pt-4 z-40 shrink-0 space-y-1.5">
        <div className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          {/* Contatore record precedente in alto a sinistra nella stessa riga del nome */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700 shadow-md text-amber-900 dark:text-amber-200 shrink-0"
            title="Miglior record precedente salvato sul Cloud"
          >
            <span className="text-xs sm:text-sm leading-none">🏆</span>
            <span className="text-[10px] sm:text-xs font-black font-['Quicksand'] whitespace-nowrap">
              Record: <strong className="text-amber-700 dark:text-amber-300 font-black">{highScore}</strong>
            </span>
          </div>

          {/* Nome del gioco e icona regole con stile identico agli altri minigiochi */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-3 sm:px-4 py-1 rounded-full border border-sky-200 shadow-md">
            <span className="text-lg sm:text-xl leading-none">🚓</span>
            <h2 className="text-[#0c4a6e] font-black text-sm sm:text-lg tracking-wide font-['Quicksand'] drop-shadow-xs whitespace-nowrap">
              Ile in azione
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-sky-800 hover:text-sky-950 active:scale-95 transition-all rounded-full hover:bg-sky-100/70 cursor-pointer"
              title="Regole del gioco"
              aria-label="Regole del gioco"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </button>
          </div>

          {/* Pulsante chiudi / esci */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
            aria-label="Esci dal gioco"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Barra di stato: Agente Ile (SENZA la scritta "in azione") + Tranquillità */}
        <div className="calm-white-card/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-white/70 shadow-sm flex items-center justify-between gap-2">
          {/* Agente Ile (Solo "Agente Ile", rimossa la scritta "in azione") */}
          <div
            onClick={() => {
              pickRandomQuote();
              soundManager.playTick();
            }}
            className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
            title="Tocca per ascoltare l'Agente Ile ✨"
          >
            <div className="relative shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
              {(activeIleImage || LOCAL_AGENTE_ILE) ? (
                <img
                  src={(activeIleImage || LOCAL_AGENTE_ILE)!}
                  alt="Agente Ile"
                  className="w-full h-full object-contain bg-transparent select-none pointer-events-none group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-2xl select-none">👮‍♀️</span>
              )}
              <span className="absolute -bottom-1 -right-1 text-[10px]">⭐</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-[#0c4a6e] font-['Quicksand'] leading-none">
                Agente Ile
              </span>
              <span className="text-[9px] text-sky-800 font-bold opacity-80 leading-none mt-0.5">
                tocca per parlare 💬
              </span>
            </div>
          </div>

          {/* Status info: Scappati (max 5) + Tranquillità */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border shadow-2xs ${
                escapedCount >= 3
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-50/95 text-slate-700 border-slate-200'
              }`}
              title="Fuggiaschi scappati (a 5 scatta la pausa)"
            >
              <span>Scappati:</span>
              <span className="font-black text-rose-700">{escapedCount}/5</span>
              <span>💨</span>
            </div>

            <div
              className="flex items-center gap-1.5 text-xs font-black text-sky-950 bg-sky-50/95 px-3 py-1 rounded-full border border-sky-200 shadow-2xs"
              title="Tranquillità donata al quartiere"
            >
              <span>{score} pt</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Fumetto parlante di Ile: TUTTE LE SCRITTE SU UNA RIGA, SCORRE SE NON CI STA */}
        <div
          onClick={() => {
            pickRandomQuote();
            soundManager.playTick();
          }}
          className="calm-white-card/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/70 shadow-2xs flex items-center gap-2 cursor-pointer active:scale-98 transition-all hover:bg-white/95 overflow-hidden"
          title="Tocca per cambiare frase di incoraggiamento ✨"
        >
          <span className="text-xs shrink-0">💬</span>
          <SingleLineMarquee
            text={ileQuote}
            className="flex-1 text-[11px] sm:text-xs text-sky-950 font-bold leading-none"
          />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. AREA DI GIOCO: Uccelli in alto nel cielo, Ladri e Passanti solo in strada */}
      {/* ========================================================================= */}
      <main className="relative flex-1 w-full overflow-hidden select-none touch-manipulation z-20">
        {/* ENTITÀ INTERATTIVE: A SCORRIMENTO LENTO OPPURE A SBALZI SUL POSTO */}
        <AnimatePresence>
          {entities.map(entity => {
            // Entità a sbalzi fermi sul posto, senza farli scorrere
            if (entity.isPopup) {
              return (
                <motion.div
                  key={entity.id}
                  initial={{
                    scale: 0.1,
                    opacity: 0
                  }}
                  animate={{
                    scale: [0.1, 1.08, 1],
                    opacity: 1,
                    y: entity.isBird ? [0, -10, 0, -10, 0] : [0, -7, 0, -7, 0]
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    transition: { duration: 0.22 }
                  }}
                  transition={{
                    scale: { duration: 0.32, ease: 'backOut' },
                    opacity: { duration: 0.22 },
                    y: {
                      repeat: Infinity,
                      duration: entity.isBird ? 2.2 : 1.1,
                      ease: 'easeInOut'
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${entity.x ?? 50}%`,
                    top: `${entity.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: entity.isBird ? 30 : 25
                  }}
                  onPointerDown={e => handleEntityClick(entity, e)}
                  className="cursor-pointer group flex flex-col items-center justify-center touch-manipulation select-none active:scale-90 transition-transform p-1"
                >
                  {/* Mini contorno bianco opaco su tutte le persone, ladri, uccelli (+5% più grandi: 56px / 65px) */}
                  {entity.customImage ? (
                    <div className="relative">
                      <img
                        src={entity.customImage}
                        alt={entity.name}
                        style={{
                          filter: 'drop-shadow(1px 0 0 rgba(255, 255, 255, 0.9)) drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 1px 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.8))'
                        }}
                        className={`w-[56px] sm:w-[65px] h-[56px] sm:h-[65px] object-contain bg-transparent select-none pointer-events-none group-hover:scale-105 transition-transform duration-150 ${
                          entity.direction === 'left' ? '-scale-x-100' : ''
                        }`}
                      />
                    </div>
                  ) : (
                    <span className="text-[26px] sm:text-[32px] drop-shadow-[0_0_2px_rgba(255,255,255,0.95)] group-hover:scale-115 transition-transform">
                      {entity.icon}
                    </span>
                  )}
                </motion.div>
              );
            }

            // Entità che scorrono lungo la strada
            return (
              <motion.div
                key={entity.id}
                initial={{
                  left: `${entity.startX}%`,
                  opacity: 0,
                  scale: 1
                }}
                animate={{
                  left: `${entity.endX}%`,
                  opacity: 1,
                  scale: 1,
                  y: entity.isBird ? [0, -8, 0, -8, 0] : [0, -3, 0, -3, 0]
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  left: `${entity.endX}%`,
                  transition: { duration: 0.22 }
                }}
                transition={{
                  left: {
                    duration: entity.duration,
                    ease: 'linear'
                  },
                  opacity: { duration: 0.3 },
                  y: {
                    repeat: Infinity,
                    duration: entity.isBird ? 1.6 : 0.55,
                    ease: 'easeInOut'
                  }
                }}
                style={{
                  position: 'absolute',
                  top: `${entity.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: entity.isBird ? 30 : 25
                }}
                onPointerDown={e => handleEntityClick(entity, e)}
                className="cursor-pointer group flex flex-col items-center justify-center touch-manipulation select-none active:scale-90 transition-transform p-1"
              >
                {/* Mini contorno bianco opaco su tutte le persone, ladri, uccelli (+5% più grandi: 56px / 65px) */}
                {entity.customImage ? (
                  <div className="relative">
                    <img
                      src={entity.customImage}
                      alt={entity.name}
                      style={{
                        filter: 'drop-shadow(1px 0 0 rgba(255, 255, 255, 0.9)) drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 1px 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 -1px 0 rgba(255, 255, 255, 0.9)) drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.8))'
                      }}
                      className={`w-[56px] sm:w-[65px] h-[56px] sm:h-[65px] object-contain bg-transparent select-none pointer-events-none group-hover:scale-105 transition-transform duration-150 ${
                        entity.direction === 'left' ? '-scale-x-100' : ''
                      }`}
                    />
                  </div>
                ) : (
                  <span className="text-[26px] sm:text-[32px] drop-shadow-[0_0_2px_rgba(255,255,255,0.95)] group-hover:scale-115 transition-transform">
                    {entity.icon}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* EFFETTI FLUTTUANTI (+10 Calma, Stelline) */}
        <AnimatePresence>
          {floatingEffects.map(effect => (
            <motion.div
              key={effect.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -45, scale: 1.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${effect.x}%`,
                top: `${effect.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`font-black text-xs sm:text-sm drop-shadow-md pointer-events-none z-40 bg-white/95 px-3 py-1 rounded-full border border-amber-300 ${effect.color}`}
            >
              {effect.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* --------------------------------------------------------------------- */}
        {/* CARTELLO "ALT! STRADA BLOCCATA" (SENZA SFOCATURA SULLO SFONDO!)       */}
        {/* --------------------------------------------------------------------- */}
        <AnimatePresence>
          {isTrafficBlocked && (
            <motion.div
              key="alt-traffic-pause"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center p-4 pointer-events-auto"
            >
              <div className="calm-white-card p-5 rounded-3xl border-3 border-amber-400 shadow-2xl flex flex-col items-center gap-2.5 text-center max-w-xs w-full animate-bounce">
                <span className="text-4xl">🚦</span>
                <SingleLineMarquee
                  text="ALT! 🚦 Strada bloccata"
                  className="font-black text-amber-950 text-base font-['Quicksand'] tracking-wide w-full"
                />
                <SingleLineMarquee
                  text="Passante protetta! Fai un bel respiro con me, zii... Nessun errore! 🌸"
                  className="text-xs text-amber-900 font-bold w-full"
                />
                <div className="w-16 h-1 bg-amber-200 rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --------------------------------------------------------------------- */}
        {/* FUMETTO PERSONALIZZATO TRAGUARDI: LASCIA MENO TEMPO A SCHERMO (2.5s) */}
        {/* --------------------------------------------------------------------- */}
        <AnimatePresence>
          {activeMilestoneMessage && (
            <motion.div
              key="milestone-custom-message"
              initial={{ opacity: 0, y: -25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className="absolute top-4 inset-x-3 z-45 flex justify-center pointer-events-auto"
            >
              <div className="calm-white-card border-2 border-pink-400 bg-white/95 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm w-full">
                <div className="relative shrink-0 w-8 h-8 flex items-center justify-center">
                  {(activeIleImage || LOCAL_AGENTE_ILE) ? (
                    <img
                      src={(activeIleImage || LOCAL_AGENTE_ILE)!}
                      alt="Agente Ile"
                      className="w-full h-full object-contain bg-transparent select-none pointer-events-none"
                    />
                  ) : (
                    <span className="text-xl">👮‍♀️</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-pink-700 uppercase tracking-wider block">
                    Agente Ile ti dice:
                  </span>
                  <SingleLineMarquee
                    text={activeMilestoneMessage}
                    className="text-xs font-black text-pink-950 mt-0.5"
                  />
                </div>

                <button
                  onClick={() => setActiveMilestoneMessage(null)}
                  className="p-1 rounded-full text-pink-500 hover:bg-pink-100 cursor-pointer shrink-0"
                  title="Chiudi messaggio"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER: SCRITTE E NUMERI SEMPRE SU UNA RIGA ANCHE SE SI SUPERA IL 9   */}
      {/* ========================================================================= */}
      <footer className="relative w-full max-w-lg mx-auto px-2.5 sm:px-3 py-2.5 sm:py-3 pb-3.5 sm:pb-4 z-40 shrink-0 flex items-center justify-between gap-2 flex-nowrap overflow-x-hidden">
        {/* Contatori Fuggiaschi e Passanti: rigorosamente su una sola riga anche con numeri a 2 o 3 cifre */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black text-sky-950 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-sky-200 shadow-sm whitespace-nowrap shrink-0 flex-nowrap">
          <span className="whitespace-nowrap inline-flex items-center">
            Fuggiaschi: {capturedCount}
          </span>
          <span className="text-sky-300 font-bold select-none">•</span>
          <span className="whitespace-nowrap inline-flex items-center">
            Passanti: {protectedCount}
          </span>
        </div>

        {/* Tasto Fine Servizio sempre accessibile e rigorosamente su una riga */}
        <button
          onClick={() => setShowSummary(true)}
          className="flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-full shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex-nowrap"
        >
          <span>🏁</span>
          <span className="whitespace-nowrap">Chiudi Turno</span>
        </button>
      </footer>

      {/* ========================================================================= */}
      {/* 4. MODAL "PAUSA CIAMBELLA" (DECOMPRESSIONE GUIDATA)                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDonutPause && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="calm-white-card border-3 border-amber-300 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-2 text-4xl">
                <span>🍩</span>
                <span>☕</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-amber-950 font-['Quicksand']">
                  Pausa Ciambella dell'Agente Ile
                </h3>
                <SingleLineMarquee
                  text="Pausa caffè dell'Agente: 1 respiro lento e profondo per ricaricare le energie, zii 🍩"
                  className="text-xs text-amber-900 font-bold mt-1 w-full"
                />
              </div>

              {/* Momento di decompressione calmo (senza animazione della bolla) */}
              <div className="py-2.5 flex flex-col items-center justify-center">
                <span className="text-3xl">☕ 🍩</span>
                <span className="text-xs font-black text-amber-800 mt-2">
                  Inspira con calma... ed espira lentamente...
                </span>
              </div>

              <button
                onClick={() => setShowDonutPause(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black py-3 rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                Pronta a ripartire, zii! ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4.b MODAL "PAUSA SCARSA" (QUANDO I FUGGIASCHI SCAPPATI ARRIVANO A 10)     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isScarsaPaused && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="calm-white-card border-3 border-rose-300 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-2 text-4xl">
                <span>💨</span>
                <span>👮‍♀️</span>
                <span>😂</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-rose-950 font-['Quicksand']">
                  Pausa dell'Agente Ile
                </h3>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mt-2 text-rose-950 font-bold text-xs leading-relaxed shadow-xs">
                  «Oh no zii, ti sono scappati 5 fuggiaschi! Sei scarsa zii! 😂💕 Fai un bel respiro profondo con me, sgranchisciti le dita e rimettiti in gioco insieme alla tua socia preferita!»
                </div>
              </div>

              <div className="text-[11px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full inline-block border border-slate-200">
                Fuggiaschi scappati: <span className="text-rose-600 font-extrabold">5/5</span> 💨
              </div>

              <button
                onClick={() => {
                  setEscapedCount(0);
                  setEntities([]);
                  setIsScarsaPaused(false);
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-black py-3 rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                Riprova con Ile ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. MODAL RIEPILOGO RASSICURANTE ("FINE SERVIZIO")                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="calm-white-card border-2 border-sky-300 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg">
                🌟
              </div>

              <div>
                <h3 className="text-xl font-black text-sky-950 font-['Quicksand']">
                  Ottimo lavoro Agente Ile!
                </h3>
                <SingleLineMarquee
                  text="Città messa in sicurezza, missione compiuta, sei stata fantastica zii!"
                  className="text-xs text-sky-800 font-bold mt-1 w-full"
                />
              </div>

              <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-100 space-y-2 text-xs font-bold text-sky-900 text-left">
                <div className="flex justify-between items-center">
                  <span>Tranquillità donata:</span>
                  <span className="font-black text-teal-700">{score} pt ✨</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fuggiaschi calmati:</span>
                  <span className="font-black text-sky-700">{capturedCount} 🦝</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Passanti protetti:</span>
                  <span className="font-black text-emerald-700">{protectedCount} 🛡️</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pause ciambella godute:</span>
                  <span className="font-black text-amber-700">{donutCount} 🍩</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sky-200/60">
                  <span className="flex items-center gap-1">🏆 Record precedente (Cloud):</span>
                  <span className="font-black text-amber-800">{highScore} pt</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleRestartGame}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nuovo Turno di Ronda</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl active:scale-95 transition-all text-xs cursor-pointer"
                >
                  Torna ai Minigiochi Rilassanti 🏡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. MODAL REGOLE (UNIFORMATO AGLI ALTRI MINIGIOCHI)                      */}
      {/* ========================================================================= */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="calm-white-card border-2 border-sky-200 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-base text-sky-950 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                Regole del gioco
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Unisciti all'<strong>Agente Ile</strong> per portare pace e serenità tra le strade della città, zii! Un'azione rilassante creata apposta per staccare la mente.
              </p>

              <div>
                <p className="font-bold text-sky-900 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-2 text-slate-600 text-xs sm:text-sm">
                  <li>
                    <strong>1. I Fuggiaschi:</strong> scorrono o compaiono a sbalzi sullo schermo (in strada o in cielo). Toccali per calmarli (+10 punti e stelline ✨).
                  </li>
                  <li>
                    <strong>2. I Passanti:</strong> passeggiano per strada e volano in cielo. Se li tocchi per errore, <strong>non perdi vite né punti</strong>.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
