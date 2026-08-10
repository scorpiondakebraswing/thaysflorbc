"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Selo flutuante que aparece na Homepage e leva para o TF Beauty Club.
 * A estrela pulsa suavemente e emite um brilho para atrair o olhar,
 * sem chegar a ser intrusivo.
 */
export default function ClubBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
      className="fixed bottom-5 right-5 z-40 sm:bottom-8 sm:right-8"
    >
      <Link
        href="/club"
        aria-label="Conhecer o TF Beauty Club"
        className="group relative flex items-center gap-3 rounded-full bg-wine-900 py-3 pl-3 pr-5 shadow-xl transition-transform hover:scale-105"
      >
        {/* Halo pulsante atrás da estrela */}
        <span className="pointer-events-none absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 animate-ping rounded-full bg-cream/25" />

        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-cream"
            animate={{ scale: [1, 1.18, 1], rotate: [0, 8, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          >
            <path d="M12 1.8l2.62 6.06 6.58.54-4.99 4.32 1.5 6.43L12 15.77l-5.71 3.38 1.5-6.43-4.99-4.32 6.58-.54L12 1.8z" />
          </motion.svg>
        </span>

        <span className="flex flex-col leading-tight">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cream/60">
            Conheça o
          </span>
          <span className="font-display text-sm text-cream">
            TF Beauty Club
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
