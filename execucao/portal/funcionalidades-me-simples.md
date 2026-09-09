---
tipo: spec
status: vivo
data: 2026-09-08
assunto: funcionalidades-portal-me-simples
tags: [produto, portal, escopo, concorrente, automacao, api, dia-2]
---

# 🧩 Funcionalidades do portal — ME/Simples (lista consolidada)

> **O que é:** a lista única e fechada do que o app entrega no dia-2, cruzando (a) tudo o que mapeamos da Contabilizei, (b) o que já está construído nas nossas telas, e (c) o que ainda não cobre. A última coluna é o trabalho que começa agora: **como executar cada uma de forma automatizada**.
>
> 🔒 **Escopo desta rodada: ME no Simples Nacional.** MEI fica de fora de propósito (decisão do Pedro, 08/09) e entra numa rodada própria. O `portal-data.mjs` congelou em 28/07 sem conhecer o MEI, e misturar os dois aqui repetiria esse buraco.
>
> **Consolida, e não substitui:** [[2026-07-21-dossie-plataforma-logada]] (o teardown, ~85% de cobertura) · [[cruzamento-portal-interno]] (os 3 baldes de monetização, 22/07) · [[matriz-portal-interno]] (as telas P0–P14) · [[2026-07-27-portal-completo]] (o que virou tela).

## 🔗 Legenda

**Cobertura:** ✅ construída · 🟡 parcial (tela existe, falta parte) · 🔴 não existe · ⚪ decidido não fazer
**Balde** (travado 22/07): 🟢 core no plano · 🛒 vendável à-la-carte · 🔵 backlog · ❌ rejeitado (anti-dark-pattern)
**Automação:** 🤖 dá pra automatizar hoje · 🧑 exige gente (nosso time ou órgão) · ❓ a investigar

⚠️ **Tudo o que está construído é MOCKUP.** Nenhuma tela tem backend; a coluna "como automatizar" é justamente o que falta pra virar produto.

---

## 🔵 Decisões de 08/09 (nesta rodada)

### 1. A gente RECEBE e REPASSA a taxa da Junta e o certificado

Decisão do Pedro. O cliente paga **pra nós**, e nós pagamos o órgão e a certificadora:

| O que | Valor | Para quem vai |
|---|:--:|---|
| Taxa da Junta (DAE JUCEMG) | R$ 281,08 | JUCEMG |
| Certificado digital | R$ 209/ano | certificadora parceira |

⚠️ **Muda o que estava escrito antes.** O contrato do líder (registrado em 30/07) dizia que **o cliente paga todas as taxas públicas** direto. Agora o dinheiro passa por nós.

🔴 **Dois pontos abertos que essa decisão cria, e nenhum é de código:**
- **Fiscal.** Receber R$281,08 e R$209 no nosso CNPJ sem distinção pode ser lido como faturamento de serviço, e aí a gente é tributado sobre dinheiro de terceiro (6% no Simples a ~16% no Presumido) e teria que emitir NFS-e por serviço que não prestou. A saída usual é **split de pagamento**, mas [[2026-09-08-provedores-pagamento-saas-br|a pesquisa de gateways]] mostrou que split exige o recebedor **cadastrado e aprovado no PSP** (PLD/AML do BC). A JUCEMG é órgão público e não abre subconta em gateway; certificadora grande tipicamente também não. → **decisão fiscal com o Mauro**, antes de o dev integrar.
- **Fluxo de caixa.** Se recebemos por cartão em D+30 e a guia da Junta vence antes, a gente adianta o dinheiro do órgão. Em 500 clientes isso deixa de ser detalhe.

### 2. Serviço avulso: o que embute na fatura × o que é pago na hora

Até 27/07 a regra era só uma ("avulso não cobra na hora, entra na próxima fatura"). Ela não se sustenta agora que existem itens de R$1.299 e repasses a terceiro. **Regra nova, por critério e não por item:**

| Cobra NA HORA | Embute na PRÓXIMA FATURA |
|---|---|
| **Repasse a terceiro ou órgão** (taxa da Junta, certificado). O dinheiro não é nosso e tem prazo de repasse: financiar isso é virar banco do cliente | **Serviço nosso**, que a gente executa com a própria estrutura (CND, declaração de faturamento, reemissão de guia, recálculo) |
| **Valor acima do teto** (ver abaixo). Embutir R$1.299 numa fatura de R$139 é multiplicar a cobrança por 10: sobe recusa de cartão e vira inadimplência | **Valor abaixo do teto** |
| **Serviço que a gente só inicia depois de pago** (alteração contratual, baixa, alvará), porque tem custo de execução nosso e de órgão antes da entrega | |

🟡 **O teto ainda não está travado.** Proposta pra decidir: **1× a mensalidade do plano** (R$139 no ME). Racional: acima disso a fatura mais que dobra sem aviso, que é o tipo de surpresa que a gente critica no líder. Alternativa é um valor fixo (ex.: R$150), mais simples de explicar na tela. → **decisão do Pedro/Mauro.**

✍️ **Regra de tela que vem junto:** o preço e o **momento da cobrança** aparecem juntos, antes do aceite. "R$35,90 na sua próxima fatura" e "R$281,08 agora" são compromissos diferentes, e a pessoa precisa saber qual está aceitando.

---

## 🔴 As 2 decisões de 27/07 que mudaram o escopo de 22/07

Elas estão aplicadas na tabela abaixo, mas registro aqui porque **contradizem a spec anterior** e quem ler só o `cruzamento-portal-interno` vai achar outra coisa:

1. **Não intermediamos o pagamento da guia.** Mostramos, baixamos e copiamos o código de barras; a pessoa paga no banco. Isso derruba o que era o **diferencial nº 1** do dossiê ("pagar o DAS pelo app, não 'confirme que pagou'"). O gap do líder que a gente ataca passa a ser **saber o status sem perguntar**, não pagar por ele.
2. **Serviço avulso não cobra na hora** — entra na próxima fatura, removível antes de fechar (mesmo modelo do líder).

---

## 1. 🏠 Home e navegação

| # | Funcionalidade | No líder | Essencial p/ novo CNPJ | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 1.1 | Home "o que fazer hoje" (1 foco, não catálogo) | Home densa, 4 cards + upsell | 🟢 essencial | 🟢 | `/inicio` | ✅ | 🤖 Deriva do motor contábil: próxima obrigação + status. Sem API externa |
| 1.2 | Home estado dia-1 (recém-aberto, sem nota) | ❌ não tem (empty state morto) | 🟢 essencial | 🟢 | `/home-dia1` | ✅ | 🤖 Estado derivado do cadastro (tem nota? tem certificado?) |
| 1.3 | Barra de 4 abas + CTA central de emitir | nav lateral + flyout (2 níveis) | 🟢 essencial | 🟢 | `(portal)/layout.tsx` | ✅ | n/a (front) |
| 1.4 | **Central de avisos** (bell) — ver §1.4 abaixo | só pendência crítica, em vermelho | 🟢 **essencial** | 🟢 | `/avisos` | 🟡 | 🤖 4 fontes, 3 automáticas (motor · calendário · CMS) + 1 manual (time) |
| 1.5 | Acesso do 2º sócio | multi-usuário em "Minha conta" | 🟡 útil | 🟢 | — | 🔴 | 🤖 Auth/RBAC próprio. Sem API externa |
| 1.6 | Micro-educação / blog | banner educativo (reforma) | 🔵 dispensável | 🟢 | `/blog` | ✅ | 🧑 Conteúdo escrito por nós |

### 1.4 · A central de avisos é o canal da casa, não o mural de pendências

🔵 **Decisão do Pedro (08/09):** ela **não serve só pra avisar sobre a conta**. Cabe tudo aqui: post novo no blog, mudança na lei, parabéns por um marco. É o canal da casa com o cliente.

⚠️ Isso **inverte** o que estava mapeado. Na tabela ela era "🟡 útil", herdando o que o líder faz: um mural de **pendência crítica em vermelho**. Como canal, ela vira **essencial** — e ganha um risco que não tinha: virar a caixa de spam do app.

#### As 4 categorias

| | Categoria | O que é | Origem | Pode silenciar? |
|:--:|---|---|---|:--:|
| 🔴 | **Precisa de você** | guia vencendo, órgão pediu documento, cartão recusado, teto do Simples perto | motor + vigília | **não** |
| 🟡 | **Aconteceu na sua conta** | nota emitida, guia disponível, documento pronto, declaração entregue, fatura fechada | motor | sim |
| 🔵 | **Vale saber** | post do blog, mudança na lei que afeta o CNAE dela, dica do mês | CMS/blog (§1.6) | sim |
| 🎉 | **Momento** | 1ª nota emitida, 1º ano de empresa, marco de faturamento | motor | sim |

#### As regras que evitam ela virar spam

1. **Só a 🔴 não se silencia**, e ela é a única que pode furar como push. As outras três são silenciáveis por categoria, no ajuste da conta.
2. **A 🔴 sempre traz a AÇÃO junto.** Aviso que só informa um problema e não diz o que fazer é o dunning do líder com outra roupa (ver §9, "sem vender pânico"). Se não há o que a pessoa faça, não é 🔴.
3. **Uma por assunto.** O mesmo DAS não gera aviso no dia 15, 18 e 19: ele **atualiza** o aviso existente. O contador de não lidos conta assuntos, não disparos.
4. **A 🔵 e a 🎉 nunca entram no badge vermelho.** Post do blog não pode disputar atenção com guia vencendo, e é exatamente esse tipo de mistura que a gente critica na home do líder.
5. **A 🎉 é rara e verdadeira.** Só marca o que de fato aconteceu (a 1ª nota saiu, o CNPJ fez 1 ano). Confete inventado vira ruído na segunda vez.

#### O que falta construir (por isso 🟡 e não ✅)

