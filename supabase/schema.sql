-- Jalankan seluruh SQL ini di Supabase > SQL Editor

create table if not exists public.booth_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  background text,
  caption text,
  created_at timestamptz default now()
);

alter table public.booth_photos enable row level security;

create policy "public can read booth photos"
on public.booth_photos for select
to anon, authenticated
using (true);

create policy "public can insert booth photos"
on public.booth_photos for insert
to anon, authenticated
with check (true);

create policy "public can delete booth photos"
on public.booth_photos for delete
to anon, authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('booth-photos', 'booth-photos', true)
on conflict (id) do nothing;

create policy "public can upload booth photos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'booth-photos');

create policy "public can view booth photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'booth-photos');

create policy "public can delete booth photos"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'booth-photos');