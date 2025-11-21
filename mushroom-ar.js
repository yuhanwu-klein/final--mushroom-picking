import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// Scene setup
let scene, camera, renderer, controls;
let mushrooms = [];
let arMode = false;
let glassLandscape = null;

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

    // Add glass landscape
    glassLandscape = createGlassLandscape();

    // Add some initial mushrooms
    addMushroomCluster();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createGlassLandscape() {
    const landscapeGroup = new THREE.Group();

    // Define the layers with different shapes and sizes to create topographic effect
    const layers = [
        // Bottom layers (larger, more spread out)
        { points: generateContourPoints(3.5, 0.8, 12), height: 0.05, scale: 1.0 },
        { points: generateContourPoints(3.3, 0.7, 12), height: 0.15, scale: 0.95 },
        { points: generateContourPoints(3.0, 0.6, 11), height: 0.28, scale: 0.88 },
        { points: generateContourPoints(2.7, 0.55, 11), height: 0.43, scale: 0.80 },
        { points: generateContourPoints(2.4, 0.5, 10), height: 0.60, scale: 0.72 },
        { points: generateContourPoints(2.1, 0.45, 10), height: 0.79, scale: 0.64 },
        { points: generateContourPoints(1.8, 0.4, 9), height: 1.00, scale: 0.56 },
        { points: generateContourPoints(1.5, 0.35, 9), height: 1.23, scale: 0.48 },
        { points: generateContourPoints(1.2, 0.3, 8), height: 1.48, scale: 0.40 },
        { points: generateContourPoints(0.9, 0.25, 8), height: 1.75, scale: 0.32 },
        // Top layers (smaller, creating peak)
        { points: generateContourPoints(0.7, 0.2, 7), height: 2.04, scale: 0.25 },
        { points: generateContourPoints(0.5, 0.15, 7), height: 2.35, scale: 0.18 },
        { points: generateContourPoints(0.35, 0.1, 6), height: 2.68, scale: 0.12 },
        { points: generateContourPoints(0.22, 0.08, 6), height: 3.03, scale: 0.08 },
    ];

    layers.forEach((layer, index) => {
        const glassLayer = createGlassLayer(layer.points, layer.height, index);
        landscapeGroup.add(glassLayer);
    });

    landscapeGroup.position.set(-3, 0, -2);
    scene.add(landscapeGroup);

    return landscapeGroup;
}

function generateContourPoints(baseRadius, variation, segments) {
    const points = [];

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        // Create organic mountain-like contours with multiple frequency variations
        const noise1 = Math.sin(angle * 3) * 0.3;
        const noise2 = Math.sin(angle * 5) * 0.15;
        const noise3 = Math.cos(angle * 2) * 0.2;

        const radius = baseRadius + (noise1 + noise2 + noise3) * variation;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        points.push(new THREE.Vector2(x, y));
    }

    return points;
}

function createGlassLayer(points, height, layerIndex) {
    // Create shape from points
    const shape = new THREE.Shape(points);

    // Extrude settings for thin glass sheet
    const extrudeSettings = {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Glass material with cyan/teal color and transparency
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x40e0d0, // Turquoise/cyan color
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9, // Glass-like light transmission
        thickness: 0.5,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false, // Important for proper transparency rendering
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = height;
    mesh.rotation.x = Math.PI / 2; // Rotate to be horizontal

    // Add black contour edges like in the reference image
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 2,
        transparent: true,
        opacity: 0.6
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);

    return mesh;
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

function toggleLandscape() {
    if (glassLandscape) {
        glassLandscape.visible = !glassLandscape.visible;
    }
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
window.toggleLandscape = toggleLandscape;
window.startAR = startAR;
