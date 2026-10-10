import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import {
  LayoutDashboard, BarChart3, ShieldCheck, Activity, BookOpen, FileText, Plug, Bell, Settings, Check,
  AlertTriangle, TrendingUp, Gauge, Search, Calendar,
} from "lucide-react";
import { C, F, useT, useV, prog, inOut, pop, lerp, rnd, PIcon, pName, RothmeMark, Wordmark, Glass, Cap, Kinetic, Cursor } from "./brand";
import { Q } from "./cues";

const ab: React.CSSProperties = { position: "absolute" };
const center: React.CSSProperties = { justifyContent: "center", alignItems: "center" };

/* ============ BACKGROUND: deep navy night + drifting indigo glow + stars ============ */
export const Bg: React.FC = () => {
  const t = useT();
  const { W, H } = useV();
  const g1x = 50 + 18 * Math.sin(t * 0.35), g1y = 40 + 12 * Math.cos(t * 0.27);
  const g2x = 30 + 20 * Math.cos(t * 0.22), g2y = 75 + 10 * Math.sin(t * 0.31);
  return (
    <AbsoluteFill style={{ background: C.bg2 }}>
      <AbsoluteFill style={{
        background: `radial-gradient(60% 55% at ${g1x}% ${g1y}%, rgba(99,102,241,.30), transparent 70%),
          radial-gradient(50% 45% at ${g2x}% ${g2y}%, rgba(7,113,250,.16), transparent 70%),
          radial-gradient(120% 90% at 50% 50%, ${C.bg} 30%, ${C.bg2} 100%)`,
      }} />
      {Array.from({ length: 70 }).map((_, i) => {
        const x = rnd(i) * W, y = ((rnd(i + 99) * H - t * (6 + rnd(i + 7) * 14)) % H + H) % H;
        const tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * (1 + rnd(i + 3) * 2) + i));
        const sz = 1 + rnd(i + 5) * 2;
        return <div key={i} style={{ ...ab, left: x, top: y, width: sz, height: sz, borderRadius: 9, background: "#fff", opacity: tw * 0.55 }} />;
      })}
    </AbsoluteFill>
  );
};

/* ============ 1. TAB STORM ============ */
const STORM = [
  { k: "meta", m: "CTR", v: "3.02%", d: "−0.4%", bad: true },
  { k: "ga", m: "Sessions", v: "12,062", d: "+2.1%" },
  { k: "shopify", m: "Orders", v: "318", d: "−1.9%", bad: true },
  { k: "tiktok", m: "Views", v: "61.4K", d: "+8%" },
  { k: "instagram", m: "Reach", v: "182,940", d: "+11.4%" },
  { k: "mailchimp", m: "Open rate", v: "38.2%", d: "−3%", bad: true },
  { k: "gads", m: "Cost / lead", v: "$14.20", d: "+6%", bad: true },
  { k: "hubspot", m: "Leads", v: "1,054", d: "?" },
  { k: "youtube", m: "Watch time", v: "4.1K h", d: "+1%" },
  { k: "linkedin", m: "Impressions", v: "9,812", d: "−2%", bad: true },
  { k: "facebook", m: "Engagement", v: "2.4%", d: "?" },
  { k: "gsc", m: "Clicks", v: "12,884", d: "+6.8%" },
];
const ALERTS = ["Which ad actually worked?", "Report due Monday", "Is the pixel still tracking?", "14 tabs open", "Why are leads down?"];

const MiniCard: React.FC<{ it: typeof STORM[number]; sc: number; i: number }> = ({ it, sc, i }) => {
  const t = useT();
  const flick = Math.floor(t * 9 + i) % 5 === 0;
  return (
    <Glass r={18 * sc} style={{ width: 300 * sc, padding: 18 * sc, display: "flex", flexDirection: "column", gap: 10 * sc }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * sc }}>
        <PIcon k={it.k} size={40 * sc} />
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 19 * sc, color: C.fg }}>{pName(it.k)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.sans, fontSize: 19 * sc, color: C.muted }}>{it.m}</div>
        <div style={{ fontFamily: F.mono, fontSize: 17 * sc, color: it.bad ? C.red : C.green, opacity: flick ? 0.4 : 1 }}>{it.d}</div>
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 30 * sc, color: C.fg, letterSpacing: "-0.02em" }}>{it.v}</div>
      <svg width={264 * sc} height={34 * sc} viewBox="0 0 100 20" preserveAspectRatio="none">
        <polyline fill="none" stroke={it.bad ? C.red : C.primarySoft} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
          points={Array.from({ length: 12 }).map((_, j) => `${j * 9.1},${4 + rnd(i * 13 + j) * 13}`).join(" ")} />
      </svg>
    </Glass>
  );
};

