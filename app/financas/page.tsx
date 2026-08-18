import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import FinanceDashboard from "./FinanceDashboard";
import type { FinanceSettings, Transaction } from "@/lib/finance/engine";

export const metadata: Metadata = {
  title: "Finanças | TF Beauty Clinic",
};

export default async function FinancasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile?.is_active) redirect("/login");

  const { data: settings } = await supabase
    .from("finance_settings")
    .select("start_date, initial_balance")
    .limit(1)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, scope, kind, description, amount, occurred_on")
    .order("occurred_on", { ascending: false });

  return (
    <main className="min-h-screen bg-cream px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Controle Financeiro
            </p>
            <h1 className="mt-1 font-display text-3xl text-wine-900">
              Olá, {profile?.full_name?.split(" ")[0] || profile?.username}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/usuarios"
              className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Usuários
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <FinanceDashboard
            transactions={(transactions ?? []) as Transaction[]}
            settings={(settings ?? null) as FinanceSettings | null}
          />
        </div>
      </div>
    </main>
  );
}
