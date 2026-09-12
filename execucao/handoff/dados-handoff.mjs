/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HANDOFF DE DADOS — da constituição pro app interno.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE, e por que ele NÃO é um terceiro inventário.
 *
 * A casa já tem os dois lados escritos, cada um com dono:
 *
 *   `flow/flow-data.mjs`         → o que a constituição COLETA (campo `dados`)
 *   `processos/processos-data.mjs` → o que o app interno FAZ (P1 a P5)
 *
 * O que não existia é a SETA entre eles. "O CNAE principal é coletado no C0" é
 * fato do primeiro. "O P2.1 apura o DAS" é fato do segundo. "Sem o CNAE do C0
 * o P2.1 não tem alíquota" não mora em nenhum dos dois, e é a única coisa que
 * este arquivo guarda. O join é fato novo; os dois lados continuam onde estão.
 *
 * Decidido em 12/09, provocação do Pedro: *"para não duplicarmos trabalho
 * precisamos nesse fluxo apenas ter conhecimento dos dados captados para a
 * constituição, pois alguns desses dados movimentam a parte interna de
 * funcionalidades do app. Mas não precisamos desenhar esse processo, eles já
 * fizeram."*
 *
 * ── A FRONTEIRA (dita pelo Pedro em 12/09) ─────────────────────────────────
 *
 *   TRECHO DELES (time de programadores, mapeado e em teste)
 *     do download do app até o PAGAMENTO DA GUIA (DAE da JUCEMG).
 *
 *   TRECHO ASSISTIDO (nosso, ainda não atacado por eles; no MVP é sequência
 *   humana assistida, e a automação dele é feature de otimização)
 *     1ª assinatura → 2ª assinatura (nossa + do cliente) → certificado.
 *
 *   TRECHO DA PARCEIRA (certificadora terceirizada)
 *     da emissão com o cliente até a entrega do certificado E DA SENHA pra
 *     gente. Nos nossos processos isso é UM estado ("certificado ok"), nunca
 *     um desenho passo a passo: não é processo nosso.
 *
 * ✅ RATIFICADO (Pedro, 12/09): na 1ª assinatura **todos os sócios assinam**,
 * administradores ou não — *"se cadastrou dez, dez assinam"* (Ademar, 05/09,
 * texto + 2 áudios). Na 2ª assinam só o contador e o sócio representante.
 * A descrição inicial de 12/09 ("primeira assinatura só do usuário") vale
 * para a empresa unipessoal, que é o caso comum, e foi corrigida pelo próprio
 * Pedro quando a divergência foi apresentada.
 *
 * ── COMO SE ESCREVE UMA LINHA ──────────────────────────────────────────────
 *
 *   id        · kebab-case, estável. É por ele que a decisão fica gravada.
 *   dado      · o nome humano do dado.
 *   entregaPor· quem PRODUZ o dado:
 *                 "dev"       time deles, dentro do trecho até a guia
 *                 "assistido" trecho humano nosso (assinaturas)
 *                 "parceira"  certificadora
 *                 "orgao"     nasce num órgão (Prefeitura, Receita, Junta)
 *                 "ninguem"   🔴 o interno precisa e NINGUÉM produz hoje
 *   origem    · { tipo: "tela", ref: "<id do flow-data>" } quando o dado é
 *               digitado numa tela que já existe no nosso flow (a ref é
 *               validada contra o NODES), ou { tipo: "texto", ref: "..." }
 *   consome   · ids de passos de `processos-data.mjs` que dependem do dado.
 *               Validado: id que não existe derruba o gerador.
 *   tambem    · texto livre pra funcionalidade do catálogo que não virou passo
 *   status    · "captado"      já existe e chega
 *               "nasce-depois" existe, mas fora do trecho deles
 *               "nao-captado"  🔴 ninguém produz
 *               "nao-sei"      🟡 provavelmente existe e ninguém combinou
 *   porque    · o raciocínio. Obrigatório: linha sem porquê é lista, não nota.
 *   pergunta  · { para, texto } — OBRIGATÓRIO quando o status é "nao-sei" ou
 *               "nao-captado". É a trava principal deste arquivo, irmã da §3
 *               da doutrina de processos: apontar buraco sem escrever a
 *               pergunta não vale nada.
 *
 * 🔴 O PRODUTO DESTA NOTA NÃO É A LISTA VERDE. É a lista de perguntas que sai
 * no fim. A parte captada serve pra provar que não precisamos redesenhar o
 * que eles já fizeram; a parte vermelha é o trabalho.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const FRONTEIRA = [
  {
    trecho: "Trecho deles",
    dono: "time de programadores",
    vai: "do download do app até o pagamento da guia (DAE da JUCEMG)",
    situacao: "mapeado e em teste",
    nosso: false,
  },
  {
    trecho: "Trecho assistido",
    dono: "nós, com gente",
    vai: "1ª assinatura → 2ª assinatura (nossa + do cliente) → certificado",
    situacao:
      "no MVP é sequência humana assistida. As telas existem no flow (A3.H → A5.H, auditadas em 05/09); automatizar é feature de otimização, não requisito de MVP",
    nosso: true,
  },
  {
    trecho: "Trecho da parceira",
    dono: "certificadora terceirizada",
    vai: "da emissão com o cliente até a entrega do certificado e da senha pra gente",
    situacao:
      "nos nossos processos é UM estado, 'certificado ok', nunca um desenho passo a passo. O que precisamos é o arquivo e a senha, que destravam quase toda funcionalidade interna",
    nosso: false,
  },
];

