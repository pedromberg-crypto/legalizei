---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 7.3
tags: [concorrente, ux]
---

# Tela: Faturas — Contabilizei

> Nota de captura: o print "faturas" (desktop) mostra o **Home/Dashboard** — o único elemento de "fatura" é o banner de topo da mensalidade. A auditoria é do dashboard como visto, com foco no que se relaciona a faturamento/cobrança.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 8 | Densa, mas organizada em cards nomeados (Central de Rotinas, Notas fiscais, Impostos, Conta Digital PJ). Banner de fatura no topo é direto: valor R$ 210,90 do plano Padrão "chegou!". |
| Eficiência | 8 | Praticamente tudo a um clique do home: emitir nota, importar, simular imposto, consultar, ativar débito automático. Calendário com pendências. Redundância com "Rotinas Mensais" no rodapé (repete ações). |
| Feedback | 8 | Proatividade forte: "Pendências críticas" em vermelho ("Pagamento de imposto pendente" + Ver pendência), Previsão de imposto (DARF R$ 178,31), Faturamento do mês, pró-labore recomendado. |
| Linguagem | 7 | Mix. Humano em "Quer mais comodidade?", "Simule o valor dos seus impostos". Mas "DARF UN...", "Competência", "Pró-labore", "Débito automático" sem explicação convivem no mesmo espaço. |
| Confiança | 7 | Saldo mascarado por padrão (privacidade boa), valores explícitos, pendências sinalizadas. Porém um card inteiro é cross-sell do app ("App Contabilizei evoluiu") ocupando 1/3 da tela. |
| Mobile | 6 | Reflui pra coluna única com boa repriorização, mas o botão flutuante "Fale conosco" **cobre o CTA "Importar nota fiscal"** e a bottom-nav aparece sobreposta ao conteúdo — colisão de camadas. |
| **Média** | **7.3** | |

## O que vi (fatos)
- **Banner topo**: "Sua mensalidade do plano **Padrão** no valor de **R$ 210,90** chegou!" (informativo, sem CTA de pagar visível).
- **Central de Rotinas**: calendário Julho/2026 (dia 9 marcado) + **"Pendências críticas"** em vermelho → "Pagamento de imposto pendente" + botão "Ver pendência" + link "Ir para a central de rotinas".
- **Card Notas fiscais**: "Faturamento de Julho R$ 0,00", CTAs Emitir nova nota / Importar / Replicar / Consultar + "Simule o valor dos seus impostos".
- **Card Impostos**: Competência Jun/2026, Previsão "DARF UN... disponível até dia 15 — R$ 178,31", "Consultar impostos", e cross-sell "Ative o débito automático" → "Ativar débito automático".
- **Card Conta Digital PJ**: Contabilizei.bank, Banco 301 / Ag 0001 / Conta 311101883 (com ícones de copiar), Saldo disponível **mascarado** com olho de revelar, + banner "App Contabilizei evoluiu" com QR e badges.
- **Card Pró-labore**: Junho/2026 R$ 1.621,00, "Valor bruto ideal para pagar menos impostos", "Personalize o cálculo inteligente".
- Rodapé: "Benefícios para você", "Serviços Adicionais", "Rotinas Mensais" (Notas Fiscais, Pró-labore, Movimentações Bancárias, Declarações Contábeis).
- **Mobile**: mesmos cards empilhados; ordem repriorizada (Notas fiscais → Pró-labore → Impostos → Conta → Benefícios → Serviços → Rotinas). Colisão do "Fale conosco" e bottom-nav sobre conteúdo.

## 👍 Forças (o que copiar)
- **Proatividade fiscal real**: "Pendências críticas" em vermelho + previsão de imposto antes do vencimento + simulador de impostos. Esse é exatamente o diferencial que queremos.
- **Débito automático de impostos** como redutor de fricção ("Quer mais comodidade?").
- **Saldo mascarado por padrão** com toggle de olho — privacidade cuidadosa.
- **Copiar dados bancários com um clique** (ícones ao lado de banco/ag/conta).
- Dashboard resolve as 4 rotinas do mês (nota, imposto, pró-labore, conta) num só lugar.

## 👎 Fraquezas (nossa oportunidade)
- **Colisão de camadas no mobile**: o botão "Fale conosco" tapa um CTA e a bottom-nav sobrepõe conteúdo — acessibilidade comprometida.
- **Cross-sell agressivo**: card do "App evoluiu" rouba um terço da primeira dobra do dashboard.
- **Banner de fatura sem ação**: avisa que a mensalidade chegou mas não oferece "Pagar" / "Ver fatura" ali mesmo.
- **Contabilês espalhado** (DARF, Competência) sem tooltip.
- **Redundância**: "Rotinas Mensais" no rodapé repete ações já nos cards.

## 🎯 Contraproposta Legalizei
- **Banner de fatura acionável**: "Sua mensalidade de R$ X venceu/vence dia Y" + botões "Pagar agora" e "Ver detalhes" no próprio banner (não só informar).
- Manter e **turbinar a proatividade**: pendências críticas + previsão de imposto com explicação ("por que R$ 178,31?" → abre memória de cálculo). Transparência é nosso pilar.
- **Zero cross-sell na primeira dobra** — dashboard é ferramenta de trabalho, não outdoor. Promo de app, se existir, vai pro rodapé.
- Resolver a **colisão de z-index no mobile** (o CTA nunca pode ficar embaixo de um botão flutuante).
- Tooltips humanos em DARF/Competência ("Competência = mês a que o imposto se refere").

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
