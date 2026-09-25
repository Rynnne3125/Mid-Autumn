import * as THREE from 'three';

/**
 * Quản lý lồng đèn ước nguyện với ÁNH LỬA RÕ NÉT BÊN TRONG & TỎA SÁNG RỰC RỠ:
 * - Thân đèn giấy lụa mờ trong suốt nhìn thấy rõ ngọn lửa bập bùng bên trong
 * - Hào quang ánh sáng tỏa ra giữa màn đêm tối (Radial Glow Aura)
 * - Nằm xa cây và rải đều thoáng đãng trong không gian mở rộng
 * - Tối ưu 60 FPS mượt mà tuyệt đối (dùng Bounding Collider siêu nhẹ cho click)
 */
export class FloatingLanternsManager {
  constructor(scene, onSelectWishCallback) {
    this.scene = scene;
    this.onSelectWishCallback = onSelectWishCallback;
    this.group = new THREE.Group();
    this.lanternList = [];
    this.interactiveLanterns = [];
    this.skyLanterns = [];

    this.initWishesData();
    this.createMaterials();
    this.spawnSpacedLanterns();

    this.scene.add(this.group);
  }

  initWishesData() {
    this.wishes = [
      { id: 1, symbol: '福', symbolMeaning: 'Phúc', title: 'Đoàn Viên Sum Vầy', category: 'Gia Đình', content: 'Ánh đèn bập bùng soi rọi đêm hội. Nguyện cho gia đình bạn muôn đời gắn kết, dù đi xa vạn dặm vẫn luôn có một mái nhà ấm êm chờ đón ngày trở về.' },
      { id: 2, symbol: '安', symbolMeaning: 'An', title: 'Bình An Như Ý', category: 'Tâm Hồn', content: 'Chúc tâm hồn bạn luôn an yên như mặt hồ đêm tĩnh lặng. Mọi âu lo phiền muộn cuốn theo gió mây, mỗi ngày đều là một ngày thanh thản, tự tại.' },
      { id: 3, symbol: '愿', symbolMeaning: 'Nguyện', title: 'Tâm Nguyện Thành Hiện Thực', category: 'Ước Mơ', content: 'Ngọn lửa ước nguyện thắp sáng niềm tin giữa màn đêm. Chúc mọi ước mơ bạn ấp ủ đều đơm hoa kết trái, tỏa sáng rực rỡ như muôn ánh sao trời.' },
      { id: 4, symbol: '禄', symbolMeaning: 'Lộc', title: 'Vạn Sự Cát Tường', category: 'Tài Lộc', content: 'Đèn lồng thắp sáng điềm lành đến muôn nhà. Chúc sự nghiệp của bạn hanh thông, công việc thuận buồm xuôi gió, gặt hái tài lộc dồi dào.' },
      { id: 5, symbol: '寿', symbolMeaning: 'Thọ', title: 'Sức Khỏe Trường Thọ', category: 'Sức Khỏe', content: 'Kính chúc đấng sinh thành thân tâm an lạc, bách niên giai lão, luôn là cội nguồn yêu thương vững chãi cho con cháu sum vầy.' },
      { id: 6, symbol: '喜', symbolMeaning: 'Hỷ', title: 'Tình Duyên Viên Mãn', category: 'Tình Yêu', content: 'Nguyện cho tình yêu của bạn luôn nồng nàn và bền chặt. Cùng người tri kỷ nắm tay đi qua năm tháng, trọn vẹn yêu thương như ánh lửa ấm áp.' },
      { id: 7, symbol: '和', symbolMeaning: 'Hòa', title: 'Gia Đạo Thuận Hòa', category: 'Hạnh Phúc', content: 'Tổ ấm hòa thuận là nguồn cội của mọi phúc lành. Chúc gia đình bạn luôn tràn ngập sự bao dung, ấm cúng và rộn rã tiếng cười.' },
      { id: 8, symbol: '智', symbolMeaning: 'Trí', title: 'Khai Sáng & Bền Bỉ', category: 'Học Vấn', content: 'Chúc ngọn lửa trí tuệ luôn soi sáng con đường học vấn của bạn. Kiên định trước thử thách để chinh phục những đỉnh cao mới.' },
      { id: 9, symbol: '友', symbolMeaning: 'Hữu', title: 'Tri Kỷ Đồng Hành', category: 'Tình Bạn', content: 'Cảm ơn những người bạn chân thành đã luôn kề vai sát cánh. Chúc tình bạn của chúng ta mãi trong sáng và ấm áp qua năm tháng.' },
      { id: 10, symbol: '康', symbolMeaning: 'Khang', title: 'Thân Khỏe Tâm An', category: 'Bình Yên', content: 'Chúc bạn luôn dồi dào sinh lực, có một thân thể khỏe mạnh và một tâm hồn an vui, nhẹ nhõm giữa cuộc đời.' },
      { id: 11, symbol: '乐', symbolMeaning: 'Lạc', title: 'Hạnh Phúc Giản Đơn', category: 'Niềm Vui', content: 'Chúc bạn tìm thấy niềm vui trong những điều bình dị nhất: một tách trà thơm, một chiếc bánh ngọt và ánh mắt trìu mến của người thân yêu.' },
      { id: 12, symbol: '泰', symbolMeaning: 'Thái', title: 'Quốc Thái Dân An', category: 'An Lành', content: 'Nguyện cầu ánh sáng ấm áp của ngàn ngọn đèn trời lan tỏa khắp nhân gian, mang no ấm, hòa bình và nụ cười rạng rỡ tới muôn nơi.' }
    ];
  }

