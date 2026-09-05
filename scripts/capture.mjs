/**
 * Capture the desktop + mobile screenshots used by the Projects section.
 *
 * Run when you want real shots for a card that currently passes `shots: []`:
 *
 *   npm i -D playwright-core
 *   npx playwright install chromium     # ~200MB, needs a stable connection
 *   node scripts/capture.mjs            # everything in TARGETS
 *   node scripts/capture.mjs luxor      # just one
 *
 * Then import the PNGs in Projects.jsx and fill in that project's shots array.
 *
 * Sizes match the existing assets: 1440x900 desktop, 390x844 mobile.
 * Viewport-only, not full-page — the cards crop to 16/10, and a full-page
 * capture of a long marketing site reads as an unusable thin strip.
 *
 * If `playwright install` keeps timing out, an ordinary browser window at the
 * right size plus a manual screenshot into src/assets/projects/ is a perfectly
 * good substitute. This script is a convenience, not a dependency.
 */

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../src/assets/projects");

const TARGETS = [
  { name: "luxor", url: "https://samteck-demo-websites.vercel.app/demos/luxor" },
  { name: "bq", url: "https://bq-cuisine-samteck.vercel.app" },
];

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900, scale: 1 },
  { label: "mobile", width: 390, height: 844, scale: 2 },
];

const only = process.argv.slice(2);
const targets = only.length
  ? TARGETS.filter((t) => only.includes(t.name))
  : TARGETS;

if (targets.length === 0) {
  console.error(`No target matched. Available: ${TARGETS.map((t) => t.name).join(", ")}`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const target of targets) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.scale,
    });

    /* Neutralise entrance animations before anything renders. Both sites fade
       content in on scroll, so an un-neutered capture catches half-transparent
       sections. Also makes repeat runs comparable. */
    await page
      .addStyleTag({
        content: `*, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        [class*="reveal"], .lx-reveal { opacity: 1 !important; transform: none !important; }`,
      })
      .catch(() => {});

    await page.goto(target.url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);

    const file = resolve(outDir, `${target.name}-${vp.label}.png`);
    await page.screenshot({ path: file });
    console.log(`  ${target.name}-${vp.label}.png  (${vp.width}x${vp.height})`);

    await page.close();
  }
}

await browser.close();
console.log("\nDone. Written to src/assets/projects/");
