"""Explainer VO with kokoro-onnx. usage: python vo.py <models_dir> <voice> <out.wav> -> also writes <out>.json (line start/end)"""
import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M, VOICE, OUT = sys.argv[1:4]
B = "Roth-mee"  # brand pronunciation (ROTH-mee), to be confirmed with Riley
LINES = [
  ("hook", "Do you actually know which of your marketing is working?", 0.7),
  ("maya1", "Meet Maya. She runs ads, posts every day, sends emails, and sells online. But her numbers live in ten different places.", 0.6),
  ("maya2", "Every platform tells part of the story. Reports are full of numbers nobody explains. And when something breaks, she doesn't notice, until the leads stop.", 0.7),
  ("turn", "Maya doesn't need more dashboards. She needs one that makes sense.", 0.7),
  ("meet", f"Meet {B}. It brings your marketing together, shows what's working, and tells you what needs attention.", 0.8),
  ("connect", "First, connect. Maya links her ads, social, analytics, email and store, with secure connections.", 0.6),
  ("understand1", "Now everything lands in one dashboard. Her Marketing Health Score shows how she's doing, at a glance.", 0.4),
  ("understand2", "And when a number confuses her, she clicks it. The Cheat Sheet explains it in plain English.", 0.7),
  ("act", f"Then, {B}'s Lead Audit spots a problem. Her contact form stopped sending leads. Maya fixes it in minutes, and the leads start coming in again.", 0.7),
  ("more", "But there's more. Reports are ready every Monday. And AI help is there, only if she wants it.", 0.7),
  ("benefits", "Less guessing. Fewer lost leads. Smarter decisions.", 0.7),
  ("proof", "Fourteen plus platforms. A hundred and fifty plus metrics. A hundred plus health checks.", 0.7),
  ("cta", f"{B}. Stop guessing. Start understanding your marketing. Get a demo, at {B} dot app.", 0.0),
]
k = Kokoro(f"{M}/kokoro-v1.0.onnx", f"{M}/voices-v1.0.bin")
out, marks, t = [], [], 0.5
out.append(np.zeros(int(0.5 * 24000)))
for name, text, gap in LINES:
    a, sr = k.create(text, voice=VOICE, speed=1.0, lang="en-us")
    a = a.astype(np.float32)
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 200): nz[-1] + 1200]
    marks.append({"id": name, "start": round(t, 3), "end": round(t + len(a) / sr, 3)})
    out += [a, np.zeros(int(gap * sr))]; t += len(a) / sr + gap
y = np.concatenate(out + [np.zeros(int(0.5 * 24000))])
sf.write(OUT, y, 24000)
json.dump({"voice": VOICE, "duration": round(len(y) / 24000, 3), "lines": marks}, open(OUT.replace(".wav", ".json"), "w"), indent=1)
print(VOICE, round(len(y) / 24000, 2))
