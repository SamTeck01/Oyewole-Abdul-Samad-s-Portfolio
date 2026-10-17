# Build one language: trim + place VO lines, word timings (faster-whisper, mapped onto the script words), dark ambient
# music + stamp/whoosh SFX, smooth ducking, -14 LUFS. Writes ../../remotion/public/reel_mix_<lang>.wav and
# ../../remotion/src/reel_cues_<lang>.json.  usage: python build.py de|en
import sys, json, subprocess, re, numpy as np, soundfile as sf, pyloudnorm as pyln, librosa
from scipy.signal import butter, sosfilt
from faster_whisper import WhisperModel
LANG = sys.argv[1]; SR = 48000; LEAD = 0.15; GAP = 0.18; TAIL = 2.6
PITCH = 1.0  # Edge voices need no pitch fix (the old DE clone used 0.873)
def load(p):
    af = ['-af', 'atempo=1.10']  # the human-reference clone speaks calmly; 10 % faster keeps the reel tight
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, *af, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    nz = np.where(np.abs(x) > 0.01)[0]; return x[max(0, nz[0] - 480): nz[-1] + 2400].copy()
wm = WhisperModel('small', compute_type='int8')
lines = json.load(open('script.json')); out = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; cues = []
for l in lines:
    x = load(f'vo_{LANG}/{l["id"]}.wav'); dur = len(x) / SR
    ws = [w for s in wm.transcribe(librosa.resample(x, orig_sr=SR, target_sr=16000), language=LANG, word_timestamps=True)[0] for w in s.words]
    words = l.get(LANG + '_cap', l[LANG]).split()
    if len(ws) == len(words): tm = [(w.start, w.end) for w in ws]
    else:  # spread by character length over the spoken span
        a, b = (ws[0].start, ws[-1].end) if ws else (0, dur); L = [len(w) + 2 for w in words]; c = np.cumsum([0] + L) / sum(L)
        tm = [(a + (b - a) * c[i], a + (b - a) * c[i + 1]) for i in range(len(words))]
    cues.append({'id': l['id'], 'start': round(t, 3), 'end': round(t + dur, 3), 'words': [{'w': w, 's': round(t + s, 3), 'e': round(t + e, 3)} for w, (s, e) in zip(words, tm)]})
    print(l['id'], len(ws), len(words), ' '.join(w.word.strip() for w in ws))
    g = {'l2': .45, 'l8': .35}.get(l['id'], GAP)  # breathe before the turn to the solution and before the close
    out += [x, np.zeros(int(g * SR), np.float32)]; t += dur + g
total = t + TAIL; N = int(total * SR); vo = np.concatenate(out); vo = np.pad(vo, (0, N - len(vo)))[:N]
json.dump({'total': round(total, 3), 'lines': cues}, open(f'../../remotion/src/reel_cues_{LANG}.json', 'w'), indent=1, ensure_ascii=False)
# ---- music: punchy 124 BPM track made in code: impact + kick on the open, drop on the solution (l5), hits on every cut
rng = np.random.default_rng(5); tt = np.arange(N) / SR; f = lambda m: 440 * 2 ** ((m - 69) / 12)
filt = lambda x, fr, k='low': sosfilt(butter(2, fr, k, fs=SR, output='sos'), x)
def add(buf, s, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(s))
    if 0 <= i < N: buf[i:j] += g * s[:j - i]
B = 60 / 124; drums = np.zeros(N); bass = np.zeros(N); stab = np.zeros(N); sfx = np.zeros(N)
sol = next(c['start'] for c in cues if c['id'] == 'l3')
def kick():
    n = int(.4 * SR); x = np.arange(n) / SR; fr = 46 + 120 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x * 8)
def clap():
    n = int(.25 * SR); x = np.arange(n) / SR; return filt(rng.standard_normal(n), [1000, 6000], 'band') * (np.exp(-x * 25) + .4 * np.exp(-x * 8)) * .7
def hat(): n = int(.05 * SR); return filt(rng.standard_normal(n), 8000, 'high') * np.exp(-np.arange(n) / SR * 70) * .3
roots = [45, 45, 41, 43]  # A A F G
for b in range(int(total / B)):
    at = b * B; full = at >= sol - 0.02; bar = (b // 4) % 4
    if full or b % 2 == 0: add(drums, kick(), at, .9 if full else .7)
    if b % 2 == 1: add(drums, clap(), at, .55 if full else .3)
    add(drums, hat(), at + B / 2, 1 if full else .5)
    if full: add(drums, hat(), at + B / 4, .45); add(drums, hat(), at + 3 * B / 4, .45)
    r = roots[bar]; n = int(B / 2 * .9 * SR); x = np.arange(n) / SR
    for o in (0, .5):
        add(bass, filt(np.sign(np.sin(2 * np.pi * f(r - 12) * x)) * np.minimum(1, x / .004) * np.exp(-x * 5), 380 if full else 220), at + o * B, .55)
    if b % 4 == 0 and full:
        n = int(.5 * SR); x = np.arange(n) / SR
        add(stab, sum(np.sign(np.sin(2 * np.pi * f(m) * x)) for m in (r + 12, r + 19, r + 24)) / 3 * np.exp(-x * 7), at, .25)
# riser into the drop, impacts on every line start
n = int(2 * SR); x = np.arange(n) / SR
add(sfx, filt(rng.standard_normal(n), 2500, 'high') * (x / x[-1]) ** 2.5 * .22, sol - 2)
for c in cues:
    n = int(1.0 * SR); x = np.arange(n) / SR; big = c['id'] in ('l1', 'l3', 'l7', 'l9')
    add(sfx, (np.sin(2 * np.pi * np.cumsum(40 + 90 * np.exp(-x * 14)) / SR) * np.exp(-x * (3 if big else 6)) + filt(rng.standard_normal(n), 3000) * np.exp(-x * 18) * .5) * (.42 if big else .24), c['start'] - .08)
    n = int(.3 * SR); x = np.arange(n) / SR
    add(sfx, filt(rng.standard_normal(n), [700, 6000], 'band') * np.sin(np.pi * x / .3) ** 2 * .08, c['start'] - .3)
music = drums + bass + filt(stab, 4000)
music *= np.clip((total - tt) / 1.5, 0, 1)
# smooth held ducking per VO line
duck = np.zeros(N)
for c in cues: duck[int(max(0, c['start'] - .15) * SR):int((c['end'] + .5) * SR)] = 1
k = int(.6 * SR); duck = np.convolve(duck, np.hanning(k) / np.hanning(k).sum(), 'same')
mix = vo + sfx + music * .30 * 10 ** (-7 * duck / 20)
st = np.stack([mix, mix], 1); m = pyln.Meter(SR); st = pyln.normalize.loudness(st, m.integrated_loudness(st), -14)
lim = 10 ** (-1.5 / 20); st = np.clip(st, -lim, lim)
sf.write(f'../../remotion/public/reel_mix_{LANG}.wav', st.astype(np.float32), SR); print('total', round(total, 2), 'LUFS', round(m.integrated_loudness(st), 1))
