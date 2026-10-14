/**
 * SMART IMAGE CUTOUT UTILITY (SCONTORNATORE AUTOMATICO)
 * 
 * Rimuove automaticamente lo sfondo dalle immagini dei personaggi al centro (centro*.jpg/png),
 * lasciando il soggetto trasparente e privo di contorni o cornici bianche.
 * 
 * Funzionalità:
 * 1. Rileva il colore dello sfondo dai bordi/angoli (bianco, grigio chiaro, tinte unite).
 * 2. Flood-fill dai bordi esterni per non cancellare i bianchi interni al personaggio (occhi, denti, dettagli).
 * 3. Sfumatura / anti-aliasing dei bordi per eliminare aloni e scalettature.
 * 4. Cache in memoria per evitare ricalcoli inutili ad ogni frame/render.
 */

const cutoutCache = new Map<string, string>();

/**
 * Calcola la distanza euclidea tra due colori RGB
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}

/**
 * Rimuove lo sfondo da un'immagine e restituisce un DataURL PNG con sfondo trasparente
 */
export async function removeBackground(
  imageSrc: string,
  options?: {
    threshold?: number;
    colorTolerance?: number;
    featherRadius?: number;
  }
): Promise<string> {
  if (!imageSrc) return imageSrc;

  // Controlla la cache in memoria
  if (cutoutCache.has(imageSrc)) {
    return cutoutCache.get(imageSrc)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoaded = () => {
      try {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;

        if (!naturalW || !naturalH) {
          resolve(imageSrc);
          return;
        }

        // Limita le dimensioni massime per performance istantanee ma qualità elevata
        const maxDim = 800;
        let w = naturalW;
        let h = naturalH;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Identifica gli asset sensibili (capo, modelle, pettegola)
        const isBoss = imageSrc.includes('boss_') || imageSrc.includes('boss');
        const isModels = imageSrc.includes('models_') || imageSrc.includes('models');
        const isPetegola1 = imageSrc.includes('petegola1');

        // Se l'immagine ha già pixel trasparenti sui bordi (PNG già nativamente scontornato),
        // preservala direttamente al 100% per evitare qualsiasi erosione degli occhi del capo, vestiti o dettagli!
        const hasTransparentBorder =
          data[3] < 30 ||
          data[(w - 1) * 4 + 3] < 30 ||
          data[((h - 1) * w) * 4 + 3] < 30 ||
          data[(w * h - 1) * 4 + 3] < 30;

        if (hasTransparentBorder) {
          resolve(imageSrc);
          return;
        }

        // 1. Inizializza maschera sfondo: i pixel già trasparenti vengono marcati come sfondo
        const isBackground = new Uint8Array(w * h);
        const queue = new Int32Array(w * h * 2);
        let qHead = 0;
        let qTail = 0;

        // Campiona i bordi e gli angoli superiori/laterali per rilevare i colori dello sfondo
        const candidateCoords = [
          { x: 3, y: 3 },
          { x: w - 4, y: 3 },
          { x: Math.floor(w / 2), y: 3 },
          { x: 3, y: Math.floor(h * 0.25) },
          { x: w - 4, y: Math.floor(h * 0.25) },
          { x: 3, y: Math.floor(h * 0.5) },
          { x: w - 4, y: Math.floor(h * 0.5) },
        ];

        const bgCandidates: { r: number; g: number; b: number }[] = [];
        candidateCoords.forEach(c => {
          if (c.x >= 0 && c.x < w && c.y >= 0 && c.y < h) {
            const idx = (c.y * w + c.x) * 4;
            if (data[idx + 3] > 80) {
              bgCandidates.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
            }
          }
        });

        const primaryBg = bgCandidates[0] || { r: 255, g: 255, b: 255 };
        const isWhiteOrLight = bgCandidates.length === 0 || bgCandidates.some(c => c.r > 175 && c.g > 175 && c.b > 175);

        const tolerance = options?.colorTolerance ?? (isWhiteOrLight ? 68 : 55);
        const nearWhiteThreshold = options?.threshold ?? (isWhiteOrLight ? 180 : 200);

        const isBgMatch = (r: number, g: number, b: number) => {
          if (isModels || isBoss) {
            // Mai considerare sfondo il bianco di maglietta o scarpe delle modelle, né gli occhi del capo
            return false;
          }
          if (r >= nearWhiteThreshold && g >= nearWhiteThreshold && b >= nearWhiteThreshold) {
            return true;
          }
          if (r >= 170 && g >= 170 && b >= 170 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25) {
            return true;
          }
          for (let i = 0; i < bgCandidates.length; i++) {
            const cand = bgCandidates[i];
            if (colorDistance(r, g, b, cand.r, cand.g, cand.b) <= tolerance) {
              return true;
            }
          }
          return colorDistance(r, g, b, primaryBg.r, primaryBg.g, primaryBg.b) <= tolerance;
        };

        const enqueue = (x: number, y: number) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (isBackground[idx] === 0) {
            const pIdx = idx * 4;
            if (data[pIdx + 3] < 50 || isBgMatch(data[pIdx], data[pIdx + 1], data[pIdx + 2])) {
              isBackground[idx] = 1;
              queue[qTail++] = x;
              queue[qTail++] = y;
            }
          }
        };

        // Enqueue bordi esterni
        for (let depth = 0; depth <= 3; depth++) {
          for (let x = 0; x < w; x++) {
            enqueue(x, depth);
            enqueue(x, h - 1 - depth);
          }
          for (let y = 0; y < h; y++) {
            enqueue(depth, y);
            enqueue(w - 1 - depth, y);
          }
        }

        // Se ci sono pixel trasparenti già esistenti, usali come semi di flood-fill
        for (let y = 0; y < h; y += 4) {
          for (let x = 0; x < w; x += 4) {
            const idx = y * w + x;
            if (data[idx * 4 + 3] < 50 && isBackground[idx] === 0) {
              enqueue(x, y);
            }
          }
        }

        // BFS esterno
        while (qHead < qTail) {
          const cx = queue[qHead++];
          const cy = queue[qHead++];

          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (let i = 0; i < 4; i++) {
            const nx = neighbors[i][0];
            const ny = neighbors[i][1];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nIdx = ny * w + nx;
              if (isBackground[nIdx] === 0) {
                const npIdx = nIdx * 4;
                if (data[npIdx + 3] < 50 || isBgMatch(data[npIdx], data[npIdx + 1], data[npIdx + 2])) {
                  isBackground[nIdx] = 1;
                  queue[qTail++] = nx;
                  queue[qTail++] = ny;
                }
              }
            }
          }
        }

        // 2. Rileva isole di sfondo bianco/chiaro intrappolate TRA LE BRACCIA e sotto il corpo
        // Protegge occhi e piccoli dettagli del viso (y < 0.38*h con dimensione piccola)
        const visitedHoles = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (isBackground[idx] === 1 || visitedHoles[idx] === 1) continue;
            const pIdx = idx * 4;
            const r = data[pIdx];
            const g = data[pIdx + 1];
            const b = data[pIdx + 2];
            const a = data[pIdx + 3];

            if (a > 50 && isBgMatch(r, g, b)) {
              // BFS per questa isola
              const comp: number[] = [x, y];
              visitedHoles[idx] = 1;
              let cHead = 0;
              let minY = y, maxY = y, minX = x, maxX = x;

              while (cHead < comp.length) {
                const cx = comp[cHead++];
                const cy = comp[cHead++];
                if (cy < minY) minY = cy;
                if (cy > maxY) maxY = cy;
                if (cx < minX) minX = cx;
                if (cx > maxX) maxX = cx;

                const nbs = [
                  [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
                ];
                for (let k = 0; k < 4; k++) {
                  const nx = nbs[k][0];
                  const ny = nbs[k][1];
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    const nIdx = ny * w + nx;
                    if (isBackground[nIdx] === 0 && visitedHoles[nIdx] === 0) {
                      const np = nIdx * 4;
                      if (data[np + 3] > 50 && isBgMatch(data[np], data[np + 1], data[np + 2])) {
                        visitedHoles[nIdx] = 1;
                        comp.push(nx, ny);
                      }
                    }
                  }
                }
              }

              const compSize = comp.length / 2;
              // Proteggi sempre i vestiti bianchi e dettagli (maglietta e scarpe delle modelle, occhi del capo, pantaloni pettegola)
              const isBoss = imageSrc.includes('boss_') || imageSrc.includes('boss');
              if (isBoss) {
                // Mai forare gli occhi o il viso del capo
                continue;
              }
              const isPetegola1 = imageSrc.includes('petegola1');
              if (isPetegola1 && minY > 0.52 * h) {
                // Non toccare i pantaloni/gambe di petegola 1
                continue;
              }
              const isModels = imageSrc.includes('models_') || imageSrc.includes('models');
              if (isModels) {
                // Non forare la maglietta bianca e le scarpe delle modelle
                continue;
              }

              // Se si trova nella zona braccia/corpo (y > 0.38*h), oppure è una grande isola bianca, oppure è sul fondo
              const isArmOrBodyBackground = (minY > 0.38 * h && maxY < 0.88 * h && compSize > 250) || (minY > 0.38 * h && compSize > 500);
              if (isArmOrBodyBackground) {
                for (let k = 0; k < comp.length; k += 2) {
                  const px = comp[k];
                  const py = comp[k + 1];
                  isBackground[py * w + px] = 1;
                }
              }
            }
          }
        }

        // 3. Applica la trasparenza ai pixel marcati e rimuovi gli aloni chiari / anti-aliasing
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const pIdx = idx * 4;

            if (isBackground[idx] === 1) {
              data[pIdx + 3] = 0; // Trasparente al 100%
            } else {
              // Controlla se il pixel è adiacente allo sfondo per eliminare aloni bianchi
              let bgNeighbors = 0;
              if (x > 0 && isBackground[idx - 1] === 1) bgNeighbors++;
              if (x < w - 1 && isBackground[idx + 1] === 1) bgNeighbors++;
              if (y > 0 && isBackground[idx - w] === 1) bgNeighbors++;
              if (y < h - 1 && isBackground[idx + w] === 1) bgNeighbors++;

              if (bgNeighbors > 0) {
                const r = data[pIdx];
                const g = data[pIdx + 1];
                const b = data[pIdx + 2];
                const brightness = (r + g + b) / 3;

                // Se è un pixel chiarissimo o quasi bianco sui bordi (alone), rendilo trasparente
                if (brightness >= 175) {
                  data[pIdx + 3] = 0;
                } else if (bgNeighbors >= 2) {
                  data[pIdx + 3] = Math.floor(data[pIdx + 3] * 0.45);
                } else {
                  data[pIdx + 3] = Math.floor(data[pIdx + 3] * 0.75);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');
        cutoutCache.set(imageSrc, resultUrl);
        resolve(resultUrl);
      } catch (err) {
        console.warn('Errore rimozione sfondo:', err);
        resolve(imageSrc);
      }
    };

    img.onload = () => {
      handleLoaded();
    };
    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
    if (img.complete) {
      handleLoaded();
    }
  });
}
