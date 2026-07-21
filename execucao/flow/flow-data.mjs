/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FONTE-ÚNICA DO FLOW — nós, conexões e status de validação.
 * ═══════════════════════════════════════════════════════════════════════════
 * TUDO que o mapa desenha nasce daqui. NÃO editar o Mermaid na nota à mão:
 * editar ESTE arquivo e rodar `node execucao/flow/gerar-mapa.mjs`. O gerador
 * re-renderiza o diagrama + a tabela de validação e grava um snapshot
 * versionado (o "commit interno") com o resumo do que mudou.
 *
 * Campos de um nó:
 *   id        — identificador no grafo (alfanumérico).
 *   rota      — caminho da tela no app (só telas com rota; usado no check de
 *               drift contra os arquivos reais). Ausente = etapa/decisão/planejada.
 *   label     — texto no diagrama (aceita <br/>).
 *   forma     — 'tela' | 'decisao' | 'terminal'  (retângulo | losango | cápsula).
 *   classe    — cor: '' | 'saida' | 'feliz' | 'espera' | 'branch' | 'inline' | 'todo'.
 *   status    — 'construida' | 'planejada'.
 *   validado  — 'oficial' (norma/decisão travada) | 'ux' (só UX, revisado) | 'pendente'.
 *   falta     — o que ainda espera gente (texto curto) ou ''.
 *   naTabela  — default true; false esconde da tabela (roteamento puro).
 *   grupo     — id do subgrafo (só o GATE usa).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const SUBGRAFOS = [
  { id: "GATE", titulo: "N4 · Gate-CNAE — uma tela" },
];

