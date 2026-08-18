# Fase 2: Login administrativo e controle financeiro

## O que mudou

- Login agora é por **usuário e senha** (não email).
- **Autocadastro removido.** Só a administradora cria acessos.
- **Agendamento suspenso.** As rotas `/agendar`, `/agendamento` e `/cadastro`
  redirecionam para a home. Os botões "Agendar Consulta" do site passaram a
  abrir o WhatsApp.
- Após o login, a pessoa cai direto no **controle financeiro** (`/financas`).
- Nova tela de **controle de acessos** (`/admin/usuarios`): criar acesso,
  ativar, desativar e redefinir senha.

## 1. Instalar a dependência dos gráficos

```bash
npm install recharts
```

## 2. Rodar a migração no Supabase

SQL Editor > New query > cole o conteúdo de
`supabase/04_admin_e_financas.sql` > Run.

## 3. Ajustar o seu usuário existente

Seu usuário atual foi criado com email real. Para ele passar a funcionar com
login por usuário, rode no SQL Editor (trocando o email e o username):

```sql
-- 1. define o username e garante o cargo
update public.profiles
  set username = 'thays', role = 'admin', is_active = true
  where id = (select id from auth.users where email = 'seu-email@exemplo.com');

-- 2. converte o email para o padrão interno do login por usuário
update auth.users
  set email = 'thays@tfbeauty.local'
  where email = 'seu-email@exemplo.com';
```

Depois disso, você entra com usuário `thays` e a senha que já usava.

> Alternativa: se preferir não mexer no usuário antigo, faça o passo 1 apenas
> (para conseguir entrar em `/admin/usuarios`) e crie um acesso novo por lá.

## 4. Variáveis de ambiente no Vercel

### Obrigatória: chave de serviço

Criar e redefinir senha de usuários exige privilégio elevado. No Supabase:
**Project Settings > API > service_role secret**. Copie e adicione no Vercel:

```
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

> **Confira se essa variável aponta para o projeto certo.** Você já tinha uma
> `SUPABASE_SERVICE_ROLE_KEY` no Vercel vinda da integração antiga, que
> apontava para o projeto errado. Substitua pelo valor do projeto atual.
>
> Essa chave **nunca** deve ter o prefixo `NEXT_PUBLIC_`. Ela ignora todas as
> regras de segurança do banco e só é usada em código de servidor.

### Opcional: IA sugestiva

Sem essa chave, todo o resto funciona normalmente e os alertas automáticos
continuam aparecendo. Só o botão "Gerar sugestões" fica indisponível.

```
ANTHROPIC_API_KEY=sua-chave-da-anthropic
```

Obtenha em https://console.anthropic.com (a cobrança é por uso, e cada análise
consome poucos centavos).

Depois de adicionar as variáveis, faça um **Redeploy** no Vercel.

## 5. Apagar arquivos que saíram de uso

Estes arquivos referenciam o agendamento e não são mais usados. Deixá-los no
projeto pode quebrar o build:

```bash
git rm -r app/agendar app/cadastro
git rm app/admin/AdminCalendarManager.tsx
git rm app/admin/AppointmentsPanel.tsx
git rm app/admin/FeedbackManager.tsx
git rm app/admin/actions.ts
git rm components/booking/MonthCalendar.tsx
git rm app/esqueci-senha/actions.ts app/esqueci-senha/page.tsx
git rm app/esqueci-senha/verifique-seu-email/page.tsx
git rm app/redefinir-senha/actions.ts app/redefinir-senha/page.tsx
```

> As telas de "esqueci minha senha" saem porque dependiam de email. Agora a
> redefinição é feita pela administradora em `/admin/usuarios`.
>
> Se algum comando reclamar que o arquivo não existe, ignore e siga.

## 6. Como usar o controle financeiro

1. **Ponto de partida:** na primeira visita, informe a data e o saldo de onde
   quer começar a contar. Pode ajustar depois.
2. **Abas:** cada aba (Consultório, Pessoal, Investimentos) tem seus próprios
   lançamentos e totais.
3. **Lançar:** escolha Saída ou Entrada, escreva a descrição, o valor e a data.
   O saldo e os gráficos recalculam sozinhos.
4. **Remover:** ícone de lixeira ao lado de cada lançamento.
5. **Alertas:** aparecem automaticamente conforme os números (saldo negativo,
   gastando mais do que entra, uma despesa concentrando muito do total, etc).
6. **Análise inteligente:** botão que envia um resumo dos números para a IA e
   traz sugestões específicas.

## 7. Estrutura entregue

```
supabase/04_admin_e_financas.sql       migração do banco
lib/supabase/admin.ts                   client com chave de serviço
lib/supabase/middleware.ts              proteção de rotas atualizada
lib/finance/engine.ts                    cálculos e alertas
app/login/                               login por usuário
app/financas/                            painel financeiro
app/admin/page.tsx                       redireciona para /financas
app/admin/usuarios/                      controle de acessos
components/Hero.tsx                       botão vai pro WhatsApp
components/Procedures.tsx                  botão vai pro WhatsApp
components/ProcedureDetail.tsx              botão vai pro WhatsApp
```
