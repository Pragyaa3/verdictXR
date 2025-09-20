import * as THREE from 'three';

// Courtroom scene creation and geometry
export class CourtroomScene {
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

        // Front wall (behind gallery)
        const frontWall = new THREE.Mesh(backWallGeometry, this.materials.wall);
        frontWall.position.set(0, 6, 20);
        frontWall.receiveShadow = true;
        this.scene.add(frontWall);
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

        // Microphone
        const micStandGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
        const micStand = new THREE.Mesh(micStandGeometry, this.materials.metal);
        micStand.castShadow = true;
        micStand.position.set(-7.5, 3.5, -8);
        this.scene.add(micStand);

        const micGeometry = new THREE.SphereGeometry(0.1);
        const mic = new THREE.Mesh(micGeometry, this.materials.metal);
        mic.castShadow = true;
        mic.position.set(-7.5, 4, -8);
        this.scene.add(mic);
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

        // Chair legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8 * scale);
        const legPositions = [
            [x - 0.3 * scale, y - 0.4 * scale, z - 0.3 * scale],
            [x + 0.3 * scale, y - 0.4 * scale, z - 0.3 * scale],
            [x - 0.3 * scale, y - 0.4 * scale, z + 0.3 * scale],
            [x + 0.3 * scale, y - 0.4 * scale, z + 0.3 * scale]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, this.materials.metal);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });
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

        // Slanted top
        const topGeometry = new THREE.BoxGeometry(1, 0.1, 0.8);
        const top = new THREE.Mesh(topGeometry, this.materials.wood);
        top.position.set(0, 1.25, 5);
        top.rotation.x = -0.2;
        top.castShadow = true;
        top.receiveShadow = true;
        this.scene.add(top);
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
        flag.castShadow = true;
        this.scene.add(flag);

        // Scales of justice (symbolic)
        const scaleBaseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1);
        const scaleBase = new THREE.Mesh(scaleBaseGeometry, this.materials.metal);
        scaleBase.castShadow = true;
        scaleBase.position.set(2, 3.1, -15);
        this.scene.add(scaleBase);

        // Court seal on wall
        const sealGeometry = new THREE.CircleGeometry(1, 32);
        const sealMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const seal = new THREE.Mesh(sealGeometry, sealMaterial);
        seal.receiveShadow = true;
        seal.position.set(0, 8, -19.9);
        this.scene.add(seal);
    }
// ...existing code...
}
