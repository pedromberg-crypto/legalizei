---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: compliance-central-rotinas
tags: [produto, evidencia, concorrente, compliance, pendencias, rotinas, api]
---

# 🔎 Evidência — Central de Rotinas e pendências (09/09/2026)

> ⚠️ **Foto com data, não decisão.** O nosso desenho vive em [[compliance-e-rotinas]].
>
> **Método:** só leitura ([[_metodo]]). 🔒 **Nada tocado que muda estado:** nenhum `Confirmar`, `Aceitar as declarações`, `Estou ciente do termo`, `Salvar nova classificação` ou `Solicitar verificação de pendências`. Só navegação e leitura de API.
>
> **Rodada 1** — rota `#/central-de-rotinas`. 🔌 **4 chamadas**, 1 útil: `GET /api/plataforma/central-rotinas/init` (de onde saiu §2 e §3).
> **Rodada 2** (mesmo dia, a pedido do Pedro) — as 4 superfícies que a 1ª deixou de fora: declarações, relatórios contábeis, serviços adicionais e "estar em dia". 🔌 **11 chamadas**. Está em **§6**.
>
> **Rodada 3** (provocada pelo Pedro: *"não sei até onde vc chegou nela"*) — a **tela** em si, que as duas primeiras leram raso. Está em **§8**.
>
> ⚠️ **Por que houve 3 rodadas:** a 1ª percorreu **uma rota só** e parou num payload rico (lição: *payload rico não substitui varrer o flow*). A 2ª cobriu as 4 superfícies que faltavam. A 3ª descobriu que **eu tinha lido só o 1º dos 3 blocos da tela** e perdido o **"A Contabilizei faz por você"**, que é o dispositivo de confiança do produto deles. Lições no [[_metodo]].
>
> **Ligações:** [[compliance-e-rotinas]] · [[_mapa-de-cruzamentos]] · [[guia-de-imposto]] · [[_matriz-dependencia]] (5.1–5.8)

---

## 1. A tela, e a frase que amarra a cadeia

Duas abas: **`Pendências críticas`** · **`Outras pendências`**.

Abertura:
> *"Estas pendências podem afetar seu **informe de rendimentos** e gerar multas e penalizações como **desenquadramento tributário** e **inativação do CNPJ**."*

🔑 **Em uma frase eles ligam pendência → informe → desenquadramento → CNPJ inativo.** É exatamente a corrente do [[_mapa-de-cruzamentos]], dita ao cliente na primeira linha da tela.

Pendências visíveis na conta: `Pagamento de imposto pendente` (com `Ver pendência`) · `Confirmar ausência de estoque no período` · `Confirmar envio do contrato` · `Confirmar que não fez intermediações?` · `Alterar lançamento bancário`.

---

## 2. 🔑 A taxonomia completa: 21 pendências críticas + 7 outras

`GET /api/plataforma/central-rotinas/init` → `{ pendencias, rotinas, rotinasContabilizei }`

### As 21 críticas

| # | Tipo | Campos além de `possuiPendencia` |
|:--:|---|---|
| 1 | `pendenciaImportacaoExtrato` | `contasBancarias[]` |
| 2 | `pendenciaImposto` ✅ **ativa nesta conta** | — |
| 3 | `pendenciaCadastroContaBancaria` | `anoExercicio` |
| 4 | `pendenciaCartaResponsabilidade` | `conteudoCartaResponsabilidade` |
| 5 | `pendenciaAceiteTermoDebitos` | `conteudoAceiteTermoDebito`, **`prazoAceiteTacito`** |
| 6 | `pendenciaExigibilidadeDocumental` | `anoExercicio` |
| 7 | `pendenciaProcuracaoEcac` | `tipoPendencia`, `cnpjOutorgado`, **`diasParaVencimento`**, `dataVencimento` |
| 8 | `pendenciaMensalidade` | `meses[]` |
| 9 | `pendenciaCredencialPrefeitura` | `prazo` |
| 10 | `pendenciaCertificadoDigital` | `status`, **`diasParaVencimento`**, `dataVencimento` |
| 11 | `pendenciaContratoPrestacaoServico` | — |
| 12 | `pendenciaExtratoAplicacaoFinanceira` | `documentosPendentes` |
| 13 | `pendenciaContratoDeEmprestimo` | `documentosPendentes` |
| 14 | `pendenciaInformeDeRendimentoInvestimentos` | — |
| 15 | `pendenciaControleDeIntermediacoes` | — |
| 16 | `pendenciaAquisicaoAtivoImobilizado` | — |
| 17 | `pendenciaEstoque` | — |
| 18 | `pendenciaContratoDeFinanciamento` | — |
| 19 | `pendenciaContratoAFAC` | — |
| 20 | `pendenciaContratoDeInvestimentoAnjo` | — |
| 21 | `pendenciaConciliacaoFiscal` | — |

