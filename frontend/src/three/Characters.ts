import * as THREE from 'three';

export class Characters {
    scene: THREE.Scene;
    materials: any;
    constructor(scene: THREE.Scene) {
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
        this.createJudge(0, 3.5, -16);
        this.createLawyer(-6, 0.8, -1, 'prosecution');
        this.createLawyer(6, 0.8, -1, 'defense');
        this.createBailiff(-10, 0, -5);
        this.createCourtReporter(8, 0, -5);
    }

    createJudge(x: number, y: number, z: number) {
        const judgeGroup = new THREE.Group();
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5);
        const body = new THREE.Mesh(bodyGeometry, this.materials.blackRobe);
        body.position.set(0, 0.75, 0);
        judgeGroup.add(body);
        const headGeometry = new THREE.SphereGeometry(0.25);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.7, 0);
        judgeGroup.add(head);
        const hairGeometry = new THREE.SphereGeometry(0.27);
        const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
        hair.position.set(0, 1.8, 0);
        hair.scale.set(1, 0.6, 1);
        judgeGroup.add(hair);
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8);
        const leftArm = new THREE.Mesh(armGeometry, this.materials.blackRobe);
        leftArm.position.set(-0.5, 1, 0);
        leftArm.rotation.z = 0.3;
        judgeGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, this.materials.blackRobe);
        rightArm.position.set(0.5, 1, 0);
        rightArm.rotation.z = -0.3;
        judgeGroup.add(rightArm);
        const handGeometry = new THREE.SphereGeometry(0.08);
        const leftHand = new THREE.Mesh(handGeometry, this.materials.skin);
        leftHand.position.set(-0.7, 0.6, 0);
        judgeGroup.add(leftHand);
        const rightHand = new THREE.Mesh(handGeometry, this.materials.skin);
        rightHand.position.set(0.7, 0.6, 0);
        judgeGroup.add(rightHand);
        const gavelGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
        const gavel = new THREE.Mesh(gavelGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        gavel.position.set(0.7, 0.6, 0);
        gavel.rotation.z = Math.PI / 4;
        judgeGroup.add(gavel);
        judgeGroup.position.set(x, y, z);
        this.scene.add(judgeGroup);
    }

    createLawyer(x: number, y: number, z: number, type: string) {
        const lawyerGroup = new THREE.Group();
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2);
        const suitColor = type === 'prosecution' ? 0x191970 : 0x2F4F4F;
        const suitMaterial = new THREE.MeshLambertMaterial({ color: suitColor });
        const body = new THREE.Mesh(bodyGeometry, suitMaterial);
        body.position.set(0, 0.6, 0);
        lawyerGroup.add(body);
        const headGeometry = new THREE.SphereGeometry(0.2);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.4, 0);
        lawyerGroup.add(head);
        const hairGeometry = new THREE.SphereGeometry(0.22);
        const hair = new THREE.Mesh(hairGeometry, this.materials.hair);
        hair.position.set(0, 1.5, 0);
        hair.scale.set(1, 0.7, 1);
        lawyerGroup.add(hair);
        const collarGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2);
        const collar = new THREE.Mesh(collarGeometry, this.materials.shirt);
        collar.position.set(0, 1.1, 0);
        lawyerGroup.add(collar);
        const tieGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.02);
        const tie = new THREE.Mesh(tieGeometry, this.materials.tie);
        tie.position.set(0, 0.9, 0.25);
        lawyerGroup.add(tie);
        const armGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.7);
        const leftArm = new THREE.Mesh(armGeometry, suitMaterial);
        leftArm.position.set(-0.4, 0.8, 0);
        leftArm.rotation.z = 0.2;
        lawyerGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, suitMaterial);
        rightArm.position.set(0.4, 0.8, 0);
        rightArm.rotation.z = -0.2;
        lawyerGroup.add(rightArm);
        const handGeometry = new THREE.SphereGeometry(0.06);
        const leftHand = new THREE.Mesh(handGeometry, this.materials.skin);
        leftHand.position.set(-0.5, 0.5, 0);
        lawyerGroup.add(leftHand);
        const rightHand = new THREE.Mesh(handGeometry, this.materials.skin);
        rightHand.position.set(0.5, 0.5, 0);
        lawyerGroup.add(rightHand);
        const briefcaseGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1);
        const briefcaseMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const briefcase = new THREE.Mesh(briefcaseGeometry, briefcaseMaterial);
        briefcase.position.set(0.7, 0.15, 0);
        lawyerGroup.add(briefcase);
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8);
        const leftLeg = new THREE.Mesh(legGeometry, suitMaterial);
        leftLeg.position.set(-0.15, -0.4, 0);
        lawyerGroup.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeometry, suitMaterial);
        rightLeg.position.set(0.15, -0.4, 0);
        lawyerGroup.add(rightLeg);
        const shoeGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.3);
        const shoeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(-0.15, -0.8, 0.1);
        lawyerGroup.add(leftShoe);
        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0.15, -0.8, 0.1);
        lawyerGroup.add(rightShoe);
        lawyerGroup.position.set(x, y, z);
        this.scene.add(lawyerGroup);
    }

    createBailiff(x: number, y: number, z: number) {
        const bailiffGroup = new THREE.Group();
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2);
        const uniformMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
        const body = new THREE.Mesh(bodyGeometry, uniformMaterial);
        body.position.set(0, 0.6, 0);
        bailiffGroup.add(body);
        const headGeometry = new THREE.SphereGeometry(0.18);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.3, 0);
        bailiffGroup.add(head);
        const badgeGeometry = new THREE.CircleGeometry(0.05);
        const badgeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
        const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
        badge.position.set(-0.2, 0.9, 0.3);
        bailiffGroup.add(badge);
        bailiffGroup.position.set(x, y, z);
        this.scene.add(bailiffGroup);
    }

    createCourtReporter(x: number, y: number, z: number) {
        const reporterGroup = new THREE.Group();
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.35, 1);
        const body = new THREE.Mesh(bodyGeometry, this.materials.suit);
        body.position.set(0, 0.5, 0);
        reporterGroup.add(body);
        const headGeometry = new THREE.SphereGeometry(0.16);
        const head = new THREE.Mesh(headGeometry, this.materials.skin);
        head.position.set(0, 1.2, 0);
        reporterGroup.add(head);
        const machineGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.3);
        const machineMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F });
        const machine = new THREE.Mesh(machineGeometry, machineMaterial);
        machine.position.set(0, 0.8, 0.2);
        reporterGroup.add(machine);
        reporterGroup.position.set(x, y, z);
        this.scene.add(reporterGroup);
    }

    animateCharacters(time: number) {
        this.scene.traverse((child: any) => {
            if (child.userData.isCharacter) {
                child.position.y += Math.sin(time * 2) * 0.002;
            }
        });
    }
}
