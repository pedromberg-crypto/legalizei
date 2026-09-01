---
name: legalize-gravacao-jucemg-fonte-primaria
description: "31/08: gravação real da constituição na JUCEMG (141 prints) virou a fonte-verdade do flow; revelou bug de apartamento e matou o debate da procuração"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-09-01T01:06:09.919Z
---

Pedro + Izabela (contadora) gravaram uma constituição REAL na JUCEMG campo a campo (31/08). 141 prints em `execucao/telas-jucemg-img/`, mapeados em `execucao/telas-jucemg-mapeamento-prints.md`. É fonte MAIS forte que o PDF oficial da JUCEMG — o PDF descreve os passos, a gravação mostra os valores de cada campo.

**Why:** antes disso, boa parte do que o app assumia sobre a JUCEMG era inferência. O cruzamento achou 2 campos documentados ERRADOS (tipo de unidade era "Sede", é "Produtiva"; metragem era "não implementado", é 20m² fixo) e 1 bug que teria travado cliente real.

**How to apply:** ao mexer em qualquer campo do flow de constituição, conferir contra os prints ANTES de assumir. Os 2 achados que mais mudam decisão: (1) anexar procuração/anexo no processo **derruba a elegibilidade ao Registro Automático** da JUCEMG — mata o debate da procuração da Junta (aberto desde UX-31/julho); (2) apartamento **exige** sócio residente senão a Prefeitura de BH indefere.

Ver [[legalize-mapa-flow-vivo]] (flow-data.mjs é a fonte única) e o marco `2026-08-31-gravacao-jucemg-e-fusao-status.md`.
