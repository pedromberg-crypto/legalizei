---
tipo: hub
status: vivo
data: 2026-09-14
assunto: pendencias
tags: [sistema, pendencia, decisao, fila, meta]
---

# ☎️ Tudo que está aberto — a lista de quem chamar

> ⚠️ **Esta nota é uma VISTA, não uma quarta fonte.** Ela reúne num lugar só o que já vive em [[acionaveis]], [[fila-validacao-humana]], `execucao/processos/_persona.mjs` e nas evidências. **A fonte continua sendo cada um deles** — se divergir, quem manda é a origem. Existe porque o Pedro precisa ver a lista inteira para chamar as pessoas certas, e isso estava espalhado em quatro lugares.
>
> **Legenda:** 🔴 **bloqueia** algo hoje · 🟡 **espera pessoa** (não bloqueia, mas trava decisão) · ⚪ **construção nossa**, é só fazer · ✅ **resolvido** · ⏸️ **item velho**, a realidade do código já mudou e só falta riscar.
>
> 🔢 **Os números são corridos de 1 a 69 e não reiniciam por pessoa** — servem para o Pedro referenciar (*"o 32 fica assim"*). ⚠️ **Número resolvido não se reaproveita:** quando um item fechar, ele vira ~~riscado~~ com a decisão ao lado em vez de sumir, e os demais **mantêm o número**. Renumerar quebraria toda referência feita em conversa.

---

## 📞 1 · ADEMAR (Junta / registro)

Responde em minutos, e a regra de ouro é **não deduzir regra de órgão** ([[legalize-regra-de-orgao-nao-se-deduz]]).

| # | | O que perguntar | Por que importa | Fonte |
|:--:|:--:|---|---|---|
| **1** | 🟡 | **Qual a base legal da retroação dos efeitos do registro, e qual o prazo exato?** O Termo da JUCEMG diz *"Efeitos: 11/12/2025"* para ato registrado em 12/12. A regra dos ~30 dias existe; o artigo não foi confirmado | Decide qual data alimenta o 1º DAS, o RBT12 e o Fator R — e o relógio que o app precisa contar | `D4` |
| **2** | 🟡 | **O texto literal da Cláusula 8ª do contrato padrão** (assinatura isolada × conjunta). O que está na nossa tela foi **deduzido** da conversa de 01/09 | É a redação que a pessoa vai assinar de verdade | [[fila-validacao-humana]] |
| **3** | 🟡 | **Com 2+ CNAEs, como o contrato lista as atividades?** Não temos caso real para ver a forma | Objeto social de quem tem secundárias. Hoje o template erra por excesso | [[2026-09-13-contrato-social-persona-zero]] |

---

## 📞 2 · MAURO (sócio / contador responsável)

