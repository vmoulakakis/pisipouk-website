# Pisipouk Premium Preschool — Implementation Contract (2026-10-29)

## Scope and ownership
Target route: `/virtual-preschool` in `vmoulakakis/pisipouk-website`. No changes to other routes, school admissions, contact information, forms, gallery or authentication. All work must live in reviewable branch `feat/pisipouk-premium-learning-studio-20261029`. Production stays unchanged until objective verification and release authorization.

## Educational creative thesis
A theatrical hand-drawn preschool discovery studio: the child **chooses → plays or paints → tells a story → builds something with real materials**. Four age bands (2–3 / 3–4 / 4–5 / 5–6). NAEYC developmentally appropriate practice, HighScope plan–do–review, hands-on Montessori and Reggio-inspired child expression. No claim of certification or affiliation. Adults remain present and cutting materials are not child-safe without adult supervision.

## Phase A — working new core (this branch)
- `illustrationAtlas.ts`: twenty original paths/scene motifs, each with four age-tier variations; **80 versions of 20 base drawings**, not 80 independently hand-illustrated characters. All are programmatic print-ready A4/A5 vector documents, no Pinterest copying.
- `PremiumAtelier.tsx`: paint-bucket zone fill, brush, eraser, sticker, undo, image download, A4 PDF and SVG/print. Child work is in browser memory and downloadable; no server upload.
- `learningEngine.ts`: ten learning domains × ten named activities = 100 content missions, backed by dynamic challenges and randomized visual choice positions. **Ten distinct pedagogical game engines**, not 100 mechanically independent game applications.
- `PremiumGames.tsx`: age-aware discovery hub, original vector visual cards, 2D tracing path interaction, WebAudio rhythm imitation, three-scene story ordering, dynamic questions and no guaranteed repeated color answer on replay.
- `premium.css`: independent responsive illustration language with 320px mobile, generous touch targets, reduced-motion fallback.
- Browser test suite for mission coverage, paint, undo, exports, anti-repeat and route isolation.

## Asset and dependency decisions
The feature branch now pins `motion@14.6.0`, `three@0.186.1`, and `@types/three@0.186.0` in package.json and package-lock.json (updated through a one-off restricted GitHub Action which was then removed). The illustrated hero dynamically imports Three.js only on desktop with available WebGL and no reduced-motion preference; otherwise the original branded bear image remains. Motion for React animates the success state, honoring reduced motion. This constitutes a first-pass clay-style mascot, **not** proof of final cinematic art quality. Screenshots, visual/teacher review, lower-end mobile benchmarks and any further custom illustration commissioning remain release gates.

## Phase B visual and pedagogical review gate
1. Replace temporary generic game/art scenes with more bespoke layered illustrated worlds and professionally reviewed master sprites. Inspect screenshot evidence at 320/390/768/1440.
2. Add purpose-built drag-and-drop, exploratory physics/loose-parts, collaborative/offline activity and more distinct cognitive mechanics, with adult prompts and no commercial reward loops.
3. Validate every template's printable size, line clarity, clipping, Greek typography, age accessibility and cutting instructions on actual paper.
4. Revisit audio narration: device compatibility, optional mute, child-appropriate speech and no autoplay.
5. Arrange teacher review with children within safeguarding controls; iterate only on observed usability feedback.

## Gate to any production release
CI PASS + screenshot review + verified PDF exports + mobile/touch QA + no high-priority regression + explicit release decision. Before release preserve existing deployment as rollback candidate. No security-sensitive user data or commercial activity is introduced.

## Test status
Tests/build have been authored for this phase; record actual passing run IDs in PR after CI finishes. Do not claim tests passed based on file existence.
