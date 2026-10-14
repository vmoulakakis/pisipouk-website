# PISIPOUK WORLD — Final Product Requirements Document
Version: 1.0 | 14 October 2026 | Owner: PISIPOUK
Status: Approved product target; implementation is incremental. This PRD is not a declaration that all features already exist.

## 1. Product vision
A Greek-language, playful, age-appropriate digital preschool for ages 2–6, combining interactive tasks, rich illustrated scenes, real-world activities, downloadable printables, gentle progress feedback and parent/educator guidance. The child must be able to navigate with large visual targets and voice guidance. The adult must be able to select activities, print and share.

## 2. User segments
2–3: sensory exploration; one-step tasks; two options; large targets; brief sessions; adult co-play.
3–4: naming, sorting, 2–3-step story sequences and open drawing.
4–5: counting, patterns, prediction, emotional vocabulary, narrated story retelling.
5–6: early phonological awareness, reasoning, multi-step construction, story authoring and age-appropriate problem solving.
Adults: parents, childcare staff, preschool educators. Adult features must not be mixed with the child UI.

## 3. Learning domains / navigation
1 Art & Drawing; 2 Crafts; 3 Storytelling; 4 Mathematics; 5 Language; 6 Nature & Science; 7 Social Emotional Learning; 8 Music; 9 Movement; 10 Logic & Memory; 11 Daily Living; 12 Greece & Culture; 13 Seasons & Calendar; 14 Our World; 15 STEAM; 16 Pretend Play.
Each domain contains: learning objective, duration, age, estimated adult assistance, interactive activity, printable variation, offline exploration, optional story, sensory accessibility notes and friendly feedback. Empty categories must never masquerade as complete modules.

## 4. Required experiences
A. Visually rich world navigation with coherent bear mascot, high quality original illustrations, animated hotspots and accessible non-animated fallback; no emoji-only hero.
B. Four truly distinct age paths; tasks and content differ, not simply labels.
C. Painting canvas with touch/mouse, colors, erase/undo, coloring sheets and PNG export; printable A4 in grayscale and color.
D. Original storybook with illustrated scenes, accessible Greek narration and meaningful choices; story to PDF.
E. Crafts with materials, safety, steps, downloadable templates and offline instructions.
F. Interactive games (sorting, sequence, count, sound match, puzzle, matching, memory); explicit success/failure feedback, retry without shame.
G. Educational calendar (September–August) integrating Greek culture, nature and seasonal themes.
H. Printable activity bundles; print and PDF on every activity; correct Greek typography; margins; A4 and A5.
I. Adult-controlled email share of activity materials; explicit send step; attachments require real server integration, not mailto.
J. Private personal progress and stars as encouragement; no public leaderboard or punishment; no diagnosis.
K. Teacher/parent mode with search/filter, activity plans, portfolio and exports.
L. Safe, accessible operation on phone, tablet and desktop.

## 5. Content model
activity_id, domain, title_el, ages, objectives, duration, difficulty, steps_el, instructions_audio, visual_asset_ids, interaction_type, answer_feedback, adaptations, supplies, safety_notes, printable_template_id, story_id, offline_activity, seasonal_tags, version, educator_review_status.

## 6. Architecture
Existing repository: vmoulakakis/pisipouk-website; Vercel project: pisipouk. Retain /virtual-preschool as the permanent public entry point. Prefer React components integrated with TanStack Router over iframes. Static assets in public/ and content records in typed modules or a CMS. Child-facing tasks work without accounts. Parent/educator exports happen locally unless real backend is required. Use an adult gate for email and portfolio. Do not send personal child data to analytics.

## 7. Visual design requirements
Coherent mascot (friendly golden teddy bear wearing blue overalls), tactile illustrated 2.5D village, original character sheets and scenes, minimum comfortable 44px interactive hit targets, mobile responsive assets (AVIF/WebP/SVG) with explicit alt text. Keep high-contrast readable text and reduced-motion setting. Scenes must not block controls on narrow screens.
An image concept is not an integrated production asset until committed, loaded, and screenshot-verified.

## 8. Acceptance criteria
- /virtual-preschool displays the latest experience on direct open, browser refresh, mobile and desktop, without legacy content or nested-iframe duplication.
- All 4 ages visibly change activities; all 16 domains have distinct vetted real content; no placeholder clones.
- Each interactive task can be completed, repeated, exited, and works with pointer/touch; keyboard equivalence for core controls.
- Painting persists while exploring, allows undo/clear, exports valid image and prints correctly.
- Stories have multiple pages, Greek narration when available, accessible alternative text and print/export.
- Every activity has an actual A4 PDF output; email uses real attachment-capable backend or is clearly labeled as an email draft/hand-off.
- Progress is per-child locally, opt-in and non-comparative; children are never exposed to rankings.
- Loading performance acceptable on mid-range mobile; no broken image, JS error or overflow.
- E2E smoke tests: landing, age filter, each category, one game per mechanic, art canvas, story, print, email, direct navigation, mobile viewport.
- Deploy READY on production, DNS paths return 200, actual rendered UI visually verified via screenshots, version marker visible in adult interface.

## 9. Releases
R0—Repair navigation and deployment freshness; direct route shows the new experience; no duplicate old section.
R1—Premium asset integration, stronger responsive UI, 4 age flows; 3 comprehensive themes: Autumn, Olive, Feelings.
R2—All 16 domains complete, interactive games and original story/craft/printables content.
R3—Teacher studio, attachment-capable email, child portfolio, offline/PWA, analytics with no child identity.

## 10. Risk log
- Misleading feature claims: use tested acceptance and a release checklist.
- Visual mismatch: asset approval before integration and production screenshots.
- Overuse of screen time: offline suggestions after short tasks.
- Child privacy: no freeform AI chat, no publicly identifiable child profiles, adult-gated sharing.
- Cross-origin/iframe/cache issues: avoid nested app iframe and verify actual route.
- Generic templating: educator review of every domain and age adaptation.

## 11. Definition of Done
Complete means content reviewed by early-childhood educator, original graphics integrated, all critical interactions pass browser tests, print/PDF output inspected, email path tested, accessibility checks passed and publicly served production confirmed. Git commit/HTTP 200 alone is insufficient.
