import React from 'react';
import {AbsoluteFill, interpolate, Easing, useVideoConfig, staticFile, Img} from 'remotion';
import {ArrowUpRight, Mail, FileText, Image as ImageIcon, Lock, Check, AlertTriangle, MousePointer2, Clock, Thermometer, Zap, Droplets, Truck, Wrench} from 'lucide-react';
import {CHAPTERS} from './chapters';
import {K, L, Words, Center, Pill, Card, PhaseTag, Clip, Logo, pop, useAbs, ramp, useT, clamp, ease} from './kit';

const W = 1920, H = 1080;
const bgFill = (c = K.bg) => ({background: c});

// ============ 01 · rocket science ============
export const S01: React.FC = () => (
  <AbsoluteFill style={bgFill(K.white)}>
    <Center>
      <Words id="l01" size={58} highlight={(w, i) => (i >= 6 ? K.blue : undefined)} bold={(w, i) => i >= 6} />
    </Center>
  </AbsoluteFill>
);

// ============ 02 · chaos grid of 3D tiles ============
const TILES = ['paper', 'cone', 'helmet', 'crane', 'calc', 'truck', 'cable', 'brick', 'paper', 'helmet', 'cone', 'calc', 'truck', 'crane', 'brick', 'cable'];
export const S02: React.FC = () => {
  const abs = useAbs();
  const l = L('l02');
  const drift = (abs - l.start) * 38;
  const fall = ramp(abs, l.end - 0.2, l.end + 0.9, 0, 1, Easing.in(Easing.cubic));
  const cols = 8, rows = 4, tw = 300, th = 220, gap = 26;
  return (
    <AbsoluteFill style={bgFill()}>
      <AbsoluteFill style={{transform: `translate(${-200 - drift}px, ${-120 + drift * 0.35}px) rotate(-8deg)`}}>
        {Array.from({length: cols * rows}).map((_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          if (r === 1 && c > 1 && c < 7) return null; // leave the band for text
          const appear = pop(abs, l.start - 0.4 + ((i * 7) % 13) * 0.06);
          const myFall = Math.max(0, fall * 1.6 - ((i * 5) % 9) * 0.07);
          const name = TILES[i % TILES.length];
          return (
            <div key={i} style={{position: 'absolute', left: c * (tw + gap), top: r * (th + gap) + (r >= 2 ? 120 : 0), width: tw, height: th, borderRadius: 22, overflow: 'hidden', background: K.white, boxShadow: '0 16px 40px rgba(6,35,90,.10)', opacity: appear * (1 - Math.min(1, myFall)), transform: `scale(${0.7 + 0.3 * appear}) translateY(${myFall * 900}px) rotate(${myFall * 25 * (i % 2 ? 1 : -1)}deg)`}}>
              <Clip name={`tile_${name}`} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: 'rgba(245,247,251,.92)', padding: '26px 54px', borderRadius: 999, backdropFilter: 'blur(10px)', opacity: 1 - fall}}>
          <Words id="l02" size={44} highlight={(w, i) => (i >= 8 ? K.blue : undefined)} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ 03 · complicated ============
export const S03: React.FC = () => (
  <AbsoluteFill style={bgFill(K.white)}>
    <Center>
      <Words id="l03" size={64} bold={(w, i) => i === 2} />
    </Center>
  </AbsoluteFill>
);

// ============ 04 · Intimidating (giant cropped type + blue wipe) ============
export const S04: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l04');
  const x = ramp(abs, l.start - 0.1, l.end + 0.7, 300, -1900, Easing.inOut(Easing.cubic));
  const wipe = ramp(abs, l.end + 0.3, l.end + 0.85, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={bgFill(K.white)}>
      <div style={{position: 'absolute', top: 120, left: x, fontFamily: K.font, fontSize: 760, fontWeight: 500, letterSpacing: '-0.06em', color: K.navy, whiteSpace: 'nowrap', lineHeight: 1}}>{T('Intimidating.', 'Überwältigend.')}</div>
      <div style={{position: 'absolute', inset: 0, background: K.blue, clipPath: `circle(${wipe * 150}% at 0% 100%)`}} />
    </AbsoluteFill>
  );
};

// ============ 05 · That's why we built Baucheck24 ============
export const S05: React.FC = () => {
  const abs = useAbs();
  const l = L('l05');
  const w = L('l05').words;
  const nameAt = w[w.length - 1].s; // "Baucheck24" spoken
  const toWhite = ramp(abs, nameAt - 0.35, nameAt + 0.1, 0, 1, Easing.inOut(Easing.cubic));
  const draw = ramp(abs, nameAt - 0.1, nameAt + 0.9, 0, 1, Easing.out(Easing.cubic));
  const word = ramp(abs, nameAt + 0.35, nameAt + 1.1, 0, 1, ease);
  const grid = ramp(abs, l.end + 1.0, l.end + 1.6, 0, 1, Easing.inOut(Easing.cubic));
  const iconP = pop(abs, nameAt - 0.05, {damping: 13, stiffness: 120});
  return (
    <AbsoluteFill style={bgFill(K.blue)}>
      <Center style={{opacity: 1 - toWhite}}>
        <Words id="l05" size={72} color={K.white} range={[0, 4]} />
      </Center>
      {/* white circle grows from the centre, logo builds inside */}
      <div style={{position: 'absolute', inset: 0, background: K.white, clipPath: `circle(${toWhite * 120}% at 50% 50%)`}} />
      <Center style={{opacity: toWhite * (1 - grid)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, transform: `scale(${1 - grid * 0.4})`}}>
          <div style={{transform: `scale(${iconP}) rotate(${(1 - iconP) * -12}deg)`}}>
            <Logo width={240} part="icon" draw={draw} />
          </div>
          <div style={{width: 940 * word, overflow: 'hidden'}}>
            <Logo width={940} part="word" />
          </div>
        </div>
      </Center>
      {/* logo variant grid like vaylens */}
      <AbsoluteFill style={{opacity: grid, padding: 140, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 0}}>
        <div style={{gridRow: 'span 2', background: K.white, display: 'grid', placeItems: 'center', border: `1px solid ${K.line}`}}>
          <Logo width={620} />
        </div>
        <div style={{background: K.navy, display: 'grid', placeItems: 'center', transform: `translateX(${(1 - grid) * 200}px)`}}>
          <Logo width={430} mono={K.white} />
        </div>
        <div style={{background: K.blue, display: 'grid', placeItems: 'center', transform: `translateY(${(1 - grid) * 200}px)`}}>
          <Logo width={430} mono={K.white} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ 06 · brand montage (music beat) ============
export const S06: React.FC<{t0: number; t1: number}> = ({t0, t1}) => {
  const abs = useAbs();
  const d = t1 - t0;
  const step = Math.min(2, Math.floor(((abs - t0) / d) * 3));
  const T = useT();
  if (step === 0)
    return (
      <AbsoluteFill style={{...bgFill(K.white), flexDirection: 'row'}}>
        <div style={{width: 760, background: K.blue, color: K.white, fontFamily: K.font, padding: 70, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div style={{fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em'}}>Inter Tight</div>
          <div style={{fontSize: 22, lineHeight: 1.6, opacity: 0.9}}>Regular · Medium · Semibold<br />Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm<br />Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br />0123456789 € m² m³ %</div>
        </div>
        <div style={{flex: 1, display: 'grid', placeItems: 'center', fontFamily: K.font, fontSize: 620, fontWeight: 500, color: K.navy, letterSpacing: '-0.06em', transform: `translateX(${ramp(abs, t0, t0 + d / 3, 80, -40)}px)`}}>Aa</div>
      </AbsoluteFill>
    );
  if (step === 1) {
    const sw = [
      {c: K.navy, n: 'Navy', h: '#06235A', fg: K.white},
      {c: K.blue, n: 'Blue', h: '#0A6CFF', fg: K.white},
      {c: K.green, n: 'Check', h: '#27AE4C', fg: K.white},
      {c: K.bg, n: 'Paper', h: '#F5F7FB', fg: K.navy},
    ];
    return (
      <AbsoluteFill style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr'}}>
        {sw.map((s, i) => {
          const p = pop(abs, t0 + d / 3 + i * 0.08);
          return (
            <div key={i} style={{background: s.c, color: s.fg, fontFamily: K.font, padding: 46, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: `scale(${0.9 + 0.1 * p})`, opacity: p}}>
              <div style={{fontSize: 26}}>{s.n}</div>
              <div style={{fontSize: 22, opacity: 0.8}}>{s.h}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }
  // posters with 3D stills
  const p = ramp(abs, t0 + (2 * d) / 3, t1, 0, 1);
  return (
    <AbsoluteFill style={{...bgFill(K.blueSoft), overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(-14deg) translate(${-120 - p * 140}px, ${-60 + p * 60}px) scale(1.15)`, display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center'}}>
        {[
          {bg: K.white, txt: T('From enquiry to handover.', 'Von der Anfrage bis zur Übergabe.'), still: 'twin_still'},
          {bg: K.blue, txt: T('Build with certainty.', 'Bauen mit Gewissheit.'), still: 'rise_still'},
          {bg: K.navy, txt: T('Every step checked.', 'Jeder Schritt geprüft.'), still: 'bim_still'},
        ].map((q, i) => (
          <div key={i} style={{width: 520, height: 720, background: q.bg, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 80px rgba(6,35,90,.2)', position: 'relative', transform: `translateY(${(i - 1) * 90}px)`}}>
            <Img src={staticFile(`3d/${q.still}.png`)} style={{position: 'absolute', bottom: 0, width: '100%', height: '62%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', top: 36, left: 36, right: 36, fontFamily: K.font, fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.08, color: q.bg === K.white ? K.navy : K.white}}>{q.txt}</div>
            <div style={{position: 'absolute', bottom: 24, left: 36}}><Logo width={190} mono={q.bg === K.white ? undefined : K.white} /></div>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ 07 · one platform (3D rise) ============
export const S07: React.FC = () => {
  const abs = useAbs();
  const a = L('l06'), b = L('l07');
  const swap = abs > b.start - 0.15;
  return (
    <AbsoluteFill style={bgFill()}>
      <Clip name="rise" />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(245,247,251,.0) 55%, rgba(245,247,251,.85) 100%)'}} />
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 110}}>
        {!swap ? (
          <Words id="l06" size={58} align="left" highlight={(w, i) => (i === 0 ? K.blue : undefined)} bold={(w, i) => i === 0} exitAt={b.start - 0.3} />
        ) : (
          <Words id="l07" size={58} align="left" highlight={(w, i, ) => (i >= 5 ? K.blue : undefined)} />
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============ 08 · fears (pills over blurred 3D) ============
export const S08: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const a = L('l08'), b = L('l09');
  const second = abs > b.start - 0.2;
  const aw = a.words;
  return (
    <AbsoluteFill style={bgFill()}>
      <AbsoluteFill style={{filter: 'blur(26px) saturate(.8)', transform: 'scale(1.1)', opacity: 0.7}}>
        <Clip name="site" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(245,247,251,.45)'}} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        {!second ? <Words id="l08" size={46} maxWidth={1400} /> : <Words id="l09" size={46} maxWidth={1400} highlight={(w, i) => (i >= 6 ? K.red : undefined)} />}
      </div>
      <Center style={{top: 160}}>
        {!second ? (
          <div style={{display: 'flex', gap: 28}}>
            <Pill at={aw[6]?.s ?? a.start} size={38} icon={<Clock size={30} color={K.blue} />}>{T('no time', 'keine Zeit')}</Pill>
            <Pill at={aw[9]?.s ?? a.start} size={38} dark>{T('no people', 'keine Leute')}</Pill>
            <Pill at={aw[12]?.s ?? a.start} size={38}>{T('another system?', 'noch ein System?')}</Pill>
          </div>
        ) : (
          <Pill at={b.words[6]?.s ?? b.start} size={44} border={K.red} icon={<AlertTriangle size={34} color={K.red} />}>{T('decisions nobody can check', 'Entscheidungen ohne Kontrolle')}</Pill>
        )}
      </Center>
    </AbsoluteFill>
  );
};

// ============ 09 · works differently (arrow square) ============
export const S09: React.FC = () => {
  const abs = useAbs();
  const l = L('l10');
  const p = pop(abs, l.start - 0.2, {damping: 14, stiffness: 110});
  return (
    <AbsoluteFill style={{...bgFill(K.white), flexDirection: 'row'}}>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 140}}>
        <Words id="l10" size={66} align="left" maxWidth={820} highlight={(w, i) => (w.startsWith('Baucheck') ? K.blue : undefined)} bold={(w) => w.startsWith('Baucheck')} />
      </div>
      <div style={{width: 820, display: 'grid', placeItems: 'center'}}>
        <div style={{width: 520 * p, height: 520 * p, background: K.blue, borderRadius: 8, display: 'grid', placeItems: 'center', transform: `rotate(${(1 - p) * -30}deg)`}}>
          <ArrowUpRight size={330 * p} color={K.white} strokeWidth={1.4} style={{transform: `translate(${ramp(abs, l.end - 0.2, l.end + 0.4, 0, 40)}px, ${ramp(abs, l.end - 0.2, l.end + 0.4, 0, -40)}px)`}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ 10 · orchestrator + agents ============
const AGENTS: [string, string][] = [
  ['Intake', 'Aufnahme'], ['CAD / BIM', 'CAD / BIM'], ['Quantities', 'Mengen'], ['Costing', 'Kalkulation'], ['Offers', 'Angebote'], ['Schedule', 'Termine'],
  ['Purchasing', 'Einkauf'], ['Site', 'Baustelle'], ['Quality', 'Qualität'], ['Safety', 'Sicherheit'], ['Invoices', 'Rechnungen'], ['Handover', 'Übergabe'],
];
export const S10: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l11');
  const core = pop(abs, l.start + 0.2, {damping: 14, stiffness: 120});
  const cx = 1240, cy = 560, R = 340;
  const agentsAt = l.words[Math.min(8, l.words.length - 1)].s;
  return (
    <AbsoluteFill style={bgFill()}>
      <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 640, display: 'flex', alignItems: 'center'}}>
        <Words id="l11" size={50} align="left" maxWidth={620} highlight={(w, i) => (i >= 4 && i <= 6 ? K.blue : undefined)} />
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {AGENTS.map((_, i) => {
          const a = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
          const p = ramp(abs, agentsAt + i * 0.09, agentsAt + i * 0.09 + 0.5);
          const x = cx + Math.cos(a) * R * p, y = cy + Math.sin(a) * R * p;
          const pulse = (Math.sin((abs - i * 0.37) * 3) + 1) / 2;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={K.blue} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 8" strokeDashoffset={-abs * 40} />
              <circle cx={x} cy={y} r={16 + pulse * 4} fill={i % 3 === 0 ? K.green : K.blue} opacity={p} />
              <circle cx={x} cy={y} r={30 + pulse * 10} fill={K.blue} opacity={p * 0.08} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={120 * core} fill={K.navy} />
        <circle cx={cx} cy={cy} r={170 * core} fill="none" stroke={K.blue} strokeOpacity={0.25} strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: cx - 120, top: cy - 30, width: 240, textAlign: 'center', color: K.white, fontFamily: K.font, fontSize: 25, fontWeight: 600, opacity: core, lineHeight: 1.1}}>{T('AI orchestrator', 'KI-Orchestrator')}</div>
      {AGENTS.map(([en, de], i) => {
        const a = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const p = ramp(abs, agentsAt + i * 0.09 + 0.3, agentsAt + i * 0.09 + 0.7);
        const x = cx + Math.cos(a) * (R + 70), y = cy + Math.sin(a) * (R + 50);
        return (
          <div key={i} style={{position: 'absolute', left: x - 100, top: y - 16, width: 200, textAlign: 'center', fontFamily: K.font, fontSize: 24, fontWeight: 500, color: K.navy, opacity: p}}>{T(en, de)}</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============ 11 · only tools you allow ============
export const S11: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l12');
  const items: [string, string][] = [['Tools', 'Werkzeuge'], ['Data', 'Daten'], ['Rules', 'Regeln'], ['Approvals', 'Freigaben']];
  const k = ramp(abs, l.start + 0.4, l.end, 0, items.length - 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{...bgFill(K.white), flexDirection: 'row'}}>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', fontFamily: K.font}}>
          {items.map(([en, de], i) => {
            const d = Math.abs(i - k);
            return (
              <div key={i} style={{fontSize: 64, fontWeight: 500, letterSpacing: '-0.02em', color: d < 0.5 ? K.navy : '#B9C2D3', height: 92, display: 'flex', alignItems: 'center', gap: 22}}>
                <span style={{width: 18, height: 18, borderRadius: 9, background: K.green, opacity: d < 0.5 ? 1 : 0}} />
                {T(en, de)}
              </div>
            );
          })}
          <Lock size={56} color={K.blue} style={{position: 'absolute', right: -110, top: 150}} />
        </div>
      </div>
      <div style={{width: 900, display: 'flex', alignItems: 'center', paddingRight: 120}}>
        <Words id="l12" size={50} align="left" maxWidth={760} highlight={(w, i) => (i >= 4 ? K.blue : undefined)} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 12 · 01 Enquiry ============
export const S12: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l13');
  const mid = l.words[4]?.s ?? l.start + 1.4;
  const merge = ramp(abs, mid + 1.1, mid + 2.1, 0, 1, Easing.inOut(Easing.cubic));
  const card = pop(abs, mid + 1.9);
  const docs = [
    {I: Mail, t: T('Enquiry · residential block', 'Anfrage · Wohnhaus'), x: -520, y: -150, at: mid + 0.2},
    {I: FileText, t: T('Site plan.pdf', 'Lageplan.pdf'), x: -60, y: -220, at: mid + 0.5},
    {I: ImageIcon, t: T('Site photos (14)', 'Baustellenfotos (14)'), x: 400, y: -140, at: mid + 0.8},
  ];
  return (
    <AbsoluteFill style={bgFill()}>
      <PhaseTag n={1} en="Enquiry" de="Anfrage" at={l.start - 0.2} />
      <div style={{position: 'absolute', right: 90, top: 30, fontFamily: K.font, fontSize: 300, fontWeight: 500, color: K.blueSoft, letterSpacing: '-0.05em', lineHeight: 1}}>01</div>
      <Center style={{top: -60}}>
        {docs.map(({I, t, x, y, at}, i) => {
          const p = pop(abs, at);
          return (
            <div key={i} style={{position: 'absolute', transform: `translate(${x * (1 - merge)}px, ${y * (1 - merge) + 40 * merge}px) scale(${p * (1 - merge * 0.6)})`, opacity: p * (1 - merge)}}>
              <Card style={{padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 16, fontSize: 28}}>
                <I size={34} color={K.blue} /> {t}
              </Card>
            </div>
          );
        })}
        <div style={{transform: `scale(${card})`, opacity: card}}>
          <Card style={{width: 720, padding: 40}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, color: K.grey}}>
              <span>{T('Project', 'Projekt')} #2207</span>
              <span style={{color: K.green, display: 'flex', alignItems: 'center', gap: 8}}><Check size={24} /> {T('structured', 'strukturiert')}</span>
            </div>
            <div style={{fontSize: 44, fontWeight: 600, marginTop: 10, letterSpacing: '-0.02em'}}>{T('Residential block, Leipzig', 'Wohnhaus, Leipzig')}</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24, fontSize: 24}}>
              {[[T('Scope', 'Umfang'), T('4 floors + shop', '4 Etagen + Laden')], [T('Files', 'Dateien'), '16'], [T('People', 'Beteiligte'), '7'], [T('Start', 'Start'), '03/2027']].map(([a, b], i) => (
                <div key={i} style={{background: K.bg, borderRadius: 14, padding: '14px 18px'}}><span style={{color: K.grey}}>{a}</span><br /><b style={{fontWeight: 600}}>{b}</b></div>
              ))}
            </div>
          </Card>
        </div>
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center'}}>
        <Words id="l13" size={42} maxWidth={1500} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 13 · 02 Planning (3D BIM + clashes) ============
export const S13: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const a = L('l14'), b = L('l15');
  const clashes = [
    {x: 820, y: 430, t: T('Duct × beam · L2', 'Lüftung × Träger · OG2')},
    {x: 1130, y: 560, t: T('Pipe × wall · L1', 'Rohr × Wand · OG1')},
    {x: 980, y: 300, t: T('Cable tray × duct · L3', 'Kabeltrasse × Lüftung · OG3')},
  ];
  return (
    <AbsoluteFill style={bgFill()}>
      <Clip name="bim" />
      <PhaseTag n={2} en="Planning" de="Planung" at={a.start - 0.2} />
      {clashes.map((c, i) => {
        const at = b.start + 0.2 + i * 0.35;
        const p = pop(abs, at);
        const ok = abs > b.end + 0.2 + i * 0.25;
        return (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y, opacity: p, transform: `scale(${p})`}}>
            <div style={{width: 26, height: 26, borderRadius: 13, background: ok ? K.green : K.orange, boxShadow: `0 0 0 ${8 + Math.sin(abs * 6) * 4}px ${ok ? 'rgba(39,174,76,.2)' : 'rgba(242,138,48,.25)'}`}} />
            <Card style={{position: 'absolute', left: 40, top: -18, padding: '10px 18px', fontSize: 22, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10}}>
              {ok ? <Check size={22} color={K.green} /> : <AlertTriangle size={22} color={K.orange} />} {c.t}
            </Card>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 100}}>
        {abs < b.start - 0.15 ? <Words id="l14" size={52} align="left" /> : <Words id="l15" size={52} align="left" highlight={(w, i) => (i === 0 ? K.orange : undefined)} />}
      </div>
    </AbsoluteFill>
  );
};

// ============ 14 · 03 Costing (explode) ============
export const S14: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l16');
  const q = [
    {t: T('Concrete', 'Beton'), v: '1.240 m³', x: 1300, y: 250},
    {t: T('Drywall', 'Trockenbau'), v: '3.860 m²', x: 1360, y: 470},
    {t: T('Cable', 'Kabel'), v: '12,4 km', x: 1290, y: 690},
  ];
  const fmt = useT()('en', 'de') === 'en';
  return (
    <AbsoluteFill style={bgFill()}>
      <Clip name="explode" />
      <PhaseTag n={3} en="Costing" de="Kalkulation" at={l.start - 0.2} />
      {q.map((x, i) => {
        const p = pop(abs, l.start + 0.8 + i * 0.3);
        return (
          <div key={i} style={{position: 'absolute', left: x.x, top: x.y, opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
            <Card style={{padding: '18px 26px', minWidth: 330}}>
              <div style={{fontSize: 22, color: K.grey}}>{x.t}</div>
              <div style={{fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em'}}>{fmt ? x.v.replace('.', ',').replace(/,(\d) km/, '.$1 km') : x.v}</div>
            </Card>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 110, width: 1000, bottom: 100}}>
        <Words id="l16" size={48} align="left" highlight={(w, i, ) => (w.startsWith('calculated') || w.startsWith('berechnet') ? K.blue : undefined)} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 15 · 04 Offer approval ============
export const S15: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l17');
  const tapAt = l.end - 0.3;
  const card = pop(abs, l.start + 0.3);
  const cursorX = ramp(abs, tapAt - 0.9, tapAt, 1500, 1085, Easing.inOut(Easing.cubic));
  const cursorY = ramp(abs, tapAt - 0.9, tapAt, 900, 680, Easing.inOut(Easing.cubic));
  const pressed = abs > tapAt;
  const press = pressed ? 1 - ramp(abs, tapAt, tapAt + 0.15) * 0.06 : 1;
  return (
    <AbsoluteFill style={bgFill()}>
      <PhaseTag n={4} en="Offer" de="Angebot" at={l.start - 0.2} />
      <Center style={{top: -60}}>
        <div style={{transform: `scale(${card})`, opacity: card}}>
          <Card style={{width: 780, padding: 44}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 600, color: pressed ? K.green : K.orange}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: pressed ? K.green : K.orange}} />
              {pressed ? T('Approved', 'Freigegeben') : T('Orange · needs approval', 'Orange · Freigabe nötig')}
            </div>
            <div style={{fontSize: 30, color: K.grey, marginTop: 18}}>{T('Offer', 'Angebot')} #2207-B · {T('Residential block', 'Wohnhaus')}</div>
            <div style={{fontSize: 92, fontWeight: 600, letterSpacing: '-0.03em'}}>{T('€1.84 M', '1,84 Mio. €')}</div>
            <div style={{display: 'flex', gap: 14, marginTop: 10}}>
              {[[T('Margin', 'Marge'), '11,2 %'], [T('Variants', 'Varianten'), '3'], [T('Prepared in', 'Erstellt in'), '6 min']].map(([a, b], i) => (
                <div key={i} style={{flex: 1, background: K.bg, borderRadius: 14, padding: '12px 16px', fontSize: 22}}><span style={{color: K.grey}}>{a}</span><br /><b>{b}</b></div>
              ))}
            </div>
            <div style={{marginTop: 30, height: 84, borderRadius: 18, background: pressed ? K.green : K.navy, color: K.white, display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 600, transform: `scale(${press})`}}>
              {pressed ? <span style={{display: 'flex', gap: 12, alignItems: 'center'}}><Check size={36} /> {T('Approved', 'Freigegeben')}</span> : T('Approve offer', 'Angebot freigeben')}
            </div>
          </Card>
        </div>
      </Center>
      <MousePointer2 size={58} color={K.navy} fill={K.white} style={{position: 'absolute', left: cursorX, top: cursorY, opacity: ramp(abs, tapAt - 1.0, tapAt - 0.8)}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 80, display: 'flex', justifyContent: 'center'}}>
        <Words id="l17" size={42} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 16 · 05 Order (Gantt) ============
export const S16: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l18');
  const rows: [string, string, number, number, string][] = [
    ['Earthworks', 'Erdarbeiten', 0, 0.16, K.navy], ['Shell', 'Rohbau', 0.12, 0.45, K.blue], ['Roof', 'Dach', 0.42, 0.55, K.blue],
    ['Building services', 'Haustechnik', 0.38, 0.72, K.green], ['Fit-out', 'Ausbau', 0.55, 0.9, K.blue], ['Handover', 'Übergabe', 0.9, 1, K.green],
  ];
  const draw = ramp(abs, l.start + 0.3, l.end + 0.4);
  const budget = ramp(abs, l.start + 1.0, l.end + 0.6);
  return (
    <AbsoluteFill style={bgFill()}>
      <PhaseTag n={5} en="Order" de="Auftrag" at={l.start - 0.2} />
      <div style={{position: 'absolute', left: 110, top: 200, width: 1120}}>
        <Card style={{padding: 36}}>
          <div style={{fontSize: 24, color: K.grey, marginBottom: 18}}>{T('Schedule · 14 months', 'Terminplan · 14 Monate')}</div>
          {rows.map(([en, de, s, e, c], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', height: 64}}>
              <div style={{width: 250, fontSize: 24}}>{T(en, de)}</div>
              <div style={{flex: 1, position: 'relative', height: 30}}>
                <div style={{position: 'absolute', left: `${s * 100}%`, width: `${Math.max(0, Math.min(1, draw * 1.4 - i * 0.08)) * (e - s) * 100}%`, height: 30, borderRadius: 8, background: c}} />
              </div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{position: 'absolute', right: 110, top: 200, width: 520}}>
        <Card style={{padding: 36}}>
          <div style={{fontSize: 24, color: K.grey}}>{T('Budget', 'Budget')}</div>
          <div style={{fontSize: 80, fontWeight: 600, letterSpacing: '-0.03em'}}>{T(`€${(1.84 * budget).toFixed(2)} M`, `${(1.84 * budget).toFixed(2).replace('.', ',')} Mio. €`)}</div>
          <div style={{height: 14, background: K.bg, borderRadius: 7, marginTop: 14}}><div style={{width: `${budget * 100}%`, height: 14, background: K.green, borderRadius: 7}} /></div>
        </Card>
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 100}}>
        <Words id="l18" size={50} align="left" />
      </div>
    </AbsoluteFill>
  );
};

// ============ 17 · best / fastest / safest ============
export const S17: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l19');
  const cols: {n: [string, string]; c: string; v: [number, number, number]; lab: string[]}[] = [
    {n: ['Best', 'Beste'], c: K.blue, v: [0.62, 0.7, 0.55], lab: [T('€1.79 M', '1,79 Mio. €'), T('13.5 mo', '13,5 Mon.'), '612 t']},
    {n: ['Fastest', 'Schnellste'], c: K.navy, v: [0.8, 0.45, 0.7], lab: [T('€1.93 M', '1,93 Mio. €'), T('11 mo', '11 Mon.'), '688 t']},
    {n: ['Safest', 'Sicherste'], c: K.green, v: [0.7, 0.85, 0.5], lab: [T('€1.86 M', '1,86 Mio. €'), T('15 mo', '15 Mon.'), '574 t']},
  ];
  const metrics: [string, string][] = [['Cost', 'Kosten'], ['Time', 'Zeit'], ['CO2', 'CO2']];
  const ws = l.words;
  const colAt = [ws[3]?.s, ws[5]?.s, ws[8]?.s].map((x, i) => x ?? l.start + 1 + i * 0.4);
  return (
    <AbsoluteFill style={bgFill(K.white)}>
      <div style={{position: 'absolute', left: 110, right: 110, top: 110}}>
        <Words id="l19" size={48} align="left" maxWidth={1500} highlight={(w) => (/^(best|fastest|safest|besten|schnellsten|sichersten)/i.test(w) ? K.blue : undefined)} />
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 360, bottom: 100, display: 'flex', gap: 40}}>
        {cols.map((c, i) => {
          const p = pop(abs, colAt[i]);
          return (
            <div key={i} style={{flex: 1, opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
              <Card style={{height: '100%', padding: 36, display: 'flex', flexDirection: 'column', gap: 26, border: i === 0 ? `2px solid ${K.blue}` : `1px solid ${K.line}`}}>
                <div style={{fontSize: 40, fontWeight: 600, color: c.c}}>{T(...c.n)}</div>
                {metrics.map(([en, de], k) => {
                  const g = ramp(abs, colAt[i] + 0.3 + k * 0.15, colAt[i] + 1.2 + k * 0.15);
                  return (
                    <div key={k}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, color: K.grey}}><span>{T(en, de)}</span><span style={{color: K.navy, fontWeight: 600}}>{c.lab[k]}</span></div>
                      <div style={{height: 12, background: K.bg, borderRadius: 6, marginTop: 8}}><div style={{width: `${c.v[k] * g * 100}%`, height: 12, borderRadius: 6, background: c.c}} /></div>
                    </div>
                  );
                })}
              </Card>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============ 18 · 06 Site (3D site) ============
export const S18: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const a = L('l20'), b = L('l21'), c = L('l22');
  const which = abs < b.start - 0.15 ? 'l20' : abs < c.start - 0.15 ? 'l21' : 'l22';
  const pct = Math.round(ramp(abs, b.start + 0.4, b.end + 0.3, 0, 62));
  return (
    <AbsoluteFill style={bgFill()}>
      <Clip name="site" />
      <PhaseTag n={6} en="Site" de="Baustelle" at={a.start - 0.2} />
      {/* order chip */}
      <div style={{position: 'absolute', right: 110, top: 150, opacity: which === 'l20' ? 1 : 0}}>
        <Pill at={a.start + 0.8} size={32} icon={<Truck size={30} color={K.blue} />}>{T('Concrete C30/37 · 48 m³ · ordered', 'Beton C30/37 · 48 m³ · bestellt')}</Pill>
        <div style={{marginTop: 16, display: 'flex', justifyContent: 'flex-end'}}>
          <Pill at={a.start + 1.3} size={26} icon={<span style={{width: 12, height: 12, borderRadius: 6, background: K.yellow, display: 'inline-block'}} />}>{T('Yellow · within your limit', 'Gelb · innerhalb Ihres Limits')}</Pill>
        </div>
      </div>
      {/* progress */}
      {which === 'l21' && (
        <div style={{position: 'absolute', right: 120, top: 120, fontFamily: K.font, color: K.navy, textAlign: 'right'}}>
          <div style={{fontSize: 240, fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1}}>{pct}<span style={{fontSize: 120}}>%</span></div>
          <div style={{fontSize: 28, color: K.grey}}>{T('progress vs. model', 'Fortschritt vs. Modell')}</div>
        </div>
      )}
      {/* defect → task */}
      {which === 'l22' && (
        <div style={{position: 'absolute', right: 110, top: 150, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-end'}}>
          <Pill at={c.start + 0.1} size={30} border={K.orange} icon={<AlertTriangle size={28} color={K.orange} />}>{T('Defect · crack in drywall · L3', 'Mangel · Riss im Trockenbau · OG3')}</Pill>
          <Pill at={c.start + 0.9} size={30} dark icon={<Wrench size={28} color={K.white} />}>{T('Task → Drywall team Müller', 'Aufgabe → Trockenbau Müller')}</Pill>
        </div>
      )}
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 100}}>
        <Words id={which} size={52} align="left" />
      </div>
    </AbsoluteFill>
  );
};

// ============ 18b · 06 Site: employee time tracking ============
export const S18T: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const a = L('l22t');
  const tap = pop(abs, a.start + 0.9, {damping: 12, stiffness: 200});
  const clocked = abs > a.start + 1.0;
  const phone = pop(abs, a.start - 0.2);
  const rows: [string, string, string, string, number][] = [
    ['A. Yilmaz', 'Rohbau', 'Shell', '06:58', 8.5],
    ['L. Weber', 'Elektro', 'Electrical', '07:04', 8.0],
    ['T. Braun', 'Trockenbau', 'Drywall', '07:10', 7.5],
    ['M. Kowalski', 'Haustechnik', 'Building services', '07:15', 6.5],
  ];
  const total = ramp(abs, a.start + 1.6, a.end, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={bgFill()}>
      <PhaseTag n={6} en="Site · Time tracking" de="Baustelle · Zeiterfassung" at={a.start - 0.3} />
      {/* phone */}
      <div style={{position: 'absolute', left: 190, top: 170, width: 360, height: 700, borderRadius: 56, background: K.navy, padding: 14, boxShadow: '0 40px 90px rgba(6,35,90,.25)', transform: `translateY(${(1 - phone) * 80}px)`, opacity: phone}}>
        <div style={{width: '100%', height: '100%', borderRadius: 44, background: K.white, fontFamily: K.font, color: K.navy, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 70}}>
          <div style={{fontSize: 22, color: K.grey}}>{T('Residential block, Leipzig', 'Wohnhaus, Leipzig')}</div>
          <div style={{fontSize: 72, fontWeight: 500, letterSpacing: '-0.04em', marginTop: 20}}>07:04</div>
          <div style={{fontSize: 22, color: K.grey, marginTop: 6}}>L. Weber · {T('Electrical', 'Elektro')}</div>
          <div style={{marginTop: 70, width: 210, height: 210, borderRadius: 105, background: clocked ? K.green : K.blue, color: K.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 28, fontWeight: 600, transform: `scale(${1 - 0.08 * Math.sin(Math.min(1, tap) * Math.PI)})`, boxShadow: `0 0 0 ${clocked ? 18 * (1 - Math.min(1, tap)) + 10 : 10}px ${clocked ? K.greenSoft : K.blueSoft}`}}>
            {clocked ? <Check size={56} color={K.white} /> : <Clock size={56} color={K.white} />}
            {clocked ? T('Clocked in', 'Eingestempelt') : T('Clock in', 'Einstempeln')}
          </div>
          <div style={{marginTop: 40, fontSize: 20, color: K.grey, display: 'flex', alignItems: 'center', gap: 8}}><span style={{width: 10, height: 10, borderRadius: 5, background: K.green, display: 'inline-block'}} />{T('On site · GPS verified', 'Auf der Baustelle · GPS bestätigt')}</div>
        </div>
      </div>
      {/* timesheet */}
      <Card style={{position: 'absolute', left: 680, top: 200, width: 1060, padding: '34px 40px', opacity: pop(abs, a.start + 0.4)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontSize: 30, fontWeight: 600}}>{T('Timesheet · today', 'Stundenzettel · heute')}</div>
          <div style={{fontSize: 22, color: K.grey}}>{T('Project #2207 · Residential block', 'Projekt #2207 · Wohnhaus')}</div>
        </div>
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14}}>
          {rows.map(([name, de, en, t, h], i) => {
            const p = pop(abs, a.start + 1.2 + i * 0.35);
            return (
              <div key={i} style={{display: 'grid', gridTemplateColumns: '260px 260px 120px 1fr 90px', alignItems: 'center', fontSize: 26, padding: '14px 0', borderTop: `1px solid ${K.line}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                <span style={{fontWeight: 500}}>{name}</span>
                <span style={{color: K.grey}}>{T(en, de)}</span>
                <span style={{color: K.grey}}>{t}</span>
                <div style={{height: 12, borderRadius: 6, background: K.blueSoft, marginRight: 30}}><div style={{width: `${(h / 9) * 100 * p}%`, height: '100%', borderRadius: 6, background: K.blue}} /></div>
                <span style={{textAlign: 'right', fontWeight: 600}}>{(h * Math.min(1, p)).toFixed(1)} h</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${K.navy}`, paddingTop: 20}}>
          <Pill at={a.start + 2.6} size={24} icon={<Check size={22} color={K.green} />}>{T('Booked to project & trade', 'Projekt & Gewerk zugeordnet')}</Pill>
          <span style={{fontSize: 40, fontWeight: 600}}>{(30.5 * total).toFixed(1)} h</span>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 70}}>
        <Words id="l22t" size={46} align="left" highlight={(w, i) => (/hour|Stunde|clock|stempeln/i.test(w) ? K.blue : undefined)} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 19 · 07 Finance ============
export const S19: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const a = L('l23'), b = L('l24');
  const docs: [string, string, string][] = [['Order', 'Bestellung', '412 m²'], ['Delivery', 'Lieferung', '412 m²'], ['Invoice', 'Rechnung', '424 m²']];
  const align = ramp(abs, a.start + 0.6, a.start + 1.8, 0, 1, Easing.inOut(Easing.cubic));
  const second = abs > b.start - 0.2;
  const red = pop(abs, b.start + 0.2);
  return (
    <AbsoluteFill style={bgFill()}>
      <PhaseTag n={7} en="Finance" de="Finanzen" at={a.start - 0.2} />
      {!second ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 40}}>
            {docs.map(([en, de, v], i) => {
              const p = pop(abs, a.start + i * 0.15);
              const bad = i === 2 && abs > a.start + 2.0;
              const fixed = i === 2 && abs > a.start + 3.4;
              return (
                <div key={i} style={{opacity: p, transform: `translateY(${(1 - align) * (i - 1) * 60}px) rotate(${(1 - align) * (i - 1) * 6}deg)`}}>
                  <Card style={{width: 380, padding: 32, border: bad && !fixed ? `2px solid ${K.orange}` : `1px solid ${K.line}`}}>
                    <div style={{fontSize: 24, color: K.grey}}>{T(en, de)} · Trockenbau</div>
                    <div style={{fontSize: 64, fontWeight: 600, letterSpacing: '-0.02em', color: bad && !fixed ? K.orange : K.navy}}>{fixed ? '412 m²' : v}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, marginTop: 8, color: bad && !fixed ? K.orange : K.green}}>
                      {bad && !fixed ? <><AlertTriangle size={24} /> {T('+12 m² flagged', '+12 m² markiert')}</> : <><Check size={24} /> {T('matched', 'abgeglichen')}</>}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 24}}>
            <Pill at={a.end - 1.2} size={34} dark>DATEV</Pill>
            <Pill at={a.end - 0.9} size={34}>Lexware</Pill>
            <Pill at={a.end - 0.6} size={34}>XRechnung</Pill>
          </div>
          <div style={{position: 'absolute', left: 110, right: 110, bottom: 100, display: 'flex', justifyContent: 'center'}}>
            <Words id="l23" size={44} maxWidth={1600} />
          </div>
        </>
      ) : (
        <>
          <Center style={{top: -70}}>
            <div style={{transform: `scale(${red})`, opacity: red}}>
              <Card style={{width: 760, padding: 44}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: K.red}}>
                  <span style={{width: 14, height: 14, borderRadius: 7, background: K.red}} /> {T('Red · never automatic', 'Rot · nie automatisch')}
                </div>
                <div style={{fontSize: 30, color: K.grey, marginTop: 16}}>{T('Payment', 'Zahlung')} · Trockenbau Müller GmbH</div>
                <div style={{fontSize: 92, fontWeight: 600, letterSpacing: '-0.03em'}}>{T('€48,200', '48.200 €')}</div>
                <div style={{marginTop: 18, fontSize: 26, color: K.navy}}>{T('Waiting for: project lead · signature', 'Wartet auf: Projektleitung · Unterschrift')}</div>
              </Card>
            </div>
          </Center>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 100, display: 'flex', justifyContent: 'center'}}>
            <Words id="l24" size={56} highlight={(w, i) => (i >= 2 ? K.blue : undefined)} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ============ 20 · 08 Handover (twin) ============
export const S20: React.FC = () => {
  const T = useT();
  const l = L('l25');
  const sensors = [
    {I: Thermometer, t: '21,4 °C', x: 1260, y: 260},
    {I: Zap, t: T('Energy −18 %', 'Energie −18 %'), x: 1340, y: 430},
    {I: Droplets, t: T('Leak: none', 'Leck: keins'), x: 1250, y: 600},
  ];
  return (
    <AbsoluteFill style={bgFill()}>
      <Clip name="twin" />
      <PhaseTag n={8} en="Handover" de="Übergabe" at={l.start - 0.2} />
      {sensors.map(({I, t, x, y}, i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y}}>
          <Pill at={l.start + 1.2 + i * 0.3} size={30} icon={<I size={28} color={K.blue} />}>{t}</Pill>
        </div>
      ))}
      <div style={{position: 'absolute', left: 110, width: 1000, bottom: 100}}>
        <Words id="l25" size={52} align="left" highlight={(w, i) => (i >= 7 ? K.blue : undefined)} />
      </div>
    </AbsoluteFill>
  );
};

// ============ 21 · autonomy colours ============
export const S21: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l26');
  const ws = l.words;
  const n = ws.length;
  const at = [ws[n - 4]?.s, ws[n - 3]?.s, ws[n - 2]?.s, ws[n - 1]?.s].map((x, i) => x ?? l.end - 1.6 + i * 0.4);
  const blocks: {c: string; fg: string; n: [string, string]; d: [string, string]}[] = [
    {c: K.green, fg: K.white, n: ['Green', 'Grün'], d: ['Fully automatic · files, tasks, reports', 'Vollautomatisch · Ablage, Aufgaben, Berichte']},
    {c: K.yellow, fg: K.navy, n: ['Yellow', 'Gelb'], d: ['Within your rules · orders up to a limit', 'Nach Ihren Regeln · Bestellungen bis Limit']},
    {c: K.orange, fg: K.white, n: ['Orange', 'Orange'], d: ['Prepared, needs approval · offers, contracts', 'Vorbereitet, Freigabe nötig · Angebote, Verträge']},
    {c: K.red, fg: K.white, n: ['Red', 'Rot'], d: ['Never automatic · payments, legal, safety', 'Nie automatisch · Zahlungen, Recht, Sicherheit']},
  ];
  return (
    <AbsoluteFill style={bgFill(K.white)}>
      <div style={{position: 'absolute', left: 110, right: 110, top: 100}}>
        <Words id="l26" size={52} align="left" range={[0, n - 4]} />
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 300, bottom: 100, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0}}>
        {blocks.map((b, i) => {
          const p = ramp(abs, at[i] - 0.1, at[i] + 0.35, 0, 1, Easing.out(Easing.cubic));
          return (
            <div key={i} style={{background: b.c, color: b.fg, fontFamily: K.font, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}}>
              <div style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.02em'}}>{T(...b.n)}</div>
              <div style={{fontSize: 26, lineHeight: 1.3}}>{T(...b.d)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============ 22 · audit log ============
export const S22: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l27');
  const rows: [string, string, string, string, string][] = [
    ['09:14', T('Intake agent', 'Aufnahme-Agent'), T('Project #2207 created', 'Projekt #2207 angelegt'), 'Mail 4471', 'auto'],
    ['10:02', T('BIM agent', 'BIM-Agent'), T('3 clashes resolved', '3 Kollisionen gelöst'), 'Model v9', 'A. Yilmaz'],
    ['11:30', T('Offer agent', 'Angebots-Agent'), T('Offer 1.84 M prepared', 'Angebot 1,84 Mio. erstellt'), 'GAEB 2207', 'L. Weber'],
    ['13:45', T('Purchasing agent', 'Einkaufs-Agent'), T('48 m³ concrete ordered', '48 m³ Beton bestellt'), 'Datanorm', T('rule ≤ 20k', 'Regel ≤ 20k')],
    ['15:20', T('Invoice agent', 'Rechnungs-Agent'), T('+12 m² flagged', '+12 m² markiert'), 'XRechnung', 'T. Braun'],
    ['16:05', T('Accounting agent', 'Buchhaltungs-Agent'), T('Booked to DATEV', 'An DATEV gebucht'), 'Beleg 9921', 'auto'],
    ['17:40', T('Site agent', 'Baustellen-Agent'), T('Daily report filed', 'Tagesbericht abgelegt'), 'Tablet 3', 'auto'],
  ];
  const head = [T('Time', 'Zeit'), T('Agent', 'Agent'), T('Action', 'Aktion'), T('Source', 'Quelle'), T('Approved by', 'Freigabe')];
  return (
    <AbsoluteFill style={bgFill()}>
      <div style={{position: 'absolute', left: 110, right: 110, top: 100}}>
        <Words id="l27" size={56} align="left" highlight={(w, i) => (i >= 4 ? K.blue : undefined)} />
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 290}}>
        <Card style={{padding: '24px 36px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '120px 1.2fr 1.6fr 1fr 1fr', fontSize: 22, color: K.grey, paddingBottom: 12, borderBottom: `1px solid ${K.line}`}}>
            {head.map((h, i) => <div key={i}>{h}</div>)}
          </div>
          {rows.map((r, i) => {
            const p = ramp(abs, l.start + 0.1 + i * 0.22, l.start + 0.5 + i * 0.22);
            return (
              <div key={i} style={{display: 'grid', gridTemplateColumns: '120px 1.2fr 1.6fr 1fr 1fr', fontSize: 25, height: 70, alignItems: 'center', borderBottom: `1px solid ${K.line}`, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
                <div style={{color: K.grey}}>{r[0]}</div><div>{r[1]}</div><div style={{fontWeight: 500}}>{r[2]}</div><div style={{color: K.blue}}>{r[3]}</div><div style={{color: r[4] === 'auto' ? K.green : K.navy}}>{r[4]}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ============ 22b · everything else: all 81 chapters of the spec ============
export const S22M: React.FC = () => {
  const abs = useAbs();
  const T = useT();
  const l = L('l27m');
  const span = Math.max(2, l.end - l.start - 1.2);
  const n = Math.round(ramp(abs, l.start, l.end - 0.6, 0, CHAPTERS.length, Easing.out(Easing.quad)));
  return (
    <AbsoluteFill style={bgFill()}>
      <div style={{position: 'absolute', left: 110, right: 110, top: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: K.font, color: K.navy}}>
        <div style={{fontSize: 34, fontWeight: 600}}>{T('Everything in the spec', 'Alles aus der Spezifikation')}</div>
        <div style={{fontSize: 34, fontWeight: 500}}><span style={{color: K.blue, fontWeight: 600}}>{n}</span> {T('chapters', 'Kapitel')} · <span style={{color: K.blue, fontWeight: 600}}>{Math.round((1298 * n) / CHAPTERS.length).toLocaleString(T('en-US', 'de-DE'))}</span> {T('functions', 'Funktionen')}</div>
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 165, display: 'flex', flexWrap: 'wrap', gap: '10px 10px', alignContent: 'flex-start'}}>
        {CHAPTERS.map(([en, de], i) => {
          const p = pop(abs, l.start + (span * i) / CHAPTERS.length, {damping: 18, stiffness: 220});
          return (
            <div key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 13px', borderRadius: 999, background: K.white, border: `1px solid ${K.line}`, fontFamily: K.font, fontSize: 17, color: K.navy, fontWeight: 500, boxShadow: '0 6px 16px rgba(6,35,90,.06)', opacity: p, transform: `scale(${0.7 + 0.3 * p})`}}>
              <Check size={16} color={K.green} />
              {T(en, de)}
            </div>
          );
        })}
      </div>
      {/* the voice carries this line; the wall of chapters is the picture */}
    </AbsoluteFill>
  );
};

// ============ 23 · time back + Building. ============
export const S23: React.FC = () => {
  const abs = useAbs();
  const a = L('l28'), b = L('l29');
  const big = abs > b.start - 0.12;
  const bigP = pop(abs, b.start - 0.05, {damping: 15, stiffness: 120});
  const T = useT();
  return (
    <AbsoluteFill style={bgFill(big ? K.blue : K.white)}>
      {!big ? (
        <Center>
          <Words id="l28" size={64} maxWidth={1400} highlight={(w, i) => (/^(time|Zeit)$/i.test(w) || i === 4 ? K.blue : undefined)} />
        </Center>
      ) : (
        <Center>
          <div style={{fontFamily: K.font, fontSize: 380, fontWeight: 500, letterSpacing: '-0.05em', color: K.white, transform: `scale(${0.85 + 0.15 * bigP})`, opacity: bigP}}>{T('Building.', 'Bauen.')}</div>
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ============ 24 · logo end ============
export const S24: React.FC = () => {
  const abs = useAbs();
  const l = L('l30');
  const draw = ramp(abs, l.start - 0.3, l.start + 0.6, 0, 1, Easing.out(Easing.cubic));
  const word = ramp(abs, l.start + 0.1, l.start + 0.9);
  const iconP = pop(abs, l.start - 0.3, {damping: 13, stiffness: 110});
  return (
    <AbsoluteFill style={bgFill(K.white)}>
      <Center style={{top: -60}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div style={{transform: `scale(${iconP})`}}><Logo width={230} part="icon" draw={draw} /></div>
          <div style={{width: 900 * word, overflow: 'hidden'}}><Logo width={900} part="word" /></div>
        </div>
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
        <Words id="l30" size={40} color={K.grey} range={[1, 99]} />
      </div>
    </AbsoluteFill>
  );
};

// ============ samteck end card ============
export const EndCard: React.FC<{t0: number}> = ({t0}) => {
  const abs = useAbs();
  const p = ramp(abs, t0, t0 + 0.6);
  const s = ramp(abs, t0 + 0.2, t0 + 0.9);
  return (
    <AbsoluteFill style={bgFill(K.white)}>
      <Center>
        <div style={{fontFamily: K.font, color: K.grey, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: p}}>made by</div>
        <div style={{fontFamily: K.font, color: K.navy, fontSize: 64, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 10, opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}>samteck</div>
      </Center>
    </AbsoluteFill>
  );
};
