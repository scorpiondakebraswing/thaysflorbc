import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Gift } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TF Beauty Club | Thays Flor",
  description:
    "Programa de cuidado contínuo para pele e corpo, com atendimentos mensais garantidos, condições exclusivas e acompanhamento profissional.",
};

const WHATSAPP_GLOW =
  "https://wa.me/558888048009?text=" +
  encodeURIComponent(
    "Olá! Tenho interesse no Plano Glow do TF Beauty Club."
  );

const WHATSAPP_SCULPT =
  "https://wa.me/558888048009?text=" +
  encodeURIComponent(
    "Olá! Tenho interesse no Plano Sculpt e Skin do TF Beauty Club."
  );

const REASONS = [
  {
    title: "Adeus aos cuidados avulsos",
    text: "Esqueça a ideia de cuidar de si apenas quando a pele demonstra cansaço ou o corpo pede reparos urgentes. Com o clube, você mantém uma rotina preventiva e transformadora todos os meses.",
  },
  {
    title: "Atendimentos mensais garantidos",
    text: "Tenha acesso a procedimentos planejados com valores reduzidos, assegurando que sua pele e seu corpo estejam sempre tratados e radiantes.",
  },
  {
    title: "Exclusividade e vantagens",
    text: "Desfrute de condições especiais e benefícios feitos sob medida para quem prioriza o próprio bem-estar de forma inteligente.",
  },
];

