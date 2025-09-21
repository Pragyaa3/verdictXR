// --- CourtroomControls from newCourtfrontend ---
class CourtroomControls {
  renderer: any;
  scene: any;
  camera: any;
  controllers: any[] = [];
  intersected: any[] = [];
  tempMatrix: any = new THREE.Matrix4();
  raycaster: any = new THREE.Raycaster();
  intersectObjects: any[] = [];
  teleportMarkers: any[] = [];

  constructor(renderer: any, scene: any, camera: any, vrButtonContainer: HTMLElement | null) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.setupWebXR(vrButtonContainer);
    this.setupControllers();
    this.setupTeleportation();
    this.setupInteractions();
  }

  setupWebXR(vrButtonContainer: HTMLElement | null) {
    this.renderer.xr.enabled = true;
    if (vrButtonContainer) {
      const vrButton = VRButton.createButton(this.renderer);
      vrButton.id = 'VRButton';
      vrButtonContainer.appendChild(vrButton);
    }
  }

  setupControllers() {
    const controller1 = this.renderer.xr.getController(0);
    controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller1.addEventListener('selectend', this.onSelectEnd.bind(this));
    controller1.userData.isSelecting = false;
    this.scene.add(controller1);

    const controller2 = this.renderer.xr.getController(1);
    controller2.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller2.addEventListener('selectend', this.onSelectEnd.bind(this));
    controller2.userData.isSelecting = false;
    this.scene.add(controller2);

    this.controllers.push(controller1, controller2);

    // Controller rays
    this.controllers.forEach(controller => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
      line.name = 'line';
      line.scale.z = 5;
      controller.add(line);
    });
  }

  setupTeleportation() {
    this.teleportMarkers = [];
    const markerGeometry = new THREE.RingGeometry(0.5, 0.7, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    const teleportPositions = [
      { x: 0, z: 10 },
      { x: -8, z: 0 },
      { x: 8, z: 0 },
      { x: 0, z: -5 },
      { x: -6, z: -2 },
      { x: 6, z: -2 },
    ];
    teleportPositions.forEach(pos => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(pos.x, 0.01, pos.z);
      marker.rotation.x = -Math.PI / 2;
      marker.userData.isTeleportMarker = true;
      marker.userData.teleportPosition = new THREE.Vector3(pos.x, 1.6, pos.z);
      marker.visible = false;
      this.scene.add(marker);
      this.teleportMarkers.push(marker);
      this.intersectObjects.push(marker);
    });
  }

  setupInteractions() {
    this.scene.traverse((child: any) => {
      if (child.isMesh && (
        child.material.color?.getHex() === 0x8B4513 ||
        child.material.color?.getHex() === 0x654321 ||
        child.material.color?.getHex() === 0xFFD700
      )) {
        child.userData.isInteractive = true;
        this.intersectObjects.push(child);
      }
    });
  }

  onSelectStart(event: any) {
    const controller = event.target;
    controller.userData.isSelecting = true;
    this.teleportMarkers.forEach(marker => { marker.visible = true; });
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    const intersects = this.raycaster.intersectObjects(this.intersectObjects);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (intersect.object.userData.isTeleportMarker) {
        this.teleportToPosition(intersect.object.userData.teleportPosition);
      } else if (intersect.object.userData.isInteractive) {
        this.interactWithObject(intersect.object);
      }
    }
  }

  onSelectEnd(event: any) {
    const controller = event.target;
    controller.userData.isSelecting = false;
    this.teleportMarkers.forEach(marker => { marker.visible = false; });
  }

  teleportToPosition(position: any) {
    const camera = this.renderer.xr.getCamera();
    const offset = new THREE.Vector3();
    offset.copy(position);
    offset.sub(camera.position);
    const referenceSpace = this.renderer.xr.getReferenceSpace();
    if (referenceSpace) {
      const offsetTransform = new (window as any).XRRigidTransform(
        { x: offset.x, y: offset.y, z: offset.z }
      );
      this.renderer.xr.setReferenceSpace(
        referenceSpace.getOffsetReferenceSpace(offsetTransform)
      );
    }
    this.createTeleportEffect(position);
  }

  createTeleportEffect(position: any) {
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = position.x + (Math.random() - 0.5) * 2;
      positions[i + 1] = position.y + Math.random() * 2;
      positions[i + 2] = position.z + (Math.random() - 0.5) * 2;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.05, transparent: true, opacity: 0.8 });
    const particleSystem = new THREE.Points(particles, particleMaterial);
        // No backButton DOM manipulation here
    this.scene.add(particleSystem);
    let opacity = 0.8;
    const animate = () => {
      opacity -= 0.02;
      particleMaterial.opacity = opacity;
      if (opacity <= 0) {
        this.scene.remove(particleSystem);
      } else {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  interactWithObject(object: any) {
    const originalColor = object.material.color.clone();
    object.material.color.setHex(0xffff00);
    setTimeout(() => { object.material.color.copy(originalColor); }, 500);
    this.playInteractionSound();
    if (object.userData.isGavel) {
      this.animateGavel(object);
    } else if (object.userData.isBriefcase) {
      this.animateBriefcase(object);
    }
  }

  animateGavel(gavel: any) {
    const originalRotation = gavel.rotation.z;
    gavel.rotation.z = originalRotation + Math.PI / 4;
    setTimeout(() => { gavel.rotation.z = originalRotation; }, 200);
  }

  animateBriefcase(briefcase: any) {
    const originalScale = briefcase.scale.y;
    briefcase.scale.y = originalScale * 0.5;
    setTimeout(() => { briefcase.scale.y = originalScale; }, 300);
  }

  playInteractionSound() {
    if (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined') {
      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }

  update() {
    this.controllers.forEach(controller => {
      if (controller.userData.isSelecting) {
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        const intersects = this.raycaster.intersectObjects(this.intersectObjects);
        const line = controller.getObjectByName('line');
        if (line && intersects.length > 0) {
          line.scale.z = intersects[0].distance;
        } else if (line) {
          line.scale.z = 5;
        }
      }
    });
  }
}
// --- CourtroomScene and Characters from newCourtfrontend ---

class CourtroomScene {
  scene: THREE.Scene;
  materials: { [key: string]: THREE.Material };
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.materials = this.createMaterials();
  }
  createMaterials() {
    return {
      wood: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
      darkWood: new THREE.MeshLambertMaterial({ color: 0x654321 }),
      marble: new THREE.MeshPhongMaterial({ color: 0xF5F5DC, shininess: 100 }),
      carpet: new THREE.MeshLambertMaterial({ color: 0x8B0000 }),
      leather: new THREE.MeshLambertMaterial({ color: 0x2F1B14 }),
      fabric: new THREE.MeshLambertMaterial({ color: 0x4169E1 }),
      metal: new THREE.MeshPhongMaterial({ color: 0x708090, shininess: 200 }),
      wall: new THREE.MeshLambertMaterial({ color: 0xF5F5F0 })
    };
  }
  createCourtroom() {
    this.createFloor();
    this.createWalls();
    this.createJudgesBench();
    this.createWitnessStand();
    this.createLawyerTables();
    this.createJuryBox();
    this.createGallerySeating();
    this.createPodium();
    this.createDecorations();
  }
  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(30, 40);
    const floor = new THREE.Mesh(floorGeometry, this.materials.marble);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
    const carpetGeometry = new THREE.PlaneGeometry(20, 25);
    const carpet = new THREE.Mesh(carpetGeometry, this.materials.carpet);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01;
    carpet.position.z = 2;
    carpet.receiveShadow = true;
    this.scene.add(carpet);
  }
  createWalls() {
    const backWallGeometry = new THREE.PlaneGeometry(30, 12);
    const backWall = new THREE.Mesh(backWallGeometry, this.materials.wall);
    backWall.position.set(0, 6, -20);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    const sideWallGeometry = new THREE.PlaneGeometry(40, 12);
    const leftWall = new THREE.Mesh(sideWallGeometry, this.materials.wall);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-15, 6, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);
    const rightWall = new THREE.Mesh(sideWallGeometry, this.materials.wall);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(15, 6, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
  }
  createJudgesBench() {
    const benchGeometry = new THREE.BoxGeometry(8, 3, 2);
    const bench = new THREE.Mesh(benchGeometry, this.materials.darkWood);
    bench.position.set(0, 1.5, -15);
    bench.castShadow = true;
    bench.receiveShadow = true;
    this.scene.add(bench);
    const platformGeometry = new THREE.BoxGeometry(10, 1, 4);
    const platform = new THREE.Mesh(platformGeometry, this.materials.wood);
    platform.position.set(0, 0.5, -15);
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.scene.add(platform);
    // Judge's chair
    this.createChair(0, 3.5, -16, this.materials.leather, 1.2);
    // Gavel block
    const gavelBlockGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1);
    const gavelBlock = new THREE.Mesh(gavelBlockGeometry, this.materials.wood);
    gavelBlock.position.set(-2, 3.1, -15);
    gavelBlock.castShadow = true;
    gavelBlock.userData.isInteractive = true;
    this.scene.add(gavelBlock);
  }
  createWitnessStand() {
    const boxGeometry = new THREE.BoxGeometry(2, 2.5, 2);
    const witnessBox = new THREE.Mesh(boxGeometry, this.materials.wood);
    witnessBox.position.set(-8, 1.25, -8);
    witnessBox.castShadow = true;
    witnessBox.receiveShadow = true;
    this.scene.add(witnessBox);
    this.createChair(-8, 2.5, -8, this.materials.fabric, 0.8);
  }
  createLawyerTables() {
    this.createTable(-6, 0, -2, this.materials.wood);
    this.createChair(-6, 0.8, -1, this.materials.fabric, 0.8);
    this.createChair(-6, 0.8, -3, this.materials.fabric, 0.8);
    this.createTable(6, 0, -2, this.materials.wood);
    this.createChair(6, 0.8, -1, this.materials.fabric, 0.8);
    this.createChair(6, 0.8, -3, this.materials.fabric, 0.8);
  }
  createTable(x: number, y: number, z: number, material: THREE.Material) {
    const topGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const top = new THREE.Mesh(topGeometry, material);
    top.position.set(x, y + 0.75, z);
    top.castShadow = true;
    top.receiveShadow = true;
    this.scene.add(top);
    const legGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.1);
    const positions = [
      [x - 1.4, y + 0.35, z - 0.9],
      [x + 1.4, y + 0.35, z - 0.9],
      [x - 1.4, y + 0.35, z + 0.9],
      [x + 1.4, y + 0.35, z + 0.9]
    ];
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      this.scene.add(leg);
    });
  }
  createChair(x: number, y: number, z: number, material: THREE.Material, scale = 1) {
    const seatGeometry = new THREE.BoxGeometry(0.8 * scale, 0.1, 0.8 * scale);
    const seat = new THREE.Mesh(seatGeometry, material);
    seat.position.set(x, y, z);
    seat.castShadow = true;
    seat.receiveShadow = true;
    this.scene.add(seat);
    const backGeometry = new THREE.BoxGeometry(0.8 * scale, 1 * scale, 0.1);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.set(x, y + 0.5 * scale, z - 0.35 * scale);
    back.castShadow = true;
    back.receiveShadow = true;
    this.scene.add(back);
  }
  createJuryBox() {
    const juryBoxGeometry = new THREE.BoxGeometry(8, 1, 3);
    const juryBox = new THREE.Mesh(juryBoxGeometry, this.materials.wood);
    juryBox.position.set(10, 0.5, -8);
    juryBox.castShadow = true;
    juryBox.receiveShadow = true;
    this.scene.add(juryBox);
    for (let row = 0; row < 2; row++) {
      for (let seat = 0; seat < 6; seat++) {
        const x = 7 + seat * 1.2;
        const z = -9 + row * 1.5;
        this.createChair(x, 1.3 + row * 0.5, z, this.materials.fabric, 0.7);
      }
    }
  }
  createGallerySeating() {
    for (let row = 0; row < 4; row++) {
      const benchGeometry = new THREE.BoxGeometry(12, 0.8, 1.5);
      const bench = new THREE.Mesh(benchGeometry, this.materials.wood);
      bench.position.set(0, 0.4, 8 + row * 2);
      bench.castShadow = true;
      bench.receiveShadow = true;
      this.scene.add(bench);
      const backGeometry = new THREE.BoxGeometry(12, 1.5, 0.2);
      const back = new THREE.Mesh(backGeometry, this.materials.wood);
      back.position.set(0, 1.2, 8.6 + row * 2);
      back.castShadow = true;
      back.receiveShadow = true;
      this.scene.add(back);
    }
  }
  createPodium() {
    const podiumGeometry = new THREE.BoxGeometry(1, 1.2, 0.8);
    const podium = new THREE.Mesh(podiumGeometry, this.materials.wood);
    podium.position.set(0, 0.6, 5);
    podium.castShadow = true;
    podium.receiveShadow = true;
    this.scene.add(podium);
  }
  createDecorations() {
    const flagPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8);
    const flagPole = new THREE.Mesh(flagPoleGeometry, this.materials.metal);
    flagPole.position.set(-12, 4, -18);
    flagPole.castShadow = true;
    this.scene.add(flagPole);
    const flagGeometry = new THREE.PlaneGeometry(3, 2);
    const flagMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(-10.5, 6, -18);
    this.scene.add(flag);
  }
}


