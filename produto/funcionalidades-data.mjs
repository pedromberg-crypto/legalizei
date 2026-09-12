/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AS 58 FUNCIONALIDADES CORE DO ME NO SIMPLES — a fonte.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Esta é a lista que o Pedro mandou pro Mauro em 11/09
 * (`funcionalidades-legalizai.pdf`) e ratificou em 12/09 como **a lista core
 * oficial**, com três decisões no mesmo ato:
 *
 *   ✅ a folha de pagamento (§8, 9 itens) ENTRA no MVP
 *   🔴 "acesso do 2º sócio" SAI (era 1.5 do catálogo)
 *   🔴 "pagar o DAS dentro do app" SAI (era 2.3; decidido não fazer em 27/07)
 *
 * ⚠️ A NUMERAÇÃO É A DO PDF, não a do `_catalogo.md`. Os dois cortes acima
 * renumeraram §1 e §2, então 7 itens têm número diferente lá. Exemplo que já
 * mordeu: `2.6` é "minhas alíquotas" no catálogo e "recalcular guia vencida"
 * aqui. Ao citar, escreva o NOME junto do número.
 *
 * ── 🔴 POR QUE O SEMÁFORO NÃO SE DIGITA ────────────────────────────────────
 *
 * A luz de cada item é **derivada**, nunca escrita à mão:
 *
 *   🟢  tem tela E tem processo   — sabemos onde acontece e o que acontece
 *   🟡  tem só um dos dois        — metade resolvida
 *   🔴  não tem nenhum            — só o nome
 *
 * Status digitado é a coisa que mais apodrece neste vault, e há duas provas:
 * a coluna "Cobertura" do `_catalogo.md`, que envelheceu, e o campo `cobre` do
 * `portal-data.mjs`, que a regra de 11/09 criou e que hoje está preenchido em
 * **1 de 25 telas**. As duas perguntas abaixo, ao contrário, são checáveis
 * contra arquivo real — e o gerador checa:
 *
 *   tela     · a rota existe em `app/src/app`?
 *   processo · o id do passo existe em `processos/processos-data.mjs`?
 *
 * ── COMO SE ESCREVE UMA LINHA ──────────────────────────────────────────────
 *
 *   id        · o número do PDF. Estável: é por ele que a casa cita.
 *   secao     · id de uma das 8 seções de SECOES.
 *   nome      · o nome do PDF, literal. Se mudar aqui, muda no que vai pro
 *               Mauro — é a mesma fonte.
 *   tela      · rota no app (`/impostos`), caminho de arquivo quando a coisa
 *               é componente e não rota, ou `null`.
 *   processo  · ids de passos que REALIZAM a funcionalidade. Vazio é resposta
 *               legítima e comum: a maior parte do produto ainda não tem
 *               processo desenhado.
 *   nota      · só quando ganha o espaço. Serve pra three coisas: dizer que a
 *               cobertura é PARCIAL, nomear um buraco, ou registrar decisão.
 *
 * 🔴 **Avulso: a mecânica não é a execução.** Vários itens moram em
 * `/mais/servicos` e são vendidos pelo P4. O P4 cobre **pedir e cobrar** um
 * serviço qualquer; ele não cobre **entregar** aquele serviço específico. Por
 * isso esses itens ficam com `processo: []` e uma nota — marcar o P4 neles
 * faria o placar dizer que a casa sabe emitir uma DECORE, e ela não sabe.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const SECOES = [
  { id: "home", emoji: "🏠", nome: "Home e navegação" },
  { id: "impostos", emoji: "🏛", nome: "Impostos" },
  { id: "notas", emoji: "🧾", nome: "Notas fiscais" },
  { id: "prolabore", emoji: "👥", nome: "Pró-labore e sócios" },
  { id: "emdia", emoji: "✅", nome: "Estar em dia" },
  { id: "documentos", emoji: "📄", nome: "Documentos e certificado" },
  { id: "plano", emoji: "💳", nome: "Plano e cobrança" },
  { id: "folha", emoji: "👷", nome: "Folha de pagamento" },
];

