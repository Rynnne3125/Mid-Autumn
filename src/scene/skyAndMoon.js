import * as THREE from 'three';

/**
 * Bầu trời ngàn sao lung linh 360 độ (không có ánh trăng) & Đồi cỏ xanh tươi sáng:
 * - Hàng ngàn vì sao đa sắc lấp lánh bao quanh không gian
 * - Đồi cỏ xanh tươi rực rỡ, được chiếu sáng rõ nét dưới gốc cây
 * - Điểm xuyết hoa cỏ và cánh hoa anh đào rụng trên nền cỏ
 */
export class SkyAndMoon {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createStarField();
    this.createCosmicDust();
    this.createBrightGreenMeadow();
  }

  /**
   * Tạo 3.600 vì sao lấp lánh bao trùm toàn bộ bầu trời đêm 360 độ
   */
  createStarField() {
    const starCount = 3600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorWhite = new THREE.Color(0xffffff);
    const colorGold = new THREE.Color(0xffe066);
    const colorCyan = new THREE.Color(0xa0c4ff);
    const colorPink = new THREE.Color(0xffcbf2);

    for (let i = 0; i < starCount; i++) {
      // Phân bố đều quanh bầu trời hình cầu
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 120 + Math.random() * 60;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const rand = Math.random();
      const col = rand > 0.65 ? colorGold : rand > 0.35 ? colorCyan : rand > 0.15 ? colorPink : colorWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(geometry, starMaterial);
    this.group.add(this.stars);
  }

  /**
   * Tạo dải bụi sao ngân hà lấp lánh mờ ảo (Cosmic Stardust)
   */
  createCosmicDust() {
    const dustCount = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);

    const c1 = new THREE.Color(0x7209b7);
    const c2 = new THREE.Color(0x4361ee);
    const c3 = new THREE.Color(0xf72585);

    for (let i = 0; i < dustCount; i++) {
      const angle = (i / dustCount) * Math.PI * 2;
      const r = 100 + (Math.random() - 0.5) * 30;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.sin(angle * 2) * 35) + (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      const mixCol = Math.random() > 0.5 ? c1 : Math.random() > 0.5 ? c2 : c3;
      colors[i * 3] = mixCol.r;
      colors[i * 3 + 1] = mixCol.g;
      colors[i * 3 + 2] = mixCol.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.cosmicDust = new THREE.Points(geo, mat);
    this.group.add(this.cosmicDust);
  }

  /**
   * Đồi cỏ xanh tươi rực rỡ và sáng sủa dưới gốc cây
   */
  createBrightGreenMeadow() {
    // Đồi tròn thoai thoải nâng đỡ cảnh vật
    const islandGeo = new THREE.CylinderGeometry(19, 25, 7, 54, 8);
    const pos = islandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 2) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const bump = Math.sin(x * 0.35) * Math.cos(z * 0.35) * 0.5;
        const mound = Math.max(0, 1 - dist / 19) * 1.8;
        pos.setY(i, y + bump + mound);
      }
    }
    islandGeo.computeVertexNormals();

    // Màu xanh lá cây tươi sáng và ấm áp
    const meadowMat = new THREE.MeshStandardMaterial({
      color: 0x38b000, // Xanh lá cây tươi tắn (fresh green)
      roughness: 0.65,
      metalness: 0.05,
      flatShading: true
    });

    this.islandMesh = new THREE.Mesh(islandGeo, meadowMat);
    this.islandMesh.position.set(0, -3.5, 0);
    this.islandMesh.receiveShadow = true;
    this.group.add(this.islandMesh);

    // Thêm các đóm hoa cúc vàng và hoa đào rơi rải rác trên thảm cỏ xanh
    this.createMeadowFlowers();
  }

  createMeadowFlowers() {
    const flowerGroup = new THREE.Group();
    const count = 75;
    const petalGeo = new THREE.ConeGeometry(0.18, 0.42, 5);
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff8fa3, roughness: 0.5 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffea00, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

    for (let i = 0; i < count; i++) {
      const flower = new THREE.Group();
      const mat = i % 3 === 0 ? pinkMat : i % 3 === 1 ? yellowMat : whiteMat;
      const p = new THREE.Mesh(petalGeo, mat);
      flower.add(p);

      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 15;
      flower.position.set(Math.cos(angle) * radius, 0.28 + Math.random() * 0.2, Math.sin(angle) * radius);
      flower.scale.setScalar(0.7 + Math.random() * 0.6);
      flower.rotation.y = Math.random() * Math.PI;
      flowerGroup.add(flower);
    }

    this.group.add(flowerGroup);
  }

  update(time) {
    if (this.stars) {
      this.stars.rotation.y = time * 0.003;
    }
    if (this.cosmicDust) {
      this.cosmicDust.rotation.y = -time * 0.002;
    }
  }
}
