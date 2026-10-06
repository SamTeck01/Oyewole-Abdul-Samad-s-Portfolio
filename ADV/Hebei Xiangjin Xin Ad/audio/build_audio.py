"""Original music + SFX for the Hebei Xiangjin Xin ad, made in code. Writes stems + premix.
usage: python build_audio.py <vo.wav> <outdir> <total_seconds>"""
import sys, json, numpy as np, soundfile as sf
from scipy import signal

VO, OUT, TOTAL = sys.argv[1], sys.argv[2], float(sys.argv[3])
SR = 48000
N = int(TOTAL * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def env(n, a=0.005, r=0.3, curve=4):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r * curve / 4)
    return e
def place(buf, x, t, g=1.0):
    i = int(t * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[: j - i] * g
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- MUSIC ----------------
BPM = 110; beat = 60 / BPM; bar = beat * 4
# chords (I–vi–IV–V in D major, warm voicings): root midi + intervals
prog = [(50, [0, 4, 7, 11, 14]), (47, [0, 3, 7, 10, 14]), (43, [0, 4, 7, 11, 14]), (45, [0, 4, 7, 10, 14])]
mus_pad = np.zeros(N); mus_bass = np.zeros(N); mus_arp = np.zeros(N); mus_drm = np.zeros(N)

def saw_soft(f, n, det=0.0):
    t = np.arange(n) / SR; out = np.zeros(n)
    for d in (-det, 0, det):
        ph = (t * f * (1 + d)) % 1; out += 2 * ph - 1
    return out / 3

AD_END = TOTAL - 2.2  # real time
nbars = int(np.ceil(TOTAL / bar))
for b in range(nbars):
    t0 = b * bar
    if t0 > AD_END + 0.2: break
    root, iv = prog[b % 4]
    last = t0 + bar > AD_END
    dur = bar if not last else (TOTAL - t0)
    n = int(dur * SR)
    # pad
    p = sum(saw_soft(mtof(root + 12 + i), n, 0.004) for i in iv) / len(iv)
    p = lp(p, 1800 if not last else 2400)
    a = np.minimum(1, np.arange(n) / (0.25 * SR)); rel = np.minimum(1, (n - np.arange(n)) / (0.3 * SR))
    if last: rel = np.exp(-np.arange(n) / SR / 1.2)
    place(mus_pad, p * a * rel, t0, 0.22)
    if last: break
    # bass: root 8ths, soft
    for k in range(8):
        tt = t0 + k * beat / 2; m = root - 12 if k % 2 == 0 else root
        nn = int(beat / 2 * SR); x = np.sin(2 * np.pi * mtof(m) * np.arange(nn) / SR)
        x = np.tanh(x * 1.5) * env(nn, 0.004, 0.25)
        place(mus_bass, x, tt, 0.35)
    # pluck arp 16ths
    seq = [0, 2, 1, 3, 2, 4, 3, 1]
    for k in range(16):
        tt = t0 + k * beat / 4; m = root + 24 + iv[seq[k % 8] % len(iv)]
        nn = int(0.35 * SR); tn = np.arange(nn) / SR
        x = (np.sin(2 * np.pi * mtof(m) * tn) + 0.3 * np.sin(4 * np.pi * mtof(m) * tn)) * env(nn, 0.002, 0.12)
        place(mus_arp, x, tt, 0.10 * (0.8 + 0.2 * (k % 4 == 0)))
    # drums: soft kick 4-floor from bar 2, hats offbeat, clap 2&4 from 14 s
    for k in range(4):
        tt = t0 + k * beat
        if tt > 3.6:
            nn = int(0.35 * SR); tn = np.arange(nn) / SR
            f = 50 + 90 * np.exp(-tn * 30); kk = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(nn, 0.001, 0.22)
            place(mus_drm, kk, tt, 0.55)
        if tt > 14:
            nn = int(0.06 * SR); h = hp(rng.standard_normal(nn), 7000) * env(nn, 0.001, 0.03)
            place(mus_drm, h, tt + beat / 2, 0.12)
        if tt > 14 and k % 2 == 1:
            nn = int(0.2 * SR); c = bp(rng.standard_normal(nn), 900, 3000) * env(nn, 0.001, 0.09)
            place(mus_drm, c, tt, 0.18)

# section dynamics: quieter under logo hold, lift at "how it works" (60.5) and map (76)
dyn = np.interp(t_all, [0, 3.5, 4, 14, 60.4, 61, 79, 88, AD_END, TOTAL], [0.6, 0.7, 0.85, 0.9, 0.9, 1.0, 1.0, 1.05, 1.0, 1.0])
music = (mus_pad + mus_bass + mus_arp + mus_drm) * dyn
music = lp(music, 14000)

# ---------------- SFX ----------------
sfx = np.zeros(N)
def whoosh(d=0.6, lo=300, hi=4000, g=0.35):
    n = int(d * SR); x = rng.standard_normal(n)
    sweep = np.linspace(0, 1, n); e = np.sin(np.pi * sweep) ** 2
    y = bp(x, lo, hi) * e; return y * g
def tick(f=2400, d=0.05, g=0.25):
    n = int(d * SR); tn = np.arange(n) / SR; return np.sin(2 * np.pi * f * tn) * env(n, 0.0005, d / 3) * g
def clink(f=1800, g=0.25):
    n = int(0.6 * SR); tn = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * r * tn) * np.exp(-tn * (6 + 4 * k)) for k, r in enumerate([1, 2.76, 5.4]))
    return x * env(n, 0.0005, 0.5) * g
