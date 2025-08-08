import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import ReactDOM from 'react-dom';

function createChair(x: number, y: number, z: number, color = 0x444444) {
  const group = new THREE.Group();
  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.1, 0.4),
    new THREE.MeshStandardMaterial({ color })
  );
  seat.position.set(0, 0.05, 0);
  group.add(seat);
  // Back
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.3, 0.05),
    new THREE.MeshStandardMaterial({ color })
  );
  back.position.set(0, 0.2, -0.175);
  group.add(back);
  // Legs
  for (let dx of [-0.15, 0.15]) {
    for (let dz of [-0.15, 0.15]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
      );
      leg.position.set(dx, -0.025, dz);
      group.add(leg);
    }
  }
  group.position.set(x, y, z);
  return group;
}

function createNameplate(x: number, y: number, z: number, text: string, color = 0x222222) {
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.1, 0.02),
    new THREE.MeshStandardMaterial({ color })
  );
  plate.position.set(x, y, z);
  // Optionally, add 3D text or a plane for the name (not implemented for brevity)
  return plate;
}

function createMicrophone(x: number, y: number, z: number) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  base.position.set(0, 0.01, 0);
  group.add(base);
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  stem.position.set(0, 0.07, 0);
  group.add(stem);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  head.position.set(0, 0.14, 0);
  group.add(head);
  group.position.set(x, y, z);
  return group;
}

function createBook(x: number, y: number, z: number, color = 0x996633) {
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.04, 0.12),
    new THREE.MeshStandardMaterial({ color })
  );
  book.position.set(x, y, z);
  return book;
}

function createPlant(x: number, y: number, z: number) {
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  pot.position.set(x, y, z);
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );
  leaves.position.set(x, y + 0.09, z);
  return [pot, leaves];
}

function createFan(x: number, y: number, z: number) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  base.position.set(0, 0, 0);
  group.add(base);
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.3, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    blade.position.set(0, 0.15, 0);
    blade.rotation.z = (Math.PI / 2) * i;
    group.add(blade);
  }
  group.position.set(x, y, z);
  group.name = 'ceilingFan';
  return group;
}

function createTextSprite(text: string, color = '#222', fontSize = 48, background = 'rgba(255,255,255,0.85)') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.font = `bold ${fontSize}px sans-serif`;
  const textWidth = ctx.measureText(text).width;
  canvas.width = textWidth + 32;
  canvas.height = fontSize + 24;
  // Background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Text
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillText(text, 16, 12);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(canvas.width / 200, canvas.height / 200, 1);
  return sprite;
}

// Add participant type
export type Participant = {
  role: string; // e.g., 'Judge', 'Plaintiff', etc.
  principal: string;
  displayName?: string;
};

// Add evidence type
export type Evidence3D = {
  url: string;
  description: string;
  uploader: string;
};

// Map roles to arrays of positions and a color
const roleAvatarMap: Record<string, { color: number; positions: [number, number, number][] }> = {
  'Judge': { color: 0xffcccc, positions: [[0, 1.3, -4.6]] },
  'Plaintiff': { color: 0xccccff, positions: [[-1.2, 0.6, -2.1]] },
  'Defendant': { color: 0xffffcc, positions: [[1.2, 0.6, -2.1]] },
  'Witness': { color: 0xccffcc, positions: [[-2, 1.0, -3.6]] },
  'AI Judge': { color: 0x00e6e6, positions: [[0.5, 1.3, -4.6], [-0.5, 1.3, -4.6]] },
  'AI Lawyer': { color: 0x00e6e6, positions: [[-2, 0.6, -1.2], [2, 0.6, -1.2]] },
  'Observer': { color: 0xcccccc, positions: [
    [-4, 0.6, 3.5], [-2, 0.6, 3.5], [0, 0.6, 3.5], [2, 0.6, 3.5], [4, 0.6, 3.5],
    [-4, 0.6, 3.9], [-2, 0.6, 3.9], [0, 0.6, 3.9], [2, 0.6, 3.9], [4, 0.6, 3.9],
  ] },
  'Jury': { color: 0xffe4b5, positions: [
    [3.1, 0.7, -3.8], [3.5, 0.7, -3.8], [3.9, 0.7, -3.8],
    [3.1, 0.7, -3.4], [3.5, 0.7, -3.4], [3.9, 0.7, -3.4],
  ] },
  'Spectator': { color: 0xcccccc, positions: [
    [-4, 0.6, 4.5], [-2, 0.6, 4.5], [0, 0.6, 4.5], [2, 0.6, 4.5], [4, 0.6, 4.5],
  ] },
};

