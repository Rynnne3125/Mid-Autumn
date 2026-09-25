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
    // 1. Ánh sáng môi trường đêm ấm áp, lan tỏa 100% đồng đều không tạo vệt sáng tối
    this.ambientLight = new THREE.AmbientLight(0x563e2e, 2.4);
    this.scene.add(this.ambientLight);

    // 2. Hemisphere: ánh sáng bầu trời đêm từ trên và phản xạ nâu đất ấm từ dưới, êm ái tự nhiên
    this.hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x4e3524, 1.6);
    this.scene.add(this.hemiLight);

    // 3. Ánh sáng dịu nhẹ định hướng từ trên cao (ánh sao đêm tỏa rộng, không tạo quầng sáng cục bộ)
    this.starDirLight = new THREE.DirectionalLight(0xf8fafc, 1.2);
    this.starDirLight.position.set(10, 40, 15);
    this.scene.add(this.starDirLight);
  }

  update(time) {
    // Ánh sáng đồng đều, êm dịu, không giật nháy
  }
}
