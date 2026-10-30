// Excel Academy v2 "The Pass Notification": dark exam tension -> flip -> app flow -> PASSED at night -> end card.
// One camera language: every scene dives into the next (zoom-through), no hard cuts except the planned invert.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, tw, prog, lerp} from '../kit/core';
import {SANS} from '../kit/fonts';
import {Words, Reveal, Icon, Backdrop, Ripple} from './ExcelAd';
import {Kinetic} from './kinetic';

export const XP_DURATION = 40 * 60;
const O = '#FF822B';
const O2 = '#FFA35C';
const D = '#15161C';
const MUTE = '#6B6E78';
const G = '#1FB46A';
const s = (t: number) => Math.round(t * 60);

const useU = () => {
  const {width, height} = useVideoConfig();
  return {W: width, H: height, u: Math.min(width, height) / 1080, tall: height > width};
};

// zoom-through wrapper: enters from small, leaves by diving past the camera
const Scene: React.FC<{a: number; b: number; children: React.ReactNode; enter?: 'dive' | 'cut' | 'flash'; exit?: 'dive' | 'cut'; origin?: string}> = ({a, b, children, enter = 'dive', exit = 'dive', origin = '50% 50%'}) => {
  const f = useCurrentFrame();
  const A = s(a);
  const B = s(b);
  if (f < A - 1 || f > B + 26) return null;
  const pin = enter === 'dive' ? prog(f, A - 6, A + 26, EASE.out) : 1;
  const pout = exit === 'dive' ? prog(f, B - 4, B + 22, EASE.in) : f >= B ? 1 : 0;
  const sc = lerp(0.35, 1, pin) * lerp(1, 4.5, pout);
  const blur = (1 - pin) * 14 + pout * 18;
  const op = Math.min(1, pin * 1.6) * (1 - prog(f, B + 6, B + 22, (t) => t)) * (exit === 'cut' && f >= B ? 0 : 1);
  return (
    <AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: origin, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: op}}>
      {children}
    </AbsoluteFill>
  );
};

const Head: React.FC<{at: number; l1: string; l2?: string; acc?: string[]; dark?: boolean; y?: number; k?: number}> = ({at, l1, l2, acc = [], dark, y, k = 1}) => {
  const {u, tall, H} = useU();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y ?? (tall ? 170 * u : 90 * u), textAlign: 'center', fontSize: (tall ? 86 : 74) * u * k, fontWeight: 800, letterSpacing: -3 * u, lineHeight: 1.05, color: dark ? '#fff' : D, padding: `0 ${60 * u}px`}}>
      <Words text={l1} at={s(at)} accent={acc} />
      {l2 && (
        <>
          <br />
          <Words text={l2} at={s(at) + 14} accent={acc} />
        </>
      )}
    </div>
  );
};

