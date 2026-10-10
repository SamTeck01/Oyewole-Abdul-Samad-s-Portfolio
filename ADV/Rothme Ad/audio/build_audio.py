"""Original music + SFX for the Rothme product ad (no VO), made in code.
usage: python build_audio.py <outdir>      -> music.wav, sfx.wav, premix.wav (48 kHz)"""
import sys, os, numpy as np, soundfile as sf
from scipy import signal

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
SR = 48000; TOTAL = 36.7; N = int(TOTAL * SR)
rng = np.random.default_rng(11)
BPM = 120; BEAT = 60 / BPM; BAR = BEAT * 4

def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def sos(kind, f, o=2): return signal.butter(o, f, kind, fs=SR, output="sos")
def lp(x, f, o=2): return signal.sosfilt(sos("low", f, o), x)
def hp(x, f, o=2): return signal.sosfilt(sos("high", f, o), x)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))
def place(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf) or len(x) == 0: return
    j = min(len(buf), i + len(x)); buf[i:j] += x[: j - i] * g
def saw(f, d, det=0.005):
    t = tt(d); o = 0
    for k in (-det, 0, det): o = o + (2 * ((t * f * (1 + k)) % 1) - 1)
    return o / 3
def noise(d): return rng.standard_normal(int(d * SR))

music = {k: np.zeros(N) for k in ("pad", "bass", "arp", "drums", "fx")}
sfx = np.zeros(N)

# ---------------- MUSIC ----------------
# E major family: Emaj9 | C#m9 | Amaj9 | B6/9   (roots as midi)
PROG = [(40, [0, 4, 7, 11, 14]), (37, [0, 3, 7, 10, 14]), (45, [0, 4, 7, 11, 14]), (47, [0, 4, 7, 9, 14])]
TENSE = [(37, [0, 3, 7, 10, 14]), (45, [0, 4, 7, 11, 18])]
DROP, BREAK, LOGO = 7.5, 28.5, 30.5

def pad_chord(root, iv, d, cutoff, g):
    x = sum(saw(mtof(root + 12 + i), d, 0.006) for i in iv) / len(iv)
    x = lp(x, cutoff)
    n = len(x); a = np.minimum(1, np.arange(n) / (0.12 * SR)); r = np.minimum(1, (n - np.arange(n)) / (0.15 * SR))
    return x * a * r * g

def kick():
    t = tt(0.45); f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.16) * 1.0
def clap():
    x = bp(noise(0.25), 900, 4000); e = env(len(x), 0.001, 0.07)
    return x * e * 0.6
def hat(open_=False):
    x = hp(noise(0.2 if open_ else 0.06), 7000); return x * env(len(x), 0.001, 0.08 if open_ else 0.02) * 0.35
def pluck(m, d=0.3):
    t = tt(d); x = (np.sin(2 * np.pi * mtof(m) * t) + 0.35 * np.sin(4 * np.pi * mtof(m) * t)) * env(len(t), 0.002, 0.12)
    return x
def subbass(m, d):
    t = tt(d); x = np.tanh(1.6 * np.sin(2 * np.pi * mtof(m) * t)); return lp(x, 400) * env(len(t), 0.005, d * 0.8)

# intro 0-3: filtered pulse building, ticking hats
for k in range(int(3.0 / (BEAT / 2))):
    t0 = k * BEAT / 2
    place(music["drums"], hat(), t0, 0.25 + 0.5 * t0 / 3)
    c = 300 + 1500 * (t0 / 3) ** 2
    root, iv = PROG[1]
    place(music["pad"], pad_chord(root, iv, BEAT / 2 * 0.9, c, 0.35), t0)
# riser 1.6-3.0
d = 1.4; t = tt(d); x = noise(d); x = bp(x, 400, 6000) * (t / d) ** 2
place(music["fx"], x, 1.6, 0.25)

# tension 3.0-7.5 (sparse, minor)
t0 = 3.0; i = 0
while t0 < DROP - 1e-6:
    root, iv = TENSE[i % 2]
    dd = min(BAR, DROP - t0)
    place(music["pad"], pad_chord(root, iv, dd, 1400, 0.5), t0)
    for b in range(int(dd / BEAT)):
        place(music["bass"], subbass(root - 12, BEAT * 0.9), t0 + b * BEAT, 0.45)
        place(music["drums"], hat(), t0 + b * BEAT + BEAT / 2, 0.35)
    t0 += BAR; i += 1
# pre-drop riser
d = 1.0; t = tt(d); place(music["fx"], bp(noise(d), 500, 8000) * (t / d) ** 2.5, DROP - d, 0.3)

