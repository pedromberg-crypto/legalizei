---
tipo: referencia
status: vivo
data: 2026-07-17
fonte: contabilizei.com.br
confianca: nao-ratificado
---
# CNAEs atendidos (Contabilizei) — hub de trabalho

> Ponto de entrada dos **387 CNAEs** que a Contabilizei declara atender, com dado fiscal estruturado. Nasceu do flow de 17/07. Detalhe do método e cobertura em [[contabilizei-cnae-completo-relatorio]].

## Onde está o dado
- **`contabilizei-cnae-completo.json`** — fonte de verdade (aninhado, fidelidade total). 387 registros.
- **`contabilizei-cnae-completo.csv`** — mesma coisa achatada; **tabela de trabalho**.
- **`cnae-atendidos.base`** — Base do Obsidian (3 views: Todos · Fila Larissa · Com Fator R). Consulta **notas** com `tipo: cnae-atendido`; enche conforme promovermos CNAEs pra nota (modelo dataset-first).

## Modelo de trabalho (decisão 17/07)
Dataset primeiro; **promover pra nota só o que a gente quiser** (feature-âncora, disputados, ratificados Larissa). O CSV/JSON é a fonte; nota é derivada sob demanda. Reversível, sem poluir grafo.

## O que cada registro tem
`cnae_fmt` · `descricao` · `atende` · `incluido_simples` · `pode_mei` · `anexos` (III/V) · `aliquotas_faixa` (piso→teto do anexo) · `fator_r` · hierarquia completa (`secao`…`classe`, com códigos) · `atividades_compreende` · `atividades_nao_compreende` · `descritores` · `relacionados` · `fontes` · `_status`/`_flags`/`_nota`.

**Origem dos campos** (anti-guru): a maioria **lida** do estado `__NUXT__` da página; `cnae_fmt` e `aliquotas_faixa` **derivados** (formatação / tabela fixa do Simples); `fontes` **fixas**. Detalhe em [[contabilizei-cnae-completo-relatorio]].

## Dúvidas abertas (fila humana → [[fila-validacao-humana]])
- **3 sem anexo do Simples** na origem — na verdade **2** após limpeza: `6612-6/05` (agentes de investimento) e `6911-7/02` (auxiliares da justiça). IBGE **não traz** anexo (classificação ≠ tributação). → Larissa define o anexo.
- **1 mantido apesar de `atende=false` na página:** `8020-0/01` (monitoramento de segurança) — decisão do Pedro manter.
- **3 atacados removidos** (a própria página dizia não-atende): `4530-7/01`, `4530-7/02`, `4541-2/02`.

## Ligações
[[contabilizei-tabela-cnae]] (bruto da tabela-resumo, 417) · [[contabilizei-cnae-atendidos]] (whitelist 414→387) · [[cnae-fiscalmente-otimo]] · [[fila-validacao-humana]]
