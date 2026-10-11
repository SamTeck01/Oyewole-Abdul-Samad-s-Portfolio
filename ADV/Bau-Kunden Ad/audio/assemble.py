# Trim each VO line, place with gaps, write vo.wav + cues.json for Remotion.
import subprocess, json, numpy as np, soundfile as sf, sys
V = sys.argv[1] if len(sys.argv) > 1 else 'vo_m'; SUF = sys.argv[2] if len(sys.argv) > 2 else ''
SR = 48000; LEAD = 0.5; GAP = 0.45
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); nz = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, nz[0]-480): nz[-1]+2400]
lines = json.load(open('script.json')); out = [np.zeros(int(LEAD*SR))]; t = LEAD; cues = []
for l in lines:
    x = load(f"{V}/{l['id']}.mp3"); cues.append({'id': l['id'], 'start': round(t,3), 'end': round(t+len(x)/SR,3)})
    out += [x, np.zeros(int(GAP*SR))]; t += len(x)/SR + GAP
total = t + 2.4
vo = np.concatenate(out); vo = np.pad(vo, (0, int(total*SR)-len(vo)))
sf.write(f'vo{SUF}.wav', vo, SR); json.dump({'total': round(total,3), 'lines': cues}, open(f'../remotion/src/cues{SUF}.json','w'), indent=1)
print(total)
