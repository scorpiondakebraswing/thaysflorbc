"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Procedimentos", href: "#procedimentos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-stone-200)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2 shrink-0">
          <Image
            src="https://conexaojunina.com.br/wp-content/uploads/2026/07/LOGO-THAYS-FLOR-VINHO-3.png"
            alt="Thays Flor — Clínica de Estética"
            width={150}
            height={56}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[15px] font-medium text-ink-soft transition-colors hover:text-wine-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/login"
            className="rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream shadow-sm transition-all hover:bg-wine-800 hover:shadow-md"
          >
            Entrar
          </Link>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full text-wine-800 md:hidden"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-cream md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3.5 font-sans text-base font-medium text-ink-soft transition-colors hover:bg-nude hover:text-wine-700"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-wine-700 px-6 py-3.5 text-center font-sans text-base font-semibold text-cream"
              >
                Entrar
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
