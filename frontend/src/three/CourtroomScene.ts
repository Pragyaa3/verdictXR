import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

export function initCourtroomScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Add lights
  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  // Add placeholder judge bench
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  bench.position.set(0, 0.5, -2);
  scene.add(bench);

  // Add placeholder tables for plaintiff and defendant
  const table1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.3, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
  );
  table1.position.set(-0.8, 0.3, -0.5);
  scene.add(table1);

  const table2 = table1.clone();
  table2.position.set(0.8, 0.3, -0.5);
  scene.add(table2);

  // Add floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  return { scene, camera, renderer };
} 