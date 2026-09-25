import * as THREE from 'three';

/**
 * Quản lý hệ thống hạt ánh lửa & hoa lửa tương tác:
 * - Hàng trăm tàn lửa nhỏ bay bốc lên trong không trung
 * - Đom đóm đêm hè lập lòe
 * - Hoa lửa mini bùng nổ khi chạm vào lồng đèn hoặc cô bé
 */
export class ParticlesManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.createEmbersSystem();
    this.createFirefliesSystem();
    this.createBurstSystem();

    this.scene.add(this.group);
  }

  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 215, 100, 0.9)');
    grad.addColorStop(0.6, 'rgba(255, 100, 50, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  createEmbersSystem() {
    this.emberCount = 550;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.emberCount * 3);
    const colors = new Float32Array(this.emberCount * 3);
    this.emberVelocities = [];

    const emberTexture = this.createGlowTexture();
    const colGold = new THREE.Color(0xffd166);
    const colOrange = new THREE.Color(0xff9e00);
    const colPink = new THREE.Color(0xff758f);

    for (let i = 0; i < this.emberCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = 0.5 + Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const r = Math.random();
      const col = r > 0.65 ? colGold : r > 0.3 ? colOrange : colPink;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.emberVelocities.push({
        vx: (Math.random() - 0.5) * 0.02,
        vy: 0.025 + Math.random() * 0.045,
        vz: (Math.random() - 0.5) * 0.02,
        swaySpeed: 1 + Math.random() * 2,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.65,
      map: emberTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.emberPoints = new THREE.Points(geometry, material);
    this.group.add(this.emberPoints);
  }

  createFirefliesSystem() {
    this.fireflyCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.fireflyCount * 3);
    const colors = new Float32Array(this.fireflyCount * 3);
    this.fireflyData = [];

    const fireflyTexture = this.createGlowTexture();
    const fireflyColor = new THREE.Color(0xd8f3dc);

    for (let i = 0; i < this.fireflyCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 14;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.4 + Math.random() * 4.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      colors[i * 3] = fireflyColor.r;
      colors[i * 3 + 1] = fireflyColor.g;
      colors[i * 3 + 2] = fireflyColor.b;

      this.fireflyData.push({
        baseX: positions[i * 3],
        baseY: positions[i * 3 + 1],
        baseZ: positions[i * 3 + 2],
        blinkSpeed: 1.5 + Math.random() * 3,
        blinkOffset: Math.random() * Math.PI * 2,
        moveSpeed: 0.5 + Math.random() * 0.8
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.85,
      map: fireflyTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.fireflyPoints = new THREE.Points(geometry, material);
    this.group.add(this.fireflyPoints);
  }

  createBurstSystem() {
    this.burstMax = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.burstMax * 3);
    const colors = new Float32Array(this.burstMax * 3);

    for (let i = 0; i < this.burstMax * 3; i++) {
      positions[i] = 9999;
      colors[i] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.85,
      map: this.createGlowTexture(),
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.burstPoints = new THREE.Points(geometry, material);
    this.group.add(this.burstPoints);
    this.burstParticles = [];
  }

  triggerBurst(pos) {
    const burstCount = 45;
    const colors = [new THREE.Color(0xffd166), new THREE.Color(0xff758f), new THREE.Color(0xffffff), new THREE.Color(0xff9e00)];

    for (let i = 0; i < burstCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.08 + Math.random() * 0.14;
      const col = colors[Math.floor(Math.random() * colors.length)];

      this.burstParticles.push({
        x: pos.x,
        y: pos.y,
        z: pos.z,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed + 0.05,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        color: col,
        life: 1.0,
        decay: 0.025 + Math.random() * 0.02
      });
    }
  }

  update(time) {
    if (this.emberPoints) {
      const pos = this.emberPoints.geometry.attributes.position;
      for (let i = 0; i < this.emberCount; i++) {
        const vel = this.emberVelocities[i];
        let y = pos.getY(i) + vel.vy;
        let x = pos.getX(i) + Math.sin(time * vel.swaySpeed + vel.swayOffset) * 0.02 + vel.vx;
        let z = pos.getZ(i) + Math.cos(time * vel.swaySpeed + vel.swayOffset) * 0.02 + vel.vz;

        if (y > 24) {
          y = 0.5 + Math.random() * 2;
          x = (Math.random() - 0.5) * 18;
          z = (Math.random() - 0.5) * 18;
        }

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }

    if (this.fireflyPoints) {
      const pos = this.fireflyPoints.geometry.attributes.position;
      for (let i = 0; i < this.fireflyCount; i++) {
        const d = this.fireflyData[i];
        const x = d.baseX + Math.sin(time * d.moveSpeed + d.blinkOffset) * 0.6;
        const y = d.baseY + Math.cos(time * d.moveSpeed * 1.3 + d.blinkOffset) * 0.35;
        const z = d.baseZ + Math.sin(time * d.moveSpeed * 0.7 + d.blinkOffset) * 0.6;
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      this.fireflyPoints.material.opacity = 0.5 + Math.sin(time * 3) * 0.4;
    }

    if (this.burstParticles.length > 0) {
      const pos = this.burstPoints.geometry.attributes.position;
      const col = this.burstPoints.geometry.attributes.color;

      for (let i = 0; i < this.burstMax; i++) {
        if (i < this.burstParticles.length) {
          const p = this.burstParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.vy -= 0.003;
          p.life -= p.decay;

          pos.setXYZ(i, p.x, p.y, p.z);
          col.setXYZ(i, p.color.r * p.life, p.color.g * p.life, p.color.b * p.life);

          if (p.life <= 0) {
            this.burstParticles.splice(i, 1);
            i--;
          }
        } else {
          pos.setXYZ(i, 9999, 9999, 9999);
        }
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
    }
  }
}
