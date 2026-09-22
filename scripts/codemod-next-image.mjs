#!/usr/bin/env node
/**
 * Replace every <img> on the marketing pages with next/image.
 *
 * Every image gets explicit width and height, which is what removes the
 * layout shift. The existing className still governs the rendered box, so
 * the page looks the same; the attributes only establish the aspect ratio
 * and drive srcset selection.
 *
 * Static src values are measured from scripts/image-inventory.json.
 * Dynamic src values (from data files and props) use the representative
 * dimensions in DYNAMIC below, chosen from the images that expression can
 * actually resolve to.
 *
 * SVG logos are passed through with `unoptimized`: the Next image optimizer
 * refuses SVG unless dangerouslyAllowSVG is set, and there is nothing to
 * gain by optimising a 3 KB vector.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";

const inventory = JSON.parse(readFileSync("scripts/image-inventory.json", "utf8"));
const byPath = new Map(inventory.map((i) => [i.path, i]));

/** Representative dimensions for dynamic src expressions, keyed file:expression. */
const DYNAMIC = {
  "academy/[domain]/page.tsx:domain.overviewImage": [1200, 896],
  "case-studies/[id]/page.tsx:study.heroImage ?? study.image": [1376, 768],
  "case-studies/[id]/page.tsx:study.innerImage1": [1200, 896],
  "case-studies/[id]/page.tsx:study.storyImage ?? study.image": [1376, 768],
  "case-studies/[id]/page.tsx:item.image": [1312, 816],
  "case-study/page.tsx:item.image": [1312, 816],
  "components/AcademyHero.tsx:backgroundImage": [1200, 896],
  "components/Blog.tsx:image": [299, 168],
  "components/FeaturedJobs.tsx:job.image": [386, 218],
  "components/InflexionsAdvantage.tsx:item.src": [388, 499],
  "components/IntelligentAutomation.tsx:item.src": [1312, 816],
  "components/IntelligentAutomation.tsx:logo.src": [80, 36],
  "components/Leaders.tsx:leader.image": [600, 600],
  "components/MainPartners.tsx:logo.src": [180, 72],
  "components/Partners.tsx:logo.src": [120, 40],
  "components/ProgrammeCard.tsx:programme.heroImage": [1200, 896],
  "components/SolutionPartners.tsx:partner.src": [180, 72],
  "components/SwapGrid.tsx:card.photo": [1600, 900],
  "resources/page.tsx:item.coverUrl": [1500, 1000],
  "resources/page.tsx:event.imageUrl": [1024, 1024],
  "solutions/page.tsx:lab.src": [180, 72],
  "solutions/page.tsx:item.img": [1200, 896],
};

/** Components whose images are vector logos: pass them through untouched. */
const UNOPTIMIZED = new Set([
  "components/IntelligentAutomation.tsx:logo.src",
  "components/MainPartners.tsx:logo.src",
  "components/Partners.tsx:logo.src",
  "components/SolutionPartners.tsx:partner.src",
  "solutions/page.tsx:lab.src",
]);

/** Files whose first full-bleed image is the page's LCP element. */
const HERO_FILES = /(^|\/)(page\.tsx|HeroBanner\.tsx|AcademyHero\.tsx)$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const attr = (tag, name) => {
  const str = tag.match(new RegExp(`${name}="([^"]*)"`));
  if (str) return { kind: "string", value: str[1] };
  const expr = tag.match(new RegExp(`${name}=\\{([^}]*(?:\\{[^}]*\\})?[^}]*)\\}`));
  if (expr) return { kind: "expr", value: expr[1].trim() };
  return null;
};

const files = walk("src/app")
  .filter((f) => f.endsWith(".tsx"))
  .filter((f) => !f.split(sep).includes("admin"));

let converted = 0;
const unresolved = [];

for (const file of files) {
  const rel = file.split(sep).join("/").replace(/^src\/app\//, "");
  let src = readFileSync(file, "utf8");
  if (!/<img\b/.test(src)) continue;

  let firstInFile = true;

  src = src.replace(/<img\b[^>]*?\/>/gs, (tag) => {
    const srcAttr = attr(tag, "src");
    const altAttr = attr(tag, "alt");
    const classAttr = tag.match(/className=\{?(`[^`]*`|"[^"]*")\}?/);
    const loading = attr(tag, "loading");
    const keyAttr = attr(tag, "key");

    if (!srcAttr) {
      unresolved.push([rel, "no src", tag.slice(0, 80)]);
      return tag;
    }

    // dimensions
    let dims = null;
    if (srcAttr.kind === "string") {
      const item = byPath.get(srcAttr.value);
      if (item?.width && item?.height) dims = [item.width, item.height];
    } else {
      dims = DYNAMIC[`${rel}:${srcAttr.value}`] ?? null;
    }
    if (!dims) {
      unresolved.push([rel, srcAttr.value, tag.slice(0, 80)]);
      return tag;
    }

    const className = classAttr ? classAttr[1] : null;
    const classText = className ? className.slice(1, -1) : "";
    const fullBleed = /absolute inset-0/.test(classText) || /w-full h-full/.test(classText);
    const fullWidth = /\bw-full\b/.test(classText);

    const isHeroFile = HERO_FILES.test(rel);
    const priority =
      (loading?.value === "eager" || (firstInFile && isHeroFile && fullBleed));
    firstInFile = false;

    const parts = ["<Image"];
    parts.push(
      srcAttr.kind === "string" ? `src="${srcAttr.value}"` : `src={${srcAttr.value}}`
    );
    if (keyAttr) parts.push(`key={${keyAttr.value}}`);
    parts.push(
      altAttr
        ? altAttr.kind === "string"
          ? `alt="${altAttr.value}"`
          : `alt={${altAttr.value}}`
        : 'alt=""'
    );
    parts.push(`width={${dims[0]}}`, `height={${dims[1]}}`);
    if (className) {
      parts.push(
        className.startsWith("`") ? `className={${className}}` : `className=${className}`
      );
    }
    if (fullBleed) parts.push('sizes="100vw"');
    else if (fullWidth) parts.push('sizes="(min-width: 1024px) 50vw, 100vw"');
    if (priority) parts.push("priority");
    if (UNOPTIMIZED.has(`${rel}:${srcAttr.value}`)) parts.push("unoptimized");
    parts.push("/>");

    converted += 1;
    return parts.join("\n        ");
  });

  // the eslint escape hatch is no longer needed
  src = src.replace(
    /[ \t]*\{\/\* eslint-disable-next-line @next\/next\/no-img-element \*\/\}\n/g,
    ""
  );
  src = src.replace(
    /[ \t]*\/\/ eslint-disable-next-line @next\/next\/no-img-element\n/g,
    ""
  );

  if (!/from "next\/image"/.test(src)) {
    const imports = [...src.matchAll(/^import .*?;\n/gm)];
    if (imports.length) {
      const last = imports[imports.length - 1];
      src = src.slice(0, last.index + last[0].length) +
        'import Image from "next/image";\n' +
        src.slice(last.index + last[0].length);
    } else {
      src = 'import Image from "next/image";\n' + src;
    }
  }

  writeFileSync(file, src);
}

console.log(`converted ${converted} <img> tags to next/image`);
if (unresolved.length) {
  console.log(`\nUNRESOLVED (${unresolved.length}) — left as <img>:`);
  for (const [f, s, t] of unresolved) console.log(`  ${f}\n    src: ${s}\n    ${t}`);
  process.exitCode = 1;
}
