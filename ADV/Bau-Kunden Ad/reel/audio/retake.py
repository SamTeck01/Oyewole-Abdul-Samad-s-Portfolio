# Re-take single lines: try spelling variants x seeds, keep the take whose transcript best matches the target text.
import sys, json, re, difflib, perth, torch, soundfile as sf, librosa
perth.PerthImplicitWatermarker = perth.DummyWatermarker
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel
ref = sys.argv[1]
JOBS = [('de', 'l2', 'Kunden suchen online: Dachdecker in meiner Nähe.', ['Kunden suchen online: Dachdecker in meiner Nähe.', 'Viele Kunden suchen online: Dachdecker in meiner Nähe.']),
        ('de', 'l5', 'Bau-Kunden schaltet deine Anzeigen in der Google-Suche und auf Maps. Texte, Zielgruppen, Auswertung.',
         ['Bau-Kunden schaltet deine Anzeigen in der Google Suche und auf Google Maps. Texte, Zielgruppen, Auswertung.', 'Bau-Kunden schaltet deine Anzeigen bei Google, in der Suche und auf Maps. Texte, Zielgruppen, Auswertung.']),
        ('en', 'l2', 'Customers search online: roofer near me.', ['Customers search online: roofer near me.', 'Customers search online for a roofer near me.'])]
m = ChatterboxMultilingualTTS.from_pretrained(device='cpu'); w = WhisperModel('small', compute_type='int8')
norm = lambda s: re.sub(r'[^a-zäöüß0-9 ]', '', s.lower().replace('-', ' '))
for lang, lid, target, variants in JOBS:
    best = None
    for v in variants:
        for seed in (1, 2):
            torch.manual_seed(seed); x = m.generate(v, language_id=lang, audio_prompt_path=ref).squeeze().numpy()
            hyp = ' '.join(z.word for s in w.transcribe(librosa.resample(x, orig_sr=m.sr, target_sr=16000), language=lang)[0] for z in s.words) if False else ' '.join(s.text for s in w.transcribe(librosa.resample(x, orig_sr=m.sr, target_sr=16000), language=lang)[0])
            sc = difflib.SequenceMatcher(None, norm(hyp), norm(v)).ratio(); print(lang, lid, seed, round(sc, 3), '|', v, '|', hyp, flush=True)
            if not best or sc > best[0]: best = (sc, x, v)
    sf.write(f'vo_{lang}/{lid}.wav', best[1], m.sr); print('KEPT', lang, lid, round(best[0], 3), best[2], flush=True)
