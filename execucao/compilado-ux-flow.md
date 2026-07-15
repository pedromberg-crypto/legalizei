---
tipo: log
data: 2026-07-15
status: vivo
tags: [produto, ux, flow, log, otimizacao, backlog]
---

# 🔧 Compilado de otimizações de UX do flow — LOG VIVO

> **O que é:** fonte única do que melhorar no flow de abertura + o que já foi feito. Nasce da 1ª bateria de personas do [[motor-testes-arquitetura|motor de testes]] (coluna "Sugestão / olhar leigo" dos 11 relatórios T0026–T0036) e cresce a cada rodada nova ou ideia solta.
>
> **Como funciona (combinado com o Pedro):** cada item nasce 🔴 **aberto**. Quando a gente **executa** de fato (spec/protótipo/motor), viro pra ✅ **aplicado** com **data + onde**. No `/fechar` de cada flow eu passo aqui e atualizo o status do que mexemos. Toda sugestão nova entra neste doc.

## Legenda de status
- ✅ **aplicado** — já está na spec/protótipo/motor (com ponteiro de onde)
- 🟡 **parcial** — diretriz gravada, mas a tela concreta mora num bloco ainda sem spec (B3/B4)
- 🔴 **aberto** — ainda não tocado

---

## 📋 Itens (rodada #1 — bateria de 11 personas, 2026-07-15)

| ID | Grupo | Sugestão | Persona(s) | Status | Onde / quando |
|---|---|---|---|---|---|
| UX-01 | Simulador | Nunca "Fator R" cru pro leigo. Mostrar "quanto você se paga / quanto economiza", sempre em R$, rótulo "estimativa" | reta, cida, instrutora, sociedade | ✅ | [[spec-telas-entrada-b1-b2]] T14 (blockquote) + notas transversais · 15/07 |
| UX-02 | Simulador | 2 alavancas explícitas: trocar de CNAE **ou** subir pró-labore (Fator R) | instrutora | ✅ | spec T13 (CNAE ótimo) + T14 · 15/07 |
| UX-03 | Simulador | Borda 28%: mostrar sensibilidade ("um real a menos te joga pro Anexo V") | knife | ✅ | spec T14 (Resultado Fator R) · 15/07 |
| UX-04 | Simulador | INSS incide só sobre a **folga** do teto (ex R$475,55), não zero nem cheio — evita pedido de aumento errado | sociedade, monstro | ✅ | spec T7 (Aviso de teto INSS) · 15/07 |
| UX-05 | CNAE | Mostrar CNAE em **linguagem humana antes do código** | reta | ✅ | spec T4 (Card de resultado) · 15/07 |
| UX-06 | CNAE | Tela do CNAE ótimo: **por que** os dois cobrem (mesma NF) + economia em R$ + **nunca trocar em silêncio** + trilha de auditoria | instrutora | ✅ | spec **T13 nova** (CNAE fiscalmente ótimo) · 15/07 |
| UX-07 | Bloqueio-educa | Sócio no exterior: "empresa existe, mas fora do Simples" + rota humana (não crash) | bloq-exterior | ✅ | spec T6 (Reside no exterior?) · 15/07 |
| UX-08 | Bloqueio-educa | CLT da própria: ensina pró-labore vs CLT, sem culpar | bloq-cltpropria | ✅ | spec T7 (Bloqueio CLT própria) · 15/07 |
| UX-09 | Bloqueio-educa | 3+ sócios: oferecer saída humana, "limite do produto, não da lei" | bloq-3socios | ✅ | spec T8 (Limite de sócios) · 15/07 |
| UX-10 | Bloqueio-educa | Waitlist 🟡: deixar claro que **não é "não"** + captura | camaleao | ✅ | spec T4 (Captura 🟡) · 15/07 |
| UX-11 | Desambiguação | Pergunta **humana, não fiscal** (representa/estoque · nutri registrada/prescreve) — antídoto do falso 🔴 | camaleao, fronteira | ✅ | spec T4 (Desambiguação) · 15/07 |
| UX-12 | Acessibilidade | Botão grande rótulo literal (não ícone) · ditado por voz · fonte ampliável CPF/CEP · botão único no aceite · zero jargão, letra grande | cida | ✅ | spec notas transversais (Acessibilidade) · 15/07 |
| UX-13 | Acessibilidade | Pergunta de contribuição prévia cobrir **aposentado/autônomo/outro CNPJ**, não só "emprego CLT" | cida | ✅ | spec T7 (toggle reescrito) — lógica já OK no motor · 15/07 |
| UX-14 | Copy/veredito | 🟢: dizer em 1 linha "o que vem agora" ("vamos criar sua conta") | reta | ✅ | spec T4 (CTA 🟢) · 15/07 |
| UX-15 | Copy/veredito | Placeholder typewriter com exemplos reais + aceitar gíria | reta | ✅ | já no protótipo `ux-ui/prototipo/` (gate-cnae) + spec T4 |
| UX-16 | Copy/veredito | Regime de bens / termo: microcopy que **ensina, não culpa** | reta, cida | ✅ | spec T6 (regime) + notas transversais · 15/07 |
| UX-17 | Copy/B3 | Termo irreversível: "taxas de governo não voltam", sem letra miúda, botão único | reta, cida | 🟡 | diretriz gravada em spec notas transversais; **tela concreta = B3** (sem spec própria ainda) |
| UX-18 | Pausas/B4 | Aviso proativo (WhatsApp) + "leva ~X dias" + estado visível a cada pausa | cida, reta, monstro | 🟡 | diretriz gravada em spec notas transversais; **telas concretas = B4** (sem spec própria ainda) |

**Resumo rodada #1:** 16 ✅ aplicados · 2 🟡 parciais (esperam spec de B3/B4) · 0 🔴 aberto.

## 🧷 Follow-ups abertos (gerados por esta rodada)
- 🔴 **Re-sincronizar [[mapa-telas-mobile]]** com a renumeração: entrou a **Tela 13 (CNAE ótimo)**, simulador virou **T14**, revisão **T15**.
- 🟡 **Espelhar no protótipo** `ux-ui/prototipo/` as telas novas/alteradas (hoje o protótipo não tem a tela do CNAE ótimo nem os bloqueios que educam).
- 🟡 **Spec de B3/B4** — quando existir, aterrar UX-17 e UX-18 nas telas reais (aceite, dunning, pausas de órgão).
- 🟡 **Motor:** adicionar personas `saas` e `bpo` (famílias 2 e 3 do [[cnae-fiscalmente-otimo]]) — validam a tela nova do CNAE ótimo com outros clusters.

## Links
- [[casos-teste-fluxo-cnae]] · [[spec-telas-entrada-b1-b2]] · [[cnae-fiscalmente-otimo]] · [[blocos-fluxo-abertura]] · [[motor-testes-arquitetura]] · [[HOME]]
