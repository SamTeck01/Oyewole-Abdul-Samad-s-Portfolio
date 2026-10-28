// Kinetic typography library: the text techniques measured in deep studies 01-18.
// Every component is driven by `f` (frames since the component's own start, 60 fps) and is fully parametrised.
// Measured timings were taken at 24/30 fps; they are stored here already doubled for 60 fps ("6f@30" -> 12).
import React, {useEffect, useId, useState} from 'react';
import {continueRender, delayRender, interpolateColors, random, staticFile} from 'remotion';
import {EASE, lerp, prog, tw} from './core';
import {loadFonts, SANS, SERIF} from './fonts';
import {measure} from './captions';
import {hexA} from './ui';

// ---------- fonts ----------
export const SCRIPT = 'Caveat, cursive';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';
export const GEO = 'Montserrat, sans-serif';

const EXTRA: [string, string, string][] = [
  ['Caveat', 'caveat-latin-700-normal.woff2', '700'],
  ['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', '500'],
  ['Montserrat', 'montserrat-latin-400-normal.woff2', '400'],
  ['Inter', 'inter-latin-800-normal.woff2', '800'],
];
let extraP: Promise<unknown> | null = null;

/** Loads kit fonts + the text fonts and re-renders once they are ready, so canvas measurements are correct.
 * Use at the top of any composition that uses text.tsx: `if (!useTextFonts()) return null;` */
export const useTextFonts = () => {
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender('text-fonts'));
  useEffect(() => {
    loadFonts();
    extraP =
      extraP ??
      Promise.all(
        EXTRA.map(([fam, file, w]) =>
          new FontFace(fam, `url(${staticFile(`fonts/${file}`)})`, {weight: w})
            .load()
            .then((ff) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(ff)),
        ),
      );
    extraP
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(h);
      });
  }, [h]);
  return ready;
};

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** width of a string incl. CSS letter-spacing (px) */
export const textW = (s: string, size: number, weight = 600, family = SANS, ls = 0) => measure(s, size, weight, family) + ls * s.length;
const bump = (f: number, a: number, b: number) => Math.sin(clamp01((f - a) / (b - a)) * Math.PI);

