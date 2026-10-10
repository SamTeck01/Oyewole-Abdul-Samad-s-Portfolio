import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, getStaticFiles } from "remotion";
import { Lock, Check, AlertTriangle, BookOpen, FileText, Sparkles, Target, Users, Lightbulb, Bell, ShieldCheck, Plug, ArrowRight } from "lucide-react";
import { C, F, useT, prog, pop, lerp, rnd, PIcon, pName, RothmeMark, Wordmark, Glass, Cap, Kinetic, Cursor } from "../brand";
import { Dashboard, Ring } from "../Scenes";
import { Maya, Hand, Mood } from "./Maya";
import CAPS from "./captions.json";

export const EX_TOTAL = 86.2;
const ab: React.CSSProperties = { position: "absolute" };
const cc: React.CSSProperties = { justifyContent: "center", alignItems: "center" };

/* scene window: fade/scale in & out, returns null outside */
const Sc: React.FC<{ a: number; b: number; children: React.ReactNode; zoomOut?: boolean; style?: React.CSSProperties }> = ({ a, b, children, zoomOut, style }) => {
  const t = useT();
  if (t < a - 0.01 || t > b + 0.01) return null;
  const i = prog(t, a, 0.5), o = prog(t, b - 0.45, 0.45, Easing.in(Easing.cubic));
  const s = (0.96 + 0.04 * i) * (zoomOut ? 1 - 0.06 * o : 1 + 0.08 * o);
  return (
    <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${s})`, filter: o > 0.01 ? `blur(${o * 12}px)` : undefined, ...style }}>{children}</AbsoluteFill>
  );
};

/* living character: blinks + breathing */
const LiveMaya: React.FC<{ mood: Mood; width: number; look?: number; tilt?: number; style?: React.CSSProperties; typing?: boolean }> = ({ mood, width, look = 0, tilt = 0, style, typing }) => {
  const t = useT();
  const bt = (t * 1000) % 3700;
  const blink = bt < 120 ? Math.sin((bt / 120) * Math.PI) : 0;
  return <Maya mood={mood} width={width} blink={blink} look={look} breathe={Math.sin(t * 2.2)} headTilt={tilt + Math.sin(t * 1.3) * 1.2}
    nod={typing ? Math.abs(Math.sin(t * 6)) * 0.3 : 0} style={style} />;
};

/* ---------- background ---------- */
const Bg: React.FC = () => {
  const t = useT();
  const a = 135 + Math.sin(t * 0.15) * 10;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${a}deg, #090B20 0%, #1B1D52 38%, #4B4FC9 72%, #A9ABFF 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(45% 40% at ${60 + 15 * Math.sin(t * 0.2)}% ${45 + 10 * Math.cos(t * 0.17)}%, rgba(139,140,248,.35), transparent 70%)` }} />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = rnd(i) * 1920 + Math.sin(t * 0.3 + i) * 30, y = rnd(i + 30) * 1080 + Math.cos(t * 0.25 + i) * 30, r = 6 + rnd(i + 5) * 22;
        return <div key={i} style={{ ...ab, left: x, top: y, width: r, height: r, borderRadius: 99, background: "rgba(201,204,255,.18)" }} />;
      })}
    </AbsoluteFill>
  );
};

