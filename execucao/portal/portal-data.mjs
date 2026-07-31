/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FONTE-ÚNICA DO PORTAL (telas internas / dia-2) — nós, conexões, validação.
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmã de `flow/flow-data.mjs`, mesma gramática — mas o portal NÃO é um flow
 * linear, é um GRAFO DE NAVEGAÇÃO: 4 abas + CTA central + drill-downs + sheets.
 * Autoridade das abas/rotas = `app/src/app/(app)/(portal)/layout.tsx`.
 *
 * NÃO editar o Mermaid na nota à mão: editar ESTE arquivo e rodar
 * `node execucao/portal/gerar-mapa-portal.mjs`. O gerador re-renderiza o
 * diagrama + a tabela, confere o drift contra as rotas reais de (portal) e
 * grava um snapshot versionado.
 *
 * Campos de um nó (iguais ao flow-data):
 *   id · rota · label · forma('tela'|'decisao'|'terminal') · classe · status
 *   ('construida'|'planejada') · validado('oficial'|'ux'|'pendente') · falta
 *   · naTabela(default true) · grupo(id do subgrafo).
 * O portal é 100% mockup/farol (tsc+eslint limpos): "validado" aqui = UI
 * revisada (ux) OU esperando gente (pendente: Mauro preço · Larissa fiscal ·
 * parceira certificado). Nada de backend/fiscal ratificado ainda.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const SUBGRAFOS = [
  { id: "SG_INI", titulo: "Aba · Início" },
  { id: "SG_IMP", titulo: "Aba · Impostos" },
  { id: "SG_NOT", titulo: "Aba · Notas" },
  { id: "SG_MAIS", titulo: "Aba · Mais" },
];

