"""Explainer music + SFX around the Heart VO, ducked under speech. usage: python ex_audio.py <outdir>"""
import sys, os, json, numpy as np, soundfile as sf
from scipy import signal
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
SR = 48000; TOTAL = 86.2; N = int(TOTAL * SR); rng = np.random.default_rng(5)
HERE = os.path.dirname(os.path.abspath(__file__))
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

# VO
vo, vsr = sf.read(os.path.join(HERE, "vo_v2_heart.wav"), dtype="float32")
vo = signal.resample_poly(vo, 2, 1)  # 24k -> 48k
VO = np.zeros(N); place(VO, vo, 0.0)

# ---------- music: warm keys, 96 BPM ----------
BPM = 96; B = 60 / BPM; BAR = 4 * B
PROG = [(48, [0, 4, 7, 11, 14]), (45, [0, 3, 7, 10, 14]), (41, [0, 4, 7, 11, 14]), (43, [0, 4, 7, 9, 14])]  # Cmaj9 Am9 Fmaj9 G6/9
pad = np.zeros(N); keys = np.zeros(N); bass = np.zeros(N); perc = np.zeros(N)
def epiano(m, d):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3)) * env(len(t), 0.004, 0.9)
    return x
def padc(root, iv, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(root + 12 + i) * t * (1 + 0.002 * k)) for k, i in enumerate(iv)) / len(iv)
    a = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6); return lp(x, 1500) * a
END = 84.0
nb = int(np.ceil(END / BAR))
for b in range(nb):
    t0 = b * BAR; root, iv = PROG[b % 4]
    place(pad, padc(root, iv, BAR + 0.3), t0, 0.5)
    pattern = [0, 1.5, 2, 3] if b % 2 == 0 else [0, 1, 2.5, 3.5]
    for k, pos in enumerate(pattern):
        notes = [root + 12 + iv[(k + j) % len(iv)] for j in (0, 2)]
        for m in notes: place(keys, epiano(m, 1.2), t0 + pos * B, 0.18)
    for pos in (0, 2.5):
        x = np.sin(2 * np.pi * mtof(root - 12) * tt(B * 1.4)) * env(int(B * 1.4 * SR), 0.01, 0.5); place(bass, lp(x, 300), t0 + pos * B, 0.5)
    if 3.5 < t0 < 83:
        for q in range(4):
            place(perc, hp(noise(0.05), 6000) * env(int(0.05 * SR), 0.001, 0.015), t0 + q * B + B / 2, 0.12)
            if q in (1, 3): place(perc, bp(noise(0.12), 1500, 5000) * env(int(0.12 * SR), 0.001, 0.04), t0 + q * B, 0.18)
            if q in (0, 2):
                k = np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-tt(0.3) * 30)) / SR) * env(int(0.3 * SR), 0.001, 0.12); place(perc, k, t0 + q * B, 0.35)
# final chord ringing under end card
root, iv = PROG[0]
x = sum(epiano(root + 12 + i, 3.5) for i in iv) / 3; place(keys, x, 83.4, 0.35); place(pad, padc(root, iv, 2.8), 83.4, 0.5)
music = pad * 0.6 + keys + bass * 0.7 + perc

# ducking: music ≥15 dB under VO while she speaks
e = np.abs(VO); e = signal.sosfilt(signal.butter(1, 4, "low", fs=SR, output="sos"), e)
speaking = (e > 0.01).astype(float)
speaking = np.convolve(speaking, np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")  # smooth
duck = 1 - np.clip(speaking * 1.5, 0, 1) * (1 - 10 ** (-9 / 20))  # extra -9 dB on top of base level
music = music * duck

# ---------- SFX ----------
sfx = np.zeros(N)
def pop_(f=900): t = tt(0.12); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * np.exp(-t * 60))) / SR) * env(len(t), 0.001, 0.03)
def whoosh(d=0.5): t = tt(d); return bp(noise(d), 300, 5000) * np.sin(np.pi * t / d) ** 1.5 * 0.7
def tick(f=2600): t = tt(0.04); return np.sin(2 * np.pi * f * t) * env(len(t), 0.0005, 0.008)
def click(): return hp(noise(0.03), 2000) * env(int(0.03 * SR), 0.0003, 0.006) + tick(3200)[: int(0.03 * SR)] * 0.5
def chime(ns=(76, 80, 83, 88)):
    o = np.zeros(int(1.4 * SR))
    for k, m in enumerate(ns): place(o, epiano(m, 1.2) * 0.6, k * 0.07)
    return o
