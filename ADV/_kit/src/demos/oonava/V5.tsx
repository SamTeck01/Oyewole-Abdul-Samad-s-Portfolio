// Oonava V5 "Built for agents". Reuses V2-V4 system scenes via time-shifted Sequences. VO starts at 0.3 s.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, Head, Toast, Chip, Captions, EndCard, W} from './kit';
import {Wipe, Show as S2} from './V2';
import {Show as S3} from './V3';
import {Show as S4} from './V4';
import words from './v5_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV5_DURATION = s(27);
const VO = 0.3;
const CUTS = [0.3, 1.6, 2.75, 4.5, 6.3, 10.4, 12.0, 14.6, 15.95, 17.3, 18.3];

const TOASTS = [['Rightmove', '3 new enquiries', '3-bed flat · Didsbury, and 2 more'], ['Zoopla', '2 new enquiries', '2-bed house · Sale, and 1 more'], ['Website', '1 new enquiry', 'Valuation request · Altrincham']];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: tall ? 'column' : 'row', gap: 70 * u}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18 * u}}>
        {TOASTS.map(([app, t, b], i) => {
          const p = prog(f, s(0.05) + i * 9, s(0.05) + i * 9 + 18, EASE.back);
          return <div key={app} style={{transform: `translateY(${(1 - p) * -120 * u}px) scale(${u * 0.95})`, transformOrigin: '50% 0', opacity: Math.min(1, p * 2), height: 150 * u}}><Toast w={900} app={app} title={t} body={b} /></div>;
        })}
      </div>
      <div style={{width: (tall ? 960 : 700) * u}}>
        <Head words={['Six', 'enquiries.']} at={s(0.3)} size={124 * u} weight={700} align={tall ? 'center' : 'left'} />
        <div style={{height: 16 * u}} />
        <Head words={["You're", 'on', 'a', 'viewing.']} accent={['viewing.']} at={s(1.6)} size={92 * u} color="#9EA3AE" align={tall ? 'center' : 'left'} />
      </div>
    </AbsoluteFill>
  );
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const lost = prog(f, s(4.5), s(4.8));
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: tall ? 'column' : 'row', gap: 50 * u}}>
      <div style={{width: 900, transform: `scale(${u * (tall ? 1 : 0.8)})`, fontFamily: SANS, margin: tall ? `${-120 * u}px 0 0` : 0}}>
        <div style={{fontSize: 34, fontWeight: 650, color: '#9EA3AE', marginBottom: 18}}>Your week</div>
        <div style={{display: 'flex', gap: 10}}>
          {DAYS.map((d, i) => (
            <div key={d} style={{flex: 1}}>
              <div style={{fontSize: 24, color: '#6B7075', marginBottom: 10, fontWeight: 600}}>{d}</div>
              {Array.from({length: 6}).map((_, j) => {
                const p = prog(f, s(2.7) + (i * 6 + j) * 1.2, s(2.7) + (i * 6 + j) * 1.2 + 10);
                return <div key={j} style={{height: 64, marginBottom: 8, borderRadius: 10, background: 'rgba(38,160,248,.22)', borderLeft: `4px solid ${C.blue}`, opacity: p, transform: `scale(${0.8 + p * 0.2})`,
                  fontSize: 18, color: '#cfe8fd', padding: '6px 10px', boxSizing: 'border-box', fontWeight: 600}}>Viewing</div>;
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{transform: `scale(${u * (tall ? 0.95 : 0.8)})`, filter: `grayscale(${lost})`, opacity: 1 - lost * 0.4}}>
        <Toast w={860} app="Rightmove" title="Sarah M. · 3-bed flat" body="Waiting for a reply…" />
      </div>
      <div style={{position: 'absolute', bottom: (tall ? 470 : 150) * u, transform: `scale(${prog(f, s(4.6), s(4.85), EASE.back) * u * 1.2})`}}>
        <Chip text="Lost to another agent" tone="red" size={34} />
      </div>
    </AbsoluteFill>
  );
};

const Replay: React.FC<{from: number; until: number; srcAt: number; children: React.ReactNode}> = ({from, until, srcAt, children}) => {
  const f = useCurrentFrame();
  if (f < s(from) - 6 || f >= s(until)) return null;
  return (
    <AbsoluteFill style={{opacity: prog(f, s(from) - 6, s(from) + 4)}}>
      <Sequence from={s(from) - s(srcAt)}>{children}</Sequence>
    </AbsoluteFill>
  );
};

const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  const L = [['More', 'viewings.', 14.95], ['Fewer', 'no-shows.', 15.95], ['No', 'lost', 'leads.', 17.3]] as (string | number)[][];
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 * u}}>
      {L.map((l) => {
        const at = s(l[l.length - 1] as number);
        return (
          <div key={at} style={{display: 'flex', alignItems: 'center', gap: 28 * u, transform: `scale(${tw(f, [at, at + 12], [1.15, 1])})`}}>
            <div style={{width: 28 * u, height: 28 * u, borderRadius: 99, background: C.blue, transform: `scale(${prog(f, at, at + 14, EASE.back)})`}} />
            <Head words={l.slice(0, -1) as string[]} at={at} size={120 * u} color={C.ink} weight={700} align="left" />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const OonavaV5: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Kinetic cuts={CUTS}>
        {f < s(2.9) && <Hook />}
        {f >= s(2.7) && f < s(6.4) && <AbsoluteFill style={{opacity: prog(f, s(2.7), s(2.85))}}><Problem /></AbsoluteFill>}
        <Replay from={6.3} until={10.5} srcAt={13.8}><S2 /></Replay>
        <Replay from={10.4} until={12.1} srcAt={13.4}><S4 /></Replay>
        <Replay from={12.0} until={14.8} srcAt={14.3}><S3 /></Replay>
        {f >= s(13.7) && f < s(14.8) && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{transform: `scale(${prog(f, s(13.75), s(14.0), EASE.back) * u * 1.6})`}}><Chip text="Offer stage" tone="blue" icon="check" size={40} /></div>
          </AbsoluteFill>
        )}
        {f >= s(14.0) && f < s(14.8) && <Wipe at={s(14.0)} />}
        {f >= s(14.6) && f < s(18.5) && <Outcome />}
        {f >= s(18.2) && <EndCard at={s(18.3)} extra="For estate & letting agents." />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark y={H - (H > 1500 ? 260 : 110) * u} size={50 * u} hide={[[0, 2.6], [14.4, 99]]} />
      {!mute && <Audio src={staticFile('oon/v5_mix.wav')} />}
    </AbsoluteFill>
  );
};
