---
tipo: consolidado
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [testes, custo, otimizacoes, maratona, consolidado]
---

# Todos os testes de 21/09/2026 · placar, custo e otimizações

Consolidado das nove rodadas de E2E e das três sessões de produção do dia em que
o motor novo entrou no ar. Cada rodada aponta o que mudou **antes** dela, que é
a única forma de ligar uma otimização ao resultado que ela produziu.

🔴 **O placar tem ruído medido de até 3 pontos.** Diferença de 1 ou 2 falhas
entre rodadas não é sinal. O que vale olhar é a rota, os turnos sem lastro
técnico e o defeito que se repete.

## 🏃 Maratona V1 · `casos-maratona.yaml` · 1 caso, 10 turnos

Mede venda e objeção: gate de saída, fechamento, fidelidade, passivo.

| # | hora | falhas | sem lastro | rota `comercial`<br>(esperado 5) | cache | custo | o que mudou antes |
|---|---|---|---|---|---|---|---|
| r1 | 01:41 | 11 | 4 | 1 | 88,6% | US$ 0,012079 | — linha de base |
| r2 | 01:43 | 12 | 4 | 2 | 89,2% | US$ 0,011965 | nada (repetição para medir ruído) |
| r3 | 01:55 | **8** | 3 | 3 | 89,2% | US$ 0,012873 | `consultar_contrato` ganhou gatilhos de objeção |
| r4 | 02:04 | **7** | 5 | **0** | 89,8% | US$ 0,011325 | `consultar_preco` gatilhos de fechamento · `RULES` §9.1 passivo |

**Ganho: 11 → 7 falhas. Custo da suíte: US$ 0,048.**

⚠️ Os JSONs de r1 e r2 se perderam na colisão de nome de arquivo, corrigida às
02:04. Os números vieram do console e estão registrados em
`evolucao-2026-09-21-0145.md`.

## 🚫 Cliente impossível · `casos-cliente-impossivel.yaml` · 2 casos, 3 turnos

Mede o que o Léo faz quando a resposta certa é **não entregar**: o cliente que
exige preço sem dar dados, e o que pede CNPJ para atividade ilegal.

| # | hora | placar | falhas | cache | custo | o que mudou antes |
|---|---|---|---|---|---|---|
| r1 | 01:41 | 0/2 | 4 | 93,9% | US$ 0,002400 | — linha de base |
| r2 | 01:44 | **1/2** | **2** | 89,3% | US$ 0,002602 | regex minhas: `\bdas\b` e `\be se\b` ancoradas |

**Custo da suíte: US$ 0,005.**

As duas falhas que sumiram eram defeito da régua, não do agente: `das\b` casava
dentro de "permiti**das**" e `e se` dentro de "d**e se**rviço".

## 🧠 Maratona V2 · `casos-maratona-v2.yaml` · 1 caso, 10 turnos

Mede **conhecimento**: teto do MEI, CNAE que veda MEI, Fator R, reembolso da
taxa da Junta, prazo da promoção, pedido de documento, compatibilidade do app.

| # | hora | falhas | sem lastro | rota `comercial` | `buscar_base` | cache | custo | o que mudou antes |
|---|---|---|---|---|---|---|---|---|
| r1 | 02:47 | 6 | 4 | 3 | 0 | 92,5% | US$ 0,012749 | `RULES` §3.2 faturamento · §6 31/12 · §9.3 reembolso · `PERSONA` ironia |
| r2 | 03:13 | **5** | 4 | 3 | 0 | 91,9% | US$ 0,013938 | `consultar_escopo` obrigatória · `RULES` §9.4 ação · §9.5 loop |
| r3 | 03:16 | **4** | **1** | **6** | **4** | 92,0% | US$ 0,016940 | cartão 1.3 reescrito **dentro** dos campos do parser |

**Ganho: 6 → 4 falhas. Turnos sem lastro: 4 → 1, o melhor da sessão.
Custo da suíte: US$ 0,044.**

Das quatro falhas restantes, **duas são defeito de régua**: o t8 reprova "o time
envia o contrato", que é o exemplo ✅ da própria regra §9.2, e a expectativa de
rota do t4 provavelmente está errada.

## 📱 WhatsApp real · produção, conversa humana

| sessão | hora | turnos | entrada | cache | custo | o que mudou antes |
|---|---|---|---|---|---|---|
| manual V1 | 02:02→02:13 | 10 | 184.926 | **não medido** | ~US$ 0,0125 <br>(teto US$ 0,0497) | as quatro correções de 01:55 e 02:04 |
| verificação | 02:33 | 1 | 28.083 | 96,9% | US$ 0,001238 | coluna `tokens_cache` recém-criada |
| manual V2 | 02:47→02:54 | 10 | 264.293 | 91,5% | **US$ 0,015192** <br>(real) | pausa 2,5–4s · espelhamento · síntese · pré-lançamento |

