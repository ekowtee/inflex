#!/usr/bin/env node
/**
 * Inventory every image under public/ and record which source files
 * reference it. Writes scripts/image-inventory.json.
 *
 * A file that nothing under src/ references is "unreferenced" and is a
 * candidate to move out of the served folder.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import sharp from "sharp";

const RASTER = /\.(png|jpe?g|webp|avif|gif)$/i;
const VECTOR = /\.svg$/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const sourceFiles = walk("src").filter((f) => /\.(tsx?|css|mjs)$/.test(f));
const sources = new Map(sourceFiles.map((f) => [f, readFileSync(f, "utf8")]));

// Files that are referenced by convention rather than by a literal path.
const CONVENTIONAL = new Set([
  "/OG-image.jpeg",
  "/og-image.jpeg",
  "/fav.png",
  "/llms.txt",
  "/robots.txt",
  "/inflexlogo.png",
]);

const publicFiles = walk("public");
const inventory = [];

for (const file of publicFiles) {
  const url = "/" + relative("public", file).split(sep).join("/");
  const isImage = RASTER.test(file) || VECTOR.test(file);
  if (!isImage) continue;

  const referencedBy = [];
  for (const [src, text] of sources) {
    if (text.includes(url)) referencedBy.push(src.split(sep).join("/"));
  }
  if (CONVENTIONAL.has(url)) referencedBy.push("(conventional)");

  const bytes = statSync(file).size;
  let width = null;
  let height = null;
  if (RASTER.test(file)) {
    try {
      const meta = await sharp(file).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      /* unreadable; leave dimensions null and report it */
    }
  }

  inventory.push({
    path: url,
    file: file.split(sep).join("/"),
    bytes,
    width,
    height,
    kind: VECTOR.test(file) ? "vector" : "raster",
    referencedBy,
  });
}

inventory.sort((a, b) => b.bytes - a.bytes);
writeFileSync("scripts/image-inventory.json", JSON.stringify(inventory, null, 2) + "\n");

const unref = inventory.filter((i) => i.referencedBy.length === 0);
const ref = inventory.filter((i) => i.referencedBy.length > 0);
const mb = (n) => (n / 1024 / 1024).toFixed(2);

console.log(`images in public/: ${inventory.length}`);
console.log(`  referenced   ${ref.length.toString().padStart(4)}  ${mb(ref.reduce((t, i) => t + i.bytes, 0))} MB`);
console.log(`  unreferenced ${unref.length.toString().padStart(4)}  ${mb(unref.reduce((t, i) => t + i.bytes, 0))} MB`);
console.log(`  over 250 KB  ${ref.filter((i) => i.bytes > 250 * 1024).length}`);
console.log("wrote scripts/image-inventory.json");
