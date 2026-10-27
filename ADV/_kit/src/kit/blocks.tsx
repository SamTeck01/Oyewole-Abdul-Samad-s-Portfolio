// UI / data / 2.5D layout blocks measured from the 20 reference clips (deep/01-20.md).
// Every block is a pure function of a LOCAL frame `f` (60 fps) so it can sit inside any
// <Sequence>; timings in the comments are the reference's, already converted to 60 fps.
// Extends ui.tsx / shapes.tsx (StatPill, Bracket, DrawPath, Icon, hexA) rather than duplicating them.
import React from 'react';
import {AbsoluteFill, Img, interpolateColors, random} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {EASE, lerp, prog, tw} from './core';
import {SANS} from './fonts';
import {Icon, StatPill, countUp, hexA} from './ui';
import {Bracket} from './shapes';

type XY = {x: number; y: number};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** back-out pop 0 -> 1.1 -> 1 over `dur` frames (the "pop" used in 09/12/13/20) */
export const pop = (f: number, start: number, dur = 10) =>
  tw(f, [start, start + dur * 0.6, start + dur], [0, 1.1, 1], EASE.out);

/** blur-in helper: opacity, blur(px) and y for a standard "blur to sharp" entrance */
export const blurIn = (f: number, start: number, dur = 12, dy = 16) => {
  const p = prog(f, start, start + dur);
  return {opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * dy}px)`};
};

/** Deterministic placeholder thumbnail (gradient) when no image src is given. */
export const thumbBg = (i: number, hue0 = 210) => {
  const h = (hue0 + i * 47) % 360;
  return `linear-gradient(${135 + i * 20}deg, hsl(${h} 70% 62%), hsl(${(h + 40) % 360} 60% 38%))`;
};

/** A card face: real image if `src`, otherwise gradient placeholder. */
export const Thumb: React.FC<{i: number; w: number; h: number; src?: string; radius?: number; style?: React.CSSProperties}> = ({
  i,
  w,
  h,
  src,
  radius = 14,
  style,
}) => (
  <div style={{width: w, height: h, borderRadius: radius, overflow: 'hidden', background: thumbBg(i), boxShadow: '0 12px 30px rgba(0,0,0,0.28)', ...style}}>
    {src ? <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  </div>
);

/** Slot for the macOS cursor (src/kit/cursor.tsx when it exists). Renders `cursor` at x,y, clicking scales 1->0.85->1. */
export const CursorSlot: React.FC<{x: number; y: number; click?: number; cursor?: React.ReactNode}> = ({x, y, click = 0, cursor}) =>
  cursor ? (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.15 * Math.sin(Math.PI * clamp01(click))})`, transformOrigin: '0 0', zIndex: 50}}>
      {cursor}
    </div>
  ) : null;

// =====================================================================================
// 1. GLASS
// =====================================================================================
/** Glass card: backdrop blur, top rim light, inner hairline, soft tinted glow (13, 17, 05). */
export const GlassCard: React.FC<{
  w: number;
  h: number;
  radius?: number;
  tint?: string;
  dark?: boolean;
  blur?: number;
  glow?: number; // 0..1 outer glow strength
  rim?: number; // 0..1 rim light
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({w, h, radius = 28, tint = '#5B8CFF', dark = true, blur = 16, glow = 0.4, rim = 1, style, children}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      borderRadius: radius,
      overflow: 'hidden',
      backdropFilter: `blur(${blur}px) saturate(140%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,
      background: dark
        ? `linear-gradient(160deg, ${hexA(tint, 0.22)}, ${hexA(tint, 0.06)} 60%, rgba(10,10,16,0.55))`
        : `linear-gradient(160deg, rgba(255,255,255,0.55), rgba(255,255,255,0.22))`,
      boxShadow: [
        `inset 0 1.5px 0 rgba(255,255,255,${0.55 * rim})`,
        `inset 0 0 0 1.5px rgba(255,255,255,${dark ? 0.16 : 0.6})`,
        `0 0 ${60 * glow}px ${hexA(tint, 0.45 * glow)}`,
        `0 30px 60px rgba(0,0,0,${dark ? 0.45 : 0.12})`,
      ].join(','),
      fontFamily: SANS,
      color: dark ? '#fff' : '#111',
      ...style,
    }}
  >
    {/* rim light: diagonal specular streak on the top-left edge */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        pointerEvents: 'none',
        background: `radial-gradient(120% 60% at 15% -10%, rgba(255,255,255,${0.28 * rim}), transparent 55%)`,
      }}
    />
    <div style={{position: 'relative', width: '100%', height: '100%'}}>{children}</div>
  </div>
);

// =====================================================================================
// 2. DATA (05 / 06)
// =====================================================================================
/** Row of StatPills that count up with their rings, then a Bracket draws to a counting total (05 score, 06).
 * Timing defaults are the 05 measurements: count 23f@30 -> 46f, pill stagger 6f@30 -> 12f, bracket 12f -> 24f. */
export const StatPillsTotal: React.FC<{
  f: number;
  items: {icon: string; value: number; label?: string}[];
  total: {label: string; value: number; from?: number};
  start?: number;
  stagger?: number;
  countDur?: number;
  pillW?: number;
  pillH?: number;
  gap?: number;
  accent?: string;
}> = ({f, items, total, start = 0, stagger = 12, countDur = 46, pillW = 270, pillH = 128, gap = 60, accent = '#efeaff'}) => {
  const n = items.length;
  const width = n * pillW + (n - 1) * gap;
  const bStart = start + (n - 1) * stagger + countDur;
  const bp = prog(f, bStart, bStart + 24, EASE.inOut);
  const tStart = bStart + 18;
  const tv = countUp(f, tStart, tStart + 40, total.from ?? 0, total.value);
  const tOp = prog(f, tStart - 6, tStart + 6);
  return (
    <div style={{position: 'relative', width, height: pillH + 380}}>
      <div style={{position: 'absolute', top: 0, width, textAlign: 'center', opacity: tOp, color: '#cfcbe0', fontFamily: SANS}}>
        <div style={{fontSize: 40, fontWeight: 500}}>{total.label}</div>
        <div style={{fontSize: 110, fontWeight: 500, color: accent, fontVariantNumeric: 'tabular-nums', letterSpacing: -2}}>
          {Math.round(tv)}
          <span style={{fontSize: 50, marginLeft: 12, display: 'inline-block', transform: `scale(${pop(f, tStart + 34, 10)})`}}>▲</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 180, left: pillW / 2, opacity: bp > 0 ? 1 : 0}}>
        <Bracket width={width - pillW} height={70} progress={bp} color={accent} />
      </div>
      {items.map((it, i) => {
        const s0 = start + i * stagger;
        const appear = pop(f, s0 - 8, 12);
        return (
          <div key={i} style={{position: 'absolute', top: 260, left: i * (pillW + gap), transform: `scale(${appear})`, opacity: clamp01(appear * 2)}}>
            <StatPill value={countUp(f, s0, s0 + countDur, 0, it.value)} max={100} icon={it.icon} width={pillW} height={pillH} accent={accent} label={it.label} labelOpacity={prog(f, s0 + 16, s0 + 24)} />
          </div>
        );
      })}
    </div>
  );
};

/** Weekday bar chart: grey bars + dashed avg line; one bar fills cyan, overflows above avg into
 * yellow->orange bloom, then flashes white 2-3f@30 (05 1.2-2.1 s). */
export const BarOverload: React.FC<{
  f: number;
  values?: number[]; // 0..1 heights of the grey bars
  active?: number; // index that overloads
  avg?: number; // 0..1
  peak?: number; // 0..1 final active height
  start?: number;
  w?: number;
  h?: number;
  labels?: string[];
}> = ({f, values = [0.45, 0.6, 0.38, 0.52, 0.5, 0.42, 0.3], active = 4, avg = 0.5, peak = 0.92, start = 0, w = 1100, h = 560, labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']}) => {
  const n = values.length;
  const bw = (w / n) * 0.52;
  const fill1 = prog(f, start, start + 20); // cyan to avg (10f@30)
  const fill2 = prog(f, start + 20, start + 44, EASE.inOut); // overload
  const flash = tw(f, [start + 52, start + 54, start + 58], [0, 1, 0], EASE.out);
  const cur = fill2 > 0 ? lerp(avg, peak, fill2) : avg * fill1;
  return (
    <div style={{position: 'relative', width: w, height: h + 60, fontFamily: SANS}}>
      {/* avg line */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (1 - avg), borderTop: '3px dashed rgba(191,191,191,0.7)'}} />
      <div style={{position: 'absolute', left: -70, top: h * (1 - avg) - 16, color: '#bfbfbf', fontSize: 26}}>avg</div>
      {values.map((v, i) => {
        const x = (i + 0.5) * (w / n) - bw / 2;
        const isA = i === active;
        const rise = prog(f, start - 30 + i * 3, start - 10 + i * 3);
        const hh = isA ? Math.max(v, cur) : v * rise;
        const over = isA ? Math.max(0, cur - avg) : 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x, bottom: 60, width: bw, height: h * v * (isA ? 1 : rise), borderRadius: bw / 2, background: 'linear-gradient(#5A6762,#2B252C)'}} />
            {isA ? (
              <>
                <div style={{position: 'absolute', left: x, bottom: 60, width: bw, height: h * Math.min(hh, avg), borderRadius: bw / 2, background: '#6EFAED', boxShadow: `0 0 ${30 * fill1}px #6EFAED`}} />
                {over > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: x,
                      bottom: 60 + h * avg - bw / 2,
                      width: bw,
                      height: h * over + bw / 2,
                      borderRadius: bw / 2,
                      background: 'linear-gradient(0deg,#F29A2E,#F7EA50)',
                      boxShadow: `0 0 30px #F29A2E, 0 0 60px ${hexA('#F29A2E', 0.6)}`,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    bottom: 60,
                    width: bw,
                    height: h * hh,
                    borderRadius: bw / 2,
                    background: '#fff',
                    opacity: flash,
                    boxShadow: `0 0 40px #fff, 0 0 120px #fff`,
                  }}
                />
              </>
            ) : null}
            <div style={{position: 'absolute', left: x, width: bw, bottom: 0, textAlign: 'center', color: isA ? '#fff' : '#8a8a8a', fontSize: 28}}>{labels[i]}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', inset: -400, background: '#fff', opacity: flash * 0.35, pointerEvents: 'none'}} />
    </div>
  );
};

// =====================================================================================
// 3. ICON MORPHS (05 / 06 / 17)
// =====================================================================================
/** App icon that gets locked: a dot drops onto it, padlock shackle closes, shake + red edge glow (05 6.0-7.0 s, 06).
 * `lockAt` frame of the snap; `unlockAt` optional re-open. */