A tela `/avisos` existe e lista avisos. Falta o que a transforma em canal:
- **as 4 categorias** com tratamento visual próprio (hoje é lista única)
- **preferências por categoria** (o que silenciar), na conta
- **a 🔵 puxando do blog**, que já existe em `/blog` e hoje não conversa com a central
- **a regra de "uma por assunto"**, que é do backend
- 🟡 **canal externo em aberto:** o aviso vive só no app, ou também vai por push/e-mail/WhatsApp? Isso muda o custo e o incômodo. → decisão do Pedro

## 2. 🏛️ Impostos

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 2.1 | Ver DAS do mês + vencimento + valor | ✅ (jargão: "DARF Unificado", "competência") | 🟢 essencial | 🟢 | `/impostos` | ✅ | 🤖 **Cálculo é do nosso motor** (receita do mês × anexo × Fator R). Não é API de terceiro |
| 2.2 | Baixar/ver a guia + copiar código de barras | ✅ (mas trava o renderer ao clicar na linha) | 🟢 essencial | 🟢 | `/impostos/guias`, `/impostos/pagar` | ✅ | 🤖 Emissão da guia: **API Serpro / PGDAS-D**. ❓ Confirmar endpoint e custo por chamada |
| 2.3 | **Pagar o DAS dentro do app** | ⚪ só com débito automático (upsell) | 🟢 essencial | ⚪ | — | ⚪ | ⚪ **Decidido NÃO fazer (27/07).** Reabrir exige decisão de negócio: Open Finance ou gateway |
| 2.4 | Saber que foi pago **sem perguntar ao cliente** | ❌ **"informe se pagou" (✓/✗ manual)** | 🟢 essencial | 🟢 | — | 🔴 | ❓ **O maior gap do líder e o nosso maior buraco.** Caminhos: (a) Open Finance read-only; (b) consulta de arrecadação no e-CAC com certificado A1; (c) conciliação manual do time. **Decisão pendente** |
| 2.5 | Histórico de guias pagas | ✅ | 🟢 essencial | 🟢 | `/impostos/guias` | ✅ | 🤖 Base própria + o mesmo mecanismo do 2.4 |
| 2.6 | Minhas alíquotas (composição: anexo, ISS, Fator R) | ✅ (`#/minhas-aliquotas`) | 🟢 essencial | 🟢 | `/impostos/aliquotas` | ✅ | 🤖 Nossa engine (`lib/fiscal`) + a matriz CNAE. **Já temos o dado** |
| 2.7 | Recalcular guia vencida | ✅ | 🟡 útil | 🛒 | `/mais/servicos` | ✅ | 🤖 Recálculo no motor + reemissão via Serpro. Só em guia vencida ≥1 dia |
| 2.8 | Simulador de impostos (previsão do mês seguinte) | ✅ forward-looking, pró-labore automático | 🟡 útil | 🟢 | — | 🔴 | 🤖 Mesma engine do 2.1, rodando com notas hipotéticas. **Sem dependência externa** |
| 2.9 | Débito automático do DAS | ✅ (upsell) | 🟡 útil | 🔵 | — | 🔴 | ❓ Exige mandato bancário. Decidido como benefício de plano, não toggle solto |

## 3. 🧾 Notas fiscais

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 3.1 | Emitir NFS-e pedindo **só valor + cliente** | 🟡 pede 3 códigos (CNAE, LC116, municipal) | 🟢 essencial | 🟢 | `/emitir` | ✅ | 🤖 **Focus NFe** (integração NFS-e) ou BHISS direto. Os 3 códigos vêm pré-preenchidos do onboarding |
| 3.2 | Lista/gestão de notas emitidas | ✅ (shell legado) | 🟢 essencial | 🟢 | `/notas` | ✅ | 🤖 Base própria, alimentada pelo emissor |
| 3.3 | Ver nota / baixar / enviar por canal | ✅ | 🟢 essencial | 🟢 | `/notas/detalhe` | ✅ | 🤖 PDF/XML do provedor de NFS-e |
| 3.4 | Cancelar / corrigir e reemitir | ✅ | 🟢 essencial | 🟢 | `/notas/detalhe` | ✅ | 🤖 Mesma API de emissão (endpoint de cancelamento). ❓ Prazo legal de cancelamento por município |
| 3.5 | Cadastro de tomadores (clientes) + B2C | ✅ | 🟢 essencial | 🟢 | `/emitir` (sheet) | ✅ | 🤖 Base própria. **InfoSimples `receita-federal/cnpj`** pra autopreencher tomador PJ pelo CNPJ |
| 3.6 | Consultor tributário (sugere o código do serviço) | ✅ ("✨ Sugerido") | 🟡 útil | 🟢 | — | 🔴 | 🤖 Nosso: a matriz CNAE já tem o de-para. Vira sugestão sem IA generativa |
| 3.7 | Importar notas emitidas fora (prefeitura) | ✅ | 🟡 útil | 🔵 | — | 🔴 | ❓ Depende do município expor consulta por CNPJ |
| 3.8 | Registrar notas **tomadas** (que a empresa recebe) | ✅ | 🔵 dispensável | 🔵 | — | 🔴 | 🧑 Entrada manual ou OCR. Fora do MVP |
| 3.9 | NF emitida pela equipe (concierge) | ✅ só no Experts R$395 | 🔵 | 🛒 | `/mais/servicos` | ✅ | 🧑 Por definição é humano |

