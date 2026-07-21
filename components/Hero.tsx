"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PetalMotif from "./PetalMotif";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.12 },
  }),
};

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-cream pt-28 sm:pt-24"
    >
      {/* Assinatura visual decorativa */}
      <PetalMotif className="pointer-events-none absolute -right-16 top-16 h-[420px] w-[420px] text-wine-700/[0.06] sm:h-[560px] sm:w-[560px]" />
      <PetalMotif className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 text-wine-700/[0.05] rotate-45" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-wine-100 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700"
          >
            Clínica de Estética Avançada
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-display text-[2.6rem] leading-[1.08] text-wine-900 sm:text-6xl lg:text-[4rem]"
          >
            Realce o que já existe
            <br />
            de mais bonito em <span className="text-wine-700">você</span>.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-ink-soft"
          >
            Tratamentos estéticos avançados guiados por técnica apurada e
            olhar humanizado — para resultados naturais que respeitam a sua
            essência.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <Link
              href="/agendamento"
              className="rounded-full bg-wine-700 px-8 py-4 text-center font-sans text-[15px] font-semibold text-cream shadow-md transition-all hover:bg-wine-800 hover:shadow-lg active:scale-[0.98]"
            >
              Agendar Consulta
            </Link>
            <a
              href="#procedimentos"
              className="rounded-full border border-wine-700/25 px-8 py-4 text-center font-sans text-[15px] font-semibold text-wine-800 transition-colors hover:bg-wine-100 active:scale-[0.98]"
            >
              Conhecer Procedimentos
            </a>
          </motion.div>
        </div>

        {/* Cartão de destaque lateral */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="relative hidden aspect-[4/5] w-full max-w-md justify-self-center rounded-[2rem] bg-gradient-to-br from-wine-700 to-wine-900 p-8 shadow-xl lg:flex lg:flex-col lg:justify-end"
        >
          <PetalMotif className="absolute right-6 top-6 h-16 w-16 text-cream/25" />
          <p className="font-display text-2xl italic leading-snug text-cream">
            &ldquo;Beleza que se constrói com cuidado, técnica e escuta.&rdquo;
          </p>
          <span className="mt-4 font-sans text-sm font-medium tracking-wide text-cream/70">
            — Equipe Thays Flor
          </span>
        </motion.div>
      </div>
    </section>
  );
}
