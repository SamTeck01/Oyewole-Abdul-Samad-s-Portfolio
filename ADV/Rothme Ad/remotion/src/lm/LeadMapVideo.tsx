import React from "react";
import { AbsoluteFill, Audio, Easing, staticFile, getStaticFiles } from "remotion";
import { Globe, Star, Swords, Lightbulb, Search, ChevronDown, MapPin, CalendarCheck, Clock, Phone, HelpCircle, Check, ArrowRight, DollarSign, Bell, Layout, Home, Trophy } from "lucide-react";
import { C, F, useT, prog, pop, lerp, rnd, RothmeMark, Wordmark, Cursor, Kinetic } from "../brand";
import { Maya, Mood } from "../ex/Maya";
import { AppFrame, Header, Kpis, MapPanel, HeatChips, LeadCard, CityMap, Pin, LEADS, HERO, LM, heat, STAGES, STAGE_COL, Btn } from "./ui";
import VO from "./vo.json";
import { mkW, chunks, CaptionBar, Word } from "./vo";

const words = VO.words as Word[];
const W = mkW(words);
const L = (id: string) => VO.lines.find((l) => l.id === id)!;
const TEXTS = Object.fromEntries(VO.lines.map((l) => [l.id, l.text]));
const CAPS = chunks(words, TEXTS);
export const LM_END = L("cta").end + 0.9;      // samteck card starts
export const LM_TOTAL = LM_END + 2.2;

const ab: React.CSSProperties = { position: "absolute" };
const cc: React.CSSProperties = { justifyContent: "center", alignItems: "center" };
const io = Easing.inOut(Easing.cubic);

const Sc: React.FC<{ a: number; b: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a, b, children, style }) => {
  const t = useT();
  if (t < a - 0.01 || t > b + 0.01) return null;
  const i = prog(t, a, 0.5), o = prog(t, b - 0.45, 0.45, Easing.in(Easing.cubic));
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${(0.97 + 0.03 * i) * (1 + 0.06 * o)})`, filter: o > 0.01 ? `blur(${o * 12}px)` : undefined, ...style }}>{children}</AbsoluteFill>;
};
const LiveMaya: React.FC<{ mood: Mood; width: number; look?: number; typing?: boolean; wave?: number }> = ({ mood, width, look = 0, typing, wave = 0 }) => {
  const t = useT();
  const bt = (t * 1000) % 3700; const blink = bt < 120 ? Math.sin((bt / 120) * Math.PI) : 0;
  return <Maya mood={mood} width={width} blink={blink} look={look} breathe={Math.sin(t * 2.2)} headTilt={Math.sin(t * 1.3) * 1.2 + wave * 3}
    nod={typing ? Math.abs(Math.sin(t * 6)) * 0.3 : 0} typing={typing ? Math.sin(t * 22) : 0} wave={wave} waveAng={Math.sin(t * 9) * 16} />;
};

/* keyframed camera: [t, x, y, scale] (x,y = point of the 1920×1080 stage that is centred) */
type K = [number, number, number, number];
const camAt = (t: number, ks: K[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const [ta, xa, ya, sa] = ks[i], [tb, xb, yb, sb] = ks[i + 1];
    if (t <= tb) { const p = io((t - ta) / (tb - ta)); return [t, lerp(xa, xb, p), lerp(ya, yb, p), sa * Math.pow(sb / sa, p)] as K; }
  }
  return ks[ks.length - 1];
};
const Camera: React.FC<{ ks: K[]; children: React.ReactNode }> = ({ ks, children }) => {
  const t = useT(); const [, x, y, s] = camAt(t, ks);
  return <AbsoluteFill style={{ transform: `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})`, transformOrigin: "0 0" }}>{children}</AbsoluteFill>;
};

/* ---------------- background ---------------- */
const Bg: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${140 + Math.sin(t * 0.15) * 10}deg, #05061A 0%, #12144A 45%, #3A3EB8 80%, #8E90F5 120%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(45% 45% at ${55 + 15 * Math.sin(t * 0.2)}% ${45 + 10 * Math.cos(t * 0.17)}%, rgba(139,140,248,.28), transparent 70%)` }} />
    </AbsoluteFill>
  );
};

