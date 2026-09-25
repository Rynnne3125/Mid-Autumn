import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { LightsManager } from './scene/lights.js';
import { SkyAndMoon } from './scene/skyAndMoon.js';
import { SakuraTree } from './scene/sakuraTree.js';
import { LittleGirl } from './scene/littleGirl.js';
import { AnimalsManager } from './scene/animals.js';
import { FloatingLanternsManager } from './scene/floatingLanterns.js';
import { ParticlesManager } from './scene/particles.js';
import { SoundManager } from './audio/soundManager.js';
import { UIManager } from './ui/uiManager.js';

class MidAutumnApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initThree();
    this.initAudioAndUI();
    this.initSceneObjects();
    this.initInteractions();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.7;
    this.controls.zoomSpeed = 0.8;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    this.controls.target.set(0, 5.5, 0);

    // Hỗ trợ cảm ứng vuốt xoay 1 ngón, phóng to/thu nhỏ 2 ngón trên điện thoại
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // Tự động căn chỉnh góc nhìn hoàn hảo cho màn hình điện thoại dọc hoặc máy tính
    this.updateCameraFraming(true);
  }

  /**
   * Cân chỉnh góc nhìn camera thích ứng màn hình:
   * - Điện thoại (màn hình dọc aspect < 1.0): mở rộng FOV và lùi xa camera để trọn vẹn cả cây hoa anh đào, lồng đèn và đàn thỏ
   * - Máy tính/Tablet (màn hình ngang aspect >= 1.0): góc nhìn 42 độ chuẩn điện ảnh
   */
  updateCameraFraming(isInitial = false) {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;

    if (aspect < 1.0) {
      this.camera.fov = Math.min(60, Math.max(48, 42 / Math.max(0.68, aspect)));
      if (isInitial) {
        this.camera.position.set(0, 16.5, 54);
      }
      this.controls.minDistance = 12;
      this.controls.maxDistance = 110;
    } else {
      this.camera.fov = 42;
      if (isInitial) {
        this.camera.position.set(0, 16, 44);
      }
      this.controls.minDistance = 10;
      this.controls.maxDistance = 85;
    }
    this.camera.updateProjectionMatrix();
  }

  initAudioAndUI() {
    this.soundManager = new SoundManager();
    this.uiManager = new UIManager(this.soundManager, (wishText) => {
      if (this.littleGirl) {
        this.littleGirl.releaseLanternFromHand(wishText);
      }
    });
  }

  initSceneObjects() {
    this.lightsManager = new LightsManager(this.scene);
    this.skyAndMoon = new SkyAndMoon(this.scene);
    this.sakuraTree = new SakuraTree(this.scene);

    // Chú Cuội thổi sáo, Thỏ Ngọc & Bàn trà bánh nướng
    this.animalsManager = new AnimalsManager(this.scene);

    // Đàn 15 lồng đèn mang 15 lời chúc ý nghĩa
    this.floatingLanterns = new FloatingLanternsManager(
      this.scene,
      (wishData) => {
        this.uiManager.showLanternWish(wishData);
      }
    );

    // Cô bé thả đèn
    this.littleGirl = new LittleGirl(
      this.scene,
      (handPos, wishText) => {
        this.floatingLanterns.spawnSkyLanternFromPosition(handPos, wishText);
        this.particlesManager.triggerBurst(handPos);
      }
    );

    this.particlesManager = new ParticlesManager(this.scene);
  }

  initInteractions() {
    let pointerStartX = 0;
    let pointerStartY = 0;

    window.addEventListener('pointerdown', (e) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    });

    window.addEventListener('pointerup', (event) => {
      const dist = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY);
      if (dist > 12) return; // Khoảng dung sai 12px tối ưu cho cả cảm ứng ngón tay trên điện thoại và chuột máy tính

      if (event.target.closest('#modal-lantern-wish') || event.target.closest('#modal-wish-input') || event.target.closest('.bottom-hint-note')) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // 1. Click vào Lồng Đèn -> Mở 1 trong 15 lời chúc ý nghĩa (0.01ms - 0 lag)
      const lanternHits = this.raycaster.intersectObjects(this.floatingLanterns.interactiveLanterns, false);
      if (lanternHits.length > 0) {
        const hitData = lanternHits[0].object.userData;
        if (hitData?.wish) {
          this.uiManager.showLanternWish(hitData.wish);
          this.particlesManager.triggerBurst(lanternHits[0].point);
          return;
        }
      }

      // 2. Click vào Cô Bé hoặc Lồng Đèn Trên Tay -> Mở modal điền tâm nguyện & thả đèn
      const girlHits = this.raycaster.intersectObjects(this.littleGirl.interactiveObjects, false);
      if (girlHits.length > 0) {
        this.particlesManager.triggerBurst(girlHits[0].point);
        this.uiManager.openWishInputModal();
        return;
      }

      // 3. Click vào Chú Cuội hoặc Thỏ Ngọc
      const figureHits = this.raycaster.intersectObjects(this.animalsManager.interactiveObjects, false);
      if (figureHits.length > 0) {
        const hitData = figureHits[0].object.userData;
        if (hitData?.isCuoi) {
          this.soundManager.playInteractionSound('flute');
          this.particlesManager.triggerBurst(figureHits[0].point);
          this.uiManager.showToast('🎋 Chú Cuội đang thổi khúc sáo trúc thanh bình!');
          return;
        }
        if (hitData?.isRabbit) {
          this.animalsManager.triggerHop();
          this.soundManager.playInteractionSound('wish');
          this.particlesManager.triggerBurst(figureHits[0].point);
          this.uiManager.showToast('🐰 Thỏ Ngọc nhảy múa mừng trăng rằm!');
          return;
        }
      }

      // 4. Click vào mặt đất: tạo chùm hoa lửa mini
      const groundHits = this.raycaster.intersectObjects(this.skyAndMoon.group.children, true);
      if (groundHits.length > 0) {
        this.particlesManager.triggerBurst(groundHits[0].point);
      }
    });
  }

  onResize() {
    this.updateCameraFraming(false);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.lightsManager) this.lightsManager.update(time);
    if (this.skyAndMoon) this.skyAndMoon.update(time);
    if (this.sakuraTree) this.sakuraTree.update(time);
    if (this.littleGirl) this.littleGirl.update(time);
    if (this.animalsManager) this.animalsManager.update(time);
    if (this.floatingLanterns) this.floatingLanterns.update(time);
    if (this.particlesManager) this.particlesManager.update(time);

    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.25;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MidAutumnApp();
});
