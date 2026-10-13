# Fix two VO words without new TTS (Edge TTS was blocked): cut at the quietest point near the word boundary.
import subprocess, numpy as np, soundfile as sf, os, shutil
SR = 48000
def load(p): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout, np.float32).copy()
def dip(x, t, w=.15):
    a, b = int((t-w)*SR), int((t+w)*SR); e = np.convolve(np.abs(x[a:b]), np.ones(480)/480, 'same'); return a + int(np.argmin(e))
def fade(x, n=240, out=True):
    r = np.linspace(1, 0, n) if out else np.linspace(0, 1, n); x = x.copy()
    if out: x[-n:] *= r
    else: x[:n] *= r
    return x
def save(x, p):
    sf.write('/tmp/_s.wav', x, SR); subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/_s.wav','-b:a','192k',p])
nz = lambda x: np.where(np.abs(x) > .01)[0][0]
if __name__ == '__main__':
    os.makedirs('vo_m2', exist_ok=True); os.makedirs('vo_en2', exist_ok=True)
    for i in range(1, 7): shutil.copy(f'vo_m/l{i}.mp3', f'vo_m2/l{i}.mp3')
    # DE: drop the mispronounced "Monatlich kündbar" (it stays on screen), keep "Sichern Sie sich jetzt ..."
    de7 = load('vo_m/l7.mp3'); o = nz(de7)/SR; c = dip(de7, o + 1.52, .2)
    save(fade(de7[c:], 480, out=False), 'vo_m2/l7.mp3')
    # EN: replace the anglicised name with the German "Bau-Kunden" from the German take
    de2 = load('vo_m/l2.mp3'); en2 = load('vo_en/l2.mp3')
    cd = dip(de2, nz(de2)/SR + .74, .1); ce = dip(en2, nz(en2)/SR + .70, .1)
    name = de2[:cd] * 0.95
    save(np.concatenate([fade(name), np.zeros(int(.03*SR), np.float32), fade(en2[ce:], 240, out=False)]), 'vo_en2/l2.mp3')
    for i in (1, 3, 4, 5, 6, 7): shutil.copy(f'vo_en/l{i}.mp3', f'vo_en2/l{i}.mp3')
    print('ok')