export const FUNCIONALIDADES = [
  // ── 🏠 HOME E NAVEGAÇÃO ───────────────────────────────────────────────────
  {
    id: "1.1",
    secao: "home",
    nome: "Home “o que fazer hoje”, com um foco por vez",
    tela: "/inicio",
    processo: [],
    nota: "A home não é processo: ela é a LEITURA de todos os outros. Só vai poder dizer o foco do dia quando os processos que a alimentam existirem.",
  },
  { id: "1.2", secao: "home", nome: "Home do dia 1, para quem acabou de abrir", tela: "/home-dia1", processo: [] },
  { id: "1.3", secao: "home", nome: "Navegação em 4 abas, com emitir nota no centro", tela: "app/src/app/(app)/(portal)/layout.tsx", processo: [] },
  {
    id: "1.4",
    secao: "home",
    nome: "Central de avisos — precisa de você · aconteceu na conta · vale saber · momento",
    tela: "/avisos",
    processo: [],
    nota: "🔴 Onze passos do P1 ao P5 terminam em “avisa”, e nenhum processo desenha o canal. É o candidato mais forte a processo próprio: hoje cada passo promete um aviso que ninguém sabe como sai.",
  },
  { id: "1.5", secao: "home", nome: "Conteúdo e micro-educação", tela: "/blog", processo: [] },

  // ── 🏛 IMPOSTOS ───────────────────────────────────────────────────────────
  { id: "2.1", secao: "impostos", nome: "O DAS do mês: valor, vencimento e composição", tela: "/impostos", processo: ["P2.1"] },
  { id: "2.2", secao: "impostos", nome: "Baixar a guia e copiar o código de barras", tela: "/impostos/pagar", processo: ["P2.1"] },
  { id: "2.3", secao: "impostos", nome: "Histórico de guias pagas", tela: "/impostos/guias", processo: ["P2.6"] },
  {
    id: "2.4",
    secao: "impostos",
    nome: "Saber que foi pago sem perguntar ao cliente",
    tela: null,
    processo: ["P2.2", "P2.3", "P2.4", "P2.5"],
    nota: "É o diferencial nº 1 do teardown e o caso mais claro de “processo sem tela”: quatro passos desenhados, nenhuma tela. Era 🔴 sem caminho até o P2 existir.",
  },
  {
    id: "2.5",
    secao: "impostos",
    nome: "Minhas alíquotas: anexo, ISS e Fator R abertos",
    tela: "/impostos/aliquotas",
    processo: ["P5.9"],
    nota: "⚠️ PARCIAL: o P5.9 mantém o Fator R e o anexo que vale no mês. A composição do ISS de BH e a memória de cálculo não vêm de processo nenhum, vêm do motor fiscal.",
  },
  { id: "2.6", secao: "impostos", nome: "Recalcular e reemitir guia vencida", tela: "/mais/servicos", processo: ["P2.7"] },
  {
    id: "2.7",
    secao: "impostos",
    nome: "Simulador de impostos do mês seguinte",
    tela: null,
    processo: [],
    nota: "Mesma engine do 2.1 rodando com notas hipotéticas. Sem dependência externa: é trabalho nosso, não bloqueio de terceiro.",
  },
  {
    id: "2.8",
    secao: "impostos",
    nome: "Débito automático do DAS",
    tela: null,
    processo: [],
    nota: "⚠️ Não confundir com o “pagar o DAS no app”, que SAIU do escopo em 12/09. Este sobrevive como benefício de plano e exige mandato bancário.",
  },

  // ── 🧾 NOTAS FISCAIS ──────────────────────────────────────────────────────
  { id: "3.1", secao: "notas", nome: "Emitir NFS-e pedindo só valor e cliente", tela: "/emitir", processo: ["P3.3", "P3.5", "P3.6", "P3.7"] },
  { id: "3.2", secao: "notas", nome: "Lista e gestão das notas emitidas", tela: "/notas", processo: ["P3.7", "P6.12"], nota: "O P6.12 entra aqui por um motivo de desenho: nota substituída NÃO some da lista. As duas ficam, ligadas, com a velha marcada — senão o histórico mente sobre o que foi faturado em cada mês." },
  {
    id: "3.3",
    secao: "notas",
    nome: "Ver, baixar e enviar a nota",
    tela: "/notas/detalhe",
    processo: ["P3.7"],
    nota: "⚠️ PARCIAL: o P3.7 guarda número, PDF e XML. Enviar por canal (WhatsApp, e-mail) não é passo de processo nenhum.",
  },
  {
    id: "3.4",
    secao: "notas",
    nome: "Cancelar, corrigir e reemitir",
    tela: "/notas/detalhe",
    processo: ["P6.7", "P6.8", "P6.9", "P6.12", "P6.13"],
    nota: "🔑 O nome junta TRÊS ações com consequências diferentes, e o P6 as separa: **cancelar** (a nota deixa de valer e a receita cai), **substituir** (nasce nota nova ligada à velha nos dois sentidos) e **corrigir** (muda o que não mexe em imposto). 🔴 Mudar valor não é correção, é substituição — tratar as duas como a mesma coisa faz a receita da competência mentir sem ninguém ver.",
  },
  { id: "3.5", secao: "notas", nome: "Cadastro de clientes, PJ e pessoa física", tela: "/emitir", processo: ["P3.3"] },
  { id: "3.6", secao: "notas", nome: "Sugestão do código do serviço", tela: null, processo: ["P3.4"] },
  { id: "3.7", secao: "notas", nome: "Importar notas emitidas fora do app", tela: null, processo: ["P3.10"] },
  {
    id: "3.8",
    secao: "notas",
    nome: "Registrar notas recebidas de fornecedores",
    tela: null,
    processo: [],
    nota: "Entrada manual ou OCR. Era “fora do MVP” no catálogo; entrou na lista do Mauro sem decisão registrada.",
  },
  {
    id: "3.9",
    secao: "notas",
    nome: "Nota emitida pela nossa equipe",
    tela: "/mais/servicos",
    processo: [],
    nota: "Avulso: o P4 cobre pedir e cobrar, não executar. Por definição é humano.",
  },

  // ── 👥 PRÓ-LABORE E SÓCIOS ────────────────────────────────────────────────
  { id: "4.1", secao: "prolabore", nome: "Pró-labore interativo: mexe e vê o imposto mudar", tela: "/pro-labore", processo: ["P5.2", "P5.3", "P5.6"] },
  { id: "4.2", secao: "prolabore", nome: "Fator R com alerta antes de virar a faixa", tela: "/pro-labore", processo: ["P5.11"] },
  { id: "4.3", secao: "prolabore", nome: "Sem pró-labore em mês sem faturamento", tela: "/pro-labore", processo: ["P5.4", "P5.5"] },
  {
    id: "4.4",
    secao: "prolabore",
    nome: "Recibo de pró-labore e informe de rendimentos",
    tela: null,
    processo: [],
    nota: "Documento gerado pelo motor, sem API externa. O P5 declara e gera a guia, mas nenhum passo produz o recibo nem o informe anual.",
  },
  { id: "4.5", secao: "prolabore", nome: "Guia do INSS do pró-labore", tela: null, processo: ["P5.7"] },
  {
    id: "4.6",
    secao: "prolabore",
    nome: "Duplo vínculo: CLT e sócio na mesma conta",
    tela: "/mais/socios",
    processo: ["P5.3"],
    nota: "⚠️ PARCIAL: o dado é captado na constituição (tela C2) e entra no cálculo do P5.3. O que não existe é a apresentação da folga do teto do INSS, que é o que a pessoa precisa entender.",
  },
  {
    id: "4.7",
    secao: "prolabore",
    nome: "Dependentes para o IRRF",
    tela: null,
    processo: [],
    nota: "🟡 Pergunta aberta do handoff de 12/09: ninguém capta, nem a constituição nem o portal. Entra no cálculo do IRRF do P5.7 e hoje sai sem dedução.",
  },
  {
    id: "4.8",
    secao: "prolabore",
    nome: "Alterar pró-labore de mês já processado",
    tela: "/mais/servicos",
    processo: [],
    nota: "Avulso: retificação de obrigação acessória, exige contador. O P4 cobre pedir e cobrar, não executar.",
  },

  // ── ✅ ESTAR EM DIA ───────────────────────────────────────────────────────
  {
    id: "5.1",
    secao: "emdia",
    nome: "“Você está em dia”, sem jargão",
    tela: "/mais/em-dia",
    processo: [],
    nota: "Como a home, é leitura dos outros: deriva de obrigações do período × entregues. Não vai poder afirmar “em dia” enquanto ninguém desenhar quem entrega o quê.",
  },
  { id: "5.2", secao: "emdia", nome: "Declarações entregues: DEFIS, DCTF, SPED", tela: "/mais/declaracoes", processo: [] },
  { id: "5.3", secao: "emdia", nome: "Calendário de obrigações do mês", tela: "/obrigacoes", processo: [] },
  {
    id: "5.4",
    secao: "emdia",
    nome: "Vigília fiscal preditiva: avisa antes do problema",
    tela: "/inicio",
    processo: ["P5.11"],
    nota: "⚠️ PARCIAL, e é o diferencial nº 2: o P5.11 vigia só o Fator R. O teto do Simples e a virada de faixa de RBT12 não têm passo nenhum.",
  },
  {
    id: "5.5",
    secao: "emdia",
    nome: "Verificação de pendências nos órgãos",
    tela: "/mais/servicos",
    processo: [],
    nota: "Avulso sob demanda. ⚠️ O catálogo trava que o MONITORAMENTO passivo fica grátis e core; só a consulta avulsa se cobra. O monitoramento não tem tela nem processo.",
  },
  { id: "5.6", secao: "emdia", nome: "Relatórios contábeis: DRE, balanço, razão", tela: "/mais/relatorios", processo: [] },

  // ── 📄 DOCUMENTOS E CERTIFICADO ───────────────────────────────────────────
  { id: "6.1", secao: "documentos", nome: "Documentos da empresa num lugar só", tela: "/mais/documentos", processo: [] },
  {
    id: "6.2",
    secao: "documentos",
    nome: "Certificado digital resolvido nos bastidores",
    tela: "/mais/certificado",
    processo: ["P3.9", "P3.11"],
    nota: "⚠️ PARCIAL, e a fronteira importa: o P3 trata o certificado como GATE (está válido? senão para a emissão). A obtenção e a renovação são da certificadora parceira, e a plataforma interna que recebe o arquivo e a senha ainda não existe.",
  },
  { id: "6.3", secao: "documentos", nome: "Emissão de certidão negativa", tela: "/mais/servicos", processo: [], nota: "Avulso: o P4 cobre pedir e cobrar, não executar." },
  {
    id: "6.4",
    secao: "documentos",
    nome: "Declaração de faturamento, para abrir conta PJ",
    tela: "/mais/servicos",
    processo: [],
    nota: "🔴 Candidato a virar CORE (catálogo): é dor do dia 1 do nosso ICP, e cobrar por isso é o que a gente critica no líder. Decisão nunca tomada.",
  },
  { id: "6.5", secao: "documentos", nome: "DECORE, comprovante de renda do sócio", tela: "/mais/servicos", processo: [], nota: "Avulso: exige protocolo no CRC pelo contador. Não automatizável." },
  { id: "6.6", secao: "documentos", nome: "Dados da empresa sempre atualizados", tela: "/mais/empresa", processo: [] },

  // ── 💳 PLANO E COBRANÇA ───────────────────────────────────────────────────
  { id: "7.1", secao: "plano", nome: "Plano, próxima fatura e avulsos contratados", tela: "/mais/plano", processo: ["P1.1", "P1.6", "P4.7", "P4.11"] },
  {
    id: "7.2",
    secao: "plano",
    nome: "Trocar a forma de pagamento",
    tela: "/mais/plano",
    processo: [],
    nota: "🔴 O P1.4 cobra NA forma cadastrada e o P1.8 oferece “trocar a forma” dentro de um aviso de inadimplência — mas trocar não é passo de ninguém. E o handoff de 12/09 abriu a pergunta antes dela: o pagamento da abertura chega a deixar uma forma salva?",
  },
  { id: "7.3", secao: "plano", nome: "Histórico de faturas", tela: "/mais/plano", processo: ["P1.6"] },
  {
    id: "7.4",
    secao: "plano",
    nome: "Cancelar o plano sem punição",
    tela: "/mais/plano",
    processo: [],
    nota: "🔴 É posicionamento âncora (o líder cobra R$1.406–1.999 pra sair) e não tem processo. O P4.10 trata o avulso DURANTE o cancelamento e o P1.9/P1.10 tratam a saída por inadimplência; a saída voluntária não existe em lugar nenhum. Candidato a processo próprio.",
  },
  { id: "7.5", secao: "plano", nome: "Loja de serviços avulsos", tela: "/mais/servicos", processo: ["P4.1", "P4.2", "P4.5", "P4.7"] },
  { id: "7.6", secao: "plano", nome: "Perfil, conta e acesso", tela: "/perfil", processo: [] },
  { id: "7.7", secao: "plano", nome: "Reajuste anual com regra anunciada", tela: null, processo: ["P1.2", "P1.3"] },

  // ── 👷 FOLHA DE PAGAMENTO ─────────────────────────────────────────────────
  // 🔴 Seção inteira ENTROU no MVP em 12/09, decisão do Pedro. A nota funda da
  // capacidade (`funcionalidades/folha-de-pagamento.md`) ainda declara
  // `cobertura: nao-existe · balde: backlog`, com 3 bloqueios nomeados —
  // precisa ser atualizada junto do ADR, senão a casa passa a ter duas
  // respostas pra mesma pergunta.
  {
    id: "8.1",
    secao: "folha",
    nome: "Cadastro do colaborador: PIS, cargo, dependentes",
    tela: "/mais/colaborador",
    processo: [],
    nota: "⚠️ A tela existe desde 04/08 (veio junto do Plano MEI) e a nota da capacidade, de 09/09, diz `cobertura: nao-existe`. Uma das duas está errada — conferir se a tela cobre algo ou é casca.",
  },
  { id: "8.2", secao: "folha", nome: "Lançamentos do mês e fechamento da competência", tela: null, processo: [] },
  { id: "8.3", secao: "folha", nome: "Holerite e demonstrativo de pagamento", tela: null, processo: [] },
  { id: "8.4", secao: "folha", nome: "Guias da folha: INSS, FGTS e IRRF", tela: null, processo: [], nota: "🔴 “Por onde sai o FGTS” é um dos 3 bloqueios declarados na nota da capacidade." },
  { id: "8.5", secao: "folha", nome: "Obrigações mensais — eSocial, EFD-Reinf, DCTFWeb", tela: null, processo: [], nota: "Mesmo trilho técnico do P5.7 (Integra Contador), que já transmite o pró-labore por S-1200. A diferença é o volume de eventos, não o caminho." },
  { id: "8.6", secao: "folha", nome: "Declaração de mês sem movimento", tela: null, processo: [], nota: "🔑 O líder cobra por isso (R$71,90), o que prova a regra do negócio: contratar folha cria obrigação mensal PERMANENTE, mesmo em mês parado. O simulador do 8.8 precisa dizer isso antes." },
  { id: "8.7", secao: "folha", nome: "Desligamento e rescisão", tela: null, processo: [] },
  {
    id: "8.8",
    secao: "folha",
    nome: "Quanto custa o colaborador, antes de contratar",
    tela: null,
    processo: [],
    nota: "É a versão-folha do pró-labore interativo (4.1), que é o diferencial-âncora do produto. Mesma tese: mostrar a conta em vez de pedir confiança.",
  },
  {
    id: "8.9",
    secao: "folha",
    nome: "A folha somando no Fator R junto com o pró-labore",
    tela: null,
    processo: ["P5.9"],
    nota: "⚠️ PARCIAL, e é a costura das duas seções: o P5.9 já soma “a folha dos 12 meses” no Fator R. O que não existe é o que ALIMENTA essa folha — hoje ela só tem pró-labore dentro.",
  },
];
