import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rotas que exigem estar logado como admin ativo. */
const ROTAS_PROTEGIDAS = ["/financas", "/admin"];

/** Rotas desativadas nesta fase do projeto. */
const ROTAS_SUSPENSAS = ["/agendar", "/agendamento", "/cadastro"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const path = request.nextUrl.pathname;

  // Agendamento e autocadastro estão suspensos: manda para a home.
  if (ROTAS_SUSPENSAS.some((rota) => path.startsWith(rota))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ehProtegida = ROTAS_PROTEGIDAS.some((rota) => path.startsWith(rota));

  if (!ehProtegida) return supabaseResponse;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  // Sem cargo de admin ou com acesso desativado: encerra a sessão.
  if (profile?.role !== "admin" || !profile?.is_active) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("erro", "Acesso não autorizado.");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
