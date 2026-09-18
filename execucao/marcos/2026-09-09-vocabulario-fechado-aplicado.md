---
tipo: marco
data: 2026-09-09
assunto: vocabulario-vault
area: sistema
impacto: alto
tags: [execucao, marcos, vault, vocabulario, verificador]
---

# 🏁 54º flow — a doutrina do vault virou trava, e o verificador enxergou 79% a mais

> O achado que abriu este flow parecia burocracia (*"tem 34 tipos onde deviam ser 6"*).
> Medindo, o problema era outro e era pior: **a ferramenta que auditava isso estava cega
> em 79% do vault, e não rodava havia 2 meses.**

---

## 🔍 O que a medição mostrou

`_sistema/verificar.cjs` existe desde 16/07, tem 178 linhas e audita 4 coisas: derivado apodrecido, link quebrado, vocabulário fora do fechado e nota órfã. **Nunca foi chamado por nada.** `grep` em todo `.mjs`/`.js`/`.json`: zero referências. Era citado em 6 documentos como se fosse rotina.

E quando rodava, mentia:

| | |
|---|:--:|
| Notas com frontmatter | 663 |
| Que ele **conseguia ler** | **140** |
| Que ele **não enxergava** | **523 (79%)** |

🔴 **A causa era um `\r`.** A regex de frontmatter era `/^---\n/`, só LF. O vault é Windows, quase tudo é CRLF. Ele reportava 44 violações de vocabulário porque só conseguia abrir 140 notas.

⚠️ **Correção de rumo:** eu tinha dito ao Pedro que o check de `deriva_de` só olhava notas `tipo: derivado`, e que 27 estavam fora do radar. **Reli o código: não há filtro por tipo.** O movimento que eu havia proposto atacava um problema inexistente. O problema real era a cegueira de CRLF.

---

## 🔧 O que foi feito

### 1. O verificador voltou a enxergar

| Correção | Efeito |
|---|---|
| `\r?` nas duas regexes de frontmatter | 140 → 663 notas lidas |
| `.claude` fora do escopo | `.claude/worktrees/` era uma **cópia inteira do vault** (637 `.md`, ignorada pelo git) inflando toda contagem |
| `png/jpg/pdf` entraram no índice | as notas de pricing-snapshot linkavam imagens que **existem** e apareciam como quebradas |
| `playwright-report` fora | build output entrando na lista de órfãs |

Com a venda tirada, os números reais apareceram: vocabulário **44 → 124**, derivados desatualizados **2 → 14**, links quebrados **56 → 69**.

### 2. O vocabulário abriu de 6 para 8 tipos

**`marco` e `referencia` foram promovidos, não inventados.** Eram 19 e 17 notas, e:

```
execucao/marcos.base:3     - note.tipo == "marco"    ← tipo que a doutrina PROIBIA
```

🔑 **A doutrina proibia o que a ferramenta exigia.** Quem escrevia nota não tinha como obedecer as duas. Regra que fica: **quando doutrina e ferramenta divergem, a ferramenta é o sintoma, não o culpado.**

### 3. 77 notas conformadas

| De | Para | Nº |
|---|---|:--:|
| `original` | `derivado` (declara fonte) | 27 |
| `original` | `verdade` | 13 |
| `campanha` · `execucao` · prompts · `handoff` · `prep` · `rascunho` | `operacao` | 20 |
| `pesquisa-externa` · `teardown-tela` · `levantamento` | `fato` | 5 |
| `spec` · `doutrina` | `verdade` | 4 |
| `template` | `referencia` | 1 |
| `ferramenta` | `hub` | 1 |
| 14 status improvisados | os 5 fechados | 20 |

🎯 **Ganho de vigilância:** os **18 volantes de persona** declaram a dorsal-mãe numa linha de tabela do corpo (`| Dorsal-mãe | wikilink pra dorsal |`). O script leu isso e escreveu `deriva_de` neles. **Eles não eram vigiados e agora são.**

⚠️ **`original` morreu.** Era o pior tipo do vault: 40 notas, e o nome afirma "isto não deriva de nada" enquanto 9 delas declaravam `deriva_de` na linha seguinte.

### 4. Links: 69 → 0

