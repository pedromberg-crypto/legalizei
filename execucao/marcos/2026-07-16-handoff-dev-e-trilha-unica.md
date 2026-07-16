---
tipo: historico
status: congelado
data: 2026-07-16
tags: [produto, flow, handoff, dev, decisao, ux, motor, repo]
---

# 🏁 Marco 2026-07-16 — mapa de ramificações, trilha única (UX-48) e handoff pro dev

> Sessão que fechou a **fase de spec do flow** e entregou o **contrato pro backend**. Três entregas encadeadas: (1) analisar o flow por outro ângulo (telas + pausas + condicionais), (2) travar a decisão de trilha, (3) empacotar tudo pro dev.

## 1. Análise nova: telas, pausas e ramificações

**Descoberta de higiene:** [[mapa-telas-mobile]] estava **defasado** (07-14, numeração antiga, 20 telas) contra as specs pós-4-rodadas. Reescrito e sincronizado.

**Contagem oficial (Entrada→B4):** **22 telas** · 23 com o dia-2 · **~20 no caminho mínimo** (solo, cartão, sem swap).

**5 pausas** mapeadas: salvar&retomar (B2) · aguardando pagamento (boleto/Pix) · aguardando 2º sócio · assinatura GOV.BR · **constituição assíncrona (a maior, multi-pausa por órgão)**.

**Nota nova [[mapa-ramificacoes-flow]]:** ~19 condicionais em **3 tipos** —
- **5 saídas terminais** (login · waitlist 🟡 · comercial Mauro 🔴 · exterior · 3+ sócios) → precisam de tela própria; A3/A4/A5 compartilham **1 template de saída graciosa**.
- **7 desvios com retorno** (desambiguação · 2 sócios · CNAE ótimo · boleto · convite 2º sócio · erro de órgão · GOV.BR bronze) → divergem e reconvergem.
- **7 inline** (mesma tela, muda conteúdo) → não geram tela.

## 2. Blind spots fechados (motor v0.2.3, 11 → 14 personas)

| Blind spot | Persona nova | O que prova |
|---|---|---|
| **B6 — erro de órgão** (era **UX-37**, 🔴 no backlog) | `erro-orgao` | nome reprovado na JUCEMG **apesar da prévia** → estado 🔴 "precisa de você" → **recupera dentro do pipeline** → ativa. Não é crash nem limbo |
| **B7 — GOV.BR bronze** | `govbr-bronze` | detecta bronze no B1 → upgrade guiado → assina prata/ouro no B4, sem travar |

**Mudança no motor:** `run.js` ganhou o evento **`recusa`** (irmão da `pausa`) + `flow-schema.js` ganhou branch de viabilidade indeferida e nível GOV.BR. Nenhuma persona antiga quebrou.

## 3. ✅ DECISÃO TRAVADA — UX-48: trilha única + coorte instrumentada

**O problema:** as personas não são um espectro, são **2 extremos** (leigo total × avançado) que querem coisas opostas na mesma tela.

**Evoluiu em 2 passos no debate:**

**Passo 1 — o flag encolheu.** A proposta inicial (flag de densidade, 2 níveis) misturava 2 eixos:
- **Profundidade** (quanto detalhe) → **não precisa de flag**: expander default-fechado **pra todos**. Auto-seleção por comportamento.
- Metade do que estava no "modo leigo" (botão grande, rótulo literal, zero jargão, recap ao reabrir, acessibilidade) **não era modo, era design bom** → virou **universal**.
- Sobra só **ritmo/layout** como tradeoff genuíno (expander não resolve, é estrutural).

**Passo 2 — não bifurca; instrumenta (chamada do Pedro).** Bifurcar ritmo hoje = construir em cima de hipótese com zero dado. E **a cobaia do E2E de 17/07 é o próprio Pedro** (já abriu empresa) — a trilha guiada nem seria validável.
- **1 trilha pra todos.** T5 captura *"É a primeira empresa que você abre?"* como **DADO PURO** (zero mudança de comportamento).
- Mede performance por coorte → bifurca **só se o dado pedir** → [[spec-instrumentacao-flow]] (nota nova: a tag, **7 métricas**, gate de decisão).
- **Gate honesto:** sem p-valor — volume de MLP (dezenas) não dá significância. Bifurca com **padrão direcional claro numa tela específica + conversa com usuário real + causa que seja ritmo** (se for jargão/botão, conserta pra todos).

