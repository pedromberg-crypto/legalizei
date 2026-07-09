---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 6.8
tags: [concorrente, ux]
---

# Tela: Notas Fiscais — Listagem (/emissor/listagem) — Contabilizei

> **Tela dedicada (rota `#/emissor/listagem`).** É a mesma superfície já documentada em `emitir-nfs-e.md` — a "listagem" de NFs. Nesta captura o painel dropdown "Dados da empresa e banco" ficou aberto por cima à direita (artefato de captura). Achado que se **confirma de novo**: apesar do nome "listagem", **a tela não lista nota nenhuma** — não há tabela de notas emitidas com tomador/valor/data/status. É uma tela de **emitir**, não de **consultar histórico**.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 8 | Foco cirúrgico: título "Notas fiscais" + 1 ação primária óbvia ("Emitir nova nota"), filtros claros, atalho de cliente recente. |
| Eficiência | 8 | Emitir em 1 clique; card de "Últimos clientes cadastrados" traz botão "Emitir" pra reemissão rápida ao mesmo tomador. |
| Feedback | 5 | **A "listagem" não lista**: sem tabela de notas emitidas, sem status (emitida/cancelada), sem total faturado, sem empty-state explícito. Filtra-se um vazio. |
| Linguagem | 7 | "Notas fiscais", "Emitir nova nota", "Últimos clientes cadastrados" são planos; "Filtro de busca" + "Busca de notas" são um tanto redundantes. |
| Confiança | 7 | Layout limpo transmite controle; mas nesta captura o dropdown de dados sobreposto polui, e a ausência de histórico visível reduz a sensação de "está tudo aqui". |
| Mobile | 6 | Traz "Dúvidas frequentes" + "Central de ajuda" (bom suporte contextual), mas o dropdown come o topo, a nav inferior flutua sobre o conteúdo e os 4 filtros truncam numa linha apertada (visto em `emitir-nfs-e`). |
| **Média** | **6.8** | Ótima como tela de **emitir**; falha como **listagem** (não há lista). Mesma tela de `emitir-nfs-e`. |

## O que vi (fatos)
- Rota: `#/emissor/listagem` (confirmado no `recaptura_log.json`).
- Título "Notas fiscais" + botão primário azul "Emitir nova nota" (canto superior direito).
- Linha de filtros: **Filtro de busca** (dropdown "Nome do cliente"), **Busca de notas** (texto), **Mês** (Julho), **Ano** (2026).
- Seção **"Últimos clientes cadastrados"**: card "ACCELLERA HUB DE CRESCIMENTO LTDA." + botão "Emitir".
- **Não há tabela de notas emitidas** (nem tomador, valor, data, status ou total).
- Desktop: painel dropdown "Dados da empresa e banco" aberto à direita (CNPJ, regime, banco, certificado digital, pontos) — sobreposto (artefato).
- Mobile: dropdown de dados no topo; abaixo, bloco de ajuda: "Quando preciso emitir a nota fiscal?", "Como preencher minha nota fiscal?", "Esqueci de emitir minha nota. Posso emitir retroativa?", "Como emitir uma NF?" + "Central de ajuda".

## 👍 Forças (o que copiar)
- **Foco cirúrgico**: uma tela, uma ação principal — contraste enorme com a Home poluída.
- **Atalho "cliente recente → Emitir"**: corta cliques no caso mais comum (reemitir pro mesmo tomador).
- **Ajuda contextual no lugar certo**: dúvidas de NF (emissão retroativa, como preencher) exatamente onde a dúvida nasce.
- Filtros por mês/ano padrão e legíveis.

## 👎 Fraquezas (nossa oportunidade)
- **"Listagem" que não lista**: quem quer "ver minhas notas do mês" não vê tabela, status nem total. Falta o feedback do histórico — a função mais básica de uma listagem.
- **Mobile aperta filtros** (labels/valores truncam, 4 campos numa linha) e a **nav inferior flutuante sobrepõe** o conteúdo.
- Dropdown de dados sobreposto (nesta captura) mostra como painéis flutuantes competem com a tela principal.

## 🎯 Contraproposta Legalizei
- **Listagem = listagem de verdade**: tabela clara das notas do período (tomador, valor, data, **status com cor**) + **total faturado no topo**. "Emitir nova nota" continua CTA primário; o histórico dá transparência.
- **Manter o atalho de cliente recente** e somar "reemitir igual à última nota" em 1 toque — job do prestador ME de serviço recorrente.
- **Mobile: filtros em reflow full-width** empilhados (nada de truncar), nav inferior fixa sem sobreposição.
- **Ajuda contextual mantida**, em linguagem de dono, não de contador. Entregando a lista real + mobile correto, dá pra passar de ~6.8 pra ~8.5.

## Links
- [[contabilizei]] · [[emitir-nfs-e]] · [[_relatorio-auditoria]] · [[HOME]]
