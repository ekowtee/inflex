#!/usr/bin/env node
/**
 * Measure the prerendered payload of a route from the production build.
 * Reports gzipped HTML, JS, CSS, preloaded fonts, and the images the HTML
 * references. Used for the Phase 0 before/after comparison and by the gate.
 *
 *   node scripts/measure-payload.mjs [routeHtmlPath] [--json]
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const htmlPath = process.argv[2] ?? ".next/server/app/index.html";
const asJson = process.argv.includes("--json");

if (!existsSync(htmlPath)) {
  console.error(`No build at ${htmlPath}. Run \`next build\` first.`);
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const gz = (buf) => gzipSync(buf, { level: 6 }).length;

const resolve = (url) => {
  const clean = url.split("?")[0];
  if (!clean.startsWith("/_next/")) return null;
  const p = join(".next", clean.slice("/_next/".length));
  return existsSync(p) ? p : null;
};

const uniq = (a) => [...new Set(a)];

const scripts = uniq([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]));
const styles = uniq([...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]));
const fonts = uniq(
  [...html.matchAll(/<link[^>]+rel="preload"[^>]*>/g)]
    .filter((m) => /as="font"/.test(m[0]))
    .map((m) => m[0].match(/href="([^"]+)"/)?.[1])
    .filter(Boolean)
);
const imgs = uniq([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]));

const sum = (urls, fn) =>
  urls.reduce((t, u) => {
    const p = resolve(u);
    return p ? t + fn(p) : t;
  }, 0);

const publicBytes = (url) => {
  const clean = decodeURIComponent(url.split("?")[0]);
  const p = join("public", clean.replace(/^\//, ""));
  return existsSync(p) ? statSync(p).size : 0;
};

const report = {
  route: htmlPath,
  htmlGz: gz(Buffer.from(html)),
  htmlRaw: Buffer.byteLength(html),
  jsGz: sum(scripts, (p) => gz(readFileSync(p))),
  jsFiles: scripts.length,
  cssGz: sum(styles, (p) => gz(readFileSync(p))),
  cssFiles: styles.length,
  fontBytes: sum(fonts, (p) => statSync(p).size),
  fontFiles: fonts.length,
  imgBytes: imgs.reduce((t, u) => t + publicBytes(u), 0),
  imgTags: (html.match(/<img/g) ?? []).length,
  imgFiles: imgs.length,
  hasGsapOrLenis: scripts.some((u) => {
    const p = resolve(u);
    if (!p) return false;
    const src = readFileSync(p, "utf8");
    return /\bgsap\b/.test(src) || /\blenis\b/i.test(src);
  }),
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const kb = (b) => (b / 1024).toFixed(1).padStart(8) + " KB";
  const mb = (b) => (b / 1024 / 1024).toFixed(2).padStart(8) + " MB";
  console.log(`\n${report.route}`);
  console.log(`  HTML        ${kb(report.htmlGz)} gz  (${(report.htmlRaw / 1024).toFixed(0)} KB raw)`);
  console.log(`  JavaScript  ${kb(report.jsGz)} gz  (${report.jsFiles} files)`);
  console.log(`  CSS         ${kb(report.cssGz)} gz  (${report.cssFiles} files)`);
  console.log(`  Fonts       ${kb(report.fontBytes)}     (${report.fontFiles} preloaded)`);
  console.log(`  Images      ${mb(report.imgBytes)}     (${report.imgFiles} files, ${report.imgTags} tags)`);
  console.log(`  gsap/lenis in shell: ${report.hasGsapOrLenis ? "YES (fail)" : "no"}\n`);
}
