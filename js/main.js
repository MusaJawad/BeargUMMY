//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";




//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(6, window.innerWidth / 600, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
// let mouseX = window.innerWidth / 2;
// let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

let mixer;


//Set which object to render
let objToRender = 'psy';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
    // If the model has animations
    if (gltf.animations && gltf.animations.length > 0) {
        // Initialize the mixer
        mixer = new THREE.AnimationMixer(object);
  
        // Play the first animation (you can loop through others if necessary)
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background // Antialias makes black baground
renderer.setSize(window.innerWidth, 600);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
if (objToRender == "dino"){
    camera.position.z = objToRender === "dino" ? 25 : 40;
}
camera.position.set(100, 20, -40); // x=0 (centered horizontally), y=5 (slightly above), z=40 (distance)



//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensity)
topLight.position.set(500, 500, 250) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);


//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}
if (objToRender === "gummy") {
    // This adds controls to the camera, so we can rotate / zoom it with the mouse
    controls = new OrbitControls(camera, renderer.domElement);

    // Set zoom limits (minDistance = closest, maxDistance = farthest)
    controls.minDistance = 800; // Adjust this value to set the minimum zoom distance
    controls.maxDistance = 1000; // Adjust this value to set the maximum zoom distance


    // Restrict the vertical rotation to prevent the model from being rotated upside down
    controls.minPolarAngle = Math.PI / 3; // Lower limit (around 60 degrees)
    controls.maxPolarAngle = Math.PI / 2.1; // Upper limit (90 degrees)

    // Optionally, restrict horizontal rotation if needed
    // controls.minAzimuthAngle = -Math.PI / 4; // Minimum horizontal rotation (optional)
    // controls.maxAzimuthAngle = Math.PI / 4;  // Maximum horizontal rotation (optional)
}
if (objToRender === "psy") {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50; // Adjust this value to set the minimum zoom distance
    controls.maxDistance = 100; // Adjust this value to set the maximum zoom distance
    // controls.minPolarAngle = Math.PI / 3; // Lower limit (around 60 degrees)
     controls.maxPolarAngle = Math.PI / 2.8; // Upper limit (90 degrees)
  }

  if (controls) {
    controls.target.set(0, 2, 8); // Adjust x value to move the focus left
    controls.update(); // Update controls to apply changes
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

    // Update the mixer for animations
  if (mixer) {
      const delta = clock.getDelta(); // clock is needed to control time
      mixer.update(delta); // Update the mixer on each frame
      }


  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  const container = document.getElementById('container3D');
  const width = container.offsetHeight;
  const height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering

const clock = new THREE.Clock();
animate();






