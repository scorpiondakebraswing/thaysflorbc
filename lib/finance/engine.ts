/**
 * MOTOR FINANCEIRO
 *
 * Concentra todos os cálculos e a geração de alertas. Fica separado da
 * interface para poder ser conferido e ajustado sem mexer no visual.
 */

export type Scope = "professional" | "personal" | "investment";
export type Kind = "income" | "expense";

export type Transaction = {
  id: string;
  scope: Scope;
  kind: Kind;
  description: string;
  amount: number;
  occurred_on: string; // YYYY-MM-DD
};

export type FinanceSettings = {
  start_date: string;
  initial_balance: number;
};

export const SCOPE_LABEL: Record<Scope, string> = {
  professional: "Consultório",
  personal: "Pessoal",
  investment: "Investimentos",
};

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatMonth(iso: string) {
  const [ano, mes] = iso.split("-");
  return `${mes}/${ano.slice(2)}`;
}

// ============================================================
// TOTAIS
// ============================================================

export type ScopeTotals = {
  income: number;
  expense: number;
  balance: number;
};

export function totalsByScope(transactions: Transaction[], scope: Scope): ScopeTotals {
  const doEscopo = transactions.filter((t) => t.scope === scope);
  const income = soma(doEscopo.filter((t) => t.kind === "income"));
  const expense = soma(doEscopo.filter((t) => t.kind === "expense"));
  return { income, expense, balance: income - expense };
}

export function soma(transactions: Transaction[]) {
  return transactions.reduce((acc, t) => acc + Number(t.amount), 0);
}

export function totalIncome(transactions: Transaction[]) {
  return soma(transactions.filter((t) => t.kind === "income"));
}

export function totalExpense(transactions: Transaction[]) {
  return soma(transactions.filter((t) => t.kind === "expense"));
}

/** Saldo atual = saldo inicial + todas as entradas - todas as saídas. */
export function currentBalance(
  transactions: Transaction[],
  settings: FinanceSettings | null
) {
  const base = settings ? Number(settings.initial_balance) : 0;
  return base + totalIncome(transactions) - totalExpense(transactions);
}

// ============================================================
// SÉRIES PARA OS GRÁFICOS
// ============================================================

export type MonthlyPoint = {
  month: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
};

/** Agrupa entradas e saídas por mês e acumula o saldo ao longo do tempo. */
export function monthlySeries(
  transactions: Transaction[],
  settings: FinanceSettings | null
): MonthlyPoint[] {
  const mapa = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const mes = t.occurred_on.slice(0, 7);
    const atual = mapa.get(mes) ?? { income: 0, expense: 0 };
    if (t.kind === "income") atual.income += Number(t.amount);
    else atual.expense += Number(t.amount);
    mapa.set(mes, atual);
  }

  const meses = Array.from(mapa.keys()).sort();
  let acumulado = settings ? Number(settings.initial_balance) : 0;

  return meses.map((mes) => {
    const { income, expense } = mapa.get(mes)!;
    acumulado += income - expense;
    return {
      month: mes,
      label: formatMonth(mes),
      income,
      expense,
      balance: acumulado,
    };
  });
}

export type BreakdownSlice = {
  name: string;
  value: number;
};

/** Divide o total de saídas entre os três escopos. */
export function expenseByScope(transactions: Transaction[]): BreakdownSlice[] {
  return (Object.keys(SCOPE_LABEL) as Scope[])
    .map((scope) => ({
      name: SCOPE_LABEL[scope],
      value: soma(
        transactions.filter((t) => t.scope === scope && t.kind === "expense")
      ),
    }))
    .filter((slice) => slice.value > 0);
}

/** Maiores saídas agrupadas por descrição, para revelar gastos repetidos. */
export function topExpenses(
  transactions: Transaction[],
  scope?: Scope,
  limite = 6
): BreakdownSlice[] {
  const saidas = transactions.filter(
    (t) => t.kind === "expense" && (!scope || t.scope === scope)
  );

  const mapa = new Map<string, number>();
  for (const t of saidas) {
    const chave = t.description.trim().toLowerCase();
    mapa.set(chave, (mapa.get(chave) ?? 0) + Number(t.amount));
  }

  return Array.from(mapa.entries())
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limite);
}

// ============================================================
// ALERTAS AUTOMÁTICOS
// ============================================================

export type Alert = {
  level: "critical" | "warning" | "positive";
  title: string;
  text: string;
};

