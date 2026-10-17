// Bau-Kunden reel, rebuilt on the structure of Dave's reference (RVL factoring reel):
// content in the upper half, narrow UI cards, karaoke caption pill below, whip / zoom transitions with motion blur,
// mood shift from problem (red haze) to solution (warm light), row flips and chips timed to words, stamps after a
// button press, end card with pill CTA + delayed comment card. Colours/fonts: Bau-Kunden brand (cream, ink, red; Barlow).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/bebas-neue';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import {Search, MapPin, PenLine, Users, BarChart3, Check, Home, TrendingUp, MessageCircle, X} from 'lucide-react';
import cuesDe from './reel_cues_de.json';
import cuesEn from './reel_cues_en.json';

export const RFPS = 60;
type Word = {w: string; s: number; e: number};
type Line = {id: string; start: number; end: number; words: Word[]};
type Cues = {total: number; lines: Line[]};
export const CUES: Record<'de' | 'en', Cues> = {de: cuesDe as Cues, en: cuesEn as Cues};

// Bau-Kunden brand (bau-kunden.app): cream page, ink text, red accent, white cards with warm grey lines
const C = {bg: '#f6f1ea', card: '#fffdf9', ink: '#231b15', red: '#ee333e', mute: '#8a8076', line: '#e4dbcf', green: '#1f9d55', soft: '#efe7dc'};
const HEAD = '"Bebas Neue", sans-serif';
const BODY = 'Barlow, sans-serif';
const out = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const TX = {
  de: {
    h1: [['Warum', 0], ['haben', 0], ['gute', 0], ['Handwerksbetriebe', 0], ['trotzdem', 0], ['leere', 1], ['Auftragsbücher?', 1]] as [string, number][],
    inq: 'ANFRAGEN DIESEN MONAT', q: 'Dachdecker in meiner Nähe', ad: 'Anzeige',
    comp: [['Dachbau Schneider', '★ 4,9 · 120 Bewertungen'], ['Meister Dach GmbH', '★ 4,8 · 86 Bewertungen'], ['Bedachungen Kraus', '★ 4,7 · 64 Bewertungen']],
    you: 'Dein Betrieb', page: 'Seite 3 · Platz 27', notFound: 'NICHT GEFUNDEN',
    jobs: [['Dachsanierung', '52.000 €'], ['Neubau EFH', '18.000 €'], ['Reparatur', '3.400 €']], open: 'ANFRAGE OFFEN', gone: 'AN KONKURRENZ', lost: 'VERLORENER UMSATZ',
    with: 'Mit Bau-Kunden', items: ['Google-Suche', 'Google Maps', 'Texte', 'Zielgruppen', 'Auswertung'], todo: 'OFFEN', done: 'ÜBERNOMMEN',
    fee: 'Betreuung', feeS: 'pauschal, alles inklusive', mo: '/ Monat', bud: '+ Werbebudget', budS: 'mindestens, für deine Anzeigen', vat: 'Alle Preise zzgl. MwSt.', chips: ['Alles inklusive', 'Monatlich kündbar'],
    rep: 'Monatsreport', rows: ['Ausgegeben', 'Gesehen', 'Angefragt'], vals: ['1.000 €', '18.400', '23'],
    g0: 'Kein Monat ohne nachvollziehbare Anfrage?', g1: 'Geld zurück.', g2: 'Betreuung + Werbebudget des Monats', stampG: '100 % GARANTIE',
    newQ: 'NEUE ANFRAGE', job: 'Dachsanierung · 52.000 €', yes: 'Zusagen', no: 'Absagen', yesStamp: 'ZUGESAGT', rev: 'ANFRAGEN',
    e1: 'Kostenlose', e2: 'Erstberatung', eS: 'Für Handwerk & Dienstleistung · monatlich kündbar', btn: 'Jetzt kostenlos anfragen', url: 'BAU-KUNDEN.APP',
    cm: 'Wie viele Anfragen hattest du letzten Monat?', cm2: 'Schreib\'s in die Kommentare 👇', loc: 'de-DE',
    k: {items: ['google', 'suche', 'maps', 'texte', 'zielgruppen', 'auswertung'], rows: ['ausgegeben', 'gesehen', 'angefragt'], bud: 'plus', hundred: '100', yes: 'zusagen'},
  },
  en: {
    h1: [['Why', 0], ['do', 0], ['great', 0], ['trade', 0], ['businesses', 0], ['still', 0], ['have', 0], ['empty', 1], ['order', 1], ['books?', 1]] as [string, number][],
    inq: 'INQUIRIES THIS MONTH', q: 'Roofer near me', ad: 'Sponsored',
    comp: [['Schneider Roofing', '★ 4.9 · 120 reviews'], ['Master Roof Ltd', '★ 4.8 · 86 reviews'], ['Kraus Roofworks', '★ 4.7 · 64 reviews']],
    you: 'Your business', page: 'Page 3 · rank 27', notFound: 'NOT FOUND',
    jobs: [['Roof renovation', '€52,000'], ['New house', '€18,000'], ['Repair', '€3,400']], open: 'INQUIRY OPEN', gone: 'TO COMPETITOR', lost: 'LOST REVENUE',
    with: 'With Bau-Kunden', items: ['Google Search', 'Google Maps', 'Ad copy', 'Targeting', 'Reporting'], todo: 'OPEN', done: 'HANDLED',
    fee: 'Management', feeS: 'flat fee, all inclusive', mo: '/ month', bud: '+ Ad budget', budS: 'minimum, for your ads', vat: 'All prices plus VAT.', chips: ['All inclusive', 'Cancel monthly'],
    rep: 'Monthly report', rows: ['Spent', 'Seen', 'Inquired'], vals: ['€1,000', '18,400', '23'],
    g0: 'A month with no traceable inquiry?', g1: 'Money back.', g2: 'Management fee + that month\'s ad spend', stampG: '100 % GUARANTEE',
    newQ: 'NEW INQUIRY', job: 'Roof renovation · €52,000', yes: 'Accept', no: 'Decline', yesStamp: 'ACCEPTED', rev: 'INQUIRIES',
    e1: 'Free', e2: 'consultation', eS: 'For trades & service businesses · cancel monthly', btn: 'Book your free call', url: 'BAU-KUNDEN.APP',
    cm: 'How many inquiries did you get last month?', cm2: 'Tell us in the comments 👇', loc: 'en-GB',
    k: {items: ['google', 'search', 'maps', 'copy', 'targeting', 'reporting'], rows: ['spent', 'seen', 'inquired'], bud: 'plus', hundred: '100', yes: 'yes'},
  },
};
type T = typeof TX.de;

