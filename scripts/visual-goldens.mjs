#!/usr/bin/env node
/**
 * Visual regression goldens — CREATIVE_DIRECTION_3D.md §9 Phase 6 item 1.
 *
 *   npm run goldens                        compare against tests/goldens, exit 1 on a change
 *   npm run goldens -- --update            write (or rewrite) the goldens
 *   npm run goldens -- --update --resume   only the ones not yet written
 *   npm run goldens -- --base http://localhost:3000   against a running server
 *   npm run goldens -- --routes /,/about --widths 390,1920 --modes motion
 *
 * Without --base it serves the existing production build with `next start`
 * on a free port (run `npx next build` first), so no dev indicator and no hot
 * reload can reach a golden.
 *
 * Every route at 390, 768, 1280 and 1920 wide, with motion and with reduced
 * motion. A page is captured as the reader sees it: one viewport at a time,
 * scrolled, settled, and stitched, because a single full-page capture resizes
 * the viewport to the page, which inflates every svh unit and releases the
 * sticky pins. The fixed header is in the first screen only, so it does not
 * cover the content at every seam. Chrome runs without a GPU, which the tier
 * rule sends to Tier C, so the Core is its poster and every frame is
 * deterministic.
 *
 * Goldens are WebP at half scale or less (at most 640 wide, 16000 tall). A
 * comparison fails when the sizes differ or more than 0.5 % of pixels move by
 * more than 24 levels in any channel; the diff (changed pixels in red over
 * the new capture) is written to the system temp directory.
 */
import { launch } from "chrome-launcher";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i > -1 ? args[i + 1] : null;
};
const UPDATE = args.includes("--update");
/** With --update: keep goldens that already exist (to finish an interrupted run). */
const RESUME = args.includes("--resume");
const OUT = "tests/goldens";
const DIFF = join(tmpdir(), "inflexions-golden-diffs");
const WIDTHS = (flag("--widths") ?? "390,768,1280,1920").split(",").map(Number);
const HEIGHT = { 390: 844, 768: 1024, 1280: 800, 1920: 1080 };
const MODES = (flag("--modes") ?? "motion,reduced").split(",");
const MAX_W = 640;
/** WebP's largest dimension is 16383; tall phone pages are scaled to fit. */
const MAX_H = 16000;
const TOLERANCE = 24;
const MAX_CHANGED = 0.005;

const ROUTES = (
  flag("--routes") ??
  [
    "/",
    "/about",
    "/solutions",
    "/solutions/network-infrastructure",
    "/solutions/data-security",
    "/solutions/cloud-services",
    "/solutions/data-centric-solutions",
    "/services",
    "/services/professional",
    "/services/managed",
    "/services/support",
    "/academy",
    "/academy/for-organizations",
    "/academy/ai-intelligent-systems",
    "/academy/infrastructure-cloud",
    "/academy/cybersecurity-compliance",
    "/academy/digital-strategy",
    "/academy/ai-intelligent-systems/ai-foundations",
    "/case-study",
    "/case-studies/1",
    "/careers",
    "/jobs",
    "/internships",
    "/resources",
    "/contact",
  ].join(",")
).split(",");

// chrome-launcher's temp-profile cleanup can hit a locked file on Windows.
process.on("uncaughtException", (e) => {
  if (!/EBUSY|rimraf/.test(String(e))) throw e;
});

const freePort = () =>
  new Promise((resolve) => {
    const s = createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

const slug = (route) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "__"));
const firstLine = (e) => String(e).split(String.fromCharCode(10))[0].slice(0, 80);

async function capture(page, route, width, mode) {
  const height = HEIGHT[width] ?? 900;
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: mode === "reduced" ? "reduce" : "no-preference" }]);
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0", timeout: 180000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll("nextjs-portal").forEach((e) => e.remove());
    const style = document.createElement("style");
    // Third-party frames (the Google map) load differently every visit.
    style.textContent = "*{caret-color:transparent!important}iframe{visibility:hidden!important}";
    document.head.appendChild(style);
  });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const frames = [];
  for (let y = 0; y < total; y += height) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    if (y > 0) {
      await page.evaluate(() =>
        document.querySelectorAll("header").forEach((h) => {
          if (getComputedStyle(h).position === "fixed") h.style.visibility = "hidden";
        })
      );
    }
    // Each motion runs at most 1 s (tokens.ts), but staggered sequences (the
    // Ledger's strikes, the doors) chain several; reduced motion is instant.
    await new Promise((r) => setTimeout(r, mode === "reduced" ? 700 : 2000));
    // Images in view that are still decoding; lazy ones further down load as
    // the scroll reaches them. Never wait more than 3 s.
    await page.evaluate(() => {
      const pending = [...document.images].filter((i) => {
        if (i.complete) return false;
        const r = i.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
      });
      const loads = pending.map(
        (i) =>
          new Promise((r) => {
            i.addEventListener("load", r, { once: true });
            i.addEventListener("error", r, { once: true });
          })
      );
      return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 3000))]);
    });
    const shot = await page.screenshot({ type: "png" });
    const keep = Math.min(height, total - y);
    frames.push(keep < height ? await sharp(shot).extract({ left: 0, top: height - keep, width, height: keep }).toBuffer() : shot);
  }
  let top = 0;
  const comps = [];
  for (const f of frames) {
    const m = await sharp(f).metadata();
    comps.push({ input: f, left: 0, top });
    top += m.height;
  }
  // Half scale at most: enough to catch a layout, colour or copy change,
  // small enough to commit two hundred of them.
  const scale = Math.min(0.5, MAX_W / width, MAX_H / top);
  const stitched = await sharp({ create: { width, height: top, channels: 3, background: "#000" } }).composite(comps).png().toBuffer();
  return sharp(stitched)
    .resize(Math.round(width * scale), Math.round(top * scale))
    .webp({ quality: 70 })
    .toBuffer();
}

