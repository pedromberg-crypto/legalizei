---
name: legalize-leitura-integral-documento
description: "Documento de alto grau para o negocio se le INTEIRO, com literal salvo em arquivo e inventario do que ficou de fora. Travado no CLAUDE.md em 10/09."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-10T13:32:50.520Z
---

10/09/2026, provocacao do Pedro: *"arquivos como esse a nivel de documentos ou qualquer outro que tenha alto grau de importancia no negocio nao pode ser lido superficialmente ou por blocos... precisa ser lido na TOTALIDADE e bem registrado"*.

**Vale para:** contrato, termo, aceite, anexo, politica, procuracao, laudo, tabela de preco oficial.

**Why:** eu apresentei o contrato do lider como lido e ele estava **12% literal** (9.000 de 74.700 caracteres). Eu tinha o mapa das 11 clausulas e o texto so das que respondiam a pergunta da vez. O Pedro pegou perguntando *"incluindo scroll?"*. No mesmo dia, a captura anterior (27/08) do mesmo contrato tinha perdido a **clausula 1**, que era exatamente onde estava a resposta que ele procurava. Extrair "o que importa" e escolher o que ver.

**How to apply:**
1. **Ler ate o fim e provar.** Declarar tamanho total e quanto foi lido. Se leu 12%, dizer 12%.
2. **Salvar o literal em arquivo** (`produto/me/_evidencias/fontes/`), nao so a parafrase. Parafrase minha nao e o que advogado, contador ou socio valida.
3. **Inventariar o que ficou de fora**, com nome. Vive em `produto/me/_evidencias/fontes/_inventario-documentos.md`.
4. **Vale para tela tambem** (generaliza a regra de 09/09): medir o `innerText` e comparar com o lido.

⚠️ **Limite de ferramenta nao e desculpa.** `javascript_exec` trunca em ~1.000 caracteres por chamada; a saida e **paginar ate o fim** com `browser_batch` (10 fatias por chamada), nao resumir. 74.700 caracteres sairam em 9 chamadas.

Relacionado: [[legalize-contrato-lider-enumera-incluso]] · [[legalize-metodo-teardown-funcionalidade]] · [[legalize-entidades-duas-empresas]]
