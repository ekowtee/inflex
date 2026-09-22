#!/usr/bin/env node
/**
 * One-time image clean-up for Phase 0 (PERFORMANCE_PLAN.md §6.1).
 *
 *   node scripts/optimise-images.mjs [--dry]
 *
 * 1. Files under public/ that nothing in src/ references move to
 *    assets-src/unreferenced/ (kept on disk, gitignored).
 * 2. Referenced photographs are re-encoded to WebP at most 1920 px wide;
 *    the original moves to assets-src/originals/ (kept and committed, so a
 *    future re-encode never needs the file back from git history).
 * 3. Referenced flat graphics and icons stay PNG and are palette-optimised.
 *
 * Nothing is ever deleted. public/brand/ is left alone: those are the
 * generated mark assets.
 */
import { readdirSync, statSync, mkdirSync, renameSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname, relative, sep, extname } from "node:path";
import sharp from "sharp";

const DRY = process.argv.includes("--dry");

// public/brand holds the generated mark assets. The two root files are
// pinned by references we must not change: the locked Header loads
// /inflexlogo.png, and social scrapers want a real JPEG for /og-image.jpeg.
const SKIP_DIRS = ["public/brand"];
const SKIP_FILES = ["public/inflexlogo.png", "public/og-image.jpeg", "public/fav.png"];
const GRAPHIC_DIRS = ["/logos/", "/icons/", "/assets/partners/", "/assets/clients/"];
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 78;

const inventory = JSON.parse(readFileSync("scripts/image-inventory.json", "utf8"));

const ensure = (file) => mkdirSync(dirname(file), { recursive: true });
const kb = (n) => (n / 1024).toFixed(0).padStart(6);

function isGraphic(item) {
  if (GRAPHIC_DIRS.some((d) => item.path.includes(d))) return true;
  // small images with transparency are UI chrome, not photography
  return item.width !== null && item.width <= 600 && /\.png$/i.test(item.path);
}

const moved = [];
const converted = [];
const recompressed = [];
const skipped = [];

for (const item of inventory) {
  if (SKIP_DIRS.some((d) => item.file.startsWith(d)) || SKIP_FILES.includes(item.file)) {
    skipped.push([item, "pinned asset"]);
    continue;
  }

  // 1 — unreferenced: move out of the served folder
  if (item.referencedBy.length === 0) {
    const dest = join("assets-src", "unreferenced", relative("public", item.file));
    if (!DRY) {
      ensure(dest);
      renameSync(item.file, dest);
    }
    moved.push([item, dest]);
    continue;
  }

  if (item.kind === "vector") {
    skipped.push([item, "svg"]);
    continue;
  }

  // 3 — flat graphics stay PNG
  if (isGraphic(item)) {
    if (/\.png$/i.test(item.file)) {
      if (!DRY) {
        const out = await sharp(item.file)
          .png({ palette: true, compressionLevel: 9, effort: 10 })
          .toBuffer();
        if (out.length < item.bytes) writeFileSync(item.file, out);
      }
      recompressed.push(item);
    } else {
      skipped.push([item, "graphic, not png"]);
    }
    continue;
  }

  // 2 — photographs become WebP; the original is archived
  const webpPath = item.file.replace(/\.(png|jpe?g)$/i, ".webp");
  if (webpPath === item.file) {
    skipped.push([item, "already webp"]);
    continue;
  }

  if (!DRY) {
    const pipeline = sharp(item.file).rotate();
    if (item.width && item.width > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH });
    await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(webpPath);

    const archive = join("assets-src", "originals", relative("public", item.file));
    ensure(archive);
    renameSync(item.file, archive);
  }

  converted.push([item, webpPath]);
}

const sizeOf = (f) => (existsSync(f) ? statSync(f).size : 0);

console.log(`\nmoved to assets-src/unreferenced: ${moved.length}`);
console.log(`converted to webp:               ${converted.length}`);
console.log(`png recompressed:                ${recompressed.length}`);
console.log(`skipped:                         ${skipped.length}`);

if (!DRY && converted.length) {
  const before = converted.reduce((t, [i]) => t + i.bytes, 0);
  const after = converted.reduce((t, [, p]) => t + sizeOf(p), 0);
  console.log(
    `\nphotographs: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB`
  );
  const worst = converted
    .map(([i, p]) => [sizeOf(p), p])
    .sort((a, b) => b[0] - a[0])
    .slice(0, 8);
  console.log("largest remaining:");
  for (const [b, p] of worst) console.log(`  ${kb(b)} KB  ${p}`);
}
