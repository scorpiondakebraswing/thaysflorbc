/**
 * FONTE ÚNICA DE VERDADE DOS PROCEDIMENTOS.
 *
 * Para editar textos, adicionar ou remover um procedimento, mexa só neste
 * arquivo. A Homepage e as páginas de detalhe leem tudo daqui automaticamente.
 *
 * Campos:
 *  slug        vira a URL da página (ex: "botox" -> /procedimentos/botox)
 *  category    "facial" ou "corporal" (agrupa os itens na sanfona da Homepage)
 *  title       nome exibido
 *  summary     frase curta, aparece na lista da Homepage
 *  description texto completo, aparece na página de detalhe
 *  benefits    lista de benefícios, aparece na página de detalhe
 *  indications lista opcional de "indicado para", aparece na página de detalhe
 *  image       URL opcional da foto
 *  isNew       true coloca o selo "Novidade"
 */

export type ProcedureCategory = "facial" | "corporal";

export type Procedure = {
  slug: string;
  category: ProcedureCategory;
  title: string;
  summary: string;
  description: string;
  benefits: string[];
  indications?: string[];
  image?: string;
  isNew?: boolean;
};

export const PROCEDURES: Procedure[] = [
  // ===================== FACIAIS =====================
  {
    slug: "limpeza-de-pele",
    category: "facial",
    title: "Limpeza de Pele",
    summary:
      "Higienização profunda que remove impurezas e promove uma pele mais limpa e luminosa.",
    description:
      "A limpeza de pele é a base de qualquer rotina de cuidado estético. O procedimento remove impurezas, células mortas e o excesso de oleosidade que se acumulam no dia a dia e acabam obstruindo os poros. Além do resultado imediato de uma pele mais limpa e luminosa, ela prepara o terreno para que outros tratamentos e produtos de skincare sejam melhor absorvidos, potencializando os resultados a médio prazo.",
    benefits: [
      "Remoção de cravos, impurezas e células mortas",
      "Poros visivelmente mais limpos e desobstruídos",
      "Pele mais macia, luminosa e com aspecto saudável",
      "Melhor absorção dos produtos de skincare usados em casa",
      "Momento de relaxamento e autocuidado",
    ],
    indications: [
      "Pele com cravos, poros obstruídos ou aspecto opaco",
      "Rotina de manutenção periódica da saúde da pele",
      "Preparo da pele antes de outros procedimentos",
    ],
  },
  {
    slug: "peeling-quimico",
    category: "facial",
    title: "Peeling Químico",
    summary:
      "Renovação da pele que melhora textura, uniformidade e luminosidade.",
    description:
      "O peeling químico promove uma renovação controlada das camadas superficiais da pele por meio de ativos específicos, estimulando a substituição das células antigas por células novas. O protocolo é escolhido de acordo com o tipo de pele, o objetivo do tratamento e a sensibilidade de cada pessoa, o que torna o procedimento bastante versátil: pode ser usado tanto para manchas quanto para textura irregular, marcas de acne ou simplesmente para devolver viço à pele.",
    benefits: [
      "Renovação celular e melhora da textura da pele",
      "Uniformização do tom e atenuação de manchas",
      "Aumento da luminosidade e do viço",
      "Auxílio no controle da oleosidade e da acne",
      "Protocolo ajustável à necessidade de cada pele",
    ],
    indications: [
      "Manchas, melasma ou hiperpigmentação",
      "Textura irregular e marcas de acne",
      "Pele opaca, sem viço",
    ],
  },
  {
    slug: "microagulhamento",
    category: "facial",
    title: "Microagulhamento",
    summary:
      "Estímulo à renovação e à produção de colágeno para melhorar textura e marcas.",
    description:
      "O microagulhamento utiliza microperfurações controladas para acionar o processo natural de reparo da pele, estimulando a produção de colágeno e elastina. É uma técnica reconhecida por trabalhar a qualidade da pele em profundidade, atuando sobre marcas, textura irregular e sinais de flacidez. Os resultados são progressivos e se constroem ao longo das sessões, acompanhando o tempo natural de renovação do organismo.",
    benefits: [
      "Estímulo à produção natural de colágeno e elastina",
      "Melhora visível da textura e da firmeza da pele",
      "Suavização de cicatrizes de acne e marcas",
      "Atenuação de poros dilatados e linhas finas",
      "Potencializa a absorção de ativos aplicados na sessão",
    ],
    indications: [
      "Cicatrizes de acne e marcas na pele",
      "Textura irregular e poros dilatados",
      "Flacidez inicial e sinais de envelhecimento",
    ],
  },
  {
    slug: "botox",
    category: "facial",
    title: "Botox",
    summary:
      "Suavização das linhas de expressão, preservando a naturalidade do rosto.",
    description:
      "A aplicação de toxina botulínica atua de forma pontual sobre a musculatura responsável pelas linhas de expressão, suavizando marcas na testa, entre as sobrancelhas e ao redor dos olhos. O objetivo do protocolo aqui nunca é congelar o rosto, e sim devolver um aspecto descansado e sereno, preservando a sua expressão. É um dos procedimentos mais procurados justamente pela combinação de resultado natural, aplicação rápida e retorno imediato à rotina.",
    benefits: [
      "Suavização das linhas de expressão",
      "Aspecto mais descansado e rejuvenescido",
      "Preservação da naturalidade e da expressão facial",
      "Prevenção do aprofundamento de novas marcas",
      "Procedimento rápido, com retorno imediato à rotina",
    ],
    indications: [
      "Linhas na testa, glabela e ao redor dos olhos",
      "Prevenção de rugas em formação",
      "Busca por um aspecto mais descansado",
    ],
  },
  {
    slug: "skinbooster",
    category: "facial",
    title: "Skinbooster",
    summary:
      "Hidratação profunda que melhora viço, textura e luminosidade da pele.",
    description:
      "O skinbooster leva hidratação para dentro da pele, em camadas que os cremes de uso tópico não alcançam sozinhos. Ao repor hidratação em profundidade, o procedimento devolve viço, elasticidade e aquele aspecto de pele saudável e bem cuidada. É especialmente indicado para peles ressecadas, opacas ou que já começam a apresentar linhas finas de desidratação.",
    benefits: [
      "Hidratação profunda e duradoura",
      "Aumento do viço e da luminosidade",
      "Melhora da elasticidade e da textura",
      "Atenuação de linhas finas causadas por ressecamento",
      "Resultado natural, sem alterar o contorno do rosto",
    ],
    indications: [
      "Pele ressecada, opaca ou sem viço",
      "Linhas finas de desidratação",
      "Manutenção da qualidade da pele",
    ],
  },
  {
    slug: "tratamento-para-melasma",
    category: "facial",
    title: "Tratamento para Melasma",
    summary:
      "Cuidado personalizado para uniformizar o tom e controlar manchas.",
    description:
      "O melasma é uma condição que exige constância, acompanhamento e um protocolo desenhado individualmente, já que responde de forma diferente em cada pessoa. O tratamento combina procedimentos em consultório com uma rotina domiciliar bem orientada, incluindo fotoproteção rigorosa, que é parte fundamental do resultado. O objetivo é clarear gradualmente as manchas existentes e, igualmente importante, evitar que elas retornem.",
    benefits: [
      "Clareamento gradual e uniformização do tom da pele",
      "Protocolo individualizado para o seu tipo de mancha",
      "Orientação completa de cuidados domiciliares",
      "Estratégia de manutenção para evitar recidivas",
      "Acompanhamento próximo ao longo do tratamento",
    ],
    indications: [
      "Melasma facial",
      "Manchas por exposição solar",
      "Hiperpigmentação pós-inflamatória",
    ],
  },
  {
    slug: "tratamento-para-cicatrizes-de-acne",
    category: "facial",
    title: "Tratamento para Cicatrizes de Acne",
    summary:
      "Protocolos personalizados para suavizar marcas e irregularidades.",
    description:
      "Cicatrizes de acne têm tipos e profundidades diferentes, e por isso raramente respondem bem a um tratamento único. O protocolo aqui é montado de forma combinada, associando técnicas que atuam na renovação da pele e no estímulo de colágeno, respeitando o tipo de marca e a sensibilidade da sua pele. Os resultados aparecem de forma progressiva ao longo das sessões, com melhora consistente da uniformidade da superfície.",
    benefits: [
      "Suavização progressiva de marcas e depressões",
      "Melhora da uniformidade e da textura da pele",
      "Estímulo à produção de colágeno na área tratada",
      "Protocolo combinado, ajustado ao tipo de cicatriz",
      "Ganho de confiança com a aparência da pele",
    ],
    indications: [
      "Cicatrizes deixadas por acne",
      "Textura irregular e marcas antigas",
      "Manchas pós-acne",
    ],
  },
  {
    slug: "tratamento-para-rejuvenescimento",
    category: "facial",
    title: "Tratamento para Rejuvenescimento",
    summary:
      "Estratégias personalizadas para melhorar firmeza, textura e luminosidade.",
    description:
      "O rejuvenescimento facial aqui não é um procedimento isolado, e sim uma estratégia construída a partir da avaliação do seu rosto e dos seus objetivos. Ele pode combinar diferentes técnicas de estímulo de colágeno, hidratação profunda e renovação da pele, sempre com foco em resultados naturais. A proposta é valorizar uma aparência mais jovem sem apagar aquilo que faz o seu rosto ser seu.",
    benefits: [
      "Melhora da firmeza e da sustentação da pele",
      "Textura mais uniforme e refinada",
      "Aumento da luminosidade e do viço",
      "Plano combinado, desenhado para o seu rosto",
      "Resultados naturais e progressivos",
    ],
    indications: [
      "Primeiros sinais de envelhecimento",
      "Perda de firmeza e luminosidade",
      "Busca por manutenção preventiva",
    ],
  },
  {
    slug: "prescricao-personalizada-de-skincare",
    category: "facial",
    title: "Prescrição Personalizada de Skincare",
    summary:
      "Rotina de cuidados individualizada para as necessidades da sua pele.",
    description:
      "Boa parte do resultado de qualquer tratamento estético acontece em casa, no dia a dia. A prescrição personalizada de skincare parte de uma avaliação da sua pele para montar uma rotina realista e eficaz, com os ativos certos, na concentração certa e na ordem certa de aplicação. Isso evita o desperdício com produtos que não fazem sentido para o seu caso e potencializa os resultados dos procedimentos feitos em consultório.",
    benefits: [
      "Rotina desenhada para o seu tipo de pele e objetivo",
      "Orientação clara sobre ordem e frequência de uso",
      "Potencializa os resultados dos procedimentos em consultório",
      "Evita gastos com produtos inadequados",
      "Acompanhamento e ajustes ao longo do tempo",
    ],
    indications: [
      "Quem não sabe por onde começar no skincare",
      "Rotinas que não estão trazendo resultado",
      "Complemento a qualquer tratamento facial",
    ],
  },

  // ===================== CORPORAIS =====================
  {
    slug: "drenagem-linfatica-manual",
    category: "corporal",
    title: "Drenagem Linfática Manual",
    summary:
      "Técnica manual que estimula a circulação linfática e reduz o inchaço.",
    description:
      "A drenagem linfática manual utiliza movimentos suaves, rítmicos e direcionados para estimular o sistema linfático, favorecendo a eliminação do excesso de líquidos retidos nos tecidos. Além do efeito visível na redução do inchaço, é um procedimento profundamente relaxante, muito procurado tanto por quem sofre com retenção quanto por quem busca um momento de bem-estar na rotina.",
    benefits: [
      "Redução do inchaço e da retenção de líquidos",
      "Sensação imediata de leveza nas pernas e no corpo",
      "Estímulo à circulação e ao sistema linfático",
      "Alívio da sensação de cansaço e peso",
      "Efeito relaxante durante toda a sessão",
    ],
    indications: [
      "Retenção de líquidos e inchaço",
      "Pernas cansadas e pesadas",
      "Pós-operatório, com liberação profissional",
    ],
  },
  {
    slug: "detox-corporal",
    category: "corporal",
    title: "Detox Corporal",
    summary:
      "Drenagem linfática combinada com manta térmica para leveza e relaxamento.",
    description:
      "O detox corporal une a drenagem linfática manual à manta térmica, potencializando os efeitos de ambas as técnicas em uma única sessão. Enquanto a drenagem trabalha a eliminação do excesso de líquidos, o calor da manta favorece a circulação e amplia a sensação de relaxamento. O resultado é uma experiência completa, que combina bem-estar com efeito visível na redução do inchaço.",
    benefits: [
      "Redução do inchaço com efeito potencializado",
      "Estímulo à circulação pelo calor da manta térmica",
      "Sensação intensa de leveza e relaxamento",
      "Momento de autocuidado completo",
      "Bom complemento a tratamentos de contorno corporal",
    ],
    indications: [
      "Retenção de líquidos e sensação de inchaço",
      "Rotina intensa, com necessidade de relaxamento",
      "Complemento a protocolos corporais",
    ],
  },
  {
    slug: "criolipolise",
    category: "corporal",
    title: "Criolipólise",
    summary:
      "Resfriamento controlado para redução de gordura localizada, sem cirurgia.",
    description:
      "A criolipólise utiliza o resfriamento controlado para atuar sobre as células de gordura de uma região específica, promovendo sua redução progressiva e natural pelo próprio organismo. É uma alternativa não invasiva para quem incomoda com gordura localizada mas não quer passar por cirurgia: não exige cortes, agulhas ou anestesia, e permite retorno imediato às atividades do dia a dia.",
    image:
      "https://conexaojunina.com.br/wp-content/uploads/2026/08/WhatsApp-Image-2026-08-05-at-17.56.18.jpeg",
    isNew: true,
    benefits: [
      "Redução da gordura localizada de forma progressiva e natural",
      "Melhora visível do contorno corporal",
      "Procedimento seguro e não invasivo",
      "Sem cortes, agulhas ou anestesia",
      "Retorno imediato às atividades do dia a dia",
    ],
    indications: [
      "Gordura localizada no abdômen, flancos ou culote",
      "Quem busca alternativa não cirúrgica",
      "Complemento a hábitos saudáveis já estabelecidos",
    ],
  },
  {
    slug: "depilacao-a-laser",
    category: "corporal",
    title: "Depilação a Laser",
    summary:
      "Redução progressiva dos pelos, com pele mais lisa e praticidade na rotina.",
    description:
      "A depilação a laser age diretamente no folículo piloso, promovendo a redução progressiva do crescimento dos pelos a cada sessão. Além do ganho evidente de praticidade na rotina, o procedimento costuma reduzir consideravelmente problemas comuns de outros métodos, como pelos encravados, irritação e foliculite, deixando a pele mais lisa e uniforme.",
    benefits: [
      "Redução progressiva e duradoura dos pelos",
      "Pele mais lisa e uniforme",
      "Diminuição de pelos encravados e foliculite",
      "Menos irritação em comparação a lâminas e cera",
      "Praticidade e economia de tempo na rotina",
    ],
    indications: [
      "Quem quer reduzir a frequência de depilação",
      "Histórico de pelos encravados ou foliculite",
      "Áreas sensíveis com irritação frequente",
    ],
  },
  {
    slug: "massagem-terapeutica",
    category: "corporal",
    title: "Massagem Terapêutica",
    summary:
      "Técnicas manuais para aliviar tensões musculares e promover relaxamento.",
    description:
      "A massagem terapêutica utiliza técnicas manuais direcionadas para aliviar tensões musculares acumuladas, reduzir desconfortos e promover relaxamento profundo. Realizada em região superior e inferior, é especialmente procurada por quem passa muitas horas sentado, tem rotina intensa ou convive com tensão recorrente em ombros, pescoço e costas.",
    benefits: [
      "Alívio de tensões musculares acumuladas",
      "Redução de desconfortos e dores localizadas",
      "Sensação de relaxamento profundo",
      "Melhora da sensação de bem-estar geral",
      "Atendimento em região superior e inferior",
    ],
    indications: [
      "Tensão em ombros, pescoço e costas",
      "Rotina intensa ou muitas horas sentado",
      "Necessidade de relaxamento e alívio muscular",
    ],
  },
  {
    slug: "liberacao-miofascial-ventosaterapia",
    category: "corporal",
    title: "Liberação Miofascial + Ventosaterapia",
    summary:
      "Combinação de técnicas para reduzir tensões e melhorar a mobilidade.",
    description:
      "Esse protocolo combina a liberação miofascial com a ventosaterapia, atuando de forma localizada na região da coluna. A liberação trabalha os pontos de tensão da fáscia, enquanto as ventosas favorecem a circulação local e a soltura dos tecidos. Juntas, as técnicas auxiliam na redução de tensões persistentes, na melhora da mobilidade e na sensação de alívio muscular.",
    benefits: [
      "Redução de tensões musculares persistentes",
      "Melhora da mobilidade e da amplitude de movimento",
      "Estímulo à circulação local",
      "Sensação de alívio e soltura na região tratada",
      "Aplicação localizada e direcionada na coluna",
    ],
    indications: [
      "Tensão e rigidez na região da coluna",
      "Sensação de travamento ou mobilidade reduzida",
      "Complemento a rotinas de atividade física",
    ],
  },
  {
    slug: "corrente-russa",
    category: "corporal",
    title: "Corrente Russa",
    summary:
      "Estimulação elétrica muscular que auxilia na tonificação e fortalecimento.",
    description:
      "A corrente russa promove contrações musculares por meio de estimulação elétrica, funcionando como um complemento ao trabalho da musculatura. É bastante procurada por quem busca auxílio na tonificação e no fortalecimento muscular, especialmente em conjunto com atividade física regular, potencializando os resultados do treino.",
    benefits: [
      "Auxílio na tonificação e no fortalecimento muscular",
      "Complemento ao trabalho realizado na atividade física",
      "Estímulo direcionado a grupos musculares específicos",
      "Contribui para a definição do contorno corporal",
      "Sessões práticas, encaixáveis na rotina",
    ],
    indications: [
      "Busca por tonificação muscular",
      "Complemento a treinos e atividade física",
      "Protocolos de contorno corporal",
    ],
  },
  {
    slug: "eletrolipolise",
    category: "corporal",
    title: "Eletrolipólise",
    summary:
      "Estímulos elétricos que auxiliam no tratamento da gordura localizada.",
    description:
      "A eletrolipólise utiliza estímulos elétricos de baixa frequência para auxiliar na mobilização da gordura localizada, favorecendo a melhora do contorno corporal. É frequentemente indicada dentro de protocolos combinados, associada a outras técnicas corporais, para potencializar os resultados em regiões específicas.",
    benefits: [
      "Auxílio no tratamento da gordura localizada",
      "Melhora progressiva do contorno corporal",
      "Estímulo à circulação na região tratada",
      "Boa associação com outras técnicas corporais",
      "Procedimento não invasivo",
    ],
    indications: [
      "Gordura localizada em regiões específicas",
      "Protocolos combinados de contorno corporal",
      "Quem busca alternativas não invasivas",
    ],
  },
  {
    slug: "tratamento-para-flacidez",
    category: "corporal",
    title: "Tratamento para Flacidez",
    summary:
      "Protocolo personalizado para estimular firmeza e sustentação da pele.",
    description:
      "O tratamento para flacidez corporal é montado de forma individualizada, combinando técnicas que estimulam a firmeza e a qualidade da pele. Seja flacidez decorrente de emagrecimento, gestação ou do processo natural de envelhecimento, o protocolo é ajustado à região e ao grau apresentado, com resultados que se constroem de forma progressiva ao longo das sessões.",
    benefits: [
      "Estímulo à firmeza e à sustentação da pele",
      "Melhora da qualidade e da textura da pele corporal",
      "Protocolo ajustado à região e ao grau de flacidez",
      "Resultados progressivos e consistentes",
      "Boa associação com outros tratamentos corporais",
    ],
    indications: [
      "Flacidez após emagrecimento ou gestação",
      "Perda de firmeza pelo envelhecimento natural",
      "Braços, abdômen, coxas e glúteos",
    ],
  },
  {
    slug: "aplicacao-de-enzimas",
    category: "corporal",
    title: "Aplicação de Enzimas",
    summary:
      "Ativos específicos para gordura localizada, flacidez, estrias e contorno.",
    description:
      "A aplicação de enzimas utiliza ativos específicos selecionados de acordo com o objetivo de cada caso, atuando sobre gordura localizada, flacidez, estrias e contorno corporal. Por ser um protocolo altamente personalizável, a escolha dos ativos e o número de sessões são definidos a partir de uma avaliação individual da região a ser tratada.",
    benefits: [
      "Ativos selecionados conforme o seu objetivo",
      "Auxílio no tratamento de gordura localizada",
      "Contribuição para firmeza e melhora de estrias",
      "Melhora progressiva do contorno corporal",
      "Protocolo altamente personalizável",
    ],
    indications: [
      "Gordura localizada resistente",
      "Estrias e flacidez corporal",
      "Refinamento do contorno corporal",
    ],
  },
];

export function getProcedureBySlug(slug: string) {
  return PROCEDURES.find((p) => p.slug === slug);
}

export function getProceduresByCategory(category: ProcedureCategory) {
  return PROCEDURES.filter((p) => p.category === category);
}
