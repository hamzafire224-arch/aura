create table if not exists public.orders (
    id uuid not null default gen_random_uuid(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    customer_email text,
    customer_name text,
    total_amount decimal(10,2) not null,
    currency text default 'USD',
    status text default 'pending', -- pending, paid, shipped, cancelled
    items jsonb default '[]'::jsonb,
    stripe_session_id text,
    shipping_address jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint orders_pkey primary key (id)
);

-- RLS
alter table public.orders enable row level security;

create policy "Users can view orders for their businesses"
    on public.orders for select
    using ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );

create policy "Edge Functions can insert orders"
    on public.orders for insert
    with check ( true ); -- Typically strictly controlled via service role in Edge Function

create policy "Users can update orders for their businesses"
    on public.orders for update
    using ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );
