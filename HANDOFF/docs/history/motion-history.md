# Motion work history (imported 2026-10-19)

Digest of SamTeck's Claude exports (chats, account memory, cloud projects, an edit skill), keeping only motion and video work. Sources are noted in brackets. Non-motion material (Raqim, KOTBridge, Lulu CRM pages, coursework, other websites) was skipped.

## How SamTeck wants motion work done

These are standing rules, mostly from the "Motion Videos" cloud project (19 Oct) and `CLAUDE.motion-studio.md` / `ADV/HANDOFF.md` on the motion branch.

- **Branch:** all Motion Studio work lives on `claude/project-thread-wgsl7b` in SamTeck01/Oyewole-Abdul-Samad-s-Portfolio. SamTeck said on 19 Oct: no PRs, commit and push straight to that branch.
- **Save tokens to the max:** short replies, read only the files needed, small command output, no re-reading or re-rendering without need.
- **No scattered threads:** route related asks into an existing thread instead of starting new ones.
- **Brief first, wait for OK.** "Don't create yet" means don't build or spend credits. Order: brief, assets, voice options, preview and contact sheet, finals. Check stills before rendering because renders are expensive.
- **Sell the result, not the service.** Show the customer's outcome ("a full calendar"), never the tools ("we run Google ads"). The Bau-Kunden client rejected a service-led script.
- **Voice:** male by default, human and emotional, "confident with emotion, this should be an ad". Every free TTS (Edge, Piper, Chatterbox, Zonos, Orpheus) was rejected by the Bau-Kunden client. What passed: an ElevenLabs instant voice clone, `eleven_multilingual_v2`, stability 0.5, style 0.2, `mp3_44100_128`, at most 3 parallel requests, called with curl. Clone only with the voice owner's consent. SamTeck also asked for ElevenLabs on the Excel ad. Kokoro is fine for drafts.
- **Pronunciation matters:** phoneme-mark brand and personal names and send samples. Examples: ACCA said "aka", ICAN "I-can", CIMA "see-ma" (Excel ad); Tahir Adewale Oyewole with stress ah-DEH-wah-leh, oh-YEH-woh-leh (Tahir ad).
- **Pacing slower:** `atempo=0.95`, about 0.32 s base gaps, about 0.5 s before the turn to the solution and before the close. When a client says "too fast" or "laggy" it usually means the voice, so fix audio first and ask before changing motion.
- **Specs:** Meta/Reels ads 30–45 s, hook in the first 3 s, 9:16 first at 1080×1920 60 fps, plus 16:9 as a separate composition. Files under 20 MB (x264 veryslow, crf 16–19). Master to −14 LUFS / −2 dBTP. Check each voice take with faster-whisper (`HF_HUB_OFFLINE=1`).
- **Look:** real brand logo and colours, smooth motion with no shake, high impact ("flabbergast" the client). Never ugly real screens; design screens in code when needed. New animations each time.
- **Prefer free tools.** Paid only when free clearly failed and SamTeck agrees.
- **English:** in claude.ai chats SamTeck asked Claude to correct his English before answering [account memory]. Not applied in Projects threads so far.

## Clients and jobs

### Dave (lulu.tech), main middleman [chat "Chat review request", 16 Oct; cloud memory]
- Dave brings clients one by one and pays SamTeck per motion video (invoiced via Raenest, in euros). One Bau-Kunden fix was €20; a €145 payment for 6 further videos was unconfirmed on 16 Oct, and those 6 videos were not made yet.
- SamTeck is also a frontend dev on Dave's Lulu AI CRM team (not motion work).
- Dave can be touchy about payment follow-ups ("Bro relax, why you always pushing"), so keep chasing polite.
- Inferred, not confirmed: the Bauplattform spec PDF says "Vorbereitet für David Kumar", likely the same Dave.

### Bau-Kunden ad (Facebook, DE + EN), paid [HANDOFF.md; Dave chat]
- Folder `ADV/Bau-Kunden Ad/`; renders in `/mnt/project-files/Bau-Kunden Ad/`. Finals per HANDOFF.md: EN 9:16 v7, DE 9:16 v5.
- Dave's feedback on 15 Oct: one section felt laggy, and the German voice jumped too fast from "gesehen" to "angefragt". He disliked that voice. English was confirmed perfect, so only the German was fixed.
- Follow-up "full calendar" script (v8–v10) is where ElevenLabs passed and pacing was slowed.

### Baucheck24 / Bauplattform film [Dave chat; existing memory]
- Dave wants this one "epic". SamTeck planned to find reference videos to show him first. Dave's style reference was an Instagram reel (https://www.instagram.com/reel/DeZgT_moPDU/), which Claude could not open because Instagram is blocked.
- Another thread owns the current brief and files for this job.

