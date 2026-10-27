// Self-check gallery for kit/camera + kit/transitions. One composition per technique.
import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame} from 'remotion';
import {loadFonts, SANS} from '../kit/fonts';
import {EASE, prog, tw} from '../kit/core';
import {DarkGlow, LightBlobs} from '../kit/ui';
import {Camera, DepthLayer, DofFlyThrough, ExplodedLayers, ScreenTunnel, focusAt, moves, radialDof} from '../kit/camera';
import {
  AiryBlobs,
  BeamReveal,
  BlurCrossfade,
  ChromaSplit,
  CircleTakeover,
  CrtOn,
  Defocus,
  EdgeGlow,
  Fisheye,
  FilmGrain,
  FocusPull,
  GenerationFlash,
  GlowBg,
  GooCluster,
  HeroMorph,
  HoloCut,
  HorizonRim,
  Hyperspace,
  InvertFlash,
  LightStreak,
  NeonWave,
  OnBeats,
  PunchThrough,
  RingZoomThrough,
  SpeedPan,
  Vignette,
  WhipPan,
  ZoomThrough,
  beatGrid,
  greyStep,
  smear,
  strobe,
  wobble,
} from '../kit/transitions';

loadFonts();

const T: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size = 96, color = '#fff', children, style}) => (
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: size, color, letterSpacing: '-0.02em', ...style}}>{children}</div>
);
const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);
const Card: React.FC<{w?: number; h?: number; bg?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({w = 640, h = 380, bg = '#14181f', children, style}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 28,
      background: bg,
      border: '1px solid rgba(255,255,255,.12)',
      boxShadow: '0 30px 80px rgba(0,0,0,.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);
const SceneDark: React.FC<{label: string}> = ({label}) => (
  <AbsoluteFill>
    <GlowBg variant="teal-band" />
    <Center>
      <Card>
        <T>{label}</T>
      </Card>
    </Center>
  </AbsoluteFill>
);
const SceneLight: React.FC<{label: string}> = ({label}) => (
  <AbsoluteFill>
    <LightBlobs f={0} />
    <Center>
      <T color="#0d1220">{label}</T>
    </Center>
  </AbsoluteFill>
);
const grid = (
  <AbsoluteFill
    style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
      backgroundSize: '120px 120px',
    }}
  />
);

// 1. keyframe camera: push + drift + 3D tilt + macro pull
const CamKeys: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#08090c'}}>
      <DarkGlow glow="#8b7bd8" />
      <Camera
        f={f}
        drift={1}
        keys={[...moves.tiltUp(0, 60), {at: 100, scale: 1.12, ease: (t) => t}, ...moves.macroPull(140, 520, 260, 60, 8)]}
      >
        {grid}
        <Center>
          <Card w={900} h={520}>
            <div style={{textAlign: 'center'}}>
              <T size={40} color="#9aa">Friday, 4 September</T>
              <T size={120}>9h 15m</T>
            </div>
          </Card>
        </Center>
      </Camera>
      <FilmGrain f={f} />
    </AbsoluteFill>
  );
};

// 2. whip pan
const Whip: React.FC = () => {
  const f = useCurrentFrame();
  return <WhipPan f={f} at={30} a={<SceneDark label="Before" />} b={<SceneDark label="After" />} dir="left" />;
};
const WhipV: React.FC = () => {
  const f = useCurrentFrame();
  return <WhipPan f={f} at={30} a={<SceneDark label="Up we go" />} b={<SceneDark label="Landed" />} dir="up" blackGap={2} overshoot={12} />;
};

// 3. zoom-through button
const Zoom: React.FC = () => {
  const f = useCurrentFrame();
  const arrow = <path d="M32 50H68M54 36L68 50L54 64" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <ZoomThrough
      f={f}
      at={20}
      cx={1320}
      cy={540}
      size={140}
      a={
        <AbsoluteFill style={{background: '#0b0a14'}}>
          <Center style={{justifyContent: 'center', paddingRight: 260}}>
            <Card w={900} h={180} bg="#15132a">
              <T size={56} color="#cfcaf5">Make a landing page</T>
            </Card>
          </Center>
        </AbsoluteFill>
      }
      b={<SceneLight label="Next scene" />}
      glyph={arrow}
    />
  );
};

