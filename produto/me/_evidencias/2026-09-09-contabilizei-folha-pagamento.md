---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: folha-de-pagamento
tags: [produto, evidencia, concorrente, folha, fopag, esocial, rubricas, api]
---

# 🔎 Evidência — Folha de Pagamento na Contabilizei (09/09/2026)

> ⚠️ **Foto com data, não decisão.** O nosso desenho vive em [[folha-de-pagamento]].
>
> 🎯 **Por que esta varredura existe:** o Pedro **não tem funcionários** e a aba parecia vazia. Pediu a varredura mesmo assim, apostando que a API entregaria o modelo. **Entregou, e foi das rodadas mais produtivas do dia.**
>
> **Método:** só leitura ([[_metodo]]). 🔒 Nenhum colaborador admitido, nenhuma folha fechada, nenhuma guia gerada.
> 🔌 **15 chamadas**, todas `GET`. Namespace novo: **`/api/fopag/`**.
> 🔒 Um dos payloads traz CPF, telefone e e-mail do Pedro, além de campos internos de CRM. **Aqui está a FORMA, nunca os valores.**
>
> **Rotas:** `sistema/#/colaboradores` · `sistema/#/folha`
>
> **Ligações:** [[folha-de-pagamento]] · [[pro-labore]] · [[_mapa-de-cruzamentos]] · [[compliance-e-rotinas]]

---

## 1. 🔴 O achado que decide o desenho: admitir NÃO é self-service

A tela `Colaboradores` tem busca por nome e dois botões: `IR PARA OS SÓCIOS` e `ADICIONAR COLABORADOR`.

Clicar em **`ADICIONAR COLABORADOR` não abre formulário nenhum.** Devolve um aviso em vermelho:

> **"Para adicionar mais colaboradores, por favor entre em contato com a nossa equipe."**

🔴 **O líder, com toda a automação que tem, NÃO deixa o cliente contratar alguém pelo app.** Admissão é atendimento humano.

✅ **E o catálogo à-la-carte confirma que é regra, não bug:**

| Serviço | Preço |
|---|---:|
| Admissão Retroativa | R$ 98,90 |
| Rescisão Retroativa | R$ 103,40 |
| Alteração na folha de pagamento (FOPAG) | R$ 98,90 |
| GFIP/DCTFWeb/eSocial Sem Movimento | R$ 71,90 |

🎯 **A leitura:** no produto deles, **folha é serviço, não funcionalidade**. O cliente **consulta**; o contador **executa**. A tela existe para dar visibilidade, não autonomia.

---

## 2. 🔑 606 rubricas de folha — a tabela completa, com as incidências

`GET /api/fopag/movimento/list` → **606 rubricas**

```ts
type Rubrica = {
  codigo: "0271"
  descricao: "1/3 Férias Proporc Trab Verde e Amarelo"
  naturezaMovimento: { id: "PROVENTO" | "DESCONTO" | "INFOMATIVA", descricao }
  tipoLancamento: "USUARIO"
  unidadeDeMedida: { id, descricao, sigla: "un"|"h"|"d"|"m"|"%" }
  visibilidade: "FOLHA" | "CADASTRO" | "AMBOS"
  habilitaQtde: boolean
  habilitaValor: boolean

  incideFGTS: boolean        // 🔑
  incideINSS: boolean        // 🔑 é isto que decide o FATOR R
  incideIRRF: boolean        // 🔑
  escrituraProlabore: boolean

  contaContabilCreditoId: "2.01.01.07.04"
  contaContabilCreditoDescricao: "Férias a Pagar"
  contaContabilDebitoId: "3.01.01.03.05.14"
  contaContabilDebitoDescricao: "…"
}
```

### A distribuição

| Dimensão | Valores |
|---|---|
| **Natureza** | Provento **390** · Desconto **207** · Informativa **9** |
| **Visibilidade** | AMBOS **321** · FOLHA **197** · CADASTRO **88** |
| **Unidade** | un **393** · h **93** · % **46** · d **38** · m **36** |
| **Incidências** | FGTS **314** · INSS **296** · IRRF **302** |
| `escrituraProlabore` | **2** |

