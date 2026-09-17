---
tipo: verdade
status: vivo
data: 2026-09-17
assunto: achados-por-passada-de-persona
autoridade: fonte-verdade
tags: [execucao, motor-fiscal, persona, achado, ledger]
---

# 🐛 Achados por passada de persona — o ledger do motor

> 🧭 **Por que existe.** Pergunta do Pedro em 15/09: *"quero saber se todas essas correções e achados que você encontra em cada passada de persona você está registrando para não repetirmos?"* A resposta honesta era **em parte**: o achado entrava no **código** e no **commit**, e não chegava ao ADR, ao `HOME`, ao `_SUFICIENCIA` nem à auto-memória. O lado Flutter já tinha ledger (`docs/achados/A-001…A-009` no repo deles); o lado motor **não tinha**.
>
> 🔴 **E o buraco tem custo medido:** três vezes em 15/09 uma correção viveu só no código. A pior foi a CPP — corrigida no `apurador.mjs` em 14/09, deixada errada no `_tabelas.mjs`, e no dia seguinte eu li o dado e **repeti o erro pro Pedro** como se fosse verdade.
>
> 📌 **Regra:** achado de passada de persona entra aqui **no mesmo commit** que o conserto. Sem linha aqui, o conserto não está pronto.

## Como ler

| Campo | O que é |
|---|---|
| **Onde doeu** | o arquivo/função que estava errado |
| **Quem pegou** | a persona ou o teste que revelou — e é isto que diz se o elenco está valendo o custo |
| **Custo se passasse** | o que aconteceria com o cliente. Sem isso, achado vira lista |
| **Trava** | o que impede a volta. "nenhuma" é resposta válida, e é dívida |

---

## M-001 · A CPP embutida no DAS ficou no dado depois de sair do código
**15/09** · 🔴 grave · **Onde doeu:** `_tabelas.mjs` `FATOR_R_NUMERADOR.entra` · **Quem pegou:** o Pedro, mandando conferir uma afirmação minha
A correção de 14/09 (Res. CGSN 140/2018 art. 26 §2º I "a" nomeia o **Anexo IV**; o silêncio sobre III e V é vedação) entrou no comentário e no comportamento do `apurador.mjs` e **não entrou na tabela**, que seguia listando `cpp-embutida-no-das` em `entra` com o comentário *"é ela que ajuda a bater os 28%"* — a Leitura 1 refutada.
**Custo se passasse:** numerador inflado → app recomenda pró-labore **menor** que o necessário → cruzamento eSocial × PGDAS-D rebaixa pro Anexo V **retroativamente**, com multa. Nenhum número saiu errado porque o código já passava zero, mas o dado induzia quem o lesse — e induziu.
**Trava:** nenhuma. 🔴 **Dívida aberta:** não há verificador que confronte `FATOR_R_NUMERADOR` com o que o `fatorR()` de fato faz.

## M-002 · `projetarVirada` lia `fr.fatorR`, e o campo é `fr`
**15/09** · 🟡 médio · **Onde doeu:** `piloto-pro-labore.mjs` · **Quem pegou:** o rastro da P01 (saiu `NaN%` na tela)
**Custo se passasse:** o teste de monotonia do Fator R passava **a vazio** — `undefined` some no `.filter()`, e um teste verde afirmava nada.
**Trava:** o rastro imprime a razão, então `NaN` aparece. 🟡 Fraca: depende de alguém olhar.

## M-003 · O `Math.ceil` cru virava float noise em centavo cobrado
**15/09** · 🟡 médio · **Onde doeu:** `piloto-pro-labore.mjs`, o mínimo do mês · **Quem pegou:** o teste de borda (G-P1, caso E)
`0.28 × 216000` dá `60480.00000000001`; o `ceil` transformava o rastro em R$0,01 real. O mínimo saía R$42.649,**01** em vez de R$42.649,00.
**Custo se passasse:** cobrança de 1 centavo a mais em todo mês, e — pior — o teste de borda quebrava sem causa aparente.
**Trava:** ✅ `tetoCentavo()` com épsilon + o caso E do G-P1.

## M-004 · Manutenção tratada como recuperação: R$72.169 num mês
**15/09** · 🔴 grave · **Onde doeu:** `pilotar()` · **Quem pegou:** o teste G-P3
Com 12 meses de folha no piso e R$25 mil/mês, a 1ª versão mandava quitar o déficit inteiro numa competência. Conta certa, recomendação insana.
**Custo se passasse:** a tela pediria um valor impagável, e o cliente concluiria que o app está quebrado.
**Trava:** ✅ modos separados + `paraVirarJa` nunca fundido com `sugerido`.

## M-005 · Empresa pilotada e em dia classificada como "recuperação"
**15/09** · 🟡 médio · **Onde doeu:** `pilotar()`, o rótulo do modo · **Quem pegou:** 🔑 **o rastro da P16** — só apareceu na vida inteira, não em teste de um mês
A P16 foi pilotada desde o mês 2 e nunca atrasou nada, e ainda assim caiu em `recuperacao` em jun/jul 2026, porque a janela rola sobre meses de formato diferente. A razão pilotada escorregava para **29,4%**.
**Custo se passasse:** o app culparia o cliente por algo que é mecânica da janela, e deixaria a razão escorregar de propósito.
**Trava:** ✅ modo `ajuste-de-crescimento` (até 2× o sustentável, paga o que fecha a conta) + o invariante de garantia no G-P5.
⚠️ **Minha explicação inicial estava errada:** atribuí ao "crescimento" e escrevi teste em cima disso; o teste passou verde provando **outra coisa**. O teste hoje afirma a **garantia** (pilotada desde o mês 1, nunca cai abaixo do limiar), não a causa.