def thud(g=0.5):
    n = int(0.4 * SR); tn = np.arange(n) / SR; f = 70 + 120 * np.exp(-tn * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.2) * g
def ratchet(n_clicks=5, g=0.25):
    out = np.zeros(int(0.35 * SR))
    for k in range(n_clicks):
        c = hp(rng.standard_normal(int(0.012 * SR)), 2500) * env(int(0.012 * SR), 0.0003, 0.005)
        place(out, c, k * 0.055, 1)
    return out * g
def stamp(g=0.5):
    x = thud(g); n = int(0.08 * SR); x[:n] += hp(rng.standard_normal(n), 1500) * env(n, 0.0005, 0.03) * g * 0.5; return x
def chime(fs=(1320, 1760), g=0.18):
    n = int(0.9 * SR); tn = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * tn) for f in fs) * env(n, 0.002, 0.6) * g
def rise(d=1.0, g=0.25):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n)
    for i in range(0, n, 2048):
        fc = 300 + 5000 * (i / n) ** 2; y[i:i + 2048] = bp(x[i:i + 2048], fc, fc * 1.6)
    return y * np.linspace(0, 1, n) ** 2 * g

C = json.load(open(sys.argv[4]))
WP = json.load(open(sys.argv[5]))
def W(x):
    for i in range(1, len(WP)):
        if x <= WP[i][0]:
            a, b = WP[i - 1], WP[i]; return a[1] + (x - a[0]) / (b[0] - a[0]) * (b[1] - a[1])
    return WP[-1][1] + (x - WP[-1][0])
_place = place
def place(buf, x, t, g=1.0): _place(buf, x, W(t), g)
# hook words
for tt in C["hook"]: place(sfx, whoosh(0.45, 600, 5000, 0.12), tt - 0.25)
# logo: arrow swoosh + lock click + hit
place(sfx, whoosh(1.0, 200, 3000, 0.4), 4.0); place(sfx, clink(1500, 0.3), 5.6); place(sfx, thud(0.45), 5.6)
place(sfx, whoosh(0.6, 400, 4000, 0.2), 8.9)
for k in range(12): place(sfx, tick(2000 + k * 60, 0.03, 0.08), 10.6 + k * 0.2)
place(sfx, stamp(0.35), 13.2)
# range items: clink per group, rising pitch, whoosh on camera move
for i, tt in enumerate(C["range"]):
    place(sfx, whoosh(0.5, 300, 3500, 0.15), tt - 0.45); place(sfx, clink(1300 + i * 70, 0.22), tt)
