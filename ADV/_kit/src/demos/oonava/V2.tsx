// Oonava V2 "The 38-second reply". Absolute seconds; VO starts at 0.3 s.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, rise, Head, Card, Toast, Chip, Captions, EndCard, W} from './kit';
import words from './v2_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV2_DURATION = s(33.5);
const VO = 0.3;
export const CUTS2 = [0.3, 3.3, 6.0, 8.7, 11.6, 13.4, 14.15, 16.7, 19.7, 21.2, 24.2];

/* ---------- Hook: the timer ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const t = Math.min(38, Math.floor(tw(f, [s(0.4), s(3.25)], [0, 38], EASE.count)));
  const done = prog(f, s(3.25), s(3.45), EASE.back);
  const col = done > 0 ? C.green : '#fff';
  const ring = tw(f, [s(0.4), s(3.25)], [0, 1], EASE.count);
  const R = 300;
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: `radial-gradient(50% 35% at 50% ${tall ? 40 : 45}%, rgba(${done ? '40,200,64' : '38,160,248'},.16), transparent 70%)`}} />
      <div style={{display: 'flex', flexDirection: tall ? 'column' : 'row', alignItems: 'center', gap: (tall ? 110 : 130) * u}}>
        <div style={{position: 'relative', width: R * 2 * u, height: R * 2 * u, transform: `scale(${1 + done * 0.06 - (1 - done) * 0.0})`}}>
          <svg width={R * 2 * u} height={R * 2 * u} viewBox={`0 0 ${R * 2} ${R * 2}`} style={{position: 'absolute', transform: 'rotate(-90deg)'}}>
            <circle cx={R} cy={R} r={R - 16} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={14} />
            <circle cx={R} cy={R} r={R - 16} fill="none" stroke={done ? C.green : C.blue} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: SANS, fontSize: 210 * u, fontWeight: 600, letterSpacing: '-0.05em', color: col, fontVariantNumeric: 'tabular-nums'}}>
            0:{String(t).padStart(2, '0')}
          </div>
          <div style={{position: 'absolute', bottom: 120 * u, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontSize: 24 * u, fontWeight: 500, color: '#6B7075', opacity: done}}>Concept demo</div>
        </div>
        <div style={{width: (tall ? 960 : 760) * u}}>
          {f < s(3.25) ? (
            <Head words={['How', 'fast', 'do', 'you', 'reply', 'to', 'a', 'new', 'lead?']} at={s(0.3)} size={88 * u} stagger={3} align={tall ? 'center' : 'left'} />
          ) : (
            <div>
              <Head words={['We', 'reply', 'in']} at={s(3.3)} size={88 * u} align={tall ? 'center' : 'left'} />
              <div style={{transform: `scale(${tw(f, [s(4.0), s(4.25)], [1.25, 1])})`, transformOrigin: tall ? '50% 50%' : '0 50%'}}>
                <Head words={['38', 'seconds.']} at={s(4.0)} size={170 * u} color={C.green} weight={700} align={tall ? 'center' : 'left'} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Problem: split screen ---------- */
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const side = (i: number) => {
    const p = prog(f, s(6.0) + i * 12, s(6.0) + i * 12 + 24);
    return {opacity: p, transform: tall ? `translateY(${(1 - p) * (i ? 80 : -80)}px)` : `translateX(${(1 - p) * (i ? 80 : -80)}px)`};
  };
  const grey = prog(f, s(9.9), s(10.4));
  const pw = tall ? 940 : 820;
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: tall ? 'column' : 'row', gap: tall ? 150 : 60, transform: `scale(${u * (tall ? 0.98 : 0.95)})`, marginTop: tall ? -200 * u : -60 * u}}>
        <div style={side(0)}>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 600, color: '#9EA3AE', marginBottom: 20}}>Your competitor</div>
          <Card w={pw} dark url="mail · Inbox">
            <div style={{padding: 34, display: 'flex', gap: 22, alignItems: 'center'}}>
              <div style={{width: 16, height: 16, borderRadius: 9, background: C.blue}} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 32, fontWeight: 650, color: '#fff'}}>New enquiry: 3-bed apartment</div>
                <div style={{fontSize: 26, color: '#7E838E', marginTop: 6}}>Unread · received Sunday 21:47</div>
              </div>
            </div>
            <div style={{padding: '0 34px 34px', display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: SANS}}>
              <div style={{fontSize: 96, fontWeight: 600, color: C.red, letterSpacing: '-0.04em'}}>Mon 09:12</div>
              <div style={{fontSize: 28, color: '#7E838E'}}>still unread</div>
            </div>
          </Card>
        </div>
        <div style={side(1)}>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 600, color: '#9EA3AE', marginBottom: 20}}>Meanwhile, the lead</div>
          <div style={{filter: `grayscale(${grey})`, opacity: 1 - grey * 0.35}}>
            <Toast w={pw} app="Calendar" title="Viewing booked · Sat 10:00" body="With another agent" />
          </div>
          <div style={{marginTop: 30, transform: `scale(${prog(f, s(9.9), s(10.2), EASE.back)})`, transformOrigin: '0 50%'}}>
            <Chip text="Booked elsewhere" tone="red" size={34} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Show: the inbox does the work ---------- */
