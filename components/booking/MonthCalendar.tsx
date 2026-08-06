"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

type MonthCalendarProps = {
  /** Datas no formato YYYY-MM-DD que devem aparecer marcadas/disponíveis. */
  markedDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  /**
   * "user": só dias marcados são clicáveis (dias disponíveis pra agendar).
   * "admin": qualquer dia futuro é clicável (pra cadastrar horários);
   *          dias marcados só recebem um indicador visual.
   */
  mode: "user" | "admin";
};

export default function MonthCalendar({
  markedDates,
  selectedDate,
  onSelectDate,
  mode,
}: MonthCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const markedSet = new Set(markedDates);

  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-wine-700 transition-colors hover:bg-wine-100"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-lg text-wine-900">
          {MESES[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-wine-700 transition-colors hover:bg-wine-100"
          aria-label="Próximo mês"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="font-sans text-xs font-semibold text-ink-soft/60">
            {d}
          </span>
        ))}

        {cells.map((date, i) => {
          if (!date) return <span key={i} />;

          const iso = toISODate(date);
          const isPast = date < today;
          const isMarked = markedSet.has(iso);
          const isSelected = selectedDate === iso;
          const isClickable = mode === "user" ? isMarked && !isPast : !isPast;

          return (
            <button
              key={i}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectDate(iso)}
              className={`relative flex h-10 items-center justify-center rounded-xl font-sans text-sm transition-colors ${
                isSelected
                  ? "bg-wine-700 font-semibold text-cream"
                  : isClickable
                  ? "text-ink hover:bg-wine-100"
                  : "text-ink-soft/30"
              }`}
            >
              {date.getDate()}
              {isMarked && !isSelected && (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    isClickable ? "bg-wine-700" : "bg-ink-soft/30"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {mode === "user" && (
        <p className="mt-4 font-sans text-xs text-ink-soft">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-wine-700" />
          Dias com bolinha têm horários disponíveis.
        </p>
      )}
    </div>
  );
}
