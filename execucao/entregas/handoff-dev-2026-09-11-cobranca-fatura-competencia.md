---
tipo: derivado
status: vivo
data: 2026-09-11
assunto: handoff-dev-cobranca-fatura-competencia
deriva_de: [2026-09-11-contabilizei-modelo-de-cobranca, 2026-09-10-contabilizei-contrato-LITERAL, minuta-contrato-me]
deriva_de_codigo: [app/src/lib/fiscal.ts]
tags: [execucao, handoff, dev, cobranca, billing, fatura, arquitetura]
---

# 🧾 Handoff dev — a cobrança é FATURA POR COMPETÊNCIA, não assinatura

> **Pra quem for implementar o billing.** Decisão travada pelo Pedro em 11/09. Este doc explica **o que decidimos, por que, e o que investigamos no concorrente pra chegar nisso.** A evidência bruta (JSONs, endpoints, transcrições) está em [[2026-09-11-contabilizei-modelo-de-cobranca]].

---

## 1. A decisão em uma frase

**Todo mês fechado vira uma FATURA daquela competência, com itens de linha.** A mensalidade é um dos itens, não o objeto em si.

Não é assinatura de gateway (`subscription`), onde o cliente assina um plano de valor fixo e o gateway cobra sozinho todo mês.

## 2. Por que não assinatura

Porque **o nosso preço não é fixo**, e assinatura só funciona bem quando é.

Três coisas nossas já decididas mudam o valor da conta de um mês pro outro:

| O que | Efeito na conta | Onde está travado |
|---|---|---|
| **Folha** | R$ 39,00 **por colaborador ativo na competência**, até 10 | ADR 10/09 · `CUSTOS.CUSTO_FUNCIONARIO` |
| **Endereço fiscal** | R$ 49,00/mês, só pra quem contratou | ADR 11/09 · `CUSTOS.ENDERECO_FISCAL` |
| **Faixa por faturamento (EPP)** | a mensalidade sobe por RBT12 | tabela no Anexo I da minuta |

Um cliente pode faturar R$ 99, R$ 148, R$ 187 ou R$ 265 em meses seguidos **sem trocar de plano nenhuma vez**. Colaborador entra e sai. Faixa sobe e desce.

Em assinatura, cada uma dessas variações vira um add-on com **proration** (rateio proporcional ao dia da mudança), que é a parte mais chata e mais bugada de qualquer integração de gateway. Em fatura por competência, é só mais uma linha no array.

🔑 **E tem um motivo que não é técnico: o contrato já foi escrito assim.** A cláusula **6.3** da nossa minuta diz que serviço de até R$ 50 é *"lançado na fatura da competência seguinte"*. **Fatura** é objeto do nosso contrato, com esse nome. Implementar assinatura obrigaria a reescrever cláusula que já está com a advogada.

## 3. O que fomos investigar na Contabilizei, e o que achamos

O Pedro é cliente pagante deles, então a investigação foi feita **na conta real, em modo somente leitura**: apenas `GET`, mesma origem, e só em endpoints que a própria página já tinha chamado. Nenhum `POST`, nenhum endpoint adivinhado, nenhum botão de pagar clicado.

### 3.1 Primeiro no contrato deles (74.700 caracteres, lidos na íntegra)

A palavra "assinatura" **nunca** aparece como nome do produto. Só no sentido de firmar documento. O que eles vendem tem dois nomes separados:

- **Assessoria Mensal** = o serviço contábil (cláusula 1.1-a)
- **Licenciamento de Software** = o acesso à plataforma (cláusula 1.1-b)

E a cláusula **3.5** deixa explícito: *"as notas fiscais serão emitidas em separado pelas duas empresas"*. Serviço por um CNPJ, software por outro. Assinatura única não faz isso.

A cláusula **3.4** lista **10 variáveis** que mudam o valor do plano deles: faturamento, sócios, empregados, regime, forma de pagamento (mensal/semestral/anual), domicílio, volume de notas, volume de boletos, comércio × serviço, e "outros fatores objetivos". É o mesmo problema que o nosso, em escala maior.

