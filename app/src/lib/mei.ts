/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEI — domínio próprio do ramo de abertura de MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08. Fonte-verdade da pesquisa: `pesquisa/abertura-mei/abertura-mei-processo.md`
 * (70 referências oficiais, gov.br/planalto/pbh/sef-mg). Cruzamento com o flow:
 * `execucao/flow/cruzamento-flow-mei-vs-me.md`.
 *
 * ─── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 * O MEI não é "um ME menor". Três coisas o tornam um domínio à parte:
 *
 *   1. **Não existe API nem procuração** que permita abrir MEI por terceiro. O
 *      Portal do Empreendedor exige login gov.br (Prata/Ouro) DO TITULAR, não
 *      tem funcionalidade de representação, e a procuração do e-CAC só cobre
 *      atos posteriores (PGMEI, parcelamento, DARF) — nunca o registro
 *      originário na Redesim/CGSIM. Usar a senha do cliente viola os Termos de
 *      Uso do gov.br ("pessoal e intransferível") e é risco de LGPD.
 *      → Consequência de produto: a gente COLETA e PREPARA tudo; um atendente
 *        interno confere; e o cliente finaliza no gov.br com a nossa "cola".
 *
 *   2. **A atividade é OCUPAÇÃO, não CNAE.** O Portal usa uma lista fechada
 *      (Anexo XI da Res. CGSN 140/2018). Pior: existe um **limite interno**
 *      (Solução de Consulta Cosit nº 27/2021) — o MEI só pode exercer a faceta
 *      nomeada na ocupação, não todo o escopo do CNAE que ela mapeia.
 *
 *   3. **Profissão intelectual não pode ser MEI** (Art. 966, parágrafo único,
 *      do Código Civil). Por isso 3 das 14 categorias do E3.4 ficam VAZIAS —
 *      ver `CATEGORIAS_SEM_MEI` abaixo.
 *
 * ⚠️ Os dados abaixo são um RECORTE: só as ocupações que caem nos 51 CNAEs que
 * a Legalizai atende com certeza E aceitam MEI (`atende_mei_certeza` na
 * `pesquisa/cnae-matriz/cnae-atendemos-certeza.json`). O Anexo XI inteiro tem
 * 351 CNAEs — o resto está fora do nosso escopo de atendimento, não fora da lei.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * 🔴 As 3 categorias do E3.4 que NÃO têm nenhuma ocupação de MEI.
 *
 * Não é lacuna do nosso recorte: é o Art. 966 do Código Civil ("não se
 * considera empresário quem exerce profissão intelectual, de natureza
 * científica, literária ou artística"). Dev, designer e consultor não constam
 * do Anexo XI — nem existe a ocupação pra escolher.
 *
 * A decisão de produto (27/08, com o Pedro) é NÃO esconder essas categorias no
 * caminho MEI: elas aparecem desabilitadas, com o motivo escrito e a saída
 * honesta pro ME. Esconder faria a pessoa achar que a gente não atende a
 * atividade dela — quando a gente atende, só não como MEI.
 */
export const CATEGORIAS_SEM_MEI = ["tech", "design", "consult"] as const;

/** A categoria (pill do E3.4) tem alguma ocupação de MEI? */
export function categoriaTemMei(id: string): boolean {
  return !(CATEGORIAS_SEM_MEI as readonly string[]).includes(id);
}

/** Uma ocupação do Anexo XI, com o CNAE que ela mapeia. */
export interface Ocupacao {
  /** Código CNAE correspondente (Anexo XI faz o de-para). */
  cnae: string;
  /** O nome que aparece no Portal do Empreendedor (sem o sufixo "INDEPENDENTE"). */
  nome: string;
}

/**
 * Ocupações por categoria do E3.4. Chave = `id` da PILL em `gate-telas.tsx`.
 * Categorias ausentes aqui são as de `CATEGORIAS_SEM_MEI`.
 *
 * Gerado a partir de `pesquisa/cnae-matriz/cnae-matriz.json` (campo
 * `mei_ocupacoes`, preenchido em 351/351 dos CNAEs que aceitam MEI), filtrado
 * pelos 51 que a gente atende com certeza. Se a matriz mudar, **regerar** —
 * não editar à mão sem atualizar a fonte.
 */
export const OCUPACOES: Record<string, Ocupacao[]> = {
  foto: [
    { cnae: "7420-0/01", nome: "Fotógrafo(a)" },
    { cnae: "7420-0/03", nome: "Revelador(a) fotográfico" },
    { cnae: "7420-0/04", nome: "Filmador(a)" },
    { cnae: "5912-0/01", nome: "Dublador(a)" },
  ],
  mkt: [
    { cnae: "7319-0/02", nome: "Panfleteiro(a)" },
    { cnae: "7319-0/02", nome: "Promotor(a) de vendas" },
  ],
  edicao: [
    { cnae: "5811-5/00", nome: "Editor(a) de livros" },
    { cnae: "5812-3/01", nome: "Editor(a) de jornais diários" },
    { cnae: "5812-3/02", nome: "Editor(a) de jornais não diários" },
    { cnae: "5813-1/00", nome: "Editor(a) de revistas" },
    { cnae: "5819-1/00", nome: "Editor(a) de lista de dados e de outras informações" },
  ],
  cursos: [
    { cnae: "8592-9/02", nome: "Instrutor(a) de artes cênicas" },
    { cnae: "8592-9/03", nome: "Instrutor(a) de música" },
    { cnae: "8592-9/99", nome: "Instrutor(a) de arte e cultura em geral" },
    { cnae: "8593-7/00", nome: "Instrutor(a) de idiomas" },
    { cnae: "8599-6/03", nome: "Instrutor(a) de informática" },
    { cnae: "8599-6/04", nome: "Instrutor(a) de cursos gerenciais" },
    { cnae: "8599-6/05", nome: "Instrutor(a) de cursos preparatórios" },
  ],
  arte: [
    { cnae: "9001-9/01", nome: "Humorista e contador de histórias" },
    { cnae: "9001-9/02", nome: "Cantor(a) / músico(a)" },
    { cnae: "9002-7/02", nome: "Restaurador(a) de obras de arte" },
  ],
  eventos: [
    { cnae: "8230-0/01", nome: "Promotor(a) de eventos" },
    { cnae: "9329-8/03", nome: "Proprietário(a) de salão de jogos de sinuca e bilhar" },
    { cnae: "9329-8/04", nome: "Proprietário(a) de fliperama" },
  ],
  admin: [
    { cnae: "8219-9/01", nome: "Fotocopiador(a)" },
    { cnae: "8219-9/99", nome: "Digitador(a)" },
    { cnae: "8291-1/00", nome: "Cobrador(a) de dívidas" },
    { cnae: "8292-0/00", nome: "Envasador(a) e empacotador(a)" },
    { cnae: "8299-7/03", nome: "Gravador(a) de carimbos" },
    { cnae: "8299-7/07", nome: "Proprietário(a) de sala de acesso à internet" },
  ],
  aluguel: [
    { cnae: "7721-7/00", nome: "Locador(a) de bicicletas" },
    { cnae: "7721-7/00", nome: "Locador(a) de material e equipamento esportivo" },
    { cnae: "7722-5/00", nome: "Locador(a) de fitas de vídeo, DVDs e similares" },
    { cnae: "7722-5/00", nome: "Locador(a) de vídeo games" },
    { cnae: "7723-3/00", nome: "Locador(a) de objetos do vestuário, jóias e acessórios" },
    { cnae: "7729-2/01", nome: "Locador(a) de aparelhos de jogos eletrônicos" },
    { cnae: "7729-2/02", nome: "Locador(a) de móveis e utensílios, inclusive para festas" },
    { cnae: "7729-2/02", nome: "Locador(a) de instrumentos musicais" },
    { cnae: "7729-2/03", nome: "Locador(a) de material médico" },
    { cnae: "7729-2/99", nome: "Locador(a) de livros, revistas, plantas e flores" },
    { cnae: "7733-1/00", nome: "Locador(a) de máquinas e equipamentos para escritório" },
  ],
  reparos: [
    { cnae: "9511-8/00", nome: "Técnico(a) de manutenção de computador" },
    { cnae: "9512-6/00", nome: "Técnico(a) de manutenção de telefonia" },
    { cnae: "9521-5/00", nome: "Técnico(a) de manutenção de eletrodomésticos" },
    { cnae: "9529-1/01", nome: "Sapateiro(a)" },
    { cnae: "9529-1/02", nome: "Chaveiro(a)" },
    { cnae: "9529-1/03", nome: "Relojoeiro(a)" },
    { cnae: "9529-1/04", nome: "Reparador(a) de bicicleta" },
    { cnae: "9529-1/05", nome: "Estofador(a)" },
    { cnae: "9529-1/05", nome: "Reparador(a) de artigos de tapeçaria" },
    { cnae: "9529-1/05", nome: "Reparador(a) de móveis" },
    { cnae: "9529-1/05", nome: "Reparador(a) de toldos e persianas" },
    { cnae: "9529-1/06", nome: "Ourives" },
    { cnae: "9529-1/99", nome: "Amolador(a) de artigos de cutelaria" },
    { cnae: "9529-1/99", nome: "Reparador(a) de artigos e acessórios do vestuário" },
    { cnae: "9529-1/99", nome: "Reparador(a) de brinquedos" },
    { cnae: "9529-1/99", nome: "Reparador(a) de equipamentos esportivos" },
    { cnae: "9529-1/99", nome: "Reparador(a) de guarda-chuva e sombrinhas" },
    { cnae: "9529-1/99", nome: "Reparador(a) de instrumentos musicais" },
    { cnae: "9529-1/99", nome: "Reparador(a) de panelas (paneleiro)" },
    { cnae: "9529-1/99", nome: "Restaurador(a) de livros" },
  ],
  salao: [
    { cnae: "9602-5/01", nome: "Barbeiro(a)" },
    { cnae: "9602-5/01", nome: "Cabeleireiro(a)" },
    { cnae: "9602-5/01", nome: "Manicure / pedicure" },
  ],
  hospedagem: [
    { cnae: "5590-6/01", nome: "Proprietário(a) de albergue não assistencial" },
    { cnae: "5590-6/03", nome: "Proprietário(a) de pensão" },
  ],
};

/** Ocupações de uma categoria. Vazio = categoria sem MEI (ver CATEGORIAS_SEM_MEI). */
export function ocupacoesDe(categoria: string | null): Ocupacao[] {
  if (!categoria) return [];
  return OCUPACOES[categoria] ?? [];
}

/**
 * As 7 formas de atuação do formulário oficial. Multi-seleção, obrigatória.
 * Fonte: Portal do Empreendedor, etapa "Qualificação do Negócio".
 *
 * ⚠️ No ME a gente PREENCHE isso internamente ("Internet", decisão de 26/08 em
 * `decisoes-marca.md`), porque não gera dúvida útil. No MEI **é diferente**: a
 * forma de atuação interage com a dispensa de alvará (o Termo de Ciência
 * declara atividade de baixo risco) e com a validade de usar o endereço
 * residencial como comercial. Então aqui a pessoa escolhe.
 */
export const FORMAS_ATUACAO = [
  { id: "internet", label: "Pela internet" },
  { id: "fixo", label: "Em estabelecimento fixo" },
  { id: "fora-loja", label: "Em local fixo fora de loja" },
  { id: "porta", label: "Porta a porta, posto móvel ou ambulante" },
  { id: "televendas", label: "Televendas" },
  { id: "correio", label: "Por correio" },
  { id: "maquinas", label: "Máquinas automáticas" },
] as const;

/**
 * Os 3 impedimentos que o Portal do Empreendedor checa e BLOQUEIA (ou alerta)
 * no ato da formalização. Perguntamos ANTES do pagamento de propósito: se o
 * atendente descobrir depois, virou reembolso + hora humana gasta à toa.
 *
 * Fontes por item estão no doc de pesquisa; resumo:
 *   · outra empresa → LC 123 art. 18-A; a RFB cruza o CPF e bloqueia.
 *   · servidor federal → Lei 8.112/90 art. 117; bloqueio imediato.
 *   · benefício → NÃO bloqueia o registro, mas a formalização suspende ou
 *     cancela o benefício (irreversível), com risco de multa se houver dolo.
 *     Por isso é ALERTA com confirmação, não porta fechada.
 */
export const IMPEDIMENTOS = [
  {
    id: "outra-empresa",
    pergunta: "Você é sócio, titular ou administrador de alguma outra empresa?",
    dica: "Vale qualquer CNPJ ativo, inclusive outro MEI ou uma empresa parada que nunca foi baixada.",
    bloqueia: true,
    tituloBloqueio: "Com outra empresa ativa, o MEI não sai",
    motivo:
      "A Receita cruza seu CPF na hora do registro e barra automaticamente. Não é regra nossa, é do sistema do governo.",
    saida:
      "Dá pra resolver: ou você baixa a empresa antiga, ou abre como ME. A gente te ajuda nos dois caminhos.",
  },
  {
    id: "servidor",
    pergunta: "Você é servidor público federal na ativa?",
    dica: "Só federal. Servidor estadual ou municipal depende do estatuto de cada um, e aí a gente confere junto.",
    bloqueia: true,
    tituloBloqueio: "Servidor público federal não pode ser MEI",
    motivo:
      "É vedação do art. 117 da Lei 8.112/90. O Portal do Empreendedor bloqueia no ato.",
    saida:
      "Vale conferir seu estatuto antes de qualquer decisão. Se você for estadual ou municipal, fala com a gente que a regra pode ser outra.",
  },
  {
    id: "beneficio",
    pergunta:
      "Você recebe aposentadoria por invalidez, salário-maternidade ou seguro-desemprego?",
    dica: "Auxílio por incapacidade temporária também conta.",
    bloqueia: false,
    tituloBloqueio: "Abrir MEI encerra esse benefício",
    motivo:
      "O registro não é bloqueado, mas o benefício é suspenso ou cancelado — e isso não volta atrás. Se houver dolo, ainda cabe multa.",
    saida:
      "Não é impedimento, é escolha. Vale conversar com a gente antes de seguir.",
  },
] as const;

/**
 * Teto anual do MEI (LC 123 art. 18-A), congelado desde 2018 (LC 155/2016).
 * 🟡 Há PLP em tramitação propondo R$130-140k — **não é lei**, não usar.
 * O MEI Caminhoneiro (TAC) tem teto de R$251.600, mas está fora do nosso
 * escopo (não é serviço no nosso recorte de CNAE).
 */
export const TETO_MEI_ANUAL = 81000;

/** Teto mensal equivalente (o número que a FaixaView compara). */
export const TETO_MEI_MENSAL = TETO_MEI_ANUAL / 12; // R$ 6.750