/* ---------- captions ---------- */
const Captions: React.FC = () => {
  const t = useT();
  const c = (CAPS as any[]).find((x) => t >= x.s - 0.05 && t <= x.e + 0.35);
  if (!c || t > 83.6) return null;
  const p = prog(t, c.s - 0.05, 0.15);
  return (
    <div style={{ ...ab, left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", zIndex: 100 }}>
      <div style={{ padding: "12px 28px", borderRadius: 16, background: "rgba(7,8,24,.72)", fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: "#fff",
        opacity: p, transform: `translateY(${(1 - p) * 8}px)`, letterSpacing: "-0.01em" }}>{c.t}</div>
    </div>
  );
};

/* ---------- small pieces ---------- */
const Bubble: React.FC<{ k: string; x: number; y: number; t0: number; size?: number }> = ({ k, x, y, t0, size = 92 }) => {
  const t = useT(); const p = pop(t, t0, 0.5);
  return <div style={{ ...ab, left: x - size / 2, top: y - size / 2 + Math.sin(t * 1.5 + x) * 8, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}><PIcon k={k} size={size} /></div>;
};
const Laptop: React.FC<{ w: number; children?: React.ReactNode; back?: boolean }> = ({ w, children, back }) => (
  <div style={{ position: "relative", width: w, height: w * 0.64 }}>
    <div style={{ ...ab, inset: 0, borderRadius: w * 0.03, background: back ? "linear-gradient(160deg,#D8DAF7,#B9BCEB)" : "#0F1130", border: back ? undefined : `${w * 0.018}px solid #2A2D66`, overflow: "hidden" }}>
      {back ? <div style={{ ...ab, left: "50%", top: "50%", width: w * 0.08, height: w * 0.08, marginLeft: -w * 0.04, marginTop: -w * 0.04, borderRadius: 99, background: "rgba(255,255,255,.6)" }} /> : children}
    </div>
    {!back && <div style={{ ...ab, left: -w * 0.08, right: -w * 0.08, bottom: -w * 0.04, height: w * 0.04, borderRadius: "0 0 20px 20px", background: "#C9CCF2" }} />}
  </div>
);
const Step: React.FC<{ n: string; label: string; t0: number }> = ({ n, label, t0 }) => {
  const t = useT(); const p = prog(t, t0, 0.5);
  return (
    <div style={{ ...ab, left: 120, top: 90, display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ fontFamily: F.mono, fontSize: 26, color: C.primarySoft, padding: "8px 14px", border: `1px solid ${C.primarySoft}`, borderRadius: 10 }}>{n}</div>
      <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 56, color: C.fg, letterSpacing: "-0.02em" }}>{label}</div>
    </div>
  );
};

/* =========================== SCENES =========================== */

/* 1. Hook: laptop screen full of tabs & alerts + question */
const Hook: React.FC = () => {
  const t = useT();
  const tabs = ["Meta Ads", "Analytics", "Shopify", "TikTok", "Instagram", "Mailchimp", "Google Ads", "HubSpot", "YouTube", "Gmail"];
  const alerts = ["CTR down 0.4%", "Report due Monday", "Why are leads down?"];
  return (
    <Sc a={0} b={3.7}>
      <AbsoluteFill style={{ ...cc, transform: `scale(${1.12 - 0.1 * prog(t, 0, 3.6, Easing.inOut(Easing.quad))})` }}>
        <Laptop w={1500}>
          <div style={{ display: "flex", gap: 6, padding: "14px 16px", background: "#181A45" }}>
            {tabs.map((s, i) => (
              <div key={s} style={{ flex: 1, padding: "10px 12px", borderRadius: "10px 10px 0 0", background: i === Math.floor(t * 3) % 10 ? "#2B2E70" : "#202258",
                fontFamily: F.sans, fontSize: 17, color: C.muted, whiteSpace: "nowrap", overflow: "hidden" }}>{s}</div>
            ))}
          </div>
          <div style={{ ...ab, left: 0, right: 0, top: 70, bottom: 0, filter: "blur(3px)", opacity: 0.5 }}>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ ...ab, left: 40 + (i % 4) * 360, top: 30 + Math.floor(i / 4) * 420, width: 330, height: 380, borderRadius: 16, background: "#1C1F55" }} />)}
          </div>
          {alerts.map((s, i) => {
            const p = pop(t, 0.15 + i * 0.6, 0.45);
            return (
              <div key={s} style={{ ...ab, right: 40, top: 110 + i * 92, transform: `translateX(${(1 - p) * 300}px)`, opacity: p, display: "flex", gap: 12, alignItems: "center",
                padding: "16px 22px", borderRadius: 14, background: "#fff", fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: "#12142E", boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
                <Bell size={22} color={i === 1 ? C.amber : C.red} />{s}
              </div>
            );
          })}
        </Laptop>
      </AbsoluteFill>
      <AbsoluteFill style={{ ...cc, background: "radial-gradient(60% 50% at 50% 50%, rgba(9,11,32,.75), transparent 80%)" }}>
        <Kinetic t0={0} size={92} stagger={0.12}
          words={[{ w: "Do" }, { w: "you" }, { w: "actually" }, { w: "know" }, { w: "which", br: true }, { w: "of" }, { w: "your" }, { w: "marketing" }, { w: "is" }, { w: "working?", a: true }]} />
      </AbsoluteFill>
    </Sc>
  );
};