## M-006 · A projeção respondia a pergunta oposta à da tela
**15/09** · 🔴 grave · **Onde doeu:** `avaliarProLaboreEscolhido()` usando `viraEm` · **Quem pegou:** a simulação de edição do P01
O alerta dizia *"esse valor derruba pro Anexo V"* e na linha seguinte *"o Anexo III volta na 1ª competência"*. `viraEm` pergunta **quando volto**; a tela de edição pergunta **quando caio**.
**Custo se passasse:** alerta autocontraditório na tela mais sensível do produto — a que o cliente usa pra decidir contra a nossa recomendação.
**Trava:** ✅ `caiEm`/`mesesEmV` ao lado de `viraEm`/`mesesAindaNoV`, com o comentário dizendo qual pergunta é qual + teste G-P6.

## M-007 · Alerta de Anexo V em histórico saudável seria ruído
**15/09** · ℹ️ achado de desenho (não era bug) · **Quem pegou:** um teste MEU com premissa errada
Escrevi teste assumindo que baixar ao mínimo sempre derruba. Não derruba: com folha em 30% cheios, o mínimo legal do mês cai para R$1.080 e um mês ruim é **absorvido**.
**Por que importa:** é a diferença entre um app que avisa quando precisa e um que grita sempre. Virou invariante próprio no G-P6.

## M-008 · O alerta projetava só o pior caso, e assustava com ele
**15/09** · 🔴 grave · **Onde doeu:** `avaliarProLaboreEscolhido` · **Quem pegou:** 🔑 **o Pedro, lendo o output** — *"parece que o usuário fica 'o resto da vida' nesse anexo; o nosso recálculo mensal não faria ele voltar para o III?"*
A projeção segurava o valor escolhido **fixo por 24 meses**. Isso responde *"e se você mantiver isso?"*, que é o caso raro. Quem edita um mês e deixa o automático seguir vive outra história, e ninguém tinha medido qual.
**Medido na P01:** editar um mês custa **1 competência** no Anexo V (~R$1.710) porque o piloto compensa no mês seguinte pagando R$9.179 em vez de R$5.400. **Manter** custa **10 de 18** (~R$16.700 a mais de DAS).
**Custo se passasse:** a tela mostraria **R$39.330** para quem ia gastar **R$1.710** — alarme desproporcional na tela mais sensível do produto. O cliente ou desiste de uma mudança legítima, ou aprende a ignorar nossos alertas.
**Trava:** ✅ `projetarComPiloto()` + os campos `sePontual` e `seMantiver` lado a lado no alerta + invariante no G-P6.

## M-009 · A velocidade da volta depende da folga, e varia 7×
**15/09** · 🟡 médio · **Quem pegou:** um teste meu, com premissa mais apertada que a da P01
Com histórico a **30% cheios**, o piloto recupera em **1 competência**. Com histórico colado nos **28%**, leva **7**. A causa é o teto de 2× do `ajuste-de-crescimento`: quando o que falta não cabe nele, o piloto entra em `recuperacao` e paga só o sustentável.
**Não é defeito** — é a mesma trava que impede o R$72.169 do M-004. Mas é consequência que a tela precisa contar, e é o argumento mais forte a favor da margem de 30% sobre os 28% legais: **a folga não é só segurança, é velocidade de recuperação**.
**Trava:** ✅ invariante no G-P6 comparando os dois históricos.

## M-010 · O pró-labore sugerido OSCILA com receita constante
**15/09** · 🟡 aberto · **Quem pegou:** o rastro da P01 no horizonte de 18 meses
Com receita fixa em R$18.000, a sugestão vai R$5.400 → **R$7.021** (meses 13-14) → **R$2.158** (mês 15) → R$5.400. Fiscalmente correto (a razão fica em 30% o tempo todo): é a janela rolando sobre os dois meses iniciais sem receita.
**Por que importa:** o cliente vê o pró-labore dele triplicar e depois cair a um terço **sem nada ter mudado no faturamento**. É exatamente o tipo de coisa que destrói confiança no automático.
🔴 **Decisão aberta (Pedro):** suavizar a sugestão (média móvel, ou piso móvel que só sobe) é decisão de produto, não de motor. Suavizar custa precisão fiscal; não suavizar custa confiança.

## M-011 · A suspeita de agregação: procurada, não encontrada — mas o instinto estava certo
**15/09** · ✅ auditado · **Quem levantou:** o Pedro — *"parece que em parte do seu cálculo você passa a ignorar um montante de vários meses em vez de manter o controle mês a mês."*

Nasceu `auditar-agregacao.mjs`, que recomputa **na unha** e sem chamar o motor: os meses da janela, a soma da receita, a soma da folha, e se o valor sugerido produz **exatamente** o alvo ou passa dele. Roda nos **dois** caminhos — pilotado e real —, porque auditar só o pilotado seria auditar o caso que não dói.

**Resultado: 94 decisões, 5 vidas, nenhuma divergência.** A janela tem os meses certos, as somas batem, nenhum valor sugerido ultrapassa o teto absoluto (`30% × receita da janela`), e nenhum deixa a razão acima do alvo.

🔑 **Mas a percepção tinha causa real, e não era ruído:** os valores altos **são** derivados de agregado. `X = alvo × receita de 12 meses − folha já paga` cobra, num mês, o déficit de doze. É correto para uma razão retroativa e **não é um valor mensal** — e exibi-lo num campo mensal foi exatamente o **M-004** (o R$72.169). O instinto do Pedro e o defeito do M-004 são a mesma coisa vista de dois lados.

⚠️ **E os dois "12 meses" do motor NÃO são o mesmo conjunto:** o RBT12 (art. 24) exclui o mês corrente e vira média × 12 antes do 13º; a janela do Fator R (art. 26) inclui o mês que o piloto está decidindo. No 8º mês da P01 dão **R$154.285,71** e **R$108.000,00**. Trocar um pelo outro é o erro que esta auditoria existe para pegar.

