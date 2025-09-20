import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// WebXR controllers and interaction handling
export class CourtroomControls {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.controllers = [];
        this.intersected = [];
        this.tempMatrix = new THREE.Matrix4();
        this.raycaster = new THREE.Raycaster();
        this.intersectObjects = [];
        
        this.setupWebXR();
        this.setupControllers();
        this.setupTeleportation();
        this.setupInteractions();
    }

    setupWebXR() {
        // Enable WebXR
        this.renderer.xr.enabled = true;
        
        // Add VR button to the page
        const vrButton = VRButton.createButton(this.renderer);
        vrButton.id = 'VRButton';
        document.getElementById('vr-button-container').appendChild(vrButton);
    }

    setupControllers() {
        // Controller 1
        const controller1 = this.renderer.xr.getController(0);
        controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
        controller1.addEventListener('selectend', this.onSelectEnd.bind(this));
        controller1.userData.isSelecting = false;
        this.scene.add(controller1);

        // Controller 2
        const controller2 = this.renderer.xr.getController(1);
        controller2.addEventListener('selectstart', this.onSelectStart.bind(this));
        controller2.addEventListener('selectend', this.onSelectEnd.bind(this));
        controller2.userData.isSelecting = false;
        this.scene.add(controller2);

        this.controllers.push(controller1, controller2);

        // Controller grips
        const controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        controllerGrip1.add(this.buildController());
        this.scene.add(controllerGrip1);

        const controllerGrip2 = this.renderer.xr.getControllerGrip(1);
        controllerGrip2.add(this.buildController());
        this.scene.add(controllerGrip2);

        // Add controller rays
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

    buildController() {
        // Simple controller representation
        const geometry = new THREE.CylinderGeometry(0.01, 0.02, 0.08, 5);
        const material = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    setupTeleportation() {
        // Create teleportation markers
        this.teleportMarkers = [];
        const markerGeometry = new THREE.RingGeometry(0.5, 0.7, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.5 
        });

        // Teleport positions around the courtroom
        const teleportPositions = [
            { x: 0, z: 10 },   // Gallery area
            { x: -8, z: 0 },   // Left side
            { x: 8, z: 0 },    // Right side
            { x: 0, z: -5 },   // Center court
            { x: -6, z: -2 },  // Prosecution table
            { x: 6, z: -2 },   // Defense table
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
        // Add interactive objects to the scene
        this.scene.traverse((child) => {
            if (child.isMesh && (
                child.material.color?.getHex() === 0x8B4513 || // Wood objects
                child.material.color?.getHex() === 0x654321 ||  // Briefcases
                child.material.color?.getHex() === 0xFFD700     // Gavel, scales
            )) {
                child.userData.isInteractive = true;
                this.intersectObjects.push(child);
            }
        });
    }

    onSelectStart(event) {
        const controller = event.target;
        controller.userData.isSelecting = true;

        // Show teleport markers when selecting
        this.teleportMarkers.forEach(marker => {
            marker.visible = true;
        });

        // Check for intersections
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

        const intersects = this.raycaster.intersectObjects(this.intersectObjects);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            if (intersect.object.userData.isTeleportMarker) {
                // Teleportation
                this.teleportToPosition(intersect.object.userData.teleportPosition);
            } else if (intersect.object.userData.isInteractive) {
                // Object interaction
                this.interactWithObject(intersect.object);
            }
        }
    }

    onSelectEnd(event) {
        const controller = event.target;
        controller.userData.isSelecting = false;

        // Hide teleport markers
        this.teleportMarkers.forEach(marker => {
            marker.visible = false;
        });
    }

    teleportToPosition(position) {
        // Smooth teleportation
        const camera = this.renderer.xr.getCamera();
        const offset = new THREE.Vector3();
        offset.copy(position);
        offset.sub(camera.position);
        
        // Apply offset to the XR reference space
        const referenceSpace = this.renderer.xr.getReferenceSpace();
        if (referenceSpace) {
            const offsetTransform = new XRRigidTransform(
                { x: offset.x, y: offset.y, z: offset.z }
            );
            this.renderer.xr.setReferenceSpace(
                referenceSpace.getOffsetReferenceSpace(offsetTransform)
            );
        }

        // Visual feedback
        this.createTeleportEffect(position);
    }

    createTeleportEffect(position) {
        // Particle effect for teleportation
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = position.x + (Math.random() - 0.5) * 2;
            positions[i + 1] = position.y + Math.random() * 2;
            positions[i + 2] = position.z + (Math.random() - 0.5) * 2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);

        // Animate particles
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

    interactWithObject(object) {
        // Object interaction feedback
        const originalColor = object.material.color.clone();
        object.material.color.setHex(0xffff00); // Highlight in yellow

        // Reset color after interaction
        setTimeout(() => {
            object.material.color.copy(originalColor);
        }, 500);

        // Add interaction sound effect (if audio context is available)
        this.playInteractionSound();

        // Object-specific interactions
        if (object.userData.isGavel) {
            this.animateGavel(object);
        } else if (object.userData.isBriefcase) {
            this.animateBriefcase(object);
        }
    }

    animateGavel(gavel) {
        // Gavel strike animation
        const originalRotation = gavel.rotation.z;
        gavel.rotation.z = originalRotation + Math.PI / 4;
        
        setTimeout(() => {
            gavel.rotation.z = originalRotation;
        }, 200);
    }

    animateBriefcase(briefcase) {
        // Briefcase open/close animation
        const originalScale = briefcase.scale.y;
        briefcase.scale.y = originalScale * 0.5;
        
        setTimeout(() => {
            briefcase.scale.y = originalScale;
        }, 300);
    }

    playInteractionSound() {
        // Simple audio feedback using Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
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
        // Update controller interactions
        this.controllers.forEach(controller => {
            if (controller.userData.isSelecting) {
                // Update ray casting for continuous selection
                this.tempMatrix.identity().extractRotation(controller.matrixWorld);
                this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
                this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

                const intersects = this.raycaster.intersectObjects(this.intersectObjects);
                
                // Update ray visualization
                const line = controller.getObjectByName('line');
                if (line && intersects.length > 0) {
                    line.scale.z = intersects[0].distance;
                } else if (line) {
                    line.scale.z = 5;
                }
            }
        });
    }

    // Fallback controls for non-VR devices
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