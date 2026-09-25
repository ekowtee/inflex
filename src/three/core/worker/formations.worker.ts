/**
 * Web Worker entry: generate the Core off the main thread and transfer the
 * buffers back. HERO_SCENE_SPEC.md §4.3.
 */
import { generateCore, fingerprint } from "./formations";

export interface CoreWorkerResult {
  type: "core";
  positions: Float32Array;
  normals: Float32Array;
  edges: Uint16Array;
  seeds: Float32Array;
  edgeCount: number;
  emberCountA: number;
  emberCountB: number;
  edgesInHalf: number;
  fingerprint: string;
  generateMs: number;
}

self.onmessage = (event: MessageEvent<{ type: "generate"; seed?: number; shape?: string }>) => {
  if (event.data?.type !== "generate") return;
  const started = performance.now();
  const data = generateCore(event.data.seed, event.data.shape);
  const message: CoreWorkerResult = {
    type: "core",
    positions: data.positions,
    normals: data.normals,
    edges: data.edges,
    seeds: data.seeds,
    edgeCount: data.edgeCount,
    emberCountA: data.emberCountA,
    emberCountB: data.emberCountB,
    edgesInHalf: data.edgesInHalf,
    fingerprint: fingerprint(data),
    generateMs: performance.now() - started,
  };
  (self as unknown as Worker).postMessage(message, [
    data.positions.buffer,
    data.normals.buffer,
    data.edges.buffer,
    data.seeds.buffer,
  ]);
};
