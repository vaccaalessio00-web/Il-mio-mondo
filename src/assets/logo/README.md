# 🌟 Cartella Logo dell'App (`src/assets/logo/`)

Questa cartella è dedicata all'inserimento del **Logo ufficiale dell'app MyWorld**!

---

## 📁 Nomi File Consigliati

Puoi salvare il file del logo in questa cartella con uno dei seguenti nomi:

| File | Formato consigliato | Descrizione |
|---|---|---|
| **`logo.jpeg.jpg`** / **`logo.jpeg`** | JPG/PNG | Logo principale dell'app caricato |
| **`app_logo.png`** | PNG con sfondo trasparente | Logo principale dell'app |
| **`app_logo.svg`** | SVG vettoriale | Logo in alta risoluzione |
| **`favicon.png`** | 32x32 o 64x64 PNG | Icona per la scheda del browser |

---

## 🛠️ Come attivare il tuo Logo nel codice

Il tuo logo è collegato in `src/assets/logo/index.ts`:
```ts
import logoFile from './logo.jpeg';

export const APP_CUSTOM_LOGO: string | null = logoFile;
```

Una volta collegato, il tuo logo appare automaticamente:
- Nell'**Header principale** in alto (accanto alla scritta *MyWorld*).
- Come **icona quando scarichi l'app** su cellulare/desktop (PWA, schermata Home, splash screen, favicon).
- Nella schermata delle **Routine / Benvenuto**.