### As 7 "outras"

`pendenciaImportacaoExtrato` · `pendenciaCadastroContaBancaria` · `pendenciaProcuracaoEcac` · `pendenciaIntegracaoAExpirar` · `pendenciaIntegracaoExpirada` · `pendenciaCadastroProlabore` · `pendenciaTermoAdesaoTotalPass`

🔑 **Três tipos aparecem nas DUAS listas** (extrato, conta bancária, procuração e-CAC). A mesma pendência é crítica ou não **conforme o contexto** — provavelmente o quão perto do prazo. Criticidade é **estado**, não atributo do tipo.

### 🔴 A lista não é filtrada pelo perfil da empresa

Sete das 21 só fazem sentido em empresa muito maior ou mais complexa que o nosso ICP: **estoque · ativo imobilizado · empréstimo · financiamento · aplicação financeira · AFAC · investimento anjo**.

⚠️ **É por isso que um consultor de marketing sozinho recebe *"Confirmar ausência de estoque no período"*.** A pendência nasce pra todo mundo e o cliente precisa **negá-la ativamente**. É formulário genérico virando trabalho do cliente.

🎯 **Nosso ICP é estreito de propósito** (ME serviço, sem comércio, sem indústria). **A gente pode simplesmente não ter 7 dessas** — e isso não é limitação, é a vantagem do recorte.

### Três campos que valem sozinhos

| Campo | Onde | Por que importa |
|---|---|---|
| **`prazoAceiteTacito`** | aceite de termo de débitos | **silêncio vira aceite** depois de um prazo. É o mesmo mecanismo do DTE-SN (ciência presumida em 45 dias) aplicado a contrato |
| **`diasParaVencimento`** | certificado digital **e** procuração e-CAC | contagem regressiva, não só flag booleana |
| **`pendenciaCredencialPrefeitura`** | — | **a credencial do portal da prefeitura é pendência de primeira classe.** Liga com o BHISS e com a linha 8.8 |

⚠️ **`pendenciaProcuracaoEcac` existe e tem vencimento.** A gente decidiu em 05/09 que a procuração e-CAC **sai do nosso flow** porque o certificado A1 a dispensa (ratificado pelo Ademar). O líder trabalha com procuração **e** a monitora com contagem regressiva. **Não é contradição** — são arquiteturas diferentes; vale registrar que a nossa escolha nos poupa uma pendência inteira.

---

## 3. 🔑 `rotinas` — o calendário como dado

```ts
type Rotina = {
  tipo: "IMPORTACAO_EXTRATO" | "VENCIMENTO_MENSALIDADE" | "IMPOSTO"
  prazo: "2026-09-18"
  status: "REALIZADA" | "ATRASADA" | "EM_ABERTO"
  automatica: boolean            // 🔑 de quem é a vez
  tag: "AUTOMATICA" | "EM_ATRASO" | "SEM_TAG"
  propriedades: { cenario, … }   // varia por tipo
}
```

**9 rotinas na conta, cobrindo 3 competências.** Os enums observados:

