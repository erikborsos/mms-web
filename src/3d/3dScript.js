import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create the main 3D scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    alpha: true,        // Make background transparent
    antialias: true     // Smooth edges
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fully transparent background
camera.position.set(-0.63, 0.63, -2); // Set initial camera position

// Add soft ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

// Enable mouse controls (rotate, zoom, pan)
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Load a 3D model (GLTF format)
const loader = new GLTFLoader();
let model;
let mixer;

loader.load(
    '3d_object.gltf', // Path to 3D model
    function (gltf) {
        model = gltf.scene;
        model.position.set(0.3, -0.5, -0.1);
        model.scale.set(0.3, 0.3, 0.3);
        model.rotation.set(0, -2.7, 0);
        scene.add(model);

        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the GLTF model:', error);
    }
);

// Clock for animation timing
const clock = new THREE.Clock();

// Check if the website is in dark mode (based on HTML class)
function isDarkMode() {
    return document.documentElement.classList.contains("dark");
}

// Array to store star meshes
const stars = [];

// Create random stars (small spheres) in the scene
function addStar() {
    const geometry = new THREE.SphereGeometry(Math.random() + 0.5, 32, 32);
    const color = isDarkMode() ? 0xffffff : 0x000000; // White in dark mode, black otherwise
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    mesh.position.set(x, y, z);
    scene.add(mesh);
    stars.push(mesh); // Store the star mesh
}

// Add 200 stars to the scene
Array(200).fill().forEach(addStar);

// Update star colors when dark mode changes
function updateStarColors() {
    const color = isDarkMode() ? 0xffffff : 0x000000;
    stars.forEach((star) => {
        star.material.color.setHex(color);
    });
}

// Observe changes to the dark mode class
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            updateStarColors();
        }
    });
});
observer.observe(document.documentElement, { attributes: true });

// Zoom camera settings
let zoomProgress = 0;
const initialCamPos = new THREE.Vector3(-4, 4, -6);
const targetCamPos = new THREE.Vector3(-0.63, 0.63, -2);

// Main animation loop
function animate() {
    requestAnimationFrame(animate); // Keep looping

    const delta = clock.getDelta(); // Time between frames

    if (mixer) mixer.update(delta); // Update model animation
    orbitControls.update();         // Update camera movement

    //Zoom
    if (zoomProgress < 1) {
        orbitControls.enabled = false; // camera lock
        zoomProgress += delta * 0.6; // zoom speed
        zoomProgress = Math.min(zoomProgress, 1);
        camera.position.lerpVectors(initialCamPos, targetCamPos, zoomProgress);
    }else{
        orbitControls.enabled = true; // camera unlock
    }

    renderer.render(scene, camera); // Draw the scene
}
animate(); // Start the animation loop
