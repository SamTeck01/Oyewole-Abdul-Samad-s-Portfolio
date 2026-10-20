// Rigged 2D character (flat-modern explainer style). Bones are nested SVG groups, so a pose is just
// angles; secondary motion (head lag, breathing, blink) and Rhubarb lip-sync shapes are built in.
import React from 'react';

export type Pose = {
  x: number; // hip x in scene px
  y: number; // hip y
  lean: number; // torso deg
  head: number; // head deg
  lShoulder: number; // deg, 0 = hanging down, + = forward/outward
  lElbow: number;
  rShoulder: number;
  rElbow: number;
  lHip: number;
  lKnee: number;
  rHip: number;
  rKnee: number;
  blink: number; // 0 open .. 1 closed
  mouth: string; // Rhubarb shape A-H, X
  look: number; // eye offset -1..1
  hand?: 'open' | 'point' | 'thumb';
};

export const C = {
  skin: '#8a5a3c',
  skinDark: '#6c4430',
  skinLight: '#a46d4b',
  shirt: '#24324d',
  shirtDark: '#1a253a',
  vest: '#ff7a1a',
  vestDark: '#e3600a',
  strip: '#e9eef3',
  pants: '#3a404c',
  pantsDark: '#2c313b',
  boot: '#2a1d16',
  helmet: '#ffc21a',
  helmetDark: '#e2a300',
  helmetLight: '#ffe07a',
  line: '#1d1410',
};

/** a limb segment hanging down from its joint, children attach at its end */
const Seg: React.FC<{len: number; w: number; w2?: number; angle: number; fill: string; shade?: string; children?: React.ReactNode}> = ({
  len,
  w,
  w2 = w,
  angle,
  fill,
  shade,
  children,
}) => (
  <g transform={`rotate(${angle})`}>
    <path d={`M ${-w / 2} 0 L ${-w2 / 2} ${len} A ${w2 / 2} ${w2 / 2} 0 0 0 ${w2 / 2} ${len} L ${w / 2} 0 A ${w / 2} ${w / 2} 0 0 0 ${-w / 2} 0 Z`} fill={fill} />
    {shade ? <path d={`M ${w / 2 - w * 0.32} 0 L ${w2 / 2 - w2 * 0.32} ${len} A ${w2 / 2} ${w2 / 2} 0 0 0 ${w2 / 2} ${len} L ${w / 2} 0 Z`} fill={shade} opacity={0.9} /> : null}
    <g transform={`translate(0 ${len})`}>{children}</g>
  </g>
);

const Hand: React.FC<{kind?: string}> = ({kind = 'open'}) => (
  <g>
    <ellipse cx={0} cy={18} rx={21} ry={24} fill={C.skin} />
    <ellipse cx={7} cy={20} rx={9} ry={18} fill={C.skinDark} opacity={0.6} />
    {kind === 'point' ? <rect x={-6} y={30} width={12} height={36} rx={6} fill={C.skin} /> : null}
    {kind === 'thumb' ? <rect x={-26} y={-6} width={12} height={30} rx={6} fill={C.skin} transform="rotate(-25 -20 10)" /> : null}
  </g>
);

const Boot: React.FC = () => (
  <g>
    <path d="M -24 -6 L 22 -6 Q 52 2 54 26 L -26 26 Z" fill={C.boot} />
    <rect x={-28} y={22} width={84} height={9} rx={4} fill="#120c09" />
  </g>
);

const Mouth: React.FC<{m: string}> = ({m}) => {
  const lip = '#3b1f17';
  const inner = '#5a1e1e';
  switch (m) {
    case 'A':
      return <path d="M -16 0 Q 0 3 16 0" stroke={lip} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case 'B':
      return <path d="M -15 -2 Q 0 -4 15 -2 Q 0 9 -15 -2 Z" fill={inner} stroke={lip} strokeWidth={3} />;
    case 'C':
      return <path d="M -17 -4 Q 0 -7 17 -4 Q 0 16 -17 -4 Z" fill={inner} stroke={lip} strokeWidth={3} />;
    case 'D':
      return (
        <g>
          <path d="M -19 -6 Q 0 -9 19 -6 Q 0 26 -19 -6 Z" fill={inner} stroke={lip} strokeWidth={3} />
          <path d="M -9 9 Q 0 15 9 9" fill="#c46a6a" />
        </g>
      );
    case 'E':
      return <ellipse cx={0} cy={3} rx={10} ry={12} fill={inner} stroke={lip} strokeWidth={3} />;
    case 'F':
      return <ellipse cx={0} cy={2} rx={7} ry={8} fill={inner} stroke={lip} strokeWidth={3} />;
    case 'G':
      return (
        <g>
          <path d="M -15 -2 Q 0 -5 15 -2 Q 0 10 -15 -2 Z" fill={inner} stroke={lip} strokeWidth={3} />
          <rect x={-10} y={-3} width={20} height={5} rx={2} fill="#f4efe8" />
        </g>
      );
    case 'H':
      return (
        <g>
          <path d="M -17 -4 Q 0 -7 17 -4 Q 0 16 -17 -4 Z" fill={inner} stroke={lip} strokeWidth={3} />
          <ellipse cx={0} cy={5} rx={8} ry={4} fill="#c46a6a" />
        </g>
      );
    default:
      return <path d="M -15 -1 Q 0 7 15 -1" stroke={lip} strokeWidth={5} fill="none" strokeLinecap="round" />;
  }
};

