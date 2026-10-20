// 2D character test: rigged worker walks in, waves, taps helmet and vest, thumbs up, lip-synced
// (Rhubarb) to an ElevenLabs Nigerian voice. 1920x1080, 60 fps.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {EASE} from '../kit/core';
import {ReplaceCaption, Word} from '../kit/captions';
import {Pose, Worker} from '../kit/character';
import MOUTH from './tunde.mouth.json';
import WORDS from './tunde.words.json';

const A = 0.6; // audio offset (s)
const W = (WORDS as Word[]).map((w) => ({...w, start: w.start + A}));
const CUES = (MOUTH as {mouthCues: {start: number; end: number; value: string}[]}).mouthCues;

/** keyframed value with in-out easing between keys: [[t, v], ...] */
const kf = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return v0 + (v1 - v0) * EASE.inOut((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
};

const L1 = 135,
  L2 = 120 + 20;
/** 2-bone IK. Returns [shoulder, elbow] in the near-arm convention (+ = toward screen left). */
const ik = (dx: number, dy: number, bend = 1): [number, number] => {
  const d = Math.min(L1 + L2 - 1, Math.max(20, Math.hypot(dx, dy)));
  const base = (Math.atan2(-dx, dy) * 180) / Math.PI;
  const a = (Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)) * 180) / Math.PI;
  const e = 180 - (Math.acos((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)) * 180) / Math.PI;
  return [base + bend * a, -bend * e];
};

export const Site: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #ffd9a8 0%, #ffe9cf 45%, #f3e3cf 62%, #e3cdb3 100%)'}} />
    {/* distant skyline + cranes, soft (depth) */}
    <svg width={1920} height={1080} style={{position: 'absolute', filter: 'blur(3px)', transform: `translateX(${-t * 6}px)`}}>
      <g fill="#e9b98b" opacity={0.75}>
        <rect x={120} y={430} width={170} height={240} />
        <rect x={320} y={380} width={120} height={290} />
        <rect x={1320} y={400} width={200} height={270} />
        <rect x={1560} y={450} width={140} height={220} />
      </g>
      <g stroke="#d99a66" strokeWidth={10} fill="none" opacity={0.85}>
        <path d="M 1450 670 L 1450 220 M 1250 240 L 1780 240 M 1450 220 L 1390 240 M 1450 220 L 1700 240 M 1700 240 L 1700 380" />
        <path d="M 380 670 L 380 300 M 260 320 L 640 320 M 380 300 L 560 320" />
      </g>
      <rect x={1690} y={380} width={22} height={28} fill="#d99a66" />
    </svg>
    {/* ground */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 660, bottom: 0, background: 'linear-gradient(180deg, #d9b994, #caa47c)'}} />
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {/* scaffold block on the right */}
      <g transform="translate(1260 360)" opacity={0.95}>
        <rect x={0} y={0} width={420} height={330} fill="#c98b5c" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={0} y={i * 84} width={420} height={10} fill="#9a6440" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={i * 102} y={-20} width={12} height={360} fill="#5f6b78" />
        ))}
      </g>
      {/* cones */}
      {[
        [1180, 760, 1],
        [1720, 820, 1.25],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx={0} cy={52} rx={60} ry={12} fill="rgba(60,30,10,0.18)" />
          <path d="M -48 50 L -14 -60 L 14 -60 L 48 50 Z" fill="#ff6a13" />
          <path d="M -32 0 L 32 0 L 38 20 L -38 20 Z" fill="#f2f2f2" />
          <rect x={-58} y={44} width={116} height={14} rx={4} fill="#d4500a" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

const Scene: React.FC<{t: number}> = ({t}) => {
  const ta = t - A; // audio time
  const cue = CUES.find((c) => ta >= c.start && ta < c.end);
  const talking = cue && cue.value !== 'X' ? 1 : 0;
  // walk in
  const x = kf(t, [
    [0, -260],
    [1.15, 760],
  ]);
  const walking = t < 1.15 ? 1 : 0;
  const ph = t * 11;
  const step = walking * Math.sin(ph);
  const bob = walking * Math.abs(Math.sin(ph)) * -14 + Math.sin(t * 2.4) * 2.5;
  // gesture weights (0..1) on the near arm
  const wave = kf(t, [
    [0.7, 0],
    [1.0, 1],
    [1.9, 1],
    [2.2, 0],
  ]);
  const helmet = kf(t, [
    [3.15, 0],
    [3.45, 1],
    [3.85, 1],
    [4.0, 0],
  ]);
  const vest = kf(t, [
    [3.95, 0],
    [4.15, 1],
    [4.6, 1],
    [4.85, 0],
  ]);
  const thumb = kf(t, [
    [4.85, 0],
    [5.15, 1],
    [6.6, 1],
    [6.95, 0],
  ]);
  // near-arm hand target (torso-local, relative to shoulder)
  const rest: [number, number] = [-22 + step * -30, 240];
  const targets: [[number, number], number][] = [
    [[-170 + Math.sin(t * 14) * 30, -190], wave],
    [[10, -205], helmet],
    [[40, 90], vest],
  ];
  let hx = rest[0],
    hy = rest[1];
  targets.forEach(([[tx, ty], w]) => {
    hx += (tx - hx) * w;
    hy += (ty - hy) * w;
  });
  const [ls, le] = ik(hx, hy, hy < 100 ? -1 : 1);
  // far arm: swing, then thumbs up
  const fx = 22 + step * 30 + (190 - 22) * thumb,
    fy = 240 + (-30 - 240) * thumb;
  const [rs, re] = ik(-fx, fy, fy < 100 ? -1 : 1);
  const blinkT = (t + 0.3) % 2.8;
  const p: Pose = {
    x,
    y: 610 + bob,
    lean: walking * 4 + Math.sin(t * 1.3) * 1.2 + thumb * -2,
    head: Math.sin(t * 6.5) * 3.5 * talking + Math.sin(t * 0.9) * 2 + wave * -4,
    lShoulder: ls,
    lElbow: le,
    rShoulder: -rs,
    rElbow: -re,
    lHip: step * 14,
    lKnee: Math.max(0, -step) * 22,
    rHip: -step * 14,
    rKnee: Math.max(0, step) * 22,
    blink: blinkT < 0.12 ? Math.sin((blinkT / 0.12) * Math.PI) : 0,
    mouth: cue ? cue.value : 'X',
    look: Math.sin(t * 0.7) * 0.6,
    hand: thumb > 0.5 ? 'thumb' : helmet + vest > 0.5 ? 'point' : 'open',
  };
  const cam = 1 + t * 0.006;
  return (
    <AbsoluteFill style={{transform: `scale(${cam})`}}>
      <Site t={t} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <Worker p={p} scale={0.78} farFront={thumb > 0.3} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 930}}>
        <ReplaceCaption t={t} size={54} phrases={[{text: "Hello, I'm Tunde.", start: W[0].start}, {text: 'Before you step on site,', start: W[3].start}, {text: 'put on your helmet and your vest.', start: W[8].start}, {text: 'Safety first, every time.', start: W[15].start}]} />
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene t={f / 60} />;
};

export const CharTest: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={Math.round(A * 60)}>
      <Audio src={staticFile('audio/tunde.wav')} />
    </Sequence>
    <CameraMotionBlur shutterAngle={180} samples={5}>
      <Inner />
    </CameraMotionBlur>
  </AbsoluteFill>
);
