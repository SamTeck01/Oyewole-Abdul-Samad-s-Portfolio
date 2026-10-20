// Cut-out puppet of the approved Tunde art (parts in public/tunde/parts). Each part hangs from its
// joint; angles are degrees from the drawn rest pose. Mouth + blink are vector overlays on the head.
import React from 'react';
import {Img, staticFile} from 'remotion';

type Part = {f: string; w: number; h: number; j: [number, number]; e?: [number, number]};
const PART: Record<string, Part> = {
  head: {f: 'p0', w: 222, h: 335, j: [111, 318]},
  torso: {f: 'p2', w: 301, h: 513, j: [150, 470]}, // pivot at hips
  uaL: {f: 'p1', w: 128, h: 355, j: [93, 33], e: [62, 327]},
  uaR: {f: 'p3', w: 125, h: 355, j: [36, 31], e: [66, 327]},
  fa: {f: 'p4', w: 95, h: 267, j: [42, 28], e: [50, 248]},
  hL: {f: 'p5', w: 144, h: 195, j: [68, 19]},
  hR: {f: 'p6', w: 146, h: 193, j: [86, 14]},
  thL: {f: 'p7', w: 130, h: 344, j: [71, 27], e: [51, 321]},
  thR: {f: 'p9', w: 121, h: 343, j: [58, 26], e: [68, 319]},
  shL: {f: 'p8', w: 138, h: 412, j: [84, 27]},
  shR: {f: 'p10', w: 143, h: 412, j: [54, 25]},
};
const NECK: [number, number] = [150, 12];
const SH_L: [number, number] = [44, 62];
const SH_R: [number, number] = [258, 62];
const HIP_L: [number, number] = [100, 455];
const HIP_R: [number, number] = [200, 455];
const SKIN = '#a05830';
const ARM = 0.68; // arm parts are drawn long; scale them to body proportions

export type PuppetPose = {
  lean: number;
  head: number;
  uaL: number;
  faL: number;
  hL: number;
  uaR: number;
  faR: number;
  hR: number;
  thL: number;
  shL: number;
  thR: number;
  shR: number;
  mouth: string; // Rhubarb A-H, X
  blink: number;
  bob?: number;
};

export const REST: PuppetPose = {lean: 0, head: 0, uaL: 0, faL: 0, hL: 0, uaR: 0, faR: 0, hR: 0, thL: 0, shL: 0, thR: 0, shR: 0, mouth: 'X', blink: 0};

const Bone: React.FC<{p: Part; at: [number, number]; rot: number; s?: number; flip?: boolean; children?: React.ReactNode; z?: number}> = ({p, at, rot, s = 1, flip, children}) => (
  <div style={{position: 'absolute', left: at[0], top: at[1], width: 0, height: 0, transform: `rotate(${rot}deg) scale(${s})`}}>
    <Img
      src={staticFile(`tunde/parts/${p.f}.png`)}
      style={{position: 'absolute', left: flip ? -(p.w - p.j[0]) : -p.j[0], top: -p.j[1], width: p.w, height: p.h, transform: flip ? 'scaleX(-1)' : undefined}}
    />
    {children ? <div style={{position: 'absolute', left: (p.e?.[0] ?? 0) - p.j[0], top: (p.e?.[1] ?? 0) - p.j[1]}}>{children}</div> : null}
  </div>
);

const Mouth: React.FC<{m: string}> = ({m}) => {
  const lip = '#5a2716';
  const inner = '#4a1410';
  const shapes: Record<string, React.ReactNode> = {
    A: <path d="M -16 0 Q 0 3 16 0" stroke={lip} strokeWidth={4} fill="none" strokeLinecap="round" />,
    B: <path d="M -15 -2 Q 0 -4 15 -2 Q 0 8 -15 -2 Z" fill={inner} stroke={lip} strokeWidth={2.5} />,
    C: <path d="M -17 -3 Q 0 -6 17 -3 Q 0 15 -17 -3 Z" fill={inner} stroke={lip} strokeWidth={2.5} />,
    D: (
      <g>
        <path d="M -19 -5 Q 0 -8 19 -5 Q 0 24 -19 -5 Z" fill={inner} stroke={lip} strokeWidth={2.5} />
        <path d="M -12 -4 Q 0 -6 12 -4 L 12 0 Q 0 -1 -12 0 Z" fill="#f4efe8" />
      </g>
    ),
    E: <ellipse cx={0} cy={3} rx={10} ry={11} fill={inner} stroke={lip} strokeWidth={2.5} />,
    F: <ellipse cx={0} cy={2} rx={7} ry={7} fill={inner} stroke={lip} strokeWidth={2.5} />,
    G: (
      <g>
        <path d="M -15 -2 Q 0 -5 15 -2 Q 0 9 -15 -2 Z" fill={inner} stroke={lip} strokeWidth={2.5} />
        <rect x={-10} y={-3} width={20} height={4} rx={2} fill="#f4efe8" />
      </g>
    ),
    H: (
      <g>
        <path d="M -17 -3 Q 0 -6 17 -3 Q 0 15 -17 -3 Z" fill={inner} stroke={lip} strokeWidth={2.5} />
        <ellipse cx={0} cy={5} rx={7} ry={3.5} fill="#c46a6a" />
      </g>
    ),
    X: <path d="M -18 -2 Q 0 8 18 -2" stroke={lip} strokeWidth={4} fill="none" strokeLinecap="round" />,
  };
  return <>{shapes[m] ?? shapes.X}</>;
};

