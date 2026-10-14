/**
 * MINIGAMES CUSTOM ASSETS REGISTRY
 * 
 * Rileva automaticamente le immagini per:
 * 1. Mimmi (Il Giardino di Mimmi): cartella mimmi/ o con nome mimmi
 * 2. Papà (La Bottega di Papà): cartella papa/ o con nome papa, babbo, bottega
 * 3. Ninni al traguardo: cartella ninni/ o con nome ninni_traguardo, ninni, cuccia
 */

// Scansione di tutte le immagini dentro src/assets/ (inclusi minigames, custom_mascots, images)
const minigameImages = import.meta.glob<{ default: string }>([
  '../**/*.{jpeg,jpg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP,GIF}',
  './**/*.{jpeg,jpg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP,GIF}'
], {
  eager: true,
});

function findMinigameImage(keywords: string[]): string | null {
  const matches: string[] = [];

  for (const path in minigameImages) {
    const clean = path.toLowerCase();
    // Salta i file non immagine o interni
    if (clean.endsWith('.gitkeep') || clean.endsWith('.md') || clean.endsWith('.ts')) continue;
    
    for (const kw of keywords) {
      const lowerKw = kw.toLowerCase();
      if (clean.includes(lowerKw)) {
        matches.push(path);
        break;
      }
    }
  }

  if (matches.length === 0) return null;

  // Ordina: prima per indice di keyword (priorità a cosa l'utente ha specificato prima),
  // poi per trasparenza/estensione
  matches.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    const kwIndex = (str: string) => {
      for (let i = 0; i < keywords.length; i++) {
        if (str.includes(keywords[i].toLowerCase())) return i;
      }
      return 999;
    };
    const kwDiff = kwIndex(aLower) - kwIndex(bLower);
    if (kwDiff !== 0) return kwDiff;

    const score = (str: string) => {
      if (str.endsWith('.png')) return 10;
      if (str.endsWith('.webp')) return 8;
      if (str.includes('.png.jpg') || str.includes('.png.jpeg')) return 5;
      if (str.endsWith('.jpg') || str.endsWith('.jpeg')) return 2;
      return 1;
    };
    return score(bLower) - score(aLower);
  });

  return minigameImages[matches[0]]?.default || null;
}

function findMinigameImages(keywords: string[]): string[] {
  const matches: string[] = [];
  for (const path in minigameImages) {
    const clean = path.toLowerCase();
    if (clean.endsWith('.gitkeep') || clean.endsWith('.md') || clean.endsWith('.ts')) continue;
    for (const kw of keywords) {
      if (clean.includes(kw.toLowerCase())) {
        const img = minigameImages[path]?.default;
        if (img && !matches.includes(img)) {
          matches.push(img);
        }
        break;
      }
    }
  }
  return matches;
}

export const MIMMI_CUSTOM_IMAGE: string | null = findMinigameImage(['/mimmi/', 'mimmi', 'mimi']);
export const PAPA_CUSTOM_IMAGE: string | null = findMinigameImage(['/papa/', 'papà', 'papa', 'babbo', 'bottega', 'falegname']);
export const MARI_CUSTOM_IMAGE: string | null = findMinigameImage(['/mari/', 'mari', 'maria']);
export const NINNI_TRAGUARDO_IMAGE: string | null = findMinigameImage([
  '/ninni/',
  'ninni_traguardo',
  'ninni_finish',
  'ninni_win',
  'ninni_cuccia',
  'ninni-traguardo',
  'traguardo',
  'cuccia',
  'ninni'
]);

// Rileva tutte le immagini di sfondo per Bacini a Volontà (nella cartella bacini/ o con nome sfondo)
export const BACINI_SFONDO_IMAGES: string[] = (() => {
  const matches: string[] = [];
  for (const path in minigameImages) {
    const clean = path.toLowerCase();
    if (clean.endsWith('.gitkeep') || clean.endsWith('.md') || clean.endsWith('.ts')) continue;
    if (clean.includes('/bacini/') && (clean.includes('sfondo') || clean.includes('background') || clean.includes('bg'))) {
      const img = minigameImages[path]?.default;
      if (img && !matches.includes(img)) {
        matches.push(img);
      }
    }
  }
  if (matches.length === 0) {
    const fallback = findMinigameImages(['/bacini/sfondo', 'bacini/sfondo']);
    matches.push(...fallback);
  }
  return matches;
})();

