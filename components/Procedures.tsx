"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import {
  getProceduresByCategory,
  type ProcedureCategory,
} from "@/lib/procedures";

const CATEGORIES: { key: ProcedureCategory; label: string; note: string }[] = [
  {
    key: "facial",
    label: "Faciais",
    note: "Cuidados para saúde, textura e luminosidade da pele",
  },
  {
    key: "corporal",
    label: "Corporais",
    note: "Contorno, bem-estar e qualidade da pele do corpo",
  },
];

function AccordionGroup({
  category,
  label,
  note,
  isOpen,
  onToggle,
}: {
  category: ProcedureCategory;
  label: string;
  note: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const items = getProceduresByCategory(category);

  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-6 py-7 text-left"
      >
        <div>
          <h3 className="font-display text-2xl text-wine-900 sm:text-3xl">
            {label}
          </h3>
          <p className="mt-1.5 font-sans text-sm text-ink-soft">{note}</p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "rotate-45 border-wine-700 bg-wine-700 text-cream"
              : "border-wine-700/25 text-wine-700 group-hover:border-wine-700"
          }`}
        >
          <Plus size={20} strokeWidth={1.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="grid gap-x-10 pb-8 sm:grid-cols-2">
              {items.map((procedure) => (
                <li key={procedure.slug}>
                  <Link
                    href={`/procedimentos/${procedure.slug}`}
                    className="group/item flex items-center justify-between gap-4 border-b border-stone-200/70 py-4 transition-colors hover:border-wine-700/40"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-sans text-[15px] text-ink transition-colors group-hover/item:text-wine-700">
                        {procedure.title}
                      </span>
                      {procedure.isNew && (
                        <span className="rounded-full bg-wine-100 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-wine-700">
                          Novo
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-sans text-wine-700 opacity-0 transition-all group-hover/item:translate-x-1 group-hover/item:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Procedures() {
  const [openCategory, setOpenCategory] = useState<ProcedureCategory | null>(
    "facial"
  );

  return (
    <section id="procedimentos" className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700"
          >
            Procedimentos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-display text-3xl leading-tight text-wine-900 sm:text-4xl"
          >
            Tratamentos pensados para cada objetivo
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-14 border-t border-stone-200"
        >
          {CATEGORIES.map(({ key, label, note }) => (
            <AccordionGroup
              key={key}
              category={key}
              label={label}
              note={note}
              isOpen={openCategory === key}
              onToggle={() =>
                setOpenCategory((current) => (current === key ? null : key))
              }
            />
          ))}
        </motion.div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-[1.75rem] bg-wine-700 p-8 text-cream sm:flex-row sm:p-10">
          <div>
            <h3 className="font-display text-xl">
              Não encontrou o que procura?
            </h3>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-cream/85">
              Fale com a equipe e monte um plano de cuidado sob medida para você.
            </p>
          </div>
          <Link
            href="/agendar"
            className="shrink-0 rounded-full bg-cream px-7 py-3.5 font-sans text-sm font-semibold text-wine-800 transition-transform hover:scale-[1.03]"
          >
            Agendar Consulta
          </Link>
        </div>
      </div>
    </section>
  );
}