export const IconLock: React.FC<{f: number; lockAt?: number; unlockAt?: number; size?: number; icon?: React.ReactNode; tint?: string}> = ({
  f,
  lockAt = 20,
  unlockAt,
  size = 260,
  icon,
  tint = '#8A0F1E',
}) => {
  const locked = prog(f, lockAt, lockAt + 8, EASE.back);
  const unl = unlockAt !== undefined ? prog(f, unlockAt, unlockAt + 10) : 0;
  const shake = f > lockAt && f < lockAt + 14 ? Math.sin((f - lockAt) * 2.4) * 10 * (1 - (f - lockAt) / 14) : 0;
  const danger = locked * (1 - unl);
  const lockS = size * 0.36;
  const shackleY = lerp(-lockS * 0.45, 0, locked) - unl * lockS * 0.35;
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `translateX(${shake}px)`}}>
      <div style={{position: 'absolute', inset: -size * 0.5, background: `radial-gradient(circle, ${hexA(tint, 0.65 * danger)}, transparent 62%)`}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: size * 0.23,
          background: 'linear-gradient(160deg,#222,#050505)',
          boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.12), 0 0 ${50 * danger}px ${hexA('#ff2a3d', 0.7 * danger)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `saturate(${1 - 0.7 * danger}) brightness(${1 - 0.35 * danger})`,
          overflow: 'hidden',
        }}
      >
        {icon ?? <Icon name="play" size={size * 0.5} color="#fff" />}
      </div>
      {/* padlock badge */}
      <div style={{position: 'absolute', left: size / 2 - lockS / 2, top: size / 2 - lockS / 2, width: lockS, height: lockS, opacity: clamp01(locked * 1.5) * (1 - unl * 0.0), transform: `scale(${lerp(0.4, 1, locked)})`}}>
        <svg width={lockS} height={lockS} viewBox="0 0 24 24" style={{overflow: 'visible', filter: `drop-shadow(0 0 14px ${hexA('#ff3048', 0.9 * danger)})`}}>
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" transform={`translate(0 ${(shackleY / lockS) * 24})`} />
          <rect x="4.5" y="10.5" width="15" height="11" rx="2.5" fill="#fff" />
          <circle cx="12" cy="16" r="1.6" fill={danger > 0.5 ? '#ff3048' : '#111'} />
        </svg>
      </div>
    </div>
  );
};

/** Icon -> card morph: animates real width/height (radius stays absolute) + blur, content fades in last 4f (17 T3/T9). */
export const MorphCard: React.FC<{
  f: number;
  start?: number;
  dur?: number; // 10-15f@30 -> 20-30
  from: {w: number; h: number; r: number; color?: string};
  to: {w: number; h: number; r: number; color?: string};
  blurFrom?: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({f, start = 0, dur = 24, from, to, blurFrom = 0, icon, children, style}) => {
  const p = prog(f, start, start + dur);
  const over = tw(f, [start, start + dur * 0.7, start + dur], [0, 1.04, 1], EASE.out);
  const w = lerp(from.w, to.w, p);
  const h = lerp(from.h, to.h, p);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: lerp(from.r, to.r, p),
        background: interpolateColors(p, [0, 1], [from.color ?? '#ffffff', to.color ?? '#ffffff']),
        filter: blurFrom ? `blur(${(1 - p) * blurFrom}px)` : undefined,
        transform: `scale(${p > 0 ? lerp(1, over, 0.5) : 1})`,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
        ...style,
      }}
    >
      {icon ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - prog(f, start, start + dur * 0.4)}}>{icon}</div> : null}
      <div style={{position: 'absolute', inset: 0, opacity: prog(f, start + dur - 8, start + dur)}}>{children}</div>
    </div>
  );
};

// =====================================================================================
// 4. CHAT (18 / 02 / 11)
// =====================================================================================
/** Typed substring at `cps` chars/s (18: 16 cps user typing, 40 cps bot streaming). */
export const typed = (text: string, f: number, start: number, cps = 16, fps = 60) =>
  text.slice(0, Math.max(0, Math.floor(((f - start) / fps) * cps)));

export const Caret: React.FC<{f: number; color?: string; h?: number}> = ({f, color = '#111', h = 1}) => (
  <span style={{display: 'inline-block', width: 3, height: `${h}em`, background: color, marginLeft: 2, verticalAlign: '-0.15em', opacity: Math.floor(f / 30) % 2 ? 0 : 1}} />
);

