// Haixing Precision marketing film (EN). Dark premium industrial look in brand red/blue; 3D lathe
// hook, continuous camera, real client photos, word-timed supers. 1920x1080 60 fps.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {EASE, tw} from '../kit/core';
import {ReplaceCaption, Word} from '../kit/captions';
import WORDS from './hx.words.json';

const A = 0.5;
const WD = WORDS as Word[];
const W = WD.map((w) => w.start + A);
export const HX_DURATION = Math.round((W[W.length - 1] + 3.6) * 60);
const RED = '#e3262e';
const BLUE = '#2f55ff';
const BG = '#06080d';
const SANS = 'Inter, sans-serif';
const ap = (t: number, a: number, d = 0.7) => tw(t, [a, a + d], [0, 1], EASE.out);
const win = (t: number, a: number, b: number, r = 0.5) => Math.min(tw(t, [a, a + r], [0, 1], EASE.inOut), tw(t, [b - r, b], [1, 0], EASE.inOut));
const im = (f: string) => staticFile(`hx/${f}`);

const Photo: React.FC<{src: string; t: number; a: number; b: number; z0?: number; z1?: number; x?: number; dark?: number}> = ({src, t, a, b, z0 = 1.04, z1 = 1.16, x = 0, dark = 0.45}) => {
  const p = tw(t, [a, b], [0, 1]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={im(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z0 + (z1 - z0) * p}) translateX(${x * p}px)`}} />
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(6,8,13,${dark + 0.4}) 0%, rgba(6,8,13,${dark}) 55%, rgba(6,8,13,${dark * 0.5}) 100%)`}} />
    </AbsoluteFill>
  );
};

// a scene that fades/blur-scales in and out (camera keeps moving through cuts)
const Shot: React.FC<{t: number; a: number; b: number; children: React.ReactNode}> = ({t, a, b, children}) => {
  if (t < a - 0.01 || t > b + 0.45) return null;
  const i = tw(t, [a, a + 0.45], [0, 1], EASE.out);
  const o = tw(t, [b, b + 0.45], [0, 1], EASE.in);
  return (
    <AbsoluteFill style={{opacity: Math.min(i, 1 - o), transform: `scale(${1.08 - 0.08 * i + 0.1 * o})`, filter: `blur(${(1 - i) * 14 + o * 18}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{t: number; a: number; text: string; color?: string}> = ({t, a, text, color = RED}) => (
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color, opacity: ap(t, a), transform: `translateY(${(1 - ap(t, a)) * 14}px)`}}>{text}</div>
);
const Big: React.FC<{t: number; a: number; children: React.ReactNode; size?: number}> = ({t, a, children, size = 96}) => {
  const p = ap(t, a, 0.8);
  return <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.035, lineHeight: 1.02, color: '#fff', opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 30}px)`}}>{children}</div>;
};
const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 28, backdropFilter: 'blur(18px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', ...style}}>{children}</div>
);

const count = (t: number, a: number, b: number, to: number) => Math.round(to * tw(t, [a, b], [0, 1], EASE.count));

