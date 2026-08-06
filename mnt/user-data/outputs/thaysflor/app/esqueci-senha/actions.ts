"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function solicitarRedefinicao(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect(`/esqueci-senha?erro=${encodeURIComponent("Informe seu e-mail.")}`);
  }

  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=/redefinir-senha`,
  });

  // Sempre mostra a mesma mensagem de sucesso, exista ou não o e-mail,
  // evita que alguém descubra quais e-mails estão cadastrados.
  redirect("/esqueci-senha/verifique-seu-email");
}