# groove 7.5-28.5
bar_i = 0; t0 = DROP
ARP = [0, 7, 12, 14, 19, 14, 12, 7]
while t0 < BREAK - 1e-6:
    root, iv = PROG[bar_i % 4]
    dd = min(BAR, BREAK - t0)
    place(music["pad"], pad_chord(root, iv, dd, 2200, 0.42), t0)
    for b in range(int(round(dd / BEAT))):
        tb = t0 + b * BEAT
        place(music["drums"], kick(), tb, 0.9)
        if b % 2 == 1: place(music["drums"], clap(), tb, 0.55)
        place(music["drums"], hat(open_=True), tb + BEAT / 2, 0.45)
        place(music["drums"], hat(), tb + BEAT / 4, 0.25); place(music["drums"], hat(), tb + 3 * BEAT / 4, 0.25)
        place(music["bass"], subbass(root - 12 if b % 2 == 0 else root, BEAT * 0.85), tb, 0.5)
    lift = t0 >= 16.5
    for s in range(int(round(dd / (BEAT / 2)))):
        m = root + 24 + ARP[s % 8] + (12 if lift and s % 4 == 3 else 0)
        place(music["arp"], pluck(m), t0 + s * BEAT / 2, 0.16 if not lift else 0.2)
    t0 += BAR; bar_i += 1

# break 28.5-30.5: three hits on the words
for k, tb in enumerate((28.5, 29.0, 29.5)):
    root, iv = PROG[[0, 2, 3][k]]
    place(music["pad"], pad_chord(root, iv, 0.48, 3000, 0.55), tb)
    place(music["drums"], kick(), tb, 1.0); place(music["drums"], clap(), tb, 0.5)
    place(music["bass"], subbass(root - 12, 0.45), tb, 0.6)
d = 0.5; t = tt(d); place(music["fx"], bp(noise(d), 600, 9000) * (t / d) ** 2, 30.0, 0.3)

# logo 30.5 -> end: big Emaj9 chord ringing out under the end card
root, iv = PROG[0]
dd = TOTAL - LOGO
ch = sum(saw(mtof(root + 12 + i), dd, 0.007) for i in iv + [19, 23]) / 7
ch = lp(ch, 2600) * np.minimum(1, np.arange(len(ch)) / (0.02 * SR)) * np.exp(-np.arange(len(ch)) / SR / 2.6)
place(music["pad"], ch, LOGO, 0.75)
place(music["bass"], subbass(root - 12, 3.0), LOGO, 0.7)
place(music["drums"], kick(), LOGO, 1.0)
for s in range(16):  # sparkling arp tail
    place(music["arp"], pluck(root + 36 + ARP[s % 8]), LOGO + 0.3 + s * BEAT / 2, 0.12 * np.exp(-s / 8))

# ---------------- SFX ----------------
def whoosh(d=0.45, lo=300, hi=5000, up=True):
    t = tt(d); x = noise(d); sweep = (t / d) if up else (1 - t / d)
    # sweep filter by mixing bands
    y = bp(x, lo, hi) * np.sin(np.pi * t / d) ** 1.5
    return lp(y, 1200 + 6000 * sweep.mean()) * 0.9
def pop_(f=900):
    t = tt(0.12); fr = f * (1 + 1.2 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(t), 0.001, 0.03)
def tick(f=2400):
    t = tt(0.04); return np.sin(2 * np.pi * f * t) * env(len(t), 0.0005, 0.008)
def ping(f=1760):
    t = tt(0.6); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t)) * env(len(t), 0.002, 0.15)
def chime(notes=(76, 80, 83, 88)):
    out = np.zeros(int(1.2 * SR))
    for k, m in enumerate(notes):
        x = pluck(m, 1.0) * 0.7; place(out, x, k * 0.06)
    return out
def impact(f=55):
    t = tt(0.9); x = np.sin(2 * np.pi * np.cumsum(f + 60 * np.exp(-t * 20)) / SR) * env(len(t), 0.001, 0.35)
    return x + lp(noise(0.9), 1500) * env(len(t), 0.001, 0.08) * 0.5
