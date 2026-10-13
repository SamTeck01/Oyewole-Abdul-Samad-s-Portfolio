# Silence one VO line in place (keeps timing). Used when the line's wording is outdated and TTS is unavailable.
import sys, json, numpy as np, soundfile as sf
SUF, LID = sys.argv[1], sys.argv[2]
c = json.load(open(f'../remotion/src/cues{SUF}.json')); l = next(x for x in c['lines'] if x['id'] == LID)
vo, sr = sf.read(f'vo{SUF}.wav', dtype='float32'); a, b = int((l['start']-.05)*sr), int((l['end']+.05)*sr)
vo[a:b] = 0; sf.write(f'vo{SUF}.wav', vo, sr)
