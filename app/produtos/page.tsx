import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import ProductsDashboard from "./ProductsDashboard";
import type { Product, ProductSale, StockEntry } from "@/lib/products/engine";

export const metadata: Metadata = {
  title: "Produtos | TF Beauty Clinic",
};

export default async function ProdutosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, role, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" || !profile?.is_active) redirect("/login");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, purchase_price, sale_price, share_thays, share_david, is_active")
    .order("name");

  const { data: stockEntries } = await supabase
    .from("stock_entries")
    .select("id, product_id, quantity, entry_date, note")
    .order("entry_date", { ascending: false });

  const { data: sales } = await supabase
    .from("product_sales")
    .select(
      "id, product_id, quantity, sold_on, note, unit_purchase_price, unit_sale_price, share_thays, share_david"
    )
    .order("sold_on", { ascending: false });

  return (
    <main className="min-h-screen bg-cream px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
              Controle de Produtos
            </p>
            <h1 className="mt-1 font-display text-3xl text-wine-900">
              Produtos e vendas
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/financas"
              className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Finanças
            </Link>
            <Link
              href="/admin/usuarios"
              className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
            >
              Usuários
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-wine-700/25 px-5 py-2.5 font-sans text-sm font-medium text-wine-800 hover:bg-wine-100"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <ProductsDashboard
            products={(products ?? []) as Product[]}
            stockEntries={(stockEntries ?? []) as StockEntry[]}
            sales={(sales ?? []) as ProductSale[]}
          />
        </div>
      </div>
    </main>
  );
}