## M-012 · 🔴 A guia do pró-labore somava os sócios e cobrava como se fossem UM
**15/09** · 🔴 **o mais grave do dia** · **Onde doeu:** `retratoDoMes` chamando `darfDoProLabore(folha somada)` · **Quem pegou:** 🔑 **a P02**, rodada a pedido do Pedro no modelo já validado

O motor somava o pró-labore dos sócios e calculava a guia com **um** teto de INSS e **uma** tabela progressiva de IRRF. Os dois erram, e para lados opostos:

| | motor antes | correto | erro |
|---|---|---|---|
| **P02** · 2 sócias × R$1.621 | R$ 272,31 | R$ 356,62 | **−R$ 84,31** |
| **P11** · 4 sócios × R$3.500 | **R$ 3.617,19** | R$ 1.540,00 | **+R$ 2.077,19** |

🔑 **O INSS erra para MENOS** porque o teto é da pessoa (Lei 8.212/91 art. 28 §5º): somar dois sócios faz a soma bater num teto que nenhum dos dois atingiu. **O IRRF erra para MAIS, muito**, porque a tabela é progressiva por beneficiário: R$14.000 numa pessoa cai em faixa alta; R$3.500 em quatro não cai em faixa nenhuma.

⚠️ **O Fator R não era afetado** — ele usa a folha total, e total é o número certo lá. O erro era só na guia. Atingia **8 das 16 vidas de então** (P02, P04, P06, P09, P11, P13, P14, P18) e todo o escopo de 1 a 4 sócios. `[HISTÓRICO]`

> 🔢 **Duas notas de número nesta linha, ambas de 17/09.** (1) Ela dizia *"7 das 16"* e **listava 8 IDs** — erro de contagem meu em 15/09, conferido agora contra o `vidas.mjs` daquele commit (`3f4e0a6`): eram **8**. (2) O elenco hoje é de **17 vidas**, e as que têm 2+ sócios **recebendo** caíram para **6** — porque em 16/09 o contador travou que **recebe quem administra**, e a P04 e a P14 passaram a pagar a um só. A linha fica com os números **de 15/09** de propósito: é o retrato do que o achado atingia quando foi achado.

🔑 **É a mesma família do que o Pedro descreveu no M-011** — um agregado tratado como valor individual. Só que o eixo é **pessoas**, não meses. A suspeita dele estava certa; o eixo é que era outro.

**Trava:** ✅ `darfDaFolha({ socios })` calcula sócio a sócio e soma no fim · `sociosComProLabore` na identidade · `darfDoProLabore` documentado como **por pessoa**.
⚠️ **Premissa declarada:** rateio **igual** entre os sócios, que é o que as vidas descrevem e o que o app coleta. Rateio desigual não tem campo ainda.

## M-013 · O invariante da P09 passava porque ENCODAVA o bug
**15/09** · 🔴 grave · **Quem pegou:** o próprio conserto do M-012, ao quebrar o teste

O `verificar-vidas.mjs` afirmava *"o INSS do P09 é ZERO — o CLT de R$9.000 já passou do teto"*, e passava verde. Só passava porque o motor tratava os dois sócios como uma pessoa e aplicava o CLT de um deles à soma. **O teste descrevia o defeito e o chamava de invariante.**

O correto: o sócio **com** o CLT acima do teto não recolhe; o **outro** não tem CLT nenhum e recolhe normalmente. Zerar a guia inteira isentava quem não tinha direito.

🔴 **Terceira vez hoje** que um teste passa pelo motivo errado (as outras: o `fr.fatorR` do M-002 e o invariante do Fator R corrigido em 15/09 de madrugada). **Padrão:** teste verde que afirma uma consequência sem afirmar a causa não protege nada.
**Trava:** ✅ o invariante agora afirma os dois sócios separadamente, via `darf.porSocio`.

⚠️ **Tensão de dados aberta:** o `personas-entrada-me.md` diz que na **P04** e na **P14** *administra só o titular* — e a Lei 8.212/91 art. 12 V 'f' diz que só quem administra recebe pró-labore. Mas as vidas pagam folha para 2 e 3 sócios. Não mexi no dado fiscal para não alterar Fator R sem decisão; fica registrado para o Pedro.

---

## M-014 · `guiaVencida` recebe CENTAVOS enquanto `apurarDAS` recebe REAIS

Achado em 16/09, montando o Bloco E do briefing. Chamei `guiaVencida({ principal: 1182.04 })` — reais, como em `apurarDAS({ receitaMes: 7910 })` — e a função **não reclamou**: devolveu multa de R$55,00 e total de R$1.262,04.

O motivo é que ela faz `emCentavos(emReais(principal) * pct)` para a multa e os juros, mas `principal + multa + juros` para o total. Com `principal` em centavos (118204) tudo fecha: **R$54,61 · R$24,70 · R$1.261,35**. Com `principal` em reais sai um número plausível e errado.

🔑 **O defeito não é a conta, é a fronteira.** A regra está correta e as conferências passam, porque elas chamam com a unidade certa. O que falta é a função **recusar** a unidade errada — hoje ela aceita as duas e só uma está certa.

⚠️ **Não é bug em produção:** nada no app chama `guiaVencida` ainda. É armadilha para quem chamar primeiro.
**Trava sugerida:** nenhuma ainda. Vira a dívida **D5**.

---

## M-015 · 🔴 A CPP errada tinha uma TERCEIRA cópia, e ela sobreviveu à trava que existia para pegá-la
**16/09** · 🔴 grave · **Onde doeu:** `processos/cru/prolabore.mjs` · **Quem pegou:** a varredura de aplicação das decisões do contador

