#!/usr/bin/env node
// Run any prisma command against the PRODUCTION database.
// Reads PROD_DATABASE_URL from .env.local and exposes it to prisma as DATABASE_URL.
// Usage: node scripts/prisma-prod.mjs migrate deploy
//        node scripts/prisma-prod.mjs studio

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

if (!existsSync(envPath)) {
  console.error("✗ .env.local not found. Cannot resolve PROD_DATABASE_URL.");
  process.exit(1);
}

const raw = readFileSync(envPath, "utf8");
const vars = Object.fromEntries(
  raw
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => {
      const idx = line.indexOf("=");
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return [key, value];
    })
);

const pooledUrl = vars.PROD_DATABASE_URL;
const unpooledUrl = vars.PROD_DATABASE_URL_UNPOOLED;
if (!pooledUrl && !unpooledUrl) {
  console.error(
    "✗ PROD_DATABASE_URL (or PROD_DATABASE_URL_UNPOOLED) is empty in .env.local."
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("✗ No prisma command supplied. Example: npm run db:deploy:prod");
  process.exit(1);
}

// Migrations must run against a direct (unpooled) connection — pgbouncer in
// transaction mode breaks Prisma migrate. Other commands (studio, generate)
// work fine on either, so we prefer pooled when available.
const isMigrate = args[0] === "migrate";
const url = isMigrate ? unpooledUrl ?? pooledUrl : pooledUrl ?? unpooledUrl;

console.log(`→ Running prisma ${args.join(" ")} against PRODUCTION`);
console.log(`→ Host: ${new URL(url).host}`);
console.log(`→ Connection: ${isMigrate ? "direct (unpooled)" : "pooled"}`);

const result = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: url },
});
process.exit(result.status ?? 1);
