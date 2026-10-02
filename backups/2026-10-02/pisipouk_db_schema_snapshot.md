# Pisipouk database schema snapshot — 2026-10-02

Supabase project: `gqpbskssrvpfjtujwezc`

This file records the application-owned `pisipouk_*` schema shape and row counts without exporting secret or personal row contents into the public GitHub repository.

## Tables / relations
- `pisipouk_admin_audit`
- `pisipouk_admin_credentials`
- `pisipouk_admin_sessions`
- `pisipouk_admins`
- `pisipouk_daily_stats`
- `pisipouk_events`
- `pisipouk_internal_visitors`
- `pisipouk_leads`
- `pisipouk_messages`
- `pisipouk_reviews`
- `pisipouk_settings`
- `pisipouk_subscribers`

## Row counts at snapshot time
- `pisipouk_events`: 1743
- `pisipouk_leads`: 4
- `pisipouk_messages`: 0
- `pisipouk_reviews`: 0
- `pisipouk_settings`: 4
- `pisipouk_admin_credentials`: 1
- `pisipouk_admin_sessions`: 0
- `pisipouk_admin_audit`: 0
- `pisipouk_admins`: 0
- `pisipouk_internal_visitors`: 0
- `pisipouk_subscribers`: 1

## Key columns
### `pisipouk_events`
`id bigint`, `created_at timestamptz`, `session_id text`, `visitor_id text`, `event_type text`, `path text`, `referrer text`, `utm_source text`, `utm_medium text`, `utm_campaign text`, `metadata jsonb`, `network_hash text`, `country text`, `region text`, `city text`.

### `pisipouk_leads`
`id uuid`, `created_at timestamptz`, `parent_name text`, `phone text`, `email text`, `child_age text`, `message text`, `source text`, `page text`, `utm jsonb`, `status text`, `email_status text`, `email_error text`.

### `pisipouk_messages`
`id uuid`, `created_at timestamptz`, `updated_at timestamptz`, `name text`, `phone text`, `email text`, `child_age text`, `preferred_contact text`, `message text`, `consent boolean`, `status text`, `source text`, `utm_source text`, `utm_medium text`, `utm_campaign text`, `admin_notes text`, `follow_up_at timestamptz`, `last_contacted_at timestamptz`, `archived boolean`.

### `pisipouk_reviews`
`id uuid`, `created_at timestamptz`, `updated_at timestamptz`, `source text`, `source_url text`, `external_id text`, `reviewer_name text`, `rating numeric`, `review_text text`, `review_date date`, `verified boolean`, `is_featured boolean`, `is_published boolean`.

### `pisipouk_settings`
`key text`, `value jsonb`, `is_public boolean`, `updated_at timestamptz`.

### `pisipouk_subscribers`
`id uuid`, `email text`, `first_name text`, `status text`, `source text`, `utm jsonb`, `consent_at timestamptz`, `unsubscribed_at timestamptz`, `unsubscribe_token uuid`, `welcome_email_status text`, `welcome_email_error text`, `created_at timestamptz`, `updated_at timestamptz`.

### Admin / security tables
- `pisipouk_admin_credentials`: `id`, `salt`, `password_hash`, `updated_at`
- `pisipouk_admin_sessions`: `id`, `token_hash`, `created_at`, `expires_at`, `last_seen_at`
- `pisipouk_admins`: `user_id`, `email`, `active`, `created_at`
- `pisipouk_admin_audit`: `id`, `created_at`, `action`, `entity_type`, `entity_id`, `details`
- `pisipouk_internal_visitors`: `visitor_id`, `excluded_at`

## Constraints
- Primary keys exist on the core tables.
- `pisipouk_admin_sessions.token_hash` is unique.
- `pisipouk_admins.user_id` references `auth.users(id)` with `ON DELETE CASCADE`.
- `pisipouk_leads.status` is restricted to `new`, `contacted`, `visit_booked`, `enrolled`, `closed`.
- `pisipouk_messages.status` is restricted to `new`, `contacted`, `appointment`, `enrolled`, `closed`, `spam`.
- `pisipouk_reviews.rating` is restricted to 1–5.
- `pisipouk_subscribers.email` and `unsubscribe_token` are unique.
- `pisipouk_subscribers.status` is restricted to `active` or `unsubscribed`.

## Important indexes
- Events: created_at, event_type, geo, network_hash, session_id.
- Leads: created_at, status.
- Messages: created_at, follow_up_at, status.
- Reviews: publication/featured state.
- Subscribers: created_at, email, status, unsubscribe_token.

## Security note
No password hashes, salts, session hashes, visitor identifiers, lead/subscriber personal data, API keys, or secret values are exported into this public repository. The generated Supabase TypeScript types already present in the source snapshot remain an additional schema reference.