const Face: React.FC<{mouth: string; blink: number}> = ({mouth, blink}) => (
  <svg width={222} height={335} style={{position: 'absolute', left: -PART.head.j[0], top: -PART.head.j[1], overflow: 'visible'}}>
    {/* cover the drawn mouth with skin, then draw the lip-sync shape */}
    <ellipse cx={111} cy={246} rx={30} ry={14} fill={SKIN} filter="url(#soft)" />
    <defs>
      <filter id="soft">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>
    <g transform="translate(111 246)">
      <Mouth m={mouth} />
    </g>
    {blink > 0.05 ? (
      <g fill={SKIN}>
        <ellipse cx={72} cy={178} rx={22} ry={17 * blink} />
        <ellipse cx={150} cy={178} rx={22} ry={17 * blink} />
        <path d={`M 52 ${178 + 2} q 20 ${8 * blink} 40 0 M 130 ${178 + 2} q 20 ${8 * blink} 40 0`} stroke="#2a1208" strokeWidth={3} fill="none" opacity={blink} />
      </g>
    ) : null}
  </svg>
);

/** Tunde, hips at (0,0) of the parent. ~1040 px tall at scale 1. */
export const Puppet: React.FC<{p: PuppetPose; scale?: number}> = ({p, scale = 1}) => {
  const T = PART.torso;
  const at = (pt: [number, number]): [number, number] => [pt[0] - T.j[0], pt[1] - T.j[1]];
  return (
    <div style={{position: 'absolute', width: 0, height: 0, transform: `scale(${scale}) translateY(${p.bob ?? 0}px)`}}>
      {/* legs */}
      <Bone p={PART.thR} at={[HIP_R[0] - T.j[0], 0]} rot={p.thR}>
        <Bone p={PART.shR} at={[0, 0]} rot={p.shR} />
      </Bone>
      <Bone p={PART.thL} at={[HIP_L[0] - T.j[0], 0]} rot={p.thL}>
        <Bone p={PART.shL} at={[0, 0]} rot={p.shL} />
      </Bone>
      <div style={{position: 'absolute', transform: `rotate(${p.lean}deg)`, transformOrigin: '0 0'}}>
        {/* upper arms behind the vest */}
        <Bone p={PART.uaR} at={at(SH_R)} rot={p.uaR} s={ARM} />
        <Bone p={PART.uaL} at={at(SH_L)} rot={p.uaL} s={ARM} />
        <Bone p={T} at={[0, 0]} rot={0} />
        <Bone p={PART.head} at={at(NECK)} rot={p.head}>
          <div style={{position: 'absolute', left: 0, top: 0}} />
        </Bone>
        <div style={{position: 'absolute', left: at(NECK)[0], top: at(NECK)[1], transform: `rotate(${p.head}deg)`}}>
          <Face mouth={p.mouth} blink={p.blink} />
        </div>
        {/* forearms + hands in front, chained through the upper arm */}
        <div style={{position: 'absolute', left: at(SH_L)[0], top: at(SH_L)[1], transform: `rotate(${p.uaL}deg) scale(${ARM})`}}>
          <Bone p={PART.fa} at={[PART.uaL.e![0] - PART.uaL.j[0], PART.uaL.e![1] - PART.uaL.j[1]]} rot={p.faL}>
            <Bone p={PART.hL} at={[0, 0]} rot={p.hL} />
          </Bone>
        </div>
        <div style={{position: 'absolute', left: at(SH_R)[0], top: at(SH_R)[1], transform: `rotate(${p.uaR}deg) scale(${ARM})`}}>
          <Bone p={PART.fa} at={[PART.uaR.e![0] - PART.uaR.j[0], PART.uaR.e![1] - PART.uaR.j[1]]} rot={p.faR} flip>
            <Bone p={PART.hR} at={[0, 0]} rot={p.hR} />
          </Bone>
        </div>
      </div>
    </div>
  );
};
