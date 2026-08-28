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

/**
 * 🆕 26/08 — campos que a viabilidade/DBE exigem mas NÃO viram pergunta ao
 * cliente: a Legalizai preenche por conta própria. Decisões travadas em
 * `marca/decisoes-marca.md` (26/08), cruzamento em
 * `gap-analise-dados-abertura-vs-pesquisa-gemini.md`. Lido por
 * `gerar-mapa.mjs` pra montar a seção "preenchidos por nós" do
 * `dados-coletados-abertura-ate-viabilidade.md` — mesma régua do resto do
 * arquivo, editar AQUI, nunca direto na nota gerada.
 */
export const PREENCHIDOS_INTERNAMENTE = [
  {
    campo: "Forma de atuação (JUCEMG)",
    valor: '"Internet" / atividade fora do estabelecimento',
    contexto: "C4 · Dados da empresa",
    status: "🟡 travado internamente, pendente de validação técnica",
    porque: "Não gera dúvida útil pro cliente nem interfere na atuação dele — vale enquanto o escopo for serviço 100% remoto. Reabrir se o produto passar a atender CNAEs com atendimento físico (cabeleireira, personal trainer etc.)",
  },
  {
    campo: "Tipo de unidade (JUCEMG)",
    valor: '"Sede"',
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado",
    porque: "Toda abertura nova (1 endereço só) é sempre Sede — não existe cenário no MVP onde seria Unidade Administrativa (só valeria numa 2ª filial de empresa já aberta)",
  },
  {
    campo: "Metragem (m² do imóvel + m² da operação)",
    valor: "— (não implementado)",
    contexto: "C4 · Dados da empresa",
    status: "🟡 pendente, sem decisão",
    porque: "Nenhuma fonte confirma esse campo além do índice cadastral IPTU (já coletado) — não implementar até aparecer confirmação real",
  },
];

