# Configuração do aviso automático via WhatsApp

O WhatsApp não permite mandar texto livre pra alguém que não te escreveu nas
últimas 24h — é preciso usar **templates de mensagem pré-aprovados pela Meta**.
Por isso tem um pouco mais de configuração aqui do que nas outras partes.

## 1. Criar a conta no WhatsApp Business Platform (Meta)

1. Acesse https://business.facebook.com e crie (ou use) uma conta Business.
2. Vá em https://developers.facebook.com/apps → **Criar App** → tipo
   **Negócios** → adicione o produto **WhatsApp**.
3. Em **WhatsApp → Introdução**, você recebe automaticamente:
   - Um **número de teste** (grátis, mas só manda mensagem pra números que
     você cadastrar como destinatários de teste)
   - O **Phone Number ID** (guarde esse número)
   - Um **token temporário** (válido por 24h — depois você troca por um
     token permanente, veja o passo 4)

> Pra usar seu número real da clínica em vez do número de teste, em
> **WhatsApp → Configuração da API** você adiciona e verifica seu número.

## 2. Criar os 2 templates de mensagem

Em **WhatsApp Manager → Modelos de mensagem → Criar modelo**, crie estes
dois (categoria **Utilidade**, idioma **Português (BR)**):

**Template 1 — `agendamento_aprovado`**
```
Corpo: Olá {{1}}! Seu agendamento na Thays Flor para o dia {{2}} às {{3}} foi CONFIRMADO. Te esperamos! 💐
```

**Template 2 — `agendamento_rejeitado`**
```
Corpo: Olá {{1}}, infelizmente o horário do dia {{2}} às {{3}} não pôde ser confirmado. Entre em contato pra escolher outro horário. 
```

Envie pra aprovação — normalmente leva de alguns minutos a algumas horas
pra Meta aprovar. **Sem aprovação, o envio automático não funciona.**

## 3. Variáveis de ambiente

Adicione no `.env.local` e no Vercel (Project Settings → Environment Variables):

```bash
WHATSAPP_API_TOKEN=seu-token-permanente-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id-aqui
WHATSAPP_TEMPLATE_APROVADO=agendamento_aprovado
WHATSAPP_TEMPLATE_REJEITADO=agendamento_rejeitado
```

> As duas últimas são opcionais — só precisa delas se você nomear os
> templates diferente do que está no passo 2.

## 4. Gerar um token permanente (o de teste expira em 24h)

O token que vem por padrão expira. Pra um token que não expira:
1. **Meta Business Settings → Usuários do sistema** → criar um usuário
   do sistema com papel **Admin**.
2. Atribua a ele o app do WhatsApp criado no passo 1.
3. Gere um token pra esse usuário do sistema, com a permissão
   `whatsapp_business_messaging`.
4. Use esse token na variável `WHATSAPP_API_TOKEN`.

## 5. O que já está pronto no código

- `lib/whatsapp/sendMessage.ts` — função que envia o template
- `app/admin/actions.ts` — já chama essa função automaticamente depois de
  aprovar ou rejeitar um agendamento

Se as variáveis de ambiente não estiverem configuradas, o sistema **não
quebra** — só registra um aviso no log e segue funcionando normalmente
(aprovar/rejeitar continua funcionando mesmo sem o WhatsApp configurado).

## 6. Limitação atual

O WhatsApp da clínica (o número que envia) precisa estar configurado como
número comercial verificado pra sair do modo de teste. Enquanto estiver em
teste, só números cadastrados manualmente em **Destinatários de teste**
vão receber as mensagens — ou seja, pra mandar pra qualquer cliente real,
o número precisa estar totalmente configurado (passo 1, último bloco).
