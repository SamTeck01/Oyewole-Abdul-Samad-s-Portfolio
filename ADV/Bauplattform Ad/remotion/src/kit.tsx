import React, {createContext, useContext} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill, OffthreadVideo, staticFile, Img} from 'remotion';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter-tight/700.css';
import cuesJson from './cues.json';
import cuesDeJson from './cues_de.json';

export const FPS = 60;
export const K = {
  bg: '#F5F7FB',
  white: '#FFFFFF',
  navy: '#06235A',
  blue: '#0A6CFF',
  blueSoft: '#E6EFFF',
  green: '#27AE4C',
  greenSoft: '#E5F6EA',
  grey: '#8A94A6',
  line: '#DDE3EE',
  yellow: '#F5C542',
  orange: '#F28A30',
  red: '#E5484D',
  font: '"Inter Tight", Inter, sans-serif',
};

export type Lang = 'en' | 'de';
export const LangCtx = createContext<Lang>('en');
export const useLang = () => useContext(LangCtx);
export const useT = () => {
  const l = useLang();
  return (en: string, de: string) => (l === 'en' ? en : de);
};

type Word = {t: string; s: number; e?: number};
type Line = {id: string; start: number; end: number; en: string; de: string; words: Word[]; dewords: Word[]};
type Cues = {total: number; lines: Line[]};
const CUES_BY: Record<Lang, Cues> = {en: cuesJson as unknown as Cues, de: cuesDeJson as unknown as Cues};
// each language is cut to its own voice track; Film sets the active cues before its scenes render
export let CUES: Cues = CUES_BY.en;
export const setCues = (l: Lang) => { CUES = CUES_BY[l]; };
export const cuesFor = (l: Lang) => CUES_BY[l];
export const L = (id: string) => CUES.lines.find((l) => l.id === id)!;

