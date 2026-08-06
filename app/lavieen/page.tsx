import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Lavieen | Thays Flor",
  description:
    "Tecnologia para uniformizar a textura e o viço da pele, com toque macio e sedoso.",
};

export default function LavieenPage() {
  return (
    <ProcedureDetail
      title="Lavieen"
      tagline="Pele mais uniforme, macia e com viço"
      description="O Lavieen é um tratamento de bioestimulação que trabalha a textura da pele em profundidade, promovendo mais uniformidade, luminosidade e maciez. É indicado para quem busca uma pele com aspecto mais saudável no dia a dia."
      benefits={[
        "Uniformização da textura da pele",
        "Aumento do viço e da luminosidade",
        "Toque mais macio e sedoso",
        "Indicado para diferentes tipos de pele",
      ]}
    />
  );
}
