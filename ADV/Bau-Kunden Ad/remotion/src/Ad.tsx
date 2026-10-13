import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import '@fontsource/bebas-neue';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import {Search, MapPin, PenLine, Users, BarChart3, Phone, Mail, MessageSquare, Check} from 'lucide-react';
import cuesDe from './cues.json';
import cuesEn from './cues_en.json';

export const FPS = 60;
// Brand, taken from bau-kunden.app
const C = {bg: '#f6f1ea', ink: '#231b15', red: '#ee333e', mute: '#6f665e', line: '#ddd4c8', card: '#fffdf9'};
const HEAD = '"Bebas Neue", sans-serif';
const BODY = 'Barlow, sans-serif';
type Lang = 'de' | 'en';
const mk = (c: typeof cuesDe) => Object.fromEntries(c.lines.map((l) => [l.id, l])) as Record<string, {start: number; end: number}>;
const LS = {de: mk(cuesDe), en: mk(cuesEn as typeof cuesDe)};
const LangCtx = React.createContext<Lang>('de');
const useLang = () => React.useContext(LangCtx);
const useL = () => LS[useLang()];
const TX = {
  de: {h1a: 'IHR HANDWERK', h1b: 'IST GUT.', h1c: 'ABER FINDET MAN', h1d: 'SIE AUCH ONLINE?', q: 'Dachdecker in meiner Nähe',
    b1: 'IHR KOMPLETTES', b2: 'ONLINE-MARKETING.', tag: 'Für Handwerk & Dienstleistung', we: 'WIR ÜBERNEHMEN.',
    items: ['Google-Suche', 'Google Maps', 'Texte', 'Zielgruppen', 'Auswertung'],
    p1: 'Betreuung', p1s: 'pauschal, alles inklusive', p2: '+ Werbebudget', p2s: 'mindestens, für Ihre Anzeigen', mo: ' /MTL.', vat: 'Alle Preise zzgl. gesetzl. MwSt.', loc: 'de-DE',
    rep: 'IHR MONATSREPORT', rows: ['Ausgegeben', 'Gesehen', 'Angefragt'],
    g0: 'Keine nachvollziehbare Anfrage im Monat?', g1: 'GELD ZURÜCK.', g2: 'Betreuungspauschale und ausgegebenes Werbebudget',
    c1: 'VOLLE', c2: 'AUFTRAGSBÜCHER.', cta: 'KOSTENLOSE ERSTBERATUNG', c3: 'Monatlich kündbar · keine Mindestlaufzeit'},
  en: {h1a: 'YOUR CRAFT', h1b: 'IS GREAT.', h1c: 'BUT CAN CUSTOMERS', h1d: 'FIND YOU ONLINE?', q: 'Roofer near me',
    b1: 'YOUR ENTIRE', b2: 'ONLINE MARKETING.', tag: 'For trades & service businesses', we: 'WE HANDLE IT.',
    items: ['Google Search', 'Google Maps', 'Ad copy', 'Targeting', 'Reporting'],
    p1: 'Management', p1s: 'flat fee, all inclusive', p2: '+ Ad budget', p2s: 'minimum, for your ads', mo: ' /MO.', vat: 'All prices plus statutory VAT.', loc: 'en-GB',
    rep: 'YOUR MONTHLY REPORT', rows: ['Spent', 'Seen', 'Inquired'],
    g0: 'No traceable inquiry this month?', g1: 'MONEY BACK.', g2: 'Management fee and ad spend for that month',
    c1: 'FULL', c2: 'ORDER BOOKS.', cta: 'FREE CONSULTATION', c3: 'Cancel monthly · no minimum term'},
};
const useT = () => TX[useLang()];
const f = (s: number) => Math.round(s * FPS);

const useIn = (delay = 0, damping = 13) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: fr - f(delay), fps, config: {damping, mass: 0.6, stiffness: 140}});
};
// Snappy entrance: rises, scales up with a little overshoot, un-blurs
const Rise: React.FC<{d?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d = 0, y = 90, children, style}) => {
  const p = useIn(d);
  const o = Math.min(1, p * 1.6);
  return <div style={{opacity: o, transform: `translateY(${(1 - p) * y}px) scale(${0.86 + 0.14 * p})`, filter: `blur(${Math.max(0, (1 - o) * 8)}px)`, ...style}}>{children}</div>;
};

