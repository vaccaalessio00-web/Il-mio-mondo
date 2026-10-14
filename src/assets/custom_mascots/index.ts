/**
 * CUSTOM MASCOTS REGISTRY
 * 
 * Inserisci qui le tue immagini per i Coach e le Mascotte!
 * 
 * CARTELLA: src/assets/custom_mascots/
 * 
 * I file inseriti vengono RILEVATI AUTOMATICAMENTE grazie a Vite glob import.
 * Puoi usare estensioni: .jpeg, .jpg, .png, .webp o .svg.
 */

// Carica automaticamente qualsiasi immagine presente in questa cartella
const customImages = import.meta.glob<{ default: string }>([
  './*.{jpeg,jpg,png,webp,svg,gif,bmp,JPEG,JPG,PNG,WEBP,SVG,GIF,BMP}'
], {
  eager: true,
});

function findCustomImage(names: string[]): string | null {
  for (const path in customImages) {
    const cleanPath = path.replace(/^\.\//, '').toLowerCase();
    // Normalizza separatori come trattini o underscore
    const normalizedPath = cleanPath.replace(/[-_.]/g, '');

    // Salta file non-immagine
    if (cleanPath.endsWith('.md') || cleanPath.endsWith('.ts') || cleanPath.endsWith('.gitkeep')) continue;

    for (const name of names) {
      const lowerName = name.toLowerCase();
      const normalizedName = lowerName.replace(/[-_.]/g, '');

      // Match se:
      // 1. Il nome file inizia con il pattern (es: "coach_engfa.png.jpg", "coach-engfa.png.jpg")
      // 2. Il nome file contiene la parola chiave (es: "engfa" in "coach-engfa.png.jpg")
      // 3. I caratteri normalizzati combaciano
      if (
        cleanPath.startsWith(`${lowerName}.`) ||
        cleanPath.includes(lowerName) ||
        normalizedPath.includes(normalizedName)
      ) {
        return customImages[path]?.default || null;
      }
    }
  }
  return null;
}

export interface CustomMascotsConfig {
  puzzola?: string | null;     // Puzzola
  engfa?: string | null;       // Coach Engfa
  charlotte?: string | null;   // Charlotte
  gyo?: string | null;         // Gyo (Cagnolino)
  phalo?: string | null;       // Phalo (Coniglietto)
  tofu?: string | null;        // Tofu / Tofy
  dobby?: string | null;       // Dobby (Cagnolino)
  kraprao?: string | null;     // Kraprao (Coniglietto)
  main?: string | null;        // Mascotte principale
  fitworld?: string | null;    // Logo FitWorld
}

export const CUSTOM_MASCOTS: CustomMascotsConfig = {
  puzzola: findCustomImage(['puff', 'puzzola', 'boyfriend_puzzola']),
  engfa: findCustomImage(['engfa', 'coach_engfa', 'coach-engfa']),
  charlotte: findCustomImage(['charlotte', 'friend_charlotte']),
  gyo: findCustomImage(['gyo', 'dog_gyo']),
  phalo: findCustomImage(['phalo', 'rabbit_phalo']),
  tofu: findCustomImage(['tofy', 'tofu', 'tofu_mascot']),
  dobby: findCustomImage(['dobby', 'dog_dobby']),
  kraprao: findCustomImage(['kraprao', 'rabbit_kraprao']),
  main: findCustomImage(['main', 'mascot_main', 'mascotte']),
  fitworld: findCustomImage(['fitworld', 'fitworld_mascot', 'logo']),
};
