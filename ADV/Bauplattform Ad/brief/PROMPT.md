# Architecture & Construction Platform: Product Film (EN + DE)

Status: **Draft v1, waiting for SamTeck's OK.** Nothing built yet.

Open items before build (defaults in brackets are what I'll use if you just say "go"):
1. **Product name + logo + colours.** The PDF has none. [Working title "[NAME]", neutral wordmark slot, palette below. Real name and logo go in before finals.]
2. **Reference video.** None sent. [House style: Spotify/Shopify/Huel family, adapted to architecture: see §4.]
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

## 3. Concept: "From enquiry to handover. One flow."
The film follows **one building**, a 4-storey residential block with ground-floor shop, through all 8 phases. The building grows on screen as the film goes: a site plan, then a BIM model, then scaffold and progress, then the finished building with live sensor data. Each chapter shows the agents doing the work and a person approving the one decision that matters. A thin **phase rail** (1–8) runs along the bottom so the viewer always knows where they are. That's what keeps 5 minutes watchable.

Recurring device: an **approval card** with the autonomy colour (Grün/Gelb/Orange/Rot) pops up in every chapter. By the end, the viewer has seen all four levels in context, then the control chapter explains them.

## 4. Look (no reference, so house style adapted)
- **Palette (placeholder until brand arrives):** warm concrete white `#F4F2EE`, graphite `#1E2226`, blueprint blue `#2F6BFF`, plus the four autonomy colours (green `#22B573`, yellow `#F5C542`, orange `#F28A30`, red `#E5484D`) used only for approval states.
- **Type:** Inter (UI) + Manrope (headlines), bundled locally. Kinetic headlines, one word highlighted in blueprint blue.
- **Mood:** architectural, calm, precise. Blueprint line drawings that "build" into solid shapes; soft daylight; frosted white UI cards over a slow drifting glow. Heavy motion blur only on camera moves.
- **3D:** one Blender building (simple, clean massing, not photoreal), rendered at ≥120 frames per move or as clean stills with CSS parallax. No flip-book turntables.
- **New moves for this job:** line-draw-to-solid build, section-cut reveal, exploded floor stack, phase rail, approval stamp. Nothing reused from Rothme or HXX.

## 5. Beat sheet (EN timings; DE re-timed to its VO)

| # | Time | Chapter | Picture |
|---|---|---|---|
| 0 | 0:00–0:15 | Hook | Screen floods with 40 app windows, emails, PDFs, Excel tabs, WhatsApp photos of a site. Everything snaps into one clean card. |
| 1 | 0:15–0:35 | The problem | Same building, eight disconnected teams. Lines between them break. Late delivery alert, invoice doesn't match, plan version 7 vs 9. |
| 2 | 0:35–1:05 | One platform | Name + logo reveal. Architecture diagram builds: Web platform → AI orchestrator → specialist agents → tool gateway → connectors (CAD, BIM, Blender, Unity) → rules & approvals → audit layer. |
| 3 | 1:05–1:25 | 1 · Projektanfrage | An email with a PDF and site photos lands. Intake agent pulls address, scope, files, people into a structured project card. Map pin drops. |
| 4 | 1:25–2:00 | 2 · Planung | Site plan → BIM model builds floor by floor. IFC/BCF chips. Clash check flashes 3 conflicts (duct vs beam), each resolved. Blender render + Unity walkthrough in a VR headset frame. |
| 5 | 2:00–2:25 | 3 · Kalkulation | Model splits into quantities (m³ concrete, m² drywall, m cable). GAEB bill of quantities fills. Cost, labour and subcontractors total up. |
| 6 | 2:25–2:45 | 4 · Angebot | Three offer variants with margin bars. **Orange** approval card: "Angebot über 1,84 Mio. € freigeben?" Project lead taps approve. |
| 7 | 2:45–3:15 | 5 · Auftrag + optimisation | Accepted offer becomes a project with budget + Gantt. Solver card compares **Beste / Schnellste / Sicherste** on cost, time and CO2; the trade-off is explained in one line. |
| 8 | 3:15–3:35 | 6a · Einkauf | Material agent compares 3 suppliers (Datanorm), orders within limit (**Gelb**), delivery slot booked on site logistics map. |
| 9 | 3:35–4:10 | 6b · Baustelle | Rugged tablet offline → daily report. Drone + LiDAR scan overlays on the model: progress 62 %. Defect photo → task to the right subcontractor. Smart-helmet safety alert. |
| 10 | 4:10–4:35 | 7 · Finanzen | Invoice arrives (XRechnung). OCR + three-way match: order ✓ delivery ✓ invoice ✗ (12 m² too many). Flagged, corrected, booked to DATEV / Lexware. Bank payment card shows **Rot**: a person pays. |
| 11 | 4:35–4:55 | 8 · Abschluss + Betrieb | Acceptance, handover documents, warranty dates. Finished building lights up as a digital twin with IoT data (temperature, energy, leak sensor); maintenance task scheduled. |
| 12 | 4:55–5:15 | Control | The four autonomy levels, side by side, with the examples from §48. Audit log scrolls: every action with source, time, agent, approver. "Not-Aus" switch. |
| 13 | 5:15–5:30 | Ecosystem + close | Integration chips and hardware icons orbit the building, then collapse into the logo. End line. |
| — | 5:30–5:32 | samteck end card | Last chord rings. |

## 6. Script (EN draft)
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

## 7. Script (DE draft, needs native check)
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

## 8. Voice
- **EN:** Kokoro `am_michael` (used on the HXX final) and `af_heart` → 2 takes, you pick.
- **DE:** Piper `de_DE-thorsten-high` + one other Piper German voice → 2 takes. ElevenLabs Multilingual v2 only if the key is added (cost estimate first).
- Brand name pronunciation: needs the name first. "DATEV" = DAH-tef, "Lexware" = LEX-ware.
- Every take checked with faster-whisper; picture re-timed to the chosen take.

## 9. Music and SFX
- **Music:** original, made in code, ~5:30 in three movements so it never loops audibly: (a) tense, sparse pulse for the hook/problem; (b) warm, steady build at ~100 BPM through phases 1–8; (c) wide, resolved chords for control + close, last chord ringing under the end card. ≥15 dB under VO while words are spoken.
- **SFX:** paper/pen scratch for blueprint lines, soft concrete "thunk" when a floor lands, click per BIM element, alarm blip on clashes, stamp on every approval card (different pitch per autonomy colour), drone whir, camera shutter, clean "match" chime for the three-way match, low hum + tick for sensor data, logo hit.
- Master −14 LUFS / −1 dBTP per language.

## 10. Screens to design in code (real device sizes, real-feeling German/English data)
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

## 11. Assets list (needs OK before any downloads)
- From client: **product name, logo (SVG), colours, font** (if any). Otherwise placeholder wordmark.
- Built here: Blender building massing (procedural, no downloads), all UI, icons from Lucide.
- Optional photos (Unsplash/Pexels, logged in `assets_in/CREDITS.md`): a construction site at dawn, a site team with a tablet. Only if you OK them; the default is fully designed, no photos.
- Tools to install: Remotion 4.0.240, Blender 4.2.3, Kokoro (EN), Piper + `de_DE-thorsten-high` (DE), faster-whisper, ffmpeg.

## 12. Deliverables
- `[NAME]_Film_EN_16x9.mp4`, `[NAME]_Film_DE_16x9.mp4` (each sent separately, under 30 MB; if a 5-min 1080p60 file is over 30 MB I'll send an H.265 version or split by chapter, and say which).
- Stems per language (VO / music / SFX) as FLAC.
- Contact sheets of every chapter, README with tools, lengths, loudness.
- Optional later: 30–45 s cutdowns (16:9 + 9:16, EN + DE).

## Order of work
Brief → OK → assets list → voice takes (EN + DE) → preview v1 EN + contact sheet → feedback → DE preview → finals.
