---
tipo: derivado
status: vivo
gerado_por: execucao/flow/gerar-mapa.mjs
data: 2026-09-09
assunto: dados-coletados-abertura
tags: [execucao, flow, dados, abertura]
---

# 📋 Dados coletados — Abertura de CNPJ, até a 1ª tentativa de viabilidade

> ⚠️ **Nota gerada** — roda `node execucao/flow/gerar-mapa.mjs` pra atualizar depois de mexer em `flow-data.mjs`. Escopo: só o caminho **Abrir** (não Migrar). Do primeiro toque no app até o clique que dispara a 1ª tentativa de viabilidade na Junta (`C7`, CTA que envia a razão social pra JUCEMG). Ver [[mapa-flow-mermaid]] pro diagrama completo, [[gap-analise-dados-abertura-vs-pesquisa-gemini]] pro cruzamento com pesquisa externa.

## Telas do caminho, em ordem

### E1 · Splash
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.1 · Welcome (1/3 · Léo vigia, contador é gente)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.2 · Welcome (2/3 · Aquece o fork)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.3 · Welcome (3/3 · Sem susto no boleto)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3 · Fork 4 rotas
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3.3 · Seus dados (nome · e-mail · telefone)
- Nome completo
- e-mail
- telefone
- consentimento de privacidade (implícito, ao continuar)

### E3.2 · MEI × ME (variante Abrir)
- Regime autodeclarado (MEI ou ME)

### E3.4 · Endereço + categoria (os 2 gates)
- Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) OU cidade pra fila de espera
- categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou

### E3.4.1 · CEP fora de BH (gate resolvido inline)
- Confirma: usa endereço fiscal Legalizai OU entra na fila da própria cidade

### Triagem quantos sócios?
- Quantidade de sócios (1 / 2 / 3 / 4)
- quem administra a empresa (só o titular × titular + sócios) quando há sócio
- é a 1ª empresa que abre? (opcional)
- sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time')

### Faixa de faturamento
- Faixa de faturamento mensal (4 faixas até R$30 mil, o teto do ME) ou valor exato, se souber

### E5F.1 · Splash 'conseguimos te atender'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E6 · Criar conta
- Nome
- CPF
- telefone
- e-mail
- senha
- código de verificação de 8 dígitos (mock)

### E6.1 · Confirmar código
- Código de verificação de 8 dígitos (`DIGITOS_CODIGO`), enviado pro e-mail e pro telefone digitados no E6

### E6.2 · CPF não confere (nome divergente)
- Retorno da Receita: nome civil × nome digitado
- situação cadastral

### E7 · A conta da abertura
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E7.1 · A conta da abertura (variante endereço fiscal)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9 · Pagamento + contrato (variante Abrir)
- CPF (cobrança + elegibilidade)
- método de pagamento (cartão/Pix/boleto)
- aceite do contrato de serviço (checkbox)
- cartão: número + nome impresso + validade + CVV
- titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis)
- endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis)

### E9.S · Splash 'pagamento confirmado'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.SB · Splash 'boleto gerado'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.SR · Splash pagamento recusado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.R · Pagamento (nova tentativa)
- Método de pagamento (nova tentativa)
- CPF já confirmado

### E9.1 · Aguardando boleto dossiê já liberado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.1P · Status (pago, via instantâneo)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### C0.0 · Sua atividade (chegada, antes de descrever)
- Descrição da atividade (texto livre)
- categoria já vem preenchida do E3.4

### C0 · Sua atividade (descreve + pills)
- Descrição da atividade (texto livre) → CNAE principal (derivado por IA)
- OU o código já sabido (atalho 28/07, mesma engine)
- categoria já vem pré-selecionada do E3.4

### C5 · CNAE secundários
- CNAEs secundários (seleção múltipla + busca, opcional, até 15)

### C5.1 · Splash 'já sabemos o que você faz'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### C1 · Seus dados
- CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta)
- RG + órgão emissor (digitação manual)
- data de nascimento
- nacionalidade (pré-preenchida "Brasileira")
- estado civil (+ regime de bens se casado)

### C2 · Vínculo INSS
- Já contribui INSS por fora? (sim/não)
- valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)