// ---------- 1. clock ----------
const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u} = useU();
  const R = Math.max(W, H) * 0.42;
  const ang = Math.floor(f / 60 * 2) * 6 + tw(f % 30, [0, 6], [0, 6], EASE.back) - 6; // ticking second hand
  const stamp = (at: number, txt: string, y: number) => {
    const p = prog(f, s(at), s(at) + 10, EASE.out);
    if (f < s(at)) return null;
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: H / 2 + y * u, textAlign: 'center', fontSize: 150 * u, fontWeight: 800, letterSpacing: -6 * u, color: '#fff', transform: `scale(${lerp(1.5, 1, p)})`, opacity: p, textShadow: '0 0 40px rgba(0,0,0,.8)'}}>
        {txt}
      </div>
    );
  };
  const flash = Math.max(tw(f, [s(0.6), s(0.6) + 8], [0.35, 0]), tw(f, [s(1.38), s(1.38) + 8], [0.35, 0]));
  return (
    <AbsoluteFill style={{background: '#050506'}}>
      <AbsoluteFill style={{transform: `scale(${1 + f / 1800})`}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="cg">
              <stop offset="0" stopColor="#1B1C22" />
              <stop offset="1" stopColor="#050506" />
            </radialGradient>
          </defs>
          <circle cx={W / 2} cy={H / 2} r={R} fill="url(#cg)" stroke="#2A2B33" strokeWidth={3} />
          {Array.from({length: 60}).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const l = i % 5 ? 18 : 46;
            return <line key={i} x1={W / 2 + Math.sin(a) * (R - 20)} y1={H / 2 - Math.cos(a) * (R - 20)} x2={W / 2 + Math.sin(a) * (R - 20 - l)} y2={H / 2 - Math.cos(a) * (R - 20 - l)} stroke={i % 5 ? '#3A3B44' : '#8A8C96'} strokeWidth={i % 5 ? 3 : 7} />;
          })}
          <g transform={`rotate(${ang} ${W / 2} ${H / 2})`}>
            <line x1={W / 2} y1={H / 2 + 60} x2={W / 2} y2={H / 2 - R + 50} stroke={O} strokeWidth={6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${O})`}} />
          </g>
          <circle cx={W / 2} cy={H / 2} r={16} fill={O} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.75) 85%)'}} />
      {stamp(0.6, '3 HOURS.', -190)}
      {stamp(1.38, 'ONE CHANCE.', 10)}
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

// ---------- 2. failing scripts flying past ----------
const Scripts: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const papers = Array.from({length: 14}).map((_, i) => {
    const seed = Math.sin(i * 91.7) * 0.5 + 0.5;
    const seed2 = Math.cos(i * 37.3) * 0.5 + 0.5;
    const t0 = s(3.0) + i * 9;
    const z = tw(f, [t0, t0 + 110], [-2600, 900], (t) => t);
    return {x: (seed - 0.5) * W * 1.3, y: (seed2 - 0.5) * H * 1.1, z, r: (seed - 0.5) * 50, sc: 38 + Math.round(seed2 * 9)};
  });
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #1A1B21, #07070A 75%)', perspective: 900 * u}}>
      {papers.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: W / 2 + p.x - 170 * u, top: H / 2 + p.y - 230 * u, width: 340 * u, height: 460 * u, background: '#ECEAE6', borderRadius: 8 * u, transform: `translateZ(${p.z}px) rotate(${p.r}deg)`, opacity: tw(p.z, [-2600, -1800, 500, 900], [0, 0.85, 0.85, 0]), filter: `blur(${Math.abs(p.z + 300) / 260}px)`, padding: 28 * u, boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          {Array.from({length: 9}).map((_, k) => (
            <div key={k} style={{height: 8 * u, width: `${60 + ((k * 37 + i * 13) % 40)}%`, background: '#B9B6B0', borderRadius: 4, marginTop: 22 * u}} />
          ))}
          <div style={{position: 'absolute', right: 26 * u, top: 20 * u, color: '#E0342C', fontSize: 58 * u, fontWeight: 800, fontFamily: 'cursive', transform: 'rotate(-10deg)'}}>{p.sc}</div>
          <svg style={{position: 'absolute', left: 60 * u, top: 170 * u}} width={200 * u} height={200 * u} viewBox="0 0 10 10">
            <path d="M1 1L9 9M9 1L1 9" stroke="#E0342C" strokeWidth={1} strokeLinecap="round" />
          </svg>
        </div>
      ))}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(5,5,6,.75) 15%, transparent 55%)'}} />
      <Head at={3.0} l1="Most students don't fail" l2="because they're not smart." dark k={tall ? 0.8 : 1} y={H / 2 - 110 * u} />
    </AbsoluteFill>
  );
};

// ---------- 3. hard invert ----------
const Invert: React.FC = () => {
  const f = useCurrentFrame();
  const {H, u, tall} = useU();
  const fz = (tall ? 120 : 112) * u;
  return (
    <AbsoluteFill style={{background: '#fff', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', fontSize: fz * 0.55, fontWeight: 700, color: MUTE, letterSpacing: -1 * u}}>
        <Words text="They fail because they" at={s(6.1)} gap={3} />
      </div>
      <div style={{position: 'relative', fontSize: fz, fontWeight: 800, letterSpacing: -5 * u, color: f > s(7.6) ? D : O, transition: 'none', marginTop: 10 * u}}>
        <Reveal at={s(6.35)} dy={100}>studied wrong.</Reveal>
        <svg style={{position: 'absolute', left: '-3%', top: '55%', width: '106%', height: 50 * u, overflow: 'visible'}} viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0 14 C 30 2, 60 20, 100 6" stroke="#E0342C" strokeWidth={5 * u} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, s(7.0), s(7.4))} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div style={{position: 'absolute', top: H * 0.5 + 10, left: 0, right: 0}} />
    </AbsoluteFill>
  );
};

// ---------- phone (frame render with live screen) ----------
const Phone: React.FC<{h: number; children: React.ReactNode; on?: number}> = ({h, children, on = 1}) => {
  const k = h / 2000;
  const sc = (830 * k) / 390;
  return (
    <div style={{position: 'relative', width: 1000 * k, height: h}}>
      <div style={{position: 'absolute', left: 85 * k, top: 103 * k, width: 830 * k, height: 1794 * k, borderRadius: 120 * k, overflow: 'hidden', background: '#000'}}>
        <div style={{width: 390, height: 843, transform: `scale(${sc})`, transformOrigin: '0 0', opacity: on, fontFamily: SANS}}>{children}</div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 30%)'}} />
      </div>
      <Img src={staticFile('xa/phone_frame.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
    </div>
  );
};

// ---------- 4. flip: phone tumbles in, logo builds ----------
const Flip: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(8.6);
  const p = prog(f, a, a + 70, EASE.out);
  const bulb = prog(f, s(9.55), s(9.75));
  const ph = (tall ? 1250 : 860) * u;
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(255,130,43,${0.35 * bulb}), transparent 50%)`}} />
      <div style={{position: 'absolute', left: W / 2, top: H * (tall ? 0.53 : 0.52), perspective: 2400 * u}}>
        <div style={{transform: `translate(-50%,-50%) rotateX(${lerp(70, 0, p)}deg) rotateY(${lerp(-200, 0, p)}deg) rotateZ(${lerp(-25, 0, p)}deg) scale(${lerp(0.3, 1, p) * (1 + (f - a) * 0.0004)})`, filter: 'drop-shadow(0 50px 60px rgba(60,35,10,.25))'}}>
          <Phone h={ph}>
            <AbsoluteFill style={{background: `linear-gradient(160deg, ${O2}, ${O})`, alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 170, height: 170, borderRadius: 46, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${prog(f, s(9.2), s(9.6), EASE.back)})`, boxShadow: `0 0 ${80 * bulb}px rgba(255,240,200,${bulb})`}}>
                <Img src={staticFile('xa/logo_icon.png')} style={{width: 132}} />
              </div>
              <div style={{marginTop: 28, color: '#fff', fontSize: 34, fontWeight: 800, opacity: tw(f, [s(9.9), s(10.3)], [0, 1]), transform: `translateY(${tw(f, [s(9.9), s(10.4)], [20, 0])}px)`}}>Excel Academy</div>
              <div style={{marginTop: 6, color: '#ffffffcc', fontSize: 17, fontWeight: 600, opacity: tw(f, [s(10.2), s(10.6)], [0, 1])}}>Your pathway to Success</div>
            </AbsoluteFill>
          </Phone>
        </div>
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: tw(f, [a, a + 14], [1, 0])}} />
    </AbsoluteFill>
  );
};

// ---------- 5. domino row of exams ----------
const EXAMS = ['ICAN', 'ACCA', 'CIMA', 'CITN', 'CIBN', 'ANAN', 'CFA', 'CPA'];
const TINT = ['#FFE7D4', '#E4ECFF', '#E3F6EC', '#F4E6FF', '#FFF3C9', '#DFF4F7', '#FFE1E6', '#E8E8EE'];
const Domino: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(11.4);
  const cw = 300 * u;
  const gap = 34 * u;
  const cols = tall ? 2 : 4;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head at={11.45} l1="Every professional exam." l2="One app." acc={['One', 'app.']} />
      <div style={{position: 'absolute', left: W / 2, top: tall ? H * 0.58 : H * 0.64, transform: `translate(-50%,-50%) rotateX(14deg) translateX(${tw(f, [a, a + 180], [40, -40], (t) => t) * u}px)`, display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap, perspective: 1600 * u}}>
        {EXAMS.map((e, i) => {
          const t0 = a + 10 + i * 6;
          const p = prog(f, t0, t0 + 28, EASE.back);
          return (
            <div key={e} style={{height: (tall ? 210 : 170) * u, borderRadius: 30 * u, background: '#fff', boxShadow: '0 24px 50px rgba(60,40,20,.12)', transform: `rotateX(${lerp(-95, 0, p)}deg)`, transformOrigin: 'bottom', opacity: Math.min(1, p * 3), display: 'flex', alignItems: 'center', gap: 22 * u, padding: `0 ${30 * u}px`}}>
              <div style={{width: 84 * u, height: 84 * u, borderRadius: 24 * u, background: TINT[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 * u, color: D}}>{e.slice(0, 2)}</div>
              <div style={{fontSize: 46 * u, fontWeight: 800, color: D, letterSpacing: -1.5 * u}}>{e}</div>
            </div>
          );
        })}
        {(() => {
          const t0 = a + 10 + EXAMS.length * 6 + 6;
          const p = prog(f, t0, t0 + 30, EASE.back);
          return (
            <div style={{gridColumn: '1 / -1', height: (tall ? 150 : 120) * u, borderRadius: 30 * u, background: `linear-gradient(135deg, ${O2}, ${O})`, boxShadow: '0 24px 50px rgba(255,130,43,.3)', transform: `rotateX(${lerp(-95, 0, p)}deg)`, transformOrigin: 'bottom', opacity: Math.min(1, p * 3), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 * u, fontWeight: 800, color: '#fff', letterSpacing: -1.5 * u}}>
              + lots more
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. video lesson ----------
const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(14.4);
  const vw = (tall ? 960 : 1180) * u;
  const vh = vw * 0.56;
  const play = tw(f, [a + 50, a + 180], [0, 46], (t) => t);
  const chips: [string, 'star' | 'play' | 'clock', number, number][] = tall
    ? [['Chartered tutors', 'star', -380, -300], ['Watch offline', 'play', 200, 330], ['2× speed', 'clock', -330, 420]]
    : [['Chartered tutors', 'star', -760, -250], ['Watch offline', 'play', 470, 150], ['2× speed', 'clock', -720, 210]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head at={14.5} l1="Learn from tutors" l2="who've already passed." acc={['passed.']} />
      <div style={{position: 'absolute', left: W / 2 - vw / 2, top: (tall ? H * 0.55 : H * 0.6) - vh / 2, width: vw, height: vh, borderRadius: 40 * u, overflow: 'hidden', background: D, boxShadow: '0 40px 90px rgba(60,35,10,.25)'}}>
        <Img src={staticFile('xa/excel_banner.png')} style={{position: 'absolute', width: '118%', left: '-4%', top: 0, transform: `scale(${1 + (f - a) * 0.0005})`, transformOrigin: '30% 30%'}} />
        <div style={{position: 'absolute', right: 30 * u, top: 30 * u, width: 190 * u, height: 190 * u, borderRadius: 30 * u, background: 'linear-gradient(160deg,#8A6347,#3E2A1C)', border: `5px solid #fff`, overflow: 'hidden', transform: `scale(${prog(f, a + 30, a + 56, EASE.back)})`}}>
          <div style={{position: 'absolute', left: '28%', top: '18%', width: '44%', height: '44%', borderRadius: 99, background: '#2B1C12'}} />
          <div style={{position: 'absolute', left: '12%', top: '62%', width: '76%', height: '60%', borderRadius: '50% 50% 0 0', background: '#1F2433'}} />
          <div style={{position: 'absolute', left: 10 * u, bottom: 8 * u, fontSize: 16 * u, color: '#fff', fontWeight: 700}}>Mrs. Okafor, FCA</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 * u, background: 'linear-gradient(transparent, rgba(0,0,0,.6))'}} />
        <div style={{position: 'absolute', left: 36 * u, right: 36 * u, bottom: 34 * u, height: 8 * u, borderRadius: 8, background: '#ffffff44'}}>
          <div style={{width: `${play}%`, height: '100%', borderRadius: 8, background: O}} />
          <div style={{position: 'absolute', left: `${play}%`, top: -7 * u, width: 22 * u, height: 22 * u, marginLeft: -11 * u, borderRadius: 99, background: '#fff'}} />
        </div>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 130 * u, height: 130 * u, margin: -65 * u, borderRadius: 99, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: tw(f, [a + 40, a + 50], [1, 0]), transform: `scale(${tw(f, [a + 30, a + 40, a + 50], [1, 0.85, 1.5])})`}}>
          <Icon k="play" c={O} z={64 * u} />
        </div>
        <Ripple at={a + 32} x={vw / 2} y={vh / 2} c="#fff" />
      </div>
      {chips.map(([t, ic, x, y], i) => {
        const p = prog(f, a + 60 + i * 12, a + 90 + i * 12, EASE.back);
        return (
          <div key={t} style={{position: 'absolute', left: W / 2 + x * u, top: (tall ? H * 0.55 : H * 0.6) + y * u + Math.sin((f + i * 40) / 30) * 6, transform: `scale(${p})`, opacity: Math.min(1, p * 2), display: 'flex', alignItems: 'center', gap: 14 * u, padding: `${16 * u}px ${26 * u}px ${16 * u}px ${16 * u}px`, borderRadius: 99, background: '#fff', boxShadow: '0 20px 50px rgba(60,40,20,.15)', fontSize: 30 * u, fontWeight: 800, color: D}}>
            <div style={{width: 50 * u, height: 50 * u, borderRadius: 99, background: O, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon k={ic} z={26 * u} />
            </div>
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 7. past papers riffle -> worked solution ----------
const Papers: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(17.4);
  const pw = (tall ? 900 : 560) * u;
  const ph = pw * 1.25;
  const years = ['ICAN', 'ACCA', 'CIMA', 'CITN', 'CIBN', 'ANAN', 'CFA', 'CPA', 'CIS', 'CFE', 'ICAN', 'ACCA'];
  const flipT = (i: number) => a + 14 + i * 5;
  const open = a + 14 + years.length * 5 + 6;
  const cy = tall ? H * 0.6 : H * 0.64;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head at={17.5} l1="Real past questions." l2="Full solutions." acc={['Full', 'solutions.']} />
      <div style={{position: 'absolute', left: W / 2 - pw / 2, top: cy - ph / 2, width: pw, height: ph, perspective: 2000 * u}}>
        {/* solution page underneath */}
        <div style={{position: 'absolute', inset: 0, borderRadius: 28 * u, background: '#fff', boxShadow: '0 40px 90px rgba(60,35,10,.2)', padding: 46 * u}}>
          <div style={{fontSize: 22 * u, fontWeight: 800, color: O, letterSpacing: 2 * u}}>FINANCIAL REPORTING · WORKED SOLUTION</div>
          <div style={{fontSize: 34 * u, fontWeight: 800, color: D, marginTop: 18 * u, lineHeight: 1.2}}>Compute the deferred tax liability at year end.</div>
          {['Carrying amount   ₦48.0m', 'Tax base   ₦30.0m', 'Temporary diff.   ₦18.0m', 'Tax rate   30%'].map((t, i) => (
            <div key={t} style={{display: 'flex', justifyContent: 'space-between', fontSize: 28 * u, color: D, marginTop: 22 * u, opacity: tw(f, [open + 8 + i * 6, open + 18 + i * 6], [0, 1])}}>
              <span>{t.split('   ')[0]}</span>
              <span style={{fontWeight: 700}}>{t.split('   ')[1]}</span>
            </div>
          ))}
          <div style={{position: 'relative', marginTop: 34 * u, fontSize: 44 * u, fontWeight: 800, color: D, display: 'flex', justifyContent: 'space-between', opacity: tw(f, [open + 36, open + 46], [0, 1])}}>
            <span>DTL</span>
            <span style={{color: O}}>₦5.4m</span>
            <svg style={{position: 'absolute', right: -24 * u, top: -20 * u, width: 280 * u, height: 110 * u, overflow: 'visible'}} viewBox="0 0 100 40" preserveAspectRatio="none">
              <ellipse cx={58} cy={20} rx={44} ry={18} stroke={O} strokeWidth={3 * u} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, open + 50, open + 72)} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div style={{position: 'absolute', right: 40 * u, bottom: 36 * u, width: 80 * u, height: 80 * u, borderRadius: 99, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${prog(f, open + 70, open + 92, EASE.back)})`}}>
            <Icon k="check" z={48 * u} />
          </div>
        </div>
        {years.map((y, i) => {
          const p = prog(f, flipT(i), flipT(i) + 14, EASE.inOut);
          if (p >= 1) return null;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, borderRadius: 28 * u, background: i % 2 ? '#FBFAF8' : '#F3F0EC', border: '1px solid #E4DFD8', transformOrigin: 'top', transform: `rotateX(${p * 110}deg) translateY(${-(years.length - i) * 3 * u}px)`, zIndex: years.length - i, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - prog(f, flipT(i) + 8, flipT(i) + 14, (t) => t)}}>
              <div style={{fontSize: 30 * u, color: MUTE, fontWeight: 700, letterSpacing: 3 * u}}>PAST QUESTIONS</div>
              <div style={{fontSize: 96 * u, fontWeight: 800, color: D, letterSpacing: -3 * u}}>{y}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8. mock exam grid -> score ----------
const Mock: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(21.4);
  const cols = 8;
  const n = 40;
  const tile = (tall ? 96 : 74) * u;
  const gap = 14 * u;
  const wrong = new Set([3, 11, 17, 22, 29, 33, 36, 38, 14]);
  const shrink = prog(f, a + 120, a + 150, EASE.inOut);
  const score = Math.round(tw(f, [a + 140, a + 210], [0, 78], EASE.count));
  const R = (tall ? 340 : 230) * u;
  const cy = tall ? H * 0.6 : H * 0.6;
  const timer = Math.max(0, 180 - Math.floor((f - a) * 1.4));
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head at={21.5} l1="Timed mock exams." l2="Your score, instantly." acc={['instantly.']} />
      <div style={{position: 'absolute', left: W / 2, top: cy, transform: `translate(-50%,-50%) scale(${1 - shrink * 0.6})`, opacity: 1 - shrink}}>
        <div style={{textAlign: 'center', fontSize: 40 * u, fontWeight: 800, color: D, marginBottom: 24 * u, fontVariantNumeric: 'tabular-nums'}}>
          <span style={{color: O}}>⏱ {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</span> · 40 questions
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tile}px)`, gap}}>
          {Array.from({length: n}).map((_, i) => {
            const t0 = a + 10 + i * 2.4;
            const on = f >= t0;
            const bad = wrong.has(i);
            return (
              <div key={i} style={{height: tile, borderRadius: 18 * u, background: on ? (bad ? '#FFD9D4' : G) : '#fff', boxShadow: on && !bad ? `0 0 ${24 * u}px rgba(31,180,106,.5)` : '0 8px 20px rgba(60,40,20,.08)', transform: `scale(${tw(f, [t0, t0 + 6, t0 + 12], [1, 1.15, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 * u, fontWeight: 800, color: on ? (bad ? '#D0342C' : '#fff') : '#B5B0AA'}}>
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
      {f > a + 130 && (
        <div style={{position: 'absolute', left: W / 2 - R - 30 * u, top: cy - R - 30 * u, width: (R + 30 * u) * 2, height: (R + 30 * u) * 2, transform: `scale(${prog(f, a + 130, a + 160, EASE.back)})`}}>
          <div style={{position: 'absolute', inset: -120 * u, borderRadius: 999, background: `radial-gradient(circle, rgba(255,130,43,${0.35 * prog(f, a + 200, a + 215) * (1 - prog(f, a + 215, a + 240))}), transparent 65%)`}} />
          <svg width="100%" height="100%" viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
            <circle cx={50} cy={50} r={42} stroke="#F1E8E0" strokeWidth={7} fill="none" />
            <circle cx={50} cy={50} r={42} stroke={O} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${(score / 100) * 263.9} 263.9`} style={{filter: `drop-shadow(0 0 3px ${O})`}} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 150 * u, fontWeight: 800, color: D, letterSpacing: -6 * u, fontVariantNumeric: 'tabular-nums'}}>{score}%</div>
            <div style={{fontSize: 32 * u, fontWeight: 800, color: G, opacity: tw(f, [a + 205, a + 215], [0, 1])}}>PASS MARK CLEARED</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 9. weak spots ----------
const Weak: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(25.4);
  const topics: [string, number, number][] = [
    ['Financial Reporting', 82, 86],
    ['Audit & Assurance', 74, 79],
    ['Taxation', 42, 81],
    ['Corporate Strategy', 68, 75],
  ];
  const fix = prog(f, a + 100, a + 170, EASE.count);
  const bw = (tall ? 980 : 1100) * u;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head at={25.5} l1="See your weak spots." l2="Fix them before exam day." acc={['Fix']} />
      <div style={{position: 'absolute', left: W / 2 - bw / 2, top: tall ? H * 0.4 : H * 0.42, width: bw, padding: 50 * u, borderRadius: 40 * u, background: '#fff', boxShadow: '0 40px 90px rgba(60,35,10,.15)'}}>
        {topics.map(([t, v0, v1], i) => {
          const weak = i === 2;
          const v = weak ? lerp(v0, v1, fix) : tw(f, [a + 10 + i * 6, a + 60 + i * 6], [0, v0], EASE.count) + (v1 - v0) * fix;
          const pulse = weak && fix < 0.05 ? 0.5 + 0.5 * Math.sin((f - a) / 6) : 0;
          const col = weak ? (fix > 0.6 ? G : '#E0342C') : D;
          return (
            <div key={t} style={{marginTop: i ? 36 * u : 0, padding: weak ? `${16 * u}px ${20 * u}px` : 0, margin: weak ? `${30 * u}px ${-20 * u}px 0` : undefined, borderRadius: 20 * u, background: weak ? `rgba(224,52,44,${0.06 + pulse * 0.08 * (1 - fix)})` : undefined}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: (tall ? 40 : 34) * u, fontWeight: 800, color: D}}>
                <span>{t}{weak && fix < 0.6 && <span style={{color: '#E0342C', fontSize: 24 * u, marginLeft: 14 * u}}>WEAK SPOT</span>}</span>
                <span style={{color: col, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v)}%</span>
              </div>
              <div style={{height: 18 * u, borderRadius: 18, background: '#F1EEEA', marginTop: 14 * u}}>
                <div style={{width: `${v}%`, height: '100%', borderRadius: 18, background: weak ? col : i === 0 ? O : D}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 10. night desk, the notification ----------
const Night: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(29.2);
  const n1 = s(31.8);
  const n2 = s(32.5);
  const wake = prog(f, n1 - 6, n1 + 6);
  const push = tw(f, [a, s(33.4)], [1, 1.12], (t) => t);
  const ph = (tall ? 1150 : 820) * u;
  const conf = Array.from({length: 46}).map((_, i) => {
    const sx = Math.sin(i * 12.9898) * 43758.5453;
    const r = sx - Math.floor(sx);
    const r2 = Math.cos(i * 78.233) * 0.5 + 0.5;
    const t = (f - n1 - 4) / 60;
    return {x: W / 2 + (r - 0.5) * 300 * u + (r - 0.5) * 1400 * u * t, y: H * 0.45 - 900 * u * t * (0.6 + r2) + 1100 * u * t * t, rot: t * 600 * (r - 0.5), c: [O, O2, '#fff', '#FFD166'][i % 4], t};
  });
  return (
    <AbsoluteFill style={{background: '#0B0A09', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        {/* desk and lamp light */}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #120E0B 0%, #2A1D14 55%, #3A2819 100%)'}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 22% 18%, rgba(255,190,120,.55), rgba(255,160,80,.12) 35%, transparent 60%)`}} />
        {/* notebook + calculator props */}
        <div style={{position: 'absolute', left: -60 * u, top: H * (tall ? 0.66 : 0.55), width: 560 * u, height: 720 * u, background: '#EDE6D8', borderRadius: 12 * u, transform: 'rotate(-14deg)', boxShadow: '0 30px 60px rgba(0,0,0,.5)', padding: 40 * u, opacity: 0.9}}>
          {Array.from({length: 12}).map((_, k) => (
            <div key={k} style={{height: 3 * u, background: '#B9C4D6', marginTop: 44 * u, width: `${70 + ((k * 23) % 30)}%`}} />
          ))}
        </div>
        <div style={{position: 'absolute', right: -40 * u, top: H * (tall ? 0.16 : 0.12), width: 330 * u, height: 470 * u, background: '#1E1F24', borderRadius: 30 * u, transform: 'rotate(18deg)', boxShadow: '0 30px 60px rgba(0,0,0,.6)', padding: 30 * u}}>
          <div style={{height: 90 * u, borderRadius: 12 * u, background: '#9FB59A'}} />
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 * u, marginTop: 24 * u}}>
            {Array.from({length: 16}).map((_, k) => (
              <div key={k} style={{height: 50 * u, borderRadius: 10 * u, background: k % 4 === 3 ? O : '#33353D'}} />
            ))}
          </div>
        </div>
        {/* phone lying on the desk */}
        <div style={{position: 'absolute', left: W / 2, top: H * 0.52, perspective: 2200 * u}}>
          <div style={{transform: `translate(-50%,-50%) rotateX(28deg) rotateZ(-6deg) translateY(${tw(f, [n1, n1 + 3, n1 + 6, n1 + 9, n1 + 12], [0, -6, 4, -3, 0]) * u}px)`, filter: `drop-shadow(0 60px 50px rgba(0,0,0,.6)) drop-shadow(0 0 ${90 * wake}px rgba(255,140,60,${0.5 * wake}))`}}>
            <Phone h={ph}>
              <AbsoluteFill style={{background: `linear-gradient(180deg, #1B1210 0%, #3B2316 60%, #5A3016 100%)`, filter: `brightness(${0.25 + 0.75 * wake})`}}>
                <div style={{textAlign: 'center', color: '#fff', marginTop: 90}}>
                  <div style={{fontSize: 18, fontWeight: 600, opacity: 0.8}}>Thursday, 14 August</div>
                  <div style={{fontSize: 92, fontWeight: 700, letterSpacing: -3}}>11:48</div>
                </div>
                {[[n1, 'ICAN Results', 'PASSED ✓  Congratulations, Tobi! You passed Financial Reporting.'], [n2, 'ACCA Results', 'PASSED ✓  Audit & Assurance (AA): 74 marks.']].map(([t0, ti, body], i) => {
                  const p = prog(f, t0 as number, (t0 as number) + 22, EASE.back);
                  return (
                    <div key={i} style={{position: 'absolute', left: 14, right: 14, top: 330 + i * 118, padding: 16, borderRadius: 26, background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(10px)', transform: `translateY(${(1 - p) * -60}px) scale(${0.9 + p * 0.1})`, opacity: Math.min(1, p * 2), display: 'flex', gap: 12, boxShadow: '0 10px 30px rgba(0,0,0,.25)'}}>
                      <div style={{width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <Img src={staticFile('xa/logo_icon.png')} style={{width: 36}} />
                      </div>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: D}}>
                          <span>{ti}</span>
                          <span style={{color: MUTE, fontWeight: 500}}>now</span>
                        </div>
                        <div style={{fontSize: 14, color: D, marginTop: 3, lineHeight: 1.3}}>
                          <b style={{color: G}}>{(body as string).split('  ')[0]}</b> {(body as string).split('  ')[1]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </AbsoluteFill>
            </Phone>
          </div>
        </div>
      </AbsoluteFill>
      {f > n1 + 4 &&
        conf.map((c, i) =>
          c.t > 0 && c.t < 2.2 ? <div key={i} style={{position: 'absolute', left: c.x, top: c.y, width: 16 * u, height: 26 * u, borderRadius: 4, background: c.c, transform: `rotate(${c.rot}deg)`, opacity: tw(c.t, [1.6, 2.2], [1, 0], (t) => t)}} /> : null,
        )}
      <Head at={29.6} l1="And then…" l2="that message." dark acc={['message.']} y={tall ? 150 * u : 70 * u} />
    </AbsoluteFill>
  );
};

// ---------- store badges ----------
export const StoreBadge: React.FC<{kind: 'play' | 'apple'; u: number}> = ({kind, u}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18 * u, padding: `${18 * u}px ${34 * u}px ${18 * u}px ${26 * u}px`, borderRadius: 22 * u, background: '#000', border: '2px solid #A6A6A6', color: '#fff', boxShadow: '0 24px 60px rgba(21,22,28,.3)'}}>
    {kind === 'play' ? (
      <svg width={54 * u} height={60 * u} viewBox="0 0 48 52">
        <path d="M2 2l26 24L2 50c-1-.6-1.6-1.7-1.6-3V5C.4 3.7 1 2.6 2 2z" fill="#00D7FE" />
        <path d="M37 17L28 26 2 2c.6-.4 1.6-.5 2.6.1z" fill="#00F076" />
        <path d="M37 35L4.6 51.9c-1 .6-2 .5-2.6.1l26-26z" fill="#FF3A44" />
        <path d="M37 17l8.4 4.8c2.6 1.5 2.6 4 0 5.5L37 35l-9-9z" fill="#FFD400" />
      </svg>
    ) : (
      <svg width={50 * u} height={60 * u} viewBox="0 0 384 512">
        <path fill="#fff" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
    )}
    <div style={{lineHeight: 1.05}}>
      <div style={{fontSize: 20 * u, fontWeight: 500}}>{kind === 'play' ? 'GET IT ON' : 'Download on the'}</div>
      <div style={{fontSize: 40 * u, fontWeight: 700, letterSpacing: -0.5 * u}}>{kind === 'play' ? 'Google Play' : 'App Store'}</div>
    </div>
  </div>
);

// ---------- 11. end card ----------
const End: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H, u, tall} = useU();
  const a = s(33.4);
  const lp = prog(f, a + 6, a + 46, EASE.out);
  const btn = prog(f, s(36.8), s(37.3), EASE.back);
  const press = tw(f, [s(37.9), s(38.0), s(38.2)], [1, 0.93, 1]);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{opacity: lp, transform: `translateY(${(1 - lp) * 50 * u}px) scale(${0.92 + lp * 0.08})`}}>
          <Img src={staticFile('xa/logo_dark.png')} style={{width: (tall ? 900 : 860) * u}} />
        </div>
        <div style={{marginTop: 40 * u, fontSize: 34 * u, fontWeight: 600, color: MUTE, opacity: tw(f, [s(35.2), s(35.8)], [0, 1])}}>Trusted by students worldwide</div>
        <div style={{position: 'relative', marginTop: 50 * u, transform: `scale(${btn * press})`, opacity: Math.min(1, btn * 2)}}>
          <div style={{display: 'flex', gap: 26 * u, flexDirection: tall ? 'column' : 'row', alignItems: 'center', transform: `scale(${tall ? 1.35 : 1.15})`, margin: tall ? `${40 * u}px 0` : 0}}>
            <StoreBadge kind="play" u={u} />
            <StoreBadge kind="apple" u={u} />
          </div>
          <div style={{position: 'absolute', inset: -12 * u, borderRadius: 30 * u, border: `4px solid ${O}`, opacity: tw(f, [s(38.0), s(38.2), s(39.3)], [0, 0.9, 0]), transform: `scale(${tw(f, [s(38.0), s(39.3)], [1, 1.25])})`}} />
          <Ripple at={s(37.9)} x={200 * u} y={60 * u} c="#fff" />
        </div>
        <div style={{marginTop: 34 * u, fontSize: 36 * u, fontWeight: 700, color: O, opacity: tw(f, [s(37.4), s(37.9)], [0, 1])}}>excelacademyonline.com</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ExcelPass: React.FC<{mute?: boolean}> = ({mute = false}) => (
  <AbsoluteFill style={{fontFamily: SANS, background: '#050506', overflow: 'hidden'}}>
    <Kinetic cuts={[0.6, 1.38, 3.0, 6.1, 8.6, 11.4, 14.4, 17.4, 21.4, 25.4, 29.2, 31.8, 33.4]}>
    <Scene a={0} b={3.0} enter="cut"><Clock /></Scene>
    <Scene a={3.0} b={6.1} exit="cut"><Scripts /></Scene>
    <Scene a={6.1} b={8.6} enter="cut" exit="cut"><Invert /></Scene>
    <Scene a={8.6} b={11.4} enter="cut" origin="50% 52%"><Flip /></Scene>
    <Scene a={11.4} b={14.4}><Domino /></Scene>
    <Scene a={14.4} b={17.4}><Lesson /></Scene>
    <Scene a={17.4} b={21.4}><Papers /></Scene>
    <Scene a={21.4} b={25.4}><Mock /></Scene>
    <Scene a={25.4} b={29.2} exit="cut"><Weak /></Scene>
    <Scene a={29.2} b={33.4} enter="cut"><Night /></Scene>
    <Scene a={33.4} b={41}><End /></Scene>
    </Kinetic>
    {!mute && <Audio src={staticFile('xa/xp_mix.wav')} />}
  </AbsoluteFill>
);
