# Motion training: SaaS / app-promo style (v2, deep pass)

Study of the 20 reference clips SamTeck sent on 19 Oct 2026. Clips are in `clips/` (01–20). Every clip was gone through at 3 frames per second with timecodes, four key moves were measured frame by frame at 30 fps, and every soundtrack was transcribed and measured. The full per-clip shot lists are in **shot-lists.md**; this file is the distilled playbook.

All 20 clips are TikTok reposts from other creators. None are SamTeck's own.

**Correction to v1:** v1 guessed there was no voiceover. That was wrong. 11 of the 20 clips have a voiceover, and in those the on-screen words are the voiceover, word for word (see "Sound").

## 1. The style in one paragraph

Short (10–50 s) promos for apps and SaaS products. The UI is redrawn as clean design, never shown as a raw screen recording. The script is shown as **kinetic captions**: each word appears on the exact frame it is spoken, with the key word in the brand colour. The camera never stops: macro close-ups on a button, pull-backs, 3D tilts, pans that follow text. Scenes rarely hard-cut; the thing that ends one beat **becomes** the thing that starts the next (dot → pill → card → logo). Every clip ends on a logo, then a URL or CTA pill.

## 2. The recurring story structure

Almost every clip follows the same five-act shape. Times are typical for a 20–30 s ad.

| Act | Share of time | What happens | Seen in |
|---|---|---|---|
| Hook / pain | 0–15 % | A relatable line built word by word ("Your body is constantly changing", "Work today is broken", "Let me guess…"), often with chaos visuals: orbiting app logos, file walls, floating thumbnails | 01, 03, 09, 10, 15, 16, 17 |
| Turn | ~1 beat | One short word on its own, often with a white↔black background flip: "But", "So", "What if…" | 11, 15, 16 |
| Reveal | 5–10 % | The logo forms out of the last element, then "Welcome to / Introducing / Meet [brand]" | 02, 09, 12, 15, 16 |
| Product demo | 50–60 % | 3–6 micro-scenes of the product in use: type a prompt → press send → result appears → click a button → success state, driven by a cursor | all |
| Payoff + CTA | 10–15 % | A benefit line ("Listen to your body.", "Files made easy.") → logo hold 1.5–3.5 s → URL or CTA pill ("7 Days Free Trial", "onepoint.com") | all |

The problem → solution rhyme is a favourite trick. In 15 (Rerun), the pain list shows red ✕ tags, and the solution later shows the same items as green ✓ tags.

## 3. Two reusable templates spotted

- **Score-pill template** (05 Opal and 06 Qwix, two different creators, same structure): data chart → overload flash → stat pills count up with arc rings → bracket line to a total score → app icon lock/unlock → glass "Start/Try" pill with sheen → wordmark. It runs about 10 s and is a single continuous camera move. This is a trending format and the best first rebuild.
- **Chat-demo template** (11, 18, parts of 02 and 03): macro on an input bar → prompt types in real time → drag an attachment in → send-button squish → "working/writing…" shimmer → result cards pop in → zoom into the next input → insights card with a counter → logo on a soft gradient.

## 4. Measured timing (frame counts at 30 fps; double them for our 60 fps)

| Move | Measured | Clip |
|---|---|---|
| Word entrance | 1–3 frames to readable, 4–6 frames to fully settled | 09, 17 |
| Gap between words | 4–6 frames, locked to the voiceover word start (±1–2 frames) | 17 |
| Accent fade | The new word arrives in the accent colour with a soft radial glow (~120 px) and fades to the base colour over 4–5 frames | 17 |
| Baseline settle | The new word starts ~6 px below the line and rises into place | 17 |
| Sentence pan | The line drifts left as it grows, then whips left with motion blur over 4 frames and settles over ~8 frames (expo out) | 09, 12 |
| Count-up | 0 → 67 in ~23 frames (0.8 s), slow-fast-slow, with the long tail at the end. The pill scales ~1.0 → 1.4 while counting, and the arc ring draws in sync | 05 |
| Overload flash | The element goes pure white for ~3 frames, then cuts to a small glowing dot that starts the next beat | 05 |
| Strobe | 1–2 frame white/grey flashes on a beat at the start of a scene | 12 |
| Logo hold | 1.5–3.5 s, the only long static moment | 14, 18 |

