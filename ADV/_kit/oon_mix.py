"""Oonava mix: python3 oon_mix.py vo.mp3 music.mp3 dur out.wav 'cuts' 'hits' riser 'sparks'"""
import sys, subprocess, re
vo, mus, D, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
L = lambda s: [float(x) for x in s.split(',') if x]
cuts, hits, riser, sparks = L(sys.argv[5]), L(sys.argv[6]), float(sys.argv[7]), L(sys.argv[8])
ins = ['-i', vo, '-i', mus]; fc = []
fc.append("[0:a]adelay=300|300,apad=whole_dur=%s,highpass=f=90,equalizer=f=220:t=q:w=1:g=1.5,equalizer=f=400:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1:g=3,highshelf=f=10000:g=2.5,deesser,acompressor=threshold=0.1:ratio=3:attack=5:release=80,volume=1.8,asplit[vo][sc]" % D)
fc.append(f"[1:a]atrim=0:{D},afade=t=out:st={D-1.5}:d=1.5,volume=0.15[m]")
sfx = [('whoosh', c - 0.12, 0.4) for c in cuts] + [('impact', h, 0.5) for h in hits] + [('riser', riser, 0.35)] + [('spark', x, 0.35) for x in sparks]
sl = []; n = 2
for j, (nm, t, v) in enumerate(sfx):
    ins += ['-i', f'vo/hxsfx/{nm}.mp3']; ms = max(0, int(t * 1000))
    fc.append(f"[{n}:a]volume={v},adelay={ms}|{ms}[s{j}]"); sl.append(f"[s{j}]"); n += 1
fc.append("".join(sl) + f"amix=inputs={len(sl)}:normalize=0[sfx]")
fc.append("[m][sfx]amix=inputs=2:normalize=0[bed]")
fc.append("[bed][sc]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=250[md]")
fc.append(f"[vo][md]amix=inputs=2:normalize=0,atrim=0:{D}[out]")
pre = '/tmp/claude-0/oonpre.wav'
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", ";".join(fc), "-map", "[out]", "-ar", "48000", pre], check=True)
o = subprocess.run(["ffmpeg", "-i", pre, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", pre, "-af", f"volume={-14-I}dB,alimiter=limit=0.89", out], check=True)
print("mixed", I)
