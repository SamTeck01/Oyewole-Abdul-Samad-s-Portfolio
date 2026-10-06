import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Check, Factory, Building2, Sun, Zap, FileText, Ship, MapPin } from "lucide-react";
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import world from "./countries-110m.json";
import * as Q from "./cues";
import { C, Card, Cursor, Gradient, Label, Model, Studio, ease, fadeIO, pop, prog, useT, useV } from "./ui";
import { LogoFull } from "./Logo";
import { tr, isZh } from "./i18n";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* 1 · Hook — words drift in scattered then settle onto one line */
export const Hook: React.FC = () => {
  const t = useT(); const { V, s } = useV();
  const settle = prog(t, 2.6, 0.9);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIO(t, 0, Q.S.hook[1], 0.3) }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: (isZh() ? 4 : 18) * s, maxWidth: V ? 900 : 1500 }}>
        {(isZh() ? ["在找", "靠谱的", "紧固件", "厂家", "吗？", ""] : Q.HOOK_WORDS).map((w, i) => {
          const a = prog(t, Q.HOOK_T[i], 0.7);
          const sx = 0, sy = (1 - a) * 40 * s;
          return (
            <span key={i} style={{ fontFamily: "Inter", fontWeight: 300, fontSize: (V ? 84 : 76) * s, color: "#fff", opacity: a, filter: `blur(${(1 - a) * 12}px)`, transform: `translate(${sx + (1 - a) * 60}px, ${sy}px)`, display: "inline-block" }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 2 · Logo build → "15 product families" + M2→M120 counter */
export const LogoScene: React.FC = () => {
  const t = useT(); const { V, s } = useV();
  const [a, b] = Q.S.logo;
  const p = interpolate(t, [a, a + 2.4], [0, 1], { ...clamp, easing: ease });
  const up = prog(t, 8.3, 0.9);
  const famA = prog(t, 9.2, 0.6), cnt = interpolate(t, [10.6, 13.2], [2, 120], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIO(t, a, b, 0.35) }}>
      <div style={{ transform: `translateY(${-up * (V ? 380 : 170) * s}px) scale(${1 - up * 0.35})` }}>
        <LogoFull size={(V ? 420 : 360) * s} p={p} dark={false} />
      </div>
      <div style={{ position: "absolute", top: (V ? 1050 : 640) * s, display: "flex", flexDirection: "column", alignItems: "center", opacity: famA, transform: `translateY(${(1 - famA) * 30}px)` }}>
        <Label size={(V ? 64 : 56) * s} color="#fff" weight={300}>{tr("One factory. 15 product families.")}</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 * s, marginTop: 26 * s, opacity: prog(t, 10.4, 0.4) }}>
          <Label size={(V ? 150 : 140) * s} color="#fff" weight={600}>M2</Label>
          <div style={{ width: 160 * s, height: 3, background: "rgba(255,255,255,.7)", transform: `scaleX(${prog(t, 10.6, 2.4)})`, transformOrigin: "left" }} />
          <Label size={(V ? 150 : 140) * s} color="#fff" weight={600}>M{Math.round(cnt)}</Label>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 3 · Range — the 15-family wall builds tile by tile as each family is named */
export const Range: React.FC = () => {
  const t = useT(); const { V, s } = useV();
  const [a, b] = Q.S.range;
  const cols = V ? 3 : 5, cell = (V ? 320 : 330) * s, gap = 16 * s;
  const items = Q.RANGE.map((g) => ({ m: g.models[0], l: g.label, n: g.note, t: g.t }));
  items.splice(3, 0, { m: "wing_nut", l: "Wing & cap nuts", n: undefined, t: Q.RANGE[2].t + 0.35 });
  const shown = items.filter((x) => t >= x.t - 0.1).length;
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35), justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Label size={(V ? 62 : 50) * s} color="#fff" weight={300} style={{ marginBottom: 26 * s }}>
        <b style={{ fontWeight: 600 }}>{String(Math.min(15, shown)).padStart(2, "0")}</b>{tr(" / 15 product families · ")}<b style={{ fontWeight: 600 }}>M2–M120</b>
      </Label>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap }}>
        {items.map((it, i) => {
          const q = prog(t, it.t - 0.1, 0.35);
          const isCustom = it.m === "custom";
          return (
            <div key={i} style={{ width: cell, height: cell * (V ? 0.92 : 0.66), borderRadius: 18, background: q > 0 ? "rgba(18,62,128,.28)" : "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ opacity: q, transform: `scale(${0.6 + 0.4 * q}) translateY(${(1 - q) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: cell * (V ? 0.62 : 0.46), height: cell * (V ? 0.62 : 0.46), position: "relative" }}>
                  {isCustom ? <Blueprint t={t} t0={it.t} size={cell * (V ? 0.62 : 0.46)} /> : <Model name={it.m} size={cell * (V ? 0.62 : 0.46)} offset={i * 5} style={{ transform: "scale(1.45)" }} />}
                </div>
                <Label size={(V ? 26 : 21) * s} color="#fff" weight={600} style={{ textAlign: "center", padding: "0 8px", marginTop: 4 * s }}>{tr(it.l)}</Label>
                {it.n && <Label size={(V ? 22 : 17) * s} color="rgba(255,255,255,.85)" weight={400}>{tr(it.n)}</Label>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* Blueprint line drawing that fills into the solid custom part */
const Blueprint: React.FC<{ t: number; t0: number; size: number }> = ({ t, t0, size }) => {
  const d = prog(t, t0, 1.0), solid = prog(t, t0 + 0.9, 0.6);
  const L = 1400;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", opacity: 1 - solid * 0.8 }}>
        <g fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray={L} strokeDashoffset={L * (1 - d)}>
          <ellipse cx="100" cy="130" rx="70" ry="26" /><ellipse cx="100" cy="122" rx="70" ry="26" />
          <ellipse cx="100" cy="122" rx="20" ry="8" /><path d="M80 122 L80 70 M120 122 L120 70" />
          <ellipse cx="100" cy="70" rx="20" ry="8" /><path d="M88 70 L88 30 M112 70 L112 30" /><ellipse cx="100" cy="30" rx="12" ry="5" />
          <path d="M20 170 L180 170 M20 165 L20 175 M180 165 L180 175" strokeWidth="1" />
        </g>
      </svg>
      <div style={{ position: "absolute", inset: 0, opacity: solid }}><Model name="custom" size={size} /></div>
    </div>
  );
};

/* 4 · Materials + grades */
export const Materials: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, s } = useV();
  const [a, b] = Q.S.material;
  const sel = Q.MATERIALS.filter((m) => t >= m.t).length - 1;
  const gsel = Q.GRADES_T.filter((x) => t >= x).length - 1;
  const gIn = prog(t, 44.9, 0.6);
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35), alignItems: "center" }}>
      <Label size={(V ? 58 : 46) * s} color="#fff" weight={300} style={{ position: "absolute", top: (V ? 200 : 80) * s }}>{tr("Materials & strength grades")}</Label>
      <div style={{ position: "absolute", top: (V ? 330 : 160) * s }}>
        <Model name="hex_bolt" size={(V ? 640 : 520) * s} speed={0.7} style={{ transform: "scale(1.3)",  }} />
        {gsel >= 0 && (
          <div style={{ position: "absolute", left: "50%", top: "18%", transform: `translateX(-50%) scale(${pop(t * 60, Q.GRADES_T[gsel])})`, background: C.royal, color: "#fff", fontFamily: "Inter", fontWeight: 700, fontSize: 40 * s, padding: "6px 18px", borderRadius: 10 }}>{Q.GRADES[gsel]}</div>
        )}
      </div>
      {/* material tray */}
      <Card style={{ position: "absolute", bottom: (V ? 520 : 200) * s, display: "flex", gap: 34 * s, padding: `${20 * s}px ${36 * s}px`, transform: `translateY(${(1 - prog(t, a + 0.1, 0.7)) * 200}px)`, background: "rgba(255,255,255,.92)", flexWrap: V ? "wrap" : "nowrap", justifyContent: "center", maxWidth: V ? 900 * s : undefined }}>
        {Q.MATERIALS.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * s, opacity: t >= m.t - 0.1 ? 1 : 0.35 }}>
            <div style={{ width: 70 * s, height: 70 * s, borderRadius: 99, background: `radial-gradient(circle at 35% 30%, #fff, ${m.c} 55%, #333 120%)`, outline: i === sel ? `4px solid ${C.blue}` : "none", outlineOffset: 4, transform: `scale(${i === sel ? 1.12 : 1})` }} />
            <Label size={22 * s} weight={i === sel ? 600 : 400}>{tr(m.label)}</Label>
          </div>
        ))}
      </Card>
      {/* grade chips */}
      <Card style={{ position: "absolute", bottom: (V ? 300 : 70) * s, display: "flex", alignItems: "center", gap: 14 * s, padding: `${14 * s}px ${24 * s}px`, opacity: gIn, transform: `translateY(${(1 - gIn) * 60}px)` }}>
        <Label size={22 * s} weight={600} style={{ marginRight: 8 }}>{tr("Grade")}</Label>
        {Q.GRADES.map((g, i) => (
          <div key={g} style={{ fontFamily: "Inter", fontSize: 26 * s, fontWeight: 600, padding: `${6 * s}px ${16 * s}px`, borderRadius: 8, background: i <= gsel ? C.blue : "#EDF2F7", color: i <= gsel ? "#fff" : C.grey }}>{g}</div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

/* 5 · Finishes — swatches re-skin a row of parts */
export const Finishes: React.FC = () => {
  const t = useT(); const { V, s } = useV();
  const [a, b] = Q.S.finish;
  const sel = Q.FINISHES.filter((x) => t >= x.t).length - 1;
  const parts = V ? ["hex_bolt", "hex_nut", "flat_washer"] : ["hex_bolt", "hex_nut", "flat_washer", "self_drill", "u_bolt"];
  const sz = (V ? 270 : 300) * s;
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35), alignItems: "center" }}>
      <Label size={(V ? 58 : 46) * s} color="#fff" weight={300} style={{ position: "absolute", top: (V ? 200 : 80) * s }}>{tr("Finishes")}</Label>
      <div style={{ position: "absolute", top: (V ? 420 : 220) * s, display: "flex", flexWrap: "wrap", justifyContent: "center", width: V ? 3 * sz : undefined }}>
        {parts.map((m, i) => (
          <div key={i} style={{ position: "relative", width: sz, height: sz }}>
            <Model name={m} size={sz} offset={i * 5} style={{ transform: "scale(1.35)", filter: sel >= 0 ? Q.FINISHES[sel].tint : undefined }} />
          </div>
        ))}
      </div>
      <Card style={{ position: "absolute", bottom: (V ? 420 : 110) * s, display: "flex", gap: 30 * s, flexWrap: V ? "wrap" : "nowrap", justifyContent: "center", maxWidth: V ? 900 * s : undefined, transform: `translateY(${(1 - prog(t, a + 0.1, 0.6)) * 200}px)` }}>
        {Q.FINISHES.map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 * s, opacity: t >= x.t - 0.1 ? 1 : 0.35 }}>
            <div style={{ width: 46 * s, height: 46 * s, borderRadius: 10, background: `linear-gradient(135deg, #fff -20%, ${x.c} 60%)`, outline: i === sel ? `3px solid ${C.blue}` : "none", outlineOffset: 3 }} />
            <Label size={24 * s} weight={i === sel ? 600 : 400}>{tr(x.label)}</Label>
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

