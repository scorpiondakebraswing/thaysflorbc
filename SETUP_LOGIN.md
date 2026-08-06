# Configuração do sistema de login e agendamento

## 1. Instalar dependências

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Criar o projeto no Supabase

1. Crie uma conta em https://supabase.com e um novo projeto (gratuito).
2. Vá em **SQL Editor** → cole o conteúdo de `supabase/schema.sql` → **Run**.
   Isso cria as 3 tabelas (`profiles`, `availability_slots`, `appointments`),
   o gatilho que cria o perfil automaticamente no cadastro, e as regras de
   segurança (RLS) que impedem um usuário de ver dados de outro.

## 3. Variáveis de ambiente

Em **Project Settings → API** no Supabase, copie a **Project URL** e a
**anon public key**. Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `.env.local` já é ignorado pelo git (confirme se seu `.gitignore` tem essa
> linha — o padrão do Next.js já vem assim).

**No Vercel:** vá em Project Settings → Environment Variables e adicione as
mesmas 3 variáveis, trocando `NEXT_PUBLIC_SITE_URL` pela URL real do site em
produção (ex: `https://thaysflorbc.vercel.app`).

## 4. Configurar URLs de redirecionamento no Supabase

Em **Authentication → URL Configuration**:
- **Site URL**: `https://thaysflorbc.vercel.app` (sua URL de produção)
- **Redirect URLs**: adicione `https://thaysflorbc.vercel.app/auth/callback`
  e, se for testar localmente, `http://localhost:3000/auth/callback`

Isso é necessário pro link de confirmação de e-mail funcionar.

## 5. Criar sua conta de admin

1. Rode o site e cadastre sua própria conta normalmente pela tela `/cadastro`.
2. Confirme o e-mail (clique no link recebido).
3. No Supabase, vá em **SQL Editor** e rode (trocando o e-mail pelo seu):

```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'seu-email@exemplo.com'
);
```

4. Faça login de novo — agora `/admin` vai te reconhecer como administradora.

## 6. Estrutura entregue

```
supabase/schema.sql               → rodar 1x no SQL Editor
lib/supabase/client.ts             → client Supabase (navegador)
lib/supabase/server.ts             → client Supabase (Server Components/Actions)
lib/supabase/middleware.ts         → renova sessão + protege rotas
middleware.ts                       → aciona o helper acima

app/login/                          → tela de login
app/cadastro/                       → tela de cadastro (nome, whatsapp, email, senha)
app/auth/callback/route.ts          → confirma o e-mail e cria a sessão

app/agendamento/                    → painel do cliente (calendário + pedidos)
app/admin/                          → painel admin (cadastrar horários + aprovar pedidos)
components/booking/MonthCalendar.tsx → calendário reutilizado nos dois painéis
```

## 7. O que ainda falta (próximos passos possíveis)

- Notificação automática pro cliente quando o pedido for aprovado/rejeitado
  (hoje ele só vê ao entrar de novo em `/agendamento`) — dá pra fazer por
  e-mail (Supabase) ou WhatsApp (API do WhatsApp Business).
- Página de "esqueci minha senha".
- Cancelamento de agendamento pelo próprio cliente.
