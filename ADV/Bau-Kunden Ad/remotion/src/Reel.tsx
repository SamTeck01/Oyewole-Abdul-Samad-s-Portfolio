// Bau-Kunden reel in the style of Dave's reference (dark glass UI cards, karaoke captions, stamps),
// re-coloured to the Bau-Kunden brand (ink / cream / red, Bebas Neue + Barlow).
import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/bebas-neue';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import {Search, MapPin, PenLine, Users, BarChart3, Check, Star, Home, TrendingUp, MessageCircle, ArrowRight} from 'lucide-react';
import cuesDe from './reel_cues_de.json';
import cuesEn from './reel_cues_en.json';

export const RFPS = 60;
type Word = {w: string; s: number; e: number};
type Line = {id: string; start: number; end: number; words: Word[]};
type Cues = {total: number; lines: Line[]};
export const CUES: Record<'de' | 'en', Cues> = {de: cuesDe as Cues, en: cuesEn as Cues};

const C = {ink: '#231b15', ink2: '#15100c', cream: '#f6f1ea', red: '#ee333e', mute: '#9c9188', green: '#3fcf7f'};
const HEAD = '"Bebas Neue", sans-serif';
const BODY = 'Barlow, sans-serif';
const out = Easing.bezier(0.16, 1, 0.3, 1);

const TX = {
  de: {
    h1: ['WARUM HABEN GUTE', 'HANDWERKSBETRIEBE', 'TROTZDEM ', 'LEERE', ' AUFTRAGSBÜCHER?'], inq: 'Anfragen diesen Monat',
    q: 'Dachdecker in meiner Nähe', comp: [['Dachbau Schneider', '4,9'], ['Meister Dach GmbH', '4,8'], ['Bedachungen Kraus', '4,7']], ad: 'Anzeige',
    you: 'Dein Betrieb', page: 'Seite 3 · Platz 27', notFound: 'NICHT GEFUNDEN',
    jobs: [['Dachsanierung', '52.000 €'], ['Neubau EFH', '18.000 €'], ['Reparatur', '3.400 €']], toComp: 'an die Konkurrenz',
    items: ['Google-Suche', 'Google Maps', 'Texte', 'Zielgruppen', 'Auswertung'],
    fee: 'Betreuung', feeS: 'pauschal, alles inklusive', bud: '+ Werbebudget', budS: 'mindestens, für deine Anzeigen', mo: '/ Monat', vat: 'Alle Preise zzgl. MwSt.',
    rep: 'MONATSREPORT', rows: ['Ausgegeben', 'Gesehen', 'Angefragt'], vals: ['1.000 €', '18.400', '23'],
    g0: 'Kein Monat ohne Anfrage', g1: 'GELD ZURÜCK', g2: 'Betreuung + Werbebudget des Monats', stampG: '100 % GARANTIE',
    newQ: 'NEUE ANFRAGE', job: 'Dachsanierung · 52.000 €', yes: 'Zusagen', no: 'Absagen', yesStamp: 'ZUGESAGT', rev: 'ANFRAGEN',
    cta: 'Kostenlose Erstberatung', cta2: 'Jetzt in 60 Sekunden anfragen', url: 'bau-kunden.app', terms: 'Monatlich kündbar · keine Mindestlaufzeit',
    cm: 'Wie viele Anfragen hattest du letzten Monat?', cm2: 'Schreib\'s in die Kommentare 👇', loc: 'de-DE',
  },
  en: {
    h1: ['WHY DO GREAT', 'TRADE BUSINESSES', 'STILL HAVE ', 'EMPTY', ' ORDER BOOKS?'], inq: 'Inquiries this month',
    q: 'Roofer near me', comp: [['Schneider Roofing', '4.9'], ['Master Roof Ltd', '4.8'], ['Kraus Roofworks', '4.7']], ad: 'Sponsored',
    you: 'Your business', page: 'Page 3 · rank 27', notFound: 'NOT FOUND',
    jobs: [['Roof renovation', '€52,000'], ['New house', '€18,000'], ['Repair', '€3,400']], toComp: 'to the competition',
    items: ['Google Search', 'Google Maps', 'Ad copy', 'Targeting', 'Reporting'],
    fee: 'Management', feeS: 'flat fee, all inclusive', bud: '+ Ad budget', budS: 'minimum, for your ads', mo: '/ month', vat: 'All prices plus VAT.',
    rep: 'MONTHLY REPORT', rows: ['Spent', 'Seen', 'Inquired'], vals: ['€1,000', '18,400', '23'],
    g0: 'No month without an inquiry', g1: 'MONEY BACK', g2: 'Management fee + that month\'s ad spend', stampG: '100 % GUARANTEE',
    newQ: 'NEW INQUIRY', job: 'Roof renovation · €52,000', yes: 'Accept', no: 'Decline', yesStamp: 'ACCEPTED', rev: 'INQUIRIES',
    cta: 'Free consultation', cta2: 'Book in 60 seconds', url: 'bau-kunden.app', terms: 'Cancel monthly · no minimum term',
    cm: 'How many inquiries did you get last month?', cm2: 'Tell us in the comments 👇', loc: 'en-GB',
  },
};
type T = typeof TX.de;

