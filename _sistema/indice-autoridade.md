---
tipo: hub
status: vivo
data: 2026-07-16
tags: [sistema, autoridade, vocabulario, meta]
---

# 🧭 Índice de autoridade — quem manda em cada assunto

> **Por que existe:** em 16/07 o Pedro provocou uma coisa certa. Numa semana a gente
> validou, revalidou e refez centenas de informações, e os achados viraram frequentes
> demais: *"passou despercebido"*, *"isso não estava na minha visão"*. Nove só naquele dia.
>
> A medição mostrou que **não era falta de documentação** (o vault é bem linkado: 143 notas,
> `BASE-ESTRATEGICA` com 15 backlinks, `cnae-atendidos` com 16). Eram outras três coisas:
>
> 1. **Gravidade invertida** — os docs cuja ORDEM morreu tinham 5× mais backlinks que os que
>    os substituíram (`blocos-fluxo-abertura` 22 × `reordenacao-flow` 4). O grafo apontava
>    pro passado.
> 2. **Dependência não rastreada** — 7 dos 9 achados eram do tipo *"X dependia de Y e ninguém
>    sabia"*. O vault registrava o **quê** e o **porquê**, nunca o **de quem isto depende**.
> 3. **Vocabulário improvisado** — 20 `status` e 25 `tipo` diferentes. Nenhum script consegue
>    verificar 20 status inventados.
>
> **Este doc é a resposta às três.** Ele responde a pergunta que ninguém conseguia responder:
> **qual documento manda neste assunto?**

---

## ⚠️ A regra que mais importa

**Um documento pode ser VERDADE sobre um assunto e MENTIR sobre outro.**

Esse é o erro que quase cometi ao arrumar isto: ia carimbar 6 docs como "superados" porque
a reordenação de 16/07 matou a ordem T1–T23. **Errado.** Ela matou a **ordem** e o **momento
da cobrança**. Não matou o campo-a-campo do `spec-telas-entrada-b1-b2` (28kb de validação e
microdetalhe), nem as condicionais do `mapa-ramificacoes-flow`.

Então a pergunta nunca é *"esse doc está vivo?"*. É sempre **"esse doc manda NESTE assunto?"**.

---

## 📋 Tabela de autoridade

