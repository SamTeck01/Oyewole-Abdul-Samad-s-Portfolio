import json,soundfile as sf,numpy as np,os,subprocess
os.environ['HF_HUB_OFFLINE']='1'
V='en'  # Edge neural voice (vo_en/*.mp3)
gap={'l01':1.2,'l03':0.5,'l04':0.35,'l05':1.0,'l06':5.6,'l08':1.3,'l10':0.9,'l11':0.9,'l13':1.5,'l14':1.1,'l15':0.6,'l16':1.1,'l17':0.9,'l18':1.1,'l19':0.7,'l20':1.3,'l21':0.7,'l22':0.7,'l22t':1.1,'l23':1.3,'l24':0.8,'l25':1.4,'l26':1.5,'l27':0.9,'l28':1.4,'l29':0.6,'l30':1.8}
lines=json.load(open('script.json'))
sr=24000;out=[];t=0;cues=[]
for l in lines:
    a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f'vo_en/{l["id"]}.mp3','-ar',str(sr),'-ac','1','-f','f32le','-'],capture_output=True).stdout,np.float32)
    # trim silence
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+1200]
    g=gap.get(l['id'],0.6); out.append(np.zeros(int(g*sr),np.float32)); t+=g
    cues.append({'id':l['id'],'start':round(t,3),'end':round(t+len(a)/sr,3),'en':l['en'],'de':l['de']})
    out.append(a); t+=len(a)/sr
out.append(np.zeros(int(4.0*sr),np.float32)); t+=4.0
vo=np.concatenate(out); sf.write('vo_en_full.wav',vo,sr)
from faster_whisper import WhisperModel
m=WhisperModel('small',compute_type='int8')
import scipy.signal as ss
a16=ss.resample_poly(vo,2,3).astype(np.float32)
segs,_=m.transcribe(a16,language='en',word_timestamps=True)
words=[{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for s in segs for w in s.words]
json.dump({'total':round(t,3),'lines':cues,'words':words},open('cues_en.json','w'),indent=1)
print('total',round(t,2),'words',len(words))
