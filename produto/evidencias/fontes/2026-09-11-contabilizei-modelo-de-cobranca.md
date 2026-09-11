---
tipo: referencia
status: congelado
dominio: evidencia
data: 2026-09-11
fonte: Contabilizei — painel logado (conta de produção do Pedro) + contrato literal
url: https://app.contabilizei.com.br/sistema/#/pagto-pendente
acesso: logado # somente leitura, apenas GET em endpoints que a própria página já chamou
assunto: modelo-de-cobranca
tags: [concorrente, pricing, api, billing, fonte-literal, congelado]
---

# 💳 FONTE — Como a Contabilizei modela a cobrança da mensalidade

> 🎯 **Pergunta que originou:** eles vendem a mensalidade como **assinatura** (subscription recorrente) ou em outro formato? Decisão de arquitetura em aberto com o programador.
>
> 🔒 **Método:** leitura do contrato literal já capturado ([[2026-09-10-contabilizei-contrato-LITERAL]]) + navegação read-only no painel logado. Apenas `GET`, mesma origem, em endpoints que a própria página já havia chamado. Nenhum `POST`/`PUT`/`DELETE`, nenhum endpoint adivinhado, nenhum botão de pagar/aceitar clicado.
>
> 🔒 **Dados pessoais redigidos.** CNPJ, razão social, endereço, e-mail, telefone e cartão apareceram nas respostas e **não** estão transcritos aqui. Só a forma dos objetos.

---

## 1. Veredito

**Não é assinatura. É emissão de FATURA por COMPETÊNCIA.**

A palavra "assinatura" não aparece uma única vez no contrato de 74.700 caracteres como nome do produto. Ela só aparece no sentido de firmar documento (cláusula 1.6, e o rodapé de assinatura eletrônica). O produto é nomeado em duas partes:

| Nome no contrato | O que é |
|---|---|
| **Assessoria Mensal** | a prestação de serviço contábil (cláusula 1.1-a) |
| **Licenciamento de Software** | o acesso à Plataforma (cláusula 1.1-b) |

E as duas são faturadas **em notas fiscais separadas, por duas empresas diferentes** (cláusula 3.5): o serviço pela Contabilizei Contabilidade, o software pela Contabilizei Tecnologia.

## 2. A prova no código

Objeto de domínio: **`fatura`**, não `subscription`.

```
GET /api/pagamentos/faturas/?cnpj={cnpj}&emCobranca=true
GET /api/pagamentos/faturas/status
GET /api/plataforma/dashboard/fatura-em-atraso/202609      ← chave = competência AAAAMM
GET /api/plataforma/mensalidade/pagamentos-pendentes/init
GET /api/plataforma/contrato/contratoPlanoPagamento
GET /api/plataforma/cartoes-de-credito/forma-pagamento
GET /api/plataforma/home/pagtoplano/planos-aplicaveis-empresa/{cnpj}
```

Uma fatura em aberto, com os campos vazios omitidos:

```json
{
  "competencia": { "identificador": 202609, "mes": 9, "ano": 2026 },
  "tipo": "COMPETENCIA",
  "tipoCompetencia": true,
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

🔑 **Três coisas que este JSON entrega:**

1. **A competência é a chave primária do negócio**, não a data. `202609` é um identificador inteiro, e a fatura tem `mes` e `ano` como campos próprios. O mesmo padrão aparece na rota `fatura-em-atraso/202609`.
2. **`plano: null`.** A fatura **não aponta para o plano**. O plano decide o valor no momento em que a fatura é gerada e depois some. Isso é o oposto de assinatura, onde a cobrança é filha do plano.
3. **`itens[]` com `tipo: "MENSALIDADE"`.** A mensalidade é **um item de linha entre outros possíveis**, não o objeto em si. É o que permite folha, faturamento extra e serviço avulso caírem na mesma fatura.

## 3. O ciclo de vida é de fatura, não de assinatura

`GET /api/pagamentos/faturas/status` devolve o enum inteiro:

```
PENDENTE · PENDENTE_CONFIRMACAO · EM_ABERTO · EM_ANDAMENTO · EM_ANALISE
EM_PROCESSAMENTO · CONFIRMADA · VENCIDA · CANCELADA · REEMBOLSADA
```

Dez estados, **todos de documento financeiro**. Não existe `ATIVA`, `PAUSADA`, `TRIAL` nem `INADIMPLENTE` — que seriam os estados de uma assinatura. O que existiria como "status da assinatura" mora em outro lugar: no **contrato**, com vigência de 12 meses renovável (cláusulas 2.1-a e 2.1-b).

## 4. A separação que explica o desenho

O contrato e a API concordam: são **três camadas independentes**.

| Camada | Onde vive | Duração |
|---|---|---|
| **Contrato** | `contratoEmpresa`, `contratoPlanoPagamento` | 12 meses, renovação automática ano a ano |
| **Plano** | `planos-aplicaveis-empresa/{cnpj}` | trocável a qualquer momento, define o preço |
| **Fatura** | `faturas/?cnpj=…` | uma por competência, valor congelado na emissão |

**É essa separação que sustenta o preço variável deles.** A cláusula 3.4 lista **10 variáveis** que mudam o valor do plano (faturamento, sócios, empregados, regime, forma de pagamento, domicílio, volume de notas e boletos, comércio × serviço, "outros fatores objetivos"). Nenhuma assinatura de valor fixo aguenta isso: o valor precisa ser **calculado no fechamento da competência**, e só então virar fatura.

📊 **O histórico da conta prova que varia de verdade:** Jan e Fev/2026 R$ 139,00 · Mar e Abr R$ 195,00 · Mai, Jun e Jul R$ 210,90 · Ago R$ 195,00 · Set R$ 195,00 pendente. Cinco valores diferentes em nove competências, no mesmo contrato e sem troca de plano deliberada.

## 5. A recorrência existe, mas é do MEIO DE PAGAMENTO

Não confundir com assinatura. `GET /api/plataforma/mensalidade/pagamentos-pendentes/init`:

```json
{
  "alertaMensalidadeAtrasada": null,
  "urlBotaoPagar": "[URL do gateway]",
  "cobrancaViaDebitoConta": false,
  "cobrancaViaAdyen": true,
  "mostrarBotaoPagar": true,
  "informacaoCobrancaAutomatica": "A cobrança será realizada automaticamente no cartão de crédito"
}
```

A fatura nasce **PENDENTE com botão PAGAR visível**, e a cobrança automática no cartão é uma **conveniência opcional por cima**, sinalizada em campo separado. Débito em conta é outra flag ainda. Ou seja: **a fatura existe primeiro; o meio de cobrança se pluga nela depois.** Numa assinatura de gateway é o contrário.

⚠️ **Dois gateways no mesmo fluxo:** `cobrancaViaAdyen: true` no pendente, e `idFormaPagtoIugu` no cartão salvo. Iugu e Adyen convivendo. Sinal de migração de gateway em andamento, ou de um roteamento por tipo de cobrança.

## 6. O que isso significa pra nossa decisão

🟢 **A favor de copiar o modelo de fatura por competência:**
- Preço por faixa de faturamento (nossa tabela EPP por RBT12) tem o mesmo problema deles: o valor só é conhecido no fim do mês.
- Folha a R$39 por colaborador ativo **na competência** é literalmente um item de linha variável. Em assinatura vira add-on com proration, que é a parte mais chata de qualquer gateway.
- Endereço fiscal a R$49 entra como mais um item na mesma fatura.
- A cláusula 6.3 da nossa minuta (lançar em fatura o que é até R$50) **presume que existe uma fatura**. Já escrevemos o contrato assumindo esse modelo.

🔴 **Contra, e é honesto dizer:**
- Assinatura pronta de gateway (Pagar.me, Stripe) resolve dunning, retentativa e atualização de cartão de graça. Com fatura própria, isso é código nosso.
- A fidelidade de 12 meses é do **contrato**, não da cobrança. Nos dois modelos ela precisa ser controlada fora do gateway de qualquer jeito.

## Links
- [[2026-09-10-contabilizei-contrato-LITERAL]] — cláusulas 1.1, 2.1, 3.4, 3.5
- [[2026-09-10-contabilizei-plano-contratado-LITERAL]] — as tabelas de faixa
- [[legalize-gateway-asaas-fora]] — Asaas descartado, Pagar.me em avaliação