async function compare(file, fresh, name) {
  const a = sharp(file);
  const ma = await a.metadata();
  const mb = await sharp(fresh).metadata();
  if (ma.width !== mb.width || ma.height !== mb.height) {
    return `size ${ma.width}×${ma.height} → ${mb.width}×${mb.height}`;
  }
  const [ra, rb] = await Promise.all([a.removeAlpha().raw().toBuffer(), sharp(fresh).removeAlpha().raw().toBuffer()]);
  const px = ma.width * ma.height;
  let changed = 0;
  const mask = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i += 1) {
    const d = Math.max(Math.abs(ra[i * 3] - rb[i * 3]), Math.abs(ra[i * 3 + 1] - rb[i * 3 + 1]), Math.abs(ra[i * 3 + 2] - rb[i * 3 + 2]));
    if (d > TOLERANCE) {
      changed += 1;
      mask[i * 4] = 230;
      mask[i * 4 + 3] = 200;
    }
  }
  if (changed / px <= MAX_CHANGED) return null;
  mkdirSync(DIFF, { recursive: true });
  const overlay = await sharp(mask, { raw: { width: ma.width, height: ma.height, channels: 4 } }).png().toBuffer();
  await sharp(fresh).composite([{ input: overlay }]).png().toFile(join(DIFF, `${name}.png`));
  return `${((100 * changed) / px).toFixed(2)}% of pixels changed`;
}

let server = null;
let BASE = flag("--base");
if (!BASE) {
  if (!existsSync(".next/BUILD_ID")) {
    console.error("No production build. Run `npx next build` first, or pass --base.");
    process.exit(2);
  }
  const port = await freePort();
  server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", shell: true });
  BASE = `http://localhost:${port}`;
  for (let i = 0; i < 120; i += 1) {
    try {
      await fetch(`${BASE}/`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

// No GPU: headless Chrome on Windows otherwise renders WebGL on the real
// GPU, the live Core runs, and no two captures match. Without it the tier
// rule sees no hardware WebGL and serves the poster (Tier C).
const chrome = await launch({ chromeFlags: ["--headless=new", "--hide-scrollbars", "--disable-gpu"] });
const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}`, defaultViewport: null });
let page = await browser.newPage();

/** One capture, retried on a fresh page if the tab crashes or detaches. */
async function captureWithRetry(route, width, mode) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await capture(page, route, width, mode);
    } catch (e) {
      if (attempt >= 3) throw e;
      console.log(`  retry  ${route} ${width}-${mode} (${firstLine(e)})`);
      try {
        await page.close();
      } catch {
        /* already gone */
      }
      page = await browser.newPage();
    }
  }
}

const failures = [];
let written = 0;
try {
  for (const route of ROUTES) {
    const dir = join(OUT, slug(route));
    mkdirSync(dir, { recursive: true });
    for (const width of WIDTHS) {
      for (const mode of MODES) {
        const name = `${width}-${mode}`;
        const file = join(dir, `${name}.webp`);
        if (UPDATE && RESUME && existsSync(file)) continue;
        const fresh = await captureWithRetry(route, width, mode);
        if (UPDATE || !existsSync(file)) {
          await sharp(fresh).toFile(file);
          written += 1;
          console.log(`  wrote  ${route} ${name}`);
          continue;
        }
        const problem = await compare(file, fresh, `${slug(route)}--${name}`);
        console.log(`  ${problem ? "CHANGED" : "same   "} ${route} ${name}${problem ? `  (${problem})` : ""}`);
        if (problem) failures.push(`${route} ${name}: ${problem}`);
      }
    }
  }
} finally {
  await browser.disconnect();
  try {
    chrome.kill();
  } catch {
    /* already gone */
  }
  server?.kill();
}

if (written) console.log(`${written} golden(s) written to ${OUT}`);
if (failures.length) {
  console.log(`\n${failures.length} change(s); diffs in ${DIFF}`);
  process.exit(1);
}
console.log("GOLDENS MATCH");
process.exit(0);
