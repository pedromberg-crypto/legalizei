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
 *   dados     — 🆕 28/07: o que essa etapa COLETA do cliente (dado novo, não
 *               repetido). '' ou ausente = não coleta nada (recap, decisão do
 *               sistema, aceite sem campo, espera, saída). Verificado linha a
 *               linha no código real de cada tela — nada aqui é inferido.
 *   naTabela  — default true; false esconde da tabela (roteamento puro).
 *   grupo     — id do subgrafo (só o GATE usa).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const SUBGRAFOS = [
  { id: "GATE", titulo: "N4 · Gate-CNAE — uma tela" },
];

export const NODES = [
  // ── ENTRADA · N1–N3 ──────────────────────────────────────────────────────
  { id: "N1", rota: "/splash", label: "N1 · Splash", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "N2", rota: "/welcome", label: "N2 · Welcome", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "N3", rota: "/entrada", label: "N3 · Fork<br/>3 rotas", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "3 rotas CONFIRMADAS 28/07 (reunião Rua Satélite 9): abrir · migrar · já sou cliente. Rota migrar aponta pro flow #2 (não existe): cobrar antes do TTRT? passivo herdado? (Pedro/Mauro)", dados: "" },
  { id: "LOGIN", rota: "/login", label: "Login / portal", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Rota feliz", dados: "" },
  { id: "MIG", label: "Flow #2 · Migração<br/>não construído", forma: "tela", classe: "todo", status: "planejada", validado: "pendente", falta: "Construir flow #2", dados: "" },

  // 🆕 28/07 · GATE DE CIDADE (reunião Rua Satélite 9) — MLP só atende Belo
  // Horizonte/MG. Trava "quero abrir"/"migrar" até confirmar; "já sou cliente"
  // pula (quem já é cliente já passou por isso). NÃO construído ainda.
  { id: "N3G", rota: "/entrada", label: "Gate cidade<br/>(BH-MG)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Construído 28/07 — 2º passo INLINE do N3, mesma rota (/entrada), sem rota própria.", dados: "Confirma cidade de abertura = Belo Horizonte/MG (único município atendido no MLP)" },
  { id: "SAIDACID", rota: "/saida/fora-bh", label: "Saída · fora de BH<br/>MLP só atende BH-MG", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "", dados: "— (saída, fora do caminho até a constituição)" },

  // ── N4 · GATE (uma tela, várias etapas) ──────────────────────────────────
  { id: "N4A", rota: "/gate", label: "Descreve atividade + pills", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "✅ 28/07: CTA 'já sei o número do meu CNAE' construído (troca pra modo código, mesma engine). Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev", dados: "Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine)" },
  { id: "N4V", label: "Veredito CNAE", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "🆕 28/07: veredito 🔴 virou 3 vias (travado na reunião), hoje o mock só faz 2 — falta implementar o split: regulamentado→waitlist (já existe) · atendido pelo Mauro (comércio etc)→contato especial · genuinamente ninguém atende→descarta (novo). Depende da lista CNAE; dev cnae-lookup responde 'atende' pra DEFESA", dados: "" },
  { id: "DESAMB", label: "Desambiguação<br/>mini-loop", forma: "tela", classe: "inline", status: "construida", validado: "ux", grupo: "GATE", falta: "", naTabela: false, dados: "" },
  { id: "N4T", label: "Triagem<br/>sócios? exterior?", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "Exterior = LC 123 art.17 (oficial); limite 2 travado. Abertos: debate 3+→waitlist, UX-42 (Mauro/Larissa)", dados: "Quantidade de sócios (1 / 2 / 3+) · mora fora do Brasil (sim/não)" },
  { id: "N4F", label: "Faixa de faturamento", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "Faixas sem âncora fiscal", dados: "Faixa de faturamento mensal (ou valor exato, se souber)" },

  // ── A2 · VEREDITO ────────────────────────────────────────────────────────
  { id: "VA", rota: "/veredito/atende", label: "🟢 Atende", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Depende da lista CNAE", dados: "" },
  { id: "VW", rota: "/veredito/waitlist", label: "🟡 Waitlist", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar)", dados: "Nome + contato · CNAE pretendido (✅ campo construído 28/07)" },
  { id: "VC", rota: "/veredito/nao-atende", label: "🔴 Contato especial<br/>(atendido pelo Mauro)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Distinto do VD (ninguém atende) via `Resultado.motivo`. Falta só o split real no mapear() do N4 (hoje é mock estático por página).", dados: "— (saída, fora do caminho até a constituição)" },
  // 🆕 28/07 (reunião Rua Satélite 9): 3ª via do veredito 🔴, antes inexistente.
  // CNAE que não é regulamentado E o Mauro também não atende — "podemos
  // descartar" (decisão explícita, não é omissão).
  { id: "VD", rota: "/veredito/descartado", label: "🔴 Fora de escopo<br/>(descarta)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "mapear() do N4 ainda não decide entre VC/VD de verdade (mock estático) — falta o split real na IA/lista de CNAEs", dados: "— (saída, fora do caminho até a constituição)" },

  // ── ENCAIXE · escolhe/trava o CNAE (NOVO 21/07, reordenacao-cluster-fiscal) ──
  { id: "ENC", rota: "/encaixe", label: "ENCAIXE<br/>escolhe/trava CNAE", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Recomendado + alternativas; % de fit real (IA cruza pill+texto) pendente; defesa de legitimidade inline. Trava o CNAE antes do nome/Junta", dados: "Confirmação/travamento do CNAE principal (dentre alternativas sugeridas)" },

  // ── B3 · DINHEIRO · N6–N9 ────────────────────────────────────────────────
  { id: "N6", rota: "/conta", label: "N6 · Criar conta", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: FRONT-LOAD construído — nome/CPF/telefone/endereço (autofill CEP) + etapa de validação por código (mock). Provider de validação CPF/situação real (Pedro)", dados: "E-mail · senha · 'é a 1ª empresa que abre?' (opcional) · nome completo · CPF · telefone · endereço (front-load 28/07) · código de verificação (mock)" },
  { id: "N7", rota: "/plano", label: "N7 · A conta da abertura", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro)", dados: "" },
  { id: "N8", rota: "/contrato", label: "N8 · Aceite contrato<br/>reversível, CDC 49", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do contrato (Mauro/Larissa); rachadura T18", dados: "Aceite do contrato de serviço (checkbox)" },
  { id: "N9", rota: "/pagamento", label: "N9 · Pagamento", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro)", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto)" },
  { id: "P2", rota: "/aguardando", label: "P2 · Aguardando boleto<br/>dossiê já liberado", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "Dunning revisado", dados: "" },

  // ── B2 · DOSSIÊ · N10–N16 ────────────────────────────────────────────────
  { id: "N10", rota: "/dossie/socio", label: "N10 · Seus dados", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do N6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do N6); regime de bens (casado)", dados: "CONFIRMA nome/CPF/endereço já captados no N6 (não recoleta) · RG + órgão emissor (novo aqui) · estado civil (+ regime de bens se casado) · confirma se mora fora do Brasil" },
  { id: "N11", rota: "/dossie/vinculo", label: "N11 · Vínculo INSS", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "INSS 11% direto + teto folga = consolidado fiscal fechado", dados: "Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)" },
  { id: "N12", rota: "/dossie/socios", label: "N12 · Sócios?", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Re-pergunta o N4 (carry-forward pendente); limite 2 ok", dados: "Confirma se terá 2º sócio" },
  { id: "N12B", label: "Coleta 2º sócio<br/>+ convite", forma: "tela", classe: "branch", status: "construida", validado: "pendente", falta: "Convite (B5) depende do N21 planejado", dados: "Nome completo do 2º sócio · % de participação de cada um (soma 100%)" },
  { id: "N13", rota: "/dossie/empresa", label: "N13 · Dados da empresa<br/>+upsell endereço", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: IPTU corrigido pra OBRIGATÓRIO travado (JUCEMG exige). Capital social mantém input livre por ora (faixas sugeridas aguardam validação com mais técnicos contábeis). Endereço ~R$60/mês = nosso preço (Mauro); custo do líder já confirmado", dados: "Endereço próprio ou fiscal Legalizai · CEP (autofill logradouro/bairro/município/UF) + número + complemento · índice cadastral IPTU (OBRIGATÓRIO, JUCEMG exige) · tipo de endereço · residência de sócio (dinâmico pelo N4 — pula se solo) · capital social" },
  { id: "N14", rota: "/dossie/cnae-secundarios", label: "N14 · CNAE secundários", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Só sugere secundárias mesmo-imposto (mesmo anexo + Fator R); regime-changer nunca aparece (decisão 21/07). Depende do anexo-por-CNAE (dataset/Larissa)", dados: "CNAEs secundários (seleção múltipla, opcional)" },
  { id: "N15", rota: "/dossie/natureza", label: "N15 · Natureza jurídica", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "SLU × LTDA: regra solo→SLU vs LTDA solo real (Larissa)", dados: "Escolha da natureza jurídica (SLU ou LTDA — sugerida, editável)" },
  { id: "N16", rota: "/dossie/nome", label: "N16 · Nome / razão social", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Viabilidade JUCEMG (RPA, não API); nome≠empresa (dev/Izabela); 3 opções por prioridade (28/07)", dados: "3 opções de razão social por ordem de prioridade (sugeridas por IA) · objeto social (sugerido por CNAE+secundárias, editável) · nome fantasia (opcional)" },

  // ── A7 · ESPERA ──────────────────────────────────────────────────────────
  { id: "P1", rota: "/retomar", label: "P1 · Retomar de onde parou", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "UX-23 fechado — mora em /pro-labore pós-constituição (N18 dissolvido 28/07)", dados: "" },

  // ── A9 · SAÍDA GRACIOSA ──────────────────────────────────────────────────
  { id: "SE", rota: "/saida/exterior", label: "Saída · exterior<br/>LC 123 art.17", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🟡 28/07: Pedro cogitou 'de fato descartar' essa saída dedicada (juntar no genérico) — dito na MESMA frase tentativa do item SS, NÃO travado. Tela já tem conteúdo jurídico revisado (LC123 art.17) — não apagar sem confirmação final. UX-42 Lucro Presumido (Mauro); debate de tom", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "SS", rota: "/saida/socios", label: "Saída · 3+ sócios<br/>limite do produto", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🟡 28/07: Pedro cogitou juntar essa saída com a Waitlist (regulamentados) — 'estou pensando', NÃO travado. Debate 3+→waitlist", dados: "— (saída, fora do caminho até a constituição)" },

  // ── B4 · CONSTITUIÇÃO (construído 21/07 — a cauda ganhou rota) ────────────
  { id: "N19", rota: "/revisar", label: "N19 · Revisar dossiê", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Recap read-only; carry-forward dos passos = estado do wizard (dev)", dados: "— (leitura + confirmação; enquadramento e pró-labore são SUGERIDOS pelo sistema, 28/07 — não digitados)" },
  { id: "N20", rota: "/termo", label: "N20 · Termo irreversível", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do termo + 4 camadas de cancelamento (Mauro/Larissa); racha T18", dados: "Aceite do termo irreversível (checkbox)" },
  { id: "N21", rota: "/painel", label: "N21 · Painel / timeline órgãos", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🆕 28/07: DAE (taxa da Junta) — decisão travada: cliente paga no N9 (junto com a mensalidade, como já é hoje). A gente SEGURA esse valor e só repassa a JUCEMG DEPOIS que a viabilidade aqui aprova — timing de backend, invisível pro cliente, SEM tela nova. 'Empresa paga o DAE' fica documentado como alternativa opcional, não implementada agora. Timeline real depende do pipeline do dev (RPA/órgãos); prazo ~8d é placeholder; UX-29 do N6 + gancho por modo/CRM", dados: "" },
  { id: "REC", rota: "/painel/recusa", label: "REC · Órgão recusa<br/>'precisa de você'", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: retry automático construído — tenta as 3 opções do N16 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. B6 testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos", dados: "Retry automático pelas 3 opções priorizadas (N16) antes de pedir novas sugestões ao cliente" },
  { id: "N22", rota: "/assinatura", label: "N22 · Assinatura dos sócios", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "GOV.BR/e-CAC deep-link (dev); convite 2º sócio (B5) + arquitetura multi-usuário (Pedro)", dados: "Assinatura via GOV.BR/e-CAC (ação, não campo de texto)" },
  { id: "N23", label: "GOV.BR nível<br/>bronze→upgrade", forma: "decisao", classe: "inline", status: "construida", validado: "pendente", falta: "Dobrado inline no N22 (B7 no motor)", naTabela: false, dados: "" },
  { id: "ATIVA", rota: "/ativa", label: "✅ Empresa ativa", forma: "terminal", classe: "feliz", status: "construida", validado: "oficial", falta: "🆕 28/07: confirmado — cliente só recebe notificação 'empresa aberta' e cai direto na P0 (certificado). Sem tela de pagamento de DAE no meio (ver nota em N21). Dia-2 (1ª nota/DAS/certificado) é UI mock; loop UX-41 vive no portal; TFLF BH R$161,36 = fato duro", dados: "" },
];

export const EDGES = [
  { de: "N1", para: "N2" },
  { de: "N2", para: "N3" },
  { de: "N3", para: "LOGIN", label: "já sou cliente" },
  { de: "N3", para: "N3G", label: "quero abrir / migrar" },
  { de: "N3G", para: "N4A", label: "BH confirmado" },
  { de: "N3G", para: "MIG", label: "BH confirmado, migrar", tracejado: true },
  { de: "N3G", para: "SAIDACID", label: "fora de BH" },

  { de: "N4A", para: "N4V" },
  { de: "N4V", para: "DESAMB", label: "ambíguo" },
  { de: "DESAMB", para: "N4A" },
  { de: "N4V", para: "VA", label: "🟢 atende" },
  { de: "VA", para: "ENC" },
  { de: "ENC", para: "N4T" },
  { de: "N4V", para: "VW", label: "🟡 regulada" },
  { de: "N4V", para: "VC", label: "🔴 Mauro atende" },
  { de: "N4V", para: "VD", label: "🔴 ninguém atende" },
  { de: "N4T", para: "N4F", label: "até 2 + Brasil" },
  { de: "N4T", para: "SE", label: "sócio no exterior" },
  { de: "N4T", para: "SS", label: "3+ sócios" },

  { de: "N4F", para: "N6" },
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
  { de: "N16", para: "N19" },

  { de: "N19", para: "N20", tracejado: true },
  { de: "N20", para: "N21", tracejado: true },
  { de: "N21", para: "REC", tracejado: true },
  { de: "REC", para: "N21", tracejado: true },
  { de: "N21", para: "N22", tracejado: true },
  { de: "N22", para: "N23", tracejado: true },
  { de: "N23", para: "ATIVA", tracejado: true },

  { de: "P1", para: "N10", label: "volta ao passo pausado", tracejado: true },
];
