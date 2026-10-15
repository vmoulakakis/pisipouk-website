# PISIPOUK Preschool — 120 Playpacks + Visual Maker Studios (2026-10-15)

## Source & Safety
- Baseline: `main` of `vmoulakakis/pisipouk-website` as deployed October 15.
- Work branch: `feature/pisipouk-preschool-120-playpacks-20261015`.
- Only changes under `src/components/preschool/world/**`, dedicated tests and this document.
- No changes to site-wide CSS, SiteLayout, shared routes/APIs, domain, payments, analytics or production.
- No merge to main until browser/device, pedagogical, art and privacy checks pass.

## Actually implemented
1. **Replay contract** in existing Game mechanics: `Παίζω ξανά · Νέος γύρος` changes presented question when a domain pack is available, or guarantees a changed answer/card arrangement; musical rhythm tasks get a new note sequence. `Ξανά το ίδιο` resets state while retaining the current task and its layout. Memory, answer selection, sequences and counting remain available.
2. **Nature sorting / village puzzle**: randomized new selections/arrangement on replay and a separate same-round reset; puzzle alternates two existing HD village art views.
3. **120 distinct editorial learning scenarios**: 20 original short Greek questions/prompts in each of six editorial families (art, craft, nature, music, story, feelings). 20 activities are individually selectable per family, and the built-in game engine can also select a new one. **These are not 120 independent game engines or 120 fully bespoke minigames.** Original rhythm, memory, counting and sequence gameplay remains displayed.
4. **Drawing**: 20 authored, distinct SVG line-art templates (bear, squirrel, fruit, flowers, butterfly, house, rainbow, etc.), age-adaptive stroke width, fill-color on click, six-color palette, finished colored preview, random new template, same-template reset, A4-size vector SVG download, and browser Print / Save as PDF. Existing freehand canvas remains available.
5. **Crafts**: 20 curated physical crafts, each with materials, 4 individually selectable steps, illustrated progress previews, approximate time, age guidance, adult safety instructions, new/same craft, A4 line-art SVG and browser printing.
6. **Greek storybook**: from 3 to 20 original narrated/interactively-ended stories with 4 pages and 2 choices each, illustrated catalogue and new/same story controls.
7. **Visual layer**: responsive toy-inspired cards, large touch controls, colored finished examples, subtle re-use of existing licensed HD village artwork and gentle reduced-motion-aware animation; styling is scoped to preschool.
8. **Automated tests authored** under `tests/preschool/playpacks.spec.ts`: tests for new/same replay, six packs, drawing, crafts, stories and narrow-screen layout.

## Verified
- GitHub commit operations succeeded on isolated branch.
- Static data validation of the committed files: 20×6 scenarios, 20 drawing patterns, 20 crafts each with four steps, references resolvable, no duplicate scenario titles.
- Vercel built recent preview commits as `READY` (compile/deployment evidence only).
- Source diff was limited to preschool-specific code and tests.
- **No browser or real-device Playwright run has been confirmed.** Do not claim passing automated browser tests or print/PDF QA without executing these.

## Known release gaps / what must not be overclaimed
- 120 scenarios are interactive quiz-style learning prompts with illustrated guidance, **not 120 custom game engines** or 120 distinctly animated environments.
- Drawing patterns are **original vector art**, suitable for sharp A4 printing, **not 20 independently art-directed HD game-level backgrounds**.
- Craft step previews illustrate progression with line-art vs colored examples; they're not individually photographed four-stage craft instructions. Physical directions need preschool educator review before public release.
- The existing full preschool architecture and 16 domains remain; this branch does not replace the production experience.
- Multiplayer, open world companion bots, Capacitor apps and a full curated audio asset pipeline are outside this feature branch.
- Children's interaction should be supervised by an adult; no tracking, timers or forced streak rewards added.

## Release acceptance
1. Run `npm run build`, `npm run lint` (scoped), and Playwright tests with correct base URL.
2. Browser inspection of all 20 patterns and crafts; confirm specific semantic visual matches and no generic wrong examples.
3. Print at A4 and Save to PDF from Chrome/Safari; validate black-outline print and color previews.
4. Test age 2–3, 3–4, 4–5, 5–6, touch targets, two-finger gestures, keyboard navigation, browser speech-synthesis failure, reduced motion.
5. Verify replay never gives the same arrangement or same question when new round is requested; verify same-round replay is stable.
6. Verify home, admissions, tuition, contact, public pages, routing and shared styles have not regressed.
7. Obtain visual/educator acceptance before merge into production.