| Campo | Valores |
|---|---|
| `tipo` | `IMPORTACAO_EXTRATO` · `VENCIMENTO_MENSALIDADE` · `IMPOSTO` |
| `status` | `REALIZADA` · `ATRASADA` · `EM_ABERTO` |
| `tag` | `AUTOMATICA` · `EM_ATRASO` · `SEM_TAG` |
| `cenario` | `ANTES_DIA_UM` · `NAO_GERADA` · `ENTRE_GERACAO_E_SEGUNDO_DIA_POS_VENCIMENTO` · `DEPOIS_DO_PRAZO` · `POS_SEGUNDO_DIA_DO_VENCIMENTO` |

🔑 **`automatica: boolean` é o "de quem é a vez", e eles resolveram igual a nós.** Extrato e mensalidade são `automatica: true`; **imposto é `false`** — é a vez do cliente. É o mesmo conceito que a gente já construiu no `_timeline-blocos` (`casa` × `cliente`), chegando por caminho independente. **Boa notícia: convergência confirma o desenho.**

🔑 **`cenario` é o que escolhe a COPY.** A mesma rotina fala diferente conforme o momento: antes do dia 1, gerada mas não vencida, dois dias depois do vencimento. **Cinco cenários, cinco textos**, decididos no servidor.

### O payload de uma rotina de imposto — e aqui está o explicador

```json
{
  "tipoImposto": "SIMPLES",
  "nome": "Vencimento da guia de Arrecadação do Simples Nacional (SIMPLES)",
  "tituloModal": "Guia de Arrecadação do Simples Nacional",
  "oqueE": "O Documento de Arrecadação do Simples Nacional (DAS Simples) é um imposto federal, gerado mensalmente, sobre o faturamento de microempresas (ME) e empresas de pequeno porte (EPP) que fazem parte do regime tributário Simples Nacional.",
  "porQueEImportante": "Caso o pagamento não seja feito, sua empresa terá que arcar com juros, multas e corre o risco de ser excluída do Simples Nacional. Além disso, ela pode ser incluída na lista da dívida ativa.",
  "cenario": "ENTRE_GERACAO_E_SEGUNDO_DIA_POS_VENCIMENTO",
  "tipoPagamento": "BOLETO_OU_PIX",
  "anoCompetencia": 2026, "mesCompetencia": 8,
  "idGuia": 5388996765810688,
  "pendenciasBloqueantes": []          // 🔑
}
```

E o do DARF:
> **`oqueE`:** *"O Documento de Arrecadação de Receitas Federais (DARF Unificado) é um imposto federal, gerado mensalmente, **sobre a folha de pagamento** de empresas do Simples Nacional e Lucro Presumido."*
> **`porQueEImportante`:** *"Caso o pagamento não seja feito, sua empresa terá que arcar com juros e multas, além de ficar em situação de inadimplência fiscal, o que pode gerar complicações legais."*

### 🔴 CORREÇÃO à evidência da guia

Em [[2026-09-09-contabilizei-guia-imposto]] eu escrevi que `modalDetalhes.oqueE` / `porQueEImportante` vinham **"todos nulos"** e que eles *"construíram o schema da nossa tese e não preencheram"*.

**Meia verdade, e a metade errada importa.** Os campos **estão preenchidos** — só que no payload de **rotinas**, não no de guias. Ou seja: **o explicador existe e é bom.** O que existe de fato é uma **inconsistência entre duas telas** — quem chega pela Central de Rotinas lê a explicação, quem chega por `Impostos a pagar` não lê.

✏️ Corrigido na nota da guia.

🔑 **`pendenciasBloqueantes: []`** — uma rotina pode ser **bloqueada por pendências**, e o vínculo é explícito no modelo. É o grafo de dependência entre "o que falta" e "o que precisa acontecer", como dado.

---

## 4. O que a tela empurra junto

- **Integração bancária:** *"Com nossa nova ferramenta de integração bancária, nós importamos automaticamente seus extratos bancários todos os meses."* + `Importar extrato manualmente` · `Integrar conta bancária`
- **Integração expirada:** *"Essa conta está com a integração bancária expirada. Renove agora para retomar a importação automática."* — e há `pendenciaIntegracaoAExpirar` e `pendenciaIntegracaoExpirada` como tipos próprios.

🔑 **Duas pendências só para o ciclo de vida da integração bancária** (a expirar × expirada) mostram o peso que o extrato tem no modelo deles. É a matéria-prima do fechamento contábil — e a porta da nossa linha 2.4.