// Scene wrapper: pushes in from the right, pushes out to the left, slow camera drift in between
const Scene: React.FC<{len: number; children: React.ReactNode; dir?: number}> = ({len, children, dir = 1}) => {
  const fr = useCurrentFrame();
  const {width} = useVideoConfig();
  const e = Easing.bezier(0.7, 0, 0.2, 1);
  const xin = interpolate(fr, [0, 16], [width * 0.9 * dir, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
  const xout = interpolate(fr, [len - 16, len], [0, -width * 0.9 * dir], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
  const s = interpolate(fr, [0, len], [1.0, 1.07]);
  const r = interpolate(fr, [0, len], [-0.6, 0.6]) * dir;
  return <AbsoluteFill style={{transform: `translateX(${xin + xout}px) scale(${s}) rotate(${r}deg)`, alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>;
};

const Logo: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" fill={C.red} />
      <g fill="none" stroke="#f7f3ec" strokeWidth="7" strokeLinecap="square">
        <path d="M20 12 V52" /><path d="M20 12 H34 A10 10 0 0 1 34 32 H20" /><path d="M20 32 H36 A10 10 0 0 1 36 52 H20" />
      </g>
    </svg>
    <div style={{fontFamily: HEAD, fontSize: size * 0.95, lineHeight: 1, letterSpacing: 2, color: C.ink, paddingTop: size * 0.08}}>
      BAU-<span style={{color: C.red}}>KUNDEN</span>
    </div>
  </div>
);
const Tag: React.FC<{children: React.ReactNode; k: number}> = ({children, k}) => (
  <div style={{border: `2px solid ${C.red}`, color: C.red, fontFamily: BODY, fontWeight: 700, fontSize: 26 * k, letterSpacing: 2.5, padding: `${8 * k}px ${16 * k}px`, textTransform: 'uppercase'}}>{children}</div>
);

// 1 · Hook: a search for a trade, the business is not there
const S1: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const fr = useCurrentFrame();
  const q = T.q;
  const typed = q.slice(0, Math.max(0, Math.floor((fr - f(1.2)) / 2)));
  const lineB = f(L.l1.start + 1.55 - 0.5);
  return (
    <div style={{width: 900 * k, display: 'flex', flexDirection: 'column', gap: 34 * k}}>
      <Rise><div style={{fontFamily: HEAD, fontSize: 150 * k, lineHeight: 0.9, color: C.ink}}>{T.h1a}<br />{T.h1b}</div></Rise>
      <Rise d={lineB / FPS}><div style={{fontFamily: HEAD, fontSize: 112 * k, lineHeight: 0.92, color: C.red}}>{T.h1c}<br />{T.h1d}</div></Rise>
      <Rise d={0.6}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18 * k, background: C.card, border: `2px solid ${C.line}`, padding: `${22 * k}px ${28 * k}px`, boxShadow: '0 20px 50px rgba(35,27,21,.10)'}}>
          <Search size={40 * k} color={C.mute} />
          <div style={{fontFamily: BODY, fontSize: 38 * k, color: C.ink}}>{typed}<span style={{opacity: Math.floor(fr / 20) % 2 ? 0 : 1, color: C.red}}>|</span></div>
        </div>
      </Rise>
    </div>
  );
};

// 2 · Brand
const S2: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const p = useIn(0.1, 14);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46 * k}}>
      <div style={{transform: `scale(${0.85 + p * 0.15})`, opacity: p}}><Logo size={120 * k} /></div>
      <Rise d={0.9}><div style={{fontFamily: HEAD, fontSize: 92 * k, lineHeight: 0.95, color: C.ink, textAlign: 'center'}}>{T.b1}<br />{T.b2}</div></Rise>
      <Rise d={1.5}><Tag k={k}>{T.tag}</Tag></Rise>
    </div>
  );
};

