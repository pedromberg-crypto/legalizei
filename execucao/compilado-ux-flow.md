---
tipo: log
data: 2026-07-15
status: vivo
tags: [produto, ux, flow, log, otimizacao, backlog]
---

# 🔧 Compilado de otimizações de UX do flow — LOG VIVO

> **O que é:** fonte única do que melhorar no flow de abertura + o que já foi feito. Nasce das baterias de personas do [[motor-testes-arquitetura|motor de testes]] (coluna "Sugestão / olhar leigo"). **Rodada #1** (T0026–T0036) → 16 ✅ na spec. **Rodada #2** (T0068–T0079, 2ª ordem pós-otimização) → 13 itens 🔴 novos. Cresce a cada rodada ou ideia solta.
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
| UX-17 | Copy/B3 | Termo irreversível: "taxas de governo não voltam", sem letra miúda, botão único | reta, cida | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T18** (aceite) · fechado na rodada #3 |
| UX-18 | Pausas/B4 | Aviso proativo (WhatsApp) + "leva ~X dias" + estado visível a cada pausa | cida, reta, monstro | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T20** (painel de acompanhamento) · fechado na rodada #3 |

**Resumo rodada #1:** 18 ✅ aplicados · 0 🟡 · 0 🔴 (os 2 🟡 que esperavam B3/B4 fecharam na rodada #3).

---

## 📋 Itens (rodada #2 — 2ª ordem, pós-otimização, 2026-07-15)

> **O que mudou:** rodada #1 consertou a 1ª ordem (jargão, campo vazio, bloqueio cego, swap silencioso). Com o flow já robusto (11/11 PASS, T0068–T0079), a 2ª bateria das mesmas 11 personas revela o que **só aparece depois** que o óbvio foi resolvido: confiança, reversibilidade, memória entre telas, 2º sócio, dia-2. **Aplicados no mesmo dia:** 9 ✅ na spec + 4 🟡 (diretriz nas notas transversais, aguardam spec de portal/B4/conta). Ordenados por alavancagem (cross-persona no topo).

