---
tipo: marco
status: vivo
data: 2026-08-25
area: organizacao
impacto: alto
tempo-gasto: 1 dia
tags: [reorganizacao, vault, financeiro, meta]
---

# Reorg completa do vault + criação de `financeiro/`

Pedro pediu pra agir como PM e conduzir a reorganização de todo o repositório. Processo: inventário real (Bash, não memória) → doc de proposta `_sistema/2026-08-25-mapa-pastas-cruzamento.md` (pasta a pasta, com ação sugerida: mover/fundir/linkar/decisão aberta + justificativa) → validação linha a linha com o Pedro → execução em 8 commits (`75a860d` → `e158a41`).

## O que mudou

- **`execucao/`** ganhou taxonomia (`specs/`, `handoffs/`, `operacional/`, `pitch-investidor/`) — era dumping ground com 47+ arquivos soltos na raiz.
- **`pesquisa/`** raiz separada em pesquisa de base (fica) vs estratégia/tática de marketing (saiu).
- **`financeiro/`** criado do zero — domínio novo com `estado-atual.md` (arquivo mãe, não é log, sempre reflete o preço/CAC/margem validado) + `pesquisa/` (análise de suporte).
- **`_arquivo/`** criado pra guardar o morto com valor histórico (`diario/`, `reorganizacao-flow-design/` travada desde 30/07, protótipo pré-código).
- `marca/marca.md` entrou em `conceito/`; `pesquisa/anexos-simples/` virou subpasta de `cnae-matriz/`.
- `_sistema/indice-autoridade.md` ganhou a linha "PREÇO de plano · CAC-alvo · margem/custo" que faltava.

## Achado real no processo

Testando o próprio resultado (pergunta do Pedro: "se eu perguntar o preço, você me traz 1 resposta validada?"), confirmei que **não, não automaticamente** — o preço certo só saía se eu soubesse ler `decisoes-marca.md` (ADR cronológico) até a entrada mais recente. Achei 3 docs (`posicionamento.md`, `estrategia-organica.md`, `frente-1-captacao-meta-bh.md`) + `wizard-dinheiro.tsx` ainda com o MEI R$49,90 antigo, não corrigidos desde a decisão de 20/08. Isso motivou o `financeiro/estado-atual.md`.

## Ficou em aberto de propósito (mérito de conteúdo, não mecânico)

- Veredito do reorg travado de 30/07 (`_arquivo/reorganizacao-flow-design/`) — não fechado, só arquivado.
- `execucao/motor-testes/` segue desatualizado (dívida técnica antiga).
- `execucao/specs/` tem numeração T velha convivendo com N/E/C/A nova — pede leitura linha a linha.
- `marca/naming/naming-defesa.md` — flag posto, mérito -ai/-ei segue decisão de sócio.
- ~10 arquivos soltos em `execucao/` raiz sem categoria óbvia ainda.
- 3 docs + 1 arquivo de código ainda citam MEI R$49,90 (listados no `estado-atual.md`).

Ver [[legalize-reorg-repo-inteiro-25-08]] · `_sistema/2026-08-25-mapa-pastas-cruzamento.md` · [[estado-atual]] · [[indice-autoridade]].