/**
 * Alertas gerados por regras fixas, sem depender de serviço externo.
 * Sempre funcionam, mesmo sem a IA configurada.
 */
export function buildAlerts(
  transactions: Transaction[],
  settings: FinanceSettings | null
): Alert[] {
  const alertas: Alert[] = [];

  if (transactions.length === 0) return alertas;

  const saldo = currentBalance(transactions, settings);
  const entradas = totalIncome(transactions);
  const saidas = totalExpense(transactions);
  const pessoal = totalsByScope(transactions, "personal");
  const consultorio = totalsByScope(transactions, "professional");
  const investimento = totalsByScope(transactions, "investment");

  if (saldo < 0) {
    alertas.push({
      level: "critical",
      title: "Saldo negativo",
      text: `Seu saldo está em ${formatBRL(saldo)}. As saídas superaram as entradas e o saldo inicial. Vale revisar os gastos maiores antes de assumir novos compromissos.`,
    });
  }

  if (saidas > entradas && entradas > 0) {
    const excesso = saidas - entradas;
    alertas.push({
      level: "warning",
      title: "Gastando mais do que entra",
      text: `No período, as saídas passaram as entradas em ${formatBRL(excesso)}. Se isso se repetir todo mês, o saldo tende a cair de forma constante.`,
    });
  }

  if (consultorio.balance < 0) {
    alertas.push({
      level: "warning",
      title: "Consultório no vermelho",
      text: `As despesas do consultório estão ${formatBRL(Math.abs(consultorio.balance))} acima do que ele fatura. Vale checar se algum custo fixo pode ser renegociado ou se o valor dos procedimentos precisa de ajuste.`,
    });
  }

  if (consultorio.balance > 0 && pessoal.expense > consultorio.balance) {
    alertas.push({
      level: "warning",
      title: "Gastos pessoais acima do lucro do consultório",
      text: `O consultório gerou ${formatBRL(consultorio.balance)} de resultado, mas os gastos pessoais somaram ${formatBRL(pessoal.expense)}. Isso significa que outras fontes estão cobrindo a diferença.`,
    });
  }

  const maiores = topExpenses(transactions, undefined, 1);
  if (maiores.length > 0 && saidas > 0) {
    const maior = maiores[0];
    const fatia = (maior.value / saidas) * 100;
    if (fatia >= 25) {
      alertas.push({
        level: "warning",
        title: "Uma despesa concentra boa parte das saídas",
        text: `"${maior.name}" representa ${fatia.toFixed(0)}% de tudo que saiu (${formatBRL(maior.value)}). Concentração alta assim costuma ser o melhor ponto de partida para economizar.`,
      });
    }
  }

  if (investimento.expense > 0 && entradas > 0) {
    const fatia = (investimento.expense / entradas) * 100;
    if (fatia > 30) {
      alertas.push({
        level: "warning",
        title: "Investimentos pesando no caixa",
        text: `Você destinou ${formatBRL(investimento.expense)} a cursos e equipamentos, o equivalente a ${fatia.toFixed(0)}% das entradas. Investir é importante, mas vale escalonar as compras para não apertar o caixa.`,
      });
    }
  }

  if (saldo > 0 && consultorio.balance > 0 && saidas <= entradas) {
    alertas.push({
      level: "positive",
      title: "Contas equilibradas",
      text: `O consultório está lucrativo e as entradas cobrem as saídas. Com saldo de ${formatBRL(saldo)}, é um bom momento para separar uma reserva mensal fixa.`,
    });
  }

  return alertas;
}

/** Resumo compacto enviado para a IA gerar sugestões. */
export function buildSummaryForAI(
  transactions: Transaction[],
  settings: FinanceSettings | null
) {
  const escopos = (Object.keys(SCOPE_LABEL) as Scope[]).map((scope) => ({
    escopo: SCOPE_LABEL[scope],
    ...totalsByScope(transactions, scope),
  }));

  return {
    saldoAtual: currentBalance(transactions, settings),
    saldoInicial: settings ? Number(settings.initial_balance) : 0,
    dataInicial: settings?.start_date ?? null,
    totalEntradas: totalIncome(transactions),
    totalSaidas: totalExpense(transactions),
    porEscopo: escopos,
    maioresSaidas: topExpenses(transactions, undefined, 8),
    totalLancamentos: transactions.length,
    porMes: monthlySeries(transactions, settings).map((m) => ({
      mes: m.month,
      entradas: m.income,
      saidas: m.expense,
      saldoAcumulado: m.balance,
    })),
  };
}
