# Motion Studio: tools and learning gaps (checked 19 Oct 2026)

## Tools

| Tool | Status here | Use |
|---|---|---|
| Remotion 4 (latest 4.0.536) + `@remotion/motion-blur` | Installable from npm | Main animation engine, motion blur |
| Chromium (headless) | Installed | Remotion rendering |
| Node 22, Python 3.13 | Installed | Scripts |
| ffmpeg / ffprobe 6.1 | Installed | Encoding, contact sheets, loudness (−14 LUFS) |
| ImageMagick 6 | Installed | Image prep |
| faster-whisper + librosa | Installed | VO checks, word timestamps for caption sync, beat detection |
| ElevenLabs (SamTeck has Pro) | API reachable, but **no API key in this environment** | Voiceover (clone), plus possibly sound effects and music |
| Kokoro TTS | Installable from PyPI | Draft voices only |
| Fonts | Google Fonts blocked; npm `@fontsource/*` works | Local fonts |
| Figma MCP | Needs sign-in; Starter plan limits | Reading client designs |
| Blender | Not installed | 3D renders (not needed yet; Remotion + three.js covers phones and watches) |
| Stock and SFX sites | Pixabay blocked; Freesound reachable (needs a key); Instagram and Drive blocked | Music and SFX sourcing |

ElevenLabs setup: add the key as the environment variable `ELEVENLABS_API_KEY` in Project settings → Cloud environment. A new session picks it up.

## Still to learn

1. **Build the missing pieces by practising:** continuous camera, match-cut morphs, motion blur, word-synced captions. Do this by rebuilding 05 Opal and 17 Apple Health and comparing frame by frame.
2. **Sound design:** we have 12 SFX from FDAC. The references use 4–7 sounds per second, so we need a bigger library (whooshes, UI clicks, risers, glitches) and a way to place them from the animation's own events.
3. **Music:** a reliable royalty-free source that works from this environment. ElevenLabs music/SFX generation on Pro, if available, is the likely answer.
4. **3D devices:** a clean phone/watch/laptop model in three.js (`@remotion/three`) for the device shots in 04, 11, 12 and 17.
5. **Convincing client UI:** each ad needs the client's real screens or Figma to redraw from. That is a brief item, not a skill.
6. **SamTeck's taste:** his notes on the first test rebuilds. The fastest way to close the last gap.
