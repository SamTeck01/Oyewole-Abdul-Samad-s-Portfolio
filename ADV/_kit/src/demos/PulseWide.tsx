// Pulse v2, 16:9. Same VO as PulseStory, rebuilt on the smoothness rules learned from ref 05/17:
// real motion blur on every move, nothing ever fully still (slow camera drift), blob -> card shape
// morphs instead of pops, long in-out eases, small elegant type with lots of air.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {evolvePath} from '@remotion/paths';
import {EASE, prog, tw} from '../kit/core';
import {SANS, SERIF} from '../kit/fonts';
import {Icon, hexA} from '../kit/ui';
import {CaptionLine, ReplaceCaption, Word} from '../kit/captions';
import {ActivityFace, AppIcon, Blobs, GLASS, HeartFace, SleepFace, TILES} from './PulseStory';
import WORDS from './pulse.words.json';

const W = WORDS as Word[];
const RED = '#E5243B';
const INK = '#141414';
const at = (i: number) => W[i].start;
const S = (s: number) => s * 60;
const SMOOTH = EASE.inOut;

/** slow continuous push-in so no frame is ever static (ref 05: chart keeps drifting during holds) */
const Drift: React.FC<{t: number; t0: number; children: React.ReactNode; amt?: number}> = ({t, t0, children, amt = 0.018}) => (
  <AbsoluteFill style={{transform: `scale(${1 + Math.max(0, t - t0) * amt}) translateY(${-Math.max(0, t - t0) * 4}px)`}}>{children}</AbsoluteFill>
);

