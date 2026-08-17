"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AvatarSilhouette from "./AvatarSilhouette";
import { TESTIMONIALS } from "@/lib/testimonials";

const INTERVALO_MS = 7000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);

  const avancar = useCallback(() => {
    setIndex((atual) => (atual + 1) % TESTIMONIALS.length);
  }, []);

  const voltar = useCallback(() => {
    setIndex((atual) => (atual - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Rotação automática, pausada quando o mouse está sobre o depoimento.
  useEffect(() => {
    if (pausado) return;
    const timer = setInterval(avancar, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [avancar, pausado]);

  const atual = TESTIMONIALS[index];

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="depoimentos" className="bg-nude px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
            Depoimentos
          </p>
          <h2 className="font-display text-3xl leading-tight text-wine-900 sm:text-4xl">
            Quem já viveu a experiência
          </h2>
        </div>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          {/* Altura mínima evita o layout "pular" entre textos de tamanhos diferentes */}
          <div className="flex min-h-[320px] items-center sm:min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full text-center"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-5xl leading-none text-wine-700/25"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-2 font-sans text-[17px] leading-relaxed text-ink-soft sm:text-lg">
                  {atual.quote}
                </blockquote>

                <figcaption className="mt-8 flex flex-col items-center gap-3">
                  {atual.avatar ? (
                    <Image
                      src={atual.avatar}
                      alt={atual.author}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <AvatarSilhouette size={56} />
                  )}
                  <span className="font-sans text-sm font-semibold text-wine-800">
                    {atual.author}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controles */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={voltar}
              aria-label="Depoimento anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-wine-700/25 text-wine-700 transition-colors hover:bg-wine-100"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para o depoimento ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-wine-700"
                      : "w-1.5 bg-wine-700/25 hover:bg-wine-700/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={avancar}
              aria-label="Próximo depoimento"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-wine-700/25 text-wine-700 transition-colors hover:bg-wine-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