/** Gradient shimmer label, "Writing..." / "creating image" (18 7.2-7.9 s). Light sweep repeats every `period` frames. */
export const ShimmerText: React.FC<{f: number; text?: string; colors?: [string, string]; size?: number; period?: number}> = ({
  f,
  text = 'Writing…',
  colors = ['#B07CE8', '#F19AD8'],
  size = 34,
  period = 50,
}) => {
  const x = ((f % period) / period) * 300 - 100;
  return (
    <span
      style={{
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        backgroundImage: `linear-gradient(100deg, ${colors[0]} 0%, ${colors[1]} ${x - 20}%, #fff ${x}%, ${colors[1]} ${x + 20}%, ${colors[0]} 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {text}
    </span>
  );
};

/** Chat input bar with icons, typing text + caret, optional attached thumbnail and cyan send button that flashes on `sendAt`. */
export const ChatInput: React.FC<{
  f: number;
  text: string;
  start?: number;
  cps?: number;
  placeholder?: string;
  w?: number;
  sendAt?: number;
  attach?: React.ReactNode;
  dark?: boolean;
}> = ({f, text, start = 0, cps = 16, placeholder = 'Ask anything…', w = 900, sendAt, attach, dark = false}) => {
  const t = typed(text, f, start, cps);
  const press = sendAt !== undefined ? tw(f, [sendAt, sendAt + 4, sendAt + 12], [0, 1, 0], EASE.out) : 0;
  return (
    <div
      style={{
        width: w,
        borderRadius: 36,
        padding: '24px 28px 18px',
        background: dark ? 'rgba(22,22,28,0.85)' : '#F7F5F8',
        boxShadow: dark ? 'inset 0 0 0 1.5px rgba(255,255,255,0.12), 0 30px 80px rgba(110,91,255,0.35)' : '0 20px 50px rgba(120,60,140,0.15), inset 0 0 0 1.5px rgba(255,255,255,0.9)',
        fontFamily: SANS,
        color: dark ? '#fff' : '#111',
      }}
    >
      {attach ? <div style={{marginBottom: 14}}>{attach}</div> : null}
      <div style={{fontSize: 34, minHeight: 44, lineHeight: 1.3}}>
        {t ? t : <span style={{opacity: 0.4}}>{placeholder}</span>}
        {t.length < text.length || f % 60 < 30 ? <Caret f={f} color={dark ? '#fff' : '#111'} /> : null}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 18, opacity: 0.55}}>
        {['+', '⌀', '▣', '✎'].map((g, i) => (
          <span key={i} style={{fontSize: 30}}>{g}</span>
        ))}
        <div style={{flex: 1}} />
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: interpolateColors(press, [0, 1], ['#5AC8FA', '#C6EEFF']),
            transform: `scale(${1 - press * 0.1})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1 / 0.55,
          }}
        >
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** One chat message. role 'user' = pink bubble (blur 10->0 in 12f, drift up); 'bot' = plain text streaming at 40 cps with avatar. */
export const ChatMessage: React.FC<{
  f: number;
  role: 'user' | 'bot';
  text: string;
  start?: number;
  cps?: number;
  thinking?: string; // shimmer label shown before streaming starts
  thinkFrames?: number;
  bubble?: string;
  maxW?: number;
  children?: React.ReactNode; // result cards under a bot message
}> = ({f, role, text, start = 0, cps = 40, thinking, thinkFrames = 50, bubble = '#EFA8E4', maxW = 760, children}) => {
  if (f < start) return null;
  if (role === 'user') {
    const s = blurIn(f, start, 12, 30);
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end', ...s}}>
        <div style={{maxWidth: maxW, background: bubble, color: '#111', borderRadius: '30px 30px 8px 30px', padding: '20px 28px', fontFamily: SANS, fontSize: 32, lineHeight: 1.35}}>
          {text}
          {children}
        </div>
      </div>
    );
  }
  const streamStart = start + (thinking ? thinkFrames : 0);
  const shown = typed(text, f, streamStart, cps);
  return (
    <div style={{display: 'flex', gap: 18, alignItems: 'flex-start', fontFamily: SANS, ...blurIn(f, start, 10, 10)}}>
      <div style={{width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#E174E1,#EAA0AD)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 24, height: 14, borderRadius: 7, background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          <i style={{width: 4, height: 4, borderRadius: 2, background: '#111'}} />
          <i style={{width: 4, height: 4, borderRadius: 2, background: '#111'}} />
        </div>
      </div>
      <div style={{maxWidth: maxW, fontSize: 32, lineHeight: 1.4, color: '#111', paddingTop: 6}}>
        {f < streamStart && thinking ? <ShimmerText f={f} text={thinking} /> : shown}
        {f >= streamStart ? <div style={{marginTop: 18}}>{children}</div> : null}
      </div>
    </div>
  );
};

/** Result cards that pop in blurred->sharp with a 2f@30 (4f) stagger (18 "3 looks"). */
export const ResultCards: React.FC<{f: number; start?: number; n?: number; w?: number; h?: number; srcs?: string[]; stagger?: number}> = ({
  f,
  start = 0,
  n = 3,
  w = 200,
  h = 260,
  srcs,
  stagger = 4,
}) => (
  <div style={{display: 'flex', gap: 16}}>
    {Array.from({length: n}).map((_, i) => {
      const s = start + i * stagger;
      const p = prog(f, s, s + 14);
      return (
        <div key={i} style={{opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `scale(${lerp(0.85, 1, p)})`}}>
          <Thumb i={i + 3} w={w} h={h} src={srcs?.[i]} radius={18} />
        </div>
      );
    })}
  </div>
);

// =====================================================================================
// 5. SHOP FLOW (12)
// =====================================================================================
/** Frosted search bar: logo slot left, typed query, bright search button (12 7.4-9.5 s). */
export const SearchBar: React.FC<{f: number; text: string; start?: number; cps?: number; w?: number; dark?: boolean; press?: number; left?: React.ReactNode}> = ({
  f,
  text,
  start = 0,
  cps = 14,
  w = 1100,
  dark = false,
  press = 0,
  left,
}) => (
  <div
    style={{
      width: w,
      height: 120,
      borderRadius: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '0 14px 0 30px',
      background: dark ? 'rgba(30,32,40,0.75)' : 'rgba(255,255,255,0.9)',
      boxShadow: dark ? 'inset 0 0 0 1.5px rgba(255,255,255,0.14)' : '0 20px 50px rgba(12,84,156,0.15)',
      backdropFilter: 'blur(14px)',
      fontFamily: SANS,
      fontSize: 40,
      color: dark ? '#fff' : '#0C549C',
    }}
  >
    {left}
    <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>
      {typed(text, f, start, cps)}
      <Caret f={f} color={dark ? '#fff' : '#0C549C'} />
    </div>
    <div style={{width: 92, height: 92, borderRadius: 46, background: '#00A8FC', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.1 * Math.sin(Math.PI * clamp01(press))})`}}>
      <svg width={42} height={42} viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#fff" strokeWidth={2.6} />
        <path d="m15 15 5 5" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

/** Category rows staggering in from below 3-4f@30 (7f) apart; `selected` row highlights at `selectAt`. */
export const CategoryList: React.FC<{f: number; items: string[]; start?: number; stagger?: number; w?: number; selected?: number; selectAt?: number; accent?: string}> = ({
  f,
  items,
  start = 0,
  stagger = 7,
  w = 800,
  selected,
  selectAt = 1e9,
  accent = '#0C549C',
}) => (
  <div style={{width: w, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: SANS}}>
    {items.map((it, i) => {
      const s = start + i * stagger;
      const p = prog(f, s, s + 16);
      const sel = i === selected ? prog(f, selectAt, selectAt + 8) : 0;
      return (
        <div
          key={i}
          style={{
            opacity: p,
            transform: `translateY(${(1 - p) * 60}px) scale(${1 - sel * 0.03})`,
            height: 96,
            borderRadius: 24,
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            background: interpolateColors(sel, [0, 1], ['#ffffff', accent]),
            color: interpolateColors(sel, [0, 1], ['#111111', '#ffffff']),
            boxShadow: '0 10px 30px rgba(12,84,156,0.10)',
            fontSize: 36,
            fontWeight: 500,
          }}
        >
          <div style={{width: 54, height: 54, borderRadius: 14, background: thumbBg(i, 190)}} />
          <span style={{flex: 1}}>{it}</span>
          <Icon name="chevron" size={34} color="currentColor" />
        </div>
      );
    })}
  </div>
);

/** Product tile: image, name, price, "+" that turns into a check at `addedAt`. */
export const ProductTile: React.FC<{f: number; name: string; price: string; i?: number; src?: string; addedAt?: number; w?: number; accent?: string}> = ({
  f,
  name,
  price,
  i = 0,
  src,
  addedAt = 1e9,
  w = 300,
  accent = '#0C549C',
}) => {
  const a = prog(f, addedAt, addedAt + 10, EASE.back);
  return (
    <div style={{width: w, background: '#fff', borderRadius: 26, padding: 18, boxShadow: '0 14px 40px rgba(12,84,156,0.12)', fontFamily: SANS, position: 'relative'}}>
      <Thumb i={i} w={w - 36} h={w - 60} src={src} radius={18} style={{boxShadow: 'none'}} />
      <div style={{fontSize: 28, fontWeight: 600, color: '#111', marginTop: 14}}>{name}</div>
      <div style={{fontSize: 26, color: accent, marginTop: 4}}>{price}</div>
      <div
        style={{
          position: 'absolute',
          right: 18,
          bottom: 18,
          width: 58,
          height: 58,
          borderRadius: 29,
          background: interpolateColors(a, [0, 1], [accent, '#22C55E']),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${1 + 0.15 * Math.sin(Math.PI * a)})`,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24">
          {a < 0.5 ? (
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          ) : (
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>
    </div>
  );
};

/** Product grid card: header, tiles pop one by one, "Add to Cart" grows from a line then compresses on press (12 14.8-18.4 s). */
export const ProductGrid: React.FC<{
  f: number;
  products: {name: string; price: string; src?: string}[];
  start?: number;
  addedAt?: number[];
  pressAt?: number;
  title?: string;
  accent?: string;
  cols?: number;
}> = ({f, products, start = 0, addedAt = [], pressAt = 1e9, title = 'Groceries', accent = '#0C549C', cols = 4}) => {
  const tileW = 300;
  const btnP = prog(f, start + 10 + products.length * 8, start + 30 + products.length * 8);
  const press = tw(f, [pressAt, pressAt + 4, pressAt + 12], [0, 1, 0], EASE.out);
  return (
    <div style={{background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', borderRadius: 40, padding: 36, fontFamily: SANS, boxShadow: '0 30px 80px rgba(12,84,156,0.15)', ...blurIn(f, start, 14, 30)}}>
      <div style={{fontSize: 40, fontWeight: 700, color: accent, marginBottom: 26}}>{title}</div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tileW}px)`, gap: 24}}>
        {products.map((p, i) => (
          <div key={i} style={{transform: `scale(${pop(f, start + 8 + i * 8, 12)})`}}>
            <ProductTile f={f} i={i} {...p} addedAt={addedAt[i]} w={tileW} accent={accent} />
          </div>
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
        <div
          style={{
            width: lerp(4, 560, btnP),
            height: lerp(4, 100, clamp01(btnP * 2 - 0.4)),
            borderRadius: 50,
            background: accent,
            color: '#fff',
            fontSize: 36,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transform: `scale(${1 - press * 0.05})`,
          }}
        >
          <span style={{opacity: prog(f, start + 26 + products.length * 8, start + 34 + products.length * 8)}}>Add to Cart</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// 6. iOS (12 / 20)
// =====================================================================================
/** iOS notification banner (drop in 12f, back ease). */
export const IOSNotification: React.FC<{f: number; start?: number; app: string; title: string; body: string; time?: string; w?: number; iconColor?: string; icon?: React.ReactNode}> = ({
  f,
  start = 0,
  app,
  title,
  body,
  time = 'now',
  w = 900,
  iconColor = '#0C549C',
  icon,
}) => {
  const p = prog(f, start, start + 16, EASE.back);
  return (
    <div
      style={{
        width: w,
        borderRadius: 44,
        padding: '26px 30px',
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        background: 'rgba(245,245,250,0.72)',
        backdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
        fontFamily: SANS,
        color: '#111',
        opacity: clamp01(p * 2),
        transform: `translateY(${(1 - p) * -80}px) scale(${lerp(0.9, 1, p)})`,
      }}
    >
      <div style={{width: 84, height: 84, borderRadius: 20, background: iconColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 40}}>
        {icon ?? app[0]}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', fontSize: 28, fontWeight: 600}}>
          <span style={{flex: 1}}>{title}</span>
          <span style={{opacity: 0.45, fontWeight: 400}}>{time}</span>
        </div>
        <div style={{fontSize: 28, opacity: 0.85, marginTop: 4}}>{body}</div>
      </div>
    </div>
  );
};

/** iOS lock screen (time, date, wallpaper gradient) with notifications children; drawn at phone size w x w*2.16. */
export const IOSLockScreen: React.FC<{w?: number; time?: string; date?: string; wallpaper?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  w = 600,
  time = '8:51',
  date = 'Monday 27 October',
  wallpaper = 'linear-gradient(170deg,#1d3d7a,#6a8fd8 45%,#f1c7b6)',
  children,
  style,
}) => (
  <PhoneFrame w={w} style={style}>
    <div style={{position: 'absolute', inset: 0, background: wallpaper}} />
    <div style={{position: 'absolute', top: w * 0.2, width: '100%', textAlign: 'center', color: '#fff', fontFamily: SANS}}>
      <div style={{fontSize: w * 0.05, fontWeight: 600, opacity: 0.9}}>{date}</div>
      <div style={{fontSize: w * 0.28, fontWeight: 600, lineHeight: 1, letterSpacing: -4}}>{time}</div>
    </div>
    <div style={{position: 'absolute', top: w * 0.75, left: w * 0.04, right: w * 0.04, display: 'flex', flexDirection: 'column', gap: 12, transformOrigin: 'top left', transform: `scale(${(w * 0.92) / 900})`, width: 900}}>
      {children}
    </div>
  </PhoneFrame>
);

/** Generic iPhone frame: bezel, dynamic island, rounded screen. */
export const PhoneFrame: React.FC<{w?: number; children?: React.ReactNode; style?: React.CSSProperties; bezel?: string}> = ({w = 600, children, style, bezel = '#111'}) => (
  <div style={{width: w, height: w * 2.16, borderRadius: w * 0.16, background: bezel, padding: w * 0.03, boxShadow: '0 40px 100px rgba(0,0,0,0.35), inset 0 0 0 3px #3a3a3e', ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.13, overflow: 'hidden', background: '#000'}}>
      {children}
      <div style={{position: 'absolute', top: w * 0.03, left: '50%', width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: w, background: '#000', zIndex: 5}} />
    </div>
  </div>
);

/** iOS permission sheet: rows stagger 3f@24 (8f) with translateY 12->0; pressed row turns #0A84FF for 8f (20 T2). */
export const IOSPermissionSheet: React.FC<{f: number; start?: number; title?: string; body?: string; rows?: string[]; pressRow?: number; pressAt?: number; w?: number}> = ({
  f,
  start = 0,
  title = 'Allow “App” to use your location?',
  body = 'Your location is used to show nearby offers.',
  rows = ['Allow Once', 'Allow While Using App', 'Don’t Allow'],
  pressRow = 1,
  pressAt = 1e9,
  w = 620,
}) => {
  const pr = tw(f, [pressAt, pressAt + 3, pressAt + 16], [0, 1, 0], EASE.out);
  return (
    <div style={{width: w, borderRadius: 28, background: 'rgba(242,242,247,0.96)', overflow: 'hidden', fontFamily: SANS, textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.25)', ...blurIn(f, start, 12, 20)}}>
      <div style={{padding: '34px 36px 28px'}}>
        <div style={{fontSize: 32, fontWeight: 600, color: '#111'}}>{title}</div>
        <div style={{fontSize: 26, color: '#555', marginTop: 10}}>{body}</div>
      </div>
      {rows.map((r, i) => {
        const s = start + 8 + i * 8;
        const p = prog(f, s, s + 12);
        const on = i === pressRow ? pr : 0;
        return (
          <div
            key={i}
            style={{
              borderTop: '1.5px solid rgba(60,60,67,0.22)',
              height: 92,
              lineHeight: '92px',
              fontSize: 32,
              color: interpolateColors(on, [0, 1], ['#0A84FF', '#ffffff']),
              background: interpolateColors(on, [0, 1], ['rgba(0,0,0,0)', '#0A84FF']),
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px)`,
              fontWeight: i === rows.length - 1 ? 400 : 500,
            }}
          >
            {r}
          </div>
        );
      })}
    </div>
  );
};