## 4. 👥 Pró-labore e sócios

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 4.1 | **Pró-labore interativo** (mexe e vê o imposto mudar) | ❌ **só 4 presets em radio button** | 🟢 essencial | 🟢 | `/pro-labore` | ✅ | 🤖 **Nossa engine, 100% local.** É o diferencial-âncora: eles escondem atrás de "confie na gente" |
| 4.2 | Fator R + alerta preditivo (avisa antes de virar a faixa) | 🟡 tem o cálculo, não o alerta | 🟢 essencial | 🟢 | `/pro-labore` (vigília) | 🟡 | 🤖 Engine + histórico de faturamento. Falta o **gatilho de alerta** |
| 4.3 | Toggle "sem pró-labore em mês sem faturar", explicado | ✅ (switch cru, sem explicar) | 🟢 essencial | 🟢 | `/pro-labore` | ✅ | 🤖 Regra no motor da folha |
| 4.4 | Recibo de pró-labore + informe de rendimentos | ✅ | 🟢 essencial | 🟢 | — | 🔴 | 🤖 Documento gerado pelo motor. Sem API externa |
| 4.5 | Guia do INSS do pró-labore (DARF) | ✅ | 🟢 essencial | 🟢 | — | 🔴 | 🤖 Geração via **Serpro/eSocial**. ❓ Confirmar caminho pra sócio sem folha |
| 4.6 | Duplo vínculo (CLT + sócio, folga do teto do INSS) | ✅ ("vínculo empregatício") | 🟢 essencial | 🟢 | `/mais/socios` | 🟡 | 🤖 Declarado pelo cliente no onboarding (já coletamos no flow) |
| 4.7 | Dependentes (IRRF) | ✅ | 🟡 útil | 🟢 | — | 🔴 | 🤖 Cadastro simples, entra no cálculo |
| 4.8 | Alterar pró-labore de mês já processado | ✅ R$98,90 | 🟡 útil | 🛒 | `/mais/servicos` | ✅ | 🧑 Retificação de obrigação acessória: exige contador |

## 5. ✅ Estar em dia (compliance)

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 5.1 | "Você está em dia ✓" (prova de compliance, sem jargão) | ❌ empty state morto ("Sem informações") | 🟢 essencial | 🟢 | `/mais/em-dia` | ✅ | 🤖 Deriva do motor: obrigações do período × entregues |
| 5.2 | Declarações entregues (DEFIS, DCTF, SPED) | ✅ (jargão puro) | 🟢 essencial | 🟢 | `/mais/declaracoes` | ✅ | 🤖 Motor contábil gera e protocola. 🧑 Responsabilidade técnica do CRC |
| 5.3 | Calendário de obrigações do mês | ✅ (Central de Rotinas) | 🟢 essencial | 🟢 | `/obrigacoes` | ✅ | 🤖 Calendário fiscal + o perfil da empresa |
| 5.4 | **Vigília fiscal preditiva** (avisa antes do problema) | ❌ eles só avisam depois, com medo | 🟢 essencial | 🟢 | `/inicio` (bloco) | 🟡 | 🤖 Monitor sobre faturamento acumulado (teto do Simples, faixa, Fator R). **É o nosso diferencial nº 2** |
| 5.5 | Verificação de pendências no órgão | ✅ R$24,90 (isca de funil) | 🟡 útil | 🛒 | `/mais/servicos` | ✅ | 🤖 **InfoSimples**: consulta de pendências/CND na Receita. ⚠️ O monitoramento passivo fica **grátis e core**; o avulso é a consulta sob demanda |
| 5.6 | Relatórios contábeis (DRE, Balanço, Razão, Diário) | ✅ (shell legado, print-first) | 🔵 dispensável | 🔵 | `/mais/relatorios` | ✅ | 🤖 Motor contábil. Fica atrás de "avançado", com 1 linha traduzindo cada |

## 6. 📄 Documentos e certificado

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 6.1 | Documentos da empresa (contrato, CNPJ, alvará) | ✅ | 🟢 essencial | 🟢 | `/mais/documentos` | ✅ | 🤖 Storage próprio, semeado na abertura |
| 6.2 | Certificado digital resolvido nos bastidores | 🟡 cobrado à parte no Básico; "emita na prefeitura" | 🟢 essencial | 🟢 | `/mais/certificado` | ✅ | 🧑 **Parceiro terceirizado** (videochamada de validação), com upload escopado no nosso sistema. Modelo travado 22/07 |
| 6.3 | Emissão de CND (certidão negativa) | ✅ R$35,90 | 🟡 útil | 🛒 | `/mais/servicos` | ✅ | 🤖 **InfoSimples**: emissão de CND federal. ❓ Estadual/municipal a confirmar |
| 6.4 | Declaração / previsão de faturamento (abrir conta PJ) | ✅ R$68,90 | 🟢 essencial | ❓ | `/mais/servicos` | ✅ | 🤖 Gerado do nosso dado + assinatura do contador. **🔴 Candidato a virar core**: é dor do dia-1 do nosso ICP, e cobrar por isso é o que a gente critica no líder |
| 6.5 | DECORE (comprovante de renda, protocolado no CRC) | ✅ R$713,90 | 🟡 útil | 🛒 | `/mais/servicos` | ✅ | 🧑 Exige protocolo no CRC pelo contador. Não automatizável |
| 6.6 | Dados da empresa (o "currículo") | ✅ | 🟢 essencial | 🟢 | `/mais/empresa` | ✅ | 🤖 Base própria + **InfoSimples `receita-federal/cnpj`** pra manter sincronizado |