/* 2–3. Maya at her desk: platforms, then problems */
const Desk: React.FC = () => {
  const t = useT();
  const a = 3.5, b = 22.1;
  const prob = t > 12.2;
  const mood: Mood = t < 9.2 ? "neutral" : t < 12.2 ? "focused" : "worried";
  /* camera: wide, then push in to her face at the end */
  const push = prog(t, 19.4, 2.4, Easing.inOut(Easing.cubic));
  const cam = `translate(${-push * 120}px, ${push * 260}px) scale(${1 + push * 0.9})`;
  const problems: [string, number, number, number][] = [
    ["Too Many Dashboards", 12.5, 300, 250], ["Hard To Understand", 14.9, 1620, 250], ["Problems Go Unnoticed", 18.5, 290, 600], ["Leads Get Lost", 20.76, 1630, 600]];
  const drop = prog(t, 20.8, 1.0, Easing.in(Easing.quad));
  return (
    <Sc a={a} b={b}>
      <AbsoluteFill style={{ transform: cam, transformOrigin: "50% 40%" }}>
        {/* platform bubbles */}
        {!prob && <>
          <Bubble k="meta" x={520} y={260} t0={5.02} /><Bubble k="gads" x={420} y={430} t0={5.12} />
          <Bubble k="instagram" x={1400} y={250} t0={5.76} /><Bubble k="tiktok" x={1510} y={420} t0={5.86} />
          <Bubble k="mailchimp" x={360} y={640} t0={7.1} /><Bubble k="gmail" x={540} y={760} t0={7.2} />
          <Bubble k="shopify" x={1560} y={640} t0={8.2} /><Bubble k="ga" x={1380} y={770} t0={8.3} />
        </>}
        {/* "ten different places": tabs fan out above her */}
        {t > 10.3 && t < 12.6 && Array.from({ length: 10 }).map((_, i) => {
          const p = pop(t, 10.4 + i * 0.05, 0.4);
          const ang = (-70 + i * 15.5) * (Math.PI / 180);
          return <div key={i} style={{ ...ab, left: 960 + Math.sin(ang) * 520 * p - 70, top: 520 - Math.cos(ang) * 420 * p - 22, width: 140, height: 44, borderRadius: 10,
            background: "#fff", opacity: p * (1 - prog(t, 12.1, 0.4)), transform: `rotate(${(i - 4.5) * 4}deg)`, fontFamily: F.sans, fontSize: 18, fontWeight: 600, color: "#1C1F4A",
            display: "grid", placeItems: "center" }}>Tab {i + 1}</div>;
        })}
        {/* problem cards */}
        {problems.map(([s, t0, x, y], i) => {
          const p = pop(t, t0, 0.5);
          return (
            <div key={s} style={{ ...ab, left: x - 210, top: y - 60, width: 420, transform: `scale(${p}) rotate(${(i % 2 ? 3 : -3) * p}deg)`, opacity: Math.min(1, p * 2) }}>
              <Glass r={20} style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(244,63,94,.18)", display: "grid", placeItems: "center", fontFamily: F.mono, color: C.red, fontSize: 22 }}>{i + 1}</div>
                <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.fg }}>{s}</div>
              </Glass>
            </div>
          );
        })}
        {/* falling lead */}
        {t > 20.7 && <div style={{ ...ab, left: 1630 - 16, top: 680 + drop * 420, width: 32, height: 32, borderRadius: 99, background: C.green, boxShadow: "0 0 24px #10B981", opacity: 1 - drop }} />}
        {/* Maya at desk */}
        <div style={{ ...ab, left: 960 - 290, top: 300 }}><LiveMaya mood={mood} width={580} look={prob ? 0 : Math.sin(t * 0.8) * 0.6} /></div>
        <div style={{ ...ab, left: 0, right: 0, top: 860, height: 300, background: "linear-gradient(180deg,#2A2D73,#1D1F55)", borderTop: "8px solid #3B3F99" }} />
        <div style={{ ...ab, left: 960 - 260, top: 640 }}><Laptop w={520} back /></div>
        {/* coffee mug + plant */}
        <div style={{ ...ab, left: 1300, top: 770, width: 70, height: 90, borderRadius: "10px 10px 18px 18px", background: "#F3F4FA" }} />
        <div style={{ ...ab, left: 1362, top: 790, width: 34, height: 44, borderRadius: 99, border: "10px solid #F3F4FA" }} />
        <div style={{ ...ab, left: 480, top: 760, width: 90, height: 100, borderRadius: "8px 8px 20px 20px", background: "#8B8CF8" }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ ...ab, left: 510 + (i - 2) * 22, top: 640 + Math.abs(i - 2) * 26, width: 34, height: 130, borderRadius: "50% 50% 10px 10px",
          background: i % 2 ? "#10B981" : "#34D399", transform: `rotate(${(i - 2) * 16 + Math.sin(t * 1.5 + i) * 2}deg)`, transformOrigin: "50% 100%" }} />)}
        {/* phone buzz */}
        {t < 12 && <div style={{ ...ab, left: 1180, top: 815 + Math.sin(t * 60) * (Math.floor(t * 2) % 3 === 0 ? 3 : 0), width: 90, height: 48, borderRadius: 10, background: "#12142E", border: "3px solid #3B3F99" }} />}
      </AbsoluteFill>
    </Sc>
  );
};

