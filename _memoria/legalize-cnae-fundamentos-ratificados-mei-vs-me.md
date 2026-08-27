---
name: legalize-cnae-fundamentos-ratificados-mei-vs-me
description: "Fundamentos de CNAE/Fator R/MEI ratificados por pesquisa fonte-primária 27/08 — MEI é filtro jurídico separado do Simples ME, não existe lista oficial \"sempre Anexo V\", sem margem de segurança legal nos 28%"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2ccc846-d594-41b7-93a1-f6220ff1b9b1
  modified: 2026-08-27T13:57:33.798Z
---

Pesquisa dedicada (Gemini, fonte primária: LC 123/2006, Res. CGSN 140/2018, Art. 966 CC, SCs Cosit) ratificou `pesquisa/cnae-matriz/fundamentos-cnae.md` (agora v2) em 27/08/2026. Três achados não-óbvios, todos com fonte legal exata documentada na nota:

1. **Não existe lista oficial de CNAE "sempre Anexo V".** Desde a LC 155/2016 (revogou o Anexo VI), Anexo V é penalidade condicional pra quem não bate 28% de Fator R nas atividades do §5º-D/§5º-I — nunca é destino fixo. Só existe lista fechada de "sempre Anexo III" (§5º-B).
2. **MEI é filtro JURÍDICO separado do Simples ME, não o mesmo filtro com teto de faturamento menor.** Base: Art. 100 Res. CGSN140 c/c Art. 966 (parágrafo único) do Código Civil — exclui profissão intelectual/científica/técnica do conceito de "empresário". Exemplo mais didático: contabilidade (6920-6/01) é Anexo III privilegiado no Simples ME, mas **vedada ao MEI**. Regra prática: atividade intelectual/técnica/regulamentada (dev sob encomenda, advocacia, medicina, engenharia, arquitetura, odontologia, contabilidade, consultoria em gestão, fisioterapia, veterinária) nunca oferece caminho MEI, mesmo que sirva pro Simples ME.
3. **Não existe margem de segurança oficial nos 28% do Fator R.** É limiar binário e seco na lei; buffer de 30-32% é prática de mercado, não regra do CGSN/LC123. Decisão de produto (que buffer o simulador usa como alerta preventivo) fica em aberto, não é dado de pesquisa.

**Why:** essas 3 hipóteses estavam marcadas 🔑 (não confirmadas) no V1 de `fundamentos-cnae.md`; a pesquisa fecha o gap antes de reclassificar a `cnae-matriz/` de verdade.

**How to apply:** ao cruzar/reclassificar `cnae-matriz.csv/json` (1332 CNAEs, cobertura completa IBGE CNAE 2.3, todas as 21 seções — confirmado 27/08, não só serviço), o risco maior é achado 2: qualquer CNAE marcado "atende MEI" que seja atividade intelectual/regulamentada precisa ser barrado. Motor `execucao/cnae-fiscalmente-otimo.md` foi cruzado e bate sem contradição (não cobre §5º-C/Anexo IV ainda, que é escopo separado). Cross-check completo (matriz × tabela Contabilizei × complexidade-abertura) ainda **não foi feito** — é o próximo passo pendente, não travado. Detalhe completo em `pesquisa/cnae-matriz/resultado-pesquisa-fundamentos-cnae-27-08.md` e `pesquisa/estado-atual-pesquisa-cnae.md` (torre de controle deste processo).
