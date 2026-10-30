// Excel Academy v3 "Everything into one phone": overhead study desk piles up, then the phone pulls it all in.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, tw, prog, lerp} from '../kit/core';
import {SANS} from '../kit/fonts';
import {Words, Icon, Ripple, Backdrop, Home, Lesson, PastQ, Mock} from './ExcelAd';
import {StoreBadge} from './ExcelPass';

export const XD_DURATION = Math.round(37.5 * 60);
const O = '#FF822B';
const O2 = '#FFA35C';
const D = '#15161C';
const MUTE = '#6B6E78';
const G = '#1FB46A';
const s = (t: number) => Math.round(t * 60);

const useU = () => {
  const {width, height} = useVideoConfig();
  return {W: width, H: height, u: Math.min(width, height) / 1080, tall: height > width};
};

const PULL = s(13.9); // phone starts pulling items in
const pullAt = (i: number) => PULL + 10 + i * 16;

// ---------- desk props (drawn top-down) ----------
const Book: React.FC<{c: string; t: string; w: number; h: number}> = ({c, t, w, h}) => (
  <div style={{width: w, height: h, borderRadius: 8, background: c, boxShadow: 'inset -10px 0 0 rgba(0,0,0,.18), inset 0 -6px 0 rgba(255,255,255,.15)', padding: w * 0.08, color: '#fff', fontFamily: SANS}}>
    <div style={{fontSize: w * 0.06, fontWeight: 700, opacity: 0.8, letterSpacing: 2}}>STUDY TEXT</div>
    <div style={{fontSize: w * 0.11, fontWeight: 800, marginTop: w * 0.03, lineHeight: 1.05}}>{t}</div>
    <div style={{position: 'absolute', right: w * 0.08, bottom: w * 0.07, fontSize: w * 0.05, fontWeight: 700, opacity: 0.7}}>1,240 pages</div>
  </div>
);

const Sheet: React.FC<{w: number; y: string}> = ({w, y}) => (
  <div style={{width: w, height: w * 1.38, background: '#E3E0DA', padding: w * 0.08, fontFamily: SANS, filter: 'contrast(1.05)', boxShadow: '0 2px 0 #CFCBC4'}}>
    <div style={{fontSize: w * 0.055, fontWeight: 800, color: '#4A4A4A', letterSpacing: 1}}>PAST QUESTIONS · {y}</div>
    {Array.from({length: 11}).map((_, k) => (
      <div key={k} style={{height: w * 0.022, background: '#9C9890', marginTop: w * 0.05, width: `${55 + ((k * 31) % 45)}%`, opacity: 0.8}} />
    ))}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,0,.08), transparent 40%, rgba(0,0,0,.06))'}} />
  </div>
);

const Receipt: React.FC<{w: number}> = ({w}) => (
  <div style={{width: w, background: '#FBFAF6', padding: w * 0.08, fontFamily: 'monospace', color: '#333', fontSize: w * 0.058, lineHeight: 1.6, clipPath: 'polygon(0 0,100% 0,100% 96%,94% 100%,88% 96%,82% 100%,76% 96%,70% 100%,64% 96%,58% 100%,52% 96%,46% 100%,40% 96%,34% 100%,28% 96%,22% 100%,16% 96%,10% 100%,4% 96%,0 100%)'}}>
    <div style={{fontWeight: 800, textAlign: 'center', fontSize: w * 0.07}}>LESSON CENTRE</div>
    <div style={{textAlign: 'center'}}>Yaba, Lagos</div>
    <div>--------------------</div>
    <div>Tuition (3 papers)</div>
    <div style={{textAlign: 'right'}}>₦120,000</div>
    <div>Revision materials</div>
    <div style={{textAlign: 'right'}}>₦30,000</div>
    <div>--------------------</div>
    <div style={{fontWeight: 800}}>TOTAL  ₦150,000</div>
    <div style={{position: 'absolute', right: w * 0.1, top: w * 0.55, border: '4px solid #D0342C', color: '#D0342C', padding: '2px 10px', fontWeight: 800, fontSize: w * 0.09, transform: 'rotate(-14deg)', opacity: 0.85}}>PAID</div>
  </div>
);

