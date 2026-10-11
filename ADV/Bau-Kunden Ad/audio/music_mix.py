# Calm original music (pad + soft piano + sub) made in code, then VO mix with ducking, mastered to -14 LUFS.
import json, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import butter, sosfilt
SR = 48000; c = json.load(open('../remotion/src/cues.json')); DUR = c['total']; N = int(DUR*SR); t = np.arange(N)/SR
rng = np.random.default_rng(7); lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
midi = lambda m: 440*2**((m-69)/12); BAR = 4*60/96
prog = [[48,55,60,64,67],[45,52,57,60,64],[41,48,53,57,60],[43,50,55,59,62]]  # C  Am  F  G
pad = np.zeros(N); pno = np.zeros(N); sub = np.zeros(N)
def piano(f, d, v):
    n = int(d*SR); tt = np.arange(n)/SR
    return v*np.minimum(1, tt/.004)*sum((1/k**1.6)*np.sin(2*np.pi*f*k*tt+k)*np.exp(-tt*(1.2+k*.9)) for k in range(1,7))
def add(buf, s, at):
    i = int(at*SR); j = min(N, i+len(s))
    if i < N: buf[i:j] += s[:j-i]
for b in range(int(DUR/BAR)+1):
    ch = prog[b % 4]; t0 = b*BAR; n = int((BAR+.8)*SR); tt = np.arange(n)/SR
    env = np.minimum(1, tt/.9)*np.clip((BAR+.8-tt)/.8, 0, 1)
    add(pad, env*sum((2*((midi(m+12)*(1+d/100)*tt+rng.random()) % 1)-1)*.05 for m in ch[1:] for d in (-.08,.08)), t0)
    for k, m in enumerate(ch[2:]): add(pno, piano(midi(m+12), 3, .16), t0+k*.03)
    add(pno, piano(midi(ch[3]+24), 2, .06), t0+BAR/2)
    if t0 > 4.5: add(sub, np.sin(2*np.pi*midi(ch[0]-12)*tt)*env*.25, t0)
music = lp(pad, 1300)*.55 + lp(pno, 5000)*.9 + sub*.5
music *= np.minimum(1, t/1.2)*np.clip((DUR-t)/2.2, 0, 1)**.7; music /= np.abs(music).max()
vo, _ = sf.read('vo.wav', dtype='float32'); vo = np.pad(vo, (0, max(0, N-len(vo))))[:N]
k = int(.25*SR); env = np.convolve(np.abs(vo), np.ones(k)/k, 'same')
mix = vo + music*.35*10**((-15*np.clip(env/.02, 0, 1))/20)
m = pyln.Meter(SR); y = pyln.normalize.loudness(mix, m.integrated_loudness(mix), -17)
y = np.clip(y, -.89, .89); sf.write('../remotion/public/mix.wav', np.stack([y, y], 1).astype(np.float32), SR)
print('LUFS(mono)', round(m.integrated_loudness(y), 2))
