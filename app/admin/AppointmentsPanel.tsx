"use client";

import { useTransition } from "react";
import { aprovarAgendamento, rejeitarAgendamento } from "./actions";

type Appointment = {
  id: string;
  status: string;
  slot_id: string;
  slot_date: string;
  slot_time: string;
  full_name: string | null;
  whatsapp: string | null;
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Aguardando aprovação", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Confirmado", className: "bg-green-50 text-green-700" },
  rejected: { label: "Não aprovado", className: "bg-red-50 text-red-700" },
  cancelled: { label: "Cancelado", className: "bg-stone-100 text-ink-soft" },
};

function formatarData(iso: string) {
  return new Date(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10))
  ).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

export default function AppointmentsPanel({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [isPending, startTransition] = useTransition();

  const pendentes = appointments.filter((a) => a.status === "pending");
  const outros = appointments.filter((a) => a.status !== "pending");

  function handleAprovar(id: string) {
    startTransition(() => aprovarAgendamento(id));
  }

  function handleRejeitar(id: string, slotId: string) {
    startTransition(() => rejeitarAgendamento(id, slotId));
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3 className="font-display text-lg text-wine-900">
          Pendentes de aprovação {pendentes.length > 0 && `(${pendentes.length})`}
        </h3>

        {pendentes.length === 0 ? (
          <p className="mt-3 font-sans text-[15px] text-ink-soft">
            Nenhum pedido aguardando aprovação no momento.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {pendentes.map((ag) => (
              <div
                key={ag.id}
                className="flex flex-col gap-3 rounded-2xl border border-wine-700/20 bg-wine-100/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-sans text-[15px] font-semibold text-ink">
                    {ag.full_name || "Cliente"}
                  </p>
                  <p className="font-sans text-sm text-ink-soft">
                    {formatarData(ag.slot_date)} às {ag.slot_time.slice(0, 5)} ·{" "}
                    {ag.whatsapp || "sem whatsapp"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleAprovar(ag.id)}
                    className="rounded-full bg-wine-700 px-5 py-2 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRejeitar(ag.id, ag.slot_id)}
                    className="rounded-full border border-stone-200 px-5 py-2 font-sans text-sm font-medium text-ink-soft hover:bg-stone-100 disabled:opacity-60"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg text-wine-900">Todos os agendamentos</h3>

        {outros.length === 0 ? (
          <p className="mt-3 font-sans text-[15px] text-ink-soft">
            Ainda não há histórico de agendamentos.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {outros.map((ag) => {
              const status = STATUS_LABEL[ag.status] ?? STATUS_LABEL.pending;
              return (
                <div
                  key={ag.id}
                  className="flex items-center justify-between rounded-xl border border-stone-200 px-5 py-3"
                >
                  <span className="font-sans text-sm text-ink">
                    {ag.full_name || "Cliente"} · {formatarData(ag.slot_date)} às{" "}
                    {ag.slot_time.slice(0, 5)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