## 7. 💳 Plano, cobrança e conta

| # | Funcionalidade | No líder | Essencial | Balde | Nossa tela | Cobertura | Como automatizar |
|---|---|---|:--:|:--:|---|:--:|---|
| 7.1 | Ver plano, próxima fatura e avulsos adicionados | ✅ | 🟢 essencial | 🟢 | `/mais/plano` | ✅ | 🤖 **Asaas** (gateway já travado no B3) |
| 7.2 | Trocar forma de pagamento | ✅ | 🟢 essencial | 🟢 | `/mais/plano` | ✅ | 🤖 Asaas |
| 7.3 | Histórico de faturas | ✅ | 🟢 essencial | 🟢 | `/mais/plano` | ✅ | 🤖 Asaas |
| 7.4 | Cancelar plano sem punição | ❌ **baixa custa R$1.406–1.999** | 🟢 essencial | 🟢 | `/mais/plano` | ✅ | 🧑 Fluxo de saída. **Posicionamento: não punir a saída** |
| 7.5 | Loja de serviços avulsos | ✅ ~45 serviços | 🟢 essencial | 🛒 | `/mais/servicos` | ✅ | 🤖 Catálogo + Asaas. Cobra na **próxima fatura**, não na hora |
| 7.6 | Perfil / conta / login | ✅ | 🟢 essencial | 🟢 | `/perfil` | ✅ | 🤖 Auth próprio |
| 7.7 | Reajuste anual anunciado com regra clara | ❌ **IGP-DI vendido no chat** (P18) | 🟡 útil | 🟢 | — | 🔴 | 🧑 Política de preço. Decisão Pedro/Mauro |

## 8. 🛒 Catálogo à-la-carte (os 15 vendáveis, preço do líder como referência)

> Preço nosso **a definir com o Mauro** (decisão de negócio). A referência é o que o líder cobra.

| # | Serviço | Ref. líder | Cobertura | Como automatizar |
|---|---|:--:|:--:|---|
| 8.1 | Alteração contratual (sócio, CNAE, endereço, nome, capital) | a partir de R$1.299 | ✅ na loja | 🧑 Junta + Receita + Prefeitura. **JUCEMG sem API** (gargalo conhecido) |
| 8.2 | Baixa de empresa | R$1.406–1.999 | ✅ na loja | 🧑 ⚠️ **Debater o preço: não punir a saída** é posicionamento nosso |
| 8.3 | DECORE | R$713,90 | ✅ na loja | 🧑 Protocolo no CRC |
| 8.4 | Alvará (obtenção/renovação) | R$416 | ✅ na loja | 🧑 ALF PBH / SISDRAM. A mapear |
| 8.5 | CPOM/CEPOM (faturar fora de BH) | R$249 | ✅ na loja | 🧑 Portal do município de destino |
| 8.6 | Regularização de Inscrição Estadual | R$230,90 | ✅ na loja | ❓ SEF-MG. A mapear |
| 8.7 | Alteração de porte ME/EPP | R$156,40 | ✅ na loja | 🧑 Junta |
| 8.8 | Liberação p/ emitir NF (AIDF) | R$103,20 | ✅ na loja | ⚠️ **Se bloqueia a 1ª nota, não pode ser paywall puro** |
| 8.9 | Alteração de pró-labore processado | R$98,90 | ✅ na loja | 🧑 Retificação |
| 8.10 | Declaração / previsão de faturamento | R$68,90 | ✅ na loja | 🔴 **candidato a core** (ver 6.4) |
| 8.11 | Emissão de CND | R$35,90 | ✅ na loja | 🤖 InfoSimples |
| 8.12 | Verificação de pendências | R$24,90 | ✅ na loja | 🤖 InfoSimples |
| 8.13 | Reemissão de guia | R$15,90 | ✅ na loja | 🤖 Serpro |
| 8.14 | NF emitida pela equipe | Experts | ✅ na loja | 🧑 |
| 8.15 | Balanço/DRE assinado | R$0 | ✅ na loja | 🤖 Motor + assinatura |

## 9. ❌ O que o líder tem e a gente decidiu NÃO fazer

