import { getStickerSvg } from './stickers.js';

/**
 * Quản lý giao diện:
 * - Hiển thị nhãn dán Sticker chibi siêu cute cho từng lời chúc khi click lồng đèn
 * - Bong bóng chat "🏮 Thả đèn" theo dõi vị trí cô bé trong không gian 3D
 * - Modal cho phép người dùng điền lời chúc của riêng mình và thả đèn
 */
export class UIManager {
  constructor(soundManager, onReleaseWishCallback) {
    this.soundManager = soundManager;
    this.onReleaseWishCallback = onReleaseWishCallback;
    this.hasStartedAudio = false;
    this.currentWishText = '';

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.loader = document.getElementById('loader');

    // Modal xem lời chúc
    this.modalLanternWish = document.getElementById('modal-lantern-wish');
    this.btnCloseLanternWish = document.getElementById('btn-close-lantern-wish');
    this.wishModalSticker = document.getElementById('wish-modal-sticker');
    this.wishModalContent = document.getElementById('wish-modal-content');
    this.btnCopyLanternWish = document.getElementById('btn-copy-lantern-wish');

    // Modal điền lời chúc thả đèn
    this.modalWishInput = document.getElementById('modal-wish-input');
    this.btnCloseWishInput = document.getElementById('btn-close-wish-input');
    this.inputModalSticker = document.getElementById('input-modal-sticker');
    this.textareaGirlWish = document.getElementById('textarea-girl-wish');
    this.btnConfirmReleaseLantern = document.getElementById('btn-confirm-release-lantern');

    this.toast = document.getElementById('toast');
  }

  bindEvents() {
    const startAudioOnFirstTouch = () => {
      if (!this.hasStartedAudio) {
        this.hasStartedAudio = true;
        this.soundManager.start();
        window.removeEventListener('pointerdown', startAudioOnFirstTouch);
      }
    };
    window.addEventListener('pointerdown', startAudioOnFirstTouch);

    // Đóng modal xem lời chúc
    this.btnCloseLanternWish.addEventListener('click', (e) => {
      e.stopPropagation();
      this.modalLanternWish.classList.add('hidden');
    });

    if (this.modalLanternWish) {
      this.modalLanternWish.addEventListener('click', (e) => {
        if (e.target === this.modalLanternWish) {
          this.modalLanternWish.classList.add('hidden');
        }
      });
    }

    // Sao chép lời chúc
    this.btnCopyLanternWish.addEventListener('click', (e) => {
      e.stopPropagation();
      const fullText = `🏮 "${this.currentWishText}"\n✨ Chúc Mừng Tết Trung Thu! ✨`;
      navigator.clipboard?.writeText(fullText);
      this.showToast('✨ Đã sao chép lời chúc ý nghĩa!');
    });

    // Đóng modal điền lời chúc
    if (this.btnCloseWishInput) {
      this.btnCloseWishInput.addEventListener('click', (e) => {
        e.stopPropagation();
        this.modalWishInput.classList.add('hidden');
      });
    }

    if (this.modalWishInput) {
      this.modalWishInput.addEventListener('click', (e) => {
        if (e.target === this.modalWishInput) {
          this.modalWishInput.classList.add('hidden');
        }
      });
    }

    // Phím Enter trong textarea để thả đèn nhanh
    if (this.textareaGirlWish) {
      this.textareaGirlWish.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.btnConfirmReleaseLantern?.click();
        }
      });
    }

    // Nút xác nhận thả đèn
    if (this.btnConfirmReleaseLantern) {
      this.btnConfirmReleaseLantern.addEventListener('click', (e) => {
        e.stopPropagation();
        const wishText = this.textareaGirlWish.value.trim() || 'Cầu chúc gia đình luôn bình an, mạnh khỏe và vạn sự viên mãn!';
        if (this.onReleaseWishCallback) {
          this.onReleaseWishCallback(wishText);
        }
        this.modalWishInput.classList.add('hidden');
        this.textareaGirlWish.value = '';
        this.soundManager.playInteractionSound('wish');
        this.showToast('🏮 Bé đã thắp sáng ngọn đèn mang ước nguyện của bạn bay lên trời!');
      });
    }

    // Ẩn loader
    setTimeout(() => {
      if (this.loader) {
        this.loader.classList.add('fade-out');
      }
    }, 400);
  }

  openWishInputModal() {
    if (this.inputModalSticker) {
      this.inputModalSticker.innerHTML = getStickerSvg(9); // Sticker thỏ ôm đèn trái tim
    }
    this.modalWishInput.classList.remove('hidden');
    setTimeout(() => {
      if (this.textareaGirlWish) {
        this.textareaGirlWish.focus();
      }
    }, 100);
    this.soundManager.playInteractionSound('wish');
  }

  showLanternWish(wishData) {
    if (!wishData) return;
    this.currentWishText = wishData.content || '';

    if (this.wishModalSticker) {
      this.wishModalSticker.innerHTML = getStickerSvg(wishData.id);
    }

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