// 4. ring zoom-through
const Rings: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#e9ebef'}}>
      <RingZoomThrough f={f} at={20} label={<T size={44}>connected.</T>} after={<SceneLight label="Light world" />} />
    </AbsoluteFill>
  );
};

// 5. hero morph dot -> pill -> card -> logo
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkGlow glow="#8b7bd8" />
      <HeroMorph
        f={f}
        keys={[
          {at: 0, x: 600, y: 540, w: 16, h: 16, fill: '#ffffff', glow: 'rgba(255,255,255,.8)'},
          {at: 30, dur: 12, x: 960, y: 540, w: 300, h: 96, fill: '#171230', content: <T size={44} color="#DEDBF6">Sleep 67</T>},
          {at: 80, dur: 14, x: 960, y: 540, w: 760, h: 460, r: 40, fill: '#1d1b2a', content: <T size={64}>Weekly score</T>},
          {at: 130, dur: 14, x: 960, y: 540, w: 220, h: 220, r: 60, fill: '#8b7bd8', glow: 'rgba(139,123,216,.7)', content: <T size={110}>H</T>},
        ]}
        style={{border: '3px solid rgba(222,219,246,.6)'}}
      />
    </AbsoluteFill>
  );
};

// 6. defocus morph + rack focus
const DefocusRack: React.FC = () => {
  const f = useCurrentFrame();
  const focus = f < 90 ? focusAt(f, 50, 0, 1) : focusAt(f, 90, 1, 0);
  return (
    <AbsoluteFill style={{background: '#040001'}}>
      <GlowBg variant="red-room" f={f} />
      <DepthLayer z={1} focus={focus}>
        <Center style={{justifyContent: 'flex-start', paddingTop: 120}}>
          <T size={150} color="#6b2a30">Background UI</T>
        </Center>
      </DepthLayer>
      <DepthLayer z={0} focus={focus}>
        <Defocus
          f={f}
          at={10}
          a={
            <Center>
              <Card w={300} h={300} bg="#2a0a0e">
                <T size={50}>Widget</T>
              </Card>
            </Center>
          }
          b={
            <Center>
              <Card w={700} h={140} bg="#fff" style={{borderRadius: 999}}>
                <T size={56} color="#160306">Focus on</T>
              </Card>
            </Center>
          }
        />
      </DepthLayer>
    </AbsoluteFill>
  );
};

// 7. flashes: invert + strobe + generation flash
const Flashes: React.FC = () => {
  const f = useCurrentFrame();
  const dark = strobe(f, [20, 50, 64]);
  return (
    <InvertFlash f={f} cuts={[90]}>
      {f < 90 ? (
        <AbsoluteFill style={{background: dark ? '#000' : '#fff'}}>
          <Center>
            <T size={180} color={dark ? '#fff' : '#000'}>{dark ? 'would' : 'you'}</T>
          </Center>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{background: '#0F0403'}}>
          <NeonWave f={f} />
        </AbsoluteFill>
      )}
    </InvertFlash>
  );
};
const GenFlash: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <GenerationFlash
      f={f}
      at={20}
      before={<SceneLight label="Generate" />}
    >
      <AbsoluteFill style={{background: 'linear-gradient(135deg,#f79a5b,#d64f8a 50%,#3a6bd8)'}}>
        <Center>
          <T size={140}>Result</T>
        </Center>
      </AbsoluteFill>
    </GenerationFlash>
  );
};

// 8. holographic cut
const Holo: React.FC = () => {
  const f = useCurrentFrame();
  return f < 20 ? (
    <SceneLight label="Insights" />
  ) : (
    <HoloCut f={f} at={20}>
      <Center>
        <Card w={520} h={520} bg="linear-gradient(160deg,#0c4b4b,#f3e7c9)">
          <T size={120}>4.2K</T>
        </Card>
      </Center>
    </HoloCut>
  );
};

// 9. smear + wobble
const Smear: React.FC = () => {
  const f = useCurrentFrame();
  const pos = (t: number) => {
    const w = wobble(t, 20);
    return {x: -700 + 700 * w, y: 0};
  };
  return (
    <AbsoluteFill>
      <GlowBg variant="space-blue" />
      <Center>
        <div style={{...smear(pos, f), width: 360, height: 110, borderRadius: 999, background: 'linear-gradient(90deg,#5B8CFF,#1E3FA0)', boxShadow: '0 0 30px #3A6BFF66'}} />
      </Center>
    </AbsoluteFill>
  );
};

