---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-10
fonte: Contabilizei
acesso: cliente-interno # contrato ASSINADO do Pedro, plano Padrão R$195
assunto: contrato
tags: [produto, evidencia, concorrente, contrato, juridico, escopo, precificacao]
---

# 📜 Evidência — Contrato integral da Contabilizei (10/09/2026)

> ⚠️ **Foto com data, não decisão.** O que a gente faz com isso vive no espelho de contrato (a construir) e no ADR [[decisoes-marca]].
>
> 🎯 **Por que esta varredura existe:** o Pedro vai basear o **nosso contrato** neste, com foco no plano R$195 (que a gente oferta a R$139). Pergunta que abriu o flow: *"no contrato tem explícito TODOS os serviços prestados, sendo eles pagos à-la-carte ou dentro da mensalidade?"*
>
> **Método:** só leitura ([[_metodo]]). 🔒 Nada aceito, nada assinado, nada cancelado. **Havia um modal pendente pedindo aceite de aumento de mensalidade e ele NÃO foi tocado.**
>
> **Rota:** `sistema/#/configuracao/contrato` (abas: Dados da empresa · Certificado digital · Dados de acesso · **Contrato de serviços** · **Aceites**)
>
> **Tamanho:** 74.700 caracteres normalizados. **11 cláusulas + 3 anexos.** Assinatura eletrônica registrada em **14/07/2026 18:54**, com trilha de IP, nome e CPF no rodapé (🔒 valores não reproduzidos).
>
> **Ligações:** [[2026-08-27-funil-4-etapas-contrato-completo]] · [[_catalogo]] · [[compliance-e-rotinas]] · [[HOME-produto]]

---

## 0. 🔴 O que esta captura corrige da captura de 27/08

A nota de 27/08 extraiu o contrato **de adesão pré-assinatura**, por print de funil, e pegou só as cláusulas polêmicas: `2.1 · 3.2–3.13 · 4.3 · 4.4 · 5.1 · 5.8 · 5.11 · 7.1 · 8.1 · 9.4 · 11.13`.

**Faltava exatamente a cláusula 1.** E era ali que a pergunta do Pedro morava.

⚠️ **Lição que já é regra do [[_metodo]] e se repetiu:** extrair "o que importa" de um documento é escolher o que ver. O contrato inteiro estava a **dois cliques** dentro da conta paga, numa aba dedicada, desde sempre. **A varredura de §7 (Plano e cobrança), que segue em 38%, teria achado isso.**

---

## 1. ✅ A resposta: o contrato ENUMERA o incluso, e NÃO enumera o avulso

### O incluso está em duas listas fechadas, uma por CNPJ

| Cláusula | Prestador | O que enumera |
|---|---|---|
| **5.2** (a–i) | Contabilizei **Tecnologia** | guias de imposto e pró-labore · SPED e obrigações acessórias mensais · DIRF, DIMOB, DMED · guias de FGTS, INSS e IRRF · folha e holerite · contrato de experiência · documentos de rescisão · orientação ao sindicato · recibo de férias |
| **5.3** (a–c) | Contabilizei **Contabilidade** | **a)** Escrituração Contábil: balancetes, balanço anual, DRE, **ECD** · **b)** Escrituração Fiscal: livros federais/estaduais/municipais · **c)** demais exigências **privativas de Contador** |
| **4.1** (a–c) | Tecnologia | consulta prévia de local + viabilidade de nome · Contrato Social / Requerimento de Empresário / DBE / inscrições, alvarás e licenças / enquadramento no Simples · protocolos digitais |

### E existe uma lista de EXCLUSÃO explícita

> **4.2 NÃO ESTÃO INCLUSOS** nas funcionalidades de software na Abertura de Empresa: **a)** protocolos físicos na Junta ou Prefeitura; **b)** registro em órgão de classe (CRA, CRC, CREA, OAB), exceto planos Expert; **c)** vistoria do corpo de bombeiros; **d)** projeto técnico para alvará; **e)** documentos específicos (PGRSS, CNES, Habite-se); **f)** consulta de marcas no INPI.

