---
tipo: handoff
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [execucao, entrega, leo, vps, hermes, medicao, custo]
---

# Handoff pra janela do VPS — passos 0, 1 e 3 (custo zero)

Origem: 77º flow. Sai da leitura integral do vault (161.936 chars), do
`levantamento-hermes-runtime.md` (25.761) e do `prompt-leo-20260919-30662chars.txt`
(30.662). Os três passos abaixo **não gastam um token de API**.

Prompt pra colar na janela do Claude Code do VPS, abaixo da linha.

---

Três tarefas de medição no Léo. Todas usam dado que já está no disco.

🔴 **REGRA DURA: ZERO chamada de API de modelo.** A cota da Ollama está estourada
(HTTP 429) e o objetivo destes três passos é justamente medir sem comprar rodada.
Não rode `rodar_testes.py`, não abra sessão de agente, não chame `/model`. Se alguma
tarefa parecer exigir uma chamada, **pare e me diga** em vez de fazer.

🔴 **Não altere o vault do Léo.** Nem `SOUL.md`, nem `skills-legalizai/`, nem
`casos.yaml`. Estes passos só leem e criam scripts novos.

Regra de resposta: cite arquivo e linha de onde tirou cada afirmação. Onde não
achar, escreva **NÃO ENCONTRADO** e siga. Não deduza por analogia.

## PASSO 0 — A bateria mediu a produção?

O dump que você exportou diz `Platform: cli`. Produção é `whatsapp`, e o
`config.yaml:81-92` dá toolsets diferentes pras duas. Preciso saber se as 14
rodadas e os 35,46M de tokens mediram uma configuração que o cliente nunca encontra.

1. **Gere o system prompt como ele sairia com `platform: whatsapp`**, sem chamar
   modelo nenhum. `build_system_prompt_parts` (`agent/system_prompt.py:632-692`) é
   função pura o bastante pra ser invocada direto num script Python, com o agente
   montado em modo whatsapp. Se não for possível sem inicializar sessão, diga por
   que e proponha o caminho mais barato.
2. **Salve em** `/root/Leo-Agente/exports/prompt-leo-whatsapp-<chars>chars.txt` e me
   diga o tamanho em chars.
3. 🔴 **`diff` contra o de `cli`.** Quero a lista completa das diferenças, bloco a
   bloco, com o tamanho de cada uma. Em especial:
   - O trailer `You are in a plain terminal (CLI). Markdown does NOT render...`
     existe no whatsapp? Se não, o que aparece no lugar?
   - O bloco de cron/`deliver='telegram'` muda?
   - `# Google model operational directives` e `# Tool-use enforcement` entram
     igual nos dois?
   - `<available_skills>` lista as mesmas skills? `autonomous-ai-agents` e
     `hermes-agent` aparecem no whatsapp também?
4. **A definição das ferramentas** viaja no campo `tools` da requisição, fora do
   system prompt. Monte o JSON de `tools` pras duas plataformas, **conte os
   caracteres de cada** e me dê a diferença. Isso é token pago em toda chamada e
   hoje não está medido em lugar nenhum.
5. Confira se a tabela `system_prompts` (41 linhas) já guarda algum prompt com
   plataforma whatsapp. Se guardar, use o real em vez do reconstruído.

**Entregável:** um `.md` em `/root/Leo-Agente/` respondendo, em uma frase no topo:
**"a bateria de 18-19/09 mediu a configuração de produção? SIM / NÃO / PARCIALMENTE"**,
seguido do diff e das contagens.

## PASSO 1 — Custo por caso de teste

Hoje o relatório da bateria não guarda o `session_id`, então não dá pra amarrar
caso de teste com consumo. O runner já tem o valor em mãos.

1. **Patch em `/root/Leo-Agente/testes/rodar_testes.py`:** acrescente uma coluna
   `session_id` na tabela do relatório `.md`. O valor já é capturado em `:96` e
   usado em `:103-108`. Não mude mais nada no runner.
