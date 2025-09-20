//frontend/src/components/CourtroomVR.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CourtroomScene } from '../vr/courtroom.js';

interface CourtroomVRProps {
  participants?: any;
  evidence?: any;
}

const CourtroomVR: React.FC<CourtroomVRProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    if (mountRef.current) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5); // Set background color
  camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
  camera.position.set(0, 8, 10);
  camera.lookAt(0, 2, 0); // Center camera on courtroom
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);
      // Create the courtroom scene
      const courtroom = new CourtroomScene(scene);
      courtroom.createCourtroom();
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
      dirLight.position.set(10, 20, 10);
      scene.add(dirLight);
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer!.render(scene!, camera!);
      };
      animate();
    }
    return () => {
      if (renderer && renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return <div ref={mountRef} style={{ width: '100%', height: '60vh', background: '#f5f5f5', borderRadius: '16px' }} />;
};

export default CourtroomVR;