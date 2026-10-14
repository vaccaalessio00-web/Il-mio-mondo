import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Lightbulb, Compass, RotateCcw, Sparkles, Check, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';
import { NINNI_TRAGUARDO_IMAGE } from '../../assets/minigames';

interface Point {
  x: number;
  y: number;
}

export type FoodType = 'osso' | 'pesce' | 'coscetta' | 'formaggio' | 'salsiccia' | 'carota' | 'biscotto';

interface Biscuit {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  pulseOffset: number;
  foodType: FoodType;
}

export type LandscapeType = 
  | 'prato' 
  | 'mare' 
  | 'citta' 
  | 'vulcano' 
  | 'notte' 
  | 'neve' 
  | 'autunno' 
  | 'zen' 
  | 'deserto' 
  | 'dolcetti';

export interface LandscapeConfig {
  id: LandscapeType;
  name: string;
  icon: string;
  subtitle: string;
  themeColor: string;
}

export const LANDSCAPES: LandscapeConfig[] = [
  { id: 'prato', name: 'Prato Fiorito', icon: '🌸', subtitle: 'Campagna, margherite & farfalle pastel', themeColor: '#9fc4a5' },
  { id: 'mare', name: 'Bordo Mare', icon: '🌊', subtitle: 'Spiaggia dorata & onde turchesi animate', themeColor: '#38bdf8' },
  { id: 'citta', name: 'Passeggiata in Città', icon: '🏙️', subtitle: 'Viale lastricato, lampioni caldi & aiuole', themeColor: '#64748b' },
  { id: 'vulcano', name: 'Vulcano Calmo', icon: '🌋', subtitle: 'Basalto scuro, rivoli di magma dorato & braci', themeColor: '#ea580c' },
  { id: 'notte', name: 'Notte Magica', icon: '🌌', subtitle: 'Cielo stellato & lucciole danzanti', themeColor: '#4338ca' },
  { id: 'neve', name: 'Sentiero Innevato', icon: '❄️', subtitle: 'Neve candida, abeti & fiocchi che cadono', themeColor: '#0284c7' },
  { id: 'autunno', name: 'Bosco d\'Autunno', icon: '🍂', subtitle: 'Foglie d\'acero dorate & funghetti del bosco', themeColor: '#d97706' },
  { id: 'zen', name: 'Giardino Zen Bambù', icon: '🎋', subtitle: 'Ghiaia pettinata, bambù & ninfee di loto', themeColor: '#059669' },
  { id: 'deserto', name: 'Oasi nel Deserto', icon: '🏜️', subtitle: 'Dune sinuose di sabbia calda & oasi limpida', themeColor: '#f59e0b' },
  { id: 'dolcetti', name: 'Nuvole di Zucchero', icon: '🍭', subtitle: 'Mondo fiabesco marshmallow & cristalli dolci', themeColor: '#ec4899' },
];

interface SceneryItem {
  x: number;
  y: number;
  color: string;
  size: number;
  type: string;
  petalCount?: number;
}

export interface PathPreset {
  id: number;
  name: string;
  icon: string;
  category: string;
  waypoints: Point[]; // Normalized coordinates 0.0 - 1.0
}

export const PATH_CATEGORIES = [
  'Tutti',
  '🌸 Prati & Fiori',
  '🌊 Onde & Sinuosi',
  '🌀 Spirali & Anelli',
  '⛰️ Colli & Valli',
  '🌈 Ponti & Archi',
  '✨ Fiabe & Stelle'
] as const;

