# Music v2 for Baucheck24 (client: "better music", film is faster and more dynamic).
# Modern, bright tech-corporate groove, 116 BPM: pumping pad, plucked arp with delay,
# round kick, soft clap, offbeat hats, sidechained sub. Made in code (numpy/scipy).
import numpy as np, soundfile as sf, json, sys
from scipy.signal import butter, sosfilt

SR = 48000
BPM = 116
BEAT = 60 / BPM
BAR = BEAT * 4
LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'
cues = json.load(open('cues_en.json' if LANG == 'en' else '../remotion/src/cues_de.json'))
L = {l['id']: l for l in cues['lines']}
DUR = cues['total'] + 3.2
N = int(DUR * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)

def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(buf, s, at):
    i = int(at * SR)
    if i >= N or i < 0: return
    j = min(N, i + len(s)); buf[i:j] += s[:j - i]

# C – G/B – Am7 – Fmaj7 (bright, confident)
prog = [[48, 55, 60, 64, 67, 71], [47, 55, 59, 62, 67, 74], [45, 52, 57, 60, 64, 67], [41, 53, 57, 60, 64, 69]]

# sections from the cut: sparse intro until the logo, full groove after, breakdown at the
# autonomy/audit part, final lift into "Building."
logo = L['l05']['end']
brk0, brk1 = L['l26']['start'] - 0.5, L['l28']['start'] - 0.3
end_hit = L['l29']['start']
def drums_on(x): return logo - 0.2 < x < brk0 or brk1 < x < DUR - 3
def level(x): return np.interp(x, [0, logo, logo + 2, brk0, brk0 + 1, brk1, end_hit, DUR], [.55, .7, 1, 1, .6, .7, 1.1, .8])

out = np.zeros(N)
nb = int(DUR / BAR) + 1

# pad: detuned saws, sidechain pump on every beat
pad = np.zeros(N)
for bi in range(nb):
    ch = prog[bi % 4]; s0 = int(bi * BAR * SR); s1 = min(N, int((bi + 1) * BAR * SR) + int(.3 * SR))
    if s0 >= N: break
    tt = np.arange(s1 - s0) / SR
    seg = sum((2 * ((midi(m + 12) * (1 + d / 100) * tt + rng.random()) % 1) - 1) for m in ch[2:] for d in (-.1, .1)) * .035
    env = np.minimum(1, tt / .15) * np.minimum(1, np.maximum(0, (BAR + .3 - tt) / .3))
    pad[s0:s1] += seg * env
pad = lp(pad, 2200)
pump = 1 - 0.55 * np.exp(-((t % BEAT) / 0.11))
out += pad * pump * 0.5

# plucked arp, 16ths, with a dotted-8th delay
arp = np.zeros(N)
def pluck(f, dur=.32, v=.1):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(4 * np.pi * f * tt) + .15 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 14)
    return s * np.minimum(1, tt / .002) * v
pat = [2, 4, 3, 5, 4, 3, 5, 2, 3, 5, 4, 2, 5, 3, 4, 5]
for bi in range(nb):
    t0 = bi * BAR
    if t0 > DUR - 2 or t0 < 1.5: continue
    ch = prog[bi % 4]
    for k, idx in enumerate(pat):
        put(arp, pluck(midi(ch[idx] + 12), v=.08 * level(t0)), t0 + k * BEAT / 4)
d = int(BEAT * .75 * SR)
arp2 = arp.copy(); arp2[d:] += arp[:-d] * .35; arp2[2 * d:] += arp[:-2 * d] * .15
out += hp(arp2, 300)

# sub bass on 8ths following the root, ducked by the kick
bass = np.zeros(N)
for bi in range(nb):
    t0 = bi * BAR
    if not drums_on(t0 + .1): continue
    f = midi(prog[bi % 4][0] - 12)
    for k in range(8):
        n = int(BEAT / 2 * .9 * SR); tt = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * tt) + .2 * np.sin(4 * np.pi * f * tt)) * np.minimum(1, tt / .005) * np.exp(-tt * 3) * .2
        put(bass, s, t0 + k * BEAT / 2)
out += lp(bass, 400) * pump

# drums
drm = np.zeros(N)
for b in range(int(DUR / BEAT)):
    tb = b * BEAT
    if not drums_on(tb): continue
    lv = level(tb)
    n = int(.3 * SR); tt = np.arange(n) / SR
    f = 50 + 90 * np.exp(-tt * 35)
    put(drm, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10) * .42 * lv, tb)  # kick on every beat
    if b % 4 in (1, 3):  # soft clap
        n2 = int(.18 * SR); nz = bp(rng.standard_normal(n2), 900, 3500) * np.exp(-np.arange(n2) / SR * 22) * .09 * lv
        put(drm, nz, tb)
    n3 = int(.05 * SR)  # offbeat hat
    put(drm, hp(rng.standard_normal(n3), 8000) * np.exp(-np.arange(n3) / SR * 80) * .05 * lv, tb + BEAT / 2)
out += drm

# risers into the logo and into "Building."
for at in (logo, end_hit):
    n = int(2.0 * SR); tt = np.arange(n) / SR
    put(out, hp(rng.standard_normal(n), 2000) * (tt / 2.0) ** 2 * .06, at - 2.0)

out *= np.minimum(1, t / 1.0)
out *= np.clip((DUR - t) / 2.5, 0, 1) ** .7
out /= np.max(np.abs(out)) + 1e-9
sf.write('music.wav' if LANG == 'en' else 'music_de.wav', np.stack([out, np.roll(out, 300) * .98], 1).astype(np.float32), SR)
print('music2', round(DUR, 2))
