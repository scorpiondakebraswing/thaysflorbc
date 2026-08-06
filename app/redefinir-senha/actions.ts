"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function redefinirSenha(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmar = String(formData.get("password_confirm") || "");

  if (password.length < 6) {
    redirect(
      `/redefinir-senha?erro=${encodeURIComponent("A senha precisa ter pelo menos 6 caracteres.")}`
    );
  }

  if (password !== confirmar) {
    redirect(`/redefinir-senha?erro=${encodeURIComponent("As senhas não coincidem.")}`);
  }

  const supabase = await createClient();

  // Só funciona porque o /auth/callback já criou uma sessão de recuperação
  // válida a partir do link enviado por e-mail.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/redefinir-senha?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?sucesso=${encodeURIComponent("Senha atualizada! Faça login com a nova senha.")}`
  );
}
