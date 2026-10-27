---
name: motion-studio-rules
description: SamTeck's standing rules for every motion/ad job (branch, no PRs, token saving, voice, pacing, specs); read before any video work
metadata:
  type: feedback
  modified: 2026-10-19T14:09:52.901Z
---

Imported 2026-10-19 from SamTeck's "Motion Videos" cloud project and the branch docs (`CLAUDE.motion-studio.md`, `ADV/HANDOFF.md`). Full digest: /mnt/project-files/history/motion-history.md.

- **Branch:** all Motion Studio work on `claude/project-thread-wgsl7b` (SamTeck01/Oyewole-Abdul-Samad-s-Portfolio). SamTeck said 2026-10-19: no PRs, commit and push straight to it.
- **Save tokens to the max:** short replies, minimal file reads and command output, no re-rendering without need. His top priority.
- **No scattered threads:** keep related work in an existing thread. Since 19 Oct: thread "Client briefs desk" gathers client needs into /mnt/project-files/briefs/<client>.md; only briefs SamTeck has planned and approved in that thread go to the video thread (20 Oct: desk only gathers client info and hands it over; SamTeck plans the video with the video thread, never send straight to build) "Learn from motion training videos", which builds per Motion Training/technique-guide.md and the reference clips.
- **Brief first, wait for OK** ("don't create yet" = don't build or spend credits). Check stills before full renders.
- **Sell the result, not the service** (Bau-Kunden client rejected a service-led script).
- **Voice:** male, confident and emotional. Clients rejected all free TTS on Bau-Kunden; ElevenLabs clone passed (`eleven_multilingual_v2`, stability 0.5, style 0.2, mp3_44100_128, curl, ≤3 parallel; consent required). Kokoro OK for drafts. Always phoneme-mark names and send samples (e.g. ACCA = "aka").
- **Pacing:** `atempo=0.95`, ~0.32 s gaps, ~0.5 s before the solution turn and close. "Laggy"/"too fast" usually means the voice; fix audio, ask before changing motion.
- **Specs:** ads 30–45 s, hook in 3 s, 9:16 first (1080×1920 60 fps) plus separate 16:9; <20 MB (x264 veryslow crf 16–19); −14 LUFS / −2 dBTP; check takes with faster-whisper.
- **Look:** real brand assets, smooth motion with no shake, high impact; new animations each job.

**Why:** these came from client rejections and SamTeck's direct instructions.
**How to apply:** follow on every motion job; see [[motion-clients]], [[fdac-promo-pipeline]], [[bauplattform-film-job]].
