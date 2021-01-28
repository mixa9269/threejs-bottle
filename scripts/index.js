var camera, scene, renderer;
var bottle, cube_geometry, cube_material;
var controls;
var light;
let bottleObj;

window.addEventListener("message", function(data) {
  if (!data.data) {
    return;
  }
  const message = JSON.parse(data.data);
  switch (message.type) {
    case 'loadBottle':
      loadBottle(message.bottle, message.label);
      break;
    default:
      break;
  }
})

init();
window.ReactNativeWebView?.postMessage("inited");

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;
  camera.position.y = 0;

  // Lights

  light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  light = new THREE.PointLight(0xffffff);
  light.position.z = 2.5;
  light.position.y = 0;
  light.position.x = -250;
  light.intensity = 0.5;
  scene.add(light);

  light = new THREE.PointLight(0xffffff);
  light.position.z = 2.5;
  light.position.y = 0;
  light.position.x = 250;
  light.intensity = 0.5;
  scene.add(light);

  // controls

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.addEventListener("change", render);
  controls.enableZoom = false;

  // events

  window.addEventListener("resize", onWindowResize, false);
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render();
}

function loadBottle(bottle, label) {
  const loader = new THREE.GLTFLoader();
  loader.load(bottle, function (gltf) {
    gltf.scene.traverse(({ name, material }) => {
      if (name === "label") {
        new THREE.TextureLoader().load(label, (texture) => {
          //Update Texture
          material.map = texture;
          material.transparent = true;
          material.side = 3;
          material.alphaTest = 0.5;
          window.ReactNativeWebView?.postMessage("loaded");
          controls.reset();
          render();
        });
      }
    });
    removeOldBottleIfExists();
    bottleObj = gltf.scene;
    scene.add(gltf.scene);
  });
}

function removeOldBottleIfExists() {
  if (bottleObj) {
    scene.remove(bottleObj);
  }
}