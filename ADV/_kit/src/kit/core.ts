// Shared timing helpers. Curves match the reference clips:
// fast entrances (3-6 frames @30fps) and long soft settles (expo/quint out).
import {Easing, interpolate} from 'remotion';

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out: the default "settle"
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera moves
  in: Easing.bezier(0.7, 0, 0.84, 0), // exits / whips
  back: Easing.bezier(0.34, 1.56, 0.64, 1), // pops with overshoot
  count: Easing.bezier(0.45, 0, 0.2, 1), // count-ups: slow-fast-long tail (measured on Opal)
};

/** interpolate with clamping and an easing, the one call used everywhere */
export const tw = (
  f: number,
  range: number[],
  out: number[],
  easing: (t: number) => number = EASE.out,
) => interpolate(f, range, out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** progress 0..1 between two frames */
export const prog = (f: number, a: number, b: number, easing = EASE.out) => tw(f, [a, b], [0, 1], easing);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** seconds -> frames for a given fps (scenes are written in reference seconds) */
export const sec = (s: number, fps = 60) => Math.round(s * fps);
