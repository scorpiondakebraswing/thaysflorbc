"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.1 },
  }),
};

const HIGHLIGHTS = [
  "Técnica atualizada e protocolos seguros",
  "Atendimento individualizado, do diagnóstico ao pós",
  "Resultados naturais e harmônicos",
];

export default function About() {
  return (
    <section
      id="sobre"
      className="bg-nude px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] border border-wine-700/20" />
          <div className="overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="https://conexaojunina.com.br/wp-content/uploads/2026/07/Picsart_26-07-21_10-38-03-555.png"
              alt="Especialista responsável pela clínica Thays Flor"
              width={640}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Texto */}
        <div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={0}
            className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700"
          >
            Quem Cuida de Você
          </motion.p>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={1}
            className="font-display text-3xl leading-tight text-wine-900 sm:text-4xl"
          >
            Técnica apurada, cuidado genuinamente humano
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={2}
            className="mt-6 font-sans text-[17px] leading-relaxed text-ink-soft"
          >
            Por trás da Thays Flor está uma especialista dedicada a unir
            ciência e sensibilidade em cada atendimento. Cada plano de
            tratamento nasce de uma escuta atenta às necessidades e desejos
            de quem chega até a clínica — para que o resultado seja, acima
            de tudo, autêntico.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={3}
            className="mt-8 flex flex-col gap-3"
          >
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-wine-700" />
                <span className="font-sans text-[15px] text-ink">{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
