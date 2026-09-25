import * as THREE from 'three';

/**
 * Các nhân vật và linh vật đêm Trung Thu dưới gốc cây hoa anh đào:
 * 1. Chú Cuội ngồi dựa gốc cây thổi sáo trúc du dương
 * 2. Thỏ Ngọc cung trăng xinh xắn bên cối ngọc giã thuốc
 * 3. Bàn trà gốm mộc & Đĩa Bánh Trung Thu nướng vàng óng truyền thống
 */
export class AnimalsManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.interactiveObjects = [];

    this.createMaterials();
    this.createChuCuoiFlute();
    this.createJadeRabbit();
    this.createTeaAndMooncakeSet();
    this.createHoppingRabbits();

    this.scene.add(this.group);
  }

  createMaterials() {
    // Da người tự nhiên
    this.skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfba, roughness: 0.65 });
    
    // Trang phục Chú Cuội (áo bà ba nâu mộc mạc)
    this.cuoiClothMat = new THREE.MeshStandardMaterial({ color: 0x6c584c, roughness: 0.85 });
    this.cuoiPantsMat = new THREE.MeshStandardMaterial({ color: 0x3d312a, roughness: 0.85 });
    this.headbandMat = new THREE.MeshStandardMaterial({ color: 0xb7094c, roughness: 0.6 });
    this.fluteMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, metalness: 0.2, roughness: 0.4 });

    // Lông Thỏ Ngọc trắng ngọc thanh khiết
    this.rabbitFurMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.05
    });
    this.rabbitPinkMat = new THREE.MeshStandardMaterial({ color: 0xffccd5, roughness: 0.5 });
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });

    // Cối ngọc cẩm thạch
    this.jadeMat = new THREE.MeshStandardMaterial({
      color: 0xa8dadc,
      emissive: 0x1d3557,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.1
    });

    // Bánh trung thu vàng ươm & bàn trà
    this.mooncakeCrustMat = new THREE.MeshStandardMaterial({
      color: 0xc87d28, // Vàng nâu nướng óng ả
      roughness: 0.45,
      metalness: 0.1
    });
    this.plateMat = new THREE.MeshStandardMaterial({ color: 0xf1faee, roughness: 0.25 });
    this.woodTableMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.8 });
  }

  /**
   * Tạo Chú Cuội ngồi dựa gốc cây, tay nâng ống sáo trúc thổi nhạc
   */
  createChuCuoiFlute() {
    const cuoi = new THREE.Group();
    // Vị trí ngồi tựa vào thân cây bên trái
    cuoi.position.set(-1.8, 0.2, 1.2);
    cuoi.rotation.y = Math.PI * 0.32;
    cuoi.name = 'ChuCuoi';

    // 1. Thân áo bà ba ngồi hơi ngả lưng
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.42, 1.0, 10);
    const body = new THREE.Mesh(bodyGeo, this.cuoiClothMat);
    body.position.set(0, 0.7, 0);
    body.rotation.x = -0.15; // Ngả lưng tựa cây
    cuoi.add(body);

    // 2. Chân ngồi khoanh bằng tròn
    const legGeo = new THREE.TorusGeometry(0.5, 0.18, 8, 12, Math.PI * 1.2);
    const leg = new THREE.Mesh(legGeo, this.cuoiPantsMat);
    leg.position.set(0, 0.2, 0.25);
    leg.rotation.x = Math.PI * 0.5;
    cuoi.add(leg);

    // 3. Đầu Chú Cuội
    const headGeo = new THREE.SphereGeometry(0.36, 12, 12);
    headGeo.scale(1, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, this.skinMat);
    head.position.set(0, 1.45, -0.05);
    cuoi.add(head);
    this.cuoiHead = head;

    // Khăn đóng / dải băng đỏ quấn trán đặc trưng
    const bandGeo = new THREE.TorusGeometry(0.36, 0.045, 6, 16);
    const band = new THREE.Mesh(bandGeo, this.headbandMat);
    band.position.set(0, 1.55, -0.05);
    band.rotation.x = Math.PI * 0.5;
    cuoi.add(band);

    // Mắt cười híp mắt khi thổi sáo
    const eyeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0, 0),
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(0.06, 0, 0)
    ]);
    const eyeGeo = new THREE.TubeGeometry(eyeCurve, 4, 0.015, 4, false);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.12, 1.5, 0.28);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.12, 1.5, 0.28);
    cuoi.add(eyeL, eyeR);

    // 4. Hai cánh tay nâng ống sáo trúc lên miệng
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 6), this.cuoiClothMat);
    armL.position.set(-0.28, 1.05, 0.22);
    armL.rotation.set(0.8, -0.4, 0.5);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 6), this.cuoiClothMat);
    armR.position.set(0.28, 1.05, 0.22);
    armR.rotation.set(0.8, 0.4, -0.5);
    cuoi.add(armL, armR);

    // 5. Ống sáo trúc vàng óng đặt ngang khóe miệng
    const fluteGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.95, 8);
    const flute = new THREE.Mesh(fluteGeo, this.fluteMat);
    flute.position.set(0.12, 1.35, 0.38);
    flute.rotation.set(0.1, 0.2, Math.PI * 0.42);
    cuoi.add(flute);

    // Dây tua rua đỏ treo đầu sáo
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.25, 6), this.headbandMat);
    tassel.position.set(0.5, 1.25, 0.45);
    cuoi.add(tassel);

    // Bounding collider cho click
    const collider = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6), new THREE.MeshBasicMaterial({ visible: false }));
    collider.position.y = 0.8;
    collider.userData = { isCuoi: true, name: 'Chú Cuội' };
    cuoi.add(collider);

    this.group.add(cuoi);
    this.chuCuoi = cuoi;
    this.interactiveObjects.push(collider);
  }

  /**
   * Tạo Thỏ Ngọc cung trăng xinh xắn bên cối ngọc
   */
  createJadeRabbit() {
    const rabbit = new THREE.Group();
    rabbit.position.set(-3.2, 0.3, 2.8);
    rabbit.rotation.y = Math.PI * 0.2;
    rabbit.name = 'JadeRabbit';

    // Thân thỏ tròn mập mạp
    const bodyGeo = new THREE.SphereGeometry(0.65, 14, 14);
    bodyGeo.scale(0.9, 1.12, 0.95);
    const body = new THREE.Mesh(bodyGeo, this.rabbitFurMat);
    body.position.y = 0.65;
    body.castShadow = true;
    rabbit.add(body);

    // Đầu thỏ
    const headGeo = new THREE.SphereGeometry(0.48, 14, 14);
    const head = new THREE.Mesh(headGeo, this.rabbitFurMat);
    head.position.set(0, 1.45, 0.18);
    rabbit.add(head);

    // Mắt to đen láy
    const eyeGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.16, 1.55, 0.56);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.16, 1.55, 0.56);
    rabbit.add(eyeL, eyeR);

    // Má hồng phấn
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xffa8ba, transparent: true, opacity: 0.6 });
    const cheekL = new THREE.Mesh(new THREE.CircleGeometry(0.07, 8), cheekMat);
    cheekL.position.set(-0.25, 1.42, 0.58);
    const cheekR = new THREE.Mesh(new THREE.CircleGeometry(0.07, 8), cheekMat);
    cheekR.position.set(0.25, 1.42, 0.58);
    rabbit.add(cheekL, cheekR);

    // Mũi hồng
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), this.rabbitPinkMat);
    nose.position.set(0, 1.48, 0.64);
    rabbit.add(nose);

    // Đôi tai dài thanh thoát
    const earGeo = new THREE.CylinderGeometry(0.06, 0.12, 0.95, 8);
    earGeo.scale(0.5, 1, 1.2);

    const leftEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    leftEar.position.set(-0.16, 2.2, 0.1);
    leftEar.rotation.set(-0.1, 0, -0.16);

    const rightEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    rightEar.position.set(0.16, 2.2, 0.1);
    rightEar.rotation.set(-0.1, 0, 0.16);

    rabbit.add(leftEar, rightEar);

    // Đuôi bông xù
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), this.rabbitFurMat);
    tail.position.set(0, 0.4, -0.65);
    rabbit.add(tail);

    // Vòng ngọc cổ thỏ (dây đỏ đính ngọc bích)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 6, 16), this.headbandMat);
    collar.position.set(0, 1.15, 0.12);
    collar.rotation.x = Math.PI * 0.5;
    rabbit.add(collar);

    // Cối ngọc cẩm thạch trước mặt
    const mortar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.5, 14), this.jadeMat);
    mortar.position.set(0.1, 0.25, 0.95);
    rabbit.add(mortar);

    // Chày ngọc
    const pestle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.65, 8), this.fluteMat);
    pestle.position.set(0.1, 0.6, 0.95);
    pestle.rotation.z = 0.22;
    rabbit.add(pestle);

    // Collider cho click
    const collider = new THREE.Mesh(new THREE.SphereGeometry(1.1, 6, 6), new THREE.MeshBasicMaterial({ visible: false }));
    collider.position.y = 0.8;
    collider.userData = { isRabbit: true, name: 'Thỏ Ngọc' };
    rabbit.add(collider);

    this.group.add(rabbit);
    this.jadeRabbit = rabbit;
    this.rabbitEars = [leftEar, rightEar];
    this.interactiveObjects.push(collider);
  }

  /**
   * Tạo Mâm Bánh Trung Thu Vàng Óng & Tách Trà Thơm bên gốc cây
   * Đúng theo câu chúc: "Chúc bạn có bánh ngon, trà thơm, người thân bên cạnh..."
   */
  createTeaAndMooncakeSet() {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-0.2, 0.2, 2.5);

    // Bàn trà gỗ mộc tròn thấp
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 16), this.woodTableMat);
    tableTop.position.y = 0.35;
    tableGroup.add(tableTop);

    const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.35, 8), this.woodTableMat);
    tableLeg.position.y = 0.18;
    tableGroup.add(tableLeg);

    // Đĩa sứ trắng ngọc
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.04, 16), this.plateMat);
    plate.position.set(-0.15, 0.42, 0);
    tableGroup.add(plate);

    // BÁNH TRUNG THU NƯỚNG VÀNG ÓNG (Traditional Baked Mooncake)
    const mooncake = new THREE.Group();
    mooncake.position.set(-0.15, 0.46, 0);
    mooncake.scale.setScalar(0.7);

    // Vỏ bánh tròn có khía múi hoa văn
    const cakeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.32, 16);
    const cake = new THREE.Mesh(cakeGeo, this.mooncakeCrustMat);
    mooncake.add(cake);

    // Họa tiết hoa văn nổi trên mặt bánh
    const stampGeo = new THREE.TorusGeometry(0.25, 0.04, 6, 12);
    stampGeo.rotateX(Math.PI * 0.5);
    const stamp = new THREE.Mesh(stampGeo, this.mooncakeCrustMat);
    stamp.position.y = 0.17;
    mooncake.add(stamp);

    tableGroup.add(mooncake);

    // Ấm trà & Tách trà thơm
    const potGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const teapot = new THREE.Mesh(potGeo, this.jadeMat);
    teapot.position.set(0.42, 0.52, -0.15);
    tableGroup.add(teapot);

    const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.1, 8), this.plateMat);
    cup1.position.set(0.38, 0.44, 0.22);
    const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.1, 8), this.plateMat);
    cup2.position.set(0.58, 0.44, 0.1);
    tableGroup.add(cup1, cup2);

    this.group.add(tableGroup);
  }

  /**
   * Tạo mô hình một chú thỏ trắng chibi đáng yêu với tai ve vẩy, mắt sáng, má hồng
   */
  buildCuteRabbitModel(scale = 0.55) {
    const rabbit = new THREE.Group();
    rabbit.scale.setScalar(scale);

    // 1. Thân thỏ tròn xoe mập mạp
    const bodyGeo = new THREE.SphereGeometry(0.55, 12, 12);
    bodyGeo.scale(0.85, 1.05, 0.9);
    const body = new THREE.Mesh(bodyGeo, this.rabbitFurMat);
    body.position.y = 0.55;
    rabbit.add(body);

    // 2. Đầu thỏ tròn xinh
    const headGeo = new THREE.SphereGeometry(0.42, 12, 12);
    const head = new THREE.Mesh(headGeo, this.rabbitFurMat);
    head.position.set(0, 1.25, 0.15);
    rabbit.add(head);

    // 3. Đôi mắt to tròn long lanh
    const eyeGeo = new THREE.SphereGeometry(0.055, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.14, 1.35, 0.48);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.14, 1.35, 0.48);
    rabbit.add(eyeL, eyeR);

    // 4. Má hồng phấn phúng phính
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xffa8ba, transparent: true, opacity: 0.65 });
    const cheekL = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), cheekMat);
    cheekL.position.set(-0.22, 1.25, 0.5);
    const cheekR = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), cheekMat);
    cheekR.position.set(0.22, 1.25, 0.5);
    rabbit.add(cheekL, cheekR);

    // 5. Mũi hồng nhỏ xinh
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), this.rabbitPinkMat);
    nose.position.set(0, 1.3, 0.54);
    rabbit.add(nose);

    // 6. Đôi tai dài thanh thoát
    const earGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.85, 8);
    earGeo.scale(0.4, 1, 1.1);

    const leftEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    leftEar.position.set(-0.14, 1.9, 0.08);
    leftEar.rotation.set(-0.1, 0, -0.15);

    const rightEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    rightEar.position.set(0.14, 1.9, 0.08);
    rightEar.rotation.set(-0.1, 0, 0.15);
    rabbit.add(leftEar, rightEar);

    // 7. Đuôi tròn bông xù
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), this.rabbitFurMat);
    tail.position.set(0, 0.4, -0.55);
    rabbit.add(tail);

    // 8. Bàn chân nhỏ xinh
    const footGeo = new THREE.SphereGeometry(0.12, 6, 6);
    footGeo.scale(0.8, 0.6, 1.4);
    const footL = new THREE.Mesh(footGeo, this.rabbitFurMat);
    footL.position.set(-0.25, 0.1, 0.1);
    const footR = new THREE.Mesh(footGeo, this.rabbitFurMat);
    footR.position.set(0.25, 0.1, 0.1);
    rabbit.add(footL, footR);

    // Collider cho click tương tác
    const collider = new THREE.Mesh(new THREE.SphereGeometry(0.9, 4, 4), new THREE.MeshBasicMaterial({ visible: false }));
    collider.position.y = 0.8;
    collider.userData = { isRabbit: true, name: 'Thỏ Con Hoạt Bát' };
    rabbit.add(collider);
    this.interactiveObjects.push(collider);

    return { group: rabbit, ears: [leftEar, rightEar], body, head };
  }

  /**
   * Tạo đàn thỏ nhảy liên tục xung quanh gốc cây hoa anh đào
   */
  createHoppingRabbits() {
    this.hoppingRabbits = [];

    // Danh sách 5 chú thỏ với các bán kính, tốc độ và nhịp nhảy khác nhau
    const rabbitConfigs = [
      { radius: 4.8, speed: 0.65, hopFreq: 7.2, hopHeight: 0.6, scale: 0.58, baseAngle: 0.3, baseY: 0.15 },
      { radius: 6.2, speed: 0.52, hopFreq: 6.4, hopHeight: 0.55, scale: 0.52, baseAngle: 1.6, baseY: 0.2 },
      { radius: 7.6, speed: -0.58, hopFreq: 6.8, hopHeight: 0.65, scale: 0.55, baseAngle: 3.1, baseY: 0.18 }, // Chạy ngược chiều tạo sự sống động!
      { radius: 5.6, speed: 0.72, hopFreq: 7.8, hopHeight: 0.58, scale: 0.48, baseAngle: 4.5, baseY: 0.22 },
      { radius: 8.8, speed: 0.44, hopFreq: 5.8, hopHeight: 0.7, scale: 0.62, baseAngle: 5.6, baseY: 0.15 }
    ];

    rabbitConfigs.forEach((cfg, idx) => {
      const model = this.buildCuteRabbitModel(cfg.scale);
      this.group.add(model.group);

      this.hoppingRabbits.push({
        group: model.group,
        ears: model.ears,
        body: model.body,
        radius: cfg.radius,
        speed: cfg.speed,
        hopFreq: cfg.hopFreq,
        hopHeight: cfg.hopHeight,
        scale: cfg.scale,
        angle: cfg.baseAngle,
        baseY: cfg.baseY,
        offset: idx * 1.3
      });
    });
  }

  triggerHop() {
    if (!this.jadeRabbit) return;
    const startY = this.jadeRabbit.position.y;
    let progress = 0;
    const hop = () => {
      progress += 0.08;
      if (progress <= Math.PI) {
        this.jadeRabbit.position.y = startY + Math.sin(progress) * 0.7;
        requestAnimationFrame(hop);
      } else {
        this.jadeRabbit.position.y = startY;
      }
    };
    hop();
  }

  update(time) {
    // Chú Cuội đung đưa đầu êm ái theo nhịp điệu tiếng sáo
    if (this.cuoiHead) {
      this.cuoiHead.rotation.z = Math.sin(time * 1.6) * 0.06;
      this.cuoiHead.rotation.x = Math.sin(time * 1.2) * 0.04;
    }

    // Thỏ Ngọc thở nhẹ và tai khẽ cử động
    if (this.jadeRabbit) {
      const breath = Math.sin(time * 2.8) * 0.015;
      this.jadeRabbit.scale.set(1 + breath, 1 - breath * 0.5, 1 + breath);
      if (this.rabbitEars) {
        const twitch = Math.sin(time * 3.5) * 0.04;
        this.rabbitEars[0].rotation.z = -0.16 + twitch;
        this.rabbitEars[1].rotation.z = 0.16 - twitch;
      }
    }

    // Đàn thỏ nhảy nhót liên tục xung quanh cây hoa anh đào
    if (this.hoppingRabbits) {
      for (let i = 0; i < this.hoppingRabbits.length; i++) {
        const r = this.hoppingRabbits[i];
        r.angle += r.speed * 0.015;

        // Bán kính có độ dao động nhẹ tự nhiên
        const curRadius = r.radius + Math.sin(time * 0.4 + r.offset) * 0.25;
        r.group.position.x = Math.cos(r.angle) * curRadius;
        r.group.position.z = Math.sin(r.angle) * curRadius;

        // Nhịp nhảy tưng tưng liên tục (Hop bounce)
        const hopCycle = time * r.hopFreq + r.offset;
        const hopVal = Math.abs(Math.sin(hopCycle));
        r.group.position.y = r.baseY + hopVal * r.hopHeight;

        // Thỏ quay mặt theo hướng nhảy
        const forwardAngle = r.speed > 0 ? r.angle + Math.PI / 2 : r.angle - Math.PI / 2;
        r.group.rotation.y = -forwardAngle + Math.PI / 2;

        // Nghiêng người khi bật nhảy (Pitch tilt)
        r.group.rotation.x = Math.cos(hopCycle) * 0.22 * (r.speed > 0 ? 1 : -1);

        // Hiệu ứng nhún mình (Squash and stretch)
        const squash = Math.max(0, 0.16 - hopVal * 0.22);
        r.group.scale.set(
          r.scale * (1 + squash * 0.5),
          r.scale * (1 - squash),
          r.scale * (1 + squash * 0.5)
        );

        // Đôi tai ve vẩy vui tươi khi nhảy
        const twitch = Math.sin(time * 8 + r.offset) * 0.12;
        r.ears[0].rotation.z = -0.15 + twitch;
        r.ears[1].rotation.z = 0.15 - twitch;
      }
    }
  }
}
