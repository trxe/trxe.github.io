import * as THREE from 'three';
import { POINT_LIGHT_1 } from './lights';
import { _FS_ripple_sphere, _FS_water, _VS_ripple_sphere, _VS_water } from './scene_settings';
import { Material, setPosition, setRotation } from './utils';

export const PLANET_MATERIAL: Material = {
    ambientColor: new THREE.Vector3(23/256, 30/256, 168/256),
    diffuseColor: new THREE.Vector3(25/256, 86/256, 209/256),
    specularColor: new THREE.Vector3(1.0, 1.0, 1.0),
    emissionColor: new THREE.Vector3(1.0, 0.7, 1.0),
    emissionLevel: 0.9,
    Ka: 1.25,
    Kd: 2.75,
    Ks: 0.90,
}

export const PLANET = {
    radius: 12,
    position: new THREE.Vector3(0, 10, 0),
    rotation: new THREE.Vector3(0, -0.8, -0.8),
}

export const WATER = {
    position: new THREE.Vector3(0, -5, 0),
    rotation: new THREE.Vector3(-Math.PI/2, 0, 0),
}

export const STARS = {
    count: 800,
    randomSpread: 2000,
    color: 0xFFFFFF,
    size: 8,
}

export const FRAME = {
    width: 24, 
    height: 15, 
}

// Picture Frames
const frameGeom = new THREE.PlaneBufferGeometry(FRAME.width, FRAME.height);

export const createFrame = (map: THREE.Texture) => {
  const material = new THREE.MeshBasicMaterial({map});
  const frame = new THREE.Mesh(frameGeom, material);
  return frame;
}

// Planet
export const getPlanet = (normalMap: THREE.Texture, startTime: number, vert: string, frag: string) => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(PLANET.radius, 128, 128),
        new THREE.ShaderMaterial({
            uniforms: {
                ambientColor: new THREE.Uniform(PLANET_MATERIAL.ambientColor),
                diffuseColor: new THREE.Uniform(PLANET_MATERIAL.diffuseColor),
                specularColor: new THREE.Uniform(PLANET_MATERIAL.specularColor),
                emissionColor: new THREE.Uniform(PLANET_MATERIAL.emissionColor),
                emissionLevel: new THREE.Uniform(0.0),
                normalMap: new THREE.Uniform(normalMap),
                radius: new THREE.Uniform(PLANET.radius),
                Ka: new THREE.Uniform(PLANET_MATERIAL.Ka),
                Kd: new THREE.Uniform(PLANET_MATERIAL.Kd),
                Ks: new THREE.Uniform(PLANET_MATERIAL.Ks),
                lightWorldPos: new THREE.Uniform(POINT_LIGHT_1.position),
                origin: new THREE.Uniform(PLANET.position),
                time: new THREE.Uniform(startTime),
            },
            vertexShader: vert,
            fragmentShader: frag,
        })
    );
    setPosition(planet, PLANET.position);
    setRotation(planet, PLANET.rotation)
    return planet;
}

// Water
export const getWater = (displacementMap: THREE.Texture, startTime: number) => {
    const water = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 100, 100),
        new THREE.ShaderMaterial({
            uniforms: {
                displacementMap: new THREE.Uniform(displacementMap),
                lightWorldPos: new THREE.Uniform(POINT_LIGHT_1.position),
                colorA: new THREE.Uniform(new THREE.Vector3(0.1, 0.3125, 0.777)),
                colorB: new THREE.Uniform(new THREE.Vector3(220/256, 80/256, 212/256)),
                time: new THREE.Uniform(startTime),
            },
            vertexShader: _VS_water,
            fragmentShader: _FS_water,
        })
    );
    setPosition(water, WATER.position);
    setRotation(water, WATER.rotation);
    return water;
}

// Sky with stars
export const getSky = () => {
    const starsGeom = new THREE.BufferGeometry;
    const particlesCount = STARS.count;
    const starVertices = [];
    for (let i = 0; i < particlesCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(STARS.randomSpread);
        const y = THREE.MathUtils.randFloatSpread(STARS.randomSpread);
        const z = THREE.MathUtils.randFloatSpread(STARS.randomSpread);
        starVertices.push(x, y, z);
    }
    starsGeom.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: STARS.color,
        size: STARS.size,
    });
    const sky = new THREE.Points(starsGeom, starsMaterial);
    return sky;
}