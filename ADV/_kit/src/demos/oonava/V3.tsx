// Oonava V3 "The money is in the follow-up". Absolute seconds; VO starts at 0.3 s.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog, lerp} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, useU, Head, Card, Toast, Chip, Captions, EndCard, W} from './kit';
import {Wipe} from './V2';
import words from './v3_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV3_DURATION = s(25.2);
const VO = 0.3;
const CUTS = [0.3, 1.9, 4.0, 9.4, 13.3, 16.4, 17.2, 19.8, 21.9];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center', gap: 40 * u}}>
      <div style={{transform: `scale(${tw(f, [s(0.3), s(0.55)], [1.35, 1])})`}}>
        <Head words={['Most', 'leads', 'say', 'no.']} at={s(0.28)} size={150 * u} weight={700} stagger={3} />
      </div>
      <div style={{width: 980 * u}}>
        <Head words={['Because', 'nobody', 'asked', 'twice.']} accent={['twice.']} at={s(1.9)} size={96 * u} color="#9EA3AE" stagger={5} />
      </div>
    </AbsoluteFill>
  );
};

const LEADS = ['Daniel Hughes', 'Priya Shah', 'Tom Walker', 'Grace Okafor', 'Luke Bennett', 'Amira Khan', 'Ben Foster', 'Chloe Price'];
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${u * (tall ? 1 : 0.9)}) translateY(${tall ? -120 : -30}px)`, opacity: prog(f, s(3.9), s(4.2))}}>
        <Card w={940} dark url="leads_2026.xlsx">
          <div style={{padding: '18px 26px', display: 'flex', fontSize: 22, fontWeight: 600, color: '#6B7075', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
            <div style={{flex: 1.5}}>Lead</div><div style={{flex: 1}}>Emails sent</div><div style={{flex: 1}}>Status</div>
          </div>
          {LEADS.map((n, i) => {
            const g = prog(f, s(4.6) + i * 14, s(4.6) + i * 14 + 14);
            return (
              <div key={n} style={{display: 'flex', alignItems: 'center', padding: '20px 26px', borderTop: '1px solid rgba(255,255,255,.06)', fontSize: 30, color: '#fff', opacity: 1 - g * 0.6, filter: `grayscale(${g})`}}>
                <div style={{flex: 1.5, fontWeight: 600}}>{n}</div>
                <div style={{flex: 1, color: '#9EA3AE'}}>1</div>
                <div style={{flex: 1}}>{g > 0.3 ? <Chip text="No reply" tone="grey" size={22} /> : <Chip text="Waiting" tone="blue" size={22} />}</div>
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const COLS = ['New', 'Nurturing', 'Re-engaged', 'Ready'];
// [name, startCol, endCol, moveAt]
const MINI: [string, number, number, number][] = [['Oliver R.', 0, 1, 10.2], ['Sophie L.', 0, 2, 10.8], ['Jack M.', 1, 2, 11.4], ['Mia T.', 1, 3, 12.0], ['Noah P.', 0, 1, 12.5], ['Ella W.', 2, 3, 12.9]];
const SEQ = [['D0', 13.3], ['D2', 13.95], ['D5', 14.5], ['D10', 15.1]] as const;

export const Show: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const colW = tall ? 236 : 220;
  const gap = 12;
  const jump = prog(f, s(16.4), s(16.85), EASE.back);
  const ring = prog(f, s(16.7), s(17.0));
  const boardY = tall ? 760 : 330;
  const cardX = (c: number) => c * (colW + gap);
  const emma = (
    <Card w={tall ? 940 : 760} style={{opacity: prog(f, s(12.9), s(13.2)), transform: `translateY(${(1 - prog(f, s(12.9), s(13.25))) * 40}px)`}}>
      <div style={{padding: 30}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 70, height: 70, borderRadius: 40, background: '#DCEFFE', color: C.deep, display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700}}>EC</div>
          <div style={{flex: 1}}><div style={{fontSize: 32, fontWeight: 650, color: C.ink}}>Emma Clarke</div><div style={{fontSize: 24, color: C.mute}}>Follow-up sequence</div></div>
          {f > s(16.4) && <div style={{transform: `scale(${jump})`}}><Chip text="Replied" icon="check" size={26} /></div>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginTop: 30}}>
          {SEQ.map(([d, at], i) => {
            const on = prog(f, s(at), s(at) + 12, EASE.back);
            const line = i ? prog(f, s(SEQ[i - 1][1]), s(at), EASE.inOut) : 0;
            return (
              <React.Fragment key={d}>
                {i > 0 && <div style={{flex: 1, height: 6, background: C.g2, position: 'relative', borderRadius: 3}}><div style={{position: 'absolute', inset: 0, width: `${line * 100}%`, background: C.blue, borderRadius: 3}} /></div>}
                <div style={{width: 92, height: 92, borderRadius: 50, display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700, fontFamily: SANS,
                  background: on > 0.5 ? C.blue : C.g1, color: on > 0.5 ? '#fff' : C.mute, transform: `scale(${0.85 + on * 0.15})`, boxShadow: on > 0.5 ? '0 10px 24px rgba(38,160,248,.35)' : 'none'}}>{d}</div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Card>
  );
  const counter = Math.round(tw(f, [s(10.0), s(11.6)], [0, 124], EASE.count));
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', left: W / 2, top: tall ? 0 : H / 2, transform: `scale(${u * (tall ? 1 : 0.88)})`}}>
        <div style={{position: 'absolute', left: tall ? -470 : -860, top: tall ? 250 : -380, display: 'flex', gap: 14, opacity: prog(f, s(9.9), s(10.2))}}>
          <Chip text={`${counter} active leads`} tone="blue" size={30} />
          <Chip text="0 forgotten" icon="check" size={30} />
        </div>
        <div style={{position: 'absolute', left: tall ? -470 : -860, top: tall ? 360 : -280}}>{emma}</div>
        <div style={{position: 'absolute', left: tall ? -(4 * colW + 3 * gap) / 2 : -20, top: tall ? boardY : -380}}>
          {COLS.map((c, i) => (
            <div key={c} style={{position: 'absolute', left: cardX(i), width: colW, height: tall ? 700 : 760, borderRadius: 22, background: i === 3 ? '#EAF5FE' : C.g1, padding: 16, boxSizing: 'border-box',
              opacity: prog(f, s(9.5) + i * 5, s(9.5) + i * 5 + 15), transform: `translateY(${(1 - prog(f, s(9.5) + i * 5, s(9.5) + i * 5 + 18)) * 50}px)`}}>
              <div style={{fontFamily: SANS, fontSize: 25, fontWeight: 650, color: i === 3 ? C.deep : C.mute}}>{c}</div>
            </div>
          ))}
          {MINI.map(([n, a, b, at], i) => {
            const m = prog(f, s(at), s(at) + 30, EASE.inOut);
            const lift = Math.sin(m * Math.PI) * 24;
            const row = i % 3;
            return (
              <div key={n} style={{position: 'absolute', left: lerp(cardX(a), cardX(b), m) + 14, top: 70 + row * 112 - lift, width: colW - 28, height: 96, borderRadius: 16, background: '#fff', border: `1.5px solid ${C.g2}`,
                boxShadow: `0 ${8 + lift}px ${16 + lift}px rgba(11,40,80,.08)`, fontFamily: SANS, padding: '14px 16px', boxSizing: 'border-box', opacity: prog(f, s(9.8) + i * 4, s(9.8) + i * 4 + 12)}}>
                <div style={{fontSize: 24, fontWeight: 650, color: C.ink}}>{n}</div>
                <div style={{width: '60%', height: 8, borderRadius: 4, background: C.g2, marginTop: 14}} />
              </div>
            );
          })}
          {/* Emma's mini card jumps to Ready */}
          <div style={{position: 'absolute', left: lerp(cardX(1), cardX(3), jump) + 14, top: 70 + 3 * 112 - Math.sin(Math.min(1, jump) * Math.PI) * 60, width: colW - 28, height: 96, borderRadius: 16, background: '#fff',
            border: `${2 + ring * 2}px solid ${ring > 0 ? C.blue : C.g2}`, boxShadow: `0 0 0 ${ring * 10}px rgba(38,160,248,.18)`, fontFamily: SANS, padding: '14px 16px', boxSizing: 'border-box', opacity: prog(f, s(12.9), s(13.1))}}>
            <div style={{fontSize: 24, fontWeight: 700, color: C.ink}}>Emma C.</div>
            <div style={{width: '60%', height: 8, borderRadius: 4, background: C.blue, marginTop: 14}} />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: tall ? 90 * u : 40 * u, display: 'flex', justifyContent: 'center',
        transform: `translateY(${(1 - prog(f, s(17.2), s(17.55), EASE.back)) * -260 * u}px) scale(${u * 0.9})`}}>
        <Toast w={900} dark={false} app="Oonava" title="Emma replied" body="Agent alerted · moved to Ready" />
      </div>
    </AbsoluteFill>
  );
};

const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 960 * u, transform: `scale(${tw(f, [s(19.8), s(20.05)], [1.2, 1])})`}}>
        <Head words={['Nobody', 'slips', 'through', 'the', 'cracks.']} accent={['cracks.']} at={s(19.75)} size={130 * u} color={C.ink} weight={700} stagger={4} />
      </div>
    </AbsoluteFill>
  );
};

export const OonavaV3: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(9.9) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS}>
        {f < s(4.1) && <Hook />}
        {f >= s(3.85) && f < s(10.2) && <Problem />}
        {f >= s(8.75) && f < s(10.2) && <Wipe at={s(8.75)} />}
        {f >= s(9.4) && f < s(19.95) && <AbsoluteFill style={{opacity: prog(f, s(9.4), s(9.55))}}><Show /></AbsoluteFill>}
        {f >= s(19.7) && f < s(22.1) && <Outcome />}
        {f >= s(21.8) && <EndCard at={s(21.9)} />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={f < s(9.3)} y={H - (H > 1500 ? 430 : 120) * u} size={50 * u} hide={[[0, 3.9], [19.6, 99]]} />
      {!mute && <Audio src={staticFile('oon/v3_mix.wav')} />}
    </AbsoluteFill>
  );
};
