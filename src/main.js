import {
	AmbientLight,
	BoxGeometry,
	InstancedMesh,
	Matrix4,
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	WebGLRenderer,
	DirectionalLight,
	Fog,
	MeshStandardMaterial,
	Vector3,
} from "three";
import "./style.css";

const scene = new Scene();
scene.fog = new Fog(0xcccccc, 15, 50);

const camera = new PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(7.5, 10, 7.5);
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gridSize = 140;
const planeGeometry = new PlaneGeometry(gridSize * 5, gridSize * 5);
const planeMaterial = new MeshStandardMaterial({
	color: 0xffffff,
});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI / 2);

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

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
