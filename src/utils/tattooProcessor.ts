/**
 * TATTOO SHEET PROCESSOR & BACKGROUND REMOVER
 * 
 * Gestisce:
 * 1. Rimozione automatica dello sfondo chiaro/bianco (trasparenza pura, zero contorni/aloni)
 * 2. Riconoscimento ed estrazione di tatuaggi multipli presenti sulla stessa pagina/foglio
 * 3. Conversione in DataURL PNG pronti per essere applicati sul corpo di Magi
 */

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Rimuove lo sfondo chiaro/bianco da un'immagine tramite Canvas 2D
 */
export function removeBackgroundFromCanvas(
  sourceCanvas: HTMLCanvasElement,
  threshold = 210
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Campiona i 4 angoli per rilevare eventuale colore dello sfondo dominante
  const sampleCorners = [
    0, // top-left
    (w - 1) * 4, // top-right
    ((h - 1) * w) * 4, // bottom-left
    ((h - 1) * w + (w - 1)) * 4 // bottom-right
  ];

  let avgCornerR = 0;
  let avgCornerG = 0;
  let avgCornerB = 0;
  for (const idx of sampleCorners) {
    avgCornerR += data[idx];
    avgCornerG += data[idx + 1];
    avgCornerB += data[idx + 2];
  }
  avgCornerR /= 4;
  avgCornerG /= 4;
  avgCornerB /= 4;

  const cornerIsLight = avgCornerR > 180 && avgCornerG > 180 && avgCornerB > 180;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Se il pixel è quasi bianco o molto vicino al colore chiaro degli angoli
    const isNearWhite = r >= threshold && g >= threshold && b >= threshold;
    const distToCorner = Math.hypot(r - avgCornerR, g - avgCornerG, b - avgCornerB);
    const isCornerBg = cornerIsLight && distToCorner < 38;

    if (isNearWhite || isCornerBg) {
      data[i + 3] = 0; // Trasparente al 100%
    } else if (cornerIsLight && distToCorner < 55) {
      // Ammorbidisci gradualmente il bordo esterno per evitare contorni netti
      const factor = (distToCorner - 38) / 17;
      data[i + 3] = Math.floor(data[i + 3] * factor);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return sourceCanvas;
}

/**
 * Trova i cluster (singoli tatuaggi) all'interno di una pagina/foglio
 */
function findInkClusters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dilation = 12
): BoundingBox[] {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Griglia ridotta per performance istantanee
  const scale = 2;
  const gw = Math.ceil(width / scale);
  const gh = Math.ceil(height / scale);
  const grid = new Uint8Array(gw * gh);

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      let opaque = false;
      for (let dy = 0; dy < scale && !opaque; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const x = gx * scale + dx;
          const y = gy * scale + dy;
          if (x < width && y < height) {
            const a = data[(y * width + x) * 4 + 3];
            if (a > 30) {
              opaque = true;
              break;
            }
          }
        }
      }
      if (opaque) grid[gy * gw + gx] = 1;
    }
  }

  // Dilatazione morfologica: unisce i tratti appartenenti allo stesso disegno
  const dCells = Math.max(1, Math.ceil(dilation / scale));
  const dilated = new Uint8Array(gw * gh);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (grid[gy * gw + gx] === 1) {
        for (let dy = -dCells; dy <= dCells; dy++) {
          for (let dx = -dCells; dx <= dCells; dx++) {
            const ny = gy + dy;
            const nx = gx + dx;
            if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) {
              dilated[ny * gw + nx] = 1;
            }
          }
        }
      }
    }
  }

  // BFS / Flood-Fill per trovare componenti connesse distinte
  const visited = new Uint8Array(gw * gh);
  const boxes: BoundingBox[] = [];

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const startIdx = gy * gw + gx;
      if (dilated[startIdx] === 1 && !visited[startIdx]) {
        let minX = gx;
        let maxX = gx;
        let minY = gy;
        let maxY = gy;
        let pixelCount = 0;

        const queue: number[] = [gx, gy];
        visited[startIdx] = 1;
        let head = 0;

        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          pixelCount++;

          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          const neighbors = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
          ];
          for (const [ndx, ndy] of neighbors) {
            const nx = cx + ndx;
            const ny = cy + ndy;
            if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) {
              const idx = ny * gw + nx;
              if (dilated[idx] === 1 && !visited[idx]) {
                visited[idx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }

        const boxW = (maxX - minX + 1) * scale;
        const boxH = (maxY - minY + 1) * scale;

        // Filtra via piccoli disturbi o imperfezioni (deve essere almeno 24x24 px)
        if (boxW >= 24 && boxH >= 24 && pixelCount >= 20) {
          boxes.push({
            x: Math.max(0, minX * scale - 6),
            y: Math.max(0, minY * scale - 6),
            w: Math.min(width - (minX * scale - 6), boxW + 12),
            h: Math.min(height - (minY * scale - 6), boxH + 12)
          });
        }
      }
    }
  }

  // Ordina i box in ordine di lettura naturale (dall'alto in basso, da sinistra a destra)
  boxes.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 40) return a.y - b.y;
    return a.x - b.x;
  });

  return boxes;
}

/**
 * Carica un'immagine, toglie lo sfondo ed estrae tutti i tatuaggi (sia singoli che da fogli con più tatuaggi)
 */
export async function processTattooSheet(
  imageSource: string | File
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoaded = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) {
          resolve([]);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve([]);
          return;
        }

        ctx.drawImage(img, 0, 0);

        // 1. Rimuovi lo sfondo bianco/chiaro
        removeBackgroundFromCanvas(canvas);

        // 2. Trova se sono presenti più tatuaggi separati nel foglio
        const clusters = findInkClusters(ctx, w, h, 14);

        if (clusters.length > 1) {
          // Più tatuaggi nel foglio! Estrai ciascun tatuaggio come singola immagine ritagliata
          const extractedTattoos: string[] = [];

          for (const box of clusters) {
            const subCanvas = document.createElement('canvas');
            subCanvas.width = box.w;
            subCanvas.height = box.h;
            const subCtx = subCanvas.getContext('2d');
            if (subCtx) {
              subCtx.drawImage(
                canvas,
                box.x, box.y, box.w, box.h,
                0, 0, box.w, box.h
              );
              extractedTattoos.push(subCanvas.toDataURL('image/png'));
            }
          }

          if (extractedTattoos.length > 0) {
            resolve(extractedTattoos);
            return;
          }
        }

        // Se è un solo tatuaggio (o se la separazione restituisce 1 cluster)
        resolve([canvas.toDataURL('image/png')]);
      } catch (err) {
        console.warn('Errore processTattooSheet:', err);
        // Fallback: se errore canvas o tainted cross-origin, restituisce l'src originale se stringa
        if (typeof imageSource === 'string') {
          resolve([imageSource]);
        } else {
          resolve([]);
        }
      }
    };

    img.onerror = () => {
      resolve([]);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
      if (img.complete) {
        handleLoaded();
      } else {
        img.onload = handleLoaded;
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = handleLoaded;
      };
      reader.onerror = () => resolve([]);
      reader.readAsDataURL(imageSource);
    }
  });
}
