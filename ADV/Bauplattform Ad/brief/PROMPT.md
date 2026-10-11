# Architecture & Construction Platform: Product Film (EN + DE)

Status: **Draft v3 (vaylens reference), waiting for SamTeck's OK.** Nothing built yet.

Open items before build (defaults in brackets are what I'll use if you just say "go"):
1. **Product name + logo + colours.** The PDF has none. [Working title "[NAME]", neutral wordmark slot, palette below. Real name and logo go in before finals.]
2. **Reference:** vaylens brand film. Kinetic type + Blender 3D, no real images, see §3–§8.
3. **Length.** Client said "very detailed, any length". [~5:30 main film, 16:9. A 45 s Meta cutdown is an optional extra after the film is approved.]
4. **German voice.** Kokoro has no German. [Piper `de_DE-thorsten-high` (free, offline). ElevenLabs Multilingual only if an `ELEVENLABS_API_KEY` is added to the environment secrets.]
5. **German script check.** I write it from the client's own German wording, but a native read-through by the client or Dave is strongly recommended before VO.

---

## 1. Client and product
- **Source:** `architektur_bauplattform_vollstaendiger_funktionsumfang_de.pdf` (57 pages, Master 2.0, 30 Sep 2026, "Vorbereitet für David Kumar"). Copy in project files: `uploads/hearth/71a0df57-…`.
- **What it is (their one-sentence definition, p. 36):** "Eine autonome, mandantenfähige Architektur- und Bauplattform, die Designsoftware, Projekte, Mitarbeiter, Gewerke, Lieferanten, Materialien, Finanzen und Kommunikation in einen kontrollierten End-to-End-Ablauf verbindet."
- **Stage:** a specification, not a shipped app. So every screen is **designed in code** (no captures), and the film must not claim live customers, numbers or certifications.
- **Who it's for (p. 10):** architecture offices, general contractors, construction companies, interior fit-out and specialist trades.
- **What we're really selling (the outcome):** *one controlled flow from first enquiry to building handover*, where repeatable work does itself and people only approve what matters. Key line from the PDF: "100 % der wiederholbaren, digitalen und regelbasierten Arbeit wird automatisch erledigt. Kritische Entscheidungen bleiben kontrollierbar."
- **Facts that must be right (from the PDF):**
  - 8-phase flow: Projektanfrage → Planung → Kalkulation → Angebot → Auftrag → Ausführung → Finanzen → Abschluss.
  - One central AI orchestrator + specialist agents, never one unchecked "universal agent".
  - Autonomy levels: **Grün** fully automatic, **Gelb** automatic within rules, **Orange** prepared, needs approval, **Rot** never automatic (bank payment, legally binding contract, safety approval, dismissals).
  - Agent rules: source on every statement, deterministic calculations, four-eyes check, escalation under a confidence threshold, versioning, sandbox first, safe fallback.
  - Named integrations: Revit/AutoCAD, Archicad, SketchUp, IFC/OpenBIM, BCF, Blender, Unity, GAEB, Datanorm, DATEV, Lexware, XRechnung, ZUGFeRD, Peppol, SEPA, Microsoft Graph, Google Workspace, BACnet, KNX, OPC UA, MQTT, OpenXR.
  - Hardware: AR/MR + VR headsets, rugged tablets, LiDAR/3D scanners, total stations, GNSS, drones, 360° cameras, smart helmets, RFID/QR, IoT sensors.
  - Optimisation (Part C, "highest priority"): compares **best, fastest and safest** variant on cost, time and CO2.
- **Third-party logos:** I show integrations as **text chips** (e.g. "DATEV", "IFC"), not their logos, unless the client confirms partnerships. Safer for a spec-stage product.

## 2. Format
- **Main film:** 16:9, 1920×1080, 60 fps, ~5:30 + samteck end card. Chaptered so it can be cut later.
- **Two languages:** EN and DE, same picture. All on-screen text switches per language (i18n file, like the HXX job). Picture re-times to each VO with the time-warp trick, so DE (usually ~10–15 % longer) doesn't get squeezed.
- **9:16:** not for the 5-min film (nobody watches 5 min vertical). Offered later as 30–45 s cutdowns per language.
- **Render estimate:** about 70–80 min per 5:30 render at 1080p60. EN + DE finals ≈ 2.5–3 h of rendering, run one after another in the background.

## 3. Reference: vaylens brand film (`assets_in/reference/ref2_3d.mp4`)
1:12, 1920×1080, 30 fps. Contact sheets every 1 s: `brief/contact/ref2_01–03.jpg`. (The earlier ArangoAI cartoon reference is dropped.)

**How it works:** a calm female VO, and **every spoken word appears on screen as kinetic type**, typed or rolled in word by word, in sync with the voice. Between lines come full-frame media shots (stock photos in vaylens; **3D renders in ours**) and bold graphic transitions.

| Time | What happens | Technique to rebuild |
|---|---|---|
| 0:00–0:03 | "Managing electric car charging stations" on flat electric blue, word by word | Small white type, words drop in with baseline wobble |
| 0:03–0:08 | "shouldn't be rocket science", grid of rounded photo tiles drifting, then tiles fly off | Media grid slides diagonally, tiles fall away one by one |
| 0:08–0:10 | "complicated", "intimidating" alone on black | Single word, centre, hard cut per word |
| 0:09 | Giant cropped letters ("ntir") fill frame | Oversized type as a wipe |
| 0:11–0:15 | "we built" on a blue circle-shape wipe, logo mark morphs (drop shape), wordmark, then logo in a colour grid | Shape morph → logo; logo colour-variant grid |
| 0:16–0:19 | Brand system: type specimen "Aa", colour swatches, angled posters, logo on a big screen | Brand-identity montage |
| 0:20–0:24 | "It's a charging management software" over a blue-violet blur, then the product UI on a table, top view, frosted glass dashboard | Blur gradient, frosted glass UI over the media |
| 0:25–0:36 | "with every business", pill-label words ("don't have resources", "product", "partner") over blurred media; arrow inside a blue square | Pill tags, rounded media frames, cut-outs, icon squares |
| 0:37–0:44 | Tiny lines of text on blue, "the way we [image] recharge them" with an inline image between words | **Inline media inside the sentence** |
| 0:44–0:52 | "At vaylens", big V shape wipe with a yellow dot, "tools / services", "as easy →", "buy · use · monetise" vertical list with a moving dot | Shape wipes, rolling vertical list, arrows |
| 0:52–0:60 | "charging infrastructure", "helping thousands of companies" 4-photo grid, "feel → confident", "and freeing up time" arched type | Split layouts, curved text, arrow glyphs |
| 1:00–1:08 | "worthwhile" huge, "everyone's investment ↗", "to [face] all" inline media | Huge words, inline media |
| 1:08–1:12 | Logo mark spins, wordmark types on black | Logo resolve |

**Style rules:** palette of electric blue `#3D3DF5`, near-black `#18181B`, off-white `#F0EFF7`, one accent yellow `#F2C94C`. One grotesk font (Neue Haas style; we use **Inter Tight**, free) in regular/medium, mostly small, with a few giant words. A cut every 1–3 s, hard cuts plus shape wipes. Lots of empty space. Rounded-corner media frames. Arrows (→ ↗) as graphic elements. Calm, confident, premium.

## 4. Concept: "Bauen sollte nicht kompliziert sein." / "Building shouldn't be this complicated."
The same story arc as vaylens, scaled up to the detail the client wants:
**problem → "that's why we built [NAME]" → brand → what it is → why it matters → how it works (8 phases) → control → promise → logo.**

- Every VO word is kinetic type, exactly like vaylens.
- Every vaylens photo becomes a **Blender 3D shot**: one stylised building in a clean studio world that we follow from blueprint to handover. Soft daylight, matte clay materials with blue accents, depth of field, slow orbiting cameras. No people's faces (simple matte figures at a distance only), no real photos or video.
- The product UI appears as frosted-glass panels over the 3D, like vaylens' dashboard shot.
- Length: about **4:00** (vaylens is 1:12; the client asked for detail). It can stretch to the full 5:30 script if you want every chapter.

## 5. Blender 3D shot list (one shared scene, rendered once, used for EN and DE)
1. **Chaos grid:** 12 rounded tiles of 3D mini-scenes (stacks of paper, a tangled cable, a crane, a red warning cone, a calculator) drifting diagonally, then falling away.
2. **Blueprint table, top view:** plan lines draw on a table; the building rises out of the paper (hero shot for "we built").
3. **Building grows:** floors stack one by one, isometric orbit (BIM chapter), with a section cut showing ducts and beams, and 3 clash points glowing orange then turning blue.
4. **Exploded floors:** floors separate vertically into quantity "blocks" (concrete, drywall, cable) for costing.
5. **Site:** crane, scaffold, delivery truck arriving, a drone orbiting and scanning (blue scan lines), a tablet on a site table.
6. **Invoice / document stack:** 3D paper stack, three sheets slide into alignment (three-way match), one rejects with an orange edge.
7. **Handover:** scaffold drops away, the finished building at golden hour, windows light up, small sensor dots pulse (digital twin).
8. **Logo moment:** the [NAME] mark extruded in 3D, rotates once and settles flat into the 2D logo.
All renders ≥120 frames per move at 1920×1080, Cycles or EEVEE (decided after a test), alpha where UI goes on top.

## 6. Beat sheet (~4:00 EN; DE re-timed to its VO). On-screen text = the VO words.

| # | Time | VO (EN) | Picture |
|---|---|---|---|
| 1 | 0:00–0:08 | Running a construction project shouldn't be rocket science. | Words on electric blue → 3D chaos grid drifts |
| 2 | 0:08–0:16 | Yet plans, costs, site and invoices live in forty different places. It feels complicated. Intimidating. | Chaos tiles fall away; "complicated" / "intimidating" alone on black; giant cropped letters wipe |
| 3 | 0:16–0:26 | That's why we built [NAME]. | Blue shape wipe, "we built"; 3D blueprint → building rises; logo mark morph; wordmark |
| 4 | 0:26–0:34 | (music only) | Brand montage: type specimen, colour swatches, logo grid, angled posters with 3D stills |
| 5 | 0:34–0:50 | It's one platform for architecture and construction, from the first enquiry to the finished building. | Blur gradient line; frosted dashboard over the 3D table, top view |
| 6 | 0:50–1:05 | Many firms fear they don't have the time or the people for another system. Or that AI will make decisions nobody can check. | Pill tags ("no time", "no people", "no control") over blurred 3D; arrow in a blue square |
| 7 | 1:05–1:20 | So at its centre is an AI orchestrator, with specialist agents that only use the tools you allow. | Node graphic: central dot, agent dots light up; "tools you allow" pill list with moving yellow dot |
| 8 | 1:20–1:35 | 1. Enquiry. Emails, plans and photos become a structured project. | Phase number giant; inline 3D thumbnail inside the sentence |
| 9 | 1:35–1:55 | 2. Planning. CAD and BIM, checked across every trade. Clashes found before they reach the site. | 3D building grows; section cut, clash points |
| 10 | 1:55–2:10 | 3. Costing. 4. Offer. Quantities come straight from the model. Offers wait for your approval. | Exploded floors; orange approval card "1,84 Mio. € freigeben?" |
| 11 | 2:10–2:25 | 5. Order. The best, the fastest and the safest plan, compared on cost, time and CO2. | Three columns, vertical list with moving dot (vaylens "buy · use · monetise") |
| 12 | 2:25–2:50 | 6. Site. Materials ordered within your limits. Drones and scanners measure progress. Defects become tasks. | 3D site: truck, crane, drone scan; "62 %" huge |
| 13 | 2:50–3:05 | 7. Finance. Invoices matched against order and delivery, booked to DATEV or Lexware. Payments, always by a person. | 3D paper stack match; red "never automatic" pill |
| 14 | 3:05–3:20 | 8. Handover. The building lives on as a digital twin. | 3D golden hour, windows light, sensor dots |
| 15 | 3:20–3:40 | Green, yellow, orange, red. You decide what runs on its own. And every step has a source and a name. | Four colour blocks wipe in like the vaylens colour grid; audit lines scroll |
| 16 | 3:40–3:55 | So your team gets time back for what it does best: building. | "freeing up time" arched type → "worthwhile"-style giant "building" |
| 17 | 3:55–4:05 | This is [NAME]. | 3D logo extrusion settles, wordmark types on black |
| — | +2 s | samteck end card | |

## 7. Voice & sound (like vaylens)
- **VO:** calm female voice. EN: Kokoro `af_heart` / `af_bella` (2 takes). DE: Piper German female voice (Kokoro has no German); ElevenLabs only if a key is added.
- **Music:** original, minimal, warm electronic with soft piano and a steady pulse, ≥15 dB under VO.
- **SFX:** subtle clicks per word group, soft whooshes on wipes, low hits on giant words, gentle 3D ambience (crane hum, drone whir), logo chime.
- **Timing:** the kinetic type is driven by word timestamps from the chosen VO (faster-whisper), so each word lands exactly when it's spoken. DE gets its own timing automatically.

## 8. Production plan
1. Brief OK (this).
2. **10 s style test:** shots 1–3 (blue words, 3D chaos grid, "we built" + building rising) to judge type and 3D together.
3. VO takes EN + DE → you pick.
4. Blender: model the one building + site set, render shot list (long background renders).
5. Remotion: full kinetic-type edit on the 3D, preview v1 EN with contact sheet → feedback.
6. DE version, finals, stems.

## 9. Script (long EN draft from v2, source for the beat sheet above)

Short, clear sentences, readable on a phone speaker.

**0 Hook.** One building. Forty programs. Hundreds of emails. And nobody sees the whole picture.
**1 Problem.** Plans live in one place. Costs in another. The site sends photos. Suppliers send invoices. And every gap costs time and money.
**2 Platform.** Meet [NAME]. One platform for architecture and construction, from the first enquiry to the finished building. At its centre, an AI orchestrator. It understands the job, picks the right specialist agent, and uses only the tools you allow. Rules and approvals control every real action. And every step is logged.
**3 Enquiry.** A new enquiry arrives. The intake agent reads the email, the plans and the photos, and turns them into a structured project. Location, scope, files, people. Done.
**4 Planning.** Planning starts in CAD and BIM. The model is checked across every trade. Clashes are found before they reach the site. And with Blender and Unity, your client walks through the building before it exists.
**5 Costing.** Quantities come straight from the model. Materials, labour and subcontractors are calculated with checked formulas, never guessed.
**6 Offer.** The offer agent prepares variants and margins. Anything this big waits for a person. One tap, and it's approved.
**7 Order.** The signed offer becomes a live project, with budget and schedule. The planner compares the best, the fastest and the safest option, on cost, time and CO2, and tells you exactly what each one trades off.
**8 Purchasing.** The material agent compares suppliers, orders within your limits, and books the delivery slot on site.
**9 Site.** On site, the team works on tablets, even offline. Drones and scanners measure progress against the model. A defect becomes a task for the right trade. Safety alerts reach the right people, fast.
**10 Finance.** Invoices are read and matched against order and delivery. If something doesn't add up, it's flagged before anyone pays. Clean bookings go straight to DATEV or Lexware. And payments? Always made by a person.
**11 Handover.** At handover, documents, warranties and maintenance are already in place. The building lives on as a digital twin, with live data from its sensors.
**12 Control.** You decide how much runs on its own. Green: fully automatic. Yellow: automatic within your rules. Orange: prepared, waiting for approval. Red: never automatic. Every action has a source, a time and a name.
**13 Close.** CAD, BIM, finance, site and building tech. One controlled flow. [NAME]. From enquiry to handover.

## 10. Script (DE draft, needs native check)
**0** Ein Gebäude. Vierzig Programme. Hunderte E-Mails. Und niemand sieht das Ganze.
**1** Pläne liegen hier. Kosten dort. Die Baustelle schickt Fotos. Lieferanten schicken Rechnungen. Und jede Lücke kostet Zeit und Geld.
**2** Das ist [NAME]. Eine Plattform für Architektur und Bau, von der ersten Anfrage bis zum fertigen Gebäude. Im Zentrum: ein KI-Orchestrator. Er versteht die Aufgabe, wählt den passenden Fachagenten und nutzt nur die Werkzeuge, die Sie freigeben. Regeln und Freigaben kontrollieren jede echte Aktion. Und jeder Schritt wird protokolliert.
**3** Eine neue Anfrage kommt herein. Der Projektaufnahme-Agent liest E-Mail, Pläne und Fotos und macht daraus ein strukturiertes Projekt. Standort, Umfang, Dateien, Beteiligte. Erledigt.
**4** Die Planung beginnt in CAD und BIM. Das Modell wird über alle Gewerke geprüft. Kollisionen werden gefunden, bevor sie die Baustelle erreichen. Und mit Blender und Unity begeht Ihr Kunde das Gebäude, bevor es existiert.
**5** Mengen kommen direkt aus dem Modell. Material, Arbeitszeit und Subunternehmer werden mit geprüften Rechenmodulen kalkuliert, nicht geschätzt.
**6** Der Angebotsagent erstellt Varianten und Margen. Alles in dieser Größe wartet auf einen Menschen. Ein Tipp, und es ist freigegeben.
**7** Aus dem angenommenen Angebot wird ein laufendes Projekt, mit Budget und Terminplan. Die Optimierung vergleicht die beste, die schnellste und die sicherste Variante, nach Kosten, Zeit und CO2, und zeigt genau, was jede kostet.
**8** Der Materialagent vergleicht Lieferanten, bestellt innerhalb Ihrer Limits und bucht das Lieferfenster auf der Baustelle.
**9** Auf der Baustelle arbeitet das Team mit Tablets, auch offline. Drohnen und Scanner messen den Fortschritt am Modell. Ein Mangel wird zur Aufgabe für das richtige Gewerk. Sicherheitswarnungen erreichen sofort die Richtigen.
**10** Rechnungen werden gelesen und mit Bestellung und Lieferung abgeglichen. Passt etwas nicht, wird es markiert, bevor jemand zahlt. Saubere Buchungen gehen direkt an DATEV oder Lexware. Und Zahlungen? Immer durch einen Menschen.
**11** Bei der Übergabe sind Dokumente, Gewährleistung und Wartung schon vorbereitet. Das Gebäude lebt weiter als digitaler Zwilling, mit Live-Daten seiner Sensoren.
**12** Sie entscheiden, wie viel selbstständig läuft. Grün: vollautomatisch. Gelb: automatisch nach Ihren Regeln. Orange: vorbereitet, wartet auf Freigabe. Rot: nie automatisch. Jede Aktion hat eine Quelle, eine Zeit und einen Namen.
**13** CAD, BIM, Finanzen, Baustelle und Gebäudetechnik. Ein kontrollierter Ablauf. [NAME]. Von der Anfrage bis zur Übergabe.

## 11. UI panels to design in code (frosted glass over the 3D)
1. Inbox + intake card (email, PDF, photos → project).
2. Project dashboard with phase rail.
3. Architecture diagram (orchestrator, agents, gateway, rules, audit).
4. BIM viewer with clash list (3 clashes).
5. Visualisation frame + VR headset view.
6. Quantity take-off + GAEB bill of quantities.
7. Offer variants + margin bars + Orange approval card.
8. Gantt + optimisation comparison (best/fastest/safest; cost, time, CO2).
9. Supplier comparison + order + delivery slot map.
10. Rugged tablet: daily report (offline badge), defect capture, safety alert.
11. Progress overlay (scan on model, 62 %).
12. Invoice three-way match + DATEV/Lexware booking + Red payment card.
13. Handover checklist + digital twin dashboard (sensors).
14. Autonomy levels board + audit log.
15. Integrations/hardware orbit.
All numbers are illustrative demo data (e.g. offer 1.84 M €, progress 62 %) and are marked as such in the README. No real customer names.

## 12. Assets list (needs OK before any downloads)
- From client: **product name, logo (SVG), colours, font** (if any). Otherwise placeholder wordmark.
- Built here: all characters, the isometric building, all UI, icons from Lucide. No downloads needed.
- Optional photos (Unsplash/Pexels, logged in `assets_in/CREDITS.md`): a construction site at dawn, a site team with a tablet. Only if you OK them; the default is fully designed, no photos.
- Tools to install: Remotion 4.0.240, Kokoro (EN), Piper + `de_DE-thorsten-high` (DE), faster-whisper, ffmpeg.

## 13. Deliverables
- `[NAME]_Film_EN_16x9.mp4`, `[NAME]_Film_DE_16x9.mp4` (each sent separately, under 30 MB; if a 5-min 1080p60 file is over 30 MB I'll send an H.265 version or split by chapter, and say which).
- Stems per language (VO / music / SFX) as FLAC.
- Contact sheets of every chapter, README with tools, lengths, loudness.
- Optional later: 30–45 s cutdowns (16:9 + 9:16, EN + DE).

## Order of work
See §8.
