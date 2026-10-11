"""Lead Map video: original music + SFX around the Heart VO (ducked under speech). usage: python lm_audio.py <outdir>
All cues come from VO word timings in vo_heart.json, so a new VO take re-times the sound too."""
import sys, os, json, numpy as np, soundfile as sf
from scipy import signal
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
V = json.load(open(os.path.join(HERE, "vo_heart.json")))
LN = {l["id"]: l for l in V["lines"]}
WD = {}
for w in V["words"]: WD.setdefault((w["line"], w["w"]), []).append(w["s"])
W = lambda line, w, n=0: WD[(line, w)][n]
END = LN["cta"]["end"] + 0.9            # samteck card
SR = 48000; TOTAL = END + 2.2; N = int(TOTAL * SR); rng = np.random.default_rng(11)
def tt(d): return np.arange(int(d * SR)) / SR
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f): return signal.sosfilt(signal.butter(2, f, "low", fs=SR, output="sos"), x)
def hp(x, f): return signal.sosfilt(signal.butter(2, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b): return signal.sosfilt(signal.butter(2, [a, b], "band", fs=SR, output="sos"), x)
def env(n, a=0.005, r=0.3): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def place(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf) or len(x) == 0: return
    j = min(len(buf), i + len(x)); buf[i:j] += x[: j - i] * g
def noise(d): return rng.standard_normal(int(d * SR))

vo, _ = sf.read(os.path.join(HERE, "vo_heart.wav"), dtype="float32")
vo = signal.resample_poly(vo, 2, 1); VO = np.zeros(N); place(VO, vo, 0.0)

# ---------- music: bright, hopeful, 104 BPM; plucked marimba-like arps + warm pad + soft kick/shaker ----------
BPM = 104; B = 60 / BPM; BAR = 4 * B
PROG = [(50, [0, 4, 7, 11, 14]), (47, [0, 3, 7, 10, 14]), (43, [0, 4, 7, 11, 14]), (45, [0, 4, 7, 9, 14])]  # Dmaj9 Bm9 Gmaj9 A6/9
pad = np.zeros(N); arp = np.zeros(N); bass = np.zeros(N); perc = np.zeros(N)
def pluck(m, d=0.6):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 18)) * env(len(t), 0.002, 0.22)
def padc(root, iv, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(root + 12 + i) * t * (1 + 0.003 * k)) for k, i in enumerate(iv)) / len(iv)
    return lp(x, 1800) * np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.5)
MEND = END - 0.4
for b in range(int(np.ceil(MEND / BAR))):
    t0 = b * BAR; root, iv = PROG[b % 4]
    place(pad, padc(root, iv, BAR + 0.3), t0, 0.45)
    for k in range(8):                                   # 8th-note arp
        if t0 + k * B / 2 > MEND: break
        m = root + 24 + [0, 7, 12, 14, 16, 14, 12, 7][k] + (iv[1] - 4 if k in (4, 5) else 0)
        place(arp, pluck(m), t0 + k * B / 2, 0.16 if k % 2 == 0 else 0.11)
    for pos in (0, 1.5, 2.5):
        x = np.sin(2 * np.pi * mtof(root - 12) * tt(B)) * env(int(B * SR), 0.01, 0.35); place(bass, lp(x, 260), t0 + pos * B, 0.5)
    if 3.8 < t0 < MEND - 0.5:
        for q in range(4):
            kk = np.sin(2 * np.pi * np.cumsum(48 + 80 * np.exp(-tt(0.3) * 32)) / SR) * env(int(0.3 * SR), 0.001, 0.11)
            place(perc, kk, t0 + q * B, 0.32)
            for e in (0.5, 0.75): place(perc, hp(noise(0.04), 7000) * env(int(0.04 * SR), 0.001, 0.012), t0 + q * B + e * B, 0.09)
            if q in (1, 3): place(perc, bp(noise(0.14), 1200, 6000) * env(int(0.14 * SR), 0.001, 0.05), t0 + q * B, 0.16)
root, iv = PROG[0]
x = sum(pluck(root + 24 + i, 3.0) for i in iv) / 3; place(arp, x, END - 0.6, 0.5); place(pad, padc(root, iv, 2.8), END - 0.6, 0.5)
music = pad * 0.6 + arp + bass * 0.7 + perc
e = signal.sosfilt(signal.butter(1, 4, "low", fs=SR, output="sos"), np.abs(VO))
speaking = np.convolve((e > 0.01).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
music = music * (1 - np.clip(speaking * 1.5, 0, 1) * (1 - 10 ** (-9 / 20)))

# ---------- SFX ----------
sfx = np.zeros(N)
def pop_(f=900): t = tt(0.12); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * np.exp(-t * 60))) / SR) * env(len(t), 0.001, 0.03)
def whoosh(d=0.5): t = tt(d); return bp(noise(d), 300, 5000) * np.sin(np.pi * t / d) ** 1.5 * 0.7
def tick(f=2600): t = tt(0.04); return np.sin(2 * np.pi * f * t) * env(len(t), 0.0005, 0.008)
def click(): return hp(noise(0.03), 2000) * env(int(0.03 * SR), 0.0003, 0.006) + tick(3200)[: int(0.03 * SR)] * 0.5
def key(): return bp(noise(0.03), 1500, 7000) * env(int(0.03 * SR), 0.0003, 0.008)
def chime(ns=(76, 80, 83, 88)):
    o = np.zeros(int(1.6 * SR))
    for k, m in enumerate(ns): place(o, pluck(m + 12, 1.4) * 0.6, k * 0.07)
    return o