2. **Reconstrua o custo por caso da rodada de 19/09 02:26** (58 casos, placar
   57/58, SOUL v10 — é o melhor baseline limpo que temos; a de 02:29 morreu no 429).
   Amarre relatório ↔ `session_model_usage` por `session_id`. Se o relatório antigo
   não tiver o id, amarre por janela de tempo e diga que a amarração é por
   aproximação.
3. **Me devolva uma tabela dos 58 casos**, ordenada do mais caro pro mais barato,
   com: `id do caso · api_call_count · input_tokens · cache_read_tokens ·
   output_tokens · total · quais skill_view ele chamou`.
4. No fim da tabela, três respostas:
   - Quais são os **10 casos mais caros** e que fração do total eles são?
   - Quais casos rodaram com **0 chamadas de `skill_view`**? (o `regime-indefinido`
     é um; quero a lista inteira)
   - Quais rodaram com **5 ou mais**?

**Entregável:** o patch aplicado + `/root/Leo-Agente/exports/custo-por-caso-0226.md`.

## PASSO 3 — Reprocessador offline da bateria

O `state.db` tem **2.647 respostas de `role='assistant'`**, nada compactado
(`compacted = 0`). As asserções do `casos.yaml` são regex sobre texto. Então dá pra
re-pontuar tudo sem chamar modelo.

1. **Escreva `/root/Leo-Agente/testes/repontuar.py`.** Ele recebe um identificador
   de rodada (janela de tempo ou lista de `session_id`) e:
   - lê `casos.yaml`;
   - puxa de `messages` o texto da **última** resposta `role='assistant'` de cada
     sessão;
   - reaplica `deve`, `nao_deve`, `max_chars`, `min_chars`;
   - reaplica as **13 checagens globais** e o teto de 8 linhas, **importando as
     funções do `rodar_testes.py`**, não reescrevendo as regras (duas cópias da
     régua é o bug que a gente acabou de passar dois dias consertando);
   - imprime o placar no mesmo formato do relatório original.

2. 🔴 **Critério de aceite, e ele não é negociável:** rode o `repontuar.py` contra a
   rodada de **19/09 02:26** e ele tem que reproduzir **57/58, e exatamente o mesmo
   caso falhando**. Se der número diferente, o reprocessador está errado — me mostre
   a divergência caso a caso antes de seguir. **Não ajuste o script pra bater o
   número; investigue a diferença.**

3. **Depois que ele passar no aceite, rode contra TODAS as rodadas que estão no
   `state.db`** (as 14 cheias e as 14 parciais). Saída: uma matriz
   **caso × rodada**, com passou/falhou.

4. **Dessa matriz, calcule e me entregue:**
   - **taxa de acerto por caso** ao longo de todas as rodadas;
   - classificação de cada caso em **SEMPRE PASSA · SEMPRE FALHA · INSTÁVEL**
     (instável = passou em algumas e falhou em outras com o mesmo pacote);
   - quantos casos são instáveis, e **que fração da variação do placar eles
     explicam**.

🔑 Isto responde de graça a pergunta que eu achava que exigiria comprar uma rodada:
**qual é o piso de ruído da bateria.** Sem esse número, comparar modelo ou provedor
é comprar decisão sem barra de erro. As rodadas 51/49/48/51 já estão pagas e
guardadas; falta só lê-las direito.

⚠️ Uma ressalva pra você checar e me dizer: as rodadas de 18/09 usaram **SOUL v9**
e 51 casos; as de 19/09 usaram **v10** e 58. Separe as duas populações na matriz e
**não misture** — comparar v9 com v10 confunde documento com ruído. Se um caso só
existe na v10, marque como ausente na v9, não como falha.

**Entregável:** `repontuar.py` + `/root/Leo-Agente/exports/piso-de-ruido.md` com a
matriz e as três respostas do item 4.

## Fecho

Termine com três listas curtas:
- **O QUE MEDI** — com o número.
- **O QUE MUDOU NO DISCO** — todo arquivo criado ou alterado.
- **NÃO ENCONTRADO** — tudo que não deu pra confirmar. Não pode vir vazia.

E confirme, em uma linha: **quantas chamadas de API de modelo foram feitas** durante
as três tarefas. A resposta esperada é zero.
