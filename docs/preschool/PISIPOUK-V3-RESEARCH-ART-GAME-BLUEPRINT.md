# Pisipouk World V3 — Visual Research, Art Direction & Game Design Blueprint
**Status:** RESEARCHED + SPECIFIED; NOT IMPLEMENTED, NOT DEPLOYED  
**Date:** 2026-10-29 · **Scope:** only `/virtual-preschool` · **Production:** unchanged.

## 0. Evidence / diagnosis
- The real repository already contains a superior **interactive six-hotspot map** in `src/components/preschool/world/World.tsx`; graphic assets `/preschool-world/village.webp` and `village-mobile.webp`. Coordinates in current design: Atelier (14,45), Stories (33,24), Crafts (48,51), Garden (17,71), Music (76,49), Inventors (89,20). Preserve the map mental model; redesign art and interactions, **do not replace with generic landing-page cards**.
- Current `src/components/preschool/wonder/PreschoolWonder.tsx` opens a separate, mostly static hero and cards, hides the navigable original map inside the “16 worlds” panel; contains only six simplistic game families.
- Draft PR #19 is an unfinished iteration: procedural 20 subject motifs reused across four ages, no independent professional illustrations or comprehensive premium games. **Not release-ready**.
- The deployed main site must not be changed during this ARCHITECT stage.

