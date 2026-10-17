# Build one language: trim + place VO lines, word timings (faster-whisper, mapped onto the script words), dark ambient
# music + stamp/whoosh SFX, smooth ducking, -14 LUFS. Writes ../../remotion/public/reel_mix_<lang>.wav and
# ../../remotion/src/reel_cues_<lang>.json.  usage: python build.py de|en
import sys, json, subprocess, re, numpy as np, soundfile as sf, pyloudnorm as pyln, librosa
from scipy.signal import butter, sosfilt
from faster_whisper import WhisperModel
LANG = sys.argv[1]; SR = 48000; LEAD = 0.6; GAP = 0.42; TAIL = 3.2
PITCH = {'de': 0.873, 'en': 1.0}[LANG]   # DE clone came out high; match the approved Florian pitch
def load(p):
    af = ['-af', f'rubberband=pitch={PITCH}:formant=preserved'] if PITCH != 1 else []
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
    out += [x, np.zeros(int(GAP * SR), np.float32)]; t += dur + GAP
total = t + TAIL; N = int(total * SR); vo = np.concatenate(out); vo = np.pad(vo, (0, N - len(vo)))[:N]
json.dump({'total': round(total, 3), 'lines': cues}, open(f'../../remotion/src/reel_cues_{LANG}.json', 'w'), indent=1, ensure_ascii=False)
# ---- music: dark warm pad + soft pulse (90 BPM), opens up at the solution (l5)
rng = np.random.default_rng(5); tt = np.arange(N) / SR; f = lambda m: 440 * 2 ** ((m - 69) / 12)
filt = lambda x, fr, k='low': sosfilt(butter(2, fr, k, fs=SR, output='sos'), x)
B = 60 / 90; pad = np.zeros(N); pulse = np.zeros(N); sfx = np.zeros(N)
sol = next(c['start'] for c in cues if c['id'] == 'l5')
prog = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62], [40, 47, 52, 55, 59]]  # Am F G Em
bar = 4 * B
def add(buf, s, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(s))
    if 0 <= i < N: buf[i:j] += g * s[:j - i]
for k in range(int(total / bar) + 1):
    ch = prog[k % 4] if k * bar >= sol else prog[0 if k % 2 == 0 else 3]
    n = int((bar + 1) * SR); x = np.arange(n) / SR; e = np.minimum(1, x / 1.2) * np.clip((bar + 1 - x) / 1.0, 0, 1)
    add(pad, e * sum(np.sin(2 * np.pi * f(m + 12) * x * (1 + d)) for m in ch[1:] for d in (-.0015, .0015)) * .06, k * bar)
    add(pad, e * np.sin(2 * np.pi * f(ch[0] - 12) * x) * .18, k * bar)
for b in range(int(total / B)):
    at = b * B; n = int(.35 * SR); x = np.arange(n) / SR
    add(pulse, np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-x * 30)) / SR) * np.exp(-x * 9) * (.55 if at >= sol else .3), at)
    if at >= sol: add(pulse, filt(rng.standard_normal(int(.04 * SR)), 7000, 'high') * .06, at + B / 2)
music = filt(pad, 2500) + pulse
music *= np.minimum(1, tt / 1.5) * np.clip((total - tt) / 2.5, 0, 1)
for c in cues[1:]:
    n = int(.4 * SR); x = np.arange(n) / SR
    add(sfx, filt(rng.standard_normal(n), [600, 5000], 'band') * np.sin(np.pi * x / .4) ** 2 * .05, c['start'] - .45)
# stamp thuds where the stamps land (word anchors used in Reel.tsx)
def wstart(lid, i): w = next(c for c in cues if c['id'] == lid)['words']; return w[max(0, min(i, len(w) - 1))]['s']
for at in (wstart('l3', 2), wstart('l8', len(next(c for c in cues if c['id'] == 'l8')['words']) - 3), wstart('l9', 2) + .07):
    n = int(.5 * SR); x = np.arange(n) / SR
    add(sfx, (np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-x * 25)) / SR) * np.exp(-x * 10) + filt(rng.standard_normal(n), 2500) * np.exp(-x * 30) * .6) * .5, at)
# smooth held ducking per VO line
duck = np.zeros(N)
for c in cues: duck[int(max(0, c['start'] - .15) * SR):int((c['end'] + .5) * SR)] = 1
k = int(.6 * SR); duck = np.convolve(duck, np.hanning(k) / np.hanning(k).sum(), 'same')
mix = vo + sfx + music * .32 * 10 ** (-9 * duck / 20)
st = np.stack([mix, mix], 1); m = pyln.Meter(SR); st = pyln.normalize.loudness(st, m.integrated_loudness(st), -14)
lim = 10 ** (-1.5 / 20); st = np.clip(st, -lim, lim)
sf.write(f'../../remotion/public/reel_mix_{LANG}.wav', st.astype(np.float32), SR); print('total', round(total, 2), 'LUFS', round(m.integrated_loudness(st), 1))
