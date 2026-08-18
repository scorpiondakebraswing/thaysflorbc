-- ============================================================
-- THAYS FLOR / Migração 6
-- Competência mensal e classificação de gastos
-- Rodar 1x no SQL Editor (depois da 04 e da correção 05)
-- ============================================================

-- 1. COMPETÊNCIA -----------------------------------------------
-- Mês de referência do lançamento, no formato YYYY-MM.
-- Fica separado da data real porque um gasto pago no dia 02/03 pode
-- pertencer ao fechamento de fevereiro, por exemplo.
alter table public.transactions
  add column if not exists competence text;

-- Preenche os lançamentos já existentes usando o mês da data.
update public.transactions
  set competence = to_char(occurred_on, 'YYYY-MM')
  where competence is null;

alter table public.transactions
  alter column competence set not null,
  alter column competence set default to_char(current_date, 'YYYY-MM');

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'transactions_competence_format'
  ) then
    alter table public.transactions
      add constraint transactions_competence_format
      check (competence ~ '^\d{4}-(0[1-9]|1[0-2])$');
  end if;
end $$;

create index if not exists transactions_competence_idx
  on public.transactions (competence desc);

-- 2. CLASSIFICAÇÃO ---------------------------------------------
-- Aplica-se às saídas: necessario, util ou futil.
-- Entradas ficam com valor nulo.
alter table public.transactions
  add column if not exists classification text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'transactions_classification_valid'
  ) then
    alter table public.transactions
      add constraint transactions_classification_valid
      check (classification is null or classification in ('necessario', 'util', 'futil'));
  end if;
end $$;

-- Saídas antigas ficam como "necessario" para não distorcer os gráficos.
-- Você pode reclassificar cada uma depois, pelo painel.
update public.transactions
  set classification = 'necessario'
  where kind = 'expense' and classification is null;

-- 3. CONFERÊNCIA ------------------------------------------------
select competence, kind, classification, count(*) as qtd, sum(amount) as total
from public.transactions
group by competence, kind, classification
order by competence desc;
