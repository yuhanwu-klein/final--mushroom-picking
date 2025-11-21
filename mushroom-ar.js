import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// Scene setup
let scene, camera, renderer, controls;
let mushrooms = [];
let arMode = false;

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add ground
    const groundGeometry = new THREE.CircleGeometry(10, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d5016,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add some initial mushrooms
    addMushroomCluster();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createMushroom(x, y, z, scale = 1, colorScheme = null) {
    const mushroomGroup = new THREE.Group();

    // Color schemes for different mushroom types
    const colorSchemes = [
        { cap: 0xff4444, spots: 0xffffff, stem: 0xffeecc }, // Red with white spots (classic)
        { cap: 0xff8800, spots: 0xffff00, stem: 0xffd4a3 }, // Orange with yellow spots
        { cap: 0x8844ff, spots: 0xff00ff, stem: 0xe6ccff }, // Purple with magenta spots
        { cap: 0x00ffff, spots: 0x0088ff, stem: 0xccf5ff }, // Cyan with blue spots
        { cap: 0xff1493, spots: 0xffb6c1, stem: 0xffe4e9 }, // Pink with light pink spots
        { cap: 0x00ff88, spots: 0xffff00, stem: 0xccffee }, // Green with yellow spots
        { cap: 0xff6600, spots: 0xffd700, stem: 0xffeedd }, // Orange-red with gold spots
        { cap: 0x9400d3, spots: 0xda70d6, stem: 0xf0d5ff }, // Dark violet with orchid spots
    ];

    const colors = colorScheme || colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(
        0.15 * scale,
        0.2 * scale,
        1 * scale,
        16
    );
    const stemMaterial = new THREE.MeshStandardMaterial({
        color: colors.stem,
        roughness: 0.7,
        metalness: 0.1
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.5 * scale;
    stem.castShadow = true;
    mushroomGroup.add(stem);

    // Create cap
    const capGeometry = new THREE.SphereGeometry(0.5 * scale, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMaterial = new THREE.MeshStandardMaterial({
        color: colors.cap,
        roughness: 0.6,
        metalness: 0.2
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1 * scale;
    cap.castShadow = true;
    mushroomGroup.add(cap);

    // Add spots on cap
    const spotsCount = Math.floor(Math.random() * 8) + 5;
    for (let i = 0; i < spotsCount; i++) {
        const spotSize = (Math.random() * 0.08 + 0.05) * scale;
        const spotGeometry = new THREE.SphereGeometry(spotSize, 16, 16);
        const spotMaterial = new THREE.MeshStandardMaterial({
            color: colors.spots,
            roughness: 0.5,
            metalness: 0.3
        });
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 0.35 * scale;
        const height = Math.sqrt(Math.max(0, (0.5 * scale) ** 2 - distance ** 2));

        spot.position.x = Math.cos(angle) * distance;
        spot.position.z = Math.sin(angle) * distance;
        spot.position.y = 1 * scale + height + spotSize * 0.5;

        mushroomGroup.add(spot);
    }

    // Create gills under the cap
    const gillsGeometry = new THREE.CylinderGeometry(
        0.45 * scale,
        0.48 * scale,
        0.1 * scale,
        32
    );
    const gillsMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.9,
        metalness: 0.0
    });
    const gills = new THREE.Mesh(gillsGeometry, gillsMaterial);
    gills.position.y = 0.95 * scale;
    mushroomGroup.add(gills);

    mushroomGroup.position.set(x, y, z);

    // Add random rotation
    mushroomGroup.rotation.y = Math.random() * Math.PI * 2;

    // Add slight tilt
    const tilt = (Math.random() - 0.5) * 0.2;
    mushroomGroup.rotation.z = tilt;

    scene.add(mushroomGroup);
    mushrooms.push(mushroomGroup);

    return mushroomGroup;
}

function addRandomMushroom() {
    const x = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 8;
    const scale = Math.random() * 0.5 + 0.5;

    createMushroom(x, 0, z, scale);
}

function addMushroomCluster() {
    const centerX = (Math.random() - 0.5) * 6;
    const centerZ = (Math.random() - 0.5) * 6;
    const clusterSize = Math.floor(Math.random() * 5) + 3;

    // Pick a random color scheme for the cluster
    const colorSchemes = [
        { cap: 0xff4444, spots: 0xffffff, stem: 0xffeecc },
        { cap: 0xff8800, spots: 0xffff00, stem: 0xffd4a3 },
        { cap: 0x8844ff, spots: 0xff00ff, stem: 0xe6ccff },
        { cap: 0x00ffff, spots: 0x0088ff, stem: 0xccf5ff },
        { cap: 0xff1493, spots: 0xffb6c1, stem: 0xffe4e9 },
        { cap: 0x00ff88, spots: 0xffff00, stem: 0xccffee },
    ];
    const clusterColor = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

    for (let i = 0; i < clusterSize; i++) {
        const angle = (i / clusterSize) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * 1.5;
        const x = centerX + Math.cos(angle) * distance;
        const z = centerZ + Math.sin(angle) * distance;
        const scale = Math.random() * 0.4 + 0.4;

        createMushroom(x, 0, z, scale, clusterColor);
    }
}

function clearMushrooms() {
    mushrooms.forEach(mushroom => {
        scene.remove(mushroom);
    });
    mushrooms = [];
}

function startAR() {
    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
            if (supported) {
                // Clear scene background for AR
                scene.background = null;

                // Add AR button
                const arButton = ARButton.createButton(renderer, {
                    requiredFeatures: ['hit-test'],
                    optionalFeatures: ['dom-overlay'],
                    domOverlay: { root: document.body }
                });
                document.body.appendChild(arButton);

                arMode = true;
            } else {
                alert('AR not supported on this device. Enjoy the 3D view!');
            }
        });
    } else {
        alert('WebXR not available. Enjoy the 3D view!');
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    controls.update();

    // Add gentle bobbing animation to mushrooms
    const time = Date.now() * 0.001;
    mushrooms.forEach((mushroom, index) => {
        const offset = index * 0.5;
        mushroom.position.y = Math.sin(time + offset) * 0.05;
    });

    renderer.render(scene, camera);
}

// Make functions globally available
window.addRandomMushroom = addRandomMushroom;
window.addMushroomCluster = addMushroomCluster;
window.clearMushrooms = clearMushrooms;
window.startAR = startAR;
