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
> **Rota:** `#/central-de-rotinas` · **API:** `GET /api/plataforma/central-rotinas/init`
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

## 5. Observações

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