| Funcionalidade | Por quê |
|---|---|
| Conta digital PJ própria | Lock-in bancário. Nosso caminho é Open Finance com qualquer banco |
| Folha de pagamento | Solo de serviço não tem funcionário. Backlog |
| Plano de saúde / benefícios / TotalPass | Upsell puro, fora do produto |
| Cobrar seu cliente (gateway de recebíveis) | Adjacente, compete com Asaas/InfinitePay. Backlog |
| "Informe se você pagou" (✓/✗ manual) | ❌ **Rejeitado**: é o trabalho empurrado pro cliente que a gente ataca |
| Dunning por medo (exclusão do Simples, multa) | ❌ **Rejeitado**: flanco ético do líder |
| CSAT em toda tela (P16) | ❌ Medir sem incomodar |
| Surcharge oculto por faturamento/headcount | ❌ Preço transparente do perfil real |

---

## 📊 Onde a gente está

| | Total | ✅ construída | 🟡 parcial | 🔴 não existe | ⚪ decidido não fazer |
|---|:--:|:--:|:--:|:--:|:--:|
| **Funcionalidades (§1–7)** | 47 | 31 | 5 | 10 | 1 |

**Os 10 buracos, em ordem de importância:**

1. **2.4 · Saber que o imposto foi pago sem perguntar** — era o diferencial nº 1 do dossiê e hoje não tem caminho decidido. 🔴 **decisão de arquitetura pendente**
2. **4.5 · Guia do INSS do pró-labore** — obrigação mensal real, sem tela
3. **4.4 · Recibo de pró-labore e informe de rendimentos** — documento que o sócio pede todo ano
4. **2.8 · Simulador de impostos** — o líder tem; a engine já é nossa, é só superfície
5. **3.6 · Sugestão do código do serviço** — a matriz CNAE já tem o de-para
6. **5.4 · Vigília preditiva** (🟡 existe o bloco, falta o gatilho de alerta) — o diferencial nº 2
6b. **1.4 · Central de avisos** (🟡 a lista existe, faltam as 4 categorias, as preferências e a ligação com o blog) — virou canal da casa em 08/09
7. **4.2 · Alerta do Fator R** (🟡 mesma causa do 5.4)
8. **1.5 · Acesso do 2º sócio** — a sociedade vai até 2 no MVP
9. **7.7 · Regra de reajuste anunciada** — decisão de preço, não de código
10. **4.7 · Dependentes (IRRF)** · **3.7 · Importar notas** · **3.8 · Notas tomadas** — menores

## 🔌 MATRIZ DE DEPENDÊNCIA EXTERNA — o que precisamos ir buscar no mercado

> 🔵 **Pedido do Pedro (08/09):** *"não adianta a gente falar de todas essas funcionalidades sem de fato validar o que temos de API disponível realmente"*. Esta tabela existe pra a gente **não conversar sobre funcionalidade que um órgão trava**.
>
> 🔒 **Regra de entrada:** só entra aqui o que depende de **alguém de fora** (órgão, provedor, parceiro). Tudo que a gente resolve com **dado interno + programação** ficou de fora de propósito: já está resolvido, é só construir.
>
> **Ficaram de fora 27 das 51** (1.1, 1.2, 1.3, 1.5, 1.6, 2.1, 2.3, 2.5, 2.6, 2.8, 3.2, 3.6, 3.8, 3.9, 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 5.1, 5.3, 5.4, 5.6, 6.1, 6.4, 7.4, 7.6, 7.7). Entre elas está o **pró-labore interativo**, que é o nosso diferencial-âncora: ele é 100% engine própria e não depende de ninguém.
>
> **Coluna "sabemos?":** 🟢 confirmado com fonte · 🟡 indício, não verificado · 🔴 não sabemos, precisa vasculhar a documentação.

### A. Sem isso não há produto (bloqueiam o core)

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 3.1 | **Emitir NFS-e** | transmitir a nota ao município e receber número, PDF e XML | Prefeitura (BHISS em BH) | Exige **certificado A1 da empresa**. Cada município tem padrão próprio, e a NFS-e nacional está em transição | 🟡 | **Focus NFe** (citado em [[fluxo-abertura-portais-pedro-dev]], sem contrato) · **PlugNotas** · **eNotas** · **NFE.io** · **NFS-e Nacional** (padrão federal, API única) · BHISS direto |
| 3.3 | Baixar PDF e XML da nota | recuperar o documento emitido | mesmo provedor do 3.1 | Sai junto da emissão | 🟡 | resolve junto com o 3.1 |
| 3.4 | Cancelar ou substituir nota | cancelamento no município | Prefeitura | ⚠️ **O prazo de cancelamento varia por município** e costuma ser curto. Depois dele, só substituição | 🔴 | confirmar a regra do BHISS |
| 2.2 | **Emitir a guia do DAS** | gerar o DAS da competência | Receita Federal (PGDAS-D) | O cálculo é nosso; a **guia oficial** nasce no PGDAS-D, que exige a apuração transmitida | 🔴 | **Serpro / Integra Contador**: confirmar se cobre PGDAS-D, custo por chamada e se aceita procuração e-CAC em vez do certificado do cliente |
| 5.2 | **Transmitir as declarações** (DEFIS, DCTF, SPED) | entregar a obrigação ao governo | Receita Federal | Hoje o escritório faz por fora, no sistema dele. Automatizar exige transmissão programática | 🔴 | **Serpro / Integra Contador**: quais obrigações cobre |
| 6.2 | **Certificado digital A1** | emissão com videochamada de validação | Certificadora (ICP-Brasil) | 🟢 **Modelo travado em 22/07:** a parceira executa tudo fora do app, e um funcionário dela sobe o arquivo no nosso sistema com acesso escopado | 🟢 | **qual parceira ainda não foi definida** · como é o portal/API de emissão em lote |

