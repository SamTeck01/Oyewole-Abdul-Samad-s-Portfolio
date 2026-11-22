// HerDeen landing-page film. One continuous purple line carries every scene (reference: "Design connects").
// Seconds are absolute; the voice starts at VO s.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, continueRender, delayRender} from 'remotion';
import {EASE, tw, prog, lerp} from '../../kit/core';

const s = (x: number) => Math.round(x * 60);
export const HD_DURATION = s(39);
const VO = 0.4;
const v = (x: number) => x + VO; // voice time -> film time

const P = '#C572E3', PK = '#FC89C5', OR = '#FF8D28', INK = '#13181C', BG = '#F7F7F7', LIL = '#F3E3FA';
const POP = 'Poppins, sans-serif', SER = '"Playfair Display", serif';
const MARK = 'M39.1112 0H0C0.575954 0.979122 1.76242 3.42117 1.90065 5.35637V74.1253C2.93737 78.6177 7.01512 83.594 10.8855 84.838C12.3254 74.2981 19.107 54.1258 33.8661 51.4903C38.7041 50.6264 44.5788 52.527 49.7624 58.9201L56.5011 48.5529L43.5421 29.3737L37.4946 35.9395L41.6415 41.987C29.5464 41.4687 13.0972 47.9309 7.42981 67.5594C4.94168 54.8423 11.0583 49.4169 14.3413 46.8251V11.0583H38.5061C40.4776 11.0583 42.4598 11.1933 44.3745 11.6627C61.172 15.781 67.3049 28.7113 68.9417 41.6415C68.9417 68.4233 42.3326 79.0088 31.9654 74.6436C25.3996 71.8791 22.923 64.7948 23.1533 61.1663C20.0432 61.1663 18.1425 84.6652 37.149 84.6652C59.4384 84.6652 80 66.8683 80 41.6415C80 13.1854 54.4591 3.35785 45.4404 0.774676C43.3803 0.184604 41.2542 0 39.1112 0Z';

let fontsOk = false;
const useFonts = () => {
  if (fontsOk || typeof document === 'undefined') return;
  fontsOk = true;
  const h = delayRender('hd-fonts');
  const F: [string, string, string][] = [['Poppins', '400', 'poppins-latin-400-normal'], ['Poppins', '500', 'poppins-latin-500-normal'], ['Poppins', '600', 'poppins-latin-600-normal'], ['Poppins', '700', 'poppins-latin-700-normal'], ['Playfair Display', '500', 'playfair-display-latin-500-normal']];
  Promise.all(F.map(([fam, w, file]) => new FontFace(fam, `url(${staticFile(`fonts/${file}.woff2`)})`, {weight: w}).load().then((ff) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(ff)))).then(() => continueRender(h));
};

// ---------- primitives ----------
// a stroke that draws on between a and b (seconds) and optionally erases from its tail between c and d
const Stroke: React.FC<{d: string; a: number; b: number; c?: number; e?: number; w?: number; color?: string; len?: number}> = ({d, a, b, c, e, w = 14, color = P, len = 4000}) => {
  const f = useCurrentFrame();
  const on = prog(f, s(a), s(b), EASE.inOut);
  const off = c !== undefined ? prog(f, s(c), s(e!), EASE.inOut) : 0;
  if (on <= 0 || off >= 1) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - on) - 0} style={{strokeDasharray: `${len * (on - off)} ${len * 2}`, strokeDashoffset: -len * off}} />;
};

