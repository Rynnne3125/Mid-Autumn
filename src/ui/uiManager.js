import { getStickerSvg } from './stickers.js';

/**
 * Quản lý giao diện tối giản:
 * - Hiển thị nhãn dán Sticker chibi siêu cute cho từng lời chúc khi click lồng đèn
 * - Bật âm nhạc nhẹ nhàng khi người dùng tương tác
 */
export class UIManager {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this.hasStartedAudio = false;
    this.currentWishText = '';

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.loader = document.getElementById('loader');
    this.modalLanternWish = document.getElementById('modal-lantern-wish');
    this.btnCloseLanternWish = document.getElementById('btn-close-lantern-wish');
    this.wishModalSticker = document.getElementById('wish-modal-sticker');
    this.wishModalContent = document.getElementById('wish-modal-content');
    this.btnCopyLanternWish = document.getElementById('btn-copy-lantern-wish');
    this.toast = document.getElementById('toast');
  }

  bindEvents() {
    // Tự động bật nhạc êm dịu khi người dùng chạm lần đầu
    const startAudioOnFirstTouch = () => {
      if (!this.hasStartedAudio) {
        this.hasStartedAudio = true;
        this.soundManager.start();
        window.removeEventListener('pointerdown', startAudioOnFirstTouch);
      }
    };
    window.addEventListener('pointerdown', startAudioOnFirstTouch);

    // Đóng modal lời chúc
    this.btnCloseLanternWish.addEventListener('click', (e) => {
      e.stopPropagation();
      this.modalLanternWish.classList.add('hidden');
    });

    // Sao chép lời chúc
    this.btnCopyLanternWish.addEventListener('click', (e) => {
      e.stopPropagation();
      const fullText = `🏮 "${this.currentWishText}"\n✨ Chúc Mừng Tết Trung Thu! ✨`;
      navigator.clipboard?.writeText(fullText);
      this.showToast('✨ Đã sao chép lời chúc ý nghĩa!');
    });

    // Ẩn loader
    setTimeout(() => {
      if (this.loader) {
        this.loader.classList.add('fade-out');
      }
    }, 400);
  }

  showLanternWish(wishData) {
    if (!wishData) return;
    this.currentWishText = wishData.content || '';

    // Hiển thị sticker cute tương ứng với từng câu chúc
    if (this.wishModalSticker) {
      this.wishModalSticker.innerHTML = getStickerSvg(wishData.id);
    }

    // Hiển thị nội dung lời chúc
    if (this.wishModalContent) {
      this.wishModalContent.textContent = `"${wishData.content}"`;
    }

    this.modalLanternWish.classList.remove('hidden');
    this.soundManager.playInteractionSound('wish');
  }

  showToast(text, duration = 2500) {
    if (!this.toast) return;
    this.toast.textContent = text;
    this.toast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.add('hidden');
    }, duration);
  }
}
