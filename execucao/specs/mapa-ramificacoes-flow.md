---
tipo: derivado
status: vivo
data: 2026-07-15
assunto: condicionais
deriva_de: [reordenacao-flow-cobranca-cedo]
tags: [produto, ux, telas, fluxo, condicionais, ramificacoes, personas, build]
---

# 🔀 Mapa de ramificações do flow (Entrada → B4)

> Todas as condicionais (forks) do fluxo de abertura, cruzadas com as **personas** do motor e os **vereditos de CNAE** (atende / waitlist / Mauro). Responde: **quantos desvios existem · onde divergem em telas próprias · onde reconvergem ao tronco · o que é saída terminal.** Companheiro de [[mapa-telas-mobile]] (inventário) + [[casos-teste-fluxo-cnae]] (personas) + [[blocos-fluxo-abertura]] (state machine) + motor `execucao/motor-testes/flow-schema.js` (lógica codada).

## 📊 Contagem: ~19 pontos condicionais, em 3 tipos
O que importa pro build não é o número cru, é **quantos geram tela própria**:

| Tipo | Quantos | Tela nova? |
|---|---|---|
| **A · Saídas terminais** (sai do flow, não volta) | **5** | ✅ telas de saída próprias |
| **B · Desvios com retorno** (diverge telas → volta ao tronco) | **7** | ✅ telas alternativas |
| **C · Condicionais inline** (mesma tela, muda conteúdo/número) | **7** | ❌ mesma tela |

**Happy path** (Reta: solo, cartão, sem swap) = **~20 telas lineares, zero desvio.**
**Telas/surfaces extras além do happy path** = **~7-8** (waitlist · template saída graciosa · desambiguação · CNAE ótimo · convite 2º sócio · estado vermelho · upgrade GOV.BR).

---

## 🚪 TIPO A — Saídas terminais (5)
Fork manda pra fora do fluxo de abertura. **Não reconverge.**

| # | Tela diverge | Gatilho | Destino (terminal) | Persona | Telas próprias |
|---|---|---|---|---|---|
| A1 | T3 Fork | "já sou cliente" | Login/portal (fora de abertura) | — | já existe |
| A2 | T4 Veredito | CNAE **🟡 regulada** (CRN/OAB/CREA…) | **Waitlist do produto** | camaleão-A, fronteira-A | ~2 (captura + "enquanto isso"/handoff) |
| A3 | T4 Veredito | CNAE **🔴 comércio/impeditivo** | **Comercial do Mauro** | camaleão-B | ~1-2 (captura comercial) |
| A4 | T6 Sócio | sócio **reside no exterior** | Bloqueio fatal (LC 123 art.17 II) → humano | bloq-exterior | ~1 (explica + rota) |
| A5 | T8 +Sócios | **3+ sócios** | Bloqueio de produto → humano | bloq-3socios | ~1 (explica + rota) |

**Economia de build:** A3/A4/A5 compartilham 1 **template de "saída graciosa"** (barra + explica + captura + roteia). Só A2 (waitlist) merece fluxo próprio.
**Os CNAEs mandam aqui:** dos 460 atendidos → **~260 serviço = 🟢** (segue) · **200 comércio cortados = 🔴** (Mauro/standby, [[cnae-comercio-standby]]) · **reguladas = 🟡** (waitlist). T4 = fork de maior volume → [[cnae-atendidos-e-nao-atendidos]].

---

## 🔄 TIPO B — Desvios com retorno (7)
Diverge pra tela(s) extra, depois **volta ao tronco**. Precisa desenhar o desvio + o ponto de volta.

| # | Diverge em | Gatilho | Telas extras | **Reconverge em** | Persona |
|---|---|---|---|---|---|
| B1 | T4 | CNAE **ambíguo/baixa confiança** | mini-loop desambiguação (T4) | T4 filtro/veredito | camaleão, fronteira |
| B2 | T8 | **2 sócios** (vs solo) | bloco repetido T8 + LTDA T11 + custo/sócio T14 + convite T21 | FIM (tronco B4) | sociedade, monstro |
| B3 | T13 | há **família de swap CNAE** | tela CNAE ótimo (T13) | T14 simulador | instrutora |
| B4 | T18-19 | **boleto/Pix** (vs cartão) | pausa "aguardando pagamento" + dunning | T20 (entra B4 após compensar) | knife, monstro |
| B5 | T21 | **>1 sócio** | convite + confirmação + consenso 2º sócio | T22 assinatura (os dois) | sociedade, monstro |
| B6 | T20 | órgão **recusa** (🔴 UX-40) | estado "precisamos de você" + ação | T20 pipeline (recupera) | **`erro-orgao`** ✅ (nova) |
| B7 | T22 | GOV.BR **bronze** | guia de upgrade prata/ouro | T22 assinatura | **`govbr-bronze`** ✅ (nova) |

---

## ⚙️ TIPO C — Condicionais inline (7)
Mesma tela, muda o conteúdo/número/aviso. **Não é tela nova**, é lógica dentro da tela.

