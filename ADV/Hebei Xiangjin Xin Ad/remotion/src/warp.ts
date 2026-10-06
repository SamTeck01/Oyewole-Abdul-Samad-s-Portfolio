// Picture was designed on take B; each language maps design time <-> real VO time via matched word anchors.
import en from "./warp.json";
import zh from "./warp_zh.json";
import { isZh } from "./i18n";
const pick = (lang?: "en" | "zh") => ((lang ?? (isZh() ? "zh" : "en")) === "zh" ? zh : en) as [number, number][];
const map = (P: [number, number][], x: number, from: 0 | 1, to: 0 | 1) => {
  if (x <= P[0][from]) return x;
  for (let i = 1; i < P.length; i++) {
    if (x <= P[i][from]) {
      const [a, b] = [P[i - 1], P[i]];
      return a[to] + ((x - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
    }
  }
  const l = P[P.length - 1];
  return l[to] + (x - l[from]);
};
export const toReal = (designT: number, lang?: "en" | "zh") => map(pick(lang), designT, 0, 1);
export const toDesign = (realT: number, lang?: "en" | "zh") => map(pick(lang), realT, 1, 0);
