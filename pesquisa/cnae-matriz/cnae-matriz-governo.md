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

## Camada 2 — Overlay tributário (anexo / Fator R / alíquota) ⚠️
- `anexo_base`: **nível confiável por regra** — Comércio (seção G) = **Anexo I** (226); Indústria (B/C) = **Anexo II** (465); Serviços = **III/IV/V*** (641, asterisco = anexo exato depende da atividade + Fator R).
- `fator_r` e `aliquota_inicial`: **VAZIOS de propósito.** Realidade honesta: **NÃO existe dataset único oficial e limpo** de anexo/Fator R por CNAE — a lei (LC 123 / Res. CGSN 140) define por regra/atividade, não num mapa plano.
- **É federal, NÃO varia por cidade** (BH = SP = qualquer lugar). Construído uma vez, serve pra sempre.
- **Como preencher (on-demand, pelo nosso nicho):** cruzar 2 fontes por CNAE relevante — (a) contabilidade.com/blog (tem página por CNAE com anexo/Fator R/alíquota), (b) tabela da própria Contabilizei — e registrar divergências. Precisão fina = entregável da **camada fiscal / spike da imersão** (§13 da base). Anti-guru: não inventamos anexo pra 1332 códigos.

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
