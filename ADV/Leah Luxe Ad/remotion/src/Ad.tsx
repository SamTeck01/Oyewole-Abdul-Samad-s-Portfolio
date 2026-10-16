import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import TL from './timeline.json';
import '@fontsource/great-vibes';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/900.css';

export const FPS = 60;
export const BEAT = 30; // 120 BPM
const C = {pink: '#FF2E93', hot: '#E0157A', blush: '#FFD6E8', plum: '#3A0D2E', cream: '#FFF4EC', mag: '#C2186B', white: '#FFFFFF'};
const SCRIPT = '"Great Vibes", cursive';
const SANS = 'Montserrat, sans-serif';
const p = (n: string) => staticFile(`p/${n}`);

// ---------- motion helpers ----------
const useSpring = (delay = 0, damping = 12, stiffness = 170) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness, mass: 0.7}});
};
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const outEase = Easing.bezier(0.16, 1, 0.3, 1);

// Letters rise out of a mask, staggered
const Word: React.FC<{text: string; d?: number; size: number; color: string; weight?: number; ls?: number; font?: string; stagger?: number}> = ({text, d = 0, size, color, weight = 900, ls = 0, font = SANS, stagger = 2}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: `${size * 0.08}px ${size * 0.1}px`, fontFamily: font, fontWeight: weight, fontSize: size, color, letterSpacing: ls, lineHeight: 1}}>
      {text.split('').map((ch, i) => {
        const t = interpolate(f - d - i * stagger, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: outEase});
        return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - t) * 110}%)`, whiteSpace: 'pre'}}>{ch}</span>;
      })}
    </div>
  );
};

// Product cut-out: springs in with overshoot, then floats
const Pop: React.FC<{src: string; d?: number; w: number; x: number; y: number; rot?: number; glow?: string; crop?: string}> = ({src, d = 0, w, x, y, rot = 0, glow, crop}) => {
  const f = useCurrentFrame();
  const s = useSpring(d, 10, 160);
  const fl = Math.sin((f - d) / 22) * 10;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `translateY(${fl + (1 - s) * 140}px) scale(${s}) rotate(${rot * (1 - s) * 3 + rot}deg)`}}>
      <Img src={src} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', clipPath: crop, filter: `drop-shadow(0 30px 40px rgba(58,13,46,.35))${glow ? ` drop-shadow(0 0 40px ${glow})` : ''}`}} />
    </div>
  );
};

// Photo inside a circle (or arch) with a ring
const Shot: React.FC<{src: string; d?: number; size: number; x: number; y: number; ring?: string; arch?: boolean; pos?: string}> = ({src, d = 0, size, x, y, ring = C.white, arch, pos = 'center'}) => {
  const f = useCurrentFrame();
  const s = useSpring(d, 13, 150);
  const z = interpolate(f - d, [0, 120], [1.18, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const r = arch ? `${size / 2}px ${size / 2}px 40px 40px` : '50%';
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - (arch ? size * 0.65 : size / 2), width: size, height: arch ? size * 1.3 : size, borderRadius: r, overflow: 'hidden',
      transform: `scale(${s})`, boxShadow: `0 0 0 14px ${ring}, 0 40px 80px rgba(58,13,46,.35)`}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z})`}} />
    </div>
  );
};

