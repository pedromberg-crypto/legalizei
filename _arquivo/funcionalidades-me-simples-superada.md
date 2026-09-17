---
tipo: hub
status: superado
superado_por: "[[_catalogo]] + [[_matriz-dependencia]]"
data: 2026-09-09
assunto: funcionalidades-portal-me-simples
tags: [produto, redirecionador]
---

# ↪️ Esta nota se mudou (09/09/2026)

> ⚠️ **Não escreva mais aqui.** O conteúdo saiu daqui e foi dividido em duas notas, dentro da pasta `produto/`, que passou a ser a fonte-verdade das funcionalidades.

## Para onde foi

| O que você procura | Onde está agora |
|---|---|
| **Quais funcionalidades existem** e a cobertura de cada uma (✅🟡🔴⚪), os baldes de monetização, o catálogo à-la-carte, o que decidimos não fazer | **[[_catalogo]]** |
| **De que terceiro cada funcionalidade depende**, o que a verificação de 09/09 mudou, o calendário fiscal, o placar de dependências, a lista de investigação | **[[_matriz-dependencia]]** |
| O desenho de uma funcionalidade específica | `produto/me/viver/funcionalidades/specs/<nome>.md` |
| O que o concorrente faz, com data | `produto/me/_evidencias/<data>-<fonte>-<tema>.md` |

Comece por **[[HOME-produto]]**.

## Por que se mudou

Este arquivo tinha 445 linhas fazendo **dois trabalhos ao mesmo tempo** (catálogo e matriz de API), e era só uma das seis pastas onde uma funcionalidade morava. O teardown de pró-labore mostrou o custo: ninguém respondia *"como está o pró-labore?"* sem abrir seis arquivos.

A pasta `produto/` organiza por **objeto** (a funcionalidade), não por **fonte** (pesquisa, execução, marca). Contexto completo em [[HOME-produto]].

📌 Este redirecionador fica de pé porque 8 notas ainda linkam `[[funcionalidades-me-simples]]`. Quando essas notas forem atualizadas para apontar direto, ele pode ir pro `_arquivo/`.
