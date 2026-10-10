"""Explainer VO with kokoro-onnx. usage: python vo.py <models_dir> <voice> <out.wav> -> also writes <out>.json (line start/end)"""
import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M, VOICE, OUT = sys.argv[1:4]
B = "Roth-mee"  # brand pronunciation (ROTH-mee), to be confirmed with Riley
LINES = [
  ("problem1", "Your marketing lives everywhere. Ads in one place. Social in another. Your website, your email, your sales. Each one tells part of the story.", 0.6),
  ("problem2", "So you end up with too many dashboards, reports that are hard to understand, and problems nobody notices, until leads are lost.", 0.8),
  ("meet", f"Meet {B}. It brings your marketing together, shows what's working, and tells you what needs attention.", 0.9),
  ("connect", "First, connect. Link your ads, social, analytics, email, CRM and store, with secure connections.", 0.7),
  ("understand1", "Next, understand. Everything lands in one dashboard. Your Marketing Health Score shows how your marketing is doing, at a glance.", 0.4),
  ("understand2", "And if a number confuses you, click it. The Marketing Cheat Sheet explains it in plain English.", 0.8),
  ("act1", "Then, act. Lead Audit watches for broken tracking, disconnected integrations and lost leads, so you can fix problems before they cost you.", 0.4),
  ("act2", "Reports are ready when you need them. And AI help is there, only if you want it.", 0.8),
  ("proof", "Fourteen plus platforms. A hundred and fifty plus metrics. A hundred plus health checks.", 0.8),
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
