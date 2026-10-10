import React from "react";
import { AbsoluteFill, Audio, staticFile, getStaticFiles } from "remotion";
import { Bg, StormMB, Everywhere, Working, Meet, Connect, Dash, Health, Bars, Audit, Cheat, CUA, Logo, Samteck } from "./Scenes";

export const Ad: React.FC<{ audio: boolean }> = ({ audio }) => {
  const hasMix = audio && getStaticFiles().some((f) => f.name === "mix.wav");
  return (
    <AbsoluteFill style={{ background: "#070818", overflow: "hidden" }}>
      <Bg />
      <StormMB />
      <Everywhere />
      <Working />
      <Meet />
      <Connect />
      <Dash />
      <Health />
      <Bars />
      <Audit />
      <Cheat />
      <CUA />
      <Logo />
      <Samteck />
      {hasMix && <Audio src={staticFile("mix.wav")} />}
    </AbsoluteFill>
  );
};
