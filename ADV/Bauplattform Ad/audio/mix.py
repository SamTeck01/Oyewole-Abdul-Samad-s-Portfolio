# SFX (made in code) + mix + master for EN (with VO) and DE (music + SFX, German on-screen text).
import json, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
import pyloudnorm as pyln

SR = 48000
c = json.load(open('../remotion/src/cues.json'))
L = {l['id']: l for l in c['lines']}
TOTAL = c['total'] + 2.4
N = int(TOTAL * SR)
rng = np.random.default_rng(3)

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)

def tick(gain=0.05):
    n = int(0.03 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 260) * gain
def whoosh(dur=0.45, gain=0.12, up=True):
    n = int(dur * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    env = np.sin(np.pi * t / dur) ** 2
    s = np.zeros(n)
    for k in range(8):  # sweeping band
        a, b = k * n // 8, (k + 1) * n // 8
        f = 400 + (k / 7 if up else 1 - k / 7) * 3000
        s[a:b] = bp(noise[a:b], f * 0.7, f * 1.3)
    return lp(s, 6000) * env * gain
def hit(gain=0.35):
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 42 + 50 * np.exp(-t * 18)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5) + lp(rng.standard_normal(n), 300) * np.exp(-t * 12) * 0.3) * gain
def pop(gain=0.08, f=900):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (f + 600 * np.exp(-t * 40)) * t) * np.exp(-t * 45) * gain
def chime(gain=0.18):
    n = int(2.6 * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a for f, d, a in [(1174.7, 1.6, 1), (1568, 2.0, .6), (2349.3, 2.6, .35), (587.3, 1.2, .5)])
    return s * np.minimum(1, t / .003) * gain

sfx = np.zeros(N)
def put(s, at):
    i = int(at * SR)
    if i < 0 or i >= N: return
    j = min(N, i + len(s)); sfx[i:j] += s[:j - i]

# soft tick on every word (vaylens: words land with a tiny click)
for l in c['lines']:
    for w in l['words']:
        put(tick(0.035), w['s'])
# whoosh into each scene cut (same cut list as Film.tsx)
s_ = lambda i, d=0.4: L[i]['start'] - d
cuts = [s_('l02', .5), s_('l03', .25), s_('l04', .15), s_('l05', .2), L['l05']['end'] + 1.8, s_('l06', .3), s_('l08'), s_('l10', .3), s_('l11', .3), s_('l12', .3), s_('l13'), s_('l14'), s_('l16'), s_('l17'), s_('l18'), s_('l19'), s_('l20'), s_('l23'), s_('l25'), s_('l26', .3), s_('l27', .3), s_('l28'), s_('l30', .6)]
for k, t in enumerate(cuts):
    put(whoosh(0.5, 0.10, up=k % 2 == 0), t - 0.3)
# montage beats
m0 = L['l05']['end'] + 1.8; md = (L['l06']['start'] - 0.3) - m0
for k in range(3): put(hit(0.12), m0 + k * md / 3)
# giant words
put(hit(0.32), L['l04']['start']); put(hit(0.32), L['l29']['start'] - 0.05)
put(whoosh(0.7, 0.14), L['l04']['end'] + 0.25)
# logo chimes
put(chime(0.16), L['l05']['words'][-1]['s'] - 0.05); put(chime(0.2), L['l30']['start'] - 0.3)
# approval tap, flags, payments
put(pop(0.14, 700), L['l17']['end'] - 0.3); put(chime(0.07), L['l17']['end'] - 0.25)
for k in range(3): put(pop(0.08, 500 + k * 120), L['l15']['start'] + 0.2 + k * 0.35)
put(pop(0.1, 420), L['l23']['start'] + 2.0)
for k in range(4): put(pop(0.1, 600 + k * 150), L['l26']['words'][-4 + k]['s'])
# end card
put(pop(0.08, 800), c['total'] + 0.2)

music, msr = sf.read('music.wav', dtype='float32')
music = music.mean(1)
music = np.pad(music, (0, max(0, N - len(music))))[:N]

def master(x, target=-14.0):
    meter = pyln.Meter(SR)
    lo = meter.integrated_loudness(x)
    y = pyln.normalize.loudness(x, lo, target)
    peak = np.max(np.abs(y))
    lim = 10 ** (-1.2 / 20)
    if peak > lim:  # soft clip only the rare peaks
        y = np.where(np.abs(y) > lim * 0.9, np.sign(y) * (lim * 0.9 + (np.abs(y) - lim * 0.9) / (1 + (np.abs(y) - lim * 0.9) / (lim * 0.1))), y)
    return y, meter.integrated_loudness(y)

for lang in ('en', 'de'):
    if lang == 'en':
        vo, vsr = sf.read('vo_af_heart_full.wav', dtype='float32')
        vo = resample_poly(vo, SR, vsr).astype(np.float32)
        vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
        env = np.abs(vo)
        k = int(0.25 * SR)
        env = np.convolve(env, np.ones(k) / k, 'same')
        active = np.clip(env / 0.02, 0, 1)
        duck = 10 ** ((-17 * active) / 20)
        mus = music * 0.55 * duck
        mix = vo * 1.0 + mus + sfx * 0.9
    else:
        mix = music * 0.75 + sfx * 0.9
    y, lufs = master(mix)
    st = np.stack([y, y], 1)
    sf.write(f'../remotion/public/mix_{lang}.wav', st.astype(np.float32), SR)
    sf.write(f'stems_{lang}_sfx.wav', sfx.astype(np.float32), SR)
    print(lang, 'LUFS', round(lufs, 2), 'peak dB', round(20 * np.log10(np.max(np.abs(y))), 2))