export const ease = Easing.bezier(0.25, 0.1, 0.1, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Scenes get `t0` (absolute seconds where the scene starts). Helpers convert absolute VO times to local frames.
export const SceneT = createContext(0);
export const useAbs = () => {
  const f = useCurrentFrame();
  const t0 = useContext(SceneT);
  return t0 + f / FPS; // absolute seconds
};
export const useLocalFrameOf = () => {
  const t0 = useContext(SceneT);
  return (abs: number) => (abs - t0) * FPS;
};

// ---------- kinetic words (vaylens style: each spoken word lands on screen as it is said) ----------
export const Words: React.FC<{
  id: string;
  size?: number;
  color?: string;
  weight?: number;
  highlight?: (w: string, i: number) => string | undefined; // returns a colour for highlighted words
  bold?: (w: string, i: number) => boolean;
  align?: 'center' | 'left';
  maxWidth?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
  range?: [number, number]; // word index range
  exitAt?: number; // absolute secs
}> = ({id, size = 46, color = K.navy, weight = 500, highlight, bold, align = 'center', maxWidth = 1500, lineHeight = 1.18, style, range, exitAt}) => {
  const lang = useLang();
  const abs = useAbs();
  const {fps} = useVideoConfig();
  const line = L(id);
  let words = lang === 'en' ? line.words : line.dewords;
  if (range) words = words.slice(range[0], range[1]);
  const exit = exitAt !== undefined ? interpolate(abs, [exitAt, exitAt + 0.3], [1, 0], clamp) : 1;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: size * 0.26, rowGap: 0, maxWidth, fontFamily: K.font, fontSize: size, lineHeight, color, fontWeight: weight, letterSpacing: '-0.02em', opacity: exit, ...style}}>
      {words.map((w, i) => {
        const p = spring({frame: (abs - w.s + 0.05) * fps, fps, config: {damping: 18, stiffness: 170, mass: 0.7}});
        const c = highlight?.(w.t, i);
        return (
          <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * size * 0.45}px) rotate(${(1 - p) * (i % 2 ? 4 : -4)}deg)`, color: c ?? color, fontWeight: bold?.(w.t, i) ? 600 : weight, whiteSpace: 'pre'}}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

// springs from an absolute time
export const usePop = (at: number, cfg = {damping: 16, stiffness: 150}) => {
  const abs = useAbs();
  const {fps} = useVideoConfig();
  return spring({frame: (abs - at) * fps, fps, config: cfg});
};
export const pop = (abs: number, at: number, cfg = {damping: 16, stiffness: 150}) => spring({frame: (abs - at) * FPS, fps: FPS, config: cfg});
export const ramp = (abs: number, a: number, b: number, from = 0, to = 1, e = ease) => interpolate(abs, [a, b], [from, to], {...clamp, easing: e});

export const Pill: React.FC<{children: React.ReactNode; at: number; dark?: boolean; color?: string; border?: string; size?: number; style?: React.CSSProperties; icon?: React.ReactNode}> = ({children, at, dark, color, border, size = 30, style, icon}) => {
  const p = usePop(at);
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.36}px ${size * 0.8}px`, borderRadius: 999, background: dark ? K.navy : color ?? K.white, color: dark ? K.white : K.navy, border: border ? `2px solid ${border}` : `1px solid ${K.line}`, fontFamily: K.font, fontSize: size, fontWeight: 500, letterSpacing: '-0.01em', boxShadow: '0 10px 30px rgba(6,35,90,.10)', transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 20}px)`, opacity: p, whiteSpace: 'nowrap', ...style}}>
      {icon}
      {children}
    </div>
  );
};

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(18px)', border: `1px solid ${K.line}`, borderRadius: 26, boxShadow: '0 30px 70px rgba(6,35,90,.14)', fontFamily: K.font, color: K.navy, ...style}}>{children}</div>
);

// phase chip: "02 Planning"
export const PhaseTag: React.FC<{n: number; en: string; de: string; at: number; style?: React.CSSProperties}> = ({n, en, de, at, style}) => {
  const T = useT();
  const p = usePop(at);
  return (
    <div style={{position: 'absolute', left: 90, top: 80, display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: K.font, color: K.navy, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, ...style}}>
      <span style={{fontSize: 30, fontWeight: 600, color: K.blue}}>{String(n).padStart(2, '0')}</span>
      <span style={{fontSize: 30, fontWeight: 500}}>{T(en, de)}</span>
    </div>
  );
};

// 3D clip from Blender renders (public/3d/*.mp4). startAbs: absolute seconds the clip begins.
const CLIP_SECS: Record<string, number> = {rise: 11.2, bim: 9.8, explode: 7, site: 14, twin: 9.8};
// slows a clip down when its scene is longer than the render, so it never runs out (DE scenes are longer)
export const Clip: React.FC<{name: string; style?: React.CSSProperties; rate?: number; startFrom?: number}> = ({name, style, rate, startFrom = 0}) => {
  const {durationInFrames, fps} = useVideoConfig();
  const secs = CLIP_SECS[name] ?? 4;
  const r = rate ?? Math.min(1, (secs - startFrom / fps - 0.25) / (durationInFrames / fps));
  return <OffthreadVideo src={staticFile(`3d/${name}.mp4`)} muted playbackRate={r} startFrom={startFrom} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />;
};
export const Still: React.FC<{name: string; style?: React.CSSProperties}> = ({name, style}) => (
  <Img src={staticFile(`3d/${name}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

// Baucheck24 logo (traced from the client's PNG). part: full | icon | word
export const Logo: React.FC<{width: number; part?: 'full' | 'icon' | 'word'; mono?: string; draw?: number}> = ({width, part = 'full', mono, draw = 1}) => {
  const vb = part === 'icon' ? [95, 180, 410, 352] : part === 'word' ? [525, 255, 1570, 225] : [95, 180, 2000, 352];
  const h = (width * vb[3]) / vb[2];
  return (
    <svg width={width} height={h} viewBox={vb.join(' ')} style={{overflow: 'visible'}}>
      <defs>
        <clipPath id={`lc-${part}`}>
          <rect x={vb[0] - 10} y={vb[1] - 10} width={(vb[2] + 20) * draw} height={vb[3] + 20} />
        </clipPath>
      </defs>
      <g clipPath={`url(#lc-${part})`}>
        <LogoPaths mono={mono} />
      </g>
    </svg>
  );
};
import {LOGO_NAVY, LOGO_BLUE, LOGO_GREEN} from './logoPaths';
export const LogoPaths: React.FC<{mono?: string; only?: 'navy' | 'blue' | 'green'}> = ({mono, only}) => (
  <g transform="translate(0,724) scale(0.1,-0.1)">
    {(!only || only === 'navy') && <path d={LOGO_NAVY} fill={mono ?? K.navy} />}
    {(!only || only === 'blue') && <path d={LOGO_BLUE} fill={mono ?? K.blue} />}
    {(!only || only === 'green') && <path d={LOGO_GREEN} fill={mono ?? K.green} />}
  </g>
);
