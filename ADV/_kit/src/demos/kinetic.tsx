// Always-moving camera with punch-ins and whip blur on cuts (makes slow scenes feel kinetic).
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const Kinetic: React.FC<{cuts: number[]; children: React.ReactNode; amp?: number}> = ({cuts, children, amp = 1.4}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const u = Math.min(width, height) / 1080;
  let sc = 1.035 + Math.sin(f / 47) * 0.012 * amp;
  let rot = Math.sin(f / 71) * 0.7 * amp;
  let tx = Math.sin(f / 53) * 14 * u * amp;
  let ty = Math.cos(f / 61) * 10 * u * amp;
  let blur = 0;
  cuts.forEach((c, i) => {
    const C = Math.round(c * 60);
    const dir = i % 2 ? 1 : -1;
    const d = f - C;
    if (d >= 0 && d < 30) {
      const k = Math.exp(-d / 6);
      sc += 0.1 * k * amp;
      rot += dir * 3 * k * amp;
      tx += dir * 60 * u * k * amp;
      blur += 8 * k;
    }
    if (d < 0 && d > -8) {
      const k = Math.pow((8 + d) / 8, 2);
      tx -= dir * 110 * u * k * amp;
      sc += 0.04 * k;
      blur += 10 * k;
    }
  });
  return (
    <AbsoluteFill style={{transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${sc})`, filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};