| ID | Grupo | Sugestão (2ª ordem) | Persona(s) | Status | Onde / quando |
|---|---|---|---|---|---|
| UX-19 | Dia-2 "e agora?" | Flow para em "empresa ativa" (troféu seco). Falta a ponte pro dia-2: quando emito a 1ª nota, quando vence o 1º DAS, onde está o certificado. Handoff ativo pro portal + (Cida) tutorial guiado da 1ª nota | reta, cida | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T23** (empresa ativa + primeiros passos) · rodada #3 |
| UX-20 | Co-founder | 2º sócio precisa confirmar dados e **assinar no GOV.BR** (b4.registro), mas nunca entrou no app (fluxo single-user). Convite pro 2º sócio + estado visível pros **dois** | sociedade, monstro | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T21** (convite do 2º sócio) + T20 (notificação multi-sócio) · rodada #3 |
| UX-21 | Fail-fast dos bloqueios | Perguntar **cedo** (B1/início do B2) o que barra: nº de sócios (>2) e sócio no exterior. Hoje barra só depois de investir dados do 1º sócio. A spec já promete exterior-no-B1 mas **não moveu** | bloq-3socios, bloq-exterior | ✅ | spec **T4 (triagem precoce, linha nova)** + T6 (exterior=confirmação) + T8 (limite) · 15/07 |
| UX-22 | Waitlist follow-through | 🟡 captura o contato mas é beco. Falta o "enquanto isso": previsão de quando abre + alternativa (rota Mauro manual). E separar "fora do escopo por ora" de "você precisa de RT" — regulada é servível | camaleao, fronteira | ✅ | spec **T4 (Captura 🟡 reescrita)** · 15/07 |
| UX-23 | Estimativa perecível | A simulação (Fator R/ótimo) de hoje **envelhece** em pausa longa/virada de ano (teto, mín, IRRF mudam). Revalidar ao retomar + avisar se mudou | knife, monstro | ✅ | spec **T14 (linha nova)** + nota transversal de re-entrada · 15/07 |
| UX-24 | Acoplar clt→simulador | b2.clt e b2.simulador são ilhas. O CLT do sócio (zera/folga o INSS) **muda o pró-labore ótimo**. O ótimo tem que consumir o dado do CLT, não recalcular do zero | monstro, sociedade | ✅ | spec **T14 (Pró-labore ótimo reescrito)** · 15/07 |
| UX-25 | Custo por sócio | 2 sócios de situações diferentes (um CLT, outro não) → mostrar o custo do pró-labore **por sócio**, não um número agregado | sociedade | ✅ | spec **T14 (linha nova)** · 15/07 |
| UX-26 | Over-trust do ótimo | CNAE ótimo **encanta** → risco de vender número 🟡 como certo. Carimbar "estimativa, confirmamos com o contador antes de registrar" + tradeoff honesto (cliente/edital exige CNAE?) + **prova exportável (PDF)** | instrutora | ✅ | spec **T13 (3 linhas novas: carimbo + tradeoff + PDF)** · 15/07 |
| UX-27 | Bloqueio vira ganho | CLT-própria: não basta "não pode". Mostrar o que o pró-labore **garante** (INSS/aposentadoria/RGPS) — mata o medo de "perder direitos", não só corrige o conceito | bloq-cltpropria | ✅ | spec **T7 (bloqueio CLT-própria)** · 15/07 |
| UX-28 | Modo assistido | Cida passa o app pra filha terminar (comportamento **real**, já é a pausa dela). Handoff "ajuda de alguém de confiança": parente continua de onde parou sem recomeçar nem perder o controle da conta | cida | ✅ | [[spec-telas-b3-b4-aterrissagem]] **notas transversais** (diretriz travada) · exec depende de arq. de conta 🟡 · rodada #3 |
| UX-29 | gov.br prata/ouro cedo | Assinatura exige conta GOV.BR nesse nível; leigo total tem bronze ou nenhuma. Detectar/guiar o upgrade **no B1**, não deixar travar no fim | reta | ✅ | spec **T5 (linha nova, nível GOV.BR)** · 15/07 |
| UX-30 | Anuência do cônjuge | Comunhão universal dispara assinatura do cônjuge em atos. Avisar **cedo** pra o sócio alinhar em casa antes de travar no cartório | sociedade | ✅ | spec **T6 (regime de bens)** · 15/07 |
| UX-31 | e-CAC explicada | Procuração e-CAC é opaca pro leigo ("dar poderes pra quem?"). 1 linha: é o que deixa o app pagar o DAS por você, com limite e revogável | reta | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T22** (assinatura + procuração e-CAC) · rodada #3 |

**Resumo rodada #2:** 13 itens de 2ª ordem · **13 ✅ aplicados** (9 na spec B1/B2 na própria rodada + 4 que eram 🟡 fecharam na rodada #3 via [[spec-telas-b3-b4-aterrissagem]]) · **0 🟡 · 0 🔴**. Regressão da rodada: **11/11 PASS** (T0068–T0079).

### 🎯 Leitura da rodada (padrões que emergiram)
- **A abertura acaba, o cliente não.** UX-19/28/31 apontam pro mesmo buraco: o flow entrega o CNPJ e some. O leigo precisa do **dia-2** (portal, 1ª nota, 1º DAS) — hoje é troféu, devia ser ponte.
- **O flow é single-user, o negócio às vezes é a dois.** UX-20/25/30: o 2º sócio existe no dossiê mas não no app — e ele **assina**. Onboarding do co-founder é gap estrutural, não cosmético.
- **Barrar tarde é o novo barrar cego.** UX-21: consertamos o *tom* do bloqueio; falta o *tempo* — perguntar o que mata a elegibilidade **antes** de o cliente investir 10 campos.
- **Confiança tem custo de validade.** UX-23/26: a estimativa encanta hoje e mente amanhã (virada de ano, claim 🟡 da Larissa). Carimbar "estimativa" + revalidar + prova exportável.
- **Telas que não conversam mentem.** UX-24: o ótimo calculado sem olhar o CLT do sócio dá número errado. Acoplar.