const Tinted: React.FC<{ m: string; sz: number; tint: string; offset: number }> = ({ m, sz, tint, offset }) => {
  const f = useCurrentFrame();
  const idx = (Math.floor(f / 8 + offset) % 24) + 1;
  const url = staticFile(`m/${m}/f_${String(idx).padStart(4, "0")}.png`);
  return <div style={{ position: "absolute", inset: 0, transform: "scale(1.35)", background: tint, mixBlendMode: "multiply", WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />;
};

/* 6 · Standards — blueprint grid + scan + checks */
export const Standards: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, W, H, s } = useV();
  const [a, b] = Q.S.standards;
  const scan = interpolate(t, [a + 0.3, a + 2.2], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35), alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: `${60 * s}px ${60 * s}px` }} />
      <Label size={(V ? 58 : 46) * s} color="#fff" weight={300} style={{ position: "absolute", top: (V ? 200 : 80) * s }}>{tr("Made to standard")}</Label>
      <div style={{ position: "absolute", top: (V ? 380 : 170) * s }}>
        <Model name="flange_bolt" size={(V ? 600 : 520) * s} speed={0.6} style={{ transform: "scale(1.3)",  }} />
        <div style={{ position: "absolute", left: -40, right: -40, top: `${scan * 100}%`, height: 4, background: "#fff", boxShadow: `0 0 30px 8px ${C.sky}`, opacity: scan < 1 ? 1 : 0 }} />
      </div>
      <div style={{ position: "absolute", [V ? "bottom" : "right"]: (V ? 300 : 140) * s, top: V ? undefined : 330 * s, display: "flex", flexDirection: "column", gap: 18 * s } as React.CSSProperties}>
        {Q.STANDARDS.map((x, i) => {
          const p = pop(t * 60, x.t);
          return (
            <Card key={i} style={{ display: "flex", alignItems: "center", gap: 16 * s, transform: `translateX(${(1 - p) * 120}px)`, opacity: Math.min(1, p * 1.5), padding: `${14 * s}px ${26 * s}px` }}>
              <div style={{ width: 40 * s, height: 40 * s, borderRadius: 99, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Check color="#fff" size={26 * s} strokeWidth={3} /></div>
              <Label size={32 * s} weight={600}>{tr(x.label)}</Label>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 7 · Chapter card */
export const Chapter: React.FC = () => {
  const t = useT(); const { V, s } = useV();
  const [a, b] = Q.S.chapter;
  const p = prog(t, a, 0.6);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIO(t, a, b, 0.3) }}>
      <Label size={(V ? 86 : 72) * s} color="#fff" weight={300} style={{ letterSpacing: `${(1 - p) * 0.3}em`, opacity: p }}>{tr("Here's how it works")}</Label>
    </AbsoluteFill>
  );
};

const StepTag: React.FC<{ n: number; title: string; t0: number }> = ({ n, title, t0 }) => {
  const t = useT(); const { V, s } = useV(); const p = prog(t, t0, 0.6);
  return (
    <div style={{ position: "absolute", top: (V ? 160 : 70) * s, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 * s, opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}>
      <div style={{ fontFamily: "Inter, 'Noto Sans SC'", fontWeight: 600, fontSize: 26 * s, color: "#fff", background: C.blue, borderRadius: 99, padding: `${6 * s}px ${18 * s}px` }}>{isZh() ? `第${n}步` : `Step ${n}`}</div>
      <Label size={(V ? 46 : 40) * s} weight={300}>{title}</Label>
    </div>
  );
};

/* 8 · Step 1 — order sheet */
export const Step1: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, W, s } = useV();
  const [a, b] = Q.S.step1;
  const doc = pop(t * 60, 63.9);
  const qty = Math.round(interpolate(t, [Q.STEP1_QTY_T, Q.STEP1_QTY_T + 0.9], [0, 50000], { ...clamp, easing: ease }));
  const k = V ? 1 : 1.25;
  const cardW = (V ? 860 : 620) * s * k;
  const cx = V ? (W - cardW) / 2 : W * 0.52;
  const cy = (V ? 980 : 230) * s;
  const rowH = 82 * s * k;
  // cursor path to each field
  const targets = [...Q.STEP1_FIELDS.map((x, i) => ({ t: x.t, x: cx + cardW * 0.78, y: cy + 90 * s * k + i * rowH })), { t: Q.STEP1_QTY_T, x: cx + cardW * 0.85, y: cy + 90 * s * k + 4 * rowH + 20 * s * k }];
  let px = cx + cardW + 120, py = cy + 600 * s;
  targets.forEach((g) => { px = interpolate(t, [g.t - 0.35, g.t - 0.05], [px, g.x], { ...clamp, easing: ease }); py = interpolate(t, [g.t - 0.35, g.t - 0.05], [py, g.y], { ...clamp, easing: ease }); });
  const lastClick = targets.filter((g) => t >= g.t).pop();
  const click = lastClick ? Math.min(1, (t - lastClick.t) / 0.35) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35) }}>
      <Studio />
      <StepTag n={1} title={tr("Send your list or drawing")} t0={a + 0.1} />
      {/* drawing sheet */}
      <div style={{ position: "absolute", left: V ? W / 2 - 260 * s : W * 0.12, top: (V ? 320 : 230) * s, transform: `translateY(${(1 - doc) * -300}px) rotate(${(1 - doc) * -8 - 3}deg)`, opacity: Math.min(1, doc * 2) }}>
        <Card style={{ width: 520 * s, height: (V ? 560 : 600) * s, padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `${14 * s}px ${20 * s}px`, borderBottom: "1px solid #E4EBF1" }}>
            <FileText size={26 * s} color={C.blue} /><Label size={22 * s} weight={600}>bracket_bolt_M12.pdf</Label>
          </div>
          <div style={{ position: "relative", height: "100%", backgroundImage: "linear-gradient(#EEF3F8 1px, transparent 1px), linear-gradient(90deg, #EEF3F8 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
            <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: "6% 10%" }} width="80%" height="80%">
              <g fill="none" stroke={C.blue} strokeWidth="1.4">
                <path d="M70 20 h60 l8 14 v8 l-8 14 h-60 l-8 -14 v-8 z" /><path d="M85 56 v120 h30 v-120" />
                {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M85 ${100 + i * 4.6} l30 -3`} strokeWidth=".8" />)}
                <path d="M50 56 v120 M45 56 h10 M45 176 h10" strokeWidth=".8" /><text x="30" y="120" fontSize="8" fill={C.blue} stroke="none">80</text>
                <path d="M85 186 h30 M85 181 v10 M115 181 v10" strokeWidth=".8" /><text x="93" y="197" fontSize="8" fill={C.blue} stroke="none">M12</text>
              </g>
            </svg>
          </div>
        </Card>
      </div>
      {/* order sheet */}
      <div style={{ position: "absolute", left: cx, top: cy, opacity: prog(t, 64.6, 0.5), transform: `translateY(${(1 - prog(t, 64.6, 0.5)) * 40}px)` }}>
        <Card style={{ width: cardW, padding: `${22 * s * k}px ${30 * s * k}px` }}>
          <Label size={26 * s * k} weight={600} style={{ marginBottom: 12 * s }}>{tr("Order details")}</Label>
          {Q.STEP1_FIELDS.map((x, i) => {
            const on = prog(t, x.t, 0.25);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: rowH, borderTop: "1px solid #EDF2F6" }}>
                <Label size={26 * s * k} color={C.grey}>{tr(x.k)}</Label>
                <div style={{ fontFamily: "Inter", fontSize: 28 * s * k, fontWeight: 600, color: C.blue, padding: `${6 * s * k}px ${14 * s * k}px`, borderRadius: 8, background: on > 0 ? "#EAF3FC" : "transparent", opacity: on, transform: `translateX(${(1 - on) * 20}px)` }}>{tr(x.v)}</div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #EDF2F6", paddingTop: 16 * s }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Label size={26 * s * k} color={C.grey}>{tr("Quantity")}</Label><Label size={30 * s * k} weight={600} color={C.blue}>{qty.toLocaleString("en-US")}</Label>
            </div>
            <div style={{ height: 6 * s * k, background: "#E4EBF1", borderRadius: 9, marginTop: 14 * s }}>
              <div style={{ height: "100%", width: `${(qty / 50000) * 100}%`, background: C.blue, borderRadius: 9 }} />
            </div>
          </div>
        </Card>
      </div>
      <Cursor x={px} y={py} click={click} />
    </AbsoluteFill>
  );
};

/* 9 · Step 2 — line-art → solid → multiply into a production field */
export const Step2: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, W, H, s } = useV();
  const [a, b] = Q.S.step2;
  const solid = prog(t, a + 1.2, 0.8), field = prog(t, a + 2.4, 1.2);
  const n = V ? 5 : 9, rows = V ? 7 : 4, sz = (V ? 210 : 220) * s;
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35) }}>
      <Studio />
      <StepTag n={2} title={tr("Made to your exact specification")} t0={a + 0.1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: (V ? 300 : 180) * s, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: n * sz, height: rows * sz * 0.75 }}>
          {Array.from({ length: n * rows }, (_, i) => {
            const c = i % n, r = Math.floor(i / n), mid = Math.floor(n / 2) + Math.floor(rows / 2) * n;
            const isHero = i === mid;
            const q = isHero ? 1 : Math.max(0, Math.min(1, field * 2 - (Math.abs(c - n / 2) + Math.abs(r - rows / 2)) * 0.12));
            const heroScale = isHero ? 2.4 - 1.4 * field : 1;
            return (
              <div key={i} style={{ position: "absolute", left: c * sz, top: r * sz * 0.75, width: sz, height: sz, opacity: q, transform: `scale(${heroScale * (0.6 + 0.4 * q)})`, zIndex: isHero ? 5 : 1 }}>
                {isHero && <svg viewBox="0 0 100 100" width={sz} height={sz} style={{ position: "absolute", opacity: 1 - solid }}><g fill="none" stroke={C.blue} strokeWidth="1"><path d="M38 14 h24 l6 8 v4 l-6 8 h-24 l-6 -8 v-4 z" /><path d="M43 34 v54 h14 v-54" />{Array.from({ length: 10 }, (_, k) => <path key={k} d={`M43 ${58 + k * 3} l14 -2`} />)}</g></svg>}
                <div style={{ opacity: isHero ? solid : 1 }}><Model name="hex_bolt" size={sz} offset={i * 3} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <Card style={{ position: "absolute", left: V ? W / 2 - 230 * s : W * 0.07, bottom: (V ? 220 : 90) * s, display: "flex", alignItems: "center", gap: 14 * s, opacity: pop(t * 60, a + 3.3), transform: `scale(${0.85 + 0.15 * pop(t * 60, a + 3.3)})` }}>
        <div style={{ width: 40 * s, height: 40 * s, borderRadius: 99, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Check color="#fff" size={26 * s} strokeWidth={3} /></div>
        <Label size={28 * s} weight={600}>{tr("M12 · 8.8 · HDG — to spec")}</Label>
      </Card>
    </AbsoluteFill>
  );
};

/* 10 · Step 3 — box packs, circle wipe to China→USA map */
const countries = feature(world as any, (world as any).objects.countries) as any;
export const Step3: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, W, H, s } = useV();
  const [a, b] = Q.S.step3;
  const wipe = prog(t, a + 2.1, 0.7);
  const box = prog(t, a + 0.3, 0.5), lid = prog(t, a + 1.3, 0.5);
  const proj = geoNaturalEarth1().rotate([-180 + 30, 0]).fitExtent(V ? [[-W * 0.55, 450 * s], [W * 1.55, H - 450 * s]] : [[40, 120 * s], [W - 40, H - 80 * s]], countries);
  const path = geoPath(proj);
  const hebei: [number, number] = [115.5, 38.5], usa: [number, number] = [-118.2, 34.0], usaE: [number, number] = [-95.4, 29.8];
  const ip = geoInterpolate(hebei, usa);
  const rt = prog(t, a + 2.9, 1.6);
  const pts = Array.from({ length: 60 }, (_, i) => proj(ip(i / 59)) as [number, number]);
  const ship = proj(ip(rt)) as [number, number];
  const [hx, hy] = proj(hebei) as [number, number]; const [ux, uy] = proj(usa) as [number, number]; const [ex, ey] = proj(usaE) as [number, number];
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35) }}>
      <Studio />
      <StepTag n={3} title={tr("Packed & shipped")} t0={a + 0.1} />
      {/* carton */}
      <div style={{ position: "absolute", left: W / 2 - 230 * s, top: H / 2 - 120 * s, width: 460 * s, height: 300 * s }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const d = prog(t, a + 0.2 + i * 0.12, 0.45);
          return <div key={i} style={{ position: "absolute", left: (70 + i * 55) * s, top: (-160 + d * 230) * s, opacity: d > 0 ? 1 - lid : 0 }}><Model name={i % 2 ? "hex_nut" : "hex_bolt"} size={120 * s} offset={i * 4} /></div>;
        })}
        <div style={{ position: "absolute", inset: 0, top: 80 * s, background: "linear-gradient(#D9B98A, #C9A574)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.15)", opacity: box }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 70 * s, transform: "translateX(-50%)", background: C.blue, opacity: lid }} />
          <div style={{ position: "absolute", left: 30 * s, bottom: 24 * s, fontFamily: "Noto Sans SC", fontWeight: 700, fontSize: 30 * s, color: "rgba(30,79,150,.8)" }}>河北向晋鑫</div>
        </div>
        {[-1, 1].map((d) => (
          <div key={d} style={{ position: "absolute", top: 80 * s, [d < 0 ? "left" : "right"]: 0, width: "50%", height: 22 * s, background: "#CFAE7E", transformOrigin: d < 0 ? "left top" : "right top", transform: `rotate(${d * (1 - lid) * -150}deg)`, opacity: box } as React.CSSProperties} />
        ))}
      </div>
      {/* circle wipe → map */}
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${wipe * 120}% at 50% 50%)` }}>
        <Gradient />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <g>{countries.features.map((c: any, i: number) => <path key={i} d={path(c) || ""} fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.55)" strokeWidth={0.8} />)}</g>
          <polyline points={pts.slice(0, Math.max(2, Math.round(rt * 60))).map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={3 * s} strokeDasharray={`${8 * s} ${8 * s}`} />
          <circle cx={hx} cy={hy} r={10 * s * pop(t * 60, a + 2.7)} fill={C.royal} stroke="#fff" strokeWidth={3} />
          <circle cx={ux} cy={uy} r={10 * s * pop(t * 60, a + 4.4)} fill={C.royal} stroke="#fff" strokeWidth={3} />
          <circle cx={ex} cy={ey} r={8 * s * pop(t * 60, a + 4.6)} fill={C.royal} stroke="#fff" strokeWidth={3} />
        </svg>
        <div style={{ position: "absolute", left: hx - 10, top: hy + 18 * s, opacity: pop(t * 60, a + 2.8) }}><Label size={24 * s} color="#fff" weight={600}>{tr("Hebei, China")}</Label></div>
        <div style={{ position: "absolute", left: ux - 40 * s, top: uy + 18 * s, opacity: pop(t * 60, a + 4.5) }}><Label size={24 * s} color="#fff" weight={600}>{tr("USA")}</Label></div>
        {rt > 0 && rt < 1 && (
          <div style={{ position: "absolute", left: ship[0] - 26 * s, top: ship[1] - 26 * s, width: 52 * s, height: 52 * s, borderRadius: 99, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,.2)" }}><Ship size={30 * s} color={C.royal} /></div>
        )}
        <Label size={(V ? 54 : 46) * s} color="#fff" weight={300} style={{ position: "absolute", width: "100%", textAlign: "center", bottom: (V ? 260 : 60) * s, opacity: prog(t, a + 3.2, 0.6) }}>Factory-direct to the <b style={{ fontWeight: 600 }}>{tr("USA")}</b></Label>
      </div>
    </AbsoluteFill>
  );
};

/* 11 · Scale + markets */
export const Scale: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, s } = useV();
  const [a, b] = Q.S.scale;
  const n = Math.round(interpolate(t, [79.6, 81.6], [0, 1], { ...clamp, easing: (x) => x * x * x }) * 99990) + 10;
  const icons = [Factory, Building2, Sun, Zap];
  const up = prog(t, 82.4, 0.7);
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b, 0.35), alignItems: "center" }}>
      <div style={{ position: "absolute", top: (V ? 520 - up * 260 : 300 - up * 170) * s, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label size={(V ? 50 : 44) * s} color="#fff" weight={300}>{tr("From sample batch to mass production")}</Label>
        <Label size={(V ? 170 : 160) * s} color="#fff" weight={600} style={{ fontVariantNumeric: "tabular-nums", marginTop: 10 * s }}>{n.toLocaleString("en-US")}</Label>
        <Label size={30 * s} color="rgba(255,255,255,.8)" weight={300}>{tr("pieces")}</Label>
      </div>
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: (V ? 360 : 140) * s, display: "grid", gridTemplateColumns: V ? "repeat(2, auto)" : "repeat(4, auto)", gap: 24 * s }}>
        {Q.MARKETS.map((m, i) => {
          const p = pop(t * 60, m.t); const I = icons[i];
          return (
            <Card key={i} style={{ width: (V ? 400 : 330) * s, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * s, padding: `${28 * s}px ${20 * s}px`, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 60}px)` }}>
              <I size={56 * s} color={C.blue} strokeWidth={1.6} />
              <Label size={26 * s} weight={600} style={{ textAlign: "center" }}>{tr(m.label)}</Label>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 12 · End frame */
export const End: React.FC = () => {
  const t = useT(); const f = useCurrentFrame(); const { V, s } = useV();
  const [a, b] = Q.S.end;
  const p = interpolate(t, [a + 0.1, a + 2.2], [0, 1], { ...clamp, easing: ease });
  const wa = pop(t * 60, 92.5);
  return (
    <AbsoluteFill style={{ opacity: fadeIO(t, a, b + 0.3, 0.3) }}>
      <Studio />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26 * s }}>
        <LogoFull size={(V ? 380 : 300) * s} p={p} />
        <Label size={(V ? 52 : 44) * s} weight={300} style={{ opacity: prog(t, 90.2, 0.6) }}>{tr("Your one-stop fastener factory")}</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * s, background: "#25D366", borderRadius: 99, padding: `${14 * s}px ${30 * s}px`, opacity: Math.min(1, wa * 1.4), transform: `scale(${0.8 + 0.2 * wa})`, boxShadow: "0 10px 30px rgba(37,211,102,.35)" }}>
          <svg width={40 * s} height={40 * s} viewBox="0 0 24 24"><path fill="#fff" d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.9 9.88M20.47 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.42" /></svg>
          <Label size={(V ? 44 : 38) * s} color="#fff" weight={600}>{Q.PHONE}</Label>
        </div>
        <Label size={22 * s} color={C.grey} style={{ opacity: prog(t, 93.0, 0.6), letterSpacing: "0.08em" }}>{tr("M2–M120 · GRADES 4.8–12.9 · ISO / DIN / GB")}</Label>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* samteck card */
export const Samteck: React.FC = () => {
  const t = useT(); const { s } = useV();
  const [a] = Q.S.card;
  const p = prog(t, a + 0.1, 0.7);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1b1f3a 0%, #0b0d1a 70%)", justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: prog(t, a, 0.25) }}>
      <Label size={20 * s} color="rgba(255,255,255,.55)" weight={500} style={{ letterSpacing: "0.5em", opacity: p }}>MADE BY</Label>
      <Label size={92 * s} color="#fff" weight={700} style={{ letterSpacing: `${-0.03 + (1 - p) * 0.2}em`, opacity: p, marginTop: 10 * s }}>samteck</Label>
      <div style={{ width: 220 * s * p, height: 3, background: "#6a7cff", marginTop: 18 * s, borderRadius: 3 }} />
    </AbsoluteFill>
  );
};