const Dot: React.FC<{x: number; y: number; r: number; c: string; d?: number; o?: number}> = ({x, y, r, c, d = 0, o = 1}) => {
  const s = useSpring(d, 11, 140);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: c, opacity: o, transform: `scale(${s})`}} />;
};
const Half: React.FC<{x: number; y: number; r: number; c: string; d?: number; rot: number}> = ({x, y, r, c, d = 0, rot}) => {
  const s = useSpring(d, 12, 120);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r, borderRadius: `${r}px ${r}px 0 0`, background: c, transformOrigin: '50% 100%', transform: `rotate(${rot + (1 - s) * 180}deg) scale(${s})`}} />;
};
const Spark: React.FC<{x: number; y: number; s: number; c?: string; d?: number}> = ({x, y, s, c = C.white, d = 0}) => {
  const f = useCurrentFrame();
  const k = useSpring(d, 9, 200) * (0.75 + 0.25 * Math.sin((f - d) / 9));
  return (
    <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${k}) rotate(${(f - d) * 0.8}deg)`}} width={s} height={s} viewBox="-10 -10 20 20">
      <path d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4Z" fill={c} />
    </svg>
  );
};

// Scene revealed by a circle growing from (cx, cy), like the reference's shape wipes
const Reveal: React.FC<{bg: string; cx?: number; cy?: number; children: React.ReactNode}> = ({bg, cx = 50, cy = 50, children}) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 18], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return <AbsoluteFill style={{background: bg, clipPath: `circle(${r}% at ${cx}% ${cy}%)`, overflow: 'hidden'}}>{children}</AbsoluteFill>;
};
const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>;

// ---------- logo (chosen sample 4, tagline updated) ----------
export const Logo: React.FC<{scale?: number; d?: number}> = ({scale = 1, d = 0}) => {
  const f = useCurrentFrame();
  const t = interpolate(f - d, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: outEase});
  const glow = interpolate(f - d, [20, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`}}>
      <div style={{position: 'relative', fontFamily: SCRIPT, fontSize: 250, color: C.white, lineHeight: 1.1, padding: '0 40px',
        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`, textShadow: `0 0 ${18 * glow}px rgba(255,255,255,.95), 0 0 ${50 * glow}px rgba(255,255,255,.6), 0 0 ${90 * glow}px rgba(255,120,190,.9)`}}>
        Leah Luxe
      </div>
      <div style={{position: 'relative', width: 0, height: 0}}><Spark x={330} y={-250} s={70} d={d + 34} /></div>
      <div style={{marginTop: 18, opacity: glow}}><Word text="BEAUTY · LIFESTYLE · GADGETS" d={d + 30} size={34} color={C.white} weight={500} ls={12} stagger={1} /></div>
    </div>
  );
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 60], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const dx = interpolate(t, [0, 1], [-60, 540]);
  const dy = 1280 + Math.sin(t * Math.PI * 2) * -90;
  const grow = interpolate(f, [100, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.7, 0, 0.84, 0)});
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d={`M -60 1280 Q 240 1100 540 1280`} stroke={C.pink} strokeWidth={5} fill="none" strokeDasharray="1000" strokeDashoffset={1000 - t * 1000} strokeLinecap="round" opacity={1 - grow} />
      </svg>
      <div style={{position: 'absolute', left: dx - 22 - grow * 1500, top: dy - 22 - grow * 1500, width: 44 + grow * 3000, height: 44 + grow * 3000, borderRadius: '50%', background: C.pink}} />
      <Center y={660}>
        <Word text="psst..." d={8} size={70} color={C.plum} weight={500} font={SANS} />
        <Word text="CLEARANCE" d={30} size={128} color={C.plum} ls={2} />
        <Word text="SALE" d={42} size={200} color={C.pink} ls={10} />
      </Center>
    </AbsoluteFill>
  );
};

const Off: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(4, 8, 220);
  const shake = f > 4 && f < 14 ? Math.sin(f * 3) * (14 - f) * 1.5 : 0;
  return (
    <AbsoluteFill style={{background: C.pink, overflow: 'hidden'}}>
      <Dot x={900} y={300} r={260} c={C.hot} d={2} />
      <Dot x={120} y={1650} r={320} c={C.hot} d={6} />
      <Half x={180} y={360} r={150} c={C.blush} d={10} rot={-30} />
      <Half x={920} y={1560} r={130} c={C.plum} d={14} rot={150} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateX(${shake}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 470, color: C.white, lineHeight: 0.9, letterSpacing: -14, transform: `scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -12}deg)`,
          textShadow: '0 20px 0 rgba(58,13,46,.25)'}}>20%</div>
        <div style={{transform: `scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: 200, color: C.plum, lineHeight: 0.9, letterSpacing: 6}}>OFF</div>
        <div style={{marginTop: 50}}><div style={{background: C.plum, padding: '20px 44px', borderRadius: 100, transform: `scale(${useSpring(22, 12, 180)})`}}>
          <Word text="ON ALL GOODS" d={26} size={56} color={C.white} weight={700} ls={8} stagger={1} /></div></div>
      </div>
      <Spark x={250} y={620} s={80} d={18} />
      <Spark x={850} y={1300} s={60} d={24} />
      <Spark x={820} y={600} s={40} d={30} />
    </AbsoluteFill>
  );
};

