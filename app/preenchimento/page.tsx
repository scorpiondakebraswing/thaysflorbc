import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Preenchimento | Thays Flor",
  description:
    "Devolve volume e contorno em regiões específicas, respeitando a harmonia facial.",
};

export default function PreenchimentoPage() {
  return (
    <ProcedureDetail
      title="Preenchimento"
      tagline="Volume e contorno onde o rosto pede"
      description="O preenchimento facial devolve volume perdido ou redesenha o contorno de regiões específicas do rosto, como lábios, bochechas e mandíbula. A técnica é sempre guiada pela harmonia natural do rosto, evitando resultados exagerados."
      benefits={[
        "Recuperação de volume em regiões específicas",
        "Melhora do contorno facial",
        "Resultado imediato, com evolução nos dias seguintes",
        "Respeita a harmonia natural do rosto",
      ]}
    />
  );
}
