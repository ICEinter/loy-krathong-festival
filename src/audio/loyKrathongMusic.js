/**
 * Web Audio API synthesizer for Authentic Thai Loy Krathong Melody
 * Produces traditional Ranad Ek (Thai Wooden Xylophone) & Gong chimes
 */
class LoyKrathongAudio {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timer = null;
    this.currentNoteIndex = 0;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Frequencies for Thai Pentatonic Scale (C, D, E, G, A)
  getNoteFreq(note) {
    const freqs = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'G4': 392.00, 'A4': 440.00,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00,
      'C6': 1046.50, 'REST': 0
    };
    return freqs[note] || 0;
  }

  // Play a single Ranad / Bell note
  playRanadNote(freq, time, duration = 0.35, isAccent = false) {
    if (!this.audioCtx || freq <= 0) return;

    // 1. Primary Marimba / Ranad tone
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // 2. Harmonic overtone (Wooden chime strike)
    const osc2 = this.audioCtx.createOscillator();
    const gain2 = this.audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 3, time);

    // Filter to give warm wooden resonance
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isAccent ? 3200 : 2200, time);

    // Envelope
    const vol = isAccent ? 0.22 : 0.16;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    gain2.gain.setValueAtTime(vol * 0.4, time);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + (duration * 0.4));

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Iconic Loy Krathong Melody Notes & Timings
    // (วันเพ็ญเดือนสิบสอง น้ำนองเต็มตลิ่ง เราทั้งหลายชายหญิง สนุกกันจริงวันลอยกระทง...)
    const melody = [
      // ท่อน 1: วันเพ็ญเดือนสิบสอง
      { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'C5', dur: 0.45 },
      { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.35 }, { note: 'A4', dur: 0.7 },
      // น้ำนองเต็มตลิ่ง
      { note: 'C5', dur: 0.35 }, { note: 'D5', dur: 0.35 }, { note: 'E5', dur: 0.45 },
      { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.35 }, { note: 'A4', dur: 0.7 },
      // เราทั้งหลายชายหญิง
      { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'C5', dur: 0.45 },
      { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'E4', dur: 0.7 },
      // สนุกกันจริงวันลอยกระทง
      { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'C5', dur: 0.45 },
      { note: 'D5', dur: 0.35 }, { note: 'E5', dur: 0.45 }, { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.9 },
      // ลอย ลอยกระทง ลอย ลอยกระทง
      { note: 'E5', dur: 0.35 }, { note: 'E5', dur: 0.35 }, { note: 'D5', dur: 0.4 }, { note: 'C5', dur: 0.6 },
      { note: 'E5', dur: 0.35 }, { note: 'E5', dur: 0.35 }, { note: 'D5', dur: 0.4 }, { note: 'C5', dur: 0.6 },
      // ลอยกระทงกันแล้ว ขอเชิญน้องแก้วออกมารำวง
      { note: 'A4', dur: 0.35 }, { note: 'C5', dur: 0.35 }, { note: 'D5', dur: 0.35 }, { note: 'E5', dur: 0.45 },
      { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.35 }, { note: 'A4', dur: 0.45 },
      { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'C5', dur: 0.8 },
      // รำวงวันลอยกระทง รำวงวันลอยกระทง
      { note: 'D5', dur: 0.35 }, { note: 'E5', dur: 0.35 }, { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.6 },
      { note: 'D5', dur: 0.35 }, { note: 'E5', dur: 0.35 }, { note: 'D5', dur: 0.35 }, { note: 'C5', dur: 0.6 },
      // บุญจะส่งให้เราสุขใจ
      { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.4 },
      { note: 'C4', dur: 0.9 }, { note: 'REST', dur: 0.5 }
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      const item = melody[noteIdx];
      const now = this.audioCtx.currentTime;
      const freq = this.getNoteFreq(item.note);

      if (freq > 0) {
        this.playRanadNote(freq, now, item.dur * 0.9, noteIdx % 4 === 0);
      }

      noteIdx = (noteIdx + 1) % melody.length;
      this.timer = setTimeout(playNext, item.dur * 650);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const loyKrathongAudio = new LoyKrathongAudio();

