#!/usr/bin/env node
/**
 * Capture the Core's posters from the real scene — HERO_SCENE_SPEC.md §9.1.
 *
 *   NEXT_PUBLIC_CORE_CAPTURE=1 npx next build && node scripts/capture-posters.mjs
 *   node scripts/capture-posters.mjs --port 3000   (against a running server)
 *   node scripts/capture-posters.mjs --formations 0,1,2,3,4
 *   node scripts/capture-posters.mjs --formations 1,2,3,4 --sizes mobile --lights lit
 *                                (the pillar posters for phones and Tier C)
 *   node scripts/capture-posters.mjs --formations 0 --variant bend --lights lit
 *                                (the sheet as the y = x³ curve: f0-bend-*)
 *   --amount 0..1                how far the variant goes (default 1)
 *   --shape name                 a capture-only shape (worker/shapes.ts) in
 *                                slot 5, written as s-{name}-{light}-{size}; run
 *                                with --formations 5
 *   --cam px,py,pz,lx,ly,lz      a camera for the whole run
 *
 *   The interior heroes' mark (f5-lit-desktop) is pulled back from the hero
 *   key so the whole mark survives the hero's top-and-bottom crop:
 *   --formations 5 --lights lit --sizes desktop --cam -1.72,1.88,8.4,-1.3,-0.15,0
 *
 *   The capture-only shapes use the same desktop camera, and for phones a
 *   centred one (written as s-{name}-lit-mobile):
 *   --formations 5 --shape <name> --lights lit --sizes desktop --cam -1.72,1.88,8.4,-1.3,-0.15,0
 *   --formations 5 --shape <name> --lights lit --sizes mobile --cam 0.45,1.6,12.5,0.45,-0.2,0
 *
 * Screenshots /core-capture with headless Chrome over CDP at the desktop and
 * portrait sizes, both light states, then writes WebP and AVIF at the
 * budgets in PERFORMANCE_PLAN.md §2.4 plus a 24 px LQIP inlined into
 * src/three/core/posters.ts.
 *
 * Headless Chrome renders WebGL through SwiftShader here, which is slow but
 * pixel-deterministic, so the capture is reproducible on any machine.
 */
import { launch } from "chrome-launcher";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import sharp from "sharp";

const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const formationsArg = args.indexOf("--formations");
const FORMATIONS = formationsArg > -1 ? args[formationsArg + 1].split(",").map(Number) : [0];
const OUT = "public/three/posters";

// 1920 wide covers every desktop the analytics are likely to show and
// keeps the lattice's high-frequency detail inside the poster budget;
// 2560 captures came in at 205 KB WebP against a 160 KB ceiling.
const SIZES = [
  { name: "desktop", w: 1920, h: 1080, dpr: 1 },
  { name: "mobile", w: 780, h: 1688, dpr: 1 },
];
const sizesArg = args.indexOf("--sizes");
const lightsArg = args.indexOf("--lights");
const LIGHTS = lightsArg > -1 ? args[lightsArg + 1].split(",") : ["unlit", "lit"];
const CENTRED = args.includes("--centred");
const variantArg = args.indexOf("--variant");
const VARIANT = variantArg > -1 ? args[variantArg + 1] : "";
if (VARIANT && VARIANT !== "bend") throw new Error(`unknown --variant ${VARIANT}`);
const amountArg = args.indexOf("--amount");
const AMOUNT = amountArg > -1 ? Number(args[amountArg + 1]) : 1;
const shapeArg = args.indexOf("--shape");
const SHAPE = shapeArg > -1 ? args[shapeArg + 1] : "";
const camArg = args.indexOf("--cam");
const CAM = camArg > -1 ? args[camArg + 1] : "";
const SIZES_RUN = sizesArg > -1 ? SIZES.filter((s) => args[sizesArg + 1].split(",").includes(s.name)) : SIZES;
const BUDGET = {
  desktop: { webp: 160 * 1024, avif: 110 * 1024 },
  mobile: { webp: 90 * 1024, avif: 65 * 1024 },
};