export const DADOS = [
  // ─────────────────────────────────────────────────────────────────────────
  // A · CAPTADOS NO TRECHO DELES, E MOVEM O APP INTERNO
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cnae-principal",
    dado: "CNAE principal",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C0" },
    consome: ["P2.1", "P3.4", "P5.2"],
    tambem: "catálogo 2.6 · /impostos/aliquotas",
    status: "captado",
    porque:
      "É o dado mais reaproveitado do produto inteiro. Ele decide o Anexo (III ou V), e o Anexo é o que faz o Fator R importar: sem essa escolha, o P5 não tem por que existir. Também é dele que sai o código do serviço na nota (P3.4). Uma escolha na constituição, três processos internos dependendo.",
  },
  {
    id: "cnae-secundarios",
    dado: "CNAEs secundários (até 15)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C5" },
    consome: ["P3.4"],
    status: "captado",
    porque:
      "Quem fatura serviço diferente do principal precisa do código municipal correspondente, e a lista de secundários é o universo do que ela pode emitir sem alteração contratual.",
  },
  {
    id: "objeto-social",
    dado: "Objeto social (gerado, travado)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C7" },
    consome: ["P3.3"],
    status: "captado",
    porque:
      "Descreve o que a empresa pode faturar. É a fronteira do que o P3 aceita emitir sem virar caso de alteração contratual (catálogo 8.1).",
  },
  {
    id: "razao-social-fantasia",
    dado: "Razão social + nome fantasia",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C7" },
    consome: ["P3.5"],
    tambem: "catálogo 6.6 · /mais/empresa",
    status: "captado",
    porque:
      "É o emitente da nota. Sai do C7 depois da viabilidade deferida, então o valor que vale é o APROVADO pela Junta, não necessariamente a 1ª das 3 opções que a pessoa escreveu.",
  },
  {
    id: "vinculo-inss",
    dado: "Vínculo INSS por fora (sim/não + valor)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C2" },
    consome: ["P5.3", "P5.7"],
    tambem: "catálogo 4.6 · duplo vínculo",
    status: "captado",
    porque:
      "Quem já contribui por fora tem folga no teto do INSS, e isso muda quanto sai de contribuição no pró-labore. O catálogo já dizia 'declarado pelo cliente no onboarding (já coletamos no flow)': esta linha é a confirmação de que a promessa tem lastro.",
  },
  {
    id: "quadro-societario",
    dado: "Sócios: nome, CPF, nascimento, RG, % de participação",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C3" },
    consome: ["P5.7", "P5.9"],
    tambem: "catálogo 4.4 · recibo de pró-labore e informe de rendimentos",
    status: "captado",
    porque:
      "O eSocial pede a qualificação completa de cada pessoa que recebe pró-labore. Sem CPF e nascimento de cada sócio, o S-1200 não transmite, e o P5.7 para.",
  },
  {
    id: "quem-administra",
    dado: "Quem administra a empresa",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C3" },
    consome: ["P5.1", "P5.6"],
    status: "captado",
    porque:
      "Já está travado como o que decide a qualificação 49 × 22 no DBE. Do lado interno, é quem tem pró-labore a decidir: sócio 22 é quotista e pode não receber nada, e oferecer a decisão do mês pra quem não é administrador é pergunta sem dono.",
  },
  {
    id: "faixa-faturamento",
    dado: "Faixa de faturamento autodeclarada",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "E5F" },
    consome: ["P1.2"],
    status: "captado",
    porque:
      "⚠️ É ESTIMATIVA, não RBT12. Serve pra escolher a coorte de preço na entrada (as três faixas ME de 79/99/139 da minuta), e só. A partir da 1ª nota quem manda é a receita real do P3.7, e o P1.2 passa a comparar contra ela. Confundir os dois faria a mensalidade nascer travada numa chute do cliente.",
  },
  {
    id: "endereco-fiscal-legalizai",
    dado: "Usa o endereço fiscal da Legalizai? (sim/não)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "E3_4" },
    consome: ["P1.1"],
    status: "captado",
    porque:
      "Vira uma linha recorrente de R$ 49/mês na fatura, todo ciclo, pelo Anexo I. É decisão tomada no gate, antes do pagamento, e a fatura do P1.1 precisa saber dela desde o primeiro ciclo.",
  },
  {
    id: "endereco-empresa",
    dado: "Endereço da empresa (CEP, número, complemento, IPTU, tipo de imóvel)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "C4" },
    consome: ["P3.5"],
    tambem: "catálogo 6.6 · /mais/empresa",
    status: "captado",
    porque:
      "Define o município de incidência do ISS, que é o que faz a nota ser de BH e não de outro lugar. Faturar fora de BH é outro caso e já está na loja como CPOM (catálogo 8.5).",
  },
  {
    id: "conta-de-acesso",
    dado: "Conta: nome, CPF, e-mail, telefone, senha",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "E6" },
    tambem: "catálogo 7.6 · perfil e login · 1.4 central de avisos (canal)",
    status: "captado",
    porque:
      "É a mesma conta que entra no portal depois. Não tem passo de processo consumindo porque ela é pré-condição de todos: sem login não há P nenhum.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // B · EXISTEM, MAS NASCEM DEPOIS DO TRECHO DELES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cnpj",
    dado: "CNPJ",
    entregaPor: "assistido",
    origem: { tipo: "texto", ref: "2ª assinatura (Receita) — trecho assistido" },
    consome: ["P1.1", "P2.1", "P3.5", "P5.7"],
    status: "nasce-depois",
    porque:
      "É a chave de tudo: nenhuma das quatro integrações do produto (PGDAS-D, ADN, eSocial, gateway) aceita requisição sem ele. Nasce na 2ª assinatura, que é justamente o trecho que os programadores ainda não atacaram.",
  },
  {
    id: "nire-e-registro",
    dado: "NIRE + data do registro na Junta",
    entregaPor: "assistido",
    origem: { tipo: "texto", ref: "1ª assinatura (JUCEMG) — trecho assistido" },
    tambem: "catálogo 6.1 · /mais/documentos",
    status: "nasce-depois",
    porque:
      "É o que prova a existência da sociedade e alimenta a pasta de documentos que o cliente vai buscar quando abrir conta PJ. Não trava processo, mas é a primeira coisa que somem se ninguém combinar quem guarda.",
  },
  {
    id: "data-abertura",
    dado: "Data de abertura do CNPJ",
    entregaPor: "assistido",
    origem: { tipo: "texto", ref: "2ª assinatura (Receita) — trecho assistido" },
    consome: ["P2.1"],
    tambem: "catálogo 5.3 · calendário de obrigações",
    status: "nasce-depois",
    porque:
      "Abre a primeira competência e o calendário inteiro de obrigações. Também é dela que corre a fidelidade de 12 meses da minuta. ⚠️ NÃO confundir com a data da assinatura do contrato de serviço, que é a âncora do ciclo de COBRANÇA: são duas datas diferentes, com semanas de distância, e tratá-las como uma só erra a fatura ou erra a obrigação.",
  },
  {
    id: "inscricao-municipal",
    dado: "Inscrição municipal (CCM) na Prefeitura de BH",
    entregaPor: "orgao",
    origem: { tipo: "texto", ref: "Prefeitura de BH, depois do CNPJ" },
    consome: ["P3.5"],
    status: "nao-sei",
    porque:
      "🔴 Sem CCM não se emite NFS-e em BH. O P3 inteiro é o processo com relógio correndo (Res. CGSN 191/2026 obriga o Emissor Nacional a partir de 01/11/2026) e depende de um número que nasce fora dos dois trechos mapeados. Nenhuma tela do flow coleta, nenhum passo de processo produz.",
    pergunta: {
      para: "time do dev",
      texto:
        "A inscrição municipal (CCM) entra em algum ponto do que vocês automatizaram, ou ela cai no trecho assistido junto com as assinaturas? Sem ela o app não emite a primeira nota.",
    },
  },
  {
    id: "certificado-arquivo-senha",
    dado: "Certificado digital A1: arquivo + senha",
    entregaPor: "parceira",
    origem: { tipo: "texto", ref: "certificadora parceira" },
    consome: ["P2.1", "P3.5", "P3.9", "P5.7"],
    tambem: "catálogo 6.2 · /mais/certificado",
    status: "nasce-depois",
    porque:
      "🔴 O item de maior alcance da nota inteira: quatro passos em três processos diferentes travam sem ele. É o que assina no ADN, no PGDAS-D e no eSocial. Decisão do Pedro em 12/09: os nossos processos NÃO desenham a emissão, só constatam o estado 'certificado ok'. ⚠️ Continua valendo o aberto de 05/09: a plataforma interna que recebe o arquivo da parceira não existe.",
  },
  {
    id: "certificado-validade",
    dado: "Validade do certificado",
    entregaPor: "parceira",
    origem: { tipo: "texto", ref: "certificadora parceira" },
    consome: ["P3.9", "P3.11"],
    status: "nasce-depois",
    porque:
      "O P3.9 confere a validade ANTES de cada transmissão, então a data precisa estar guardada como dado, não só o arquivo. É também o que faz o P3.11 saber se o caso é 'nunca fez a videochamada' ou 'venceu'.",
  },
  {
    id: "alvara",
    dado: "Alvará / licenciamento",
    entregaPor: "orgao",
    origem: { tipo: "texto", ref: "Prefeitura de BH" },
    tambem: "catálogo 6.1 · /mais/documentos · 8.4 na loja",
    status: "nasce-depois",
    porque:
      "Fecha a pasta de documentos do cliente. O licenciamento já é respondido no questionário da Prefeitura durante a constituição (atividade inócua, acesso pedestre), então o dado nasce do que eles já enviaram.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // C · O INTERNO PRECISA E NINGUÉM PRODUZ — o produto desta nota
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "data-aceite-contrato",
    dado: "Data e hora do aceite do contrato de serviço",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "E9" },
    consome: ["P4.24", "P1.1", "P4.11"],
    status: "nao-sei",
    porque:
      "🔴 É a ÂNCORA DO CICLO DE COBRANÇA inteiro, travada pelo Pedro em 11/09: assinou dia 8, o ciclo vira todo dia 8, pra sempre. A tela existe e o aceite acontece (checkbox no E9), mas 'existe o checkbox' e 'a data fica gravada e chega até nós' são coisas diferentes. Se esse carimbo não atravessar a fronteira, o P1 não sabe quando fechar a primeira fatura, e não há como recalcular depois.",
    pergunta: {
      para: "time do dev",
      texto:
        "O aceite do contrato no E9 grava data e hora com o texto aceito, e isso vem no que vocês entregam pra gente? É o dado que define o dia da cobrança de todos os ciclos seguintes.",
    },
  },
  {
    id: "mandato-recorrente",
    dado: "Mandato de cobrança recorrente (cartão tokenizado)",
    entregaPor: "dev",
    origem: { tipo: "tela", ref: "E9" },
    consome: ["P1.4"],
    status: "nao-sei",
    porque:
      "🔴 O E9 cobra a ABERTURA, que é pagamento único. A mensalidade do P1.4 é cobrança RECORRENTE: exige tokenizar o cartão e guardar o mandato, o que é outra integração e muda o escopo PCI. Foi exatamente isso que derrubou o Asaas em 08/09. Se o cartão do E9 não deixar mandato, o cliente vai ter que cadastrar forma de pagamento DE NOVO no primeiro ciclo, logo depois de ter pago a abertura.",
    pergunta: {
      para: "time do dev",
      texto:
        "O pagamento da abertura no E9 deixa um meio de pagamento salvo pra cobrança recorrente, ou é transação única? Se for única, a primeira mensalidade vai pedir cartão outra vez.",
    },
  },
  {
    id: "conta-bancaria-pj",
    dado: "Conta bancária da PJ (ou o extrato dela)",
    entregaPor: "ninguem",
    origem: { tipo: "texto", ref: "não existe em lugar nenhum" },
    consome: ["P5.8"],
    status: "nao-captado",
    porque:
      "🔴 É o único caminho conhecido pro vermelho do P5. O P5.8 pergunta se o pró-labore foi EFETIVAMENTE PAGO, e o dinheiro vai da empresa pro sócio sem passar por nós nem pelo governo: não há API. O preço de errar está medido — considerar pago o que só foi lançado gera glosa do Fator R, reclassificação pro Anexo V e multa (6% virando 15,5%). Hoje o único rastro previsto é o extrato que o cliente envia até o 5º dia útil (cláusula 5.4).",
    pergunta: {
      para: "Mauro",
      texto:
        "Pra saber que o pró-labore foi pago de verdade, a gente fica no extrato que o cliente manda (cláusula 5.4) ou vale perguntar a conta PJ na abertura e buscar Open Finance read-only depois? É o que separa Anexo III de Anexo V.",
    },
  },
  {
    id: "dependentes-irrf",
    dado: "Dependentes para IRRF",
    entregaPor: "ninguem",
    origem: { tipo: "texto", ref: "não existe em lugar nenhum" },
    consome: ["P5.7"],
    tambem: "catálogo 4.7",
    status: "nao-captado",
    porque:
      "Entra direto no cálculo do IRRF do pró-labore, e o líder tem. Não é gap de constituição (não vai pra Junta nem pro DBE), é gap do app interno: o lugar natural é o cadastro do sócio depois que a empresa abre, não mais uma pergunta antes do pagamento.",
    pergunta: {
      para: "Pedro",
      texto:
        "Dependentes de IRRF ficam de fora do MVP (o cálculo sai sem dedução) ou entram como campo no perfil do sócio, dentro do portal?",
    },
  },
  {
    id: "colaboradores",
    dado: "Colaboradores (admissão, ativo, demissão)",
    entregaPor: "ninguem",
    origem: { tipo: "texto", ref: "não existe em lugar nenhum" },
    consome: ["P1.1"],
    status: "nao-captado",
    porque:
      "O P1.1 já soma 'R$ 39 por colaborador ATIVO' na fatura, pelas cláusulas 7.2 e 7.4 — cobra mesmo sem movimento. Mas nada na constituição cria colaborador, e nenhum processo desenhado transforma alguém em ativo. A linha da fatura existe e a origem dela não. Não é dado de handoff: é processo faltando (candidato a P6).",
    pergunta: {
      para: "Pedro",
      texto:
        "A folha de colaborador (admissão → ativo → demissão) entra no MVP? O P1.1 já cobra por colaborador ativo e não existe nada que crie um.",
    },
  },
  {
    id: "rbt12-inicial",
    dado: "Como o RBT12 se comporta na empresa nova",
    entregaPor: "ninguem",
    origem: { tipo: "texto", ref: "regra, não campo" },
    consome: ["P1.2", "P2.1"],
    status: "nao-captado",
    porque:
      "Empresa recém-aberta não tem 12 meses de receita: a legislação manda proporcionalizar. Isso muda a alíquota do P2.1 nos primeiros meses e a faixa de preço do P1.2. Não é dado que alguém capta, é regra que ninguém escreveu — e sem ela o primeiro DAS da empresa sai de um cálculo que não foi decidido.",
    pergunta: {
      para: "Mauro",
      texto:
        "Nos primeiros 12 meses, qual é a regra de proporcionalização do RBT12 que a gente adota pro DAS e pra faixa de preço? É o cálculo do primeiro imposto de todo cliente novo.",
    },
  },
];