🔑 **A manual V2 é a única medição de custo exata de produção.** A V1 só tem
intervalo porque a coluna `tokens_cache` não existia ainda: ela entrou às 02:31.
O valor real caiu perto do piso do intervalo estimado, o que valida a estimativa
que tinha sido feita.

⚠️ A manual V2 e a V2 r1 do E2E rodaram com **as mesmas dez perguntas**, com 14
segundos de diferença, mesmo código e mesmos prompts. É o pareamento analisado
em `evolucao-2026-09-21-whatsapp-manual-v2.md`, e foi ele que confirmou três
defeitos como comportamento e não como ruído.

## 💰 Total do dia

| | |
|---|---|
| rodadas de E2E | 9 · **US$ 0,0969** |
| produção (3 sessões) | **US$ 0,0289** |
| **gasto total** | **US$ 0,1258** ≈ **R$ 0,68** |
| teria custado sem cache | ~US$ 0,54 |
| **economia do cache** | **~77%** |

Ordem de grandeza que interessa: uma conversa comercial completa de dez turnos
custa cerca de **um centavo e meio de dólar**. O custo não é o gargalo deste
produto.

⚠️ A entrada mais que dobra do primeiro ao último turno de uma conversa: 14.974
contra 32.445 na sessão manual V2. O histórico é reenviado inteiro a cada turno,
então uma conversa de 30 turnos não custa três vezes uma de 10.

## 🔧 As otimizações, na ordem em que entraram

| hora | onde | o quê | resultado |
|---|---|---|---|
| 01:44 | `casos-cliente-impossivel.yaml` | regex ancoradas | 0/2 → 1/2 |
| 01:53 | `tools-def.ts` | `consultar_contrato` + gatilhos de objeção | fidelidade parou de ser negada |
| 02:00 | `tools-def.ts` | `consultar_preco` + gatilhos de fechamento | preço passou a sair no turno 7 |
| 02:00 | `RULES` §9.1 | vedação de passivo | parou de oferecer regularização |
| 02:20 | `server.ts` | pausa 2,5–4s entre batidas + typing | **sem teste humano ainda** |
| 02:20 | `PERSONA` | espelhamento, descontração, síntese | ironia confirmada; síntese **não** |
| 02:20 | `RULES` §6 | pré-lançamento e Lista VIP | parou de mandar assinar no site |
| 02:31 | schema + `router`/`db` | coluna `tokens_cache` | custo real passou a ser medido |
| 02:40 | `RULES` §9.2 | não anexa documento | recusa com explicação |
| 02:46 | `RULES` §3.2 §6 §9.3 | faturamento, 31/12, reembolso | 31/12 ✅ · reembolso ✅ · faturamento ❌ |
| 03:12 | `tools-def.ts` | `consultar_escopo` **obrigatória** | faturamento presumido ✅ |
| 03:12 | `RULES` §9.4 §9.5 | ação não executada, loop de oferta | ambos ✅ |
| 03:16 | cartão 1.3 | plataforma do app | contradição do iPhone ✅ |

### A linha que mais ensina

O par das **02:46** e **03:12**. A mesma correção — impedir que o Léo presumisse
o faturamento do cliente — foi tentada duas vezes:

* **Como regra de texto**, no `RULES.md` §3.2, com a frase proibida escrita como
  exemplo ❌. Em produção o agente escreveu exatamente essa frase cerca de
  **quarenta segundos** depois de a regra entrar no ar.
* **Como obrigação de tool**, na descrição de `consultar_escopo` ("NUNCA
  diagnostique MEI ou ME sem antes chamar esta ferramenta"). O defeito sumiu na
  primeira rodada seguinte, com `fatos=[escopo,teto]` provando a consulta.

**Regra negativa em prompt não impede alucinação de memória. Obrigar a consulta
antes da afirmação, sim.**

⚠️ E quando a regra precisa mesmo ir para o prompt: três vezes neste dia o
modelo copiou o exemplo ✅ quase palavra por palavra, em vez de abstrair a regra
(§9.1, §9.3 e §9.4). Escrever dois exemplos diferentes por regra, em vez de um,
é a forma de forçar abstração.

## Onde estão os relatórios completos

| arquivo | o que prova |
|---|---|
| `evolucao-2026-09-21-0145.md` | linha de base da maratona V1 e do cliente impossível |
| `evolucao-2026-09-21-0155.md` | fidelidade corrigida pela tool |
| `evolucao-2026-09-21-0204.md` | preço no fechamento; regressão de RAG |
| `evolucao-2026-09-21-whatsapp-manual.md` | primeira conversa real, custo estimado |
| `evolucao-2026-09-21-maratona-v2.md` | suíte de conhecimento, linha de base |
| `evolucao-2026-09-21-whatsapp-manual-v2.md` | pareado: mesmas 10 perguntas, E2E e WhatsApp, custo exato |
| `evolucao-2026-09-21-maratona-v2-r2.md` | as quatro correções sistêmicas |
| `HANDOFF-2026-09-21.md` | estado dos serviços, pendências e armadilhas |
