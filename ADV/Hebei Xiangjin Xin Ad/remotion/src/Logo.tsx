import React from "react";
import { C } from "./ui";

/** Vector redraw of the 河北向晋鑫 globe-X mark. p = build progress 0..1 */
export const LogoMark: React.FC<{ size: number; p?: number }> = ({ size, p = 1 }) => {
  const arc = Math.min(1, p / 0.45);
  const globe = Math.max(0, Math.min(1, (p - 0.25) / 0.35));
  const x = Math.max(0, Math.min(1, (p - 0.55) / 0.3));
  const L = 520;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FC6E0" />
          <stop offset="0.55" stopColor="#3E8BC4" />
          <stop offset="1" stopColor="#1E4F96" />
        </linearGradient>
        <linearGradient id="sw" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1E4F96" />
          <stop offset="1" stopColor="#5BAEE8" />
        </linearGradient>
      </defs>
      <g opacity={globe} transform={`translate(100 104) scale(${0.6 + 0.4 * globe}) translate(-100 -104)`}>
        <circle cx="100" cy="104" r="62" fill="url(#g)" />
        <path d="M58 70 Q100 52 142 70" stroke="rgba(255,255,255,.35)" strokeWidth="3" fill="none" />
      </g>
      <g opacity={x} transform={`translate(100 104) scale(${0.4 + 0.6 * x}) rotate(${(1 - x) * -40}) translate(-100 -104)`}>
        <path d="M70 66 L92 66 L134 142 L112 142 Z" fill="#fff" />
        <path d="M130 66 L152 66 L102 116 L90 104 Z" fill="#E8F3FB" />
        <path d="M84 120 L96 132 L80 142 L60 142 Z" fill="#E8F3FB" />
      </g>
      <path
        d="M40 150 C 10 100, 40 30, 110 26 C 150 24, 178 48, 182 80"
        stroke="url(#sw)" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray={L} strokeDashoffset={L * (1 - arc)}
      />
      <path d="M182 80 l-14 -6 l18 -16 l4 24 z" fill="#5BAEE8" opacity={arc > 0.95 ? 1 : 0} transform="translate(-4 4)" />
    </svg>
  );
};

export const LogoFull: React.FC<{ size: number; p?: number; dark?: boolean }> = ({ size, p = 1, dark = true }) => {
  const tp = Math.max(0, Math.min(1, (p - 0.75) / 0.25));
  const col = dark ? C.royal : "#fff";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <LogoMark size={size} p={p} />
      <div style={{ fontFamily: "Noto Sans SC", fontWeight: 700, fontSize: size * 0.3, color: col, letterSpacing: "0.08em", marginTop: -size * 0.02, opacity: tp, transform: `translateY(${(1 - tp) * 20}px)` }}>
        河北向晋鑫
      </div>
      <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: size * 0.11, color: col, letterSpacing: "0.32em", marginTop: size * 0.03, opacity: tp }}>
        HEBEI XIANGJIN XIN
      </div>
    </div>
  );
};
