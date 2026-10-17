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
  de: {pain: ['Gute Arbeit. Bei Google kaum sichtbar.', 'Empfehlungen kommen nicht jeden Monat.', 'Keine Zeit für eigene Kampagnen.'],
    g1: 'GOOGLE-SUCHE', g2: 'GOOGLE MAPS', q: 'Dachdecker in meiner Nähe', region: 'IHRE REGION', now: 'SUCHT JETZT',
    items: ['ANZEIGEN', 'TEXTE', 'ZIELGRUPPEN', 'OPTIMIERUNG'], you: 'SIE KÜMMERN SICH UM IHREN BETRIEB.',
    rep: 'MONATSREPORT', rows: ['Ausgegeben', 'Gesehen', 'Angefragt'], sample: 'Beispielreport · Muster', trans: 'TRANSPARENTE ZAHLEN', trans2: 'STATT LEERER VERSPRECHEN.',
    back: 'GELD ZURÜCK', backS: 'Betreuungspauschale + Werbebudget des Monats', t1: 'MONATLICH KÜNDBAR', t2: 'PERSÖNLICHE BETREUUNG',
    e1: 'REGION & GEWERK', e2: 'KOSTENLOS PRÜFEN.', btn: 'Kostenlose Erstberatung anfragen', url: 'bau-kunden.app', tag: 'EHRLICHES MARKETING FÜR MACHER',
    hl: ['google', 'sichtbar', 'zeit', 'maps', 'jetzt', 'region', 'betrieb', 'transparente', 'angefragt', 'zurück', '100', 'kostenlos', 'macher']},
  en: {pain: ['Great work. Hardly visible on Google.', 'Referrals don\'t come every month.', 'No time for your own campaigns.'],
    g1: 'GOOGLE SEARCH', g2: 'GOOGLE MAPS', q: 'Roofer near me', region: 'YOUR REGION', now: 'SEARCHING NOW',
    items: ['ADS', 'COPY', 'TARGETING', 'OPTIMISATION'], you: 'YOU FOCUS ON YOUR BUSINESS.',
    rep: 'MONTHLY REPORT', rows: ['Spent', 'Seen', 'Inquired'], sample: 'Sample report · illustration', trans: 'TRANSPARENT NUMBERS', trans2: 'INSTEAD OF EMPTY PROMISES.',
    back: 'MONEY BACK', backS: 'Management fee + that month\'s ad spend', t1: 'CANCEL MONTHLY', t2: 'PERSONAL SUPPORT',
    e1: 'CHECK YOUR REGION', e2: 'AND TRADE FOR FREE.', btn: 'Book your free consultation', url: 'bau-kunden.app', tag: 'HONEST MARKETING FOR DOERS',
    hl: ['google', 'visible', 'time', 'maps', 'now', 'region', 'business', 'transparent', 'inquired', 'back', '100', 'free', 'doers']},
};
type T = typeof TX.de;
const norm = (w: string) => w.toLowerCase().replace(/[^a-zäöüß0-9%]/g, '');

