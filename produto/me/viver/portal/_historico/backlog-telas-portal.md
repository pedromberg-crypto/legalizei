---
tipo: operacao
status: vivo
data: 2026-07-23
assunto: backlog-telas-portal
tags: [portal, dia-2, telas, backlog, mockup]
---

# 🗺️ Backlog de telas do portal (derivado da HOME CAMPEÃ)

> 🔻 **PRECEDÊNCIA (travada 11/09).** Este documento é de **julho** e nasceu da primeira leva de comparação com o líder, que foi o que gerou as telas do portal. **Ele é histórico, não é guia.**
>
> Para a rodada de lapidação do MVP, quem manda é a pesquisa de setembro, muito mais robusta: o painel de 51 funcionalidades em [[HOME-produto]], as evidências com API e endpoint em `produto/me/_evidencias/`, e o inventário de capacidades em `produto/me/viver/portal/portal-data.mjs`.
>
> ⚠️ **Não apagar.** Aqui mora o porquê de cada tela ter nascido como nasceu, e isso não está em nenhum outro lugar. O que não vale é usar este arquivo para decidir o que construir agora.

> Inventário do que falta construir no portal interno, **mapeado a partir do que a home campeã toca**. Complementa a [[matriz-portal-interno]] (P0–P14, o inventário canônico) e a [[cruzamento-portal-interno]] (nav + faseamento).
>
> **Por que a ordem mudou:** a matriz ordenava a construção por **disponibilidade de dado** (primeiro o que não depende do motor do dev). Estamos em **mockup**, onde dado não trava — o que importa é o protótipo ficar **navegável** pra review. Então a ordem passa a ser **por derivação da home**: constrói primeiro o que dá 1 toque a partir dela, pra não sobrar beco sem saída.

**Status:** ✓ construída · 🔸 stub · 🆕 não existe

| # | Página | Chega de onde (na Campeã) | Arquétipo | Status | Onda |
|---|---|---|---|:--:|:--:|
| 1 | **Emitir NF-e** (P6) ⭐ | CTA central + atalho "Emitir nota" | Form | 🆕 | 1 |
| 2 | **Pagar o DAS** (P3) ⭐ | "Pagar" do Próximo compromisso + atalho | Detalhe | ✓ rascunho | 1 |
| 3 | **Meus impostos** (P2) | aba Impostos + "Ver tudo" do card | Lista | ✓ rascunho | 1 |
| 4 | **Minhas notas** (P5) | aba Notas + "Ver tudo" das Notas recentes | Lista | 🔸 | 1 |
| 5 | **Meu pró-labore** (P8) | atalho "Meu pró-labore" | Detalhe | 🔸 | 1 |
| 6 | **Documentos** (P13) | atalho "Documentos" | Lista | 🔸 | 1 |
| 7 | **Mais** (hub do menu) | aba Mais + "Ver tudo" dos atalhos | Hub/Lista | 🔸 | 1 |
| 8 | **Artigo do blog** | toque num card do "Aprenda com a gente" | Leitura | 🆕 *(fora da matriz)* | 1 |
| 9 | **Home DIA-1** (trilha de ativação) | a própria home, no outro estado | Hub | 🆕 | 1 |
| 10 | **PERFIL** ⭐ | **toque no círculo de iniciais (avatar)** | Perfil/abas | 🆕 *(fora da matriz)* | 1 |
| 11 | **Ajustar pró-labore** (P9) ⭐ | de "Meu pró-labore" | Simulador *(reusa N18)* | 🆕 no portal | 2 |
| 12 | **Nota emitida** (P7) | de Emitir / de Minhas notas | Detalhe | 🆕 | 2 |
| 13 | **Minhas alíquotas** (P4) | de Impostos | Simulador | 🆕 | 2 |
| 14 | **Você está em dia** (P10) | de Mais / do pulso | Gate/prova | 🆕 | 2 |
| 15 | **Serviços** (catálogo à-la-carte) | de Mais | Lista | 🆕 *(casa da receita)* | 2 |
| 16 | **Dados da empresa** (P12) | de Mais / da pill do CNPJ | Form | 🆕 *(vira ABA do Perfil)* | 3 |
| 17 | **Minha conta** (P14) | de Mais / do avatar | Form | 🆕 *(vira ABA do Perfil)* | 3 |
| 18 | **Relatórios contábeis** (P11, avançado) | de Mais | Lista | 🆕 | 3 |
| 19 | **Avisos** (bell) | topo global | Lista | 🆕 | 3 |
| — | Certificado (P0) · Obrigações | gate / calendário | Gate / Lista | ✓ | — |

## 💰 Custo: é recomposição, não invenção
Os **6 arquétipos** já existem (Gate · Hub · Lista · Detalhe · Simulador · Form) e 4 têm shell pronto do flow de abertura. Construir a **Lista** uma vez serve #3, #4, #6, #15, #18.

## 🏃 Ordem sugerida (Onda 1) — frequência × onde ganhamos do líder
1. **Emitir NF-e** — o CTA central, ato mais frequente, ganho visível (só valor + cliente; pré-preenchemos os 3 códigos que eles pedem crus).
2. **Pagar o DAS** — o gap nº1 deles ("confirme que pagou").
3. **Meu pró-labore + Ajustar** — o diferencial-âncora (N18 interativo).
4. **Minhas notas / Meus impostos** — as 2 listas (1 arquétipo serve as duas).
5. **Mais** — destrava Documentos, Serviços e config.
6. **Perfil** · **Home dia-1** · **Artigo do blog**.

## 🔀 Consolidação proposta (decisão nova)
O **Perfil** (#10), com abas *Empresa · Sócios · Documentos · Conta*, **absorve P12 + P13 + P14** — 3 telas da matriz viram 3 abas de 1 tela. O líder separa tudo (topbar "Dados da empresa e banco" × "Minha conta"); a gente unifica em "quem eu sou aqui". ⚠️ Se aprovado, atualizar a [[matriz-portal-interno]].

## Cruza com
[[matriz-portal-interno]] · [[cruzamento-portal-interno]] · [[home-candidatos-modulos]] · [[2026-07-21-dossie-plataforma-logada]] · **APIs/consultas:** [[infosimples-funcionalidades]] (autoridade do que cada órgão entrega — checar antes de qualquer autofill)
