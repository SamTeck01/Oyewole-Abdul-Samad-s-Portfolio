import React from "react";
import { Easing } from "remotion";
import {
  LayoutDashboard, Store, Radar, MapPin, CalendarClock, Send, LineChart, Target, FileText, CheckSquare, Users, BarChart3, Code2, Settings,
  Search, Upload, Plus, Flame, Wind, Snowflake, Globe, Star, Swords, Lightbulb, Phone, Navigation, ChevronDown, Bookmark, Bell, CalendarCheck, DollarSign, Trophy, Check, Crosshair,
} from "lucide-react";
import { C, F, useT, prog, pop, lerp, rnd, RothmeMark } from "../brand";

/* Designed recreation of rothme.app /lead-map (layout + copy from the real app, data is example data). */

export const LM = {
  bg: "#05061A", panel: "#0C0E2B", panel2: "#11143A", line: "rgba(255,255,255,0.08)", text: "#F3F4FA", sub: "rgba(226,228,245,0.6)",
  hot: "#F43F5E", warm: "#F59E0B", cold: "#38BDF8", high: "#10B981", purple: "#A855F7",
};
const ab: React.CSSProperties = { position: "absolute" };
export const heat = (h: "hot" | "warm" | "cold") => (h === "hot" ? LM.hot : h === "warm" ? LM.warm : LM.cold);

/* ---------------- app chrome ---------------- */
const NAV: [any, string][] = [[LayoutDashboard, "Dashboard"], [Store, "Marketplace"], [Radar, "Lead Discovery"], [MapPin, "Lead Map"], [CalendarClock, "Appointments"],
  [Send, "Publishing"], [LineChart, "Analytics"], [Target, "Goals"], [FileText, "Reports"], [CheckSquare, "Tasks"], [Users, "Team"], [BarChart3, "Insights"], [Code2, "Dev Center"], [Settings, "Settings"]];

export const AppFrame: React.FC<{ w: number; h: number; children: React.ReactNode; s?: number }> = ({ w, h, children, s = 1 }) => (
  <div style={{ width: w, height: h, borderRadius: 22 * s, overflow: "hidden", position: "relative", background: LM.bg, border: `1px solid rgba(255,255,255,.12)`,
    boxShadow: "0 60px 140px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.15)", fontFamily: F.sans, color: LM.text }}>
    {/* sidebar */}
    <div style={{ ...ab, left: 0, top: 0, bottom: 0, width: 250 * s, background: "linear-gradient(180deg,#2B2F45 0%,#1A1C2C 55%,#0E0F18 100%)", borderRight: `1px solid ${LM.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * s, padding: `${22 * s}px ${20 * s}px`, borderBottom: `1px solid ${LM.line}` }}>
        <RothmeMark size={30 * s} /><span style={{ fontFamily: F.head, fontWeight: 600, fontSize: 19 * s }}>ROTHME</span>
      </div>
      <div style={{ padding: `${18 * s}px ${14 * s}px` }}>
        <div style={{ fontSize: 13 * s, color: LM.sub, padding: `0 ${8 * s}px ${10 * s}px` }}>Workspace</div>
        {NAV.map(([I, n]) => {
          const on = n === "Lead Map";
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12 * s, padding: `${9 * s}px ${10 * s}px`, borderRadius: 10 * s, marginBottom: 2 * s, fontSize: 15.5 * s,
              background: on ? "rgba(99,102,241,.22)" : undefined, color: on ? "#fff" : "rgba(235,236,250,.82)", fontWeight: on ? 600 : 400, boxShadow: on ? "inset 0 0 0 1px rgba(139,140,248,.35)" : undefined }}>
              <I size={17 * s} strokeWidth={1.8} color={on ? C.primarySoft : undefined} />{n}
            </div>
          );
        })}
      </div>
    </div>
    {/* top bar */}
    <div style={{ ...ab, left: 250 * s, right: 0, top: 0, height: 62 * s, borderBottom: `1px solid ${LM.line}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 * s, padding: `0 ${22 * s}px` }}>
      <span style={{ fontSize: 14 * s, color: LM.sub }}>Monday, October 12</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 * s, padding: `${8 * s}px ${14 * s}px`, borderRadius: 10 * s, border: `1px solid ${LM.line}`, fontSize: 14 * s }}><Users size={15 * s} />Workspace</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 * s, padding: `${8 * s}px ${14 * s}px`, borderRadius: 10 * s, border: `1px solid ${LM.line}`, fontSize: 14 * s, color: LM.sub }}><Search size={15 * s} />Search</div>
      <div style={{ width: 34 * s, height: 34 * s, borderRadius: 99, background: "linear-gradient(135deg,#8B8CF8,#6366F1)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 * s }}>M</div>
    </div>
    <div style={{ ...ab, left: 250 * s, right: 0, top: 62 * s, bottom: 0 }}>{children}</div>
  </div>
);

export const Btn: React.FC<{ icon?: any; label: string; primary?: boolean; press?: number; s?: number; style?: React.CSSProperties }> = ({ icon: I, label, primary, press = 0, s = 1, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 9 * s, padding: `${11 * s}px ${18 * s}px`, borderRadius: 12 * s, fontSize: 16 * s, fontWeight: 600, whiteSpace: "nowrap",
    background: primary ? C.primary : "rgba(255,255,255,.03)", border: primary ? "none" : `1px solid rgba(255,255,255,.12)`, color: "#fff",
    transform: `scale(${1 - press * 0.06})`, boxShadow: primary ? `0 0 ${20 + 40 * press}px rgba(99,102,241,${0.35 + 0.4 * press})` : undefined, ...style }}>
    {I && <I size={17 * s} />}{label}
  </div>
);