// 50 Curated Calming Paths designed for smooth, gentle flow without sharp crests
export const PATH_PRESETS: PathPreset[] = [
  // 1. Sentiero a S Classico (Bottom-Left to Top-Right)
  {
    id: 1,
    name: 'Sentiero a S Classico',
    icon: '🌸',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.15, y: 0.85 },
      { x: 0.35, y: 0.70 },
      { x: 0.42, y: 0.50 },
      { x: 0.65, y: 0.35 },
      { x: 0.85, y: 0.15 }
    ]
  },
  // 2. Sentiero a S Inverso (Bottom-Right to Top-Left)
  {
    id: 2,
    name: 'Sentiero a S Inverso',
    icon: '🌾',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.85, y: 0.85 },
      { x: 0.65, y: 0.70 },
      { x: 0.58, y: 0.50 },
      { x: 0.35, y: 0.35 },
      { x: 0.15, y: 0.15 }
    ]
  },
  // 3. Arco della Radura (Bottom-Right arc to Top-Center)
  {
    id: 3,
    name: 'Arco della Radura',
    icon: '🌿',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.80, y: 0.85 },
      { x: 0.45, y: 0.75 },
      { x: 0.20, y: 0.50 },
      { x: 0.35, y: 0.25 },
      { x: 0.70, y: 0.15 }
    ]
  },
  // 4. Arco di Salvia (Bottom-Left arc to Top-Right)
  {
    id: 4,
    name: 'Arco di Salvia',
    icon: '🍃',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.20, y: 0.85 },
      { x: 0.55, y: 0.75 },
      { x: 0.80, y: 0.50 },
      { x: 0.65, y: 0.25 },
      { x: 0.30, y: 0.15 }
    ]
  },
  // 5. Doppia Ansa del Fiume (Gentle meandering river)
  {
    id: 5,
    name: 'Doppia Ansa del Fiume',
    icon: '🌊',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.25, y: 0.85 },
      { x: 0.75, y: 0.68 },
      { x: 0.30, y: 0.50 },
      { x: 0.75, y: 0.32 },
      { x: 0.25, y: 0.15 }
    ]
  },
  // 6. Il Fiume di Smeraldo (Reverse meandering river)
  {
    id: 6,
    name: 'Il Fiume di Smeraldo',
    icon: '💎',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.75, y: 0.85 },
      { x: 0.25, y: 0.68 },
      { x: 0.70, y: 0.50 },
      { x: 0.25, y: 0.32 },
      { x: 0.75, y: 0.15 }
    ]
  },
  // 7. Il Colle Ventoso (Diagonal wave)
  {
    id: 7,
    name: 'Il Colle Ventoso',
    icon: '💨',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.20, y: 0.80 },
      { x: 0.60, y: 0.70 },
      { x: 0.35, y: 0.45 },
      { x: 0.80, y: 0.20 }
    ]
  },
  // 8. La Valle Incantata (Reverse diagonal wave)
  {
    id: 8,
    name: 'La Valle Incantata',
    icon: '✨',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.80, y: 0.80 },
      { x: 0.40, y: 0.70 },
      { x: 0.65, y: 0.45 },
      { x: 0.20, y: 0.20 }
    ]
  },
  // 9. La Mezzaluna Dolce (C-curve from left to right)
  {
    id: 9,
    name: 'La Mezzaluna Dolce',
    icon: '🌙',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.40, y: 0.85 },
      { x: 0.15, y: 0.65 },
      { x: 0.20, y: 0.35 },
      { x: 0.60, y: 0.18 },
      { x: 0.85, y: 0.30 }
    ]
  },
  // 10. La Mezzaluna d'Argento (C-curve from right to left)
  {
    id: 10,
    name: "La Mezzaluna d'Argento",
    icon: '⭐',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.60, y: 0.85 },
      { x: 0.85, y: 0.65 },
      { x: 0.80, y: 0.35 },
      { x: 0.40, y: 0.18 },
      { x: 0.15, y: 0.30 }
    ]
  },
  // 11. Il Ponte dei Papaveri (Gentle central crest)
  {
    id: 11,
    name: 'Il Ponte dei Papaveri',
    icon: '🌺',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.15, y: 0.60 },
      { x: 0.35, y: 0.80 },
      { x: 0.50, y: 0.50 },
      { x: 0.65, y: 0.20 },
      { x: 0.85, y: 0.40 }
    ]
  },
  // 12. Il Sentiero delle Margherite (Zig-zag soft curve)
  {
    id: 12,
    name: 'Il Sentiero delle Margherite',
    icon: '🌼',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.25, y: 0.85 },
      { x: 0.40, y: 0.65 },
      { x: 0.75, y: 0.50 },
      { x: 0.40, y: 0.35 },
      { x: 0.60, y: 0.15 }
    ]
  },
  // 13. Il Sentiero delle Lucciole (Gentle wave upwards)
  {
    id: 13,
    name: 'Il Sentiero delle Lucciole',
    icon: '🏮',
    category: '✨ Fiabe & Stelle',
    waypoints: [
      { x: 0.50, y: 0.85 },
      { x: 0.20, y: 0.65 },
      { x: 0.55, y: 0.45 },
      { x: 0.80, y: 0.25 }
    ]
  },
  // 14. La Passeggiata nel Prato (Vertical meander)
  {
    id: 14,
    name: 'La Passeggiata nel Prato',
    icon: '🍀',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.50, y: 0.85 },
      { x: 0.80, y: 0.65 },
      { x: 0.45, y: 0.45 },
      { x: 0.20, y: 0.25 }
    ]
  },
  // 15. L'Onda Serena (Wide calm wave)
  {
    id: 15,
    name: "L'Onda Serena",
    icon: '🌊',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.18, y: 0.75 },
      { x: 0.45, y: 0.40 },
      { x: 0.65, y: 0.65 },
      { x: 0.82, y: 0.25 }
    ]
  },
  // 16. L'Onda del Pomeriggio (Reverse calm wave)
  {
    id: 16,
    name: "L'Onda del Pomeriggio",
    icon: '🌅',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.82, y: 0.75 },
      { x: 0.55, y: 0.40 },
      { x: 0.35, y: 0.65 },
      { x: 0.18, y: 0.25 }
    ]
  },
  // 17. Il Giro dei Trifogli (Wide oval loop path)
  {
    id: 17,
    name: 'Il Giro dei Trifogli',
    icon: '☘️',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.75, y: 0.80 },
      { x: 0.30, y: 0.80 },
      { x: 0.15, y: 0.50 },
      { x: 0.40, y: 0.20 },
      { x: 0.80, y: 0.35 }
    ]
  },
  // 18. La Corona di Petali (Gentle loop)
  {
    id: 18,
    name: 'La Corona di Petali',
    icon: '🌸',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.25, y: 0.80 },
      { x: 0.70, y: 0.80 },
      { x: 0.85, y: 0.50 },
      { x: 0.60, y: 0.20 },
      { x: 0.20, y: 0.35 }
    ]
  },
  // 19. La Salita dei Narcisi (Gentle ascent)
  {
    id: 19,
    name: 'La Salita dei Narcisi',
    icon: '🌼',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.20, y: 0.85 },
      { x: 0.45, y: 0.70 },
      { x: 0.35, y: 0.45 },
      { x: 0.65, y: 0.30 },
      { x: 0.75, y: 0.15 }
    ]
  },
  // 20. La Discesa Panoramica (Top-to-bottom scenic route)
  {
    id: 20,
    name: 'La Discesa Panoramica',
    icon: '🌄',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.80, y: 0.15 },
      { x: 0.55, y: 0.30 },
      { x: 0.65, y: 0.55 },
      { x: 0.35, y: 0.70 },
      { x: 0.25, y: 0.85 }
    ]
  },
  // 21. Il Viale delle Querce (Curved scenic trail)
  {
    id: 21,
    name: 'Il Viale delle Querce',
    icon: '🌳',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.25, y: 0.15 },
      { x: 0.45, y: 0.30 },
      { x: 0.35, y: 0.55 },
      { x: 0.65, y: 0.70 },
      { x: 0.75, y: 0.85 }
    ]
  },
  // 22. Il Giardino Segreto (Gentle central S)
  {
    id: 22,
    name: 'Il Giardino Segreto',
    icon: '🏡',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.30, y: 0.85 },
      { x: 0.60, y: 0.70 },
      { x: 0.50, y: 0.50 },
      { x: 0.25, y: 0.35 },
      { x: 0.65, y: 0.18 }
    ]
  },
  // 23. Il Bosco delle Lucciole (Gentle wandering curve)
  {
    id: 23,
    name: 'Il Bosco delle Lucciole',
    icon: '✨',
    category: '✨ Fiabe & Stelle',
    waypoints: [
      { x: 0.70, y: 0.85 },
      { x: 0.40, y: 0.70 },
      { x: 0.50, y: 0.50 },
      { x: 0.75, y: 0.35 },
      { x: 0.35, y: 0.18 }
    ]
  },
  // 24. Il Piccolo Sentiero Calmo (Gentle center arc)
  {
    id: 24,
    name: 'Il Piccolo Sentiero Calmo',
    icon: '🕊️',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.35, y: 0.82 },
      { x: 0.20, y: 0.55 },
      { x: 0.45, y: 0.40 },
      { x: 0.75, y: 0.35 },
      { x: 0.60, y: 0.18 }
    ]
  },
  // 25. La Spirale della Chiocciola (Sweet inward-curved spiral)
  {
    id: 25,
    name: 'La Spirale della Chiocciola',
    icon: '🐌',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.18, y: 0.82 },
      { x: 0.82, y: 0.75 },
      { x: 0.78, y: 0.30 },
      { x: 0.30, y: 0.32 },
      { x: 0.48, y: 0.56 }
    ]
  },
  // 26. La Chiocciola d'Oriente (Reverse inward spiral)
  {
    id: 26,
    name: "La Chiocciola d'Oriente",
    icon: '🌀',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.82, y: 0.82 },
      { x: 0.18, y: 0.75 },
      { x: 0.22, y: 0.30 },
      { x: 0.70, y: 0.32 },
      { x: 0.52, y: 0.56 }
    ]
  },
  // 27. Il Volo della Farfalla (Figure-eight harmonious meander)
  {
    id: 27,
    name: 'Il Volo della Farfalla',
    icon: '🦋',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.28, y: 0.82 },
      { x: 0.72, y: 0.66 },
      { x: 0.50, y: 0.50 },
      { x: 0.28, y: 0.34 },
      { x: 0.72, y: 0.18 }
    ]
  },
  // 28. La Danza del Colibrì (Reverse gliding flutter)
  {
    id: 28,
    name: 'La Danza del Colibrì',
    icon: '🕊️',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.72, y: 0.82 },
      { x: 0.28, y: 0.66 },
      { x: 0.50, y: 0.50 },
      { x: 0.72, y: 0.34 },
      { x: 0.28, y: 0.18 }
    ]
  },
  // 29. Il Ponte dell'Arcobaleno (Grand majestic arch)
  {
    id: 29,
    name: "Il Ponte dell'Arcobaleno",
    icon: '🌈',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.18, y: 0.80 },
      { x: 0.26, y: 0.42 },
      { x: 0.50, y: 0.18 },
      { x: 0.74, y: 0.42 },
      { x: 0.82, y: 0.80 }
    ]
  },
  // 30. La Culla dell'Oceano (Gentle concave cradle arch)
  {
    id: 30,
    name: "La Culla dell'Oceano",
    icon: '🌊',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.18, y: 0.20 },
      { x: 0.28, y: 0.60 },
      { x: 0.50, y: 0.82 },
      { x: 0.72, y: 0.60 },
      { x: 0.82, y: 0.20 }
    ]
  },
  // 31. La Cascata di Lavanda (Diagonal rhythmic steps)
  {
    id: 31,
    name: 'La Cascata di Lavanda',
    icon: '🪻',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.22, y: 0.85 },
      { x: 0.68, y: 0.72 },
      { x: 0.32, y: 0.50 },
      { x: 0.78, y: 0.35 },
      { x: 0.45, y: 0.16 }
    ]
  },
  // 32. Il Ruscello di Cristallo (Gentle crystalline meander)
  {
    id: 32,
    name: 'Il Ruscello di Cristallo',
    icon: '💧',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.78, y: 0.85 },
      { x: 0.32, y: 0.72 },
      { x: 0.68, y: 0.50 },
      { x: 0.22, y: 0.35 },
      { x: 0.55, y: 0.16 }
    ]
  },
  // 33. Il Labirinto delle Felci (Gentle calming winding walk)
  {
    id: 33,
    name: 'Il Labirinto delle Felci',
    icon: '🌿',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.20, y: 0.82 },
      { x: 0.75, y: 0.80 },
      { x: 0.80, y: 0.52 },
      { x: 0.25, y: 0.50 },
      { x: 0.30, y: 0.22 },
      { x: 0.75, y: 0.18 }
    ]
  },
  // 34. La Serpentina dell'Agrifoglio (Reverse winding walk)
  {
    id: 34,
    name: "La Serpentina dell'Agrifoglio",
    icon: '🍃',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.80, y: 0.82 },
      { x: 0.25, y: 0.80 },
      { x: 0.20, y: 0.52 },
      { x: 0.75, y: 0.50 },
      { x: 0.70, y: 0.22 },
      { x: 0.25, y: 0.18 }
    ]
  },
  // 35. Il Sentiero dei Girasoli (Tall loop towards the sun)
  {
    id: 35,
    name: 'Il Sentiero dei Girasoli',
    icon: '🌻',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.25, y: 0.82 },
      { x: 0.22, y: 0.35 },
      { x: 0.50, y: 0.18 },
      { x: 0.78, y: 0.35 },
      { x: 0.75, y: 0.68 }
    ]
  },
  // 36. La Rotonda dei Tulipani (Sunny garden promenade)
  {
    id: 36,
    name: 'La Rotonda dei Tulipani',
    icon: '🌷',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.75, y: 0.82 },
      { x: 0.78, y: 0.35 },
      { x: 0.50, y: 0.18 },
      { x: 0.22, y: 0.35 },
      { x: 0.25, y: 0.68 }
    ]
  },
  // 37. Il Saliscendi dei Colli (Gentle rolling hills wave)
  {
    id: 37,
    name: 'Il Saliscendi dei Colli',
    icon: '⛰️',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.18, y: 0.52 },
      { x: 0.32, y: 0.24 },
      { x: 0.50, y: 0.76 },
      { x: 0.68, y: 0.24 },
      { x: 0.82, y: 0.52 }
    ]
  },
  // 38. L'Altalena del Vento (Inverted rolling hills)
  {
    id: 38,
    name: "L'Altalena del Vento",
    icon: '🌬️',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.18, y: 0.52 },
      { x: 0.32, y: 0.76 },
      { x: 0.50, y: 0.24 },
      { x: 0.68, y: 0.76 },
      { x: 0.82, y: 0.52 }
    ]
  },
  // 39. La Passeggiata tra le Dune (Warm desert meander)
  {
    id: 39,
    name: 'La Passeggiata tra le Dune',
    icon: '🏜️',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.20, y: 0.85 },
      { x: 0.55, y: 0.62 },
      { x: 0.28, y: 0.42 },
      { x: 0.72, y: 0.32 },
      { x: 0.82, y: 0.15 }
    ]
  },
  // 40. Il Sentiero delle Conchiglie (Tidal shoreline gentle stroll)
  {
    id: 40,
    name: 'Il Sentiero delle Conchiglie',
    icon: '🐚',
    category: '🌊 Onde & Sinuosi',
    waypoints: [
      { x: 0.80, y: 0.85 },
      { x: 0.45, y: 0.62 },
      { x: 0.72, y: 0.42 },
      { x: 0.28, y: 0.32 },
      { x: 0.18, y: 0.15 }
    ]
  },
  // 41. Il Giro dell'Isola Serena (Full perimeter island tour)
  {
    id: 41,
    name: "Il Giro dell'Isola Serena",
    icon: '🏝️',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.32, y: 0.85 },
      { x: 0.16, y: 0.55 },
      { x: 0.28, y: 0.22 },
      { x: 0.74, y: 0.18 },
      { x: 0.84, y: 0.58 },
      { x: 0.52, y: 0.75 }
    ]
  },
  // 42. L'Oasi delle Palme (Mirage oasis circular walk)
  {
    id: 42,
    name: "L'Oasi delle Palme",
    icon: '🌴',
    category: '🌀 Spirali & Anelli',
    waypoints: [
      { x: 0.68, y: 0.85 },
      { x: 0.84, y: 0.55 },
      { x: 0.72, y: 0.22 },
      { x: 0.26, y: 0.18 },
      { x: 0.16, y: 0.58 },
      { x: 0.48, y: 0.75 }
    ]
  },
  // 43. La Danza dei Soffioni (Gentle diagonal cross-meander)
  {
    id: 43,
    name: 'La Danza dei Soffioni',
    icon: '🌾',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.22, y: 0.28 },
      { x: 0.46, y: 0.18 },
      { x: 0.76, y: 0.35 },
      { x: 0.54, y: 0.65 },
      { x: 0.24, y: 0.82 }
    ]
  },
  // 44. Il Respiro dell'Alpe (Fresh alpine mountain ridge descent)
  {
    id: 44,
    name: "Il Respiro dell'Alpe",
    icon: '🏔️',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.78, y: 0.28 },
      { x: 0.54, y: 0.18 },
      { x: 0.24, y: 0.35 },
      { x: 0.46, y: 0.65 },
      { x: 0.76, y: 0.82 }
    ]
  },
  // 45. Il Sentiero del Bosco di Bambù (Tall meditative zen path)
  {
    id: 45,
    name: 'Il Sentiero del Bosco di Bambù',
    icon: '🎋',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.50, y: 0.85 },
      { x: 0.28, y: 0.70 },
      { x: 0.72, y: 0.54 },
      { x: 0.28, y: 0.38 },
      { x: 0.72, y: 0.24 },
      { x: 0.50, y: 0.15 }
    ]
  },
  // 46. La Salita delle Ginestre (Gentle stairway slope)
  {
    id: 46,
    name: 'La Salita delle Ginestre',
    icon: '🌼',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.18, y: 0.82 },
      { x: 0.42, y: 0.74 },
      { x: 0.34, y: 0.54 },
      { x: 0.66, y: 0.48 },
      { x: 0.58, y: 0.28 },
      { x: 0.82, y: 0.18 }
    ]
  },
  // 47. La Discesa delle Campanule (Reverse gentle slope)
  {
    id: 47,
    name: 'La Discesa delle Campanule',
    icon: '🔔',
    category: '🌸 Prati & Fiori',
    waypoints: [
      { x: 0.82, y: 0.82 },
      { x: 0.58, y: 0.74 },
      { x: 0.66, y: 0.54 },
      { x: 0.34, y: 0.48 },
      { x: 0.42, y: 0.28 },
      { x: 0.18, y: 0.18 }
    ]
  },
  // 48. La Collina dei Trifogli Fortunati (Double clover-lobe path)
  {
    id: 48,
    name: 'La Collina dei Trifogli Fortunati',
    icon: '🍀',
    category: '⛰️ Colli & Valli',
    waypoints: [
      { x: 0.24, y: 0.85 },
      { x: 0.62, y: 0.80 },
      { x: 0.80, y: 0.52 },
      { x: 0.50, y: 0.46 },
      { x: 0.20, y: 0.34 },
      { x: 0.50, y: 0.15 }
    ]
  },
  // 49. Il Nido delle Rondini (Warm nest loop curve)
  {
    id: 49,
    name: 'Il Nido delle Rondini',
    icon: '🪹',
    category: '🌈 Ponti & Archi',
    waypoints: [
      { x: 0.76, y: 0.85 },
      { x: 0.38, y: 0.80 },
      { x: 0.20, y: 0.52 },
      { x: 0.50, y: 0.46 },
      { x: 0.80, y: 0.34 },
      { x: 0.50, y: 0.15 }
    ]
  },
  // 50. Il Sentiero della Buonanotte (Sweet evening gentle horizon)
  {
    id: 50,
    name: 'Il Sentiero della Buonanotte',
    icon: '🌙',
    category: '✨ Fiabe & Stelle',
    waypoints: [
      { x: 0.20, y: 0.72 },
      { x: 0.36, y: 0.48 },
      { x: 0.50, y: 0.66 },
      { x: 0.66, y: 0.34 },
      { x: 0.82, y: 0.52 }
    ]
  }
];

