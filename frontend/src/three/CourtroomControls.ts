import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export class CourtroomControls {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    orbitControls: OrbitControls | null = null;
    constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.setupWebXR();
        this.setupDesktopControls();
    }

    setupWebXR() {
        this.renderer.xr.enabled = true;
        const vrButton = VRButton.createButton(this.renderer);
        vrButton.id = 'VRButton';
        document.body.appendChild(vrButton);
    }

    setupDesktopControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.target.set(0, 2, 0);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.minDistance = 2;
        this.orbitControls.maxDistance = 30;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.update();
        return this.orbitControls;
    }
}
