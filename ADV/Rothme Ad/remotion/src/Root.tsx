import React from "react";
import { Composition } from "remotion";
import { Ad } from "./Ad";
import { TOTAL } from "./cues";

const FPS = 60;
export const Root: React.FC = () => (
  <>
    <Composition id="Rothme16x9" component={Ad} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Rothme9x16" component={Ad} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{ audio: true }} />
  </>
);
