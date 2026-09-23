#!/usr/bin/env node
/**
 * The performance gate — PERFORMANCE_PLAN.md §9.1.
 *
 *   npm run perf            three Lighthouse runs per route, median
 *   npm run perf -- --runs 1    one run per route, for a quick check
 *   npm run perf -- --bundles   skip Lighthouse, check budgets only
 *   npm run perf -- --url https://example.com   measure a deployed site
 *                                instead of a local next start
 *   npm run perf -- --throttling devtools   observe paint times under real
 *                                throttling instead of modelling them
 *
 * Fails the process on any breach, so it can gate a build.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { gzipSync } from "node:zlib";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const budgets = JSON.parse(readFileSync("scripts/budgets.json", "utf8"));
const args = process.argv.slice(2);
const runsArg = args.indexOf("--runs");
const RUNS = runsArg > -1 ? Number(args[runsArg + 1]) : 3;
const BUNDLES_ONLY = args.includes("--bundles");
const urlArg = args.indexOf("--url");
const REMOTE_URL = urlArg > -1 ? args[urlArg + 1].replace(/\/$/, "") : null;
const throttlingArg = args.indexOf("--throttling");
const THROTTLING = throttlingArg > -1 ? args[throttlingArg + 1] : "simulate";
if (!["simulate", "devtools"].includes(THROTTLING)) {
  console.error(`--throttling must be "simulate" or "devtools", got "${THROTTLING}"`);
  process.exit(2);
}

const failures = [];
const note = (ok, label, actual, budget, unit) => {
  if (!ok) failures.push(`${label}: ${actual}${unit} exceeds ${budget}${unit}`);
  return ok;
};

// ─── bundle and asset budgets ────────────────────────────────────────────────

const gz = (file) => gzipSync(readFileSync(file), { level: 6 }).length;
const ENGINE = /_gsap|quickSetter|registerEase|lenis-smooth|virtualScroll/;
const THREE = /THREE\.WebGLRenderer|WebGLRenderer|BufferGeometry/;

function resolveChunk(url) {
  const clean = url.split("?")[0];
  if (!clean.startsWith("/_next/")) return null;
  const p = join(".next", clean.slice("/_next/".length));
  return existsSync(p) ? p : null;
}

function checkBundles() {
  const htmlPath = ".next/server/app/index.html";
  if (!existsSync(htmlPath)) {
    failures.push("no production build; run next build first");
    return [];
  }
  const html = readFileSync(htmlPath, "utf8");

  // Scripts the route ships to a modern browser. The polyfill bundle is a
  // noModule script: browsers that understand modules skip it, so it is
  // neither shell weight nor a Lighthouse request.
  const scripts = [
    ...new Set(
      [...html.matchAll(/<script\b[^>]*>/g)]
        .map((m) => m[0])
        .filter((tag) => !/\bnomodule\b/i.test(tag))
        .map((tag) => tag.match(/\bsrc="([^"]+)"/)?.[1])
        .filter(Boolean)
    ),
  ];
  const shell = scripts.reduce((t, u) => {
    const p = resolveChunk(u);
    return p ? t + gz(p) : t;
  }, 0);

  const fonts = [...html.matchAll(/<link[^>]+rel="preload"[^>]*>/g)]
    .filter((m) => /as="font"/.test(m[0]))
    .map((m) => m[0].match(/href="([^"]+)"/)?.[1])
    .filter(Boolean);
  const fontBytes = fonts.reduce((t, u) => {
    const p = resolveChunk(u);
    return p ? t + statSync(p).size : t;
  }, 0);

  const shellHasEngine = scripts.some((u) => {
    const p = resolveChunk(u);
    return p ? ENGINE.test(readFileSync(p, "utf8")) : false;
  });
  const shellHasThree = scripts.some((u) => {
    const p = resolveChunk(u);
    return p ? THREE.test(readFileSync(p, "utf8")) : false;
  });

  // The lazy chunks are whatever the route can reach from its shell: each
  // chunk names the chunks it can load, so walk those references. Counting
  // the whole chunk directory instead double-counts the environment when the
  // bundler emits a second copy of it for another route (the capture stage).
  // The motion chunk is the reachable set carrying the engines; the
  // environment chunk is the reachable set carrying three.js and the Core.
  const chunkDir = ".next/static/chunks";
  const reachable = new Set();
  const queue = scripts.map(resolveChunk).filter(Boolean);
  while (queue.length) {
    const p = queue.pop();
    if (reachable.has(p)) continue;
    reachable.add(p);
    const src = readFileSync(p, "utf8");
    for (const m of src.matchAll(/static\/chunks\/([^"'`\s]+\.js)/g)) {
      const next = join(chunkDir, m[1]);
      if (existsSync(next) && !reachable.has(next)) queue.push(next);
    }
  }
  const shellSet = new Set(scripts.map(resolveChunk).filter(Boolean));
  let motion = 0;
  let environment = 0;
  for (const p of reachable) {
    if (shellSet.has(p)) continue;
    const src = readFileSync(p, "utf8");
    if (ENGINE.test(src)) motion += gz(p);
    else if (THREE.test(src) || /texelFetch\(uPositions|formations\.worker/.test(src)) environment += gz(p);
  }

  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full, out);
      else out.push(full);
    }
    return out;
  };
  const publicFiles = existsSync("public") ? walk("public") : [];
  const publicBytes = publicFiles.reduce((t, f) => t + statSync(f).size, 0);
  const oversize = publicFiles
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .filter((f) => statSync(f).size > budgets.images.maxServedRasterBytes)
    .map((f) => `${f.split(sep).join("/")} (${Math.round(statSync(f).size / 1024)} KB)`);

  const rows = [
    ["route shell", shell, budgets.bundles.routeShellGzip, "gz"],
    ["motion chunk", motion, budgets.bundles.motionChunkGzip, "gz"],
    ["environment chunk", environment, budgets.bundles.environmentChunkGzip, "gz"],
    ["preloaded fonts", fontBytes, budgets.bundles.preloadedFontBytes, ""],
    ["public/ total", publicBytes, budgets.images.maxPublicDirBytes, ""],
  ];

  console.log("\nBUNDLES");
  for (const [label, actual, budget, suffix] of rows) {
    const ok = note(
      actual <= budget,
      label,
      Math.round(actual / 1024),
      Math.round(budget / 1024),
      " KB"
    );
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(18)} ${(actual / 1024)
        .toFixed(1)
        .padStart(8)} KB ${suffix.padEnd(3)} budget ${(budget / 1024).toFixed(0)} KB`
    );
  }

  const engineOk = !shellHasEngine;
  if (!engineOk) failures.push("gsap or lenis engine is in the route shell");
  console.log(`  ${engineOk ? "PASS" : "FAIL"}  motion engine kept out of the shell`);

  const threeOk = !shellHasThree;
  if (!threeOk) failures.push("three.js is in the route shell");
  console.log(`  ${threeOk ? "PASS" : "FAIL"}  three.js kept out of the shell`);

  const imgOk = oversize.length === 0;
  if (!imgOk) failures.push(`${oversize.length} served rasters over the size ceiling`);
  console.log(
    `  ${imgOk ? "PASS" : "FAIL"}  no served raster over ${Math.round(
      budgets.images.maxServedRasterBytes / 1024
    )} KB`
  );
  for (const f of oversize) console.log(`          ${f}`);

  return rows;
}

// ─── Lighthouse ──────────────────────────────────────────────────────────────

const freePort = () =>
  new Promise((resolve) => {
    const srv = createServer();
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });

const wait = (url, tries = 60) =>
  new Promise((resolve, reject) => {
    const attempt = (n) => {
      fetch(url)
        .then(() => resolve())
        .catch(() => (n <= 0 ? reject(new Error("server never came up")) : setTimeout(() => attempt(n - 1), 500)));
    };
    attempt(tries);
  });

const METRICS = [
  ["server-response-time", "TTFB", "ms"],
  ["first-contentful-paint", "FCP", "ms"],
  ["largest-contentful-paint", "LCP", "ms"],
  ["speed-index", "SI", "ms"],
  ["total-blocking-time", "TBT", "ms"],
  ["cumulative-layout-shift", "CLS", ""],
];

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

async function runLighthouse() {
  if (REMOTE_URL) return runLighthouseAgainst(REMOTE_URL, null);

  if (!existsSync(".next/BUILD_ID")) {
    console.log("no build found, running next build…");
    await new Promise((resolve, reject) => {
      const p = spawn("npx", ["next", "build"], { stdio: "inherit", shell: true });
      p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("build failed"))));
    });
  }

  const port = await freePort();
  const server = spawn("npx", ["next", "start", "-p", String(port)], {
    stdio: "ignore",
    shell: true,
  });
  const base = `http://localhost:${port}`;
  return runLighthouseAgainst(base, server);
}

async function runLighthouseAgainst(base, server) {
  try {
    await wait(base + "/");
    console.log(`
measuring ${base}`);
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
    });

    console.log(`\nLIGHTHOUSE  (mobile, slow 4G, 4x CPU, ${THROTTLING}, ${RUNS} run${RUNS > 1 ? "s" : ""} per route, median)`);
    const header = ["route".padEnd(34), ...METRICS.map(([, short]) => short.padStart(6) + " ")].join("");
    console.log("  " + header);

    for (const route of budgets.routes) {
      const samples = [];
      let lcpElement = "";
      for (let i = 0; i < RUNS; i += 1) {
        const result = await lighthouse(
          base + route,
          { port: chrome.port, output: "json", logLevel: "error" },
          {
            extends: "lighthouse:default",
            // Lighthouse's own mobile preset is the slow-4G profile the
            // performance plan describes: 150 ms RTT, 1.6 Mbps down, 4x CPU.
            // Hand-rolling the throttling object mixes the simulate and
            // devtools fields and produced numbers that moved by a factor of
            // two between runs.
            settings: {
              formFactor: "mobile",
              onlyCategories: ["performance"],
              // "simulate" (the default) models paint times from the request
              // graph and charges a text LCP for every script fetched before
              // the paint; "devtools" throttles the real browser and reports
              // the observed paint. PERFORMANCE_PLAN.md §9.5.
              throttlingMethod: THROTTLING,
            },
          }
        );
        samples.push(result.lhr);
        lcpElement =
          result.lhr.audits["largest-contentful-paint-element"]?.details?.items?.[0]
            ?.items?.[0]?.node?.nodeLabel ?? lcpElement;
      }

      const cells = [];
      for (const [audit, short, unit] of METRICS) {
        const value = median(samples.map((lhr) => lhr.audits[audit]?.numericValue ?? 0));
        const budget = budgets.lab[audit];
        const shown = unit === "ms" ? Math.round(value) : value.toFixed(3);
        const ok = note(value <= budget, `${route} ${short}`, shown, budget, unit);
        cells.push(String(shown).padStart(6) + (ok ? " " : "!"));
      }
      console.log("  " + route.padEnd(34) + cells.join(""));
      if (route === "/" && lcpElement) {
        console.log(`  ${" ".repeat(34)}LCP element: ${lcpElement.slice(0, 60)}`);
      }
      // Attribution when the shift budget is missed: the elements that
      // moved in the worst run, so a runner-only shift can be read from the
      // commit comment without reproducing the runner.
      const clsValues = samples.map((lhr) => lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0);
      if (median(clsValues) > budgets.lab["cumulative-layout-shift"]) {
        const worst = samples[clsValues.indexOf(Math.max(...clsValues))];
        const shifts = worst.audits["layout-shifts"]?.details?.items ?? worst.audits["layout-shift-elements"]?.details?.items ?? [];
        for (const item of shifts.slice(0, 3)) {
          const node = item.node ?? {};
          const cause = item.subItems?.items?.[0]?.cause ?? "";
          console.log(`  ${" ".repeat(34)}shift ${(item.score ?? 0).toFixed(3)}: ${(node.selector ?? node.nodeLabel ?? "?").slice(0, 70)}${cause ? ` (${cause})` : ""}`);
        }
      }
    }

    await chrome.kill();
  } finally {
    server?.kill();
  }
}

// ─── run ─────────────────────────────────────────────────────────────────────

checkBundles();
if (!BUNDLES_ONLY) await runLighthouse();

console.log("");
if (failures.length) {
  console.log(`GATE FAILED (${failures.length})`);
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
console.log("GATE PASSED");
