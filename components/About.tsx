"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

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
              src="https://conexaojunina.com.br/wp-content/uploads/2026/08/thays1.png"
              alt="Thays Flor, fisioterapeuta e especialista em cuidados estéticos"
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
            Ciência, sensibilidade e um olhar atento para cada detalhe
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={2}
            className="mt-6 font-sans text-[17px] leading-relaxed text-ink-soft"
          >
            Por trás da TF Beauty Clinic está Thays Flor, fisioterapeuta e
            especialista em cuidados estéticos, apaixonada por transformar
            conhecimento e técnica em experiências de cuidado que fazem
            sentido para cada pessoa.
          </motion.p>

          <motion.blockquote
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={3}
            className="mt-8 border-l-2 border-wine-700 pl-6"
          >
            <p className="font-display text-xl italic leading-relaxed text-wine-900 sm:text-[1.4rem]">
              &ldquo;Acredito que estética vai muito além de aparência. É sobre
              se olhar com mais carinho, sentir-se bem consigo mesma e valorizar
              aquilo que já existe em você.&rdquo;
            </p>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-soft">
              Por isso, cada atendimento começa com escuta, avaliação e
              compreensão das suas necessidades, para que o tratamento seja
              pensado de forma individualizada.
            </p>
            <footer className="mt-4 font-sans text-sm font-semibold tracking-wide text-wine-700">
              Thays Flor
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}