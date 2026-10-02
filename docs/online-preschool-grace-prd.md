# Online Preschool Grace — PRD

Status: implementation branch only  
Scope owner: Online Preschool / Learning Games only  
Production baseline: `ac04f5690208c0b086c5f8c1c6c57f17c8d3382f`

## 1. Product goal
Turn the existing Online Preschool into a premium, joyful, play-based digital-to-physical preschool experience for ages 2–6 without changing unrelated pages, forms, analytics, Supabase schema, navigation, enrollment or production behaviour.

The product must feel like a small creative studio for a child, not a worksheet archive and not a noisy game portal.

## 2. Evidence-led design principles
- Play first: joyful, child-led or guided activities with a clear learning goal.
- One task at a time: low cognitive load and obvious next action.
- Digital → physical bridge: every major digital zone should point to an offline, printable or hands-on continuation.
- Touch friendly: large targets, short rounds, immediate feedback, minimal reading for the child.
- Parent clarity: age, duration, materials, learning goal and supervision guidance are visible.
- Inclusive: no score shaming, no countdown pressure, keyboard/touch friendly, reduced-motion friendly.
- Private by default: no child profile is required and no new personal-data collection is introduced.

Reference principles:
- NAEYC play-based / developmentally appropriate practice: https://www.naeyc.org/resources/topics/play
- NAEYC technology with preschool children: https://www.naeyc.org/resources/topics/technology-and-media/preschoolers-and-kindergartners
- UNICEF early childhood learning: https://www.unicef.org/lac/en/early-childhood-learning-preschool

## 3. Experience architecture
### A. Hero: “Το Εργαστήρι του Πισιπούκ”
A calm, premium vector scene with four clear doors:
1. Παίζω
2. Ζωγραφίζω
3. Φτιάχνω
4. Τυπώνω

### B. Today’s 15-minute path
A daily micro-routine with 3 steps:
- 5′ warm-up game
- 5′ creative / fine-motor activity
- 5′ printable or hands-on activity

### C. Weekly Picks
A data-driven weekly shelf containing:
- 2 interactive games
- 2 printables
- 2 craft patterns
Only this shelf is automatically rotated by the weekly job.

### D. Interactive Play Lab
Keep the proven existing learning games and add compact “challenge” interactions in the new hub. Existing game routes remain untouched.

### E. Printable Studio
Every printable is A4 portrait and contains:
- large printable pattern / worksheet area
- narrow parent instructions panel
- age, time, skill and materials
- solid line = cut
- dashed line = fold
- dotted/hatched area = glue
- black-line ink-friendly design

### F. Parent layer
Every activity communicates:
- age band
- expected duration
- developmental skill
- materials
- safety / adult support

## 4. Visual system — “Grace”
The look should be playful but controlled:
- sky / mint / coral / sunshine / lavender accents
- warm off-white paper surfaces
- rounded cards with subtle paper-cut shadows
- scalable SVG line art rather than heavy raster backgrounds
- no flashing, no over-animation
- large iconography and generous whitespace
- print assets stay black-line / ink-friendly even if the web preview is colourful

## 5. Initial content library
### Interactive themes
- memory
- pattern recognition
- counting
- colour / shape discrimination
- sorting
- spatial reasoning
- emotion recognition
- story sequencing

### Printable / craft themes
- build-an-animal cut & paste
- shape robot
- emotion wheel
- weather wheel
- autumn hedgehog
- rocket construction
- tracing paths
- dot / sticker patterns
- number–quantity match
- story sequence cards

All assets are original Pisipouk patterns. External sources can be used as research references only, never copied.

## 6. Weekly refresh job
### Purpose
Refresh only underperforming Weekly Picks while preserving the rest of the site.

### Inputs
- last 14 days of `pisipouk_events` when authenticated Supabase read credentials are available
- current weekly selection
- vetted local content catalog

### Performance rules
Do **not** replace an item simply because raw traffic is small.
An item is eligible only when it has sufficient exposure and weak engagement, e.g.:
- >= 5 relevant views/starts, and
- completion / meaningful interaction rate below threshold

If there is not enough data, use deterministic weekly rotation from the vetted catalog instead of declaring an item a failure.

### Safety rules
- maximum 2 replacements per weekly run
- job may edit only `public/preschool-weekly.json`
- validate catalog IDs and types before writing
- run `npm run build`
- if validation or build fails: no commit
- no automatic changes to routes, code, Supabase schema or other pages

## 7. Analytics events
New hub should emit only non-PII behavioural events:
- `preschool_grace_open`
- `preschool_activity_start`
- `preschool_print`
- `preschool_weekly_pick`
- `preschool_challenge_start`
- `preschool_challenge_complete`

Metadata contains activity IDs / age bands only.

## 8. Success metrics
Primary:
- weekly return rate
- activity starts per visitor
- game completion rate
- print / craft actions

Secondary:
- movement from hub to existing learning games
- repeat use across 7 days

Guardrail:
- no regression in current production routes, forms, page tracking or build health.

## 9. Release plan
1. Build on isolated feature branch.
2. Add new preview route only; keep `/virtual-preschool` unchanged.
3. Build + preview deployment test.
4. Verify touch/mobile, print output and analytics calls.
5. Add weekly automation with strict file scope.
6. Open PR; production remains unchanged until the preview is accepted.

## 10. Non-goals
- no redesign of homepage, enrollment, contact, admin, gallery or nutrition
- no database migration
- no new child account/auth system
- no automatic scraping/copying of Pinterest/Etsy/other copyrighted worksheets