const freePort = () =>
  new Promise((resolve) => {
    const s = createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

const wait = (url, tries = 80) =>
  new Promise((resolve, reject) => {
    const attempt = (n) =>
      fetch(url)
        .then(() => resolve())
        .catch(() => (n <= 0 ? reject(new Error("server never came up")) : setTimeout(() => attempt(n - 1), 500)));
    attempt(tries);
  });

async function cdp(chrome) {
  const targets = await (await fetch(`http://127.0.0.1:${chrome.port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, (msg) => (msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  return { send, close: () => ws.close() };
}

async function waitForReady(send, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const { result } = await send("Runtime.evaluate", {
      expression: "document.body.getAttribute('data-capture-ready') || document.body.getAttribute('data-capture-failed') || ''",
      returnByValue: true,
    });
    if (result.value === "1") {
      const failed = await send("Runtime.evaluate", {
        expression: "document.body.hasAttribute('data-capture-failed')",
        returnByValue: true,
      });
      if (failed.result.value) throw new Error("scene reported failure (webgl unavailable?)");
      return;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("capture stage never became ready");
}

let server = null;
let port = portArg > -1 ? Number(args[portArg + 1]) : null;
if (!port) {
  port = await freePort();
  server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", shell: true });
}
const base = `http://localhost:${port}`;

const chrome = await launch({
  chromeFlags: [
    "--headless=new",
    "--hide-scrollbars",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});

const report = [];
try {
  await wait(base + "/");
  const { send, close } = await cdp(chrome);
  await send("Page.enable");
  await send("Runtime.enable");
  mkdirSync(OUT, { recursive: true });

  for (const formation of FORMATIONS) {
    for (const size of SIZES_RUN) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: size.w,
        height: size.h,
        deviceScaleFactor: size.dpr,
        mobile: size.name === "mobile",
      });
      for (const light of LIGHTS) {
        const url =
          `${base}/core-capture?formation=${formation}&light=${light}&tier=A` +
          (CENTRED ? "&centre=1" : "") +
          (VARIANT ? `&${VARIANT}=${AMOUNT}` : "") +
          (CAM ? `&cam=${CAM}` : "") +
          (SHAPE ? `&shape=${SHAPE}` : "");
        await send("Page.navigate", { url });
        await waitForReady(send);
        // Against a dev server, Next.js draws its indicator badge in a corner.
        await send("Runtime.evaluate", { expression: "document.querySelectorAll('nextjs-portal').forEach((e) => e.remove())" });
        const { data } = await send("Page.captureScreenshot", { format: "png" });
        const png = Buffer.from(data, "base64");
        const stem = SHAPE
          ? `s-${SHAPE}-${light}-${size.name}`
          : `f${formation}${VARIANT ? `-${VARIANT}` : ""}-${light}-${size.name}${CENTRED ? "-centred" : ""}`;
        const budget = BUDGET[size.name];

        // WebP at q80, stepping down if over budget; AVIF likewise.
        let q = 80;
        let webp;
        do {
          webp = await sharp(png).webp({ quality: q, effort: 6 }).toBuffer();
          q -= 4;
        } while (webp.length > budget.webp && q >= 60);
        writeFileSync(`${OUT}/${stem}.webp`, webp);

        let aq = 60;
        let avif;
        do {
          avif = await sharp(png).avif({ quality: aq, effort: 6 }).toBuffer();
          aq -= 5;
        } while (avif.length > budget.avif && aq >= 40);
        writeFileSync(`${OUT}/${stem}.avif`, avif);

        report.push({ stem, webp: webp.length, avif: avif.length, q: q + 4, aq: aq + 5 });
        console.log(
          `  ${stem.padEnd(22)} webp ${(webp.length / 1024).toFixed(0).padStart(4)} KB (q${q + 4})   avif ${(avif.length / 1024).toFixed(0).padStart(4)} KB (q${aq + 5})`
        );

        if (formation === 0 && light === "unlit" && size.name === "desktop" && !CENTRED && !VARIANT && !CAM && !SHAPE) {
          const lqip = await sharp(png).resize(24, 14, { fit: "cover" }).webp({ quality: 40 }).toBuffer();
          const dataUri = `data:image/webp;base64,${lqip.toString("base64")}`;
          const file = "src/three/core/posters.ts";
          const src = `/**
 * Poster paths and the inline LQIP — HERO_SCENE_SPEC.md §9.1.
 *
 * GENERATED by scripts/capture-posters.mjs; edit that script, not this file.
 */
export const posters = {
  desktop: {
    width: ${SIZES[0].w},
    height: ${SIZES[0].h},
    unlit: { avif: "/three/posters/f0-unlit-desktop.avif", webp: "/three/posters/f0-unlit-desktop.webp" },
    lit: { avif: "/three/posters/f0-lit-desktop.avif", webp: "/three/posters/f0-lit-desktop.webp" },
  },
  mobile: {
    width: ${SIZES[1].w},
    height: ${SIZES[1].h},
    unlit: { avif: "/three/posters/f0-unlit-mobile.avif", webp: "/three/posters/f0-unlit-mobile.webp" },
    lit: { avif: "/three/posters/f0-lit-mobile.avif", webp: "/three/posters/f0-lit-mobile.webp" },
  },
  lqip:
    "${dataUri}",
} as const;
`;
          writeFileSync(file, src);
          console.log(`  wrote ${file} (lqip ${lqip.length} bytes)`);
        }
      }
    }
  }
  close();
} finally {
  await chrome.kill();
  server?.kill();
}

const over = report.filter((r) => r.webp > BUDGET[r.stem.endsWith("desktop") ? "desktop" : "mobile"].webp);
if (over.length) {
  console.log(`\n${over.length} poster(s) over budget even at minimum quality`);
  process.exitCode = 1;
}
void statSync;
