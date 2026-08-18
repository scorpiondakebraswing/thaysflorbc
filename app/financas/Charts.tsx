"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  formatBRL,
  type BreakdownSlice,
  type MonthlyPoint,
} from "@/lib/finance/engine";

const CORES = ["#6E2439", "#B06880", "#93435F", "#833051", "#F1E4DA"];

function CardGrafico({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
      <h3 className="font-display text-lg text-wine-900">{title}</h3>
      {hint && (
        <p className="mt-1 font-sans text-xs text-ink-soft">{hint}</p>
      )}
      <div className="mt-5 h-64">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E9E4DF",
  fontFamily: "var(--font-sans)",
  fontSize: 13,
};

export function GraficoMensal({ data }: { data: MonthlyPoint[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Entradas e saídas por mês"
      hint="Compare quanto entrou e quanto saiu em cada mês."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5C4F49" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#5C4F49" }}
            tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: any) => formatBRL(Number(v || 0))}
          />
          <Legend wrapperStyle={{ fontSize: 13, fontFamily: "var(--font-sans)" }} />
          <Bar dataKey="income" name="Entradas" fill="#6E2439" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Saídas" fill="#B06880" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export function GraficoSaldo({ data }: { data: MonthlyPoint[] }) {
  if (data.length < 2) return null;

  return (
    <CardGrafico
      title="Evolução do saldo"
      hint="Se a linha desce mês após mês, o dinheiro está saindo mais rápido do que entra."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5C4F49" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#5C4F49" }}
            tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: any) => formatBRL(Number(v || 0))}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Saldo acumulado"
            stroke="#6E2439"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#6E2439" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export function GraficoDistribuicao({ data }: { data: BreakdownSlice[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Para onde vai o dinheiro"
      hint="Divisão do total de saídas entre consultório, pessoal e investimentos."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: any) => formatBRL(Number(v || 0))}
          />
          <Legend wrapperStyle={{ fontSize: 13, fontFamily: "var(--font-sans)" }} />
        </PieChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}

export function GraficoMaioresGastos({ data }: { data: BreakdownSlice[] }) {
  if (data.length === 0) return null;

  return (
    <CardGrafico
      title="Maiores gastos"
      hint="Somados por descrição. Itens no topo são os melhores candidatos a corte."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E4DF" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#5C4F49" }}
            tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12, fill: "#5C4F49" }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: any) => formatBRL(Number(v || 0))}
          />
          <Bar dataKey="value" name="Total" fill="#93435F" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardGrafico>
  );
}