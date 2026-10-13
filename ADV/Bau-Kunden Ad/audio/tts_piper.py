# Offline Piper TTS (used when Edge TTS is blocked). usage: python3 tts_piper.py <model.onnx> <outdir> de|en
import json, sys, os, wave
from piper import PiperVoice
v = PiperVoice.load(sys.argv[1]); d = sys.argv[2]; lang = sys.argv[3]; os.makedirs(d, exist_ok=True)
for l in json.load(open('script.json')):
    with wave.open(f"{d}/{l['id']}.wav", 'wb') as w: v.synthesize_wav(l.get(lang + '_say', l[lang]), w)
