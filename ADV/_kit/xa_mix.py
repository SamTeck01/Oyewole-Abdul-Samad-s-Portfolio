"""Speed-ramped Excel mix: python3 xa_mix.py pass|desk out.wav  (visual timeline / K)"""
import subprocess, sys
import os
K = float(os.environ.get('K', 1.2))
which, out = sys.argv[1], sys.argv[2]
if which == 'pass':
    vo, music, dur = 'vo/xp_sarah.mp3', 'vo/xa2_music.mp3', 44
    segs = [(0,1.85,0.6),(2.0,4.68,3.0),(4.72,6.8,6.1),(6.88,8.55,9.6),(8.68,11.1,11.4),(11.3,13.5,14.6),(13.5,16.7,17.6),(16.83,20.75,21.6),(20.9,24.0,25.6),(24.1,26.0,29.6),(26.12,29.4,33.6)]
    extra = [('vo/xa_webend.mp3', 37.0)]
    cuts = [3.0,6.1,8.6,11.4,14.4,17.4,21.4,25.4,29.2,33.4]
    hits = [0.6,1.38,8.6,31.8]; riser = 7.0; spark = [31.8]; mdelay = 0
else:
    vo, music, dur = 'vo/xd_sarah.mp3', 'vo/xe_music.mp3', 39.8
    segs = [(0,3.95,0.3),(4.0,5.95,4.3),(6.0,7.85,6.6),(7.9,9.3,9.0),(9.3,10.95,11.0),(11.0,13.05,14.0),(13.1,14.2,17.4),(14.2,16.3,19.6),(16.35,18.8,22.5),(18.85,19.98,25.7),(20.0,22.7,30.0)]
    extra = [('vo/xa_webend.mp3', 33.4)]
    cuts = [6.6,9.0,11.0,17.4,19.6,22.5,25.7,29.6]
    hits = [4.0,4.35,4.7,13.9,27.4]; riser = 12.4; spark = [27.4]; mdelay = 1.0
D = dur / K
ins = ['-i', vo, '-i', music]
fc = []; lab = []
for i, (a, b, d) in enumerate(segs):
    ms = int(d / K * 1000)
    fc.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b-a-0.06}:d=0.06,adelay={ms}|{ms}[v{i}]"); lab.append(f"[v{i}]")
n = 2
for path, d in extra:
    ins += ['-i', path]; ms = int(d / K * 1000)
    fc.append(f"[{n}:a]adelay={ms}|{ms}[e{n}]"); lab.append(f"[e{n}]"); n += 1
fc.append("".join(lab) + f"amix=inputs={len(lab)}:normalize=0,apad=whole_dur={D},highpass=f=90,equalizer=f=220:t=q:w=1:g=1.5,equalizer=f=400:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1:g=3,highshelf=f=10000:g=2.5,deesser,acompressor=threshold=0.1:ratio=3:attack=5:release=80,volume=1.8,asplit[vo][sc]")
fc.append(f"[1:a]atempo={K},adelay={int(mdelay/K*1000)}|{int(mdelay/K*1000)},atrim=0:{D},afade=t=out:st={D-1.2}:d=1.2,volume=0.13[m]")
sfx = [] if os.environ.get('NOSFX') else [('whoosh', c - 0.12, 0.45) for c in cuts] + [('impact', h, 0.5) for h in hits] + [('riser', riser, 0.35)] + [('spark', x, 0.4) for x in spark]
sl = []
for j, (name, t, v) in enumerate(sfx):
    ins += ['-i', f'vo/hxsfx/{name}.mp3']; ms = max(0, int(t / K * 1000))
    fc.append(f"[{n}:a]volume={v},adelay={ms}|{ms}[s{j}]"); sl.append(f"[s{j}]"); n += 1
if sl:
    fc.append("".join(sl) + f"amix=inputs={len(sl)}:normalize=0[sfx]")
    fc.append("[m][sfx]amix=inputs=2:normalize=0[bed]")
else:
    fc.append("[m]anull[bed]")
fc.append("[bed][sc]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=250[md]")
fc.append("[vo][md]amix=inputs=2:normalize=0,atrim=0:" + str(D) + "[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", ";".join(fc), "-map", "[out]", "-ar", "48000", "/tmp/claude-0/mixpre.wav"], check=True)
o = subprocess.run(["ffmpeg", "-i", "/tmp/claude-0/mixpre.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float([l for l in o.splitlines() if l.strip().startswith("I:")][-1].split()[1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/claude-0/mixpre.wav", "-af", f"volume={-14-I}dB,alimiter=limit=0.95", out], check=True)
print(which, round(D, 2), "s", I)
