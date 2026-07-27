import { BoardPagina, BoardSecao, type Versao } from "@/components/lab/versao-board";

/**
 * /mockup-home — VISUALIZADOR da HOME FINAL.
 * As 3 composições da home (a partir dos componentes vencedores do acervo) lado
 * a lado + o acervo dos vencedores embaixo, pra comparar e trocar peças.
 * Só visualização (toca dentro do aparelho pra navegar, se quiser).
 */

const CAMPEA: Versao[] = [
  {
    rota: "/home-campea",
    v: "★",
    titulo: "Campeã (em montagem)",
    nota: "Seu canvas: os trechos que você valida entram aqui, na ordem, pra mover / manter / ajustar / remover. Começou com Saudação + Próximo compromisso (da A). Mande o print do próximo trecho e eu adiciono.",
  },
  {
    rota: "/perfil",
    v: "perfil",
    titulo: "Perfil (do avatar)",
    nota: "Chega pelo círculo de iniciais. É um CURRÍCULO, não config: track record da empresa (tempo de CNPJ · notas · faturado) + credenciais fiscais + abas Empresa/Sócios/Documentos/Conta (absorvem P12+P13+P14) + CTA humano. Sem navbar de propósito: é drill-down, o back assume.",
  },
  {
    rota: "/emitir",
    v: "emitir",
    titulo: "Emitir NF-e (do CTA central)",
    nota: "1 tela, não wizard. Pede só CLIENTE (selecionável + 'Sem cliente') + VALOR (herói, com prévia viva do imposto). Os 3 códigos crus do líder ficam pré-preenchidos e recolhidos ('a gente já sabe do seu cadastro'). Drill-down, sem navbar.",
  },
  {
    rota: "/notas",
    v: "notas · lista (P5)",
    titulo: "Notas — a aba",
    nota: "Fecha o loop do Emitir: a nota sai e aparece AQUI. Status em tempo real (em emissão → emitida) + cancelada/recusada, resumo do mês, full-bleed. Toca numa nota → detalhe (P7). É aba → vem com navbar. Sem imposto por-nota (vive na aba Impostos).",
  },
  {
    rota: "/notas/detalhe?s=emitida",
    v: "P7 · emitida",
    titulo: "Detalhe / visualizador",
    nota: "Resumo humanizado + VISUALIZADOR do documento (preview → toca pra ver o doc em tela cheia) + De→Para + serviço/descrição + valor. Ações: baixar PDF/XML · enviar ao cliente (canais) · cancelar. Imposto fica na aba Impostos.",
  },
  {
    rota: "/notas/detalhe?s=recusada",
    v: "P7 · recusada",
    titulo: "Recusada (resolver)",
    nota: "Aterrissa o alerta da P5: faixa vermelha + MOTIVO da recusa + CTA 'Corrigir e reemitir' (+ descartar). Sem documento/baixar (não há nota válida).",
  },
  {
    rota: "/notas/detalhe?s=emitindo",
    v: "P7 · em emissão",
    titulo: "Em emissão",
    nota: "Faixa azul 'a prefeitura está processando, te avisamos'. Sem documento/baixar (ainda não existe). Ação: voltar pras notas.",
  },
  {
    rota: "/impostos",
    v: "impostos · aba",
    titulo: "Impostos (dashboard fiscal)",
    nota: "Onde a promessa 'o imposto você acompanha em Impostos' aterrissa. Herói = DAS do mês (valor + vence + de-onde-vem + Pagar → P3) · Vigília fiscal (diferencial) · Débito automático (toggle) · Guias anteriores com status AUTOMÁTICO (anti-líder: sem 'confirme que pagou') · Calendário fiscal → /obrigacoes. Números farol; composição = fila-Larissa.",
  },
  {
    rota: "/mais",
    v: "mais · aba",
    titulo: "Mais (hub)",
    nota: "O 4º tab, fecha a navegação. Header → Perfil · card do Plano/assinatura (débito auto como benefício) · carrossel de serviços à-la-carte = MONETIZAÇÃO (CND, declaração, alteração, reemissão) · seções Empresa/Contabilidade (componentes reusados) · Fale com a gente (WhatsApp humano) · Conta. Preços farol/FAKE (deferidos ao Mauro).",
  },
  {
    rota: "/mais/plano",
    v: "mais · gerenciar plano",
    titulo: "Gerenciar plano (billing)",
    nota: "Gestão dos pagamentos da nossa recorrência: plano atual · PRÓXIMA FATURA com avulsos JÁ CONTRATADOS (27/07: serviço não cobra na hora, cai na próxima fatura, mas é EFETIVO — chip 'Em andamento'/'Recalculando', SEM remover) · forma de pagamento (trocar → sheet com Pix + adicionar) · faturas anteriores (baixar) · cancelar (sheet 'tem certeza?' + ativa-até-X). Valores farol.",
  },
  {
    rota: "/mais/servicos",
    v: "mais · serviços avulsos",
    titulo: "Loja de upsells (conversão)",
    nota: "O catálogo à-la-carte, feito pra converter. Hero + removedor de fricção ('sem cobrança na hora, cai na próxima fatura', SEM prometer remover) · Mais pedidos (destaque + prova social) · catálogo por categoria (Certidões/Fiscal/Societário). Toca → sheet de detalhe → 'Solicitar serviço' → DOUBLE-CHECK ('confirma mesmo?', avisa efetivo + irreversível) → confirmado. Recálculo: escolhe guia → confirma → guia entra em 'Recalculando'. Preços farol.",
  },
];

