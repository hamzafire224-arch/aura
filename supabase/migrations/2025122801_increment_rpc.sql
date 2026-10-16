-- RPC function for atomic increments (prevents race conditions on high traffic)
create or replace function increment_visitors(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update businesses
  set visitors = visitors + 1
  where id = row_id;
end;
$$;