// 10. gooey cluster -> logo
const Goo: React.FC = () => {
  const f = useCurrentFrame();
  const from = [
    {x: 760, y: 420, w: 220, h: 200},
    {x: 1000, y: 380, w: 200, h: 200},
    {x: 860, y: 640, w: 200, h: 200},
    {x: 1110, y: 640, w: 200, h: 200, r: 0.5},
  ];
  const to = [
    {x: 890, y: 430, w: 170, h: 110},
    {x: 1030, y: 540, w: 170, h: 110},
    {x: 890, y: 650, w: 170, h: 110},
    {x: 1030, y: 540, w: 90, h: 90, r: 0.5},
  ];
  return (
    <AbsoluteFill style={{background: '#F6F3F0'}}>
      <GooCluster f={f} at={30} from={from} to={to} />
    </AbsoluteFill>
  );
};

// 11. hyperspace + punch-through
const Hyper: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#030806'}}>
      <Hyperspace f={f} at={20} />
      {f < 32 && (
        <PunchThrough f={f} at={22}>
          <Center>
            <T size={110}>EarnEdits</T>
          </Center>
        </PunchThrough>
      )}
    </AbsoluteFill>
  );
};

// 12. fisheye
const Fish: React.FC = () => {
  const f = useCurrentFrame();
  const cells = ['#fff', '#16171b', '#e9e8ff', '#eaf6ff'];
  return (
    <AbsoluteFill style={{background: '#0F0403'}}>
      <NeonWave f={f} />
      <Fisheye strength={tw(f, [0, 30], [0, 0.22])}>
        <AbsoluteFill style={{padding: 90, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0}}>
          {cells.map((c, i) => (
            <div key={i} style={{background: c, border: '2px dashed rgba(255,255,255,.8)'}} />
          ))}
        </AbsoluteFill>
        <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.7) 0 12px, transparent 12px 24px)', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 50%'}} />
      </Fisheye>
    </AbsoluteFill>
  );
};

// 13. horizon rim + beam
const Horizon: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 36, EASE.out);
  return (
    <AbsoluteFill>
      <HorizonRim p={p} beam={prog(f, 0, 40)} />
      <Center style={{paddingBottom: 60}}>
        <T size={170} style={{color: '#fff', filter: `blur(${tw(f, [6, 36], [6, 0])}px)`, transform: `translateY(${tw(f, [6, 36], [60, 0])}px)`}}>
          ClickUp
        </T>
      </Center>
      <FilmGrain f={f} opacity={0.06} />
    </AbsoluteFill>
  );
};

// 14. backgrounds + streak + edge glow
const Lights: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <EdgeGlow intensity={tw(f, [0, 40], [0.6, 1])} />
      <Center>
        <T size={90}>But what if it just worked?</T>
      </Center>
      <LightStreak f={f} at={10} y={620} />
      <Vignette />
      <FilmGrain f={f} />
    </AbsoluteFill>
  );
};
const Blobs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AiryBlobs f={f} />
      <Center>
        <T size={110} color="#0d1220">Let me guess</T>
      </Center>
      <FilmGrain f={f} opacity={0.03} />
    </AbsoluteFill>
  );
};

// 15. beat grid + chroma + circle takeover
const Beats: React.FC = () => {
  const f = useCurrentFrame();
  const g = beatGrid({bpm: 120});
  const words = ['Live', 'Go', 'Move', 'Travel', 'Pay'];
  return (
    <AbsoluteFill style={{background: '#163300'}}>
      <OnBeats
        f={f}
        items={words}
        render={(w, l) => (
          <Center>
            <T size={200} color="#9FE870" style={{filter: `blur(${tw(l, [0, 4], [8, 0])}px)`, transform: `scale(${1 + 0.08 * g.pulse(f)})`}}>
              {w} anywhere
            </T>
          </Center>
        )}
      />
      <CircleTakeover f={f} at={140} color="#9FE870" />
    </AbsoluteFill>
  );
};

