// Bau-Kunden kinetic reel (v4): the look of bau-kunden.app (Bebas Neue caps, dark ink + cream sections, sharp cards,
// red 01/02/03 numbering) with high-energy kinetic type: every spoken word slams in on its timestamp, hard beat cuts,
// whip blurs, camera shake on hits, UI moments from the reference (search, rank, stamps, report, 100 % block).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/bebas-neue';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import {Search, MapPin, Check, ArrowUpRight, BarChart3} from 'lucide-react';
import cuesDe from './reel_cues_de.json';
import cuesEn from './reel_cues_en.json';

export const KFPS = 60;
type Word = {w: string; s: number; e: number};
type Line = {id: string; start: number; end: number; words: Word[]};
type Cues = {total: number; lines: Line[]};
export const KCUES: Record<'de' | 'en', Cues> = {de: cuesDe as Cues, en: cuesEn as Cues};

// bau-kunden.app: page oklch(.965 .01 75) ≈ #f6f1ea, ink oklch(.21 .02 62) ≈ #231b15, red #ee333e
const C = {cream: '#f6f1ea', ink: '#231b15', red: '#ee333e', mute: '#7d7268', line: '#ddd3c7', inkLine: '#3d332b', white: '#fffdf9'};
const HEAD = '"Bebas Neue", sans-serif';
const BODY = 'Barlow, sans-serif';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

const TX = {
  de: {q: 'Dachdecker in meiner Nähe', comp: ['Dachbau Schneider', 'Meister Dach GmbH', 'Bedachungen Kraus'], ad: 'ANZEIGE', you: 'IHR BETRIEB', nf: 'NICHT GEFUNDEN',
    jobs: ['Dachsanierung · 52.000 €', 'Neubau EFH · 18.000 €', 'Reparatur · 3.400 €'], comp2: 'AN DIE KONKURRENZ', g1: 'GOOGLE-SUCHE', g2: 'GOOGLE MAPS',
    rep: 'MONATSREPORT', rows: ['Ausgegeben', 'Gesehen', 'Angefragt'], vals: ['1.000 €', '18.400', '23'], incl: 'ALLES INKLUSIVE',
    back: 'GELD ZURÜCK', backS: 'Betreuungspauschale + Werbebudget des Monats', t1: 'MONATLICH KÜNDBAR', t2: 'KEINE MINDESTLAUFZEIT',
    e1: 'MEHR ANFRAGEN.', e2: 'AUS IHRER REGION.', btn: 'Region & Gewerk kostenlos prüfen', url: 'bau-kunden.app', tag: 'MARKETING FÜR HANDWERK & DIENSTLEISTUNG',
    hl: ['gefunden', 'konkurrenz', 'drei', 'google', 'maps', 'inklusive', 'angefragt', 'zurück', 'region'], skip: ['l6']},
  en: {q: 'Roofer near me', comp: ['Schneider Roofing', 'Master Roof Ltd', 'Kraus Roofworks'], ad: 'SPONSORED', you: 'YOUR BUSINESS', nf: 'NOT FOUND',
    jobs: ['Roof renovation · €52,000', 'New house · €18,000', 'Repair · €3,400'], comp2: 'TO THE COMPETITION', g1: 'GOOGLE SEARCH', g2: 'GOOGLE MAPS',
    rep: 'MONTHLY REPORT', rows: ['Spent', 'Seen', 'Inquired'], vals: ['€1,000', '18,400', '23'], incl: 'ALL INCLUSIVE',
    back: 'MONEY BACK', backS: 'Management fee + that month\'s ad spend', t1: 'CANCEL MONTHLY', t2: 'NO MINIMUM TERM',
    e1: 'MORE INQUIRIES.', e2: 'FROM YOUR REGION.', btn: 'Get your free check', url: 'bau-kunden.app', tag: 'MARKETING FOR TRADES & SERVICES',
    hl: ['find', 'competition', 'three', 'google', 'maps', 'inclusive', 'inquired', 'back', 'region'], skip: ['l6']},
};
type T = typeof TX.de;
const norm = (w: string) => w.toLowerCase().replace(/[^a-zäöüß0-9%]/g, '');