| # | | O que perguntar / decidir | Por que importa | Fonte |
|:--:|:--:|---|---|---|
| **4** | 🔴 | **Qual o risco concreto de transmitir pró-labore com a qualificação cadastral PENDENTE?** Na conta real: `FALTA DADOS`, PIS não informado, **9 competências já transmitidas assim** | A DCTFWeb é **confissão de dívida irretratável**. E o cliente não sabe: só aparece no JSON | `S1` |
| **5** | 🟡 | **`salarioBaseIRRF` vem ZERO em todas**, inclusive nas de R$3.360 — base declarada zero, em vez de base calculada com imposto zero | Se for campo vazio, nosso motor não pode copiar: a base alimenta eSocial e DCTFWeb | `S7` |
| **6** | 🟡 | **A `dataAdmissao` do sócio é 01/12/2025, onze dias antes de a empresa existir.** Escolha ou erro? | É a data que decide a **competência do primeiro pró-labore** | `S8` |
| **7** | 🟡 | **A nota diz "Anexo: 5" e declara 6,00% na mesma linha.** Anexo-de-origem × efetivo pós-Fator R? | Se for isso, nossa tela resolve com uma palavra | `C8` |
| **8** | 🟡 | **Qual o risco real de ficar meses sem pró-labore no início**, e qual a tese do escritório hoje? | A persona zero passou 3 meses assim. Não pagar **trava o numerador do Fator R** (caixa) | `L4` |
| **9** | 🟡 | **ME unipessoal: aprovação anual de contas precisa de ata registrada?** | Decide se vira processo no app ou fica invisível | `L2` |
| **10** | ✅ | ~~**Nosso preço**~~ → 🟢 **TRAVADO 14/09 (Pedro).** Plano ME = **R$139/mês**. Duas ofertas, ambas das **3 primeiras competências**: **R$79** (campanha/lista de espera) e **R$99** (lançamento); depois vira R$139. **12 meses de fidelidade assinada em contrato** em todos. | ⚠️ Confirma o que [[estado-atual]] já dizia desde agosto: o registro de 10/09 (*"coorte travada por 12 meses"*) era **erro meu**, e a minuta já fora corrigida em 11/09. 🔑 Nosso mecanismo tem a **mesma forma** do líder; a diferença é o destino da reversão (**R$139 anunciado** × R$195 nunca anunciado) — então **a copy precisa mostrar o preço final na mesma tela da promoção**. | — |
| **11** | ✅ | ~~**Certificado digital: terceirizar ou emitir?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Terceirizado**, custo **R$209**. **Incluso no plano ME**; no **plano MEI é pago pelo usuário**. | Fecha o custo do ME e a cláusula do MEI. | — |
| **12** | ✅ | ~~**InfoSimples: preço por consulta e limite**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **InfoSimples confirmado** como fornecedor. | O volume de requisições será calculado mais à frente — não bloqueia agora. | — |
| **13** | ✅ | ~~**Flow #2: certificado pro ME sem certificado**~~ → 🟢 **TRAVADO 14/09 (Pedro).** Mesma regra do **11**: incluso no ME, pago pelo usuário no MEI. | Sem custo nem fidelidade extra no ME. | — |
| **14** | 🟡 | **Flow #2: cobrar antes do TTRT?** É cobrar por algo que não controlamos | SLA? reembolso? | idem |
| **15** | ✅ | ~~**Reguladas**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Waitlist, e não atendemos no MVP.** | Divergência consciente com o líder (que atende e pede a carteira depois). Fica como está. | — |
| **16** | ✅ | ~~**DAE JUCEMG**~~ → 🟢 **RESOLVIDO 14/09 — a fila estava velha.** O valor real é **R$281,08**, da **guia real** (print 125 da gravação da JUCEMG). | Já travado em `app/src/lib/fiscal.ts` como `DAE_JUCEMG`, usado no E7 e coberto por teste e2e. A disputa R$268,51 × R$288 morreu em 01/09. Nem 282. | — |

---

## 📞 3 · LARISSA (fiscal)

| # | | O que perguntar | Por que importa | Fonte |
|:--:|:--:|---|---|---|
| **17** | 🟡 | **Os 7 pontos fiscais** — Fator R meses 2–12 · CPP-no-DAS no numerador · FS12 caixa · citações CFC · lista CNAE · DEFIS · taxas BH | [[perguntas-larissa-fiscal]] | [[fila-validacao-humana]] |
| **18** | 🟡 | **Os 91 CNAEs duvidosos**, em 7 baldes com pergunta fechada cada | [[limpeza-260-servico]] | idem |
| **19** | 🟡 | **Natureza jurídica: SLU × LTDA** — nossa regra diz "solo→SLU", o CNPJ real do Pedro saiu **LTDA** num caso solo | Se SLU é LTDA de sócio único (206-2), o guard-rail do N15 está errado | idem |
| **20** | 🟡 | **Famílias de swap CNAE** — 3 entram limpas; tráfego pago e white-label são de menor confiança | [[cnae-fiscalmente-otimo]] | idem |
| **21** | 🟡 | **Pró-labore de R$100 abaixo do mínimo de contribuição** — implicação previdenciária. 🔴 **não copiar antes de ratificar** | Apareceu na conta real e está no motor | [[2026-09-09-contabilizei-guia-imposto]] |

### 📚 Citações a conferir em fonte primária (com ela ou sozinho)