🔑 **A 4.2 é a melhor peça do contrato inteiro.** Lista nominal do que não entra. É o que mata a discussão de *"eu achei que estava incluso"* antes dela nascer. **A técnica vale copiar.**

### O avulso é jogado para fora do instrumento

> **1.8** *"Os módulos, funcionalidades e serviços adicionais poderão ser contratados separadamente, diretamente na plataforma... Em nossa plataforma você encontrará a descrição completa das funções e serviços disponíveis para contratação, com indicação dos prazos estimados para a conclusão, preços e formas de pagamento."*

> **5.4** *"Serviços contábeis assim como outras funcionalidades de Software, incluindo fiscais ou de folha de pagamento que não estejam descritos nas cláusulas 5.2 e 5.3 poderão ser contratados separadamente caso estejam listados entre os serviços e funcionalidades de Software adicionais disponíveis **no Anexo I**, e estão passíveis de cobranças, conforme **tabela de serviços adicionais**."*

🔴 **A remissão da 5.4 está quebrada.** O Anexo I é *"Termos e Condições dos Planos Experts"* — 4 seções, lido inteiro, **sem tabela de serviço e sem tabela de preço**. O mais próximo é o item 1.2 do Anexo I, que lista 6 módulos do Expert e devolve a bola pra *"tabela de preços vigente no momento da contratação"*, também não anexada.

🎯 **Conclusão da fronteira:**

```
INCLUSO  → listas fechadas, dentro do contrato (4.1 · 4.2 · 5.2 · 5.3)
COBRADO  → tabela unilateral, FORA do contrato, alterável a qualquer tempo (11.2 · 11.12)
LIGAÇÃO  → cláusula 5.4, que aponta pro anexo errado
```

---

## 2. 🔥 A contradição: ECD está nos dois lados

| Onde | O que diz |
|---|---|
| **Cláusula 5.3-a** (incluso na mensalidade) | *"transmissão da escrituração contábil digital para a RFB via **ECD** - Escrituração Contábil Digital e demais demonstrações contábeis obrigatórias"* |
| **Loja à-la-carte** (varredura 09/09) | *"Entrega de obrigações acessórias (DEFIS, DCTF, **ECD**, ECF)"* — **R$ 197,90** |

🔴 **A mesma obrigação, nomeada nas duas.** E a 5.2-a arrasta a DCTF junto, ao incluir *"transmissão de obrigações acessórias mensais como, por exemplo, o SPED"*.

⚠️ **Correção de registro nosso:** em 09/09 eu anotei em [[compliance-e-rotinas]] que *"a fronteira entre o incluso e o cobrado não está dita em lugar nenhum"*. **Estava errado por metade.** Ela está dita, com nome e letra; é a loja que a contraria.

🎯 **Para o nosso contrato:** se um item aparece na lista de incluso, ele **não pode** existir na loja. A checagem é mecânica e cabe em teste automatizado contra o [[_catalogo]].

---

## 3. 🔑 A arquitetura dos dois CNPJs, e por que ela é funcional

```
CONTABILIZEI CONTABILIDADE LTDA   34.346.830/0001-97 · CRC/PR 010346/O-2  → cláusula 5.3
CONTABILIZEI TECNOLOGIA LTDA      20.182.807/0001-08                      → cláusulas 4.1 e 5.2
Ambas: Rua Dr. Pedrosa 151, 16º andar, Curitiba/PR · foro Curitiba (11.13)
```

🔑 **O corte não é fiscal-cosmético, é por natureza do ato.** O que é **privativo de contador** fica na Contabilidade (escrituração contábil, escrituração fiscal, comprovante de rendimento). **Todo o resto vira funcionalidade de software:** guias, pró-labore, SPED, folha inteira, holerite, rescisão, férias.

🎯 **É esse corte que sustenta "abertura grátis" sem esbarrar em tabela de honorário do CRC:** a abertura é vendida como **licenciamento de software** (R$999, cláusula 3.2), não como serviço contábil.

✅ **Replicável do nosso lado** — ver [[entidades-legais]].

---

## 4. Os outros achados

### 4.1 🔴 A tabela de faixas do Padrão é OUTRA

Da tela do contrato do Pedro (plano Padrão R$195):

