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
	Clock,
} from "three";
import "./style.css";
import {
	EffectComposer,
	RenderPass,
	UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

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

const gridSize = 140;
const planeGeometry = new PlaneGeometry(gridSize * 5, gridSize * 5);
const planeMaterial = new MeshStandardMaterial({
	color: 0xffffff,
});
const plane = new Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -(Math.PI / 2);

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshStandardMaterial({ color: 0xffffff });
const cubeEmissionMaterial = new MeshStandardMaterial({
	color: 0xefbf04,
	emissive: 0xefbf04,
	emissiveIntensity: 1,
});
const cubes = []; // Array to store individual cubes

const ambientLight = new AmbientLight(0xffffff, 1);
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 0);

const spacing = 1.1;

const offset = (gridSize * spacing) / 2;

for (let row = 0; row < gridSize; row++) {
	for (let col = 0; col < gridSize; col++) {
		const position = new Vector3(
			col * spacing - offset, // Shift by offset to center
			0.5,
			row * spacing - offset // Shift by offset to center
		);
		const cube = new Mesh(cubeGeometry, cubeMaterial);
		cube.position.copy(position); // Set the position of the cube
		cubes.push(cube);
		scene.add(cube); // Add the cube to the scene
	}
}

scene.add(ambientLight);
scene.add(directionalLight);
scene.add(plane);

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

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
	new Vector2(window.innerWidth, window.innerHeight),
	0.15, // Strength of the bloom
	0.4, // Radius of the bloom
	0.85 // Threshold (how bright something needs to be to bloom)
);
composer.addPass(bloomPass);

const clock = new Clock();

function animate() {
	const elapsedTime = clock.getElapsedTime();

	raycaster.setFromCamera(mouse, camera);
	const intersection = raycaster.intersectObjects(cubes); // Raycasting to all cubes

	if (intersection.length > 0) {
		const intersectedCube = intersection[0].object; // Get the intersected cube

		const radius = 5;
		const radiusSquared = radius * radius;

		cubes.forEach((cube) => {
			// Use forEach to iterate over all cubes
			const distanceSquared = cube.position.distanceToSquared(
				intersectedCube.position
			);

			if (distanceSquared <= radiusSquared) {
				const distance = Math.sqrt(distanceSquared);
				const falloff = 2.5 - distance / radius;
				const lift = falloff * 2; // Max lift = 2

				// Apply pulse effect with sin wave
				const pulse = Math.sin(elapsedTime * 4.0 - distance * 1.5) * 0.25;

				cube.position.y += (lift + pulse - cube.position.y) * 0.2;
				cube.material = cubeEmissionMaterial;
			} else {
				cube.position.y = Math.max(0.5, cube.position.y - 0.05); // Gradually return to original position
				cube.material = cubeMaterial;
			}
		});
	}

	requestAnimationFrame(animate);
	composer.render();
}

animate();