// 3 · What's included
const S3: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const items =  [Search, MapPin, PenLine, Users, BarChart3].map((I, i) => [I, T.items[i]]);
  const step = (L.l3.end - L.l3.start - 0.6) / items.length;
  return (
    <div style={{width: 900 * k, display: 'flex', flexDirection: 'column', gap: 22 * k}}>
      <Rise><div style={{fontFamily: HEAD, fontSize: 110 * k, color: C.ink, lineHeight: 0.9, marginBottom: 14 * k}}>{T.we}</div></Rise>
      {(items as [any, string][]).map(([I, t], i) => (
        <Rise key={t} d={0.35 + i * step} y={30}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26 * k, background: C.card, borderLeft: `8px solid ${C.red}`, padding: `${20 * k}px ${28 * k}px`, boxShadow: '0 14px 40px rgba(35,27,21,.08)'}}>
            <I size={46 * k} color={C.red} strokeWidth={2.2} />
            <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 46 * k, color: C.ink, flex: 1}}>{t}</div>
            <Check size={40 * k} color={C.ink} />
          </div>
        </Rise>
      ))}
    </div>
  );
};

// 4 · Price
const S4: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const fr = useCurrentFrame();
  const n = Math.round(interpolate(fr, [f(0.2), f(1.4)], [0, 249], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const b = Math.round(interpolate(fr, [f(2.4), f(3.6)], [0, 1000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const row = (label: string, sub: string, v: string, d: number, big: boolean) => (
    <Rise d={d}>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `2px solid ${C.line}`, paddingBottom: 22 * k}}>
        <div style={{fontFamily: BODY, color: C.mute, fontSize: 34 * k, fontWeight: 600, lineHeight: 1.2}}>{label}<br /><span style={{fontWeight: 400, fontSize: 28 * k}}>{sub}</span></div>
        <div style={{fontFamily: HEAD, fontSize: (big ? 170 : 120) * k, lineHeight: 0.85, color: big ? C.red : C.ink}}>{v}<span style={{fontSize: 40 * k, color: C.mute}}>{T.mo}</span></div>
      </div>
    </Rise>
  );
  return (
    <div style={{width: 900 * k, display: 'flex', flexDirection: 'column', gap: 40 * k}}>
      {row(T.p1, T.p1s, `${n} €`, 0, true)}
      {row(T.p2, T.p2s, `${b.toLocaleString(T.loc)} €`, 2.2, false)}
      <Rise d={3.2}><div style={{fontFamily: BODY, fontSize: 28 * k, color: C.mute}}>{T.vat}</div></Rise>
    </div>
  );
};

// 5 · Monthly report (no invented numbers, just the three things it shows)
const S5: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const fr = useCurrentFrame();
  const rows: [string, number][] = [[T.rows[0], 0.62], [T.rows[1], 0.9], [T.rows[2], 0.45]];
  const step = (L.l5.end - L.l5.start) / 4.2;
  return (
    <Rise y={60}>
      <div style={{width: 880 * k, background: C.card, padding: 52 * k, boxShadow: '0 30px 80px rgba(35,27,21,.14)', border: `2px solid ${C.line}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 * k}}>
          <div style={{fontFamily: HEAD, fontSize: 84 * k, color: C.ink, lineHeight: 1}}>{T.rep}</div>
          <div style={{width: 22 * k, height: 22 * k, background: C.red}} />
        </div>
        {rows.map(([t, v], i) => {
          const d = f(0.9 + (i + 0.6) * step);
          const w = interpolate(fr, [d, d + 40], [0, v], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          return (
            <div key={t} style={{marginBottom: 34 * k, opacity: interpolate(fr, [d - 10, d + 6], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
              <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 40 * k, color: C.ink, marginBottom: 12 * k}}>{t}</div>
              <div style={{height: 26 * k, background: '#efe8de'}}><div style={{height: '100%', width: `${w * 100}%`, background: i === 2 ? C.red : C.ink}} /></div>
            </div>
          );
        })}
      </div>
    </Rise>
  );
};

// 6 · Guarantee
const S6: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const fr = useCurrentFrame();
  const hit = f(L.l6.end - L.l6.start - 1.9);
  const p = spring({frame: fr - hit, fps: FPS, config: {damping: 12, mass: 0.8}});
  const icons = [Phone, Mail, MessageSquare];
  return (
    <div style={{width: 900 * k, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 * k}}>
      <Rise><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 40 * k, color: C.mute, textAlign: 'center'}}>{T.g0}</div></Rise>
      <Rise d={0.5}><div style={{display: 'flex', gap: 30 * k}}>{icons.map((I, i) => (
        <div key={i} style={{width: 96 * k, height: 96 * k, border: `2px dashed ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><I size={42 * k} color={C.mute} /></div>
      ))}</div></Rise>
      <div style={{opacity: Math.min(1, p * 2), transform: `scale(${2.2 - 1.2 * p}) translate(${Math.sin(fr * 1.7) * 14 * Math.max(0, 1 - (fr - hit) / 20) * (fr > hit ? 1 : 0)}px, 0)`, fontFamily: HEAD, fontSize: 300 * k, lineHeight: 0.85, color: C.red, marginTop: 20 * k}}>100 %</div>
      <div style={{opacity: p, fontFamily: HEAD, fontSize: 110 * k, color: C.ink, lineHeight: 0.9}}>{T.g1}</div>
      <div style={{opacity: p, fontFamily: BODY, fontSize: 30 * k, color: C.mute, textAlign: 'center'}}>{T.g2}</div>
    </div>
  );
};

