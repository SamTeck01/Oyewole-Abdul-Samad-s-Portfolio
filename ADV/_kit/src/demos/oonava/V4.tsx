// Oonava V4 "One booking. Six jobs. Zero clicks." Absolute seconds; VO starts at 0.3 s (1.6 s gap added after "follow.").
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, Head, Toast, Chip, Ico, Captions, EndCard, W} from './kit';
import {Wipe} from './V2';
import words from './v4_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV4_DURATION = s(28.5);
const VO = 0.3;
const CUTS = [0.3, 2.4, 3.4, 6.1, 8.6, 10.6, 14.75, 16.6, 19.4];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', gap: 80 * u}}>
      <div style={{transform: `translateY(${(1 - prog(f, s(0.1), s(0.45), EASE.back)) * -200 * u}px) scale(${u})`, opacity: prog(f, s(0.1), s(0.3))}}>
        <Toast w={900} app="Bookings" title="Booking confirmed" body="Viewing · 14 Elm Road · Tue 14:00" />
      </div>
      <div style={{width: 980 * u}}>
        <Head words={['One', 'booking', 'creates', '6', 'jobs.']} at={s(0.3)} size={110 * u} weight={700} stagger={4} />
        <div style={{height: 24 * u}} />
        <Head words={["Who's", 'doing', 'them?']} at={s(2.38)} size={92 * u} color={C.blue} stagger={4} />
      </div>
    </AbsoluteFill>
  );
};