### 3.2 Depois nos endpoints do painel logado

```
GET /api/pagamentos/faturas/?cnpj={cnpj}&emCobranca=true
GET /api/pagamentos/faturas/status
GET /api/plataforma/dashboard/fatura-em-atraso/202609
GET /api/plataforma/mensalidade/pagamentos-pendentes/init
GET /api/plataforma/contrato/contratoPlanoPagamento
GET /api/plataforma/contrato/contratoEmpresa
GET /api/plataforma/cartoes-de-credito/forma-pagamento
GET /api/plataforma/home/pagtoplano/planos-aplicaveis-empresa/{cnpj}
```

O objeto de domínio deles chama **`fatura`**. Não existe `subscription` em lugar nenhum. E repare na terceira rota: a chave é **`202609`**, a competência, não uma data nem um id de assinatura.

### 3.3 A fatura em aberto, como ela volta da API

```json
{
  "competencia": { "identificador": 202609, "mes": 9, "ano": 2026 },
  "tipo": "COMPETENCIA",
  "status": "PENDENTE",
  "total": 195,
  "cobrancaViaCartao": true,
  "jaFechada": true,
  "plano": null,
  "itens": [
    { "descricao": "Mensalidade da competência Setembro/2026", "valor": 195, "tipo": "MENSALIDADE" }
  ]
}
```

**Três detalhes que valem a leitura com atenção, porque são exatamente o que a gente vai copiar:**

1. **`plano: null`.** A fatura **não guarda referência ao plano**. O plano decide o valor no instante da emissão e depois sai de cena. Em assinatura é o oposto: a cobrança é filha do plano, e mudar o plano mexe em cobrança futura. Aqui, fatura emitida é imutável.
2. **A competência é chave de negócio de verdade**, um inteiro `AAAAMM`, com `mes` e `ano` também como campos próprios (facilita agrupar e ordenar sem parsear data).
3. **`tipo: "MENSALIDADE"` está no ITEM, não na fatura.** A fatura é um envelope. É isso que deixa mensalidade, folha, endereço fiscal e avulso caírem juntos no mesmo documento.

### 3.4 O ciclo de vida (o argumento que fecha)

`GET /api/pagamentos/faturas/status` devolve o enum inteiro deles:

```
PENDENTE · PENDENTE_CONFIRMACAO · EM_ABERTO · EM_ANDAMENTO · EM_ANALISE
EM_PROCESSAMENTO · CONFIRMADA · VENCIDA · CANCELADA · REEMBOLSADA
```

Dez estados, **todos de documento financeiro**. Não tem `ATIVA`, `PAUSADA`, `TRIAL` nem `INADIMPLENTE`, que seriam os estados de uma assinatura. O que faria papel de "assinatura ativa" mora em outro objeto: o **contrato**, com vigência de 12 meses renovável.

### 3.5 A recorrência existe, mas é do MEIO DE PAGAMENTO

```json
{ "cobrancaViaAdyen": true,
  "cobrancaViaDebitoConta": false,
  "mostrarBotaoPagar": true,
  "informacaoCobrancaAutomatica": "A cobrança será realizada automaticamente no cartão de crédito" }
```

A fatura nasce **PENDENTE com botão PAGAR visível**, e a cobrança automática no cartão é **uma flag por cima**, não a natureza da coisa. Débito em conta é outra flag ainda.

> **A ordem importa:** a fatura existe primeiro, o meio de cobrança se pluga nela depois. Em assinatura de gateway é o contrário, e é por isso que assinatura engessa.

⚠️ Achado lateral: eles rodam **dois gateways ao mesmo tempo** (Adyen na cobrança pendente, Iugu no cartão salvo). Ou migração em curso, ou roteamento por tipo. Vale ter em mente que trocar de gateway depois é possível sem refazer o modelo, justamente porque o modelo não é do gateway.

### 3.6 A prova empírica

Histórico de pagamentos da conta do Pedro, mesmo contrato, sem troca deliberada de plano:

