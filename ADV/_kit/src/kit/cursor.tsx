/**
 * MacCursor.tsx - macOS-style cursors for Remotion 4 (own vector drawings, 32-unit grid).
 *
 *   <MacCursor x={400} y={300} type="pointer" pressed={false} />
 *   <MacCursor x={x} y={y} type="arrow" pressed pressedAt={45} />   // springs to 0.9 from frame 45
 *
 *   // smooth eased path + clicks + ripple:
 *   <CursorPath waypoints={[
 *     { frame: 0,  x: 200, y: 600 },
 *     { frame: 40, x: 960, y: 520, click: true, type: "pointer" },
 *     { frame: 90, x: 1300, y: 300 },
 *   ]} />
 *
 * x/y is the cursor HOTSPOT (tip of arrow, fingertip, I-beam centre) in px.
 * size = rendered px of the 32-unit box (default 64 = 2x macOS size at 1080p-ish).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

export type CursorType = "arrow" | "pointer" | "ibeam" | "openhand" | "closedhand";

export const HOTSPOTS: Record<CursorType, { x: number; y: number }> = {"arrow": {"x": 0.3125, "y": 0.203125}, "pointer": {"x": 0.40625, "y": 0.1125}, "openhand": {"x": 0.5, "y": 0.46875}, "closedhand": {"x": 0.46875, "y": 0.5}, "ibeam": {"x": 0.5, "y": 0.5}};

const SHAPES: Record<CursorType, React.ReactNode> = {
  arrow: (
    <><path d="M10 6.5 V23.6 L14 19.9 L16.6 26 L19.4 24.8 L16.9 18.9 H22.2 Z" fill="#000" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke"/></>
  ),
  pointer: (
    <><path fill="#fff" stroke="#000" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" d="M11.5 5 a1.5 1.5 0 0 1 3 0 V12.6 a1.5 1.5 0 0 1 3 0 V13.2 a1.4 1.4 0 0 1 2.8 0 V14.2 a1.3 1.3 0 0 1 2.6 0 V20 c0 3.6 -2.2 6 -5.2 6 H14.6 c-2 0 -3 -1 -4 -2.5 L6.8 18.4 a1.45 1.45 0 0 1 2.1 -2 L11.5 18.6 Z"/><path fill="none" stroke="#000" strokeWidth="0.9" strokeLinecap="round" d="M14.5 12.8 V16 M17.5 13.2 V16 M20.3 14.2 V16.5"/></>
  ),
  ibeam: (
    <><g fill="none" strokeLinecap="round"><path d="M13 6.5 c1.7 0 3 .5 3 2 c0 -1.5 1.3 -2 3 -2 M16 8.5 V23.5 M13 25.5 c1.7 0 3 -.5 3 -2 c0 1.5 1.3 2 3 2" stroke="#fff" strokeWidth="3.2"/><path d="M13 6.5 c1.7 0 3 .5 3 2 c0 -1.5 1.3 -2 3 -2 M16 8.5 V23.5 M13 25.5 c1.7 0 3 -.5 3 -2 c0 1.5 1.3 2 3 2" stroke="#000" strokeWidth="1.2"/></g></>
  ),
  openhand: (
    <><path fill="#fff" stroke="#000" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" d="M10.2 15 V8.8 a1.3 1.3 0 0 1 2.6 0 V13.6 H13.2 V6.8 a1.3 1.3 0 0 1 2.6 0 V13.6 H16.2 V7.8 a1.3 1.3 0 0 1 2.6 0 V14 H19.2 V10.2 a1.2 1.2 0 0 1 2.4 0 V19 c0 4 -2.3 6.5 -5.5 6.5 H14.5 c-2 0 -3.2 -1 -4.2 -2.4 L6.2 17.6 a1.4 1.4 0 0 1 2.1 -1.9 L10.2 17.6 Z"/></>
  ),
  closedhand: (
    <><path fill="#fff" stroke="#000" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" d="M9.5 15.5 V13.4 a1.5 1.5 0 0 1 3 0 a1.5 1.5 0 0 1 3 -0.2 a1.5 1.5 0 0 1 3 0.2 a1.4 1.4 0 0 1 2.8 0.6 V19.5 c0 3.8 -2.3 6 -5.5 6 H14.5 c-2 0 -3.2 -1 -4.2 -2.4 L7.4 18.8 a1.4 1.4 0 0 1 2.1 -1.9 Z"/><path fill="none" stroke="#000" strokeWidth="0.9" strokeLinecap="round" d="M12.5 13.4 V15.6 M15.5 13.2 V15.6 M18.5 13.4 V15.8"/></>
  )
};

export type MacCursorProps = {
  x: number;
  y: number;
  type?: CursorType;
  pressed?: boolean;
  /** frame the press started; enables the quick spring in/out */
  pressedAt?: number;
  /** frame the press was released (spring back to 1) */
  releasedAt?: number;
  shadow?: boolean;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