const Label: React.FC<{t: string; x: number; y: number; at: number; out?: number; size?: number; color?: string; weight?: number; align?: 'left' | 'center'}> = ({t, x, y, at, out = 999, size = 54, color = INK, weight = 500, align = 'left'}) => {
  const f = useCurrentFrame();
  const p = prog(f, s(at), s(at) + 16);
  const q = prog(f, s(out), s(out) + 12, EASE.in);
  if (p <= 0 || q >= 1) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, ${(1 - p) * 26 - q * 20}px)`, opacity: p * (1 - q), filter: `blur(${(1 - p) * 6}px)`,
    fontFamily: POP, fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap', letterSpacing: '-0.01em'}}>{t}</div>;
};

const Dot: React.FC<{x: number; y: number; at: number; out?: number; r?: number; color?: string}> = ({x, y, at, out = 999, r = 12, color = INK}) => {
  const f = useCurrentFrame();
  const k = prog(f, s(at), s(at) + 14, EASE.back) * (1 - prog(f, s(out), s(out) + 10, EASE.in));
  return <circle cx={x} cy={y} r={r * k} fill={color} />;
};

// words that appear one by one with the voice
const Words: React.FC<{words: [string, number][]; x: number; y: number; size: number; color?: string; serif?: boolean; accent?: string; out?: number; width?: number}> = ({words, x, y, size, color = INK, serif, accent, out = 999, width}) => {
  const f = useCurrentFrame();
  const q = prog(f, s(out), s(out) + 14, EASE.in);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, ${-q * 30}px)`, opacity: 1 - q, display: 'flex', gap: size * 0.26, flexWrap: 'wrap', justifyContent: 'center', width: width ?? 1600}}>
      {words.map(([w, at], i) => {
        const p = prog(f, s(at), s(at) + 14);
        const hot = w === accent;
        return <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * size * 0.35}px)`, filter: `blur(${(1 - p) * 6}px)`,
          fontFamily: serif || hot ? SER : POP, fontStyle: hot ? 'italic' : 'normal', fontWeight: serif || hot ? 500 : 600, fontSize: size, color: hot ? P : color, letterSpacing: serif ? '-0.02em' : '-0.035em', lineHeight: 1.1}}>{w}</span>;
      })}
    </div>
  );
};

const Phone: React.FC<{src: string; x: number; y: number; h: number; at: number; out?: number; from?: 'up' | 'right' | 'left'; rot?: number}> = ({src, x, y, h, at, out = 999, from = 'up', rot = 0}) => {
  const f = useCurrentFrame();
  const p = prog(f, s(at), s(at) + 34);
  const q = prog(f, s(out), s(out) + 22, EASE.in);
  if (p <= 0 || q >= 1) return null;
  const dx = from === 'right' ? (1 - p) * 700 : from === 'left' ? (1 - p) * -700 : 0;
  const dy = from === 'up' ? (1 - p) * 500 : 0;
  return <Img src={staticFile(`hd/${src}.png`)} style={{position: 'absolute', left: x, top: y, height: h, transform: `translate(-50%, -50%) translate(${dx}px, ${dy - q * 700}px) rotate(${rot * (1 - p) + q * -6}deg)`,
    filter: 'drop-shadow(0 40px 60px rgba(90,30,120,.18))'}} />;
};

// wipe: a fat ribbon sweeps across and leaves a new background colour behind it
const Sweep: React.FC<{at: number; color: string; dur?: number}> = ({at, color, dur = 0.7}) => {
  const f = useCurrentFrame();
  const p = prog(f, s(at), s(at + dur), EASE.inOut);
  if (p <= 0) return null;
  const len = 5200;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <path d="M -300 1300 C 400 700, 900 1200, 1300 500 S 2000 -100, 2300 -250" fill="none" stroke={color} strokeWidth={2400} strokeLinecap="round" strokeDasharray={`${len * p} ${len}`} />
    </svg>
  );
};

// ---------- scenes ----------
const Open: React.FC = () => {
  const f = useCurrentFrame();
  // mark outline draws on, fills, then shrinks to a dot that becomes the line
  const draw = prog(f, 0, s(0.35), EASE.inOut);
  const fill = prog(f, s(0.2), s(0.4));
  const shrink = prog(f, s(0.4), s(0.75), EASE.inOut);
  return (
    <>
      <svg width={1920} height={1080} overflow="visible" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <g transform={`translate(960 540) scale(${lerp(2.4, 0.15, shrink)}) translate(-40 -42)`} opacity={1 - prog(f, s(0.65), s(0.78))}>
          <path d={MARK} fill={P} fillOpacity={fill} stroke={P} strokeWidth={1.6} strokeDasharray={`${draw * 700} 700`} />
          <circle cx={41.8} cy={22.6} r={4.3 * fill} fill={P} />
        </g>
        {/* the line shoots out of the logo */}
        <Stroke d="M 960 540 C 1150 540, 1250 380, 1450 420 S 1750 600, 2050 520" a={0.6} b={1.3} />
        <Stroke d="M 960 540 C 770 540, 670 700, 470 660 S 170 480, -130 560" a={0.6} b={1.3} c={2.6} e={3.3} color={PK} />
        <Dot x={960} y={540} at={0.62} out={2.7} r={16} color={P} />
        <Dot x={1450} y={420} at={0.95} out={2.75} />
        <Dot x={470} y={660} at={1.15} out={2.75} />
      </svg>
      <Label t="deen" x={1420} y={330} at={0.9} out={2.75} />
      <Label t="dunya" x={420} y={690} at={1.1} out={2.75} />
      <Label t="and everything in between" x={960} y={760} at={v(1.0)} out={2.75} size={46} color="#5B6268" align="center" />
    </>
  );
};

// one long winding road; life stops pop on it as she names them
const ROAD = 'M 130 520 C 300 520, 300 380, 620 400 S 900 760, 1200 700 S 1500 300, 1800 360 S 2100 600, 2200 600';
const STOPS: [string, number, number, number][] = [['classes', 330, 470, v(2.62)], ['work', 760, 640, v(3.2)], ['family', 1180, 700, v(3.75)], ['five prayers a day', 1560, 380, v(4.3)]];
const Busy: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Stroke d={ROAD} a={1.9} b={4.6} c={6.4} e={7.3} w={14} len={3000} />
        {STOPS.map(([, x, y, at], i) => <Dot key={i} x={x} y={y} at={at} out={5.6} r={16} color={[P, PK, OR, INK][i]} />)}
      </svg>
      {STOPS.map(([t, x, y, at], i) => <Label key={t} t={t} x={x} y={y - 90 + (i % 2 ? 130 : 0)} at={at} out={5.6} align="center" size={52} />)}
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-tw(f, [s(2.6), s(6)], [0, 120], EASE.inOut)}px)`}} />
    </>
  );
};

