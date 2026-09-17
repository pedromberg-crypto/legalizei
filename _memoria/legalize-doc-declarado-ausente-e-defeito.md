---
name: legalize-doc-declarado-ausente-e-defeito
description: 17/09 - 4 travas passariam VERDES sem ler nada porque doc declarado e ausente virava `continue`; lista e declaracao, nao inventario que encolhe sozinho.
metadata:
  type: feedback
---

**Trava que varre uma lista de arquivos tem que DERRUBAR a rodada quando um arquivo declarado nao existe.** Nunca `continue`, nunca `catch {}`.

Achado em 17/09, na mudanca do motor de pasta. Quatro travas tinham o mesmo formato: o arquivo declarado sumia do endereco, o laco pulava em silencio, a lista encolhia sozinha e o placar seguia imprimindo *"N documentos varridos"*. Onde estava: os **dois** lacos do `verificar-encerrados` (`DOCS_DE_PENDENCIA` e `FONTES_DE_DESENHO` — o segundo e o que pegou a 3a copia da CPP errada) e o `DOCS_VIVOS` do `verificar-defasagem`.

**Why:** e a mesma familia da trava cega de 16/09, e a pior de todas — ela roda **verde afirmando que esta tudo em dia**, quando na verdade nao olhou nada. Trava cega e pior que trava ausente: a ausente ninguem confia, a cega todo mundo confia. E o gatilho nao precisa ser mudanca de pasta: basta renomear um doc.

**How to apply:** ao escrever ou revisar qualquer verificador que leia uma lista de caminhos, conferir se ausencia **estoura com o nome do arquivo**. Lista e DECLARACAO: some um item, alguem decide — mesma regra do *"remover capacidade e decisao, nao limpeza"*. ⚠️ Uma 4a ficou **declarada e nao corrigida**: o `verificar-autoridade` tinha 11 caminhos podres e pegou so 3, porque o atalho de `[[wikilink]]` aceita o nome do arquivo e nunca confere o endereco — o atalho tem motivo (o indice cita por wikilink), e quem confere endereco e a varredura de ausencia. Relacionado: [[legalize-trava-defasagem-e-ordem]] · [[legalize-travas-de-metodo-15-09]] · [[legalize-arvore-produto-me-mei]].
