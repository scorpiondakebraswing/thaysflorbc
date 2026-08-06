"use client";

import { useTransition } from "react";
import { cancelarAgendamento } from "./actions";

type Appointment = {
  id: string;
  status: string;
  slot_date: string;
  slot_time: string;
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

export default function MyAppointmentsList({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleCancelar(id: string) {
    if (!confirm("Tem certeza que quer cancelar esse agendamento?")) return;
    startTransition(() => cancelarAgendamento(id));
  }

  if (appointments.length === 0) {
    return (
      <p className="mt-4 font-sans text-[15px] text-ink-soft">
        Você ainda não tem nenhum pedido de agendamento.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {appointments.map((ag) => {
        const status = STATUS_LABEL[ag.status] ?? STATUS_LABEL.pending;
        const podeCancelar = ag.status === "pending" || ag.status === "approved";

        return (
          <div
            key={ag.id}
            className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-sans text-[15px] capitalize text-ink">
              {formatarData(ag.slot_date)} às {ag.slot_time.slice(0, 5)}
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
              {podeCancelar && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleCancelar(ag.id)}
                  className="font-sans text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
