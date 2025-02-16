import * as THREE from 'three';
import { Material } from './utils';

// Scene Components
export const BACKGROUND_COLOR: THREE.Color = new THREE.Color('#08080f');

export const CAMERA_SETTINGS = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(0, 20, 100),
  heightMin: -100,
  heightMax: 0,
};

export const PLANET_MATERIAL: Material = {
  ambientColor: new THREE.Vector3(23 / 256, 30 / 256, 168 / 256),
  diffuseColor: new THREE.Vector3(25 / 256, 86 / 256, 209 / 256),
  specularColor: new THREE.Vector3(1.0, 1.0, 1.0),
  emissionColor: new THREE.Vector3(1.0, 0.7, 1.0),
  emissionLevel: 0.9,
  Ka: 1.25,
  Kd: 1.75,
  Ks: 0.20,
}

export const PLANET = {
  radius: 12,
  position: new THREE.Vector3(0, 10, 0),
  rotation: new THREE.Vector3(0, 0, -0.8),
}

export const WATER = {
  position: new THREE.Vector3(0, -5, 0),
  rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
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

// Texture URL
export const WATER_DISPLACEMENT_URL = new URL('./assets/waterNoise.png', import.meta.url).href;
export const SPHERE_NORMAL_URL = new URL('./assets/water/Water_002_NORM.jpg', import.meta.url).href;

// Shaders
export const _VS_ripple_sphere = `
// Vertex shader for the sphere. 
// Ctrl+Enter to render
uniform vec3 lightWorldPos;
uniform float time;
uniform float radius;
uniform vec3 origin;

varying vec3 w_Normal;
varying vec3 v_LightDir;
varying vec3 v_View;
varying vec2 texCoord;
varying mat3 normal_matrix;

void main() {
  mat3 rot;
  float rotspeed = 0.5;
  float cost = cos(time * rotspeed);
  float sint = sin(time * rotspeed);
  rot[0] = vec3(cost, 0.0, sint);
  rot[1] = vec3(0.0, 1.0, 0.0);
  rot[2] = vec3(-sint, 0.0, cost);

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec3 centroidToPoint = worldPos.xyz - origin;
  float y = (position.y + 4.0 * time);

  // distance from y-axis
  float xz = distance(position.xz, vec2(0.0, 0.0)) / radius;

  // adjust centroid by offset relative to time and distance from y-axis
  vec3 rippleY = centroidToPoint * cos(1.8 * y) * xz;
  centroidToPoint = mix(centroidToPoint, rippleY, 0.1 * cos(time));
  
  texCoord = (normalMatrix * centroidToPoint).yz / radius * 0.5 + vec2(0.5);

  // Rotate entire planet
  centroidToPoint *= rot;

  vec3 newWorldPos = origin + centroidToPoint;

  vec4 v_View4 = viewMatrix * vec4(newWorldPos, 1.0);
  v_View = v_View4.xyz / v_View4.w;
  w_Normal = normalize(centroidToPoint);
  v_LightDir = normalize(lightWorldPos - newWorldPos);
  normal_matrix = normalMatrix;

  gl_Position = projectionMatrix * v_View4;
}
`;

export const _FS_ripple_sphere = `
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 emissionColor;
uniform sampler2D normalMap;
uniform float emissionLevel;
uniform float time;
uniform float Ka;
uniform float Kd;
uniform float Ks;

varying vec3 w_Normal;
varying mat3 normal_matrix;
varying vec3 v_LightDir;
varying vec3 v_View;
varying vec2 texCoord;

void main() {
  vec3 normalTest = texture2D(normalMap, texCoord).xyz;
  vec3 perturbedNorm = normal_matrix * mix(normalTest, w_Normal, 0.5);
  // mixes with normal for interesting effect 
  vec3 diffuseComp = diffuseColor * max(dot(perturbedNorm, v_LightDir), 0.0);
  // vec3 diffuseComp = mix(diffuseColor, w_Normal, cos(time * 0.5)) * max(dot(perturbedNorm, v_LightDir), 0.0);
  vec3 R = reflect(v_LightDir, perturbedNorm);
  vec3 V = normalize(v_View);
  vec3 specularComp = specularColor * pow(max(dot(R,V), 0.0), 32.0);
  vec3 phong = Ka * ambientColor + Kd * diffuseComp + Ks * specularComp;
  vec3 emission = emissionColor * (0.5 * sin(time) + emissionLevel) * emissionLevel;
  gl_FragColor = vec4(phong + emission, 1.0);
}
`;

export const _VS_water = `
varying vec2 texCoord;
uniform float time;
uniform sampler2D displacementMap;

void main() {
  texCoord = position.xy / 200.0 * vec2(0.5) + vec2(0.5);
  vec4 texHeight = texture2D(displacementMap, texCoord);
  vec3 texOffset = vec3(0., 0., texHeight.y * 40. - 10.) * cos(1.2 * time) * texHeight.y;
  vec3 ripple = vec3(0., 0., cos((time * 10. + position.y - position.x)/10.) * 5.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + texOffset + ripple, 1.0);
}
`;

export const _FS_water = `
uniform sampler2D displacementMap;

uniform vec3 colorA;
uniform vec3 colorB;

varying vec2 texCoord;

void main() {
  vec4 texColor = texture2D(displacementMap, texCoord);
  vec3 color = mix(colorA, colorB, min(texCoord.y - 0.25, 1.0));
  gl_FragColor = texColor * vec4(color, 1.0);
}
`;