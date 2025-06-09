import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    alpha: true,              // Allow transparency
    antialias: true           // Optional, smoother edges
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background
camera.position.set(-0.63,0.63,-2);

const ambientLight = new THREE.AmbientLight(0xffffff,5);
scene.add(ambientLight);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
let model;
let mixer;

loader.load(
    '3d_object.gltf', // Replace with your actual model path
    function (gltf) {
        model = gltf.scene;
        model.position.set(0.3, -0.5, -0.1);
        model.scale.set(0.3, 0.3, 0.3);
        model.rotation.set(0,-2.7,0);// Move model to the origin
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

const clock = new THREE.Clock();

function addStar(){
    const geometry =  new THREE.SphereGeometry(Math.random() + 0.5, 32, 32);
    const meterial = new THREE.MeshStandardMaterial({color: 0x000000});
    const mesh = new THREE.Mesh(geometry, meterial);

    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    mesh.position.set(x,y,z);
    scene.add(mesh);
}

Array(200).fill().forEach(addStar);

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    orbitControls.update()

    console.log(camera)

    renderer.render(scene, camera);
}
animate();