A Leitura 1 da CPP (*"a CPP embutida no DAS entra no numerador do Fator R"*) foi refutada em **14/09**. O M-001 achou a 2ª cópia no `_tabelas.mjs`. Em 16/09 apareceu a **terceira**, viva num nó do desenho de processo — dois dias depois de o assunto estar encerrado.

🔑 **E o motivo dela ter sobrevivido é o achado de verdade, não o bug.** O `verificar-encerrados.mjs` varria os documentos de **pendência**, procurando o assunto voltar como **dúvida**. Esta cópia não era dúvida: era **afirmação**, num arquivo de desenho, dita com segurança. A trava estava certa e olhava para o lugar errado.
**Custo se passasse:** o desenho de processo ensinaria a regra refutada para a tela e para o dev — a fonte errada vira código novo.
**Trava:** ✅ `FONTES_DE_DESENHO` no `_encerrados.mjs` e a **segunda varredura** no `verificar-encerrados.mjs`, que agora lê fonte de desenho procurando **verdade afirmada**, não só pendência reaberta.

## M-016 · 🔴 A guia pagava pró-labore a TODO sócio, e quem recebe é quem administra
**16/09** · 🔴 grave · **Onde doeu:** `vidas.mjs` + o modelo · **Quem pegou:** o contador, na reunião

O motor dividia a folha entre **todos** os sócios da empresa. A regra é outra: recebe pró-labore quem **administra**. A P04 pagava a 2 de 2 e a P14 a 3 de 3, quando o certo era 1.
**Custo se passasse:** guia de INSS e DARF para sócio que não trabalha na empresa — dinheiro saindo do cliente por uma inferência nossa, e a inferência era do **percentual de participação**, que governa lucro, não pró-labore.
**Trava:** ✅ `sociosComProLabore` (*quantos recebem*) e `sociosTotal` (*de quantos*) passaram a ser campos distintos, com invariante para cada um.

## M-017 · 🟡 Concentrar a folha em menos gente pode custar MAIS IRRF — e o primeiro limiar era em centavos
**16/09** · 🟡 médio · **Onde doeu:** `ganhoDeIncluirSocio()` · **Quem pegou:** a P14, disparando 9 meses seguidos

Consequência direta do M-016: com a folha concentrada em um sócio, a tabela **progressiva por beneficiário** pode cobrar mais do que o rateio cobrava. Nasceu o `ganhoDeIncluirSocio()` para medir isso.

🔴 **A 1ª versão disparava com R$0,01 de diferença.** A P14 sugeria incluir sócio em 9 competências seguidas por causa de arredondamento. Um alerta que aparece sempre é um alerta que ninguém lê.
**Custo se passasse:** ruído crônico numa tela que só deve falar quando há fato.
**Trava:** ✅ o limiar virou **semântico** — só sinaliza quando o rateio de fato derruba o IRRF, não quando derruba um centavo. Medido na P21 em dez/2026: **R$228,86**.

## M-018 · 🐛 O prazo do alerta saía um mês adiantado, porque eu subtraí o que `vencimentoDe` já subtrai
**16/09** · 🟡 médio · **Onde doeu:** `alertas-internos.mjs` · **Quem pegou:** um invariante novo, na mesma rodada

O alerta A1 dizia **15/09** onde o prazo é **15/10**. Eu passei `mes - 1` para o `vencimentoDe`, sem ver que `Date.UTC` já é 0-indexado e a função já rolava para o mês seguinte.
**Custo se passasse:** o cliente recebe prazo **antes** do real. Parece conservador e não é: ele perde a chance de agir na janela que ainda tinha.
**Trava:** ✅ invariante que confere a data do alerta contra o calendário de vencimento, não contra a minha conta.

## M-019 · 🐛 `String()` numa data de prazo mostra o DIA ANTERIOR
**16/09** · 🟡 médio · **Onde doeu:** um invariante · **Quem pegou:** a leitura do próprio verde

O motor guarda vencimento em **UTC à meia-noite**. Em UTC−3, `String(data)` renderiza *"21:00 do dia anterior"*.
**Custo se passasse:** se vazar para tela, o cliente lê **um dia a menos** de prazo — e o erro se parece com zelo.
**Trava:** 📌 regra escrita: **sempre `.toISOString()` numa data de prazo, nunca `String()`**.

## M-020 · 🐛 `emCentavos()` numa soma que já estava em centavos
**16/09** · 🟢 pego antes de rodar · **Onde doeu:** `ganhoDeIncluirSocio()` · **Quem pegou:** eu, relendo antes de executar

`darfDoProLabore` recebe **reais** e devolve **centavos** — a mesma fronteira do M-014. Somei as guias e ia converter de novo.

⚠️ **O que assusta neste não é o erro, é que ele não quebrava teste nenhum.** Multiplicaria as guias por 100 e passaria verde.
**Trava:** 🟡 comentário explícito na função. Fraca — é a **D5** de novo, e ela segue aberta.

## M-021 · 🔴 O piso do pró-labore era o de HOJE, e bloqueava salário mínimo legal de 2025
**16/09** · 🔴 grave *(latente)* · **Onde doeu:** `PREVIDENCIA.SALARIO_MINIMO` · **Quem pegou:** a varredura do piso, provocada pelo contador

Com uma constante única (R$1.621, de 2026), um pró-labore de **R$1.518 pago em dez/2025** — que era **exatamente o mínimo daquele mês** — saía marcado como irregular.

🔑 **O contador levantou como manutenção** (*"todo ano você vai rodar um código pra atualizar?"*) e o achado era de **correção**: 5 das 18 vidas começam em 2025.
**Custo se passasse:** o app acusaria de irregular um pagamento que a lei aprovava, na cara do cliente.
**Trava:** ✅ `SALARIOS_MINIMOS` com **vigências** e `salarioMinimoDe(mes)`. `PREVIDENCIA.SALARIO_MINIMO` ficou como *"o vigente hoje"*, e quem apura competência histórica usa a função.