/* 4. turn: word swap */
const Turn: React.FC = () => {
  const t = useT();
  const strike = prog(t, 23.5, 0.4);
  const out1 = prog(t, 24.0, 0.35);
  return (
    <Sc a={22.1} b={26.3}>
      <AbsoluteFill style={cc}>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 96, color: C.fg, letterSpacing: "-0.03em", textAlign: "center", lineHeight: 1.15 }}>
          <div style={{ opacity: 1 - out1 * 0.7, transform: `translateY(${-out1 * 40}px) scale(${1 - out1 * 0.2})` }}>
            <span style={{ position: "relative" }}>
              Not <span style={{ color: C.muted }}>more dashboards.</span>
              <span style={{ ...ab, left: 0, top: "52%", height: 8, borderRadius: 8, background: C.red, width: `${strike * 100}%` }} />
            </span>
          </div>
          <div style={{ opacity: prog(t, 24.3, 0.4), transform: `translateY(${(1 - prog(t, 24.3, 0.5)) * 50}px)`, filter: `blur(${(1 - prog(t, 24.3, 0.5)) * 10}px)` }}>
            One that makes <span style={{ fontStyle: "italic", color: C.primarySoft }}>sense.</span>
          </div>
        </div>
      </AbsoluteFill>
    </Sc>
  );
};

