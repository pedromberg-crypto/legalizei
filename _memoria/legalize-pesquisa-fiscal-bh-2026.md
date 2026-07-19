---
name: legalize-pesquisa-fiscal-bh-2026
description: "Pesquisa fiscal oficial (3 rodadas nossas + 2 docs Gemini cruzados) p/ Simples·ME serviço·BH 2026 em pesquisa/fiscal-simples-bh-2026.md; H·I·D-resíduo FECHADOS + bloco CONSOLIDADO (fonte-verdade do flow); 7 pontos na fila-Larissa."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6a4bf385-f126-45e0-bd08-cd2eece6bc93
---

**🆕 RODADA 4 (2026-07-19) — fonte primária fechou 8 pendências.** **A taxa da
JUCEMG virou R$ 268,51 (ME)** · EPP 275,24 · demais 280,61 · personalizado 429,61
— **o R$288 morreu** (era o número mais repetido e menos verificado do vault,
divergência aberta desde 09/07; contrato padrão está congelado desde 2018 e a
revisão de setembro subiu só o personalizado). **A CPP recolhida no DAS ENTRA no
numerador do Fator R** (SC COSIT 17/2021, sijut2 oficial) → resolve a pendência da
Larissa **e faz o pró-labore ótimo ficar MENOR**, mudando o N18. Também fechados:
FS12 caixa × RBT12 competência · Fator R de empresa nova (1º mês ×12, depois média
×12) · **Anexo III faixa 2 = 11,20% / deduzir R$9.360** · **Anexo V faixa 2 = 18% /
deduzir R$4.500** · teto ME R$360k · prazo do Simples (30d da última inscrição,
teto 60d do CNPJ). **Custo de governo: ~R$437** (268,51 + ~168,48 de TFLF).
🟡 novos: **Lei 15.270/2025** (lucros 10% acima de R$50k/mês — **não atinge o ICP**,
e os artigos citados não foram verificados) · **Portaria SMFA 75/2025** (BHISS
extinto → NFS-e Nacional com certificado; se confirmar, derruba o passo da Izabela)
· **TFLF conflita com o caso real do Pedro** (dia ~40 × edital de abril → provável
que sejam 2 eventos). ⚠️ **o relatório de origem inflou confiança** (100% pra blog):
só o que tem norma + URL virou 🟢. Prompt cirúrgico da rodada 5 pronto, não rodado.

3 rodadas de deep-research em fonte OFICIAL + cruzadas com 2 relatórios Gemini das mesmas perguntas, salvas em [[fiscal-simples-bh-2026]]. Escopo: Simples · ME serviço · BH/MG · 2026. Double-check final = Larissa. **Usar o bloco `✅ CONSOLIDADO` no fim da nota — funde tudo, marca 🟢 travado / 🟡 fila-Larissa.**

**Cruzamento Gemini (15/07): sem contradição dura.** Onde diverge = completude ou redação, não fato oposto.

**FECHADO 🟢 (as 3 lacunas que faltavam):**
- **H · Fator R:** fórmula FS12÷RBT12 (12m anteriores, exclui mês corrente); **≥28%→III(6%) / <28%→V(15,5%)**; recém-aberta = **anualização** (art.26 §4º); **mês 1** = folha do mês÷receita do mês (casos-borda 0,28/0,01, §6º); migração 12+m = histórico REAL. Folha = pró-labore+salário+13º+CPP/FGTS recolhidos; fora lucro/aluguel/MEI/estagiário/INSS-retido (§24).
- **D-resíduo:** **INSS pró-labore = 11% DIRETO** (não 11%×20% — refutação histórica RESOLVIDA, Gemini converge 100%); base R$1.621–8.475,55, máx **R$932,31/mês**; **CPP 20% dentro do DAS** nos III/V (só Anexo IV à parte) → MVP sem guia patronal separada; Anexo III 6,00% / V 15,50%.
- **I · migração de contador:** Gemini tapou o buraco → Distrato → **TTRT CRC-MG** → **DBE Evento 232** (atualiza RFB+Sefaz-MG+PBH) → procuração e-CAC nova; obrigações do período antigo ficam com o contador anterior; acervo pertence à empresa.

**🟡 FILA-LARISSA (7):** (A) mecânica exata Fator R meses 2–12 — nós refutamos "média×12" (1-2), Gemini crava 100%, mas ×12 cancela na razão → provável convergência; (B) **CPP-no-DAS entra no numerador?** Gemini sim / §24 estrito não → muda simulador B2; (C) **FS12 regime de CAIXA** (COSIT 17/2021, achado novo) → atrasar pró-labore derruba Fator R no mês; (D) nº resolução CFC (1.590/2020?) + código Evento 232 (possível citação trocada Gemini); (E) lista exata CNAE III×Fator-R×IV; (F) DEFIS+eSocial sem movimento; (G) taxas municipais BH + faixa e-CNPJ.

**Próximo:** consolidado alimenta o motor de testes + flow entrada→B4 nas personas. B2 usa o simulador Fator R (marca "estimativa" até A+B+C da Larissa). Deriva de [[legalize-blocos-fluxo-abertura]] · liga [[legalize-mvp-so-servico-cnae]] · [[legalize-motor-testes-arquitetura]].
