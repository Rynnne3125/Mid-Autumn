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
    // 1. Scene nền đen tuyền sâu thẳm
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // 2. Camera góc nhìn mở rộng thoáng đãng
    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    this.camera.position.set(0, 16, 44);

    // 3. Renderer tối ưu 60 FPS mượt mà
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Giới hạn pixel ratio ở 1.5 để máy yếu hoặc màn hình retina 3x-4x vẫn chạy siêu mượt 60fps
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. OrbitControls: Xoay 360 độ êm ái
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
    this.uiManager = new UIManager(this.soundManager);
  }

  initSceneObjects() {
    // 1. Ánh sáng nhẹ gọn
    this.lightsManager = new LightsManager(this.scene);

    // 2. Bầu trời sao ánh nhẹ & Nền đất nâu đậm
    this.skyAndMoon = new SkyAndMoon(this.scene);

    // 3. Cây Hoa Anh Đào khung gỗ thanh thoát
    this.sakuraTree = new SakuraTree(this.scene);

    // 4. Động vật dưới gốc cây
    this.animalsManager = new AnimalsManager(this.scene);

    // 5. Đàn lồng đèn ước nguyện ánh lửa bập bùng (nằm xa cây và thoáng đãng)
    this.floatingLanterns = new FloatingLanternsManager(
      this.scene,
      (wishData) => {
        this.uiManager.showLanternWish(wishData);
      }
    );

    // 6. Cô Bé đứng dưới gốc cây
    this.littleGirl = new LittleGirl(
      this.scene,
      (handPos, wishText) => {
        this.floatingLanterns.spawnSkyLanternFromPosition(handPos, wishText);
        this.particlesManager.triggerBurst(handPos);
      }
    );

    // 7. Hệ thống hạt ánh lửa & cánh hoa anh đào rơi
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
      // Phân biệt thao tác vuốt xoay (di chuyển > 8px) với thao tác chạm click
      const dist = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY);
      if (dist > 8) return;

      if (event.target.closest('#modal-lantern-wish') || event.target.closest('.bottom-hint-note')) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // 1. Click vào Lồng Đèn Ước Nguyện (Chỉ raycast collider bounding sphere, chạy trong 0.01ms - 0 lag)
      const lanternHits = this.raycaster.intersectObjects(this.floatingLanterns.interactiveLanterns, false);
      if (lanternHits.length > 0) {
        const hitData = lanternHits[0].object.userData;
        if (hitData?.wish) {
          this.uiManager.showLanternWish(hitData.wish);
          this.particlesManager.triggerBurst(lanternHits[0].point);
          return;
        }
      }

      // 2. Click vào Cô Bé -> Thả đèn
      const girlHits = this.raycaster.intersectObjects(this.littleGirl.interactiveObjects, false);
      if (girlHits.length > 0) {
        this.littleGirl.releaseLanternFromHand('Cầu mong gia đình bình an, vạn sự viên mãn!');
        this.soundManager.playInteractionSound('wish');
        this.particlesManager.triggerBurst(girlHits[0].point);
        this.uiManager.showToast('🏮 Bé đã thắp sáng ngọn đèn ước nguyện bay lên trời!');
        return;
      }

      // 3. Click vào Thỏ Ngọc
      const animalHits = this.raycaster.intersectObjects(this.animalsManager.interactiveObjects, true);
      if (animalHits.length > 0) {
        let rootObj = animalHits[0].object;
        while (rootObj.parent && !['JadeRabbit', 'BabyRabbit', 'Buffalo'].includes(rootObj.name)) {
          rootObj = rootObj.parent;
        }
        this.animalsManager.triggerHop(rootObj);
        this.soundManager.playInteractionSound('chime');
        this.particlesManager.triggerBurst(animalHits[0].point);
        return;
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

    // Tự động xoay chậm nhẹ nhàng
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.25;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MidAutumnApp();
});
