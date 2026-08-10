/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FONTE-ÚNICA DO FLOW — nós, conexões e status de validação.
 * ═══════════════════════════════════════════════════════════════════════════
 * TUDO que o mapa desenha nasce daqui. NÃO editar o Mermaid na nota à mão:
 * editar ESTE arquivo e rodar `node execucao/flow/gerar-mapa.mjs`. O gerador
 * re-renderiza o diagrama + a tabela de validação e grava um snapshot
 * versionado (o "commit interno") com o resumo do que mudou.
 *
 * 🆕 03/08 — NOMENCLATURA (ADR travado, [[decisoes-marca]]): 1 letra por flow
 * (E=Entrada · C=Constituição · A=Aprovação · P=Portal, esse último em
 * portal-data.mjs). Numeração FLUIDA (1,2,3...) na linha principal de cada
 * flow; CONDICIONAL/saída/ramo vira decimal a partir da tela onde bifurca
 * (ex: E4.1 é filha de E4). No `id` (usado como nó do Mermaid) o ponto vira
 * `_` (E4_1) — o ponto de verdade só aparece no `label`. Migrar (antes M1-M6)
 * agora é ramo decimal de Entrada (E4.2→E4.5, depois E9.3→E9.4), não flow
 * próprio — reflete o ADR "migrar é caminho dentro da entrada".
 *
 * Campos de um nó:
 *   id        — identificador no grafo (alfanumérico, sem ponto).
 *   rota      — caminho da tela no app (só telas com rota; usado no check de
 *               drift contra os arquivos reais). Ausente = etapa/decisão/planejada.
 *   label     — texto no diagrama (aceita <br/>). Carrega o código E/C/A.
 *   forma     — 'tela' | 'decisao' | 'terminal'  (retângulo | losango | cápsula).
 *   classe    — cor: '' | 'saida' | 'feliz' | 'espera' | 'branch' | 'inline' | 'todo'.
 *   status    — 'construida' | 'planejada'.
 *   validado  — 'oficial' (norma/decisão travada) | 'ux' (só UX, revisado) | 'pendente'.
 *   falta     — o que ainda espera gente (texto curto) ou ''.
 *   dados     — 🆕 28/07: o que essa etapa COLETA do cliente (dado novo, não
 *               repetido). '' ou ausente = não coleta nada (recap, decisão do
 *               sistema, aceite sem campo, espera, saída). Verificado linha a
 *               linha no código real de cada tela — nada aqui é inferido.
 *   naTabela  — default true; false esconde da tabela (roteamento puro/inline).
 *   grupo     — id do subgrafo (só o GATE usa).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const SUBGRAFOS = [
  { id: "GATE", titulo: "E5 · Gate-CNAE — uma tela" },
];