// overwhelm: strands tangle into a knot
const KNOT = [
  'M -100 300 C 400 100, 700 900, 1000 500 S 1500 100, 2000 400',
  'M -100 800 C 300 1000, 800 200, 1100 600 S 1600 900, 2000 650',
  'M 200 -100 C 500 400, 1300 300, 900 700 S 700 1100, 1300 1200',
  'M 1700 -100 C 1300 300, 600 500, 1000 800 S 1500 1000, 400 1200',
  'M -100 550 C 500 550, 600 250, 960 540 S 1400 850, 2000 540',
];
const Heavy: React.FC = () => {
  const f = useCurrentFrame();
  const shake = Math.sin(f * 0.25) * 6 * prog(f, s(v(5.6)), s(v(6.6)));
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.7 * (1 - prog(f, s(v(7.88)), s(v(8.0)))), transformOrigin: '960px 540px', transform: `translate(${shake}px, 0) scale(${1 - 0.96 * prog(f, s(v(7.3)), s(v(7.95)), EASE.in)}) rotate(${prog(f, s(v(7.35)), s(v(8.0)), EASE.in) * 120}deg)`}}>
        {KNOT.map((d, i) => <Stroke key={i} d={d} a={v(5.4) + i * 0.13} b={v(6.6) + i * 0.13} c={v(9)} e={v(9.1)} w={[26, 18, 34, 14, 22][i]} color={[P, PK, OR, INK, '#E7C3F5'][i]} len={3000} />)}
      </svg>
      <Words words={[['Some', v(5.65)], ['days', v(5.9)], ['it', v(6.15)], ['all', v(6.3)], ['feels', v(6.5)], ['like', v(6.75)], ['too', v(6.95)], ['much.', v(7.15)]]} accent="much." x={960} y={470} size={96} out={v(7.35)} width={1850} />
    </>
  );
};

// the knot pulls tight into the logo, then the app
const Built: React.FC = () => {
  const f = useCurrentFrame();
  const a = v(7.78);
  const k = prog(f, s(a), s(a + 0.45), EASE.back);
  const slide = prog(f, s(v(9.2)), s(v(9.9)), EASE.inOut);
  return (
    <>
      <div style={{position: 'absolute', left: lerp(960, 520, slide), top: 540, transform: `translate(-50%, -50%) scale(${k})`, display: 'flex', alignItems: 'center', gap: 28}}>
        <svg width={150} height={160} viewBox="0 0 80 85"><path d={MARK} fill={P} /><circle cx={41.8} cy={22.6} r={4.3} fill={P} /></svg>
        <div style={{fontFamily: SER, fontWeight: 500, fontSize: 150, color: P, letterSpacing: '-0.02em'}}>HerDeen</div>
      </div>
      <Label t="made for Muslimahs," x={300} y={660} at={v(9.4)} size={60} color="#5B6268" />
      <Label t="by Muslimahs." x={300} y={745} at={v(10.6)} size={60} color={INK} weight={600} />
      <Phone src="home" x={1360} y={560} h={1220} at={v(9.15)} />
    </>
  );
};