### Excel Group: Excel Academy app advert (milestone 1) [chat "Excel" 17–18 Oct; cloud project "Excel"]
- Client "Excel Group" is a teacher who owns Excel Academy (exam prep for ICAN, ACCA, CIMA, CITN, CIBN, ANAN, CIS, CFA, CFE, CPA) and Parkview Realty. Deal order: motion video first, then the Excel Academy course website, then Parkview (rebranded Vemu Homes), paid per milestone.
- Price not agreed: SamTeck asked ₦350k total, client says ₦300k max. Draft split was video ₦70k (₦50k start, ₦20k on delivery). SamTeck has told the client ₦90k is his normal price for one video. The client pays "small small" as work progresses and anchors low.
- The ad was built in another project's cloud folder (`excel-ad/`, not in this project): Remotion 4, 46 s, 16:9 and 9:16, with voiceover and music-only cuts. Amapiano-style beat made in Python, real logo and orange #FF822B / dark #15161C from `SamTeck01/excel-academy-dashboard`, tagline "Your pathway to Success".
- Client feedback, all done: add a voiceover; logo screen reads "Introducing Excel Academy App"; stats heading "Trusted by students worldwide". SamTeck picked "Voice A" (confident male, Kokoro) and asked for high-quality audio (rendered at 320 kbps).
- Open on 18 Oct: the App Store badge (the app is Android APK only, no iOS build) and whether the website stats (5,000+ students, 4.9/5, 15+ tutors) are confirmed by the client.
- The client sent 3 sample videos on 11 Oct and loved "the clean one".

### Tahir ad (SamTeck's own motion-designer intro ad) [cloud transcripts, 14 and 19 Oct]
- Two 90 s videos (16:9, 9:16) in Remotion with Kokoro voice and code-made music; the VO opens "Hi. I'm Tahir Adewale Oyewole, motion designer…". SamTeck chose pronunciation A and asked for livelier music.
- A 60 s 9:16 cut for WhatsApp Status was offered and never made. The 19 Oct thread started moving the pipeline into `ADV/Tahir Ad/` but hit the usage limit; that folder is not on the branch yet. The rendered videos aren't in git or Drive.

### Other jobs on the motion branch [branch review, 19 Oct]
- **Hebei Xiangjin Xin** (fastener factory): finished, about 44 s, Xometry-style reference, Michael VO. Chinese version stopped at SamTeck's request.
- **Leah Luxe** (Ibadan beauty/gadgets store): 9:16 TikTok clearance-sale ad, no voice, pink theme; v2 is 62 s (16 Oct).
- **Rothme**: product ad with logo rebuild, 16:9 and 9:16 (10 Oct).
- **FDAC promo**: see project memory and `/mnt/project-files/FDAC Promo/`.
- The 19 Oct review found only Hebei and Bau-Kunden documented in HANDOFF.md, about 95 MB of reference videos and raw takes in git, and a non-motion `ADV/linkedin` folder. SamTeck had not said go on that cleanup.

### Portfolio showcase [cloud project "Motion Videos"; chat "Motion graphics portfolio" 14 Oct]
- SamTeck wants a portfolio as a motion graphics designer alongside his web work. A placeholder single-page "video timeline" portfolio was built in chat on 14 Oct.
- PR #3 (merged into the motion branch) added a Motion section to the portfolio site with two videos from his Drive "Motion" folder: Product Ad (vertical) and Food Bridge Explainer (widescreen). More finals, including Tahir, still need uploading.

### Training videos (open) [cloud project "Motion Videos", 19 Oct]
- SamTeck uploaded 9 short clips (13–32 s, mostly 1024×576) and asked Claude to study them fully and learn to make exactly those videos. Usage ran out before any work started. The clips are not in these exports.

## Environment lessons from the exports
- ElevenLabs needs `api.elevenlabs.io` allowed in the cloud environment and an API key as an env variable.
- Figma MCP is on the Starter plan and hits its call limit quickly; export frames as PNG/PDF instead.
- Instagram and Google Drive are blocked from the cloud; ask SamTeck to attach video files directly. Contact sheets: `ffmpeg -vf "fps=1/4,scale=640:-1,tile=4x4"`.
- Remotion needs local fonts (Google Fonts is unreachable) and may need `--browser-executable` pointing at the Playwright headless shell.

## Skill in the export
`Claude_edit_skill` holds an "editorial-film-edit" skill (archival editorial style edits of real footage). Its SKILL.md was proposed to SamTeck for review, not written to disk. Its `references/` folder (style guide, reference media, implementation guide) was not in the zip, only some browser JS modules.
