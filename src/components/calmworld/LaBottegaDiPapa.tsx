import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Lightbulb, RotateCcw, Sparkles, Check, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/sound';
import { PAPA_CUSTOM_IMAGE } from '../../assets/minigames';

// ----------------------------------------------------
// 12 CRAFTABLE WOODWORK ITEMS (TABLES, CHAIRS, FURNITURE)
// ----------------------------------------------------
export interface WoodPart {
  id: string;
  name: string;
  slotX: number; // relative % within assembly board
  slotY: number; // relative % within assembly board
  width: number;
  height: number;
  color: string;
  accentColor: string;
}

export interface WoodItem {
  id: string;
  name: string;
  category: 'sgabello' | 'tavolo' | 'sedia' | 'mobile';
  woodType: string;
  description: string;
  roughColor: string;
  smoothColor: string;
  polishedColor: string;
  grainColor: string;
  roughShapeRadius: string;
  parts: WoodPart[];
}

export const WOOD_ITEMS: WoodItem[] = [
  {
    id: 'sgabello_tre_gambe',
    name: 'Sgabello Rustico a Tre Gambe',
    category: 'sgabello',
    woodType: 'Rovere Chiaro delle Alpi',
    description: 'Un classico senza tempo: tre gambe tornite a incastro conico, solido e confortevole.',
    roughColor: '#b08968',
    smoothColor: '#d4a373',
    polishedColor: '#e9c46a',
    grainColor: '#8a5a36',
    roughShapeRadius: 'rounded-full',
    parts: [
      { id: 'gamba_1', name: 'Gamba Sinistra', slotX: 25, slotY: 72, width: 14, height: 46, color: '#b08968', accentColor: '#8a5a36' },
      { id: 'gamba_2', name: 'Gamba Centrale', slotX: 50, slotY: 78, width: 14, height: 46, color: '#b08968', accentColor: '#8a5a36' },
      { id: 'gamba_3', name: 'Gamba Destra', slotX: 75, slotY: 72, width: 14, height: 46, color: '#b08968', accentColor: '#8a5a36' },
    ]
  },
  {
    id: 'tavolino_te_provenzale',
    name: 'Tavolino da Tè Provenzale',
    category: 'tavolo',
    woodType: 'Noce Biondo Antico',
    description: 'Piano rotondo con gambe a sciabola e crociera di rinforzo per le tisane della sera.',
    roughColor: '#a98467',
    smoothColor: '#c9a227',
    polishedColor: '#f4a261',
    grainColor: '#6f4e37',
    roughShapeRadius: 'rounded-full',
    parts: [
      { id: 'gamba_sn', name: 'Gamba Anteriore Sx', slotX: 22, slotY: 70, width: 13, height: 50, color: '#9c6644', accentColor: '#7f4f24' },
      { id: 'gamba_dx', name: 'Gamba Anteriore Dx', slotX: 78, slotY: 70, width: 13, height: 50, color: '#9c6644', accentColor: '#7f4f24' },
      { id: 'crociera', name: 'Crociera Centrale', slotX: 50, slotY: 62, width: 44, height: 10, color: '#b08968', accentColor: '#8a5a36' },
    ]
  },
  {
    id: 'sedia_pioli_selvatica',
    name: 'Sedia Rustica a Pioli',
    category: 'sedia',
    woodType: 'Ciliegio Selvatico',
    description: 'Schienale ergonomico curvato a vapore e montanti verticali incastrati a caldo.',
    roughColor: '#9c6644',
    smoothColor: '#bc6c25',
    polishedColor: '#dd9b5d',
    grainColor: '#6f3b19',
    roughShapeRadius: 'rounded-2xl',
    parts: [
      { id: 'spalliera', name: 'Spalliera a Pioli', slotX: 50, slotY: 18, width: 62, height: 38, color: '#9c6644', accentColor: '#7f4f24' },
      { id: 'gamba_post', name: 'Gamba Posteriore', slotX: 28, slotY: 74, width: 12, height: 48, color: '#8a5a36', accentColor: '#6f3b19' },
      { id: 'gamba_ant', name: 'Gamba Anteriore', slotX: 72, slotY: 74, width: 12, height: 48, color: '#8a5a36', accentColor: '#6f3b19' },
      { id: 'traversa_sedia', name: 'Traversa di Battuta', slotX: 50, slotY: 66, width: 44, height: 10, color: '#b08968', accentColor: '#8a5a36' },
    ]
  },
  {
    id: 'comodino_cassetto',
    name: 'Comodino Artigianale con Cassetto',
    category: 'mobile',
    woodType: 'Olivo Dorato',
    description: 'Giunzioni a coda di rondine, cassetto scorrevole su guide in faggio e pomello in ottone.',
    roughColor: '#bfa181',
    smoothColor: '#dda15e',
    polishedColor: '#f7c59f',
    grainColor: '#7d5a3c',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'cassetto', name: 'Cassetto a Rondine', slotX: 50, slotY: 38, width: 56, height: 24, color: '#c9a227', accentColor: '#9c6644' },
      { id: 'pomello', name: 'Pomello in Ottone', slotX: 50, slotY: 38, width: 12, height: 12, color: '#e9c46a', accentColor: '#b38a2e' },
      { id: 'vano_giorno', name: 'Ripiano a Giorno', slotX: 50, slotY: 62, width: 58, height: 14, color: '#bfa181', accentColor: '#7d5a3c' },
      { id: 'piedini', name: 'Piedini Sagomati', slotX: 50, slotY: 84, width: 64, height: 16, color: '#8a5a36', accentColor: '#654321' },
    ]
  },
  {
    id: 'panca_ingresso',
    name: 'Panca da Ingresso Rustica',
    category: 'sedia',
    woodType: 'Castagno dei Boschi',
    description: 'Una seduta spessa e accogliente con gambe a cavalletto, per togliere le scarpe in pace.',
    roughColor: '#8d5b4c',
    smoothColor: '#b06d53',
    polishedColor: '#d68c68',
    grainColor: '#5c382b',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'cavalletto_1', name: 'Cavalletto Sinistro', slotX: 24, slotY: 68, width: 18, height: 42, color: '#7c4a3a', accentColor: '#5a3022' },
      { id: 'traversa', name: 'Traversa Longitudinale', slotX: 50, slotY: 66, width: 48, height: 12, color: '#a0654e', accentColor: '#6b3e2c' },
      { id: 'cavalletto_2', name: 'Cavalletto Destro', slotX: 76, slotY: 68, width: 18, height: 42, color: '#7c4a3a', accentColor: '#5a3022' },
      { id: 'doghe_seduta', name: 'Listello di Rinforzo', slotX: 50, slotY: 34, width: 68, height: 14, color: '#8d5b4c', accentColor: '#5c382b' },
    ]
  },
  {
    id: 'tavolo_pranzo_frassino',
    name: 'Tavolo Rettangolare da Pranzo',
    category: 'tavolo',
    woodType: 'Frassino Naturale',
    description: 'Ampio piano a doghe unite a filo, con telaio portante massiccio e angoli smussati.',
    roughColor: '#d0b49f',
    smoothColor: '#e4c9b0',
    polishedColor: '#faedcd',
    grainColor: '#a47e65',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'gamba_a', name: 'Gamba Squadrata Nord', slotX: 20, slotY: 72, width: 14, height: 48, color: '#b99b82', accentColor: '#93735b' },
      { id: 'telaio', name: 'Telaio Portante', slotX: 50, slotY: 55, width: 66, height: 14, color: '#caa589', accentColor: '#9e795d' },
      { id: 'gamba_b', name: 'Gamba Squadrata Sud', slotX: 80, slotY: 72, width: 14, height: 48, color: '#b99b82', accentColor: '#93735b' },
      { id: 'rinforzo_centro', name: 'Tirante Centrale', slotX: 50, slotY: 70, width: 46, height: 10, color: '#a47e65', accentColor: '#845e45' },
    ]
  },
  {
    id: 'cassapanca_pino_cembro',
    name: 'Cassapanca Tradizionale Tirolese',
    category: 'mobile',
    woodType: 'Pino Cembro Aromatico',
    description: 'Diffonde nell’aria un profumo resinoso e balsamico, con coperchio a baule protettivo.',
    roughColor: '#d6a267',
    smoothColor: '#e7bc85',
    polishedColor: '#f9dcc4',
    grainColor: '#ab753a',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'coperchio', name: 'Coperchio Ribaltabile', slotX: 50, slotY: 22, width: 72, height: 20, color: '#c99355', accentColor: '#9c6628' },
      { id: 'cerniera_1', name: 'Cerniera Ferro Battuto Sx', slotX: 30, slotY: 26, width: 10, height: 14, color: '#4a4e69', accentColor: '#22223b' },
      { id: 'cerniera_2', name: 'Cerniera Ferro Battuto Dx', slotX: 70, slotY: 26, width: 10, height: 14, color: '#4a4e69', accentColor: '#22223b' },
      { id: 'serratura_scatto', name: 'Bocchetta della Serratura', slotX: 50, slotY: 48, width: 14, height: 16, color: '#b38a2e', accentColor: '#876020' },
      { id: 'piedi_cipolla', name: 'Piedini a Cipolla', slotX: 50, slotY: 82, width: 68, height: 16, color: '#ab753a', accentColor: '#7d5225' },
    ]
  },
  {
    id: 'poltroncina_dondolo',
    name: 'Poltroncina a Dondolo Curvata',
    category: 'sedia',
    woodType: 'Faggio Gentile Piegato a Vapore',
    description: 'Linee morbide e avvolgenti con pattini ad arco per cullare i pensieri della sera.',
    roughColor: '#c49a6c',
    smoothColor: '#dcab79',
    polishedColor: '#f3c28c',
    grainColor: '#916b41',
    roughShapeRadius: 'rounded-3xl',
    parts: [
      { id: 'schienale_arco', name: 'Schienale ad Arco', slotX: 50, slotY: 18, width: 58, height: 38, color: '#b08456', accentColor: '#855d32' },
      { id: 'bracciolo_legno', name: 'Bracciolo Raccordato', slotX: 50, slotY: 48, width: 66, height: 14, color: '#dcab79', accentColor: '#916b41' },
      { id: 'pattino_sn', name: 'Pattino Curvo Sx', slotX: 26, slotY: 82, width: 36, height: 16, color: '#916b41', accentColor: '#6a4a25' },
      { id: 'pattino_dx', name: 'Pattino Curvo Dx', slotX: 74, slotY: 82, width: 36, height: 16, color: '#916b41', accentColor: '#6a4a25' },
    ]
  },
  {
    id: 'libreria_scala',
    name: 'Libreria a Scala da Bottega',
    category: 'mobile',
    woodType: 'Mogano Mielato',
    description: 'Ripiani orizzontali incastrati a maschio e femmina, per accogliere libri e ricordi preziosi.',
    roughColor: '#8a4b38',
    smoothColor: '#a85d45',
    polishedColor: '#c77d63',
    grainColor: '#5e2f21',
    roughShapeRadius: 'rounded-lg',
    parts: [
      { id: 'montante_sx', name: 'Montante Laterale Sx', slotX: 18, slotY: 50, width: 12, height: 68, color: '#7a3b28', accentColor: '#4e2015' },
      { id: 'montante_dx', name: 'Montante Laterale Dx', slotX: 82, slotY: 50, width: 12, height: 68, color: '#7a3b28', accentColor: '#4e2015' },
      { id: 'ripiano_alto', name: 'Ripiano Superiore', slotX: 50, slotY: 26, width: 52, height: 14, color: '#96523e', accentColor: '#6c3525' },
      { id: 'ripiano_medio', name: 'Ripiano Centrale', slotX: 50, slotY: 52, width: 58, height: 14, color: '#96523e', accentColor: '#6c3525' },
      { id: 'ripiano_basso', name: 'Ripiano Inferiore', slotX: 50, slotY: 78, width: 64, height: 14, color: '#96523e', accentColor: '#6c3525' },
    ]
  },
  {
    id: 'madia_credenza',
    name: 'Madia Contadina con Bugne',
    category: 'mobile',
    woodType: 'Acero di Montagna',
    description: 'Due ante a battente con pannello bugnato per custodire il pane appena sfornato.',
    roughColor: '#d5bdaf',
    smoothColor: '#e3d5ca',
    polishedColor: '#f5ebe0',
    grainColor: '#a68a7a',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'cornice_cima', name: 'Cornice Modanata', slotX: 50, slotY: 16, width: 78, height: 16, color: '#b59d8c', accentColor: '#8c7060' },
      { id: 'anta_sn', name: 'Anta Sinistra Bugnata', slotX: 30, slotY: 48, width: 30, height: 42, color: '#c4ad9d', accentColor: '#967d6d' },
      { id: 'anta_dx', name: 'Anta Destra Bugnata', slotX: 70, slotY: 48, width: 30, height: 42, color: '#c4ad9d', accentColor: '#967d6d' },
      { id: 'chiavistello', name: 'Catenaccio in Ferro', slotX: 50, slotY: 48, width: 12, height: 14, color: '#52525b', accentColor: '#27272a' },
      { id: 'piedi_torniti', name: 'Piedi Torniti a Masello', slotX: 50, slotY: 82, width: 68, height: 16, color: '#967d6d', accentColor: '#6e5648' },
    ]
  },
  {
    id: 'consolle_mezzaluna',
    name: 'Consolle a Mezzaluna da Parete',
    category: 'tavolo',
    woodType: 'Larice Alpino',
    description: 'Profilo semicircolare leggero ed elegante, rifinito con intagli manuali a scalpello.',
    roughColor: '#bfa58a',
    smoothColor: '#d6be9f',
    polishedColor: '#ead7c0',
    grainColor: '#8f7358',
    roughShapeRadius: 'rounded-t-full',
    parts: [
      { id: 'cornice_sotto', name: 'Sotto-piano Modanato', slotX: 50, slotY: 34, width: 64, height: 14, color: '#bfa58a', accentColor: '#8f7358' },
      { id: 'colonna_centrale', name: 'Colonna a Tripode', slotX: 50, slotY: 66, width: 18, height: 46, color: '#a68b70', accentColor: '#7a5e44' },
      { id: 'mensola_sotto', name: 'Traversa d’Appoggio', slotX: 50, slotY: 52, width: 44, height: 12, color: '#bfa58a', accentColor: '#8f7358' },
      { id: 'zampina', name: 'Piede a Zampina', slotX: 50, slotY: 84, width: 36, height: 14, color: '#8f7358', accentColor: '#6b5038' },
    ]
  },
  {
    id: 'bauletto_ricordi',
    name: 'Bauletto Intarsiato dei Ricordi',
    category: 'mobile',
    woodType: 'Cedro Profumato Libanese',
    description: 'Cofanetto compatto con coperchio a botte e chiusura in bronzo satinato.',
    roughColor: '#ab7042',
    smoothColor: '#c78853',
    polishedColor: '#e0a16b',
    grainColor: '#784621',
    roughShapeRadius: 'rounded-2xl',
    parts: [
      { id: 'cupola_coperchio', name: 'Coperchio a Volta', slotX: 50, slotY: 24, width: 68, height: 24, color: '#9c6235', accentColor: '#6e401d' },
      { id: 'maniglia_top', name: 'Maniglia d’Ottone', slotX: 50, slotY: 14, width: 22, height: 10, color: '#d4af37', accentColor: '#aa8c2c' },
      { id: 'serratura_bronzo', name: 'Serratura in Bronzo', slotX: 50, slotY: 48, width: 14, height: 16, color: '#c99a4e', accentColor: '#876020' },
      { id: 'piedini_angolari', name: 'Piedini a Zampa', slotX: 50, slotY: 82, width: 72, height: 14, color: '#784621', accentColor: '#522c0f' },
    ]
  },
  // ==========================================
  // NUOVI MOBILI COMPLESSI (FINO A 7 PEZZI)
  // ==========================================
  {
    id: 'cassettiera_sette_pezzi',
    name: 'Cassettiera Monviso a Tre Livelli',
    category: 'mobile',
    woodType: 'Noce Canaletto Massello',
    description: 'Un mobile d’eccezione a 7 pezzi: tre cassetti scorniciati con guide in pero e basamento solido.',
    roughColor: '#8c5a3c',
    smoothColor: '#a7704e',
    polishedColor: '#c48b68',
    grainColor: '#5c3822',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'top_scanalato', name: 'Piano Top Scanalato', slotX: 50, slotY: 15, width: 76, height: 14, color: '#7a4628', accentColor: '#542e18' },
      { id: 'cassetto_alto', name: 'Cassetto Superiore', slotX: 50, slotY: 30, width: 62, height: 14, color: '#a7704e', accentColor: '#7a4628' },
      { id: 'pomello_alto', name: 'Pomelli in Bronzo Sup.', slotX: 50, slotY: 30, width: 24, height: 8, color: '#d4af37', accentColor: '#aa8c2c' },
      { id: 'cassetto_medio', name: 'Cassetto Centrale', slotX: 50, slotY: 48, width: 62, height: 14, color: '#a7704e', accentColor: '#7a4628' },
      { id: 'cassetto_basso', name: 'Cassetto Profondo', slotX: 50, slotY: 66, width: 62, height: 14, color: '#a7704e', accentColor: '#7a4628' },
      { id: 'pomello_basso', name: 'Pomelli in Bronzo Inf.', slotX: 50, slotY: 66, width: 24, height: 8, color: '#d4af37', accentColor: '#aa8c2c' },
      { id: 'zoccolo_base', name: 'Zoccolo Portante', slotX: 50, slotY: 84, width: 72, height: 16, color: '#5c3822', accentColor: '#3d2414' },
    ]
  },
  {
    id: 'armadio_guardaroba_alpino',
    name: 'Armadio Guardaroba Tradizionale',
    category: 'mobile',
    woodType: 'Abete Bianco Masellato',
    description: 'Imponente armadio valligiano a 7 pezzi con ante diamantate, serratura a battente e cassetto inferiore.',
    roughColor: '#c8a882',
    smoothColor: '#deb887',
    polishedColor: '#f5deb3',
    grainColor: '#966f44',
    roughShapeRadius: 'rounded-lg',
    parts: [
      { id: 'cappello_sagomato', name: 'Cornice a Cappello', slotX: 50, slotY: 14, width: 80, height: 16, color: '#af8356', accentColor: '#78532f' },
      { id: 'anta_sinistra', name: 'Anta Diamantata Sx', slotX: 30, slotY: 44, width: 28, height: 42, color: '#deb887', accentColor: '#966f44' },
      { id: 'anta_destra', name: 'Anta Diamantata Dx', slotX: 70, slotY: 44, width: 28, height: 42, color: '#deb887', accentColor: '#966f44' },
      { id: 'cerniera_ferro', name: 'Bandelle in Ferro Sx/Dx', slotX: 50, slotY: 44, width: 64, height: 8, color: '#3f3f46', accentColor: '#18181b' },
      { id: 'serratura_chiave', name: 'Bocchetta con Chiave', slotX: 50, slotY: 44, width: 12, height: 16, color: '#b38a2e', accentColor: '#715418' },
      { id: 'cassettone_base', name: 'Cassettone Biancheria', slotX: 50, slotY: 72, width: 66, height: 14, color: '#c8a882', accentColor: '#8a6239' },
      { id: 'piedi_zoccolo', name: 'Basamento a Zoccolo', slotX: 50, slotY: 86, width: 74, height: 14, color: '#78532f', accentColor: '#53381e' },
    ]
  },
  {
    id: 'scrivania_ebanista',
    name: 'Scrivania dello Scrittore Artigiano',
    category: 'tavolo',
    woodType: 'Faggio Rustico Evaporato',
    description: 'Scrittoio ergonomico a 6 pezzi con sottomano rifinito, alzatina portapenne e doppio cassetto simmetrico.',
    roughColor: '#b5835a',
    smoothColor: '#cc9966',
    polishedColor: '#e6b885',
    grainColor: '#855632',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'alzatina_top', name: 'Alzatina con Vani', slotX: 50, slotY: 20, width: 68, height: 16, color: '#9c6644', accentColor: '#6f3b19' },
      { id: 'piano_scrittoio', name: 'Piano con Modanatura', slotX: 50, slotY: 38, width: 78, height: 16, color: '#cc9966', accentColor: '#855632' },
      { id: 'cassetto_sx', name: 'Cassetto Lettere Sx', slotX: 30, slotY: 54, width: 26, height: 16, color: '#b5835a', accentColor: '#7a4a25' },
      { id: 'cassetto_dx', name: 'Cassetto Calamaio Dx', slotX: 70, slotY: 54, width: 26, height: 16, color: '#b5835a', accentColor: '#7a4a25' },
      { id: 'gambe_tornite', name: 'Gambe a Torciglione', slotX: 50, slotY: 76, width: 64, height: 32, color: '#855632', accentColor: '#5c351b' },
      { id: 'traversa_piede', name: 'Traversa Poggiapiedi', slotX: 50, slotY: 84, width: 42, height: 10, color: '#5c351b', accentColor: '#3a1f0d' },
    ]
  },
  {
    id: 'credenza_vetrina',
    name: 'Credenza Vetrina Rustica',
    category: 'mobile',
    woodType: 'Tiglio Naturale Intagliato',
    description: 'Splendida madia a 6 pezzi con ante a riquadri trasparenti per esporre le ceramiche dipinte.',
    roughColor: '#c79c6e',
    smoothColor: '#dfb78c',
    polishedColor: '#f7d3ab',
    grainColor: '#936a41',
    roughShapeRadius: 'rounded-lg',
    parts: [
      { id: 'cimasa_timpano', name: 'Cimasa a Timpano', slotX: 50, slotY: 15, width: 72, height: 16, color: '#af8151', accentColor: '#79532e' },
      { id: 'vetro_anta_sx', name: 'Anta Vetrata Sx', slotX: 30, slotY: 42, width: 28, height: 38, color: '#e0f2fe', accentColor: '#7dd3fc' },
      { id: 'vetro_anta_dx', name: 'Anta Vetrata Dx', slotX: 70, slotY: 42, width: 28, height: 38, color: '#e0f2fe', accentColor: '#7dd3fc' },
      { id: 'ripiano_cristalli', name: 'Ripiano Espositivo', slotX: 50, slotY: 42, width: 66, height: 12, color: '#af8151', accentColor: '#79532e' },
      { id: 'fascia_cassetti', name: 'Doppio Cassetto Posate', slotX: 50, slotY: 66, width: 68, height: 16, color: '#c79c6e', accentColor: '#885c34' },
      { id: 'zoccolo_battiscopa', name: 'Zoccolo Sagomato', slotX: 50, slotY: 84, width: 72, height: 16, color: '#79532e', accentColor: '#4d3219' },
    ]
  },
  {
    id: 'culla_dondolo_alpina',
    name: 'Culla Tradizionale a Dondolo',
    category: 'sedia',
    woodType: 'Cirmolo dei Walser',
    description: 'Dolce culla intagliata a 5 pezzi con intagli a rosetta e pattini arcuati per un sonno sereno.',
    roughColor: '#d19b67',
    smoothColor: '#e9b583',
    polishedColor: '#ffd3a3',
    grainColor: '#9c6533',
    roughShapeRadius: 'rounded-3xl',
    parts: [
      { id: 'testiera_cuore', name: 'Testiera a Cuore', slotX: 24, slotY: 34, width: 22, height: 38, color: '#c08650', accentColor: '#8a592b' },
      { id: 'pediera_intaglio', name: 'Pediera Intagliata', slotX: 76, slotY: 34, width: 22, height: 38, color: '#c08650', accentColor: '#8a592b' },
      { id: 'sponda_traforata', name: 'Sponda a Pioli Raccordata', slotX: 50, slotY: 42, width: 56, height: 26, color: '#e9b583', accentColor: '#9c6533' },
      { id: 'fondo_culla', name: 'Fondo a Doghe Elastiche', slotX: 50, slotY: 60, width: 60, height: 12, color: '#ab723e', accentColor: '#754a22' },
      { id: 'pattini_oscillanti', name: 'Pattini Curvi Oscillanti', slotX: 50, slotY: 82, width: 72, height: 16, color: '#8a592b', accentColor: '#5c3614' },
    ]
  },
  {
    id: 'tavolo_allungabile',
    name: 'Tavolo da Pranzo delle Feste',
    category: 'tavolo',
    woodType: 'Rovere Antico Fiammato',
    description: 'Grande tavolo familiare a 6 pezzi con allunghe telescopiche a scomparsa e solido trave di sostegno.',
    roughColor: '#9b714b',
    smoothColor: '#b88d66',
    polishedColor: '#d6aa82',
    grainColor: '#6f4a2b',
    roughShapeRadius: 'rounded-2xl',
    parts: [
      { id: 'ala_sx', name: 'Prolunga Sinistra', slotX: 22, slotY: 28, width: 22, height: 18, color: '#a77c55', accentColor: '#775232' },
      { id: 'piano_centro', name: 'Piano Nobile Centrale', slotX: 50, slotY: 28, width: 36, height: 20, color: '#b88d66', accentColor: '#6f4a2b' },
      { id: 'ala_dx', name: 'Prolunga Destra', slotX: 78, slotY: 28, width: 22, height: 18, color: '#a77c55', accentColor: '#775232' },
      { id: 'gambone_sx', name: 'Gamba a Cavalletto Sx', slotX: 25, slotY: 72, width: 16, height: 46, color: '#825936', accentColor: '#58391f' },
      { id: 'trave_catena', name: 'Trave Portante con Cunei', slotX: 50, slotY: 64, width: 50, height: 14, color: '#9b714b', accentColor: '#6f4a2b' },
      { id: 'gambone_dx', name: 'Gamba a Cavalletto Dx', slotX: 75, slotY: 72, width: 16, height: 46, color: '#825936', accentColor: '#58391f' },
    ]
  },
  {
    id: 'fioriera_tre_livelli',
    name: 'Fioriera a Graticcio da Serra',
    category: 'mobile',
    woodType: 'Larice Resinoso Impermeabile',
    description: 'Fioriera a gradoni a 5 pezzi ideale per aromatiche e vasi in terracotta, resistente alle gocce.',
    roughColor: '#a67c52',
    smoothColor: '#c2976b',
    polishedColor: '#deb285',
    grainColor: '#775331',
    roughShapeRadius: 'rounded-xl',
    parts: [
      { id: 'traliccio_retro', name: 'Graticcio Rampicante', slotX: 50, slotY: 20, width: 68, height: 22, color: '#91673e', accentColor: '#624121' },
      { id: 'vano_alto', name: 'Vaschetta Superiore', slotX: 50, slotY: 38, width: 50, height: 14, color: '#c2976b', accentColor: '#775331' },
      { id: 'vano_medio', name: 'Vaschetta Intermedia', slotX: 50, slotY: 56, width: 58, height: 14, color: '#c2976b', accentColor: '#775331' },
      { id: 'vano_basso', name: 'Vaschetta Profonda Base', slotX: 50, slotY: 74, width: 66, height: 16, color: '#c2976b', accentColor: '#775331' },
      { id: 'montanti_terra', name: 'Montanti d’Appoggio', slotX: 50, slotY: 88, width: 72, height: 12, color: '#624121', accentColor: '#402812' },
    ]
  },
  {
    id: 'specchiera_toeletta',
    name: 'Specchiera da Toeletta con Cassetto',
    category: 'mobile',
    woodType: 'Ciliegio Satinato Biondo',
    description: 'Raffinata toeletta a 5 pezzi con specchio basculante, perni torniti e piccolo cassetto segreto.',
    roughColor: '#b76e4c',
    smoothColor: '#d48864',
    polishedColor: '#f1a27e',
    grainColor: '#804427',
    roughShapeRadius: 'rounded-2xl',
    parts: [
      { id: 'cornice_ovale', name: 'Cornice Specchio ad Arco', slotX: 50, slotY: 24, width: 44, height: 34, color: '#d48864', accentColor: '#804427' },
      { id: 'perno_sx', name: 'Montante Tornito Sx', slotX: 24, slotY: 34, width: 10, height: 36, color: '#9e5635', accentColor: '#6b351c' },
      { id: 'perno_dx', name: 'Montante Tornito Dx', slotX: 76, slotY: 34, width: 10, height: 36, color: '#9e5635', accentColor: '#6b351c' },
      { id: 'cassetto_segreto', name: 'Cassetto Portagioie', slotX: 50, slotY: 66, width: 56, height: 18, color: '#c57854', accentColor: '#804427' },
      { id: 'piedini_toeletta', name: 'Piedini a Basetta Sagomata', slotX: 50, slotY: 84, width: 64, height: 14, color: '#804427', accentColor: '#532814' },
    ]
  },
  {
    id: 'portariviste_tavolino',
    name: 'Tavolino da Salotto Portariviste',
    category: 'tavolo',
    woodType: 'Olmo Campestre Venato',
    description: 'Design organico a 5 pezzi: piano smussato con tasca curva a doghe per custodire libri e riviste.',
    roughColor: '#a17a5b',
    smoothColor: '#bd9575',
    polishedColor: '#dab190',
    grainColor: '#704f35',
    roughShapeRadius: 'rounded-3xl',
    parts: [
      { id: 'piano_curvo', name: 'Piano Smussato Superiore', slotX: 50, slotY: 22, width: 70, height: 18, color: '#bd9575', accentColor: '#704f35' },
      { id: 'tasca_doghe', name: 'Culla Portariviste a Doghe', slotX: 50, slotY: 48, width: 54, height: 24, color: '#a17a5b', accentColor: '#593c25' },
      { id: 'slitta_sx', name: 'Gamba a Slitta Sx', slotX: 22, slotY: 72, width: 14, height: 46, color: '#855f41', accentColor: '#593c25' },
      { id: 'slitta_dx', name: 'Gamba a Slitta Dx', slotX: 78, slotY: 72, width: 14, height: 46, color: '#855f41', accentColor: '#593c25' },
      { id: 'tirante_unione', name: 'Tirante Sagomato', slotX: 50, slotY: 82, width: 48, height: 12, color: '#704f35', accentColor: '#49301c' },
    ]
  },
  {
    id: 'sgabello_alto_bottega',
    name: 'Sgabello Alto da Lavoro Tornito',
    category: 'sgabello',
    woodType: 'Carpino Bianco Extra-Forte',
    description: 'Sgabello da disegno e lavoro a 6 pezzi con seduta ergonomica forata e anello poggiapiedi rinforzato.',
    roughColor: '#c9b195',
    smoothColor: '#e0ccb3',
    polishedColor: '#f7e7d2',
    grainColor: '#93795b',
    roughShapeRadius: 'rounded-full',
    parts: [
      { id: 'seduta_forata', name: 'Seduta Rotonda con Presa', slotX: 50, slotY: 20, width: 56, height: 20, color: '#e0ccb3', accentColor: '#93795b' },
      { id: 'gamba_nord', name: 'Gamba Tornita Sx', slotX: 25, slotY: 62, width: 12, height: 52, color: '#b59a7a', accentColor: '#7e6446' },
      { id: 'gamba_sud', name: 'Gamba Tornita Dx', slotX: 75, slotY: 62, width: 12, height: 52, color: '#b59a7a', accentColor: '#7e6446' },
      { id: 'gamba_centro', name: 'Gamba Posteriore', slotX: 50, slotY: 64, width: 12, height: 52, color: '#9f8465', accentColor: '#6c5337' },
      { id: 'anello_piede', name: 'Anello Poggiapiedi Rotondo', slotX: 50, slotY: 68, width: 56, height: 12, color: '#d4af37', accentColor: '#997d21' },
      { id: 'crociera_testa', name: 'Crociera Sottoseduta', slotX: 50, slotY: 34, width: 44, height: 10, color: '#93795b', accentColor: '#654f35' },
    ]
  }
];

