import * as THREE from 'three';

/**
 * Cô Bé Đáng Yêu đứng dưới gốc cây hoa anh đào:
 * - Cầm chiếc lồng đèn ước nguyện có ánh lửa bập bùng rõ nét trên tay
 * - Khi click vào cô bé, chiếc lồng đèn sẽ bay vút lên bầu trời sao
 */
export class LittleGirl {
  constructor(scene, onReleaseLanternCallback) {
    this.scene = scene;
    this.onReleaseLanternCallback = onReleaseLanternCallback;
    this.group = new THREE.Group();
    this.interactiveObjects = [];

    this.createMaterials();
    this.buildCharacter();
    this.createHandWishLantern();

    // Vị trí đứng dưới bóng cây hoa anh đào trên nền đất nâu
    this.group.position.set(1.5, 0.4, 3.2);
    this.group.rotation.y = -Math.PI * 0.22;
    this.scene.add(this.group);
  }

  createMaterials() {
    this.skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfba, roughness: 0.6 });
    this.hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1412, roughness: 0.8 });
    this.dressRedMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      emissive: 0x670010,
      emissiveIntensity: 0.25,
      roughness: 0.5
    });
    this.goldTrimMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    this.sashMat = new THREE.MeshStandardMaterial({ color: 0x2a9d8f, roughness: 0.4 });
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    this.cheekMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.65 });
  }

  buildCharacter() {
    this.charBody = new THREE.Group();
    this.group.add(this.charBody);

    // Váy áo
    const dressGeo = new THREE.CylinderGeometry(0.32, 0.68, 1.35, 12);
    const dress = new THREE.Mesh(dressGeo, this.dressRedMat);
    dress.position.y = 0.68;
    this.charBody.add(dress);

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.15, 12), this.sashMat);
    belt.position.y = 1.05;
    this.charBody.add(belt);

    // Thân trên
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.65, 10), this.dressRedMat);
    torso.position.y = 1.5;
    this.charBody.add(torso);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 12), this.goldTrimMat);
    collar.position.y = 1.85;
    collar.rotation.x = Math.PI * 0.5;
    this.charBody.add(collar);

    // Đầu
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), this.skinMat);
    head.position.set(0, 2.25, 0);
    this.charBody.add(head);
    this.head = head;

    // Mắt & Má
    const eyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.15, 2.3, 0.42);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.15, 2.3, 0.42);
    this.charBody.add(eyeL, eyeR);

    const cheekGeo = new THREE.CircleGeometry(0.07, 8);
    const cheekL = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekL.position.set(-0.24, 2.2, 0.44);
    const cheekR = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekR.position.set(0.24, 2.2, 0.44);
    this.charBody.add(cheekL, cheekR);

    // Tóc & Búi củ tỏi
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.47, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), this.hairMat);
    hairCap.position.set(0, 2.28, 0);
    this.charBody.add(hairCap);

    const bunGeo = new THREE.SphereGeometry(0.16, 8, 8);
    const bunL = new THREE.Mesh(bunGeo, this.hairMat);
    bunL.position.set(-0.38, 2.7, 0);
    const bunR = new THREE.Mesh(bunGeo, this.hairMat);
    bunR.position.set(0.38, 2.7, 0);
    this.charBody.add(bunL, bunR);

    // Cánh tay & que cầm
    this.armGroup = new THREE.Group();
    this.armGroup.position.set(0.25, 1.65, 0.1);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 6), this.dressRedMat);
    arm.position.set(0.1, 0, 0.2);
    arm.rotation.x = Math.PI * 0.4;
    this.armGroup.add(arm);

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.78, 4), this.goldTrimMat);
    stick.position.set(0.1, 0.1, 0.65);
    stick.rotation.x = Math.PI * 0.25;
    this.armGroup.add(stick);

    this.charBody.add(this.armGroup);

    // Collider cho cô bé
    const collider = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.6, 6), new THREE.MeshBasicMaterial({ visible: false }));
    collider.position.y = 1.3;
    collider.userData = { isGirl: true };
    this.group.add(collider);
    this.interactiveObjects.push(collider);
  }

  createHandWishLantern() {
    this.lanternGroup = new THREE.Group();
    this.lanternGroup.position.set(0.35, 1.55, 1.25);
    this.lanternGroup.scale.setScalar(0.55);

    // Thân đèn mờ
    const bodyGeo = new THREE.CylinderGeometry(0.78, 0.62, 1.55, 10, 1, false);
    const paperMat = new THREE.MeshBasicMaterial({
      color: 0xfff0c2,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeo, paperMat);
    this.lanternGroup.add(body);

    // Khung nẹp
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x4a2810 });
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.04, 4, 12), rimMat);
    topRim.rotation.x = Math.PI * 0.5;
    topRim.position.y = 0.77;
    const btmRim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 4, 12), rimMat);
    btmRim.rotation.x = Math.PI * 0.5;
    btmRim.position.y = -0.77;
    this.lanternGroup.add(topRim, btmRim);

    // Ngọn lửa bên trong
    this.handFlame = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    this.handFlame.position.set(0, -0.1, 0);
    this.lanternGroup.add(this.handFlame);

    // Hào quang tỏa sáng
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const ctx = glowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 230, 150, 0.9)');
    grad.addColorStop(0.5, 'rgba(255, 140, 20, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const glowMat = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(4.0, 4.0, 1);
    this.lanternGroup.add(glowSprite);

    this.group.add(this.lanternGroup);
  }

  releaseLanternFromHand(wishText = '') {
    if (this.isReleasing) return;
    this.isReleasing = true;

    if (this.onReleaseLanternCallback) {
      const worldPos = new THREE.Vector3();
      this.lanternGroup.getWorldPosition(worldPos);
      this.onReleaseLanternCallback(worldPos, wishText);
    }

    const initialY = this.armGroup.position.y;
    let progress = 0;
    this.lanternGroup.visible = false;

    const armAnim = () => {
      progress += 0.05;
      if (progress <= Math.PI) {
        this.armGroup.position.y = initialY + Math.sin(progress) * 0.25;
        this.armGroup.rotation.x = -Math.sin(progress) * 0.3;
        requestAnimationFrame(armAnim);
      } else {
        this.armGroup.position.y = initialY;
        this.armGroup.rotation.x = 0;
        setTimeout(() => {
          this.lanternGroup.visible = true;
          this.lanternGroup.scale.set(0.05, 0.05, 0.05);
          let scaleUp = 0.05;
          const growAnim = () => {
            scaleUp += 0.06;
            if (scaleUp <= 0.55) {
              this.lanternGroup.scale.setScalar(scaleUp);
              requestAnimationFrame(growAnim);
            } else {
              this.lanternGroup.scale.setScalar(0.55);
              this.isReleasing = false;
            }
          };
          growAnim();
        }, 800);
      }
    };
    armAnim();
  }

  update(time) {
    const sway = Math.sin(time * 2.2) * 0.03;
    if (this.head) {
      this.head.rotation.y = Math.sin(time * 1.5) * 0.08;
    }
    this.charBody.rotation.z = sway;

    if (this.lanternGroup && this.lanternGroup.visible) {
      this.lanternGroup.rotation.z = Math.sin(time * 3) * 0.06;
      if (this.handFlame) {
        const pulse = 1 + Math.sin(time * 8) * 0.15;
        this.handFlame.scale.setScalar(pulse);
      }
    }
  }
}
