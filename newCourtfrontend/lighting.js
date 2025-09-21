import * as THREE from 'three';

// Scene lighting setup for courtroom
export class CourtroomLighting {
    constructor(scene) {
        this.scene = scene;
        this.setupLighting();
    }

    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Main courtroom lighting (overhead)
        this.createOverheadLights();
        
        // Dramatic lighting for judge's bench
        this.createJudgeLighting();
        
        // Task lighting for lawyer tables
        this.createTableLighting();
        
        // Gallery lighting
        this.createGalleryLighting();
        
        // Window lighting simulation
        this.createWindowLighting();
    }

    createOverheadLights() {
        // Main ceiling lights
        const positions = [
            [0, 10, -10],
            [-8, 10, -5],
            [8, 10, -5],
            [0, 10, 0],
            [0, 10, 10]
        ];

        positions.forEach(pos => {
            const light = new THREE.DirectionalLight(0xffffff, 0.6);
            light.position.set(...pos);
            light.target.position.set(pos[0], 0, pos[2]);
            light.castShadow = true;
            
            // Shadow camera settings
            light.shadow.camera.near = 0.1;
            light.shadow.camera.far = 50;
            light.shadow.camera.left = -20;
            light.shadow.camera.right = 20;
            light.shadow.camera.top = 20;
            light.shadow.camera.bottom = -20;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            
            this.scene.add(light);
            this.scene.add(light.target);

            // Light fixture visualization
            this.createLightFixture(pos[0], pos[1] - 1, pos[2]);
        });
    }

    createJudgeLighting() {
        // Spotlight on judge's bench
        const judgeSpotlight = new THREE.SpotLight(0xffffff, 1.2);
        judgeSpotlight.position.set(0, 12, -12);
        judgeSpotlight.target.position.set(0, 3, -15);
        judgeSpotlight.angle = Math.PI / 6;
        judgeSpotlight.penumbra = 0.3;
        judgeSpotlight.decay = 2;
        judgeSpotlight.distance = 30;
        judgeSpotlight.castShadow = true;
        
        this.scene.add(judgeSpotlight);
        this.scene.add(judgeSpotlight.target);

        // Additional fill light for judge
        const judgeFillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        judgeFillLight.position.set(-5, 8, -10);
        judgeFillLight.target.position.set(0, 3, -15);
        this.scene.add(judgeFillLight);
        this.scene.add(judgeFillLight.target);
    }

    createTableLighting() {
        // Desk lamps for lawyer tables
        this.createDeskLamp(-6, 1.5, -2);
        this.createDeskLamp(6, 1.5, -2);
        
        // Focused lighting on tables
        const prosecutionLight = new THREE.SpotLight(0xffffff, 0.8);
        prosecutionLight.position.set(-6, 8, -2);
        prosecutionLight.target.position.set(-6, 0.8, -2);
        prosecutionLight.angle = Math.PI / 8;
        prosecutionLight.penumbra = 0.5;
        this.scene.add(prosecutionLight);
        this.scene.add(prosecutionLight.target);

        const defenseLight = new THREE.SpotLight(0xffffff, 0.8);
        defenseLight.position.set(6, 8, -2);
        defenseLight.target.position.set(6, 0.8, -2);
        defenseLight.angle = Math.PI / 8;
        defenseLight.penumbra = 0.5;
        this.scene.add(defenseLight);
        this.scene.add(defenseLight.target);
    }

    createDeskLamp(x, y, z) {
        // Lamp base
        const baseGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.05);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x2F2F2F });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, y, z);
        this.scene.add(base);

        // Lamp arm
        const armGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
        const arm = new THREE.Mesh(armGeometry, baseMaterial);
        arm.position.set(x, y + 0.3, z);
        arm.rotation.z = Math.PI / 6;
        this.scene.add(arm);

        // Lamp shade
        const shadeGeometry = new THREE.ConeGeometry(0.15, 0.2, 8);
        const shadeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        shade.position.set(x + 0.2, y + 0.5, z);
        shade.rotation.z = -Math.PI / 2;
        this.scene.add(shade);

        // Point light for the lamp
        const lampLight = new THREE.PointLight(0xffffcc, 0.5, 3);
        lampLight.position.set(x + 0.2, y + 0.4, z);
        this.scene.add(lampLight);
    }

    createGalleryLighting() {
        // Softer lighting for gallery area
        const galleryLight = new THREE.DirectionalLight(0xffffff, 0.4);
        galleryLight.position.set(0, 10, 15);
        galleryLight.target.position.set(0, 0, 12);
        this.scene.add(galleryLight);
        this.scene.add(galleryLight.target);
    }

    createWindowLighting() {
        // Simulated natural light from windows
        const windowLight1 = new THREE.DirectionalLight(0x87CEEB, 0.3);
        windowLight1.position.set(-20, 15, 0);
        windowLight1.target.position.set(0, 0, 0);
        this.scene.add(windowLight1);
        this.scene.add(windowLight1.target);

        const windowLight2 = new THREE.DirectionalLight(0x87CEEB, 0.3);
        windowLight2.position.set(20, 15, 0);
        windowLight2.target.position.set(0, 0, 0);
        this.scene.add(windowLight2);
        this.scene.add(windowLight2.target);

        // Add window frames on walls
        this.createWindows();
    }

    createWindows() {
        // Left wall windows
        for (let i = 0; i < 3; i++) {
            const windowGeometry = new THREE.PlaneGeometry(2, 3);
            const windowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x87CEEB, 
                transparent: true, 
                opacity: 0.3 
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(-14.9, 6, -8 + i * 8);
            window.rotation.y = Math.PI / 2;
            this.scene.add(window);

            // Window frame
            const frameGeometry = new THREE.BoxGeometry(0.1, 3.2, 2.2);
            const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(-14.95, 6, -8 + i * 8);
            this.scene.add(frame);
        }

        // Right wall windows
        for (let i = 0; i < 3; i++) {
            const windowGeometry = new THREE.PlaneGeometry(2, 3);
            const windowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x87CEEB, 
                transparent: true, 
                opacity: 0.3 
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(14.9, 6, -8 + i * 8);
            window.rotation.y = -Math.PI / 2;
            this.scene.add(window);

            // Window frame
            const frameGeometry = new THREE.BoxGeometry(0.1, 3.2, 2.2);
            const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(14.95, 6, -8 + i * 8);
            this.scene.add(frame);
        }
    }

    createLightFixture(x, y, z) {
        // Ceiling light fixture
        const fixtureGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2);
        const fixtureMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
        const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
        fixture.position.set(x, y, z);
        this.scene.add(fixture);

        // Light glow effect
        const glowGeometry = new THREE.SphereGeometry(0.5);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc, 
            transparent: true, 
            opacity: 0.1 
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y - 0.3, z);
        this.scene.add(glow);
    }

    // Dynamic lighting effects
    updateLighting(time) {
        // Subtle flickering effect for realism
        this.scene.traverse((child) => {
            if (child.isDirectionalLight || child.isSpotLight) {
                const flicker = Math.sin(time * 10) * 0.02 + 1;
                child.intensity = child.userData.baseIntensity * flicker;
            }
        });
    }

    // Store base intensities for flickering effect
    storeLightIntensities() {
        this.scene.traverse((child) => {
            if (child.isDirectionalLight || child.isSpotLight || child.isPointLight) {
                child.userData.baseIntensity = child.intensity;
            }
        });
    }
}