---
name: legalize-risco-cnae-norma-de-bh-prevalece
description: 18/09 - a whitelist de CNAE usa a CGSIM 51/2019 (federal SUBSIDIARIA); em BH prevalecem o Decreto 17.245/2019 e a Portaria SMSA 0221/2022, que nunca lemos.
metadata:
  type: project
---

**O filtro de baixo risco da whitelist esta apoiado na norma errada para a unica cidade onde atendemos — ou pelo menos, na norma que so vale quando nao ha outra.**

`risco_baixo_cgsim` vem da **Resolucao CGSIM 51/2019** (`pesquisa/cnae-matriz/fontes-oficiais/cgsim-res51-baixo-risco.pdf`): 284 CNAEs de 1.332. A Lei 13.874/2019 define essa lista como valida **na ausencia de legislacao estadual ou municipal propria**. BH tem a sua:

| Vertical | Instrumento que manda em BH |
|---|---|
| Alvara de Localizacao e Funcionamento | **Decreto Municipal 17.245, de 19/12/2019**, Anexo I |
| Sanitario (GVISA) | **Portaria SMSA/SUS-BH 0221/2022**, Anexos I-VII |

**Nunca lemos nenhum dos dois.**

**Why:** achado em 18/09, na pesquisa de risco medio, citado com fonte: *"Em Belo Horizonte, a legislacao municipal prevalece de forma absoluta."* 🔑 **Nao esta provado que erramos — esta provado que nao sabemos.** As listas podem coincidir. Se a de BH for mais estreita, ha CNAE na whitelist que trava na abertura, e o cliente descobre **depois de pago**. Errar para o lado otimista custa mais que oportunidade perdida.

**How to apply:** ao voltar com a transcricao dos dois anexos (prompt em `pesquisa/prompts/prompt-transcricao-anexos-risco-bh.md`), o primeiro cruzamento e contra os **80 cobraveis**, nao contra os 48 candidatos. Os dois anexos viram COLUNA na `cnae-matriz.json` (`risco_bh_alf`, `risco_bh_sanitario`), e o `risco_baixo_cgsim` passa a ser **fallback federal**, nao verdade.

📊 Da rodada dos 48 (0 🟢 · 1 🟡 · 6 🔴 · 41 ⚪), tres coisas fecharam com fonte e valem guardar: o **corte dos 28 CNAEs de saude estava certo** (Portaria 221/2022 Anexo I poe as divisoes 86/87 em Alto Risco, com RT em conselho e inspecao previa) · o **nivel II permite liberacao automatica** com roteiro de autoinspecao e Termo de Ciencia, sem vistoria previa (Lei 13.874/2019 + Decreto 10.178/2019) · e 🔑 o **Registro Automatico da JUCEMG NAO depende do nivel de risco** (IN DREI 81/2020 arts. 35-36): o risco trava o alvara municipal, **nao a criacao da empresa**. ⚠️ Ressalva: 3 dos 7 vereditos com veredito se apoiaram em listas da Vigilancia Sanitaria do **Rio Grande do Norte**, e um citou resolucao CGSIM revogada — fonte de outro estado nao classifica atividade de BH.

Ver [[legalize-cnae-complexidade-abertura]] · [[legalize-cnae-fundamentos-ratificados-mei-vs-me]] · [[legalize-regua-de-prova-fonte-oficial]].
