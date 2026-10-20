// Hand-drawn flat 2D scenes (vector, no AI art). Each scene is split into parallax layers so the
// camera can drift through it; `cam` is a horizontal camera offset in px.
import React from 'react';
import {Icon} from './ui';

const P = {
  sky1: '#ffe2b8',
  sky2: '#fff3e0',
  sun: '#ffd27a',
  far: '#f1c9a0',
  mid: '#e3ad7f',
  ground1: '#e2c29b',
  ground2: '#d2ad82',
  concrete: '#c9c2b8',
  concreteDark: '#a99f93',
  steel: '#5d6b7a',
  crane: '#f2b01e',
  craneDark: '#c98a0c',
  orange: '#ff7a1a',
  white: '#fbf7f1',
  ink: '#2b2420',
};

const Layer: React.FC<{cam: number; depth: number; children: React.ReactNode}> = ({cam, depth, children}) => (
  <g transform={`translate(${-cam * depth} 0)`}>{children}</g>
);

const Cloud: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 0.9}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={o}>
    <ellipse cx={0} cy={0} rx={90} ry={34} />
    <ellipse cx={-50} cy={8} rx={60} ry={26} />
    <ellipse cx={55} cy={10} rx={70} ry={24} />
    <ellipse cx={10} cy={-22} rx={50} ry={32} />
  </g>
);

/** lattice tower crane */
const Crane: React.FC<{x: number; base: number; h: number; jib: number; t: number}> = ({x, base, h, jib, t}) => {
  const top = base - h;
  const hook = 160 + Math.sin(t * 0.8) * 30;
  const lat = [];
  for (let y = base; y > top + 30; y -= 40) lat.push(<path key={y} d={`M ${x - 18} ${y} L ${x + 18} ${y - 40} M ${x + 18} ${y} L ${x - 18} ${y - 40}`} />);
  const jl = [];
  for (let i = -jib * 0.3; i < jib; i += 46) jl.push(<path key={i} d={`M ${x + i} ${top} L ${x + i + 23} ${top - 26} L ${x + i + 46} ${top}`} />);
  return (
    <g>
      <g stroke={P.crane} strokeWidth={5} fill="none">
        <path d={`M ${x - 18} ${base} L ${x - 18} ${top} M ${x + 18} ${base} L ${x + 18} ${top}`} strokeWidth={8} />
        {lat}
        <path d={`M ${x - jib * 0.3} ${top} L ${x + jib} ${top} M ${x - jib * 0.3} ${top - 26} L ${x + jib} ${top - 26}`} strokeWidth={6} />
        {jl}
        <path d={`M ${x} ${top - 26} L ${x} ${top - 90} L ${x + jib * 0.8} ${top - 26} M ${x} ${top - 90} L ${x - jib * 0.3} ${top - 26}`} stroke={P.craneDark} strokeWidth={4} />
      </g>
      <rect x={x - jib * 0.3 - 10} y={top - 10} width={70} height={46} fill={P.concreteDark} />
      <rect x={x + 24} y={top + 4} width={50} height={40} rx={6} fill={P.craneDark} />
      <rect x={x + 34} y={top + 12} width={26} height={16} rx={3} fill="#bfe3f2" />
      {/* trolley + hook + load */}
      <g transform={`translate(${x + jib * 0.62} ${top})`}>
        <rect x={-14} y={-6} width={28} height={12} fill={P.steel} />
        <path d={`M 0 6 L 0 ${hook}`} stroke={P.ink} strokeWidth={3} />
        <path d={`M -6 ${hook} q 6 18 12 0`} stroke={P.ink} strokeWidth={5} fill="none" />
        <g transform={`translate(0 ${hook + 18}) rotate(${Math.sin(t * 0.8 + 1) * 2})`}>
          <path d="M -40 0 L 0 -16 L 40 0" stroke={P.ink} strokeWidth={2} fill="none" />
          <rect x={-60} y={0} width={120} height={14} fill={P.steel} />
          <rect x={-60} y={14} width={120} height={14} fill="#4a5664" />
        </g>
      </g>
    </g>
  );
};