⚠️ **O 3.1 e o 2.2 são os dois que decidem o produto.** Sem emitir nota e sem gerar guia não existe app de contabilidade, existe um painel bonito. Todo o §2 e o §3 penduram neles.

### B. É o nosso diferencial, e depende de fora

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 2.4 | **Saber que o imposto foi pago, sem perguntar** | descobrir que a guia foi quitada | banco do cliente **ou** Receita | 🔴 **O maior buraco do produto.** Nenhum caminho testado. É o gap nº 1 do líder e o que sustenta a promessa de não perguntar "você pagou?" | 🔴 | (a) **Open Finance** read-only, com consentimento; (b) consulta de **arrecadação/DARF pago no e-CAC**, via Serpro; (c) conciliação manual do time, que não escala |
| 5.5 | Verificação de pendências e situação fiscal | consultar a situação da empresa nos órgãos | RF, PGFN, SEF-MG, PBH | 🟡 **InfoSimples** é o caminho mais provável: o vault registra que ele é **quase só consulta, não emite**, e aqui é consulta que a gente precisa | 🟡 | InfoSimples: quais consultas, preço por chamada, se exige certificado |

### C. Vendáveis à-la-carte (a receita além da mensalidade)

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 6.6 | Manter os dados da empresa sincronizados | consultar o cadastro do CNPJ | Receita Federal | 🟢 O caso mais comum e mais resolvido de API no Brasil | 🟢 | **InfoSimples `receita-federal/cnpj`** · BrasilAPI (grátis, sem SLA) |
| 3.5 | Autopreencher o tomador PJ pelo CNPJ | mesma consulta do 6.6 | Receita Federal | 🟢 idem | 🟢 | mesmo do 6.6 |
| 6.3 | Emissão de CND | emitir certidão negativa | RF/PGFN · SEF-MG · PBH | 🟡 A federal é a mais provável de ter caminho; estadual e municipal são o de sempre | 🟡 | **InfoSimples** (federal) · SEF-MG e PBH a mapear |
| 2.7 | Recalcular guia vencida | recalcular com juros e multa e reemitir | Receita Federal | Depende do 2.2 estar resolvido primeiro | 🔴 | mesmo caminho do 2.2 |
| 4.5 | Guia do INSS do pró-labore | gerar a guia da contribuição do sócio | Receita Federal / eSocial | 🔴 Não mapeado. Sócio sem folha tem caminho próprio, diferente de empregado | 🔴 | **eSocial** (evento de remuneração) · **DCTFWeb** · Serpro |
| 4.8 | Alterar pró-labore já processado | retificar obrigação acessória já entregue | Receita Federal | 🟡 Retificação exige contador. Provável que siga humano | 🟡 | verificar se a retificação é programática via Serpro |
| 6.5 | DECORE | protocolar no CRC | CRC-MG | 🟢 Ato privativo do contador, protocolado no conselho. **Não automatizável** | 🟢 | confirmar se o CRC-MG tem portal com API, só pra reduzir digitação |
| 8.1 | Alteração contratual (sócio, CNAE, endereço) | alterar o registro na Junta, na RF e na Prefeitura | **JUCEMG** + RF + PBH | 🟢 **A JUCEMG NÃO TEM API** (gargalo registrado em 09/07). O InfoSimples faz junta de SP, não de MG | 🟢 | reconfirmar se abriu API desde então · senão, RPA/Playwright, que não escala |
| 8.2 | Baixa de empresa | dar baixa na Junta e na RF | **JUCEMG** + RF | mesmo gargalo do 8.1 | 🟢 | idem |
| 8.7 | Alteração de porte ME/EPP | alterar na Junta | **JUCEMG** | mesmo gargalo | 🟢 | idem |
| 8.4 | Alvará (obtenção ou renovação) | pedido na prefeitura | **PBH** (ALF, SISDRAM) | 🔴 Consta como "a mapear" desde 09/07 | 🔴 | ALF PBH · SISDRAM: existe API ou só portal? |
| 8.8 | Liberação para emitir NF (AIDF) | autorização municipal | Prefeitura | 🔴 Não mapeado. ⚠️ **Se isso bloqueia a primeira nota, sobe de prioridade** e não pode ser paywall | 🔴 | BHISS / PBH |
| 8.5 | CPOM/CEPOM | cadastro no município de destino | prefeitura de outro município | 🔴 Cada município tem portal próprio | 🔴 | levantar antes os municípios mais comuns dos nossos clientes |
| 8.6 | Regularização de Inscrição Estadual | regularizar na SEFAZ | **SEF-MG** | 🔴 Não mapeado | 🔴 | SIARE (SEF-MG) |

