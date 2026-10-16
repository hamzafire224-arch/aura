
-- Create verification_codes table
create table if not exists public.verification_codes (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Index for faster lookups
create index if not exists verification_codes_email_idx on public.verification_codes (email);

-- Enable RLS
alter table public.verification_codes enable row level security;

-- Create policy to allow only service_role (Edge Functions) to access
-- No policy for anon or authenticated means they have no access by default (deny all)
create policy "Service role can do everything"
  on public.verification_codes
  using ( auth.role() = 'service_role' );