## 1. Research: mechanism, not imitation
| Reference | Verified mechanism | Pisipouk adaptation |
|---|---|---|
| Pok Pok (https://playpokpok.com/) | Open-ended, child-controlled interactive toys, very little writing, calm coherent audio, world-map exploration | Interactive hotspots and tactile sandbox games without scores |
| Sago Mini School (https://sagomini.com/school/) | Strong character-led art, thematic games, child-initiated curiosity | Themed game scenes with expressive original bear companions |
| Khan Academy Kids (https://khankids.zendesk.com/hc/en-us/articles/360004559231-Welcome-to-Khan-Academy-Kids) | Clear progressive learning by visual skills and age | Parent-facing skills only; in child views, pictorial task cues |
| Canva Draw (https://www.canva.com/help/draw-in-canva/) | Actual freehand tools, layer selection, markers, eraser, editable elements | A preschool-safe mini design studio with only essential giant pictorial tools |
| Reggio Children (https://www.reggiochildren.org/en/reggio-emilia-approach/) | Atelier, environment as educator, hundred languages, child-generated inquiry | Creative explorations, documentation/reflection, physical making |
| HighScope (https://highscope.org/what-we-offer/the-highscope-curriculum/preschool-curriculum/) | Plan–do–review, child initiative, hands-on materials | “Διαλέγω → Παίζω → Δείχνω τι έφτιαξα → Μεταφέρω έξω” |
| NAEYC DAP (https://www.naeyc.org/resources/position-statements/dap/definition/) | Strengths-based, age/individual/context-appropriate playful learning | Differentiation, no shame, no overstimulation, parent co-play |
References are for functional benchmarking, **not for copying proprietary artwork, screens, brand mascots, or Pinterest pins**.

## 2. Creative thesis / the child sees
**Title:** “Το Ζωντανό Χωριό του Πισιπούκ.”
**Audience:** Greek-speaking children ages 2–6, primarily tablet/mobile; parent & educator secondary.
**First paint:** a 2.5D hand-illustrated storybook world. No paragraph copy, no carousel of cards, no full-page scrolling catalogue.
- The **existing beloved village map remains the home**. Six original image hotspots: Ατελιέ / Ιστορίες / Κατασκευές / Κήπος / Μουσική / Εφευρέτες.
- At rest: gentle clouds, butterflies, water, slight swaying trees. On touch: a house door opens, character reacts, camera glides to the relevant scene. Each building contains multiple themed minigames via visual shelves/objects, not stacks of menu buttons.
- Fixed tiny controls: home 🏠, sound 🔊, grownups 🔒, age badge. Everything else is *embedded in the story world*.
- Art style: handcrafted cut-paper, textured gouache, original bear with consistent silhouette, softly sculpted 2.5D layered scenes, bright but calm palette, impeccable shape language, purposeful micro motion, expressive reactions. No emoji in final game graphics. No generic photo cards.
- Deliverables from art pipeline: signed-off character turnaround sheet / rig states (idle, look, point, celebrate, help, speak), world panorama desktop + separate mobile composition, foreground/background depth layers, every building interior, task props, interactions, 80 unique outline masters. All original; artist/asset provenance tracked.

## 3. Navigation wireflows
1. **Welcome:** full-bleed interactive map, age selection shown as 4 tactile signposts (2–3, 3–4, 4–5, 5–6); adult can lock selection; no mandatory account.
2. **Explore:** tap any of the six buildings or visit objects around the village. Accessible map list available with keyboard.
3. **Play:** game occupies immersive main scene; at most 1 visual+spoken prompt at a time. The adult can see objective and offline extension in a collapsible panel.
4. **Create:** Atelier opens as an art workshop, with worktable/canvas filling screen, an illustrated left-hand thumbnail shelf, drawing instruments as physical objects and colors as paint pots.
5. **Finish:** show actual child's creation; buttons “Άλλο παιχνίδι”, “Κρατάω το έργο”, “Φτιάχνω στον πραγματικό κόσμο”; no competitive ratings, streaks or pressure.
6. **Return:** a visible bear/path leads to the exact spot in the village. Preserve 16 legacy worlds as optional transitional archive, not primary destination.
7. **Tablet:** immersive 4:3 or 16:10 composition, no unnecessary scroll; **phone:** distinct portrait scene and contextual sliding illustrated shelf; respect browser zoom and scroll accessibility.

## 4. Gameplay: 10 distinct categories × 10 designed games = 100 SPECIFIED, NOT BUILT
Every title below needs its own mechanic, scene, inputs, success/creative state, task generation contract, pedagogical rationale and at least 12 authored visual prop variants. **Titles are a content backlog, not proof of game implementation.**
### 1. Χρώματα και υλικά
1. Ανακάτεψε μπογιές · 2. Γέμισε το ουράνιο τόξο · 3. Βάψε τον κήπο · 4. Βρες τον χαμαιλέοντα · 5. Χρώματα στην κουζίνα · 6. Κράτα το σωστό πινέλο · 7. Σκιά και χρώμα · 8. Πολύχρωμο εργαστήριο · 9. Ζωντανές μπογιές · 10. Το λουλούδι αλλάζει χρώμα

### 2. Σχήματα και χώρος
1. Χτίσε σπιτάκι · 2. Σχήματα που κυλούν · 3. Σχεδίασε δρόμο · 4. Παζλ από σκιές · 5. Βάλε τις πόρτες · 6. Ταξινόμησε βότσαλα · 7. Πύργος σχημάτων · 8. Φτιάξε μοτίβο στο πάτωμα · 9. Βρες τη σωστή γωνιά · 10. Μεγάλωσε τη γέφυρα

### 3. Αριθμοί και ποσότητες
1. Ταΐζω ζωάκια · 2. Αγρόκτημα με καρότα · 3. Γεμίζω το καλάθι · 4. Κέικ για φίλους · 5. Αριθμητικό τρενάκι · 6. Ζυγαριά με φρούτα · 7. Πόσα λουλούδια άνθισαν; · 8. Χτίζω πύργους · 9. Μικρό παντοπωλείο · 10. Το μονοπάτι των αριθμών

### 4. Μοτίβα και λογική
1. Συνέχισε τον χορό · 2. Μουσικό μοτίβο · 3. Η γέφυρα που λείπει · 4. Αλλαγή εποχών · 5. Τρία ίχνη ζώων · 6. Μηχανή ταξινόμησης · 7. Διάλεξε σωστή διαδρομή · 8. Ντύσε τον καιρό · 9. Αλυσίδα αντικειμένων · 10. Ο κώδικας των λουλουδιών

### 5. Γλώσσα και ήχοι
1. Ζώα που μιλούν · 2. Αρχικός ήχος · 3. Τι κρύβει το κουτί; · 4. Εικονο-ιστορίες · 5. Στο μαγαζί της γειτονιάς · 6. Άκου και βρες · 7. Ποιο ζευγάρι ομοιοκαταληκτεί; · 8. Το στόμα λέει... · 9. Παραμύθι με τρεις εικόνες · 10. Μαζί φτιάχνουμε πρόταση

### 6. Προγραφή και κίνηση χεριού
1. Τα μονοπάτια του Πισιπούκ · 2. Ζωγραφίζω τη βροχή · 3. Ιχνηλατώ κύματα · 4. Το σαλιγκάρι στρίβει · 5. Η πεταλούδα κάνει οκτάρια · 6. Γραμμές στον αέρα · 7. Οδηγώ τον πύραυλο · 8. Φωτίζω αστέρια · 9. Συνδέω τελίτσες · 10. Φτιάχνω δικό μου σχήμα

### 7. Συναισθήματα και συνεργασία
1. Πώς νιώθει σήμερα; · 2. Βοηθώ έναν φίλο · 3. Μοιράζω παιχνίδια · 4. Ο κήπος της ηρεμίας · 5. Το πρόσωπο αλλάζει · 6. Παιχνίδι σειράς · 7. Η μικρή συμφιλίωση · 8. Τι θα έκανες εσύ; · 9. Φτιάχνω μια αγκαλιά · 10. Το κουτί των λύσεων

### 8. Φύση και επιστήμη
1. Φύτεψε σπόρο · 2. Ο κύκλος της πεταλούδας · 3. Πού ζει το ζωάκι; · 4. Δώσε νερό στα φυτά · 5. Άνεμος και φύλλα · 6. Τι επιπλέει; · 7. Ο ουρανός αλλάζει · 8. Πώς μεγαλώνει το φυτό; · 9. Φτιάξε οικοσύστημα · 10. Το ταξίδι της σταγόνας

### 9. Μουσική και ρυθμός
1. Χτύπα ρυθμό · 2. Στήσε ορχήστρα · 3. Ησυχία και ήχος · 4. Κάνε τη βροχή · 5. Μουσικές χρωμάτων · 6. Ο χορός των ζώων · 7. Χτίζω μελωδία · 8. Μικρός μαέστρος · 9. Σταμάτα και κουνήσου · 10. Φτιάξε το δικό σου όργανο

### 10. Αφήγηση και εφευρέσεις
1. Ο ήρωας διαλέγει δρόμο · 2. Φτιάξε τον κόσμο · 3. Η ιστορία του σπόρου · 4. Ποιος έρχεται μετά; · 5. Κουκλοθέατρο στον κήπο · 6. Διάσωση στο δάσος · 7. Ο εφευρέτης στην αυλή · 8. Η μέρα από την αρχή · 9. Το χαμένο παιχνίδι · 10. Μια πόλη από όνειρα


### True replay contract
- Each game uses deterministic **seeded RNG** for QA, unique challenge IDs, an answer validator and bounded age-specific grammar. Shuffle targets **and** scenes, distractors, props, and challenge types; never merely re-order the same 3 questions.
- Keep an on-device recent-task ring buffer to avoid repeated *semantic* content across sessions (configurable, local, no child's identifying data).
- A play session has 3–6 **varied invitations**, not a rigid timed quiz. Correct and exploratory actions trigger different scene changes, physics, character response and voice lines.
- Adaptive scaffolding: based on last 3 actions, reduce distractors, enlarge highlighted object, demonstrate once, or invite open play; never label a child as “weak”.
- Replay test: 50 consecutive replays per category produce several independent tasks; **zero invalid answers, missing props, dead clicks, or unintentional immediate duplicates**. Record distribution of unique semantic IDs; no probabilistic perfection claim.
- Exemplars: Colors = pour paint between cups, direct pixel fill and color mixing; Numbers = physically drag food to hungry creatures; Logic = build a bridge with geometric blocks; Nature = grow plant with persistent visual stages; Music = press instrument to compose, loop and change rhythm. No quiz-only category.

## 5. Canva-inspired child Atelier: actual capability, not a framed SVG screenshot
**Core object model:** editable `templateId` + hierarchical vector scene + isolated locked contour/cut layer + editable color fills + strokes + stickers + transforms + undo tree.
- Select an original A4 / A5 outline → tap-to-fill **closed SVG regions** with palette → brush/marker/chalk → move/scale/rotate stickers → undo/redo → optionally erase paint without erasing outlines.
- Curated illustration shelves, finger-usable tools and large touch handles; parent-only advanced layer/print settings. “Coloring” can be completed entirely by tapping, suitable for children ages 2–3.
- Draft autosave **only on-device**, optional; no children's images, names or portfolios uploaded by default.
- Print: A4=210×297mm and A5=148×210mm, with independent selectable **blank outline** / **colored artwork** / **cut-fold assembly sheet** / **teacher mini-instructions**. Export raster at 300dpi when needed, retain original vector contour for sharp printing; printer margins/bleed and calibration verified physically.
- Constructions are **actual foldable/cuttable parts**, not one flat image pretending to be a craft. Every project must have 4–8 unique visual assembly panels and a safety note; cutting supervised.
- Do **not** claim the browser supports a magic-fill unless region segmentation, SVG layers and click tests are actually implemented.

## 6. 80 distinct templates: 20 different original master illustrations per age (NOT the old 20 motifs repeated 4 times)
### Age 2–3 — 20 distinct assets
1. Αρκουδάκι που χαιρετά · 2. Πανέμορφη πεταλούδα · 3. Γελαστό λουλούδι · 4. Συννεφάκι και σταγόνες · 5. Μεγάλος ήλιος · 6. Μήλο με μάτια · 7. Αχλάδι στον κήπο · 8. Μπανάνα που γελά · 9. Γατούλα στο μαξιλάρι · 10. Σκυλάκι με μπάλα · 11. Χελωνάκι · 12. Ψαράκι σε λίμνη · 13. Πασχαλίτσα σε φύλλο · 14. Πουλάκι στη φωλιά · 15. Δέντρο με μεγάλα φύλλα · 16. Το σπιτάκι μου · 17. Αυτοκίνητο με μεγάλους τροχούς · 18. Λεωφορείο · 19. Μπαλόνια γιορτής · 20. Γαλότσες στη βροχή

### Age 3–4 — 20 distinct assets
1. Τα πρόσωπα της χαράς · 2. Σαλιγκάρι στον κήπο · 3. Κάμπια από κύκλους · 4. Ο βυθός και τα ψάρια · 5. Κήπος με έντομα · 6. Η οικογένεια των αρκούδων · 7. Ο φούρνος της γειτονιάς · 8. Η μικρή φάρμα · 9. Το δέντρο τεσσάρων εποχών · 10. Το ουράνιο τόξο μετά τη βροχή · 11. Καραβάκι με πανί · 12. Αεροπλανάκι με παράθυρα · 13. Πίτσα από σχήματα · 14. Η ομπρέλα της βροχής · 15. Λιοντάρι με χαίτη · 16. Η γειτονιά μου · 17. Καστράκι με παράθυρα · 18. Καλάθι με φρούτα · 19. Τούρτα γενεθλίων · 20. Μανιτάρια στο δάσος

### Age 4–5 — 20 distinct assets
1. Συμμετρική πεταλούδα · 2. Θέατρο δαχτυλόκουκλων · 3. Τροχός των εποχών · 4. Τροχός καιρού · 5. Κρεμαστό ηλιακό σύστημα · 6. Τέσσερα στάδια σπόρου · 7. Κουτιά ανακύκλωσης · 8. Σπίτι που διπλώνει · 9. Πύραυλος που στήνεται · 10. Ζώα και βιότοποι · 11. Το σώμα μου · 12. Μάσκες συναισθημάτων · 13. Ρολόι με κινητούς δείκτες · 14. Τρένο αριθμών · 15. Κουκλοθέατρο παραμυθιού · 16. Επίπεδα του κήπου · 17. Μανάβικο για παιχνίδι · 18. Χάρτης διαδρομής · 19. Υφαντό από λωρίδες · 20. Κύκλος ζωής βατράχου

### Age 5–6 — 20 distinct assets
1. Χάρτινος αυτοματισμός κίνησης · 2. Δεινόσαυρος τρισδιάστατος · 3. Τροχιές πλανητών · 4. Κύκλος ζωής πεταλούδας · 5. Κύκλος νερού με τροχό · 6. Αρχιτεκτονικό σπίτι 3D · 7. Αναδυόμενο βιβλίο · 8. Χάρτης αστερισμών · 9. Ντόμινο μαθηματικών · 10. Περιστρεφόμενος τροχός ήχων · 11. Θέατρο σκιών · 12. Πόλη και κανόνες κυκλοφορίας · 13. Χάρτης της γειτονιάς · 14. Μωσαϊκό γεωμετρικών σχημάτων · 15. Παιχνίδι μίνι αγοράς · 16. Μετεωρολογικός σταθμός · 17. Κάρτες ταξινόμησης φύσης · 18. Εφευρίσκω μια μηχανή · 19. Αεροπλανάκι ανεμοπορίας · 20. Επιτραπέζιο μονοπατιών

Each template record: master asset license/artist/source, templateType (color / sticker / fold / cut / assemble), closeable regions, SVG layers, color palette, teacher script, age constraints, physical craft stages, preview image, print fixtures. No Pinterest direct copy or unlicensed downloads.

## 7. Production engineering stack — smallest correct per layer
| Problem | Choice | Why/guardrail |
|---|---|---|
| Existing app | React 19, existing Vite/TanStack stack | Keep routing and unrelated website intact |
| Screen transitions & tactile gestures | **Motion for React** (`motion/react`, successor to Framer Motion; https://motion.dev/docs/react) | Animate entering buildings, tactile drag, cancel, reduced-motion |
| Character behavior | **Rive** state machines, original artist-rigged bear (https://rive.app/) | Interactive idle/listen/gesture/voice states; verify paid-editor restrictions/asset licenses |
| 2D games | PixiJS or native SVG Canvas, benchmark first | Hit testing, particles, physics when needed, don't force WebGL for every mini-game |
| Child painting + stickers | react-konva/Konva or editable SVG document model (https://konvajs.org/) | Shape transforms and high-res export; audit SVG/shape fill behavior before choosing |
| Selected 2.5D interactive scene | React Three Fiber / Three.js **optional** (https://r3f.docs.pmnd.rs/getting-started/introduction) | Only if measured, lazy loaded and a full 2D fallback exists; avoid heavy static 3D |
| Print | SVG master + trusted PDF raster/vector renderer already in repo | A4/A5 dimension + 300dpi physical samples |
| Audio | Greek human voice lines (licensed/recorded), optional Web Speech fallback | Explicit play gesture, mute/replay, proper pronunciation, no autoplay |
| Asset workflow | original storyboards → original illustrations → rig/sprite/vector layer manifest | Texture atlases, responsive crops, lazy load, license audit |
Performance: prioritize first-map LCP < 2.5 s on realistic mid-tier devices where achievable; test memory and frame pacing (target smooth 60 fps, graceful 30 fps lower-tier), not arbitrary bundle promises. Disable idle animations under reduced-motion and low-power, all tasks remain usable in fallback.

## 8. Teaching and activity design
- Reggio-inspired: children as co-creators, prompts as open **invitations**; multiple valid outcomes for creative activities; document process not just right answers.
- HighScope: `choose → do → share`, teacher prompts to discuss feelings, choices and outcomes.
- NAEYC: 2–3: cause/effect and 1-step interactions; 3–4: sort, imitate, pretend; 4–5: classify, sequence, build; 5–6: design, infer, narrate. Not an IQ test or diagnostic assessment.
- Experience pacing: 2–6 minute optional sessions, adult co-play suggestions, real-world follow-up each mission. No overstimulating confetti loops, ads, leaderboards, streak pressure.

## 9. Source-backed skills and execution order
Reviewed from `vmoulakakis/Myagenticteam`: `universal-creation-orchestrator` (mode ARCHITECT), `agentic-development-lifecycle`, `web-design-intelligence` (canonical), `ui-craft-quality` (supporting), `ai-ui-production-toolchain`. Follow actual repo `AGENTS.md`; no DESIGN.md exists in main; create a scoped `docs/preschool/DESIGN.md` before implementation.
**Stages:** 1) approve illustrated map art/scene map + mobile composition; 2) one fully working painted SVG → cut PDF craft, one open-ended physical game; 3) 10 game engine families with deterministic generators and age scaffolding; 4) 100 distinct gameplay content sets and 80 independently art-directed masters; 5) narration and animated characters; 6) independent review, mobile/browser and physical printer QA; 7) versioned production release after explicit authorization.
- **Creative acceptance gate:** static full-screen visuals must look like a professionally illustrated preschool game before Motion/3D. Character sheets consistent; NO emoji props; every control has illustrated affordance.
- **Interactive gate:** at least one actual multi-step creative mini-game and one actual tactile game, not a screenshot or “click next”.
- **Quantitative gate:** 100 real unique game entries, 80 unique age-specific vector masters, ≥10 unique tactile mechanics, semantic replay variability and correct validated outcomes.
- **Atelier gate:** every master can be colored and printed; A4/A5 real printer QA, cut/fold instructions physically demonstrable.
- **Safety/privacy:** minimum data and no third-party child identifiers, no public sharing, licensed art/sounds, parent gate for exporting/sharing and external links.
- **QA:** browser screenshots at 320/390/768/1440 and tablet 1024, visual diff vs approved artboard, 200% zoom, touch gestures, voice pronunciation, slow device, memory leaks, offline and reduced motion, axe-core, performance profile, child + educator observational review.
- **Protected scope:** test home/contact/gallery and legacy routes; no other site modification; PR to production only after review, evidence and rollback plan.

**Release decision:** CURRENT SITE STAYS LIVE. No code changes or deployment authorized by this research document.
