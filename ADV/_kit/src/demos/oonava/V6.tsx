// Oonava V6 "No guesswork. Fixed price." Absolute seconds; VO starts at 0.3 s.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, Head, Card, Ico, Captions, EndCard, W} from './kit';
import {Wipe} from './V2';
import words from './v6_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV6_DURATION = s(41.5);
const VO = 0.3;
const STEPS = [
  ['Map', 'Free call to map your process', 4.78],
  ['Design', 'See exactly what gets automated', 8.5],
  ['Build', 'Built and connected to your tools', 12.0],
  ['Launch', 'Live, and your team is trained', 15.72],
  ['Support', 'Monitored and maintained monthly', 19.43],
] as const;
const CUTS = [0.3, 2.85, 4.78, 8.5, 12.0, 15.72, 19.43, 22.7, 28.77, 29.79, 30.73, 32.5];

const Glyph: React.FC<{i: number; p: number; c: string}> = ({i, p, c}) => {
  const d = [
    'M4 18c3-1 4-6 8-6s5 4 8 2', // map route
    'M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z', // design grid
    'M13 3 5 14h6l-1 7 8-11h-6l1-7Z', // build bolt
    'M12 20V5m0 0-6 6m6-6 6 6', // launch arrow
    'm5 12.5 4.5 4.5L19 7.5', // support check
  ][i];
  return (
    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const cur = STEPS.reduce((a, st, i) => (f >= s(st[2]) ? i : a), 0);
  const lineP = tw(f, [s(4.78), s(19.43)], [0, 1], (x) => x);
  const item = (i: number) => {
    const [t, d, at] = STEPS[i];
    const p = prog(f, s(at), s(at) + 22, EASE.back);
    const active = i === cur;
    const g = prog(f, s(at) + 6, s(at) + 34, EASE.inOut);
    return (
      <div key={t} style={{display: 'flex', flexDirection: tall ? 'row' : 'column', alignItems: tall ? 'center' : 'flex-start', gap: 26, width: tall ? 900 : 300, height: tall ? 220 : 'auto',
        opacity: Math.min(1, p * 2) * (active ? 1 : 0.55), transform: `scale(${(0.8 + p * 0.2) * (active ? 1 : 0.94)})`, transformOrigin: tall ? '0 50%' : '50% 0', fontFamily: SANS}}>
        <div style={{width: 130, height: 130, borderRadius: 36, flexShrink: 0, background: active ? C.blue : C.white, border: `2px solid ${active ? C.blue : C.g2}`, display: 'grid', placeItems: 'center', position: 'relative',
          boxShadow: active ? '0 20px 44px rgba(38,160,248,.35)' : 'none'}}>
          <Glyph i={i} p={g} c={active ? '#fff' : C.blue} />
          <div style={{position: 'absolute', top: -14, right: -14, width: 46, height: 46, borderRadius: 30, background: C.ink, color: '#fff', fontSize: 24, fontWeight: 700, display: 'grid', placeItems: 'center'}}>{i + 1}</div>
        </div>
        <div>
          <div style={{fontSize: tall ? 64 : 52, fontWeight: 700, letterSpacing: '-0.035em', color: C.ink}}>{t}<span style={{color: C.blue}}>.</span></div>
          <div style={{fontSize: tall ? 32 : 28, fontWeight: 500, color: C.mute, marginTop: 4, lineHeight: 1.25}}>{d}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', left: W / 2, top: tall ? H * 0.45 : H * 0.42, transform: `translate(-50%,-50%) scale(${u * (tall ? 1.1 : 1.08)})`}}>
        <div style={{position: 'relative', display: 'flex', flexDirection: tall ? 'column' : 'row', gap: tall ? 30 : 54}}>
          <div style={{position: 'absolute', ...(tall ? {left: 62, top: 65, width: 6, height: 4 * 250} : {top: 62, left: 65, height: 6, width: 4 * 354}), background: C.g2, borderRadius: 3}}>
            <div style={{...(tall ? {width: 6, height: `${lineP * 100}%`} : {height: 6, width: `${lineP * 100}%`}), background: C.blue, borderRadius: 3}} />
          </div>
          {STEPS.map((_, i) => item(i))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ROWS = [['Scope agreed up front', 22.9], ['Fixed price before we start', 23.3], ['A system built properly', 25.0], ['A team that stays on', 26.4]] as const;
const Price: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${u * (tall ? 1 : 0.9)}) translateY(${(1 - prog(f, s(22.7), s(23.1))) * 80 - (tall ? 60 : 30)}px)`, opacity: prog(f, s(22.6), s(22.85))}}>
        <Card w={900} url="Your project · proposal">
          <div style={{padding: 40, fontFamily: SANS}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', color: C.ink}}>Fixed price</div>
              <div style={{marginLeft: 'auto', padding: '10px 22px', borderRadius: 99, background: C.ink, color: '#fff', fontSize: 26, fontWeight: 600, transform: `scale(${prog(f, s(23.3), s(23.55), EASE.back)})`}}>Locked</div>
            </div>
            {ROWS.map(([t, at]) => {
              const p = prog(f, s(at), s(at) + 16, EASE.back);
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 28, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 40}px)`}}>
                  <div style={{width: 54, height: 54, borderRadius: 30, background: C.green, display: 'grid', placeItems: 'center', transform: `scale(${p})`}}><Ico n="check" s={34} c="#fff" sw={3} /></div>
                  <div style={{fontSize: 38, fontWeight: 600, color: C.ink}}>{t}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  const L = [['Clear', 'scope.', 28.77], ['Fixed', 'price.', 29.79], ['Ongoing', 'support.', 30.73]] as (string | number)[][];
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 * u}}>
      {L.map((l, i) => {
        const at = s(l[2] as number);
        return (
          <div key={at} style={{transform: `scale(${tw(f, [at, at + 12], [1.2, 1])})`}}>
            <Head words={[l[0] as string, l[1] as string]} accent={i === 2 ? ['support.'] : []} at={at} size={140 * u} color={C.ink} weight={700} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const OonavaV6: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(4.7) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS}>
        {f < s(4.8) && (
          <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', gap: 40 * u}}>
            <div style={{width: 980 * u}}><Head words={['Scared', 'of', 'a', 'tech', 'project', 'going', 'wrong?']} at={s(0.3)} size={112 * u} weight={700} stagger={4} /></div>
            <div style={{width: 980 * u}}><Head words={["Here's", 'how', 'we', 'keep', 'it', 'simple.']} accent={['simple.']} at={s(2.85)} size={84 * u} color="#9EA3AE" stagger={4} /></div>
          </AbsoluteFill>
        )}
        {f >= s(4.05) && f < s(5.0) && <Wipe at={s(4.05)} />}
        {f >= s(4.7) && f < s(22.85) && <Steps />}
        {f >= s(22.6) && f < s(28.9) && <Price />}
        {f >= s(28.65) && f < s(32.7) && <Outcome />}
        {f >= s(32.4) && <EndCard at={s(32.5)} />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={false} y={H - (H > 1500 ? 260 : 100) * u} size={50 * u} hide={[[0, 4.7], [28.6, 99]]} />
      {!mute && <Audio src={staticFile('oon/v6_mix.wav')} />}
    </AbsoluteFill>
  );
};
