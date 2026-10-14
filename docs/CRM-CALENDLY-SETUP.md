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

## Contract dispatch guard

Only event types explicitly configured in `data/consultants.json` may send a client contract. Unknown, legacy and test Calendly event types fail closed: the booking can be recorded in the CRM, but no contract is created or emailed.

The contract fee is derived from the exact Calendly event type and confirmed duration. The regular 30-minute and 60-minute consultations are **CA$150.00** and **CA$200.00**. Marina's direct Calendly events are also approved for automatic contracts: Xpress Call 15 min (**CA$85.00**), IRB Consultation (**CA$300.00**), Temporary residence review (**CA$300.00**) and Mentoring/Consulting for representatives ONLY - 1h (**CA$150.00**). Virginia's direct Calendly events are also approved: Emergency (**CA$250.00**), Review of Arrima or Express Entry Profile (**CA$300.00**), Temporary residence review (**CA$300.00**), 60-minute consultation (**CA$200.00**) and 30-minute consultation (**CA$150.00**). Do not set an environment-variable fee for production contracts.

## Consultant signature assignment

The contract resolves the consultant from the exact Calendly event type and shows that consultant's name, RCIC credential and approved signature. Marina, Aline, Virginia and Beatriz have approved signature assets. A booking for a consultant without an approved signature fails closed: it is recorded in the CRM but no SignWell contract is sent. Add the signature under `public/brand/`, then add its mapping in `src/lib/contracts/consultant-assignment.ts` before enabling that consultant's contracts.

## Signed-contract confirmation

When SignWell posts `document_completed`, the app archives the completed PDF in Dropbox and sends an internal confirmation to `info@iamgoingtocanada.ca`. The confirmation contains the client's name, email, supplied contact details and the Calendly appointment date in Vancouver time.

The contract request stores those booking details as private SignWell metadata. Apply `supabase/migrations/20261008183000_track_signed_contract_notifications.sql` before deploying this change. The migration records the SignWell document ID and notification timestamp so a retried webhook does not send a duplicate confirmation.

## 4. Verify before launch

Create a test booking in the 30-minute event, confirm a row appears in `crm_leads`, then cancel it and confirm the same row changes to `canceled`. Review the privacy copy and approve the exact retention period before production publication.
