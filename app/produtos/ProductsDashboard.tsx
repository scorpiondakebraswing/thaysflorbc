"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X, Package, TrendingUp } from "lucide-react";
import {
  criarProduto,
  atualizarProduto,
  removerProduto,
  registrarEntradaEstoque,
  removerEntradaEstoque,
  registrarSaida,
  atualizarSaida,
  removerSaida,
} from "./actions";
import {
  filterByPeriod,
  formatBRL,
  formatDate,
  hoje,
  inicioDoMes,
  performanceByProduct,
  profitPercent,
  saleProfit,
  saleRevenue,
  salePriceFromPercent,
  salesTotals,
  stockOf,
  stockValue,
  unitProfit,
  type Product,
  type ProductSale,
  type StockEntry,
} from "@/lib/products/engine";

type Secao = "saidas" | "estoque" | "cadastro";

const SECOES: { key: Secao; label: string }[] = [
  { key: "saidas", label: "Saídas" },
  { key: "estoque", label: "Estoque" },
  { key: "cadastro", label: "Produtos" },
];

const inputCls =
  "rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700";
const labelCls = "mb-1.5 block font-sans text-xs font-medium text-ink";
const btnPrimario =
  "inline-flex items-center gap-2 rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60";
const btnSecundario =
  "rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100 disabled:opacity-60";

