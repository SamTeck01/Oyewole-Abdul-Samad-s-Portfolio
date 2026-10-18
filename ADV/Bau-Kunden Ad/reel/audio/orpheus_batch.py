# Render every line of orpheus_lines.json N times (different temperatures) -> <out>/<id>_<k>.wav
import sys, json, os, soundfile as sf
sys.argv, args = sys.argv[:2], sys.argv[1:]
import importlib.util
spec = importlib.util.spec_from_file_location('ko', os.path.join(os.path.dirname(__file__), 'tts_orpheus.py'))
sys.argv = ['x', args[0], args[1]]; ko = importlib.util.module_from_spec(spec); spec.loader.exec_module(ko)
cfg = json.load(open(os.path.join(os.path.dirname(__file__), 'orpheus_lines.json'))); out = args[1]; os.makedirs(out, exist_ok=True)
for lid, (emo, text) in cfg['lines'].items():
    for k, temp in enumerate((0.6, 0.7)):
        x = ko.speak(f"{cfg['speaker']} - {emo}: {text}", temp=temp); sf.write(f'{out}/{lid}_{k}.wav', x, 24000); print('ok', lid, k, flush=True)
