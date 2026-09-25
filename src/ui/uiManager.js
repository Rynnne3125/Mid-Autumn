/**
 * Quản lý giao diện, hiển thị lời chúc từ lồng đèn, thả đèn từ tay cô bé và tương tác
 */
export class UIManager {
  constructor(soundManager, onReleaseWish, onSwitchCamera, onGirlRelease) {
    this.soundManager = soundManager;
    this.onReleaseWish = onReleaseWish;
    this.onSwitchCamera = onSwitchCamera;
    this.onGirlRelease = onGirlRelease;

    this.initElements();
    this.bindEvents();
    this.checkUrlParams();
  }

  initElements() {
    this.loader = document.getElementById('loader');
    this.progressBar = document.getElementById('progress-bar');
    this.card = document.getElementById('greeting-card');
    this.btnToggleCard = document.getElementById('btn-toggle-card');
    this.btnCloseCard = document.getElementById('btn-close-card');

    this.btnAudio = document.getElementById('btn-audio');
    this.audioIcon = document.getElementById('audio-icon');

    this.btnCamera = document.getElementById('btn-camera');
    this.btnGirlLantern = document.getElementById('btn-girl-lantern');

    // Modal xem lời chúc khi click lồng đèn
    this.modalLanternWish = document.getElementById('modal-lantern-wish');
    this.btnCloseLanternWish = document.getElementById('btn-close-lantern-wish');
    this.wishModalCategory = document.getElementById('wish-modal-category');
    this.wishModalTitle = document.getElementById('wish-modal-title');
    this.wishModalContent = document.getElementById('wish-modal-content');
    this.btnCopyLanternWish = document.getElementById('btn-copy-lantern-wish');

    // Modal thả đèn trời
    this.modalWish = document.getElementById('modal-wish');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnSubmitWish = document.getElementById('btn-submit-wish');
    this.wishInput = document.getElementById('wish-input');

    // Modal chỉnh sửa thiệp
    this.modalCustom = document.getElementById('modal-custom-wish');
    this.btnCloseCustom = document.getElementById('btn-close-custom');
    this.btnEditWish = document.getElementById('btn-edit-wish');
    this.btnSaveWish = document.getElementById('btn-save-wish');
    this.inputRecipient = document.getElementById('input-recipient');
    this.inputMessage = document.getElementById('input-message');

    this.displayRecipient = document.getElementById('display-recipient');
    this.displayMessage = document.getElementById('greeting-message');

    this.toast = document.getElementById('toast');
  }

  bindEvents() {
    // Ẩn/hiện thiệp
    this.btnToggleCard.addEventListener('click', () => {
      this.card.classList.toggle('minimized');
    });

    this.btnCloseCard.addEventListener('click', () => {
      this.card.classList.add('minimized');
      this.showToast('Bấm "Thiệp Chúc" ở góc trên để mở lại thiệp.');
    });

    // Bật/tắt âm thanh
    this.btnAudio.addEventListener('click', () => {
      const isPlaying = this.soundManager.toggleMusic();
      if (isPlaying) {
        this.audioIcon.textContent = '🔊';
        this.showToast('Đang phát giai điệu Tết Trung Thu du dương 🎶');
      } else {
        this.audioIcon.textContent = '🔇';
        this.showToast('Đã tắt âm thanh');
      }
    });

    // Đổi góc nhìn
    this.btnCamera.addEventListener('click', () => {
      if (this.onSwitchCamera) {
        const viewName = this.onSwitchCamera();
        this.showToast(`Góc nhìn: ${viewName}`);
      }
    });

    // Thả đèn từ tay cô bé
    this.btnGirlLantern.addEventListener('click', () => {
      if (this.onGirlRelease) {
        this.onGirlRelease('Cầu mong gia đình bình an, vạn sự cát tường!');
      }
    });

    // Đóng modal lời chúc lồng đèn
    this.btnCloseLanternWish.addEventListener('click', () => {
      this.modalLanternWish.classList.add('hidden');
    });

    // Sao chép lời chúc từ lồng đèn
    this.btnCopyLanternWish.addEventListener('click', () => {
      const title = this.wishModalTitle.textContent;
      const content = this.wishModalContent.textContent;
      const fullText = `🏮 [${title}] 🏮\n${content}\n✨ Chúc Mừng Tết Trung Thu! ✨`;
      navigator.clipboard?.writeText(fullText);
      this.showToast('✨ Đã sao chép lời chúc ý nghĩa này!');
    });

    // Modal thả đèn tùy biến
    this.btnCloseModal.addEventListener('click', () => {
      this.modalWish.classList.add('hidden');
    });

    this.btnSubmitWish.addEventListener('click', () => {
      const wish = this.wishInput.value.trim() || 'Cầu chúc bình an và hạnh phúc trọn vẹn!';
      if (this.onGirlRelease) {
        this.onGirlRelease(wish);
      }
      this.modalWish.classList.add('hidden');
      this.wishInput.value = '';
    });

    // Modal sửa thiệp
    this.btnEditWish.addEventListener('click', () => {
      this.inputRecipient.value = this.displayRecipient.textContent;
      this.inputMessage.value = this.displayMessage.textContent;
      this.modalCustom.classList.remove('hidden');
      this.inputRecipient.focus();
    });

    this.btnCloseCustom.addEventListener('click', () => {
      this.modalCustom.classList.add('hidden');
    });

    this.btnSaveWish.addEventListener('click', () => {
      const recipient = this.inputRecipient.value.trim() || 'Những người thương yêu';
      const message = this.inputMessage.value.trim() || this.displayMessage.textContent;

      this.displayRecipient.textContent = recipient;
      this.displayMessage.textContent = message;

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('to', recipient);
      newUrl.searchParams.set('msg', message);
      window.history.replaceState({}, '', newUrl.toString());

      navigator.clipboard?.writeText(newUrl.toString());

      this.modalCustom.classList.add('hidden');
      this.showToast('✨ Đã lưu thiệp & sao chép link gửi tặng bạn bè!');
    });
  }

  /**
   * Hiển thị modal lời chúc ý nghĩa khi click vào lồng đèn
   */
  showLanternWish(wishData) {
    if (!wishData) return;
    this.wishModalCategory.textContent = `🏮 ${wishData.category || 'Lời Chúc Trung Thu'}`;
    this.wishModalTitle.textContent = wishData.title || 'Đoàn Viên Sum Vầy';
    this.wishModalContent.textContent = `"${wishData.content}"`;
    this.modalLanternWish.classList.remove('hidden');
    this.soundManager.playInteractionSound('wish');
  }

  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const msg = params.get('msg');
    if (to) this.displayRecipient.textContent = to;
    if (msg) this.displayMessage.textContent = msg;
  }

  updateProgress(percent) {
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (percent >= 100) {
      setTimeout(() => {
        this.loader.classList.add('fade-out');
      }, 500);
    }
  }

  showToast(text, duration = 3000) {
    if (!this.toast) return;
    this.toast.textContent = text;
    this.toast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.add('hidden');
    }, duration);
  }
}