🔑 **`incideINSS` é o campo que decide o Fator R.** 296 das 606 rubricas entram no numerador da folha. **Não é "tudo que se paga ao empregado": é o que tem incidência de INSS.** Nosso motor precisa dessa flag por rubrica, não de uma soma bruta.

🔑 **Cada rubrica carrega o PLANO DE CONTAS** (débito e crédito, com código e descrição). É a espinha do motor contábil: **toda linha de folha já sabe onde lançar**. Isso é o que faz a folha alimentar o Balancete/DRE sem trabalho manual.

### As 9 "Informativas" — o que aparece e não soma

`0819 Ajuda de Custo Plano de Saúde` · `0707 Auxílio Creche Informativo` · `0706 Auxílio Home Office Informativo` · `0663 Plano Odontológico` · `0219 Plano de Saúde` · `0808 Vale Transporte Informativa Tributável` · `0220 Vale-Alimentação` · `0218 Vale-Refeição` · `0217 Vale-Transporte`

🔑 **Benefício aparece no holerite e não entra na conta.** É a terceira natureza, e existe porque o funcionário precisa **ver** o benefício sem que ele vire base de cálculo.

⚠️ **Detalhe fiscal:** há `Vale Transporte Informativa` **e** `Vale Transporte Informativa Tributável` — duas rubricas para o mesmo benefício, conforme ele seja ou não tributável.

### 🔑 `escrituraProlabore`: só 2 rubricas, e não são as que eu esperava

```
0187  Plano de saúde - Pró-labore            → conta "Pró-Labore a Pagar"
0188  Plano odontológico - Pró-labore         → conta "Pró-Labore a Pagar"
(+ 0566 e 0567, versões "Dependente")
```

🔑 **`escrituraProlabore` não significa "isto é pró-labore": significa "isto bate na conta Pró-Labore a Pagar".** E as quatro são **descontos de plano de saúde e odontológico do sócio**.

🎯 **É a ponte entre benefícios e pró-labore:** o plano de saúde do sócio **sai do pró-labore dele**. Isso liga os itens `Meus Benefícios` e `Plano de Saúde` do menu ao [[pro-labore|motor de pró-labore]] — e explica por que eles vendem plano de saúde dentro do app de contabilidade.

⚠️ **E confirma uma separação de arquitetura:** as rubricas do pró-labore em si (`042 Prolabore` e `043 INSS Prolabore`, vistas no recibo em [[2026-09-09-contabilizei-pro-labore]]) **não estão nesta tabela**. **Folha CLT e pró-labore têm tabelas de rubrica separadas**, e só se tocam pelos descontos de benefício.

---

## 3. 🔑 O endpoint de enumeração

`GET /api/legado/enumeration/{tipo}` — genérico, por nome de enum.

`tipoDesligamento` devolveu **as modalidades de rescisão**:

```
SEM_JUSTA_CAUSA · POR_JUSTA_CAUSA · PEDIDO_DEMISSAO
TERMINO_PRAZO · TERMINO_CONTRATO
APOSENTADORIA_TEMPO · APOSENTADORIA_IDADE
APOSENTADORIA_INVALIDEZ_ACIDENTE · APOSENTADORIA_INVALIDEZ_DOENCA · APOSENTADORIA_INVALIDEZ · …
```

🔒 **Não fui além de `tipoDesligamento`.** Existe a tentação óbvia de adivinhar outros nomes de enum (`tipoContrato`, `categoriaTrabalhador`, `motivoAfastamento`), mas isso é **exatamente o que a regra do [[_metodo]] proíbe**: *"nunca endpoint adivinhado"*. Tentei o caminho legítimo — abrir o formulário de colaborador para ele carregar as enumerações sozinho — **e o formulário está bloqueado** (§1). Fica registrado como não coberto.

---

## 4. Os outros endpoints de folha

| Endpoint | Retorno nesta conta |
|---|---|
| `GET /api/fopag/colaborador/list` | `array(0)` |
| `GET /api/fopag/folha/listarFuncionarios?anoCompetencia&mesCompetencia` | `array(0)` |
| `GET /api/fopag/folha/getMesCompetencia` | `{ mes: "9", ano: "2026" }` |
| `GET /api/fopag/movimento/list` | `array(606)` |

