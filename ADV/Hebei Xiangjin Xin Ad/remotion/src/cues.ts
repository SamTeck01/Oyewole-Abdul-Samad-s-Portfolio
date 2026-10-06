// All timings in seconds, locked to VO take B (Bella). Shared with the audio build (cues.json).
export const FPS = 60;
export const VO_END = 94.3;
export const AD_END = 94.9;
export const TOTAL = AD_END + 2.2; // + samteck card

export const S = {
  hook: [0, 4.0],
  logo: [4.0, 14.1],
  range: [14.1, 39.1],
  material: [39.1, 50.6],
  finish: [50.6, 55.5],
  standards: [55.5, 60.5],
  chapter: [60.5, 62.1],
  step1: [62.1, 68.6],
  step2: [68.6, 73.7],
  step3: [73.7, 79.1],
  scale: [79.1, 88.2],
  end: [88.2, AD_END],
  card: [AD_END, TOTAL],
} as const;

export const HOOK_WORDS = ["Looking", "for", "the", "right", "fastener", "manufacturer?"];
export const HOOK_T = [0.3, 0.75, 0.95, 1.1, 1.45, 2.05];

// Range lineup — each group appears when its name is spoken
export const RANGE: { t: number; label: string; models: string[]; note?: string }[] = [
  { t: 14.3, label: "Hex bolts", models: ["hex_bolt"], note: "M6–M120" },
  { t: 15.3, label: "Flange & socket head bolts", models: ["flange_bolt", "socket_cap"] },
  { t: 17.3, label: "Nuts & lock nuts", models: ["hex_nut", "nylon_nut", "cap_nut", "wing_nut"], note: "M3–M64" },
  { t: 18.85, label: "Machine & self-tapping screws", models: ["machine_screw", "self_tapper"] },
  { t: 21.15, label: "Special bolts", models: ["t_bolt", "eye_bolt"], note: "M4–M48" },
  { t: 22.2, label: "Threaded rod & U-bolts", models: ["threaded_rod", "u_bolt"], note: "up to 3000 mm" },
  { t: 24.1, label: "Washers & retaining rings", models: ["flat_washer", "spring_washer", "circlip"] },
  { t: 25.65, label: "Expansion & chemical anchors", models: ["wedge_anchor", "chem_anchor"], note: "M6–M24" },
  { t: 28.45, label: "Rivets & pins", models: ["rivet", "dowel_pin"] },
  { t: 29.8, label: "Self-drilling screws", models: ["self_drill"] },
  { t: 31.3, label: "Solar mounting parts", models: ["solar"] },
  { t: 32.85, label: "Wire rope fittings", models: ["rope_clip", "turnbuckle", "shackle"] },
  { t: 34.35, label: "Pipe clamps & strut supports", models: ["pipe_clamp", "strut"], note: "DN15–DN300" },
  { t: 36.65, label: "Custom parts", models: ["custom"], note: "M2–M120 · to drawing" },
];
export const RANGE_GRID_T = 38.2; // zoom out to the 15-family wall

export const MATERIALS = [
  { t: 39.5, label: "Carbon steel", c: "#7c858f" },
  { t: 40.75, label: "Alloy steel", c: "#555d66" },
  { t: 41.95, label: "304 stainless", c: "#d9dee3" },
  { t: 43.2, label: "316 stainless", c: "#c7d3de" },
];
export const GRADES = ["4.8", "6.8", "8.8", "10.9", "12.9"];
export const GRADES_T = [46.45, 46.9, 47.35, 47.85, 48.3];

export const FINISHES = [
  { t: 51.1, label: "Zinc", c: "#cfd8e0", tint: "rgba(210,222,232,0.55)" },
  { t: 51.85, label: "Black oxide", c: "#2a2d33", tint: "rgba(30,32,38,0.85)" },
  { t: 53.0, label: "Hot-dip galvanized", c: "#9aa4ab", tint: "rgba(140,150,158,0.6)" },
  { t: 54.4, label: "Dacromet", c: "#b4b8bc", tint: "rgba(175,180,186,0.6)" },
];

export const STANDARDS = [
  { t: 56.95, label: "ISO 4014" },
  { t: 58.0, label: "DIN 471 / 472" },
  { t: 58.85, label: "GB/T 5782" },
];

export const STEP1_FIELDS = [
  { t: 65.3, k: "Size", v: "M12" },
  { t: 66.05, k: "Grade", v: "8.8" },
  { t: 66.4, k: "Material", v: "Carbon steel" },
  { t: 67.15, k: "Finish", v: "Hot-dip galvanized" },
];
export const STEP1_QTY_T = 67.6;

export const MARKETS = [
  { t: 83.1, label: "General industry" },
  { t: 84.25, label: "Steel structures" },
  { t: 85.4, label: "Solar" },
  { t: 86.15, label: "Electrical installation" },
];

export const PHONE = "+49 176 41474606";