| Competência | Valor |
|---|---|
| Jan, Fev/2026 | R$ 139,00 |
| Mar, Abr/2026 | R$ 195,00 |
| Mai, Jun, Jul/2026 | **R$ 210,90** |
| Ago/2026 | R$ 195,00 |
| Set/2026 | R$ 195,00 (pendente) |

**Cinco valores diferentes em nove competências.** Se fosse assinatura de valor fixo, isso não aconteceria.

## 4. O que isso significa na prática pra implementação

### O modelo mínimo

```
Contrato   1 ──── N  Fatura   1 ──── N  ItemFatura
                          │
                          └──── N  Pagamento
```

- **Contrato**: cliente, plano vigente, data de início, fidelidade (12 meses), status.
- **Fatura**: `competencia` (inteiro AAAAMM), `status`, `total`, `vencimento`, `fechada`.
- **ItemFatura**: `tipo` (MENSALIDADE · FOLHA · ENDERECO_FISCAL · AVULSO · TAXA), `descricao`, `valor`, `quantidade`.
- **Pagamento**: método, id no gateway, data, valor.

### Regras que vêm do contrato, não da minha cabeça

| Regra | Cláusula |
|---|---|
| Vencimento no **dia 15**, pagamento antecipado | 3.4 |
| Serviço de **até R$ 50** entra na fatura da competência seguinte; acima disso exige aceite no ato | **6.3** |
| Mora: **multa de 2%** + **juros de 0,033% ao dia** sobre o valor em atraso | 3.5 |
| Empresa inativa continua devendo a mensalidade até pedir cancelamento | 3.12 |

⚠️ **Atenção na mora:** ela incide sobre **o total da fatura**, não sobre a mensalidade. Cliente com endereço fiscal e um colaborador fatura R$ 227, e a mora sai sobre os R$ 227.

### O que a gente perde e precisa escrever

🔴 Assinatura pronta de gateway entrega **dunning** (a régua de retentativa quando o cartão falha), **atualização automática de cartão vencido** e **retentativa inteligente** de graça. Com fatura própria, isso é código nosso. Não é motivo pra mudar de modelo, mas **precisa entrar na estimativa**, não ser descoberto depois.

🟢 O que **não** muda entre os dois modelos: a **fidelidade de 12 meses** é do contrato, e nenhum gateway controla isso. Ia ser código nosso de qualquer jeito.

### Ordem sugerida

1. `Fatura` + `ItemFatura` + o enum de status.
2. Job de fechamento de competência: lê o contrato, monta os itens, emite a fatura.
3. Só então plugar o gateway como **meio de pagamento da fatura**, com o botão PAGAR e a cobrança automática como flag.

**Nessa ordem o gateway vira detalhe substituível.** Se começar pelo gateway, ele vira o modelo, e aí trocar depois custa reescrita.

## 5. O que ainda não está decidido

| | O quê | Quem decide |
|:--:|---|---|
| 🔴 | **Qual gateway.** Asaas está fora (formato jogava a gente pro escopo PCI). Pagar.me em avaliação | Pedro |
| 🕓 | **Régua de dunning:** quantas retentativas, em que intervalo, e quando suspende o acesso | Pedro + advogada |
| 🕓 | **Suspensão de acesso por inadimplência:** nossa minuta **não tem** cláusula disso. O concorrente também não fixa prazo, e o silêncio dele não nos serve de modelo | advogada |
| 🕓 | Se o app emite **nota fiscal própria** por competência, e por qual dos dois CNPJs | Mauro |

## Links
- [[2026-09-11-contabilizei-modelo-de-cobranca]] — a evidência bruta, com os JSONs completos
- [[2026-09-10-contabilizei-contrato-LITERAL]] — cláusulas 1.1, 2.1, 3.4, 3.5
- [[minuta-contrato-me]] — cláusulas 3.5, 3.12, 6.3 e o Anexo I
- [[legalize-gateway-asaas-fora]] — por que o Asaas caiu