// ---------- primitives ----------
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; tint?: 'red' | 'green'}> = ({children, style, tint}) => (
  <div style={{background: tint === 'red' ? '#fff1f1' : tint === 'green' ? '#f0fbf4' : C.card, border: `2px solid ${tint === 'red' ? '#f6c3c6' : tint === 'green' ? '#bfe8cf' : C.line}`, borderRadius: 22,
    boxShadow: '0 18px 40px rgba(35,27,21,.10), 0 2px 6px rgba(35,27,21,.06)', ...style}}>{children}</div>
);
// enters like the reference: rises a little while un-blurring
const In: React.FC<{d: number; children: React.ReactNode; y?: number; style?: React.CSSProperties}> = ({d, children, y = 40, style}) => {
  const f = useCurrentFrame();
  const k = interpolate(f - d, [0, 16], [0, 1], {...cl, easing: out});
  return <div style={{opacity: k, transform: `translateY(${(1 - k) * y}px)`, filter: k < 0.99 ? `blur(${(1 - k) * 14}px)` : undefined, ...style}}>{children}</div>;
};
const Stamp: React.FC<{d: number; text: string; color: string; rot?: number; style?: React.CSSProperties}> = ({d, text, color, rot = -9, style}) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const k = spring({frame: f - d, fps: RFPS, config: {damping: 10, stiffness: 300, mass: 0.6}});
  return <div style={{position: 'absolute', border: `5px solid ${color}`, color, fontFamily: HEAD, fontSize: 62, letterSpacing: 5, padding: '4px 20px 0', borderRadius: 10,
    background: 'rgba(255,253,249,.92)', transform: `rotate(${rot}deg) scale(${2 - k})`, opacity: Math.min(1, k * 2.5), whiteSpace: 'nowrap', zIndex: 5, ...style}}>{text}</div>;
};
const Count: React.FC<{d: number; to: number; dur?: number; loc: string}> = ({d, to, dur = 45, loc}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f - d, [0, dur], [0, to], {...cl, easing: out})).toLocaleString(loc);
  return <>{loc === 'en-GB' ? `€${v}` : `${v} €`}</>;
};
const Logo: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <svg width={size} height={size} viewBox="0 0 64 64"><rect width="64" height="64" fill={C.red} />
      <g fill="none" stroke="#f7f3ec" strokeWidth="7" strokeLinecap="square"><path d="M20 12 V52" /><path d="M20 12 H34 A10 10 0 0 1 34 32 H20" /><path d="M20 32 H36 A10 10 0 0 1 36 52 H20" /></g></svg>
    <div style={{fontFamily: HEAD, fontSize: size * 0.95, lineHeight: 1, letterSpacing: 2, color: C.ink, paddingTop: size * 0.08}}>BAU-<span style={{color: C.red}}>KUNDEN</span></div>
  </div>
);
const Ico: React.FC<{children: React.ReactNode; bg?: string; fg?: string}> = ({children, bg = C.soft, fg = C.ink}) => (
  <div style={{width: 62, height: 62, borderRadius: 31, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{children}</div>
);
// status label that flips over (rotateX) at frame `at`, like the reference's row flips
const Flip: React.FC<{at: number; a: string; b: string; ca: string; cb: string}> = ({at, a, b, ca, cb}) => {
  const f = useCurrentFrame();
  const k = interpolate(f - at, [0, 14], [0, 1], {...cl, easing: io});
  const first = k < 0.5;
  return <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: first ? ca : cb, transform: `perspective(400px) rotateX(${first ? k * 180 : (k - 1) * 180}deg)`, whiteSpace: 'nowrap'}}>{first ? a : b}</div>;
};
const Chip: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const f = useCurrentFrame();
  const k = spring({frame: f - d, fps: RFPS, config: {damping: 11, stiffness: 260, mass: 0.6}});
  return <div style={{transform: `scale(${k})`, opacity: Math.min(1, k * 2), border: `2px solid ${C.line}`, background: C.card, color: C.ink,
    fontFamily: BODY, fontWeight: 700, fontSize: 24, padding: '8px 18px', borderRadius: 30, whiteSpace: 'nowrap'}}>{children}</div>;
};
const Row: React.FC<{icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; style?: React.CSSProperties; tint?: 'red' | 'green'}> = ({icon, title, sub, right, style, tint}) => (
  <Card tint={tint} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px', ...style}}>
    {icon}
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.ink, lineHeight: 1.1}}>{title}</div>
      {sub && <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 24, color: C.mute}}>{sub}</div>}
    </div>
    {right}
  </Card>
);
const CW = 760; // card column width (about 70 % of the frame, like the reference)

