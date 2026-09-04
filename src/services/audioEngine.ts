import { EqProfile } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private staticGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private lowFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private highFilter: BiquadFilterNode | null = null;
  private oscLoopTimer: number | null = null;
  private isPlaying: boolean = false;
  private currentFrequency: number = 102.4;
  private tuningNoiseBuffer: AudioBuffer | null = null;
  private activeNoiseSource: AudioBufferSourceNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Analyser Node
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      // Filter chain for DSP Valve Calibration
      this.lowFilter = this.ctx.createBiquadFilter();
      this.lowFilter.type = 'lowshelf';
      this.lowFilter.frequency.setValueAtTime(250, this.ctx.currentTime);
      this.lowFilter.gain.setValueAtTime(3, this.ctx.currentTime);

      this.midFilter = this.ctx.createBiquadFilter();
      this.midFilter.type = 'peaking';
      this.midFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.midFilter.gain.setValueAtTime(0, this.ctx.currentTime);

      this.highFilter = this.ctx.createBiquadFilter();
      this.highFilter.type = 'highshelf';
      this.highFilter.frequency.setValueAtTime(8000, this.ctx.currentTime);
      this.highFilter.gain.setValueAtTime(-2, this.ctx.currentTime);

      // Static noise gain
      this.staticGain = this.ctx.createGain();
      this.staticGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      // Music / synth gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

      // Connect filter chain -> analyser -> masterGain -> destination
      this.musicGain.connect(this.lowFilter);
      this.lowFilter.connect(this.midFilter);
      this.midFilter.connect(this.highFilter);
      this.highFilter.connect(this.analyser);

      this.staticGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.createNoiseBuffer();
    } catch {
      // Audio context might fail on restricted environments; fallback graceful
    }
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.tuningNoiseBuffer = buffer;
  }

  public playTuningStatic(intensity: number = 0.05) {
    if (!this.ctx || !this.tuningNoiseBuffer || !this.staticGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      if (this.activeNoiseSource) {
        this.activeNoiseSource.stop();
        this.activeNoiseSource.disconnect();
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.tuningNoiseBuffer;
      noise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1800;
      bandpass.Q.value = 1.2;

      noise.connect(bandpass);
      bandpass.connect(this.staticGain);

      const targetGain = Math.min(0.2, intensity);
      this.staticGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.staticGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      this.staticGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      noise.start();
      this.activeNoiseSource = noise;
      setTimeout(() => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {
          // ignore
        }
      }, 400);
    } catch {
      // ignore
    }
  }

  public playTick() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // ignore
    }
  }

  public setFrequency(freq: number) {
    this.currentFrequency = freq;
    // Trigger realistic short static crackle when frequency shifts
    this.playTuningStatic(0.08);
  }

  public setEqProfile(profile: EqProfile) {
    if (!this.ctx || !this.lowFilter || !this.midFilter || !this.highFilter) return;
    const now = this.ctx.currentTime;
    switch (profile) {
      case 'Warm Analog Tube':
        this.lowFilter.gain.setTargetAtTime(4.5, now, 0.1);
        this.midFilter.gain.setTargetAtTime(1.5, now, 0.1);
        this.highFilter.gain.setTargetAtTime(-3.5, now, 0.1);
        break;
      case 'Crisp Vocal Voice':
        this.lowFilter.gain.setTargetAtTime(-2, now, 0.1);
        this.midFilter.gain.setTargetAtTime(4, now, 0.1);
        this.highFilter.gain.setTargetAtTime(2.5, now, 0.1);
        break;
      case 'Bass Boost (+6dB)':
        this.lowFilter.gain.setTargetAtTime(6.0, now, 0.1);
        this.midFilter.gain.setTargetAtTime(0, now, 0.1);
        this.highFilter.gain.setTargetAtTime(0, now, 0.1);
        break;
      case 'Flat Studio Ref':
        this.lowFilter.gain.setTargetAtTime(0, now, 0.1);
        this.midFilter.gain.setTargetAtTime(0, now, 0.1);
        this.highFilter.gain.setTargetAtTime(0, now, 0.1);
        break;
    }
  }

  public togglePlay(): boolean {
    if (!this.ctx) this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startSynthesizerGroove();
    } else {
      this.stopSynthesizerGroove();
    }

    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private startSynthesizerGroove() {
    if (!this.ctx || !this.musicGain) return;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.5);

    // Warm analog neo-soul / ambient progression (Bbmaj7 - Gm7 - Ebmaj7 - F9)
    const chords = [
      [116.54, 233.08, 277.18, 349.23, 440.0],  // Bbmaj7 chord
      [98.00, 196.00, 233.08, 293.66, 349.23],  // Gm7 chord
      [155.56, 311.13, 392.00, 466.16, 587.33], // Ebmaj7 chord
      [174.61, 349.23, 440.00, 523.25, 659.25], // F9 chord
    ];

    let chordIndex = 0;
    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.musicGain) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm analog warm sawtooth + sine blend
        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const duration = 2.4;
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    };

    playChordStep();
    this.oscLoopTimer = window.setInterval(playChordStep, 2400);
  }

  private stopSynthesizerGroove() {
    if (this.oscLoopTimer) {
      clearInterval(this.oscLoopTimer);
      this.oscLoopTimer = null;
    }
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, this.ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
    }
  }

  public getSpectrumData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(14);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray.slice(0, 14);
  }
}

export const audioEngine = new AudioEngine();
