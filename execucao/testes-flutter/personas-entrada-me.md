---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: personas-teste-entrada-me
autoridade: fonte-verdade
tags: [execucao, teste, flutter, persona, entrada]
---

# 🎭 As 20 personas de teste — entrada ME Simples

> 🧭 **O que é.** O elenco que o app Flutter roda no flow de entrada, do **E1** ao **A5.H**. Cada persona é um conjunto fechado de valores: o que digitar, o que clicar, e onde ela deve parar. O catálogo de variáveis e os domínios vivem em [[variaveis-entrada-me]].
>
> 🆕 **Elenco NOVO, de 14/09.** Não herda os JSONs de `execucao/motor-testes/personas/` — só **os nomes**. Os dados são próprios, porque os antigos carregavam 7 campos desatualizados (ver §"O que ficou desatualizado" em [[variaveis-entrada-me]]).
>
> 🔒 **Escopo:** constituição de **ME no Simples Nacional**, serviço, BH/MG, 1 a 4 sócios PF no Brasil. Nada de MEI, Migração, comércio ou regulamentada, **salvo a P15, que existe justamente pra ser recusada**.

## 🔑 Dados fixos de TODA persona

> Travado em 14/09, na 1ª rodada da P01: a persona usou um e-mail inventado e **o flow parou na validação do código de 8 dígitos**, porque nada chega num endereço que não existe.

| Campo | Valor | Por quê |
|---|---|---|
| **E-mail** | 🔴 **`pedromberg@gmail.com`** em **todas** as personas, sempre | É o gmail do Pedro, conectado à sessão do vault. Dá pra **buscar o código de verificação de verdade** e destravar o E6.1. Não inventar e-mail |
| **Senha** | qualquer uma, mas **anotada no relatório** | Sem ela não dá pra retomar a conta numa 2ª rodada |
| **Telefone** | ⏳ **em aberto** | O E6 manda o código *"pro e-mail e pro telefone"*. Se o app exigir os dois, telefone inventado trava igual. Pendente de resposta da rodada da P01 |

⚠️ **O e-mail repetido é de propósito, e tem consequência:** as 20 personas vão compartilhar o mesmo endereço. Se o app impedir 2 contas com o mesmo e-mail, isso aparece já na P02 e vira **achado**, não bug de teste. Anotar quando acontecer.

## Índice
- [[#🗺️ Como o elenco cobre o espaço]]
- [[#🎬 As 14 base — uma por categoria, caminho completo]]
- [[#🚧 As 6 extras — saídas e cruzamentos de risco]]
- [[#📋 Tabela de cobertura]]
- [[#🧾 O que conferir no relatório final]]

---

## 🗺️ Como o elenco cobre o espaço

**14 base** vão do E1 ao A5.H sem parar. Cada uma pega **uma categoria diferente** e uma **combinação diferente** do Tier 1. Juntas, cobrem todo valor de toda variável pelo menos 1× (o piso 1-wise, que é 14 justamente porque categoria tem 14 valores).

**6 extras** existem pro que as base não alcançam: as saídas antecipadas e os cruzamentos que só bug de interação revela.

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

## 📋 Tabela de cobertura

Conferido por script sobre as 14 base. **Todo valor de toda variável aparece pelo menos 1×.**

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

Ao fim de **cada** persona, o relatório precisa provar que os campos que **nós** preenchemos saíram certos. Eles não aparecem em tela nenhuma, então só o relatório os pega.

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
| **Qualificação no DBE** | `49` para quem administra · `22` para quem não. Titular é **sempre 49** |
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

## Links
[[variaveis-entrada-me]] · [[PERSONA]] · [[taxonomia-pills-n4]] · [[PENDENCIAS]] · [[dados-coletados-abertura-ate-viabilidade]] · [[decisoes-marca]]
