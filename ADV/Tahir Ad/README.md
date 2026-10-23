# Tahir — Motion Designer Ad (Remotion)

A 90-second ad for Tahir Adewale Oyewole, in 16:9 and 9:16, plus a 60-second 9:16 cut for WhatsApp Status.

## Setup
```
npm i
uv venv -p 3.12 .venv && uv pip install -p .venv kokoro-onnx "misaki[en]" soundfile numpy scipy
```
Kokoro model files (`kokoro-v1.0.onnx`, `voices-v1.0.bin`) go in `models/`, from
github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0).

## Change the words or the voice
1. Edit `scripts/script.json` (one line per scene).
2. Regenerate the voice: `.venv/bin/python scripts/tts.py am_michael 0.95`
   (other calm male voices: `am_adam`, `am_eric`, `bm_george`, `bm_lewis`)
   For the 60 s cut add `60` (drops the "functions" and "why" lines, see `CUTS` in tts.py).
   Then build the music: `.venv/bin/python scripts/music.py` (or `scripts/music.py 60`).
   The name uses a fixed pronunciation in script.json: TAH-heer · ah-DEH-wah-leh · oh-YEH-woh-leh.
3. Re-render (below). Scene lengths follow the new voice automatically.

## Render
```
npx remotion bundle src/index.tsx --out-dir build
npx remotion render build TahirAd out/Tahir-Motion-Ad-16x9.mp4
npx remotion render build TahirAdVertical out/Tahir-Motion-Ad-9x16.mp4
npx remotion render build TahirAd60Vertical out/Tahir-Motion-Ad-60s-9x16.mp4
```
Preview and tweak live with `npx remotion studio src/index.tsx`.

## Files
- `src/Scenes.tsx`: every scene
- `src/Character.tsx`: the Tahir character (poses, blinking, lip-sync)
- `src/ui.tsx`: colors, fonts, background
- `scripts/music.py`: the original music bed and sound effects
- `public/`: logo, FDAC project frames, fonts, generated audio
