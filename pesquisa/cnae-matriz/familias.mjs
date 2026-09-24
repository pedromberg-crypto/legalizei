/* 🏷️ As famílias dos 87 CNAEs que atendemos.
   🟡 PROPOSTA, aguardando validação do Pedro. Nada foi gravado na tabela.

   🔑 NÃO SÃO CATEGORIAS NOVAS. São as **mesmas 14 do dropdown do app**
   (`app/src/components/gate-telas.tsx`, constante `PILLS`), que o Pedro
   apontou em 24/09. Eu tinha desenhado 14 famílias do zero antes de ver a
   tela; 3 tinham nome idêntico e as outras 11 eram o mesmo recorte com outro
   rótulo. Convergência independente — e o desempate é óbvio: **a categoria
   que vale é a que o cliente já escolhe na tela**. Duas listas para a mesma
   coisa é a origem de toda divergência.

   🔒 Regras:
     1. ADITIVA — entra ao lado da `divisao_id`, que fica intacta.
     2. O `id` aqui é o MESMO `id` do `PILLS`. Se um mudar, o outro quebra —
        e é pra quebrar.
     3. SÓ NOS 87. Os outros 1.245 têm `motivo_nao_atende`, que é outra
        pergunta.

   ⚠️ O `ex` do app não é enfeite: ele define a fronteira. Foi o `ex` de
   `arte` ("represento artista e atleta") que mandou o `7490-1/05`
   (agenciamento de atletas) para lá em vez de para `consult`. */

export const FAMILIAS = {
  tech: {
    rotulo: "Tecnologia e software",
    // 🔄 24/09 (validado pelo Pedro): o `ex` antigo era "Desenvolvo sites, apps
    //    ou sistemas sob encomenda" e deixava de fora hospedagem, portal e
    //    suporte técnico, que estão nesta mesma categoria. Quem dá suporte não
    //    se reconhecia na frase e ia pro "não encontrei minha categoria".
    ex: "Desenvolvo software, dou suporte de TI ou hospedo sites",
    // 🔴 Esta categoria CARREGA a fronteira Fator R × III fixo.
    desambiguar: {
      pergunta: "Você mais desenvolve software sob encomenda, ou mais dá suporte e hospeda?",
      "fator-r": ["6201501", "6201502", "6202300", "6203100", "6204000"],
      "iii-fixo": ["6209100", "6311900", "6319400"],
    },
    cnaes: ["6201501", "6201502", "6202300", "6203100", "6204000", "6209100", "6311900", "6319400"],
  },
  design: {
    rotulo: "Design",
    ex: "Crio design gráfico, de interiores ou de produto",
    cnaes: ["7410202", "7410203", "7410299"],
  },
  foto: {
    rotulo: "Foto, vídeo e áudio",
    ex: "Fotografo, filmo e edito vídeo ou áudio",
    cnaes: ["5912001", "5912002", "5920100", "7420001", "7420003", "7420004", "7420005"],
  },
  mkt: {
    rotulo: "Marketing e publicidade",
    ex: "Cuido das redes sociais e faço publicidade pra clientes",
    /* 🔴 Esta é a categoria mais cara do escopo: dentro dela convivem 6% e
       15,5%. E o critério NÃO é semântico, é o que a SC COSIT 13/2022 fixou
       (com a SC COSIT 99/2017 por trás): quem está no §5º-I X é quem faz o
       trabalho INTELECTUAL de publicidade — estratégia, criação, plano de
       mídia. Quem só executa ou veicula material já pronto é §5º-F, Anexo III
       fixo. Sem esta pergunta o Léo chuta entre dobrar ou não a alíquota. */
    desambiguar: {
      pergunta: "Você cria a campanha e a estratégia, ou executa e veicula material que já vem pronto?",
      "fator-r": ["7311400", "7319004"],
      "iii-fixo": ["5911102", "7312200", "7319002", "7319003", "7320300"],
      fonte: "SC COSIT 13/2022 + SC COSIT 99/2017",
    },
    cnaes: ["5911102", "7311400", "7312200", "7319002", "7319003", "7319004", "7320300"],
  },
  edicao: {
    rotulo: "Edição e mídia",
    ex: "Edito livros, jornais ou revistas",
    cnaes: ["5811500", "5812301", "5812302", "5813100", "5819100", "6391700"],
  },
  consult: {
    rotulo: "Consultoria, pesquisa e tradução",
    ex: "Faço consultoria, pesquisa ou tradução pra empresas",
    cnaes: ["7210000", "7220700", "7490101", "7490104", "7490199"],
  },
  cursos: {
    rotulo: "Ensino e cursos",
    ex: "Dou aula de idioma, música, dança ou curso profissionalizante",
    cnaes: ["8591100", "8592901", "8592902", "8592903", "8592999", "8593700", "8599603", "8599604", "8599605"],
  },
  arte: {
    rotulo: "Arte, cultura e patrimônio",
    ex: "Produzo teatro, música, ou represento artista e atleta",
    // 🔑 o `7490105` (agenciamento de atletas e artistas) vem pra cá por causa
    //    do "represento artista e atleta" do próprio exemplo do app.
    cnaes: ["7490105", "9001901", "9001902", "9001903", "9001904", "9002701", "9002702", "9102302"],
  },
  eventos: {
    rotulo: "Eventos e entretenimento",
    ex: "Organizo eventos, festas ou casas de jogos",
    cnaes: ["8230001", "8299707", "9319101", "9329803", "9329804"],
  },
  admin: {
    rotulo: "Apoio administrativo",
    ex: "Faço serviços de escritório, cobrança e teleatendimento",
    cnaes: ["8211300", "8219901", "8219999", "8220200", "8291100", "8292000", "8299703"],
  },
  aluguel: {
    rotulo: "Aluguel de equipamentos",
    ex: "Alugo equipamentos, móveis ou objetos",
    cnaes: ["7721700", "7722500", "7723300", "7729201", "7729202", "7729203", "7729299", "7733100"],
  },
  reparos: {
    rotulo: "Reparos e manutenção",
    ex: "Conserto computador, celular, bicicleta ou relógio",
    cnaes: ["9511800", "9512600", "9521500", "9529101", "9529102", "9529103", "9529104", "9529105", "9529106", "9529199"],
  },
  salao: {
    rotulo: "Salão e beleza",
    ex: "Trabalho com cabelo, manicure e pedicure",
    cnaes: ["9602501"],
  },
  hospedagem: {
    rotulo: "Hospedagem",
    ex: "Tenho albergue ou pensão",
    cnaes: ["5590601", "5590603"],
  },
};

/* 🔴 ÓRFÃO DECLARADO, não esquecido.
   `9609-2/02` agência matrimonial não cabe em nenhuma das 14, e forçá-lo em
   "Salão e beleza" ou "Apoio administrativo" seria mentir pro cliente. Ele cai
   no "Não encontrei minha categoria" do app, que existe exatamente pra isso.
   1 de 87 é preço aceitável; o que não é aceitável é enfiar num rótulo errado
   e o Léo herdar a mentira. */
export const ORFAOS = ["9609202"];

export const familiaDoCnae = (() => {
  const m = new Map();
  for (const [chave, f] of Object.entries(FAMILIAS)) for (const c of f.cnaes) m.set(c, chave);
  return (cnae) => m.get(cnae) ?? null;
})();
