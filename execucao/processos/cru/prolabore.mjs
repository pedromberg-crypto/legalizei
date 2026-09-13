/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 👥 PRÓ-LABORE E SÓCIOS — varredura crua (13/09), 1ª passada
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Regras do modo: `cru/_como-funciona.md`. Só O QUE PRECISA ACONTECER e O QUE
 * DECIDE O CAMINHO. Sem quem executa, sem tela, sem API, sem semáforo.
 *
 * 🔒 ESCOPO: ME do Simples, Anexos III e V, com ou sem Fator R (`_escopo.mjs`).
 *
 * ── 🔑 POR QUE ESTA CATEGORIA VEIO ANTES DE LAPIDAR IMPOSTOS ───────────────
 *
 * O `I5` de Impostos pergunta "qual anexo vale nesta competência?" e NÃO TEM
 * RESPOSTA sozinho: o Fator R é folha ÷ receita, e a folha nasce aqui. O Pedro
 * mandou inverter em 13/09, e é a ordem certa.
 *
 * 🔑 O FATOR R NÃO É DESTA CATEGORIA NEM DE IMPOSTOS. Ele recebe receita (que
 * nasce em Notas), recebe folha (que nasce aqui) e entrega o Anexo (que
 * Impostos usa). É fronteira dos dois lados. O motor em si já está escrito em
 * 7 regras em `produto/funcionalidades/aliquota-e-enquadramento.md`.
 *
 * ── 🔴 QUATRO COISAS QUE O P5 NÃO CONHECE, E ESTÃO NA EVIDÊNCIA ────────────
 *
 * 1. **DÉBITO FEDERAL PROÍBE DISTRIBUIR LUCRO**, com multa de 50% sobre o
 *    distribuído. Guia não paga → o sócio NÃO PODE tirar dinheiro da empresa.
 *    Isso eleva "saber que o imposto foi pago" de higiene contábil para o que
 *    LIBERA O DONO A RECEBER.
 * 2. **O Fator R soma por RUBRICA, não por total.** O líder marca `incideINSS`
 *    em cada linha da folha (296 de 606 incidem). O numerador não é "tudo que
 *    se paga" — nem toda linha do recibo entra.
 *
 * ── ✅ O QUE A PESQUISA DE 13/09 FECHOU (fonte no `produto/evidencias/`) ────
 *
 * A varredura nasceu com três dúvidas de motor. Duas morreram, uma piorou:
 *
 *   ✅ CPP dentro do DAS CONTA no numerador, e é PACÍFICO (SC COSIT 17/2021).
 *      Eu tinha declarado como controvérsia aberta. Não era.
 *   ✅ Piso e teto do INSS agora têm valor e portaria (L9). E o
 *      `valorMaximoInss: 932.3105` do líder é 11% × 8.475,55 EXATO — não era
 *      arredondamento tosco, era precisão.
 *   🔴 O Fator R é REGIME DE CAIXA, confirmado com norma. Declarado e não pago
 *      NÃO conta, e o preço tem artigo: glosa, reclassificação de ofício e
 *      multa de 75%. O L12 não melhorou, ficou mais caro.
 *
 * 🔴 E APARECEU UM NÓ NOVO QUE NÃO EXISTIA: o L4b. Empresa com menos de 13
 * meses tem a FOLHA anualizada junto com a receita (Res. CGSN 140/2018
 * art. 26 §4º). Somar a folha crua contra a receita anualizada joga o cliente
 * recém-aberto no Anexo V sem merecer — e recém-aberto é a MAIORIA nossa.
 *
 * ⚠️ Metade da pesquisa NÃO é desta categoria e ficou de fora de propósito:
 * salário, 13º, férias e FGTS são folha e aqui são FORA DO ESCOPO; RBT12,
 * faixas e alíquota efetiva são
 * impostos; RPA de autônomo e aluguel ao sócio nunca foram travados na persona
 * e não entram por conta própria.
 * 3. ❌ **RETIRADO EM 13/09 — ERA DELÍRIO COPIADO DO LÍDER.** Aqui estava
 *    escrito que o benefício do sócio (plano de saúde) desconta do pró-labore (FORA DO ESCOPO).
 *    É verdade na plataforma dele e **é perfeitamente legal** num ME Anexo III
 *    — por isso a trava de escopo não pegou. Só que o **nosso** sócio não tem
 *    benefício nenhum — FORA DO ESCOPO (Pedro, 13/09). Foi este item que fez nascer o
 *    `_persona.mjs`: eu copiei o mundo do líder sem perguntar se é o nosso.
 * 4. **Lucro é inferido do EXTRATO**: "qualquer retirada que não seja
 *    pró-labore nem devolução de empréstimo". Não é ato declarado, é saque
 *    identificado. ⚠️ E a casa travou em 09/09 que não terá conta nem
 *    integração bancária — então esse caminho, pra nós, não existe como está.
 *
 * 🔴 DÍVIDA TÉCNICA DECLARADA EM 13/09 — ESTE MAPA ASSUME **UM** SÓCIO.
 *
 * O Pedro travou a persona no mesmo dia: *"temos que ter a variável para
 * unipessoal e também para até 3 sócios além do que constitui"* — ou seja **1 a 4
 * é FAIXA, não default**. Tudo daqui foi escrito com um pró-labore só, e com N
 * sócios muda de verdade: são N valores, N INSS (cada um com teto próprio), N
 * IRRF, o Fator R soma TODOS no numerador, e o lucro sai proporcional às
 * quotas. Os nós L4, L6, L9, L10, L11 e o bloco D inteiro precisam de repasse.
 * Fica declarado em vez de corrigido no susto: repasse com o mapa inteiro na
 * mão é melhor que remendo nó a nó.
 *
 * ⚠️ 1ª PASSADA. Escrita para o Pedro lapidar, não para ser obedecida.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const CATEGORIA = {
  id: "prolabore",
  nome: "Pró-labore e sócios",
  emoji: "👥",
  itens: ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8"],
};

