---
name: legalize-pdf-chrome-headless-armadilha
description: "Chrome headless gera PDF \"com sucesso\" mesmo quando o HTML fonte não existe (imprime a tela de erro dentro do PDF) e não roda sem --user-data-dir se o Chrome do Pedro estiver aberto."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 44cc2fd9-43c4-4c22-b737-ff713a31dbf5
  modified: 2026-08-13T11:13:17.291Z
---

O pipeline HTML→PDF do vault (Chrome headless, usado nos flows 28º/31º/32º) tem 2 armadilhas que já queimaram um flow inteiro:

**1. Falha silenciosa que vira PDF válido.** Se o caminho do HTML fonte estiver errado, o Chrome renderiza a própria tela de erro (`Não foi possível acessar seu arquivo · ERR_FILE_NOT_FOUND`) e **imprime isso como PDF**. O comando retorna sucesso, escreve o arquivo, reporta bytes gravados. O PDF de 11/08 ficou 8 dias no repo assim (1 página, 24KB) e só apareceu quando o Pedro abriu.

**2. Não sobe headless sem perfil próprio.** Com o Chrome normal do Pedro aberto, `--headless` sem `--user-data-dir` retorna `Abrindo em uma sessão de navegador existente` e **não escreve arquivo nenhum**.

**Why:** exit code 0 + arquivo criado não prova que o PDF tem o conteúdo certo. O erro é invisível justamente porque o Chrome trata "página de erro" como página normal a imprimir.

**How to apply:** comando com `--user-data-dir` num path temporário dedicado; **sempre validar depois de gerar** — contar páginas e extrair texto com `pypdf` (`PdfReader(...).pages`), e renderizar screenshot pra conferir layout (`--screenshot --window-size=794,3200`). Nunca commitar PDF sem essa checagem. `poppler`/`pdftoppm` não existe nesta máquina; o caminho é `pypdf` + screenshot do Chrome.

Ver [[legalize-doc-estrategia-mkt-validacao]].