// Simplified Nigeria outline (normalised); Ibadan sits in the south-west
const NG = 'M80 300 L95 230 L120 180 L170 150 L215 95 L290 70 L360 80 L420 60 L480 70 L540 30 L585 60 L600 120 L640 150 L620 210 L560 260 L520 330 L470 400 L410 430 L330 420 L270 460 L200 440 L150 400 L110 390 Z';
const Deliver: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [60, 140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const pts = [[150, 330], [300, 250], [420, 160], [520, 300], [560, 120]];
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        <g transform="translate(60,380) scale(1.45)">
          <path d={NG} fill={C.blush} stroke={C.pink} strokeWidth={4} strokeLinejoin="round" style={{opacity: interpolate(f, [0, 14], [0, 1], {extrapolateRight: 'clamp'})}} />
          {pts.slice(1).map(([x, y], i) => {
            const k = interpolate(t * 4 - i, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const [x0, y0] = pts[0];
            const mx = (x0 + x) / 2, my = Math.min(y0, y) - 90;
            return <g key={i}>
              <path d={`M${x0} ${y0} Q${mx} ${my} ${x} ${y}`} fill="none" stroke={C.plum} strokeWidth={4} strokeDasharray="600" strokeDashoffset={600 - 600 * k} strokeLinecap="round" />
              <circle cx={x} cy={y} r={14 * (k >= 1 ? 1 : 0)} fill={C.pink} />
            </g>;
          })}
          <circle cx={150} cy={330} r={24} fill={C.pink} stroke={C.white} strokeWidth={6} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 150, top: 930, fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.plum, opacity: interpolate(f, [6, 16], [0, 1], {extrapolateRight: 'clamp'})}}>Ibadan</div>
      <Center y={1150}>
        <Word text="BASED IN IBADAN" d={14} size={96} color={C.plum} ls={4} />
        <div style={{height: 20}} />
        <Word text="we deliver outside Ibadan" d={70} size={92} color={C.pink} font={SCRIPT} weight={400} stagger={1} />
        <div style={{height: 26}} />
        <div style={{background: C.plum, borderRadius: 100, padding: '16px 44px', transform: `scale(${useSpring(110, 11, 180)})`}}>
          <Word text="NATIONWIDE DELIVERY" d={114} size={58} color={C.white} weight={800} ls={4} stagger={1} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

const WA: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#25D366" />
    <path fill="#fff" d="M16 7a9 9 0 0 0-7.7 13.6L7 25l4.5-1.2A9 9 0 1 0 16 7zm0 16.4a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.7.7-2.6-.2-.3A7.4 7.4 0 1 1 16 23.4zm4.1-5.5c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.9 3.4c1.4.6 2 .7 2.7.6.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1l-.5-.5z" /></svg>
);
const Tik: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#111" />
    <path fill="#fff" d="M21.5 9.6a4.3 4.3 0 0 1-2.6-2.6h-2.8v11.4a2.4 2.4 0 1 1-1.7-2.3v-2.9a5.2 5.2 0 1 0 4.5 5.2v-5.6a7 7 0 0 0 4 1.3V11a4.2 4.2 0 0 1-1.4-1.4z" /></svg>
);

const End: React.FC = () => {
  const f = useCurrentFrame();
  const row = (d: number) => ({transform: `translateY(${(1 - useSpring(d, 13, 150)) * 60}px)`, opacity: interpolate(f - d, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})});
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #FF63AE 0%, ${C.pink} 35%, ${C.mag} 80%)`}}>
      {[...Array(10)].map((_, i) => <Spark key={i} x={(i * 331) % 1000 + 40} y={(i * 571) % 1800 + 60} s={14 + (i % 3) * 10} c="rgba(255,255,255,.7)" d={10 + i * 3} />)}
      <Center y={520}><Logo scale={0.98} d={4} /></Center>
      <div style={{position: 'absolute', top: 1010, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <div style={{...row(40), background: C.white, color: C.hot, fontFamily: SANS, fontWeight: 900, fontSize: 54, padding: '18px 44px', borderRadius: 100, letterSpacing: 1, whiteSpace: 'nowrap'}}>20% OFF · ENDS MON 19 OCT</div>
        <div style={{...row(52), display: 'flex', alignItems: 'center', gap: 26, fontFamily: SANS, fontWeight: 700, fontSize: 66, color: C.white}}><WA size={86} />+234 904 321 4068</div>
        <div style={{...row(60), display: 'flex', alignItems: 'center', gap: 26, fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.white}}><Tik size={76} />@https.leahluxe</div>
        <div style={{...row(70), marginTop: 26, fontFamily: SANS, fontWeight: 500, fontSize: 31, color: C.blush, letterSpacing: 4, whiteSpace: 'nowrap'}}>DM FOR PRICES · WE DELIVER NATIONWIDE</div>
      </div>
    </AbsoluteFill>
  );
};


