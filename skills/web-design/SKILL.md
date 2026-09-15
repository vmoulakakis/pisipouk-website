---
name: pisipouk-web-design
description: Design and maintain the Greek Pisipouk preschool website in this repository, preserving its parent visit flow and verified local content.
---

# Pisipouk design contract

Read docs/PLAN.md for page architecture, source status, tokens, measurement, and launch checks. This project uses MyAgenticTeam web-design-intelligence and BLACK_BELT_SEO, reference commit 67b8806a58c0234fab7cd82aa4125409567ae598. Changes here do not authorize changes to other projects.

- Goal: parents evaluating preschool in Agios Dimitrios request a visit; secondary call and directions.
- Design thesis: a child's first little album. Real space photos, spacious blue typography, pink CTAs, yellow notes. Avoid SaaS grids, fake metrics, intrusive popups, invented facilities and generic stock-school proof.
- Production stack: Next.js App Router + TypeScript on Vercel for five indexable routes and server form. Native CSS first; only reviewed free/open components, optional Lucide icons. Verify current versions/licenses when installing. No paid design dependency. The design HTML is a dependency-free prototype, not production.
- Routes: /, /o-stathmos, /kathimerinotita, /eggrafes, /epikoinonia; supporting privacy page. Keep distinct content and natural links.
- Interactions: mobile menu, real gallery lightbox, FAQ, contact form, tel link, directions, click-open bear helper. CSS transitions first; respect reduced motion and native scroll. No decorative 3D.
- Colors: #173754 ink, #0758C9 blue, #D81765 pink, #FFD447 yellow, #DDF6EB mint, white. Proposed Manrope display/Noto Sans body with Greek support; system fallbacks. 8px spacing rhythm, 18px body, 48px touch controls. One column mobile and safe-area sticky actions.
- Uploaded mockups are design references, not authentic photo evidence. Secure actual source imagery; bake face covering into final image assets. Do not publish identifiable child originals behind overlays.
- Review quotations must be authentic Google reviews with required attribution. Label selected positive excerpts, preserve true aggregate and total count if shown. No self-serving review rich-result markup. Omit unverified reviews.
- Verify ESPA participation, dates, vacancies, staff and services before claiming them. No unsupported safety absolutes.
- SEO: unique title/description/H1, canonical on one verified domain, sitemap, crawlable HTML, accurate entity and breadcrumbs; no location doorway pages. Prototype noindex. Never guarantee rankings.
- Accessibility/performance: keyboard, visible focus, labels, reduced motion, 200% zoom, contrast review; image sizes/lazy loading; targets LCP 2.5s, INP 200ms, CLS 0.1, measured separately from claims.
- Track call_click, directions_click and form start/success/error without personal data. Success requires provider acknowledgement; retain input on failure. No personal data in GitHub.
- Verify responsive layout, navigation, form failure/success, build/typecheck, metadata, image provenance and actual deployment before declaring production ready. Unavailable evidence means UNVERIFIED. Scope testing to actual changes.
