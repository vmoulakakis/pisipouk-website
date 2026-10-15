# PISIPOUK WORLD 2.0 — UX FLOWS, VISUAL SPEC & STAGING ARCHITECTURE
Version: DESIGN-FREEZE-CANDIDATE 1.0 · 15 October 2026
Project: vmoulakakis/pisipouk-website · Vercel: pisipouk
Environment: **design branch / preview only**. This document is a design specification, NOT release approval.

## 0. LOCKED PRODUCT DECISIONS
- Product: Greek-language hybrid premium cartoon 2.5D educational experience for ages 2–6.
- Mascot: faithful 3D-style reinterpretation of the original PISIPOUK bear. Use /preschool-world/bear.webp and src/assets/pisipouk-logo.webp ONLY as existing reference; no generic replacement bear. Commission/review a full model sheet before claiming final character art.
- Village: HYBRID. Default fixed overview at all ages; optional viewport exploration 3–6; 2–3 sees fixed overview with large labeled/talkable landmarks. All learning rooms accessible from always-visible fallback menu.
- Interaction: one primary child task per screen, actual URLs, client-side navigation, no iframe, no huge homepage scroll.
- Teaching: age differentiation 2–3 / 3–4 / 4–5 / 5–6. Six spatial rooms map to all 16 curricular domains.
- Child safety: no unrestricted AI chat, no public ranking, no third-party advertising in child UI; adult-gated sharing, minimal local profile data, no personal-identification requirement.
- Production: NO touching main, pisipouk.com aliases, env vars, project settings, or live database. Review staged branch and preview first.

## 1. VISUAL CONTRACT
A. Hero/background: illustrated layered village, warm late morning with mountains, library tree, atelier, craft workshop, game cottage, music gazebo and garden; controlled parallax ONLY in explore mode.
B. Mascot: golden-brown plush teddy, original round face, brown nose, original eye/nose/cheek proportions; outfit optional. 8 expressions: welcome, curious, thinking, proud, empathic, surprised, listening, goodnight. 10 poses: idle, wave, point, look left/right, walk, sit, carry book, paint, celebrate, quiet.
C. Friend character: blue companion from original branding may appear only after reference sheet approval.
D. Color tokens: honey #F2B84B; sky #9DD9F3; mint #A6D8A4; blossom #E5B2C8; lilac #AE9BCB; cream #FFF5DF; ink #24405B; subdued ink #516779; action blue #2367B2; focus #153F83. Text contrast WCAG AA; never convey success by color alone.
E. Type: Greek-capable rounded sans, body weight ≥500, headline 700/800; use existing legally usable fonts or browser-safe fallbacks pending font audit; no compressed display font for instructions.
F. Shapes: large tactile toy tiles, radius 20–32px, soft layered shadows, thin contrasting outline and focused ring. Keep visuals consistent across rooms.
G. Motion: 150–350ms primary transitions, slow ambient 4–12s, user-initiated sound only after consent; never flashing or auto-playing loud sound; reduced-motion equivalent static state.
H. Target size: internal child design minimum 56×56 CSS px; core tap surfaces 72–120px for 2–3; maintain WCAG 2.2 AA baseline (24px minimum with defined exceptions, internal target intentionally stricter).
I. Original assets: use licensed/original artwork; 2x raster for visible render size or SVG vector where appropriate; responsive <picture>/srcset with AVIF/WebP. Never depend on Pinterest downloads or copyrighted commercial game art.
J. Breakpoints: 360–599 narrow; 600–899 tablet portrait; 900–1199 small desktop/tablet landscape; ≥1200 desktop. Design for 360×740, 390×844, 768×1024, 1024×768 and 1440×900; keep game board above fold when feasible.
K. Child UX labels: visual icon + 1–3 Greek words; voice alternatives. Avoid emoji as primary branded art.
L. Landscape and portrait: landscape is enhancement, never requirement; portrait shows stacked rooms and bottom nav. Safe areas (notch/home indicator) honored.