// 7 · CTA
const S7: React.FC<{k: number}> = ({k}) => {
  const L = useL(); const T = useT();
  const fr = useCurrentFrame();
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, fr - f(2)) / 14);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 * k}}>
      <Rise><Logo size={100 * k} /></Rise>
      <Rise d={0.3}><div style={{fontFamily: HEAD, fontSize: 120 * k, color: C.ink, lineHeight: 0.9, textAlign: 'center'}}>{T.c1}<br />{T.c2}</div></Rise>
      <Rise d={1.2}>
        <div style={{transform: `scale(${pulse})`, background: C.red, color: '#fff', fontFamily: BODY, fontWeight: 700, fontSize: 40 * k, letterSpacing: 3, padding: `${30 * k}px ${54 * k}px`}}>{T.cta}</div>
      </Rise>
      <Rise d={1.6}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 48 * k, color: C.ink}}>bau-kunden.app</div></Rise>
      <Rise d={0.4}><Tag k={k}>{T.c3}</Tag></Rise>
    </div>
  );
};

export const Ad: React.FC<{lang?: Lang}> = ({lang = 'de'}) => {
  const L = LS[lang];
  const {width, height, durationInFrames} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350) * (height / width > 1.5 ? 1.08 : 1);
  const ids = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'];
  const S = [S1, S2, S3, S4, S5, S6, S7];
  const starts = ids.map((id, i) => (i === 0 ? 0 : f(L[id].start - 0.3)));
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* subtle grid texture + red corner rule, like the site */}
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`, backgroundSize: '90px 90px', transform: `translateY(${-(fr * 0.25) % 90}px)`, height: height + 90}} />
      <AbsoluteFill style={{overflow: 'hidden', opacity: 0.07}}>
        {[0, 1, 2, 3, 4].map((r) => (
          <div key={r} style={{position: 'absolute', top: r * height / 4 - 60, left: ((fr * (r % 2 ? 2.2 : -2.2)) % 1400) - 1400, whiteSpace: 'nowrap', fontFamily: HEAD, fontSize: 260, color: 'transparent', WebkitTextStroke: `3px ${C.ink}`}}>
            BAU-KUNDEN · BAU-KUNDEN · BAU-KUNDEN · BAU-KUNDEN · BAU-KUNDEN
          </div>
        ))}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, background: C.red, width: `${(fr / durationInFrames) * 100}%`}} />
      {ids.map((id, i) => {
        const from = starts[i];
        const to = i < ids.length - 1 ? starts[i + 1] + 14 : durationInFrames;
        const Comp = S[i];
        return (
          <Sequence key={id} from={from} durationInFrames={to - from}>
            <LangCtx.Provider value={lang}><Scene len={to - from} dir={1}><Comp k={k} /></Scene></LangCtx.Provider>
          </Sequence>
        );
      })}
      {starts.slice(1).map((c, i) => {
        const x = interpolate(fr, [c - 4, c + 12], [1, -1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.7, 0, 0.3, 1)});
        if (x === 1 || x === -1.2) return null;
        return <div key={i} style={{position: 'absolute', top: -200, bottom: -200, width: width * 0.35, left: width * 0.5 + x * width, background: i % 2 ? C.ink : C.red, transform: 'skewX(-12deg)'}} />;
      })}
      <Audio src={staticFile(lang === 'en' ? 'mix_en.wav' : 'mix.wav')} />
    </AbsoluteFill>
  );
};
