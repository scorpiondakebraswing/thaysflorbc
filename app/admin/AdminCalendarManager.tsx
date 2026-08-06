"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import MonthCalendar from "@/components/booking/MonthCalendar";
import { criarHorario, removerHorario } from "./actions";

type Slot = {
  id: string;
  slot_date: string;
  slot_time: string;
};

export default function AdminCalendarManager({ slots }: { slots: Slot[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [novoHorario, setNovoHorario] = useState("09:00");
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const markedDates = useMemo(
    () => Array.from(new Set(slots.map((s) => s.slot_date))),
    [slots]
  );

  const horariosDoDia = useMemo(
    () =>
      slots
        .filter((s) => s.slot_date === selectedDate)
        .sort((a, b) => a.slot_time.localeCompare(b.slot_time)),
    [slots, selectedDate]
  );

  function handleAdicionar() {
    if (!selectedDate) return;
    setErro(null);

    startTransition(async () => {
      const result = await criarHorario({ date: selectedDate, time: novoHorario });
      if (result.error) setErro(result.error);
    });
  }

  function handleRemover(slotId: string) {
    setErro(null);
    startTransition(async () => {
      const result = await removerHorario(slotId);
      if (result.error) setErro(result.error);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <MonthCalendar
        mode="admin"
        markedDates={markedDates}
        selectedDate={selectedDate}
        onSelectDate={(d) => {
          setSelectedDate(d);
          setErro(null);
        }}
      />

      <div className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-6">
        {!selectedDate ? (
          <p className="font-sans text-[15px] text-ink-soft">
            Selecione um dia no calendário pra adicionar ou remover horários.
          </p>
        ) : (
          <>
            <h3 className="font-display text-xl text-wine-900">
              {new Date(
                Number(selectedDate.slice(0, 4)),
                Number(selectedDate.slice(5, 7)) - 1,
                Number(selectedDate.slice(8, 10))
              ).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
            </h3>

            <div className="mt-4 flex items-center gap-2.5">
              <input
                type="time"
                value={novoHorario}
                onChange={(e) => setNovoHorario(e.target.value)}
                className="rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
              <button
                type="button"
                onClick={handleAdicionar}
                disabled={isPending}
                className="rounded-full bg-wine-700 px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
              >
                Adicionar horário
              </button>
            </div>

            {erro && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 font-sans text-sm text-red-700">
                {erro}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {horariosDoDia.length === 0 && (
                <p className="font-sans text-sm text-ink-soft">
                  Nenhum horário cadastrado nesse dia ainda.
                </p>
              )}
              {horariosDoDia.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-2.5"
                >
                  <span className="font-sans text-sm text-ink">
                    {slot.slot_time.slice(0, 5)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemover(slot.id)}
                    disabled={isPending}
                    className="text-ink-soft/60 transition-colors hover:text-red-600"
                    aria-label="Remover horário"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