const Scene: React.FC<{t: number}> = ({t}) => {
  const hf = Math.min(150, Math.floor(t * 30) + 1);
  const s2 = W[8] - 0.2,
    s3 = W[21] - 0.4,
    s4 = W[34] - 0.3,
    s5 = W[65] - 0.6,
    s6 = W[83] - 0.5;
  // process track camera
  const nodes = [
    [W[37], 'Drawing', 'Your drawing or sample', 'p-003-016.png'],
    [W[42], 'Programming', 'CNC programs written in-house', 'm_087.png'],
    [W[44], 'Prototype', 'Samples in 24 hours', 'm_088.png'],
    [W[50], 'Production', 'One piece to full batch', 'p-020-243.png'],
    [W[60], 'Inspection', 'Pass rate 99%+', 'm_085.png'],
  ] as [number, string, string, string][];
  const ni = nodes.reduce((k, n, i) => (t >= n[0] - 0.3 ? i : k), 0);
  const camX = (() => {
    let x = 0;
    nodes.forEach((n, i) => {
      if (i > 0) x += 640 * tw(t, [n[0] - 0.55, n[0] + 0.15], [0, 1], EASE.inOut);
    });
    return x;
  })();
  const parts = [
    ['part_107.png', W[65], -600, -40, 0.85],
    ['part_135.png', W[66], -210, 30, 0.95],
    ['part_152.png', W[67], 200, -20, 0.95],
    ['part_167.png', W[68], 590, 40, 0.75],
    ['part_133.png', W[69], -330, 260, 0.6],
    ['part_156.png', W[69] + 0.2, 400, 270, 0.6],
  ] as [string, number, number, number, number][];
  return (
    <AbsoluteFill style={{background: BG}}>
      {/* 1. hook: 3D lathe */}
      <Shot t={t} a={-1} b={s2}>
        <Img src={im(`hook/f_${String(hf).padStart(4, '0')}.png`)} style={{width: '100%', height: '100%'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6))'}} />
        <div style={{position: 'absolute', left: 140, top: 760}}>
          <Big t={t} a={W[5] - 0.1} size={84}>
            One <span style={{color: RED}}>perfect</span> part.
          </Big>
        </div>
      </Shot>
      {/* 2. factory + brand */}
      <Shot t={t} a={s2} b={s3}>
        <Photo src="p-001-003.png" t={t} a={s2} b={s3 + 0.5} x={-60} />
        <div style={{position: 'absolute', left: 140, top: 300}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <Img src={im('logo_star.png')} style={{height: 150, opacity: ap(t, W[9] - 0.3), transform: `scale(${tw(ap(t, W[9] - 0.3, 0.6), [0, 1], [0.5, 1], EASE.back)}) rotate(${(1 - ap(t, W[9] - 0.3)) * -40}deg)`}} />
            <div>
              <Big t={t} a={W[9]} size={120}>
                <span style={{color: RED}}>HAIXING</span>
              </Big>
              <Big t={t} a={W[10]} size={56}>
                Precision Technology
              </Big>
            </div>
          </div>
          <div style={{display: 'flex', gap: 18, marginTop: 40}}>
            {[
              ['Shenzhen, China', W[12]],
              [`Since ${count(t, W[19], W[20] + 0.4, 2013)}`, W[19]],
            ].map(([s, a]) => (
              <Glass key={String(a)} style={{padding: '16px 28px', opacity: ap(t, a as number), transform: `translateY(${(1 - ap(t, a as number)) * 20}px)`}}>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: '#fff'}}>{s}</div>
              </Glass>
            ))}
          </div>
        </div>
      </Shot>
      {/* 3. people + capability */}
      <Shot t={t} a={s3} b={s4}>
        <Photo src="m_089.png" t={t} a={s3} b={s4 + 0.5} dark={0.62} z0={1.15} z1={1.05} />
        <div style={{position: 'absolute', left: 140, top: 190}}>
          <Kicker t={t} a={W[21]} text="OUR TEAM" />
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 200, letterSpacing: -8, color: '#fff', lineHeight: 1, opacity: ap(t, W[21])}}>
            {count(t, W[21], W[24] + 0.5, 100)}
            <span style={{color: RED}}>+</span>
          </div>
          <Big t={t} a={W[25]} size={48}>
            skilled people
          </Big>
        </div>
        <div style={{position: 'absolute', left: 820, top: 250, display: 'flex', gap: 26}}>
          {[
            ['p-003-016.png', 'Five-axis machining', W[27]],
            ['m_088.png', 'CNC turning', W[29]],
            ['m_085.png', 'Full inspection', W[32]],
          ].map(([src, label, a], i) => {
            const p = ap(t, (a as number) - 0.15, 0.8);
            return (
              <Glass key={i} style={{width: 300, padding: 14, opacity: p, transform: `translateY(${(1 - p) * 80 + Math.sin(t * 1.3 + i) * 6}px) rotate(${(1 - p) * 6}deg)`, filter: `blur(${(1 - p) * 8}px)`}}>
                <Img src={im(src as string)} style={{width: '100%', height: 380, objectFit: 'cover', borderRadius: 18}} />
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: '#fff', padding: '16px 6px 4px'}}>{label}</div>
              </Glass>
            );
          })}
        </div>
      </Shot>
      {/* 4. process: one continuous camera move */}
      <Shot t={t} a={s4} b={s5}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 40%, #13213f 0%, ${BG} 60%)`}} />
        <div style={{position: 'absolute', left: 140, top: 110}}>
          <Kicker t={t} a={s4 + 0.2} text="HOW WE WORK" color={BLUE} />
          <Big t={t} a={s4 + 0.3} size={64}>
            From drawing to delivery.
          </Big>
        </div>
        <div style={{position: 'absolute', left: 620 - camX, top: 300, width: 4000, height: 600}}>
          <div style={{position: 'absolute', left: 0, top: 250, height: 4, width: 640 * 4 * tw(t, [s4, W[60] + 0.5], [0, 1]), background: `linear-gradient(90deg, ${BLUE}, ${RED})`, borderRadius: 2}} />
          {nodes.map(([a, title, sub, src], i) => {
            const p = ap(t, a - 0.2, 0.7);
            const act = i === ni ? 1 : 0.45;
            return (
              <div key={i} style={{position: 'absolute', left: i * 640 - 30, top: 0, width: 560, opacity: Math.max(0.15, p) * act + (1 - act) * 0.35 * p}}>
                <div style={{position: 'absolute', left: 0, top: 226, width: 52, height: 52, borderRadius: 26, background: i === ni ? RED : '#1b2233', border: '3px solid #fff', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tw(p, [0, 1], [0.3, 1], EASE.back)})`}}>{i + 1}</div>
                <Glass style={{position: 'absolute', left: 80, top: -60, width: 480, padding: 14, transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * act})`, transformOrigin: '0 50%'}}>
                  <Img src={im(src)} style={{width: '100%', height: 300, objectFit: 'cover', borderRadius: 16}} />
                  <div style={{fontFamily: SANS, color: '#fff', padding: '14px 6px 6px'}}>
                    <div style={{fontWeight: 700, fontSize: 34}}>{title}</div>
                    <div style={{fontWeight: 500, fontSize: 22, opacity: 0.7, marginTop: 4}}>{sub}</div>
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
        {/* 99% gauge */}
        {(() => {
          const g = ap(t, W[60] - 0.2, 1.4);
          if (g <= 0) return null;
          const v = 99 * tw(t, [W[60], W[64] + 0.3], [0, 1], EASE.count);
          return (
            <div style={{position: 'absolute', right: 150, top: 120, opacity: g}}>
              <svg width={240} height={240} viewBox="0 0 240 240">
                <circle cx={120} cy={120} r={100} stroke="rgba(255,255,255,0.12)" strokeWidth={14} fill="none" />
                <circle cx={120} cy={120} r={100} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={`${(628 * v) / 100} 628`} transform="rotate(-90 120 120)" />
                <text x={120} y={135} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={56} fill="#fff">
                  {Math.round(v)}%
                </text>
              </svg>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, color: '#fff', textAlign: 'center', opacity: 0.8}}>pass rate</div>
            </div>
          );
        })()}
      </Shot>
      {/* 5. products */}
      <Shot t={t} a={s5} b={s6}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #1d2235 0%, ${BG} 65%)`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center'}}>
          <Kicker t={t} a={s5 + 0.2} text="WHAT WE MAKE" />
        </div>
        {parts.map(([src, a, x, y, s], i) => {
          const p = ap(t, a - 0.15, 0.9);
          const fl = Math.sin(t * 1.1 + i * 1.7) * 10;
          const shrink = tw(t, [W[69], W[69] + 0.8], [1, 0.82], EASE.inOut);
          return (
            <div key={i} style={{position: 'absolute', left: 960 + x * shrink, top: 520 + y * shrink - 80 * (1 - shrink) * 0, transform: `translate(-50%,-50%) translateY(${(1 - p) * 120 + fl}px) scale(${s * shrink * (0.7 + 0.3 * p)}) rotate(${(1 - p) * 12 + Math.sin(t * 0.7 + i) * 2}deg)`, opacity: p, filter: `blur(${(1 - p) * 10}px) drop-shadow(0 30px 40px rgba(0,0,0,0.6))`}}>
              <Img src={im(src)} style={{height: 320}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', gap: 16}}>
          {[['Steel', 70], ['Aluminium', 71], ['Copper', 72], ['Titanium', 74]].map(([s, i]) => {
            const p = ap(t, W[i as number] - 0.1, 0.5);
            return (
              <Glass key={s as string} style={{padding: '12px 26px', borderRadius: 40, opacity: p, transform: `scale(${tw(p, [0, 1], [0.6, 1], EASE.back)})`}}>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: '#fff'}}>{s}</div>
              </Glass>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.85)', opacity: ap(t, W[75])}}>
          Trusted in {['automation', 'auto parts', 'machinery'].map((s, i) => (
            <span key={s} style={{opacity: ap(t, W[[77, 79, 81][i]] - 0.1), color: i === 1 ? RED : '#fff'}}>
              {s}
              {i < 2 ? ' · ' : ''}
            </span>
          ))}
        </div>
      </Shot>
      {/* 6. brand close */}
      <Shot t={t} a={s6} b={999}>
        <Photo src="p-020-243.png" t={t} a={s6} b={s6 + 12} dark={0.78} z0={1.2} z1={1.05} />
        <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={im('logo_star.png')} style={{height: 200, opacity: ap(t, s6 + 0.1), transform: `scale(${tw(ap(t, s6 + 0.1, 0.8), [0, 1], [0.4, 1], EASE.back)}) rotate(${(1 - ap(t, s6 + 0.1)) * 90}deg)`}} />
          <div style={{marginTop: 16, textAlign: 'center'}}>
            <Big t={t} a={W[83]} size={130}>
              <span style={{color: RED}}>HAIXING</span> <span style={{fontWeight: 500}}>PRECISION</span>
            </Big>
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 40, color: '#fff', marginTop: 20}}>
              <span style={{opacity: ap(t, W[85])}}>Craftsmanship in machining. </span>
              <span style={{opacity: ap(t, W[88]), color: '#ffd9d9'}}>Integrity in delivery.</span>
            </div>
          </div>
          <Glass style={{marginTop: 50, padding: '22px 44px', opacity: ap(t, W[91] - 0.2), transform: `translateY(${(1 - ap(t, W[91] - 0.2)) * 30}px)`, background: RED, border: 'none'}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#fff'}}>Call Mr. Zhou · +86 138 2317 6851</div>
          </Glass>
        </AbsoluteFill>
      </Shot>
      {/* subtitles */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 985, opacity: 0.92 * (1 - tw(t, [s6, s6 + 0.4], [0, 1]))}}>
        <ReplaceCaption t={t} size={36} color="#ffffff" accent={RED} phrases={PHRASES} />
      </div>
    </AbsoluteFill>
  );
};

const CUTS = [0, 8, 13, 21, 27, 34, 41, 49, 58, 65, 69, 75];
const PHRASES = CUTS.map((s, i) => ({text: WD.slice(s, CUTS[i + 1] ?? 83).map((w) => w.word).join(' '), start: W[s]}));

const Inner: React.FC = () => <Scene t={useCurrentFrame() / 60} />;
export const HaixingEN: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile('audio/hx_mix.wav')} />
    <CameraMotionBlur shutterAngle={170} samples={4}>
      <Inner />
    </CameraMotionBlur>
  </AbsoluteFill>
);
export const HaixingFrame: React.FC<{t: number}> = ({t}) => <Scene t={t} />;