// ---------- primitives ----------
const sp = (f: number, d = 0, damping = 14) => spring({frame: f - d, fps: RFPS, config: {damping, stiffness: 150, mass: 0.7}});
const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties; hl?: boolean}> = ({children, style, hl}) => (
  <div style={{background: hl ? 'rgba(238,51,62,.16)' : 'rgba(246,241,234,.07)', border: `2px solid ${hl ? 'rgba(238,51,62,.55)' : 'rgba(246,241,234,.14)'}`, borderRadius: 26,
    boxShadow: '0 30px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08)', backdropFilter: 'blur(10px)', ...style}}>{children}</div>
);
// slides up + fades in at local frame d
const In: React.FC<{d: number; children: React.ReactNode; y?: number; style?: React.CSSProperties}> = ({d, children, y = 60, style}) => {
  const f = useCurrentFrame();
  const k = sp(f, d);
  return <div style={{opacity: interpolate(f - d, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `translateY(${(1 - k) * y}px) scale(${0.94 + 0.06 * k})`, ...style}}>{children}</div>;
};
const Stamp: React.FC<{d: number; text: string; color: string; rot?: number; style?: React.CSSProperties}> = ({d, text, color, rot = -9, style}) => {
  const f = useCurrentFrame();
  const k = spring({frame: f - d, fps: RFPS, config: {damping: 9, stiffness: 260, mass: 0.6}});
  if (f < d) return null;
  return <div style={{position: 'absolute', border: `6px solid ${color}`, color, fontFamily: HEAD, fontSize: 92, letterSpacing: 6, padding: '6px 26px 0', borderRadius: 14,
    background: 'rgba(21,16,12,.75)', transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * k})`, opacity: Math.min(1, k * 2), boxShadow: `0 0 40px ${color}55`, whiteSpace: 'nowrap', ...style}}>{text}</div>;
};
const Count: React.FC<{d: number; to: number; dur?: number; loc: string; suffix?: string; prefix?: string}> = ({d, to, dur = 50, loc, suffix = '', prefix = ''}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f - d, [0, dur], [0, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out}));
  return <>{prefix}{v.toLocaleString(loc)}{suffix}</>;
};
const Logo: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <svg width={size} height={size} viewBox="0 0 64 64"><rect width="64" height="64" fill={C.red} />
      <g fill="none" stroke="#f7f3ec" strokeWidth="7" strokeLinecap="square"><path d="M20 12 V52" /><path d="M20 12 H34 A10 10 0 0 1 34 32 H20" /><path d="M20 32 H36 A10 10 0 0 1 36 52 H20" /></g></svg>
    <div style={{fontFamily: HEAD, fontSize: size * 0.95, lineHeight: 1, letterSpacing: 2, color: C.cream, paddingTop: size * 0.08}}>BAU-<span style={{color: C.red}}>KUNDEN</span></div>
  </div>
);
const Row: React.FC<{icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; hl?: boolean; dim?: number}> = ({icon, title, sub, right, hl, dim = 1}) => (
  <Glass hl={hl} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '24px 30px', opacity: dim}}>
    <div style={{width: 74, height: 74, borderRadius: 37, background: 'rgba(246,241,234,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cream, flexShrink: 0}}>{icon}</div>
    <div style={{flex: 1}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 42, color: C.cream, lineHeight: 1.1}}>{title}</div>
      {sub && <div style={{fontFamily: BODY, fontWeight: 400, fontSize: 30, color: C.mute}}>{sub}</div>}
    </div>
    {right}
  </Glass>
);

// ---------- scenes (f = frames since the line started; W(i) = frame the i-th word of the line starts) ----------
type SP = {t: T; W: (i: number) => number; loc: string; n: number};
const S1: React.FC<SP> = ({t, W}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 900}}>
      <In d={0}><div style={{fontFamily: HEAD, fontSize: 128, lineHeight: 0.95, color: C.cream, textAlign: 'center', letterSpacing: 1}}>
        {t.h1[0]}<br />{t.h1[1]}<br />{t.h1[2]}<span style={{color: C.red}}>{t.h1[3]}</span>{t.h1[4]}</div></In>
      <In d={W(3)} style={{marginTop: 70}}>
        <Glass style={{padding: '30px 40px'}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.red}}>{t.inq.toUpperCase()}</div>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <div style={{fontFamily: HEAD, fontSize: 170, color: C.cream, lineHeight: 1}}>0</div>
            <svg width={460} height={120}><path d={`M0 100 ${[...Array(10)].map((_, i) => `L${(i + 1) * 46} ${100 + Math.sin(i + f / 30) * 3}`).join(' ')}`} fill="none" stroke={C.mute} strokeWidth={5} strokeDasharray="6 10" /></svg>
          </div>
        </Glass>
      </In>
    </div>
  );
};
const S2: React.FC<SP> = ({t, W}) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [W(3), W(3) + 50], [0, t.q.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 22}}>
      <In d={0}><Glass style={{display: 'flex', alignItems: 'center', gap: 22, padding: '28px 34px', borderRadius: 60}}>
        <Search size={48} color={C.cream} /><div style={{fontFamily: BODY, fontSize: 44, color: C.cream}}>{t.q.slice(0, n)}<span style={{opacity: Math.floor(f / 15) % 2 ? 0 : 1, color: C.red}}>|</span></div></Glass></In>
      {t.comp.map(([name, r], i) => (
        <In key={i} d={W(3) + 56 + i * 10}><Row icon={<MapPin size={38} />} title={name} sub={`${t.ad} · ★ ${r}`} right={<Star size={40} color={C.red} fill={C.red} />} /></In>
      ))}
    </div>
  );
};
const S3: React.FC<SP> = ({t, W}) => (
  <div style={{width: 900, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <In d={0} style={{width: '100%'}}><Row icon={<Home size={38} />} title={t.you} sub={t.page} dim={0.75} /></In>
    <Stamp d={W(2)} text={t.notFound} color={C.red} style={{top: 110}} />
  </div>
);
const S4: React.FC<SP> = ({t}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 22}}>
      {t.jobs.map(([j, v], i) => {
        const k = interpolate(f - 30 - i * 14, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out});
        return <In key={i} d={i * 8}><div style={{transform: `translateX(${k * 70}px)`, opacity: 1 - k * 0.55}}>
          <Row icon={<Home size={38} />} title={j} sub={v} right={<div style={{display: 'flex', alignItems: 'center', gap: 10, color: C.red, fontFamily: BODY, fontWeight: 700, fontSize: 28, opacity: k}}><ArrowRight size={34} />{t.toComp}</div>} />
        </div></In>;
      })}
    </div>
  );
};
const S5: React.FC<SP> = ({t, W, n}) => {
  const icons = [<Search size={38} key={0} />, <MapPin size={38} key={1} />, <PenLine size={38} key={2} />, <Users size={38} key={3} />, <BarChart3 size={38} key={4} />];
  const at = [0, 1, 2, 3, 4].map((i) => W(Math.round(n * 0.3 + (i * n * 0.65) / 5)));
  return (
    <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'stretch'}}>
      <In d={0} style={{display: 'flex', justifyContent: 'center', marginBottom: 30}}><Logo size={110} /></In>
      {t.items.map((it, i) => (
        <In key={i} d={Math.max(8 + i * 6, (at[i] ?? 0) - 4)}><Row icon={icons[i]} title={it} hl={i < 2} right={<div style={{width: 56, height: 56, borderRadius: 28, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Check size={36} color={C.cream} strokeWidth={3} /></div>} /></In>
      ))}
    </div>
  );
};
const S6: React.FC<SP> = ({t, W, loc}) => {
  const b = W(5);
  return (
    <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 24}}>
      <In d={0}><Glass hl style={{padding: '34px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 44, color: C.cream}}>{t.fee}</div><div style={{fontFamily: BODY, fontSize: 30, color: C.mute}}>{t.feeS}</div></div>
        <div style={{fontFamily: HEAD, fontSize: 180, color: C.red, lineHeight: 0.9}}><Count d={6} to={249} loc={loc} suffix=" €" /><span style={{fontSize: 46, color: C.cream}}> {t.mo}</span></div>
      </Glass></In>
      <In d={b}><Glass style={{padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream}}>{t.bud}</div><div style={{fontFamily: BODY, fontSize: 28, color: C.mute}}>{t.budS}</div></div>
        <div style={{fontFamily: HEAD, fontSize: 120, color: C.cream, lineHeight: 0.9}}><Count d={b + 4} to={1000} loc={loc} suffix=" €" /></div>
      </Glass></In>
      <In d={b + 30}><div style={{fontFamily: BODY, fontSize: 28, color: C.mute, textAlign: 'center'}}>{t.vat}</div></In>
    </div>
  );
};
const S7: React.FC<SP> = ({t, W, n}) => {
  const f = useCurrentFrame();
  const at = [W(n - 3), W(n - 2), W(n - 1)];
  return (
    <In d={0} style={{width: 900}}><Glass style={{padding: '40px 44px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
        <div style={{fontFamily: HEAD, fontSize: 70, color: C.cream, letterSpacing: 2}}>{t.rep}</div><BarChart3 size={52} color={C.red} /></div>
      {t.rows.map((r, i) => {
        const k = interpolate(f - at[i], [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out});
        return <div key={i} style={{marginBottom: 30, opacity: 0.35 + 0.65 * Math.min(1, k * 3)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream}}><span>{r}</span><span style={{color: i === 2 ? C.red : C.cream}}>{k > 0.05 ? t.vals[i] : ''}</span></div>
          <div style={{height: 22, borderRadius: 11, background: 'rgba(246,241,234,.1)', marginTop: 10}}><div style={{height: '100%', width: `${k * [70, 92, 48][i]}%`, borderRadius: 11, background: i === 2 ? C.red : C.cream}} /></div>
        </div>;
      })}
    </Glass></In>
  );
};
const S8: React.FC<SP> = ({t, W, n}) => {
  return (
    <div style={{width: 900, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <In d={0} style={{width: '100%'}}><Glass style={{padding: '36px 40px', textAlign: 'center'}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.mute}}>{t.g0}?</div>
        <div style={{fontFamily: HEAD, fontSize: 250, color: C.red, lineHeight: 0.95}}>100 %</div>
        <div style={{fontFamily: HEAD, fontSize: 110, color: C.cream, lineHeight: 0.9}}>{t.g1}</div>
        <div style={{fontFamily: BODY, fontSize: 30, color: C.mute, marginTop: 14}}>{t.g2}</div>
      </Glass></In>
      <Stamp d={W(n - 3)} text={t.stampG} color={C.red} rot={8} style={{top: -150, right: -20}} />
    </div>
  );
};
const S9: React.FC<SP> = ({t, W}) => {
  const f = useCurrentFrame();
  const press = W(2);
  const k = interpolate(f - press - 20, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out});
  const pts = [100, 96, 98, 84, 80, 62, 56, 40, 30, 12];
  return (
    <div style={{width: 900, position: 'relative', display: 'flex', flexDirection: 'column', gap: 26}}>
      <In d={0}><Glass style={{padding: '30px 36px'}}>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: C.red}}>{t.newQ}</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.cream, margin: '6px 0 22px'}}>{t.job}</div>
        <div style={{display: 'flex', gap: 18}}>
          <div style={{flex: 1, textAlign: 'center', padding: '18px 0', borderRadius: 16, fontFamily: BODY, fontWeight: 700, fontSize: 36, background: f > press ? C.green : 'rgba(63,207,127,.18)', color: f > press ? C.ink2 : C.green,
            transform: `scale(${f > press && f < press + 8 ? 0.94 : 1})`}}>{t.yes}</div>
          <div style={{flex: 1, textAlign: 'center', padding: '18px 0', borderRadius: 16, fontFamily: BODY, fontWeight: 700, fontSize: 36, background: 'rgba(238,51,62,.15)', color: C.red, opacity: f > press ? 0.35 : 1}}>{t.no}</div>
        </div>
      </Glass></In>
      <Stamp d={press + 4} text={t.yesStamp} color={C.green} rot={-8} style={{top: -95, right: -10}} />
      <In d={press + 14}><Glass style={{padding: '26px 34px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: BODY, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: C.mute}}><TrendingUp size={34} color={C.green} />{t.rev}</div>
        <svg width={830} height={200} viewBox="0 0 830 200"><path d={`M0 ${pts[0] * 1.8} ${pts.map((y, i) => `L${i * 92} ${y * 1.8}`).join(' ')}`} fill="none" stroke={C.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={1200} strokeDashoffset={1200 - 1200 * k} /></svg>
      </Glass></In>
    </div>
  );
};
const S10: React.FC<SP & {cm: number}> = ({t, cm}) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.03 * Math.sin(f / 9);
  return (
    <div style={{width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
      <In d={0}><Logo size={120} /></In>
      <In d={8}><div style={{fontFamily: HEAD, fontSize: 120, color: C.cream, textAlign: 'center', lineHeight: 0.95}}>{t.cta.toUpperCase()}</div></In>
      <In d={16}><div style={{background: C.red, color: C.cream, fontFamily: BODY, fontWeight: 800, fontSize: 44, padding: '24px 54px', borderRadius: 60, transform: `scale(${pulse})`, boxShadow: '0 20px 50px rgba(238,51,62,.4)'}}>{t.cta2} →</div></In>
      <In d={22}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.cream, letterSpacing: 2}}>{t.url}</div></In>
      <In d={28}><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 30, color: C.mute, letterSpacing: 2}}>{t.terms}</div></In>
      <In d={cm} style={{width: '100%', marginTop: 30}}><Glass style={{display: 'flex', alignItems: 'center', gap: 24, padding: '26px 32px'}}>
        <div style={{width: 74, height: 74, borderRadius: 37, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><MessageCircle size={40} color={C.cream} /></div>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.cream}}>{t.cm}</div><div style={{fontFamily: BODY, fontSize: 30, color: C.mute}}>{t.cm2}</div></div>
      </Glass></In>
    </div>
  );
};

// karaoke caption: spoken words cream, coming words muted
const Caption: React.FC<{words: Word[]; t: number}> = ({words, t}) => {
  if (!words.length) return null;
  // show a window of up to 6 words around the current word
  const cur = Math.max(0, words.findIndex((w) => w.s > t) - 1);
  const idx = words.findIndex((w) => w.s > t) === -1 ? words.length - 1 : cur;
  const size = Math.ceil(words.length / Math.ceil(words.length / 6));
  const a = Math.floor(idx / size) * size;
  const chunk = words.slice(a, a + size);
  return (
    <div style={{display: 'inline-block', background: 'rgba(21,16,12,.82)', border: '2px solid rgba(246,241,234,.1)', borderRadius: 20, padding: '16px 28px', maxWidth: 940, textAlign: 'center'}}>
      {chunk.map((w, i) => <span key={i} style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, color: t >= w.s ? C.cream : 'rgba(246,241,234,.38)'}}>{w.w}{i < chunk.length - 1 ? ' ' : ''}</span>)}
    </div>
  );
};

export const Reel: React.FC<{lang: 'de' | 'en'}> = ({lang}) => {
  const f = useCurrentFrame();
  const cues = CUES[lang];
  const t = TX[lang];
  const sec = f / RFPS;
  const L = cues.lines;
  // which line is on screen: last line whose start (minus a short lead) has passed; l10 + l11 share the end card
  let li = 0;
  for (let i = 0; i < L.length; i++) if (sec >= L[i].start - 0.25) li = i;
  const scene = Math.min(li, 9);
  const line = L[scene];
  const lf = f - Math.round((line.start - 0.25) * RFPS);
  const W = (i: number) => {
    const w = line.words[Math.max(0, Math.min(i, line.words.length - 1))];
    return w ? Math.round((w.s - line.start + 0.25) * RFPS) : 0;
  };
  const props: SP = {t, W, loc: t.loc, n: line.words.length};
  const SCN = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
  const cm = L[10] ? Math.round((L[10].start - L[9].start) * RFPS) : 120;
  const Comp = scene < 9 ? SCN[scene] : null;
  // scene change: quick blur-fade
  const cut = interpolate(lf, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const capLine = L[li];
  const glowX = 50 + 18 * Math.sin(f / 200), glowY = 38 + 10 * Math.cos(f / 260);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at ${glowX}% ${glowY}%, #3a2a20 0%, ${C.ink} 38%, ${C.ink2} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${100 - glowX}% ${70 + 8 * Math.sin(f / 170)}%, rgba(238,51,62,.16) 0%, rgba(238,51,62,0) 40%)`}} />
      {[...Array(60)].map((_, i) => {
        const x = (i * 173) % 1080, y = ((i * 311) % 1920 - f * (0.15 + (i % 5) * 0.05) + 1920 * 4) % 1920;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: 3, background: C.cream, opacity: 0.06 + 0.1 * ((i * 7) % 10) / 10}} />;
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.05}}>{[...Array(6)].map((_, i) => <circle key={i} cx={540} cy={820} r={160 + i * 130 + (f % 120) / 120 * 130} fill="none" stroke={C.cream} strokeWidth={2} />)}</svg>
      <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(f / (cues.total * RFPS)) * 100}%`, background: C.red}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, opacity: cut, filter: `blur(${(1 - cut) * 12}px)`}}>
        {Comp ? <Comp {...props} /> : <S10 {...props} cm={cm} />}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 60, right: 60, bottom: 250, display: 'flex', justifyContent: 'center'}}><Caption words={capLine.words} t={sec} /></div>
      <Audio src={staticFile(`reel_mix_${lang}.wav`)} />
    </AbsoluteFill>
  );
};
