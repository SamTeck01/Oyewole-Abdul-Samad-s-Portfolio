// Line shapes that draw on (bracket connector, connector paths).
import React from 'react';
import {evolvePath} from '@remotion/paths';

/** Curly bracket that joins three items below to one total above (ref 05/06), drawn from the
 * outer ends toward the centre stem. progress 0..1 */
export const Bracket: React.FC<{width: number; height: number; progress: number; color?: string; stroke?: number}> = ({
  width: w,
  height: h,
  progress,
  color = '#fff',
  stroke = 5,
}) => {
  const r = 26,
    mid = w / 2,
    y = h * 0.55;
  const left = `M 4 ${h} Q 4 ${y} ${4 + r} ${y} L ${mid - r} ${y} Q ${mid} ${y} ${mid} ${y - r}`;
  const right = `M ${w - 4} ${h} Q ${w - 4} ${y} ${w - 4 - r} ${y} L ${mid + r} ${y} Q ${mid} ${y} ${mid} ${y - r}`;
  const stem = `M ${mid} ${y - r} L ${mid} 4`;
  const a = evolvePath(Math.min(1, progress / 0.8), left);
  const b = evolvePath(Math.min(1, progress / 0.8), right);
  const c = evolvePath(Math.max(0, (progress - 0.8) / 0.2), stem);
  const common = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, style: {filter: `drop-shadow(0 0 8px ${color})`}};
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <path d={left} {...common} strokeDasharray={a.strokeDasharray} strokeDashoffset={a.strokeDashoffset} />
      <path d={right} {...common} strokeDasharray={b.strokeDasharray} strokeDashoffset={b.strokeDashoffset} />
      <path d={stem} {...common} strokeDasharray={c.strokeDasharray} strokeDashoffset={c.strokeDashoffset} />
    </svg>
  );
};

/** Any SVG path that draws on, with an optional glowing pulse head (ref 03 strands, 15 circuit traces). */
export const DrawPath: React.FC<{d: string; progress: number; color?: string; stroke?: number; head?: boolean; w: number; h: number}> = ({
  d,
  progress,
  color = '#fff',
  stroke = 3,
  head = true,
  w,
  h,
}) => {
  const e = evolvePath(Math.max(0.0001, progress), d);
  return (
    <svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
      {head && progress > 0 && progress < 1 ? (
        <path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke * 2.2}
          strokeLinecap="round"
          style={{filter: `drop-shadow(0 0 10px ${color})`}}
          strokeDasharray={`0.001 ${1e5}`}
          strokeDashoffset={-(parseFloat(String(e.strokeDasharray).split(' ')[0]) - Number(e.strokeDashoffset))}
        />
      ) : null}
    </svg>
  );
};