| Assunto | 👑 Manda | Mente sobre isso (não leia lá) |
|---|---|---|
| **ORDEM do flow · momento da cobrança** | [[reordenacao-flow-cobranca-cedo]] + `motor-testes/flow-schema.js` | ❌ mapa-telas-mobile · spec-telas-* · blocos-fluxo-abertura · mapa-ramificacoes (todos têm a ordem T1–T23, morta) |
| **CONTEÚDO das telas** (campo, validação, margem, microdetalhe) | [[spec-telas-entrada-b1-b2]] (T1–T15) · [[spec-telas-b3-b4-aterrissagem]] (T16–T23) | ⚠️ a numeração T é velha → use o mapa T→N abaixo |
| **CONDICIONAIS / ramificações** | [[mapa-ramificacoes-flow]] | ⚠️ a ordem é velha; os forks e o template de saída graciosa valem |
| **INVENTÁRIO de telas + pausas** | [[mapa-telas-mobile]] | ⚠️ ordem velha; as 5 pausas foram reclassificadas por shell em [[design-system]] §0 |
| **LÓGICA de negócio dos blocos** | `motor-testes/flow-schema.js` **> ** [[blocos-fluxo-abertura]] | quando divergem, **o motor ganha** (ver precedência) |
| **PERSONAS / critério de aceite** | `motor-testes/personas/*.json` (19: 16 flow #1 + 3 flow #2) | ❌ [[casos-teste-fluxo-cnae]] tem as 11 originais |
| **Flow #2 MIGRAR** | `motor-testes/flow-migrar.js` | (novo em 16/07; não há doc antigo) |
| **NÚMEROS fiscais** | [[fiscal-simples-bh-2026]] bloco **CONSOLIDADO** | derivados: `flow-schema.js` FISCAL · `app/src/lib/fiscal.ts` |
| **PREÇO de plano · CAC-alvo · margem/custo** | [[estado-atual]] (`financeiro/estado-atual.md`) — não é log, é o estado corrente | ❌ `posicionamento.md`/`estrategia-organica.md`/`frente-1-captacao-meta-bh.md` ainda citam MEI R$49,90 velho; `decisoes-marca.md` tem a história completa mas é cronológico, não cite direto de lá |
| **CNAE atendido / não atendido** (mapa de mercado, espelho do LÍDER) | [[cnae-atendidos-e-nao-atendidos]] | [[cnae-comercio-standby]] = os 200 cortados. ⚠️ NÃO é a whitelist do nosso V1 — ver linha abaixo |
| **CNAE que ATENDEMOS de verdade no V1** (92 ME · 55 MEI, fonte primária) | [[cnae-liso-servico]] | v1 antiga (103, herdada da Contabilizei) superada 27/08 — não usar |
| **CNAE fiscalmente ótimo** | [[cnae-fiscalmente-otimo]] | 🕓 famílias 🟡 esperam Larissa |
| **CNAE fiscalmente ótimo** | [[cnae-fiscalmente-otimo]] | 🕓 famílias 🟡 esperam Larissa |
| **Dados oficiais por CNAE** (IBGE + Anexo/Fator R + MEI + risco municipal + ISS BH) | [[cnae-matriz-governo]] (descreve `cnae-matriz.csv`/`.json`, 1332 códigos) | ⚠️ `contabilizei-cnae-completo.csv` tem `pode_mei`/`anexos_romano`/`fator_r` **próprios da Contabilizei** (o que o CONCORRENTE assume) — não são nossa verdade, útil só pra comparar. 🕓 coluna `anexo_fator_r_grupo` (62 `requer-revisao` + tudo) espera Larissa ratificar antes de virar produto |
| **Consultas de órgãos · autofill (o que uma API de fato entrega)** | [[infosimples-funcionalidades]] + [[orgaos-e-cobertura-infosimples]] | ⚠️ **regra dura 24/07:** antes de criar QUALQUER campo de autofill/consulta, checar aqui. Não assumir o que um número (CNPJ/CPF/CEP) puxa — já erramos supondo |
| **Cor · tipo · espaço · shell · arquétipo** | [[design-system]] | derivado: `app/src/app/globals.css` |
| **Primitivos de cor** | [[paleta-cores]] | as **regras** em prosa lá viraram token no [[design-system]] §2 |
| **Decisões de marca** | [[decisoes-marca]] (ADR) | — |
| **Otimizações de UX** | [[compilado-ux-flow]] | ⚠️ "✅" lá significa **decidido**, não construído (ver Estados) |
| **Estratégia · custo · equity** | [[BASE-ESTRATEGICA]] | — |
| **Funil real do líder** | [[2026-07-16-funil-abertura-ate-pagamento]] · [[2026-07-16-pos-pagamento-operacao-real]] | ⚠️ [[onboarding-jornada-completa]] (08/07) é anterior e mais rasa |
| **Estado corrente do projeto** | [[HOME]] §Agora | — |
| **Valores a validar com gente** | [[fila-validacao-humana]] | — |

---

## ⚖️ Precedência (quando duas fontes divergem)

1. **Código que roda > documento.** O motor e o app não mentem: eles executam.
   Regra já travada no handoff do dev: *contradição → motor ganha*.
2. **Fato datado > decisão.** O CNPJ real do Pedro saiu **LTDA** num caso solo; a spec diz
   "solo→SLU". O fato ganha, a spec vira suspeita. (Anti-guru aplicado ao próprio vault.)
3. **Decisão nova > decisão velha** — **mas** só no assunto que ela de fato decidiu.
4. **Nada > nada.** Ausência de doc não é permissão pra inventar. Vira 🕓 fila.

> ⚠️ **"✅ na spec" NÃO significa implementado.** Isso não é teoria: a auditoria de 16/07 achou
> **5 itens ✅ que nunca viraram código**, e um deles (UX-39) fazia o motor recomendar
> exatamente o oposto do que a spec mandava. Por isso os Estados abaixo são três, não um.

---

## 🗺️ Mapa T → N (a tradução que faltava)

A numeração antiga (T) aparece em ~8 docs e nos relatórios do motor. Ela **não vai ser
reescrita** (custaria um dia e criaria 8 docs novos pra manter). Traduza por aqui.

| Antigo | Novo | Tela |
|---|---|---|
| T1 · T2 · T3 | N1 · N2 · **N3** | splash · welcome · fork *(N3 virou 3 rotas, UX-55)* |
| T4 | **N4** | gate-CNAE *(+ triagem UX-21 e faixa de faturamento)* |
| — | 🆕 **N5** | **teaser em 3 modos** (não existia) |
| T5 | **N6** | criar conta |
| T16 + T17 | **N7** | conta da abertura + plano *(fundidos)* |
| **T18** | **N8** *(metade)* | **aceite do contrato** — reversível |
| T19 | **N9** | pagamento · **← a casa nasce aqui** |
| T6 → T15 | **N10 → N19** | todo o dossiê *(desceu pra depois do pagamento)* |
| — | 🆕 **N19.5** | **consenso do 2º sócio** (UX-50; sem spec de UI) |
| **T18** | **N20** *(outra metade)* | **termo irreversível** — aqui a máquina liga |
| T20 · T21 · T22 · T23 | N21 · N22 · N23 · N24 | painel · convite sócio · GOV.BR · empresa ativa |
| — | 🆕 **N25** | **TFLF** (dia ~40) — evento de portal |

> 🔑 **O T18 rachou em dois** (N8 aceite reversível · N20 termo irreversível). É a mudança
> menos óbvia e a de maior efeito jurídico.

---

## 🏷️ Vocabulário fechado

**Antes:** 25 `tipo` e 20 `status` improvisados, 106 notas sem status nenhum.
**Agora:** 6 tipos, 5 status. Fechados. Se não couber, discute antes de inventar.

### `tipo` — o que a nota É
| tipo | O que é | Regra |
|---|---|---|
| `hub` | navegação | HOME, este índice |
| `verdade` | **fonte-verdade de um assunto** | só uma por assunto (ver tabela) |
| `derivado` | **deriva de uma verdade** | ⚠️ **apodrece** quando a fonte muda → o script pega |
| `fato` | dado externo, datado | teardown, captura, pesquisa. **Não muda**, só ganha data |
| `historico` | registro do que aconteceu | marco, reunião, diário. **Nunca leia como atual** |
| `operacao` | trabalho corrente | kanban, tarefa, briefing. Muda toda hora, não é fonte |

### `status` — em que estado está
| status | Significa |
|---|---|
| `vivo` | atual, pode usar |
| `superado` | morreu **neste assunto** → aponta o sucessor em `superado_por` |
| `rascunho` | em construção, não confie ainda |
| `congelado` | snapshot **intencional** (ex.: a spec no repo do dev) |
| `fila-humana` | 🕓 espera Mauro / Larissa / Karla → [[fila-validacao-humana]] |

### 🕓 `fila-humana` não é 🔴
Decisão do Pedro em 16/07, e é uma correção de um vício meu: eu vinha carimbando 🔴 em
preço, `TEASER_PISO`, DAE, SLU×LTDA — **misturando "isto trava a construção" com "isto
precisa de um contador"**. São coisas diferentes.

- 🔴 = **bloqueia**. Raro. Não dá pra construir sem.
- 🕓 = **fila**. Leve. Constrói com placeholder marcado, o Pedro valida com as pessoas certas
  quando for a hora.

---

## 🔗 Dependência declarada (o campo que faltava)

Três campos novos no frontmatter. Não é burocracia: **é o que torna a verificação automática
possível**, e é a resposta direta ao achado nº 2 lá de cima.

```yaml
deriva_de: [fiscal-simples-bh-2026]     # se ISTO mudar, eu fico suspeito
supera: [mapa-telas-mobile]             # eu matei estes (neste assunto)
superado_por: reordenacao-flow-cobranca-cedo   # quem me matou
assunto: ordem-do-flow                  # em QUE assunto eu mando
```

**Verificação:** `node _sistema/verificar.js` lista todo `derivado` cuja fonte mudou depois
dele, todo link quebrado e todo status fora do vocabulário.

> Se o UX-44 tivesse `deriva_de: [ordem-do-flow]`, a reordenação teria acendido a luz em vez
> de revogá-lo em silêncio. É exatamente esse o caso que este campo existe pra evitar.

---

## Links
- [[HOME]] · [[fila-validacao-humana]] · [[reordenacao-flow-cobranca-cedo]] · [[design-system]] · [[compilado-ux-flow]]
