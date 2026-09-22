"use client";

import dynamic from "next/dynamic";

/**
 * The single import site for the environment chunk. Every consumer (the
 * arrival, the capture stage) goes through here so the bundler emits one
 * chunk graph for the Core rather than one per call site.
 */
export const CoreCanvas = dynamic(() => import("./CoreCanvas"), { ssr: false });
