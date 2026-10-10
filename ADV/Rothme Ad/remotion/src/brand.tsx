import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as si from "simple-icons";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-sans/400-italic.css";
import "@fontsource/dm-sans/500-italic.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/500.css";

/* ---------- brand tokens (from rothme.app CSS) ---------- */
export const C = {
  bg: "#0B0D24",
  bg2: "#070818",
  surface: "#141638",
  surface2: "#1A1D47",
  line: "rgba(255,255,255,0.09)",
  lineStrong: "rgba(255,255,255,0.16)",
  primary: "#6366F1",
  primarySoft: "#8B8CF8",
  logoBlue: "#0771FA",
  fg: "#F3F4FA",
  muted: "rgba(226,228,245,0.58)",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#F43F5E",
};
export const F = {
  sans: "'DM Sans', sans-serif",
  head: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ---------- time helpers ---------- */
export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
export const useV = () => {
  const { width, height } = useVideoConfig();
  const V = height > width;
  return { V, W: width, H: height, s: V ? 1 : 1 };
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (t: number, a: number, d: number, e = ease) =>
  interpolate(t, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const inOut = (t: number, a: number, b: number, fi = 0.35, fo = 0.35) =>
  Math.min(prog(t, a, fi), 1 - prog(t, b - fo, fo, Easing.in(Easing.cubic)));
/* overshoot spring-ish */
export const pop = (t: number, a: number, d = 0.55) =>
  interpolate(t, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/* deterministic random */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- platform icons (simple-icons) ---------- */
const P: Record<string, { icon: any; name: string; color?: string }> = {
  instagram: { icon: si.siInstagram, name: "Instagram" },
  facebook: { icon: si.siFacebook, name: "Facebook" },
  tiktok: { icon: si.siTiktok, name: "TikTok", color: "#FFFFFF" },
  youtube: { icon: si.siYoutube, name: "YouTube" },
  linkedin: { icon: si.siLinkedin, name: "LinkedIn", color: "#2D8CFF" },
  ga: { icon: si.siGoogleanalytics, name: "Google Analytics" },
  gads: { icon: si.siGoogleads, name: "Google Ads" },
  shopify: { icon: si.siShopify, name: "Shopify" },
  hubspot: { icon: si.siHubspot, name: "HubSpot" },
  mailchimp: { icon: si.siMailchimp, name: "Mailchimp" },
  meta: { icon: si.siMeta, name: "Meta Ads", color: "#2E86FF" },
  gmail: { icon: si.siGmail, name: "Gmail" },
  gsc: { icon: si.siGooglesearchconsole, name: "Search Console" },
  threads: { icon: si.siThreads, name: "Threads", color: "#FFFFFF" },
};
export const pName = (k: string) => P[k].name;
export const PIcon: React.FC<{ k: string; size: number; tile?: boolean; style?: React.CSSProperties }> = ({ k, size, tile = true, style }) => {
  const p = P[k];
  const col = p.color || "#" + p.icon.hex;
  const glyph = (
    <svg viewBox="0 0 24 24" width={tile ? size * 0.52 : size} height={tile ? size * 0.52 : size}>
      <path d={p.icon.path} fill={col} />
    </svg>
  );
  if (!tile) return glyph;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.26, display: "grid", placeItems: "center",
        background: `linear-gradient(160deg, ${C.surface2}, ${C.surface})`, border: `1px solid ${C.lineStrong}`,
        boxShadow: `0 ${size * 0.12}px ${size * 0.4}px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)`, ...style,
      }}
    >
      {glyph}
    </div>
  );
};

/* ---------- Rothme mark (vector rebuild of the app icon), parts animatable ---------- */
export const RothmeMark: React.FC<{
  size: number; tile?: number; bars?: number; arrow?: number; blue?: number; white?: number; style?: React.CSSProperties;
}> = ({ size, tile = 1, bars = 1, arrow = 1, blue = 1, white = 1, style }) => (
  <svg viewBox="0 0 192 192" width={size} height={size} style={{ overflow: "visible", ...style }}>
    <defs>
      <clipPath id="rm-blue"><rect x="40" y="70" width={110 * blue} height="80" /></clipPath>
      <clipPath id="rm-white"><rect x="40" y={40} width="130" height={110 * white} /></clipPath>
    </defs>
    <rect x="13" y="10" width="166" height="170" rx="34" fill="#08111E" opacity={tile} stroke="rgba(255,255,255,.10)" strokeWidth={1.2 * tile} />
    <g clipPath="url(#rm-white)">
      <path fill="#FDFDFD" d="M52 47.5 H116 C134 47.5 145 58 145 76 C145 93 134 104 118 105 L104 105 L97 92 H114 C123 92 128 86 128 77 C128 68 123 63 114 63 H67 Z" />
      <path fill="#FDFDFD" d="M104 105 L118 105 L158 144 H139 Z" />
    </g>
    <g clipPath="url(#rm-blue)"><path fill={C.logoBlue} d="M58 76 H79 L140 144 H119 Z" /></g>
    <g fill={C.logoBlue}>
      <rect x="50" y={144 - 16 * bars} width="10" height={16 * bars} />
      <rect x="64" y={144 - 20 * bars} width="10" height={20 * bars} />
      <rect x="78" y={144 - 24 * bars} width="9" height={24 * bars} />
    </g>
    <path d="M47 129 C63 125 78 118 87 107" stroke={C.logoBlue} strokeWidth="2.4" fill="none" strokeLinecap="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
    <path fill={C.logoBlue} d="M90 103 L80 106 L87 112 Z" opacity={arrow > 0.95 ? 1 : 0} />
  </svg>
);

export const Wordmark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <span style={{ fontFamily: F.head, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", color: C.fg, ...style }}>ROTHME</span>
);

/* ---------- UI atoms ---------- */
export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; r?: number }> = ({ style, children, r = 22 }) => (
  <div
    style={{
      background: `linear-gradient(170deg, rgba(30,33,82,.92), rgba(17,19,52,.94))`,
      border: `1px solid ${C.line}`, borderRadius: r,
      boxShadow: "0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)",
      ...style,
    }}
  >
    {children}
  </div>
);
export const Cap: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 15, style }) => (
  <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: size, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, ...style }}>{children}</div>
);

