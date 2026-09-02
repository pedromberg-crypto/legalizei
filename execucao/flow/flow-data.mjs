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
/**
 * 🔄 31/08 — cruzamento contra a gravação real da JUCEMG (Rua Satélite 38-40,
 * 141 prints reais, [[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]]).
 * 2 entradas que já existiam estavam DESATUALIZADAS/ERRADAS (Tipo de unidade,
 * Metragem — corrigidas com valor real visto no print) e 16 campos novos
 * entraram, todos verificados contra print + transcrição, não inferidos.
 */
/**
 * 🆕 01/09 (pedido do Pedro) — CAMPOS QUE VÊM DE INTEGRAÇÃO EXTERNA.
 *
 * Terceira categoria, ao lado de "o usuário digita" e "a Legalizai preenche":
 * dado que chega de uma API de terceiro. Pro dev a diferença é de trabalho,
 * não de rótulo — API tem latência, tem erro, tem indisponibilidade e precisa
 * de fallback; campo interno é constante nossa e nunca falha.
 *
 * Alimenta a tela `/conferencia` junto com `PREENCHIDOS_INTERNAMENTE`, pelo
 * mesmo mecanismo (`contexto` diz em qual tela o campo aparece).
 */
export const PREENCHIDOS_API = [
  {
    campo: "CPF com MEI ativo (impedimento de DBE)",
    valor: "consulta antes de gerar o DBE",
    contexto: "E9 · Pagamento",
    status: "🔴 não implementado — achado novo de 01/09",
    porque:
      "Na simulação da Rua Satélite 42 a transmissão do DBE foi REJEITADA porque o CPF do titular já tinha MEI ativo. Hoje o cliente descobriria isso depois de pagar, no meio do processo. É o mesmo endpoint da checagem de regularidade que o E9 já promete: dá pra pegar antes do dinheiro.",
  },

  {
    campo: "Logradouro, bairro, município e UF (da empresa)",
    valor: "derivados do CEP digitado",
    contexto: "E3.4 · Endereço + categoria",
    status: "🟡 mock hoje (`buscarCep`), API real pendente",
    porque:
      "A pessoa digita só CEP e número; o resto do endereço vem da consulta. Precisa de fallback: CEP inexistente, API fora do ar e endereço sem logradouro (zona rural) são casos reais, e nenhum deles pode travar o gate de BH.",
  },
  {
    campo: "Logradouro, bairro, município e UF (endereço pessoal do titular)",
    valor: "derivados do CEP digitado",
    contexto: "C1 · Seus dados",
    status: "🟡 mock hoje (`buscarCep`), API real pendente",
    porque: "Mesma consulta do endereço da empresa, outro campo — é a ficha do Representante no DBE.",
  },
  {
    campo: "Logradouro, bairro, município e UF (endereço do sócio extra)",
    valor: "derivados do CEP digitado",
    contexto: "C3 · Sócios",
    status: "🟡 mock hoje (`buscarCep`), API real pendente",
    porque: "Idem, por sócio. Entra na qualificação do contrato (art. 997 CC) e na ficha do sócio no DBE.",
  },
  {
    campo: "Situação do CPF na Receita Federal",
    valor: "consulta no ato do pagamento",
    contexto: "E9 · Pagamento",
    status: "🔴 não implementado — hoje a tela só promete a checagem",
    porque:
      "A copy do E9 já diz 'a gente confere na Receita se ele está regular pra abrir empresa'. Enquanto a consulta não existir, isso é promessa sem lastro: CPF irregular só apareceria como recusa da Junta, semanas depois.",
  },
  {
    campo: "CNAE principal sugerido pela descrição da atividade",
    valor: "IA cruza o texto livre + a categoria escolhida no E3.4",
    contexto: "C0 · Sua atividade",
    status: "🟡 mock hoje (`mapear()`), motor real pendente",
    porque:
      "É o único campo do flow em que a máquina PROPÕE e a pessoa confirma. O veredito não pode responder 'não atendemos' (a categoria já filtrou isso antes do pagamento), então o fallback de erro é pedir mais descrição, nunca fechar a porta.",
  },
  {
    campo: "Situação do protocolo na JUCEMG / Receita (viabilidade, DBE, registro)",
    valor: "polling do protocolo",
    contexto: "A3 · Status",
    status: "🔴 não implementado — a timeline hoje é mock",
    porque:
      "Todo o status pós-dossiê depende disso: é o que move as etapas, dispara a recusa de nome (A3.1) e libera a assinatura. Sem polling, a tela é um enfeite bonito que nunca muda de estado.",
  },
];

