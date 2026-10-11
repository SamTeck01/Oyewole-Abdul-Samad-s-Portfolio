import sys,json,soundfile as sf,numpy as np,os
os.environ['HF_HUB_OFFLINE']='1'
from faster_whisper import WhisperModel
m=WhisperModel('small',compute_type='int8')
for f in sys.argv[1:]:
    a,sr=sf.read(f,dtype='float32')
    if sr!=16000:
        import scipy.signal as ss; a=ss.resample_poly(a,16000,sr)
    s,_=m.transcribe(a.astype(np.float32),language='en')
    print(os.path.basename(f),'|',' '.join(x.text for x in s))
