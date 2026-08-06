"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function limparTelefone(valor: string) {
  return valor.replace(/\D/g, "");
}

export async function cadastrar(formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const whatsapp = limparTelefone(String(formData.get("whatsapp") || ""));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || !password) {
    redirect(`/cadastro?erro=${encodeURIComponent("Preencha todos os campos.")}`);
  }

  // DDD + número: 10 ou 11 dígitos (fixo ou celular com 9).
  if (whatsapp.length < 10 || whatsapp.length > 11) {
    redirect(
      `/cadastro?erro=${encodeURIComponent(
        "Informe o WhatsApp com DDD, só números (ex: 47999998888)."
      )}`
    );
  }

  if (password.length < 6) {
    redirect(
      `/cadastro?erro=${encodeURIComponent("A senha precisa ter pelo menos 6 caracteres.")}`
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Vira o "raw_user_meta_data" lido pelo trigger handle_new_user() no banco.
      data: { full_name: fullName, whatsapp },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/cadastro?erro=${encodeURIComponent(error.message)}`);
  }

  // Com a confirmação de email desativada no Supabase, o signUp já retorna
  // uma sessão ativa, então o cliente entra direto, sem precisar confirmar.
  if (data.session) {
    redirect("/agendar");
  }

  // Fallback: se algum dia a confirmação de email for reativada no Supabase,
  // isso volta a funcionar sem precisar mexer no código de novo.
  redirect("/cadastro/confirme-seu-email");
}