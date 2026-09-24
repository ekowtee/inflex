/**
 * The Core: 16,384 nodes and their edges as two draw calls, plus the same
 * geometry restricted to ember-capable nodes for the bloom source.
 * HERO_SCENE_SPEC.md §4, §6, §7.
 */
import {
  BufferAttribute,
  BufferGeometry,
  CustomBlending,
  DataTexture,
  FloatType,
  LineSegments,
  NearestFilter,
  OneFactor,
  OneMinusSrcAlphaFactor,
  Points,
  RGBAFormat,
  ShaderMaterial,
  GLSL3,
  Vector2,
} from "three";
import type { CoreWorkerResult } from "./worker/formations.worker";
import { HALF, NODE_COUNT, TEXTURE_WIDTH, FORMATIONS } from "./worker/formations";
import { nodesVertex, nodesFragment } from "./shaders/nodes";
import { edgesVertex, edgesFragment } from "./shaders/edges";
import { palette, lights, atmosphere, nodes as nodeSettings, tierB } from "./rig";
import type { Tier } from "@/motion/tier";

export interface CoreHandles {
  points: Points;
  edges: LineSegments;
  emberPoints: Points;
  emberEdges: LineSegments;
  nodeMaterial: ShaderMaterial;
  edgeMaterial: ShaderMaterial;
  texture: DataTexture;
}

