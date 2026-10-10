import React from "react";

/* Maya: flat-vector character (no outlines, soft 2-tone shading), Rothme palette.
   Front view, upper body. viewBox 0 0 600 640. Head centre ≈ (300, 215). */
export const SK = { skin: "#C98B6B", skinShade: "#B07253", skinLight: "#D9A182", hair: "#251A2C", hairHi: "#3A2A44",
  top: "#6366F1", topShade: "#5054D6", collar: "#EEF0FF", lip: "#9E4F48", eye: "#1C1630", brow: "#251A2C", blush: "#E58C7A" };

export type Mood = "neutral" | "worried" | "happy" | "focused";

export const Maya: React.FC<{
  mood?: Mood; blink?: number; look?: number; headTilt?: number; nod?: number; breathe?: number;
  armL?: number; armR?: number; typing?: number; width?: number; style?: React.CSSProperties;
}> = ({ mood = "neutral", blink = 0, look = 0, headTilt = 0, nod = 0, breathe = 0, armL = 0, armR = 0, typing = 0, width = 600, style }) => {
  const eyeH = 13 * (1 - 0.92 * blink);
  const lx = look * 6;
  const brows = {
    neutral: [[-8, -2], [8, -2]], focused: [[-4, 2], [4, 2]], happy: [[-10, -6], [10, -6]], worried: [[10, -2], [-10, -2]],
  }[mood];
  const mouth = {
    neutral: "M280 276 Q300 288 320 276",
    focused: "M286 280 L314 280",
    happy: "M272 268 Q300 306 328 268 Q300 278 272 268 Z",
    worried: "M282 286 Q300 270 318 286",
  }[mood];
  const sh = breathe * 3;
  return (
    <svg viewBox="0 0 600 640" width={width} height={(width * 640) / 600} style={{ overflow: "visible", ...style }}>
      {/* back hair: shoulder-length, soft wave ends */}
      <g transform={`rotate(${headTilt} 300 300) translate(0 ${nod * 6})`}>
        <path d="M196 214 C186 128 240 92 300 92 C362 92 414 128 404 214 C402 268 420 318 432 352 C414 372 384 376 364 366 L236 366 C216 376 186 372 168 352 C180 318 198 268 196 214 Z" fill={SK.hair} />
      </g>
      {/* body */}
      <g transform={`translate(0 ${sh})`}>
        <path d="M96 640 C100 500 150 424 236 404 L364 404 C450 424 500 500 504 640 Z" fill={SK.top} />
        <path d="M96 640 C100 530 130 456 196 418 C170 480 162 560 168 640 Z" fill={SK.topShade} />
        <path d="M504 640 C500 530 470 456 404 418 C430 480 438 560 432 640 Z" fill={SK.topShade} opacity=".75" />
        <path d="M270 330 L330 330 L336 410 C318 426 282 426 264 410 Z" fill={SK.skin} />
        <path d="M268 322 L332 322 L334 368 C312 382 288 382 266 368 Z" fill={SK.skinShade} />
        <path d="M240 402 Q300 452 360 402 L374 410 Q300 476 226 410 Z" fill={SK.collar} />
        <g transform={`rotate(${armL} 160 470)`}><path d="M150 450 C120 500 112 570 118 640 L176 640 C174 580 182 520 200 480 Z" fill={SK.topShade} /></g>
        <g transform={`rotate(${armR} 440 470)`}><path d="M450 450 C480 500 488 570 482 640 L424 640 C426 580 418 520 400 480 Z" fill={SK.topShade} opacity=".9" /></g>
      </g>
      {/* head */}
      <g transform={`rotate(${headTilt} 300 300) translate(0 ${nod * 6})`}>
        <path d="M300 342 C238 342 200 292 200 222 C200 152 246 112 300 112 C354 112 400 152 400 222 C400 292 362 342 300 342 Z" fill={SK.skin} />
        <path d="M352 132 C384 154 400 188 400 222 C400 292 362 342 300 342 C344 318 368 280 370 226 C372 190 364 156 352 132 Z" fill={SK.skinShade} opacity=".35" />
        <ellipse cx="202" cy="236" rx="13" ry="20" fill={SK.skinShade} />
        <ellipse cx="398" cy="236" rx="13" ry="20" fill={SK.skinShade} />
        <circle cx="200" cy="264" r="7" fill="#F5C76B" />
        <circle cx="400" cy="264" r="7" fill="#F5C76B" />
        {/* bun + hair cap + curtain bangs */}
        <circle cx="300" cy="80" r="44" fill={SK.hair} />
        <path d="M268 64 Q300 46 332 64" stroke={SK.hairHi} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M198 212 C194 140 242 104 300 104 C358 104 406 140 402 212 C394 176 370 146 330 132 L300 124 L270 132 C230 146 206 176 198 212 Z" fill={SK.hair} />
        <path d="M300 120 C270 122 230 136 210 196 C232 166 262 150 302 138 Z" fill={SK.hair} />
        <path d="M300 120 C330 122 370 136 390 196 C368 166 338 150 298 138 Z" fill={SK.hair} />
        <path d="M236 132 C258 120 280 116 298 116" stroke={SK.hairHi} strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* brows */}
        <g fill={SK.brow}>
          <rect x="236" y={184 + brows[0][1]} width="42" height="9" rx="4.5" transform={`rotate(${brows[0][0]} 257 188)`} />
          <rect x="322" y={184 + brows[1][1]} width="42" height="9" rx="4.5" transform={`rotate(${brows[1][0]} 343 188)`} />
        </g>
        {/* eyes */}
        <g fill={SK.eye}>
          <ellipse cx={258 + lx} cy="222" rx="12" ry={eyeH * 1.15} />
          <ellipse cx={342 + lx} cy="222" rx="12" ry={eyeH * 1.15} />
        </g>
        <path d="M244 210 q-6 -4 -10 -10 M356 210 q6 -4 10 -10" stroke={SK.eye} strokeWidth="4" strokeLinecap="round" opacity={1 - blink} />
        {blink < 0.5 && <g fill="#fff"><circle cx={262 + lx} cy="216" r="3.6" /><circle cx={346 + lx} cy="216" r="3.6" /></g>}
        <ellipse cx="240" cy="258" rx="20" ry="11" fill={SK.blush} opacity={mood === "happy" ? 0.5 : 0.28} />
        <ellipse cx="360" cy="258" rx="20" ry="11" fill={SK.blush} opacity={mood === "happy" ? 0.5 : 0.28} />
        <path d="M302 228 Q292 252 304 254" stroke={SK.skinShade} strokeWidth="6" fill="none" strokeLinecap="round" />
        {mood === "happy" ? <path d={mouth} fill={SK.lip} /> : <path d={mouth} stroke={SK.lip} strokeWidth="7" fill="none" strokeLinecap="round" />}
        {mood === "happy" && <path d="M284 272 Q300 280 316 272 L314 268 Q300 274 286 268 Z" fill="#fff" opacity=".9" />}
        {mood === "worried" && <path d="M384 156 q9 15 0 24 q-9 -9 0 -24z" fill="#9FC8FF" />}
      </g>
    </svg>
  );
};

