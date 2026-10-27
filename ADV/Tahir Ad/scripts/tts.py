"""Generate the voiceover with Kokoro TTS and write timings for Remotion.

Usage: .venv/bin/python scripts/tts.py [voice] [speed] [cut]
cut "90" (default) is the full ad; "60" is the WhatsApp Status cut, which
drops the lines listed in CUTS. Writes public/vo<suffix>/<id>.wav,
public/vo<suffix>/full.wav and src/timings<suffix>.json
(per-scene start/duration in frames plus a per-frame mouth envelope).
"""
import json, re, sys, pathlib
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from misaki import en

FPS, SR = 30, 24000
# cut -> (length in seconds, scene ids left out)
CUTS = {"90": (90, []), "60": (60, ["functions", "why"])}
END_HOLD_SEC = 6.5  # silent contact card at the end
ROOT = pathlib.Path(__file__).resolve().parent.parent
voice = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 0.95
cut = sys.argv[3] if len(sys.argv) > 3 else "90"
TOTAL_SEC, DROP = CUTS[cut]
SUFFIX = "" if cut == "90" else f"_{cut}"

lines = [l for l in json.loads((ROOT / "scripts/script.json").read_text()) if l["id"] not in DROP]
# Same Kokoro v1.0 weights as the torch package, run with ONNX (no torch needed).
# Model files: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0).
MODEL = pathlib.Path(__import__("os").environ.get("KOKORO_DIR", ROOT / "models"))
tts = Kokoro(str(MODEL / "kokoro-v1.0.onnx"), str(MODEL / "voices-v1.0.bin"))
g2p = en.G2P(trf=False, british=not voice.startswith("a"))  # handles [word](/ipa/) overrides
out = ROOT / f"public/vo{SUFFIX}"
out.mkdir(parents=True, exist_ok=True)

clips = []
for ln in lines:
    audio, _ = tts.create(g2p(ln["text"])[0], voice=voice, speed=speed, is_phonemes=True)
    sf.write(out / f"{ln['id']}.wav", audio, SR)
    clips.append(audio)

# Spread the leftover time as breathing room before each line.
speech = sum(len(c) for c in clips) / SR
gap = max(0.6, (TOTAL_SEC - END_HOLD_SEC - speech) / len(clips))
lead = 0.35  # silence before the voice inside each scene

full, scenes, t = [], [], 0.0
for ln, c in zip(lines, clips):
    dur = len(c) / SR + gap
    start_f, dur_f = round(t * FPS), round(dur * FPS)
    pad = np.zeros(int(lead * SR))
    seg = np.concatenate([pad, c])
    seg = np.concatenate([seg, np.zeros(max(0, int(dur * SR) - len(seg)))])[: int(dur * SR)]
    full.append(seg)
    scenes.append({"id": ln["id"], "text": re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", ln["text"]), "from": start_f, "dur": dur_f,
                   "voiceFrom": round(lead * FPS), "voiceDur": round(len(c) / SR * FPS)})
    t += dur
end_f = round(TOTAL_SEC * FPS) - round(t * FPS)
scenes.append({"id": "end", "text": "", "from": round(t * FPS), "dur": end_f, "voiceFrom": 0, "voiceDur": 0})
full.append(np.zeros(int(end_f / FPS * SR)))
full = np.concatenate(full)
sf.write(out / "full.wav", full, SR)

# Mouth envelope: RMS per frame, normalised.
hop = SR // FPS
n = len(full) // hop
rms = np.sqrt(np.mean(full[: n * hop].reshape(n, hop) ** 2, axis=1))
rms = np.clip(rms / (np.percentile(rms[rms > 1e-4], 95) + 1e-9), 0, 1)
(ROOT / f"src/timings{SUFFIX}.json").write_text(json.dumps({
    "fps": FPS, "total": round(TOTAL_SEC * FPS), "voice": voice,
    "scenes": scenes, "mouth": [round(float(x), 2) for x in rms]}))
print(f"speech {speech:.1f}s, gap {gap:.2f}s, voice {voice}")
