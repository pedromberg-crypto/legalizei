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
    nota: "Gestão dos pagamentos da nossa recorrência: plano atual · PRÓXIMA FATURA com avulsos ADICIONADOS (modelo Contabilizei: serviço não cobra na hora, cai na próxima fatura, removível antes) · forma de pagamento (trocar → sheet com Pix + adicionar) · faturas anteriores (baixar) · cancelar (sheet 'tem certeza?' + ativa-até-X). Valores farol.",
  },
  {
    rota: "/mais/servicos",
    v: "mais · serviços avulsos",
    titulo: "Loja de upsells (conversão)",
    nota: "O catálogo à-la-carte, feito pra converter. Hero + removedor de fricção ('sem cobrança na hora, cai na próxima fatura') · Mais pedidos (destaque + prova social) · catálogo por categoria (Certidões/Fiscal/Societário). Toca → sheet de detalhe (valor + o que inclui + preço) → 'Adicionar à minha fatura' (2 fases → ver fatura). Preços farol.",
  },
];

const HOMES: Versao[] = [
  {
    rota: "/home-a",
    v: "A",
    titulo: "Acolhe (wellness)",
    nota: "Alívio primeiro: saudação → DAS 'a gente já gerou' → você está em dia → vigília → quem cuida → IA. A estética que acalma o domínio assustador.",
  },
  {
    rota: "/home-b",
    v: "B",
    titulo: "Pulso (fintech)",
    nota: "O negócio como banco: hero dark com faturamento + 4 ações → stat cards → vigília → DAS ticket → movimentações → IA. Estética premium.",
  },
  {
    rota: "/home-c",
    v: "C",
    titulo: "Copiloto (IA)",
    nota: "A IACA na frente: perfil → pergunte à IA → grid de ações → DAS → vigília → notas recentes. O app como parceiro que age.",
  },
];

const HOMES2: Versao[] = [
  {
    rota: "/home-d",
    v: "D",
    titulo: "Agenda fiscal",
    nota: "O tempo primeiro (ref5): day-strip com countdown → obrigações do mês → DAS ticket → vigília → aprenda com a gente. A home como sua agenda fiscal.",
  },
  {
    rota: "/home-e",
    v: "E",
    titulo: "Toque rápido",
    nota: "Tudo a um gesto (ref12+11+6): perfil → círculos de atalho → swipe-to-pay do DAS → emitir pra cliente → vigília → débito automático. Velocidade.",
  },
  {
    rota: "/home-f",
    v: "F",
    titulo: "Descobrir & cuidar",
    nota: "Hub acolhedor (ref7+5): saudação → busca → chips → vigília → você está em dia → indique e ganhe → aprenda. Descoberta + relacionamento.",
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
        titulo="As 3 sugestões (estado regime)"
        subtitulo="Topo claro nas três. A VIGÍLIA FISCAL (gauge do teto + Fator R + alerta preditivo) foi montada nova — é o nosso diferencial, não tinha campeão pronto no acervo."
        versoes={HOMES}
      />
      <BoardSecao
        titulo="Mais 3 (outra mesclagem dos campeões)"
        subtitulo="Mesmos componentes aprovados, arranjados de outro jeito, puxando das referências que sobraram (agenda ref5, ação ref12, hub ref7). A vigília fiscal segue nas três."
        versoes={HOMES2}
      />
      <BoardSecao
        titulo="🧩 Acervo — os componentes vencedores"
        subtitulo="A gaveta dos campeões, pra comparar com as 3 composições e pedir troca de peça."
        versoes={ACERVO}
      />
    </BoardPagina>
  );
}
