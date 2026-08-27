---
tipo: derivado
status: vivo
data: 2026-07-09
assunto: matriz-cnae
tags: [cnae, matriz, reference]
---

# 🧮 Matriz CNAE — fonte-verdade do governo + cobertura de concorrentes

> Espinha canônica de CNAE (IBGE oficial) + camadas cruzáveis (tributário + cobertura por concorrente). Base pra relatórios ricos: "quem atende o quê". Arquivos: `cnae-matriz.csv` (Bases/Excel) e `cnae-matriz.json` (scripts).

## Camada 1 — Espinha (fonte-verdade) ✅
- **Fonte:** API oficial IBGE `servicodados.ibge.gov.br/api/v2/cnae/subclasses` (o IBGE é o dono da classificação CNAE). Pull completo (bulk, 1 chamada, todos os 1332 de uma vez) em **27/08/2026**.
- **1332 subclasses**, 21 seções. Campos completos capturados: `cnae` (id), `descricao`, `secao`/`secao_id`, `divisao_id`, **`grupo_id`/`grupo_descricao`** (nível 3, faltava antes), `classe_id`, **`classe_observacoes`** (o que a classe compreende/NÃO compreende, com exclusões cruzadas pra outros CNAEs), **`subclasse_observacoes`** (mesma coisa no nível fino da subclasse), **`atividades`** (exemplos de negócio real que caem naquele código — ótimo pro motor de matching descrição→CNAE).
- Antes só tínhamos 6 campos de taxonomia pura; `observacoes`+`atividades` cobrem os 1332 códigos direto da fonte oficial (antes só 387 via scrape da Contabilizei, ver Camada 3).
- Confiança: **ALTA** (oficial). Não precisa cruzar — cruzar seria comparar com cópias do IBGE.

## Camada 2 — Overlay tributário (4 dados que faltam, fora do IBGE)
Nenhum dos 4 abaixo é dado do IBGE — são outros órgãos, cada um com tratabilidade diferente. Ordem de ataque combinada com Pedro 27/08: MEI → risco municipal → Anexo/Fator R → ISS.

### 2a. Elegibilidade MEI ✅ feito (27/08)
- **Fonte:** Anexo XI da Resolução CGSN 140/2018 (PDF oficial Receita Federal, arquivado em `cgsn140-anexo-xi-mei-ocupacoes.pdf`). Lista fechada, 471 linhas de ocupação, 43 páginas.
- Parseado (regex, 0 gaps, 100% das linhas capturadas) → **351 dos 1332 CNAEs permitem MEI** (~26%). Colunas novas na matriz: `mei_permitido` (sim/nao), `mei_ocupacoes` (nome oficial da ocupação, pode ter mais de uma por CNAE), `mei_iss_fixo_das`/`mei_icms_fixo_das` (S/N — se aquele código soma R$5/R$1 na guia fixa do Simei; **não é a alíquota municipal de ISS**, é só o adicional fixo do DAS-MEI).
- Sanity check: contabilidade (6920-6/01) = `mei_permitido: nao` — bate com o que a pesquisa fonte-primária ratificou em [[fundamentos-cnae]] (MEI é filtro jurídico Art. 966 CC, não "Simples ME com teto menor").
- 1 CNAE (2532201) tem 2 ocupações com ISS/ICMS-fixo diferentes entre si — marcado `varia-por-ocupacao`, não é erro de parsing.
- Confiança: **ALTA** (fonte primária, parsing validado sem gaps).

### 2b. Risco municipal (CGSIM Anexo I) ✅ feito (27/08)
- ⚠️ **Não confundir com o Anexo I do Simples Nacional (comércio).** Este é o Anexo I da **Resolução CGSIM 51/2019** (atualizada por 57/2020, 59/2020, 68/2022) — "Nível de Risco I / baixo risco A", dispensa vistoria/alvará prévio. Atravessa TODAS as seções (serviço, comércio, indústria), não é exclusivo de comércio.
- **Fonte:** PDF oficial já estava no vault (`cgsim-res51-baixo-risco.pdf`, 42 páginas, já na versão consolidada com as 3 alterações). Tabela do Anexo I nas páginas 11-42, 287 itens numerados em romano.
- Parseado via âncora `(Código CNAE:NNNNNNN)` — regex sem gap real (1 item, nº 186 "Horticultura, exceto morango", tinha CNAE grafado errado no PDF `1211-0/1`; corrigido manualmente pra `0121-1/01` cruzando com a descrição na matriz IBGE, único match).
- **284 dos 287 itens bateram certo com os 1332 CNAEs atuais.** 2 ficaram órfãos — a resolução usa código CNAE de versão anterior, renumerado depois pelo IBGE:
  - `5611-2/02` "Bares..." → hoje provavelmente `5611-2/04` (bares sem entretenimento) ou `5611-2/05` (com entretenimento); resolução não distinguia essa cisão.
  - `4541-2/05` "Comércio a varejo de peças e acessórios para motocicletas" → hoje provavelmente `4541-2/06` (peças novas) ou `4541-2/07` (usadas); mesma situação.
  - **Não mapeei esses 2 automaticamente** (seria chute) — ficam como pendência se algum dia entrarem no nosso nicho (hoje são fora de escopo, comércio/motocicleta).