// ---------- scene groups ----------
type G = {t: T; at: (line: string, key: number | string, fallback?: number) => number; loc: string};
const Hook: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: CW}}>
      <div style={{textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 64, lineHeight: 1.12, color: C.ink}}>
        {t.h1.map(([w, hl], i) => {
          const k = interpolate(f - (i === 0 ? 0 : at('l1', i)) + 4, [0, 12], [0, 1], {...cl, easing: out});
          return <span key={i} style={{display: 'inline-block', marginRight: 16, color: hl ? C.red : C.ink, opacity: k, filter: k < 0.99 ? `blur(${(1 - k) * 10}px)` : undefined, transform: `translateY(${(1 - k) * 16}px)`}}>{w}</span>;
        })}
      </div>
      <In d={at('l1', 2)} style={{marginTop: 46}}>
        <Card style={{padding: '24px 30px'}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.red}}>{t.inq}</div>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4}}>
            <div style={{fontFamily: HEAD, fontSize: 120, color: C.ink, lineHeight: 0.95}}>0</div>
            <svg width={430} height={90}>{[...Array(12)].map((_, i) => <rect key={i} x={i * 36} y={78} width={24} height={6} rx={3} fill={C.line} />)}</svg>
          </div>
        </Card>
      </In>
    </div>
  );
};
const SearchG: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  const t0 = at('l2', 3, 30);
  const n = Math.floor(interpolate(f, [t0, t0 + 40], [0, t.q.length], cl));
  return (
    <div style={{width: CW, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative'}}>
      <In d={0}><Card style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 26px', borderRadius: 50}}>
        <Search size={38} color={C.ink} /><div style={{fontFamily: BODY, fontWeight: 500, fontSize: 36, color: C.ink}}>{t.q.slice(0, n)}<span style={{opacity: Math.floor(f / 15) % 2 ? 0 : 1, color: C.red}}>|</span></div></Card></In>
      {t.comp.map(([name, r], i) => (
        <In key={i} d={t0 + 44 + i * 9}><Row icon={<Ico><MapPin size={30} /></Ico>} title={name} sub={r} right={<div style={{fontFamily: BODY, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.mute, border: `2px solid ${C.line}`, borderRadius: 8, padding: '4px 10px'}}>{t.ad.toUpperCase()}</div>} /></In>
      ))}
      <In d={at('l3', 0)} style={{marginTop: 18}}><Row icon={<Ico><Home size={30} /></Ico>} title={t.you} sub={t.page} style={{opacity: 0.7, borderStyle: 'dashed'}} /></In>
      <Stamp d={at('l3', 2, 40)} text={t.notFound} color={C.red} rot={-7} style={{bottom: 6, right: 30}} />
    </div>
  );
};
const Lost: React.FC<G> = ({t, at, loc}) => {
  const flips = [at('l4', 1, 10), at('l4', 3, 30), at('l4', 5, 50)];
  return (
    <div style={{width: CW, display: 'flex', flexDirection: 'column', gap: 14}}>
      {t.jobs.map(([j, v], i) => (
        <In key={i} d={i * 5}><Row icon={<Ico><Home size={30} /></Ico>} title={j} sub={v} right={<Flip at={flips[i]} a={t.open} b={`→ ${t.gone}`} ca={C.mute} cb={C.red} />} /></In>
      ))}
      <In d={flips[2] + 6} style={{marginTop: 14}}><Card tint="red" style={{padding: '18px 26px', textAlign: 'center'}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.red}}>{t.lost}</div>
        <div style={{fontFamily: HEAD, fontSize: 110, color: C.red, lineHeight: 1}}><Count d={flips[2] + 8} to={73400} loc={loc} /></div>
      </Card></In>
    </div>
  );
};
const Solution: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  const icons = [<Search size={30} key={0} />, <MapPin size={30} key={1} />, <PenLine size={30} key={2} />, <Users size={30} key={3} />, <BarChart3 size={30} key={4} />];
  const k = t.k.items;
  const when = [at('l5', k[0], 50), at('l5', k[2], 70), at('l5', k[3], 90), at('l5', k[4], 110), at('l5', k[5], 130)];
  const [w1, ...rest] = t.with.split(' ');
  return (
    <div style={{width: CW, display: 'flex', flexDirection: 'column', gap: 12}}>
      <In d={0}><div style={{textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 70, color: C.ink, marginBottom: 14}}>{w1} <span style={{color: C.red}}>{rest.join(' ')}</span></div></In>
      {t.items.map((it, i) => (
        <In key={i} d={6 + i * 4}><Row icon={<Ico>{icons[i]}</Ico>} title={it} style={{padding: '14px 22px'}}
          right={<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Flip at={when[i]} a={t.todo} b={t.done} ca={C.mute} cb={C.green} />
            <div style={{width: 40, height: 40, borderRadius: 20, background: f > when[i] + 7 ? C.green : C.line, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Check size={26} color="#fff" strokeWidth={3} /></div></div>} /></In>
      ))}
    </div>
  );
};
const Price: React.FC<G> = ({t, at, loc}) => {
  const b = at('l6', t.k.bud, 120);
  return (
    <div style={{width: CW, display: 'flex', flexDirection: 'column', gap: 16}}>
      <In d={0}><Card style={{padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.ink}}>{t.fee}</div><div style={{fontFamily: BODY, fontWeight: 500, fontSize: 24, color: C.mute}}>{t.feeS}</div></div>
        <div style={{fontFamily: HEAD, fontSize: 130, color: C.red, lineHeight: 0.9}}><Count d={4} to={249} loc={loc} /><span style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.ink}}> {t.mo}</span></div>
      </Card></In>
      <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>{t.chips.map((c, i) => <Chip key={i} d={30 + i * 8}><Check size={20} style={{verticalAlign: '-3px', marginRight: 6}} />{c}</Chip>)}</div>
      <In d={b}><Card style={{padding: '22px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.ink}}>{t.bud}</div><div style={{fontFamily: BODY, fontWeight: 500, fontSize: 22, color: C.mute}}>{t.budS}</div></div>
        <div style={{fontFamily: HEAD, fontSize: 96, color: C.ink, lineHeight: 0.9}}><Count d={b + 4} to={1000} loc={loc} /></div>
      </Card></In>
      <In d={b + 30}><div style={{fontFamily: BODY, fontWeight: 500, fontSize: 22, color: C.mute, textAlign: 'center'}}>{t.vat}</div></In>
    </div>
  );
};
const Report: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  const w = t.k.rows.map((k, i) => at('l7', k, 40 + i * 30));
  return (
    <In d={0} style={{width: CW}}><Card style={{padding: '28px 32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 40, color: C.ink}}>{t.rep}</div><Ico bg="#fff1f1" fg={C.red}><BarChart3 size={30} /></Ico></div>
      {t.rows.map((r, i) => {
        const k = interpolate(f - w[i], [0, 26], [0, 1], {...cl, easing: out});
        return <div key={i} style={{marginBottom: 22, opacity: 0.3 + 0.7 * Math.min(1, k * 3)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.ink}}><span>{r}</span><span style={{color: i === 2 ? C.red : C.ink}}>{k > 0.05 ? t.vals[i] : ''}</span></div>
          <div style={{height: 16, borderRadius: 8, background: C.soft, marginTop: 8}}><div style={{height: '100%', width: `${k * [70, 92, 48][i]}%`, borderRadius: 8, background: i === 2 ? C.red : C.ink}} /></div>
        </div>;
      })}
    </Card></In>
  );
};
const Guarantee: React.FC<G> = ({t, at}) => (
  <div style={{width: CW, position: 'relative', paddingTop: 30}}>
    <In d={0}><Card style={{padding: '30px 30px', textAlign: 'center'}}>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.mute}}>{t.g0}</div>
      <div style={{fontFamily: HEAD, fontSize: 210, color: C.red, lineHeight: 0.95, marginTop: 6}}>100 %</div>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 60, color: C.ink, lineHeight: 1}}>{t.g1}</div>
      <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 24, color: C.mute, marginTop: 12}}>{t.g2}</div>
    </Card></In>
    <Stamp d={at('l8', t.k.hundred, 120)} text={t.stampG} color={C.red} rot={7} style={{top: -10, right: -16}} />
  </div>
);
const Yes: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  const press = at('l9', t.k.yes, 40);
  const k = interpolate(f - press - 18, [0, 60], [0, 1], {...cl, easing: out});
  const pts = [92, 88, 90, 76, 72, 58, 52, 38, 28, 12];
  const down = f > press - 6 && f < press + 4;
  return (
    <div style={{width: CW, position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 20}}>
      <In d={0}><Card style={{padding: '22px 28px'}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.red}}>{t.newQ}</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.ink, margin: '4px 0 18px'}}>{t.job}</div>
        <div style={{display: 'flex', gap: 14}}>
          <div style={{flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 14, fontFamily: BODY, fontWeight: 700, fontSize: 30, background: f > press ? C.green : '#e3f5ea', color: f > press ? '#fff' : C.green, transform: `scale(${down ? 0.95 : 1})`}}><Check size={26} style={{verticalAlign: '-4px'}} /> {t.yes}</div>
          <div style={{flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 14, fontFamily: BODY, fontWeight: 700, fontSize: 30, background: '#fff1f1', color: C.red, opacity: f > press ? 0.4 : 1}}><X size={26} style={{verticalAlign: '-4px'}} /> {t.no}</div>
        </div>
      </Card></In>
      <Stamp d={press + 3} text={t.yesStamp} color={C.green} rot={-8} style={{top: -6, right: -10}} />
      <In d={press + 12}><Card style={{padding: '20px 26px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.mute}}><TrendingUp size={26} color={C.green} />{t.rev}</div>
        <svg width={700} height={170} viewBox="0 0 700 170"><path d={`M0 ${pts[0] * 1.6} ${pts.map((y, i) => `L${i * 77} ${y * 1.6}`).join(' ')}`} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1100} strokeDashoffset={1100 - 1100 * k} /></svg>
      </Card></In>
    </div>
  );
};
const End: React.FC<G> = ({t, at}) => {
  const f = useCurrentFrame();
  const cm = at('l11', 0, 200);
  return (
    <div style={{width: CW + 80, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <In d={0}><Logo size={92} /></In>
      <In d={6} style={{marginTop: 30}}><div style={{textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 78, lineHeight: 1.02, color: C.ink}}>{t.e1}<br /><span style={{color: C.red}}>{t.e2}</span></div></In>
      <In d={12} style={{marginTop: 14}}><div style={{fontFamily: BODY, fontWeight: 500, fontSize: 26, color: C.mute, textAlign: 'center'}}>{t.eS}</div></In>
      <In d={18} style={{marginTop: 34}}><div style={{background: C.red, color: '#fff', fontFamily: BODY, fontWeight: 800, fontSize: 34, padding: '18px 44px', borderRadius: 50, boxShadow: '0 14px 30px rgba(238,51,62,.3)', transform: `scale(${1 + 0.025 * Math.sin(f / 10)})`}}>{t.btn} ↓</div></In>
      <In d={24} style={{marginTop: 16}}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.mute}}>{t.url}</div></In>
      <In d={cm} style={{marginTop: 46, width: CW}}><Card style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px'}}>
        <Ico bg={C.red} fg="#fff"><MessageCircle size={30} /></Ico>
        <div><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.ink, lineHeight: 1.15}}>{t.cm}</div><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 24, color: C.red}}>{t.cm2}</div></div>
      </Card></In>
    </div>
  );
};

