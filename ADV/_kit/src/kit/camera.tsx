// Camera moves measured in the deep studies (01, 03, 04, 05, 06, 10, 11, 12, 16, 18, 20).
// Every piece is a pure function of `f` (frame at 60 fps). Reference clips were mostly 30 fps:
// measured frame counts are doubled here (a "4 f @30" whip is 8 f).
import React, {useId} from 'react';
import {AbsoluteFill, Easing, random} from 'remotion';
import {EASE, lerp, prog, tw} from './core';

export type Ease = (t: number) => number;

/** unique, url()-safe id for inline SVG filters */
export const useFid = (p = 'k') => p + useId().replace(/[^a-zA-Z0-9]/g, '');

// ---------------------------------------------------------------------------
// keyframe camera
// ---------------------------------------------------------------------------
export type CamState = {
  x: number; // px, world translate (positive x moves the world right = camera pans left)
  y: number;
  scale: number;
  rotate: number; // deg, roll
  rx: number; // deg, 3D tilt (pitch)
  ry: number; // deg, 3D yaw
  z: number; // px, translateZ (dolly), needs perspective
  blur: number; // px, whole-frame defocus
};
export type CamKey = Partial<CamState> & {at: number; ease?: Ease};

const CAM0: CamState = {x: 0, y: 0, scale: 1, rotate: 0, rx: 0, ry: 0, z: 0, blur: 0};

/**
 * Evaluate a keyframe list at frame f. Each key's `ease` shapes the segment that ENDS on it
 * (default EASE.inOut, the camera curve). Missing props hold their previous value.
 * A key with the same `at` as the previous one is a hard cut (18's "cut to 5x").
 */
export const camAt = (f: number, keys: CamKey[]): CamState => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  // resolve held values
  const full: (CamState & {at: number; ease?: Ease})[] = [];
  let prev: CamState = {...CAM0};
  for (const k of ks) {
    prev = {...prev, ...k} as CamState;
    full.push({...prev, at: k.at, ease: k.ease});
  }
  if (!full.length) return {...CAM0};
  if (f <= full[0].at) return strip(full[0]);
  for (let i = 1; i < full.length; i++) {
    const a = full[i - 1];
    const b = full[i];
    if (f < b.at) {
      const t = b.at === a.at ? 1 : (b.ease ?? EASE.inOut)((f - a.at) / (b.at - a.at));
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        scale: a.scale * Math.pow(b.scale / a.scale, t), // geometric: zooms feel linear
        rotate: lerp(a.rotate, b.rotate, t),
        rx: lerp(a.rx, b.rx, t),
        ry: lerp(a.ry, b.ry, t),
        z: lerp(a.z, b.z, t),
        blur: lerp(a.blur, b.blur, t),
      };
    }
  }
  return strip(full[full.length - 1]);
};
const strip = ({at, ease, ...s}: CamState & {at: number; ease?: Ease}): CamState => s;

/** handheld drift: 0.5-1 deg/s roll + slow sine float (11 T3, 09 T1 "never fully stops") */
export const drift = (f: number, amp = 1, seed = 0): Partial<CamState> => ({
  x: Math.sin(f / 97 + seed) * 14 * amp,
  y: Math.cos(f / 131 + seed * 1.7) * 9 * amp,
  rotate: (f / 60) * 0.6 * amp * (seed % 2 ? -1 : 1) + Math.sin(f / 150 + seed) * 0.4 * amp,
});

export const camTransform = (c: CamState) =>
  `translate3d(${c.x}px,${c.y}px,${c.z}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotate(${c.rotate}deg) scale(${c.scale})`;

/**
 * Always-moving camera wrapper. Give it `keys` (keyframe list) and/or a computed `state`;
 * `drift` adds the handheld float on top, `creep` a constant slow push (06: 1 -> 1.08 per hold).
 */