## M-022 · 🔴 A vida nova modelava o cliente RECUSANDO a oferta, e provava o oposto
**16/09** · 🔴 grave *(de modelagem, não de código)* · **Onde doeu:** a P21 · **Quem pegou:** o próprio invariante que a pediu

A P21 nasceu para provar que faturar no mês da abertura custa **um mês** e se resolve no seguinte. A 1ª versão dela tinha **folha zero no mês da abertura** — ou seja, o cliente não pagou pró-labore. A vida inteira ficou no Anexo V.

🔑 **Persona errada não falha: ela passa, afirmando o contrário do que existia para afirmar.** É a categoria mais cara de erro deste projeto, porque veste a roupa de prova.
**Custo se passasse:** teríamos "provado" que o caso do 1º mês é permanente, e desenhado tela em cima disso.
**Trava:** ✅ invariante que exige `proLaborePago > 0` na competência da abertura, com o motivo escrito ao lado.

## M-023 · 🔴 O redutor do IRRF "seco" cria um PENHASCO de R$312,88
**16/09** · 🔴 grave · **Onde doeu:** a leitura do art. 3º-A · **Quem pegou:** a conferência empírica, contra a memória do contador

O contador repetiu **6 vezes** um limite de **R$3.500** que **não existe** (lembrança de projeto de lei antigo). E a leitura de corte seco que ele descreveu produz um resultado que a lei não produz: com R$5.000,00 de bruto o líquido é R$4.450,00; com **R$5.000,01**, cairia para R$4.137,12.

🔑 **Um centavo a mais de bruto tirando R$312,88 do bolso é a prova de que a leitura está errada** — não é opinião, é a forma da função. Por isso existe a rampa.
**Custo se passasse:** conta de IRRF errada exatamente na faixa em que o nosso cliente vive.
**Trava:** ✅ a conferência **G10b** no `verificar-apurador.mjs`, que varre R$4.900–7.500 e derruba a rodada se o líquido inverter.

## M-024 · 🔴 O número "7" estava errado em QUATRO arquivos, e 7 + 7 não fechava com 16
**17/09** · 🔴 grave *(de prosa, não de cálculo)* · **Onde doeu:** `_achados-do-motor`, `_duvidas-contador`, `_modelo.mjs` e o reporte ao Mauro · **Quem pegou:** a trava de defasagem, na 1ª rodada com recortes

Duas frases complementares diziam **7** sobre um elenco de **16**: *"7 vidas com sócio único"* e *"o bug dos sócios atingia 7 das 16"*. Eram **8 e 8**. Uma delas listava os 8 IDs na mesma linha em que dizia 7.

🔑 **O erro sobreviveu porque cada frase morava num arquivo.** Nenhuma contradizia nada visível de onde estava. Só somando as duas o furo aparece — e ninguém soma prosa.
**Custo se passasse:** número errado no documento que foi para o contador, e no reporte que foi para o sócio.
**Trava:** ✅ `verificar-defasagem.mjs` mede **recortes** (sócio único, mês da abertura, início em 2025), não só totais, e exige a forma `N das M vidas <predicado>` para que o denominador também seja conferido.

## M-025 · 🔴 A própria trava era cega: `com` casava dentro de `começam`, e `**` escondia o número
**17/09** · 🔴 grave · **Onde doeu:** `verificar-defasagem.mjs` · **Quem pegou:** eu, estranhando um verde rápido demais

Dois furos na mesma trava, no dia seguinte ao de ela nascer:

1. O recuo `(?!\s+(?:com|que|sem|…))` estava **sem `\b`**. Em *"5 das 16 vidas **começam** em 2025"*, o `com` casava dentro de `começam` e a linha passava. O `16` errado sobreviveu em **3 arquivos** por causa disso. `[HISTÓRICO]`
2. O padrão varria a **marcação**, não o texto. `**45 conferências** no motor` não casava com `conferências no motor`. Passou limpo por um número errado em **1**, e por outro errado em **26** (o piloto dizia 41 e são 67). `[HISTÓRICO]`

🔑 **Trava cega é pior que trava ausente:** esta rodou **verde** afirmando que estava tudo em dia.
**Custo se passasse:** eu diria ao Pedro que a trava garante os números, e ela não garantia.
**Trava:** ✅ `\b` no recuo, varredura sobre a linha **sem ênfase**, e padrões de **tabela** (número depois do pipe) — testados plantando números errados de propósito e conferindo que a trava morde.

## M-026 · 🐛 "Todas, sem exceção" era falso, e estava escrito no código
**17/09** · 🟡 médio · **Onde doeu:** comentário da P21 em `vidas.mjs` · **Quem pegou:** a trava de defasagem, de raspão

O comentário afirmava *"as 16 vidas abriam sem faturar no mês 1 — todas, sem exceção"*. **P03, P07 e P14 já faturavam no mês da abertura.** O caso não aparecia nelas porque as três são `III-fixo`: sem Fator R, não existe janela para ficar vazia. `[HISTÓRICO]`

🔑 **A afirmação absoluta era a parte errada.** O raciocínio estava certo e a generalização, não — e foi um achado de **número** que derrubou uma frase **sem número**.
**Trava:** nenhuma automática. É a fronteira declarada da trava: ela pega dígito, não quantificador.

## M-027 · 🔴 O resumo do replay devolvia DUAS unidades no mesmo objeto, e o chamador compensava com `* 100`
**17/09** · 🔴 grave *(latente)* · **Onde doeu:** `replay-piloto.mjs` `resumir()` · **Quem pegou:** a aferição das afirmações em R$ que foram ao contador

