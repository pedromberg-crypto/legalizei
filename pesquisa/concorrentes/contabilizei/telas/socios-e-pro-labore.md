---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Sócios e Pró-labore — Contabilizei

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 8 | Texto explica o que é pró-labore, INSS (11%, teto R$ 932,31) e IRRF (só acima de R$ 5.000). Tabela de sócios legível: Sócio, CPF, PIS, Pró-labore, Valor bruto, Ações. |
| Eficiência | 7 | Editar inline por sócio; ação única e óbvia. Mas o valor líquido não aparece — exige clicar em "recibos de pró-labore" (1 salto extra). |
| Feedback | 6 | Tela é de leitura; tooltip (?) em "Valor bruto". Sem estados de sucesso/erro visíveis nem confirmação de edição. |
| Linguagem | 7 | Boa didática, mas ainda tem contabilês: "DARF", "teto da Previdência Social", "cálculo inteligente" (jargão de marketing sem explicar o que faz). |
| Confiança | 8 | Transparência sobre a base de cálculo, banner proativo "Reforma da Renda 2026", CPF mascarado parcialmente. Passa seriedade. |
| Mobile | 7 | A tabela colapsa bem em cartão label:valor com chevron para expandir. Mas o botão flutuante "Fale conosco" e a barra de navegação inferior preta sobrepõem o conteúdo. |
| **Média** | **7.2** | Tela sólida e educativa — a mais bem resolvida do conjunto. |

## O que vi (fatos)
- Cabeçalho explicativo: "Pró-labore é a sua remuneração mensal como sócio da empresa" + regras de INSS e IRRF em bullets.
- Banner azul topo: "Reforma da Renda: Veja o que muda em 2026" com link "ver artigo".
- Card destaque amarelo: "Personalize o cálculo inteligente" + CTA "Personalizar cálculo inteligente".
- Tabela "Informações dos sócios": 1 sócio (PEDRO...), CPF, PIS "-", Pró-labore "Sim", Valor bruto R$ 1.621,00, botão "Editar".
- Rodapé: link "recibos de pró-labore" (para ver líquido) e aviso "Lembre-se: o valor dos seus impostos mensais é influenciado diretamente pelo seu pró-labore".
- Mobile: mesmo conteúdo empilhado; tabela vira lista Pró-labore/CPF/PIS com chevron.

## 👍 Forças (o que copiar)
- **Didática antes do dado**: explica o conceito (pró-labore, INSS, IRRF) na própria tela, não escondido em FAQ.
- **Proatividade fiscal**: banner de Reforma 2026 antecipa mudança que afeta o usuário — exatamente o eixo que queremos ocupar.
- **Tabela → cartão no mobile** é um padrão responsivo correto (não força scroll horizontal).
- Conecta causa e efeito: "o valor dos impostos é influenciado pelo pró-labore".

## 👎 Fraquezas (nossa oportunidade)
- **Valor líquido escondido**: mostra só o bruto (R$ 1.621) — o número que o sócio realmente recebe exige clicar em "recibos". A pergunta nº1 do dono ("quanto cai na minha conta?") fica a um clique.
- **"Cálculo inteligente" é caixa-preta**: nome de marketing que não diz o que otimiza. Personalizar o quê? Com que impacto em R$?
- **PIS "-" sem explicação**: campo vazio gera dúvida ("falta algo meu?").
- Sem simulação "e se eu mudar o pró-labore?" na própria tela.

## 🎯 Contraproposta Legalizei
- Mostrar **bruto E líquido lado a lado** já no primeiro olhar, com breakdown expansível (INSS, IRRF, líquido) — zero cliques para a dúvida principal.
- Substituir "cálculo inteligente" por um **simulador transparente**: slider de pró-labore → mostra em tempo real "você recebe R$ X, empresa paga R$ Y de imposto, economia Z". Transparência > jargão.
- Explicar cada campo (PIS vazio → "não obrigatório para o seu caso") com microcopy humana.
- Manter a lógica do banner proativo de Reforma, mas linkar para o **impacto no SEU número**, não para um artigo genérico.

## 🔓 Atualização 2026-07-15 — caixa-preta decodificada
O email [[emails-produto-novidades]] (teto mínimo) revela o que a "Gestão Inteligente"/"cálculo inteligente" faz por baixo: **zera o pró-labore em mês sem NF** e agora **garante piso mínimo compensando imposto pra cima**. Confirma a fraqueza acima (jargão que esconde mecânica) e afia a contraproposta do simulador transparente: o slider precisa expor piso mínimo, zeragem por ausência de NF e compensação de imposto.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[emails-produto-novidades]] · [[HOME]]
