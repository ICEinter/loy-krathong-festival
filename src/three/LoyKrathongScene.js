import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class LoyKrathongScene {
  constructor(container, options = {}) {
    this.container = container;
    this.onSelectKrathong = options.onSelectKrathong || (() => {});
    this.krathongObjects = new Map(); // id -> THREE.Group (contestants)
    this.krathongData = new Map(); // id -> contestant data
    this.simulatedKrathongs = []; // Array of ambient dummy krathongs
    this.myKrathongId = options.myKrathongId || null;
    this.peopleObjects = [];
    this.skyLanterns = [];
    this.fireflies = null;
    this.stringLights = [];
    this.isDisposed = false;
    this.clock = new THREE.Clock();

    // Procedural textures
    this.waterNormalTexture = this.generateWaterNormalTexture();
    this.moonTexture = this.generateMoonTexture();
    this.rippleTexture = this.generateRippleTexture();

    this.initScene();
    this.initLights();
    this.initStars();
    this.initMoon();
    this.initRiver();
    this.initLandscape();
    this.initThaiArchitecture();
    this.initFestiveLighting();
    this.initPeople();
    this.initSkyLanterns();
    this.initSimulatedKrathongs(); // 35 ambient dummy krathongs (กระทงจำลอง)
    this.initFireflies();
    this.initRaycaster();
    this.animate();

    window.addEventListener('resize', this.onWindowResize);
  }

  // --- Fast Procedural Textures ---
  generateWaterNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(256, 256);

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const u = (x / 256) * Math.PI * 8;
        const v = (y / 256) * Math.PI * 8;
        const dx = (Math.cos(u * 2) * 35) + 128;
        const dy = (Math.sin(v * 2) * 35) + 128;

        const idx = (y * 256 + x) * 4;
        imgData.data[idx] = dx;
        imgData.data[idx + 1] = dy;
        imgData.data[idx + 2] = 245;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 3);
    return texture;
  }

  generateMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fdf8e2';
    ctx.fillRect(0, 0, 256, 256);

    const maria = [
      { x: 90, y: 80, r: 42, color: 'rgba(180, 170, 140, 0.35)' },
      { x: 140, y: 110, r: 50, color: 'rgba(170, 160, 130, 0.38)' },
      { x: 110, y: 160, r: 35, color: 'rgba(165, 155, 125, 0.32)' }
    ];

    maria.forEach(m => {
      const grad = ctx.createRadialGradient(m.x, m.y, m.r * 0.1, m.x, m.y, m.r);
      grad.addColorStop(0, m.color);
      grad.addColorStop(1, 'rgba(253, 248, 226, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  generateRippleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 8, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 230, 150, 0.4)');
    grad.addColorStop(0.5, 'rgba(255, 215, 0, 0.18)');
    grad.addColorStop(0.85, 'rgba(100, 200, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Helper to generate floating Name Tag Sprite above Krathong
  createNameTagSprite(name, isMyKrathong = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Rounded Box
    const x = 16, y = 16, w = 480, h = 128, r = 28;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    if (isMyKrathong) {
      // Radiant Gold Theme for MY Krathong
      ctx.fillStyle = 'rgba(24, 18, 5, 0.92)';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();

      // Crown / "กระทงของคุณ" Badge
      ctx.font = 'bold 30px "Prompt", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText('👑 กระทงของคุณ', 256, 62);

      // Owner Name
      ctx.font = 'bold 38px "Prompt", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name || 'ผู้เข้าประกวด', 256, 114);
    } else {
      // Sleek Glassmorphism Theme for other contestants
      ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Owner Name
      ctx.font = 'bold 42px "Prompt", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(name || 'ผู้เข้าประกวด', 256, 88);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMat);
    // Proportions
    sprite.scale.set(3.4, 1.05, 1);
    sprite.position.y = isMyKrathong ? 2.6 : 2.3;
    return sprite;
  }

  // --- Analytical Gerstner-like River Wave Function ---
  getWaterHeightAndNormal(x, z, time) {
    const w1_k = 0.12;
    const w1_s = 1.4;
    const w1_a = 0.13;
    const arg1 = w1_k * x + w1_s * time;
    const h1 = Math.sin(arg1) * w1_a;
    const dh1_dx = Math.cos(arg1) * w1_k * w1_a;

    const w2_k = 0.16;
    const w2_s = 1.1;
    const w2_a = 0.08;
    const arg2 = w2_k * z + w2_s * time;
    const h2 = Math.cos(arg2) * w2_a;
    const dh2_dz = -Math.sin(arg2) * w2_k * w2_a;

    const height = h1 + h2;
    const slopeX = dh1_dx;
    const slopeZ = dh2_dz;

    return { height, slopeX, slopeZ };
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040814);
    this.scene.fog = new THREE.FogExp2(0x071126, 0.014);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 300);
    this.camera.position.set(0, 16, 36);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      precision: 'mediump'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.rotateSpeed = 0.75;
    this.controls.maxPolarAngle = Math.PI / 2.06;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 65;
    this.controls.target.set(0, 0.8, 0);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x1a2e4a, 0.95);
    this.scene.add(ambientLight);

    this.moonLight = new THREE.DirectionalLight(0xfff6dd, 2.2);
    this.moonLight.position.set(-35, 55, -45);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.camera.near = 15;
    this.moonLight.shadow.camera.far = 150;
    this.moonLight.shadow.camera.left = -45;
    this.moonLight.shadow.camera.right = 45;
    this.moonLight.shadow.camera.top = 45;
    this.moonLight.shadow.camera.bottom = -45;
    this.scene.add(this.moonLight);

    const bankWarmLight = new THREE.PointLight(0xff9e2c, 2.4, 55, 1.3);
    bankWarmLight.position.set(0, 7, -11);
    this.scene.add(bankWarmLight);

    const bankWarmLight2 = new THREE.PointLight(0xff851b, 1.8, 50, 1.3);
    bankWarmLight2.position.set(-24, 6, -14);
    this.scene.add(bankWarmLight2);

    const bankWarmLight3 = new THREE.PointLight(0xffaa33, 1.8, 50, 1.3);
    bankWarmLight3.position.set(24, 6, -14);
    this.scene.add(bankWarmLight3);

    this.activeFocusLight = new THREE.PointLight(0xffb703, 0, 12, 1.5);
    this.scene.add(this.activeFocusLight);
  }

  initStars() {
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5;

      const r = 180 + Math.random() * 30;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) + 15;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      fog: false
    });

    this.starField = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starField);
  }

  initMoon() {
    const moonGeo = new THREE.SphereGeometry(5.2, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      map: this.moonTexture,
      fog: false
    });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.position.set(-42, 58, -65);
    this.scene.add(this.moon);

    const halo1Geo = new THREE.RingGeometry(5.3, 14, 32);
    const halo1Mat = new THREE.MeshBasicMaterial({
      color: 0xffe899,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      fog: false
    });
    const halo1 = new THREE.Mesh(halo1Geo, halo1Mat);
    halo1.position.copy(this.moon.position);
    halo1.lookAt(0, 16, 36);
    this.scene.add(halo1);
  }

  initRiver() {
    const waterGeo = new THREE.PlaneGeometry(180, 100, 48, 48);

    this.waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x051a33,
      emissive: 0x020814,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      normalMap: this.waterNormalTexture,
      normalScale: new THREE.Vector2(0.35, 0.35),
      side: THREE.DoubleSide
    });

    this.water = new THREE.Mesh(waterGeo, this.waterMat);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.set(0, 0, 6);
    this.water.receiveShadow = true;
    this.scene.add(this.water);

    this.waterOrigPos = waterGeo.attributes.position.clone();
  }

  initLandscape() {
    const bankGeo = new THREE.BoxGeometry(180, 5, 38);
    const bankMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      roughness: 0.85
    });
    const bank = new THREE.Mesh(bankGeo, bankMat);
    bank.position.set(0, 2.5, -23);
    bank.receiveShadow = true;
    this.scene.add(bank);

    for (let i = 0; i < 4; i++) {
      const stepGeo = new THREE.BoxGeometry(75, 0.6, 2.4);
      const stepMat = new THREE.MeshStandardMaterial({
        color: 0x273449,
        roughness: 0.7
      });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(0, 2.5 - i * 0.55, -4.5 + i * 1.8);
      step.receiveShadow = true;
      this.scene.add(step);
    }

    const lampPositions = [-45, -30, -15, 0, 15, 30, 45];
    const poleGeo = new THREE.CylinderGeometry(0.14, 0.18, 4.8, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x61381c, roughness: 0.6 });
    const lampGeo = new THREE.OctahedronGeometry(0.55, 0);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });

    lampPositions.forEach((xPos) => {
      const post = new THREE.Group();
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.4;
      post.add(pole);

      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.y = 4.9;
      lamp.scale.set(1, 1.3, 1);
      post.add(lamp);

      post.position.set(xPos, 5, -8.5);
      this.scene.add(post);
    });
  }

  initThaiArchitecture() {
    const chedi = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffcc33,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0x664400,
      emissiveIntensity: 0.35
    });

    const baseTiers = [
      { r: 8.5, h: 1.6, y: 0.8 },
      { r: 7.2, h: 1.4, y: 2.3 },
      { r: 6.0, h: 1.3, y: 3.65 },
      { r: 5.0, h: 1.1, y: 4.85 }
    ];
    baseTiers.forEach(tier => {
      const bGeo = new THREE.CylinderGeometry(tier.r * 0.92, tier.r, tier.h, 16);
      const bMesh = new THREE.Mesh(bGeo, goldMat);
      bMesh.position.y = tier.y;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      chedi.add(bMesh);
    });

    const bellGeo = new THREE.SphereGeometry(4.4, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const bellMesh = new THREE.Mesh(bellGeo, goldMat);
    bellMesh.position.y = 5.4;
    bellMesh.scale.set(1, 1.3, 1);
    bellMesh.castShadow = true;
    chedi.add(bellMesh);

    const spireGeo = new THREE.ConeGeometry(0.8, 9, 16);
    const spire = new THREE.Mesh(spireGeo, goldMat);
    spire.position.y = 15.5;
    spire.castShadow = true;
    chedi.add(spire);

    chedi.position.set(-32, 5, -28);
    this.scene.add(chedi);

    const thaiHouse = this.createAuthenticThaiHouse();
    thaiHouse.position.set(24, 5, -26);
    this.scene.add(thaiHouse);

    const sala = this.createOrnateSala();
    sala.position.set(0, 5, -17);
    this.scene.add(sala);
  }

  createAuthenticThaiHouse() {
    const house = new THREE.Group();
    const teakMat = new THREE.MeshStandardMaterial({ color: 0x4a2411, roughness: 0.65 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xa33420, roughness: 0.45, metalness: 0.15 });

    for (let x = -4; x <= 4; x += 4) {
      for (let z = -3; z <= 3; z += 3) {
        const stiltGeo = new THREE.CylinderGeometry(0.2, 0.24, 3.2, 8);
        const stilt = new THREE.Mesh(stiltGeo, teakMat);
        stilt.position.set(x, 1.6, z);
        stilt.castShadow = true;
        house.add(stilt);
      }
    }

    const deckGeo = new THREE.BoxGeometry(11, 0.5, 9);
    const deck = new THREE.Mesh(deckGeo, teakMat);
    deck.position.y = 3.3;
    deck.receiveShadow = true;
    house.add(deck);

    const roomGeo = new THREE.BoxGeometry(9, 4, 6.5);
    const room = new THREE.Mesh(roomGeo, teakMat);
    room.position.y = 5.5;
    room.castShadow = true;
    house.add(room);

    const roofGeo = new THREE.ConeGeometry(8, 5, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 9.5;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.35, 0.95, 1.15);
    roof.castShadow = true;
    house.add(roof);

    return house;
  }

  createOrnateSala() {
    const sala = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a2d13, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb94025, roughness: 0.45 });

    const posts = [[-2.8, -2.2], [2.8, -2.2], [-2.8, 2.2], [2.8, 2.2]];
    posts.forEach(([x, z]) => {
      const pGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.0, 8);
      const pillar = new THREE.Mesh(pGeo, woodMat);
      pillar.position.set(x, 2.0, z);
      pillar.castShadow = true;
      sala.add(pillar);
    });

    const roofGeo = new THREE.ConeGeometry(4.8, 3.0, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 5.0;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    sala.add(roof);

    return sala;
  }

  initFestiveLighting() {
    const colors = [0xff3366, 0x33ccff, 0xffcc00, 0x33ff66, 0xff6600, 0xcc33ff];
    const lightCount = 36;
    const bulbGeo = new THREE.SphereGeometry(0.16, 6, 6);

    for (let i = 0; i < lightCount; i++) {
      const t = i / (lightCount - 1);
      const x = -48 + t * 96;
      const y = 6.8 - Math.sin(t * Math.PI) * 1.5;
      const z = -9.5;

      const bulbColor = colors[i % colors.length];
      const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, y, z);
      this.scene.add(bulb);
      this.stringLights.push(bulb);
    }
  }

  initPeople() {
    const attireColors = [
      0xe11d48, 0x2563eb, 0x059669, 0xd97706, 0x7c3aed,
      0xdb2777, 0x0891b2, 0xea580c, 0x0d9488, 0x4f46e5
    ];

    const headGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.95, 8);
    const legGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.6, 6);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.75 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    for (let i = 0; i < 20; i++) {
      const person = new THREE.Group();
      const suitMat = new THREE.MeshStandardMaterial({
        color: attireColors[i % attireColors.length],
        roughness: 0.65
      });

      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.65;
      person.add(head);

      const body = new THREE.Mesh(bodyGeo, suitMat);
      body.position.y = 1.05;
      person.add(body);

      const legL = new THREE.Mesh(legGeo, pantsMat);
      legL.position.set(-0.13, 0.3, 0);
      person.add(legL);

      const legR = legL.clone();
      legR.position.set(0.13, 0.3, 0);
      person.add(legR);

      const x = -40 + Math.random() * 80;
      const z = -7 - Math.random() * 10;
      person.position.set(x, 5, z);

      person.userData = {
        baseX: x,
        baseZ: z,
        walkSpeed: 0.45 + Math.random() * 0.55,
        walkRange: 5 + Math.random() * 7,
        direction: Math.random() > 0.5 ? 1 : -1,
        bobOffset: Math.random() * Math.PI * 2
      };

      this.scene.add(person);
      this.peopleObjects.push(person);
    }
  }

  initSkyLanterns() {
    const lanternGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.85, 8);
    const lanternMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.9
    });

    for (let i = 0; i < 30; i++) {
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      const x = -48 + Math.random() * 96;
      const y = 8 + Math.random() * 45;
      const z = -45 + Math.random() * 50;
      lantern.position.set(x, y, z);

      lantern.userData = {
        floatSpeed: 0.25 + Math.random() * 0.3,
        driftX: (Math.random() - 0.5) * 0.15,
        driftZ: (Math.random() - 0.5) * 0.15
      };

      this.scene.add(lantern);
      this.skyLanterns.push(lantern);
    }
  }

  // --- 3. เพิ่มกระทงจำลอง (Simulated / Ambient Krathongs - No data needed) ---
  initSimulatedKrathongs() {
    const colors = [
      '#22c55e', '#ec4899', '#eab308', '#3b82f6', '#8b5cf6',
      '#f97316', '#10b981', '#06b6d4', '#f43f5e', '#a855f7'
    ];

    // Create 35 simulated background floating krathongs
    for (let i = 0; i < 35; i++) {
      const color = colors[i % colors.length];
      const dummyContestant = {
        id: `simulated-${i}`,
        name: '',
        color: color,
        isSimulated: true
      };

      const krathong = this.createKrathongModel(dummyContestant, false);
      
      // Distribute across the river
      const x = -48 + Math.random() * 96;
      const z = 2.5 + Math.random() * 26;
      krathong.userData.baseX = x;
      krathong.userData.baseZ = z;
      krathong.position.set(x, 0, z);

      this.scene.add(krathong);
      this.simulatedKrathongs.push(krathong);
    }
  }

  initFireflies() {
    const count = 80;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = -42 + Math.random() * 84;
      positions[i * 3 + 1] = 0.5 + Math.random() * 5;
      positions[i * 3 + 2] = -10 + Math.random() * 30;

      speeds.push({
        origX: positions[i * 3],
        origY: positions[i * 3 + 1],
        origZ: positions[i * 3 + 2],
        freq: 1.5 + Math.random() * 2.0,
        amp: 0.8 + Math.random() * 1.2
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xc6ff00,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.fireflies = new THREE.Points(geo, mat);
    this.fireflySpeeds = speeds;
    this.scene.add(this.fireflies);
  }

  // --- Create Krathong Model (Handles Contestants & My Krathong Beacon) ---
  createKrathongModel(contestant, isMyKrathong = false) {
    const krathongGroup = new THREE.Group();
    krathongGroup.name = contestant.id;

    const baseColorHex = contestant.color || '#22c55e';
    const primaryColor = new THREE.Color(baseColorHex);

    // 1. Water Ripple Ring
    const rippleGeo = new THREE.PlaneGeometry(isMyKrathong ? 4.2 : 3.2, isMyKrathong ? 4.2 : 3.2);
    const rippleMat = new THREE.MeshBasicMaterial({
      map: this.rippleTexture,
      transparent: true,
      opacity: isMyKrathong ? 0.85 : 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = 0.04;
    krathongGroup.add(ripple);

    // 2. Banana Stem Base
    const baseGeo = new THREE.CylinderGeometry(1.25, 1.3, 0.42, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.75
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.21;
    krathongGroup.add(baseMesh);

    // 3. Multi-Tiered Petals
    const tier1Count = 14;
    const petalGeo1 = new THREE.ConeGeometry(0.36, 1.2, 4);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.45,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < tier1Count; i++) {
      const angle = (i / tier1Count) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo1, tier1Mat);
      petal.position.set(Math.cos(angle) * 1.25, 0.46, Math.sin(angle) * 1.25);
      petal.rotation.y = -angle;
      petal.rotation.x = 0.55;
      petal.scale.set(1.1, 1, 0.28);
      krathongGroup.add(petal);
    }

    const tier2Count = 9;
    const petalGeo2 = new THREE.ConeGeometry(0.28, 0.9, 4);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: primaryColor.clone().offsetHSL(0.05, 0.1, 0.15),
      roughness: 0.4,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < tier2Count; i++) {
      const angle = (i / tier2Count) * Math.PI * 2 + 0.25;
      const petal = new THREE.Mesh(petalGeo2, tier2Mat);
      petal.position.set(Math.cos(angle) * 0.85, 0.5, Math.sin(angle) * 0.85);
      petal.rotation.y = -angle;
      petal.rotation.x = 0.42;
      petal.scale.set(1, 0.9, 0.25);
      krathongGroup.add(petal);
    }

    // 4. Marigold Flower Center
    const marigoldGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const marigoldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.55,
      emissive: 0x4a3a00,
      emissiveIntensity: 0.25
    });
    const marigold = new THREE.Mesh(marigoldGeo, marigoldMat);
    marigold.position.set(0, 0.55, 0);
    marigold.scale.set(1.2, 0.5, 1.2);
    krathongGroup.add(marigold);

    // 5. Incense Sticks
    const stickMat = new THREE.MeshBasicMaterial({ color: 0x7f1d1d });
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });

    for (let s = -1; s <= 1; s++) {
      const stickGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.3, 4);
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.set(s * 0.1 - 0.2, 1.0, 0.1);
      stick.rotation.z = s * 0.08;
      krathongGroup.add(stick);

      const emberGeo = new THREE.SphereGeometry(0.03, 4, 4);
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(s * 0.1 - 0.2, 1.65, 0.1);
      krathongGroup.add(ember);
    }

    // 6. Candle Body
    const candleGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.9, 8);
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      roughness: 0.3
    });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(0.16, 0.9, -0.08);
    krathongGroup.add(candle);

    // 7. Luminous Glowing Candle Flame
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0.16, 1.5, -0.08);

    const outerFlameGeo = new THREE.ConeGeometry(0.085, 0.35, 8);
    const outerFlameMat = new THREE.MeshBasicMaterial({ color: isMyKrathong ? 0xffea00 : 0xffcc00 });
    const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    flameGroup.add(outerFlame);

    const innerFlameGeo = new THREE.ConeGeometry(0.04, 0.2, 6);
    const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlame.position.y = -0.04;
    flameGroup.add(innerFlame);

    const flameHaloGeo = new THREE.PlaneGeometry(0.75, 0.75);
    const flameHaloMat = new THREE.MeshBasicMaterial({
      map: this.rippleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const flameHalo = new THREE.Mesh(flameHaloGeo, flameHaloMat);
    flameGroup.add(flameHalo);

    krathongGroup.add(flameGroup);

    // --- 2. สัญลักษณ์พิเศษเฉพาะกระทงของเรา (Pillar of Light & Floating Name Tag) ---
    if (!contestant.isSimulated && contestant.name) {
      // Add floating Name Tag Sprite
      const nameSprite = this.createNameTagSprite(contestant.name, isMyKrathong);
      krathongGroup.add(nameSprite);

      // If this is OUR krathong, add prominent celestial light pillar!
      if (isMyKrathong) {
        // Vertical glowing beacon of golden light
        const beamGeo = new THREE.CylinderGeometry(0.25, 0.65, 16, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const lightBeam = new THREE.Mesh(beamGeo, beamMat);
        lightBeam.position.set(0.16, 8.5, -0.08);
        krathongGroup.add(lightBeam);

        // Rotating golden indicator ring
        const ringGeo = new THREE.RingGeometry(1.6, 1.85, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.08;
        krathongGroup.add(ring);
        krathongGroup.userData.indicatorRing = ring;
      }
    }

    // Raycast Bounding Hitbox (Only for real contestant krathongs, NOT simulated)
    if (!contestant.isSimulated) {
      const hitGeo = new THREE.SphereGeometry(1.8, 6, 6);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.y = 0.7;
      hit.userData = { isKrathongHitbox: true, contestantId: contestant.id };
      krathongGroup.add(hit);
    }

    // Physics Attributes
    krathongGroup.userData = {
      ...krathongGroup.userData,
      id: contestant.id,
      isSimulated: !!contestant.isSimulated,
      isMyKrathong: isMyKrathong,
      flameGroup: flameGroup,
      flameHalo: flameHalo,
      rippleMesh: ripple,
      baseX: contestant.initialPos?.x ?? (Math.random() * 60 - 30),
      baseZ: contestant.initialPos?.z ?? (Math.random() * 24 + 3),
      driftSpeed: 0.15 + Math.random() * 0.18,
      wobbleSeed: Math.random() * 1000,
      flickerOffset: Math.random() * Math.PI * 2
    };

    krathongGroup.position.set(
      krathongGroup.userData.baseX,
      0,
      krathongGroup.userData.baseZ
    );

    return krathongGroup;
  }

  // Set Contestants & update 'My Krathong' indicator
  setContestants(contestants, myKrathongId = null) {
    this.myKrathongId = myKrathongId;
    const currentIds = new Set(contestants.map(c => c.id));

    // Remove obsolete
    for (const [id, group] of this.krathongObjects.entries()) {
      if (!currentIds.has(id)) {
        this.scene.remove(group);
        this.krathongObjects.delete(id);
        this.krathongData.delete(id);
      }
    }

    // Add or update
    contestants.forEach(contestant => {
      this.krathongData.set(contestant.id, contestant);
      const isMyKrathong = contestant.id === this.myKrathongId;

      // If exists but status changed, rebuild to attach/detach beacon
      if (this.krathongObjects.has(contestant.id)) {
        const existing = this.krathongObjects.get(contestant.id);
        if (existing.userData.isMyKrathong !== isMyKrathong) {
          this.scene.remove(existing);
          const krathongGroup = this.createKrathongModel(contestant, isMyKrathong);
          this.scene.add(krathongGroup);
          this.krathongObjects.set(contestant.id, krathongGroup);
        }
      } else {
        const krathongGroup = this.createKrathongModel(contestant, isMyKrathong);
        this.scene.add(krathongGroup);
        this.krathongObjects.set(contestant.id, krathongGroup);
      }
    });
  }

  launchNewKrathong(newContestant, isMyKrathong = true) {
    this.krathongData.set(newContestant.id, newContestant);
    this.myKrathongId = newContestant.id;
    const krathongGroup = this.createKrathongModel(newContestant, isMyKrathong);

    krathongGroup.position.set(0, 2.0, -3.5);
    krathongGroup.userData.isLaunching = true;
    krathongGroup.userData.launchProgress = 0;

    this.scene.add(krathongGroup);
    this.krathongObjects.set(newContestant.id, krathongGroup);

    this.focusOnPosition(0, 0.8, 5);
  }

  focusOnPosition(x, y, z) {
    if (!this.controls) return;
    const startTarget = this.controls.target.clone();
    const endTarget = new THREE.Vector3(x, y, z);
    let progress = 0;

    const animateFocus = () => {
      progress += 0.05;
      this.controls.target.lerpVectors(startTarget, endTarget, Math.min(progress, 1));
      if (progress < 1) {
        requestAnimationFrame(animateFocus);
      }
    };
    animateFocus();
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);

      if (clientX === undefined || clientY === undefined) return;

      this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      for (let hit of intersects) {
        if (hit.object.userData && hit.object.userData.isKrathongHitbox) {
          const contestantId = hit.object.userData.contestantId;
          const contestant = this.krathongData.get(contestantId);
          if (contestant) {
            this.onSelectKrathong(contestant);
            const group = this.krathongObjects.get(contestantId);
            if (group) {
              this.focusOnPosition(group.position.x, 0.8, group.position.z);
              if (this.activeFocusLight) {
                this.activeFocusLight.position.set(group.position.x, 2, group.position.z);
                this.activeFocusLight.intensity = 2.0;
              }
            }
            break;
          }
        }
      }
    };

    this.renderer.domElement.addEventListener('click', onPointerDown);
    this.renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
  }

  onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // --- Animation Loop ---
  animate = () => {
    if (this.isDisposed) return;
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Water Ripple Normal Flow
    if (this.waterNormalTexture) {
      this.waterNormalTexture.offset.x = (elapsedTime * 0.02) % 1;
      this.waterNormalTexture.offset.y = (elapsedTime * 0.015) % 1;
    }

    // Helper to animate any krathong group
    const updateKrathongPhysics = (group) => {
      const uData = group.userData;

      if (uData.isLaunching) {
        uData.launchProgress += delta * 0.85;
        const progress = Math.min(uData.launchProgress, 1);
        group.position.y = THREE.MathUtils.lerp(2.0, 0.05, progress);
        group.position.z = THREE.MathUtils.lerp(-3.5, 5.0, progress);

        if (progress >= 1) {
          uData.isLaunching = false;
          uData.baseX = group.position.x;
          uData.baseZ = group.position.z;
        }
      } else {
        uData.baseX += uData.driftSpeed * delta;
        if (uData.baseX > 48) {
          uData.baseX = -48;
        }
        group.position.x = uData.baseX;

        const wave = this.getWaterHeightAndNormal(group.position.x, uData.baseZ, elapsedTime);
        group.position.y = wave.height;

        const targetPitch = -wave.slopeZ * 0.8;
        const targetRoll = wave.slopeX * 0.8;
        const inertiaWobble = Math.sin(elapsedTime * 3.0 + uData.wobbleSeed) * 0.02;

        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetPitch + inertiaWobble, 0.08);
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRoll + inertiaWobble, 0.08);
        group.rotation.y += delta * 0.035;
      }

      if (uData.flameGroup) {
        const flicker = Math.sin(elapsedTime * 15 + uData.flickerOffset) * 0.15;
        uData.flameGroup.scale.set(1 + flicker * 0.2, 1 + flicker, 1 + flicker * 0.2);
      }

      if (uData.rippleMesh) {
        const pulse = 1 + Math.sin(elapsedTime * 2.2 + uData.wobbleSeed) * 0.1;
        uData.rippleMesh.scale.set(pulse, pulse, pulse);
      }

      if (uData.indicatorRing) {
        uData.indicatorRing.rotation.z += delta * 0.8;
      }
    };

    // 2. Animate Contestant Krathongs
    for (const [id, group] of this.krathongObjects.entries()) {
      updateKrathongPhysics(group);
    }

    // 3. Animate Simulated Background Krathongs (กระทงจำลอง)
    this.simulatedKrathongs.forEach(group => {
      updateKrathongPhysics(group);
    });

    // 4. Fireflies Hover
    if (this.fireflies && this.fireflySpeeds) {
      const posAttr = this.fireflies.geometry.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const s = this.fireflySpeeds[i];
        const newX = s.origX + Math.sin(elapsedTime * s.freq) * s.amp;
        const newY = s.origY + Math.cos(elapsedTime * s.freq * 1.3) * (s.amp * 0.4);
        const newZ = s.origZ + Math.sin(elapsedTime * s.freq * 0.8) * s.amp;

        posAttr.setXYZ(i, newX, newY, newZ);
      }
      posAttr.needsUpdate = true;
    }

    // 5. Festival People Walking
    this.peopleObjects.forEach(person => {
      const pData = person.userData;
      person.position.x += pData.walkSpeed * pData.direction * delta;

      if (person.position.x > pData.baseX + pData.walkRange) {
        pData.direction = -1;
        person.rotation.y = -Math.PI / 2;
      } else if (person.position.x < pData.baseX - pData.walkRange) {
        pData.direction = 1;
        person.rotation.y = Math.PI / 2;
      }

      person.position.y = 5 + Math.abs(Math.sin(elapsedTime * 4.5 + pData.bobOffset)) * 0.08;
    });

    // 6. Sky Lanterns
    this.skyLanterns.forEach(lantern => {
      const lData = lantern.userData;
      lantern.position.y += lData.floatSpeed * delta;
      lantern.position.x += lData.driftX * delta;
      lantern.position.z += lData.driftZ * delta;

      if (lantern.position.y > 60) {
        lantern.position.y = 7;
        lantern.position.x = -48 + Math.random() * 96;
        lantern.position.z = -45 + Math.random() * 50;
      }
    });

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.isDisposed = true;
    window.removeEventListener('resize', this.onWindowResize);
    if (this.controls) this.controls.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
