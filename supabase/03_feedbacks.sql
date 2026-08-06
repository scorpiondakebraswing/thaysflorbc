-- ============================================================
-- THAYS FLOR — Migração 3: área de feedbacks/depoimentos
-- Rodar 1x no SQL Editor do Supabase (depois das migrações 1 e 2)
-- ============================================================

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  message text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

-- Qualquer visitante do site (mesmo sem login) pode ver os depoimentos.
create policy "Qualquer pessoa vê os feedbacks"
  on public.feedbacks for select
  using (true);

-- Só admin adiciona (evita spam de qualquer visitante escrevendo direto).
create policy "Só admin adiciona feedback"
  on public.feedbacks for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Só admin remove feedback"
  on public.feedbacks for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
