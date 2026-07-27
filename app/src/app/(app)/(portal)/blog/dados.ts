/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG · dados (27/07) — fonte única dos posts, compartilhada home ↔ post.
 * ═══════════════════════════════════════════════════════════════════════════
 * Farol/mock. Imagens = picsum seeded (placeholder externo, igual ao
 * AprendaGradiente da home) — trocar por arte própria em /public quando existir.
 * Categorias no lugar dos "continentes" da referência (TripGlide).
 * ⚠️ Copy sem travessão (regra dura da marca).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Post = {
  id: string;
  categoria: string;
  titulo: string;
  resumo: string;
  img: string;
  tempo: string;
  data: string;
  destaque?: boolean;
  corpo: string[];
};

export const CATEGORIAS = [
  "Todos",
  "Impostos",
  "Abrir empresa",
  "Nota fiscal",
  "Dicas",
];

function img(seed: string): string {
  return `https://picsum.photos/seed/legalizai-${seed}/720/480`;
}

export const POSTS: Post[] = [
  {
    id: "fator-r",
    categoria: "Impostos",
    titulo: "Entenda o Fator R sem dor de cabeça",
    resumo:
      "O número que decide se você paga 6% ou 15,5% de imposto. E como mantê-lo a seu favor.",
    img: img("fatorr"),
    tempo: "3 min de leitura",
    data: "22 jul 2026",
    destaque: true,
    corpo: [
      "O Fator R é a conta que divide o quanto sua empresa gasta com pró-labore pelo quanto ela faturou nos últimos 12 meses. Parece técnico, mas o efeito é bem concreto: ele decide em qual anexo do Simples você cai.",
      "Se o resultado fica igual ou acima de 28%, você fica no Anexo III, onde a alíquota começa em 6%. Abaixo disso, a empresa cai no Anexo V, que começa em 15,5%. É a diferença entre pagar pouco e pagar mais que o dobro sobre o mesmo faturamento.",
      "O detalhe que pega a maioria: esse número é vivo. Um mês sem faturar, uma retirada de pró-labore menor, e ele muda sozinho. Quem não acompanha só descobre quando a guia chega mais cara.",
      "É por isso que a gente vigia o seu Fator R todo mês e te avisa antes de ele virar dinheiro perdido. Você não precisa fazer conta nenhuma, só receber o aviso quando valer a pena ajustar.",
    ],
  },
  {
    id: "primeira-nota",
    categoria: "Nota fiscal",
    titulo: "Sua primeira nota fiscal, passo a passo",
    resumo:
      "Emitir nota assusta na primeira vez. Na prática, são dois campos e a gente cuida do resto.",
    img: img("nota"),
    tempo: "2 min de leitura",
    data: "18 jul 2026",
    destaque: true,
    corpo: [
      "Emitir uma nota fiscal de serviço parece burocrático, mas quase tudo que os sistemas antigos pedem a gente já sabe do seu cadastro. Sobra pra você o que realmente importa: pra quem é e quanto vale.",
      "No app, você escolhe o cliente, digita o valor e confirma. A prévia já mostra quanto daquele valor é imposto, então nada de surpresa depois. A gente envia pra prefeitura e acompanha até ela aceitar.",
      "Se a nota for recusada, você não precisa entender o motivo técnico. A gente corrige e reemite por você, e o histórico fica todo guardado na aba Notas.",
    ],
  },
  {
    id: "mei-ou-me",
    categoria: "Abrir empresa",
    titulo: "MEI ou ME: qual faz sentido pra você",
    resumo:
      "Os dois têm CNPJ e emitem nota. A diferença está no teto, no imposto e no que você pode fazer.",
    img: img("meime"),
    tempo: "4 min de leitura",
    data: "14 jul 2026",
    destaque: true,
    corpo: [
      "O MEI é a porta de entrada mais simples: imposto fixo baixo, pouca burocracia, mas com um teto de faturamento apertado e uma lista curta de atividades permitidas.",
      "A ME (microempresa) no Simples abre o leque. O teto sobe bastante, você pode ter sócio e a maioria das atividades de serviço cabe. Em troca, o imposto passa a ser um percentual do que você fatura.",
      "A conta que decide costuma ser o faturamento esperado e a atividade. Muita gente começa MEI e migra pra ME quando cresce, e essa migração também é algo que a gente conduz.",
    ],
  },
  {
    id: "o-que-e-das",
    categoria: "Impostos",
    titulo: "O que é o DAS e por que ele chega todo mês",
    resumo:
      "Uma guia só, todo mês, que junta os impostos do Simples. Veja o que está dentro dela.",
    img: img("das"),
    tempo: "3 min de leitura",
    data: "09 jul 2026",
    corpo: [
      "DAS é a sigla do Documento de Arrecadação do Simples Nacional. Na prática, é uma guia única que reúne vários impostos num pagamento só, todo mês.",
      "O valor sai de um percentual sobre o quanto você faturou no mês anterior. Faturou mais, a guia vem maior. Faturou pouco ou nada, ela vem menor, respeitando um piso.",
      "No app, a gente calcula e gera a guia sozinho. Você só paga, e a gente acompanha a confirmação. Nada de marcar na mão que pagou.",
    ],
  },
  {
    id: "pro-labore",
    categoria: "Dicas",
    titulo: "Quanto tirar de pró-labore sem pagar INSS à toa",
    resumo:
      "Pró-labore é o seu salário de dono. O valor certo mexe no seu INSS e no seu Fator R.",
    img: img("prolabore"),
    tempo: "4 min de leitura",
    data: "03 jul 2026",
    corpo: [
      "Pró-labore é a retirada mensal que você, como sócio, faz da empresa pelo trabalho que realiza nela. Sobre ele incide INSS, então o valor não é aleatório.",
      "Tirar de menos economiza INSS no curto prazo, mas pode derrubar o seu Fator R e te jogar num anexo mais caro. Tirar de mais faz o contrário. Existe um ponto de equilíbrio.",
      "A boa notícia é que dá pra simular. No app, você mexe no valor e vê na hora o efeito no imposto, sem precisar entender a mecânica por trás.",
    ],
  },
  {
    id: "anexo-iii-v",
    categoria: "Impostos",
    titulo: "Anexo III ou V: onde sua empresa se encaixa",
    resumo:
      "Duas tabelas do Simples, alíquotas bem diferentes. O que separa uma da outra.",
    img: img("anexos"),
    tempo: "3 min de leitura",
    data: "28 jun 2026",
    corpo: [
      "No Simples Nacional, empresas de serviço caem no Anexo III ou no Anexo V, dependendo da atividade e do Fator R. A diferença de alíquota é grande, então saber onde você está importa.",
      "O Anexo III é o mais leve, começa em 6%. O Anexo V é mais pesado, começa em 15,5%. Algumas atividades vão direto pra um deles; outras dependem do Fator R pra decidir.",
      "Entender isso não é obrigação sua. A gente já enquadra sua empresa no anexo mais vantajoso possível e vigia se algo muda.",
    ],
  },
  {
    id: "abrir-cnpj",
    categoria: "Abrir empresa",
    titulo: "Abrir seu CNPJ: o que a gente faz por você",
    resumo:
      "Junta, Receita, prefeitura, certificado. Veja o caminho completo, sem você bater em porta nenhuma.",
    img: img("cnpj"),
    tempo: "5 min de leitura",
    data: "20 jun 2026",
    corpo: [
      "Abrir uma empresa passa por vários órgãos: a Junta Comercial registra o contrato, a Receita emite o CNPJ, a prefeitura libera a inscrição municipal e o certificado digital destrava a emissão de nota.",
      "Cada um tem seu prazo e sua regra, e é fácil travar num detalhe. O papel da gente é conduzir tudo isso nos bastidores e te avisar só quando precisa de você, como na assinatura.",
      "No fim, você recebe uma empresa ativa e pronta pra faturar, com os documentos guardados no app e o primeiro imposto já no radar.",
    ],
  },
];

export function postPorId(id?: string | null): Post {
  return POSTS.find((p) => p.id === id) ?? POSTS[0];
}

export function sugeridos(id: string, n = 5): Post[] {
  return POSTS.filter((p) => p.id !== id).slice(0, n);
}
