var camera, scene, renderer;
var bottle, cube_geometry, cube_material;
var controls;
var light;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // renderer

  renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 250;
  camera.position.y = -2;

  // load bottle

  const loader = new THREE.GLTFLoader();
  loader.load("./scene.glb", function (gltf) {
    gltf.scene.traverse(({ name, material }) => {
      if (name === "label") {
        new THREE.TextureLoader().load("./label.png", (texture) => {
          //Update Texture
          material.map = texture;
          material.transparent = true;
          material.side = 3;
          material.alphaTest = 0.5;
          material.polygonOffset = true;
          material.polygonOffsetUnits = 1;
          material.polygonOffsetFactor = -100;
          material.needsUpdate = true;
          render();
        });
      }
      if (name === "Material_2") {
        material.polygonOffset = true;
        material.polygonOffsetUnits = 1;
        material.polygonOffsetFactor = -1;
        material.needsUpdate = true;
      }
      render();
    });
    scene.add(gltf.scene);
  });

  // Lights

  light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  light = new THREE.PointLight(0xffffff);
  light.position.y = 1.5;
  light.position.z = 250;
  light.position.y = -2;
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
