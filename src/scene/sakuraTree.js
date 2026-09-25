import * as THREE from 'three';

/**
 * Cây Hoa Anh Đào (Sakura Tree) rực rỡ ở trung tâm:
 * - Dáng cây uốn lượn tao nhã, kích thước thu nhỏ cân đối chính giữa màn hình
 * - Tán hoa anh đào màu hồng phấn tươi sáng, phát sáng nhẹ trong đêm (Emissive Glow)
 * - Hiệu ứng cánh hoa anh đào (Sakura Petals) rơi lả tả theo làn gió đêm
 */
export class SakuraTree {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.lanternAnchors = [];
    this.blossomClusters = [];

    this.createMaterials();
    this.buildTrunkAndBranches();
    this.buildBlossomCanopy();
    this.createFallingPetals();

    this.scene.add(this.group);
  }

  createMaterials() {
    // Vỏ thân cây anh đào: nâu sẫm ánh tím huyền ảo
    this.barkMat = new THREE.MeshStandardMaterial({
      color: 0x24151b,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });

    // Các tầng màu hoa anh đào rực rỡ, phát sáng dịu
    this.sakuraHotPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff4d6d,
      emissive: 0xd90429,
      emissiveIntensity: 0.35,
      roughness: 0.6,
      metalness: 0.1,
      flatShading: true
    });

    this.sakuraVibrantPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff758f,
      emissive: 0xff4d6d,
      emissiveIntensity: 0.3,
      roughness: 0.65,
      metalness: 0.1,
      flatShading: true
    });

    this.sakuraSoftPinkMat = new THREE.MeshStandardMaterial({
      color: 0xffb3c1,
      emissive: 0xff758f,
      emissiveIntensity: 0.25,
      roughness: 0.7,
      metalness: 0.1,
      flatShading: true
    });

    this.sakuraWhitePinkMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f3,
      emissive: 0xffccd5,
      emissiveIntensity: 0.2,
      roughness: 0.75,
      metalness: 0.05,
      flatShading: true
    });
  }

  buildTrunkAndBranches() {
    // Thân cây uốn lượn mềm mại dáng bonsai nghệ thuật
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.2, 0),
      new THREE.Vector3(0.6, 2.2, 0.3),
      new THREE.Vector3(0.2, 4.5, -0.2),
      new THREE.Vector3(-0.4, 6.8, 0.1),
      new THREE.Vector3(0, 8.5, 0)
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 20, 1.4, 12, false);
    
    // Tinh chỉnh thon gọn từ gốc lên ngọn
    const pos = trunkGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = 1 - y / 10;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const scale = Math.max(0.45, 0.55 + factor * 0.9);
      pos.setX(i, x * scale);
      pos.setZ(i, z * scale);
    }
    trunkGeo.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeo, this.barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    this.group.add(trunkMesh);

    // Rễ cây xòe nhẹ ôm mặt đất
    const rootAngles = [0, 1.3, 2.6, 3.9, 5.2];
    rootAngles.forEach(ang => {
      const rootCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(ang) * 0.8, 0.9, Math.sin(ang) * 0.8),
        new THREE.Vector3(Math.cos(ang) * 1.8, 0.2, Math.sin(ang) * 1.8),
        new THREE.Vector3(Math.cos(ang) * 2.8, -0.1, Math.sin(ang) * 2.8)
      ]);
      const rootGeo = new THREE.TubeGeometry(rootCurve, 8, 0.35, 6, false);
      const rootMesh = new THREE.Mesh(rootGeo, this.barkMat);
      rootMesh.castShadow = true;
      this.group.add(rootMesh);
    });

    // Các nhánh cành chính vươn ra các hướng
    const branchConfigs = [
      {
        curve: [
          new THREE.Vector3(0, 7.5, 0),
          new THREE.Vector3(-2.8, 9.0, 1.8),
          new THREE.Vector3(-5.5, 9.8, 2.8),
          new THREE.Vector3(-7.5, 9.2, 3.5)
        ],
        radius: 0.65,
        anchor: new THREE.Vector3(-5.2, 8.6, 2.6)
      },
      {
        curve: [
          new THREE.Vector3(0, 7.8, 0),
          new THREE.Vector3(3.2, 9.2, 1.5),
          new THREE.Vector3(6.2, 10.0, 2.2),
          new THREE.Vector3(8.5, 9.5, 2.5)
        ],
        radius: 0.65,
        anchor: new THREE.Vector3(5.8, 8.8, 2.0)
      },
      {
        curve: [
          new THREE.Vector3(0, 8.2, 0),
          new THREE.Vector3(1.0, 9.8, -3.2),
          new THREE.Vector3(2.2, 10.5, -6.0),
          new THREE.Vector3(2.8, 10.0, -8.2)
        ],
        radius: 0.6,
        anchor: new THREE.Vector3(2.0, 9.2, -5.2)
      },
      {
        curve: [
          new THREE.Vector3(0, 8.3, 0),
          new THREE.Vector3(-2.2, 10.0, -2.5),
          new THREE.Vector3(-4.5, 10.8, -4.8),
          new THREE.Vector3(-6.5, 10.2, -6.5)
        ],
        radius: 0.55,
        anchor: new THREE.Vector3(-4.2, 9.4, -4.0)
      },
      {
        curve: [
          new THREE.Vector3(0, 8.5, 0),
          new THREE.Vector3(0.4, 10.8, 1.5),
          new THREE.Vector3(0.8, 12.5, 2.2),
          new THREE.Vector3(1.2, 13.8, 2.5)
        ],
        radius: 0.5,
        anchor: new THREE.Vector3(0.6, 11.2, 1.8)
      }
    ];

    branchConfigs.forEach(cfg => {
      const curve = new THREE.CatmullRomCurve3(cfg.curve);
      const branchGeo = new THREE.TubeGeometry(curve, 14, cfg.radius, 8, false);
      const branchMesh = new THREE.Mesh(branchGeo, this.barkMat);
      branchMesh.castShadow = true;
      this.group.add(branchMesh);

      if (cfg.anchor) {
        this.lanternAnchors.push(cfg.anchor);
      }
    });
  }

  buildBlossomCanopy() {
    // Tán hoa anh đào nhiều tầng bồng bềnh rực rỡ sắc hồng
    const blossomPositions = [
      // Đỉnh cây
      { pos: new THREE.Vector3(0.8, 14.0, 2.2), radius: 3.5, mat: this.sakuraWhitePinkMat },
      { pos: new THREE.Vector3(-1.2, 13.2, -0.5), radius: 3.2, mat: this.sakuraSoftPinkMat },
      { pos: new THREE.Vector3(1.8, 13.5, -1.5), radius: 3.0, mat: this.sakuraVibrantPinkMat },
      // Nhánh trái
      { pos: new THREE.Vector3(-5.2, 10.5, 3.0), radius: 3.6, mat: this.sakuraVibrantPinkMat },
      { pos: new THREE.Vector3(-7.5, 9.8, 3.5), radius: 2.8, mat: this.sakuraHotPinkMat },
      { pos: new THREE.Vector3(-4.0, 11.8, 1.8), radius: 2.9, mat: this.sakuraSoftPinkMat },
      // Nhánh phải
      { pos: new THREE.Vector3(6.0, 10.8, 2.2), radius: 3.5, mat: this.sakuraHotPinkMat },
      { pos: new THREE.Vector3(8.5, 10.0, 2.5), radius: 2.8, mat: this.sakuraVibrantPinkMat },
      { pos: new THREE.Vector3(4.5, 12.0, 1.0), radius: 3.0, mat: this.sakuraSoftPinkMat },
      // Nhánh sau
      { pos: new THREE.Vector3(2.2, 11.2, -6.0), radius: 3.4, mat: this.sakuraSoftPinkMat },
      { pos: new THREE.Vector3(2.8, 10.5, -8.5), radius: 2.6, mat: this.sakuraHotPinkMat },
      { pos: new THREE.Vector3(-4.5, 11.5, -4.8), radius: 3.2, mat: this.sakuraWhitePinkMat },
      { pos: new THREE.Vector3(-6.5, 10.8, -6.8), radius: 2.7, mat: this.sakuraVibrantPinkMat },
      // Điểm xuyết viền trước
      { pos: new THREE.Vector3(0, 10.2, 4.2), radius: 2.6, mat: this.sakuraVibrantPinkMat },
      { pos: new THREE.Vector3(-2.5, 9.2, 5.0), radius: 2.2, mat: this.sakuraHotPinkMat }
    ];

    blossomPositions.forEach(item => {
      const geo = new THREE.DodecahedronGeometry(item.radius, 1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const noise = 1 + (Math.sin(vx * 2.0) + Math.cos(vy * 2.2) + Math.sin(vz * 1.8)) * 0.15;
        pos.setXYZ(i, vx * noise, vy * noise * 0.82, vz * noise);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, item.mat);
      mesh.position.copy(item.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);

      this.blossomClusters.push({
        mesh,
        baseScale: 1,
        seed: Math.random() * 20
      });
    });
  }

  /**
   * Tạo hiệu ứng cánh hoa anh đào rơi lả tả theo gió (Falling Petals)
   */
  createFallingPetals() {
    this.petalCount = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.petalCount * 3);
    const colors = new Float32Array(this.petalCount * 3);
    const scales = new Float32Array(this.petalCount);
    this.petalData = [];

    const colHot = new THREE.Color(0xff4d6d);
    const colSoft = new THREE.Color(0xff758f);
    const colWhite = new THREE.Color(0xffb3c1);

    // Texture cánh hoa anh đào hình giọt lệ
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.bezierCurveTo(48, 20, 52, 45, 32, 58);
    ctx.bezierCurveTo(12, 45, 16, 20, 32, 10);
    ctx.fill();
    const petalTex = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < this.petalCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = 0.5 + Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const r = Math.random();
      const col = r > 0.6 ? colHot : r > 0.25 ? colSoft : colWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = 0.35 + Math.random() * 0.45;

      this.petalData.push({
        fallSpeed: 0.025 + Math.random() * 0.03,
        driftSpeedX: (Math.random() - 0.5) * 0.015,
        driftSpeedZ: (Math.random() - 0.5) * 0.015,
        swaySpeed: 1.2 + Math.random() * 1.5,
        swayAmp: 0.03 + Math.random() * 0.02,
        offset: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.55,
      map: petalTex,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.petalsMesh = new THREE.Points(geometry, material);
    this.group.add(this.petalsMesh);
  }

  update(time) {
    // 1. Tán hoa anh đào khẽ rung rinh trong gió đêm
    for (let i = 0; i < this.blossomClusters.length; i++) {
      const c = this.blossomClusters[i];
      const sway = Math.sin(time * 1.5 + c.seed) * 0.03;
      c.mesh.rotation.z = sway;
      c.mesh.rotation.y = Math.cos(time * 1.2 + c.seed) * 0.02;
    }

    // 2. Cánh hoa anh đào rơi xoay lơ lửng
    if (this.petalsMesh) {
      const pos = this.petalsMesh.geometry.attributes.position;
      for (let i = 0; i < this.petalCount; i++) {
        const d = this.petalData[i];
        let y = pos.getY(i) - d.fallSpeed;
        let x = pos.getX(i) + Math.sin(time * d.swaySpeed + d.offset) * d.swayAmp + d.driftSpeedX;
        let z = pos.getZ(i) + Math.cos(time * d.swaySpeed + d.offset) * d.swayAmp + d.driftSpeedZ;

        // Khi rơi chạm đất, hồi sinh trên đỉnh tán cây
        if (y < 0.2) {
          y = 12 + Math.random() * 5;
          x = (Math.random() - 0.5) * 16;
          z = (Math.random() - 0.5) * 16;
        }

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }
  }
}