  createMaterials() {
    this.bambooFrameMat = new THREE.MeshBasicMaterial({ color: 0x4a2810 });
    this.flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.flameOuterMat = new THREE.MeshBasicMaterial({ color: 0xff9e00 });

    // Texture tỏa sáng hình cầu (Radial Glow Aura)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 230, 150, 0.95)');
    grad.addColorStop(0.3, 'rgba(255, 160, 40, 0.55)');
    grad.addColorStop(0.7, 'rgba(255, 90, 0, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gCtx.fillStyle = grad;
    gCtx.fillRect(0, 0, 128, 128);
    this.glowAuraTexture = new THREE.CanvasTexture(glowCanvas);
  }

  /**
   * Tạo Texture giấy đèn trong mờ có chữ thư pháp
   */
  createLanternPaperTexture(symbol) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Nền giấy lụa mờ vàng kem nhẹ
    ctx.fillStyle = 'rgba(255, 245, 210, 0.85)';
    ctx.fillRect(0, 0, 256, 256);

    // Viền son đỏ
    ctx.strokeStyle = 'rgba(217, 4, 41, 0.7)';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 224, 224);

    // Chữ thư pháp
    ctx.font = 'bold 120px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#9d0208';
    ctx.fillText(symbol || '福', 128, 128);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Tạo chiếc đèn trời với NGỌN LỬA RÕ NÉT BÊN TRONG & HÀO QUANG TỎA SÁNG
   */
  createGlowingWishLantern(wishData, scale = 1.0) {
    const lantern = new THREE.Group();
    lantern.scale.setScalar(scale);

    // 1. Thân đèn giấy lụa trong mờ (Translucent Paper Body)
    const bodyGeo = new THREE.CylinderGeometry(0.78, 0.62, 1.55, 12, 1, false);
    const paperTex = this.createLanternPaperTexture(wishData.symbol);

    const paperMat = new THREE.MeshBasicMaterial({
      map: paperTex,
      transparent: true,
      opacity: 0.65, // Trong mờ nhìn thấy rõ lửa bên trong
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, paperMat);
    lantern.add(bodyMesh);

    // 2. Khung viền tre thanh mảnh
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.035, 6, 16), this.bambooFrameMat);
    topRim.rotation.x = Math.PI * 0.5;
    topRim.position.y = 0.77;

