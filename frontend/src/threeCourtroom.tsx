import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const ThreeCourtroom: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    // Load courtroom model
    const loader = new GLTFLoader();
    loader.load('/assets/courtroom.glb', (gltf) => {
      scene.add(gltf.scene);
    });

    // Placeholder avatar (sphere)
    const avatar = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x0077ff })
    );
    avatar.position.set(0, 1, 0);
    scene.add(avatar);

    // Animation loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    animate();

    // WebXR button
    if (WebGL.isWebGLAvailable()) {
      document.body.appendChild(VRButton.createButton(renderer));
    } else {
      document.body.appendChild(document.createElement('div'));
    }

    // Cleanup
    return () => {
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeCourtroom; 