"use client";

import { motion } from "framer-motion";
import { Sparkles, Syringe, Droplets, Gem, Waves } from "lucide-react";
import Link from "next/link";

type Procedure = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
};

const PROCEDURES: Procedure[] = [
  {
    icon: Sparkles,
    title: "Harmonização Facial",
    description:
      "Equilíbrio entre as proporções do rosto, valorizando traços naturais com técnica refinada.",
    href: "/procedimentos/harmonizacao-facial",
  },
  {
    icon: Syringe,
    title: "Botox",
    description:
      "Suavização de linhas de expressão com resultado natural e efeito rejuvenescedor.",
    href: "/procedimentos/botox",
  },
  {
    icon: Waves,
    title: "Lavieen",
    description:
      "Tecnologia para uniformizar a textura e o viço da pele, com toque macio e sedoso.",
    href: "/procedimentos/lavieen",
  },
  {
    icon: Droplets,
    title: "Preenchimento",
    description:
      "Devolve volume e contorno em regiões específicas, respeitando a harmonia facial.",
    href: "/procedimentos/preenchimento",
  },
  {
    icon: Gem,
    title: "Bioestimuladores",
    description:
      "Estímulo de colágeno para firmeza e qualidade de pele a médio e longo prazo.",
    href: "/procedimentos/bioestimuladores",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Procedures() {
  return (
    <section
      id="procedimentos"
      className="bg-cream px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700"
          >
            Procedimentos em Destaque
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROCEDURES.map(({ icon: Icon, title, description, href }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group flex flex-col rounded-[1.75rem] border border-stone-200 bg-stone-100 p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-100 text-wine-700 transition-colors group-hover:bg-wine-700 group-hover:text-cream">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 font-display text-xl text-wine-900">
                {title}
              </h3>
              <p className="mt-2.5 flex-1 font-sans text-[15px] leading-relaxed text-ink-soft">
                {description}
              </p>
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-wine-700 transition-colors hover:text-wine-800"
              >
                Saiba mais
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          ))}

          {/* Card de CTA final, fecha o grid de forma intencional */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col justify-center rounded-[1.75rem] bg-wine-700 p-8 text-cream"
          >
            <h3 className="font-display text-xl">
              Não encontrou o que procura?
            </h3>
            <p className="mt-2.5 font-sans text-[15px] leading-relaxed text-cream/85">
              Fale com a equipe e monte um plano de cuidado sob medida para
              você.
            </p>
            <Link
              href="/agendamento"
              className="mt-6 inline-flex w-fit items-center rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-wine-800 transition-transform hover:scale-[1.03]"
            >
              Agendar Consulta
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