    const btmRim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 6, 16), this.bambooFrameMat);
    btmRim.rotation.x = Math.PI * 0.5;
    btmRim.position.y = -0.77;

    lantern.add(topRim, btmRim);

    // 3. NGỌN LỬA RÕ NÉT BÊN TRONG (Vivid Inner Flame)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, -0.15, 0);

    // Lõi ngọn lửa trắng sáng rực
    const flameCoreGeo = new THREE.SphereGeometry(0.18, 8, 8);
    flameCoreGeo.scale(0.8, 1.6, 0.8);
    const flameCore = new THREE.Mesh(flameCoreGeo, this.flameCoreMat);
    flameGroup.add(flameCore);

    // Vỏ ngọn lửa cam vàng rực rỡ
    const flameOuterGeo = new THREE.SphereGeometry(0.28, 8, 8);
    flameOuterGeo.scale(0.85, 1.7, 0.85);
    const flameOuter = new THREE.Mesh(flameOuterGeo, this.flameOuterMat);
    flameGroup.add(flameOuter);

    lantern.add(flameGroup);

    // 4. HÀO QUANG ÁNH SÁNG TỎA RA GIỮA MÀN ĐÊM (Radiating Glow Aura)
    const spriteMat = new THREE.SpriteMaterial({
      map: this.glowAuraTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowSprite = new THREE.Sprite(spriteMat);
    glowSprite.scale.set(4.5, 4.5, 1);
    lantern.add(glowSprite);

    // 5. Tua rua lụa đỏ dưới đáy
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.06, 0.85, 6);
    const tasselMat = new THREE.MeshBasicMaterial({ color: 0xd90429 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.y = -1.35;
    lantern.add(tassel);

    // 6. Bounding Collider siêu nhẹ cho click (Chỉ 1 khối cầu ẩn, raycast siêu nhanh 0 lag)
    const colliderGeo = new THREE.SphereGeometry(1.4, 4, 4);
    const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
    const collider = new THREE.Mesh(colliderGeo, colliderMat);
    collider.userData = { wish: wishData, parentLantern: lantern };
    lantern.add(collider);

    lantern.userData = {
      wish: wishData,
      flameGroup,
      glowSprite
    };

    return { lantern, collider };
  }

  /**
   * Sinh các lồng đèn NẰM XA CÂY VÀ CÁCH NHAU THOÁNG ĐÃNG
   */
  spawnSpacedLanterns() {
    const count = 16;

    for (let i = 0; i < count; i++) {
      const wishData = this.wishes[i % this.wishes.length];
      const { lantern, collider } = this.createGlowingWishLantern(wishData, 0.95);

      // Bán kính cách xa cây (từ 10 đến 24 đơn vị)
      const radius = 10.5 + (i % 4) * 4.2;
      const baseAngle = (i / count) * Math.PI * 2;
      // Cao độ thoáng đãng trong không trung
      const baseY = 3.5 + (i % 5) * 3.0;

      lantern.position.set(Math.cos(baseAngle) * radius, baseY, Math.sin(baseAngle) * radius);

      this.group.add(lantern);
      this.interactiveLanterns.push(collider); // Chỉ đưa collider vào danh sách click

      this.lanternList.push({
        group: lantern,
        flameGroup: lantern.userData.flameGroup,
        glowSprite: lantern.userData.glowSprite,
        radius,
        angle: baseAngle,
        baseY,
        orbitSpeed: (0.05 + (i % 3) * 0.025) * (i % 2 === 0 ? 1 : -0.9) * 0.35,
        bobSpeed: 0.9 + Math.random() * 0.6,
        bobAmp: 0.3 + Math.random() * 0.2,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * Thả đèn từ tay cô bé bay lên
   */
  spawnSkyLanternFromPosition(startPos, wishText = '') {
    const customWish = {
      id: Date.now(),
      symbol: '愿',
      symbolMeaning: 'Nguyện',
      title: 'Tâm Nguyện Thả Lên Trời',
      category: 'Ước Nguyện',
      content: wishText || 'Cầu chúc bình an, hạnh phúc và vạn sự cát tường!'
    };

    const { lantern, collider } = this.createGlowingWishLantern(customWish, 0.85);
    lantern.position.copy(startPos);

    this.group.add(lantern);
    this.interactiveLanterns.push(collider);

    this.skyLanterns.push({
      group: lantern,
      collider,
      flameGroup: lantern.userData.flameGroup,
      speedY: 0.045 + Math.random() * 0.02,
      driftX: (Math.random() - 0.5) * 0.01,
      driftZ: (Math.random() - 0.5) * 0.01,
      rotSpeed: 0.005,
      swayOffset: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 1000
    });
  }

  update(time) {
    // 1. Quỹ đạo bay lượn thoáng đãng & hoạt ảnh ánh lửa bập bùng
    for (let i = 0; i < this.lanternList.length; i++) {
      const item = this.lanternList[i];
      item.angle += item.orbitSpeed * 0.015;

      item.group.position.x = Math.cos(item.angle) * item.radius;
      item.group.position.z = Math.sin(item.angle) * item.radius;
      item.group.position.y = item.baseY + Math.sin(time * item.bobSpeed + item.offset) * item.bobAmp;

      // Hướng lồng đèn tự nhiên
      item.group.rotation.y = -item.angle + Math.PI / 2;
      item.group.rotation.z = Math.sin(time * 2 + item.offset) * 0.05;

      // Ánh lửa bập bùng chân thực bên trong
      if (item.flameGroup) {
        const flicker = 1 + Math.sin(time * 8 + item.offset) * 0.15 + (Math.random() - 0.5) * 0.08;
        item.flameGroup.scale.set(flicker, flicker * 1.1, flicker);
      }

      // Hào quang tỏa sáng nhấp nhô nhẹ
      if (item.glowSprite) {
        const glowPulse = 4.2 + Math.sin(time * 4 + item.offset) * 0.5;
        item.glowSprite.scale.set(glowPulse, glowPulse, 1);
      }
    }

    // 2. Chuyển động bay lên của đèn trời được thả
    for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
      const sl = this.skyLanterns[i];
      sl.life++;
      sl.group.position.y += sl.speedY;
      sl.group.position.x += sl.driftX;
      sl.group.position.z += sl.driftZ;
      sl.group.rotation.y += sl.rotSpeed;

      if (sl.group.position.y > 65 || sl.life > sl.maxLife) {
        this.group.remove(sl.group);
        const idx = this.interactiveLanterns.indexOf(sl.collider);
        if (idx > -1) this.interactiveLanterns.splice(idx, 1);
        this.skyLanterns.splice(i, 1);
      }
    }
  }
}
