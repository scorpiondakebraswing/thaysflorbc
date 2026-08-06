import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import BookingCalendar from "./BookingCalendar";
import MyAppointmentsList from "./MyAppointmentsList";

export default async function AgendamentoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: availableSlots } = await supabase
    .from("availability_slots")
    .select("id, slot_date, slot_time")
    .eq("is_available", true)
    .gte("slot_date", new Date().toISOString().slice(0, 10))
    .order("slot_date")
    .order("slot_time");

  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select("id, status, slot_id, availability_slots(slot_date, slot_time)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const myAppointments = (rawAppointments || []).map((ag) => {
    const slot = Array.isArray(ag.availability_slots)
      ? ag.availability_slots[0]
      : ag.availability_slots;
    return {
      id: ag.id,
      status: ag.status,
      slot_date: slot?.slot_date ?? "",
      slot_time: slot?.slot_time ?? "",
    };
  });

  return (
    <main className="min-h-screen bg-cream px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Área do Cliente
            </p>
            <h1 className="mt-1 font-display text-3xl text-wine-900">
              Olá, {profile?.full_name?.split(" ")[0] || "bem-vinda"}
            </h1>
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
          <h2 className="font-display text-xl text-wine-900">Agendar novo horário</h2>
          <div className="mt-4">
            <BookingCalendar availableSlots={availableSlots || []} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-wine-900">Meus agendamentos</h2>
          <MyAppointmentsList appointments={myAppointments} />
        </section>
      </div>
    </main>
  );
}
