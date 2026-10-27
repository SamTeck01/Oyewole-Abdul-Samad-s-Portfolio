"""Compose an original, upbeat-but-smooth music track that follows the scenes.

Usage: .venv/bin/python scripts/music.py [cut]  (cut "90" default, or "60")
Reads src/timings<suffix>.json (run tts.py first). Writes public/sfx/music<suffix>.wav plus
whoosh, pop, click, type and chime sounds. The music ducks under the voice.
"""
import json, pathlib, sys
import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter

SR = 44100
ROOT = pathlib.Path(__file__).resolve().parent.parent
out = ROOT / "public/sfx"
out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)
cut = sys.argv[1] if len(sys.argv) > 1 else "90"
SUFFIX = "" if cut == "90" else f"_{cut}"
T = json.loads((ROOT / f"src/timings{SUFFIX}.json").read_text())
FPS = T["fps"]
DUR = T["total"] / FPS
N = int(DUR * SR)
starts = {s["id"]: s["from"] / FPS for s in T["scenes"]}
starts.setdefault("why", starts["work"])  # the 60 s cut has no "why" scene

BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def lp(x, cut):
    b, a = butter(2, min(cut, SR / 2 - 100) / (SR / 2), "low")
    return lfilter(b, a, x)


def hp(x, cut):
    b, a = butter(2, cut / (SR / 2), "high")
    return lfilter(b, a, x)


def add(buf, s, x):
    s = int(s * SR)
    if s >= len(buf):
        return
    n = min(len(x), len(buf) - s)
    buf[s:s + n] += x[:n]


def reverb(x, mix=0.3):
    y = x.copy()
    for d, g in [(0.089, 0.5), (0.137, 0.42), (0.211, 0.35), (0.317, 0.28), (0.433, 0.2)]:
        s = int(d * SR)
        y[s:] += g * x[:-s]
    return (1 - mix) * x + mix * y / 2.2


# Energy per moment (0 = sparse, 1 = full). Breakdown in "why", drop on "work".
def energy(t):
    if t < starts["intro"]:
        return 0.2
    if t < starts["specialty"]:
        return 0.7
    if t < starts["why"]:
        return 0.9
    if t < starts["work"]:
        return 0.35
    if t < starts["end"]:
        return 1.0
    return 0.3


# Ab – Fm – Db – Eb (warm, hopeful), one bar each
chords = [[56, 60, 63, 67], [53, 56, 60, 63], [49, 53, 56, 60], [51, 55, 58, 62]]
roots = [44, 41, 37, 39]

pads = np.zeros(N)
bass = np.zeros(N)
keys = np.zeros(N)
drums = np.zeros(N)
lead = np.zeros(N)

nbars = int(np.ceil(DUR / BAR))
for b in range(nbars):
    t0 = b * BAR
    ci = b % 4
    e = energy(t0 + 0.01)
    n = int((BAR + 0.6) * SR)
    tt = np.arange(n) / SR
    # pad: detuned saws, filtered
    pad = np.zeros(n)
    for m in chords[ci]:
        for det in (-0.15, 0.15):
            ph = (hz(m) * (1 + det / 100) * tt) % 1
            pad += 2 * ph - 1
    env = np.minimum(1, tt / 0.25) * np.minimum(1, np.maximum(0, (BAR + 0.6 - tt) / 0.6))
    add(pads, t0, lp(pad, 900 + 2200 * e) * env * 0.05)
    # bass: syncopated pattern
    if e >= 0.35:
        for off, ln in [(0, 0.7), (1.5, 0.4), (2, 0.7), (3.5, 0.4)]:
            nn = int(ln * BEAT * SR)
            t2 = np.arange(nn) / SR
            f0 = hz(roots[ci])
            tone = np.sin(2 * np.pi * f0 * t2) + 0.35 * np.sign(np.sin(2 * np.pi * f0 * t2)) * 0.5
            add(bass, t0 + off * BEAT, lp(tone, 500) * np.exp(-t2 * 2.5) * 0.35)
    # keys: arpeggio sixteenths when energetic, eighths otherwise
    step = BEAT / (4 if e >= 0.9 else 2)
    pattern = [0, 1, 2, 3, 2, 1, 2, 3]
    k = 0
    while k * step < BAR - 1e-6:
        m = chords[ci][pattern[k % 8]] + 12
        nn = int(0.5 * SR)
        t2 = np.arange(nn) / SR
        tone = np.sin(2 * np.pi * hz(m) * t2) + 0.3 * np.sin(4 * np.pi * hz(m) * t2)
        vel = 0.7 if k % 4 == 0 else 0.45
        add(keys, t0 + k * step, tone * np.exp(-t2 * 9) * 0.06 * vel * (0.5 + 0.5 * e))
        k += 1
    # drums
    for q in range(4):
        tq = t0 + q * BEAT
        if e >= 0.6:  # four-on-the-floor kick
            nn = int(0.3 * SR)
            t2 = np.arange(nn) / SR
            add(drums, tq, np.sin(2 * np.pi * (50 + 110 * np.exp(-t2 * 35)) * t2) * np.exp(-t2 * 9) * 0.9)
        if e >= 0.6 and q in (1, 3):  # clap
            nn = int(0.25 * SR)
            t2 = np.arange(nn) / SR
            add(drums, tq, hp(rng.standard_normal(nn), 1200) * np.exp(-t2 * 22) * 0.3)
        for h in range(2 if e < 0.9 else 4):  # hats
            nn = int(0.06 * SR)
            t2 = np.arange(nn) / SR
            vel = 0.13 if h % 2 else 0.08
            add(drums, tq + h * BEAT / (2 if e < 0.9 else 4), hp(rng.standard_normal(nn), 7000) * np.exp(-t2 * 70) * vel)
    # lead hook in the high-energy section
    if e >= 1.0:
        melody = [[75, None, 72, 75, 77, None, 75, None], [72, None, 68, 72, 75, None, None, None],
                  [73, None, 72, 68, 72, None, 68, None], [70, None, 72, 74, 75, None, None, None]][ci]
        for i, m in enumerate(melody):
            if m is None:
                continue
            nn = int(0.45 * SR)
            t2 = np.arange(nn) / SR
            vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t2)
            tone = np.sin(2 * np.pi * hz(m) * vib * t2) + 0.2 * np.sin(6 * np.pi * hz(m) * t2)
            add(lead, t0 + i * BEAT / 2, tone * np.minimum(1, t2 / 0.01) * np.exp(-t2 * 4) * 0.07)

