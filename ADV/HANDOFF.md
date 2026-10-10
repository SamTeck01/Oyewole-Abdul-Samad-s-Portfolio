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

## Current job: Rothme (client: Riley Othmer, Discord r1ley0thmer), folder `ADV/Rothme Ad/`
- Brand: rothme.app, dark navy + indigo (#6366F1), DM Sans / Space Grotesk, logo rebuilt as `assets_in/brand/rothme_mark.svg`. "Rothme" = ROTH-mee. CTA: rothme.app / "Get a demo" (no waitlist).
- Done: **Product ad v2** (36.7 s, 16:9 + 9:16, music only) and **Explainer v1** (86 s, 16:9, Heart VO, character "Maya", captions). Code: `remotion/src/Scenes.tsx` (ad), `remotion/src/ex/` (explainer, Maya.tsx). Audio: `audio/build_audio.py`, `audio/explainer/vo.py` + `ex_audio.py`. Briefs: `brief/PROMPT.md`, `brief/EXPLAINER.md`. Renders (mp4 not in git) are regenerated with `npx remotion render`.
- Send clients only the watermarked 720p CLIENT_PREVIEW files until paid.
- **Next:** Riley wants his **Lead Map** feature shown: (A) a new ~45–60 s Lead Map video (Maya as a small agency owner finding local clients) and (B) Explainer v2 with a "04 Grow" Lead Map scene + fixes (more camera moves in desk scene 4–19 s, Maya typing/waving, move dotted line off "Fewer lost leads").
- Lead Map facts (from rothme.app public JS): search city/ZIP + service radius + business type → "Find leads in this area"; OpenStreetMap pins; "Rothme Opportunity Score", Hot/Warm/Cold, reasons ("No website listed — a clear, specific service to offer", "No reviews yet…", "Light competition"); pipeline stages New, Researching, Contacted, Bid Submitted, Follow-Up, Won, Lost; est. job value, follow-up reminders to calendar, CSV import, target markets, "Create a campaign".
- **Lead Map screenshots:** SamTeck added `ROTHME_EMAIL` / `ROTHME_PASSWORD` (his OWN account) as environment variables. Log in with Playwright (chromium at /opt/pw-browsers), open /lead-map, run a search so pins show, screenshot each step into `assets_in/leadmap/`. Read-only: don't change or delete anything; never write the credentials to files, logs or git.