/** iOS toggle pill (also used for 13's toggles): knob slides with back ease, track tints. */
export const TogglePill: React.FC<{f: number; at?: number; on?: boolean; w?: number; color?: string; label?: string; dark?: boolean}> = ({
  f,
  at = 0,
  on = true,
  w = 120,
  color = '#34C759',
  label,
  dark = false,
}) => {
  const p0 = prog(f, at, at + 12, EASE.back);
  const p = on ? p0 : 1 - p0;
  const h = w * 0.6;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: SANS, fontSize: h * 0.5, color: dark ? '#fff' : '#111'}}>
      {label ? <span style={{fontWeight: 500}}>{label}</span> : null}
      <div style={{width: w, height: h, borderRadius: h, background: interpolateColors(clamp01(p), [0, 1], [dark ? '#39393D' : '#E5E5EA', color]), position: 'relative'}}>
        <div style={{position: 'absolute', top: h * 0.06, left: lerp(h * 0.06, w - h * 0.94, p), width: h * 0.88, height: h * 0.88, borderRadius: h, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,0.25)'}} />
      </div>
    </div>
  );
};

/** iOS Control Centre: connectivity block (airplane / cellular / wifi / bluetooth), media, brightness + volume sliders (20 airplane-mode beat). */
export const IOSControlCentre: React.FC<{f: number; start?: number; airplaneAt?: number; w?: number}> = ({f, start = 0, airplaneAt = 1e9, w = 760}) => {
  const air = prog(f, airplaneAt, airplaneAt + 8);
  const u = w / 4 - 18;
  const tile = (bg: string, style?: React.CSSProperties, ch?: React.ReactNode) => (
    <div style={{borderRadius: 34, background: bg, backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', ...style}}>{ch}</div>
  );
  const glass = 'rgba(80,80,90,0.55)';
  const circle = (on: number, onColor: string, glyph: string, k: number) => (
    <div
      key={k}
      style={{
        width: u * 0.82,
        height: u * 0.82,
        borderRadius: u,
        background: interpolateColors(on, [0, 1], ['rgba(255,255,255,0.18)', onColor]),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: u * 0.36,
        transform: `scale(${1 + 0.08 * Math.sin(Math.PI * (k === 0 ? air : 0))})`,
      }}
    >
      {glyph}
    </div>
  );
  return (
    <div style={{width: w, display: 'grid', gridTemplateColumns: `repeat(4, ${u}px)`, gridAutoRows: `${u}px`, gap: 24, fontFamily: SANS, ...blurIn(f, start, 14, -30)}}>
      {tile(
        glass,
        {gridColumn: 'span 2', gridRow: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', justifyItems: 'center', alignItems: 'center', padding: 20},
        <>
          {circle(air, '#FF9F0A', '✈', 0)}
          {circle(1 - air, '#34C759', '◉', 1)}
          {circle(1 - air, '#0A84FF', '◠', 2)}
          {circle(1 - air, '#0A84FF', 'ᛒ', 3)}
        </>,
      )}
      {tile(glass, {gridColumn: 'span 2', gridRow: 'span 2', flexDirection: 'column', fontSize: 30, gap: 20}, <><span style={{opacity: 0.7}}>Not Playing</span><span style={{fontSize: 44}}>◁◁  ▷  ▷▷</span></>)}
      {tile(glass, {fontSize: 44}, '🔒')}
      {tile(glass, {fontSize: 44}, '▭')}
      {[0, 1].map((k) =>
        tile(
          glass,
          {gridRow: 'span 2', position: 'relative', overflow: 'hidden', alignItems: 'flex-end'},
          <div key={k} style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${[62, 40][k]}%`, background: '#fff'}} />,
        ),
      )}
      {tile(glass, {fontSize: 44}, '☾')}
      {tile(glass, {fontSize: 44}, '◐')}
    </div>
  );
};

// =====================================================================================
// 7. CONNECTORS (15 / 03 / 01)
// =====================================================================================
/** Orthogonal route from a to b with one or two 90-degree turns and rounded corners. */
export const orthoPath = (a: XY, b: XY, r = 24, mode: 'hv' | 'vh' | 'hvh' = 'hvh') => {
  const rr = (dx: number, dy: number) => Math.min(r, Math.abs(dx) / 2, Math.abs(dy) / 2);
  const sx = Math.sign(b.x - a.x) || 1,
    sy = Math.sign(b.y - a.y) || 1;
  if (mode === 'hvh') {
    const mx = (a.x + b.x) / 2;
    const k = rr(b.x - a.x, b.y - a.y);
    return `M ${a.x} ${a.y} L ${mx - sx * k} ${a.y} Q ${mx} ${a.y} ${mx} ${a.y + sy * k} L ${mx} ${b.y - sy * k} Q ${mx} ${b.y} ${mx + sx * k} ${b.y} L ${b.x} ${b.y}`;
  }
  if (mode === 'hv') {
    const k = rr(b.x - a.x, b.y - a.y) * 2;
    return `M ${a.x} ${a.y} L ${b.x - sx * k} ${a.y} Q ${b.x} ${a.y} ${b.x} ${a.y + sy * k} L ${b.x} ${b.y}`;
  }
  const k = rr(b.x - a.x, b.y - a.y) * 2;
  return `M ${a.x} ${a.y} L ${a.x} ${b.y - sy * k} Q ${a.x} ${b.y} ${a.x + sx * k} ${b.y} L ${b.x} ${b.y}`;
};

/** Dark glass squircle icon tile with white inner stroke and outer glow (15). */
export const GlowTile: React.FC<{size?: number; children?: React.ReactNode; glow?: string; strength?: number; bg?: string}> = ({
  size = 140,
  children,
  glow = '#ffffff',
  strength = 0.5,
  bg = 'linear-gradient(160deg,#1c1c22,#0a0a0d)',
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.27,
      background: bg,
      boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.22), inset 0 2px 0 rgba(255,255,255,0.35), 0 0 ${size * 0.4}px ${hexA(glow, strength * 0.6)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: size * 0.38,
    }}
  >
    {children}
  </div>
);

/** Letter badge used as a stand-in for a brand logo (pass real <Img> as `logo` in production). */
export const LogoBadge: React.FC<{label: string; color?: string; size?: number; logo?: React.ReactNode; ring?: boolean}> = ({label, color = '#111', size = 88, logo, ring = true}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: '#fff',
      boxShadow: `${ring ? 'inset 0 0 0 1px #DDE,' : ''} 0 4px 12px rgba(0,0,0,0.4)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size * 0.42,
    }}
  >
    {logo ?? label}
  </div>
);

/** Circuit traces from a central hub to N tiles: 90-degree routed lines draw on with a bright head and fading
 * tail, then light pulses keep travelling into the hub (15 16.2-19.8 s). Coordinates are within w x h. */
export const CircuitHub: React.FC<{
  f: number;
  w?: number;
  h?: number;
  hub?: React.ReactNode;
  nodes: {x: number; y: number; content: React.ReactNode}[];
  start?: number;
  drawDur?: number;
  stagger?: number;
  color?: string;
  pulseEvery?: number;
}> = ({f, w = 1600, h = 900, hub, nodes, start = 0, drawDur = 50, stagger = 10, color = '#7B5CFF', pulseEvery = 70}) => {
  const c = {x: w / 2, y: h / 2};
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
        <defs>
          <filter id="cglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {nodes.map((n, i) => {
          const mode = Math.abs(n.x - c.x) > Math.abs(n.y - c.y) ? 'hvh' : 'vh';
          const d = orthoPath(c, n, 28, mode as 'hvh' | 'vh');
          const s = start + i * stagger;
          const p = prog(f, s, s + drawDur, EASE.inOut);
          const e = evolvePath(Math.max(0.0001, p), d);
          const len = parseFloat(String(e.strokeDasharray).split(' ')[0]);
          const head = p * len;
          // inbound pulse: travels node -> hub after draw
          const ph = ((f - s - drawDur + i * 13) % pulseEvery) / pulseEvery;
          const pulsePos = (1 - ph) * len;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={hexA(color, 0.35)} strokeWidth={4} strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
              {/* fading tail behind the head */}
              {p < 1 && p > 0 ? (
                <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${Math.min(160, head)} ${1e5}`} strokeDashoffset={-(head - Math.min(160, head))} filter="url(#cglow)" />
              ) : null}
              {p < 1 && p > 0 ? (
                <path d={d} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeDasharray={`0.001 ${1e5}`} strokeDashoffset={-head} filter="url(#cglow)" />
              ) : null}
              {p >= 1 ? (
                <path d={d} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeDasharray={`70 ${1e5}`} strokeDashoffset={-pulsePos} filter="url(#cglow)" opacity={0.9} />
              ) : null}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const s = start + i * stagger + drawDur - 6;
        return (
          <div key={i} style={{position: 'absolute', left: n.x, top: n.y, transform: `translate(-50%,-50%) scale(${pop(f, s, 14)})`}}>
            {n.content}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: c.x, top: c.y, transform: 'translate(-50%,-50%)'}}>{hub}</div>
    </div>
  );
};

/** Glowing source point that fans out into N cubic bezier strands to labelled icons (03 T2):
 * endpoints spread +-220 vertically / 500-900 horizontally (scaled), 2f@30 stagger, dots when p > 0.95. */
export const StrandFan: React.FC<{
  f: number;
  items: {label: string; icon?: React.ReactNode}[];
  start?: number;
  w?: number;
  h?: number;
  color?: string;
  retractAt?: number;
}> = ({f, items, start = 0, w = 1400, h = 800, color = '#3496FF', retractAt = 1e9}) => {
  const src = {x: 80, y: h / 2};
  const n = items.length;
  return (
    <div style={{position: 'relative', width: w, height: h, fontFamily: SANS}}>
      <svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
        {items.map((_, i) => {
          const ey = h / 2 + (i - (n - 1) / 2) * ((h - 120) / Math.max(1, n - 1));
          const ex = w - 380 - Math.abs(i - (n - 1) / 2) * 50;
          const d = `M ${src.x} ${src.y} C ${src.x + 300} ${src.y}, ${ex - 380} ${ey}, ${ex} ${ey}`;
          const s = start + i * 4;
          const p = prog(f, s, s + 40, Easing3) * (1 - prog(f, retractAt, retractAt + 30, EASE.inOut));
          const e = evolvePath(Math.max(0.0001, p), d);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} style={{filter: `drop-shadow(0 0 6px ${color})`}} />
              {p > 0.95 ? <circle cx={ex} cy={ey} r={8} fill="#fff" style={{filter: `drop-shadow(0 0 8px ${color})`}} /> : null}
            </g>
          );
        })}
        <circle cx={src.x} cy={src.y} r={40} fill={`url(#strandglow)`} />
        <defs>
          <radialGradient id="strandglow">
            <stop offset="0" stopColor={color} stopOpacity={1} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={src.x} cy={src.y} r={4} fill="#fff" />
      </svg>
      {items.map((it, i) => {
        const ey = h / 2 + (i - (n - 1) / 2) * ((h - 120) / Math.max(1, n - 1));
        const ex = w - 380 - Math.abs(i - (n - 1) / 2) * 50;
        const s = start + i * 4 + 36;
        const p = prog(f, s, s + 12) * (1 - prog(f, retractAt, retractAt + 12));
        return (
          <div key={i} style={{position: 'absolute', left: ex + 26, top: ey, transform: `translate(${(1 - p) * -20}px,-50%)`, opacity: p, display: 'flex', alignItems: 'center', gap: 18, color: '#fff', fontSize: 34, fontWeight: 500}}>
            {it.icon ?? <GlowTile size={70} glow={color}>{it.label[0]}</GlowTile>}
            {it.label}
          </div>
        );
      })}
    </div>
  );
};
const Easing3 = (t: number) => 1 - Math.pow(1 - t, 3);

/** Neon orbit rings with logo badges (01 T4): stroke 10 #2FD3D0 + 3px core + blur(18)/blur(40) glow,
 * speeds 0.8-1.6 deg/f@30 (0.4-0.8 @60), one ring reversed; `implodeAt` scales the group to 0.35. */
export const OrbitRings: React.FC<{
  f: number;
  rings?: {r: number; speed: number; logos: {label: string; color?: string; logo?: React.ReactNode}[]}[];
  color?: string;
  core?: string;
  tilt?: number; // rotateX deg
  center?: React.ReactNode;
  implodeAt?: number;
  badge?: number;
}> = ({
  f,
  rings = [
    {r: 220, speed: 0.6, logos: [{label: 'S', color: '#4A154B'}, {label: 'N'}]},
    {r: 360, speed: -0.45, logos: [{label: 'G', color: '#EA4335'}, {label: 'F', color: '#1877F2'}, {label: 'D', color: '#0061FF'}]},
    {r: 500, speed: 0.4, logos: [{label: 'X'}, {label: 'Y', color: '#FF0000'}, {label: 'Z', color: '#2D8CFF'}, {label: 'L', color: '#5E6AD2'}]},
  ],
  color = '#2FD3D0',
  core = '#E9FDFF',
  tilt = 62,
  center,
  implodeAt = 1e9,
  badge = 110,
}) => {
  const s = tw(f, [0, 100], [1.3, 1], EASE.out) * tw(f, [implodeAt, implodeAt + 24], [1, 0.35], EASE.in);
  const size = Math.max(...rings.map((r) => r.r)) * 2 + 200;
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `scale(${s})`, perspective: 1600}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)`}}>
        <svg width={size} height={size} style={{position: 'absolute', overflow: 'visible'}}>
          {rings.map((r, i) => (
            <g key={i}>
              <circle cx={size / 2} cy={size / 2} r={r.r} fill="none" stroke={color} strokeWidth={22} opacity={0.35} style={{filter: 'blur(40px)'}} />
              <circle cx={size / 2} cy={size / 2} r={r.r} fill="none" stroke={color} strokeWidth={10} opacity={0.8} style={{filter: 'blur(18px)'}} />
              <circle cx={size / 2} cy={size / 2} r={r.r} fill="none" stroke={color} strokeWidth={10} />
              <circle cx={size / 2} cy={size / 2} r={r.r} fill="none" stroke={core} strokeWidth={3} />
            </g>
          ))}
        </svg>
      </div>
      {/* badges are positioned on the projected ellipse so they stay upright facing camera */}
      {rings.flatMap((r, i) =>
        r.logos.map((l, k) => {
          const a = ((k / r.logos.length) * 360 + f * r.speed + i * 40) * (Math.PI / 180);
          const x = size / 2 + Math.cos(a) * r.r;
          const y = size / 2 + Math.sin(a) * r.r * Math.cos((tilt * Math.PI) / 180);
          const depth = Math.sin(a);
          return (
            <div key={`${i}-${k}`} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.2 * depth})`, zIndex: depth > 0 ? 3 : 1}}>
              <LogoBadge size={badge} {...l} />
            </div>
          );
        }),
      )}
      <div style={{position: 'absolute', left: size / 2, top: size / 2, transform: 'translate(-50%,-50%)', zIndex: 2}}>{center}</div>
    </div>
  );
};

