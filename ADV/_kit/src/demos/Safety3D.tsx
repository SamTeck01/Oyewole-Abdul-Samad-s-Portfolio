// Advance Safety Practice sample: puppet Tunde presents the full client script (Faboya VO) across
// drawn site / home / road scenes in one continuous world; the camera pans while he walks.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {EASE, tw} from '../kit/core';
import {ReplaceCaption, Word} from '../kit/captions';
import {Img, staticFile as sf} from 'remotion';
import {Back, Mid, Front, C as TC} from './Tunde3DTest';
import {PuppetPose, REST} from '../kit/puppet';
import MOUTH from './asp.mouth.json';
import WORDS from './asp.words.json';

const A = 0.8; // VO offset (s)
const W = (WORDS as Word[]).map((w) => w.start + A);
const CUES = (MOUTH as {mouthCues: {start: number; end: number; value: string}[]}).mouthCues;
const SANS = 'Inter, sans-serif';
const INK = '#1d2433';
const ORANGE = '#ff6a13';
export const ASP3D_DURATION = 3660;

/** keyframes [[t, v]...] with in-out easing */
const kf = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return v0 + (v1 - v0) * EASE.inOut((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
};
/** 0..1 envelope: ramps up over r from a, holds, ramps down to b */
const env = (t: number, a: number, b: number, r = 0.4) => Math.min(tw(t, [a, a + r], [0, 1], EASE.inOut), tw(t, [b - r, b], [1, 0], EASE.inOut));
const ap = (t: number, a: number, len = 0.7) => tw(t, [a, a + len], [0, 1], EASE.out); // appear

// ---------------- gestures ----------------
type G = Partial<PuppetPose>;
const GEST: Record<string, G> = {
  wave: {uaL: 150, faL: 40, hL: -10, head: -4},
  present: {uaR: -62, faR: -55, hR: 12, head: 3},
  open: {uaL: 38, faL: 55, uaR: -38, faR: -55, head: 0},
  point: {uaR: -95, faR: -6, head: 5},
  low: {uaR: -50, faR: -20, hR: 10, head: 6},
  helmet: {uaL: 165, faL: 95, hL: 30, head: -3},
  chest: {uaR: -40, faR: -110, hR: -20},
  count: {uaL: 120, faL: 55, hL: -5},
  shrug: {uaL: 30, faL: 70, uaR: -30, faR: -70, head: -6},
};
// [gesture, start(s), end(s)] in video time
const TRACK: [string, number, number][] = [
  ['wave', 1.4, 3.6],
  ['open', 5.6, 8.4],
  ['shrug', 8.9, 10.6],
  ['present', 11.0, 19.0],
  ['present', 20.0, 21.4],
  ['helmet', 22.6, 24.4],
  ['point', 24.8, 26.4],
  ['chest', 26.6, 28.4],
  ['open', 28.8, 30.0],
  ['low', 35.3, 37.0],
  ['point', 37.4, 39.3],
  ['present', 39.6, 41.8],
  ['point', 44.0, 46.0],
  ['present', 46.3, 48.4],
  ['count', 49.0, 50.2],
  ['present', 51.0, 56.6],
  ['wave', 57.6, 60.0],
];
const KEYS: (keyof PuppetPose)[] = ['lean', 'head', 'uaL', 'faL', 'hL', 'uaR', 'faR', 'hR'];

// ---------------- camera / walking ----------------
// world x of the camera (left edge): site 0, home 1920, road 3840
// walk windows (s) must match tools3d/gen_safety.py; V = mocap foot speed in px/s at Tunde height 1000
const WK: [number, number][] = [[-1, 1.7], [30.5, 33.9], [41.3, 44.7]];
const V = 630;
const smo = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const walked = (t: number, [a, b]: [number, number]) => {
  let s = 0;
  for (let x = a; x < Math.min(t, b); x += 1 / 120) s += Math.min(smo((x - a) / 0.35), smo((b - x) / 0.35)) / 120;
  return s;
};
const camX = (t: number) => Math.min(1920, V * walked(t, WK[1])) + Math.min(1920, V * walked(t, WK[2]));
const walkW = (t: number) => Math.max(...WK.map(([a, b]) => env(t, a, b, 0.35)));
const tundeX = (t: number) => 520 - V * (walked(1.7, WK[0]) - walked(t, WK[0]));

const pose = (t: number): PuppetPose => {
  const ta = t - A;
  const cue = CUES.find((c) => ta >= c.start && ta < c.end);
  const talk = cue && cue.value !== 'X' ? 1 : 0;
  const p: PuppetPose = {...REST};
  for (const [g, a, b] of TRACK) {
    const w = env(t, a, b, 0.45);
    if (w <= 0) continue;
    for (const k of KEYS) {
      const v = (GEST[g] as Record<string, number>)[k];
      if (v !== undefined) (p as unknown as Record<string, number>)[k] += (v - (p[k] as number)) * w;
    }
  }
  // secondary: wave wiggle, gesture beats on stressed words, idle sway, breathing
  const wv = env(t, 1.4, 3.6) + env(t, 57.6, 60);
  p.faL += Math.sin(t * 13) * 14 * wv;
  p.hL += Math.sin(t * 13 - 0.8) * 10 * wv;
  const beat = Math.sin(t * 5.2) * talk;
  p.faR += beat * 4;
  p.head += Math.sin(t * 6.3) * 2.6 * talk + Math.sin(t * 0.9) * 1.6;
  p.lean += Math.sin(t * 1.1) * 0.8;
  p.uaL += 3 + Math.sin(t * 1.7) * 1.5;
  p.uaR += -3 - Math.sin(t * 1.7 + 1) * 1.5;
  // walk cycle
  const w = walkW(t);
  const ph = t * 9.5;
  const s = Math.sin(ph);
  p.thL += s * 20 * w;
  p.thR += -s * 20 * w;
  p.shL += Math.max(0, -Math.sin(ph + 0.6)) * -26 * w;
  p.shR += Math.max(0, Math.sin(ph + 0.6)) * -26 * w;
  p.uaL += -s * 14 * w;
  p.uaR += -s * 14 * w;
  p.lean += 2.5 * w;
  p.bob = (-Math.abs(Math.cos(ph)) * 16 + 8) * w + Math.sin(t * 2.2) * 3;
  const bt = (t + 0.4) % 3.1;
  p.blink = bt < 0.13 ? Math.sin((bt / 0.13) * Math.PI) : 0;
  p.mouth = cue ? cue.value : 'X';
  return p;
};

// ---------------- drawn scenes ----------------
const Home: React.FC<{t: number}> = ({t}) => {
  const box = tw(t, [W[73] - 0.2, W[73] + 0.6], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #fff6ee 0%, #ffeadb 60%)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {/* window */}
        <g transform="translate(150 170)">
          <rect width={330} height={300} rx={10} fill="#ffd6bb" />
          <rect x={18} y={18} width={294} height={264} fill="#fff3ea" />
          <circle cx={230} cy={90} r={40} fill="#ffb98e" />
          <path d="M 18 230 Q 120 170 210 220 T 312 210 L 312 282 L 18 282 Z" fill="#ffd6bb" />
          <rect x={160} y={18} width={10} height={264} fill="#ffd6bb" />
        </g>
        {/* skirting + floor */}
        <rect x={0} y={640} width={1920} height={24} fill="#ffd6bb" />
        <rect x={0} y={664} width={1920} height={416} fill="#ffeadb" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={0} y={700 + i * 64} width={1920} height={3} fill="#ffd6bb" opacity={0.6} />
        ))}
        {/* walkway rug */}
        <path d="M 760 740 L 1180 740 L 1300 1080 L 640 1080 Z" fill="#fff" opacity={0.85} />
        {/* box on the walkway slides clear */}
        <g transform={`translate(${960 + box * 560} ${860 - Math.sin(box * Math.PI) * 30})`}>
          <ellipse cx={0} cy={70} rx={90} ry={12} fill="rgba(60,30,10,0.18)" />
          <rect x={-80} y={-50} width={160} height={120} rx={6} fill="#ff8a4c" />
          <rect x={-80} y={-50} width={160} height={22} fill="#ff6a13" />
          <rect x={-10} y={-50} width={20} height={120} fill="#ffd6bb" />
        </g>
        {/* wall socket + plug */}
        <g transform="translate(1180 520)">
          <rect x={-44} y={-34} width={88} height={68} rx={10} fill="#fafafa" stroke="#d9cbb8" strokeWidth={3} />
          <circle cx={-14} cy={0} r={6} fill="#555" />
          <circle cx={14} cy={0} r={6} fill="#555" />
          <path d="M 0 34 Q 10 120 -60 150" stroke="#3a3a3a" strokeWidth={6} fill="none" />
        </g>
        {/* shelf with household products up high */}
        <g transform="translate(1480 300)">
          <rect x={0} y={150} width={380} height={18} rx={4} fill="#ffb98e" />
          <rect x={30} y={60} width={56} height={90} rx={12} fill="#4aa3df" />
          <rect x={46} y={40} width={24} height={24} rx={4} fill="#2a6f9c" />
          <rect x={110} y={80} width={70} height={70} rx={10} fill="#ffd23f" />
          <rect x={200} y={50} width={50} height={100} rx={14} fill="#e5484d" />
          <rect x={212} y={32} width={26} height={22} rx={4} fill="#9e2a2e" />
          <rect x={270} y={70} width={80} height={80} rx={10} fill="#6cc070" />
          <rect x={0} y={330} width={380} height={18} rx={4} fill="#ffb98e" />
          <rect x={40} y={250} width={130} height={80} rx={8} fill="#e9d8bf" />
          <rect x={200} y={262} width={140} height={68} rx={8} fill="#cdb593" />
        </g>
        {/* plant */}
        <g transform="translate(250 640)">
          <path d="M -30 0 L 30 0 L 40 -70 L -40 -70 Z" fill="#d07a4a" />
          <ellipse cx={-20} cy={-110} rx={26} ry={60} fill="#5fa86a" transform="rotate(-20 -20 -110)" />
          <ellipse cx={22} cy={-120} rx={24} ry={64} fill="#4f9a5c" transform="rotate(18 22 -120)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Road: React.FC<{t: number}> = ({t}) => {
  // car approaches behind Tunde, slows and stops before the zebra crossing while he looks both ways
  const car = tw(t, [45.2, 47.4], [-560, 930], EASE.out);
  const spin = (car / 30) * (180 / Math.PI);
  const green = t > 47.5;
  const Wheel = ({x}: {x: number}) => (
    <g transform={`translate(${x} 44) rotate(${spin})`}>
      <circle r={30} fill="#262a33" />
      <circle r={14} fill="#c9ced6" />
      <rect x={-2} y={-14} width={4} height={28} fill="#8a919c" />
      <rect x={-14} y={-2} width={28} height={4} fill="#8a919c" />
    </g>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #fffaf5 0%, #fff3ea 55%)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', filter: 'blur(3px)'}}>
        <g fill="#ffd6bb" opacity={0.7}>
          <rect x={80} y={300} width={160} height={300} />
          <rect x={260} y={220} width={120} height={380} />
          <rect x={1400} y={260} width={180} height={340} />
          <rect x={1600} y={340} width={150} height={260} />
          <rect x={980} y={360} width={140} height={240} />
        </g>
      </svg>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {/* far pavement, road, kerb, near pavement */}
        <rect x={0} y={590} width={1920} height={30} fill="#ffd9c0" />
        <rect x={0} y={620} width={1920} height={160} fill="#e9d3c4" />
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={i * 180 - 40} y={696} width={90} height={8} rx={4} fill="#fff" opacity={0.9} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={1220 + i * 50} y={624} width={30} height={152} fill="#fff" opacity={0.95} />
        ))}
        <rect x={1170} y={624} width={8} height={152} fill="#fff" />
        <rect x={0} y={780} width={1920} height={16} fill="#ffb98e" />
        <rect x={0} y={796} width={1920} height={284} fill="#ffeadb" />
        {/* car */}
        <g transform={`translate(${car} 690) scale(0.85)`}>
          <ellipse cx={0} cy={74} rx={200} ry={14} fill="rgba(0,0,0,0.22)" />
          <path d="M -190 40 Q -190 -10 -150 -16 L -90 -20 Q -50 -90 30 -90 L 90 -90 Q 140 -80 170 -20 Q 200 -14 200 30 L 200 50 L -190 50 Z" fill="#2b7bd6" />
          <path d="M -70 -22 Q -36 -76 24 -76 L 30 -22 Z M 46 -22 L 44 -76 L 88 -76 Q 124 -66 146 -22 Z" fill="#cfe6ff" />
          <rect x={-190} y={18} width={390} height={6} fill="#1f5fae" />
          <rect x={186} y={4} width={16} height={14} rx={4} fill="#ffe08a" />
          <rect x={-194} y={6} width={10} height={14} rx={3} fill={t > 46.6 && !green ? '#ff3b3b' : '#c4423f'} />
          <Wheel x={-110} />
          <Wheel x={120} />
        </g>
        {/* pedestrian light next to the crossing */}
        <g transform="translate(1590 796)">
          <rect x={-5} y={-300} width={10} height={300} fill="#5d6570" />
          <rect x={-30} y={-380} width={60} height={110} rx={10} fill="#2a2f38" />
          <circle cx={0} cy={-352} r={18} fill={green ? '#3a2020' : '#ff3b3b'} />
          <circle cx={0} cy={-298} r={18} fill={green ? '#3ddc84' : '#1f3a2a'} />
        </g>
        {/* sign */}
        <g transform="translate(1700 796)">
          <rect x={-6} y={-380} width={12} height={380} fill="#7c8590" />
          <path d="M 0 -470 L 76 -340 L -76 -340 Z" fill="#fff" stroke="#e5243b" strokeWidth={14} strokeLinejoin="round" />
          <g transform="translate(0 -380)" fill={INK}>
            <circle cx={0} cy={-34} r={8} />
            <path d="M -4 -24 L 6 -24 L 10 0 L 18 16 L 10 18 L 2 4 L -6 18 L -14 16 L -6 0 Z" />
          </g>
          <ellipse cx={0} cy={2} rx={40} ry={8} fill="rgba(60,30,10,0.2)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- UI cards ----------------
