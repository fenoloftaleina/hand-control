let model = null;

const video = document.getElementsByClassName('input_video')[0];
const out = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = out.getContext('2d');

function onResultsHands(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, out.width, out.height);
  canvasCtx.drawImage(results.image, 0, 0, out.width, out.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];
      const pointer = landmarks[8];
      const y = pointer.y + 0.2;
      model.position.y = pointer.y * -100 + 75;
      if (model.position.y < 0) {
        model.position.y = 0;
      } else if (model.position.y > 90) {
        model.position.y = 90;
      }
      drawConnectors(
          canvasCtx, landmarks, HAND_CONNECTIONS,
          {color: isRightHand ? '#00FF00' : '#FF0000'}),
      drawLandmarks(canvasCtx, landmarks, {
        color: isRightHand ? '#00FF00' : '#FF0000',
        fillColor: isRightHand ? '#FF0000' : '#00FF00',
        radius: (x) => {
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      });
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});
hands.onResults(onResultsHands);

const videoCamera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image: video});
  },
  width: 480,
  height: 480
});
videoCamera.start();

hands.setOptions({
  selfieMode: true,
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});








import * as THREE from 'three';
import { GLTFLoader  } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls  } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js'

// const w = window.innerWidth;
// const h = window.innerHeight;
const w = 720;
const h = 480;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementsByClassName('container')[0].appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry(500, 500);
const material = new THREE.MeshPhongMaterial( { color: 0x555555 } );
const group = new THREE.Group();
let plane = new THREE.Mesh( geometry, material );
plane.lookAt(0, 1, 0);
plane.receiveShadow = true;
group.add( plane );
// plane = plane.clone();
// plane.lookAt(1, 0, 0);
// plane.position.set(-250, 0, 0);
// group.add( plane );
// plane = plane.clone();
// plane.position.set(0, 0, -250);
// plane.lookAt(0, 0, 1);
// group.add( plane );
// plane = plane.clone();
// plane.position.set(250, 0, 0);
// plane.lookAt(-1, 0, 0);
// group.add( plane );
group.rotation.y = 0.5;
scene.add( group );

camera.position.set(-45, 55, -55);
camera.lookAt(50, 15, 50);

let light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.9 );
// directionalLight1.position.set(100, 50, 100);
// directionalLight1.target.position.set(-50, 10, -80);
// scene.add( directionalLight1 );
//
// const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.9 );
// directionalLight2.position.set(100, 50, 100);
// directionalLight2.target.position.set(-400, 3, -100);
// scene.add( directionalLight2 );

const hemiLight = new THREE.HemisphereLight( 0xfffbaa, 0x555555, 1 );
scene.add( hemiLight );

const spotLight = new THREE.SpotLight( 0xffffff, 0.4 );
spotLight.castShadow = true;
spotLight.position.set(0, 100, 0);
spotLight.shadow.radius = 8;
scene.add( spotLight );

// scene.add( directionalLight );

scene.background = new THREE.Color( 0x333333 );
// scene.fog = new THREE.Fog( 0x555555, 30, 200 );

const loader = new GLTFLoader();
// loader.load('woody/scene.gltf', function (gltf) {
loader.load('prom.glb', function (gltf) {
  model = gltf.scene;
  model.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
  const s = 1000;
  model.scale.set(s, s, s);
	scene.add(model);
}, undefined, function (error) { console.error(error); });


// const controls = new OrbitControls( camera, renderer.domElement );
// controls.update();


function animate() {
  requestAnimationFrame( animate );

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // controls.update();
  // console.log(camera.position);

  renderer.render( scene, camera );
};

animate();
