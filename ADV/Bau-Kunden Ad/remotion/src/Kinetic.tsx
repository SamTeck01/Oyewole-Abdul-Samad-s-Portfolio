// Bau-Kunden kinetic reel (v4): the look of bau-kunden.app (Bebas Neue caps, dark ink + cream sections, sharp cards,
// red 01/02/03 numbering) with high-energy kinetic type: every spoken word slams in on its timestamp, hard beat cuts,
// whip blurs, camera shake on hits, UI moments from the reference (search, rank, stamps, report, 100 % block).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/bebas-neue';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import {MapPin, Check, ArrowUpRight, BarChart3, Phone, Mail, MessageCircle, FileText} from 'lucide-react';
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
  de: {days: ['MO', 'DI', 'MI', 'DO', 'FR'], week: 'KW 43 · IHR KALENDER', jobs: ['Dachreparatur', 'Badsanierung', 'Elektrik', 'Fassade', 'Gartenpflege', 'Heizung', 'Fenster', 'Umzug'],
    t1: '08:00 · Dachreparatur', t2: '10:00 · Badsanierung', call: 'Eingehender Anruf', callS: 'Neue Anfrage aus Ihrer Region',
    no: ['FLAUTE', 'WARTEN AUF EMPFEHLUNGEN'], kein: ['KEINE', 'KEIN'],
    notes: [['Anruf', 'Dachdecker gesucht · 3 km'], ['E-Mail', 'Angebot Badsanierung · 5 km'], ['Profil', 'Elektriker gesucht · 2 km'], ['Formular', 'Gartenpflege · 7 km']], region: 'IHRE REGION',
    care: ['Anzeigen', 'Texte', 'Zielgruppen', 'Optimierung', 'Auswertung'], best: 'SIE MACHEN, WAS SIE AM BESTEN KÖNNEN.',
    rep: 'MONATSREPORT', sample: 'Beispielreport · Muster', rows: ['Anrufe', 'E-Mails', 'Profil-Nachrichten', 'Formularanfragen'], total: 'NACHVOLLZIEHBARE ANFRAGEN',
    back: 'GELD ZURÜCK', backS: 'Betreuungspauschale + Werbebudget des Monats', c1: 'MONATLICH KÜNDBAR', c2: 'OHNE RISIKO',
    e1: 'WIR FÜLLEN IHREN', e2: 'TERMINKALENDER.', btn: 'Region & Gewerk kostenlos prüfen', url: 'bau-kunden.app',
    hl: ['voll', 'telefon', 'klingelt', 'region', 'brauchen', 'kalender', 'füllt', 'besten', 'anfragen', 'zurück', 'komplett', 'risiko', 'terminkalender', 'kostenlos']},
  en: {days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], week: 'WEEK 43 · YOUR CALENDAR', jobs: ['Roof repair', 'Bathroom', 'Electrics', 'Facade', 'Garden care', 'Heating', 'Windows', 'Removal'],
    t1: '08:00 · Roof repair', t2: '10:00 · Bathroom renovation', call: 'Incoming call', callS: 'New inquiry from your region',
    no: ['SLOW WEEKS', 'WAITING FOR REFERRALS'], kein: ['NO', 'NO'],
    notes: [['Call', 'Roofer needed · 3 km'], ['Email', 'Bathroom quote · 5 km'], ['Profile', 'Electrician needed · 2 km'], ['Form', 'Garden care · 7 km']], region: 'YOUR REGION',
    care: ['Ads', 'Copy', 'Targeting', 'Optimisation', 'Reporting'], best: 'YOU DO WHAT YOU DO BEST.',
    rep: 'MONTHLY REPORT', sample: 'Sample report · illustration', rows: ['Calls', 'Emails', 'Profile messages', 'Form inquiries'], total: 'TRACEABLE INQUIRIES',
    back: 'MONEY BACK', backS: 'Management fee + that month\'s ad spend', c1: 'CANCEL MONTHLY', c2: 'NO RISK',
    e1: 'WE FILL YOUR', e2: 'CALENDAR.', btn: 'Check your region & trade for free', url: 'bau-kunden.app',
    hl: ['full', 'phone', 'ringing', 'region', 'need', 'calendar', 'fills', 'best', 'inquiries', 'back', 'cent', 'risk', 'free']},
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
const findW = (line: Line, g0: number, p: string, frac = 0.5) => {
  const w = line.words.find((x) => norm(x.w).startsWith(p)) ?? line.words[Math.floor(line.words.length * frac)];
  return Math.round(w.s * KFPS) - g0;
};
// week calendar: 5 days x 8 slots; `fillAt` = frame where filling starts, blocks drop in one after another
const SLOTS: [number, number, number][] = []; // [day, slot, job]
for (let d = 0; d < 5; d++) for (let s = 0; s < 8; s++) if ((d * 7 + s * 3) % 10 !== 9) SLOTS.push([d, s, (d * 3 + s * 5) % 8]);
const ORDER = SLOTS.map((_, i) => i).sort((a, b) => ((a * 37) % 41) - ((b * 37) % 41));
const Week: React.FC<{t: T; fillAt: number; per?: number; dark?: boolean; w?: number}> = ({t, fillAt, per = 1.4, dark, w = 1000}) => {
  const f = useCurrentFrame();
  const colW = (w - 90) / 5, rowH = 112;
  const filled = ORDER.filter((_, k) => f >= fillAt + k * per).length;
  return (
    <Box dark={dark} style={{width: w, padding: '24px 24px 20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
        <div style={{fontFamily: HEAD, fontSize: 52, color: dark ? C.cream : C.ink}}>{t.week}</div>
        <div style={{fontFamily: HEAD, fontSize: 52, color: C.red}}>{Math.round((filled / SLOTS.length) * 100)} %</div>
      </div>
      <div style={{display: 'flex', marginLeft: 66}}>{t.days.map((d) => <div key={d} style={{width: colW, textAlign: 'center', fontFamily: HEAD, fontSize: 40, color: dark ? '#b8ab9d' : C.mute}}>{d}</div>)}</div>
      <div style={{position: 'relative', height: rowH * 8, marginTop: 6}}>
        {[...Array(8)].map((_, s) => <div key={s} style={{position: 'absolute', left: 0, right: 0, top: s * rowH, height: rowH, borderTop: `2px solid ${dark ? C.inkLine : C.line}`}}>
          <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 22, color: dark ? '#8f8376' : C.mute, marginTop: 6}}>{String(8 + s).padStart(2, '0')}:00</div></div>)}
        {ORDER.map((idx, k) => {
          const [d, s, j] = SLOTS[idx]; const at = fillAt + k * per;
          if (f < at) return null;
          const p = spring({frame: f - at, fps: KFPS, config: {damping: 12, stiffness: 300, mass: 0.5}});
          return <div key={idx} style={{position: 'absolute', left: 66 + d * colW + 4, top: s * rowH + 6, width: colW - 8, height: rowH - 12, background: j % 3 === 0 ? C.red : dark ? '#f6f1ea' : C.ink,
            color: j % 3 === 0 ? '#fff' : dark ? C.ink : C.cream, transform: `scale(${p}) translateY(${(1 - p) * -40}px)`, padding: '8px 10px', fontFamily: BODY, fontWeight: 700, fontSize: 20, lineHeight: 1.1, overflow: 'hidden'}}>{t.jobs[j]}</div>;
        })}
      </div>
    </Box>
  );
};
const S: Record<string, {dark: boolean; C: React.FC<SP>}> = {
  // the dream: "Monday morning. Your calendar is full!" – the week fills up on "voll"
  l1: {dark: false, C: ({line, g0, t}) => {
    const full = findW(line, g0, t.hl[0], 0.8);
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <Stack line={line} g0={g0} t={t} color={C.ink} size={120} maxW={980} mode="slam" />
        <Pop d={4}><Week t={t} fillAt={full - 6} per={0.9} /></Pop>
      </AbsoluteFill>);
  }},
  // appointments land, phone rings
  l2: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const a1 = findW(line, g0, 'acht', 0.15), a2 = findW(line, g0, 'zehn', 0.4), ph = findW(line, g0, t.hl[1], 0.7);
    const en = t.days[0] === 'MON'; const b1 = en ? findW(line, g0, 'eight', 0.15) : a1, b2 = en ? findW(line, g0, 'ten', 0.4) : a2;
    const ring = f > ph ? Math.sin((f - ph) * 1.6) * 10 * Math.max(0, 1 - (f - ph) / 80) : 0;
    const card = (d: number, text: string, red: boolean) => <Pop d={d} from="right"><div style={{width: 1000, background: red ? C.red : C.cream, color: red ? '#fff' : C.ink, padding: '30px 36px', fontFamily: HEAD, fontSize: 92, lineHeight: 1, borderLeft: `16px solid ${red ? C.ink : C.red}`}}>{text}</div></Pop>;
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 24}}>
        {card(b1 - 4, t.t1, false)}
        {card(b2 - 4, t.t2, true)}
        <Pop d={ph - 4} from="scale" style={{marginTop: 40}}><Box dark style={{width: 1000, padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{width: 120, height: 120, borderRadius: 60, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${ring}deg)`}}><Phone size={64} color="#fff" /></div>
          <div><div style={{fontFamily: HEAD, fontSize: 80, color: C.cream, lineHeight: 1}}>{t.call}</div><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 36, color: '#b8ab9d'}}>{t.callS}</div></div></Box></Pop>
      </AbsoluteFill>);
  }},
  // no slow weeks, no waiting: words get struck through in red
  l3: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const half = Math.ceil(line.words.length / 3);
    const at = [Math.round(line.words[0].s * KFPS) - g0, Math.round(line.words[Math.min(line.words.length - 1, half)].s * KFPS) - g0];
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40}}>
        {t.no.map((n, i) => {
          const k = interpolate(f - at[i] - 14, [0, 12], [0, 1], {...cl, easing: out});
          return <Pop key={i} d={at[i] - 3} from={i ? 'right' : 'left'}><div style={{position: 'relative', textAlign: 'center'}}>
            <div style={{fontFamily: HEAD, fontSize: 70, color: C.red, letterSpacing: 6}}>{t.kein[i]}</div>
            <div style={{fontFamily: HEAD, fontSize: i ? 120 : 220, color: C.cream, lineHeight: 0.9, opacity: 1 - 0.45 * k, maxWidth: 1000}}>{n}</div>
            <div style={{position: 'absolute', left: -20, right: -20, top: '62%', height: 18, background: C.red, transform: `scaleX(${k}) rotate(-3deg)`, transformOrigin: '0 50%'}} /></div></Pop>;
        })}
      </AbsoluteFill>);
  }},
  // people in your region find you: inquiries arrive one by one around a region pin
  l4: {dark: false, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const ring = (f % 50) / 50;
    const icons = [Phone, Mail, MessageCircle, FileText];
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 30}}>
        <Stack line={line} g0={g0} t={t} color={C.ink} size={100} maxW={980} mode="rise" />
        <div style={{position: 'relative', width: 200, height: 200, margin: '40px 0 20px'}}>
          {[0, 0.5].map((o) => { const r = (ring + o) % 1; return <div key={o} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `5px solid ${C.red}`, transform: `scale(${0.5 + r * 1.4})`, opacity: 1 - r}} />; })}
          <MapPin size={130} color={C.red} strokeWidth={2.5} style={{position: 'absolute', left: 35, top: 25}} />
        </div>
        {t.notes.map(([k, v], i) => { const I = icons[i]; return (
          <Pop key={i} d={20 + i * 22} from={i % 2 ? 'right' : 'left'} style={{marginTop: 14}}><Box style={{width: 980, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 22}}>
            <div style={{width: 74, height: 74, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><I size={40} color="#fff" /></div>
            <div style={{flex: 1}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: C.red}}>{k.toUpperCase()}</div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 42, color: C.ink}}>{v}</div></div></Box></Pop>); })}
      </AbsoluteFill>);
  }},
  // we take care of everything → you do what you do best
  l5: {dark: true, C: ({line, g0, t}) => {
    const best = findW(line, g0, t.days[0] === 'MON' ? 'you' : 'sie', 0.55);
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 16}}>
        <Stack line={{...line, words: line.words.slice(0, Math.max(3, line.words.findIndex((w) => Math.round(w.s * KFPS) - g0 >= best)))}} g0={g0} t={t} color={C.cream} size={110} maxW={980} mode="flip" />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', width: 1000, margin: '30px 0'}}>
          {t.care.map((c, i) => <Pop key={i} d={16 + i * 6} from="scale"><div style={{border: `3px solid ${C.inkLine}`, background: '#2b221b', padding: '14px 26px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: HEAD, fontSize: 56, color: C.cream}}><Check size={40} color={C.red} strokeWidth={3.5} />{c.toUpperCase()}</div></Pop>)}
        </div>
        <Pop d={best} from="scale"><div style={{fontFamily: HEAD, fontSize: 120, color: C.red, textAlign: 'center', maxWidth: 1000, lineHeight: 0.92}}>{t.best}</div></Pop>
      </AbsoluteFill>);
  }},
  // monthly report with the site's inquiry channels
  l6: {dark: false, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const vals = [9, 6, 4, 4];
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 30}}>
        <Stack line={line} g0={g0} t={t} color={C.ink} size={96} maxW={980} mode="type" />
        <Pop d={10} style={{width: 1000, marginTop: 40}}><Box style={{padding: '30px 36px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div style={{fontFamily: HEAD, fontSize: 80, color: C.ink}}>{t.rep}</div><BarChart3 size={54} color={C.red} /></div>
          <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: C.mute, marginBottom: 20}}>{t.sample}</div>
          {t.rows.map((r, i) => { const k = interpolate(f - 30 - i * 12, [0, 22], [0, 1], {...cl, easing: out}); return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16}}>
              <div style={{width: 380, fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.ink}}>{r}</div>
              <div style={{flex: 1, height: 26, background: '#efe7dc'}}><div style={{height: '100%', width: `${k * vals[i] * 10}%`, background: i === 0 ? C.red : C.ink}} /></div>
              <div style={{width: 50, textAlign: 'right', fontFamily: HEAD, fontSize: 52, color: C.ink}}>{Math.round(k * vals[i])}</div></div>); })}
          <div style={{borderTop: `3px solid ${C.ink}`, marginTop: 14, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontFamily: HEAD, fontSize: 60}}>
            <span style={{color: C.ink}}>{t.total}</span><span style={{color: C.red}}>{Math.round(interpolate(f - 30, [0, 70], [0, 23], cl))}</span></div>
        </Box></Pop>
      </AbsoluteFill>);
  }},
  l7: {dark: true, C: ({line, g0, t}) => {
    const f = useCurrentFrame();
    const cut = Math.max(2, line.words.findIndex((w) => /^(dann|you)$/i.test(norm(w.w))));
    const hit = Math.round(line.words[Math.min(cut, line.words.length - 1)].s * KFPS) - g0;
    const v = Math.round(interpolate(f - hit, [0, 26], [0, 100], {...cl, easing: out}));
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
        <Stack line={{...line, words: line.words.slice(0, cut)}} g0={g0} t={t} color={C.cream} size={104} maxW={980} mode="blur" />
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
        {[t.c1, t.c2].map((x, i) => (
          <Pop key={i} d={Math.round((line.words[i === 0 ? 0 : half].s - line.start) * KFPS) + 10} from={i === 0 ? 'left' : 'right'}>
            <Box style={{width: 1000, padding: '44px 44px', display: 'flex', alignItems: 'center', gap: 30, borderLeft: `14px solid ${C.red}`}}>
              <Check size={100} color={C.red} strokeWidth={3.5} /><div style={{fontFamily: HEAD, fontSize: 130, color: C.ink, lineHeight: 0.95}}>{x}</div></Box></Pop>
        ))}
      </AbsoluteFill>);
  }},
  // end: the full calendar again + promise + CTA
  l9: {dark: true, C: ({t}) => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 20}}>
        <Pop d={0} from="scale"><Logo size={110} dark /></Pop>
        <Pop d={6} from="scale" style={{marginTop: 30}}><div style={{fontFamily: HEAD, fontSize: 140, color: C.cream, lineHeight: 0.9, textAlign: 'center'}}>{t.e1}</div></Pop>
        <Pop d={12} from="scale"><div style={{fontFamily: HEAD, fontSize: 170, color: C.red, lineHeight: 0.9, textAlign: 'center'}}>{t.e2}</div></Pop>
        <div style={{transform: 'scale(0.62)', margin: '-170px 0 -170px'}}><Week t={t} fillAt={10} per={0.5} dark w={1000} /></div>
        <Pop d={30}><div style={{background: C.red, color: '#fff', fontFamily: BODY, fontWeight: 700, fontSize: 46, padding: '30px 48px', display: 'flex', alignItems: 'center', gap: 16,
          transform: `scale(${1 + 0.03 * Math.sin(f / 9)})`}}>{t.btn} <ArrowUpRight size={46} /></div></Pop>
        <Pop d={40}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, letterSpacing: 3, color: '#b8ab9d', marginTop: 26}}>{t.url}</div></Pop>
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
