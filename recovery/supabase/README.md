# Supabase Pisipouk Snapshot

Project ref: `gqpbskssrvpfjtujwezc`
Region: `eu-central-1`
API URL: `https://gqpbskssrvpfjtujwezc.supabase.co`

Captured Edge Functions:
- `pisipouk-api` v3 — JWT verification off
- `pisipouk-lead` v3 — JWT verification off
- `pisipouk-event` v2 — JWT verification off
- `pisipouk-admin-data` v1 — JWT verification on
- `pisipouk-subscribe` v2 — JWT verification off

Relevant database objects observed:
- `pisipouk_admin_audit`
- `pisipouk_admin_credentials`
- `pisipouk_admin_sessions`
- `pisipouk_admins`
- `pisipouk_events`
- `pisipouk_internal_visitors`
- `pisipouk_leads`
- `pisipouk_messages`
- `pisipouk_reviews`
- `pisipouk_settings`
- `pisipouk_subscribers`
- view `pisipouk_daily_stats`

Relevant migrations:
- `20260918202336 add_pisipouk_crm_admin_tables`
- `20260920134953 create_pisipouk_growth_tables`
- `20260920191452 pisipouk_daily_stats_athens_conversion_accuracy`
- `20260920192112 pisipouk_internal_traffic_and_network_analytics`
- `20260920194851 pisipouk_resend_key_vault_rpc`
- `20260920195237 pisipouk_email_subscribers`

The function source is backed up here, but live data and secret values are not copied into this public repository. Run `restore-functions.sh` only when intentionally redeploying the captured functions to the existing Supabase project.