| # | | O que | Risco |
|:--:|:--:|---|---|
| **22** | 🟡 | **Resolução CFC "1.590/2020"** (carta de responsabilidade / transferência) | possível **citação trocada** — as refs do próprio Gemini citam CFC 987/2003 e 1493/2015. Usada no flow #2 |
| **23** | 🟡 | **"Evento 232"** (Alteração do Contabilista) | conferir no Coletor Redesim oficial |
| **24** | 🟡 | **COSIT 17/2021** (FS12 regime de caixa) | o alerta 🟡 do N18 **não deve ser exibido** até verificar |

---

## 📞 4 · ADVOGADA

| # | | O que | Fonte |
|:--:|:--:|---|---|
| **25** | 🟡 | **A minuta do nosso contrato ME** (16 cláusulas) foi enviada e aguarda retorno | [[minuta-contrato-me]] |
| **26** | 🟡 | **Quem assina o Termo de Compromisso do Alvará** — o cliente ou nós? É decisão de **risco**, não de UX | [[2026-09-13-documentos-municipais-da-abertura]] |
| **27** | 🟡 | **A largura da nossa procuração e-CAC** — a do líder é de 5 anos e inclui **confissão de débitos** | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| **28** | 🟡 | **Aviso prévio de 30 dias** no contrato do líder — comparar com a nossa minuta | [[2026-09-10-contabilizei-contrato-integral]] |

---

## 🧠 5 · PEDRO (decisão de produto e de negócio)