Ao conferir os números do P16 contra o motor, o pró-labore saiu **100× menor** que o DAS no mesmo resumo. O motivo: `l.*.proLabore` vem em **reais** (é o que a vida declara) e `das`/`darf` vêm em **centavos** (é o que o apurador devolve). O `resumir()` somava os três e devolvia os três juntos, sem dizer que um era diferente.

🔑 **E o mais instrutivo é que ninguém tinha errado por causa disso** — o `rastrear-piloto.mjs` compensava com `reais(resumo.proLaboreReal * 100)` na hora de imprimir. **Workaround no chamador não é conserto:** é uma armadilha armada para o próximo chamador, que não vai saber que precisa dela.

**Custo se passasse:** qualquer tela ou relatório novo que formatasse esse campo mostraria **R$356,62** onde o valor é **R$35.662,00**.
**Trava:** ✅ a conversão acontece **uma vez, na fonte**, e os campos passaram a se chamar `proLaboreRealCentavos` / `proLaborePilotadoCentavos` — o nome carrega a unidade. É a cura escrita na **D5** desde o M-014, aplicada pela primeira vez.

⚠️ **Terceira ocorrência da mesma fronteira** (M-014, M-020, M-027), e a primeira que foi **consertada** em vez de comentada.

---

## M-028 · 🟡 A tabela da "paulada" trocava de BASE no meio, e por isso não fechava com ela mesma
**17/09** · 🟡 médio *(de coerência, não de cálculo)* · **Onde doeu:** `_duvidas-contador` A5 · **Quem pegou:** a aferição dos valores em R$

A tabela listava `INSS R$932,31 + IRRF R$11.751,36`, chamava de **custo extra** o valor `R$12.505,36` e fechava com saldo `−R$10.311,02`. **Nenhum dos três está errado** — e mesmo assim a tabela não encadeia:

| | |
|---|---|
| R$12.683,67 | a guia cheia (932,31 + 11.751,36) |
| R$12.505,36 | o extra **sobre a base de R$1.621** (o mínimo) |
| R$11.940,02 | o extra **sobre a base de R$5.400** (o sustentável) |
| −R$10.311,02 | saldo calculado com a **segunda** base, numa tabela que usava a **primeira** |

🔑 **Duas bases porque são duas perguntas diferentes**, e as duas são legítimas: o contador pergunta *"compensa regularizar de uma vez?"* (base: o mínimo, que é o que a pessoa vinha pagando) e o piloto pergunta *"devo saltar em vez de pagar o sustentável?"* (base: o sustentável). O erro foi **importar o saldo de uma tabela para a outra**.

**Custo se passasse:** o contador confere a soma, ela não bate, e a desconfiança contamina a tabela inteira — inclusive as linhas certas.
**Trava:** nenhuma automática. ✅ Corrigido pela redação: **cada linha agora nomeia a base**, e as duas tabelas declaram qual pergunta respondem. Vira a dívida **D8**.

## M-029 · 🔢 O comentário que autoriza o piloto a agir sozinho estava defasado
**17/09** · 🟡 médio · **Onde doeu:** `piloto-pro-labore.mjs` · **Quem pegou:** a aferição dos valores em R$

O comentário dizia que a varredura cobre *"receita de R$5 mil a R$30 mil × RBT12 de R$50 mil a R$355 mil"* e que *"o pior saldo foi +R$386,82/mês"*. A varredura viva do `verificar-piloto.mjs` é **R$2 mil–30 mil × R$24 mil–360 mil**, e o pior saldo é **+R$163,00/mês**. Alargaram a varredura e o comentário ficou para trás. `[HISTÓRICO]`

🔑 **É o pior número do motor para envelhecer**, e não por ser grande: é o que **autoriza o piloto a mexer no pró-labore sem perguntar ao cliente**. Quem ler o comentário lê uma garantia mais folgada do que a medida.
**Trava:** ✅ virou a **primeira medida em R$** do `verificar-defasagem.mjs`.

⚠️ **E a 1ª versão dessa medida não pegou o valor velho:** o padrão casava `R$163/mês` e não `R$386,82/mês` — prendia a citação certa e deixava passar a errada, que é o verde mais enganoso que existe. Dinheiro agora é comparado em **centavos**, porque `R$163` e `R$386,82` são a mesma grandeza escrita de dois jeitos.

## M-030 · 🔴 O arredondamento decidia empate de meio centavo por ACASO
**17/09** · 🔴 grave *(latente desde 14/09)* · **Onde doeu:** `apurador.mjs` · **Quem pegou:** a rede da migração para centavos

Ao padronizar as unidades, **8 valores mudaram um centavo**. A investigação mostrou que os dois casos-raiz caem em **empate exato de meio centavo**:

| | valor exato | caminho antigo | caminho novo |
|---|---|---|---|
| P16 dez/25 · COFINS | **54637,5** | `54637.5` → sobe | `54637.49999999999` → desce |
| P18 nov/25 · PIS | **14182,5** | `14182.499999999998` → desce | `14182.5` → sobe |

🔑 **Cada caminho acertava um e errava o outro.** Não havia regra — havia ruído de ponto flutuante decidindo quanto o cliente paga.

**Custo se passasse:** guia com um centavo de diferença do PGDAS-D é divergência com a Receita, e o valor mudaria conforme a ordem em que alguém escrevesse a multiplicação.
**Trava:** ✅ `centavoDe(x) = Math.round(x + 1e-9)` — **meio centavo sobe**, explicitamente. Mesmo remédio do `tetoCentavo` do piloto (M-003), pela mesma razão.

⚠️ **Não é defeito da migração, é defeito que a migração revelou.** Estava lá desde 14/09, escondido porque nenhuma conferência caía num empate.

