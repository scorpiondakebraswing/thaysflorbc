import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ProcedureCategory } from "@/lib/procedures";

type ProcedureDetailProps = {
  title: string;
  description: string;
  category: ProcedureCategory;
  benefits?: string[];
  indications?: string[];
  image?: string;
  isNew?: boolean;
};

const CATEGORY_LABEL: Record<ProcedureCategory, string> = {
  facial: "Procedimento Facial",
  corporal: "Procedimento Corporal",
};

export default function ProcedureDetail({
  title,
  description,
  category,
  benefits,
  indications,
  image,
  isNew,
}: ProcedureDetailProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Header />

      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/#procedimentos"
            className="font-sans text-sm text-wine-700 hover:underline"
          >
            ← Voltar aos procedimentos
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              {CATEGORY_LABEL[category]}
            </span>
            {isNew && (
              <span className="rounded-full bg-wine-700 px-3 py-1 font-sans text-xs font-semibold text-cream">
                Novidade
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl leading-tight text-wine-900 sm:text-5xl">
            {title}
          </h1>

          {image && (
            <div className="relative mt-10 h-64 w-full overflow-hidden rounded-[1.75rem] sm:h-96">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}

          <p className="mt-10 font-sans text-[17px] leading-relaxed text-ink-soft">
            {description}
          </p>

          {benefits && benefits.length > 0 && (
            <div className="mt-10 rounded-[1.75rem] border border-stone-200 bg-white/60 p-7 sm:p-8">
              <h2 className="font-display text-xl text-wine-900">Benefícios</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wine-100 text-wine-700">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span className="font-sans text-[15px] text-ink">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {indications && indications.length > 0 && (
            <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-nude/60 p-7 sm:p-8">
              <h2 className="font-display text-xl text-wine-900">
                Indicado para
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {indications.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wine-700" />
                    <span className="font-sans text-[15px] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/agendar"
              className="rounded-full bg-wine-700 px-8 py-4 text-center font-sans text-[15px] font-semibold text-cream transition-colors hover:bg-wine-800"
            >
              Agendar Consulta
            </Link>
            <a
              href="https://wa.me/558888048009"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-wine-700/25 px-8 py-4 text-center font-sans text-[15px] font-semibold text-wine-800 transition-colors hover:bg-wine-100"
            >
              Tirar dúvidas no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