def ping(f=1568): t = tt(0.5); return np.sin(2 * np.pi * f * t) * env(len(t), 0.002, 0.12)
for i in range(3): place(sfx, ping(1400 + 200 * i), 0.15 + i * 0.6, 0.2)
for tt0 in (5.02, 5.12, 5.76, 5.86, 7.1, 7.2, 8.2, 8.3): place(sfx, pop_(800 + 300 * rng.random()), tt0, 0.25)
for i in range(10): place(sfx, tick(2000 + i * 120), 10.4 + i * 0.05, 0.2)
for tt0 in (12.5, 14.9, 18.5, 20.76): place(sfx, pop_(500), tt0, 0.3)
place(sfx, whoosh(0.8), 20.8, 0.3)
place(sfx, whoosh(0.6), 22.0, 0.3); place(sfx, whoosh(0.4), 23.4, 0.2)
place(sfx, whoosh(1.0), 26.2, 0.35); place(sfx, chime((72, 79, 84, 88, 91)), 27.1, 0.35)
for tt0 in (28.56, 29.62, 31.3): place(sfx, pop_(1100), tt0, 0.25)
place(sfx, whoosh(0.5), 32.9, 0.25)
for tt0 in (34.92, 35.6, 36.24, 36.9, 37.42): place(sfx, click(), tt0, 0.5); place(sfx, tick(3000), tt0 + 0.55, 0.3)
place(sfx, chime((79, 84)), 38.06, 0.25)
place(sfx, whoosh(0.6), 39.6, 0.25); place(sfx, whoosh(0.8), 40.6, 0.25)
for k in range(16): place(sfx, tick(1800 + k * 70), 43.0 + k * 0.1, 0.18)
place(sfx, chime(), 44.6, 0.3)
place(sfx, whoosh(0.5), 45.7, 0.25); place(sfx, click(), 47.52, 0.55); place(sfx, whoosh(0.4), 48.4, 0.25)
place(sfx, whoosh(0.5), 51.3, 0.25); place(sfx, ping(988), 53.6, 0.25); place(sfx, ping(784), 53.75, 0.25)
place(sfx, click(), 57.55, 0.6); place(sfx, chime((76, 83, 88)), 57.7, 0.3)
for tt0 in (59.1, 59.45, 59.8, 60.1): place(sfx, ping(1760), tt0, 0.18)
place(sfx, whoosh(0.5), 60.9, 0.25); place(sfx, pop_(900), 62.3, 0.25); place(sfx, chime((84, 88)), 63.3, 0.2); place(sfx, click(), 64.35, 0.4)
for tt0 in (67.4, 68.36, 69.58): place(sfx, pop_(700), tt0, 0.3)
for tt0 in (71.2, 73.18, 75.32):
    for k in range(8): place(sfx, tick(2200 + k * 100), tt0 + k * 0.08, 0.15)
place(sfx, whoosh(0.7), 77.3, 0.3); place(sfx, click(), 81.6, 0.6); place(sfx, chime((72, 76, 79, 84)), 81.7, 0.3)
place(sfx, whoosh(1.0), 83.9, 0.2)

mix = VO * 1.0 + music * 0.17 + np.tanh(sfx) * 0.35
fade = np.ones(N); fade[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR)); mix *= fade
st = lambda x: np.stack([x, x], 1)
sf.write(f"{OUT}/vo.wav", st(VO), SR); sf.write(f"{OUT}/music.wav", st(music * 0.17 * fade), SR); sf.write(f"{OUT}/sfx.wav", st(np.tanh(sfx) * 0.35 * fade), SR)
sf.write(f"{OUT}/premix.wav", st(mix / (np.abs(mix).max() + 1e-9) * 0.8), SR)
# check music level under speech
m = music * 0.17; sp = speaking > 0.5
r = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
print("VO rms (speech)", round(r(VO[sp]), 1), "music rms (under speech)", round(r(m[sp]), 1))
