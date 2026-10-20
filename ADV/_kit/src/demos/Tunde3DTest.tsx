// Reference-style test: flat monochrome-tint site, slow camera push with parallax, toon-shaded 3D
// Tunde (real talking mocap) and a pop-up info bubble that builds in. 1920x1080 60fps, 5 s.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw} from '../kit/core';

const C = {bg: '#fffaf5', t1: '#ffeadb', t2: '#ffd6bb', t3: '#ffb98e', t4: '#ff8a4c', main: '#ff6a13', ink: '#2b1d16'};
const SANS = 'Inter, sans-serif';
const pop = (t: number, a: number, d = 0.5) => tw(t, [a, a + d], [0, 1], EASE.back);
const fade = (t: number, a: number, d = 0.4) => tw(t, [a, a + d], [0, 1], EASE.out);

const Worker: React.FC<{x: number; y: number; s: number; c: string; t: number; ph: number}> = ({x, y, s, c, t, ph}) => (
  <g transform={`translate(${x + Math.sin(t * 0.8 + ph) * 6} ${y}) scale(${s})`} fill={c}>
    <circle cx={0} cy={-62} r={9} />
    <path d="M -11 -66 Q 0 -80 11 -66 Z" />
    <rect x={-10} y={-52} width={20} height={34} rx={6} />
    <rect x={-9} y={-20} width={7} height={22} rx={3} />
    <rect x={2} y={-20} width={7} height={22} rx={3} />
  </g>
);

