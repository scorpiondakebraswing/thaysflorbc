import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Botox | Thays Flor",
  description:
    "Suavização de linhas de expressão com resultado natural e efeito rejuvenescedor.",
};

export default function BotoxPage() {
  return (
    <ProcedureDetail
      title="Botox"
      tagline="Suavize linhas de expressão sem perder a naturalidade"
      description="A toxina botulínica é aplicada de forma pontual para suavizar linhas de expressão, especialmente na região da testa, entre as sobrancelhas e ao redor dos olhos. O objetivo é sempre um resultado natural, que rejuvenesce sem congelar a expressão do rosto."
      benefits={[
        "Suavização de linhas de expressão",
        "Efeito rejuvenescedor natural",
        "Procedimento rápido, com pouco ou nenhum tempo de recuperação",
        "Resultados perceptíveis já nos primeiros dias",
      ]}
    />
  );
}