export const PREENCHIDOS_INTERNAMENTE = [
  {
    campo: "Qualificação de cada sócio no DBE (49 × 22)",
    codigo: "49 - Sócio-Administrador · 22 - Sócio",
    valor: "derivada da resposta do C3 (quem administra)",
    contexto: "C3 · Sócios",
    status: "🟢 travado 01/09 (Rua Satélite 42, simulação de DBE ao vivo)",
    porque:
      "É a ÚNICA coisa que a pergunta nova do C3 muda no processo: sócio marcado como administrador vai ao DBE com 49 e sai na cláusula de administração do contrato; sócio não marcado vai com 22 e só aparece no quadro societário. O titular é sempre 49 — quem inicia o cadastro é o representante perante a Receita, e o sistema puxa a qualificação dele sozinho.",
  },
  {
    campo: "Forma de assinatura (isolada × conjunta)",
    valor: "NÃO enviada — o contrato padrão não tem esse campo",
    contexto: "Pós-C7 · Geração do contrato (RPA/Integrador)",
    status: "🟢 travado 01/09, com o contrato real na tela",
    porque:
      "🔴 Regra dura: inserir cláusula de assinatura tira o processo do contrato PADRÃO e manda pra análise humana (mesma família do achado da procuração, 31/08). O contrato padrão gerado não fala em forma de assinatura, e a cláusula 8ª do modelo dá a cada administrador representação ativa e passiva pra praticar todos os atos do objeto social; a assinatura de todos só é exigida em atos extraordinários (onerar/alienar imóvel da sociedade, obrigações em favor de cotistas ou terceiros). 🟡 Leitura conferida por IA sobre o contrato real da simulação; falta ratificação da contadora e teste em banco.",
  },
  {
    campo: "Representante perante a Receita Federal (DBE)",
    valor: "sempre quem iniciou o cadastro no app",
    contexto: "C1 · Seus dados",
    status: "🟢 travado 01/09",
    porque:
      "Não é escolha e não é pergunta: quem preenche é o representante, e o DBE puxa a qualificação a partir disso. Se quem vai administrar é outra pessoa, é ela que precisa abrir a conta e conduzir a abertura — permitir 'indicar outro' criaria um caso em que o dono da conta não é o dono do processo.",
  },
  {
    campo: "Telas de conferência do DBE (dados vindos da viabilidade)",
    valor: "puladas pelo RPA — nome empresarial, natureza, nome fantasia, CNAEs, objeto social, endereço da PJ, porte ME e dados do contador vêm importados",
    contexto: "Pós-C7 · DBE (RPA)",
    status: "🟢 observado na simulação 01/09",
    porque: "Tudo isso já foi decidido na viabilidade e chega preenchido: reconferir campo a campo só gastaria tempo de robô.",
  },

  {
    campo: "Tipo de evento (Viabilidade JUCEMG)",
    codigo: "101",
    valor: "Inscrição de primeiro estabelecimento (Matriz)",
    contexto: "Pós-C7 · Viabilidade (RPA/JUCEMG)",
    status: "🟢 travado, visto na gravação (print 2)",
    porque:
      "Toda constituição nossa é matriz nascendo: não existe caso de filial nem de alteração no escopo do MVP. É a 1ª escolha da tela de Nova Viabilidade, e errar aqui manda o processo pra outro rito inteiro.",
  },
  {
    campo: "Código do ato (Integrador · Novo FCN)",
    codigo: "090",
    valor: "Constituição",
    contexto: "Pós-C7 · Integrador (RPA)",
    status: "🟢 travado, visto na gravação (RS39)",
    porque: "Par do evento 101 do outro lado do processo: no Integrador o que identifica o rito é o código do ato, não o nome.",
  },
  {
    campo: "Evento de enquadramento (JUCEMG)",
    codigo: "315",
    valor: "Enquadramento de Microempresa",
    contexto: "Pós-C7 · Integrador (RPA)",
    status: "🟢 travado, visto na gravação (RS39)",
    porque:
      "É o evento que faz a empresa nascer JÁ enquadrada como ME, no mesmo processo. Sem ele a empresa nasce sem enquadramento e o cliente precisaria de um 2º ato (e de uma 2ª taxa) — e é este evento que faz a guia da Junta custar R$281,08, porque a conferência cobra 2 atos.",
  },

  {
    campo: "IP do dispositivo de quem paga (`remoteIp`)",
    valor: "capturado na requisição do pagamento",
    contexto: "E9 · Pagamento",
    status: "🔴 não implementado — depende da integração Asaas",
    porque:
      "Obrigatório na criação de cobrança por cartão no Asaas, e a doc é explícita: é o IP do DISPOSITIVO do pagador, não o do nosso servidor. Mandar o IP do servidor passa no schema e derruba a análise antifraude, que é o pior tipo de bug (silencioso e só visível na taxa de recusa).",
  },
  {
    campo: "Tipo de cobrança enviado ao Asaas (`billingType`)",
    valor: "CREDIT_CARD · PIX · BOLETO (o que a pessoa escolheu)",
    contexto: "E9 · Pagamento",
    status: "🔴 não implementado — depende da integração Asaas",
    porque:
      "Débito NÃO entra: o enum de criação de cobrança do Asaas aceita BOLETO, CREDIT_CARD, PIX e UNDEFINED (DEBIT_CARD só aparece em resposta). Pra débito a doc manda redirecionar pro `invoiceUrl`, o que significaria tirar a pessoa do nosso app no meio do pagamento.",
  },

  {
    campo: "Forma de atuação (JUCEMG)",
    valor: '"Atividade Desenvolvida Fora do Estabelecimento"',
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado, corrigido 01/09",
    porque: "🔴 Estava documentado como \"Internet\" — ERRADO, valor decidido em 26/08 por raciocínio, antes de existir gravação. Os prints mostram \"Atividade Desenvolvida Fora do Estabelecimento\" marcada 2x, em 2 sistemas (tela 14 Viabilidade, tela 48 DBE), e a tela 48 exibe as 8 opções do campo com \"Internet\" entre elas, NÃO marcada: são opções distintas da mesma lista, não sinônimos. 3ª correção desta mesma família (as outras 2: \"Sede\"→Produtiva e metragem). Segue valendo enquanto o escopo for serviço 100% remoto",
  },
  {
    campo: "Tipo de unidade (JUCEMG)",
    valor: '"Produtiva"',
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado, corrigido 31/08",
    porque: "🔴 Estava documentado como \"Sede\" — ERRADO. Prints reais (Viabilidade e Integrador) confirmam \"Produtiva\": Sede/Filial nem aparece como opção fixa relevante pra uma constituição nova. Toda abertura nova (matriz) usa Produtiva",
  },
  {
    campo: "Metragem (m² do imóvel + m² da operação)",
    valor: "20 m² (fixo)",
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado, resolvido 31/08",
    porque: "🔴 Estava \"não implementado, sem decisão\" — RESOLVIDO. Print real da Viabilidade mostra Área Total e Área Utilizada sempre preenchidas com 20,00 — mesmo valor usado em toda a gravação, virou padrão",
  },
  {
    campo: "Profissão (titular E qualquer sócio)",
    valor: '"Empresário"',
    contexto: "C1 · Seus dados / C3 · Sócios",
    status: "🟢 travado, validado 31/08 pelo Pedro",
    porque: "Campo obrigatório no Integrador (Dados do Sócio/Administrador) pra qualquer sócio — nunca varia por atividade, então não gera dúvida útil pro cliente. Preenchido igual pra titular e sócio extra",
  },
  {
    campo: "Qualificação do representante (JUCEMG/DBE)",
    codigo: "49",
    valor: '"49 - Sócio-Administrador"',
    contexto: "C1 · Seus dados",
    status: "🟢 travado",
    porque: "Sempre o mesmo código no DBE (Identificação do Representante) — não existe outra qualificação possível pra quem está constituindo a própria empresa",
  },
  {
    campo: "Capital social",
    valor: "R$ 10.000,00 (fixo)",
    contexto: "C4 · Dados da empresa",
    status: "🔒 travado, validado 31/08 pelo Pedro",
    porque: "🔴 ATÉ 31/08 era campo editável (chips R$1k/5k/10k + valor livre) — a reunião Rua Satélite 38-40 decidiu travar em R$10.000 pra prestador de serviço. Deixou de ser pergunta: o app mostra o valor, não pede mais",
  },
  {
    campo: "Valor nominal de cotas",
    valor: "R$ 1,00",
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado",
    porque: "Campo do Integrador (Dados da Matriz) sempre preenchido como R$1,00 — o capital social é dividido em quotas de R$1, nunca outro valor nominal",
  },
  {
    campo: "Data de assinatura da declaração / início das atividades",
    valor: "dia do preenchimento (nunca retroativa)",
    contexto: "C7 · Nome / razão social (dispara a viabilidade)",
    status: "🟢 travado",
    porque: "Integrador não aceita data retroativa — sempre o dia em que o RPA roda o processo, pros dois campos (mesma data)",
  },
  {
    campo: "Acesso ao endereço",
    valor: '"Pedestre"',
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado",
    porque: "Campo da Prefeitura de BH (Dados Adicionais), sempre Pedestre pro nosso perfil de prestador de serviço remoto — nunca veículo leve/pesado",
  },
  {
    campo: '"Atividade exercida no local?" (principal e secundárias)',
    valor: "Não (sempre)",
    contexto: "C0 · Sua atividade / C5 · CNAE secundários",
    status: "🟢 travado",
    porque: "Marcar Não em TODAS as atividades é o que habilita a opção \"Escritório/sede administrativa\" — se qualquer uma virasse Sim, a Prefeitura entenderia como comércio/loja física, errado pro nosso perfil",
  },
  {
    campo: '"Atividade é inócua ou virtual?"',
    valor: "Sim (sempre)",
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado",
    porque: "Pergunta do Licenciamento (Corpo de Bombeiros): atividade sem circulação de pessoas no local, sempre verdade pro nosso perfil 100% remoto/administrativo",
  },
  {
    campo: '"Edificação nova?" (regulação urbana, Prefeitura de BH)',
    valor: "Não (sempre)",
    contexto: "C4 · Dados da empresa",
    status: "🟡 travado 01/09, é SUPOSIÇÃO — fila-Izabela",
    porque: "3ª pergunta do Questionário de Regulação Urbana (tela 16), na MESMA tela que já produziu o indeferimento real. As outras 2 (apartamento, sócio reside) a gente já capta; esta não existia em nenhuma fonte. Fica interna e não vira pergunta porque \"edificação nova\" tem sentido técnico na Prefeitura (imóvel recém-construído, questão de habite-se) que o cliente não sabe responder — perguntar convida erro confiante, que é pior modo de falhar que errar sempre igual num caso raro. Risco residual: cliente em prédio novo sem habite-se cai em exigência. Validado por Pedro 01/09; confirmar com a especialista",
  },
  {
    campo: "Telefone enviado aos órgãos — SEM o 9º dígito (8 dígitos)",
    valor: "o telefone captado com 9 dígitos é enviado ao DBE/Integrador sem o 9 inicial do celular",
    contexto: "RPA · envio ao DBE/Integrador (a captação no E6 não muda)",
    status: "🟢 travado 01/09 (Pedro) — regra de RPA, não de tela",
    porque: "Regra dita pela Izabela na gravação (ata, item 13) e confirmada nos prints (tela 51: telefone 94054307, 8 dígitos). Decisão do Pedro: **a captação continua com o 9 normal** — pedir telefone sem o 9 pro cliente seria estranho e daria erro de digitação. Quem tira o dígito é o robô, na hora de preencher o formulário oficial. Fica aqui porque é transformação de dado nossa, invisível pro cliente, e o dev precisa dela escrita",
  },
  {
    campo: "Valor da participação de cada sócio (R$) e quantidade de quotas",
    valor: "% informado × R$10.000 (o valor em R$ é também o nº de quotas, porque a quota é R$1)",
    contexto: "C3 · Sócios (derivado, não perguntado)",
    status: "🟢 travado, documentado 01/09",
    porque: "O app pergunta PERCENTUAL; os órgãos pedem VALOR EM REAIS (DBE tela 65: R$10.000,00 pro sócio único; QSA tela 70) e o Integrador pede o valor nominal da quota, R$1,00 (tela 95). A conversão existia na prática e não estava escrita. Como o passo do campo é 0,5%, o menor incremento dá 50 quotas exatas: nenhum percentual selecionável gera fração de quota, então não há arredondamento a tratar. ⚠️ Isso quebra se o capital deixar de ser R$10.000 ou o passo mudar",
  },
  {
    campo: "Regime de bens — tradução do rótulo pro valor da JUCEMG",
    valor: '"Separação total de bens" (nosso rótulo) → "Separação Convencional de Bens" (valor da Junta)',
    contexto: "C1 · Seus dados / C3 · Sócios",
    status: "🟡 travado 01/09, com lacuna conhecida e aceita",
    porque: "O dropdown real do Integrador (tela 103) tem 5 regimes; o app oferece 4, por decisão do Pedro em 01/09 (\"esse quinto, casamento acima de 70 anos, não faz sentido pra gente\"). Falta a Separação Obrigatória, que é imposta por lei e não escolhida. Consequência aceita: quem estiver nesse regime marca \"Separação total\" e o contrato sai com a qualificação errada — caso raro, sem tela, resolvido no atendimento se aparecer",
  },
  {
    campo: "Sociedade de Propósito Específico?",
    valor: "Não (sempre)",
    contexto: "C6 · Natureza jurídica",
    status: "🟢 travado",
    porque: "Cláusula do Contrato Núcleo — nenhuma empresa do nosso escopo (ME prestador de serviço comum) é SPE. Campo do contrato, não pergunta ao cliente",
  },
  {
    campo: "Capital Totalmente Integralizado em Moeda Corrente?",
    valor: "Sim (sempre)",
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado",
    porque: "Cláusula do Contrato Núcleo — o capital social (R$10.000, também travado) já entra integralizado, sem parcelamento",
  },
  {
    campo: "Tipo de contrato (Integrador)",
    valor: "Padrão · 15 cláusulas obrigatórias (sem anexo, sem cláusula extra)",
    contexto: "Pós-C7 · Geração do contrato (RPA/Integrador)",
    status: "🟢 travado",
    porque: "🔴 ACHADO-CHAVE (31/08): incluir anexo/procuração/cláusula extra no processo DERRUBA a elegibilidade ao Registro Automático (aviso visto ao vivo no print da JUCEMG) — por isso a opção de 15 cláusulas sem anexo é a única que usamos, nunca a de 7 cláusulas nem o contrato personalizado (upload)",
  },
  {
    campo: "Testemunhas (Contrato Núcleo)",
    valor: "Nenhuma (sempre)",
    contexto: "Pós-C7 · Geração do contrato (RPA/Integrador)",
    status: "🟢 travado",
    porque: "Contrato padrão de 15 cláusulas não exige testemunha — campo sempre vazio, nunca preenchido",
  },
  {
    campo: "E-mail e telefone de contato (DBE/Integrador)",
    valor: "sempre o nosso (Legalizai), nunca o do cliente",
    contexto: "DBE/Integrador · Dados para Contato",
    status: "🟢 travado",
    porque: "Evita que boletim de ocorrência (BO) ou notificação oficial da Receita/Junta chegue direto pro cliente por e-mail — a gente centraliza e repassa o que for relevante",
  },
  {
    campo: "Endereço de correspondência",
    valor: "sempre igual ao do estabelecimento",
    contexto: "DBE/Integrador · Dados para Contato",
    status: "🟢 travado",
    porque: "Checkbox \"igual ao do Estabelecimento\" sempre marcado — nenhum caso do nosso escopo precisa de endereço de correspondência diferente",
  },
  {
    campo: "Natureza jurídica (SLU × LTDA)",
    // 🆕 01/09 — o MESMO código muda de formatação por sistema: 2062 na
    // Viabilidade e no Integrador, 206-2 no DBE. Escrever os dois é o que
    // impede o RPA de mandar o formato errado pro sistema errado.
    codigo: "2062 (Viabilidade/Integrador) · 206-2 (DBE)",
    valor: "SLU se sem sócio · LTDA se com sócio (automático, sem pergunta)",
    contexto: "C6 · Natureza jurídica (REMOVIDA 31/08)",
    status: "🟢 travado, validado 31/08 pelo Pedro",
    porque: "🔴 ATÉ 31/08 era pergunta ao cliente (recomendação editável, Leonan 24/08) — a reunião Rua Satélite 38-40 decidiu tirar a pergunta de vez: a regra (sem sócio→SLU, com sócio→LTDA) não tem exceção real no nosso escopo, então virou decisão de backend nos dois casos. Tela e rota `/dossie/natureza` removidas do app",
  },
  {
    campo: "Tipo de endereço (JUCEMG) — endereço fiscal Legalizai",
    valor: '"Endereço virtual" (fixo)',
    contexto: "C4 · Dados da empresa",
    status: "🟢 travado, validado 31/08 pelo Pedro",
    porque: "Confirmado na gravação real (RS38): quando a empresa usa o endereço fiscal da Legalizai (não o do cliente), o valor sempre enviado à JUCEMG é \"Endereço virtual\" — nunca aparece como opção pro usuário, só se aplica ao caminho endereço-próprio (\"proprio\"/\"coworking\")",
  },
  {
    campo: "Requerente (emissão do DAE)",
    valor: "sempre o titular (sócio-administrador)",
    contexto: "Pós-C7 · Emissão do DAE (RPA)",
    status: "🟢 travado",
    porque: "Quem solicita a taxa no Integrador é sempre a pessoa que está constituindo a empresa — não existe cenário de \"outro requerente\" no nosso fluxo",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * NODES — a coleção ÚNICA de telas. Mapa e apresentação são duas VISTAS dela.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 02/09 (decisão do Pedro) — o mapa é espelho da apresentação: mesma
 * coleção de telas, uma vista conectada e em ordem de flow, a outra navegável.
 * Nada existe num sem existir no outro. Antes o carrossel da apresentação era
 * uma lista escrita à mão (54 pills) e o mapa era gerado daqui (77 nós): duas
 * listas mantidas por mãos diferentes divergiram em 12 telas, invisíveis na
 * demo. Agora as pills DERIVAM deste arquivo — o espelho é consequência, não
 * tarefa de quem edita.
 *
 * Campos:
 * · `id`       — código do nó. Chave de tudo (arestas, `MOMENTO_POR_NO` na
 *                apresentação). NÃO reaproveitar id de nó removido.
 * · `caminho`  — 🆕 02/09. Qual jornada a tela pertence, e por isso qual
 *                filtro do carrossel a mostra: `abrir` (ME, o tronco) ·
 *                `migrar` (troca de contador) · `mei` · `dev` (referência
 *                interna, fora de qualquer jornada de cliente).
 *                ⚠️ É declarado, não derivado: MEI e ME COMPARTILHAM o tronco
 *                (E5F → E6 → E7 → E9), então alcançabilidade no grafo não
 *                separa os dois — só as arestas sabem, e elas se cruzam.
 * · `rota`     — URL real no app. Pode repetir entre nós (E5T e M_T são a
 *                mesma rota com regime diferente), por isso o vínculo com a
 *                demo é por `id`, nunca por rota.
 * · `label`    — nome da tela. Fonte única: vira título no mapa, título do
 *                painel e pill (em versão curta).
 * · `forma`/`classe` — desenho do nó no mermaid.
 * · `status`/`validado`/`falta`/`dados` — estado e conteúdo, alimentam a doc
 *                do dev e a `/conferencia`.
 * ═════════════════════════════════════════════════════════════════════════ */
export const NODES = [
  // ── ENTRADA (E) · E1–E3 ──────────────────────────────────────────────────
  { id: "E1", caminho: "abrir", rota: "/splash", label: "E1 · Splash", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  // 🆕 26/08 (pedido do Pedro: "não podemos ter telas camufladas") — E2 era 1
  // nó só escondendo 3 slides de carrossel (`components/welcome.tsx`, `SLIDES`).
  // Virou 3 nós, 1 por slide, via `/welcome?slide=N` (mesmo padrão de deep-link
  // de `/entrada`/`/gate?etapa=`) — cada um agora tem prévia ao vivo própria.
  { id: "E2_1", caminho: "abrir", rota: "/welcome?slide=0", label: "E2.1 · Welcome<br/>(1/3 · Léo vigia, contador é gente)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E2_2", caminho: "abrir", rota: "/welcome?slide=1", label: "E2.2 · Welcome<br/>(2/3 · Aquece o fork)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  { id: "E2_3", caminho: "abrir", rota: "/welcome?slide=2", label: "E2.3 · Welcome<br/>(3/3 · Sem susto no boleto)", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "", dados: "" },
  // 🆕 26/08 (pedido do Pedro: "linka o CTA no caminho dele, não a tela
  // inteira") — 3 pontos de saída nomeados, 1 por CTA real da tela
  // (`components/entrada.tsx` passo 1): botão coral "Quero abrir minha
  // empresa", card branco "Já tenho empresa", link "Entrar na minha conta".
  // 🆕 30/08 (pedido do Pedro) — 4ª rota: "Voltar de onde parei", card cheio
  // mesmo peso de "Já tenho empresa" (ver `entrada.tsx`). Fecha o C0_1
  // (`/retomar`), que até aqui era nó ÓRFÃO no mapa (ninguém apontava pra ele).
  { id: "E3", caminho: "abrir", rota: "/entrada", label: "E3 · Fork<br/>4 rotas", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "4 rotas: abrir · migrar · já sou cliente · voltar de onde parei (🆕 30/08, fecha o C0_1 órfão).", dados: "", handles: [
    { id: "abrir", yPercent: 74 },
    { id: "migrar", yPercent: 82 },
    { id: "retomar", yPercent: 90 },
    { id: "login", yPercent: 96 },
  ] },
  { id: "E3_1", caminho: "abrir", rota: "/login", label: "E3.1 · Login / portal", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Rota feliz", dados: "" },

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
  { id: "E3_3", caminho: "abrir", rota: "/dados", label: "E3.3 · Seus dados<br/>(nome · e-mail · telefone)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🆕 27/08 — captura de lead, logo depois do fork. NÃO cria conta (isso continua no E6): só identifica quem está do outro lado, porque antes disso o funil inteiro era anônimo até o E6. Cruzamento com o funil da Contabilizei (que pede os mesmos 3 campos na 1ª tela) motivou a mudança. 🟡 LGPD: carrega consentimento mínimo em 1 linha com link, sem checkbox — o aceite contratual segue no E8. 🔴 RF-01: os dados não viajam por querystring (dado pessoal em URL é vazamento), então o E6 hoje exibe o mock `CLIENTE`; quando existir estado real, vem de lá", dados: "Nome completo · e-mail · telefone · consentimento de privacidade (implícito, ao continuar)" },
  { id: "E3_2", caminho: "abrir", rota: "/entrada?intencao=abrir", label: "E3.2 · MEI × ME<br/>(variante Abrir)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "🔄 27/08: agora vem DEPOIS do E3.3 (dados) e ANTES do E3.4 (endereço + categoria). MEI não tem o limite geográfico do MLP, mas PASSA pelo E3.4 mesmo assim — o gate de BH não vale pra ele, o de CATEGORIA vale (é ele que autoriza o CNAE a ir pra pós-pagamento, então ninguém pula). 🔴 27/08: card ME · Lucro Presumido REMOVIDO (decisão do Pedro; captação de LP no abrir fica parqueada). 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática", dados: "Regime autodeclarado (MEI ou ME)" },
  { id: "E3_2_M", caminho: "migrar", rota: "/entrada?intencao=migrar", label: "E3.2 · MEI × ME<br/>(variante Migrar)", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Mesma tela (`MeiOuMeView`), `contexto=\"migrar\"`: copy vira autodeclaração (\"sua empresa hoje é MEI ou ME?\"), não critério de escolha. MEI pula E4 inteiro, vai direto pro M1 (`/migrar/cnpj?cenario=mei`)", dados: "Regime autodeclarado (MEI ou ME)" },

  // 🆕 27/08 · CAPTURA DE LEAD (reordenação do flow de entrada, ADR 27/08).
  // Duas telas NOVAS entre o fork e a triagem. Fonte:
  // `components/entrada-lead.tsx` + rotas `/dados` e `/endereco`.
  //
  // ⚠️ NUMERAÇÃO NÃO É CRONOLÓGICA neste bloco, e é de propósito: E3.1 já era
  // a saída de login e E3.2 já era o MEI×ME, ambos com referência histórica
  // pesada em docs/memórias. Renumerar quebraria mais do que resolve. A ordem
  // REAL do flow é: E3 → E3.3 → E3.2 → E3.4. O mapa desenha por aresta, então
  // o desenho fica certo; só o número é fora de ordem.
  { id: "E3_4", caminho: "abrir", rota: "/endereco", label: "E3.4 · Endereço + categoria<br/>(os 2 gates)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "🆕 27/08 — reúne os DOIS gates do produto antes do dinheiro. (1) ENDEREÇO: substitui o E4 (gate de cidade, REMOVIDO), que perguntava 'é em BH?' e acreditava no clique — aqui o CEP valida de verdade (`ehCepBh`, faixa 30000-000 a 31999-999, 🟡 não ratificada em fonte primária). Herdou também a escolha 'próprio × fiscal' que morava no E5F. (2) CATEGORIA: assume o papel de gate de elegibilidade que era do veredito de CNAE — como a lista só oferece o que a gente atende, escolher já É passar pelo filtro, e é isso que autorizou o CNAE a ir pra depois do pagamento. MEI passa por aqui também (sem exigir BH): o gate geográfico não vale pra ele, mas o de categoria vale. 🔒 29/08 (decisão do Pedro) — os 2 gates deixaram de EXPULSAR: fora de BH e atividade fora da lista resolvem AGORA na própria tela (endereço fiscal ou fila da cidade/atividade, com CTA 'Me inscrever e garantir condição'). O handle 'fora' e as saídas E4.1/E5.1 dedicadas ao caminho abrir foram removidas — `/saida/fora-bh` foi deletada (zero uso restante); `/veredito/waitlist` (E5.1) segue viva só pelo Migrar. 🆕 30/08 — ver E3.4.1 pro detalhe do estado 'CEP fora de BH'. Ganhou atalho na `/apresentacao` ('📍 Simular CEP fora de BH', antes só descobria digitando um CEP específico à mão).", dados: "Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) OU cidade pra fila de espera · categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou", handles: [
    { id: "segue", yPercent: 85 },
  ] },
  // 🆕 30/08 (pedido do Pedro: "o programador não vê isso se não preencher") —
  // estado JÁ CONSTRUÍDO (`EnderecoCategoriaView`, testado no e2e), mas
  // invisível no mapa até agora: quem digita um CEP fora de BH vê o gate
  // virar 2 saídas resolvidas NA PRÓPRIA tela (nenhuma navega pra fora):
  //   (a) troca pro endereço fiscal Legalizai (segue o fluxo normal, soma no E7)
  //   (b) mantém a cidade própria → CTA principal vira "Me inscrever e
  //       garantir condição" (fila de espera, MAS segue no app normalmente)
  { id: "E3_4_1", caminho: "abrir", rota: "/endereco?simular=fora-bh", label: "E3.4.1 · CEP fora de BH<br/>(gate resolvido inline)", forma: "decisao", classe: "branch", status: "construida", validado: "ux", falta: "🆕 31/08 — ganhou `rota` só pra prévia ao vivo do `/mapa` (`?simular=fora-bh` pré-preenche o estado, ver `endereco/page.tsx` + prop `simularFilaCidade`). NÃO é navegação real — é o MESMO estado do E3.4 (`/endereco`), resolvido inline. As 2 saídas (endereço fiscal · fila de espera) continuam no fluxo normal, nenhuma é dead-end.", dados: "Confirma: usa endereço fiscal Legalizai OU entra na fila da própria cidade" },

  // ── MIGRAR DE CONTADOR — ramo decimal de E4 (construído 30/07) ────────────
  // Fonte: components/wizard-migrar.tsx. Sem entrevista de CNAE (o cartão CNPJ
  // já traz) — diferença estrutural vs. o caminho "abrir". Rotas confirmadas
  // 30/07 rastreando router.push/onSeguir no código real, não inferidas.
  { id: "E4_2", caminho: "migrar", rota: "/migrar/cnpj", label: "E4.2 · Lê o cartão CNPJ", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Autofill por CNPJ via InfoSimples (cadastro, R$0,20/consulta — API PAGA, não pública); sem entrevista de atividade — o CNAE já existe. 🔴 05/08: checagem de regime removida daqui (a API não confirma Simples×Presumido×MEI, ver infosimples-funcionalidades.md) — regime já vem autodeclarado da E3.2. Só confirma situação cadastral (ativa/inapta)", dados: "CNPJ (consulta) · confirmação dos dados do cartão" },
  { id: "E4_2_1", caminho: "migrar", rota: "/saida/cnpj-inapto", label: "Saída · CNPJ inapto<br/>ou suspenso", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "Situação cadastral ≠ ativa: aqui a Receita nem reconhece a empresa como ativa, regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (E9.2, empresa ATIVA com dívida) — essa tela foi retirada do flow", dados: "— (saída, fora do caminho até a migração)" },
  // 🔴 05/08 — E4_2B_1 (saída Presumido) agora é alcançada direto da E3.2
  // (CTA menor abaixo dos cards MEI/ME): a tela intermediária E4.2b
  // (`/migrar/tributario`, Simples×Presumido autodeclarado) foi DESCARTADA
  // por duplicar a pergunta que a E3.2 já faz. Ver decisoes-marca.md 05/08.
  { id: "E4_2B_1", caminho: "migrar", rota: "/saida/regime-nao-suportado", label: "Saída · Presumido<br/>fora de escopo", forma: "terminal", classe: "saida", status: "construida", validado: "oficial", falta: "Lucro Presumido segue fora do escopo (decisão explícita 04/08, sem pesquisa fiscal dedicada ainda). Autodeclarado na E3.2, não confirmado por API", dados: "— (saída, fora do caminho até a migração)" },
  { id: "E4_3", caminho: "migrar", rota: "/migrar/diagnostico", label: "E4.3 · Diagnóstico<br/>(\"tem certificado?\")", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🔴 04/08 (3ª rodada): o diagnóstico de Fator R pra ME foi CORTADO — a única API pré-pagamento é a cadastral, não traz faturamento/folha (só via procuração, pós-pagamento). 🔴 05/08: pergunta virou 'tem certificado?' (MEI: decide se roda TTRT). 🔴 06/08 (achado do Pedro): ME TAMBÉM passa aqui agora (antes ia do E4.2 direto pro E4.4) — certificado é independente da TTRT pra ME (as duas rodam em paralelo), mas não tinha pergunta nenhuma no caminho ME. 🟡 fila-Mauro: se sem-certificado-ME carrega custo/fidelidade extra é decisão de preço não tomada", dados: "Resposta sim/não (tem certificado digital)" },
  { id: "E4_4", caminho: "migrar", rota: "/migrar/plano", label: "E4.4 · Plano", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "ME: mesma mensalidade do caminho abrir, sem taxa de governo (empresa já existe). 🆕 04/08: MEI tem plano PRÓPRIO — R$49,90/mês, fidelidade 12 meses, certificado incluso, escopo limitado (emitir NF + 1 colaborador) — não é o plano ME com desconto", dados: "" },
  { id: "E4_5", caminho: "migrar", rota: "/migrar/contrato", label: "E4.5 · Contrato<br/>+ promessa de devolução", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔴 DECISÃO TRAVADA 30/07: cobra ANTES do TTRT, com contrapartida OBRIGATÓRIA no contrato ('se a transferência não sair por motivo fora do seu controle, devolve tudo'). Se essa linha sair do contrato, a decisão reabre (Mauro/Larissa redigem)", dados: "Aceite do contrato (com a cláusula de devolução)" },
  // 🆕 06/08 (reunião Rua Satélite 19, Léo) — número reaproveitado: a E9.2
  // antiga (auditoria de passivo) foi retirada nesse mesmo dia; este é um nó
  // NOVO, sem relação com o antigo. Só ME passa por aqui — MEI não tem TTRT
  // (segue direto de E9 pra E9.4), simplificação já usada nos outros nós
  // decimais desta esteira (o fork por regime não vira aresta própria).
  { id: "E9_2", caminho: "migrar", rota: "/migrar/contador", label: "E9.2 · Seu contador atual", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔒 24/08 (reunião Leonan 19/08, CONFLITO RESOLVIDO): CRC agora é OBRIGATÓRIO, trava o Continuar — 'eu preciso do número do CRC de qualquer forma' (Leonan). Antes o doc dizia 'opcional', estava errado/desatualizado. Nome/e-mail/telefone continuam opcionais — só o CRC não tem contorno", dados: "Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer, opcionais) · CRC (OBRIGATÓRIO)" },
  // 🆕 24/08 (reunião Leonan 19/08) — TRÊS nós NOVOS, entre E9.2 e E9.3.
  // Achado tardio (Pedro re-lendo a reunião): "durante essa migração, eu
  // preciso que, além dos dados que consegui puxar via API do cartão CNPJ,
  // ele preencha TODOS os dados base de uma constituição [...] ele terminou
  // de preencher a sociedade [...] a gente vem para a parte de estamos
  // encerrando lá, transferindo a responsabilidade." — ou seja, DEPOIS do
  // contador atual e ANTES da transferência, não antes do pagamento (1ª
  // tentativa desta rodada colocou errado, entre CNPJ e diagnóstico — corrigido).
  { id: "E9_2A", caminho: "migrar", rota: "/migrar/dados", label: "E9.2b · Dados que o<br/>cartão CNPJ não traz", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Reusa os mesmos campos do C1 (abertura) — CPF/RG/órgão/estado civil, digitação manual. 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui foi REMOVIDO do MVP (custo/velocidade)", dados: "CPF · RG + órgão emissor · estado civil" },
  { id: "E9_2B", caminho: "migrar", rota: "/migrar/socios", label: "E9.2c · Dados dos sócios", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "MESMA tela do C3 (`SociosView`), reusada com `contexto=\"migrar\"` — só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar (diferente do E5T no abrir), então a tela se sustenta sozinha", dados: "Nome completo + % de participação de cada sócio extra (CPF implícito, quantidade fixa)" },
  { id: "E9_2C", caminho: "migrar", rota: "/migrar/gov", label: "E9.2d · GOV.BR + procuração", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao` — não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente", dados: "Código de validação de 6 dígitos (janela 10min)" },
  { id: "E9_3", caminho: "migrar", rota: "/migrar/transferencia", label: "E9.3 · Iniciando transferência", forma: "tela", classe: "espera", status: "construida", validado: "oficial", falta: "🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG). 🆕 24/08 (reunião Leonan): copy do status trocou pra 'Iniciando o processo de transferência' + 'Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga' — diferente do status de constituição ('empresa foi constituída'), antes os dois diziam a mesma coisa. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária (🟡 pendência)", dados: "" },
  { id: "E9_4", caminho: "migrar", rota: "/migrar/ativa", label: "✅ E9.4 · Migração concluída", forma: "terminal", classe: "feliz", status: "construida", validado: "ux", falta: "Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs)", dados: "" },

  // ── E5 · TRIAGEM + FAIXA (o que sobrou do gate antes do dinheiro) ────────
  // 🔄 27/08 — o bloco de CNAE (descrever → veredito → desambiguação) saiu
  // daqui e virou a **C0** (`/dossie/atividade`), DEPOIS do pagamento. Ver os
  //
  // 🔒 29/08 (decisão de negócio do Pedro) — os 3 critérios que bloqueavam
  // aqui (5+ sócios · sócio via CNPJ · sócio no exterior) DEIXARAM DE SER
  // PERGUNTA/GATE. Quem chega na Triagem já escolheu Simples Nacional lá
  // atrás (E3.2), então CPF-only e domicílio no Brasil não são escolha, são
  // consequência — viraram um card informativo ("Vale saber", 3 checks) com
  // 1 link de escape ("Meu sócio não atende um dos critérios") pra quem
  // sabe que foge da regra. O seletor de quantidade também mudou: teto vira
  // 4 ("Eu + 3"), a opção 5+ foi REMOVIDA do produto, não só escondida.
  // Efeito: as 3 saídas dedicadas (E5.4/E5.5/E5.6) e suas rotas foram
  // apagadas — zero uso restante, e o gate de exterior deixa de ser
  // fail-fast ativo (risco aceito conscientemente, documentado em
  // `components/gate-telas.tsx`).
  { id: "E5T", caminho: "abrir", rota: "/gate?etapa=triagem", label: "Triagem<br/>quantos sócios?", forma: "decisao", classe: "", status: "construida", validado: "oficial", grupo: "GATE", falta: "🔒 29/08 — só 1 pergunta de verdade agora (quantidade, até 4). CPF-only/domicílio Brasil/assinatura GOV.BR viraram card informativo com link de escape ('Falar com o time', resolve inline, sem navegar pra fora). 🆕 26/08: coorte ('é a 1ª empresa que você abre?') pousou aqui de vez — 3ª realocação (Veredito → Faixa → aqui), dado puro de log/marketing, opcional. 🆕 30/08 — ver E5T.1 pro detalhe do gate de saída 'sócio não se encaixa', invisível no mapa até agora.", dados: "Quantidade de sócios (1 / 2 / 3 / 4) · quem administra a empresa (só o titular × titular + sócios) quando há sócio · é a 1ª empresa que abre? (opcional) · sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time')" },
  // 🆕 30/08 (pedido do Pedro) — mesma lógica do E3.4.1: gate de saída JÁ
  // CONSTRUÍDO (link "Meu sócio não atende um dos critérios" → resolve
  // inline, mostra "Combinado, nosso time vai entrar em contato" — mesmo
  // padrão da MeiOuMeView), mas invisível no mapa. NÃO navega pra fora, é
  // fim de linha desta tentativa (a pessoa fica esperando contato humano).
  { id: "E5T_1", caminho: "abrir", rota: "/gate?etapa=triagem&simular=socio-nao-encaixa", label: "E5T.1 · Sócio não se encaixa<br/>(gate de saída inline)", forma: "terminal", classe: "inline", status: "construida", validado: "ux", falta: "🆕 31/08 — ganhou `rota` só pra prévia ao vivo do `/mapa` (`?simular=socio-nao-encaixa` pré-abre o escape hatch, ver `gate/page.tsx` + prop `simularSocioNaoAtende`). NÃO é navegação real — é o MESMO estado da E5T (`/gate?etapa=triagem`), resolvido inline pelo link 'Meu sócio não atende um dos critérios'. Resolve com 'Falar com o time', sem navegar. Dead-end de propósito: quem cai aqui não segue sozinho no produto.", dados: "Texto livre (opcional) descrevendo o critério que não encaixa" },
  { id: "E5F", caminho: "abrir", rota: "/gate?etapa=faixa", label: "Faixa de faturamento", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "🔒 01/09 — o campo 'valor exato por mês' deixou de ser livre: para em R$30.000 (teto do ME, LC 123 art. 3º II). Trava por clamp, não por rejeição — quem digita 50000 vê 30.000 e o aviso explicando que acima disso a empresa vira EPP; campo que ignora a tecla em silêncio parece travado. 🔄 01/09, 2ª rodada (pedido do Pedro) — o cartão 'Até R$ 5 mil' virou 'Não sei ainda'. Quem abre a 1ª empresa muitas vezes não tem estimativa, e forçar um número faz chutar — chute que vira base do pró-labore sugerido. A grade agora é: Não sei ainda · 5-10k · 10-20k · 20-30k. A opção desconhecida cobre 0-30k de propósito (o gate do MEI lê INCERTEZA, não segurança), é pulada no cálculo por valor exato, e vale 0 no FAIXA_MEDIA — o pró-labore cai no piso legal em vez de sair de um chute. 🔄 01/09 (pedido do Pedro) — GRADE REDESENHADA pro teto do ME: era `até 10k · 10-20k · 20-30k · +30k`, virou `até 5k · 5-10k · 10-20k · 20-30k`. A faixa +30k oferecia justamente o que não atendemos (acima de R$360k/ano é EPP) e a decisão de 01/09 foi NÃO barrar por faturamento — então a pergunta não podia ter uma resposta sem caminho. Quem fatura mais usa Sei o valor exato, que aceita qualquer número. O gate de teto do MEI passou a se calcular pelo `min`/`max` de cada faixa: o teto de R$6.750 cai dentro de 5-10k (avisa, não bloqueia) e faixas acima bloqueiam com saída pro ME. Faixas sem âncora fiscal. 🔴 27/08: a escolha de endereço (próprio × fiscal Legalizai) SAIU daqui — morou nesta tela entre 26/08 e 27/08 e foi pro E3.4, junto do gate de cidade, que é a pergunta de que ela sempre foi parte (faturamento não decide onde a empresa fica). O valor continua somando no E7 pelo mesmo `?endereco=fiscal`. Fonte: `components/gate-telas.tsx` (`FaixaView`)", dados: "Faixa de faturamento mensal (4 faixas até R$30 mil, o teto do ME) ou valor exato, se souber" },
  // 🆕 30/08 (pedido do Pedro) — NOVA, ainda não construída. Splash
  // transitório (poucos segundos, SEM CTA, auto-avança pro E6) confirmando
  // que a faixa informada é atendida, antes de pedir conta. Copy sugerida
  // (rascunho, ajustar com o Pedro): título "Conseguimos te atender." ·
  // subtítulo "Falta só criar sua conta pra ver o plano."
  { id: "E5F_S", caminho: "abrir", rota: "/splash-atendido", label: "E5F.1 · Splash<br/>'conseguimos te atender'", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "🟢 30/08 — CONSTRUÍDA (`SplashMensagemView`, `components/splash-mensagem.tsx`). Arte provisória, Pedro revisa. `page.tsx` lê `?next=` e auto-navega (`router.replace`) depois do timeout.", dados: "" },

  // ── SAÍDAS/EXITS do veredito — decimal de E5 ──────────────────────────────
  // 🔒 29/08 — E4.1 (fora de BH) e E5.4/E5.5/E5.6 (exterior/5+ sócios/sócio
  // PJ) foram REMOVIDOS deste arquivo: resolvem inline na E3.4/Triagem agora,
  // zero edge restante apontando pra eles. Rotas deletadas do app.
  { id: "E5_1", caminho: "abrir", rota: "/veredito/waitlist", label: "E5.1 · 🟡 Waitlist", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar). 🔒 29/08: no caminho ABRIR a E3.4 resolve inline agora (não navega mais pra cá) — esta tela segue viva só pelo Migrar (E4.2 → 🟡 regulada)", dados: "Nome + contato · CNAE pretendido (✅ campo construído 28/07)" },
  { id: "E5_2", caminho: "abrir", rota: "/veredito/nao-atende", label: "E5.2 · 🔴 Contato especial<br/>(atendido pelo Mauro)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página).", dados: "— (saída, fora do caminho até a constituição)" },
  // 🆕 28/07 (reunião Rua Satélite 9): 3ª via do veredito 🔴, antes inexistente.
  { id: "E5_3", caminho: "abrir", rota: "/veredito/descartado", label: "E5.3 · 🔴 Fora de escopo<br/>(descarta)", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs", dados: "— (saída, fora do caminho até a constituição)" },

  // ── ENTRADA (E) · DINHEIRO · E6–E9 ───────────────────────────────────────
  { id: "E6", caminho: "abrir", rota: "/conta", label: "E6 · Criar conta", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔄 01/09 (pedido do Pedro) — **login social (Google/Apple) REMOVIDO**: não teremos por enquanto, e botão que promete caminho inexistente é a pior fricção. O código de verificação passou de **6 para 8 dígitos** (`DIGITOS_CODIGO` — o número aparece em 4 lugares e precisa bater nos 4). 🔄 28/08 (pedido do Pedro) — reverteu o encolhimento de 27/08: a tela volta a coletar o form INTEIRO aqui mesmo (nome/CPF/telefone/e-mail/senha/CEP/número/complemento), sem recap read-only, `leadJaCaptado` removido do código. Form começa em branco. Provider de validação CPF/situação real (Pedro). 🔴 RF-01: sem estado real entre telas, hoje é só estado local do componente. 🐛 29/08 — vazamento de layout no campo Complemento corrigido (`min-w-0` faltava no flex), placeholder simplificado pra só \"Complemento\".", dados: "Nome · CPF · telefone · e-mail · senha · código de verificação de 8 dígitos (mock)" },
  { id: "E7", caminho: "abrir", rota: "/plano", label: "E7 · A conta da abertura", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Preço ~R$195 FAKE (Mauro+custo); 🟢 01/09 DAE RESOLVIDO — R$281,08, valor da guia real emitida no processo (prints 125 e 127), substitui os R$268,51 da tabela de 19/07 (a conferência cobra 2 atos: Contrato + Enquadramento ME, e a diferença de R$12,57 bate com o 2º); certificado A1 (Mauro). ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2): a antiga 'pendência real de spec' ('conta total não é total', endereço fiscal só aparecia no C4 pós-pagamento) foi corrigida — a mensalidade mostrada aqui já soma o endereço fiscal quando escolhido lá no E5F, com 1 linha de explicação. 🆕 28/08 — REDESIGN 'premium' (pedido do Pedro, validado em preview isolado `/plano-premium` antes de aplicar): título bicolor, card-herói com profundidade real (raio+sombra), lista de inclusos como cartões-linha, CTA como barra flutuante escura. Nenhum conteúdo/ramo cortado (MEI×ME, colaboradores, citação legal, endereço fiscal seguem intactos) — só a casca mudou. `PlanoOferta` em `wizard-dinheiro.tsx`. 🆕 30/08 — ver E7.1 pra variante 'escolheu endereço fiscal'. Fechado o gap real na `/apresentacao`: a escolha do E3.4 nunca atravessava até o E7 na demo, mesmo o componente já suportando a prop.", dados: "" },
  // 🆕 30/08 (pedido do Pedro) — variante JÁ CONSTRUÍDA (card "O que você
  // adicionou", ícone 3D + valor explícito) pra quem escolheu endereço fiscal
  // Legalizai lá no E3.4, mas invisível no mapa: só se vê acessando
  // `/plano?endereco=fiscal` direto, ninguém navegava até ela sem saber que
  // existia. Mesmo componente do E7 (`PlanoOferta`), prop `enderecoFiscal`.
  { id: "E7_1", caminho: "abrir", rota: "/plano?endereco=fiscal", label: "E7.1 · A conta da abertura<br/>(variante endereço fiscal)", forma: "tela", classe: "branch", status: "construida", validado: "pendente", falta: "Mesmo componente do E7, só a prop `enderecoFiscal` muda. Card 'O que você adicionou' com o ícone de GPS e o valor (+R$60/mês) explícito, construído 30/08.", dados: "" },
  // 🔴 30/08 (pedido do Pedro) — E8 (Aceite contrato, `/contrato`) foi
  // ELIMINADO do fluxo: igual à Contabilizei, o aceite acontece no ATO DO
  // PAGAMENTO, não numa tela própria antes dele. O checkbox de aceite +
  // "Ler o contrato completo" desceram pro E9, que vira "Pagamento + contrato".
  //
  // 🆕 26/08 (mesmo achado do E3.2: "2 páginas aprovadas, só 1 no mapa") —
  // E9 também tem variante Migrar aprovada (`telas-flow.ts`): `?fluxo=migrar`
  // muda o total (sem taxa de governo) e o aviso ("sua migração começa
  // hoje" / aciona contador anterior). "Não valia uma tela nova" (mesmo
  // componente), mas o CONTEÚDO é diferente — mesma régua do E3.2, vira nó.
  { id: "E9", caminho: "abrir", rota: "/pagamento", label: "E9 · Pagamento + contrato<br/>(variante Abrir)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro); redação jurídica do contrato (Mauro/Larissa). 🟢 30/08 (pedido do Pedro) — REVOGADO E IMPLEMENTADO: cartão/Pix não pulam mais direto pra C0 (código real em `/pagamento/page.tsx`, função `destino()`). Todo mundo (cartão, Pix, boleto) passa por uma tela de status antes — ver E9.S/E9.1P/E9.1. Reforça 'dá pra sair e voltar, está tudo certo'. MEI segue com o comportamento antigo (fora do escopo desta rodada).", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) · aceite do contrato de serviço (checkbox) · cartão: número + nome impresso + validade + CVV · titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis) · endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis)" },
  { id: "E9_M", caminho: "migrar", rota: "/pagamento?fluxo=migrar", label: "E9 · Pagamento<br/>(variante Migrar)", forma: "decisao", classe: "", status: "construida", validado: "pendente", falta: "Mesmo componente, `?fluxo=migrar`: total não soma taxa de governo, aviso fala de migração (não abertura). CPF/métodos/idempotência idênticos ao componente base", dados: "CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto)" },
  // 🆕 30/08 (pedido do Pedro) — NOVA, ainda não construída. Splash
  // transitório (poucos segundos, SEM CTA, auto-avança) só pra quem pagou por
  // método instantâneo (cartão/Pix) — antes ia direto pro C0, agora passa
  // por aqui e cai no E9.1P (status "pago"). Copy rascunho: "Pagamento
  // confirmado." / "Sua abertura já começou."
  { id: "E9_S", caminho: "abrir", rota: "/splash-pagamento", label: "E9.S · Splash<br/>'pagamento confirmado'", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "🟢 30/08 — CONSTRUÍDA (`SplashMensagemView`, mesmo componente do E5F.1). Fica no shell APP (`(app)/splash-pagamento`), não WIZARD — o pagamento já caiu. Arte provisória, Pedro revisa.", dados: "" },
  // 🆕 31/08 (pedido do Pedro) — par simétrico do E9.S pro caminho BOLETO.
  // Antes o boleto caía direto no E9.1 (sem splash), enquanto cartão/Pix
  // ganhavam a confirmação — assimetria sem motivo. Copy é outra de propósito:
  // "Boleto gerado" (nada foi pago ainda), não "Pagamento confirmado".
  { id: "E9_SB", caminho: "abrir", rota: "/splash-boleto", label: "E9.SB · Splash<br/>'boleto gerado'", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "🟢 31/08 — CONSTRUÍDA (`SplashMensagemView`, mesmo componente do E9.S/E5F.1). Transitória, sem CTA, auto-avança pro E9.1 (sem `?pago=1` — o boleto ainda não compensou). Arte provisória, Pedro revisa.", dados: "" },
  // 🆕 01/09 (pedido do Pedro) — o par que faltava na família de splashes: ela
  // só sabia dizer que deu certo. Mesmo layout, pele ESCURA com gradiente
  // coral (a do hero do status) — recusa com a mesma cara do sucesso faz a
  // pessoa ler o layout antes da palavra e comemorar errado.
  { id: "E9_SR", caminho: "abrir", rota: "/splash-recusado?next=/pagamento%3Fretry%3D1", label: "E9.SR · Splash<br/>pagamento recusado", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa `SplashMensagemView` com `variante=\"recusado\"` (fundo escuro + gradiente coral, ícone x). Transitório e sem CTA: a decisão (outro cartão, trocar pra Pix) é da tela seguinte. Alcançável por `/pagamento?simular=recusa`.", dados: "" },
  { id: "E9_R", caminho: "abrir", rota: "/pagamento?retry=1", label: "E9.R · Pagamento<br/>(nova tentativa)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "MESMA tela do E9 com aviso no topo explicando a recusa e oferecendo outro cartão ou Pix. Não zera o que foi preenchido: quem teve o cartão recusado já está frustrado, refazer o formulário puniria duas vezes.", dados: "Método de pagamento (nova tentativa) · CPF já confirmado" },
  { id: "E9_1", caminho: "abrir", rota: "/aguardando", label: "E9.1 · Aguardando boleto<br/>dossiê já liberado", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "Dunning revisado", dados: "" },
  // 🆕 30/08 (pedido do Pedro) — variante "pago" do E9.1, pra quem chega pelo
  // E9.S (pagou instantâneo). MESMO componente (`AguardandoView`), MESMO CTA
  // "Continuar preenchendo", só troca o estado do topo: check de pago em vez
  // do pill "aguardando compensar". Prop nova a construir no componente.
  { id: "E9_1P", caminho: "abrir", rota: "/aguardando?pago=1", label: "E9.1P · Status<br/>(pago, via instantâneo)", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "🟢 30/08 — CONSTRUÍDA. `AguardandoView` ganhou prop `pago` (`wizard-cauda.tsx`): mesma lista de passos, CTA 'Continuar preenchendo' idêntico, só o topo muda (check verde, não pill de espera). `page.tsx` lê `?pago=1`.", dados: "" },

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
  // 🆕 02/09 (pedido do Pedro) — a C0 RACHOU EM DUAS. Desde que o veredito
  // passou a morar dentro dela, a tela tem dois momentos bem diferentes: a
  // CHEGADA, sem nada pra mostrar porque a pessoa ainda não contou o que faz,
  // e a tela com os 3 códigos + o slot da atividade principal. Eram estados do
  // mesmo componente e por isso invisíveis no mapa; agora cada um é um nó, que
  // é como o Pedro revisa (uma pill por tela).
  { id: "C0_0", caminho: "abrir", rota: "/dossie/atividade?vazia=1", label: "C0.0 · Sua atividade<br/>(chegada, antes de descrever)", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "🆕 02/09 — estado 'pelado' da C0: categoria (vinda do E3.4) e campo de descrição, sem os cartões de CNAE nem o slot da atividade principal, porque ainda não há o que mostrar. Mesmo componente da C0 (`PerguntaView`, prop `semResultados`) — o que é comum continua comum. 🔒 02/09 (decisão do Pedro) — DESCREVER NÃO É OBRIGATÓRIO: o CTA ('Buscar atividade principal') libera só com a categoria, que já veio do E3.4. Quem apertar sem escrever recebe as **3 atividades mais usadas da categoria** na tela seguinte; a descrição é refinamento, não pedágio (travar num campo de texto livre alguém que já pagou é cobrar o trabalho que a gente vende). 🔴 O mock atual (`mapear()`) NÃO conhece categoria: devolve sempre o mesmo trio. O ranking real de 'mais usadas por categoria' é dado que ainda não existe. 🟡 Em lapidação pelo Pedro; falta decidir se a transição pro estado com resultados é automática (ao digitar) ou por ação.", dados: "Descrição da atividade (texto livre) · categoria já vem preenchida do E3.4" },
  { id: "C0", caminho: "abrir", rota: "/dossie/atividade", rotasCobre: ["/veredito/atende"], label: "C0 · Sua atividade<br/>(descreve + pills)", forma: "tela", classe: "", status: "construida", validado: "pendente", grupo: "GATE", falta: "🔄 27/08 — era o E5A (`/gate`), antes do pagamento. Copy reenquadrada (`jaCliente`): não promete mais 'validar minha atividade' (a validação já aconteceu no E3.4), agora é 'achar meu CNAE'. 🔄 02/09 (pedido do Pedro) — A GRADE DE 17 PILLS SAIU DA TELA: a categoria vem pré-selecionada do E3.4 (via `?cat=`) como chip confirmado, dentro de um **dropdown** (mesmo `Select` do E3.4), fechado, que é por onde ela troca se quiser. 🆕 02/09 — O VEREDITO COMEÇOU A SER FUNDIDO AQUI DENTRO: os 3 CNAEs mais compatíveis aparecem na própria tela (cartões reusados do C0.2), num SLOT vazio no topo ('Escolha seu CNAE principal, é só clicar', contorno tracejado): clicar num cartão sobe ele pro slot em coral, clicar em outro troca e o CTA nomeando o que acontece ('Continuar com esse CNAE'). Cada cartão tem 'Ver detalhes', que abre um bottom-sheet com o que aquele código cobre (`SheetCnae`) e permite trocar por lá. O painel cinza (`rounded-3xl bg-surface-alt`, de 28/07) SAIU junto: ele existia pra agrupar a grade de pills, e sem elas os 2 campos vão direto no fundo claro, no mesmo `Campo` do C1/C4/E3.4. Lista do dropdown = só as 17 validadas, SEM a opção 'não encontrei' (essa porta é do E3.4, antes do dinheiro; aqui a pessoa já pagou e cair na waitlist seria beco). Sem `?cat=` o dropdown aparece vazio. O campo de descrição herdou a sobra que era da lista. 🔒 02/09 — CTA ÚNICO com 3 trabalhos ('Buscar atividade principal' na chegada · 'Buscar de novo' se mexeu na descrição/categoria depois da última busca · 'Continuar com essa atividade' com resultado fresco e um cartão no slot). Os 3 cartões são da ÚLTIMA BUSCA, não do texto ao vivo. Buscar de novo ESVAZIA o slot da atividade principal e o CTA volta a ficar travado até a pessoa escolher entre os novos resultados. Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev", dados: "Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine) · categoria já vem pré-selecionada do E3.4" },
  // 🔄 02/09 (pedido do Pedro) — a C5 e o splash mudaram de LUGAR na
  // declaração. As arestas já diziam C0 → C5 desde a remoção do veredito,
  // mas os nós seguiam declarados depois do C4 — e como a fita de pills e a
  // tabela do mapa saem DESTA ordem, a atividade secundária aparecia longe
  // da principal, como se fosse outro assunto. Agora a ordem de leitura
  // bate com a ordem do flow.
  { id: "C5", caminho: "abrir", rota: "/dossie/cnae-secundarios", label: "C5 · CNAE secundários", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "🆕 24/08 (reunião Leonan): ganhou busca livre (restrita ao que a gente atende, pedido original da Jéssica 19/07) além das 4 sugestões curadas mesmo-imposto; até 15 no total; secundária que muda enquadramento mostra aviso e troca CTA por 'Falar com atendente' em vez de bloquear silenciosamente. 🔄 28/08 (pedido do Pedro) — MUDOU DE LUGAR: vinha depois de C4 (dados da empresa), agora vem logo depois de C0.3 (CNAE principal confirmado) — sequência mais natural de quem acabou de escolher o CNAE. `lib/passos.ts` reflete a ordem nova ('CNAE secundário' é o 4º passo, não mais o 5º)", dados: "CNAEs secundários (seleção múltipla + busca, opcional, até 15)" },
  // 🆕 02/09 (pedido do Pedro) — FECHO DE BLOCO. Com o veredito fora do
  // caminho, o momento de alívio ("achei o seu encaixe") sumiu junto. Ele
  // volta aqui, e num lugar melhor: não confirmando UMA escolha, e sim
  // fechando o assunto ATIVIDADE inteiro (principal + secundárias) antes de
  // o dossiê virar a página pros dados pessoais.
  { id: "C5_S", caminho: "abrir", rota: "/splash-atividades", label: "C5.1 · Splash<br/>'já sabemos o que você faz'", forma: "tela", classe: "", status: "construida", validado: "ux", grupo: "GATE", falta: "Reusa `SplashMensagemView` (mesmo componente de /splash-atendido e /splash-pagamento), com `?next=` e auto-avanço. Arte/copy provisórias, Pedro revisa.", dados: "" },


  { id: "C1", caminho: "abrir", rota: "/dossie/socio", label: "C1 · Seus dados", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado). 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui (reunião Leonan, mesmo dia) foi REMOVIDO do MVP (custo/velocidade de leitura de imagem). 🆕 26/08 (achado do cruzamento com pesquisa JUCEMG/DBE, ver `gap-analise-dados-abertura-vs-pesquisa-gemini.md`): data de nascimento e nome da mãe ganharam campo — eram exigência de DBE ausente do dossiê. 🗑️ 01/09 (auditoria 1-a-1 contra os 141 prints): **nome da mãe REMOVIDO**. A exigência de 26/08 era inferida, não vista: em 141 prints não há campo de filiação em lugar nenhum (DBE tela 54 puxa do CPF; Integrador telas 102-104; contrato tela 117). MEI também não precisa — `abertura-mei-processo.md` linha 98 diz que vem do gov.br, não editável. Era campo obrigatório na 1ª tela pós-pagamento sem consumidor conhecido; se a certificadora pedir, o lugar é a A3.2. 🆕 01/09 (2ª passada, contra a ata da Izabela): **nacionalidade do titular** ganhou campo — gap assimétrico (o sócio extra tinha desde 31/08, o titular não), e o contrato qualifica TODO sócio com nacionalidade (art. 997 CC, print 117). Nasce como \"Brasileira\", editável. 🐛 Também corrigido o `dados` desta linha, que prometia \"confirma se mora fora do Brasil\" — a pergunta saiu da tela em 29/07 (mesma leva do N10) e o doc nunca foi atualizado: era captura documentada que não existia", dados: "CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (digitação manual) · data de nascimento · nacionalidade (pré-preenchida \"Brasileira\") · estado civil (+ regime de bens se casado)" },
  { id: "C2", caminho: "abrir", rota: "/dossie/vinculo", label: "C2 · Vínculo INSS", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "INSS 11% direto + teto folga = consolidado fiscal fechado", dados: "Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)" },
  // 🆕 26/08 (achado do Pedro, olhando o /mapa: "C3 parece duplicada com
  // C3.1") — CONFIRMADO no código: `SociosView` é 1 componente só, 1 rota só
  // (`/dossie/socios`), com 1 único `onSeguir` que sempre vai pro C4 direto
  // (`app/(app)/dossie/socios/page.tsx`). Quando TEM_SOCIO, a mesma tela JÁ
  // mostra o formulário de preencher os sócios extras — não existe uma "C3.1"
  // separada no código, era um nó fantasma no flow (antigo `C3_1`, removido).
  { id: "C3", caminho: "abrir", rota: "/dossie/socios", label: "C3 · Sócios?", forma: "decisao", classe: "", status: "construida", validado: "oficial", falta: "Re-pergunta o E5T (carry-forward pendente); limite subiu de 2 pra 4 (24/08). 🔒 24/08 (pedido do Pedro): não pergunta MAIS nada além de nome/%; quantidade e tipo (CPF) já vêm travados da triagem (E5T). Quando TEM_SOCIO, a MESMA tela já mostra o formulário de completar os sócios extras (sem passo/rota separada). 🔴→🟢 31/08 (gap-analysis contra a gravação real JUCEMG): faltava TODA a qualificação do sócio extra — só tinha nome+%, mas a JUCEMG/DBE exige a MESMA qualificação do titular (art. 997 CC) pra qualquer sócio. Adicionado nascimento, nacionalidade, RG+órgão, estado civil+regime de bens. Profissão fica de fora — preenchida internamente como \"Empresário\" pra todo mundo (ver PREENCHIDOS_INTERNAMENTE). 🔴→🟢 01/09 (auditoria 1-a-1): faltavam ainda **CPF e endereço do sócio extra**. O CPF é a CHAVE do sócio nos 3 sistemas (Viabilidade tela 14, QSA do DBE telas 63-70, Integrador tela 102) — o \"(CPF implícito)\" que este campo dizia vinha da triagem E5T, que trava o TIPO (só pessoa física), nunca o número. O endereço entra na qualificação do contrato (art. 997 CC, preview real na tela 117) e tem ficha própria no DBE (telas 67-69): na gravação veio automático só porque a empresa era SOLO e o sócio era o representante (popup da tela 66), o que não se repete com 2 sócios", dados: "Confirma se terá mais sócios (sem reperguntar quantidade/tipo) · se houver, de cada sócio extra: nome completo + CPF + % de participação + data de nascimento + nacionalidade + RG + órgão emissor + estado civil (+ regime de bens se casado) + endereço (CEP com autofill + número + complemento) · quem administra a empresa: com 1 sócio é sim/não no singular (\"Eu e o Carlos\"), com 2+ vira LISTA de nomes com check por sócio (dá pra ter sócio administrador e sócio que é só sócio)" },
  // 🆕 01/09 (pedido do Pedro) — variante da MESMA tela C3: com 3-4 sócios a
  // pergunta de administração deixa de ser binária e vira lista de nomes com
  // check. Vira nó porque estado que não está no mapa não existe pra quem lê o
  // mapa (mesma doutrina de E3.4.1 / E5T.1 / E7.1, 30/08).
  { id: "C3_1", caminho: "abrir", rota: "/dossie/socios?socios=3", label: "C3.1 · 3+ sócios<br/>(quem administra, por nome)", forma: "tela", classe: "branch", status: "construida", validado: "ux", falta: "Mesma `SociosView`, prop `socios` (a rota lê `?socios=3|4`, padrão continua o mock de 2). A lista mostra o titular travado como administrador e um check por sócio: dá pra ter sócio-administrador e sócio que é só sócio (49 × 22 no DBE). Nada marcado = só o titular administra, e a linha-resumo diz isso na tela em vez de deixar em silêncio", dados: "Quais sócios também administram (check por nome)" },
  { id: "C4", caminho: "abrir", rota: "/dossie/empresa", label: "C4 · Dados da empresa", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔒 01/09, 2ª rodada (pedido do Pedro) — a tela ficou com UM campo só. CEP, número e complemento aparecem TRAVADOS (vieram do E3.4 e não podem mais mudar aqui: já foram pra viabilidade); a pergunta 'Como é esse endereço?' foi REMOVIDA (o E3.4 já resolve endereço-dele × o nosso, e o tipo de imóvel responde o resto); e o aviso 'o IPTU desse endereço pode subir' saiu — chegava tarde, com a pessoa já tendo pago e já tendo mandado o endereço, então não mudava decisão nenhuma. Se voltar, o lugar é o E3.4, antes do dinheiro. Sobra o índice cadastral do IPTU. Sem `inicial` (deep-link, /mockup, prévia do /mapa) a tela cai no MOCK em vez de mostrar formulário vazio: formulário vazio é um estado que não existe no flow real. 🗑️ 01/09 (pedido do Pedro) — o **upsell de endereço fiscal saiu desta tela**. A regra virou binária: ou a pessoa escolheu o endereço fiscal no E3.4 (e a tela não existe pra ela), ou informou endereço próprio e aqui só TERMINA de preencher. O que veio do gate (CEP, número, complemento) aparece **travado**, com cadeado; o que falta (IPTU, tipo de endereço, imóvel) segue editável. Vender o endereço fiscal aqui seria oferecer, depois do pagamento, algo que muda a mensalidade. ✅ 28/07: IPTU obrigatório travado. 🔄 26/08 (reunião Rua Satélite 36, item 2): a escolha 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM daqui — moraram no E5F desde 24/08 até virarem o gate oficial de decisão, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio. 🔒 31/08 (gap-analysis + reunião Rua Satélite 38-40, tudo validado pelo Pedro): capital social deixou de ser pergunta — travado em R$10.000, nem aparece mais na tela (ver PREENCHIDOS_INTERNAMENTE). 'Endereço virtual' saiu do seletor 'tipo de endereço' — vira valor fixo só quando é o endereço fiscal da Legalizai (nunca opção de quem usa endereço próprio). 🐛→🔒 campo NOVO 'tipo de imóvel' (casa/apartamento/outro) — faltava por completo (zero ocorrência no código antes). A pergunta de residência, que só aparecia com 2+ sócios (bug: dono único nunca via essa pergunta, mesmo sendo a regra que decide deferimento/indeferimento na Prefeitura), agora vale sempre — e é SEMPRE sobre o titular (quem constitui), nunca sobre sócio extra. Se apartamento, resposta é automática 'sim' (travada); se o titular não reside ali, informa o endereço pessoal (com o mesmo tipo de imóvel). 🆕 01/09 (2 pedidos do Pedro, ambos construídos): **(1) a tela DEIXA DE EXISTIR pra quem usa o endereço fiscal da Legalizai** — antes ela abria só pra 'confirmar' uma escolha já feita no E3.4 e já somada no preço do E7, sem nada pra responder (endereço/IPTU/tipo de imóvel/residência são todos sobre um imóvel que não é dele). O C3 passa direto pro C7 e a rota redireciona sozinha em deep-link. ⚠️ **O MEI é exceção e continua vendo a tela**: lá existe 'Como você atende?' (forma de atuação), que é dele. O passo também some da lista de `lib/passos.ts` (`soEnderecoProprio`). **(2) carry-forward do endereço**: CEP, número e complemento respondidos no E3.4 chegam PREENCHIDOS aqui — a pessoa completa o que falta (IPTU, tipo de imóvel, residência) em vez de redigitar. Trafega por `sessionStorage` (`lib/rascunho.ts`), NÃO por querystring: endereço é dado pessoal, mesma regra do RF-01 que tirou nome/CPF/telefone da URL", dados: "Índice cadastral do IPTU (único campo do cliente) · CEP + número + complemento + tipo de imóvel + residência aparecem TRAVADOS, vindos do E3.4" },
  // 🔴→🟢 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) — C6 SAIU do
  // fluxo do cliente. Era pergunta (SLU × LTDA, sugerida/editável); virou
  // decisão 100% interna, tanto pra quem tem sócio quanto pra quem não tem
  // (ver PREENCHIDOS_INTERNAMENTE). Rota `/dossie/natureza` DELETADA — nó sem
  // `rota` fica só como marca histórica no mapa, mesmo tratamento do N24.
  { id: "C6", caminho: "removido", label: "'C6 · Natureza jurídica'<br/>🗑️ REMOVIDO 31/08", forma: "terminal", classe: "todo", status: "planejada", validado: "oficial", falta: "Era pergunta ao cliente (SLU × LTDA, Leonan 24/08). 31/08: virou decisão interna automática (SLU se sem sócio, LTDA se com sócio) — sem tela, sem pergunta. Rota `/dossie/natureza` apagada do app", dados: "" },
  { id: "C7", caminho: "abrir", rota: "/dossie/nome", label: "C7 · Nome / razão social", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "Viabilidade JUCEMG (RPA, não API); 3 opções por prioridade (28/07). 🔒 24/08 (reunião Leonan, CONFLITO RESOLVIDO): objeto social virou TRAVADO/read-only — erro de grafia do cliente gerava reclamação real no escritório antigo dele. 🆕 24/08 (pedido do Pedro): cada sugestão ganhou lápis de edição inline (reescreve a sugestão da IA no lugar); campo separado 'Digite a sua' foi removido; seta de reordenar 1/2/3 mantida", dados: "3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA) · objeto social (gerado automaticamente, travado) · nome fantasia (opcional)" },

  // ── ESPERA — decimal de entrada em Constituição ──────────────────────────
  { id: "C0_1", caminho: "abrir", rota: "/retomar", label: "C0.1 · Retomar<br/>(porta de CPF)", forma: "tela", classe: "espera", status: "construida", validado: "ux", falta: "UX-23 fechado — mora em /pro-labore pós-constituição. 🆕 30/08 — deixou de ser órfão: o E3 aponta pra cá, via porta de CPF (mock, RF-01). 🔒 31/08 (fusão A3+E9, pedido do Pedro: 'uma tela única de retorno, que é a E9') — ENCOLHEU pra só a porta de CPF: a tela de status própria que vinha depois (`RetomarView`, 'Bem-vindo de volta') foi RETIRADA do código. Agora, confirmado o CPF, SEMPRE cai no E9.1/E9.1P — é a mesma tela de status que já cobre boleto pendente, pago e fase Junta, então não fazia sentido ter uma 2ª versão só pra reentrada.", dados: "CPF (identifica quem está voltando; o status em si é da tela seguinte)" },

  // ── APROVAÇÃO (A) · cauda · A1–A5 (construído 21/07) ─────────────────────
  // 🆕 01/09 (pedido do Pedro) — 2ª rodada de nomes, aberta pelo CTA do A3.1
  // quando as 3 primeiras opções são recusadas pela Junta. MESMA tela do C7,
  // com os campos vazios (a IA já sugeriu e as 3 falharam — repetir o mesmo
  // tipo de sugestão seria oferecer o que acabou de ser reprovado).
  { id: "C7_2", caminho: "abrir", rota: "/dossie/nome/rodada-2", label: "C7′ · Sugerir mais<br/>3 nomes (2ª rodada)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa `NomeView` com `novaRodada`: 3 campos vazios, 1º já em edição, reordenação e objeto social iguais. Volta pro STATUS (não pro dossiê, que já acabou) pra Junta testar os nomes novos.", dados: "3 novas opções de razão social, na ordem de prioridade" },
  { id: "A1", caminho: "abrir", rota: "/revisar", label: "A1 · Revisar + autorizar", forma: "tela", classe: "", status: "construida", validado: "ux", falta: "🔄 01/09 (2ª rodada, pedido do Pedro) — saiu o card 'Taxa da Junta (já paga)', que mentia desde 26/08 (a DAE passou a ser paga DEPOIS, quando a viabilidade volta deferida), e saiu o ACEITE, que foi pra tela da guia (`/guia`) — é lá que a taxa de fato vira gasto irreversível. No ME a tela voltou a ser recap puro, com CTA 'Confirmar e seguir'. No MEI o aceite CONTINUA aqui: ele não paga guia nenhuma, então não existe tela depois desta pra carregá-lo. Recap read-only; carry-forward dos passos = estado do wizard (dev). 🆕 01/09 (decisão do Pedro): **absorveu o aceite da A2**, que foi eliminada. O checkbox irreversível é o último bloco da tela e trava o CTA (\"Autorizo, pode abrir\"); a explicação do não-reembolso virou LINK na própria frase, abrindo bottom-sheet (`SheetNaoReembolsavel`). Redação jurídica segue pendente (Mauro/Larissa)", dados: "Leitura + confirmação (enquadramento e pró-labore são SUGERIDOS, 28/07) · aceite do termo irreversível (checkbox)" },
  // 🗑️ 01/09 (decisão do Pedro) — A2 (`/termo`) ELIMINADA. A tela inteira
  // existia pra reforçar UMA coisa: a taxa da Junta não volta depois do
  // registro — e isso já está no contrato aceito no pagamento (E9). Reforço
  // não merece uma tela própria depois de 9 passos de dossiê. O aceite (que é
  // a garantia jurídica de verdade) virou o último bloco do A1, e o detalhe
  // do não-reembolso virou popup sob demanda. Rota e pasta removidas;
  // `TermoView` fica no código só pro Storybook/histórico.
  // 🆕 01/09 (pedido do Pedro) — a tela do PONTO SEM VOLTA, entre o A1 e o
  // status. Não é splash (não avança sozinha): tem CTA próprio, porque
  // atravessar aqui precisa ser um ATO. Ver `iniciar-viabilidade/page.tsx`.
  //
  // ♻️ O código A2 estava VAGO: era do "Termo irreversível", eliminado hoje de
  // manhã quando o aceite foi absorvido pelo A1. A lápide dele saiu daqui (o
  // histórico vive no ADR e no git); manter as duas quebraria o grafo, que é
  // indexado por id. Reusar o código faz sentido: as duas telas ocupam o mesmo
  // lugar do flow e falam da mesma coisa — o ponto a partir do qual não volta.
  { id: "A2", caminho: "abrir", rota: "/iniciar-viabilidade", label: "A2 · Ponto sem volta<br/>(antes da viabilidade)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Tela de aviso em coral cheio: depois de iniciar a viabilidade, mudar nome ou endereço exige CANCELAR e refazer o pedido na Junta (visto ao vivo na gravação de 31/08). O aceite já está no contrato do E9, mas contrato ninguém lê — uma tela inteira com CTA próprio transforma a cláusula em momento, e é o que a pessoa lembra se depois pedir pra mudar algo. 🔒 É ela que fecha o modo AJUSTE: antes daqui a tela de status deixa voltar a qualquer bloco; depois, o botão some", dados: "Aceite do ponto sem volta (o toque no CTA)" },
  { id: "A3", caminho: "abrir", rota: "/aguardando?fase=junta", label: "A3 · Status<br/>(fase Junta)", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔄 01/09 (pedido do Pedro) — a etapa da vez agora GIRA (anel azul) mesmo quando a ação é do cliente: antes o CTA suprimia o anel e a etapa ficava cinza, igual às que nem começaram, sendo que é exatamente onde a jornada parou. O card com CTA embaixo do passo leva pra `/guia` (pagamento da taxa), não mais direto pra assinatura. 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — **FUNDIDA COM O E9.1**: era tela própria (`/painel`), virou a FASE 'junta' da MESMA tela de status. Motivo: 'quando as pessoas clicarem em retomar processo teremos uma tela única de retorno, que é a E9'. Efeitos: (1) `/painel` no caminho ME agora só redireciona pra cá — a rota segue viva só pro MEI (pipeline concierge próprio) e pro Migrar; (2) a lista é ÚNICA, 12 passos: os 9 do dossiê (`lib/passos.ts`) + as 3 da Junta; (3) 'Documentação completa preenchida' SAIU (era redundante com os 9 passos já concluídos logo acima) — de 4 etapas voltou a 3. 🆕 cada passo mostra sub-descrição (o que envolve + tempo estimado) quando é o passo da vez. Histórico: 30/07 reduziu de 9→3; 26/08 (Rua Satélite 36, item 6) voltou a 4 com a DAE virando etapa visível e acionável ('Pague a guia da Junta', CTA coral inline depois que a viabilidade sai). NÃO absorvemos a taxa (alinhado ao líder). Componentes: `components/painel.tsx` (motor de render, `ETAPAS_ABERTURA`) + `wizard-cauda.tsx` (`AguardandoView`, monta a lista combinada)", dados: "" },
  // 🆕 31/08 — nó explícito do MEI, que a fusão A3+E9 separou: o ME migrou pra
  // `/aguardando?fase=junta`, mas o MEI continua em `/painel` (pipeline
  // concierge próprio, 4 etapas, copy que NUNCA diz que a gente registra).
  // Mesmo padrão de variante do E9/E9_M. Sem isso `/painel` virava rota órfã.
  { id: "A3_M", caminho: "mei", rota: "/painel?regime=mei", label: "A3 · Status<br/>(variante MEI)", forma: "tela", classe: "branch", status: "construida", validado: "oficial", falta: "Pipeline PRÓPRIO (`ETAPAS_MEI` em `painel/page.tsx`): recebemos seus dados → time conferindo → próximos passos prontos (CTA) → empresa aberta. ✍️ REGRA DE COPY: nenhuma etapa pode dizer que a Legalizai registra o MEI (não há API nem procuração que permita — ver `abertura-mei-processo.md`). Ficou FORA da fusão A3+E9 de 31/08 de propósito: o MEI não tem dossiê de 9 passos nem etapa de Junta, então fundir as listas não faria sentido.", dados: "" },
  { id: "A3_1", caminho: "abrir", rota: "/painel/recusa", label: "A3.1 · Órgão recusa<br/>'precisa de você'", forma: "tela", classe: "", status: "construida", validado: "oficial", falta: "🔄 01/09 (pedido do Pedro) — passou a ser A MESMA TELA do A3 (`AguardandoView` na fase junta), no estado de alerta: hero escuro + a jornada inteira, com a recusa inline na etapa que travou. Antes era um `PainelView` cru, só com as 3 etapas da cauda e sem hero — parecia outro app justo onde a confiança está mais frágil. O CTA de sugerir mais 3 nomes agora leva pro C7′. ✅ 28/07: retry automático construído — tenta as 3 opções do C7 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. Testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos", dados: "Retry automático pelas 3 opções priorizadas (C7) antes de pedir novas sugestões ao cliente" },
  // 🗑️ 01/09 (decisão do Pedro) — A3.2 (gate de certificado antes de assinar)
  // REMOVIDA do caminho de constituição de ME. Entrou em 26/08 por um motivo
  // que não se sustenta: "a procuração eletrônica exige certificado já
  // validado". O certificado é **e-CNPJ**, e neste ponto do flow o CNPJ ainda
  // não existe — não há o que validar. Some também o pedido em si: o
  // certificado é INCLUSO no plano ME e emitido por nós quando for preciso
  // (promessa já escrita na tela do plano, E7), então pedir upload/entrevista
  // ao cliente no meio da abertura cobrava dele um trabalho que é nosso.
  // A tela continua viva e navegável em 2 lugares, onde a empresa JÁ EXISTE:
  // MEI (`M_CERT`, `/certificado?regime=mei`) e o caminho migrar.
  { id: "A3_2", caminho: "removido", rota: "/certificado", label: "'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09<br/>(segue só no MEI/migrar)", forma: "tela", classe: "todo", status: "planejada", validado: "oficial", falta: "🗑️ 01/09 — fora do caminho ME. O componente (`CertificadoGateView`) e a rota seguem existindo pro MEI (`M_CERT`) e pro migrar. Motivo da remoção: (1) o certificado é e-CNPJ e o CNPJ ainda não existe neste ponto, então a justificativa original ('a procuração exige certificado validado') é impossível; (2) certificado é incluso no plano ME e emitido pela Legalizai, não tarefa do cliente. A trilha da A5 passou a dizer isso ('por nossa conta'), em vez de 'você já resolveu antes de assinar'", dados: "" },
  // 🆕 01/09 (pedido do Pedro) — tela NOVA: pagamento da guia da Junta. Não é
  // componente novo: é o MESMO PagamentoView do E9 no modo `guia` (muda valor,
  // copy e aceite; CPF, métodos e idempotência são idênticos de propósito).
  { id: "A3_P", caminho: "abrir", rota: "/guia", label: "A3.P · Pagar a guia<br/>da Junta (DAE)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa `PagamentoView` com a prop `guia`. Carrega o ACEITE irreversível (veio do A1) porque é aqui que a taxa vira gasto. Mock: pagar volta pro status com `?guia=paga` e a etapa fecha; no app real quem fecha é o webhook do provedor.", dados: "CPF (confirmado do cadastro) · método de pagamento (cartão/Pix/boleto) · aceite irreversível · cartão: número + nome impresso + validade + CVV · titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis) · endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis)" },
  // 🆕 01/09 (pedido do Pedro) — as 2 variantes de splash DA GUIA, espelhando
  // o par que o E9 já tinha (E9.S/E9.SB). Mesmo componente, `next` diferente:
  // quem paga por boleto volta pro status com a etapa AGUARDANDO COMPENSAÇÃO,
  // quem paga por cartão/Pix volta com ela fechada.
  // 🆕 01/09 — o mesmo par de recusa, agora na cobrança da GUIA.
  { id: "A3_SR", caminho: "abrir", rota: "/splash-recusado?next=/guia%3Fretry%3D1", label: "A3.SR · Splash<br/>guia recusada", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Mesmo componente do E9.SR, outro `next`. Alcançável por `/guia?simular=recusa`.", dados: "" },
  { id: "A3_R", caminho: "abrir", rota: "/guia?retry=1", label: "A3.R · Guia<br/>(nova tentativa)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "MESMA tela da guia com o aviso da recusa no topo. O aceite irreversível continua obrigatório na retentativa.", dados: "Método de pagamento (nova tentativa) · aceite irreversível" },
  { id: "A3_PS", caminho: "abrir", rota: "/splash-pagamento?next=/aguardando%3Ffase%3Djunta%26guia%3Dpaga", label: "A3.PS · Splash<br/>guia paga", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa `/splash-pagamento` (SplashMensagemView) com `?next` — transitório, sem CTA. Volta pro status com a etapa da guia concluída e a assinatura liberada.", dados: "" },
  { id: "A3_PSB", caminho: "abrir", rota: "/splash-boleto?next=/aguardando%3Ffase%3Djunta%26guia%3Dboleto", label: "A3.PSB · Splash<br/>boleto da guia", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Reusa `/splash-boleto` com `?next`. Volta pro status com a etapa virando **Guia da Junta · aguardando compensação**: segue girando, e as ações passam a ser ver o boleto e adiantar por Pix (mesmo par do hero do E9.1).", dados: "" },
  // 🆕 01/09 (pedido do Pedro) — os 2 ESTADOS do status depois de pagar a guia.
  // Eram invisíveis no mapa: as arestas dos splashes voltavam pro A3 genérico,
  // como se a volta fosse sempre igual — e não é. Mesma doutrina que já separa
  // E9.1 de E9.1P (boleto pendente × pago) e E7 de E7.1 (variante do endereço):
  // estado que muda o que a tela mostra e o que ela deixa fazer é nó, não nota.
  { id: "A3_GP", caminho: "abrir", rota: "/aguardando?fase=junta&guia=paga", label: "A3′ · Status<br/>(guia paga)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Volta de quem pagou a guia por cartão/Pix: a etapa da DAE fecha (verde) e 'Agora é só assinar' vira a vez. Mock por query (`?guia=paga`); no app real quem fecha é o webhook do provedor.", dados: "" },
  { id: "A3_GB", caminho: "abrir", rota: "/aguardando?fase=junta&guia=boleto", label: "A3″ · Status<br/>(guia no boleto,<br/>aguardando compensar)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Volta de quem pagou a guia por BOLETO. A etapa vira 'Guia da Junta · aguardando compensação': segue girando (não volta a pedir pagamento — a pessoa já pagou) e as ações passam a ser ver o boleto e adiantar por Pix. Sai deste estado quando o banco confirma (mock: `?guia=paga`).", dados: "" },
  // 🆕 01/09 (pedido do Pedro) — o status DEPOIS de mandar os nomes novos: a
  // jornada RECUA pra Analisando viabilidade. É o único ponto do flow em que
  // uma etapa concluída volta a ser a atual, e é honesto — os nomes novos vão
  // pra Junta de novo, então a análise recomeça. Mostrar Pague a guia aqui
  // diria que a análise já passou, quando ela nem começou.
  { id: "A3_V", caminho: "abrir", rota: "/aguardando?fase=junta&viabilidade=1", label: "A3‴ · Status<br/>(analisando viabilidade,<br/>2ª rodada de nomes)", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "Mesma tela do A3 com a fase Junta recuada (`junta={concluidas:0, emAndamento:0}`). Daqui volta pro fluxo normal quando a Junta defere, ou pro A3.1 se recusar de novo.", dados: "" },
  { id: "A4", caminho: "abrir", rota: "/assinatura", label: "A4 · Assinatura dos sócios", forma: "tela", classe: "", status: "construida", validado: "pendente", falta: "GOV.BR/e-CAC deep-link (dev). 🆕 24/08 (reunião Leonan): código 2FA único concentra procuração+assinatura (`CodigoGovView` — janela 10min, 3 tentativas, escala pra atendente se estourar); convite de sócio ganhou seletor de canal (WhatsApp/e-mail). 🆕 26/08 (item 7): certificado já vem validado da A3.2 — a procuração que sai junto desta assinatura agora tem o que precisa. 🗑️→🔴 01/09: **a A3.2 saiu do caminho ME**, então essa premissa caiu junto (o certificado é e-CNPJ, e o CNPJ ainda não existe aqui). Continua aberto o que fazer com a procuração e-CAC nesta tela: ela só pode ser assinada DEPOIS do CNPJ sair, e as 2 decisões de 01/09 (corrigir a cadeia toda + procuração sempre) ainda não foram construídas", dados: "Assinatura via GOV.BR/e-CAC · código de validação de 6 dígitos (janela 10min) · canal do convite ao sócio (WhatsApp/e-mail)" },
  { id: "A4G", caminho: "abrir", rota: "/assinatura", label: "GOV.BR nível<br/>bronze→upgrade", forma: "decisao", classe: "inline", status: "construida", validado: "pendente", falta: "Dobrado inline no A4 — sem query própria (nenhum toggle de demo separa o sub-estado), a prévia mostra a mesma tela do A4", naTabela: false, dados: "" },
  { id: "REMOVIDO_N24", caminho: "removido", label: "'Empresa ativa'<br/>🗑️ REMOVIDO 30/07", forma: "terminal", classe: "todo", status: "planejada", validado: "oficial", falta: "Era órfão desde o swap A4→A5 (nenhuma rota navegava mais até aqui) — arquivo `/ativa` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa", dados: "" },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🆕 28/08 · RAMO MEI (letra M) — abertura de MEI, do gate ao CNPJ.
  // ═══════════════════════════════════════════════════════════════════════════
  // Fonte: `pesquisa/abertura-mei/abertura-mei-processo.md` (70 refs oficiais)
  // e o cruzamento `execucao/flow/cruzamento-flow-mei-vs-me.md`.
  //
  // ⚠️ O ACHADO QUE DEFINE ESTE RAMO INTEIRO: **não existe API nem procuração
  // que permita abrir MEI por terceiro.** O Portal do Empreendedor exige a
  // conta gov.br (Prata/Ouro) DO TITULAR, não tem login por representação, e a
  // procuração do e-CAC só cobre atos posteriores (PGMEI, DARF, DCTFWeb).
  // Usar a senha do cliente viola os Termos de Uso do gov.br e é risco LGPD.
  //
  // Consequência: o modelo é **concierge**. A gente coleta tudo, um ATENDENTE
  // INTERNO confere (não contador — contador CRC é do plano ME, ver
  // `financeiro/estado-atual.md`), e o cliente finaliza no gov.br com a nossa
  // "cola". A abertura em si é gratuita e sai em minutos.
  //
  // O ramo só bifurca onde a lei obriga: E6→E9 (dinheiro) e A5 (home dia-1)
  // são COMPARTILHADOS com o ME.
  { id: "M_T", caminho: "mei", rota: "/gate?etapa=triagem", label: "M-T · Impedimentos<br/>(no lugar da triagem)", forma: "decisao", classe: "branch", status: "construida", validado: "oficial", falta: "🆕 28/08 — substitui o E5T no ramo MEI (MEI é unipessoal por definição, art. 966 CC: as perguntas de sócio não existem pra ele). São 3 impedimentos que o PRÓPRIO GOVERNO checa e bloqueia: (1) ser sócio/titular/admin de outra PJ — a RFB cruza o CPF, LC 123 art. 18-A; (2) servidor público federal na ativa — Lei 8.112/90 art. 117; (3) receber aposentadoria por invalidez / salário-maternidade / seguro-desemprego — este NÃO bloqueia, mas a formalização cancela o benefício de forma irreversível, então vira escolha informada com confirmação explícita. Fica ANTES do pagamento pelo mesmo motivo da triagem do ME: não cobramos de quem já sabe que não pode. Componente: `components/mei-telas.tsx` (`ImpedimentoView`)", dados: "Já tem outra empresa? (sim/não) · é servidor federal? (sim/não) · recebe benefício? (sim/não) + ciência explícita se sim" },
  { id: "M_T_1", caminho: "mei", rota: "/saida/mei-outra-empresa", label: "M-T.1 · 🔴 Já tem CNPJ", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "Saída de bloqueio do governo, não do produto. Oferece os 2 caminhos reais (baixar a antiga OU abrir como ME) em vez de waitlist — a Legalizai atende essa pessoa hoje, só não como MEI. Conteúdo em `lib/dados-saida.tsx`", dados: "Nome + contato" },
  { id: "M_T_2", caminho: "mei", rota: "/saida/mei-servidor", label: "M-T.2 · 🔴 Servidor federal", forma: "tela", classe: "saida", status: "construida", validado: "oficial", falta: "Vedação do art. 117 da Lei 8.112/90, só pra FEDERAL na ativa. A saída não fecha a porta pra estadual/municipal de propósito: lá a regra vem do estatuto de cada ente e em muitos casos é permitido. Conteúdo em `lib/dados-saida.tsx`", dados: "Nome + contato" },
  { id: "M_O", caminho: "mei", rota: "/dossie/ocupacao", label: "M-O · Ocupação<br/>(Anexo XI + limite interno)", forma: "tela", classe: "branch", status: "construida", validado: "oficial", falta: "🆕 28/08 — a C0 do ramo MEI, 1ª tela do dossiê. NÃO é o C0 adaptado: o Portal do Empreendedor não aceita CNAE livre, só OCUPAÇÃO de lista fechada (Anexo XI, Res. CGSN 140/2018), então não há 'descrever com suas palavras'. 🎯 Carrega o **limite interno** (Solução de Consulta Cosit nº 27/2021): a ocupação é mais estrita que o CNAE que ela mapeia — quem escolhe 'Reparador(a) de bicicleta' não pode consertar moto, e descobre numa fiscalização. É o erro que só contador pega, e é parte do que vendemos. Secundárias (até 15) também saem daqui, por isso o ramo pula o C5. Dados de `lib/mei.ts`, derivados dos 51 CNAEs certeza que aceitam MEI", dados: "Ocupação principal (1 da lista do Anexo XI) · até 15 ocupações secundárias" },
  { id: "M_CERT", caminho: "mei", rota: "/certificado?regime=mei", label: "A3.2' · Certificado<br/>(operar, não abrir)", forma: "tela", classe: "branch", status: "construida", validado: "oficial", falta: "🆕 28/08 (decisão do Pedro) — o MEI passa pelo MESMO gate de certificado do ME, com 2 diferenças: (1) o MOTIVO — no ME o certificado destrava a procuração da assinatura; no MEI não existe assinatura nem procuração de abertura (a abertura DISPENSA certificado, gov.br Prata/Ouro supre), então o que ele destrava é a OPERAÇÃO: puxar guia, FGTS Digital, agir sem pedir senha do cliente toda vez; (2) QUEM PAGA — no ME vem incluso (contrapartida da fidelidade, ADR 04/08); no MEI **não vem**, o cliente providencia. Fica ANTES da A5 a pedido do Pedro: 'tem que ser efetivado antes da pessoa cair pra dentro do app com as funcionalidades, da mesma forma do ME'. 🔴 Consequência aberta: a fidelidade de 12 meses do MEI perdeu a contrapartida escrita — precisa de justificativa nova antes de virar cláusula (Pedro/Mauro)", dados: "Certificado digital (upload .pfx/.p12 + senha) OU aceite de contato da certificadora parceira" },
  { id: "M_S", caminho: "mei", rota: "/mei/proximos-passos", label: "M-S · Próximos passos<br/>(a \"cola\")", forma: "tela", classe: "branch", status: "construida", validado: "oficial", falta: "🆕 28/08 — a tela que FECHA o ramo, e existe por razão jurídica, não de UX: como não dá pra registrar pelo cliente, a entrega é o passo a passo com os valores DELE prontos, na ordem dos campos do Portal. Inclui a checagem do nível da conta gov.br (Prata/Ouro obrigatório) e o link pro Portal. ✍️ REGRA DE COPY DURA: nunca dizer 'a gente abre pra você' neste ramo. 🔴 Falta: definir se o 'copiar tudo' vira PDF/WhatsApp; e o M-S é a tela mais cara de evoluir se um dia a automação for possível. Componente: `components/mei-telas.tsx` (`ProximosPassosView`)", dados: "Confirmação de que a conta gov.br é Prata/Ouro · (devolve o CNPJ gerado)" },
  // 🆕 01/09 (pedido do Pedro) — NÃO é passo do cliente: é a tela de
  // referência do DEV, pendurada no mapa pra ficar achável junto do flow que
  // ela documenta. `classe: "inline"` (cinza) e aresta tracejada saindo da A1
  // dizem isso visualmente: ninguém navega pra cá, e nada depois dela.
  // `naTabela: false` — a tabela de validação lista telas de produto.
  { id: "CONF", caminho: "dev", rota: "/conferencia", label: "🛠️ Conferência do dev<br/>(campos por origem)", forma: "tela", classe: "inline", status: "construida", validado: "ux", naTabela: false, falta: "Lista GERADA (`lib/conferencia-dados.ts` ← este arquivo): cada passo da constituição de ME, na ordem, com todo campo etiquetado USUÁRIO / AUTOMÁTICO / API. Existe porque metade do que a JUCEMG/DBE exige nunca aparece na tela do cliente, e sem a etiqueta o dev implementaria só o formulário. Mexeu em `dados`/`PREENCHIDOS_INTERNAMENTE`/`PREENCHIDOS_API`? Roda `gerar-mapa.mjs` e a tela acompanha", dados: "" },
  { id: "A5", caminho: "abrir", rota: "/home-dia1", label: "✅ A5 · Home dia-1<br/>(ativação)", forma: "terminal", classe: "feliz", status: "construida", validado: "oficial", falta: "🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). 🆕 24/08 (reunião Leonan): trilha agora mostra 3 status explícitos — Procuração (feito, instantâneo com o código) → Validação do certificado digital (agora, linka pra /mais/certificado upload+oferta) → Acesso completo. 🔄 26/08 (item 7): certificado deixou de ser 'agora' e virou 'feito' — já foi validado antes da assinatura (A3.2). Quem vira 'agora' é 'Conferir os dados da empresa' (`/mais/empresa`). 🔄 01/09 (decisão do Pedro, com a A3.2 fora do caminho ME): o passo do certificado continua 'feito', mas o texto mudou de 'você já resolveu antes de assinar' pra **'Certificado digital por nossa conta'** — é incluso no plano e emitido pela Legalizai quando for necessário, não tarefa do cliente. `/mais/certificado` segue existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs", dados: "" },
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
  // 🆕 30/08 — pede CPF antes (mock, RF-01): a ramificação real pro E9.1
  // (boleto pendente) acontece dentro do próprio C0_1, não aqui no mapa.
  { de: "E3", para: "C0_1", label: "voltar de onde parei", deHandle: "retomar", tracejado: true },
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
  { de: "E3_4", para: "E5T", label: "ME · endereço BH + categoria ok", deHandle: "segue" },
  // 🆕 28/08 — MEI segue pro M-T (impedimentos), não pra triagem de sócios.
  { de: "E3_4", para: "M_T", label: "MEI · categoria com ocupação", deHandle: "segue", tracejado: true },
  // 🆕 30/08 — estado inline (mesma tela), não navegação de verdade. As 2
  // saídas do E3.4.1 (endereço fiscal · fila de espera) continuam pro E5T
  // normalmente, nenhuma é dead-end.
  { de: "E3_4", para: "E3_4_1", label: "CEP fora de BH", tracejado: true },
  { de: "E3_4_1", para: "E5T", label: "resolvido (fiscal ou fila)", tracejado: true },

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
  // 🔒 29/08 — a Triagem não bifurca mais: os 3 critérios viraram card
  // informativo, não pergunta com saída própria.
  { de: "E5T", para: "E5F" },
  // 🆕 30/08 — estado inline (mesma tela), dead-end de propósito.
  { de: "E5T", para: "E5T_1", label: "sócio não se encaixa", tracejado: true },

  { de: "E5F", para: "E5F_S" },
  { de: "E5F_S", para: "E6", tracejado: true },

  // ── 🆕 28/08 · RAMO MEI ────────────────────────────────────────────────
  { de: "M_T", para: "E5F", label: "sem impedimento", tracejado: true },
  { de: "M_T", para: "M_T_1", label: "já tem outra empresa" },
  { de: "M_T", para: "M_T_2", label: "servidor federal" },
  { de: "E6", para: "E7" },
  // 🆕 30/08 — variante do E7 pra quem escolheu endereço fiscal lá no E3.4
  // (a escolha atravessa 3 telas até aparecer aqui, mesmo padrão do E9_M).
  { de: "E6", para: "E7_1", label: "escolheu endereço fiscal no E3.4", tracejado: true },
  // 🔴 30/08 — E8 eliminado (ver nota no node E9). E7 vai direto pra E9.
  { de: "E7", para: "E9" },
  { de: "E7_1", para: "E9", tracejado: true },
  // 🔴 30/08 (pedido do Pedro) — REVOGADO o "cartão pula direto pra C0". Todo
  // mundo passa por uma tela de status antes de seguir (ver nota no node E9).
  { de: "E9", para: "E9_S", label: "ME · cartão/Pix" },
  // 🆕 01/09 — o caminho da RECUSA no pagamento do plano (espelha o da guia).
  { de: "E9", para: "E9_SR", tracejado: true, label: "recusado" },
  { de: "E9_SR", para: "E9_R", tracejado: true },
  { de: "E9_R", para: "E9_S", tracejado: true, label: "passou" },
  { de: "E9_S", para: "E9_1P", tracejado: true },
  { de: "E9_1P", para: "C0_0", label: "Continuar preenchendo" },
  // MEI entra no dossiê pela ocupação, não pela descrição de atividade.
  // 🟡 30/08 — MEI segue direto por ora (fora do escopo desta rodada, que é
  // só ME Simples Nacional); revisitar quando o splash/status universal
  // expandir pro MEI também.
  { de: "E9", para: "M_O", label: "MEI · cartão", tracejado: true },
  { de: "M_O", para: "C1", label: "MEI reusa o C1", tracejado: true },
  // 🆕 31/08 — boleto passa pelo splash próprio (E9.SB) antes do E9.1, igual
  // cartão/Pix passam pelo E9.S. Antes ia direto do E9 pro E9.1.
  { de: "E9", para: "E9_SB", label: "ME · boleto" },
  { de: "E9_SB", para: "E9_1", tracejado: true },
  // 🔒 31/08 (fusão A3+E9) — o "Continuar preenchendo" do E9.1 fica TRAVADO
  // até o boleto compensar; quem paga por cartão/Pix (E9.1P) segue na hora.
  { de: "E9_1", para: "C0_0", label: "Continuar (após compensar)" },

  // 🆕 02/09 — a chegada vira a tela com resultados quando a pessoa descreve.
  { de: "C0_0", para: "C0", label: "descreveu o que faz" },
  // 🔒 02/09 — a C0 assumiu o trabalho do veredito: escolher JÁ é confirmar.
  { de: "C0", para: "C5", label: "escolheu a atividade" },
  { de: "C5", para: "C5_S" },
  { de: "C5_S", para: "C1" },
  // 🔄 28/08 (pedido do Pedro) — C5 (CNAE secundários) MOVEU: antes vinha
  // depois de C4 (dados da empresa); agora vem logo depois da atividade
  // principal confirmada, sequência mais natural de quem acabou de escolher
  // o CNAE. `lib/passos.ts` reflete a mesma ordem nova.

  { de: "C1", para: "C2" },
  { de: "C2", para: "C3" },
  { de: "C3", para: "C3_1", tracejado: true, label: "3+ sócios" },
  { de: "C3", para: "C4", label: "endereço próprio" },
  // 🆕 01/09 (pedido do Pedro) — quem escolheu o endereço fiscal da Legalizai
  // lá no E3.4 PULA o C4: a tela inteira não existe pra essa pessoa.
  { de: "C3", para: "C7", tracejado: true, label: "endereço fiscal (pula C4)" },
  // 🔒 31/08 — C4 vai direto pro C7: C6 (natureza jurídica) saiu do fluxo do
  // cliente, virou decisão interna automática (ver nó C6, marca histórica).
  { de: "C4", para: "C7" },
  { de: "C7", para: "A1" },

  // 🔄 01/09 — era A1 → A2 → A3. Com a A2 eliminada (aceite absorvido pelo
  // A1), o "Autorizo, pode abrir" leva direto pro status.
  { de: "A1", para: "A2", tracejado: true, label: "ME" },
  { de: "A2", para: "A3", label: "inicia viabilidade" },
  // Aresta de DOCUMENTAÇÃO, não de navegação: liga a referência do dev ao
  // ponto do flow em que o dossiê fecha. Tracejada e sem label de propósito.
  { de: "A1", para: "CONF", tracejado: true },
  // 🆕 31/08 — o MEI segue pro painel PRÓPRIO (não entrou na fusão A3+E9).
  { de: "A1", para: "A3_M", tracejado: true, label: "MEI" },
  { de: "A3", para: "A3_1", tracejado: true, label: "nome recusado" },
  { de: "A3_1", para: "C7_2", tracejado: true, label: "sugerir mais 3" },
  { de: "C7_2", para: "A3_V", tracejado: true, label: "manda pra viabilidade" },
  { de: "A3_V", para: "A3", tracejado: true, label: "nome aprovado" },
  { de: "A3_V", para: "A3_1", tracejado: true, label: "recusou de novo" },
  { de: "A3_1", para: "A3", tracejado: true },
  // 🔄 01/09 — era A3 → A3_2 → A4. Com a A3.2 fora do caminho ME, a DAE paga
  // libera a assinatura direto.
  { de: "A3", para: "A3_P", tracejado: true, label: "ME · pagar guia" },
  { de: "A3_P", para: "A3_SR", tracejado: true, label: "recusado" },
  { de: "A3_SR", para: "A3_R", tracejado: true },
  { de: "A3_R", para: "A3_PS", tracejado: true, label: "passou" },
  { de: "A3_P", para: "A3_PS", tracejado: true, label: "cartão/Pix" },
  { de: "A3_P", para: "A3_PSB", tracejado: true, label: "boleto" },
  { de: "A3_PS", para: "A3_GP", tracejado: true, label: "guia paga" },
  { de: "A3_PSB", para: "A3_GB", tracejado: true, label: "aguardando compensar" },
  { de: "A3_GB", para: "A3_GP", tracejado: true, label: "banco confirmou" },
  { de: "A3_GP", para: "A4", tracejado: true, label: "assinatura liberada" },
  { de: "A3", para: "A4", tracejado: true, label: "ME · DAE paga" },
  // No MEI o painel não espera órgão: espera o ATENDENTE conferir. Quando ele
  // libera, a etapa vira ação do cliente e abre o M-S.
  { de: "A3_M", para: "M_S", label: "MEI · time conferiu", tracejado: true },
  { de: "M_S", para: "M_CERT", label: "voltou com o CNPJ", tracejado: true },
  { de: "M_CERT", para: "A5", label: "certificado resolvido" },
  { de: "A4", para: "A4G", tracejado: true },
  { de: "A4G", para: "A5", tracejado: true },

  // 🔒 31/08 (fusão A3+E9) — o retomar não aterrissa mais direto no dossiê:
  // confirma o CPF e cai na TELA DE STATUS (E9.1P), que é quem sabe dizer em
  // que ponto a pessoa parou e se ela já pode continuar.
  { de: "C0_1", para: "E9_1P", label: "CPF confirmado", tracejado: true },
];
