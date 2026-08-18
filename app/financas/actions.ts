"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  buildSummaryForAI,
  type Classification,
  type Kind,
  type Scope,
} from "@/lib/finance/engine";

async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile?.is_active) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

// ============================================================
// SALDO INICIAL
// ============================================================

export async function salvarSaldoInicial(data: {
  startDate: string;
  initialBalance: number;
}) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  if (!data.startDate) return { error: "Informe a data inicial." };
  if (Number.isNaN(data.initialBalance)) {
    return { error: "Informe um saldo inicial válido." };
  }

  const { data: existente } = await supabase
    .from("finance_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = {
    start_date: data.startDate,
    initial_balance: data.initialBalance,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };

  const { error } = existente
    ? await supabase.from("finance_settings").update(payload).eq("id", existente.id)
    : await supabase.from("finance_settings").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/financas");
  return { success: true };
}

// ============================================================
// LANÇAMENTOS
// ============================================================

export async function criarLancamento(data: {
  scope: Scope;
  kind: Kind;
  description: string;
  amount: number;
  occurredOn: string;
  competence: string;
  classification: Classification | null;
}) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const description = data.description.trim();

  if (!description) return { error: "Informe uma descrição." };
  if (!data.amount || data.amount <= 0) {
    return { error: "Informe um valor maior que zero." };
  }
  if (!data.occurredOn) return { error: "Informe a data do lançamento." };
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(data.competence)) {
    return { error: "Competência inválida." };
  }
  if (data.kind === "expense" && !data.classification) {
    return { error: "Classifique a saída como necessária, útil ou fútil." };
  }

  const { error } = await supabase.from("transactions").insert({
    scope: data.scope,
    kind: data.kind,
    description,
    amount: data.amount,
    occurred_on: data.occurredOn,
    competence: data.competence,
    // Entradas não recebem classificação.
    classification: data.kind === "expense" ? data.classification : null,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/financas");
  return { success: true };
}

export async function removerLancamento(id: string) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/financas");
  return { success: true };
}

/** Permite corrigir a classificação de uma saída já lançada. */
export async function reclassificarLancamento(
  id: string,
  classification: Classification
) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("transactions")
    .update({ classification })
    .eq("id", id)
    .eq("kind", "expense");

  if (error) return { error: error.message };

  revalidatePath("/financas");
  return { success: true };
}

// ============================================================
// SUGESTÕES DA IA
// ============================================================

const PROMPT_SISTEMA = `Você é um consultor financeiro que atende uma profissional autônoma da área de estética no Brasil, dona de uma clínica.

Analise o resumo financeiro em JSON e escreva sugestões práticas e específicas.

Contexto importante: os gastos são classificados por ela em tres tipos.
- Necessario: sem ele algo para de funcionar.
- Util: nao e indispensavel, mas traz retorno real.
- Futil: impulso ou prazer momentaneo, poderia ser cortado sem prejuizo.

Regras:
- Responda em português do Brasil, com tom respeitoso e direto, tratando a pessoa por "você".
- Cite valores e percentuais concretos do resumo para embasar cada ponto.
- Dê atenção especial à proporção de gastos fúteis e à comparação com o mês anterior.
- Foque em: onde há gasto desnecessário, o que priorizar, e um próximo passo concreto.
- Não use travessão em nenhuma hipótese. Use vírgula, ponto ou dois-pontos.
- Não invente dados que não estão no resumo.
- Se os dados forem escassos, diga isso e sugira o que registrar para uma análise melhor.
- Não dê conselhos sobre investimentos financeiros específicos (ações, cripto, fundos). Você não é assessor de investimentos.

Formato da resposta: JSON puro, sem cercas de código, no formato:
{"suggestions":[{"title":"...","text":"..."}]}
Máximo de 4 sugestões. Cada "text" com 2 a 3 frases.`;

export type Suggestion = { title: string; text: string };

export async function gerarSugestoesIA(competence: string): Promise<{
  suggestions?: Suggestion[];
  error?: string;
}> {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      error:
        "A IA ainda não está configurada. Adicione a variável ANTHROPIC_API_KEY no Vercel para ativar as sugestões.",
    };
  }

  const { data: settings } = await supabase
    .from("finance_settings")
    .select("start_date, initial_balance")
    .limit(1)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      "id, scope, kind, description, amount, occurred_on, competence, classification"
    )
    .order("occurred_on", { ascending: true });

  if (!transactions || transactions.length === 0) {
    return { error: "Registre alguns lançamentos antes de pedir sugestões." };
  }

  const resumo = buildSummaryForAI(transactions, settings ?? null, competence);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: PROMPT_SISTEMA,
        messages: [
          {
            role: "user",
            content: `Resumo financeiro:\n${JSON.stringify(resumo, null, 2)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        error: "Não foi possível falar com a IA agora. Tente de novo em instantes.",
      };
    }

    const payload = await response.json();
    const texto: string = (payload.content || [])
      .map((bloco: { type: string; text?: string }) =>
        bloco.type === "text" ? bloco.text ?? "" : ""
      )
      .join("")
      .trim();

    const limpo = texto.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(limpo) as { suggestions?: Suggestion[] };

    if (!parsed.suggestions?.length) {
      return { error: "A IA não retornou sugestões. Tente novamente." };
    }

    return { suggestions: parsed.suggestions.slice(0, 4) };
  } catch {
    return { error: "Não foi possível interpretar a resposta da IA. Tente novamente." };
  }
}