const STEPS = [
  {
    title: "Escolha o seu plano",
    text: "Selecione a opção ideal que melhor se adapta às suas necessidades de cuidado e estilo de vida.",
  },
  {
    title: "Garantia de constância",
    text: "Assegure seus atendimentos mensais com condições financeiras facilitadas e exclusivas.",
  },
  {
    title: "Viva a experiência",
    text: "Desfrute de um acompanhamento contínuo e veja sua autoestima e seus resultados florescerem mês a mês.",
  },
];

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-wine-900 px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-wine-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-wine-600/25 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cream/90">
            <Sparkles size={14} />
            Programa de Assinatura
          </span>

          <h1 className="mt-7 font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
            TF Beauty Club
          </h1>
          <p className="mt-4 font-display text-xl italic text-cream/80 sm:text-2xl">
            O seu ritual de cuidado contínuo
          </p>

          <p className="mt-8 font-sans text-base leading-relaxed text-cream/75 sm:text-lg">
            Transforme o autocuidado em um hábito de constância e sofisticação.
            Um programa de cuidado contínuo para pele e corpo, desenvolvido
            para mulheres que entendem que a verdadeira beleza não é algo
            pontual, mas o resultado de constância, carinho e acompanhamento
            profissional especializado.
          </p>

          <a
            href="#planos"
            className="mt-10 inline-block rounded-full bg-cream px-8 py-4 font-sans text-[15px] font-semibold text-wine-900 transition-transform hover:scale-[1.03]"
          >
            Conhecer os planos
          </a>
        </div>
      </section>

      {/* ===================== POR QUE FAZER PARTE ===================== */}
      <section className="px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Por que fazer parte
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-wine-900 sm:text-4xl">
              Mais do que estética, uma experiência contínua
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-7"
              >
                <h3 className="font-display text-lg text-wine-900">
                  {reason.title}
                </h3>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-soft">
                  {reason.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PLANOS ===================== */}
      <section id="planos" className="bg-nude px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Planos
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-wine-900 sm:text-4xl">
              Escolha o ritual que combina com você
            </h2>
          </div>

          <div className="mt-16 grid items-start gap-8 lg:grid-cols-2">
            {/* --------- PLANO GLOW --------- */}
            <div className="rounded-[2rem] border border-stone-200 bg-cream p-8 sm:p-10">
              <h3 className="font-display text-2xl text-wine-900">
                Plano Glow
              </h3>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-ink-soft">
                O equilíbrio perfeito entre cuidado de qualidade e excelente
                custo-benefício.
              </p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-wine-900">
                  R$ 197
                </span>
                <span className="font-sans text-sm text-ink-soft">/mês</span>
              </div>

              <div className="mt-8 border-t border-stone-200 pt-7">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
                  2 atendimentos por mês
                </p>

                <div className="mt-5 flex flex-col gap-5">
                  <div>
                    <p className="flex items-start gap-2.5 font-sans text-[15px] font-semibold text-ink">
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-wine-700"
                      />
                      1 Procedimento Facial
                    </p>
                    <p className="mt-1.5 pl-[27px] font-sans text-sm leading-relaxed text-ink-soft">
                      Escolha mensal entre Limpeza de pele Prata, Revitalização
                      facial ou Peeling de diamante.
                    </p>
                  </div>

                  <div>
                    <p className="flex items-start gap-2.5 font-sans text-[15px] font-semibold text-ink">
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-wine-700"
                      />
                      1 Procedimento Corporal
                    </p>
                    <p className="mt-1.5 pl-[27px] font-sans text-sm leading-relaxed text-ink-soft">
                      Escolha mensal entre Drenagem + manta térmica,
                      Radiofrequência ou Corrente russa.
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-wine-100/60 px-5 py-4">
                  <p className="font-sans text-sm text-wine-800">
                    <span className="font-semibold">10% de desconto</span> em
                    outros procedimentos da clínica.
                  </p>
                </div>
              </div>

              <a
                href={WHATSAPP_GLOW}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block rounded-full border border-wine-700/30 px-6 py-3.5 text-center font-sans text-[15px] font-semibold text-wine-800 transition-colors hover:bg-wine-100"
              >
                Quero o Plano Glow
              </a>
            </div>

            {/* --------- PLANO SCULPT E SKIN (destaque) --------- */}
            <div className="relative rounded-[2rem] bg-wine-900 p-8 shadow-2xl sm:p-10 lg:-mt-6 lg:pb-14 lg:pt-14">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-cream px-5 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-wine-900">
                Mais completo
              </span>

              <h3 className="font-display text-2xl text-cream">
                Plano Sculpt e Skin
              </h3>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-cream/75">
                Desenvolvido para quem deseja resultados mais intensos,
                profundos e contínuos.
              </p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-cream">R$ 297</span>
                <span className="font-sans text-sm text-cream/60">/mês</span>
              </div>

              <div className="mt-8 border-t border-cream/15 pt-7">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-cream/70">
                  2 atendimentos + 1 bônus por mês
                </p>

                <div className="mt-5 flex flex-col gap-5">
                  <div>
                    <p className="flex items-start gap-2.5 font-sans text-[15px] font-semibold text-cream">
                      <Check size={17} className="mt-0.5 shrink-0 text-cream" />
                      1 Procedimento Facial
                    </p>
                    <p className="mt-1.5 pl-[27px] font-sans text-sm leading-relaxed text-cream/70">
                      Escolha mensal entre Limpeza de pele Ouro, Peeling químico
                      ou Revitalização com protocolo especial.
                    </p>
                  </div>

                  <div>
                    <p className="flex items-start gap-2.5 font-sans text-[15px] font-semibold text-cream">
                      <Check size={17} className="mt-0.5 shrink-0 text-cream" />
                      1 Procedimento Corporal
                    </p>
                    <p className="mt-1.5 pl-[27px] font-sans text-sm leading-relaxed text-cream/70">
                      Escolha mensal entre Drenagem + manta térmica,
                      Eletrolipólise ou Radiofrequência.
                    </p>
                  </div>

                  <div>
                    <p className="flex items-start gap-2.5 font-sans text-[15px] font-semibold text-cream">
                      <Sparkles
                        size={17}
                        className="mt-0.5 shrink-0 text-cream"
                      />
                      1 Bônus Mensal
                    </p>
                    <p className="mt-1.5 pl-[27px] font-sans text-sm leading-relaxed text-cream/70">
                      Escolha mensal entre LED terapia, Corrente russa ou
                      Liberação muscular.
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-2.5 rounded-2xl bg-cream/10 px-5 py-4">
                  <p className="font-sans text-sm text-cream">
                    <span className="font-semibold">15% de desconto</span> em
                    outros procedimentos.
                  </p>
                  <p className="flex items-center gap-2 font-sans text-sm text-cream">
                    <Gift size={15} className="shrink-0" />
                    Brinde especial a cada 3 meses.
                  </p>
                </div>
              </div>

              <a
                href={WHATSAPP_SCULPT}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block rounded-full bg-cream px-6 py-3.5 text-center font-sans text-[15px] font-semibold text-wine-900 transition-transform hover:scale-[1.03]"
              >
                Quero o Plano Sculpt e Skin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== COMO FUNCIONA ===================== */}
      <section className="px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Como funciona
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-wine-900 sm:text-4xl">
              Participar é simples e transformador
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title}>
                <span className="font-display text-4xl text-wine-700/25">
                  0{index + 1}
                </span>
                <h3 className="mt-2 font-display text-lg text-wine-900">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] bg-wine-700 px-8 py-12 text-center sm:px-12">
            <h2 className="font-display text-2xl leading-tight text-cream sm:text-3xl">
              Dê o próximo passo na sua jornada de beleza
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-sans text-[15px] leading-relaxed text-cream/85">
              Entre em contato, escolha o seu plano e venha fazer parte do TF
              Beauty Club.
            </p>
            <a
              href="https://wa.me/558888048009"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-cream px-8 py-4 font-sans text-[15px] font-semibold text-wine-900 transition-transform hover:scale-[1.03]"
            >
              Falar com a equipe
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