def soft_impact(): t = tt(0.25); return lp(noise(0.25), 700) * env(len(t), 0.001, 0.05) + 0.6 * np.sin(2 * np.pi * 90 * t) * env(len(t), 0.001, 0.08)
def tap(): return hp(noise(0.03), 2000) * env(int(0.03 * SR), 0.0003, 0.006) * 1.2 + tick(3200)[:int(0.03 * SR)] * 0.5
def shimmer(d=1.2):
    out = np.zeros(int(d * SR))
    for k in range(10):
        m = 88 + [0, 4, 7, 11, 14][k % 5] + 12 * (k // 5)
        place(out, pluck(m, 0.5) * 0.5, k * 0.04)
    return out
def alert(): return (ping(988) * 0.6 + np.pad(ping(784), (int(0.12 * SR), 0))[: int(0.6 * SR)] * 0.6)

def rnd(i):
    x = np.sin(i * 127.1 + 311.7) * 43758.5453; return x - np.floor(x)

# storm
for i in range(12):
    ti = 0.03 + i * 0.16 + rnd(i) * 0.06
    place(sfx, pop_(700 + 500 * rnd(i + 1)), ti, 0.35); place(sfx, whoosh(0.25, 800, 6000), ti - 0.08, 0.12)
for i in range(5): place(sfx, ping(1568 + 200 * (i % 3)), 0.6 + i * 0.42, 0.22)
place(sfx, whoosh(0.6, 200, 4000), 2.9, 0.5)
place(sfx, impact(48), 3.0, 0.7)
# headlines
place(sfx, whoosh(0.4), 3.3, 0.25); place(sfx, whoosh(0.4), 5.4, 0.3)
# meet
place(sfx, whoosh(0.5, 300, 6000), 7.45, 0.35); place(sfx, shimmer(), 7.75, 0.35); place(sfx, whoosh(0.45, 200, 3000), 9.1, 0.3)
# connect
for i in range(10):
    ti = 9.6 + 0.25 + i * 0.17
    place(sfx, pop_(900 + 60 * i), ti, 0.3); place(sfx, whoosh(0.3, 1000, 7000), ti + 0.2, 0.1); place(sfx, tick(2800 + 80 * i), ti + 0.6, 0.35)
place(sfx, whoosh(0.5, 200, 5000), 12.55, 0.4)
# dashboard
place(sfx, whoosh(0.7, 150, 3000), 13.4, 0.45)
for i in range(9): place(sfx, soft_impact(), 13.6 + 0.12 * i, 0.3)
place(sfx, whoosh(0.5, 200, 5000), 16.05, 0.4)
# health
place(sfx, whoosh(0.4), 16.6, 0.25)
for k in range(14): place(sfx, tick(1800 + k * 90), 17.0 + k * 0.07, 0.25)
place(sfx, chime(), 18.8, 0.35)
# bars
place(sfx, whoosh(0.4), 19.6, 0.25)
for i in range(5): place(sfx, whoosh(0.35, 1500, 8000), 20.0 + i * 0.13, 0.12); place(sfx, tick(2000 + 150 * i), 20.4 + i * 0.13, 0.25)
place(sfx, chime((79, 83, 86, 91)), 21.05, 0.32)
# audit
place(sfx, whoosh(0.4), 22.6, 0.25); place(sfx, alert(), 23.35, 0.3)
place(sfx, whoosh(0.3, 2000, 8000), 23.45, 0.08)
place(sfx, tap(), 24.25, 0.6); place(sfx, chime((76, 83, 88)), 24.38, 0.3)
# cheat
place(sfx, whoosh(0.4), 25.6, 0.25)
for i in range(6): place(sfx, pop_(1100 + 40 * i), 25.8 + i * 0.07, 0.15)
place(sfx, tap(), 26.9, 0.6); place(sfx, whoosh(0.35, 600, 6000), 26.95, 0.3)
# CUA hits
for tb in (28.5, 29.0, 29.5): place(sfx, whoosh(0.3, 300, 6000), tb - 0.2, 0.25)
# logo
place(sfx, whoosh(0.6, 400, 9000), 30.55, 0.35); place(sfx, shimmer(1.5), 31.0, 0.4); place(sfx, impact(60), 31.5, 0.45)
place(sfx, pop_(1300), 32.45, 0.3)
place(sfx, whoosh(1.0, 200, 2500), 34.4, 0.2)

# ---------------- MIX ----------------
gains = {"pad": 0.55, "bass": 0.6, "arp": 0.5, "drums": 0.55, "fx": 0.5}
mus = sum(lp(music[k], 16000) * g for k, g in gains.items())
# gentle sidechain-ish pump on pad/arp under kicks in the groove
mus = np.tanh(mus * 0.9)
sfx = np.tanh(sfx * 1.1)
fade = np.ones(N); fade[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR))
mus *= fade; sfx *= fade
def st(x, w=0.0):
    return np.stack([x, x], 1)
sf.write(f"{OUT}/music.wav", st(mus), SR, subtype="FLOAT")
sf.write(f"{OUT}/sfx.wav", st(sfx), SR, subtype="FLOAT")
mix = mus * 0.8 + sfx * 0.9
mix = mix / (np.abs(mix).max() + 1e-9) * 0.7
sf.write(f"{OUT}/premix.wav", st(mix), SR, subtype="FLOAT")
print("ok", TOTAL)
