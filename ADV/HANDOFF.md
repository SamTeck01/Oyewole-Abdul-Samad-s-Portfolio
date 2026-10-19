# Motion Studio: handoff for new chats

Read this first in every new chat, together with `CLAUDE.motion-studio.md` (standing rules) at the repo root.
Where the two disagree, the newest lessons below win (male ElevenLabs voice, under 20 MB, −14 LUFS / −2 dBTP).

All Motion Studio work lives on branch `claude/project-thread-wgsl7b`. Every thread should base its work on that branch.

## Who / how we work
- SamTeck runs the studio and talks to clients. Claude plans, writes briefs, builds and renders.
- Main middleman so far: **Dave (lulu.tech)**, paid per video, brings clients one by one.
- Order of work: Brief → OK → assets → voice options → preview + contact sheet → feedback → finals.

## Finished job: Hebei Xiangjin Xin (fastener factory)
Folder: `ADV/Hebei Xiangjin Xin Ad/` (brief, Blender script, Remotion code, audio build, contact sheets).
- Reference style: Xometry ad (VO-led, blue→mint gradient + white studio, frosted 3D, white UI cards).
- Final: ~44 s Meta cut, 16:9 + 9:16, Michael VO. The Chinese version was started and then stopped at SamTeck's request.

## Lessons learned (do these from the start)
1. **Ads for Meta: 30–45 s max.** Hook in the first 3 s.
2. **No flip-book 3D turntables** (24 frames = laggy). Use one hero angle + smooth 60 fps CSS motion, or render ≥120 frames.
3. **Blender PNGs:** shadow-catcher alpha leaves boxes. Threshold alpha < 10 and fade the edges.
4. **Fast scenes:** don't truck the camera with motion blur. Build grids tile by tile instead.
5. **VO:** `kokoro-onnx` (Python 3.13 venv) is fine for English (`am_michael`, `af_bella`). For **Chinese**, use full `kokoro` + `misaki[zh]` in a **Python 3.12** venv (`uv venv -p 3.12`); the ONNX build mangles tones. Latin words get dropped in zh, so keep them on screen.
6. **Time-warp trick:** design the picture once, then map design time → VO word timestamps (faster-whisper) so a new VO take re-times everything without rewriting scenes.
7. Check every take with faster-whisper; master to −14 LUFS / −2 dBTP; send files under 20 MB.

## Tool setup that worked in the cloud container
- Node 22 + Remotion 4.0.240, `@fontsource/inter`, `@fontsource/noto-sans-sc`, lucide-react, d3-geo + world-atlas.
- Blender 4.2.3 headless (download tarball from download.blender.org).
- Python: numpy/scipy for music + SFX; ffmpeg for mix, master, contact sheets.
- Renders: about 10–12 min per 44 s video at 1080p60, 4 cores.

## Finished job: Bau-Kunden (Facebook ad, DE + EN) — paid
Folder: `ADV/Bau-Kunden Ad/`. Finals: EN 9:16 v7, DE 9:16 v5 (both ~19.6 MB). 4:5 and 1:1 not rendered (comps exist).
Lessons:
- Edge TTS blocked from the cloud since Oct 12. Working free fallback: **Chatterbox multilingual** voice clone
  (`audio/tts_chatterbox.py`, Python 3.12 venv, patch `perth.PerthImplicitWatermarker = perth.DummyWatermarker`).
  Clone from the approved male Florian takes in `vo_m` (NOT `vo_f`, which is higher). Check pitch with librosa pyin:
  male target ~120–130 Hz; DE clone came out 149 Hz → `rubberband=pitch=0.873:formant=preserved`.
- Client rejected Piper "thorsten" (sounded effeminate). Speaks German names correctly in EN when cloned.
- Lists ("ausgegeben, gesehen, angefragt"): write with full stops so pauses are even.
- Music ducking: one held dip per VO line with slow ramps (see `music_mix.py`), not per-word.
- Under 20 MB at full quality: x264 `-preset veryslow -tune animation -crf 16` (SSIM 0.998).
- "Laggy" from the client meant the voice pacing, not the picture — ask before changing motion.
- Follow-up job (v8–v10, "full calendar" script): every free TTS was rejected by the client (Edge, Piper,
  Chatterbox, Zonos, Kartoffel-Orpheus). What finally passed: **ElevenLabs** (Starter $5) instant voice clone,
  `eleven_multilingual_v2`, stability 0.5, style 0.2. Use `mp3_44100_128` (192 needs a higher plan), max 3 parallel
  requests, call the API with curl (Python urllib gets 403). Clone only with the voice owner's permission.
- Client then said the clone felt too fast: v10 slowed it with `atempo=0.95`, base gap 0.32 s and ~0.5 s before
  the turn to the solution and the close (`reel/audio/build.py`). No re-recording needed.
- Script lesson: sell the dream/result ("full calendar"), not the service ("we do Google ads").
- faster-whisper offline: set `HF_HUB_OFFLINE=1` or it fails behind the proxy.
