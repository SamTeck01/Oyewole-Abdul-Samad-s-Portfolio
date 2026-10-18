# Bau-Kunden – voice clone

Goal: clone one real person's voice from a video and use it as the voice-over for the
Bau-Kunden 9:16 ad (DE + EN).

## Steps
1. Put the video in `input/`.
2. `./clone.sh input/<file> <name>`: extracts and cleans the voice, uploads it to
   ElevenLabs Instant Voice Cloning, and saves the voice_id in `work/`.
3. Test lines with `../reel/audio/tts_eleven.sh <voice_id> eleven_multilingual_v2 out.mp3 "<text>"`
   (and `eleven_v3` for more emotion). Compare to the original by ear.
4. When the voice is approved, voice all lines of `../reel/audio/script.json`, run
   `../reel/audio/build.py`, re-render BK-Kinetic-DE/EN, and encode under 20 MB.

## What makes a perfect clone
- 1–3 minutes of only this person talking (more is fine; Professional cloning wants 30+ min).
- Clear speech close to the mic, no music, no other voices, little room echo.
- Same energy as the ad: excited and confident, not reading flatly.
- The voice owner must agree to being cloned (ElevenLabs requires this).

## Plan notes
- Starter ($5) = Instant Voice Cloning: very close, made from a short sample.
- Creator ($22) = Professional Voice Cloning: trained on 30+ min, near-identical.
