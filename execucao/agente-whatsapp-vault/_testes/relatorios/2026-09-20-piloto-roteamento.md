---
tipo: relatorio-teste
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
rodada: 1
tags: [teste, leo, roteamento, custo, piloto]
---

# Rodada 1 — o índice morreu, e o chute de nome morreu junto

**Marco zero das medições.** As rodadas de 18-19/09 (Ollama, `gemma4:31b`) ficam como
consulta histórica, nunca como régua: outro provedor, outro modelo, outra cota.

| | |
|---|---|
| Data | 2026-09-20, 11h41 a 11h49 (BRT) |
| Modelo | `gemini-3.1-flash-lite` |
| Provedor | `gemini` (chave em tier pago) |
| Concorrência | `-j 1` |
| Casos | `saudacao-sequencia` · `aceite-preco` · `me-duas-aliquotas` · `comercio-gate-saida` · `fidelidade-pergunta` |
| Rodadas | 1 de cada lado |

## Os três pacotes

| | conteúdo |
|---|---|
| **A** | v10, o pacote de 19/09. Perfil `leo-v10`, do backup `sync-20260920-074414` |
| **B1** | `description` cortados para 57 chars · caminho completo nas tabelas · índice sem tabela |
| **B2** | B1 + os 13 `file_path` válidos e o aviso de que `legalizai` é categoria, no `DESCRIPTION.md` |

## Resultado

| métrica | A | B1 | B2 |
|---|---|---|---|
| 🔴 **índice `base-legalizai` aberto** | **4** | **0** | **0** |
| 🔴 **chutes de nome que falharam** | 0 | **2** | **0** |
| chamadas de API | 18 | 13 | **12** |
| input novo | 93.322 | 48.380 | 60.979 |
| cache read | 138.489 | 97.735 | 101.919 |
| output | 787 | 803 | 726 |
| tokens por caso | 18.822 | 9.837 | 12.341 |
| **custo da rodada** | **US$ 0,02797** | **US$ 0,01574** | **US$ 0,01888** |
| placar | 3/5 | 4/5 | 4/5 |

**A → B2: chamadas −33%, tokens por caso −34%, custo −32%.**

## A rota, caso a caso

| caso | A | B2 |
|---|---|---|
| `aceite-preco` | `vendas` → **índice** → `01` | `vendas` → `01` |
| `me-duas-aliquotas` | `vendas` → **índice** → `06` | `vendas` → `06` → `01` |
| `comercio-gate-saida` | `legalizai` ✗ → **índice** → `12` | `12` direto |
| `fidelidade-pergunta` | `legalizai` ✗ → **índice** → `10` | `10` direto |
| `saudacao-sequencia` | nenhuma | `atendimento` |

🔑 **No A, todo caminho passava pelo índice. No B2, nenhum** — e três casos foram
direto na nota, sem carregar skill de procedimento.

## O que o B1 revelou, e que o B2 consertou

O B1 tirou o índice e criou um efeito colateral: o modelo passou a **compor nome de
arquivo**. Dois chutes na rodada:

* `references/02-CALCULO-IMPOSTO-SIMPLES.md` — nota que não existe
* `skill_view("legalizai")` — chamou a **categoria** como se fosse skill

⚠️ **Os dois se autocorrigem:** o `skill_view` devolve `available_files` e
`available_skills` no erro, e o modelo acertou na tentativa seguinte. O problema nunca
foi errar a resposta, foi **cada chute custar uma ida e volta inteira (~16 mil tokens)**.

🔴 E o segundo chute **não é regressão**: `legalizai` e `legalizai:atendimento` já
apareciam entre as 7 chamadas inválidas medidas antes de qualquer mudança nossa.

**Conserto:** os 13 `file_path` válidos e o aviso sobre a categoria entraram no
`DESCRIPTION.md`, que passa inteiro no prompt. Custo: **+439 tokens por chamada**.
Resultado: **zero chutes**.

## 🔴 O que esta rodada NÃO prova

1. **Uma rodada de cada lado.** As métricas de rota (índice 4→0, chutes 2→0) convencem
   porque são categóricas e totais. **Os deltas de token não** — precisam de repetição.
2. **B2 gastou mais token que B1** (12.341 contra 9.837 por caso). Pode ser o custo da
   lista de nomes, pode ser variância entre rodadas. **Com uma rodada de cada, não dá
   para separar.** Não tratar como regressão nem como custo aceito até medir.
3. **Placar não vale nada aqui.** 3/5 contra 4/5, com piso de ruído medido em 3 pontos
   sobre 51 casos. Ignorar.
4. **O A rodou depois do B1**, então pegou cache mais quente. Isso **favorece o A**, o
   que torna o ganho do B conservador.
5. **Outro modelo, outra rota.** O `saudacao-sequencia` abriu `atendimento` aqui e não
   abria no `gemma4:31b`. Trocar de modelo muda o caminho.

## Pendências abertas

