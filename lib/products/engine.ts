/**
 * MOTOR DO MÓDULO DE PRODUTOS
 *
 * Concentra os cálculos de margem, estoque, lucro e divisão entre
 * as duas partes. Fica separado da interface para poder ser conferido
 * sem mexer no visual.
 */

export type Product = {
  id: string;
  name: string;
  purchase_price: number;
  sale_price: number;
  share_thays: number;
  share_david: number;
  is_active: boolean;
};

export type StockEntry = {
  id: string;
  product_id: string;
  quantity: number;
  entry_date: string; // YYYY-MM-DD
  note: string | null;
};

export type ProductSale = {
  id: string;
  product_id: string;
  quantity: number;
  sold_on: string; // YYYY-MM-DD
  note: string | null;
  unit_purchase_price: number;
  unit_sale_price: number;
  share_thays: number;
  share_david: number;
};

export const SOCIOS = { thays: "Thays", david: "David" } as const;

// ============================================================
// FORMATAÇÃO
// ============================================================

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso: string) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function hoje() {
  return new Date().toISOString().slice(0, 10);
}

/** Primeiro dia do mês corrente, usado como início padrão do filtro. */
export function inicioDoMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

// ============================================================
// MARGEM DE LUCRO
// ============================================================

/** Lucro por unidade: diferença entre o que se cobra e o que se pagou. */
export function unitProfit(purchase: number, sale: number) {
  return Number(sale) - Number(purchase);
}

/**
 * Margem sobre o preço de compra. Comprou por 10 e vende por 15,
 * a margem é 50 por cento.
 */
export function profitPercent(purchase: number, sale: number) {
  const compra = Number(purchase);
  if (!compra) return 0;
  return (unitProfit(compra, Number(sale)) / compra) * 100;
}

/** Caminho inverso: a partir da margem desejada, calcula o preço de venda. */
export function salePriceFromPercent(purchase: number, percent: number) {
  return Number(purchase) * (1 + Number(percent) / 100);
}

// ============================================================
// ESTOQUE
// ============================================================

export type StockInfo = {
  entered: number;
  sold: number;
  available: number;
};

export function stockOf(
  productId: string,
  entries: StockEntry[],
  sales: ProductSale[]
): StockInfo {
  const entered = entries
    .filter((e) => e.product_id === productId)
    .reduce((acc, e) => acc + Number(e.quantity), 0);

  const sold = sales
    .filter((s) => s.product_id === productId)
    .reduce((acc, s) => acc + Number(s.quantity), 0);

  return { entered, sold, available: entered - sold };
}

/** Valor total parado em estoque, pelo preço de compra. */
export function stockValue(
  products: Product[],
  entries: StockEntry[],
  sales: ProductSale[]
) {
  return products.reduce((acc, p) => {
    const { available } = stockOf(p.id, entries, sales);
    return acc + Math.max(available, 0) * Number(p.purchase_price);
  }, 0);
}

// ============================================================
// TOTAIS DAS VENDAS
// ============================================================

export type SalesTotals = {
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  thays: number;
  david: number;
};

export function saleRevenue(sale: ProductSale) {
  return Number(sale.unit_sale_price) * Number(sale.quantity);
}

export function saleCost(sale: ProductSale) {
  return Number(sale.unit_purchase_price) * Number(sale.quantity);
}

export function saleProfit(sale: ProductSale) {
  return saleRevenue(sale) - saleCost(sale);
}

/** Parte do lucro de cada sócio, usando os percentuais gravados na venda. */
export function saleSplit(sale: ProductSale) {
  const lucro = saleProfit(sale);
  return {
    thays: (lucro * Number(sale.share_thays)) / 100,
    david: (lucro * Number(sale.share_david)) / 100,
  };
}

export function salesTotals(sales: ProductSale[]): SalesTotals {
  return sales.reduce<SalesTotals>(
    (acc, sale) => {
      const split = saleSplit(sale);
      return {
        quantity: acc.quantity + Number(sale.quantity),
        revenue: acc.revenue + saleRevenue(sale),
        cost: acc.cost + saleCost(sale),
        profit: acc.profit + saleProfit(sale),
        thays: acc.thays + split.thays,
        david: acc.david + split.david,
      };
    },
    { quantity: 0, revenue: 0, cost: 0, profit: 0, thays: 0, david: 0 }
  );
}

/** Filtra as saídas dentro de um intervalo de datas, inclusive nas pontas. */
export function filterByPeriod(
  sales: ProductSale[],
  from: string,
  to: string
): ProductSale[] {
  return sales.filter((s) => {
    if (from && s.sold_on < from) return false;
    if (to && s.sold_on > to) return false;
    return true;
  });
}

// ============================================================
// RANKING POR PRODUTO
// ============================================================

export type ProductPerformance = {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
  profit: number;
};

export function performanceByProduct(
  sales: ProductSale[],
  products: Product[]
): ProductPerformance[] {
  const nomes = new Map(products.map((p) => [p.id, p.name]));
  const mapa = new Map<string, ProductPerformance>();

  for (const sale of sales) {
    const atual = mapa.get(sale.product_id) ?? {
      productId: sale.product_id,
      name: nomes.get(sale.product_id) ?? "Produto removido",
      quantity: 0,
      revenue: 0,
      profit: 0,
    };

    atual.quantity += Number(sale.quantity);
    atual.revenue += saleRevenue(sale);
    atual.profit += saleProfit(sale);
    mapa.set(sale.product_id, atual);
  }

  return Array.from(mapa.values()).sort((a, b) => b.profit - a.profit);
}
