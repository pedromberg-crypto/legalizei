---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 6.5
tags: [concorrente, ux]
---

# Tela: Folha de Pagamento — Contabilizei

> **Alerta de captura:** o print (desktop e mobile) NÃO abriu uma tela de folha de pagamento — caiu no **dashboard Home**. Ou o clique em "Folha de Pagamento" redireciona para a Home (provável, já que ME de serviço no Simples não costuma ter funcionários), ou a captura automática não navegou. Nenhuma superfície de folha/holerite/eSocial aparece. Notas abaixo avaliam o artefato que carregou (a Home) sob a ótica de quem procurava folha.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 6 | Como Home é organizada (cards Notas fiscais, Impostos, Conta PJ, Pró-labore). Mas para o job "folha de pagamento" a clareza é zero: não há nada de folha nem um empty-state explicando "você não tem funcionários". |
| Eficiência | 7 | Home coloca tudo a 1 clique e tem "Rotinas Mensais" no rodapé. Porém clicar num item de menu e cair na Home (sem sinal de onde está) é desorientador. |
| Feedback | 7 | Bom uso de status: "Pendências críticas" em vermelho, calendário com pontos em dias-chave, banner de mensalidade. |
| Linguagem | 6 | Mistura muito contabilês: "DARF UN..." (truncado), "Competência", "débito automático", "Pró-labore". |
| Confiança | 7 | Contabilizei.bank com dados bancários, saldo ocultável, pendências à mostra. Mas muita propaganda do app e cross-sell rouba o foco. |
| Mobile | 6 | Scroll gigante (~4195px de altura), cards reordenados, barra de navegação flutuante sobrepõe conteúdo e o botão "Fale conosco" tapa o botão "Importar". |
| **Média** | **6.5** | Home competente, mas como "Folha de Pagamento" é um beco sem saída. |

## O que vi (fatos)
- Dashboard Home (idêntico ao capturado em `meus-beneficios` e `dados-da-empresa`).
- Cards: Central de Rotinas (calendário Julho 2026 + "Pendências críticas: Pagamento de imposto pendente"), Notas fiscais (Faturamento R$ 0,00, "Emitir nova nota"), Impostos (Competência Jun/2026, DARF R$ 178,31), Conta Digital PJ (Contabilizei.bank), Pró-labore (R$ 1.621,00).
- Blocos inferiores: "Benefícios para você", "Serviços Adicionais", "Rotinas Mensais" (Notas Fiscais / Pró-labore / Movimentações Bancárias / Declarações Contábeis).
- Grande bloco publicitário "App Contabilizei evoluiu" com QR e badges de loja.
- **Nenhum elemento de folha de pagamento** (funcionários, holerite, eSocial, admissão).

## 👍 Forças (o que copiar)
- **Central de Rotinas com pendências críticas em vermelho** — o usuário vê na hora o que está atrasado. Excelente hierarquia de urgência.
- Home resume o mês inteiro (faturamento, imposto, pró-labore, saldo) numa tela.
- "Rotinas Mensais" mapeia o ciclo do mês de forma escaneável.

## 👎 Fraquezas (nossa oportunidade)
- **Item de menu que leva a lugar nenhum**: "Folha de Pagamento" no menu lateral sem destino próprio (ou sem empty-state) é ruído. ME solo não tem folha — então por que o item existe com o mesmo peso visual de "Notas fiscais"?
- **Dashboard poluído por venda**: banner de mensalidade + anúncio do app + cross-sell competem com a informação operacional.
- **Contabilês truncado**: "DARF UN..." cortado é o pior dos dois mundos (nem o termo técnico nem uma explicação).

## 🎯 Contraproposta Legalizei
- **Menu adaptativo ao perfil**: ME de serviço sem funcionários NÃO vê "Folha de Pagamento" — ou vê como item secundário com estado "ative quando contratar seu 1º funcionário". Menu = espelho do negócio do usuário, não catálogo genérico.
- Se houver folha, mostrar **empty-state útil**: "Você ainda não tem funcionários. Contratar alguém? A gente cuida de admissão, holerite e eSocial." (educar + captar intenção).
- Home sem anúncio de app dentro do produto; foco 100% em "o que preciso fazer este mês".
- Nunca truncar termo fiscal: "DARF (guia única de imposto) — R$ 178,31, vence dia 15".

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
