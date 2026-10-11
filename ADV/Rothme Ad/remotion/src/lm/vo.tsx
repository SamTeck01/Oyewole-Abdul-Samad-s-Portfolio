import React from "react";
import { useT, prog, F } from "../brand";

export type Word = { w: string; s: number; e: number; line: string | null };
/* start time of the n-th occurrence of `word` in `line` */
export const mkW = (words: Word[]) => (line: string, word: string, n = 0) => {
  const m = words.filter((x) => x.line === line && x.w === word);
  if (!m[n]) throw new Error(`word not found: ${line}/${word}/${n}`);
  return m[n].s;
};
/* captions: words grouped into short chunks (break at punctuation-free ~6 words or line end) */
export const chunks = (words: Word[], texts: Record<string, string>, max = 6) => {
  const out: { t: string; s: number; e: number }[] = [];
  const lines = Array.from(new Set(words.map((w) => w.line)));
  for (const ln of lines) {
    const ws = words.filter((w) => w.line === ln);
    const raw = (texts[ln as string] || "").split(/\s+/).filter(Boolean);
    let cur: number[] = [];
    const flush = () => { if (cur.length) out.push({ t: cur.map((i) => raw[i] ?? ws[i].w).join(" "), s: ws[cur[0]].s, e: ws[cur[cur.length - 1]].e }); cur = []; };
    ws.forEach((_, i) => {
      cur.push(i);
      const tok = raw[i] || "";
      if (/[.?!]$/.test(tok) || (cur.length >= max && /,$/.test(tok)) || cur.length >= max + 2) flush();
    });
    flush();
  }
  return out;
};
export const CaptionBar: React.FC<{ caps: { t: string; s: number; e: number }[]; until?: number; offset?: number; bottom?: number; size?: number }> = ({ caps, until = 1e9, offset = 0, bottom = 46, size = 40 }) => {
  const t = useT() + offset;
  const c = caps.find((x) => t >= x.s - 0.05 && t <= x.e + 0.3);
  if (!c || t > until) return null;
  const p = prog(t, c.s - 0.05, 0.15);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom, display: "flex", justifyContent: "center", zIndex: 100 }}>
      <div style={{ padding: "12px 28px", borderRadius: 16, background: "rgba(7,8,24,.72)", fontFamily: F.sans, fontWeight: 600, fontSize: size, color: "#fff",
        opacity: p, transform: `translateY(${(1 - p) * 8}px)`, letterSpacing: "-0.01em", maxWidth: "86%", textAlign: "center" }}>{c.t}</div>
    </div>
  );
};
