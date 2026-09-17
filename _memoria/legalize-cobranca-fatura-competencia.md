---
name: legalize-cobranca-fatura-competencia
description: "Billing é fatura por competência com itens de linha, não assinatura de gateway; decidido 11/09 e corroborado na API do concorrente"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-10T20:11:38.916Z
---

**A cobrança do app é FATURA POR COMPETÊNCIA, não assinatura de gateway.** Travado pelo Pedro em 2026-09-11, com o programador. Todo mês fechado vira uma fatura daquela competência, com **itens de linha**; a mensalidade é um dos itens, não o objeto.

**Why:** o preço não é fixo. Folha a R$39 **por colaborador ativo na competência**, endereço fiscal a R$49 só pra quem contratou, e faixa por RBT12 fazem a conta variar mês a mês **sem troca de plano**. Em assinatura cada variação vira add-on com *proration*. E a cláusula **6.3** da minuta já diz que serviço de até R$50 é "lançado na fatura da competência seguinte": **fatura já é objeto do nosso contrato**, então assinatura obrigaria a reescrever cláusula que está com a advogada.

**How to apply:** modelo é `Contrato 1─N Fatura 1─N ItemFatura` (+ `Pagamento`). Competência é inteiro `AAAAMM`. Fatura emitida é imutável e **não guarda referência ao plano** — o plano decide o valor na emissão e sai de cena. Gateway entra por último, como meio de pagamento **da fatura**, com botão PAGAR e cobrança automática como flag; nessa ordem ele vira detalhe substituível. Regras vindas do contrato: vencimento dia 15, mora de 2% + 0,033%/dia **sobre o total da fatura** (não sobre a mensalidade), inativa continua devendo.

🔴 **Custo assumido:** dunning, retentativa e atualização de cartão vencido viram código nosso. Precisa estar na estimativa.

📊 **Corroborado no líder** (investigação read-only na conta paga do Pedro, só `GET` em endpoints que a página já chamava): "assinatura" nunca aparece como nome de produto nos 74.700 caracteres do contrato deles; o objeto de domínio da API é `fatura`; a rota do atraso é `/fatura-em-atraso/202609`, chaveada pela competência; a fatura volta com `plano: null`; o enum tem 10 estados **todos de documento financeiro**, nenhum ATIVA/TRIAL. Empírico: 5 valores em 9 competências na conta dele, mesmo contrato.

Docs: `execucao/handoffs/handoff-dev-2026-09-11-cobranca-fatura-competencia.md` (pro dev) e `produto/me/_evidencias/fontes/2026-09-11-contabilizei-modelo-de-cobranca.md` (evidência bruta, JSONs e endpoints).

Relacionado: [[legalize-gateway-asaas-fora]], [[legalize-contrato-proprio-decisoes]], [[legalize-endereco-fiscal-49]], [[legalize-metodo-teardown-funcionalidade]].