const FIELDS = [['Type', '3-bed apartment'], ['Area', 'Manchester'], ['Budget', '~£500k'], ['Timeline', '3 months'], ['Intent', 'Buying']];
const REPLY = 'Hi Sarah, thanks for getting in touch. Would Tuesday 14:00 or Wednesday 17:30 suit for a viewing?';
export const Show: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const hot = f >= s(14.15);
  const flip = prog(f, s(14.15), s(14.35), EASE.back);
  const typed = Math.round(tw(f, [s(14.9), s(16.1)], [0, REPLY.length], (x) => x));
  const sent = prog(f, s(16.15), s(16.4), EASE.back);
  const chips = [['Viewing booked · Tue 14:00', 16.7, 'green'], ['CRM updated', 17.3, 'blue'], ['Agent notified', 17.9, 'blue']] as const;
  const card = (
    <Card w={940} url="app.oonava.com/inbox" style={rise(f, s(11.65), 70, 24)}>
      <div style={{padding: 34, display: 'flex', flexDirection: 'column', gap: 24}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 74, height: 74, borderRadius: 40, background: '#DCEFFE', color: C.deep, display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 700}}>SM</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 32, fontWeight: 650, color: C.ink}}>Sarah Mitchell</div>
            <div style={{fontSize: 24, color: C.mute}}>Rightmove · just now</div>
          </div>
          <div style={{padding: '12px 24px', borderRadius: 99, fontSize: 28, fontWeight: 700, fontFamily: SANS, transform: `scale(${hot ? flip : 1}) rotateX(${hot ? 0 : 0}deg)`,
            background: hot ? C.red : C.g1, color: hot ? '#fff' : C.mute, opacity: prog(f, s(12.2), s(12.4))}}>
            {hot ? 'HOT · 92' : 'Scoring…'}
          </div>
        </div>
        <div style={{background: C.g1, borderRadius: '8px 30px 30px 30px', padding: '22px 28px', fontSize: 31, color: C.ink, lineHeight: 1.35, ...rise(f, s(11.9))}}>
          Looking for a 3-bed apartment in Manchester, around £500k. Moving in 3 months.
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          {FIELDS.map(([k, v], i) => {
            const at = s(13.0) + i * 9;
            const p = prog(f, at, at + 18, EASE.back);
            return (
              <div key={k} style={{display: 'flex', gap: 10, alignItems: 'baseline', padding: '12px 20px', borderRadius: 16, border: `1.5px solid ${C.g2}`, background: '#fff',
                opacity: Math.min(1, p * 2), transform: `translate(${(1 - p) * -60}px, ${(1 - p) * -90}px) scale(${0.6 + p * 0.4})`}}>
                <span style={{fontSize: 21, fontWeight: 600, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.04em'}}>{k}</span>
                <span style={{fontSize: 27, fontWeight: 650, color: C.ink}}>{v}</span>
              </div>
            );
          })}
        </div>
        <div style={{alignSelf: 'flex-end', maxWidth: 740, minHeight: 86, background: C.blue, color: '#fff', borderRadius: '30px 8px 30px 30px', padding: '22px 28px', fontSize: 31, lineHeight: 1.35, opacity: prog(f, s(14.7), s(14.9))}}>
          {REPLY.slice(0, typed)}<span style={{opacity: typed < REPLY.length && f % 30 < 15 ? 1 : 0}}>|</span>
        </div>
        <div style={{alignSelf: 'flex-end', transform: `scale(${sent})`, transformOrigin: '100% 50%'}}><Chip text="Sent" icon="check" /></div>
      </div>
    </Card>
  );
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', left: tall ? W / 2 : W * 0.36, top: tall ? H * 0.36 : H / 2, transform: `translate(-50%,-50%) scale(${u * (tall ? 1 : 0.86)})`}}>{card}</div>
      <div style={{position: 'absolute', ...(tall ? {left: 0, right: 0, top: H * 0.36 + 420 * u, alignItems: 'center'} : {left: W * 0.68, top: 0, bottom: 0, justifyContent: 'center'}), display: 'flex', flexDirection: 'column', gap: 18 * u}}>
        {chips.map(([t, at, tone]) => {
          const p = prog(f, s(at), s(at) + 18, EASE.back);
          return <div key={t} style={{transform: `scale(${p * u * 1.15})`, transformOrigin: tall ? '50% 50%' : '0 50%', opacity: Math.min(1, p * 2)}}><Chip text={t} tone={tone} icon="check" size={34} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- dot wipe (dark -> white) ---------- */
export const Wipe: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {u, W, H} = useU();
  const drop = prog(f, at, at + 18, EASE.in);
  const grow = prog(f, at + 18, at + 44, EASE.inOut);
  const r = 26 * u + grow * Math.hypot(W, H);
  const y = tw(drop, [0, 1], [-60 * u, H / 2]);
  return <div style={{position: 'absolute', left: W / 2 - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: grow > 0.55 ? C.white : C.blue}} />;
};

/* ---------- Outcome ---------- */
const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center', gap: 34 * u}}>
      <div style={{transform: `scale(${tw(f, [s(19.75), s(20.0)], [1.2, 1])})`}}>
        <Head words={['Every', 'lead', 'answered.']} at={s(19.7)} size={130 * u} color={C.ink} weight={700} />
      </div>
      <div style={{width: 960 * u}}>
        <Head words={['Even', 'at', '21:47', 'on', 'a', 'Sunday.']} accent={['Sunday.']} at={s(21.2)} size={86 * u} color={C.mute} weight={600} stagger={5} />
      </div>
    </AbsoluteFill>
  );
};

export const OonavaV2: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(12.1) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS2}>
        {f < s(6.1) && <Hook />}
        {f >= s(5.85) && f < s(12.4) && <AbsoluteFill style={{opacity: prog(f, s(5.85), s(6.05))}}><Problem /></AbsoluteFill>}
        {f >= s(10.95) && f < s(12.4) && <Wipe at={s(10.95)} />}
        {f >= s(11.6) && f < s(19.85) && <AbsoluteFill style={{opacity: prog(f, s(11.6), s(11.75))}}><Show /></AbsoluteFill>}
        {f >= s(19.6) && f < s(24.4) && <Outcome />}
        {f >= s(24.1) && <EndCard at={s(24.2)} extra="See it on your own enquiries." />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={f < s(11.5)} y={H - (H > 1500 ? 330 : 120) * u} size={50 * u} hide={[[0, 5.8], [19.5, 99]]} />
      {!mute && <Audio src={staticFile('oon/v2_mix.wav')} />}
    </AbsoluteFill>
  );
};
