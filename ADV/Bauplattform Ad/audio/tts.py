import json,sys,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
k=Kokoro('/root/kokoro/kokoro-v1.0.onnx','/root/kokoro/voices-v1.0.bin')
voice=sys.argv[1]; speed=float(sys.argv[2]) if len(sys.argv)>2 else 0.95
lines=json.load(open('script.json'))
for l in lines:
    text=l['en'].replace('Baucheck24','Bough-check twenty-four').replace('CO2','C O two').replace('DATEV','Dah-tef')
    s,sr=k.create(text,voice=voice,speed=speed,lang='en-us')
    sf.write(f'vo/{voice}_{l["id"]}.wav',s,sr)
    print(l['id'],round(len(s)/sr,2),flush=True)
