# Motion Studio: handoff for new chats

Read this first in every new chat, together with `CLAUDE.motion-studio.md` (standing rules) at the repo root.
Where the two disagree, the newest lessons below win (male ElevenLabs voice, under 20 MB, −14 LUFS / −2 dBTP).

All Motion Studio work lives on branch `claude/project-thread-wgsl7b`. Every thread should base its work on that branch.
No PRs: commit and push straight to it (SamTeck, 19 Oct 2026).

## Job index (as of 19 Oct 2026)
| Job | Client | Folder (on this branch) | Renders | Status |
|---|---|---|---|---|
| Hebei Xiangjin Xin | fastener factory | `ADV/Hebei Xiangjin Xin Ad/` | not in git | Finished (EN). ZH stopped. |
| Bau-Kunden (FB ad, DE + EN) | via Dave (lulu.tech) | `ADV/Bau-Kunden Ad/` | project files `Bau-Kunden Ad/` | Paid. Finals EN 9:16 v7, DE 9:16 v5; follow-up v8–v10 |
| Baucheck24 / Bauplattform film | via Dave | `ADV/Bauplattform Ad/` | project files `Bauplattform Ad/` (v1–v8) | Latest EN v8 (12 Oct). Dave wants it "epic" |
| Rothme product ad | spec piece for Riley Othmer | `ADV/Rothme Ad/` | not in git | Built 10 Oct, 16:9 + 9:16 |
| Leah Luxe clearance sale | Ibadan beauty/gadgets store | `ADV/Leah Luxe Ad/` | not in git | v2 62 s 9:16, no voice (16 Oct) |
| FDAC promo | WhatsApp youth community | not on branch | project files `FDAC Promo/` | v2 Remotion, 60 s (13 Oct) |
| Excel Academy app advert | Excel Group | not on branch (another project's `excel-ad/`) | not here | Milestone 1, 46 s. Open: App Store badge, client-confirmed stats |
| Tahir intro ad | SamTeck (own) | not on branch yet (`ADV/Tahir Ad/` planned) | not in git or Drive | 90 s 16:9 + 9:16. 60 s WhatsApp cut not made |
| Portfolio Motion section | SamTeck | site `src/` (PR #3) | Drive "Motion" folder | Shows Product Ad + Food Bridge Explainer; more finals to upload |

"Project files" = the Motion Studio project's shared folder. Big media (renders, reference videos, rejected voice tests) belongs there, not in git.

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

## Baucheck24 / Bauplattform film (via Dave)
Folder: `ADV/Bauplattform Ad/` (brief `brief/PROMPT.md`, Blender, Remotion, audio). Source: 57-page German spec PDF
("Master-Funktionsumfang", "Vorbereitet für David Kumar"); function list in project files `Bauplattform Ad/Baucheck24_function_list.md`.
- Product is only a spec, so every screen is designed in code. EN + DE wanted.
- Versions v1–v8 on 12 Oct: v6 90 s cut, 124 BPM; v7 smooth camera glide (no shake); v8 reel-style kinetic type slams.
- Dave wants it "epic"; his style reference is an Instagram reel Claude can't open (Instagram blocked). Ask SamTeck to attach it.

## Rothme product ad (spec piece)
Folder: `ADV/Rothme Ad/` (brief `brief/PROMPT.md`, references, vector logo rebuild `assets_in/brand/rothme_mark.svg`).
- 34.5 s ad + 2.2 s samteck card, 16:9 + 9:16, 120 BPM music. Copy taken from rothme.app ("Connect. Understand. Act.").

## Leah Luxe clearance-sale ad
Folder: `ADV/Leah Luxe Ad/` (`NOTES.md` has the client notes). 9:16 TikTok, no voice, pink theme, logo sample 4.
- v1 22 s shape-wipe style; v2 62 s with every product, prices, delivery and countdown scenes (16 Oct).
- `music.py` (the music generator) is gitignored, so `remotion/public/music.wav` is the only copy of the track.

## FDAC promo
Not on this branch. Everything is in project files `FDAC Promo/`: v2 Remotion project (`v2/remotion-project`, copy and
timing in `src/theme.ts`, audio from `scripts/make_audio.py`) and MP4s; v1 HTML/Playwright build is superseded.
Copy never mentions scholarships, jobs or courses. Render with `REMOTION_LOCAL_FONTS=1`.

## Excel Academy app advert (Excel Group, milestone 1)
Built in another project's cloud folder (`excel-ad/`), not here: Remotion 4, 46 s, 16:9 + 9:16, VO and music-only cuts,
logo and colours (#FF822B / #15161C) from `SamTeck01/excel-academy-dashboard`. Pronounce ACCA "aka", ICAN "I-can", CIMA "see-ma".
Open: the app is Android only (drop the App Store badge?) and the client hasn't confirmed the stats.

## Tahir intro ad (SamTeck's own)
90 s 16:9 + 9:16, Remotion, Kokoro voice ("Hi. I'm Tahir Adewale Oyewole, motion designer…", pronunciation A:
ah-DEH-wah-leh, oh-YEH-woh-leh), livelier code-made music. Pipeline not committed yet; it should go in `ADV/Tahir Ad/`.
