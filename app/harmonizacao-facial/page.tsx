import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Harmonização Facial | Thays Flor",
  description:
    "Equilíbrio entre as proporções do rosto, valorizando traços naturais com técnica refinada.",
};

export default function HarmonizacaoFacialPage() {
  return (
    <ProcedureDetail
      title="Harmonização Facial"
      tagline="Equilíbrio e proporção, respeitando a sua identidade"
      description="A harmonização facial reúne um conjunto de técnicas pensadas para equilibrar as proporções do rosto, suavizar assimetrias e realçar os traços que já fazem parte de você. Cada plano é desenhado de forma individual, a partir de uma avaliação detalhada do rosto e dos objetivos de cada pessoa."
      benefits={[
        "Resultados naturais, sem perder a expressão do rosto",
        "Plano de tratamento individualizado",
        "Melhora do equilíbrio entre as proporções faciais",
        "Técnicas minimamente invasivas",
      ]}
    />
  );
}
