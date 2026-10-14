# 🎨 Cartella Immagini Personalizzate Coach & Mascotte (Custom Mascots)

Questa cartella è dedicata all'inserimento delle tue immagini personalizzate per i Coach e le Mascotte dell'app!

---

## 📁 Nomi File Consigliati

Puoi salvare le tue immagini (in formato `.png`, `.jpg`, `.jpeg`, `.webp` o `.svg`) direttamente in questa cartella:

| Personaggio | Nome file consigliato | Note |
|---|---|---|
| **Puzzola** | `puzzola.png` o `puzzola.jpg` | Coach azzurro / Diario della calma |
| **Coach Engfa** | `coach_engfa.png` o `coach_engfa.jpg` | Coach iniziale fitness |
| **Charlotte** | `charlotte.png` o `charlotte.jpg` | Coach rosa gentilezza |
| **Gyo** (Cagnolino) | `gyo.png` o `gyo.jpg` | Mascotte calma respiro |
| **Phalo** (Coniglietto) | `phalo.png` o `phalo.jpg` | Mascotte azzurro cielo |
| **Tofu** | `tofu.png` o `tofu.jpg` | Mascotte zen smeraldo |
| **Dobby** (Cagnolino) | `dobby.png` o `dobby.jpg` | Coach arancione grinta |
| **Kraprao** (Coniglietto) | `kraprao.png` o `kraprao.jpg` | Coach viola energia |
| **Mascotte Principale** | `mascot_main.png` | Ragazza chibi con occhiali |
| **Logo FitWorld** | `fitworld_mascot.png` | Mascotte icona app |

---

## 🛠️ Come utilizzarle nel codice

### Metodo 1: Chiedi all'Assistente AI
Dopo aver inserito un'immagine nella cartella (o incollando l'URL/file in chat), puoi semplicemente scrivere:
> *"Ho aggiunto l'immagine puff.png nella cartella custom_mascots, usala come immagine per Puff!"*

### Metodo 2: Modifica rapida in `src/assets/custom_mascots/index.ts`
All'interno di `src/assets/custom_mascots/index.ts`, puoi importare il tuo file:
```ts
import myCustomPuff from './puff.png';

export const CUSTOM_MASCOTS: Record<string, string | null> = {
  puzzola: myCustomPuff, // ora Puff userà la tua immagine!
  ...
};
```