| # | | O que decidir | Por que agora | Fonte |
|:--:|:--:|---|---|---|
| **29** | ✅ | ~~**Informar o PIS na plataforma do líder**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **O PIS nunca foi pedido em lugar nenhum** — nem no onboarding do líder, nem na constituição real que abrimos na JUCEMG. Então **não é campo de abertura**: entra como dado que o app coleta **depois da entrada**, já dentro do produto. | 🔑 Isso **explica** a qualificação cadastral pendente do líder: ele nunca coletou. Não resolve o **4** (o risco de ter transmitido 9 competências assim segue com o Mauro), e reforça o **55** (exibir a pendência como estado de tela). | `S1` |
| **30** | ✅ | ~~**P2.3 — como o lucro entra nos cálculos sem extrato?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** 🔑 **A pergunta se parte em duas, e só uma era de verdade.** **(1) MOSTRAR: não mostramos.** Nada de painel de "lucro disponível" — o líder também não mostra, e sem conciliação (**31**) qualquer número seria errado. **(2) DECLARAR: obrigatório.** O lucro é **declarado pelo cliente**, num campo, com prazo mensal, e vai pra **EFD-Reinf**. Não é inferido, calculado nem conferido por nós. Retirada acima do que a contabilidade suporta cai no **32** (empréstimo ao sócio). | 🔑 **O Pedro perguntou *"eu não tive isso na Contabilizei"* — e ele teve, só não viu:** estava atrás do Termo de Ciência que ele aceitou (*"até o dia 15 de cada mês"* · *"multa de responsabilidade do cliente"*). A **Lei 15.270/2025** tirou o lucro da invisibilidade anual e fez dele obrigação **mensal**. A responsabilidade tem instrumento pronto: **Carta CFC 1.590/2020 art. 3º** — sem a assinatura do cliente o contábil não fecha. ⏳ **Sobra só o prazo** (dia 15 como o líder, ou o nosso). ⚠️ A Lei 15.270 veio por citação em tela de concorrente: quer o texto legal ou o ok da **17** (Larissa) antes de virar tela. | `B1` · `_persona.mjs` |
| **31** | ✅ | ~~**Conciliação bancária: temos ou não?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Não temos, e não entra agora.** ⏳ Fica um estudo dedicado aberto (*"precisamos entender melhor o que é isso"*) antes de qualquer reabertura. | 🔴 **Não desempata o 30.** Sem conciliação, a pergunta *"de onde sai o lucro sacável?"* continua sem resposta — e o caminho do meio (mostrar "Caixa"/"Lucro disponível" por competência) segue **proibido**, porque produz cliente sacando lucro que não existe. | `B1` |
| **32** | ✅ | ~~**Retirada sem lucro apurado vira empréstimo ao sócio?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Copiamos o líder:** lança em *Créditos com Pessoas Ligadas* (ativo), deixa lá até devolver, **sem bloquear e sem avisar**. | Resolve sem tutelar — mesma doutrina do **INFORMAR, nunca TUTELAR** ([[legalize-trava-persona-produto]]). | `C1` |
| **33** | ⚪ | **Lucro acumulado se mostra sem o porquê?** A DRE real cai **R$5.650,70** entre abril e julho sem nenhuma venda perdida. → 📌 **Hipótese do Pedro (14/09): é proporcionalidade entre os meses** (rateio/competência), não perda de venda. **Conferir na DRE real** antes de virar regra. | Painel que mostre "seu lucro" exibe queda que o cliente não causou. Se a hipótese fechar, a resposta de produto é **nomear o motivo na própria linha**, não esconder a queda. | `C2` |
| **34** | ✅ | ~~**Cancelamento de nota deixa rastro contábil?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Não deixamos rastro. Não armazenamos em banco.** Igual ao líder. | ⚠️ Assume o custo conhecido: cliente que pergunta *"cadê a nota 4?"* não acha resposta no relatório. Aceito. | `C3` |
| **35** | ✅ | ~~**"Você pagou R$X de multa este ano" entra no produto?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Não entra agora** — *"falar multa dessa forma assusta"*. | 🔑 É decisão de **tom**, não de dado: o número existe no livro e continua existindo. O que fica proibido é o **carimbo acusatório**; um lembrete de vencimento com consequência nomeada (**54**) segue valendo. | `B4` |
| **36** | ✅ | ~~**O app FORÇA definir pró-labore no dia 1?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Sim: o app força o pró-labore já na primeira competência.** | Trava o numerador do Fator R desde o mês 1 e mata o buraco da persona zero (3 meses sem retirada). ⚠️ **Não fecha o 8** — a tese fiscal do escritório sobre ficar meses sem pró-labore continua com o Mauro, e o **21** (pró-labore abaixo do mínimo) segue 🔴 não-ratificado. | `L3` |
| **37** | ✅ | ~~**A obrigação societária anual entra no mapa?**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **Entra.** *"Não é o caso da persona zero, mas é persona que atenderemos."* Inventário + balanço + 4 meses pra deliberar. | 🔑 **Primeira vez que a persona zero é explicitamente insuficiente como régua.** Vira categoria nova no `/processos` (hoje não está em nenhuma das 8) e conversa com o **9** (ata registrada em ME unipessoal — Mauro). | `L1` |
| **38** | ✅ | ~~**Prazo de fidelidade**~~ → 🟢 **TRAVADO 14/09 (Pedro).** **12 meses, como o líder.** | Confirma o que o **10** já travou e o que a minuta ([[minuta-contrato-me]]) já diz. Sem divergência a corrigir. | idem |
| **39** | ⏸️ | **Promessa quebrada** — 🔍 **a fila estava velha (14/09).** O `b1.teaser` que prometia economia **foi removido em 21/07** (v0.5.0) e virou `b1.resumo`: mostra o **imposto** da faixa, não a economia, com carimbo de que varia conforme o pró-labore. **Sem número prometido, não há promessa a quebrar.** A persona `promessa-quebrada.json` sobreviveu como **teste de invariância**, não como risco. → Pergunta que resta pro Pedro: *fecha assim, ou queremos uma tela de reconciliação quando a estimativa do ENCAIXE erra pra baixo?* | Terceiro caso de item velho na fila (depois do **16**). | idem |
| **40** | ⏸️ | **`FISCAL.TEASER_PISO = 0.5`** — 🔍 **a constante NÃO EXISTE MAIS (verificado 14/09).** Removida junto com a função `teaser()` em 21/07; `grep` em `app/src/lib/fiscal.ts` e no motor não acha nada. Era o piso que separava "estimativa honesta" de promessa quebrada (o real precisava ser ≥ 50% do prometido). **Sem promessa, não há piso.** → Só espera o *ok* do Pedro pra riscar de vez. | Mesma raiz do **39**. | idem |
| **41** | ✅ | ~~**De onde vieram os R$15,90 a mais em mai/jun/jul**~~ → 🟢 **RESPONDIDO 14/09 (Pedro): é o à-la-carte do líder.** **Mantemos o mesmo valor neste início.** | 🔑 Confirma a tese do dossiê: a camada à-la-carte é **receita oculta** que não aparece no preço anunciado ([[legalize-contabilizei-dossie-coverage]]). Decisão nossa é **copiar o valor**, não o silêncio: precisa aparecer na fatura por competência ([[legalize-cobranca-fatura-competencia]]). | `B7` |
| **42** | ✅ | ~~**Qual guia atrasou entre abril e junho**~~ → 🟢 **RESPONDIDO 14/09 (Pedro): foram os impostos** (DAS), *"com toda certeza"*. | R$229,85 de multa em 3 competências seguidas, na conta real. Alimenta o **54** (lembrete com consequência nomeada) — que agora é a **única** resposta de produto, já que o **35** tirou o contador de multa da tela. | `B8` |
| **43** | ✅ | ~~🔒 **Confirmar que o repositório é privado**~~ → 🟢 **CONFIRMADO 14/09 (Pedro).** Repositório **privado**, acesso só a membros de confiança da equipe. | Libera manter dado pessoal em claro no vault, como o `CLAUDE.md` já previa. ⚠️ A condição continua sendo o **acesso**: replicar/compartilhar fora da equipe volta a exigir debate. | — |

