# CRM + Calendly setup

The app now accepts signed Calendly `invitee.created` and `invitee.canceled` webhooks at:

`/api/webhooks/calendly`

The handler stores only the booking details requested by the team: name, email, the full-address/phone answer, the meeting-preparation answer, event references, booking status and timestamps. It does not store the anonymous finder answers.

## 1. Environment variables

Configure these values locally and in the deployment environment. Never commit them or expose the service-role key to the browser.

```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...
CALENDLY_PAT_TOKEN=...
CALENDLY_WEBHOOK_SIGNING_KEY=...
```

## 2. Create the table

Run `supabase/migrations/20260825140000_create_crm_leads.sql` in the Supabase SQL editor or through the Supabase CLI. Row-level security is enabled and no `anon` or `authenticated` table access is granted; only the server-side service-role client can write records.

## 3. Register the Calendly webhook

After the app has an HTTPS deployment, create one `invitee.created` and `invitee.canceled` subscription using an owner/admin Calendly token. Scope it to the organization or each user whose event types are used by the site.

```bash
curl --request POST \
  --url https://api.calendly.com/webhook_subscriptions \
  --header "Authorization: Bearer $CALENDLY_PAT_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{
    "url": "https://YOUR_DOMAIN/api/webhooks/calendly",
    "events": ["invitee.created", "invitee.canceled"],
    "scope": "organization",
    "organization": "https://api.calendly.com/organizations/YOUR_ORGANIZATION_ID"
  }'
```

Save the `signing_key` returned by Calendly as `CALENDLY_WEBHOOK_SIGNING_KEY`. Calendly signs the timestamp and raw request body with HMAC-SHA256; the route rejects missing, invalid or stale signatures.

## 4. Verify before launch

Create a test booking in the 30-minute event, confirm a row appears in `crm_leads`, then cancel it and confirm the same row changes to `canceled`. Review the privacy copy and approve the exact retention period before production publication.