// planner: a prompt types, tasks arrive around prayer times
const PROMPT = 'Lecture at 8, groceries, read 3 pages of Quran';
const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = v(12.0);
  const n = Math.floor(tw(f, [s(t0), s(t0 + 1.4)], [0, PROMPT.length], (x) => x));
  const bub = prog(f, s(t0 - 0.2), s(t0 + 0.1), EASE.back);
  const out = prog(f, s(v(15.0)), s(v(15.35)), EASE.in);
  return (
    <>
      <div style={{position: 'absolute', left: 240, top: 300, width: 760, transform: `scale(${bub}) translateY(${-out * 60}px)`, transformOrigin: '0 50%', opacity: 1 - out}}>
        <div style={{background: '#fff', borderRadius: 28, padding: '30px 36px', boxShadow: '0 24px 60px rgba(90,30,120,.12)', fontFamily: POP, fontSize: 36, color: INK, lineHeight: 1.35}}>
          <div style={{fontSize: 24, color: P, fontWeight: 600, marginBottom: 10}}>Tell HerDeen</div>
          {PROMPT.slice(0, n)}<span style={{opacity: f % 40 < 20 ? 1 : 0, color: P}}>|</span>
        </div>
      </div>
      <Words words={[['around', v(14.2)], ['your', v(14.5)], ['prayers.', v(14.75)]]} accent="prayers." x={620} y={660} size={92} out={v(15.0)} />
      <Phone src="planner" x={1380} y={560} h={1000} at={v(11.7)} from="right" rot={6} out={v(15.05)} />
    </>
  );
};

// tracker: ticks land on the voice
const Track: React.FC = () => {
  const f = useCurrentFrame();
  const ticks = [v(16.3), v(16.6), v(16.9)];
  return (
    <>
      <Phone src="tracker" x={620} y={560} h={1000} at={v(15.4)} from="left" rot={-6} out={v(17.25)} />
      {ticks.map((at, i) => {
        const p = prog(f, s(at), s(at) + 12, EASE.back) * (1 - prog(f, s(v(17.25)), s(v(17.25)) + 16, EASE.in));
        return <div key={i} style={{position: 'absolute', left: 1080, top: 380 + i * 120, transform: `scale(${p})`, transformOrigin: '0 50%', display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 64, height: 64, borderRadius: 18, background: P, display: 'grid', placeItems: 'center'}}>
            <svg width={36} height={36} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: POP, fontWeight: 600, fontSize: 60, color: INK}}>{['Fajr', 'Dhuhr', 'Asr'][i]}</div>
        </div>;
      })}
      <Label t="check off each task as you go" x={1080} y={760} at={v(15.9)} out={v(17.25)} size={50} color="#5B6268" />
    </>
  );
};

// cycle: pink ring draws, words "gently" "privately"
const Cycle: React.FC = () => {
  const f = useCurrentFrame();
  const ring = prog(f, s(v(17.55)), s(v(19.6)), EASE.inOut);
  const out = prog(f, s(v(20.9)), s(v(21.3)), EASE.in);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
        <circle cx={600} cy={540} r={300} fill="none" stroke="#FBE0EF" strokeWidth={46} strokeDasharray={`${ring * 1885} 1885`} transform="rotate(-90 600 540)" />
        <circle cx={600} cy={540} r={300} fill="none" stroke={PK} strokeWidth={46} strokeLinecap="round" strokeDasharray={`${ring * 1885 * 0.78} 1885`} transform="rotate(-90 600 540)" />
      </svg>
      <div style={{position: 'absolute', left: 600, top: 540, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: POP, opacity: prog(f, s(v(18.2)), s(v(18.6))) * (1 - out)}}>
        <div style={{fontSize: 32, color: '#5B6268'}}>Next period in</div>
        <div style={{fontSize: 96, fontWeight: 700, color: INK, letterSpacing: '-0.03em'}}>{Math.round(tw(f, [s(v(17.8)), s(v(19.4))], [28, 10], EASE.count))} days</div>
      </div>
      <Label t="track your cycle" x={1080} y={360} at={v(17.66)} out={v(20.9)} size={56} color="#5B6268" />
      <Words words={[['gently', v(19.52)], ['and', v(19.95)], ['privately.', v(20.15)]]} accent="privately." x={1360} y={470} size={104} out={v(20.9)} width={800} />
    </>
  );
};

