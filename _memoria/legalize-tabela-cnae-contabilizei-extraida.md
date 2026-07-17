---
name: legalize-tabela-cnae-contabilizei-extraida
description: os 387 CNAEs atendidos do líder foram extraídos com dado fiscal completo; método Nuxt __NUXT__ reaproveitável pra qualquer página deles
metadata: 
  node_type: memory
  type: project
  originSessionId: 196e1739-6f29-4e49-a9d4-59e67a506cef
---

Em 2026-07-17 (2º flow do dia) extraímos os **387 CNAEs** que a Contabilizei declara atender, com o dado fiscal que faltava na matriz: **anexo, Fator R, faixa de alíquota, MEI, hierarquia com códigos, descritores, relacionados, fontes**. Resolve a pista quente de 16/07 e avança o thread [[legalize-lista-cnae-furada-na-raiz]].

**Método reaproveitável (usar em TODA leitura futura do site deles):** contabilizei.com.br é **Nuxt/SSR** — o dado completo vem embutido em `window.__NUXT__` na própria página (NÃO é API, NÃO é HTML renderizado, NÃO é o `llms-full.txt`/`.md` — esse é só institucional, 73k, sem CNAE). Receita: `curl --compressed -L` → recorta `window.__NUXT__=` até `</script>` → executa em sandbox `vm` isolado do Node (contexto vazio; é IIFE, não JSON, então `JSON.parse` não serve) → objeto estruturado. Headless, paralelo. **Throttle gentil obrigatório:** 8 conexões dispararam anti-bot (147/390 falhas); 3 conexões + backoff recuperou 100%.

**Dataset (dataset-first, NÃO 387 notas):** `pesquisa/cnae-matriz/` → `contabilizei-cnae-completo.json` (fonte de verdade) + `.csv` (tabela) + `cnae-atendidos.base` (Base do Obsidian, enche conforme promovermos CNAEs pra nota) + `cnae-atendidos-hub.md` + `contabilizei-cnae-completo-relatorio.md`. Bruto da tabela-resumo em `contabilizei-tabela-cnae.csv` (417, fiel). Promover pra nota só "o que quisermos" (reversível).

**Confiança:** fidelidade da captura ALTA (bateu 417/417 vs 2ª extração externa do Pedro; zeros à esquerda de 3 CNAEs Seção A conferidos no IBGE). Veracidade fiscal **NÃO-RATIFICADA** — é afirmação do líder → [[fila-validacao-humana]] (Larissa). Campos etiquetados por origem (lido/derivado/fixo).

**Dúvidas abertas:** `6612-6/05` e `6911-7/02` sem anexo na fonte (IBGE não traz anexo do Simples: classificação ≠ tributação) → Larissa define. `8020-0/01` mantido apesar de `atende=false` na página (decisão Pedro). 3 atacados removidos (`4530-7/01`, `4530-7/02`, `4541-2/02`). **Próximo flow:** cruzar os 387 contra os 260 de serviço + consolidado fiscal.