/** Directional (one-axis) gaussian blur via an inline SVG filter: CSS blur() cannot smear on one axis. */
export const Smear: React.FC<{x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({x = 0, y = 0, style, children}) => {
  const id = 'sm' + useId().replace(/:/g, '');
  const on = x > 0.05 || y > 0.05;
  return (
    <div style={{...style, filter: on ? `url(#${id})` : style?.filter}}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${x} ${y}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

type Txt = {size?: number; weight?: number; family?: string; color?: string; tracking?: number /* em */};
const txtStyle = ({size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.025}: Txt): React.CSSProperties => ({
  fontFamily: family,
  fontSize: size,
  fontWeight: weight,
  color,
  letterSpacing: `${tracking}em`,
  lineHeight: 1.2,
  whiteSpace: 'pre',
});

/** lays words on one centred line; returns left x of each word (line centre = 0) */
const layout = (words: string[], size: number, weight: number, family: string, tracking: number, gap = 0.26, vis?: number[]) => {
  const ws = words.map((w) => textW(w, size, weight, family, tracking * size));
  const sp = size * gap;
  const tot = ws.reduce((s, w, i) => s + (vis ? vis[i] : 1) * (w + sp), 0) - sp;
  let x = -tot / 2;
  const xs = ws.map((w, i) => {
    const l = x;
    x += (vis ? vis[i] : 1) * (w + sp);
    return l;
  });
  return {ws, xs, tot};
};

// =====================================================================================
// 1. Blur-in word build (01 dark, 09 light, 02 drop-in). For the red-bloom version (17) use CaptionLine.
// =====================================================================================
export type BlurPreset = {from: string; to: string; dy: number; scale: number; blur: number; stagger: number; dur: number; colorDur: number};
export const BLUR_PRESETS: Record<'dark01' | 'light09' | 'drop02', BlurPreset> = {
  // 01: grey #5A6A72 -> white, 8px blur, 70% scale, new word every 3-4f@30
  dark01: {from: '#5A6A72', to: '#FFFFFF', dy: 8, scale: 0.7, blur: 8, stagger: 7, dur: 8, colorDur: 12},
  // 09: blue tint #0791E9 cools to #111, y +18, scale .7, blur 5, 8f@30
  light09: {from: '#0791E9', to: '#111111', dy: 18, scale: 0.7, blur: 6, stagger: 10, dur: 16, colorDur: 16},
  // 02 Replit: drop from -20, blur 6, accent orange settles to charcoal over 8f@24
  drop02: {from: '#D83418', to: '#2F2B2C', dy: -20, scale: 1, blur: 6, stagger: 10, dur: 14, colorDur: 20},
};

export const BlurWords: React.FC<
  Txt & {
    words: string[];
    f: number;
    preset?: Partial<BlurPreset> & {base?: keyof typeof BLUR_PRESETS};
    starts?: number[]; // explicit per-word start frames (VO-locked); default i*stagger
    accentIdx?: number[]; // words that stay in accentColor
    accentColor?: string;
    recentre?: boolean; // line slides to stay centred as it grows (17/01)
  }
> = ({words, f, preset = {}, starts, accentIdx = [], accentColor = '#0791E9', recentre = true, size = 96, weight = 600, family = SANS, tracking = -0.025}) => {
  const p = {...BLUR_PRESETS[preset.base ?? 'light09'], ...preset};
  const st = words.map((_, i) => (starts ? starts[i] : i * p.stagger));
  const vis = words.map((_, i) => (recentre ? prog(f, st[i], st[i] + p.dur) : 1));
  const {xs} = layout(words, size, weight, family, tracking, 0.26, vis);
  return (
    <div style={{position: 'relative', height: size * 1.2, width: 0}}>
      {words.map((w, i) => {
        const lf = f - st[i];
        if (lf < 0) return null;
        const k = prog(lf, 0, p.dur);
        const target = accentIdx.includes(i) ? accentColor : p.to;
        return (
          <div
            key={i}
            style={{
              ...txtStyle({size, weight, family, tracking}),
              position: 'absolute',
              left: xs[i],
              top: 0,
              color: interpolateColors(lf, [0, p.colorDur], [p.from, target]),
              opacity: tw(lf, [0, 6], [0, 1]),
              filter: `blur(${(1 - k) * p.blur}px)`,
              transform: `translateY(${(1 - k) * p.dy}px) scale(${lerp(p.scale, 1, k)})`,
              transformOrigin: '50% 80%',
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================================
// 2. Directional smear entrance / whip exit (12 sentence, 09 sentence pan, 01 whip-out)
// =====================================================================================
export const SmearWords: React.FC<
  Txt & {
    words: string[];
    f: number;
    stagger?: number; // 4-6f@30 -> 10
    dur?: number; // 8f@30 -> 16
    from?: 'right' | 'left' | 'up' | 'down';
    distance?: number;
    blur?: number; // peak directional blur, 40-80px at 1080p
    accentIdx?: number[];
    accentColor?: string;
    exitAt?: number; // whole line whips out (expo-in, 4f@30 -> 8)
    exitDistance?: number;
    samples?: number; // motion-blur sub-frame samples (1 = off)
    shutter?: number; // frames the shutter stays open (1 = 360deg)
  }
> = ({words, f, stagger = 10, dur = 16, from = 'right', distance = 320, blur = 60, samples = 8, shutter = 1.5, accentIdx = [], accentColor = '#0A6BF0', exitAt, exitDistance = -1400, size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.025}) => {
  const {xs} = layout(words, size, weight, family, tracking);
  const horiz = from === 'right' || from === 'left';
  const sgn = from === 'right' || from === 'down' ? 1 : -1;
  const ex = exitAt === undefined ? 0 : prog(f, exitAt, exitAt + 8, EASE.in);
  const exV = exitAt === undefined ? 0 : bump(f, exitAt, exitAt + 10);
  return (
    <Smear x={exV * blur} style={{position: 'relative', height: size * 1.2, width: 0, transform: `translateX(${ex * exitDistance}px)`, opacity: 1 - tw(f, [(exitAt ?? 1e9) + 6, (exitAt ?? 1e9) + 10], [0, 1])}}>
      {words.map((w, i) => {
        const lf0 = f - i * stagger;
        if (lf0 < 0) return null;
        // real (multi-sample) motion blur: `samples` sub-frame positions across `shutter` frames,
        // layer k drawn at opacity 1/k so every sample ends up equally weighted; a lighter
        // one-axis gaussian on top fills the gaps between samples.
        const n = prog(lf0, 0, dur) >= 1 ? 1 : Math.max(1, samples);
        return (
          <React.Fragment key={i}>
            {Array.from({length: n}).map((_, kIdx) => {
              const lf = lf0 - (n === 1 ? 0 : (shutter * kIdx) / (n - 1));
              const k = prog(Math.max(0, lf), 0, dur);
              const off = (1 - k) * distance * sgn;
              const sm = (1 - k) * blur * (n > 1 ? 0.45 : 1);
              return (
                <Smear
                  key={kIdx}
                  x={horiz ? sm : 0}
                  y={horiz ? 0 : sm}
                  style={{
                    ...txtStyle({size, weight, family, tracking, color: accentIdx.includes(i) ? accentColor : color}),
                    position: 'absolute',
                    left: xs[i],
                    top: 0,
                    opacity: tw(lf, [0, 5], [0, 1]) / (kIdx + 1),
                    transform: horiz ? `translateX(${off}px) scaleX(${1 + (1 - k) * 0.25})` : `translateY(${off}px) scaleY(${1 + (1 - k) * 0.25})`,
                  }}
                >
                  {w}
                </Smear>
              );
            })}
          </React.Fragment>
        );
      })}
    </Smear>
  );
};

// =====================================================================================
// 3. 3D receding / fly-in words with camera pan + rack focus (12)
// =====================================================================================
export const Words3D: React.FC<
  Txt & {
    words: string[];
    f: number;
    starts?: number[];
    stagger?: number; // 4-6f@30
    dur?: number; // 8f@30
    accentIdx?: number[];
    accentColor?: string;
    anchor?: number; // newest word sits this many px right of centre (~60% frame width -> +190 at 1920)
    rack?: boolean; // older words blur 2px / 60%
  }
> = ({words, f, starts, stagger = 10, dur = 16, accentIdx = [], accentColor = '#0A6BF0', anchor = 190, rack = true, size = 110, weight = 700, family = SANS, color = '#111', tracking = -0.03}) => {
  const st = words.map((_, i) => (starts ? starts[i] : i * stagger));
  const {xs, ws} = layout(words, size, weight, family, tracking);
  const centres = xs.map((x, i) => x + ws[i] / 2);
  // camera: eases from one word centre to the next as each arrives (camera follows the newest word)
  let cam = centres[0];
  for (let i = 1; i < words.length; i++) cam += prog(f, st[i], st[i] + dur * 1.6, EASE.inOut) * (centres[i] - centres[i - 1]);
  const newest = st.filter((s) => f >= s).length - 1;
  return (
    <div style={{position: 'relative', height: size * 1.2, width: 0, perspective: 1400, transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${-cam + anchor}px)`, transformStyle: 'preserve-3d'}}>
        {words.map((w, i) => {
          const lf = f - st[i];
          if (lf < 0) return null;
          const k = prog(lf, 0, dur);
          const old = rack ? tw(f, [st[Math.min(newest, words.length - 1)], st[Math.min(newest, words.length - 1)] + 10], [0, 1]) * (i < newest ? 1 : 0) : 0;
          return (
            <Smear
              key={i}
              x={(1 - k) * 30}
              style={{
                ...txtStyle({size, weight, family, tracking, color: accentIdx.includes(i) ? accentColor : color}),
                position: 'absolute',
                left: xs[i],
                top: 0,
                opacity: tw(lf, [0, 4], [0, 1]) * (1 - old * 0.4),
                filter: `blur(${(1 - k) * 12 + old * 2}px)`,
                transform: `translateX(${(1 - k) * 300}px) translateZ(${(1 - k) * -400}px) rotateY(${(1 - k) * 40}deg)`,
                transformOrigin: '0% 50%',
              }}
            >
              {w}
            </Smear>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================================================
// 4. Slot word cycle: vertical roll (09) or blur crossfade (03)
// =====================================================================================
export const SlotCycle: React.FC<
  Txt & {
    words: string[];
    f: number;
    hold?: number | number[]; // frames each word holds (0.6-0.8 s); array = per word
    dur?: number; // 5f@30 roll / 6f@30 blur -> 10/12
    mode?: 'roll' | 'blur';
    align?: 'left' | 'center';
    colors?: string[]; // per-word colour
  }
> = ({words, f, hold = 44, dur, mode = 'roll', align = 'left', colors, size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.025}) => {
  const d = dur ?? (mode === 'roll' ? 10 : 12);
  const holds = words.map((_, i) => (Array.isArray(hold) ? hold[i] ?? 44 : hold));
  const at: number[] = [0];
  for (let i = 1; i < words.length; i++) at[i] = at[i - 1] + holds[i - 1];
  const cur = Math.max(0, at.filter((a) => f >= a).length - 1);
  const ws = words.map((w) => textW(w, size, weight, family, tracking * size));
  const k = cur === 0 ? 1 : prog(f, at[cur], at[cur] + d);
  const width = cur === 0 ? ws[0] : lerp(ws[cur - 1], ws[cur], k);
  const lh = size * 1.2;
  const one = (i: number, p: number, dir: 1 | -1) => {
    // p: 0 = at rest, 1 = fully gone
    const st: React.CSSProperties = {
      ...txtStyle({size, weight, family, tracking, color: colors?.[i] ?? color}),
      position: 'absolute',
      top: 0,
      left: align === 'center' ? (width - ws[i]) / 2 : 0,
    };
    if (mode === 'roll')
      return (
        <Smear key={i + '-' + dir} y={Math.sin(Math.min(1, Math.abs(p)) * Math.PI) * 4 + Math.abs(p) * 3} style={{...st, transform: `translateY(${p * dir * lh}px)`}}>
          {words[i]}
        </Smear>
      );
    return (
      <div key={i + '-' + dir} style={{...st, opacity: 1 - Math.abs(p), filter: `blur(${Math.abs(p) * 8}px)`, transform: `translateY(${p * dir * 10}px)`}}>
        {words[i]}
      </div>
    );
  };
  return (
    <div style={{position: 'relative', display: 'inline-block', verticalAlign: 'bottom', width, height: lh, overflow: mode === 'roll' ? 'hidden' : 'visible'}}>
      {cur > 0 && k < 1 && one(cur - 1, k, 1)}
      {one(cur, cur === 0 ? 0 : 1 - k, -1)}
    </div>
  );
};

// =====================================================================================
// 5. Scramble / decode (02 T3 resolve L->R; 08 random glyph cycle then lock)
// =====================================================================================
export const scrambleText = (text: string, f: number, o: {perChar?: number; preRoll?: number; rate?: number; glyphs?: string; seed?: string; from?: string} = {}) => {
  const {perChar = 4, preRoll = 8, rate = 2, glyphs = '@#%\\{}[]<>/*&$', seed = 's', from} = o;
  if (f < 0) return {chars: (from ?? '').split('').map((c) => ({c, done: true}))};
  const tick = Math.floor(f / rate);
  return {
    chars: text.split('').map((c, i) => {
      const done = f >= preRoll + i * perChar || c === ' ';
      if (done) return {c, done: true};
      return {c: glyphs[Math.floor(random(`${seed}-${i}-${tick}`) * glyphs.length)], done: false};
    }),
  };
};

export const Scramble: React.FC<
  Txt & {
    text: string;
    f: number;
    from?: string; // shown before f=0 (08: "to" -> "life")
    perChar?: number; // 1 char per 2f@30 -> 4
    preRoll?: number; // all glyphs cycle this long before the first locks (08: 4-5f@30 -> 10)
    rate?: number; // glyph change every N frames
    glyphs?: string;
    scrambleColor?: string; // unresolved glyph colour (02: accent red)
    finalColor?: string; // colour after lock (08: accent orange)
    seed?: string;
  }
> = ({text, f, from, perChar = 4, preRoll = 8, rate = 2, glyphs, scrambleColor = '#D83418', finalColor, seed = 'scr', size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.02}) => {
  const {chars} = scrambleText(text, f, {perChar, preRoll, rate, glyphs, seed, from});
  const all = chars.every((c) => c.done) && f >= 0;
  const lockF = preRoll + (text.length - 1) * perChar;
  const fin = finalColor ? interpolateColors(f, [lockF, lockF + 6], [color, finalColor]) : color;
  return (
    <span style={{...txtStyle({size, weight, family, tracking, color: f < 0 ? color : fin})}}>
      {chars.map((c, i) => (
        <span key={i} style={{color: c.done ? undefined : scrambleColor, opacity: c.done || all ? 1 : 0.85}}>
          {c.c}
        </span>
      ))}
    </span>
  );
};

// =====================================================================================
// 6. Split-word baseline morph (17: "const|antly" -> "chan|ging.")
// =====================================================================================
export const SplitMorph: React.FC<
  Txt & {
    from: [string, string]; // prefix, suffix
    to: [string, string];
    f: number; // 0 = split starts
    accent?: string; // new halves are reborn in this colour with bloom
    bloom?: boolean;
  }
> = ({from, to, f, accent = '#E5243B', bloom = true, size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.025}) => {
  // 0-16 split (~10px @24px text -> 0.4em), 16-32 separate further (~20px), 32-40 vertical-blur swap, 40-64 rejoin
  const s1 = prog(f, 0, 16, EASE.inOut) * 0.4;
  const s2 = prog(f, 16, 32, EASE.inOut) * 0.55;
  const back = prog(f, 42, 66, EASE.out);
  const off = (s1 + s2) * (1 - back) * size;
  const swapped = f >= 36;
  const vb = bump(f, 32, 42) * 10;
  const [a, b] = swapped ? to : from;
  const ls = tracking * size;
  const wa = textW(a, size, weight, family, ls),
    wb = textW(b, size, weight, family, ls);
  const col = swapped ? interpolateColors(f, [44, 58], [accent, color]) : color;
  const glow = bloom ? tw(f, [34, 40, 66], [0, 0.5, 0], EASE.out) : 0;
  const st = {...txtStyle({size, weight, family, tracking, color: col}), position: 'absolute' as const, top: 0};
  return (
    <div style={{position: 'relative', height: size * 1.2, width: 0}}>
      <div
        style={{
          position: 'absolute',
          left: -(wa + wb) / 2 - size * 0.6,
          top: -size * 0.45,
          width: wa + wb + size * 1.2,
          height: size * 2.1,
          background: `radial-gradient(closest-side, ${hexA(accent, glow)}, transparent)`,
          filter: 'blur(24px)',
        }}
      />
      <Smear y={vb} style={{...st, left: -(wa + wb) / 2, transform: `translateY(${-off}px)`}}>
        {a}
      </Smear>
      <Smear y={vb} style={{...st, left: -(wa + wb) / 2 + wa, transform: `translateY(${off}px)`}}>
        {b}
      </Smear>
    </div>
  );
};

// =====================================================================================
// 7. Brackets that widen to fit (14 "[ Your product ]", 03 "< too many signals >" + guides, 16 glyph cycling)
// =====================================================================================
export type BracketWord = {text: string; at: number; color?: string; family?: string; weight?: number};
export const BracketWords: React.FC<
  Txt & {
    words: BracketWord[];
    f: number; // brackets appear at 0, start touching, open over 12f (6f@30 expo-out)
    open?: [string, string];
    cycle?: [string, string][]; // 16: glyph pairs cycle every `cycleRate` frames until lockAt
    cycleRate?: number;
    lockAt?: number;
    bracketColor?: string;
    bracketWeight?: number;
    pad?: number; // gap between bracket and text (em)
    guides?: boolean; // 03: 1px vertical guides at text edges, full height, 25%
    guideColor?: string;
    guideHeight?: number;
  }
> = ({
  words,
  f,
  open = ['[', ']'],
  cycle,
  cycleRate = 6,
  lockAt = 0,
  bracketColor,
  bracketWeight = 400,
  pad = 0.22,
  guides = false,
  guideColor = '#ffffff',
  guideHeight = 1080,
  size = 96,
  weight = 600,
  family = SANS,
  color = '#111',
  tracking = -0.025,
}) => {
  const sp = size * 0.26;
  const ws = words.map((w) => textW(w.text, size, w.weight ?? weight, w.family ?? family, tracking * size));
  const vis = words.map((w) => prog(f, w.at, w.at + 12));
  const inner = Math.max(0, words.reduce((s, _, i) => s + vis[i] * (ws[i] + sp), 0) - sp * Math.min(1, vis.reduce((a, b) => a + b, 0)));
  const opened = prog(f, 0, 12) * size * pad;
  const half = inner / 2 + opened;
  const pair = cycle && f < lockAt ? cycle[Math.floor(Math.max(0, f) / cycleRate) % cycle.length] : open;
  const bs: React.CSSProperties = {
    ...txtStyle({size: size * 1.2, weight: bracketWeight, family: SANS, tracking: 0, color: bracketColor ?? color}),
    position: 'absolute',
    top: -size * 0.12,
    opacity: tw(f, [0, 4], [0, 1]),
  };
  const bw = (s: string) => textW(s, size * 1.2, bracketWeight, SANS);
  let x = -inner / 2;
  return (
    <div style={{position: 'relative', height: size * 1.2, width: 0}}>
      {guides &&
        [-inner / 2, inner / 2].map((gx, i) => (
          <div key={i} style={{position: 'absolute', left: gx, top: size * 0.6 - guideHeight / 2, width: 1, height: guideHeight, background: hexA(guideColor, 0.25 * prog(f, 0, 16))}} />
        ))}
      <div style={{...bs, left: -half - bw(pair[0])}}>{pair[0]}</div>
      <div style={{...bs, left: half}}>{pair[1]}</div>
      {words.map((w, i) => {
        const l = x;
        x += vis[i] * (ws[i] + sp);
        const lf = f - w.at;
        if (lf < 0) return null;
        return (
          <div
            key={i}
            style={{
              ...txtStyle({size, weight: w.weight ?? weight, family: w.family ?? family, tracking, color: w.color ?? color}),
              position: 'absolute',
              left: l,
              top: 0,
              opacity: tw(lf, [2, 10], [0, 1]),
              filter: `blur(${tw(lf, [0, 10], [4, 0])}px)`,
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

/** Viewfinder corner brackets (15): a 4-dot square splits into corners that frame w x h. */
export const Viewfinder: React.FC<{f: number; w: number; h: number; color?: string; arm?: number; stroke?: number; dur?: number}> = ({f, w, h, color = '#fff', arm = 22, stroke = 3, dur = 18}) => {
  const k = prog(f, 4, 4 + dur);
  const cw = lerp(14, w, k),
    ch = lerp(14, h, k);
  const a = lerp(2, arm, prog(f, 0, 10));
  return (
    <div style={{position: 'absolute', left: -cw / 2, top: -ch / 2, width: cw, height: ch, opacity: tw(f, [0, 3], [0, 1])}}>
      {[0, 1, 2, 3].map((i) => {
        const r = i % 2 === 1,
          b = i > 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              [r ? 'right' : 'left']: 0,
              [b ? 'bottom' : 'top']: 0,
              width: a,
              height: a,
              borderColor: color,
              borderStyle: 'solid',
              borderWidth: `${b ? 0 : stroke}px ${r ? stroke : 0}px ${b ? stroke : 0}px ${r ? 0 : stroke}px`,
            }}
          />
        );
      })}
    </div>
  );
};

// =====================================================================================
// 8. Card / image inline in a sentence (16 "How the hell [card] did they", 02 icon tiles)
// =====================================================================================
export const InlineCard: React.FC<
  Txt & {
    left: string;
    right: string;
    f: number;
    cards: React.ReactNode[]; // content swapped on each beat
    beat?: number; // 0.48 s -> 29f
    cardW?: number;
    cardH?: number;
    radius?: number;
    echo?: boolean; // words whip in from the sides with a horizontal echo
  }
> = ({left, right, f, cards, beat = 29, cardW = 230, cardH = 134, radius = 22, echo = true, size = 80, weight = 600, family = SANS, color = '#fff', tracking = -0.02}) => {
  const ls = tracking * size;
  const wl = textW(left, size, weight, family, ls),
    wr = textW(right, size, weight, family, ls);
  const g = size * 0.3;
  const cp = prog(f, 0, 18, EASE.back);
  const cw = cardW * Math.max(0, cp);
  const tot = wl + wr + cw + g * 2 * Math.min(1, cp * 2);
  const xl = -tot / 2,
    xc = xl + wl + g * Math.min(1, cp * 2),
    xr = xc + cw + g * Math.min(1, cp * 2);
  const wordIn = (lf: number, dir: number, text: string, x: number) => {
    const k = prog(lf, 0, 14);
    const off = (1 - k) * 260 * dir;
    const st = {...txtStyle({size, weight, family, tracking, color}), position: 'absolute' as const, top: (cardH - size * 1.2) / 2};
    return (
      <>
        {echo &&
          [3, 2, 1].map((e) => (
            <div key={e} style={{...st, left: x + off * (1 + e * 0.35), opacity: (1 - k) * 0.22 * (4 - e) * tw(lf, [0, 3], [0, 1])}}>
              {text}
            </div>
          ))}
        <Smear x={(1 - k) * 30} style={{...st, left: x + off, opacity: tw(lf, [0, 4], [0, 1])}}>
          {text}
        </Smear>
      </>
    );
  };
  const n = Math.max(0, Math.floor((f - 18) / beat));
  const fb = (f - 18) % beat;
  const flip = f < 18 ? 0 : fb < 4 ? tw(fb, [0, 4], [0, 90], EASE.in) : 0; // hide old then show new
  const flipIn = f >= 18 && n > 0 && fb >= 4 && fb < 8 ? tw(fb, [4, 8], [-90, 0], EASE.out) : 0;
  const idx = fb < 4 && n > 0 ? n - 1 : n;
  return (
    <div style={{position: 'relative', height: cardH, width: 0, perspective: 800}}>
      {wordIn(f - 4, -1, left, xl)}
      <div
        style={{
          position: 'absolute',
          left: xc,
          top: 0,
          width: cw,
          height: cardH,
          borderRadius: radius,
          overflow: 'hidden',
          transform: `rotateX(${flip || flipIn}deg) scale(${0.6 + 0.4 * Math.min(1, cp)})`,
          boxShadow: '0 18px 40px rgba(0,0,0,.35)',
          background: '#1b1b1b',
        }}
      >
        {cards[idx % cards.length]}
      </div>
      {wordIn(f - 8, 1, right, xr)}
    </div>
  );
};

// =====================================================================================
// 9. Text on a sine path with echo trail (07 "Need some ideas?")
// =====================================================================================
export const WaveText: React.FC<
  Txt & {
    text: string;
    f: number;
    amp?: number; // 60px at 1080p
    wavelength?: number; // 500px
    travel?: number; // 700px in 12-15f@30
    dur?: number;
    stagger?: number; // 1.2f@30
    trail?: string; // ghost colour #B67780 at ~50%
    exitAt?: number; // conveyor exit: letters smear left along the wave
  }
> = ({text, f, amp = 60, wavelength = 500, travel = 700, dur = 28, stagger = 2.4, trail = '#B67780', exitAt, size = 110, weight = 400, family = GEO, color = '#1A1A1A', tracking = 0}) => {
  const chars = text.split('');
  const ls = tracking * size;
  const tot = textW(text, size, weight, family, ls);
  let acc = -tot / 2;
  const slots = chars.map((c) => {
    const x = acc;
    acc += textW(c, size, weight, family, ls);
    return x;
  });
  const pose = (fr: number, i: number) => {
    const t = clamp01((fr - i * stagger) / dur);
    const e = EASE.out(t);
    const ex = exitAt === undefined ? 0 : EASE.in(clamp01((fr - exitAt - i * stagger * 0.6) / dur));
    const along = (1 - e) * travel - ex * travel * 1.3;
    const x = slots[i] + along;
    const a = amp * (Math.abs(along) / travel);
    const ph = (x / wavelength) * Math.PI * 2 + fr * 0.1;
    const y = Math.sin(ph) * a;
    const rot = (Math.atan(Math.cos(ph) * a * ((Math.PI * 2) / wavelength)) * 180) / Math.PI;
    return {x, y, rot, o: tw(t, [0, 0.15], [0, 1]) * (1 - tw(ex, [0.5, 0.9], [0, 1])), moving: (t > 0 && t < 1) || (ex > 0 && ex < 1), v: Math.abs(1 - t) + ex};
  };
  const st = {...txtStyle({size, weight, family, tracking, color}), position: 'absolute' as const, top: -size * 0.6, transformOrigin: '50% 60%'};
  return (
    <div style={{position: 'relative', width: 0, height: 0}}>
      {chars.map((c, i) => {
        const p = pose(f, i);
        const echoes = [8, 4].map((lag) => ({lag, p: pose(f - lag, i)}));
        return (
          <React.Fragment key={i}>
            {p.moving &&
              echoes.map(({lag, p: q}) => (
                <div key={lag} style={{...st, color: trail, left: q.x, opacity: q.o * (lag === 4 ? 0.5 : 0.25), filter: 'blur(2px)', transform: `translateY(${q.y}px) rotate(${q.rot}deg)`}}>
                  {c}
                </div>
              ))}
            <Smear x={p.moving ? Math.min(12, p.v * 14) : 0} style={{...st, left: p.x, opacity: p.o, transform: `translateY(${p.y}px) rotate(${p.rot}deg)`}}>
              {c}
            </Smear>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// =====================================================================================
// 10. Typewriter input box with caret + camera follow (02 T4 Flo, 12 search macro, 18 Nova, 11 cyan caret)
// =====================================================================================
/** Frame offset of each char: base cps plus seeded jitter and longer pauses after punctuation (18). */
export const typeSchedule = (text: string, o: {cps?: number; fps?: number; jitter?: number; pause?: [number, number]; seed?: string} = {}) => {
  const {cps = 16, fps = 60, jitter = 0.35, pause = [8, 16], seed = 'type'} = o;
  const base = fps / cps;
  const out: number[] = [];
  let t = 0;
  for (let i = 0; i < text.length; i++) {
    out.push(Math.round(t));
    t += base * (1 + (random(`${seed}${i}`) - 0.5) * 2 * jitter);
    if (',.?!'.includes(text[i])) t += lerp(pause[0], pause[1], random(`${seed}p${i}`));
  }
  return out;
};
export const typedCount = (sched: number[], f: number) => sched.filter((s) => f >= s).length;

export const Caret: React.FC<{f: number; h: number; color?: string; w?: number; glow?: boolean; blink?: boolean}> = ({f, h, color = '#111', w = 3, glow = false, blink = true}) => (
  <span
    style={{
      display: 'inline-block',
      width: w,
      height: h,
      marginLeft: w,
      verticalAlign: 'middle',
      background: color,
      borderRadius: w,
      opacity: blink && f % 32 >= 16 ? 0 : 1,
      boxShadow: glow ? `0 0 12px ${color}, 0 0 28px ${hexA(color.length === 7 ? color : '#19D3FF', 0.5)}` : undefined,
    }}
  />
);

/** greedy word wrap of `str` into lines no wider than `maxW` */
const wrapLines = (str: string, maxW: number, size: number, weight: number, family: string, ls: number) => {
  const lines: string[] = [''];
  for (const tok of str.split(/(?<= )/)) {
    const cur = lines[lines.length - 1];
    if (cur && textW((cur + tok).trimEnd(), size, weight, family, ls) > maxW) lines.push(tok);
    else lines[lines.length - 1] = cur + tok;
  }
  return lines;
};

const WrapBox: React.FC<any> = (p) => {
  const {text, s, f, n, wrap, placeholder, width, h, radius, bg, border, shadow, right, underglow, g, padX, size, weight, family, color, tracking, ls, caretColor, caretGlow, typing} = p;
  const lineH = size * 1.25;
  const maxW = width - padX * 2 - (right ? size * 1.8 : 0);
  const linesAt = (fr: number) => Math.min(wrap, wrapLines(text.slice(0, typedCount(s, fr)), maxW, size, weight, family, ls).length);
  // box height eases to the new line count over ~10 f
  let acc = 0;
  for (let k = 0; k < 10; k++) acc += linesAt(f - k);
  const lnS = EASE.inOut(acc / 10 - Math.floor(acc / 10)) + Math.floor(acc / 10);
  const H = h + (lnS - 1) * lineH;
  const lines = wrapLines(text.slice(0, n), maxW, size, weight, family, ls);
  const vis = lines.slice(-wrap);
  return (
    <div style={{position: 'relative', width, height: H}}>
      {underglow && (
        <div style={{position: 'absolute', left: width * 0.1, right: width * 0.1, bottom: -h * 0.6, height: h * 1.4, borderRadius: '50%', background: underglow, filter: 'blur(90px)', opacity: 0.8 * g}} />
      )}
      <div style={{position: 'absolute', inset: 0, top: (H * (1 - g)) / 2, height: H * g, borderRadius: radius, background: bg, border, boxShadow: shadow, overflow: 'hidden', opacity: tw(g, [0, 0.2], [0, 1])}}>
        <div style={{position: 'absolute', left: padX, top: (h - lineH) / 2, width: maxW, ...txtStyle({size, weight, family, tracking, color}), lineHeight: `${lineH}px`}}>
          {n === 0 && placeholder ? (
            <span style={{opacity: 0.4}}>{placeholder}</span>
          ) : (
            vis.map((l: string, i: number) => (
              <div key={i} style={{height: lineH, display: 'flex', alignItems: 'center'}}>
                {l}
                {i === vis.length - 1 && g >= 1 && <Caret f={f} h={size * 1.05} color={caretColor ?? color} w={Math.max(2, size * 0.06)} glow={caretGlow} blink={!typing} />}
              </div>
            ))
          )}
        </div>
        {right && <div style={{position: 'absolute', right: size * 0.35, bottom: 0, height: h, display: 'flex', alignItems: 'center'}}>{right}</div>}
      </div>
    </div>
  );
};

export const TypeBox: React.FC<
  Txt & {
    text: string;
    f: number; // typing starts at 0 (box grows during the 16f before if growIn)
    cps?: number;
    sched?: number[]; // custom schedule (typeSchedule)
    placeholder?: string;
    width?: number; // box width (camera viewport when following)
    height?: number;
    radius?: number;
    bg?: string;
    border?: string;
    caretColor?: string;
    caretGlow?: boolean;
    growIn?: number; // frames the box takes to grow from 0 height before typing (02: 8f@24 -> 20)
    underglow?: string; // 02 Flo violet #6E5BFF
    follow?: {anchor?: number; lag?: number}; // camera keeps caret at anchor*width (0.55-0.6)
    right?: React.ReactNode; // send button / icons
    shadow?: string;
    wrap?: number; // max lines: text wraps (greedy, like a real textarea) and the box grows (18: 2 lines)
  }
> = ({
  text,
  f,
  wrap,
  cps = 16,
  sched,
  placeholder,
  width = 1100,
  height,
  radius = 24,
  bg = '#fff',
  border = '1px solid #E4E4E8',
  caretColor,
  caretGlow = false,
  growIn = 0,
  underglow,
  follow,
  right,
  shadow = '0 20px 50px rgba(20,20,40,.10)',
  size = 48,
  weight = 500,
  family = SANS,
  color = '#141414',
  tracking = -0.01,
}) => {
  const s = sched ?? typeSchedule(text, {cps});
  const n = typedCount(s, f);
  const shown = text.slice(0, n);
  const h = height ?? size * 2.1;
  const g = growIn ? prog(f, -growIn, 0) : 1;
  const padX = size * 0.6;
  const ls = tracking * size;
  const caretX = (fr: number) => textW(text.slice(0, typedCount(s, fr)), size, weight, family, ls);
  let shift = 0;
  if (follow) {
    const lag = follow.lag ?? 6;
    let sum = 0;
    for (let k = 0; k < lag; k++) sum += caretX(f - k);
    const cx = sum / lag;
    shift = Math.max(0, cx + padX - width * (follow.anchor ?? 0.55));
  }
  const typing = n > 0 && n < text.length && f - s[n - 1] < 10;
  if (wrap && wrap > 1) return (
    <WrapBox {...{text, s, f, n, wrap, placeholder, width, h, radius, bg, border, shadow, right, underglow, g, padX, size, weight, family, color, tracking, ls, caretColor, caretGlow, typing}} />
  );
  return (
    <div style={{position: 'relative', width, height: h}}>
      {underglow && (
        <div style={{position: 'absolute', left: width * 0.1, right: width * 0.1, bottom: -h * 0.6, height: h * 1.4, borderRadius: '50%', background: underglow, filter: 'blur(90px)', opacity: 0.8 * g}} />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          top: (h * (1 - g)) / 2,
          height: h * g,
          borderRadius: radius,
          background: bg,
          border,
          boxShadow: shadow,
          overflow: 'hidden',
          opacity: tw(g, [0, 0.2], [0, 1]),
        }}
      >
        <div style={{position: 'absolute', left: padX - shift, top: 0, height: h * g, display: 'flex', alignItems: 'center', ...txtStyle({size, weight, family, tracking, color})}}>
          {n === 0 && placeholder ? <span style={{opacity: 0.4}}>{placeholder}</span> : shown}
          {g >= 1 && <Caret f={f} h={size * 1.05} color={caretColor ?? color} w={Math.max(2, size * 0.06)} glow={caretGlow} blink={!typing} />}
        </div>
        {right && <div style={{position: 'absolute', right: size * 0.35, top: 0, height: '100%', display: 'flex', alignItems: 'center'}}>{right}</div>}
      </div>
    </div>
  );
};

// =====================================================================================
// 11. iOS text-selection highlight with handles (01)
// =====================================================================================
export const SelectWord: React.FC<
  Txt & {
    text: string;
    f: number; // box starts growing at 0
    dur?: number; // 6f@30 -> 12, ease-out cubic
    fill?: string;
    handle?: string;
    selectedColor?: string;
  }
> = ({text, f, dur = 12, fill = 'rgba(79,159,212,0.85)', handle = '#0333F5', selectedColor = '#000', size = 96, weight = 600, family = SANS, color = '#fff', tracking = -0.025}) => {
  const w = textW(text, size, weight, family, tracking * size);
  const k = prog(f, 0, dur, (t) => 1 - Math.pow(1 - t, 3));
  const padX = size * 0.06;
  const h = size * 1.12;
  const top = size * 0.05;
  const bw = (w + padX * 2) * k;
  const dot = Math.max(10, size * 0.15);
  const st = {...txtStyle({size, weight, family, tracking}), position: 'absolute' as const, left: 0, top: 0};
  const on = f >= 0;
  return (
    <span style={{position: 'relative', display: 'inline-block', width: w, height: size * 1.2, verticalAlign: 'bottom'}}>
      {on && <span style={{position: 'absolute', left: -padX, top, width: bw, height: h, background: fill, borderRadius: 2}} />}
      <span style={{...st, color}}>{text}</span>
      {on && (
        <span style={{...st, color: selectedColor, clipPath: `inset(0 ${Math.max(0, w - bw + padX)}px 0 0)`}}>
          {text}
        </span>
      )}
      {on && (
        <>
          {/* start handle: stem + dot at bottom-left (appears at start) */}
          <span style={{position: 'absolute', left: -padX - 1, top, width: 2, height: h, background: handle, opacity: tw(f, [0, 3], [0, 1])}} />
          <span style={{position: 'absolute', left: -padX - dot / 2, top: top + h - 2, width: dot, height: dot, borderRadius: '50%', background: handle, opacity: tw(f, [0, 3], [0, 1])}} />
          {/* end handle leads the box: dot on top-right */}
          <span style={{position: 'absolute', left: -padX + bw - 1, top, width: 2, height: h, background: handle}} />
          <span style={{position: 'absolute', left: -padX + bw - dot / 2, top: top - dot + 2, width: dot, height: dot, borderRadius: '50%', background: handle}} />
        </>
      )}
    </span>
  );
};

// =====================================================================================
// 12. Headline -> URL / CTA pill (02 T7 onepoint.com; also 11 "Post" pill)
// =====================================================================================
export const UrlPill: React.FC<
  Txt & {
    from: string; // headline that deletes back to its first letter
    url: string; // typed inside the pill (pill width tracks text width)
    f: number;
    delRate?: number; // 1 char/frame@30 -> 2
    typeRate?: number;
    gradient?: [string, string];
    textColor?: string;
    pillH?: number;
  }
> = ({from, url, f, delRate = 2, typeRate = 3, gradient = ['#B48BF0', '#8A5BE0'], textColor = '#fff', pillH, size = 72, weight = 500, family = SANS, color = '#2A1F3D', tracking = -0.02}) => {
  const delEnd = (from.length - 1) * delRate;
  const pillAt = delEnd + 6;
  const typeAt = pillAt + 16;
  const kept = Math.max(1, from.length - Math.max(0, Math.floor(f / delRate)));
  const typed = Math.max(0, Math.floor((f - typeAt) / typeRate) + 1);
  const ls = tracking * size;
  const txt = f < typeAt ? from.slice(0, kept) : url.slice(0, Math.max(1, Math.min(url.length, typed)));
  const H = pillH ?? size * 1.5;
  const pad = size * 0.55;
  // pill width eases toward the text width (spring-ish lag via averaged targets)
  let sum = 0;
  for (let k = 0; k < 6; k++) {
    const fr = f - k * 2;
    const t2 = fr < typeAt ? from.slice(0, 1) : url.slice(0, Math.max(1, Math.min(url.length, Math.floor((fr - typeAt) / typeRate) + 1)));
    sum += textW(t2, size, weight, family, ls);
  }
  const tw0 = sum / 6;
  const pk = prog(f, pillAt, pillAt + 14, EASE.back);
  const pw = lerp(textW(txt, size, weight, family, ls), tw0 + pad * 2, clamp01(pk));
  const inPill = f >= pillAt;
  const tc = inPill ? interpolateColors(f, [pillAt, pillAt + 6], [color, textColor]) : color;
  return (
    <div style={{position: 'relative', width: 0, height: H}}>
      {inPill && (
        <div
          style={{
            position: 'absolute',
            left: -pw / 2,
            top: (H - H * Math.min(1, pk)) / 2,
            width: pw,
            height: H * Math.min(1.05, Math.max(0, pk)),
            borderRadius: 999,
            background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
            boxShadow: `0 ${size * 0.15}px ${size * 0.4}px ${hexA(gradient[1], 0.35)}, inset 0 2px 0 rgba(255,255,255,.3)`,
          }}
        />
      )}
      <div style={{...txtStyle({size, weight, family, tracking, color: tc}), position: 'absolute', top: (H - size * 1.2) / 2, left: -textW(txt, size, weight, family, ls) / 2}}>{txt}</div>
    </div>
  );
};

// =====================================================================================
// 13. White <-> black flip on a keyword (11)
// =====================================================================================
export type FlipBeat = {at: number; dark: boolean};
/** Hard-cut theme at frame f (no interpolation, flips land on music onsets). */
export const flipAt = (f: number, beats: FlipBeat[], light = {bg: '#FFFFFF', fg: '#000000'}, dark = {bg: '#000000', fg: '#FFFFFF'}) => {
  const cur = [...beats].reverse().find((b) => f >= b.at);
  return cur?.dark ? dark : light;
};

/** One emotional word on a flip beat: fades up from a 4px blur over 4f@30, optional slow scale and bloom (11 "have"). */
export const FlipWord: React.FC<Txt & {text: string; f: number; bloom?: string; drift?: number}> = ({text, f, bloom, drift = 0.15, size = 220, weight = 700, family = SANS, color = '#fff', tracking = -0.04}) => (
  <div style={{position: 'relative', display: 'inline-block'}}>
    {bloom && <div style={{position: 'absolute', inset: -size * 0.6, borderRadius: '50%', background: `radial-gradient(closest-side, ${hexA(bloom, 0.55)}, transparent)`, filter: 'blur(40px)', opacity: tw(f, [0, 10], [0, 1])}} />}
    <div
      style={{
        ...txtStyle({size, weight, family, tracking, color}),
        position: 'relative',
        opacity: tw(f, [0, 8], [0, 1]),
        filter: `blur(${tw(f, [0, 8], [4, 0])}px)`,
        transform: `scale(${1 + drift * prog(f, 0, 120, (t) => t)})`,
        textShadow: bloom ? `0 0 30px ${hexA(bloom, 0.8)}` : undefined,
      }}
    >
      {text}
    </div>
  </div>
);

// =====================================================================================
// 14. Letter stagger with travelling colour sweep (02 "Introducing") and general letter type-on (08, 15, 16, 02F)
// =====================================================================================
export const LetterType: React.FC<
  Txt & {
    text: string;
    f: number;
    perChar?: number; // 08: 1 char/frame@30 -> 2
    dur?: number; // 08: 4f@30 -> 8
    blur?: number;
    trackingFrom?: number; // em; 08 +0.1, 15 "Rerun" wide -> normal, 16 1em collapse
    trackingDur?: number;
    dy?: number;
    gradient?: string[]; // per-letter colour gradient across the word (02F pink #E79BC0 -> violet #B68BE8)
    sweep?: string[]; // colour stops a new letter passes through before settling to `color` (02 x.ai)
    sweepDur?: number;
    grow?: {from: number; at: number; dur?: number}; // 02: giant (from x size) then shrinks to body size
  }
> = ({text, f, perChar = 2, dur = 8, blur = 6, trackingFrom, trackingDur, dy = 0, gradient, sweep, sweepDur = 20, grow, size = 96, weight = 600, family = SANS, color = '#111', tracking = -0.02}) => {
  const chars = text.split('');
  const tr = trackingFrom === undefined ? tracking : lerp(trackingFrom, tracking, prog(f, 0, trackingDur ?? chars.length * perChar + dur));
  const sc = grow ? lerp(grow.from, 1, prog(f, grow.at, grow.at + (grow.dur ?? 24), EASE.inOut)) : 1;
  return (
    <span style={{...txtStyle({size: size * sc, weight, family, tracking: tr, color}), display: 'inline-block'}}>
      {chars.map((c, i) => {
        const lf = f - i * perChar;
        let col = gradient ? interpolateColors(i / Math.max(1, chars.length - 1), gradient.map((_, k) => k / (gradient.length - 1)), gradient) : color;
        if (sweep) col = interpolateColors(lf, [...sweep.map((_, k) => (k * sweepDur) / sweep.length), sweepDur], [...sweep, col]);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: col,
              opacity: tw(lf, [0, dur * 0.6], [0, 1]),
              filter: `blur(${tw(lf, [0, dur], [blur, 0])}px)`,
              transform: `translateY(${tw(lf, [0, dur], [dy, 0])}px)`,
            }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        );
      })}
    </span>
  );
};

/** Letters fly in along a curved 3D arc from the right (15 "Handled everyday", 13 "Two Creators"). */
export const ArcLetters: React.FC<Txt & {text: string; f: number; stagger?: number; dur?: number; tint?: string; radius?: number}> = ({text, f, stagger = 2, dur = 20, tint = '#7B5CFF', radius = 500, size = 96, weight = 600, family = SANS, color = '#fff', tracking = -0.02}) => (
  <span style={{...txtStyle({size, weight, family, tracking, color}), display: 'inline-block', perspective: 900}}>
    {text.split('').map((c, i) => {
      const k = prog(f - i * stagger, 0, dur);
      const ang = (1 - k) * 60;
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            color: interpolateColors(k, [0.4, 1], [tint, color]),
            opacity: tw(k, [0, 0.3], [0, 1]),
            filter: `blur(${(1 - k) * 6}px)`,
            transform: `translateX(${Math.sin((ang * Math.PI) / 180) * radius}px) translateZ(${-(1 - Math.cos((ang * Math.PI) / 180)) * radius - (1 - k) * 200}px) rotateY(${ang}deg)`,
            textShadow: k < 1 ? `0 0 ${20 * (1 - k)}px ${tint}` : undefined,
          }}
        >
          {c === ' ' ? ' ' : c}
        </span>
      );
    })}
  </span>
);

// =====================================================================================
// 15. Typed tag boxes with ✕ -> ✓ rhyme (15)
// =====================================================================================
export const TAG = {
  bad: {fill: 'rgba(200,40,60,.18)', border: '#C0303A', mark: '#FF3048', glyph: 'x'},
  good: {fill: 'rgba(60,200,100,.18)', border: '#2E9E50', mark: '#3DDC6A', glyph: 'check'},
} as const;

export const TagBox: React.FC<Txt & {text: string; f: number; kind?: keyof typeof TAG; cps?: number; caret?: boolean}> = ({text, f, kind = 'bad', cps = 16, caret = true, size = 40, weight = 500, family = SANS, color = '#fff', tracking = -0.01}) => {
  const c = TAG[kind];
  const per = 60 / cps;
  const n = Math.max(0, Math.min(text.length, Math.floor(f / per) + 1));
  const doneF = text.length * per;
  const m = tw(f, [doneF, doneF + 6, doneF + 10], [0, 1.2, 1], EASE.out);
  const ms = size * 0.42;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.35,
        padding: `${size * 0.18}px ${size * 0.3}px`,
        borderRadius: size * 0.12,
        background: c.fill,
        border: `1px solid ${c.border}`,
        opacity: tw(f, [-4, 2], [0, 1]),
        transform: `translateY(${tw(f, [-4, 6], [8, 0])}px)`,
      }}
    >
      <span style={txtStyle({size, weight, family, tracking, color})}>
        {text.slice(0, n)}
        {caret && f < doneF + 20 && <Caret f={f} h={size} color="#fff" w={2} blink={f > doneF} />}
      </span>
      <svg width={ms} height={ms} viewBox="0 0 24 24" style={{transform: `scale(${m})`, opacity: m > 0 ? 1 : 0}}>
        {c.glyph === 'x' ? (
          <path d="M5 5 L19 19 M19 5 L5 19" stroke={c.mark} strokeWidth={3.2} strokeLinecap="round" fill="none" />
        ) : (
          <path d="M4 12.5 L9.5 18 L20 6.5" stroke={c.mark} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
      </svg>
    </div>
  );
};

// =====================================================================================
// 16. Serif / script accent words (14 "everywhere", 13 "Now!")
// =====================================================================================
export type Seg = {text: string; accent?: 'serif' | 'script' | 'color'; color?: string};
/** A line mixing grotesk + serif italic (14: 1.2x size, #5A4A40) or script; segments blur in with a stagger. */
export const MixLine: React.FC<Txt & {segs: Seg[]; f: number; stagger?: number; accentColor?: string}> = ({segs, f, stagger = 8, accentColor = '#5A4A40', size = 96, weight = 500, family = SANS, color = '#111', tracking = -0.025}) => (
  <span style={{display: 'inline-flex', alignItems: 'baseline', gap: size * 0.26}}>
    {segs.map((s, i) => {
      const lf = f - i * stagger;
      const serif = s.accent === 'serif',
        script = s.accent === 'script';
      return (
        <span
          key={i}
          style={{
            ...txtStyle({
              size: serif ? size * 1.2 : script ? size * 1.25 : size,
              weight: serif ? 400 : script ? 700 : weight,
              family: serif ? SERIF : script ? SCRIPT : family,
              tracking: serif || script ? 0 : tracking,
              color: s.color ?? (s.accent ? accentColor : color),
            }),
            fontStyle: serif ? 'italic' : 'normal',
            opacity: tw(lf, [0, 8], [0, 1]),
            filter: `blur(${tw(lf, [0, 10], [6, 0])}px)`,
            transform: `translateY(${tw(lf, [0, 12], [size * 0.08, 0])}px)`,
          }}
        >
          {s.text}
        </span>
      );
    })}
  </span>
);

/** Script write-on: italic script clipped by a soft left->right mask over 10f@30 (13, colour #0048F0). */
export const ScriptWriteOn: React.FC<Txt & {text: string; f: number; dur?: number; slant?: number}> = ({text, f, dur = 20, slant = -6, size = 160, weight = 700, family = SCRIPT, color = '#0048F0', tracking = 0}) => {
  const k = prog(f, 0, dur, EASE.inOut);
  const edge = k * 120 - 10;
  const mask = `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 10}%)`;
  return (
    <span style={{...txtStyle({size, weight, family, tracking, color}), display: 'inline-block', padding: '0 0.15em', WebkitMaskImage: mask, maskImage: mask, transform: `skewX(${slant}deg)`}}>
      {text}
    </span>
  );
};

// =====================================================================================
// Extras called out in the studies
// =====================================================================================
/** 16 #7: highlight box wipes L->R (6f@30) like a marker, then text types inside in black. */
export const HighlightType: React.FC<Txt & {text: string; f: number; fill?: string; wipe?: number; perChar?: number}> = ({text, f, fill = '#3DDC57', wipe = 12, perChar = 3, size = 80, weight = 600, family = SANS, color = '#000', tracking = -0.02}) => {
  const w = textW(text, size, weight, family, tracking * size) + size * 0.5;
  const k = prog(f, 0, wipe, EASE.out);
  const n = Math.max(0, Math.min(text.length, Math.floor((f - wipe) / perChar) + 1));
  return (
    <span style={{position: 'relative', display: 'inline-block', width: w, height: size * 1.35, verticalAlign: 'middle'}}>
      <span style={{position: 'absolute', inset: 0, background: fill, transform: `scaleX(${k})`, transformOrigin: '0 50%', borderRadius: size * 0.08}} />
      <span style={{...txtStyle({size, weight, family, tracking, color}), position: 'absolute', left: size * 0.25, top: size * 0.07}}>{text.slice(0, n)}</span>
    </span>
  );
};

/** 16 #2: 2-4 frames of a heavy faux-3D extrusion "hit" on a word entering/leaving. */
export const ExtrudeFlash: React.FC<Txt & {text: string; f: number; hit?: number; depth?: number; side?: string}> = ({text, f, hit = 6, depth = 8, side = '#888', size = 96, weight = 500, family = SANS, color = '#fff', tracking = -0.02}) => {
  const on = f >= 0 && f < hit;
  return (
    <span style={{...txtStyle({size, weight: on ? 900 : weight, family, tracking, color}), textShadow: on ? Array.from({length: depth}, (_, i) => `${(i + 1) * 2}px ${(i + 1) * 2}px 0 ${side}`).join(',') : 'none'}}>{text}</span>
  );
};

/** 13: chunky title words with a blue extrusion (6 stacked copies) popping 0.4 -> 1.1 -> 1 over 7f@30. */
export const ExtrudedTitle: React.FC<Txt & {words: string[]; f: number; stagger?: number; side?: string; depth?: number}> = ({words, f, stagger = 8, side = '#1E4FE0', depth = 6, size = 120, weight = 800, family = SANS, color = '#fff', tracking = -0.03}) => (
  <span style={{display: 'inline-flex', gap: size * 0.25, flexWrap: 'wrap', justifyContent: 'center'}}>
    {words.map((w, i) => {
      const lf = f - i * stagger;
      const s = tw(lf, [0, 9, 14], [0.4, 1.1, 1], EASE.out);
      return (
        <span
          key={i}
          style={{
            ...txtStyle({size, weight, family, tracking, color}),
            display: 'inline-block',
            opacity: lf < 0 ? 0 : tw(lf, [0, 3], [0, 1]),
            transform: `scale(${s})`,
            textShadow: Array.from({length: depth}, (_, k) => `${(k + 1) * 1}px ${(k + 1) * 1.4}px 0 ${side}`).join(',') + ', 0 14px 22px rgba(0,40,160,.35)',
          }}
        >
          {w}
        </span>
      );
    })}
  </span>
);

/** 18 #5: shimmer status text ("Writing...") — gradient sweeps through the letters. */
export const ShimmerText: React.FC<Txt & {text: string; f: number; base?: string; hi?: string; speed?: number}> = ({text, f, base = '#C48BE8', hi = '#FFFFFF', speed = 3, size = 40, weight = 500, family = SANS, tracking = 0}) => (
  <span
    style={{
      ...txtStyle({size, weight, family, tracking, color: 'transparent'}),
      backgroundImage: `linear-gradient(90deg, ${base} 0%, ${base} 35%, ${hi} 50%, ${base} 65%, ${base} 100%)`,
      backgroundSize: '200% 100%',
      backgroundPosition: `${200 - ((f * speed) % 300)}% 0`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
    }}
  >
    {text}
  </span>
);

/** 15 #2: thin light streak that slides under a sentence (2px core + 12px blurred copy, 20f ease-in-out). */
export const LightStreak: React.FC<{f: number; width: number; color?: string; dur?: number; len?: number}> = ({f, width, color = '#A99BFF', dur = 40, len = 0.45}) => {
  const k = prog(f, 0, dur, EASE.inOut);
  const L = width * len;
  const x = lerp(-L, width, k);
  const g = `linear-gradient(90deg, transparent, ${color} 40%, #fff 50%, ${color} 60%, transparent)`;
  return (
    <div style={{position: 'relative', width, height: 2, overflow: 'visible', opacity: tw(f, [0, 4, dur - 4, dur], [0, 1, 1, 0])}}>
      <div style={{position: 'absolute', left: x, top: -5, width: L, height: 12, background: g, filter: 'blur(12px)'}} />
      <div style={{position: 'absolute', left: x, top: 0, width: L, height: 2, background: g}} />
    </div>
  );
};