// ---------- kinetic word stack: each word slams in at its spoken time ----------
// rows are built greedily so the stack fills the width; words of the current line slam, older ones settle
// how a word enters; each scene uses a different one so the motion never repeats itself
type Mode = 'slam' | 'rise' | 'type' | 'drop' | 'slide' | 'stretch' | 'flip' | 'blur';
const Stack: React.FC<{line: Line; g0: number; t: T; color: string; size?: number; maxW?: number; align?: 'center' | 'left'; mode?: Mode}> = ({line, g0, t, color, size = 190, maxW = 960, align = 'center', mode = 'rise'}) => {
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
  let n = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 0}}>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', gap: size * 0.22, lineHeight: 0.92}}>
          {r.map((w, i) => {
            const idx = n++;
            const d = Math.round(w.s * KFPS) - g0 - 3;
            const txt = w.w.toUpperCase();
            const red = t.hl.some((h) => norm(w.w).startsWith(h));
            const base: React.CSSProperties = {fontFamily: HEAD, fontSize: size, color: red ? C.red : color, display: 'inline-block', letterSpacing: 1, whiteSpace: 'pre'};
            if (f < d) return <span key={i} style={{...base, opacity: 0}}>{txt}</span>;
            const sp = (damping: number, stiffness: number) => spring({frame: f - d, fps: KFPS, config: {damping, stiffness, mass: 0.6}});
            // red keywords always get a punch on top of the scene's mode
            const punch = red ? 1 + 0.18 * Math.max(0, 1 - (f - d - 6) / 10) * (f - d > 6 ? 1 : 0) : 1;
            if (mode === 'slam') {
              const k = sp(13, 320); const bl = (1 - k) * 18;
              return <span key={i} style={{...base, transform: `scale(${(1 + (1 - k) * 1.4) * punch})`, opacity: Math.min(1, k * 3), filter: bl > 0.5 ? `blur(${bl}px)` : undefined}}>{txt}</span>;
            }
            if (mode === 'rise') {
              const k = interpolate(f - d, [0, 12], [0, 1], {...cl, easing: out});
              return <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingTop: size * 0.06}}><span style={{...base, transform: `translateY(${(1 - k) * 105}%) scale(${punch})`}}>{txt}</span></span>;
            }
            if (mode === 'type') {
              const chars = Math.ceil(interpolate(f - d, [0, Math.max(6, (w.e - w.s) * KFPS * 0.8)], [0, txt.length], cl));
              return <span key={i} style={{...base, transform: `scale(${punch})`}}>{txt.slice(0, chars)}<span style={{opacity: 0}}>{txt.slice(chars)}</span></span>;
            }
            if (mode === 'drop') {
              return <span key={i} style={{...base, transform: `scale(${punch})`}}>{txt.split('').map((c, ci) => {
                const k = spring({frame: f - d - ci * 2, fps: KFPS, config: {damping: 10, stiffness: 260, mass: 0.6}});
                return <span key={ci} style={{display: 'inline-block', transform: `translateY(${(1 - k) * -size * 1.2}px) rotate(${(1 - k) * (ci % 2 ? 25 : -25)}deg)`, opacity: f - d - ci * 2 < 0 ? 0 : 1}}>{c}</span>;
              })}</span>;
            }
            if (mode === 'slide') {
              const k = interpolate(f - d, [0, 11], [0, 1], {...cl, easing: out}); const side = idx % 2 ? 1 : -1;
              return <span key={i} style={{...base, transform: `translateX(${(1 - k) * side * 600}px) skewX(${(1 - k) * side * -20}deg) scale(${punch})`, opacity: k, filter: k < 0.9 ? `blur(${(1 - k) * 16}px)` : undefined}}>{txt}</span>;
            }
            if (mode === 'stretch') {
              const k = sp(9, 240);
              return <span key={i} style={{...base, transformOrigin: '50% 100%', transform: `scaleY(${k * punch}) scaleX(${0.7 + 0.3 * Math.min(1, k)})`}}>{txt}</span>;
            }
            if (mode === 'flip') {
              const k = sp(12, 200);
              return <span key={i} style={{...base, transform: `perspective(800px) rotateX(${(1 - k) * 95}deg) scale(${punch})`, transformOrigin: '50% 100%', opacity: Math.min(1, k * 2)}}>{txt}</span>;
            }
            // blur: sharpens from a wide, soft, letter-spaced ghost
            const k = interpolate(f - d, [0, 16], [0, 1], {...cl, easing: out});
            return <span key={i} style={{...base, letterSpacing: 1 + (1 - k) * 40, opacity: k, filter: k < 0.95 ? `blur(${(1 - k) * 22}px)` : undefined, transform: `scale(${punch})`}}>{txt}</span>;
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
// frame (relative to the line start) of the first word that starts with `p`, else a fraction of the line
const findW = (line: Line, g0: number, p: string, frac = 0.5) => {
  const w = line.words.find((x) => norm(x.w).startsWith(p)) ?? line.words[Math.floor(line.words.length * frac)];
  return Math.round(w.s * KFPS) - g0;
};
const S: Record<string, {dark: boolean; C: React.FC<SP>}> = {
  // hook: the site's own question, slammed in
  l1: {dark: true, C: ({line, g0, t}) => (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60}}>
      <Stack line={line} g0={g0} t={t} color={C.cream} size={200} mode="slam" />
    </AbsoluteFill>)},
  // the three pain points from the site, numbered 01–03 like the site
  l2: {dark: false, C: ({line, g0, t}) => {
    const at = [0, findW(line, g0, t.pain[1].split(' ')[0].toLowerCase(), 0.05), findW(line, g0, line.words[Math.ceil(line.words.length / 2)].w.toLowerCase().replace(/[^a-zäöüß]/g, ''), 0.55)];
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22}}>
        {t.pain.map((p, i) => (
          <Pop key={i} d={at[i] + (i === 0 ? 4 : 0)} from={i % 2 ? 'right' : 'left'}><Box style={{width: 1000, padding: '34px 40px', display: 'flex', gap: 30, alignItems: 'center', borderLeft: `12px solid ${i === 0 ? C.ink : C.red}`}}>
            <div style={{fontFamily: HEAD, fontSize: 110, color: C.red, lineHeight: 1}}>0{i + 1}</div>
            <div style={{fontFamily: HEAD, fontSize: 76, color: C.ink, lineHeight: 0.98}}>{p.toUpperCase()}</div></Box></Pop>
        ))}
      </AbsoluteFill>);
  }},
  // solution: logo + Google Search / Maps
  l3: {dark: false, C: ({line, g0, t, W}) => (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
      <Pop d={0} from="scale"><Logo size={150} /></Pop>
      <div style={{marginTop: 50}}><Stack line={{...line, words: line.words.slice(1)}} g0={g0} t={t} color={C.ink} size={120} maxW={940} mode="stretch" /></div>
      <div style={{display: 'flex', gap: 24, marginTop: 50}}>
        {[t.g1, t.g2].map((g, i) => (
          <Pop key={i} d={W(Math.round(line.words.length * 0.55)) + i * 14} from={i === 0 ? 'left' : 'right'}><Box style={{width: 488, padding: '30px 32px', borderTop: `8px solid ${C.red}`}}>
            {i === 0 ? <Search size={56} color={C.red} /> : <MapPin size={56} color={C.red} />}
            <div style={{fontFamily: HEAD, fontSize: 84, color: C.ink, marginTop: 12}}>{g}</div></Box></Pop>
        ))}
      </div>
    </AbsoluteFill>)},
  // the right people, right now: search bar typing + pulsing region pin
  l4: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const n = Math.floor(interpolate(f, [10, 50], [0, t.q.length], cl));
    const ring = (f % 50) / 50;
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
        <Stack line={line} g0={g0} t={t} color={C.cream} size={120} maxW={980} mode="slide" />
        <div style={{position: 'relative', marginTop: 60, width: 1000, height: 380}}>
          <Pop d={4} style={{position: 'absolute', left: 0, right: 0, top: 0}}><Box dark style={{display: 'flex', alignItems: 'center', gap: 22, padding: '28px 32px'}}>
            <Search size={50} color={C.cream} /><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 52, color: C.cream}}>{t.q.slice(0, n)}<span style={{color: C.red, opacity: Math.floor(f / 12) % 2}}>|</span></div></Box></Pop>
          <Pop d={56} from="scale" style={{position: 'absolute', left: 400, top: 170}}><div style={{position: 'relative', width: 200, height: 200}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${C.red}`, transform: `scale(${0.4 + ring})`, opacity: 1 - ring}} />
            <MapPin size={120} color={C.red} strokeWidth={2.5} style={{position: 'absolute', left: 40, top: 30}} /></div></Pop>
          <Pop d={70}><div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: HEAD, fontSize: 56, letterSpacing: 4, color: '#b8ab9d'}}>{t.region} · {t.now}</div></Pop>
        </div>
      </AbsoluteFill>);
  }},
  // we handle 01–04 (slot roll, one per spoken word), then "you focus on your business"
  l5: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const at = t.items.map((it, i) => findW(line, g0, it.toLowerCase().slice(0, 4), 0.1 + i * 0.12));
    const youAt = findW(line, g0, t.you === 'SIE KÜMMERN SICH UM IHREN BETRIEB.' ? 'sie' : 'you', 0.7);
    let cur = -1; at.forEach((a, i) => { if (f >= a - 3) cur = i; });
    const k = cur >= 0 ? spring({frame: f - at[cur] + 3, fps: KFPS, config: {damping: 12, stiffness: 320, mass: 0.6}}) : 0;
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {f < youAt - 4 ? (cur >= 0 && <div style={{textAlign: 'center', overflow: 'hidden', height: 380}}><div style={{transform: `translateY(${(1 - k) * 100}%)`, filter: k < 0.9 ? `blur(${(1 - k) * 10}px)` : undefined}}>
          <div style={{fontFamily: HEAD, fontSize: 120, color: C.red}}>0{cur + 1}</div>
          <div style={{fontFamily: HEAD, fontSize: 220, color: C.cream, lineHeight: 0.9}}>{t.items[cur]}</div></div></div>) : (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
            {t.items.map((it, i) => <Pop key={i} d={youAt - 4 + i * 3} from="left"><div style={{display: 'flex', alignItems: 'center', gap: 22, width: 820}}>
              <div style={{fontFamily: HEAD, fontSize: 64, color: C.red, width: 90}}>0{i + 1}</div>
              <div style={{flex: 1, fontFamily: HEAD, fontSize: 104, color: C.cream, lineHeight: 1}}>{it}</div><Check size={64} color={C.red} strokeWidth={3.5} /></div></Pop>)}
            <Pop d={youAt + 12} from="scale" style={{marginTop: 40}}><div style={{fontFamily: HEAD, fontSize: 96, color: C.red, textAlign: 'center', maxWidth: 980, lineHeight: 0.95}}>{t.you}</div></Pop>
          </div>)}
      </AbsoluteFill>);
  }},
  // monthly report (site's sample-report idea) + "transparent numbers instead of empty promises"
  l6: {dark: false, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const ws = t.rows.map((r, i) => findW(line, g0, r.toLowerCase().slice(0, 5), 0.25 + i * 0.1));
    const tr = findW(line, g0, t.trans.toLowerCase().slice(0, 6), 0.65);
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
        <Pop d={4} style={{width: 1000}}><Box style={{padding: '30px 36px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div style={{fontFamily: HEAD, fontSize: 86, color: C.ink}}>{t.rep}</div><BarChart3 size={56} color={C.red} /></div>
          <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: C.mute, marginBottom: 26}}>{t.sample}</div>
          {t.rows.map((r, i) => {
            const k = interpolate(f - ws[i], [0, 20], [0, 1], {...cl, easing: out});
            return <div key={i} style={{marginBottom: 26}}>
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 50, color: k > 0 ? C.ink : C.line}}>{r}</div>
              <div style={{height: 22, background: '#efe7dc', marginTop: 10}}><div style={{height: '100%', width: `${k * [70, 92, 48][i]}%`, background: i === 2 ? C.red : C.ink}} /></div>
            </div>;
          })}
        </Box></Pop>
        <div style={{marginTop: 50, textAlign: 'center'}}>
          <Pop d={tr} from="scale"><div style={{fontFamily: HEAD, fontSize: 120, color: C.red, lineHeight: 0.92}}>{t.trans}</div></Pop>
          <Pop d={tr + 12}><div style={{fontFamily: HEAD, fontSize: 84, color: C.ink, lineHeight: 0.95}}>{t.trans2}</div></Pop>
        </div>
      </AbsoluteFill>);
  }},
  // guarantee: dark 100 % block as on the site
  l7: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const cut = line.words.findIndex((w) => w.w.startsWith('100'));
    const hit = Math.round(line.words[Math.max(0, cut)].s * KFPS) - g0;
    const v = Math.round(interpolate(f - hit, [0, 26], [0, 100], {...cl, easing: out}));
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
        <Stack line={{...line, words: line.words.slice(0, Math.max(1, cut))}} g0={g0} t={t} color={C.cream} size={104} maxW={980} mode="blur" />
        <div style={{textAlign: 'center', marginTop: 40, opacity: f >= hit ? 1 : 0}}>
          <div style={{fontFamily: HEAD, fontSize: 400, color: C.red, lineHeight: 0.9}}>{v} %</div>
          <Pop d={hit + 20} from="scale"><div style={{fontFamily: HEAD, fontSize: 180, color: C.cream, lineHeight: 0.9}}>{t.back}</div></Pop>
          <Pop d={hit + 34}><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, color: '#b8ab9d', marginTop: 20}}>{t.backS}</div></Pop>
        </div>
      </AbsoluteFill>);
  }},
  l8: {dark: false, C: ({line, t}) => {
    const half = Math.ceil(line.words.length / 2);
    return (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30}}>
        {[t.t1, t.t2].map((x, i) => (
          <Pop key={i} d={Math.round((line.words[i === 0 ? 0 : half].s - line.start) * KFPS) + 14} from={i === 0 ? 'left' : 'right'}>
            <Box style={{width: 1000, padding: '40px 44px', display: 'flex', alignItems: 'center', gap: 30, borderLeft: `14px solid ${C.red}`}}>
              <Check size={90} color={C.red} strokeWidth={3.5} /><div style={{fontFamily: HEAD, fontSize: 116, color: C.ink, lineHeight: 0.95}}>{x}</div></Box></Pop>
        ))}
      </AbsoluteFill>);
  }},
  l9: {dark: true, C: ({t, line, g0}) => {
    const f = useCurrentFrame();
    const brand = findW(line, g0, 'bau', 0.55);
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
        <Pop d={0} from="scale"><div style={{fontFamily: HEAD, fontSize: 150, color: C.cream, lineHeight: 0.9, textAlign: 'center'}}>{t.e1}</div></Pop>
        <Pop d={8} from="scale"><div style={{fontFamily: HEAD, fontSize: 150, color: C.red, lineHeight: 0.9, textAlign: 'center'}}>{t.e2}</div></Pop>
        <Pop d={18} style={{marginTop: 50}}><div style={{background: C.red, color: '#fff', fontFamily: BODY, fontWeight: 700, fontSize: 50, padding: '32px 52px', display: 'flex', alignItems: 'center', gap: 16,
          transform: `scale(${1 + 0.03 * Math.sin(f / 9)})`}}>{t.btn} <ArrowUpRight size={48} /></div></Pop>
        <Pop d={brand} from="scale" style={{marginTop: 80}}><Logo size={120} dark /></Pop>
        <Pop d={brand + 14}><div style={{fontFamily: HEAD, fontSize: 64, letterSpacing: 4, color: C.cream, marginTop: 24}}>{t.tag}</div></Pop>
        <Pop d={brand + 24}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, letterSpacing: 3, color: '#b8ab9d', marginTop: 20}}>{t.url}</div></Pop>
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
