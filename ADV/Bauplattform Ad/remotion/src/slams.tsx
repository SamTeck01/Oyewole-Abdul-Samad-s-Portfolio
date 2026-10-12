// v8: big kinetic type slams, after Dave's reference reels: one or two giant words fill the frame
// on the spoken beat, on a bold colour card, then the card wipes away to the scene underneath.
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {L, FPS, K} from './kit';

type Slam = {id: string; from: number; n?: number; text?: string[]; bg: string; fg: string; accent?: string[]; hold?: number};
const SLAMS: Slam[] = [
  {id: 'l04', from: 0, bg: K.orange, fg: K.white},
  {id: 'l08', from: 0, n: 2, text: ['No', 'time?'], bg: K.white, fg: K.navy},
  {id: 'l09', from: 3, text: ['AI?'], bg: K.red, fg: K.white},
  {id: 'l10', from: 2, bg: K.blue, fg: K.white},
  {id: 'l15', from: 0, bg: K.orange, fg: K.white},
  {id: 'l17', from: 2, text: ['Minutes.'], bg: K.navy, fg: K.white},
  {id: 'l19', from: 0, n: 3, text: ['Best.', 'Fastest.', 'Safest.'], bg: K.white, fg: K.navy, accent: [K.blue, K.navy, K.green]},
  {id: 'l21', from: 0, text: ['Drones.'], bg: K.navy, fg: K.white},
  {id: 'l22t', from: 1, n: 2, text: ['Clock', 'in.'], bg: K.green, fg: K.white},
  {id: 'l24', from: 4, n: 2, text: ['A', 'person.'], bg: K.blue, fg: K.white},
  {id: 'l26', from: 0, n: 2, text: ['You', 'decide.'], bg: K.navy, fg: K.white},
  {id: 'l27m', from: 0, n: 2, text: ['81', 'chapters.'], bg: K.blue, fg: K.white},
];

const Card: React.FC<{words: {t: string; s: number}[]; t0: number; dur: number; bg: string; fg: string; accent?: string[]}> = ({words, t0, dur, bg, fg, accent}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: d} = useVideoConfig();
  const ease = Easing.bezier(0.7, 0, 0.2, 1);
  const inP = interpolate(f, [0, 9], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const outP = interpolate(f, [d - 9, d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const longest = Math.max(...words.map((w) => w.t.length));
  const stack = words.length > 1 && words.map((w) => w.t).join(' ').length > 11;
  const chars = stack ? longest : words.map((w) => w.t).join(' ').length;
  const size = Math.min(stack ? 250 : 300, 1700 / (chars * 0.6));
  const zoom = interpolate(f, [0, d], [1.04, 1]);
  return (
    <AbsoluteFill style={{background: bg, clipPath: `inset(${(1 - inP) * 100}% 0 ${outP * 100}% 0)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: stack ? 'column' : 'row', alignItems: 'center', columnGap: size * 0.25, transform: `scale(${zoom})`, fontFamily: '"Inter Display", "Inter Tight", Inter, sans-serif', fontWeight: 800, fontSize: size, lineHeight: 1.25, letterSpacing: '-0.045em', color: fg}}>
        {words.map((w, i) => {
          const p = spring({frame: f - (w.s - t0) * fps, fps, config: {damping: 200, stiffness: 220}});
          return (
            <div key={i} style={{overflow: 'hidden', paddingBottom: size * 0.05, marginBottom: -size * 0.2}}>
              <div style={{transform: `translateY(${(1 - p) * 105}%)`, color: accent?.[i] ?? fg}}>{w.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Slams: React.FC = () => (
  <>
    {SLAMS.map((s, k) => {
      const line = L(s.id);
      const ws = line.words.slice(s.from, s.from + (s.n ?? 1)).map((w, i) => ({t: s.text?.[i] ?? w.t, s: w.s}));
      const t0 = ws[0].s - 0.12;
      const last = ws[ws.length - 1].s;
      const dur = Math.max(0.75, last - t0 + (s.hold ?? 0.55));
      return (
        <Sequence key={k} from={Math.round(t0 * FPS)} durationInFrames={Math.round(dur * FPS)}>
          <Card words={ws} t0={t0} dur={dur} bg={s.bg} fg={s.fg} accent={s.accent} />
        </Sequence>
      );
    })}
  </>
);
