/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 A PERSONA — quem é o cliente, e por consequência o que EXISTE no produto.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Travado pelo Pedro em 13/09: *"nem sempre a gente está alinhado ao nosso
 * produto de fato e à nossa persona. (…) igual vi em pró-labore do sócio com
 * benefícios, a gente não tem essa opção do sócio ter benefício. (…) Precisamos
 * desenhar MUITO bem o nosso usuário padrão pois ele é fixo."*
 *
 * ── 🔑 POR QUE ISTO NÃO É O `_escopo.mjs` DE NOVO ──────────────────────────
 *
 * São DOIS FILTROS DIFERENTES, e até 13/09 só um estava travado:
 *
 *   ESCOPO   pega ICMS, CFOP, SEFAZ, Lucro Presumido
 *            → "isso é de outro REGIME"
 *
 *   PERSONA  pega plano de saúde do sócio, estoque, 13º de sócio
 *            → "isso é legal, é do nosso regime, e mesmo assim NÃO EXISTE
 *               no nosso produto"
 *
 * 🔴 O CASO QUE FEZ ISTO NASCER. Na varredura de pró-labore de 13/09 eu escrevi
 * *"plano de saúde do sócio SAI do pró-labore como desconto"*, copiado da
 * plataforma do líder. É **perfeitamente legal** num ME Anexo III — a trava de
 * escopo jamais ia pegar. Só que o nosso produto não tem benefício para sócio.
 * Eu copiei o mundo do líder sem perguntar se ele é o nosso.
 *
 * ── 🔑 A DIFERENÇA ESTRUTURAL: PROIBIDO É POR CATEGORIA ────────────────────
 *
 * "Rescisão", "13º" e "férias" são LEGÍTIMOS em `folha.mjs` e PROIBIDOS em
 * `prolabore.mjs`, porque funcionário tem e sócio não tem. Lista global não
 * resolveria — ou libera demais, ou mata a categoria vizinha. O `benefício` de
 * `impostos.mjs` prova o ponto: lá ele quer dizer "benefício de plano
 * comercial", e é legítimo.
 *
 * ── ⚠️ ONDE ESTA TRAVA NÃO CHEGA ───────────────────────────────────────────
 *
 * Mesma fronteira da trava de escopo e da de anatomia do MEI: ela pega
 * VOCABULÁRIO, não raciocínio. Dá pra descrever uma empresa que não é a nossa
 * usando só palavras permitidas. Contra isso existe a PERSONA_ZERO lá embaixo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · O QUE JÁ ESTÁ TRAVADO
 * Cada linha traz FONTE e DATA. Sem fonte não entra — regra anti-guru do vault.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const TRAVADO = {
  regime: {
    valor: "Simples Nacional, porte ME",
    fonte: "Pedro, 12/09 · `_escopo.mjs`",
  },
  anexos: {
    valor: "III ou V, com ou sem Fator R",
    fonte: "Pedro, 12/09",
    nota: "O Anexo vale POR COMPETÊNCIA e pode virar no meio do ano. Confirmado em produção: `anexoEscolhido` viaja em cada nota.",
  },
  epp: {
    valor: "FORA. E o produto só tem a PORTA DE SAÍDA, não a permanência",
    fonte: "Pedro, 13/09 · contrato `minuta-contrato-me.md` linha 401",
    nota: '🔑 O Pedro disse "EPP que não atendemos AINDA" — é futuro, não é nunca. No contrato EPP existe só como "Desenquadramento de ME para EPP, R$ 139,00, no ato": a empresa SAI, ela não fica. Enquanto for assim, processo nenhum pode ter ramo de EPP.',
  },
  comercio: {
    valor: "FORA. Serviço apenas",
    fonte: "Pedro, 15/07 e 12/09",
    nota: "Comércio emite outro documento por outro sistema — FORA DO ESCOPO.",
  },
  regulamentadas: {
    valor: "FORA. Continuam fora",
    fonte: "Pedro, 13/09 · já estava no `_escopo.mjs` desde 12/09",
    nota: "Conselho de classe e rito próprio de abertura. Confirmado explicitamente em 13/09, então não é herança não revisada.",
  },
  socios: {
    valor:
      "1 (unipessoal) ATÉ 4 — o que constitui, mais até 3. Todos PESSOA FÍSICA e domiciliados no Brasil",
    fonte: "Pedro, 13/09 · corrobora o gate-telas.tsx de 29/08",
    nota: '🔴 NÃO EXISTE "quantidade padrão", e essa foi a resposta do Pedro em 13/09: *"temos que ter a variável para unipessoal e também para até 3 sócios além do que constitui"*. Ou seja **1 a 4 é FAIXA, não default** — todo processo que toca pró-labore, INSS, IRRF ou lucro tem que funcionar com N sócios, não com um. ⚠️ A varredura de pró-labore de 13/09 foi escrita assumindo UM valor de pró-labore e precisa de repasse. 🔑 Sócio via CNPJ e sócio no exterior foram REMOVIDOS do produto, não escondidos: o Simples não aceita. Não é preferência de UI, é lei.',
  },
  folha: {
    valor: "FICA no MLP. As 9 funcionalidades do §8 são produto",
    fonte: "Pedro, 13/09",
    nota: "🔴 ISTO ENCERRA UMA CONTRADIÇÃO QUE ESTAVA ESCRITA NO VAULT. Eu havia proposto em `lancamento-mlp.md` o corte *'Sai: a folha inteira (§8, 9 itens)'*, e a proposta **está morta** — nunca tinha sido ratificada e agora foi negada. Consequência: 👷 Folha é a maior categoria ainda sem processo nenhum desenhado, e o vocabulário dela (13º, férias, rescisão, FGTS, dependente) é legítimo LÁ e proibido em pró-labore.",
  },
  funcionario: {
    valor: "PODE ter. Não é o padrão, e o fluxo tem que existir",
    fonte: "Pedro, 13/09",
    nota: '🔑 "Pode ter" e não "tem": *"vamos tratar como pode ter pq é um fluxo que precisamos mapear também, a parte da folha de pagamento"*. Então folha é RAMO, com padrão zero funcionário — mas ramo construído, não adiado.',
  },
  dependenteDoSocio: {
    valor: "NÃO CAPTAMOS. Dependente existe só em FOLHA, para colaborador",
    fonte: "Pedro, 13/09",
    nota: "🔑 Vira DECISÃO, e deixa de ser buraco — era pergunta aberta do handoff desde 12/09. Consequência direta: o IRRF do pró-labore sai **sem dedução por dependente**, então sobra o desconto simplificado (`deducaoSimplificada`) como única via. E some a pergunta que eu ia mandar pro time de constituição criar campo novo.",
  },
  beneficioDoSocio: {
    valor: "NÃO EXISTE. Nenhum: plano de saúde, VT, VR, VA",
    fonte: "Pedro, 13/09",
    nota: "🔴 Foi o achado que fez este arquivo nascer. O líder tem, e eu copiei. Sócio recebe pró-labore e lucro, e ponto.",
  },
  geo: {
    valor: "Belo Horizonte E Minas Gerais",
    fonte: "Pedro, 13/09 — corrigindo a minha leitura",
    nota: "⚠️ EU TINHA TRAVADO SÓ BH E ESTAVA ERRADO. O Pedro corrigiu: é BH/MG, como já dizia o CLAUDE.md da raiz. 🔴 A consequência não é de cadastro, é de REGRA: ISS e NFS-e são MUNICIPAIS, então cada município de MG tem alíquota e obrigação acessória próprias. A persona zero é de BH (IBGE 3106200 na chave), mas o produto não é. O mapa de notas precisa de repasse com essa lente.",
  },
  exterior: {
    valor: "FORA dos dois lados: nem CLIENTE do exterior, nem SÓCIO do exterior",
    fonte: "Pedro, 13/09",
    nota: "🔑 Sócio no exterior o Simples já proibia. Cliente do exterior é DECISÃO NOSSA — a plataforma do líder tem o caminho com 244 países no seletor, e eu mapeei um ramo inteiro de notas por imitação. Esse ramo sai.",
  },
  entradaDoCliente: {
    valor: "O cliente entra no app como PESSOA FÍSICA",
    fonte: "Pedro, 13/09",
    nota: "⚠️ Isto é sobre a ENTRADA (quem abre a empresa), não sobre o tomador da nota. São perguntas diferentes, e a resposta da segunda é outra — ver `tomadorDaNota`.",
  },
  faturamento: {
    valor: "NÃO SE PRESUME, SE MEDE",
    fonte: "Pedro, 13/09",
    nota: '🔑 A minha pergunta ("qual o faturamento típico?") estava mal formada, e a resposta reformula: o faturamento é *"o que a pessoa registrar de NF no nosso app ou trazer externamente"*, mais a conferência no fechamento do ciclo pela **API da Receita Federal**. É entrada medida em três fontes, não característica fixa da persona. ⚠️ Isso cria um requisito que não estava em lugar nenhum: **nota trazida de fora**, emitida noutro lugar, precisa entrar na conta do RBT12.',
  },
  emissaoDeNF: {
    valor: "ILIMITADA. Sem teto de notas por mês",
    fonte: "Pedro, 13/09",
    nota: "Sem limite no produto; para a persona o volume naturalmente não é alto. A persona zero emite 1 por mês.",
  },
  papelDaCasa: {
    valor:
      "CALCULAR CERTO, GERAR A GUIA CERTA, NA DATA CERTA. Não fiscalizar o que a pessoa faz com o dinheiro dela",
    fonte: "Pedro, 13/09",
    nota: '🔴🔴 A CORREÇÃO MAIS IMPORTANTE DO DIA, e ela é de DOUTRINA, não de dado. Palavras dele: *"não é nosso papel regular como é usado esse faturamento, temos apenas que fazer nossa parte de cálculos e guias corretas nas datas corretas"*. ⚠️ Eu tinha desenhado o oposto: no `L20` a distribuição de lucro ficava TRAVADA por débito federal em aberto, e o `L21` era uma porta fechada. A lei da multa de 50% é real — mas ela é **informação que a pessoa precisa ter**, não fechadura que a gente opera. Se o dono saca tudo, o problema é dele e nós avisamos; a nossa entrega é o cálculo e a guia. 🔑 A régua que fica: INFORMAR, nunca TUTELAR. Vale pro produto inteiro, não só pro lucro.',
  },
  tomadorDaNota: {
    valor: "PF e PJ, os dois. O que muda são os campos obrigatórios",
    fonte: "Pedro, 13/09 · pesquisa anterior da casa",
    nota: "🔑 Fecha a ambiguidade da P3.1b sem matar caminho: *'podemos sim emitir para PF e PJ sem problemas desde que coloque os dados corretos'*. A persona zero emite pra PJ. ⚠️ Não confundir com a entrada: quem ABRE a empresa entra como PF; quem RECEBE a nota pode ser os dois.",
  },
  naoExisteUmaPersonaSo: {
    valor:
      "O produto atende uma FAIXA de comportamento, não um cliente médio. Faturamento varia mês a mês, e pode ser zero",
    fonte: "Pedro, 13/09",
    nota: '🔴 CORREÇÃO DE ENQUADRAMENTO, e ela conserta a minha pergunta original. Eu perguntei "qual o faturamento típico?" como se a persona tivesse um número. O Pedro: *"o meu se repete, mas teremos usuários com faturamentos variados, pode gerar valor x em um mês, y no outro ou não faturar nada em determinado mês. E por isso que eu insisto que não tem como validarmos apenas 1 persona no nosso fluxo"*. 🔑 O que é FIXO é o enquadramento (ME Simples, Anexo III/V, serviço, PF na entrada, 1-4 sócios). O que VARIA é o comportamento — e variação não é exceção, é o caso normal. Todo cálculo tem que aguentar mês zerado, mês alto e mês irregular sem virar caso de canto. ⚠️ A persona zero serve para CONFERIR o que existe, nunca para definir o que basta.',
  },
  personaZero: {
    valor: "A própria empresa do Pedro é cliente-padrão nº 1, para CONFERIR, não para definir",
    fonte: "Pedro, 13/09",
    nota: '*"eu sou uma das personas e perfil fixo de cliente. Podemos inclusive me usar como uma dessas personas validadoras."* Ver PERSONA_ZERO.',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · O QUE AINDA NÃO ESTÁ TRAVADO
 *
 * 🔑 Estas perguntas ficam AQUI, como dado, e não num .md — porque o gerador
 * conta quantas seguem abertas a cada rodada. Pergunta que mora em prosa é
 * pergunta que envelhece sem ninguém notar; foi assim que a do dependente
 * passou de 12/09 pra 13/09 sem resposta.
 *
 * Para responder: troque `resposta: null` pelo valor, some a fonte, e mova o
 * item pro bloco TRAVADO se ele virar regra dura.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const ABERTO = [
  {
    id: "P1.5",
    bloco: "empresa",
    pergunta: "Endereço: casa, apartamento, sede própria ou endereço fiscal nosso?",
    resposta:
      "PARCIAL — não é uma persona só. Casa, apartamento e endereço fiscal nosso são variáveis internas, e grande parte já está mapeada. A persona zero é APARTAMENTO (APT 601, confirmado no Cartão CNPJ).",
    fonte: "Pedro, 13/09 + Cartão CNPJ de 26/05/2026",
    porque:
      "🔑 A resposta reformula a pergunta, e a reformulação é a parte importante: endereço não é traço fixo da persona, é VARIÁVEL com efeito diferente em cada valor. Apartamento puxa condomínio e IPTU próprio; endereço fiscal nosso é produto pago (R$49/mês).",
    muda:
      "Falta dizer O QUE MUDA em cada valor: IPTU, alvará e taxa municipal saem iguais nos três? É o que a categoria ✅ Estar em dia precisa saber, e ela ainda não foi varrida.",
  },
  {
    id: "P2.1",
    bloco: "socio",
    pergunta: "Vínculo CLT por fora: comum ou raro?",
    resposta: "RARO, mas existe e já é perguntado no cadastro do usuário.",
    fonte: "Pedro, 13/09",
    porque:
      "Quem já contribui como CLT tem folga no teto do INSS, e isso muda o líquido do sócio sem mudar o valor declarado. O Pedro confirmou que a pergunta já está no cadastro e que interfere em funcionalidade interna.",
    muda:
      "O L24 CONTINUA no mapa — raro não é inexistente. Falta saber em quais funcionalidades ele bate além do INSS; o Pedro sinalizou que pode valer pesquisa externa.",
  },
  {
    id: "P2.3",
    bloco: "socio",
    pergunta: "Como o lucro entra nos nossos cálculos, já que não vamos inferir de extrato?",
    resposta: null,
    critico: true,
    porque:
      '🔴 VIROU OUTRA PERGUNTA, e maior. A original era "a persona tira lucro?". O Pedro respondeu algo mais fundo: *"a Contabilizei em momento nenhum nem cita sobre retirada de lucro, então com toda certeza é algo que é calculado por trás e vem com respostas apenas que o usuário precisa saber"*. Bate com a evidência: na plataforma do líder o lucro é INFERIDO DO EXTRATO, silenciosamente, e nunca é perguntado. ⚠️ E a casa travou em 09/09 que não teremos conta nem integração bancária — então o caminho dele não existe pra nós.',
    muda:
      "Como DECLARAMOS o que é retirada de lucro. O Pedro alerta que interfere no resto dos cálculos, ainda que seja só pra mostrar. 📚 Ele autorizou buscar fora: é pesquisa em fonte primária de governo, não dedução minha. ⚠️ E a resposta precisa respeitar a régua nova: INFORMAR, não TUTELAR.",
  },
  {
    id: "P2.4",
    bloco: "socio",
    pergunta: "Como o líder recalcula o pró-labore sozinho em mês sem faturamento?",
    resposta:
      "RESPONDIDA EM 13/09, na conta logada. Enquanto a receita era regular (R$ 12.000/mês) ele pagava R$ 3.360 = 0,28 × 12.000, o alvo EXATO do Fator R. No fechamento de maio/2026 — primeiro mês com receita zero — ele recalculou e desceu para R$ 1.621, o salário mínimo, que é o PISO legal. E não voltou a subir quando o faturamento retornou em junho. 🔑 A regra dele não é 'manter o Fator R em 28%': é pagar o MENOR valor que ainda segura o anexo barato. Mês sem faturar encolhe o denominador, o Fator R sobra, e o motor aproveita a folga pra baixar o pró-labore.",
    fonte: "teardown da conta do Pedro, 13/09 · `prolabore/central/historico` e `notafiscal/consultar/list`",
    porque:
      '🔑 Pergunta NOVA, levantada pelo próprio Pedro em 13/09: *"eles fazem aquela conta automática do pró-labore para sempre manter a gente na menor alíquota e ele recalcula sozinho também em meses que eu não faturo"*. É exatamente o nó L3 do nosso mapa, e a conta do L4. A conta de mês cheio nós temos; a de mês vazio, não.',
    muda:
      "L3 e L4. Hoje o mapa oferece um switch 'pagar ou não pagar'; se o líder RECALCULA um valor específico, a regra dele é outra e precisa ser lida. Os dados do Pedro estão dentro da plataforma deles — é teardown, complementável com pesquisa externa.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · A PERSONA ZERO — e ela tem extrato, não opinião
 *
 * 🔑 Pedido do Pedro em 13/09: *"eu sou uma das personas e perfil fixo de
 * cliente."* Então toda varredura passa a responder uma pergunta que não se
 * discute: **isso acontece com a empresa do Pedro?**
 *
 * ⚠️ Só entra aqui o que foi MEDIDO — Cartão CNPJ lido íntegro, emissão real de
 * 12/09, e o que o Pedro afirmou com todas as letras. Perfil imaginado não vale.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const PERSONA_ZERO = {
  nome: "BERG CONSULTORIA EM MARKETING",
  razaoSocial: "PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA",
  cnpj: "64.037.271/0001-02",
  fonte:
    "Cartão CNPJ emitido 26/05/2026 13:10 (lido íntegro: 1 página, 1.912 caracteres) + chave de acesso da NFS-e nº 6 de 12/09/2026 + Pedro, 13/09",

  medido: {
    porte: "ME — confirmado no cartão",
    naturezaJuridica: "206-2 Sociedade Empresária Limitada",
    dataAbertura: "12/12/2025 — a empresa tem ~9 meses",
    situacao: "ATIVA",
    socios: "UNIPESSOAL, sem sócio (Pedro, 13/09)",
    funcionarios: 'NENHUM — *"meu plano nem permite"* (Pedro, 13/09)',
    cnae: "73.19-0-04 Consultoria em publicidade — CNAE ÚNICO, sem secundário",
    alvara: "DISPENSADO (Res. CGSIM 51/2019, marcado no próprio cartão)",
    conselho: "nenhum — não é atividade regulamentada",
    anexo: "III — 6%",
    comoSeSabe:
      "🔴 CORRIGIDO EM 13/09. Eu tinha escrito Anexo V lendo `anexoEscolhido: 5` como se o 5 fosse o anexo. NÃO É — é id interno do líder. Duas provas independentes: (1) a própria nota carrega 'Conforme Lei 12.741/2012, o percentual total de impostos é de aproximadamente 6,00%'; (2) a aritmética do ISS fecha exata — R$ 198,89 ÷ R$ 9.895,00 = 2,0100%, e 6% × 33,50% (repartição do ISS no Anexo III faixa 1) = 2,010%. No Anexo V daria 15,5% × 14,00% = 2,17%, que não bate.",
    prolabore: "R$ 1.621,00/mês desde maio/2026 — exatamente o salário mínimo",
    prolaboreAntes: "R$ 3.360,00 em março e abril, que é 0,28 × 12.000 EXATO (o alvo do Fator R)",
    prolaboreSerieOficial:
      "🔴 CORRIGIDO 14/09 pelas DCTFWeb (INSS segurado ÷ 11%): dez/25 R$100 · jan/26 SEM MOVIMENTO · fev R$3.260 · mar R$3.360 · abr R$3.360 · mai-ago R$1.621. A Central de Sócios só mostra a partir de MARÇO — esconde 3 competências, duas delas com valor. Eu tinha registrado '3 meses sem pró-labore nenhum'; era a tela, não o fato.",
    receitaSerieOficial:
      "PGDAS-D por competência: dez/25 0 · jan 0 · fev 12.000 · mar 12.000 · abr 12.000 · mai 0 · jun 0 · jul 0 · ago 7.910. ✅ DIVERGÊNCIA RESOLVIDA 14/09: o antigo receitaReal dizia jun 12.000 porque a **NF nº4 foi emitida em 03/06 por R$12.000 e CANCELADA** (tela Consultar notas fiscais; situação `cancelada`). A nota existiu, a receita não. 🔴 E o Diário contábil **não tem um único lançamento dela** — nem original, nem estorno — então reconstituir histórico fiscal exige DUAS fontes: o livro e a lista de NFS-e.",
    receitaReal:
      "dez/25 0 · jan 0 · fev 12.000 · mar 12.000 · abr 12.000 · mai 0 · jun 0 (NF nº4 emitida e CANCELADA) · jul 0 · ago 7.910 · set 9.895",
    endereco: "R Corinto 202, APT 601, Serra — APARTAMENTO",
    municipio: "Belo Horizonte / MG — IBGE 3106200 na chave de acesso",
    iss: "2,01% (R$ 198,89 sobre R$ 9.895,00), não retido",
    valorDaNota: "R$ 9.895,00",
    frequencia: "1 nota por mês, numeração sequencial sem pulo (5 em agosto, 6 em setembro)",
    tomador: "PJ nacional",
    servico: "Desenvolvimento de produto digital e gestão de equipe",
    competencia: "M-1 — a nota de setembro diz 'referente ao serviço prestado no mês de agosto'",
    contadorAtual: "Contabilizei",
  },

  /* ── 🔴 QUATRO COISAS QUE O CARTÃO ENTREGOU E NINGUÉM TINHA PEDIDO ──────── */
  achadosDoCartao: [
    {
      o: "O contato oficial na Receita é do CONTADOR, não do cliente",
      dado: "ENDEREÇO ELETRÔNICO: MEUCNPJ@CONTABILIZEI.COM.BR · TELEFONE: (41) 9788-0145, DDD de Curitiba, sede do líder",
      porque:
        "🔑 O líder se registra como o contato da empresa no cadastro federal. Comunicação oficial da Receita chega NELE, não no dono. ⚠️ É retenção e é operação ao mesmo tempo, e vira DECISÃO nossa: replicamos, ou o cliente é o contato e a gente vai atrás? Nunca foi discutido em lugar nenhum do vault.",
    },
    {
      o: "O ISS real da nota NÃO é a alíquota municipal da nossa matriz",
      dado: "a matriz CNAE diz `iss_bh_aliquota: 5%` para o 7319004 · a nota real cobrou **2,01%**",
      porque:
        "🔑 Os dois números estão certos, para contribuintes diferentes: 5% é o ISS municipal de quem NÃO está no Simples; dentro do Simples o ISS sai da **repartição do anexo** aplicada sobre a alíquota efetiva. 🔴 Como a nossa persona está SEMPRE no Simples, mostrar os 5% da matriz pra ela seria errado. A matriz é pesquisa e não mexi nela — fica registrado pra conferência.",
    },
    {
      o: "A empresa tem 9 meses, então o RBT12 dela é PROPORCIONALIZADO",
      dado: "abertura em 12/12/2025 · apenas 6 notas emitidas até 12/09/2026",
      porque:
        "🔑 É exatamente o caso onde mora a hipótese dos 5,99987% que ficou pendente de confirmação. A persona zero é empresa NOVA, e empresa nova no primeiro ano não usa RBT12 cheio. Se o motor assumir 12 meses sempre, erra logo no cliente recém-constituído — que é **a maioria dos nossos**, já que o produto nasce da constituição.",
    },
    {
      o: "Unipessoal registrada como 206-2, e não como SLU",
      dado: "NATUREZA JURÍDICA: 206-2 Sociedade Empresária Limitada · e o Pedro confirma que não tem sócio",
      porque:
        "⚠️ Existe código próprio para Sociedade Limitada Unipessoal (230-5) e este cartão traz 206-2. Pode ser legítimo — desde 2019 uma limitada pode ter um sócio só — mas **qual natureza jurídica a NOSSA constituição usa no unipessoal** nunca foi decidido em lugar nenhum do vault. É pergunta pro Ademar, do tipo que a regra de 05/09 manda perguntar em vez de deduzir.",
    },
  ],

  /* ── 🔴 O QUE A CONTA LOGADA ENTREGOU EM 13/09 ─────────────────────────── */
  achadosDaPlataforma: [
    {
      o: "O motor do líder MUDOU o pró-labore sozinho, e dá pra ver o mês",
      dado: "histórico: mar 3.360 · abr 3.360 · **mai 1.621** · jun 1.621 · jul 1.621 · ago 1.621. `dataUltimaAtualizacao: 01/06/2026`",
      porque:
        "🔑 Maio foi o PRIMEIRO mês sem faturamento (receita 0), e é exatamente o mês em que o valor cai. O motor recalculou no fechamento de maio e desceu do alvo do Fator R (3.360 = 28% de 12.000) para o PISO legal (1.621 = salário mínimo). E não voltou a subir em junho, mesmo com o faturamento de volta.",
    },
    {
      o: "🔴 MÊS SEM FATURAMENTO **AJUDA** O FATOR R, não atrapalha",
      dado: "com pró-labore pago e receita zero, o numerador anda e o denominador não",
      porque:
        "🔴 O NOSSO MAPA DIZ O CONTRÁRIO, e está errado. O `L3` afirma que não pagar 'derruba o Fator R'. O que derruba é não PAGAR. Mês sem FATURAR, com pró-labore pago, EMPURRA o Fator R pra cima. Foi por isso que o motor pôde descer pro piso: a razão já estava garantida.",
    },
    {
      o: "A anualização da folha é o que segura o Anexo III, e dá pra provar",
      dado: "receita anualizada ≈ R$ 74.547 · folha anualizada ≈ R$ 22.085 · Fator R ≈ 29,6%",
      porque:
        "🔴 A DEMONSTRAÇÃO VIVA DO §2.4 DA PESQUISA. Somando a folha CRUA (R$ 16.564) contra a receita ANUALIZADA daria 22,2% → Anexo V. Anualizando os dois lados dá 29,6% → Anexo III. O erro que a pesquisa chama de 'falha comum de sistema' custaria, nesta empresa real, 6% virando 15,5%. ⚠️ A conta assume pró-labore de fev = 3.360 e dez/jan = 0, porque o histórico da plataforma só devolve 6 meses. A direção não muda, o número exato sim.",
    },
    {
      o: "Obrigação acessória NÃO pausa em mês sem receita",
      dado: "maio/2026, receita 0: PGDAS **TRANSMITIDO** e DCTFWeb **TRANSMITIDO**, igual a todos os outros meses",
      porque:
        "✅ Confirma o §3.3 da pesquisa em produção. ⚠️ Mas não testa o caso 'sem movimento': em maio o pró-labore de 1.621 FOI pago, então houve fato gerador. O mês verdadeiramente sem movimento continua sem evidência nossa.",
    },
    {
      o: "🔴 O 5,99987% RESOLVIDO — e o mecanismo não era o que eu supunha",
      dado: "recibo oficial do PGDAS-D de agosto: receita R$ 7.910,00 · débito declarado **R$ 474,59** · 474,59 ÷ 7.910 = 5,99987%",
      porque:
        "🔑 Não vem de proporcionalização de RBT12 — vem de ARREDONDAMENTO POR TRIBUTO. `7.910 × 6% = 474,60`, mas o DAS é a soma de SEIS parcelas arredondadas (IRPJ 18,98 · CSLL 16,61 · COFINS 60,84 · PIS 13,19 · CPP 205,98 · ISS 158,99 = **474,59**). O centavo some no arredondamento das partes. 🔴 Requisito direto pro motor: calcular por tributo, arredondar cada um, somar. Quem faz `receita × alíquota` erra centavo em toda guia, e guia diferente do PGDAS é divergência com a Receita. ✅ Segunda confirmação independente: o ISS da nota 6 é R$ 198,89, e 9.895 × 6% × 33,50% = 198,8895 → 198,89.",
    },
    {
      o: "Quem transmite ao governo é o CONTADOR, não o cliente",
      dado: "o recibo do PGDAS traz CPF de responsável que não é o do Pedro, e IP de servidor em nuvem. Junto com o `MEUCNPJ@CONTABILIZEI.COM.BR` do Cartão CNPJ",
      porque:
        "🔑 Forma um padrão: o líder se coloca como o interlocutor oficial da empresa perante o governo — no cadastro federal e na transmissão. É retenção e é operação. Decisão nossa se replicamos, e ela nunca foi tomada.",
    },
    {
      o: "O alerta de dividendos EXISTE na plataforma, e está desligado",
      dado: "`deveExibirAlertaDividendos: false` · e também `nomesDependentes: null`, campo que existe lá",
      porque:
        "🔑 O Pedro disse que a Contabilizei nunca cita retirada de lucro. O campo mostra que o assunto existe no produto deles — só não acendeu pra ele. Pista para a P2.3.",
    },
  ],

  naoSeSabeAinda: [
    "se tira lucro, e com que frequência — ver P2.3",
    "o que é o `baseCalculoIrrf: 5000` que viaja no payload do líder",
    "o pró-labore de dez/25, jan e fev/26 — o histórico da plataforma só devolve 6 meses",
  ],

  comoUsar:
    "Ao escrever ou revisar um nó de processo, perguntar: isso acontece com esta empresa? Se não acontece e nem poderia acontecer com a persona travada, o nó é delírio copiado do líder — é o teste que teria pego o plano de saúde do sócio na hora.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · O VOCABULÁRIO PROIBIDO, POR CATEGORIA
 *
 * `_todas` vale em todo arquivo de processo. As demais chaves batem com o `id`
 * da categoria em `cru/<id>.mjs`.
 *
 * 🔑 Citação legítima se libera escrevendo `FORA DO ESCOPO` na MESMA linha —
 * mesmo mecanismo do `_escopo.mjs`, de propósito: um jeito só de destravar.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const PROIBIDO_POR_CATEGORIA = {
  _todas: [
    // Porte que não atendemos. ⚠️ "ME/EPP" aparece legitimamente ao citar o
    // leiaute nacional (a E0061 fala dos dois juntos) — essas linhas precisam
    // do marcador, e é bom que precisem: obriga um humano a olhar cada uma.
    "EPP",
    "empresa de pequeno porte",
    // Mundo de comércio, que não é nosso nem no vocabulário nem na regra.
    "estoque",
    "revenda",
    "mercadoria",
    // Sócio que o Simples não aceita, e que foi REMOVIDO do produto em 29/08.
    "sócio no exterior",
    "sócio pessoa jurídica",
    "sócio PJ",
  ],

  // 🔴 A lista que nasceu do erro de 13/09. Sócio recebe pró-labore e lucro.
  // Não tem benefício, não tem 13º, não tem férias, não tem rescisão.
  prolabore: [
    "plano de saúde",
    "vale-transporte",
    "vale-refeição",
    "vale-alimentação",
    "décimo terceiro",
    "13º",
    "férias",
    "rescisão",
    "FGTS",
    "benefício",
    // 13/09: dependente do SÓCIO não é captado. Ele existe só em folha, para
    // colaborador — por isso a palavra é proibida aqui e legítima lá.
    "dependente",
  ],

  // Vazias por ora, e isso é declaração, não esquecimento.
  notas: [],
  impostos: [],

  // 👷 Folha FICA no MLP (Pedro, 13/09). Categoria ainda não varrida. Vazia de
  // propósito: aqui "13º", "férias", "rescisão", "FGTS" e "dependente" são
  // LEGÍTIMOS — é a categoria que os tem. O proibido dela nasce quando ela for
  // desenhada.
  folha: [],
};

export const MARCADOR_EXCLUSAO = "FORA DO ESCOPO";