/* Kinetic headline: words with optional accent (italic indigo like the site) */
export type W = { w: string; a?: boolean; br?: boolean };
export const Kinetic: React.FC<{
  words: W[]; t0: number; t1?: number; size: number; stagger?: number; align?: "center" | "left"; style?: React.CSSProperties; lh?: number;
}> = ({ words, t0, t1 = 999, size, stagger = 0.09, align = "center", style, lh = 1.08 }) => {
  const t = useT();
  const out = prog(t, t1 - 0.35, 0.35, Easing.in(Easing.cubic));
  const lines: W[][] = [[]];
  words.forEach((w) => { if (w.br) lines.push([]); lines[lines.length - 1].push(w); });
  let i = 0;
  return (
    <div style={{ textAlign: align, fontFamily: F.sans, fontWeight: 500, fontSize: size, lineHeight: lh, letterSpacing: "-0.03em", color: C.fg, ...style }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w) => {
            const p = prog(t, t0 + i++ * stagger, 0.6);
            const blur = (1 - p) * 14 + out * 10;
            return (
              <span key={w.w + i} style={{
                display: "inline-block", marginRight: "0.24em",
                opacity: p * (1 - out),
                transform: `translateY(${(1 - p) * 0.45 * size - out * 0.3 * size}px) scale(${0.92 + 0.08 * p})`,
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                fontStyle: w.a ? "italic" : "normal",
                color: w.a ? C.primarySoft : C.fg,
              }}>{w.w}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* Cursor (pointer) */
export const Cursor: React.FC<{ x: number; y: number; press?: number; size?: number; opacity?: number }> = ({ x, y, press = 0, size = 44, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, transform: `scale(${1 - press * 0.18})`, transformOrigin: "0 0", zIndex: 50 }}>
    <div style={{ position: "absolute", left: -size * 0.6, top: -size * 0.6, width: size * 1.2, height: size * 1.2, borderRadius: "50%",
      border: `2px solid rgba(139,140,248,${press * 0.9})`, transform: `scale(${0.6 + press})`, opacity: press }} />
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.5))" }}>
      <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L17.5 14 Z" fill="#fff" stroke="#0B0D24" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  </div>
);
