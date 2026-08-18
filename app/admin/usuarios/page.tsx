import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import UserManager, { type AdminUser } from "./UserManager";

export const metadata: Metadata = {
  title: "Usuários | TF Beauty Clinic",
};

export default async function UsuariosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile?.is_active) redirect("/login");

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, full_name, is_active")
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-cream px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Administração
            </p>
            <h1 className="mt-1 font-display text-3xl text-wine-900">
              Controle de acessos
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/financas"
              className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Finanças
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
          <UserManager
            users={(users ?? []) as AdminUser[]}
            currentUserId={user.id}
          />
        </div>
      </div>
    </main>
  );
}
