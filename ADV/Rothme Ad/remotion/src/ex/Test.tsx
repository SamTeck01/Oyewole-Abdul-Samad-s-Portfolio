import React from "react";
import { AbsoluteFill } from "remotion";
import { Maya, Hand } from "./Maya";
export const MayaTest: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg, #0B0D24 0%, #2B2E7A 45%, #8B8CF8 80%, #C9CCFF 100%)", flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 20 }}>
    <Maya mood="worried" width={460} />
    <Maya mood="neutral" width={460} blink={0} look={0.5} />
    <Maya mood="happy" width={460} headTilt={-4} />
    <div style={{ position: "absolute", right: 80, top: 60, transform: "rotate(-24deg)" }}><Hand width={240} /></div>
  </AbsoluteFill>
);
