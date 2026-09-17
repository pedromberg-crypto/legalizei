---
name: legalize-pasta-produto-fonte-verdade
description: "09/09: funcionalidades ganharam pasta-raiz produto/ como fonte-verdade; spec viva e evidência datada moram separadas; funcionalidades-me-simples virou redirecionador."
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T15:00:53.532Z
---

**A frente de funcionalidades mora em `produto/`**, pasta-raiz do vault com estatuto de fonte-verdade, registrada com 5 linhas no `_sistema/indice-autoridade.md`. Criada em 09/09/2026.

O Pedro pediu **vault Obsidian separado** e eu recomendei pasta; ele aprovou. Vault separado mataria os `[[links]]` entre vaults e tiraria a frente do índice de autoridade.

**O diagnóstico que a criou:** o vault é organizado por **FONTE** (`pesquisa/` · `execucao/` · `marca/`), e funcionalidade precisa ser organizada por **OBJETO**. Uma funcionalidade tinha 6 facetas em 6 pastas, e ninguém respondia "como está o pró-labore?" sem abrir 6 arquivos.

```
produto/HOME-produto.md        hub, placar, fila
produto/_doutrina/_metodo.md             6 passos do teardown + regra de navegação
produto/me/viver/_catalogo.md           as 51 funcionalidades e a cobertura
produto/me/viver/_matriz-dependencia.md as 23 dependências externas
produto/funcionalidades.base   4 vistas, filtra por `dominio`
produto/me/viver/funcionalidades/specs/       spec VIVA, é o que o dev implementa
produto/me/_evidencias/            foto com DATA, não manda em nada
```

🔑 **A separação que dá o valor:** teardown de concorrente **envelhece sozinho** (eles mudam a tela); nosso desenho não. Num arquivo só, em 6 meses metade mente e ninguém sabe qual metade.

⚠️ **`execucao/portal/funcionalidades-me-simples.md` virou redirecionador**, não sumiu: tinha 8 backlinks reais. Não escrever mais lá.

⚠️ **`tipo` e `status` são vocabulário FECHADO** (6 e 5 valores). Eu inventei 4 ao criar a pasta e corrigi: spec → `verdade`, evidência → `fato`, e a discriminação real virou a **propriedade `dominio`**. Ver [[legalize-vocabulario-tipo-derivou]].

Relacionado: [[legalize-metodo-teardown-funcionalidade]] · [[legalize-vault-organizado]] · [[legalize-portal-lista-consolidada]]
