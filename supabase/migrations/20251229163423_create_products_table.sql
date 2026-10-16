-- Create Products Table
create table if not exists public.products (
    id uuid not null default gen_random_uuid(),
    business_id uuid not null references public.businesses(id) on delete cascade,
    external_id text, -- CJ PID or Shopify ID
    title text not null,
    description text,
    cost_price decimal(10,2),
    selling_price decimal(10,2),
    images text[], -- Array of image URLs
    supplier_info jsonb default '{}'::jsonb, -- Store supplier details (name, url, moq)
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint products_pkey primary key (id)
);

-- RLS Policies
alter table public.products enable row level security;

create policy "Users can view their own products"
    on public.products for select
    using ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );

create policy "Users can insert their own products"
    on public.products for insert
    with check ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );

create policy "Users can update their own products"
    on public.products for update
    using ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );

create policy "Users can delete their own products"
    on public.products for delete
    using ( auth.uid() in ( select user_id from public.businesses where id = business_id ) );

-- Add theme_config to businesses if missing (for Phase 3)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'businesses' and column_name = 'theme_config') then
        alter table public.businesses add column theme_config jsonb default '{}'::jsonb;
    end if;
end $$;
