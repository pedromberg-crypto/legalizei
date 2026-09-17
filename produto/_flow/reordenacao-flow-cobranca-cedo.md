---
tipo: verdade
status: vivo
data: 2026-07-16
assunto: ordem-do-flow
tags: [produto, ux, flow, cobranca, reordenacao, personas, motor, decisao]
---

# 🔄 Reordenação do flow — cobrança cedo, B2 dentro do produto

> **Decisão estrutural travada 2026-07-16.** O flow antigo (Entrada→B4, T1–T23) cobrava no **T16**, depois de **15 telas de esforço**. Isso morreu. O novo cobra na entrada, logo após o gate de CNAE + a prova de economia, e **todo o resto vira flow interno, logado e pago**.
>
> Nasce do confronto com o funil real do líder → [[2026-07-16-funil-abertura-ate-pagamento]] + [[2026-07-16-pos-pagamento-operacao-real]]. Substitui a ordem de [[mapa-telas-mobile]] e [[mapa-ramificacoes-flow]] (que ficam como histórico da v1).

## 🎯 Por que mudou (o diagnóstico do Pedro)

1. **"Achei que fosse mais barato"** — preço só no T16, depois de 15 telas. Reatância garantida no pior lugar possível.
2. **Sete telas de depósito puro** (T6→T12: CPF, RG, renda, PII de terceiro, capital social) **sem nenhum retorno e sem nenhum compromisso**. Funil vazando por sete furos.
3. **O dossiê exportável (T15) saía antes de cobrar** — o cliente levava o melhor trabalho de graça.
4. **Ninguém no mercado faz assim** — confirmado com print: a Contabilizei cobra na **3ª tela**, com 6 campos rasos.

**A correção de rota (debate 16/07):** "preço mostrado tarde" e "preço cobrado tarde" são doenças diferentes. A reordenação cura as duas, mas só com o **N5 (teaser)** — senão a gente copia o funil de quem **não tem o que demonstrar** e joga fora o próprio diferencial.

---

## 🔓 FORA do app — antes do dinheiro (9 telas, ~5 no caminho rápido)

| # | Tela | Era | O que mudou |
|---|---|---|---|
| **N1** | Splash | T1 | — |
| **N2** | Welcome (3 slides, pulável) | T2 | — |
| **N3** | **Fork de 3 rotas** (UX-55 ✅ 16/07) | T3 | 🆕 *Quero abrir minha empresa* (primário) · *Já tenho empresa* → **flow #2 migrar** (secundário) · *Entrar na minha conta* (link, não botão). **Não usar "migrar" na copy:** é jargão e excluiria quem não tem contador, que é o **melhor** cliente do #2 (sem contador antigo, o risco do TTRT nem existe) |
| **N4** | **Gate-CNAE** + triagem (sócios? exterior?) → veredito 🟢/🟡/🔴 | T4 | 🆕 **+ faixa de faturamento** (alimenta o N5). **Sem campo de margem** — a faixa do N5 comunica a incerteza sem perguntar jargão pro leigo |
| **N5** | 🆕 **Teaser em 3 modos** (UX-51 ✅ 16/07) | — | **`swap`** → número fechado (depende só do código, é seguro) · **`fator-r`** → **faixa**: *"de R$0 a ~R$X/mês, depende de quanto você consegue se pagar"* · **`servico`** → sem número (UX-49). **A prova, sem o produto** |
| **N6** | **Criar conta** (e-mail + senha / social) | T5 | sai com **credencial funcionando** · detecta GOV.BR (UX-29) · captura coorte (UX-48) |
| **N7** | **A conta da abertura + plano** | T16+T17 | **fundidos** · custo total **com prazo por linha** · plano único · add-on endereço |
| **N8** | **Aceite do contrato** (assinatura) | T18 *(metade)* | **só o contrato de serviço.** Reversível, CDC art.49 limpo |
| **N9** | **Pagamento** (CPF + cartão/boleto/Pix) | T19 | CPF **valida situação cadastral aqui** · "Acelere seu processo" no cartão |

**→ pagou (ou gerou boleto) = está dentro. A casa nasce aqui.**

## 🔒 DENTRO do app — logado e pago (16 telas)

