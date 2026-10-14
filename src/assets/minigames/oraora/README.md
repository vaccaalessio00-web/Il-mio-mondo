# 💋 Immagini per il Minigioco "Ora, Ora !" (`src/assets/minigames/oraora/`)

In questa cartella puoi inserire o sostituire liberamente tutte le immagini del minigioco **Ora, Ora !**.

---

## 📁 File e Nomi Riconosciuti

Puoi salvare le tue immagini (formati consigliati: `.png`, `.webp`, `.jpg`, `.jpeg`) con questi nomi:

| Nome file consigliato | Ruolo nel gioco | Note grafiche |
|-----------------------|-----------------|---------------|
| `background.png` (o `sfondo.png`) | Sfondo del camerino / stanza | Formato verticale 9:16 (es. 1080x1920) |
| `models_idle.png` (o `modelle_idle.png`) | Le due modelle a riposo / separate | Consigliato PNG con sfondo trasparente |
| `models_kissing.png` (o `modelle_bacio.png`) | Le due modelle che si baciano | Consigliato PNG con sfondo trasparente |
| `friends_idle.png` (o `amiche_idle.png`) | Amiche alla scrivania a riposo | In basso nello schermo |
| `friends_signal.png` (o `amiche_segnale.png`) | Amiche che danno il segnale di via libera / OK | In basso nello schermo |
| `boss_hidden.png` (o `capo_hidden.png`) | Capo nascosto | Immagine trasparente o vuota |
| `boss_warning.png` (o `capo_warning.png`) | Capo che si avvicina (ombra o avviso !) | In alto / centro della stanza |
| `boss_watching.png` (o `capo_watching.png`) | Capo che controlla e spia la stanza | In alto / centro della stanza |
| `boss_caught.png` (o `capo_caught.png`) | Capo arrabbiato quando scopre il bacio | In alto / centro della stanza |

---

## ⚡ Integrazione Automatica
Il gioco in `OraOraGame.tsx` carica direttamente queste immagini dalla cartella `src/assets/minigames/oraora/`.
Quando sostituisci un file, il gioco si aggiornerà automaticamente con la tua nuova grafica!
