---
tipo: spec
data: 2026-07-14
status: em-construcao
tags: [produto, qa, casos-teste, cnae, fluxo, onboarding]
---

# 🧪 Casos de teste de fluxo — 6 personas CNAE

> Personas p/ validar a lógica do fluxo de abertura ([[blocos-fluxo-abertura]]). 1 caso liso + 4 clusters isolados ("teste unitário": se quebrar, sabe qual condicional) + 1 monstro ("teste de integração": condicionais colidindo + bordas de escopo). CNAEs aterrados em [[cnae-atendidos-e-nao-atendidos]]. Uso: ainda **não** entram no protótipo; são régua de lapidação. Companheiro do [[mapa-telas-mobile]].

## Confiança dos CNAEs
- 🟢 = puxado direto da tabela de condicionais do vault.
- 🟡 média = afirmado por conhecimento típico, confirmar na matriz completa.

## Alavancas do processo (o que os flows ligam/desligam)
- **B1:** confiança do CNAE · ambiguidade/fork atende↔não · filtro regime (serviço? Simples? regulada?) · veredito 🟢/🟡/🔴 · fallback humano
- **B2:** solo×multi-sócio · estado civil/regime casamento · duplo vínculo CLT+teto INSS · natureza (SLU×LTDA) · Fator R (III 6% × V 15,5%) · faixa faturamento · pró-labore · bloqueio sócio-CLT · anexos diferentes (Larissa 🟡)
- **B3:** tier por faixa · método (cartão/Pix × boleto) · aceite/termo · cancelamento (antes×depois de abrir)

> ⚠️ Um caso só não liga tudo (mutuamente exclusivos: solo-SLU × multi-LTDA). O monstro empilha só o que coexiste.

---

## FLOW 1 — "Reta" 🟢 (único que passa liso)
**Persona:** Bruno, dev freelancer **solo**, sites/sistemas sob encomenda. **CNAE:** `6201-5/00` (🟡).

| Etapa | Input do caso | Condicional | Resultado |
|---|---|---|---|
| B1 descrição | "desenvolvo sites e sistemas sob encomenda" | mapeamento CNAE | alta confiança, sem fork |
| B1 filtro | serviço ✓ · Simples ✓ · não-regulada ✓ | 3 critérios | **🟢 atende** |
| B1 conta | cria conta | pós-🟢 | entra no B2 |
| B2 sócio | solteiro, solo | estado civil / nº sócios | sem cônjuge, sem +sócios |
| B2 CLT | não tem | duplo vínculo | pró-labore normal |
| B2 natureza | solo → **SLU** (default IA) | natureza jurídica | SLU |
| B2 faturamento | faixa "10–20k" | faixa guiada | — |
| B2 Fator R | folha < 28% | Fator R | **Anexo V (15,5%)**, mínimo |
| B2 pró-labore | 1 salário mín | pró-labore mínimo | ok |
| B3 | plano base · cartão · aceita | tier/método/assinatura | instantâneo → destrava B4 |

**Zero desvio.** Golden path.

---

## FLOW 2 — "Camaleão" 🌀 (ambiguidade B1, fork nunca 🟢)
**Persona:** Carla, "vendo material de construção". Par traiçoeiro. **CNAEs:** `4613-3/00` (🟢) × `4744-0/0x` comércio (🟡).

| Etapa | Input do caso | Condicional | Resultado |
|---|---|---|---|
| B1 descrição | "vendo material de construção" | mapeamento | **AMBÍGUO** — 46xx repres. × 47xx varejo |
| B1 desambiguação | mini-loop 2c | par traiçoeiro | "representa/intermedeia ou tem estoque próprio?" |
| ramo A | "represento fábricas, sem estoque" | → `4613-3/00` | **regulamentada (CORE) → 🟡 waitlist** |
| ramo B | "tenho loja, estoque" | → `4744-0/0x` comércio | **🔴 não atende → comercial Mauro** |
| — | nenhum ramo é 🟢 | fork cruza 🟡/🔴 | **nunca entra no B2** |

**Stress:** duas leituras fora do produto. Testa roteamento + não dar falso 🔴 no ramo A (é 🟡).

---

## FLOW 3 — "Sociedade" 👥 (B2 pesado)
**Persona:** Diego + Elisa, agência de publicidade, 2 sócios. **CNAE:** `7311-4/00` (🟡).

| Etapa | Input do caso | Condicional | Resultado |
|---|---|---|---|
| B1 | "agência de publicidade" | mapeamento | `7311-4/00` **🟢 atende** |
| B2 sócio 1 | Diego, casado **comunhão universal** | estado civil + regime | regime relevante p/ atos/anuência |
| B2 sócio 1 CLT | Diego tem CLT (R$8k) | duplo vínculo + teto INSS | já no teto → não recolhe INSS no pró-labore dele |
| B2 sócio 2 | Elisa, solteira, sem CLT | +sócios (2.3) | dados completos dos dois |
| B2 natureza | 2 sócios → **LTDA** | natureza jurídica | LTDA |
| B2 faturamento | faixa "30k+" | faixa guiada alta | tier alto |
| B2 Fator R | 2 pró-labores → folha ≥28% | Fator R | **Anexo III (6%)** — simulador mostra III compensa |
| B2 pró-labore | maior (bater 28%) | transparência custo (Karla) | mostra INSS+IR da folha maior |
| B3 | tier 30k+ · cartão | tier/método | instantâneo |