function positionTexture(data: CoreWorkerResult): DataTexture {
  const texture = new DataTexture(
    data.positions,
    TEXTURE_WIDTH,
    (NODE_COUNT / TEXTURE_WIDTH) * FORMATIONS,
    RGBAFormat,
    FloatType
  );
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

const sharedUniforms = (texture: DataTexture, tier: Tier) => ({
  uPositions: { value: texture },
  uFrom: { value: 0 },
  uTo: { value: 0 },
  uMix: { value: 0 },
  uTime: { value: 0 },
  uNoise: { value: 0 },
  uHeatGate: { value: -0.3 },
  uSpread: { value: 0 },
  uBend: { value: 0 },
  uIdle: { value: nodeSettings.idleAmplitude },
  uPointerWorld: { value: new Vector2(99, 99) },
  uProximity: { value: 0 },
  uGraphite: { value: palette.graphite },
  uEmber: { value: palette.ember },
  uFogColor: { value: palette.obsidian900 },
  uFogDensity: { value: atmosphere.fogDensity },
  uOpacity: { value: 1 },
  uEmberPass: { value: 0 },
  // 1 when drawing straight to the canvas (Tier B); the Tier A composite
  // encodes instead.
  uEncodeSRGB: { value: tier === "A" ? 0 : 1 },
  // Tier B has no bloom: the ember pass draws wide additive halos instead,
  // and the sheet gets a little gain to match the Tier A poster it fades
  // from. Both are 1 on Tier A.
  uEmberHalo: { value: tier === "A" ? 1 : tierB.emberHalo },
  uGain: { value: tier === "A" ? 1 : tierB.gain },
});

export function buildCore(data: CoreWorkerResult, tier: Tier, dpr: number): CoreHandles {
  const texture = positionTexture(data);
  const n = NODE_COUNT;

  // ─── node attributes ──────────────────────────────────────────────────────
  const aIndex = new Float32Array(n);
  for (let i = 0; i < n; i += 1) aIndex[i] = i;
  const pointGeometry = new BufferGeometry();
  // three needs a position attribute to size the draw; the real positions
  // come from the texture.
  pointGeometry.setAttribute("position", new BufferAttribute(new Float32Array(n * 3), 3));
  pointGeometry.setAttribute("aIndex", new BufferAttribute(aIndex, 1));
  pointGeometry.setAttribute("aSeed", new BufferAttribute(data.seeds, 1));
  pointGeometry.setAttribute("aNormal", new BufferAttribute(data.normals, 3));
  pointGeometry.boundingSphere = null;

  // ─── edge attributes: two vertices per edge ───────────────────────────────
  const e = data.edgeCount;
  const eIndex = new Float32Array(e * 2);
  const eOther = new Float32Array(e * 2);
  const eSeed = new Float32Array(e * 2);
  const eSeedOther = new Float32Array(e * 2);
  const eNormal = new Float32Array(e * 6);
  const eNormalOther = new Float32Array(e * 6);
  for (let k = 0; k < e; k += 1) {
    const p = data.edges[k * 2];
    const q = data.edges[k * 2 + 1];
    const ends: Array<[number, number]> = [[p, q], [q, p]];
    ends.forEach(([self, other], side) => {
      const v = k * 2 + side;
      eIndex[v] = self;
      eOther[v] = other;
      eSeed[v] = data.seeds[self];
      eSeedOther[v] = data.seeds[other];
      for (let c = 0; c < 3; c += 1) {
        eNormal[v * 3 + c] = data.normals[self * 3 + c];
        eNormalOther[v * 3 + c] = data.normals[other * 3 + c];
      }
    });
  }
  const edgeGeometry = new BufferGeometry();
  edgeGeometry.setAttribute("position", new BufferAttribute(new Float32Array(e * 6), 3));
  edgeGeometry.setAttribute("aIndex", new BufferAttribute(eIndex, 1));
  edgeGeometry.setAttribute("aOther", new BufferAttribute(eOther, 1));
  edgeGeometry.setAttribute("aSeed", new BufferAttribute(eSeed, 1));
  edgeGeometry.setAttribute("aSeedOther", new BufferAttribute(eSeedOther, 1));
  edgeGeometry.setAttribute("aNormal", new BufferAttribute(eNormal, 3));
  edgeGeometry.setAttribute("aNormalOther", new BufferAttribute(eNormalOther, 3));
  edgeGeometry.boundingSphere = null;

  // ─── ember subsets as indexed views over the same attributes ─────────────
  const emberNodeIds: number[] = [];
  for (let i = 0; i < data.emberCountA; i += 1) emberNodeIds.push(i);
  if (tier === "A") for (let i = 0; i < data.emberCountB; i += 1) emberNodeIds.push(HALF + i);
  const emberNodeSet = new Set(emberNodeIds);
  const emberPointGeometry = new BufferGeometry();
  for (const name of ["position", "aIndex", "aSeed", "aNormal"]) {
    emberPointGeometry.setAttribute(name, pointGeometry.getAttribute(name));
  }
  emberPointGeometry.setIndex(emberNodeIds);
  emberPointGeometry.boundingSphere = null;

  const emberEdgeIds: number[] = [];
  const edgeLimit = tier === "A" ? e : data.edgesInHalf;
  for (let k = 0; k < edgeLimit; k += 1) {
    if (emberNodeSet.has(data.edges[k * 2]) && emberNodeSet.has(data.edges[k * 2 + 1])) {
      emberEdgeIds.push(k * 2, k * 2 + 1);
    }
  }
  const emberEdgeGeometry = new BufferGeometry();
  for (const name of ["position", "aIndex", "aOther", "aSeed", "aSeedOther", "aNormal", "aNormalOther"]) {
    emberEdgeGeometry.setAttribute(name, edgeGeometry.getAttribute(name));
  }
  emberEdgeGeometry.setIndex(emberEdgeIds);
  emberEdgeGeometry.boundingSphere = null;

  // Tier B draws the first half only.
  if (tier !== "A") {
    pointGeometry.setDrawRange(0, HALF);
    edgeGeometry.setDrawRange(0, data.edgesInHalf * 2);
  }

  // ─── materials ────────────────────────────────────────────────────────────
  const premultiplied = {
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
    blendSrcAlpha: OneFactor,
    blendDstAlpha: OneMinusSrcAlphaFactor,
  } as const;

  const nodeMaterial = new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: nodesVertex,
    fragmentShader: nodesFragment,
    uniforms: {
      ...sharedUniforms(texture, tier),
      uSize: { value: nodeSettings.size },
      uDpr: { value: dpr },
      uKeyDir: { value: lights.key.clone() },
      uRimDir: { value: lights.rim.clone() },
      uSilver300: { value: palette.silver300 },
      uSilver100: { value: palette.silver100 },
    },
    ...premultiplied,
  });

  const edgeMaterial = new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: edgesVertex,
    fragmentShader: edgesFragment,
    uniforms: {
      ...sharedUniforms(texture, tier),
      uKeyDir: { value: lights.key.clone() },
      uSilver300: { value: palette.silver300 },
    },
    ...premultiplied,
  });

  const points = new Points(pointGeometry, nodeMaterial);
  const edges = new LineSegments(edgeGeometry, edgeMaterial);
  const emberPoints = new Points(emberPointGeometry, nodeMaterial);
  const emberEdges = new LineSegments(emberEdgeGeometry, edgeMaterial);
  for (const o of [points, edges, emberPoints, emberEdges]) o.frustumCulled = false;
  // Ember subsets live on layer 1 so the post stage can render them alone.
  emberPoints.layers.set(1);
  emberEdges.layers.set(1);
  // Edges draw first so the points sit on top of the hairlines.
  edges.renderOrder = 0;
  points.renderOrder = 1;
  emberEdges.renderOrder = 0;
  emberPoints.renderOrder = 1;

  return { points, edges, emberPoints, emberEdges, nodeMaterial, edgeMaterial, texture };
}

export function disposeCore(handles: CoreHandles): void {
  handles.points.geometry.dispose();
  handles.edges.geometry.dispose();
  handles.emberPoints.geometry.dispose();
  handles.emberEdges.geometry.dispose();
  handles.nodeMaterial.dispose();
  handles.edgeMaterial.dispose();
  handles.texture.dispose();
}
