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
    // 1. Ánh sáng môi trường đêm
    this.ambientLight = new THREE.AmbientLight(0x2d1f18, 2.0);
    this.scene.add(this.ambientLight);

    // 2. Hemisphere: ánh sao từ trên và phản xạ từ đất nâu
    this.hemiLight = new THREE.HemisphereLight(0x64748b, 0x22130c, 1.2);
    this.scene.add(this.hemiLight);

    // 3. Ánh sáng sao định hướng
    this.starDirLight = new THREE.DirectionalLight(0xe2e8f0, 1.4);
    this.starDirLight.position.set(15, 35, 20);
    this.scene.add(this.starDirLight);

    // 4. Ánh sáng ấm trung tâm dưới gốc cây
    this.treeWarmLight = new THREE.PointLight(0xffa200, 2.2, 30, 1.3);
    this.treeWarmLight.position.set(0, 3.2, 1.5);
    this.scene.add(this.treeWarmLight);
  }

  update(time) {
    if (this.treeWarmLight) {
      const flicker = 2.2 + Math.sin(time * 6) * 0.25;
      this.treeWarmLight.intensity = flicker;
    }
  }
}