export const NODES = [
  // ── SEAM DE ENTRADA (como se chega no portal) ─────────────────────────────
  { id: "ENTRY", label: "Da abertura (N22/M6) / Login", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "🆕 30/07: corrigido — N22 (assinatura) e M6 (migração concluída) empurram direto pra cá, confirmado rastreando router.push no código. Autoridade do handoff = flow-data.mjs (#1).", naTabela: false },
  { id: "DIA1", rota: "/home-dia1", label: "✅ P0 · Home dia-1<br/>(ativação)", forma: "tela", classe: "feliz", status: "construida", validado: "oficial", falta: "🔓 SWAP validado 30/07: substitui N24, sem confete nem selo coral no hero. Trilha de ativação (1 de 3) trata o certificado como item PASSIVO da própria trilha, não gate isolado. SEM navbar até liberar acesso; download do Cartão CNPJ." },
  { id: "CERT", label: "Certificado (gate)<br/>🗑️ REMOVIDO 30/07", forma: "tela", classe: "todo", status: "planejada", validado: "oficial", falta: "Era P0 antes do swap de 29/07, virou rota morta (nada navegava mais até aqui). Arquivo `/certificado` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa." },

  // ── NAVBAR (estrutural: liga as 4 abas + o CTA central) ────────────────────
  { id: "BARRA", label: "Navbar flutuante<br/>4 abas + CTA central", forma: "decisao", classe: "inline", status: "construida", validado: "ux", falta: "", naTabela: false },

  // ── ABA · INÍCIO (home regime) ─────────────────────────────────────────────
  { id: "INICIO", rota: "/inicio", label: "Início · Home (regime)", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_INI", falta: "Home Campeã (montada em /mockup-home): saudação+CNPJ-pill, próximo compromisso, atalhos, notas recentes, aprenda, quem cuida, vigília preditiva. Número-guru fora." },

  // ── ABA · IMPOSTOS ─────────────────────────────────────────────────────────
  { id: "IMPOSTOS", rota: "/impostos", label: "Impostos · dashboard", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_IMP", falta: "Carrossel do mês (DAS+INSS) · vigília fiscal · guias anteriores clicáveis (status automático) · calendário. NÃO intermediamos pagamento." },
  { id: "GUIAS", rota: "/impostos/guias", label: "Guias anteriores", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_IMP", falta: "Mesma estrutura da lista de notas (busca+filtro+mês); status automático por param." },
  { id: "ALIQ", rota: "/impostos/aliquotas", label: "Alíquota efetiva (P4)", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_IMP", falta: "Alíquota efetiva + Fator R numa barra contra o corte dos 28% + 'número vivo' (tese North Star) + memória de cálculo. Fiscal → Larissa." },
  { id: "PAGAR", rota: "/impostos/pagar", label: "Ver / baixar guia", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_IMP", falta: "'Pagar' virou VER/BAIXAR: documento + copiar código de barras + enviar. NÃO intermediamos pagamento; status-aware por param." },
  { id: "OBRIG", rota: "/obrigacoes", label: "Calendário de obrigações", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_IMP", falta: "Exploração mantida a pedido do Pedro (calendário)." },

  // ── ABA · NOTAS ────────────────────────────────────────────────────────────
  { id: "NOTAS", rota: "/notas", label: "Notas · lista (P5)", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_NOT", falta: "Ledger: busca + filtro por status (escopado ao mês) + seletor de mês + exportar + alerta de recusadas + vazio. Card único (home↔P5)." },
  { id: "NOTADET", rota: "/notas/detalhe", label: "Nota · visualizador (P7)", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_NOT", falta: "Status-aware (emitida/emitindo/recusada/cancelada) + documento em tela cheia + enviar por canal + corrigir-e-reemitir." },

  // ── CTA CENTRAL · EMITIR NF-e ──────────────────────────────────────────────
  { id: "EMITIR", rota: "/emitir", label: "Emitir NF-e (P6)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Favorecido (bolhas por frequência, Consumidor final, Novo cliente) + valor (prévia viva do imposto) + serviço travado. Autofill por CNPJ (API pública); emissão NFS-e = RPA (não coberto). B2C = 'Consumidor final'." },
  { id: "SH_REV", label: "Sheet · revisar→emitir→enviada", forma: "tela", classe: "inline", status: "construida", validado: "ux", falta: "", naTabela: false },
  { id: "SH_CLI", label: "Sheet · clientes (ver todos)", forma: "tela", classe: "inline", status: "construida", validado: "ux", falta: "", naTabela: false },

  // ── ABA · MAIS (hub + drill-downs) ─────────────────────────────────────────
  { id: "MAIS", rota: "/mais", label: "Mais · hub", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "Ordem por praticidade: Você→Perfil · plano · serviços à-la-carte · seções (Empresa/Contabilidade) · WhatsApp · Conta." },
  { id: "PERFIL", rota: "/perfil", label: "Perfil (a Conta)", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "Só a Conta (currículo/empresa migrou pro Mais) + lápis no avatar (trocar foto/logo)." },
  { id: "PLANO", rota: "/mais/plano", label: "Gerenciar plano", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_MAIS", falta: "Preço FAKE (Mauro/custo). Próxima fatura com avulsos ADICIONADOS (modelo Contabilizei) · trocar pagamento (Pix) · cancelar (4 camadas, CDC art.49)." },
  { id: "SERVICOS", rota: "/mais/servicos", label: "Loja de avulsos", forma: "tela", classe: "branch", status: "construida", validado: "pendente", grupo: "SG_MAIS", falta: "Camada à-la-carte (CND, declaração, alteração, reemissão). Preço+catálogo → Mauro. Avulso EFETIVO não-removível + double-check." },
  { id: "EMPRESA", rota: "/mais/empresa", label: "Sua empresa · ficha", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "Ficha em blocos + copiar por dobra + copiar TUDO (formato WhatsApp) + CNPJ solto. Regra: página, não acordeon; honestidade antes do toque." },
  { id: "SOCIOS", rota: "/mais/socios", label: "Sócios", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "" },
  { id: "DOCS", rota: "/mais/documentos", label: "Documentos", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "" },
  { id: "CERTM", rota: "/mais/certificado", label: "Certificado (ativo)", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_MAIS", falta: "Estado ativo do certificado; emissão/renovação = certificadora parceira (transfer = upload)." },
  { id: "EMDIA", rota: "/mais/em-dia", label: "Você está em dia", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "SG_MAIS", falta: "Painel de conformidade: hero escuro + streak + órgãos + cumprido-no-mês." },
  { id: "RELAT", rota: "/mais/relatorios", label: "Relatórios", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_MAIS", falta: "Anti-jargão: gráfico de faturamento + 'depois do imposto', honesto. Fiscal → Larissa." },
  { id: "DECLAR", rota: "/mais/declaracoes", label: "Declarações", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "SG_MAIS", falta: "PGDAS-D mensal · DEFIS anual, 'você não preenche nada'. Fiscal → Larissa." },

  // ── TRANSVERSAIS (alcançáveis de vários lugares) ───────────────────────────
  { id: "AVISOS", rota: "/avisos", label: "Avisos (central)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Central de notificações (tipos com cor de estado, não-lido, marcar-lidas); sino no header da home + Mais>Conta." },
  { id: "PROLAB", rota: "/pro-labore", label: "Pró-labore (P8+P9)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa a engine lib/fiscal (mesma do N18): estado atual + interativo (imposto + INSS ao vivo), mira 30%, aviso de borda. Fiscal → Larissa." },
  { id: "BLOG", rota: "/blog", label: "Blog · home", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Busca + chips de categoria + carrossel-herói + lista (ref. TripGlide). 'Aprenda com a gente' liga aqui." },
  { id: "BLOGPOST", rota: "/blog/post", label: "Blog · post", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Leitura: imagem full-bleed sob o notch + folha arredondada + curtir + compartilhar + sugeridos." },

  // ── PLANEJADO / EXTERNO ────────────────────────────────────────────────────
  { id: "CONTASET", label: "Ajustes de conta<br/>(e-mail / senha)", forma: "tela", classe: "todo", status: "planejada", validado: "pendente", falta: "Settings menores da Conta; deferível (HOME §Agora)." },
  { id: "WPP", label: "WhatsApp (canal humano)", forma: "terminal", classe: "todo", status: "planejada", validado: "ux", falta: "Sem rota — canal externo (nossa tese: contador humano sempre).", naTabela: false },
];

export const EDGES = [
  // seam de entrada
  { de: "ENTRY", para: "DIA1" },
  { de: "DIA1", para: "INICIO", label: "acesso liberado" },

  // navbar → 4 abas + CTA central
  { de: "INICIO", para: "BARRA", tracejado: true },
  { de: "BARRA", para: "INICIO" },
  { de: "BARRA", para: "IMPOSTOS" },
  { de: "BARRA", para: "NOTAS" },
  { de: "BARRA", para: "MAIS" },
  { de: "BARRA", para: "EMITIR", label: "CTA central" },

  // atalhos da Início
  { de: "INICIO", para: "IMPOSTOS", label: "próximo: DAS", tracejado: true },
  { de: "INICIO", para: "ALIQ", label: "vigília fiscal", tracejado: true },
  { de: "INICIO", para: "PROLAB", label: "atalho", tracejado: true },
  { de: "INICIO", para: "AVISOS", label: "sino", tracejado: true },
  { de: "INICIO", para: "BLOG", label: "aprenda", tracejado: true },

  // impostos
  { de: "IMPOSTOS", para: "GUIAS", label: "anteriores" },
  { de: "IMPOSTOS", para: "PAGAR", label: "ver/baixar" },
  { de: "IMPOSTOS", para: "ALIQ", label: "alíquota" },
  { de: "IMPOSTOS", para: "OBRIG", label: "calendário" },
  { de: "GUIAS", para: "PAGAR" },

  // notas
  { de: "NOTAS", para: "NOTADET", label: "abrir nota" },
  { de: "NOTADET", para: "EMITIR", label: "recusada→corrigir", tracejado: true },

  // emitir + sheets
  { de: "EMITIR", para: "SH_CLI", tracejado: true },
  { de: "EMITIR", para: "SH_REV", tracejado: true },

  // mais → drill-downs
  { de: "MAIS", para: "PERFIL", label: "header" },
  { de: "MAIS", para: "PLANO" },
  { de: "MAIS", para: "SERVICOS" },
  { de: "MAIS", para: "EMPRESA", label: "Empresa" },
  { de: "MAIS", para: "SOCIOS" },
  { de: "MAIS", para: "DOCS" },
  { de: "MAIS", para: "CERTM" },
  { de: "MAIS", para: "EMDIA", label: "Contabilidade" },
  { de: "MAIS", para: "RELAT" },
  { de: "MAIS", para: "DECLAR" },
  { de: "MAIS", para: "AVISOS", label: "Conta" },
  { de: "MAIS", para: "BLOG", label: "aprenda" },
  { de: "MAIS", para: "WPP", label: "fale com a gente", tracejado: true },
  { de: "PERFIL", para: "CONTASET", tracejado: true },

  // honestidade-antes-do-toque: mudança cadastral = serviço pago (deep-link à loja)
  { de: "EMPRESA", para: "SERVICOS", label: "alterar = serviço", tracejado: true },
  { de: "CERTM", para: "SERVICOS", label: "renovar", tracejado: true },

  // à-la-carte: recalcular guia entra pela loja
  { de: "SERVICOS", para: "GUIAS", label: "recalcular guia", tracejado: true },

  // blog
  { de: "BLOG", para: "BLOGPOST", label: "ler" },
];