/* 5. Meet Rothme: icons pulled into a point → logo */
const Meet: React.FC = () => {
  const t = useT();
  const pull = prog(t, 26.3, 0.9, Easing.in(Easing.cubic));
  const ks = ["meta", "instagram", "tiktok", "shopify", "mailchimp", "ga", "gads", "gmail", "youtube", "hubspot"];
  const flash = prog(t, 27.0, 0.5);
  const logo = (d: number, dd = 0.4) => prog(t, 27.1 + d, dd);
  const tags: [string, number][] = [["Together", 28.56], ["What's working", 29.62], ["Needs attention", 31.3]];
  return (
    <Sc a={26.2} b={33.0}>
      {ks.map((k, i) => {
        const ang = (i / ks.length) * Math.PI * 2;
        const r = 620 * (1 - pull);
        return pull < 1 && <div key={k} style={{ ...ab, left: 960 + Math.cos(ang) * r * 1.4 - 45, top: 470 + Math.sin(ang) * r * 0.7 - 45, transform: `scale(${1 - pull * 0.8}) rotate(${pull * 180}deg)`, opacity: 1 - pull * 0.6 }}><PIcon k={k} size={90} /></div>;
      })}
      <div style={{ ...ab, left: 960 - 300, top: 470 - 300, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.9 * flash * (1 - prog(t, 27.6, 0.8))}), rgba(139,140,248,${0.5 * flash}) 30%, transparent 65%)` }} />
      <AbsoluteFill style={{ ...cc, flexDirection: "column", paddingBottom: 120 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * pop(t, 27.1, 0.6)})`, opacity: logo(0, 0.2) }}>
          <RothmeMark size={230} bars={logo(0, 0.4)} arrow={logo(0.1, 0.5)} blue={logo(0.3)} white={logo(0.45)} tile={logo(0.3)} />
        </div>
        <Wordmark size={92} style={{ marginTop: 26, opacity: logo(0.6, 0.5) }} />
        <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
          {tags.map(([s, t0]) => {
            const p = pop(t, t0, 0.45);
            return <div key={s} style={{ padding: "14px 26px", borderRadius: 99, background: "rgba(255,255,255,.1)", border: `1px solid ${C.lineStrong}`, fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.fg,
              transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>{s}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Sc>
  );
};

/* 6. Connect: integrations list + hand taps */
const Connect: React.FC = () => {
  const t = useT();
  const rows: [string, string, number][] = [["meta", "Advertising", 34.92], ["instagram", "Social Media", 35.6], ["ga", "Analytics", 36.24], ["mailchimp", "Communication", 36.9], ["shopify", "Commerce", 37.42]];
  /* hand position follows the current row's Connect button */
  let idx = rows.findIndex(([, , ti]) => t < ti + 0.35); if (idx < 0) idx = rows.length - 1;
  const ti = rows[idx][2];
  const prevY = idx === 0 ? 900 : 300 + (idx - 1) * 118;
  const y = lerp(prevY, 300 + idx * 118, prog(t, ti - 0.45, 0.35, Easing.inOut(Easing.cubic)));
  const press = Math.max(0, 1 - Math.abs(t - ti) / 0.1);
  const handIn = prog(t, 34.2, 0.5) * (1 - prog(t, 38.0, 0.4));
  const lock = pop(t, 38.06, 0.5);
  return (
    <Sc a={33.0} b={39.7}>
      <Step n="01" label="Connect" t0={33.0} />
      <div style={{ ...ab, left: 470, top: 230, width: 980 }}>
        <Glass style={{ padding: "26px 34px" }}>
          {rows.map(([k, cat, t0], i) => {
            const on = t > t0 + 0.05, sync = t > t0 + 0.05 && t < t0 + 0.6;
            const p = prog(t, 33.3 + i * 0.1, 0.4);
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 0", borderTop: i ? `1px solid ${C.line}` : undefined, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                <PIcon k={k} size={70} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.fg }}>{pName(k)}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 22, color: C.muted }}>{cat}</div>
                </div>
                <div style={{ padding: "12px 24px", borderRadius: 12, fontFamily: F.sans, fontWeight: 600, fontSize: 24, minWidth: 170, textAlign: "center",
                  background: !on ? C.primary : sync ? "rgba(245,158,11,.18)" : "rgba(16,185,129,.18)", color: !on ? "#fff" : sync ? C.amber : C.green }}>
                  {!on ? "Connect" : sync ? "Syncing…" : "✓ Connected"}
                </div>
              </div>
            );
          })}
        </Glass>
      </div>
      <div style={{ ...ab, left: 1290, top: y - 10, transform: `rotate(-22deg) translateY(${(1 - handIn) * 500}px)`, transformOrigin: "30% 0%" }}><Hand width={230} press={press} /></div>
      <div style={{ ...ab, left: 120, top: 520, transform: `scale(${lock})`, opacity: lock, display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderRadius: 16, background: "rgba(16,185,129,.16)",
        border: "1px solid rgba(16,185,129,.5)", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.green }}><Lock size={28} />Secure connections</div>
    </Sc>
  );
};

/* 7. Understand: dashboard → health zoom → cheat sheet */
const Understand: React.FC = () => {
  const t = useT();
  const zoom = prog(t, 42.6, 1.0, Easing.inOut(Easing.cubic));
  const hv = Math.round(94 * prog(t, 43.0, 1.8, Easing.out(Easing.cubic)));
  const rise = prog(t, 40.6, 0.9);
  return (
    <>
      <Sc a={39.6} b={45.8}>
        <Step n="02" label="Understand" t0={39.7} />
        <AbsoluteFill style={{ ...cc, perspective: 1800, paddingTop: 110 }}>
          <div style={{ transform: `translateY(${(1 - rise) * 400}px) rotateX(${lerp(24, 4, rise)}deg) scale(${lerp(0.88, 0.94, zoom)})`, opacity: rise * (1 - 0.65 * zoom), filter: zoom > 0.01 ? `blur(${zoom * 6}px)` : undefined, transformOrigin: "50% 50%" }}>
            <Dashboard t0={41.0} />
          </div>
        </AbsoluteFill>
        {/* big score overlay synced to voice */}
        <div style={{ ...ab, left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", opacity: prog(t, 42.9, 0.4), transform: `scale(${1.25 * pop(t, 42.9, 0.6)})` }}>
          <Glass style={{ padding: 34, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <Ring v={hv} size={220} stroke={20} />
              <div style={{ ...ab, inset: 0, display: "grid", placeItems: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 78, color: C.fg }}>{hv}</div>
            </div>
            <div>
              <Cap size={20}>Marketing Health Score</Cap>
              <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.green, marginTop: 10, opacity: prog(t, 44.6, 0.3) }}>Excellent</div>
              <div style={{ fontFamily: F.sans, fontSize: 24, color: C.muted, marginTop: 6, opacity: prog(t, 44.8, 0.3) }}>+4 this month</div>
            </div>
          </Glass>
        </div>
      </Sc>
      <Sc a={45.7} b={51.3}>
        <CheatScene />
      </Sc>
    </>
  );
};
const CheatScene: React.FC = () => {
  const t = useT();
  const tiles: [string, string, string][] = [["Followers", "48,204", "+3.2%"], ["Reach", "182,940", "+11.4%"], ["CTR", "3.42%", "+0.4pp"], ["Leads", "1,204", "+14.2%"]];
  const tap = 47.52;
  const press = Math.max(0, 1 - Math.abs(t - tap) / 0.12);
  const open = pop(t, 48.4, 0.6);
  const cp = prog(t, 46.3, 1.0, Easing.inOut(Easing.cubic));
  return (
    <>
      <div style={{ ...ab, left: 120, top: 150, display: "flex", gap: 24 }}>
        {tiles.map(([m, v, d], i) => {
          const hi = m === "CTR"; const p = pop(t, 45.8 + i * 0.08, 0.45);
          return (
            <div key={m} style={{ transform: `scale(${p * (hi ? 1 - press * 0.05 : 1)})`, opacity: Math.min(1, p * 1.5) }}>
              <Glass r={20} style={{ width: 380, padding: 30, boxSizing: "border-box", border: hi && t > tap ? `2px solid ${C.primarySoft}` : undefined }}>
                <Cap size={20}>{m}</Cap>
                <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 60, color: C.fg, marginTop: 10 }}>{v}</div>
                <div style={{ fontFamily: F.sans, fontSize: 26, color: C.green, marginTop: 4 }}>{d}</div>
              </Glass>
            </div>
          );
        })}
      </div>
      <Cursor x={lerp(1500, 120 + 2 * 404 + 230, cp)} y={lerp(900, 300, cp)} press={press} size={64} />
      <div style={{ ...ab, left: 520, top: 470, width: 980, opacity: open, transform: `translateY(${(1 - open) * 50}px) scale(${0.9 + 0.1 * open})` }}>
        <div style={{ background: "#fff", borderRadius: 26, padding: 44, boxShadow: "0 40px 100px rgba(0,0,0,.5)", fontFamily: F.sans, color: "#12142E" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", color: C.primary, fontWeight: 600, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase" }}><BookOpen size={26} />Marketing Cheat Sheet</div>
          <div style={{ fontSize: 50, fontWeight: 700, marginTop: 14, letterSpacing: "-0.02em" }}>Click-Through Rate (CTR)</div>
          <div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 12, color: "#3A3D5C" }}>The percentage of people who clicked after seeing your content or advertisement.</div>
        </div>
      </div>
      <div style={{ ...ab, left: 60, top: 560, transform: `translateY(${(1 - prog(t, 46.0, 0.6)) * 400}px)` }}><LiveMaya mood={t > 48.6 ? "happy" : "focused"} width={420} look={0.6} /></div>
    </>
  );
};

