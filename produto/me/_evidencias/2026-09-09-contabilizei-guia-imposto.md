---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: guia-de-imposto
tags: [produto, evidencia, concorrente, das, darf, pagamento, parcelamento, api]
---

# 🔎 Evidência — a guia de imposto na Contabilizei (09/09/2026)

> ⚠️ **Foto com data, não decisão.** O nosso desenho vive em [[guia-de-imposto]].
>
> **Método:** só leitura ([[_metodo]]). 🔒 **Nada foi tocado que muda estado:** nem `Pagar`, nem `Recalcular` (que dispara pedido pro time deles), nem `Parcelar`, nem `Ativar débito automático`, nem os ✓/✗ de confirmação de pagamento. Apenas navegação entre abas e leitura de API.
>
> 🔌 **APIs:** rastreio ligado **antes** de navegar, como a regra manda. 12 chamadas, todas `GET`.
>
> **Rotas:** `#/impostos` (abas Este mês / Em atraso) · `#/historico-impostos`
>
> **Ligações:** [[guia-de-imposto]] · [[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[pro-labore]] · [[_matriz-dependencia]] (2.2, 2.4, 2.5, 2.7)

---

## 1. 🔌 O modelo de dados da guia — completo

`GET /api/plataforma/impostos/v4/impostos-a-pagar/init`

```ts
{
  exibirComoMeuImpostoFoiCalculado: boolean
  exibeMemoriaDeCalculo: boolean
  memoriaDeCalculo: {                    // 🔑 o painel "Cálculo inteligente"
    cenarioAtualSimples, cenarioAtualDarf, cenarioAtualTotalImpostos,
    cenarioIdealProlabore, cenarioIdealSimples, cenarioIdealDarf, cenarioIdealTotalImpostos,
    economia
  }
  exibeBannerPagamentoRecorrente: boolean
  alertaPendencias: { exibeAlerta: boolean, tipoPendencia: [] }

  abaEsteMes:       { totalBoletoOuCartao, totalDebitoAutomatico }
  abaEmAtraso:      { totalConfirmacaoPagamento, totalVencidos }
  abaParcelamentos: { emAndamento: [], ativos: [], historico: [] }   // 🔑 3ª aba

  impostos: [ Guia ]
}
```

### A `Guia`, campo a campo

```ts
{
  id: number
  aba: { id: "ESTE_MES" | "EM_ATRASO", secao: "BOLETO_OU_CARTAO" | "DEBITO_AUTOMATICO" | "VENCIDOS" }
  modalFeedback: "ESTE_MES_NAO_PAGO_NAO_VENCIDO" | "EM_ATRASO_NAO_PAGO" | …
  imposto: "DARF Unificado"
  identificadorImposto: "DARF_UNIFICADO" | "SIMPLES" | "TFE" | "DARF_UNIFICADO_ATIVACAO_FATOR_R"
  origem: "GUIAS"
  tipo: "GUIA"

  vencimento: { data, calculando: boolean, badge: "NENHUM"|…, estaVencido, venceMesAtual }
  valor: { total, status: "CALCULANDO"|null, mostrarMemoriaCalculo, diaDisponibilizacao }

  confirmacaoDePagamento: {
    tipo: "MANUAL" | …
    confirmado: "NENHUM" | "NAO_CONFIRMADO" | …
    desabilitado: boolean
    tooltipHover: string
    verificacaoPagamentoAutomatica: boolean    // 🔑 a auditoria, POR GUIA
    origem: null
  }

  acaoBotao: { id: "PAGAR" | "RECALCULAR" | "BAIXAR_GUIA", desabilitado: boolean }
  competencia: { mes, ano, periodo: 202608 }
  labelCompetencia: "Ago/2026"
  erroGeracaoGuia: boolean
  status: "AGUARDANDO_DISPONIBILIZACAO" | "VENCIDA" | "PAGO" | …
}
```

🔑 **Cinco decisões de arquitetura embutidas aí:**

| | O que revela |
|:--:|---|
| **`acaoBotao` é DADO** | o servidor decide qual botão aparece. O front não infere ação a partir de status |
| **`aba` tem `id` + `secao`** | a guia é agrupada em dois níveis, e a seção separa **boleto/cartão de débito automático** |
| **`verificacaoPagamentoAutomatica` é POR GUIA** | a auditoria não é global: cada guia sabe se é verificada automaticamente |
| **`modalFeedback` é enum de estado** | o texto do modal não é escolhido na tela, vem codificado do servidor |
| **`erroGeracaoGuia`** | **a geração da guia pode falhar**, e isso é estado de primeira classe, não exceção |

---

## 2. 🔑 A máquina de estado, observada em funcionamento

| Competência | Aba / Seção | `modalFeedback` | `status` | `valor.status` | Botão |
|---|---|---|---|---|---|
| Ago/2026 | ESTE_MES / BOLETO_OU_CARTAO | `ESTE_MES_NAO_PAGO_NAO_VENCIDO` | `AGUARDANDO_DISPONIBILIZACAO` | `CALCULANDO` | **PAGAR** (desabilitado) |
| Mai/2026 | EM_ATRASO / VENCIDOS | `EM_ATRASO_NAO_PAGO` | `VENCIDA` | `null` | **RECALCULAR** |
| Jun/2026 | EM_ATRASO / VENCIDOS | `EM_ATRASO_NAO_PAGO` | `VENCIDA` | `null` | **RECALCULAR** |
| Abr/2026 | (histórico) | — | `PAGO` | — | **BAIXAR_GUIA** |

🔑 **A ação muda com o estado, e o servidor decide:** `PAGAR` enquanto corrente → `RECALCULAR` depois de vencer → `BAIXAR_GUIA` depois de paga. **Um botão só, três significados.**

🔑 **`AGUARDANDO_DISPONIBILIZACAO` é um estado próprio.** A guia **existe antes de estar disponível** — por isso o `PAGAR` aparece desabilitado com o texto *"Disponível até o dia 15"*. Isso resolve a confusão de três conceitos que eu tinha anotado em [[2026-09-09-contabilizei-aliquotas]]: **disponibilização ≠ vencimento**.

Da tela, os **10 status** do filtro do histórico:
`Calculando · Pendente · Prorrogada · Postergada · Pagamento agendado · Verificando pagamento · Paga · Paga via parcelamento · Vencida · Recalculando`

---

## 3. 🔴 Dois impostos que não estavam no nosso radar

`GET /api/plataforma/impostos/v2/historico-impostos/guias?pagina=N` (4 páginas, 12 guias)

### `TFE` — Taxa de Fiscalização de Estabelecimentos

```
impostoDescricao: "TAXA DE FISCALIZAÇÃO DE ESTABELECIMENTOS"
competência Abril/2026 · vencimento 11/05/2026 · R$ 168,48 · PAGO
```

⚠️ **É taxa MUNICIPAL de BH, e entra na mesma lista das guias federais.** Casa com o chamado histórico visto no painel da empresa: *"[ABERTURA] VOCÊ POSSUI TAXA(S) DO MUNICÍPIO A VENCER"*.

🎯 **Isso amplia o escopo de "impostos" do app:** não é só DAS + DARF. Tem taxa municipal anual, com vencimento próprio, e ela é do nosso território (BH).

### 🔑 `DARF_UNIFICADO_ATIVACAO_FATOR_R`

```
competência Dezembro/2025 · vencimento 20/01/2026 · valorPrincipal R$ 11,00 · PAGO
```

**Existe um identificador de imposto cuja função declarada é ATIVAR o Fator R.** R$ 11,00 é 11% de R$ 100 — ou seja, um **pró-labore simbólico de R$100** declarado no 1º mês da empresa, cujo INSS abre a contagem de folha.

🔑 **A mecânica, se confirmada:** o Fator R olha 12 meses. Empresa nova não tem folha nenhuma, então nasceria no Anexo V. Lançar um pró-labore simbólico no mês 1 **põe folha no numerador desde o começo**.

🕓 🔴 **NÃO copiar antes de ratificar.** Pró-labore de R$100 fica **abaixo do salário-mínimo de contribuição** do INSS, e isso tem implicação previdenciária e possivelmente fiscal. **É observação, não recomendação.** Levar para a Larissa antes de qualquer coisa. Vale a regra da casa: **não deduzir regra de órgão**.

---

## 4. 💰 A monetização, embutida no modelo de dados

Todas as 12 guias trazem:

```json
"valorRecalculo": 15.9
```

🔑 **Não é o valor recalculado: é o PREÇO cobrado pelo recálculo.** R$ 15,90, que bate com o catálogo à-la-carte do vault (*"reemissão guia R$15,90"*).

⚠️ **O preço do serviço viaja dentro do objeto da guia.** É elegante para o front (o botão já sabe quanto custa) e revela a estratégia: **o recálculo é produto, não cortesia** — e ele só existe porque a guia venceu.

### O custo real do atraso, medido nas guias pagas

| Competência | Imposto | Principal | Pago | Diferença |
|---|---|---:|---:|---:|
| Abril/2026 | DAS SIMPLES | 720,00 | **760,46** | +40,46 |
| Março/2026 | DAS SIMPLES | 720,00 | **774,72** | +54,72 |
| Abril/2026 | DARF Unificado | 369,60 | **397,68** | +28,08 |

⚠️ **Juros e multa aparecem como `valorPago` > `valorPrincipal`**, sem linha própria. O cliente vê que pagou mais e **não vê quanto foi de multa**. É informação que existe e não é mostrada.

---

## 5. O ciclo completo do histórico

`GET /api/plataforma/impostos/v2/historico-impostos/init` → `{ emDia: false, quantidadeGuiasVencidas: 3 }`

🎯 **`emDia` é booleano de primeira classe.** A pergunta *"estou em dia?"* tem resposta direta na API, e é a nossa linha **5.1**.

Campos por guia no histórico, além dos já citados:

```ts
{
  valorPrincipal, valorPago, valorRecalculo,
  codigoBarras: string,               // a linha digitável
  fluxoGeracao: "NORMAL" | …,
  idParcelamento, quantidadeParcelas, nrPrestacao,   // vínculo com parcelamento
  mostrarConfirmacaoPagamento, confirmacaoPagamentoHabilitada, confirmacaoPagamento,
  ocultarGuia: boolean,
  modalDetalhes: { exibir, tipo, oqueE, porQueEImportante }   // 🔑
}
```

🎯 **`modalDetalhes` tem os campos `oqueE` e `porQueEImportante`** — um explicador por imposto. No payload **da guia** ele vem **todo nulo**.

✏️ **CORRIGIDO em seguida, no teardown da [[2026-09-09-contabilizei-central-rotinas|Central de Rotinas]]:** eu tinha escrito aqui que eles *"construíram o schema e não preencheram"*. **Errado pela metade.** Os textos **existem e são bons**, só que no payload de **rotinas**, não no de guias. O defeito real não é ausência de conteúdo: é **inconsistência entre telas** — quem chega pela Central de Rotinas lê a explicação do DAS, quem chega por `Impostos a pagar` não lê nada.

---

## 6. Parcelamento: existe no modelo, não está ativo

```
abaParcelamentos: { emAndamento: [], ativos: [], historico: [] }
GET impostos/parcelamento/banner-oferta-parcelamento → HTTP 204 (sem conteúdo)
```

🔑 **É uma terceira aba** (`Este mês` · `Em atraso` · `Parcelamentos`) que nunca apareceu na tela porque está vazia. E o parcelamento tem **três estados** (em andamento, ativos, histórico) e liga na guia por `idParcelamento` + `quantidadeParcelas` + `nrPrestacao`.

Da tela, os modais que confirmam o fluxo:
> *"Seu parcelamento foi cancelado. Estes parcelamentos foram cancelados. Os impostos que não foram quitados estão novamente em atraso, acumulando juros e multas."*

⚠️ **O `204` diz que a oferta de parcelamento é condicional** — banner que só aparece pra quem se qualifica.

---

## 7. `memoriaDeCalculo` — o comparativo, agora com nome

```ts
memoriaDeCalculo: {
  cenarioAtualSimples, cenarioAtualDarf, cenarioAtualTotalImpostos,
  cenarioIdealProlabore, cenarioIdealSimples, cenarioIdealDarf, cenarioIdealTotalImpostos,
  economia
}
```

🔑 **É o painel "Cálculo inteligente" de [[2026-09-09-contabilizei-pro-labore]], e o nome interno é `memória de cálculo`.** A estrutura confirma o que a tela mostrava: **dois cenários completos** (atual × ideal), cada um quebrado em DAS e DARF, mais a `economia`.

⚠️ **`exibeMemoriaDeCalculo: false` nesta conta**, porque o mês não teve faturamento. É condicional, não permanente.

🎯 **Este é o payload exato da nossa tela A2 ("por que pago isso")**, e ele já vem calculado do servidor. Nada de montar no front.

---

## 8. Defeitos e observações

| | O quê |
|:--:|---|
| ⚠️ | **Juros e multa não têm linha própria.** Aparecem como `valorPago > valorPrincipal`. O dado existe (a diferença é calculável) e não é mostrado |
| ⚠️ | **Explicador inconsistente entre telas.** `modalDetalhes` é nulo aqui, mas os mesmos campos vêm **preenchidos** no payload de rotinas. Mesma informação, uma tela tem e a outra não |
| ⚠️ | **`RECALCULAR` custa R$15,90** e o botão aparece assim que a guia vence, sem alternativa gratuita visível na lista |
| 🕓 | **`DARF_UNIFICADO_ATIVACAO_FATOR_R` de R$11,00** — mecânica observada, **não ratificada**. Pró-labore simbólico abaixo do mínimo de contribuição |

---

## ➡️ O que fazemos com isso

Esta nota **para aqui**. Desenho, o que copiamos e o que fazemos diferente estão em **[[guia-de-imposto]]**.

## Links
[[guia-de-imposto]] · [[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[pro-labore]] · [[emitir-nota-fiscal]] · [[HOME-produto]] · [[_metodo]] · [[_matriz-dependencia]]
