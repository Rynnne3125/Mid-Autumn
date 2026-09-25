/**
 * Quản lý âm thanh Tết Trung Thu sâu lắng bằng Web Audio API:
 * - Giai điệu sáo trúc & đàn tranh ngũ cung trầm bổng, da diết (A minor / D minor)
 * - Âm hưởng sâu lắng, tha thiết như điệu ru trăng rằm quê hương
 * - Tự động phát khi chạm vào màn hình và ngân vang êm đềm
 */
export class SoundManager {
  constructor() {
    this.isPlaying = false;
    this.ctx = null;
    this.melodyTimer = null;
    this.droneOsc = null;

    // Thang âm ngũ cung trữ tình sâu lắng (D minor pentatonic: D, F, G, A, C)
    // Các tần số nốt trầm ấm và nốt bổng trong trẻo:
    this.notes = {
      D3: 146.83, F3: 174.61, G3: 196.00, A3: 220.00, C4: 261.63,
      D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, A5: 880.00
    };

    // Chuỗi giai điệu sâu lắng, tha thiết gợi nhớ bài "Thằng Cuội" & ánh trăng quê hương
    this.melodySequence = [
      { note: 'D4', dur: 1.8, pause: 1400 },
      { note: 'F4', dur: 1.5, pause: 1200 },
      { note: 'A4', dur: 2.5, pause: 1800 },
      { note: 'G4', dur: 1.8, pause: 1300 },
      { note: 'F4', dur: 1.5, pause: 1100 },
      { note: 'D4', dur: 2.8, pause: 2000 },
      
      { note: 'F4', dur: 1.6, pause: 1200 },
      { note: 'G4', dur: 1.6, pause: 1200 },
      { note: 'A4', dur: 2.2, pause: 1600 },
      { note: 'C5', dur: 2.8, pause: 2000 },
      { note: 'D5', dur: 3.5, pause: 2600 },

      { note: 'C5', dur: 1.8, pause: 1400 },
      { note: 'A4', dur: 2.2, pause: 1600 },
      { note: 'G4', dur: 1.8, pause: 1300 },
      { note: 'F4', dur: 2.2, pause: 1600 },
      { note: 'D4', dur: 3.8, pause: 2800 },

      { note: 'A3', dur: 2.0, pause: 1500 },
      { note: 'C4', dur: 2.0, pause: 1500 },
      { note: 'D4', dur: 4.2, pause: 3200 }
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
   * Âm hưởng sáo trúc nỉ non sâu lắng (Flute tone with vibrato & breath)
   */
  playFluteTone(freq, duration = 2.5, volume = 0.12) {
    if (!this.ctx || !freq) return;

    const now = this.ctx.currentTime;

    // 1. Dao động chính (sóng sine ấm mượt)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 2. Rung nhẹ nốt (Vibrato) tạo cảm giác sáo trúc tự nhiên
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(4.8, now); // Rung 4.8 Hz
    vibratoGain.gain.setValueAtTime(freq * 0.012, now); // Biên độ rung mềm
    vibrato.connect(osc.frequency);

    // 3. Hài âm bậc 2 giả lập ống trúc rỗng
    const harm = this.ctx.createOscillator();
    const harmGain = this.ctx.createGain();
    harm.type = 'triangle';
    harm.frequency.setValueAtTime(freq * 2, now);

    // 4. Bộ lọc thông thấp làm ấm tiếng sáo
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    // 5. Envelope âm lượng mềm mại
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume, now + 0.18); // Nhập nhẹ nhàng
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    harmGain.gain.setValueAtTime(0, now);
    harmGain.gain.linearRampToValueAtTime(volume * 0.22, now + 0.15);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    // Kết nối mạng âm thanh
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
   * Âm nền huyền ảo nâng đỡ giai điệu (Ethereal Night Drone)
   */
  startAmbientDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const drone = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    const droneFilter = this.ctx.createBiquadFilter();

    drone.type = 'sine';
    drone.frequency.setValueAtTime(146.83, now); // Nốt Rê trầm ấm (D3)

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(250, now);

    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(0.035, now + 3);

    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.ctx.destination);

    drone.start(now);
    this.droneOsc = drone;
  }

  /**
   * Vòng lặp giai điệu Trung Thu sâu lắng
   */
  playNextMelodyNote() {
    if (!this.isPlaying) return;

    const item = this.melodySequence[this.seqIndex];
    const freq = this.notes[item.note];

    this.playFluteTone(freq, item.dur, 0.11);

    this.seqIndex = (this.seqIndex + 1) % this.melodySequence.length;

    this.melodyTimer = setTimeout(() => {
      this.playNextMelodyNote();
    }, item.pause);
  }

  /**
   * Hiệu ứng âm thanh chuông ngân khi chạm lồng đèn hoặc thả đèn
   */
  playInteractionSound(type = 'wish') {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'wish' ? 587.33 : 440.00, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.5);
  }
}
