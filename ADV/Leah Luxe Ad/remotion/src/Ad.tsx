import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
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

const Stars: React.FC = () => {
  const f = useCurrentFrame();
  const g = 0.6 + 0.4 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{background: C.plum}}>
      {[...Array(14)].map((_, i) => <Spark key={i} x={(i * 397) % 1000 + 40} y={(i * 613) % 1800 + 60} s={18 + (i % 4) * 12} c={i % 3 ? '#FFB6D5' : '#C9FFEA'} d={i * 2} />)}
      <Dot x={540} y={860} r={420} c={C.mag} d={0} o={0.35} />
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${40 * g}px rgba(190,255,230,.55))`}}><Shot src={p('stars.jpg')} d={6} size={720} x={540} y={860} ring={C.pink} pos="62% 50%" /></div>
      <Center y={1360}>
        <Word text="GLOW" d={14} size={200} color={C.white} ls={10} />
        <Word text="in the dark" d={26} size={110} color={C.blush} font={SCRIPT} weight={400} stagger={1} />
      </Center>
    </AbsoluteFill>
  );
};

const Ring: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [16, 20, 40], [0, 1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.hot}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,${flash}) 0%, rgba(255,255,255,0) 45%)`}} />
      <Half x={540} y={1920} r={560} c={C.plum} d={2} rot={0} />
      <Pop src={p('ringlight_cut.png')} d={4} w={1000} x={560} y={740} rot={8} glow={`rgba(255,255,255,${flash})`} />
      <Center y={1390}>
        <Word text="SHINE" d={14} size={220} color={C.white} ls={10} />
        <Word text="selfie ring light" d={26} size={100} color={C.blush} font={SCRIPT} weight={400} stagger={1} />
      </Center>
    </AbsoluteFill>
  );
};

const Gloss: React.FC = () => (
  <AbsoluteFill style={{background: C.blush}}>
    <Dot x={300} y={720} r={330} c={C.white} d={0} />
    <Dot x={790} y={980} r={300} c={C.pink} d={4} />
    <Pop src={p('gloss_cut.png')} d={6} w={640} x={330} y={720} rot={-8} crop="inset(0 0 0 22%)" />
    <Pop src={p('aloe_cut.png')} d={14} w={640} x={780} y={980} rot={6} />
    <Center y={1430}>
      <Word text="GLOSS" d={18} size={170} color={C.plum} ls={8} />
      <Word text="& self care" d={30} size={110} color={C.hot} font={SCRIPT} weight={400} stagger={1} />
    </Center>
  </AbsoluteFill>
);

const Totes: React.FC = () => (
  <AbsoluteFill style={{background: C.plum}}>
    <Half x={170} y={340} r={170} c={C.pink} d={4} rot={90} />
    <Dot x={960} y={1560} r={200} c={C.mag} d={8} />
    <Shot src={p('totes.jpg')} d={2} size={760} x={540} y={820} ring={C.pink} arch />
    <Center y={1420}>
      <Word text="CARRY" d={14} size={190} color={C.white} ls={10} />
      <Word text="it in style" d={26} size={110} color={C.pink} font={SCRIPT} weight={400} stagger={1} />
    </Center>
  </AbsoluteFill>
);

const Pamper: React.FC = () => (
  <AbsoluteFill style={{background: C.mag}}>
    <Shot src={p('masks.jpg')} d={2} size={560} x={740} y={560} ring={C.blush} pos="50% 35%" />
    <Pop src={p('perfume_cut.png')} d={10} w={660} x={330} y={1010} rot={-10} />
    <Center y={1420}>
      <Word text="PAMPER" d={16} size={180} color={C.white} ls={8} />
      <Word text="yourself" d={28} size={110} color={C.blush} font={SCRIPT} weight={400} stagger={1} />
    </Center>
  </AbsoluteFill>
);

