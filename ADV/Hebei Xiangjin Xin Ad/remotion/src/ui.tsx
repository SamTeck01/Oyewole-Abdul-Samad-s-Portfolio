import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FPS } from "./cues";
import { toDesign } from "./warp";

export const C = {
  royal: "#1E4F96",
  blue: "#2F7FD0",
  sky: "#5BAEE8",
  mint: "#BFE6D6",
  ink: "#16304F",
  grey: "#6B7C8F",
  studio: "#EEF3F6",
  card: "#FFFFFF",
};

export const useT = () => toDesign(useCurrentFrame() / FPS);
export const useV = () => {
  const { width, height } = useVideoConfig();
  return { V: height > width, W: width, H: height, s: Math.min(width, height) / 1080 };
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
/** 0→1 eased progress starting at t0 over dur seconds */
export const prog = (t: number, t0: number, dur = 0.6) =>
  interpolate(t, [t0, t0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const pop = (frame: number, t0: number, fps = FPS) =>
  spring({ frame: frame - t0 * fps, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });

export const Gradient: React.FC<{ drift?: boolean }> = () => {
  const t = useT();
  const a = Math.sin(t * 0.25) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${135 + a}deg, ${C.sky} 0%, ${C.blue} 45%, #4FA9D6 72%, ${C.mint} 100%)` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${30 + Math.sin(t * 0.3) * 10}% ${30 + Math.cos(t * 0.25) * 10}%, rgba(255,255,255,0.28), transparent 55%)` }} />
      <Dots />
    </div>
  );
};

export const Studio: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, #FFFFFF 0%, ${C.studio} 70%, #E3EBF0 100%)` }} />
);

const Dots: React.FC = () => {
  const t = useT();
  const pts = Array.from({ length: 28 }, (_, i) => ({ x: (i * 137.5) % 100, y: (i * 61.8) % 100, r: 2 + (i % 3) }));
  return (
    <>
      {pts.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${(p.y + t * (0.4 + (i % 4) * 0.15)) % 100}%`, width: p.r, height: p.r, borderRadius: 9, background: "rgba(255,255,255,0.55)" }} />
      ))}
    </>
  );
};

/** Turntable 3D render from Blender (24-frame loop) */
export const Model: React.FC<{ name: string; size: number; speed?: number; style?: React.CSSProperties; offset?: number }> = ({ name, size, speed = 1, style, offset = 0 }) => {
  const f = useCurrentFrame();
  const idx = (Math.floor((f * speed) / 8 + offset) % 24) + 1;
  return <Img src={staticFile(`m/${name}/f_${String(idx).padStart(4, "0")}.png`)} style={{ width: size, height: size, objectFit: "contain", ...style }} />;
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 10px 30px rgba(22,48,79,0.10), 0 1px 2px rgba(22,48,79,0.08)", padding: "18px 24px", fontFamily: "Inter", color: C.ink, ...style }}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties }> = ({ children, size = 28, color = C.ink, weight = 400, style }) => (
  <div style={{ fontFamily: "Inter", fontSize: size, color, fontWeight: weight, letterSpacing: "-0.01em", ...style }}>{children}</div>
);

export const Cursor: React.FC<{ x: number; y: number; click?: number }> = ({ x, y, click = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
    {click > 0 && click < 1 && (
      <div style={{ position: "absolute", left: -30 * click, top: -30 * click, width: 60 * click, height: 60 * click, borderRadius: 99, border: `3px solid ${C.sky}`, opacity: 1 - click }} />
    )}
    <svg width="34" height="40" viewBox="0 0 17 20" style={{ position: "absolute", left: -2, top: -2, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.25))" }}>
      <path d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z" fill="#1d2633" stroke="#fff" strokeWidth="1.2" />
    </svg>
  </div>
);

export const fadeIO = (t: number, a: number, b: number, d = 0.4) =>
  interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
