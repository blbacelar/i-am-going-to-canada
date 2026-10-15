alter table public.crm_leads
  add column if not exists calendly_scheduled_at timestamptz,
  add column if not exists signwell_document_id text unique,
  add column if not exists contract_completed_at timestamptz,
  add column if not exists contract_completion_notified_at timestamptz;

create index if not exists crm_leads_signwell_document_id_idx on public.crm_leads (signwell_document_id);
