import * as THREE from 'three';

/**
 * Quản lý ánh sáng bầu trời sao và làm sáng rực rỡ vùng dưới gốc cây và nền đất:
 * - Ánh sáng sao trời huyền ảo
 * - Ánh sáng hắt mặt đất xanh tươi sáng (Hemisphere Ground Bounce)
 * - Nguồn sáng ấm rực rỡ dưới gốc cây chiếu sáng rõ nét thân cây gỗ, cô bé, thỏ ngọc và đồi cỏ
 */
export class LightsManager {
  constructor(scene) {
    this.scene = scene;
    this.flickerLights = [];
    this.setupLights();
  }

  setupLights() {
    // 1. Ánh sáng môi trường nâng cao độ sáng tổng thể
    this.ambientLight = new THREE.AmbientLight(0x283b6b, 1.8);
    this.scene.add(this.ambientLight);

    // 2. Hemisphere light: Bầu trời sao (xanh sapphire) và phản chiếu mặt đất (xanh lá cây tươi)
    this.hemiLight = new THREE.HemisphereLight(0x4cc9f0, 0x38b000, 1.4);
    this.scene.add(this.hemiLight);

    // 3. Ánh sáng sao từ bầu trời rọi xuống (Directional Light dịu dàng)
    this.starDirLight = new THREE.DirectionalLight(0xdbeafe, 2.0);
    this.starDirLight.position.set(20, 45, 25);
    this.starDirLight.castShadow = true;
    this.starDirLight.shadow.mapSize.width = 2048;
    this.starDirLight.shadow.mapSize.height = 2048;
    this.starDirLight.shadow.camera.near = 1;
    this.starDirLight.shadow.camera.far = 140;
    this.starDirLight.shadow.camera.left = -25;
    this.starDirLight.shadow.camera.right = 25;
    this.starDirLight.shadow.camera.top = 25;
    this.starDirLight.shadow.camera.bottom = -25;
    this.scene.add(this.starDirLight);

    // 4. Ánh sáng ấm chiếu rực rỡ vùng dưới gốc cây và nền cỏ
    this.groundWarmLight = new THREE.PointLight(0xffbe0b, 2.4, 25, 1.3);
    this.groundWarmLight.position.set(0, 3.2, 1.5);
    this.scene.add(this.groundWarmLight);
    this.registerFlickerLight(this.groundWarmLight, 2.4, 0.3);

    // 5. Ánh sáng hắt nhẹ tán hoa anh đào từ trên cao
    this.canopyLight = new THREE.PointLight(0xffb3c1, 1.8, 20, 1.5);
    this.canopyLight.position.set(0, 11, 0);
    this.scene.add(this.canopyLight);
  }

  registerFlickerLight(pointLight, baseIntensity = 1.6, variation = 0.35) {
    this.flickerLights.push({
      light: pointLight,
      baseIntensity,
      variation,
      speed: 3 + Math.random() * 4,
      offset: Math.random() * 100
    });
  }

  update(time) {
    for (let i = 0; i < this.flickerLights.length; i++) {
      const item = this.flickerLights[i];
      const noise =
        Math.sin(time * item.speed + item.offset) * 0.5 +
        Math.sin(time * item.speed * 2.2 + item.offset * 1.6) * 0.3 +
        (Math.random() - 0.5) * 0.2;
      item.light.intensity = Math.max(0.4, item.baseIntensity + noise * item.variation);
    }
  }
}
