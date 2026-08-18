"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, usernameToEmail } from "@/lib/supabase/admin";

/** Confirma que quem está chamando é admin ativo antes de qualquer operação. */
async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile?.is_active) return null;
  return user;
}

const REGRA_USERNAME = /^[a-z0-9._-]{3,24}$/;

export async function criarUsuario(data: {
  username: string;
  fullName: string;
  password: string;
}) {
  const solicitante = await exigirAdmin();
  if (!solicitante) return { error: "Sessão expirada. Entre novamente." };

  const username = data.username.trim().toLowerCase();
  const fullName = data.fullName.trim();

  if (!REGRA_USERNAME.test(username)) {
    return {
      error:
        "Usuário deve ter de 3 a 24 caracteres, usando apenas letras minúsculas, números, ponto, hífen ou underline.",
    };
  }
  if (!fullName) return { error: "Informe o nome completo." };
  if (data.password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const admin = createAdminClient();

  const { data: criado, error } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password: data.password,
    email_confirm: true,
    user_metadata: { full_name: fullName, username, role: "admin" },
  });

  if (error) {
    const jaExiste = error.message.toLowerCase().includes("already");
    return {
      error: jaExiste ? "Esse nome de usuário já está em uso." : error.message,
    };
  }

  // Garante os campos no perfil mesmo se o trigger do banco não os preencher.
  if (criado.user) {
    await admin
      .from("profiles")
      .update({ username, full_name: fullName, role: "admin", is_active: true })
      .eq("id", criado.user.id);
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function alternarAtivacao(userId: string, ativar: boolean) {
  const solicitante = await exigirAdmin();
  if (!solicitante) return { error: "Sessão expirada. Entre novamente." };

  // Impede que a pessoa desative o próprio acesso e perca o controle.
  if (userId === solicitante.id && !ativar) {
    return { error: "Você não pode desativar o seu próprio acesso." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ is_active: ativar })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function redefinirSenhaUsuario(userId: string, novaSenha: string) {
  const solicitante = await exigirAdmin();
  if (!solicitante) return { error: "Sessão expirada. Entre novamente." };

  if (novaSenha.length < 8) {
    return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: novaSenha,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}