### C3 · Sócios?
- Confirma se terá mais sócios (sem reperguntar quantidade/tipo)
- se houver, de cada sócio extra: nome completo + CPF + % de participação + data de nascimento + nacionalidade + RG + órgão emissor + estado civil (+ regime de bens se casado) + endereço (CEP com autofill + número + complemento)
- quem administra a empresa: com 1 sócio é sim/não no singular ("Eu e o Carlos"), com 2+ vira LISTA de nomes com check por sócio (dá pra ter sócio administrador e sócio que é só sócio)

### C3.1 · Sócios (teto: 3 + você)
- Por sócio: nome, CPF, participação, nascimento, nacionalidade, RG + órgão, estado civil (+ regime) e endereço
- quem administra (lista)

### C3.2 · Sócios (só você)
- Confirmação de que a empresa fica só no nome do titular (nenhum dado novo)

### C3.3 · CPF de sócio não confere
- Retorno da Receita por sócio: nome civil × nome digitado
- situação cadastral

### C4 · Dados da empresa
- Índice cadastral do IPTU (único campo do cliente)
- CEP + número + complemento + tipo de imóvel + residência aparecem TRAVADOS, vindos do E3.4

### C7 · Nome / razão social
- 3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA)
- objeto social (gerado automaticamente, travado)
- nome fantasia (opcional)

🔴 **É aqui que o CTA dispara a 1ª tentativa de viabilidade na Junta (JUCEMG)** — os campos acima são exatamente o que vai pro pedido de viabilidade.

### M1 · Onde você trabalha (área + endereço)
- Categoria de atividade (14, sendo 3 sem MEI)
- forma de endereço
- CEP + número + complemento

### M2 · Impedimentos (no lugar da triagem)
- Já tem outra empresa? (sim/não)
- é servidor federal? (sim/não)
- recebe benefício? (sim/não) + ciência explícita se sim

### M3 · Faturamento (gate do teto R$81k)
- Faixa de faturamento mensal (5 opções, a última estoura o teto) OU valor exato
- ciência do teto quando perto

## Preenchidos por nós, não pelo cliente

> Campos que a viabilidade/DBE exigem, mas a Legalizai preenche internamente — decisões travadas em `marca/decisoes-marca.md`.