export const BACINI_CENTRO_IMAGES: string[] = (() => {
  const matches: string[] = [];
  for (const path in minigameImages) {
    const clean = path.toLowerCase();
    if (clean.endsWith('.gitkeep') || clean.endsWith('.md') || clean.endsWith('.ts')) continue;
    if (clean.includes('/bacini/') && (clean.includes('centro') || clean.includes('center') || clean.includes('personaggio') || clean.includes('chibi') || clean.includes('protagonista'))) {
      const img = minigameImages[path]?.default;
      if (img && !matches.includes(img)) {
        matches.push(img);
      }
    }
  }
  // Se non trova corrispondenze con parole chiave, usa qualsiasi immagine in /bacini/ che non sia sfondo o fine
  if (matches.length === 0) {
    for (const path in minigameImages) {
      const clean = path.toLowerCase();
      if (clean.endsWith('.gitkeep') || clean.endsWith('.md') || clean.endsWith('.ts')) continue;
      if (clean.includes('/bacini/') && !clean.includes('sfondo') && !clean.includes('fine') && !clean.includes('bg') && !clean.includes('back')) {
        const img = minigameImages[path]?.default;
        if (img && !matches.includes(img)) {
          matches.push(img);
        }
      }
    }
  }
  if (matches.length === 0) {
    const fallback = findMinigameImages(['/bacini/centro', 'centro']);
    matches.push(...fallback);
  }
  return matches;
})();

export const BACINI_FINE_IMAGES: string[] = findMinigameImages([
  '/bacini/fine',
  'fine'
]);

export const BACINI_SFONDO_IMAGE: string | null = BACINI_SFONDO_IMAGES[0] || null;
export const BACINI_CENTRO_IMAGE: string | null = BACINI_CENTRO_IMAGES[0] || null;
export const BACINI_FINE_IMAGE: string | null = BACINI_FINE_IMAGES[0] || null;
export const BACINI_CUSTOM_IMAGE: string | null = BACINI_CENTRO_IMAGE;


export const DIARIO_PAGINA8_IMAGES: string[] = findMinigameImages([
  '/diario_pagina8/',
  'diario_pagina8',
  'pagina8',
  'pagina_8'
]);

export const DIARIO_PAGINA8_IMAGE: string | null = DIARIO_PAGINA8_IMAGES[0] || findMinigameImage([
  '/diario_pagina8/',
  'diario_pagina8',
  'pagina8',
  'pagina_8'
]);

export const ILE_CUSTOM_IMAGES: string[] = findMinigameImages([
  '/ile/agente/',
  '/ile/',
  'agente_ile',
  'agente',
  'ile'
]);

export const ILE_CUSTOM_IMAGE: string | null = ILE_CUSTOM_IMAGES[0] || findMinigameImage([
  '/ile/agente/',
  '/ile/',
  'agente_ile',
  'agente',
  'ile'
]);

export const ILE_FUGGIASCHI_IMAGES: string[] = findMinigameImages([
  '/ile/fuggiaschi/',
  'fuggiaschi',
  'fuggiasco',
  'ladro',
  'furbetto'
]);

export const ILE_PASSANTI_IMAGES: string[] = findMinigameImages([
  '/ile/passanti/',
  'passanti',
  'passante',
  'civile',
  'civili'
]);

export const ILE_SFONDO_IMAGE: string | null = findMinigameImage([
  '/ile/sfondo/',
  'sfondo_ile',
  'sfondo-ile',
  'citta_ile',
  'citta-ile',
  'scenario_ile'
]);

// ----------------------------------------------------
// MAGI, COSA FAI?! - CUSTOM ASSETS
// ----------------------------------------------------
import userMagiSfondoJpg from './magi/sfondo/sfondo.jpg';
import userMagiSfondoPng from './magi/sfondo/sfondo.png';
import userMagiPiangeJpg from './magi/piange/piange.jpg';
import userMagiPiangePng from './magi/piange/piange.png';
export const MAGI_SFONDO_IMAGES: string[] = [
  userMagiSfondoJpg,
  userMagiSfondoPng,
  ...findMinigameImages(['/magi/sfondo/', 'magi_sfondo', 'sfondo_magi', 'magi_vasca', 'vasca_magi', 'sfondo'])
].filter(Boolean);

export const MAGI_SFONDO_IMAGE: string = userMagiSfondoJpg || userMagiSfondoPng;

import userTatuaggio100 from './magi/tatuaggi/tatuaggio (100).png';
export const TATUAGGIO_100_IMAGE: string = userTatuaggio100;

