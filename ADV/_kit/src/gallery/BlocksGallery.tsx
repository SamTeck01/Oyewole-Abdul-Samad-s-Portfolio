// Self-check gallery for src/kit/blocks.tsx. One composition per block; `still` = the frame to inspect.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DarkGlow, LightBlobs} from '../kit/ui';
import * as B from '../kit/blocks';

type Entry = {id: string; still: number; dur?: number; bg: 'dark' | 'light' | 'violet' | 'space' | 'pastel'; render: (f: number) => React.ReactNode};

const Bg: React.FC<{k: Entry['bg']; f: number}> = ({k, f}) =>
  k === 'dark' ? (
    <DarkGlow glow="#8b7bd8" />
  ) : k === 'violet' ? (
    <DarkGlow base="#0D0D0D" glow="#5B3BFF" y={110} size={80} strength={0.45} />
  ) : k === 'space' ? (
    <AbsoluteFill style={{background: 'linear-gradient(0deg,#001884 0%,#000 55%)'}} />
  ) : k === 'pastel' ? (
    <LightBlobs f={f} base="#F2EBF3" colors={['#F6C9EE', '#E8D7F7', '#FFD9CF', '#EEDCF5']} />
  ) : (
    <LightBlobs f={f} />
  );

const Arrow: React.FC = () => (
  <svg width={46} height={60} viewBox="0 0 23 30" style={{filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))'}}>
    <path d="M2 2v22l6-5 4 9 4-2-4-9h8Z" fill="#111" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const logos = ['Acme', 'Globex', 'Umbra', 'Hooli', 'Initech', 'Vandelay', 'Stark'].map((t) => <B.Wordmark key={t} text={t} />);

export const ENTRIES: Entry[] = [
  {id: 'Glass', still: 30, bg: 'space', render: () => (
    <B.Center><div style={{display: 'flex', gap: 60}}>
      <B.GlassCard w={520} h={340} tint="#5B8CFF"><div style={{padding: 40, fontSize: 44, fontWeight: 600}}>Glass card<div style={{fontSize: 28, opacity: 0.7, marginTop: 10}}>backdrop blur + rim light</div></div></B.GlassCard>
      <B.ProfileCard f={60} name="Maya Lee" handle="@mayamakes" />
    </div></B.Center>)},
  {id: 'StatPills', still: 220, dur: 300, bg: 'dark', render: (f) => (
    <B.Center><B.StatPillsTotal f={f} start={10} items={[{icon: 'moon', value: 67, label: 'Sleep'}, {icon: 'hourglass', value: 43, label: 'Focus'}, {icon: 'cloud', value: 31, label: 'Rest'}]} total={{label: 'Score', value: 47, from: 6}} /></B.Center>)},
  {id: 'BarOverload', still: 50, dur: 120, bg: 'dark', render: (f) => <B.Center><B.BarOverload f={f} start={10} /></B.Center>},
  {id: 'BarFlash', still: 64, dur: 120, bg: 'dark', render: (f) => <B.Center><B.BarOverload f={f} start={10} /></B.Center>},
  {id: 'IconLock', still: 60, dur: 120, bg: 'dark', render: (f) => (
    <B.Center><div style={{display: 'flex', gap: 120, alignItems: 'center'}}>
      <B.IconLock f={f} lockAt={20} />
      <B.MorphCard f={f} start={20} from={{w: 160, h: 160, r: 36, color: '#E5243B'}} to={{w: 520, h: 340, r: 36, color: '#ffffff'}} icon={<span style={{fontSize: 80}}>⌚</span>}>
        <div style={{padding: 34, fontSize: 40, fontWeight: 600, color: '#111'}}>Heart rate<div style={{fontSize: 90, color: '#E5243B'}}>72</div></div>
      </B.MorphCard>
    </div></B.Center>)},
  {id: 'Chat', still: 260, dur: 360, bg: 'pastel', render: (f) => (
    <B.Center><div style={{width: 1100, display: 'flex', flexDirection: 'column', gap: 30}}>
      <B.ChatMessage f={f} role="user" text="Make 3 photos for my new linen jacket" start={0} />
      <B.ChatMessage f={f} role="bot" text="Ready! Here are 3 looks for your jacket." start={20} thinking="creating image" thinkFrames={60}>
        <B.ResultCards f={f} start={90} />
      </B.ChatMessage>
      <B.ChatInput f={f} text="Now write the caption. Make it sound like me" start={150} w={1100} sendAt={300} />
    </div></B.Center>)},
  {id: 'ChatWriting', still: 40, dur: 120, bg: 'pastel', render: (f) => (
    <B.Center><div style={{width: 1100}}><B.ChatMessage f={f} role="bot" text="I studied your last 30 posts." thinking="Writing…" thinkFrames={100} /></div></B.Center>)},
  {id: 'ShopSearch', still: 150, dur: 240, bg: 'light', render: (f) => (
    <B.Center><div style={{display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center'}}>
      <B.SearchBar f={f} text="Everything you want in one place.." left={<div style={{width: 70, height: 70, borderRadius: 20, background: '#0C549C'}} />} />
      <B.CategoryList f={f} start={40} items={['Beverages', 'Bakery', 'Dairy & Eggs', 'Snacks', 'Fruits & Vegetables', 'Meat & Poultry']} selected={5} selectAt={130} />
    </div></B.Center>)},
  {id: 'ShopCards', still: 170, dur: 240, bg: 'light', render: (f) => (
    <B.Center><B.ProductGrid f={f} products={[{name: 'Chicken Breast', price: '579 KES'}, {name: 'Capsicum', price: '399 KES'}, {name: 'Pringles', price: '460 KES'}, {name: 'Nescafé', price: '1,975 KES'}]} addedAt={[1e9, 1e9, 120, 1e9]} pressAt={160} /></B.Center>)},
  {id: 'IOS', still: 90, dur: 180, bg: 'light', render: (f) => (
    <B.Center><div style={{display: 'flex', gap: 70, alignItems: 'center', transform: 'scale(0.82)'}}>
      <B.IOSLockScreen w={440}>
        <B.IOSNotification f={f} start={10} app="Carrefour" title="Carrefour" body="Delivery in progress 🛵" />
        <B.IOSNotification f={f} start={24} app="Carrefour" title="Carrefour" body="Your order is on the way" time="1m ago" />
      </B.IOSLockScreen>
      <B.IOSPermissionSheet f={f} start={10} pressAt={70} />
      <div style={{background: '#202028', padding: 40, borderRadius: 50}}><B.IOSControlCentre f={f} airplaneAt={40} w={620} /></div>
    </div></B.Center>)},
  {id: 'Circuit', still: 140, dur: 240, bg: 'violet', render: (f) => (
    <B.Center><B.CircuitHub f={f} hub={<B.GlowTile size={170} glow="#7B5CFF" strength={1}>R</B.GlowTile>} nodes={[
      {x: 250, y: 180, content: <B.GlowTile>N</B.GlowTile>}, {x: 1350, y: 160, content: <B.GlowTile>S</B.GlowTile>},
      {x: 220, y: 740, content: <B.GlowTile>M</B.GlowTile>}, {x: 1380, y: 720, content: <B.GlowTile>G</B.GlowTile>}, {x: 800, y: 90, content: <B.GlowTile>L</B.GlowTile>}]} /></B.Center>)},
  {id: 'Strands', still: 90, dur: 180, bg: 'dark', render: (f) => (
    <B.Center><B.StrandFan f={f} items={['Docs', 'Design', 'Video', 'Social', 'Ads', 'Email', 'Web'].map((label) => ({label}))} /></B.Center>)},
  {id: 'Orbit', still: 120, dur: 200, bg: 'dark', render: (f) => (
    <B.Center scale={0.85}><B.OrbitRings f={f} center={<B.GlowTile size={150} glow="#2FD3D0" strength={1}>✦</B.GlowTile>} /></B.Center>)},
  {id: 'Burst', still: 80, dur: 160, bg: 'dark', render: (f) => <B.Center><B.RadialBurst f={f} /></B.Center>},
  {id: 'Ribbon', still: 90, dur: 200, bg: 'space', render: (f) => <AbsoluteFill><B.ThumbRibbon f={f} /></AbsoluteFill>},
  {id: 'Arch', still: 90, dur: 200, bg: 'space', render: (f) => <B.Center y={92}><B.ThumbArch f={f} /></B.Center>},
  {id: 'Domino', still: 90, dur: 200, bg: 'dark', render: (f) => <B.Center x={45}><B.DominoRow f={f} /></B.Center>},
  {id: 'Stack', still: 50, dur: 200, bg: 'dark', render: (f) => <B.Center><B.GlowStack f={f} /></B.Center>},
  {id: 'PhotoRing', still: 60, dur: 200, bg: 'light', render: (f) => <B.Center><B.PhotoRing f={f} center={<B.CrosshairBox>tells a story</B.CrosshairBox>} /></B.Center>},
  {id: 'Masonry', still: 80, dur: 200, bg: 'light', render: (f) => <B.Center y={60}><B.MasonryBuild f={f} /></B.Center>},
  {id: 'Carousel', still: 60, dur: 240, bg: 'dark', render: (f) => (
    <B.Center><B.LightBarCarousel f={f} tiles={['Sh', 'Li', 'Sl', 'X', 'Gm', 'Gh', 'Dr', 'Db'].map((label) => ({label}))} /></B.Center>)},
  {id: 'Iso', still: 120, dur: 200, bg: 'violet', render: (f) => (
    <B.Center y={55}><B.IsoBoard f={f} orbit={f * 0.05} tiles={[
      {gx: 2, gy: 2, color: '#2F6BFF', label: 'Deadline Watch', at: 20}, {gx: 6, gy: 3, color: '#14B8A6', label: 'Contract Reader', at: 40},
      {gx: 3, gy: 6, color: '#EAB308', label: 'Lead Finder', at: 60}, {gx: 6, gy: 7, color: '#2F6BFF', label: 'Newsletter', at: 75}]} links={[[0, 1], [2, 3]]} /></B.Center>)},
  {id: 'Buttons', still: 70, dur: 120, bg: 'light', render: (f) => (
    <B.Center><div style={{display: 'flex', flexDirection: 'column', gap: 70, alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 60}}>
        <B.PressButton3D f={f} label="Approve" />
        <B.PressButton3D f={f} label="Approve" pressAt={60} pressedLabel="Done" />
      </div>
      <div style={{display: 'flex', gap: 60}}>
        <B.TogglePill f={f} at={20} label="Airplane" color="#FF9F0A" />
        <B.TogglePill f={f} at={20} on={false} label="Wi-Fi" />
      </div>
      <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
        <span style={{fontSize: 90, fontWeight: 600}}>Make it <B.SelectHighlight f={f} start={20} color="#111">simple</B.SelectHighlight></span>
      </div>
    </div></B.Center>)},
  {id: 'Marquee', still: 70, dur: 160, bg: 'light', render: (f) => (
    <B.Center><div style={{display: 'flex', flexDirection: 'column', gap: 120, alignItems: 'center'}}>
      <B.ChipPyramid f={f} rows={[['AI Agents'], ['Deploy', 'Database'], ['Auth', 'Storage', 'Logs'], ['Secrets', 'Domains', 'Analytics', 'Tests']]} />
      <B.LogoMarquee f={f} logos={logos} />
    </div></B.Center>)},
  {id: 'FileDrop', still: 38, dur: 200, bg: 'light', render: (f) => <B.Center><B.FileDrop f={f} cursor={<Arrow />} /></B.Center>},
  {id: 'FileUpload', still: 110, dur: 200, bg: 'light', render: (f) => <B.Center><B.FileDrop f={f} cursor={<Arrow />} /></B.Center>},
  {id: 'Morph', still: 20, dur: 260, bg: 'light', render: (f) => <B.Center><B.MorphChain f={f} /></B.Center>},
  {id: 'Morph2', still: 100, dur: 260, bg: 'light', render: (f) => <B.Center><B.MorphChain f={f} /></B.Center>},
  {id: 'Morph3', still: 165, dur: 260, bg: 'light', render: (f) => <B.Center><B.MorphChain f={f} /></B.Center>},
  {id: 'Morph4', still: 240, dur: 260, bg: 'light', render: (f) => <B.Center><B.MorphChain f={f} /></B.Center>},
  {id: 'Tags', still: 150, dur: 200, bg: 'violet', render: (f) => (
    <B.Center><div style={{display: 'flex', gap: 80, alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
        <B.StatusTag f={f} start={0} text="Finding leads" />
        <B.StatusTag f={f} start={30} text="Monitoring competitors" ok />
      </div>
      <B.ApprovalCard f={f} start={0} approveAt={100} w={760} />
    </div></B.Center>)},
];

export const makeGalleryComp = (e: Entry): React.FC => {
  const C: React.FC = () => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: 'Inter, sans-serif'}}>
        <Bg k={e.bg} f={f} />
        {e.render(f)}
      </AbsoluteFill>
    );
  };
  return C;
};
