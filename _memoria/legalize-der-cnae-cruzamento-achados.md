---
name: legalize-der-cnae-cruzamento-achados
description: "Cruzamento do DER modelagem-cnae.drawio (Downloads) contra o vault — pausado 27/08 no meio, achados relevantes já levantados antes de parar"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2ccc846-d594-41b7-93a1-f6220ff1b9b1
  modified: 2026-08-27T16:34:14.547Z
---

Pedro trouxe `modelagem-cnae.drawio` (DER Chen: CNAE/ENQUADRAMENTO/EMPRESA/SIMULAÇÃO DE ENQUADRAMENTO/SAÍDA DE LEAD) pra cruzar com o que evoluímos em [[legalize-cnae-camada-tributaria-4-dados-completa]] e [[legalize-equacao-fiscal-camadas-cnae-cnpj]]. Cruzamento **pausado por decisão do Pedro em 27/08**, no meio — achados já levantados, não retomar do zero.

## Achados confirmados (fork de pesquisa, lido arquivo por arquivo)

1. **Referências fantasma no DER.** A nota do diagrama cita `regras-cnae-anexos-fator-r.md`, "vault 40-ambiguidades" e "divergencias #5" como pendências — **nenhum dos 3 existe no repo**. Eram placeholders de intenção nunca virados arquivo. O conteúdo real que resolve a pendência de "regra CNAE→anexo→alíquota" está em `pesquisa/cnae-matriz/cnae-matriz-governo.md` §2c (feito 27/08).

2. **Decisão "escopo-anexos-3-e-5" também não existe como ADR** em `marca/decisoes-marca.md` (lido inteiro, 145 linhas, 0 match). O motor real (`execucao/cnae-fiscalmente-otimo.md`, tipo:verdade) já modela 3 grupos incluindo Anexo IV — não só III/V.

3. **Divergência real código×motor (achado mais importante pro produto):** `app/src/lib/fiscal.ts` (outra sessão mexendo nele hoje) só tem constantes pra Anexo III e V (`ANEXO_III: 0.06`, `ANEXO_V: 0.155`) — **sem Anexo IV**. Mas achamos 51 CNAEs reais em Anexo IV hoje (construção inteira + limpeza/vigilância + advocacia). Se um usuário escolhe CNAE de construção/advocacia hoje, o cálculo fiscal provavelmente sai errado. **Ainda não reportado/corrigido no código** — é achado a levar pra sessão de código.

4. **Ponto positivo:** `FATOR_R_MARGEM: 0.3` vs `FATOR_R_LIMIAR: 0.28` em `fiscal.ts` já bate exatamente com o que ratificamos (28% limiar legal, 30% margem de mercado sem previsão oficial). Sem bug aqui.

5. **Telas do flow confirmadas reais** (`produto/_flow/flow-data.mjs`): E5A, E5V, E5.1, E5.2, E5.3, C5 todos existem e batem com o texto do DER. `E5F` (faixa de faturamento) é onde Fator R começa a ser alimentado no flow — mapeia com `SIMULAÇÃO DE ENQUADRAMENTO.faixa de faturamento`. **Não confirmado**: onde pró-labore é capturado no flow (pergunta em aberto, não investigada até parar).

6. **Gap estrutural do DER vs a provocação da "equação viva":** ENQUADRAMENTO no DER só tem atributos `anexo`/`alíquota`/`padrão` — **não modela MEI, risco municipal, nem ISS** (os outros 3 dados que mapeamos hoje). E o desenho inteiro **não tem nenhuma entidade de versionamento/vigia** — nada que capture "qual versão da regra valia quando o CNPJ travou" nem notificação de mudança regulatória.

## Sugestões que dei (não executadas ainda)
1. Trocar as 3 referências fantasma por links reais no DER.
2. Tirar tracejado de `anexo`/`alíquota` (dado existe, mas manter selo "não ratificado por Larissa").
3. Adicionar atributos/entidade pra MEI, risco, ISS em ENQUADRAMENTO.
4. Adicionar entidade de versionamento linkada a ENQUADRAMENTO + EMPRESA pra suportar a vigia.
5. Levar o achado #3 (Anexo IV faltando em `fiscal.ts`) pra quem está codando.

## Estado ao pausar
Não editei o `.drawio` (arquivo em Downloads, fora do vault, não versionado). Não decidimos se eu redesenho a v2 do DER ou se isso vira trabalho de outra sessão/código. Fusão pendente de `cnae-complexidade-abertura.md` + `cnae-liso-servico.md` (pedida antes desse cruzamento) **também não foi feita** — segue na fila.
