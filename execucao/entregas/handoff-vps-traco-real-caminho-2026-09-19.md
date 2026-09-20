---
tipo: handoff
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [execucao, entrega, leo, vps, hermes, custo, traco, caminho]
---

# Handoff pra janela do VPS — o traço real do caminho (custo zero)

Origem: 77º flow. Objetivo declarado pelo Pedro: **economia**, não qualidade. As
respostas já estão num nível satisfatório; o que está caro é o **caminho** que o
agente percorre até respondê-las.

Este handoff troca estimativa por medição em duas conversas: um `"oi"` e uma pergunta
de alíquota.

Prompt pra colar abaixo da linha.

---

Quatro tarefas de leitura do `state.db`. Objetivo: trocar minha estimativa do caminho
do agente por **medição do caminho real**.

🔴 **ZERO chamada de API de modelo.** Cota estourada. Tudo sai de `messages`,
`session_model_usage` e dos arquivos no disco. Se algo parecer exigir geração nova,
**pare e me diga**.

🔴 **Não altere o vault nem o `casos.yaml`.**

Cite arquivo e linha. Onde não achar, **NÃO ENCONTRADO**.

## T1 — O traço completo de 4 casos de imposto

Casos: **`imposto-liquido`**, **`me-duas-aliquotas`**, **`aceite-quem-calcula`**,
**`regime-indefinido`**. São as variantes de "qual minha taxa de imposto".

Para **cada caso, em cada rodada em que ele existe**, me dê o traço chamada a chamada:

| campo | o quê |
|---|---|
| `#` | número da chamada dentro da sessão |
| `ferramenta` | o que foi chamado, com os argumentos exatos |
| `resultado` | ok · erro · arquivo inexistente |
| `chars` | tamanho do que voltou |
| `contexto_acumulado` | 🔴 **quanto o contexto daquela chamada já carregava**, somando tudo que foi aberto antes |

🔑 **A coluna `contexto_acumulado` é a mais importante do handoff.** Quero ver a curva
de crescimento: quanto a chamada 5 paga por causa do que a chamada 2 abriu. Se der pra
tirar de `session_model_usage` ou de `messages.token_count`, use o dado; se for
reconstrução sua, **diga que é reconstrução**.

No fim de cada traço, o **texto da resposta final** (cru, de `messages.content`).

## T2 — O `"oi"` carrega `atendimento` ou não?

O `SOUL` manda: *"`atendimento`: em toda conversa, uma vez, na primeira mensagem do
cliente. É o piso."* Mas o `atendimento` foi aberto **778 vezes em 972 sessões**, e o
`saudacao-sequencia` apareceu com **0 `skill_view`** na rodada 02:26.

1. **Em quantas das rodadas o `saudacao-sequencia` abriu `atendimento`?** Quero o
   número exato, rodada a rodada.
2. **Traço completo dele** numa rodada: quantas chamadas, o que carregou, quantos
   tokens, e o texto da resposta.
3. 🔴 **As ~194 sessões que NÃO abriram `atendimento`: o que elas têm em comum?**
   Liste quais casos são, e veja se há padrão — mensagem curta, ausência de número,
   assunto fora de produto, turno único. **Esta é a pergunta mais útil do handoff:** se
   o modelo já pula o piso quando não precisa dele, a regra do SOUL está sendo
   ignorada, e isso muda o que a gente precisa mexer.
4. E o inverso: **entre os casos que abriram `atendimento`, em quantos a resposta final
   dependeu de algo que só existe lá dentro?** Julgamento seu, caso a caso, com o
   motivo em uma linha. Se não der pra decidir, marque `indeterminado`.

## T3 — O índice é sempre pago antes da nota?

Minha hipótese: o `base-legalizai/SKILL.md` (2.763 chars, aberto **434×**) existe
porque a tabela do `atendimento` §3 guarda o **nome** da nota (`06-CALCULO-FISCAL`) e
não o **caminho** (`references/06-CALCULO-FISCAL.md`). Então o modelo gasta uma ida e
volta inteira só pra traduzir nome em endereço.

**Confirme ou refute com o dado:**

1. Das **434** aberturas do índice, em quantas a chamada **seguinte** foi um
   `skill_view` de uma nota de `references/`?
2. Houve aberturas de nota **sem** o índice ter sido aberto antes na mesma sessão? Em
   quantas? Nessas, de onde ele tirou o caminho — havia uma abertura de índice numa
   chamada anterior, ou ele acertou o caminho de primeira?
3. As **7 chamadas para notas inexistentes**: o índice tinha sido aberto antes nessas
   sessões? Se sim, ele errou o nome **com o índice no contexto**.

## T4 — Aproveitamento: quanto da nota carregada virou resposta

Esta é a conta que justifica leitura por seção, e ela é julgamento, não script.

1. **Escolha 3 traços** entre os do T1 — um curto, um médio e o mais caro.
2. Para **cada nota carregada** naquele traço, leia a resposta final e marque **quais
   seções (`##`) da nota aparecem na resposta**, em fato ou em regra obedecida.
3. Me dê, por nota: `chars carregados · chars das seções realmente usadas ·
   % de aproveitamento`.
4. Some por traço: **quanto por cento de tudo que foi carregado encostou na resposta?**

⚠️ Seja conservador: se uma regra da nota **influenciou** a resposta sem aparecer
literalmente (por exemplo, o agente **não** disse um valor fechado porque a nota
proíbe), conte a seção como usada e diga que foi influência, não citação. Prefiro
superestimar o aproveitamento a inflar meu argumento.

## Fecho

Três listas curtas:
- **O QUE MEDI** — com número.
- **O QUE MUDOU NO DISCO**.
- **NÃO ENCONTRADO** — não pode vir vazia.

E uma frase final respondendo: **"num 'oi' e numa pergunta de alíquota, que fração dos
tokens enviados encostou na resposta?"**

Confirme em uma linha quantas chamadas de API de modelo foram feitas. Esperado: zero.
