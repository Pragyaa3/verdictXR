
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { CourtroomScene } from '../vr/courtroom.js';
import { Characters } from '../vr/character.js';

const POVS = [
  { name: 'Judge', set: (camera: THREE.PerspectiveCamera, controls: any) => {
    camera.position.set(0, 3, -12);
    camera.lookAt(0, 1.6, 0);
    controls?.update();
  }},
  { name: 'Prosecution', set: (camera: THREE.PerspectiveCamera, controls: any) => {
    camera.position.set(-6, 2, 2);
    camera.lookAt(0, 3, -15);
    controls?.update();
  }},
  { name: 'Defense', set: (camera: THREE.PerspectiveCamera, controls: any) => {
    camera.position.set(6, 2, 2);
    camera.lookAt(0, 3, -15);
    controls?.update();
  }},
  { name: 'Gallery', set: (camera: THREE.PerspectiveCamera, controls: any) => {
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 2, -5);
    controls?.update();
  }},
];

const CourtroomVRFullPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let controls: any = null;
    let animationId: number;

    if (mountRef.current) {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);
      scene.fog = new THREE.Fog(0x87CEEB, 20, 50);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.6, 15);
      camera.lookAt(0, 2, 0);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.xr.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
      document.body.appendChild(VRButton.createButton(renderer));

      // Lighting
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

  // Courtroom
  const courtroom = new CourtroomScene(scene);
  courtroom.createCourtroom();

  // Characters
  const characters = new Characters(scene);
  characters.createAllCharacters();

      // OrbitControls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 2, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 2;
      controls.maxDistance = 30;
      controls.maxPolarAngle = Math.PI / 2;
      controls.update();
      controlsRef.current = controls;

      // Keyboard controls
      const handleKeyDown = (event: KeyboardEvent) => {
        if (renderer?.xr.isPresenting) return;
        const moveSpeed = 0.5;
        switch (event.code) {
          case 'KeyW':
            camera.position.z -= moveSpeed;
            break;
          case 'KeyS':
            camera.position.z += moveSpeed;
            break;
          case 'KeyA':
            camera.position.x -= moveSpeed;
            break;
          case 'KeyD':
            camera.position.x += moveSpeed;
            break;
          case 'KeyR':
            camera.position.set(0, 1.6, 15);
            camera.lookAt(0, 2, 0);
            break;
        }
        controls.update();
      };
      window.addEventListener('keydown', handleKeyDown);

      // Resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        animationId = renderer.setAnimationLoop(() => {
          if (controls && !renderer.xr.isPresenting) {
            controls.update();
          }
          if (characters) {
            characters.animateCharacters(performance.now() / 1000);
          }
          renderer.render(scene, camera);
        });
      };
      animate();

      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement && mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (animationId) {
          renderer?.setAnimationLoop(null);
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, []);

  // POV Buttons
  const handlePOV = (pov: typeof POVS[0]) => {
    if (cameraRef.current && controlsRef.current) {
      pov.set(cameraRef.current, controlsRef.current);
    }
  };

  // Back button handler
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {POVS.map((pov) => (
          <button key={pov.name} style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', marginBottom: '4px' }} onClick={() => handlePOV(pov)}>
            {pov.name} View
          </button>
        ))}
        <button style={{ background: '#bfa14a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '12px' }} onClick={handleBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default CourtroomVRFullPage;
