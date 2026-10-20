// Voice-synced captions (ref 09, 12-17). Words come from ElevenLabs/faster-whisper timings in seconds.
import React from 'react';
import {interpolateColors} from 'remotion';
import {EASE, tw} from './core';
import {SANS} from './fonts';
import {hexA} from './ui';

export type Word = {word: string; start: number; end?: number};

let ctx: CanvasRenderingContext2D | null = null;
export const measure = (text: string, size: number, weight = 600, family = SANS) => {
  if (typeof document === 'undefined') return text.length * size * 0.55;
  ctx = ctx ?? document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px ${family}`;
  return ctx!.measureText(text).width;
};

/** One line that builds word by word. Each word lands in `accent` with a soft radial glow, then settles to
 * `color` (measured: 1-3 frames to readable, 4-6 to settle). The line re-centres smoothly as it grows.
 * `morph` swaps one word for another with a split (top half up, bottom half down), ref 17. */
export const CaptionLine: React.FC<{
  words: Word[];
  t: number; // seconds
  fps?: number;
  size?: number;
  weight?: number;
  color?: string;
  accent?: string;
  family?: string;
  morph?: {index: number; to: string; at: number};
  italicIdx?: number[];
  italicFamily?: string;
}> = ({words, t, fps = 60, size = 100, weight = 600, color = '#141414', accent = '#E5243B', family = SANS, morph, italicIdx = [], italicFamily}) => {
  const space = size * 0.26;
  const fam = (i: number) => (italicIdx.includes(i) && italicFamily ? italicFamily : family);
  const mp = morph ? tw((t - morph.at) * fps, [0, 12], [0, 1], EASE.inOut) : 0;
  const widths = words.map((w, i) => {
    const a = measure(w.word, size, weight, fam(i));
    if (morph && morph.index === i) return a + (measure(morph.to, size, weight, fam(i)) - a) * mp;
    return a;
  });
  const vis = words.map((w) => tw((t - w.start) * fps, [0, 9], [0, 1], EASE.out));
  const total = widths.reduce((s, w, i) => s + vis[i] * (w + space), 0) - space;
  let x = -total / 2;
  return (
    <div style={{position: 'relative', height: size * 1.25}}>
      {words.map((w, i) => {
        const f = (t - w.start) * fps;
        const left = x;
        x += vis[i] * (widths[i] + space);
        if (f < 0) return null;
        const col = interpolateColors(f, [2, 9], [accent, color]);
        const glow = tw(f, [0, 3, 14], [0, 0.55, 0], EASE.out);
        const style: React.CSSProperties = {
          position: 'absolute',
          left,
          top: 0,
          whiteSpace: 'nowrap',
          fontFamily: fam(i),
          fontStyle: italicIdx.includes(i) ? 'italic' : 'normal',
          fontWeight: italicIdx.includes(i) ? 400 : weight,
          fontSize: size,
          letterSpacing: -size * 0.025,
          lineHeight: 1.25,
          color: col,
          opacity: tw(f, [0, 3], [0, 1]),
          filter: `blur(${tw(f, [0, 3], [8, 0])}px)`,
          transform: `translate(${-(1 - vis[i]) * size * 0.15}px, ${tw(f, [0, 6], [size * 0.08, 0], EASE.out)}px)`,
        };
        const halo = (
          <div
            style={{
              position: 'absolute',
              left: left - size * 0.6,
              top: -size * 0.4,
              width: widths[i] + size * 1.2,
              height: size * 2,
              background: `radial-gradient(closest-side, ${hexA(accent, glow)}, transparent)`,
              filter: 'blur(18px)',
            }}
          />
        );
        if (morph && morph.index === i && (t - morph.at) * fps > 0) {
          const half = (txt: string, top: boolean, p: number, dir: number) => (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                clipPath: top ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)',
                transform: `translateY(${dir * p * size * 0.7}px)`,
                opacity: 1 - Math.abs(p),
                filter: `blur(${Math.abs(p) * 10}px)`,
              }}
            >
              {txt}
            </span>
          );
          const mcol = interpolateColors((t - morph.at) * fps, [4, 14], [accent, color]);
          return (
            <React.Fragment key={i}>
              {halo}
              <div style={{...style, color: mcol}}>
                <span style={{visibility: 'hidden'}}>{mp < 0.5 ? w.word : morph.to}</span>
                {half(w.word, true, mp, -1)}
                {half(w.word, false, mp, 1)}
                {half(morph.to, true, mp - 1, -1)}
                {half(morph.to, false, mp - 1, 1)}
              </div>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={i}>
            {halo}
            <div style={style}>{w.word}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Single-line replacement caption: only the current phrase shows; the previous one blurs up and out (ref 15). */
export const ReplaceCaption: React.FC<{phrases: {text: string; start: number}[]; t: number; fps?: number; size?: number; color?: string; accent?: string}> = ({
  phrases,
  t,
  fps = 60,
  size = 88,
  color = '#141414',
  accent = '#E5243B',
}) => (
  <div style={{position: 'relative', height: size * 1.3}}>
    {phrases.map((p, i) => {
      const f = (t - p.start) * fps;
      const next = phrases[i + 1];
      const o = next ? (t - next.start) * fps : -1;
      if (f < 0 || o > 10) return null;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: size,
            letterSpacing: -size * 0.025,
            color: interpolateColors(f, [2, 9], [accent, color]),
            opacity: tw(f, [0, 3], [0, 1]) * (1 - tw(o, [0, 8], [0, 1])),
            filter: `blur(${tw(f, [0, 3], [8, 0]) + tw(o, [0, 8], [0, 10])}px)`,
            transform: `translateY(${tw(f, [0, 6], [12, 0], EASE.out) - tw(o, [0, 8], [0, 40], EASE.in)}px)`,
          }}
        >
          {p.text}
        </div>
      );
    })}
  </div>
);
