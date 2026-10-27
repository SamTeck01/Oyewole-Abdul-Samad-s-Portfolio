// Self-check gallery for src/kit/text.tsx: one composition per technique (see src/gallery-text.ts).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DarkGlow, LightBlobs} from '../kit/ui';
import {CaptionLine} from '../kit/captions';
import {
  ArcLetters,
  BlurWords,
  BracketWords,
  ExtrudedTitle,
  flipAt,
  FlipWord,
  HighlightType,
  InlineCard,
  LetterType,
  LightStreak,
  MixLine,
  Scramble,
  ScriptWriteOn,
  SelectWord,
  ShimmerText,
  SlotCycle,
  SmearWords,
  SplitMorph,
  TagBox,
  TypeBox,
  UrlPill,
  useTextFonts,
  Viewfinder,
  WaveText,
  Words3D,
} from '../kit/text';

const C: React.FC<{children: React.ReactNode; bg?: React.ReactNode; color?: string}> = ({children, bg, color}) => (
  <AbsoluteFill style={{background: color ?? '#fff'}}>
    {bg}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
const Sky = ({f}: {f: number}) => <LightBlobs f={f} base="#F1F9FF" colors={['#CFE6F8', '#BFE0FA', '#DCEEFB', '#C6E2F7']} />;

const Card: React.FC<{c: string; label: string}> = ({c, label}) => (
  <div style={{width: '100%', height: '100%', background: `linear-gradient(135deg, ${c}, #111)`, display: 'flex', alignItems: 'flex-end', padding: 14, color: '#fff', font: '600 20px Inter'}}>{label}</div>
);

export const PANELS: {id: string; dur: number; render: (f: number) => React.ReactNode}[] = [
  // 01 blur-in + selection
  {
    id: 'blur01',
    dur: 120,
    render: (f) => (
      <C bg={<DarkGlow base="#03080B" glow="#0B3A44" x={30} y={20} size={90} strength={0.6} />}>
        <BlurWords words={['Work', 'today', 'is', 'broken']} f={f} preset={{base: 'dark01'}} size={110} />
      </C>
    ),
  },
  {
    id: 'select01',
    dur: 60,
    render: (f) => (
      <C bg={<DarkGlow base="#03080B" glow="#0B3A44" x={30} y={20} size={90} strength={0.6} />}>
        <div style={{display: 'flex', gap: 28, alignItems: 'flex-end', font: '600 110px Inter', color: '#fff', letterSpacing: '-0.025em'}}>
          <span>Work today is</span>
          <SelectWord text="broken" f={f - 10} size={110} />
        </div>
      </C>
    ),
  },
  {
    id: 'blur09',
    dur: 90,
    render: (f) => (
      <C bg={<Sky f={f} />}>
        <BlurWords words={['Just', 'to', 'send', 'one', 'file']} f={f} preset={{base: 'light09'}} accentIdx={[3, 4]} size={110} />
      </C>
    ),
  },
  {
    id: 'bloom17',
    dur: 120,
    render: (f) => (
      <C color="#FFFFFD">
        <div style={{width: 1}}>
          <CaptionLine words={['Your', 'body', 'is', 'constantly'].map((w, i) => ({word: w, start: i * 0.08}))} t={f / 60} size={100} />
        </div>
      </C>
    ),
  },
  {
    id: 'split17',
    dur: 90,
    render: (f) => (
      <C color="#FFFFFD">
        <SplitMorph from={['const', 'antly']} to={['chan', 'ging.']} f={f} size={120} />
      </C>
    ),
  },
  {
    id: 'smear12',
    dur: 120,
    render: (f) => (
      <C bg={<LightBlobs f={f} base="#F4F5F9" />}>
        <SmearWords words={['At', 'your', 'convenience']} f={f} size={120} accentIdx={[2]} exitAt={90} />
      </C>
    ),
  },
  {
    id: 'words3d12',
    dur: 150,
    render: (f) => (
      <C bg={<LightBlobs f={f} base="#F4F5F9" />}>
        <div style={{width: 1}}>
          <Words3D words={["You've", 'all', 'been', 'asking', 'for', 'an', 'Online', 'Supermarket']} f={f} accentIdx={[6, 7]} />
        </div>
      </C>
    ),
  },
  {
    id: 'slot09',
    dur: 150,
    render: (f) => (
      <C bg={<Sky f={f} />}>
        <div style={{font: '600 110px Inter', letterSpacing: '-0.025em', color: '#111', display: 'flex', alignItems: 'flex-end', gap: 28}}>
          <span>Share</span>
          <SlotCycle words={['faster.', 'easier.', 'better.']} f={f} hold={[40, 40, 60]} colors={['#0791E9', '#0791E9', '#0791E9']} size={110} />
        </div>
      </C>
    ),
  },
  {
    id: 'slot03',
    dur: 200,
    render: (f) => (
      <C color="#5E86BE" bg={<AbsoluteFill style={{background: 'linear-gradient(#90B1DA, #DDE7F2 70%, #E9D9A8)'}} />}>
        <div style={{font: '500 96px Inter', color: '#fff', display: 'flex', alignItems: 'flex-end', gap: 24, letterSpacing: '-0.02em'}}>
          <span>One place to</span>
          <SlotCycle mode="blur" words={['Imagine', 'Build', 'Discover.']} f={f} hold={48} colors={['#3D63FF', '#3D63FF', '#3D63FF']} size={96} weight={500} />
        </div>
      </C>
    ),
  },
  {
    id: 'scramble02',
    dur: 80,
    render: (f) => (
      <C color="#F9F6F1">
        <div style={{font: '600 110px Inter', color: '#2F2B2C', letterSpacing: '-0.02em'}}>
          What will you <Scramble text="build?" f={f - 10} from="" size={110} color="#2F2B2C" scrambleColor="#D83418" />
        </div>
      </C>
    ),
  },
  {
    id: 'decode08',
    dur: 80,
    render: (f) => (
      <C>
        <Scramble text="life" from="to" f={f - 10} perChar={3} preRoll={10} glyphs="abcdefghijklmnopqrstuvwxyz" scrambleColor="#111" finalColor="#F04124" size={110} weight={700} />
      </C>
    ),
  },
  {
    id: 'type08',
    dur: 90,
    render: (f) => (
      <C>
        <LetterType text="Let's bring your ideas" f={f} trackingFrom={0.1} size={100} weight={700} />
      </C>
    ),
  },
  {
    id: 'bracket14',
    dur: 80,
    render: (f) => (
      <C color="#F3F3F3">
        <BracketWords
          words={[
            {text: 'Your', at: 16},
            {text: 'product', at: 34, color: '#F06C0C'},
          ]}
          f={f}
          size={110}
          weight={500}
          color="#151515"
        />
      </C>
    ),
  },
  {
    id: 'bracket03',
    dur: 120,
    render: (f) => (
      <C color="#020305">
        <BracketWords
          words={[
            {text: 'too many', at: 6, color: '#3D63FF'},
            {text: f < 60 ? 'signals' : 'tabs', at: 14},
          ]}
          open={['<', '>']}
          f={f}
          guides
          size={90}
          color="#fff"
          bracketColor="rgba(255,255,255,.6)"
        />
      </C>
    ),
  },
  {
    id: 'bracket16',
    dur: 90,
    render: (f) => (
      <C bg={<DarkGlow base="#000" glow="#0c4a10" x={50} y={50} size={70} strength={0.7} />}>
        <BracketWords
          words={[
            {text: 'Ever', at: 6},
            {text: 'find', at: 22},
            {text: 'an', at: 36},
          ]}
          cycle={[['^', ''], ['/', '/'], ['<', '>'], ['{', '}']]}
          open={['{', '}']}
          lockAt={44}
          f={f}
          size={80}
          weight={500}
          color="#fff"
          bracketColor="#3DDC57"
        />
      </C>
    ),
  },
  {
    id: 'viewfinder15',
    dur: 80,
    render: (f) => (
      <C bg={<DarkGlow base="#0D0D0D" glow="#6B4BFF" x={50} y={110} size={120} strength={0.55} />}>
        <div style={{position: 'relative'}}>
          <Viewfinder f={f} w={520} h={170} />
          <div style={{position: 'absolute', left: -230, top: -55}}>
            <LetterType text="Lets say" f={f - 18} size={90} weight={500} color="#fff" />
          </div>
        </div>
      </C>
    ),
  },
  {
    id: 'inline16',
    dur: 160,
    render: (f) => (
      <C bg={<DarkGlow base="#000" glow="#0c3a10" x={50} y={50} size={80} strength={0.6} />}>
        <InlineCard
          left="How the hell"
          right="did they"
          f={f}
          size={84}
          cards={[<Card key="a" c="#6B4BFF" label="Pika" />, <Card key="b" c="#3DDC57" label="EarnEdits" />, <Card key="c" c="#2B57F8" label="Teams" />]}
        />
      </C>
    ),
  },
  {
    id: 'wave07',
    dur: 100,
    render: (f) => (
      <C bg={<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #F8F7F7 0%, #E2E1E1 55%, #C6C6C6 100%)'}} />}>
        <WaveText text="Need some ideas?" f={f} exitAt={70} />
      </C>
    ),
  },
  {
    id: 'typebox02',
    dur: 200,
    render: (f) => (
      <C color="#020204">
        <div style={{transform: 'scale(1.6)'}}>
          <TypeBox
            text="Build an expense traking app"
            f={f - 10}
            width={900}
            size={64}
            bg="#141418"
            border="1px solid #2A2A33"
            color="#fff"
            radius={40}
            underglow="#6E5BFF"
            follow={{anchor: 0.6}}
            right={<div style={{width: 84, height: 84, borderRadius: 42, background: '#fff'}} />}
          />
        </div>
      </C>
    ),
  },
  {
    id: 'typebox18',
    dur: 260,
    render: (f) => (
      <C color="#F2EBF3">
        <TypeBox text="Hey Nova, can you make some photos for my new linen jacket?" f={f} placeholder="Tell Nova what you need..." width={1400} size={46} bg="#F7F5F8" radius={36} growIn={20} follow={{anchor: 0.7}} right={<div style={{width: 64, height: 64, borderRadius: 32, background: '#22D3EE'}} />} />
        <div style={{position: 'absolute', top: 700}}>
          <ShimmerText text="Writing..." f={f} size={44} base="#B48BD8" />
        </div>
      </C>
    ),
  },
  {
    id: 'caret11',
    dur: 120,
    render: (f) => (
      <C color="#000">
        <div style={{perspective: 1200}}>
          <div style={{transform: `rotateY(${Math.min(25, f * 0.3)}deg)`}}>
            <TypeBox text="hold attention for longer" f={f} width={1300} size={90} weight={700} bg="transparent" border="none" shadow="none" color="#fff" caretColor="#19D3FF" caretGlow cps={18} follow={{anchor: 0.75}} />
          </div>
        </div>
      </C>
    ),
  },
  {
    id: 'url02',
    dur: 140,
    render: (f) => (
      <C bg={<AbsoluteFill style={{background: 'linear-gradient(160deg,#F4F0FE,#E2D2FA)'}} />}>
        <UrlPill from="So why keep struggling?" url="onepoint.com" f={f} size={72} />
      </C>
    ),
  },
  {
    id: 'flip11',
    dur: 120,
    render: (f) => {
      const th = flipAt(f, [
        {at: 0, dark: false},
        {at: 40, dark: true},
        {at: 80, dark: false},
      ]);
      const word = f < 40 ? 'how much' : f < 80 ? 'would' : 'save';
      const start = f < 40 ? 0 : f < 80 ? 40 : 80;
      return (
        <C color={th.bg}>
          <FlipWord text={word} f={f - start} color={word === 'save' ? '#3054F0' : th.fg} bloom={word === 'would' ? '#8C9CFF' : undefined} />
        </C>
      );
    },
  },
  {
    id: 'intro02',
    dur: 120,
    render: (f) => (
      <C color="#0B0B12">
        <LetterType text="Introducing" f={f} perChar={4} dur={10} sweep={['#3B6BFF', '#8E83E8']} sweepDur={24} color="#FFFFFF" size={110} weight={600} grow={{from: 1.7, at: 60, dur: 30}} />
      </C>
    ),
  },
  {
    id: 'grad02',
    dur: 90,
    render: (f) => (
      <C bg={<AbsoluteFill style={{background: 'linear-gradient(160deg,#F4F0FE,#E2D2FA)'}} />}>
        <LetterType text="Need to follow up with someone?" f={f} perChar={2} dur={14} trackingFrom={0.08} tracking={0.01} gradient={['#E79BC0', '#B68BE8']} size={80} weight={600} blur={10} />
      </C>
    ),
  },
  {
    id: 'tags15',
    dur: 200,
    render: (f) => (
      <C bg={<DarkGlow base="#0D0D0D" glow="#6B4BFF" x={50} y={115} size={120} strength={0.5} />}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'flex-start'}}>
          {['Finding leads', 'Monitoring competitors', 'Planning trips'].map((t, i) => (
            <TagBox key={t} text={t} f={f - i * 40} kind={f > 160 ? 'good' : 'bad'} size={48} />
          ))}
        </div>
      </C>
    ),
  },
  {
    id: 'serif14',
    dur: 60,
    render: (f) => (
      <C color="#F3F3F3">
        <MixLine segs={[{text: 'can be'}, {text: 'everywhere', accent: 'serif'}]} f={f} size={110} />
      </C>
    ),
  },
  {
    id: 'script13',
    dur: 60,
    render: (f) => (
      <C color="#E9F1FE">
        <div style={{display: 'flex', alignItems: 'baseline', gap: 30, font: '800 120px Inter', color: '#0A1A40', letterSpacing: '-0.03em'}}>
          <span>Start</span>
          <ScriptWriteOn text="Now!" f={f - 6} size={190} />
        </div>
      </C>
    ),
  },
  {
    id: 'extrude13',
    dur: 60,
    render: (f) => (
      <C color="#E9F1FE">
        <div style={{width: 1300, textAlign: 'center'}}>
          <ExtrudedTitle words={['Take', 'Your', 'Content', 'To', 'The', 'Next', 'Level']} f={f} size={130} />
        </div>
      </C>
    ),
  },
  {
    id: 'arc15',
    dur: 80,
    render: (f) => (
      <C bg={<DarkGlow base="#0D0D0D" glow="#6B4BFF" x={50} y={-10} size={110} strength={0.5} />}>
        <ArcLetters text="Handled everyday" f={f} size={110} />
        <div style={{position: 'absolute', top: 620}}>
          <LightStreak f={f - 10} width={1000} />
        </div>
      </C>
    ),
  },
  {
    id: 'highlight16',
    dur: 70,
    render: (f) => (
      <C bg={<DarkGlow base="#000" glow="#0c3a10" x={50} y={50} size={80} strength={0.6} />}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, font: '500 84px Inter', color: '#fff'}}>
          <span>Introducing</span>
          <HighlightType text="EarnEdits" f={f} size={84} />
        </div>
      </C>
    ),
  },
];

export const TextGallery: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame();
  const ok = useTextFonts();
  if (!ok) return null;
  const p = PANELS.find((x) => x.id === id) ?? PANELS[0];
  return <>{p.render(f)}</>;
};