// Smooth Catmull-Rom spline point interpolator
function sampleCatmullRomSpline(waypoints: Point[], samplesPerSegment: number = 28): Point[] {
  if (waypoints.length < 2) return waypoints;
  const points: Point[] = [];
  const p = [waypoints[0], ...waypoints, waypoints[waypoints.length - 1]];

  for (let i = 0; i < p.length - 3; i++) {
    const p0 = p[i];
    const p1 = p[i + 1];
    const p2 = p[i + 2];
    const p3 = p[i + 3];

    for (let j = 0; j < samplesPerSegment; j++) {
      const t = j / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      points.push({ x, y });
    }
  }

  points.push(waypoints[waypoints.length - 1]);
  return points;
}

// Compute path points strictly inside the visible screen with guaranteed safety padding
// Mathematically guarantees path (52px wide), cuccia (38px radius), and biscuits never touch or exceed screen edges or top/bottom UI
function computeSafePathPoints(preset: PathPreset, width: number, height: number): Point[] {
  // Ultra-safe boundaries:
  // Side padding: at least 75px or 18% of screen width (provides minimum 40px clear green grass on sides)
  const paddingX = Math.max(75, Math.floor(width * 0.18));
  const minX = paddingX;
  const maxX = width - paddingX;

  // Top clearance: at least 175px or 25% of screen height (safely below all top headers, buttons and badges)
  const minY = Math.max(175, Math.floor(height * 0.25));
  // Bottom clearance: at least 95px or 14% of screen height (safely above bottom navigation hint)
  const maxY = height - Math.max(95, Math.floor(height * 0.14));

  // 1. Sample normalized curve
  const rawCurve = sampleCatmullRomSpline(preset.waypoints, 30);
  const xs = rawCurve.map(pt => pt.x);
  const ys = rawCurve.map(pt => pt.y);
  const cMinX = Math.min(...xs);
  const cMaxX = Math.max(...xs);
  const cMinY = Math.min(...ys);
  const cMaxY = Math.max(...ys);

  const spanX = cMaxX - cMinX || 1;
  const spanY = cMaxY - cMinY || 1;

  // 2. Map curve exactly into [minX, maxX] and [minY, maxY]
  return rawCurve.map(pt => {
    const normX = (pt.x - cMinX) / spanX;
    const normY = (pt.y - cMinY) / spanY;
    return {
      x: minX + normX * (maxX - minX),
      y: minY + normY * (maxY - minY)
    };
  });
}