export const MAGI_TATUAGGI_IMAGES: string[] = [
  userTatuaggio100,
  ...findMinigameImages([
    '/magi/tatuaggi/',
    'tatuaggio',
    'tatuaggi',
    'tattoo'
  ])
].filter((v, i, a) => v && a.indexOf(v) === i);

export const MAGI_PIANGE_IMAGES: string[] = [
  userMagiPiangeJpg,
  userMagiPiangePng,
  ...findMinigameImages(['/magi/piange/', 'magi_piange', 'piange', 'crying', 'lacrime'])
].filter(Boolean);

export const MAGI_PIANGE_IMAGE: string = userMagiPiangeJpg || userMagiPiangePng;

// ----------------------------------------------------
// ORA, ORA ! - CUSTOM ASSETS (cartella src/assets/minigames/oraora/)
// ----------------------------------------------------
import oraFinaleDefault from './oraora/finale.png';
import oraFinale1 from './oraora/finale (1).jpg';
import oraFinale2 from './oraora/finale (2).jpg';
import oraFinale3 from './oraora/finale (3).jpg';
import oraFinaleJpg from './oraora/Finale.jpg';
import oraSfondo1 from './oraora/sfondo 1 (1).jpg';
import oraSfondo2 from './oraora/sfondo 1 (2).jpg';
import oraSfondo3 from './oraora/sfondo 1 (3).jpg';
import oraSfondo4 from './oraora/sfondo 1 (4).jpg';
import oraSfondoJpgPng from './oraora/sfondo.png.jpg (1).png';
export const ORA_ORA_SPECIAL_BG_1: string = oraSfondoJpgPng;
import oraModelsIdle1 from './oraora/models_idle-1.png';
import oraModelsKissingDefault from './oraora/models_kissing.png';
import oraFriendsIdleDefault from './oraora/amiche_idle.png';
import oraFriendsSignalDefault from './oraora/amiche_segnale.png';
import oraBossHiddenDefault from './oraora/boss_hidden.png';
import oraBossWarningDefault from './oraora/boss_warning.png';
import oraBossWatchingDefault from './oraora/boss_watching.png';
import oraBossCaughtDefault from './oraora/boss_caught.png';
import oraPetegola1WatchingDefault from './oraora/petegola1_watching.png';
import oraPetegola1CaughtDefault from './oraora/petegola1_caught.png';
import oraPetegola2WatchingDefault from './oraora/petegola2_watching.png';
import oraPetegola2CaughtDefault from './oraora/petegola2_caught.png';

export const ORA_ORA_BACKGROUND_IMAGES: string[] = [
  oraSfondo1,
  oraSfondo2,
  oraSfondo3,
  oraSfondo4,
  oraSfondoJpgPng,
  ...findMinigameImages(['/oraora/sfondo', '/oraora/background', 'oraora/sfondo 1'])
].filter((url, idx, arr) => !!url && arr.indexOf(url) === idx);

export const ORA_ORA_FINALE_IMAGES: string[] = [
  oraFinaleDefault,
  oraFinaleJpg,
  oraFinale1,
  oraFinale2,
  oraFinale3,
  ...findMinigameImages(['/oraora/finale', 'oraora/finale'])
].filter((url, idx, arr) => !!url && arr.indexOf(url) === idx);

export const ORA_ORA_BACKGROUND_IMAGE: string =
  findMinigameImage(['/oraora/background', '/oraora/sfondo', 'sfondo 1', 'sfondo', 'background']) ||
  ORA_ORA_BACKGROUND_IMAGES[0] ||
  '/assets/background.png';

export const ORA_ORA_FINALE_IMAGE: string =
  findMinigameImage(['/oraora/finale', 'finale']) ||
  ORA_ORA_FINALE_IMAGES[0] ||
  oraFinaleDefault ||
  '';

export const ORA_ORA_MODELS_IDLE_IMAGE: string =
  findMinigameImage(['/oraora/models_idle-1', '/oraora/models_idle', 'models_idle-1', 'models_idle', '/oraora/modelle_idle', '/oraora/modelle_riposo', '/oraora/modelle_separate', '/oraora/modelle', '/oraora/idle']) ||
  oraModelsIdle1 ||
  '/assets/models_idle.png';

export const ORA_ORA_MODELS_KISSING_IMAGE: string =
  findMinigameImage(['/oraora/models_kissing', '/oraora/modelle_kissing', '/oraora/modelle_bacio', '/oraora/bacio', '/oraora/kiss', '/oraora/kissing']) || oraModelsKissingDefault || '/assets/models_kissing.png';

