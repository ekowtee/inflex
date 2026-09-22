import {
  CustomBlending,
  DoubleSide,
  GLSL3,
  Mesh,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import { groundVertex, groundFragment } from "./shaders/ground";
import { atmosphere, palette } from "./rig";

/** The ground grid — HERO_SCENE_SPEC.md §7.3. Off in the hero; the driver sets uAlpha. */
export function buildGround(encodeSRGB: boolean): Mesh<PlaneGeometry, ShaderMaterial> {
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: groundVertex,
    fragmentShader: groundFragment,
    uniforms: {
      uGraphite: { value: palette.graphite },
      uFogColor: { value: palette.obsidian900 },
      uFogDensity: { value: atmosphere.fogDensity },
      uAlpha: { value: 0 },
      uEncodeSRGB: { value: encodeSRGB ? 1 : 0 },
    },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
  });
  const mesh = new Mesh(new PlaneGeometry(14, 14), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.4;
  mesh.frustumCulled = false;
  return mesh;
}
