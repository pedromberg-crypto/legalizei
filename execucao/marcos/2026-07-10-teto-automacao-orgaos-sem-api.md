---
tipo: marco
data: 2026-07-10
tags: [marco, tech, automacao, concorrente, produto]
validado_por: [Pedro, Mauro, Pedro Dev]
---

# 🧱 Marco — teto de automação: o processo NÃO é 100% digital

> Descoberta validada pelos 3 (Pedro + Mauro + dev) em conversa verbal + pesquisa aprofundada, 2026-07-10.

## O achado
Nem a Contabilizei (líder) é 100% digital/automatizada. Estimamos que **~15–20% do processo ainda exige humano validando/executando** — não é escolha, é limitação estrutural dos órgãos.

## A causa (por que não dá pra automatizar tudo)
- Órgãos-chave **não têm API** pública: **JUCEMG** (Junta Comercial de MG) e **Gov.br**, entre outros.
- Além de não terem API, **exigem sessão logada** (login + navegação manual) pra executar tarefas → no máximo RPA assistido, não integração limpa.
- É **estrutural do setor público**, não bug de concorrente — logo, vale pra qualquer player, inclusive nós.

## Implicações (o que isso muda)
- **Produto:** a arquitetura precisa prever **etapas humanas assistidas** (human-in-the-loop), não prometer "100% automático". Meta realista de automação ≈ **80–85%**.
- **Custo/ops:** existe um time de operação/validação embutido no modelo (não é SaaS puro sem gente). Alimenta o modelo de custo.
- **Marca (vira vantagem):** casa direto com o arquétipo [[conceito-marca]] (aliado humano). Transformar a limitação em feature — "tem gente de verdade garantindo cada etapa" — responde à ferida da categoria ("tem contador de verdade?").
- **Comunicação:** transparência sobre o que é automático x humano = diferenciação (o líder esconde isso).

## Links
- [[orgaos-sistemas-abertura-bh]] · [[fluxo-abertura-portais-pedro-dev]] · [[spec-mvp-v0]] · [[_relatorio-auditoria]] · [[conceito-marca]] · [[evolucao-para-mauro]]