export const Camera: React.FC<{
  f: number;
  keys?: CamKey[];
  state?: Partial<CamState>;
  drift?: number; // 0 = locked off, 1 = measured handheld amount
  seed?: number;
  creep?: number; // scale added per second (0.04 = 06's creep at 2 s holds)
  perspective?: number;
  origin?: string; // transform-origin, e.g. '30% 60%' to push into a target
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({f, keys = [], state, drift: d = 0, seed = 0, creep = 0, perspective = 1200, origin = '50% 50%', children, style}) => {
  const k = camAt(f, keys);
  const dr = d ? drift(f, d, seed) : {};
  const c: CamState = {
    ...k,
    ...state,
    x: (state?.x ?? k.x) + (dr.x ?? 0),
    y: (state?.y ?? k.y) + (dr.y ?? 0),
    rotate: (state?.rotate ?? k.rotate) + (dr.rotate ?? 0),
    scale: (state?.scale ?? k.scale) * (1 + (creep * f) / 60),
  };
  return (
    <AbsoluteFill style={{perspective, overflow: 'hidden', ...style}}>
      <AbsoluteFill
        style={{
          transform: camTransform(c),
          transformOrigin: origin,
          transformStyle: 'preserve-3d',
          filter: c.blur > 0.05 ? `blur(${c.blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ready-made key lists (frames relative to `at`)
// ---------------------------------------------------------------------------
export const moves = {
  /** slow push: 01 T1 1 -> 1.15 linear, 16.10 1 -> 1.4 over 4 s, 10.4 1 -> 1.1 over 100 f */
  push: (at: number, dur: number, from = 1, to = 1.15, ease: Ease = (t) => t): CamKey[] => [
    {at, scale: from},
    {at: at + dur, scale: to, ease},
  ],
  /** constant linear pan (10.4 diagonal masonry: -2.2/-1.5 px/f @1080p30 = -1.1/-0.75 px/f @60) */
  pan: (at: number, dur: number, vx = -1.1, vy = -0.75): CamKey[] => [
    {at, x: 0, y: 0},
    {at: at + dur, x: vx * dur, y: vy * dur, ease: (t) => t},
  ],
  /** 05 T1 / 06.1 tilted-card opening: rotateX 70 -> 0 over 60 f, inOut cubic */
  tiltUp: (at: number, dur = 60, from = 70, ease: Ease = Easing.inOut(Easing.cubic)): CamKey[] => [
    {at, rx: from, y: 120},
    {at: at + dur, rx: 0, y: 0, ease},
  ],
  /** 05 T4 / 06.5 camera tilt = world translateY over 40 f */
  tiltPan: (at: number, dy = -200, dur = 40, ease: Ease = Easing.inOut(Easing.sin)): CamKey[] => [
    {at, y: 0},
    {at: at + dur, y: dy, ease},
  ],
  /** 11 T3 macro re-frame onto a target: 16-20 f expo-out, scale 2.5-3x */
  reframe: (at: number, x: number, y: number, scale = 2.8, dur = 18): CamKey[] => [
    {at, ease: EASE.out},
    {at: at + dur, x, y, scale, ease: EASE.out},
  ],
  /**
   * 18.8 macro close-up as a dramatic pause: hard CUT to 5x, slow pull-back 5 -> 4.6 over 60 f,
   * then a fast 8 f expo in-out pull to 1x. (tx, ty) = world offset that centres the target at 5x.
   */
  macroPull: (at: number, tx = 0, ty = 0, hold = 60, out = 8): CamKey[] => [
    {at: at - 0.001, x: 0, y: 0, scale: 1},
    {at, x: tx, y: ty, scale: 5},
    {at: at + hold, x: tx * 0.92, y: ty * 0.92, scale: 4.6, ease: (t) => t},
    {at: at + hold + out, x: 0, y: 0, scale: 1, ease: Easing.inOut(Easing.exp)},
  ],
  /** 12.6 camera dive into a button: 1 -> 2.4 over 24 f expo */
  dive: (at: number, x: number, y: number, scale = 2.4, dur = 24): CamKey[] => [
    {at},
    {at: at + dur, x, y, scale, ease: EASE.out},
  ],
  /** 08.5 slow orbit +-8 deg yaw */
  orbit: (at: number, dur: number, deg = 8): CamKey[] => [
    {at, ry: -deg},
    {at: at + dur, ry: deg, ease: Easing.inOut(Easing.sin)},
  ],
};

/** 02 T4 / 12.5 / 18.2 camera-follows-caret: world x so the caret sits at `anchor` of the frame, lagged. */
export const followX = (f: number, caretX: (f: number) => number, width: number, anchor = 0.55, lag = 6) => {
  // exponential smoothing evaluated over the last ~4*lag frames (deterministic, no state)
  let x = -(caretX(f - lag * 4) - anchor * width);
  for (let i = lag * 4 - 1; i >= 0; i--) {
    const target = -(caretX(f - i) - anchor * width);
    x += (target - x) / lag;
  }
  return x;
};

// ---------------------------------------------------------------------------
// depth of field
// ---------------------------------------------------------------------------
/**
 * Rack focus between depth planes (04 T3, 05, 12.1). blur = |focus - z| * k (k ~ 25 px / unit).
 * Animate `focus` with focusAt().
 */
export const DepthLayer: React.FC<{
  z: number;
  focus: number;
  k?: number;
  dim?: number; // brightness drop per unit out of focus (12.1 older words 0.6)
  max?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({z, focus, k = 25, dim = 0.25, max = 30, children, style}) => {
  const d = Math.abs(focus - z);
  const b = Math.min(max, d * k);
  return (
    <AbsoluteFill
      style={{
        filter: b > 0.1 ? `blur(${b}px) brightness(${Math.max(0.35, 1 - d * dim)})` : undefined,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
/** focus value between two depths, inOut sine over 20-30 f (04 T3: 10-15 f @30) */
export const focusAt = (f: number, at: number, from: number, to: number, dur = 24) =>
  tw(f, [at, at + dur], [from, to], Easing.inOut(Easing.sin));

/**
 * 3D fly-through with per-item DOF (03 T8): items at z, camera moves along z, blur grows with
 * distance from the focus plane, opacity falls near the lens. Simple pinhole projection.
 */
export const DofFlyThrough: React.FC<{
  f: number;
  items: {x: number; y: number; z: number; node: React.ReactNode}[];
  camZ: number; // current camera z
  focusDist?: number; // distance in front of camera that is sharp
  fl?: number; // focal length px
  width?: number;
  height?: number;
}> = ({items, camZ, focusDist = 600, fl = 900, width = 1920, height = 1080}) => {
  const vis = items
    .map((it) => ({...it, d: it.z - camZ}))
    .filter((it) => it.d > 40)
    .sort((a, b) => b.d - a.d);
  return (
    <AbsoluteFill>
      {vis.map((it, i) => {
        const s = fl / it.d;
        const blur = Math.min(12, Math.abs(it.d - focusDist) / 60);
        const op = Math.min(1, (it.d - 40) / 200) * Math.min(1, 2400 / it.d);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: width / 2 + it.x * s,
              top: height / 2 + it.y * s,
              transform: `translate(-50%,-50%) scale(${s})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
              opacity: op,
            }}
          >
            {it.node}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** radial DOF for a wall of chips (04 T5): blur/brightness/opacity by distance from centre */
export const radialDof = (dx: number, dy: number) => {
  const d = Math.hypot(dx, dy);
  return {
    filter: `blur(${Math.max(0, Math.min(10, (d - 120) / 40))}px) brightness(${Math.max(0.2, 1 - d / 1200)})`,
    opacity: Math.max(0, 1 - d / 900),
  } as React.CSSProperties;
};

// ---------------------------------------------------------------------------
// 3D stages
// ---------------------------------------------------------------------------
/**
 * "Box of screens" tunnel (01 T5): four planes at +-65 deg, translateZ 300, perspective 900,
 * slide in from the corners over 24 f expo-out, then the camera dollies z +80.
 */
export const ScreenTunnel: React.FC<{
  f: number;
  at?: number;
  faces: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]; // top, right, bottom, left
  w?: number;
  h?: number;
  dur?: number;
}> = ({f, at = 0, faces, w = 720, h = 440, dur = 110}) => {
  const p = prog(f, at, at + 24);
  const dolly = tw(f, [at + 24, at + dur], [0, 80], (t) => t);
  const tf = [
    'translateY(-330px) rotateX(-65deg) translateZ(0px)',
    'translateX(500px) rotateY(-65deg)',
    'translateY(330px) rotateX(65deg)',
    'translateX(-500px) rotateY(65deg)',
  ];
  const off = [
    [-200, -200],
    [200, -200],
    [200, 200],
    [-200, 200],
  ];
  return (
    <AbsoluteFill style={{perspective: 900}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateZ(${dolly}px)`}}>
        {faces.map((n, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: w,
              height: h,
              marginLeft: -w / 2,
              marginTop: -h / 2,
              transform: `translate(${off[i][0] * (1 - p)}px,${off[i][1] * (1 - p)}px) ${tf[i]}`,
              opacity: p,
              borderRadius: 28,
              border: '10px solid #111',
              overflow: 'hidden',
              background: '#0b1418',
            }}
          >
            {n}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 20.6 exploded layer view: layers on translateZ(i * -gap), parent yaw/pitch driven by p (0..1) */
export const ExplodedLayers: React.FC<{
  p: number;
  layers: React.ReactNode[];
  gap?: number;
  ry?: number;
  rx?: number;
}> = ({p, layers, gap = 150, ry = -35, rx = 18}) => (
  <AbsoluteFill style={{perspective: 1600}}>
    <AbsoluteFill
      style={{
        transformStyle: 'preserve-3d',
        transform: `scale(${1 - 0.35 * p}) rotateX(${rx * p}deg) rotateY(${ry * p}deg)`,
      }}
    >
      {layers.map((l, i) => (
        <AbsoluteFill
          key={i}
          style={{
            transform: `translateZ(${(i - (layers.length - 1) / 2) * gap * p}px)`,
            transformStyle: 'preserve-3d',
            boxShadow: p > 0.05 ? `0 0 0 ${2}px rgba(255,255,255,${0.35 * p})` : undefined,
          }}
        >
          {l}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);

/** seeded Lissajous float for depth swarms (10.3): x += 12 sin(f/40+phi), y += 8 cos(f/55+phi) */
export const float = (f: number, i: number, ax = 12, ay = 8) => {
  const phi = random(`float${i}`) * Math.PI * 2;
  return {x: ax * Math.sin(f / 80 + phi), y: ay * Math.cos(f / 110 + phi)};
};
