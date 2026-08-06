import Link from "next/link";
import { solicitarRedefinicao } from "./actions";

export default async function EsqueciSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white/60 p-8 shadow-sm sm:p-10">
        <Link href="/login" className="font-display text-sm text-wine-700 hover:underline">
          ← Voltar ao login
        </Link>

        <h1 className="mt-6 font-display text-3xl text-wine-900">Esqueci minha senha</h1>
        <p className="mt-2 font-sans text-[15px] text-ink-soft">
          Informe o e-mail da sua conta. Vamos te mandar um link pra criar
          uma senha nova.
        </p>

        {erro && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {erro}
          </p>
        )}

        <form action={solicitarRedefinicao} className="mt-7 flex flex-col gap-4">
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

          <button
            type="submit"
            className="mt-3 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[15px] font-semibold text-cream transition-colors hover:bg-wine-800"
          >
            Enviar link de redefinição
          </button>
        </form>
      </div>
    </main>
  );
}
