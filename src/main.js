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
	Color,
	Vector2,
	Raycaster,
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

const raycaster = new Raycaster();
const mouse = new Vector2(1, 1);

const color = new Color();
const white = new Color().setHex(0xffffff);

const gridSize = 140;
const planeGeometry = new PlaneGeometry(gridSize * 5, gridSize * 5);
const planeMaterial = new MeshStandardMaterial({
	color: 0xffffff,
});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI / 2);

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshStandardMaterial({ color: 0xffffff });
const cubes = new InstancedMesh(
	cubeGeometry,
	cubeMaterial,
	Math.pow(gridSize, 2)
);
cubes.position.set(-(gridSize / 2), 0.5, -(gridSize / 2));

const ambientLight = new AmbientLight(0xffffff, 1);
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 0);

const spacing = 1.1;
let index = 0;

for (let row = 0; row < gridSize; row++) {
	for (let col = 0; col < gridSize; col++) {
		const position = new Vector3(col * spacing, 0, row * spacing);

		const instanceMatrix = new Matrix4();
		instanceMatrix.setPosition(position);
		cubes.setMatrixAt(index, instanceMatrix);
		cubes.setColorAt(index, white);

		index++;
	}
}

scene.add(ambientLight);
scene.add(directionalLight);
scene.add(plane);
scene.add(cubes);

window.addEventListener("pointermove", (event) => {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

function animate() {
	raycaster.setFromCamera(mouse, camera);

	const intersection = raycaster.intersectObject(cubes);

	if (intersection.length > 0) {
		const instanceId = intersection[0].instanceId;

		cubes.getColorAt(instanceId, color);

		if (color.equals(white)) {
			cubes.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));

			cubes.instanceColor.needsUpdate = true;
		}
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