- Colunas novas na matriz: `risco_baixo_cgsim` (sim/nao), `risco_cgsim_desc_oficial` (texto exato da resolução, quando sim).
- Sanity check: contabilidade (6920-6/01) e treinamento (8599-6/04) = `risco_baixo_cgsim: sim` — plausível (atividade de escritório, sem risco físico).
- Confiança: **ALTA** (fonte primária, 284/286 = 99,3% de match direto; 2 pendências documentadas, não escondidas).

### 2b-bis. Vedação/ambiguidade ao Simples (CGSN140 Anexo VI/VII) ✅ feito (27/08, achado bônus)
- Não é anexo III/IV/V — é ANTES disso: quais CNAEs são **proibidos** de optar pelo Simples Nacional (banco, corretora, seguradora, cigarro, armas, sindicato/associação, etc.) e quais são **ambíguos** (o código mistura atividade proibida + permitida, ex: fabricar cerveja vs vender cerveja).
- **Fonte:** Anexo VI e VII da Resolução CGSN 140/2018 (PDFs oficiais, gov.br/DREI e normas.receita.fazenda.gov.br, arquivados no repo). Achado ao procurar se existia crosswalk CNAE→Anexo (não existe, ver §2c) — mas esses dois anexos SÃO listas fechadas por CNAE.
- Parseado: **101 CNAEs vedados** (`vedado_simples_cgsn_anexo_vi`) + **21 CNAEs ambíguos** (`ambiguo_simples_cgsn_anexo_vii`). 100% de match com a matriz IBGE, 0 órfão.
- Relevância pro nosso nicho: baixa direta (nosso MVP já é só serviço, esses 122 códigos são majoritariamente indústria pesada/financeiro/comércio de item controlado), mas é filtro de segurança — nenhum CNAE vedado deve aparecer como recomendação em produto nenhum.

### 2c. Anexo III/V + Fator R por CNAE — pendente, é o grande
- `anexo_base`: **nível confiável por regra** — Comércio (seção G) = **Anexo I** (226); Indústria (B/C) = **Anexo II** (465); Serviços = **III/IV/V*** (641, asterisco = anexo exato depende da atividade + Fator R).
- `fator_r` e `aliquota_inicial`: **VAZIOS de propósito.** Realidade honesta: **NÃO existe dataset único oficial e limpo** de anexo/Fator R por CNAE — a lei (LC 123 / Res. CGSN 140) define por regra/atividade (§5º-B lista taxativa Anexo III, §5º-D/§5º-I lista taxativa Fator R), não num mapa plano código→anexo. Maior esforço dos 4: precisa mapear as listas taxativas da lei contra os 1332 códigos.
- **É federal, NÃO varia por cidade** (BH = SP = qualquer lugar). Construído uma vez, serve pra sempre.

### 2d. ISS por CNAE — pendente, menor prioridade
- Municipal (só importa BH no nosso escopo hoje — Lei 8.725/2003 + item LC 116). Parcial em `execucao/cnae-fiscalmente-otimo.md` pra um punhado de códigos do nicho; não cobre os 1332.

## Camada 3 — Cobertura por concorrente (cruzável) 
- `contabilizei_atende`: **atende / nao / condicao** — derivado das listas de suporte da [[contabilizei]] mapeadas p/ divisões/classes CNAE (17 recusadas → `nao`; 7 regulamentadas → `condicao`; resto → `atende` presumido).
  - Distribuição: **804 não · 460 atende · 68 condição.**
  - Confiança: **MÉDIA** (mapeamento categoria→CNAE é aproximado; validar por amostragem). `contabilizei_just` explica cada caso.
- **Próximas colunas:** `agilize_atende`, `contaja_atende`, `facilite_atende`… — cada concorrente novo mapeado = 1 coluna. Aí "quem a Contabilizei recusa mas a Agilize aceita?" = 1 consulta.

## ⚠️ Nuance crítica: CÓDIGOS ≠ EMPRESAS
- Endereçável Contabilizei = 460 atende + 68 condição = **528 de 1332 CÓDIGOS (~40%).**
- MAS esses códigos cobrem a **maioria das EMPRESAS ATIVAS** — serviço + comércio = 82% das empresas ([[PESQUISA-MERCADO]] §L). Poucos códigos de serviço concentram muitas empresas; muitos códigos de indústria/agro concentram poucas.
- **Nunca confundir "% de códigos" com "% de mercado".** Pro sizing, usar peso por empresa, não por código.

## Como usar / estender
1. Abrir `cnae-matriz.csv` no Obsidian Bases ou Excel → filtrar/agrupar.
2. Preencher overlay tributário sob demanda pros CNAEs do nosso nicho (serviço Simples III/V).
3. Mapear novo concorrente = adicionar coluna `<nome>_atende`.

## Fontes
- IBGE servicodados (espinha) · suporte.contabilizei.com.br (cobertura) · contabilidade.com + contabilizei.com.br (overlay tributário, a cruzar) · [[cnae-cobertura]] (o cruzamento SEO×suporte)

## Links
- [[cnae-cobertura]] · [[PESQUISA-MERCADO]] · [[HOME]]
