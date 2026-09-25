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

    // 3 góc máy được tinh chỉnh: Cây nằm chính giữa màn hình, bối cảnh mở rộng thoáng đãng
    this.cameraPresets = [
      { name: 'Toàn Cảnh Cây Hoa Anh Đào & Vầng Trăng', pos: new THREE.Vector3(0, 14, 38), target: new THREE.Vector3(0, 6.5, 0) },
      { name: 'Cận Cảnh Bé Thả Đèn & Thỏ Ngọc', pos: new THREE.Vector3(1.2, 3.6, 10.5), target: new THREE.Vector3(0.4, 2.0, 3.5) },
      { name: 'Góc Ngước Ngắm Trăng & Tán Hoa Rực Rỡ', pos: new THREE.Vector3(2.5, 2.5, 9.0), target: new THREE.Vector3(12, 22, -18) }
    ];
    this.currentPresetIndex = 0;

    this.initThree();
    this.initAudioAndUI();
    this.initSceneObjects();
    this.initInteractions();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  initThree() {
    // 1. Scene đêm sâu thẳm
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02040b);
    this.scene.fog = new THREE.FogExp2(0x02040b, 0.01);

    // 2. Camera: Góc nhìn mở rộng (FOV 42°) để bối cảnh rộng lớn và cây hoa anh đào vừa vặn trung tâm
    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    this.camera.position.copy(this.cameraPresets[0].pos);

    // 3. Renderer tối ưu hiệu năng và độ nét
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 4. OrbitControls: Tinh chỉnh vuốt chạm mượt mà
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08; // Độ trượt êm ái
    this.controls.rotateSpeed = 0.75;
    this.controls.zoomSpeed = 0.85;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 75;
    this.controls.target.copy(this.cameraPresets[0].target);
  }

  initAudioAndUI() {
    this.soundManager = new SoundManager();

    this.uiManager = new UIManager(
      this.soundManager,
      (wish) => {
        // Thả đèn trời từ vị trí cô bé
        if (this.littleGirl) {
          this.littleGirl.releaseLanternFromHand(wish);
        }
      },
      () => {
        // Chuyển góc nhìn camera
        return this.switchCameraPreset();
      },
      (wish) => {
        // Kích hoạt cô bé thả đèn
        if (this.littleGirl) {
          this.littleGirl.releaseLanternFromHand(wish);
          this.soundManager.playInteractionSound('wish');
          this.uiManager.showToast('🏮 Chiếc đèn lồng trên tay cô bé đang bay lên cung trăng rằm!');
        }
      }
    );
  }

  initSceneObjects() {
    // 1. Hệ thống chiếu sáng tương phản cao
    this.lightsManager = new LightsManager(this.scene);
    this.uiManager.updateProgress(20);

    // 2. Bầu trời đêm sâu thẳm, vầng trăng rằm & hòn đảo thần tiên
    this.skyAndMoon = new SkyAndMoon(this.scene);
    this.uiManager.updateProgress(40);

    // 3. Cây Hoa Anh Đào (Sakura Tree) rực rỡ ở trung tâm
    this.sakuraTree = new SakuraTree(this.scene);
    this.uiManager.updateProgress(60);

    // 4. Động vật dưới gốc cây (Thỏ ngọc & Chú trâu)
    this.animalsManager = new AnimalsManager(this.scene);
    this.uiManager.updateProgress(75);

    // 5. Đàn lồng đèn bay lượn quanh cây mang các lời chúc ý nghĩa
    this.floatingLanterns = new FloatingLanternsManager(
      this.scene,
      this.lightsManager,
      (wishData) => {
        this.uiManager.showLanternWish(wishData);
      }
    );
    this.uiManager.updateProgress(85);

    // 6. Cô Bé đứng dưới gốc cây cầm đèn lồng
    this.littleGirl = new LittleGirl(
      this.scene,
      this.lightsManager,
      (handPos, wishText) => {
        // Khi cô bé buông tay, sinh đèn trời bay lên
        this.floatingLanterns.spawnSkyLanternFromPosition(handPos, wishText);
        this.particlesManager.triggerBurst(handPos);
      }
    );
    this.uiManager.updateProgress(92);

    // 7. Hệ thống hạt ánh lửa, cánh hoa anh đào và đom đóm
    this.particlesManager = new ParticlesManager(this.scene);

    // Hoàn tất tải
    this.uiManager.updateProgress(100);
  }

  initInteractions() {
    let pointerStartX = 0;
    let pointerStartY = 0;

    window.addEventListener('pointerdown', (e) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    });

    window.addEventListener('pointerup', (event) => {
      // Nếu là thao tác vuốt xoay màn hình (di chuyển > 8px), không tính là click
      const dist = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY);
      if (dist > 8) return;

      if (event.target.closest('.ui-container') && !event.target.classList.contains('interaction-hints')) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // 1. Kiểm tra click vào Lồng Đèn bay quanh cây -> Mở lời chúc ý nghĩa!
      const lanternHits = this.raycaster.intersectObjects(this.floatingLanterns.interactiveLanterns, true);
      if (lanternHits.length > 0) {
        let obj = lanternHits[0].object;
        while (obj.parent && !obj.userData?.isClickableLantern) {
          obj = obj.parent;
        }
        if (obj.userData?.wish) {
          this.uiManager.showLanternWish(obj.userData.wish);
          this.particlesManager.triggerBurst(lanternHits[0].point);
          return;
        }
      }

      // 2. Kiểm tra click vào Cô Bé hoặc đèn trên tay cô bé -> Thả đèn bay lên!
      const girlHits = this.raycaster.intersectObjects(this.littleGirl.interactiveObjects, true);
      if (girlHits.length > 0) {
        this.littleGirl.releaseLanternFromHand('Cầu chúc gia đình bình an, vạn sự viên mãn!');
        this.soundManager.playInteractionSound('wish');
        this.particlesManager.triggerBurst(girlHits[0].point);
        this.uiManager.showToast('🏮 Bé đã thắp sáng và thả đèn ước nguyện bay lên trời!');
        return;
      }

      // 3. Kiểm tra click vào Thỏ Ngọc
      const animalHits = this.raycaster.intersectObjects(this.animalsManager.interactiveObjects, true);
      if (animalHits.length > 0) {
        let rootObj = animalHits[0].object;
        while (rootObj.parent && !['JadeRabbit', 'BabyRabbit', 'Buffalo'].includes(rootObj.name)) {
          rootObj = rootObj.parent;
        }
        this.animalsManager.triggerHop(rootObj);
        this.soundManager.playInteractionSound('chime');
        this.particlesManager.triggerBurst(animalHits[0].point);
        this.uiManager.showToast('🐰 Chú Thỏ Ngọc nhảy múa mừng trăng rằm!');
        return;
      }

      // 4. Click vào mặt đất hoặc không gian: bung nở chùm hoa lửa mini
      const groundHits = this.raycaster.intersectObjects(this.skyAndMoon.group.children, true);
      if (groundHits.length > 0) {
        this.particlesManager.triggerBurst(groundHits[0].point);
      }
    });
  }

  switchCameraPreset() {
    this.currentPresetIndex = (this.currentPresetIndex + 1) % this.cameraPresets.length;
    const preset = this.cameraPresets[this.currentPresetIndex];

    this.targetCameraPos = preset.pos.clone();
    this.targetCameraLookAt = preset.target.clone();
    this.cameraTransitionProgress = 0;

    return preset.name;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Cập nhật các module
    if (this.lightsManager) this.lightsManager.update(time);
    if (this.skyAndMoon) this.skyAndMoon.update(time);
    if (this.sakuraTree) this.sakuraTree.update(time);
    if (this.littleGirl) this.littleGirl.update(time);
    if (this.animalsManager) this.animalsManager.update(time);
    if (this.floatingLanterns) this.floatingLanterns.update(time);
    if (this.particlesManager) this.particlesManager.update(time);

    // Chuyển góc máy mượt mà
    if (this.targetCameraPos) {
      this.cameraTransitionProgress += delta * 1.6;
      const t = Math.min(1, this.cameraTransitionProgress);

      this.camera.position.lerp(this.targetCameraPos, 0.08);
      this.controls.target.lerp(this.targetCameraLookAt, 0.08);

      if (t >= 1) {
        this.targetCameraPos = null;
      }
    }

    // Tự động xoay chậm điện ảnh
    this.controls.autoRotate = !this.targetCameraPos;
    this.controls.autoRotateSpeed = 0.3;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MidAutumnApp();
});
