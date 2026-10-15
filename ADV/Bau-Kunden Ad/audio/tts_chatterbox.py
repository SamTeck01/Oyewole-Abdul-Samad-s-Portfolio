# Chatterbox multilingual: clone the approved Florian take (vo_f) and speak the EN script; N takes per line,
# keep the take whose faster-whisper transcript best matches the text (stray trailing words get trimmed by word timestamps).
# usage: python tts_chatterbox.py ref.wav outdir [takes]
import sys, os, json, re, difflib, perth, torch, numpy as np, soundfile as sf
perth.PerthImplicitWatermarker = perth.DummyWatermarker
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel
ref, d = sys.argv[1], sys.argv[2]; N = int(sys.argv[3]) if len(sys.argv) > 3 else 3; os.makedirs(d, exist_ok=True)
m = ChatterboxMultilingualTTS.from_pretrained(device='cpu'); w = WhisperModel('small', compute_type='int8')
norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower().replace('-', ' '))
for l in json.load(open('script.json')):
    text = l.get('en_say', l['en']); best = None
    for k in range(N):
        torch.manual_seed(k); x = m.generate(text, language_id='en', audio_prompt_path=ref).squeeze().numpy()
        import librosa; a = librosa.resample(x, orig_sr=m.sr, target_sr=16000)
        words = [z for s in w.transcribe(a, language='en', word_timestamps=True)[0] for z in s.words]
        # cut after the word that completes the line
        target = norm(text).split(); hyp = [norm(z.word).strip() for z in words]; end = len(words)
        for i in range(len(words)):
            if difflib.SequenceMatcher(None, ' '.join(hyp[:i+1]), ' '.join(target)).ratio() > .9 and hyp[i] == target[-1]: end = i + 1; break
        score = difflib.SequenceMatcher(None, ' '.join(hyp[:end]), ' '.join(target)).ratio()
        cut = int(min(len(x)/m.sr, words[end-1].end + .25) * m.sr) if words else len(x)
        print(l['id'], k, round(score, 3), ' '.join(hyp), flush=True)
        if not best or score > best[0]: best = (score, x[:cut])
    sf.write(f"{d}/{l['id']}.wav", best[1], m.sr); print(l['id'], 'kept', round(best[0], 3), flush=True)
