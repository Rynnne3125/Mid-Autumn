import * as THREE from 'three';

/**
 * Quản lý ánh sáng hiệu năng cao (Zero-lag):
 * - Ánh sáng môi trường đêm ấm áp
 * - Nguồn sáng ấm rực rỡ ở trung tâm làm nổi bật cây hoa anh đào và đồi đất
 */
export class LightsManager {
  constructor(scene) {
    this.scene = scene;
    this.setupLights();
  }

  setupLights() {
    // 1. Ánh sáng môi trường đêm ấm áp
    this.ambientLight = new THREE.AmbientLight(0x422f24, 2.6);
    this.scene.add(this.ambientLight);

    // 2. Hemisphere: ánh sao từ trên và phản xạ ấm từ nền đất
    this.hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x6e432a, 1.8);
    this.scene.add(this.hemiLight);

    // 3. Ánh sáng sao định hướng
    this.starDirLight = new THREE.DirectionalLight(0xf1f5f9, 1.4);
    this.starDirLight.position.set(15, 35, 20);
    this.scene.add(this.starDirLight);

    // 4. Ánh sáng ấm trung tâm dưới gốc cây
    this.treeWarmLight = new THREE.PointLight(0xffa834, 2.8, 35, 1.2);
    this.treeWarmLight.position.set(0, 3.2, 1.2);
    this.scene.add(this.treeWarmLight);

    // 5. Đèn hắt sàn mềm mại tỏa ánh sáng nhẹ quanh nền đất
    this.groundGlowLight = new THREE.PointLight(0xffc278, 2.2, 30, 1.3);
    this.groundGlowLight.position.set(0, 0.9, 0);
    this.scene.add(this.groundGlowLight);
  }

  update(time) {
    if (this.treeWarmLight) {
      const flicker = 2.8 + Math.sin(time * 5) * 0.25;
      this.treeWarmLight.intensity = flicker;
    }
    if (this.groundGlowLight) {
      const gFlicker = 2.2 + Math.sin(time * 3 + 1.2) * 0.2;
      this.groundGlowLight.intensity = gFlicker;
    }
  }
}
