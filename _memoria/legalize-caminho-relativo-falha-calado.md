---
name: legalize-caminho-relativo-falha-calado
description: 17/09 - `DIR/..` que aponta pra um caminho que EXISTE nao estoura, escreve no lugar errado em silencio; apareceu 3x num dia e a versao que LE grita, a que ESCREVE nao.
metadata:
  type: feedback
---

**Caminho relativo contado a mao e numero em prosa dentro do codigo — e o modo de falhar depende de se ele LE ou ESCREVE.**

Apareceu **tres vezes em 17/09**, na mudanca das pastas, sempre no mesmo formato: um `path.join(DIR, "..")` que apontava certo no endereco antigo e passou a apontar para **outra pasta que tambem existe**.

| Onde | O que fazia | Como falhou |
|---|---|---|
| `gerar-mapa.mjs` (flow) | escreve `mapa-flow-mermaid.md` | 🔇 **silencio** — escreveria na raiz de `produto/`, criando nota orfa |
| `gerar-mapa-portal.mjs` | escreve `mapa-portal-mermaid.md` | 🔇 **silencio** — mesmo caso |
| `gerar-mapa-portal.mjs` | LE as rotas de `(portal)` | 📢 **gritou** — drift saltou de 1 rota para 25 |
| `verificar-encerrados` / `verificar-defasagem` | leem listas de docs | 🔇 **silencio** — `continue` engolia o arquivo ausente |

**Why:** caminho errado que aponta para pasta **inexistente** estoura e alguem conserta. Caminho errado que aponta para pasta **existente** e aceito pelo sistema de arquivos — e ai quem escreve cria lixo invisivel, e quem le confere um conjunto vazio saindo verde. 🔑 A assimetria e o ponto: **o defeito que LE tem chance de gritar; o que ESCREVE nunca grita.**

**How to apply:** em qualquer script do vault, importar `RAIZ` de `produto/_raiz.mjs` (sobe ate achar o `CLAUDE.md`) em vez de contar `..`. Um import quebrado estoura alto (module not found); um `..` a menos, nao. E ao mover qualquer pasta com gerador dentro: **procurar `DIR, ".."` antes de rodar**, e conferir a saida contra baseline em vez de confiar no exit 0. ⚠️ Nao existe trava para isso — foi pego por conferencia manual as 3 vezes. Ver [[legalize-doc-declarado-ausente-e-defeito]] · [[legalize-arvore-produto-me-mei]] · [[legalize-trava-defasagem-e-ordem]].
