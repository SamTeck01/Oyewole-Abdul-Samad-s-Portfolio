# Original music for the Baucheck24 film, made in code (numpy/scipy).
# Warm minimal electronic: soft piano, airy pad, sub bass, gentle pulse. 100 BPM.
import numpy as np, soundfile as sf, json, sys
from scipy.signal import butter, sosfilt

SR = 48000
BPM = 100
BEAT = 60 / BPM
import sys
LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'
cues = json.load(open('cues_en.json' if LANG == 'en' else '../remotion/src/cues_de.json'))
DUR = cues['total'] + 3.2  # VO + end card ring-out
N = int(DUR * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)

def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f):
    return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def midi(m):
    return 440 * 2 ** ((m - 69) / 12)

# progression (4 bars each chord = 1 bar), Dmaj9 – Bm9 – Gmaj7 – A6sus
prog = [[50, 57, 62, 64, 66, 69], [47, 54, 59, 61, 62, 66], [43, 50, 55, 59, 62, 66], [45, 52, 57, 59, 62, 64]]
BAR = BEAT * 4

def section_level(sec):
    # energy curve: intro sparse, build at brand reveal, steady through phases, lift at the end
    sc = DUR / 136.69  # energy curve stretches with the cut
    pts = [(0, .45), (14 * sc, .5), (17.5 * sc, 1.0), (40 * sc, .85), (60 * sc, 1.0), (110 * sc, 1.05), (122 * sc, .8), (DUR, .6)]
    xs, ys = zip(*pts)
    return np.interp(sec, xs, ys)

out = np.zeros(N)

# --- pad: detuned saws, slow low-pass, whole film
pad = np.zeros(N)
for bi in range(int(DUR / BAR) + 1):
    ch = prog[bi % 4]
    s0 = int(bi * BAR * SR); s1 = min(N, int((bi + 1) * BAR * SR) + int(.6 * SR))
    if s0 >= N: break
    tt = np.arange(s1 - s0) / SR
    env = np.minimum(1, tt / .8) * np.minimum(1, np.maximum(0, (BAR + .6 - tt) / .6))
    seg = np.zeros(s1 - s0)
    for m in ch[1:]:
        for d in (-0.08, 0.08):
            f = midi(m + 12) * (1 + d / 100)
            ph = rng.random()
            seg += (2 * ((f * tt + ph) % 1) - 1) * 0.05
    pad[s0:s1] += seg * env
pad = lp(pad, 1400)
out += pad * 0.55

# --- soft piano: chord stabs on beat 1, arpeggio 8ths in the middle sections
def piano(freq, dur, vel):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = sum((1 / k ** 1.6) * np.sin(2 * np.pi * freq * k * tt + k) * np.exp(-tt * (1.2 + k * .9)) for k in range(1, 7))
    s *= np.minimum(1, tt / .004)
    return s * vel

pno = np.zeros(N)
for bi in range(int(DUR / BAR) + 1):
    t0 = bi * BAR
    if t0 > DUR - 1: break
    ch = prog[bi % 4]
    lvl = section_level(t0)
    for m in ch[1:4]:
        s = piano(midi(m + 12), 3.0, .18)
        i0 = int(t0 * SR); i1 = min(N, i0 + len(s)); pno[i0:i1] += s[:i1 - i0]
    if False:  # arpeggio removed: client found the music too busy
        arp = [ch[2] + 24, ch[3] + 24, ch[4] + 12, ch[5] + 12, ch[3] + 24, ch[4] + 12, ch[2] + 24, ch[5] + 12]
        for k, m in enumerate(arp):
            s = piano(midi(m), 1.2, .07 * lvl)
            i0 = int((t0 + k * BEAT / 2) * SR); i1 = min(N, i0 + len(s)); pno[i0:i1] += s[:i1 - i0]
out += lp(pno, 5000) * 0.9

# --- sub bass: root per bar, from the brand reveal on
bass = np.zeros(N)
for bi in range(int(DUR / BAR) + 1):
    t0 = bi * BAR
    if not (17.2 < t0 < 126): continue
    f = midi(prog[bi % 4][0] - 12)
    for k in range(4):
        n = int(BEAT * .95 * SR); tt = np.arange(n) / SR
        s = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 1.4) * np.minimum(1, tt / .01) * .22
        i0 = int((t0 + k * BEAT) * SR); i1 = min(N, i0 + n); bass[i0:i1] += s[:i1 - i0]
out += bass * 0.45

# --- gentle pulse: soft kick on 1 & 3, shaker on 8ths
drm = np.zeros(N)
nb = int(DUR / BEAT)
for b in range(nb):
    tb = b * BEAT
    if not (17.2 < tb < 124): continue
    lvl = section_level(tb)
    if b % 2 == 0:
        n = int(.35 * SR); tt = np.arange(n) / SR
        f = 48 + 70 * np.exp(-tt * 30)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * .35 * lvl
        i0 = int(tb * SR); i1 = min(N, i0 + n); drm[i0:i1] += s[:i1 - i0]
    for h in (0, .5):
        n = int(.06 * SR)
        s = hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 70) * (.05 if h else .03) * lvl
        i0 = int((tb + h * BEAT) * SR); i1 = min(N, i0 + n); drm[i0:i1] += s[:i1 - i0]
# drums removed (client: music too busy)

# fade in / ring-out
out *= np.minimum(1, t / 1.5)
out *= np.clip((DUR - t) / 2.5, 0, 1) ** .7
out /= np.max(np.abs(out)) + 1e-9
sf.write(('music.wav' if LANG == 'en' else 'music_de.wav'), np.stack([out, np.roll(out, 240) * .98], 1).astype(np.float32), SR)
print('music', round(DUR, 2))