// ---------------- hook: one line, then it shrinks to the top and stays (ref 17 0-4.5 s)
const Hook: React.FC<{t: number}> = ({t}) => {
  if (t > 5.2) return null;
  const f = S(t);
  const up = prog(f, S(2.0), S(2.6), SMOOTH);
  const out = prog(f, S(4.75), S(5.1), SMOOTH);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
      <div style={{position: 'absolute', left: 960, top: 480 - up * 400, transform: `scale(${1 - up * 0.55})`}}>
        <CaptionLine words={W.slice(0, 4)} t={t} size={92} morph={{index: 3, to: 'changing.', at: at(4) - 0.05}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- cards grow out of a red pill that rises from below (blob -> card morph)
type Slot = {x: number; y: number; s: number};
const MorphCard: React.FC<{lf: number; from: Slot; to: Slot; color: string; children: React.ReactNode}> = ({lf, from, to, color, children}) => {
  const p = prog(lf, 0, 34, SMOOTH); // travel
  const m = prog(lf, 10, 40, SMOOTH); // shape: pill -> rounded square
  const c = prog(lf, 22, 46, EASE.out); // content resolves
  const w = 300 + (380 - 300) * m,
    h = 64 + (440 - 64) * m;
  return (
    <div
      style={{
        position: 'absolute',
        left: from.x + (to.x - from.x) * p,
        top: from.y + (to.y - from.y) * p,
        width: w,
        height: h,
        transform: `translate(-50%,-50%) scale(${from.s + (to.s - from.s) * p})`,
        borderRadius: 32 + 54 * m,
        background: `linear-gradient(160deg, ${color}, ${hexA('#000000', 0)}), #000`,
        backgroundBlendMode: 'normal',
        boxShadow: `0 40px 90px rgba(80,0,10,${0.1 + 0.15 * m}), 0 0 ${60 * (1 - c)}px ${hexA(color, 0.6 * (1 - c))}`,
        overflow: 'hidden',
        filter: `blur(${(1 - c) * 6}px)`,
      }}
    >
      <AbsoluteFill style={{background: color, opacity: 1 - c}} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%,-50%) scale(${0.62 * (0.9 + 0.1 * c)})`,
          opacity: c,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: SANS,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Cards: React.FC<{t: number}> = ({t}) => {
  if (t < 2.0 || t > 7.2) return null;
  const f = S(t);
  const e = [at(5) - 0.25, at(7) - 0.2, at(9) - 0.2].map(S);
  // layout moves (all eased in-out over ~0.55 s)
  const spread1 = prog(f, e[1], e[1] + 34, SMOOTH); // heart moves left to make room
  const spread2 = prog(f, e[2], e[2] + 34, SMOOTH);
  const lift = prog(f, S(4.85), S(5.4), SMOOTH); // overview for "tells a story"
  const out = prog(f, S(6.75), S(7.1), SMOOTH);
  const Y = 540 - lift * 120 - out * 80;
  const sc = 1 - lift * 0.2;
  const heartX = 960 - spread1 * 300 - spread2 * 160;
  const slots: Slot[] = [
    {x: heartX, y: Y, s: sc},
    {x: 960 + 300 + spread2 * 160, y: Y, s: sc},
    {x: 960, y: Y, s: sc * (1 + 0.08 * (1 - lift))},
  ];
  const froms: Slot[] = [
    {x: 960, y: 1250, s: 0.9},
    {x: 2150, y: Y, s: 0.9},
    {x: 960, y: 1250, s: 0.9},
  ];
  const faces = [
    <HeartFace key="h" t={t} />,
    <SleepFace key="s" p={prog(f - e[1], 26, 70, EASE.count)} />,
    <ActivityFace key="a" p={prog(f - e[2], 26, 74, EASE.count)} />,
  ];
  const cols = ['#d3122f', '#3d36c9', '#d3122f'];
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 14}px)`}}>
      {[0, 1, 2].map((i) => {
        const lf = f - e[i];
        if (lf < 0) return null;
        // once landed, cards follow their slot (layout moves)
        const to = slots[i];
        return (
          <MorphCard key={i} lf={lf} from={froms[i]} to={to} color={cols[i]}>
            {faces[i]}
          </MorphCard>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, opacity: 1 - lift}}>
        <ReplaceCaption
          t={t}
          size={58}
          phrases={[
            {text: 'Every beat.', start: at(5)},
            {text: 'Every night.', start: at(7)},
            {text: 'Every move.', start: at(9)},
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

const Story: React.FC<{t: number}> = ({t}) => {
  if (t < 4.9 || t > 7.2) return null;
  const f = S(t);
  const rot = tw(f, [S(5.0), S(6.6)], [-5, -1], SMOOTH);
  const line = 'M 0 30 C 160 0, 320 60, 480 24 S 760 8, 860 30';
  const e = evolvePath(Math.max(0.0001, prog(f, S(5.05), S(6.2), SMOOTH)), line);
  const out = prog(f, S(6.75), S(7.1), SMOOTH);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
      <div style={{position: 'absolute', left: 960, top: 800, transform: `rotate(${rot}deg)`}}>
        <CaptionLine words={W.slice(11, 16)} t={t} size={84} italicIdx={[4]} italicFamily={SERIF} />
        <svg width={860} height={70} style={{position: 'absolute', left: -430, top: 112, overflow: 'visible'}}>
          <path d={line} fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const BigPicture: React.FC<{t: number}> = ({t}) => {
  if (t < 6.8 || t > 9.7) return null;
  const f = S(t);
  const wipe = prog(f, S(6.85), S(7.35), SMOOTH);
  const out = prog(f, S(9.25), S(9.6), SMOOTH);
  const spin = (t - 6.8) * 7;
  const zoom = tw(f, [S(6.9), S(9.6)], [1.18, 0.98], EASE.out) * (1 + out * 0.25);
  const box = prog(f, S(7.0), S(7.45), SMOOTH);
  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe * 120}% at 50% 50%)`, filter: `blur(${out * 20}px)`, opacity: 1 - out * 0.6}}>
      <AbsoluteFill style={{background: 'linear-gradient(160deg, #ff4f6d, #ff9db0)'}} />
      <Blobs t={t} colors={['#ff2d55', '#ffc2cf', '#ff6f91', '#ffd6e0']} opacity={0.7} />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {TILES.map(([ic, a, b], i) => {
          const ang = ((i / TILES.length) * 360 + spin) * (Math.PI / 180);
          const r = i % 2 ? 1 : 1.18;
          const pop = prog(f, S(6.95 + i * 0.04), S(7.45 + i * 0.04), SMOOTH);
          const s = i % 3 === 0 ? 170 : 140;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 + Math.cos(ang) * 640 * r,
                top: 540 + Math.sin(ang) * 380 * r,
                width: s,
                height: s * 1.25,
                borderRadius: 32,
                background: `linear-gradient(150deg, ${a}, ${b})`,
                boxShadow: '0 24px 50px rgba(120,0,30,0.22), inset 0 0 0 2px rgba(255,255,255,0.25)',
                transform: `translate(-50%,-50%) rotate(${Math.sin(i * 1.7) * 8}deg) scale(${pop})`,
                opacity: pop,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={ic} size={s * 0.42} color="#fff" stroke={2.4} />
            </div>
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 960 - 420,
          top: 540 - 120,
          width: 840,
          height: 240,
          borderRadius: 40,
          border: '3px solid rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          transform: `scale(${0.9 + box * 0.1})`,
          opacity: box,
        }}
      />
      <div style={{position: 'absolute', left: 960, top: 540 - 82}}>
        <CaptionLine words={W.slice(16, 20)} t={t} size={60} color="#fff" accent="#7a0019" />
      </div>
      <div style={{position: 'absolute', left: 960, top: 540 + 4}}>
        <CaptionLine words={W.slice(20, 24)} t={t} size={60} color="#fff" accent="#7a0019" />
      </div>
    </AbsoluteFill>
  );
};

const WIDE_GLASS = [
  {x: 470, y: 330},
  {x: 1450, y: 300},
  {x: 430, y: 760},
  {x: 1490, y: 780},
];

const WatchBeat: React.FC<{t: number}> = ({t}) => {
  if (t < 9.25 || t > 11.1) return null;
  const f = S(t);
  const inn = prog(f, S(9.25), S(9.6), SMOOTH);
  const n = Math.min(45, Math.max(1, Math.floor((t - 9.3) * 30) + 1));
  const float = Math.sin(t * 2) * 8;
  const icon = prog(f, S(10.35), S(10.6), SMOOTH);
  const grow = tw(f, [S(10.55), S(10.95)], [1, 14], EASE.in);
  return (
    <AbsoluteFill style={{opacity: inn}}>
      <AbsoluteFill style={{background: 'linear-gradient(200deg, #ff9db0, #ff4f6d)'}} />
      <Blobs t={t} colors={['#ffe0e7', '#ff2d55', '#ffb3c4', '#ff6f91']} opacity={0.8} />
      {GLASS.map((g, i) => {
        const p = prog(f, S(9.55 + g.d), S(10.0 + g.d), SMOOTH);
        const pos = WIDE_GLASS[i];
        const par = (t - 9.5) * (i % 2 ? -24 : 24);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x + (i % 2 ? 1 : -1) * (1 - p) * 160,
              top: pos.y + par,
              transform: `translate(-50%,-50%) rotate(${i % 2 ? 3 : -3}deg)`,
              opacity: p * (1 - prog(f, S(10.35), S(10.6))),
              padding: '22px 30px',
              minWidth: 240,
              borderRadius: 34,
              background: 'rgba(255,255,255,0.28)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.55), 0 24px 50px rgba(150,0,40,0.18)',
              fontFamily: SANS,
              color: '#fff',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 600}}>
              <Icon name={g.icon} size={30} color="#fff" stroke={2.6} />
              {g.label}
            </div>
            <div style={{fontSize: 56, fontWeight: 700, letterSpacing: -1.5, marginTop: 4, whiteSpace: 'nowrap'}}>{g.value}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 960, top: 560 + float, transform: `translate(-50%,-50%) scale(${1.12 * (1 - icon * 0.25)})`, opacity: 1 - icon}}>
        <Img src={staticFile(`watch/w_${String(n).padStart(4, '0')}.png`)} style={{width: 660, height: 880, display: 'block'}} />
      </div>
      <div style={{position: 'absolute', left: 960, top: 90}}>
        <CaptionLine words={[W[24]]} t={t} size={88} weight={700} color="#fff" accent="#7a0019" />
      </div>
      {f > S(10.35) ? (
        <div style={{position: 'absolute', left: 960, top: 560, transform: `translate(-50%,-50%) scale(${icon * grow})`}}>
          <AppIcon size={200} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Close: React.FC<{t: number}> = ({t}) => {
  if (t < 10.85) return null;
  const f = S(t);
  const capOut = prog(f, S(12.3), S(12.7), SMOOTH);
  const logo = prog(f, S(12.5), S(13.0), SMOOTH);
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Blobs t={t} colors={['#ffe3e8', '#ffd0d8', '#fff0f2', '#ffd9e0']} opacity={0.8} />
      <Drift t={t} t0={10.85} amt={0.02}>
        <div style={{position: 'absolute', left: 960, top: 480, opacity: 1 - capOut, filter: `blur(${capOut * 12}px)`, transform: `translateY(${-capOut * 50}px)`}}>
          <CaptionLine words={W.slice(25, 29)} t={t} size={92} />
        </div>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: logo, filter: `blur(${(1 - logo) * 18}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <AppIcon size={130} />
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 116, letterSpacing: -4, color: INK}}>Pulse</div>
          </div>
        </AbsoluteFill>
      </Drift>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#fff'}}>
    <Blobs t={t} colors={['#ffe3e8', '#fff0f2', '#ffd6dd', '#ffeef1']} />
    <Drift t={t} t0={0}>
      <Hook t={t} />
      <Cards t={t} />
      <Story t={t} />
    </Drift>
    <BigPicture t={t} />
    <WatchBeat t={t} />
    <Close t={t} />
  </AbsoluteFill>
);

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene t={f / 60} />;
};

export const PulseWide: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile('audio/pulse_mix.wav')} />
    <CameraMotionBlur shutterAngle={200} samples={6}>
      <Inner />
    </CameraMotionBlur>
  </AbsoluteFill>
);
