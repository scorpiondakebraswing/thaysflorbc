/**
 * Envia mensagens automáticas via WhatsApp Cloud API (Meta for Developers).
 *
 * IMPORTANTE: fora da janela de 24h de conversa, o WhatsApp só permite enviar
 * mensagens usando "templates" pré-aprovados pela Meta. Não dá pra mandar
 * texto livre direto. Por isso essa função sempre manda um template.
 *
 * Veja SETUP_WHATSAPP.md para como criar os templates e obter as credenciais.
 */

type EnviarTemplateParams = {
  /** Número da pessoa, só dígitos, com DDD (sem +55), ex: "47999998888" */
  whatsapp: string;
  /** Nome exato do template aprovado na Meta Business Manager */
  templateName: string;
  /** Valores que preenchem as variáveis {{1}}, {{2}}... do template, em ordem */
  parametros: string[];
};

export async function enviarTemplateWhatsApp({
  whatsapp,
  templateName,
  parametros,
}: EnviarTemplateParams) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("WhatsApp não configurado: faltam variáveis de ambiente.");
    return { error: "WhatsApp não configurado." };
  }

  const numeroLimpo = whatsapp.replace(/\D/g, "");
  const numeroInternacional = numeroLimpo.startsWith("55")
    ? numeroLimpo
    : `55${numeroLimpo}`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numeroInternacional,
          type: "template",
          template: {
            name: templateName,
            language: { code: "pt_BR" },
            components: [
              {
                type: "body",
                parameters: parametros.map((texto) => ({ type: "text", text: texto })),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const corpoErro = await response.text();
      console.error("Erro ao enviar WhatsApp:", corpoErro);
      return { error: "Falha ao enviar WhatsApp." };
    }

    return { success: true };
  } catch (err) {
    console.error("Erro de rede ao enviar WhatsApp:", err);
    return { error: "Falha ao enviar WhatsApp." };
  }
}
