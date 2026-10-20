// Rebuild of reference 17 (jup.creatives "Apple Health"), brand swapped to a fictional "Pulse".
// VO-driven: every word and beat is placed from ElevenLabs word timings (pulse.words.json).
// Light look: white + red glow, pink photo-ring beat, 3D watch (Blender sequence), icon -> card wipe.
// 1080x1920, 60 fps.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {EASE, prog, tw} from '../kit/core';
import {SANS, SERIF} from '../kit/fonts';
import {Icon, hexA} from '../kit/ui';
import {CaptionLine, ReplaceCaption, Word} from '../kit/captions';
import WORDS from './pulse.words.json';

const W = WORDS as Word[];
const RED = '#E5243B';
const INK = '#141414';
const PINK_A = '#ff4f6d';
const PINK_B = '#ff9db0';
const at = (i: number) => W[i].start;
const words = (a: number, b: number) => W.slice(a, b + 1);

const Blobs: React.FC<{t: number; colors: string[]; opacity?: number}> = ({t, colors, opacity = 1}) => (
  <AbsoluteFill style={{overflow: 'hidden', opacity}}>
    {colors.map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: c,
          filter: 'blur(170px)',
          left: `${[10, 80, 30, 75][i % 4] + Math.sin(t * 0.6 + i * 2) * 8}%`,
          top: `${[8, 30, 85, 70][i % 4] + Math.cos(t * 0.5 + i) * 6}%`,
          transform: 'translate(-50%,-50%)',
        }}
      />
    ))}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 0.4–2.4 s: "Your body is constantly -> changing."
