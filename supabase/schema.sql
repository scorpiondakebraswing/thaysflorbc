-- ============================================================
-- THAYS FLOR — Schema do banco (rodar 1x no SQL Editor do Supabase)
-- ============================================================

-- 1. PROFILES ---------------------------------------------------
-- Estende auth.users com dados próprios do negócio (whatsapp, role).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  whatsapp text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin vê todos os perfis"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Cria o profile automaticamente quando alguém se cadastra.
-- whatsapp e full_name vêm do "options.data" passado no signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'whatsapp'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. AVAILABILITY_SLOTS ------------------------------------------
-- Horários específicos que o admin libera pra agendamento.
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

alter table public.availability_slots enable row level security;

create policy "Qualquer pessoa logada vê os horários"
  on public.availability_slots for select
  to authenticated
  using (true);

create policy "Só admin cria horários"
  on public.availability_slots for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Só admin apaga horários"
  on public.availability_slots for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Só admin atualiza horários"
  on public.availability_slots for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 3. APPOINTMENTS --------------------------------------------------
-- Pedidos de agendamento feitos pelos usuários.
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references public.availability_slots (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

create policy "Usuário vê os próprios agendamentos"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Usuário cria pedido de agendamento"
  on public.appointments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Admin vê todos os agendamentos"
  on public.appointments for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin aprova/rejeita agendamentos"
  on public.appointments for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- PASSO MANUAL: depois de criar sua conta pelo site normalmente,
-- rode este comando (trocando o email) pra virar admin:
--
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'seu-email@exemplo.com'
-- );
-- ============================================================