---

## 6. 🔄 2ª rodada — as 4 superfícies que faltavam

> 🔄 **Completada a pedido do Pedro.** A 1ª rodada percorreu **uma rota só** (`#/central-de-rotinas`), achou um payload muito rico e parou. Ficaram de fora as linhas **5.1, 5.2, 5.5 e 5.6** do catálogo. Esta seção fecha isso.
>
> 🔌 **11 endpoints** capturados nesta rodada, todos `GET`.

### 🔑 O achado que mudou o método: o menu é uma API

`GET /api/plataforma/menu/get`

```json
{
  "id": "emitir-nfse", "type": "ITEM_MENU", "label": "Emitir NFs-e",
  "application": "painel-de-controle", "route": "emissor/listagem", "isNew": false
}
```

🔑 **Cada item traz `application` + `route`.** Isso é, de uma vez:
1. **O mapa de rotas do app inteiro** (não precisa mais adivinhar rota nem caçar no menu que fecha sozinho)
2. 🔑 **O estado da migração deles**, item a item: `application` diz se a tela vive no app **novo** (`painel-de-controle`) ou no **legado** (`sistema`)

**O placar da migração, extraído do menu:**

| Seção | No app NOVO | No LEGADO |
|---|---|---|
| **Notas fiscais** | Emitir NFs-e · Registrar notas tomadas | Como emitir · Importar notas · Consultar notas · **Cancelar nota** |
| **Movimentações** | Importar extrato · Lançamentos caixa · Conta bancária | — |
| **Impostos** | Histórico · A pagar · Simulador · Como foi calculado | — |
| **Relatórios** | — | **Declarações mensais · anuais · Balanço · DRE · Balancete · Razão · Diário** (7 de 7) |
| **Mensalidade** | Formas de pagamento | Meu plano · Faturas pendentes · Histórico |
| **Sócios** | Gerenciar · Informe de rendimentos | Ver recibo |
| **Folha** | — | Gerenciar funcionários · Consultar folha |
| **Serviços adicionais** | — | os 4 (todos → `servicos-disponiveis`) |

🎯 **O padrão fica nítido:** eles migraram **o que gera dinheiro e o que o cliente usa toda semana** (emissão, impostos, extrato) e **deixaram no legado tudo que é prova, documento e histórico** (relatórios, declarações, recibo, folha). É a mesma leitura do teardown de pró-labore, agora com o mapa inteiro: **decisão migra primeiro, documento fica pra trás.**

---

### 5.2 · Declarações — `sistema/declaracoes-mensais` e `/declaracoes-anuais`

Três abas: `DECLARAÇÃO MENSAL` · `DECLARAÇÃO ANUAL` · `INFORME DE RENDIMENTOS`. Filtro de competência (mês + ano, 2010–2029).

`GET /api/plataforma/declaracao/mensal/declaracoes/{mes}/{ano}`

```ts
[{
  tipo: { id: "PGDAS", sigla: "PGDAS", descricao: "PGDAS - Programa Gerador do Documento de Arrecadação do Simples Nacional" },
  situacao: "TRANSMITIDO",
  listaReciboGD: [ /* bytes do PDF */ ],
  mensagem: "recibo-dctfweb-64037271000102-202604.pdf"
}]
```

🔑 **As obrigações reais de um ME Simples serviço, confirmadas em conta de produção:**

| Periodicidade | Declaração | Situação |
|---|---|---|
| **Mensal** | **PGDAS** — Programa Gerador do DAS | `TRANSMITIDO` + recibo PDF |
| **Mensal** | **DCTFWeb** — Declaração de Débitos e Créditos Tributários Federais | `TRANSMITIDO` + recibo PDF |
| **Anual** | **DEFIS** | `TRANSMITIDO` + `Baixar recibo` |

✅ **Isso ratifica a [[2026-09-09-verificacao-auditoria-tributaria|verificação de fonte primária]]**, que dizia exatamente PGDAS + DCTFWeb mensais e DEFIS anual, e que ECD/ECF/EFD-Contribuições **não se aplicam**. Agora está visto em conta real, não só em documentação.