// Update function signature
type SceneInitArgs = {
  participants: Participant[];
  evidence: Evidence3D[];
};

// New function to initialize scene with dynamic avatars
export function initCourtroomSceneWithParticipants(container: HTMLDivElement, args: SceneInitArgs) {
  const { participants, evidence } = args;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);
  // Ceiling lights
  for (let i = -2; i <= 2; i += 2) {
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 0.7 })
    );
    lamp.position.set(i * 2, 3.8, 0);
    scene.add(lamp);
  }
  // Wall sconces
  for (let x of [-5.5, 5.5]) {
    for (let y of [1.5, 2.5]) {
      const sconce = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffe4b5, emissive: 0xffe4b5, emissiveIntensity: 0.5 })
      );
      sconce.position.set(x, y, -5.8);
      scene.add(sconce);
    }
  }

  // Animated ceiling fans
  for (let i = -1; i <= 1; i++) {
    scene.add(createFan(i * 2, 3.7, 0));
  }

  // Textured/checkerboard floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xe0cda9, wireframe: false })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);
  // Carpet runner
  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 8),
    new THREE.MeshStandardMaterial({ color: 0xb22222 })
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, 1);
  scene.add(carpet);

  // Baseboards and crown molding
  for (let y of [0.1, 3.9]) {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(12, 0.05, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    base.position.set(0, y, -5.95);
    scene.add(base);
  }

  // Walls and paneling
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 0.2), wallMaterial);
  backWall.position.set(0, 2, -6);
  scene.add(backWall);
  // Paneling
  const panel = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 0.05), panelMaterial);
  panel.position.set(0, 0.5, -5.9);
  scene.add(panel);
  // Columns
  for (let x of [-5, 0, 5]) {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0xd2b48c })
    );
    col.position.set(x, 2, -5.9);
    scene.add(col);
  }
  // Windows
  for (let x of [-4, 4]) {
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.5 })
    );
    windowFrame.position.set(x, 2.5, -5.89);
    scene.add(windowFrame);
  }
  // Left/right/front walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 12), wallMaterial);
  leftWall.position.set(-6, 2, 0);
  scene.add(leftWall);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 12), wallMaterial);
  rightWall.position.set(6, 2, 0);
  scene.add(rightWall);
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 0.2), wallMaterial);
  frontWall.position.set(0, 2, 6);
  scene.add(frontWall);
  // Door frame
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  );
  door.position.set(0, 1, 6.05);
  scene.add(door);

  // Balcony/upper gallery
  const balcony = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  balcony.position.set(0, 2.8, 5.2);
  scene.add(balcony);
  // Balcony rail
  const balconyRail = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.1, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  balconyRail.position.set(0, 2.95, 5.7);
  scene.add(balconyRail);

  // Clock and wall art
  const clock = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 32),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  clock.position.set(0, 3.5, -5.8);
  scene.add(clock);
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x4682b4 })
  );
  art.position.set(-5, 2.5, -5.8);
  scene.add(art);

  // Judge's platform (raised)
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.3, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  platform.position.set(0, 0.15, -4.5);
  scene.add(platform);
  // Steps
  for (let i = 0; i < 2; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(2.5 - i * 0.5, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xdeb887 })
    );
    step.position.set(0, 0.05 + i * 0.1, -4.1 + i * 0.3);
    scene.add(step);
  }
  // Judge's bench
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.8, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  bench.position.set(0, 0.8, -4.5);
  scene.add(bench);
  // Judge's chair
  scene.add(createChair(0, 1.05, -4.7, 0x222222));
  // Judge's nameplate
  scene.add(createNameplate(0, 1.2, -4.2, 'Judge'));
  // Judge's microphone
  scene.add(createMicrophone(0, 1.1, -4.2));
  // Judge's book
  scene.add(createBook(0.2, 1.1, -4.2));

  // Flags/emblems (as planes)
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x0033a0 })
  );
  flag.position.set(-1.2, 2.5, -5.7);
  scene.add(flag);
  const emblem = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  emblem.position.set(1.2, 2.5, -5.7);
  scene.add(emblem);

  // Witness stand
  const witnessStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
    new THREE.MeshStandardMaterial({ color: 0xdeb887 })
  );
  witnessStand.position.set(-2, 0.5, -3.5);
  scene.add(witnessStand);
  // Witness chair
  scene.add(createChair(-2, 0.7, -3.5));
  // Witness nameplate
  scene.add(createNameplate(-2, 0.9, -3.2, 'Witness'));
  // Witness microphone
  scene.add(createMicrophone(-2, 0.8, -3.2));

  // Plaintiff and defendant tables
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const plaintiffTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.6), tableMaterial);
  plaintiffTable.position.set(-1.2, 0.3, -2);
  scene.add(plaintiffTable);
  const defendantTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.6), tableMaterial);
  defendantTable.position.set(1.2, 0.3, -2);
  scene.add(defendantTable);
  // Plaintiff/defendant nameplates, microphones, books
  scene.add(createNameplate(-1.2, 0.5, -1.7, 'Plaintiff'));
  scene.add(createNameplate(1.2, 0.5, -1.7, 'Defendant'));
  scene.add(createMicrophone(-1.2, 0.45, -1.7));
  scene.add(createMicrophone(1.2, 0.45, -1.7));
  scene.add(createBook(-1.1, 0.45, -2));
  scene.add(createBook(1.1, 0.45, -2, 0x336699));

  // Podium
  const podium = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  podium.position.set(0, 0.4, -2.5);
  scene.add(podium);
  // Podium microphone
  scene.add(createMicrophone(0, 0.8, -2.3));

  // Jury box (with seats)
  const juryBox = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1),
    new THREE.MeshStandardMaterial({ color: 0xdeb887 })
  );
  juryBox.position.set(3.5, 0.25, -3.5);
  scene.add(juryBox);
  for (let i = 0; i < 6; i++) {
    scene.add(createChair(3.1 + (i % 3) * 0.4, 0.5, -3.8 + Math.floor(i / 3) * 0.4));
    scene.add(createNameplate(3.1 + (i % 3) * 0.4, 0.7, -3.8 + Math.floor(i / 3) * 0.4, 'Jury'));
  }

  // Railings
  const railingMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  for (let x of [-2.5, 2.5]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 4), railingMaterial);
    rail.position.set(x, 0.35, -0.5);
    scene.add(rail);
  }
  // Rope barriers (gallery)
  for (let i = -2; i <= 2; i++) {
    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    rope.position.set(i * 2, 0.5, 2.5);
    rope.rotation.x = Math.PI / 2;
    scene.add(rope);
  }
  // Gallery/spectator benches
  for (let i = -2; i <= 2; i++) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    bench.position.set(i * 2, 0.15, 3.5);
    scene.add(bench);
    // Add a few chairs to each bench
    for (let j = -1; j <= 1; j++) {
      scene.add(createChair(i * 2 + j * 0.5, 0.35, 3.5));
      scene.add(createNameplate(i * 2 + j * 0.5, 0.55, 3.7, 'Spectator'));
    }
  }
  // Decorative plants
  for (let x of [-5.5, 5.5]) {
    const [pot, leaves] = createPlant(x, 0.12, 5.5);
    scene.add(pot);
    scene.add(leaves);
  }

  // --- Layout refinement for observers/spectators ---
  // If more observers than positions, add more rows dynamically
  function getObserverPositions(count: number): [number, number, number][] {
    const rowLen = 5;
    const rowSpacing = 0.4;
    const colSpacing = 2;
    const baseZ = 3.5;
    let positions: [number, number, number][] = [];
    let rows = Math.ceil(count / rowLen);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < rowLen; c++) {
        if (positions.length >= count) break;
        positions.push([
          -4 + c * colSpacing,
          0.6,
          baseZ + r * rowSpacing
        ]);
      }
    }
    return positions;
  }
  // Count observers
  const observerCount = participants.filter(p => p.role === 'Observer').length;
  if (observerCount > (roleAvatarMap['Observer']?.positions.length || 0)) {
    roleAvatarMap['Observer'].positions = getObserverPositions(observerCount);
  }
  // --- Interactivity: Raycasting for avatars/evidence ---
  // Add a map from mesh.uuid to participant/evidence info
  const avatarInfoMap: Record<string, Participant> = {};
  const evidenceInfoMap: Record<string, Evidence3D> = {};
  // Render avatars for each participant, assigning positions per role
  const roleCounts: Record<string, number> = {};
  participants.forEach((p, idx) => {
    const map = roleAvatarMap[p.role] || { color: 0x888888, positions: [[0, 0.6, 3.5 + idx]] };
    const posIdx = roleCounts[p.role] || 0;
    const pos = map.positions[posIdx % map.positions.length];
    roleCounts[p.role] = posIdx + 1;
    const bust = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshStandardMaterial({ color: map.color })
    );
    bust.position.set(...pos);
    scene.add(bust);
    avatarInfoMap[bust.uuid] = p;
    // Add floating label
    const label = createTextSprite(p.displayName || p.role);
    label.position.set(pos[0], pos[1] + 0.15, pos[2]);
    scene.add(label);
  });
  // Evidence presentation: place evidence panels on the plaintiff/defendant table
  const evidenceStartX = -0.8;
  const evidenceStartZ = -1.7;
  const evidenceSpacing = 0.5;
  evidence.forEach((ev, idx) => {
    const isImage = ev.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    let panel: THREE.Mesh;
    if (isImage) {
      const tex = new THREE.TextureLoader().load(ev.url);
      panel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.25),
        new THREE.MeshBasicMaterial({ map: tex })
      );
    } else {
      panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
      );
    }
    panel.position.set(evidenceStartX + idx * evidenceSpacing, 0.6, evidenceStartZ);
    scene.add(panel);
    evidenceInfoMap[panel.uuid] = ev;
    // Floating label for description/uploader
    const label = createTextSprite(ev.description + '\nBy: ' + ev.uploader, '#222', 32, 'rgba(255,255,255,0.95)');
    label.position.set(evidenceStartX + idx * evidenceSpacing, 0.8, evidenceStartZ);
    scene.add(label);
  });
  // --- HTML overlay for info popups ---
  let overlay = document.getElementById('courtroom-info-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'courtroom-info-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '10%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.background = 'rgba(255,255,255,0.98)';
    overlay.style.border = '2px solid #bfa14a';
    overlay.style.borderRadius = '12px';
    overlay.style.padding = '18px 28px';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'none';
    overlay.style.minWidth = '260px';
    overlay.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
    document.body.appendChild(overlay);
  }
  function showOverlay(html: string) {
    overlay!.innerHTML = html + '<br/><button id="close-courtroom-overlay">Close</button>';
    overlay!.style.display = 'block';
    document.getElementById('close-courtroom-overlay')?.addEventListener('click', () => {
      overlay!.style.display = 'none';
    });
  }
  // Raycaster for picking
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('pointerdown', (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (avatarInfoMap[obj.uuid]) {
        const p = avatarInfoMap[obj.uuid];
        showOverlay(`<b>Role:</b> ${p.role}<br/><b>Name:</b> ${p.displayName || ''}<br/><b>Principal:</b> ${p.principal}`);
      } else if (evidenceInfoMap[obj.uuid]) {
        const ev = evidenceInfoMap[obj.uuid];
        let html = `<b>Description:</b> ${ev.description}<br/><b>Uploader:</b> ${ev.uploader}<br/><b>URL:</b> <a href='${ev.url}' target='_blank'>${ev.url}</a>`;
        if (ev.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          html += `<br/><img src='${ev.url}' style='max-width:220px;max-height:120px;margin-top:8px;'/>`;
        }
        showOverlay(html);
      }
    }
  });
  // Highlight avatars/evidence on hover
  renderer.domElement.addEventListener('pointermove', (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    scene.traverse(obj => {
      if (obj instanceof THREE.Mesh && (avatarInfoMap[obj.uuid] || evidenceInfoMap[obj.uuid])) {
        (obj.material as any).emissive = (obj.material as any).emissive || { set: () => {} };
        (obj.material as any).emissive.set(0x000000);
      }
    });
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj instanceof THREE.Mesh && (avatarInfoMap[obj.uuid] || evidenceInfoMap[obj.uuid])) {
        (obj.material as any).emissive = (obj.material as any).emissive || { set: () => {} };
        (obj.material as any).emissive.set(0xbfa14a);
      }
    }
  });

  // Animation loop (with animated fans and billboarding labels)
  renderer.setAnimationLoop(() => {
    // Animate ceiling fans
    scene.traverse(obj => {
      if (obj.name === 'ceilingFan') {
        obj.rotation.y += 0.1;
      }
      // Billboard all Sprites (labels) to face the camera
      if (obj.type === 'Sprite') {
        obj.quaternion.copy(camera.quaternion);
      }
    });
    renderer.render(scene, camera);
  });

  return { scene, camera, renderer };
} 