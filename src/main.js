import {
	AmbientLight,
	BoxGeometry,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";
import { log, vec3 } from "three/tsl";
import { DirectionalLight, MeshStandardMaterial, Vector3 } from "three/webgpu";

// Scene, Camera, Renderer
const scene = new Scene();
const camera = new PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new PlaneGeometry(20, 20);
const planeMaterial = new MeshStandardMaterial({
	color: 0xffffff,
});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI / 2);

const gridSize = 10;
const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshStandardMaterial({ color: 0xffffff });
const cube = new InstancedMesh(
	cubeGeometry,
	cubeMaterial,
	Math.pow(gridSize, 2)
);
cube.position.set(-(gridSize / 2), 0.5, -(gridSize / 2));

const ambientLight = new AmbientLight(0xffffff, 1);
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 0);

const spacing = 1.1;

for (let index = 0; index < cube.count; index++) {
	const row = Math.floor(index / gridSize);
	const col = index % gridSize;

	const position = new Vector3(col * spacing, 0, row * spacing);

	const instanceMatrix = new Matrix4();
	instanceMatrix.setPosition(position);
	cube.setMatrixAt(index, instanceMatrix);
}

scene.add(ambientLight);
scene.add(directionalLight);
scene.add(plane);
scene.add(cube);

// Resize Handler
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

controls.update();

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
