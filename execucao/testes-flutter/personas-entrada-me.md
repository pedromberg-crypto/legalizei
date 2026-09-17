---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: personas-teste-entrada-me
autoridade: fonte-verdade
tags: [execucao, teste, flutter, persona, entrada]
---

# 🎭 As 24 personas de teste — entrada ME Simples

> 🧭 **O que é.** O elenco que o app Flutter roda no flow de entrada, do **E1** ao **A5.H**. Cada persona é um conjunto fechado de valores: o que digitar, o que clicar, e onde ela deve parar. O catálogo de variáveis e os domínios vivem em [[variaveis-entrada-me]].
>
> 🆕 **Elenco NOVO, de 14/09.** Não herda os JSONs de `execucao/motor-testes/personas/` — só **os nomes**. Os dados são próprios, porque os antigos carregavam 7 campos desatualizados (ver §"O que ficou desatualizado" em [[variaveis-entrada-me]]).
>
> 🔒 **Escopo:** constituição de **ME no Simples Nacional**, serviço, BH/MG, 1 a 4 sócios PF no Brasil. Nada de MEI, Migração, comércio ou regulamentada, **salvo as personas de recusa (P15 e P21 a P24), que existem justamente pra provar onde o app para**.

## 🔑 Dados fixos de TODA persona

> Travado em 14/09, na 1ª rodada da P01: a persona usou um e-mail inventado e **o flow parou na validação do código de 8 dígitos**, porque nada chega num endereço que não existe.

| Campo | Valor | Por quê |
|---|---|---|
| **E-mail** | 🔴 **`pedromberg@gmail.com`** em **todas** as personas, sempre | É o gmail do Pedro, conectado à sessão do vault. Dá pra **buscar o código de verificação de verdade** e destravar o E6.1. Não inventar e-mail |
| **Senha** | qualquer uma, mas **anotada no relatório** | Sem ela não dá pra retomar a conta numa 2ª rodada |
| **Telefone** | ⏳ **em aberto** | O E6 manda o código *"pro e-mail e pro telefone"*. Se o app exigir os dois, telefone inventado trava igual. Pendente de resposta da rodada da P01 |

⚠️ **O e-mail repetido é de propósito, e tem consequência:** as 24 personas vão compartilhar o mesmo endereço. Se o app impedir 2 contas com o mesmo e-mail, isso aparece já na P02 e vira **achado**, não bug de teste. Anotar quando acontecer.