---

## 🔨 6 · DEV (só construir, nada a decidir)

Nenhum destes espera pessoa. Entram no handoff.

| # | | O que | Fonte |
|:--:|:--:|---|---|
| **44** | ⚪ | Guardar `dataAssinatura` **e** `dataRegistro` como campos distintos | `D1` |
| **45** | ⚪ | **Guardar a TERCEIRA data**: admissão do sócio (01/12), que alimenta folha e eSocial | `S2` |
| **46** | ⚪ | Contar o relógio dos ~30 dias até o registro | `D3` |
| **47** | ⚪ | **Fator R não pode zerar em 1º de janeiro** — janela de 13 meses cruzando o exercício (provado: 16.564 ÷ 43.910 = 37,72%) | `B2` |
| **48** | ⚪ | Pró-labore em 3 contas: bruto no custo · 11% INSS na retenção · líquido na obrigação | `B3` |
| **49** | ⚪ | Decidir o sinal do saldo: `crédito − débito` ou convenção contábil | `B5` |
| **50** | ⚪ | Relatório contábil é **geração assíncrona** — estado de espera de verdade | `B6` |
| **51** | ⚪ | Relatório devolve **acumulado do exercício**, nunca o mês isolado | `C4` |
| **52** | ⚪ | Balanço e Balancete são **um contrato**, dois modos de exibição | `C5` |
| **53** | ⚪ | Modelar o plano de contas a partir das **16 reais**, em português de gente | `C6` |
| **54** | ⚪ | Lembrete de vencimento com consequência nomeada | `C7` |
| **55** | ⚪ | Exibir pendência de qualificação cadastral como **estado de tela** | `S3` |
| **56** | ⚪ | Se a rubrica carrega conta contábil, **alguém confere onde ela caiu** | `S4` |
| **57** | ⚪ | `quantidade` não pode ter duas semânticas (30 dias × 11 por cento) | `S5` |
| **58** | ⚪ | *"Não houve pró-labore"* ≠ *"não existe folha"* | `S6` |
| **59** | ⚪ | **Estourar o teto contraria declaração assinada** no contrato social, e exige alteração contratual | `L5` |
| **60** | ⚪ | **Checkbox de ciência** de que o administrador não está impedido (hoje a pessoa assina sem nunca ser perguntada) | `L6` |
| **61** | ⚪ | Corrigir **"16 cláusulas, não 15"** em 3 documentos | `X1` |
| **62** | ⚪ | **Objeto social: encurtar o template** e tratar a lista vazia (hoje gera *"…podendo também exercer ."*) | [[2026-09-13-contrato-social-persona-zero]] |
| **63** | ⚪ | **Espelhar o DTE no app** — "a Receita te escreveu" | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| **64** | ⚪ | **Vigia de ciclo longo**: Alvará vence 15/12/2030, certificado 22/12/2026 | [[2026-09-13-documentos-municipais-da-abertura]] |
| **65** | ⚪ | **Alteração cadastral tem prazo de 30 dias e multa** (Decreto Municipal 17.175/2019) | idem |

