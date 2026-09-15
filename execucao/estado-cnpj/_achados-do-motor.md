---
tipo: verdade
status: vivo
data: 2026-09-15
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

---

## 🔴 Dívidas que estes achados deixaram

| | Dívida | Dono |
|---|---|---|
| **D1** | Nenhum verificador confronta `FATOR_R_NUMERADOR` (o dado) com o que `fatorR()` faz (o código). O M-001 pode voltar em outra constante | produto |
| **D2** | A régua de **2×** que separa ajuste de recuperação veio de 2 pontos medidos (1,22× e 9,6×). Caso real entre 2× e 9× é onde ela quebra | produto |
| **D3** | O piloto **corta** pró-labore, não só sobe (P02, P04, P06). Está implementado como se fosse óbvio e **não foi decidido** | 🔴 Pedro |
| **D4** | Na P16 o piloto move R$165.300 contra R$35.662 reais. O saldo só conta imposto; o resto é o **PP3** | 🔴 Mauro |

## Links
[[_doutrina-capacidades]] · [[PENDENCIAS]] · [[decisoes-marca]]