## 2. INFORMATION ARCHITECTURE — PRODUCTION TARGET (NOT CREATED IN THIS DESIGN PHASE)
~~~text
/virtual-preschool                         -> age gate + welcome / resume
/virtual-preschool/village                 -> fixed overview + optional exploration
/virtual-preschool/rooms/:roomId           -> selected immersive room
/virtual-preschool/games                   -> visual game catalogue
/virtual-preschool/games/:gameId           -> isolated playable interaction
/virtual-preschool/atelier                 -> drawing & pattern entry
/virtual-preschool/atelier/:activityId     -> canvas / template
/virtual-preschool/crafts                  -> curated physical craft gallery
/virtual-preschool/crafts/:craftId         -> guided safety, steps, print
/virtual-preschool/stories                 -> illustrated bookcase
/virtual-preschool/stories/:storyId        -> paginated original Greek story
/virtual-preschool/music                   -> musical interaction
/virtual-preschool/nature                  -> guided nature observations
/virtual-preschool/today                   -> approved featured activity
/virtual-preschool/seasons/:slug           -> Greek calendar and season pack
/virtual-preschool/my-creations            -> local-only optional portfolio
/virtual-preschool/adults                  -> adult gate
/virtual-preschool/adults/weekly-plan      -> schedule, 4 age versions
/virtual-preschool/adults/printables       -> A4/A5/PDF export + share controls
~~~
All nested routes must work via copy/paste, reload, browser back/forward and client-side Link navigation. Return-to-room must restore unfinished state. Legacy preschool route cannot be removed before migration acceptance.

## 3. PRIMARY USER FLOW — CHILD (2–3)
Welcome (1 visual instruction, adult assists age selection) ->
Village fixed map (4–6 visible large tappable location hotspots, no pan) ->
One room -> one simple 1-action challenge (max 2 choices until mastered) ->
Tap/drag-alternative -> warm unambiguous feedback ->
Same round / new round / return. No timers, streaks or punishment.

## 4. PRIMARY USER FLOW — CHILD (3–6)
Welcome or resume -> Village fixed map (default) -> optional Explore mode toggle ->
2.5D panning (bounded and reversible, never hides navigation) -> room ->
activity shelf filtered by age, goal & difficulty -> game ->
feedback and next step -> optional local stars -> return exactly to previous shelf scroll/selection.
Pan mode MUST be explicitly toggled; no accidental horizontal swipe conflict with carousels.

## 5. PRIMARY USER FLOW — ADULT
Enter adult gate from child app -> adult overview ->
choose child age (no mandatory name) -> Weekly Plan / Printable Library / Settings ->
preview A4/A5 -> PDF export/download ->
optional explicit email action backed by secure server with anti-abuse protection, consent and attachment (never auto-share or fake server send).
Optional activity history stored local first. Do not send child behavior to analytics.
Adult gate cannot be a trivia question a child can easily solve; security model must be reviewed.

## 6. SCREEN-BY-SCREEN CONTRACT
### S01 Welcome
Above fold: Mascot (40% desktop / 30% mobile), 1 warm line, age choices (2–3,3–4,4–5,5–6), giant CTA 'Πάμε στο χωριό'.
Persistent audio settings; adult control separated. Default age from existing anonymous local preference.
States: first visit, returning, no speech API, reduced motion.
### S02 Village
Desktop composition: left 70–75% zoomable illustrated environment, right 25–30% context panel with Today's Quest + room shortcuts.
Mobile: full-width background with large hotspots; bottom nav + expandable room index. Avoid tall section stacks.
Top: mascot, chosen age, audio, explore toggle (age ≥3). Overlay positions cannot overlap mobile hotspots.
States: still fixed, explore active, selected hotspot, keyboard focus, fallback when image unavailable.
### S03 Room
Dedicated room hero + 2–4 large actionable options; single-sentence instruction.
Activity cards: objective, approximate 3–8 minute play session, age band, offline extension, adult-assisted flag.
### S04 Game
One activity per route. Instruction/audio at top, one central game mechanic, bottom feedback and buttons 'Ξανά το ίδιο', 'Νέος γύρος', 'Πίσω'.
Flow READY→INSTRUCTIONS→PLAYING→FEEDBACK→COMPLETED→REPLAY; route-specific state persisted in session store and optionally local.
Input must work without drag (tap source then target) and without sound.
### S05 Atelier
Scene with brush/palette tools, real canvas, locally autosaved draft, clear/undo/redo, PNG export; template gallery + black-outline A4.
Color choice ≥56px, pointer + touch, no accidental scroll while drawing.
Preview/Save/Print belong in adult-facing secondary action sheet when appropriate.
### S06 Story Tree
Illustrated bookcase -> 3–6 pages per vetted story -> optional Greek narration + subtitle -> one child choice per story segment -> gentle conclusion -> printable booklet.
Speech unavailable: visible text, no broken interaction.
### S07 Craft Workshop
Gallery -> adult-assisted craft detail -> four or more visually distinct steps with material and safety checklist -> printable A4 outline and instructions. Screens for steps; do not put instructions in one giant scroll.
### S08 Seasonal Garden
Greek seasonal activity sets and offline explorations (not auto-generated live unsupervised). Local weekly theme updates do not rewrite published documents.
### S09 Adult Studio
Visually calmer and information-dense. Search/filter, curriculum objectives, pending AI drafts, approval audit log, release rollback, PDF, consent and privacy.

