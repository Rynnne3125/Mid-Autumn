import * as THREE from 'three';

/**
 * Quản lý lồng đèn Trung Thu - Mẫu Đèn Trời / Khổng Minh Đăng (Chinese Wish Lantern):
 * - ĐÚNG 1 MẪU DUY NHẤT: Đèn giấy lụa vuông bo góc truyền thống có viết chữ điều ước (Thư pháp Phúc, An, Nguyện...)
 * - Bay lơ lửng xung quanh cây hoa anh đào
 * - Khi click vào sẽ mở lời chúc ý nghĩa tương ứng được viết trên chiếc đèn đó
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

    this.initWishesData();
    this.createMaterials();
    this.spawnWishLanterns();

    this.scene.add(this.group);
  }

  initWishesData() {
    this.wishes = [
      {
        id: 1,
        symbol: '福',
        symbolMeaning: 'Phúc',
        title: 'Đoàn Viên Sum Vầy',
        category: 'Gia Đình',
        content: 'Ánh đèn trời thắp sáng đêm rằm. Nguyện cho gia đình bạn muôn đời gắn kết, dù đi xa vạn dặm vẫn luôn có một mái nhà ấm êm, tràn ngập tiếng cười chờ đón ngày trở về.'
      },
      {
        id: 2,
        symbol: '安',
        symbolMeaning: 'An',
        title: 'Bình An Như Ý',
        category: 'Tâm Hồn',
        content: 'Chúc tâm hồn bạn luôn an yên như mặt nước hồ thu. Mọi âu lo phiền muộn gửi theo gió mây, mỗi ngày trôi qua đều là một ngày thanh thản, tự tại.'
      },
      {
        id: 3,
        symbol: '愿',
        symbolMeaning: 'Nguyện',
        title: 'Tâm Nguyện Thành Hiện Thực',
        category: 'Ước Mơ',
        content: 'Chiếc đèn mang theo tâm nguyện chân thành nhất của bạn bay lên trời cao. Chúc mọi ước mơ bạn ấp ủ đều đơm hoa kết trái, tỏa sáng rực rỡ như muôn ánh sao đêm.'
      },
      {
        id: 4,
        symbol: '禄',
        symbolMeaning: 'Lộc',
        title: 'Vạn Sự Cát Tường',
        category: 'Tài Lộc',
        content: 'Đèn lồng thắp sáng điềm lành đến muôn nhà. Chúc sự nghiệp của bạn hanh thông, tài lộc dồi dào, vững bước trên con đường công danh.'
      },
      {
        id: 5,
        symbol: '寿',
        symbolMeaning: 'Thọ',
        title: 'Sức Khỏe Trường Thọ',
        category: 'Sức Khỏe',
        content: 'Kính chúc đấng sinh thành thân tâm an lạc, bách niên giai lão, luôn là cội nguồn yêu thương vững chãi cho con cháu sum vầy.'
      },
      {
        id: 6,
        symbol: '喜',
        symbolMeaning: 'Hỷ',
        title: 'Tình Duyên Viên Mãn',
        category: 'Tình Yêu',
        content: 'Nguyện cho tình yêu của bạn ngọt ngào và bền chặt. Cùng người tri kỷ nắm tay đi qua năm tháng, trọn vẹn yêu thương như vầng trăng rằm.'
      },
      {
        id: 7,
        symbol: '和',
        symbolMeaning: 'Hòa',
        title: 'Gia Đạo Thuận Hòa',
        category: 'Hạnh Phúc',
        content: 'Một mái nhà hòa thuận là nguồn cội của mọi phúc lành. Chúc tổ ấm của bạn luôn tràn ngập sự bao dung, ấm cúng và tiếng cười rộn rã.'
      },
      {
        id: 8,
        symbol: '智',
        symbolMeaning: 'Trí',
        title: 'Khai Sáng & Bền Bỉ',
        category: 'Học Vấn',
        content: 'Chúc con đường học tập và nghiên cứu của bạn luôn được soi sáng. Kiên định trước thử thách, mở rộng tầm nhìn để vươn tới những chân trời mới.'
      },
      {
        id: 9,
        symbol: '友',
        symbolMeaning: 'Hữu',
        title: 'Tri Kỷ Đồng Hành',
        category: 'Tình Bạn',
        content: 'Cảm ơn những người bạn chân thành đã luôn kề vai sát cánh. Chúc tình bạn của chúng ta mãi trong sáng và bền lâu qua từng mùa trăng.'
      },
      {
        id: 10,
        symbol: '康',
        symbolMeaning: 'Khang',
        title: 'Thân Khỏe Tâm An',
        category: 'Bình Yên',
        content: 'Không có tài sản nào quý giá hơn sự khỏe mạnh và bình yên trong tâm trí. Chúc bạn luôn dồi dào sinh lực và nuôi dưỡng sự tĩnh tại mỗi ngày.'
      },
      {
        id: 11,
        symbol: '乐',
        symbolMeaning: 'Lạc',
        title: 'Hạnh Phúc Giản Đơn',
        category: 'Niềm Vui',
        content: 'Chúc bạn tìm thấy hạnh phúc trong những điều bình dị nhất: một tách trà thơm, một chiếc bánh ngọt và ánh mắt trìu mến của người thân yêu.'
      },
      {
        id: 12,
        symbol: '泰',
        symbolMeaning: 'Thái',
        title: 'Quốc Thái Dân An',
        category: 'An Lành',
        content: 'Nguyện cầu ánh sáng ấm áp của ngàn ngọn đèn trời lan tỏa khắp thế gian, xua tan lạnh lẽo, mang no ấm, hòa bình và nụ cười rạng rỡ tới muôn nơi.'
      }
    ];
  }

  /**
   * Tạo Texture giấy đèn trời với chữ thư pháp điều ước viết lên mặt lồng đèn
   */
  createWishLanternTexture(symbol, title) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nền giấy lụa màu kem vàng ấm áp
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#fff6cc');
    grad.addColorStop(0.5, '#ffe599');
    grad.addColorStop(1, '#ffd966');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Họa tiết khung viền cổ trang đỏ son
    ctx.strokeStyle = 'rgba(217, 4, 41, 0.7)';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 452, 452);

    ctx.strokeStyle = 'rgba(217, 4, 41, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 422, 422);

    // Chữ thư pháp lớn ở giữa mặt đèn (ví dụ: 福, 安, 愿, 禄...)
    ctx.font = 'bold 150px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b7094c';
    ctx.fillText(symbol || '愿', 256, 230);

    // Dòng chữ điều ước tiếng Việt tinh tế bên dưới
    ctx.font = 'bold 30px "Montserrat", sans-serif';
    ctx.fillStyle = '#9d0208';
    ctx.fillText(title || 'Ước Nguyện', 256, 360);

    return new THREE.CanvasTexture(canvas);
  }

  createMaterials() {
    this.bambooFrameMat = new THREE.MeshStandardMaterial({
      color: 0x6f4e37, // Khung nẹp tre nâu ấm
      roughness: 0.8
    });

    this.goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.8,
      roughness: 0.2
    });

    this.flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  }

  /**
   * Tạo ĐÚNG 1 MẪU ĐÈN TRỜI ƯỚC NGUYỆN (Chinese Sky/Wish Lantern)
   */
  createSingleWishLantern(wishData, scale = 1.0) {
    const lantern = new THREE.Group();
    lantern.scale.setScalar(scale);

    // 1. Thân đèn giấy lụa hình trụ vuông bo góc (Đèn Khổng Minh Đăng truyền thống)
    const bodyGeo = new THREE.CylinderGeometry(0.72, 0.58, 1.45, 12, 1, false);
    bodyGeo.scale(1, 1, 0.9); // Hơi dẹt mềm mại

    const lanternTexture = this.createWishLanternTexture(wishData.symbol, wishData.symbolMeaning);
    const paperMat = new THREE.MeshStandardMaterial({
      map: lanternTexture,
      emissive: 0xffa200,
      emissiveIntensity: 0.85,
      roughness: 0.4,
      transparent: true,
      opacity: 0.95
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, paperMat);
    bodyMesh.castShadow = true;
    lantern.add(bodyMesh);

    // 2. Khung nẹp tre trên và dưới
    const topRimGeo = new THREE.TorusGeometry(0.72, 0.04, 6, 16);
    topRimGeo.rotateX(Math.PI * 0.5);
    const topRim = new THREE.Mesh(topRimGeo, this.bambooFrameMat);
    topRim.position.y = 0.72;

    const btmRimGeo = new THREE.TorusGeometry(0.58, 0.04, 6, 16);
    btmRimGeo.rotateX(Math.PI * 0.5);
    const btmRim = new THREE.Mesh(btmRimGeo, this.bambooFrameMat);
    btmRim.position.y = -0.72;

    lantern.add(topRim, btmRim);

    // 3. Ngọn nến phát sáng bên trong đèn
    const flameGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const flame = new THREE.Mesh(flameGeo, this.flameMat);
    flame.position.y = -0.15;
    lantern.add(flame);

    // 4. Tua rua lụa đỏ may mắn thả dưới đáy đèn
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.06, 0.8, 6);
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.6 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.y = -1.25;
    lantern.add(tassel);

    // 5. Nguồn sáng ấm áp hắt ra từ bên trong đèn
    const light = new THREE.PointLight(0xff9900, 1.5, 11, 1.5);
    light.position.set(0, 0, 0);
    lantern.add(light);
    this.lightsManager.registerFlickerLight(light, 1.5, 0.4);

    // Dữ liệu tương tác
    lantern.userData = {
      wish: wishData,
      isClickableLantern: true,
      flame
    };

    return lantern;
  }

  /**
   * Sinh đàn lồng đèn ước nguyện bay lượn quanh cây hoa anh đào
   */
  spawnWishLanterns() {
    const count = 18;

    for (let i = 0; i < count; i++) {
      const wishData = this.wishes[i % this.wishes.length];
      const lantern = this.createSingleWishLantern(wishData, 0.95);

      const radius = 5.2 + (i % 5) * 2.3;
      const baseAngle = (i / count) * Math.PI * 2;
      const baseY = 3.0 + (i % 6) * 1.8;

      lantern.position.set(Math.cos(baseAngle) * radius, baseY, Math.sin(baseAngle) * radius);

      this.group.add(lantern);
      this.interactiveLanterns.push(lantern);

      this.lanternList.push({
        group: lantern,
        radius,
        angle: baseAngle,
        baseY,
        orbitSpeed: (0.07 + (i % 3) * 0.035) * (i % 2 === 0 ? 1 : -0.85) * 0.35,
        bobSpeed: 1.0 + Math.random() * 0.7,
        bobAmp: 0.25 + Math.random() * 0.2,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * Tạo chiếc đèn trời ước nguyện mới được thả từ tay cô bé
   */
  spawnSkyLanternFromPosition(startPos, wishText = '') {
    const customWish = {
      id: Date.now(),
      symbol: '愿',
      symbolMeaning: 'Nguyện',
      title: 'Tâm Nguyện Đêm Rằm',
      category: 'Ước Nguyện',
      content: wishText || 'Cầu chúc gia đình luôn bình an, mạnh khỏe và vạn sự viên mãn!'
    };

    const skyLantern = this.createSingleWishLantern(customWish, 0.85);
    skyLantern.position.copy(startPos);

    this.group.add(skyLantern);
    this.interactiveLanterns.push(skyLantern);

    this.skyLanterns.push({
      group: skyLantern,
      speedY: 0.05 + Math.random() * 0.025,
      driftX: (Math.random() - 0.5) * 0.012,
      driftZ: (Math.random() - 0.5) * 0.012,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      swayOffset: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 1000
    });
  }

  update(time) {
    // 1. Quỹ đạo bay lượn và nhấp nhô của đàn lồng đèn ước nguyện
    for (let i = 0; i < this.lanternList.length; i++) {
      const item = this.lanternList[i];
      item.angle += item.orbitSpeed * 0.015;

      item.group.position.x = Math.cos(item.angle) * item.radius;
      item.group.position.z = Math.sin(item.angle) * item.radius;
      item.group.position.y = item.baseY + Math.sin(time * item.bobSpeed + item.offset) * item.bobAmp;

      item.group.rotation.y = -item.angle + Math.PI / 2;
      item.group.rotation.z = Math.sin(time * 2 + item.offset) * 0.06;
    }

    // 2. Chuyển động bay lên bầu trời sao của các đèn trời được thả
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
