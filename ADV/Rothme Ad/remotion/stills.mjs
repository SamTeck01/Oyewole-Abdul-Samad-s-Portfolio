import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const [comp, outDir, ...times] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const c = await selectComposition({ serveUrl, id: comp, inputProps: { audio: false } });
for (const s of times) {
  await renderStill({ composition: c, serveUrl, output: `${outDir}/${comp}_${s}.png`, frame: Math.round(parseFloat(s) * 60), inputProps: { audio: false }, scale: parseFloat(process.env.SC||"0.5") });
  console.log("ok", s);
}
