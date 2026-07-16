---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Conta Bancária PJ (movimentações) — Contabilizei

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 8 | Tabela limpa, uma linha, colunas óbvias (Banco, Agência, Conta, Integração). Badge "Integrada" verde comunica status na hora. Ressalva: o slug promete "movimentações" mas a tela é o cadastro/lista da conta — não há extrato/lançamentos visíveis. |
| Eficiência | 7 | Ação primária "Cadastrar conta bancária" bem posicionada. Para ver movimentações é preciso clicar na seta `>` (um passo extra, sem rótulo). |
| Feedback | 8 | Status de integração explícito com badge de cor semântica. Só falta timestamp ("última sincronização") e feedback do que a seta abre. |
| Linguagem | 7 | Maioria acessível, mas "Data Saldo Inicial" e "Integração" são termos de sistema. "Data Saldo Inicial" sem tooltip confunde leigo. |
| Confiança | 7 | Mostra dados bancários reais + status integrado = sensação de controle. Ícone `?` de ajuda em "Integração" é bom. Falta explicar o que "integrada" significa em uma frase. |
| Mobile | 9 | Adaptação exemplar: vira card, "Cadastrar conta bancária" encurta para "Cadastrar", Agência+Conta em uma linha, badge preservado, bottom-tab nav. Legível e tocável. |
| **Média** | **7.7** | |

## O que vi (fatos)
- Título "Conta Bancária" + botão azul primário "Cadastrar conta bancária" no topo direito.
- Tabela com uma linha: **Contabilizei.Bank · Ag 0001 · Conta 311101883 · Data Saldo Inicial 12/12/2025 · badge verde "Integrada" · seta `>` em "Ações"**.
- Cabeçalho de coluna "Integração" traz ícone `?` (tooltip de ajuda).
- Header global: Ajuda · Dados da empresa e banco · Minha conta. Sidebar esquerda com todos os módulos. Botão flutuante ciano "Fale conosco".
- **Mobile**: mesma info em formato card, botão encurtado, navegação em bottom-tab. Muito espaço vazio abaixo do card (só uma conta cadastrada).

## 👍 Forças (o que copiar)
- **Badge de status de integração** com cor semântica (verde = integrada) — leitura instantânea.
- **Encurtamento inteligente do CTA no mobile** ("Cadastrar conta bancária" → "Cadastrar") sem perder sentido.
- **Card mobile** com hierarquia clara (banco em negrito, ag/conta em cinza, badge embaixo).
- Ícone `?` de ajuda no cabeçalho técnico.

## 👎 Fraquezas (nossa oportunidade)
- **Rótulo mente sobre o conteúdo**: prometido "movimentações", entregue só o cadastro. Extrato escondido atrás de uma seta sem label.
- **"Data Saldo Inicial"** é contabilês puro sem explicação.
- **Estado vazio desperdiçado**: uma conta e um oceano de branco. Nenhum próximo passo sugerido ("conectar outro banco?", "ver extrato?").
- **Sem prévia de saldo/última sincronização** na própria linha — o dado mais útil (dinheiro e frescor) não aparece.

## 🎯 Contraproposta Legalizei
- Tela de conta = **extrato de verdade na primeira dobra**, não só cadastro. Saldo, última sincronização ("atualizado há 2h") e últimos lançamentos visíveis sem clique.
- Trocar "Data Saldo Inicial" por **"Conciliação começa em"** com tooltip humano ("a partir dessa data a gente concilia suas transações automaticamente").
- Badge de integração com **microcopy de reforço** ("Integrada — extrato sincroniza sozinho, você não importa nada").
- Estado vazio ativo: se não há conta, um card de onboarding ("Conecte seu banco em 2 min e nunca mais importe extrato").
- Manter a excelente adaptação mobile em card + bottom-tab como padrão da casa.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
