---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Meus Benefícios — Contabilizei

> **TELA DEDICADA (fato observado) — mas é um funil de upsell.** A recaptura acertou: existe rota própria, e o log entrega o nome dela cru: `#/beneficios/landing-upsell`. É uma **landing page de upsell** com título **"Plano Multibenefícios"**. Ou seja, "Meus Benefícios" no menu **não é um hub do que você já tem** — é uma **vitrine pra vender o upgrade** (+R$30/mês). Isso **confirma e reforça** a tese anterior ("benefício = venda"), agora com prova no próprio nome da rota: *landing-upsell*. Como página é bem-feita; como "Meus Benefícios" é propaganda dressed as benefício.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 7 | Oferta clara: "escolha 2 dos 7 benefícios", comparação de planos lado a lado, cards de parceiros (TotalPass/Starbem/Conexa). Mas quem busca "quais benefícios eu já tenho" não acha — só oferta. |
| Eficiência | 7 | Comparativo "Avançado × Upgrade Multibenefícios" + CTA "Quero evoluir meu plano" tornam o upgrade eficiente. Nenhum caminho pro "o que já uso". |
| Feedback | 5 | Nenhum estado do que o cliente possui/consome. Tudo é oferta futura. O comparativo de duas colunas ajuda, mas não há "você já tem X". |
| Linguagem | 7 | "Só a Contabilizei tem o plano que completa sua empresa", "escolha 2 dos 7" — humana e orientada a benefício. Ainda com asteriscos ("nf**", "à parte"). |
| Confiança | 5 | Chamar landing de upsell de "Meus Benefícios" corrói a palavra. E há **inconsistência de plano/preço**: o banner da Home diz "plano Padrão R$ 210,90"; aqui o plano atual é "Avançado R$ 195/mês". Nome e valor divergem — ruído de transparência. |
| Mobile | 7 | Reflui bem: hero, carrossel de parceiros e comparativo empilham legíveis; longo mas coerente. Bem acima da Home no mobile. |
| **Média** | **6.3** | Página real e polida — mas é funil de venda (rota literalmente `landing-upsell`), não o hub de benefícios que o rótulo promete. |

## O que vi (fatos)
- Rota: `#/beneficios/landing-upsell` (confirmado no `recaptura_log.json`).
- **Hero "Plano Multibenefícios"** — "Só a Contabilizei tem o plano que completa sua empresa." CTAs "Quero evoluir meu plano" / "Conheça outros benefícios" + colagem de fotos lifestyle.
- **"Conheça as vantagens do plano Multibenefícios"** — "Nessa oferta você escolhe **2 dos 7 benefícios**". Carrossel: **TotalPass** (+25.000 academias; Plano Free grátis / a partir de R$ 39,90), **Starbem** (4 consultas 30min/mês c/ psicólogos; 1/mês nutricionista; descontos farmácia), **Conexa** (pronto atendimento online 24h; teleconsultas ilimitadas c/ clínico geral).
- **Comparativo de planos**:
  - **Avançado (Plano atual) — R$ 195/mês**: certificado digital grátis; **folha de pagamento cobrada à parte**; pró-labore de sócios grátis até 2 sócios; atendimento por chat 9h–17h30 e WhatsApp/e-mail 9h–22h; conta digital PJ inclusa; faturamento até R$ 50 mil/mês; abertura grátis; compensação de boleto R$ 2,70; **atendimento por telefone NÃO incluso**; **contador exclusivo NÃO incluso**; emissor de NF grátis; contabilidade completa.
  - **Upgrade Multibenefícios (Recomendado) — +R$ 30/mês (Total R$ 225,00)**: todos os serviços do plano anterior + escolher 2 de: seguro de vida, plano odontológico, TotalPass, atendimento psicológico e nutricional, atendimento médico.
- **"+ Benefícios"**: Plano de saúde da Contabilizei ("preços até 30% menores"; parceiros Unimed, Alice, Amil, SulAmérica, Sami, Bradesco; "Fazer simulação") e Educação ("cursos 100% gratuitos"; "Me Poupe! Eu, Chefe de Mim"; "Acessar plataforma").
- **Intel de preço**: plano base "Avançado" = **R$ 195/mês** (bate com o alvo do posicionamento Legalizai Story Book); upgrade → R$ 225/mês. Banner da Home diverge ("Padrão R$ 210,90").

## 👍 Forças (o que copiar)
- **Comparativo de planos lado a lado** com o plano atual marcado é ótima UX de upgrade — claro o que ganho por +R$30.
- **"Escolha 2 dos 7"** dá sensação de controle/personalização em vez de pacote empurrado.
- Alguns benefícios têm **valor concreto** (nº de consultas, nº de academias, % de desconto) — bem melhor que rótulo vago.
- Mobile reflui com qualidade — prova que a Contabilizei sabe fazer página responsiva quando quer (contraste com a Home).

## 👎 Fraquezas (nossa oportunidade)
- **"Meus Benefícios" = upsell**: a rota é literalmente `landing-upsell`. Não existe visão do que o cliente **já tem/usa** — só o que pode comprar. Corrói a palavra "benefício".
- **Inconsistência de plano/preço**: "Padrão R$ 210,90" (banner) vs "Avançado R$ 195" (aqui). Nome e valor não batem — mancha de transparência.
- **Sem estado nem histórico**: nada de "você já economizou R$ X", "benefício ativo desde…", "consultas usadas".
- **Asteriscos e "à parte"**: "folha à parte", "nf**" reintroduzem letrinha miúda numa página que se vende como generosa.

## 🎯 Contraproposta Legalizai Story Book
- **Hub "Meus Benefícios" de verdade**: separar **incluídos no plano** (o que já ganha — emissão ilimitada de NF, suporte, relatórios) de **parcerias opcionais** (saúde, TotalPass) — rotuladas como parceria, nunca como "benefício" genérico.
- Cada item com **valor e estado concretos**: "Ativo desde 03/2026 · você já economizou R$ X" / "Plano de saúde a partir de R$ Y/vida".
- **Herdar o comparativo lado-a-lado** e o "escolha 2 dos 7" — são bons; só que dentro de um hub honesto, não como a tela inteira.
- **Preço e nome do plano únicos e coerentes** em toda a plataforma — o oposto da divergência Padrão/Avançado. Transparência é nosso posicionamento.

## Links
- [[contabilizei]] · [[_relatorio-auditoria]] · [[HOME]]
