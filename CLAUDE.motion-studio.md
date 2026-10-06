# motion-studio — Standing Rules

Premium motion ads for SamTeck's clients. SamTeck handles clients; Claude plans, references and produces.
Every job starts from the per-job brief template below. These standing rules apply to ALL ads.

## Per-job brief template (SamTeck pastes this filled in)

```
Make me a premium motion ad for [CLIENT / PRODUCT].

Reference video(s): [upload mp4 — YouTube links are blocked in the cloud], or "none, use the Huel/Shopify/Spotify vibe"
What the client actually sells (the outcome, not the feature): [...]
Audiences: [one, or each side — one video per audience]
Format: [UI launch ad 16:9 / vertical reel 9:16 / cartoon story with VO / all]
Idea / message: [1–2 lines, or "you pitch me 3 ideas"]
Script: [my lines, or "you write it"]
Voice: [Kokoro af_heart / ElevenLabs Jessica, Lauren, Siren (only if ELEVENLABS_API_KEY is in env secrets) / "show me options" / none]
Brand name pronunciation: [e.g. "TIK-rah"]
Facts that must be right: [prices, payouts, numbers, website]
Length: [~X s] + end card. Never cut it short on purpose; longer is fine if it stays interesting.
Brand assets: [logo (SVG/PNG), colours, fonts, app screenshots, Figma link, product photos]
Anything to avoid: [...]
```

## STEP 1 — never build first
Study the reference frame by frame (contact sheets every 0.5 s; note pacing, transitions, type, colour,
camera moves, sound). Write the full brief to `ADV/[Client] Ad/brief/PROMPT.md` in this repo
(what we're selling, concept, beat sheet with timings, script, voice, music, SFX plan, screens/scenes
list, assets list), commit + push, show SamTeck. **Wait for OK.**
(Cloud note: `~/Desktop/ADV/` doesn't exist in the container — SamTeck pulls the repo to their Desktop.)

## TOOLS (cloud session)
- **Video:** Remotion (React) at 60 fps, `@remotion/motion-blur` for camera moves. Separate compositions per format (1920×1080, 1080×1920) — never crop one into the other.
- **3D:** Blender (headless), only when a job needs it.
- **Fonts:** bundle locally with `@fontsource` (Google Fonts blocked by proxy). No SF Pro; use Inter / Manrope / the brand font if uploaded.
- **Icons:** brand's own set if known (Hugeicons, Lucide…), else Lucide. Never emoji as icons.
- **Voice:** Kokoro TTS (free, commercial OK) in a Python venv; phoneme-mark the brand name, check every take with faster-whisper, play-check before moving on.
- **Music & SFX:** made in code with Python (numpy/scipy). SamTeck's SSD library is unreachable from the cloud.
- **Mixing, mastering, contact sheets:** ffmpeg.
- **Product screens:** if the app is ready, capture with Playwright. If not polished on mobile, DESIGN screens in code (brand colours, font, icons, real flow and copy) at real device size (390×844 pt). Never put ugly/broken real screens in an ad.
- **Renders** are slow (motion blur @60fps ≈ 15–25 min/video): run in background with long timeout, one after another, give honest ETAs.
- **Delivery:** files >30 MB can't be sent in chat — send videos one by one, stems as FLAC, never one giant zip.

## LOOK
- Real brand: official logo + colours, facts checked with client or official site. No placeholder brand art.
- With a reference: match pacing, layout, transition type, colour mood, energy. Rebuild for this brand, don't copy assets.
- No reference: Spotify/Shopify/Huel family — soft drifting brand glow, Apple-like finish, heavy motion blur on moves, kinetic type, a motion-graphics layer on top so it never gets boring.
- Cartoon/flat vector only when a story ad is asked; match reference character style/palette, give the character a name.
- Photos: photoreal (Unsplash/Pexels). Ask before downloading; log every source + licence in `assets_in/CREDITS.md`.
- Show the process: every product step (tap, type, load, result), taps/cursors, real-feeling data, big readable text on phone screens.
- New animations each time — don't recycle the previous ad's moves.
- 60 fps, 16:9 and 9:16 (or what the format needs).

## VOICE
- Estimate cost first if paid. 2 takes, SamTeck picks.
- Script in full, clear sentences — every word understandable on a phone speaker.
- Re-time the picture to the voice, not the other way round.

## MUSIC & SOUND
- Original music made in code, arranged around the voice: ≥15 dB under VO while words are spoken, no limiter squashing the voice. Smooth and warm, never stiff. Reels without VO: energetic original beat, cuts on the beat.
- Dense, satisfying SFX: whoosh into every word/title, hit on every landing, a sound on every product move, tap, success and the logo. Place and EQ them, don't remove them.
- Master at **-14 LUFS / -1 dBTP**; verify both before delivering.

## QUALITY CHECK (before showing anything)
- Contact sheet of every scene + full-res stills of key frames; inspect and fix overlaps, off-screen text, tiny/unreadable UI, empty frames, wrong numbers.
- Check numbers, spelling, pronunciation, website against the brief.
- State honestly what wasn't checked.

## ENDING
After the ad: animated "made by / samteck" end card, ~2 s, last chord ringing under it.

## ORDER OF WORK
1. Brief → OK
2. Assets list → OK before downloads
3. Voice options → SamTeck picks
4. PREVIEW v1 + contact sheet → feedback, repeat until approved
5. Finals (16:9 / 9:16), stems (VO / music / SFX as FLAC), README with tools, lengths, loudness
6. Only if asked: DaVinci Resolve FULL PROJECT, fully editable (layered video tracks, VO / music stems / every SFX on its own lane by category, scene markers). Remind SamTeck to set playback frame rate to 60. (Resolve doesn't run in the cloud — generate the project/timeline file; API checks happen locally.)

## NEVER
- Never record or screenshot SamTeck's screen. Use the Resolve API to check Resolve.
- Don't start building or spend credits before "go".
- Never put API keys or client secrets in the brief, code or repo.
- Never use copyrighted music, logos not provided, or a real person's likeness without permission.

## Repo layout
```
ADV/
  [Client] Ad/
    brief/PROMPT.md
    assets_in/        (+ CREDITS.md)
    remotion/
    audio/            (vo, music, sfx, stems)
    renders/          (previews, finals, contact sheets)
    README.md
```
