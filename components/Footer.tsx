import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="bg-wine-900 px-5 pb-8 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 border-b border-cream/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Logo + descrição */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="https://conexaojunina.com.br/wp-content/uploads/2026/07/LOGO-THAYS-FLOR-VINHO-3.png"
            alt="Thays Flor — Clínica de Estética"
            width={140}
            height={52}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cream/65">
            Estética avançada com técnica, ética e cuidado humanizado em
            cada detalhe.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-cream/50">
            Navegação
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {[
              { label: "Início", href: "#inicio" },
              { label: "Sobre", href: "#sobre" },
              { label: "Procedimentos", href: "#procedimentos" },
              { label: "Entrar", href: "/login" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-cream/75 transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-cream/50">
            Contato
          </h4>
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-start gap-2.5 font-sans text-sm text-cream/75">
              <MapPin size={17} className="mt-0.5 shrink-0" />
              Rua Exemplo, 123 — Centro, Sua Cidade/UF
            </li>
            <li>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-sans text-sm text-cream/75 transition-colors hover:text-cream"
              >
                <MessageCircle size={17} />
                (00) 00000-0000
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-cream/50">
            Redes Sociais
          </h4>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com/thaysflor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Thays Flor"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Thays Flor"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-7xl text-center font-sans text-xs text-cream/40 sm:text-left">
        © {new Date().getFullYear()} Thays Flor. Todos os direitos
        reservados.
      </p>
    </footer>
  );
}