## Índice
- [[#🗺️ Como o elenco cobre o espaço]]
- [[#🎬 As 14 base — uma por categoria, caminho completo]]
- [[#🚧 As 6 extras — saídas e cruzamentos de risco]]
- [[#🚪 As 4 do gate — elegibilidade ao Simples]]
- [[#📋 Tabela de cobertura]]
- [[#🧾 O que conferir no relatório final]]

---

## 🗺️ Como o elenco cobre o espaço

**14 base** vão do E1 ao A5.H sem parar. Cada uma pega **uma categoria diferente** e uma **combinação diferente** do Tier 1. Juntas, cobrem todo valor de toda variável pelo menos 1× (o piso 1-wise, que é 14 justamente porque categoria tem 14 valores).

**6 extras** existem pro que as base não alcançam: as saídas antecipadas e os cruzamentos que só bug de interação revela.

**4 do gate**, acrescentadas em 17/09, cobrem a elegibilidade ao Simples e o teto do ME. Nenhuma tem tela hoje: rodá-las prova a ausência.

🔑 **A proporção fiscal é de propósito:** **10 `III-fixo` × 4 `fator-r-dinamico`**, espelhando os 65 × 15 do catálogo real. O elenco antigo invertia isso.

---

## 🎬 As 14 base — uma por categoria, caminho completo

> Todas terminam em **A5.H**. CPFs são sintéticos com dígito verificador válido. CEPs são de BH.

### P01 · Bruno Almeida Souza — dev freelancer solo
`tech` · **6201-5/01** Desenvolvimento de programas sob encomenda · `fator-r-dinamico` · ISS-BH 2%

> *"desenvolvo sites e sistemas sob encomenda"*

CPF `107.654.321-96` · **1 sócio** · endereço **próprio** (CEP 30140-071, casa) · solteiro · INSS **não** · faixa **10-20k** · IPTU válido · CNAE confiança **alta** · **0** secundários · nome **aprovado** · plano **cartão → pago** · guia **cartão → paga** · rota **automática** · 1ª empresa **sim**

🎯 **O caso limpo.** É a régua: se ele falha, o problema é estrutural.

---

### P02 · Sandra Cristina Moreira — designer de interiores, com sócia
`design` · **7410-2/03** Design de produto · `fator-r-dinamico`

> *"faço design gráfico e de produto para pequenas empresas"*

CPF `115.308.642-59` · **2 sócios** (sócia CPF `122.962.963-78`) · quem administra: **titular e sócios** · endereço **próprio** (30160-000, apartamento) · **casada · comunhão parcial** · INSS **CLT** · faixa **5-10k** · IPTU válido · confiança **alta** · **2** secundários · nome aprovado · plano **Pix → pago** · guia **Pix → paga** · rota **assistida** · 1ª empresa **não** · convite por **WhatsApp**

🎯 Primeiro caso de **2 assinaturas** com sócio de verdade. Casada puxa regime de bens; CLT puxa o C2.

---

### P03 · Rafael Teixeira Lima — filmagem de eventos
`foto` · **7420-0/04** Filmagem de festas e eventos · `III-fixo` · ISS-BH 5%

> *"filmo e edito vídeo de festas e eventos"*

CPF `130.617.284-57` · **1 sócio** · endereço **fiscal Legalizai** (+R$49/mês) · união estável · INSS **autônomo** · faixa **não sei ainda** · imóvel **outro** · 🔴 **IPTU inválido** · 🔴 confiança **ambígua** (abre desambiguação) · 0 secundários · nome aprovado · plano **boleto → pendente → pago** · guia **cartão → paga** · rota automática · 1ª empresa sim · 🔴 **CPF divergente** no E6.2 (nome civil ≠ digitado, resolve e segue)

🎯 **A persona que tudo dá errado e mesmo assim chega ao fim.** 4 desvios empilhados. Se algum estado se perder, é aqui.

---

### P04 · Diego Martins Prado — agência de publicidade
`mkt` · **7311-4/00** Agências de publicidade · `fator-r-dinamico`

> *"temos uma agência de publicidade e propaganda"*

CPF `138.271.605-29` · **2 sócios** (Elisa, CPF `145.925.926-20`) · administra **só o titular** · endereço próprio (30150-000, casa) · divorciado · INSS **sócio de outro CNPJ** · faixa **20-30k** · IPTU válido · confiança alta · **1** secundário · nome aprovado · plano **cartão → pago** · 🔴 guia **boleto → pendente → paga** · rota **assistida** · 1ª empresa não · convite por **e-mail**

🎯 Testa **sócio que não administra** (qualificação 22 no DBE, não 49) e a **guia no boleto**, que é espera de verdade.

---

### P05 · Paula Rezende Antunes — edição de livros
`edicao` · **5811-5/00** Edição de livros · `III-fixo` · ISS-BH 5%

> *"edito e publico livros"*

CPF `153.580.247-27` · **1 sócio** · endereço próprio (30170-000, apartamento) · viúva · INSS **aposentadoria** · faixa **valor exato: R$27.500** · IPTU válido · confiança alta · 0 secundários · 🔴 **nome reprovado → C7′ (2ª rodada de 3 nomes)** · plano **Pix → pago** · guia **Pix → paga** · rota automática · 1ª empresa não

🎯 Testa o **valor exato** em vez de faixa, e a **2ª rodada de razão social**.

---

### P06 · Ivete Barros Nunes — tradução e interpretação, 3 sócios
`consult` · **7490-1/01** Serviços de tradução e interpretação · `fator-r-dinamico` · ISS-BH 5%

> *"faço tradução e interpretação para empresas"*

CPF `161.234.568-90` · **3 sócios** (CPFs `168.888.889-67`, `176.543.210-31`) · administra **titular e sócios** · endereço próprio (30180-000, casa) · **casada · comunhão universal** · INSS não · faixa 10-20k · IPTU válido · confiança alta · 0 secundários · nome aprovado · plano **cartão → pago** · guia **cartão → paga** · rota **assistida** · 1ª empresa sim · convite por **WhatsApp**

🎯 **3 assinaturas na mesma chamada.** O agendamento assistido com mais de 2 pessoas (A3.H1′, A3.H2′).

---

### P07 · Aparecida Ramos de Lima ("Cida") — ensino de idiomas, 61 anos
`cursos` · **8593-7/00** Ensino de idiomas · `III-fixo` · ISS-BH 2%

> *"dou aulas particulares de reforço escolar e inglês para crianças"*

CPF `184.197.531-14` · **1 sócio** · endereço próprio (30310-000, casa) · **casada · separação total de bens** · INSS **aposentadoria** · faixa 5-10k · IPTU válido · confiança alta · 0 secundários · nome aprovado · plano **boleto → pendente → pago** · guia **Pix → paga** · rota **assistida** · 1ª empresa sim

🎯 **Eixo de acessibilidade.** Baixa familiaridade digital, lê devagar, pode pausar e voltar horas depois. Rota assistida é o caminho natural dela. Testa `separacao`, que é o rótulo traduzido no RPA para *Separação Convencional de Bens*.

---

### P08 · Marta de Souza Andrade — artista plástica
`arte` · **9002-7/01** Atividades de artistas plásticos e jornalistas independentes · `III-fixo`

> *"sou artista plástica e vendo minhas obras por encomenda"*

CPF `191.851.852-13` · **1 sócio** · endereço **fiscal Legalizai** · viúva · INSS não · faixa **não sei ainda** · imóvel **outro** · 🔴 IPTU inválido · 🔴 confiança **ambígua** · **1** secundário · nome aprovado · plano **Pix → pago** · 🔴 guia **boleto → pendente → paga** · rota automática · 1ª empresa sim

🎯 Segundo caso de **endereço fiscal**, agora combinado com guia no boleto.

---

### P09 · Gustavo Ferreira Lima — organização de eventos
`eventos` · **8230-0/01** Organização de feiras, congressos e eventos · `III-fixo` · ISS-BH 5%

> *"organizo feiras, congressos e eventos corporativos"*

CPF `199.506.173-59` · **2 sócios** (CPF `207.160.494-65`) · administra titular e sócios · endereço próprio (30190-000, apartamento) · solteiro · INSS **CLT** · faixa 20-30k · IPTU válido · confiança alta · **3** secundários · nome aprovado · 🔴 plano **cartão → RECUSADO → nova tentativa → pago** · guia cartão → paga · rota automática · 1ª empresa não · convite por **e-mail**

🎯 **Pagamento recusado com recuperação.** E9 → E9.SR → E9.R → E9.S. O maior número de secundários do elenco (3).

---

### P10 · Júlia Ramos Pinto — teleatendimento
`admin` · **8220-2/00** Atividades de teleatendimento · `III-fixo`

> *"faço teleatendimento e suporte por telefone para empresas"*

CPF `214.814.815-09` · **1 sócio** · endereço próprio (30240-000, casa) · união estável · INSS **autônomo** · faixa 5-10k · IPTU válido · confiança alta · 0 secundários · nome aprovado · plano **Pix → pago** · guia **Pix → paga** · rota **assistida** · 1ª empresa sim

🎯 Rota assistida **sem sócio**: uma assinatura só, mas com agendamento. Caminho que o elenco antigo nunca exercitou.

---

### P11 · Cléber Augusto Pinto — aluguel de equipamentos, 4 sócios
`aluguel` · **7733-1/00** Aluguel de máquinas e equipamentos para escritório · `III-fixo`

> *"alugo máquinas e equipamentos para escritórios"*

CPF `222.469.136-08` · 🔴 **4 sócios** (CPFs `230.123.457-60`, `237.777.778-38`, `245.432.099-15`) · administra titular e sócios · endereço próprio (30112-000, outro) · **casado · participação final nos aquestos** · INSS não · faixa 20-30k · IPTU válido · confiança alta · **2** secundários · nome aprovado · plano cartão → pago · guia cartão → paga · rota **assistida** · 1ª empresa não · convite por **WhatsApp**

🎯 **O teto de sócios.** 4 pessoas, 4 assinaturas, participação de 25% cada (R$2.500 e 2.500 quotas por sócio). Testa o regime de bens mais raro dos 4.

---

### P12 · Rogério Nunes Barreto — chaveiro
`reparos` · **9529-1/02** Chaveiros · `III-fixo` · ISS-BH 5%

> *"sou chaveiro, faço cópia de chave e conserto fechadura"*

CPF `253.086.420-95` · **1 sócio** · endereço próprio (30350-000, casa) · divorciado · INSS **sócio de outro CNPJ** · faixa 5-10k · 🔴 IPTU inválido · confiança alta · 0 secundários · nome aprovado · 🔴 plano **boleto → pendente → pago** · 🔴 guia **boleto → pendente → paga** · rota automática · 1ª empresa sim

🎯 **Boleto nos dois pagamentos.** O caminho mais lento inteiro: dossiê liberado com boleto pendente (E9.1) e guia também no boleto.

---

### P13 · Carla Nogueira Prado — salão de beleza
`salao` · **9602-5/01** Cabeleireiros, manicure e pedicure · `III-fixo` · ISS-BH 5%

> *"trabalho com cabelo, manicure e pedicure"*

CPF `260.740.741-94` · **2 sócios** (CPF `268.395.062-40`) · administra titular e sócios · endereço **fiscal Legalizai** · solteira · INSS não · faixa 10-20k · imóvel apartamento · IPTU válido · 🔴 confiança **ambígua** · **1** secundário · nome aprovado · plano **Pix → pago** · guia **cartão → paga** · rota **assistida** · 1ª empresa sim · convite por **e-mail**

🎯 Terceiro caso de endereço fiscal, o único **com sócio**. Salão é a única categoria com 1 CNAE só.

---

### P14 · Heitor Nogueira Sales — pensão / alojamento
`hospedagem` · **5590-6/03** Pensões (alojamento) · `III-fixo` · ISS-BH 5%

> *"tenho uma pensão e alugo quartos por temporada"*

CPF `276.049.383-02` · **3 sócios** (CPFs `283.703.704-46`, `291.358.025-45`) · administra **só o titular** · endereço próprio (30380-000, outro) · **casado · comunhão parcial** · INSS **CLT** · faixa 20-30k · IPTU válido · confiança alta · 0 secundários · 🔴 **nome reprovado → C7′** · plano cartão → pago · guia **Pix → paga** · rota **automática** · 1ª empresa não · convite por **WhatsApp**

🎯 **3 sócios na rota automática** (a P06 faz 3 na assistida). Segundo caso de nome reprovado, agora com sócios envolvidos.

---

## 🚧 As 6 extras — saídas e cruzamentos de risco

> Estas **não** chegam ao A5.H. Cada uma existe pra provar que o app **para no lugar certo**.

### P15 · Fernanda Vasconcelos Rocha — 🔴 A RECUSA
`consult` · **7020-4/00** Consultoria em gestão empresarial

> *"faço consultoria em gestão para empresas"*

CPF `299.012.346-62` · 1 sócio · endereço próprio (30411-000)

🎯 **O caso que engana.** É serviço ✅, é Simples ✅, não é comércio ✅, não é profissão de conselho *óbvia*. E mesmo assim `atende_me_certeza: nao` na nossa matriz, porque **exige conselho** (`exige_conselho: sim`).

⏹️ **Para em:** veredito do gate de atividade. Deve sair pela porta de espera (captura de cidade + atividade), **nunca** com erro genérico.

⚠️ É a única persona do elenco com CNAE não atendido. As outras 4 que o elenco antigo tinha nesse código foram **corrigidas para CNAEs válidos** (decisão do Pedro, 14/09).

---

### P16 · Vitor Andrade Pinto — fora de BH
`tech` · **6204-0/00** Consultoria em TI

CPF `306.666.667-09` · 1 sócio · 🔴 **CEP 32010-000 (Contagem)**

🎯 Testa as **2 saídas positivas** do gate de cidade: aceitar o endereço fiscal Legalizai, ou entrar na **fila da própria cidade**. Rodar as duas.

⏹️ **Para em:** E3.4.1, modo espera (se escolher a fila). Se escolher o fiscal, **segue o flow normal**.

---

### P17 · Bruno Tavares Melo — CPF do titular suspenso
`design` · **7410-2/02** Design de interiores

CPF `314.320.988-70` · 1 sócio · endereço próprio (30494-000)

🎯 A situação do CPF é consultada **no ato do pagamento**, não antes. O ponto do teste é que ele descobre no checkout e **não é cobrado**.

⏹️ **Para em:** E9 / checkout. 🔴 **Conferir que nenhuma cobrança foi lançada.**

---

### P18 · Elisa Prado Martins — CPF de SÓCIO não confere
`mkt` · **7312-2/00** Agenciamento de espaços para publicidade

CPF `321.975.309-41` · **2 sócios** · sócio com CPF `329.629.630-13` cujo **nome civil diverge** do digitado

🎯 O C3.3 existe e quase nunca é exercitado. Divergência **no sócio**, não no titular, é caminho diferente do E6.2.

⏹️ **Para em:** C3.3, até corrigir. Depois deve seguir normal.

---

### P19 · Rafael Costa Andrade — pagamento recusado 2×, cai no boleto
`reparos` · **9511-8/00** Reparação e manutenção de computadores

CPF `337.283.951-02` · 1 sócio · endereço próprio (30130-000)

🎯 Cartão recusado, nova tentativa **também recusada**, troca para boleto. E9 → E9.SR → E9.R → E9.SR → E9.R → E9.SB → E9.1.

⏹️ **Para em:** E9.1, aguardando boleto **com o dossiê já liberado**. 🔑 Esse "liberado mesmo sem pagar" é decisão de produto, não bug.

---

### P20 · Otávio Salgado Freitas — nome reprovado 3× + guia recusada
`eventos` · **9319-1/01** Produção e promoção de eventos esportivos

CPF `344.938.272-11` · 1 sócio · endereço próprio (30240-000)

🎯 Dois retries encadeados: as **3 opções de razão social reprovadas** na JUCEMG (A3.1 tenta as 3 sozinho antes de pedir novas), e depois a **guia DAE recusada** (A3.SR → A3.R).

⏹️ **Para em:** A3.R, até a guia passar. Depois segue.

---

## 🚪 As 4 do gate — elegibilidade ao Simples

> 🔴 **Acrescentadas em 17/09**, ao cruzar este elenco (14/09) com o `GATE_DE_ENTRADA` travado em 15/09 (`execucao/estado-cnpj/ciclo-do-cnpj.mjs`) e com o escopo de EPP de 17/09. Catálogo das 6 perguntas em [[variaveis-entrada-me]] §"O gate de elegibilidade".
>
> ⚠️ **Nenhuma das 4 tem tela hoje.** Rodar estas personas **prova a ausência** — o app deixa todas passarem. O resultado é **achado**, não bug de teste. É a mesma natureza da P15, que já existia: gate que recusa, não wizard que preenche.
>
> 🎯 O ponto comum: todas as 4 **abrem empresa hoje** e deveriam parar. As 3 primeiras geram cliente que a casa não pode atender; a P23 gera risco fiscal que estoura meses depois, na exclusão retroativa.

### P21 · Débora Almeida Ferraz — 🔴 ACIMA DO TETO (EPP)
`tech` · **6201-5/01** Desenvolvimento de programas sob encomenda · `fator-r-dinamico`

> *"faço desenvolvimento de software sob encomenda"*

CPF `352.601.478-71` · 1 sócio · endereço próprio (30140-000) · solteira · INSS não · faixa **"Sei o valor exato" → R$ 55.000/mês** · confiança alta · 0 secundários

🎯 **R$660 mil/ano.** Passa do teto do ME (R$360 mil/ano, LC 123 art. 3º II) e cai em **EPP**, que vai até R$4,8 milhões e **não atendemos**. A grade de faixas não tem mais "+R$30 mil" desde 01/09, então o caminho é o campo livre — e é lá que o número entra sem ninguém olhar.

⏹️ **Deveria parar em:** E5F, porta de espera/escalada, com a explicação do porquê (mesmo tratamento da P15). 🔴 **Hoje segue o flow inteiro e abre a empresa.**

⚠️ É o conflito direto com o agente Léo: a mesma pessoa ouve *"essa eu ainda não atendo"* no WhatsApp (regra de 17/09) e é aceita no app.

---

### P22 · Ronaldo Teixeira Amaral — 🔴 SERVIDOR PÚBLICO, UNIPESSOAL
`cursos` · **8593-7/00** Ensino de idiomas · `III-fixo` · ISS-BH 2%

> *"dou aula de inglês e quero abrir minha empresa"*

CPF `360.256.789-36` · **1 sócio** · endereço próprio (30220-000) · casado · comunhão parcial · INSS **servidor público ativo** · faixa 5-10k · IPTU válido · confiança alta · 0 secundários

🎯 **O impedimento O2.** Lei 8.112/90 art. 117 X: servidor público ativo **pode ser quotista**, não pode ser **administrador**. Sendo unipessoal, não sobra ninguém para administrar, e SLU sem administrador não existe. Não é trocar `49` por `22`, é **recusa**.

⏹️ **Deveria parar em:** o gate, antes do C1. 🔴 **Hoje o app nem pergunta** — "servidor público" não está no domínio do vínculo INSS (`nao` · `clt` · `aposentadoria` · `autonomo` · `socio-outro-cnpj`), e a qualificação sai `49` por padrão.

🔑 **Variante a rodar junto:** o mesmo Ronaldo com **2 sócios**, em que o outro administra. Aí não é recusa: é `22` no titular, `49` no sócio, e muda quem assina pela empresa e quem é o representante perante a Receita.

---

### P23 · Letícia Moraes Bastos — 🔴 PEJOTIZAÇÃO (risco CRÍTICO)
`tech` · **6204-0/00** Consultoria em TI · `fator-r-dinamico`

> *"vou prestar serviço pra uma empresa só, no horário deles"*

CPF `367.914.203-08` · 1 sócio · endereço próprio (30310-000) · solteira · INSS não · faixa 10-20k · confiança alta · 0 secundários · **1 contratante único, com horário e subordinação**

🎯 **LC 123 art. 3º §4º XI.** Veda o Simples quando o sócio guarda com o contratante, **cumulativamente**, pessoalidade + subordinação + habitualidade. A pesquisa marcou risco **CRÍTICO** exatamente para TI, design e consultoria — o nosso público inteiro.

⏹️ **Deveria parar em:** o gate, com pergunta explícita. 🔴 **Hoje não existe a pergunta.**

⚠️ **É a única vedação que a autodeclaração pega mal**, porque depende da sinceridade de quem responde. A persona responde a verdade de propósito: o teste é se **existe onde responder**, não se ela mente.

⏱️ E o preço de errar é diferido: não trava nada na hora, aparece meses depois como **exclusão retroativa**, e a empresa cai no Lucro Presumido.

---

### P24 · Gustavo Rangel Peixoto — 🔴 ADMINISTRADOR DE OUTRA EMPRESA
`mkt` · **7312-2/00** Agenciamento de espaços para publicidade · `III-fixo` · ISS-BH 5%

> *"trabalho com mídia exterior e quero ter meu CNPJ"*

CPF `375.628.190-68` · 1 sócio · endereço **fiscal Legalizai** · divorciado · INSS **sócio de outro CNPJ** · faixa 20-30k · confiança alta · 2 secundários

🎯 **Dois gatilhos na mesma pessoa, e o app só enxerga o lado errado dos dois.**

| | O que é | O que o app faz hoje |
|---|---|---|
| **V1** | é sócio de outra empresa do Simples; **o percentual não importa**, 0,1% já manda somar a receita das duas | captura como `vínculo INSS: socio-outro-cnpj` no C2, **para efeito de teto do INSS**. Nunca pergunta a receita da outra |
| **V3** | é **administrador registrado** de uma terceira empresa, sem ser dono dela | ❌ não pergunta |

Em ambos o gatilho é receita bruta **global** acima de R$4,8 milhões/ano. A persona está acima.

⏹️ **Deveria parar em:** o gate. 🔴 **Hoje abre normalmente.**

🔑 O V1 é o caso mais traiçoeiro do elenco: o dado **já está na tela**, colhido com outro propósito. Não falta captura, falta **consequência**.

---

## 📋 Tabela de cobertura

Conferido por script sobre as 14 base. **Todo valor de toda variável aparece pelo menos 1×.**

⚠️ **As 6 extras e as 4 do gate não entram nesta tabela**, de propósito: elas não completam o caminho, então não têm valor para metade das variáveis. A cobertura 1-wise é responsabilidade das 14.

| Variável | Distribuição nas 14 base |
|---|---|
| **Categoria** | 14 categorias, 1 cada ✅ |
| **Nº de sócios** | `1`:7 · `2`:4 · `3`:2 · `4`:1 |
| **Endereço** | `proprio`:11 · `fiscal`:3 · (`fila` na P16) |
| **Estado civil** | `solteiro`:3 · `casado`:5 · `uniao`:2 · `divorciado`:2 · `viuvo`:2 |
| **Regime de bens** | `parcial`:2 · `universal`:1 · `separacao`:1 · `final`:1 — **os 4** |
| **Vínculo INSS** | `nao`:5 · `clt`:3 · `autonomo`:2 · `socio-outro`:2 · `aposentadoria`:2 |
| **Faixa** | `nao-sei`:2 · `5-10k`:4 · `10-20k`:3 · `20-30k`:4 · `exato`:1 |
| **Tipo de imóvel** | `casa`:6 · `apartamento`:4 · `outro`:4 |
| **IPTU** | `valido`:11 · `invalido`:3 |
| **Confiança CNAE** | `alta`:11 · `ambiguo`:3 |
| **Secundários** | `0`:8 · `1`:3 · `2`:2 · `3`:1 |
| **Nome/razão social** | `aprovado`:12 · `reprovado`:2 (+ 3× reprovado na P20) |
| **Método do plano** | `cartao`:6 · `pix`:5 · `boleto`:3 |
| **Desfecho do plano** | `pago`:10 · `boleto pendente`:3 · `recusado→retry`:1 (+ 2× na P19) |
| **Método da guia** | `cartao`:6 · `pix`:5 · `boleto`:3 |
| **Desfecho da guia** | `paga`:11 · `boleto pendente`:3 (+ recusada na P20) |
| **Rota** | `automatica`:7 · `assistida`:7 |
| **1ª empresa** | `sim`:8 · `nao`:6 |
| **Canal do convite** | `whatsapp`:4 · `email`:3 (7 personas solo não têm) |
| **Grupo fiscal** | `III-fixo`:10 · `fator-r-dinamico`:4 |

---

## 🧾 O que conferir no relatório final

> 🔴 **CORRIGIDO 14/09, na 1ª rodada da P01.** Esta seção nasceu errada: eu mandei conferir **no app** campos que **não existem no app**. `montar_revisao_do_dossie.dart:24-26` declara textualmente que capital social, metragem, natureza jurídica, quota, qualificação 49/22, profissão, forma de atuação e tipo de unidade **não entram no Flutter**, porque são o que a casa preenche por dentro. Busca em `lib/` não acha `metragem`, `Produtiva`, `Pedestre` nem `20,00`.
>
> 🧭 **A verificação é de DUAS camadas, e a fronteira é esta:**

| Camada | Onde se verifica | O que prova |
|---|---|---|
| **1 · O app** | rodada de persona no Flutter | O que a pessoa vê, digita e clica. Telas, copy, navegação, voltar, estados de erro, e os poucos valores internos que **chegam à tela** |
| **2 · O envio aos órgãos** | `api-app` / RPA, **não o app** | Os ~20 campos de `PREENCHIDOS_INTERNAMENTE`. Exige rodada própria, com outro instrumento |

### Camada 1 — o que a rodada de persona CONSEGUE provar

| Campo | Valor esperado | Onde aparece |
|---|---|---|
| **Guia da Junta (DAE)** | `R$ 281,08` (`taxaDaJunta`) | A3.P |
| **Objeto social** | gerado pelo servidor. 🔴 Conferir que **não** sai `"...podendo também exercer ."` com lista de secundários vazia (item **62** de [[PENDENCIAS]]) | C7 |
| **Preço do plano** | 🔴 **`R$ 99,00/mês` nos 3 primeiros meses**, `R$ 139,00/mês` a partir do 4º. Ver o bloco de preço abaixo | E7 |
| **Plano + endereço fiscal** (P03, P08, P13) | `R$ 148,00/mês` nos 3 primeiros meses, `R$ 188,00` depois. São **2 itens de linha**, não um preço só | E7 |
| **CNAE principal** | o código derivado bate com a categoria escolhida no E3.4 | C0 |
| **Herança entre telas** | titular e endereço da fatura chegam ao E9 **pré-preenchidos** do cadastro | E9 |
| **Voltar** | existe em toda tela de wizard e leva ao destino certo | todas |

#### 💳 O preço, e por que ele mudou (17/09)

Este documento nasceu em 14/09 pedindo `R$ 139,00/mês` no E7, que é o **cheio**. Em 17/09 o Pedro travou a promoção de lançamento:

| Plano | Cheio | Promoção |
|---|---:|---:|
| MEI (fora do escopo deste elenco) | R$ 49/mês | **R$ 29/mês** |
| **ME (Simples Nacional)** | R$ 139/mês | **R$ 99/mês** |

`REGRA` A promoção vale **os 3 primeiros meses**, é garantida por **entrar na lista de espera**, e a janela vai **até 31/12/2026**. Depois dos 3 meses o valor vai para o cheio. Os tiers antigos de R$19 e R$79 estão **mortos**. Fonte: `execucao/entregas/handoff-leo-ajustes-2026-09-17.md` linhas 29-38.

🔴 **O que conferir na rodada, e nesta ordem:**
1. O E7 mostra **R$ 99,00** como valor a pagar agora, e não R$ 139,00.
2. A tela diz que são **3 meses** e que depois vai para R$ 139,00. Preço promocional sem a validade escrita é o tipo de coisa que volta como reclamação.
3. O E9 cobra **o mesmo número** que o E7 mostrou. Divergência entre a tela de plano e a de pagamento é achado grave.
4. Nas P03, P08 e P13 o endereço fiscal aparece como **linha separada de R$49**, somando R$148. Se vier fundido num preço só, é defeito: a cobrança é **fatura por competência com itens de linha** (travado 11/09).

⚠️ **O R$ 139,00 continua certo, no lugar certo.** Ele é o valor do 4º mês em diante, e também é a taxa de "Desenquadramento de ME para EPP" no contrato. Os dois R$139 não têm relação nenhuma entre si — não confundir ao ler o relatório.

### Camada 2 — o que só a `api-app` / RPA prova

⛔ **Não pedir isto numa rodada de persona.** Fica registrado aqui porque é o contrato do envio, mas o instrumento é outro. Lista completa em [[variaveis-entrada-me]] §"O que NÓS preenchemos".

### Sempre igual, em toda persona

| Campo | Valor esperado |
|---|---|
| **Capital social** | `R$ 10.000,00` |
| **Metragem** | `20,00 m²` na **área total** e `20,00 m²` na **área utilizada** |
| **Valor nominal da quota** | `R$ 1,00` |
| **Profissão** (titular e todo sócio) | `Empresário` |
| **Forma de atuação** | `Atividade Desenvolvida Fora do Estabelecimento` |
| **Tipo de unidade** | `Produtiva` |
| **Acesso ao endereço** | `Pedestre` |
| **Atividade exercida no local?** | `Não`, na principal **e em cada secundária** |
| **Atividade inócua ou virtual?** | `Sim` |
| **Edificação nova?** | `Não` |
| **Tipo de contrato** | `Padrão`, 15 cláusulas, **sem anexo** |
| **Testemunhas** | nenhuma |
| **SPE?** | `Não` |
| **Capital integralizado em moeda corrente?** | `Sim` |
| **Tipo de evento** | `Inscrição de primeiro estabelecimento (Matriz)` |
| **Código do ato** | `Constituição` |
| **Evento de enquadramento** | `Enquadramento de Microempresa` |
| **Guia DAE** | `R$ 281,08` |
| **E-mail e telefone aos órgãos** | os **da Legalizai**, nunca os da persona |
| **Endereço de correspondência** | igual ao do estabelecimento |
| **Data de assinatura / início** | o dia da rodada, **nunca retroativa** |
| **Requerente do DAE** | o titular |

### Varia por persona

| Campo | Regra |
|---|---|
| **Natureza jurídica** | `SLU` se 1 sócio · `LTDA` se 2+. **Nunca perguntado** |
| **Qualificação no DBE** | `49` para quem administra · `22` para quem não. 🔴 **Corrigido 17/09:** o titular é `49` **enquanto puder administrar**. Servidor público ativo é quotista e não administrador (Lei 8.112/90 art. 117 X), então com sócio vira `22` no titular, e **unipessoal vira recusa** (P22). Nas 14 base e nas 6 extras, todas sem servidor público, segue `49` |
| **Participação em R$ e quotas** | `% × R$10.000`. O valor em R$ **é** o número de quotas. P11 (4 sócios, 25% cada) = `R$2.500` e `2.500 quotas` por pessoa |
| **Telefone enviado aos órgãos** | 🔴 **8 dígitos**, sem o 9º. Mas captado com 9 na tela. Conferir os dois lados |
| **Tipo de endereço** | `Endereço virtual` **só** nas P03, P08, P13 (endereço fiscal). Nas outras, o tipo real |
| **Regime de bens** | `separacao` deve chegar na Junta como `Separação Convencional de Bens` (só a P07 exercita) |
| **CNAE principal** | conferir que o código derivado bate com a categoria escolhida no E3.4 |
| **Objeto social** | gerado automaticamente. 🔴 Conferir que **não** sai `"...podendo também exercer ."` quando a lista de secundários é vazia (bug conhecido, item **62** de [[PENDENCIAS]]) |

### Conferências de comportamento

- 🔴 **Toda tela de wizard tem VOLTAR**, e o `meta` nomeia o **destino**, não a própria tela. Exceções declaradas: splash, saída terminal, laboratório.
- 🔴 **P17 não pode gerar cobrança.** CPF suspenso descoberto no checkout = nenhum lançamento.
- 🔴 **P19 precisa liberar o dossiê** mesmo com o boleto pendente.
- 🔴 **P15 sai pela porta de espera**, nunca por erro genérico.
- 🔴 **P21 a P24 não podem abrir empresa.** Hoje todas abrem, e é esse o achado. Anotar **onde** cada uma deveria ter parado, porque é isso que vira requisito de tela.
- 🔴 **P22 tem variante:** unipessoal = recusa; com sócio que administre = `22` no titular, `49` no sócio. Rodar as duas.
- 🔴 **P24 prova que o dado do V1 já existe na tela** (C2, como `socio-outro-cnpj`) e não tem consequência nenhuma. Conferir que ele é usado **só** para o teto do INSS.

---

## 📊 Estado das rodadas

### P01 · 14/09 — 🟡 parou no E9.1P

**15 nós percorridos:** E1 · E2.1 · E2.2 · E2.3 · E3 · E3.3 · E3.2 · E3.4 · E5T · E5F · E6 · E6.1 · E7 · E9 · **E9.1P**.

⛔ **A parede:** *"Simulação indisponível — Este servidor não tem a rota de simulação. A cobrança segue pendente."* Os botões *Simular pagamento* / *Simular recusa* aparecem porque `kDebugMode` os liga, mas a rota `dev/payments/{id}/simulate` **não existe** na AWS.

🔬 **Provado por `curl`, com 2 controles (14/09).** Não é gate de ambiente nem permissão:

| Requisição | Status | Resposta |
|---|---:|---|
| `POST /api/v1/dev/payments/.../simulate` | **404** | `NOT_FOUND` · `"Cannot POST <path>"` |
| controle: rota real e guardada (`identity/signups/verification`) | 401 | `FUNNEL_CREDENTIAL_INVALID` |
| controle: rota inventada | **404** | `NOT_FOUND` · `"Cannot POST <path>"` |

🔑 **A rota de simulação responde IDÊNTICA a uma rota inventada** — é o roteador do Nest respondendo antes de qualquer guard. Rota que existisse e estivesse fechada responderia como o controle do meio: 401 com code de domínio. **A rota nunca foi publicada em produção**, e a `api-app` a condiciona a `NODE_ENV != production`.

⚠️ **Os dois botões batem na MESMA URL** (`pagamento_remoto_datasource.dart:36-41`: um método `simular(chargeId, statusDoProvedor)`, só o campo `status` do corpo muda). Não existe hipótese de um funcionar e o outro não.

🔓 **`--dart-define API_BASE_URL` existe** (`ambiente_api.dart:44-48`) e resolve o *para onde*, não o *quê*: continua exigindo um servidor com a rota registrada do outro lado.

🔴 **O A5.H é inalcançável hoje.** Além da parede do E9, toda a Fase 6 (29 nós, as duas assinaturas e o A5.H) é **mock em memória**, acionado por gatilhos manuais. Fechar o funil ponta a ponta exige a `legalizai-api` local, que não está nesta máquina.

✅ **O que ficou provado:** o backend da AWS **dispara e-mail de verdade** e entrega na caixa de entrada (remetente `nao-responda@mail.legalizai.com.br`, assunto *"Seu código de confirmação"*). O código tem 8 dígitos e **expira em poucos minutos**, então o handoff precisa ser imediato.

⚠️ **O relógio do emulador está ~9h atrasado** (08:33 no aparelho = 17:33 real). Todo carimbo de tempo colhido da tela está deslocado.

🗂️ **Os achados não moram aqui.** O ledger é `docs/achados/README.md` no repo do Flutter (A-001 a A-009), com o relatório em `docs/achados/P01-rodada-2026-09-14.md`. **Não duplicar** — mesma doutrina do inventário único.

## Links
[[variaveis-entrada-me]] · [[PERSONA]] · [[taxonomia-pills-n4]] · [[PENDENCIAS]] · [[dados-coletados-abertura-ate-viabilidade]] · [[decisoes-marca]]
