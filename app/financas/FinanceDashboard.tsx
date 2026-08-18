"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2, Plus, Sparkles, TriangleAlert, CircleCheck, Info } from "lucide-react";
import {
  criarLancamento,
  removerLancamento,
  salvarSaldoInicial,
  gerarSugestoesIA,
  type Suggestion,
} from "./actions";
import {
  GraficoMensal,
  GraficoSaldo,
  GraficoDistribuicao,
  GraficoMaioresGastos,
} from "./Charts";
import {
  buildAlerts,
  currentBalance,
  expenseByScope,
  formatBRL,
  monthlySeries,
  topExpenses,
  totalsByScope,
  SCOPE_LABEL,
  type FinanceSettings,
  type Kind,
  type Scope,
  type Transaction,
} from "@/lib/finance/engine";

const ABAS: { key: Scope; label: string; hint: string }[] = [
  {
    key: "professional",
    label: "Consultório",
    hint: "Faturamento e despesas da clínica: aluguel, produtos, energia, procedimentos recebidos.",
  },
  {
    key: "personal",
    label: "Pessoal",
    hint: "Gastos e recebimentos do dia a dia: mercado, contas de casa, transporte, lazer.",
  },
  {
    key: "investment",
    label: "Investimentos",
    hint: "Aportes em crescimento profissional: cursos, equipamentos, certificações.",
  },
];

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano.slice(2)}`;
}

// ============================================================

export default function FinanceDashboard({
  transactions,
  settings,
}: {
  transactions: Transaction[];
  settings: FinanceSettings | null;
}) {
  const [aba, setAba] = useState<Scope>("professional");
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  // Formulário de lançamento
  const [kind, setKind] = useState<Kind>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredOn, setOccurredOn] = useState(hoje());

  // Saldo inicial
  const [editandoSaldo, setEditandoSaldo] = useState(!settings);
  const [startDate, setStartDate] = useState(settings?.start_date ?? hoje());
  const [initialBalance, setInitialBalance] = useState(
    settings ? String(settings.initial_balance) : ""
  );

  // IA
  const [sugestoes, setSugestoes] = useState<Suggestion[] | null>(null);
  const [erroIA, setErroIA] = useState<string | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  const saldo = useMemo(
    () => currentBalance(transactions, settings),
    [transactions, settings]
  );
  const alertas = useMemo(
    () => buildAlerts(transactions, settings),
    [transactions, settings]
  );
  const serieMensal = useMemo(
    () => monthlySeries(transactions, settings),
    [transactions, settings]
  );
  const distribuicao = useMemo(() => expenseByScope(transactions), [transactions]);
  const maioresGastos = useMemo(() => topExpenses(transactions), [transactions]);

  const totaisAba = useMemo(() => totalsByScope(transactions, aba), [transactions, aba]);
  const lancamentosAba = useMemo(
    () =>
      transactions
        .filter((t) => t.scope === aba)
        .sort((a, b) => b.occurred_on.localeCompare(a.occurred_on)),
    [transactions, aba]
  );

  function handleSalvarSaldo() {
    setErro(null);
    const valor = Number(initialBalance.replace(",", "."));

    startTransition(async () => {
      const r = await salvarSaldoInicial({ startDate, initialBalance: valor });
      if (r.error) setErro(r.error);
      else setEditandoSaldo(false);
    });
  }

  function handleAdicionar() {
    setErro(null);
    const valor = Number(amount.replace(",", "."));

    startTransition(async () => {
      const r = await criarLancamento({
        scope: aba,
        kind,
        description,
        amount: valor,
        occurredOn,
      });

      if (r.error) {
        setErro(r.error);
      } else {
        setDescription("");
        setAmount("");
      }
    });
  }

  function handleRemover(id: string) {
    setErro(null);
    startTransition(async () => {
      const r = await removerLancamento(id);
      if (r.error) setErro(r.error);
    });
  }

  async function handleIA() {
    setCarregandoIA(true);
    setErroIA(null);
    setSugestoes(null);

    const r = await gerarSugestoesIA();
    if (r.error) setErroIA(r.error);
    else setSugestoes(r.suggestions ?? null);

    setCarregandoIA(false);
  }

  const abaAtual = ABAS.find((a) => a.key === aba)!;

  return (
    <div className="flex flex-col gap-10">
      {/* ============ RESUMO GERAL ============ */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.5rem] bg-wine-900 p-6 text-cream">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cream/60">
            Saldo atual
          </p>
          <p className="mt-2 font-display text-3xl">{formatBRL(saldo)}</p>
          {settings && (
            <p className="mt-2 font-sans text-xs text-cream/60">
              Desde {formatDate(settings.start_date)}, partindo de{" "}
              {formatBRL(Number(settings.initial_balance))}
            </p>
          )}
        </div>

        {ABAS.map(({ key, label }) => {
          const t = totalsByScope(transactions, key);
          return (
            <div
              key={key}
              className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6"
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">
                {label}
              </p>
              <p
                className={`mt-2 font-display text-2xl ${
                  t.balance < 0 ? "text-red-700" : "text-wine-900"
                }`}
              >
                {formatBRL(t.balance)}
              </p>
              <p className="mt-2 font-sans text-xs text-ink-soft">
                Entrou {formatBRL(t.income)} · Saiu {formatBRL(t.expense)}
              </p>
            </div>
          );
        })}
      </section>

      {/* ============ SALDO INICIAL ============ */}
      <section className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg text-wine-900">Ponto de partida</h2>
            <p className="mt-1 font-sans text-sm text-ink-soft">
              A data e o saldo de onde o sistema começa a contar.
            </p>
          </div>
          {!editandoSaldo && (
            <button
              type="button"
              onClick={() => setEditandoSaldo(true)}
              className="rounded-full border border-wine-700/25 px-5 py-2 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Ajustar
            </button>
          )}
        </div>

        {editandoSaldo && (
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Data inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Saldo inicial (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0,00"
                className="w-36 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>
            <button
              type="button"
              onClick={handleSalvarSaldo}
              disabled={isPending}
              className="rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
            >
              Salvar
            </button>
          </div>
        )}
      </section>

      {/* ============ ALERTAS ============ */}
      {alertas.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-wine-900">Alertas</h2>
          <div className="mt-4 flex flex-col gap-3">
            {alertas.map((a) => {
              const estilo =
                a.level === "critical"
                  ? "border-red-200 bg-red-50"
                  : a.level === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : "border-green-200 bg-green-50";
              const Icone =
                a.level === "positive" ? CircleCheck : TriangleAlert;
              const corIcone =
                a.level === "critical"
                  ? "text-red-600"
                  : a.level === "warning"
                  ? "text-amber-600"
                  : "text-green-600";

              return (
                <div
                  key={a.title}
                  className={`flex gap-3.5 rounded-2xl border px-5 py-4 ${estilo}`}
                >
                  <Icone size={19} className={`mt-0.5 shrink-0 ${corIcone}`} />
                  <div>
                    <p className="font-sans text-[15px] font-semibold text-ink">
                      {a.title}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-ink-soft">
                      {a.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ ABAS E LANÇAMENTOS ============ */}
      <section>
        <div className="flex flex-wrap gap-2 border-b border-stone-200">
          {ABAS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setAba(key)}
              className={`-mb-px border-b-2 px-5 py-3 font-sans text-sm font-semibold transition-colors ${
                aba === key
                  ? "border-wine-700 text-wine-800"
                  : "border-transparent text-ink-soft hover:text-wine-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-4 font-sans text-sm text-ink-soft">{abaAtual.hint}</p>

        <div className="mt-5 flex flex-wrap gap-4 rounded-2xl bg-stone-100 px-5 py-4">
          <span className="font-sans text-sm text-ink-soft">
            Entradas:{" "}
            <strong className="text-wine-900">{formatBRL(totaisAba.income)}</strong>
          </span>
          <span className="font-sans text-sm text-ink-soft">
            Saídas:{" "}
            <strong className="text-wine-900">{formatBRL(totaisAba.expense)}</strong>
          </span>
          <span className="font-sans text-sm text-ink-soft">
            Resultado:{" "}
            <strong
              className={totaisAba.balance < 0 ? "text-red-700" : "text-wine-900"}
            >
              {formatBRL(totaisAba.balance)}
            </strong>
          </span>
        </div>

        {/* Formulário */}
        <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
          <h3 className="font-display text-lg text-wine-900">
            Novo lançamento em {abaAtual.label}
          </h3>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Tipo
              </label>
              <div className="flex overflow-hidden rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setKind("expense")}
                  className={`px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
                    kind === "expense"
                      ? "bg-wine-700 text-cream"
                      : "bg-cream text-ink-soft hover:bg-wine-100"
                  }`}
                >
                  Saída
                </button>
                <button
                  type="button"
                  onClick={() => setKind("income")}
                  className={`px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
                    kind === "income"
                      ? "bg-wine-700 text-cream"
                      : "bg-cream text-ink-soft hover:bg-wine-100"
                  }`}
                >
                  Entrada
                </button>
              </div>
            </div>

            <div className="min-w-[200px] flex-1">
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Aluguel da sala"
                className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Valor (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-32 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Data
              </label>
              <input
                type="date"
                value={occurredOn}
                onChange={(e) => setOccurredOn(e.target.value)}
                className="rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>

            <button
              type="button"
              onClick={handleAdicionar}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          {erro && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 font-sans text-sm text-red-700">
              {erro}
            </p>
          )}
        </div>

        {/* Lista */}
        <div className="mt-6">
          {lancamentosAba.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-white/60 px-5 py-6 text-center font-sans text-sm text-ink-soft">
              Nenhum lançamento registrado em {abaAtual.label} ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {lancamentosAba.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white/60 px-5 py-3.5"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      t.kind === "income" ? "bg-green-600" : "bg-wine-700"
                    }`}
                  />
                  <span className="flex-1 font-sans text-[15px] text-ink">
                    {t.description}
                  </span>
                  <span className="font-sans text-xs text-ink-soft">
                    {formatDate(t.occurred_on)}
                  </span>
                  <span
                    className={`font-sans text-[15px] font-semibold ${
                      t.kind === "income" ? "text-green-700" : "text-wine-800"
                    }`}
                  >
                    {t.kind === "income" ? "+" : "-"} {formatBRL(Number(t.amount))}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemover(t.id)}
                    disabled={isPending}
                    aria-label="Remover lançamento"
                    className="shrink-0 text-ink-soft/50 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ GRÁFICOS ============ */}
      {transactions.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-wine-900">Panorama</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <GraficoMensal data={serieMensal} />
            <GraficoSaldo data={serieMensal} />
            <GraficoDistribuicao data={distribuicao} />
            <GraficoMaioresGastos data={maioresGastos} />
          </div>
        </section>
      )}

      {/* ============ IA SUGESTIVA ============ */}
      <section className="rounded-[1.5rem] border border-wine-700/20 bg-wine-100/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl text-wine-900">
              <Sparkles size={19} className="text-wine-700" />
              Análise inteligente
            </h2>
            <p className="mt-1.5 max-w-xl font-sans text-sm leading-relaxed text-ink-soft">
              A IA lê seus números e sugere onde economizar e o que priorizar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleIA}
            disabled={carregandoIA}
            className="rounded-full bg-wine-700 px-6 py-3 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
          >
            {carregandoIA ? "Analisando..." : "Gerar sugestões"}
          </button>
        </div>

        {erroIA && (
          <p className="mt-5 flex gap-2.5 rounded-xl bg-white/70 px-4 py-3 font-sans text-sm text-ink-soft">
            <Info size={17} className="mt-0.5 shrink-0 text-wine-700" />
            {erroIA}
          </p>
        )}

        {sugestoes && (
          <div className="mt-6 flex flex-col gap-4">
            {sugestoes.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white/70 px-5 py-4">
                <p className="font-sans text-[15px] font-semibold text-wine-900">
                  {s.title}
                </p>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-soft">
                  {s.text}
                </p>
              </div>
            ))}
            <p className="font-sans text-xs leading-relaxed text-ink-soft">
              Sugestões geradas por IA a partir dos seus lançamentos. Servem como
              apoio à organização e não substituem orientação de um contador ou
              profissional habilitado.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
