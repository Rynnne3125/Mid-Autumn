import * as THREE from 'three';

/**
 * Cô Bé Đáng Yêu đứng dưới gốc cây hoa anh đào:
 * - Cầm chiếc lồng đèn ước nguyện (Khổng Minh Đăng) truyền thống trên tay
 * - Khi bấm "Thả Đèn", chiếc lồng đèn trên tay cô bé sẽ thắp sáng và bay vút lên bầu trời sao
 */
export class LittleGirl {
  constructor(scene, lightsManager, onReleaseLanternCallback) {
    this.scene = scene;
    this.lightsManager = lightsManager;
    this.onReleaseLanternCallback = onReleaseLanternCallback;
    this.group = new THREE.Group();
    this.interactiveObjects = [];

    this.createMaterials();
    this.buildCharacter();
    this.createHandWishLantern();

    // Vị trí đứng dưới bóng cây hoa anh đào trên nền cỏ xanh
    this.group.position.set(1.5, 0.4, 3.4);
    this.group.rotation.y = -Math.PI * 0.22;
    this.scene.add(this.group);
  }

  createMaterials() {
    this.skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfba,
      roughness: 0.6
    });

    this.hairMat = new THREE.MeshStandardMaterial({
      color: 0x1a1412,
      roughness: 0.8
    });

    this.dressRedMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      emissive: 0x670010,
      emissiveIntensity: 0.25,
      roughness: 0.5
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.7,
      roughness: 0.3
    });

    this.sashMat = new THREE.MeshStandardMaterial({
      color: 0x2a9d8f,
      roughness: 0.4
    });

    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    this.cheekMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.65 });
  }

  buildCharacter() {
    this.charBody = new THREE.Group();
    this.group.add(this.charBody);

    // 1. Tà váy áo truyền thống xòe
    const dressGeo = new THREE.CylinderGeometry(0.32, 0.68, 1.35, 16);
    const dress = new THREE.Mesh(dressGeo, this.dressRedMat);
    dress.position.y = 0.68;
    dress.castShadow = true;
    this.charBody.add(dress);

    // Đai thắt lưng xanh ngọc
    const beltGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.15, 16);
    const belt = new THREE.Mesh(beltGeo, this.sashMat);
    belt.position.y = 1.05;
    this.charBody.add(belt);

    // 2. Thân trên áo
    const torsoGeo = new THREE.CylinderGeometry(0.3, 0.34, 0.65, 12);
    const torso = new THREE.Mesh(torsoGeo, this.dressRedMat);
    torso.position.y = 1.5;
    torso.castShadow = true;
    this.charBody.add(torso);

    // Viền cổ áo vàng hoàng gia
    const collarGeo = new THREE.TorusGeometry(0.22, 0.045, 8, 16);
    collarGeo.rotateX(Math.PI * 0.5);
    const collar = new THREE.Mesh(collarGeo, this.goldTrimMat);
    collar.position.y = 1.85;
    this.charBody.add(collar);

    // 3. Đầu và khuôn mặt tròn trĩnh
    const headGeo = new THREE.SphereGeometry(0.46, 16, 16);
    headGeo.scale(1, 0.95, 1);
    const head = new THREE.Mesh(headGeo, this.skinMat);
    head.position.set(0, 2.25, 0);
    head.castShadow = true;
    this.charBody.add(head);
    this.head = head;

    // Mắt to tròn long lanh
    const eyeGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.15, 2.3, 0.42);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.15, 2.3, 0.42);
    this.charBody.add(eyeL, eyeR);

    // Má hồng phấn
    const cheekGeo = new THREE.CircleGeometry(0.075, 12);
    const cheekL = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekL.position.set(-0.24, 2.2, 0.44);
    const cheekR = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekR.position.set(0.24, 2.2, 0.44);
    this.charBody.add(cheekL, cheekR);

    // 4. Mái tóc và hai búi củ tỏi xinh xắn
    const hairCapGeo = new THREE.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairCap = new THREE.Mesh(hairCapGeo, this.hairMat);
    hairCap.position.set(0, 2.28, 0);
    this.charBody.add(hairCap);

    const bunGeo = new THREE.SphereGeometry(0.17, 10, 10);
    const bunL = new THREE.Mesh(bunGeo, this.hairMat);
    bunL.position.set(-0.4, 2.7, 0);
    const bunR = new THREE.Mesh(bunGeo, this.hairMat);
    bunR.position.set(0.4, 2.7, 0);

    const bowGeo = new THREE.TorusGeometry(0.11, 0.035, 6, 12);
    const bowL = new THREE.Mesh(bowGeo, this.dressRedMat);
    bowL.position.copy(bunL.position);
    bowL.rotation.y = Math.PI * 0.5;
    const bowR = new THREE.Mesh(bowGeo, this.dressRedMat);
    bowR.position.copy(bunR.position);
    bowR.rotation.y = Math.PI * 0.5;

    this.charBody.add(bunL, bunR, bowL, bowR);

    // 5. Cánh tay nâng que lồng đèn
    this.armGroup = new THREE.Group();
    this.armGroup.position.set(0.26, 1.65, 0.1);

    const armGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.52, 8);
    armGeo.rotateX(Math.PI * 0.4);
    const arm = new THREE.Mesh(armGeo, this.dressRedMat);
    arm.position.set(0.1, 0, 0.2);
    this.armGroup.add(arm);

    const handGeo = new THREE.SphereGeometry(0.075, 8, 8);
    const hand = new THREE.Mesh(handGeo, this.skinMat);
    hand.position.set(0.1, -0.05, 0.44);
    this.armGroup.add(hand);

    // Cán tre cầm đèn
    const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6);
    stickGeo.rotateX(Math.PI * 0.25);
    const stick = new THREE.Mesh(stickGeo, this.goldTrimMat);
    stick.position.set(0.1, 0.1, 0.68);
    this.armGroup.add(stick);

    this.charBody.add(this.armGroup);

    this.charBody.name = 'LittleGirl';
    this.interactiveObjects.push(this.charBody);
  }

  /**
   * Tạo chiếc Đèn Trời Ước Nguyện (Khổng Minh Đăng) thu nhỏ trên tay cô bé
   */
  createHandWishLantern() {
    this.lanternGroup = new THREE.Group();
    this.lanternGroup.position.set(0.36, 1.55, 1.25);
    this.lanternGroup.scale.setScalar(0.55); // Kích thước cầm tay vừa vặn

    // Thân đèn lồng giấy kem vàng
    const bodyGeo = new THREE.CylinderGeometry(0.72, 0.58, 1.45, 12, 1, false);
    bodyGeo.scale(1, 1, 0.9);

    // Canvas vẽ chữ "Phúc" trên đèn tay
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff6cc';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#d90429';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, 226, 226);
    ctx.font = 'bold 90px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b7094c';
    ctx.fillText('福', 128, 120);
    ctx.font = 'bold 20px "Montserrat", sans-serif';
    ctx.fillText('Phúc An', 128, 195);
    const tex = new THREE.CanvasTexture(canvas);

    const paperMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: 0xffa200,
      emissiveIntensity: 0.9,
      roughness: 0.4
    });

    const body = new THREE.Mesh(bodyGeo, paperMat);
    this.lanternGroup.add(body);

    // Khung nẹp tre
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x6f4e37, roughness: 0.8 });
    const topRimGeo = new THREE.TorusGeometry(0.72, 0.04, 6, 16);
    topRimGeo.rotateX(Math.PI * 0.5);
    const topRim = new THREE.Mesh(topRimGeo, rimMat);
    topRim.position.y = 0.72;

    const btmRimGeo = new THREE.TorusGeometry(0.58, 0.04, 6, 16);
    btmRimGeo.rotateX(Math.PI * 0.5);
    const btmRim = new THREE.Mesh(btmRimGeo, rimMat);
    btmRim.position.y = -0.72;
    this.lanternGroup.add(topRim, btmRim);

    // Ngọn lửa nhỏ
    const flameGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = -0.1;
    this.lanternGroup.add(flame);

    // Tua rua đỏ
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.7, 6);
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.6 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.y = -1.15;
    this.lanternGroup.add(tassel);

    // Ánh sáng ấm
    this.handLight = new THREE.PointLight(0xffaa00, 1.8, 8, 1.5);
    this.lanternGroup.add(this.handLight);
    this.lightsManager.registerFlickerLight(this.handLight, 1.8, 0.4);

    this.group.add(this.lanternGroup);

    this.lanternGroup.name = 'HandLantern';
    this.interactiveObjects.push(this.lanternGroup);
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
      this.head.rotation.x = Math.sin(time * 2.0) * 0.04;
    }
    this.charBody.rotation.z = sway;

    if (this.lanternGroup && this.lanternGroup.visible) {
      this.lanternGroup.rotation.z = Math.sin(time * 3) * 0.08;
      this.lanternGroup.rotation.x = Math.cos(time * 2.5) * 0.06;
    }
  }
}
