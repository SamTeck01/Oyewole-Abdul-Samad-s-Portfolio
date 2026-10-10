# Rothme: Explainer video (plan)

Status: **PLAN — waiting for SamTeck's OK.** Nothing built yet.
Same client, same brand world as the product ad (dark navy, indigo glow, glass UI, DM Sans / Space Grotesk, the rebuilt R mark).

## What's different from the product ad
| | Product ad | Explainer |
|---|---|---|
| Job | Stop the scroll, make people curious | Make people **understand** Rothme and want a demo |
| Length | 36.7 s | **~75 s** + 2 s samteck card |
| Sound | Music only | **Voiceover** + soft music (≥15 dB under the voice) + SFX |
| Pace | New idea every 1.5–3 s | Calmer: one idea per sentence, UI held long enough to read |
| Formats | 16:9 + 9:16 | **16:9 first** (website, YouTube, sales calls); 9:16 cut-down only if wanted |

Reference: the Workly video (it's a "SaaS explainer") for structure and UI moves: problem → product → step-by-step UI → result → logo. We keep our own Rothme look and new moves.

## Story (all facts from rothme.app)
Problem → Meet Rothme → **Connect · Understand · Act** (the site's own 3 steps) → proof numbers → CTA.

## Script (VO, ~185 words ≈ 75 s)
1. **Problem.** "Your marketing lives everywhere. Ads in one place. Social in another. Your website, your email, your sales: each one tells part of the story."
2. "So you end up with too many dashboards, reports that are hard to understand, and problems nobody notices until leads are lost."
3. **Product.** "Meet Rothme. It brings your marketing together, shows what's working, and tells you what needs attention."
4. **Step 1, Connect.** "First, connect. Link your ads, social, analytics, email, CRM and store with secure connections."
5. **Step 2, Understand.** "Next, understand. Everything lands in one dashboard. Your Marketing Health Score shows how your marketing is doing at a glance. And if a number confuses you, click it. The Marketing Cheat Sheet explains it in plain English."
6. **Step 3, Act.** "Then, act. Lead Audit watches for broken tracking, disconnected integrations and lost leads, so you can fix problems before they cost you. Reports are ready when you need them, and AI help is there only if you want it."
7. **Proof.** "Fourteen-plus platforms. A hundred and fifty-plus metrics. A hundred-plus health checks."
8. **CTA.** "Rothme. Stop guessing. Start understanding your marketing. Get a demo at rothme dot app."

## Beat sheet (16:9, times approximate until the VO is recorded; the picture is re-timed to the voice)
| # | ~Time | VO | Picture | Motion |
|---|---|---|---|---|
| 1 | 0–6 s | "Your marketing lives everywhere…" | Six platform "islands" float in the dark (Ads, Social, Website, Email, Sales), each a small glass card with its own numbers. **Hook frame: first cards already on screen** | Camera drifts between them; each island lights up as it's named |
| 2 | 6–12 s | "…too many dashboards… leads are lost." | The 4 problems from the site as cards: Too Many Dashboards · Hard To Understand · Problems Go Unnoticed · Leads Get Lost. A lead (dot) falls through a gap and fades | Cards stack; red/amber pings; one lead drops |
| 3 | 12–18 s | "Meet Rothme…" | The R mark builds (bars → arrow → R), wordmark, tagline "Know what's working in your marketing." | Logo build (different from the ad: the islands get pulled into the mark) |
| 4 | 18–26 s | "First, connect…" | Step label **01 Connect**. Integrations list by category (Social, Analytics, Advertising, Communication, CRM, Commerce) with status chips Connected / Syncing, exactly like the site. Cursor clicks "Connect" on Shopify → Syncing → Connected | Rows slide in by category; cursor; status flips |
| 5 | 26–40 s | "Next, understand…" | **02 Understand**. Full dashboard builds; zoom to Health Score 94 "Excellent"; cursor clicks CTR 3.42% → Cheat Sheet card: "Click-Through Rate (CTR): the percentage of people who clicked after seeing your content or advertisement." | Dashboard build, camera zoom-ins, cursor, card pop |
| 6 | 40–56 s | "Then, act…" | **03 Act**. Lead Audit: website monitoring, tracking, lead capture, email, integrations. One issue goes amber → cursor → resolved green. Weekly Marketing Report card slides in ("Monday"). Small "AI optional" toggle switched off/on | Checklist ticks, issue → fix, report card |
| 7 | 56–66 s | "Fourteen-plus platforms…" | Big counters: **14+** platforms · **150+** metrics · **100+** health checks (+ 500+ educational topics on screen) | Counters roll up on each word |
| 8 | 66–75 s | "Rothme. Stop guessing…" | Logo + "Stop guessing. Start understanding your marketing." + **rothme.app** + "Get a demo" button pressed | Logo lock-up, button press |
| 9 | 75–77 s | — | "made by / samteck" | End card, last chord rings |

## Voice
- Kokoro TTS (free, commercial OK). I'll make **2 takes** for you to pick: `am_michael` (calm male, the voice you used for Hebei) and `af_heart` (warm female).
- **Brand name pronunciation, needs confirming:** I'm guessing **"ROTH-mee"** (it looks like it's built from R. Othmer). Please ask Riley how he says it. Until then I'll phoneme-mark it as ROTH-mee.
- Every take gets checked with faster-whisper; the picture is re-timed to the chosen take.

## Music and SFX
- New track (not the ad's): warm, slower (~96 BPM), soft keys and pads, light drums, ≥15 dB under the VO while words are spoken, lifting in the gaps and at "Meet Rothme" and the end.
- SFX: soft clicks for cursor and status flips, whooshes between the three steps, ticks for counters, a chime on "resolved", logo hit.
- Master −14 LUFS / −1 dBTP.

## Screens to design in code
Integrations list by category (site's own list and statuses) · dashboard (reused from the ad) · Health Score · Cheat Sheet card · Lead Audit checklist (Website Monitoring, Tracking Monitoring, Lead Capture Monitoring, Email Monitoring, Integration Monitoring, from the site) · Weekly Marketing Report card · stat counters.

## Left out on purpose
- **Prices** ($100 / $150 / $300 on the site): prices change and would date the video. Easy to add if Riley wants.
- **Lead Map**: it's behind the login, so I can't see it to show it correctly.

## Need from you
1. OK on this plan (or changes).
2. How Riley says "Rothme".
3. Voice preference, or "show me both".
