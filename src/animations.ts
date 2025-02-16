import { gsap } from "gsap";
import * as THREE from 'three';

export const floatInPageLinks = () => {
    gsap.from('.page-link', {duration: 1, x: '150%', ease: 'ease-in', stagger: 0.3});
}

export const fadeToPageOpacity = (id: string, opacity: number) => {
    gsap.to(`#${id}`, {duration: 1, opacity: `${opacity}%`, height: opacity == 0 ? '0%': '100%'});
}

export const movePage = (id: string, vector: THREE.Vector3) => {
    gsap.to(`#${id}`, {duration: 1, x: `${vector.x}%`, y: `${vector.y}%`, z: `${vector.z}%`});
}

export const focusOneLink = (id: string, translateY: number) => {
    gsap.to(`.page-link:not(#${id})`, {duration: 1, x: '150%', ease: 'ease-in', stagger: 0.3});
    gsap.to(`#${id}`, {duration: 1, y: `${translateY}%`});
}

export const revertLink = (id: string) => {
    gsap.to(`.page-link:not(#${id})`, {duration: 1, x: '0%', ease: 'ease-in', stagger: 0.3});
    gsap.to(`#${id}`, {duration: 1, y: '0%'});
}

export const moveObjectTo = (object: THREE.Object3D, position: THREE.Vector3) => {
    gsap.to(object.position, {duration: 1, x: position.x, y: position.y, z: position.z});
}

export const rotateObjectTo = (object: THREE.Object3D, rotation: THREE.Vector3) => {
    gsap.to(object.rotation, {duration: 1, x: rotation.x, y: rotation.y, z: rotation.z});
}

export const fadeElementToOpacity = (e: Element, opacity: number) => {
    gsap.to(e, {duration: 1, opacity: `${opacity}%`, height: opacity == 0 ? '0%': '100%'});
}