/** concrete frame building under construction */
const Building: React.FC<{x: number; base: number; floors: number; w: number}> = ({x, base, floors, w}) => {
  const fh = 92;
  const els = [];
  for (let i = 0; i < floors; i++) {
    const y = base - (i + 1) * fh;
    const done = i < floors - 1;
    els.push(
      <g key={i}>
        {done ? <rect x={x} y={y} width={w} height={fh} fill="#efe6da" /> : null}
        {done
          ? [0, 1, 2, 3].map((k) => <rect key={k} x={x + 24 + k * ((w - 48) / 4)} y={y + 22} width={(w - 48) / 4 - 22} height={fh - 40} fill={i % 2 ? '#9fc6d8' : '#b7d5e3'} />)
          : null}
        <rect x={x - 8} y={y} width={w + 16} height={12} fill={P.concrete} />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x={x + k * ((w - 18) / 4)} y={y + 12} width={18} height={fh - 12} fill={done ? P.concreteDark : P.concrete} />
        ))}
      </g>,
    );
  }
  // scaffold on the right side
  const sx = x + w + 14;
  const sc = [];
  for (let i = 0; i <= floors; i++) sc.push(<rect key={'h' + i} x={sx} y={base - i * fh - 6} width={70} height={7} fill={P.steel} />);
  return (
    <g>
      <rect x={x - 8} y={base - 12} width={w + 16} height={12} fill={P.concreteDark} />
      {els}
      {sc}
      <rect x={sx} y={base - floors * fh} width={7} height={floors * fh} fill={P.steel} />
      <rect x={sx + 63} y={base - floors * fh} width={7} height={floors * fh} fill={P.steel} />
      {/* rebar sticking out of the top */}
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M ${x + 9 + k * ((w - 18) / 4)} ${base - floors * fh} l 0 -36`} stroke="#7b4b2a" strokeWidth={4} />
      ))}
      {/* safety net */}
      <rect x={x - 8} y={base - floors * fh - 20} width={w + 16} height={30} fill="#3fa36b" opacity={0.35} />
    </g>
  );
};

const Cone: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={56} ry={10} fill="rgba(90,50,20,0.16)" />
    <path d="M -42 0 L -12 -100 L 12 -100 L 42 0 Z" fill={P.orange} />
    <path d="M 4 -100 L 12 -100 L 42 0 L 18 0 Z" fill="#e0600c" />
    <path d="M -29 -44 L 29 -44 L 34 -26 L -34 -26 Z" fill={P.white} />
    <rect x={-52} y={-8} width={104} height={12} rx={4} fill="#d4500a" />
  </g>
);

const Barrier: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-70} width={w} height={26} rx={4} fill={P.white} />
    {Array.from({length: Math.floor(w / 40)}, (_, i) => (
      <path key={i} d={`M ${i * 40 + 6} -70 l 20 0 l -16 26 l -20 0 Z`} fill="#e63b2e" />
    ))}
    <rect x={10} y={-44} width={10} height={44} fill={P.steel} />
    <rect x={w - 20} y={-44} width={10} height={44} fill={P.steel} />
  </g>
);

const NoticeBoard: React.FC<{x: number; y: number; hi?: number}> = ({x, y, hi = 0}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={30} y={0} width={10} height={140} fill={P.steel} />
    <rect x={250} y={0} width={10} height={140} fill={P.steel} />
    <rect x={0} y={-170} width={290} height={190} rx={10} fill="#1f5fa8" />
    <rect x={12} y={-158} width={266} height={30} rx={4} fill="#fff" opacity={0.95} />
    <rect x={30} y={-150} width={150} height={14} rx={3} fill="#1f5fa8" opacity={0.5} />
    {['shield', 'bolt', 'flame', 'drop', 'steps', 'heart'].map((ic, i) => (
      <g key={i} transform={`translate(${24 + (i % 3) * 86} ${-112 + Math.floor(i / 3) * 62})`}>
        <circle cx={28} cy={26} r={26} fill={i === 0 ? '#2b9a5a' : i < 3 ? '#f2b01e' : '#e63b2e'} stroke="#fff" strokeWidth={hi * 6} />
        <g transform="translate(14 12)">
          <Icon name={ic} size={28} color="#fff" />
        </g>
      </g>
    ))}
  </g>
);

const MaterialPile: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={90} cy={6} rx={130} ry={14} fill="rgba(90,50,20,0.14)" />
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3].slice(r).map((k) => <circle key={r + '' + k} cx={30 + k * 46 + r * 23} cy={-22 - r * 40} r={22} fill={r % 2 ? '#8b939d' : '#9aa3ad'} stroke="#6f7781" strokeWidth={4} />),
    )}
    <rect x={190} y={-60} width={120} height={60} fill="#c08a52" />
    <rect x={190} y={-60} width={120} height={8} fill="#a8733f" />
    <rect x={190} y={-30} width={120} height={6} fill="#a8733f" />
  </g>
);

/** construction site at morning light */
export const SiteScene: React.FC<{t: number; cam?: number; boardHi?: number}> = ({t, cam = 0, boardHi = 0}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={P.sky1} />
        <stop offset="0.7" stopColor={P.sky2} />
      </linearGradient>
      <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={P.ground1} />
        <stop offset="1" stopColor={P.ground2} />
      </linearGradient>
      <radialGradient id="sunglow">
        <stop offset="0" stopColor="#fff2c9" />
        <stop offset="1" stopColor="#fff2c9" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#sky)" />
    <circle cx={1500 - cam * 0.05} cy={250} r={300} fill="url(#sunglow)" />
    <circle cx={1500 - cam * 0.05} cy={250} r={90} fill={P.sun} />
    <Layer cam={cam} depth={0.1}>
      <Cloud x={300 + t * 6} y={170} s={1.1} />
      <Cloud x={1050 + t * 4} y={120} s={0.8} o={0.75} />
      <Cloud x={1750 + t * 5} y={210} s={0.9} />
    </Layer>
    <Layer cam={cam} depth={0.2}>
      <g fill={P.far}>
        {[[-40, 140], [90, 230], [200, 170], [330, 280], [470, 200], [1240, 260], [1380, 190], [1530, 300], [1700, 220], [1850, 160], [2000, 240]].map(([x, h], i) => (
          <rect key={i} x={x} y={680 - h} width={i % 2 ? 110 : 130} height={h} />
        ))}
      </g>
    </Layer>
    <Layer cam={cam} depth={0.4}>
      <Crane x={1180} base={690} h={520} jib={620} t={t} />
    </Layer>
    <Layer cam={cam} depth={0.55}>
      <Building x={1260} base={700} floors={5} w={460} />
    </Layer>
    <rect x={0} y={680} width={1920} height={400} fill="url(#gr)" />
    <Layer cam={cam} depth={0.7}>
      {/* tyre tracks */}
      <path d="M -100 900 C 400 820, 900 860, 2100 780" stroke="#c99f72" strokeWidth={26} fill="none" opacity={0.5} />
      <path d="M -100 960 C 420 880, 920 920, 2100 840" stroke="#c99f72" strokeWidth={26} fill="none" opacity={0.5} />
      <MaterialPile x={120} y={760} />
      <Barrier x={1060} y={760} w={240} />
      <NoticeBoard x={700} y={700} hi={boardHi} />
    </Layer>
    <Layer cam={cam} depth={1.0}>
      <Cone x={1560} y={940} s={1} />
      <Cone x={1760} y={980} s={1.15} />
    </Layer>
  </svg>
);