// groups of VO lines -> scene, and the transition used to enter it (as in the reference)
type Tr = 'none' | 'up' | 'left' | 'zoom' | 'blur';
const GROUPS: {lines: string[]; C: React.FC<G>; tr: Tr}[] = [
  {lines: ['l1'], C: Hook, tr: 'none'},
  {lines: ['l2', 'l3'], C: SearchG, tr: 'up'},
  {lines: ['l4'], C: Lost, tr: 'left'},
  {lines: ['l5'], C: Solution, tr: 'zoom'},
  {lines: ['l6'], C: Price, tr: 'up'},
  {lines: ['l7'], C: Report, tr: 'left'},
  {lines: ['l8'], C: Guarantee, tr: 'up'},
  {lines: ['l9'], C: Yes, tr: 'zoom'},
  {lines: ['l10', 'l11'], C: End, tr: 'blur'},
];
const TRF = 16; // transition length in frames

// directional motion blur via an SVG filter (the reference's whip pans)
const MB: React.FC<{id: string; x: number; y: number}> = ({id, x, y}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>
);
const Stage: React.FC<{tr: Tr; phase: 'in' | 'out'; p: number; id: string; children: React.ReactNode}> = ({tr, phase, p, id, children}) => {
  const e = io(p);
  const s = phase === 'in' ? 1 - e : -e; // in: from +1 to 0, out: from 0 to -1
  const pulse = Math.sin(Math.PI * e);
  let tf = '', op = 1, bx = 0, by = 0, blur = 0;
  if (tr === 'up') { tf = `translateY(${s * 700}px)`; by = pulse * 40; op = phase === 'in' ? Math.min(1, e * 2) : 1 - e; }
  if (tr === 'left') { tf = `translateX(${s * 900}px)`; bx = pulse * 50; op = phase === 'in' ? Math.min(1, e * 2) : 1 - e * 0.6; }
  if (tr === 'zoom') { tf = phase === 'in' ? `scale(${0.7 + 0.3 * e})` : `scale(${1 + 0.8 * e})`; blur = pulse * 14; op = phase === 'in' ? e : 1 - e; }
  if (tr === 'blur') { blur = (phase === 'in' ? 1 - e : e) * 20; op = phase === 'in' ? e : 1 - e; }
  const mb = bx + by > 0.5;
  return (
    <AbsoluteFill style={{transform: tf, opacity: op, filter: mb ? `url(#${id})` : blur > 0.3 ? `blur(${blur}px)` : undefined}}>
      {mb && <MB id={id} x={bx} y={by} />}
      {children}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{words: Word[]; t: number}> = ({words, t}) => {
  if (!words.length) return null;
  const nxt = words.findIndex((w) => w.s > t);
  const idx = nxt === -1 ? words.length - 1 : Math.max(0, nxt - 1);
  const size = Math.ceil(words.length / Math.ceil(words.length / 5));
  const a = Math.floor(idx / size) * size;
  const chunk = words.slice(a, a + size);
  return (
    <div style={{display: 'inline-block', background: C.ink, borderRadius: 16, padding: '12px 24px', maxWidth: 900, textAlign: 'center', boxShadow: '0 10px 24px rgba(35,27,21,.18)'}}>
      {chunk.map((w, i) => <span key={i} style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: t >= w.s ? '#fffdf9' : 'rgba(255,253,249,.4)'}}>{w.w}{i < chunk.length - 1 ? ' ' : ''}</span>)}
    </div>
  );
};