**Stress:** multi-sócio + casamento + duplo vínculo + LTDA + Fator R vira III.

---

## FLOW 4 — "Fronteira Regulada" ⚠️ (regulamentada disfarçada, falso-🟢)
**Persona:** Fernanda, "consultoria de alimentação e bem-estar". Armadilha: consultoria (`7020-4/00` 🟡) × nutrição (`8650-0/02` 🟢 condicional, CRN).

| Etapa | Input do caso | Condicional | Resultado |
|---|---|---|---|
| B1 descrição | "consultoria em alimentação e bem-estar" | mapeamento | **AMBÍGUO** — consultoria 🟢 × nutrição 🟡 |
| B1 desambiguação | mini-loop 2c | critério 3 (regulada?) | "é nutricionista registrada / prescreve dieta?" |
| ramo A | "sim, sou nutri, prescrevo" | → `8650-0/02` | **regulamentada (CRN) → 🟡 waitlist** |
| ramo B | "não, só oriento hábitos" | → `7020-4/00` | **🟢 atende** (linha tênue) |
| risco | IA aceita 🟢 sem perguntar | **falso 🟢** | pega no B2, redireciona (🟡 recuperável) |
| B1 fallback | incerto após 2 perguntas | 2e fallback humano | fila "incerto", nunca 🔴 automático |

**Stress:** critério não-regulamentada quando disfarçada de serviço comum. Falso-🟢 + fallback.

---

## FLOW 5 — "Knife-edge & Boleto" 🔪 (B2 borderline + B3 pagamento/cancelamento)
**Persona:** Gustavo, consultor de TI solo, faturamento topo, Fator R na borda. **CNAE:** `6204-0/00` (🟡).

| Etapa | Input do caso | Condicional | Resultado |
|---|---|---|---|
| B1 | "consultoria e suporte de TI" | mapeamento | `6204-0/00` **🟢 atende** |
| B2 faturamento | faixa "30k+", topo | faixa guiada topo | tier máximo; perto do teto anual Simples |
| B2 Fator R | folha = **exatamente 28%** | Fator R **knife-edge** | simulador **sensibilidade**: "na ponta de cima já vira III" |
| B2 anexos | anexos diferentes (pela maior × pela nota) | **L15 Larissa 🟡** | motor não resolve 100% → marca pendência |
| B2 pró-labore | ajusta p/ cruzar 28% | pró-labore + INSS+IR | mostra trade-off |
| B3 pagamento | **boleto → não paga** → dunning → expira → volta cartão | método fora do happy path | só `pago` destrava B4 |
| B3 cancelamento | cancela **depois** do CNPJ aberto | política 4 camadas | art.49 não cobre + taxa retida + multa |

**Stress:** Fator R na borda + anexos Larissa + boleto atrasa + dunning + cancelamento pós-abertura.

---

## FLOW 6 — "Caso Monstro" 👹 (boss / integração + bordas de escopo)
**Persona:** 3 sócios, empresa mista. **Natureza:** LTDA.

| Etapa | Input do caso | Condicional / colisão | Comportamento correto |
|---|---|---|---|
| B1 descrição | "damos consultoria **e vendemos produtos**" | ambíguo serviço×comércio | desambiguação 2c |
| B1 cesta mista | principal serviço 🟢 **+ secundário regulamentado** (`8650-0/03`) | principal 🟢, secundário 🟡 | separa: aceita principal, waitlista secundário c/ RT |
| B2 sócio 1 | Heitor, casado comunhão universal, integraliza capital com **imóvel** | regime + bem (avaliação/ITBI) | 🟡 **fora do recorte** — recusa graciosa/rota humana |
| B2 sócio 1 CLT | Heitor **CLT acima do teto INSS** | duplo vínculo + teto | não recolhe INSS no pró-labore dele |
| B2 sócio 2 | Igor **reside no exterior** | CPF + procuração + representante BR | 🟡 fora do MVP — barra/roteia, não trava |
| B2 sócio 3 | Júlia quer ser **CLT da própria empresa** | **bloqueio duro (Karla)** | form barra + explica |
| B2 Fator R | folha **exatamente 28%** + **anexos diferentes** | knife-edge + L15 Larissa 🟡 | trava parcial, marca pendência |
| B2 faturamento | topo, perto do **sublimite** | acessória estadual MG 🟡 | flag Larissa |
| B2 pausa | 3 sócios não cabem em 1 sessão | **salvar & retomar (dias)** | estado persiste, retoma idempotente |
| B3 pagamento | **boleto → não paga** → dunning → expira → cartão | método + falha + retry | só `pago` destrava B4, sem duplicar |
| B3 cancelamento | cancela **depois** de aberto | política 4 camadas | art.49 não cobre + taxa retida + multa |

**Testa:** (1) condicionais colidindo; (2) **bordas de escopo** (imóvel, sócio exterior, sócio-CLT) → recusa graciosa, não crash; (3) resiliência do state machine (pausa dias, boleto falho, retry, cancelamento).

---

## Links
- [[blocos-fluxo-abertura]] · [[mapa-telas-mobile]] · [[cnae-atendidos-e-nao-atendidos]] · [[HOME]]
