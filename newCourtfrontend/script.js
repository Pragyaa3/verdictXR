// Main Three.js application with WebXR integration
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Courtroom scene creation and geometry
class CourtroomScene {
    constructor(scene) {
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

        // Carpet in the center area
        const carpetGeometry = new THREE.PlaneGeometry(20, 25);
        const carpet = new THREE.Mesh(carpetGeometry, this.materials.carpet);
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.y = 0.01;
        carpet.position.z = 2;
        carpet.receiveShadow = true;
        this.scene.add(carpet);
    }

    createWalls() {
        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(30, 12);
        const backWall = new THREE.Mesh(backWallGeometry, this.materials.wall);
        backWall.position.set(0, 6, -20);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Side walls
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
        // Main bench structure
        const benchGeometry = new THREE.BoxGeometry(8, 3, 2);
        const bench = new THREE.Mesh(benchGeometry, this.materials.darkWood);
        bench.position.set(0, 1.5, -15);
        bench.castShadow = true;
        bench.receiveShadow = true;
        this.scene.add(bench);

        // Elevated platform
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
        // Witness box
        const boxGeometry = new THREE.BoxGeometry(2, 2.5, 2);
        const witnessBox = new THREE.Mesh(boxGeometry, this.materials.wood);
        witnessBox.position.set(-8, 1.25, -8);
        witnessBox.castShadow = true;
        witnessBox.receiveShadow = true;
        this.scene.add(witnessBox);

        // Witness chair
        this.createChair(-8, 2.5, -8, this.materials.fabric, 0.8);
    }

    createLawyerTables() {
        // Prosecution table (left side)
        this.createTable(-6, 0, -2, this.materials.wood);
        this.createChair(-6, 0.8, -1, this.materials.fabric, 0.8);
        this.createChair(-6, 0.8, -3, this.materials.fabric, 0.8);

        // Defense table (right side)
        this.createTable(6, 0, -2, this.materials.wood);
        this.createChair(6, 0.8, -1, this.materials.fabric, 0.8);
        this.createChair(6, 0.8, -3, this.materials.fabric, 0.8);
    }