const Sip: React.FC = () => (
  <AbsoluteFill style={{background: C.blush}}>
    <Dot x={850} y={420} r={220} c={C.pink} d={0} />
    <Shot src={p('mugs.jpg')} d={4} size={560} x={330} y={620} ring={C.white} />
    <Pop src={p('cups_cut.png')} d={12} w={700} x={640} y={1040} rot={5} />
    <Center y={1430}>
      <Word text="SIP" d={18} size={220} color={C.plum} ls={14} />
      <Word text="mugs & sippy cups" d={30} size={96} color={C.hot} font={SCRIPT} weight={400} stagger={1} />
    </Center>
  </AbsoluteFill>
);

const More: React.FC = () => (
  <AbsoluteFill style={{background: C.pink}}>
    <Half x={540} y={0} r={460} c={C.hot} d={0} rot={180} />
    <Shot src={p('headbands.jpg')} d={2} size={540} x={360} y={640} ring={C.white} />
    <Shot src={p('belt.jpg')} d={10} size={460} x={720} y={1010} ring={C.plum} pos="55% 40%" />
    <Center y={1430}>
      <Word text="& MORE" d={16} size={190} color={C.white} ls={8} />
      <Word text="gadgets you'll love" d={28} size={96} color={C.plum} font={SCRIPT} weight={400} stagger={1} />
    </Center>
  </AbsoluteFill>
);

const ALL = ['ringlight_cut.png', 'gloss_cut.png', 'totes.jpg', 'perfume_cut.png', 'stars.jpg', 'masks.jpg', 'aloe_cut.png', 'mugs.jpg', 'cups_cut.png', 'headbands.jpg', 'belt.jpg', 'ringlight_cut.png'];
const Grid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.plum}}>
      <div style={{position: 'absolute', top: 200, left: 50, right: 50, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26}}>
        {ALL.map((n, i) => {
          const s = spring({frame: f - i * 3, fps: FPS, config: {damping: 12, stiffness: 180, mass: 0.6}});
          const cut = n.endsWith('_cut.png');
          return (
            <div key={i} style={{aspectRatio: '1', borderRadius: '50%', background: i % 2 ? C.pink : C.blush, overflow: 'hidden', transform: `scale(${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Img src={p(n)} style={cut ? {width: '80%', height: '80%', objectFit: 'contain'} : {width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          );
        })}
      </div>
      <Center y={1130}>
        <Word text="EVERYTHING" d={30} size={130} color={C.white} ls={6} />
        <div style={{marginTop: 10, background: C.pink, borderRadius: 100, padding: '14px 40px', transform: `scale(${useSpring(44, 10, 200)})`}}>
          <Word text="20% OFF" d={46} size={110} color={C.white} />
        </div>
        <div style={{marginTop: 30}}><Word text="ENDS MON 19 OCT" d={56} size={60} color={C.blush} weight={700} ls={8} stagger={1} /></div>
      </Center>
    </AbsoluteFill>
  );
};

// Simplified Nigeria outline (normalised); Ibadan sits in the south-west
const NG = 'M80 300 L95 230 L120 180 L170 150 L215 95 L290 70 L360 80 L420 60 L480 70 L540 30 L585 60 L600 120 L640 150 L620 210 L560 260 L520 330 L470 400 L410 430 L330 420 L270 460 L200 440 L150 400 L110 390 Z';
const Deliver: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
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
      <Center y={1180}>
        <Word text="DELIVERY" d={16} size={160} color={C.plum} ls={8} />
        <Word text="nationwide" d={28} size={130} color={C.pink} font={SCRIPT} weight={400} stagger={1} />
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

// [component, length in beats, reveal origin x%, y%]
const SC: [React.FC, number, number, number][] = [
  [Hook, 5, 50, 50], [Off, 4, 50, 67], [Stars, 3, 80, 20], [Ring, 3, 20, 80], [Gloss, 3, 50, 0], [Totes, 3, 100, 50],
  [Pamper, 3, 0, 50], [Sip, 3, 50, 100], [More, 3, 80, 80], [Grid, 4, 50, 50], [Deliver, 3, 20, 20], [End, 7, 50, 40],
];
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
      {/* thin progress line in brand pink */}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / TOTAL) * 100}%`, background: C.white, opacity: 0.8}} />
      <Audio src={staticFile('music.wav')} />
    </AbsoluteFill>
  );
};
