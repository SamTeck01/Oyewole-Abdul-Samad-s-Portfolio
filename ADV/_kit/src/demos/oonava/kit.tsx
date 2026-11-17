// Oonava shared kit: brand tokens + reusable UI pieces for V1-V7.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';

export const C = {
  ink: '#03030F', blue: '#26A0F8', deep: '#0B6FC0', g1: '#F3F3F3', g2: '#E4E4E7',
  mute: '#6B7075', green: '#28C840', red: '#C8322F', white: '#FFFFFF', card: '#0B0B16',
};
export const SANS = '"Inter Display", Inter, system-ui, sans-serif';
export const SERIF = '"Instrument Serif", serif';

/** layout unit: 1 = 1px at 1080 short side */
export const useU = () => {
  const {width: W, height: H} = useVideoConfig();
  return {W, H, u: Math.min(W, H) / 1080, tall: H > W};
};

/** slide-up + fade, the house entrance */
export const rise = (f: number, at: number, dist = 40, dur = 22) => {
  const p = prog(f, at, at + dur);
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};
export const out = (f: number, at: number, dur = 10) => ({opacity: 1 - prog(f, at, at + dur, EASE.in)});

/** headline words that rise one by one; `accent` words go serif italic blue */
export const Head: React.FC<{
  words: string[]; at: number; size: number; color?: string; accent?: string[]; gap?: number; weight?: number; stagger?: number; align?: 'center' | 'left';
}> = ({words, at, size, color = C.white, accent = [], gap = 4, weight = 600, stagger = 4, align = 'center'}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', columnGap: size * 0.26, rowGap: gap, fontFamily: SANS, fontSize: size, fontWeight: weight, letterSpacing: '-0.035em', lineHeight: 1.04, color}}>
      {words.map((w, i) => {
        const a = accent.includes(w);
        const p = prog(f, at + i * stagger, at + i * stagger + 20);
        return (
          <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * size * 0.5}px)`, filter: `blur(${(1 - p) * 8}px)`,
            ...(a ? {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, color: C.blue, letterSpacing: '-0.01em', fontSize: size * 1.12} : {})}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Wordmark: React.FC<{w: number; dark?: boolean}> = ({w, dark = true}) => (
  <Img src={staticFile(dark ? 'oon/wordmark_black.png' : 'oon/wordmark_white.png')} style={{width: w}} />
);

/** UI window card (browser-ish) */
export const Card: React.FC<{w: number; h?: number; url?: string; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, h, url, dark, children, style}) => {
  const bar = 54;
  return (
    <div style={{width: w, height: h, borderRadius: 28, overflow: 'hidden', background: dark ? C.card : C.white,
      border: `1.5px solid ${dark ? 'rgba(255,255,255,.08)' : C.g2}`, boxShadow: dark ? '0 40px 90px rgba(0,0,0,.5)' : '0 40px 90px rgba(11,40,80,.14)', fontFamily: SANS, ...style}}>
      {url !== undefined && (
        <div style={{height: bar, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: dark ? 'rgba(255,255,255,.03)' : C.g1, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.06)' : C.g2}`}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 9, background: c}} />)}
          <div style={{marginLeft: 16, fontSize: 21, color: dark ? '#8A8F99' : C.mute, fontWeight: 500}}>{url}</div>
        </div>
      )}
      {children}
    </div>
  );
};

/** iOS-style notification toast */
export const Toast: React.FC<{title: string; body: string; app?: string; w: number; dark?: boolean; icon?: string}> = ({title, body, app = 'Inbox', w, dark = true, icon}) => (
  <div style={{width: w, borderRadius: 34, padding: '26px 30px', display: 'flex', gap: 22, alignItems: 'center', fontFamily: SANS,
    background: dark ? 'rgba(38,40,52,.82)' : 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)', border: dark ? '1px solid rgba(255,255,255,.08)' : `1px solid ${C.g2}`,
    boxShadow: '0 30px 60px rgba(0,0,0,.35)'}}>
    <div style={{width: 72, height: 72, borderRadius: 18, background: icon ? 'transparent' : C.blue, flexShrink: 0, overflow: 'hidden', display: 'grid', placeItems: 'center'}}>
      {icon ? <Img src={staticFile(icon)} style={{width: 72, height: 72}} /> : <Mail s={40} c="#fff" />}
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, color: dark ? '#9EA3AE' : C.mute, fontWeight: 500}}><span>{app}</span><span>now</span></div>
      <div style={{fontSize: 30, fontWeight: 650, color: dark ? '#fff' : C.ink, marginTop: 4}}>{title}</div>
      <div style={{fontSize: 26, color: dark ? '#C9CDD6' : '#3A3F47', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{body}</div>
    </div>
  </div>
);

/** small line icons */
export const Mail: React.FC<{s: number; c: string}> = ({s, c}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
const PATHS: Record<string, React.ReactNode> = {
  crm: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" /><path d="M16 5.5a3 3 0 0 1 0 5.6M18 14.6c1.4.6 2.3 1.9 2.6 4.4" /></>,
  cal: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  chat: <><path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4A8 8 0 1 1 20 12Z" /><path d="M9 10.5c.3 2 1.8 3.6 4 4" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.6" /><rect x="13" y="4" width="7" height="7" rx="1.6" /><rect x="4" y="13" width="7" height="7" rx="1.6" /><rect x="13" y="13" width="7" height="7" rx="1.6" /></>,
};
export const Ico: React.FC<{n: keyof typeof PATHS | string; s: number; c: string; sw?: number}> = ({n, s, c, sw = 1.9}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{PATHS[n]}</svg>
);

/** status chip */
export const Chip: React.FC<{text: string; tone?: 'green' | 'blue' | 'red' | 'grey'; size?: number; icon?: string}> = ({text, tone = 'green', size = 26, icon}) => {
  const col = {green: C.green, blue: C.blue, red: C.red, grey: C.mute}[tone];
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.35, padding: `${size * 0.42}px ${size * 0.75}px`, borderRadius: 99, fontFamily: SANS, fontSize: size, fontWeight: 600,
      color: col, background: `${col}1A`, border: `1.5px solid ${col}40`}}>
      {icon && <Ico n={icon} s={size * 1.05} c={col} sw={2.4} />}{text}
    </div>
  );
};

