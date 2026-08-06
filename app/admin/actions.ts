"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { enviarTemplateWhatsApp } from "@/lib/whatsapp/sendMessage";

function formatarDataPtBr(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

export async function criarFeedback(data: {
  authorName: string;
  message: string;
  avatarUrl: string;
}) {
  const supabase = await createClient();

  const authorName = data.authorName.trim();
  const message = data.message.trim();
  const avatarUrl = data.avatarUrl.trim();

  if (!authorName || !message) {
    return { error: "Preencha o nome e o depoimento." };
  }

  const { error } = await supabase.from("feedbacks").insert({
    author_name: authorName,
    message,
    avatar_url: avatarUrl || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function removerFeedback(feedbackId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("feedbacks").delete().eq("id", feedbackId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function criarHorario(data: { date: string; time: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("availability_slots").insert({
    slot_date: data.date,
    slot_time: data.time,
  });

  if (error) {
    return { error: error.code === "23505" ? "Esse horário já existe." : error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/agendamento");
  return { success: true };
}

export async function removerHorario(slotId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("availability_slots").delete().eq("id", slotId);

  if (error) {
    return { error: "Não foi possível remover: esse horário já tem um pedido vinculado." };
  }

  revalidatePath("/admin");
  revalidatePath("/agendamento");
  return { success: true };
}

export async function aprovarAgendamento(appointmentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", appointmentId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/agendamento");

  // Dispara o WhatsApp sem travar a resposta da aprovação, caso falhe.
  const { data: agendamento } = await supabase
    .from("appointments")
    .select("availability_slots(slot_date, slot_time), profiles(full_name, whatsapp)")
    .eq("id", appointmentId)
    .single();

  if (agendamento) {
    const slot = Array.isArray(agendamento.availability_slots)
      ? agendamento.availability_slots[0]
      : agendamento.availability_slots;
    const prof = Array.isArray(agendamento.profiles)
      ? agendamento.profiles[0]
      : agendamento.profiles;

    if (slot && prof?.whatsapp) {
      await enviarTemplateWhatsApp({
        whatsapp: prof.whatsapp,
        templateName: process.env.WHATSAPP_TEMPLATE_APROVADO || "agendamento_aprovado",
        parametros: [
          prof.full_name?.split(" ")[0] || "Cliente",
          formatarDataPtBr(slot.slot_date),
          slot.slot_time.slice(0, 5),
        ],
      });
    }
  }

  return { success: true };
}

export async function rejeitarAgendamento(appointmentId: string, slotId: string) {
  const supabase = await createClient();

  // Busca os dados ANTES de rejeitar, pra ter nome/whatsapp/horário à mão.
  const { data: agendamento } = await supabase
    .from("appointments")
    .select("availability_slots(slot_date, slot_time), profiles(full_name, whatsapp)")
    .eq("id", appointmentId)
    .single();

  const { error: apError } = await supabase
    .from("appointments")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", appointmentId);

  if (apError) return { error: apError.message };

  // Libera o horário de volta pra outros clientes poderem pedir.
  await supabase.from("availability_slots").update({ is_available: true }).eq("id", slotId);

  revalidatePath("/admin");
  revalidatePath("/agendamento");

  if (agendamento) {
    const slot = Array.isArray(agendamento.availability_slots)
      ? agendamento.availability_slots[0]
      : agendamento.availability_slots;
    const prof = Array.isArray(agendamento.profiles)
      ? agendamento.profiles[0]
      : agendamento.profiles;

    if (slot && prof?.whatsapp) {
      await enviarTemplateWhatsApp({
        whatsapp: prof.whatsapp,
        templateName: process.env.WHATSAPP_TEMPLATE_REJEITADO || "agendamento_rejeitado",
        parametros: [
          prof.full_name?.split(" ")[0] || "Cliente",
          formatarDataPtBr(slot.slot_date),
          slot.slot_time.slice(0, 5),
        ],
      });
    }
  }

  return { success: true };
}