// qibla, dhikr, Quran: three cards on the line, each on its word
const Faith: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [string, number][] = [['Find the qibla', v(21.34)], ['Keep your dhikr', v(22.36)], ['Read the Quran, anywhere', v(23.4)]];
  const out = prog(f, s(v(24.75)), s(v(25.1)), EASE.in);
  const spin = tw(f, [s(v(21.4)), s(v(22.4))], [-160, 32], EASE.out) + Math.sin(f / 16) * 8;
  const count = Math.round(tw(f, [s(v(22.4)), s(v(23.3))], [0, 33], EASE.count));
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
        <Stroke d="M -100 560 C 300 560, 380 560, 960 560 S 1600 560, 2020 560" a={v(21.2)} b={v(23.6)} w={10} color={LIL} len={2200} />
      </svg>
      {cards.map(([t, at], i) => {
        const p = prog(f, s(at), s(at) + 18, EASE.back);
        return (
          <div key={t} style={{position: 'absolute', left: 340 + i * 620, top: 560, transform: `translate(-50%, -50%) scale(${p}) translateY(${-out * 80 + Math.sin(f / 22 + i * 2) * 12}px) rotate(${Math.sin(f / 30 + i) * 2}deg)`, opacity: 1 - out, textAlign: 'center'}}>
            <div style={{width: 300, height: 300, borderRadius: 64, background: '#fff', boxShadow: '0 30px 70px rgba(90,30,120,.14)', display: 'grid', placeItems: 'center', margin: '0 auto'}}>
              {i === 0 && <svg width={200} height={200} viewBox="-100 -100 200 200"><circle r={86} fill="none" stroke={LIL} strokeWidth={10} /><g transform={`rotate(${spin})`}><path d="M0 -70 L18 0 L0 70 L-18 0Z" fill={P} /><path d="M0 0 L18 0 L0 70 L-18 0Z" fill="#E7C3F5" /></g><circle r={8} fill="#fff" /></svg>}
              {i === 1 && <div style={{fontFamily: POP, fontWeight: 700, fontSize: 120, color: P, letterSpacing: '-0.04em'}}>{count}</div>}
              {i === 2 && <svg width={170} height={170} viewBox="0 0 24 24"><path d="M3 5.5c3-1.2 6-1 9 1v13c-3-2-6-2.2-9-1z M21 5.5c-3-1.2-6-1-9 1v13c3-2 6-2.2 9-1z" fill={LIL} stroke={P} strokeWidth={1.2} strokeLinejoin="round" /></svg>}
            </div>
            <div style={{fontFamily: POP, fontSize: 48, fontWeight: 500, color: INK, marginTop: 34, whiteSpace: 'nowrap'}}>{t}</div>
          </div>
        );
      })}
    </>
  );
};