const Card: React.FC<{x: number; y: number; w: number; h?: number; p: number; out?: number; children: React.ReactNode; pad?: number}> = ({x, y, w, h, p, out = 0, children, pad = 28}) => {
  if (p <= 0 || out >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        padding: pad,
        boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.94)',
        borderRadius: 26,
        boxShadow: '0 24px 60px rgba(90,50,20,0.18), 0 2px 6px rgba(90,50,20,0.08)',
        opacity: p * (1 - out),
        filter: `blur(${(1 - p) * 10 + out * 12}px)`,
        transform: `translateY(${(1 - p) * 40 - out * 30}px) scale(${0.94 + p * 0.06})`,
        transformOrigin: '50% 100%',
        fontFamily: SANS,
        color: INK,
      }}
    >
      {children}
    </div>
  );
};
const Dot: React.FC<{c?: string; n?: string}> = ({c = ORANGE, n}) => (
  <div style={{width: 44, height: 44, borderRadius: 22, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, flexShrink: 0}}>{n ?? '✓'}</div>
);
const Row: React.FC<{p: number; text: string; n?: string; c?: string; size?: number}> = ({p, text, n, c, size = 34}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, height: size * 1.9, opacity: p, transform: `translateX(${(1 - p) * 30}px)`, filter: `blur(${(1 - p) * 6}px)`}}>
    <div style={{transform: `scale(${tw(p, [0, 1], [0.4, 1], EASE.back)})`}}>
      <Dot c={c} n={n} />
    </div>
    <div style={{fontSize: size, fontWeight: 600, letterSpacing: -0.5}}>{text}</div>
  </div>
);
const Ring: React.FC<{x: number; y: number; r: number; t: number; a: number; b: number}> = ({x, y, r, t, a, b}) => {
  const e = env(t, a, b, 0.35);
  if (e <= 0) return null;
  const pulse = 1 + Math.sin((t - a) * 6) * 0.04;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <circle cx={x} cy={y} r={r * (0.7 + 0.3 * e) * pulse} fill="none" stroke={ORANGE} strokeWidth={8} opacity={e} strokeDasharray="22 14" transform={`rotate(${t * 30} ${x} ${y})`} />
    </svg>
  );
};

