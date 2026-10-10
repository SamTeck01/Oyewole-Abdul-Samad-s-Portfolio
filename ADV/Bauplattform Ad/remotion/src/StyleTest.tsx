import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlertTriangle, FileText, Mail, Ruler, Truck, Receipt, Image as ImageIcon} from 'lucide-react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/800.css';

// Palette (reference family: lime → navy, cream cards, orange-red warnings)
export const C = {
  navy: '#25305A',
  navy2: '#3B4A7A',
  lime: '#D6E46A',
  olive: '#7E9A3C',
  teal: '#A9D5D6',
  cream: '#F3F2D6',
  white: '#FFFFFF',
  warn: '#F2622E',
  skin: '#F4A08F',
  skinShade: '#E07F70',
  hair: '#2B2222',
  sweater: '#DCEBA8',
  sweaterShade: '#BFD585',
  ink: '#1D2333',
};

const ease = Easing.bezier(0.33, 0, 0.15, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- shared pieces ----------
const ErrorCard: React.FC<{title: string; sub: string; w?: number; icon?: React.ReactNode}> = ({title, sub, w = 300, icon}) => (
  <div style={{width: w, borderRadius: 10, background: C.cream, boxShadow: '0 18px 40px rgba(20,30,60,.25)', overflow: 'hidden', fontFamily: 'Inter'}}>
    <div style={{height: 22, background: '#E4E3BE', display: 'flex', gap: 6, alignItems: 'center', padding: '0 10px'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 7, height: 7, borderRadius: 4, background: '#B9B88F'}} />)}
    </div>
    <div style={{padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start'}}>
      <div style={{color: C.warn, flexShrink: 0}}>{icon ?? <AlertTriangle size={30} fill={C.warn} color={C.cream} />}</div>
      <div>
        <div style={{fontWeight: 600, fontSize: 18, color: C.ink}}>{title}</div>
        <div style={{fontSize: 14, color: '#6B6E62', marginTop: 4}}>{sub}</div>
        <div style={{marginTop: 10, width: 54, height: 22, borderRadius: 5, background: C.warn, color: 'white', fontSize: 12, fontWeight: 600, display: 'grid', placeItems: 'center'}}>OK</div>
      </div>
    </div>
  </div>
);

const ERRORS = [
  {t: 'Plan v7 ≠ Plan v9', s: 'Which version is current?', x: -560, y: -300, r: -6},
  {t: 'Delivery delayed', s: 'Concrete C30/37 · +3 days', x: 420, y: -330, r: 5},
  {t: 'Invoice mismatch', s: '12 m² more than delivered', x: -640, y: 40, r: 4},
  {t: '47 unread emails', s: 'Site · Client · Supplier', x: 520, y: -40, r: -4},
  {t: 'Budget exceeded', s: 'Drywall · +8.4 %', x: -250, y: -420, r: 3},
  {t: 'Missing approval', s: 'Offer #2207 waits since Monday', x: 230, y: -470, r: -3},
  {t: 'Clash found', s: 'Duct vs. beam · Level 2', x: 640, y: 260, r: 6},
  {t: 'Safety check overdue', s: 'Scaffold · Block B', x: -520, y: 330, r: -5},
];

// Window pile: each card springs in, stacked over time
const ErrorPile: React.FC<{start?: number; gap?: number; scale?: number; drift?: number}> = ({start = 0, gap = 9, scale = 1, drift = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {ERRORS.map((e, i) => {
        const s = spring({frame: f - start - i * gap, fps, config: {damping: 13, stiffness: 140}});
        const float = Math.sin((f + i * 40) / 38) * 8;
        return (
          <div key={i} style={{position: 'absolute', transform: `translate(${e.x * scale + drift * (i % 3 - 1)}px, ${e.y * scale + float}px) rotate(${e.r * s}deg) scale(${s * scale})`, opacity: s}}>
            <ErrorCard title={e.t} sub={e.s} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Shot A: top view at the desk ----------
const TopViewLena: React.FC = () => {
  const f = useCurrentFrame();
  const type = Math.sin(f / 3) * 3; // typing hands
  return (
    <svg width={900} height={700} viewBox="0 0 900 700">
      {/* desk */}
      <rect x={80} y={330} width={740} height={330} rx={26} fill={C.white} />
      {/* laptop */}
      <path d="M300 520 L600 520 L640 640 L260 640 Z" fill={C.ink} />
      <rect x={318} y={530} width={264} height={84} rx={6} fill="#3E4766" />
      <rect x={340} y={548} width={120} height={10} rx={5} fill={C.lime} opacity={0.8} />
      <rect x={340} y={570} width={180} height={8} rx={4} fill="#8A93B5" />
      <rect x={340} y={588} width={90} height={8} rx={4} fill={C.warn} />
      {/* keyboard */}
      <rect x={350} y={440} width={200} height={70} rx={8} fill="#C9D0E6" />
      {Array.from({length: 18}).map((_, i) => (
        <rect key={i} x={360 + (i % 6) * 31} y={450 + Math.floor(i / 6) * 20} width={24} height={14} rx={3} fill="#E9ECF6" />
      ))}
      {/* mouse */}
      <ellipse cx={250} cy={470} rx={14} ry={22} fill="#C9D0E6" />
      {/* body from top */}
      <ellipse cx={450} cy={330} rx={190} ry={95} fill={C.sweater} />
      <ellipse cx={450} cy={350} rx={150} ry={60} fill={C.white} opacity={0.9} />
      {/* arms */}
      <path d={`M285 340 Q300 430 ${395} ${470 + type}`} stroke={C.sweater} strokeWidth={56} strokeLinecap="round" fill="none" />
      <path d={`M615 340 Q600 430 ${505} ${470 - type}`} stroke={C.sweater} strokeWidth={56} strokeLinecap="round" fill="none" />
      <circle cx={398} cy={478 + type} r={22} fill={C.skin} />
      <circle cx={502} cy={478 - type} r={22} fill={C.skin} />
      {/* head from top: hair bun */}
      <ellipse cx={450} cy={270} rx={74} ry={68} fill={C.hair} />
      <circle cx={450} cy={214} r={30} fill={C.hair} />
      <path d="M392 300 Q450 330 508 300" stroke={C.skin} strokeWidth={18} fill="none" strokeLinecap="round" />
      {/* glasses rims peeking */}
      <circle cx={418} cy={318} r={14} fill="none" stroke={C.ink} strokeWidth={4} />
      <circle cx={482} cy={318} r={14} fill="none" stroke={C.ink} strokeWidth={4} />
    </svg>
  );
};

const ShotA: React.FC = () => {
  const f = useCurrentFrame();
  // reference: slight pull-back + rising chaos
  const zoom = interpolate(f, [0, 210], [2.0, 1.25], {...clamp, easing: ease});
  const y = interpolate(f, [0, 210], [-120, 120], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${C.navy2} 0%, #8FA6C8 55%, ${C.teal} 100%)`}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translateY(${y}px) scale(${zoom})`}}>
        <TopViewLena />
      </AbsoluteFill>
      <ErrorPile start={20} gap={16} scale={1.45} />
    </AbsoluteFill>
  );
};

// ---------- Shot B: worried close-up ----------
const LenaFace: React.FC<{blink: number; look: number; worry: number}> = ({blink, look, worry}) => {
  const eyeH = 13 * (1 - blink) + 1.5;
  return (
    <svg width={760} height={820} viewBox="0 0 760 820">
      {/* sweater / shoulders */}
      <path d="M60 820 Q90 600 380 580 Q670 600 700 820 Z" fill={C.sweater} />
      <path d="M300 600 Q380 650 460 600" stroke={C.sweaterShade} strokeWidth={6} fill="none" />
      {/* neck */}
      <rect x={335} y={500} width={90} height={110} rx={40} fill={C.skinShade} />
      {/* back hair */}
      <path d="M200 330 Q190 560 270 560 L490 560 Q570 560 560 330 Z" fill={C.hair} />
      {/* head */}
      <ellipse cx={380} cy={370} rx={160} ry={185} fill={C.skin} />
      {/* ears */}
      <ellipse cx={222} cy={390} rx={22} ry={34} fill={C.skin} />
      <ellipse cx={538} cy={390} rx={22} ry={34} fill={C.skin} />
      {/* fringe + bun */}
      <circle cx={380} cy={145} r={62} fill={C.hair} />
      <path d="M215 330 Q220 170 380 175 Q545 170 548 330 Q500 250 400 262 Q330 270 300 230 Q270 290 215 330 Z" fill={C.hair} />
      {/* brows: worried tilt */}
      <path d={`M278 ${318 - worry * 6} L338 ${306 + worry * 8}`} stroke={C.hair} strokeWidth={9} strokeLinecap="round" />
      <path d={`M482 ${318 - worry * 6} L422 ${306 + worry * 8}`} stroke={C.hair} strokeWidth={9} strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx={312 + look * 8} cy={378} rx={10} ry={eyeH} fill={C.ink} />
      <ellipse cx={448 + look * 8} cy={378} rx={10} ry={eyeH} fill={C.ink} />
      {/* glasses */}
      <circle cx={312} cy={376} r={52} fill="rgba(255,255,255,.12)" stroke={C.ink} strokeWidth={8} />
      <circle cx={448} cy={376} r={52} fill="rgba(255,255,255,.12)" stroke={C.ink} strokeWidth={8} />
      <path d="M364 372 Q380 362 396 372" stroke={C.ink} strokeWidth={7} fill="none" />
      {/* nose + mouth */}
      <path d="M380 410 Q372 448 388 452" stroke={C.skinShade} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M345 ${495} Q380 ${495 - 14 * worry + 6} 415 495`} stroke="#9C4B48" strokeWidth={7} fill="none" strokeLinecap="round" />
    </svg>
  );
};

const ShotB: React.FC = () => {
  const f = useCurrentFrame();
  const blinkAt = [70, 160];
  const blink = Math.max(...blinkAt.map((b) => interpolate(f, [b, b + 4, b + 9], [0, 1, 0], clamp)));
  const look = interpolate(f, [30, 50, 120, 140], [0, -1, -1, 1], clamp);
  const worry = interpolate(f, [0, 60], [0.3, 1], clamp);
  const push = interpolate(f, [0, 240], [1, 1.1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${C.navy2} 0%, #8FA6C8 60%, ${C.teal} 100%)`}}>
      {/* background windows, blurred parallax */}
      <AbsoluteFill style={{filter: 'blur(3px)', transform: `translateX(${-f * 0.4}px) scale(1.15)`, opacity: 0.85}}>
        <ErrorPile start={-200} gap={0} scale={1.25} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', transform: `scale(${push})`, transformOrigin: '50% 40%'}}>
        <div style={{marginBottom: -40, transform: 'scale(1.32)', transformOrigin: '50% 100%'}}>
          <LenaFace blink={blink} look={look} worry={worry} />
        </div>
      </AbsoluteFill>
      {/* foreground card, sharp, sliding past */}
      <div style={{position: 'absolute', right: interpolate(f, [0, 240], [-60, 140]), bottom: 90, transform: 'rotate(4deg)'}}>
        <ErrorCard title="Invoice mismatch" sub="12 m² more than delivered" w={340} icon={<Receipt size={30} color={C.warn} />} />
      </div>
    </AbsoluteFill>
  );
};

// white bar wipe (reference cut at 0:06.5)
const BarWipe: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [-30, 130], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <div style={{position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: '28%', background: C.white}} />;
};

// ---------- Shot C: kinetic text with slot-roll on last word ----------
const ROLL = ['plans', 'costs', 'the site', 'everything'];
const ShotC: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lead = 'You need one place for';
  const words = lead.split(' ');
  const per = 34; // frames per rolled word
  const step = interpolate(f, [40, 40 + per * 3], [0, 3], {...clamp});
  const stepEased = Math.floor(step) + Easing.inOut(Easing.cubic)(step % 1);
  return (
    <AbsoluteFill style={{background: `linear-gradient(170deg, ${C.teal} 0%, #CFE3B8 60%, ${C.lime} 100%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'Manrope', fontSize: 74, color: C.white}}>
        <div style={{display: 'flex', gap: 18}}>
          {words.map((w, i) => {
            const s = spring({frame: f - i * 4, fps, config: {damping: 16}});
            return <span key={i} style={{fontWeight: 500, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, display: 'inline-block'}}>{w}</span>;
          })}
        </div>
        <div style={{position: 'relative', height: 100, width: 420, overflow: 'visible'}}>
          {ROLL.map((w, i) => {
            const d = i - stepEased; // 0 = current
            const appear = spring({frame: f - 26, fps, config: {damping: 14}});
            const op = interpolate(Math.abs(d), [0, 1, 1.6], [1, 0.28, 0], clamp) * appear;
            return (
              <span key={w} style={{position: 'absolute', left: 0, top: 0, lineHeight: '100px', fontWeight: 800, color: d === 0 || Math.abs(d) < 0.5 ? C.olive : C.white, opacity: op, transform: `translateY(${d * 78}px) scale(${1 - Math.min(Math.abs(d), 1) * 0.2})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{w}</span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Shot D: floating docs swept into one glowing node ----------
const DOCS = [
  {I: FileText, x: -620, y: -260}, {I: Mail, x: -380, y: -60}, {I: Ruler, x: -560, y: 190}, {I: ImageIcon, x: -180, y: 280},
  {I: Receipt, x: 120, y: -330}, {I: Truck, x: 300, y: 220}, {I: Mail, x: 560, y: -150}, {I: FileText, x: 650, y: 180},
  {I: FileText, x: -80, y: -170}, {I: Ruler, x: 420, y: 40}, {I: ImageIcon, x: -700, y: 20}, {I: Receipt, x: 40, y: 140},
];
const ShotD: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pull = interpolate(f, [90, 190], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const orb = spring({frame: f - 120, fps, config: {damping: 18, stiffness: 60}});
  const beam = interpolate(f, [40, 110], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `linear-gradient(120deg, ${C.navy} 0%, #5C6E5A 45%, ${C.olive} 75%, ${C.lime} 100%)`, overflow: 'hidden'}}>
      {/* light beam from right */}
      <div style={{position: 'absolute', right: -200, top: '20%', width: 1400 * beam, height: 520, background: 'linear-gradient(270deg, rgba(255,255,240,.85), rgba(255,255,240,0))', clipPath: 'polygon(100% 35%, 100% 65%, 0% 100%, 0% 0%)', filter: 'blur(18px)', opacity: 1 - pull * 0.6}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        {DOCS.map(({I, x, y}, i) => {
          const s = spring({frame: f - i * 3, fps, config: {damping: 15}});
          const fl = Math.sin((f + i * 30) / 30) * 10;
          const px = x * (1 - pull) + fl * (1 - pull);
          const py = y * (1 - pull) + fl;
          return (
            <div key={i} style={{position: 'absolute', transform: `translate(${px}px, ${py}px) scale(${s * (1 - pull * 0.9)}) rotate(${pull * 180}deg)`, width: 96, height: 112, borderRadius: 12, background: C.white, display: 'grid', placeItems: 'center', boxShadow: '0 14px 30px rgba(10,20,40,.3)', opacity: 1 - pull * 0.8, filter: i % 4 === 3 ? 'blur(2px)' : undefined}}>
              <I size={44} color={C.olive} strokeWidth={1.8} />
            </div>
          );
        })}
        {/* glowing node */}
        <div style={{position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, #fff 45%, rgba(255,255,230,.6) 62%, rgba(255,255,230,0) 72%)', transform: `scale(${orb})`, filter: 'blur(1px)'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- timeline (15 s @ 60 fps) ----------
export const STYLE_TEST_FRAMES = 900;
export const StyleTest: React.FC = () => (
  <AbsoluteFill style={{background: C.navy}}>
    <Sequence from={0} durationInFrames={215}><ShotA /></Sequence>
    <Sequence from={215} durationInFrames={190}><ShotB /></Sequence>
    <Sequence from={385} durationInFrames={30}><BarWipe dur={30} /></Sequence>
    <Sequence from={405} durationInFrames={250}><ShotC /></Sequence>
    <Sequence from={655} durationInFrames={245}><ShotD /></Sequence>
  </AbsoluteFill>
);