place(sfx, rise(0.9, 0.2), C["wall"] - 0.8); place(sfx, thud(0.4), C["wall"] + 0.1)
for k in range(15): place(sfx, tick(2600, 0.03, 0.06), C["wall"] + 0.1 + k * 0.035)
# materials / grades / finishes
place(sfx, whoosh(0.6, 300, 3000, 0.25), 39.1)
for tt in C["materials"]: place(sfx, tick(1800, 0.05, 0.2), tt); place(sfx, ratchet(4, 0.15), tt + 0.05)
for tt in C["grades"]: place(sfx, stamp(0.28), tt)
place(sfx, whoosh(0.6, 300, 3000, 0.25), 50.6)
for tt in C["finishes"]: place(sfx, tick(1600, 0.05, 0.2), tt); place(sfx, clink(2200, 0.12), tt + 0.03)
# standards: scan + checks
place(sfx, rise(1.8, 0.12), 55.8)
for tt in C["standards"]: place(sfx, chime((1320, 1980), 0.15), tt); place(sfx, stamp(0.2), tt)
# chapter
place(sfx, whoosh(1.0, 200, 5000, 0.3), 60.3)
# step 1: paper drop, field clicks, slider
place(sfx, whoosh(0.5, 500, 3000, 0.2), 63.6); place(sfx, thud(0.25), 64.0)
for tt in C["fields"]: place(sfx, tick(2800, 0.04, 0.25), tt); place(sfx, tick(1900, 0.04, 0.12), tt + 0.06)
for k in range(10): place(sfx, tick(2200 + k * 80, 0.025, 0.08), C["qty"] + k * 0.09)
# step 2: metal fill shimmer + multiply ticks + check
place(sfx, rise(0.9, 0.15), 69.8); place(sfx, clink(1700, 0.25), 70.6)
for k in range(20): place(sfx, clink(1500 + (k % 5) * 180, 0.05), 71.0 + k * 0.05)
place(sfx, chime((1320, 1760), 0.15), 71.9)
# step 3: parts drop, box close, tape, wipe, ship, pins
for k in range(6): place(sfx, clink(1200 + k * 90, 0.12), 74.2 + k * 0.12 + 0.3)
place(sfx, thud(0.35), 75.2); place(sfx, hp(rng.standard_normal(int(0.25 * SR)), 2000) * env(int(0.25 * SR), 0.01, 0.2) * 0.15, 75.3)
place(sfx, whoosh(0.9, 200, 4000, 0.35), 75.6)
place(sfx, tick(1500, 0.06, 0.25), 76.4); place(sfx, whoosh(1.6, 150, 1500, 0.2), 76.6)
place(sfx, tick(1500, 0.06, 0.25), 78.1); place(sfx, tick(1700, 0.06, 0.2), 78.3)
# scale: counter roll + market pops
for k in range(30): place(sfx, tick(2400, 0.02, 0.05 + 0.002 * k), 79.6 + k * 0.066)
place(sfx, thud(0.35), 81.6)
for tt in C["markets"]: place(sfx, clink(1600, 0.15), tt); place(sfx, whoosh(0.35, 800, 4000, 0.08), tt - 0.2)
# end: logo build + whatsapp pop
place(sfx, whoosh(1.2, 200, 3000, 0.35), 88.2); place(sfx, clink(1500, 0.3), 89.7); place(sfx, thud(0.5), 89.7)
place(sfx, chime((1568, 2093), 0.18), 92.5)
# samteck card
_place(sfx, whoosh(0.6, 300, 4000, 0.2), AD_END); _place(sfx, chime((1046, 1568), 0.12), AD_END + 0.2)

# ---------------- VO + ducking ----------------
vo, vsr = sf.read(VO, dtype="float64")
if vo.ndim > 1: vo = vo.mean(1)
vo = signal.resample_poly(vo, SR, vsr)
vo_buf = np.zeros(N); vo_buf[: min(N, len(vo))] = vo[:N]
vo_buf = hp(vo_buf, 80)
# speech envelope -> music gain (-17 dB under speech, smooth)
e = np.abs(signal.hilbert(lp(np.abs(vo_buf), 30))) if False else lp(np.abs(vo_buf), 8)
speaking = (e > 0.01).astype(float)
speaking = np.convolve(speaking, np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
speaking = np.clip(speaking * 3, 0, 1)
duck = 10 ** (-17 * speaking / 20)
music_d = music * duck

def norm(x, peak): m = np.max(np.abs(x)) + 1e-9; return x / m * peak
vo_buf = norm(vo_buf, 0.9)
music_d = norm(music_d, 0.5) * (10 ** (-7 / 20))
sfx = norm(sfx, 0.45)

st = lambda x: np.stack([x, x], 1).astype(np.float32)
# gentle stereo width on music
mus_st = np.stack([music_d, np.roll(music_d, int(0.012 * SR))], 1).astype(np.float32)
sf.write(f"{OUT}/stem_vo.wav", st(vo_buf), SR)
sf.write(f"{OUT}/stem_music.wav", mus_st, SR)
sf.write(f"{OUT}/stem_sfx.wav", st(sfx), SR)
mix = st(vo_buf) + mus_st + st(sfx)
sf.write(f"{OUT}/premix.wav", mix / max(1, np.max(np.abs(mix)) / 0.95), SR)
print("ok", TOTAL)
