/**
 * MOTOR FINANCEIRO
 *
 * Concentra todos os cálculos, o fechamento por competência e a geração
 * de alertas. Fica separado da interface para poder ser conferido e
 * ajustado sem mexer no visual.
 */

export type Scope = "professional" | "personal" | "investment";
export type Kind = "income" | "expense";
export type Classification = "necessario" | "util" | "futil";

export type Transaction = {
  id: string;
  scope: Scope;
  kind: Kind;
  description: string;
  amount: number;
  occurred_on: string; // YYYY-MM-DD
  competence: string; // YYYY-MM
  classification: Classification | null;
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

export const CLASSIFICATION_LABEL: Record<Classification, string> = {
  necessario: "Necessário",
  util: "Útil",
  futil: "Fútil",
};

/** Textos de apoio exibidos na hora de classificar um gasto. */
export const CLASSIFICATION_HINT: Record<Classification, string> = {
  necessario:
    "Sem esse gasto, algo para de funcionar. Aluguel, energia, material de trabalho, mercado.",
  util:
    "Não é indispensável, mas traz retorno real, economia de tempo ou conforto que compensa. Curso, equipamento melhor, plano de saúde.",
  futil:
    "Compra por impulso ou prazer momentâneo, que poderia ser cortada sem prejuízo real. Delivery repetido, compra não planejada.",
};

export const CLASSIFICATION_COLOR: Record<Classification, string> = {
  necessario: "#6E2439",
  util: "#93435F",
  futil: "#D4A05A",
};

export const CLASSIFICATION_ORDER: Classification[] = [
  "necessario",
  "util",
  "futil",
];

// ============================================================
// FORMATAÇÃO
// ============================================================

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** "2026-08" vira "Agosto de 2026". */
export function competenceLabel(competence: string) {
  const [ano, mes] = competence.split("-");
  return `${MESES[Number(mes) - 1]} de ${ano}`;
}

/** "2026-08" vira "ago/26", para caber no eixo dos gráficos. */
export function competenceShort(competence: string) {
  const [ano, mes] = competence.split("-");
  return `${MESES[Number(mes) - 1].slice(0, 3).toLowerCase()}/${ano.slice(2)}`;
}

export function formatDate(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano.slice(2)}`;
}

export function currentCompetence() {
  return new Date().toISOString().slice(0, 7);
}

/** Competência anterior a uma dada. "2026-01" vira "2025-12". */
export function previousCompetence(competence: string) {
  const [ano, mes] = competence.split("-").map(Number);
  const d = new Date(ano, mes - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ============================================================
// TOTAIS
// ============================================================

export function soma(transactions: Transaction[]) {
  return transactions.reduce((acc, t) => acc + Number(t.amount), 0);
}

export function totalIncome(transactions: Transaction[]) {
  return soma(transactions.filter((t) => t.kind === "income"));
}

export function totalExpense(transactions: Transaction[]) {
  return soma(transactions.filter((t) => t.kind === "expense"));
}

export type Totals = { income: number; expense: number; balance: number };

export function totals(transactions: Transaction[]): Totals {
  const income = totalIncome(transactions);
  const expense = totalExpense(transactions);
  return { income, expense, balance: income - expense };
}

export function totalsByScope(transactions: Transaction[], scope: Scope): Totals {
  return totals(transactions.filter((t) => t.scope === scope));
}

/** Saldo acumulado: saldo inicial mais tudo que entrou, menos tudo que saiu. */
export function currentBalance(
  transactions: Transaction[],
  settings: FinanceSettings | null
) {
  const base = settings ? Number(settings.initial_balance) : 0;
  return base + totalIncome(transactions) - totalExpense(transactions);
}

// ============================================================
// COMPETÊNCIAS
// ============================================================

/** Lista de competências presentes nos lançamentos, da mais recente para a mais antiga. */
export function listCompetences(transactions: Transaction[]) {
  const set = new Set(transactions.map((t) => t.competence));
  set.add(currentCompetence());
  return Array.from(set).sort().reverse();
}

export function byCompetence(transactions: Transaction[], competence: string) {
  return transactions.filter((t) => t.competence === competence);
}

export type MonthlyPoint = {
  competence: string;
  label: string;
  income: number;
  expense: number;
  result: number;
  balance: number;
  necessario: number;
  util: number;
  futil: number;
};

/** Série mensal por competência, com saldo acumulado ao longo do tempo. */
export function monthlySeries(
  transactions: Transaction[],
  settings: FinanceSettings | null
): MonthlyPoint[] {
  const competencias = Array.from(
    new Set(transactions.map((t) => t.competence))
  ).sort();

  let acumulado = settings ? Number(settings.initial_balance) : 0;

  return competencias.map((competence) => {
    const doMes = byCompetence(transactions, competence);
    const income = totalIncome(doMes);
    const expense = totalExpense(doMes);
    acumulado += income - expense;

    return {
      competence,
      label: competenceShort(competence),
      income,
      expense,
      result: income - expense,
      balance: acumulado,
      necessario: sumByClassification(doMes, "necessario"),
      util: sumByClassification(doMes, "util"),
      futil: sumByClassification(doMes, "futil"),
    };
  });
}

// ============================================================
// CLASSIFICAÇÃO DOS GASTOS
// ============================================================

export function sumByClassification(
  transactions: Transaction[],
  classification: Classification
) {
  return soma(
    transactions.filter(
      (t) => t.kind === "expense" && t.classification === classification
    )
  );
}

export type ClassificationSlice = {
  key: Classification;
  name: string;
  value: number;
  share: number; // porcentagem sobre o total de saídas
};

export function classificationBreakdown(
  transactions: Transaction[]
): ClassificationSlice[] {
  const totalSaidas = totalExpense(transactions);

  return CLASSIFICATION_ORDER.map((key) => {
    const value = sumByClassification(transactions, key);
    return {
      key,
      name: CLASSIFICATION_LABEL[key],
      value,
      share: totalSaidas > 0 ? (value / totalSaidas) * 100 : 0,
    };
  }).filter((slice) => slice.value > 0);
}

// ============================================================
// FECHAMENTO DO MÊS
// ============================================================

export type MonthClosing = {
  competence: string;
  label: string;
  income: number;
  expense: number;
  result: number;
  byScope: { scope: Scope; label: string; totals: Totals }[];
  classification: ClassificationSlice[];
  futilShare: number;
  /** Variação do resultado em relação ao mês anterior, em reais. */
  resultDelta: number | null;
  /** Variação da fatia de gastos fúteis, em pontos percentuais. */
  futilDelta: number | null;
};

export function monthClosing(
  transactions: Transaction[],
  competence: string
): MonthClosing {
  const doMes = byCompetence(transactions, competence);
  const t = totals(doMes);
  const classification = classificationBreakdown(doMes);
  const futilShare =
    t.expense > 0 ? (sumByClassification(doMes, "futil") / t.expense) * 100 : 0;

  const anterior = previousCompetence(competence);
  const doMesAnterior = byCompetence(transactions, anterior);
  const temAnterior = doMesAnterior.length > 0;

  const tAnterior = totals(doMesAnterior);
  const futilAnterior =
    tAnterior.expense > 0
      ? (sumByClassification(doMesAnterior, "futil") / tAnterior.expense) * 100
      : 0;

  return {
    competence,
    label: competenceLabel(competence),
    income: t.income,
    expense: t.expense,
    result: t.balance,
    byScope: (Object.keys(SCOPE_LABEL) as Scope[]).map((scope) => ({
      scope,
      label: SCOPE_LABEL[scope],
      totals: totalsByScope(doMes, scope),
    })),
    classification,
    futilShare,
    resultDelta: temAnterior ? t.balance - tAnterior.balance : null,
    futilDelta: temAnterior ? futilShare - futilAnterior : null,
  };
}

// ============================================================
// MAIORES GASTOS
// ============================================================

export type BreakdownSlice = { name: string; value: number };

/** Agrupa saídas por descrição, revelando gastos repetidos. */
export function topExpenses(
  transactions: Transaction[],
  limite = 6
): BreakdownSlice[] {
  const saidas = transactions.filter((t) => t.kind === "expense");
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
  settings: FinanceSettings | null,
  competence: string
): Alert[] {
  const alertas: Alert[] = [];
  if (transactions.length === 0) return alertas;

  const saldo = currentBalance(transactions, settings);
  const fechamento = monthClosing(transactions, competence);
  const doMes = byCompetence(transactions, competence);

  if (saldo < 0) {
    alertas.push({
      level: "critical",
      title: "Saldo negativo",
      text: `Seu saldo acumulado está em ${formatBRL(saldo)}. As saídas já superaram tudo que entrou somado ao saldo inicial.`,
    });
  }

  if (doMes.length > 0 && fechamento.result < 0) {
    alertas.push({
      level: "warning",
      title: `${fechamento.label} fechou no vermelho`,
      text: `Neste mês saíram ${formatBRL(fechamento.expense)} contra ${formatBRL(fechamento.income)} de entradas, um resultado de ${formatBRL(fechamento.result)}.`,
    });
  }

  // Gastos fúteis pesando no mês
  if (fechamento.futilShare >= 25) {
    const valorFutil = sumByClassification(doMes, "futil");
    alertas.push({
      level: "warning",
      title: "Gastos fúteis acima do saudável",
      text: `Em ${fechamento.label}, ${fechamento.futilShare.toFixed(0)}% das saídas foram classificadas como fúteis, o equivalente a ${formatBRL(valorFutil)}. Esse é o dinheiro mais fácil de recuperar sem afetar sua rotina.`,
    });
  } else if (fechamento.futilShare > 0 && fechamento.futilShare < 10 && doMes.length >= 3) {
    alertas.push({
      level: "positive",
      title: "Gastos fúteis sob controle",
      text: `Apenas ${fechamento.futilShare.toFixed(0)}% das saídas de ${fechamento.label} foram fúteis. Sinal de que as escolhas do mês foram bem direcionadas.`,
    });
  }

  // Piora em relação ao mês anterior
  if (fechamento.futilDelta !== null && fechamento.futilDelta >= 10) {
    alertas.push({
      level: "warning",
      title: "Gastos fúteis subiram",
      text: `A fatia de gastos fúteis cresceu ${fechamento.futilDelta.toFixed(0)} pontos percentuais em relação ao mês anterior. Vale olhar o que mudou na rotina.`,
    });
  }

  if (fechamento.resultDelta !== null && fechamento.resultDelta <= -500) {
    alertas.push({
      level: "warning",
      title: "Resultado pior que o mês passado",
      text: `O resultado de ${fechamento.label} ficou ${formatBRL(Math.abs(fechamento.resultDelta))} abaixo do mês anterior.`,
    });
  }

  // Consultório
  const consultorio = totalsByScope(doMes, "professional");
  if (doMes.length > 0 && consultorio.balance < 0) {
    alertas.push({
      level: "warning",
      title: "Consultório no vermelho neste mês",
      text: `As despesas do consultório ficaram ${formatBRL(Math.abs(consultorio.balance))} acima do que ele faturou em ${fechamento.label}.`,
    });
  }

  // Concentração de despesa
  const maiores = topExpenses(doMes, 1);
  if (maiores.length > 0 && fechamento.expense > 0) {
    const fatia = (maiores[0].value / fechamento.expense) * 100;
    if (fatia >= 30) {
      alertas.push({
        level: "warning",
        title: "Uma despesa concentra boa parte do mês",
        text: `"${maiores[0].name}" responde por ${fatia.toFixed(0)}% das saídas de ${fechamento.label} (${formatBRL(maiores[0].value)}).`,
      });
    }
  }

  if (doMes.length > 0 && fechamento.result > 0 && saldo > 0) {
    alertas.push({
      level: "positive",
      title: `${fechamento.label} fechou positivo`,
      text: `Sobrou ${formatBRL(fechamento.result)} no mês. Bom momento para separar uma parte como reserva antes de assumir novos gastos.`,
    });
  }

  return alertas;
}

/** Resumo compacto enviado para a IA gerar sugestões. */
export function buildSummaryForAI(
  transactions: Transaction[],
  settings: FinanceSettings | null,
  competence: string
) {
  const fechamento = monthClosing(transactions, competence);
  const doMes = byCompetence(transactions, competence);

  return {
    competenciaAnalisada: fechamento.label,
    saldoAcumulado: currentBalance(transactions, settings),
    fechamentoDoMes: {
      entradas: fechamento.income,
      saidas: fechamento.expense,
      resultado: fechamento.result,
      variacaoVsMesAnterior: fechamento.resultDelta,
    },
    classificacaoDosGastos: fechamento.classification.map((c) => ({
      tipo: c.name,
      valor: c.value,
      percentual: Number(c.share.toFixed(1)),
    })),
    porEscopo: fechamento.byScope.map((s) => ({
      escopo: s.label,
      entradas: s.totals.income,
      saidas: s.totals.expense,
      resultado: s.totals.balance,
    })),
    maioresSaidasDoMes: topExpenses(doMes, 8),
    historicoMensal: monthlySeries(transactions, settings).map((m) => ({
      competencia: m.competence,
      entradas: m.income,
      saidas: m.expense,
      resultado: m.result,
      saldoAcumulado: m.balance,
      gastosFuteis: m.futil,
    })),
  };
}