| Faixa de faturamento | Mensalidade |
|---|---:|
| R$ 0,00 até R$ 50.000,00 | **R$ 195,00** |
| R$ 50.000,01 até R$ 100.000,00 | R$ 344,00 |
| R$ 100.000,01 até R$ 1.000.000,00 | R$ 522,00 |
| acima de R$ 1.000.000,01 | R$ 818,00 |

🔴 **O vault registra `139 / 228 / 406 / 584 / 673 / 762` como "a tabela real"** ([[2026-07-30-tabela-real-faixas]]). **Aquela é a do Básico.** São grades diferentes por plano, e a do Padrão tem **4 faixas, não 6**. Corrigir o snapshot.

### 4.2 🔴 "Esse plano não permite a inclusão de funcionários"

Frase literal do bloco `VALORES DE COBRANÇA POR FUNCIONÁRIOS`, na tela do contrato.

🔑 Somada à **cláusula 11.5-c** (não atendem empresa com **mais de 20 empregados**), isso reposiciona o teardown de [[folha-de-pagamento]]: **folha não é só decisão de escopo nossa — é onde o líder também corta no tier equivalente ao nosso.** Explica o botão `ADICIONAR COLABORADOR` que só devolve erro.

### 4.3 🔑 Cláusula 11.5 — a lista de recusa de cliente

> A Contabilizei **não** presta serviços para empresas de comércio ou serviço que: **a)** tenham filiais ou venham a ter; **b)** exerçam importação/exportação; **c)** tenham mais de 20 empregados; **d)** realizem atividades industriais ou equiparadas; **e)** atuem com regime de caixa; **f)** façam cessão de mão de obra; **g)** figurem como sócio PJ em outra empresa.

E a **11.4**, o espelho positivo para comércio: só Simples + NF-e/NFC-e + inscrição estadual ativa + dentro da área atendida.

🔴 **Não temos equivalente.** Nosso gate valida CNAE e cidade; nenhum desses 7 é checado. Três deles (**sócio PJ**, **exterior**, **5+ sócios**) já existem como gate de tela ([[revisao-gates-saida-2026-08-29]]) mas **não como cláusula**.

### 4.4 Cancelamento tem aviso prévio de 30 dias

> **7.1** Aviso prévio de **30 dias**, de parte a parte. Durante a abertura: multa de **R$20**. Com fidelidade: **30% das parcelas restantes**.
> **7.2** Rescisão **sem** aviso prévio em 6 hipóteses, incluindo **não pagamento de 2 mensalidades consecutivas** e *"condutas que caracterizem desrespeito, assédio ou discriminação"*.
> **7.8** A partir do término, **cessa a responsabilidade técnica** (Resolução CFC 1590/2020).

🕓 **Os 30 dias de aviso prévio não estavam no vault.** A memória [[legalize-contrato-lider-achados]] só tinha a multa de 30%.

### 4.5 🔴 Cláusula 7.6 morde a nossa promo de lançamento

> **7.6** *"Se você tiver aproveitado de alguma outra condição promocional, a Contabilizei poderá cobrar..."*

🔑 Desconto promocional vira **crédito recuperável no cancelamento**. Nossa oferta de lançamento (R$79 nos 3 primeiros meses) precisa de uma decisão explícita: **o desconto é presente ou é adiantamento?** Não decidido.

### 4.6 ⚠️ Cláusula 11.3 contradiz o selo "Custo Zero"

> **11.3** *"Todos os valores gastos com materiais para execução de serviços, tais como livros, correios, carimbos, pastas de arquivos, CDS, cópias e etc. serão antecipados por nós e reembolsados por você, mediante apresentação dos respectivos comprovantes."*

Somado à **4.3-h** (cliente paga **todas** as taxas públicas), o checkout diz *"Nós pagamos as taxas obrigatórias do governo"* e o contrato diz o contrário. **A copy e o instrumento divergem.**

### 4.7 🔑 A aba "Aceites" — como eles mudam o contrato sem aditar contrato

> **1.6** *"A assinatura e confirmação de todo e qualquer termo disponível na Plataforma Contabilizei será de sua inteira responsabilidade."*

