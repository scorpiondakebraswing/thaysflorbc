"use client";

import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  formatBRL,
  CLASSIFICATION_COLOR,
  type BreakdownSlice,
  type ClassificationSlice,
  type MonthlyPoint,
} from "@/lib/finance/engine";

const CORES = ["#6E2439", "#B06880", "#93435F", "#833051"];

function CardGrafico({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-stone-200 bg-white/60 p-6 ${className}`}
    >
      <h3 className="font-display text-lg text-wine-900">{title}</h3>
      {hint && <p className="mt-1 font-sans text-xs text-ink-soft">{hint}</p>}
      <div className="mt-5 h-72">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E9E4DF",
  fontFamily: "var(--font-sans)",
  fontSize: 13,
};

const legendStyle = { fontSize: 13, fontFamily: "var(--font-sans)" };

const eixoY = {
  tick: { fontSize: 12, fill: "#5C4F49" },
  tickFormatter: (v: number) =>
    Math.abs(Number(v)) >= 1000
      ? `${(Number(v) / 1000).toFixed(0)}k`
      : String(v),
};

/**
 * Gráfico principal do controle mensal: barras de entradas e saídas
 * por competência, com a linha do resultado sobreposta.
 */
export function GraficoCompetencias({ data }: { data: MonthlyPoint[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Entradas e saídas por competência"
      hint="Cada barra é um mês fechado. A linha mostra o resultado: acima de zero sobrou, abaixo faltou."
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5C4F49" }} />
          <YAxis {...eixoY} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => formatBRL(Number(v))}
          />
          <Legend wrapperStyle={legendStyle} />
          <ReferenceLine y={0} stroke="#5C4F49" strokeWidth={1} />
          <Bar dataKey="income" name="Entradas" fill="#6E2439" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Saídas" fill="#B06880" radius={[6, 6, 0, 0]} />
          <Line
            type="monotone"
            dataKey="result"
            name="Resultado do mês"
            stroke="#D4A05A"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#D4A05A" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

/** Rosca com a divisão dos gastos entre necessário, útil e fútil. */
export function GraficoClassificacao({
  data,
  titulo = "Necessário, útil ou fútil",
  hint = "Divisão das saídas do mês. Quanto maior a fatia dourada, mais dinheiro foi para gastos dispensáveis.",
}: {
  data: ClassificationSlice[];
  titulo?: string;
  hint?: string;
}) {
  if (data.length === 0) return null;

  return (
    <CardGrafico title={titulo} hint={hint}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((slice) => (
              <Cell key={slice.key} fill={CLASSIFICATION_COLOR[slice.key]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number, _n, item) => [
              `${formatBRL(Number(v))} (${Number(
                (item?.payload as ClassificationSlice)?.share ?? 0
              ).toFixed(0)}%)`,
              (item?.payload as ClassificationSlice)?.name ?? "",
            ]}
          />
          <Legend wrapperStyle={legendStyle} />
        </PieChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

/** Evolução mês a mês dos gastos por classificação, empilhados. */
export function GraficoClassificacaoMensal({ data }: { data: MonthlyPoint[] }) {
  if (data.length < 2) return null;

  return (
    <CardGrafico
      title="Evolução dos gastos por tipo"
      hint="Se a faixa dourada cresce mês a mês, os gastos dispensáveis estão avançando."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5C4F49" }} />
          <YAxis {...eixoY} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => formatBRL(Number(v))}
          />
          <Legend wrapperStyle={legendStyle} />
          <Bar
            dataKey="necessario"
            name="Necessário"
            stackId="c"
            fill={CLASSIFICATION_COLOR.necessario}
          />
          <Bar
            dataKey="util"
            name="Útil"
            stackId="c"
            fill={CLASSIFICATION_COLOR.util}
          />
          <Bar
            dataKey="futil"
            name="Fútil"
            stackId="c"
            fill={CLASSIFICATION_COLOR.futil}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

/** Linha do saldo acumulado ao longo das competências. */
export function GraficoSaldo({ data }: { data: MonthlyPoint[] }) {
  if (data.length < 2) return null;

  return (
    <CardGrafico
      title="Evolução do saldo"
      hint="Saldo acumulado ao fim de cada mês. Linha descendo significa dinheiro saindo mais rápido do que entra."
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5C4F49" }} />
          <YAxis {...eixoY} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => formatBRL(Number(v))}
          />
          <ReferenceLine y={0} stroke="#5C4F49" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="balance"
            name="Saldo acumulado"
            stroke="#6E2439"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#6E2439" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export function GraficoDistribuicao({ data }: { data: BreakdownSlice[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Para onde vai o dinheiro"
      hint="Divisão das saídas entre consultório, pessoal e investimentos."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => formatBRL(Number(v))}
          />
          <Legend wrapperStyle={legendStyle} />
        </PieChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export function GraficoMaioresGastos({ data }: { data: BreakdownSlice[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Maiores gastos do mês"
      hint="Somados por descrição. Itens no topo são os melhores candidatos a corte."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" horizontal={false} />
          <XAxis type="number" {...eixoY} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12, fill: "#5C4F49" }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => formatBRL(Number(v))}
          />
          <Bar dataKey="value" name="Total" fill="#93435F" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}
