---
name: legalize-ciclo-do-cnpj-e-canais
description: "15/09 — as 10 obrigações do cliente travado, com prazo, dado e CANAL; e a folga é de 15 dias, não 20"
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-16T01:50:13.653Z
---

`produto/me/viver/motor/vidas/ciclo-do-cnpj.mjs` — a lista **fechada** do que a casa deve fazer pelo cliente travado (ME Simples III/V, serviço, BH, 1 a 4 sócios, **sem colaborador**): **7 obrigações mensais + 3 anuais**.

🔑 **É fechada de propósito:** obrigação que não está lá **não existe** para este cliente. Nasceu do pedido do Pedro de *"parar de colocar dado, cálculo, guia e qualquer outra coisa onde o nosso cliente travado não encaixa"*.

## 🔴 A folga é de 15 dias, não de 20

| vence | o quê | folga |
|---|---|---|
| **dia 15** | eSocial + DCTFWeb, decidir o pró-labore, vigiar o Fator R | **15 dias** |
| dia 20 | DARF do sócio (**antecipa**) | 20 |
| dia 20 | DAS + PGDAS-D (**prorroga**) | 20 |
| 31/03 | DEFIS | — |

🔑 **O eSocial vence ANTES do DAS.** Quem desenhar a tela do pró-labore mirando o dia 20 entrega **5 dias atrasado, todo mês**.
⚠️ E no **mesmo dia 20** o DARF **antecipa** e o DAS **prorroga** — em fim de semana vão para lados opostos (comp. 08/2026: DARF 18, DAS 21).

## CÁLCULO e CANAL são coisas diferentes

Eu tinha juntado as duas: o M1 era "automático" porque o motor apura, e o M4 "sem canal" — mesma dependência, vereditos opostos. Agora toda obrigação declara as duas pernas.

**Canais, todos confirmados (pesquisa 15/09):** Integra-SN (PGDAS-D, DAS, DEFIS) · Integra-Sicalc (DARF) · Integra-DCTFWeb · Integra-Sitfis/Pagamento (arrecadação) · **eSocial Web Service SOAP, gratuito**. Autenticação mTLS + ICP-Brasil + procuração e-CAC. Custo **R$3,20 a R$4,96 por CNPJ/mês** (🟡 de software houses, não do SERPRO) — ~3% de um plano de R$139.
🔴 Endpoints, preço oficial e sandbox **não estão em fonte aberta**: só depois de contratar na Loja.

## DEFIS

Res. CGSN 140/2018 art. 72. **Não há multa** por atraso — o que há é **bloqueio do PGDAS-D a partir de março do ano seguinte**. Livro Caixa basta, salvo se distribuir lucro acima da presunção. Empresa aberta em dezembro declara o **ano-calendário inteiro** (19 dias de empresa geram DEFIS completa).
🔴 **Morre em 01/01/2027** (Res. CGSN 190/2026), absorvida pelo PGDAS-D entre janeiro e março. ⚠️ A janela de convivência do ano-calendário 2026 **não tem regra transitória em fonte oficial**.

## eSocial de ME sem empregado

S-1000 · S-1010 · S-2300 (sócio, categoria 721/722) · S-1200 · **S-1210** · S-1299. **Sem evento anual.**
🔑 O **S-1210 é o evento do PAGAMENTO** — é ele que sustenta o regime de caixa do Fator R (mexe com o limite PP1 do piloto).
🔑 **"Sem movimento"**: S-1299 com a flag **só no 1º mês**; repetir todo janeiro foi extinto.

## O placar

**16 vidas · 156 competências · 1.092 verificações · 0 falhas · 0 sem canal.** 8 automáticas, 2 parciais, 0 não resolvidas.

**Why:** responde a pergunta do Pedro — *"no dia 1 do CNPJ aberto, tudo é entregue nas datas corretas?"* — por competência, não por opinião.

**How to apply:** antes de dizer que falta alguma obrigação, conferir se ela está na lista. E `FORA_DO_CICLO` diz o que existe no mundo e **não existe** para este cliente.

Relacionado: [[legalize-piloto-pro-labore-automatico]] · [[legalize-motor-fiscal-apurador-existe]] · [[legalize-gate-elegibilidade-simples]].
