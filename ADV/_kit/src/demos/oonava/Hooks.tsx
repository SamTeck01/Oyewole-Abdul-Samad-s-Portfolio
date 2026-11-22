// Oonava hook bank: 8 shorts = hook line + 5 s system clip (reused scenes) + end card.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, useU, EndCard, W} from './kit';
import {Show as S1} from './V1';
import {Show as S2} from './V2';
import {Show as S3} from './V3';
import {Show as S4} from './V4';
import HW from './hk_words.json';

const s = (x: number) => Math.round(x * 60);
const SCENES: [React.FC, number][] = [[S2, 12.0], [S1, 21.75], [S3, 9.6], [S2, 14.6], [S4, 10.4], [S3, 13.0], [S4, 10.2], [S1, 24.9]];
const ACCENT = ['this.', 'Stop.', 'system.', 'coffee.', 'updated', 'deals', 'clicks.', 'yet.'];

export const hookTimes = (n: number) => {
  const w = (HW as unknown as Record<string, W[]>)[String(n)];
  const a = Math.max(2.6, w[w.length - 1].end + 0.5);
  return {a, b: a + 5, dur: a + 5 + 2.5};
};

export const HookShort: React.FC<{n: number; mute?: boolean}> = ({n, mute}) => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const w = (HW as unknown as Record<string, W[]>)[String(n)].filter((x) => x.word !== '...');
  const {a, b} = hookTimes(n);
  const [Scene, srcAt] = SCENES[n - 1];
  const cuts = [0.3, ...w.filter((x) => /[.?]$/.test(x.word)).map((x) => x.end + 0.35).slice(0, -1), a, b];
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Kinetic cuts={cuts}>
        {f < s(a) + 6 && (
          <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', opacity: 1 - prog(f, s(a) - 4, s(a) + 6)}}>
            <AbsoluteFill style={{background: 'radial-gradient(55% 35% at 50% 50%, rgba(38,160,248,.16), transparent 70%)'}} />
            <div style={{width: 840 * u}}>
              <WordsTimed w={w} accent={ACCENT[n - 1]} size={(w.length > 8 ? 92 : 108) * u} />
            </div>
          </AbsoluteFill>
        )}
        {f >= s(a) - 6 && f < s(b) + 6 && (
          <AbsoluteFill style={{opacity: prog(f, s(a) - 6, s(a) + 4)}}>
            <AbsoluteFill style={{transform: `scale(${tall ? 1.25 : 1})`}}><Sequence from={s(a) - s(srcAt)}><Scene /></Sequence></AbsoluteFill>
          </AbsoluteFill>
        )}
        {f >= s(b) - 6 && <EndCard at={s(b)} />}
      </Kinetic>
      {!mute && <Audio src={staticFile(`oon/hk${n}_mix.wav`)} />}
    </AbsoluteFill>
  );
};

// each word appears exactly when George says it
const WordsTimed: React.FC<{w: W[]; accent: string; size: number}> = ({w, accent, size}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26}}>
      {w.map((x, i) => {
        const at = s(x.start + 0.3) - 2;
        const p = 1;
        const hot = x.word === accent || x.word.startsWith(accent);
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * size * 0.4}px) `,
            fontFamily: hot ? '"Instrument Serif", serif' : '"Inter Display", Inter, sans-serif', fontStyle: hot ? 'italic' : 'normal', fontWeight: hot ? 400 : 700,
            fontSize: hot ? size * 1.15 : size, color: hot ? C.blue : '#fff', letterSpacing: hot ? '-0.01em' : '-0.04em', lineHeight: 1.1}}>{x.word}</span>
        );
      })}
    </div>
  );
};