### 🔴 O defeito que quase me enganou

A tela abre mostrando **"Sem informações"**.

Meu primeiro impulso foi anotar "empty state morto", que é o que o nosso catálogo já dizia da linha 5.1. **Fui checar a API antes de concluir, e era outra coisa:**

```
GET …/declaracoes/9/2026  → array(0)     ← setembro, mês corrente, nada transmitido ainda
GET …/declaracoes/8/2026  → array(2)     ← agosto: PGDAS + DCTFWeb, transmitidos
GET …/declaracoes/4/2026  → array(2)
GET …/declaracoes/3/2026  → array(2)
```

🔴 **O dado existe e é rico. A tela é que abre filtrada no mês corrente**, que por definição ainda não tem nada transmitido.

🎯 **Consequência real:** a tela que deveria ser **a prova de que a contabilidade está funcionando** dá, como primeira impressão, *"Sem informações"*. É o oposto exato do trabalho que ela precisa fazer.

⚠️ **E é lição de método:** eu quase registrei "eles não têm o dado" quando o certo era "eles têm o dado e escondem no filtro padrão". **Foi a leitura de API que separou as duas coisas.**

---

### 5.6 · Relatórios contábeis — `sistema/relatorio-contabil/{TIPO}`

Cinco abas numa tela só: `DRE` · `DIÁRIO` · `RAZÃO` · `BALANCETE` · `BALANÇO`. Filtro de competência + ano, botão `Imprimir`, e a tabela `Descrição | 2025 | 2024`.

Rotas: `relatorio-contabil/BALANCO` · `/DRE` · `/BALANCETE` · `/RAZAO` · `/DIARIO`.

⚠️ **Tela print-first, do app legado**, com comparativo de dois exercícios. Coerente com o que o catálogo já classificava como 🔵 dispensável para o nosso ICP.

---

### 5.5 · Verificação de pendências, e o catálogo à-la-carte inteiro

`sistema/servicos-disponiveis` — **43 serviços** com preço em tela.

> *"Serviços adicionais que podem ser contratados para alterar informações sobre a sua empresa no contrato social… Além disso, também oferecemos documentos, relatórios, consultorias e regularização de pendências."*

**Os que cruzam direto com as nossas linhas:**

| Serviço | Preço | Nossa linha |
|---|---:|---|
| **Verificação de pendências** | **R$ 24,90** | 5.5 |
| Emissão de CND | R$ 35,90 | 6.3 |
| Reemissão de guia do Simples · INSS/IRRF · ISS em RPA | R$ 15,90 | 2.7 |
| **Entrega de obrigações acessórias (DEFIS, DCTF, ECD, ECF)** | **R$ 197,90** | 5.2 |
| **Alteração Pró-labore** | **R$ 98,90** | 4.x |
| Parcelamento de Débitos | R$ 135,40 | 2.x |
| Compensação de DAS | R$ 80,40 | — |
| ReDARF on-line | R$ 47,90 | — |
| **Obtenção/Renovação de alvará** | **R$ 416,00** + taxas | 8.4 |
| **CPOM/CEPOM** | **R$ 249,00** | 8.5 |
| Regularização de Inscrição Estadual | R$ 230,90 + taxas | 8.6 ⚪ |
| Alteração de porte ME/EPP | R$ 156,40 | 8.7 |
| Regularização PGDAS / processo administrativo | R$ 103,40 + taxas | — |
| Baixa OAB/Cartório (só RFB e Prefeitura) | R$ 299,90 + taxas | 8.2 |
| Baixa / encerramento | **R$ 1.406,00** e **R$ 1.999,00** (3x sem juros) | 8.2 |
| Declaração de faturamento · de ausência · de previsão | R$ 68,90 cada | 6.x |
| Demonstrações contábeis com índices de liquidez | R$ 120,90 | 5.6 |
| GFIP/DCTFWeb/eSocial sem movimento | R$ 71,90 | — |
| Rescisão retroativa · Admissão retroativa · Alteração FOPAG | R$ 103,40 / 98,90 / 98,90 | folha |

