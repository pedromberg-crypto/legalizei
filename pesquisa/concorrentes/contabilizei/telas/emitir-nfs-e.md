---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Emitir NFS-e (listagem de notas) — Contabilizei

## Notas (0–10)
| Eixo | Nota | Justificativa (1 linha) |
|---|---|---|
| Clareza | 8 | Tela focada: 1 ação primária evidente ("Emitir nova nota"), filtros óbvios, atalho de clientes recentes. |
| Eficiência | 8 | Emitir em 1 clique; cliente recente já traz botão "Emitir" para reemissão rápida. |
| Feedback | 6 | Não mostra de fato a LISTA de notas emitidas nem status; só "Últimos clientes cadastrados" — sem empty state explícito das notas. |
| Linguagem | 7 | Humana e direta ("Busca de notas", "Emitir nova nota"); "NFS-e/NF" é jargão, mas de domínio. |
| Confiança | 8 | Layout limpo, painel "Dúvidas frequentes" + Central de ajuda ao lado transmite suporte. |
| Mobile | 6 | Empilha e botões full-width bons, MAS filtros comprimem e truncam ("Nc", "Ju") e a nav inferior flutuante sobrepõe conteúdo. |
| **Média** | **7.2** | |

## O que vi (fatos)
- Título "Notas fiscais" + botão primário azul "Emitir nova nota" no canto superior direito.
- Linha de filtros: **Filtro de busca** (dropdown "Nome do cliente"), **Busca de notas** (texto), **Mês** (Julho), **Ano** (2026).
- Seção **"Últimos clientes cadastrados"** com um card: "ACCELLERA HUB DE CRESCIMENTO LTDA." + botão "Emitir".
- Trilho direito **"Dúvidas frequentes"**: Quando preciso emitir a nota fiscal? / Como preencher minha nota fiscal? / Esqueci de emitir minha nota — posso emitir retroativa? / Como emitir uma NF? + botão "Central de ajuda".
- Botão flutuante "Fale conosco".
- Apesar de ser a "listagem de notas", a tela NÃO exibe uma tabela de notas já emitidas com status/valor — foca em emitir.

## 👍 Forças (o que copiar)
- **Foco cirúrgico**: uma tela, uma ação principal. Contraste enorme com a home poluída.
- **Atalho "clientes recentes → Emitir"**: reduz cliques para o caso mais comum (reemitir pro mesmo tomador).
- **Ajuda contextual no lugar certo**: dúvidas frequentes sobre NF exatamente onde a dúvida aparece (emissão retroativa, como preencher).
- Filtros por mês/ano padrão e legíveis.

## 👎 Fraquezas (nossa oportunidade)
- **Não é uma listagem de verdade**: o usuário que quer "ver minhas notas do mês" não vê tabela, status (emitida/cancelada) nem totais. Falta o feedback do histórico.
- **Mobile aperta os filtros**: labels/valores truncam ("Filtro de busca" → "Nc", "Mês" → "Ju"), 4 campos apertados numa linha em vez de reflow full-width.
- Nav inferior flutuante sobrepõe a transição entre conteúdo e "Dúvidas frequentes".

## 🎯 Contraproposta Legalizei
- **Listagem = listagem**: tabela clara das notas do período (tomador, valor, data, status com cor) + total faturado no topo. O "Emitir nova nota" continua sendo o CTA primário, mas o histórico dá transparência.
- **Manter o atalho de cliente recente** (bom) e somar "reemitir igual à última nota" em 1 toque — job do prestador ME de serviço recorrente.
- **Mobile: filtros em reflow full-width** empilhados, nada de truncar valores; nav inferior fixa sem sobreposição.
- **Ajuda contextual mantida**, mas em linguagem de dono de negócio, não de contador. Dá pra passar dos 7.2 chegando a ~8.5 entregando a lista real + mobile correto.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
