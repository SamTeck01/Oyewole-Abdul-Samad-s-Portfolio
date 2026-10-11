# German VO track + cues (own timing; the DE film is cut to this track)
import json, os, subprocess, numpy as np, soundfile as sf
os.environ['HF_HUB_OFFLINE'] = '1'
from assemble_gaps import gap
lines = json.load(open('script.json'))
sr = 24000; out = []; t = 0; cues = []
for l in lines:
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'vo_de/{l["id"]}.mp3', '-ar', str(sr), '-ac', '1', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 240):nz[-1] + 1200]
    g = gap.get(l['id'], 0.6); out.append(np.zeros(int(g * sr), np.float32)); t += g
    cues.append({'id': l['id'], 'start': round(t, 3), 'end': round(t + len(a) / sr, 3), 'en': l['en'], 'de': l['de']})
    out.append(a); t += len(a) / sr
out.append(np.zeros(int(4.0 * sr), np.float32)); t += 4.0
vo = np.concatenate(out); sf.write('vo_de_full.wav', vo, sr)
from faster_whisper import WhisperModel
import scipy.signal as ss
m = WhisperModel('small', compute_type='int8')
segs, _ = m.transcribe(ss.resample_poly(vo, 2, 3).astype(np.float32), language='de', word_timestamps=True)
words = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in s.words]
# align script tokens to whisper words per line
en = {l['id']: l for l in json.load(open('../remotion/src/cues.json'))['lines']}
res = []
for L in cues:
    ws = [w for w in words if L['start'] - 0.3 <= w['s'] < L['end'] - 0.05]
    toks = L['de'].split(); dur = L['end'] - L['start']
    if len(ws) == len(toks):
        dw = [{'t': tk, 's': w['s']} for tk, w in zip(toks, ws)]
    else:
        print('fallback', L['id'], len(ws), len(toks))
        tot = sum(len(x) + 1 for x in toks); acc = 0; dw = []
        for tk in toks: dw.append({'t': tk, 's': round(L['start'] + dur * 0.95 * acc / tot, 3)}); acc += len(tk) + 1
    res.append({**L, 'words': en[L['id']]['words'], 'dewords': dw})
json.dump({'total': round(t, 3), 'lines': res}, open('../remotion/src/cues_de.json', 'w'), indent=1)
print('total', round(t, 2), ' '.join(w['w'] for w in words)[:3000])
