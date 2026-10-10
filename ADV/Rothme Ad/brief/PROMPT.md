# Rothme: Product Ad (spec piece for Riley Othmer)

Status: **Approved ("do the best"). Building preview v1.**

### Changes made at build time (after reading all of rothme.app)
- Logo rebuilt in vector from the app icon: `assets_in/brand/rothme_mark.svg`. Wordmark "ROTHME" in Space Grotesk.
- No waitlist. End line: "Stop guessing. Start understanding your marketing." + rothme.app (both from the site).
- The site says AI is optional, so the AI Brief beat became the **Marketing Cheat Sheet** (CTR explained in plain English, the site's own copy).
- Three-word line is the site's own: **"Connect. Understand. Act."**
- Headlines use the site's style: one word in italic indigo ("Your marketing data is *everywhere.*").
- Platform logos: Simple Icons brand glyphs, small, on dark tiles, like Rothme's own site.
- Length: 34.5 s ad + 2.2 s samteck card = 36.7 s. Music at 120 BPM.
Next after this: Explainer video (separate brief, after this ad is approved).

## 1. Client and product
- **Client:** Riley Othmer (Discord: r1ley0thmer), marketer, business owner. Wants a sample before buying; says he has more clients lined up.
- **Product:** Rothme, https://rothme.app (waitlist / demo stage). App URL shown on site: app.rothme.com
- **What it does (from the site):** "Connect your marketing platforms. Rothme brings your data together, shows what's working, and identifies what needs attention."
- **What we're really selling (the outcome):** *clarity.* You stop guessing which marketing works.
- **Audience:** small and medium business owners and marketers who run ads and socials on 5+ platforms and drown in tabs and reports.

## 2. Reference study (contact sheets in `brief/contact/`, every 0.5 s)

Both references are music-only (no voiceover; checked with faster-whisper: no speech). 16:9, 30 fps, ~28–33 s. Light, white/ice-blue, frosted UI, one hero colour (electric blue).

### Ref A: Workly (27.9 s), `workly_01–04.jpg`
| Time | What happens | Move |
|---|---|---|
| 0–3.5 s | Chat bubbles pile in from all sides, tilted ("Can you check this real quick", "Where's the latest file?"). Chaos | Spring pop-ins, rotate, overlap, slight camera push |
| 4–7 s | Clean white: "Can't keep up?", letter-spacing breathes in/out | Kinetic type, tracking animation |
| 7–9 s | "Meet your new AI workspace", words colour in one by one | Word-by-word gradient reveal |
| 9–12 s | Frosted blue folder icon drops beside the text; cursor clicks it | Glassmorphism icon, cursor tap |
| 12–13.5 s | Folder drops into a tilted 3D app window (upload box) | 3D perspective tilt, depth blur |
| 13.5–16 s | "Built-in" → "Business analytics"; dashboard rises from the bottom | Type swap, push-up reveal |
| 16–17 s | Blue ribbon wipes across the screen | Shape wipe transition |
| 17–21 s | Phone with AI chat, blue ribbons wrap around it; "Chat With our AI Bot" staggered | 3D phone, ribbon swirl, staggered type |
| 21–25 s | "No more chaos." → white notification cards stack across a blurred dashboard | Card cascade, depth of field |
| 25–28 s | "Workly" logo + "Turn messages into action." Fade out | Simple logo lock-up |

### Ref B: LangEase (33.1 s), `langease_01–05.jpg`
| Time | What happens | Move |
|---|---|---|
| 0–2 s | "Turn Books → Audio": one word at a time, big, motion-blurred in | Word-by-word kinetic type with blur |
| 2–4.5 s | "Any language [folder icon] Instantly"; cursor grabs the folder | Icon inline with type |
| 4.5–6 s | Folder flies into a frosted app window | 3D drop-in |
| 6–10 s | Camera flies through a tunnel of phones; "Books. Audio. Video" → "All In One Platform" | 3D tunnel fly-through, heavy motion blur |
| 10–13 s | Blue paint swoosh becomes a progress bar: 63 → 90 → 98 → 100/100 | Shape morph + counter |
| 13–14.5 s | "Done" + check circle + confetti burst | Success moment |
| 14.5–17.5 s | Video cards slide in a row → app library tilted in 3D; cursor taps a card | Carousel → 3D UI, cursor |
| 18–20 s | Card spins, copies fly out: "Multiple Languages" | Card fan-out |
| 20–24 s | List view; zoom to one row; cursor clicks "Distribute To Youtube" | Zoom-to-detail, button press |
| 24–26 s | Button morphs into a big sparkle star that flies off | Shape morph |
| 26–28 s | "Translate. Dub. Distribute" | Three-word rhythm |
| 28–33 s | Logo mark + wordmark + "langease.ai" | Logo build |

### What we take from them
- **Structure:** pain/chaos → "can't keep up?" → meet the product → 3–4 quick feature beats with real UI and cursor → success moment → three-word summary → logo + URL.
- **Pacing:** a new idea every 1.5–3 s; nothing sits still; type and UI take turns.
- **Moves:** word-by-word kinetic type, frosted icons inline with text, 3D-tilted app windows, cursor taps, counters, a success burst, a shape morph into the logo.
- **Sound:** music only, a soft upbeat pop/electronic bed, clicks and whooshes on every move. (Ref loudness was −9.6 LUFS; we master to −14.)

### What we change (new moves, not a copy)
- **Colour:** both refs are white/blue. **Rothme's brand is dark**, so we flip it: deep navy-indigo night with an indigo glow and white UI on dark glass. Same clean, premium feel, but it's clearly Rothme.
- **Our own signature moves:** a **"tab storm"** of platform logos and dashboards (instead of chat bubbles); a **Health Score dial** that sweeps 0 → 82 → 94; **data threads** that fly from each platform into one dashboard; the **R mark's arrow** shooting up a growth chart into the logo.

## 3. Brand (from rothme.app; to confirm with Riley)
- **Logo:** app icon `assets_in/brand/icon.png` (white R, blue arrow and bars, dark rounded square, only 192 px) + wordmark "ROTHME" in Space Grotesk. **Need a big SVG/PNG logo from Riley** (or I'll rebuild the mark in vector to match, and he OKs it).
- **Colours (site CSS):** background `oklch(14% .04 275)` ≈ #0B0D24 navy · surface ≈ #141638 · primary indigo `oklch(60% .24 275)` ≈ #6366F1 · foreground ≈ #F3F4FA · success green (emerald) for "Healthy" · logo blue ≈ #2F80FF.
- **Fonts:** DM Sans (UI and body), Space Grotesk (wordmark, headlines), JetBrains Mono (small labels). All on @fontsource.
- **Icons:** Lucide (the site uses Lucide).
- **Platforms shown on the site:** Meta, Google Ads, Shopify, Mailchimp, Instagram, TikTok (+ Facebook, LinkedIn, YouTube, Google Analytics). Brand marks of these appear small, like on Rothme's own site. Ask Riley if that's OK; else neutral icons.

## 4. Concept: "Know what's working."
Your marketing is everywhere: 9 tabs, 6 dashboards, zero answers. Rothme pulls it all into one screen and tells you what's working, in plain words.

- **Format:** 16:9 1920×1080 + 9:16 1080×1920 (separate layouts), 60 fps.
- **Length:** ~32 s + 2 s samteck end card ≈ 34 s. Hook inside 3 s.
- **Voice:** none (music-led, like both refs). Big on-screen type carries the message, so it also works muted in the feed.

## 5. Beat sheet (16:9; 9:16 stacks the same beats vertically)

| # | Time | On screen | Motion | Sound |
|---|---|---|---|---|
| 1 | 0.0–3.0 | **Tab storm:** browser tabs and mini dashboards (Meta Ads, GA, Shopify, TikTok, Mailchimp) slam in from all sides, tilted, numbers flickering. Notification pings stack: "CTR down 0.4%", "Report due", "Which ad worked?" | Spring pop-ins, camera shakes in slightly, gets denser | Rapid pings and pops building, music filtered |
| 2 | 3.0–5.5 | Everything freezes and falls away. **"Which marketing is actually working?"** word by word | Hard cut to dark, words blur in | Riser cut off, one low hit |
| 3 | 5.5–8.0 | "Meet **Rothme**." R app icon spins up between the words, glow blooms | Icon inline with type (glass tile) | Music drops in, logo shimmer |
| 4 | 8.0–11.5 | **Connect:** platform icons float around; cursor taps "Connect" on each; data threads shoot from each icon into the centre. Counter "Connected platforms 1 → 14", "All syncing · 2 min ago" | Threads converge, 3D tilt | Click + whoosh per icon, chord |
| 5 | 11.5–15.0 | **"One dashboard."** Threads form the Rothme dashboard (real layout: Health Score, Lead Audit, Growth chart, Activity). It tilts in 3D, glass cards | Dashboard builds card by card, camera dolly with motion blur | Soft impacts per card |
| 6 | 15.0–18.5 | **Health Score:** zoom on the dial, sweeps 0 → 82 → 94 / 100 "Excellent", "+4 this month" | Ring sweep + counter | Rising tick, success chime |
| 7 | 18.5–21.5 | **"What's working."** Platform Performance bars race: Instagram 92, Facebook 74, TikTok 61, LinkedIn 48, YouTube 39; Instagram row glows green | Bars grow staggered | Tick per bar |
| 8 | 21.5–24.5 | **"What needs attention."** Lead Audit card: "Healthy · 142 leads tracked · 1 action recommended"; cursor taps the action, it expands; Conversions −1.9% flagged amber | Card flip / expand | Tap, soft alert tone |
| 9 | 24.5–28.0 | **AI Brief:** Weekly Report card types itself: *"Your ads are quietly having their best week of the quarter."* "high confidence · ready to share" → cursor taps Share → check + small burst | Typewriter, success burst | Typing ticks, success hit |
| 10 | 28.0–30.0 | **"Connect. Understand. Grow."** three-word rhythm | Each word swaps in on the beat | Three hits |
| 11 | 30.0–32.0 | The R logo's arrow shoots up a growth line → R mark + "ROTHME" + "Know what's working in your marketing." + **rothme.app** | Shape morph into logo | Logo whoosh + final chord |
| 12 | 32.0–34.0 | "made by / samteck" end card | Standard end card | Chord rings out |

All numbers are the site's own sample data (it says "Sample dashboard shown with example data").

## 6. Script (on-screen text, no VO)
1. Which marketing is actually working?
2. Meet Rothme.
3. Connect every platform.
4. One dashboard.
5. Know your Marketing Health.
6. See what's working.
7. Fix what needs attention.
8. Get the weekly brief, written for you.
9. Connect. Understand. Grow.
10. Rothme: Know what's working in your marketing. rothme.app

## 7. Music and SFX
- **Music (made in code):** warm modern electronic-pop, ~118 BPM, filtered intro under the tab storm → full drop at "Meet Rothme" → lift at the Health Score → final chord under the logo, ringing into the end card. Cuts land on the beat.
- **SFX:** pings/pops (storm), riser + hit (question), shimmer (logo), click per connect, whoosh per thread, soft impacts per card, rising ticks (dial, bars), tap + alert (attention), typing ticks, success chime + burst, three hits, logo whoosh.
- **Master:** −14 LUFS / −1 dBTP.

## 8. Screens to design in code (no real app access; the site's dashboard is the source)
Health Score dial · Lead Audit card · Growth chart · Connected Platforms grid · Platform Performance bars · Marketing Metrics tiles · Recent Activity list · Weekly Report / AI Brief card · full dashboard with sidebar (Dashboard, Analytics, Lead Audit, Marketing Health, Cheat Sheet, Reports, Integrations…). Copy and numbers taken exactly from rothme.app.

## 9. Assets
- **Have:** app icon (192 px), OG image, site screenshot, colours, fonts, copy, sample data.
- **Need from Riley (nice to have, not blocking):** large logo (SVG), OK on showing platform logos, confirm the CTA ("rothme.app" / "Join the waitlist" / "Give me a demo").
- **No photos or stock needed.**

## 10. Delivery
Preview v1 (16:9) + contact sheet → feedback → 9:16 → finals + FLAC stems + README.
