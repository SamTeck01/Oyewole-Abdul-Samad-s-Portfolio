# Bau-Kunden 9:16 Reel – Project

Client: Bau-Kunden (bau-kunden.app) via Dave (lulu.tech). Studio: SamTeck Motion Studio.

## Status (2026-10-19)
- Current version: **v10** (cloned voice, slowed). DE 37 s / EN 33 s, both < 20 MB.
- Waiting on: client feedback on v10 pace.

## Brief (agreed)
- Sell the result, not the service: "full calendar with client appointments". No price, no "Google Ads".
- Brand from site: cream #f6f1ea, ink #231b15, red #ee333e; Bebas Neue + Barlow; "Sie" form.
- Male voice. Files < 20 MB without visible quality loss.

## Voice
- ElevenLabs (Starter plan, key in env `ELEVENLABS_API_KEY`). Clone `BK_Clone`, voice_id in
  `voice_clone/work/BK_Clone.voice_id`, model eleven_multilingual_v2, stability 0.5, style 0.2.
- Made from the client-supplied video; SamTeck confirmed the owner agreed (see `voice_clone/README.md`).
- Rejected before: Edge, Piper, Chatterbox, Zonos, Kartoffel-Orpheus, ElevenLabs library voices.

## Files
- Script (DE/EN, lines l1–l9): `reel/audio/script.json`
- Voice lines: `reel/audio/vo_de/`, `vo_en/` (l1.wav … l9.wav)
- Mix + timing: `reel/audio/build.py` → `remotion/public/reel_mix_<lang>.wav`, `remotion/src/reel_cues_<lang>.json`
- Visuals: `remotion/src/Kinetic.tsx` (compositions BK-Kinetic-DE / BK-Kinetic-EN)
- Output (not in git): `remotion/out/BauKunden_<DE|EN>_9x16_v10_slower.mp4`

## How to change things (no new voice credits needed for 1–3)
1. **Speed:** `build.py` line 10 `atempo=0.95` (lower = slower). Pauses: `GAP` and the l3/l8 values.
2. **Rebuild audio:** `HF_HUB_OFFLINE=1 python build.py de` (and `en`), using the `cb` venv.
3. **Render + encode:** `npx remotion render BK-Kinetic-DE out/_raw_DE.mp4`, then
   `ffmpeg -i out/_raw_DE.mp4 -c:v libx264 -preset slow -crf 19 -profile:v high -level 4.2 -maxrate 12M -bufsize 24M -pix_fmt yuv420p -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-2 -ar 48000 -movflags +faststart out/<name>.mp4`
4. **New wording for a line (uses credits):** edit `script.json`, then
   `reel/audio/tts_eleven.sh <voice_id> eleven_multilingual_v2 x.mp3 "<text>" 0.5 0.2`,
   convert to 48 kHz mono `vo_<lang>/lN.wav`, then steps 2–3.

## History
v1–v7 (249 € offer, paid) → v8 "full calendar" script → v9 cloned voice → v10 slower.
