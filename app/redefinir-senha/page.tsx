import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redefinirSenha } from "./actions";

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sem sessão de recuperação válida (link expirado, ou acesso direto à URL).
  if (!user) {
    redirect("/esqueci-senha");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white/60 p-8 shadow-sm sm:p-10">
        <h1 className="font-display text-3xl text-wine-900">Nova senha</h1>
        <p className="mt-2 font-sans text-[15px] text-ink-soft">
          Escolha uma nova senha para sua conta.
        </p>

        {erro && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {erro}
          </p>
        )}

        <form action={redefinirSenha} className="mt-7 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Nova senha
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

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Confirmar nova senha
            </label>
            <input
              type="password"
              name="password_confirm"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none focus:border-wine-700"
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            className="mt-3 rounded-full bg-wine-700 px-6 py-3.5 font-sans text-[15px] font-semibold text-cream transition-colors hover:bg-wine-800"
          >
            Salvar nova senha
          </button>
        </form>
      </div>
    </main>
  );
}
