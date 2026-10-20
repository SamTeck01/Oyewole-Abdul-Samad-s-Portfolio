"""ElevenLabs TTS with word timings. usage: python3 el_tts.py voice_id "text" out_prefix
writes <out>.mp3 and <out>.words.json [{word,start,end}] (seconds)."""
import os, sys, json, base64, urllib.request
vid, text, out = sys.argv[1], sys.argv[2], sys.argv[3]
body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                   "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "use_speaker_boost": True}}).encode()
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps?output_format=mp3_44100_128",
                             data=body, headers={"xi-api-key": os.environ["ELEVENLABS_TOKEN"], "Content-Type": "application/json"})
j = json.load(urllib.request.urlopen(req))
open(out + ".mp3", "wb").write(base64.b64decode(j["audio_base64"]))
a = j["alignment"]; words = []; cur = None
for ch, s, e in zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]):
    if ch.isspace():
        if cur: words.append(cur); cur = None
        continue
    if cur is None: cur = {"word": ch, "start": s, "end": e}
    else: cur["word"] += ch; cur["end"] = e
if cur: words.append(cur)
json.dump(words, open(out + ".words.json", "w"), indent=0)
print(len(words), "words,", round(words[-1]["end"], 2), "s")
