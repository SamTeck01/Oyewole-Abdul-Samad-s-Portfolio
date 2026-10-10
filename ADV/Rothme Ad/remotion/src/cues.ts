// Scene timing in seconds (music is 120 BPM: 1 beat = 0.5 s, 1 bar = 2 s)
export const Q = {
  storm: [0, 3.5],
  everywhere: [3.0, 5.4],
  working: [5.4, 7.5],
  meet: [7.5, 9.6],
  connect: [9.6, 13.0],
  dash: [13.0, 16.5],
  health: [16.5, 19.5],
  bars: [19.5, 22.5],
  audit: [22.5, 25.5],
  cheat: [25.5, 28.5],
  cua: [28.5, 30.5],
  logo: [30.5, 34.5],
  card: [34.5, 36.7],
} as const;
export const TOTAL = 36.7;
