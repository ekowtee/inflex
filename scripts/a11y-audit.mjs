#!/usr/bin/env node
/**
 * Accessibility audit — CREATIVE_DIRECTION_3D.md §9 Phase 6 item 2.
 *
 * Runs axe-core on every public route in headless Chrome over the DevTools
 * protocol (chrome-launcher + CDP, no Playwright), at a desktop and a phone
 * viewport, and prints a compact summary of the violations per route.
 *
 *   npm run a11y                                   (both viewports, :3000)
 *   node scripts/a11y-audit.mjs --base http://localhost:3001
 *   node scripts/a11y-audit.mjs --width 390 --height 844
 *   node scripts/a11y-audit.mjs --routes /,/about  (a subset)
 *   node scripts/a11y-audit.mjs --json out.json    (full axe results too)
 *   node scripts/a11y-audit.mjs --reduced-motion   (prefers-reduced-motion)
 *   node scripts/a11y-audit.mjs --incomplete       (also list "needs review",
 *                                  e.g. contrast over an image or canvas)
 *
 * Needs a running server; it never starts one. Exits 1 when any route has
 * a serious or critical violation.
 *
 * Routes: the static routes in src/app/sitemap.ts, plus one of each dynamic
 * family (a case study, an Academy domain, the first programme in
 * src/app/academy/data.ts).
 */
import { launch } from "chrome-launcher";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i > -1 ? args[i + 1] : undefined;
};

const BASE = (arg("--base") ?? "http://localhost:3000").replace(/\/$/, "");
const JSON_OUT = arg("--json");
const REDUCED = args.includes("--reduced-motion");
const INCOMPLETE = args.includes("--incomplete");

const VIEWPORTS =
  arg("--width") || arg("--height")
    ? [{ w: Number(arg("--width") ?? 1440), h: Number(arg("--height") ?? 900) }]
    : [
        { w: 1440, h: 900 },
        { w: 390, h: 844 },
      ];

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

function discoverRoutes() {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  const block = sitemap.match(/const staticRoutes = \[([\s\S]*?)\]/);
  if (!block) throw new Error("could not find staticRoutes in src/app/sitemap.ts");
  const statics = [...block[1].matchAll(/"([^"]*)"/g)].map((m) => m[1] || "/");

  const data = readFileSync("src/app/academy/data.ts", "utf8");
  // The first programme: the first object carrying both slug and domainSlug.
  const programme = data.match(/slug:\s*"([^"]+)",\s*domainSlug:\s*"([^"]+)"/);
  const domain = data.match(/slug:\s*"([^"]+)"/);

  const dynamic = ["/case-studies/1"];
  if (domain) dynamic.push(`/academy/${domain[1]}`);
  if (programme) dynamic.push(`/academy/${programme[2]}/${programme[1]}`);

  return [...new Set([...statics, "/jobs", "/internships", ...dynamic])];
}

const ROUTES = arg("--routes") ? arg("--routes").split(",") : discoverRoutes();

async function cdp(chrome) {
  const res = await fetch(`http://127.0.0.1:${chrome.port}/json/list`);
  const targets = await res.json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
      else resolve(msg.result);
    } else if (msg.method) {
      for (const fn of listeners) fn(msg);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, { resolve, reject });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  // Resolves on the first event matching the predicate, or on timeout.
  const waitFor = (predicate, ms) =>
    new Promise((resolve) => {
      const fn = (msg) => {
        if (predicate(msg)) {
          listeners.delete(fn);
          clearTimeout(timer);
          resolve(true);
        }
      };
      const timer = setTimeout(() => {
        listeners.delete(fn);
        resolve(false);
      }, ms);
      listeners.add(fn);
    });
  return { send, waitFor, close: () => ws.close() };
}

async function evaluate(send, expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  }
  return r.result.value;
}

const PREPARE = `(async () => {
  await document.fonts.ready;
  document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
  // Scroll through once so lazy images decode and reveals fire, then back.
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const step = Math.max(200, Math.round(innerHeight * 0.6));
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await sleep(60);
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await sleep(400);
  window.scrollTo(0, 0);
  await sleep(900);
  document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
  return true;
})()`;

const RUN = `(async () => {
  const r = await axe.run(document, {
    runOnly: { type: "tag", values: ${JSON.stringify(TAGS)} },
    resultTypes: ["violations", "incomplete"],
  });
  const shape = (list) => list.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    count: v.nodes.length,
    nodes: v.nodes.map((n) => ({
      target: n.target.join(" "),
      html: n.html,
      summary: n.failureSummary,
    })),
  }));
  return { violations: shape(r.violations), incomplete: shape(r.incomplete) };
})()`;

const AXE = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const IMPACT_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const snippet = (html) => html.replace(/\s+/g, " ").slice(0, 110);

const chrome = await launch({
  chromeFlags: ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio"],
});
const { send, waitFor, close } = await cdp(chrome);
await send("Page.enable");
await send("Page.setLifecycleEventsEnabled", { enabled: true });
await send("Runtime.enable");
if (REDUCED) {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
}

const report = [];
let blocking = 0;

for (const vp of VIEWPORTS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.w < 500,
  });
  console.log(`\n=== ${vp.w}x${vp.h} ===`);

  for (const route of ROUTES) {
    const url = BASE + route;
    let violations, incomplete;
    try {
      const idle = waitFor(
        (m) => m.method === "Page.lifecycleEvent" && m.params.name === "networkIdle",
        30000,
      );
      const nav = await send("Page.navigate", { url });
      if (nav.errorText) throw new Error(nav.errorText);
      await idle;
      await evaluate(send, PREPARE);
      // Each navigation is a fresh document, so axe goes in every time.
      await send("Runtime.evaluate", { expression: AXE });
      ({ violations, incomplete } = await evaluate(send, RUN));
    } catch (error) {
      console.log(`${route}  ERROR ${error.message}`);
      report.push({ viewport: `${vp.w}x${vp.h}`, route, error: error.message });
      blocking++;
      continue;
    }

    violations.sort((a, b) => (IMPACT_ORDER[a.impact] ?? 9) - (IMPACT_ORDER[b.impact] ?? 9));
    const nodes = violations.reduce((s, v) => s + v.count, 0);
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    blocking += serious.length;
    console.log(
      `${route}  ${violations.length ? `${violations.length} rule(s), ${nodes} node(s)` : "clean"}`,
    );
    for (const v of violations) {
      console.log(`  - ${v.id} [${v.impact}] x${v.count}: ${v.help}`);
      for (const n of v.nodes.slice(0, 2)) {
        console.log(`      ${n.target}`);
        console.log(`        ${snippet(n.html)}`);
      }
    }
    if (INCOMPLETE) {
      for (const v of incomplete) {
        console.log(`  ? ${v.id} (needs review) x${v.count}`);
        for (const n of v.nodes.slice(0, 2)) {
          console.log(`      ${n.target}`);
          console.log(`        ${snippet(n.html)}`);
        }
      }
    }
    report.push({ viewport: `${vp.w}x${vp.h}`, route, violations, incomplete });
  }
}

if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));

console.log("\n=== summary (rules per route) ===");
for (const r of report) {
  const s = r.error
    ? "ERROR"
    : r.violations.length
      ? r.violations.map((v) => `${v.id}:${v.count}`).join(", ")
      : "0";
  console.log(`${r.viewport.padEnd(9)} ${r.route.padEnd(52)} ${s}`);
}

close();
await chrome.kill();
process.exit(blocking > 0 ? 1 : 0);
