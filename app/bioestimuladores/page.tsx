import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Bioestimuladores | Thays Flor",
  description:
    "Estímulo de colágeno para firmeza e qualidade de pele a médio e longo prazo.",
};

export default function BioestimuladoresPage() {
  return (
    <ProcedureDetail
      title="Bioestimuladores"
      tagline="Firmeza e qualidade de pele que se constroem com o tempo"
      description="Os bioestimuladores de colágeno atuam estimulando a própria pele a produzir mais colágeno ao longo do tempo, resultando em mais firmeza, elasticidade e qualidade de pele a médio e longo prazo. É um tratamento indicado para quem busca resultados graduais e duradouros."
      benefits={[
        "Estímulo à produção natural de colágeno",
        "Mais firmeza e elasticidade da pele",
        "Resultados graduais e duradouros",
        "Indicado como parte de um plano de cuidado contínuo",
      ]}
    />
  );
}