const Ticket: React.FC<{w: number}> = ({w}) => (
  <div style={{width: w, height: w * 0.48, background: '#FFD21F', borderRadius: 10, padding: w * 0.06, fontFamily: SANS, color: D, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,.15)'}}>
    <div style={{fontSize: w * 0.06, fontWeight: 800, letterSpacing: 2}}>DANFO · DAILY TICKET</div>
    <div style={{fontSize: w * 0.11, fontWeight: 800, marginTop: w * 0.03}}>Ikorodu → Yaba</div>
    <div style={{display: 'flex', alignItems: 'center', gap: w * 0.04, marginTop: w * 0.04}}>
      <div style={{flex: 1, height: w * 0.025, borderRadius: 9, background: 'linear-gradient(90deg,#D0342C,#F28B30,#D0342C)'}} />
      <div style={{fontSize: w * 0.07, fontWeight: 800, color: '#D0342C'}}>2h 40m</div>
    </div>
  </div>
);

const Alarm: React.FC<{w: number}> = ({w}) => {
  const f = useCurrentFrame();
  const ring = f < s(3.0) ? Math.sin(f * 1.9) * 4 : 0;
  return (
    <div style={{width: w, height: w, borderRadius: 999, background: '#24252B', border: `${w * 0.05}px solid #3A3B42`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${ring}deg)`, boxShadow: f < s(3.0) ? `0 0 ${w * 0.3}px rgba(255,80,60,.35)` : undefined, fontFamily: SANS}}>
      <div style={{color: '#FF5A4A', fontSize: w * 0.24, fontWeight: 800, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 12px rgba(255,90,74,.8)'}}>5:00</div>
    </div>
  );
};

// ---------- the hero phone (top-down, lying flat) ----------
const Phone: React.FC<{h: number; children: React.ReactNode}> = ({h, children}) => {
  const k = h / 2000;
  return (
    <div style={{position: 'relative', width: 1000 * k, height: h}}>
      <div style={{position: 'absolute', left: 85 * k, top: 103 * k, width: 830 * k, height: 1794 * k, borderRadius: 120 * k, overflow: 'hidden', background: '#000'}}>
        <div style={{width: 390, height: 843, transform: `scale(${(830 * k) / 390})`, transformOrigin: '0 0', fontFamily: SANS}}>{children}</div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 30%)'}} />
      </div>
      <Img src={staticFile('xa/phone_frame.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
    </div>
  );
};

const TILES: [string, 'play' | 'doc' | 'check' | 'star'][] = [
  ['Video lessons', 'play'],
  ['Past questions', 'doc'],
  ['Mock exams', 'check'],
  ['Study anywhere', 'star'],
];

const PhoneUI: React.FC = () => {
  const f = useCurrentFrame();
  const wake = prog(f, PULL - 10, PULL + 6);
  // feature screens after the pull
  const screens: [number, React.ReactNode][] = [
    [s(17.3), <Lesson key="l" at={s(17.3)} />],
    [s(19.5), <PastQ key="p" at={s(19.5)} />],
    [s(22.4), <Mock key="m" at={s(22.4) - 30} />],
    [s(25.6), <Home key="h" at={s(25.6)} />],
  ];
  const passed = s(27.4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* sleeping lock screen */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#121214,#1E1F25)', opacity: 1 - wake}}>
        <div style={{textAlign: 'center', color: '#fff', marginTop: 120, opacity: 0.35}}>
          <div style={{fontSize: 86, fontWeight: 700}}>5:00</div>
        </div>
      </AbsoluteFill>
      {/* absorbing grid */}
      <AbsoluteFill style={{background: `linear-gradient(165deg, ${O2}, ${O})`, opacity: wake, padding: '96px 26px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 54, height: 54, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('xa/logo_icon.png')} style={{width: 44}} />
          </div>
          <div style={{color: '#fff', fontSize: 26, fontWeight: 800}}>Excel Academy</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 34}}>
          {TILES.map(([t, ic], i) => {
            const p = prog(f, pullAt(i) + 26, pullAt(i) + 44, EASE.back);
            return (
              <div key={t} style={{height: 170, borderRadius: 26, background: 'rgba(255,255,255,.95)', transform: `scale(${p})`, opacity: Math.min(1, p * 2), padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 30px rgba(120,50,0,.2)'}}>
                <div style={{width: 52, height: 52, borderRadius: 16, background: O, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon k={ic} z={28} />
                </div>
                <div style={{fontSize: 19, fontWeight: 800, color: D}}>{t}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {screens.map(([at, node], i) => {
        const next = screens[i + 1]?.[0] ?? passed + 400;
        if (f < at - 1 || f > next + 28) return null;
        const pin = 1 - prog(f, at, at + 24, EASE.inOut);
        return (
          <AbsoluteFill key={i} style={{transform: `translateX(${pin * 390}px)`, boxShadow: pin > 0 ? '-20px 0 40px rgba(0,0,0,.15)' : undefined}}>
            {node}
          </AbsoluteFill>
        );
      })}
      {[s(17.05), s(19.25), s(22.15), s(25.35)].map((t, i) => (
        <Ripple key={i} at={t} x={[110, 290, 110, 290][i]} y={[260, 260, 450, 450][i]} />
      ))}
      {/* PASSED notification */}
      {f >= passed && (
        <div style={{position: 'absolute', left: 12, right: 12, top: 60, padding: 16, borderRadius: 26, background: 'rgba(255,255,255,.96)', boxShadow: '0 16px 40px rgba(0,0,0,.3)', transform: `translateY(${(1 - prog(f, passed, passed + 22, EASE.back)) * -160}px)`, display: 'flex', gap: 12}}>
          <div style={{width: 46, height: 46, borderRadius: 13, background: '#FFF1E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Img src={staticFile('xa/logo_icon.png')} style={{width: 38}} />
          </div>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: D}}>
              <span>Exam Results</span>
              <span style={{color: MUTE, fontWeight: 500}}>now</span>
            </div>
            <div style={{fontSize: 15, color: D, marginTop: 3}}>
              <b style={{color: G}}>PASSED ✓</b> Congratulations, Tobi! You passed your professional exam.
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// big caption on top of the desk
const Cap: React.FC<{at: number; out: number; text: string; acc?: string[]; light?: boolean}> = ({at, out, text, acc = [], light}) => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  if (f < s(at) || f > s(out) + 16) return null;
  const q = prog(f, s(out), s(out) + 14, EASE.in);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: tall ? 150 * u : 70 * u, textAlign: 'center', fontSize: (tall ? 92 : 84) * u, fontWeight: 800, letterSpacing: -3 * u, lineHeight: 1.05, color: light ? D : '#fff', textShadow: light ? undefined : '0 6px 40px rgba(0,0,0,.6)', opacity: 1 - q, transform: `translateY(${-q * 30}px)`, padding: `0 ${50 * u}px`, zIndex: 50}}>
      <Words text={text} at={s(at)} accent={acc} gap={3} />
    </div>
  );
};

type Prop = {at: number; x: number; y: number; r: number; node: React.ReactNode; pull: number};

const Desk: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const pcx = W / 2;
  const pcy = tall ? H * 0.6 : H * 0.57;
  const ph = (tall ? 980 : 760) * u;

  // camera: slow overhead drift, shake on each drop, push into phone after the pull
  const drops = [s(4.0), s(4.35), s(4.7), s(6.6), s(9.0), s(11.0)];
  const shake = drops.reduce((a, d) => a + (f >= d && f < d + 14 ? Math.sin((f - d) * 2.4) * (1 - (f - d) / 14) * 7 : 0), 0) * u;
  const push = tw(f, [s(16.4), s(17.4)], [1, tall ? 1.42 : 1.38], EASE.inOut) * tw(f, [s(26.8), s(27.6)], [1, 0.8], EASE.inOut);
  const camS = (1 + f * 0.00005) * push;
  const light = prog(f, PULL - 12, PULL + 30); // night desk -> warm morning light

  const L = tall
    ? {book: [0.25, 0.42], sheet: [0.76, 0.4], rec: [0.78, 0.8], tix: [0.26, 0.84], alarm: [0.14, 0.63]}
    : {book: [0.25, 0.42], sheet: [0.75, 0.4], rec: [0.75, 0.8], tix: [0.27, 0.82], alarm: [0.12, 0.7]};

  const props: Prop[] = [
    {at: s(4.0), x: L.book[0], y: L.book[1] + 0.02, r: -8, pull: 0, node: <Book c="#1F4E8C" t="Financial Reporting" w={330 * u} h={440 * u} />},
    {at: s(4.35), x: L.book[0] + 0.01, y: L.book[1], r: 5, pull: 0, node: <Book c="#7A2E3B" t="Taxation" w={320 * u} h={430 * u} />},
    {at: s(4.7), x: L.book[0] - 0.005, y: L.book[1] - 0.02, r: -2, pull: 0, node: <Book c="#2F6B4F" t="Audit & Assurance" w={310 * u} h={420 * u} />},
    {at: s(6.6), x: L.sheet[0] - 0.02, y: L.sheet[1] + 0.03, r: 14, pull: 1, node: <Sheet w={260 * u} y="FINANCIAL REPORTING" />},
    {at: s(6.75), x: L.sheet[0] + 0.02, y: L.sheet[1], r: -9, pull: 1, node: <Sheet w={260 * u} y="TAXATION" />},
    {at: s(6.9), x: L.sheet[0], y: L.sheet[1] - 0.02, r: 4, pull: 1, node: <Sheet w={260 * u} y="AUDIT & ASSURANCE" />},
    {at: s(9.0), x: L.rec[0], y: L.rec[1], r: -10, pull: 2, node: <Receipt w={270 * u} />},
    {at: s(11.0), x: L.tix[0], y: L.tix[1], r: 8, pull: 3, node: <Ticket w={330 * u} />},
  ];

  return (
    <AbsoluteFill style={{background: '#120D09', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px) scale(${camS})`, transformOrigin: `${pcx}px ${pcy}px`}}>
        {/* wood desk */}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(92deg, #5A3B24 0px, #64432A 26px, #573822 52px, #6B472C 90px, #5A3B24 130px)'}} />
        <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.0) 0 300px, rgba(0,0,0,.18) 300px 304px)'}} />
        {/* night lamp pool -> morning light */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(255,190,120,${0.25 + 0.2 * light}), transparent 60%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,3,2,${0.78 - 0.5 * light}) 95%)`}} />
        {/* alarm clock */}
        <div style={{position: 'absolute', left: W * L.alarm[0], top: H * L.alarm[1], transform: `translate(-50%,-50%) scale(${1 - prog(f, PULL + 60, PULL + 80, EASE.in)})`, filter: 'drop-shadow(0 20px 20px rgba(0,0,0,.5))'}}>
          <Alarm w={190 * u} />
        </div>
        {/* props: drop in, then get pulled into the phone */}
        {props.map((p, i) => {
          if (f < p.at) return null;
          const d = prog(f, p.at, p.at + 14, EASE.in);
          const ps = pullAt(p.pull) + (i % 3) * 3;
          const k = prog(f, ps, ps + 30, EASE.in);
          if (k >= 1) return null;
          const x0 = W * p.x;
          const y0 = H * p.y;
          // curved path into the phone centre
          const bx = lerp(x0, pcx, k) + Math.sin(k * Math.PI) * (x0 < pcx ? -1 : 1) * 120 * u;
          const by = lerp(y0, pcy, k) - Math.sin(k * Math.PI) * 140 * u;
          const sc = lerp(1.35, 1, d) * lerp(1, 0.05, k);
          const rot = p.r + k * (x0 < pcx ? 260 : -260);
          return (
            <div key={i} style={{position: 'absolute', left: bx, top: by, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, filter: `drop-shadow(0 ${lerp(60, 14, d) * u}px ${lerp(50, 14, d) * u}px rgba(0,0,0,.55)) blur(${k * 6}px)`, opacity: Math.min(1, d * 3), zIndex: 35 + i}}>
              <div style={{position: 'relative'}}>{p.node}</div>
            </div>
          );
        })}
        {/* the phone */}
        <div style={{position: 'absolute', left: pcx, top: pcy, zIndex: 30, transform: `translate(-50%,-50%) scale(${1 + [0, 1, 2, 3].reduce((a, i) => a + tw(f, [pullAt(i) + 28, pullAt(i) + 32, pullAt(i) + 42], [0, 0.035, 0], (t) => t), 0)}) translate(${f >= s(27.4) && f < s(28.2) ? Math.sin(f * 3) * 5 * u : 0}px, 0)`, filter: `drop-shadow(0 40px 40px rgba(0,0,0,.55)) drop-shadow(0 0 ${prog(f, PULL - 10, PULL + 10) * 120 * u}px rgba(255,140,50,.45))`}}>
          <Phone h={ph}>
            <PhoneUI />
          </Phone>
        </div>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,6,3,.85) 0%, rgba(10,6,3,.5) 22%, transparent 36%)', zIndex: 45}} />
        {/* absorb flashes */}
        {[0, 1, 2, 3].map((i) => {
          const a = pullAt(i) + 30;
          if (f < a || f > a + 24) return null;
          const p = prog(f, a, a + 24);
          return <div key={i} style={{position: 'absolute', left: pcx - 260 * u, top: pcy - 260 * u, width: 520 * u, height: 520 * u, borderRadius: 999, border: `${6 * u}px solid ${O}`, opacity: 1 - p, transform: `scale(${0.4 + p * 1.2})`, zIndex: 29}} />;
        })}
      </AbsoluteFill>

      <Cap at={0.3} out={4.0} text="This is what studying for professional exams used to look like." acc={['professional', 'exams']} />
      <Cap at={4.0} out={6.2} text="Textbooks you can barely carry." acc={['barely']} />
      <Cap at={6.6} out={8.6} text="Photocopied past questions." acc={['Photocopied']} />
      <Cap at={9.0} out={10.7} text="Lesson centre fees." acc={['fees.']} />
      <Cap at={11.0} out={13.4} text="Hours in Lagos traffic." acc={['Hours']} />
      <Cap at={14.0} out={16.6} text="Now, it all fits in your pocket." acc={['pocket.']} />
      <Cap at={17.4} out={19.2} text="Video lessons." acc={['Video']} />
      <Cap at={19.6} out={22.1} text="Past questions, with solutions." acc={['solutions.']} />
      <Cap at={22.5} out={25.2} text="Mock exams. Instant scores." acc={['Instant']} />
      <Cap at={25.7} out={27.2} text="Study anywhere." acc={['anywhere.']} />
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {W, H, u} = useU();
  const t = (f - at) / 60;
  if (t < 0 || t > 2.4) return null;
  return (
    <>
      {Array.from({length: 60}).map((_, i) => {
        const r = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const rr = Math.abs(r);
        const r2 = Math.cos(i * 78.233) * 0.5 + 0.5;
        return <div key={i} style={{position: 'absolute', left: W / 2 + (rr - 0.5) * 1800 * u * t, top: H * 0.45 - 1000 * u * t * (0.5 + r2) + 1200 * u * t * t, width: 16 * u, height: 26 * u, borderRadius: 4, background: [O, O2, '#fff', '#FFD166', G][i % 5], transform: `rotate(${t * 700 * (rr - 0.5)}deg)`, opacity: tw(t, [1.8, 2.4], [1, 0], (x) => x), zIndex: 60}} />;
      })}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const a = s(29.6);
  const lp = prog(f, a, a + 40, EASE.out);
  const btn = prog(f, s(33.4), s(33.9), EASE.back);
  const press = tw(f, [s(34.5), s(34.6), s(34.8)], [1, 0.93, 1]);
  return (
    <AbsoluteFill style={{opacity: prog(f, a - 10, a + 10)}}>
      <Backdrop />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{opacity: lp, transform: `translateY(${(1 - lp) * 50 * u}px) scale(${0.92 + lp * 0.08})`}}>
          <Img src={staticFile('xa/logo_dark.png')} style={{width: (tall ? 900 : 860) * u}} />
        </div>
        <div style={{marginTop: 40 * u, fontSize: 34 * u, fontWeight: 600, color: MUTE, opacity: tw(f, [s(31.6), s(32.2)], [0, 1])}}>Trusted by students worldwide</div>
        <div style={{position: 'relative', marginTop: 50 * u, transform: `scale(${btn * press})`, opacity: Math.min(1, btn * 2)}}>
          <div style={{display: 'flex', gap: 26 * u, flexDirection: tall ? 'column' : 'row', alignItems: 'center', transform: `scale(${tall ? 1.35 : 1.15})`, margin: tall ? `${40 * u}px 0` : 0}}>
            <StoreBadge kind="play" u={u} />
            <StoreBadge kind="apple" u={u} />
          </div>
          <div style={{position: 'absolute', inset: -12 * u, borderRadius: 30 * u, border: `4px solid ${O}`, opacity: tw(f, [s(34.6), s(34.8), s(35.9)], [0, 0.9, 0]), transform: `scale(${tw(f, [s(34.6), s(35.9)], [1, 1.25])})`}} />
        </div>
        <div style={{marginTop: 34 * u, fontSize: 36 * u, fontWeight: 700, color: O, opacity: tw(f, [s(34.0), s(34.5)], [0, 1])}}>excelacademyonline.com</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ExcelDesk: React.FC<{mute?: boolean}> = ({mute = false}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: SANS, background: '#120D09'}}>
      {f < s(30.2) && <Desk />}
      <Confetti at={s(27.6)} />
      {f >= s(29.4) && <End />}
      {!mute && <Audio src={staticFile('xa/xd_mix.wav')} />}
    </AbsoluteFill>
  );
};
