import {
	AmbientLight,
	BoxGeometry,
	InstancedMesh,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";

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

const planeGeometry = new PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI / 2);

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshBasicMaterial({ color: 0xff0000 });
const cube = new InstancedMesh(cubeGeometry, cubeMaterial, 1);

const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

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
