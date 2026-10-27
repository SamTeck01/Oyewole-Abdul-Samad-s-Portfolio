---
name: saas-promo-motion
description: Build premium SaaS/app-promo motion videos (kinetic captions, continuous camera, match-cut morphs) from reference clips, in Remotion. Use when someone drops reference videos or asks for an app/product promo ad.
---

# SaaS / app-promo motion videos

A playbook distilled from a frame-by-frame study of 20 trending app-promo clips (TikTok/Reels style) plus the rebuilds and client feedback that followed. Use it to study new reference clips and to build the video.

## 0. Working rules

- **Brief first, wait for OK.** Write script + shot list + look, get approval before building or spending TTS credits.
- **Stills before renders.** Render 4–6 key frames, compare side by side with the reference, fix, then do one full render. Never re-render without a reason.
- **Sell the result, not the service.** Scripts are about what the viewer gets.
- **Fill the frame.** Reference framing is ~1.6–2x bigger than first instinct. Size UI and type up.
- **Never end quiet.** Music runs under the logo/CTA and resolves on the last frame.
- **If a character is used, control the approved one.** Don't swap in a simpler asset; direct it (gestures on words, turns toward and walks into the next scene).
- Feedback like "laggy" or "too fast" usually means the voice. Fix audio pacing first; ask before changing motion.

## 1. Studying new reference clips (cheap method)

1. `ffprobe` each clip for duration/fps/size. Extract frames at 3 fps with timecodes (`ffmpeg -vf fps=3,scale=480:-1`) and view contact sheets, not single frames.
2. Measure only the 3–4 signature moves at full fps (word entrance, pan, count-up, morph).
3. Transcribe audio with faster-whisper (word timestamps): VO yes/no, words per minute, pauses. Measure loudness (`ffmpeg -af ebur128`).
4. Write a shot list per clip (time, shot, move, sound), then map each move to the catalogue below. Only new moves need new components.

## 2. Story structure (20–45 s ad)

| Act | Share | What happens |
|---|---|---|
| Hook / pain | 0–15 % | Relatable line built word by word, chaos visuals (orbiting logos, file walls). Hook lands in 3 s |
| Turn | 1 beat | One word alone ("But", "So", "What if…"), often a white↔black background flip |
| Reveal | 5–10 % | Logo forms out of the last element, "Meet / Introducing [brand]" |
| Demo | 50–60 % | 3–6 micro-scenes: type prompt → send → result → click → success, cursor-driven |
| Payoff + CTA | 10–15 % | Benefit line → logo hold 1.5–3.5 s → URL or CTA pill |

Rhyme pain and solution (red ✕ tags in the hook become green ✓ tags in the demo).

Two proven templates:
- **Score-pill** (~10 s, one continuous move): chart → overload white flash → stat pills count up with arc rings → bracket to total score → icon lock/unlock → glass "Try" pill with sheen → wordmark.
- **Chat-demo**: macro on input → prompt types in → drag attachment → send squish → "Writing…" shimmer → result cards pop → zoom to next input → insight card with counter → logo on soft gradient.

## 3. Timing (frames at 30 fps; double for 60 fps)

| Move | Value |
|---|---|
| Word entrance | readable in 1–3 f, settled 4–6 f; opacity 0→1, blur 8→0 px, y +6→0 |
| Accent | new word arrives in brand colour with ~120 px soft glow, fades to base in 4–5 f |
| Sentence pan | line drifts as it grows, whips with motion blur over 4 f, expo-out settle ~8 f |
| Count-up | 0→67 in ~23 f, slow-fast-slow; pill scales 1.0→1.4, arc ring draws in sync |
| Overload flash | element pure white ~3 f, cut to a glowing dot that starts the next beat |
| Strobe | 1–2 f white/grey flashes on a beat |
| Logo hold | 1.5–3.5 s, the only static moment |

Entrances fast (0.1–0.2 s), settles soft (0.3–0.4 s), nothing still more than ~1 s before the logo. Button press squish to 0.95.