export const Reel: React.FC<{lang: 'de' | 'en'}> = ({lang}) => {
  const f = useCurrentFrame();
  const cues = CUES[lang];
  const t = TX[lang];
  const sec = f / RFPS;
  const byId: Record<string, Line> = Object.fromEntries(cues.lines.map((l) => [l.id, l]));
  const gStart = GROUPS.map((g, i) => (i === 0 ? 0 : Math.round((byId[g.lines[0]].start - 0.3) * RFPS)));
  let gi = 0;
  for (let i = 0; i < GROUPS.length; i++) if (f >= gStart[i]) gi = i;
  // word anchor in frames relative to a group's start; key = word index or lowercase word prefix
  const mkAt = (g0: number) => (line: string, key: number | string, fallback = 0) => {
    const l = byId[line];
    if (!l) return fallback;
    const w = typeof key === 'number' ? l.words[Math.min(key, l.words.length - 1)] : l.words.find((x) => x.w.toLowerCase().replace(/[^a-zäöüß0-9]/g, '').startsWith(key));
    return w ? Math.round(w.s * RFPS) - g0 : Math.round(l.start * RFPS) - g0 + fallback;
  };
  const scene = (i: number) => {
    const Comp = GROUPS[i].C;
    return (
      <Sequence from={gStart[i]} layout="none">
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}><Comp t={t} at={mkAt(gStart[i])} loc={t.loc} /></AbsoluteFill>
      </Sequence>
    );
  };
  const tr = GROUPS[gi].tr;
  const p = tr === 'none' ? 1 : interpolate(f - gStart[gi], [0, TRF], [0, 1], cl);
  // mood: problem = cream with red haze, solution = warm light, with a soft flash on the zoom into the solution
  const moodK = interpolate(f, [gStart[3] - 10, gStart[3] + 30], [0, 1], cl);
  const flash = interpolate(f - gStart[3], [0, 6, 30], [0, 0.55, 0], cl);
  const gx = 50 + 20 * Math.sin(f / 210), gy = 30 + 12 * Math.cos(f / 260);
  const capLine = [...cues.lines].reverse().find((l) => sec >= l.start - 0.15) ?? cues.lines[0];
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(238,51,62,${0.14 * (1 - moodK)}) 0%, rgba(238,51,62,0) 45%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at ${100 - gx}% ${gy + 8}%, rgba(255,184,120,${0.32 * moodK}) 0%, rgba(255,184,120,0) 50%)`}} />
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.35}}>
        {[...Array(5)].map((_, i) => <circle key={i} cx={540} cy={620} r={220 + i * 170 + ((f * 0.6) % 170)} fill="none" stroke={C.line} strokeWidth={2} />)}
        {[...Array(40)].map((_, i) => <circle key={`d${i}`} cx={(i * 173) % 1080} cy={((i * 311) % 1920 - f * (0.2 + (i % 4) * 0.06) + 1920 * 6) % 1920} r={2 + (i % 3)} fill={C.mute} opacity={0.25} />)}
      </svg>
      {gi > 0 && p < 1 && <Stage tr={tr} phase="out" p={p} id={`o${gi}`}>{scene(gi - 1)}</Stage>}
      <Stage tr={tr} phase="in" p={p} id={`i${gi}`}>{scene(gi)}</Stage>
      <AbsoluteFill style={{background: '#fff8ee', opacity: flash}} />
      <div style={{position: 'absolute', left: 0, top: 0, height: 7, width: `${(f / (cues.total * RFPS)) * 100}%`, background: C.red}} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 1220, display: 'flex', justifyContent: 'center'}}><Caption words={capLine.words} t={sec} /></div>
      <Audio src={staticFile(`reel_mix_${lang}.wav`)} />
    </AbsoluteFill>
  );
};