// @@NEW@@
// ---------- flat icons for products without photos ----------
const IconPhone: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x="40" y="150" width="120" height="16" rx="8" fill={C.plum} />
    <path d="M100 150 L100 112" stroke={C.plum} strokeWidth="12" strokeLinecap="round" />
    <path d="M70 118 L130 118" stroke={C.plum} strokeWidth="10" strokeLinecap="round" />
    <rect x="68" y="20" width="64" height="104" rx="12" fill={C.white} stroke={C.plum} strokeWidth="6" />
    <rect x="76" y="32" width="48" height="76" rx="4" fill={C.pink} />
    <circle cx="100" cy="116" r="3.5" fill={C.plum} />
  </svg>
);
const IconHook: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x="30" y="34" width="140" height="28" rx="14" fill={C.white} stroke={C.plum} strokeWidth="6" />
    {[60, 100, 140].map((x) => <path key={x} d={`M${x} 62 L${x} 120 Q${x} 146 ${x + 20} 146 Q${x + 34} 146 ${x + 34} 128`} fill="none" stroke={C.pink} strokeWidth="10" strokeLinecap="round" />)}
    <circle cx="40" cy="48" r="5" fill={C.plum} /><circle cx="160" cy="48" r="5" fill={C.plum} />
  </svg>
);
const IconBottle: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x="44" y="18" width="40" height="18" rx="6" fill={C.plum} />
    <rect x="34" y="36" width="60" height="146" rx="22" fill={C.white} stroke={C.plum} strokeWidth="6" />
    <rect x="40" y="96" width="48" height="80" rx="16" fill="#8FD8FF" opacity=".8" />
    <path d="M118 84 Q118 60 140 60 Q162 60 162 84" fill="none" stroke={C.plum} strokeWidth="7" />
    <rect x="104" y="80" width="72" height="100" rx="14" fill={C.pink} stroke={C.plum} strokeWidth="6" />
    <path d="M124 124 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill={C.white} />
  </svg>
);
const ICONS: Record<string, React.FC> = {phone: IconPhone, hooks: IconHook, bottles: IconBottle};