def ping(f=1568): t = tt(0.5); return np.sin(2 * np.pi * f * t) * env(len(t), 0.002, 0.12)
def drop(f=600): t = tt(0.18); return np.sin(2 * np.pi * np.cumsum(f * (1.8 - 0.8 * np.minimum(1, t / 0.08))) / SR) * env(len(t), 0.001, 0.05)
def riser(d=1.0): t = tt(d); return bp(noise(d), 800, 8000) * (t / d) ** 2 * 0.6

# hook: pins pop across the city
for i in range(34): place(sfx, drop(500 + 40 * (i % 9)), 0.05 + i * 0.05 + 0.3, 0.12)
place(sfx, whoosh(0.6), W("hook", "they're") - 0.3, 0.25)
# studio
place(sfx, whoosh(0.8), 3.8, 0.3); place(sfx, pop_(1300), W("maya", "meet"), 0.2)
for k in range(3): place(sfx, pop_(900 + 150 * k), W("maya", "web") + k * 0.12, 0.25)
for k in range(26): place(sfx, key(), W("maya", "finding") + 0.1 + k * 0.047, 0.35)
for k in range(6): place(sfx, pop_(700), W("maya", "hours") + 0.1 + k * 0.12, 0.2)
for k in range(24): place(sfx, tick(2400), W("maya", "hours") + k * 0.09, 0.12)
for k in range(4): place(sfx, pop_(500), W("maya", "guessing") + k * 0.18, 0.28)
place(sfx, ping(880), W("maya", "call"), 0.2)
# app
a = LN["search"]["start"] - 0.3
place(sfx, whoosh(0.9), a, 0.35)
tOpen = W("search", "now") + 0.6; place(sfx, click(), tOpen, 0.55); place(sfx, whoosh(0.4), tOpen + 0.2, 0.25)
for k in range(10): place(sfx, key(), W("search", "types") + 0.2 + k * 0.09, 0.4)
place(sfx, click(), W("search", "service") + 0.35, 0.45)
place(sfx, click(), W("search", "picks") + 0.1, 0.4); place(sfx, click(), W("search", "picks") + 1.0, 0.45)
place(sfx, click(), W("search", "finds"), 0.6); place(sfx, riser(0.8), W("search", "finds") - 0.6, 0.2); place(sfx, whoosh(0.8), W("search", "finds") + 0.2, 0.3)
tP = LN["pins"]["start"] + 0.1
for i in range(34): place(sfx, drop(520 + 30 * (i % 11)), tP + i * 0.045 + 0.2, 0.16)
for k in range(16): place(sfx, tick(1800 + k * 60), tP + k * 0.1, 0.12)
for k in range(5): place(sfx, pop_(1200), W("pins", "opportunity") + k * 0.2, 0.18)
for w, f in (("hot", 1175), ("warm", 988), ("cold", 784)): place(sfx, ping(f), W("pins", w), 0.22)
tW = LN["why"]["start"]
place(sfx, whoosh(0.8), tW + 0.2, 0.3); place(sfx, chime((79, 83, 86)), tW + 1.4, 0.2)
for k in range(14): place(sfx, tick(2000 + k * 90), tW + 0.8 + k * 0.08, 0.1)
for w, n in (("no", 0), ("no", 1), ("light", 0), ("clear", 0)): place(sfx, pop_(1000), W("why", w, n), 0.25)
tS = W("save", "saves"); place(sfx, click(), tS, 0.6); place(sfx, chime((76, 83, 88)), tS + 0.1, 0.28)
place(sfx, whoosh(0.7), tS + 0.5, 0.25)
for k in range(5): place(sfx, key(), W("save", "estimated") + 0.3 + k * 0.14, 0.4)
place(sfx, ping(1318), W("save", "followup") + 0.1, 0.2); place(sfx, chime((79, 84, 88)), W("save", "calendar"), 0.25)
# pipeline hops
tB = LN["stages"]["start"]; place(sfx, whoosh(0.7), tB - 0.2, 0.3)
for w in ("contacted", "bid"): place(sfx, whoosh(0.35), W("stages", w) - 0.25, 0.25); place(sfx, pop_(800), W("stages", w) + 0.15, 0.25)
tWon = W("stages", "won"); place(sfx, whoosh(0.35), tWon - 0.25, 0.25); place(sfx, chime((74, 78, 81, 86, 90)), tWon, 0.35)
for k in range(20): place(sfx, tick(3000 + 300 * rng.random()), tWon + 0.05 + k * 0.04, 0.12)
# CTA
tC = LN["cta"]["start"]; place(sfx, whoosh(0.9), tC - 0.3, 0.3); place(sfx, chime((74, 81, 86)), tC + 0.1, 0.25)
place(sfx, pop_(1100), W("cta", "free"), 0.25)
place(sfx, click(), W("cta", "rothme", 1) + 0.2, 0.55); place(sfx, chime((74, 78, 81, 86)), W("cta", "rothme", 1) + 0.3, 0.25)
place(sfx, whoosh(1.0), END - 0.1, 0.2)

mix = VO + music * 0.17 + np.tanh(sfx) * 0.35
fade = np.ones(N); fade[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR)); mix *= fade
st = lambda x: np.stack([x, x], 1)
sf.write(f"{OUT}/vo.wav", st(VO), SR); sf.write(f"{OUT}/music.wav", st(music * 0.17 * fade), SR); sf.write(f"{OUT}/sfx.wav", st(np.tanh(sfx) * 0.35 * fade), SR)
sf.write(f"{OUT}/premix.wav", st(mix / (np.abs(mix).max() + 1e-9) * 0.8), SR)
m = music * 0.17; sp = speaking > 0.5
r = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
print("VO rms (speech)", round(r(VO[sp]), 1), "music rms (under speech)", round(r(m[sp]), 1), "total", round(TOTAL, 2))
