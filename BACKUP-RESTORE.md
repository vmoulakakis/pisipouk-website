# Pisipouk Full Recovery Snapshot — 2026-09-21

This branch is a recovery point for the Pisipouk website.

## Recovery point

- Repository: `vmoulakakis/pisipouk-website`
- Backup branch: `backup/full-site-ready-2026-09-21`
- Stable production source commit: `6bbe284a9531e7b738ff8ee65b779d641b2a9fe8`
- Production site: `https://pisipouk.vercel.app`
- Vercel project: `pisipouk`
- Vercel project id: `prj_VXN6LQQZYgXRK9fDy4PEJ3V0PUhW`
- Vercel team id: `team_jt3jd1HJUB4sK1oZdl9MUYGs`
- Framework: Vite + React + TanStack Router

## What is backed up here

1. Complete frontend repository at the stable production recovery point.
2. `package-lock.json` for reproducible dependency installation.
3. `vercel.json`, Vite and TypeScript configuration.
4. Static assets, public files, routes, components, SEO files and source code.
5. Browser/server environment variable names in `.env.example` — no secret values.
6. Pisipouk Supabase schema snapshot:
   - `backup/supabase/pisipouk-schema.sql`
7. Pisipouk Supabase Edge Function source snapshots:
   - `backup/supabase/functions/pisipouk-api/index.ts`
   - `backup/supabase/functions/pisipouk-lead/index.ts`
   - `backup/supabase/functions/pisipouk-event/index.ts`
   - `backup/supabase/functions/pisipouk-admin-data/index.ts`
   - `backup/supabase/functions/pisipouk-subscribe/index.ts`

## Supabase

- Project ref: `gqpbskssrvpfjtujwezc`
- Region: `eu-central-1`
- API URL: `https://gqpbskssrvpfjtujwezc.supabase.co`

Pisipouk database objects included in the schema snapshot:

- `pisipouk_messages`
- `pisipouk_reviews`
- `pisipouk_settings`
- `pisipouk_admin_credentials`
- `pisipouk_admin_sessions`
- `pisipouk_admin_audit`
- `pisipouk_leads`
- `pisipouk_events`
- `pisipouk_admins`
- `pisipouk_internal_visitors`
- `pisipouk_subscribers`
- view: `pisipouk_daily_stats`

### Important security note

Production database rows, passwords, tokens, API secrets, service-role keys and subscriber/lead personal data are deliberately NOT committed to GitHub.

This repository contains the application and schema needed to rebuild the service, but restoring historical production data requires a Supabase database backup/export from the production project.

## Required environment variables

Use `.env.example` as the canonical list. Main values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` when required
- `RESEND_API_KEY` when email delivery is enabled

Never commit real secret values.

## End-to-end frontend rebuild

```bash
git clone <repository-url>
cd pisipouk-website
git checkout backup/full-site-ready-2026-09-21
npm ci
npm run build
```

The build output is `dist/`.

To run locally:

```bash
npm run dev
```

## Restore the stable site to main

Only do this intentionally after reviewing any newer changes.

```bash
git checkout main
git reset --hard 6bbe284a9531e7b738ff8ee65b779d641b2a9fe8
git push --force-with-lease origin main
```

A safer alternative is to create a new recovery branch from the backup and merge it after review.

## Vercel rebuild

1. Import/connect `vmoulakakis/pisipouk-website`.
2. Framework: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Restore the environment variables from the authorized secret store/Vercel project settings.
6. Deploy.
7. Verify the production alias and key routes before declaring recovery complete.

## Supabase rebuild

1. Create or select the intended Supabase project.
2. Apply `backup/supabase/pisipouk-schema.sql`.
3. Restore the Edge Functions from `backup/supabase/functions/*/index.ts`.
4. Configure server-side secrets in Supabase; do not put them in source control.
5. Restore production data separately from an authorized database backup if historical data is required.
6. Reconfigure authentication/admin access as required.
7. Verify contact leads, analytics events, subscriptions and admin reads.

## Recovery verification checklist

- `npm ci` succeeds.
- `npm run build` succeeds.
- Home page loads.
- Core routes render without client-router 404.
- Contact form writes to Supabase.
- Analytics events write to Supabase.
- Subscription form writes to Supabase.
- Email delivery works only after Resend configuration is restored.
- Vercel production deployment reports READY.
- Test the deployed route itself in the browser; HTTP 200 for the SPA shell alone is not sufficient.

## Change safety rule

Before risky routing, dependency, backend or deployment changes:

1. Confirm current production is READY and working.
2. Create a dated recovery branch from that known-good commit.
3. Make the change on main.
4. Verify build and rendered routes.
5. Keep the prior recovery branch until the new release is proven stable.
