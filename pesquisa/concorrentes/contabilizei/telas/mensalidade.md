---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Mensalidade — Contabilizei

> Nota de captura (importante): o print "mensalidade" **desktop** mostra o **Home/Dashboard** — o único elemento de mensalidade é o banner de topo. O print **mobile** veio **quebrado**: apenas placeholders cinza (skeleton) que nunca carregaram, com a bottom-nav flutuando no meio da página. A auditoria reflete honestamente o que foi capturado.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 4 | No desktop a tela de mensalidade "de verdade" não aparece — só um banner ("mensalidade do plano Padrão R$ 210,90 chegou!"). Sem detalhamento de fatura, vencimento, forma de pagamento ou histórico. No mobile, nada carregou. |
| Eficiência | 5 | O banner informa mas **não tem CTA de pagar/ver fatura**. Para agir, o usuário precisa navegar até o módulo Mensalidade — passo extra sem atalho. |
| Feedback | 5 | O único feedback é "sua mensalidade chegou" com o valor. Não há status (paga/em aberto/vencida), data ou recibo. Mobile não deu feedback nenhum (skeleton). |
| Linguagem | 7 | O banner é humano e amigável: "Sua mensalidade do plano Padrão no valor de R$ 210,90 chegou!". Tom leve. |
| Confiança | 6 | Mostrar o valor exato de forma transparente é bom. Mas ausência de detalhe (o que compõe, quando vence, como pagar) e o mobile quebrado corroem a confiança num momento sensível — cobrança. |
| Mobile | 2 | **Quebrado**: só blocos skeleton cinza, conteúdo nunca renderizou, bottom-nav sobreposta no meio da tela. Falha grave justamente na tela de dinheiro. |
| **Média** | **4.8** | |

## O que vi (fatos)
- **Desktop**: dashboard idêntico ao print de "Faturas". O único elemento ligado a mensalidade é o **banner de topo**: "Sua mensalidade do plano **Padrão** no valor de **R$ 210,90** chegou!" — puramente informativo, sem botão.
- Nenhuma tela dedicada de fatura/pagamento visível: sem detalhamento do plano, sem data de vencimento, sem método de pagamento, sem histórico de cobranças, sem status "paga/em aberto".
- **Mobile**: página **não carregou** — só retângulos skeleton cinza, header (Atendimento/Empresa-Banco/Minha conta) e a bottom-nav flutuando no meio do conteúdo. Botão "Fale conosco" visível.

## 👍 Forças (o que copiar)
- **Transparência do valor no banner**: dizer o número exato (R$ 210,90) e o nome do plano ("Padrão") logo no topo, em linguagem leve, é bom.
- Reconhecer proativamente que a fatura "chegou" em vez de esconder cobrança.

## 👎 Fraquezas (nossa oportunidade)
- **Mobile quebrado num momento de dinheiro** = pior cenário possível de confiança. Se a tela de cobrança não carrega, o cliente questiona se pode confiar o financeiro dele.
- **Banner sem ação**: informa que a fatura chegou mas não deixa pagar, ver detalhe ou baixar recibo ali.
- **Sem detalhamento**: nenhuma composição do valor, data de vencimento, status ou histórico visível.
- **Momento crítico tratado como aviso passageiro** — cobrança merece uma tela dedicada e sólida, não um banner.

## 🎯 Contraproposta Legalizai Story Book
- **Tela de Mensalidade dedicada e à prova de falha** (SSR/estado carregado antes de mostrar; skeleton nunca pode ser o estado final).
- **Fatura acionável**: valor + o que compõe o plano + vencimento + status (paga/em aberto/vencida) + botões "Pagar" (Pix/cartão/boleto) + "Baixar recibo/NF" + histórico de pagamentos.
- **Transparência total do que você paga**: "R$ X = contabilidade + emissão ilimitada de NF + apuração de impostos" — nada de valor solto.
- **Aviso proativo com CTA**: "Sua mensalidade vence em 3 dias — pagar agora" com Pix em 1 toque; lembrete antes do vencimento, não só depois.
- Rigor de QA no mobile: **a tela de cobrança é a última que pode quebrar**.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
