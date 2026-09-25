#!/usr/bin/env node
/**
 * The frame-time probe and watchdog, checked on real hardware —
 * CREATIVE_DIRECTION_3D.md §9 Phase 6 item 3.
 *
 *   npm run tier                      against http://localhost:3000
 *   npm run tier -- --base http://…   against another server
 *   npm run tier -- --rates 1,4,6     CPU throttling rates to try
 *
 * For each rate: a fresh headless Chrome on the machine's own GPU (ANGLE
 * D3D11 on Windows), the home page at 1920 × 1080 with the demotion memory
 * cleared, CPU throttled over CDP, then two full scroll passes. Prints the
 * tier after load and after each pass, and what the scene remembered.
 *
 * Expected on the desktop reference (Iris Xe, 1920 × 1080): A throughout
 * at 1×, never demoted; C by the end at 6×. Measured 25 September 2026:
 * 1× A → A → A, 6× B → C → C.
 *
 * A dev server hot-reloads open pages when files change; a run that reloads
 * mid-way is retried.
 */
import { launch } from "chrome-launcher";
import puppeteer from "puppeteer-core";

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base");
const BASE = baseArg > -1 ? args[baseArg + 1] : "http://localhost:3000";
const ratesArg = args.indexOf("--rates");
const RATES = ratesArg > -1 ? args[ratesArg + 1].split(",").map(Number) : [1, 6];

// chrome-launcher's temp-profile cleanup can hit a locked file on Windows.
process.on("uncaughtException", (e) => {
  if (!/EBUSY|rimraf/.test(String(e))) throw e;
});

async function run(rate) {
  const chrome = await launch({
    chromeFlags: ["--headless=new", "--hide-scrollbars", "--use-angle=d3d11", "--ignore-gpu-blocklist"],
  });
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}`, defaultViewport: null });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    const cdp = await page.createCDPSession();
    let navigations = 0;
    page.on("framenavigated", (f) => {
      if (f === page.mainFrame()) navigations += 1;
    });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 180000 });
    const renderer = await page.evaluate(() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      const info = gl?.getExtension("WEBGL_debug_renderer_info");
      return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "unknown";
    });
    await page.evaluate(() => sessionStorage.removeItem("core-tier-demoted"));
    if (rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    await page.reload({ waitUntil: "networkidle0", timeout: 180000 });
    const start = navigations;
    await new Promise((r) => setTimeout(r, 4000));
    const read = () =>
      page.evaluate(() => document.querySelector("[data-core-tier]")?.getAttribute("data-core-tier") ?? "C (poster)");
    const tiers = [await read()];
    for (let pass = 0; pass < 2; pass += 1) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 200) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await new Promise((r) => setTimeout(r, 80));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 2500));
      tiers.push(await read());
    }
    if (navigations !== start) throw new Error("the page reloaded mid-run");
    return {
      cpu: `${rate}x`,
      tiers: tiers.join(" → "),
      remembered: await page.evaluate(() => sessionStorage.getItem("core-tier-demoted")),
      renderer: String(renderer).slice(0, 48),
    };
  } finally {
    await browser.disconnect();
    try {
      chrome.kill();
    } catch {
      /* already gone */
    }
  }
}

const out = [];
for (const rate of RATES) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      out.push(await run(rate));
      break;
    } catch (e) {
      if (attempt === 3) out.push({ cpu: `${rate}x`, tiers: `failed: ${String(e).slice(0, 80)}` });
    }
  }
}
console.table(out);
process.exit(0);