// 16. DOF fly-through + exploded layers + tunnel
const Dof: React.FC = () => {
  const f = useCurrentFrame();
  const items = Array.from({length: 40}).map((_, i) => ({
    x: ((i * 397) % 1600) - 800,
    y: ((i * 211) % 800) - 400,
    z: -800 + ((i * 53) % 1400) + 1000,
    node: <div style={{fontFamily: SANS, fontSize: 60, color: '#cfe', whiteSpace: 'nowrap', padding: '10px 24px', borderRadius: 999, border: '1px solid #3d63ff', background: 'rgba(10,20,60,.6)'}}>label {i}</div>,
  }));
  return (
    <AbsoluteFill style={{background: '#020414'}}>
      <DofFlyThrough f={f} items={items} camZ={tw(f, [0, 100], [-400, 800], EASE.inOut)} />
    </AbsoluteFill>
  );
};
const Explode: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 10, 70, EASE.inOut);
  return (
    <AbsoluteFill style={{background: '#0d0d0d'}}>
      <ExplodedLayers
        p={p}
        layers={[
          <AbsoluteFill key="a" style={{background: '#163300'}} />,
          <Center key="b">
            <Card w={800} h={420} bg="#9FE870" />
          </Center>,
          <Center key="c">
            <T size={120} color="#163300">Wise</T>
          </Center>,
        ]}
      />
    </AbsoluteFill>
  );
};
const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const face = (c: string, t: string) => (
    <Center style={{background: c}}>
      <T size={48} color="#333">{t}</T>
    </Center>
  );
  return (
    <AbsoluteFill>
      <GlowBg variant="teal-band" />
      <ScreenTunnel f={f} faces={[face('#eef', 'Docs'), face('#fde', 'Chat'), face('#efe', 'Tasks'), face('#ffe', 'Goals')]} />
    </AbsoluteFill>
  );
};

// 17. misc transitions
const Misc: React.FC = () => {
  const f = useCurrentFrame();
  const bgc = greyStep(f, 60);
  return (
    <AbsoluteFill style={{background: bgc}}>
      {f < 60 ? (
        <FocusPull f={f} at={15} a={<SceneLight label="Phone" />} b={<SceneLight label="Floating UI" />} />
      ) : f < 72 ? null : f < 110 ? (
        <CrtOn f={f} at={72}>
          <Center style={{background: '#11153B'}}>
            <T size={200}>FILES</T>
          </Center>
        </CrtOn>
      ) : (
        <BeamReveal f={f} at={110}>
          <ChromaSplit dx={6}>
            <SceneDark label="Beam" />
          </ChromaSplit>
        </BeamReveal>
      )}
    </AbsoluteFill>
  );
};
const Pan: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <SpeedPan f={f} at={0} dur={90}>
        <div style={{position: 'absolute', top: 470, left: 200, whiteSpace: 'nowrap'}}>
          <T size={120} color="#111">your files, your notes, your calendar, your everything</T>
        </div>
      </SpeedPan>
      <BlurCrossfade f={f} at={200} a={null} b={null} />
    </AbsoluteFill>
  );
};

export const GALLERY: {id: string; c: React.FC; d: number}[] = [
  {id: 'CamKeys', c: CamKeys, d: 220},
  {id: 'Whip', c: Whip, d: 80},
  {id: 'WhipV', c: WhipV, d: 80},
  {id: 'Zoom', c: Zoom, d: 80},
  {id: 'Rings', c: Rings, d: 90},
  {id: 'Hero', c: Hero, d: 160},
  {id: 'DefocusRack', c: DefocusRack, d: 130},
  {id: 'Flashes', c: Flashes, d: 120},
  {id: 'GenFlash', c: GenFlash, d: 80},
  {id: 'Holo', c: Holo, d: 80},
  {id: 'Smear', c: Smear, d: 80},
  {id: 'Goo', c: Goo, d: 90},
  {id: 'Hyper', c: Hyper, d: 50},
  {id: 'Fish', c: Fish, d: 60},
  {id: 'Horizon', c: Horizon, d: 60},
  {id: 'Lights', c: Lights, d: 60},
  {id: 'Blobs', c: Blobs, d: 60},
  {id: 'Beats', c: Beats, d: 160},
  {id: 'Dof', c: Dof, d: 100},
  {id: 'Explode', c: Explode, d: 80},
  {id: 'Tunnel', c: Tunnel, d: 110},
  {id: 'Misc', c: Misc, d: 150},
  {id: 'Pan', c: Pan, d: 90},
];

export const CameraGallery: React.FC = () => (
  <>
    {GALLERY.map((g) => (
      <Composition key={g.id} id={g.id} component={g.c} width={1920} height={1080} fps={60} durationInFrames={g.d} />
    ))}
  </>
);