---

## 🕓 7 · Sem dono ainda

| # | | O que | Fonte |
|:--:|:--:|---|---|
| **66** | 🟡 | 🔴 **"Em breve o acesso ao e-CAC será desativado"** — migração para acesso exclusivo pelo gov.br. **Muda a infraestrutura em que a nossa procuração se apoia** | [[2026-09-13-ecac-procuracao-e-caixa-postal]] §5 |
| **67** | 🟡 | **Licenciamento sanitário ESTADUAL** — a dispensa municipal manda verificar na Vigilância estadual e para aí. Caminho não percorrido | [[2026-09-13-documentos-municipais-da-abertura]] |
| **68** | ⚪ | `BALANCETE_PERIODO` e `LIST` — tipos de relatório que existem no código do líder e não estão no menu | [[2026-09-14-dre-balancete-razao-diario]] |
| **69** | ⚪ | A lista do Razão por conta **não abre**: a URL deles tem `undefined` | idem |

---

## 📊 O placar

| | Quantos | Quais |
|---|---:|---|
| ✅ **Resolvidos** | **17** | **10–13** · **15** · **16** (bloco comercial) · **29** · **31** · **32** · **34** · **35** · **36** · **37** · **38** · **41** · **42** · **43** (bloco de produto) — todos travados pelo Pedro em 14/09 |
| ⏸️ **Fila velha, só riscar** | **2** | **39** · **40** — o teaser que prometia economia foi removido em 21/07; esperam o *ok* do Pedro |
| 🔴 **Bloqueiam hoje** | **2** | **4** (risco de transmitir com qualificação pendente) · **30** (P2.3, o lucro sem extrato) |
| 🟡 **Esperam pessoa** | 21 | 1–9 · 14 · 17–28 · 66–67 |
| ⚪ **Só construir / conferir** | 27 | **33** (conferir a hipótese da proporcionalidade) · 44–65 · 68–69 |
| **TOTAL** | **69** | |
| **Pessoas a chamar** | **4** | Ademar (1–3) · Mauro (4–9, 14) · Larissa (17–24) · advogada (25–28) |

📉 **As duas rodadas de 14/09 tiraram 17 itens da mesa.** A primeira fechou o **bloco comercial** (preço, certificado, InfoSimples, reguladas, taxa da Junta); a segunda fechou o **bloco de produto** — o que o app mostra, força, esconde e cobra. Restam **7** perguntas com o Mauro (4–9 e 14), todas **fiscais e societárias**.

🔑 **A leitura:** sobrou **um** bloqueio de verdade — o **30** (como o lucro entra na conta sem extrato). E ele ficou **mais apertado**, não menos: o **31** confirmou que **não haverá conciliação bancária**, então a resposta do 30 tem que sair sem extrato, de propósito.

🧭 **O que a rodada de produto revelou, junto:** as decisões 32, 34, 35 e 43 apontam todas pro mesmo lugar — **informar sem tutelar e sem assustar**. Retirada sem lucro não bloqueia, nota cancelada não deixa rastro, multa não vira contador na tela. O contrapeso é o **54** (lembrete de vencimento com consequência nomeada), que agora carrega sozinho o peso de avisar antes do estrago. ⚠️ Vale vigiar se a soma vira **produto que nunca diz não** — a régua é [[legalize-trava-persona-produto]].

## Links
[[acionaveis]] · [[fila-validacao-humana]] · [[_dossie-contabilizei]] · [[PERSONA]] · [[constituicao]] · [[decisoes-marca]] · [[HOME]]
