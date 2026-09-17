---
name: legalize-cnae-camada-tributaria-4-dados-completa
description: "Os 4 dados tributários que faltavam na matriz CNAE (MEI, risco municipal, Anexo/Fator R, ISS BH) foram todos mapeados 27/08 — onde cada um veio e o que ficou pendente"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2ccc846-d594-41b7-93a1-f6220ff1b9b1
  modified: 2026-08-27T15:43:51.981Z
---

Fechamos a camada tributária da `cnae-matriz/` (1332 CNAEs, IBGE) em 27/08/2026, na ordem escolhida por tratabilidade:

1. **MEI** (Anexo XI CGSN140, PDF oficial Receita) — 351/1332 permitem MEI.
2. **Risco municipal** (CGSIM Anexo I, Res. 51/2019, PDF já estava no vault) — 284/1332 baixo risco.
3. **Anexo III/IV/V + Fator R** — confirmado que **não existe crosswalk oficial CNAE→Anexo em lugar nenhum** (nem lei, nem CGSN140, nem PGDAS-D — o manual oficial do PGDAS-D diz que o contador escolhe o grupo manualmente na tela, o sistema não deriva do CNAE). Classificado via regex contra a descrição oficial IBGE de cada CNAE cruzada com os 5 grupos taxativos do Art. 18 LC123 (texto extraído do Planalto, separando manualmente redação vigente de redação revogada — a página mistura as duas sem marcação limpa). 481 III-fixo · 47 Fator R dinâmico · 51 Anexo IV · 62 `requer-revisao` (ambíguo, marcado, não chutado).
4. **ISS por CNAE (BH)** — ao contrário do #3, aqui EXISTE crosswalk oficial: BH estrutura o Anexo Único da Lei 8.725/2003 direto por CNAE (planilha oficial `fazenda.pbh.gov.br/iss/cnae/tabelactiss.xls`). 524/1332 com alíquota, 66 CNAEs com mais de uma alíquota (real, não erro — CNAE amplo cobre serviços concretos diferentes tributados diferente).

**Achado bônus:** CGSN140 tem Anexo VI (101 CNAEs vedados ao Simples inteiro) e Anexo VII (21 ambíguos) — achado procurando o crosswalk do #3, não fazia parte do pedido original, mas é filtro de segurança útil (nenhum CNAE vedado deve virar recomendação de produto).

**Why:** cada um tinha tratabilidade diferente — 2 eram lista fechada oficial pronta pra parsear (MEI, risco), 1 não tinha fonte nenhuma e exigiu interpretação jurídica against a descrição IBGE (Anexo/FatorR), 1 surpreendeu por ter fonte oficial direta (ISS, porque é municipal e BH escolheu indexar por CNAE).

**How to apply:** a coluna `anexo_fator_r_grupo` (#3) **NÃO foi ratificada por contador** — precisa do mesmo tratamento que `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` já exige pras próprias famílias dele (Larissa assina) antes de virar verdade de produto. Os 62 `requer-revisao` (#3) + 2 órfãos do CGSIM (#2, CNAE renumerado: 5611-2/02, 4541-2/05) + 2 órfãos do ISS BH (#4, CNAE renumerado: 7410-2/01, 9609-2/03) são pendências pontuais documentadas, não bloqueantes. Próximo passo real (ainda não feito): cruzar essa camada nova contra `contabilizei-cnae-completo.*`, `cnae-complexidade-abertura.*`, `cnae-liso-servico.md` — foco em achar CNAEs marcados "atende MEI" no dado antigo que contradizem a coluna `mei_permitido` nova (fonte primária). Detalhe completo em `pesquisa/cnae-matriz/cnae-matriz-governo.md` §2a-2d e `pesquisa/estado-atual-pesquisa-cnae.md` (torre de controle).