export default function ProductsDashboard({
  products,
  stockEntries,
  sales,
}: {
  products: Product[];
  stockEntries: StockEntry[];
  sales: ProductSale[];
}) {
  const [secao, setSecao] = useState<Secao>("saidas");
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  // Filtro de período das saídas
  const [de, setDe] = useState(inicioDoMes());
  const [ate, setAte] = useState(hoje());

  const saidasFiltradas = useMemo(
    () => filterByPeriod(sales, de, ate).sort((a, b) => b.sold_on.localeCompare(a.sold_on)),
    [sales, de, ate]
  );
  const totaisPeriodo = useMemo(() => salesTotals(saidasFiltradas), [saidasFiltradas]);
  const totaisGerais = useMemo(() => salesTotals(sales), [sales]);
  const ranking = useMemo(
    () => performanceByProduct(saidasFiltradas, products),
    [saidasFiltradas, products]
  );
  const valorEstoque = useMemo(
    () => stockValue(products, stockEntries, sales),
    [products, stockEntries, sales]
  );
  const nomePorId = useMemo(
    () => new Map(products.map((p) => [p.id, p.name])),
    [products]
  );
  const produtosAtivos = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  function executar(fn: () => Promise<{ error?: string }>, aoConcluir?: () => void) {
    setErro(null);
    startTransition(async () => {
      const r = await fn();
      if (r.error) setErro(r.error);
      else aoConcluir?.();
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* ============ TOTALIZADOR GERAL ============ */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.5rem] bg-wine-900 p-6 text-cream">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cream/60">
            Lucro total acumulado
          </p>
          <p className="mt-2 font-display text-3xl">{formatBRL(totaisGerais.profit)}</p>
          <p className="mt-2 font-sans text-xs text-cream/60">
            {totaisGerais.quantity} unidades vendidas desde o início
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">
            Receita acumulada
          </p>
          <p className="mt-2 font-display text-2xl text-wine-900">
            {formatBRL(totaisGerais.revenue)}
          </p>
          <p className="mt-2 font-sans text-xs text-ink-soft">
            Custo: {formatBRL(totaisGerais.cost)}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">
            Produtos cadastrados
          </p>
          <p className="mt-2 font-display text-2xl text-wine-900">{products.length}</p>
          <p className="mt-2 font-sans text-xs text-ink-soft">
            {formatBRL(valorEstoque)} parados em estoque
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">
            Divisão acumulada
          </p>
          <p className="mt-2 font-sans text-sm text-ink">
            Thays:{" "}
            <strong className="text-wine-900">{formatBRL(totaisGerais.thays)}</strong>
          </p>
          <p className="mt-1 font-sans text-sm text-ink">
            David:{" "}
            <strong className="text-wine-900">{formatBRL(totaisGerais.david)}</strong>
          </p>
        </div>
      </section>

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {erro}
        </p>
      )}

      {/* ============ NAVEGAÇÃO INTERNA ============ */}
      <section>
        <div className="flex flex-wrap gap-2 border-b border-stone-200">
          {SECOES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSecao(key)}
              className={`-mb-px border-b-2 px-5 py-3 font-sans text-sm font-semibold transition-colors ${
                secao === key
                  ? "border-wine-700 text-wine-800"
                  : "border-transparent text-ink-soft hover:text-wine-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {secao === "saidas" && (
            <SecaoSaidas
              products={produtosAtivos}
              sales={saidasFiltradas}
              nomePorId={nomePorId}
              totais={totaisPeriodo}
              ranking={ranking}
              de={de}
              ate={ate}
              setDe={setDe}
              setAte={setAte}
              isPending={isPending}
              executar={executar}
            />
          )}

          {secao === "estoque" && (
            <SecaoEstoque
              products={produtosAtivos}
              entries={stockEntries}
              sales={sales}
              nomePorId={nomePorId}
              isPending={isPending}
              executar={executar}
            />
          )}

          {secao === "cadastro" && (
            <SecaoCadastro
              products={produtosAtivos}
              isPending={isPending}
              executar={executar}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// SEÇÃO: SAÍDAS
// ============================================================

function SecaoSaidas({
  products,
  sales,
  nomePorId,
  totais,
  ranking,
  de,
  ate,
  setDe,
  setAte,
  isPending,
  executar,
}: {
  products: Product[];
  sales: ProductSale[];
  nomePorId: Map<string, string>;
  totais: ReturnType<typeof salesTotals>;
  ranking: ReturnType<typeof performanceByProduct>;
  de: string;
  ate: string;
  setDe: (v: string) => void;
  setAte: (v: string) => void;
  isPending: boolean;
  executar: (fn: () => Promise<{ error?: string }>, aoConcluir?: () => void) => void;
}) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [soldOn, setSoldOn] = useState(hoje());
  const [note, setNote] = useState("");

  const [editando, setEditando] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editSoldOn, setEditSoldOn] = useState("");
  const [editNote, setEditNote] = useState("");

  function iniciarEdicao(sale: ProductSale) {
    setEditando(sale.id);
    setEditQuantity(String(sale.quantity));
    setEditSoldOn(sale.sold_on);
    setEditNote(sale.note ?? "");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Registrar saída */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">Registrar saída</h3>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className={labelCls}>Produto</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={`${inputCls} w-full`}
            >
              <option value="">Selecione...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Quantidade</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`${inputCls} w-28`}
            />
          </div>

          <div>
            <label className={labelCls}>Data</label>
            <input
              type="date"
              value={soldOn}
              onChange={(e) => setSoldOn(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="min-w-[180px] flex-1">
            <label className={labelCls}>Observação (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anotação sobre esta saída"
              className={`${inputCls} w-full`}
            />
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              executar(
                () =>
                  registrarSaida({
                    productId,
                    quantity: Number(quantity),
                    soldOn,
                    note,
                  }),
                () => {
                  setQuantity("1");
                  setNote("");
                }
              )
            }
            className={btnPrimario}
          >
            <Plus size={16} />
            Registrar
          </button>
        </div>
      </div>

      {/* Filtro de período */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">Filtrar por período</h3>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className={labelCls}>De</label>
            <input
              type="date"
              value={de}
              onChange={(e) => setDe(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Até</label>
            <input
              type="date"
              value={ate}
              onChange={(e) => setAte(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setDe(inicioDoMes());
              setAte(hoje());
            }}
            className={btnSecundario}
          >
            Mês atual
          </button>
        </div>
      </div>

      {/* Totalizador do período */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-stone-200 bg-stone-100 p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-wine-700">
            Unidades
          </p>
          <p className="mt-1.5 font-display text-2xl text-wine-900">
            {totais.quantity}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-100 p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-wine-700">
            Receita
          </p>
          <p className="mt-1.5 font-display text-2xl text-wine-900">
            {formatBRL(totais.revenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-100 p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-wine-700">
            Lucro
          </p>
          <p className="mt-1.5 font-display text-2xl text-wine-900">
            {formatBRL(totais.profit)}
          </p>
        </div>
        <div className="rounded-2xl border border-wine-700/25 bg-wine-100/50 p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-wine-700">
            Thays
          </p>
          <p className="mt-1.5 font-display text-2xl text-wine-900">
            {formatBRL(totais.thays)}
          </p>
        </div>
        <div className="rounded-2xl border border-wine-700/25 bg-wine-100/50 p-5">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-wine-700">
            David
          </p>
          <p className="mt-1.5 font-display text-2xl text-wine-900">
            {formatBRL(totais.david)}
          </p>
        </div>
      </div>

      {/* Histórico */}
      <div>
        <h3 className="font-display text-lg text-wine-900">
          Histórico de saídas ({sales.length})
        </h3>

        {sales.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-stone-200 bg-white/60 px-5 py-6 text-center font-sans text-sm text-ink-soft">
            Nenhuma saída registrada neste período.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-2xl border border-stone-200 bg-white/60 px-5 py-4"
              >
                {editando === sale.id ? (
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className={labelCls}>Quantidade</label>
                      <input
                        type="number"
                        min={1}
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        className={`${inputCls} w-24`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Data</label>
                      <input
                        type="date"
                        value={editSoldOn}
                        onChange={(e) => setEditSoldOn(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="min-w-[160px] flex-1">
                      <label className={labelCls}>Observação</label>
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className={`${inputCls} w-full`}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        executar(
                          () =>
                            atualizarSaida(sale.id, {
                              quantity: Number(editQuantity),
                              soldOn: editSoldOn,
                              note: editNote,
                            }),
                          () => setEditando(null)
                        )
                      }
                      className={btnPrimario}
                    >
                      <Check size={15} />
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditando(null)}
                      className={btnSecundario}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="min-w-[140px] flex-1 font-sans text-[15px] font-semibold text-ink">
                      {nomePorId.get(sale.product_id) ?? "Produto removido"}
                    </span>
                    <span className="font-sans text-sm text-ink-soft">
                      {sale.quantity} un
                    </span>
                    <span className="font-sans text-xs text-ink-soft">
                      {formatDate(sale.sold_on)}
                    </span>
                    <span className="font-sans text-sm text-ink-soft">
                      Receita{" "}
                      <strong className="text-wine-900">
                        {formatBRL(saleRevenue(sale))}
                      </strong>
                    </span>
                    <span className="font-sans text-sm text-ink-soft">
                      Lucro{" "}
                      <strong className="text-wine-900">
                        {formatBRL(saleProfit(sale))}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(sale)}
                      aria-label="Editar saída"
                      className="text-ink-soft/60 transition-colors hover:text-wine-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => executar(() => removerSaida(sale.id))}
                      aria-label="Remover saída"
                      className="text-ink-soft/60 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}

                {sale.note && editando !== sale.id && (
                  <p className="mt-2 font-sans text-xs italic text-ink-soft">
                    {sale.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ranking do período */}
      {ranking.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg text-wine-900">
            <TrendingUp size={18} className="text-wine-700" />
            Produtos que mais deram lucro no período
          </h3>
          <div className="mt-4 flex flex-col gap-2">
            {ranking.map((item) => (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-stone-200 px-5 py-3"
              >
                <span className="min-w-[140px] flex-1 font-sans text-sm font-semibold text-ink">
                  {item.name}
                </span>
                <span className="font-sans text-sm text-ink-soft">
                  {item.quantity} un
                </span>
                <span className="font-sans text-sm text-ink-soft">
                  Receita {formatBRL(item.revenue)}
                </span>
                <span className="font-sans text-sm font-semibold text-wine-800">
                  Lucro {formatBRL(item.profit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SEÇÃO: ESTOQUE
// ============================================================

function SecaoEstoque({
  products,
  entries,
  sales,
  nomePorId,
  isPending,
  executar,
}: {
  products: Product[];
  entries: StockEntry[];
  sales: ProductSale[];
  nomePorId: Map<string, string>;
  isPending: boolean;
  executar: (fn: () => Promise<{ error?: string }>, aoConcluir?: () => void) => void;
}) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [entryDate, setEntryDate] = useState(hoje());
  const [note, setNote] = useState("");

  const historico = useMemo(
    () => [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date)),
    [entries]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Registrar entrada */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">Entrada de estoque</h3>
        <p className="mt-1 font-sans text-sm text-ink-soft">
          Registre cada reposição. O estoque disponível é calculado como as
          entradas menos as saídas já registradas.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className={labelCls}>Produto</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={`${inputCls} w-full`}
            >
              <option value="">Selecione...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Quantidade</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`${inputCls} w-28`}
            />
          </div>

          <div>
            <label className={labelCls}>Data</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="min-w-[160px] flex-1">
            <label className={labelCls}>Observação (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              executar(
                () =>
                  registrarEntradaEstoque({
                    productId,
                    quantity: Number(quantity),
                    entryDate,
                    note,
                  }),
                () => {
                  setQuantity("1");
                  setNote("");
                }
              )
            }
            className={btnPrimario}
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Estoque atual */}
      <div>
        <h3 className="flex items-center gap-2 font-display text-lg text-wine-900">
          <Package size={18} className="text-wine-700" />
          Estoque atual
        </h3>

        {products.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-stone-200 bg-white/60 px-5 py-6 text-center font-sans text-sm text-ink-soft">
            Cadastre produtos na aba Produtos para controlar o estoque.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {products.map((p) => {
              const info = stockOf(p.id, entries, sales);
              const zerado = info.available <= 0;
              const baixo = info.available > 0 && info.available <= 3;

              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl border border-stone-200 bg-white/60 px-5 py-4"
                >
                  <span className="min-w-[140px] flex-1 font-sans text-[15px] font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="font-sans text-xs text-ink-soft">
                    Entrou {info.entered} · Saiu {info.sold}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                      zerado
                        ? "bg-red-50 text-red-700"
                        : baixo
                        ? "bg-amber-50 text-amber-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {info.available} em estoque
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico de entradas */}
      {historico.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-wine-900">
            Histórico de entradas
          </h3>
          <div className="mt-4 flex flex-col gap-2">
            {historico.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-stone-200 px-5 py-3"
              >
                <span className="min-w-[140px] flex-1 font-sans text-sm text-ink">
                  {nomePorId.get(e.product_id) ?? "Produto removido"}
                </span>
                <span className="font-sans text-sm text-ink-soft">
                  + {e.quantity} un
                </span>
                <span className="font-sans text-xs text-ink-soft">
                  {formatDate(e.entry_date)}
                </span>
                {e.note && (
                  <span className="font-sans text-xs italic text-ink-soft">
                    {e.note}
                  </span>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => executar(() => removerEntradaEstoque(e.id))}
                  aria-label="Remover entrada"
                  className="text-ink-soft/60 transition-colors hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SEÇÃO: CADASTRO DE PRODUTOS
// ============================================================

function SecaoCadastro({
  products,
  isPending,
  executar,
}: {
  products: Product[];
  isPending: boolean;
  executar: (fn: () => Promise<{ error?: string }>, aoConcluir?: () => void) => void;
}) {
  const [name, setName] = useState("");
  const [purchase, setPurchase] = useState("");
  const [sale, setSale] = useState("");
  const [shareThays, setShareThays] = useState("50");
  const [editando, setEditando] = useState<string | null>(null);

  const compraNum = Number(purchase.replace(",", ".")) || 0;
  const vendaNum = Number(sale.replace(",", ".")) || 0;
  const margem = profitPercent(compraNum, vendaNum);
  const thaysNum = Number(shareThays) || 0;
  const davidNum = 100 - thaysNum;

  function limpar() {
    setName("");
    setPurchase("");
    setSale("");
    setShareThays("50");
    setEditando(null);
  }

  function iniciarEdicao(p: Product) {
    setEditando(p.id);
    setName(p.name);
    setPurchase(String(p.purchase_price));
    setSale(String(p.sale_price));
    setShareThays(String(p.share_thays));
  }

  function salvar() {
    const payload = {
      name,
      purchasePrice: compraNum,
      salePrice: vendaNum,
      shareThays: thaysNum,
      shareDavid: davidNum,
    };

    executar(
      () => (editando ? atualizarProduto(editando, payload) : criarProduto(payload)),
      limpar
    );
  }

  /** Ao digitar a margem, recalcula o preço de venda. */
  function aplicarMargem(percent: string) {
    const p = Number(percent.replace(",", "."));
    if (!Number.isNaN(p) && compraNum > 0) {
      setSale(salePriceFromPercent(compraNum, p).toFixed(2));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">
          {editando ? "Editar produto" : "Novo produto"}
        </h3>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className={labelCls}>Nome do produto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="SÉRUM FACIAL"
              className={`${inputCls} w-full uppercase`}
            />
          </div>

          <div>
            <label className={labelCls}>Valor de compra (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={purchase}
              onChange={(e) => setPurchase(e.target.value)}
              placeholder="0,00"
              className={`${inputCls} w-32`}
            />
          </div>

          <div>
            <label className={labelCls}>Valor de venda (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={sale}
              onChange={(e) => setSale(e.target.value)}
              placeholder="0,00"
              className={`${inputCls} w-32`}
            />
          </div>

          <div>
            <label className={labelCls}>Margem de lucro (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={compraNum > 0 ? margem.toFixed(1) : ""}
              onChange={(e) => aplicarMargem(e.target.value)}
              placeholder="0"
              className={`${inputCls} w-28`}
            />
          </div>
        </div>

        {compraNum > 0 && vendaNum > 0 && (
          <p className="mt-4 rounded-xl bg-wine-100/50 px-4 py-3 font-sans text-sm text-wine-800">
            Lucro de <strong>{formatBRL(unitProfit(compraNum, vendaNum))}</strong> por
            unidade, uma margem de <strong>{margem.toFixed(1)}%</strong> sobre o valor
            de compra.
          </p>
        )}

        <div className="mt-5 border-t border-stone-200 pt-5">
          <label className={labelCls}>Divisão do lucro</label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-ink">Thays</span>
              <input
                type="number"
                min={0}
                max={100}
                value={shareThays}
                onChange={(e) => setShareThays(e.target.value)}
                className={`${inputCls} w-24`}
              />
              <span className="font-sans text-sm text-ink-soft">%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-ink">David</span>
              <span className="rounded-xl bg-stone-100 px-4 py-2.5 font-sans text-sm font-semibold text-ink">
                {davidNum}%
              </span>
            </div>
            <span className="font-sans text-xs text-ink-soft">
              O percentual do David é ajustado automaticamente para somar 100%.
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={salvar}
            className={btnPrimario}
          >
            <Plus size={16} />
            {editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>
          {editando && (
            <button type="button" onClick={limpar} className={btnSecundario}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de produtos */}
      <div>
        <h3 className="font-display text-lg text-wine-900">
          Produtos cadastrados ({products.length})
        </h3>

        {products.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-stone-200 bg-white/60 px-5 py-6 text-center font-sans text-sm text-ink-soft">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl border border-stone-200 bg-white/60 px-5 py-4"
              >
                <span className="min-w-[140px] flex-1 font-sans text-[15px] font-semibold text-ink">
                  {p.name}
                </span>
                <span className="font-sans text-sm text-ink-soft">
                  Compra {formatBRL(Number(p.purchase_price))}
                </span>
                <span className="font-sans text-sm text-ink-soft">
                  Venda {formatBRL(Number(p.sale_price))}
                </span>
                <span className="rounded-full bg-wine-100 px-3 py-1 font-sans text-xs font-semibold text-wine-700">
                  {profitPercent(Number(p.purchase_price), Number(p.sale_price)).toFixed(0)}% de margem
                </span>
                <span className="font-sans text-xs text-ink-soft">
                  Thays {Number(p.share_thays)}% · David {Number(p.share_david)}%
                </span>
                <button
                  type="button"
                  onClick={() => iniciarEdicao(p)}
                  aria-label="Editar produto"
                  className="text-ink-soft/60 transition-colors hover:text-wine-700"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => executar(() => removerProduto(p.id))}
                  aria-label="Remover produto"
                  className="text-ink-soft/60 transition-colors hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