interface LaBottegaDiPapaProps {
  onClose: () => void;
}

export const LaBottegaDiPapa: React.FC<LaBottegaDiPapaProps> = ({ onClose }) => {
  // Current game item (chosen randomly from the 12 items)
  const [itemIndex, setItemIndex] = useState<number>(() => Math.floor(Math.random() * WOOD_ITEMS.length));
  const currentItem = WOOD_ITEMS[itemIndex];

  // Game Phases:
  // 1 = Sanding (Levigatura con carta vetrata)
  // 2 = Joinery Assembly (Incastri dei pezzi)
  // 3 = Beeswax Polishing (Lucidatura a cera d'api)
  // 4 = Finished Masterpiece (Schermata finale distensiva)
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  // Papa States & Speech
  const [papaState, setPapaState] = useState<'idle' | 'happy' | 'gentle-warn' | 'proud'>('idle');
  const [papaSpeech, setPapaSpeech] = useState<string>(
    'Benvenuto nella mia bottega! Oggi diamo forma a un pezzo unico. Comincia levigando il piano con calma 🪵'
  );

  // Modals & Rules
  const [showRules, setShowRules] = useState(false);

  // Phase 1: Sanding Progress (0 to 100)
  const particleSeqRef = useRef<number>(1);
  const getNextParticleId = () => ++particleSeqRef.current;
  const [sandingProgress, setSandingProgress] = useState<number>(0);
  const [sandpaperPos, setSandpaperPos] = useState<{ x: number; y: number } | null>(null);
  const [isSanding, setIsSanding] = useState<boolean>(false);
  const [dustParticles, setDustParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const lastSandPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const warnTimeoutRef = useRef<number | null>(null);

  // Phase 2: Joinery Assembly
  // Placed parts IDs
  const [placedParts, setPlacedParts] = useState<string[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [activeSlotSnap, setActiveSlotSnap] = useState<string | null>(null);
  // Dragging state for pieces
  const [draggingPartId, setDraggingPartId] = useState<string | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const assemblyBoardRef = useRef<HTMLDivElement | null>(null);

  // Phase 3: Beeswax Polishing Progress (0 to 100)
  const [polishProgress, setPolishProgress] = useState<number>(0);
  const [isPolishing, setIsPolishing] = useState<boolean>(false);
  const [waxShinePos, setWaxShinePos] = useState<{ x: number; y: number } | null>(null);
  const [waxSparkles, setWaxSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const lastPolishPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    };
  }, []);

  // ----------------------------------------------------
  // FASE 1: LEVIGATURA (CALMA TATTILE & ANTI-FRETTA)
  // ----------------------------------------------------
  const handlePointerDownSanding = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsSanding(true);
    setSandpaperPos({ x, y });
    lastSandPos.current = { x, y, time: Date.now() };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    // Responsive initial tap feedback
    soundManager.playWoodSanding();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setSandingProgress(prev => {
      const next = Math.min(100, prev + 1.6);
      if (prev < 35 && next >= 35 && papaState === 'idle') {
        setPapaSpeech('Senti la venatura che si distende... continua con questo ritmo calmo 🪵');
      } else if (prev < 70 && next >= 70 && papaState === 'idle') {
        setPapaSpeech('Guarda come scompare ogni asperità! La superficie sta diventando vellutata ✨');
      }
      if (next >= 100) {
        setIsSanding(false);
        soundManager.playWoodSnap();
        setPapaState('happy');
        setPapaSpeech('Che superficie liscia! Sembra seta. Ora assembliamo i pezzi con cura e precisione ✨');
        setTimeout(() => {
          setPhase(2);
          setPapaState('idle');
        }, 950);
      }
      return next;
    });
  };

  const handlePointerMoveSanding = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 1 || !isSanding || !lastSandPos.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    const dt = Math.max(16, now - lastSandPos.current.time);
    const dist = Math.hypot(x - lastSandPos.current.x, y - lastSandPos.current.y);
    const speed = dist / dt;

    setSandpaperPos({ x, y });

    // ANTI-FRETTA RULE: Only trigger on extreme frantic whip movements (> 4.5 px/ms)
    if (dist > 25 && speed > 4.5) {
      soundManager.playPapaGentleWarn();
      setPapaState('gentle-warn');
      setPapaSpeech('Piano... lascia che il legno respiri. Fai movimenti lenti e rotondi 🪵');
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
      warnTimeoutRef.current = window.setTimeout(() => {
        setPapaState('idle');
        setPapaSpeech('Accarezza la fibra con dolcezza... senti come si ammorbidisce.');
      }, 2600);

      lastSandPos.current = { x, y, time: now };
      return;
    }

    // CALM, RESPONSIVE SANDING
    if (dist > 4) {
      soundManager.playWoodSanding();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }

      // Add little floating golden sawdust particles
      if (Math.random() > 0.35) {
        setDustParticles(prev => [
          ...prev.slice(-16),
          { id: getNextParticleId(), x: x + (Math.random() * 20 - 10), y: y + (Math.random() * 20 - 10) }
        ]);
      }

      setSandingProgress(prev => {
        // Incremento calibrato per far durare il passaggio in modo distensivo e rilassante (~4-5 secondi di levigatura)
        const next = Math.min(100, prev + 0.85);
        if (prev < 35 && next >= 35 && papaState === 'idle') {
          setPapaSpeech('Senti la venatura che si distende... continua con questo ritmo calmo 🪵');
        } else if (prev < 70 && next >= 70 && papaState === 'idle') {
          setPapaSpeech('Guarda come scompare ogni asperità! La superficie sta diventando vellutata ✨');
        }
        if (next >= 100) {
          setIsSanding(false);
          soundManager.playWoodSnap();
          setPapaState('happy');
          setPapaSpeech('Che superficie liscia! Sembra seta. Ora assembliamo i pezzi con cura e precisione ✨');
          setTimeout(() => {
            setPhase(2);
            setPapaState('idle');
          }, 950);
        }
        return next;
      });

      lastSandPos.current = { x, y, time: now };
    }
  };

  const handlePointerUpSanding = () => {
    setIsSanding(false);
    setSandpaperPos(null);
    lastSandPos.current = null;
  };

  // ----------------------------------------------------
  // FASE 2: INCASTRI PERFETTI (ASSEMBLY & DRAG-AND-DROP)
  // ----------------------------------------------------
  const handleSnapPart = (partId: string) => {
    if (phase !== 2 || placedParts.includes(partId)) return;
    soundManager.playWoodSnap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([25, 12, 35]);
    }

    setActiveSlotSnap(partId);
    setTimeout(() => setActiveSlotSnap(null), 500);

    const nextPlaced = [...placedParts, partId];
    setPlacedParts(nextPlaced);
    setSelectedPartId(null);
    setDraggingPartId(null);
    setDragPointerPos(null);

    if (nextPlaced.length >= currentItem.parts.length) {
      setPapaState('happy');
      setPapaSpeech('Perfetto! Ogni pezzo ha trovato il suo posto, solido come una roccia. Ora lucidiamo con la cera d’api 🐝');
      setTimeout(() => {
        setPhase(3);
        setPapaState('idle');
      }, 950);
    } else {
      setPapaState('happy');
      setPapaSpeech('Incastro impeccabile! Sentito che bel colpo sordo? Passa al pezzo successivo.');
      setTimeout(() => setPapaState('idle'), 1800);
    }
  };

  // Drag-and-drop or tap piece handlers
  const handleStartDragPart = (partId: string, e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (phase !== 2 || placedParts.includes(partId)) return;
    setDraggingPartId(partId);
    setDragPointerPos({ x: e.clientX, y: e.clientY });
    soundManager.playWoodTap();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
    if (!draggingPartId) return;
    setDragPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handleGlobalPointerUp = (e: React.PointerEvent) => {
    if (!draggingPartId) return;
    const draggedId = draggingPartId;
    const clientX = e.clientX;
    const clientY = e.clientY;

    setDraggingPartId(null);
    setDragPointerPos(null);

    // Check if released over the target slot on the board OR simply tapped
    const boardEl = assemblyBoardRef.current;
    if (boardEl) {
      const rect = boardEl.getBoundingClientRect();
      const part = currentItem.parts.find(p => p.id === draggedId);
      if (part) {
        // Target slot coordinates in pixels
        const targetX = rect.left + (part.slotX / 100) * rect.width;
        const targetY = rect.top + (part.slotY / 100) * rect.height;
        const dist = Math.hypot(clientX - targetX, clientY - targetY);

        // Generous tolerance radius: anywhere inside board, or near slot, or quick tap
        if (
          dist < 120 ||
          (clientX >= rect.left - 40 &&
            clientX <= rect.right + 40 &&
            clientY >= rect.top - 40 &&
            clientY <= rect.bottom + 40)
        ) {
          handleSnapPart(draggedId);
          return;
        }
      }
    }

    // Se rilasciato fuori, incastra comunque se era un tocco diretto
    handleSnapPart(draggedId);
  };

  // ----------------------------------------------------
  // FASE 3: LUCIDATURA A CERA D'API (POLISHING)
  // ----------------------------------------------------
  const handlePointerDownPolishing = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 3) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsPolishing(true);
    setWaxShinePos({ x, y });
    lastPolishPos.current = { x, y, time: Date.now() };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    // Responsive initial tap feedback
    soundManager.playWaxBuff();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setPolishProgress(prev => {
      const next = Math.min(100, prev + 1.6);
      if (prev < 35 && next >= 35 && papaState === 'idle') {
        setPapaSpeech('Che profumo di miele e resina! La cera sta nutrendo il legno nel profondo 🐝');
      } else if (prev < 70 && next >= 70 && papaState === 'idle') {
        setPapaSpeech('Ecco il bagliore dorato che cercavamo... quasi completato, accarezza ancora un po\' ✨');
      }
      if (next >= 100) {
        setIsPolishing(false);
        soundManager.playPapaMasterpiece();
        setPapaState('proud');
        setPapaSpeech('Visto? La pazienza trasforma ogni spigolo in qualcosa di solido e bello. Ti sei preso cura di questo momento.');
        setTimeout(() => {
          setPhase(4);
        }, 950);
      }
      return next;
    });
  };

  const handlePointerMovePolishing = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 3 || !isPolishing || !lastPolishPos.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    const dist = Math.hypot(x - lastPolishPos.current.x, y - lastPolishPos.current.y);

    setWaxShinePos({ x, y });

    if (dist > 5) {
      soundManager.playWaxBuff();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }

      if (Math.random() > 0.35) {
        setWaxSparkles(prev => [
          ...prev.slice(-18),
          { id: getNextParticleId(), x: x + (Math.random() * 24 - 12), y: y + (Math.random() * 24 - 12) }
        ]);
      }

      setPolishProgress(prev => {
        // Incremento calibrato per far durare il passaggio della cera d'api in modo distensivo (~4-5 secondi di movimenti circolari)
        const next = Math.min(100, prev + 0.85);
        if (prev < 35 && next >= 35 && papaState === 'idle') {
          setPapaSpeech('Che profumo di miele e resina! La cera sta nutrendo il legno nel profondo 🐝');
        } else if (prev < 70 && next >= 70 && papaState === 'idle') {
          setPapaSpeech('Ecco il bagliore dorato che cercavamo... quasi completato, accarezza ancora un po\' ✨');
        }
        if (next >= 100) {
          setIsPolishing(false);
          soundManager.playPapaMasterpiece();
          setPapaState('proud');
          setPapaSpeech('Visto? La pazienza trasforma ogni spigolo in qualcosa di solido e bello. Ti sei preso cura di questo momento.');
          setTimeout(() => {
            setPhase(4);
          }, 950);
        }
        return next;
      });

      lastPolishPos.current = { x, y, time: now };
    }
  };

  const handlePointerUpPolishing = () => {
    setIsPolishing(false);
    setWaxShinePos(null);
    lastPolishPos.current = null;
  };

  // ----------------------------------------------------
  // RESTART WITH ANOTHER ITEM
  // ----------------------------------------------------
  const handleCraftNewItem = () => {
    let nextIdx = Math.floor(Math.random() * WOOD_ITEMS.length);
    if (nextIdx === itemIndex) {
      nextIdx = (itemIndex + 1) % WOOD_ITEMS.length;
    }
    setItemIndex(nextIdx);
    setPhase(1);
    setSandingProgress(0);
    setPlacedParts([]);
    setSelectedPartId(null);
    setPolishProgress(0);
    setPapaState('idle');
    setPapaSpeech(`Meraviglioso! Ora mettiamo sul banco: ${WOOD_ITEMS[nextIdx].name}. Pronti con la carta vetrata 🪵`);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-gradient-to-b from-[#2a1b12] via-[#21140d] to-[#170e08] text-amber-50 flex flex-col justify-between items-center p-3 sm:p-4 select-none overflow-hidden h-[100dvh] max-h-[100dvh] touch-none"
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerCancel={handleGlobalPointerUp}
    >
      {/* ================================================== */}
      {/* 1. TOP BAR (HEADER & STEPPER)                      */}
      {/* ================================================== */}
      <header className="w-full max-w-md flex flex-col gap-2 shrink-0 z-30">
        <div className="relative flex justify-between items-center shrink-0 h-9 sm:h-10">
          <div className="w-8" /> {/* Spacer balancing X on right */}

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 calm-white-card px-4 py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-md">
            <h2 className="text-[#451a03] dark:text-[#fef3c7] font-black text-base sm:text-xl tracking-wide font-['Quicksand'] drop-shadow-xs">
              La Bottega di Papà
            </h2>
            <button
              onClick={() => setShowRules(true)}
              className="p-1 text-amber-800 dark:text-amber-300 hover:text-amber-950 active:scale-95 transition-all rounded-full hover:bg-amber-100/70 cursor-pointer"
              title="Regole del gioco"
              aria-label="Regole del gioco"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 calm-white-card hover:bg-stone-100 active:scale-95 text-slate-900 rounded-full shadow-md shrink-0 border border-slate-300 cursor-pointer"
            aria-label="Esci dal gioco"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stepper Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-2xs ${
              phase === 1
                ? 'bg-amber-600 text-amber-950 ring-2 ring-amber-400/50 scale-102'
                : phase > 1
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-amber-950/80 text-amber-500 border border-amber-800/40'
            }`}
          >
            {phase > 1 ? <Check className="w-3 h-3" /> : '🪵'} 1. Levigatura
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-2xs ${
              phase === 2
                ? 'bg-amber-600 text-amber-950 ring-2 ring-amber-400/50 scale-102'
                : phase > 2
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-amber-950/80 text-amber-500 border border-amber-800/40'
            }`}
          >
            {phase > 2 ? <Check className="w-3 h-3" /> : '📐'} 2. Incastri
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-2xs ${
              phase >= 3
                ? 'bg-amber-500 text-amber-950 ring-2 ring-amber-300/50 scale-102'
                : 'bg-amber-950/80 text-amber-500 border border-amber-800/40'
            }`}
          >
            {phase === 4 ? <Check className="w-3 h-3" /> : '🐝'} 3. Lucidatura
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* 2. PAPÀ CHARACTER & SPEECH BALLOON                 */}
      {/* ================================================== */}
      <section className="w-full max-w-md flex items-center gap-3 shrink-0 py-1 z-20">
        {/* PAPÀ CARTOON SVG AVATAR */}
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            animate={
              papaState === 'happy'
                ? { y: [0, -3, 0] }
                : papaState === 'gentle-warn'
                ? { rotate: [-2, 2, -2, 0] }
                : papaState === 'proud'
                ? { scale: [1, 1.05, 1] }
                : { y: [0, -1, 0] }
            }
            transition={{ repeat: Infinity, duration: papaState === 'idle' ? 3.5 : 0.8 }}
            className="w-16 h-16 sm:w-20 sm:h-20 relative drop-shadow-md cursor-pointer"
            onClick={() => {
              soundManager.playWoodSnap();
              setPapaState('happy');
              setPapaSpeech('Il legno ha memoria: se lo tratti con rispetto, durerà generazioni.');
              setTimeout(() => setPapaState('idle'), 2400);
            }}
          >
            {PAPA_CUSTOM_IMAGE ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <img
                  src={PAPA_CUSTOM_IMAGE}
                  alt="Papà"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-sm select-none"
                />
              </div>
            ) : (
              <svg viewBox="0 0 120 120" className="w-full h-full">
              <defs>
                <linearGradient id="papaSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd8be" />
                  <stop offset="100%" stopColor="#f3be9b" />
                </linearGradient>
                <linearGradient id="papaApron" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9c6644" />
                  <stop offset="100%" stopColor="#7f4f24" />
                </linearGradient>
                <linearGradient id="papaShirt" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2b4c7e" />
                  <stop offset="100%" stopColor="#3d629b" />
                </linearGradient>
                <linearGradient id="papaShortHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>

              {/* Slender neck & collar */}
              <rect x="53" y="66" width="14" height="16" rx="4" fill="url(#papaSkin)" />
              <path d="M42 82 L78 82 L86 118 L34 118 Z" fill="url(#papaShirt)" />

              {/* Carpenter's Apron in Leather */}
              <path d="M46 84 L74 84 L78 120 L42 120 Z" fill="url(#papaApron)" stroke="#583115" strokeWidth="1.5" />
              {/* Apron Straps */}
              <line x1="48" y1="84" x2="40" y2="100" stroke="#583115" strokeWidth="2.5" />
              <line x1="72" y1="84" x2="80" y2="100" stroke="#583115" strokeWidth="2.5" />
              {/* Apron Pocket with Wooden Ruler Sticking Out */}
              <rect x="52" y="96" width="16" height="14" rx="2" fill="#6a3818" stroke="#4a2610" strokeWidth="1" />
              <rect x="55" y="91" width="3" height="8" rx="0.5" fill="#e9c46a" stroke="#8a5a36" strokeWidth="0.5" transform="rotate(-10 55 91)" />

              {/* Ultra-short cropped haircut (capelli ancora più corti, taglio pulito a zero ai lati e sfumato) */}
              {/* Back & side hair tight silhouette */}
              <path
                d="M40 44 C38 30, 44 20, 60 20 C76 20, 82 30, 80 44 C78 36, 74 26, 60 25 C46 26, 42 36, 40 44 Z"
                fill="url(#papaShortHair)"
              />
              <ellipse cx="40" cy="42" rx="2.5" ry="5" fill="#64748b" />
              <ellipse cx="80" cy="42" rx="2.5" ry="5" fill="#64748b" />

              {/* Head / Slender Face */}
              <path
                d="M44 32 C44 22, 76 22, 76 32 C78 46, 76 68, 60 70 C44 68, 42 46, 44 32 Z"
                fill="url(#papaSkin)"
                stroke="#e29578"
                strokeWidth="1.2"
              />

              {/* Ultra-short buzz hairline on top */}
              <path
                d="M42 30 C47 23, 54 21, 60 21 C66 21, 73 23, 78 30 C73 26, 67 25, 60 25 C53 25, 47 26, 42 30 Z"
                fill="url(#papaShortHair)"
              />
              <path
                d="M44 28 C48 24, 54 22, 60 22 C66 22, 72 24, 76 28 C72 25, 66 24, 60 24 C54 24, 48 25, 44 28 Z"
                fill="#94a3b8"
              />
              {/* High taper fade sideburns cleanly trimmed above the ears */}
              <path d="M41 36 L43 42 L44 40 Z" fill="#64748b" />
              <path d="M79 36 L77 42 L76 40 Z" fill="#64748b" />
              {/* Subtle close-cropped buzz texture accents */}
              <path d="M49 23 Q54 21 61 23" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M59 22 Q65 21 71 23" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M46 26 Q52 24 58 26" stroke="#64748b" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M62 26 Q68 24 74 26" stroke="#64748b" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* RED CARPENTER'S PENCIL TUCKED BEHIND RIGHT EAR! */}
              <g transform="rotate(35 84 42)">
                <rect x="80" y="30" width="4.5" height="24" rx="1" fill="#e63946" stroke="#9e2a2b" strokeWidth="0.8" />
                <polygon points="80,30 84.5,30 82.2,25" fill="#f4a261" />
                <polygon points="81.5,26.5 83,26.5 82.2,25" fill="#1d3557" />
              </g>

              {/* Ears */}
              <ellipse cx="41" cy="48" rx="4.5" ry="7" fill="url(#papaSkin)" stroke="#e29578" strokeWidth="0.8" />
              <ellipse cx="79" cy="48" rx="4.5" ry="7" fill="url(#papaSkin)" stroke="#e29578" strokeWidth="0.8" />

              {/* Gentle smile lines & warm eyes */}
              <path d="M48 44 Q53 41 57 44" stroke="#5c382b" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M63 44 Q67 41 72 44" stroke="#5c382b" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Eye crinkles / smile wrinkles */}
              <path d="M45 42 Q43 45 46 47" stroke="#b08968" strokeWidth="1" fill="none" />
              <path d="M75 42 Q77 45 74 47" stroke="#b08968" strokeWidth="1" fill="none" />

              {/* Gentle Nose */}
              <path d="M60 42 Q62 52 58 54 Q60 55 63 54" stroke="#c97b5e" strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Clean-shaven gentle lips & warm, encouraging smile (senza baffi) */}
              <path d="M55 58 Q60 60 65 58" stroke="#e29578" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M53 62 Q60 68 67 62" stroke="#5c382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              {/* Friendly chin cleft */}
              <ellipse cx="60" cy="68" rx="2" ry="1" fill="#e29578" opacity="0.6" />

              {/* Soft rosy cheeks */}
              <circle cx="48" cy="51" r="3" fill="#f28482" opacity="0.4" />
              <circle cx="72" cy="51" r="3" fill="#f28482" opacity="0.4" />
            </svg>
          )}
        </motion.div>
          <span className="text-[10px] font-black tracking-wider text-amber-200 uppercase bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40 shadow-xs -mt-1">
            Papà
          </span>
        </div>

        {/* PAPÀ'S SPEECH BALLOON */}
        <div className="flex-1 bg-amber-950/80 backdrop-blur-md border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-md relative min-h-[58px] max-h-[74px] flex items-center overflow-hidden">
          <div className="absolute top-4 -left-2 w-3 h-3 bg-amber-950 border-l border-b border-amber-500/40 transform rotate-45" />
          <p className="text-xs sm:text-[13px] font-bold text-amber-100 leading-snug line-clamp-3">
            {papaSpeech}
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. CENTRAL WORKBENCH (BANCO DA LAVORO)             */}
      {/* ================================================== */}
      <main className="relative w-full max-w-md flex-1 min-h-0 flex flex-col items-center justify-center my-auto overflow-hidden">
        {/* Item Title & Wood Spec */}
        <div className="text-center mb-1 shrink-0">
          <h2 className="text-sm sm:text-base font-extrabold text-amber-200 drop-shadow-xs">
            {currentItem.name}
          </h2>
          <p className="text-[11px] text-amber-400/90 font-medium">
            Essenza: <strong className="text-amber-300">{currentItem.woodType}</strong>
          </p>
        </div>

        {/* WORKBENCH SURFACE */}
        <div className="relative w-72 sm:w-84 h-56 sm:h-64 bg-gradient-to-b from-[#3d2716] via-[#2f1d10] to-[#211409] rounded-3xl border-3 border-amber-700/60 shadow-2xl flex flex-col items-center justify-center overflow-hidden p-3">
          {/* Wood grain pattern background on workbench */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4a373_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-400/20 pointer-events-none" />

          {/* ------------------------------------------------ */}
          {/* FASE 1: LA LEVIGATURA (CALMA TATTILE)            */}
          {/* ------------------------------------------------ */}
          {phase === 1 && (
            <div
              className="relative w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
              onPointerDown={handlePointerDownSanding}
              onPointerMove={handlePointerMoveSanding}
              onPointerUp={handlePointerUpSanding}
              onPointerCancel={handlePointerUpSanding}
            >
              {/* WOOD PIECE (ROUGH -> SMOOTH TRANSITION) */}
              <div
                className={`w-full h-full ${currentItem.roughShapeRadius} border-3 shadow-xl relative overflow-hidden transition-colors duration-200 flex items-center justify-center`}
                style={{
                  backgroundColor: sandingProgress < 50 ? currentItem.roughColor : currentItem.smoothColor,
                  borderColor: currentItem.grainColor
                }}
              >
                {/* Rough surface texture (fades as sanded) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: Math.max(0, 1 - sandingProgress / 100) }}
                >
                  {/* Rough wood splinters and knots */}
                  <div className="absolute top-6 left-8 w-6 h-6 rounded-full border-2 border-[#5c382b]/60 bg-[#4a2818]/40" />
                  <div className="absolute bottom-8 right-10 w-8 h-8 rounded-full border-2 border-[#5c382b]/60 bg-[#4a2818]/40" />
                  <div className="absolute inset-x-4 top-16 h-1 bg-[#5c382b]/50 transform -rotate-12" />
                  <div className="absolute inset-x-8 bottom-16 h-1 bg-[#5c382b]/50 transform rotate-6" />
                </div>

                {/* Smooth silky glow layer (appears with progress) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-gradient-to-tr from-transparent via-amber-200/25 to-transparent"
                  style={{ opacity: sandingProgress / 100 }}
                />

                {/* Wood growth concentric rings */}
                <div className="w-28 h-28 rounded-full border border-amber-950/20 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full border border-amber-950/20" />
                </div>

                {/* Floating Sawdust Particles */}
                {dustParticles.map(p => (
                  <motion.div
                    key={`dust-${p.id}`}
                    initial={{ opacity: 0.9, scale: 0.6 }}
                    animate={{ opacity: 0, y: -22, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="absolute w-2 h-2 rounded-full bg-amber-200 pointer-events-none shadow-2xs"
                    style={{ left: p.x, top: p.y }}
                  />
                ))}

                {/* Sandpaper Block (Follows Touch) */}
                {sandpaperPos && (
                  <motion.div
                    className="absolute w-12 h-8 bg-gradient-to-b from-[#e76f51] to-[#d64024] rounded-lg border border-amber-200 shadow-lg pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: sandpaperPos.x, top: sandpaperPos.y }}
                  >
                    <span className="text-[9px] font-black text-amber-100">GRANA</span>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* FASE 2: GLI INCASTRI PERFETTI (ASSEMBLY)         */}
          {/* ------------------------------------------------ */}
          {phase === 2 && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Assembly Board with Guided Mortise Slots */}
              <div
                ref={assemblyBoardRef}
                className={`relative w-52 sm:w-60 h-36 sm:h-40 bg-amber-950/40 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  draggingPartId
                    ? 'border-amber-400 ring-4 ring-amber-400/30 shadow-2xl scale-102'
                    : 'border-dashed border-amber-600/40'
                }`}
              >
                {/* Main Smooth Piece on the Board */}
                <div
                  className={`w-38 sm:w-44 h-26 sm:h-30 ${currentItem.roughShapeRadius} shadow-lg relative flex items-center justify-center border-2`}
                  style={{
                    backgroundColor: currentItem.smoothColor,
                    borderColor: currentItem.grainColor
                  }}
                >
                  {/* Slots / Mortises marked with dashed lines */}
                  {currentItem.parts.map(part => {
                    const isPlaced = placedParts.includes(part.id);
                    const isBeingDragged = draggingPartId === part.id;
                    const isTargetSlot = isBeingDragged;

                    return (
                      <div
                        key={part.id}
                        onClick={() => handleSnapPart(part.id)}
                        className={`absolute flex items-center justify-center cursor-pointer transition-all ${
                          isPlaced
                            ? 'bg-amber-800/90 border border-amber-950 shadow-inner'
                            : isTargetSlot
                            ? 'border-2 border-dashed border-yellow-300 bg-yellow-400/35 ring-4 ring-yellow-400/60 scale-110 z-20 animate-pulse'
                            : 'border-2 border-dashed border-amber-400/80 bg-amber-400/15 hover:bg-amber-400/30'
                        }`}
                        style={{
                          left: `${part.slotX}%`,
                          top: `${part.slotY}%`,
                          width: `${part.width}%`,
                          height: `${part.height}%`,
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '6px'
                        }}
                      >
                        {isPlaced ? (
                          <span className="text-[10px] text-amber-200">✓</span>
                        ) : (
                          <span className={`text-[9px] font-extrabold whitespace-nowrap ${
                            isTargetSlot ? 'text-amber-100 font-black' : 'text-amber-300'
                          }`}>
                            {isTargetSlot ? 'Rilascia qui 🎯' : 'Incastro'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating dragged piece attached to finger */}
              {draggingPartId && dragPointerPos && (
                <div
                  className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 drop-shadow-2xl animate-pulse"
                  style={{ left: dragPointerPos.x, top: dragPointerPos.y }}
                >
                  <div
                    className="px-3 py-2 rounded-xl text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-400 border-2 border-amber-100 shadow-2xl flex items-center gap-1.5 ring-4 ring-amber-400/40"
                  >
                    <span>🪵</span>
                    <span>{currentItem.parts.find(p => p.id === draggingPartId)?.name}</span>
                  </div>
                  <span className="text-[10px] bg-black/70 text-amber-200 px-2 py-0.5 rounded-full font-bold">
                    Trascina verso la sagoma ✨
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* FASE 3: LA LUCIDATURA A CERA D'API (POLISHING)   */}
          {/* ------------------------------------------------ */}
          {phase === 3 && (
            <div
              className="relative w-48 sm:w-56 h-44 sm:h-50 flex items-center justify-center cursor-pointer select-none touch-none"
              onPointerDown={handlePointerDownPolishing}
              onPointerMove={handlePointerMovePolishing}
              onPointerUp={handlePointerUpPolishing}
              onPointerCancel={handlePointerUpPolishing}
            >
              {/* Assembled Object with Polished Golden Sheen */}
              <div
                className={`w-full h-full ${currentItem.roughShapeRadius} shadow-2xl relative overflow-hidden flex items-center justify-center border-3 transition-all duration-300`}
                style={{
                  backgroundColor: polishProgress < 50 ? currentItem.smoothColor : currentItem.polishedColor,
                  borderColor: currentItem.grainColor
                }}
              >
                {/* Assembled parts visible in background */}
                {currentItem.parts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute bg-amber-900/60 rounded-sm"
                    style={{
                      left: `${p.slotX}%`,
                      top: `${p.slotY}%`,
                      width: `${p.width}%`,
                      height: `${p.height}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}

                {/* Beeswax Sheen Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-amber-300/10 via-amber-200/40 to-amber-100/30 transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: polishProgress / 100 }}
                />

                {/* Wax Sparkles */}
                {waxSparkles.map(s => (
                  <motion.div
                    key={`wax-${s.id}`}
                    initial={{ opacity: 1, scale: 0.3 }}
                    animate={{ opacity: 0, scale: 1.4 }}
                    transition={{ duration: 0.55 }}
                    className="absolute text-amber-200 text-xs pointer-events-none"
                    style={{ left: s.x, top: s.y }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Polishing Cloth Icon following touch */}
                {waxShinePos && (
                  <motion.div
                    className="absolute w-12 h-12 rounded-full bg-amber-200/80 border-2 border-amber-400 shadow-lg pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: waxShinePos.x, top: waxShinePos.y }}
                  >
                    <span className="text-base">🐝</span>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* FASE 4: CAPOLAVORO FINITO (MASTERPIECE DISPLAY)  */}
          {/* ------------------------------------------------ */}
          {phase === 4 && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14 }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              {/* Finished Wooden Object in all its glory */}
              <div
                className={`w-44 sm:w-50 h-36 sm:h-42 ${currentItem.roughShapeRadius} shadow-2xl relative flex items-center justify-center border-3 border-amber-400 ring-4 ring-amber-300/40`}
                style={{
                  backgroundColor: currentItem.polishedColor
                }}
              >
                {/* Warm honey light sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-white/35 to-amber-300/20 rounded-[inherit]" />

                {/* Finished parts integrated */}
                {currentItem.parts.map(p => (
                  <div
                    key={p.id}
                    className="absolute rounded-sm border border-amber-950/30"
                    style={{
                      left: `${p.slotX}%`,
                      top: `${p.slotY}%`,
                      width: `${p.width}%`,
                      height: `${p.height}%`,
                      backgroundColor: p.color,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}

                <div className="absolute -top-2 -right-2 text-xl animate-bounce">
                  ✨
                </div>
                <div className="absolute -bottom-2 -left-2 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>
                  🪵
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* ================================================== */}
      {/* 4. INTERACTIVE CONTROLS (ALWAYS WITHIN VIEWPORT)   */}
      {/* ================================================== */}
      <footer className="w-full max-w-md shrink-0 flex flex-col items-center gap-2 pt-1 pb-1 z-20">
        {/* FASE 1: Progress & Guidance */}
        {phase === 1 && (
          <div className="w-full bg-amber-950/80 border border-amber-600/50 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center gap-1.5 shadow-md">
            <div className="flex items-center justify-between w-full text-xs font-black text-amber-200">
              <span>🌾 Passa il dito avanti e indietro per levigare</span>
              <span>{Math.round(sandingProgress)}%</span>
            </div>
            <div className="w-full bg-amber-900/60 h-3 rounded-full overflow-hidden border border-amber-700/60">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-150"
                style={{ width: `${sandingProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-400 font-medium">
              Movimenti lenti e distensivi. Nessuna fretta.
            </span>
          </div>
        )}

        {/* FASE 2: Parts Rack & Drag-and-Drop to Snap */}
        {phase === 2 && (
          <div className="w-full bg-amber-950/80 border border-amber-600/50 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center gap-1.5 shadow-md">
            <div className="flex items-center justify-between w-full px-1 text-xs font-black text-amber-200">
              <span>📐 Incastra i pezzi (trascina o tocca):</span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-700/50">
                {placedParts.length} / {currentItem.parts.length} pezzi
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full max-h-32 sm:max-h-36 overflow-y-auto py-0.5 scrollbar-none">
              {currentItem.parts.map(part => {
                const isPlaced = placedParts.includes(part.id);
                const isDraggingThis = draggingPartId === part.id;

                return (
                  <button
                    key={part.id}
                    disabled={isPlaced}
                    onPointerDown={e => handleStartDragPart(part.id, e)}
                    onClick={() => handleSnapPart(part.id)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 touch-none select-none ${
                      isPlaced
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 opacity-60 cursor-default'
                        : isDraggingThis
                        ? 'bg-yellow-400 text-amber-950 ring-4 ring-yellow-300 scale-105 border border-amber-200'
                        : 'bg-amber-600 hover:bg-amber-500 text-amber-950 active:scale-95 border border-amber-400 cursor-grab active:cursor-grabbing animate-pulse'
                    }`}
                  >
                    {isPlaced ? '✓' : '🪵'} {part.name}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-amber-300/90 font-medium">
              Puoi trascinare il pezzo col dito oppure toccarlo direttamente per incastrarlo.
            </span>
          </div>
        )}

        {/* FASE 3: Beeswax Polishing Guidance */}
        {phase === 3 && (
          <div className="w-full bg-amber-950/80 border border-amber-600/50 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center gap-1.5 shadow-md">
            <div className="flex items-center justify-between w-full text-xs font-black text-amber-200">
              <span>🐝 Passa il panno con movimenti circolari continui</span>
              <span>{Math.round(polishProgress)}%</span>
            </div>
            <div className="w-full bg-amber-900/60 h-3 rounded-full overflow-hidden border border-amber-700/60">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-150"
                style={{ width: `${polishProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-amber-300 font-medium">
              Stendi la cera d'api per nutrire e far risplendere il legno.
            </span>
          </div>
        )}

        {/* FASE 4: Masterpiece Done & Replay */}
        {phase === 4 && (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="text-center px-2">
              <p className="text-xs sm:text-sm text-amber-200 font-bold italic">
                "{currentItem.description}"
              </p>
            </div>
            <button
              onClick={handleCraftNewItem}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Crea un nuovo oggetto in legno 🪵
            </button>
          </div>
        )}
      </footer>

      {/* ================================================== */}
      {/* 5. RULES / EXPLANATION MODAL (MATCHING OTHER GAMES)*/}
      {/* ================================================== */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5 z-[80] animate-fadeIn"
          onClick={() => setShowRules(false)}
        >
          <div
            className="calm-white-card border-2 border-amber-200 dark:border-amber-800 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-slate-800 dark:text-slate-100 space-y-3.5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-amber-950 dark:text-amber-200 font-black text-lg font-['Quicksand']">
                La Bottega di Papà
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
                Lavorare il legno insegna che per togliere ogni ruvidità serve pazienza e gesti lenti. Papà ti accompagna in questo percorso sensoriale.
              </p>

              <div>
                <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                  Come si gioca:
                </p>

                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs">
                  <li>
                    <strong>1. Levigatura:</strong> passa il dito con movimenti continui e calmi sul legno finché non diventa liscio.
                  </li>
                  <li>
                    <strong>2. Incastri:</strong> trascina ogni elemento nella sua guida sulla tavola per sentire il click del legno.
                  </li>
                  <li>
                    <strong>3. Lucidatura:</strong> passa il panno morbido imbevuto di cera d'api per far risplendere l'opera.
                  </li>
                  <li>
                    <strong>12 creazioni:</strong> sgabelli, tavolini, comodini, panche e credenze in legni pregiati.
                  </li>
                  <li>
                    Nessun timer né fretta: goditi la morbidezza del lavoro artigianale.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black py-2.5 sm:py-3 rounded-2xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Ho capito ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