const Hook: React.FC<{t: number}> = ({t}) => {
  if (t > 2.6) return null;
  const out = prog(t * 60, 2.05 * 60, 2.45 * 60, EASE.inOut);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-out * 520}px) scale(${1 - out * 0.45})`,
        opacity: 1 - prog(t * 60, 2.25 * 60, 2.55 * 60),
        filter: `blur(${out * 6}px)`,
      }}
    >
      <div style={{position: 'absolute', left: 540, top: 800}}>
        <CaptionLine words={words(0, 2)} t={t} size={118} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 950}}>
        <CaptionLine words={[{word: 'constantly', start: at(3)}]} t={t} size={118} morph={{index: 0, to: 'changing.', at: at(4) - 0.05}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2.2–7.0 s: watch-face cards, "tells a story"
const HeartFace: React.FC<{t: number}> = ({t}) => {
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.4)), 6);
  const ecg = 'M 20 60 L 120 60 L 150 20 L 180 100 L 205 40 L 225 60 L 420 60';
  const e = evolvePath(((t * 0.9) % 1) + 0.0001, ecg);
  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, color: RED, fontSize: 40, fontWeight: 600}}>
        <div style={{transform: `scale(${1 + beat * 0.18})`}}>
          <Icon name="heart" size={56} color={RED} />
        </div>
        Heart Rate
      </div>
      <div style={{fontSize: 170, fontWeight: 600, color: '#fff', letterSpacing: -6, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
        {Math.round(68 + Math.sin(t * 1.3) * 4)}
        <span style={{fontSize: 52, color: '#9a9aa0', letterSpacing: 0, marginLeft: 12}}>BPM</span>
      </div>
      <svg width={440} height={120} style={{marginTop: 20}}>
        <path d={ecg} fill="none" stroke={hexA(RED, 0.25)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={ecg}
          fill="none"
          stroke={RED}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={e.strokeDasharray}
          strokeDashoffset={e.strokeDashoffset}
          style={{filter: `drop-shadow(0 0 10px ${RED})`}}
        />
      </svg>
    </>
  );
};

const Ring: React.FC<{r: number; w: number; p: number; color: string}> = ({r, w, p, color}) => {
  const d = `M 210 ${210 - r} A ${r} ${r} 0 1 1 ${209.99} ${210 - r}`;
  const e = evolvePath(Math.max(0.0001, p), d);
  return (
    <>
      <path d={d} fill="none" stroke={hexA(color, 0.22)} strokeWidth={w} />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
    </>
  );
};

const SleepFace: React.FC<{p: number}> = ({p}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, color: '#8f8bff', fontSize: 40, fontWeight: 600}}>
      <Icon name="moon" size={50} color="#8f8bff" />
      Sleep Score
    </div>
    <div style={{position: 'relative', width: 420, height: 420, marginTop: 10}}>
      <svg width={420} height={420}>
        <Ring r={170} w={34} p={0.84 * p} color="#8f8bff" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 150, fontWeight: 600, letterSpacing: -5}}>
        {Math.round(84 * p)}
      </div>
    </div>
  </>
);

const ActivityFace: React.FC<{p: number}> = ({p}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, color: '#b6ff3b', fontSize: 40, fontWeight: 600}}>
      <Icon name="flame" size={50} color="#ff3b6b" />
      Activity
    </div>
    <svg width={420} height={420} style={{marginTop: 10}}>
      <Ring r={180} w={40} p={0.92 * p} color="#ff2d55" />
      <Ring r={132} w={40} p={0.74 * p} color="#a6ff00" />
      <Ring r={84} w={40} p={0.58 * p} color="#19d3ff" />
    </svg>
  </>
);

const CARD_COL = ['#ff2d55', '#7b74ff', '#5bff7a'];

const Cards: React.FC<{t: number}> = ({t}) => {
  if (t < 2.1 || t > 7.2) return null;
  const f = t * 60;
  const enter = [at(5) - 0.08, at(7) - 0.08, at(9) - 0.08];
  // camera focus slides to the newest card, then settles on the middle one for the overview
  let focus = 0;
  enter.forEach((e, i) => i > 0 && (focus += tw(f, [e * 60, e * 60 + 22], [0, 1], EASE.inOut)));
  const ov = prog(f, 4.9 * 60, 5.4 * 60, EASE.inOut);
  focus = focus + (1 - focus) * ov;
  const scale = 1 - ov * 0.56;
  const y = 860 - ov * 220;
  const out = prog(f, 6.75 * 60, 7.1 * 60, EASE.in);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 20}px)`, transform: `translateY(${-out * 200}px)`}}>
      {enter.map((e, i) => {
        const lf = f - e * 60;
        if (lf < 0) return null;
        const sharp = prog(lf, 4, 26, EASE.out);
        const x = 540 + (i - focus) * 660 * scale;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${scale * tw(lf, [0, 26], [0.7, 1], EASE.out)})`}}>
            {/* the colour blob it grows out of */}
            <div
              style={{
                position: 'absolute',
                left: 300 - 260,
                top: 340 - 260,
                width: 520,
                height: 520,
                borderRadius: '50%',
                background: CARD_COL[i],
                filter: 'blur(70px)',
                opacity: tw(lf, [0, 6, 30], [0, 0.9, 0.18]),
              }}
            />
            <div
              style={{
                position: 'relative',
                width: 600,
                height: 680,
                borderRadius: 120,
                background: '#000',
                boxShadow: `0 50px 120px rgba(0,0,0,0.28), 0 0 0 6px #1d1d20`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SANS,
                opacity: sharp,
                filter: `blur(${(1 - sharp) * 40}px)`,
              }}
            >
              {i === 0 ? <HeartFace t={t} /> : i === 1 ? <SleepFace p={prog(lf, 8, 50, EASE.count)} /> : <ActivityFace p={prog(lf, 8, 56, EASE.count)} />}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1380, opacity: 1 - ov}}>
        <ReplaceCaption
          t={t}
          size={96}
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
  const f = t * 60;
  const rot = tw(f, [5.0 * 60, 6.2 * 60], [-9, -2], EASE.out);
  const line = 'M 0 40 C 160 0, 320 80, 480 30 S 760 10, 860 40';
  const e = evolvePath(Math.max(0.0001, prog(f, 5.05 * 60, 6.1 * 60, EASE.inOut)), line);
  const out = prog(f, 6.75 * 60, 7.1 * 60, EASE.in);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 14}px)`}}>
      <div style={{position: 'absolute', left: 540, top: 1000, transform: `rotate(${rot}deg)`}}>
        <CaptionLine words={words(11, 15)} t={t} size={112} italicIdx={[4]} italicFamily={SERIF} />
        <svg width={860} height={90} style={{position: 'absolute', left: -430, top: 150, overflow: 'visible'}}>
          <path d={line} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6.9–9.5 s: pink ring of moments around the question
const TILES: [string, string, string][] = [
  ['heart', '#ff2d55', '#ff7a59'],
  ['moon', '#5b4bff', '#9b8cff'],
  ['flame', '#ff8a00', '#ffd23f'],
  ['drop', '#0fb5ff', '#7be0ff'],
  ['steps', '#22c55e', '#a6f04b'],
  ['bolt', '#ffb800', '#ff6a00'],
  ['pulse', '#ff2d55', '#c81d4e'],
  ['moon', '#2b2d6e', '#6f63ff'],
  ['heart', '#ff5f8f', '#ffa3c0'],
  ['steps', '#0ea5a4', '#5eead4'],
  ['drop', '#3b82f6', '#93c5fd'],
  ['flame', '#ef4444', '#f97316'],
];

const BigPicture: React.FC<{t: number}> = ({t}) => {
  if (t < 6.8 || t > 9.7) return null;
  const f = t * 60;
  const wipe = prog(f, 6.85 * 60, 7.25 * 60, EASE.inOut);
  const out = prog(f, 9.3 * 60, 9.6 * 60, EASE.in);
  const spin = (t - 6.8) * 9;
  const zoom = tw(f, [6.9 * 60, 9.5 * 60], [1.25, 0.95], EASE.out) * (1 + out * 0.3);
  const box = prog(f, 7.05 * 60, 7.35 * 60, EASE.back);
  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe * 120}% at 50% 50%)`, filter: `blur(${out * 24}px)`, opacity: 1 - out * 0.6}}>
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${PINK_A}, ${PINK_B})`}} />
      <Blobs t={t} colors={['#ff2d55', '#ffc2cf', '#ff6f91', '#ffd6e0']} opacity={0.7} />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {TILES.map(([ic, a, b], i) => {
          const ang = ((i / TILES.length) * 360 + spin) * (Math.PI / 180);
          const r = i % 2 ? 470 : 600;
          const pop = prog(f, (6.95 + i * 0.035) * 60, (7.25 + i * 0.035) * 60, EASE.back);
          const s = i % 3 === 0 ? 230 : 190;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 540 + Math.cos(ang) * r * 0.82,
                top: 960 + Math.sin(ang) * r * 1.25,
                width: s,
                height: s * 1.25,
                borderRadius: 40,
                background: `linear-gradient(150deg, ${a}, ${b})`,
                boxShadow: '0 30px 60px rgba(120,0,30,0.25), inset 0 0 0 3px rgba(255,255,255,0.25)',
                transform: `translate(-50%,-50%) rotate(${Math.sin(i * 1.7) * 8}deg) scale(${pop})`,
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
          left: 540 - 470,
          top: 960 - 180,
          width: 940,
          height: 360,
          borderRadius: 48,
          border: '4px solid rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          transform: `scale(${0.8 + box * 0.2})`,
          opacity: Math.min(1, box),
        }}
      />
      <div style={{position: 'absolute', left: 540, top: 960 - 118}}>
        <CaptionLine words={words(16, 19)} t={t} size={76} color="#fff" accent="#7a0019" />
      </div>
      <div style={{position: 'absolute', left: 540, top: 960 + 2}}>
        <CaptionLine words={words(20, 23)} t={t} size={76} color="#fff" accent="#7a0019" />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 9.4–10.9 s: 3D watch + glass widgets, icon -> white
const GLASS: {label: string; value: string; icon: string; x: number; y: number; d: number; color: string}[] = [
  {label: 'Steps', value: '8,421', icon: 'steps', x: 250, y: 560, d: 0.0, color: '#22c55e'},
  {label: 'Sleep', value: '7h 40m', icon: 'moon', x: 830, y: 760, d: 0.08, color: '#6f63ff'},
  {label: 'HRV', value: '62 ms', icon: 'pulse', x: 270, y: 1400, d: 0.16, color: '#ff2d55'},
  {label: 'Water', value: '1.8 L', icon: 'drop', x: 820, y: 1500, d: 0.24, color: '#0fb5ff'},
];

const AppIcon: React.FC<{size: number}> = ({size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.235,
      background: '#fff',
      boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(160,0,40,0.25)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5f6d" />
          <stop offset="1" stopColor="#e5243b" />
        </linearGradient>
      </defs>
      <path fill="url(#pg)" d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
      <path d="M5 12.5h3.2l1.6-3 2.4 6 2-4.2 1 1.2H19" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const WatchBeat: React.FC<{t: number}> = ({t}) => {
  if (t < 9.3 || t > 11.1) return null;
  const f = t * 60;
  const inn = prog(f, 9.3 * 60, 9.55 * 60);
  const n = Math.min(45, Math.max(1, Math.floor((t - 9.35) * 30) + 1));
  const float = Math.sin(t * 2.2) * 12;
  const icon = prog(f, 10.4 * 60, 10.6 * 60, EASE.back);
  const grow = tw(f, [10.6 * 60, 10.95 * 60], [1, 16], EASE.in);
  return (
    <AbsoluteFill style={{opacity: inn}}>
      <AbsoluteFill style={{background: `linear-gradient(200deg, ${PINK_B}, ${PINK_A})`}} />
      <Blobs t={t} colors={['#ffe0e7', '#ff2d55', '#ffb3c4', '#ff6f91']} opacity={0.8} />
      {GLASS.map((g, i) => {
        const p = prog(f, (9.62 + g.d) * 60, (9.9 + g.d) * 60, EASE.out);
        const par = (t - 9.6) * (i % 2 ? -40 : 40);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: g.x,
              top: g.y + par + (1 - p) * 120,
              transform: `translate(-50%,-50%) rotate(${i % 2 ? 4 : -4}deg)`,
              opacity: p * (1 - prog(f, 10.45 * 60, 10.65 * 60)),
              filter: `blur(${(1 - p) * 16}px)`,
              padding: '30px 40px',
              minWidth: 300,
              borderRadius: 44,
              background: 'rgba(255,255,255,0.28)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.55), 0 30px 60px rgba(150,0,40,0.18)',
              fontFamily: SANS,
              color: '#fff',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 600, opacity: 0.95}}>
              <Icon name={g.icon} size={38} color="#fff" stroke={2.6} />
              {g.label}
            </div>
            <div style={{fontSize: 76, fontWeight: 700, letterSpacing: -2, marginTop: 6, whiteSpace: 'nowrap'}}>{g.value}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 540, top: 1000 + float, transform: `translate(-50%,-50%) scale(${1.45 * (1 - icon * 0.3)})`, opacity: 1 - icon}}>
        <Img src={staticFile(`watch/w_${String(n).padStart(4, '0')}.png`)} style={{width: 660, height: 880, display: 'block'}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 200}}>
        <CaptionLine words={[W[24]]} t={t} size={130} weight={700} color="#fff" accent="#7a0019" />
      </div>
      {f > 10.4 * 60 ? (
        <div style={{position: 'absolute', left: 540, top: 1000, transform: `translate(-50%,-50%) scale(${icon * grow})`}}>
          <AppIcon size={260} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10.9–14 s: "Listen to your body." + logo
const Close: React.FC<{t: number}> = ({t}) => {
  if (t < 10.85) return null;
  const f = t * 60;
  const capOut = prog(f, 12.35 * 60, 12.65 * 60, EASE.in);
  const logo = prog(f, 12.55 * 60, 12.95 * 60);
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Blobs t={t} colors={['#ffe3e8', '#ffd0d8', '#fff0f2', '#ffd9e0']} opacity={0.8} />
      <div style={{position: 'absolute', left: 540, top: 880, opacity: 1 - capOut, filter: `blur(${capOut * 14}px)`, transform: `translateY(${-capOut * 60}px)`}}>
        <CaptionLine words={words(25, 28)} t={t} size={100} />
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: logo, filter: `blur(${(1 - logo) * 20}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, transform: `scale(${tw(f, [12.55 * 60, 14 * 60], [1.08, 1], EASE.out)})`}}>
          <AppIcon size={170} />
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 150, letterSpacing: -6, color: INK}}>Pulse</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PulseStory: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Audio src={staticFile('audio/pulse_mix.wav')} />
      <Blobs t={t} colors={['#ffe3e8', '#fff0f2', '#ffd6dd', '#ffeef1']} />
      <Hook t={t} />
      <Cards t={t} />
      <Story t={t} />
      <BigPicture t={t} />
      <WatchBeat t={t} />
      <Close t={t} />
    </AbsoluteFill>
  );
};
