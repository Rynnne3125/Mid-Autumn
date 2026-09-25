import * as THREE from 'three';

/**
 * Bầu trời nền đen tuyền với các chấm sao ánh nhẹ & Nền đất màu nâu đậm:
 * - Nền đen tuyệt đối giúp ánh lửa lồng đèn bừng sáng lung linh
 * - Các chấm sao dịu nhẹ, lấp lánh tinh tế
 * - Nền đất đồi màu nâu sẫm ấm áp
 */
export class SkyAndMoon {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createSoftStarField();
    this.createDarkBrownMeadow();
  }

  /**
   * Tạo các chấm sao nhỏ ánh sáng dịu nhẹ trên nền đen
   */
  createSoftStarField() {
    const starCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colWhite = new THREE.Color(0xf8f9fa);
    const colSoftGold = new THREE.Color(0xffe8a1);
    const colSoftCyan = new THREE.Color(0xd7e3fc);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 130 + Math.random() * 50;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const rand = Math.random();
      const col = rand > 0.6 ? colSoftGold : rand > 0.3 ? colSoftCyan : colWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75, // Ánh sao dịu nhẹ, thanh lịch
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(geometry, starMaterial);
    this.group.add(this.stars);
  }

  /**
   * Nền đất màu nâu đậm theo đúng yêu cầu
   */
  createDarkBrownMeadow() {
    const islandGeo = new THREE.CylinderGeometry(18, 24, 6, 40, 4);
    const pos = islandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 1.8) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const bump = Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.4;
        const mound = Math.max(0, 1 - dist / 18) * 1.5;
        pos.setY(i, y + bump + mound);
      }
    }
    islandGeo.computeVertexNormals();

    // Màu đất nâu ấm tự nhiên có ánh sáng nhẹ lan tỏa dịu dàng
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x422b1c, // Nâu đất tự nhiên, sáng nhẹ hơn
      emissive: 0x1f130b, // Ánh sáng nhẹ ấm áp trên bề mặt nền đất
      emissiveIntensity: 0.5,
      roughness: 0.8,
      metalness: 0.05,
      flatShading: true
    });

    this.islandMesh = new THREE.Mesh(islandGeo, earthMat);
    this.islandMesh.position.set(0, -3.0, 0);
    this.islandMesh.receiveShadow = true;
    this.group.add(this.islandMesh);

    // Điểm xuyết hoa vàng nhỏ và cánh hoa đào rụng trên nền đất nâu
    this.createEarthFlowers();
  }

  createEarthFlowers() {
    const flowerGroup = new THREE.Group();
    const count = 45;
    const petalGeo = new THREE.ConeGeometry(0.16, 0.35, 4);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.5 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xffb3c1, roughness: 0.5 });

    for (let i = 0; i < count; i++) {
      const mat = i % 2 === 0 ? goldMat : pinkMat;
      const p = new THREE.Mesh(petalGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 14;
      p.position.set(Math.cos(angle) * radius, 0.25, Math.sin(angle) * radius);
      p.scale.setScalar(0.7 + Math.random() * 0.5);
      p.rotation.y = Math.random() * Math.PI;
      flowerGroup.add(p);
    }

    this.group.add(flowerGroup);
  }

  update(time) {
    if (this.stars) {
      this.stars.rotation.y = time * 0.0015;
    }
  }
}
