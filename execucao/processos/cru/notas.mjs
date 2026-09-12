/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧾 NOTAS FISCAIS — varredura crua (12/09)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Regras do modo: `cru/_como-funciona.md`. Em uma linha: aqui só mora O QUE
 * PRECISA ACONTECER e O QUE DECIDE O CAMINHO. Sem quem executa, sem tela, sem
 * API, sem semáforo.
 *
 * Campos:
 *   id       · N<n>, estável
 *   o        · o que acontece, em português
 *   variavel · a pergunta que decide o caminho (só em nó de decisão)
 *   saidas   · [{ se, vai }] — TODA resposta possível da variável
 *   fim      · true quando o caminho termina aqui
 *   saiPara  · fronteira: outra categoria continua daqui. NOTA, não ligação
 *   cobre    · itens da categoria que este nó atende (numeração do PDF)
 *   ja       · passo que já existe no formato completo (P1–P6)
 *   entrada  · true = a categoria COMEÇA aqui. Declarado, nunca deduzido
 *   alerta   · ⏳ este ramo tem prazo ou condição externa pra deixar de existir
 *   nota     · só quando ganha o espaço
 *
 * ── 🔒 O ESCOPO DESTA CATEGORIA (Pedro, 12/09) ─────────────────────────────
 *
 * Toda nota deste mapa é de **ME optante do Simples Nacional** (`opSimpNac = 3`
 * no leiaute), enquadrada nos **Anexos III ou V**, com ou sem Fator R.
 *
 * 🔴 FORA, e não é "depois": **Anexo I (comércio)** e **atividades
 * regulamentadas**. Isso não é detalhe de escopo, é o que define qual DOCUMENTO
 * existe. FORA DO ESCOPO: comércio emite NF-e (modelo 55, SEFAZ, ICMS/CFOP/NCM).
 * Outro documento, outro sistema. Aqui só existe NFS-e — serviço, municipal, ISS.
 *
 * ⚠️ Por isso a documentação de NF-e que o Pedro trouxe em 12/09 NÃO entrou no
 * mapa: ela descreve o documento que a gente decidiu não emitir. Ela rendeu por
 * CONTRASTE (ver `2026-09-12-nfse-nacional-eventos-cancelamento`), não por
 * cópia de campo.
 *
 * 🔑 E o `opSimpNac = 3` não é etiqueta: ele MUDA A REGRA. A E0061 proíbe a
 * substituição de alterar tomador, competência e valor justamente para MEI e
 * ME/EPP — regra que não vale para o não optante.
 *
 * 🔑 CINCO ENTRADAS, não uma. A categoria inteira nasce de cinco fatos
 * diferentes, e essa foi a primeira coisa que a varredura mostrou: o desenho
 * anterior (P3) só conhecia dois.
 *
 *   N1   prestou serviço e quer faturar
 *   N29  abriu uma nota que já existe (e daí sai o caminho do erro, N23)
 *   N30  emitiu fora e precisa trazer pra cá
 *   N34  recebeu nota de fornecedor (e daí a manifestação, N36)
 *   N44  pediu pra equipe emitir
 *
 * ⚠️ Eu tinha escrito SEIS aqui, contando o N23 e o N36 como entradas. O
 * gerador contou 5, e ele está certo: os dois são alcançados de dentro. Fica
 * registrado porque é o tipo de erro que a prosa comete e a máquina não.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const CATEGORIA = {
  id: "notas",
  nome: "Notas fiscais",
  emoji: "🧾",
  itens: ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9"],
};