/* As páginas internas de MAIS construídas 27/07 (dobras Sua empresa +
   Contabilidade). Drill-down de /mais, sem navbar, padrão TelaHeader+voltar. */
const MAIS_PAGINAS: Versao[] = [
  {
    rota: "/mais/empresa",
    v: "empresa · dados",
    titulo: "Dados da empresa",
    nota: "A ficha do CNPJ em 3 blocos (Identificação · Enquadramento · Endereço), CNPJ copiável. É LEITURA: mudar qualquer campo é alteração cadastral (Junta+Receita) = serviço pago. Honestidade antes do toque: sem lápis que 'edita de graça' → CTA manda pro fluxo pago.",
  },
  {
    rota: "/mais/socios",
    v: "empresa · sócios",
    titulo: "Sócios",
    nota: "Quadro societário: card por sócio (participação · papel · pró-labore), CPF mascarado, chip 'Administra'. No mock a Ana é sócia única (SLU 100%). Adicionar/mudar sócio = alteração contratual paga (até 2 no plano) → Serviços.",
  },
  {
    rota: "/mais/documentos",
    v: "empresa · documentos",
    titulo: "Documentos",
    nota: "O arquivo da empresa agrupado (Constituição · Certidões · Fiscais); ação = BAIXAR (a gente gera/guarda; certificado tem casa própria). Documento que precisa ser emitido (declaração, DECORE) → Serviços.",
  },
  {
    rota: "/mais/certificado",
    v: "empresa · certificado",
    titulo: "Certificado digital",
    nota: "O gate universal. Estado ATIVO (e-CNPJ A1, válido 12/2027, bate com o Perfil): hero verde 'em dia' + 'o que destrava' (nota/imposto/declaração) + detalhes + renovar/trocar. Pendente vira o mesmo layout em alerta + 'enviar certificado'.",
  },
  {
    rota: "/mais/em-dia",
    v: "contab · situação",
    titulo: "Você está em dia (reimaginado)",
    nota: "O card 'em dia' virou PAINEL DE CONFORMIDADE: hero escuro com veredito grande + STREAK ('6 meses sem atraso') → órgãos com dot pulsante (Receita/Prefeitura/Junta) → cumprido no mês (DAS/INSS/PGDAS-D, quem fez) → no radar (DEFIS/certificado). Tranquilidade auditável, anti-loop-aberto.",
  },
  {
    rota: "/mais/relatorios",
    v: "contab · relatórios",
    titulo: "Relatórios (o dinheiro em português)",
    nota: "Anti-jargão do líder: hero dark com GRÁFICO de faturamento (LineChart reusado) + variação % + resumo do ano (faturado/imposto/sobrou) → relatórios em linguagem de dono ('quanto entrou, saiu, sobrou') pra baixar. Nota: relatório contábil formal (DRE/balanço) existe sob pedido → Serviços.",
  },
  {
    rota: "/mais/declaracoes",
    v: "contab · declarações",
    titulo: "Declarações",
    nota: "O que a gente ENTREGA ao fisco, agrupado por cadência (todo mês: PGDAS-D · todo ano: DEFIS). Cada uma diz em português o que é + status (Entregue/No prazo) + comprovante. Tese: você não preenche nada, a gente entrega no prazo.",
  },
];

const DIA1: Versao[] = [
  {
    rota: "/home-dia1",
    v: "home · dia-1",
    titulo: "Home de ativação (estado dia-1)",
    nota: "O 2º estado da home (empresa recém-nascida: faturamento 0, Fator R projetado → o diferencial ainda não tem o que vigiar). Vira TRILHA DE ATIVAÇÃO: hero celebra o nascimento (confetti da marca) + CNPJ pill → checklist com progresso (o certificado é o passo 'agora', gate universal) → 'sem pressa com imposto' → Aprenda + Quem cuida (reuso). Transição dia-1→regime é data-driven no real.",
  },
];