| # | Tela | Era | O que mudou |
|---|---|---|---|
| **N10** | Dados do sócio | T6 | CPF já validado no N9; aqui completa (RG, estado civil, endereço) |
| **N11** | Duplo vínculo CLT | T7 | — *(recuperação do UX-43 sobrevive)* |
| **N12** | +Sócios | T8 | — |
| **N13** | Dados da empresa + **upsell endereço** | T9 | 🆕 add-on cobrado **"a partir da 2ª parcela"** *(mecânica copiada do líder)* |
| **N14** | CNAE secundários | T10 | — |
| **N15** | Natureza jurídica | T11 | 🟡 regra "solo→SLU" **sob suspeita** (ver Pendências) |
| **N16** | Razão social + viabilidade | T12 | — |
| **N17** | **CNAE ótimo** *(condicional)* | T13 | **entrega ao cliente**, não isca. **Cumpre a promessa do N5** |
| **N18** | **Simulador Fator R** | T14 | o clímax. **Cumpre a promessa do N5** |
| **N19** | Revisão do dossiê | T15 | PDF vira **entregável de cliente**. 🔒 **trava se boleto não compensou** |
| **N20** | 🆕 **Termo irreversível** | T18 *(outra metade)* | **desce pra cá**: é onde a máquina liga e o dinheiro de governo sai. 🔒 **trava se boleto não compensou** |
| **N21** | **Painel de acompanhamento** | T20 | 🆕 **+ dispensas no pipeline** |
| **N22** | Convite 2º sócio *(cond.)* | T21 | — |
| **N23** | Assinatura GOV.BR + e-CAC | T22 | 🔒 **nunca pedir pra desabilitar 2FA** |
| **N24** | Empresa ativa + 1ºs passos | T23 | — |
| **N25** | 🆕 **TFLF (dia ~40)** | — | evento de **portal**, não de abertura |

---

## 🔑 As 5 decisões travadas hoje

### 1. Cobrar cedo, resolver o B2 dentro do produto
O modelo do líder é cobrar cedo e resolver o B2 **fora** (por e-mail, num link, com "Manual de preenchimento"). O nosso é cobrar cedo e resolver **dentro**. Estritamente melhor que os dois modelos na mesa.

### 2. 🆕 N5 — Teaser em 3 modos (o pilar) ✅ refinado 16/07
Sem ele, cobramos sem argumento e viramos commodity com passos a mais. Com ele, entregamos a **prova** (existe economia, é crível) sem entregar o **produto** (número exato, PDF, dossiê).

**Refinamento que fechou o UX-51 — as duas alavancas não têm o mesmo grau de certeza:**
| Modo | Quando | Promete |
|---|---|---|
| `swap` | há família de CNAE | **número fechado** — depende só do código, sabemos no N4 |
| `fator-r` | Anexo V sem swap | **faixa** *"de R$0 a ~R$X, depende de quanto você consegue se pagar"* — depende da **margem**, que não sabemos no N4 |
| `servico` | Anexo III direto | sem número (UX-49) |

⚠️ **Correção de modelagem (16/07):** o pró-labore **não é custo, é dinheiro do cliente** — o custo real é só INSS+IRRF. Quem fatura R$40k teria ganho de R$3.800 contra ~R$2.630 de custo: **valeria a pena**. O que trava é a **MARGEM** (quem subcontrata e fica com R$10k não tem de onde tirar R$11.200). Restrição de caixa, não de vontade.

**Efeito:** no modo `fator-r` a faixa **já inclui R$0** → não há piso a violar → a `promessa-quebrada` deixou de ser risco estrutural e virou teste de invariância. `TEASER_PISO` só vale no modo `swap`. **Sem campo novo no N4.**

### 3. 🆕 O T18 rachou em dois
| Ato | Onde | Natureza |
|---|---|---|
| **Aceite do contrato** | **N8** | virou cliente. **Reversível.** CDC art.49 vale limpo |
| **Termo irreversível** | **N20** | a máquina vai ligar, o dinheiro de governo vai sair. Aqui a exceção de "serviço iniciado" morde de verdade |

Estavam colados por acidente de ordenação. Hoje a alegação de serviço exaurido acontece **quando nada foi executado ainda** — frágil. Separados, cada um fica onde a lei espera. 🟡 ratificar com Larissa/Mauro.

