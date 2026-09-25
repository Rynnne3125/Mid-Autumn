import * as THREE from 'three';

/**
 * Bầu trời đêm sâu thẳm (Deep Night Sky) & Vầng Trăng Rằm rực rỡ:
 * - Nền trời tối thẫm tương phản cao giúp hoa anh đào và đèn lồng bừng sáng
 * - Vầng trăng rằm tròn vành vạnh tỏa ánh hào quang tinh khôi
 * - Hòn đảo ngọc thần tiên (Floating Celestial Hill) ở trung tâm nâng đỡ cây anh đào
 * - Hoàn toàn không có mây theo yêu cầu của bạn
 */
export class SkyAndMoon {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createStarField();
    this.createFullMoon();
    this.createCelestialIsland();
  }

  /**
   * Tạo 2.200 vì sao lấp lánh trên nền trời đêm sâu thẳm
   */
  createStarField() {
    const starCount = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorWhite = new THREE.Color(0xffffff);
    const colorGold = new THREE.Color(0xffd166);
    const colorCyan = new THREE.Color(0xa0c4ff);
    const colorPink = new THREE.Color(0xffb3c1);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 140 + Math.random() * 50;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5; // Bán cầu trên
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const rand = Math.random();
      const col = rand > 0.7 ? colorGold : rand > 0.4 ? colorCyan : rand > 0.2 ? colorPink : colorWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(geometry, starMaterial);
    this.group.add(this.stars);
  }

  /**
   * Tạo texture mặt trăng rằm sắc nét bằng Procedural Canvas
   */
  generateMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nền sáng vàng kem ánh ngọc
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#fffef2');
    grad.addColorStop(0.5, '#fefae0');
    grad.addColorStop(1, '#faedcd');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Họa tiết biển trăng huyền ảo
    ctx.fillStyle = 'rgba(195, 180, 145, 0.32)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 25 + Math.random() * 95;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Các hố va chạm nhỏ
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 4 + Math.random() * 18;
      ctx.fillStyle = 'rgba(160, 140, 110, 0.22)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Tạo Mặt Trăng Rằm lớn với quầng hào quang phát sáng
   */
  createFullMoon() {
    const moonGroup = new THREE.Group();
    // Đặt mặt trăng cao ở góc trời phía sau, tạo điểm tựa ánh sáng
    moonGroup.position.set(32, 52, -48);

    // Quả cầu mặt trăng
    const moonGeo = new THREE.SphereGeometry(14, 64, 64);
    const moonTex = this.generateMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      emissive: new THREE.Color(0xfffae0),
      emissiveIntensity: 0.98,
      roughness: 0.5,
      metalness: 0.1
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(this.moonMesh);

    // 4 lớp hào quang mềm mại (Aura Glow)
    const halos = [
      { size: 16.5, opacity: 0.5, color: 0xfff3b0 },
      { size: 21.0, opacity: 0.3, color: 0xffd166 },
      { size: 28.0, opacity: 0.16, color: 0xffb703 },
      { size: 38.0, opacity: 0.08, color: 0x90e0ef }
    ];

    halos.forEach(h => {
      const hGeo = new THREE.SphereGeometry(h.size, 32, 32);
      const hMat = new THREE.MeshBasicMaterial({
        color: h.color,
        transparent: true,
        opacity: h.opacity,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      moonGroup.add(new THREE.Mesh(hGeo, hMat));
    });

    this.group.add(moonGroup);
  }

  /**
   * Đảo ngọc bồng bềnh (Celestial Island) ở trung tâm nâng đỡ cây hoa anh đào
   */
  createCelestialIsland() {
    // Mặt đồi cỏ xanh ngọc dịu dàng phẳng ở đỉnh
    const islandGeo = new THREE.CylinderGeometry(18, 24, 7, 48, 6);
    const pos = islandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 2) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const bump = Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.6;
        const mound = Math.max(0, 1 - dist / 18) * 1.6;
        pos.setY(i, y + bump + mound);
      }
    }
    islandGeo.computeVertexNormals();

    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x132a13, // Xanh rêu ngọc đậm
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });

    this.islandMesh = new THREE.Mesh(islandGeo, islandMat);
    this.islandMesh.position.set(0, -3.5, 0);
    this.islandMesh.receiveShadow = true;
    this.group.add(this.islandMesh);

    // Điểm xuyết hoa anh đào rụng và hoa cúc trên mặt đồi
    this.createGroundFlowers();
  }

  createGroundFlowers() {
    const flowerGroup = new THREE.Group();
    const count = 48;
    const petalGeo = new THREE.ConeGeometry(0.16, 0.4, 5);
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff758f, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.6 });

    for (let i = 0; i < count; i++) {
      const flower = new THREE.Group();
      const mat = i % 2 === 0 ? pinkMat : goldMat;
      const p = new THREE.Mesh(petalGeo, mat);
      flower.add(p);

      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 14;
      flower.position.set(Math.cos(angle) * radius, 0.25 + Math.random() * 0.2, Math.sin(angle) * radius);
      flower.scale.setScalar(0.7 + Math.random() * 0.6);
      flower.rotation.y = Math.random() * Math.PI;
      flowerGroup.add(flower);
    }

    this.group.add(flowerGroup);
  }

  update(time) {
    if (this.moonMesh) {
      this.moonMesh.rotation.y = time * 0.015;
    }
    if (this.stars) {
      this.stars.rotation.y = time * 0.002;
    }
  }
}