| Campo | Valor | Onde entraria | Status | Por quê |
|---|---|---|---|---|
| Qualificação de cada sócio no DBE (49 × 22) | derivada da resposta do C3 (quem administra) | C3 · Sócios | 🟢 travado 01/09 (Rua Satélite 42, simulação de DBE ao vivo) | É a ÚNICA coisa que a pergunta nova do C3 muda no processo: sócio marcado como administrador vai ao DBE com 49 e sai na cláusula de administração do contrato; sócio não marcado vai com 22 e só aparece no quadro societário. O titular é sempre 49 — quem inicia o cadastro é o representante perante a Receita, e o sistema puxa a qualificação dele sozinho. |
| Forma de assinatura (isolada × conjunta) | NÃO enviada — o contrato padrão não tem esse campo | Pós-C7 · Geração do contrato (RPA/Integrador) | 🟢 travado 01/09, com o contrato real na tela | 🔴 Regra dura: inserir cláusula de assinatura tira o processo do contrato PADRÃO e manda pra análise humana (mesma família do achado da procuração, 31/08). O contrato padrão gerado não fala em forma de assinatura, e a cláusula 8ª do modelo dá a cada administrador representação ativa e passiva pra praticar todos os atos do objeto social; a assinatura de todos só é exigida em atos extraordinários (onerar/alienar imóvel da sociedade, obrigações em favor de cotistas ou terceiros). 🟡 Leitura conferida por IA sobre o contrato real da simulação; falta ratificação da contadora e teste em banco. |
| Representante perante a Receita Federal (DBE) | sempre quem iniciou o cadastro no app | C1 · Seus dados | 🟢 travado 01/09 | Não é escolha e não é pergunta: quem preenche é o representante, e o DBE puxa a qualificação a partir disso. Se quem vai administrar é outra pessoa, é ela que precisa abrir a conta e conduzir a abertura — permitir 'indicar outro' criaria um caso em que o dono da conta não é o dono do processo. |
| Telas de conferência do DBE (dados vindos da viabilidade) | puladas pelo RPA — nome empresarial, natureza, nome fantasia, CNAEs, objeto social, endereço da PJ, porte ME e dados do contador vêm importados | Pós-C7 · DBE (RPA) | 🟢 observado na simulação 01/09 | Tudo isso já foi decidido na viabilidade e chega preenchido: reconferir campo a campo só gastaria tempo de robô. |
| Tipo de evento (Viabilidade JUCEMG) | Inscrição de primeiro estabelecimento (Matriz) | Pós-C7 · Viabilidade (RPA/JUCEMG) | 🟢 travado, visto na gravação (print 2) | Toda constituição nossa é matriz nascendo: não existe caso de filial nem de alteração no escopo do MVP. É a 1ª escolha da tela de Nova Viabilidade, e errar aqui manda o processo pra outro rito inteiro. |
| Código do ato (Integrador · Novo FCN) | Constituição | Pós-C7 · Integrador (RPA) | 🟢 travado, visto na gravação (RS39) | Par do evento 101 do outro lado do processo: no Integrador o que identifica o rito é o código do ato, não o nome. |
| Evento de enquadramento (JUCEMG) | Enquadramento de Microempresa | Pós-C7 · Integrador (RPA) | 🟢 travado, visto na gravação (RS39) | É o evento que faz a empresa nascer JÁ enquadrada como ME, no mesmo processo. Sem ele a empresa nasce sem enquadramento e o cliente precisaria de um 2º ato (e de uma 2ª taxa) — e é este evento que faz a guia da Junta custar R$281,08, porque a conferência cobra 2 atos. |
| IP do dispositivo de quem paga (`remoteIp`) | capturado na requisição do pagamento | E9 · Pagamento | 🔴 não implementado — depende da integração Asaas | Obrigatório na criação de cobrança por cartão no Asaas, e a doc é explícita: é o IP do DISPOSITIVO do pagador, não o do nosso servidor. Mandar o IP do servidor passa no schema e derruba a análise antifraude, que é o pior tipo de bug (silencioso e só visível na taxa de recusa). |
| Tipo de cobrança enviado ao Asaas (`billingType`) | CREDIT_CARD · PIX · BOLETO (o que a pessoa escolheu) | E9 · Pagamento | 🔴 não implementado — depende da integração Asaas | Débito NÃO entra: o enum de criação de cobrança do Asaas aceita BOLETO, CREDIT_CARD, PIX e UNDEFINED (DEBIT_CARD só aparece em resposta). Pra débito a doc manda redirecionar pro `invoiceUrl`, o que significaria tirar a pessoa do nosso app no meio do pagamento. |
| Forma de atuação (JUCEMG) | "Atividade Desenvolvida Fora do Estabelecimento" | C4 · Dados da empresa | 🟢 travado, corrigido 01/09 | 🔴 Estava documentado como "Internet" — ERRADO, valor decidido em 26/08 por raciocínio, antes de existir gravação. Os prints mostram "Atividade Desenvolvida Fora do Estabelecimento" marcada 2x, em 2 sistemas (tela 14 Viabilidade, tela 48 DBE), e a tela 48 exibe as 8 opções do campo com "Internet" entre elas, NÃO marcada: são opções distintas da mesma lista, não sinônimos. 3ª correção desta mesma família (as outras 2: "Sede"→Produtiva e metragem). Segue valendo enquanto o escopo for serviço 100% remoto |
| Tipo de unidade (JUCEMG) | "Produtiva" | C4 · Dados da empresa | 🟢 travado, corrigido 31/08 | 🔴 Estava documentado como "Sede" — ERRADO. Prints reais (Viabilidade e Integrador) confirmam "Produtiva": Sede/Filial nem aparece como opção fixa relevante pra uma constituição nova. Toda abertura nova (matriz) usa Produtiva |
| Metragem (m² do imóvel + m² da operação) | 20 m² (fixo) | C4 · Dados da empresa | 🟢 travado, resolvido 31/08 | 🔴 Estava "não implementado, sem decisão" — RESOLVIDO. Print real da Viabilidade mostra Área Total e Área Utilizada sempre preenchidas com 20,00 — mesmo valor usado em toda a gravação, virou padrão |
| Profissão (titular E qualquer sócio) | "Empresário" | C1 · Seus dados / C3 · Sócios | 🟢 travado, validado 31/08 pelo Pedro | Campo obrigatório no Integrador (Dados do Sócio/Administrador) pra qualquer sócio — nunca varia por atividade, então não gera dúvida útil pro cliente. Preenchido igual pra titular e sócio extra |
| Qualificação do representante (JUCEMG/DBE) | "49 - Sócio-Administrador" | C1 · Seus dados | 🟢 travado | Sempre o mesmo código no DBE (Identificação do Representante) — não existe outra qualificação possível pra quem está constituindo a própria empresa |
| Capital social | R$ 10.000,00 (fixo) | C4 · Dados da empresa | 🔒 travado, validado 31/08 pelo Pedro | 🔴 ATÉ 31/08 era campo editável (chips R$1k/5k/10k + valor livre) — a reunião Rua Satélite 38-40 decidiu travar em R$10.000 pra prestador de serviço. Deixou de ser pergunta: o app mostra o valor, não pede mais |
| Valor nominal de cotas | R$ 1,00 | C4 · Dados da empresa | 🟢 travado | Campo do Integrador (Dados da Matriz) sempre preenchido como R$1,00 — o capital social é dividido em quotas de R$1, nunca outro valor nominal |
| Data de assinatura da declaração / início das atividades | dia do preenchimento (nunca retroativa) | C7 · Nome / razão social (dispara a viabilidade) | 🟢 travado | Integrador não aceita data retroativa — sempre o dia em que o RPA roda o processo, pros dois campos (mesma data) |
| Acesso ao endereço | "Pedestre" | C4 · Dados da empresa | 🟢 travado | Campo da Prefeitura de BH (Dados Adicionais), sempre Pedestre pro nosso perfil de prestador de serviço remoto — nunca veículo leve/pesado |
| "Atividade exercida no local?" (principal e secundárias) | Não (sempre) | C0 · Sua atividade / C5 · CNAE secundários | 🟢 travado | Marcar Não em TODAS as atividades é o que habilita a opção "Escritório/sede administrativa" — se qualquer uma virasse Sim, a Prefeitura entenderia como comércio/loja física, errado pro nosso perfil |
| "Atividade é inócua ou virtual?" | Sim (sempre) | C4 · Dados da empresa | 🟢 travado | Pergunta do Licenciamento (Corpo de Bombeiros): atividade sem circulação de pessoas no local, sempre verdade pro nosso perfil 100% remoto/administrativo |
| "Edificação nova?" (regulação urbana, Prefeitura de BH) | Não (sempre) | C4 · Dados da empresa | 🟡 travado 01/09, é SUPOSIÇÃO — fila-Izabela | 3ª pergunta do Questionário de Regulação Urbana (tela 16), na MESMA tela que já produziu o indeferimento real. As outras 2 (apartamento, sócio reside) a gente já capta; esta não existia em nenhuma fonte. Fica interna e não vira pergunta porque "edificação nova" tem sentido técnico na Prefeitura (imóvel recém-construído, questão de habite-se) que o cliente não sabe responder — perguntar convida erro confiante, que é pior modo de falhar que errar sempre igual num caso raro. Risco residual: cliente em prédio novo sem habite-se cai em exigência. Validado por Pedro 01/09; confirmar com a especialista |
| Telefone enviado aos órgãos — SEM o 9º dígito (8 dígitos) | o telefone captado com 9 dígitos é enviado ao DBE/Integrador sem o 9 inicial do celular | RPA · envio ao DBE/Integrador (a captação no E6 não muda) | 🟢 travado 01/09 (Pedro) — regra de RPA, não de tela | Regra dita pela Izabela na gravação (ata, item 13) e confirmada nos prints (tela 51: telefone 94054307, 8 dígitos). Decisão do Pedro: **a captação continua com o 9 normal** — pedir telefone sem o 9 pro cliente seria estranho e daria erro de digitação. Quem tira o dígito é o robô, na hora de preencher o formulário oficial. Fica aqui porque é transformação de dado nossa, invisível pro cliente, e o dev precisa dela escrita |
| Valor da participação de cada sócio (R$) e quantidade de quotas | % informado × R$10.000 (o valor em R$ é também o nº de quotas, porque a quota é R$1) | C3 · Sócios (derivado, não perguntado) | 🟢 travado, documentado 01/09 | O app pergunta PERCENTUAL; os órgãos pedem VALOR EM REAIS (DBE tela 65: R$10.000,00 pro sócio único; QSA tela 70) e o Integrador pede o valor nominal da quota, R$1,00 (tela 95). A conversão existia na prática e não estava escrita. Como o passo do campo é 0,5%, o menor incremento dá 50 quotas exatas: nenhum percentual selecionável gera fração de quota, então não há arredondamento a tratar. ⚠️ Isso quebra se o capital deixar de ser R$10.000 ou o passo mudar |
| Regime de bens — tradução do rótulo pro valor da JUCEMG | "Separação total de bens" (nosso rótulo) → "Separação Convencional de Bens" (valor da Junta) | C1 · Seus dados / C3 · Sócios | 🟡 travado 01/09, com lacuna conhecida e aceita | O dropdown real do Integrador (tela 103) tem 5 regimes; o app oferece 4, por decisão do Pedro em 01/09 ("esse quinto, casamento acima de 70 anos, não faz sentido pra gente"). Falta a Separação Obrigatória, que é imposta por lei e não escolhida. Consequência aceita: quem estiver nesse regime marca "Separação total" e o contrato sai com a qualificação errada — caso raro, sem tela, resolvido no atendimento se aparecer |
| Sociedade de Propósito Específico? | Não (sempre) | C6 · Natureza jurídica | 🟢 travado | Cláusula do Contrato Núcleo — nenhuma empresa do nosso escopo (ME prestador de serviço comum) é SPE. Campo do contrato, não pergunta ao cliente |
| Capital Totalmente Integralizado em Moeda Corrente? | Sim (sempre) | C4 · Dados da empresa | 🟢 travado | Cláusula do Contrato Núcleo — o capital social (R$10.000, também travado) já entra integralizado, sem parcelamento |
| Tipo de contrato (Integrador) | Padrão · 15 cláusulas obrigatórias (sem anexo, sem cláusula extra) | Pós-C7 · Geração do contrato (RPA/Integrador) | 🟢 travado | 🔴 ACHADO-CHAVE (31/08): incluir anexo/procuração/cláusula extra no processo DERRUBA a elegibilidade ao Registro Automático (aviso visto ao vivo no print da JUCEMG) — por isso a opção de 15 cláusulas sem anexo é a única que usamos, nunca a de 7 cláusulas nem o contrato personalizado (upload) |
| Testemunhas (Contrato Núcleo) | Nenhuma (sempre) | Pós-C7 · Geração do contrato (RPA/Integrador) | 🟢 travado | Contrato padrão de 15 cláusulas não exige testemunha — campo sempre vazio, nunca preenchido |
| E-mail e telefone de contato (DBE/Integrador) | sempre o nosso (Legalizai), nunca o do cliente | DBE/Integrador · Dados para Contato | 🟢 travado | Evita que boletim de ocorrência (BO) ou notificação oficial da Receita/Junta chegue direto pro cliente por e-mail — a gente centraliza e repassa o que for relevante |
| Endereço de correspondência | sempre igual ao do estabelecimento | DBE/Integrador · Dados para Contato | 🟢 travado | Checkbox "igual ao do Estabelecimento" sempre marcado — nenhum caso do nosso escopo precisa de endereço de correspondência diferente |
| Natureza jurídica (SLU × LTDA) | SLU se sem sócio · LTDA se com sócio (automático, sem pergunta) | C6 · Natureza jurídica (REMOVIDA 31/08) | 🟢 travado, validado 31/08 pelo Pedro | 🔴 ATÉ 31/08 era pergunta ao cliente (recomendação editável, Leonan 24/08) — a reunião Rua Satélite 38-40 decidiu tirar a pergunta de vez: a regra (sem sócio→SLU, com sócio→LTDA) não tem exceção real no nosso escopo, então virou decisão de backend nos dois casos. Tela e rota `/dossie/natureza` removidas do app |
| Tipo de endereço (JUCEMG) — endereço fiscal Legalizai | "Endereço virtual" (fixo) | C4 · Dados da empresa | 🟢 travado, validado 31/08 pelo Pedro | Confirmado na gravação real (RS38): quando a empresa usa o endereço fiscal da Legalizai (não o do cliente), o valor sempre enviado à JUCEMG é "Endereço virtual" — nunca aparece como opção pro usuário, só se aplica ao caminho endereço-próprio ("proprio"/"coworking") |
| Requerente (emissão do DAE) | sempre o titular (sócio-administrador) | Pós-C7 · Emissão do DAE (RPA) | 🟢 travado | Quem solicita a taxa no Integrador é sempre a pessoa que está constituindo a empresa — não existe cenário de "outro requerente" no nosso fluxo |

## Nota de fonte

Gerado direto do campo `dados` de `flow-data.mjs` — reflete o que está **documentado como construído**, não necessariamente o que está validado em produção (ver campo `validado` de cada nó). Qualquer mudança de campo nessas telas precisa entrar em `flow-data.mjs` primeiro; rodar o gerador de novo atualiza esta nota sozinho.
