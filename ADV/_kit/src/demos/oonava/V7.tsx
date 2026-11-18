// Oonava V7 "What does automation cost?" Absolute seconds; VO starts at 0.3 s.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, Head, Captions, EndCard, W} from './kit';
import {Wipe} from './V2';
import words from './v7_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV7_DURATION = s(25);
const VO = 0.3;
const CUTS = [0.3, 2.37, 4.1, 5.9, 7.56, 9.95, 11.55, 12.8, 16.3];

const PLANS = [
  {n: 'Essential Automation', setup: '€1,500', mo: '€199', from: false, at: 5.9},
  {n: 'Connected Automation + AI', setup: '€4,500', mo: '€499', from: false, at: 7.56},
  {n: 'Custom Systems', setup: '€10,000', mo: '€999', from: true, at: 11.55},
];

const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const pop = prog(f, s(9.95), s(10.3), EASE.back);
  const grow = prog(f, s(12.8), s(15.0), EASE.inOut);
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: (tall ? 170 : 90) * u, display: 'flex', justifyContent: 'center'}}>
        <Head words={['Three', 'ways', 'to', 'work', 'with', 'us.']} at={s(4.1)} size={(tall ? 84 : 72) * u} color={C.ink} weight={700} stagger={3} />
      </div>
      <div style={{position: 'absolute', left: W / 2, top: tall ? H * 0.53 : H * 0.55, transform: `translate(-50%,-50%) scale(${u * 1.1})`, display: 'flex', flexDirection: tall ? 'column' : 'row', gap: tall ? 34 : 40, alignItems: 'center'}}>
        {PLANS.map((p, i) => {
          const a = prog(f, s(p.at), s(p.at) + 22, EASE.back);
          const mid = i === 1;
          const lift = mid ? pop : 0;
          return (
            <div key={p.n} style={{position: 'relative', width: tall ? 900 : 520, padding: tall ? '36px 44px' : '46px 44px', boxSizing: 'border-box', borderRadius: 34, fontFamily: SANS,
              background: mid && pop > 0 ? C.ink : C.white, color: mid && pop > 0 ? '#fff' : C.ink, border: `2px solid ${mid && pop > 0 ? C.blue : C.g2}`,
              boxShadow: mid ? `0 0 0 ${lift * 8}px rgba(38,160,248,.25), 0 ${30 + lift * 30}px ${60 + lift * 40}px rgba(11,40,80,${0.1 + lift * 0.15})` : '0 24px 50px rgba(11,40,80,.08)',
              opacity: Math.min(1, a * 2), transform: `translate${tall ? 'X' : 'Y'}(${(1 - a) * 160}px) scale(${(0.9 + a * 0.1) * (1 + lift * 0.06)}) translateY(${-lift * (tall ? 0 : 30)}px)`, zIndex: mid ? 2 : 1}}>
              {mid && pop > 0 && (
                <div style={{position: 'absolute', top: -24, right: 34, padding: '10px 22px', borderRadius: 99, background: C.blue, color: '#fff', fontSize: 24, fontWeight: 700, transform: `scale(${pop})`}}>Most popular</div>
              )}
              <div style={{fontSize: tall ? 36 : 34, fontWeight: 650, letterSpacing: '-0.02em'}}>{p.n}</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 16}}>
                {p.from && <span style={{fontSize: 26, color: mid && pop > 0 ? '#9EA3AE' : C.mute}}>from</span>}
                <span style={{fontSize: tall ? 72 : 76, fontWeight: 700, letterSpacing: '-0.04em'}}>{p.setup}</span>
                <span style={{fontSize: 26, color: mid && pop > 0 ? '#9EA3AE' : C.mute}}>setup</span>
              </div>
              <div style={{fontSize: 32, fontWeight: 600, marginTop: 6, color: mid && pop > 0 ? C.blue : C.deep}}>+ {p.from ? 'from ' : ''}{p.mo}/month</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: (tall ? 330 : 120) * u, display: 'flex', justifyContent: 'center', opacity: grow > 0 ? 1 : 0}}>
        <div style={{width: 600 * u * grow, height: 8 * u, borderRadius: 9, background: `linear-gradient(90deg, ${C.g2}, ${C.blue})`}} />
      </div>
    </AbsoluteFill>
  );
};

export const OonavaV7: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(4.0) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS}>
        {f < s(4.2) && (
          <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', gap: 40 * u}}>
            <div style={{width: 980 * u}}><Head words={['What', 'does', 'automation', 'cost?']} at={s(0.3)} size={100 * u} color="#9EA3AE" weight={600} stagger={4} /></div>
            <div style={{width: 980 * u, transform: `scale(${tw(f, [s(2.4), s(2.65)], [1.3, 1])})`}}>
              <Head words={['Less', 'than', 'one', 'admin', 'hire.']} accent={['hire.']} at={s(2.37)} size={130 * u} weight={700} stagger={4} />
            </div>
          </AbsoluteFill>
        )}
        {f >= s(3.45) && f < s(4.3) && <Wipe at={s(3.45)} />}
        {f >= s(4.0) && f < s(16.5) && <Cards />}
        {f >= s(16.2) && <EndCard at={s(16.3)} extra="Estimate yours: oonava.com/estimate" />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={false} y={H - (H > 1500 ? 250 : 100) * u} size={46 * u} hide={[[0, 4.0], [16.2, 99]]} />
      {!mute && <Audio src={staticFile('oon/v7_mix.wav')} />}
    </AbsoluteFill>
  );
};
