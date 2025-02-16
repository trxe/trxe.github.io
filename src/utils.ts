import * as THREE from 'three';
import { CAMERA_SETTINGS } from './scene_settings';

// Objects in scene
export interface Material {
    ambientColor: THREE.Vector3;
    diffuseColor: THREE.Vector3;
    specularColor: THREE.Vector3;
    emissionColor: THREE.Vector3;
    emissionLevel: number;
    Ka: number;
    Kd: number;
    Ks: number;
}

// Lights in scene
export interface LightData {
    position: THREE.Vector3;
    color: THREE.Color;
    intensity: number;
}

export const aspect = (): number => {
    return window.innerWidth / window.innerHeight;
}

export const getCamPos = (): THREE.Vector3 => {
    const maxAs = Math.max(aspect(), 1.0);
    return new THREE.Vector3(
        CAMERA_SETTINGS.position.x / maxAs, 
        CAMERA_SETTINGS.position.y / maxAs, 
        CAMERA_SETTINGS.position.z / maxAs
    );
}

export const setPosition = (object: THREE.Object3D, vector: THREE.Vector3) => {
    object.position.set(vector.x, vector.y, vector.z);
}

export const setRotation = (object: THREE.Object3D, eulerAngles: THREE.Vector3) => {
    object.rotation.set(eulerAngles.x, eulerAngles.y, eulerAngles.z);
}

export const doesRayHitMesh = (mesh: THREE.Mesh, intersects: Array<THREE.Object3D>): boolean => {
    return intersects.filter(obj => obj.id === mesh.id).length > 0;
}