    createTable(x, y, z, material) {
        // Table top
        const topGeometry = new THREE.BoxGeometry(3, 0.1, 2);
        const top = new THREE.Mesh(topGeometry, material);
        top.position.set(x, y + 0.75, z);
        top.castShadow = true;
        top.receiveShadow = true;
        this.scene.add(top);

        // Table legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.1);
        const positions = [
            [x - 1.4, y + 0.35, z - 0.9],
            [x + 1.4, y + 0.35, z - 0.9],
            [x - 1.4, y + 0.35, z + 0.9],
            [x + 1.4, y + 0.35, z + 0.9]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });
    }

    createChair(x, y, z, material, scale = 1) {
        // Seat
        const seatGeometry = new THREE.BoxGeometry(0.8 * scale, 0.1, 0.8 * scale);
        const seat = new THREE.Mesh(seatGeometry, material);
        seat.position.set(x, y, z);
        seat.castShadow = true;
        seat.receiveShadow = true;
        this.scene.add(seat);

        // Backrest
        const backGeometry = new THREE.BoxGeometry(0.8 * scale, 1 * scale, 0.1);
        const back = new THREE.Mesh(backGeometry, material);
        back.position.set(x, y + 0.5 * scale, z - 0.35 * scale);
        back.castShadow = true;
        back.receiveShadow = true;
        this.scene.add(back);
    }

    createJuryBox() {
        // Jury seating area
        const juryBoxGeometry = new THREE.BoxGeometry(8, 1, 3);
        const juryBox = new THREE.Mesh(juryBoxGeometry, this.materials.wood);
        juryBox.position.set(10, 0.5, -8);
        juryBox.castShadow = true;
        juryBox.receiveShadow = true;
        this.scene.add(juryBox);

        // Jury chairs (2 rows of 6)
        for (let row = 0; row < 2; row++) {
            for (let seat = 0; seat < 6; seat++) {
                const x = 7 + seat * 1.2;
                const z = -9 + row * 1.5;
                this.createChair(x, 1.3 + row * 0.5, z, this.materials.fabric, 0.7);
            }
        }
    }

    createGallerySeating() {
        // Gallery benches
        for (let row = 0; row < 4; row++) {
            const benchGeometry = new THREE.BoxGeometry(12, 0.8, 1.5);
            const bench = new THREE.Mesh(benchGeometry, this.materials.wood);
            bench.position.set(0, 0.4, 8 + row * 2);
            bench.castShadow = true;
            bench.receiveShadow = true;
            this.scene.add(bench);

            // Bench backs
            const backGeometry = new THREE.BoxGeometry(12, 1.5, 0.2);
            const back = new THREE.Mesh(backGeometry, this.materials.wood);
            back.position.set(0, 1.2, 8.6 + row * 2);
            back.castShadow = true;
            back.receiveShadow = true;
            this.scene.add(back);
        }
    }

    createPodium() {
        // Lectern for presentations
        const podiumGeometry = new THREE.BoxGeometry(1, 1.2, 0.8);
        const podium = new THREE.Mesh(podiumGeometry, this.materials.wood);
        podium.position.set(0, 0.6, 5);
        podium.castShadow = true;
        podium.receiveShadow = true;
        this.scene.add(podium);
    }

    createDecorations() {
        // American flag
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

// Character models for judge and lawyers
class Characters {
    constructor(scene) {
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
        // Judge
        this.createJudge(0, 3.5, -16);
        
        // Prosecution lawyer
        this.createLawyer(-6, 0.8, -1, 'prosecution');
        
        // Defense lawyer
        this.createLawyer(6, 0.8, -1, 'defense');
    }

    createJudge(x, y, z) {
        const judgeGroup = new THREE.Group();
        
        // Body (with judge's robe)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5);
        const body = new THREE.Mesh(bodyGeometry, this.materials.blackRobe);
        body.position.set(0, 0.75, 0);
        body.castShadow = true;
        judgeGroup.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.7, 0);
        head.castShadow = true;
        judgeGroup.add(head);

        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.27);
        const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
        hair.position.set(0, 1.8, 0);
        hair.scale.set(1, 0.6, 1);
        hair.castShadow = true;
        judgeGroup.add(hair);

        // Gavel in hand
        const gavelGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
        const gavel = new THREE.Mesh(gavelGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        gavel.position.set(0.7, 0.6, 0);
        gavel.rotation.z = Math.PI / 4;
        gavel.castShadow = true;
        judgeGroup.add(gavel);

        judgeGroup.position.set(x, y, z);
        judgeGroup.userData.isCharacter = true;
        this.scene.add(judgeGroup);
    }

    createLawyer(x, y, z, type) {
        const lawyerGroup = new THREE.Group();
        
        // Body (suit)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2);
        const suitColor = type === 'prosecution' ? 0x191970 : 0x2F4F4F;
        const suitMaterial = new THREE.MeshLambertMaterial({ color: suitColor });
        const body = new THREE.Mesh(bodyGeometry, suitMaterial);
        body.position.set(0, 0.6, 0);
        body.castShadow = true;
        lawyerGroup.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.2);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.4, 0);
        head.castShadow = true;
        lawyerGroup.add(head);

        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.22);
        const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
        hair.position.set(0, 1.5, 0);
        hair.scale.set(1, 0.7, 1);
        hair.castShadow = true;
        lawyerGroup.add(hair);

        // Briefcase
        const briefcaseGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1);
        const briefcaseMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const briefcase = new THREE.Mesh(briefcaseGeometry, briefcaseMaterial);
        briefcase.position.set(0.7, 0.15, 0);
        briefcase.castShadow = true;
        briefcase.userData.isInteractive = true;
        lawyerGroup.add(briefcase);

        lawyerGroup.position.set(x, y, z);
        lawyerGroup.userData.isCharacter = true;
        this.scene.add(lawyerGroup);
    }
}

// WebXR Controls
class CourtroomControls {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.controllers = [];
        