## 4. Sound

- **VO:** 155–185 wpm, sentence pauses 0.4–0.6 s, ~0.5 s before the solution turn and the close. Male, confident, emotional voice tested best with clients; free TTS is fine for drafts only. Phonetically mark brand names and send a sample.
- **Caption sync is the premium feel.** On-screen words = the VO script. Generate VO, run faster-whisper with `word_timestamps=True` (or use the TTS provider's alignment), and set each word's entrance frame from its start time. Never hand-key.
- **Music:** steady beat, 105–130 BPM. Cut on beats.
- **SFX density:** 4–7 onsets per second; a click/pop/whoosh/tick/type cue on every visual action, not just scene changes.
- **Master:** −14 LUFS integrated, −2 dBTP.

## 5. Look

- **Two looks.** Light: off-white/pale tint (#F4F6FB, #FAF6F2) with 3–4 huge drifting blurred brand-hue blobs. Dark: near-black (#0B0B0F) with one coloured light source (edge glow or planet-horizon rim). Flip between them to punctuate beats.
- **One accent colour** for key words, CTA pill and glows.
- **Type:** one grotesk, medium/semibold; kinetic words may go full-frame. Optional serif-italic or script accent word.
- **Finish:** glass cards with backdrop blur, soft glows, white bloom on press, diagonal sheen on CTA pills, depth-of-field layers.
- UI is redrawn as clean design, never a raw screen recording. Use real brand assets.

## 6. Technique catalogue (Remotion)

**Text:** CaptionLine (timestamp-driven word build) · MorphWord (word splits and swaps) · SlotWord (one slot rolls vertically with blur) · Scramble (glyphs decode over 6–10 f) · typewriter in input with caret and camera follow · text on SVG path / CSS 3D · bracket-wrapped words that widen · image inline in a sentence · highlight/tag boxes · text masked behind an object.

**UI/data:** StatPill + CountUp + ArcRing + Bracket · bar chart overload · icon lock/unlock and icon→card morph · chat with streaming answer · Cursor (fly-in path, hover glow, press squish, drag-drop with tilt, ripple) · ConnectorPath (bezier strands, circuit traces with pulse heads) · orbit rings of logos · CardField layouts (burst, ribbon, arch, domino, stack, ring) · logo marquee · isometric grid board · OS notifications/sheets drawn in code.

**Camera and transitions (the core):**
- **Continuous Camera** wrapper: always pushing or drifting, macro close-ups on buttons, pull-backs, 3D tilt of the whole UI. Most important piece.
- **Match-cut morph:** keep a persistent "hero" layer above the scene sequence; the shared element changes size/radius/colour across the beat (dot → pill → card → logo) instead of cutting.
- **Zoom-through:** push into a button until it fills the frame; next scene is inside it.
- **Whip pan + motion blur:** `@remotion/motion-blur` or velocity-scaled `filter: blur()`.
- Flash cuts (inversion / colour flash for "generating"), hyperspace streaks before "Introducing".

**Light:** glow/bloom/sheen · horizon/planet edge under the logo · neon light streak · drifting blobs and floating pixel squares.

## 7. Build pipeline

1. Brief → approval.
2. VO (draft TTS, then final voice) → word timestamps JSON.
3. Remotion project: `Camera`, `CaptionLine` reading the timestamps, hero morph layer, scenes as Sequences on the beat grid. Build as many 0.5–2 s micro-comps.
4. SFX cue list generated from the same timeline (every action gets a cue) → mix music + SFX + VO → master −14 LUFS.
5. Stills check against the reference → one full render.
6. Deliver 9:16 first (1080×1920, 60 fps) and a separate 16:9 layout; 30–45 s; <20 MB (x264 `-preset veryslow -crf 16-19`). Verify the final take with faster-whisper.

## 8. Out of reach / substitutes

Photoreal 3D product shots, real lifestyle photos and lens-bulge distortion are costly. Use client photos, AI or stock images, Blender renders of simple devices, or skip the move.
