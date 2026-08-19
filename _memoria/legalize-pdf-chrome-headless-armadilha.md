---
name: legalize-pdf-chrome-headless-armadilha
description: "Chrome headless gera PDF \"com sucesso\" mesmo quando o HTML fonte não existe (imprime a tela de erro dentro do PDF) e não roda sem --user-data-dir se o Chrome do Pedro estiver aberto."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 44cc2fd9-43c4-4c22-b737-ff713a31dbf5
  modified: 2026-08-13T11:47:20.996Z
---

O pipeline HTML→PDF do vault (Chrome headless, usado nos flows 28º/31º/32º) tem 2 armadilhas que já queimaram um flow inteiro:

**1. Falha silenciosa que vira PDF válido.** Se o caminho do HTML fonte estiver errado, o Chrome renderiza a própria tela de erro (`Não foi possível acessar seu arquivo · ERR_FILE_NOT_FOUND`) e **imprime isso como PDF**. O comando retorna sucesso, escreve o arquivo, reporta bytes gravados. O PDF de 11/08 ficou 8 dias no repo assim (1 página, 24KB) e só apareceu quando o Pedro abriu.

**2. Não sobe headless sem perfil próprio.** Com o Chrome normal do Pedro aberto, `--headless` sem `--user-data-dir` retorna `Abrindo em uma sessão de navegador existente` e **não escreve arquivo nenhum**.

**Why:** exit code 0 + arquivo criado não prova que o PDF tem o conteúdo certo. O erro é invisível justamente porque o Chrome trata "página de erro" como página normal a imprimir.

**How to apply:** **use o pipeline versionado `_sistema/pdf/` (13/08), não Chrome na mão.** 3 passos, nenhum opcional: `gerar-html.py <nota.md> <html>` → `gerar-pdf.mjs <html> <pdf>` (Playwright de `app/node_modules`, checa a fonte antes e morre se faltar; perfil próprio, imune à armadilha 2) → `validar-pdf.py <pdf> --min-paginas N --esperar "trecho" --png 1,7,29` (conta páginas, extrai texto por página, procura marca de tela-de-erro, renderiza PNG em `.build/`). Nunca commitar PDF sem o passo 3.

Ferramental disponível nesta máquina: `pypdf`, `pymupdf` (`fitz`) pra render, `markdown`, `playwright`. **Não** existe `poppler`/`pdftoppm` nem `fonttools`.

Ver [[legalize-doc-estrategia-mkt-validacao]] · [[legalize-fonte-sora-sistema]].