🔑 **E veio uma segunda decisão junto:** o IRRF é `impostoTabela − redutor`, e antes o motor arredondava a **diferença**. Agora arredonda **cada parcela**. A entrega expõe os três campos ao dev — se `irrf ≠ impostoTabela − redutor`, ele refaz a conta, não bate, e procura o erro dele num erro nosso.

## M-031 · 🔴 A porta de entrada convertia duas vezes quem já estava dentro
**17/09** · 🔴 grave · **Onde doeu:** `replay-piloto.mjs` · **Quem pegou:** a trava de defasagem

A migração pôs a conversão reais→centavos dentro da `competencia()`, que é a porta de autoria. Funciona — e cria um risco novo: **quem recebe uma competência pronta e a passa de volta pela mesma função converte duas vezes**.

Era o que o replay fazia ao montar a série pilotada (`competencia({ ...real })`). O saldo do cliente da P01 saiu **−R$6.335.092,81** onde o valor é **R$6.794,96**.

🔑 **Nenhuma suíte reclamou.** Quem pegou foi a trava de defasagem, comparando com o número escrito no briefing que foi ao contador — um número em **prosa** protegeu o **código**, que é o inverso do que ela foi construída para fazer.

**Trava:** ✅ `competenciaEmCentavos()` — duas portas, e o nome diz de qual lado se está.

## M-032 · 🟡 O piso do salário mínimo virava DÉFICIT em mês sem receita
**17/09** · 🟡 médio · **Onde doeu:** `piloto-pro-labore.mjs`, o rótulo do modo · **Quem pegou:** 🔑 **o Pedro**, montando um teste com a empresa dele

Empresa com o Fator R da janela em **30,36%** — acima da margem de 30%, muito acima do limiar de 28% — num mês de receita **zero**, era classificada como **`recuperacao`**. Nada estava em recuperação: ela estava adiante do alvo e a lei não exigia nada naquele mês.

**A causa:** `paraVirarJa` é `max(mínimo na margem, PISO)`. Com receita zero, o `sustentavel` é zero, e o déficit virava `piso − 0 = R$1.621` — que não é déficit, é o salário mínimo que a lei exige de qualquer pró-labore.

🔑 **O déficit responde *"quanto a janela está atrás do alvo?"*.** O piso responde *"qual o menor pró-labore legal?"*. Somar os dois numa conta só faz o piso virar dívida.

**Custo se passasse:** o `paraVirarJa` só é exposto quando o modo é `recuperacao`, então a tela mostraria um *"para virar já"* que é só o piso, como se fosse um salto a dar. **O valor sugerido saía certo** (R$1.621) — o defeito era só de classificação, e é a mesma família do **M-005**.
**Trava:** ✅ o déficit passou a ser `naMargem.minimo − sustentavel`, sem o piso no meio. As 67 conferências do piloto passam, e o congelado de 4.440 legíveis **não mudou uma linha**: nenhum valor de nenhuma das 162 competências se moveu.

⚠️ **Quem pegou foi um teste de cenário, não uma suíte.** Nenhuma das 17 vidas de então tinha mês de receita zero com a janela já acima da margem — é o buraco de cobertura que este achado expõe. `[HISTÓRICO]`

---

## ✅ Aferição de 17/09 — os valores em R$, um a um

> 🧭 A trava de defasagem nasceu conferindo **contagens**. Esta auditoria atacou a outra metade: **576 ocorrências em R$, 261 valores distintos** nos 12 textos vivos, nenhum conferido por máquina até aqui.

### O que foi medido contra o motor

| Cluster | Valores | |
|---|---|:--:|
| **Totais do Bloco D** — P01, P03, P09, P11, P16 *(faturou · DAS · DARF · meses no V)* | 13 | ✅ |
| **Tabela de faixas** — R$900,00 · R$1.012,01 · R$2.580,00 · 6,0000% · 6,3250% · 8,6000% · 6,8667% · 8,0800% | 12 | ✅ |
| **A janela do P01** — R$17.831 · R$59.400 · R$64.800 · R$46.969 · R$42.649 · R$41.569 · R$1.080 · R$4.320 | 10 | ✅ |
| **Valores de lei** — teto R$8.475,55 · R$932,31 · desconto R$607,20 · 1ª faixa R$2.428,80 · mínimos R$1.518/R$1.621 · redutor R$312,89 e R$978,62 | 10 | ✅ |
| **O exemplo dos 4 sócios** — R$3.617,19 · R$1.540,00 · R$2.077,19 · base R$13.067,69 · imposto R$2.684,88 · R$39,76 | 10 | ✅ |
| **O penhasco do redutor** — R$4.450,00 · R$4.450,01 · R$4.137,12 · R$312,88 | 4 | ✅ |
| **O atraso do P09** — 3 competências × (DAS · multa · juros · total) + R$393,32 | 13 | ✅ |
| **Decomposição do DAS** — IRPJ R$18,98 · CSLL R$16,61 · COFINS R$60,84 · PIS R$13,19 · CPP R$205,98 · ISS R$158,99 · **R$474,59** | 7 | ✅ |
| **O IRRF de R$5.400** — INSS R$594,00 · base R$4.792,80 · tabela R$409,29 · redutor R$259,64 · devido R$149,65 | 5 | ✅ |
| **O erro dos sócios na P02** — R$272,31 · R$356,62 · −R$84,31 | 3 | ✅ |
| **A paulada** — guia R$12.683,67 · R$178,31 · R$743,65 · R$11.751,36 · R$1.629,00 | 5 | 🟡 **M-028** |
| **Concentração da folha, P04** — R$616,00 · R$844,86 | 2 | ✅ |
| **P16, soma dos impostos** — R$91.006 · R$78.706 · saldo R$12.299 | 3 | ✅ |
| **Teto da multa** — 20% no 61º dia, R$1.236,65 | 2 | ✅ |
| **A varredura do piloto** — pior saldo | 1 | 🔴 **M-029** |