* Repetir A e B2, 3 rodadas cada, para dar barra de erro ao delta de token.
* 🔴 **Erro de provedor vira caso reprovado.** No dia, uma rodada no `gemma-4-31b-it`
  deu 429 e o runner pontuou a mensagem de erro como resposta do Léo (`travessao`,
  `ingles`, `verbosa`). Precisa detectar HTTP e marcar `ERRO`, fora do placar.
* 🔴 **O runner lê o `state.db` do perfil `leo`**, fixo. Rodada em outro perfil reporta
  "0 ferramentas" mesmo tendo usado. Foi o que aconteceu com o A.
* `gemini-2.5-flash` e `gemini-2.5-flash-lite` dão **HTTP 404, "no longer available to
  new users"**, apesar de aparecerem no `ListModels`.
* `gemma-4-31b-it` é grátis no Google, mas o limite é **16.000 tokens de input por
  minuto** e uma chamada nossa usa 10.215. Inviável como bancada.
* `fallback_model` segue comentado no `config.yaml`. Ele dispara em 429 e teria salvado
  esta rodada e a de 19/09.

---

# Rodada 2 — v12: a briga de formato acaba, e o "oi" vira uma chamada

Mesma bancada: `gemini-3.1-flash-lite`, `-j 1`, os mesmos 5 casos.

## O que entrou no v12

| passo | mudança | onde |
|---|---|---|
| **1** | `platform_hints` reescreve o trailer do WhatsApp: *"as regras do SOUL.md são autoritativas, ignore orientação genérica de markdown"* | `config.yaml` |
| **2** | `tool_use_enforcement`, `task_completion_guidance` e `environment_probe` desligados · `memory` e `tts` fora dos toolsets · skill `hermes-agent` desabilitada | `config.yaml` |
| **3** | As três perguntas de leitura sobem do `atendimento` §1 para o `SOUL.md` | vault |

⚠️ **`parallel_tool_call_guidance` ficou ligado de propósito:** é ele que faz o agente abrir vários documentos num lote só. Desligar viraria 2 idas e voltas em 6.

## Resultado

| métrica | A (v10) | B2 (v11) | **v12** | A → v12 |
|---|---|---|---|---|
| chamadas de API | 18 | 12 | **9** | **−50%** |
| tokens por caso | 18.822 | 12.341 | **10.106** | **−46%** |
| custo da rodada | US$ 0,02797 | US$ 0,01888 | **US$ 0,01461** | **−48%** |
| índice aberto | 4 | 0 | **0** | |
| chutes de nome | 0 | 2 | **0** | |
| **placar** | 3/5 | 4/5 | **5/5** | |

## A rota

| caso | chamadas | rota |
|---|---|---|
| `saudacao-sequencia` | **1** | **nenhum documento** |
| `aceite-preco` | 2 | `vendas` → `01-PLANOS-E-OFERTAS` |
| `me-duas-aliquotas` | 2 | `06-CALCULO-FISCAL` → `05-DICIONARIO-CNAE` |
| `comercio-gate-saida` | 2 | `12-GATE-DE-SAIDA` |
| `fidelidade-pergunta` | 2 | `10-CONTRATO-GARANTIA-CANCELAMENTO` |

🔑 **O "oi" virou uma chamada e zero documento.** Antes eram 2 chamadas e o `atendimento` inteiro (12.591 chars). O gate no prefixo tirou a razão de buscar manual para dar bom dia.

🔑 **E o 5/5 tem causa nomeável:** o `aceite-preco` reprovava por verbosidade em todas as rodadas anteriores e caiu de **366 para 209 chars**. A produção parou de mandar *"write markdown freely, bullets included"*. **As respostas encurtaram porque pararam de receber ordem contrária** — não porque o modelo melhorou.

## 🔴 O que esta rodada NÃO prova

1. **Três mudanças juntas, uma rodada.** Não dá para atribuir os −48% a cada passo separadamente. A ligação entre o passo 1 e o 5/5 é raciocínio, não medição isolada.
2. **`tool_use_enforcement` desligado** é o bloco que empurra o modelo a chamar ferramenta. Nesta rodada ele continuou chamando certo, mas **é uma rodada**. Se alguma futura mostrar resposta de memória, é o primeiro lugar a olhar.
3. **O SOUL cresceu** (21.982 → 23.297) porque o gate subiu; o `atendimento` encolheu (12.033 → 10.856). A troca compensou, mas o prefixo é pago sempre.

## O que ficou de fora

`vendas` (19.403 chars, **5% de aproveitamento**) não foi aberto em nenhum dos 5 casos. Segue sendo o maior peso morto do sistema — é a Camada 4 da reorganização.

## Como reproduzir

```bash
# B, no perfil de produção
./rodar_testes.py -m gemini-3.1-flash-lite -p gemini -j 1 \
  -c aceite-preco me-duas-aliquotas fidelidade-pergunta comercio-gate-saida saudacao-sequencia

# A, no perfil com o pacote antigo
LEO_PERFIL=leo-v10 ./rodar_testes.py -m gemini-3.1-flash-lite -p gemini -j 1 -c <mesmos>
```

Rota e custo saem de `session_model_usage` e `messages.tool_calls`, **no `state.db` do
perfil que rodou**.
