import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client com privilégios totais, usado apenas em Server Actions para
 * criar usuários, redefinir senha e desativar acessos.
 *
 * ATENÇÃO: a chave de serviço ignora todas as regras de segurança do banco.
 * Este arquivo NUNCA deve ser importado por um componente com "use client",
 * e a variável NUNCA deve receber o prefixo NEXT_PUBLIC.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltam as variáveis NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Converte o nome de usuário no email interno usado pelo Supabase Auth. */
export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@tfbeauty.local`;
}
