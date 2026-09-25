/**
 * Quản lý âm thanh bằng Web Audio API thuần túy:
 * - Không lo thiếu file âm thanh hay lỗi 404
 * - Tạo giai điệu ngũ cung truyền thống êm dịu (Asian Pentatonic Chime / Zither melody)
 * - Tiếng dế đêm hè ru nhẹ
 * - Âm thanh chuông gió lung linh khi click tương tác hoặc thả đèn
 */
export class SoundManager {
  constructor() {
    this.isPlaying = false;
    this.ctx = null;
    this.melodyTimer = null;
    this.cricketNode = null;
    
    // Thang âm ngũ cung Trung Thu (Pentatonic scale: C, D, E, G, A ở các quãng tám)
    this.pentatonicFrequencies = [
      261.63, 293.66, 329.63, 392.00, 440.00, // Quãng 4: C4, D4, E4, G4, A4
      523.25, 587.33, 659.25, 783.99, 880.00, // Quãng 5: C5, D5, E5, G5, A5
      1046.50                                  // Quãng 6: C6
    ];

    // Giai điệu mượt mà du dương
    this.melodyNotes = [0, 2, 4, 3, 5, 7, 6, 8, 7, 5, 4, 2, 3, 4, 5, 8];
    this.melodyIndex = 0;
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

  toggleMusic() {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playAmbientNight();
    this.scheduleNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  /**
   * Phát nốt nhạc chuông ngân (Chime / Guzheng / Harp tone)
   */
  playChimeTone(freq, duration = 2.2, volume = 0.12) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Kèm thêm hòa âm bậc 2 tạo cảm giác chuông đồng ấm
    const oscHarmonic = this.ctx.createOscillator();
    const gainHarmonic = this.ctx.createGain();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    // Envelope âm lượng: chạm nhẹ rồi ngân dài
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gainHarmonic.gain.setValueAtTime(0, now);
    gainHarmonic.gain.linearRampToValueAtTime(volume * 0.35, now + 0.02);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    osc.connect(gain);
    oscHarmonic.connect(gainHarmonic);
    gain.connect(this.ctx.destination);
    gainHarmonic.connect(this.ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + duration);
    oscHarmonic.stop(now + duration);
  }

  /**
   * Vòng lặp giai điệu ngũ cung Trung thu
   */
  scheduleNextNote() {
    if (!this.isPlaying) return;

    const noteIdx = this.melodyNotes[this.melodyIndex];
    const freq = this.pentatonicFrequencies[noteIdx % this.pentatonicFrequencies.length];
    this.playChimeTone(freq, 2.8, 0.1);

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyNotes.length;

    // Khoảng cách nhịp ngẫu nhiên theo nhịp điệu thiền định
    const delay = 900 + Math.random() * 600;
    this.melodyTimer = setTimeout(() => {
      this.scheduleNextNote();
    }, delay);
  }

  /**
   * Âm thanh tiếng dế đêm hè và gió hiu hiu
   */
  playAmbientNight() {
    if (!this.ctx) return;
    
    // Thỉnh thoảng phát tiếng chuông gió ngẫu nhiên
    const chimeRandom = () => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.4) {
        const randFreq = this.pentatonicFrequencies[5 + Math.floor(Math.random() * 5)];
        this.playChimeTone(randFreq, 3.2, 0.06);
      }
      setTimeout(chimeRandom, 3000 + Math.random() * 4000);
    };
    chimeRandom();
  }

  /**
   * Hiệu ứng âm thanh khi tương tác (click thỏ ngọc, lồng đèn hoặc thả đèn)
   */
  playInteractionSound(type = 'chime') {
    this.initContext();
    if (!this.ctx) return;

    if (type === 'wish') {
      // Chùm âm thanh thăng hoa khi thả đèn trời
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChimeTone(freq, 2.5, 0.16);
        }, idx * 160);
      });
    } else {
      // Âm thanh chạm nhẹ vui nhộn
      this.playChimeTone(783.99, 1.2, 0.14);
      setTimeout(() => {
        this.playChimeTone(1046.50, 1.5, 0.12);
      }, 100);
    }
  }
}