/* Big pointing hand (reference-style), from bottom-right. viewBox 0 0 300 420, fingertip ≈ (112, 14). */
export const Hand: React.FC<{ width?: number; press?: number; style?: React.CSSProperties }> = ({ width = 300, press = 0, style }) => (
  <svg viewBox="0 0 300 420" width={width} height={(width * 420) / 300} style={{ overflow: "visible", ...style }}>
    <g transform={`translate(0 ${press * 10})`}>
      <rect x="104" y="300" width="150" height="160" rx="10" fill={SK.top} />
      <rect x="98" y="282" width="162" height="34" rx="10" fill={SK.collar} />
      <rect x="96" y="150" width="150" height="148" rx="46" fill={SK.skin} />
      <rect x="92" y="0" width="42" height="200" rx="21" fill={SK.skin} />
      <rect x="100" y="12" width="12" height="60" rx="6" fill={SK.skinLight} opacity=".7" />
      <rect x="134" y="140" width="38" height="78" rx="19" fill={SK.skin} />
      <rect x="168" y="146" width="38" height="76" rx="19" fill={SK.skin} />
      <rect x="202" y="156" width="36" height="72" rx="18" fill={SK.skin} />
      <path d="M170 160 L170 206 M204 168 L204 214" stroke={SK.skinShade} strokeWidth="4" strokeLinecap="round" />
      <rect x="60" y="196" width="40" height="96" rx="20" fill={SK.skinShade} transform="rotate(-38 80 244)" />
      <path d="M118 296 L240 296" stroke={SK.skinShade} strokeWidth="6" opacity=".5" />
    </g>
  </svg>
);
