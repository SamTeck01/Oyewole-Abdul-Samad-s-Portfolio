// Glow-UI building blocks seen across the references (05 Opal, 06 Qwix, 15 Rerun).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {EASE, tw} from './core';
import {SANS} from './fonts';

// ---------- backgrounds ----------
export const DarkGlow: React.FC<{
  base?: string;
  glow?: string;
  x?: number; // 0..100 %
  y?: number;
  size?: number; // % of width
  strength?: number;
}> = ({base = '#09090c', glow = '#8b7bd8', x = 50, y = -8, size = 70, strength = 0.35}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(${size}% ${size * 0.8}% at ${x}% ${y}%, ${hexA(glow, strength)} 0%, ${hexA(
        glow,
        strength * 0.25,
      )} 40%, transparent 72%), ${base}`,
    }}
  />
);

export const LightBlobs: React.FC<{f: number; base?: string; colors?: string[]}> = ({
  f,
  base = '#f4f6fb',
  colors = ['#bcd6ff', '#d9e7ff', '#a9c8ff', '#e6efff'],
}) => (
  <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
    {colors.map((c, i) => {
      const t = f / 240 + i * 1.7;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: c,
            filter: 'blur(160px)',
            opacity: 0.85,
            left: `${[5, 55, 70, 20][i] + Math.sin(t) * 6}%`,
            top: `${[-30, -40, 50, 60][i] + Math.cos(t * 0.8) * 6}%`,
            transform: 'translate(-50%,-50%)',
          }}
        />
      );
    })}
  </AbsoluteFill>
);

export function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// ---------- icons (stroke style, 24px grid) ----------
export const Icon: React.FC<{name: string; size?: number; color?: string; stroke?: number}> = ({
  name,
  size = 32,
  color = 'currentColor',
  stroke = 2,
}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const solid = {fill: color, stroke: 'none'};
  const g: Record<string, React.ReactNode> = {
    moon: <path {...solid} d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />,
    hourglass: (
      <g>
        <path {...p} d="M6 3h12M6 21h12" />
        <path {...solid} d="M7 4h10c0 4-5 6-5 8 0-2-5-4-5-8Zm5 8c0 2 5 4 5 8H7c0-4 5-6 5-8Z" />
      </g>
    ),
    cloud: <path {...solid} d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5 1.2A3.9 3.9 0 0 1 17.5 18Z" />,
    lock: (
      <g>
        <rect {...solid} x="4.5" y="10.5" width="15" height="11" rx="2.5" />
        <path {...p} strokeWidth={2.4} d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      </g>
    ),
    unlock: (
      <g>
        <rect {...solid} x="4.5" y="10.5" width="15" height="11" rx="2.5" />
        <path {...p} strokeWidth={2.4} d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7" />
      </g>
    ),
    calendar: (
      <g>
        <rect {...p} x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path {...p} d="M3.5 10h17M8 3v4M16 3v4M8 14h1M12 14h1M16 14h1M8 17h1M12 17h1" />
      </g>
    ),
    shield: <path {...solid} d="M12 2.5 4.5 5.5v6c0 5 3.2 8.6 7.5 10 4.3-1.4 7.5-5 7.5-10v-6Z" />,
    play: <path {...solid} d="M8 5.5v13l10.5-6.5Z" />,
    arrow: <path {...p} d="M5 12h13M13 6l6 6-6 6" />,
    chevron: <path {...p} d="m9 6 6 6-6 6" />,
    tri: <path {...solid} d="M12 5 20 18H4Z" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', color}}>
      {g[name]}
    </svg>
  );
};

// ---------- rounded-rect path (starts top-centre, clockwise) for progress rings on pills ----------
export const pillPath = (w: number, h: number, inset = 0) => {
  const r = (h - inset * 2) / 2;
  const x0 = inset,
    y0 = inset,
    x1 = w - inset,
    y1 = h - inset,
    cx = w / 2;
  return [
    `M ${cx} ${y0}`,
    `L ${x1 - r} ${y0}`,
    `A ${r} ${r} 0 0 1 ${x1 - r} ${y1}`,
    `L ${x0 + r} ${y1}`,
    `A ${r} ${r} 0 0 1 ${x0 + r} ${y0}`,
    `Z`,
  ].join(' ');
};

/** Pill with grey outline track + glowing white progress arc, icon + number (05/06 stat pill). */
export const StatPill: React.FC<{
  value: number;
  max?: number;
  icon: string;
  width?: number;
  height?: number;
  accent?: string;
  label?: string;
  labelOpacity?: number;
}> = ({value, max = 100, icon, width = 270, height = 128, accent = '#efeaff', label, labelOpacity = 1}) => {
  const d = pillPath(width, height, 4);
  const arc = evolvePath(Math.max(0.0001, Math.min(1, value / max)), d);
  return (
    <div style={{position: 'relative', width, height: height + (label ? 80 : 0)}}>
      <svg width={width} height={height} style={{position: 'absolute', overflow: 'visible'}}>
        <defs>
          <filter id="arcglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={d} fill="rgba(18,17,24,0.92)" stroke="rgba(160,155,180,0.38)" strokeWidth={5} />
        <path
          d={d}
          fill="none"
          stroke={accent}
          strokeWidth={6.5}
          strokeLinecap="round"
          strokeDasharray={arc.strokeDasharray}
          strokeDashoffset={arc.strokeDashoffset}
          filter="url(#arcglow)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          color: accent,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: height * 0.4,
          letterSpacing: -0.5,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <Icon name={icon} size={height * 0.32} color={accent} />
        <span>{Math.round(value)}</span>
      </div>
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: height + 22,
            width,
            textAlign: 'center',
            color: '#cfcbe0',
            fontFamily: SANS,
            fontSize: 40,
            fontWeight: 500,
            opacity: labelOpacity,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** count-up value for a frame window, using the measured slow-fast-tail curve */
export const countUp = (f: number, a: number, b: number, from: number, to: number) =>
  tw(f, [a, b], [from, to], EASE.count);

/** Glass pill CTA with a moving sheen (05 "Start", 06 "Try", 15 "7 Days Free Trial"). */
export const SheenButton: React.FC<{
  label: string;
  icon?: string;
  sheen: number; // 0..1 sweep progress
  press?: number; // 0..1
  width?: number;
  height?: number;
  tint?: string;
}> = ({label, icon, sheen, press = 0, width = 760, height = 150, tint = '#b7a6ff'}) => {
  const s = 1 - press * 0.05;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: height / 2,
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${s})`,
        background: `linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03)), linear-gradient(90deg, ${hexA(
          tint,
          0.18,
        )}, ${hexA(tint, 0.32)} 50%, ${hexA(tint, 0.18)})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 0 2px rgba(255,255,255,0.10), 0 30px 80px ${hexA(tint, 0.25)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        color: '#fff',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: height * 0.3,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -40,
          bottom: -40,
          width: width * 0.45,
          left: -width * 0.5 + sheen * width * 1.6,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
          filter: 'blur(26px)',
          mixBlendMode: 'screen',
          transform: 'skewX(-18deg)',
        }}
      />
      {icon ? <Icon name={icon} size={height * 0.26} color="#fff" /> : null}
      <span style={{position: 'relative'}}>{label}</span>
    </div>
  );
};
