---
name: legalize-escopo-mei-lucro-presumido-aberto
description: "MEI confirmado no escopo (inclusive Migrar) 04/08; Lucro Presumido segue fora, precisa de pesquisa fiscal dedicada."
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-04T14:50:53.027Z
  originSessionId: 991e56f5-5ee7-40db-8fc3-4a7469fc0873
---

**RESOLVIDO PELA METADE em 04/08.** A pendência de 03/08 (Pedro mencionou MEI+LP sem confirmar) virou decisão explícita, mas só pra metade do escopo.

**MEI: CONFIRMADO 🟢 (04/08).** Pedro: "vamos atender esse pessoal". Reverte de vez a decisão 08/07 ("ICP mantido = MEI fora do foco"). MEI já estava na Abertura desde 03/08 ([[legalize-reordenacao-e-telas-em-codigo]] — E3.2, `regime.ts`); em 04/08 entrou também no **Migrar** (`/migrar/cnpj` não bloqueia mais MEI). Achado no meio do caminho: MEI não é obrigado a ter contador (DASN-SIMEI autodeclaratório), então migrar um MEI pode não ter TTRT/CRC-MG pra transferir — resolvido com subfluxo "você tem contador hoje?" em `/migrar/diagnostico?regime=mei` (sim = pipeline normal de transferência; não = pula M4 inteiro, vai direto pro M5). ADR em `marca/decisoes-marca.md` (linha 2026-08-04).

**Lucro Presumido: SEGUE FORA 🔴 (04/08, decisão explícita, não omissão).** Pedro: "Lucro Presumido mantemos na saída de não atendemos ainda". `/saida/regime-nao-suportado` agora é EXCLUSIVA de Presumido (MEI saiu de lá). Motivo técnico por trás da decisão: Presumido usa motor fiscal totalmente diferente do Simples (IRPJ 15%+adicional, CSLL 9%, PIS/COFINS cumulativo, ISS separado, % de presunção por atividade) — não é "trocar 1 número" no `fiscal.ts`, é um motor novo, e nenhuma pesquisa nossa cobre isso hoje (`fiscal-simples-bh-2026.md` é 100% Simples). Segue em `execucao/parking-lot.md` item I (15/07) até rodar pesquisa fiscal dedicada — mesmo processo que gerou o doc do Simples. **Não presumir que "vamos atender esse pessoal" também vale pra LP — foi excluído explicitamente na mesma frase.**

Ver [[cruzamento-gemini-fluxo-migracao]] (achou o gap que disparou a decisão) e [[legalize-mvp-so-servico-cnae]].