const JOBS = [
  ['crm', 'CRM', 'Update CRM', 'Opportunity updated'],
  ['cal', 'Calendar', 'Add to calendar', 'Event created'],
  ['mail', 'Email', 'Send confirmation', 'Confirmation sent'],
  ['chat', 'WhatsApp', 'Schedule reminder', 'Reminder scheduled'],
  ['crm', 'Agent', 'Brief the agent', 'Briefing delivered'],
  ['grid', 'Database', 'Save record', 'Record saved'],
];

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const tickAt = [3.9, 4.6, 5.3, -1, 7.0, 7.6];
  const miss = prog(f, s(6.1), s(6.25));
  const flash = f > s(6.1) ? (Math.floor((f - s(6.1)) / 8) % 2 === 0 ? 1 : 0.55) : 0;
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 900, transform: `scale(${u * (tall ? 1 : 0.85)}) translateY(${tall ? -120 : -40}px)`, fontFamily: SANS}}>
        <div style={{fontSize: 40, fontWeight: 650, color: '#9EA3AE', marginBottom: 26}}>To do · after every booking</div>
        {JOBS.map(([, , t], i) => {
          const p = prog(f, s(3.4) + i * 5, s(3.4) + i * 5 + 16);
          const done = tickAt[i] > 0 && f >= s(tickAt[i]);
          const bad = i === 3;
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '24px 28px', marginBottom: 14, borderRadius: 22, opacity: p, transform: `translateX(${(1 - p) * -60}px)`,
              background: bad && miss ? `rgba(200,50,47,${0.12 + flash * 0.2})` : 'rgba(255,255,255,.05)', border: `1.5px solid ${bad && miss ? C.red : 'rgba(255,255,255,.07)'}`}}>
              <div style={{width: 48, height: 48, borderRadius: 12, border: `3px solid ${done ? C.green : bad && miss ? C.red : '#4A4F5A'}`, background: done ? C.green : 'transparent', display: 'grid', placeItems: 'center'}}>
                {done && <Ico n="check" s={34} c="#fff" sw={3} />}
              </div>
              <div style={{flex: 1, fontSize: 38, fontWeight: 600, color: done ? '#6B7075' : '#fff', textDecoration: done ? 'line-through' : 'none'}}>{t}</div>
              {bad && miss > 0 && <div style={{fontSize: 30, fontWeight: 700, color: C.red, opacity: miss}}>Missed</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Show: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const at = (i: number) => s(10.6) + i * 33;
  const done = prog(f, s(14.75), s(15.0), EASE.back);
  const rowH = 128;
  const lineP = tw(f, [s(10.4), at(5) + 10], [0, 1], (x) => x);
  const flow = (
    <div style={{position: 'relative', width: 900, fontFamily: SANS}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 28px', borderRadius: 26, background: C.blue, color: '#fff', boxShadow: `0 0 ${40 + Math.sin(f / 6) * 10}px rgba(38,160,248,.45)`,
        transform: `scale(${prog(f, s(8.9), s(9.2), EASE.back)})`}}>
        <Ico n="bolt" s={48} c="#fff" sw={2.2} />
        <div style={{fontSize: 36, fontWeight: 700}}>Trigger: Booking</div>
        <div style={{marginLeft: 'auto', fontSize: 26, opacity: 0.85}}>Tue 14:00 · Elm Road</div>
      </div>
      <div style={{position: 'absolute', left: 62, top: 112, width: 6, height: rowH * 6 - 50, background: 'rgba(255,255,255,.08)', borderRadius: 3}}>
        <div style={{width: 6, height: `${lineP * 100}%`, background: C.blue, borderRadius: 3, boxShadow: '0 0 14px rgba(38,160,248,.8)'}} />
      </div>
      {JOBS.map(([ic, name, , st], i) => {
        const p = prog(f, s(9.2) + i * 4, s(9.2) + i * 4 + 16);
        const lit = prog(f, at(i), at(i) + 12, EASE.back);
        return (
          <div key={name} style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: i ? 128 - 104 : 34, marginLeft: 20, height: 104, opacity: p}}>
            <div style={{width: 92, height: 92, borderRadius: 24, background: lit > 0.5 ? 'rgba(38,160,248,.18)' : C.card, border: `2px solid ${lit > 0.5 ? C.blue : 'rgba(255,255,255,.1)'}`, display: 'grid', placeItems: 'center', transform: `scale(${1 + Math.sin(lit * Math.PI) * 0.12})`, zIndex: 1}}>
              <Ico n={ic} s={46} c={lit > 0.5 ? C.blue : '#8A8F99'} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 34, fontWeight: 650, color: '#fff'}}>{name}</div>
              <div style={{fontSize: 27, fontWeight: 600, color: C.green, opacity: lit, transform: `translateX(${(1 - lit) * 20}px)`}}>✓ {st}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1.5px, transparent 1.5px)', backgroundSize: `${34 * u}px ${34 * u}px`, opacity: prog(f, s(8.6), s(9.0))}} />
      <div style={{position: 'absolute', ...(tall ? {left: 0, right: 0, top: 150 * u, textAlign: 'center'} : {left: 140 * u, top: H / 2 - 120 * u}), fontFamily: SANS, opacity: prog(f, s(8.7), s(9.0))}}>
        <div style={{fontSize: 30 * u, fontWeight: 600, color: '#6B7075'}}>Workflow</div>
        <div style={{fontSize: 58 * u, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em'}}>viewing booked</div>
        <div style={{marginTop: 26 * u, transform: `scale(${done * u * 1.3})`, transformOrigin: tall ? '50% 50%' : '0 50%', display: 'inline-block'}}>
          <Chip text="Completed · 1.8s" icon="check" size={34} />
        </div>
      </div>
      <div style={{position: 'absolute', left: tall ? W / 2 : W * 0.64, top: tall ? H * 0.53 : H / 2, transform: `translate(-50%,-50%) scale(${u * (tall ? 1 : 0.86)})`}}>{flow}</div>
    </AbsoluteFill>
  );
};

const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 980 * u, transform: `scale(${tw(f, [s(16.7), s(16.95)], [1.15, 1])})`}}>
        <Head words={['Your', 'team', 'does', 'the', 'work', 'only', 'humans', 'can', 'do.']} accent={['humans']} at={s(16.65)} size={112 * u} color={C.ink} weight={700} stagger={4} />
      </div>
    </AbsoluteFill>
  );
};

export const OonavaV4: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(16.6) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS}>
        {f < s(3.5) && <Hook />}
        {f >= s(3.3) && f < s(8.8) && <AbsoluteFill style={{opacity: prog(f, s(3.3), s(3.45))}}><Problem /></AbsoluteFill>}
        {f >= s(8.6) && f < s(16.8) && <AbsoluteFill style={{opacity: prog(f, s(8.6), s(8.75))}}><Show /></AbsoluteFill>}
        {f >= s(15.85) && f < s(16.8) && <Wipe at={s(15.85)} />}
        {f >= s(16.55) && f < s(19.6) && <Outcome />}
        {f >= s(19.3) && <EndCard at={s(19.4)} />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={f < s(16.5)} y={H - (H > 1500 ? 260 : 110) * u} size={50 * u} hide={[[0, 3.3], [16.4, 99]]} />
      {!mute && <Audio src={staticFile('oon/v4_mix.wav')} />}
    </AbsoluteFill>
  );
};
