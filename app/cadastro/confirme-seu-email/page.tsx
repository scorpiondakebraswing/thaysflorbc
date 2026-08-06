import Link from "next/link";

export default function ConfirmeSeuEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-3xl text-wine-900">
          Confirme seu e-mail
        </h1>
        <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-soft">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar sua conta e poder fazer login.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-full bg-wine-700 px-6 py-3 font-sans text-sm font-semibold text-cream hover:bg-wine-800"
        >
          Ir para o login
        </Link>
      </div>
    </main>
  );
}
