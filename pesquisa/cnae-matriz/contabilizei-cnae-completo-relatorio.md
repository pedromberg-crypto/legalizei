---
tipo: referencia
status: vivo
data: 2026-07-17
fonte: contabilizei.com.br (páginas individuais de CNAE, estado __NUXT__)
confianca: nao-ratificado
cobertura: 390/390
---
# Extração completa — tabela CNAE da Contabilizei (390 atendidos)

> Dataset estruturado dos **390 CNAEs** que a Contabilizei declara atender, raspados **um a um** da página individual de cada código. Fonte-verdade do cruzamento fiscal. Ver também [[contabilizei-tabela-cnae]] (extração bruta da tabela-resumo) e [[fila-validacao-humana]].

## Arquivos (gêmeos)
- **`contabilizei-cnae-completo.json`** — fidelidade total (listas e objetos aninhados). Fonte de verdade.
- **`contabilizei-cnae-completo.csv`** — mesma coisa achatada, pronto pra **Base** do Obsidian e pro dev.

## Como foi feito (método)
1. Site é **Nuxt/SSR**: cada página traz o dado completo embutido em `window.__NUXT__` (não é API separada, não é HTML renderizado).
2. `curl --compressed -L` por CNAE → extrai o `__NUXT__` → executa em **sandbox isolado do Node** (`vm`, contexto vazio) → objeto estruturado.
3. Throttle gentil (concorrência 3, delay, retry com backoff) depois que a rajada inicial (concorrência 8) disparou rate-limit em 147 páginas. **Recuperados 100%.**

## Cobertura
| | |
|---|---|
| Alvos (CNAEs únicos atendidos) | 390 |
| Capturados | **390** |
| Faltando / duplicados / extras | 0 / 0 / 0 |
| OK (sem flag) | 384 |
| Com dúvida | 6 |

## Origem de cada campo (anti-guru)
- **Lido da fonte:** codigo, descricao, atende (`atendidoContabilizei`), incluido_simples, pode_mei (`atividadeMei`), anexos, fator_r, hierarquia (com códigos + seção), atividades_compreende, atividades_nao_compreende, descritores, relacionados.
- **Derivado (determinístico):** cnae_fmt (formatação do código) · aliquotas_faixa (tabela fixa do Simples por anexo: III=6→33%, V=15,5→30,5%, etc.).
- **Fixo (constante em todo CNAE):** fontes (LC 123 + CGSN 140/2018 com link; CONCLA/IBGE sem link na origem).

## Dúvidas p/ verificação humana (6) — todas confirmadas como valor real da fonte
**atende=FALSE na página, mas "Atende" na tabela-resumo** (contradição da própria base deles; a página é mais específica):
| CNAE | atividade | anexo página |
|---|---|---|
| 4530-7/01 | Com. atacado peças/acessórios p/ veículos | — |
| 4530-7/02 | Com. atacado de pneumáticos e câmaras de ar | I |
| 4541-2/02 | Com. atacado peças p/ motocicletas | — |
| 8020-0/01 | Monitoramento de sistemas de segurança eletrônico | — |

**Sem anexo na fonte** (atende=true, mas `anexos:[]` — Simples não mapeado na página):
| CNAE | atividade |
|---|---|
| 6612-6/05 | Agentes de investimentos em aplicações financeiras |
| 6911-7/02 | Atividades auxiliares da justiça |

## Confiança
- **Fidelidade da captura: ALTA.** 390/390, método verificado contra a página e contra o IBGE (zeros à esquerda). As 6 dúvidas foram re-checadas: são valor real da fonte, não erro de raspagem.
- **Veracidade fiscal: NÃO-RATIFICADA.** É o que a Contabilizei afirma, não fato. Insumo pra Larissa cruzar — ver [[fila-validacao-humana]].
