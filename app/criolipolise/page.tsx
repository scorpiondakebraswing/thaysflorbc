import type { Metadata } from "next";
import ProcedureDetail from "@/components/ProcedureDetail";

export const metadata: Metadata = {
  title: "Criolipólise | Thays Flor",
  description:
    "Tratamento para gordura localizada e melhora do contorno corporal, sem cortes ou agulhas.",
};

export default function CriolipoliseePage() {
  return (
    <ProcedureDetail
      title="Criolipólise"
      tagline="Redução de gordura localizada com tecnologia de congelamento"
      description="A criolipólise é um tratamento para gordura localizada e melhora do contorno corporal. Ela atua através do congelamento controlado, que reduz progressivamente as células de gordura na região tratada, sem a necessidade de cirurgia."
      image="https://conexaojunina.com.br/wp-content/uploads/2026/08/WhatsApp-Image-2026-08-05-at-17.56.18.jpeg"
      isNew
      benefits={[
        "Redução da gordura localizada de forma progressiva e natural",
        "Melhora do contorno corporal",
        "Procedimento seguro e não invasivo",
        "Sem cortes, agulhas ou anestesia",
        "Retorno imediato às atividades do dia a dia",
      ]}
    />
  );
}
