import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


// Tạo scene và camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Load ảnh từ thư mục public
const loader = new THREE.TextureLoader();

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();

// Thêm mặt phẳng
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ map: loader.load('/sky.jpg') })
);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Box
const box = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({ map: loader.load('/box.jpg') })
);
box.position.set(-5, 5, 1);
box.castShadow = true;
scene.add(box);

// Light
scene.add(new THREE.AmbientLight(0x404040));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(-50, 50, 0);
dirLight.castShadow = true;
scene.add(dirLight);
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;


// Fog
scene.fog = new THREE.Fog(0xffffff, 0, 200);

// Tạo sphere khi load xong texture
const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: loader.load('/wood.jpg') });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(5, 3, 0);
sphere.castShadow = true;
scene.add(sphere);

// GUI
const gui = new dat.GUI();
const options = {
  BackgroundColor: 0x201d1d,
  wireframe: false,
  speed: 0.01
};

scene.background = new THREE.Color(0x201d1d);

gui.addColor(options, 'BackgroundColor').onChange((e) => {
  scene.background = new THREE.Color(e);
});
gui.add(options, 'wireframe').onChange((e) => {
  if (sphere) sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);

// Animation
let step = 0;
function animate() {
  step += options.speed;
  box.rotation.x = step;
  box.rotation.y = step;
  sphere.position.y = 6.7 + Math.sin(step) * 5;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
