---
name: legalize-cnae-complexidade-abertura
description: eixo NOVO (ortogonal ao fiscal) que separa CNAE que abre sozinho (liso) do que precisa de humano/tato; 387→170/120/97; 103 serviço-liso = happy path MVP
metadata: 
  node_type: memory
  type: project
  originSessionId: 601a6913-bbd4-4193-878a-0bfa86ca2923
---

Eixo de **complexidade de abertura** criado 2026-07-17 (3º flow). Responde "quais CNAEs a Legalizei abre sozinha × quais precisam de tato" — o "asterisco" da Contabilizei, reconstruído por **fonte oficial** (o dado NÃO existe no site dela).

**3 níveis, regra determinística re-executável** (prioridade: registro > licenciamento > liso):
- `tato-registro` (97) = exige conselho de classe OU órgão setorial (~17 fechados: CRM/OAB/CRC/CREA/CADASTUR/PF/MEC/Bacen/CORE…).
- `verificar-licenciamento` (120) = fora do baixo-risco CGSIM → licença municipal (médio provisório OU alto vistoria).
- `liso` (170) = baixo risco A (CGSIM Res 51/2019 Anexo I) **e** sem conselho/setorial.

**Happy path do MVP = 103 serviço-liso** (liso ∩ serviço puro: Anexo III/IV/V, sem I comércio/II indústria). Escada de expansão até os 387 documentada = backlog/feature. Arquivos em `pesquisa/cnae-matriz/cnae-complexidade-abertura.{md,json,csv}` + `cnae-liso-servico.{md,csv}` + `cgsim-res51-baixo-risco.pdf`.

**Regras duras:** falso-liso é o pecado (cobra antes de barrar), falso-tato é conservador → só marca liso quem está na lista oficial. Médio×alto dos 120 = **municipal (Art 5º), DEFERIDO** (REDESIM-MG bloqueado eleitoral; JUCEMG Dec 49.013/25 só expande baixo; próxima fonte = BH/Bombeiros/Vigilância). Confiança: liso confirmado por nós sobre fonte oficial; "atende" ainda herdado da Contabilizei, **não ratificado** por contador → Larissa.

Base das **17 pills** do N4 → [[legalize-telas-padrao-layout]]. Compreende/não-compreende da Contabilizei = taxonomia de escopo (Mapa de Confusão), NÃO este eixo. Fiscal → [[legalize-anexos-simples-etiquetas]] · [[legalize-cnae-fiscalmente-otimo]].
