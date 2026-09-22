#!/usr/bin/env node
/**
 * Screenshot a set of routes at desktop and mobile widths using headless
 * Chrome over the DevTools protocol (chrome-launcher + CDP, no Playwright).
 *
 *   node scripts/screenshot.mjs <label> [--port 3000]
 *
 * Writes .phase0/screens/<label>-<route>-<width>.png
 */
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] ?? "shot";
const portArg = process.argv.indexOf("--port");
const port = portArg > -1 ? Number(process.argv[portArg + 1]) : 3000;
const base = `http://localhost:${port}`;

const ROUTES = ["/", "/solutions", "/academy", "/contact"];
const VIEWPORTS = [
  { w: 1280, h: 2400, name: "1280", dpr: 1 },
  { w: 390, h: 3600, name: "390", dpr: 2 },
];

async function cdp(chrome) {
  // Minimal CDP client over the websocket exposed by chrome-launcher.
  const res = await fetch(`http://127.0.0.1:${chrome.port}/json/list`);
  const targets = await res.json();
  const page = targets.find((t) => t.type === "page");
  // Node 22 ships a global WebSocket, so no client library is needed.
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id;
      pending.set(n, resolve);
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  return { send, close: () => ws.close() };
}

const chrome = await launch({
  chromeFlags: ["--headless=new", "--disable-gpu", "--hide-scrollbars"],
});
const { send, close } = await cdp(chrome);
await send("Page.enable");
await mkdir(".phase0/screens", { recursive: true });

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: vp.dpr,
      mobile: vp.w < 500,
    });
    await send("Page.navigate", { url: base + route });
    await new Promise((r) => setTimeout(r, 3500));
    // Scroll through so lazy images decode, then return to the top.
    await send("Runtime.evaluate", {
      expression:
        "(async()=>{const s=document.body.scrollHeight;for(let y=0;y<s;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,600));})()",
      awaitPromise: true,
    });
    const { data } = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
    });
    const slug = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);
    const file = `.phase0/screens/${label}-${slug}-${vp.name}.png`;
    await writeFile(file, Buffer.from(data, "base64"));
    console.log("wrote", file);
  }
}

close();
await chrome.kill();