### 4. Boleto FICA (decisão do Pedro)
Cortar boleto mataria a pausa P2 e simplificaria o sistema, mas perde cliente. **Fica.** Mecânica:
> Boleto gerado no N9 → **entra no app** → faz o B2 inteiro enquanto espera → **N19 (dossiê) e N20 (termo) travam** até compensar → compensou, destrava.

A casa existe, o dunning (UX-45) puxa **pra casa**, e o dossiê não sai sem pagamento — fecha o buraco original. Cartão atravessa em 30s e nem percebe.

### 5. CPF valida elegibilidade dentro do pagamento
O CPF é obrigatório pro gateway de qualquer jeito (o líder pede no mesmo lugar). **Mesmo campo, dois usos:** situação cadastral irregular → **não cobra**, roteia. Resolve "não vender pra quem não pode abrir" sem uma tela a mais.

---

## 👥 Personas — o remapeamento (14 → 16) · ✅ **IMPLEMENTADO, 16/16 PASS** (motor v0.3.0)

### ❌ Intactas (2)
| Persona | Por quê |
|---|---|
| `camaleao` | sai no veredito 🟡 (waitlist). O gate não mudou |
| `fronteira` | idem |

> ⚠️ **Correção do debate:** eu afirmei "5 intactas" contando `bloq-3socios`, `bloq-exterior` e `erro-orgao`. **O código desmentiu.** A spec do UX-21 dizia que a triagem de sócios/exterior acontecia no B1, mas **o motor v0.2.x nunca implementou isso** — barrava só lá no B2 (`b2.socio` / `b2.socios`). Divergência spec × motor que ninguém tinha visto, e que a reordenação tornou crítica: com cobrança no N9, barrar no B2 = **cobrar de quem não pode abrir**. Por isso nasceu o passo `b1.triagem`, e as duas personas de bloqueio **param mais cedo**. O `erro-orgao` também muda (a ordem geral mudou). O crédito ao UX-21 continua válido — a **decisão de UX** estava certa desde sempre e blindou o desenho; só não tinha virado código.

### 🔄 Remapeadas (10)
| Persona | Nota |
|---|---|
| `reta` · `cida` · `reta-direto` | ordem nova; `reta-direto` mantém a invariância da UX-48 |
| `sociedade` | titular paga sozinho no N9; 2º sócio entra no N22 *(já era assim)* |
| `monstro` | pipeline + pausas; **P2 muda de natureza** (agora dentro do app) |
| `instrutora` | paga no N9, vê o CNAE ótimo no **N17** — as 2 alavancas dão R$1.425 cada, teaser cumprido |
| `govbr-bronze` | detecção antes do dinheiro (N6) → assina no N23. **Bug achado:** CNAE 8599-6/04 é Anexo III **direto**; o motor dizia "Anexo V" e recomendava pró-labore ótimo inútil |
| `bloq-cltpropria` | recuperação no N11, pós-pagamento. **Sobrevive pelo UX-43** — se ainda fosse bloqueio fatal, ela pagaria e seria barrada na tela seguinte |
| `bloq-3socios` · `bloq-exterior` | **param em `b1.triagem`** (era `b2.socios` / `b2.socio`) — antes do checkout |

### 🔴 Lógica nova (1)
| Persona | O que muda |
|---|---|
| `knife` | boleto no N9 → **entra no app** → B2 completo → para em **`b2.termo`** com `aguardando-pagamento`. `b2.revisao` trava o export junto. Era: pausava fora, em `b3.pagamento` |

### 🆕 Novas (2)
| Persona | Testa |
|---|---|
| **`promessa-quebrada`** | **a mais perigosa do novo flow.** Vitor fatura R$40k mas subcontrata e só tira R$3k. O ótimo exigiria R$11.200 → **o caminho não existe pra ele** → economia real **R$0**. O teaser prometeu **R$3.800/mês** e foi o que vendeu o plano. **Ele já pagou.** Risco que não existia antes (ele via o número real antes de abrir a carteira) |
| **`cpf-irregular`** | Sandra tem CPF válido no dígito mas **suspenso na Receita**. Barra no N9 e **não é cobrada**. Não é cartão recusado, é elegibilidade — a copy precisa dizer a diferença |