export const PassoPassoNinni: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game UI & State
  const [biscuitCount, setBiscuitCount] = useState(0);
  const [totalBiscuits, setTotalBiscuits] = useState<number>(() => Math.floor(Math.random() * (10 - 5 + 1)) + 5);
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(() => Math.floor(Math.random() * PATH_PRESETS.length));

  const [isVictory, setIsVictory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isAgitated, setIsAgitated] = useState(false);
  const [agitationMessage, setAgitationMessage] = useState<string | null>(null);
  const [recalibrateToast, setRecalibrateToast] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroSupported, setGyroSupported] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isRandomLandscape, setIsRandomLandscape] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('fitworld_ninni_random_landscape');
    return saved !== null ? saved === 'true' : true;
  });
  const isRandomLandscapeRef = useRef<boolean>(isRandomLandscape);
  isRandomLandscapeRef.current = isRandomLandscape;

  const [landscape, setLandscape] = useState<LandscapeType>(() => {
    const saved = sessionStorage.getItem('fitworld_ninni_landscape') as LandscapeType;
    if (saved && LANDSCAPES.some(l => l.id === saved)) return saved;
    // Pick an initial random landscape among all available
    const randomIndex = Math.floor(Math.random() * LANDSCAPES.length);
    return LANDSCAPES[randomIndex].id;
  });
  const [showLandscapeModal, setShowLandscapeModal] = useState(false);
  const landscapeRef = useRef<LandscapeType>(landscape);
  landscapeRef.current = landscape;

  const currentLandscapeConfig = LANDSCAPES.find(l => l.id === landscape) || LANDSCAPES[0];

  // Gameplay Refs for 60fps loop
  const ninniPosRef = useRef<Point>({ x: 200, y: 350 });
  const ninniVelRef = useRef<Point>({ x: 0, y: 0 });
  const ninniAngleRef = useRef<number>(0);
  const ninniAnimFrameRef = useRef<number>(0);
  const isWalkingRef = useRef<boolean>(false);
  const isSittingRef = useRef<boolean>(false);
  const headTiltRef = useRef<number>(0);
  const tailWagRef = useRef<number>(0);

  // Motion Tracking & Gyroscope Guidance
  const lastOrientationRef = useRef<{ beta: number; gamma: number; time: number } | null>(null);
  const lastRawOrientationRef = useRef<{ beta: number; gamma: number } | null>(null);
  const baseOrientationRef = useRef<{ beta: number; gamma: number } | null>(null);
  const agitationCooldownRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const targetTouchRef = useRef<Point | null>(null);
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // Level Content Refs
  const biscuitsRef = useRef<Biscuit[]>([]);
  const bedPosRef = useRef<Point>({ x: 0, y: 0 });
  const sceneryElementsRef = useRef<SceneryItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Path & Level Tracking
  const lastPathIndexRef = useRef<number>(-1);
  const currentPresetIndexRef = useRef<number>(currentPathIndex);
  const totalBiscuitsRef = useRef<number>(totalBiscuits);
  const currentPathPointsRef = useRef<Point[]>([]);
  const isInitializedRef = useRef<boolean>(false);

  // Sync refs so canvas loop doesn't restart when switching between manual and tilt mode
  const gyroActiveRef = useRef<boolean>(gyroActive);
  useEffect(() => {
    gyroActiveRef.current = gyroActive;
    if (gyroActive) {
      // Quando si attiva l'inclinazione, la posizione iniziale viene presa come base (zero)
      baseOrientationRef.current = null;
      lastOrientationRef.current = null;
    } else {
      // Ferma Ninni quando il giroscopio viene disattivato
      ninniVelRef.current = { x: 0, y: 0 };
    }
  }, [gyroActive]);

  const isVictoryRef = useRef<boolean>(isVictory);
  useEffect(() => {
    isVictoryRef.current = isVictory;
  }, [isVictory]);

  // Rescales existing level paths & items on screen resize without resetting collected biscuits or Ninni position
  const rescaleLevel = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const preset = PATH_PRESETS[currentPresetIndexRef.current];
    const sampledPoints = computeSafePathPoints(preset, width, height);
    currentPathPointsRef.current = sampledPoints;

    const endPt = sampledPoints[sampledPoints.length - 1];
    bedPosRef.current = { x: endPt.x, y: endPt.y };

    const biscuitTotal = totalBiscuitsRef.current;
    biscuitsRef.current = biscuitsRef.current.map((b, i) => {
      const fraction = (i + 1) / (biscuitTotal + 1);
      const idx = Math.min(
        sampledPoints.length - 1,
        Math.max(0, Math.floor(fraction * (sampledPoints.length - 1)))
      );
      const pt = sampledPoints[idx];
      return { ...b, x: pt.x, y: pt.y };
    });
  }, []);

  // Initialize Level Path, Biscuits, and Cuccia
  const initLevel = useCallback((isNewGame: boolean = false) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (isNewGame || lastPathIndexRef.current === -1) {
      let nextIdx: number;
      if (lastPathIndexRef.current === -1) {
        // First game starts on initial random preset
        nextIdx = currentPresetIndexRef.current;
      } else {
        // Any subsequent match automatically picks a new random preset from the diverse calming catalog
        nextIdx = Math.floor(Math.random() * PATH_PRESETS.length);
        if (nextIdx === lastPathIndexRef.current && PATH_PRESETS.length > 1) {
          nextIdx = (nextIdx + 1) % PATH_PRESETS.length;
        }
      }
      lastPathIndexRef.current = nextIdx;
      currentPresetIndexRef.current = nextIdx;
      setCurrentPathIndex(nextIdx);

      // Random food items strictly from 5 to 10
      const biscuitTotal = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      totalBiscuitsRef.current = biscuitTotal;
      setTotalBiscuits(biscuitTotal);

      // Randomize landscape if random mode is active and starting a new match
      if (isRandomLandscapeRef.current && isNewGame) {
        const currentId = landscapeRef.current;
        const candidates = LANDSCAPES.filter(l => l.id !== currentId);
        const randomPick = candidates[Math.floor(Math.random() * candidates.length)] || LANDSCAPES[0];
        landscapeRef.current = randomPick.id;
        setLandscape(randomPick.id);
        sessionStorage.setItem('fitworld_ninni_landscape', randomPick.id);
      }
    }

    const preset = PATH_PRESETS[currentPresetIndexRef.current] || PATH_PRESETS[0];
    const biscuitTotal = totalBiscuitsRef.current;

    // Compute path points guaranteed 100% inside visible screen with generous clearance
    const sampledPoints = computeSafePathPoints(preset, width, height);
    currentPathPointsRef.current = sampledPoints;

    // Ninni starts at the very beginning of the footpath
    const startPt = sampledPoints[0];
    ninniPosRef.current = { x: startPt.x, y: startPt.y };
    ninniVelRef.current = { x: 0, y: 0 };
    ninniAngleRef.current = 0;
    isSittingRef.current = false;
    setIsAgitated(false);
    setAgitationMessage(null);
    setIsVictory(false);
    setBiscuitCount(0);

    // Bed ("Cuccia") at the path destination
    const endPt = sampledPoints[sampledPoints.length - 1];
    bedPosRef.current = { x: endPt.x, y: endPt.y };

    const land = landscapeRef.current;

    // Distribute varied delicious foods evenly along the sampled footpath
    const biscuits: Biscuit[] = [];
    const foodVarieties: FoodType[] = ['osso', 'pesce', 'coscetta', 'formaggio', 'salsiccia', 'carota', 'biscotto'];

    for (let i = 0; i < biscuitTotal; i++) {
      const fraction = (i + 1) / (biscuitTotal + 1);
      const idx = Math.min(
        sampledPoints.length - 1,
        Math.max(0, Math.floor(fraction * (sampledPoints.length - 1)))
      );
      const pt = sampledPoints[idx];

      // Landscape-attuned or varied foods:
      // At the beach ('mare'), fish and bones appear more often!
      let foodType: FoodType;
      if (land === 'mare' && i % 2 === 0) {
        foodType = 'pesce';
      } else {
        foodType = foodVarieties[i % foodVarieties.length];
      }

      biscuits.push({
        id: i + 1,
        x: pt.x,
        y: pt.y,
        collected: false,
        pulseOffset: i * 1.1,
        foodType
      });
    }
    biscuitsRef.current = biscuits;

    // Generate landscape-specific scenery elements
    const elements: SceneryItem[] = [];

    if (land === 'mare') {
      const seaColors = ['#fda4af', '#f43f5e', '#fb923c', '#fdba74', '#fef08a'];
      for (let i = 0; i < 35; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: seaColors[i % seaColors.length],
          size: 4 + Math.random() * 4,
          type: i % 2 === 0 ? 'seashell' : 'starfish',
          petalCount: 5
        });
      }
    } else if (land === 'citta') {
      for (let i = 0; i < 30; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: i % 2 === 0 ? '#fbcfe8' : '#fde047',
          size: 5 + Math.random() * 4,
          type: i % 3 === 0 ? 'lantern' : 'flowerbed',
          petalCount: 4
        });
      }
    } else if (land === 'vulcano') {
      for (let i = 0; i < 32; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: i % 2 === 0 ? '#f97316' : '#a855f7',
          size: 4 + Math.random() * 5,
          type: i % 2 === 0 ? 'lava_ember' : 'obsidian',
          petalCount: 4
        });
      }
    } else if (land === 'notte') {
      for (let i = 0; i < 40; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: '#fef08a',
          size: 2.5 + Math.random() * 4,
          type: i % 2 === 0 ? 'star' : 'firefly',
          petalCount: 5
        });
      }
    } else if (land === 'neve') {
      for (let i = 0; i < 35; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: '#ffffff',
          size: 5 + Math.random() * 5,
          type: i % 3 === 0 ? 'pine' : 'snowflake',
          petalCount: 6
        });
      }
    } else if (land === 'autunno') {
      const autumnColors = ['#dc2626', '#ea580c', '#f59e0b', '#d97706', '#991b1b'];
      for (let i = 0; i < 36; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: autumnColors[i % autumnColors.length],
          size: 4 + Math.random() * 5,
          type: i % 2 === 0 ? 'maple_leaf' : 'mushroom',
          petalCount: 5
        });
      }
    } else if (land === 'zen') {
      const zenColors = ['#10b981', '#f472b6', '#34d399', '#fbcfe8', '#64748b'];
      for (let i = 0; i < 35; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: zenColors[i % zenColors.length],
          size: 5 + Math.random() * 5,
          type: i % 3 === 0 ? 'bamboo_stalk' : i % 3 === 1 ? 'lotus_pad' : 'river_stone',
          petalCount: 6
        });
      }
    } else if (land === 'deserto') {
      const desertColors = ['#f59e0b', '#fbbf24', '#38bdf8', '#0284c7', '#d97706'];
      for (let i = 0; i < 32; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: desertColors[i % desertColors.length],
          size: 4 + Math.random() * 5,
          type: i % 2 === 0 ? 'palm_frond' : 'desert_gem',
          petalCount: 4
        });
      }
    } else if (land === 'dolcetti') {
      const candyColors = ['#ec4899', '#a855f7', '#06b6d4', '#facc15', '#fb7185'];
      for (let i = 0; i < 36; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: candyColors[i % candyColors.length],
          size: 4 + Math.random() * 5,
          type: i % 2 === 0 ? 'sugar_crystal' : 'candy_swirl',
          petalCount: 5
        });
      }
    } else {
      // Default 'prato' (Meadow)
      const colors = ['#ffd166', '#f4a261', '#e76f51', '#c77dff', '#e9c46a', '#b7e4c7'];
      for (let i = 0; i < 40; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: colors[i % colors.length],
          size: 3 + Math.random() * 4,
          type: 'flower',
          petalCount: 5 + (Math.random() > 0.5 ? 1 : 0)
        });
      }
    }
    sceneryElementsRef.current = elements;
  }, []);

  const switchLandscape = (newLand: LandscapeType, disableRandom: boolean = true) => {
    if (disableRandom) {
      setIsRandomLandscape(false);
      isRandomLandscapeRef.current = false;
      sessionStorage.setItem('fitworld_ninni_random_landscape', 'false');
    }
    setLandscape(newLand);
    landscapeRef.current = newLand;
    sessionStorage.setItem('fitworld_ninni_landscape', newLand);
    soundManager.playTick();
    initLevel(false);
  };

  const pickRandomLandscape = () => {
    const currentId = landscapeRef.current;
    const candidates = LANDSCAPES.filter(l => l.id !== currentId);
    const randomPick = candidates[Math.floor(Math.random() * candidates.length)] || LANDSCAPES[0];
    switchLandscape(randomPick.id, false);
  };

  const enableRandomLandscape = () => {
    setIsRandomLandscape(true);
    isRandomLandscapeRef.current = true;
    sessionStorage.setItem('fitworld_ninni_random_landscape', 'true');
    pickRandomLandscape();
  };

  const cycleNextLandscape = () => {
    const currentIndex = LANDSCAPES.findIndex(l => l.id === landscapeRef.current);
    const nextIndex = (currentIndex + 1) % LANDSCAPES.length;
    switchLandscape(LANDSCAPES[nextIndex].id, false);
  };

  // Check Gyroscope capability & permissions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasOrientation = 'DeviceOrientationEvent' in window;
      setGyroSupported(hasOrientation);

      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
        setNeedsPermission(true);
      } else if (hasOrientation) {
        // Auto-enable for devices that don't need explicit permission prompt
        setGyroActive(true);
      }
    }
  }, []);

  const requestGyroPermission = async () => {
    try {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      const DeviceMotionEventAny = window.DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      let granted = false;
      if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          granted = true;
        }
      } else {
        granted = true;
      }

      if (DeviceMotionEventAny && typeof DeviceMotionEventAny.requestPermission === 'function') {
        try {
          await DeviceMotionEventAny.requestPermission();
        } catch {
          // Non bloccante se devicemotion non richiede o rifiuta
        }
      }

      if (granted) {
        setGyroActive(true);
        setNeedsPermission(false);
        baseOrientationRef.current = null;
        lastRawOrientationRef.current = null;
        soundManager.playTick();
      }
    } catch {
      setGyroActive(false);
    }
  };

  // Ricalibrazione manuale: imposta l'inclinazione attuale dello smartphone come centro neutro
  const recalibrateGyro = useCallback(() => {
    if (lastRawOrientationRef.current) {
      baseOrientationRef.current = {
        beta: lastRawOrientationRef.current.beta,
        gamma: lastRawOrientationRef.current.gamma
      };
    } else {
      baseOrientationRef.current = null;
    }
    ninniVelRef.current = { x: 0, y: 0 };
    isSittingRef.current = false;
    headTiltRef.current = 0;
    setRecalibrateToast(true);
    soundManager.playTick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setTimeout(() => setRecalibrateToast(false), 1600);
  }, []);

  // Trigger Anti-Agitation Pause
  const triggerAgitation = useCallback((reason: string) => {
    if (isSittingRef.current && isAgitated) return;
    isSittingRef.current = true;
    setIsAgitated(true);
    setAgitationMessage(reason);
    ninniVelRef.current = { x: 0, y: 0 };
    headTiltRef.current = 0.35; // Cute puzzled head tilt
    soundManager.playNinniAlert();

    // 2.2 seconds cooling down period
    agitationCooldownRef.current = Date.now() + 2200;
  }, [isAgitated]);

  // Ascolto Eventi Giroscopio & Movimento: FERMA NINNI SE TI MUOVI PIÙ VELOCEMENTE
  useEffect(() => {
    if (!gyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;   // Inclinazione avanti/indietro (-180 a 180)
      const gamma = e.gamma ?? 0; // Inclinazione destra/sinistra (-90 a 90)
      const now = Date.now();

      lastRawOrientationRef.current = { beta, gamma };

      // Se non abbiamo ancora calibrato la posizione base neutra, impostala subito
      if (!baseOrientationRef.current) {
        baseOrientationRef.current = { beta, gamma };
      }

      // 1. Calcolo della velocità di rotazione angolare (gradi al secondo)
      let angularSpeed = 0;
      if (lastOrientationRef.current) {
        const dt = Math.max(0.016, (now - lastOrientationRef.current.time) / 1000);
        const dBeta = Math.abs(beta - lastOrientationRef.current.beta) / dt;
        const dGamma = Math.abs(gamma - lastOrientationRef.current.gamma) / dt;
        angularSpeed = Math.sqrt(dBeta * dBeta + dGamma * dGamma);
      }
      lastOrientationRef.current = { beta, gamma, time: now };

      // 2. Differenza rispetto alla posizione neutra calibrata
      const rawPitch = beta - baseOrientationRef.current.beta;
      const rawRoll = gamma - baseOrientationRef.current.gamma;

      // 3. Guida fluida e diretta di Ninni con l'inclinazione (senza blocco per velocità)
      if (!isSittingRef.current) {
        // Zona morta bilanciata per facilitare sia lo stop naturale che la guida precisa
        const DEADZONE_ROLL = 3.0;
        const DEADZONE_PITCH = 3.2;

        let vx = 0;
        let vy = 0;

        if (Math.abs(rawRoll) > DEADZONE_ROLL) {
          const excessRoll = Math.abs(rawRoll) - DEADZONE_ROLL;
          const rollMag = Math.min(3.2, excessRoll * 0.14);
          vx = Math.sign(rawRoll) * rollMag;
        }

        if (Math.abs(rawPitch) > DEADZONE_PITCH) {
          const excessPitch = Math.abs(rawPitch) - DEADZONE_PITCH;
          // Inclinando in avanti (beta diminuisce), Ninni va in su (-y)
          // Inclinando indietro (beta aumenta), Ninni va in giù (+y)
          const pitchMag = Math.min(3.2, excessPitch * 0.14);
          vy = Math.sign(rawPitch) * pitchMag;
        }

        ninniVelRef.current = { x: vx, y: vy };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroActive, triggerAgitation]);

  // Keyboard controls for desktop fallback (with anti-spam check)
  useEffect(() => {
    const keyPressHistory: number[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;
      const now = Date.now();
      keyPressHistory.push(now);

      // Check key agitation spam (more than 7 rapid presses in 600ms)
      const recent = keyPressHistory.filter(t => now - t < 600);
      if (recent.length > 7) {
        triggerAgitation('Fai un respiro profondo... guida Ninni con tocchi calmi e rilassati 🌸');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerAgitation]);

  // Touch / Drag input handler for mobile touch fallback
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Non intercettare click su bottoni di interfaccia
    if ((e.target as HTMLElement).closest?.('button, a, input, select, [role="button"]')) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    touchCurrentRef.current = { x: clientX, y: clientY };
    targetTouchRef.current = { x: clientX, y: clientY };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const now = Date.now();

    touchCurrentRef.current = { x: clientX, y: clientY };
    touchStartRef.current = { x: clientX, y: clientY, time: now };
    targetTouchRef.current = { x: clientX, y: clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    // Lasciamo targetTouchRef attivo così se l'utente ha toccato un punto, Ninni ci cammina fino ad arrivare
  };

  // Main Canvas Render & Game Loop (Optimized 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!isInitializedRef.current) {
        initLevel(true);
        isInitializedRef.current = true;
      } else {
        rescaleLevel();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const now = performance.now();

      // 1. Process Agitation Timer & Recovery
      if (isSittingRef.current && Date.now() > agitationCooldownRef.current) {
        isSittingRef.current = false;
        setIsAgitated(false);
        setAgitationMessage(null);
        headTiltRef.current = 0;
      }

      // 2. Process Touch/Drag & Keyboard Inputs if active
      if (!isSittingRef.current && !gyroActiveRef.current) {
        const keys = keysPressedRef.current;
        let kx = 0;
        let ky = 0;
        if (keys['arrowleft'] || keys['a']) kx -= 1;
        if (keys['arrowright'] || keys['d']) kx += 1;
        if (keys['arrowup'] || keys['w']) ky -= 1;
        if (keys['arrowdown'] || keys['s']) ky += 1;

        if (kx !== 0 || ky !== 0) {
          // La tastiera ha priorità sul tocco precedente
          targetTouchRef.current = null;
          const mag = Math.sqrt(kx * kx + ky * ky);
          const calmSpeed = 2.1;
          ninniVelRef.current = {
            x: (kx / mag) * calmSpeed,
            y: (ky / mag) * calmSpeed
          };
        } else if (targetTouchRef.current) {
          const tx = targetTouchRef.current.x;
          const ty = targetTouchRef.current.y;
          const dx = tx - ninniPosRef.current.x;
          const dy = ty - ninniPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 14) {
            const calmSpeed = Math.min(2.4, Math.max(1.2, dist * 0.05));
            ninniVelRef.current = {
              x: (dx / dist) * calmSpeed,
              y: (dy / dist) * calmSpeed
            };
          } else {
            ninniVelRef.current = { x: 0, y: 0 };
            targetTouchRef.current = null;
          }
        } else {
          ninniVelRef.current = {
            x: ninniVelRef.current.x * 0.85,
            y: ninniVelRef.current.y * 0.85
          };
        }
      }

      // 3. Update Ninni Position & Orientation
      const vel = ninniVelRef.current;
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      const isMoving = speed > 0.25 && !isSittingRef.current;
      isWalkingRef.current = isMoving;

      if (isMoving) {
        const paddingX = Math.max(75, Math.floor(width * 0.18));
        const minY = Math.max(175, Math.floor(height * 0.25));
        const maxY = height - Math.max(95, Math.floor(height * 0.14));

        const safeMinX = Math.max(35, paddingX - 25);
        const safeMaxX = width - Math.max(35, paddingX - 25);
        const safeMinY = Math.max(145, minY - 25);
        const safeMaxY = Math.min(height - 50, maxY + 25);

        ninniPosRef.current.x = Math.max(safeMinX, Math.min(safeMaxX, ninniPosRef.current.x + vel.x));
        ninniPosRef.current.y = Math.max(safeMinY, Math.min(safeMaxY, ninniPosRef.current.y + vel.y));
        ninniAngleRef.current = Math.atan2(vel.y, vel.x);
        ninniAnimFrameRef.current += speed * 0.18;
        tailWagRef.current = Math.sin(now * 0.012) * 0.45;

        // Occasional gentle footstep sound
        if (Math.sin(ninniAnimFrameRef.current) > 0.85) {
          soundManager.playNinniStep();
        }
      } else {
        ninniAnimFrameRef.current = 0;
        tailWagRef.current = Math.sin(now * 0.004) * 0.2;
      }

      // 4. Biscuit Collection Detection
      const biscuits = biscuitsRef.current;
      let newlyCollected = false;
      biscuits.forEach(b => {
        if (!b.collected) {
          const dx = ninniPosRef.current.x - b.x;
          const dy = ninniPosRef.current.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 32) {
            b.collected = true;
            newlyCollected = true;
            soundManager.playNinniBiscuit();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(35);
            }
          }
        }
      });

      if (newlyCollected) {
        const count = biscuits.filter(b => b.collected).length;
        setBiscuitCount(count);
      }

      // 5. Cuccia Bed Reached Detection
      const bed = bedPosRef.current;
      const bedDx = ninniPosRef.current.x - bed.x;
      const bedDy = ninniPosRef.current.y - bed.y;
      const bedDist = Math.sqrt(bedDx * bedDx + bedDy * bedDy);
      const allBiscuitsFound = biscuits.every(b => b.collected);

      if (bedDist < 42 && !isVictoryRef.current) {
        if (allBiscuitsFound) {
          setIsVictory(true);
          soundManager.playNinniVictory();
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([60, 40, 100]);
          }
        }
      }

      // ==========================================
      // RENDERING CANVAS (Multi-Landscape & Ninni)
      // ==========================================
      const currentLand = landscapeRef.current;
      const pathPts = currentPathPointsRef.current;

      // Disegna il percorso morbido, accogliente e ben visibile attraverso il paesaggio
      const drawPath = (fillColor: string, borderColor: string, isGlow = false) => {
        if (!pathPts || pathPts.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 1. Bordo esterno morbido o alone luminoso
        if (isGlow) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 42;
          ctx.shadowColor = borderColor;
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(pathPts[0].x, pathPts[0].y);
          for (let i = 1; i < pathPts.length; i++) {
            ctx.lineTo(pathPts[i].x, pathPts[i].y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 38;
          ctx.beginPath();
          ctx.moveTo(pathPts[0].x, pathPts[0].y);
          for (let i = 1; i < pathPts.length; i++) {
            ctx.lineTo(pathPts[i].x, pathPts[i].y);
          }
          ctx.stroke();
        }

        // 2. Sentiero interno pieno
        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.moveTo(pathPts[0].x, pathPts[0].y);
        for (let i = 1; i < pathPts.length; i++) {
          ctx.lineTo(pathPts[i].x, pathPts[i].y);
        }
        ctx.stroke();

        // 3. Delicato tratteggio centrale in stile ciottoli / vialetto
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        ctx.moveTo(pathPts[0].x, pathPts[0].y);
        for (let i = 1; i < pathPts.length; i++) {
          ctx.lineTo(pathPts[i].x, pathPts[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      };

      if (currentLand === 'mare') {
        // 🌊 Bordo Mare (Golden Sand Beach & Turquoise Ocean)
        ctx.fillStyle = '#f5d699';
        ctx.fillRect(0, 0, width, height);

        // Turquoise Ocean Gradient across top
        const seaGrad = ctx.createLinearGradient(0, 0, 0, height * 0.42);
        seaGrad.addColorStop(0, '#0284c7');
        seaGrad.addColorStop(0.7, '#38bdf8');
        seaGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = seaGrad;
        ctx.fillRect(0, 0, width, height * 0.42);

        // Animated gentle ocean waves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2.5;
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          const waveY = 45 + w * 26;
          ctx.moveTo(0, waveY);
          for (let x = 0; x <= width; x += 15) {
            const dy = Math.sin(now * 0.002 + x * 0.03 + w * 1.8) * 5;
            ctx.lineTo(x, waveY + dy);
          }
          ctx.stroke();
        }

        // Shoreline Foam Line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.28);
        for (let x = 0; x <= width; x += 20) {
          const dy = Math.sin(now * 0.0016 + x * 0.02) * 7;
          ctx.lineTo(x, height * 0.28 + dy);
        }
        ctx.stroke();

        // Sandy shoreline path
        drawPath('#eed39f', '#d4b483');

        // Draw Seashells & Starfish
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'starfish') {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            for (let p = 0; p < 5; p++) {
              const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
              const a2 = a + Math.PI / 5;
              const x1 = el.x + Math.cos(a) * el.size;
              const y1 = el.y + Math.sin(a) * el.size;
              const x2 = el.x + Math.cos(a2) * (el.size * 0.45);
              const y2 = el.y + Math.sin(a2) * (el.size * 0.45);
              if (p === 0) ctx.moveTo(x1, y1);
              else ctx.lineTo(x1, y1);
              ctx.lineTo(x2, y2);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.85, 0, Math.PI, true);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
          ctx.restore();
        });
      } else if (currentLand === 'citta') {
        // 🏙️ Passeggiata in Città (Cobblestone Plaza, Green Hedges, Street Lamps)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, width, height);

        // Cobblestone pavement grid lines
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        const step = 44;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Green hedge patches on sides
        ctx.fillStyle = '#86efac';
        for (let i = 0; i < 14; i++) {
          const px = (i * 140 + 20) % width;
          const py = (i * 190 + 50) % height;
          ctx.beginPath();
          ctx.roundRect(px - 22, py - 10, 44, 20, 6);
          ctx.fill();
        }

        // Slate City Path
        drawPath('#64748b', '#475569');

        // Draw lanterns & flowerbeds
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'lantern') {
            ctx.fillStyle = 'rgba(253, 224, 71, 0.25)';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'vulcano') {
        // 🌋 Vulcano Calmo (Dark Basalt, Glowing Gentle Magma)
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#292524';
        for (let i = 0; i < 22; i++) {
          const px = (i * 133) % width;
          const py = (i * 187 + 40) % height;
          ctx.beginPath();
          ctx.ellipse(px, py, 38, 22, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Gentle Glowing Magma Fissures
        ctx.save();
        ctx.strokeStyle = '#ea580c';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const startY = (i * height) / 3 + 55;
          ctx.moveTo(0, startY);
          ctx.quadraticCurveTo(width * 0.45, startY + 22 + Math.sin(now * 0.002 + i) * 6, width, startY - 10);
          ctx.stroke();
        }
        ctx.restore();

        // Dark Warm Basalt Path
        drawPath('#44403c', '#78350f');

        // Draw embers & obsidian crystals
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'lava_ember') {
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#fb923c';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.moveTo(el.x, el.y - el.size);
            ctx.lineTo(el.x + el.size * 0.7, el.y);
            ctx.lineTo(el.x, el.y + el.size);
            ctx.lineTo(el.x - el.size * 0.7, el.y);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'notte') {
        // 🌌 Notte Magica (Midnight indigo & Twinkling Fireflies)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        const nightGrad = ctx.createLinearGradient(0, 0, 0, height);
        nightGrad.addColorStop(0, '#0f172a');
        nightGrad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, width, height);

        // Mystical Lapis Path with glowing celestial border
        drawPath('#312e81', '#818cf8', true);

        // Draw stars & glowing fireflies
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'firefly') {
            const glow = Math.sin(now * 0.004 + el.x) * 0.3 + 0.7;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const twinkle = Math.sin(now * 0.003 + el.y) * 0.4 + 0.6;
            ctx.fillStyle = `rgba(254, 240, 138, ${twinkle})`;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'neve') {
        // ❄️ Sentiero Innevato (Crisp Snow & Evergreen Pines)
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#e0f2fe';
        for (let i = 0; i < 20; i++) {
          const px = (i * 135) % width;
          const py = (i * 190 + 30) % height;
          ctx.beginPath();
          ctx.ellipse(px, py, 45, 22, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pure white snow path
        drawPath('#ffffff', '#bae6fd');

        // Draw pine trees & snowflakes
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'pine') {
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.moveTo(el.x, el.y - el.size * 1.5);
            ctx.lineTo(el.x + el.size * 0.9, el.y + el.size * 0.5);
            ctx.lineTo(el.x - el.size * 0.9, el.y + el.size * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(el.x, el.y - el.size * 1.4, el.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'autunno') {
        // 🍂 Bosco d'Autunno (Warm Amber Ground & Falling Maple Leaves)
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(0, 0, width, height);

        // Warm foliage patches
        ctx.fillStyle = '#713f12';
        for (let i = 0; i < 22; i++) {
          const px = (i * 127) % width;
          const py = (i * 183 + 45) % height;
          ctx.beginPath();
          ctx.ellipse(px, py, 42, 24, 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Earthy amber forest path
        drawPath('#b45309', '#78350f');

        // Draw maple leaves & mushrooms
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'mushroom') {
            // White stalk
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.roundRect(el.x - 2, el.y - 1, 4, el.size * 1.2, 2);
            ctx.fill();
            // Red polka-dot cap
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.9, Math.PI, 0, false);
            ctx.fill();
            // Dots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(el.x - el.size * 0.35, el.y - el.size * 0.3, 1.2, 0, Math.PI * 2);
            ctx.arc(el.x + el.size * 0.35, el.y - el.size * 0.3, 1.2, 0, Math.PI * 2);
            ctx.arc(el.x, el.y - el.size * 0.6, 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Maple leaf
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
            // Leaf stem
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(el.x, el.y);
            ctx.lineTo(el.x + el.size * 0.9, el.y + el.size * 0.9);
            ctx.stroke();
          }
          ctx.restore();
        });
      } else if (currentLand === 'zen') {
        // 🎋 Giardino Zen Bambù (Raked Sand & Lotus Lilies)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, width, height);

        // Raked concentric circular sand ripples
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        for (let r = 20; r < 240; r += 26) {
          ctx.beginPath();
          ctx.arc(width * 0.15, height * 0.2, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        for (let r = 25; r < 200; r += 28) {
          ctx.beginPath();
          ctx.arc(width * 0.82, height * 0.8, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Small clear water spring in corner
        const springGrad = ctx.createRadialGradient(width * 0.88, height * 0.15, 5, width * 0.88, height * 0.15, 80);
        springGrad.addColorStop(0, '#a7f3d0');
        springGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = springGrad;
        ctx.beginPath();
        ctx.arc(width * 0.88, height * 0.15, 75, 0, Math.PI * 2);
        ctx.fill();

        // Zen Slate Stepping Path
        drawPath('#f1f5f9', '#94a3b8');

        // Draw bamboo stalks, lotus blossoms & river stones
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'bamboo_stalk') {
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.roundRect(el.x - 3, el.y - el.size * 1.5, 6, el.size * 3, 2);
            ctx.fill();
            // Bamboo leaf shoots
            ctx.fillStyle = '#34d399';
            ctx.beginPath();
            ctx.ellipse(el.x + 6, el.y - el.size * 0.5, el.size * 0.9, 2.5, 0.4, 0, Math.PI * 2);
            ctx.ellipse(el.x - 6, el.y + el.size * 0.5, el.size * 0.9, 2.5, -0.4, 0, Math.PI * 2);
            ctx.fill();
          } else if (el.type === 'lotus_pad') {
            // Lily pad
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.9, 0.3, Math.PI * 2 - 0.3);
            ctx.fill();
            // Pink Lotus blossom
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // River pebble
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.ellipse(el.x, el.y, el.size * 0.8, el.size * 0.55, 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'deserto') {
        // 🏜️ Oasi nel Deserto (Golden Dunes & Sparkling Water Pool)
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, width, height);

        // Warm sand dune ridges
        ctx.fillStyle = '#fde68a';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const startY = (i * height) / 3.5 + 30;
          ctx.moveTo(0, startY);
          ctx.bezierCurveTo(width * 0.35, startY + 45, width * 0.65, startY - 25, width, startY + 20);
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();
        }

        // Sparkling oasis pool
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(width * 0.18, height * 0.22, 55, 36, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Desert trail
        drawPath('#fbbf24', '#d97706');

        // Draw palm fronds & desert gems
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'palm_frond') {
            ctx.strokeStyle = '#059669';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 1.5, 0, Math.PI * 0.6);
            ctx.stroke();
            ctx.fillStyle = '#10b981';
            for (let f = 0; f < 4; f++) {
              ctx.beginPath();
              ctx.ellipse(el.x + f * 4, el.y + f * 3, el.size * 0.6, 2, 0.6, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.ellipse(el.x, el.y, el.size * 0.7, el.size * 0.5, 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (currentLand === 'dolcetti') {
        // 🍭 Nuvole di Zucchero (Pastel Pink Wonderland & Candy Gems)
        ctx.fillStyle = '#fce7f3';
        ctx.fillRect(0, 0, width, height);

        // Pastel purple/pink gradient
        const sugarGrad = ctx.createLinearGradient(0, 0, 0, height);
        sugarGrad.addColorStop(0, '#fce7f3');
        sugarGrad.addColorStop(1, '#f3e8ff');
        ctx.fillStyle = sugarGrad;
        ctx.fillRect(0, 0, width, height);

        // Fluffy cloud mounds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let i = 0; i < 18; i++) {
          const px = (i * 145) % width;
          const py = (i * 195 + 40) % height;
          ctx.beginPath();
          ctx.arc(px - 14, py, 20, 0, Math.PI * 2);
          ctx.arc(px + 14, py, 20, 0, Math.PI * 2);
          ctx.arc(px, py - 10, 24, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vanilla Frosting Path with glowing pink edge
        drawPath('#ffffff', '#f472b6', true);

        // Draw sugar crystals & candy swirls
        sceneryElementsRef.current.forEach(el => {
          ctx.save();
          if (el.type === 'sugar_crystal') {
            const sparkle = Math.sin(now * 0.004 + el.x) * 0.35 + 0.65;
            ctx.fillStyle = el.color;
            ctx.globalAlpha = sparkle;
            ctx.beginPath();
            ctx.moveTo(el.x, el.y - el.size);
            ctx.lineTo(el.x + el.size * 0.7, el.y);
            ctx.lineTo(el.x, el.y + el.size);
            ctx.lineTo(el.x - el.size * 0.7, el.y);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = el.color;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.size * 0.45, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        });
      } else {
        // 🌸 Prato Fiorito (Meadow default)
        ctx.fillStyle = '#9fc4a5';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#94bc9a';
        for (let i = 0; i < 24; i++) {
          ctx.beginPath();
          const px = (i * 123) % width;
          const py = (i * 187 + 60) % height;
          ctx.ellipse(px, py, 35, 20, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        drawPath('#fbf0d9', '#eedcc0');

        sceneryElementsRef.current.forEach(fl => {
          ctx.save();
          ctx.fillStyle = fl.color;
          const pCount = fl.petalCount || 5;
          for (let p = 0; p < pCount; p++) {
            const angle = (p / pCount) * Math.PI * 2;
            const px = fl.x + Math.cos(angle) * (fl.size * 0.8);
            const py = fl.y + Math.sin(angle) * (fl.size * 0.8);
            ctx.beginPath();
            ctx.arc(px, py, fl.size * 0.55, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fff9ec';
          ctx.beginPath();
          ctx.arc(fl.x, fl.y, fl.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // D. Draw Delicious Food Treats for Ninni (Fish, Bones, Drumsticks, Cheese, Sausage, Carrots, Biscuits)
      biscuits.forEach(b => {
        if (!b.collected) {
          ctx.save();
          const bobbing = Math.sin(now * 0.003 + b.pulseOffset) * 3.5;
          const bx = b.x;
          const by = b.y + bobbing;

          // Soft radiant aura around treats
          ctx.shadowColor = 'rgba(255, 215, 0, 0.65)';
          ctx.shadowBlur = 10;

          const fType = b.foodType || 'osso';

          if (fType === 'pesce') {
            // 🐟 Pesciolino fresco (Turquoise fish with swimming tail & fin)
            const tailWiggle = Math.sin(now * 0.006 + b.pulseOffset) * 0.22;

            // Fish Body
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(bx - 1, by, 13, 7.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Fish Belly Shading
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.ellipse(bx - 1, by + 2.5, 10, 4, 0, 0, Math.PI);
            ctx.fill();

            // Fish Tail Fin with gentle wiggle
            ctx.fillStyle = '#0284c7';
            ctx.save();
            ctx.translate(bx + 11, by);
            ctx.rotate(tailWiggle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(8, -7);
            ctx.lineTo(5, 0);
            ctx.lineTo(8, 7);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Dorsal Fin
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(bx - 3, by - 7);
            ctx.lineTo(bx + 3, by - 9);
            ctx.lineTo(bx + 4, by - 6);
            ctx.closePath();
            ctx.fill();

            // Eye
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx - 8, by - 2, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(bx - 8.5, by - 2, 1.2, 0, Math.PI * 2);
            ctx.fill();

          } else if (fType === 'coscetta') {
            // 🍗 Coscetta di pollo arrosto (Crispy golden roast drumstick)
            // Roasted Meat Bulb
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.ellipse(bx - 3, by, 11, 8.5, -0.2, 0, Math.PI * 2);
            ctx.fill();

            // Crispy glaze highlight
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.ellipse(bx - 3, by - 1, 9, 6, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fde68a';
            ctx.beginPath();
            ctx.ellipse(bx - 5, by - 3, 4, 2, -0.2, 0, Math.PI * 2);
            ctx.fill();

            // White Bone Handle
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(bx + 7, by - 2.5, 9, 5, 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + 16, by - 3.5, 3, 0, Math.PI * 2);
            ctx.arc(bx + 16, by + 3.5, 3, 0, Math.PI * 2);
            ctx.fill();

          } else if (fType === 'formaggio') {
            // 🧀 Spicchio di formaggio svizzero (Swiss cheese wedge)
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(bx + 13, by - 8);
            ctx.lineTo(bx - 13, by);
            ctx.lineTo(bx + 13, by + 9);
            ctx.closePath();
            ctx.fill();

            // Cheese side edge
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.moveTo(bx + 13, by - 8);
            ctx.lineTo(bx + 13, by + 9);
            ctx.lineTo(bx + 9, by + 9);
            ctx.lineTo(bx + 9, by - 6);
            ctx.closePath();
            ctx.fill();

            // Holes
            ctx.fillStyle = '#ca8a04';
            ctx.beginPath();
            ctx.arc(bx + 4, by - 2, 2.5, 0, Math.PI * 2);
            ctx.arc(bx - 2, by + 3, 2, 0, Math.PI * 2);
            ctx.arc(bx + 7, by + 4, 1.8, 0, Math.PI * 2);
            ctx.fill();

          } else if (fType === 'salsiccia') {
            // 🌭 Salsicciotto appetitoso (Juicy reddish sausage)
            ctx.fillStyle = '#e11d48';
            ctx.beginPath();
            ctx.ellipse(bx, by, 13, 6, -0.15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#9f1239';
            ctx.beginPath();
            ctx.arc(bx - 12.5, by + 2, 2.5, 0, Math.PI * 2);
            ctx.arc(bx + 12.5, by - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#fda4af';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(bx, by - 2, 9, 0.2, Math.PI - 0.2);
            ctx.stroke();

          } else if (fType === 'carota') {
            // 🥕 Carotina croccante (Crisp orange carrot with leafy top)
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.moveTo(bx - 13, by);
            ctx.lineTo(bx + 8, by - 6);
            ctx.lineTo(bx + 8, by + 6);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#c2410c';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bx - 4, by - 3);
            ctx.lineTo(bx - 4, by + 3);
            ctx.moveTo(bx + 2, by - 4);
            ctx.lineTo(bx + 2, by + 4);
            ctx.stroke();

            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.ellipse(bx + 11, by - 3, 4, 2, 0.4, 0, Math.PI * 2);
            ctx.ellipse(bx + 12, by, 5, 2.2, 0, 0, Math.PI * 2);
            ctx.ellipse(bx + 11, by + 3, 4, 2, -0.4, 0, Math.PI * 2);
            ctx.fill();

          } else if (fType === 'biscotto') {
            // 🍪 Croccantino dorato (Crunchy dog biscuit)
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.arc(bx, by, 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#92400e';
            for (let d = 0; d < 5; d++) {
              const a = (d * Math.PI * 2) / 5;
              ctx.beginPath();
              ctx.arc(bx + Math.cos(a) * 4.5, by + Math.sin(a) * 4.5, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = '#fde68a';
            ctx.beginPath();
            ctx.arc(bx - 2, by - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();

          } else {
            // 🦴 Osso succulento classico (Classic white Bone)
            ctx.fillStyle = '#fffdf7';
            ctx.beginPath();
            ctx.roundRect(bx - 12, by - 3.8, 24, 7.6, 3.8);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(bx - 12, by - 4.5, 4.2, 0, Math.PI * 2);
            ctx.arc(bx - 12, by + 4.5, 4.2, 0, Math.PI * 2);
            ctx.arc(bx + 12, by - 4.5, 4.2, 0, Math.PI * 2);
            ctx.arc(bx + 12, by + 4.5, 4.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#e2d4b7';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx - 2, by - 1, 1.6, 0, Math.PI * 2);
            ctx.arc(bx + 3, by - 1, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      // E. Draw Cozy Soft Bed ("Cuccia" 🛏️)
      ctx.save();
      const bedX = bed.x;
      const bedY = bed.y;

      let bedRimColor = '#d97d64';
      let bedCushionColor = '#fff4e0';
      let bedBlanketColor = '#78a1bb';

      if (currentLand === 'mare') {
        bedRimColor = '#0891b2';
        bedCushionColor = '#fef3c7';
        bedBlanketColor = '#fb7185';
      } else if (currentLand === 'citta') {
        bedRimColor = '#334155';
        bedCushionColor = '#f8fafc';
        bedBlanketColor = '#eab308';
      } else if (currentLand === 'vulcano') {
        bedRimColor = '#7c2d12';
        bedCushionColor = '#fed7aa';
        bedBlanketColor = '#dc2626';
      } else if (currentLand === 'notte') {
        bedRimColor = '#581c87';
        bedCushionColor = '#ddd6fe';
        bedBlanketColor = '#38bdf8';
      } else if (currentLand === 'neve') {
        bedRimColor = '#1e3a8a';
        bedCushionColor = '#f8fafc';
        bedBlanketColor = '#ef4444';
      } else if (currentLand === 'autunno') {
        bedRimColor = '#78350f';
        bedCushionColor = '#fef3c7';
        bedBlanketColor = '#ea580c';
      } else if (currentLand === 'zen') {
        bedRimColor = '#065f46';
        bedCushionColor = '#ecfdf5';
        bedBlanketColor = '#f472b6';
      } else if (currentLand === 'deserto') {
        bedRimColor = '#9a3412';
        bedCushionColor = '#fffbeb';
        bedBlanketColor = '#0284c7';
      } else if (currentLand === 'dolcetti') {
        bedRimColor = '#db2777';
        bedCushionColor = '#fdf2f8';
        bedBlanketColor = '#c084fc';
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = bedRimColor;
      ctx.beginPath();
      ctx.ellipse(bedX, bedY, 36, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bed inner plush cushion
      ctx.fillStyle = bedCushionColor;
      ctx.beginPath();
      ctx.ellipse(bedX, bedY + 2, 28, 19, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute paw print in the bed center
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.beginPath();
      ctx.ellipse(bedX, bedY + 4, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.arc(bedX - 5, bedY - 1, 2.2, 0, Math.PI * 2);
      ctx.arc(bedX - 1.5, bedY - 3.5, 2.2, 0, Math.PI * 2);
      ctx.arc(bedX + 2.5, bedY - 3.5, 2.2, 0, Math.PI * 2);
      ctx.arc(bedX + 6, bedY - 1, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Bed blanket corner
      ctx.fillStyle = bedBlanketColor;
      ctx.beginPath();
      ctx.ellipse(bedX + 16, bedY - 3, 10, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // F. DRAW PROTAGONIST: "NINNI" 🐶 (Sweet Cartoon Pup)
      ctx.save();
      const nx = ninniPosRef.current.x;
      const ny = ninniPosRef.current.y;
      ctx.translate(nx, ny);

      // Facing orientation (flip left/right smoothly)
      const isFacingLeft = Math.cos(ninniAngleRef.current) < 0;
      if (isFacingLeft) {
        ctx.scale(-1, 1);
      }

      // Soft shadow under Ninni (sleeker outline)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.beginPath();
      ctx.ellipse(0, 14, 15, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body / Paws bobbing animation
      const walkBob = isWalkingRef.current ? Math.sin(ninniAnimFrameRef.current) * 2.2 : 0;
      const tailWag = tailWagRef.current;
      const headTilt = headTiltRef.current;

      // --- TAIL (Soffice coda completamente bianca, pelliccia snella / Sleek pure white tail) ---
      ctx.save();
      ctx.translate(-12, 1);
      ctx.rotate(tailWag - 0.4);
      // Sleeker white tail body (pelliccia meno folta, profilo slanciato)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-5, -5, 3.4, 8.8, -0.45, 0, Math.PI * 2);
      ctx.fill();
      // Refined white tip of tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6.6, -11, 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Soft gentle outline for crisp definition
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // --- LEGS / PAWS (Sleek legs & White front socks) ---
      const legOffset1 = isWalkingRef.current ? Math.sin(ninniAnimFrameRef.current) * 3.6 : 0;
      const legOffset2 = isWalkingRef.current ? -Math.sin(ninniAnimFrameRef.current) * 3.6 : 0;

      // Back paws (chestnut brown)
      ctx.fillStyle = '#7c3f1d';
      ctx.beginPath();
      ctx.ellipse(-6.5 + legOffset2, 10, 3.6, 4.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Front paws (creamy white)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(6.5 + legOffset1, 10, 3.6, 4.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // White socks tips
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-6.5 + legOffset2, 13.5, 3.4, 2.4, 0, 0, Math.PI * 2);
      ctx.ellipse(6.5 + legOffset1, 13.5, 3.4, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soft cute paw pads
      ctx.fillStyle = '#f2dec8';
      ctx.beginPath();
      ctx.arc(-6.5 + legOffset2, 14.4, 1.4, 0, Math.PI * 2);
      ctx.arc(6.5 + legOffset1, 14.4, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // --- BODY (Pelliccia meno folta, corpo agile e pulito / Sleeker trimmed fur coat) ---
      // Base white body (slender, trimmed fur contour)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 2.5 + walkBob, 13.6, 9.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute warm chocolate brown saddle patch on back (trimmed)
      ctx.fillStyle = '#7c3f1d';
      ctx.beginPath();
      ctx.ellipse(-3.2, 0.4 + walkBob, 7.2, 6.2, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Soft white chest patch
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(5.2, 3.2 + walkBob, 5.6, 6.6, 0.12, 0, Math.PI * 2);
      ctx.fill();

      // --- HEAD & FACE (Trimmed fur, cute proportioned puppy face) ---
      ctx.save();
      ctx.translate(5, -7 + walkBob);
      ctx.rotate(headTilt);

      // White head base (trimmed, less bulky)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Iconic warm brown puppy patch over right eye & brow
      ctx.fillStyle = '#7c3f1d';
      ctx.beginPath();
      ctx.ellipse(2.5, -2.5, 6.2, 5.8, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Clean white muzzle (sleek, not over-puffed)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(4.2, 3.2, 6.4, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shiny cute black button nose
      ctx.fillStyle = '#1e1e1e';
      ctx.beginPath();
      ctx.ellipse(6.8, 1.8, 2.4, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Nose glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6.4, 1.2, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Cute big expressive eyes
      ctx.fillStyle = '#1a1614';
      ctx.beginPath();
      // Right eye (front, sitting sweetly on the brown patch)
      ctx.arc(2.5, -1.8, 2.6, 0, Math.PI * 2);
      // Left eye (back, on white fur)
      ctx.arc(-3.5, -1.8, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights (twinkle)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3.2, -2.5, 1, 0, Math.PI * 2);
      ctx.arc(-2.8, -2.5, 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Sweet blushing cheeks
      ctx.fillStyle = 'rgba(255, 138, 148, 0.55)';
      ctx.beginPath();
      ctx.ellipse(4.2, 4.8, 2.4, 1.6, 0, 0, Math.PI * 2);
      ctx.ellipse(-3.2, 3.2, 2, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floppy Brown Ears (sleek & trimmed floppy ears)
      // Front ear (chestnut brown)
      ctx.fillStyle = '#7c3f1d';
      ctx.beginPath();
      ctx.ellipse(1, -7.5, 3.8, 9, 0.32, 0, Math.PI * 2);
      ctx.fill();
      // Back ear (deep espresso brown for depth)
      ctx.fillStyle = '#5c2d12';
      ctx.beginPath();
      ctx.ellipse(-7.5, -6, 3.4, 8.2, -0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end head

      ctx.restore(); // end Ninni

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initLevel, rescaleLevel]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#9fc4a5] flex flex-col select-none touch-none overflow-hidden"
      style={{ height: '100vh', touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      {/* Top Header Bar matching CalmWorld Minigames style */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-3 sm:p-4 pt-4 sm:pt-5 pointer-events-none">
        <div className="w-8 sm:w-9" /> {/* Spacer balancing X on right */}

        {/* Centered Pill with Title and Rules */}
        <div className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-3.5 sm:px-4 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-md">
          <h2 className="text-[#154326] dark:text-[#e4f5ea] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] whitespace-nowrap drop-shadow-xs">
            Passo dopo Passo
          </h2>
          <button
            onClick={() => setShowRules(true)}
            className="p-1 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 active:scale-95 transition-all rounded-full hover:bg-emerald-100/70 cursor-pointer"
            title="Regole del gioco"
            aria-label="Regole del gioco"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </button>
        </div>

        {/* Exit Button positioned at top-right */}
        <button
          onClick={onClose}
          className="pointer-events-auto p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
          aria-label="Esci dal gioco"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        onPointerDown={handleTouchStart}
        onPointerMove={handleTouchMove}
        onPointerUp={handleTouchEnd}
        onPointerCancel={handleTouchEnd}
      />

      {/* Floating Gentle Status: Biscuit counter, Landscape & Gyroscope */}
      <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 flex flex-nowrap justify-between items-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 pointer-events-none w-full">
        {/* Left: Biscuit counter & Landscape Button */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 min-w-0 shrink">
          {/* Food treats counter badge */}
          <div className="bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-amber-900 shrink-0 whitespace-nowrap" title="Premietti raccolti: ossa, pesci, coscette, formaggio e snack!">
            <span className="text-sm sm:text-base leading-none">🍖</span>
            <span>
              Cibo: {biscuitCount} / {totalBiscuits}
            </span>
          </div>

          {/* Landscape Selector Button */}
          <button
            onClick={() => setShowLandscapeModal(true)}
            className="bg-white/95 hover:bg-white active:scale-95 text-slate-800 text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm flex items-center gap-1 sm:gap-1.5 cursor-pointer backdrop-blur-md transition-all group shrink min-w-0 whitespace-nowrap"
            title={isRandomLandscape ? 'Modalità Casuale attiva (cambia ad ogni partita) - Clicca per scegliere' : 'Scegli Paesaggio'}
          >
            {isRandomLandscape && (
              <span className="text-[11px] leading-none shrink-0" title="Scenari casuali attivi">
                🎲
              </span>
            )}
            <span className="text-sm leading-none shrink-0">{currentLandscapeConfig.icon}</span>
            <span className="font-['Quicksand'] max-w-[65px] xs:max-w-[100px] sm:max-w-none truncate">
              {currentLandscapeConfig.name}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold group-hover:translate-y-0.5 transition-transform shrink-0">
              ▼
            </span>
          </button>

          {/* Randomizer Shuffle Button */}
          <button
            onClick={pickRandomLandscape}
            className="p-1.5 bg-white/90 hover:bg-white active:scale-90 text-amber-600 hover:text-amber-700 rounded-full border border-amber-200 shadow-xs cursor-pointer backdrop-blur-md transition-all flex items-center justify-center shrink-0"
            title="Cambia scenario a caso ora 🎲"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Gyroscope control & Quick Calibration */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
          {/* Gyroscope toggle / permission prompt */}
          {gyroSupported && (
            <div className="shrink-0 flex items-center gap-1.5">
              {needsPermission ? (
                <button
                  onClick={requestGyroPermission}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  title="Consenti al giroscopio di guidare Ninni inclinando lo smartphone"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Consenti Giroscopio</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setGyroActive(prev => {
                        const next = !prev;
                        if (next) {
                          baseOrientationRef.current = null;
                        }
                        return next;
                      });
                      soundManager.playTick();
                    }}
                    className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                      gyroActive
                        ? 'bg-emerald-700 text-white border border-emerald-400 ring-2 ring-emerald-300/40 shadow-sm'
                        : 'bg-white/85 text-slate-700 hover:bg-white border border-slate-200'
                    }`}
                    title={gyroActive ? 'Giroscopio attivo: inclina lo smartphone per guidare Ninni' : 'Attiva Giroscopio'}
                  >
                    <Compass className={`w-3.5 h-3.5 shrink-0 ${gyroActive ? 'text-emerald-200' : 'text-slate-600'}`} />
                    <span>{gyroActive ? 'Giroscopio ON' : 'Giroscopio'}</span>
                  </button>

                  {/* Pulsante Centra Posizione: azzera la postura neutra dello smartphone */}
                  {gyroActive && (
                    <button
                      onClick={recalibrateGyro}
                      className="bg-white/90 hover:bg-white active:scale-95 text-emerald-800 border border-emerald-300 text-[10px] sm:text-[11px] font-black px-2.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                      title="Centra la posizione neutra con l'angolazione attuale del telefono"
                    >
                      <span>📍 Centra</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recalibration Toast Feedback */}
      <AnimatePresence>
        {recalibrateToast && (
          <motion.div
            key="ninni-recalibrate-toast"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="absolute top-28 sm:top-32 left-0 right-0 z-30 flex justify-center pointer-events-none"
          >
            <div className="bg-emerald-800 text-white px-3.5 py-1.5 rounded-full shadow-lg text-[11px] font-extrabold flex items-center gap-1.5 border border-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Posizione neutra centrata! ✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anti-Agitation Interruption Overlay (Sweet, Empathetic Calm Pause) */}
      <AnimatePresence>
        {isAgitated && (
          <motion.div
            key="ninni-agitated-overlay"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute top-1/3 left-6 right-6 z-30 pointer-events-none flex justify-center"
          >
            <div className="bg-[#fffbf0]/95 backdrop-blur-lg border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-2xl text-center max-w-sm flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-inner animate-bounce">
                🐾
              </div>
              <h4 className="font-extrabold text-amber-950 text-sm sm:text-base font-['Quicksand']">
                Ninni fa una pausa...
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-amber-900/90 leading-relaxed">
                {agitationMessage ||
                  'Fai un respiro profondo... e goditi la passeggiata con Ninni 🌸'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-100/70 px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Rilassa le spalle e respira con calma</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch / Desktop Navigation Hint at Bottom */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-20 pointer-events-none flex justify-center px-2">
        <p className="text-[10px] sm:text-xs font-semibold text-emerald-950/80 bg-white/70 backdrop-blur-md py-1 px-3 sm:px-4 rounded-full border border-white/60 shadow-xs whitespace-nowrap">
          {gyroActive
            ? 'Inclina lo smartphone per guidare Ninni lungo il sentiero 🌿'
            : 'Tocca o trascina con il dito per guidare Ninni 🌿'}
        </p>
      </div>

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {isVictory && (
          <motion.div
            key="ninni-victory-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="calm-white-card border-2 border-emerald-200 dark:border-emerald-800 p-5 sm:p-6 rounded-3xl max-w-sm sm:max-w-md w-full text-center space-y-3.5 shadow-2xl"
            >
              {NINNI_TRAGUARDO_IMAGE ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl overflow-hidden border-2 border-emerald-300 shadow-md bg-white">
                  <img
                    src={NINNI_TRAGUARDO_IMAGE}
                    alt="Ninni al traguardo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-center text-4xl shadow-md animate-pulse">
                  🦴🛏️
                </div>
              )}

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100 font-['Quicksand'] whitespace-nowrap">
                  Ninni è al sicuro nella sua cuccia!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  Ottimo lavoro! Ti sei preso cura del tuo respiro e di Ninni. Il tuo corpo ha rallentato e la mente ha ritrovato stabilità.
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span>🦴🐟🍗 Tutti i {totalBiscuits} bocconcini e cibi raccolti!</span>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => initLevel(true)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Gioca di nuovo con Ninni 🐾
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Torna al mondo calmo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules / Explanation Modal */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-emerald-200 dark:border-emerald-800 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-emerald-950 dark:text-emerald-200 font-black text-lg font-['Quicksand']">
                Passo dopo Passo con Ninni
              </h3>
              <button
                onClick={() => setShowRules(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                Nei momenti di tensione, le mani e i muscoli si muovono a scatti. Questo gioco allena la <strong>calma motoria</strong> e la coordinazione lenta.
              </p>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                  Passeggiata in Armonia:
                </span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                  Guida Ninni con movimenti fluidi e naturali, lasciandoti cullare dai suoni della natura e dai paesaggi.
                </p>
              </div>

              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                  Come si gioca:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                  <li>Raccogli tutti i bocconcini 🦴🐟🍗 e guida Ninni fino alla cuccia.</li>
                  <li>Scorri dolcemente con il dito o inclina lo smartphone.</li>
                  <li>Nessun timer né fretta: goditi il passo tranquillo del tuo fedele amico.</li>
                  <li>50 percorsi rilassanti e 10 paesaggi naturali che cambiano con dolcezza.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}

      {/* Landscape Selection Modal */}
      {showLandscapeModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-5 z-[80] animate-fadeIn"
          onClick={() => setShowLandscapeModal(false)}
        >
          <div
            className="bg-white dark:bg-[#162236] border border-emerald-100 dark:border-emerald-800/60 p-4 sm:p-5 rounded-3xl w-full max-w-md text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl max-h-[88vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-['Quicksand']">
                    Paesaggi di Ninni
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Scegli dove far passeggiare Ninni
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLandscapeModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Random Mode Toggle Banner */}
            <button
              onClick={() => {
                enableRandomLandscape();
                setShowLandscapeModal(false);
              }}
              className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 shrink-0 ${
                isRandomLandscape
                  ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-amber-500/15 border-emerald-500 ring-2 ring-emerald-500/70 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl p-1 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                  🎲
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white font-['Quicksand']">
                      Scenari Casuali ad ogni partita
                    </span>
                    {isRandomLandscape && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                        Attivo ✨
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Ninni cambia mondo (mare, città, vulcano, neve...) a sorpresa ad ogni nuovo livello!
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {isRandomLandscape ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Attiva
                  </span>
                )}
              </div>
            </button>

            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1 shrink-0 flex items-center gap-2">
              <span className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span>Oppure fissa uno scenario</span>
              <span className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Landscape Grid (Scrollable) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 overflow-y-auto p-1 pr-1.5 max-h-[46vh]">
              {LANDSCAPES.map(item => {
                const isSelected = landscape === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      switchLandscape(item.id);
                      setShowLandscapeModal(false);
                    }}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer outline-hidden relative group active:scale-[0.98] ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/80 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-600 bg-slate-50/60 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-2xl sm:text-3xl">{item.icon}</span>
                      {isSelected ? (
                        <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <div
                          className="w-3 h-3 rounded-full opacity-60 group-hover:scale-125 transition-transform"
                          style={{ backgroundColor: item.themeColor }}
                        />
                      )}
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white font-['Quicksand'] leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
                      {item.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer with Random Surprise and Close */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 shrink-0">
              <button
                onClick={() => {
                  const others = LANDSCAPES.filter(l => l.id !== landscape);
                  const randomPick = others[Math.floor(Math.random() * others.length)];
                  if (randomPick) {
                    switchLandscape(randomPick.id);
                    setShowLandscapeModal(false);
                  }
                }}
                className="flex-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>🎲</span>
                <span>Sorprendimi!</span>
              </button>
              <button
                onClick={() => setShowLandscapeModal(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Continua 🐾
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
