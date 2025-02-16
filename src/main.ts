import './style.css';
import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import {
  BACKGROUND_COLOR, CAMERA_SETTINGS, SPHERE_NORMAL_URL, WATER_DISPLACEMENT_URL,
  _FS_ripple_sphere, _FS_water, _VS_ripple_sphere, _VS_water
} from './scene_settings';
import { aspect, getCamPos, setPosition } from './utils';
import { ambientLight, pointLightOne } from './lights';
import { getPlanet, getSky, getWater } from './objects';
import { fadeToPageOpacity, floatInPageLinks, focusOneLink, moveObjectTo, revertLink, rotateObjectTo } from './animations';
import { init_editor } from './editor';

gsap.registerPlugin(ScrollTrigger);


/**
 * Scene components: 
 * scene, camera, renderer, 
 * raycaster, textureloader, clock,
 * lighthelper, gridHelper
 */

// Scene
const scene: THREE.Scene = new THREE.Scene();
scene.background = BACKGROUND_COLOR;

// Camera
const camera: THREE.PerspectiveCamera =
  new THREE.PerspectiveCamera(CAMERA_SETTINGS.fov, aspect(), CAMERA_SETTINGS.near, CAMERA_SETTINGS.far);
setPosition(camera, getCamPos());

// Raycaster
const raycaster: THREE.Raycaster = new THREE.Raycaster();

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: <HTMLCanvasElement>document.querySelector('#bg'),
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Texture Loader
const texLoad: THREE.TextureLoader = new THREE.TextureLoader();
const SPHERE_NORMAL: THREE.Texture = texLoad.load(SPHERE_NORMAL_URL);
const WATER_DISPLACEMENT: THREE.Texture = texLoad.load(WATER_DISPLACEMENT_URL);

// Composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new UnrealBloomPass( new THREE.Vector2(1024, 1024), 3.5, 0.00, 0.75) );

// Orbit Controls
/*
const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
setPosition(camera, CAMERA_SETTINGS.position);
controls.update();
*/

// Clock
const clock = new THREE.Clock(true);
let elapsedTime = 0.0;

/**
 * Scene Lights
 */

scene.add(pointLightOne);
scene.add(ambientLight);

/**
 * Scene Objects
 */


// Planet
const planet = getPlanet(SPHERE_NORMAL, clock.elapsedTime, _VS_ripple_sphere, _FS_ripple_sphere);
scene.add(planet);

// Water
const water = getWater(WATER_DISPLACEMENT, clock.elapsedTime)
scene.add(water);

// Stars
const sky = getSky();
scene.add(sky);

let objmap = {
  'planet': planet,
  'water': water,
  'sky': sky,
};

// Frames


// Animations
floatInPageLinks();

/**
 * Helpers
// Grid Helper
const gridHelper: THREE.GridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

// Light Helper
const lightHelper: THREE.PointLightHelper = new THREE.PointLightHelper(pointLightOne);
scene.add(lightHelper);
 */

/**
 * Callbacks
 */
let currentPage: string = 'landing-text';
let mouse: THREE.Vector2 = new THREE.Vector2();

// Display callback
renderer.setAnimationLoop(() => {
  // controls.update();
  raycaster.setFromCamera(mouse, camera);
  // const intersects: Array<THREE.Object3D> = raycaster.intersectObjects(scene.children).map(i => i.object);

  // Updating Time
  elapsedTime += clock.getDelta();
  objmap.planet.material.uniforms.time.value = elapsedTime;
  objmap.water.material.uniforms.time.value = elapsedTime;

  // Rotating the sky
  objmap.sky.rotation.y += 0.001;

  // Rendering and composing
  renderer.render(scene, camera);
  composer.render(clock.getDelta());
})

