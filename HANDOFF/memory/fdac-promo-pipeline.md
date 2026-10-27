---
name: fdac-promo-pipeline
description: FDAC promo videos (Oct 2026): v1 HTML/Playwright and v2 Remotion, where outputs/source live and how to re-render
metadata:
  type: project
  modified: 2026-10-13T10:06:24.865Z
---

FDAC (Focus, Discipline, and Consistency) is a WhatsApp community for youths 15–30. It is Tahir's work, not SamTeck's: SamTeck said 2026-10-20 to keep it off his portfolio site. Copy must never mention scholarships, jobs or courses; only connection, guidance and motivation.

**v2 (current, 2026-10-13):** a 60s Remotion project in `/mnt/project-files/FDAC Promo/v2/remotion-project`, with MP4s in `FDAC Promo/v2/`. All copy, colours, scene lengths and the SFX timeline are in `src/theme.ts`, and the scenes are in `src/scenes/`. The music and SFX are synthesized by `scripts/make_audio.py`. It uses the real logo (`public/assets/fdac-logo.png`).

Sandbox gotcha: Remotion's Chrome rejects fonts.gstatic.com through the agent proxy (cert error). Render with `REMOTION_LOCAL_FONTS=1` in an `--env-file`, which uses `public/fonts`. `scripts/stills.mjs` renders preview stills and must pass envVariables to both selectComposition and renderStill.

**v1 (superseded):** a 55s HTML + Playwright build in `FDAC Promo/source/`.

**Why:** later edits should reuse the pipeline. SamTeck prefers smooth motion with no shake, and wants frames checked before shipping because renders are expensive.
**How to apply:** edit theme/scenes, run stills, then `npx remotion render FDAC-16x9|FDAC-9x16`. See [[motion-studio-handoff]].