// proof on the page's pink
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const S: [string, number, (x: number) => string, string, number][] = [
    ['Downloads', 100, (x) => `${Math.round(x)}k+`, '', v(24.96)],
    ['App Store Rating', 4.9, (x) => x.toFixed(1), ' ★', v(27.07)],
    ['Active Sisters', 10, (x) => `${Math.round(x)}K+`, '', v(28.5)],
  ];
  const out = prog(f, s(v(30.75)), s(v(31.15)), EASE.in);
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0}}>
      {S.map(([lab, to, fmt, suf, at], i) => {
        const p = prog(f, s(at), s(at) + 20, EASE.back);
        const val = tw(f, [s(at), s(at + 1.1)], [0, to], EASE.count);
        return (
          <React.Fragment key={lab}>
            {i > 0 && <div style={{width: 3, height: 200 * prog(f, s(at) - 6, s(at) + 10), background: 'rgba(19,24,28,.35)'}} />}
            <div style={{width: 560, textAlign: 'center', transform: `scale(${p}) translateY(${-out * 60 + Math.sin(f / 26 + i * 1.7) * 10}px)`, opacity: 1 - out, fontFamily: POP, color: '#1A1033'}}>
              <div style={{fontSize: 170, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 1}}>{fmt(val)}{suf}</div>
              <div style={{fontSize: 54, marginTop: 18}}>{lab}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// slow ribbons behind the pink end section so it never sits still
const Ribbons: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.sin(f / 50) * 30;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <Stroke d={`M -200 ${980 + o} C 400 ${760 - o}, 900 1100, 1400 ${860 + o} S 2000 700, 2200 ${760 - o}`} a={v(24.9)} b={v(26.6)} w={120} color="#F9A3D3" len={3000} />
      <Stroke d={`M 2200 ${120 - o} C 1600 ${320 + o}, 1100 -40, 600 ${180 - o} S -100 380, -300 ${260 + o}`} a={v(25.3)} b={v(27.2)} w={70} color="#E99BE0" len={3000} />
    </svg>
  );
};

// the purple line swims in under the headline and coils into the logo
const COIL = 'M -100 980 C 300 1060, 500 840, 760 900 S 1000 1020, 1080 920 S 1020 820, 960 880 S 930 930, 960 900';
const Close: React.FC = () => {
  const f = useCurrentFrame();
  const btn = prog(f, s(v(33.3)), s(v(33.3)) + 22, EASE.back);
  const logo = prog(f, s(v(34.9)), s(v(35.4)), EASE.inOut);
  return (
    <>
      <div style={{position: 'absolute', left: 960, top: 300 - logo * 60, transform: 'translateX(-50%)', textAlign: 'center', opacity: prog(f, s(v(31.0)), s(v(31.3)))}}>
        <div style={{fontFamily: SER, fontSize: 46, color: '#1A1033', fontWeight: 500}}>The HerDeen Sisterhood</div>
      </div>
      <Words words={[["You", v(31.2)], ["don't", v(31.4)], ['have', v(31.6)], ['to', v(31.8)], ['balance', v(31.95)], ['it', v(32.3)], ['all', v(32.45)], ['alone.', v(32.65)]]} accent="alone." color="#1A1033" x={960} y={380 - logo * 60} size={118} width={1250} />
      <div style={{position: 'absolute', left: 960, top: 760 - logo * 40, transform: `translate(-50%,-50%) scale(${btn})`, background: '#1A1033', color: '#fff', fontFamily: POP, fontWeight: 600, fontSize: 44, padding: '26px 64px', borderRadius: 99}}>Join the Sisterhood</div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><Stroke d={COIL} a={v(33.9)} b={v(35.0)} c={v(34.8)} e={v(35.3)} w={16} color={P} len={2200} /></svg>
      <div style={{position: 'absolute', left: 960, top: 900, transform: `translate(-50%,-50%) scale(${logo * (1 + Math.sin(f / 30) * 0.02)})`, display: 'flex', alignItems: 'center', gap: 18}}>
        <svg width={64} height={68} viewBox="0 0 80 85"><path d={MARK} fill="#1A1033" /><circle cx={41.8} cy={22.6} r={4.3} fill="#1A1033" /></svg>
        <div style={{fontFamily: SER, fontWeight: 500, fontSize: 64, color: '#1A1033'}}>HerDeen</div>
      </div>
    </>
  );
};

export const HerDeen: React.FC<{mute?: boolean}> = ({mute}) => {
  useFonts();
  const f = useCurrentFrame();
  // constant slow camera drift so nothing ever sits still
  const drift = Math.sin(f / 140) * 10, zoom = 1.02 + Math.sin(f / 230) * 0.015;
  const at = (a: number, b: number) => f >= s(a) && f < s(b);
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${drift}px, ${-drift * 0.6}px) scale(${zoom})`}}>
        <AbsoluteFill style={{transform: `translateX(${-1920 * prog(f, s(2.2), s(3.2), EASE.inOut)}px)`}}>
          {at(0, 3.4) && <Open />}
          {at(1.8, 7.4) && <AbsoluteFill style={{left: 1920}}><Busy /></AbsoluteFill>}
        </AbsoluteFill>
        {at(v(5.3), v(8.05)) && <Heavy />}
        {at(v(7.8), v(11.95)) && <Built />}
        <Sweep at={v(11.4)} color={LIL} dur={0.6} />
        {at(v(11.6), v(16.2)) && <Plan />}
        {at(v(15.3), v(17.7)) && <Track />}
        {at(v(17.4), v(21.5)) && <Cycle />}
        <Sweep at={v(20.75)} color={BG} dur={0.6} />
        {at(v(21.1), v(25.3)) && <Faith />}
        <Sweep at={v(24.55)} color={PK} dur={0.6} />
        {at(v(24.9), 99) && <Ribbons />}
        {at(v(24.9), v(31.3)) && <Proof />}
        {at(v(30.95), 99) && <Close />}
      </AbsoluteFill>
      {!mute && <Audio src={staticFile('hd/mix.wav')} />}
    </AbsoluteFill>
  );
};
