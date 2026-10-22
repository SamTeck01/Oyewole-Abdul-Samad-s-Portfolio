# Motion Studio: portable handoff pack (22 Oct 2026)

Everything needed to continue SamTeck's Motion Studio work in any Claude account.

## 1. Quick start in the new account
1. Connect GitHub (claude.ai/connect-github) and give the Claude app access to `SamTeck01/Oyewole-Abdul-Samad-s-Portfolio`.
2. Create a new project, add that repo, and paste `docs/CLAUDE_PROJECT_INSTRUCTIONS.md` into the project instructions.
3. Upload `Motion-Studio-HANDOFF.zip` (this folder) and, if needed, the media from Drive (section 4).
4. Re-add credentials (section 5).
5. Paste the **start prompt** below as the first message.

### Start prompt (copy all of this)
```
You are continuing my Motion Studio work from another Claude account. Read, in order:
1. HANDOFF/README.md (this pack: status of every job and open items)
2. HANDOFF/memory/*.md (standing rules, clients, training, pipelines) and save them to project memory
3. HANDOFF/docs/history/motion-history.md, docs/CLAUDE.motion-studio.md, docs/HANDOFF.md
4. HANDOFF/docs/Motion Training/technique-guide.md before any new ad
The pack is also committed at HANDOFF/ on branch claude/project-thread-wgsl7b of
SamTeck01/Oyewole-Abdul-Samad-s-Portfolio. All motion work goes on that branch, commit and
push directly, no PRs. Save tokens: short replies, minimal reads, no unneeded renders.
Then tell me in 5 lines what is open and wait for my pick.
```

## 2. What is in here
- `memory/`: every project memory file (rules, clients, training, FDAC pipeline, Bauplattform job). `MEMORY.md` is the index.
- `docs/`: project instructions, CLAUDE.motion-studio.md, ADV/HANDOFF.md (per-job table), full chat history digest, all client briefs, motion prompt, technique guide + shot lists + tools-and-gaps, the `saas-promo-motion` skill, video catalog, Bauplattform brief + function list, Tahir VO script, `setup.sh` (reinstalls the toolchain), inputs notes.
- Source code for all jobs (Remotion kit `ADV/_kit`, every ad folder) is already in git on `claude/project-thread-wgsl7b`.

## 3. Status of every thread (22 Oct 2026)
| Job / thread | State | Open item |
|---|---|---|
| Haixing Precision video (in "Learn from motion training videos") | Delivered v5 | `Haixing Precision/video/Haixing_EN_16x9_v5.mp4`; voice clarity fixed. ElevenLabs Starter caps voice at 128 kbps; Creator/Pro would allow higher. Dave wants kinetic, energetic edits, flawless sound. |
| Baucheck24 / Bauplattform ("Start the next client ad brief") | Waiting | Choose German voice: Piper "Thorsten" now, or keep waiting for Microsoft. Latest EN v8, DE final. |
| Bau-Kunden ad | Done, paid | Finals EN 9:16 v7 / DE v5 are on SamTeck's side, not in the project. |
| Excel Academy app advert | Waiting on SamTeck | Upload old `excel-ad/source` zip; send client message (stats, Android-only button, ₦320k offer). |
| Tahir intro ad | Waiting on SamTeck | Upload the 90 s renders so the 60 s Status cut can be made; source lost, only `Tahir Ad/script.json`. |
| Motion branch cleanup | Waiting on "go" | Move ~54 MB of reference/test media out of git (list in that thread / docs/HANDOFF.md). |
| Portfolio motion showcase | Waiting | Connect Google Drive; decide whether non-final Bau-Kunden/Baucheck24 renders get uploaded. No Tiqra video exists. |
| FDAC promo | Done | Tahir's work, keep off portfolio. v2 Remotion source in `FDAC Promo/v2/remotion-project`. |
| Client briefs desk, Dave's six videos, Motion skill, Shareable prompt, Import | Done | Briefs in `docs/briefs/`; skill in `docs/skill/`. Dave's 6 videos not made, €145 unconfirmed. |

## 4. Moving the large media (~2.1 GB, does not fit in git)
Git holds code and small assets only. Carry the media like this:
1. Download the project folder (Project files) from this account, or have a session upload it to Google Drive (connect the Google Drive connector first).
2. Keep the same folder names: `Bau-Kunden Ad/`, `Bauplattform Ad/`, `FDAC Promo/`, `Haixing Precision/`, `Motion Training/` (clips + renders), `Motion Library/` (1 GB: SFX, HDRIs, fonts, GLBs, installers).
3. In the new project, upload the folders you need. Priority: `Motion Library/` (needed for builds; `setup.sh` reinstalls tools from it), then `Motion Training/clips`, then the current job's folder. Old renders (v1–v7) are optional.
4. Skip `uploads/`: raw copies; the useful parts are already digested. It also contains personal data from the account exports.

## 5. Credentials to re-add (none are stored here)
- **ElevenLabs**: add your API key as environment variable `ELEVENLABS_TOKEN` (not `_API_KEY`) in the new cloud environment settings. Voice IDs: Brian `nPczCjzI2devNBz1zQrb`, plus clone `BK_Clone` (lives in your ElevenLabs account, so it carries over automatically).
- **GitHub**: connect at claude.ai/connect-github and install the Claude GitHub app on the repo.
- **Google Drive** connector (for portfolio videos and media transfer).
- Network policy: allow the ElevenLabs API host; Google Fonts and Pixabay were blocked before, so local fonts in `Motion Library/fonts` are used (`REMOTION_LOCAL_FONTS=1`).
- Optional: Gmail / Figma connectors if you used them.

## 6. Keeping this pack current
Any session that finishes or changes a job should update section 3 and `memory/`, then copy the pack to the branch.