export const ORA_ORA_FRIENDS_IDLE_IMAGE: string =
  oraFriendsIdleDefault || findMinigameImage(['/oraora/amiche_idle', '/oraora/friends_idle', '/oraora/amiche_riposo', '/oraora/amica_idle', '/oraora/amiche']) || '/assets/amiche_idle.png';

export const ORA_ORA_FRIENDS_SIGNAL_IMAGE: string =
  oraFriendsSignalDefault || findMinigameImage(['/oraora/amiche_segnale', '/oraora/friends_signal', '/oraora/amiche_signal', '/oraora/amiche_ok', '/oraora/signal', '/oraora/amica_signal', '/oraora/segnale']) || '/assets/amiche_segnale.png';

export const ORA_ORA_BOSS_HIDDEN_IMAGE: string =
  findMinigameImage(['/oraora/boss_hidden', '/oraora/capo_hidden', '/oraora/nascosto']) || oraBossHiddenDefault || '/assets/boss_hidden.png';

export const ORA_ORA_BOSS_WARNING_IMAGE: string =
  oraBossWarningDefault || findMinigameImage(['/oraora/boss_warning', '/oraora/capo_warning', '/oraora/avviso', '/oraora/ombra', '/oraora/warning', '/oraora/allerta']) || '/assets/boss_warning.png';

export const ORA_ORA_BOSS_WATCHING_IMAGE: string =
  findMinigameImage(['/oraora/boss_watching', '/oraora/capo_watching', '/oraora/controllo', '/oraora/spia', '/oraora/capo_guarda', '/oraora/watching']) || oraBossWatchingDefault || '/assets/boss_watching.png';

export const ORA_ORA_BOSS_CAUGHT_IMAGE: string =
  findMinigameImage(['/oraora/boss_caught', '/oraora/capo_caught', '/oraora/sgamati', '/oraora/beccate', '/oraora/arrabbiato', '/oraora/caught']) || oraBossCaughtDefault || '/assets/boss_caught.png';

export const ORA_ORA_PETEGOLA1_WATCHING_IMAGE: string =
  oraPetegola1WatchingDefault || findMinigameImage(['/oraora/petegola1_watching', 'petegola1_watching', 'petegola1']) || '/assets/petegola1_watching.png';

export const ORA_ORA_PETEGOLA1_CAUGHT_IMAGE: string =
  oraPetegola1CaughtDefault || findMinigameImage(['/oraora/petegola1_caught', 'petegola1_caught']) || '/assets/petegola1_caught.png';

export const ORA_ORA_PETEGOLA2_WATCHING_IMAGE: string =
  oraPetegola2WatchingDefault || findMinigameImage(['/oraora/petegola2_wathcing', '/oraora/petegola2_watching', 'petegola2_wathcing', 'petegola2_watching', 'petegola2']) || '/assets/petegola2_watching.png';

export const ORA_ORA_PETEGOLA2_CAUGHT_IMAGE: string =
  oraPetegola2CaughtDefault || findMinigameImage(['/oraora/petegola2_caught', 'petegola2_caught']) || '/assets/petegola2_caught.png';

export const ORA_ORA_CUSTOM_ASSETS: Record<string, string> = {
  background: ORA_ORA_BACKGROUND_IMAGE,
  finale: ORA_ORA_FINALE_IMAGE,
  models_idle: ORA_ORA_MODELS_IDLE_IMAGE,
  models_kissing: ORA_ORA_MODELS_KISSING_IMAGE,
  friends_idle: ORA_ORA_FRIENDS_IDLE_IMAGE,
  friends_signal: ORA_ORA_FRIENDS_SIGNAL_IMAGE,
  boss_hidden: ORA_ORA_BOSS_HIDDEN_IMAGE,
  boss_warning: ORA_ORA_BOSS_WARNING_IMAGE,
  boss_watching: ORA_ORA_BOSS_WATCHING_IMAGE,
  boss_caught: ORA_ORA_BOSS_CAUGHT_IMAGE,
  petegola1_watching: ORA_ORA_PETEGOLA1_WATCHING_IMAGE,
  petegola1_caught: ORA_ORA_PETEGOLA1_CAUGHT_IMAGE,
  petegola2_watching: ORA_ORA_PETEGOLA2_WATCHING_IMAGE,
  petegola2_caught: ORA_ORA_PETEGOLA2_CAUGHT_IMAGE,
};