A aba lista os **Termos aceitos dentro do app**, cada um com trilha própria de **data, IP e user-agent**. Na conta do Pedro: **Carta de Responsabilidade 2025**, aceita em **19/01/2026**, e um segundo aceite.

🎯 **O contrato é o tronco; os Termos são galhos que crescem depois, um a um, com aceite clickwrap auditado.** É assim que o Termo de Ciência e Responsabilidade (aquele que transfere risco de distribuição de lucro, ver [[2026-09-09-contabilizei-pro-labore]]) entra na relação **sem** reabrir o contrato.

### 4.8 Cláusula 3 — o que a captura de 27/08 já tinha, confirmado no texto assinado

| | |
|---|---|
| **3.2** | Licenciamento p/ Abertura: **R$999**, isento se bundlado com Assessoria Mensal + fidelidade |
| **3.5** | Mensalidade **antecipada**, até o dia 15 |
| **3.6** | Atraso: multa **2%** + juros **0,033%/dia** |
| **3.7** | Reajuste anual por índice, com **30 dias** de aviso |
| **3.8–3.12** | Reajuste **adicional** por Reforma Tributária (IBS/CBS), limitado ao impacto líquido, com memória de cálculo |
| **3.13** | Empresa **inativa continua pagando** |
| **3.14** | Todos os tributos são do cliente |
| **3.15** | Falta de pagamento suspende serviço |

---

## 5. 📌 Dois itens da conta do Pedro (não são achado de concorrente)

| | O quê |
|:--:|---|
| 🔔 | **Modal pendente de aceite de aumento de mensalidade a partir de outubro**, justificado por IGP-DI não aplicado em anos anteriores. Oferece *"aceitar"* ou *"conversar com alguém"*. **Não tocado.** |
| 🔴 | Pendência **cód. 43 — cadastrar o PIS** — segue aberta desde 12/12/2025 (já registrada em [[2026-09-09-contabilizei-folha-pagamento]]) |

---

## 6. 🔌 Nota de método — API

**Zero endpoints novos.** O contrato inteiro vem **renderizado no HTML** da própria rota, dentro de um modal já presente no DOM; a leitura foi de texto, não de payload. Nenhuma chamada `/api/` foi disparada pelos dois botões (`visualizarContrato()` e `visualizarResumoContrato()`).

⚠️ **Limite técnico anotado:** a leitura do texto por `javascript_exec` trunca em ~1.000 caracteres por chamada. O caminho que funcionou foi `read_page` com `ref_id` do modal e `max_chars` alto — devolve a árvore inteira com os primeiros ~80 caracteres de cada parágrafo, o que dá o **mapa**, e aí só as cláusulas que interessam são puxadas na íntegra. **Vale como técnica para documento longo.**

---

## 7. 🎁 Bônus: eles têm um "resumo do contrato" e ele é bom

O botão `Ver resumo do contrato` abre uma versão mastigada, com esta abertura:

> *"Como desburocratizar é nosso norte, nós fizemos um resumo de nosso Contrato de Prestação de Serviços. Ele é apenas uma versão simplificada e não substitui ou anula a necessidade da leitura do Contrato completo, ok?"*

Estrutura: **SEUS DIREITOS** (4 bullets) · **SUAS OBRIGAÇÕES** (9 bullets) · uma frase por cláusula, 1 a 11 · uma frase por anexo.

🎯 **Isso é produto, não jurídico.** Custa pouco, reduz atrito e é coerente com "desburocratizar". **Candidato forte a copiar** — e no nosso caso o resumo pode nascer antes do contrato, servindo de espinha pra advogada redigir.

---

## ➡️ O que fazemos com isso

Esta nota **para aqui**. O próximo artefato é o **espelho de contrato**: cláusula deles à esquerda, decisão nossa à direita, com 🟢 copiar · 🔴 não copiar · 🕓 decidir — no formato que a advogada valida sem ler 74 mil caracteres.

## Links
[[entidades-legais]] · [[2026-08-27-funil-4-etapas-contrato-completo]] · [[_catalogo]] · [[compliance-e-rotinas]] · [[folha-de-pagamento]] · [[HOME-produto]] · [[_metodo]] · [[decisoes-marca]]