/* 8. Act: Lead Audit → fix → leads come in */
const Act: React.FC = () => {
  const t = useT();
  const tap = 57.55;
  const fixed = t > tap + 0.1;
  const press = Math.max(0, 1 - Math.abs(t - tap) / 0.12);
  const warn = pop(t, 53.6, 0.5);
  const handY = lerp(1100, 600, prog(t, 56.8, 0.6, Easing.out(Easing.cubic))) + prog(t, 58.2, 0.5) * 600;
  const rows: [string, string][] = [["Website forms", "Healthy"], ["Meta Pixel", "Connected"], ["Google Ads tracking", "Connected"]];
  const leads = [59.1, 59.45, 59.8, 60.1];
  return (
    <Sc a={51.3} b={61.0}>
      <Step n="03" label="Act" t0={51.4} />
      <div style={{ ...ab, left: 120, top: 220, width: 1000 }}>
        <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}><ShieldCheck size={32} color={C.primarySoft} /><Cap size={24}>Lead Audit</Cap></div>
            <div style={{ fontSize: 24, color: C.muted }}>142 leads tracked</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20, fontSize: 44, fontWeight: 600 }}>
            <span style={{ width: 18, height: 18, borderRadius: 9, background: fixed ? C.green : t > 53.6 ? C.amber : C.green }} />
            {fixed ? "Healthy" : t > 53.6 ? "1 action recommended" : "Scanning…"}
          </div>
          {rows.map(([k, s], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", borderTop: `1px solid ${C.line}`, fontSize: 30, opacity: prog(t, 52.0 + i * 0.2, 0.4) }}>
              <span>{k}</span><span style={{ color: C.green, display: "flex", gap: 10, alignItems: "center" }}><Check size={28} strokeWidth={3} />{s}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 24px", margin: "8px -24px 0", borderRadius: 18, fontSize: 30, opacity: warn,
            transform: `scale(${0.9 + 0.1 * warn})`, background: fixed ? "rgba(16,185,129,.14)" : "rgba(245,158,11,.14)", border: `1px solid ${fixed ? "rgba(16,185,129,.5)" : "rgba(245,158,11,.5)"}` }}>
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", fontWeight: 600 }}>{fixed ? <Check size={30} color={C.green} strokeWidth={3} /> : <AlertTriangle size={30} color={C.amber} />}Contact form</div>
              <div style={{ color: C.muted, fontSize: 24, marginTop: 6 }}>{fixed ? "Sending leads again" : "No new leads in 48 hours"}</div>
            </div>
            <div style={{ padding: "14px 28px", borderRadius: 14, fontWeight: 600, background: fixed ? C.green : C.primary, transform: `scale(${1 - press * 0.08})` }}>{fixed ? "Fixed" : "Review"}</div>
          </div>
        </Glass>
      </div>
      <div style={{ ...ab, left: 860, top: handY, transform: "rotate(-18deg)" }}><Hand width={220} press={press} /></div>
      {/* leads coming in */}
      {leads.map((ti, i) => {
        const p = pop(t, ti, 0.45);
        return <div key={i} style={{ ...ab, right: 120, top: 250 + i * 100, opacity: p, transform: `translateX(${(1 - p) * 200}px)`, display: "flex", gap: 14, alignItems: "center", padding: "16px 24px", borderRadius: 16,
          background: "#fff", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: "#12142E", boxShadow: "0 16px 40px rgba(0,0,0,.35)" }}>
          <Users size={26} color={C.green} />{i < 3 ? "New lead from contact form" : "+12 new leads this week"}</div>;
      })}
      <div style={{ ...ab, left: 1260, top: 650, transform: `translateY(${(1 - prog(t, 51.6, 0.6)) * 500}px)` }}><LiveMaya mood={t > 58 ? "happy" : t > 53.6 ? "worried" : "focused"} width={460} look={-0.6} /></div>
    </Sc>
  );
};

