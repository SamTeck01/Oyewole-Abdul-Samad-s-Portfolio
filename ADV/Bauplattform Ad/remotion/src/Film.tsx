import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile} from 'remotion';
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
              <C {...(props ?? {})} />
            </SceneT.Provider>
          </Sequence>
        );
      })}
      <Audio src={staticFile(`mix_${lang}.wav`)} />
    </AbsoluteFill>
  </LangCtx.Provider>
  );
};
