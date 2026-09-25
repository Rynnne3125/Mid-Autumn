import * as THREE from 'three';

/**
 * Quản lý ánh sáng đêm trăng tối ưu tương phản:
 * - Nền tối sâu thẳm giúp hoa anh đào và đèn lồng rực rỡ
 * - Ánh trăng mát dịu chiếu từ hướng mặt trăng
 * - Hệ thống bập bùng ngọn nến tự nhiên cho đèn lồng
 */
export class LightsManager {
  constructor(scene) {
    this.scene = scene;
    this.flickerLights = [];
    this.setupLights();
  }

  setupLights() {
    // 1. Ánh sáng môi trường đêm huyền ảo (màu xanh tím đen huyền bí)
    this.ambientLight = new THREE.AmbientLight(0x0e1428, 1.2);
    this.scene.add(this.ambientLight);

    // 2. Hemisphere light: bầu trời đêm và đảo ngọc
    this.hemiLight = new THREE.HemisphereLight(0x1d2d50, 0x070d1e, 0.7);
    this.scene.add(this.hemiLight);

    // 3. Ánh trăng rằm chiếu rọi (Directional Light chiếu từ hướng mặt trăng)
    this.moonLight = new THREE.DirectionalLight(0xe2eafc, 2.4);
    this.moonLight.position.set(32, 52, -48);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 2048;
    this.moonLight.shadow.mapSize.height = 2048;
    this.moonLight.shadow.camera.near = 1;
    this.moonLight.shadow.camera.far = 160;
    this.moonLight.shadow.camera.left = -25;
    this.moonLight.shadow.camera.right = 25;
    this.moonLight.shadow.camera.top = 25;
    this.moonLight.shadow.camera.bottom = -25;
    this.moonLight.shadow.bias = -0.0003;
    this.scene.add(this.moonLight);

    // 4. Ánh sáng ấm dịu hắt lên tán hoa anh đào từ gốc
    this.treeUpLight = new THREE.PointLight(0xff758f, 1.6, 22, 1.4);
    this.treeUpLight.position.set(0, 3.5, 0);
    this.scene.add(this.treeUpLight);
  }

  /**
   * Đăng ký một bóng đèn cần hiệu ứng nhấp nháy như ngọn nến
   */
  registerFlickerLight(pointLight, baseIntensity = 1.4, variation = 0.4) {
    this.flickerLights.push({
      light: pointLight,
      baseIntensity,
      variation,
      speed: 3 + Math.random() * 4,
      offset: Math.random() * 100
    });
  }

  update(time) {
    // Hiệu ứng ánh lửa bập bùng ngẫu nhiên
    for (let i = 0; i < this.flickerLights.length; i++) {
      const item = this.flickerLights[i];
      const noise =
        Math.sin(time * item.speed + item.offset) * 0.5 +
        Math.sin(time * item.speed * 2.1 + item.offset * 1.5) * 0.3 +
        (Math.random() - 0.5) * 0.2;
      item.light.intensity = Math.max(0.3, item.baseIntensity + noise * item.variation);
    }
  }
}
