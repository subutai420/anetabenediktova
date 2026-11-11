-- =====================================================================
--  anetabenediktova.cz – základní schéma
--  Tabulky: posts (blog), stays (pobyty), admin_users (kdo smí do administrace)
--  Úložiště: bucket "media" pro obrázky nahrané z administrace
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Administrátoři ------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "admin_users: admin čte" on public.admin_users
  for select using (public.is_admin() or user_id = auth.uid());

-- ---------- Společný trigger na updated_at --------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Blog -----------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,                       -- HTML z editoru
  cover_image text,
  category text,                      -- Přírodní léčba / Byliny a houby / Cesty a rituály / Ženská péče
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz default now(),
  seo_title text,
  seo_description text,
  legacy_url text,                    -- původní adresa na starém webu (pro přesměrování)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts (status, published_at desc);
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
create policy "posts: veřejnost čte publikované" on public.posts
  for select using (status = 'published' and published_at <= now());
create policy "posts: admin čte vše" on public.posts
  for select using (public.is_admin());
create policy "posts: admin zapisuje" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Pobyty ---------------------------------------------------------
create table if not exists public.stays (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  excerpt text,                       -- krátký text na kartu
  country text,                       -- Mexiko / Peru / Česko
  location text,
  date_text text,                     -- volný text termínu, např. „listopad 2026“
  start_date date,                    -- volitelné – pro řazení a automatické skrytí po termínu
  end_date date,
  duration_text text,                 -- „10 dní“, „11 nocí“
  price_text text,                    -- „1 550 EUR“
  capacity text,
  cover_image text,
  gallery text[] not null default '{}',
  content text,                       -- HTML z editoru (program, cena, ubytování…)
  cta_text text default 'Mám zájem',
  booking_url text,                   -- externí rezervace (reenio, formulář…), jinak kontakt
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,  -- zobrazit na úvodní stránce
  sort_order integer not null default 100,
  seo_title text,
  seo_description text,
  legacy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists stays_published_idx on public.stays (status, sort_order);
create trigger stays_updated_at before update on public.stays
  for each row execute function public.set_updated_at();

alter table public.stays enable row level security;
create policy "stays: veřejnost čte publikované" on public.stays
  for select using (status = 'published');
create policy "stays: admin čte vše" on public.stays
  for select using (public.is_admin());
create policy "stays: admin zapisuje" on public.stays
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Úložiště obrázků ----------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: veřejné čtení" on storage.objects
  for select using (bucket_id = 'media');
create policy "media: admin nahrává" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media: admin upravuje" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
create policy "media: admin maže" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
