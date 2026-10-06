import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Gradient, useT } from "./ui";
import { S } from "./cues";
import * as Sc from "./Scenes";
import { setLang } from "./i18n";

const on = (t: number, r: readonly [number, number], pad = 0.5) => t >= r[0] - pad && t <= r[1] + pad;

export const Ad: React.FC<{ withAudio?: boolean; lang?: "en" | "zh" }> = ({ withAudio, lang = "en" }) => {
  setLang(lang);
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#EEF3F6" }}>
      <Gradient />
      {on(t, S.hook) && <Sc.Hook />}
      {on(t, S.logo) && <Sc.LogoScene />}
      {on(t, S.range) && <Sc.Range />}
      {on(t, S.material) && <Sc.Materials />}
      {on(t, S.finish) && <Sc.Finishes />}
      {on(t, S.standards) && <Sc.Standards />}
      {on(t, S.chapter) && <Sc.Chapter />}
      {on(t, S.step1) && <Sc.Step1 />}
      {on(t, S.step2) && <Sc.Step2 />}
      {on(t, S.step3) && <Sc.Step3 />}
      {on(t, S.scale) && <Sc.Scale />}
      {on(t, S.end) && <Sc.End />}
      {t >= S.card[0] && <Sc.Samteck />}
      {withAudio && <Audio src={staticFile("mix.wav")} />}
    </AbsoluteFill>
  );
};
