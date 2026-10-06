// Picture was designed on take B (Bella); the final VO is take C (Michael).
// Piecewise-linear map between matched word starts: design time <-> real time.
import pairs from "./warp.json";
const P = pairs as [number, number][];
const map = (x: number, from: 0 | 1, to: 0 | 1) => {
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
export const toReal = (designT: number) => map(designT, 0, 1);
export const toDesign = (realT: number) => map(realT, 1, 0);
