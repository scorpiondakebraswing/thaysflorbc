import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROCEDURES, getProcedureBySlug } from "@/lib/procedures";
import ProcedureDetail from "@/components/ProcedureDetail";

// Gera as páginas de todos os procedimentos no build (mais rápido pro visitante).
export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const procedure = getProcedureBySlug(slug);

  if (!procedure) return { title: "Procedimento não encontrado | Thays Flor" };

  return {
    title: `${procedure.title} | Thays Flor`,
    description: procedure.description,
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const procedure = getProcedureBySlug(slug);

  if (!procedure) notFound();

  return (
    <ProcedureDetail
      title={procedure.title}
      description={procedure.description}
      benefits={procedure.benefits}
      image={procedure.image}
      isNew={procedure.isNew}
      category={procedure.category}
    />
  );
}