const Head: React.FC<{p: Pose}> = ({p}) => {
  const eh = 9 * (1 - p.blink) + 1;
  return (
    <g>
      {/* neck */}
      <rect x={-20} y={-10} width={40} height={40} rx={12} fill={C.skinDark} />
      <g transform="translate(0 -78)">
        <ellipse cx={0} cy={0} rx={72} ry={84} fill={C.skin} />
        <path d="M 30 -76 A 72 84 0 0 1 30 76 A 60 84 0 0 0 30 -76 Z" fill={C.skinDark} opacity={0.55} />
        <ellipse cx={-70} cy={8} rx={12} ry={18} fill={C.skin} />
        <ellipse cx={70} cy={8} rx={12} ry={18} fill={C.skinDark} />
        {/* brows, eyes */}
        <path d="M -42 -26 Q -28 -34 -14 -27" stroke={C.line} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M 14 -27 Q 28 -34 42 -26" stroke={C.line} strokeWidth={6} fill="none" strokeLinecap="round" />
        <ellipse cx={-28 + p.look * 4} cy={-6} rx={7} ry={eh} fill={C.line} />
        <ellipse cx={28 + p.look * 4} cy={-6} rx={7} ry={eh} fill={C.line} />
        {/* nose, beard shadow */}
        <path d="M 2 4 Q 12 22 0 26" stroke={C.skinDark} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M -40 34 Q 0 74 40 34 Q 30 70 0 72 Q -30 70 -40 34 Z" fill={C.skinDark} opacity={0.35} />
        <g transform="translate(0 46)">
          <Mouth m={p.mouth} />
        </g>
        {/* hard hat */}
        <g transform="translate(0 -46)">
          <path d="M -82 8 Q -80 -70 0 -74 Q 80 -70 82 8 Z" fill={C.helmet} />
          <path d="M 20 -72 Q 78 -62 82 8 L 46 8 Q 46 -50 20 -72 Z" fill={C.helmetDark} />
          <path d="M -8 -74 L 8 -74 L 10 8 L -10 8 Z" fill={C.helmetLight} opacity={0.8} />
          <path d="M -50 -52 Q -40 -66 -22 -70" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55} />
          <rect x={-100} y={2} width={200} height={16} rx={8} fill={C.helmetDark} />
        </g>
      </g>
    </g>
  );
};

/** full worker. Draw order: far arm/leg, body, near leg, near arm. */
export const Worker: React.FC<{p: Pose; scale?: number; farFront?: boolean}> = ({p, scale = 1, farFront = false}) => {
  const farArm = (
    <g transform={`rotate(${p.lean}) translate(62 -268)`}>
      <Seg len={135} w={42} w2={36} angle={-p.rShoulder} fill={C.vestDark}>
        <Seg len={120} w={34} w2={30} angle={-p.rElbow} fill={C.skinDark}>
          <Hand kind={p.hand === 'thumb' ? 'thumb' : 'open'} />
        </Seg>
      </Seg>
    </g>
  );
  return (
  <g transform={`translate(${p.x} ${p.y}) scale(${scale})`}>
    {/* contact shadow */}
    <ellipse cx={0} cy={330} rx={140} ry={16} fill="rgba(40,20,10,0.18)" />
    {/* far leg */}
    <g transform="translate(18 0)">
      <Seg len={170} w={60} w2={50} angle={p.rHip} fill={C.pantsDark}>
        <Seg len={150} w={50} w2={44} angle={p.rKnee} fill={C.pantsDark}>
          <g transform={`rotate(${-p.rHip - p.rKnee})`}>
            <Boot />
          </g>
        </Seg>
      </Seg>
    </g>
    {farFront ? null : farArm}
    {/* torso */}
    <g transform={`rotate(${p.lean})`}>
      <path d="M -78 -290 Q -92 -150 -66 0 L 66 0 Q 92 -150 78 -290 Q 0 -310 -78 -290 Z" fill={C.shirt} />
      {/* vest */}
      <path d="M -82 -280 Q -94 -150 -70 -10 L -14 -10 L -10 -270 Q -50 -290 -82 -280 Z" fill={C.vest} />
      <path d="M 82 -280 Q 94 -150 70 -10 L 14 -10 L 10 -270 Q 50 -290 82 -280 Z" fill={C.vestDark} />
      <rect x={-86} y={-130} width={74} height={16} fill={C.strip} />
      <rect x={12} y={-130} width={74} height={16} fill="#c9d1d8" />
      <rect x={-88} y={-70} width={76} height={16} fill={C.strip} />
      <rect x={12} y={-70} width={76} height={16} fill="#c9d1d8" />
      <rect x={-70} y={-12} width={140} height={22} rx={6} fill="#2b2b2b" />
      <g transform={`translate(0 -300) rotate(${p.head - p.lean * 0.4})`}>
        <Head p={p} />
      </g>
    </g>
    {/* near leg */}
    <g transform="translate(-22 0)">
      <Seg len={170} w={62} w2={52} angle={p.lHip} fill={C.pants} shade={C.pantsDark}>
        <Seg len={150} w={52} w2={46} angle={p.lKnee} fill={C.pants} shade={C.pantsDark}>
          <g transform={`rotate(${-p.lHip - p.lKnee})`}>
            <Boot />
          </g>
        </Seg>
      </Seg>
    </g>
    {/* near arm */}
    <g transform={`rotate(${p.lean}) translate(-66 -268)`}>
      <Seg len={135} w={44} w2={38} angle={p.lShoulder} fill={C.vest} shade={C.vestDark}>
        <Seg len={120} w={36} w2={32} angle={p.lElbow} fill={C.skin} shade={C.skinDark}>
          <Hand kind={p.hand} />
        </Seg>
      </Seg>
    </g>
    {farFront ? farArm : null}
  </g>
  );
};