// ---------- kinetic word stack: each word slams in at its spoken time ----------
// rows are built greedily so the stack fills the width; words of the current line slam, older ones settle
const Stack: React.FC<{line: Line; g0: number; t: T; color: string; size?: number; maxW?: number; align?: 'center' | 'left'}> = ({line, g0, t, color, size = 190, maxW = 960, align = 'center'}) => {
  const f = useCurrentFrame();
  const rows: Word[][] = [];
  let cur: Word[] = [], len = 0;
  const cw = size * 0.42; // Bebas average glyph width
  for (const w of line.words) {
    const L = (w.w.length + 1) * cw;
    if (cur.length && len + L > maxW) { rows.push(cur); cur = []; len = 0; }
    cur.push(w); len += L;
  }
  if (cur.length) rows.push(cur);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 0}}>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', gap: size * 0.22, lineHeight: 0.92}}>
          {r.map((w, i) => {
            const d = Math.round(w.s * KFPS) - g0 - 3;
            const k = spring({frame: f - d, fps: KFPS, config: {damping: 13, stiffness: 320, mass: 0.6}});
            if (f < d) return <span key={i} style={{fontFamily: HEAD, fontSize: size, opacity: 0}}>{w.w}</span>;
            const red = t.hl.some((h) => norm(w.w).startsWith(h));
            const bl = Math.max(0, (1 - k) * 18);
            return <span key={i} style={{fontFamily: HEAD, fontSize: size, color: red ? C.red : color, display: 'inline-block', letterSpacing: 1,
              transform: `scale(${1 + (1 - k) * 1.4}) translateY(${(1 - k) * -30}px)`, opacity: Math.min(1, k * 3), filter: bl > 0.5 ? `blur(${bl}px)` : undefined}}>{w.w.toUpperCase()}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

const Box: React.FC<{children: React.ReactNode; dark?: boolean; style?: React.CSSProperties}> = ({children, dark, style}) => (
  <div style={{background: dark ? '#2b221b' : C.white, border: `2px solid ${dark ? C.inkLine : C.line}`, ...style}}>{children}</div>
);
const Pop: React.FC<{d: number; children: React.ReactNode; from?: 'up' | 'left' | 'right' | 'scale'; style?: React.CSSProperties}> = ({d, children, from = 'up', style}) => {
  const f = useCurrentFrame();
  const k = spring({frame: f - d, fps: KFPS, config: {damping: 14, stiffness: 230, mass: 0.6}});
  if (f < d) return <div style={{...style, opacity: 0}}>{children}</div>;
  const tr = from === 'up' ? `translateY(${(1 - k) * 160}px)` : from === 'left' ? `translateX(${(1 - k) * -700}px)` : from === 'right' ? `translateX(${(1 - k) * 700}px)` : `scale(${1.8 - 0.8 * k})`;
  return <div style={{transform: tr, opacity: Math.min(1, k * 2.5), ...style}}>{children}</div>;
};
const Stamp: React.FC<{d: number; text: string; color?: string; rot?: number; size?: number; style?: React.CSSProperties}> = ({d, text, color = C.red, rot = -8, size = 110, style}) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const k = spring({frame: f - d, fps: KFPS, config: {damping: 9, stiffness: 340, mass: 0.6}});
  return <div style={{position: 'absolute', border: `8px solid ${color}`, color, fontFamily: HEAD, fontSize: size, letterSpacing: 6, padding: '6px 28px 0', background: 'transparent',
    transform: `rotate(${rot}deg) scale(${2.4 - 1.4 * k})`, opacity: Math.min(1, k * 3), whiteSpace: 'nowrap', ...style}}>{text}</div>;
};
const Num: React.FC<{n: string; dark?: boolean}> = ({n, dark}) => <div style={{fontFamily: HEAD, fontSize: 64, color: C.red, lineHeight: 1}}>{n}<span style={{color: dark ? C.inkLine : C.line}}> ——</span></div>;
const Logo: React.FC<{size: number; dark?: boolean}> = ({size, dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.25}}>
    <svg width={size} height={size} viewBox="0 0 64 64"><rect width="64" height="64" fill={C.red} />
      <g fill="none" stroke="#f7f3ec" strokeWidth="7" strokeLinecap="square"><path d="M20 12 V52" /><path d="M20 12 H34 A10 10 0 0 1 34 32 H20" /><path d="M20 32 H36 A10 10 0 0 1 36 52 H20" /></g></svg>
    <div style={{fontFamily: HEAD, fontSize: size * 0.95, lineHeight: 1, letterSpacing: 2, color: dark ? C.cream : C.ink, paddingTop: size * 0.08}}>BAU-<span style={{color: C.red}}>KUNDEN</span></div>
  </div>
);

// ---------- scenes (one per VO line); dark = ink section like the site's hero / 100 % block ----------
type SP = {line: Line; g0: number; t: T; W: (i: number) => number; next: number};
const S: Record<string, {dark: boolean; C: React.FC<SP>}> = {
  l1: {dark: true, C: ({line, g0, t}) => (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60}}>
      <div style={{position: 'absolute', top: 230}}><Num n="01" dark /></div>
      <Stack line={line} g0={g0} t={t} color={C.cream} size={210} />
    </AbsoluteFill>)},
  l2: {dark: false, C: ({line, g0, t, W}) => {
    const f = useCurrentFrame();
    const t0 = W(4);
    const n = Math.floor(interpolate(f, [t0, t0 + 36], [0, t.q.length], cl));
    return (
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 230}}>
        <Stack line={{...line, words: line.words.slice(0, 4)}} g0={g0} t={t} color={C.ink} size={150} />
        <Pop d={t0 - 8} style={{width: 920, marginTop: 50}}><Box style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 32px'}}>
          <Search size={46} color={C.ink} /><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 46, color: C.ink}}>{t.q.slice(0, n)}<span style={{color: C.red, opacity: Math.floor(f / 12) % 2}}>|</span></div></Box></Pop>
        {t.comp.map((c, i) => (
          <Pop key={i} d={t0 + 40 + i * 7} from="right" style={{width: 920, marginTop: 14}}><Box style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 30px'}}>
            <MapPin size={40} color={C.red} /><div style={{flex: 1, fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.ink}}>{c}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: C.mute, border: `2px solid ${C.line}`, padding: '4px 10px'}}>{t.ad}</div></Box></Pop>
        ))}
      </AbsoluteFill>);
  }},
  l3: {dark: true, C: ({line, g0, t, W}) => {
    const f = useCurrentFrame();
    const roll = Math.min(3, 1 + Math.floor(interpolate(f, [W(2), W(2) + 24], [0, 2.99], cl)));
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Stack line={{...line, words: line.words.slice(0, 2)}} g0={g0} t={t} color={C.cream} size={200} />
        <div style={{position: 'relative', marginTop: 10, opacity: f >= W(2) ? 1 : 0}}>
          <div style={{fontFamily: HEAD, fontSize: 420, color: C.red, lineHeight: 0.9, textAlign: 'center'}}>{t.you === 'IHR BETRIEB' ? 'SEITE' : 'PAGE'} {roll}</div>
          <Stamp d={W(3) + 12} text={t.nf} rot={-9} size={96} style={{left: 120, top: 150}} />
        </div>
      </AbsoluteFill>);
  }},
  l4: {dark: true, C: ({line, g0, t, W}) => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
        <Stack line={line} g0={g0} t={t} color={C.cream} size={170} />
        <div style={{marginTop: 60, width: 920}}>
          {t.jobs.map((j, i) => {
            const go = interpolate(f - W(4) - i * 7, [0, 18], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
            return <Pop key={i} d={4 + i * 5} from="left" style={{marginTop: 14}}><div style={{transform: `translateX(${go * 1200}px)`, filter: go > 0.05 ? `blur(${go * 12}px)` : undefined}}>
              <Box dark style={{padding: '22px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.cream}}>{j}</div>
                <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.red}}>→ {t.comp2}</div></Box></div></Pop>;
          })}
        </div>
      </AbsoluteFill>);
  }},
  l5: {dark: false, C: ({line, g0, t, W}) => (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 220}}>
      <Pop d={0} from="scale"><Logo size={150} /></Pop>
      <div style={{marginTop: 50}}><Stack line={{...line, words: line.words.slice(1)}} g0={g0} t={t} color={C.ink} size={120} maxW={940} /></div>
      <div style={{display: 'flex', gap: 24, marginTop: 50}}>
        {[t.g1, t.g2].map((g, i) => (
          <Pop key={i} d={W(Math.round(line.words.length * 0.55)) + i * 14} from={i === 0 ? 'left' : 'right'}><Box style={{width: 440, padding: '26px 28px', borderTop: `8px solid ${C.red}`}}>
            {i === 0 ? <Search size={56} color={C.red} /> : <MapPin size={56} color={C.red} />}
            <div style={{fontFamily: HEAD, fontSize: 70, color: C.ink, marginTop: 12}}>{g}</div></Box></Pop>
        ))}
      </div>
    </AbsoluteFill>)},
  // rapid fire: each item full screen with its number, then ALLES INKLUSIVE stamp
  l6: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const items = line.words.slice(0, 4);
    const lastAt = Math.round(line.words[4].s * KFPS) - g0;
    let cur = -1;
    items.forEach((w, i) => { if (f >= Math.round(w.s * KFPS) - g0 - 3) cur = i; });
    const k = cur >= 0 ? spring({frame: f - (Math.round(items[cur].s * KFPS) - g0 - 3), fps: KFPS, config: {damping: 12, stiffness: 320, mass: 0.6}}) : 0;
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {cur >= 0 && f < lastAt && <div style={{textAlign: 'center', transform: `scale(${1 + (1 - k) * 0.8})`, opacity: Math.min(1, k * 3)}}>
          <div style={{fontFamily: HEAD, fontSize: 120, color: C.red}}>0{cur + 1}</div>
          <div style={{fontFamily: HEAD, fontSize: 230, color: C.cream, lineHeight: 0.9}}>{items[cur].w.replace(/[.,]/g, '').toUpperCase()}</div>
        </div>}
        {f >= lastAt && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
          {items.map((w, i) => <Pop key={i} d={lastAt + i * 3} from="left"><div style={{display: 'flex', alignItems: 'center', gap: 22, width: 820}}>
            <div style={{fontFamily: HEAD, fontSize: 70, color: C.red, width: 90}}>0{i + 1}</div>
            <div style={{flex: 1, fontFamily: HEAD, fontSize: 120, color: C.cream, lineHeight: 1}}>{w.w.replace(/[.,]/g, '').toUpperCase()}</div><Check size={70} color={C.red} strokeWidth={3.5} /></div></Pop>)}
          <div style={{position: 'relative', height: 200, width: 900}}><Stamp d={lastAt + 16} text={t.incl} rot={-5} size={124} style={{left: 90, top: 40}} /></div>
        </div>}
      </AbsoluteFill>);
  }},
  l7: {dark: false, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const ws = line.words.slice(-3).map((w) => Math.round(w.s * KFPS) - g0);
    return (
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250}}>
        <Stack line={{...line, words: line.words.slice(0, -3)}} g0={g0} t={t} color={C.ink} size={150} />
        <Pop d={4} style={{width: 920, marginTop: 50}}><Box style={{padding: '30px 36px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26}}><div style={{fontFamily: HEAD, fontSize: 70, color: C.ink}}>{t.rep}</div><BarChart3 size={50} color={C.red} /></div>
          {t.rows.map((r, i) => {
            const k = interpolate(f - ws[i], [0, 20], [0, 1], {...cl, easing: out});
            return <div key={i} style={{marginBottom: 26}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 42, color: k > 0 ? C.ink : C.line}}><span>{r}</span><span style={{color: i === 2 ? C.red : C.ink}}>{k > 0.05 ? t.vals[i] : ''}</span></div>
              <div style={{height: 20, background: '#efe7dc', marginTop: 10}}><div style={{height: '100%', width: `${k * [70, 92, 48][i]}%`, background: i === 2 ? C.red : C.ink}} /></div>
            </div>;
          })}
        </Box></Pop>
      </AbsoluteFill>);
  }},
  l8: {dark: true, C: ({line, g0, t, W}) => {
    const f = useCurrentFrame();
    const hit = W(line.words.findIndex((w) => w.w.startsWith('100')));
    const v = Math.round(interpolate(f - hit, [0, 26], [0, 100], {...cl, easing: out}));
    return (
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
        <Stack line={{...line, words: line.words.slice(0, line.words.findIndex((w) => w.w.startsWith('100')))}} g0={g0} t={t} color={C.cream} size={120} />
        {f >= hit && <div style={{textAlign: 'center', marginTop: 40}}>
          <div style={{fontFamily: HEAD, fontSize: 400, color: C.red, lineHeight: 0.9, transform: `scale(${1 + 0.06 * Math.max(0, 1 - (f - hit - 26) / 10) * (f > hit + 26 ? 1 : 0)})`}}>{v} %</div>
          <Pop d={hit + 20} from="scale"><div style={{fontFamily: HEAD, fontSize: 180, color: C.cream, lineHeight: 0.9}}>{t.back}</div></Pop>
          <Pop d={hit + 34}><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 32, color: '#b8ab9d', marginTop: 20}}>{t.backS}</div></Pop>
        </div>}
      </AbsoluteFill>);
  }},
  l9: {dark: false, C: ({line, t}) => {
    const half = Math.ceil(line.words.length / 2);
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30}}>
        {[t.t1, t.t2].map((x, i) => (
          <Pop key={i} d={Math.round((line.words[i === 0 ? 0 : half].s - line.start) * KFPS) + 14} from={i === 0 ? 'left' : 'right'}>
            <Box style={{width: 940, padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 30, borderLeft: `14px solid ${C.red}`}}>
              <Check size={90} color={C.red} strokeWidth={3.5} /><div style={{fontFamily: HEAD, fontSize: 116, color: C.ink, lineHeight: 0.95}}>{x}</div></Box></Pop>
        ))}
      </AbsoluteFill>);
  }},
  l10: {dark: true, C: ({t, W, line}) => {
    const f = useCurrentFrame();
    const btnAt = W(Math.max(0, line.words.length - 4));
    return (
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
        <Pop d={0} from="scale"><Logo size={110} dark /></Pop>
        <Pop d={6}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#b8ab9d', marginTop: 26}}>{t.tag}</div></Pop>
        <div style={{marginTop: 50, textAlign: 'center'}}>
          <Pop d={W(0)} from="scale"><div style={{fontFamily: HEAD, fontSize: 160, color: C.cream, lineHeight: 0.9}}>{t.e1}</div></Pop>
          <Pop d={W(2)} from="scale"><div style={{fontFamily: HEAD, fontSize: 160, color: C.red, lineHeight: 0.9}}>{t.e2}</div></Pop>
        </div>
        <Pop d={btnAt} style={{marginTop: 70}}><div style={{background: C.red, color: '#fff', fontFamily: BODY, fontWeight: 700, fontSize: 44, padding: '30px 52px', display: 'flex', alignItems: 'center', gap: 16,
          transform: `scale(${1 + 0.03 * Math.sin(f / 9)})`}}>{t.btn} <ArrowUpRight size={46} /></div></Pop>
        <Pop d={btnAt + 10}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: C.cream, marginTop: 34}}>{t.url}</div></Pop>
      </AbsoluteFill>);
  }},
};

