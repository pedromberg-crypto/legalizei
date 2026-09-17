---
tipo: operacao
status: vivo
data: 2026-09-08
assunto: gateways-de-pagamento-br
tags: [pesquisa, prompt, gemini, pagamento, gateway, psp, fornecedor]
---

# 🔎 Prompt — pesquisa de gateways de pagamento (mercado BR)

> **Contexto:** o Asaas saiu (conversa com o programador, 08/09). O motivo é o **modelo de responsabilidade**: no formato que o Asaas oferece, o nosso app precisaria manipular dados sensíveis de cartão, o que nos joga pro escopo PCI-DSS. O dev sugeriu **Pagar.me** e **PagBank**, onde a operadora assume esse pedaço. Esta pesquisa existe pra saber **quem mais no Brasil resolve isso**, e em que condições.
>
> **Como usar:** colar o bloco abaixo no Google Search Pro do Gemini. Ele roda fora da sessão e o resultado volta pro vault ([[legalize-pesquisa-grande-via-gemini]]).

---

## O prompt (copiar daqui pra baixo)

```
Você é um consultor de meios de pagamento no Brasil. Preciso de uma pesquisa
profunda, com fontes e datas, para escolher o provedor de pagamento de um SaaS
brasileiro que está entrando em produção agora.

# CONTEXTO DO NEGÓCIO (use isto para filtrar o que é relevante)

- Produto: aplicativo de contabilidade digital (concorrente direto de
  Contabilizei, Agilize, Contabilivre). Abertura de empresa + mensalidade
  recorrente de serviço contábil.
- Empresa contratante: escritório de contabilidade com 22 anos, CNPJ ativo em
  Belo Horizonte/MG. Não é MEI nem empresa recém-aberta.
- Estágio: pré-lançamento. Volume inicial baixo, sem histórico de
  processamento para negociar taxa. Precisa de um provedor que aceite entrar
  pequeno e escalar.

## Ticket e modelo de receita
- Mensalidade recorrente: R$ 139/mês (plano principal) e R$ 49/mês (plano de
  entrada). Promoções de 3 meses derrubam para R$ 79 e R$ 19.
- ATENÇÃO AO TICKET BAIXO: em uma cobrança de R$ 19 a R$ 49, qualquer taxa
  FIXA por transação (ex.: R$ 0,49 ou R$ 1,00 no boleto/Pix) pesa muito mais
  que o percentual. Sempre calcule e mostre o custo efetivo em % para os
  tickets de R$ 19, R$ 49, R$ 79, R$ 139 e R$ 209, não apenas a taxa nominal.
- Serviços avulsos somados à fatura do mês seguinte (valores de R$ 15 a
  R$ 1.300), no modelo em que o item é adicionado à próxima cobrança
  recorrente em vez de gerar uma cobrança separada na hora.
- Uma cobrança anual de repasse: certificado digital de ~R$ 209/ano, que
  cobramos do cliente e repassamos a uma certificadora parceira. Quero saber
  se isso caracteriza marketplace/split de pagamento e o que muda
  (contratualmente, fiscalmente e no provedor).

## Meios de pagamento necessários
- Cartão de crédito com cobrança recorrente mensal.
- Pix.
- Boleto.
- Interesse em entender o Pix Automático / Pix recorrente (regulamentação do
  Banco Central) como alternativa ao cartão para reduzir churn involuntário.

## O critério que motivou a troca (mais importante da pesquisa)
Não queremos que nosso servidor receba, trafegue ou armazene número de cartão,
CVV ou validade. Quero entender, provedor a provedor:
- Qual o modelo oferecido: checkout hospedado (redirect), checkout
  transparente com tokenização no navegador (client-side), SDK/iframe, ou
  API direta com dados crus.
- Qual nível de PCI-DSS cada modelo exige de NÓS (SAQ-A, SAQ-A-EP, SAQ-D) e
  o que isso significa em obrigação prática e custo.
- Quem é o "merchant of record" e quem assume responsabilidade por fraude.
- Se existe tokenização de cartão para cobrar nos meses seguintes sem que a
  gente guarde o cartão.

## Fidelidade (leia com atenção, é contraintuitivo)
O contrato tem fidelidade de 12 meses com multa de 30% sobre o saldo restante.
MAS a fidelidade é CONTRATUAL, não do pagamento: o cliente paga mês a mês,
livremente, e pode trocar de método quando quiser. NÃO queremos:
- assinatura que prenda o cliente no gateway,
- cobrança antecipada de 12 meses,
- parcelamento do plano no cartão.
O que precisamos do provedor é recorrência simples e cancelável a qualquer
momento pelo lado do pagamento. A cobrança da multa, quando houver, é um
evento avulso e pontual.

# O QUE EU QUERO DA PESQUISA

## 1. Panorama
Liste os provedores relevantes no Brasil hoje para SaaS B2B de ticket baixo com
recorrência, incluindo obrigatoriamente Pagar.me, PagBank/PagSeguro, Asaas,
Stripe Brasil, Mercado Pago, Iugu, Vindi, Galax Pay, Cielo, Rede, Getnet,
Stone, Efí (antiga Gerencianet), Juno, Malga e Zoop. Acrescente outros que
fizerem sentido. Para cada um, diga em uma linha o que ele É (adquirente,
subadquirente, PSP, gateway, orquestrador), porque isso muda taxa e risco.

## 2. Tabela comparativa
Compare os 6 a 8 mais aderentes ao meu caso, com estas colunas:
- Modelo de integração de cartão e nível PCI exigido de nós
- Taxa de cartão de crédito (à vista, D+30) e prazo de repasse
- Taxa de Pix (percentual e fixa) e prazo
- Taxa de boleto (fixa) e prazo
- Custo efetivo em % para ticket de R$ 49 e de R$ 139
- Recorrência nativa: sim/não, e o que oferece
- Retentativa automática de cartão recusado (dunning) e atualização
  automática de cartão vencido (account updater)
- Suporte a Pix Automático
- Split de pagamento (para o repasse do certificado)
- Webhooks: confiabilidade, reenvio, idempotência
- Sandbox e qualidade de documentação e SDK (Node/TypeScript)
- Exigência de faturamento mínimo ou tempo de CNPJ
- Reserva financeira retida, se houver

## 3. Riscos e letra miúda
Para cada finalista, procure especificamente:
- Relatos de bloqueio de conta, retenção de saldo ou encerramento unilateral
  em empresas de serviço recorrente.
- Política de chargeback: quem paga, qual o prazo de contestação, se há
  proteção para transação recorrente.
- Antecipação de recebíveis: é automática e compulsória, ou opcional?
- Reajuste de taxa: o contrato permite mudar unilateralmente?
- Qualidade real do suporte (não o prometido): tempo de resposta em
  incidente, existência de gerente de conta em conta pequena.

## 4. Cenário específico do repasse
Analise o caso do certificado digital: cobramos R$ 209 do cliente e repassamos
para a certificadora parceira. Responda:
- Isso exige split de pagamento no provedor, ou pode ser tratado como custo
  nosso e pagamento avulso à parte?
- Qual a implicação fiscal (a receita é nossa e vira despesa, ou é receita
  de terceiro em trânsito)?
- Que provedores fazem split para um recebedor que não é cliente da
  plataforma?

## 5. Recomendação
Feche com:
- Um ranking justificado dos 3 melhores para o meu caso, com o critério que
  desempatou cada posição.
- O que eu perderia e o que ganharia saindo do Asaas para cada um deles.
- Uma estimativa de custo mensal total em 3 cenários de volume: 50, 200 e
  500 clientes ativos, considerando a mistura provável de meios de pagamento
  (suponha 60% cartão, 30% Pix, 10% boleto e explicite a suposição).
- Quais perguntas eu devo fazer ao comercial de cada finalista antes de
  assinar.

# REGRAS DA RESPOSTA

- Cite a fonte e a DATA de cada taxa. Taxa de gateway muda com frequência e
  informação de blog desatualizado é pior que informação nenhuma.
- Quando não encontrar um dado público (é comum em taxa negociada), diga
  explicitamente "não publicado" em vez de estimar.
- Separe o que é tabela pública do que é negociável por volume.
- Não recomende com base em popularidade. Recomende com base nos critérios
  acima, na ordem em que os listei.
- Português do Brasil.
```