export const NODES = [
  // ── ENTRADA (E) · E1–E3 ──────────────────────────────────────────────────
  { id: "E1", rota: "/splash", label: "E1 · Splash", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E2", rota: "/welcome", label: "E2 · Welcome", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E3", rota: "/entrada", label: "E3 · Fork<br/>3 rotas", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "3 rotas CONFIRMADAS 28/07 (reunião Rua Satélite 9): abrir · migrar · já sou cliente.", dados: "" },
  { id: "E3_1", rota: "/login", label: "E3.1 · Login / portal", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Rota feliz", dados: "" },

  // 🆕 03/08 (ampliado 04/08) — E3.2 · MEI × ME, entre o fork (E3) e o gate de
  // cidade (E4). Realocada aqui vindo do fim do E5 (decisão anterior,
  // revertida). Vale pros 2 caminhos (abrir E migrar) desde 04/08. Fonte:
  // app/(wizard)/entrada/page.tsx.
  { id: "E3_2", rota: "/entrada", label: "E3.2 · MEI × ME<br/>(autodeclarado)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "MEI não tem o limite geográfico do MLP → pula o E4 inteiro (abrir vai direto pro E5A, migrar direto pro E4.2). ME cai no E4 como sempre. Autodeclarado — quem confirma de verdade é o E4.2/E4.2b puxando da Receita. 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática", dados: "Regime autodeclarado (MEI ou ME)" },

  // 🆕 28/07 · GATE DE CIDADE (reunião Rua Satélite 9) — MLP só atende Belo
  // Horizonte/MG. Trava "quero abrir"/"migrar" até confirmar (depois do E3.2 —
  // só quem é ME passa por aqui, MEI já pulou); "já sou cliente" pula (quem já
  // é cliente já passou por isso). Bifurca em E5 (abrir) ou E4.2 (migrar,
  // decimal — ver ADR 03/08).
  { id: "E4", rota: "/entrada", label: "E4 · Gate cidade<br/>(BH-MG)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Construído 28/07 — 2º passo INLINE do E3, mesma rota (/entrada), sem rota própria.", dados: "Confirma cidade de abertura = Belo Horizonte/MG (único município atendido no MLP)" },
  { id: "E4_1", rota: "/saida/fora-bh", label: "E4.1 · Saída · fora de BH<br/>MLP só atende BH-MG", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "", dados: "— (saída, fora do caminho até a constituição)" },

  // ── MIGRAR DE CONTADOR — ramo decimal de E4 (construído 30/07) ────────────
  // Fonte: components/wizard-migrar.tsx. Sem entrevista de CNAE (o cartão CNPJ
  // já traz) — diferença estrutural vs. o caminho "abrir". Rotas confirmadas
  // 30/07 rastreando router.push/onSeguir no código real, não inferidas.
  { id: "E4_2", rota: "/migrar/cnpj", label: "E4.2 · Lê o cartão CNPJ", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Autofill por CNPJ via InfoSimples (cadastro, R$0,20/consulta — API PAGA, não pública); sem entrevista de atividade — o CNAE já existe. 🔴 05/08: checagem de regime removida daqui (a API não confirma Simples×Presumido×MEI, ver infosimples-funcionalidades.md) — regime já vem autodeclarado da E3.2. Só confirma situação cadastral (ativa/inapta)", dados: "CNPJ (consulta) · confirmação dos dados do cartão" },
  { id: "E4_2_1", rota: "/saida/cnpj-inapto", label: "Saída · CNPJ inapto<br/>ou suspenso", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "Situação cadastral ≠ ativa: aqui a Receita nem reconhece a empresa como ativa, regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (E9.2, empresa ATIVA com dívida) — essa tela foi retirada do flow", dados: "— (saída, fora do caminho até a migração)" },
  // 🔴 05/08 — E4_2B_1 (saída Presumido) agora é alcançada direto da E3.2
  // (CTA menor abaixo dos cards MEI/ME): a tela intermediária E4.2b
  // (`/migrar/tributario`, Simples×Presumido autodeclarado) foi DESCARTADA
  // por duplicar a pergunta que a E3.2 já faz. Ver decisoes-marca.md 05/08.
  { id: "E4_2B_1", rota: "/saida/regime-nao-suportado", label: "Saída · Presumido<br/>fora de escopo", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "Lucro Presumido segue fora do escopo (decisão explícita 04/08, sem pesquisa fiscal dedicada ainda). Autodeclarado na E3.2, não confirmado por API", dados: "— (saída, fora do caminho até a migração)" },
  { id: "E4_3", rota: "/migrar/diagnostico", label: "E4.3 · Diagnóstico<br/>(\"tem certificado?\")", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🔴 04/08 (3ª rodada): o diagnóstico de Fator R pra ME foi CORTADO — a única API pré-pagamento é a cadastral, não traz faturamento/folha (só via procuração, pós-pagamento). 🔴 05/08: pergunta virou 'tem certificado?' (MEI: decide se roda TTRT). 🔴 06/08 (achado do Pedro): ME TAMBÉM passa aqui agora (antes ia do E4.2 direto pro E4.4) — certificado é independente da TTRT pra ME (as duas rodam em paralelo), mas não tinha pergunta nenhuma no caminho ME. 🟡 fila-Mauro: se sem-certificado-ME carrega custo/fidelidade extra é decisão de preço não tomada", dados: "Resposta sim/não (tem certificado digital)" },
  { id: "E4_4", rota: "/migrar/plano", label: "E4.4 · Plano", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "ME: mesma mensalidade do caminho abrir, sem taxa de governo (empresa já existe). 🆕 04/08: MEI tem plano PRÓPRIO — R$49,90/mês, fidelidade 12 meses, certificado incluso, escopo limitado (emitir NF + 1 colaborador) — não é o plano ME com desconto", dados: "" },
  { id: "E4_5", rota: "/migrar/contrato", label: "E4.5 · Contrato<br/>+ promessa de devolução", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔴 DECISÃO TRAVADA 30/07: cobra ANTES do TTRT, com contrapartida OBRIGATÓRIA no contrato ('se a transferência não sair por motivo fora do seu controle, devolve tudo'). Se essa linha sair do contrato, a decisão reabre (Mauro/Larissa redigem)", dados: "Aceite do contrato (com a cláusula de devolução)" },
  // 🆕 06/08 (reunião Rua Satélite 19, Léo) — número reaproveitado: a E9.2
  // antiga (auditoria de passivo) foi retirada nesse mesmo dia; este é um nó
  // NOVO, sem relação com o antigo. Só ME passa por aqui — MEI não tem TTRT
  // (segue direto de E9 pra E9.4), simplificação já usada nos outros nós
  // decimais desta esteira (o fork por regime não vira aresta própria).
  { id: "E9_2", rota: "/migrar/contador", label: "E9.2 · Seu contador atual", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🟡 fonte única (Léo, reunião Rua Satélite 19, 06/08) — sem 2ª fonte ainda. Não existe API pública que diga quem é o contador de um CNPJ; o cartão CNPJ traz e-mail/telefone NA MAIORIA das vezes, não sempre. Nome e CRC são sempre digitados. Sem trava de Continuar — quem não sabe algum dado segue mesmo assim, confirma o resto com o conselho na E9.3", dados: "Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer) · CRC (opcional)" },
  { id: "E9_3", rota: "/migrar/transferencia", label: "E9.3 · Aguardando TTRT", forma: "tela", classe: "espera", status: "construida", validado: "oficial", falta: "🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG) — único momento em que o dono da espera é um concorrente perdendo o cliente, não um órgão neutro nem o próprio cliente. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária — por isso não aparecem na tela (🟡 pendência)", dados: "" },
  { id: "E9_4", rota: "/migrar/ativa", label: "✅ E9.4 · Migração concluída", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs)", dados: "" },

  // ── E5 · GATE (uma tela, várias etapas) ──────────────────────────────────
  { id: "E5A", rota: "/gate", label: "Descreve atividade + pills", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "✅ 28/07: CTA 'já sei o número do meu CNAE' construído (troca pra modo código, mesma engine). Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev", dados: "Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine)" },
  { id: "E5V", label: "Veredito CNAE", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "🆕 28/07: veredito 🔴 virou 3 vias (travado na reunião), hoje o mock só faz 2 — falta implementar o split: regulamentado→waitlist (já existe) · atendido pelo Mauro (comércio etc)→contato especial · genuinamente ninguém atende→descarta (novo). Depende da lista CNAE; dev cnae-lookup responde 'atende' pra DEFESA. 🆕 31/07: veredito 🟢 ganhou cards clicáveis (UX-65) e travar o CNAE via ENCAIXE virou redundante — ENCAIXE removido, o veredito trava direto", dados: "" },
  { id: "DESAMB", label: "Desambiguação<br/>mini-loop", forma: "tela", classe: "inline", status: "construida", validado: "ux", grupo: "GATE", falta: "", naTabela: false, dados: "" },
  { id: "E5VA", rota: "/veredito/atende", label: "🟢 Atende", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "Depende da lista CNAE", dados: "" },
  { id: "E5T", label: "Triagem<br/>sócios? exterior?", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "Exterior = LC 123 art.17 (oficial); limite 2 travado. Abertos: debate 3+→waitlist, UX-42 (Mauro/Larissa)", dados: "Quantidade de sócios (1 / 2 / 3+) · mora fora do Brasil (sim/não)" },
  { id: "E5F", label: "Faixa de faturamento", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "Faixas sem âncora fiscal", dados: "Faixa de faturamento mensal (ou valor exato, se souber)" },

  // ── SAÍDAS/EXITS do veredito e da triagem — decimal de E5 ─────────────────
  { id: "E5_1", rota: "/veredito/waitlist", label: "E5.1 · 🟡 Waitlist", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar)", dados: "Nome + contato · CNAE pretendido (✅ campo construído 28/07)" },
  { id: "E5_2", rota: "/veredito/nao-atende", label: "E5.2 · 🔴 Contato especial<br/>(atendido pelo Mauro)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página).", dados: "— (saída, fora do caminho até a constituição)" },
  // 🆕 28/07 (reunião Rua Satélite 9): 3ª via do veredito 🔴, antes inexistente.
  { id: "E5_3", rota: "/veredito/descartado", label: "E5.3 · 🔴 Fora de escopo<br/>(descarta)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "E5_4", rota: "/saida/exterior", label: "E5.4 · Saída · exterior<br/>LC 123 art.17", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🟡 28/07: Pedro cogitou 'de fato descartar' essa saída dedicada (juntar no genérico) — dito na MESMA frase tentativa do E5.5, NÃO travado. Tela já tem conteúdo jurídico revisado (LC123 art.17) — não apagar sem confirmação final. UX-42 Lucro Presumido (Mauro); debate de tom", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "E5_5", rota: "/saida/socios", label: "E5.5 · Saída · 3+ sócios<br/>limite do produto", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🟡 28/07: Pedro cogitou juntar essa saída com a Waitlist (regulamentados) — 'estou pensando', NÃO travado. Debate 3+→waitlist", dados: "— (saída, fora do caminho até a constituição)" },

  // ── ENTRADA (E) · DINHEIRO · E6–E9 ───────────────────────────────────────
  { id: "E6", rota: "/conta", label: "E6 · Criar conta", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: FRONT-LOAD construído — nome/CPF/telefone/endereço (autofill CEP) + etapa de validação por código (mock). Provider de validação CPF/situação real (Pedro)", dados: "E-mail · senha · 'é a 1ª empresa que abre?' (opcional) · nome completo · CPF · telefone · endereço (front-load 28/07) · código de verificação (mock)" },
  { id: "E7", rota: "/plano", label: "E7 · A conta da abertura", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro)", dados: "" },
  { id: "E8", rota: "/contrato", label: "E8 · Aceite contrato<br/>reversível, CDC 49", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do contrato (Mauro/Larissa); rachadura T18", dados: "Aceite do contrato de serviço (checkbox)" },
  { id: "E9", rota: "/pagamento", label: "E9 · Pagamento", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro)", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto)" },
  { id: "E9_1", rota: "/aguardando", label: "E9.1 · Aguardando boleto<br/>dossiê já liberado", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "Dunning revisado", dados: "" },

  // ── CONSTITUIÇÃO (C) · dossiê · C1–C7 ────────────────────────────────────
  { id: "C1", rota: "/dossie/socio", label: "C1 · Seus dados", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado)", dados: "CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (novo aqui) · estado civil (+ regime de bens se casado) · confirma se mora fora do Brasil" },
  { id: "C2", rota: "/dossie/vinculo", label: "C2 · Vínculo INSS", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "INSS 11% direto + teto folga = consolidado fiscal fechado", dados: "Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)" },
  { id: "C3", rota: "/dossie/socios", label: "C3 · Sócios?", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Re-pergunta o E5T (carry-forward pendente); limite 2 ok", dados: "Confirma se terá 2º sócio" },
  { id: "C3_1", label: "C3.1 · Coleta 2º sócio<br/>+ convite", forma: "tela", classe: "branch", status: "construida", validado: "pendente", falta: "Convite depende do A3 planejado", dados: "Nome completo do 2º sócio · % de participação de cada um (soma 100%)" },
  { id: "C4", rota: "/dossie/empresa", label: "C4 · Dados da empresa<br/>+upsell endereço", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: IPTU corrigido pra OBRIGATÓRIO travado (JUCEMG exige). Capital social mantém input livre por ora (faixas sugeridas aguardam validação com mais técnicos contábeis). Endereço ~R$60/mês = nosso preço (Mauro); custo do líder já confirmado", dados: "Endereço próprio ou fiscal Legalizai · CEP (autofill logradouro/bairro/município/UF) + número + complemento · índice cadastral IPTU (OBRIGATÓRIO, JUCEMG exige) · tipo de endereço · residência de sócio (dinâmico pelo E5T — pula se solo) · capital social" },
  { id: "C5", rota: "/dossie/cnae-secundarios", label: "C5 · CNAE secundários", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Só sugere secundárias mesmo-imposto (mesmo anexo + Fator R); regime-changer nunca aparece (decisão 21/07). Depende do anexo-por-CNAE (dataset/Larissa)", dados: "CNAEs secundários (seleção múltipla, opcional)" },
  { id: "C6", rota: "/dossie/natureza", label: "C6 · Natureza jurídica", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "SLU × LTDA: regra solo→SLU vs LTDA solo real (Larissa)", dados: "Escolha da natureza jurídica (SLU ou LTDA — sugerida, editável)" },
  { id: "C7", rota: "/dossie/nome", label: "C7 · Nome / razão social", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Viabilidade JUCEMG (RPA, não API); nome≠empresa (dev/Izabela); 3 opções por prioridade (28/07)", dados: "3 opções de razão social por ordem de prioridade (sugeridas por IA) · objeto social (sugerido por CNAE+secundárias, editável) · nome fantasia (opcional)" },

  // ── ESPERA — decimal de entrada em Constituição ──────────────────────────
  { id: "C0_1", rota: "/retomar", label: "C0.1 · Retomar de onde parou", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "UX-23 fechado — mora em /pro-labore pós-constituição", dados: "" },

  // ── APROVAÇÃO (A) · cauda · A1–A5 (construído 21/07) ─────────────────────
  { id: "A1", rota: "/revisar", label: "A1 · Revisar dossiê", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Recap read-only; carry-forward dos passos = estado do wizard (dev)", dados: "— (leitura + confirmação; enquadramento e pró-labore são SUGERIDOS pelo sistema, 28/07 — não digitados)" },
  { id: "A2", rota: "/termo", label: "A2 · Termo irreversível", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do termo + 4 camadas de cancelamento (Mauro/Larissa); racha T18", dados: "Aceite do termo irreversível (checkbox)" },
  { id: "A3", rota: "/painel", label: "A3 · Painel<br/>3 status", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🆕 30/07: reduzido de 9→3 status (2 passadas). 'Registrar a empresa'→'Analisando viabilidade'; novo 'Documentação completa preenchida' (check, acima) + 'Agora é só assinar' (cinza, depende do deferimento da Junta). 🆕 28/07: DAE (taxa da Junta) — cliente paga no E9 junto com a mensalidade; a gente SEGURA e só repassa à JUCEMG depois da viabilidade aprovar — timing de backend, SEM tela nova. 🆕 30/07: NÃO absorvemos a taxa (alinhado ao líder, contrato Contabilizei 4.3\"h\"). Timeline real depende do pipeline do dev; prazo ~8d é placeholder", dados: "" },
  { id: "A3_1", rota: "/painel/recusa", label: "A3.1 · Órgão recusa<br/>'precisa de você'", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: retry automático construído — tenta as 3 opções do C7 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. Testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos", dados: "Retry automático pelas 3 opções priorizadas (C7) antes de pedir novas sugestões ao cliente" },
  { id: "A4", rota: "/assinatura", label: "A4 · Assinatura dos sócios", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "GOV.BR/e-CAC deep-link (dev); convite 2º sócio + arquitetura multi-usuário (Pedro)", dados: "Assinatura via GOV.BR/e-CAC (ação, não campo de texto)" },
  { id: "A4G", label: "GOV.BR nível<br/>bronze→upgrade", forma: "decisao", classe: "inline", status: "construida", validado: "pendente", falta: "Dobrado inline no A4", naTabela: false, dados: "" },
  { id: "REMOVIDO_N24", label: "'Empresa ativa'<br/>🗑️ REMOVIDO 30/07", forma: "terminal", classe: "todo", status: "planejada", validado: "oficial", falta: "Era órfão desde o swap A4→A5 (nenhuma rota navegava mais até aqui) — arquivo `/ativa` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa", dados: "" },
  { id: "A5", rota: "/home-dia1", label: "✅ A5 · Home dia-1<br/>(ativação)", forma: "terminal", classe: "feliz", status: "construida", validado: "oficial", falta: "🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). Trata o certificado como item 2/3 da própria trilha, não gate isolado. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs", dados: "" },
];

export const EDGES = [
  { de: "E1", para: "E2" },
  { de: "E2", para: "E3" },
  { de: "E3", para: "E3_1", label: "já sou cliente" },
  { de: "E3", para: "E3_2", label: "quero abrir / migrar" },
  { de: "E3_2", para: "E4", label: "ME" },
  { de: "E3_2", para: "E5A", label: "MEI, abrir (pula cidade)", tracejado: true },
  { de: "E3_2", para: "E4_2", label: "MEI, migrar (pula cidade)", tracejado: true },
  { de: "E4", para: "E5A", label: "BH confirmado, abrir" },
  { de: "E4", para: "E4_2", label: "BH confirmado, migrar" },
  { de: "E4", para: "E4_1", label: "fora de BH" },

  { de: "E4_2", para: "E4_3", tracejado: true },
  { de: "E3_2", para: "E4_2B_1", label: "Lucro Presumido (CTA)" },
  { de: "E4_2", para: "E4_2_1", label: "CNPJ inapto/suspenso", tracejado: true },
  { de: "E4_2", para: "E5_1", label: "🟡 regulada" },
  { de: "E4_2", para: "E5_2", label: "🔴 Mauro atende" },
  { de: "E4_3", para: "E4_4", tracejado: true },
  { de: "E4_4", para: "E4_5" },
  { de: "E4_5", para: "E9", label: "fluxo migrar" },
  { de: "E9", para: "E9_2", label: "fluxo migrar", tracejado: true },
  { de: "E9_2", para: "E9_3", tracejado: true },
  { de: "E9_3", para: "E9_4", tracejado: true },
  { de: "E9_4", para: "A5", tracejado: true },

  { de: "E5A", para: "E5V" },
  { de: "E5V", para: "DESAMB", label: "ambíguo" },
  { de: "DESAMB", para: "E5A" },
  { de: "E5V", para: "E5VA", label: "🟢 atende" },
  { de: "E5VA", para: "E5T" },
  { de: "E5V", para: "E5_1", label: "🟡 regulada" },
  { de: "E5V", para: "E5_2", label: "🔴 Mauro atende" },
  { de: "E5V", para: "E5_3", label: "🔴 ninguém atende" },
  { de: "E5T", para: "E5F", label: "até 2 + Brasil" },
  { de: "E5T", para: "E5_4", label: "sócio no exterior" },
  { de: "E5T", para: "E5_5", label: "3+ sócios" },

  { de: "E5F", para: "E6" },
  { de: "E6", para: "E7" },
  { de: "E7", para: "E8" },
  { de: "E8", para: "E9" },
  { de: "E9", para: "C1", label: "cartão" },
  { de: "E9", para: "E9_1", label: "boleto" },
  { de: "E9_1", para: "C1" },

  { de: "C1", para: "C2" },
  { de: "C2", para: "C3" },
  { de: "C3", para: "C3_1", label: "2 sócios" },
  { de: "C3_1", para: "C4" },
  { de: "C3", para: "C4", label: "solo" },
  { de: "C4", para: "C5" },
  { de: "C5", para: "C6" },
  { de: "C6", para: "C7" },
  { de: "C7", para: "A1" },

  { de: "A1", para: "A2", tracejado: true },
  { de: "A2", para: "A3", tracejado: true },
  { de: "A3", para: "A3_1", tracejado: true },
  { de: "A3_1", para: "A3", tracejado: true },
  { de: "A3", para: "A4", tracejado: true },
  { de: "A4", para: "A4G", tracejado: true },
  { de: "A4G", para: "A5", tracejado: true },

  { de: "C0_1", para: "C1", label: "volta ao passo pausado", tracejado: true },
];