Rule of thumb: entrances are fast (0.1–0.2 s), settles are soft (0.3–0.4 s), and nothing holds still for more than ~1 s until the logo.

## 5. Sound

| | Finding |
|---|---|
| Voiceover | 11/20 clips (03, 09, 12–17, 19, 20, and 18 partly). Clips 01, 02, 04–08, 10, 11 are music + SFX only |
| VO pace | 155–185 words per minute in most clips (fast, conversational). Slower outliers are 03 (114) and 12 (99). Sentence pauses are 0.4–0.6 s, which matches our existing pacing rule |
| Voices | Inferred from pitch, not confirmed: 15 and 19 sound male; 13, 14 and 16 sound female; the rest could not be measured because the music masks the pitch |
| Text ↔ VO | On-screen words are the script itself, shown on the spoken word's frame. Tight sync is the main thing that makes these feel premium |
| Music | Steady, beat-driven tracks at 83–172 BPM (most 105–130). Clip 18 uses a song with sung vocals under the demo |
| SFX density | 4–7 audio onsets per second: a click, pop, whoosh or tick on almost every visual action |
| Loudness | −10 to −17 LUFS integrated, mostly about −13. Our −14 LUFS master is in line |

**Pipeline consequence:** we can make this sync automatic. We generate the VO, run faster-whisper with word timestamps (already in our toolset for checking takes), and drive each word's entrance frame from its timestamp. No hand-keyed timing.

## 6. Visual system

