import * as THREE from 'three';

/**
 * Cô Bé Đáng Yêu đứng dưới gốc cây hoa anh đào:
 * - Mặc trang phục truyền thống đỏ thắm viền vàng rực rỡ
 * - Cầm chiếc lồng đèn trung thu phát sáng trên tay
 * - Khi kích hoạt "Thả Đèn", chiếc lồng đèn trên tay cô bé sẽ thắp sáng và bay vút lên bầu trời đêm
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
    this.createHandLantern();

    // Vị trí đứng dưới bóng cây hoa anh đào, hơi chếch về phía trước bên phải
    this.group.position.set(1.6, 0.4, 3.6);
    this.group.rotation.y = -Math.PI * 0.2;
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
      emissiveIntensity: 0.3,
      roughness: 0.5
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.7,
      roughness: 0.3
    });

    this.sashGreenMat = new THREE.MeshStandardMaterial({
      color: 0x2ec4b6,
      roughness: 0.4
    });

    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    this.cheekMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.6 });
  }

  buildCharacter() {
    this.charBody = new THREE.Group();
    this.group.add(this.charBody);

    // 1. Tà váy áo truyền thống xòe hình nón cụt
    const dressGeo = new THREE.CylinderGeometry(0.35, 0.72, 1.4, 16);
    const dress = new THREE.Mesh(dressGeo, this.dressRedMat);
    dress.position.y = 0.7;
    dress.castShadow = true;
    this.charBody.add(dress);

    // Đai thắt lưng lụa màu xanh ngọc
    const beltGeo = new THREE.CylinderGeometry(0.38, 0.4, 0.16, 16);
    const belt = new THREE.Mesh(beltGeo, this.sashGreenMat);
    belt.position.y = 1.1;
    this.charBody.add(belt);

    // 2. Thân trên áo
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.7, 12);
    const torso = new THREE.Mesh(torsoGeo, this.dressRedMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    this.charBody.add(torso);

    // Viền cổ áo vàng hoàng gia
    const collarGeo = new THREE.TorusGeometry(0.24, 0.05, 8, 16);
    collarGeo.rotateX(Math.PI * 0.5);
    const collar = new THREE.Mesh(collarGeo, this.goldTrimMat);
    collar.position.y = 1.95;
    this.charBody.add(collar);

    // 3. Đầu và khuôn mặt tròn trĩnh
    const headGeo = new THREE.SphereGeometry(0.48, 16, 16);
    headGeo.scale(1, 0.95, 1);
    const head = new THREE.Mesh(headGeo, this.skinMat);
    head.position.set(0, 2.38, 0);
    head.castShadow = true;
    this.charBody.add(head);
    this.head = head;

    // Mắt to tròn long lanh
    const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.16, 2.42, 0.44);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.16, 2.42, 0.44);
    this.charBody.add(eyeL, eyeR);

    // Hai má hồng phấn đáng yêu
    const cheekGeo = new THREE.CircleGeometry(0.08, 12);
    const cheekL = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekL.position.set(-0.25, 2.32, 0.46);
    const cheekR = new THREE.Mesh(cheekGeo, this.cheekMat);
    cheekR.position.set(0.25, 2.32, 0.46);
    this.charBody.add(cheekL, cheekR);

    // 4. Mái tóc và hai búi tóc nhỏ xinh (Búi củ tỏi)
    const hairCapGeo = new THREE.SphereGeometry(0.5, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairCap = new THREE.Mesh(hairCapGeo, this.hairMat);
    hairCap.position.set(0, 2.42, 0);
    this.charBody.add(hairCap);

    // Búi tóc trái & phải
    const bunGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const bunL = new THREE.Mesh(bunGeo, this.hairMat);
    bunL.position.set(-0.42, 2.85, 0);
    const bunR = new THREE.Mesh(bunGeo, this.hairMat);
    bunR.position.set(0.42, 2.85, 0);

    // Nơ buộc tóc đỏ
    const bowGeo = new THREE.TorusGeometry(0.12, 0.04, 6, 12);
    const bowL = new THREE.Mesh(bowGeo, this.dressRedMat);
    bowL.position.copy(bunL.position);
    bowL.rotation.y = Math.PI * 0.5;
    const bowR = new THREE.Mesh(bowGeo, this.dressRedMat);
    bowR.position.copy(bunR.position);
    bowR.rotation.y = Math.PI * 0.5;

    this.charBody.add(bunL, bunR, bowL, bowR);

    // 5. Cánh tay nâng lồng đèn
    this.armGroup = new THREE.Group();
    this.armGroup.position.set(0.28, 1.75, 0.1);

    // Tay phải đưa ra trước cầm que lồng đèn
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
    armGeo.rotateX(Math.PI * 0.4);
    const arm = new THREE.Mesh(armGeo, this.dressRedMat);
    arm.position.set(0.1, 0, 0.22);
    this.armGroup.add(arm);

    // Bàn tay nhỏ
    const handGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const hand = new THREE.Mesh(handGeo, this.skinMat);
    hand.position.set(0.1, -0.05, 0.48);
    this.armGroup.add(hand);

    // Cán tre cầm lồng đèn
    const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 6);
    stickGeo.rotateX(Math.PI * 0.25);
    const stick = new THREE.Mesh(stickGeo, this.goldTrimMat);
    stick.position.set(0.1, 0.1, 0.72);
    this.armGroup.add(stick);

    this.charBody.add(this.armGroup);

    // Gán đối tượng tương tác
    this.charBody.name = 'LittleGirl';
    this.interactiveObjects.push(this.charBody);
  }

  /**
   * Tạo chiếc lồng đèn con phát sáng trên tay cô bé
   */
  createHandLantern() {
    this.lanternGroup = new THREE.Group();
    // Vị trí lơ lửng ngay đầu que cầm
    this.lanternGroup.position.set(0.38, 1.65, 1.35);

    // Thân đèn lồng hình hoa sen / đèn xếp mini
    const bodyGeo = new THREE.SphereGeometry(0.28, 12, 10);
    bodyGeo.scale(1, 1.15, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xfb8500,
      emissiveIntensity: 0.95,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.lanternGroup.add(body);

    // Ngọn lửa nhỏ bên trong
    const flameGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    this.lanternGroup.add(flame);

    // Tua rua vàng
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.35, 6);
    const tassel = new THREE.Mesh(tasselGeo, this.goldTrimMat);
    tassel.position.y = -0.45;
    this.lanternGroup.add(tassel);

    // Nguồn sáng ấm áp chiếu lên cô bé và mặt đất
    this.handLight = new THREE.PointLight(0xffa200, 1.8, 8, 1.5);
    this.lanternGroup.add(this.handLight);
    this.lightsManager.registerFlickerLight(this.handLight, 1.8, 0.4);

    this.group.add(this.lanternGroup);

    // Đánh dấu để click
    this.lanternGroup.name = 'HandLantern';
    this.interactiveObjects.push(this.lanternGroup);
  }

  /**
   * Kích hoạt Thả Đèn từ tay cô bé bay lên trời
   */
  releaseLanternFromHand(wishText = '') {
    if (this.isReleasing) return;
    this.isReleasing = true;

    // Gọi callback để tạo đèn trời bay lên bầu trời
    if (this.onReleaseLanternCallback) {
      // Vị trí thế giới của chiếc đèn
      const worldPos = new THREE.Vector3();
      this.lanternGroup.getWorldPosition(worldPos);
      this.onReleaseLanternCallback(worldPos, wishText);
    }

    // Hiệu ứng giơ tay thả đèn
    const initialY = this.armGroup.position.y;
    let progress = 0;

    // Làm mờ chiếc đèn trên tay rồi hồi sinh chiếc mới
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
        // Xuất hiện lại chiếc đèn mới sau 1.2s
        setTimeout(() => {
          this.lanternGroup.visible = true;
          this.lanternGroup.scale.set(0.1, 0.1, 0.1);
          let scaleUp = 0.1;
          const growAnim = () => {
            scaleUp += 0.08;
            if (scaleUp <= 1) {
              this.lanternGroup.scale.setScalar(scaleUp);
              requestAnimationFrame(growAnim);
            } else {
              this.lanternGroup.scale.setScalar(1);
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
    // 1. Nhịp thở và khẽ đung đưa của cô bé
    const sway = Math.sin(time * 2.2) * 0.03;
    if (this.head) {
      this.head.rotation.y = Math.sin(time * 1.5) * 0.08;
      this.head.rotation.x = Math.sin(time * 2.0) * 0.04;
    }
    this.charBody.rotation.z = sway;

    // 2. Chiếc đèn trên tay khẽ lay động theo gió
    if (this.lanternGroup && this.lanternGroup.visible) {
      this.lanternGroup.rotation.z = Math.sin(time * 3) * 0.08;
      this.lanternGroup.rotation.x = Math.cos(time * 2.5) * 0.06;
    }
  }
}