### O placar

**~100 valores aferidos · 98 certos ao centavo · 1 defasado (M-029) · 1 incoerente entre linhas (M-028).**

🔑 **E os dois que falharam não eram de cálculo.** O motor não errou nenhuma conta: o que apodreceu foi **um comentário** que descrevia uma varredura antiga, e o que não fechava era **a montagem de uma tabela** que importou o saldo de outra. Cada número individual estava certo.

### O que NÃO dá para aferir assim, e por quê

| Classe | Exemplos | Por que fica de fora |
|---|---|---|
| **Entrada das vidas** | receitas de R$12k, R$18k, R$25k · pró-labores declarados | são o **enunciado**, não o resultado — conferi-los é conferir o `vidas.mjs` contra ele mesmo |
| **Evidência da conta real** | R$229,85 de multa · R$198,89 de ISS · R$9.895,00 da nota · R$474,59 do recibo · R$281,08 do DAE · R$168 da Prefeitura | vêm de **documento emitido**. O motor pode bater com eles (e bate), mas não os produz |
| **Citação literal do contador** | R$3.500 · R$4.730 · R$50/R$200 de multa | é **fala dele**, com incerteza declarada. Corrigir seria falsificar a fonte |
| **Preço nosso** | R$139 · R$49 · R$39 · R$209 · R$79/R$99 | decisão de negócio, travada em ADR. A fonte é `fiscal.ts`, não o motor |

⚠️ **Então "98 de 100" não vira "98% de segurança nos R$".** Vira: **a classe que o motor deriva foi aferida inteira e fechou**; as outras três classes são conferidas contra documento, contra a fala e contra o ADR — e essas não têm script.

---

## 🔴 Dívidas que estes achados deixaram

| | Dívida | Dono |
|---|---|---|
| **D1** | Nenhum verificador confronta `FATOR_R_NUMERADOR` (o dado) com o que `fatorR()` faz (o código). O M-001 pode voltar em outra constante | produto |
| **D2** | A régua de **2×** que separa ajuste de recuperação veio de 2 pontos medidos (1,22× e 9,6×). Caso real entre 2× e 9× é onde ela quebra | produto |
| **D3** | O piloto **corta** pró-labore, não só sobe (P02, P04, P06). Está implementado como se fosse óbvio e **não foi decidido** | 🔴 Pedro |
| **D4** | Na P16 o piloto move R$165.300 contra R$35.662 reais. O saldo só conta imposto; o resto é o **PP3** | 🔴 Mauro |
| ~~**D5**~~ | ✅ **PAGA em 17/09.** Produziu quatro achados (M-014, M-020, M-027, M-031) antes de fechar. O motor mistura unidades na fronteira: `apurarDAS` pede reais, `guiaVencida` pede centavos, `darfDoProLabore` **recebe reais e devolve centavos**, e nenhuma recusa a unidade errada. ✅ O M-027 aplicou a cura pela primeira vez — **o nome do campo carrega a unidade** (`…Centavos`) e a conversão acontece uma vez, na fonte. Falta estender ao resto | produto |
| **D6** | O art. 3º-A (redutor do IRRF) é a **única peça do motor sem fonte primária** — o texto veio de consulta externa, não do diário oficial. 🟡 Não bloqueia: a persona inteira zera IRRF nas duas leituras, e a G10b prova que a alternativa é impossível (M-023) | pesquisa |
| **D7** | A trava de defasagem pega **dígito, não quantificador**. *"Todas, sem exceção"* e *"nenhuma"* passam limpo, e o M-026 mostrou que é lá que a generalização errada se esconde | produto |
| **D8** | 🔴 **Tabela que compara cenários não declara a BASE da comparação.** O M-028 mostrou o preço: duas tabelas do mesmo documento usavam bases diferentes e uma importou o saldo da outra. Nenhuma trava pega isso — é coerência entre linhas, não valor por linha | produto |
| **D9** | 🟡 **Parcialmente paga no mesmo dia.** Dos **261 valores em R$** dos textos vivos, **4** passaram a ser conferidos a cada rodada: o pior saldo do varrimento, o DAS total da P16, o saldo do cliente da P01 e o **DAS da persona zero** (o único com recibo). Os outros ~96 aferidos em 17/09 foram medidos **à mão** e vão envelhecer igual. 🔑 Escolhidos por **exposição**, não por tamanho — são os que o contador leu | produto |

---

## 📊 O que este ledger diz sobre o método

> 🧭 Não é autoelogio nem autoflagelo — é o dado que o Pedro pediu em 16/09, quando disse *"sinto que estamos delirando demais entre uma varredura e outra"*.

| Quem pegou | Quantos | O que isso significa |
|---|---:|---|
| **Máquina** (invariante, trava, rastro) | a maioria | O elenco e as travas estão pagando o custo deles |
| **Eu, relendo antes de rodar** | poucos | Vale, mas não escala — depende de eu estar atento |
| **O Pedro** | poucos, e os mais caros | São os que **chegaram nele como afirmação**. É esta coluna que precisa ir a zero, não a soma |
| **O contador** | vários, em 16/09 | Categoria que trava nenhuma alcança: regra bem escrita e errada |

🔑 **A distinção que importa não é quantos erros aconteceram, é quantos chegaram ao Pedro como verdade.** Erro pego por trava é o sistema funcionando; erro que eu afirmo e depois conserto é o sistema falhando — mesmo quando o conserto vem na mesma resposta.

## Links
[[_doutrina-capacidades]] · [[PENDENCIAS]] · [[decisoes-marca]]
