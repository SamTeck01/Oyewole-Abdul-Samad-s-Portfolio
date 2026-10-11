"""Kokoro VO + faster-whisper word timings.
usage: python vo_lines.py <models_dir> <script: leadmap|explainer2> <out.wav>
writes <out>.json  {duration, lines, words}. Sentences are synthesised one by one, so sentence times are exact; word times inside a sentence are estimated."""
import sys, json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M, WHICH, OUT = sys.argv[1:4]
VOICE = "af_heart"
B = "Roth-mee"  # brand pronunciation ROTH-mee
SCRIPTS = {
 "leadmap": [
  ("hook", "Need more local clients? They're closer than you think.", 0.6),
  ("maya", "Meet Maya. She runs a small web design studio. Finding new clients used to mean hours of searching, and guessing who to call.", 0.6),
  ("search", f"Now she opens {B}'s Lead Map. She types her city, sets her service radius, picks a business type, and finds leads in the area.", 0.5),
  ("pins", f"Real local businesses drop onto the map. Each one gets a {B} Opportunity Score. Hot, warm, or cold.", 0.5),
  ("why", "And it tells her why. No website listed. No reviews yet. Light competition. A clear, specific service to offer.", 0.6),
  ("save", "She saves the best ones to her pipeline, adds an estimated job value, and sets a follow-up reminder on her calendar.", 0.5),
  ("stages", "From new, to contacted, to bid submitted, to won.", 0.7),
  ("cta", f"{B} Lead Map. Free for every account. Find your next client, at {B} dot app.", 0.0),
 ],
 "explainer2": [
  ("hook", "Do you actually know which of your marketing is working?", 0.7),
  ("maya1", "Meet Maya. She runs ads, posts every day, sends emails, and sells online. But her numbers live in ten different places.", 0.6),
  ("maya2", "Every platform tells part of the story. Reports are full of numbers nobody explains. And when something breaks, she doesn't notice, until the leads stop.", 0.7),
  ("turn", "Maya doesn't need more dashboards. She needs one that makes sense.", 0.7),
  ("meet", f"Meet {B}. It brings your marketing together, shows what's working, and tells you what needs attention.", 0.8),
  ("connect", "First, connect. Maya links her ads, social, analytics, email and store, with secure connections.", 0.6),
  ("understand1", "Now everything lands in one dashboard. Her Marketing Health Score shows how she's doing, at a glance.", 0.4),
  ("understand2", "And when a number confuses her, she clicks it. The Cheat Sheet explains it in plain English.", 0.7),
  ("act", f"Then, {B}'s Lead Audit spots a problem. Her contact form stopped sending leads. Maya fixes it in minutes, and the leads start coming in again.", 0.7),
  ("grow", "And to grow, there's Lead Map. Maya searches her area, and finds local salons and spas that could stock her products. Each one is scored hot, warm, or cold, with the reasons why. She saves the best ones to her pipeline, and follows up.", 0.7),
  ("more", "But there's more. Reports are ready every Monday. And AI help is there, only if she wants it.", 0.7),
  ("benefits", "Less guessing. Fewer lost leads. Smarter decisions.", 0.7),
  ("proof", "Fourteen plus platforms. A hundred and fifty plus metrics. A hundred plus health checks.", 0.7),
  ("cta", f"{B}. Stop guessing. Start understanding your marketing. Get a demo, at {B} dot app.", 0.0),
 ],
}
LINES = SCRIPTS[WHICH]
k = Kokoro(f"{M}/kokoro-v1.0.onnx", f"{M}/voices-v1.0.bin")
SR = 24000; out, marks, words, t = [np.zeros(int(0.5 * SR))], [], [], 0.5
def trim(a):
    nz = np.where(np.abs(a) > 0.01)[0]; return a[max(0, nz[0] - 200): nz[-1] + 1200]
for name, text, gap in LINES:
    t0 = t
    sents = re.findall(r"[^.?!]+[.?!]?", text)
    sents = [x.strip() for x in sents if x.strip()]
    if WHICH == "explainer2": sents = [text]  # whole lines: identical to v2 takes, keeps old cue times
    for si, sent in enumerate(sents):
        a, sr = k.create(sent, voice=VOICE, speed=1.0, lang="en-us"); a = trim(a.astype(np.float32))
        d = len(a) / SR
        # word times inside the sentence: proportional to letters (+ pause weight for commas)
        toks = sent.replace(B, "Rothme").split()
        wts = [len(re.sub(r"[^A-Za-z0-9]", "", w)) + 2 + (4 if w.endswith(",") else 0) + (8 if w[-1] in ".?!" else 0) for w in toks]
        tot = sum(wts); acc = 0.0; lead = 0.06; span = d - 0.1
        for w, wt in zip(toks, wts):
            s0 = t + lead + span * acc / tot; acc += wt
            words.append({"w": re.sub(r"[^a-z0-9']", "", w.lower()), "s": round(s0, 3), "e": round(t + lead + span * acc / tot, 3), "line": name})
        out.append(a); t += d
        if si < len(sents) - 1: out.append(np.zeros(int(0.28 * SR))); t += 0.28
    marks.append({"id": name, "start": round(t0, 3), "end": round(t, 3), "text": text.replace(B, "Rothme")})
    out.append(np.zeros(int(gap * SR))); t += gap
y = np.concatenate(out + [np.zeros(int(0.5 * SR))]); sf.write(OUT, y, SR)
json.dump({"voice": VOICE, "duration": round(len(y) / SR, 3), "lines": marks, "words": words}, open(OUT.replace(".wav", ".json"), "w"), indent=0)
print(WHICH, round(len(y) / SR, 2))