🔴 **Duas cobranças que mudam a leitura do que é "incluso" no plano deles:**

| | O quê |
|:--:|---|
| 🔴 | **"Entrega de obrigações acessórias (DEFIS, DCTF, ECD, ECF)" custa R$197,90.** As declarações aparecem como transmitidas na tela **e** existem como serviço pago no catálogo. Provavelmente o pago cobre caso fora do padrão (retroativo, empresa que chegou com atraso), mas **a fronteira não está dita em lugar nenhum** |
| 🔴 | **"Alteração Pró-labore" custa R$98,90**, enquanto a Gestão Inteligente muda o valor **sozinha e de graça** todo mês. A mesma ação é gratuita quando o robô faz e paga quando o cliente pede |

⚠️ Isso reforça o que o vault já registrava como **"escada + surcharge oculto"**: o preço de vitrine (R$195) é o piso, e o que sustenta a conta é este catálogo.

---

### 5.1 · "Estar em dia"

Não existe tela dedicada. O mais próximo é o `emDia: boolean` de `historico-impostos/init` (visto em [[2026-09-09-contabilizei-guia-imposto]]) e a Central de Rotinas.

🎯 **Continua sendo espaço vazio**, e a linha 5.1 do catálogo (*"Você está em dia ✓"*) segue válida como diferencial: **eles têm o dado e não têm a tela.**

---

### 💰 Achado colateral: o reajuste anual, com a copy inteira

Um modal apareceu em toda tela do app legado, bloqueando a leitura:

> **"O valor da sua mensalidade na Contabilizei vai mudar: De ___ para ___ a partir do mês de Outubro"**
> *"Puxa, Contabilizei, mas por que esse aumento agora?"*
> *"Nos últimos anos, nós optamos por não aplicar o aumento de mensalidade, mesmo ele estando de acordo com o **índice IGP-DI**. Isso porque estávamos focados em oferecer sempre mais, pelo valor justo que você já conhece."*
> *"Ao mesmo tempo em que nossos serviços evoluíram… nossos custos operacionais também cresceram e o país mudou. Para continuar melhorando a sua experiência, precisamos contar com a sua compreensão e aplicar esse novo valor."*
> *"É um prazer ter você como nosso cliente :)"*
> **"Você aceita o aumento de mensalidade ou prefere conversar com alguém para entender melhor?"**

✅ **Confirma em copy o que o vault já registrava** como "IGP-DI anual" no [[2026-07-21-dossie-plataforma-logada|dossiê]] e na nota de benchmark.

⚠️ **Três coisas para a nossa decisão de preço:**
1. O reajuste é **anunciado com antecedência e com índice nomeado** (IGP-DI). Isso é correto e vale copiar.
2. A justificativa é **custo deles**, não valor entregue ao cliente.
3. 🔴 O modal **bloqueia a tela** e força escolha binária (*aceitar* × *conversar com alguém*). Anunciar reajuste é certo; **prender o cliente fora do produto até ele responder, não**.

📌 Liga com a nossa decisão em aberto **7.7 — regra de reajuste anunciada**.

---

## 8. 🔄 3ª rodada — a TELA, que eu tinha lido raso

> 🔄 **09/09, provocado pelo Pedro:** *"estou aqui em uma página que n sei até onde vc chegou nela"*. Boa provocação. Nas rodadas 1 e 2 eu fui **fundo na API e raso na tela**: li os primeiros ~1000 caracteres, achei as 21 pendências e parei. **A tela tem três blocos e eu tinha visto um.**

### O que a tela realmente tem

