import * as THREE from 'three';

/**
 * Cây Hoa Anh Đào với khung cành gỗ tự nhiên và vô số bông hoa anh đào hồng nhạt đính trên cành:
 * - Khung thân gỗ màu sáng tự nhiên (gỗ ấm, không bị tối)
 * - Các cành lớn tỏa nhánh nhỏ và các nhánh mảnh vươn cao
 * - Hơn 2.000 bông hoa anh đào hồng nhạt đính dày đặc trên các cành trên cùng
 * - Cánh hoa anh đào rơi lả tả theo gió
 */
export class SakuraTree {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.lanternAnchors = [];
    this.branchTipPositions = [];

    this.createMaterials();
    this.buildWoodArmature();
    this.populateBlossomFlowers();
    this.createFallingPetals();

    this.scene.add(this.group);
  }

  createMaterials() {
    // Vỏ gỗ sáng màu, ấm áp tự nhiên (nâu mật ong sáng, không bị đen/tối)
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0x9c6644,
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true
    });

    // Chất liệu hoa anh đào màu hồng phấn dịu dàng
    this.blossomPetalMat = new THREE.MeshStandardMaterial({
      color: 0xffb3c1,
      emissive: 0xff758f,
      emissiveIntensity: 0.35,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    // Nhụy hoa vàng óng
    this.stamenMat = new THREE.MeshBasicMaterial({
      color: 0xffea00
    });
  }

  /**
   * Dựng khung cây gỗ (Thân chính -> Cành lớn -> Nhánh phụ vươn cao)
   */
  buildWoodArmature() {
    // 1. Thân chính uốn cong thanh thoát từ gốc
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.2, 0),
      new THREE.Vector3(0.4, 2.2, 0.2),
      new THREE.Vector3(-0.2, 4.4, -0.1),
      new THREE.Vector3(0.3, 6.4, 0.3),
      new THREE.Vector3(0, 8.0, 0)
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 20, 1.2, 10, false);
    
    // Tinh chỉnh thân thuôn dần lên ngọn
    const pos = trunkGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = 1 - y / 9;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const scale = Math.max(0.4, 0.5 + factor * 0.75);
      pos.setX(i, x * scale);
      pos.setZ(i, z * scale);
    }
    trunkGeo.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeo, this.woodMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    this.group.add(trunkMesh);

    // Rễ cây gỗ ôm đồi cỏ
    const rootAngles = [0.2, 1.5, 2.8, 4.1, 5.4];
    rootAngles.forEach(ang => {
      const rootCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(ang) * 0.7, 0.8, Math.sin(ang) * 0.7),
        new THREE.Vector3(Math.cos(ang) * 1.6, 0.2, Math.sin(ang) * 1.6),
        new THREE.Vector3(Math.cos(ang) * 2.5, -0.1, Math.sin(ang) * 2.5)
      ]);
      const rootGeo = new THREE.TubeGeometry(rootCurve, 8, 0.3, 6, false);
      this.group.add(new THREE.Mesh(rootGeo, this.woodMat));
    });

    // 2. Hệ thống cành lớn vươn rộng và nhánh phụ
    const branchConfigs = [
      // Nhánh vươn trái
      {
        main: [
          new THREE.Vector3(0, 7.2, 0),
          new THREE.Vector3(-2.2, 8.5, 1.4),
          new THREE.Vector3(-4.8, 9.4, 2.2),
          new THREE.Vector3(-7.2, 9.2, 2.8)
        ],
        subBranches: [
          [new THREE.Vector3(-4.8, 9.4, 2.2), new THREE.Vector3(-6.2, 10.8, 1.5), new THREE.Vector3(-7.8, 11.8, 1.8)],
          [new THREE.Vector3(-2.2, 8.5, 1.4), new THREE.Vector3(-3.2, 10.2, -0.5), new THREE.Vector3(-4.5, 11.5, -1.0)]
        ],
        anchor: new THREE.Vector3(-5.5, 8.8, 2.2)
      },
      // Nhánh vươn phải
      {
        main: [
          new THREE.Vector3(0, 7.4, 0),
          new THREE.Vector3(2.5, 8.6, 1.2),
          new THREE.Vector3(5.2, 9.6, 1.8),
          new THREE.Vector3(7.5, 9.4, 2.2)
        ],
        subBranches: [
          [new THREE.Vector3(5.2, 9.6, 1.8), new THREE.Vector3(6.8, 11.2, 1.2), new THREE.Vector3(8.4, 12.0, 1.5)],
          [new THREE.Vector3(2.5, 8.6, 1.2), new THREE.Vector3(3.8, 10.4, -0.6), new THREE.Vector3(5.2, 11.6, -1.2)]
        ],
        anchor: new THREE.Vector3(5.8, 9.0, 1.8)
      },
      // Nhánh vươn sau lưng
      {
        main: [
          new THREE.Vector3(0, 7.6, 0),
          new THREE.Vector3(0.8, 9.0, -2.5),
          new THREE.Vector3(1.6, 10.0, -5.2),
          new THREE.Vector3(2.2, 9.8, -7.5)
        ],
        subBranches: [
          [new THREE.Vector3(1.6, 10.0, -5.2), new THREE.Vector3(2.8, 11.5, -6.5), new THREE.Vector3(3.5, 12.5, -8.0)],
          [new THREE.Vector3(0.8, 9.0, -2.5), new THREE.Vector3(-1.0, 10.5, -4.5), new THREE.Vector3(-2.2, 11.8, -6.2)]
        ],
        anchor: new THREE.Vector3(1.8, 9.2, -5.5)
      },
      // Nhánh vươn sau trái
      {
        main: [
          new THREE.Vector3(0, 7.8, 0),
          new THREE.Vector3(-1.8, 9.2, -1.8),
          new THREE.Vector3(-3.8, 10.2, -3.8),
          new THREE.Vector3(-5.8, 10.0, -5.5)
        ],
        subBranches: [
          [new THREE.Vector3(-3.8, 10.2, -3.8), new THREE.Vector3(-5.0, 11.8, -4.2), new THREE.Vector3(-6.5, 12.8, -4.8)]
        ],
        anchor: new THREE.Vector3(-4.2, 9.4, -4.0)
      },
      // Nhánh đỉnh vươn thẳng lên trời
      {
        main: [
          new THREE.Vector3(0, 8.0, 0),
          new THREE.Vector3(0.3, 10.2, 0.8),
          new THREE.Vector3(0.6, 12.2, 1.2),
          new THREE.Vector3(0.9, 14.0, 1.5)
        ],
        subBranches: [
          [new THREE.Vector3(0.6, 12.2, 1.2), new THREE.Vector3(-1.2, 13.5, 1.0), new THREE.Vector3(-2.2, 14.8, 0.8)],
          [new THREE.Vector3(0.6, 12.2, 1.2), new THREE.Vector3(1.8, 13.8, 0.6), new THREE.Vector3(2.8, 15.0, 0.4)],
          [new THREE.Vector3(0.3, 10.2, 0.8), new THREE.Vector3(0.2, 12.0, -1.2), new THREE.Vector3(0.4, 13.8, -2.0)]
        ],
        anchor: new THREE.Vector3(0.6, 11.5, 1.2)
      }
    ];

    branchConfigs.forEach(cfg => {
      // Dựng cành chính
      const curve = new THREE.CatmullRomCurve3(cfg.main);
      const branchGeo = new THREE.TubeGeometry(curve, 14, 0.55, 8, false);
      this.group.add(new THREE.Mesh(branchGeo, this.woodMat));

      if (cfg.anchor) this.lanternAnchors.push(cfg.anchor);

      // Lưu lại các điểm dọc theo cành để gắn hoa
      const points = curve.getPoints(12);
      for (let p = 3; p < points.length; p++) {
        this.branchTipPositions.push(points[p]);
      }

      // Dựng các nhánh phụ
      if (cfg.subBranches) {
        cfg.subBranches.forEach(sub => {
          const subCurve = new THREE.CatmullRomCurve3(sub);
          const subGeo = new THREE.TubeGeometry(subCurve, 10, 0.3, 6, false);
          this.group.add(new THREE.Mesh(subGeo, this.woodMat));

          const subPts = subCurve.getPoints(10);
          for (let sp = 2; sp < subPts.length; sp++) {
            this.branchTipPositions.push(subPts[sp]);
          }
        });
      }
    });
  }

  /**
   * Tạo hình 1 bông hoa anh đào 5 cánh tinh xảo với nhụy hoa
   */
  createBlossomFlowerGeometry() {
    const flowerGroup = new THREE.Group();
    const petalShape = new THREE.Shape();

    // Cánh hoa hình trái tim / giọt lệ đặc trưng của hoa anh đào
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.18, 0.15, 0.22, 0.45, 0.08, 0.6);
    petalShape.bezierCurveTo(0.04, 0.65, -0.04, 0.65, -0.08, 0.6);
    petalShape.bezierCurveTo(-0.22, 0.45, -0.18, 0.15, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape);

    // 5 cánh hoa xếp đối xứng tròn
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalMesh = new THREE.Mesh(petalGeo, this.blossomPetalMat);
      petalMesh.rotation.z = angle;
      // Khẽ cong hình lòng chảo
      petalMesh.rotation.x = 0.2;
      flowerGroup.add(petalMesh);
    }

    // Nhụy hoa vàng ở giữa
    const stamenGeo = new THREE.SphereGeometry(0.09, 6, 6);
    const stamenMesh = new THREE.Mesh(stamenGeo, this.stamenMat);
    stamenMesh.position.z = 0.04;
    flowerGroup.add(stamenMesh);

    return flowerGroup;
  }

  /**
   * Tạo hơn 2.000 bông hoa anh đào hồng nhạt đính dày đặc trên các cành gỗ
   */
  populateBlossomFlowers() {
    this.blossomsGroup = new THREE.Group();
    const totalFlowers = 2200;

    // Tạo hình mẫu bông hoa 5 cánh
    const flowerSample = this.createBlossomFlowerGeometry();

    // Dùng InstancedMesh để đạt hiệu năng tối đa (60 FPS mượt mà)
    // Gom geometry cánh hoa 5 cánh lại
    const singlePetalShape = new THREE.Shape();
    singlePetalShape.moveTo(0, 0);
    singlePetalShape.bezierCurveTo(0.18, 0.15, 0.22, 0.45, 0.08, 0.6);
    singlePetalShape.bezierCurveTo(0.04, 0.65, -0.04, 0.65, -0.08, 0.6);
    singlePetalShape.bezierCurveTo(-0.22, 0.45, -0.18, 0.15, 0, 0);

    // Ghép 5 cánh thành 1 mesh bông hoa hoàn chỉnh
    const flowerGeometries = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const g = new THREE.ShapeGeometry(singlePetalShape);
      g.rotateZ(angle);
      g.rotateX(0.2);
      flowerGeometries.push(g);
    }

    // Nhụy hoa
    const coreGeo = new THREE.SphereGeometry(0.1, 6, 6);
    coreGeo.translate(0, 0, 0.04);
    flowerGeometries.push(coreGeo);

    // Hợp nhất thành 1 geometry bông hoa duy nhất
    import('three/addons/utils/BufferGeometryUtils.js').then((BufferGeometryUtils) => {
      const mergedFlowerGeo = BufferGeometryUtils.mergeGeometries(flowerGeometries, false);

      const instancedMesh = new THREE.InstancedMesh(mergedFlowerGeo, this.blossomPetalMat, totalFlowers);
      instancedMesh.castShadow = true;
      const dummy = new THREE.Object3D();

      const palette = [
        new THREE.Color(0xffb3c1), // Hồng phấn nhạt
        new THREE.Color(0xffccd5), // Hồng kem dịu
        new THREE.Color(0xfff0f3), // Trắng ánh hồng
        new THREE.Color(0xff8fa3)  // Hồng đào tươi
      ];

      for (let i = 0; i < totalFlowers; i++) {
        // Chọn ngẫu nhiên một điểm cành để đính chùm hoa
        const anchorPt = this.branchTipPositions[i % this.branchTipPositions.length];
        
        // Phân tán hoa quanh cành theo hình cầu/elip tự nhiên
        const radius = 0.2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        const posX = anchorPt.x + radius * Math.sin(phi) * Math.cos(theta);
        const posY = anchorPt.y + radius * Math.cos(phi) * 0.9;
        const posZ = anchorPt.z + radius * Math.sin(phi) * Math.sin(theta);

        dummy.position.set(posX, posY, posZ);

        // Hướng hoa xòe tự nhiên ra ngoài
        dummy.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        // Kích thước hoa đa dạng
        const scale = 0.75 + Math.random() * 0.55;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);

        // Màu sắc hồng nhạt đan xen
        const color = palette[Math.floor(Math.random() * palette.length)];
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      this.blossomInstanced = instancedMesh;
      this.group.add(instancedMesh);
    }).catch(() => {
      // Fallback nếu không load được BufferGeometryUtils: dùng các chùm hoa tinh gọn
      this.fallbackBlossoms(totalFlowers);
    });
  }

  fallbackBlossoms(totalFlowers) {
    const blossomGroup = new THREE.Group();
    const flowerGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const count = Math.min(totalFlowers, 600);

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(flowerGeo, this.blossomPetalMat);
      const anchorPt = this.branchTipPositions[i % this.branchTipPositions.length];
      const r = 0.2 + Math.random() * 1.3;
      mesh.position.set(
        anchorPt.x + (Math.random() - 0.5) * r * 2,
        anchorPt.y + (Math.random() - 0.5) * r * 1.5,
        anchorPt.z + (Math.random() - 0.5) * r * 2
      );
      mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      blossomGroup.add(mesh);
    }
    this.group.add(blossomGroup);
  }

  /**
   * Cánh hoa anh đào màu hồng phấn nhẹ nhàng rơi lả tả
   */
  createFallingPetals() {
    this.petalCount = 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.petalCount * 3);
    const colors = new Float32Array(this.petalCount * 3);
    this.petalData = [];

    const colSoftPink = new THREE.Color(0xffb3c1);
    const colWhitePink = new THREE.Color(0xfff0f3);

    // Canvas texture cánh hoa hình giọt lệ
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(32, 8);
    ctx.bezierCurveTo(50, 18, 54, 46, 32, 58);
    ctx.bezierCurveTo(10, 46, 14, 18, 32, 8);
    ctx.fill();
    const petalTex = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < this.petalCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = 0.5 + Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const col = Math.random() > 0.5 ? colSoftPink : colWhitePink;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.petalData.push({
        fallSpeed: 0.02 + Math.random() * 0.025,
        driftSpeedX: (Math.random() - 0.5) * 0.012,
        driftSpeedZ: (Math.random() - 0.5) * 0.012,
        swaySpeed: 1.2 + Math.random() * 1.5,
        swayAmp: 0.025 + Math.random() * 0.02,
        offset: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: petalTex,
      transparent: true,
      opacity: 0.92,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.petalsMesh = new THREE.Points(geometry, material);
    this.group.add(this.petalsMesh);
  }

  update(time) {
    // Cánh hoa rơi chầm chậm theo làn gió
    if (this.petalsMesh) {
      const pos = this.petalsMesh.geometry.attributes.position;
      for (let i = 0; i < this.petalCount; i++) {
        const d = this.petalData[i];
        let y = pos.getY(i) - d.fallSpeed;
        let x = pos.getX(i) + Math.sin(time * d.swaySpeed + d.offset) * d.swayAmp + d.driftSpeedX;
        let z = pos.getZ(i) + Math.cos(time * d.swaySpeed + d.offset) * d.swayAmp + d.driftSpeedZ;

        if (y < 0.2) {
          y = 13 + Math.random() * 4;
          x = (Math.random() - 0.5) * 16;
          z = (Math.random() - 0.5) * 16;
        }

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }
  }
}