> 🎯 **A `promessa-quebrada` expôs o mecanismo do risco, e ele é pior do que eu tinha descrito:** o teaser promete o **teto** do Fator R sabendo só CNAE + faixa. **Quanto maior o faturamento, maior a promessa e menor a chance de a pessoa alcançar** — a estimativa erra mais justamente em quem ela mais anima. Saídas possíveis (na persona): teaser como faixa · perguntar o pró-labore viável já no N4 · só exibir teaser quando há família de swap (economia que independe da folha).

## ⏸️ Pausas — o que mudou
| Pausa | Antes | Agora |
|---|---|---|
| **P1** salvar & retomar | wizard (B2) | **dentro do app** — ela tem casa |
| **P2** aguardando pagamento | limbo fora | **dentro do app**, trava N19+N20 (não o B4 inteiro) |
| P3 · P4 · P5 | — | inalteradas |

> 🏠 **Shell resolvido de brinde.** O debate T18 × T19 (onde nasce a casa) foi dissolvido pela reordenação: **a casa nasce no N9**. Wizard = N1–N9 (modo fullscreen, sem nav). Portal = N10 em diante. **UX-32 aposentado** na mesma sessão: a barra de progresso do wizard não continua na cauda — o N21 já tem a própria timeline, e no B4 o gargalo é a JUCEMG, não o cliente.

## 🕳️ Dois furos que a captura expôs no pipeline
1. **As dispensas não existem na nossa timeline.** O N21 lista viabilidade → DBE → JUCEMG → DAE → CNPJ → Simples → certificado → inscrição municipal/NFS-e → e-CAC. **Faltam dispensa sanitária + corpo de bombeiros** — e no caso real do Pedro elas foram **o gargalo**: alvará em 15/12, dispensas só em **02/01** (18 dias, a última etapa).
2. **A TFLF não existe em lugar nenhum.** Dia ~40, ~R$161 + correção, 4 dias pra pagar. Não é abertura, é **portal**. Virou o N25 e é a prova da tese: **a cauda é o produto**.

## 🟡 Pendências
- ~~Reescrever o motor~~ ✅ **FEITO 16/07 — v0.3.0, 16/16 PASS.** **Mas o contrato com o dev mudou:** as 14 personas eram o critério de aceite entregue ontem ([[legalize-handoff-dev-repo]]), agora são **16 e a ordem é outra**. O dev precisa saber **hoje** (ele está em E2E).
- 🔴 **`FISCAL.TEASER_PISO` = 0.5 é um default MEU, não ratificado.** É o piso que separa "estimativa honesta" de promessa quebrada (o real precisa ser ≥ 50% do prometido). Decisão de produto do Pedro.
- 🔴 **O que fazer quando a promessa quebra?** O motor hoje só **marca**. A `promessa-quebrada` segue até empresa ativa e o serviço é entregue (a abertura vale o preço sozinha), mas a expectativa foi criada por nós. Reembolso? Aviso honesto no N18 com opção de sair? **Não escolher também é escolher** — vira Reclame Aqui.
- **Natureza jurídica (N15)** — o caso real saiu **LTDA** num solo. Nossa regra diz "solo→SLU" como se fossem naturezas distintas. SLU é LTDA de sócio único (mesma natureza 206-2)? Se sim, **o T11 está mal formulado** e o guard-rail C6 pode estar errado. **Pergunta pra Larissa.**
- **DAE JUCEMG** — vault diz "R$288 **pago pelo cliente**" (Izabela) × "~R$268,51" (tabela), divergência aberta desde 09/07. O checkout do líder foi **R$195 total** e não há e-mail de DAE. Ou absorvem, ou o Pedro pagou por fora, ou há isenção. **Não localizado.** Não bloqueia agora; **muda a régua do preço** se absorverem → [[legalize-preco-deferido-custo-real]].
- **Rachadura do T18** — ratificar com Larissa/Mauro.
- **Reguladas** — decisão 16/07: **mantém waitlist** (o líder atende, cobrando primeiro e pedindo carteira depois). Reavaliar com o Mauro depois.

## Links
- [[2026-07-16-funil-abertura-ate-pagamento]] · [[2026-07-16-pos-pagamento-operacao-real]] · [[mapa-telas-mobile]] · [[mapa-ramificacoes-flow]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[blocos-fluxo-abertura]] · [[casos-teste-fluxo-cnae]] · [[compilado-ux-flow]] · [[legalize-handoff-dev-repo]] · [[HOME]]
