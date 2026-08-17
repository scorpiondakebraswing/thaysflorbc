/**
 * DEPOIMENTOS EXIBIDOS NA HOMEPAGE.
 *
 * Para adicionar a foto de alguém depois, basta preencher o campo avatar
 * com a URL da imagem. Sem esse campo, aparece uma silhueta genérica.
 *
 * Campos:
 *  quote   texto do depoimento
 *  author  nome exibido abaixo do texto
 *  avatar  URL opcional da foto
 */

export type Testimonial = {
  quote: string;
  author: string;
  avatar?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Thays, seu profissionalismo e experiência torna tudo o que faz um momento único. Até então foi a melhor experiência com limpeza de pele, além dos produtos de alta qualidade, tudo explicado deixando a gente bem a vontade na hora do tratamento. Super recomendo seu serviço e sua clínica, sem falar das massagens que são incríveis.",
    author: "Lennon Lopes",
  },
  {
    quote:
      "Ela é simplesmente maravilhosa, usa o seu dom para nos ajudar na nossa autoestima cuidando da nossa pele, com todo carinho. Sempre com um recadinho que nos deixa muito a vontade. Está sob seus cuidados é ter a certeza que vamos ter e estar sempre com a melhor. Parabéns pela profissional excelente que você é.",
    author: "Joana Ribeiro",
  },
  {
    quote:
      "Hoje eu preciso falar sobre essa experiência maravilhosa que é fazer minha limpeza de pele 🥰✨ O desconforto é mínimo! É um momento tão leve, tão tranquilo, que parece mais uma sessão de relaxamento do que um procedimento estético. Eu saio renovada, com a pele linda e a alma relaxada. E tudo isso graças a essa profissional incrível, cuidadosa, delicada e extremamente competente. Dá pra sentir o carinho e o amor em cada detalhe do atendimento. Que sorte a minha ter encontrado alguém tão maravilhosa assim! 🧕💖 Tinha virado meu momento preferido de autocuidado, pena que estou morando longe, mas, sem dúvidas, era meu momento preferido, inclusive, saudades 💖✨",
    author: "Indianara Simão",
  },
  {
    quote:
      "Flooooooor, passando pra te dizer que super amei minha limpeza de pele. 🥺 Fazia muito tempo que eu não tinha uma pele tão lisinha e macia, e agora tá surreal. Simplesmente perfeita. Amei amei amei. 🫶🫶💖 A mãe falando que até clareou mais meu rosto. Kkkk",
    author: "Ana Mesquita",
  },
  {
    quote:
      "Oiiii, Thays. Tudo bem? Passando somente para falar o quanto estou me sentindo mais leve após a liberação muscular que fizemos. Estou tendo até mais disposição para minhas atividades de rotina, além do alívio da dor. O seu trabalho, o ambiente, fazem toda diferença. E ontem, o climinha chuvoso super cooperou, né? rsrs Gratidão. 🙏✨",
    author: "Cliente TF Beauty Clinic",
  },
];