// ---------- product scenes (one per product the client listed) ----------
type Media = {kind: 'cut' | 'shot' | 'arch' | 'icon'; src: string; pos?: string; crop?: string};
type Prod = {id: string; bg: string; dot: string; ring: string; title: string; tc: string; sub: string; sc: string; m: Media; note?: string};
const PRODUCTS: Prod[] = [
  {id: 'ringlight', bg: C.hot, dot: C.plum, ring: C.white, title: 'SHINE', tc: C.white, sub: 'selfie ring light', sc: C.blush, m: {kind: 'cut', src: 'ringlight_cut.png'}, note: 'clip-on · 3 light modes'},
  {id: 'totes', bg: C.cream, dot: C.pink, ring: C.pink, title: 'CARRY', tc: C.plum, sub: 'face tote bags', sc: C.pink, m: {kind: 'arch', src: 'totes.jpg'}, note: 'many prints to pick from'},
  {id: 'stars', bg: '#1E0718', dot: C.mag, ring: C.pink, title: 'GLOW', tc: C.white, sub: 'glow in the dark stars', sc: '#C9FFEA', m: {kind: 'shot', src: 'stars.jpg', pos: '62% 50%'}, note: 'light up your room'},
  {id: 'gloss', bg: C.pink, dot: C.blush, ring: C.white, title: 'GLOSS', tc: C.white, sub: 'lip gloss', sc: C.plum, m: {kind: 'cut', src: 'gloss_cut.png', crop: 'inset(0 0 0 22%)'}, note: 'long-lasting shine'},
  {id: 'masks', bg: C.blush, dot: C.pink, ring: C.white, title: 'PAMPER', tc: C.plum, sub: 'facial masks', sc: C.hot, m: {kind: 'shot', src: 'masks.jpg', pos: '50% 35%'}, note: 'self-care night, sorted'},
  {id: 'aloe', bg: C.plum, dot: C.mag, ring: C.white, title: 'SOOTHE', tc: C.white, sub: 'aloe vera gel', sc: C.blush, m: {kind: 'cut', src: 'aloe_cut.png'}, note: 'soothing & moisture'},
  {id: 'perfume', bg: C.mag, dot: C.hot, ring: C.white, title: 'SCENT', tc: C.white, sub: 'perfume oils', sc: C.blush, m: {kind: 'cut', src: 'perfume_cut.png'}, note: 'lots of scents'},
  {id: 'phone', bg: C.pink, dot: C.blush, ring: C.white, title: 'HOLD', tc: C.white, sub: 'phone holders', sc: C.plum, m: {kind: 'icon', src: 'phone'}, note: 'hands-free scrolling'},
  {id: 'hooks', bg: C.cream, dot: C.blush, ring: C.pink, title: 'HANG', tc: C.plum, sub: 'wall hooks', sc: C.pink, m: {kind: 'icon', src: 'hooks'}, note: 'tidy home, no drilling stress'},
  {id: 'bottles', bg: C.hot, dot: C.pink, ring: C.white, title: 'HYDRATE', tc: C.white, sub: 'water bottles & bags', sc: C.blush, m: {kind: 'icon', src: 'bottles'}, note: 'take it everywhere'},
  {id: 'cups', bg: C.blush, dot: C.white, ring: C.pink, title: 'SIP', tc: C.plum, sub: 'sippy cups', sc: C.hot, m: {kind: 'cut', src: 'cups_cut.png'}, note: 'with lid & straw'},
  {id: 'mugs', bg: C.plum, dot: C.mag, ring: C.blush, title: 'WARM', tc: C.white, sub: 'mug warmer sets', sc: C.blush, m: {kind: 'shot', src: 'mugs.jpg'}, note: 'keeps your drink warm'},
  {id: 'headbands', bg: C.pink, dot: C.hot, ring: C.white, title: 'STYLE', tc: C.white, sub: 'headbands', sc: C.plum, m: {kind: 'shot', src: 'headbands.jpg'}, note: 'soft · many colours'},
  {id: 'belt', bg: C.cream, dot: C.blush, ring: C.pink, title: 'RELAX', tc: C.plum, sub: 'heating belt', sc: C.pink, m: {kind: 'shot', src: 'belt.jpg', pos: '55% 40%'}, note: 'warm comfort for cramps'},
];