---

## 📋 Itens (rodada #3 — 3ª ordem, lida sem re-rodar, 2026-07-15)

> **O que mudou:** rodada #3 nasceu de **ler os artefatos** (11 trilhas + as 2 rodadas + a coluna de %), sem re-rodar o motor. A leitura-guia: os pontos baixos estavam concentrados na **cauda (B4 + dia-2)** e em coisas que **o motor testa mas a UI escondia** (idempotência). Daí saíram otimizações que levantam **várias personas de uma vez**. **Registrada e atacada na mesma sessão** (pedido do Pedro).

| ID | Grupo | Sugestão (3ª ordem) | Persona(s) | Status | Onde / quando |
|---|---|---|---|---|---|
| UX-32 | Mapa da jornada | Barra de progresso vira mapa: **onde estou / quanto falta / quanto já custou** no arco inteiro (~30 passos). Persistente entrada→ativa | todas | ✅ | spec B1/B2 **notas transversais** · rodada #3 |
| UX-33 | Conta da abertura | Custo total **antes do aceite**: o que é grátis (honorário) × taxas de governo (repasse ~R$268,51) × recorrente (mensalidade + endereço + certificado). Nunca esconder o repasse no preço | todas | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T16** · rodada #3 |
| UX-34 | Dossiê exportável | Generaliza a prova do CNAE ótimo (UX-26) pra **todo o enquadramento**: PDF do "por que esse CNAE/anexo/pró-labore". Defesa pra quem migra de contador | todas, esp. migração | ✅ | spec B1/B2 **T15 (revisão)** · rodada #3 |
| UX-35 | Handoff humano com dossiê | Todo bloqueio/waitlist entrega pro humano **o que já foi preenchido** (não só e-mail). Cohort "não encaixa" vira lead quente com contexto | camaleao, fronteira, bloq-3socios, bloq-exterior, bloq-cltpropria | ✅ | spec B1/B2 **T4 (handoff, linha nova)** · rodada #3 |
| UX-36 | Aterrissagem B4 + dia-2 | **Trata B3+B4+dia-2 como surface única.** Absorve os 4 🟡 (UX-19·20·28·31) + pausas proativas (UX-18) num spec só. **Maior alavanca:** levanta toda persona que chega em "ativa" | reta, sociedade, monstro, cida, instrutora | ✅ | [[spec-telas-b3-b4-aterrissagem]] **(doc inteiro)** · rodada #3 |
| UX-38 | Idempotência visível | O motor retoma idempotente; a UI passa a **comunicar** "salvo, nada cobrado nem aberto 2x". Mata o medo de quem pausou depois de pagar | reta, cida, monstro | ✅ | spec B1/B2 **transversais + T15** + [[spec-telas-b3-b4-aterrissagem]] **T20** · rodada #3 |
| UX-39 | Margem de segurança na borda | Não deixar cravar 28% no Fator R (1 mês fraco joga pro Anexo V no ano). Sugerir mirar ~30% de colchão. Fecha o gap não-catalogado do knife | knife | ✅ | spec B1/B2 **T14 (linha nova)** · rodada #3 |

**Resumo rodada #3:** 7 otimizações · **7 ✅ aplicadas** (spec B1/B2 + doc novo da cauda) · **0 🟡 · 0 🔴**. Efeito colateral: **fechou os 2 🟡 da rodada #1 (UX-17/18) e os 4 🟡 da rodada #2 (UX-19/20/28/31)** — todos aterrados na [[spec-telas-b3-b4-aterrissagem]]. **Acumulado geral: 38 itens ✅ · 0 🟡 · 0 🔴 na spec.**