export const NODES = [
  // ── ENTRADA · N1–N3 ──────────────────────────────────────────────────────
  { id: "N1", rota: "/splash", label: "N1 · Splash", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "" },
  { id: "N2", rota: "/welcome", label: "N2 · Welcome", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "" },
  { id: "N3", rota: "/entrada", label: "N3 · Fork<br/>3 rotas", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Rota migrar aponta pro flow #2 (não existe): cobrar antes do TTRT? passivo herdado? (Pedro/Mauro)" },
  { id: "LOGIN", rota: "/login", label: "Login / portal", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Rota feliz" },
  { id: "MIG", label: "Flow #2 · Migração<br/>não construído", forma: "tela", classe: "todo", status: "planejada", validado: "pendente", falta: "Construir flow #2" },

  // ── N4 · GATE (uma tela, várias etapas) ──────────────────────────────────
  { id: "N4A", rota: "/gate", label: "Descreve atividade + pills", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev" },
  { id: "N4V", label: "Veredito CNAE", forma: "decisao", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "Depende da lista CNAE; dev cnae-lookup responde 'atende' pra DEFESA" },
  { id: "DESAMB", label: "Desambiguação<br/>mini-loop", forma: "tela", classe: "inline", status: "construida", validado: "ux", grupo: "GATE", falta: "", naTabela: false },
  { id: "N4T", label: "Triagem<br/>sócios? exterior?", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "Exterior = LC 123 art.17 (oficial); limite 2 travado. Abertos: debate 3+→waitlist, UX-42 (Mauro/Larissa)" },
  { id: "N4F", label: "Faixa de faturamento", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "Faixas sem âncora fiscal" },

  // ── A2 · VEREDITO ────────────────────────────────────────────────────────
  { id: "VA", rota: "/veredito/atende", label: "🟢 Atende", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Depende da lista CNAE" },
  { id: "VW", rota: "/veredito/waitlist", label: "🟡 Waitlist", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar)" },
  { id: "VC", rota: "/veredito/nao-atende", label: "🔴 Comercial Mauro", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "Mauro recebe/trabalha o lead? (debate de saída)" },

  // ── ENCAIXE · escolhe/trava o CNAE (NOVO 21/07, reordenacao-cluster-fiscal) ──
  { id: "ENC", rota: "/encaixe", label: "ENCAIXE<br/>escolhe/trava CNAE", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Recomendado + alternativas; % de fit real (IA cruza pill+texto) pendente; defesa de legitimidade inline. Trava o CNAE antes do nome/Junta" },

  // ── A3 · RESUMO DE VALOR (era o teaser; a prova migrou pro ENCAIXE) ─────────
  { id: "N5", rota: "/resumo", label: "N5' · Resumo de valor<br/>faixa-based, suave", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Opção B: vende segurança, não promete economia. Alíquota de entrada (Anexo III) sobre a mediana da faixa" },

  // ── B3 · DINHEIRO · N6–N9 ────────────────────────────────────────────────
  { id: "N6", rota: "/conta", label: "N6 · Criar conta", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Provider de validação CPF/situação (Pedro)" },
  { id: "N7", rota: "/plano", label: "N7 · A conta da abertura", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro)" },
  { id: "N8", rota: "/contrato", label: "N8 · Aceite contrato<br/>reversível, CDC 49", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do contrato (Mauro/Larissa); rachadura T18" },
  { id: "N9", rota: "/pagamento", label: "N9 · Pagamento", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro)" },
  { id: "P2", rota: "/aguardando", label: "P2 · Aguardando boleto<br/>dossiê já liberado", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "Dunning revisado" },

  // ── B2 · DOSSIÊ · N10–N18 ────────────────────────────────────────────────
  { id: "N10", rota: "/dossie/socio", label: "N10 · Seus dados", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "CPF valida situação (provider do N6); regime de bens (casado)" },
  { id: "N11", rota: "/dossie/vinculo", label: "N11 · Vínculo INSS", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "INSS 11% direto + teto folga = consolidado fiscal fechado" },
  { id: "N12", rota: "/dossie/socios", label: "N12 · Sócios?", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Re-pergunta o N4 (carry-forward pendente); limite 2 ok" },
  { id: "N12B", label: "Coleta 2º sócio<br/>+ convite", forma: "tela", classe: "branch", status: "construida", validado: "pendente", falta: "Convite (B5) depende do N21 planejado" },
  { id: "N13", rota: "/dossie/empresa", label: "N13 · Dados da empresa<br/>+upsell endereço", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Endereço ~R$60/mês = nosso preço (Mauro); custo do líder já confirmado" },
  { id: "N14", rota: "/dossie/cnae-secundarios", label: "N14 · CNAE secundários", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Só sugere secundárias mesmo-imposto (mesmo anexo + Fator R); regime-changer nunca aparece (decisão 21/07). Depende do anexo-por-CNAE (dataset/Larissa)" },
  { id: "N15", rota: "/dossie/natureza", label: "N15 · Natureza jurídica", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "SLU × LTDA: regra solo→SLU vs LTDA solo real (Larissa)" },
  { id: "N16", rota: "/dossie/nome", label: "N16 · Nome / razão social", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Viabilidade JUCEMG (RPA, não API); nome≠empresa (dev/Izabela)" },
  { id: "N18", rota: "/simulador", label: "N18 · Simulador pró-labore", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "7 pontos fiscais (Larissa); alerta FS12 (COSIT 17/2021) não exibir até conferir" },

  // ── A7 · ESPERA ──────────────────────────────────────────────────────────
  { id: "P1", rota: "/retomar", label: "P1 · Retomar de onde parou", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "UX-23 dá pra fechar (N18 existe)" },

  // ── A9 · SAÍDA GRACIOSA ──────────────────────────────────────────────────
  { id: "SE", rota: "/saida/exterior", label: "Saída · exterior<br/>LC 123 art.17", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "UX-42 Lucro Presumido (Mauro); debate de tom" },
  { id: "SS", rota: "/saida/socios", label: "Saída · 3+ sócios<br/>limite do produto", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "Debate 3+→waitlist" },

  // ── B4 · CONSTITUIÇÃO (construído 21/07 — a cauda ganhou rota) ────────────
  { id: "N19", rota: "/revisar", label: "N19 · Revisar dossiê", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Recap read-only; carry-forward dos passos = estado do wizard (dev)" },
  { id: "N20", rota: "/termo", label: "N20 · Termo irreversível", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do termo + 4 camadas de cancelamento (Mauro/Larissa); racha T18" },
  { id: "N21", rota: "/painel", label: "N21 · Painel / timeline órgãos", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Timeline real depende do pipeline do dev (RPA/órgãos); prazo ~8d é placeholder; UX-29 do N6 + gancho por modo/CRM" },
  { id: "REC", rota: "/painel/recusa", label: "REC · Órgão recusa<br/>'precisa de você'", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "B6 testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos" },
  { id: "N22", rota: "/assinatura", label: "N22 · Assinatura dos sócios", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "GOV.BR/e-CAC deep-link (dev); convite 2º sócio (B5) + arquitetura multi-usuário (Pedro)" },
  { id: "N23", label: "GOV.BR nível<br/>bronze→upgrade", forma: "decisao", classe: "inline", status: "construida", validado: "pendente", falta: "Dobrado inline no N22 (B7 no motor)", naTabela: false },
  { id: "ATIVA", rota: "/ativa", label: "✅ Empresa ativa", forma: "terminal", classe: "feliz", status: "construida", validado: "pendente", falta: "Dia-2 (1ª nota/DAS/certificado) é UI mock; loop UX-41 vive no portal; TFLF BH R$161,36 = fato duro" },
];

export const EDGES = [
  { de: "N1", para: "N2" },
  { de: "N2", para: "N3" },
  { de: "N3", para: "LOGIN", label: "já sou cliente" },
  { de: "N3", para: "N4A", label: "quero abrir empresa" },
  { de: "N3", para: "MIG", label: "já tenho contador (migrar)", tracejado: true },

  { de: "N4A", para: "N4V" },
  { de: "N4V", para: "DESAMB", label: "ambíguo" },
  { de: "DESAMB", para: "N4A" },
  { de: "N4V", para: "VA", label: "🟢 atende" },
  { de: "VA", para: "ENC" },
  { de: "ENC", para: "N4T" },
  { de: "N4V", para: "VW", label: "🟡 regulada" },
  { de: "N4V", para: "VC", label: "🔴 comércio" },
  { de: "N4T", para: "N4F", label: "até 2 + Brasil" },
  { de: "N4T", para: "SE", label: "sócio no exterior" },
  { de: "N4T", para: "SS", label: "3+ sócios" },

  { de: "N4F", para: "N5" },
  { de: "N5", para: "N6" },
  { de: "N6", para: "N7" },
  { de: "N7", para: "N8" },
  { de: "N8", para: "N9" },
  { de: "N9", para: "N10", label: "cartão" },
  { de: "N9", para: "P2", label: "boleto" },
  { de: "P2", para: "N10" },

  { de: "N10", para: "N11" },
  { de: "N11", para: "N12" },
  { de: "N12", para: "N12B", label: "2 sócios" },
  { de: "N12B", para: "N13" },
  { de: "N12", para: "N13", label: "solo" },
  { de: "N13", para: "N14" },
  { de: "N14", para: "N15" },
  { de: "N15", para: "N16" },
  { de: "N16", para: "N18" },

  { de: "N18", para: "N19", tracejado: true },
  { de: "N19", para: "N20", tracejado: true },
  { de: "N20", para: "N21", tracejado: true },
  { de: "N21", para: "REC", tracejado: true },
  { de: "REC", para: "N21", tracejado: true },
  { de: "N21", para: "N22", tracejado: true },
  { de: "N22", para: "N23", tracejado: true },
  { de: "N23", para: "ATIVA", tracejado: true },

  { de: "P1", para: "N10", label: "volta ao passo pausado", tracejado: true },
];