export const MacCursor: React.FC<MacCursorProps> = ({
  x, y, type = "arrow", pressed = false, pressedAt, releasedAt, shadow = true, size = 64, opacity = 1, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = { damping: 18, stiffness: 420, mass: 0.5 };
  let scale = pressed ? 0.9 : 1;
  if (pressedAt !== undefined) {
    const down = spring({ frame: frame - pressedAt, fps, config: cfg });
    const up = releasedAt !== undefined ? spring({ frame: frame - releasedAt, fps, config: cfg }) : 0;
    scale = 1 - 0.1 * down + 0.1 * up;
  }
  const hs = HOTSPOTS[type];
  const id = React.useId().replace(/:/g, "");
  return (
    <svg
      width={size} height={size} viewBox="0 0 32 32"
      style={{
        position: "absolute", left: x - hs.x * size, top: y - hs.y * size, overflow: "visible",
        transform: `scale(${scale})`, transformOrigin: `${hs.x * 100}% ${hs.y * 100}%`,
        opacity, pointerEvents: "none", ...style,
      }}
    >
      <defs>
        <filter id={`s${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0.8" stdDeviation="0.9" floodColor="#000" floodOpacity="0.38" />
        </filter>
      </defs>
      <g filter={shadow ? `url(#s${id})` : undefined}>{SHAPES[type]}</g>
    </svg>
  );
};

/* ------------------------------------------------------------------ click ripple */
export const ClickRipple: React.FC<{ x: number; y: number; at: number; color?: string; radius?: number; duration?: number }> = ({
  x, y, at, color = "rgba(255,255,255,0.9)", radius = 34, duration = 18,
}) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / duration;
  if (t < 0 || t > 1) return null;
  const e = Easing.out(Easing.cubic)(t);
  const r = interpolate(e, [0, 1], [radius * 0.2, radius]);
  return (
    <div style={{
      position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
      border: `2px solid ${color}`, background: color.replace(/[\d.]+\)$/, "0.12)"),
      opacity: 1 - t, pointerEvents: "none",
    }} />
  );
};

/* ------------------------------------------------------------------ smooth path */
export type Waypoint = { frame: number; x: number; y: number; click?: boolean; type?: CursorType };

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

/** Position on a Catmull-Rom spline through the waypoints with eased timing per segment. */
export const cursorPosition = (
  waypoints: Waypoint[], frame: number, ease: (t: number) => number = Easing.bezier(0.45, 0, 0.2, 1),
) => {
  const w = waypoints;
  if (frame <= w[0].frame) return { x: w[0].x, y: w[0].y, index: 0 };
  const last = w[w.length - 1];
  if (frame >= last.frame) return { x: last.x, y: last.y, index: w.length - 1 };
  let i = 0;
  while (frame > w[i + 1].frame) i++;
  const t = ease((frame - w[i].frame) / (w[i + 1].frame - w[i].frame));
  const p0 = w[Math.max(i - 1, 0)], p1 = w[i], p2 = w[i + 1], p3 = w[Math.min(i + 2, w.length - 1)];
  return { x: catmull(p0.x, p1.x, p2.x, p3.x, t), y: catmull(p0.y, p1.y, p2.y, p3.y, t), index: i };
};

export const useCursorPath = (waypoints: Waypoint[], ease?: (t: number) => number) =>
  cursorPosition(waypoints, useCurrentFrame(), ease);

/** Cursor that travels the waypoints; clicks (press 6 frames, ripple) on waypoints with click:true. */
export const CursorPath: React.FC<{ waypoints: Waypoint[]; type?: CursorType; size?: number; shadow?: boolean; ripple?: boolean; pressFrames?: number }> = ({
  waypoints, type = "arrow", size = 64, shadow = true, ripple = true, pressFrames = 6,
}) => {
  const frame = useCurrentFrame();
  const { x, y, index } = cursorPosition(waypoints, frame);
  const reached = waypoints.filter((w) => w.frame <= frame);
  const cur = reached.length ? reached[reached.length - 1] : waypoints[0];
  const curType = (frame >= waypoints[index].frame ? waypoints[index].type : undefined) ?? cur.type ?? type;
  const clicks = waypoints.filter((w) => w.click);
  const active = clicks.filter((c) => frame >= c.frame).pop();
  return (
    <>
      {ripple && clicks.map((c, i) => <ClickRipple key={i} x={c.x} y={c.y} at={c.frame + 2} />)}
      <MacCursor
        x={x} y={y} type={curType} size={size} shadow={shadow}
        pressedAt={active ? active.frame : undefined}
        releasedAt={active ? active.frame + pressFrames : undefined}
      />
    </>
  );
};

export default MacCursor;