- **Two looks only.**
  - **Light:** off-white or pale tint (#F4F6FB, #FAF6F2, lavender #F1E9F3) with 3–4 huge drifting blurred blobs in the brand hue. Seen in 02, 09, 12, 13, 14, 17, 18.
  - **Dark:** near-black (#0B0B0F) with one coloured light source, either a radial glow at the top or bottom edge or a "planet horizon" rim. Seen in 01, 04, 05, 06, 15, 16.
  - Clips flip between the two to punctuate beats (01, 03, 11).
- **One accent colour** per brand, used for the key word, CTA pill and glows.
- **Type:** one grotesk (Inter/SF style), medium–semibold, small on screen (~3–5 % of frame height on 16:9). Kinetic words occasionally go huge (full-frame "professional", "TIME", "Introducing").
  - Font contrast, used in a couple of clips: a serif italic accent word ("everywhere" in 14) or a script word ("Now!" in 13).
- **Glass and glow:** glass cards (backdrop blur over photos or blobs), soft outer glows on active elements, white bloom on pressed buttons, sheen sweeps across CTA pills.
- **Photo backgrounds** (03, 17, 02): misty forest, sky, alpine meadow, with glass UI floating over them. These give "calm, premium" moments between dense UI beats.
- **Cursor storytelling:** an arrow or hand cursor flies in, hovers, presses (button squish to ~0.95), drags files in and clicks Approve. It is used in nearly every demo.

## 7. Technique catalogue (with how to build each in Remotion)

**Text**
1. **Caption-synced word build** (09, 12, 13, 15, 16, 17). Use word timestamps from faster-whisper. Each word: opacity 0→1 and blur 8→0 over 3 frames, y +6→0 over 6 frames, accent colour plus glow fading to base over 5 frames. The line re-centres or pans as it grows. *New:* `CaptionLine`.
2. **Split-word morph** (17 "constantly → changing"). The word splits into halves that slide apart vertically and swap to the next word. *New:* `MorphWord`.
3. **Slot word cycle** (03 Imagine → Build → Discover, 09 faster → easier → better). One slot in a sentence rolls vertically with blur. *New:* `SlotWord`.
4. **Scramble / decode** (02 "What will you build?", 08 "life", 16). Random glyphs resolve into the word over 6–10 frames. *New:* `Scramble`.
5. **Typewriter in an input** at human speed with a caret, and the camera follows the text (02, 11, 18). *Easy* (extends `ChatCard`).
6. **Text on a path or in 3D** (07 wave path, 15 arc-in, 12 receding rotateY, 11 tilted line). *Easy* with CSS 3D; the wave path uses SVG `textPath`.
7. **Bracket-wrapped words** (03 `< too many signals >`, 15 corner brackets, 16 `{ Ever find an }`, 14 `[ Your product ]`). The brackets widen as text grows. *Easy*.
8. **Image inside a sentence** (16 "How the hell [card] did they make this", 02 icons dropped between words). A card sits inline and its content cycles each beat. *Easy*.
9. **Highlight / tag boxes** (01 blue selection box with handles, 15 red ✕ and green ✓ tag boxes, 16 green box "EarnEdits"). *New:* `HighlightBox`.
10. **Text masked by an object** (11 "TIME" passing behind a phone). Layer the object over the text with matching z. *Easy*.

**UI and data**

11. **Stat pills, count-up, arc ring, bracket to total** (05, 06). *New:* `StatPill`, `CountUp`, `ArcRing`, `Bracket`.
12. **Bar chart overload** (05): bars rise, the hero bar fills past the average line, changes colour, then flashes white. *New:* `BarChart`.
13. **Icon lock/unlock and icon → card morph** (05, 06, 17). *New:* `IconMorph`.
14. **Chat with streaming answer** (18, 02): bubbles, "Writing…" shimmer, the answer streams word by word, image results pop in staggered. *Easy* (`ChatCard`).
15. **Cursor actions** (all demos): fly-in path, hover glow, press squish, drag and drop with the file icon tilting, click ripple. *New:* `Cursor`.
16. **Connectors** (03 bezier strands fanning out to labelled icons, 15 right-angle circuit traces with glowing pulse heads, 13 avatar connector line). *New:* `ConnectorPath`.
17. **Orbit rings with app logos** (01). *New:* `Orbit`.
18. **Card fields**: radial burst/sunflower of posters (03), snake ribbon of thumbnails (13), arch of thumbnails (13), domino row (16), floating glowing stack (08), ring collage of photos (17). *New:* `CardField(layout)`.
19. **Logo marquee and carousels** (02 "Trusted by", 15 app-tile carousel with a giant "100+" behind). *Easy*.
20. **Isometric grid board** (15): perspective floor grid, 3D tiles, dashed connectors, coloured zones. CSS 3D on a rotated plane. *New:* `IsoBoard`.
21. **Notifications / OS chrome** (12 lock-screen notifications, 20 iOS permission sheet and Control Centre). *Easy*, all drawn in code.

**Camera and transitions (the core of the style)**

22. **Continuous camera**: every scene wrapped in a camera that is always pushing or drifting. It does macro close-ups on inputs and buttons (02, 18), pulls back to reveal the context (04, 18), and tilts the whole UI in 3D (05, 06, 02 dashboard). *New:* `Camera`. This is the most important piece.
23. **Match-cut morph**: the shared element changes size, radius and colour across the beat boundary instead of cutting. Examples are dot → pill → card in 05, button → widget in 04, text → pill URL in 02, and icon → card in 17. *New:* a persistent "hero" layer above the scene sequence.
24. **Zoom-through**: push into a button or ring until it fills the frame, then the next scene is inside it (02 send button, 03 ring). *New:* `ZoomThrough`.
25. **Whip pan with motion blur** (01, 09, 12). Use `@remotion/motion-blur` `<CameraMotionBlur>`, or velocity-scaled `filter: blur()`. *New*.
26. **Flash cuts**: a white/black inversion or a colour/grain flash frame for "generating" moments (14, 18 iridescent flash, 13 red print flash). *Easy*.
27. **Depth of field**: foreground and background layers blurred by Z, with focus racks (04, 05, 12). *Easy*.
28. **Lens bulge** (08 barrel-distorted card grid). Needs an SVG displacement map or a shader. *Hard*, rare.
29. **Hyperspace streaks** before "Introducing" (16). *Easy* with a particle layer.

**Light and finish**

30. **Glow, bloom and sheen**: accent drop-shadows, white bloom on press, and a diagonal sheen sweep on CTA pills (05, 06, 15).
31. **Horizon / planet edge** under the logo with a light beam (01, 08).
32. **Neon light streak** across a dark background (08 orange wave, 15 violet underline bar).
33. **Drifting blobs and floating pixel squares** on light scenes (12, 09).

## 8. What this means for our pipeline

- **Already have** (FDAC v2 Remotion project): `SweepText`, `ChatCard`, `Glass`, `Background`, `SoundLayer`, the ElevenLabs/Kokoro VO step and faster-whisper.
- **Biggest gaps:** the always-moving `Camera`, match-cut morphs, motion blur, and caption timing driven by word timestamps. With those four, most of the 20 clips become rebuildable.
- **Out of reach or costly:** photoreal 3D product renders (14), real lifestyle photos (17 used stock), and the lens bulge. For those we use client photos, AI images, or skip.
- **SFX:** to match a 4–7 onsets/second density, `SoundLayer` needs a cue for every action (press, pop, whoosh, tick, type), not just scene changes.

## 9. Proposed next step (waiting on SamTeck's OK)

1. Build the kit on the motion branch (`ADV/_kit/`): `Camera`, `CaptionLine` (timestamp-driven), `MorphWord`, `SlotWord`, `Scramble`, `StatPill`/`CountUp`/`ArcRing`/`Bracket`, `Cursor`, `ConnectorPath`, `CardField`, `ZoomThrough`, plus light-blob and dark-glow backgrounds.
2. Recreate **05 Opal** shot for shot (score-pill template, music only, 10 s), checking stills against the reference before rendering.
3. Recreate **17 Apple Health** (light look, voiceover with caption sync), as the test for the VO-driven pipeline.

## Clip index

| # | File | Creator | Content length | Look | VO | Key techniques |
|---|---|---|---|---|---|---|
| 01 | 01_allanimator6_clickup | allanimator6 | 10 s | dark teal | no | highlight box, orbit rings, screens box, horizon logo |
| 02 | 02_allanimator6_onepoint | allanimator6 | 85 s (6 promos) | light | no | icons-in-text, scramble, zoom into send, marquee, language wall, text→URL pill |
| 03 | 03_allanimator6_one-place | allanimator6 | 30 s | dark → photo | yes | bezier strands, ring zoom-through, poster burst, code ✓/✗, growing tree |
| 04 | 04_mcvisuals_raycast | mcvisuals | 9.5 s | dark red | no | one continuous move, match-cut morphs, command grid |
| 05 | 05_mcvisuals_opal | mcvisuals | 10 s | dark lilac | no | score-pill template |
| 06 | 06_neildegracce_qwix | neildegracce | 9.5 s | dark coral | no | score-pill template (same as 05) |
| 07 | 07_neildegracce_pinterest | neildegracce | 8.5 s | light → red | no | wave-path text, swatch scroll streaks, orbiting buttons |
| 08 | 08_hatsu_portfolio | hatsu6961 | 21 s | white ↔ black/orange | no | lens bulge grid, glowing card stack, decode word |
| 09 | 09_thednyx_dropbox | thednyx | 22 s | light blue | yes | caption sync, slot word, whip pan, toast → progress → pill → bubble |
| 10 | 10_thednyx_mockup-inspo | thednyx | 9 s | light / black | no | thought swarm, board pan, avatar → logo |
| 11 | 11_thednyx_editlaunch_9x16 | thednyx | 20 s | 9:16 mixed | no | phone chat, text masked by phone, inversion beats |
| 12 | 12_kreatively_carrefour | kreatively.ke | 21 s | light blue | yes | 3D receding words, strobe, search → list → cart → notification |
| 13 | 13_adam0blue_two-creators | adam0blue | 17 s | light / space navy | yes | toggle pills, profile cards, thumbnail ribbon and arch, script accent |
| 14 | 14_viovany_fliq | viovany | 25 s | warm white | yes | serif accent, bento collage, prompt with @tag, generation flash |
| 15 | 15_saasservices_rerun | saasservices17 | 48 s | dark violet | yes | ✕→✓ rhyme, circuit traces, iso board, approval card, model carousel |
| 16 | 16_earnedits_earnedits | earnedits.motion | 35 s | dark green | yes | bracket words, image-in-sentence, domino row, chunky 3D buttons |
| 17 | 17_jup_apple-health | jup.creatives | 13 s | white / pink | yes | red-glow caption sync, split-word, blob→card, photo ring |
| 18 | 18_hinedfx_nova-chat | hinedfx | 24 s | lavender / pink | partly | chat-demo template, macro zoom on input, streaming answer |
| 19 | 19_aescripts_morph-tutorial | aescripts | 31 s | AE screen | yes | tutorial; shows the morph-plugin idea |
| 20 | 20_fusionlab_wise-intro-bts_9x16 | thefusionlabfx | 58 s | Resolve screen | yes | behind the scenes; built as many 0.5–2 s micro-comps on a beat grid |