## 7. INFORMATION RELATIONSHIPS
6 spatial rooms = Games House, Atelier, Craft Workshop, Story Tree, Nature Garden, Music Pavilion.
16 curricular domains remain in activity taxonomy (art, crafts, stories, maths, language, nature, SEL, music, movement, logic, daily life, Greece, seasons, world, STEAM, pretend play).
Spatial room is NOT a curricular domain. An activity can appear in one room and belong to multiple curated learning domains, with a primary domain.
Atelier is for creation; separate printables gallery is adult-first, not child navigation bloat.

## 8. TECHNICAL ARCHITECTURE
Reuse React 19, TypeScript, TanStack Router, Vite/TanStack Start, existing Vercel hosting.
Create independent feature package in src/features/preschool-v2:
  app/(layouts, routes, state); design-system/(tokens, primitives, motion); rooms/; engines/(sort,match,memory,puzzle,sequence,count,sound,story,canvas); content/(schemas,loaders); print/; accessibility/; tests/.
Use nested Router layouts, lazy route chunks, intent preloading of likely next room, scroll restoration for adult/library only.
Game engines consume validated content JSON and stable IDs, not hardcoded giant JSX panels.
Supabase: curated records + signed media references, status draft→reviewed→scheduled→published→retired, audit history; RLS by adult role; published content read-only anonymous safe API.
Do not expose service-role key in browser; scheduled content generation performed server-side, never in child experience.
Browser supports offline read-only curated content where pre-cached; safe refresh and version pinning during active game.
Track non-personally identifying aggregate availability/performance only; separate consent for any personal data.

## 9. WEEKLY CONTENT PIPELINE
Every week before Monday publication:
1. Build editorial season/Greek-event brief and age-level objectives.
2. AI drafts activities + stories + visual asset briefs + print metadata.
3. Automated schema, language, duplicatedness, image-text alignment, safety and asset checks.
4. Educator manually reviews NEW content and child suitability, marks reviewed.
5. Weekly scheduled release SELECTS only approved content and existing engines; publish atomically.
6. Smoke test chosen activities, PDF, link targets; rollback previous release on critical failure.
7. All weekly published versions immutable for audit. A failed AI draft never blocks curated fallback.
No AI companion chat and no child input used as automatic content-generation prompt.

## 10. STAGING / SAFETY
Only new design branch design/pisipouk-world-v2-ux-20261015 and non-production Vercel preview. All new route paths must use /pisipouk-v2-staging for review to avoid impacting /virtual-preschool.
Production deploy target NOT ALLOWED. No merge, promotion, alias change, new live env or database mutation.
The staging prototype may use existing old assets as placeholders; it must visibly label itself as DRAFT and not imply asset approval or finished gameplay.
No staging indexation; set per-page robots noindex and Vercel preview noindex.
For public launch, require asset approval, educator review, Playwright tests, browser screenshots at 360,390,768,1024,1440 widths, A4 render inspection, keyboard/touch checks, reduced-motion, mobile performance and rollout plan.

## 11. QUALITY GATES
G1: Route URL direct-load + reload + back/forward; no iframe.
G2: Age 2–3 cannot accidentally pan; 3–6 can choose exploration, and simple room index remains.
G3: Each kid route has a clear exit; primary action fits visible viewport 360×740 or is explicitly scrolled within isolated bounded area.
G4: 16 domains have 4 age-specific pedagogically reviewed objectives/activities, zero placeholder clones.
G5: At least 10 mechanically distinct playable game engines with deterministic test seed and repeat/new semantics.
G6: All sounds optional, reduced-motion alternative, keyboard focus visible, pointer target minimum project 56px.
G7: Canvas paint, undo, save PNG, A4 vector printable; crafts adult safety, stories narrated gracefully with fallback.
G8: No children data sent to remote analytics or uncontrolled AI service; adult email explicit.
G9: Preview noindex, production untouched; screenshots and acceptance signoff prior to merge.

## 12. SOURCE REFERENCES
- Existing asset paths: public/preschool-world/bear.webp, village.webp, village-mobile.webp; src/assets/pisipouk-logo.webp.
- Existing current route: src/routes/virtual-preschool.tsx uses PreschoolWorld local panel state; retain it until replacement accepted.
- UX/accessibility: https://www.w3.org/WAI/WCAG22/quickref/
- Router preload: https://tanstack.com/router/latest/docs/guide/preloading
- Router scroll: https://tanstack.com/router/latest/docs/guide/scroll-restoration

## 13. NON-GOALS / TRUTH IN DELIVERY
This specification does not imply the final mascot sheet, approved 3D art, 16 complete modules, 120 bespoke games, completed secure email backend or live production delivery. A clickable staging proof demonstrates UX and architecture only; real release requires detailed implementation and acceptance.
