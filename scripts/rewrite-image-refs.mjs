#!/usr/bin/env node
/**
 * Point every source reference at the WebP produced by optimise-images.mjs.
 *
 * Runs after the conversion: any /assets/... path whose raster no longer
 * exists but whose .webp sibling does is rewritten in place.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, sep } from "node:path";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk("src").filter((f) => /\.(tsx?|css)$/.test(f));
const PATH_RE = /\/(?:assets|logos|icons|section1)\/[A-Za-z0-9._/-]+\.(?:png|jpe?g)/g;

let edited = 0;
let rewrites = 0;
const missing = new Set();

for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(PATH_RE, (url) => {
    const webp = url.replace(/\.(png|jpe?g)$/i, ".webp");
    if (existsSync(join("public", webp.slice(1)))) {
      rewrites += 1;
      return webp;
    }
    if (!existsSync(join("public", url.slice(1)))) missing.add(url);
    return url;
  });
  if (after !== before) {
    writeFileSync(file, after);
    edited += 1;
    console.log("  " + file.split(sep).join("/"));
  }
}

console.log(`\nfiles edited: ${edited}, references rewritten: ${rewrites}`);
if (missing.size) {
  console.log("\nreferences with no file on disk (check these):");
  for (const m of [...missing].sort()) console.log("  " + m);
  process.exitCode = 1;
}