/* 9. But there's more */
const More: React.FC = () => {
  const t = useT();
  const rep = pop(t, 62.3, 0.6);
  const sw = prog(t, 64.35, 0.3);
  return (
    <Sc a={60.9} b={67.3}>
      <div style={{ ...ab, left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F.sans, fontWeight: 500, fontSize: 88, color: C.fg, letterSpacing: "-0.03em",
        opacity: prog(t, 60.95, 0.4), transform: `translateY(${(1 - prog(t, 60.95, 0.5)) * 40}px)` }}>But there's <span style={{ fontStyle: "italic", color: C.primarySoft }}>more…</span></div>
      <div style={{ ...ab, left: 280, top: 360, width: 760, opacity: Math.min(1, rep * 1.5), transform: `rotate(${-3 * rep}deg) scale(${0.85 + 0.15 * rep})` }}>
        <Glass style={{ padding: 40, fontFamily: F.sans, color: C.fg }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}><FileText size={34} color={C.primarySoft} /><span style={{ fontSize: 36, fontWeight: 600 }}>Weekly Marketing Report</span></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160, marginTop: 30 }}>
            {[40, 62, 50, 78, 70, 96, 88].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * prog(t, 62.6 + i * 0.06, 0.5)}%`, borderRadius: 8, background: `linear-gradient(180deg, ${C.primarySoft}, ${C.primary})` }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontSize: 28 }}>
            <span style={{ color: C.muted }}>Every Monday</span>
            <span style={{ color: C.green, fontWeight: 600, opacity: prog(t, 63.3, 0.3), transform: `scale(${pop(t, 63.3, 0.4)})` }}>✓ Ready</span>
          </div>
        </Glass>
      </div>
      <div style={{ ...ab, left: 1140, top: 470, opacity: prog(t, 64.0, 0.4) }}>
        <Glass style={{ padding: "34px 40px", display: "flex", alignItems: "center", gap: 28 }}>
          <Sparkles size={44} color={C.primarySoft} />
          <div style={{ fontFamily: F.sans, color: C.fg }}><div style={{ fontSize: 36, fontWeight: 600 }}>AI help</div><div style={{ fontSize: 26, color: C.muted }}>Optional, your choice</div></div>
          <div style={{ width: 110, height: 60, borderRadius: 99, background: sw > 0.5 ? C.primary : "rgba(255,255,255,.15)", position: "relative", boxShadow: sw > 0.5 ? "0 0 30px rgba(99,102,241,.7)" : undefined }}>
            <div style={{ ...ab, top: 6, left: 6 + sw * 50, width: 48, height: 48, borderRadius: 99, background: "#fff" }} />
          </div>
        </Glass>
      </div>
    </Sc>
  );
};

/* 10. Benefits trio */
const Benefits: React.FC = () => {
  const t = useT();
  const items: [any, string, number][] = [[Target, "Less guessing", 67.4], [Users, "Fewer lost leads", 68.36], [Lightbulb, "Smarter decisions", 69.58]];
  return (
    <Sc a={67.2} b={71.2}>
      <svg width={1920} height={1080} style={ab}>
        <path d="M480 520 Q720 380 960 520 T1440 520" stroke="rgba(201,204,255,.4)" strokeWidth="4" strokeDasharray="10 14" fill="none" pathLength={1}
          style={{ strokeDashoffset: 0 }} opacity={prog(t, 67.4, 2.4)} />
      </svg>
      {items.map(([I, s, t0], i) => {
        const p = pop(t, t0, 0.55);
        return (
          <div key={s} style={{ ...ab, left: 480 + i * 480 - 150, top: 520 - 150 + (i === 1 ? -60 : 0), width: 300, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>
            <div style={{ width: 220, height: 220, borderRadius: 999, display: "grid", placeItems: "center", background: "radial-gradient(circle at 35% 30%, #A9ABFF, #6366F1 60%, #3B3F99)",
              boxShadow: "0 0 80px rgba(139,140,248,.55)" }}><I size={96} color="#fff" strokeWidth={1.8} /></div>
            <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.fg, marginTop: 26, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        );
      })}
    </Sc>
  );
};

/* 11. Proof counters */
const Proof: React.FC = () => {
  const t = useT();
  const items: [number, string, number][] = [[14, "Connected platforms", 71.2], [150, "Marketing metrics", 73.18], [100, "Health checks", 75.32]];
  return (
    <Sc a={71.0} b={77.4}>
      <AbsoluteFill style={{ ...cc, flexDirection: "row", gap: 120, paddingBottom: 60 }}>
        {items.map(([n, s, t0]) => {
          const p = prog(t, t0, 0.8, Easing.out(Easing.cubic));
          return (
            <div key={s} style={{ textAlign: "center", opacity: prog(t, t0 - 0.1, 0.3), transform: `translateY(${(1 - prog(t, t0 - 0.1, 0.5)) * 40}px)` }}>
              <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 170, color: C.fg, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{Math.round(n * p)}<span style={{ color: C.primarySoft }}>+</span></div>
              <Cap size={28} style={{ color: C.fg, opacity: 0.8 }}>{s}</Cap>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ ...ab, left: 0, right: 0, top: 760, textAlign: "center", fontFamily: F.sans, fontSize: 30, color: C.muted, opacity: prog(t, 76.0, 0.4) }}>+ 500 educational topics</div>
    </Sc>
  );
};

/* 12. CTA */
const CTA: React.FC = () => {
  const t = useT();
  const tap = 81.6;
  const press = Math.max(0, 1 - Math.abs(t - tap) / 0.12);
  const btn = pop(t, 80.9, 0.5);
  const cp = prog(t, 80.6, 0.9, Easing.inOut(Easing.cubic));
  return (
    <Sc a={77.3} b={84.0} zoomOut>
      <div style={{ ...ab, left: 120, top: 300, transform: `translateX(${(1 - prog(t, 77.4, 0.7)) * -400}px)` }}><LiveMaya mood="happy" width={640} look={0.7} tilt={-3} /></div>
      <div style={{ ...ab, left: 860, top: 200, width: 960, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: prog(t, 77.4, 0.5) }}>
          <RothmeMark size={130} /><Wordmark size={96} />
        </div>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 72, color: C.fg, letterSpacing: "-0.03em", lineHeight: 1.12, marginTop: 40 }}>
          <div style={{ opacity: prog(t, 78.26, 0.4) }}>Stop guessing.</div>
          <div style={{ opacity: prog(t, 79.38, 0.4), fontStyle: "italic", color: C.primarySoft }}>Start understanding your marketing.</div>
        </div>
        <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 24, transform: `scale(${btn * (1 - press * 0.06)})`, opacity: Math.min(1, btn * 2), transformOrigin: "0 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 44px", borderRadius: 18, background: C.primary, fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: "#fff",
            boxShadow: `0 0 ${40 + 60 * press}px rgba(99,102,241,.7)` }}>Get a demo<ArrowRight size={36} /></div>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 44, color: C.fg, opacity: prog(t, 82.2, 0.4) }}>rothme.app</div>
        </div>
      </div>
      <Cursor x={lerp(1800, 1180, cp)} y={lerp(1000, 760, cp)} press={press} size={64} opacity={prog(t, 80.6, 0.2) * (1 - prog(t, 83.0, 0.3))} />
    </Sc>
  );
};

/* 13. samteck */
const Samteck: React.FC = () => {
  const t = useT(); const a = 84.0; if (t < a) return null;
  const p = prog(t, a + 0.1, 0.7);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1b1f3a 0%, #070818 70%)", ...cc, flexDirection: "column", opacity: prog(t, a, 0.25) }}>
      <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,.55)", letterSpacing: "0.5em", opacity: p }}>MADE BY</div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 92, color: "#fff", letterSpacing: `${-0.03 + (1 - p) * 0.2}em`, opacity: p, marginTop: 10 }}>samteck</div>
      <div style={{ width: 220 * p, height: 3, background: C.primarySoft, marginTop: 18, borderRadius: 3 }} />
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<{ audio: boolean }> = ({ audio }) => {
  const has = audio && getStaticFiles().some((f) => f.name === "ex_mix.wav");
  return (
    <AbsoluteFill style={{ background: "#090B20", overflow: "hidden" }}>
      <Bg />
      <Hook /><Desk /><Turn /><Meet /><Connect /><Understand /><Act /><More /><Benefits /><Proof /><CTA />
      <Captions />
      <Samteck />
      {has && <Audio src={staticFile("ex_mix.wav")} />}
    </AbsoluteFill>
  );
};
