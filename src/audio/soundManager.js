/**
 * Quản lý âm thanh Tết Trung Thu tươi sáng, rộn ràng bằng Web Audio API:
 * - Giai điệu sáo trúc & đàn tranh ngũ cung tươi vui, hân hoan (C Major / G Major Pentatonic)
 * - Nhịp điệu rước đèn phá cỗ rộn rã, trong trẻo, mang lại không khí ấm áp và tràn đầy niềm vui
 * - Hòa quyện tiếng chuông ngọc lấp lánh (sparkling chimes) và tiếng sáo trúc thanh thoát
 * - Tự động phát khi chạm vào màn hình và ngân nga êm dịu
 */
export class SoundManager {
  constructor() {
    this.isPlaying = false;
    this.ctx = null;
    this.melodyTimer = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;

    // Thang âm ngũ cung tươi sáng (C Major Pentatonic: C, D, E, G, A)
    this.notes = {
      C3: 130.81, G3: 196.00, A3: 220.00,
      C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
      C6: 1046.50
    };

    // Giai điệu tươi vui, rộn ràng không khí lễ hội rước đèn đêm trăng rằm
    this.melodySequence = [
      // Đoạn 1: Rước đèn đón trăng
      { note: 'G4', dur: 0.55, pause: 380, chime: 'G5' },
      { note: 'G4', dur: 0.55, pause: 380, chime: 'D5' },
      { note: 'E4', dur: 0.65, pause: 420, chime: 'C5' },
      { note: 'G4', dur: 0.85, pause: 550, chime: 'G5' },
      { note: 'A4', dur: 0.65, pause: 400, chime: 'C6' },
      { note: 'C5', dur: 1.20, pause: 750, chime: 'E5' },

      // Đoạn 2: Trăng rằm sáng ngời
      { note: 'D5', dur: 0.55, pause: 380, chime: 'A5' },
      { note: 'E5', dur: 0.65, pause: 420, chime: 'C6' },
      { note: 'D5', dur: 0.75, pause: 450, chime: 'G5' },
      { note: 'C5', dur: 0.85, pause: 520, chime: 'E5' },
      { note: 'A4', dur: 0.70, pause: 440, chime: 'C5' },
      { note: 'G4', dur: 1.30, pause: 800, chime: 'G5' },

      // Đoạn 3: Đàn thỏ nô đùa & Đèn lồng bay
      { note: 'C5', dur: 0.55, pause: 380, chime: 'E5' },
      { note: 'C5', dur: 0.55, pause: 380, chime: 'G5' },
      { note: 'A4', dur: 0.65, pause: 420, chime: 'C6' },
      { note: 'G4', dur: 0.75, pause: 450, chime: 'D5' },
      { note: 'E4', dur: 0.65, pause: 400, chime: 'G4' },
      { note: 'G4', dur: 1.10, pause: 680, chime: 'C5' },

      // Đoạn 4: Niềm vui đoàn viên sum vầy
      { note: 'A4', dur: 0.55, pause: 380, chime: 'E5' },
      { note: 'C5', dur: 0.70, pause: 440, chime: 'G5' },
      { note: 'D5', dur: 0.85, pause: 520, chime: 'A5' },
      { note: 'E5', dur: 1.10, pause: 680, chime: 'C6' },
      { note: 'D5', dur: 0.70, pause: 440, chime: 'G5' },
      { note: 'C5', dur: 1.60, pause: 1100, chime: 'C5' }
    ];

    this.seqIndex = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startAmbientDrone();
    this.playNextMelodyNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  /**
   * Âm hưởng sáo trúc tươi sáng, trong trẻo (Bright Bamboo Flute)
   */
  playBrightFluteTone(freq, duration = 0.8, volume = 0.12) {
    if (!this.ctx || !freq) return;

    const now = this.ctx.currentTime;

    // 1. Dao động chính (sóng sine tươi trong)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 2. Rung nhẹ nốt nhạc (Vibrato) linh hoạt
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.5, now);
    vibratoGain.gain.setValueAtTime(freq * 0.01, now);
    vibrato.connect(osc.frequency);

    // 3. Hài âm tạo độ vang ấm mượt
    const harm = this.ctx.createOscillator();
    const harmGain = this.ctx.createGain();
    harm.type = 'triangle';
    harm.frequency.setValueAtTime(freq * 2, now);

    // 4. Bộ lọc thông thấp mở rộng để âm thanh sáng và thoáng đãng (2400 Hz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);

    // 5. Envelope nhịp nhàng, nảy nốt tươi vui
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume, now + 0.06);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    harmGain.gain.setValueAtTime(0, now);
    harmGain.gain.linearRampToValueAtTime(volume * 0.28, now + 0.05);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    // Kết nối
    osc.connect(mainGain);
    harm.connect(harmGain);
    mainGain.connect(filter);
    harmGain.connect(filter);
    filter.connect(this.ctx.destination);

    vibrato.start(now);
    osc.start(now);
    harm.start(now);

    vibrato.stop(now + duration);
    osc.stop(now + duration);
    harm.stop(now + duration);
  }

  /**
   * Tiếng chuông ngọc lấp lánh (Sparkling Chime) hòa âm
   */
  playSparkleChime(freq, duration = 1.0, volume = 0.04) {
    if (!this.ctx || !freq) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Âm nền hòa âm ấm áp (Warm Harmonic Ambient Chord C - G)
   */
  startAmbientDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Nốt C3 trầm ấm
    const drone1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const filter1 = this.ctx.createBiquadFilter();

    drone1.type = 'sine';
    drone1.frequency.setValueAtTime(130.81, now); // C3
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(320, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.026, now + 2.5);

    drone1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.ctx.destination);
    drone1.start(now);
    this.droneOsc1 = drone1;

    // Nốt G3 ấm áp tạo hợp âm bậc 5 hoàn hảo
    const drone2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const filter2 = this.ctx.createBiquadFilter();

    drone2.type = 'sine';
    drone2.frequency.setValueAtTime(196.00, now); // G3
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(380, now);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.02, now + 2.5);

    drone2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(this.ctx.destination);
    drone2.start(now);
    this.droneOsc2 = drone2;
  }

  /**
   * Vòng lặp giai điệu Trung Thu tươi sáng
   */
  playNextMelodyNote() {
    if (!this.isPlaying) return;

    const item = this.melodySequence[this.seqIndex];
    const freq = this.notes[item.note];

    // Phát tiếng sáo trúc tươi vui
    this.playBrightFluteTone(freq, item.dur, 0.12);

    // Kèm nốt chuông lấp lánh ngân vang nhẹ
    if (item.chime && this.notes[item.chime]) {
      this.playSparkleChime(this.notes[item.chime], item.dur * 1.2, 0.038);
    }

    this.seqIndex = (this.seqIndex + 1) % this.melodySequence.length;

    this.melodyTimer = setTimeout(() => {
      this.playNextMelodyNote();
    }, item.pause);
  }

  /**
   * Hiệu ứng âm thanh chuông ngân vui tai khi chạm lồng đèn hoặc thỏ
   */
  playInteractionSound(type = 'wish') {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarm = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = type === 'wish' ? 659.25 : 523.25; // E5 hoặc C5
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(baseFreq * 2, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    oscHarm.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    oscHarm.start(now);
    osc.stop(now + 2.0);
    oscHarm.stop(now + 2.0);
  }
}
