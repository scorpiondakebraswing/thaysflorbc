"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function solicitarAgendamento(slotId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  // Trava o horário na hora (evita 2 pessoas pedindo o mesmo slot).
  const { error: slotError } = await supabase
    .from("availability_slots")
    .update({ is_available: false })
    .eq("id", slotId)
    .eq("is_available", true); // só atualiza se ainda estiver livre

  if (slotError) {
    return { error: "Não foi possível reservar esse horário. Tente outro." };
  }

  const { error: appointmentError } = await supabase.from("appointments").insert({
    slot_id: slotId,
    user_id: user.id,
    status: "pending",
  });

  if (appointmentError) {
    // Libera o slot de volta já que o pedido falhou.
    await supabase
      .from("availability_slots")
      .update({ is_available: true })
      .eq("id", slotId);
    return { error: "Esse horário acabou de ser reservado por outra pessoa." };
  }

  revalidatePath("/agendamento");
  return { success: true };
}

export async function cancelarAgendamento(appointmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { error } = await supabase.rpc("cancel_appointment", {
    p_appointment_id: appointmentId,
  });

  if (error) {
    return { error: error.message || "Não foi possível cancelar esse agendamento." };
  }

  revalidatePath("/agendamento");
  return { success: true };
}
