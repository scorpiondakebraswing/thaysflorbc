import Link from "next/link";
import { cadastrar } from "./actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white/60 p-8 shadow-sm sm:p-10">
        <Link href="/" className="font-display text-sm text-wine-700 hover:underline">
          ← Voltar ao site
        </Link>

        <h1 className="mt-6 font-display text-3xl text-wine-900">Criar conta</h1>
        <p className="mt-2 font-sans text-[15px] text-ink-soft">
          Cadastre-se para solicitar seus agendamentos.
        </p>

        {erro && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {erro}
          </p>
        )}

        <form action={cadastrar} className="mt-7 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Nome completo
            </label>
            <input
              type="text"
              name="full_name"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-wine-700"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              WhatsApp (com DDD)
            </label>
            <input
              type="tel"
              name="whatsapp"
              required
              inputMode="numeric"
              autoComplete="tel"
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-wine-700"
              placeholder="47 99999-8888"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-wine-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-wine-700"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            className="mt-3 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[15px] font-semibold text-cream transition-colors hover:bg-wine-800"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-ink-soft">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-wine-700 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