```
┌─ Pendências críticas ──────────────────────────────┐
│  abas: [Pendências críticas] [Outras pendências]   │
│  ⛔ Pagamento de imposto pendente   [Ver pendência] │
└────────────────────────────────────────────────────┘
┌─ Central de rotinas ───────────────────────────────┐
│  ‹ Ago.   SETEMBRO 2026   Out. ›                   │
│  calendário com BOLINHA nos dias 5·15·18·21·28     │
│                                                     │
│  Suas rotinas de setembro                          │
│   ✅ 05/09  importar extratos   [Automática] [Ver]  │
│   🕐 15/09  mensalidade         [Automática] [Ver]  │
│   🕐 18/09  DARF Unificado                   [Ver]  │
│   🕐 21/09  DAS Simples                      [Ver]  │
│                                                     │
│  🔑 A Contabilizei faz por você                    │
│   🕐 15/09  eSocial              [Ver detalhes]     │
│   🕐 15/09  EFD-Reinf R-2099     [Ver detalhes]     │
│   🕐 15/09  EFD-Reinf R-4099     [Ver detalhes]     │
│   🕐 15/09  DCTFWeb              [Ver detalhes]     │
│   🕐 28/09  DESTDA               [Ver detalhes]     │
└────────────────────────────────────────────────────┘
```

### 🔑 O bloco que eu tinha perdido: "A Contabilizei faz por você"

**É o dispositivo de confiança do produto deles, e é o melhor achado desta rodada.**

Uma lista separada, com data e botão próprio, do que **o contador executa** — o trabalho que, sem essa tela, seria invisível. O cliente paga R$195/mês e normalmente não vê nada acontecer; aqui ele vê **cinco obrigações com prazo**.

🎯 **Isso é exatamente o que a nossa linha 5.1 ("você está em dia ✓") precisa ser**, e é mais forte do que a gente tinha desenhado: não é só *"está tudo certo"*, é ***"veja o que fizemos e quando"***.

### As 5 obrigações que a casa entrega, com o que cada uma exige

`rotinasContabilizei` — 15 itens = **5 obrigações × 3 competências**.

| Sigla | Prazo | Requisitos declarados |
|---|:--:|---|
| **ESOCIAL** | dia **15** | Certificado Digital **ou** Procuração |
| **EFD-REINF R-2099** (previdenciário) | dia **15** | Certificado Digital **ou** Procuração |
| **EFD-REINF R-4099** (não previdenciário) | dia **15** | Certificado Digital **ou** Procuração |
| **DCTFWEB** | dia **15** | Certificado Digital **ou** Procuração |
| **DESTDA** | dia **28** | Certificado, Procuração **ou Inscrição Estadual** |

🔑 **`requisitos` é campo de primeira classe.** Cada obrigação declara **do que ela depende para acontecer**. Quatro das cinco dependem de **certificado ou procuração** — o que transforma o certificado, na prática, em **pré-condição de quase toda a operação mensal**, não só da emissão de nota.

### As descrições, que são boas e explicam a cadeia

| | |
|---|---|
| **eSocial** | *"unifica as informações fornecidas pelo empregador em relação aos seus funcionários. Aqui na Contabilizei, declaramos informações de **funcionários, sócios, RPA e Folha de Pagamento**."* |
| **EFD-Reinf R-2099** | *"informações da empresa e **retenção de INSS em Notas Fiscais**"* |
| **EFD-Reinf R-4099** | *"retenção de **IRRF em notas tomadas**, aluguel para pessoa física, **auto retenção em serviços de publicidade e propaganda** e **distribuição de lucro**"* |
| **DCTFWeb** | *"gerada a partir das informações fornecidas no **eSocial e na EFD-Reinf**. Com base nesses dados, calcula os valores devidos de contribuições previdenciárias e outras retenções, **consolidando esses valores em um documento único**."* |
| **DESTDA** | *"simplifica a apuração e recolhimento do **ICMS** para empresas do Simples Nacional"* |

✅ **A descrição do DCTFWeb ratifica a cadeia do [[_mapa-de-cruzamentos]]** por fonte nova: **eSocial + EFD-Reinf → DCTFWeb → DARF**. A gente tinha isso da pesquisa; agora está dito pelo próprio produto.

🔑 **Duas coisas que a EFD-Reinf R-4099 revela e não estavam no nosso radar:**
1. **Notas TOMADAS geram obrigação** (retenção de IRRF). O cliente que **contrata** serviço também declara.
2. **A distribuição de lucro entra na EFD-Reinf.** Mais um cruzamento pró-labore/lucros → obrigação acessória.