🔑 **`getMesCompetencia` é a competência corrente vinda do SERVIDOR**, não calculada no front. Coerente com o padrão que já vimos (`mesFechado`, `acaoBotao`): **o servidor é dono do calendário fiscal.**

⚠️ **Aqui a lição de "tela vazia ≠ dado ausente" se inverte:** as listas estão realmente vazias porque o Pedro não tem funcionários. Mas a **tabela de rubricas**, que é o ativo de verdade, veio cheia mesmo sem nenhum colaborador. **O modelo existe antes do dado.**

---

## 5. 🔴 Achado colateral, e é da conta do Pedro

`GET /api/legado/pendencia/pendenciasEmpresa?cnpj=…` devolveu **3 pendências**, com este modelo:

```ts
tipoPendencia: {
  codigo, titulo, descricao,
  prazo: number,              // em DIAS
  confirmacaoManual: boolean,
  enviarEmail: boolean,
  linkVisualizar: string,
  idServicoAvulso: number|null   // 🔑 liga pendência a SERVIÇO PAGO
}
situacaoPendencia: { id: "FINALIZADO"|"PENDENTE", descricao }
dataLimite, formattedDataLimite, dataEnvioUltimoNotificacao
aceite, ticketZendesk, abreLinkVisualizarAoRegularizar
ltHistoricoPendencia
```

| cód | Título | Prazo | Situação | Limite |
|:--:|---|:--:|---|---|
| 44 | Termo de Ciência e Responsabilidade | 167 dias | Finalizada | 24/04/2026 |
| **43** | 🔴 **"Cadastre o PIS para ativar o pró-labore automático"** | 0 dias | **PENDENTE** | **12/12/2025** |
| 30 | Carta de Responsabilidade | 15 dias | Finalizada | 15/05/2026 |

🔴 **A pendência 43 está aberta há mais de 9 meses, e ela explica uma coisa que eu tinha anotado no primeiro teardown sem entender:** o recibo de pró-labore do Pedro mostra a coluna **`PIS/NIT` vazia**.

🔑 **O PIS/NIT é pré-requisito do pró-labore automático**, porque o eSocial (evento S-1200) exige o número para identificar o beneficiário. Sem ele, o valor é processado mas a identificação fica incompleta.

📌 **Vale o Pedro olhar.** Não é achado de concorrente: é pendência real na conta dele.

🔑 **`idServicoAvulso` no tipo de pendência** é a monetização dentro do modelo de dados: **uma pendência pode nascer já apontando para o serviço pago que a resolve.** Terceira vez que vemos isso (depois do `valorRecalculo` na guia e do `valorServicoAdicional` no informe).

⚠️ **E o payload traz campos internos de CRM** que não deveriam estar numa API de cliente: `rankingScore`, `scoreCredit`, `isExportadoCampanha`, `viuModalIndicacao`, `faturamentoAnualEstimado`. **Não reproduzo os valores.** Fica como observação de arquitetura: o objeto `empresa` deles é um só, e ele vaza para o front inteiro.

---

## 6. Defeitos anotados

| | O quê |
|:--:|---|
| 🐛 | **`INFOMATIVA`** — typo no **ID do enum**, não só no rótulo. Está gravado no dado e provavelmente no código cliente. Renomear agora quebraria compatibilidade |
| ⚠️ | `ADICIONAR COLABORADOR` é um botão que **existe, é verde, e só devolve erro**. Melhor seria não existir, ou dizer o que faz antes do clique |
| ⚠️ | Objeto `empresa` com **campos internos de CRM** exposto na API do cliente |

---

## ➡️ O que fazemos com isso

Esta nota **para aqui**. O desenho está em **[[folha-de-pagamento]]**.

## Links
[[folha-de-pagamento]] · [[pro-labore]] · [[_mapa-de-cruzamentos]] · [[compliance-e-rotinas]] · [[guia-de-imposto]] · [[HOME-produto]] · [[_metodo]]
