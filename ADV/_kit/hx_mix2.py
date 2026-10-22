# Haixing kinetic mix: voice (offset A) over ducked music + SFX cues timed to words. -> public/audio/hx_mix2.wav
import json,subprocess
A=0.5; W=[w['start']+A for w in json.load(open('src/demos/hx.words.json'))]
D=W[-1]+3.6
s2,s3,s4,s5,s6=W[8]-0.2,W[21]-0.4,W[34]-0.3,W[65]-0.6,W[83]-0.5
nodes=[W[37],W[42],W[44],W[50],W[60]]
C=[('spark',0.15,0.5),('metal',W[7],0.9),('impact',W[5],0.45)]
C+=[('whoosh',x-0.12,0.7) for x in (s2,s3,s4,s5,s6)]
C+=[('impact',W[9],0.7),('impact',W[21],0.8),('tick',W[20],0.5)]
C+=[('whoosh',W[i]-0.15,0.35) for i in (27,29,32)]
C+=[('tick',n-0.05,0.45) for n in nodes[1:]]
C+=[('riser',W[60]-0.4,0.6),('metal',W[64]+0.1,0.8)]
C+=[('whoosh',W[i]-0.15,0.4) for i in (65,66,67,68)]
C+=[('impact',W[83],0.9),('impact',W[91],0.6)]
ins=['-i','vo/hx_v2.mp3','-i','vo/hx_music2.mp3']; fl=[]
for j,(n,t,v) in enumerate(C):
    v=v*0.5
    ins+=['-i',f'vo/hxsfx/{n}.mp3']; ms=int(max(0,t)*1000)
    fl.append(f'[{j+2}:a]volume={v},adelay={ms}|{ms}[s{j}]')
fl.append(f'[0:a]aresample=48000,highpass=f=75,equalizer=f=160:t=q:w=1:g=2.5,equalizer=f=350:t=q:w=1.5:g=-2,equalizer=f=3200:t=q:w=1.2:g=3.5,highshelf=f=9000:g=3,deesser=i=0.3,acompressor=threshold=0.08:ratio=3:attack=4:release=90:makeup=2,volume=1.8,adelay={int(A*1000)}|{int(A*1000)},apad,asplit[v][vk]')
fl.append(f'[1:a]volume=0.12,afade=t=out:st={D-2.2}:d=2.2[m]')
fl.append('[m][vk]sidechaincompress=threshold=0.02:ratio=10:attack=10:release=400[md]')
fl.append(f"[v][md]{''.join(f'[s{j}]' for j in range(len(C)))}amix=inputs={len(C)+2}:normalize=0,atrim=0:{D},loudnorm=I=-14:TP=-1.5:LRA=9[o]")
subprocess.run(['ffmpeg','-loglevel','error','-y',*ins,'-filter_complex',';'.join(fl),'-map','[o]','-ar','48000','public/audio/hx_mix2.wav'],check=True)
print('dur',D)
