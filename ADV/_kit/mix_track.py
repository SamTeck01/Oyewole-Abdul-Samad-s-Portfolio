"""Synth music bed + SFX cue mix -> one mastered wav.
usage: python3 mix_track.py cues.json out.wav
cues.json: {"dur": sec, "bpm": 120, "key_hz": 55, "cues": [[sec, "sfx_name", gain_db], ...]}
sfx_name resolves to Motion Library/sfx/synth/<name>.wav (or a path)."""
import json, sys, os, numpy as np, soundfile as sf
SR = 48000
LIB = os.path.join(os.path.dirname(__file__), '..', 'sfx', 'synth')
cfg = json.load(open(sys.argv[1])); dur = cfg['dur']; n = int(dur * SR); t = np.arange(n) / SR
bpm = cfg.get('bpm', 120); beat = 60 / bpm; root = cfg.get('key_hz', 55.0)
rng = np.random.default_rng(3)
def env(x, a, d):
    return np.minimum(1, x / a) * np.exp(-np.maximum(0, x - a) / d)
mus = np.zeros((n, 2))
# pad: minor 9 chord, detuned saws through soft lowpass (moving average), slow swell
chords = [[1, 1.189, 1.498, 2.245], [0.891, 1.189, 1.335, 2.0]]
for ci, ch in enumerate(chords):
    seg = (t // (beat * 8)).astype(int) % 2 == ci
    for r in ch:
        for det, pan in [(-0.004, 0.2), (0.004, 0.8)]:
            f = root * 2 * r * (1 + det)
            w = 2 * ((t * f) % 1) - 1
            k = 60; w = np.convolve(w, np.ones(k) / k, 'same')
            mus[:, 0] += w * seg * (1 - pan) * 0.05; mus[:, 1] += w * seg * pan * 0.05
mus *= np.minimum(1, t / 1.5)[:, None]
# kick + hats from bar 2, sidechain duck on pad
duck = np.ones(n); drums = np.zeros(n)
start = cfg.get('drums_from', 2.0)
for b in np.arange(start, dur, beat):
    i = int(b * SR); L = min(int(0.4 * SR), n - i); x = np.arange(L) / SR
    drums[i:i + L] += np.sin(2 * np.pi * (45 + 120 * np.exp(-x * 30)) * x) * np.exp(-x * 9) * 0.9
    duck[i:i + L] *= 1 - 0.6 * np.exp(-x * 7)
    h = int((b + beat / 2) * SR)
    if h < n:
        L2 = min(int(0.05 * SR), n - h); nz = rng.standard_normal(L2); nz = np.diff(nz, prepend=0)
        drums[h:h + L2] += nz * np.exp(-np.arange(L2) / SR * 80) * 0.12
end_fade = np.clip((dur - t) / 1.2, 0, 1)
mus = mus * duck[:, None] + drums[:, None] * 0.55
mus *= end_fade[:, None]
mix = mus * cfg.get('music_gain', 0.8)
for sec, name, db in cfg['cues']:
    p = name if os.path.exists(name) else os.path.join(LIB, name + '.wav')
    a, sr = sf.read(p, always_2d=True)
    if sr != SR:
        idx = np.arange(0, len(a), sr / SR); a = np.stack([np.interp(idx, np.arange(len(a)), a[:, c]) for c in range(a.shape[1])], 1)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    i = int(sec * SR); L = min(len(a), n - i)
    if L > 0: mix[i:i + L] += a[:L] * 10 ** (db / 20)
# master: normalise to ~-14 LUFS (pyloudnorm if present, else RMS), then soft clip
try:
    import pyloudnorm as pyln
    lufs = pyln.Meter(SR).integrated_loudness(mix); mix *= 10 ** ((-16 - lufs) / 20)
except Exception:
    mix *= 0.2 / (np.sqrt(np.mean(mix ** 2)) + 1e-9)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
sf.write(sys.argv[2], mix.astype(np.float32), SR)
print('ok', sys.argv[2], round(dur, 2), 's')