/* ============ 1. HOOK: the city lights up with leads ============ */
const Hook: React.FC = () => {
  const t = useT();
  const z = 1.25 - 0.15 * prog(t, 0, 4, Easing.inOut(Easing.quad));
  const t2 = W("hook", "they're");
  return (
    <Sc a={0} b={4.05}>
      <AbsoluteFill style={{ transform: `scale(${z}) rotate(${-2 + t * 0.5}deg)`, opacity: 0.9 }}>
        <CityMap w={1920} h={1080} labels={false} />
        {LEADS.map((l, i) => {
          const d = prog(t, 0.05 + i * 0.05, 0.4, Easing.out(Easing.back(1.6)));
          return <div key={i} style={{ ...ab, left: (l.x / 1600) * 1920, top: (l.y / 1000) * 1080 }}><Pin color={heat(l.h)} size={30} drop={d} pulse={(t * 0.8 + i * 0.17) % 1} /></div>;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(55% 50% at 50% 50%, rgba(5,6,26,.82), rgba(5,6,26,.2) 85%)" }} />
      <AbsoluteFill style={{ ...cc, flexDirection: "column" }}>
        <Kinetic t0={0.1} t1={t2 - 0.05} size={118} stagger={0.13} words={[{ w: "Need" }, { w: "more" }, { w: "local", a: true }, { w: "clients?" }]} />
        <div style={{ position: "absolute" }}>
          <Kinetic t0={t2 - 0.1} size={96} stagger={0.1} words={[{ w: "They're" }, { w: "closer" }, { w: "than" }, { w: "you", br: true }, { w: "think.", a: true }]} />
        </div>
      </AbsoluteFill>
    </Sc>
  );
};

/* ============ 2. MAYA: a small web design studio, hours of searching ============ */
const Studio: React.FC = () => {
  const t = useT();
  const a = 3.9, b = 12.3;
  const tWeb = W("maya", "web"), tFind = W("maya", "finding"), tHours = W("maya", "hours"), tGuess = W("maya", "guessing"), tCall = W("maya", "call");
  const mood: Mood = t < tFind ? "happy" : t < tGuess ? "focused" : "worried";
  /* camera: drift right, push in on the mess, then pull to her worried face */
  const ks: K[] = [[a, 900, 560, 1.0], [tWeb, 1000, 540, 1.06], [tFind, 860, 520, 1.12], [tGuess, 1040, 500, 1.18], [b, 960, 470, 1.5]];
  const wave = prog(t, W("maya", "meet") - 0.2, 0.3) * (1 - prog(t, W("maya", "runs") + 0.2, 0.4));
  const mocks = [0, 1, 2];
  const query = "web design clients near me";
  const typed = query.slice(0, Math.floor(query.length * prog(t, tFind + 0.1, 1.2, Easing.linear)));
  const tabs = ["plumbers austin", "yelp – cafes", "maps – salons", "who has no website?", "dentists near me", "spreadsheet.xlsx"];
  const notes: [string, number, number, number][] = [["Call Joe's Diner?", 380, 250, -6], ["Maybe the bakery?", 1500, 230, 5], ["Who's hiring a designer??", 300, 560, 4], ["Already have a site?", 1560, 560, -4]];
  return (
    <Sc a={a} b={b}>
      <Camera ks={ks}>
        {/* website mockups she designs */}
        {mocks.map((i) => {
          const p = pop(t, tWeb + i * 0.12, 0.55) * (1 - prog(t, tFind - 0.2, 0.4));
          return (
            <div key={i} style={{ ...ab, left: [300, 1440, 1460][i], top: [200, 180, 520][i], width: 300, height: 200, borderRadius: 16, background: "#fff", padding: 14, boxSizing: "border-box",
              transform: `scale(${p}) rotate(${[-6, 5, -3][i]}deg) translateY(${Math.sin(t * 1.4 + i) * 8}px)`, opacity: Math.min(1, p * 2), boxShadow: "0 20px 50px rgba(0,0,0,.4)" }}>
              <div style={{ height: 14, width: "40%", borderRadius: 7, background: ["#6366F1", "#10B981", "#F59E0B"][i] }} />
              <div style={{ height: 70, marginTop: 12, borderRadius: 10, background: "linear-gradient(135deg,#E0E2FF,#C7CAFF)" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>{[0, 1, 2].map((j) => <div key={j} style={{ flex: 1, height: 50, borderRadius: 8, background: "#EEF0FA" }} />)}</div>
            </div>
          );
        })}
        {/* search bar + tabs (hours of searching) */}
        {t > tFind - 0.2 && <>
          <div style={{ ...ab, left: 560, top: 120, width: 800, opacity: prog(t, tFind - 0.2, 0.4), transform: `translateY(${(1 - prog(t, tFind - 0.2, 0.5)) * -40}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 28px", borderRadius: 99, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,.45)", fontFamily: F.sans, fontSize: 34, color: "#12142E" }}>
              <Search size={32} color="#6366F1" />{typed}<span style={{ width: 3, height: 36, background: "#6366F1", opacity: Math.floor(t * 3) % 2 }} />
            </div>
          </div>
          {tabs.map((s, i) => {
            const p = pop(t, tHours + 0.1 + i * 0.12, 0.45) * (1 - prog(t, tGuess - 0.1, 0.4));
            const ang = (-60 + i * 24) * Math.PI / 180;
            return <div key={s} style={{ ...ab, left: 960 + Math.sin(ang) * 640 - 140, top: 560 - Math.cos(ang) * 330, width: 280, padding: "14px 18px", borderRadius: 12, background: "#1B1E52", border: "1px solid rgba(255,255,255,.14)",
              fontFamily: F.sans, fontSize: 22, color: "#DADCFA", transform: `scale(${p}) rotate(${(i - 2.5) * 3}deg)`, opacity: Math.min(1, p * 2), whiteSpace: "nowrap", overflow: "hidden" }}>{s}</div>;
          })}
          {/* clock: hours fly by */}
          <div style={{ ...ab, left: 1520, top: 760, transform: `scale(${pop(t, tHours, 0.5) * (1 - prog(t, tGuess - 0.1, 0.4))})`, display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderRadius: 16, background: "#fff", fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: "#12142E" }}>
            <Clock size={32} color={C.amber} style={{ transform: `rotate(${t * 720}deg)` }} />{Math.floor(1 + prog(t, tHours, 2.2, Easing.linear) * 3)}h {String(Math.floor((t * 97) % 60)).padStart(2, "0")}m
          </div>
        </>}
        {/* guessing who to call: sticky notes with question marks */}
        {notes.map(([s, x, y, r], i) => {
          const p = pop(t, tGuess + i * 0.18, 0.5);
          return <div key={s} style={{ ...ab, left: x - 150, top: y - 60, width: 300, padding: "20px 22px", background: "#FDE68A", borderRadius: 6, transform: `scale(${p}) rotate(${r}deg)`, opacity: Math.min(1, p * 2),
            fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: "#3B2F0A", boxShadow: "0 16px 30px rgba(0,0,0,.35)", display: "flex", gap: 10, alignItems: "center" }}><HelpCircle size={26} />{s}</div>;
        })}
        {t > tCall - 0.1 && <div style={{ ...ab, left: 1240, top: 690, transform: `scale(${pop(t, tCall - 0.1, 0.5)}) rotate(${Math.sin(t * 40) * 8}deg)`, width: 90, height: 90, borderRadius: 99, background: C.primary, display: "grid", placeItems: "center", boxShadow: "0 0 40px rgba(99,102,241,.7)" }}><Phone size={44} color="#fff" /></div>}
        {/* Maya behind her monitor */}
        <div style={{ ...ab, left: 960 - 290, top: 300 }}><LiveMaya mood={mood} width={580} look={t < tFind ? Math.sin(t) * 0.5 : 0} typing={t > tFind && t < tHours + 1.5} wave={wave} /></div>
        <div style={{ ...ab, left: -200, right: -200, top: 860, height: 400, background: "linear-gradient(180deg,#2A2D73,#1D1F55)", borderTop: "8px solid #3B3F99" }} />
        {/* monitor (back) */}
        <div style={{ ...ab, left: 960 - 270, top: 600, width: 540, height: 330, borderRadius: 18, background: "linear-gradient(160deg,#D8DAF7,#B9BCEB)" }}>
          <div style={{ ...ab, left: "50%", top: "50%", width: 44, height: 44, marginLeft: -22, marginTop: -22, borderRadius: 99, background: "rgba(255,255,255,.6)" }} />
        </div>
        <div style={{ ...ab, left: 960 - 30, top: 930, width: 60, height: 40, background: "#B9BCEB" }} />
        {/* desk props: pen cup + sketchbook + plant */}
        <div style={{ ...ab, left: 1330, top: 790, width: 80, height: 90, borderRadius: "10px 10px 16px 16px", background: "#F3F4FA" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ ...ab, left: 1345 + i * 18, top: 740 - i * 10, width: 8, height: 70, borderRadius: 4, background: ["#F43F5E", "#6366F1", "#F59E0B"][i], transform: `rotate(${(i - 1) * 10}deg)` }} />)}
        <div style={{ ...ab, left: 420, top: 830, width: 220, height: 40, borderRadius: 8, background: "#F3F4FA", transform: "rotate(-4deg)" }} />
        <div style={{ ...ab, left: 330, top: 760, width: 90, height: 100, borderRadius: "8px 8px 20px 20px", background: "#8B8CF8" }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ ...ab, left: 360 + (i - 2) * 22, top: 640 + Math.abs(i - 2) * 26, width: 34, height: 130, borderRadius: "50% 50% 10px 10px",
          background: i % 2 ? "#10B981" : "#34D399", transform: `rotate(${(i - 2) * 16 + Math.sin(t * 1.5 + i) * 2}deg)`, transformOrigin: "50% 100%" }} />)}
      </Camera>
    </Sc>
  );
};

/* ============ 3–7. THE APP: search → pins → why → save → pipeline ============ */
const OFF = { x: 250, y: 62 };                 // content offset inside the app frame
const MAP = { x: OFF.x + 32, y: 400, w: 1090, h: 600 };
const RIGHT = { x: OFF.x + 1142, y: OFF.y + 400, w: 496 };

const Dialog: React.FC = () => {
  const t = useT();
  const tOpen = W("search", "now") + 0.9, tCity = W("search", "types"), tRad = W("search", "service"), tType = W("search", "picks"), tGo = W("search", "finds");
  const open = pop(t, tOpen, 0.5) * (1 - prog(t, tGo + 0.25, 0.3));
  if (open <= 0.001) return null;
  const city = "Austin, TX";
  const typed = city.slice(0, Math.floor(city.length * prog(t, tCity + 0.2, 0.9, Easing.linear)));
  const rad = t > tRad + 0.35 ? 1 : 0;
  const dd = prog(t, tType + 0.1, 0.25) * (1 - prog(t, tType + 1.05, 0.2));
  const picked = t > tType + 1.0;
  const goPress = Math.max(0, 1 - Math.abs(t - tGo) / 0.12);
  const types: [any, string, string][] = [[MapPin, "All local businesses", "Shops, offices, food, health, services"], [Home, "Home services", "Plumbers, electricians, HVAC, roofers"], [Layout, "Food & drink", "Cafes, restaurants, bakeries"], [Star, "Health & beauty", "Salons, spas, clinics"]];
  return (
    <>
      <div style={{ ...ab, inset: 0, background: `rgba(3,4,16,${0.6 * Math.min(1, open)})` }} />
      <div style={{ ...ab, left: 960 - 380, top: 210, width: 760, padding: 34, boxSizing: "border-box", borderRadius: 22, background: "#0B0D28", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 50px 120px rgba(0,0,0,.7)",
        fontFamily: F.sans, color: LM.text, opacity: Math.min(1, open * 1.5), transform: `scale(${0.9 + 0.1 * open}) translateY(${(1 - open) * 30}px)` }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>Find leads in this area</div>
        <div style={{ fontSize: 17, color: LM.sub, marginTop: 8, lineHeight: 1.45 }}>Search real businesses on OpenStreetMap — name, address, phone, and website come with them.</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 24 }}>Search by place</div>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <div style={{ flex: 1, padding: "15px 18px", borderRadius: 12, border: `1.5px solid ${t > tCity ? C.primarySoft : "rgba(255,255,255,.14)"}`, fontSize: 20, color: typed ? "#fff" : LM.sub, boxShadow: t > tCity ? "0 0 0 4px rgba(99,102,241,.2)" : undefined }}>
            {typed || "City, ZIP, or address — e.g. your business area"}{t > tCity && t < tGo && <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, background: "#fff", verticalAlign: "middle", opacity: Math.floor(t * 3) % 2 }} />}
          </div>
          <Btn icon={MapPin} label="Search there" primary press={goPress} style={{ fontSize: 18, padding: "15px 22px" }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 22 }}>Service radius</div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {["5 miles", "10 miles", "25 miles", "50 miles"].map((r, i) => {
            const on = (rad ? 1 : 0) === i;
            return <div key={r} style={{ padding: "11px 18px", borderRadius: 11, fontSize: 18, fontWeight: 600, border: `1.5px solid ${on ? C.primarySoft : "rgba(255,255,255,.12)"}`, background: on ? "rgba(99,102,241,.25)" : undefined, color: on ? "#fff" : LM.sub,
              transform: `scale(${on && rad ? 1 + 0.08 * (1 - prog(t, tRad + 0.35, 0.3)) : 1})` }}>{r}</div>;
          })}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 22 }}>Business type</div>
        <div style={{ position: "relative", marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderRadius: 12, border: `1.5px solid ${dd > 0 ? C.primarySoft : "rgba(255,255,255,.14)"}`, fontSize: 20 }}>
            <span><b style={{ fontWeight: 600 }}>{picked ? "Home services" : "All local businesses"}</b> <span style={{ color: LM.sub, fontSize: 16, marginLeft: 8 }}>{picked ? "Plumbers, electricians, HVAC, roofers" : "Shops, offices, food, health, services"}</span></span><ChevronDown size={20} />
          </div>
          {dd > 0 && <div style={{ ...ab, left: 0, right: 0, top: 62, zIndex: 5, borderRadius: 14, background: "#12153D", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: 6, opacity: dd, transform: `translateY(${(1 - dd) * -10}px)` }}>
            {types.map(([I, n, d], i) => {
              const hov = i === 1 && t > tType + 0.5;
              return <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: hov ? "rgba(99,102,241,.3)" : undefined }}>
                <I size={20} color={C.primarySoft} /><div><div style={{ fontSize: 18, fontWeight: 600 }}>{n}</div><div style={{ fontSize: 14, color: LM.sub }}>{d}</div></div></div>;
            })}
          </div>}
        </div>
        <div style={{ fontSize: 13, color: LM.sub, marginTop: 22 }}>Business data © OpenStreetMap contributors</div>
      </div>
    </>
  );
};

const Pipeline: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const t = useT();
  const n = prog(t, W("save", "saves") + 0.1, 0.3) > 0.5 ? 1 : 0;
  return (
    <div style={{ padding: 22 * s, borderRadius: 16 * s, background: LM.panel, border: `1px solid ${LM.line}` }}>
      <div style={{ fontSize: 12 * s, letterSpacing: "0.12em", color: LM.sub }}>YOUR PIPELINE</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${12 * s}px ${30 * s}px`, marginTop: 16 * s }}>
        {STAGES.map((st, i) => <div key={st} style={{ display: "flex", justifyContent: "space-between", fontSize: 17 * s }}><span style={{ color: LM.sub }}>{st}</span><span style={{ fontWeight: 600 }}>{i === 0 ? n : 0}</span></div>)}
      </div>
    </div>
  );
};

const AppScene: React.FC = () => {
  const t = useT();
  const a = L("search").start - 0.3, b = L("stages").start + 0.1;
  const tOpenBtn = W("search", "now") + 0.6;
  const tGo = W("search", "finds");
  const tPins = L("pins").start + 0.1;
  const tScore = W("pins", "opportunity");
  const tHot = W("pins", "hot"), tWarm = W("pins", "warm"), tCold = W("pins", "cold");
  const tWhy = L("why").start;
  const hl = t > tCold + 0.9 ? null : t > tCold ? "cold" : t > tWarm ? "warm" : t > tHot ? "hot" : null;
  const nTot = Math.round(LEADS.length * prog(t, tPins, 1.6, Easing.out(Easing.cubic)));
  const nHot = LEADS.filter((l) => l.h === "hot").length;
  const counts: [number, number, number] = [nHot, LEADS.filter((l) => l.h === "warm").length, LEADS.filter((l) => l.h === "cold").length];
  const rise = prog(t, a, 0.9);
  /* camera keyframes over the 1920×1080 app */
  const heroX = MAP.x + MAP.w / 2 + (HERO.x - 800) * (MAP.w / 1600) * 1.25 * 1.5, heroY = MAP.y + MAP.h / 2 + (HERO.y - 500) * (MAP.w / 1600) * 1.25 * 1.5;
  const ks: K[] = [
    [a, 960, 540, 0.82], [tOpenBtn - 0.5, 1500, 200, 1.5], [tOpenBtn + 0.5, 960, 520, 1.32],
    [tGo + 0.1, 960, 540, 1.36], [tPins + 0.2, MAP.x + MAP.w / 2, MAP.y + MAP.h / 2 - 40, 1.45],
    [tScore - 0.2, MAP.x + MAP.w / 2 + 40, MAP.y + MAP.h / 2 - 60, 1.5], [tHot - 0.3, 700, 420, 1.12], [tCold + 0.8, 760, 520, 1.12],
    [tWhy + 0.6, heroX - 260, heroY, 2.0], [L("save").end, heroX - 300, heroY, 2.1],
  ];
  const zoom = lerp(1, 1.5, prog(t, tGo + 0.2, 1.2, io));
  const press = Math.max(0, 1 - Math.abs(t - tOpenBtn) / 0.12);
  /* cursor path */
  const cp = prog(t, a + 0.6, tOpenBtn - a - 0.6, io);
  const cx = lerp(1300, OFF.x + 1130, cp), cy = lerp(800, OFF.y + 100, cp);
  return (
    <Sc a={a} b={b}>
      <Camera ks={ks}>
        <div style={{ ...ab, left: 0, top: 0, transform: `translateY(${(1 - rise) * 500}px) perspective(2400px) rotateX(${(1 - rise) * 18}deg)`, opacity: rise }}>
          <AppFrame w={1920} h={1080}>
            <div style={{ padding: "28px 32px" }}>
              <Header press={press} />
              <div style={{ marginTop: 24 }}>
                <Kpis vals={[["TOTAL OPPORTUNITIES", String(nTot)], ["SAVED OPPORTUNITIES", String(t > W("save", "saves") + 0.2 ? 1 : 0), `${nHot} high-opportunity`], ["ACTIVE BIDS & PIPELINE", "0", "0 bids submitted"],
                  ["EST. PIPELINE VALUE", t > W("save", "estimated") + 1 ? "$2,400" : "$0", "Your own estimates"], ["FOLLOW-UPS DUE", t > W("save", "followup") + 0.8 ? "1" : "0", "Nothing overdue"], ["WON", "0"]]} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 12, border: `1px solid ${LM.line}`, width: 520, fontSize: 16, color: t > tGo ? "#fff" : LM.sub }}>
                  <MapPin size={17} />{t > tGo ? "Austin, TX · Home services · 10 miles" : "Filter by location (city, ZIP, region)"}</div>
                <HeatChips active={hl as any} counts={t > tPins + 1 ? counts : undefined} />
              </div>
            </div>
            <div style={{ ...ab, left: 32, top: 400 - 62 }}>
              <MapPanel w={MAP.w} h={MAP.h} t0={tPins} radius={prog(t, tGo + 0.4, 0.9)} zoom={zoom} highlight={hl as any} scores={prog(t, tScore, 1.2)} heroSel={prog(t, tWhy + 0.2, 0.5)} />
            </div>
            <div style={{ ...ab, left: 1142, top: 400 - 62, width: RIGHT.w, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: 22, borderRadius: 16, background: LM.panel, border: `1px solid ${LM.line}`, height: 196, boxSizing: "border-box" }}>
                <div style={{ fontSize: 12, letterSpacing: "0.12em", color: LM.sub, display: "flex", gap: 8, alignItems: "center" }}><Lightbulb size={14} color={C.amber} />GOOD AREAS TO TARGET</div>
                {t < tPins + 1.2 ? <div style={{ fontSize: 16, color: LM.sub, marginTop: 14, lineHeight: 1.5 }}>Discover opportunities in an area and Rothme will summarize which neighborhoods look best here.</div> :
                  [["East Austin", "6 hot · few competitors"], ["South Congress", "4 hot · many without websites"], ["Hyde Park", "3 hot · light competition"]].map(([n, d], i) => (
                    <div key={n} style={{ display: "flex", justifyContent: "space-between", marginTop: 13, fontSize: 16, opacity: prog(t, tPins + 1.2 + i * 0.15, 0.4) }}><span style={{ fontWeight: 600 }}>{i + 1}. {n}</span><span style={{ color: LM.sub }}>{d}</span></div>
                  ))}
              </div>
              <Pipeline />
            </div>
          </AppFrame>
          <Dialog />
        </div>
      </Camera>
      {t < tOpenBtn + 0.6 && (() => { const [, kx, ky, ksc] = camAt(t, ks); return <Cursor x={960 + (cx - kx) * ksc} y={540 + (cy - ky) * ksc} press={press} size={56} opacity={prog(t, a + 0.4, 0.3) * (1 - prog(t, tOpenBtn + 0.3, 0.3))} />; })()}
      <Overlays />
    </Sc>
  );
};

/* lead card + details live in screen space (big, readable) */
const Overlays: React.FC = () => {
  const t = useT();
  const tWhy = L("why").start, tSave = W("save", "saves"), tEst = W("save", "estimated"), tFu = W("save", "followup"), tCal = W("save", "calendar");
  const cardIn = prog(t, tWhy + 0.5, 0.7, io);
  if (cardIn <= 0) return null;
  const slide = prog(t, tSave + 0.5, 0.8, io);
  const savePress = Math.max(0, 1 - Math.abs(t - tSave) / 0.12);
  const reasons = [
    { icon: Globe, title: "No website listed", sub: "A clear, specific service to offer", t: W("why", "no", 0) },
    { icon: Star, title: "No reviews yet", sub: "Room to help them build trust online", t: W("why", "no", 1) },
    { icon: Swords, title: "Light competition", sub: "Only 2 similar businesses within a mile", t: W("why", "light") },
    { icon: Lightbulb, title: "Suggested pitch", sub: "A new website with online booking", t: W("why", "clear") },
  ];
  const x = lerp(lerp(2000, 1010, cardIn), 70, slide);
  const det = prog(t, tSave + 0.8, 0.7, io);
  const val = "$2,400"; const vt = val.slice(0, Math.ceil(val.length * prog(t, tEst + 0.3, 0.7, Easing.linear)));
  const fu = pop(t, tFu + 0.1, 0.5), cal = pop(t, tCal, 0.55);
  const cp = prog(t, tSave - 0.9, 0.8, io);
  return (
    <>
      <div style={{ ...ab, inset: 0, background: `linear-gradient(90deg, rgba(5,6,26,${0.55 * slide}) 0%, rgba(5,6,26,${0.15 + 0.5 * slide}) 55%, rgba(5,6,26,${0.6 * cardIn}) 100%)` }} />
      <div style={{ ...ab, left: x, top: 110 }}>
        <LeadCard name="Lone Star Plumbing Co." kind="Plumber" dist="2.1 mi" score={92} t0={tWhy + 0.6} reasons={reasons} w={840} s={1.2} saveT={tSave + 0.08} savePress={savePress} />
      </div>
      {/* cursor clicks Save */}
      {t > tSave - 1.0 && t < tSave + 0.7 && <Cursor x={lerp(1700, x + 300, cp)} y={lerp(1050, 110 + 975, cp)} press={savePress} size={56} opacity={1 - prog(t, tSave + 0.35, 0.3)} />}
      {/* opportunity details: job value + follow-up */}
      {det > 0 && <div style={{ ...ab, left: 960, top: 190, width: 900, opacity: det, transform: `translateX(${(1 - det) * 200}px)`, fontFamily: F.sans, color: LM.text }}>
        <div style={{ borderRadius: 24, background: "linear-gradient(170deg,#151840,#0C0E2B)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 40px 100px rgba(0,0,0,.6)", padding: 34 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 15, letterSpacing: "0.12em", color: LM.sub }}>OPPORTUNITY · LONE STAR PLUMBING CO.</div>
            <div style={{ padding: "7px 14px", borderRadius: 99, background: "rgba(139,140,248,.2)", color: C.primarySoft, fontWeight: 700, fontSize: 16 }}>Stage: New</div>
          </div>
          <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, color: LM.sub }}>Est. job value</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "16px 18px", borderRadius: 14, border: `1.5px solid ${t > tEst ? C.primarySoft : "rgba(255,255,255,.14)"}`, fontSize: 40, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                <DollarSign size={30} color={LM.high} />{vt.replace("$", "") || <span style={{ color: LM.sub, fontWeight: 400, fontSize: 26 }}>0</span>}
              </div>
              <div style={{ fontSize: 14, color: LM.sub, marginTop: 8 }}>Your own estimate — not a promise</div>
            </div>
            <div style={{ flex: 1.2 }}>
              <div style={{ fontSize: 17, color: LM.sub }}>Follow-up reminder</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, padding: "16px 18px", borderRadius: 14, border: `1.5px solid ${fu > 0.5 ? C.primarySoft : "rgba(255,255,255,.14)"}`, fontSize: 28, fontWeight: 600 }}>
                <Bell size={28} color={C.amber} />{fu > 0.2 ? "Thu, Oct 15 · 10:00 AM" : <span style={{ color: LM.sub, fontWeight: 400 }}>Pick a date</span>}
              </div>
            </div>
          </div>
          {/* calendar */}
          <div style={{ display: "flex", gap: 24, marginTop: 26, alignItems: "center", opacity: Math.min(1, cal * 1.5), transform: `translateY(${(1 - cal) * 30}px)` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 46px)", gap: 6, padding: 16, borderRadius: 16, background: "#fff", color: "#12142E", fontSize: 16, fontWeight: 600, textAlign: "center" }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{ color: "#8A8DB0", fontSize: 13 }}>{d}</div>)}
              {Array.from({ length: 14 }).map((_, i) => { const d = i + 11; const on = d === 15;
                return <div key={i} style={{ height: 40, borderRadius: 10, display: "grid", placeItems: "center", background: on ? C.primary : undefined, color: on ? "#fff" : undefined, transform: on ? `scale(${1 + 0.15 * (1 - prog(t, tCal + 0.2, 0.4))})` : undefined }}>{d}</div>; })}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 700, color: LM.high }}><CalendarCheck size={32} />Added to calendar</div>
              <div style={{ fontSize: 20, color: LM.sub, marginTop: 8 }}>Follow up with Lone Star Plumbing Co.</div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

/* ============ 8. PIPELINE: new → contacted → bid submitted → won ============ */
const Board: React.FC = () => {
  const t = useT();
  const a = L("stages").start - 0.15, b = L("cta").start + 0.15;
  const hops: [number, number][] = [[0, a], [2, W("stages", "contacted")], [3, W("stages", "bid")], [5, W("stages", "won")]];
  const tWon = W("stages", "won");
  let col = 0, from = 0, tp = a;
  for (const [c, ti] of hops) if (t >= ti - 0.25) { from = col; col = c; tp = ti - 0.25; }
  const mv = prog(t, tp, 0.45, io);
  const cw = 238, gx = 72;
  const x = gx + lerp(from, col, mv) * (cw + 16), lift = Math.sin(mv * Math.PI) * 40;
  const won = t > tWon;
  return (
    <Sc a={a} b={b}>
      <div style={{ ...ab, left: 72, top: 70, fontFamily: F.sans, color: LM.text, opacity: prog(t, a, 0.4) }}>
        <div style={{ fontSize: 18, letterSpacing: "0.14em", color: C.primarySoft }}>LEAD MAP · PIPELINE</div>
        <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>From first pin to <span style={{ fontStyle: "italic", color: won ? LM.high : C.primarySoft }}>{won ? "won." : "won?"}</span></div>
      </div>
      {STAGES.map((st, i) => {
        const p = prog(t, a + i * 0.05, 0.4);
        const on = i === col;
        return (
          <div key={st} style={{ ...ab, left: gx + i * (cw + 16), top: 250, width: cw, height: 640, borderRadius: 20, background: on ? `${STAGE_COL[i]}1F` : "rgba(12,14,43,.85)", border: `1.5px solid ${on ? STAGE_COL[i] : "rgba(255,255,255,.08)"}`,
            opacity: p, transform: `translateY(${(1 - p) * 30}px)`, fontFamily: F.sans, color: LM.text, boxSizing: "border-box", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 600 }}><span style={{ width: 12, height: 12, borderRadius: 99, background: STAGE_COL[i] }} />{st}</div>
            {/* other example deals */}
            {[0, 1].slice(0, i === 0 ? 2 : i === 2 || i === 4 ? 1 : 0).map((k) => (
              <div key={k} style={{ marginTop: 14 + (k === 0 && i !== col ? 0 : 0), padding: 14, borderRadius: 14, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", position: "relative", top: 120 + k * 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{["Bright Smile Dental", "Eastside Coffee", "Kim's Hair Studio", "", "Sun City Roofing"][i + k] || "Hill Country HVAC"}</div>
                <div style={{ fontSize: 14, color: LM.sub, marginTop: 4 }}>{["$1,800", "$900", "$1,200", "", "$3,100"][i + k] || "$2,000"}</div>
              </div>
            ))}
          </div>
        );
      })}
      {/* the deal card */}
      <div style={{ ...ab, left: x + 10, top: 320 - lift, width: cw - 20, padding: 16, boxSizing: "border-box", borderRadius: 16, background: won ? "linear-gradient(160deg,#10B981,#059669)" : "linear-gradient(160deg,#1E2160,#151840)",
        border: `1.5px solid ${won ? "#6EE7B7" : C.primarySoft}`, boxShadow: `0 ${20 + lift}px 50px rgba(0,0,0,.5)${won ? ", 0 0 50px rgba(16,185,129,.6)" : ""}`, fontFamily: F.sans, color: "#fff", transform: `rotate(${Math.sin(mv * Math.PI) * -4}deg) scale(${won ? 1 + 0.1 * (1 - prog(t, tWon, 0.5)) : 1})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: won ? "#ECFDF5" : "#FDA4AF" }}>{won ? <><Trophy size={14} />WON</> : <>HOT · 92</>}</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>Lone Star Plumbing Co.</div>
        <div style={{ fontSize: 17, marginTop: 6, opacity: 0.85 }}>$2,400 · Website</div>
      </div>
      {/* confetti */}
      {won && Array.from({ length: 36 }).map((_, i) => {
        const p = prog(t, tWon, 1.4, Easing.out(Easing.cubic));
        const ang = rnd(i) * Math.PI * 2, r = 120 + rnd(i + 4) * 380;
        return <div key={i} style={{ ...ab, left: x + cw / 2 + Math.cos(ang) * r * p, top: 380 + Math.sin(ang) * r * p + p * p * 160, width: 12, height: 18, borderRadius: 3,
          background: ["#10B981", "#8B8CF8", "#F59E0B", "#F43F5E", "#38BDF8"][i % 5], opacity: 1 - prog(t, tWon + 0.9, 0.6), transform: `rotate(${p * 540 + i * 40}deg)` }} />;
      })}
    </Sc>
  );
};

/* ============ 9. CTA ============ */
const CTA: React.FC = () => {
  const t = useT();
  const a = L("cta").start - 0.1, b = LM_END;
  const tFree = W("cta", "free"), tFind = W("cta", "find"), tUrl = W("cta", "rothme", 1);
  const press = Math.max(0, 1 - Math.abs(t - (tUrl + 0.2)) / 0.12);
  const wave = prog(t, a + 0.3, 0.3) * (1 - prog(t, tFind, 0.4));
  return (
    <Sc a={a} b={b}>
      <AbsoluteFill style={{ opacity: 0.35, transform: `scale(${1.1 + 0.05 * prog(t, a, 6)})` }}>
        <CityMap w={1920} h={1080} labels={false} />
        {LEADS.map((l, i) => <div key={i} style={{ ...ab, left: (l.x / 1600) * 1920, top: (l.y / 1000) * 1080 }}><Pin color={heat(l.h)} size={24} drop={1} /></div>)}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 60% 50%, rgba(5,6,26,.9), rgba(5,6,26,.4))" }} />
      <div style={{ ...ab, left: 80, top: 330, transform: `translateX(${(1 - prog(t, a, 0.7)) * -400}px)` }}><LiveMaya mood="happy" width={620} look={0.7} wave={wave} /></div>
      <div style={{ ...ab, left: 820, top: 200, width: 1000, fontFamily: F.sans, color: LM.text }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: prog(t, a, 0.5), transform: `scale(${0.8 + 0.2 * pop(t, a, 0.6)})`, transformOrigin: "0 50%" }}><RothmeMark size={120} /><Wordmark size={88} /></div>
        <div style={{ fontSize: 110, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 26, opacity: prog(t, W("cta", "lead"), 0.4), transform: `translateY(${(1 - prog(t, W("cta", "lead"), 0.5)) * 30}px)` }}>
          Lead <span style={{ fontStyle: "italic", color: C.primarySoft }}>Map</span></div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 14, padding: "12px 22px", borderRadius: 99, border: "1.5px solid rgba(139,140,248,.5)", background: "rgba(99,102,241,.15)",
          fontSize: 26, letterSpacing: "0.12em", fontWeight: 600, color: C.primarySoft, transform: `scale(${pop(t, tFree, 0.5)})`, transformOrigin: "0 50%" }}><MapPin size={24} />FREE FOR EVERY ACCOUNT</div>
        <div style={{ fontSize: 58, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 36, opacity: prog(t, tFind, 0.4) }}>Find your next client.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34, transform: `scale(${pop(t, tUrl - 0.1, 0.5) * (1 - press * 0.06)})`, transformOrigin: "0 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 40px", borderRadius: 18, background: C.primary, fontSize: 40, fontWeight: 600, boxShadow: `0 0 ${40 + 60 * press}px rgba(99,102,241,.7)` }}>rothme.app<ArrowRight size={36} /></div>
        </div>
      </div>
    </Sc>
  );
};

const Samteck: React.FC = () => {
  const t = useT(); const a = LM_END; if (t < a) return null;
  const p = prog(t, a + 0.1, 0.7);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1b1f3a 0%, #070818 70%)", ...cc, flexDirection: "column", opacity: prog(t, a, 0.25) }}>
      <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,.55)", letterSpacing: "0.5em", opacity: p }}>MADE BY</div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 92, color: "#fff", letterSpacing: `${-0.03 + (1 - p) * 0.2}em`, opacity: p, marginTop: 10 }}>samteck</div>
      <div style={{ width: 220 * p, height: 3, background: C.primarySoft, marginTop: 18, borderRadius: 3 }} />
    </AbsoluteFill>
  );
};

export const LeadMapVideo: React.FC<{ audio: boolean }> = ({ audio }) => {
  const has = audio && getStaticFiles().some((f) => f.name === "lm_mix.wav");
  return (
    <AbsoluteFill style={{ background: "#05061A", overflow: "hidden" }}>
      <Bg />
      <Hook /><Studio /><AppScene /><Board /><CTA />
      <CaptionBar caps={CAPS} until={LM_END - 0.2} />
      <Samteck />
      {has && <Audio src={staticFile("lm_mix.wav")} />}
    </AbsoluteFill>
  );
};