| Família | Tratamento | Nº |
|---|---|:--:|
| caminho relativo (wikilink com `../../pasta/nota`) | vira o basename | 15 |
| alvo renomeado (`benchmark-padrao-195`) | aponta pro nome novo | 9 |
| é código, não nota (`flow-data`, `compromisso`) | vira `` `code` ``, deixa de ser link | 7 |
| nunca existiu (marco não criado, volante não escrito) | perde os colchetes, texto continua legível | 7 |
| placeholder de template (`persona-X`, `nota-linha`) | entra na lista de exemplos do verificador | 5 |
| `deriva_de` com caminho ou extensão | reaponta, ou vai pra `deriva_de_codigo` | 21 |

### 5. Três campos novos, e cada um resolve um alarme falso

```yaml
revisado_em: 2026-09-09    # olhei contra a fonte, continua valendo
deriva_de_codigo: [...]    # deriva de .mjs/.tsx, que não tem data pra comparar
gerado_por: <script>       # a nota nasce de script; a `data:` dela é carimbo de build
```

🔑 **`gerado_por` matou um alarme estrutural.** `dados-coletados-abertura-ate-viabilidade.md` recebe `data: hoje` a cada rodada do `gerar-mapa`. Tudo que derivava dela acusava atraso **todo dia, para sempre**. Alarme que sempre toca é alarme que ninguém olha.

🔑 **`revisado_em` é a saída honesta.** Quando o verificador acusa, há dois caminhos: atualizar a nota, ou olhar e concluir que continua valendo. O segundo cala o alarme **sem mentir**, e ele volta sozinho se a fonte mudar de novo. ⚠️ Nunca resolver mexendo na `data:`, que é semântica.

### 6. O verificador ganhou gatilho

Plugado em `gerar-mapa.mjs`, no mesmo padrão da trava de anatomia do MEI, e **pelo mesmo motivo**: é o comando que a regra do `CLAUDE.md` já obriga a rodar a cada tela mexida. **Avisa, não derruba** — escrever o mapa é outro trabalho.

```
🟡 VAULT: 15 derivado(s) desatualizado(s)
   ↑ rode `node _sistema/verificar.cjs` pro detalhe.
```

### 7. `tarefas.base` removida

Filtrava `tipo == "tarefa"`, e havia **1 nota assim no vault inteiro** (um template). Decisão do Pedro.

---

## 📊 Placar

| | Antes | Depois |
|---|:--:|:--:|
| Notas que o verificador lê | 140 | **663** |
| Tipos no vocabulário | 6 | 8 |
| Violações de vocabulário | 124 (reais) | **0** |
| Links quebrados | 69 | **0** |
| Notas sob vigilância de apodrecimento | 44 | **89** |
| Chamadas automáticas do verificador | 0 | 1 |

---

## 🔴 O que fica aberto

**15 derivados desatualizados**, e é dívida de conteúdo, não de ferramenta. Deliberadamente **não carimbei `revisado_em`** neles: dizer "revisei" sem ter revisado é exatamente o vício que o campo existe pra impedir.

Seis são a mesma família e a mais fácil: `blocos-fluxo-abertura`, `casos-teste-fluxo-cnae`, `mapa-ramificacoes-flow`, `mapa-telas-mobile`, `spec-telas-entrada-b1-b2` e `spec-telas-b3-b4-aterrissagem`, todos derivando de `reordenacao-flow-cobranca-cedo`. A [[indice-autoridade|tabela de autoridade]] **já documenta** que a ORDEM neles morreu e o CONTEÚDO vale. Resolver é ler cada um e decidir entre `revisado_em` e atualizar.

Os outros 9: `auditoria-copy-flow`, `orgaos-sistemas-abertura-bh`, `processo-abertura-empresa-bh`, `spec-mvp-v0`, `cnae-comercio-standby`, `cruzamento-gemini-fluxo-abertura`, `mercado-bh-regional` e 2 do vault do Léo.

⚠️ **77 órfãs** seguem na lista. Não é erro: parte é entrega (handoff, campanha), parte é nota que ninguém linkou ainda.

## Links
[[indice-autoridade]] · [[HOME]] · [[2026-09-09-teardown-pro-labore-e-pasta-produto]] · [[_metodo]]
