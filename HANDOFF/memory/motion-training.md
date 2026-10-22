---
name: motion-training
description: SamTeck's 20 reference clips (SaaS/app-promo TikTok style) to learn and replicate; where the clips and technique guide live
metadata:
  type: project
  modified: 2026-10-19T14:40:30.339Z
---

SamTeck wants Claude to learn to make exactly the style of his reference clips (asked 19 Oct 2026, re-sent 20 clips the same day; "ignore videos made by me" but none of the 20 are his).
- Clips: `/mnt/project-files/Motion Training/clips/` (numbered 01–20). Guide v2: `/mnt/project-files/Motion Training/technique-guide.md` (story structure, measured timing, sound, 33 techniques); per-clip shot lists in `shot-lists.md`. 11/20 clips have VO; on-screen words are the VO, synced per word (drive from faster-whisper word timestamps).
- Core gap vs our pipeline: continuous camera, match-cut morphs, motion blur, timestamp-driven captions. SamTeck pushed for a full deep study (not a sample) on 19 Oct.
- Proposed (awaiting OK): shared kit `ADV/_kit/` on the motion branch, then shot-for-shot test of clip 05 (Opal), then 17 (Apple Health).

**Why:** SamTeck wants a repeatable premium SaaS-promo style for client ads.
**How to apply:** read the guide before any new ad; follow [[motion-studio-rules]].
- Tools (2026-10-19): ElevenLabs works (2026-10-20): env var is `ELEVENLABS_TOKEN` (not _API_KEY); plan is Starter, 40k chars/month, so keep VO drafts on Kokoro; voices incl. BK_Clone + pro male voices; sound-generation API OK. Google Fonts + Pixabay blocked. Container is wiped each session: run `/mnt/project-files/Motion Library/setup.sh` to reinstall Blender 4.5, kokoro-onnx TTS, faster-whisper etc. Library there: 418 Kenney SFX + 23 synth SFX, 6 HDRIs, 15 font families, phone/watch/laptop GLBs.
- Kit: repo `ADV/_kit` (Remotion 4, branch claude/project-thread-wgsl7b): kit/core, ui (StatPill, SheenButton, DarkGlow, LightBlobs, Icon), shapes (Bracket, DrawPath); `mix_track.py cues.json out.wav` makes synth music bed + SFX cues mastered ~-14 LUFS. First test: HaloScore (Opal rebuild), render in `Motion Training/renders/`. Lesson: reference framing is ~1.6-2x bigger than first instinct; fill the frame.
- Done 2026-10-20: PulseStory (clip 17 rebuild, 9:16, ElevenLabs voice Brian `nPczCjzI2devNBz1zQrb` via `ADV/_kit/el_tts.py` with exact word timings; kit/captions.tsx CaptionLine+morph; Blender `watch_tumble.py` ~8 s/frame at 660x880 12 spp). Renders in `Motion Training/renders/`. Watch frames are gitignored; copy from `Motion Library/renders/watch_tumble/` into public/watch.
