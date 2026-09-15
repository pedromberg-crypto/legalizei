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