### D. Infraestrutura (tem trilha própria, fora desta matriz)

| # | Funcionalidade | Dono | Situação |
|---|---|---|---|
| 7.1–7.3, 7.5 | Cobrança da mensalidade e dos avulsos | gateway de pagamento | 🔄 Em decisão. O Asaas saiu e há reunião marcada com o **Pagar.me**. Ver [[2026-09-08-provedores-pagamento-saas-br]] |
| 2.9 | Débito automático do DAS | banco | 🔵 backlog, e depende do 2.4 |
| 3.7 | Importar notas emitidas fora do app | prefeitura | 🔵 backlog, e depende de o município expor consulta |

---

## 🎯 A lista de investigação, em ordem

Sai direto da matriz. **Nenhuma decisão de produto de §2 e §3 deveria ser tomada antes das duas primeiras:**

1. **🔴 Emissão de NFS-e** (3.1) — comparar Focus NFe, PlugNotas, eNotas, NFE.io e a NFS-e Nacional. Critérios: cobertura de BH, custo por nota, se o certificado A1 fica com eles ou conosco, sandbox, e o que acontece quando o município sai do ar.
2. **🔴 Serpro / Integra Contador** (2.2, 5.2, 2.7) — cobre o PGDAS-D? Transmite DEFIS e DCTF? Quanto custa por chamada? Aceita procuração e-CAC no lugar do certificado do cliente?
3. **🔴 Status de pagamento** (2.4) — Open Finance contra consulta de arrecadação no e-CAC. É decisão de **arquitetura**, não de fornecedor, e trava o que a gente promete na tela.
4. **🟡 InfoSimples** (5.5, 6.3, 6.6, 3.5) — catálogo real de consultas, preço por chamada, se exige certificado. É o mais barato de validar: a documentação é pública.
5. **🔴 Guia do INSS do pró-labore** (4.5) — qual o caminho para sócio sem folha.
6. **🔴 Municipais de BH** (8.4, 8.8) — ALF, SISDRAM e AIDF. Se o 8.8 bloqueia a primeira nota, sobe de prioridade.
7. **🟢 JUCEMG** — reconfirmar se segue sem API. Se seguir, 8.1, 8.2 e 8.7 são humanos, e o preço tem que refletir isso.

⚠️ **A leitura dura desta matriz:** são **24 dependências externas**, e **10 estão em 🔴** (não sabemos) contra 6 em 🟡. A coluna "como automatizar" da tabela principal foi escrita antes desta e é **hipótese, não plano** — nenhuma linha dela foi testada contra API real.

---

## ⚠️ As 3 dependências que travam virar produto

Herdadas da matriz de 22/07 e ainda de pé:

1. **🔧 O motor contábil mensal** — quem calcula o DAS, gera as declarações e fecha a competência. **Metade da coluna "como automatizar" desta tabela depende dele.** O portal é uma janela; sem o motor, tudo é mock.
2. **🏛️ O status de pagamento (2.4)** — sem resolver, a gente cai no "confirme que pagou" do líder, que é exatamente o que a gente critica.
3. **🤝 O parceiro do certificado** — modelo travado (eles executam, a gente valida e libera), parceiro específico ainda não.

## 🔌 O que já sabemos das APIs

| Fonte | Cobre | Confiança |
|---|---|---|
| **InfoSimples** | Consultas federais: CNPJ, Simples/SIMEI, CND, pendências. ⚠️ **Quase só consulta, não emite** | 🟢 travado ([[legalize-mei-obrigacoes-e-apis]]) |
| **Serpro / PGDAS-D** | Emissão da guia do DAS | 🟡 endpoint e custo a confirmar |
| **Focus NFe** | Emissão de NFS-e | 🟡 citado em [[fluxo-abertura-portais-pedro-dev]], sem contrato |
| **Asaas** | Cobrança da mensalidade e dos avulsos | 🟢 travado no B3 |
| **Open Finance** | Conciliação bancária read-only (caminho do 2.4) | 🔴 não investigado |
| **JUCEMG** | Alteração contratual, baixa | 🔴 **sem API** (gargalo crítico conhecido) |
| **ALF PBH / SISDRAM** | Alvará, taxas municipais | 🔴 a mapear |

⚠️ **Anti-guru:** os 🤖 desta tabela são hipóteses de caminho, não integrações validadas. Nenhuma foi testada contra a API real. Antes de virar promessa pro Mauro ou estimativa pro dev, cada uma precisa de um teste de chamada.

## Links
- [[2026-07-21-dossie-plataforma-logada]] · [[cruzamento-portal-interno]] · [[matriz-portal-interno]] · [[plano-padrao-195-referencia]] · [[2026-08-24-servicos-mensalidade-mapeados-legalizai]] · [[fluxo-abertura-portais-pedro-dev]] · [[BASE-ESTRATEGICA]] · [[HOME]]