export const Storm: React.FC = () => {
  const t = useT();
  const { V, W, H } = useV();
  const [a, b] = Q.storm;
  if (t > b + 0.05) return null;
  const sc = V ? 1.0 : 1.15;
  const cam = lerp(1, 1.12, prog(t, 0, 3.0, Easing.inOut(Easing.quad)));
  const fly = prog(t, 2.95, 0.55, Easing.in(Easing.cubic));
  const shake = (1 - fly) * prog(t, 1.2, 1.6) * 6;
  const sx = Math.sin(t * 37) * shake, sy = Math.cos(t * 29) * shake;
  return (
    <AbsoluteFill style={{
      transform: `translate(${sx}px,${sy}px) scale(${cam * (1 + fly * 1.6)})`,
      opacity: 1 - fly, filter: fly > 0.01 ? `blur(${fly * 18}px)` : undefined,
    }}>
      {STORM.map((it, i) => {
        const ti = i < 5 ? -0.55 + i * 0.04 : 0.05 + (i - 5) * 0.2 + rnd(i) * 0.06;
        const p = pop(t, ti, 0.5);
        const cols = V ? 3 : 4;
        const fx = ((i % cols) + 0.5) / cols + (rnd(i + 20) - 0.5) * 0.16;
        const rows = Math.ceil(STORM.length / cols);
        const fy = V ? 0.13 + 0.74 * (Math.floor(i / cols) / (rows - 1)) + (rnd(i + 40) - 0.5) * 0.06 : (Math.floor(i / cols) + 0.5) / rows + (rnd(i + 40) - 0.5) * 0.2;
        const HERO = V ? [[0.3, 0.3], [0.7, 0.38], [0.32, 0.52], [0.7, 0.62], [0.42, 0.74]] : [[0.3, 0.38], [0.52, 0.3], [0.74, 0.46], [0.4, 0.64], [0.63, 0.72]];
        const [hx, hy] = i < 5 ? HERO[i] : [fx, fy];
        const ang = rnd(i + 3) * Math.PI * 2;
        const dx = Math.cos(ang) * 900 * (1 - p), dy = Math.sin(ang) * 700 * (1 - p);
        const rot = (rnd(i + 8) - 0.5) * 22 + (1 - p) * 40 * (rnd(i + 9) - 0.5);
        return (
          <div key={i} style={{ ...ab, left: hx * W - 150 * sc, top: hy * H - 95 * sc, opacity: Math.min(1, p * 1.5),
            transform: `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, zIndex: i }}>
            <MiniCard it={it} sc={sc} i={i} />
          </div>
        );
      })}
      {ALERTS.map((s, i) => {
        const ti = 0.2 + i * 0.45;
        const p = pop(t, ti, 0.45);
        const fx = [0.24, 0.7, 0.42, 0.8, 0.18][i], fy = V ? [0.18, 0.34, 0.55, 0.7, 0.86][i] : [0.2, 0.3, 0.62, 0.78, 0.86][i];
        return (
          <div key={s} style={{ ...ab, left: fx * W, top: fy * H, zIndex: 40, transform: `translate(-50%,-50%) scale(${p}) rotate(${(rnd(i + 70) - 0.5) * 10}deg)`, opacity: p }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 99, background: "#FFFFFF",
              boxShadow: "0 18px 50px rgba(0,0,0,.5)", fontFamily: F.sans, fontWeight: 600, fontSize: V ? 30 : 27, color: "#12142E", whiteSpace: "nowrap" }}>
              <div style={{ width: 12, height: 12, borderRadius: 9, background: i % 2 ? C.amber : C.red }} />
              {s}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
export const StormMB: React.FC = () => {
  const t = useT();
  if (t > Q.storm[1] + 0.05) return null;
  return <CameraMotionBlur shutterAngle={180} samples={5}><Storm /></CameraMotionBlur>;
};

/* ============ 2. HEADLINES ============ */
export const Everywhere: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.everywhere; if (t < a || t > b) return null;
  return (
    <AbsoluteFill style={center}>
      <Cap size={V ? 26 : 22} style={{ opacity: inOut(t, a + 0.3, b), marginBottom: 26, letterSpacing: "0.3em" }}>The problem</Cap>
      <Kinetic t0={a + 0.35} t1={b} size={V ? 104 : 118}
        words={V ? [{ w: "Your" }, { w: "marketing" }, { w: "data", br: true }, { w: "is" }, { w: "everywhere.", a: true, br: true }]
                 : [{ w: "Your" }, { w: "marketing" }, { w: "data" }, { w: "is", br: true }, { w: "everywhere.", a: true }]} />
    </AbsoluteFill>
  );
};
export const Working: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.working; if (t < a || t > b) return null;
  return (
    <AbsoluteFill style={center}>
      <Kinetic t0={a + 0.05} t1={b} size={V ? 100 : 118}
        words={V ? [{ w: "Which" }, { w: "part", br: true }, { w: "is" }, { w: "actually", br: true }, { w: "working?", a: true, br: true }]
                 : [{ w: "Which" }, { w: "part" }, { w: "is" }, { w: "actually", br: true }, { w: "working?", a: true }]} />
    </AbsoluteFill>
  );
};

/* ============ 3. MEET ROTHME ============ */
export const Meet: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.meet; if (t < a || t > b) return null;
  const size = V ? 96 : 120;
  const pm = pop(t, a + 0.25, 0.6);
  const spin = (1 - prog(t, a + 0.25, 0.8)) * -200;
  const wOut = prog(t, b - 0.45, 0.35, Easing.in(Easing.cubic));
  const wIn = (d: number) => prog(t, a + d, 0.5);
  const word = (s: string, d: number, accent = false): React.CSSProperties => ({
    fontFamily: F.sans, fontWeight: 500, fontSize: size, letterSpacing: "-0.03em", color: accent ? C.fg : C.fg,
    opacity: wIn(d) * (1 - wOut), transform: `translateX(${(1 - wIn(d)) * (accent ? 60 : -60)}px)`, filter: `blur(${(1 - wIn(d)) * 12 + wOut * 8}px)`,
  });
  /* the mark travels to centre & grows at the end -> becomes the hub of the next scene */
  const mv = prog(t, b - 0.5, 0.5, Easing.inOut(Easing.cubic));
  const markSize = lerp(size * 1.5, V ? 190 : 170, mv);
  const glow = pop(t, a + 0.5, 0.8);
  return (
    <AbsoluteFill style={center}>
      <div style={{ display: "flex", alignItems: "center", gap: size * 0.32 * (1 - mv) }}>
        <span style={{ ...word("Meet", 0.02), width: (1 - mv) * (V ? 260 : 330), overflow: "visible", display: "inline-block" }}>Meet</span>
        <div style={{ position: "relative", width: markSize, height: markSize, transform: `scale(${pm}) rotate(${spin}deg)` }}>
          <div style={{ ...ab, inset: -markSize * 0.6, borderRadius: "50%", background: `radial-gradient(circle, rgba(99,102,241,${0.55 * glow}), transparent 65%)` }} />
          <RothmeMark size={markSize} style={{ position: "relative" }} />
        </div>
        <span style={{ ...word("Rothme.", 0.45, true), width: (1 - mv) * (V ? 420 : 520), display: "inline-block", fontFamily: F.head, fontWeight: 600 }}>Rothme.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 4. CONNECT HUB ============ */
const HUB = ["instagram", "facebook", "tiktok", "youtube", "linkedin", "ga", "gads", "meta", "shopify", "hubspot"];
export const Connect: React.FC = () => {
  const t = useT(); const { V, W, H } = useV();
  const [a, b] = Q.connect; if (t < a || t > b) return null;
  const cx = W / 2, cy = V ? H * 0.52 : H * 0.56;
  const rx = V ? 400 : 640, ry = V ? 560 : 300;
  const out = prog(t, b - 0.45, 0.45, Easing.in(Easing.cubic));
  const markSize = V ? 190 : 170;
  const n = HUB.filter((_, i) => t > a + 0.25 + i * 0.17 + 0.6).length;
  const count = Math.min(14, n + (n === HUB.length ? Math.round(4 * prog(t, a + 0.25 + 10 * 0.17 + 0.6, 0.5)) : 0));
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + out * 1.4})`, opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 14}px)` : undefined }}>
      <div style={{ ...ab, top: V ? 170 : 70, left: 0, right: 0 }}>
        <Kinetic t0={a + 0.05} size={V ? 84 : 76} words={[{ w: "Connect" }, { w: "every" }, { w: "platform.", a: true }]} />
      </div>
      <svg width={W} height={H} style={ab}>
        <defs>
          <linearGradient id="thr" x1="0" x2="1"><stop offset="0" stopColor={C.primary} stopOpacity=".15" /><stop offset="1" stopColor={C.primarySoft} stopOpacity=".9" /></linearGradient>
        </defs>
        {HUB.map((k, i) => {
          const ang = -Math.PI / 2 + (i / HUB.length) * Math.PI * 2 + 0.3;
          const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
          const ti = a + 0.25 + i * 0.17;
          const d = prog(t, ti + 0.2, 0.45);
          const mx = (x + cx) / 2 + Math.sin(ang) * 80, my = (y + cy) / 2 - Math.cos(ang) * 80;
          const path = `M${x},${y} Q${mx},${my} ${cx},${cy}`;
          const ph = ((t - ti) * 0.9) % 1;
          return (
            <g key={k}>
              <path d={path} stroke="url(#thr)" strokeWidth={3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
              {d >= 1 && <circle r={6} fill="#fff" style={{ filter: "drop-shadow(0 0 8px #8B8CF8)" }}
                cx={(1 - ph) ** 2 * x + 2 * (1 - ph) * ph * mx + ph ** 2 * cx} cy={(1 - ph) ** 2 * y + 2 * (1 - ph) * ph * my + ph ** 2 * cy} />}
            </g>
          );
        })}
      </svg>
      {HUB.map((k, i) => {
        const ang = -Math.PI / 2 + (i / HUB.length) * Math.PI * 2 + 0.3;
        const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
        const ti = a + 0.25 + i * 0.17;
        const p = pop(t, ti, 0.5), ok = pop(t, ti + 0.6, 0.4);
        const fl = Math.sin(t * 1.4 + i) * 6;
        const sz = V ? 108 : 96;
        return (
          <div key={k} style={{ ...ab, left: x - sz / 2, top: y - sz / 2 + fl, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>
            <PIcon k={k} size={sz} />
            <div style={{ ...ab, right: -10, top: -10, width: 34, height: 34, borderRadius: 99, background: C.green, display: "grid", placeItems: "center",
              transform: `scale(${ok})`, boxShadow: "0 0 0 4px #0B0D24" }}>
              <Check size={20} color="#fff" strokeWidth={3.5} />
            </div>
          </div>
        );
      })}
      <div style={{ ...ab, left: cx - markSize / 2, top: cy - markSize / 2, width: markSize, height: markSize }}>
        <div style={{ ...ab, inset: -markSize * (0.5 + 0.08 * Math.sin(t * 5)), borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.5), transparent 65%)" }} />
        <RothmeMark size={markSize} style={{ position: "relative" }} />
      </div>
      <div style={{ ...ab, left: 0, right: 0, bottom: V ? 170 : 60, display: "flex", justifyContent: "center", opacity: prog(t, a + 0.6, 0.4) }}>
        <Glass r={99} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 30px", fontFamily: F.sans, fontSize: V ? 32 : 26, color: C.fg }}>
          <Plug size={V ? 30 : 26} color={C.primarySoft} />
          <span style={{ color: C.muted }}>Connected platforms</span>
          <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 40 }}>{count}</span>
          <span style={{ width: 10, height: 10, borderRadius: 9, background: C.green }} />
          <span style={{ color: C.muted }}>All syncing</span>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 5. DASHBOARD (layout copied from rothme.app's sample dashboard) ============ */
const NAV: [any, string][] = [[LayoutDashboard, "Dashboard"], [BarChart3, "Analytics"], [ShieldCheck, "Lead Audit"], [Activity, "Marketing Health"],
  [BookOpen, "Cheat Sheet"], [FileText, "Reports"], [Plug, "Integrations"], [Bell, "Notifications"], [Settings, "Settings"]];

export const Ring: React.FC<{ v: number; size: number; stroke: number }> = ({ v, size, stroke }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <defs><linearGradient id={"rg" + size} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#34D399" /><stop offset="1" stopColor={C.green} /></linearGradient></defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={`url(#rg${size})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,.55))" }} />
    </svg>
  );
};

export const Dashboard: React.FC<{ t0: number }> = ({ t0 }) => {
  const t = useT();
  const cp = (i: number) => pop(t, t0 + 0.12 * i, 0.55);
  const card = (i: number, st: React.CSSProperties, children: React.ReactNode) => (
    <Glass r={18} style={{ ...ab, padding: 22, opacity: Math.min(1, cp(i) * 1.6), transform: `translateY(${(1 - cp(i)) * 40}px) scale(${0.94 + 0.06 * cp(i)})`, ...st }}>{children}</Glass>
  );
  const hv = Math.round(94 * prog(t, t0 + 0.3, 1.2));
  const grow = prog(t, t0 + 0.6, 1.2);
  const pts = [10, 14, 12, 20, 18, 26, 24, 33, 30, 41, 39, 52, 50, 62];
  return (
    <div style={{ position: "relative", width: 1500, height: 840, borderRadius: 26, background: "rgba(10,12,34,.96)", border: `1px solid ${C.lineStrong}`,
      boxShadow: "0 60px 140px rgba(0,0,0,.6), 0 0 120px rgba(99,102,241,.18)", overflow: "hidden", fontFamily: F.sans, color: C.fg }}>
      {/* sidebar */}
      <div style={{ ...ab, left: 0, top: 0, bottom: 0, width: 240, borderRight: `1px solid ${C.line}`, padding: "26px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}><RothmeMark size={40} /><span style={{ fontFamily: F.head, fontWeight: 600, fontSize: 21 }}>Rothme</span></div>
        {NAV.map(([I, s], i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, fontSize: 16, marginBottom: 4,
            background: i === 0 ? "rgba(99,102,241,.18)" : undefined, color: i === 0 ? C.fg : C.muted, opacity: prog(t, t0 + i * 0.04, 0.4) }}>
            <I size={18} />{s}
          </div>
        ))}
      </div>
      {/* header */}
      <div style={{ ...ab, left: 270, right: 30, top: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 28, fontWeight: 600 }}>Dashboard</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "9px 14px", border: `1px solid ${C.line}`, borderRadius: 10, color: C.muted, fontSize: 15 }}><Search size={16} />Search</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "9px 14px", border: `1px solid ${C.line}`, borderRadius: 10, fontSize: 15 }}><Calendar size={16} />Last 30 days</div>
          <div style={{ width: 40, height: 40, borderRadius: 99, background: C.primary, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15 }}>RM</div>
        </div>
      </div>
      {/* row 1 */}
      {card(0, { left: 270, top: 92, width: 380, height: 220 }, <>
        <Cap size={16}>Marketing Health</Cap>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 14 }}>
          <div style={{ position: "relative", width: 130, height: 130 }}>
            <Ring v={hv} size={130} stroke={12} />
            <div style={{ ...ab, inset: 0, display: "grid", placeItems: "center", fontSize: 40, fontWeight: 600 }}>{hv}</div>
          </div>
          <div><div style={{ color: C.green, fontWeight: 600, fontSize: 20 }}>Excellent</div><div style={{ color: C.muted, fontSize: 15, marginTop: 6 }}>/ 100 · +4 this month</div></div>
        </div>
      </>)}
      {card(1, { left: 670, top: 92, width: 360, height: 220 }, <>
        <Cap size={16}>Lead Audit</Cap>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, fontSize: 26, fontWeight: 600 }}><span style={{ width: 12, height: 12, borderRadius: 9, background: C.green }} />Healthy</div>
        <div style={{ color: C.muted, fontSize: 16, marginTop: 10 }}>No critical issues detected.</div>
        <div style={{ color: C.primarySoft, fontSize: 15, marginTop: 30 }}>View Audit →</div>
      </>)}
      {card(2, { left: 1050, top: 92, width: 420, height: 220 }, <>
        <Cap size={16}>Connected Platforms</Cap>
        <div style={{ fontSize: 26, fontWeight: 600, marginTop: 16 }}>14 Connected</div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          {["meta", "gads", "shopify", "mailchimp", "instagram", "tiktok"].map((k, i) => <div key={k} style={{ transform: `scale(${pop(t, t0 + 0.5 + i * 0.07, 0.4)})` }}><PIcon k={k} size={44} /></div>)}
          <div style={{ width: 44, height: 44, borderRadius: 11, border: `1px solid ${C.line}`, display: "grid", placeItems: "center", color: C.muted, fontSize: 15 }}>+8</div>
        </div>
      </>)}
      {/* row 2 */}
      {card(3, { left: 270, top: 332, width: 760, height: 280 }, <>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Cap size={16}>Growth · Traffic & engagement</Cap><span style={{ color: C.green, fontSize: 16, fontWeight: 600 }}>+31.4%</span></div>
        <svg width={716} height={200} viewBox="0 0 130 70" preserveAspectRatio="none" style={{ marginTop: 14 }}>
          <defs><linearGradient id="gf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.primary} stopOpacity=".5" /><stop offset="1" stopColor={C.primary} stopOpacity="0" /></linearGradient>
            <clipPath id="gc"><rect width={130 * grow} height="70" /></clipPath></defs>
          <g clipPath="url(#gc)">
            <polygon fill="url(#gf)" points={`0,70 ${pts.map((v, i) => `${i * 10},${68 - v}`).join(" ")} 130,70`} />
            <polyline fill="none" stroke={C.primarySoft} strokeWidth="2" vectorEffect="non-scaling-stroke" points={pts.map((v, i) => `${i * 10},${68 - v}`).join(" ")} />
          </g>
        </svg>
      </>)}
      {card(4, { left: 1050, top: 332, width: 420, height: 280 }, <>
        <Cap size={16}>Platform Performance</Cap>
        {[["instagram", 92], ["facebook", 74], ["tiktok", 61], ["linkedin", 48], ["youtube", 39]].map(([k, v]: any, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 15 }}>
            <PIcon k={k} size={28} tile={false} />
            <div style={{ flex: 1, height: 9, borderRadius: 9, background: "rgba(255,255,255,.07)" }}>
              <div style={{ width: `${v * prog(t, t0 + 0.7 + i * 0.08, 0.8)}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, ${C.primary}, ${C.primarySoft})` }} />
            </div>
            <span style={{ width: 30, textAlign: "right", fontSize: 15 }}>{v}</span>
          </div>
        ))}
      </>)}
      {/* row 3 metrics */}
      {[["Followers", "48,204", "+3.2%"], ["Reach", "182,940", "+11.4%"], ["Leads", "1,204", "+14.2%"], ["Revenue", "$48,210", "+9.6%"]].map(([m, v, d], i) =>
        card(5 + i, { left: 270 + i * 300, top: 632, width: 280, height: 180 }, <>
          <Cap size={16}>{m}</Cap>
          <div style={{ fontSize: 36, fontWeight: 600, marginTop: 18, letterSpacing: "-0.02em" }}>{v}</div>
          <div style={{ color: C.green, fontSize: 16, marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}><TrendingUp size={16} />{d}<span style={{ color: C.muted }}>vs previous period</span></div>
        </>))}
    </div>
  );
};