export const NOS = [
  // ── A · EMITIR ────────────────────────────────────────────────────────────
  { entrada: true, id: "N1", o: "Prestou um serviço e precisa faturar", saidas: [{ se: "", vai: "N2" }] },
  {
    id: "N2",
    o: "Identifica pra quem é a nota",
    variavel: "Quem é o tomador?",
    saidas: [
      { se: "é cliente que já emiti antes", vai: "N5" },
      { se: "é cliente novo", vai: "N3" },
      { se: "é consumidor final, sem identificar", vai: "N4" },
    ],
    cobre: ["3.5"],
    alerta:
      "⏳ A terceira saída tem prazo, e ele já começou. Desde 03/08/2026 os grupos IBS/CBS e suas validações são obrigatórios, e é lá que mora o código de operação (cIndOp). A regra E0187 do leiaute nacional diz: em 13 códigos de operação o grupo do tomador **tem que** ser informado. São justamente aqueles em que o imposto é devido no endereço do ADQUIRENTE — sem tomador identificado, não há como saber onde tributar.",
  },
  {
    id: "N3",
    o: "Cadastra o cliente novo",
    variavel: "É empresa ou pessoa física?",
    saidas: [
      { se: "PJ — basta o CNPJ, o resto vem do cadastro público", vai: "N5" },
      { se: "PF — nome e CPF", vai: "N5" },
      { se: "está fora do Brasil", vai: "N8" },
    ],
    cobre: ["3.5"],
  },
  {
    id: "N4",
    o: "Segue sem identificar o tomador, com a consequência dita antes",
    saidas: [{ se: "", vai: "N6" }],
    alerta:
      "⏳ ESTE RAMO TEM DATA, E NÃO É NO FUTURO — ele já fechou pro nosso ICP.\n\nA pergunta certa não é *até quando ele existe*, é **para quais operações**. Quem decide é o código de operação (cIndOp), e a regra E0187 exige o tomador em 13 deles. O `100301` — *“demais serviços, em operações onerosas”*, cujo local é o domicílio do adquirente — está na lista, e é exatamente o caso do prestador de serviço remoto de BH.\n\n📅 Duas datas, e elas não são a mesma: a obrigatoriedade dos grupos IBS/CBS é de **03/08/2026**; a migração da ME/EPP do Simples pro Emissor Nacional é **01/11/2026** (Res. CGSN 191/2026). Até lá quem manda no nosso cliente é o BHISS, então a data prática é 01/11 — **a menos que BH já exija antes**.\n\n✅ O ramo SOBREVIVE onde o local não é o endereço do adquirente: serviço sobre imóvel (local do imóvel), serviço prestado fisicamente sobre pessoa ou bem móvel (local da prestação), transporte. Nenhum deles é o nosso escopo.",
    nota: "Duas consequências, e as duas precisam aparecer ANTES: o imposto passa a ser responsabilidade de quem emite, e em município que exija identificação a nota não poderá ser cancelada nem substituída depois (recusas E0824 e E0056). ↗ a segunda só morde no N24.",
  },
  {
    id: "N5",
    o: "Confirma o cliente escolhido",
    variavel: "O cliente fica onde?",
    saidas: [
      { se: "no mesmo município da empresa", vai: "N6" },
      { se: "em outro município", vai: "N7" },
      { se: "fora do Brasil", vai: "N8" },
    ],
  },
  {
    id: "N7",
    o: "Resolve onde o imposto é devido quando o cliente é de fora",
    variavel: "O município do cliente exige cadastro de prestador de fora?",
    saidas: [
      { se: "não exige", vai: "N6" },
      { se: "exige e a empresa tem", vai: "N6" },
      { se: "exige e a empresa não tem", vai: "N9" },
    ],
    nota: "É o CPOM/CEPOM. Sem ele, o cliente é obrigado a reter o ISS, e o valor que a pessoa recebe cai sem ela entender por quê.",
  },
  {
    id: "N8",
    o: "Trata a nota de exportação de serviço",
    saidas: [{ se: "", vai: "N6" }],
    nota: "Exportação é caso de primeira classe, não exceção: precisa de moeda, cotação, valor em moeda estrangeira e data da invoice. ⚠️ Pode virar mais de um passo — quem define a cotação e em que data é variável que ainda não foi aberta. ↗ impostos: exportação de serviço tem tratamento próprio na apuração.",
  },
  {
    id: "N9",
    o: "Avisa que o cliente vai reter o imposto, e o que fazer pra evitar",
    saidas: [{ se: "", vai: "N6" }],
    saiPara: "plano e cobrança · o cadastro no outro município é serviço avulso",
  },
  {
    id: "N6",
    o: "Define qual serviço está sendo faturado",
    variavel: "É o serviço de sempre?",
    saidas: [
      { se: "sim, o mesmo de sempre", vai: "N11" },
      { se: "é outro serviço", vai: "N10" },
      { se: "é a primeira nota da empresa", vai: "N10" },
    ],
    cobre: ["3.6"],
    nota: "🔑 A sequência salva é o que faz isso durar: escolhe uma vez, e nunca mais pensa. A primeira nota não tem sequência salva, por isso ela cai no caminho longo.",
  },
  {
    id: "N10",
    o: "Escolhe o serviço, partindo do que a empresa faz",
    variavel: "A atividade da empresa aponta pra um serviço só?",
    saidas: [
      { se: "sim, só um", vai: "N11" },
      { se: "mais de um possível", vai: "N12" },
      { se: "nenhum corresponde", vai: "N13" },
    ],
    cobre: ["3.6"],
    ja: "P3.4",
  },
  {
    id: "N12",
    o: "Desempata entre os serviços possíveis, em português",
    saidas: [{ se: "", vai: "N11" }],
    nota: "Uma atividade pode cair em mais de um item da lista de serviço, e é o item que decide o imposto. Desempatar é escolha de negócio, não de código.",
  },
  {
    id: "N13",
    o: "Nenhum serviço corresponde ao que foi feito",
    fim: true,
    nota: "🔴 Caminho sem saída declarado. Ou a atividade da empresa não cobre o que ela está vendendo (e aí é alteração contratual), ou o de-para está incompleto. ⚠️ Pode virar mais de um passo.",
    saiPara: "plano e cobrança · alteração contratual é serviço avulso",
  },
  { id: "N11", o: "Informa o valor do serviço", saidas: [{ se: "", vai: "N14" }] },
  {
    id: "N14",
    o: "Resolve se alguém retém imposto na fonte",
    variavel: "O cliente retém algum imposto?",
    saidas: [
      { se: "não retém nada", vai: "N16" },
      { se: "retém, e o valor líquido muda", vai: "N15" },
    ],
    nota: "Retenção muda o que CAI NA CONTA sem mudar o que foi faturado. Quem não entende isso acha que a nota saiu errada.",
  },
  { id: "N15", o: "Mostra o que o cliente vai reter e o que sobra", saidas: [{ se: "", vai: "N16" }] },
  {
    id: "N16",
    o: "Confere o que esse faturamento faz com a empresa antes de emitir",
    variavel: "Esse valor encosta em algum limite?",
    saidas: [
      { se: "não encosta em nada", vai: "N53" },
      { se: "aproxima do teto do regime", vai: "N17" },
      { se: "ultrapassa o teto do regime", vai: "N17" },
      { se: "muda a faixa de faturamento", vai: "N17" },
    ],
    saiPara: "estar em dia · a vigília do teto vive lá · impostos · a faixa muda a alíquota",
    nota: "🔑 Esta é a variável mais valiosa da categoria inteira, e ela não existia no desenho anterior: é o único momento em que dá pra avisar ANTES, porque depois de emitida a nota não volta atrás sem custo.",
  },
  {
    id: "N17",
    o: "Diz o que muda antes de a nota existir, e deixa decidir",
    variavel: "A pessoa quer emitir assim mesmo?",
    saidas: [
      { se: "emitir assim mesmo", vai: "N53" },
      { se: "mudar o valor", vai: "N11" },
      { se: "desistir por ora", vai: "N19" },
    ],
  },
  { id: "N19", o: "Desistiu: nada é emitido e nada é cobrado", fim: true },
  {
    id: "N53",
    o: "Resolve sob qual regime esta nota sai",
    variavel: "A empresa ainda apura tudo pelo Simples?",
    saidas: [
      { se: "sim, tudo pelo Simples", vai: "N18" },
      { se: "passou de um sublimite: o ISS sai pela regra do município", vai: "N18" },
      { se: "passou do limite: federais e ISS saem por fora do Simples", vai: "N18" },
    ],
    nota: "🔑 VARIÁVEL NOVA, achada em 12/09 no leiaute oficial, e ela não estava em lugar nenhum nosso. O optante ME/EPP declara EM CADA NOTA sob qual regime de apuração ela sai — é o campo `regApTribSN`, que existe justamente pra quem ultrapassou sublimite ou limite. Não é decorativo: muda duas outras regras. Quando a apuração é toda pelo Simples, o regime especial municipal tem que ser “Nenhum” (E0175) e NÃO se pode informar dedução nem redução de base, exceto numa lista fechada de subitens (E0398). ⚠️ Liga com o teto do N16: lá a gente avisa que o faturamento VAI estourar; aqui a nota já sai diferente porque estourou.",
  },
  {
    id: "N18",
    o: "Confere se a empresa pode emitir agora",
    variavel: "Falta alguma condição pra emitir?",
    saidas: [
      { se: "não falta nada", vai: "N21" },
      { se: "a empresa não está habilitada no sistema nacional", vai: "N20" },
      { se: "falta a identidade digital da empresa", vai: "N20" },
      { se: "a empresa está impedida por pendência no órgão", vai: "N20" },
      { se: "o órgão está fora do ar", vai: "N22" },
    ],
    ja: "P3.9",
    nota: "🔑 Quatro impedimentos diferentes, e o desenho anterior conhecia um só (a identidade digital). 🔴 CORRIGIDO EM 12/09 pelo FAQ oficial da PBH: eu tinha escrito “falta a habilitação no município” pensando em inscrição municipal, e para o nosso caso ela NÃO entra na nota — empresa com atividade iniciada depois de 12/2025 em BH emite SEM informar a IM. O que sobra é a habilitação no sistema nacional, que é outra coisa. ⚠️ E a identidade digital é a trava de verdade: não existe procuração nem delegação na NFS-e Nacional, e não há data pra existir — só emite quem tem o certificado da própria empresa.",
  },
  {
    id: "N20",
    o: "Emissão parada: diz o que falta, de quem é, e o que destrava",
    variavel: "O impedimento foi resolvido?",
    saidas: [
      { se: "resolvido, dá pra tentar de novo", vai: "N18" },
      { se: "depende de terceiro e não resolve agora", vai: "N22" },
    ],
    ja: "P3.11",
  },
  {
    id: "N22",
    o: "Não dá pra emitir por aqui agora: entrega o caminho alternativo pronto",
    fim: true,
    nota: "🔑 Degradação é rotina, não exceção. O caminho alternativo entrega os dados já prontos pra copiar, não um pedido de desculpas. ↗ o que for emitido por fora volta pela entrada N30.",
  },
  { id: "N21", o: "Transmite a nota ao órgão", saidas: [{ se: "", vai: "N25" }], ja: "P3.5" },
  {
    id: "N25",
    o: "Lê a resposta do órgão",
    variavel: "O órgão aceitou?",
    saidas: [
      { se: "aceitou", vai: "N26" },
      { se: "recusou por dado errado", vai: "N27" },
      { se: "não respondeu a tempo", vai: "N28" },
    ],
    ja: "P3.6",
    nota: "⚠️ 'Não respondeu' não é 'recusou', e tratar os dois igual gera nota duplicada — a pessoa tenta de novo e o órgão já tinha aceitado a primeira.",
  },
  {
    id: "N27",
    o: "Recusou: traduz o erro e deixa corrigir sem redigitar tudo",
    saidas: [{ se: "", vai: "N11" }],
    ja: "P3.8",
  },
  {
    id: "N28",
    o: "Sem resposta: descobre se a nota nasceu antes de deixar tentar de novo",
    variavel: "A nota existe no órgão?",
    saidas: [
      { se: "existe, foi só a resposta que se perdeu", vai: "N26" },
      { se: "não existe", vai: "N21" },
    ],
    nota: "🔴 Variável que não existia em lugar nenhum do desenho anterior.",
  },
  {
    id: "N26",
    o: "A nota existe, e a receita da empresa muda",
    fim: true,
    cobre: ["3.1", "3.2"],
    ja: "P3.7",
    nota: "🆕 12/09, do FAQ da PBH: o número da nota é atribuído pela Sefin Nacional, não pela casa — e a numeração PODE TER PULOS, porque números reservados nem sempre viram nota. O órgão diz com todas as letras que isso “não representa irregularidade fiscal”. 🔑 Consequência de produto: a lista de notas não pode alarmar ninguém com buraco de sequência, e quem apoiar o cliente precisa saber disso antes de ser perguntado.",
    saiPara: "impostos · a receita entra na apuração do mês · pró-labore · muda o Fator R · plano e cobrança · pode mudar a faixa de preço",
  },

  // ── B · A NOTA JÁ EXISTE ──────────────────────────────────────────────────
  {
    entrada: true,
    id: "N29",
    o: "Abre uma nota que já existe",
    variavel: "O que precisa fazer com ela?",
    saidas: [
      { se: "só ver, baixar ou mandar pro cliente", vai: "N31" },
      { se: "tem alguma coisa errada", vai: "N23" },
    ],
    cobre: ["3.2", "3.3"],
  },
  {
    id: "N31",
    o: "Entrega o documento pelo canal escolhido",
    fim: true,
    cobre: ["3.3"],
    nota: "⚠️ Pode virar mais de um passo: 'mandar pro cliente' por canal é coisa diferente de 'baixar', e o registro de que foi enviado pode importar depois.",
  },
  {
    id: "N23",
    o: "Achou um erro numa nota já emitida",
    variavel: "A nota nasceu aqui ou veio de fora?",
    saidas: [
      { se: "nasceu aqui", vai: "N24" },
      { se: "veio de fora", vai: "N33" },
    ],
    ja: "P6.2",
    cobre: ["3.4"],
  },
  {
    id: "N24",
    o: "Confere se ainda dá pra mexer nessa nota",
    variavel: "O que o município permite para esta nota?",
    saidas: [
      { se: "dentro de 2 anos e sem bloqueio: dá pra resolver sozinho", vai: "N32" },
      { se: "passou de 2 anos da emissão", vai: "N41" },
      { se: "o Fisco bloqueou o caminho automático desta nota", vai: "N41" },
    ],
    ja: "P6.3",
    nota: "🔴 REESCRITO EM 12/09 com o texto da Portaria SMFA 075/2025 na mão (art. 5º, transcrito no FAQ oficial da PBH). Em BH as condições do caminho automático são só DUAS, cumulativas: emissão há no máximo 730 dias, e o Fisco não ter bloqueado esta nota. A terceira que constava — “CPF ou CNPJ do tomador informado” — foi REVOGADA pela Portaria 88/2025, art. 3º. ⚠️ O leiaute nacional lista mais recusas (valor acima do permitido, tributos já recolhidos): ele descreve o que o sistema PODE recusar, a portaria diz o que BH parametrizou. Para BH, manda a portaria. 🔑 E não atender as condições NÃO é fim de linha: o §3º manda pra análise do Fisco.",
  },
  {
    id: "N32",
    o: "Decide o que fazer com a nota errada",
    variavel: "O que exatamente está errado?",
    saidas: [
      { se: "a nota não deveria existir", vai: "N35" },
      { se: "o valor, a competência ou quem é o cliente", vai: "N35" },
      { se: "o serviço: código, descrição ou onde foi prestado", vai: "N51" },
      { se: "só o texto livre da descrição", vai: "N38" },
    ],
    ja: "P6.7",
    nota: "🔴 CORRIGIDO EM 12/09 CONTRA A FONTE PRIMÁRIA, e o erro era meu. Eu tinha desenhado “valor errado → substitui”. A regra **E0061** do leiaute nacional proíbe: para optante do Simples ME/EPP (`opSimpNac = 3`), a substituição **não pode alterar tomador, competência nem valor do serviço**. Então errar o valor não tem caminho de conserto: é cancelar e emitir de novo. O que a substituição carrega, no nosso regime, é o SERVIÇO — código, subitem, local da prestação e descrição.",
  },
  {
    id: "N51",
    o: "Confere se essa nota ainda aceita substituição",
    variavel: "Alguma coisa impede substituir?",
    saidas: [
      { se: "nada impede", vai: "N37" },
      { se: "a nota já foi cancelada antes", vai: "N39" },
      { se: "passou de 2 anos da emissão", vai: "N52" },
      { se: "o Fisco bloqueou a substituição desta nota", vai: "N39" },
      { se: "há pedido de análise fiscal esperando resposta", vai: "N39" },
      { se: "o cliente já confirmou essa nota", vai: "N39" },
    ],
    nota: "🔑 Cinco travas, todas com código no leiaute: **E0046** (cancelada não se substitui) · **E0050** (prazo do município) · **E0056** (sem tomador identificado) · **E0068** (análise fiscal pendente) · **E0070** (o tomador já manifestou confirmação).\n\n🔴 A última é a que amarra as duas pontas desta categoria: **a confirmação do tomador TRAVA a substituição**. A máquina de manifestação que apareceu no N36 não é decorativa — ela decide se a nota ainda pode ser mexida.",
  },
  {
    id: "N52",
    o: "Fora do prazo, mas há uma exceção que pode valer",
    variavel: "O motivo da substituição é mudança de regime?",
    saidas: [
      { se: "é enquadramento ou desenquadramento no Simples", vai: "N37" },
      { se: "é outro motivo qualquer", vai: "N39" },
    ],
    nota: "🔑 A E0050 abre exceção explícita: fora do prazo, ainda dá pra substituir quando a justificativa for **enquadramento ou desenquadramento no Simples Nacional** (`cMotivo` 1 ou 2). É caso nosso, não hipótese: empresa que entra ou sai do Simples precisa refazer notas do período.",
  },
  {
    id: "N35",
    o: "Pede o cancelamento da nota",
    variavel: "O município aceitou?",
    saidas: [
      { se: "cancelou", vai: "N40" },
      { se: "recusou, e dá pra pedir análise", vai: "N41" },
      { se: "recusou em definitivo", vai: "N39" },
    ],
    ja: "P6.9",
  },
  {
    id: "N41",
    o: "Pede análise do cancelamento a quem decide",
    variavel: "A análise voltou como?",
    saidas: [
      { se: "deferida", vai: "N40" },
      { se: "indeferida", vai: "N39" },
      { se: "ainda não voltou", vai: "N41" },
    ],
    nota: "🔑 É o único trecho da categoria que ESPERA, e a espera não tem prazo conhecido. ⚠️ Pode virar mais de um passo.",
  },
  {
    id: "N37",
    o: "Emite a nota certa no lugar da errada, e as duas ficam ligadas",
    saidas: [{ se: "", vai: "N40" }],
    ja: "P6.12",
    nota: "Nenhuma das duas some da lista: a velha fica marcada como substituída. Senão o histórico mente sobre o que foi faturado em cada mês.\n\n🔴 E a substituição exige JUSTIFICATIVA codificada (`cMotivo`), não é campo livre: enquadramento no Simples, desenquadramento, inclusão de dado, e assim por diante. A lista fechada precisa virar as opções que a pessoa vê — em português, não em código.",
  },
  {
    id: "N38",
    o: "Corrige o que não muda o imposto, e guarda o que mudou",
    fim: true,
    ja: "P6.13",
    alerta:
      "⚠️ ESTE NÓ PODE NÃO EXISTIR, e a dúvida é de 12/09.\n\nNo modelo nacional **não há carta de correção** — varri as 655 regras do leiaute e a expressão não aparece uma vez. Em NF-e de mercadoria existe (a CC-e, evento próprio); em NFS-e, não. Corrigir é substituir, e substituir tem as travas do N51.\n\n🔑 O líder tem uma função chamada *“Alterar nota”*, que cobra reabertura de mês. Ela provavelmente **é substituição por baixo** — mas isso é suposição minha, não leitura. Enquanto não confirmar, este nó fica marcado: se ele não existir, o N32 perde uma saída e a categoria muda de forma.",
    nota: "🔴 Se existir, falta a lista do que é neutro. Uma 'correção' que muda a base vira receita falsa, porque este caminho não passa pelo acerto do mês.",
  },
  {
    id: "N39",
    o: "Não dá pra mexer nessa nota: diz por quê e o que sobrou de caminho",
    fim: true,
    ja: "P6.11",
  },
  {
    id: "N40",
    o: "A nota deixou de valer, e a receita do mês cai",
    fim: true,
    ja: "P6.17",
    saiPara: "impostos · a apuração daquele mês muda, e pode já ter virado guia · pró-labore · o Fator R cai · plano e cobrança · a faixa de preço pode mudar",
    nota: "🔴 É o único caminho da categoria que anda PRA TRÁS. Tudo o mais soma.",
  },

  // ── C · NOTA EMITIDA FORA ─────────────────────────────────────────────────
  {
    entrada: true,
    id: "N30",
    o: "Traz pra cá uma nota que foi emitida fora do app",
    variavel: "De onde ela vem?",
    saidas: [
      { se: "a pessoa tem o documento em mãos", vai: "N42" },
      { se: "está no órgão e dá pra buscar", vai: "N42" },
      { se: "a pessoa não tem e não sabe onde está", vai: "N43" },
    ],
    cobre: ["3.7"],
    ja: "P3.10",
    nota: "🔑 Importar não é favor, é o que faz a receita do mês fechar. Sem isso o imposto sai a menor e a conta é de quem emitiu.",
  },
  {
    id: "N42",
    o: "Registra a nota de fora na receita do mês",
    fim: true,
    cobre: ["3.7"],
    saiPara: "impostos · entra na apuração igual a nota nascida aqui",
    nota: "⚠️ Tem variável escondida aqui: se a competência já fechou, importar tem consequência igual à de cancelar. ↗ ver N24.",
  },
  {
    id: "N43",
    o: "A nota existe e não chegou: a receita do mês fica incompleta",
    fim: true,
    nota: "🔴 Caminho sem saída declarado, e é o pior tipo: nada quebra, o imposto simplesmente sai errado. Quem responde é quem emitiu, mas quem calculou fomos nós.",
  },
  {
    id: "N33",
    o: "Registra que uma nota de fora foi cancelada lá fora",
    fim: true,
    ja: "P6.14",
    saiPara: "impostos · a receita do mês cai",
    nota: "Quem cancelou foi o órgão, não a casa. Aceitar a palavra de quem avisa, ou conferir antes de mexer na receita, é variável em aberto.",
  },

  // ── D · NOTA EM QUE A EMPRESA É TOMADORA ──────────────────────────────────
  {
    entrada: true,
    id: "N34",
    o: "A empresa recebeu uma nota de um fornecedor",
    saidas: [{ se: "", vai: "N36" }],
    cobre: ["3.8"],
  },
  {
    id: "N36",
    o: "Diz se reconhece o serviço que está na nota recebida",
    variavel: "A empresa reconhece essa nota?",
    saidas: [
      { se: "reconhece e confirma", vai: "N45" },
      { se: "não reconhece e rejeita", vai: "N46" },
      { se: "não faz nada, e o prazo corre", vai: "N47" },
    ],
    cobre: ["3.8"],
    nota: "🔴 MÁQUINA DE ESTADOS QUE NÃO EXISTIA EM LUGAR NENHUM NOSSO, e ela não é opcional: quem emite, quem toma e quem intermedeia podem confirmar ou rejeitar, e existe confirmação por decurso de prazo. Achado de 12/09, na documentação oficial.",
  },
  { id: "N45", o: "Confirmou: a nota recebida vale, com efeito na contabilidade", fim: true, saiPara: "estar em dia · a nota tomada entra na escrita" },
  {
    id: "N46",
    o: "Rejeitou: a nota recebida é contestada",
    variavel: "A rejeição se mantém?",
    saidas: [
      { se: "se mantém", vai: "N48" },
      { se: "foi anulada", vai: "N45" },
    ],
    nota: "A rejeição pode ser anulada depois, então o estado não é final na hora em que acontece.",
  },
  { id: "N48", o: "Rejeição mantida: a nota não produz efeito pra empresa", fim: true },
  {
    id: "N47",
    o: "Ninguém se manifestou e o prazo passou: vale como confirmada",
    fim: true,
    nota: "🔑 Silêncio tem consequência. Se a pessoa nunca abre o app, ela concorda com tudo por omissão — e isso precisa ser dito antes, não depois.",
  },

  // ── E · A EQUIPE EMITE ────────────────────────────────────────────────────
  {
    entrada: true,
    id: "N44",
    o: "Pede que a equipe emita a nota no lugar da pessoa",
    variavel: "A equipe tem tudo o que precisa?",
    saidas: [
      { se: "tem tudo", vai: "N21" },
      { se: "falta informação da pessoa", vai: "N49" },
    ],
    cobre: ["3.9"],
    saiPara: "plano e cobrança · é serviço avulso, e o pedido nasce lá",
  },
  {
    id: "N49",
    o: "A equipe precisa de informação que só a pessoa tem",
    variavel: "A informação chegou?",
    saidas: [
      { se: "chegou", vai: "N21" },
      { se: "não chegou e o mês está acabando", vai: "N50" },
    ],
  },
  {
    id: "N50",
    o: "O mês virou sem a nota sair",
    fim: true,
    nota: "🔴 Quem responde pelo atraso quando o serviço foi contratado e a informação não veio? Não é pergunta de tela, é de responsabilidade.",
    saiPara: "plano e cobrança · o avulso foi pago e não foi entregue",
  },
];