### 🧭 Pontos cegos de cobertura (🔴 backlog — não dá pra otimizar o que não testamos)
> Pra honrar "cobrir **todas** as personas": as 11 atuais não cobrem estes casos. Enquanto não existirem, a % delas é **desconhecida**, não 100%. **Não atacados nesta rodada** (exigem construir persona / flow #2, não editar spec).

- ✅ **UX-37 — persona de erro recuperável** — **FECHADO 15/07.** Persona **`erro-orgao`** (nome reprovado na JUCEMG apesar da prévia → estado 🔴 "precisa de você" → recupera dentro do pipeline → ativa). Motor ganhou o evento **`recusa`** (irmão da `pausa`) + branch de viabilidade indeferida no schema v0.2.3. Destrava a validação completa da **UX-40**. Restam sem persona: cartão recusado · API de viabilidade fora.
- ✅ **GOV.BR bronze** — **FECHADO 15/07.** Persona **`govbr-bronze`** (Marta, professora particular): detecta bronze no B1 → upgrade guiado → assina prata/ouro no B4, sem travar. Fecha o arco UX-29 + UX-31.
- 🔴 **Personas `saas` / `bpo`** — famílias 2 e 3 do [[cnae-fiscalmente-otimo]]; estressam a T13 com outros clusters.
- 🔴 **Flow #2 MIGRAR** — já tem CNPJ, troca de contador. **Metade do mercado, zero testado.**
- 🔴 **MEI → ME** (desenquadramento) · **upsell-taker** (add-on de endereço no B3, nunca rodado) · **teto do Simples** (sublimite ISS perto de R$4,8M).

### 🎯 Leitura da rodada
- **A fronteira era a cauda.** Um doc só ([[spec-telas-b3-b4-aterrissagem]], UX-36) fechou 6 🟡 acumulados de 3 rodadas. Melhor ROI de spec da sessão.
- **O motor sabia o que a UI escondia** (UX-38): idempotência testada e invisível — barato de mostrar, mata ansiedade de pagamento.
- **"Cobrir todas" tem teto de honestidade:** a spec está em 38 ✅ / 0 aberto, mas 6 blind spots de cobertura seguem 🔴 — não são spec, são **personas a construir**.

---

## 📋 Itens (rodada #4 — 4ª ordem, 2026-07-15)

> **O que mudou:** com a spec em 38 ✅ / 0 aberto, a 4ª bateria das mesmas 11 personas (T0091–T0101, 11/11 PASS) não acha mais fricção de compreensão/confiança/cauda — acha o **anel seguinte: recuperação, decisão e follow-through**. O flow trata happy-path e bloqueio limpo, mas ainda não trata **falha de órgão**, **recuperação** (educa→continua) nem **decisão** (bloqueio→alternativa modelada). **Rodada mais fina e mais "pra fora"** — parte aponta pra produto/motor, não pra spec de UI (ver leitura).

| ID | Grupo | Sugestão (4ª ordem) | Persona(s) | Status | Onde / quando |
|---|---|---|---|---|---|
| UX-40 | Failure-state no B4 | Painel tem verde/girando/cinza, falta **vermelho/ação sua**: órgão recusa (nome apesar da prévia, DAE volta) → recuperação DENTRO do assíncrono, não limbo. Com 2 sócios, dizer **de quem é a vez** | reta, monstro | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T20** · validação completa 🟡 espera persona de erro (UX-37) · rodada #4 |
| UX-41 | Loop estimativa→realidade | Simulador prometeu "estimativa". Fechar o loop no dia-2+: mês 1-2 operando, o app volta com o **Fator R real** + revisão periódica ("seu enquadramento ainda é o melhor?") | reta, instrutora | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T23** · exec 🟡 vive no portal · rodada #4 |
| UX-42 | Bloqueio vira **decisão modelada** | Além do handoff (UX-35), **modelar a alternativa que o cliente decide agora**: 3 sócios→"2+1 como X ou Mauro faz os 3" · exterior→"Lucro Presumido custa Y" · nutri→"começar o caminho do RT" · representação→"MEI ou manual já cotado" | bloq-3socios, bloq-exterior, fronteira, camaleao | 🟡 | **produto — não aplicável por spec.** Exige decisão Mauro/Larissa (servir RT? cotar MEI/LP?) antes de virar tela |
| UX-43 | ⚠️ Over-block recuperável | CLT-própria **terminava** o flow (status bloqueado). Era só confusão conceitual — o motor agora **educa e segue** por pró-labore. Bloqueio educacional ≠ fatal | bloq-cltpropria | ✅ | **motor** `flow-schema.js` b2.clt (tirado o `valida` fatal; educa+segue) + persona reconvertida bloqueio→recuperação (agora completa até ativa) · rodada #4 |
| UX-44 | Consenso multi-sócio | Flow assume que os 2 sócios concordam. Revisão/aprovação **compartilhada antes do commit** + aceite explícito dos dois (não o dono clicando por todos) | sociedade | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T21** (consenso antes do commit) · rodada #4 |
| UX-45 | Re-engajamento (carrinho) | Dunning é passivo ("aguardando"). Proativo: "boleto vence em X, seu ótimo ainda economiza ~R$Y, retoma?" — carrinho abandonado com contexto fiscal | knife | ✅ | [[spec-telas-b3-b4-aterrissagem]] **T19** · exec 🟡 depende de régua CRM · rodada #4 |
| UX-46 | Reorientação ao reabrir | Retomar não é só restaurar tela: recap simples/falado "você parou aqui, já fez isto, falta isto" + **um próximo passo por vez**. Reorientar quem esquece (leigo) | cida | ✅ | spec B1/B2 **notas transversais** · rodada #4 |
| UX-47 | Memória de cálculo + "e se?" | Cliente avançado desconfia de caixa-preta. Abrir a **conta do Fator R** (não só o resultado) + modo **"e se?"** pra simular cenários sem sair do fluxo | knife, monstro, instrutora | ✅ | spec B1/B2 **T14 (linha nova)** · rodada #4 |

**Resumo rodada #4:** 8 itens de 4ª ordem · **7 ✅ aplicados** (6 spec + 1 motor) · **1 🟡** — UX-42, que **não é aplicável por spec** (decisão de produto Mauro/Larissa). Destaque: **UX-43 foi correção de lógica no motor** (b2.clt deixou de ser bloqueio fatal), com a persona `bloq-cltpropria` reconvertida de bloqueio → **recuperação** (agora completa até ativa). Regressão pós-mudança do schema: **11/11 PASS** (T0091–T0101 → nova rodada pós-fix).

### 🎯 Leitura da rodada (e por que é a última hoje)
- **O anel mudou de natureza.** Rodadas #1-3 foram UX de UI (compreensão→confiança→cauda). A #4 é sobre **estados que o flow não modela**: falha, recuperação, decisão. Menos "microcopy", mais "máquina de estados".
- **UX-43 foi a pepita — e virou correção de lógica no motor:** o bloqueio de CLT-própria **não devia ser terminal**. Corrigido em `flow-schema.js` (educa → destrava → segue); persona `bloq-cltpropria` reconvertida bloqueio→recuperação, agora completa até ativa. **A única mudança de comportamento do motor nesta rodada.**
- **Retornos decrescentes confirmados.** Sobra 1 item (UX-42) que **não é spec de UI, é decisão de produto/negócio** (servimos RT? cotamos MEI/Lucro Presumido?) e fica 🟡 até Mauro/Larissa. As 11 personas atuais estão **perto do teto do que conseguem revelar**.
- **Próximo lever real ≠ rodada #5 nas mesmas 11.** É **construir os blind spots** (erro recuperável, saas/bpo, migrar) — só eles abrem fricção nova de verdade.

---

## 📋 Itens (decisão de trilha — 2026-07-16)

> **O que mudou:** não é rodada de persona. Nasce do [[mapa-ramificacoes-flow]] (mapa de condicionais), que expôs uma tensão estrutural: as personas não são um espectro, são **2 extremos** (leigo total × avançado) que querem coisas opostas na mesma tela. Debatido e travado com o Pedro.

| ID | Grupo | Decisão | Persona(s) | Status | Onde / quando |
|---|---|---|---|---|---|
| UX-48 | Trilha/densidade | **Trilha ÚNICA + coorte instrumentada.** (1) **Universais viram default pra todos** — botão grande/rótulo literal, zero jargão, recap ao reabrir, acessibilidade: não é "modo leigo", é design bom, e o experiente não é prejudicado. (2) **Profundidade vira expander pra todos** (default fechado): memória de cálculo + "e se?", base legal, prova exportável — auto-seleção por comportamento, sem flag. (3) **Ritmo/layout** (1 bloco por vez × agrupado · tutorial × checklist) é o único tradeoff real e **NÃO se constrói agora**: T5 captura a coorte *"É a primeira empresa que você abre?"* como **dado puro** e a bifurcação só nasce **se o dado pedir** | todas (tensão cida/reta × knife/monstro) | ✅ | [[spec-telas-entrada-b1-b2]] **T5 + notas transversais** · [[spec-telas-b3-b4-aterrissagem]] **notas transversais** · **nota nova** [[spec-instrumentacao-flow]] · [[mapa-ramificacoes-flow]] (decisão) · motor `reta-direto` (invariância) · 16/07 |

### 🎯 Leitura da decisão
- **A pergunta do Pedro achou o furo:** a proposta inicial gatava **profundidade** atrás do flag. Errado — profundidade resolve com expander, de graça, sem chute. Só **ritmo/layout** justifica flag.
- **Metade do "modo leigo" não era modo, era design bom.** Botão grande, rótulo literal, zero jargão, recap: **universal**. Chamar isso de "modo" era um jeito de não construir pra todo mundo.
- **Anti-guru aplicado a produto (chamada do Pedro):** bifurcar UX hoje = construir em cima de hipótese, com zero dado. Pior: **a cobaia do E2E de 17/07 é o próprio Pedro** (já abriu empresa) — a trilha guiada nem seria validável. Instrumenta primeiro, decide depois.
- **Proxy morto:** o atalho "já sei meu CNAE" **não** qualifica experiência (caso real: o Pedro chegou sabendo o CNAE e nada mais). Pré-mark por comportamento descartado.
- **Custo zero de fork:** a coorte não é condicional. Contagem de condicionais e de telas **não muda**.

## 🧷 Follow-ups abertos (gerados por estas rodadas)
- ~~🔴 Re-sincronizar [[mapa-telas-mobile]]~~ ✅ **feito 15/07** — reescrito e sincronizado com as 2 specs (22 telas Entrada→B4, 23 c/ dia-2) + tabela de pausas.
- 🟡 **Espelhar no protótipo** `ux-ui/prototipo/` as telas novas/alteradas (protótipo não tem CNAE ótimo, bloqueios que educam, nem a cauda B3/B4/aterrissagem).
- ~~🟡 Spec de B3/B4~~ ✅ **feita na rodada #3** → [[spec-telas-b3-b4-aterrissagem]] (fechou UX-17/18/19/20/28/31).
- 🔴 **Cobertura do motor (blind spots):** persona de erro recuperável (UX-37) · `saas`/`bpo` · flow #2 MIGRAR · MEI→ME · upsell-taker · teto do Simples. **São personas a construir, não spec** — a % delas fica desconhecida até existirem.
- 🟡 **Números a travar** que a cauda expôs: nosso preço (vs benchmark R$195), endereço fiscal, certificado, DAE JUCEMG vigente → [[spec-telas-b3-b4-aterrissagem]] pendências.

## Links
- [[casos-teste-fluxo-cnae]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[cnae-fiscalmente-otimo]] · [[blocos-fluxo-abertura]] · [[motor-testes-arquitetura]] · [[HOME]]