// =====================================================================================
// 8. CARD FIELDS (03 / 13 / 16 / 08 / 17 / 02)
// =====================================================================================
type CardFieldProps = {f: number; n?: number; srcs?: string[]; cardW?: number; cardH?: number; start?: number};

/** Radial poster vortex (03 T6): angle i*360/n + 0.2*f, radius 0->340*k (expo out 40f), exits to 900*k at `exitAt`. */
export const RadialBurst: React.FC<CardFieldProps & {radius?: number; exitAt?: number}> = ({f, n = 20, srcs, cardW = 180, cardH = 260, start = 0, radius = 440, exitAt = 1e9}) => {
  const t = f - start;
  const r = tw(t, [0, 40], [0, radius], EASE.out) + tw(f, [exitAt, exitAt + 20], [0, radius * 1.7], EASE.in);
  return (
    <div style={{position: 'relative', width: 0, height: 0, perspective: 1400}}>
      <div style={{transformStyle: 'preserve-3d', transform: 'rotateX(20deg)'}}>
        {Array.from({length: n}).map((_, i) => {
          const th = i * (360 / n) + 0.2 * t;
          const rad = (th * Math.PI) / 180;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.cos(rad) * r - cardW / 2,
                top: Math.sin(rad) * r - cardH / 2,
                transform: `rotateZ(${th + 90}deg)`,
                zIndex: Math.round(Math.sin(rad) * 100) + 100,
                opacity: clamp01(t / 6),
              }}
            >
              <Thumb i={i} w={cardW} h={cardH} src={srcs?.[i % (srcs?.length || 1)]} radius={16} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Thumbnails riding an S-curve ribbon (13 T5): cards placed along a path, rotated to the tangent, offset animates. */
export const ThumbRibbon: React.FC<CardFieldProps & {w?: number; h?: number; speed?: number; d?: string; tiltX?: number}> = ({
  f,
  n = 12,
  srcs,
  cardW = 240,
  cardH = 150,
  w = 1920,
  h = 1080,
  speed = 2.4,
  d,
  tiltX = 35,
}) => {
  const path = d ?? `M -200 ${h * 0.75} C ${w * 0.3} ${h * 0.05}, ${w * 0.55} ${h * 1.05}, ${w + 200} ${h * 0.25}`;
  return (
    <div style={{position: 'relative', width: w, height: h, perspective: 1600}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${tiltX}deg) rotateZ(-6deg)`}}>
        <RibbonCards path={path} f={f} n={n} srcs={srcs} cardW={cardW} cardH={cardH} speed={speed} />
      </div>
    </div>
  );
};

const RibbonCards: React.FC<{path: string; f: number; n: number; srcs?: string[]; cardW: number; cardH: number; speed: number}> = ({path, f, n, srcs, cardW, cardH, speed}) => {
  // sample the path once via an offscreen SVGPathElement (browser render) — deterministic per frame
  const el = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', path);
    return p;
  }, [path]);
  if (!el) return null;
  const L = el.getTotalLength();
  const gap = L / n;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const at = (((i * gap + f * speed) % L) + L) % L;
        const p = el.getPointAtLength(at);
        const q = el.getPointAtLength(Math.min(L, at + 2));
        const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        return (
          <div key={i} style={{position: 'absolute', left: p.x - cardW / 2, top: p.y - cardH / 2, transform: `rotate(${ang}deg)`}}>
            <Thumb i={i} w={cardW} h={cardH} src={srcs?.[i % (srcs?.length || 1)]} radius={14} />
          </div>
        );
      })}
    </>
  );
};

/** Thumbnail arch (13 T7): n cards on a semicircle r = 0.38*W, whole arch rotates 0->8deg over 1.5s, centre card glows. */
export const ThumbArch: React.FC<CardFieldProps & {r?: number; glow?: string; spread?: number}> = ({f, n = 12, srcs, cardW = 220, cardH = 140, start = 0, r = 560, glow = '#3A6BFF', spread = 170}) => {
  const rot = tw(f, [start, start + 90], [0, 8], EASE.inOut);
  return (
    <div style={{position: 'relative', width: 0, height: 0, transform: `rotate(${rot}deg)`}}>
      {Array.from({length: n}).map((_, i) => {
        const a = -spread / 2 + (i * spread) / (n - 1);
        const p = prog(f, start + i * 3, start + i * 3 + 16);
        const centre = Math.abs(a) < spread / (n - 1) / 1.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -cardW / 2,
              top: -cardH / 2,
              transform: `rotate(${a}deg) translateY(${-r * lerp(0.7, 1, p)}px) rotate(${-a * 0.3}deg)`,
              opacity: p,
              filter: centre ? `drop-shadow(0 0 30px ${glow})` : undefined,
            }}
          >
            <Thumb i={i} w={cardW} h={cardH} src={srcs?.[i % (srcs?.length || 1)]} radius={14} />
          </div>
        );
      })}
    </div>
  );
};

/** 3D domino row (16 T8, Remotion fallback): rounded cards along a diagonal with translateZ(-i*120),
 * each tips -8deg on Y as the `cursorIndex` (float) passes; camera dollies with `dolly` px. */
export const DominoRow: React.FC<CardFieldProps & {cursorIndex?: number; dolly?: number; depth?: number}> = ({f, n = 12, srcs, cardW = 420, cardH = 280, cursorIndex, dolly, depth = 160}) => {
  const ci = cursorIndex ?? f / 20;
  const cam = dolly ?? f * 3;
  return (
    <div style={{position: 'relative', width: 0, height: 0, perspective: 1400}}>
      <div style={{transformStyle: 'preserve-3d', transform: `rotateY(-38deg) rotateX(8deg) translateZ(${cam}px)`}}>
        {Array.from({length: n}).map((_, i) => {
          const near = Math.exp(-Math.pow(i - ci, 2) / 0.8);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -cardW / 2,
                top: -cardH / 2,
                transform: `translateZ(${-i * depth}px) translateX(${i * 30}px) rotateY(${-8 * near - 4}deg) translateY(${-near * 20}px)`,
                transformOrigin: '50% 100%',
              }}
            >
              <Thumb i={i} w={cardW} h={cardH} src={srcs?.[i % (srcs?.length || 1)]} radius={22} style={{boxShadow: `0 ${20 + near * 30}px 60px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.2)`}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Floating glowing card stack (08 glow stack / 16 T4 reshuffle): cards at varied z with small rotY; every
 * `beat` frames the back card springs to the front. */
export const GlowStack: React.FC<CardFieldProps & {beat?: number; glow?: string; children?: (i: number) => React.ReactNode}> = ({
  f,
  n = 6,
  srcs,
  cardW = 640,
  cardH = 400,
  beat = 28,
  glow = '#8b7bd8',
  children,
}) => {
  const k = Math.floor(f / beat);
  const tt = prog(f, k * beat, k * beat + 20, EASE.out);
  return (
    <div style={{position: 'relative', width: 0, height: 0, perspective: 1600}}>
      <div style={{transformStyle: 'preserve-3d', transform: `rotateY(${-18 + Math.sin(f / 90) * 4}deg) rotateX(10deg)`}}>
        {Array.from({length: n}).map((_, i) => {
          const ord = (i + k) % n; // 0 = front
          const prev = (i + k - 1 + n) % n;
          const o = lerp(prev, ord, tt);
          const lifting = prev === n - 1 && ord === 0 ? Math.sin(Math.PI * tt) : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -cardW / 2,
                top: -cardH / 2,
                transform: `translate3d(${o * 60 + lifting * 260}px, ${-o * 40 - lifting * 80 + Math.sin(f / 40 + i) * 6}px, ${-o * 120}px)`,
                zIndex: n - Math.round(o),
                opacity: 1 - o * 0.12,
              }}
            >
              <div style={{borderRadius: 26, boxShadow: `0 0 0 2px ${hexA('#ffffff', 0.25)}, 0 0 ${ord === 0 ? 60 : 20}px ${hexA(glow, ord === 0 ? 0.7 : 0.25)}`}}>
                {children ? children(i) : <Thumb i={i} w={cardW} h={cardH} src={srcs?.[i % (srcs?.length || 1)]} radius={26} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Rotating photo ring (17 T6): 24 photos on an ellipse rx 420 / ry 230 @1024 (x1.875), angle += 0.004 rad/f@30,
 * random +-6deg, ring settles scale 1.4->1 + blur 10->0 over 15f@30 (30f). Centre slot for a label box. */
export const PhotoRing: React.FC<CardFieldProps & {rx?: number; ry?: number; center?: React.ReactNode}> = ({f, n = 24, srcs, cardW = 150, cardH = 185, start = 0, rx = 640, ry = 330, center}) => {
  const t = f - start;
  const s = tw(t, [0, 30], [1.4, 1], EASE.out);
  const bl = tw(t, [0, 30], [10, 0], EASE.out);
  return (
    <div style={{position: 'relative', width: 0, height: 0}}>
      <div style={{transform: `scale(${s})`, filter: `blur(${bl}px)`}}>
        {Array.from({length: n}).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + t * 0.002;
          const depth = Math.sin(a);
          const sz = lerp(0.7, 1.15, (depth + 1) / 2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.cos(a) * rx - (cardW * sz) / 2,
                top: Math.sin(a) * ry - (cardH * sz) / 2,
                zIndex: Math.round(depth * 100) + 100,
                transform: `rotate(${(random(`pr${i}`) - 0.5) * 12}deg)`,
              }}
            >
              <Thumb i={i} w={cardW * sz} h={cardH * sz} src={srcs?.[i % (srcs?.length || 1)]} radius={12} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', transform: 'translate(-50%,-50%)', zIndex: 500}}>{center}</div>
    </div>
  );
};

/** Centre label box with crosshair hairlines that extend past the box (17 / 03 T1). */
export const CrosshairBox: React.FC<{children: React.ReactNode; color?: string; ext?: number; pad?: number}> = ({children, color = '#e8b0b8', ext = 80, pad = 26}) => (
  <div style={{position: 'relative', padding: `${pad * 0.6}px ${pad}px`, border: `2px solid ${color}`, background: 'rgba(255,255,255,0.92)', fontFamily: SANS, fontSize: 56, fontWeight: 600, color: '#111', whiteSpace: 'nowrap'}}>
    {[0, 1].map((k) => (
      <React.Fragment key={k}>
        <div style={{position: 'absolute', left: -2, width: 2, height: ext, background: color, ...(k ? {top: '100%'} : {top: -ext})}} />
        <div style={{position: 'absolute', right: -2, width: 2, height: ext, background: color, ...(k ? {top: '100%'} : {top: -ext})}} />
        <div style={{position: 'absolute', top: -2, height: 2, width: ext, background: color, ...(k ? {left: '100%'} : {left: -ext})}} />
        <div style={{position: 'absolute', bottom: -2, height: 2, width: ext, background: color, ...(k ? {left: '100%'} : {left: -ext})}} />
      </React.Fragment>
    ))}
    {children}
  </div>
);

/** Masonry build (02 grid / 08): columns of mixed-height cards rising in with a diagonal stagger. */
export const MasonryBuild: React.FC<CardFieldProps & {cols?: number; colW?: number; gap?: number; drift?: number}> = ({f, n = 18, srcs, start = 0, cols = 6, colW = 280, gap = 22, drift = 0.6}) => {
  const heights = Array.from({length: n}).map((_, i) => 220 + Math.round(random(`m${i}`) * 220));
  const colsY = Array(cols).fill(0) as number[];
  return (
    <div style={{position: 'relative', width: cols * (colW + gap), height: 1400}}>
      {heights.map((hh, i) => {
        const c = colsY.indexOf(Math.min(...colsY));
        const y = colsY[c];
        colsY[c] += hh + gap;
        const s = start + (c + y / 300) * 5;
        const p = prog(f, s, s + 24, EASE.out);
        return (
          <div key={i} style={{position: 'absolute', left: c * (colW + gap), top: y - f * drift * (c % 2 ? 1 : -0.6), opacity: p, transform: `translateY(${(1 - p) * 120}px) scale(${lerp(0.9, 1, p)})`}}>
            <Thumb i={i} w={colW} h={hh} src={srcs?.[i % (srcs?.length || 1)]} radius={20} />
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================================
// 9. CAROUSEL / ISO (15)
// =====================================================================================
/** Horizontal app-tile carousel scrolling R->L; centre tile 1.4x; vertical violet light bars + giant number behind (15 20-21.8 s). */
export const LightBarCarousel: React.FC<{
  f: number;
  tiles: {label: string; logo?: React.ReactNode; color?: string}[];
  number?: string;
  speed?: number; // px per frame
  tile?: number;
  gap?: number;
  color?: string;
  w?: number;
}> = ({f, tiles, number = '100+', speed = 4, tile = 200, gap = 60, color = '#6B4BFF', w = 1920}) => {
  const step = tile + gap;
  const total = tiles.length * step;
  return (
    <div style={{position: 'relative', width: w, height: 700, overflow: 'hidden', fontFamily: SANS}}>
      {/* light bars */}
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: w / 2 + (i - 4) * 120 - 18,
            top: 0,
            bottom: 0,
            width: 36,
            background: `linear-gradient(180deg, transparent, ${hexA(color, 0.9 - Math.abs(i - 4) * 0.18)} 50%, transparent)`,
            filter: 'blur(14px)',
            opacity: 0.6 + 0.4 * Math.sin(f / 20 + i),
          }}
        />
      ))}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 520, fontWeight: 700, letterSpacing: -20, color: 'transparent', WebkitTextStroke: `2px ${hexA('#ffffff', 0.12)}`, backgroundImage: `linear-gradient(180deg, ${hexA('#ffffff', 0.18)}, ${hexA(color, 0.05)})`, WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>
        {number}
      </div>
      {tiles.concat(tiles).concat(tiles).map((t, i) => {
        const x = (((i * step - f * speed) % (total * 3)) + total * 3) % (total * 3) - total + w / 2;
        const dist = Math.abs(x - w / 2) / step;
        const s = lerp(1.4, 1, clamp01(dist));
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 350, transform: `translate(-50%,-50%) scale(${s})`, zIndex: Math.round(100 - dist * 10), opacity: clamp01(1.6 - dist * 0.25)}}>
            <GlowTile size={tile} glow={dist < 0.5 ? color : '#ffffff'} strength={dist < 0.5 ? 0.9 : 0.25}>
              {t.logo ?? <span style={{color: t.color ?? '#fff'}}>{t.label}</span>}
            </GlowTile>
          </div>
        );
      })}
    </div>
  );
};

/** Isometric grid board with glowing grid lines (materialises radially) and extruded 3D tiles (15 21.8-38 s).
 * Tiles are {gx, gy, color, label}; `orbit` rotates the board around Z. */
export const IsoBoard: React.FC<{
  f: number;
  tiles: {gx: number; gy: number; color: string; label: string; at?: number}[];
  cells?: number;
  cell?: number;
  start?: number;
  orbit?: number;
  links?: [number, number][]; // dashed connectors between tile indices
}> = ({f, tiles, cells = 10, cell = 130, start = 0, orbit = 0, links = []}) => {
  const W = cells * cell;
  const grid = prog(f, start, start + 50);
  return (
    <div style={{position: 'relative', width: 0, height: 0, perspective: 3000}}>
      <div style={{position: 'absolute', left: -W / 2, top: -W / 2, width: W, height: W, transformStyle: 'preserve-3d', transform: `rotateX(58deg) rotateZ(${45 + orbit}deg)`}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.35) 2px, transparent 2px)`,
            backgroundSize: `${cell}px ${cell}px`,
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, #000 ${grid * 45}%, transparent ${grid * 70}%)`,
            maskImage: `radial-gradient(circle at 50% 50%, #000 ${grid * 45}%, transparent ${grid * 70}%)`,
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
          }}
        />
        <svg width={W} height={W} style={{position: 'absolute', overflow: 'visible'}}>
          {links.map(([a, b], i) => {
            const A = tiles[a],
              B = tiles[b];
            const p = prog(f, Math.max(A.at ?? 0, B.at ?? 0) + 14, Math.max(A.at ?? 0, B.at ?? 0) + 40);
            const d = `M ${(A.gx + 0.5) * cell} ${(A.gy + 0.5) * cell} L ${(B.gx + 0.5) * cell} ${(A.gy + 0.5) * cell} L ${(B.gx + 0.5) * cell} ${(B.gy + 0.5) * cell}`;
            const e = evolvePath(Math.max(0.0001, p), d);
            return (
              <g key={i}>
                <mask id={`isom${i}`}>
                  <path d={d} stroke="#fff" strokeWidth={10} fill="none" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />
                </mask>
                <path d={d} stroke="#3DDC97" strokeWidth={6} fill="none" strokeDasharray="16 14" mask={`url(#isom${i})`} />
              </g>
            );
          })}
        </svg>
        {tiles.map((t, i) => {
          const p = prog(f, t.at ?? start + 20 + i * 10, (t.at ?? start + 20 + i * 10) + 20, EASE.back);
          const H = 26 * p;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: t.gx * cell + 8,
                top: t.gy * cell + 8,
                width: cell * 2 - 16,
                height: cell * 1 - 16,
                transformStyle: 'preserve-3d',
                transform: `translateZ(${H + (1 - p) * 200}px)`,
                opacity: clamp01(p * 1.5),
              }}
            >
              {/* extrusion faces */}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: H, background: shade(t.color, -0.35), transformOrigin: 'bottom', transform: 'rotateX(-90deg)'}} />
              <div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: H, background: shade(t.color, -0.2), transformOrigin: 'right', transform: 'rotateY(90deg)'}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${shade(t.color, 0.15)}, ${t.color})`,
                  boxShadow: `0 0 40px ${hexA(t.color, 0.7)}, inset 0 0 0 2px rgba(255,255,255,0.35)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: SANS,
                  fontSize: 30,
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: 8,
                }}
              >
                {t.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** lighten (+) / darken (-) a hex colour */
export function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  const ch = (v: number) => Math.round(Math.max(0, Math.min(255, amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

// =====================================================================================
// 10. BUTTONS / PROFILE (16 / 13 / 20)
// =====================================================================================
/** Chunky 3D button with 8px side extrusion: press = scale 0.96 + sink (4f@30 -> 4f), colour swap, optional
 * fall rotateX 0->-85 around bottom edge (16 T9). */
export const PressButton3D: React.FC<{f: number; label: string; pressAt?: number; fallAt?: number; color?: string; pressedColor?: string; w?: number; h?: number; depth?: number; pressedLabel?: string}> = ({
  f,
  label,
  pressAt = 1e9,
  fallAt = 1e9,
  color = '#3DDC57',
  pressedColor = '#9aa0a6',
  w = 520,
  h = 140,
  depth = 16,
  pressedLabel,
}) => {
  const down = tw(f, [pressAt, pressAt + 4, pressAt + 12], [0, 1, 0.35], EASE.out);
  const col = prog(f, pressAt + 2, pressAt + 10);
  const fall = tw(f, [fallAt, fallAt + 8], [0, -85], EASE.in);
  const c = interpolateColors(col, [0, 1], [color, pressedColor]);
  return (
    <div style={{perspective: 900}}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: h * 0.3,
          background: c,
          transformOrigin: '50% 100%',
          transform: `translateY(${down * depth * 0.75}px) scale(${1 - down * 0.04}) rotateX(${fall}deg)`,
          boxShadow: `0 ${depth * (1 - down * 0.75)}px 0 ${shade(color, -0.35)}, 0 ${depth + 20}px 40px rgba(0,0,0,0.25), inset 0 3px 0 rgba(255,255,255,0.4)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: h * 0.36,
          letterSpacing: 0.5,
        }}
      >
        {col > 0.5 && pressedLabel ? pressedLabel : label}
      </div>
    </div>
  );
};

/** Glass profile card with avatar, name, handle, stats and emoji stickers popping (3f@30 = 6f stagger, back 1.7, +-12deg) (13 T3). */
export const ProfileCard: React.FC<{f: number; start?: number; name: string; handle: string; stats?: [string, string][]; stickers?: string[]; avatar?: string; w?: number; tint?: string}> = ({
  f,
  start = 0,
  name,
  handle,
  stats = [
    ['1.2M', 'followers'],
    ['348', 'videos'],
  ],
  stickers = ['🔥', '⭐', '🎬'],
  avatar,
  w = 520,
  tint = '#5B8CFF',
}) => {
  const p = pop(f, start, 18);
  return (
    <div style={{position: 'relative', transform: `scale(${p})`}}>
      <GlassCard w={w} h={w * 1.1} radius={40} tint={tint} glow={0.7}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: w * 0.1, fontFamily: SANS}}>
          <div style={{width: w * 0.36, height: w * 0.36, borderRadius: w, overflow: 'hidden', background: thumbBg(5), boxShadow: '0 0 0 5px rgba(255,255,255,0.5)'}}>
            {avatar ? <Img src={avatar} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
          </div>
          <div style={{fontSize: w * 0.08, fontWeight: 700, marginTop: 24}}>{name}</div>
          <div style={{fontSize: w * 0.05, opacity: 0.7}}>{handle}</div>
          <div style={{display: 'flex', gap: w * 0.12, marginTop: w * 0.07}}>
            {stats.map(([v, l], i) => (
              <div key={i} style={{textAlign: 'center'}}>
                <div style={{fontSize: w * 0.075, fontWeight: 700}}>{v}</div>
                <div style={{fontSize: w * 0.04, opacity: 0.7}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
      {stickers.map((s, i) => {
        const q = tw(f, [start + 14 + i * 6, start + 22 + i * 6, start + 28 + i * 6], [0, 1.25, 1], EASE.out);
        const pos = [
          [-40, 40],
          [w - 50, w * 0.25],
          [w * 0.7, w * 0.98],
        ][i % 3];
        return (
          <div key={i} style={{position: 'absolute', left: pos[0], top: pos[1], fontSize: 76, transform: `scale(${q}) rotate(${(i % 2 ? 12 : -12) * q}deg)`}}>
            {s}
          </div>
        );
      })}
    </div>
  );
};

// =====================================================================================
// 11. MARQUEE / CHIPS / FILES (02 / 09)
// =====================================================================================
/** "Trusted by" logo marquee with edge fade masks. */
export const LogoMarquee: React.FC<{f: number; logos: React.ReactNode[]; title?: string; speed?: number; w?: number; gap?: number; dark?: boolean}> = ({
  f,
  logos,
  title = 'Trusted by teams at',
  speed = 2,
  w = 1600,
  gap = 110,
  dark = false,
}) => {
  const item = 220 + gap;
  const total = logos.length * item;
  const off = (f * speed) % total;
  return (
    <div style={{width: w, fontFamily: SANS, textAlign: 'center'}}>
      <div style={{fontSize: 34, color: dark ? '#9a9aa6' : '#6b6b76', marginBottom: 36, fontWeight: 500}}>{title}</div>
      <div style={{position: 'relative', height: 110, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)'}}>
        <div style={{position: 'absolute', left: -off, top: 0, display: 'flex', height: 110, alignItems: 'center'}}>
          {logos.concat(logos).concat(logos).map((l, i) => (
            <div key={i} style={{width: 220, marginRight: gap, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.75, filter: 'grayscale(1)'}}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Wordmark stand-in for a logo in marquees */
export const Wordmark: React.FC<{text: string; color?: string; size?: number}> = ({text, color = '#222', size = 46}) => (
  <span style={{fontFamily: SANS, fontWeight: 800, fontSize: size, color, letterSpacing: -1}}>{text}</span>
);

/** Feature-chip pyramid (02): rows of pills (1,2,3,...) that pop in row by row, centred. */
export const ChipPyramid: React.FC<{f: number; rows: string[][]; start?: number; stagger?: number; accent?: string; dark?: boolean}> = ({f, rows, start = 0, stagger = 5, accent = '#8A5BE0', dark = false}) => {
  let k = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, fontFamily: SANS}}>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', gap: 22}}>
          {r.map((c) => {
            const s = start + k++ * stagger;
            const p = pop(f, s, 14);
            return (
              <div
                key={c}
                style={{
                  transform: `scale(${p}) translateY(${(1 - Math.min(1, p)) * 30}px)`,
                  opacity: clamp01(p * 2),
                  padding: '22px 40px',
                  borderRadius: 999,
                  fontSize: 36,
                  fontWeight: 600,
                  color: ri === 0 ? '#fff' : dark ? '#fff' : '#222',
                  background: ri === 0 ? `linear-gradient(90deg,#B48BF0,${accent})` : dark ? 'rgba(255,255,255,0.08)' : '#fff',
                  boxShadow: ri === 0 ? `0 8px 20px ${hexA(accent, 0.35)}` : '0 8px 24px rgba(40,20,90,0.1), inset 0 0 0 1.5px rgba(0,0,0,0.05)',
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** File icon (document sheet with folded corner + extension tag). */
export const FileIcon: React.FC<{ext?: string; color?: string; size?: number}> = ({ext = 'PDF', color = '#E5484D', size = 120}) => (
  <div style={{width: size, height: size * 1.25, position: 'relative', fontFamily: SANS}}>
    <svg width={size} height={size * 1.25} viewBox="0 0 40 50" style={{position: 'absolute', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.18))'}}>
      <path d="M4 2h22l10 10v34a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="#fff" />
      <path d="M26 2v8a2 2 0 0 0 2 2h8" fill="#e7e9ef" />
    </svg>
    <div style={{position: 'absolute', left: -size * 0.08, bottom: size * 0.2, background: color, color: '#fff', fontWeight: 700, fontSize: size * 0.2, padding: `${size * 0.03}px ${size * 0.08}px`, borderRadius: size * 0.06}}>{ext}</div>
  </div>
);

/** Drag-and-drop with physicality (02 T9 + 09): file follows a bezier, tilts with velocity (clamp(vx*0.6,+-10)),
 * drop squash 1->0.9->1 over 6f@30, zone border dashed->solid, then the upload row with progress bar fills. */
export const FileDrop: React.FC<{
  f: number;
  from?: XY;
  dropAt?: number; // frame of drop
  dragFrames?: number;
  fileName?: string;
  meta?: string;
  progressTo?: number;
  uploadFrames?: number;
  accent?: string;
  w?: number;
  cursor?: React.ReactNode;
}> = ({f, from = {x: 1100, y: -380}, dropAt = 50, dragFrames = 44, fileName = 'Campaign Plan 2025.pdf', meta = '24 MB', progressTo = 1, uploadFrames = 90, accent = '#0791E9', w = 900, cursor}) => {
  const t = prog(f, dropAt - dragFrames, dropAt, EASE.inOut);
  const bez = (a: number, b: number, c: number, u: number) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  const to = {x: w / 2, y: 190};
  const ctrl = {x: (from.x + to.x) / 2 + 200, y: Math.min(from.y, to.y) - 200};
  const x = bez(from.x, ctrl.x, to.x, t),
    y = bez(from.y, ctrl.y, to.y, t);
  const t2 = prog(f - 1, dropAt - dragFrames, dropAt, EASE.inOut);
  const vx = x - bez(from.x, ctrl.x, to.x, t2);
  const tilt = Math.max(-10, Math.min(10, vx * 0.6));
  const squash = tw(f, [dropAt, dropAt + 6, dropAt + 12], [1, 0.9, 1], EASE.out);
  const dropped = f >= dropAt;
  const hover = prog(f, dropAt - 16, dropAt - 4);
  const rowP = prog(f, dropAt + 6, dropAt + 20);
  const up = countUp(f, dropAt + 16, dropAt + 16 + uploadFrames, 0, progressTo);
  return (
    <div style={{position: 'relative', width: w, height: 560, fontFamily: SANS}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: 380,
          borderRadius: 32,
          border: `4px ${hover > 0.5 || dropped ? 'solid' : 'dashed'} ${interpolateColors(hover, [0, 1], ['#C9D3DF', accent])}`,
          background: interpolateColors(hover, [0, 1], ['rgba(255,255,255,0.8)', 'rgba(7,145,233,0.06)']),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 46,
          color: '#5a6472',
          fontSize: 32,
        }}
      >
        <div style={{fontWeight: 600, color: '#111'}}>Import your file</div>
        <div style={{fontSize: 26, marginTop: 6}}>Drag and drop or browse</div>
      </div>
      {!dropped || f < dropAt + 10 ? (
        <div
          style={{
            position: 'absolute',
            left: x - 60,
            top: y - 75,
            transform: `rotate(${dropped ? 0 : tilt}deg) scale(${squash * (dropped ? 1 - prog(f, dropAt + 2, dropAt + 10) : 1)})`,
            zIndex: 5,
          }}
        >
          <FileIcon />
          <CursorSlot x={70} y={80} cursor={cursor} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          top: 410,
          left: 0,
          width: w,
          height: lerp(0, 130, rowP),
          opacity: rowP,
          overflow: 'hidden',
          borderRadius: 26,
          background: '#fff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          padding: '0 30px',
        }}
      >
        <div style={{transform: 'scale(0.5)', margin: '-30px -30px'}}>
          <FileIcon />
        </div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', fontSize: 30, fontWeight: 600, color: '#111'}}>
            <span style={{flex: 1}}>{fileName}</span>
            <span style={{color: accent, fontVariantNumeric: 'tabular-nums'}}>{Math.round(up * 100)}%</span>
          </div>
          <div style={{fontSize: 24, color: '#7a828e', margin: '4px 0 12px'}}>{meta}</div>
          <div style={{height: 12, borderRadius: 6, background: '#E6EEF6', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${up * 100}%`, borderRadius: 6, background: accent, boxShadow: `0 0 12px ${hexA(accent, 0.6)}`}} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Toast -> upload card -> pill -> message bubble morph chain (09 5.7-12.6 s). One container whose
 * width/height/radius/colour interpolate between stages; each stage's content cross-fades with blur.
 * `at` = start frame of each of the 4 stages. */
export const MorphChain: React.FC<{
  f: number;
  at?: [number, number, number, number];
  toast?: string;
  file?: {name: string; meta: string};
  pill?: string;
  bubble?: string;
  accent?: string;
}> = ({f, at = [0, 50, 130, 190], toast = 'Your file is too big!', file = {name: 'Campaign Plan 2025', meta: 'PDF · 24MB · 10 years left'}, pill = 'Get Plus', bubble = 'Sent! Here’s the link 🎉', accent = '#0B8DE1'}) => {
  const D = 14;
  const st = at.map((a) => prog(f, a, a + D, EASE.out));
  const shapes = [
    {w: 640, h: 110, r: 18, c: '#ffffff'},
    {w: 760, h: 240, r: 26, c: '#ffffff'},
    {w: 360, h: 120, r: 60, c: accent},
    {w: 620, h: 120, r: 40, c: '#E9F3FF'},
  ];
  let cur = shapes[0];
  for (let i = 1; i < 4; i++) {
    const p = st[i];
    cur = {w: lerp(cur.w, shapes[i].w, p), h: lerp(cur.h, shapes[i].h, p), r: lerp(cur.r, shapes[i].r, p), c: interpolateColors(p, [0, 1], [cur.c, shapes[i].c])};
  }
  // blob squish at the card->pill hand-off (09 "squishes into a blurred blue blob")
  const squish = Math.sin(Math.PI * st[2]) * (st[2] < 1 ? 1 : 0);
  const vis = (i: number) => (i === 3 ? st[3] : Math.min(st[i], 1 - st[i + 1]));
  const layer = (i: number, node: React.ReactNode) => {
    const v = vis(i);
    return <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 30px', opacity: v, filter: `blur(${(1 - v) * 8}px)`}}>{node}</div>;
  };
  const words = toast.split(' ');
  const up = countUp(f, at[1] + 10, at[2] - 10, 0.3, 0.65);
  const pillPress = tw(f, [at[3] - 14, at[3] - 10, at[3] - 4], [0, 1, 0], EASE.out);
  return (
    <div
      style={{
        position: 'relative',
        width: cur.w,
        height: cur.h,
        borderRadius: cur.r,
        background: cur.c,
        boxShadow: '0 4px 14px rgba(0,0,0,0.08), 0 20px 50px rgba(7,145,233,0.12)',
        fontFamily: SANS,
        transform: `scale(${(1 + squish * 0.08) * (1 - pillPress * 0.05)}, ${1 - squish * 0.12})`,
        filter: `blur(${squish * 6}px)`,
        opacity: prog(f, at[0], at[0] + 8),
        overflow: 'hidden',
      }}
    >
      {layer(
        0,
        <div style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 34, fontWeight: 600, color: '#111'}}>
          <div style={{width: 60, height: 60, borderRadius: 30, background: '#FFE3E3', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="tri" size={30} color="#E5484D" />
          </div>
          {words.map((w, i) => (
            <span key={i} style={{opacity: prog(f, at[0] + 6 + i * 5, at[0] + 12 + i * 5), marginRight: -8}}>
              {w}
            </span>
          ))}
        </div>,
      )}
      {layer(
        1,
        <div style={{display: 'flex', alignItems: 'center', gap: 26, width: '100%'}}>
          <FileIcon size={96} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 34, fontWeight: 600, color: '#111'}}>{file.name}</div>
            <div style={{fontSize: 24, color: '#7a828e', margin: '6px 0 16px'}}>{file.meta}</div>
            <div style={{height: 14, borderRadius: 7, background: '#E6EEF6'}}>
              <div style={{height: '100%', width: `${up * 100}%`, borderRadius: 7, background: accent}} />
            </div>
          </div>
        </div>,
      )}
      {layer(2, <div style={{width: '100%', textAlign: 'center', color: '#fff', fontWeight: 600, fontSize: 40}}>{typed(pill, f, at[2] + 8, 14)}</div>)}
      {layer(
        3,
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 32, color: '#0B3B66', fontWeight: 500}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: thumbBg(2)}} />
          {typed(bubble, f, at[3] + 6, 30)}
        </div>,
      )}
    </div>
  );
};

// =====================================================================================
// 12. TEXT-UI EXTRAS (01 / 15)
// =====================================================================================
/** iOS text-selection highlight (01 T2): rgba(79,159,212,.85) rect grows over 6f@30 (12f), word turns black, blue handles. */
export const SelectHighlight: React.FC<{f: number; start?: number; children: React.ReactNode; size?: number; color?: string}> = ({f, start = 0, children, size = 90, color = '#fff'}) => {
  const p = prog(f, start, start + 12, (t) => 1 - Math.pow(1 - t, 3));
  const handle = (side: 'l' | 'r') => (
    <div style={{position: 'absolute', top: -14, bottom: 0, [side === 'l' ? 'left' : 'right']: -2, width: 4, background: '#0333F5', opacity: p > 0 ? 1 : 0}}>
      <div style={{position: 'absolute', [side === 'l' ? 'top' : 'bottom']: -14, left: -12, width: 28, height: 28, borderRadius: 14, background: '#0333F5'}} />
    </div>
  );
  return (
    <span style={{position: 'relative', display: 'inline-block', fontFamily: SANS, fontSize: size, fontWeight: 600, color}}>
      <span style={{position: 'absolute', inset: '-0.02em -0.06em', background: 'rgba(79,159,212,0.85)', transformOrigin: 'left', transform: `scaleX(${p})`}} />
      <span style={{position: 'relative'}}>{children}</span>
      <span style={{position: 'absolute', inset: 0, color: '#000', clipPath: `inset(0 ${100 - p * 100}% 0 0)`}}>{children}</span>
      <span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`}}>
        {handle('l')}
        {handle('r')}
      </span>
    </span>
  );
};

/** Tag box with red cross / green check (15 "tasks you don't like" vs templates). */
export const StatusTag: React.FC<{f: number; start?: number; text: string; ok?: boolean; cps?: number}> = ({f, start = 0, text, ok = false, cps = 22}) => {
  const c = ok ? '#22C55E' : '#FF3048';
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, padding: '16px 26px', borderRadius: 14, background: ok ? '#0F2A18' : '#3A1218', border: `2px solid ${ok ? '#1F8A44' : '#C0303A'}`, fontFamily: SANS, fontSize: 36, color: '#fff', ...blurIn(f, start, 8, 10)}}>
      <span>
        {typed(text, f, start + 4, cps)}
        {typed(text, f, start + 4, cps).length < text.length ? <Caret f={f} color="#fff" /> : null}
      </span>
      <span style={{color: c, fontWeight: 700, transform: `scale(${pop(f, start + 4 + (text.length / cps) * 60, 10)})`, display: 'inline-block'}}>{ok ? '✓' : '✕'}</span>
    </div>
  );
};

/** Approval card with orange-red border and approve press → green confirmation row (15 27.2-30.4 s). */
export const ApprovalCard: React.FC<{f: number; start?: number; title?: string; body?: string; approveAt?: number; done?: string; w?: number}> = ({
  f,
  start = 0,
  title = 'Margo – Invoice Chasing',
  body = 'Margo wants to send a refund of $230 to acme.com',
  approveAt = 1e9,
  done = 'Refund sent – customer notified',
  w = 900,
}) => {
  const press = tw(f, [approveAt, approveAt + 4, approveAt + 12], [0, 1, 0], EASE.out);
  const row = prog(f, approveAt + 10, approveAt + 26);
  return (
    <div style={{width: w, fontFamily: SANS, ...blurIn(f, start, 14, 20)}}>
      <div style={{borderRadius: 30, padding: 36, background: '#141416', border: '2px solid #F0643C', boxShadow: '0 0 40px rgba(240,100,60,0.25), inset 0 1px 0 rgba(255,255,255,0.15)', color: '#fff'}}>
        <div style={{fontSize: 34, fontWeight: 600}}>{title}</div>
        <div style={{display: 'inline-block', marginTop: 12, padding: '6px 16px', borderRadius: 999, background: 'rgba(240,100,60,0.18)', color: '#FF8A5C', fontSize: 24}}>Approval required</div>
        <div style={{fontSize: 30, color: '#c9c9d0', marginTop: 20, lineHeight: 1.4}}>{body}</div>
        <div style={{display: 'flex', gap: 18, marginTop: 28}}>
          <div style={{padding: '18px 40px', borderRadius: 18, background: '#fff', color: '#111', fontSize: 30, fontWeight: 600, transform: `scale(${1 - press * 0.06})`}}>Approve</div>
          <div style={{padding: '18px 40px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', fontSize: 30}}>Decline</div>
        </div>
      </div>
      <div style={{height: lerp(0, 100, row), opacity: row, overflow: 'hidden', marginTop: 16 * row, borderRadius: 22, background: '#0F2A18', border: '2px solid #1F8A44', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', color: '#5BE38A', fontSize: 30}}>
        ✓ {done}
      </div>
    </div>
  );
};

/** Full-bleed helper so gallery/demo scenes can drop blocks centred. */
export const Center: React.FC<{children: React.ReactNode; x?: number; y?: number; scale?: number}> = ({children, x = 50, y = 50, scale = 1}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) scale(${scale})`}}>{children}</div>
  </AbsoluteFill>
);
