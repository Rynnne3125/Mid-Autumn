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

    // Vị trí mỏ neo không gian 3D của bong bóng chat "🏮 Thả đèn" trên đầu cô bé
    this.girlBubbleWorldPos = new THREE.Vector3(1.5, 3.25, 3.2);
    this.tempScreenPos = new THREE.Vector3();

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
    this.camera.position.set(0, 16, 44);

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
    this.controls.minDistance = 10;
    this.controls.maxDistance = 85;
    this.controls.target.set(0, 5.5, 0);
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
      if (dist > 8) return;

      if (event.target.closest('#modal-lantern-wish') || event.target.closest('.bottom-hint-note')) {
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
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

    // Cập nhật vị trí bong bóng chat "🏮 Thả đèn" trên đầu cô bé
    if (this.uiManager && this.camera) {
      this.tempScreenPos.copy(this.girlBubbleWorldPos).project(this.camera);
      if (this.tempScreenPos.z < 1) {
        const screenX = (this.tempScreenPos.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-(this.tempScreenPos.y * 0.5) + 0.5) * window.innerHeight;
        this.uiManager.updateGirlBubblePosition(screenX, screenY, true);
      } else {
        this.uiManager.updateGirlBubblePosition(0, 0, false);
      }
    }

    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.25;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MidAutumnApp();
});