export const NOS = [
  // ── A · A DECISÃO DO MÊS ─────────────────────────────────────────────────
  {
    entrada: true,
    id: "L1",
    o: "Chega o mês e o pró-labore precisa ser decidido",
    saidas: [{ se: "", vai: "L2" }],
    ja: "P5.1",
    nota: "🔑 Quem abre a decisão é a casa, não a pessoa. Esperar ela lembrar é o desenho que produz o mês esquecido — e mês esquecido de pró-labore quebra a contagem do Fator R.",
  },
  {
    id: "L2",
    o: "Olha se houve faturamento no mês",
    variavel: "A empresa faturou nesta competência?",
    saidas: [
      { se: "faturou", vai: "L4" },
      { se: "não faturou nada", vai: "L3" },
    ],
    ja: "P5.4",
    saiPara: "notas · a receita da competência vem de lá",
  },
  {
    id: "L3",
    o: "Mês sem faturamento: oferece não pagar, e diz o preço disso",
    variavel: "Pagar mesmo assim?",
    saidas: [
      { se: "não pagar neste mês", vai: "L14" },
      { se: "pagar mesmo sem faturar, pra segurar o Fator R", vai: "L6" },
    ],
    cobre: ["4.3"],
    ja: "P5.5",
    nota: "🔴 EU TINHA A LÓGICA INVERTIDA AQUI, e a conta real do Pedro provou em 13/09. Estava escrito que não pagar 'derruba o Fator R'. 🔑 O QUE DERRUBA É NÃO PAGAR. Mês sem FATURAR, com o pró-labore pago, EMPURRA o Fator R PRA CIMA — o numerador anda e o denominador não. São duas coisas opostas que eu tinha juntado numa frase só. Na plataforma do líder, maio/2026 teve receita zero e o Fator R melhorou tanto que o motor pôde BAIXAR o pró-labore de R$ 3.360 (que era 0,28 × 12.000, o alvo exato) para R$ 1.621 (o piso legal) sem perder o Anexo III. ✅ E a base legal da escolha existe: pró-labore NÃO é obrigatório todo mês, a obrigação nasce da remuneração efetivamente paga ou creditada (Lei 8.212/91 art. 12 V 'f' e art. 22 III · IN RFB 2.110/2022 art. 8º · SC COSIT 120/2016 e 251/2024). Empresa sem faturamento e sem caixa pode não pagar, sem infração. 🔴 O que NÃO pausa, e isso foi VISTO em produção: maio com receita zero tem PGDAS e DCTFWeb transmitidos igual a qualquer outro mês. Sem transmitir, multa mínima de R$ 200 (IN RFB 2.005/2021 art. 14 §3º I). ⚠️ A pesquisa diz que o 'sem movimento' se declara UMA VEZ por ano, não mês a mês — e o caso do Pedro NÃO testa isso, porque em maio ele pagou pró-labore e houve fato gerador. Continua pra conferir.",
  },
  {
    id: "L4",
    o: "Calcula quanto mantém a empresa no anexo mais barato",
    variavel: "A empresa tem 13 meses de vida?",
    saidas: [
      { se: "tem: janela cheia de 12 meses", vai: "L5" },
      { se: "não tem: a conta é ANUALIZADA dos dois lados", vai: "L4b" },
    ],
    ja: "P5.2",
    saiPara: "impostos · o anexo que sai daqui é o que a apuração usa",
    nota: "🔑 A CONTA, na forma simples: pró-labore necessário = 28% da receita dos 12 meses menos a folha já paga nos 12 meses. ⚠️ JANELA MÓVEL: pagar hoje afeta os próximos 12 meses, e todo mês um mês antigo SAI da janela. Se o mês que sai tinha folha alta, o Fator R cai sozinho sem ninguém mexer em nada — é por isso que 'quanto falta' muda todo mês, e é aí que mora o diferencial nº 2. ✅ A CPP FOI RESOLVIDA EM 13/09: ela CONTA no numerador mesmo estando dentro do DAS, e é ponto pacífico (SC COSIT 17/2021 · Res. CGSN 140/2018 art. 26 §1º III 'a'). O método também veio: pegar o percentual de repartição da CPP no anexo da competência, aplicar sobre o DAS pago e somar ao numerador. ⚠️ Efeito colateral que ninguém tinha notado: como essa parcela é proporcional à RECEITA, ela entra no numerador E no denominador, então amortece o próprio Fator R. Precisa entrar na simulação, não só na conta final.",
  },
  {
    id: "L4b",
    o: "Anualiza a folha também, e não só a receita",
    saidas: [{ se: "", vai: "L5" }],
    saiPara: "impostos · a receita anualizada da mesma competência tem que ser a MESMA dos dois lados",
    nota: "✅ PROVADO NA CONTA REAL DO PEDRO EM 13/09, e não só na pesquisa. Empresa de 9 meses: receita anualizada ≈ R$ 74.547, folha anualizada ≈ R$ 22.085, Fator R ≈ 29,6% → Anexo III, 6%. Se a folha fosse somada CRUA (R$ 16.564) contra a receita anualizada, daria 22,2% → Anexo V, 15,5%. 🔴 O erro custaria, nesta empresa, mais que o dobro de imposto. ⚠️ A conta assume o pró-labore de fev = 3.360 e dez/jan = 0, porque o histórico da plataforma só devolve 6 meses. 🔴 NÓ NOVO EM 13/09, E É O MAIOR ACHADO DA PESQUISA. Empresa com menos de 13 meses não tem 12 meses de histórico, então a receita é anualizada (média dos meses anteriores × 12). 🔑 O QUE NINGUÉM SABIA AQUI: a FOLHA é anualizada pelo MESMO critério — Res. CGSN 140/2018 art. 26 §4º, que manda adotar 'os mesmos critérios' do art. 22. ⚠️ A pesquisa nomeia o erro oposto como falha comum de sistema: anualizar a receita e somar a folha crua. Aí a razão despenca perto de zero e a empresa recém-aberta cai no Anexo V sem merecer. 🔴 E ISSO É O NOSSO CLIENTE TÍPICO, não um caso de canto: o produto nasce da constituição, então a maioria entra com menos de 13 meses de vida. A persona zero tem 9 meses. ⚠️ Detalhe da regra: o mês de abertura conta INTEIRO, sem proporcionalizar por dias.",
  },
  {
    id: "L5",
    o: "Resolve se o alvo é alcançável neste mês",
    variavel: "Dá pra chegar nos 28%?",
    saidas: [
      { se: "dá, e o valor cabe", vai: "L6" },
      { se: "dá, mas o valor é alto demais pra empresa", vai: "L6" },
      { se: "não dá: nem o teto do INSS fecha a conta", vai: "L7" },
    ],
    nota: "🔴 O terceiro caminho não estava em lugar nenhum e é real: empresa que faturou muito num mês pode não conseguir atingir 28% nem pagando o máximo. Aí a resposta certa não é 'pague mais', é 'este mês você fica no Anexo V, e olha o que dá pra fazer nos próximos'.",
  },
  {
    id: "L6",
    o: "Mostra o valor sugerido e deixa mexer, vendo o imposto mudar",
    variavel: "A pessoa aceita o valor sugerido?",
    saidas: [
      { se: "aceita o sugerido", vai: "L9" },
      { se: "quer outro valor", vai: "L8" },
    ],
    cobre: ["4.1"],
    ja: "P5.3",
    nota: "🥇 É O DIFERENCIAL-ÂNCORA do produto. O líder tem 4 presets em radio button e esconde a conta atrás de 'confie na gente'. Aqui a pessoa move e vê INSS, IRRF, Fator R e a alíquota do DAS mudarem na hora. ⚠️ E o `percentualFatorR` viaja no payload do líder enquanto a tela dele só desenha '≥28%' — esconder é DECISÃO DE PRODUTO dele, não limitação técnica. 🔴 A PESQUISA DE 13/09 ACRESCENTOU UM RISCO QUE O SLIDER PRECISA CONHECER: arrastar o valor pro mínimo enquanto a empresa fatura alto não é neutro. A Receita e o CARF tratam isso como **Distribuição Disfarçada de Lucros** (Decreto-Lei 1.598/77 art. 60): reclassificam o que foi chamado de lucro isento em remuneração de trabalho, com IRRF de até 35%, INSS patronal e do segurado, e multa de ofício de 75% — que vira 150% se caracterizarem simulação. ⚠️ Cuidado com o que isso NÃO autoriza: a própria pesquisa sugere 'parametrizar o software para IMPEDIR', e isso contraria a régua travada pelo Pedro no mesmo dia. Aqui o slider AVISA, mostra o risco de um valor desproporcional, e deixa a pessoa decidir. INFORMAR, nunca TUTELAR.",
  },
  {
    id: "L7",
    o: "Explica que o mês fecha no Anexo V, e o que muda daqui pra frente",
    saidas: [{ se: "", vai: "L6" }],
    saiPara: "impostos · a alíquota deste mês sai mais cara, e a apuração precisa saber",
  },
  {
    id: "L8",
    o: "A pessoa escolhe outro valor",
    saidas: [{ se: "", vai: "L9" }],
  },
  {
    id: "L9",
    o: "Confere se o valor respeita os limites",
    variavel: "O valor cabe nas regras?",
    saidas: [
      { se: "cabe", vai: "L10" },
      { se: "está abaixo do piso do salário mínimo", vai: "L8" },
      { se: "passa do teto de contribuição do INSS", vai: "L8" },
      { se: "o sócio já contribui por fora e tem folga no teto", vai: "L10" },
    ],
    cobre: ["4.6"],
    nota: "✅ OS DOIS LIMITES AGORA TÊM VALOR E PORTARIA (pesquisa de 13/09): piso = salário mínimo de 2026, **R$ 1.621,00** — o salário de contribuição não pode ser menor, mesmo para contribuinte individual. Teto = **R$ 8.475,55**, fixado pela Portaria Interministerial MPS/MF nº 13 de 09/01/2026, art. 2º. 🔑 E ISSO FECHA UMA DÚVIDA QUE EU TINHA DEIXADO EM ABERTO: o `valorMaximoInss: 932.3105` do líder, com 4 casas, NÃO é arredondamento tosco — é 11% × 8.475,55 exato. Fonte externa e plataforma do líder batendo na quarta decimal, então o número certo a guardar é 932,3105 e o arredondamento acontece só na exibição. ⚠️ O piso de R$ 1.621,00 veio de fonte única: conferir antes de virar trava. 🔑 O duplo vínculo entra AQUI, e não como funcionalidade separada: quem já contribui como CLT tem folga no teto, e isso muda quanto sai de INSS. O dado é captado na constituição (tela C2).",
  },
  {
    id: "L10",
    o: "Trava o valor do mês e monta o que vai ser declarado",
    saidas: [{ se: "", vai: "L11" }],
    ja: "P5.6",
    nota: "🔴 E aqui entra o que a evidência revelou e o P5 não sabia: o recibo tem LINHAS, e nem toda linha conta pro Fator R. O líder marca `incideINSS` por rubrica — 296 de 606 incidem. ⚠️ Mas ATENÇÃO ao tamanho disso no NOSSO caso: as 606 rubricas dele existem porque a plataforma dele atende folha completa e benefício, que são FORA DO ESCOPO aqui. Nosso sócio recebe pró-labore e ponto, então o recibo tem pouquíssimas linhas. O que fica de pé é a REGRA (somar por rubrica, não por total), não o volume.",
  },
  {
    id: "L11",
    o: "Declara o pró-labore e gera a guia do INSS",
    saidas: [{ se: "", vai: "L12" }],
    cobre: ["4.5"],
    ja: "P5.7",
    saiPara: "impostos · a guia do INSS chega na mesma lista do DAS e da taxa municipal",
  },

  // ── B · O PAGAMENTO, QUE É O QUE VALE ────────────────────────────────────
  {
    id: "L12",
    o: "Confere se o dinheiro saiu de fato da empresa pro sócio",
    variavel: "O pró-labore foi efetivamente pago?",
    saidas: [
      { se: "foi pago", vai: "L13" },
      { se: "foi declarado e não foi pago", vai: "L14" },
      { se: "ainda não dá pra saber", vai: "L12" },
    ],
    ja: "P5.8",
    nota: "🔴 CONTINUA SENDO O VERMELHO DA CATEGORIA, E A PESQUISA DE 13/09 DEIXOU ELE PIOR, NÃO MELHOR. Agora está confirmado com norma: o numerador do Fator R é **REGIME DE CAIXA**, valor efetivamente PAGO, qualquer que seja o regime de apuração da receita (Res. CGSN 140/2018 art. 26 §6º · SC COSIT 17/2021 e 251/2024). Pró-labore transmitido no eSocial e parado como 'obrigação com sócios' no passivo **NÃO CONTA**, e a Receita cruza EFD-Reinf, e-Financeira e PGDAS-D pra achar. 🔴 O preço, agora com artigo: glosa → **reclassificação de ofício** pro Anexo V → recálculo de TODAS as competências afetadas → diferença de alíquota (6% vira 15,5%) + Selic + **multa de ofício de 75%** (Lei 9.430/96 art. 44 I). ⚠️ E o caminho continua não existindo: o dinheiro vai da empresa pro sócio sem passar por nós nem pelo governo, não há API, e o único rastro previsto é o extrato que o cliente envia até o 5º dia útil (cláusula 5.4). 🔑 A pesquisa dá o requisito de arquitetura: o Fator R só pode ser alimentado DEPOIS da baixa do título, nunca no fechamento da folha. Ou seja, o app precisa de um estado 'declarado mas não pago' que hoje não existe em lugar nenhum.",
  },
  {
    id: "L13",
    o: "Entra na folha dos 12 meses e o anexo se sustenta",
    fim: true,
    ja: "P5.9",
    saiPara: "impostos · é este número que decide o anexo da apuração",
  },
  {
    id: "L14",
    o: "Fica FORA do Fator R, e a pessoa precisa saber o que isso custa",
    fim: true,
    ja: "P5.10",
    saiPara: "impostos · a alíquota do mês muda · estar em dia · vira pendência",
    nota: "⚠️ Serve pros dois casos: o mês em que se decidiu não pagar, e o mês em que se declarou e não se pagou. O segundo é mais perigoso, porque parece resolvido. ✅ E a pesquisa de 13/09 fechou COMO o mês vazio entra na conta: ele entra como **ZERO**, não é removido da janela. O calendário não pula mês — a receita continua somando no denominador enquanto o numerador registra 0,00, e o quociente comprime na hora. É a mecânica exata que o alerta do L17 precisa projetar.",
  },

  // ── C · A VIGÍLIA DA JANELA MÓVEL ────────────────────────────────────────
  {
    entrada: true,
    id: "L15",
    o: "Acompanha o Fator R dos 12 meses, mês a mês",
    variavel: "O que a janela móvel mostra?",
    saidas: [
      { se: "folgado, e continua folgado", vai: "L16" },
      { se: "perto de cair pro Anexo V", vai: "L17" },
      { se: "o mês que vai SAIR da janela tinha folha alta", vai: "L17" },
      { se: "já está no Anexo V e dá pra voltar", vai: "L18" },
    ],
    cobre: ["4.2"],
    ja: "P5.11",
    nota: "🔑 A terceira saída é a que ninguém tem, inclusive o líder: o Fator R pode cair SEM NINGUÉM MEXER EM NADA, só porque um mês de folha alta saiu da janela de 12 meses. Vigiar o saldo de hoje não pega isso — só pega quem olha o mês que está prestes a sair.",
  },
  { id: "L16", o: "Nada a avisar neste mês", fim: true },
  {
    id: "L17",
    o: "Avisa ANTES de virar, com o valor exato que resolve",
    fim: true,
    cobre: ["4.2"],
    nota: "🔑 Aviso sem o número que resolve é susto. Tem que dizer quanto falta de pró-labore, não que 'o Fator R está caindo'. ⚠️ E o tempo importa: avisar em janeiro não ajuda, avisar em dezembro não dá tempo — a régua de antecedência não existe e é a mesma da vigília fiscal.",
  },
  {
    id: "L18",
    o: "Mostra o caminho de volta pro Anexo III, se houver",
    fim: true,
    saiPara: "impostos · voltar de anexo muda a alíquota das competências seguintes, não das passadas",
  },

  // ── D · O LUCRO, que não é pró-labore ────────────────────────────────────
  {
    entrada: true,
    id: "L19",
    o: "O sócio quer tirar lucro da empresa",
    saidas: [{ se: "", vai: "L20" }],
    nota: "🔑 LUCRO NÃO É PRÓ-LABORE, e o mapa precisa separar: pró-labore é remuneração de trabalho, entra na folha e paga INSS; lucro é resultado, não entra no Fator R. A pessoa não faz essa distinção, e o app precisa fazer por ela. ✅ Confirmado com norma em 13/09: distribuição de lucro NÃO compõe o numerador do Fator R (Res. CGSN 140/2018 art. 26 §2º). O mesmo dispositivo tira o aluguel pago ao sócio. ⚠️ Requisito que sai disso: as contas de patrimônio líquido e de distribuição precisam ser CEGAS pro acumulador do Fator R, senão a conta infla sozinha.",
  },
  {
    id: "L20",
    o: "Diz o que a pessoa precisa saber antes de sacar",
    variavel: "Há débito federal em aberto?",
    saidas: [
      { se: "está em dia: nada a alertar", vai: "L22" },
      { se: "há guia federal não paga: avisa o risco", vai: "L21" },
    ],
    saiPara: "impostos · a situação das guias é o que muda o AVISO, não a permissão",
    nota: "🔴 REESCRITO EM 13/09 — EU TINHA DESENHADO UMA FECHADURA, E NÃO É NOSSO PAPEL. A versão anterior dizia 'confere se a empresa PODE distribuir' e mandava pra uma porta travada. O Pedro corrigiu a doutrina: *'não é nosso papel regular como é usado esse faturamento, temos apenas que fazer nossa parte de cálculos e guias corretas nas datas corretas'*. 🔑 O fato legal continua de pé — débito federal em aberto torna a distribuição irregular, com multa de 50% sobre o distribuído — mas ele é INFORMAÇÃO QUE A PESSOA PRECISA TER, não permissão que a gente concede. A régua nova, que vale pro produto inteiro: INFORMAR, nunca TUTELAR.",
  },
  {
    id: "L21",
    o: "Avisa o risco, e o que o elimina",
    fim: true,
    saiPara: "impostos · quitar a guia é o que tira o risco",
    nota: "⚠️ Aviso, não bloqueio. A pessoa decide, e decide sabendo. O que não pode acontecer é ela sacar sem nunca ter lido isso em lugar nenhum — que é exatamente o que acontece hoje no líder, onde o assunto não é citado.",
  },
  {
    id: "L22",
    o: "O lucro sai, e precisa ficar identificado pra conta fechar",
    fim: true,
    saiPara: "estar em dia · o lucro sacado entra na EFD-Reinf",
    nota: "🔴 AQUI TEM UM BURACO NOSSO, não do líder, e ele continua aberto (P2.3). Na plataforma dele o lucro é INFERIDO DO EXTRATO — 'qualquer retirada que não seja pró-labore nem devolução de empréstimo' — silenciosamente, sem nunca perguntar nada ao cliente. O Pedro confirmou de dentro: *'em momento nenhum nem cita sobre retirada de lucro'*. ⚠️ A casa travou em 09/09 que NÃO terá conta nem integração bancária, então esse caminho não existe pra nós. Ou o lucro vira ato DECLARADO no app, ou a gente não sabe que ele saiu — e identificar não é vigiar: é o que faz a conta fechar. 📅 Desde 2026 (Lei 15.270/2025) o lucro sacado vai pra EFD-Reinf com IRRF antecipado.",
  },

  // ── E · O CADASTRO DO SÓCIO ──────────────────────────────────────────────
  {
    entrada: true,
    id: "L23",
    o: "Muda alguma coisa na situação do sócio",
    variavel: "O que mudou?",
    saidas: [
      { se: "passou a ter (ou deixou de ter) vínculo CLT por fora", vai: "L24" },
      { se: "entrou ou saiu um sócio", vai: "L27" },
    ],
    cobre: ["4.6"],
    nota: "❌ Tinha QUATRO saídas aqui, e DUAS foram removidas em 13/09 pela trava de persona: 'entrou ou saiu um benefício' (FORA DO ESCOPO, junto com o L26) e 'mudou o número de dependentes' (junto com o L25). As duas moravam aqui porque eu copiei o cadastro do líder, não porque alguém pediu.",
  },
  {
    id: "L24",
    o: "Recalcula a folga no teto do INSS",
    fim: true,
    cobre: ["4.6"],
    nota: "⚠️ Quem já contribui por fora não recolhe duas vezes até o teto. Muda o valor líquido do sócio sem mudar o valor declarado.",
  },
  /* ❌ L25 REMOVIDO EM 13/09 — "Recalcula a dedução do IRRF" por mudança de
     dependentes. O Pedro travou que NÃO captamos dependente de sócio — FORA DO ESCOPO: isso
     existe só em folha, para colaborador — FORA DO ESCOPO aqui.
     🔑 A consequência fica: o IRRF do pró-labore sai SEM dedução por pessoa a
     cargo, então sobra o desconto simplificado (`deducaoSimplificada`) como
     única via. Deixou de ser buraco do handoff e virou decisão.
     Id vago de propósito, igual ao L26 — renumerar apagaria o rastro. */
  /* ❌ L26 REMOVIDO EM 13/09 — "O benefício passa a descontar do pró-labore" — FORA DO ESCOPO.
     O nó existia por imitação da plataforma do líder. Nosso sócio não tem
     benefício — FORA DO ESCOPO (Pedro, 13/09), então o nó não descrevia processo nosso nenhum.
     O id fica vago de propósito: renumerar apagaria o rastro de que ele
     existiu, e o rastro é a lição. Ver `_persona.mjs`. */
  {
    id: "L27",
    o: "Muda quem recebe pró-labore na empresa",
    fim: true,
    saiPara: "documentos · entrada ou saída de sócio é alteração contratual, e isso é outro rito",
    nota: "✅ CONFIRMADO COM NORMA EM 13/09: quem recebe pró-labore é quem ADMINISTRA — só o sócio que presta serviço à sociedade é segurado obrigatório como contribuinte individual (Lei 8.212/91 art. 12 V 'f'). O sócio que só investiu capital e não exerce gestão **não precisa** receber pró-labore, e tem direito apenas à parcela dos lucros. ⚠️ O dado vem da constituição (qualificação 49 × 22), e com 1 a 4 sócios isso deixa de ser detalhe: o mapa precisa distinguir quem entra na conta do Fator R de quem não entra.",
  },

  // ── F · OS DOCUMENTOS DO SÓCIO ───────────────────────────────────────────
  {
    entrada: true,
    id: "L28",
    o: "O sócio precisa comprovar o que recebeu",
    variavel: "Qual documento?",
    saidas: [
      { se: "o recibo do mês", vai: "L29" },
      { se: "o informe de rendimentos do ano", vai: "L30" },
    ],
    cobre: ["4.4"],
  },
  { id: "L29", o: "Entrega o recibo do mês", fim: true, cobre: ["4.4"] },
  {
    id: "L30",
    o: "Confere se o informe do ano pode ser fechado",
    variavel: "Tem alguma pendência travando?",
    saidas: [
      { se: "nada trava: o informe sai", vai: "L31" },
      { se: "o período contábil está fechado", vai: "L32" },
      { se: "há outra pendência no caminho", vai: "L32" },
    ],
    cobre: ["4.4"],
    nota: "🔴 O líder tem CINCO estados de bloqueio do informe, e o mapa anterior não conhecia nenhum. O informe não é documento que se imprime: é documento que depende da contabilidade estar fechada.",
  },
  { id: "L31", o: "Entrega o informe de rendimentos do ano", fim: true, cobre: ["4.4"] },
  {
    id: "L32",
    o: "Diz o que trava o informe e o que custa destravar",
    fim: true,
    saiPara: "plano e cobrança · reabrir o balanço é serviço avulso, e caro",
    nota: "⚠️ São DUAS reaberturas diferentes, e confundi-las custa dinheiro: reabrir o MÊS (R$21,90 no líder) é o que se faz pra mexer numa nota; reabrir o BALANÇO (R$142,90) é o que destrava o informe anual. Sete vezes mais caro.",
  },

  // ── G · MEXER EM MÊS JÁ PROCESSADO ───────────────────────────────────────
  {
    entrada: true,
    id: "L33",
    o: "Quer mudar o pró-labore de um mês que já foi declarado",
    variavel: "Em que pé está aquela competência?",
    saidas: [
      { se: "ainda não foi declarada", vai: "L10" },
      { se: "já foi declarada", vai: "L34" },
    ],
    cobre: ["4.8"],
    ja: "P5.7",
  },
  {
    id: "L34",
    o: "Retifica a declaração do mês, com o efeito que isso arrasta",
    fim: true,
    cobre: ["4.8"],
    saiPara: "impostos · muda a folha dos 12 meses, logo muda o Fator R, logo pode mudar o anexo de várias competências · plano e cobrança · retificação é serviço avulso",
    nota: "🔴 É o efeito dominó desta categoria, e ele é pior que o de Notas: mexer num mês de folha altera a JANELA DE 12 MESES inteira, então pode mudar o anexo de vários meses de uma vez. ⚠️ E retificação exige contador — é responsabilidade técnica, não botão.",
  },
];