# sidechain pump on pads and bass where the kick plays
t = np.arange(N) / SR
pump = 1 - 0.55 * np.exp(-((t % BEAT) / 0.09))
eng = np.array([energy(x) for x in np.arange(0, DUR, 0.05)])
eng_s = np.interp(t, np.arange(len(eng)) * 0.05, eng)
pumped = np.where(eng_s >= 0.6, pump, 1.0)
mix = (pads + bass) * pumped + reverb(keys, 0.35) + drums + reverb(lead, 0.3)

# risers into, and impacts on, each scene change
fx = np.zeros(N)
for sid, s in starts.items():
    if s < 1:
        continue
    rl = 1.6 if sid != "work" else 3.0
    nn = int(rl * SR)
    t2 = np.arange(nn) / SR
    noise = rng.standard_normal(nn)
    # rising band: crude sweep by blending low and high passes over time
    sweep = (t2 / rl) ** 2
    riser = (lp(noise, 1500) * (1 - sweep) + hp(noise, 2500) * sweep) * sweep * 0.12
    add(fx, s - rl, riser)
    nn = int(1.2 * SR)
    t2 = np.arange(nn) / SR
    boom = np.sin(2 * np.pi * (40 + 60 * np.exp(-t2 * 8)) * t2) * np.exp(-t2 * 3.5) * 0.5
    crash = hp(rng.standard_normal(nn), 4000) * np.exp(-t2 * 3) * 0.08
    add(fx, s, boom + crash)
mix += reverb(fx, 0.3)

# duck under the voiceover
vo, vsr = sf.read(ROOT / f"public/vo{SUFFIX}/full.wav")
vo_env = np.interp(t, np.arange(len(vo)) / vsr, np.abs(vo))
vo_env = lfilter([1 - 0.9995], [1, -0.9995], vo_env)
vo_env = np.clip(vo_env / (np.percentile(vo_env, 98) + 1e-9), 0, 1)
mix *= 1 - 0.5 * vo_env

fade = np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 3.0)
mix *= fade
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.9
stereo = np.stack([mix, np.roll(mix, int(0.011 * SR))], axis=1)
sf.write(out / f"music{SUFFIX}.wav", stereo, SR)


# ---- sound effects -------------------------------------------------------
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8
    sf.write(out / f"{name}.wav", x, SR)


n = int(0.8 * SR)
tt = np.arange(n) / SR
sweep = np.sin(np.pi * tt / tt[-1]) ** 2
noise = rng.standard_normal(n)
save("whoosh", reverb((lp(noise, 600) * (1 - sweep) + lp(noise, 3500) * sweep) * sweep, 0.3))
n = int(0.25 * SR)
tt = np.arange(n) / SR
save("pop", np.sin(2 * np.pi * (500 + 700 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 22))
n = int(0.06 * SR)
tt = np.arange(n) / SR
save("click", rng.standard_normal(n) * np.exp(-tt * 120) + 0.5 * np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 90))
n = int(0.04 * SR)
tt = np.arange(n) / SR
save("type", lp(rng.standard_normal(n), 5000) * np.exp(-tt * 150))
n = int(2.5 * SR)
tt = np.arange(n) / SR
save("chime", reverb(sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 2.2) for m in (72, 76, 79, 84)), 0.4))
print("ok", round(DUR, 1), "s")
