/**
 * FONTE ÚNICA DE VERDADE DOS PROCEDIMENTOS.
 *
 * Para editar textos, adicionar ou remover um procedimento, mexa só neste
 * arquivo. A Homepage e as páginas de detalhe leem tudo daqui automaticamente.
 *
 * Campos:
 *  slug        vira a URL da página (ex: "botox" -> /procedimentos/botox)
 *  category    "facial" ou "corporal" (agrupa os cards na Homepage)
 *  title       nome exibido
 *  description texto curto, aparece no card da Homepage e no topo da página
 *  benefits    lista opcional de bullets, aparece só na página de detalhe
 *  image       URL opcional; sem imagem, o card mostra um ícone
 *  isNew       true coloca o selo "Novidade" no card e na página
 */

export type ProcedureCategory = "facial" | "corporal";

export type Procedure = {
  slug: string;
  category: ProcedureCategory;
  title: string;
  description: string;
  benefits?: string[];
  image?: string;
  isNew?: boolean;
};

export const PROCEDURES: Procedure[] = [
  // ===================== FACIAIS =====================
  {
    slug: "limpeza-de-pele",
    category: "facial",
    title: "Limpeza de Pele",
    description:
      "Higienização profunda que remove impurezas e promove uma pele mais limpa, equilibrada e luminosa.",
  },
  {
    slug: "peeling-quimico",
    category: "facial",
    title: "Peeling Químico",
    description:
      "Renovação da pele que melhora textura, uniformidade e luminosidade, de acordo com as necessidades de cada pele.",
  },
  {
    slug: "microagulhamento",
    category: "facial",
    title: "Microagulhamento",
    description:
      "Estímulo à renovação e à produção de colágeno para melhorar textura, marcas e qualidade da pele.",
  },
  {
    slug: "botox",
    category: "facial",
    title: "Botox",
    description:
      "Suavização das linhas de expressão, preservando a naturalidade e proporcionando um aspecto mais descansado.",
  },
  {
    slug: "skinbooster",
    category: "facial",
    title: "Skinbooster",
    description:
      "Hidratação profunda que melhora viço, textura e luminosidade, deixando a pele mais hidratada e revitalizada.",
  },
  {
    slug: "tratamento-para-melasma",
    category: "facial",
    title: "Tratamento para Melasma",
    description:
      "Cuidado personalizado para uniformizar o tom da pele e auxiliar no controle das manchas e da hiperpigmentação.",
  },
  {
    slug: "tratamento-para-cicatrizes-de-acne",
    category: "facial",
    title: "Tratamento para Cicatrizes de Acne",
    description:
      "Protocolos personalizados para suavizar marcas e irregularidades, promovendo uma pele mais uniforme e renovada.",
  },
  {
    slug: "tratamento-para-rejuvenescimento",
    category: "facial",
    title: "Tratamento para Rejuvenescimento",
    description:
      "Estratégias personalizadas para melhorar firmeza, textura e luminosidade, valorizando uma aparência mais jovem e natural.",
  },
  {
    slug: "prescricao-personalizada-de-skincare",
    category: "facial",
    title: "Prescrição Personalizada de Skincare",
    description:
      "Rotina de cuidados individualizada para atender às necessidades da sua pele e potencializar seus resultados.",
  },

  // ===================== CORPORAIS =====================
  {
    slug: "drenagem-linfatica-manual",
    category: "corporal",
    title: "Drenagem Linfática Manual",
    description:
      "Técnica que estimula a circulação linfática, auxiliando na redução do inchaço e promovendo sensação de leveza.",
  },
  {
    slug: "detox-corporal",
    category: "corporal",
    title: "Detox Corporal",
    description:
      "Combinação de drenagem linfática e manta térmica para promover relaxamento, estimular a circulação e auxiliar na redução do inchaço.",
  },
  {
    slug: "criolipolise",
    category: "corporal",
    title: "Criolipólise",
    description:
      "Tecnologia que utiliza o resfriamento controlado para atuar na redução de gordura localizada de forma não invasiva.",
    image:
      "https://conexaojunina.com.br/wp-content/uploads/2026/08/WhatsApp-Image-2026-08-05-at-17.56.18.jpeg",
    isNew: true,
    benefits: [
      "Redução da gordura localizada de forma progressiva e natural",
      "Melhora do contorno corporal",
      "Procedimento seguro e não invasivo",
      "Sem cortes, agulhas ou anestesia",
      "Retorno imediato às atividades do dia a dia",
    ],
  },
  {
    slug: "depilacao-a-laser",
    category: "corporal",
    title: "Depilação a Laser",
    description:
      "Tecnologia para redução progressiva dos pelos, proporcionando uma pele mais lisa e praticidade na rotina.",
  },
  {
    slug: "massagem-terapeutica",
    category: "corporal",
    title: "Massagem Terapêutica",
    description:
      "Técnicas manuais direcionadas para aliviar tensões musculares, reduzir desconfortos e promover relaxamento. Realizada em região superior e inferior.",
  },
  {
    slug: "liberacao-miofascial-ventosaterapia",
    category: "corporal",
    title: "Liberação Miofascial + Ventosaterapia",
    description:
      "Combinação de técnicas que auxilia na redução de tensões, melhora da mobilidade e relaxamento muscular. Realizada de forma localizada na coluna.",
  },
  {
    slug: "corrente-russa",
    category: "corporal",
    title: "Corrente Russa",
    description:
      "Estimulação elétrica muscular que auxilia na tonificação e fortalecimento, potencializando o trabalho da musculatura.",
  },
  {
    slug: "eletrolipolise",
    category: "corporal",
    title: "Eletrolipólise",
    description:
      "Técnica que utiliza estímulos elétricos para auxiliar no tratamento da gordura localizada e na melhora do contorno corporal.",
  },
  {
    slug: "tratamento-para-flacidez",
    category: "corporal",
    title: "Tratamento para Flacidez",
    description:
      "Protocolo personalizado para estimular firmeza e melhorar a sustentação e a qualidade da pele corporal.",
  },
  {
    slug: "aplicacao-de-enzimas",
    category: "corporal",
    title: "Aplicação de Enzimas",
    description:
      "Protocolo personalizado com ativos específicos para auxiliar no tratamento de gordura localizada, flacidez, estrias e no contorno corporal.",
  },
];

export function getProcedureBySlug(slug: string) {
  return PROCEDURES.find((p) => p.slug === slug);
}

export function getProceduresByCategory(category: ProcedureCategory) {
  return PROCEDURES.filter((p) => p.category === category);
}