| # | Tela | Condicional | Efeito |
|---|---|---|---|
| C1 | T6 | CPF inválido/irregular | erro inline recuperável |
| C2 | T6 | casado → regime de bens | revela campo + flag anuência (executa B4 T21) |
| C3 | T7 | duplo vínculo CLT sim/não | revela valor + folga do teto INSS |
| C4 | T7 | **CLT da própria** (UX-43) | educa → corrige p/ pró-labore → **segue** (não bloqueia) |
| C5 | T9 | upsell endereço fiscal | injeta add-on no plano B3 |
| C6 | T11 | guard-rail SLU×LTDA | bloqueia escolha incoerente + corrige |
| C7 | T14 | Fator R III×V + borda 28% | muda alíquota / pró-labore ótimo / margem |

---

## 🎯 Cobertura de persona (13 personas, 13 PASS)
As 11 originais + 2 novas fecham **todos** os forks A/B/C:

| Fork | Persona que testa |
|---|---|
| A2/A3 (waitlist/Mauro) | camaleão, fronteira |
| A4 (exterior) · A5 (3 sócios) | bloq-exterior · bloq-3socios |
| B1 (desambiguação) | camaleão, fronteira |
| B2/B5 (2 sócios + convite) | sociedade, monstro |
| B3 (CNAE ótimo) | instrutora |
| B4 (boleto/dunning) | knife, monstro |
| **B6 (erro de órgão / 🔴 recuperável)** | **`erro-orgao`** — nome reprovado na JUCEMG apesar da prévia → recupera |
| **B7 (GOV.BR bronze)** | **`govbr-bronze`** — Marta, professora particular, conta bronze → upgrade guiado |
| C1-C7 (inline) | reta, cida, sociedade, monstro, bloq-cltpropria |

> **Blind spots fechados 2026-07-15:** B6 e B7 antes não tinham persona. Agora testados no motor (schema v0.2.3 + `run.js` ganhou o evento `recusa`, irmão da `pausa`). B6 prova que uma recusa de órgão vira **estado 🔴 "precisa de você" + recuperação dentro do pipeline**, nunca crash nem limbo "em andamento" que na verdade travou. B7 prova o arco **detecta bronze cedo (B1) → guia upgrade → exige prata/ouro na assinatura (B4)** sem barrar.

---

## 📐 Implicação pro build
- **Prioridade 1 (happy path):** ~20 telas lineares. É o que a cobaia (CNPJ do Pedro) exercita no E2E de 17/07.
- **Prioridade 2 (saídas terminais A2-A5):** 1 template de saída graciosa + fluxo de waitlist. Baixo custo, alto valor (não perde lead).
- **Prioridade 3 (desvios B1-B7):** telas alternativas. B6/B7 são os mais críticos e recém-mapeados.
- **✅ Decisão travada 2026-07-16 — trilha ÚNICA + coorte instrumentada (UX-48).** Evoluiu em 2 passos no debate com o Pedro:
  - **Passo 1 — o flag encolheu.** A proposta inicial (flag de densidade com 2 níveis) misturava 2 eixos. **Profundidade** (quanto detalhe) **não precisa de flag**: resolve com **expander default-fechado pra todos** (UX-47/26/34) — auto-seleção por comportamento. Só **ritmo/layout** (1 bloco por vez × agrupado · 3 cenários × 1 recomendação · tutorial × checklist) é tradeoff genuíno, porque expander não resolve. E metade do que eu tinha posto no "modo leigo" (botão grande, rótulo literal, zero jargão, recap ao reabrir, acessibilidade) **não era modo — era design bom**, e virou **universal pra todos**.
  - **Passo 2 — não bifurca agora; instrumenta (decisão do Pedro).** Bifurcar ritmo hoje = construir em cima de hipótese, com zero dado — e a cobaia do E2E de 17/07 é o próprio Pedro (já abriu empresa), então a trilha "guiada" nem seria validável. Em vez disso: **1 trilha pra todos**, T5 captura a coorte *"É a primeira empresa que você abre?"* como **dado puro (zero mudança de comportamento)**, mede-se performance por coorte, e a bifurcação só se constrói **se o dado pedir** → [[spec-instrumentacao-flow]].
  - **Consequência pro mapa:** a coorte **não é condicional** — não é nem Tipo C. **Zero fork novo, zero tela nova.** A contagem de ~19 condicionais e 22/23 telas **não muda**.
  - **Descartados:** B (2 trilhas separadas = ~2x build, não testável E2E) · C (adiar tudo = mediano no lançamento; os universais e o expander são baratos e entram já) · pré-mark por comportamento (atalho "já sei meu CNAE" ≠ experiência — pesquisar 1 código não é saber abrir empresa).
  - **Invariância garantida por teste:** persona `reta-direto` prova que a coorte nunca vaza pra lógica fiscal.

## Links
- [[mapa-telas-mobile]] · [[casos-teste-fluxo-cnae]] · [[blocos-fluxo-abertura]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[cnae-atendidos-e-nao-atendidos]] · [[compilado-ux-flow]] · [[HOME]]
