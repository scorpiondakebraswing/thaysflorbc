"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  getProceduresByCategory,
  type Procedure,
  type ProcedureCategory,
} from "@/lib/procedures";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function ProcedureCard({ procedure }: { procedure: Procedure }) {
  const { slug, title, description, image, isNew } = procedure;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 p-8 transition-shadow hover:shadow-lg"
    >
      {isNew && (
        <span className="absolute right-6 top-6 z-10 rounded-full bg-wine-700 px-3 py-1 font-sans text-xs font-semibold text-cream">
          Novidade
        </span>
      )}

      {image ? (
        <div className="relative -mx-8 -mt-8 mb-6 h-56 w-[calc(100%+4rem)] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-100 text-wine-700 transition-colors group-hover:bg-wine-700 group-hover:text-cream">
          <Sparkles size={22} strokeWidth={1.75} />
        </div>
      )}

      <h3 className="mt-6 font-display text-xl text-wine-900">{title}</h3>
      <p className="mt-2.5 flex-1 font-sans text-[15px] leading-relaxed text-ink-soft">
        {description}
      </p>
      <Link
        href={`/procedimentos/${slug}`}
        className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-wine-700 transition-colors hover:text-wine-800"
      >
        Saiba mais
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

function CategoryBlock({
  label,
  category,
}: {
  label: string;
  category: ProcedureCategory;
}) {
  const items = getProceduresByCategory(category);

  return (
    <div className="mt-16">
      <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
        {label}
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((procedure) => (
          <ProcedureCard key={procedure.slug} procedure={procedure} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Procedures() {
  return (
    <section id="procedimentos" className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
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

        <CategoryBlock label="Faciais" category="facial" />
        <CategoryBlock label="Corporais" category="corporal" />

        <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-[1.75rem] bg-wine-700 p-8 text-cream sm:flex-row sm:p-10">
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