// Resizing callback
const onResize = () => {
  camera.aspect = aspect();
  setPosition(camera, getCamPos());
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function onMouseMove(event: any) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Mousewheel callback
const onMouseWheel = (event: any) => {
  if (currentPage === 'link-works') {
    const offset = -event.deltaY * 0.2;
    const newLoc = new THREE.Vector3(0, offset, 0).add(camera.position);
    if (camera.position.y < CAMERA_SETTINGS.heightMax && offset > 0 ||
      camera.position.y > CAMERA_SETTINGS.heightMin && offset < 0) {
      moveObjectTo(camera, newLoc);
    }
  }
}

window.addEventListener('resize', onResize);
window.addEventListener('wheel', onMouseWheel);
window.addEventListener('mousemove', onMouseMove);

/**
 * Onclick handlers
 */

const replacer = (vert: string) => {
  scene.remove(objmap.planet);
  objmap.planet = getPlanet(SPHERE_NORMAL, clock.elapsedTime, vert, _FS_ripple_sphere);
  scene.add(objmap.planet)
}

const sandbox = document.getElementById('link-sandbox');
const sandboxLabel: string | null = sandbox ? sandbox.textContent : '';
if (sandbox) sandbox.onclick = () => {
  if (currentPage !== 'link-sandbox') {
    document.querySelector('#link-sandbox')?.scrollIntoView({
      behavior: 'smooth'
    });
    sandbox.focus();
    init_editor(document.getElementById('shader-editor'), _VS_ripple_sphere, replacer);
    focusOneLink('link-sandbox', 0);
    fadeToPageOpacity('landing-text', 0);
    fadeToPageOpacity('sandbox', 100);
    currentPage = 'link-sandbox'
    sandbox.textContent = 'back';
  } else {
    sandbox.blur();
    revertLink('link-sandbox');
    fadeToPageOpacity('landing-text', 100);
    fadeToPageOpacity('sandbox', 0);
    currentPage = 'landing-text';
    sandbox.textContent = sandboxLabel;
  }
};

const projects = document.getElementById('link-projects');
const projectsLabel: string | null = projects ? projects.textContent : '';
if (projects) projects.onclick = () => {
  if (currentPage !== 'link-projects') {
    document.querySelector('#link-projects')?.scrollIntoView({
      behavior: 'smooth'
    });
    projects.focus();
    focusOneLink('link-projects', 200);
    moveObjectTo(camera, new THREE.Vector3(5, CAMERA_SETTINGS.position.y, 20));
    fadeToPageOpacity('landing-text', 0);
    fadeToPageOpacity('projects', 300);
    currentPage = 'link-projects'
    projects.textContent = 'back';
  } else {
    projects.blur();
    moveObjectTo(camera, getCamPos());
    revertLink('link-projects');
    fadeToPageOpacity('landing-text', 100);
    fadeToPageOpacity('projects', 0);
    currentPage = 'landing-text';
    projects.textContent = projectsLabel;
  }
};

const contact = document.getElementById('link-contact');
const contactLabel: string | null = contact ? contact.textContent : '';
if (contact) contact.onclick = () => {
  if (currentPage !== 'link-contact') {
    contact.focus();
    focusOneLink('link-contact', 200);
    fadeToPageOpacity('contact', 100);
    currentPage = 'link-contact'
    contact.textContent = 'back';
  } else {
    contact.blur();
    moveObjectTo(camera, getCamPos());
    revertLink('link-contact');
    fadeToPageOpacity('contact', 0);
    currentPage = 'landing-text';
    contact.textContent = contactLabel;
  }
};

const works = document.getElementById('link-works');
const worksLabel: string | null = works ? works.textContent : '';
if (works) works.onclick = () => {
  if (currentPage !== 'link-works') {
    document.querySelector('#works-intro')?.scrollIntoView({
      behavior: 'smooth'
    });
    focusOneLink('link-works', 0);
    rotateObjectTo(camera, new THREE.Vector3(0, -Math.PI / 3, 0));
    fadeToPageOpacity('landing-text', 0);
    fadeToPageOpacity('works', 100);
    currentPage = 'link-works';
    works.textContent = 'back';
  } else {
    revertLink('link-works');
    rotateObjectTo(camera, new THREE.Vector3(0, 0, 0));
    fadeToPageOpacity('landing-text', 100);
    fadeToPageOpacity('works', 0);
    moveObjectTo(camera, getCamPos());
    currentPage = 'landing-text';
    works.textContent = worksLabel;
  }
};

const viewPortfolio = document.getElementById('view-portfolio');
if (viewPortfolio) viewPortfolio.onclick = () => {
  document.querySelector('#bodyx')?.scrollIntoView({
    behavior: 'smooth'
  });
  moveObjectTo(camera, getCamPos().add(new THREE.Vector3(0, -20, 0)));
}

const viewTitles = document.getElementById('view-titles');
if (viewTitles) viewTitles.onclick = () => {
  document.querySelector('#sqpt')?.scrollIntoView({
    behavior: 'smooth'
  });
  moveObjectTo(camera, getCamPos().add(new THREE.Vector3(0, -20, 0)));
}

const setSlideNumber = (n: number, id: string) => {
  const gallery = document.getElementById(id);
  if (!gallery || n < 0) return;
  const slides: HTMLCollectionOf<Element> = gallery.getElementsByClassName('gallery-slide');
  if (n >= slides.length) return;
  for (let i = 0; i < slides.length; i++) {
    slides[i].setAttribute('style', 'display: none;');
  }
  slides[n].setAttribute('style', 'display: flex;');
}

const handleGallery = (name: string) => {
  const gallery = document.getElementById(name);
  let index: number = 0;
  let slideCount: number = 0;
  // if (galleryBodyx) {
  if (gallery) {
    const prev: Element = gallery.getElementsByClassName('gallery-prev')[0];
    const next: Element = gallery.getElementsByClassName('gallery-next')[0];
    const slides: HTMLCollectionOf<Element> = gallery.getElementsByClassName('gallery-slide');
    slideCount = slides.length;
    setSlideNumber(index, gallery.id);
    prev.addEventListener('click', () => {
      index = index == 0 ? slideCount - 1 : index - 1;
      setSlideNumber(index, gallery.id);
    });
    next.addEventListener('click', () => {
      index = index == slideCount - 1 ? 0 : index + 1;
      setSlideNumber(index, gallery.id);
    });
  }
}

handleGallery('bodyx');
handleGallery('doodles-diary');
handleGallery('theatre');


// Debug