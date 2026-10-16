# Original 120 BPM pop track made in code (no samples): intro riser -> drop on the 20% slam -> groove -> soft outro.
# SFX (whoosh + pop) on every scene cut. Mastered to about -14 LUFS, true peak under -1 dB. usage: python music.py out.wav
import sys, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import butter, sosfilt
SR = 48000; BPM = 120; B = 60 / BPM; BEATS = 44; DUR = BEATS * B + 1.0; N = int(DUR * SR)
CUTS = [0, 5, 9, 12, 15, 18, 21, 24, 27, 30, 34, 37]  # scene starts in beats (match Ad.tsx)
DROP, OUTRO = 5, 37
rng = np.random.default_rng(3); t = np.arange(N) / SR
f = lambda m: 440 * 2 ** ((m - 69) / 12)
filt = lambda x, fr, kind='low', o=2: sosfilt(butter(o, fr, kind, fs=SR, output='sos'), x)
def add(buf, s, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(s))
    if 0 <= i < N: buf[i:j] += g * s[:j - i]
def env(n, a=.005, d=.2):
    tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt / d)
def kick():
    n = int(.45 * SR); tt = np.arange(n) / SR; fr = 48 + 110 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 7) + .3 * np.sin(2 * np.pi * np.cumsum(fr) / SR * 2) * np.exp(-tt * 40)
def clap():
    n = int(.3 * SR); x = filt(rng.standard_normal(n), [900, 5000], 'band')
    e = sum(np.exp(-np.maximum(0, np.arange(n) / SR - k * .011) * 60) * (np.arange(n) / SR >= k * .011) for k in range(3)) + .5 * np.exp(-np.arange(n) / SR * 9)
    return x * e * .8
def hat(open_=False):
    n = int((.18 if open_ else .05) * SR); return filt(rng.standard_normal(n), 7000, 'high') * env(n, .001, .06 if open_ else .015) * .35
def pluck(m, d=.35, bright=1.0):
    n = int(d * SR); tt = np.arange(n) / SR; fr = f(m)
    x = sum((1 / k ** 1.3) * np.sign(np.sin(2 * np.pi * fr * k * tt * (1 + .002 * k))) * np.exp(-tt * (5 + k * 2.5 / bright)) for k in (1, 2, 3)) / 2
    return x * env(n, .003, .25)
def bass(m, d):
    n = int(d * SR); tt = np.arange(n) / SR; x = np.sin(2 * np.pi * f(m) * tt) + .35 * np.sign(np.sin(2 * np.pi * f(m) * tt))
    return filt(x, 600) * np.minimum(1, tt / .005) * np.minimum(1, (d - tt) / .02)
# A  E  F#m  D  (I V vi IV), one chord per bar
prog = [(57, [64, 69, 73, 76]), (52, [64, 68, 71, 76]), (54, [61, 66, 69, 73]), (50, [62, 66, 69, 74])]
drums, music, sub, sfx = (np.zeros(N) for _ in range(4))
for b in range(BEATS):
    at = b * B; root, ch = prog[(b // 4) % 4]
    full = DROP <= b < OUTRO
    if full or b >= OUTRO and b < OUTRO + 4:
        add(drums, kick(), at, .95 if full else .6)
        if b % 2 == 1: add(drums, clap(), at, .55)
        add(drums, hat(b % 4 == 3), at + B / 2, 1)
        if full: add(drums, hat(), at + B / 4, .5); add(drums, hat(), at + 3 * B / 4, .5)
    if full: add(sub, bass(root - 12, B / 2 * .9), at); add(sub, bass(root - 12 + (7 if b % 4 == 3 else 0), B / 2 * .9), at + B / 2)
    # chord plucks: syncopated pattern
    for k, off in enumerate([0, .75, 1.5] if b % 2 == 0 else [.5, 1.0]):
        if off < 1: add(music, sum(pluck(m, .4, 1.3 if full else .6) for m in ch) / 3, at + off * B, .55 if (full or b >= OUTRO) else .4)
    # top-line melody arpeggio over the groove
    if full and b % 1 == 0:
        mel = ch[(b * 3) % 4] + 12
        add(music, pluck(mel, .25, 1.5), at + .5 * B, .28)
# intro riser into the drop + impact
r0, r1 = (DROP - 3) * B, DROP * B; n = int((r1 - r0) * SR); tt = np.arange(n) / SR
rise = filt(rng.standard_normal(n), 3000, 'high') * (tt / tt[-1]) ** 2 * .25 + np.sin(2 * np.pi * np.cumsum(300 + 900 * (tt / tt[-1]) ** 2) / SR) * (tt / tt[-1]) ** 2 * .08
add(sfx, rise, r0)
nn = int(1.2 * SR); tt = np.arange(nn) / SR
add(sfx, np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-tt * 10)) / SR) * np.exp(-tt * 3) * .7 + filt(rng.standard_normal(nn), 4000) * np.exp(-tt * 6) * .25, DROP * B)
# whoosh + pop on scene cuts
for c in CUTS[2:]:
    n = int(.35 * SR); tt = np.arange(n) / SR
    add(sfx, filt(rng.standard_normal(n), [800, 6000], 'band') * np.sin(np.pi * tt / .35) ** 2 * .10, c * B - .22)
    n = int(.12 * SR); tt = np.arange(n) / SR
    add(sfx, np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tt * 30) + 300) / SR) * np.exp(-tt * 40) * .25, c * B + .02)
# sparkle chime on the logo
for k, m in enumerate([81, 85, 88, 93]): add(sfx, np.sin(2 * np.pi * f(m) * np.arange(int(1.2 * SR)) / SR) * np.exp(-np.arange(int(1.2 * SR)) / SR * 4) * .12, OUTRO * B + .5 + k * .07)
# intro: filtered plucks only (low-pass that opens toward the drop)
cut = int(DROP * B * SR); music[:cut] = filt(music[:cut], 1800)
# sidechain-style pump on music/bass from the kick
duck = np.ones(N)
for b in range(DROP, OUTRO):
    i = int(b * B * SR); n = int(.22 * SR); duck[i:i + n] = np.minimum(duck[i:i + n], .45 + .55 * (np.arange(n) / n) ** .7)
mix = drums * .9 + (music * .8 + sub * .55) * duck + sfx
fade = np.clip((DUR - t) / 1.2, 0, 1); mix *= fade
L = mix + .15 * np.roll(music, 300) * duck * fade; R = mix + .15 * np.roll(music, 450) * duck * fade
st = np.stack([L, R], 1); m = pyln.Meter(SR); st = pyln.normalize.loudness(st, m.integrated_loudness(st), -14)
pk = np.abs(st).max(); lim = 10 ** (-1.2 / 20)
if pk > lim: st = np.tanh(st / lim * .9) * lim / np.tanh(.9 * pk / lim) * (pk / lim) if False else np.clip(st, -lim, lim)
sf.write(sys.argv[1], st.astype(np.float32), SR); print('LUFS', round(m.integrated_loudness(st), 1), 'peak', round(20 * np.log10(np.abs(st).max()), 1))