const NOVAS: Versao[] = [
  {
    rota: "/avisos",
    v: "avisos (sino)",
    titulo: "Central de notificações",
    nota: "Chega pelo SINO no topo da home (badge coral = não-lidos). Onde a tese 'a gente avisa ANTES da dor' vira histórico: fiscal (Fator R) · DAS pronto · serviço concluído · nota emitida/recusada · declaração entregue · novidade. Cada tipo tem ícone+cor de estado; não-lido tem dot; 'Marcar lidas' limpa. Farol.",
  },
  {
    rota: "/impostos/aliquotas",
    v: "impostos · alíquota (P4)",
    titulo: "Sua alíquota + Fator R",
    nota: "Detalhe da vigília (chega do 'Entender' e dos cards da vigília na aba Impostos). Alíquota efetiva 6% (herói) → Fator R numa barra contra o corte dos 28% (folga) → 'número vivo' (tese North Star: muda todo mês, ninguém olha) → memória de cálculo → CTA ajustar pró-labore. Mecânica da efetiva = fila-Larissa; mostra o conceito. Farol.",
  },
  {
    rota: "/pro-labore",
    v: "pró-labore (P8+P9)",
    titulo: "Ver + ajustar (o diferencial-âncora)",
    nota: "Substitui o stub. Reusa a engine lib/fiscal (a mesma do N18/simulador do wizard), agora em regime. P8 = estado atual (você se paga X, selo do enquadramento). P9 = INTERATIVO: slider com 'sai do seu bolso/mês' = imposto + INSS ao vivo (o vale = ponto ótimo), sugestão mira 30% (folga), aviso de borda + 'imposto dobra' no Anexo V, memória de cálculo. Cenário na BORDA de propósito, pra mostrar o valor do monitoramento. Chega da CTA da alíquota. Farol.",
  },
];

const BLOG: Versao[] = [
  {
    rota: "/blog",
    v: "blog · home",
    titulo: "Aprenda com a gente (home dos posts)",
    nota: "Ref. TripGlide traduzida: busca + chips de CATEGORIA (Impostos/Abrir empresa/Nota fiscal/Dicas, no lugar dos continentes) → carrossel-HERÓI dos destaques (card grande com imagem/categoria/tempo/'Ler post') → LISTA de todas as publicações abaixo, filtrada por chip+busca. Chega do 'Aprenda com a gente' da home. Imagens picsum mock.",
  },
  {
    rota: "/blog/post?id=fator-r",
    v: "blog · post",
    titulo: "Leitura do post",
    nota: "Remix do print 2 (orientação do Pedro): imagem em DESTAQUE no topo (full-bleed) com voltar + CURTIR + COMPARTILHAR discreto (review fora agora) → corpo no meio → o carrossel que no print fica em cima vira POSTS SUGERIDOS ('Leia também') no fim. `?id=` troca o post; sem id cai no 1º.",
  },
];

const ACERVO: Versao[] = [
  {
    rota: "/componentes",
    v: "acervo",
    titulo: "Os vencedores",
    nota: "Todos os componentes que você validou, soltos, pra comparar com as 3 composições acima e pedir troca de peça.",
  },
];

export default function MockupHomePage() {
  return (
    <BoardPagina
      eyebrow="Legalizai · home final"
      titulo="Home final — 3 versões"
      subtitulo="Três composições da home a partir dos componentes vencedores do acervo, lado a lado. Mesmos módulos da spec (foco → ação → vigília → cuidado → IA), 3 leituras de tom. Abaixo, os vencedores soltos pra comparar e trocar peças. Só visualização."
    >
      <BoardSecao
        titulo="🏆 Campeã (em montagem)"
        subtitulo="O canvas onde a gente monta a home final peça por peça, conforme você valida. Manda o print do trecho que gostou e eu ploto aqui, na ordem — depois você move / mantém / ajusta / remove."
        versoes={CAMPEA}
      />
      <BoardSecao
        titulo="🌱 Home dia-1 (ativação — nova 27/07)"
        subtitulo="O estado da home logo após a empresa nascer. Fecha o último buraco do MLP: a decisão das '2 homes' (dia-1 × regime) virou tela. Trilha de ativação guiada, com o certificado como passo-âncora."
        versoes={DIA1}
      />
      <BoardSecao
        titulo="🗂️ Mais · páginas internas (novas — 27/07)"
        subtitulo="As dobras 'Sua empresa' (dados · sócios · documentos · certificado) e 'Contabilidade' (você está em dia · relatórios · declarações), construídas como drill-down de /mais. Toca dentro do aparelho pra navegar. Regra travada: página, não acordeon; honestidade antes do toque (mudança cadastral/contratual = serviço pago); 'você está em dia' virou painel de conformidade."
        versoes={MAIS_PAGINAS}
      />
      <BoardSecao
        titulo="🔔 Avisos + alíquota + pró-labore (novas — 27/07)"
        subtitulo="Central de notificações (do sino), detalhe da alíquota/Fator R (da vigília) e o pró-labore interativo P8+P9 (o diferencial-âncora, reusa a engine do simulador). Fecham os últimos buracos do MLP."
        versoes={NOVAS}
      />
      <BoardSecao
        titulo="📰 Blog — Aprenda com a gente (novo — 27/07)"
        subtitulo="A home dos posts (ref. TripGlide) + a leitura do post (ref. print 2 remixada: hero no topo, corpo no meio, sugeridos no fim). Chega do 'Aprenda com a gente' da home. Fecha o último buraco do MLP (só sobra a Home dia-1)."
        versoes={BLOG}
      />
      <BoardSecao
        titulo="🧩 Acervo — os componentes vencedores"
        subtitulo="A gaveta dos campeões, pra comparar com as 3 composições e pedir troca de peça."
        versoes={ACERVO}
      />
    </BoardPagina>
  );
}
