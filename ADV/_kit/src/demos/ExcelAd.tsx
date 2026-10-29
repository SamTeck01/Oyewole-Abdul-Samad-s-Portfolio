// Excel Academy app advert, clean light style. One component, two layouts (wide 16:9, tall 9:16).
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, tw, prog, lerp} from '../kit/core';
import {SANS} from '../kit/fonts';

export const XA_DURATION = 35 * 60;
const O = '#FF822B';
const O2 = '#FF9F55';
const D = '#15161C';
const BG = '#FAF7F3';
const MUTE = '#6B6E78';
const s = (t: number) => Math.round(t * 60);

// ---------- small pieces ----------
const Reveal: React.FC<{at: number; children: React.ReactNode; dy?: number; dur?: number; style?: React.CSSProperties}> = ({at, children, dy = 60, dur = 34, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur);
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em', ...style}}>
      <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * dy}%)`, opacity: tw(f, [at, at + 8], [0, 1])}}>{children}</span>
    </span>
  );
};

const Words: React.FC<{text: string; at: number; gap?: number; accent?: string[]}> = ({text, at, gap = 4, accent = []}) => (
  <>
    {text.split(' ').map((w, i) => (
      <Reveal key={i} at={at + i * gap} style={{marginRight: '0.24em', color: accent.includes(w) ? O : undefined}}>
        {w}
      </Reveal>
    ))}
  </>
);

const Ripple: React.FC<{x: number; y: number; at: number; c?: string}> = ({x, y, at, c = O}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 40) return null;
  const p = prog(f, at, at + 36);
  return (
    <>
      <div style={{position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 99, background: c, opacity: (1 - p) * 0.28, transform: `scale(${0.3 + p * 1.6})`}} />
      <div style={{position: 'absolute', left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 99, background: 'rgba(255,255,255,.9)', border: `2px solid ${c}`, opacity: tw(f, [at, at + 6, at + 22, at + 34], [0, 1, 1, 0]), transform: `scale(${tw(f, [at, at + 8, at + 16], [1.2, 0.85, 1])})`}} />
    </>
  );
};

const Icon: React.FC<{k: 'play' | 'doc' | 'check' | 'chart' | 'clock' | 'android' | 'star'; c?: string; z?: number}> = ({k, c = '#fff', z = 26}) => {
  const p: Record<string, React.ReactNode> = {
    play: <path d="M8 5v14l11-7z" fill={c} />,
    doc: <path d="M6 3h8l4 4v14H6zM9 11h6M9 15h6" stroke={c} strokeWidth={2} fill="none" strokeLinejoin="round" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" stroke={c} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    chart: <path d="M5 20V11M12 20V5M19 20v-6" stroke={c} strokeWidth={2.6} strokeLinecap="round" />,
    clock: <><circle cx={12} cy={12} r={8} stroke={c} strokeWidth={2} fill="none" /><path d="M12 8v4l3 2" stroke={c} strokeWidth={2} fill="none" strokeLinecap="round" /></>,
    star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill={c} />,
    android: (
      <>
        <path d="M5 11a7 7 0 0 1 14 0v1H5z" fill={c} />
        <rect x={5} y={13} width={14} height={7} rx={2} fill={c} />
        <path d="M8 4.5l1.3 2.2M16 4.5l-1.3 2.2" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={9.3} cy={9} r={0.9} fill={D} /><circle cx={14.7} cy={9} r={0.9} fill={D} />
      </>
    ),
  };
  return <svg width={z} height={z} viewBox="0 0 24 24">{p[k]}</svg>;
};

// ---------- app screens (390 x 843 logical) ----------
const SW = 390;
const SH = 843;
const Bar: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{height: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 30px 6px', fontSize: 15, fontWeight: 600, color: dark ? '#fff' : D}}>
    <span>9:41</span>
    <span style={{letterSpacing: 2}}>●●● ▮</span>
  </div>
);

const Splash: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, s(5.9), s(6.6), EASE.back);
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${O2}, ${O})`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 150, height: 150, borderRadius: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, boxShadow: '0 20px 50px rgba(120,50,0,.25)'}}>
        <Img src={staticFile('xa/logo_icon.png')} style={{width: 118}} />
      </div>
      <div style={{marginTop: 26, color: '#fff', fontSize: 30, fontWeight: 800, opacity: tw(f, [s(6.2), s(6.6)], [0, 1])}}>Excel Academy</div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: '#fff', borderRadius: 22, boxShadow: '0 6px 20px rgba(20,22,28,.06)', ...style}}>{children}</div>
);