export const Kinetic: React.FC<{lang: 'de' | 'en'}> = ({lang}) => {
  const f = useCurrentFrame();
  const cues = KCUES[lang];
  const t = TX[lang];
  const L = cues.lines;
  const starts = L.map((l, i) => (i === 0 ? 0 : Math.round((l.start - 0.12) * KFPS)));
  let li = 0;
  for (let i = 0; i < L.length; i++) if (f >= starts[i]) li = i;
  const lf = f - starts[li];
  // hard cut with a whip: incoming scene slides in fast with motion blur, alternating direction; shake on impact
  const dir = li % 2 ? 1 : -1;
  const wk = li === 0 ? 1 : interpolate(lf, [0, 9], [0, 1], {...cl, easing: out});
  const shake = Math.max(0, 1 - lf / 12) * (li === 0 ? 0 : 1);
  const sx = Math.sin(f * 2.7) * 14 * shake, sy = Math.cos(f * 3.1) * 10 * shake;
  const zoom = 1 + 0.035 * (lf / ((starts[li + 1] ?? cues.total * KFPS) - starts[li]));
  const sc = S[L[li].id];
  const Comp = sc.C;
  const W = (i: number) => {
    const w = L[li].words[Math.max(0, Math.min(i, L[li].words.length - 1))];
    return w ? Math.round(w.s * KFPS) - starts[li] : 0;
  };
  const bg = sc.dark ? C.ink : C.cream;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {/* site-like texture: faint grid + red top rule */}
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${sc.dark ? 'rgba(246,241,234,.04)' : 'rgba(35,27,21,.045)'} 2px, transparent 2px), linear-gradient(90deg, ${sc.dark ? 'rgba(246,241,234,.04)' : 'rgba(35,27,21,.045)'} 2px, transparent 2px)`,
        backgroundSize: '120px 120px', backgroundPosition: `${-f * 0.6}px ${-f * 0.4}px`}} />
      {sc.dark && <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${40 + 6 * Math.sin(f / 50)}%, rgba(238,51,62,.16) 0%, rgba(238,51,62,0) 55%)`}} />}
      <AbsoluteFill style={{transform: `translate(${sx + (1 - wk) * dir * 520}px, ${sy}px) scale(${zoom})`, filter: wk < 0.9 ? `blur(${(1 - wk) * 26}px)` : undefined}}>
        <Sequence from={starts[li]} layout="none"><Comp line={L[li]} g0={starts[li]} t={t} W={W} next={starts[li + 1] ?? 0} /></Sequence>
      </AbsoluteFill>
      {/* red flash bar across the cut */}
      {li > 0 && lf < 10 && <div style={{position: 'absolute', left: 0, right: 0, top: `${interpolate(lf, [0, 10], [-10, 110])}%`, height: 140, background: C.red, transform: 'skewY(-8deg)', opacity: 0.9}} />}
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / (cues.total * KFPS)) * 100}%`, background: C.red}} />
      <Audio src={staticFile(`reel_mix_${lang}.wav`)} />
    </AbsoluteFill>
  );
};
