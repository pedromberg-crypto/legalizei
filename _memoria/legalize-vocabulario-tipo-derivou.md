---
name: legalize-vocabulario-tipo-derivou
description: "09/09 RESOLVIDO: verificar.js estava cego em 79% do vault por CRLF; vocabulário abriu pra 8 tipos; roda junto com gerar-mapa. Vocabulário e links ZERADOS."
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T15:41:41.407Z
---

✅ **RESOLVIDO em 09/09.** O que parecia burocracia ("34 tipos onde deviam ser 6") escondia um problema maior.

## A causa raiz era um `\r`

`_sistema/verificar.cjs` lia frontmatter com `/^---\n/` (só LF). O vault é Windows, quase tudo CRLF. Ele enxergava **140 de 663 notas (21%)**. Reportava 44 violações porque só conseguia abrir 140 arquivos. Corrigido pra `/^---\r?\n/`. **Nunca trocar por `\n` seco.**

E ele **nunca rodava**: existia desde 16/07 e nada o chamava.

## O que mudou

| | Antes | Depois |
|---|:--:|:--:|
| Notas lidas | 140 | **663** |
| Tipos no vocabulário | 6 | **8** |
| Violações | 124 | **0** |
| Links quebrados | 69 | **0** |
| Sob vigilância de apodrecimento | 44 | **89** |

- **`marco` e `referencia` promovidos**, não inventados: `execucao/marcos.base` filtrava `tipo == "marco"`, ou seja, **a doutrina proibia o que a ferramenta exigia**. 🔑 Quando doutrina e ferramenta divergem, **a ferramenta é o sintoma**.
- **`original` morreu** (40 notas). Era o pior tipo: o nome afirma "não deriva de nada" e 9 delas declaravam `deriva_de`.
- **77 notas conformadas** por script (`migrar-vocab.js`), preservando CRLF.
- Os **18 volantes de persona** ganharam `deriva_de` lido da linha "Dorsal-mãe" do corpo.
- **`tarefas.base` removida** (filtrava `tipo == "tarefa"`; havia 1 nota assim, um template).
- **`.claude/worktrees/` saiu do escopo**: é cópia inteira do vault (637 `.md`, git-ignored) inflando toda contagem.

## 3 campos novos, cada um mata um alarme falso

```yaml
revisado_em: AAAA-MM-DD    # olhei contra a fonte, continua valendo (saída HONESTA do alarme)
deriva_de_codigo: [...]    # deriva de .mjs/.tsx, que não tem data pra comparar
gerado_por: <script>       # a nota nasce de script; a `data:` dela é carimbo de build
```

🔑 `gerado_por` matou alarme **estrutural**: `dados-coletados-abertura-ate-viabilidade.md` recebe `data: hoje` a cada `gerar-mapa`, então tudo que dela derivava acusava atraso todo dia.
🔑 `revisado_em` cala o alarme sem mentir, e ele volta se a fonte mudar de novo. ⚠️ Nunca resolver mexendo na `data:` (que é semântica).
🔑 `status` **não é campo de recado** ("status: GERADO — não editar à mão" existia).

## Gatilho

Plugado em `gerar-mapa.mjs`, no padrão da trava de anatomia do MEI: **avisa, não derruba**. É o comando que o CLAUDE.md já obriga a rodar a cada tela mexida.

🔴 **Aberto: 15 derivados desatualizados.** É dívida de conteúdo, não de ferramenta. Não carimbei `revisado_em` neles de propósito — dizer "revisei" sem revisar é o vício que o campo existe pra impedir. 6 são a mesma família (specs derivando de `reordenacao-flow-cobranca-cedo`), e o indice-autoridade já documenta que a ORDEM neles morreu e o CONTEÚDO vale.

Relacionado: [[legalize-vault-organizado]] · [[legalize-pasta-produto-fonte-verdade]]