class Characters {
  scene: THREE.Scene;
  materials: { [key: string]: THREE.Material };
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.materials = this.createCharacterMaterials();
  }
  createCharacterMaterials() {
    return {
      skin: new THREE.MeshLambertMaterial({ color: 0xFFDBAC }),
      blackRobe: new THREE.MeshLambertMaterial({ color: 0x1C1C1C }),
      suit: new THREE.MeshLambertMaterial({ color: 0x2F4F4F }),
      hair: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
      shirt: new THREE.MeshLambertMaterial({ color: 0xFFFFFF }),
      tie: new THREE.MeshLambertMaterial({ color: 0x8B0000 })
    };
  }
  createAllCharacters() {
    this.createJudge(0, 3.5, -16);
    this.createLawyer(-6, 0.8, -1, 'prosecution');
    this.createLawyer(6, 0.8, -1, 'defense');
  }
  createJudge(x: number, y: number, z: number) {
    const judgeGroup = new THREE.Group();
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5);
    const body = new THREE.Mesh(bodyGeometry, this.materials.blackRobe);
    body.position.set(0, 0.75, 0);
    judgeGroup.add(body);
    const headGeometry = new THREE.SphereGeometry(0.25);
    const head = new THREE.Mesh(headGeometry, this.materials.skin);
    head.position.set(0, 1.7, 0);
    judgeGroup.add(head);
    const hairGeometry = new THREE.SphereGeometry(0.27);
    const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
    hair.position.set(0, 1.8, 0);
    hair.scale.set(1, 0.6, 1);
    judgeGroup.add(hair);
    const gavelGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
    const gavel = new THREE.Mesh(gavelGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
    gavel.position.set(0.7, 0.6, 0);
    gavel.rotation.z = Math.PI / 4;
    judgeGroup.add(gavel);
    judgeGroup.position.set(x, y, z);
    judgeGroup.userData.isCharacter = true;
    this.scene.add(judgeGroup);
  }
  createLawyer(x: number, y: number, z: number, type: string) {
    const lawyerGroup = new THREE.Group();
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2);
    const suitColor = type === 'prosecution' ? 0x191970 : 0x2F4F4F;
    const suitMaterial = new THREE.MeshLambertMaterial({ color: suitColor });
    const body = new THREE.Mesh(bodyGeometry, suitMaterial);
    body.position.set(0, 0.6, 0);
    lawyerGroup.add(body);
    const headGeometry = new THREE.SphereGeometry(0.2);
    const head = new THREE.Mesh(headGeometry, this.materials.skin);
    head.position.set(0, 1.4, 0);
    lawyerGroup.add(head);
    const hairGeometry = new THREE.SphereGeometry(0.22);
    const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
    hair.position.set(0, 1.5, 0);
    hair.scale.set(1, 0.7, 1);
    lawyerGroup.add(hair);
    const briefcaseGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1);
    const briefcaseMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const briefcase = new THREE.Mesh(briefcaseGeometry, briefcaseMaterial);
    briefcase.position.set(0.7, 0.15, 0);
    briefcase.userData.isInteractive = true;
    lawyerGroup.add(briefcase);
    lawyerGroup.position.set(x, y, z);
    lawyerGroup.userData.isCharacter = true;
    this.scene.add(lawyerGroup);
  }
}

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const CourtroomVRFullPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const vrButtonContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 20, 50);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 15);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting (from newCourtfrontend)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    const spotLight = new THREE.SpotLight(0xffffff, 1.2);
    spotLight.position.set(0, 12, -12);
    spotLight.target.position.set(0, 3, -15);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

  // --- Add courtroom geometry and characters ---
  const courtroomScene = new CourtroomScene(scene);
  courtroomScene.createCourtroom();
  const characters = new Characters(scene);
  characters.createAllCharacters();


    // Controls: WebXR and desktop fallback
    let orbitControls: any = null;
    const controls = new CourtroomControls(renderer, scene, camera, vrButtonContainerRef.current);
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 2, 0);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 2;
    orbitControls.maxDistance = 30;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.update();

    // View buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'view-buttons';
    buttonContainer.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    const views = [
      { name: 'Judge View', method: () => { camera.position.set(0, 3, -12); camera.lookAt(0, 1.6, 0); if (orbitControls) orbitControls.update(); } },
      { name: 'Prosecution', method: () => { camera.position.set(-6, 2, 2); camera.lookAt(0, 3, -15); if (orbitControls) orbitControls.update(); } },
      { name: 'Defense', method: () => { camera.position.set(6, 2, 2); camera.lookAt(0, 3, -15); if (orbitControls) orbitControls.update(); } },
      { name: 'Gallery', method: () => { camera.position.set(0, 2, 12); camera.lookAt(0, 2, -5); if (orbitControls) orbitControls.update(); } },
    ];
    views.forEach(view => {
      const button = document.createElement('button');
      button.textContent = view.name;
      button.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.3s;
      `;
      button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(74, 144, 226, 0.7)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(0, 0, 0, 0.7)';
      });
      button.addEventListener('click', view.method);
      buttonContainer.appendChild(button);
    });
    mountRef.current.appendChild(buttonContainer);

    // Animation loop

    renderer.setAnimationLoop(() => {
      if (orbitControls && !renderer.xr.isPresenting) {
        orbitControls.update();
      }
      controls.update();
      renderer.render(scene, camera);
    });

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (mountRef.current && buttonContainer.parentNode === mountRef.current) {
        mountRef.current.removeChild(buttonContainer);
      }
      if (vrButtonContainerRef.current) {
        vrButtonContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222', position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: 20,
          right: 160,
          zIndex: 102,
          padding: '10px 18px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: '1px solid #7C3AED',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
      <div ref={vrButtonContainerRef} style={{ position: 'absolute', top: 20, left: 20, zIndex: 101 }} />
    </div>
  );
};

export default CourtroomVRFullPage;