const Scene: React.FC<{t: number}> = ({t}) => {
  const cx = camX(t);
  const zoom = kf(t, [[0, 1.0], [19.6, 1.0], [21.0, 1.06], [30.6, 1.06], [31.6, 1.0], [48.6, 1.0], [50, 1.04], [60, 1.06]]);
  const dim = env(t, W[97] - 0.3, 62, 0.8);
  
  const lbl = (s: string) => <div style={{fontSize: 22, fontWeight: 600, letterSpacing: 2, color: ORANGE, textTransform: 'uppercase', marginBottom: 10}}>{s}</div>;
  // card windows
  const c1 = ap(t, W[2] - 0.2);
  const c1o = tw(t, [W[17] - 0.6, W[17] - 0.1], [0, 1]);
  const c2 = ap(t, W[17] - 0.1);
  const c2o = tw(t, [W[35] - 0.5, W[35]], [0, 1]);
  const c3 = ap(t, W[40] - 0.2);
  const c3o = tw(t, [W[58] + 0.6, W[58] + 1.2], [0, 1]);
  const c4 = ap(t, W[67] + 0.4);
  const c4o = tw(t, [W[82] - 0.6, W[82] - 0.1], [0, 1]);
  const c5 = ap(t, W[82] + 1.0);
  const c5o = tw(t, [W[97] - 0.4, W[97]], [0, 1]);
  const c6 = ap(t, W[97] + 0.1);
  const c6o = tw(t, [58.6, 59.1], [0, 1]);
  const end = ap(t, 58.9, 0.9);
  return (
    <AbsoluteFill style={{background: '#f3e3cf', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '30% 70%'}}>
        <div style={{position: 'absolute', left: -cx, top: 0, width: 5760, height: 1080}}>
          <div style={{position: 'absolute', left: 0, width: 1920, height: 1080}}>
            <AbsoluteFill style={{background: TC.bg}} /><Back t={t} /><Mid t={t} /><Front t={t} />
          </div>
          <div style={{position: 'absolute', left: 1920, width: 1920, height: 1080}}>
            <Home t={t} />
          </div>
          <div style={{position: 'absolute', left: 3840, width: 1920, height: 1080}}>
            <Road t={t} />
          </div>
        </div>
        {/* item highlight rings (home + road, screen space once the camera settles) */}
        {Math.abs(cx - 1920) < 4 ? (
          <>
            <Ring x={960} y={870} r={140} t={t} a={W[71]} b={W[74]} />
            <Ring x={1180} y={540} r={110} t={t} a={W[74]} b={W[77]} />
            <Ring x={1670} y={460} r={230} t={t} a={W[78]} b={W[82] - 0.3} />
          </>
        ) : null}
        {Math.abs(cx - 3840) < 8 ? <Ring x={1700} y={395} r={120} t={t} a={W[87]} b={W[90]} /> : null}
        <AbsoluteFill style={{background: 'rgba(255,240,222,0.55)', backdropFilter: 'blur(6px)', opacity: dim}} />
        {/* contact shadow + Tunde */}
        <div style={{position: 'absolute', left: tundeX(t), top: 555}}>
          <div style={{position: 'absolute', left: -120, top: 345, width: 240, height: 30, borderRadius: '50%', background: TC.t2, filter: 'blur(3px)'}} />
          <Img src={sf(`tunde3d/v3/f${String(Math.min(1829, Math.floor(t * 15) * 2 + 1)).padStart(4, '0')}.png`)} style={{position: 'absolute', left: -357, top: -545, height: 1000}} />
        </div>
      </AbsoluteFill>

      {/* cards */}
      <Card x={1000} y={250} w={800} p={c1} out={c1o} pad={44}>
        {lbl('Welcome to')}
        <div style={{fontSize: 76, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02}}>
          Advance <span style={{color: ORANGE}}>Safety</span> Practice
        </div>
        <div style={{fontSize: 30, fontWeight: 500, marginTop: 14, opacity: 0.7 * ap(t, W[5])}}>Your practical guide to safety</div>
        <div style={{display: 'flex', gap: 14, marginTop: 28}}>
          {[['At work', 11], ['At home', 13], ['In industry', 16]].map(([s, i]) => {
            const q = ap(t, W[i as number] - 0.1, 0.5);
            return (
              <div key={s} style={{padding: '12px 24px', borderRadius: 40, background: '#fff1e6', color: '#c24a00', fontSize: 26, fontWeight: 600, opacity: q, transform: `scale(${tw(q, [0, 1], [0.6, 1], EASE.back)})`}}>
                {s}
              </div>
            );
          })}
        </div>
      </Card>
      <Card x={1000} y={200} w={800} p={c2} out={c2o} pad={44}>
        <div style={{fontSize: 68, fontWeight: 700, letterSpacing: -2, transform: `scale(${1 - ap(t, W[21] - 0.2) * 0.3})`, transformOrigin: '0 0', height: 82 - ap(t, W[21] - 0.2) * 22}}>
          What is <span style={{color: ORANGE}}>safety?</span>
        </div>
        <div style={{fontSize: 32, fontWeight: 500, lineHeight: 1.35, opacity: ap(t, W[21]), marginTop: 10}}>
          Taking <b>sensible steps</b> to prevent:
        </div>
        <div style={{marginTop: 14}}>
          <Row p={ap(t, W[28] - 0.1)} text="Injuries" n="1" />
          <Row p={ap(t, W[29] - 0.1)} text="Illness" n="2" />
          <Row p={ap(t, W[30] - 0.1)} text="Damage" n="3" />
          <Row p={ap(t, W[32] - 0.1)} text="Unwanted incidents" n="4" />
        </div>
      </Card>
      <Card x={1060} y={180} w={740} p={c3} out={c3o} pad={40}>
        {lbl('On a construction site')}
        <div style={{fontSize: 46, fontWeight: 700, letterSpacing: -1.2, marginBottom: 14}}>A safe worker is…</div>
        <Row p={ap(t, W[42] - 0.1)} text="Wearing correct PPE" />
        <Row p={ap(t, W[47] - 0.1)} text="Following instructions" />
        <Row p={ap(t, W[50] - 0.1)} text="Using tools properly" />
        <div style={{marginTop: 18, padding: '18px 24px', borderRadius: 18, background: ORANGE, color: '#fff', fontSize: 34, fontWeight: 700, opacity: ap(t, W[54] - 0.1), transform: `scale(${tw(ap(t, W[54] - 0.1), [0, 1], [0.8, 1], EASE.back)})`, transformOrigin: '0 50%'}}>
          = Reduced risk
        </div>
      </Card>
      <Card x={780} y={90} w={600} p={c4} out={c4o} pad={34}>
        {lbl('At home')}
        <Row p={ap(t, W[71] - 0.1)} text="Keep walkways clear" size={30} />
        <Row p={ap(t, W[74] - 0.1)} text="Handle electricity carefully" size={30} />
        <Row p={ap(t, W[78] - 0.1)} text="Store products safely" size={30} />
      </Card>
      <Card x={1240} y={110} w={560} p={c5} out={c5o} pad={34}>
        {lbl('On the road')}
        <Row p={ap(t, W[87] - 0.1)} text="Obey traffic signs" size={30} />
        <Row p={ap(t, W[91] - 0.1)} text="Watch other road users" size={30} />
      </Card>
      {/* three principles */}
      {c6 > 0 && c6o < 1 ? (
        <div style={{position: 'absolute', left: 760, top: 150, width: 1040, fontFamily: SANS, color: INK, opacity: 1 - c6o, filter: `blur(${c6o * 12}px)`}}>
          <div style={{opacity: c6, transform: `translateY(${(1 - c6) * 30}px)`}}>
            {lbl('Remember')}
            <div style={{fontSize: 64, fontWeight: 700, letterSpacing: -2, marginBottom: 30}}>Three basic principles</div>
          </div>
          {[
            ['1', 'Identify', 'hazards', 101],
            ['2', 'Assess', 'the risks', 103],
            ['3', 'Take action', 'to control them', 107],
          ].map(([n, a, b, i]) => {
            const q = ap(t, W[i as number] - 0.15, 0.8);
            const lit = env(t, W[i as number] - 0.15, i === 107 ? 99 : W[(i as number) + 2] + 0.2, 0.3);
            return (
              <div
                key={n as string}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  marginBottom: 22,
                  padding: '26px 34px',
                  borderRadius: 24,
                  background: '#fff',
                  boxShadow: `0 20px 50px rgba(90,50,20,${0.1 + lit * 0.12})`,
                  outline: `${3 * lit}px solid ${ORANGE}`,
                  opacity: q,
                  transform: `translateX(${(1 - q) * 80}px) scale(${1 + lit * 0.02})`,
                  filter: `blur(${(1 - q) * 8}px)`,
                }}
              >
                <div style={{width: 76, height: 76, borderRadius: 38, background: ORANGE, color: '#fff', fontSize: 40, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
                <div style={{fontSize: 48, fontWeight: 700, letterSpacing: -1.2}}>
                  {a} <span style={{fontWeight: 500, opacity: 0.65}}>{b}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {/* end card */}
      {end > 0 ? (
        <div style={{position: 'absolute', left: 820, top: 330, width: 980, fontFamily: SANS, color: INK, opacity: end, transform: `translateY(${(1 - end) * 30}px)`, filter: `blur(${(1 - end) * 10}px)`}}>
          <div style={{width: 96, height: 96, borderRadius: 28, background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26}}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round">
              <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" />
              <path d="M8.5 12 L11 14.5 L15.5 9.5" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1}}>
            Advance <span style={{color: ORANGE}}>Safety</span> Practice
          </div>
          <div style={{fontSize: 34, fontWeight: 500, opacity: 0.65, marginTop: 18}}>Safety at work, at home, and in industry.</div>
        </div>
      ) : null}
      {/* captions */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 976, opacity: 1 - end}}>
        <ReplaceCaption t={t} size={44} phrases={PHRASES} />
      </div>
    </AbsoluteFill>
  );
};

// caption phrases: word-index ranges
const CUTS = [0, 5, 10, 17, 21, 28, 35, 40, 47, 53, 58, 67, 74, 77, 82, 87, 90, 97, 101, 106];
const PHRASES = CUTS.map((s, i) => ({
  text: (WORDS as Word[])
    .slice(s, CUTS[i + 1] ?? WORDS.length)
    .map((w) => w.word)
    .join(' '),
  start: W[s],
}));

const Inner: React.FC = () => <Scene t={useCurrentFrame() / 60} />;

export const Safety3D: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile('audio/asp3d_mix.wav')} />
    <CameraMotionBlur shutterAngle={160} samples={4}>
      <Inner />
    </CameraMotionBlur>
  </AbsoluteFill>
);
export const Safety3DFrame: React.FC<{t: number}> = ({t}) => <Scene t={t} />;
