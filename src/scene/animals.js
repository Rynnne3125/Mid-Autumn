import * as THREE from 'three';

/**
 * Thỏ Ngọc và Chú Trâu dưới gốc cây hoa anh đào:
 * - Thỏ Ngọc mẹ giã thuốc và Thỏ Ngọc con vui đùa
 * - Chú Trâu nằm nghỉ ngơi thảnh thơi
 * - Tương tác click: Thỏ nhảy cẫng lên và tỏa hoa lửa lung linh
 */
export class AnimalsManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.interactiveObjects = [];

    this.createMaterials();
    this.createJadeRabbitMain();
    this.createBabyRabbit();
    this.createRestingBuffalo();

    this.scene.add(this.group);
  }

  createMaterials() {
    this.rabbitFurMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.05
    });

    this.rabbitPinkMat = new THREE.MeshStandardMaterial({
      color: 0xffb7b2,
      roughness: 0.5
    });

    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x222222 });

    this.mortarMat = new THREE.MeshStandardMaterial({
      color: 0xa8dadc,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x457b9d,
      emissiveIntensity: 0.3
    });

    this.buffaloMat = new THREE.MeshStandardMaterial({
      color: 0x3d405b,
      roughness: 0.85
    });

    this.hornMat = new THREE.MeshStandardMaterial({
      color: 0xe07a5f,
      roughness: 0.5
    });
  }

  createJadeRabbitMain() {
    const rabbit = new THREE.Group();
    rabbit.position.set(-2.0, 0.4, 3.5);
    rabbit.rotation.y = Math.PI * 0.25;
    rabbit.name = 'JadeRabbit';

    // Thân thỏ
    const bodyGeo = new THREE.SphereGeometry(0.75, 16, 16);
    bodyGeo.scale(0.9, 1.15, 0.95);
    const body = new THREE.Mesh(bodyGeo, this.rabbitFurMat);
    body.position.y = 0.75;
    body.castShadow = true;
    rabbit.add(body);

    // Đầu thỏ
    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const head = new THREE.Mesh(headGeo, this.rabbitFurMat);
    head.position.set(0, 1.65, 0.2);
    head.castShadow = true;
    rabbit.add(head);

    // Mắt
    const eyeGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, this.eyeMat);
    leftEye.position.set(-0.2, 1.78, 0.65);
    const rightEye = new THREE.Mesh(eyeGeo, this.eyeMat);
    rightEye.position.set(0.2, 1.78, 0.65);
    rabbit.add(leftEye, rightEye);

    // Mũi hồng
    const noseGeo = new THREE.ConeGeometry(0.05, 0.07, 4);
    noseGeo.rotateX(Math.PI * 0.5);
    const nose = new THREE.Mesh(noseGeo, this.rabbitPinkMat);
    nose.position.set(0, 1.68, 0.75);
    rabbit.add(nose);

    // Đôi tai
    const earGeo = new THREE.CylinderGeometry(0.07, 0.14, 0.95, 8);
    earGeo.scale(0.6, 1, 1.2);
    const leftEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    leftEar.position.set(-0.2, 2.45, 0.12);
    leftEar.rotation.z = -0.16;

    const rightEar = new THREE.Mesh(earGeo, this.rabbitFurMat);
    rightEar.position.set(0.2, 2.45, 0.12);
    rightEar.rotation.z = 0.16;
    rabbit.add(leftEar, rightEar);

    // Đuôi
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), this.rabbitFurMat);
    tail.position.set(0, 0.45, -0.75);
    rabbit.add(tail);

    // Cối ngọc
    const mortar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.55, 16), this.mortarMat);
    mortar.position.set(0.1, 0.28, 1.15);
    mortar.castShadow = true;
    rabbit.add(mortar);

    // Chày
    const pestle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.75, 8), this.mortarMat);
    pestle.position.set(0.1, 0.68, 1.15);
    pestle.rotation.z = 0.2;
    rabbit.add(pestle);

    this.group.add(rabbit);
    this.mainRabbit = rabbit;
    this.mainRabbitEars = [leftEar, rightEar];
    this.interactiveObjects.push(rabbit);
  }

  createBabyRabbit() {
    const baby = new THREE.Group();
    baby.position.set(-0.8, 0.4, 4.4);
    baby.rotation.y = -Math.PI * 0.1;
    baby.scale.setScalar(0.55);
    baby.name = 'BabyRabbit';

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), this.rabbitFurMat);
    body.position.y = 0.55;
    body.castShadow = true;
    baby.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), this.rabbitFurMat);
    head.position.set(0, 1.35, 0.18);
    head.castShadow = true;
    baby.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeL.position.set(-0.18, 1.45, 0.58);
    const eyeR = new THREE.Mesh(eyeGeo, this.eyeMat);
    eyeR.position.set(0.18, 1.45, 0.58);
    baby.add(eyeL, eyeR);

    const earGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.75, 8);
    const earL = new THREE.Mesh(earGeo, this.rabbitFurMat);
    earL.position.set(-0.16, 1.95, 0.1);
    earL.rotation.z = -0.22;
    const earR = new THREE.Mesh(earGeo, this.rabbitFurMat);
    earR.position.set(0.16, 1.95, 0.1);
    earR.rotation.z = 0.22;
    baby.add(earL, earR);

    this.group.add(baby);
    this.babyRabbit = baby;
    this.interactiveObjects.push(baby);
  }

  createRestingBuffalo() {
    const buffalo = new THREE.Group();
    buffalo.position.set(-4.5, 0.2, 1.2);
    buffalo.rotation.y = Math.PI * 0.2;
    buffalo.scale.setScalar(1.1);
    buffalo.name = 'Buffalo';

    const bodyGeo = new THREE.SphereGeometry(1.3, 14, 10);
    bodyGeo.scale(1.3, 0.72, 0.85);
    const body = new THREE.Mesh(bodyGeo, this.buffaloMat);
    body.position.y = 0.55;
    body.castShadow = true;
    buffalo.add(body);

    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 1.0);
    const head = new THREE.Mesh(headGeo, this.buffaloMat);
    head.position.set(1.35, 0.85, 0);
    head.rotation.z = -0.15;
    head.castShadow = true;
    buffalo.add(head);

    // Sừng trâu
    const hornCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 1.1, 0.3),
      new THREE.Vector3(1.0, 1.7, 0.6),
      new THREE.Vector3(0.5, 1.8, 0.4)
    ]);
    const hornL = new THREE.Mesh(new THREE.TubeGeometry(hornCurveL, 8, 0.1, 6, false), this.hornMat);

    const hornCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 1.1, -0.3),
      new THREE.Vector3(1.0, 1.7, -0.6),
      new THREE.Vector3(0.5, 1.8, -0.4)
    ]);
    const hornR = new THREE.Mesh(new THREE.TubeGeometry(hornCurveR, 8, 0.1, 6, false), this.hornMat);
    buffalo.add(hornL, hornR);

    this.group.add(buffalo);
    this.buffalo = buffalo;
    this.buffaloHead = head;
    this.interactiveObjects.push(buffalo);
  }

  triggerHop(targetMesh) {
    let target = this.mainRabbit;
    if (targetMesh && targetMesh.name === 'BabyRabbit') {
      target = this.babyRabbit;
    }

    const startY = target.position.y;
    let progress = 0;
    const hopAnimation = () => {
      progress += 0.08;
      if (progress <= Math.PI) {
        target.position.y = startY + Math.sin(progress) * 0.8;
        requestAnimationFrame(hopAnimation);
      } else {
        target.position.y = startY;
      }
    };
    hopAnimation();
  }

  update(time) {
    if (this.mainRabbit) {
      const breath = Math.sin(time * 3) * 0.02;
      this.mainRabbit.scale.set(1 + breath, 1 - breath * 0.5, 1 + breath);
      if (this.mainRabbitEars) {
        const earTwitch = Math.sin(time * 4) * 0.05;
        this.mainRabbitEars[0].rotation.z = -0.16 + earTwitch;
        this.mainRabbitEars[1].rotation.z = 0.16 - earTwitch;
      }
    }

    if (this.babyRabbit) {
      this.babyRabbit.rotation.y = -Math.PI * 0.1 + Math.sin(time * 2) * 0.08;
    }

    if (this.buffaloHead) {
      this.buffaloHead.rotation.x = Math.sin(time * 1.5) * 0.05;
    }
  }
}
