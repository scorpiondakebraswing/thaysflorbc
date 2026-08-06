-- ============================================================
-- THAYS FLOR — Migração 2: cancelamento pelo cliente
-- Rodar 1x no SQL Editor do Supabase (depois do schema.sql original)
-- ============================================================

-- Função que cancela um agendamento com segurança:
-- só o próprio dono pode cancelar, só se ainda estiver pendente/aprovado,
-- e libera automaticamente o horário pra outros clientes.
create or replace function public.cancel_appointment(p_appointment_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid;
  v_slot_id uuid;
  v_status text;
begin
  select user_id, slot_id, status
    into v_user_id, v_slot_id, v_status
  from public.appointments
  where id = p_appointment_id;

  if v_user_id is null then
    raise exception 'Agendamento não encontrado.';
  end if;

  if v_user_id <> auth.uid() then
    raise exception 'Você não tem permissão para cancelar esse agendamento.';
  end if;

  if v_status not in ('pending', 'approved') then
    raise exception 'Esse agendamento não pode mais ser cancelado.';
  end if;

  update public.appointments
    set status = 'cancelled', updated_at = now()
    where id = p_appointment_id;

  update public.availability_slots
    set is_available = true
    where id = v_slot_id;
end;
$$;

grant execute on function public.cancel_appointment(uuid) to authenticated;