**Descartado:** pré-mark por comportamento — o atalho *"já sei meu CNAE"* **não qualifica experiência** (caso real do Pedro: chegou sabendo o código e nada mais).

**Regra dura:** densidade muda **apresentação, jamais obrigação**. Conteúdo legal (contrato, termo, cancelamento, e-CAC) é **idêntico e integralmente visível** pras duas coortes, nunca atrás de expander.

**Guarda-corpo por teste:** persona **`reta-direto`** = a `reta` byte a byte com a coorte virada, esperando **trilha idêntica**. Se um passo fiscal um dia ler a coorte, **o teste quebra**. A regra deixou de ser promessa.

**Consequência:** a coorte **não é condicional** — zero fork novo, zero tela nova. A contagem de 22/23 telas não muda.

## 4. 📦 Handoff pro dev — repo `base-flow-legalizei`

**https://github.com/pedromberg-crypto/base-flow-legalizei** · **privado** · 33 arquivos · sob a conta do Pedro.

| Pasta | O que é |
|---|---|
| `motor/` | **fonte viva** — schema + runner + 14 personas. **14/14 PASS standalone** (testado no repo novo) |
| `spec/` | **snapshot v1 congelado** (10 docs) — a spec não muda debaixo da sprint do dev |
| `contrato/` | **derivação nova**: estados-e-transicoes · dicionario-de-dados · **decisoes-abertas** |
| `dados/` | `cnae-lookup-b1.json` — CNAE → veredito → rota, **1332 subclasses** (260 🟢 / 68 🟡 / 1004 🔴), **gerado por regra no build**, não transcrito |

**A tese do handoff:** **as 14 personas são o critério de aceite.** Se o backend do dev rodar as 14 e produzir a mesma trilha, está correto por construção. Vale mais que qualquer PDF.

**⚠️ Aviso duro no README:** o `flow-schema.js` é **contrato de comportamento, NÃO arquitetura pra copiar** (linear, sem persistência, sem async, devolve string pra humano; a IA de CNAE vem dublada). Sem esse aviso o handoff vira armadilha.

**Curadoria (regra do CLAUDE.md: debater antes de compartilhar).** Barrados: BASE-ESTRATEGICA (equity/custo), atas, marca, INPI, evolucao-para-mauro, log de UX, as 3 rodadas de pesquisa fiscal (foi só o bloco CONSOLIDADO). Verificado: **zero wikilinks vazados, zero termo sensível**.
- **Nomes internos genericizados** (contadora / DP / levantamento BH) — decisão do Pedro de cortar referências.
- **"Mauro" mantido**: `comercial-mauro` é identificador no `flow-schema.js`; mudar quebraria as personas.

**Convivência (anti-drift):** motor = fonte no repo compartilhado (é código vivo). Specs = fonte no vault, repo recebe **snapshot versionado** (congelar é feature: o dev não quer spec mudando no meio da sprint). **Contradição motor × spec → o motor ganha.**

**Pendente do Pedro:** convidar o dev (`pedro.melodata`) no repo — acesso é dele.

## 5. Estado de prontidão (resposta direta ao Pedro)

**Backend — dá pro dev?** Sim pro esqueleto. Faltam **5 lacunas**, nenhuma bloqueante: 3 eram reorganização (**feitas**: estados · dicionário · whitelist JSON) e **2 são decisões do Pedro** (chave de idempotência · providers CPF/cartão CNPJ). Ambas viraram capítulo explícito em `contrato/decisoes-abertas.md` — o que não podia era ficarem implícitas.

**UI — dá pro Pedro?** **Sim pro B2 (T7–T15, 9 telas)** — spec madura, zero dependência externa, inclui o clímax (T14). **T1–T6** existem no protótipo mas estão **velhas** (pré-4 rodadas, pré-UX-48). **B3 (T16–T19) bloqueado pelo PREÇO** (R$195 é benchmark, não o nosso) → gargalo a forçar com o Mauro. T23 depende do portal.

⚠️ **Transição de fase:** começar as telas **encerra a regra UI-inline** ("UI = fase-2, não construir ainda"). Não é contradição — é a fase-2 abrindo, como o §Agora já previa.

## Links
- [[mapa-ramificacoes-flow]] · [[spec-instrumentacao-flow]] · [[mapa-telas-mobile]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[compilado-ux-flow]] (UX-48) · [[casos-teste-fluxo-cnae]] · [[HOME]]
