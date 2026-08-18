-- ============================================================
-- THAYS FLOR / Migração 4
-- Login por usuário, controle de acesso e módulo financeiro
-- Rodar 1x no SQL Editor do Supabase (depois das migrações 1, 2 e 3)
-- ============================================================

-- 1. PROFILES: adiciona username e controle de ativação -------
alter table public.profiles
  add column if not exists username text unique,
  add column if not exists is_active boolean not null default true;

-- whatsapp deixa de ser obrigatório (admins são criados sem esse dado)
alter table public.profiles alter column whatsapp drop not null;

-- O trigger passa a gravar também o username enviado no cadastro
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, username, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'whatsapp',
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  );
  return new;
end;
$$;

-- Admin precisa poder editar qualquer perfil (ativar/desativar)
drop policy if exists "Admin atualiza perfis" on public.profiles;
create policy "Admin atualiza perfis"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Função auxiliar: confirma se quem está logado é admin ativo
create or replace function public.is_active_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
  );
$$;

grant execute on function public.is_active_admin() to authenticated;

-- 2. CONFIGURAÇÃO INICIAL DAS FINANÇAS ------------------------
-- Guarda a data e o saldo do ponto de partida. Linha única.
create table if not exists public.finance_settings (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  initial_balance numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

alter table public.finance_settings enable row level security;

create policy "Admin lê configuração financeira"
  on public.finance_settings for select
  to authenticated
  using (public.is_active_admin());

create policy "Admin grava configuração financeira"
  on public.finance_settings for insert
  to authenticated
  with check (public.is_active_admin());

create policy "Admin atualiza configuração financeira"
  on public.finance_settings for update
  to authenticated
  using (public.is_active_admin());

-- 3. LANÇAMENTOS FINANCEIROS ----------------------------------
-- scope: onde o dinheiro circula
--   professional = consultório | personal = dia a dia | investment = cursos, equipamentos
-- kind: income (entrada) | expense (saída)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('professional', 'personal', 'investment')),
  kind text not null check (kind in ('income', 'expense')),
  description text not null,
  amount numeric(14, 2) not null check (amount > 0),
  occurred_on date not null default current_date,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index if not exists transactions_occurred_on_idx
  on public.transactions (occurred_on desc);

alter table public.transactions enable row level security;

create policy "Admin lê lançamentos"
  on public.transactions for select
  to authenticated
  using (public.is_active_admin());

create policy "Admin cria lançamentos"
  on public.transactions for insert
  to authenticated
  with check (public.is_active_admin());

create policy "Admin remove lançamentos"
  on public.transactions for delete
  to authenticated
  using (public.is_active_admin());

create policy "Admin atualiza lançamentos"
  on public.transactions for update
  to authenticated
  using (public.is_active_admin());

-- ============================================================
-- PASSO MANUAL OBRIGATÓRIO
-- Defina o username do seu usuário já existente (troque o email):
--
-- update public.profiles
--   set username = 'thays', role = 'admin', is_active = true
--   where id = (select id from auth.users where email = 'seu-email@exemplo.com');
--
-- ATENÇÃO: o login por usuário funciona associando cada username a um
-- email interno no padrão  username@tfbeauty.local . Para o seu usuário
-- antigo (criado com email real) continuar entrando, rode também:
--
-- update auth.users
--   set email = 'thays@tfbeauty.local'
--   where email = 'seu-email@exemplo.com';
--
-- Se preferir não mexer no usuário antigo, crie um novo pelo painel
-- de usuários (/admin/usuarios) depois de subir o código.
-- ============================================================