### ⚠️ DESTDA na lista: mesmo padrão das 21 pendências

A empresa é consultoria em publicidade, **serviço puro**, e a DESTDA é declaração de **ICMS**. A [[2026-09-09-verificacao-auditoria-tributaria|verificação de fonte primária]] diz que prestador de serviço puro em BH **não tem Inscrição Estadual e está isento de DeSTDA**.

🔑 **Não é contradição: é a mesma lista genérica.** Repare que o próprio `requisitos` dela diz *"…ou **Inscrição Estadual**"* — que esta empresa não tem. **Ela é listada e nunca executada.** Terceira ocorrência do mesmo defeito: o líder mostra tudo para todos e deixa o cliente descobrir o que não se aplica.

✅ **Nossa pesquisa se mantém**, e agora com o motivo à mostra.

### O modal de detalhe, em 3 seções

```
🕐  Responsabilidade da Contabilizei
    O que é?
    Requisitos necessários para a entrega dessa rotina
    Por que é importante?
                                            [ Fechar ]
```

🎯 **Selo de responsabilidade + as três perguntas certas.** É a mesma estrutura do `modalDetalhes` que aparecia **vazio** no payload da guia ([[2026-09-09-contabilizei-guia-imposto]]) — aqui ela está **preenchida e boa**. Confirma pela segunda vez: **o conteúdo existe e não chega em todas as telas.**

### 🔴 O aviso que eles próprios dão

> **"A central está em evolução e algumas rotinas ainda não aparecem aqui. Te lembramos de rotinas importantes por e-mail e WhatsApp."**

⚠️ **Três leituras, e a terceira é a que importa pra gente:**
1. É honestidade, e é rara. Admitir que a tela está incompleta é melhor que fingir completude.
2. **A central NÃO é a fonte de verdade dos lembretes.** O canal real é **e-mail e WhatsApp**.
3. 🎯 **Isso testa a nossa decisão de 08/09** de que a central de avisos é *"o canal da casa"*. O líder tem a central **e** avisa por fora, porque a central não cobre tudo. **Se a nossa central for o único canal, ela precisa ser completa de verdade — ou a gente repete o problema com menos honestidade.**

### Os detalhes de interface que valem

| | O quê |
|---|---|
| **Calendário navegável** com `‹ Ago.` e `Out. ›`, **bolinha nos dias com rotina** | dá a forma do mês de relance, e o dia 5/15/18/21/28 saltam |
| **Pill `Automática`** azul só nas rotinas da casa | é o `automatica: boolean` renderizado. Quem **não** tem pill é vez do cliente |
| **Ícone de status por linha** (✅ feita · 🕐 pendente) | estado antes do texto |
| **Duas listas separadas** | "Suas rotinas" × "A Contabilizei faz por você". A separação é o produto |

### `Outras pendências`

Aba vazia nesta conta, coerente com a API (as 7 estão todas em `possuiPendencia: false`).

---

## 9. Observações

| | O quê |
|:--:|---|
| 🔴 | **Lista de pendências não filtrada por perfil**: 7 das 21 não se aplicam a ME serviço, e o cliente precisa **negar ativamente** ("confirmar ausência de estoque") |
| ⚠️ | **Explicador inconsistente entre telas**: rico na Central de Rotinas, nulo em Impostos a pagar |
| 🔑 | **Criticidade é estado, não tipo**: 3 tipos aparecem nas duas listas |
| 🔑 | **`prazoAceiteTacito`**: silêncio vira aceite. Mesmo mecanismo do DTE-SN, aplicado a contrato |
| ✅ | **`automatica: boolean`** confirma, por caminho independente, o "de quem é a vez" que a gente já construiu |

---

## ➡️ O que fazemos com isso

Esta nota **para aqui**. O desenho está em **[[compliance-e-rotinas]]**.

## Links
[[compliance-e-rotinas]] · [[_mapa-de-cruzamentos]] · [[guia-de-imposto]] · [[emitir-nota-fiscal]] · [[pro-labore]] · [[HOME-produto]] · [[_metodo]] · [[_matriz-dependencia]]