export const NODES = [
  // ── ENTRADA (E) · E1–E3 ──────────────────────────────────────────────────
  { id: "E1", rota: "/splash", label: "E1 · Splash", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  // 🆕 26/08 (pedido do Pedro: "não podemos ter telas camufladas") — E2 era 1
  // nó só escondendo 3 slides de carrossel (`components/welcome.tsx`, `SLIDES`).
  // Virou 3 nós, 1 por slide, via `/welcome?slide=N` (mesmo padrão de deep-link
  // de `/entrada`/`/gate?etapa=`) — cada um agora tem prévia ao vivo própria.
  { id: "E2_1", rota: "/welcome?slide=0", label: "E2.1 · Welcome<br/>(1/3 · Contador de verdade)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E2_2", rota: "/welcome?slide=1", label: "E2.2 · Welcome<br/>(2/3 · Parte chata)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E2_3", rota: "/welcome?slide=2", label: "E2.3 · Welcome<br/>(3/3 · Sem susto no boleto)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  // 🆕 26/08 (pedido do Pedro: "linka o CTA no caminho dele, não a tela
  // inteira") — 3 pontos de saída nomeados, 1 por CTA real da tela
  // (`components/entrada.tsx` passo 1): botão coral "Quero abrir minha
  // empresa", card branco "Já tenho empresa", link "Entrar na minha conta".
  { id: "E3", rota: "/entrada", label: "E3 · Fork<br/>3 rotas", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "3 rotas CONFIRMADAS 28/07 (reunião Rua Satélite 9): abrir · migrar · já sou cliente.", dados: "", handles: [
    { id: "abrir", yPercent: 78 },
    { id: "migrar", yPercent: 88 },
    { id: "login", yPercent: 96 },
  ] },
  { id: "E3_1", rota: "/login", label: "E3.1 · Login / portal", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Rota feliz", dados: "" },

  // 🆕 03/08 (ampliado 04/08) — E3.2 · MEI × ME, entre o fork (E3) e o gate de
  // cidade (E4). Realocada aqui vindo do fim do E5 (decisão anterior,
  // revertida). Vale pros 2 caminhos (abrir E migrar) desde 04/08. Fonte:
  // app/(wizard)/entrada/page.tsx.
  // 🆕 26/08 (pedido do Pedro: "temos 2 páginas aprovadas, por que só 1 no
  // mapa?") — E3.2 tem 2 VARIANTES DE COPY aprovadas (`telas-flow.ts`),
  // não 1 tela só: "variante Abrir" (critério de elegibilidade, "o que devo
  // escolher") e "variante Migrar" (autodeclaração, "o que eu já sou" —
  // CNPJ já existe, não há escolha). Copy genuinamente diferente por
  // `contexto` (`MeiOuMeView`), então vira 2 nós — mesmo tratamento do E2.
  { id: "E3_3", rota: "/dados", label: "E3.3 · Seus dados<br/>(nome · e-mail · telefone)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🆕 27/08 — captura de lead, logo depois do fork. NÃO cria conta (isso continua no E6): só identifica quem está do outro lado, porque antes disso o funil inteiro era anônimo até o E6. Cruzamento com o funil da Contabilizei (que pede os mesmos 3 campos na 1ª tela) motivou a mudança. 🟡 LGPD: carrega consentimento mínimo em 1 linha com link, sem checkbox — o aceite contratual segue no E8. 🔴 RF-01: os dados não viajam por querystring (dado pessoal em URL é vazamento), então o E6 hoje exibe o mock `CLIENTE`; quando existir estado real, vem de lá", dados: "Nome completo · e-mail · telefone · consentimento de privacidade (implícito, ao continuar)" },
  { id: "E3_2", rota: "/entrada?intencao=abrir", label: "E3.2 · MEI × ME<br/>(variante Abrir)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "🔄 27/08: agora vem DEPOIS do E3.3 (dados) e ANTES do E3.4 (endereço + categoria). MEI não tem o limite geográfico do MLP, mas PASSA pelo E3.4 mesmo assim — o gate de BH não vale pra ele, o de CATEGORIA vale (é ele que autoriza o CNAE a ir pra pós-pagamento, então ninguém pula). 🔴 27/08: card ME · Lucro Presumido REMOVIDO (decisão do Pedro; captação de LP no abrir fica parqueada). 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática", dados: "Regime autodeclarado (MEI ou ME)" },
  { id: "E3_2_M", rota: "/entrada?intencao=migrar", label: "E3.2 · MEI × ME<br/>(variante Migrar)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Mesma tela (`MeiOuMeView`), `contexto=\"migrar\"`: copy vira autodeclaração (\"sua empresa hoje é MEI ou ME?\"), não critério de escolha. MEI pula E4 inteiro, vai direto pro M1 (`/migrar/cnpj?cenario=mei`)", dados: "Regime autodeclarado (MEI ou ME)" },

  // 🆕 27/08 · CAPTURA DE LEAD (reordenação do flow de entrada, ADR 27/08).
  // Duas telas NOVAS entre o fork e a triagem. Fonte:
  // `components/entrada-lead.tsx` + rotas `/dados` e `/endereco`.
  //
  // ⚠️ NUMERAÇÃO NÃO É CRONOLÓGICA neste bloco, e é de propósito: E3.1 já era
  // a saída de login e E3.2 já era o MEI×ME, ambos com referência histórica
  // pesada em docs/memórias. Renumerar quebraria mais do que resolve. A ordem
  // REAL do flow é: E3 → E3.3 → E3.2 → E3.4. O mapa desenha por aresta, então
  // o desenho fica certo; só o número é fora de ordem.
  { id: "E3_4", rota: "/endereco", label: "E3.4 · Endereço + categoria<br/>(os 2 gates)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "🆕 27/08 — reúne os DOIS gates do produto antes do dinheiro. (1) ENDEREÇO: substitui o E4 (gate de cidade, REMOVIDO), que perguntava 'é em BH?' e acreditava no clique — aqui o CEP valida de verdade (`ehCepBh`, faixa 30000-000 a 31999-999, 🟡 não ratificada em fonte primária). Quem não tem endereço em BH recebe o endereço fiscal da Legalizai como SOLUÇÃO (a sede fica em BH de qualquer jeito, porque o município segue o endereço da sede, não o domicílio do dono). Herdou também a escolha 'próprio × fiscal' que morava no E5F. (2) CATEGORIA: assume o papel de gate de elegibilidade que era do veredito de CNAE — como a lista só oferece o que a gente atende, escolher já É passar pelo filtro, e é isso que autorizou o CNAE a ir pra depois do pagamento. MEI passa por aqui também (sem exigir BH): o gate geográfico não vale pra ele, mas o de categoria vale", dados: "Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) · categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza)", handles: [
    { id: "segue", yPercent: 85 },
    { id: "fora", yPercent: 92 },
  ] },
  { id: "E4_1", rota: "/saida/fora-bh", label: "E4.1 · Saída · fora de BH<br/>MLP só atende BH-MG", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "🔄 27/08 — a entrada mudou: nascia do E4 (gate de cidade), que foi removido. Agora é alcançada do E3.4, e só por quem recusa TAMBÉM o endereço fiscal (que resolveria o caso). Por isso o volume aqui deve cair muito", dados: "— (saída, fora do caminho até a constituição)" },

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
  { id: "E9_2", rota: "/migrar/contador", label: "E9.2 · Seu contador atual", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔒 24/08 (reunião Leonan 19/08, CONFLITO RESOLVIDO): CRC agora é OBRIGATÓRIO, trava o Continuar — 'eu preciso do número do CRC de qualquer forma' (Leonan). Antes o doc dizia 'opcional', estava errado/desatualizado. Nome/e-mail/telefone continuam opcionais — só o CRC não tem contorno", dados: "Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer, opcionais) · CRC (OBRIGATÓRIO)" },
  // 🆕 24/08 (reunião Leonan 19/08) — TRÊS nós NOVOS, entre E9.2 e E9.3.
  // Achado tardio (Pedro re-lendo a reunião): "durante essa migração, eu
  // preciso que, além dos dados que consegui puxar via API do cartão CNPJ,
  // ele preencha TODOS os dados base de uma constituição [...] ele terminou
  // de preencher a sociedade [...] a gente vem para a parte de estamos
  // encerrando lá, transferindo a responsabilidade." — ou seja, DEPOIS do
  // contador atual e ANTES da transferência, não antes do pagamento (1ª
  // tentativa desta rodada colocou errado, entre CNPJ e diagnóstico — corrigido).
  { id: "E9_2A", rota: "/migrar/dados", label: "E9.2b · Dados que o<br/>cartão CNPJ não traz", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Reusa os mesmos campos do C1 (abertura) — CPF/RG/órgão/estado civil, digitação manual. 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui foi REMOVIDO do MVP (custo/velocidade)", dados: "CPF · RG + órgão emissor · estado civil" },
  { id: "E9_2B", rota: "/migrar/socios", label: "E9.2c · Dados dos sócios", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "MESMA tela do C3 (`SociosView`), reusada com `contexto=\"migrar\"` — só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar (diferente do E5T no abrir), então a tela se sustenta sozinha", dados: "Nome completo + % de participação de cada sócio extra (CPF implícito, quantidade fixa)" },
  { id: "E9_2C", rota: "/migrar/gov", label: "E9.2d · GOV.BR + procuração", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao` — não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente", dados: "Código de validação de 6 dígitos (janela 10min)" },
  { id: "E9_3", rota: "/migrar/transferencia", label: "E9.3 · Iniciando transferência", forma: "tela", classe: "espera", status: "construida", validado: "oficial", falta: "🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG). 🆕 24/08 (reunião Leonan): copy do status trocou pra 'Iniciando o processo de transferência' + 'Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga' — diferente do status de constituição ('empresa foi constituída'), antes os dois diziam a mesma coisa. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária (🟡 pendência)", dados: "" },
  { id: "E9_4", rota: "/migrar/ativa", label: "✅ E9.4 · Migração concluída", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs)", dados: "" },

  // ── E5 · TRIAGEM + FAIXA (o que sobrou do gate antes do dinheiro) ────────
  // 🔄 27/08 — o bloco de CNAE (descrever → veredito → desambiguação) saiu
  // daqui e virou a **C0** (`/dossie/atividade`), DEPOIS do pagamento. Ver os
  // nós C0/C0_2/C0_3 na seção de Constituição.
  //
  // ⚠️ Triagem e faixa NÃO foram junto, e isso é decisão: elas bloqueiam por
  // motivos que a categoria (o gate novo) não cobre — sócio via CNPJ e sócio
  // no exterior tiram do Simples, 5+ sócios é limite do produto. Nenhum é
  // previsível pela atividade, e movê-los criaria reembolso pra um caso que
  // hoje não existe (a gente nunca cobra de quem já sabe que não atende).
  { id: "E5T", rota: "/gate?etapa=triagem", label: "Triagem<br/>sócios? CPF/CNPJ? exterior?", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "🆕 24/08 (reunião Leonan 19/08): limite subiu de 2 pra 4 sócios; aviso proativo (não bloqueio) de assinatura múltipla nos 3-4; só 5+ bloqueia. 🆕 24/08 (pedido do Pedro): nova pergunta condicional — sócio CPF ou CNPJ? CNPJ bloqueia (regra fiscal: tira do Simples), rota /saida/socio-pj. Como o tipo já é decidido aqui, o C3 (dossiê) nem pergunta de novo. Exterior = LC 123 art.17 (oficial). 🆕 26/08: coorte ('é a 1ª empresa que você abre?') pousou aqui de vez — 3ª realocação (Veredito → Faixa → aqui), dado puro de log/marketing, opcional", dados: "Quantidade de sócios (1 / 2 / 3 / 4 / 5+) · sócio via CPF ou CNPJ (quando há sócio) · mora fora do Brasil (sim/não) · é a 1ª empresa que abre? (opcional)" },
  { id: "E5F", rota: "/gate?etapa=faixa", label: "Faixa de faturamento", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "Faixas sem âncora fiscal. 🔴 27/08: a escolha de endereço (próprio × fiscal Legalizai) SAIU daqui — morou nesta tela entre 26/08 e 27/08 e foi pro E3.4, junto do gate de cidade, que é a pergunta de que ela sempre foi parte (faturamento não decide onde a empresa fica). O valor continua somando no E7 pelo mesmo `?endereco=fiscal`. Fonte: `components/gate-telas.tsx` (`FaixaView`)", dados: "Faixa de faturamento mensal (ou valor exato, se souber)" },

  // ── SAÍDAS/EXITS do veredito e da triagem — decimal de E5 ─────────────────
  { id: "E5_1", rota: "/veredito/waitlist", label: "E5.1 · 🟡 Waitlist", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar)", dados: "Nome + contato · CNAE pretendido (✅ campo construído 28/07)" },
  { id: "E5_2", rota: "/veredito/nao-atende", label: "E5.2 · 🔴 Contato especial<br/>(atendido pelo Mauro)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página).", dados: "— (saída, fora do caminho até a constituição)" },
  // 🆕 28/07 (reunião Rua Satélite 9): 3ª via do veredito 🔴, antes inexistente.
  { id: "E5_3", rota: "/veredito/descartado", label: "E5.3 · 🔴 Fora de escopo<br/>(descarta)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "E5_4", rota: "/saida/exterior", label: "E5.4 · Saída · exterior<br/>LC 123 art.17", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🟡 28/07: Pedro cogitou 'de fato descartar' essa saída dedicada (juntar no genérico) — dito na MESMA frase tentativa do E5.5, NÃO travado. Tela já tem conteúdo jurídico revisado (LC123 art.17) — não apagar sem confirmação final. UX-42 Lucro Presumido (Mauro); debate de tom", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "E5_5", rota: "/saida/socios", label: "E5.5 · Saída · 5+ sócios<br/>limite do produto", forma: "tela", classe: "saida", status: "construida", validado: "pendente", falta: "🆕 24/08: limite subiu de 2 pra 4 sócios (reunião Leonan 19/08) — esta saída só dispara em 5+ agora, não mais 3+", dados: "— (saída, fora do caminho até a constituição)" },
  { id: "E5_6", rota: "/saida/socio-pj", label: "E5.6 · Saída · sócio PJ<br/>tira do Simples", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "🆕 24/08 (pedido do Pedro, em cima da reunião Leonan) — NOVO. Sócio pessoa jurídica tira a empresa do Simples no ato do contrato social (regra fiscal, não limite nosso — diferente de E5.5). Bloqueia na triagem, antes do dinheiro", dados: "— (saída, fora do caminho até a constituição)" },

  // ── ENTRADA (E) · DINHEIRO · E6–E9 ───────────────────────────────────────
  { id: "E6", rota: "/conta", label: "E6 · Criar conta", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔄 27/08 — a tela ENCOLHEU: nome/e-mail/telefone vieram do E3.3 e o endereço do E3.4, então ela deixou de coletar identidade e virou o que sobrou de verdade (senha + CPF), com recap read-only do que já temos. Mesmo conserto do CPF pedido 2× (29/07): dado já digitado se CONFIRMA, não se repergunta. Provider de validação CPF/situação real (Pedro). 🔴 RF-01: sem estado real entre telas, o recap usa o mock `CLIENTE`", dados: "Senha · CPF · código de verificação (mock) · CONFIRMA nome/e-mail/telefone já captados no E3.3 (não recoleta)" },
  { id: "E7", rota: "/plano", label: "E7 · A conta da abertura", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro). ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2): a antiga 'pendência real de spec' ('conta total não é total', endereço fiscal só aparecia no C4 pós-pagamento) foi corrigida — a mensalidade mostrada aqui já soma o endereço fiscal quando escolhido lá no E5F, com 1 linha de explicação", dados: "" },
  { id: "E8", rota: "/contrato", label: "E8 · Aceite contrato<br/>reversível, CDC 49", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do contrato (Mauro/Larissa); rachadura T18", dados: "Aceite do contrato de serviço (checkbox)" },
  // 🆕 26/08 (mesmo achado do E3.2: "2 páginas aprovadas, só 1 no mapa") —
  // E9 também tem variante Migrar aprovada (`telas-flow.ts`): `?fluxo=migrar`
  // muda o total (sem taxa de governo) e o aviso ("sua migração começa
  // hoje" / aciona contador anterior). "Não valia uma tela nova" (mesmo
  // componente), mas o CONTEÚDO é diferente — mesma régua do E3.2, vira nó.
  { id: "E9", rota: "/pagamento", label: "E9 · Pagamento<br/>(variante Abrir)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro)", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto)" },
  { id: "E9_M", rota: "/pagamento?fluxo=migrar", label: "E9 · Pagamento<br/>(variante Migrar)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Mesmo componente, `?fluxo=migrar`: total não soma taxa de governo, aviso fala de migração (não abertura). CPF/métodos/idempotência idênticos ao componente base", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto)" },
  { id: "E9_1", rota: "/aguardando", label: "E9.1 · Aguardando boleto<br/>dossiê já liberado", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "Dunning revisado", dados: "" },

  // ── CONSTITUIÇÃO (C) · dossiê · C0–C7 ────────────────────────────────────
  // 🆕 27/08 — a C0 é o antigo E5A+E5V (descrever atividade → veredito de
  // CNAE), que ATRAVESSOU o pagamento na reordenação do flow de entrada.
  //
  // ⚠️ Por que pôde atravessar: o gate de elegibilidade mudou de lugar, não
  // sumiu. Era o veredito (que podia responder 🔴 "não atendemos"); agora é a
  // CATEGORIA escolhida no E3.4, que só oferece atividade atendida. Quem chega
  // aqui já passou pelo filtro, então o veredito só refina DENTRO de um
  // universo atendido e não pode mais dizer não. Sem isso, mover a tela criaria
  // o pior caso do produto: cliente que pagou e descobre depois que a gente não
  // atende — exatamente o que a Contabilizei faz e a nossa tese rejeita.
  //
  // 🔴 CONSEQUÊNCIA: as 3 saídas do veredito (E5.1 waitlist · E5.2 Mauro ·
  // E5.3 descarta) NÃO são mais alcançáveis do veredito no caminho abrir. A
  // única porta de "não atendo" antes do dinheiro é o "minha atividade não
  // está na lista" do E3.4 → E5.1. E5.2/E5.3 seguem vivas pelo Migrar.
  { id: "C0", rota: "/dossie/atividade", label: "C0 · Sua atividade<br/>(descreve + pills)", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "🔄 27/08 — era o E5A (`/gate`), antes do pagamento. Copy reenquadrada (`jaCliente`): não promete mais 'validar minha atividade' (a validação já aconteceu no E3.4), agora é 'achar meu CNAE'. Recebe a categoria pré-selecionada via `?cat=`. Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev", dados: "Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine) · categoria já vem pré-selecionada do E3.4" },
  { id: "C0_2", rota: "/dossie/atividade?etapa=veredito", label: "C0.2 · CNAE encontrado", forma: "decisao", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "🔄 27/08 — era o E5V. 🔴 A MUDANÇA ESTRUTURAL: aqui o veredito NÃO pode mais dar 🔴/🟡 no caminho abrir (a categoria do E3.4 já garantiu que a atividade é atendida). O split de 3 vias que estava pendente desde 28/07 deixa de ser necessário AQUI e passa a ser problema do E3.4 (lista de categorias) — o `mapear()` mock ainda tem os 4 desfechos porque o Migrar usa os mesmos", dados: "" },
  { id: "DESAMB", rota: "/dossie/atividade", label: "Desambiguação<br/>mini-loop", forma: "tela", classe: "inline", status: "construida", validado: "ux", grupo: "GATE", falta: "Mini-loop conceitual (reformula a pergunta) — sem etapa própria, mesma tela da C0", naTabela: false, dados: "" },
  { id: "C0_3", rota: "/veredito/atende", label: "🟢 CNAE confirmado", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "🔄 27/08 — era o E5VA. Depende da lista CNAE", dados: "" },


  { id: "C1", rota: "/dossie/socio", label: "C1 · Seus dados", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado). 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui (reunião Leonan, mesmo dia) foi REMOVIDO do MVP (custo/velocidade de leitura de imagem). 🆕 26/08 (achado do cruzamento com pesquisa JUCEMG/DBE, ver `gap-analise-dados-abertura-vs-pesquisa-gemini.md`): data de nascimento e nome da mãe ganharam campo — eram exigência de DBE ausente do dossiê", dados: "CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (digitação manual) · data de nascimento · nome da mãe · estado civil (+ regime de bens se casado) · confirma se mora fora do Brasil" },
  { id: "C2", rota: "/dossie/vinculo", label: "C2 · Vínculo INSS", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "INSS 11% direto + teto folga = consolidado fiscal fechado", dados: "Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)" },
  // 🆕 26/08 (achado do Pedro, olhando o /mapa: "C3 parece duplicada com
  // C3.1") — CONFIRMADO no código: `SociosView` é 1 componente só, 1 rota só
  // (`/dossie/socios`), com 1 único `onSeguir` que sempre vai pro C4 direto
  // (`app/(app)/dossie/socios/page.tsx`). Quando TEM_SOCIO, a mesma tela JÁ
  // mostra o formulário de preencher os sócios extras — não existe uma "C3.1"
  // separada no código, era um nó fantasma no flow (antigo `C3_1`, removido).
  { id: "C3", rota: "/dossie/socios", label: "C3 · Sócios?", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Re-pergunta o E5T (carry-forward pendente); limite subiu de 2 pra 4 (24/08). 🔒 24/08 (pedido do Pedro): não pergunta MAIS nada — quantidade e tipo (CPF) já vêm travados da triagem (E5T). Quando TEM_SOCIO, a MESMA tela já mostra o formulário de completar os sócios extras (sem passo/rota separada)", dados: "Confirma se terá mais sócios (sem reperguntar quantidade/tipo) · se houver, nome completo + % de participação de cada sócio extra (quantidade fixa, CPF implícito)" },
  { id: "C4", rota: "/dossie/empresa", label: "C4 · Dados da empresa", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: IPTU obrigatório travado. 🆕 24/08 (reunião Leonan): alerta de IPTU pode subir quando é residência de sócio; trava duplicidade (só 1 sócio por endereço); chips de capital social simbólico (R$1k/5k/10k). 🔄 26/08 (reunião Rua Satélite 36, item 2): a escolha 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM daqui — moraram no E5F desde 24/08 até virarem o gate oficial de decisão, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio", dados: "CEP (autofill) + número + complemento · índice cadastral IPTU (obrigatório, só se próprio) · tipo de endereço · residência de sócio (trava duplicidade) · capital social" },
  { id: "C5", rota: "/dossie/cnae-secundarios", label: "C5 · CNAE secundários", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🆕 24/08 (reunião Leonan): ganhou busca livre (restrita ao que a gente atende, pedido original da Jéssica 19/07) além das 4 sugestões curadas mesmo-imposto; até 15 no total; secundária que muda enquadramento mostra aviso e troca CTA por 'Falar com atendente' em vez de bloquear silenciosamente", dados: "CNAEs secundários (seleção múltipla + busca, opcional, até 15)" },
  { id: "C6", rota: "/dossie/natureza", label: "C6 · Natureza jurídica", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "SLU × LTDA confirmado pelo Leonan (24/08): SLU pra individual (proteção patrimonial — bens não se misturam), LTDA pra sociedade, sem outra opção nos dois casos", dados: "Escolha da natureza jurídica (SLU ou LTDA — sugerida, editável)" },
  { id: "C7", rota: "/dossie/nome", label: "C7 · Nome / razão social", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Viabilidade JUCEMG (RPA, não API); 3 opções por prioridade (28/07). 🔒 24/08 (reunião Leonan, CONFLITO RESOLVIDO): objeto social virou TRAVADO/read-only — erro de grafia do cliente gerava reclamação real no escritório antigo dele. 🆕 24/08 (pedido do Pedro): cada sugestão ganhou lápis de edição inline (reescreve a sugestão da IA no lugar); campo separado 'Digite a sua' foi removido; seta de reordenar 1/2/3 mantida", dados: "3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA) · objeto social (gerado automaticamente, travado) · nome fantasia (opcional)" },

  // ── ESPERA — decimal de entrada em Constituição ──────────────────────────
  { id: "C0_1", rota: "/retomar", label: "C0.1 · Retomar de onde parou", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "UX-23 fechado — mora em /pro-labore pós-constituição", dados: "" },

  // ── APROVAÇÃO (A) · cauda · A1–A5 (construído 21/07) ─────────────────────
  { id: "A1", rota: "/revisar", label: "A1 · Revisar dossiê", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "Recap read-only; carry-forward dos passos = estado do wizard (dev)", dados: "— (leitura + confirmação; enquadramento e pró-labore são SUGERIDOS pelo sistema, 28/07 — não digitados)" },
  { id: "A2", rota: "/termo", label: "A2 · Termo irreversível", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Redação jurídica do termo + 4 camadas de cancelamento (Mauro/Larissa); racha T18", dados: "Aceite do termo irreversível (checkbox)" },
  { id: "A3", rota: "/painel", label: "A3 · Painel<br/>4 status", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🆕 30/07: reduzido de 9→3 status (2 passadas). 'Registrar a empresa'→'Analisando viabilidade'; novo 'Documentação completa preenchida' (check, acima) + 'Agora é só assinar' (cinza, depende do deferimento da Junta). 🔄 26/08 (reunião Rua Satélite 36, item 6): voltou a ter 4. O pagamento da DAE, que era timing de BACKEND desde 28/07 (cliente paga no E9 junto da mensalidade, a gente segura e repassa depois), virou etapa VISÍVEL e acionável aqui: 'Pague a guia da Junta (DAE)', com CTA coral inline, só depois que a viabilidade sai — 'Agora é só assinar' passa a depender dessa etapa, não só do deferimento. NÃO absorvemos a taxa (alinhado ao líder, contrato Contabilizei 4.3\"h\"). Timeline real depende do pipeline do dev; prazo ~8d é placeholder. Componente: `components/painel.tsx` (`acaoCliente`, `onPagarDae`)", dados: "" },
  { id: "A3_1", rota: "/painel/recusa", label: "A3.1 · Órgão recusa<br/>'precisa de você'", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: retry automático construído — tenta as 3 opções do C7 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. Testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos", dados: "Retry automático pelas 3 opções priorizadas (C7) antes de pedir novas sugestões ao cliente" },
  // 🆕 26/08 (reunião Rua Satélite 36, item 7) — nó NOVO, decimal de A3 (é
  // sequencial, não condicional — mesmo espírito de E9_2A/B/C na migração).
  // Reintroduz o certificado digital, mas ANTES da assinatura agora — motivo
  // estrutural: a procuração (que sai junto da assinatura, A4) EXIGE o
  // certificado já validado. A versão antiga (`/certificado`, N24) vinha
  // DEPOIS e foi removida como órfã em 30/07; esta é nova, não a mesma tela
  // ressuscitada. Reusa o padrão visual de `/mais/certificado` (Portal, que
  // segue existindo pra RENOVAR/trocar depois).
  { id: "A3_2", rota: "/certificado", label: "A3.2 · Certificado digital<br/>(antes de assinar)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Componente `CertificadoGateView` (`components/wizard-cauda.tsx`). Pergunta 'já tem?' → upload arquivo+senha (sim) ou agenda entrevista com certificadora parceira (não). Mock: ambos caminhos avançam direto (sem espera assíncrona real)", dados: "Sim/não tem certificado próprio · se sim: arquivo (.pfx/.p12) + senha" },
  { id: "A4", rota: "/assinatura", label: "A4 · Assinatura dos sócios", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "GOV.BR/e-CAC deep-link (dev). 🆕 24/08 (reunião Leonan): código 2FA único concentra procuração+assinatura (`CodigoGovView` — janela 10min, 3 tentativas, escala pra atendente se estourar); convite de sócio ganhou seletor de canal (WhatsApp/e-mail). 🆕 26/08 (item 7): certificado já vem validado da A3.2 — a procuração que sai junto desta assinatura agora tem o que precisa", dados: "Assinatura via GOV.BR/e-CAC · código de validação de 6 dígitos (janela 10min) · canal do convite ao sócio (WhatsApp/e-mail)" },
  { id: "A4G", rota: "/assinatura", label: "GOV.BR nível<br/>bronze→upgrade", forma: "decisao", classe: "inline", status: "construida", validado: "pendente", falta: "Dobrado inline no A4 — sem query própria (nenhum toggle de demo separa o sub-estado), a prévia mostra a mesma tela do A4", naTabela: false, dados: "" },
  { id: "REMOVIDO_N24", label: "'Empresa ativa'<br/>🗑️ REMOVIDO 30/07", forma: "terminal", classe: "todo", status: "planejada", validado: "oficial", falta: "Era órfão desde o swap A4→A5 (nenhuma rota navegava mais até aqui) — arquivo `/ativa` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa", dados: "" },
  { id: "A5", rota: "/home-dia1", label: "✅ A5 · Home dia-1<br/>(ativação)", forma: "terminal", classe: "feliz", status: "construida", validado: "oficial", falta: "🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). 🆕 24/08 (reunião Leonan): trilha agora mostra 3 status explícitos — Procuração (feito, instantâneo com o código) → Validação do certificado digital (agora, linka pra /mais/certificado upload+oferta) → Acesso completo. 🔄 26/08 (item 7): certificado deixou de ser 'agora' e virou 'feito' — já foi validado antes da assinatura (A3.2). Quem vira 'agora' é 'Conferir os dados da empresa' (`/mais/empresa`). `/mais/certificado` segue existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs", dados: "" },
];

export const EDGES = [
  { de: "E1", para: "E2_1" },
  { de: "E2_1", para: "E2_2" },
  { de: "E2_2", para: "E2_3" },
  { de: "E2_3", para: "E3" },
  { de: "E3", para: "E3_1", label: "já sou cliente", deHandle: "login" },
  // 🔄 27/08 — os 2 caminhos passam pela MESMA tela de captura de lead (E3.3);
  // o que muda é só a copy (`contexto`). O login segue pulando: quem já é
  // cliente já deu esses dados.
  { de: "E3", para: "E3_3", label: "quero abrir", deHandle: "abrir" },
  { de: "E3", para: "E3_3", label: "já tenho empresa", deHandle: "migrar" },
  { de: "E3_3", para: "E3_2", label: "abrir" },
  { de: "E3_3", para: "E3_2_M", label: "migrar" },
  // Abrir: os DOIS regimes passam pelo E3.4 — o gate de BH só vale pro ME,
  // mas o gate de CATEGORIA vale pros dois (é ele que autoriza o CNAE a ir
  // pra depois do pagamento, então ninguém pode pular).
  { de: "E3_2", para: "E3_4", label: "ME, abrir" },
  { de: "E3_2", para: "E3_4", label: "MEI, abrir (sem gate de BH)", tracejado: true },
  // Migrar não abre endereço novo (a empresa já existe) → pula o E3.4 inteiro.
  { de: "E3_2_M", para: "E4_2", label: "ME, migrar" },
  { de: "E3_2_M", para: "E4_2", label: "MEI, migrar", tracejado: true },
  { de: "E3_4", para: "E5T", label: "endereço BH + categoria ok", deHandle: "segue" },
  { de: "E3_4", para: "E4_1", label: "sem endereço em BH", deHandle: "fora" },
  { de: "E3_4", para: "E5_1", label: "atividade fora da lista", deHandle: "fora" },

  { de: "E4_2", para: "E4_3", tracejado: true },
  { de: "E4_2", para: "E4_2_1", label: "CNPJ inapto/suspenso", tracejado: true },
  { de: "E4_2", para: "E5_1", label: "🟡 regulada" },
  { de: "E4_2", para: "E5_2", label: "🔴 Mauro atende" },
  { de: "E4_3", para: "E4_4", tracejado: true },
  { de: "E4_4", para: "E4_5" },
  { de: "E4_5", para: "E9_M" },
  { de: "E9_M", para: "E9_2", tracejado: true },
  { de: "E9_2", para: "E9_2A" },
  { de: "E9_2A", para: "E9_2B" },
  { de: "E9_2B", para: "E9_2C" },
  { de: "E9_2C", para: "E9_3" },
  { de: "E9_3", para: "E9_4", tracejado: true },
  { de: "E9_4", para: "A5", tracejado: true },

  // 🔄 27/08 — o bloco de CNAE saiu daqui (virou C0, pós-pagamento). A esteira
  // pré-dinheiro agora começa direto na triagem.
  { de: "E5T", para: "E5F", label: "até 4 + CPF + Brasil" },
  { de: "E5T", para: "E5_4", label: "sócio no exterior" },
  { de: "E5T", para: "E5_5", label: "5+ sócios" },
  { de: "E5T", para: "E5_6", label: "sócio via CNPJ" },

  { de: "E5F", para: "E6" },
  { de: "E6", para: "E7" },
  { de: "E7", para: "E8" },
  { de: "E8", para: "E9" },
  // 🔄 27/08 — a 1ª tela do dossiê virou a C0 (atividade + CNAE), não mais o C1.
  { de: "E9", para: "C0", label: "cartão" },
  { de: "E9", para: "E9_1", label: "boleto" },
  { de: "E9_1", para: "C0" },

  { de: "C0", para: "C0_2" },
  { de: "C0_2", para: "DESAMB", label: "ambíguo" },
  { de: "DESAMB", para: "C0" },
  { de: "C0_2", para: "C0_3", label: "🟢 confirmado" },
  { de: "C0_3", para: "C1" },

  { de: "C1", para: "C2" },
  { de: "C2", para: "C3" },
  { de: "C3", para: "C4" },
  { de: "C4", para: "C5" },
  { de: "C5", para: "C6" },
  { de: "C6", para: "C7" },
  { de: "C7", para: "A1" },

  { de: "A1", para: "A2", tracejado: true },
  { de: "A2", para: "A3", tracejado: true },
  { de: "A3", para: "A3_1", tracejado: true },
  { de: "A3_1", para: "A3", tracejado: true },
  { de: "A3", para: "A3_2", tracejado: true, label: "DAE paga" },
  { de: "A3_2", para: "A4", tracejado: true },
  { de: "A4", para: "A4G", tracejado: true },
  { de: "A4G", para: "A5", tracejado: true },

  { de: "C0_1", para: "C0", label: "volta ao passo pausado", tracejado: true },
];