---

## Por que o prompt tem esses pontos (para quem for revisá-lo depois)

| Ponto do prompt | De onde saiu |
|---|---|
| Custo efetivo em % por faixa de ticket | Preço real: ME R$139, MEI R$49, promoções R$79 e R$19 ([[estado-atual]]). Num ticket de R$19 uma taxa fixa de R$1 é 5% |
| Avulsos somando na fatura seguinte | Decisão de 27/07: serviço avulso não cobra na hora, entra na próxima fatura |
| Repasse do certificado e split | Decisão de 07/09: o certificado (R$209/ano) passou a ser cobrado dentro do app e repassado à certificadora |
| Fidelidade contratual ≠ prisão no gateway | Correção do Pedro, 08/09. Fidelidade 12 meses e multa de 30% do saldo são cláusula de contrato; o pagamento é mensal e livre |
| Nível PCI e quem é merchant of record | O motivo declarado da saída do Asaas |
| Retentativa e account updater | Churn involuntário por cartão recusado é a maior perda silenciosa de SaaS recorrente |
| Pix Automático | Alternativa ao cartão para ticket baixo, onde o MDR pesa |
| Webhook com idempotência | O app já pressupõe que "quem fecha a cobrança é o webhook do provedor" |
| Bloqueio de conta e retenção | Risco real para quem entra pequeno, e não aparece em material de venda |

## ⚠️ O que muda no app se o provedor mudar

A tela de pagamento (E9) foi construída pressupondo o Asaas, e há dado coletado só por causa dele — vale conferir contra o provedor novo antes de o dev integrar:

- `billingType` com os valores `CREDIT_CARD` / `PIX` / `BOLETO` (enum do Asaas)
- `remoteIp` do **dispositivo do pagador**, exigido na criação de cobrança por cartão e usado pela análise antifraude
- Os campos do titular do cartão e o endereço da fatura (CEP + número), coletados na E9
- A decisão de não oferecer débito, que veio de uma limitação do enum do Asaas

Fonte: [[dados-coletados-abertura-ate-viabilidade]], linhas do bloco E9.

## Links
- [[estado-atual]] · [[decisoes-marca]] · [[backlog-e-sprint-1]] · [[dados-coletados-abertura-ate-viabilidade]] · [[funcionalidades-me-simples]] · [[BASE-ESTRATEGICA]] · [[HOME]]
