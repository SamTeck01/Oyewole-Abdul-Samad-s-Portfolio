import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {CUES, L, FPS, SceneT, LangCtx, Lang, K, setCues, cuesFor} from './kit';
import * as S from './scenes';

const END_CARD = 2.4;
export const filmSeconds = (lang: Lang) => cuesFor(lang).total + END_CARD;

// scene boundaries in absolute seconds, all derived from the VO cues
const cuts = () => {
  const s = (id: string, d = 0.4) => L(id).start - d;
  const list: {from: number; C: React.FC<any>; props?: any}[] = [
    {from: 0, C: S.S01},
    {from: s('l02', 0.5), C: S.S02},
    {from: s('l03', 0.25), C: S.S03},
    {from: s('l04', 0.15), C: S.S04},
    {from: s('l05', 0.2), C: S.S05},
    {from: L('l05').end + 1.8, C: S.S06, props: {t0: L('l05').end + 1.8, t1: s('l06', 0.3)}},
    {from: s('l06', 0.3), C: S.S07},
    {from: s('l08'), C: S.S08},
    {from: s('l10', 0.3), C: S.S09},
    {from: s('l12', 0.3), C: S.S11},
    {from: s('l13'), C: S.S12},
    {from: s('l14'), C: S.S13},
    {from: s('l16'), C: S.S14},
    {from: s('l17'), C: S.S15},
    {from: s('l18'), C: S.S16},
    {from: s('l19'), C: S.S17},
    {from: s('l20'), C: S.S18},
    {from: s('l22t'), C: S.S18T},
    {from: s('l23'), C: S.S19},
    {from: s('l25'), C: S.S20},
    {from: s('l26', 0.3), C: S.S21},
    {from: s('l27', 0.3), C: S.S22},
    {from: s('l27m', 0.3), C: S.S22M},
    {from: s('l28'), C: S.S23},
    {from: s('l30', 0.6), C: S.S24},
    {from: CUES.total, C: S.EndCard, props: {t0: CUES.total}},
  ];
  return list.map((x, i) => ({...x, to: i + 1 < list.length ? list[i + 1].from : CUES.total + END_CARD}));
};


// camera energy on every scene (client: "much more dynamic"): whip in with blur, slow push-in, blur out,
// and a blue wipe panel sweeping across each cut. Direction alternates scene to scene.
const BPM = 124;
const SceneFx: React.FC<{i: number; f0: number; children: React.ReactNode}> = ({i, f0, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const dir = i % 2 ? -1 : 1;
  const e = Easing.bezier(0.16, 1, 0.3, 1);
  const inP = interpolate(f, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
  const outP = interpolate(f, [d - 8, d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  // v6 (client: "god damn it dynamic"): constant camera drive, beat-synced punches and reframes
  const beatF = (60 / BPM) * FPS;
  const g = f0 + f;
  const ph = (g % beatF) / beatF;
  const beat = Math.floor(g / beatF);
  const punch = 1;  // no per-beat punch (read as shaking)
  // smooth, eased camera glide across the scene instead of jump reframes
  const gl = interpolate(f, [0, d], [0, 1], {easing: Easing.inOut(Easing.sin)});
  const fr = [1, (i % 3 - 1) * 40 * gl, (i % 2 ? 1 : -1) * 18 * gl];
  const push = interpolate(f, [0, d], [1, 1.08], {easing: Easing.out(Easing.quad)});
  const scale = push * fr[0] * punch * (1.18 - 0.18 * inP) * (1 + 0.06 * outP);
  const x = fr[1] + (1 - inP) * 260 * dir - outP * 160 * dir + interpolate(f, [0, d], [-14, 14]) * dir;
  const y = fr[2];
  const rot = (1 - inP) * 2.5 * dir;
  const blur = (1 - inP) * 18 + outP * 14;
  const wipe = interpolate(f, [0, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>
      {i > 0 && wipe < 1 && <AbsoluteFill style={{background: K.blue, transform: `translateX(${dir * wipe * 900}%) skewX(${-12 * dir}deg)`, width: '14%', left: dir > 0 ? '-16%' : '102%'}} />}
    </AbsoluteFill>
  );
};

export const Film: React.FC<{lang: Lang}> = ({lang}) => {
  setCues(lang);
  return (
  <LangCtx.Provider value={lang}>
    <AbsoluteFill style={{background: K.bg}}>
      {cuts().map(({from, to, C, props}, i) => {
        const f0 = Math.round(from * FPS);
        const f1 = Math.round(to * FPS);
        return (
          <Sequence key={i} from={f0} durationInFrames={Math.max(1, f1 - f0)}>
            <SceneT.Provider value={f0 / FPS}>
              <SceneFx i={i} f0={f0}>
                <C {...(props ?? {})} />
              </SceneFx>
            </SceneT.Provider>
          </Sequence>
        );
      })}
      <Audio src={staticFile(`mix_${lang}.wav`)} />
    </AbsoluteFill>
  </LangCtx.Provider>
  );
};