const Back: React.FC<{t: number}> = ({t}) => (
  <svg width={1920} height={1080} style={{position: 'absolute'}}>
    {/* clouds */}
    {[[200, 120, 1], [1300, 90, 1.3], [1650, 200, 0.8]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x + t * 8} ${y}) scale(${s})`} fill={C.t1}>
        <ellipse cx={0} cy={0} rx={70} ry={26} />
        <ellipse cx={40} cy={-16} rx={44} ry={30} />
        <ellipse cx={-36} cy={-8} rx={34} ry={22} />
      </g>
    ))}
    {/* far crane */}
    <g stroke={C.t2} strokeWidth={8} fill="none">
      <path d="M 1500 640 L 1500 170 M 1300 190 L 1820 190 M 1500 170 L 1440 190 M 1500 170 L 1760 190 M 1720 190 L 1720 330" />
      <path d="M 1488 640 L 1500 200 L 1512 640" strokeWidth={3} />
    </g>
    <rect x={1708} y={330} width={24} height={30} fill={C.t2} />
  </svg>
);

const Mid: React.FC<{t: number}> = ({t}) => (
  <svg width={1920} height={1080} style={{position: 'absolute'}}>
    {/* building under construction */}
    <g transform="translate(760 250)">
      <rect x={0} y={0} width={900} height={420} fill={C.t1} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={0} y={r * 105} width={900} height={14} fill={C.t2} />
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <rect key={c} x={30 + c * 148} y={r * 105 + 30} width={110} height={60} rx={4} fill={r === 0 && c > 3 ? C.t1 : '#fff'} opacity={0.85} />
          ))}
        </g>
      ))}
      {/* scaffold */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={-10 + i * 152} y={-30} width={9} height={460} fill={C.t3} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-20} y={i * 105 + 92} width={940} height={8} fill={C.t3} />
      ))}
      <path d="M -10 92 L 142 197 M 142 92 L 294 197 M 446 197 L 598 302" stroke={C.t3} strokeWidth={5} />
    </g>
    {/* sign board like the reference's airport sign */}
    <g transform="translate(820 150)">
      <rect x={0} y={-6} width={8} height={110} fill={C.t3} />
      <rect x={420} y={-6} width={8} height={110} fill={C.t3} />
      <rect x={-20} y={-70} width={74} height={74} rx={14} fill={C.main} />
      <path d="M 17 -58 L 44 -12 L -10 -12 Z" fill="#fff" />
      <rect x={14} y={-46} width={6} height={18} rx={3} fill={C.main} />
      <circle cx={17} cy={-21} r={3.5} fill={C.main} />
      <rect x={66} y={-70} width={74} height={74} rx={14} fill={C.main} />
      <path d="M 82 -26 Q 82 -58 103 -58 Q 124 -58 124 -26 Z M 76 -26 L 130 -26 L 130 -20 L 76 -20 Z" fill="#fff" />
      <text x={160} y={-14} fontFamily={SANS} fontWeight={700} fontSize={58} fill={C.ink} letterSpacing={-1.5}>
        Site Safety
      </text>
    </g>
    {/* fence + ground */}
    <rect x={0} y={668} width={1920} height={412} fill={C.t1} />
    <rect x={0} y={660} width={1920} height={14} fill={C.t2} />
    {Array.from({length: 22}).map((_, i) => (
      <rect key={i} x={i * 92} y={600} width={10} height={64} fill={C.t2} />
    ))}
    <rect x={0} y={614} width={1920} height={10} fill={C.t2} />
    {/* background workers */}
    <Worker x={1230} y={664} s={1.1} c={C.t3} t={t} ph={0} />
    <Worker x={1290} y={664} s={1.05} c={C.t3} t={t} ph={2} />
    <Worker x={1760} y={664} s={1.15} c={C.t3} t={t} ph={4} />
  </svg>
);

const Front: React.FC<{t: number}> = ({t}) => (
  <svg width={1920} height={1080} style={{position: 'absolute'}}>
    {[[1560, 900, 1], [160, 960, 1.2]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={52} rx={58} ry={10} fill={C.t2} />
        <path d="M -44 50 L -12 -56 L 12 -56 L 44 50 Z" fill={C.main} />
        <path d="M -30 0 L 30 0 L 36 18 L -36 18 Z" fill="#fff" />
        <rect x={-54} y={44} width={108} height={12} rx={4} fill={C.t4} />
      </g>
    ))}
  </svg>
);

const ICONS: [string, React.ReactNode][] = [
  ['Helmet', <path key="h" d="M 8 30 Q 8 8 30 8 Q 52 8 52 30 Z M 2 30 L 58 30 L 58 37 L 2 37 Z" fill={C.main} />],
  ['Vest', <path key="v" d="M 14 6 L 24 6 L 30 18 L 36 6 L 46 6 L 52 54 L 8 54 Z M 10 34 L 50 34 L 50 40 L 10 40 Z" fill={C.main} />],
  ['Gloves', <path key="g" d="M 18 54 L 18 22 Q 18 16 23 16 L 23 8 Q 23 4 27 4 Q 31 4 31 8 L 31 6 Q 31 2 35 2 Q 39 2 39 6 L 39 10 Q 39 6 43 6 Q 47 6 47 10 L 47 36 Q 47 54 30 54 Z" fill={C.main} />],
  ['Boots', <path key="b" d="M 14 4 L 32 4 L 32 34 Q 52 36 56 48 L 56 56 L 10 56 L 10 8 Z" fill={C.main} />],
];

export const Tunde3DTest: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;
  const push = tw(t, [0, 5], [1, 1.12], EASE.inOut);
  const bub = pop(t, 1.2, 0.6);
  const fr = Math.min(150, Math.floor(t * 30) + 1);
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + (push - 1) * 0.4})`, transformOrigin: '40% 60%'}}>
        <Back t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${1 + (push - 1) * 0.75})`, transformOrigin: '40% 60%'}}>
        <Mid t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '40% 60%'}}>
        <Front t={t} />
        <div style={{position: 'absolute', left: 300, top: 1015, width: 300, height: 34, borderRadius: '50%', background: C.t2, filter: 'blur(2px)'}} />
        <Img src={staticFile(`tunde3d/talk_${String(fr).padStart(4, '0')}.png`)} style={{position: 'absolute', left: 90, top: 40, height: 1050}} />
        {/* pop-up bubble */}
        <div
          style={{
            position: 'absolute',
            left: 720,
            top: 260,
            width: 520,
            padding: '30px 34px',
            borderRadius: 36,
            background: '#fff',
            boxShadow: '0 26px 60px rgba(160,70,20,0.16)',
            transform: `scale(${bub})`,
            transformOrigin: '0% 100%',
            opacity: Math.min(1, bub * 2),
            fontFamily: SANS,
          }}
        >
          <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 2, color: C.main, marginBottom: 18}}>WEAR YOUR PPE</div>
          <div style={{display: 'flex', gap: 22}}>
            {ICONS.map(([n, ic], i) => {
              const q = pop(t, 1.6 + i * 0.28, 0.5);
              return (
                <div key={n} style={{textAlign: 'center', transform: `translateY(${(1 - q) * 20 + Math.sin(t * 2.4 + i) * 3}px) scale(${q})`, opacity: Math.min(1, q * 2)}}>
                  <div style={{width: 92, height: 92, borderRadius: 24, background: C.t1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width={60} height={60} viewBox="0 0 60 60">{ic}</svg>
                  </div>
                  <div style={{fontSize: 20, fontWeight: 600, color: C.ink, marginTop: 10, opacity: fade(t, 1.9 + i * 0.28)}}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
