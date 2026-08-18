"use server";

import { createClient } from "@/lib/supabase/server";
import { usernameToEmail } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ERRO_GENERICO = "Usuário ou senha incorretos.";

export async function login(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    redirect(`/login?erro=${encodeURIComponent("Preencha usuário e senha.")}`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  // Mensagem sempre igual: não revela se o usuário existe ou não.
  if (error || !data.user) {
    redirect(`/login?erro=${encodeURIComponent(ERRO_GENERICO)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .single();

  if (!profile?.is_active) {
    await supabase.auth.signOut();
    redirect(
      `/login?erro=${encodeURIComponent(
        "Este acesso está desativado. Procure a administradora."
      )}`
    );
  }

  if (profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect(`/login?erro=${encodeURIComponent(ERRO_GENERICO)}`);
  }

  redirect("/financas");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
