import * as THREE from 'three';

/**
 * Quản lý đàn lồng đèn bay lượn lơ lửng xung quanh cây hoa anh đào:
 * - Hơn 18 lồng đèn bay với nhiều hình dáng (Đèn Ông Sao, Đèn Lồng Tròn, Đèn Hoa Sen)
 * - Mỗi lồng đèn mang theo một lời chúc Trung Thu sâu sắc, ý nghĩa
 * - Click vào bất kỳ lồng đèn nào sẽ mở ra lời chúc đó
 * - Hỗ trợ đèn trời bay lên từ tay cô bé
 */
export class FloatingLanternsManager {
  constructor(scene, lightsManager, onSelectWishCallback) {
    this.scene = scene;
    this.lightsManager = lightsManager;
    this.onSelectWishCallback = onSelectWishCallback;
    this.group = new THREE.Group();
    this.lanternList = [];
    this.interactiveLanterns = [];
    this.skyLanterns = [];

    this.createMaterials();
    this.initWishesData();
    this.spawnOrbitingLanterns();

    this.scene.add(this.group);
  }

  createMaterials() {
    this.starRedMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      emissive: 0xd90429,
      emissiveIntensity: 0.6,
      roughness: 0.35
    });

    this.starGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xff9e00,
      emissiveIntensity: 0.6,
      roughness: 0.35
    });

    this.lanternRedMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      emissive: 0x9d0208,
      emissiveIntensity: 0.75,
      roughness: 0.4
    });

    this.lanternAmberMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xfb8500,
      emissiveIntensity: 0.8,
      roughness: 0.4
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.25
    });

    this.flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  }

  initWishesData() {
    this.wishes = [
      {
        id: 1,
        title: 'Đoàn Viên Sum Vầy',
        category: 'Gia Đình',
        content: 'Ánh trăng rằm sáng soi muôn nẻo. Nguyện cho gia đình bạn muôn đời gắn kết, dù đi xa vạn dặm vẫn luôn có một mái nhà ấm êm, tràn ngập tiếng cười chờ đón ngày trở về.'
      },
      {
        id: 2,
        title: 'Bình An Như Ý',
        category: 'Tâm Hồn',
        content: 'Chúc tâm hồn bạn luôn thanh tịnh như mặt hồ thu đêm rằm. Mọi âu lo phiền muộn cuốn theo gió mây, mỗi sớm mai thức dậy đều là một ngày an nhiên, tự tại.'
      },
      {
        id: 3,
        title: 'Thành Công Rực Rỡ',
        category: 'Sự Nghiệp',
        content: 'Chúc sự nghiệp và con đường phía trước của bạn sáng rực rỡ như vầng trăng tháng Tám. Vững vàng trước sóng gió và gặt hái những trái ngọt rạng danh.'
      },
      {
        id: 4,
        title: 'Tình Duyên Viên Mãn',
        category: 'Tình Yêu',
        content: 'Nguyện cho tình yêu của bạn luôn ngọt ngào và đậm đà như hương bánh nướng đêm hội. Cùng người thương nắm tay ngắm trọn vẹn từng mùa trăng hạnh phúc.'
      },
      {
        id: 5,
        title: 'Sức Khỏe Dồi Dào',
        category: 'Trường Thọ',
        content: 'Kính chúc ông bà cha mẹ trường thọ bách niên, thân tâm an lạc, phúc lộc dồi dào, mãi là bóng cây cổ thụ chở che cho con cháu bình yên.'
      },
      {
        id: 6,
        title: 'Tuổi Thơ Trong Trẻo',
        category: 'Thiếu Nhi',
        content: 'Chúc các em nhỏ luôn giữ trọn nụ cười hồn nhiên, rước đèn phá cỗ rộn vang tiếng cười và nuôi dưỡng những ước mơ bay cao tới tận cung trăng.'
      },
      {
        id: 7,
        title: 'Tri Kỷ Bền Lâu',
        category: 'Tình Bạn',
        content: 'Cảm ơn bạn vì đã luôn đồng hành qua những thăng trầm cuộc sống. Chúc tình bạn của chúng ta mãi bền chặt, cùng sẻ chia từng tách trà thơm và niềm vui giản dị.'
      },
      {
        id: 8,
        title: 'Tâm Nguyện Đơm Hoa',
        category: 'Ước Mơ',
        content: 'Mỗi ngọn nến trong đèn lồng thắp sáng một niềm tin. Chúc những ước mơ bạn đang ấp ủ sớm trở thành hiện thực, tỏa sáng rực rỡ giữa bầu trời ước vọng.'
      },
      {
        id: 9,
        title: 'Vạn Sự Cát Tường',
        category: 'Tài Lộc',
        content: 'Trăng tròn mang điềm lành tới muôn nhà. Chúc bạn vạn sự hanh thông, công việc thuận buồm xuôi gió, tài lộc dồi dào, phúc như đông hải.'
      },
      {
        id: 10,
        title: 'Hạnh Phúc Giản Đơn',
        category: 'Hạnh Phúc',
        content: 'Chúc bạn tìm thấy niềm vui trong từng khoảnh khắc bình dị nhất: một miếng bánh ngọt, một tách trà nóng và ánh mắt ấm áp của những người thân yêu.'
      },
      {
        id: 11,
        title: 'Nghị Lực Bất Tận',
        category: 'Khát Vọng',
        content: 'Dù cuộc sống có những ngày mây mù che khuất, hãy nhớ rằng sau cơn mưa trăng lại tròn và sáng. Chúc bạn luôn giữ vững niềm tin và nhiệt huyết tuổi trẻ.'
      },
      {
        id: 12,
        title: 'Bình Yên Muôn Nhà',
        category: 'An Lành',
        content: 'Nguyện cầu ánh sáng dịu mát của trăng thu lan tỏa khắp nhân gian, xua tan lạnh lẽo, mang no ấm, hòa bình và nụ cười rạng rỡ tới mọi miền đất nước.'
      }
    ];
  }

  /**
   * Tạo Đèn Ông Sao 5 cánh bay lơ lửng
   */
  createStarLanternMesh() {
    const lantern = new THREE.Group();
    const points = 5;
    const outerR = 0.9;
    const innerR = 0.38;
    const shape = new THREE.Shape();

    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.08,
      bevelThickness: 0.06
    });
    geo.center();

    const mesh = new THREE.Mesh(geo, this.starGoldMat);
    lantern.add(mesh);

    // Vành tre tròn
    const ringGeo = new THREE.TorusGeometry(0.78, 0.03, 6, 24);
    const ring = new THREE.Mesh(ringGeo, this.goldTrimMat);
    lantern.add(ring);

    // Ngọn lửa nhỏ giữa
    const flameGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const flame = new THREE.Mesh(flameGeo, this.flameMat);
    lantern.add(flame);

    // Tua rua
    const tasselGeo = new THREE.CylinderGeometry(0.025, 0.06, 0.6, 6);
    const tassel = new THREE.Mesh(tasselGeo, this.starRedMat);
    tassel.position.y = -1.1;
    lantern.add(tassel);

    return lantern;
  }

  /**
   * Tạo Lồng Đèn Tròn bay
   */
  createRoundLanternMesh(isAmber = false) {
    const lantern = new THREE.Group();
    const mat = isAmber ? this.lanternAmberMat : this.lanternRedMat;

    const bodyGeo = new THREE.SphereGeometry(0.65, 14, 10);
    bodyGeo.scale(1, 0.9, 1);
    const body = new THREE.Mesh(bodyGeo, mat);
    lantern.add(body);

    // Nắp vàng
    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 10);
    const topCap = new THREE.Mesh(capGeo, this.goldTrimMat);
    topCap.position.y = 0.58;
    const btmCap = new THREE.Mesh(capGeo, this.goldTrimMat);
    btmCap.position.y = -0.58;
    lantern.add(topCap, btmCap);

    // Tua rua
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.65, 6);
    const tassel = new THREE.Mesh(tasselGeo, this.goldTrimMat);
    tassel.position.y = -0.95;
    lantern.add(tassel);

    return lantern;
  }

  /**
   * Tạo Đèn Hoa Sen Hoàng Kim bay
   */
  createLotusLanternMesh() {
    const lantern = new THREE.Group();
    const petalGeo = new THREE.ConeGeometry(0.3, 0.7, 5);
    petalGeo.rotateX(0.35);

    // 6 cánh hoa xòe
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const petal = new THREE.Mesh(petalGeo, this.lanternAmberMat);
      petal.position.set(Math.cos(angle) * 0.35, 0, Math.sin(angle) * 0.35);
      petal.rotation.y = -angle;
      lantern.add(petal);
    }

    // Nhụy sen sáng rực
    const coreGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const core = new THREE.Mesh(coreGeo, this.flameMat);
    core.position.y = 0.15;
    lantern.add(core);

    return lantern;
  }

  /**
   * Sinh đàn lồng đèn bay lượn theo quỹ đạo xung quanh cây hoa anh đào
   */
  spawnOrbitingLanterns() {
    const totalLanterns = 18;

    for (let i = 0; i < totalLanterns; i++) {
      let mesh;
      const type = i % 3;
      if (type === 0) mesh = this.createStarLanternMesh();
      else if (type === 1) mesh = this.createRoundLanternMesh(i % 2 === 0);
      else mesh = this.createLotusLanternMesh();

      // Nguồn sáng ấm áp đi kèm lồng đèn
      const light = new THREE.PointLight(type === 1 ? 0xff4d00 : 0xffaa00, 1.2, 10, 1.6);
      light.position.set(0, 0, 0);
      mesh.add(light);
      this.lightsManager.registerFlickerLight(light, 1.2, 0.35);

      // Phân bố theo nhiều tầng cao độ và bán kính quanh cây anh đào
      const radius = 5.5 + (i % 5) * 2.2;
      const baseAngle = (i / totalLanterns) * Math.PI * 2;
      const baseY = 2.8 + (i % 6) * 1.8;

      mesh.position.set(Math.cos(baseAngle) * radius, baseY, Math.sin(baseAngle) * radius);

      // Gắn lời chúc ý nghĩa
      const wishData = this.wishes[i % this.wishes.length];
      mesh.userData = {
        wish: wishData,
        isClickableLantern: true
      };

      this.group.add(mesh);
      this.interactiveLanterns.push(mesh);

      this.lanternList.push({
        group: mesh,
        radius,
        angle: baseAngle,
        baseY,
        orbitSpeed: (0.08 + (i % 3) * 0.04) * (i % 2 === 0 ? 1 : -0.8) * 0.4,
        bobSpeed: 1.0 + Math.random() * 0.8,
        bobAmp: 0.25 + Math.random() * 0.2,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * Đèn trời phóng lên từ tay cô bé
   */
  spawnSkyLanternFromPosition(startPos, wishText = '') {
    const skyLantern = this.createRoundLanternMesh(true);
    skyLantern.position.copy(startPos);
    skyLantern.scale.setScalar(0.75);

    const light = new THREE.PointLight(0xffa200, 1.8, 12);
    skyLantern.add(light);

    const wishData = {
      title: 'Tâm Nguyện Đêm Rằm',
      category: 'Ước Nguyện',
      content: wishText || 'Cầu chúc gia đình luôn bình an, mạnh khỏe và sum vầy trọn vẹn!'
    };
    skyLantern.userData = { wish: wishData, isClickableLantern: true };

    this.group.add(skyLantern);
    this.interactiveLanterns.push(skyLantern);

    this.skyLanterns.push({
      group: skyLantern,
      speedY: 0.05 + Math.random() * 0.025,
      driftX: (Math.random() - 0.5) * 0.012,
      driftZ: (Math.random() - 0.5) * 0.012,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 1000
    });
  }

  update(time) {
    // 1. Quỹ đạo bay lượn và nhấp nhô của đàn lồng đèn quanh cây anh đào
    for (let i = 0; i < this.lanternList.length; i++) {
      const item = this.lanternList[i];
      item.angle += item.orbitSpeed * 0.015;

      item.group.position.x = Math.cos(item.angle) * item.radius;
      item.group.position.z = Math.sin(item.angle) * item.radius;
      item.group.position.y = item.baseY + Math.sin(time * item.bobSpeed + item.offset) * item.bobAmp;

      // Khẽ đung đưa theo hướng bay
      item.group.rotation.y = -item.angle + Math.PI / 2;
      item.group.rotation.z = Math.sin(time * 2 + item.offset) * 0.08;
    }

    // 2. Chuyển động bay lên cung trăng của đèn trời
    for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
      const sl = this.skyLanterns[i];
      sl.life++;
      sl.group.position.y += sl.speedY;
      sl.group.position.x += sl.driftX + Math.sin(time + sl.swayOffset) * 0.008;
      sl.group.position.z += sl.driftZ;
      sl.group.rotation.y += sl.rotSpeed;

      if (sl.group.position.y > 65 || sl.life > sl.maxLife) {
        this.group.remove(sl.group);
        const idx = this.interactiveLanterns.indexOf(sl.group);
        if (idx > -1) this.interactiveLanterns.splice(idx, 1);
        this.skyLanterns.splice(i, 1);
      }
    }
  }
}
