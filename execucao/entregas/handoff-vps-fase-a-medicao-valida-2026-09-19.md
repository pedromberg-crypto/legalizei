---
tipo: handoff
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [execucao, entrega, leo, vps, hermes, medicao, consulta, plugin]
---

# Handoff pra janela do VPS — Fase A: tornar a medição válida (custo zero)

Origem: 77º flow, continuação do `handoff-vps-medicao-sem-token-2026-09-19.md`.
Aquele entregou custo por caso e piso de ruído. Este entrega as duas coisas que
faltam pra medir documentação sem placar: **quanto do placar é plugin** e
**se o agente consultou a nota certa**.

Contexto que manda na prioridade: **o Léo não está com cliente**, está só com a
equipe interna. Nada aqui é urgência de produção.

Prompt pra colar abaixo da linha.

---

Fase A da reorganização do Léo: três tarefas de medição. Continuação direta do
`repontuar.py` e do `custo-por-caso-0226.md` que você acabou de fazer.

🔴 **ZERO chamada de API de modelo.** A cota da Ollama segue estourada. Tudo aqui sai
de `state.db`, do `casos.yaml` e dos plugins que já estão no disco. Se alguma tarefa
parecer exigir geração nova, **pare e me diga**.

🔴 **Não altere o vault do Léo** (`SOUL.md`, `skills-legalizai/`) nem o `casos.yaml`.
A fonte-verdade do `casos.yaml` é o repo, não o VPS: se editarmos aí, voltam as duas
cópias divergindo que custaram semanas em setembro. A tarefa A2 **produz uma
proposta em arquivo separado**; quem aplica no `casos.yaml` sou eu, do lado do repo.

Cite arquivo e linha. Onde não achar, escreva **NÃO ENCONTRADO**.

## A1 — Quanto do placar é o modelo e quanto é o plugin

Você descobriu que o banco guarda a resposta **crua** e o relatório guarda a resposta
**depois do `leo-formatador`**, e que em `contabiles-frequencia` o plugin apagou duas
violações antes da pontuação. Quero o tamanho desse efeito.

1. **Faça o `repontuar.py` pontuar as duas versões** da mesma rodada: `cru` (texto de
   `messages.content`) e `formatado` (mesmo texto passado pelos plugins de produção).
   ⚠️ São **dois** plugins ligados (`config.yaml:76-79`): `leo-formatador` e
   `leo-cadencia`. Trate os dois, e diga se cada um altera texto ou só metadado.

2. **Classifique cada caso de cada rodada em quatro quadrantes:**

   | | formatado passa | formatado falha |
   |---|---|---|
   | **cru passa** | modelo acertou | 🔴 **plugin QUEBROU** |
   | **cru falha** | 🔴 **plugin consertou** | os dois falharam |

   O quadrante "plugin quebrou" pode estar vazio, mas **confira**, não presuma: plugin
   que conserta também pode estragar.

3. **Por checagem global**, me dê a contagem de violações **cruas** contra as que
   sobreviveram ao relatório. Interessa principalmente: travessão, título markdown,
   tabela, "Sem contabilês:" repetido, teto de 8 linhas, link não permitido.

4. **Responda em uma frase no topo:** *"do placar 57/58 da rodada 02:26, quantos
   acertos são conserto de plugin?"* E a mesma conta para as 9 rodadas de v9.

**Entregável:** `/root/Leo-Agente/exports/placar-cru-x-formatado.md`.

## A2 — Qual nota cada caso DEVERIA abrir

Hoje o `casos.yaml` não marca alvo, e o `_testes/README` já nomeia isso como buraco
conhecido. Sem esse mapa, "consultou certo?" não é calculável.

1. **Para cada um dos 58 casos, proponha:**
   - `nota_esperada`: qual(is) das 13 notas de `references/` a resposta legítima
     exige. Pode ser mais de uma, pode ser nenhuma.
   - `skill_esperada`: `atendimento`, `vendas` ou `escalacao`.
   - `confianca`: `alta` quando o `deve`/`nao_deve` do caso aponta um número ou uma
     regra que só existe numa nota; `media` ou `baixa` quando for julgamento.

2. 🔴 **Marque explicitamente os casos que NÃO precisam de nota nenhuma.** Esta é a
   distinção mais importante da tarefa. Dos 9 casos que rodaram com 0 `skill_view` na
   rodada 02:26 (`vc-mentiu`, `regime-indefinido`, `link-app-pre-lancamento`,
   `aceite-medo-nota`, `sonegar`, `mensagem-vulgar`, `fora-escopo-conta`,
   `leo-em-nome-do-app`, `saudacao-sequencia`), **alguns estão certos e outros são
   defeito.** Uma cantada não precisa de nota; `aceite-medo-nota` depende do
   `07-OBRIGACOES` §4 e `leo-em-nome-do-app` da divisão sistema × cliente do `07` §3.
   Separe um a um, com o motivo.

3. **Base de evidência pra decidir, nesta ordem:** o `deve`/`nao_deve` do próprio caso
   · a tabela "Onde a resposta mora" (`atendimento` §3) · o índice do
   `base-legalizai/SKILL.md` · o `avaliar` do caso. **Não invente alvo por intuição:**
   caso que não fecha por nenhuma dessas quatro vias entra com `confianca: baixa` e
   uma linha dizendo por quê. Eu decido esses com o Pedro.

4. **Formato do entregável: tabela em `.md`**, uma linha por caso, colunas
   `id · nota_esperada · skill_esperada · confianca · motivo`. **Não escreva no
   `casos.yaml`.**

**Entregável:** `/root/Leo-Agente/exports/mapa-caso-nota.md`.

## A3 — Fidelidade de consulta (a métrica que substitui o placar)

Com o mapa do A2 e os `tool_calls` que já estão em `messages`, dá pra medir sem ruído
o que o placar não mede.

1. **Para cada caso de cada rodada**, compute:
   - abriu **a nota esperada**? (sim / não / abriu outra)
   - abriu notas **a mais** do que precisava? quais e quanto custaram?
   - abriu nota **inexistente**? (você achou 7 dessas no total)

2. 🔴 **O cruzamento que eu quero, e é o coração da tarefa: passou × consultou.**

   | | consultou a nota certa | não consultou |
   |---|---|---|
   | **passou** | certo | 🔴 **a bateria está cega aqui** |
   | **falhou** | 🔴 **aderência**: leu e desobedeceu | consulta |

   Me dê **a lista nominal dos casos do quadrante "passou sem consultar"**. São os que
   respondem de memória e a bateria aprova. É o defeito que a gente vem perseguindo
   desde que o `10-CONTRATO` apareceu com 1 abertura em 632, e nunca teve nome.

   E a lista do quadrante **"consultou e falhou"** — esses não se resolvem com mais
   documento, se resolvem com posição e brevidade dentro da nota.

3. **Visão por nota:** para cada uma das 13, quantas vezes ela **era esperada** contra
   quantas vezes foi **aberta**. Quero ver as duas pontas: nota exigida e não lida, e
   nota lida sem ser exigida.

4. **Separe v9 e v10**, pelo mesmo motivo do handoff anterior: o pacote mudou no meio e
   misturar confunde documento com ruído.

**Entregável:** `/root/Leo-Agente/exports/fidelidade-de-consulta.md`.

## Fecho

Três listas curtas:
- **O QUE MEDI** — com número.
- **O QUE MUDOU NO DISCO** — todo arquivo criado ou alterado.
- **NÃO ENCONTRADO** — não pode vir vazia.

E confirme em uma linha: **quantas chamadas de API de modelo foram feitas.** Esperado:
zero.
