"use client";

import { useMemo, useState, useTransition } from "react";
import MonthCalendar from "@/components/booking/MonthCalendar";
import { solicitarAgendamento } from "./actions";

type Slot = {
  id: string;
  slot_date: string; // YYYY-MM-DD
  slot_time: string; // HH:MM:SS
};

type BookingCalendarProps = {
  availableSlots: Slot[];
};

function formatarHora(hora: string) {
  return hora.slice(0, 5);
}

function formatarDataLonga(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export default function BookingCalendar({ availableSlots }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "erro" | "sucesso"; texto: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const markedDates = useMemo(
    () => Array.from(new Set(availableSlots.map((s) => s.slot_date))),
    [availableSlots]
  );

  const horariosDoDia = useMemo(
    () =>
      availableSlots
        .filter((s) => s.slot_date === selectedDate)
        .sort((a, b) => a.slot_time.localeCompare(b.slot_time)),
    [availableSlots, selectedDate]
  );

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setFeedback(null);
  }

  function handleConfirmar() {
    if (!selectedSlotId) return;
    setFeedback(null);

    startTransition(async () => {
      const result = await solicitarAgendamento(selectedSlotId);
      if (result.error) {
        setFeedback({ type: "erro", texto: result.error });
      } else {
        setFeedback({
          type: "sucesso",
          texto: "Pedido enviado! Você será avisada assim que for aprovado.",
        });
        setSelectedDate(null);
        setSelectedSlotId(null);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <MonthCalendar
        mode="user"
        markedDates={markedDates}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <div className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-6">
        {!selectedDate && (
          <p className="font-sans text-[15px] text-ink-soft">
            Selecione, no calendário ao lado, um dia com horários disponíveis.
          </p>
        )}

        {selectedDate && (
          <>
            <h3 className="font-display text-xl capitalize text-wine-900">
              {formatarDataLonga(selectedDate)}
            </h3>

            {horariosDoDia.length === 0 ? (
              <p className="mt-3 font-sans text-[15px] text-ink-soft">
                Não há mais horários livres nesse dia.
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {horariosDoDia.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`rounded-full border px-5 py-2.5 font-sans text-sm font-medium transition-colors ${
                      selectedSlotId === slot.id
                        ? "border-wine-700 bg-wine-700 text-cream"
                        : "border-stone-200 text-ink hover:border-wine-700"
                    }`}
                  >
                    {formatarHora(slot.slot_time)}
                  </button>
                ))}
              </div>
            )}

            {selectedSlotId && (
              <button
                type="button"
                onClick={handleConfirmar}
                disabled={isPending}
                className="mt-6 w-full rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[15px] font-semibold text-cream transition-colors hover:bg-wine-800 disabled:opacity-60"
              >
                {isPending ? "Enviando..." : "Confirmar solicitação"}
              </button>
            )}
          </>
        )}

        {feedback && (
          <p
            className={`mt-5 rounded-xl px-4 py-3 font-sans text-sm ${
              feedback.type === "erro"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {feedback.texto}
          </p>
        )}
      </div>
    </div>
  );
}