export const Dash: React.FC = () => {
  const t = useT(); const { V, W, H } = useV();
  const [a, b] = Q.dash; if (t < a || t > b) return null;
  const rise = prog(t, a + 0.45, 1.0);
  const push = prog(t, a + 0.4, b - a - 0.4, Easing.inOut(Easing.quad));
  const out = prog(t, b - 0.45, 0.45, Easing.in(Easing.cubic));
  const sc = (V ? 0.68 : 0.98) * lerp(0.92, 1.04, push) * (1 + out * 1.8);
  const rx = lerp(34, 8, rise) - push * 4, ry = lerp(-12, 0, rise) + push * 5;
  return (
    <AbsoluteFill>
      <div style={{ ...ab, top: V ? 260 : 52, left: 0, right: 0, zIndex: 5 }}>
        <Kinetic t0={a + 0.05} t1={b} size={V ? 92 : 64} words={V ? [{ w: "Everything." }, { w: "One", a: true, br: true }, { w: "place.", a: true }] : [{ w: "Everything." }, { w: "One", a: true }, { w: "place.", a: true }]} />
      </div>
      <AbsoluteFill style={{ ...center, perspective: 1800, paddingTop: V ? 260 : 120 }}>
        <div style={{ transform: `translateY(${(1 - rise) * 500 - out * 120}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`, opacity: rise * (1 - out),
          filter: out > 0.01 ? `blur(${out * 10}px)` : undefined, transformOrigin: V ? "50% 50%" : "35% 30%" }}>
          <Dashboard t0={a + 0.6} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============ shared feature layout: headline + big card ============ */
const Feature: React.FC<{ a: number; b: number; words: any; wordsV?: any; cap: string; card: React.ReactNode; cardW: number }> = ({ a, b, words, wordsV, cap, card, cardW }) => {
  const t = useT(); const { V } = useV();
  const cin = pop(t, a + 0.2, 0.7);
  const out = prog(t, b - 0.4, 0.4, Easing.in(Easing.cubic));
  const cardStyle: React.CSSProperties = {
    opacity: Math.min(1, cin * 1.5) * (1 - out),
    transform: `translateY(${(1 - cin) * 120 - out * 60}px) rotateY(${(V ? 0 : -14) * (1 - cin) + (V ? 0 : -4)}deg) rotateX(${V ? 6 : 3}deg) scale(${(V ? 1.3 : 1.22) * (0.9 + 0.1 * cin)})`,
    filter: out > 0.01 ? `blur(${out * 10}px)` : undefined,
  };
  if (V)
    return (
      <AbsoluteFill style={{ alignItems: "center", perspective: 1600 }}>
        <div style={{ marginTop: 230, textAlign: "center" }}>
          <Cap size={26} style={{ opacity: inOut(t, a + 0.05, b), marginBottom: 22, color: C.primarySoft, letterSpacing: "0.25em" }}>{cap}</Cap>
          <Kinetic t0={a + 0.1} t1={b} size={88} words={wordsV || words} />
        </div>
        <div style={{ marginTop: 200, width: cardW, ...cardStyle, transformOrigin: "50% 0%" }}>{card}</div>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", perspective: 1800, padding: "0 150px 0 130px", gap: 60 }}>
      <div style={{ flex: 1 }}>
        <Cap size={24} style={{ opacity: inOut(t, a + 0.05, b), marginBottom: 22, color: C.primarySoft, letterSpacing: "0.25em" }}>{cap}</Cap>
        <Kinetic t0={a + 0.1} t1={b} size={104} align="left" words={words} />
      </div>
      <div style={{ width: cardW, ...cardStyle }}>{card}</div>
    </AbsoluteFill>
  );
};

/* ============ 6. HEALTH SCORE ============ */
export const Health: React.FC = () => {
  const t = useT();
  const [a, b] = Q.health; if (t < a || t > b) return null;
  const v = Math.round(interpolate(t, [a + 0.5, a + 1.5, a + 1.9, a + 2.3], [0, 82, 82, 94], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const ex = pop(t, a + 2.3, 0.5);
  const rows: [string, string][] = [["Tracking", "Healthy"], ["Integrations", "14 syncing"], ["Lead capture", "Healthy"]];
  return (
    <Feature a={a} b={b} cap="Marketing Health Score" cardW={680}
      words={[{ w: "Know" }, { w: "the" }, { w: "health", br: true }, { w: "of" }, { w: "your", br: true }, { w: "marketing.", a: true }]}
      wordsV={[{ w: "Know" }, { w: "the" }, { w: "health", br: true }, { w: "of" }, { w: "your" }, { w: "marketing.", a: true, br: true }]}
      card={
        <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Gauge size={24} color={C.primarySoft} /><Cap size={20}>Marketing Health Score</Cap></div>
            <div style={{ padding: "8px 16px", borderRadius: 99, background: "rgba(16,185,129,.16)", color: C.green, fontWeight: 600, fontSize: 19, transform: `scale(${0.6 + 0.4 * ex})`, opacity: ex }}>Excellent</div>
          </div>
          <div style={{ position: "relative", width: 340, height: 340, margin: "30px auto 10px" }}>
            <Ring v={v} size={340} stroke={26} />
            <div style={{ ...ab, inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              <div style={{ color: C.muted, fontSize: 24, marginTop: 6 }}>/ 100</div>
            </div>
          </div>
          <div style={{ textAlign: "center", color: C.green, fontSize: 22, fontWeight: 600, opacity: ex, marginBottom: 22 }}>+4 this month</div>
          {rows.map(([k, s], i) => {
            const p = prog(t, a + 1.0 + i * 0.25, 0.4);
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${C.line}`, fontSize: 22, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <span style={{ color: C.muted }}>{k}</span>
                <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Check size={22} color={C.green} strokeWidth={3} />{s}</span>
              </div>
            );
          })}
        </Glass>
      } />
  );
};

/* ============ 7. WHAT'S WORKING ============ */
export const Bars: React.FC = () => {
  const t = useT();
  const [a, b] = Q.bars; if (t < a || t > b) return null;
  const data: [string, number][] = [["instagram", 92], ["facebook", 74], ["tiktok", 61], ["linkedin", 48], ["youtube", 39]];
  const top = pop(t, a + 1.55, 0.5);
  return (
    <Feature a={a} b={b} cap="Platform Performance" cardW={720}
      words={[{ w: "See" }, { w: "what's", br: true }, { w: "working.", a: true }]}
      card={
        <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Cap size={20}>Platform Performance</Cap><span style={{ color: C.muted, fontSize: 20 }}>Last 30 days</span>
          </div>
          {data.map(([k, v], i) => {
            const p = prog(t, a + 0.5 + i * 0.13, 0.9);
            const hi = i === 0;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 14px", borderRadius: 16, marginTop: 6,
                background: hi ? `rgba(16,185,129,${0.12 * top})` : undefined, border: `1px solid rgba(16,185,129,${hi ? 0.45 * top : 0})` }}>
                <PIcon k={k} size={52} />
                <div style={{ width: 130, fontSize: 22 }}>{pName(k)}</div>
                <div style={{ flex: 1, height: 14, borderRadius: 9, background: "rgba(255,255,255,.07)" }}>
                  <div style={{ width: `${v * p}%`, height: "100%", borderRadius: 9, background: hi && top > 0 ? `linear-gradient(90deg, ${C.green}, #34D399)` : `linear-gradient(90deg, ${C.primary}, ${C.primarySoft})`,
                    boxShadow: hi ? `0 0 ${18 * top}px rgba(16,185,129,.6)` : undefined }} />
                </div>
                <div style={{ width: 46, textAlign: "right", fontSize: 26, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{Math.round(v * p)}</div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {[["Leads", "1,204", "+14.2%"], ["Revenue", "$48,210", "+9.6%"]].map(([m, v, d], i) => {
              const p = pop(t, a + 1.3 + i * 0.15, 0.5);
              return (
                <div key={m} style={{ flex: 1, padding: 20, borderRadius: 16, border: `1px solid ${C.line}`, background: "rgba(255,255,255,.03)", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
                  <Cap size={18}>{m}</Cap>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
                    <span style={{ fontSize: 36, fontWeight: 600 }}>{v}</span><span style={{ color: C.green, fontSize: 19 }}>{d}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 34, top: 112, padding: "8px 16px", borderRadius: 99, background: C.green, color: "#04241A", fontWeight: 700, fontSize: 17,
            transform: `scale(${top}) rotate(${(1 - top) * -10}deg)`, opacity: top }}>Top performer</div>
        </Glass>
      } />
  );
};

/* ============ 8. LEAD AUDIT ============ */
export const Audit: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.audit; if (t < a || t > b) return null;
  const tap = a + 1.75;
  const fixed = prog(t, tap + 0.12, 0.35);
  const press = Math.max(0, 1 - Math.abs(t - tap) / 0.12);
  const rows: [string, string][] = [["Website forms", "Healthy"], ["Meta Pixel", "Connected"], ["Google Ads tracking", "Connected"]];
  const cw = 720;
  /* cursor path inside card coords */
  const cp = prog(t, a + 0.9, 0.8, Easing.inOut(Easing.cubic));
  const cx = lerp(cw + 80, cw - 150, cp), cy = lerp(620, 468, cp);
  return (
    <Feature a={a} b={b} cap="Lead Audit" cardW={cw}
      words={[{ w: "Catch" }, { w: "problems", br: true }, { w: "before" }, { w: "they", a: true, br: true }, { w: "cost", a: true }, { w: "you.", a: true }]}
      wordsV={[{ w: "Catch" }, { w: "problems", br: true }, { w: "before" }, { w: "they" }, { w: "cost", a: true, br: true }, { w: "you.", a: true }]}
      card={
        <div style={{ position: "relative" }}>
          <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><ShieldCheck size={26} color={C.primarySoft} /><Cap size={20}>Lead Audit</Cap></div>
              <div style={{ fontSize: 20, color: C.muted }}>142 leads tracked</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, fontSize: 36, fontWeight: 600 }}>
              <span style={{ width: 16, height: 16, borderRadius: 9, background: fixed > 0.5 ? C.green : C.amber, boxShadow: `0 0 16px ${fixed > 0.5 ? C.green : C.amber}` }} />
              {fixed > 0.5 ? "Healthy" : "1 action recommended"}
            </div>
            <div style={{ marginTop: 22 }}>
              {rows.map(([k, s], i) => {
                const p = prog(t, a + 0.4 + i * 0.12, 0.4);
                return (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderTop: `1px solid ${C.line}`, fontSize: 23, opacity: p }}>
                    <span>{k}</span><span style={{ display: "flex", gap: 10, alignItems: "center", color: C.green }}><Check size={22} strokeWidth={3} />{s}</span>
                  </div>
                );
              })}
              {(() => {
                const p = pop(t, a + 0.85, 0.5);
                return (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", margin: "6px -20px 0", borderRadius: 16, fontSize: 23,
                    background: fixed > 0.5 ? "rgba(16,185,129,.12)" : `rgba(245,158,11,${0.14 * p})`, border: `1px solid ${fixed > 0.5 ? "rgba(16,185,129,.4)" : "rgba(245,158,11,.45)"}`,
                    opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {fixed > 0.5 ? <Check size={22} color={C.green} strokeWidth={3} /> : <AlertTriangle size={22} color={C.amber} />}Contact form
                      </div>
                      <div style={{ color: C.muted, fontSize: 18, marginTop: 6 }}>{fixed > 0.5 ? "Leads are coming in again" : "No new leads in 48 hours"}</div>
                    </div>
                    <div style={{ padding: "12px 22px", borderRadius: 12, fontWeight: 600, fontSize: 20, background: fixed > 0.5 ? C.green : C.primary, transform: `scale(${1 - press * 0.08})` }}>
                      {fixed > 0.5 ? "Resolved" : "Review"}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Glass>
          <Cursor x={cx} y={cy} press={press} size={V ? 56 : 50} opacity={prog(t, a + 0.85, 0.2) * (1 - prog(t, b - 0.5, 0.2))} />
        </div>
      } />
  );
};

/* ============ 9. CHEAT SHEET ============ */
export const Cheat: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.cheat; if (t < a || t > b) return null;
  const tiles: [string, string, string][] = [["Followers", "48,204", "+3.2%"], ["Reach", "182,940", "+11.4%"], ["Impressions", "412,558", "+8.1%"],
    ["CTR", "3.42%", "+0.4pp"], ["Website Clicks", "12,884", "+6.8%"], ["Leads", "1,204", "+14.2%"]];
  const tap = a + 1.4;
  const press = Math.max(0, 1 - Math.abs(t - tap) / 0.12);
  const open = pop(t, tap + 0.1, 0.6);
  const cp = prog(t, a + 0.7, 0.7, Easing.inOut(Easing.cubic));
  const cw = 760;
  const tw = Math.floor((cw - 80 - 32) / 3) - 2;
  const cx = lerp(cw + 60, 40 + tw * 0.62, cp), cy = lerp(560, 40 + 170 + 16 + 110, cp);
  return (
    <Feature a={a} b={b} cap="Marketing Cheat Sheet" cardW={cw}
      words={[{ w: "Every" }, { w: "metric,", br: true }, { w: "in" }, { w: "plain", a: true, br: true }, { w: "English.", a: true }]}
      wordsV={[{ w: "Every" }, { w: "metric,", br: true }, { w: "in" }, { w: "plain", a: true }, { w: "English.", a: true, br: true }]}
      card={
        <div style={{ position: "relative" }}>
          <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {tiles.map(([m, v, d], i) => {
                const p = pop(t, a + 0.3 + i * 0.07, 0.45);
                const hi = m === "CTR";
                return (
                  <div key={m} style={{ width: tw, height: 170, padding: 20, borderRadius: 16, boxSizing: "border-box",
                    border: `1px solid ${hi && open > 0 ? C.primarySoft : C.line}`, background: hi ? `rgba(99,102,241,${0.2 * open})` : "rgba(255,255,255,.03)",
                    opacity: Math.min(1, p * 1.4), transform: `scale(${(0.85 + 0.15 * p) * (hi ? 1 - press * 0.05 : 1)})` }}>
                    <Cap size={16} style={{ whiteSpace: "nowrap", letterSpacing: "0.06em" }}>{m}</Cap>
                    <div style={{ fontSize: 34, fontWeight: 600, marginTop: 14 }}>{v}</div>
                    <div style={{ color: C.green, fontSize: 17, marginTop: 6 }}>{d}</div>
                    <div style={{ color: C.primarySoft, fontSize: 18, marginTop: 6 }}>Learn more</div>
                  </div>
                );
              })}
            </div>
          </Glass>
          {/* explanation card */}
          <div style={{ position: "absolute", left: V ? 30 : -150, right: V ? 30 : 120, top: V ? 400 : 330, zIndex: 20,
            opacity: open, transform: `translateY(${(1 - open) * 40}px) scale(${0.85 + 0.15 * open})`, transformOrigin: "40% 0%" }}>
            <div style={{ background: "#FFFFFF", color: "#12142E", borderRadius: 22, padding: 32, fontFamily: F.sans, boxShadow: "0 40px 100px rgba(0,0,0,.6)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", color: C.primary, fontWeight: 600, fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase" }}><BookOpen size={20} />Cheat Sheet</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14, letterSpacing: "-0.02em" }}>Click-Through Rate (CTR)</div>
              <div style={{ fontSize: 23, lineHeight: 1.4, marginTop: 12, color: "#3A3D5C" }}>The percentage of people who clicked after seeing your content or advertisement.</div>
              <div style={{ display: "inline-block", fontFamily: F.mono, fontSize: 18, marginTop: 18, padding: "8px 14px", borderRadius: 10, background: "#EEF0FF", color: C.primary }}>Clicks ÷ Impressions × 100</div>
            </div>
          </div>
          <Cursor x={cx} y={cy} press={press} size={V ? 56 : 50} opacity={prog(t, a + 0.6, 0.2) * (1 - prog(t, a + 2.0, 0.3))} />
        </div>
      } />
  );
};

/* ============ 10. CONNECT. UNDERSTAND. ACT. ============ */
export const CUA: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.cua; if (t < a || t > b) return null;
  const words: [string, number, boolean][] = [["Connect.", a + 0.0, false], ["Understand.", a + 0.5, false], ["Act.", a + 1.0, true]];
  const out = prog(t, b - 0.3, 0.3, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{ ...center, flexDirection: V ? "column" : "row", gap: V ? 10 : 36, opacity: 1 - out, transform: `scale(${1 + out * 0.3})`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      {words.map(([w, ti, acc]) => {
        const p = pop(t, ti, 0.45);
        return (
          <div key={w} style={{ fontFamily: F.sans, fontWeight: 500, fontSize: V ? 130 : 128, letterSpacing: "-0.035em", fontStyle: acc ? "italic" : "normal",
            color: acc ? C.primarySoft : C.fg, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 80}px) scale(${0.8 + 0.2 * p})`,
            filter: `blur(${(1 - Math.min(1, p)) * 14}px)` }}>{w}</div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ============ 11. LOGO ============ */
export const Logo: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a, b] = Q.logo; if (t < a || t > b) return null;
  const arrow = prog(t, a + 0.1, 0.55, Easing.inOut(Easing.cubic));
  const bars = pop(t, a + 0.05, 0.45);
  const blue = prog(t, a + 0.45, 0.35);
  const white = prog(t, a + 0.65, 0.4);
  const tile = prog(t, a + 0.5, 0.5);
  const burst = prog(t, a + 1.0, 0.9);
  const wm = prog(t, a + 1.15, 0.6), tag = prog(t, a + 1.55, 0.6), url = pop(t, a + 1.95, 0.5);
  const out = prog(t, b - 0.35, 0.35);
  const size = V ? 300 : 260;
  return (
    <AbsoluteFill style={{ ...center, flexDirection: "column", opacity: 1 - out }}>
      <div style={{ position: "relative", width: size, height: size, transform: `scale(${0.9 + 0.1 * prog(t, a, 2.5)})` }}>
        <div style={{ ...ab, inset: -size * 0.9, borderRadius: "50%", background: `radial-gradient(circle, rgba(99,102,241,${0.5 * tile}), transparent 60%)` }} />
        <div style={{ ...ab, inset: -size * (0.2 + burst * 0.9), borderRadius: "50%", border: `2px solid rgba(139,140,248,${(1 - burst) * 0.8})` }} />
        <RothmeMark size={size} tile={tile} bars={bars} arrow={arrow} blue={blue} white={white} style={{ position: "relative" }} />
      </div>
      <Wordmark size={V ? 110 : 96} style={{ marginTop: 40, opacity: wm, letterSpacing: `${0.25 * (1 - wm) - 0.01}em`, filter: `blur(${(1 - wm) * 10}px)` }} />
      <div style={{ fontFamily: F.sans, fontSize: V ? 44 : 38, color: C.fg, marginTop: 22, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)`, textAlign: "center", lineHeight: 1.3 }}>
        Stop guessing.{V ? <br /> : " "}<span style={{ fontStyle: "italic", color: C.primarySoft }}>Start understanding your marketing.</span>
      </div>
      <div style={{ marginTop: 40, padding: V ? "20px 44px" : "16px 38px", borderRadius: 99, background: C.primary, color: "#fff", fontFamily: F.sans, fontWeight: 600, fontSize: V ? 40 : 32,
        transform: `scale(${url})`, opacity: Math.min(1, url * 2), boxShadow: "0 20px 60px rgba(99,102,241,.5)" }}>rothme.app</div>
    </AbsoluteFill>
  );
};

/* ============ 12. SAMTECK END CARD ============ */
export const Samteck: React.FC = () => {
  const t = useT(); const { V } = useV();
  const [a] = Q.card; if (t < a) return null;
  const p = prog(t, a + 0.1, 0.7);
  const s = V ? 1.1 : 1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1b1f3a 0%, #070818 70%)", ...center, flexDirection: "column", opacity: prog(t, a, 0.25) }}>
      <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 20 * s, color: "rgba(255,255,255,.55)", letterSpacing: "0.5em", opacity: p }}>MADE BY</div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 92 * s, color: "#fff", letterSpacing: `${-0.03 + (1 - p) * 0.2}em`, opacity: p, marginTop: 10 }}>samteck</div>
      <div style={{ width: 220 * s * p, height: 3, background: C.primarySoft, marginTop: 18, borderRadius: 3 }} />
    </AbsoluteFill>
  );
};
