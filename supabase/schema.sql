-- ==============================================================================
-- SKEMA DATABASE WEB SASTRA UNTUK SUPABASE
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. TABEL KATEGORI
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- 2. TABEL KARYA
create table if not exists public.works (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null references public.categories(slug) on update cascade on delete restrict,
  excerpt text not null default '',
  content text not null default '',
  published_at text not null default to_char(current_date, 'YYYY-MM-DD'),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

create index if not exists works_status_idx on public.works(status);
create index if not exists works_published_at_idx on public.works(published_at desc);
create index if not exists works_category_idx on public.works(category);

-- 3. TABEL BERKAS KARYA
create table if not exists public.work_files (
  id text primary key,
  work_id text not null references public.works(id) on delete cascade,
  name text not null,
  mime text not null,
  size bigint not null,
  extension text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists work_files_work_id_idx on public.work_files(work_id);

-- 4. TABEL PROFIL PENULIS (Hanya 1 baris, id = 1)
create table if not exists public.author_profile (
  id integer primary key default 1 check (id = 1),
  name text not null,
  initials text not null,
  role text not null,
  location text not null,
  short_bio text not null,
  bio jsonb not null default '[]'::jsonb,
  quote text not null,
  experience jsonb not null default '[]'::jsonb,
  publications jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik boleh membaca karya published, kategori, profil, dan berkas karya published
-- ==============================================================================

alter table public.categories enable row level security;
alter table public.works enable row level security;
alter table public.work_files enable row level security;
alter table public.author_profile enable row level security;

-- Policies untuk categories (publik boleh baca semua)
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Policies untuk works (publik hanya boleh baca status published)
drop policy if exists "Published works are viewable by everyone" on public.works;
create policy "Published works are viewable by everyone"
  on public.works for select
  using (status = 'published');

-- Policies untuk work_files (publik hanya boleh baca berkas dari karya published)
drop policy if exists "Published work files are viewable by everyone" on public.work_files;
create policy "Published work files are viewable by everyone"
  on public.work_files for select
  using (
    exists (
      select 1 from public.works
      where public.works.id = public.work_files.work_id
      and public.works.status = 'published'
    )
  );

-- Policies untuk author_profile (publik boleh baca)
drop policy if exists "Profile is viewable by everyone" on public.author_profile;
create policy "Profile is viewable by everyone"
  on public.author_profile for select
  using (true);

-- Catatan: Untuk operasi insert/update/delete oleh Admin, Server Actions
-- menggunakan Service Role Client (SUPABASE_SERVICE_ROLE_KEY) yang otomatis
-- melewati (bypass) RLS secara aman di server.

-- ==============================================================================
-- STORAGE BUCKET: berkas-karya
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('berkas-karya', 'berkas-karya', true)
on conflict (id) do update set public = true;

-- Policy agar berkas di storage bucket bisa diunduh/dilihat publik
drop policy if exists "Public Access berkas-karya" on storage.objects;
create policy "Public Access berkas-karya"
  on storage.objects for select
  using (bucket_id = 'berkas-karya');

-- Policy agar upload via service role berjalan lancar
drop policy if exists "Service role manage berkas-karya" on storage.objects;
create policy "Service role manage berkas-karya"
  on storage.objects for all
  using (bucket_id = 'berkas-karya')
  with check (bucket_id = 'berkas-karya');