export const Header: React.FC<{ s?: number; press?: number }> = ({ s = 1, press = 0 }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 * s, padding: `${6 * s}px ${12 * s}px`, borderRadius: 99, border: `1px solid rgba(139,140,248,.3)`, fontSize: 12 * s, letterSpacing: "0.16em", color: C.primarySoft }}>
        <MapPin size={13 * s} />FREE FOR EVERY ACCOUNT</div>
      <div style={{ fontSize: 46 * s, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 10 * s }}>Lead Map</div>
      <div style={{ fontSize: 16 * s, color: LM.sub, marginTop: 4 * s, maxWidth: 620 * s, lineHeight: 1.4 }}>Find where the opportunities are, understand the competition, and turn opportunities into actual sales.</div>
    </div>
    <div style={{ display: "flex", gap: 10 * s }}>
      <Btn icon={Radar} label="Find opportunities" s={s} press={press} style={press > 0 ? { borderColor: C.primarySoft } : undefined} />
      <Btn icon={Upload} label="Import CSV" s={s} />
      <Btn icon={Plus} label="Add opportunity" primary s={s} />
    </div>
  </div>
);

export const Kpis: React.FC<{ s?: number; vals: [string, string, string?][] }> = ({ s = 1, vals }) => (
  <div style={{ display: "flex", gap: 12 * s }}>
    {vals.map(([k, v, sub], i) => (
      <div key={k} style={{ flex: 1, padding: `${16 * s}px ${18 * s}px`, borderRadius: 16 * s, background: LM.panel, border: `1px solid ${LM.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: 30 * s, height: 30 * s, borderRadius: 9 * s, background: ["rgba(99,102,241,.18)", "rgba(16,185,129,.16)", "rgba(245,158,11,.16)", "rgba(56,189,248,.16)", "rgba(244,63,94,.16)", "rgba(168,85,247,.18)"][i % 6] }} />
          <div style={{ fontSize: 30 * s, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</div>
        </div>
        <div style={{ fontSize: 11.5 * s, letterSpacing: "0.12em", color: LM.sub, marginTop: 10 * s, whiteSpace: "nowrap" }}>{k}</div>
        {sub && <div style={{ fontSize: 12 * s, color: LM.sub, marginTop: 3 * s, opacity: 0.8 }}>{sub}</div>}
      </div>
    ))}
  </div>
);

/* ---------------- map ---------------- */
export type Lead = { id: number; x: number; y: number; h: "hot" | "warm" | "cold"; score: number; name?: string };
/* deterministic lead set in map space (0..1600 × 0..1000), clustered around neighbourhoods */
const HOODS: [number, number][] = [[800, 470], [980, 400], [640, 600], [900, 640], [700, 330], [1100, 560], [560, 420], [1040, 760]];
export const LEADS: Lead[] = Array.from({ length: 34 }).map((_, i) => {
  const [hx, hy] = HOODS[i % HOODS.length];
  const a = rnd(i + 3) * Math.PI * 2, r = 30 + rnd(i + 9) * 150;
  const sc = Math.round(35 + rnd(i + 17) * 62);
  return { id: i, x: hx + Math.cos(a) * r, y: hy + Math.sin(a) * r * 0.8, score: sc, h: sc >= 78 ? "hot" : sc >= 58 ? "warm" : "cold" };
});
export const HERO = { x: 870, y: 500 };
LEADS[0] = { id: 0, x: HERO.x, y: HERO.y - 40, h: "hot", score: 92 };

/* stylised dark street map of a city (Austin-like: river across the middle) */
export const CityMap: React.FC<{ w: number; h: number; labels?: boolean; seed?: number }> = ({ w, h, labels = true, seed = 1 }) => {
  const roads: string[] = [];
  for (let i = 0; i < 26; i++) {
    const y = 20 + i * 40 + rnd(i * seed) * 14;
    roads.push(`M0 ${y} C 400 ${y + (rnd(i + 2) - 0.5) * 40} 1000 ${y + (rnd(i + 5) - 0.5) * 40} 1600 ${y + (rnd(i + 7) - 0.5) * 30}`);
  }
  for (let i = 0; i < 40; i++) {
    const x = 10 + i * 41 + rnd(i + 40) * 12;
    roads.push(`M${x} 0 C ${x + (rnd(i + 3) - 0.5) * 50} 300 ${x + (rnd(i + 8) - 0.5) * 50} 700 ${x + (rnd(i + 1) - 0.5) * 40} 1000`);
  }
  return (
    <svg viewBox="0 0 1600 1000" width={w} height={h} preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <rect width="1600" height="1000" fill="#0A0C1F" />
      {/* parks */}
      {[[300, 200, 160, 110], [1180, 240, 140, 90], [620, 780, 190, 120], [1300, 760, 130, 120], [520, 520, 90, 70]].map(([x, y, rw, rh], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rw} ry={rh} fill="#0F2420" opacity=".9" />
      ))}
      <g stroke="#1A1E40" strokeWidth="2.2" fill="none">{roads.map((d, i) => <path key={i} d={d} />)}</g>
      {/* highways */}
      <path d="M960 0 C 930 260 900 520 940 1000" stroke="#2C3170" strokeWidth="9" fill="none" />
      <path d="M0 300 C 400 330 900 250 1600 360" stroke="#262A62" strokeWidth="7" fill="none" />
      <path d="M200 1000 C 380 700 560 560 1600 640" stroke="#262A62" strokeWidth="6" fill="none" />
      {/* river / lake */}
      <path d="M0 560 C 200 520 360 600 540 560 S 860 470 1040 520 S 1400 610 1600 560" stroke="#13265A" strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d="M0 560 C 200 520 360 600 540 560 S 860 470 1040 520 S 1400 610 1600 560" stroke="#183172" strokeWidth="14" fill="none" opacity=".7" />
      {labels && <g fontFamily="DM Sans" fontSize="22" fill="rgba(200,205,255,.38)" letterSpacing="4" fontWeight="600">
        <text x="760" y="440">DOWNTOWN</text><text x="1080" y="380">EAST AUSTIN</text><text x="560" y="680">ZILKER</text><text x="860" y="700">SOUTH CONGRESS</text>
        <text x="640" y="250">HYDE PARK</text><text x="1180" y="180">MUELLER</text><text x="1050" y="820">TRAVIS HEIGHTS</text>
      </g>}
    </svg>
  );
};

/* teardrop pin */
export const Pin: React.FC<{ color: string; size?: number; drop?: number; pulse?: number; label?: string; ring?: boolean }> = ({ color, size = 34, drop = 1, pulse = 0, label, ring }) => {
  if (drop <= 0) return null;
  const y = (1 - Math.min(1, drop)) * -120;
  return (
    <div style={{ ...ab, left: -size / 2, top: -size * 1.25, width: size, height: size * 1.25, transform: `translateY(${y}px) scale(${Math.min(1, drop * 1.6)})`, transformOrigin: "50% 100%" }}>
      {pulse > 0 && <div style={{ ...ab, left: size / 2 - size, top: size * 1.25 - size, width: size * 2, height: size * 2, borderRadius: 99, border: `3px solid ${color}`, opacity: 1 - pulse, transform: `scale(${0.3 + pulse * 1.4}) scaleY(.5)` }} />}
      <div style={{ ...ab, left: size * 0.2, top: size * 1.12, width: size * 0.6, height: size * 0.2, borderRadius: 99, background: "rgba(0,0,0,.5)", filter: "blur(3px)" }} />
      <svg viewBox="0 0 24 30" width={size} height={size * 1.25} style={{ ...ab, left: 0, top: 0, filter: `drop-shadow(0 0 ${ring ? 18 : 8}px ${color}aa)` }}>
        <path d="M12 29 C 12 29 2 17.5 2 11 A10 10 0 0 1 22 11 C 22 17.5 12 29 12 29 Z" fill={color} stroke="rgba(255,255,255,.9)" strokeWidth="1.6" />
        <circle cx="12" cy="11" r="4" fill="#fff" />
      </svg>
      {label && <div style={{ ...ab, left: size + 4, top: 0, padding: "3px 8px", borderRadius: 8, background: "#fff", color: "#12142E", fontFamily: F.sans, fontWeight: 700, fontSize: size * 0.42, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

/* full map panel: map + pins + radius + controls. t0 = when pins start dropping. focus 0..1 highlight hot/warm/cold */
export const MapPanel: React.FC<{
  w: number; h: number; t0: number; radius?: number; highlight?: "hot" | "warm" | "cold" | null; zoom?: number; cx?: number; cy?: number; scores?: number; s?: number; heroSel?: number; filter?: (l: Lead) => boolean;
}> = ({ w, h, t0, radius = 0, highlight = null, zoom = 1, cx = 800, cy = 500, scores = 0, s = 1, heroSel = 0, filter }) => {
  const t = useT();
  const k = (w / 1600) * zoom * 1.25;
  const tx = w / 2 - cx * k, ty = h / 2 - cy * k;
  const leads = filter ? LEADS.filter(filter) : LEADS;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 16 * s, border: `1px solid ${LM.line}` }}>
      <div style={{ ...ab, left: tx, top: ty, width: 1600 * k, height: 1000 * k }}>
        <CityMap w={1600 * k} h={1000 * k} />
        {/* service radius */}
        {radius > 0 && <div style={{ ...ab, left: HERO.x * k - 360 * k * radius, top: HERO.y * k - 360 * k * radius, width: 720 * k * radius, height: 720 * k * radius, borderRadius: "50%",
          border: `${2 * s}px dashed rgba(139,140,248,.8)`, background: "radial-gradient(circle, rgba(99,102,241,.14), rgba(99,102,241,.05) 70%)" }} />}
        {radius > 0 && <div style={{ ...ab, left: HERO.x * k - 9, top: HERO.y * k - 9, width: 18, height: 18, borderRadius: 99, background: C.primarySoft, boxShadow: "0 0 0 6px rgba(139,140,248,.25)" }} />}
        {leads.map((l, i) => {
          const d = prog(t, t0 + i * 0.045, 0.45, Easing.out(Easing.back(1.6)));
          const dim = highlight && l.h !== highlight ? 0.25 : 1;
          const isHero = l.id === 0 && heroSel > 0;
          return (
            <div key={l.id} style={{ ...ab, left: l.x * k, top: l.y * k, opacity: dim, zIndex: Math.round(l.y) + (isHero ? 2000 : 0) }}>
              <Pin color={heat(l.h)} size={(isHero ? 44 + 14 * heroSel : 30) * s} drop={d} ring={isHero || (highlight === l.h)}
                pulse={highlight === l.h ? ((t * 1.2 + i * 0.13) % 1) : isHero ? (t * 1.1) % 1 : 0}
                label={scores > 0 && (l.h === "hot" || isHero) && d >= 1 && rnd(i + 2) < scores ? String(l.score) : undefined} />
            </div>
          );
        })}
      </div>
      {/* controls */}
      <div style={{ ...ab, left: 14 * s, top: 14 * s, display: "flex", gap: 4 * s, padding: 4 * s, borderRadius: 12 * s, background: "rgba(10,12,32,.85)", border: `1px solid ${LM.line}`, fontSize: 14 * s }}>
        {["Markers", "Hot Spots", "Both"].map((m, i) => <div key={m} style={{ padding: `${7 * s}px ${12 * s}px`, borderRadius: 9 * s, background: i === 0 ? "rgba(255,255,255,.1)" : undefined, color: i === 0 ? "#fff" : LM.sub }}>{m}</div>)}
      </div>
      <div style={{ ...ab, right: 14 * s, top: 14 * s, display: "flex", gap: 8 * s, fontSize: 14 * s }}>
        <div style={{ padding: `${9 * s}px ${12 * s}px`, borderRadius: 10 * s, background: "rgba(10,12,32,.85)", border: `1px solid ${LM.line}`, display: "flex", alignItems: "center", gap: 6 * s }}><Crosshair size={14 * s} />Service radius · 10 miles</div>
      </div>
      <div style={{ ...ab, left: 14 * s, bottom: 14 * s, display: "flex", flexDirection: "column", borderRadius: 10 * s, overflow: "hidden", border: `1px solid ${LM.line}` }}>
        {["+", "−"].map((z) => <div key={z} style={{ width: 34 * s, height: 34 * s, display: "grid", placeItems: "center", background: "rgba(10,12,32,.9)", fontSize: 20 * s, color: "#fff" }}>{z}</div>)}
      </div>
      <div style={{ ...ab, right: 10 * s, bottom: 8 * s, fontSize: 11 * s, color: "rgba(226,228,245,.45)" }}>Leaflet | © OpenStreetMap contributors</div>
    </div>
  );
};

/* Hot / Warm / Cold chips row */
export const HeatChips: React.FC<{ s?: number; active?: "hot" | "warm" | "cold" | null; counts?: [number, number, number] }> = ({ s = 1, active, counts }) => (
  <div style={{ display: "flex", gap: 10 * s }}>
    {([[Flame, "Hot", "hot"], [Wind, "Warm", "warm"], [Snowflake, "Cold", "cold"]] as const).map(([I, n, h], i) => {
      const on = active === h; const col = heat(h);
      return (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 * s, padding: `${10 * s}px ${16 * s}px`, borderRadius: 12 * s, fontSize: 17 * s, fontWeight: 600,
          border: `1px solid ${on ? col : "rgba(255,255,255,.12)"}`, background: on ? `${col}26` : "rgba(255,255,255,.03)", color: on ? "#fff" : LM.sub, transform: `scale(${on ? 1.08 : 1})`,
          boxShadow: on ? `0 0 30px ${col}66` : undefined }}>
          <I size={18 * s} color={col} />{n}{counts && <span style={{ fontVariantNumeric: "tabular-nums", color: col, marginLeft: 2 }}>{counts[i]}</span>}
        </div>
      );
    })}
  </div>
);

/* Opportunity score ring */
export const ScoreRing: React.FC<{ v: number; size: number; color: string; stroke?: number }> = ({ v, size, color, stroke = 12 }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.1)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
    </svg>
  );
};

/* lead detail card */
export type Reason = { icon: any; title: string; sub: string; t: number };
export const LeadCard: React.FC<{
  name: string; kind: string; dist: string; score: number; t0: number; reasons: Reason[]; s?: number; w?: number; saveT?: number; savePress?: number; footer?: React.ReactNode;
}> = ({ name, kind, dist, score, t0, reasons, s = 1, w = 600, saveT = 999, savePress = 0, footer }) => {
  const t = useT();
  const sv = Math.round(score * prog(t, t0 + 0.2, 1.2, Easing.out(Easing.cubic)));
  const saved = t > saveT;
  return (
    <div style={{ width: w, borderRadius: 24 * s, background: "linear-gradient(170deg,#151840,#0C0E2B)", border: `1px solid rgba(255,255,255,.12)`, boxShadow: "0 40px 100px rgba(0,0,0,.6)", padding: 28 * s, boxSizing: "border-box", fontFamily: F.sans, color: LM.text }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 * s }}>
        <div style={{ position: "relative", width: 110 * s, height: 110 * s, flexShrink: 0 }}>
          <ScoreRing v={sv} size={110 * s} color={LM.hot} stroke={10 * s} />
          <div style={{ ...ab, inset: 0, display: "grid", placeItems: "center", fontSize: 40 * s, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{sv}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 * s, padding: `${5 * s}px ${12 * s}px`, borderRadius: 99, background: "rgba(244,63,94,.18)", color: "#FDA4AF", fontSize: 15 * s, fontWeight: 700,
              transform: `scale(${pop(t, t0 + 1.2, 0.5)})` }}><Flame size={15 * s} />HOT</div>
            <div style={{ fontSize: 13 * s, letterSpacing: "0.1em", color: LM.sub }}>ROTHME OPPORTUNITY SCORE</div>
          </div>
          <div style={{ fontSize: 32 * s, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 8 * s, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ display: "flex", gap: 14 * s, fontSize: 16 * s, color: LM.sub, marginTop: 4 * s }}>
            <span>{kind}</span><span style={{ display: "flex", alignItems: "center", gap: 5 * s }}><Navigation size={14 * s} />{dist}</span><span style={{ display: "flex", alignItems: "center", gap: 5 * s }}><Phone size={14 * s} />(512) 555-0142</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13 * s, letterSpacing: "0.12em", color: LM.sub, margin: `${22 * s}px 0 ${8 * s}px` }}>WHY IT'S AN OPPORTUNITY</div>
      {reasons.map((r, i) => {
        const p = prog(t, r.t, 0.45);
        return (
          <div key={i} style={{ display: "flex", gap: 14 * s, alignItems: "center", padding: `${12 * s}px ${14 * s}px`, marginBottom: 8 * s, borderRadius: 14 * s, background: "rgba(255,255,255,.04)", border: `1px solid ${LM.line}`,
            opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
            <div style={{ width: 40 * s, height: 40 * s, borderRadius: 11 * s, background: "rgba(16,185,129,.16)", display: "grid", placeItems: "center", flexShrink: 0 }}><r.icon size={20 * s} color={LM.high} /></div>
            <div><div style={{ fontSize: 19 * s, fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 15 * s, color: LM.sub, marginTop: 2 * s }}>{r.sub}</div></div>
          </div>
        );
      })}
      {footer ?? (
        <div style={{ display: "flex", gap: 10 * s, marginTop: 14 * s }}>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 * s, padding: `${14 * s}px`, borderRadius: 14 * s, fontWeight: 600, fontSize: 18 * s,
            background: saved ? LM.high : C.primary, transform: `scale(${1 - savePress * 0.05})`, boxShadow: `0 0 ${24 + 40 * savePress}px ${saved ? "rgba(16,185,129,.5)" : "rgba(99,102,241,.5)"}` }}>
            {saved ? <><Check size={19 * s} strokeWidth={3} />Saved to pipeline</> : <><Bookmark size={18 * s} />Save to pipeline</>}
          </div>
          <div style={{ padding: `${14 * s}px ${18 * s}px`, borderRadius: 14 * s, border: `1px solid rgba(255,255,255,.14)`, fontWeight: 600, fontSize: 18 * s }}>Create a campaign</div>
        </div>
      )}
    </div>
  );
};

export const REASONS_ICONS = { Globe, Star, Swords, Lightbulb, Bell, CalendarCheck, DollarSign, Trophy, ChevronDown, Search, Radar, MapPin, Check };

/* Pipeline board */
export const STAGES = ["New", "Researching", "Contacted", "Bid Submitted", "Follow-Up", "Won", "Lost"];
export const STAGE_COL = ["#8B8CF8", "#38BDF8", "#22D3EE", "#F59E0B", "#FB923C", "#10B981", "#64748B"];
