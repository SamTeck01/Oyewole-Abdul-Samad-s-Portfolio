import React from "react";
import { Composition } from "remotion";
import { Ad } from "./Ad";
import { Banner } from "./Banner";
import { FPS, TOTAL } from "./cues";
import { toReal } from "./warp";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/noto-sans-sc/300.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";

const D = Math.round(toReal(TOTAL, "en") * FPS);
const DZ = Math.round(toReal(TOTAL, "zh") * FPS);
export const Root: React.FC = () => (
  <>
    <Composition id="Ad16x9" component={Ad} durationInFrames={D} fps={FPS} width={1920} height={1080} />
    <Composition id="Ad9x16" component={Ad} durationInFrames={D} fps={FPS} width={1080} height={1920} />
    <Composition id="Ad16x9ZH" component={Ad} durationInFrames={DZ} fps={FPS} width={1920} height={1080} defaultProps={{ lang: "zh" }} />
    <Composition id="Ad9x16ZH" component={Ad} durationInFrames={DZ} fps={FPS} width={1080} height={1920} defaultProps={{ lang: "zh" }} />
    <Composition id="LinkedInBanner" component={Banner} durationInFrames={1} fps={FPS} width={1584} height={396} />
  </>
);
