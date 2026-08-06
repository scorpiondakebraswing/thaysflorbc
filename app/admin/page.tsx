import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import AdminCalendarManager from "./AdminCalendarManager";
import AppointmentsPanel from "./AppointmentsPanel";
import FeedbackManager from "./FeedbackManager";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Segunda camada de proteção (o middleware já cobre isso, mas nunca custa).
  if (profile?.role !== "admin") redirect("/agendamento");

  const { data: freeSlots } = await supabase
    .from("availability_slots")
    .select("id, slot_date, slot_time")
    .eq("is_available", true)
    .gte("slot_date", new Date().toISOString().slice(0, 10))
    .order("slot_date")
    .order("slot_time");

  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select(
      "id, status, slot_id, availability_slots(slot_date, slot_time), profiles(full_name, whatsapp)"
    )
    .order("created_at", { ascending: false });

  const appointments = (rawAppointments || []).map((ag) => {
    const slot = Array.isArray(ag.availability_slots)
      ? ag.availability_slots[0]
      : ag.availability_slots;
    const prof = Array.isArray(ag.profiles) ? ag.profiles[0] : ag.profiles;

    return {
      id: ag.id,
      status: ag.status,
      slot_id: ag.slot_id,
      slot_date: slot?.slot_date ?? "",
      slot_time: slot?.slot_time ?? "",
      full_name: prof?.full_name ?? null,
      whatsapp: prof?.whatsapp ?? null,
    };
  });

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("id, author_name, message, avatar_url")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-cream px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Painel Administrativo
            </p>
            <h1 className="mt-1 font-display text-3xl text-wine-900">Agenda</h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Sair
            </button>
          </form>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl text-wine-900">
            Horários disponíveis para agendamento
          </h2>
          <div className="mt-4">
            <AdminCalendarManager slots={freeSlots || []} />
          </div>
        </section>

        <section className="mt-12">
          <AppointmentsPanel appointments={appointments} />
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-wine-900">Depoimentos</h2>
          <div className="mt-4">
            <FeedbackManager feedbacks={feedbacks || []} />
          </div>
        </section>
      </div>
    </main>
  );
}
