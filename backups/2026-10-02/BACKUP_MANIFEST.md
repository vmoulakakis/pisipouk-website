# Pisipouk production backup — 2026-10-02

## Snapshot identity
- Site: https://pisipouk.vercel.app/
- GitHub repository: `vmoulakakis/pisipouk-website`
- Backup branch: `backup/pisipouk-2026-10-02`
- Production source commit: `ac04f5690208c0b086c5f8c1c6c57f17c8d3382f`
- Vercel project: `pisipouk` (`prj_VXN6LQQZYgXRK9fDy4PEJ3V0PUhW`)
- Production deployment: `dpl_Bh1KQcUpCgumpNPdrxKfGqZe98A3`
- Supabase project: `vmdb` (`gqpbskssrvpfjtujwezc`)
- Backup date: 2026-10-02 (Europe/Athens)

## What is backed up
The backup branch is pinned from the exact production source commit above, so it preserves the complete repository state at that point: application source code, routes, UI components, static/public assets, package manifests/lockfile, generated Supabase TypeScript schema types, configuration templates, tests/scripts and all other versioned files.

Additional database metadata and safe public configuration snapshots are stored in this directory.

## Database state at backup time
- `pisipouk_events`: 1743 rows
- `pisipouk_leads`: 4 rows
- `pisipouk_messages`: 0 rows
- `pisipouk_reviews`: 0 rows
- `pisipouk_settings`: 4 rows
- `pisipouk_admin_credentials`: 1 row
- `pisipouk_admin_sessions`: 0 rows
- `pisipouk_admin_audit`: 0 rows
- `pisipouk_admins`: 0 rows
- `pisipouk_internal_visitors`: 0 rows
- `pisipouk_subscribers`: 1 row

## Security / privacy rule
This repository is PUBLIC. Therefore this backup intentionally does **not** commit secret-bearing or personally identifying production values such as:
- password salts / password hashes
- session token hashes
- service/API keys
- visitor/session/network identifiers
- lead names, phone numbers, email addresses, free-text messages
- subscriber email addresses or unsubscribe tokens

Those values remain in the Supabase production database and are not copied into GitHub. This prevents turning a backup into a credential or privacy leak.

## Restore reference
To restore the site code to this snapshot, use the production source commit:

`ac04f5690208c0b086c5f8c1c6c57f17c8d3382f`

or the backup branch:

`backup/pisipouk-2026-10-02`

The database schema/configuration reference is captured separately in this backup directory; sensitive live data must be restored from an authenticated Supabase database backup rather than from this public repository.
