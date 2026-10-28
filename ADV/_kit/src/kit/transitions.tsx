// Transitions, flashes and finishing layers measured in the deep studies.
// All take the frame `f` (60 fps; 30 fps reference counts are doubled) and are pure.
import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, random, spring, useVideoConfig} from 'remotion';
import {EASE, lerp, prog, tw} from './core';
import {Dither, hexA} from './ui';
import {useFid, type Ease} from './camera';

// ---------------------------------------------------------------------------
// directional motion blur
// ---------------------------------------------------------------------------
/**
 * Directional blur via an SVG gaussian with separate x/y deviation (07.5 `stdDeviation="0 40"`).
 * Cheap, deterministic, works for children driven by props (CameraMotionBlur only blurs
 * useCurrentFrame-driven children). `ghosts` adds offset copies for a streakier smear.
 */
export const DirBlur: React.FC<{
  sx?: number;
  sy?: number;
  ghosts?: number; // extra trailing copies (0 = pure gaussian)
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({sx = 0, sy = 0, ghosts = 0, children, style}) => {
  const id = useFid('db');
  const on = Math.abs(sx) + Math.abs(sy) > 0.3;
  return (
    <AbsoluteFill style={style}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${Math.abs(sx)} ${Math.abs(sy)}`} />
          </filter>
        </svg>
      )}
      {on &&
        Array.from({length: ghosts}).map((_, i) => (
          <AbsoluteFill
            key={i}
            style={{
              filter: `url(#${id})`,
              opacity: 0.35 * (1 - i / ghosts),
              transform: `translate(${-sx * 1.6 * (i + 1)}px,${-sy * 1.6 * (i + 1)}px)`,
            }}
          >
            {children}
          </AbsoluteFill>
        ))}
      <AbsoluteFill style={{filter: on ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** velocity (px/frame) of a position function, for blur = |v| * k */
export const vel = (pos: (f: number) => number, f: number) => pos(f + 0.5) - pos(f - 0.5);

// ---------------------------------------------------------------------------
// whip pan (01 T3, 04 T4, 06.6, 09.8)
// ---------------------------------------------------------------------------
export type Dir = 'left' | 'right' | 'up' | 'down';
const DV: Record<Dir, [number, number]> = {left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1]};

/**
 * Whip pan. A exits `dir` (01: 900 px @1024 in 4 f, expo-in -> 1700 px in 8 f @1080p);
 * B lands from the opposite side, blurred, settling over `settle` f (01: 8 f @30 -> 16).
 * `blackGap` inserts black frames between (06.6 uses 2). `overshoot` adds a spring land (04 T4: 12 px).
 */
export const WhipPan: React.FC<{
  f: number;
  at: number;
  a: React.ReactNode;
  b: React.ReactNode;
  dir?: Dir;
  dur?: number;
  dist?: number;
  settle?: number;
  enter?: number; // how far B starts from rest (px)
  blurK?: number; // px of std per px/frame of velocity
  blackGap?: number;
  overshoot?: number;
  bg?: string;
}> = ({f, at, a, b, dir = 'left', dur = 8, dist = 1700, settle = 16, enter = 520, blurK = 0.09, blackGap = 0, overshoot = 0, bg = '#000'}) => {
  const {width, height} = useVideoConfig();
  const [dx, dy] = DV[dir];
  const outPos = (t: number) => tw(t, [at, at + dur], [0, dist], Easing.in(Easing.exp));
  const s0 = at + dur + blackGap;
  const inPos = (t: number) => {
    const base = tw(t, [s0, s0 + settle], [enter, 0], Easing.out(Easing.exp));
    if (!overshoot || t < s0) return base;
    const sp = spring({frame: t - s0, fps: 60, config: {damping: 14, stiffness: 160}});
    return base - overshoot * Math.sin(Math.min(1, sp) * Math.PI) * (1 - prog(t, s0, s0 + settle * 2));
  };
  if (blackGap > 0) {
    // 06.6 style: intentional black frames between the two halves
    if (f < at + dur) {
      const p = outPos(f);
      const v = Math.abs(vel(outPos, f));
      return (
        <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
          <AbsoluteFill style={{transform: `translate(${dx * p}px,${dy * p}px)`}}>
            <DirBlur sx={dx * v * blurK} sy={dy * v * blurK} ghosts={v > 60 ? 3 : 0}>
              {a}
            </DirBlur>
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }
    if (f < s0) return <AbsoluteFill style={{background: bg}} />;
    const p = inPos(f);
    const v = Math.abs(vel(inPos, f));
    return (
      <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `translate(${-dx * p}px,${-dy * p}px)`}}>
          <DirBlur sx={dx ? v * blurK * 1.6 : 0} sy={dy ? v * blurK * 1.6 : 0}>
            {b}
          </DirBlur>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // Continuous strip (01 T3): A and B sit side by side on one strip, so the frame is never empty.
  // Strip travels W - enter in `dur` f (expo-in), then the last `enter` px over `settle` f (expo-out).
  const W = dx ? width : height;
  const head = Math.max(0, W - enter);
  const strip = (t: number) => {
    if (t <= at + dur) return tw(t, [at, at + dur], [0, head], Easing.in(Easing.exp));
    const base = head + tw(t, [at + dur, at + dur + settle], [0, W - head], Easing.out(Easing.exp));
    if (!overshoot) return base;
    const sp = spring({frame: t - at - dur, fps: 60, config: {damping: 14, stiffness: 160}});
    return base + overshoot * Math.sin(Math.min(1, sp) * Math.PI) * (1 - prog(t, at + dur, at + dur + settle * 2));
  };
  if (f < at) return <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>{a}</AbsoluteFill>;
  const S = strip(f);
  const v = Math.abs(vel(strip, f));
  const k = v * blurK * (f > at + dur ? 1.6 : 1);
  const showA = S < W - 1;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {showA && (
        <AbsoluteFill style={{transform: `translate(${dx * S}px,${dy * S}px)`}}>
          <DirBlur sx={dx * k} sy={dy * k} ghosts={v > 60 ? 3 : 0}>
            {a}
          </DirBlur>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{transform: `translate(${dx * (S - W)}px,${dy * (S - W)}px)`}}>
        <DirBlur sx={dx * k} sy={dy * k} ghosts={v > 60 ? 3 : 0}>
          {b}
        </DirBlur>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 09.8 / 16.11 accelerating pan along a too-wide strip, blur proportional to speed (max ~80 px) */
export const SpeedPan: React.FC<{f: number; at: number; dur?: number; dist?: number; children: React.ReactNode}> = ({
  f,
  at,
  dur = 96,
  dist = 2200,
  children,
}) => {
  const pos = (t: number) => tw(t, [at, at + dur], [0, dist], Easing.in(Easing.cubic));
  const v = Math.abs(vel(pos, f));
  return (
    <AbsoluteFill style={{transform: `translateX(${-pos(f)}px)`}}>
      <DirBlur sx={Math.min(40, v * 0.35)}>{children}</DirBlur>
    </AbsoluteFill>
  );
};

/** 07.5 scroll streak: columns at different speeds, vertical blur ~ velocity, snap with expo-out */
export const scrollStreak = (f: number, at: number, i: number, dist = 1600, dur = 40) => {
  const fac = [1, 1.3, 0.8, 1.15][i % 4];
  const pos = (t: number) => tw(t, [at, at + dur], [0, dist * fac], Easing.inOut(Easing.exp));
  return {y: -pos(f), blur: Math.min(60, Math.abs(vel(pos, f)) * 0.4)};
};

// ---------------------------------------------------------------------------
// zoom-throughs (02 T5, 03 T4, 07.2, 09.3, 12.4)
// ---------------------------------------------------------------------------
/**
 * Zoom through a shape into the next scene (02 T5). The shape (centred at cx, cy) scales
 * 1 -> 25 over `dur` (02: 20 f @24 -> 50 f @60; default 40), cubic-in. Its fill fades by scale 4,
 * the next scene is revealed inside the shape's clip, the outline keeps a constant stroke.
 * `shape` is an SVG path in a 100x100 box centred on 50,50.
 */
export const ZoomThrough: React.FC<{
  f: number;
  at: number;
  a: React.ReactNode;
  b: React.ReactNode;
  cx: number;
  cy: number;
  size?: number; // px of the 100-unit shape box at scale 1
  shape?: string;
  dur?: number;
  maxScale?: number;
  fill?: string;
  stroke?: string;
  strokeW?: number;
  glyph?: React.ReactNode; // icon drawn inside the button (e.g. arrow)
}> = ({f, at, a, b, cx, cy, size = 120, shape = CIRCLE, dur = 40, maxScale = 25, fill = '#6E5BFF', stroke = '#fff', strokeW = 4, glyph}) => {
  const s = tw(f, [at, at + dur], [1, maxScale], Easing.in(Easing.cubic));
  const fillOp = tw(s, [1, 4], [1, 0], (t) => t);
  const reveal = tw(s, [1.5, 4], [0, 1], (t) => t);
  const lineOp = tw(f, [at + dur - 6, at + dur + 6], [1, 0], (t) => t);
  const k = (size / 100) * s;
  const tr = `translate(${cx - 50 * k} ${cy - 50 * k}) scale(${k})`;
  const id = useFid('zt');
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${1 + (s - 1) * 0.04})`}}>{a}</AbsoluteFill>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id={id}>
            <path d={shape} transform={tr} />
          </clipPath>
        </defs>
        <path d={shape} transform={tr} fill={fill} opacity={fillOp} />
        {glyph && fillOp > 0 && (
          <g transform={tr} opacity={fillOp}>
            {glyph}
          </g>
        )}
      </svg>
      <AbsoluteFill style={{clipPath: `url(#${id})`, opacity: reveal}}>{b}</AbsoluteFill>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: lineOp, pointerEvents: 'none'}}>
        <path d={shape} transform={tr} fill="none" stroke={stroke} strokeWidth={strokeW} vectorEffect="non-scaling-stroke" />
        {glyph && (
          // 02 T5: the glyph keeps growing as a hairline OUTLINE of its own shape (screen-space
          // 1.5 px ring from dilate - erode), drawn over the incoming scene
          <>
            <filter id={id + 'o'} x="-5%" y="-5%" width="110%" height="110%" filterUnits="userSpaceOnUse">
              <feMorphology in="SourceAlpha" operator="dilate" radius={1} result="d" />
              <feMorphology in="SourceAlpha" operator="erode" radius={0.6} result="e" />
              <feComposite in="d" in2="e" operator="out" result="ring" />
              <feFlood floodColor={stroke} />
              <feComposite in2="ring" operator="in" />
            </filter>
            <g filter={`url(#${id}o)`} opacity={1 - fillOp}>
              <g transform={tr}>{glyph}</g>
            </g>
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
export const CIRCLE = 'M50 0A50 50 0 1 1 49.99 0Z';
export const pillShape = (w = 100, h = 40) => {
  const r = h / 2;
  const x0 = 50 - w / 2;
  const y0 = 50 - h / 2;
  return `M${x0 + r} ${y0}H${x0 + w - r}A${r} ${r} 0 0 1 ${x0 + w - r} ${y0 + h}H${x0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`;
};

/**
 * Concentric ring zoom-through (03 T4): 3 ring copies scale to 2.2 / 3.5 / 6 over 48 f, quad-in,
 * staggered 6 f; the inner disc steps #000 -> #555 -> #CCC -> #FFF over f 24-32 (fast fade, not a cut).
 * `label` stays unscaled on top. `ring` is drawn at the given radius (iridescent conic default).
 */
export const RingZoomThrough: React.FC<{
  f: number;
  at: number;
  cx?: number;
  cy?: number;
  r?: number;
  thick?: number;
  label?: React.ReactNode;
  after?: React.ReactNode; // scene revealed when the disc reaches white
  dur?: number;
}> = ({f, at, cx = 960, cy = 540, r = 280, thick = 30, label, after, dur = 48}) => {
  const t = f - at;
  const disc = discColor(t);
  const spin = f * 4 * 0.5; // 03 T3: conic rotates 4 deg/f @30
  const ring = (scale: number, op: number, key: number) => (
    <div
      key={key}
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        transform: `scale(${scale})`,
        opacity: op,
        background: `conic-gradient(from ${spin}deg, #0A3BF0, #2A8CFF, #9BD6FF, #2A8CFF, #0A3BF0)`,
        WebkitMask: `radial-gradient(circle, transparent ${r - thick - 0.5}px, #000 ${r - thick}px)`,
        mask: `radial-gradient(circle, transparent ${r - thick - 0.5}px, #000 ${r - thick}px)`,
        boxShadow: '0 0 80px rgba(10,59,240,.4)',
      }}
    />
  );
  const targets = [2.2, 3.5, 6];
  const discScale = tw(t, [0, dur], [1, 7], Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      {after && <AbsoluteFill style={{opacity: tw(t, [28, 34], [0, 1], (x) => x)}}>{after}</AbsoluteFill>}
      <div
        style={{
          position: 'absolute',
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: disc,
          transform: `scale(${discScale})`,
          opacity: after ? tw(t, [30, 36], [1, 0], (x) => x) : 1,
        }}
      />
      {ring(tw(t, [0, dur], [1, 8], Easing.in(Easing.quad)), tw(t, [dur - 10, dur], [1, 0]), 0)}
      {targets.map((s, i) =>
        t > i * 6 ? ring(tw(t, [i * 6, i * 6 + dur], [1, s], Easing.in(Easing.quad)), tw(t, [i * 6, i * 6 + dur], [0.9, 0], (x) => x), i + 1) : null,
      )}
      {label && (
        <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', color: tw(t, [24, 32], [0, 1]) > 0.5 ? '#000' : '#fff', opacity: after ? tw(t, [30, 36], [1, 0], (x) => x) : 1}}>
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};
const discColor = (t: number) => {
  const steps = ['#000000', '#555555', '#CCCCCC', '#FFFFFF'];
  const i = tw(t, [24, 32], [0, 3], (x) => x);
  const a = Math.floor(i);
  const b = Math.min(3, a + 1);
  return mixHex(steps[a], steps[b], i - a);
};
export const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, t)));
  return `rgb(${c.join(',')})`;
};

/** 07.2 dot -> full-frame circle colour takeover: 12 -> 2600 px in 12 f, cubic-in */
export const CircleTakeover: React.FC<{f: number; at: number; cx?: number; cy?: number; color?: string; dur?: number; to?: number}> = ({
  f,
  at,
  cx = 960,
  cy = 540,
  color = '#B61302',
  dur = 12,
  to = 4400,
}) => {
  if (f < at) return null;
  const d = tw(f, [at, at + dur], [12, to], Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - d / 2,
        top: cy - d / 2,
        width: d,
        height: d,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${d * 0.04}px ${d * 0.02}px ${hexA(color, 0.6)}`,
      }}
    />
  );
};

/** 09.3 beam/cone reveal + fly-through: triangle mask grows over 12 f, then camera x4 in 6 f */
export const BeamReveal: React.FC<{f: number; at: number; apexX?: number; apexY?: number; width?: number; children: React.ReactNode}> = ({
  f,
  at,
  apexX = 50,
  apexY = 82,
  width = 30,
  children,
}) => {
  const h = prog(f, at, at + 12);
  const fly = tw(f, [at + 18, at + 24], [1, 4], Easing.in(Easing.cubic));
  const top = apexY - apexY * h;
  return (
    <AbsoluteFill style={{transform: `scale(${fly})`, transformOrigin: `${apexX}% ${apexY * 0.5}%`, filter: fly > 1.2 ? `blur(${(fly - 1) * 4}px)` : undefined}}>
      <AbsoluteFill style={{clipPath: `polygon(${apexX}% ${apexY}%, ${apexX - width}% ${top}%, ${apexX + width}% ${top}%)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// morphs (04 T1, 06.8, 09.5, 10.8, 11.6, 17.3, 18.4, 20.1)
// ---------------------------------------------------------------------------
export type Box = {x: number; y: number; w: number; h: number; r?: number; fill?: string; rot?: number; glow?: string};
export type HeroKey = Box & {at: number; dur?: number; ease?: Ease; content?: React.ReactNode; blur?: number};

/**
 * Match-cut hero layer: ONE element whose box tweens between states and persists across scenes
 * (dot -> pill -> card -> logo; 04, 05, 09). Each key holds from `at`; the morph INTO a key runs
 * over its `dur` (09.5: 4-6 f @30 -> 10 f) ending at `at`. During the morph the box is blurred
 * (peak `blur`, 09: ~10 px) and content crossfades (A out on the first half, B in on the second).
 * Place it ABOVE your scene Sequences so it survives the cuts.
 */
export const HeroMorph: React.FC<{f: number; keys: HeroKey[]; style?: React.CSSProperties}> = ({f, keys, style}) => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  let i = ks.findIndex((k) => f < k.at);
  if (i === -1) i = ks.length; // after last
  const cur = ks[Math.max(0, i - 1)];
  const next = ks[i];
  let box: Box = cur;
  let t = 0;
  let blur = 0;
  let A: React.ReactNode = cur?.content;
  let B: React.ReactNode = null;
  if (next && i > 0) {
    const d = next.dur ?? 24; // 04 T1: 12-18 f @30 total
    if (f >= next.at - d) {
      t = (next.ease ?? EASE.inOut)(prog(f, next.at - d, next.at, (x) => x));
      box = lerpBox(cur, next, t);
      blur = (next.blur ?? 18) * Math.sin(Math.PI * t);
      B = next.content;
    }
  } else if (i === 0) {
    return null;
  }
  const r = box.r ?? Math.min(box.w, box.h) / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x - box.w / 2,
        top: box.y - box.h / 2,
        width: box.w,
        height: box.h,
        borderRadius: r,
        background: box.fill,
        transform: `rotate(${box.rot ?? 0}deg)`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        boxShadow: box.glow ? `0 0 ${Math.min(box.w, box.h) * 0.6}px ${box.glow}` : undefined,
        overflow: 'hidden',
        ...style,
      }}
    >
      {A && <AbsoluteFill style={{opacity: 1 - Math.min(1, t * 2), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{A}</AbsoluteFill>}
      {B && <AbsoluteFill style={{opacity: Math.max(0, t * 2 - 1), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{B}</AbsoluteFill>}
    </div>
  );
};
export const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r ?? Math.min(a.w, a.h) / 2, b.r ?? Math.min(b.w, b.h) / 2, t),
  rot: lerp(a.rot ?? 0, b.rot ?? 0, t),
  fill: a.fill && b.fill && a.fill.startsWith('#') && b.fill.startsWith('#') ? mixHex(a.fill, b.fill, t) : t < 0.5 ? a.fill : b.fill,
  glow: t < 0.5 ? a.glow : b.glow,
});

/**
 * Defocus morph (04 T1, the signature): blur = peak * sin(pi * p) over `dur` (12-18 f @30 -> 24-36),
 * A rendered for the first half, B for the second. Wrap the composite layer, not each element.
 */
export const Defocus: React.FC<{f: number; at: number; dur?: number; peak?: number; a: React.ReactNode; b: React.ReactNode; scale?: number}> = ({
  f,
  at,
  dur = 28,
  peak = 20,
  a,
  b,
  scale = 0.04,
}) => {
  const p = prog(f, at, at + dur, (x) => x);
  const blur = peak * Math.sin(Math.PI * p);
  return (
    <AbsoluteFill style={{filter: blur > 0.2 ? `blur(${blur}px)` : undefined, transform: `scale(${1 + scale * Math.sin(Math.PI * p)})`}}>
      {p < 0.5 ? a : b}
    </AbsoluteFill>
  );
};

/** 10.8 blur-crossfade (silhouettes match): A 0 -> 15 px + fade out, B 15 -> 0 + fade in, 12 f */
export const BlurCrossfade: React.FC<{f: number; at: number; dur?: number; a: React.ReactNode; b: React.ReactNode; peak?: number}> = ({
  f,
  at,
  dur = 12,
  a,
  b,
  peak = 15,
}) => {
  const p = prog(f, at, at + dur, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill>
      {p < 1 && <AbsoluteFill style={{opacity: 1 - p, filter: `blur(${p * peak}px)`}}>{a}</AbsoluteFill>}
      {p > 0 && <AbsoluteFill style={{opacity: p, filter: `blur(${(1 - p) * peak}px)`}}>{b}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

/** 18.4 focus-pull dissolve: out blur 0->10, scale 1->1.05 over 12 f; in blur 10->0, y 20->0; 6 f overlap */
export const FocusPull: React.FC<{f: number; at: number; a: React.ReactNode; b: React.ReactNode; dur?: number; overlap?: number}> = ({
  f,
  at,
  a,
  b,
  dur = 12,
  overlap = 6,
}) => {
  const po = prog(f, at, at + dur);
  const s1 = at + dur - overlap;
  const pi = prog(f, s1, s1 + dur);
  return (
    <AbsoluteFill>
      {po < 1 && <AbsoluteFill style={{opacity: 1 - po, filter: `blur(${po * 10}px)`, transform: `scale(${1 + 0.05 * po})`}}>{a}</AbsoluteFill>}
      {f >= s1 && <AbsoluteFill style={{opacity: pi, filter: `blur(${(1 - pi) * 10}px)`, transform: `translateY(${(1 - pi) * 20}px)`}}>{b}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

/** 04 T2 light-as-cursor: the rest of the scene dims (1 -> .35) and blurs (0 -> 6) in 12 f */
export const attention = (f: number, at: number, dur = 12) => {
  const p = prog(f, at, at + dur);
  return {filter: `brightness(${1 - 0.65 * p}) blur(${6 * p}px)`} as React.CSSProperties;
};
export const PRESS_GLOW = '0 0 8px #fff, 0 0 24px rgba(255,255,255,.7), 0 0 60px rgba(255,220,220,.35)';

// ---------------------------------------------------------------------------
// flashes (08.4, 11.1, 06.9, 14.6, 08.8, 09.4, 13.9)
// ---------------------------------------------------------------------------
/** frame ranges where a single-frame inversion fires (08.4: exactly 1 frame on a cut; 2 at 60 fps) */
export const isFlash = (f: number, cuts: number[], len = 2) => cuts.some((c) => f >= c && f < c + len);

/**
 * Inversion flash (08.4): wrap the WHOLE frame; on the listed cut frames the image is inverted
 * (`hue` keeps hues, plain invert gives 08's orange -> cyan).
 */
export const InvertFlash: React.FC<{f: number; cuts: number[]; len?: number; keepHue?: boolean; children: React.ReactNode}> = ({
  f,
  cuts,
  len = 2,
  keepHue = false,
  children,
}) => (
  <AbsoluteFill style={{filter: isFlash(f, cuts, len) ? `invert(1)${keepHue ? ' hue-rotate(180deg)' : ''}` : undefined}}>{children}</AbsoluteFill>
);

/** 11.1 inversion punctuation: hard light/dark flip per beat index (no interpolation) */
export const strobe = (f: number, flips: number[]) => flips.filter((x) => f >= x).length % 2 === 1;

/** white/colour strobe frame (impact frame) */
export const Strobe: React.FC<{f: number; at: number[]; len?: number; color?: string; opacity?: number}> = ({f, at, len = 2, color = '#fff', opacity = 1}) =>
  isFlash(f, at, len) ? <AbsoluteFill style={{background: color, opacity}} /> : null;

/** 06.9 coral iris impact frame (3-4 f @60) */
export const IrisFlash: React.FC<{f: number; at: number; len?: number; color?: string}> = ({f, at, len = 4, color = '#C86060'}) =>
  f >= at && f < at + len ? <AbsoluteFill style={{background: `radial-gradient(circle, #000 35%, ${color} 70%)`}} /> : null;

/**
 * Generation flash (14.6): lilac->pink duotone screen-wash 0 -> 100 % over 12 f, hold 6 f, then the
 * result is revealed with saturation 0 -> 1 and wash 100 -> 0 over 24 f. Wrap the RESULT in it;
 * `before` is shown until the wash peaks.
 */
export const GenerationFlash: React.FC<{f: number; at: number; before?: React.ReactNode; children: React.ReactNode; colors?: [string, string]}> = ({
  f,
  at,
  before,
  children,
  colors = ['#E6C6F5', '#F7B6D2'],
}) => {
  const up = prog(f, at, at + 12, (x) => x);
  const rev = prog(f, at + 18, at + 42, EASE.out);
  const wash = f < at + 18 ? up : 1 - rev;
  return (
    <AbsoluteFill>
      {f < at + 12 ? before : <AbsoluteFill style={{filter: `saturate(${rev})`}}>{children}</AbsoluteFill>}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          mixBlendMode: 'screen',
          opacity: wash,
        }}
      />
    </AbsoluteFill>
  );
};

/** 08.8 act change: white steps #FFF -> #EDEDED -> #9A9A9A over 12 f, then cut to black */
export const greyStep = (f: number, at: number, dur = 12) =>
  f >= at + dur ? '#000' : f < at ? '#FFFFFF' : mixHex(f < at + dur / 2 ? '#FFFFFF' : '#EDEDED', f < at + dur / 2 ? '#EDEDED' : '#9A9A9A', ((f - at) % (dur / 2)) / (dur / 2));

/** 09.4 CRT turn-on: scaleY 0.05 -> 1 in 4 f, then scanlines + navy edge grade */
export const CrtOn: React.FC<{f: number; at: number; children: React.ReactNode; lines?: boolean}> = ({f, at, children, lines = true}) => (
  <AbsoluteFill style={{transform: `scaleY(${tw(f, [at, at + 4], [0.05, 1], (x) => x)})`, filter: `brightness(${tw(f, [at, at + 6], [2.5, 1])})`}}>
    {children}
    {lines && <Scanlines />}
  </AbsoluteFill>
);
export const Scanlines: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill
    style={{
      background: `repeating-linear-gradient(0deg, rgba(0,0,0,${strength}) 0 2px, transparent 2px 4px), radial-gradient(ellipse at center, transparent 55%, rgba(17,21,59,.6) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** 13.9 pixel-mosaic glitch frame: render children tiny and upscale pixelated (CSS approximation) */
export const Mosaic: React.FC<{on: boolean; block?: number; children: React.ReactNode}> = ({on, block = 16, children}) => (
  <AbsoluteFill style={{filter: on ? `blur(${block / 2}px) contrast(1.6) saturate(1.4)` : undefined}}>
    {children}
    {on && (
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.25) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.25) 1px, transparent 1px)`,
          backgroundSize: `${block * 2}px ${block * 2}px`,
        }}
      />
    )}
  </AbsoluteFill>
);

/** 17.7 wipe-down with duotone grade-back: clip from top over 10 f ease-in, sepia-red 1 -> 0 over 20 f */
export const WipeDown: React.FC<{f: number; at: number; children: React.ReactNode}> = ({f, at, children}) => {
  const x = tw(f, [at, at + 10], [100, 0], Easing.in(Easing.quad));
  const g = 1 - prog(f, at + 10, at + 30);
  return (
    <AbsoluteFill style={{clipPath: `inset(0 0 ${x}% 0)`, filter: g > 0.01 ? `sepia(${g}) saturate(${1 + 3 * g}) hue-rotate(${-30 * g}deg)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

/** 10.9 Y-spin exit: scaleX 1 -> 0.1 + blur over 8 f (fakes rotateY 90) */
export const ySpinExit = (f: number, at: number, dur = 8): React.CSSProperties => {
  const p = prog(f, at, at + dur, EASE.in);
  return {transform: `scaleX(${1 - 0.9 * p})`, filter: `blur(${p * 6}px)`, opacity: p >= 1 ? 0 : 1};
};

/** 07.3 logo spin-in on Y: rotateY 270 -> 0 in 16 f back-out (overshoot to -10) */
export const ySpinIn = (f: number, at: number, dur = 16): React.CSSProperties => {
  const r = tw(f, [at, at + dur], [270, 0], EASE.back);
  return {transform: `perspective(800px) rotateY(${r}deg)`, filter: Math.abs(r) > 20 ? `blur(${Math.min(8, Math.abs(r) / 30)}px)` : undefined};
};

// ---------------------------------------------------------------------------
// holographic cut (18.9)
// ---------------------------------------------------------------------------
/** animated iridescent noise (18.9): rotating pastel conic + feTurbulence (.004) colour noise hue-rotated by frame */
export const HoloBg: React.FC<{f: number; speed?: number; freq?: number; style?: React.CSSProperties}> = ({f, speed = 3, freq = 0.004, style}) => {
  // Oil-slick look of 18.9: repeating pastel rainbow bands, warped by very low-frequency noise
  // (smooth swirls, not blotches), softened, with a slow drifting sheen. `freq` scales the warp
  // frequency (default .004 -> .0011 effective), `speed` the band drift.
  const id = useFid('holo');
  const gid = id + 'g';
  const wf = freq * 0.28;
  const shift = (f * speed * 0.9) % 900;
  const stops = ['#ffa8e6', '#f4b8ff', '#a8e6ff', '#b8ffd8', '#fff6a8', '#ffc8a8', '#ffa8e6'];
  return (
    <AbsoluteFill style={{background: '#f0d8f4', overflow: 'hidden', ...style}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={shift} y1={0} x2={shift + 900} y2={520} spreadMethod="repeat">
            {stops.map((c, i) => (
              <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={`${wf} ${wf * 1.6}`} numOctaves={2} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={680} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={10} />
          </filter>
        </defs>
        <rect x={-300} y={-300} width={2520} height={1680} fill={`url(#${gid})`} filter={`url(#${id})`} />
      </svg>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${120 + f * speed * 0.15}deg, rgba(255,255,255,0) 25%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 75%)`,
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};
/** hard cut onto holo bg; children "materialise": holo colour overlay 1 -> 0 over 40 f */
export const HoloCut: React.FC<{f: number; at: number; children: React.ReactNode}> = ({f, at, children}) => {
  const o = 1 - prog(f, at, at + 40, (x) => x);
  return (
    <AbsoluteFill>
      <HoloBg f={f} />
      <AbsoluteFill>{children}</AbsoluteFill>
      {o > 0 && (
        <AbsoluteFill style={{mixBlendMode: 'color', opacity: o}}>
          <HoloBg f={f + 40} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// smear + wobble (13.1, 13.2)
// ---------------------------------------------------------------------------
/** 13.2 low-damping spring: 2 visible wobbles */
export const WOBBLE = {damping: 9, stiffness: 140, mass: 0.8};
export const wobble = (f: number, at: number, fps = 60) => spring({frame: f - at, fps, config: WOBBLE});

/**
 * Smear-frame style for an element moving along pos(f) = {x, y} (13.1): stretched along the
 * path (scaleX = 1 + min(|v|/40, 2.5) at 30 fps -> |v|/20 at 60), squashed, rotated to the path.
 */
export const smear = (pos: (f: number) => {x: number; y: number}, f: number, k = 20): React.CSSProperties => {
  const a = pos(f - 0.5);
  const b = pos(f + 0.5);
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const v = Math.hypot(vx, vy);
  const sx = 1 + Math.min(v / k, 2.5);
  const ang = (Math.atan2(vy, vx) * 180) / Math.PI;
  const p = pos(f);
  return {
    transform: `translate(${p.x}px,${p.y}px) rotate(${ang}deg) scale(${sx},${1 / Math.sqrt(sx)}) rotate(${-ang}deg)`,
    filter: v > 4 ? 'blur(2px)' : undefined,
  };
};

/** 06.6 landing squash: scaleY 1.3 -> 1 over 24 f */
export const stretchLand = (f: number, at: number) => ({transform: `scaleY(${tw(f, [at, at + 24], [1.3, 1], EASE.back)})`});

// ---------------------------------------------------------------------------
// gooey cluster (02 T1)
// ---------------------------------------------------------------------------
export type GooShape = {x: number; y: number; w: number; h: number; r?: number}; // centre-based, r as fraction of min side
/**
 * Metaball tile cluster: shapes share one goo filter (blur 10, alpha 0 0 0 22 -9). Each shape
 * tweens from `from[i]` to `to[i]` over 36 f inOut cubic (02: 18 f @30). Fillets appear where they overlap.
 */
export const GooCluster: React.FC<{
  f: number;
  at: number;
  from: GooShape[];
  to: GooShape[];
  dur?: number;
  color?: string;
  stagger?: number;
  blur?: number;
  width?: number;
  height?: number;
  children?: React.ReactNode; // unfiltered overlay (icons, text)
}> = ({f, at, from, to, dur = 36, color = '#D83418', stagger = 2, blur = 10, width = 1920, height = 1080, children}) => {
  const id = useFid('goo');
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" />
          </filter>
        </defs>
        <g filter={`url(#${id})`} fill={color}>
          {from.map((a, i) => {
            const b = to[i] ?? a;
            const t = prog(f, at + i * stagger, at + i * stagger + dur, Easing.inOut(Easing.cubic));
            const w = lerp(a.w, b.w, t);
            const h = lerp(a.h, b.h, t);
            const r = lerp(a.r ?? 0.22, b.r ?? 0.22, t) * Math.min(w, h);
            return <rect key={i} x={lerp(a.x, b.x, t) - w / 2} y={lerp(a.y, b.y, t) - h / 2} width={w} height={h} rx={r} />;
          })}
        </g>
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// hyperspace (16.6)
// ---------------------------------------------------------------------------
/** 150 radial streaks, length 10 -> 80 px (x scale) over 8 f, accelerating outward */
export const Hyperspace: React.FC<{f: number; at: number; dur?: number; n?: number; cx?: number; cy?: number; color?: string; maxLen?: number}> = ({
  f,
  at,
  dur = 12,
  n = 150,
  cx = 960,
  cy = 540,
  color = '#fff',
  maxLen = 260,
}) => {
  const t = f - at;
  if (t < 0 || t > dur + 6) return null;
  const p = prog(f, at, at + dur, Easing.in(Easing.quad));
  const fade = 1 - prog(f, at + dur, at + dur + 6, (x) => x);
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}} viewBox="0 0 1920 1080">
      {Array.from({length: n}).map((_, i) => {
        const a = random(`hs-a${i}`) * Math.PI * 2;
        const r0 = 40 + random(`hs-r${i}`) * 500;
        const sp = 0.6 + random(`hs-s${i}`) * 0.8;
        const r = r0 + p * 1400 * sp;
        const len = lerp(10, maxLen, p) * sp;
        const w = 1 + random(`hs-w${i}`) * 1.5;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r}
            y1={cy + Math.sin(a) * r}
            x2={cx + Math.cos(a) * (r + len)}
            y2={cy + Math.sin(a) * (r + len)}
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
            opacity={fade * (0.4 + 0.6 * random(`hs-o${i}`))}
          />
        );
      })}
    </svg>
  );
};
/** 16.6 text punch-through: scale 1 -> 3.5 over 8 f with 3 trailing copies */
export const PunchThrough: React.FC<{f: number; at: number; dur?: number; children: React.ReactNode}> = ({f, at, dur = 8, children}) => {
  const s = (t: number) => tw(t, [at, at + dur], [1, 3.5], Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      {[3, 2, 1].map((k) => (
        <AbsoluteFill key={k} style={{transform: `scale(${s(f - k * 1.5)})`, opacity: 0.18 * (4 - k), filter: 'blur(2px)'}}>
          {children}
        </AbsoluteFill>
      ))}
      <AbsoluteFill style={{transform: `scale(${s(f)})`, opacity: tw(f, [at + dur - 2, at + dur], [1, 0], (x) => x)}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// fisheye / lens bulge (08.3, 09.4) via SVG displacement
// ---------------------------------------------------------------------------
const mapCache = new Map<string, string>();
/** precomputed barrel displacement map (R = dx, G = dy), r' = r (1 + k r^2) */
const barrelMap = (k: number, n = 256) => {
  const key = `${k}-${n}`;
  if (mapCache.has(key)) return mapCache.get(key)!;
  if (typeof document === 'undefined') return '';
  const c = document.createElement('canvas');
  c.width = n;
  c.height = n;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(n, n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 2 - 1;
      const y = (j / (n - 1)) * 2 - 1;
      const r2 = x * x + y * y;
      // sample source at r / (1 + k r^2): content pushed outward from centre near edges? barrel = shrink edges
      const dx = x * k * r2; // in -1..1 units, normalised below
      const dy = y * k * r2;
      const o = (j * n + i) * 4;
      img.data[o] = Math.round(128 + dx * 127);
      img.data[o + 1] = Math.round(128 + dy * 127);
      img.data[o + 2] = 128;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = c.toDataURL();
  mapCache.set(key, url);
  return url;
};

/**
 * Fisheye / curved-monitor bulge (08.3: strength +0.15 to +0.25, edges bulge ~25 px @576p).
 * Everything inside is distorted, so dashed guides read as a lens. `strength` 0..0.5.
 */
export const Fisheye: React.FC<{strength?: number; width?: number; height?: number; children: React.ReactNode}> = ({
  strength = 0.2,
  width = 1920,
  height = 1080,
  children,
}) => {
  const id = useFid('fe');
  const url = useMemo(() => barrelMap(1), []);
  // feDisplacementMap: P'(x) = P(x + scale*(R-0.5)); we sample outward near edges -> content bulges to centre (pincushion inverse = barrel)
  const scale = strength * Math.min(width, height) * 1.0;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feImage href={url} x={0} y={0} width={width} height={height} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: url ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// light: horizon/planet rim + beam (01 T7, 08.6, 13.4), edge glow (15.1), streaks (15.2, 08.1)
// ---------------------------------------------------------------------------
/**
 * Planet-horizon reveal: a black planet (diameter ~3x frame width) below the frame with a pale rim,
 * teal atmosphere and a vertical light cone. `p` 0..1 = rise (01: up 140 px over 36 f, cubic-out);
 * beam opacity follows `beam` (01: 0 -> 1 over 40 f).
 */
export const HorizonRim: React.FC<{
  p: number;
  beam?: number;
  width?: number;
  height?: number;
  rim?: string;
  atmo?: string;
  beamColor?: string;
  sky?: string;
  horizon?: number; // y of the rim top at p = 1 (fraction of height)
  diameter?: number; // fraction of width
}> = ({p, beam = 1, width = 1920, height = 1080, rim = '#DBE8F0', atmo = '#097484', beamColor = '#1BA6B8', sky = '#000001', horizon = 0.78, diameter = 2.2}) => {
  const D = width * diameter;
  const top = height * horizon + (1 - p) * 140 * (height / 576) * 0.5;
  return (
    <AbsoluteFill style={{background: sky, overflow: 'hidden'}}>
      {/* beam: vertical cone, wider at the planet (blur on the parent so the clip edge goes soft) */}
      <AbsoluteFill style={{opacity: beam, filter: 'blur(70px)'}}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${hexA(beamColor, 0.05)} 0%, ${hexA(beamColor, 0.5)} 45%, ${hexA(beamColor, 0.95)} 100%)`,
            clipPath: 'polygon(38% 0,62% 0,84% 100%,16% 100%)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: beam * 0.6, filter: 'blur(30px)'}}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, transparent 10%, ${hexA('#9FF3F5', 0.6)} 100%)`,
            clipPath: 'polygon(46% 0,54% 0,64% 100%,36% 100%)',
          }}
        />
      </AbsoluteFill>
      {/* atmosphere glow over the rim */}
      <div
        style={{
          position: 'absolute',
          left: width / 2 - D / 2 - 60,
          top: top - 60,
          width: D + 120,
          height: D + 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, transparent ${D / 2 - 10}px, ${hexA(atmo, 0.9)} ${D / 2 + 20}px, transparent ${D / 2 + 60}px)`,
          filter: 'blur(24px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: width / 2 - D / 2,
          top,
          width: D,
          height: D,
          borderRadius: '50%',
          background: '#000',
          boxShadow: `inset 0 6px 0 ${rim}, inset 0 18px 30px ${hexA(rim, 0.5)}, 0 -4px 30px ${hexA(rim, 0.8)}`,
        }}
      />
    </AbsoluteFill>
  );
};

/** 15.1 edge glow: ellipse 160 % wide, 60 % high, centred past the bottom (or top) edge, blur 80 */
export const EdgeGlow: React.FC<{color?: string; edge?: 'top' | 'bottom'; intensity?: number; base?: string}> = ({
  color = '#6B4BFF',
  edge = 'bottom',
  intensity = 1,
  base = '#050507',
}) => (
  <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        left: '-30%',
        width: '160%',
        height: '60%',
        [edge]: '-38%',
        borderRadius: '50%',
        background: `radial-gradient(closest-side, ${color}, transparent)`,
        filter: 'blur(80px)',
        opacity: intensity,
      }}
    />
  </AbsoluteFill>
);

/** 15.2 neon light-streak: 2 px gradient line + 12 px blurred copy, sweeps across over 40 f inOut */
export const LightStreak: React.FC<{f: number; at: number; x0?: number; x1?: number; y?: number; len?: number; color?: string; dur?: number}> = ({
  f,
  at,
  x0 = 200,
  x1 = 1720,
  y = 600,
  len = 520,
  color = '#A99BFF',
  dur = 40,
}) => {
  const x = tw(f, [at, at + dur], [x0 - len, x1], EASE.inOut);
  const op = tw(f, [at, at + 6, at + dur - 6, at + dur], [0, 1, 1, 0], (t) => t);
  const g = `linear-gradient(90deg, transparent, ${color} 40%, #fff 60%, ${color} 75%, transparent)`;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y - 6, width: len, height: 12, background: g, filter: 'blur(12px)', opacity: op}} />
      <div style={{position: 'absolute', left: x, top: y - 1, width: len, height: 2, background: g, opacity: op}} />
    </>
  );
};

/** 08.1 neon wave ribbon: sum of 2 sines, phase-scrolling; core + 2 glow layers */
export const NeonWave: React.FC<{f: number; y?: number; color?: string; glow?: string; width?: number; amp?: number}> = ({
  f,
  y = 540,
  color = '#FF7A3A',
  glow = '#FF6A2A',
  width = 1920,
  amp = 1,
}) => {
  const pts = Array.from({length: 101}).map((_, i) => {
    const x = (i / 100) * width;
    const yy = y + amp * (50 * Math.sin((x / 1130) * Math.PI * 2 + f * 0.02) + 27 * Math.sin((x / 430) * Math.PI * 2 - f * 0.035));
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`;
  });
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={pts.join('')} fill="none" stroke={color} strokeWidth={6} style={{filter: `drop-shadow(0 0 12px ${glow}) drop-shadow(0 0 50px ${hexA(glow, 0.6)})`}} />
      <path d={pts.join('')} fill="none" stroke="#FFE2CF" strokeWidth={2} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// backgrounds (variants of DarkGlow / LightBlobs) + finishing
// ---------------------------------------------------------------------------
/** 01 diagonal window-light band (teal), 04 T7 red radial with drifting centre, 05 T8 top spotlight */
export const GlowBg: React.FC<{f?: number; variant?: 'teal-band' | 'red-room' | 'lilac-spot' | 'space-blue'}> = ({f = 0, variant = 'teal-band'}) => {
  const dx = Math.sin(f / 200) * 4;
  const bg: Record<string, string> = {
    'teal-band': `linear-gradient(${125 + dx}deg, #010609 0%, #051C24 35%, #07222B 50%, #051C24 62%, #03080B 100%)`,
    'red-room': `radial-gradient(ellipse at ${50 + dx}% 20%, #2A0A0E 0%, #160306 45%, #040001 100%)`,
    'lilac-spot': 'radial-gradient(ellipse 70% 45% at 50% 0%, #3A3445 0%, #18161C 50%, #080808 100%)',
    'space-blue': 'linear-gradient(0deg, #001884 0%, #000418 40%, #000 100%)',
  };
  return <AbsoluteFill style={{background: bg[variant]}} />;
};

/** 09.1 / 12.3 airy light blobs: base #F1F9FF, blobs 60-80 % of width off the corners, blur 140, drift +-40 */
export const AiryBlobs: React.FC<{f: number; base?: string; color?: string; n?: number; grain?: number}> = ({f, base = '#F1F9FF', color = '#BFE0FA', n = 4, grain = 0.015}) => (
  <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
    {Array.from({length: n}).map((_, i) => {
      const cx = [0, 100, 100, 0][i % 4];
      const cy = [0, 0, 100, 100][i % 4];
      const d = 60 + 20 * random(`ab${i}`);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(${cx}% + ${Math.sin(f / 180 + i * 2) * 40}px)`,
            top: `calc(${cy}% + ${Math.cos(f / 220 + i) * 40}px)`,
            width: `${d}vw`,
            height: `${d}vw`,
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background: color,
            opacity: 0.6 + 0.2 * random(`abo${i}`),
            filter: 'blur(140px)',
          }}
        />
      );
    })}
    <Dither amount={grain} seed={1 + (Math.floor(f / 2) % 6)} />
  </AbsoluteFill>
);

/** 07.8 studio cyclorama */
export const Cyclorama: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #F8F7F7 0%, #E2E1E1 55%, #C6C6C6 100%)'}} />
);

/** film grain: feTurbulence re-seeded per frame (04 T7 3 % noise, 09.1 2 % against banding) */
export const FilmGrain: React.FC<{f: number; opacity?: number; freq?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  f,
  opacity = 0.05,
  freq = 0.9,
  blend = 'overlay',
}) => {
  const id = useFid('grain');
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: blend, pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={Math.floor(f) % 997} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** vignette finishing pass */
export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.5, color = '#000'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 50%, ${hexA(color, strength)} 100%)`, pointerEvents: 'none'}} />
);

/** 05 T5 / 10.3 chromatic split: R and C copies offset by (dx, dy), screen-blended */
export const ChromaSplit: React.FC<{dx?: number; dy?: number; children: React.ReactNode}> = ({dx = 4, dy = 2, children}) => (
  <AbsoluteFill style={{isolation: 'isolate'}}>
    <AbsoluteFill style={{transform: `translate(${dx}px,${dy}px)`, filter: 'sepia(1) saturate(8) hue-rotate(-50deg)', mixBlendMode: 'screen', opacity: 0.7}}>{children}</AbsoluteFill>
    <AbsoluteFill style={{transform: `translate(${-dx}px,${-dy}px)`, filter: 'sepia(1) saturate(8) hue-rotate(140deg)', mixBlendMode: 'screen', opacity: 0.7}}>{children}</AbsoluteFill>
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// beat grid (16, 20)
// ---------------------------------------------------------------------------
/**
 * Beat grid (20: 120 BPM, one idea per beat; 16: 125 BPM). Lay markers first, then fill beats.
 *   const g = beatGrid({bpm: 120});  g.at(4) -> frame of beat 4;  g.index(f), g.local(f), g.hit(f, 2)
 */
export const beatGrid = ({bpm = 120, fps = 60, offset = 0}: {bpm?: number; fps?: number; offset?: number} = {}) => {
  const len = (60 / bpm) * fps;
  return {
    len,
    at: (i: number) => Math.round(offset + i * len),
    index: (f: number) => Math.floor((f - offset) / len),
    local: (f: number) => f - offset - Math.floor((f - offset) / len) * len,
    /** true for the first `n` frames of each beat (impact frames) */
    hit: (f: number, n = 2) => f >= offset && f - offset - Math.floor((f - offset) / len) * len < n,
    /** 0..1 pulse that decays over `decay` frames after each beat */
    pulse: (f: number, decay = 12) => {
      const l = f - offset - Math.floor((f - offset) / len) * len;
      return f < offset ? 0 : Math.max(0, 1 - l / decay);
    },
  };
};

/** render one item per beat; render(item, localFrame, index) */
export function OnBeats<T>({f, items, bpm = 120, offset = 0, beatsEach = 1, render}: {
  f: number;
  items: T[];
  bpm?: number;
  offset?: number;
  beatsEach?: number;
  render: (item: T, local: number, i: number) => React.ReactNode;
}) {
  const g = beatGrid({bpm, offset});
  const i = Math.floor(g.index(f) / beatsEach);
  if (f < offset || i < 0 || i >= items.length) return null;
  return <>{render(items[i], f - g.at(i * beatsEach), i)}</>;
}
