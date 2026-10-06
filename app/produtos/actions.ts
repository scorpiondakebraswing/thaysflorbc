"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

const SESSAO_EXPIRADA = "Sessão expirada. Entre novamente.";

// ============================================================
// PRODUTOS
// ============================================================

export async function criarProduto(data: {
  name: string;
  purchasePrice: number;
  salePrice: number;
  shareThays: number;
  shareDavid: number;
}) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  const name = data.name.trim().toUpperCase();

  if (!name) return { error: "Informe o nome do produto." };
  if (Number.isNaN(data.purchasePrice) || data.purchasePrice < 0) {
    return { error: "Informe um valor de compra válido." };
  }
  if (Number.isNaN(data.salePrice) || data.salePrice < 0) {
    return { error: "Informe um valor de venda válido." };
  }
  if (Math.round(data.shareThays + data.shareDavid) !== 100) {
    return { error: "A divisão do lucro precisa somar 100%." };
  }

  const { error } = await supabase.from("products").insert({
    name,
    purchase_price: data.purchasePrice,
    sale_price: data.salePrice,
    share_thays: data.shareThays,
    share_david: data.shareDavid,
    created_by: user.id,
  });

  if (error) {
    const duplicado = error.message.toLowerCase().includes("duplicate");
    return { error: duplicado ? "Já existe um produto com esse nome." : error.message };
  }

  revalidatePath("/produtos");
  return { success: true };
}

export async function atualizarProduto(
  id: string,
  data: {
    name: string;
    purchasePrice: number;
    salePrice: number;
    shareThays: number;
    shareDavid: number;
  }
) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  const name = data.name.trim().toUpperCase();
  if (!name) return { error: "Informe o nome do produto." };
  if (Math.round(data.shareThays + data.shareDavid) !== 100) {
    return { error: "A divisão do lucro precisa somar 100%." };
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      purchase_price: data.purchasePrice,
      sale_price: data.salePrice,
      share_thays: data.shareThays,
      share_david: data.shareDavid,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}

export async function removerProduto(id: string) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    // O banco bloqueia a exclusão se houver saídas registradas,
    // para não apagar o histórico de vendas junto.
    return {
      error:
        "Não é possível remover: este produto já tem saídas registradas. Edite-o ou mantenha para preservar o histórico.",
    };
  }

  revalidatePath("/produtos");
  return { success: true };
}

// ============================================================
// ESTOQUE
// ============================================================

export async function registrarEntradaEstoque(data: {
  productId: string;
  quantity: number;
  entryDate: string;
  note: string;
}) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  if (!data.productId) return { error: "Selecione um produto." };
  if (!data.quantity || data.quantity <= 0) {
    return { error: "Informe uma quantidade maior que zero." };
  }
  if (!data.entryDate) return { error: "Informe a data da entrada." };

  const { error } = await supabase.from("stock_entries").insert({
    product_id: data.productId,
    quantity: Math.trunc(data.quantity),
    entry_date: data.entryDate,
    note: data.note.trim() || null,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}

export async function removerEntradaEstoque(id: string) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  const { error } = await supabase.from("stock_entries").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}

// ============================================================
// SAÍDAS DE PRODUTOS
// ============================================================

export async function registrarSaida(data: {
  productId: string;
  quantity: number;
  soldOn: string;
  note: string;
}) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  if (!data.productId) return { error: "Selecione um produto." };
  if (!data.quantity || data.quantity <= 0) {
    return { error: "Informe uma quantidade maior que zero." };
  }
  if (!data.soldOn) return { error: "Informe a data da saída." };

  // Busca os preços atuais do produto para congelar no registro.
  // Assim, alterar o preço depois não distorce o histórico.
  const { data: produto, error: erroProduto } = await supabase
    .from("products")
    .select("purchase_price, sale_price, share_thays, share_david")
    .eq("id", data.productId)
    .single();

  if (erroProduto || !produto) return { error: "Produto não encontrado." };

  const { error } = await supabase.from("product_sales").insert({
    product_id: data.productId,
    quantity: Math.trunc(data.quantity),
    sold_on: data.soldOn,
    note: data.note.trim() || null,
    unit_purchase_price: produto.purchase_price,
    unit_sale_price: produto.sale_price,
    share_thays: produto.share_thays,
    share_david: produto.share_david,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}

export async function atualizarSaida(
  id: string,
  data: { quantity: number; soldOn: string; note: string }
) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  if (!data.quantity || data.quantity <= 0) {
    return { error: "Informe uma quantidade maior que zero." };
  }
  if (!data.soldOn) return { error: "Informe a data da saída." };

  const { error } = await supabase
    .from("product_sales")
    .update({
      quantity: Math.trunc(data.quantity),
      sold_on: data.soldOn,
      note: data.note.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}

export async function removerSaida(id: string) {
  const { supabase, user } = await exigirAdmin();
  if (!user) return { error: SESSAO_EXPIRADA };

  const { error } = await supabase.from("product_sales").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { success: true };
}
