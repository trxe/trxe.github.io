import * as THREE from 'three';
import { LightData, setPosition } from './utils';

export const POINT_LIGHT_1: LightData = {
    position: new THREE.Vector3(-35, 65, 13),
    color: new THREE.Color('#FFCBBE'),
    intensity: 100,
}

export const AMBIENT_LIGHT: LightData = {
    position: new THREE.Vector3(0, 100, 10),
    color: new THREE.Color('#FFFFFF'),
    intensity: 20,
}

// Lights
export const pointLightOne: THREE.PointLight = new THREE.PointLight(POINT_LIGHT_1.color, POINT_LIGHT_1.intensity);
setPosition(pointLightOne, POINT_LIGHT_1.position);

export const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(AMBIENT_LIGHT.color, AMBIENT_LIGHT.intensity)
setPosition(ambientLight, AMBIENT_LIGHT.position);