const COURSES: [string, string, string][] = [
  ['ICAN', 'Financial Reporting', '#FFE7D4'],
  ['ACCA', 'Audit & Assurance', '#E4ECFF'],
  ['CIMA', 'Management Acct.', '#E3F6EC'],
  ['CITN', 'Taxation', '#F4E6FF'],
];

const Home: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const it = (i: number) => ({opacity: tw(f, [at + i * 5, at + i * 5 + 14], [0, 1]), transform: `translateY(${tw(f, [at + i * 5, at + i * 5 + 24], [30, 0])}px)`});
  const cont = tw(f, [at + 30, at + 90], [0, 64], EASE.count);
  return (
    <AbsoluteFill style={{background: '#F6F4F1'}}>
      <Bar />
      <div style={{padding: '14px 22px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...it(0)}}>
          <div>
            <div style={{fontSize: 15, color: MUTE}}>Good morning,</div>
            <div style={{fontSize: 26, fontWeight: 800, color: D}}>Tobi</div>
          </div>
          <div style={{width: 46, height: 46, borderRadius: 99, background: `linear-gradient(135deg, ${O2}, ${O})`, color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>T</div>
        </div>
        <Card style={{marginTop: 18, padding: 18, background: D, ...it(1)}}>
          <div style={{color: '#ffffffaa', fontSize: 13}}>Continue learning</div>
          <div style={{color: '#fff', fontSize: 19, fontWeight: 700, marginTop: 4}}>Advanced Audit & Assurance</div>
          <div style={{marginTop: 14, height: 8, borderRadius: 9, background: '#ffffff22'}}>
            <div style={{width: `${cont}%`, height: '100%', borderRadius: 9, background: O}} />
          </div>
          <div style={{color: '#ffffffaa', fontSize: 13, marginTop: 8}}>{Math.round(cont)}% complete · Lesson 8 of 12</div>
        </Card>
        <div style={{fontSize: 18, fontWeight: 800, color: D, margin: '22px 0 12px', ...it(2)}}>Your courses</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {COURSES.map(([a, b, c], i) => (
            <Card key={a} style={{padding: 16, ...it(3 + i)}}>
              <div style={{width: 40, height: 40, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: D}}>{a}</div>
              <div style={{fontSize: 15, fontWeight: 700, color: D, marginTop: 12}}>{a}</div>
              <div style={{fontSize: 12, color: MUTE, marginTop: 2}}>{b}</div>
            </Card>
          ))}
        </div>
        <Card style={{marginTop: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12, ...it(7)}}>
          <div style={{width: 46, height: 46, borderRadius: 99, background: 'linear-gradient(135deg,#7A5537,#3E2A1C)'}} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 15, fontWeight: 700, color: D}}>Live class with Mr. Adeyemi</div>
            <div style={{fontSize: 12, color: MUTE}}>Today · 6:00 PM</div>
          </div>
          <div style={{fontSize: 12, fontWeight: 700, color: O}}>Join</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const Lesson: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pl = tw(f, [at + 40, at + 160], [0, 38], (t) => t);
  return (
    <AbsoluteFill style={{background: '#F6F4F1'}}>
      <div style={{background: D}}>
        <Bar dark />
        <div style={{height: 230, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, #2A2C36, ${D})`}}>
          <Img src={staticFile('xa/excel_banner.png')} style={{position: 'absolute', width: 470, left: -20, top: 0, opacity: 0.85, transform: `scale(${1 + (f - at) * 0.0006})`}} />
          <div style={{position: 'absolute', left: 165, top: 85, width: 60, height: 60, borderRadius: 99, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: tw(f, [at + 26, at + 36], [1, 0]), transform: `scale(${tw(f, [at + 18, at + 26, at + 36], [1, 0.85, 1.4])})`}}>
            <Icon k="play" c={O} z={30} />
          </div>
          <div style={{position: 'absolute', left: 16, right: 16, bottom: 12, height: 4, borderRadius: 4, background: '#ffffff44'}}>
            <div style={{width: `${pl}%`, height: '100%', background: O, borderRadius: 4}} />
          </div>
        </div>
      </div>
      <div style={{padding: 22}}>
        <div style={{fontSize: 13, color: O, fontWeight: 700}}>ACCA · AAA</div>
        <div style={{fontSize: 22, fontWeight: 800, color: D, marginTop: 4}}>Audit risk & materiality</div>
        <div style={{fontSize: 13, color: MUTE, marginTop: 6}}>with Mrs. Okafor, FCA · 24 min</div>
        {['Understanding audit risk', 'Setting materiality', 'Responding to risk', 'Worked exam question'].map((t, i) => (
          <Card key={t} style={{marginTop: i ? 10 : 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 34, height: 34, borderRadius: 10, background: i < 1 ? O : '#F1EEEA', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon k={i < 1 ? 'check' : 'play'} c={i < 1 ? '#fff' : MUTE} z={18} />
            </div>
            <div style={{flex: 1, fontSize: 15, fontWeight: 600, color: D}}>{t}</div>
            <div style={{fontSize: 12, color: MUTE}}>{6 + i * 2}:0{i}</div>
          </Card>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const PastQ: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const rows = ['May 2025', 'Nov 2024', 'May 2024', 'Nov 2023', 'May 2023', 'Nov 2022'];
  return (
    <AbsoluteFill style={{background: '#F6F4F1'}}>
      <Bar />
      <div style={{padding: '10px 22px'}}>
        <div style={{fontSize: 26, fontWeight: 800, color: D}}>Past questions</div>
        <div style={{display: 'flex', gap: 8, marginTop: 14}}>
          {['ICAN', 'ACCA', 'CIMA', 'CITN'].map((t, i) => (
            <div key={t} style={{padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 700, background: i === 0 ? D : '#fff', color: i === 0 ? '#fff' : D}}>{t}</div>
          ))}
        </div>
        {rows.map((r, i) => {
          const a = at + 8 + i * 5;
          return (
            <Card key={r} style={{marginTop: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14, opacity: tw(f, [a, a + 12], [0, 1]), transform: `translateX(${tw(f, [a, a + 26], [60, 0])}px)`}}>
              <div style={{width: 42, height: 42, borderRadius: 12, background: '#FFE7D4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon k="doc" c={O} z={22} />
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 15, fontWeight: 700, color: D}}>Financial Reporting</div>
                <div style={{fontSize: 12, color: MUTE}}>{r} · with solutions</div>
              </div>
              <div style={{fontSize: 12, fontWeight: 700, color: i < 2 ? '#1A9E5C' : MUTE}}>{i < 2 ? 'Done' : 'Open'}</div>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Mock: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pick = at + 50;
  const res = at + 92;
  const score = Math.round(tw(f, [res + 10, res + 80], [0, 86], EASE.count));
  const opts = ['Going concern basis', 'Materiality threshold', 'Inherent risk', 'Control risk'];
  return (
    <AbsoluteFill style={{background: '#F6F4F1'}}>
      <Bar />
      <div style={{padding: '10px 22px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, color: MUTE, fontWeight: 600}}>
          <span>Mock exam · Q 14 / 40</span>
          <span style={{color: O}}>32:15</span>
        </div>
        <div style={{height: 6, borderRadius: 6, background: '#E9E5E0', marginTop: 10}}>
          <div style={{width: '35%', height: '100%', borderRadius: 6, background: O}} />
        </div>
        <div style={{fontSize: 19, fontWeight: 700, color: D, marginTop: 22, lineHeight: 1.35}}>
          Which risk exists before considering any related internal controls?
        </div>
        {opts.map((o, i) => {
          const on = i === 2 && f >= pick;
          return (
            <Card key={o} style={{marginTop: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, border: `2px solid ${on ? O : 'transparent'}`, background: on ? '#FFF4EB' : '#fff'}}>
              <div style={{width: 28, height: 28, borderRadius: 99, border: `2px solid ${on ? O : '#D9D4CE'}`, background: on ? O : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {on && <Icon k="check" z={16} />}
              </div>
              <div style={{fontSize: 15, fontWeight: 600, color: D}}>{o}</div>
            </Card>
          );
        })}
      </div>
      {/* result sheet */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 470, background: '#fff', borderRadius: '30px 30px 0 0', boxShadow: '0 -20px 50px rgba(20,22,28,.15)', transform: `translateY(${tw(f, [res, res + 30], [480, 0])}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
        <div style={{fontSize: 15, color: MUTE, fontWeight: 600}}>Your result</div>
        <div style={{position: 'relative', width: 190, height: 190, marginTop: 14}}>
          <svg width={190} height={190} style={{transform: 'rotate(-90deg)'}}>
            <circle cx={95} cy={95} r={80} stroke="#F1EEEA" strokeWidth={16} fill="none" />
            <circle cx={95} cy={95} r={80} stroke={O} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={`${(score / 100) * 502.6} 502.6`} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 800, color: D}}>{score}%</div>
        </div>
        <div style={{marginTop: 16, fontSize: 20, fontWeight: 800, color: D}}>Excellent! You passed.</div>
        <div style={{display: 'flex', gap: 10, marginTop: 14}}>
          {['34 correct', '6 to review', '28 min'].map((t) => (
            <div key={t} style={{padding: '8px 12px', borderRadius: 99, background: '#F6F4F1', fontSize: 12, fontWeight: 700, color: D}}>{t}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const bars = [42, 58, 50, 72, 64, 88, 80];
  return (
    <AbsoluteFill style={{background: '#F6F4F1'}}>
      <Bar />
      <div style={{padding: '10px 22px'}}>
        <div style={{fontSize: 26, fontWeight: 800, color: D}}>Your progress</div>
        <Card style={{marginTop: 18, padding: 20}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontSize: 13, color: MUTE}}>Study time this week</div>
              <div style={{fontSize: 30, fontWeight: 800, color: D}}>{(tw(f, [at, at + 70], [0, 9.5], EASE.count)).toFixed(1)} hrs</div>
            </div>
            <div style={{fontSize: 13, fontWeight: 700, color: '#1A9E5C', alignSelf: 'flex-start', background: '#E3F6EC', padding: '6px 10px', borderRadius: 99}}>+24%</div>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 150, marginTop: 18}}>
            {bars.map((b, i) => (
              <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                <div style={{width: '100%', height: tw(f, [at + 10 + i * 4, at + 50 + i * 4], [0, b * 1.4], EASE.back), borderRadius: 8, background: i === 5 ? O : '#F3D9C4'}} />
                <div style={{fontSize: 11, color: MUTE}}>{'MTWTFSS'[i]}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12}}>
          <Card style={{padding: 16}}>
            <div style={{fontSize: 13, color: MUTE}}>Study streak</div>
            <div style={{fontSize: 26, fontWeight: 800, color: D}}>{Math.round(tw(f, [at + 20, at + 80], [0, 12], EASE.count))} days</div>
          </Card>
          <Card style={{padding: 16}}>
            <div style={{fontSize: 13, color: MUTE}}>Average score</div>
            <div style={{fontSize: 26, fontWeight: 800, color: O}}>{Math.round(tw(f, [at + 20, at + 80], [0, 81], EASE.count))}%</div>
          </Card>
        </div>
        {['Financial Reporting', 'Audit & Assurance', 'Taxation'].map((t, i) => {
          const v = [78, 64, 52][i];
          return (
            <Card key={t} style={{marginTop: 12, padding: 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: D}}>
                <span>{t}</span>
                <span>{v}%</span>
              </div>
              <div style={{height: 8, borderRadius: 8, background: '#F1EEEA', marginTop: 10}}>
                <div style={{width: `${tw(f, [at + 30 + i * 6, at + 90 + i * 6], [0, v], EASE.count)}%`, height: '100%', borderRadius: 8, background: D}} />
              </div>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// screen schedule: [start frame, component]; consecutive screens push in from the right
const SCREENS: [number, (at: number) => React.ReactNode][] = [
  [s(5.6), () => <Splash />],
  [s(7.0), (at) => <Home at={at} />],
  [s(10.4), (at) => <Lesson at={at} />],
  [s(13.2), (at) => <PastQ at={at} />],
  [s(16.0), (at) => <Mock at={at} />],
  [s(19.9), (at) => <Progress at={at} />],
];
// taps on the phone screen (logical coords) one beat before each switch
const TAPS: [number, number, number][] = [
  [s(10.15), 200, 170],
  [s(12.95), 280, 300],
  [s(15.75), 200, 360],
  [s(16.0) + 50, 120, 452],
  [s(19.65), 300, 790],
];

const PhoneScreen: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {SCREENS.map(([at, render], i) => {
        const next = SCREENS[i + 1]?.[0] ?? 1e9;
        if (f < at - 1 || f > next + 30) return null;
        const pin = i === 0 ? 0 : 1 - prog(f, at, at + 26, EASE.inOut);
        const pout = prog(f, next, next + 26, EASE.inOut);
        return (
          <AbsoluteFill key={i} style={{transform: `translateX(${pin * SW - pout * SW * 0.3}px)`, filter: pout > 0 ? `brightness(${1 - pout * 0.3})` : undefined, boxShadow: pin > 0 ? '-20px 0 40px rgba(0,0,0,.12)' : undefined}}>
            {render(at)}
          </AbsoluteFill>
        );
      })}
      {TAPS.map(([at, x, y], i) => (
        <Ripple key={i} at={at} x={x} y={y} />
      ))}
    </AbsoluteFill>
  );
};

// phone frame render: 1000x2000, screen 85..914 x 103..1896
const Phone: React.FC<{h: number}> = ({h}) => {
  const k = h / 2000;
  const sc = (830 * k) / SW;
  return (
    <div style={{position: 'relative', width: 1000 * k, height: h}}>
      <div style={{position: 'absolute', left: 85 * k, top: 103 * k, width: 830 * k, height: 1794 * k, borderRadius: 120 * k, overflow: 'hidden', background: '#000'}}>
        <div style={{width: SW, height: SH, transform: `scale(${sc})`, transformOrigin: '0 0'}}>
          <PhoneScreen />
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 32%)'}} />
      </div>
      <Img src={staticFile('xa/phone_frame.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
    </div>
  );
};

// floating callout next to the phone
const Callout: React.FC<{at: number; out: number; icon: Parameters<typeof Icon>[0]['k']; title: string; sub: string; x: number; y: number; z?: number}> = ({at, out, icon, title, sub, x, y, z = 1}) => {
  const f = useCurrentFrame();
  if (f < at || f > out + 20) return null;
  const p = prog(f, at, at + 30, EASE.back);
  const q = prog(f, out, out + 16, EASE.in);
  const bob = Math.sin((f - at) / 40) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y + bob, transform: `scale(${z * p * (1 - q * 0.4)}) translateY(${q * -30}px)`, opacity: Math.min(1, p * 2) * (1 - q), transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 18, padding: '18px 28px 18px 18px', borderRadius: 26, background: 'rgba(255,255,255,.92)', boxShadow: '0 24px 60px rgba(60,40,20,.14)', fontFamily: SANS}}>
      <div style={{width: 60, height: 60, borderRadius: 18, background: `linear-gradient(135deg, ${O2}, ${O})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon k={icon} z={30} />
      </div>
      <div>
        <div style={{fontSize: 28, fontWeight: 800, color: D}}>{title}</div>
        <div style={{fontSize: 19, color: MUTE, marginTop: 2}}>{sub}</div>
      </div>
    </div>
  );
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const b = (cx: number, cy: number, r: number, c: string, sp: number) => (
    <div style={{position: 'absolute', left: cx * width + Math.sin(f / sp) * 60 - r, top: cy * height + Math.cos(f / (sp * 1.3)) * 50 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: c, filter: 'blur(120px)'}} />
  );
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      {b(0.85, 0.2, 360, 'rgba(255,130,43,.30)', 70)}
      {b(0.1, 0.85, 320, 'rgba(255,170,100,.28)', 90)}
      {b(0.5, 0.55, 260, 'rgba(255,214,180,.45)', 110)}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(21,22,28,.07) 1.2px, transparent 1.2px)', backgroundSize: '34px 34px', maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 75%)'}} />
    </AbsoluteFill>
  );
};

// ---------- main ----------
export const ExcelAd: React.FC<{tall?: boolean; mute?: boolean}> = ({tall = false, mute = false}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const T = (a: number) => f >= s(a);

  // phone placement: rises in at 5.4, sits right (wide) or low-centre (tall), moves aside for end card
  const ph = tall ? 1180 : 900;
  const rise = prog(f, s(5.3), s(6.4), EASE.out);
  const endP = prog(f, s(26.2), s(27.2), EASE.inOut);
  const baseX = tall ? W / 2 : W * 0.66;
  const baseY = tall ? H * 0.64 : H * 0.53;
  const px = tall ? baseX : lerp(baseX, W * 0.73, endP);
  const py = lerp(baseY + H, baseY, rise) + (tall ? endP * 760 : endP * 40);
  const rotY = lerp(-28, 0, rise) + Math.sin(f / 90) * 3 + (tall ? 0 : endP * -14);
  const rotZ = lerp(10, 0, rise) + (tall ? 0 : endP * 6);
  const pScale = (1 + Math.sin(f / 120) * 0.008) * lerp(1, tall ? 0.9 : 0.86, endP);
  // anytime/anywhere tilt
  const tilt = prog(f, s(22.8), s(23.8), EASE.inOut) * (1 - prog(f, s(25.6), s(26.2), EASE.inOut));

  // global camera drift and push
  const camS = 1 + prog(f, 0, s(5.4), (t) => t) * 0.04 + tw(f, [s(5.4), s(26)], [0, 0.03], (t) => t);

  const textX = tall ? 80 : 150;
  const textW = tall ? W - 160 : W * 0.42;
  const big = tall ? 92 : 96;

  // hook
  const hookOut = prog(f, s(5.0), s(5.5), EASE.in);
  const exams = ['ICAN', 'ACCA', 'CIMA'];
  const examAt = [s(0.5), s(1.25), s(1.7)];

  // side copy per section: [in, out, eyebrow, line, accent words]
  const copy: [number, number, string, string, string[]][] = [
    [s(6.4), s(10.1), 'Excel Academy', 'Expert tutors, right in your pocket.', ['pocket.']],
    [s(10.5), s(12.9), 'Learn', 'Video lessons from real tutors.', ['Video', 'lessons']],
    [s(13.3), s(15.8), 'Practise', 'Years of past questions, solved.', ['past', 'questions,']],
    [s(16.1), s(19.6), 'Test yourself', 'Mock exams with instant results.', ['instant', 'results.']],
    [s(20.0), s(22.7), 'Improve', 'Track every bit of progress.', ['progress.']],
    [s(23.0), s(26.0), 'Your schedule', 'Study anytime, anywhere.', ['anytime,', 'anywhere.']],
  ];

  return (
    <AbsoluteFill style={{fontFamily: SANS, color: D}}>
      <Backdrop />
      <AbsoluteFill style={{transform: `scale(${camS})`}}>
        {/* ---- hook ---- */}
        {f < s(5.6) && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - hookOut, transform: `scale(${1 - hookOut * 0.08}) translateY(${-hookOut * 40}px)`}}>
            <div style={{display: 'flex', gap: tall ? 18 : 28, flexDirection: 'row', transform: `translateY(${tw(f, [s(2.0), s(2.6)], [0, tall ? -150 : -110], EASE.inOut)}px) scale(${tw(f, [s(2.0), s(2.6)], [1, 0.62], EASE.inOut)})`}}>
              {exams.map((e, i) => {
                const p = prog(f, examAt[i], examAt[i] + 26, EASE.back);
                return (
                  <div key={e} style={{padding: tall ? '22px 34px' : '26px 46px', borderRadius: 28, background: i === 1 ? O : D, color: '#fff', fontSize: tall ? 74 : 104, fontWeight: 800, letterSpacing: -2, transform: `scale(${p}) translateY(${(1 - p) * 40}px)`, opacity: Math.min(1, p * 2), boxShadow: '0 24px 60px rgba(21,22,28,.18)'}}>
                    {e}
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', top: tall ? '50%' : '52%', width: tall ? W - 140 : 1400, textAlign: 'center', fontSize: tall ? 76 : 84, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.08}}>
              <Words text="Professional exams" at={s(2.1)} />
              <br />
              <Words text="don't forgive" at={s(3.15)} gap={5} />
              <span style={{position: 'relative', display: 'inline-block'}}>
                <Reveal at={s(3.75)} style={{color: O}}>guesswork.</Reveal>
                <svg style={{position: 'absolute', left: -6, top: '42%', width: '104%', height: 40, overflow: 'visible'}} viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 12 C 25 4, 55 18, 100 8" stroke={D} strokeWidth={3.2} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, s(4.2), s(4.65))} vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            </div>
          </AbsoluteFill>
        )}

        {/* ---- side copy ---- */}
        {copy.map(([a, b, eb, line, acc], i) => {
          if (f < a || f > b + 24) return null;
          const out = prog(f, b, b + 18, EASE.in);
          return (
            <div key={i} style={{position: 'absolute', left: textX, width: textW, top: tall ? 170 : undefined, bottom: tall ? undefined : H * 0.5 - 120, opacity: 1 - out, transform: `translateY(${-out * 40}px)`, textAlign: tall ? 'center' : 'left'}}>
              <div style={{fontSize: tall ? 30 : 28, fontWeight: 700, color: O, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14}}>
                <Reveal at={a}>{eb}</Reveal>
              </div>
              <div style={{fontSize: big, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04}}>
                <Words text={line} at={a + 6} accent={acc} />
              </div>
            </div>
          );
        })}

        {/* ---- anytime chips ---- */}
        {T(23.0) && f < s(26.3) &&
          ([['clock', '6:00 AM', 'Before work'], ['play', 'Lunch break', '15 min lesson'], ['star', '11:30 PM', 'Late-night revision']] as const).map(([ic, t, sub], i) => (
            <Callout key={t} at={s(23.3) + i * 14} out={s(25.8)} icon={ic} title={t} sub={sub} z={tall ? 1.1 : 1}
              x={tall ? [40, W - 430, 40][i] : [W * 0.42, W * 0.79, W * 0.44][i]}
              y={tall ? [H * 0.42, H * 0.55, H * 0.72][i] : [H * 0.22, H * 0.48, H * 0.72][i]} />
          ))}

        {/* ---- feature callouts ---- */}
        {!tall && (
          <>
            <Callout at={s(7.6)} out={s(10.0)} icon="star" title="Top-rated tutors" sub="Chartered professionals" x={W * 0.775} y={H * 0.30} />
            <Callout at={s(11.0)} out={s(12.9)} icon="play" title="HD video lessons" sub="Watch, pause, rewatch" x={W * 0.775} y={H * 0.62} />
            <Callout at={s(13.8)} out={s(15.8)} icon="doc" title="Solved past papers" sub="ICAN, ACCA, CIMA & more" x={W * 0.775} y={H * 0.28} />
            <Callout at={s(17.8)} out={s(19.6)} icon="check" title="Instant scoring" sub="See where to improve" x={W * 0.775} y={H * 0.36} />
            <Callout at={s(20.6)} out={s(22.6)} icon="chart" title="Weekly insights" sub="Study time and scores" x={W * 0.775} y={H * 0.58} />
          </>
        )}

        {/* ---- phone ---- */}
        {f >= s(5.2) && (
          <div style={{position: 'absolute', left: px, top: py, perspective: 2400}}>
            <div style={{transform: `translate(-50%,-50%) rotateY(${rotY + tilt * 16}deg) rotateX(${tilt * 8}deg) rotateZ(${rotZ - tilt * 4}deg) scale(${pScale})`, filter: 'drop-shadow(0 50px 60px rgba(60,35,10,.22))'}}>
              <Phone h={ph} />
            </div>
          </div>
        )}

        {/* ---- end card ---- */}
        {T(26.4) && <EndCard tall={!!tall} />}
      </AbsoluteFill>
      {!mute && <Audio src={staticFile('xa/xa_mix.wav')} />}
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{tall: boolean}> = ({tall}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const a = s(26.6);
  const lp = prog(f, a, a + 40, EASE.out);
  const btn = prog(f, s(30.0), s(30.6), EASE.back);
  const press = tw(f, [s(31.2), s(31.3), s(31.5)], [1, 0.94, 1]);
  const cx = tall ? W / 2 : W * 0.33;
  return (
    <div style={{position: 'absolute', left: cx, top: tall ? 250 : H * 0.5, transform: 'translate(-50%, ' + (tall ? '0' : '-50%') + ')', display: 'flex', flexDirection: 'column', alignItems: 'center', width: tall ? W - 120 : 900}}>
      <div style={{opacity: lp, transform: `translateY(${(1 - lp) * 40}px) scale(${0.94 + lp * 0.06})`}}>
        <Img src={staticFile('xa/logo_dark.png')} style={{width: tall ? 820 : 780}} />
      </div>
      <div style={{marginTop: 34, fontSize: tall ? 30 : 26, fontWeight: 600, color: MUTE, opacity: tw(f, [s(28.6), s(29.2)], [0, 1])}}>
        Trusted by students across Nigeria
      </div>
      <div style={{position: 'relative', marginTop: 40, transform: `scale(${btn * press})`, opacity: Math.min(1, btn * 2)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '24px 46px', borderRadius: 99, background: D, color: '#fff', fontSize: tall ? 38 : 36, fontWeight: 800, boxShadow: '0 24px 60px rgba(21,22,28,.25)'}}>
          <Icon k="android" c="#3DDC84" z={tall ? 46 : 44} />
          Download for Android
        </div>
        <div style={{position: 'absolute', inset: -10, borderRadius: 99, border: `3px solid ${O}`, opacity: tw(f, [s(31.3), s(31.5), s(32.6)], [0, 0.9, 0]), transform: `scale(${tw(f, [s(31.3), s(32.6)], [1, 1.25])})`}} />
      </div>
      <div style={{marginTop: 28, fontSize: tall ? 32 : 30, fontWeight: 700, color: O, opacity: tw(f, [s(30.6), s(31.2)], [0, 1])}}>excelacademyonline.com</div>
    </div>
  );
};

export const ExcelWide: React.FC<{mute?: boolean}> = (p) => <ExcelAd {...p} />;
export const ExcelTall: React.FC<{mute?: boolean}> = (p) => <ExcelAd tall {...p} />;