/** caption track: word-timed, max 7 words, active word in blue */
export type W = {word: string; start: number; end: number};
export const Captions: React.FC<{words: W[]; offset: number; dark: boolean; y: number; size: number; hide?: [number, number][]}> = ({words, offset, dark, y, size, hide = []}) => {
  const f = useCurrentFrame();
  const t = f / 60 - offset;
  if (hide.some(([a, b]) => t + offset >= a && t + offset < b)) return null;
  // chunk at sentence/comma ends or 6 words
  const chunks: W[][] = [];
  let cur: W[] = [];
  words.forEach((w) => {
    if (w.word === '...') return;
    cur.push(w);
    if (/[.,?!]$/.test(w.word) || cur.length >= 6) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  for (let i = chunks.length - 1; i > 0; i--) if (chunks[i].length < 3 && chunks[i - 1].length + chunks[i].length <= 7) { chunks[i - 1] = chunks[i - 1].concat(chunks[i]); chunks.splice(i, 1); }
  const ch = chunks.find((c, i) => t >= c[0].start - 0.05 && t < (chunks[i + 1]?.[0].start ?? c[c.length - 1].end + 0.6) - 0.05);
  if (!ch || t > ch[ch.length - 1].end + 0.5) return null;
  const st = (ch[0].start + offset) * 60;
  const p = prog(f, st - 3, st + 9);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, maxWidth: '86%', fontFamily: SANS, fontSize: size, fontWeight: 650, letterSpacing: '-0.02em',
        padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: size * 0.6, background: dark ? 'rgba(3,3,15,.55)' : 'rgba(255,255,255,.75)'}}>
        {ch.map((w, i) => {
          const on = t >= w.start - 0.02;
          return <span key={i} style={{color: on ? (t < w.end + 0.08 ? C.blue : dark ? '#fff' : C.ink) : dark ? 'rgba(255,255,255,.35)' : 'rgba(3,3,15,.3)'}}>{w.word.replace(/^(\w)/, (m) => m)}</span>;
        })}
      </div>
    </div>
  );
};

/** end card shared by all videos */
export const EndCard: React.FC<{at: number; extra?: string}> = ({at, extra}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  const btn = prog(f, at + 34, at + 64, EASE.back);
  const press = tw(f, [at + 100, at + 106, at + 116], [1, 0.94, 1], EASE.inOut);
  const cx = tw(f, [at + 64, at + 98], [700, 540], EASE.inOut);
  const cy = tw(f, [at + 64, at + 98], [H / u - 200, H / u / 2 + 150], EASE.inOut);
  return (
    <AbsoluteFill style={{background: C.white, alignItems: 'center', justifyContent: 'center', opacity: prog(f, at - 8, at + 6)}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${u})`}}>
        <div style={{...rise(f, at, 60, 28)}}><Wordmark w={620} /></div>
        <div style={{marginTop: 34, fontFamily: SANS, fontSize: 46, fontWeight: 600, letterSpacing: '-0.03em', color: C.ink, ...rise(f, at + 14)}}>
          Automate. Integrate. <span style={{color: C.blue}}>Build.</span>
        </div>
        <div style={{marginTop: 70, transform: `scale(${btn * press})`, opacity: Math.min(1, btn * 2), padding: '30px 52px', borderRadius: 99, background: C.ink, color: '#fff',
          fontFamily: SANS, fontSize: 38, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 24px 50px rgba(38,160,248,.28)'}}>
          Book a free 30-min mapping call <span style={{width: 16, height: 16, borderRadius: 9, background: C.blue}} />
        </div>
        {extra && <div style={{marginTop: 36, fontFamily: SANS, fontSize: 34, fontWeight: 500, color: C.mute, ...rise(f, at + 70)}}>{extra}</div>}
        <div style={{marginTop: 40, fontFamily: SANS, fontSize: 40, fontWeight: 650, color: C.deep, ...rise(f, at + 80)}}>oonava.com</div>
      </div>
      <div style={{position: 'absolute', left: cx * u, top: cy * u, opacity: tw(f, [at + 60, at + 70, at + 150, at + 165], [0, 1, 1, 0])}}>
        <svg width={56 * u} height={56 * u} viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#000" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
};
