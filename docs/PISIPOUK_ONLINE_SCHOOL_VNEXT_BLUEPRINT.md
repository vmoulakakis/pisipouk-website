# Pisipouk Online School — Interactive Learning World vNext
Date: 2026-11-09
Scope: existing /virtual-preschool in vmoulakakis/pisipouk-website. Never replace the parent school's pages or break existing 16-world content.

## Product north star
Not a quiz website. A story-rich, screen-to-real-world preschool exploration village. Each experience must include: invitation, action, discovery, reflection and an offline extension. Four developmental paths 3, 4, 5 and 6 years old; no forced timers, grades, leaderboards, manipulative rewards or child-facing advertising.

## Audiences
Child 3: large tap targets, pictorial directions, 1–2 interactions at a time, caregiver alongside.
Child 4: matching, sorting, patterns, exploration and oral expression.
Child 5: multi-step investigations, sequencing, simple counting and storytelling.
Child 6: projects and planning, emergent literacy, collaborative problem-solving and creative recording.
Adult: goals, materials, total duration, supervision and printable download.

## Home / story world
Interactive illustrated village, not generic rectangular dashboard. Preserve Pisipouk bear branding, school links and existing material. Destination regions: Forest of Play, Story Tree, Discovery Laboratory, Construction Workshop, Painting Atelier, Seasonal Square, Family Library and My Exhibition. Support reduced-motion and keyboard alternatives. Cartoon artwork should be original, consistent, exportable as optimized WebP/AVIF/SVG at mobile and desktop densities; avoid relying on emoji as final production imagery.

## Mandatory interaction standard
- Every interactive element must be functional with touch, mouse and keyboard.
- Greek voice instructions and captions; no microphone recording by default.
- Avoid negative scores; encourage retry and discovery.
- Offline real-world exercise at end.
- No child names/photos on server by default. Parental controls for save/email/share.
- Print A4 and A5, high-contrast grayscale where appropriate, safe printing margins.
- Pages must be navigable directly and have meaningful titles, alt text and focus management.

## Core differentiated experiences (first full release)
1. Story-driven village map with 8 illustrated regions, each unlock-free.
2. Adaptive activity library built from age, domain, interaction mechanic, and difficulty data.
3. Original play mechanics: visual matching, sorting, tracing, object-building, sequencing, cause-effect, rhythm, role-play, puzzles and story choices.
4. Digital Atelier: layers (template / colors / stickers / brushes), undo-redo, eraser, fill, export PNG/PDF, blank canvas and tracing sheets.
5. Construction Studio: each craft gets illustrated final result, A4 patron, cut/fold/glue line legend, safety checklist, tools and materials, 4–8 visual steps, and gallery examples. No craft consisting only of text instructions.
6. Interactive Story Theatre: read-along Greek text, illustrations, choices and oral reflection.
7. Seasonal collections / national events including 17 November (history, context and safe language).
8. Adult dashboard: printable lesson plans, skills coverage, local-only progress, special-needs adaptations and guided classroom use.

## 17 November 2026
Existing eight historical episodes remain in /virtual-preschool and must not be removed. New directly accessible activities live at /virtual-preschool/november-17-activities. Separate high-resolution A4 image pack is generated externally, not yet checked into the static assets: DO NOT state that the eight image PNGs are hosted until they are uploaded and verified. Maintain sensitivity and historical accuracy: 1973 Polytechnic uprising did not itself instantly restore democracy; transition occurred in July 1974.

## Implementation phases and acceptance criteria
P0: preserve current journeys, 16 learning domains, SEO and school nav. Inventory all routes/assets and baseline lighthouse/axe/playwright.
P1: graphic system, responsive illustrated village, child-safe motion, typography and navigation.
P2: mechanics engine, 3/4/5/6 adaptivity, reliable replay/persistence, robust test matrix across devices.
P3: atelier with patron imports, step-by-step crafts, paint tools and A4/A5 export.
P4: stories + lessons + teacher controls, privacy QA, accessibility and Greek-language proofreading.
P5: image-generation/art direction pipeline with supervised asset QA, regression/performance test and production deployment.
Do not label the entire vNext complete until P0–P5 tests are green. GitHub commit and Vercel READY alone are not end-to-end product QA.