        this.setupWebXR();
        this.setupControllers();
    }

    setupWebXR() {
        this.renderer.xr.enabled = true;
        
        const vrButton = VRButton.createButton(this.renderer);
        vrButton.id = 'VRButton';
        document.getElementById('vr-button-container').appendChild(vrButton);
    }

    setupControllers() {
        const controller1 = this.renderer.xr.getController(0);
        const controller2 = this.renderer.xr.getController(1);
        
        this.scene.add(controller1);
        this.scene.add(controller2);
        
        this.controllers.push(controller1, controller2);
    }

    setupDesktopControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 2, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI / 2;
        controls.update();
        
        return controls;
    }
}

// Main Application
class CourtroomSimulation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.orbitControls = null;
        this.courtroomScene = null;
        this.characters = null;
        this.courtroomControls = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.setupLighting();
        this.createCourtroom();
        this.createCharacters();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 50);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1.6, 15);
        this.camera.lookAt(0, 2, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.body.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Main directional light
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
        this.scene.add(directionalLight);

        // Additional lighting for courtroom
        const spotLight = new THREE.SpotLight(0xffffff, 1.2);
        spotLight.position.set(0, 12, -12);
        spotLight.target.position.set(0, 3, -15);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.3;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
    }

    createCourtroom() {
        this.courtroomScene = new CourtroomScene(this.scene);
        this.courtroomScene.createCourtroom();
    }

    createCharacters() {
        this.characters = new Characters(this.scene);
        this.characters.createAllCharacters();
    }

    setupControls() {
        this.courtroomControls = new CourtroomControls(this.renderer, this.scene, this.camera);
        this.orbitControls = this.courtroomControls.setupDesktopControls();
        
        // Hide info panel when entering VR
        this.renderer.xr.addEventListener('sessionstart', () => {
            document.getElementById('info').style.display = 'none';
        });
        
        this.renderer.xr.addEventListener('sessionend', () => {
            document.getElementById('info').style.display = 'block';
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onKeyDown(event) {
        if (this.renderer.xr.isPresenting) return;

        const moveSpeed = 0.5;
        
        switch (event.code) {
            case 'KeyW':
                this.camera.position.z -= moveSpeed;
                break;
            case 'KeyS':
                this.camera.position.z += moveSpeed;
                break;
            case 'KeyA':
                this.camera.position.x -= moveSpeed;
                break;
            case 'KeyD':
                this.camera.position.x += moveSpeed;
                break;
            case 'KeyR':
                this.camera.position.set(0, 1.6, 15);
                this.camera.lookAt(0, 2, 0);
                break;
        }
        
        if (this.orbitControls) {
            this.orbitControls.update();
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            if (this.orbitControls && !this.renderer.xr.isPresenting) {
                this.orbitControls.update();
            }

            this.renderer.render(this.scene, this.camera);
        });
    }

    // Preset camera positions
    setJudgeView() {
        this.camera.position.set(0, 3, -12);
        this.camera.lookAt(0, 1.6, 0);
        if (this.orbitControls) this.orbitControls.update();
    }

    setProsecutionView() {
        this.camera.position.set(-6, 2, 2);
        this.camera.lookAt(0, 3, -15);
        if (this.orbitControls) this.orbitControls.update();
    }

    setDefenseView() {
        this.camera.position.set(6, 2, 2);
        this.camera.lookAt(0, 3, -15);
        if (this.orbitControls) this.orbitControls.update();
    }

    setGalleryView() {
        this.camera.position.set(0, 2, 12);
        this.camera.lookAt(0, 2, -5);
        if (this.orbitControls) this.orbitControls.update();
    }
}

// Initialize the simulation
const courtroom = new CourtroomSimulation();

// Add view buttons
const createViewButtons = () => {
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
        { name: 'Judge View', method: 'setJudgeView' },
        { name: 'Prosecution', method: 'setProsecutionView' },
        { name: 'Defense', method: 'setDefenseView' },
        { name: 'Gallery', method: 'setGalleryView' }
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
        
        button.addEventListener('click', () => {
            courtroom[view.method]();
        });
        
        buttonContainer.appendChild(button);
    });

    document.body.appendChild(buttonContainer);
};

// Add view buttons after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createViewButtons);
} else {
    createViewButtons();
}

// Expose to global scope
window.CourtroomSimulation = CourtroomSimulation;
window.courtroom = courtroom;

console.log('WebXR Courtroom Simulation loaded successfully!');