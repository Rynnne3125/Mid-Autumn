import * as THREE from 'three';

/**
 * Quản lý đàn lồng đèn ước nguyện với 15 lời chúc Trung Thu sâu sắc chính xác theo yêu cầu:
 * - Thân đèn giấy lụa trong mờ nhìn thấy ngọn lửa bập bùng chân thực bên trong
 * - Hào quang tỏa sáng rực rỡ trong đêm tối (Radial Glow Aura)
 * - Mỗi chiếc đèn mang đúng 1 trong 15 câu chúc ý nghĩa do bạn chỉ định
 * - Tối ưu 60 FPS mượt mà tuyệt đối
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
    this.spawnFifteenLanterns();

    this.scene.add(this.group);
  }

  initWishesData() {
    this.wishes = [
      {
        id: 1,
        symbol: '福',
        symbolMeaning: 'Phúc Ngọt Ngào',
        title: 'Tròn Đầy & Ngọt Ngào',
        content: 'Chúc bạn một mùa Trung Thu tròn đầy niềm vui, ngọt ngào như bánh và ấm áp như ánh trăng.'
      },
      {
        id: 2,
        symbol: '明',
        symbolMeaning: 'Trăng Sáng',
        title: 'Tốt Đẹp Sớm Đến',
        content: 'Trăng rằm đã sáng, mong những điều tốt đẹp cũng sớm đến với bạn. Trung Thu vui vẻ nhé!'
      },
      {
        id: 3,
        symbol: '乐',
        symbolMeaning: 'An Vui',
        title: 'Bánh Ngon & Trà Thơm',
        content: 'Chúc bạn có bánh ngon, trà thơm, người thân bên cạnh và thật nhiều tiếng cười.'
      },
      {
        id: 4,
        symbol: '安',
        symbolMeaning: 'Bình Yên',
        title: 'Bình Yên Nghỉ Ngơi',
        content: 'Dù bận rộn đến đâu, mong bạn vẫn có một đêm Trung Thu bình yên để nghỉ ngơi và tận hưởng.'
      },
      {
        id: 5,
        symbol: '辉',
        symbolMeaning: 'Rạng Rỡ',
        title: 'Rạng Rỡ & May Mắn',
        content: 'Chúc bạn luôn rạng rỡ như trăng, gặp nhiều may mắn và làm được những điều mình mong muốn.'
      },
      {
        id: 6,
        symbol: '伴',
        symbolMeaning: 'Tri Kỷ',
        title: 'Đồng Hành & Sẻ Chia',
        content: 'Cảm ơn bạn vì đã luôn ở bên và sẻ chia. Chúc bạn một mùa trăng thật vui và đáng nhớ!'
      },
      {
        id: 7,
        symbol: '欢',
        symbolMeaning: 'Vui Hết Cỡ',
        title: 'Kỷ Niệm Đẹp Đêm Rằm',
        content: 'Chúc bạn Trung Thu vui hết cỡ, ăn bánh thật ngon và có thêm nhiều kỷ niệm đẹp!'
      },
      {
        id: 8,
        symbol: '康',
        symbolMeaning: 'Khang Kiện',
        title: 'Ấm Áp & Khỏe Mạnh',
        content: 'Gửi bạn lời chúc Trung Thu ấm áp nhất. Mong bạn luôn khỏe mạnh, hạnh phúc và thuận lợi trong mọi việc.'
      },
      {
        id: 9,
        symbol: '爱',
        symbolMeaning: 'Yêu Thương',
        title: 'Bên Người Yêu Thương',
        content: 'Chúc bạn có một đêm trăng thật đẹp bên những người yêu thương.'
      },
      {
        id: 10,
        symbol: '柔',
        symbolMeaning: 'Dịu Dàng',
        title: 'Sáng Trong & Dịu Êm',
        content: 'Mong những ngày sắp tới của bạn cũng sáng và dịu dàng như ánh trăng đêm nay. Trung Thu vui vẻ nhé!'
      },
      {
        id: 11,
        symbol: '笑',
        symbolMeaning: 'Nụ Cười',
        title: 'Rạng Rỡ Nụ Cười',
        content: 'Chúc bạn một mùa Trung Thu thật vui, nhận nhiều quà, ăn nhiều bánh và luôn giữ nụ cười trên môi.'
      },
      {
        id: 12,
        symbol: '志',
        symbolMeaning: 'Tự Tin',
        title: 'Tự Tin Theo Đuổi Đam Mê',
        content: 'Mong bạn luôn tự tin theo đuổi điều mình thích. Chúc bạn Trung Thu vui vẻ!'
      },
      {
        id: 13,
        symbol: '忆',
        symbolMeaning: 'Kỷ Niệm',
        title: 'Những Kỷ Niệm Đáng Quý',
        content: 'Cảm ơn bạn vì đã mang đến nhiều tiếng cười và những kỷ niệm đáng quý. Chúc bạn một đêm Trung Thu thật vui!'
      },
      {
        id: 14,
        symbol: '诚',
        symbolMeaning: 'Vẹn Nguyên',
        title: 'Tình Bạn Vẹn Nguyên',
        content: 'Trăng có thể tròn rồi khuyết, nhưng mong tình bạn của chúng ta luôn vẹn nguyên. Trung Thu an lành nhé!'
      },
      {
        id: 15,
        symbol: '团',
        symbolMeaning: 'Đoàn Viên',
        title: 'Mùa Trăng Đoàn Viên',
        content: 'Chúc bạn một mùa Trung Thu đoàn viên, có thời gian bên người thân, có chuyện vui để kể và có thật nhiều kỷ niệm đẹp.'
      }
    ];
  }

  createMaterials() {
    this.bambooFrameMat = new THREE.MeshBasicMaterial({ color: 0x4a2810 });
    this.flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.flameOuterMat = new THREE.MeshBasicMaterial({ color: 0xff9e00 });

    // Texture quầng sáng tỏa tròn ra màn đêm tối
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

  createLanternPaperTexture(symbol) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Nền giấy lụa mờ
    ctx.fillStyle = 'rgba(255, 246, 215, 0.88)';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(217, 4, 41, 0.7)';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 224, 224);

    ctx.font = 'bold 120px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#9d0208';
    ctx.fillText(symbol || '福', 128, 128);

    return new THREE.CanvasTexture(canvas);
  }

  createGlowingWishLantern(wishData, scale = 1.0) {
    const lantern = new THREE.Group();
    lantern.scale.setScalar(scale);

    // 1. Thân đèn giấy lụa trong mờ nhìn thấy rõ lửa bên trong
    const bodyGeo = new THREE.CylinderGeometry(0.78, 0.62, 1.55, 12, 1, false);
    const paperTex = this.createLanternPaperTexture(wishData.symbol);

    const paperMat = new THREE.MeshBasicMaterial({
      map: paperTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, paperMat);
    lantern.add(bodyMesh);

    // 2. Khung viền tre
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.035, 6, 16), this.bambooFrameMat);
    topRim.rotation.x = Math.PI * 0.5;
    topRim.position.y = 0.77;

    const btmRim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 6, 16), this.bambooFrameMat);
    btmRim.rotation.x = Math.PI * 0.5;
    btmRim.position.y = -0.77;

    lantern.add(topRim, btmRim);

    // 3. NGỌN LỬA RÕ NÉT ĐANG CHÁY BÊN TRONG
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, -0.15, 0);

    const flameCoreGeo = new THREE.SphereGeometry(0.18, 8, 8);
    flameCoreGeo.scale(0.8, 1.6, 0.8);
    const flameCore = new THREE.Mesh(flameCoreGeo, this.flameCoreMat);
    flameGroup.add(flameCore);

    const flameOuterGeo = new THREE.SphereGeometry(0.28, 8, 8);
    flameOuterGeo.scale(0.85, 1.7, 0.85);
    const flameOuter = new THREE.Mesh(flameOuterGeo, this.flameOuterMat);
    flameGroup.add(flameOuter);

    lantern.add(flameGroup);

    // 4. HÀO QUANG ÁNH SÁNG TỎA RA MÀN ĐÊM
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

    // 5. Tua rua lụa đỏ may mắn
    const tasselGeo = new THREE.CylinderGeometry(0.02, 0.06, 0.85, 6);
    const tasselMat = new THREE.MeshBasicMaterial({ color: 0xd90429 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.y = -1.35;
    lantern.add(tassel);

    // 6. Bounding Collider ẩn siêu nhẹ (raycast 0 lag)
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
   * Sinh đúng 15 ngọn đèn tương ứng với 15 lời chúc ý nghĩa
   */
  spawnFifteenLanterns() {
    const count = this.wishes.length; // Đúng 15 ngọn đèn

    for (let i = 0; i < count; i++) {
      const wishData = this.wishes[i];
      const { lantern, collider } = this.createGlowingWishLantern(wishData, 0.95);

      // Bán kính cách xa cây (từ 11 đến 25 đơn vị)
      const radius = 11.0 + (i % 4) * 4.4;
      const baseAngle = (i / count) * Math.PI * 2;
      const baseY = 3.5 + (i % 5) * 3.2;

      lantern.position.set(Math.cos(baseAngle) * radius, baseY, Math.sin(baseAngle) * radius);

      this.group.add(lantern);
      this.interactiveLanterns.push(collider);

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

  spawnSkyLanternFromPosition(startPos, wishText = '') {
    const customWish = {
      id: Date.now(),
      symbol: '愿',
      symbolMeaning: 'Nguyện',
      title: 'Tâm Nguyện Thả Lên Trời',
      content: wishText || 'Chúc bạn một mùa Trung Thu đoàn viên, ấm áp và trọn vẹn niềm vui.'
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
    for (let i = 0; i < this.lanternList.length; i++) {
      const item = this.lanternList[i];
      item.angle += item.orbitSpeed * 0.015;

      item.group.position.x = Math.cos(item.angle) * item.radius;
      item.group.position.z = Math.sin(item.angle) * item.radius;
      item.group.position.y = item.baseY + Math.sin(time * item.bobSpeed + item.offset) * item.bobAmp;

      item.group.rotation.y = -item.angle + Math.PI / 2;
      item.group.rotation.z = Math.sin(time * 2 + item.offset) * 0.05;

      if (item.flameGroup) {
        const flicker = 1 + Math.sin(time * 8 + item.offset) * 0.15 + (Math.random() - 0.5) * 0.08;
        item.flameGroup.scale.set(flicker, flicker * 1.1, flicker);
      }

      if (item.glowSprite) {
        const glowPulse = 4.2 + Math.sin(time * 4 + item.offset) * 0.5;
        item.glowSprite.scale.set(glowPulse, glowPulse, 1);
      }
    }

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
