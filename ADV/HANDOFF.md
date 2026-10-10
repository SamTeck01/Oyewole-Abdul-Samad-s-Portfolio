# Motion Studio: handoff for new chats

Read this first in every new chat, together with `CLAUDE.motion-studio.md` (standing rules) at the repo root.

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
7. Check every take with faster-whisper; master to −14 LUFS / −1 dBTP; send files < 30 MB.

## Tool setup that worked in the cloud container
- Node 22 + Remotion 4.0.240, `@fontsource/inter`, `@fontsource/noto-sans-sc`, lucide-react, d3-geo + world-atlas.
- Blender 4.2.3 headless (download tarball from download.blender.org).
- Python: numpy/scipy for music + SFX; ffmpeg for mix, master, contact sheets.
- Renders: about 10–12 min per 44 s video at 1080p60, 4 cores.

## Other notes
- Maryam (SamTeck's partner) does client outreach. Her LinkedIn kit is in `ADV/linkedin/`. Resume that later.