const SaleTag: React.FC<{d: number}> = ({d}) => {
  const s = useSpring(d, 9, 220);
  return (
    <div style={{position: 'absolute', right: 70, top: 130, width: 210, height: 210, borderRadius: '50%', background: C.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${s}) rotate(${12 + (1 - s) * 40}deg)`, boxShadow: '0 16px 40px rgba(58,13,46,.3)'}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 76, color: C.hot, lineHeight: 0.9}}>20%</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.plum, letterSpacing: 4}}>OFF</div>
    </div>
  );
};

const makeProduct = (pr: Prod, i: number): React.FC => () => {
  const f = useCurrentFrame();
  const left = i % 2 === 0;
  const k = useSpring(4, 13, 140);
  const m = pr.m;
  const Icon = m.kind === 'icon' ? ICONS[m.src] : null;
  return (
    <AbsoluteFill style={{background: pr.bg, overflow: 'hidden'}}>
      <Dot x={left ? 760 : 320} y={820} r={440} c={pr.dot} d={0} o={0.9} />
      <Half x={left ? 120 : 960} y={1930} r={170} c={pr.ring} d={8} rot={0} />
      {m.kind === 'cut' && <Pop src={p(m.src)} d={6} w={900} x={540} y={800} rot={left ? -6 : 6} crop={m.crop} />}
      {m.kind === 'shot' && <Shot src={p(m.src)} d={4} size={760} x={540} y={800} ring={pr.ring} pos={m.pos} />}
      {m.kind === 'arch' && <Shot src={p(m.src)} d={4} size={740} x={540} y={820} ring={pr.ring} arch />}
      {Icon && (
        <div style={{position: 'absolute', left: 540 - 380, top: 800 - 380, width: 760, height: 760, borderRadius: '50%', background: C.white, boxShadow: `0 0 0 14px ${pr.ring}, 0 40px 80px rgba(58,13,46,.3)`,
          transform: `scale(${k})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 520, height: 520, transform: `translateY(${Math.sin(f / 20) * 10}px) rotate(${Math.sin(f / 30) * 3}deg)`}}><Icon /></div>
        </div>
      )}
      <Spark x={left ? 140 : 940} y={360} s={70} d={14} c={pr.tc} />
      <Spark x={left ? 930 : 150} y={1260} s={44} d={20} c={pr.tc} />
      <SaleTag d={22} />
      <Center y={1300}>
        <Word text={pr.title} d={12} size={pr.title.length > 5 ? 165 : 200} color={pr.tc} ls={6} />
        <Word text={pr.sub} d={24} size={104} color={pr.sc} font={SCRIPT} weight={400} stagger={1} />
        {pr.note && <div style={{marginTop: 22, opacity: interpolate(f, [40, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <Word text={pr.note.toUpperCase()} d={40} size={34} color={pr.tc} weight={600} ls={6} stagger={0.5} /></div>}
      </Center>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #FF63AE 0%, ${C.pink} 35%, ${C.mag} 85%)`}}>
    {[...Array(12)].map((_, i) => <Spark key={i} x={(i * 331) % 1000 + 40} y={(i * 571) % 1800 + 60} s={14 + (i % 3) * 10} c="rgba(255,255,255,.75)" d={6 + i * 3} />)}
    <Center y={700}><Logo d={6} /></Center>
    <Center y={1240}><Word text="your one-stop shop" d={70} size={96} color={C.white} font={SCRIPT} weight={400} stagger={1} /></Center>
  </AbsoluteFill>
);

const GRID: [string, boolean][] = [['ringlight_cut.png', true], ['totes.jpg', false], ['stars.jpg', false], ['gloss_cut.png', true], ['masks.jpg', false], ['aloe_cut.png', true],
  ['perfume_cut.png', true], ['phone', true], ['hooks', true], ['bottles', true], ['cups_cut.png', true], ['mugs.jpg', false], ['headbands.jpg', false], ['belt.jpg', false], ['sale', true]];
const Grid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.plum}}>
      <Center y={110}><Word text="ALL OF THIS" d={0} size={96} color={C.white} ls={6} /></Center>
      <div style={{position: 'absolute', top: 280, left: 60, right: 60, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
        {GRID.map(([n, cut], i) => {
          const s = spring({frame: f - 6 - i * 3, fps: FPS, config: {damping: 12, stiffness: 180, mass: 0.6}});
          const Icon = ICONS[n];
          return (
            <div key={i} style={{aspectRatio: '1.25', borderRadius: 40, background: n === 'sale' ? C.pink : i % 2 ? C.blush : C.white, overflow: 'hidden', transform: `scale(${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {n === 'sale' ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 70, color: C.white, lineHeight: 0.9, textAlign: 'center'}}>20%<br /><span style={{fontSize: 40}}>OFF</span></div>
                : Icon ? <div style={{width: '70%', height: '85%'}}><Icon /></div>
                : <Img src={p(n)} style={cut ? {width: '82%', height: '82%', objectFit: 'contain'} : {width: '100%', height: '100%', objectFit: 'cover'}} />}
            </div>
          );
        })}
      </div>
      <Center y={1600}>
        <div style={{background: C.pink, borderRadius: 100, padding: '18px 48px', transform: `scale(${useSpring(60, 10, 200)})`}}>
          <Word text="EVERYTHING 20% OFF" d={62} size={72} color={C.white} ls={2} stagger={1} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

const Prices: React.FC = () => {
  const f = useCurrentFrame();
  const bubble = (d: number, side: 'l' | 'r', children: React.ReactNode) => {
    const s = useSpring(d, 12, 170);
    return <div style={{alignSelf: side === 'l' ? 'flex-start' : 'flex-end', background: side === 'l' ? C.white : C.pink, color: side === 'l' ? C.plum : C.white, fontFamily: SANS, fontWeight: 700, fontSize: 50,
      padding: '28px 40px', borderRadius: side === 'l' ? '40px 40px 40px 8px' : '40px 40px 8px 40px', transform: `scale(${s})`, transformOrigin: side === 'l' ? '0% 100%' : '100% 100%', maxWidth: 760, boxShadow: '0 14px 30px rgba(58,13,46,.2)'}}>{children}</div>;
  };
  return (
    <AbsoluteFill style={{background: C.blush}}>
      <Dot x={540} y={-160} r={680} c={C.pink} d={0} />
      <Center y={140}><Word text="HOW MUCH?" d={6} size={130} color={C.white} ls={6} /></Center>
      <div style={{position: 'absolute', left: 80, right: 80, top: 520, display: 'flex', flexDirection: 'column', gap: 40}}>
        {bubble(20, 'l', 'Hi! How much is the ring light? 😍')}
        {bubble(50, 'r', 'Send us a message, we reply fast 💖')}
        {bubble(80, 'l', 'Do you deliver to Lagos? 🚚')}
        {bubble(108, 'r', 'Yes! Anywhere in Nigeria ✅')}
      </div>
      <Center y={1420}>
        <Word text="CONTACT US" d={130} size={130} color={C.plum} ls={6} />
        <Word text="for prices" d={142} size={110} color={C.hot} font={SCRIPT} weight={400} stagger={1} />
        <div style={{marginTop: 26, display: 'flex', gap: 40, transform: `scale(${useSpring(150, 10, 200)})`, opacity: f > 148 ? 1 : 0}}><WA size={110} /><Tik size={110} /></div>
      </Center>
    </AbsoluteFill>
  );
};

const Countdown: React.FC = () => {
  const f = useCurrentFrame();
  const flip = useSpring(20, 12, 120);
  const pulse = 1 + 0.04 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{background: C.plum}}>
      {[...Array(10)].map((_, i) => <Spark key={i} x={(i * 397) % 1000 + 40} y={(i * 613) % 1800 + 60} s={16 + (i % 3) * 10} c="#FFB6D5" d={i * 3} />)}
      <Center y={260}><Word text="HURRY!" d={4} size={150} color={C.pink} ls={10} /><Word text="the sale ends" d={16} size={110} color={C.white} font={SCRIPT} weight={400} stagger={1} /></Center>
      <div style={{position: 'absolute', left: 240, top: 720, width: 600, height: 600, borderRadius: 60, background: C.white, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.4)',
        transform: `perspective(1400px) rotateX(${(1 - flip) * 90}deg) scale(${pulse})`, transformOrigin: '50% 0%'}}>
        <div style={{height: 170, background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 84, color: C.white, letterSpacing: 10}}>MON</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 290, color: C.plum, textAlign: 'center', lineHeight: 1.05}}>19</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.hot, textAlign: 'center', letterSpacing: 14}}>OCT</div>
      </div>
      <Center y={1480}><Word text="DON'T MISS 20% OFF" d={60} size={78} color={C.white} ls={3} stagger={1} /></Center>
    </AbsoluteFill>
  );
};

const HookOff: React.FC = () => <Off />;
const T = TL as unknown as {bpm: number; drop: number; scenes: [string, number][]};
const BY_ID: Record<string, React.FC> = {intro: Intro, hook: Hook, off: HookOff, grid: Grid, ibadan: Deliver, prices: Prices, countdown: Countdown, end: End};
PRODUCTS.forEach((pr, i) => (BY_ID[pr.id] = makeProduct(pr, i)));
const ORIG: [number, number][] = [[50, 50], [80, 20], [20, 80], [50, 0], [100, 50], [0, 50], [50, 100], [80, 80], [20, 20]];
const SC: [React.FC, number, number, number][] = T.scenes.map(([id, len], i) => [BY_ID[id], len, ...ORIG[i % ORIG.length]] as [React.FC, number, number, number]);
export const TOTAL = SC.reduce((a, s) => a + s[1], 0) * BEAT;
export const CUTS = SC.reduce<number[]>((a, s, i) => (i ? [...a, a[a.length - 1] + SC[i - 1][1] * BEAT] : [0]), []);

export const Ad: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.cream}}>
      {SC.map(([Comp, len, cx, cy], i) => (
        <Sequence key={i} from={CUTS[i]} durationInFrames={i < SC.length - 1 ? len * BEAT + 20 : len * BEAT}>
          {i === 0 ? <Comp /> : <Reveal bg="transparent" cx={cx} cy={cy}><Comp /></Reveal>}
        </Sequence>
      ))}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / TOTAL) * 100}%`, background: C.white, opacity: 0.8}} />
      <Audio src={staticFile('music.wav')} />
    </AbsoluteFill>
  );
};
