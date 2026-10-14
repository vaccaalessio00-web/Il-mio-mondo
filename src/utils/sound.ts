// Web Audio API sound generator for cute fitness timer & cheer sounds

class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;

  constructor() {
    // Initialized lazily on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      const effectiveVol = this.isEnabled ? this.volume : 0;
      this.masterGain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public get destination(): AudioNode {
    this.initCtx();
    return this.masterGain || this.ctx!.destination;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.initCtx();
    if (this.ctx && this.masterGain) {
      const effectiveVol = this.isEnabled ? this.volume : 0;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    this.initCtx();
    if (this.ctx && this.masterGain) {
      const effectiveVol = this.isEnabled ? this.volume : 0;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public playVolumePreview() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5 preview chime
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  // Cute chime when rest timer finishes (Pastel ding-dong)
  public playTimerFinish() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1: E5 (659Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(this.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Note 2: G#5 (830Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(this.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);

      // Note 3: B5 (987Hz)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.3);
      gain3.gain.setValueAtTime(0.3, now + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(this.destination);
      osc3.start(now + 0.3);
      osc3.stop(now + 1.2);

      // Haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 200]);
      }
    } catch {
      // Audio not supported or blocked
    }
  }

  // Short pop when ticking or ticking countdown
  public playTick() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Sparkling cute pop when checking a completed set
  public playCheckSet() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    } catch {
      // ignore
    }
  }

  // Play pleasant chime for sync or success
  public playSuccess() {
    this.playCheckSet();
  }

  // Mission completed cheerful chime & fanfare
  public playMissionComplete() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Cheerful sparkling arpeggio: G4 -> C5 -> E5 -> G5 -> C6
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const time = start + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        const noteVol = (this.volume / 100) * 0.28;
        gain.gain.setValueAtTime(noteVol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(time);
        osc.stop(time + 0.35);
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 90]);
      }
    } catch {
      // ignore
    }
  }

  // Workout completed victory melody
  public playVictory() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const time = start + idx * 0.14;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(time);
        osc.stop(time + 0.4);
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 300]);
      }
    } catch {
      // ignore
    }
  }

  // ILE IN AZIONE: Suono morbido di cattura (manette / click simpatico + sparkle)
  public playHandcuffCapture() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const start = this.ctx.currentTime;

      // Morbido click metallico dolce
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, start);
      osc1.frequency.exponentialRampToValueAtTime(1320, start + 0.05);
      gain1.gain.setValueAtTime((this.volume / 100) * 0.18, start);
      gain1.gain.exponentialRampToValueAtTime(0.001, start + 0.06);
      osc1.connect(gain1);
      gain1.connect(this.destination);
      osc1.start(start);
      osc1.stop(start + 0.06);

      // Secondo click "clack" morbido
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046, start + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(1560, start + 0.14);
      gain2.gain.setValueAtTime((this.volume / 100) * 0.22, start + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      osc2.connect(gain2);
      gain2.connect(this.destination);
      osc2.start(start + 0.07);
      osc2.stop(start + 0.18);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    } catch {
      // ignore
    }
  }

  // ILE IN AZIONE: Fischietto morbido e simpatico
  public playPoliceWhistle() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const start = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, start); // E6
      osc.frequency.setValueAtTime(1567.98, start + 0.08); // G6
      gain.gain.setValueAtTime((this.volume / 100) * 0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(start);
      osc.stop(start + 0.22);
    } catch {
      // ignore
    }
  }

  // ILE IN AZIONE: Pausa amichevole del cartello ALT (nessun suono punitivo, tono rassicurante)
  public playTrafficPause() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const start = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, start); // A4 morbido
      osc.frequency.exponentialRampToValueAtTime(392, start + 0.3); // G4 dolce
      gain.gain.setValueAtTime((this.volume / 100) * 0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(start);
      osc.stop(start + 0.35);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([35, 40, 35]);
      }
    } catch {
      // ignore
    }
  }

  // ILE IN AZIONE: Pausa ciambella al bar (suono caldo e rilassante)
  public playDonutChime() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const time = start + idx * 0.12;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime((this.volume / 100) * 0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(time);
        osc.stop(time + 0.5);
      });
    } catch {
      // ignore
    }
  }

  // Breathing sounds
  private currentBreathOsc: OscillatorNode | null = null;
  private currentBreathGain: GainNode | null = null;

  public playBreathIn() {
    if (!this.isEnabled) return;
    this.playBreathingTone(261.63, 0.16, 4.0); // C4 long inhale
  }

  public playBreathHold() {
    if (!this.isEnabled) return;
    this.playBreathingTone(329.63, 0.09, 5.0); // E4 hold
  }

  public playBreathOut() {
    if (!this.isEnabled) return;
    this.playBreathingTone(196.0, 0.13, 8.0); // G3 long exhale
  }

  public stopBreathSounds() {
    try {
      if (this.currentBreathGain && this.ctx) {
        this.currentBreathGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.currentBreathGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.currentBreathOsc) {
        this.currentBreathOsc.stop();
        this.currentBreathOsc.disconnect();
        this.currentBreathOsc = null;
      }
      this.currentBreathGain = null;
    } catch {
      // ignore
    }
  }

  private playBreathingTone(freq: number, volume: number, duration: number) {
    try {
      this.stopBreathSounds();
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
      this.currentBreathOsc = osc;
      this.currentBreathGain = gain;
    } catch {}
  }

  // Sieve game sounds (volume complessivo ridotto del 10%)
  public playSieveMove() {
    if (!this.isEnabled) return;
    // Volume abbassato del 10% (da 0.10 a 0.09)
    this.playTone(432.0, 0.09, 0.18);
  }

  // Suono per il completamento di una singola riga (quando ci sono più righe)
  public playSieveRowComplete() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Dolce bicordo ascendente rilassante: F4 (349Hz) -> A4 (440Hz), volume morbido -10%
      const notes = [349.23, 440.0];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.075, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.65);
      });
    } catch {}
  }

  // Suono per il completamento di tutte le righe (arpeggio sereno completo, volume -10%)
  public playSieveComplete() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Arpeggio sereno a 4 toni: D4, F#4, A4, D5, volume attenuato del 10%
      const notes = [293.66, 369.99, 440.0, 587.33];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.0001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.9);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.95);
      });
    } catch {}
  }

  // Lantern game sounds
  private waterNoiseNode: AudioBufferSourceNode | null = null;
  public playWaterNoise() {
    if (!this.isEnabled || this.waterNoiseNode) return;
    this.initCtx();
    if (!this.ctx) return;
    
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
    }
    this.waterNoiseNode = this.ctx.createBufferSource();
    this.waterNoiseNode.buffer = buffer;
    this.waterNoiseNode.loop = true;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    const gain = this.ctx.createGain();
    gain.gain.value = 0.1;
    
    this.waterNoiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);
    this.waterNoiseNode.start();
  }

  public stopWaterNoise() {
    if (this.waterNoiseNode) {
        this.waterNoiseNode.stop();
        this.waterNoiseNode = null;
    }
  }

  public playLanternRelease(freq: number) {
    if (!this.isEnabled) return;
    this.playTone(freq, 0.08, 2.0); // Lower volume (0.08) and longer duration for relaxation
  }

  // Gomitolo (Ball of Yarn) sounds
  private woolNoiseNode: AudioBufferSourceNode | null = null;
  private woolGainNode: GainNode | null = null;

  public startWoolRustle() {
    if (!this.isEnabled || this.woolNoiseNode) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Warm brown noise simulation
        data[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = data[i];
      }

      this.woolNoiseNode = this.ctx.createBufferSource();
      this.woolNoiseNode.buffer = buffer;
      this.woolNoiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.woolGainNode = this.ctx.createGain();
      this.woolGainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.woolNoiseNode.connect(filter);
      filter.connect(this.woolGainNode);
      this.woolGainNode.connect(this.destination);

      this.woolNoiseNode.start();
    } catch {}
  }

  public setWoolRustleIntensity(intensity: number) {
    try {
      if (this.woolGainNode && this.ctx) {
        // Raised by 10% (0.037 * 1.10 = ~0.041)
        const target = Math.min(Math.max(intensity, 0), 1) * 0.041;
        this.woolGainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
      }
    } catch {}
  }

  public stopWoolRustle() {
    try {
      if (this.woolGainNode && this.ctx) {
        this.woolGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      setTimeout(() => {
        if (this.woolNoiseNode) {
          try {
            this.woolNoiseNode.stop();
            this.woolNoiseNode.disconnect();
          } catch {}
          this.woolNoiseNode = null;
          this.woolGainNode = null;
        }
      }, 80);
    } catch {
      this.woolNoiseNode = null;
      this.woolGainNode = null;
    }
  }

  // Deep, warm, tranquil tactile notes for each drag movement (strictly warm low/mid tones: 146Hz - 329Hz)
  private yarnDragScale = [
    146.83, // D3 (profonda e calma)
    164.81, // E3
    196.00, // G3 (calda)
    220.00, // A3
    246.94, // B3
    261.63, // C4 (rotonda)
    293.66, // D4
    329.63, // E4
    293.66, // D4
    261.63, // C4
    220.00, // A3
    196.00, // G3
    164.81  // E3
  ];
  private lastDragNoteTime = 0;
  private yarnSoundEndTime = 0; // Lock to guarantee sounds never overlap

  // Plays a soothing, non-acute note every time the user drags the finger, strictly non-overlapping
  public playYarnDragSound(step: number = 0) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // REGOLA ANTI-SOVRAPPOSIZIONE: finché c'è un altro suono in corso non farne partire un altro
      if (now < this.yarnSoundEndTime) return;
      if (now - this.lastDragNoteTime < 0.14) return;
      this.lastDragNoteTime = now;

      const noteDuration = 0.44;
      this.yarnSoundEndTime = now + noteDuration;

      const idx = Math.abs(step) % this.yarnDragScale.length;
      const freq = this.yarnDragScale[idx];

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Filtro passa-basso morbido a 380Hz per togliere qualsiasi nota stridula o acuta
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);

      // Onda morbida sinusoidale per timbro tipo kalimba / marimba in legno caldo
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 0.5, now); // Sub-tono caldo rilassante

      // Volume alzato di un ulteriore 10% (0.0425 rispetto al precedente 0.0385)
      const volume = 0.0425;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0004, now + noteDuration - 0.04);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.3, now);

      osc.connect(filter);
      overtone.connect(subGain);
      subGain.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + noteDuration);
      overtone.stop(now + noteDuration);
    } catch {}
  }

  // Backward compatibility alias
  public playYarnScrollNote(step: number) {
    this.playYarnDragSound(step);
  }

  // 12 deep, warm, tranquil, non-acute soothing melodies (146Hz - 293Hz max, strictly low/mid tones)
  // All gains boosted by 10%
  private yarnMelodies: { freq: number; delay: number; gain?: number; duration?: number }[][] = [
    // 1. Campana Zen D3 (146.83 Hz - profonda e distensiva)
    [{ freq: 146.83, delay: 0, duration: 1.8, gain: 0.058 }],
    // 2. Risveglio Basso E3 -> G3 (164.81 Hz -> 196.00 Hz)
    [{ freq: 164.81, delay: 0, duration: 1.4, gain: 0.052 }, { freq: 196.00, delay: 0.45, duration: 1.4, gain: 0.046 }],
    // 3. Ciotola Tibetana A3 (220.00 Hz - risonanza calda)
    [{ freq: 220.00, delay: 0, duration: 1.9, gain: 0.056 }],
    // 4. Discesa di Calma G3 -> D3 (196.00 Hz -> 146.83 Hz)
    [{ freq: 196.00, delay: 0, duration: 1.3, gain: 0.052 }, { freq: 146.83, delay: 0.4, duration: 1.5, gain: 0.056 }],
    // 5. Quinta Distensiva E3 -> B3 (164.81 Hz -> 246.94 Hz)
    [{ freq: 164.81, delay: 0, duration: 1.3, gain: 0.053 }, { freq: 246.94, delay: 0.4, duration: 1.4, gain: 0.048 }],
    // 6. Risonanza Notturna B3 -> G3 (246.94 Hz -> 196.00 Hz)
    [{ freq: 246.94, delay: 0, duration: 1.3, gain: 0.048 }, { freq: 196.00, delay: 0.42, duration: 1.5, gain: 0.052 }],
    // 7. Respiro Calmo C4 -> A3 (261.63 Hz -> 220.00 Hz)
    [{ freq: 261.63, delay: 0, duration: 1.2, gain: 0.048 }, { freq: 220.00, delay: 0.4, duration: 1.5, gain: 0.052 }],
    // 8. Oasi di Pace G3 (196.00 Hz - calda e avvolgente)
    [{ freq: 196.00, delay: 0, duration: 1.8, gain: 0.058 }],
    // 9. Quarta Mite A3 -> E3 (220.00 Hz -> 164.81 Hz)
    [{ freq: 220.00, delay: 0, duration: 1.3, gain: 0.051 }, { freq: 164.81, delay: 0.4, duration: 1.5, gain: 0.056 }],
    // 10. Suono Radicato D3 -> A3 (146.83 Hz -> 220.00 Hz)
    [{ freq: 146.83, delay: 0, duration: 1.4, gain: 0.058 }, { freq: 220.00, delay: 0.45, duration: 1.4, gain: 0.048 }],
    // 11. Accordo Dolce G3 + C4 (196.00 Hz e 261.63 Hz simultanei ma morbidi)
    [{ freq: 196.00, delay: 0, duration: 1.7, gain: 0.044 }, { freq: 261.63, delay: 0.06, duration: 1.5, gain: 0.041 }],
    // 12. Soave Rilascio D4 -> G3 (293.66 Hz -> 196.00 Hz)
    [{ freq: 293.66, delay: 0, duration: 1.2, gain: 0.044 }, { freq: 196.00, delay: 0.42, duration: 1.6, gain: 0.053 }]
  ];

  private lastYarnMelodyIdx = -1;
  private lastMelodyStartTime = 0;

  public playKalimbaChime(step?: number) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // REGOLA ANTI-SOVRAPPOSIZIONE: finché c'è un altro suono in corso non farne partire un altro
      if (now < this.yarnSoundEndTime) return;
      if (now - this.lastMelodyStartTime < 1.8) return;
      this.lastMelodyStartTime = now;

      // Select next melody guaranteeing no immediate repetitions
      let idx: number;
      if (typeof step === 'number') {
        idx = Math.abs(step) % this.yarnMelodies.length;
        if (idx === this.lastYarnMelodyIdx) {
          idx = (idx + 1) % this.yarnMelodies.length;
        }
      } else {
        do {
          idx = Math.floor(Math.random() * this.yarnMelodies.length);
        } while (idx === this.lastYarnMelodyIdx && this.yarnMelodies.length > 1);
      }
      this.lastYarnMelodyIdx = idx;

      const melody = this.yarnMelodies[idx];
      let maxMelodyEnd = 0;

      melody.forEach(note => {
        const time = now + note.delay;
        const dur = note.duration || 1.8;
        const noteEnd = note.delay + dur;
        if (noteEnd > maxMelodyEnd) maxMelodyEnd = noteEnd;
        const volume = note.gain || 0.052;

        const osc1 = this.ctx!.createOscillator();
        const osc2 = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        // Filtro passa-basso morbido per eliminare qualsiasi frequenza acuta o stridula
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, time);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(note.freq, time);

        // Sub-tono caldo per una risonanza profonda tipo ciotola tibetana / marimba di legno
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(note.freq * 0.5, time);

        gain.gain.setValueAtTime(0.0001, time);
        // Attacco lento e morbido (niente click o scatti)
        gain.gain.linearRampToValueAtTime(volume, time + 0.12);
        // Lento decadimento calmo e distensivo
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        const subGain = this.ctx!.createGain();
        subGain.gain.setValueAtTime(0.2, time);

        osc1.connect(filter);
        osc2.connect(subGain);
        subGain.connect(filter);
        filter.connect(gain);
        gain.connect(this.destination);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + dur + 0.05);
        osc2.stop(time + dur + 0.05);
      });

      // Imposta il blocco temporale per l'intera durata della melodia
      this.yarnSoundEndTime = now + maxMelodyEnd;
    } catch {}
  }

  public playYarnDissolve() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Blocca nuovi suoni durante la dissolvenza finale
      this.yarnSoundEndTime = now + 2.0;

      // Frequenze calde e rilassanti per la dissolvenza finale, volume +10% (0.0465)
      const notes = [146.83, 196.00, 220.00, 261.63, 293.66, 329.63]; // D3, G3, A3, C4, D4, E4
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.14);
        gain.gain.setValueAtTime(0.0001, now + i * 0.14);
        gain.gain.linearRampToValueAtTime(0.0465, now + i * 0.14 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 1.8);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 1.9);
      });
    } catch {}
  }

  // =========================================================================
  // LA LAVAGNA A SCOMPARSA (Luminescent Slate) Interactive Synth
  // Ambient continuous gliding tone (200Hz - 450Hz, lowpass filter, 1s fade-out)
  // =========================================================================
  private slateOsc: OscillatorNode | null = null;
  private slateSubOsc: OscillatorNode | null = null;
  private slateFilter: BiquadFilterNode | null = null;
  private slateGain: GainNode | null = null;
  private isSlateTonePlaying = false;

  public startSlateTone(xRatio: number = 0.5, yRatio: number = 0.5) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (!this.slateGain) {
        this.slateGain = this.ctx.createGain();
        this.slateGain.connect(this.destination);
      }

      const targetVol = 0.048;
      this.slateGain.gain.cancelScheduledValues(now);
      this.slateGain.gain.setValueAtTime(Math.max(0.0001, this.slateGain.gain.value), now);
      this.slateGain.gain.linearRampToValueAtTime(targetVol, now + 0.2);

      if (!this.isSlateTonePlaying || !this.slateOsc) {
        const baseFreq = 200 + (1 - yRatio) * 210 + xRatio * 30;

        this.slateFilter = this.ctx.createBiquadFilter();
        this.slateFilter.type = 'lowpass';
        this.slateFilter.frequency.setValueAtTime(360, now);

        this.slateOsc = this.ctx.createOscillator();
        this.slateOsc.type = 'sine';
        this.slateOsc.frequency.setValueAtTime(baseFreq, now);

        this.slateSubOsc = this.ctx.createOscillator();
        this.slateSubOsc.type = 'sine';
        this.slateSubOsc.frequency.setValueAtTime(baseFreq * 0.5, now);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0.24, now);

        this.slateOsc.connect(this.slateFilter);
        this.slateSubOsc.connect(subGain);
        subGain.connect(this.slateFilter);
        this.slateFilter.connect(this.slateGain);

        this.slateOsc.start(now);
        this.slateSubOsc.start(now);
        this.isSlateTonePlaying = true;
      }
    } catch {}
  }

  public updateSlateTone(xRatio: number, yRatio: number) {
    if (!this.isEnabled || !this.ctx || !this.slateOsc || !this.slateSubOsc) return;
    try {
      const now = this.ctx.currentTime;
      const clampedX = Math.max(0, Math.min(1, xRatio));
      const clampedY = Math.max(0, Math.min(1, yRatio));
      // Calming low-mid frequency range (200Hz - 440Hz)
      const baseFreq = 200 + (1 - clampedY) * 210 + clampedX * 30;
      this.slateOsc.frequency.setTargetAtTime(baseFreq, now, 0.08);
      this.slateSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.08);

      if (this.slateFilter) {
        const filterCutoff = 300 + (1 - clampedY) * 120;
        this.slateFilter.frequency.setTargetAtTime(filterCutoff, now, 0.08);
      }
    } catch {}
  }

  public stopSlateTone(fadeDuration: number = 1.0) {
    if (!this.ctx || !this.slateGain) return;
    try {
      const now = this.ctx.currentTime;
      this.slateGain.gain.cancelScheduledValues(now);
      this.slateGain.gain.setValueAtTime(Math.max(0.0001, this.slateGain.gain.value), now);
      this.slateGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        if (!this.isSlateTonePlaying) {
          try {
            this.slateOsc?.stop();
            this.slateSubOsc?.stop();
            this.slateOsc?.disconnect();
            this.slateSubOsc?.disconnect();
            this.slateOsc = null;
            this.slateSubOsc = null;
          } catch {}
        }
      }, fadeDuration * 1000 + 40);

      this.isSlateTonePlaying = false;
    } catch {}
  }

  // Soft breeze breath and harmonic chime on "Soffio" / "Svanisci ora"
  public playSlateBreezeWhoosh() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft filtered noise breeze
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.2);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.12;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 1.0);
      filter.Q.setValueAtTime(1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      noise.start(now);
      noise.stop(now + 1.2);

      // Subtle celestial chord (D3, G3, A3, D4)
      const chimes = [146.83, 196.0, 220.0, 293.66];
      chimes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const oGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        oGain.gain.setValueAtTime(0.0001, now + i * 0.08);
        oGain.gain.linearRampToValueAtTime(0.035, now + i * 0.08 + 0.06);
        oGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.3);
        osc.connect(oGain);
        oGain.connect(this.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.4);
      });
    } catch {}
  }

  // =========================================================================
  // PASSO DOPO PASSO CON NINNI (Doggy Calm Minigame)
  // Soft footsteps, biscuit collect chime, questioning head-tilt alert, victory
  // =========================================================================
  private lastStepSoundTime = 0;
  public playNinniStep() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (now - this.lastStepSoundTime < 0.24) return;
      this.lastStepSoundTime = now;

      // Extremely gentle low-frequency pitter-patter sound (160Hz - 210Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(175 + Math.random() * 25, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  public playNinniBiscuit() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Sweet cheerful munch & happy chime (D4 -> A4 -> D5)
      const freqs = [293.66, 440.0, 587.33];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.065, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.48);
      });
    } catch {}
  }

  public playNinniAlert() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Inquisitive, tender soft rising chime: D4 -> F4 (soothing question mark)
      const freqs = [293.66, 349.23];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.5);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.52);
      });
    } catch {}
  }

  public playNinniVictory() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Joyful, cozy harp arpeggio (C4, E4, G4, A4, C5)
      const freqs = [261.63, 329.63, 392.00, 440.00, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.11 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.85);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.9);
      });
    } catch {}
  }

  // ==========================================
  // IL GIARDINO DI MIMMI (MINIGIOGO 6)
  // ==========================================
  public playMimmiSoilDrag() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playMimmiCalmWarning() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Sweet gentle two-tone kalimba prompt (G4 -> E4)
      [392.00, 329.63].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.14);
        gain.gain.setValueAtTime(0.0001, now + i * 0.14);
        gain.gain.linearRampToValueAtTime(0.055, now + i * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.35);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.38);
      });
    } catch {}
  }

  public playMimmiWaterDrop() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = 650 + Math.random() * 350;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.07);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  public playMimmiWaterComplete() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Resonant Tibetan bell harmonic chord (E4, B4, E5)
      [329.63, 493.88, 659.25].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045 / (i + 1), now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      });
    } catch {}
  }

  public playMimmiSunPulse() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playMimmiBloom() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Uplifting 7-note celestial harp bloom (D4, F#4, A4, C#5, D5, F#5, A5)
      const notes = [293.66, 369.99, 440.00, 554.37, 587.33, 739.99, 880.00];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0.0001, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.065, now + i * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.2);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 1.25);
      });
    } catch {}
  }

  // ==========================================
  // IN CUCINA CON MIMMI (COOKING ASMR AUDIO)
  // ==========================================
  private lastChopTime = 0;
  public playCookingChop() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastChopTime < 90) return;
    this.lastChopTime = nowMs;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Board clack (short woody transient)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch {}
  }

  private lastWhiskTime = 0;
  public playCookingWhisk() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastWhiskTime < 110) return;
    this.lastWhiskTime = nowMs;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Soft swirling whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.sin(nowMs * 0.01) * 80, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch {}
  }

  private lastBubbleTime = 0;
  public playCookingBubble() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastBubbleTime < 120) return;
    this.lastBubbleTime = nowMs;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 400 + Math.random() * 300;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.06);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public playCookingSizzle() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Warm gentle sizzle
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.025;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(1.2, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.2);
    } catch {}
  }

  public playCookingSprinkle() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Sparkly delicate chime
      const freq = 1200 + Math.random() * 400;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {}
  }

  public playCookingServe() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Cozy warm triumphant chord (F4, A4, C5, E5)
      const notes = [349.23, 440.0, 523.25, 659.25];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06 / (i + 1), now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.1);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.15);
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 100]);
      }
    } catch {}
  }

  // ----------------------------------------------------
  // LA BOTTEGA DI PAPÀ (WOODWORK AUDIO ASMR)
  // ----------------------------------------------------
  private lastSandingSoundTime = 0;
  public playWoodSanding() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastSandingSoundTime < 85) return;
    this.lastSandingSoundTime = nowMs;

    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Realistic sandpaper friction noise on dry wood
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      noise.start(now);
      noise.stop(now + 0.08);
    } catch {}
  }

  // Light tactile wood tap when picking up / touching a wood piece
  public playWoodTap() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Satisfying wooden dowel / joinery snap ("clack-thud")
  public playWoodSnap() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Click transient
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(750, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      clickOsc.connect(clickGain);
      clickGain.connect(this.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.06);

      // Resonant wood body "thud" (hollow oak frequency)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(220, now);
      thudOsc.frequency.exponentialRampToValueAtTime(95, now + 0.12);
      thudGain.gain.setValueAtTime(0.3, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      thudOsc.connect(thudGain);
      thudGain.connect(this.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.16);
    } catch {}
  }

  // Silky beeswax cloth buffing sound
  private lastBuffTime = 0;
  public playWaxBuff() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastBuffTime < 110) return;
    this.lastBuffTime = nowMs;

    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620 + Math.random() * 80, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Gentle fatherly warning tone (soft marimba wood notes)
  public playPapaGentleWarn() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [392.00, 329.63].forEach((f, i) => { // G4 -> E4 gentle descending wood note
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch {}
  }

  // Wood craft masterpiece finished melody
  public playPapaMasterpiece() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Warm acoustic wood chords (C4, E4, G4, B4, C5)
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.0001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.1);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 1.2);
      });
    } catch {}
  }

  // ----------------------------------------------------
  // MAGI, COSA FAI?! (EFFETTI AUDIO REALISTICI & COERENTI)
  // ----------------------------------------------------
  // 1. Spugna Saponosa (Squishy, Frothy, Bubbly Foam Lather)
  private lastSpongeTime = 0;
  public playSpongeSoap() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastSpongeTime < 85) return;
    this.lastSpongeTime = nowMs;

    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Part A: Wet squishy lather friction (bandpass filtered noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650 + Math.random() * 250, now);
      filter.Q.setValueAtTime(2.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.destination);
      noise.start(now);

      // Part B: Microscopic soapy bubbles popping (sweet little pitch glides)
      const bubbleCount = 2;
      for (let b = 0; b < bubbleCount; b++) {
        const osc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 700 + Math.random() * 400 + b * 200;
        const endFreq = startFreq + 250 + Math.random() * 200;
        const startTime = now + b * 0.025;
        const dur = 0.035;

        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + dur);

        bGain.gain.setValueAtTime(0.0001, startTime);
        bGain.gain.linearRampToValueAtTime(0.035, startTime + 0.008);
        bGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(bGain);
        bGain.connect(this.destination);
        osc.start(startTime);
        osc.stop(startTime + dur + 0.005);
      }
    } catch {}
  }

  // 2. Acqua Tiepida / Doccetta (Rinsing Liquid Splash & Water Droplets)
  private lastWaterRinseTime = 0;
  public playWaterRinse() {
    if (!this.isEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastWaterRinseTime < 90) return;
    this.lastWaterRinseTime = nowMs;

    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Part A: Water stream wash spray (soft liquid filtered hiss)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 300, now);
      filter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.destination);
      noise.start(now);

      // Part B: Liquid water droplet "drip/plop" acoustics (sine droplet sweep)
      const dropCount = 2;
      for (let d = 0; d < dropCount; d++) {
        const osc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        osc.type = 'sine';
        const baseFreq = 500 + Math.random() * 300 + d * 220;
        const peakFreq = baseFreq + 400 + Math.random() * 150;
        const startTime = now + d * 0.03;
        const dur = 0.045;

        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, startTime + dur * 0.6);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, startTime + dur);

        dropGain.gain.setValueAtTime(0.0001, startTime);
        dropGain.gain.linearRampToValueAtTime(0.045, startTime + 0.006);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(dropGain);
        dropGain.connect(this.destination);
        osc.start(startTime);
        osc.stop(startTime + dur + 0.005);
      }
    } catch {}
  }

  // 3. Asciugamano Soffice (Fluffy Cotton Pat & Clean Sparkling Skin Chime)
  public playTowelPat() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Part A: Soft cushioned cotton pat (low-frequency damp impact)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(65, now + 0.09);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.07, now + 0.012);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc1.connect(gain1);
      gain1.connect(this.destination);
      osc1.start(now);
      osc1.stop(now + 0.11);

      // Part B: Gentle cotton fabric rustle (soft lowpass noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.035, now + 0.015);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.destination);
      noise.start(now);

      // Part C: Clean sparkling skin chime (pure harmonic twin bells: G5 & E6)
      const chimeNotes = [783.99, 1318.51];
      chimeNotes.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        const t = now + 0.03 + idx * 0.04;
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.035, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(t);
        osc.stop(t + 0.36);
      });
    } catch {}
  }

  // 4. Avviso Dolce per Troppa Fretta (Soap Bubble Wobble "Con calma!")
  public playMagiGentleWarn() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle soft double bubble wobble (bloop-bloop)
      [360, 420].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t + 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.08);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      });
    } catch {}
  }

  public playMagiGiggle() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Playful cute 4-note chuckle & giggle (E5, G5, B5, E6)
      [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.045, now + i * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.24);
      });
    } catch {}
  }

  public playTattooPop() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Cute sticker pop sound (resonant bubble chirp)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(784, now + 0.07);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Cute cartoon whimper when temporary tattoos are washed off
  public playMagiCry() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Soft gentle wavering cartoon whimper ("uèèè 🥺")
      [520, 470, 420].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.28;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq - 45, t + 0.22);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.035, t + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      });
    } catch {}
  }

  public playKissPop() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Suono caldo, dolce e ovattato tipo goccia/bolla morbida (nessun click stridulo o acuto)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      // Curva di frequenza dolce e calda nei medi bassi: 260Hz -> 360Hz
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playKissCelebration() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Dolce carillon rilassante a onde sinusoidali morbide (arpeggio pastello rilassante)
      const notes = [392.00, 440.00, 523.25, 659.25, 783.99]; // G4, A4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.1;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.045, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(t);
        osc.stop(t + 0.56);
      });
    } catch {}
  }

  private playTone(freq: number, volume: number, duration: number) {
      try {
          this.initCtx();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(volume, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
      } catch {}
  }
}

export const soundManager = new SoundManager();
