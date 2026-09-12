---
tipo: derivado
status: vivo
data: 2026-09-12
assunto: handoff-dados-constituicao
gerado_por: execucao/handoff/gerar-handoff.mjs
tags: [execucao, handoff, dados, abertura, processos]
---

# 🤝 Handoff de dados — da constituição pro app interno

> ⚠️ **Nota gerada.** Não editar à mão: rode `node execucao/handoff/gerar-handoff.mjs`. A fonte é `dados-handoff.mjs`.
>
> **Pra que serve:** o time de programadores já construiu a constituição, do download do app até o pagamento da guia. Esta nota NÃO redesenha aquilo. Ela responde uma pergunta só: **quais dados de lá movimentam as funcionalidades internas daqui**, e o que falta chegar.
>
> **Os dois inventários que ela cruza continuam donos dos fatos deles:** [[dados-coletados-abertura-ate-viabilidade]] diz o que cada tela coleta, [[PROCESSOS]] diz o que cada passo faz. Aqui mora só a seta entre os dois.

## A fronteira

**Trecho deles** · time de programadores

Do download do app até o pagamento da guia (DAE da JUCEMG). Mapeado e em teste.

**Trecho assistido** · nós, com gente

1ª assinatura → 2ª assinatura (nossa + do cliente) → certificado. No MVP é sequência humana assistida. As telas existem no flow (A3.H → A5.H, auditadas em 05/09); automatizar é feature de otimização, não requisito de MVP.

**Trecho da parceira** · certificadora terceirizada

Da emissão com o cliente até a entrega do certificado e da senha pra gente. Nos nossos processos é UM estado, 'certificado ok', nunca um desenho passo a passo. O que precisamos é o arquivo e a senha, que destravam quase toda funcionalidade interna.

✅ **Quem assina o quê** (ratificado pelo Pedro em 12/09, sobre a régua do Ademar de 05/09): na **1ª assinatura, todos os sócios assinam**, administradores ou não, *"se cadastrou dez, dez assinam"*. Na **2ª**, só o contador e o sócio representante.

## Placar

**24 dados mapeados:** 🟢 11 chegam · 🟡 6 nascem depois · 🟡 3 ninguém combinou · 🔴 4 ninguém produz

**18 dos 62 passos** do P1 ao P5 dependem de algum dado da constituição.

## 1. Chegam da constituição, e movem o app interno

Estes já existem e já são coletados no trecho deles. A lista serve pra provar que **não precisamos redesenhar nada disso**: é só combinar como atravessa.

| | Dado | Quem entrega | Onde nasce | O que trava sem ele |
|:--:|---|---|---|---|
| 🟢 | **CNAE principal** | time do dev | tela `C0` | **P2.1** Apura e emite a guia do mês · **P3.4** Sugere o código do serviço · **P5.2** Calcula o que mantém o Anexo III · catálogo 2.6 · /impostos/aliquotas |
| 🟢 | **CNAEs secundários (até 15)** | time do dev | tela `C5` | **P3.4** Sugere o código do serviço |
| 🟢 | **Objeto social (gerado, travado)** | time do dev | tela `C7` | **P3.3** Pede só o valor e o cliente |
| 🟢 | **Razão social + nome fantasia** | time do dev | tela `C7` | **P3.5** Transmite ao Emissor Nacional · catálogo 6.6 · /mais/empresa |
| 🟢 | **Vínculo INSS por fora (sim/não + valor)** | time do dev | tela `C2` | **P5.3** Mexe e vê o imposto mudar · **P5.7** Declara e gera a guia do INSS · catálogo 4.6 · duplo vínculo |
| 🟢 | **Sócios: nome, CPF, nascimento, RG, % de participação** | time do dev | tela `C3` | **P5.7** Declara e gera a guia do INSS · **P5.9** Entra no Fator R, e a alíquota se sustenta · catálogo 4.4 · recibo de pró-labore e informe de rendimentos |
| 🟢 | **Quem administra a empresa** | time do dev | tela `C3` | **P5.1** Chega o mês, e o pró-labore precisa ser decidido · **P5.6** Confirma o valor do mês |
| 🟢 | **Faixa de faturamento autodeclarada** | time do dev | tela `E5F` | **P1.2** O preço mudou neste ciclo? |
| 🟢 | **Usa o endereço fiscal da Legalizai? (sim/não)** | time do dev | tela `E3_4` | **P1.1** Monta a fatura do ciclo |
| 🟢 | **Endereço da empresa (CEP, número, complemento, IPTU, tipo de imóvel)** | time do dev | tela `C4` | **P3.5** Transmite ao Emissor Nacional · catálogo 6.6 · /mais/empresa |
| 🟢 | **Conta: nome, CPF, e-mail, telefone, senha** | time do dev | tela `E6` | catálogo 7.6 · perfil e login · 1.4 central de avisos (canal) |

**🟢 CNAE principal** · chega

É o dado mais reaproveitado do produto inteiro. Ele decide o Anexo (III ou V), e o Anexo é o que faz o Fator R importar: sem essa escolha, o P5 não tem por que existir. Também é dele que sai o código do serviço na nota (P3.4). Uma escolha na constituição, três processos internos dependendo.

**🟢 CNAEs secundários (até 15)** · chega

Quem fatura serviço diferente do principal precisa do código municipal correspondente, e a lista de secundários é o universo do que ela pode emitir sem alteração contratual.

**🟢 Objeto social (gerado, travado)** · chega

Descreve o que a empresa pode faturar. É a fronteira do que o P3 aceita emitir sem virar caso de alteração contratual (catálogo 8.1).

**🟢 Razão social + nome fantasia** · chega

É o emitente da nota. Sai do C7 depois da viabilidade deferida, então o valor que vale é o APROVADO pela Junta, não necessariamente a 1ª das 3 opções que a pessoa escreveu.

**🟢 Vínculo INSS por fora (sim/não + valor)** · chega

Quem já contribui por fora tem folga no teto do INSS, e isso muda quanto sai de contribuição no pró-labore. O catálogo já dizia 'declarado pelo cliente no onboarding (já coletamos no flow)': esta linha é a confirmação de que a promessa tem lastro.

**🟢 Sócios: nome, CPF, nascimento, RG, % de participação** · chega

O eSocial pede a qualificação completa de cada pessoa que recebe pró-labore. Sem CPF e nascimento de cada sócio, o S-1200 não transmite, e o P5.7 para.

**🟢 Quem administra a empresa** · chega

Já está travado como o que decide a qualificação 49 × 22 no DBE. Do lado interno, é quem tem pró-labore a decidir: sócio 22 é quotista e pode não receber nada, e oferecer a decisão do mês pra quem não é administrador é pergunta sem dono.

**🟢 Faixa de faturamento autodeclarada** · chega

⚠️ É ESTIMATIVA, não RBT12. Serve pra escolher a coorte de preço na entrada (as três faixas ME de 79/99/139 da minuta), e só. A partir da 1ª nota quem manda é a receita real do P3.7, e o P1.2 passa a comparar contra ela. Confundir os dois faria a mensalidade nascer travada numa chute do cliente.

**🟢 Usa o endereço fiscal da Legalizai? (sim/não)** · chega

Vira uma linha recorrente de R$ 49/mês na fatura, todo ciclo, pelo Anexo I. É decisão tomada no gate, antes do pagamento, e a fatura do P1.1 precisa saber dela desde o primeiro ciclo.

**🟢 Endereço da empresa (CEP, número, complemento, IPTU, tipo de imóvel)** · chega

Define o município de incidência do ISS, que é o que faz a nota ser de BH e não de outro lugar. Faturar fora de BH é outro caso e já está na loja como CPOM (catálogo 8.5).

**🟢 Conta: nome, CPF, e-mail, telefone, senha** · chega

É a mesma conta que entra no portal depois. Não tem passo de processo consumindo porque ela é pré-condição de todos: sem login não há P nenhum.


## 2. Existem, mas nascem depois do trecho deles

Vêm do trecho assistido, da certificadora parceira ou de um órgão. Nenhum é trabalho de desenho nosso; todos precisam de um combinado de entrega.

| | Dado | Quem entrega | Onde nasce | O que trava sem ele |
|:--:|---|---|---|---|
| 🟡 | **CNPJ** | trecho assistido (nosso) | 2ª assinatura (Receita) — trecho assistido | **P1.1** Monta a fatura do ciclo · **P2.1** Apura e emite a guia do mês · **P3.5** Transmite ao Emissor Nacional · **P5.7** Declara e gera a guia do INSS |
| 🟡 | **NIRE + data do registro na Junta** | trecho assistido (nosso) | 1ª assinatura (JUCEMG) — trecho assistido | catálogo 6.1 · /mais/documentos |
| 🟡 | **Data de abertura do CNPJ** | trecho assistido (nosso) | 2ª assinatura (Receita) — trecho assistido | **P2.1** Apura e emite a guia do mês · catálogo 5.3 · calendário de obrigações |
| 🟡 | **Certificado digital A1: arquivo + senha** | certificadora parceira | certificadora parceira | **P2.1** Apura e emite a guia do mês · **P3.5** Transmite ao Emissor Nacional · **P3.9** O certificado está válido? · **P5.7** Declara e gera a guia do INSS · catálogo 6.2 · /mais/certificado |
| 🟡 | **Validade do certificado** | certificadora parceira | certificadora parceira | **P3.9** O certificado está válido? · **P3.11** Emissão parada: falta o certificado |
| 🟡 | **Alvará / licenciamento** | órgão | Prefeitura de BH | catálogo 6.1 · /mais/documentos · 8.4 na loja |

**🟡 CNPJ** · nasce depois

É a chave de tudo: nenhuma das quatro integrações do produto (PGDAS-D, ADN, eSocial, gateway) aceita requisição sem ele. Nasce na 2ª assinatura, que é justamente o trecho que os programadores ainda não atacaram.

**🟡 NIRE + data do registro na Junta** · nasce depois

É o que prova a existência da sociedade e alimenta a pasta de documentos que o cliente vai buscar quando abrir conta PJ. Não trava processo, mas é a primeira coisa que somem se ninguém combinar quem guarda.

**🟡 Data de abertura do CNPJ** · nasce depois

Abre a primeira competência e o calendário inteiro de obrigações. Também é dela que corre a fidelidade de 12 meses da minuta. ⚠️ NÃO confundir com a data da assinatura do contrato de serviço, que é a âncora do ciclo de COBRANÇA: são duas datas diferentes, com semanas de distância, e tratá-las como uma só erra a fatura ou erra a obrigação.

**🟡 Certificado digital A1: arquivo + senha** · nasce depois

🔴 O item de maior alcance da nota inteira: quatro passos em três processos diferentes travam sem ele. É o que assina no ADN, no PGDAS-D e no eSocial. Decisão do Pedro em 12/09: os nossos processos NÃO desenham a emissão, só constatam o estado 'certificado ok'. ⚠️ Continua valendo o aberto de 05/09: a plataforma interna que recebe o arquivo da parceira não existe.

**🟡 Validade do certificado** · nasce depois

O P3.9 confere a validade ANTES de cada transmissão, então a data precisa estar guardada como dado, não só o arquivo. É também o que faz o P3.11 saber se o caso é 'nunca fez a videochamada' ou 'venceu'.

**🟡 Alvará / licenciamento** · nasce depois

Fecha a pasta de documentos do cliente. O licenciamento já é respondido no questionário da Prefeitura durante a constituição (atividade inócua, acesso pedestre), então o dado nasce do que eles já enviaram.


## 3. 🔴 O interno precisa e ninguém produz

🔑 **Esta seção é o produto da nota.** O resto é confirmação; aqui está o trabalho. Cada linha tem uma pergunta escrita, e nenhuma se resolve por dedução.

| | Dado | Quem entrega | Onde nasce | O que trava sem ele |
|:--:|---|---|---|---|
| 🟡 | **Inscrição municipal (CCM) na Prefeitura de BH** | órgão | Prefeitura de BH, depois do CNPJ | **P3.5** Transmite ao Emissor Nacional |
| 🟡 | **Data e hora do aceite do contrato de serviço** | time do dev | tela `E9` | **P4.24** O ciclo vira no dia da assinatura · **P1.1** Monta a fatura do ciclo · **P4.11** O ciclo vira e a fatura soma tudo |
| 🟡 | **Mandato de cobrança recorrente (cartão tokenizado)** | time do dev | tela `E9` | **P1.4** Emite a fatura e cobra na forma cadastrada |
| 🔴 | **Conta bancária da PJ (ou o extrato dela)** | 🔴 ninguém | não existe em lugar nenhum | **P5.8** O dinheiro saiu da conta pro sócio? |
| 🔴 | **Dependentes para IRRF** | 🔴 ninguém | não existe em lugar nenhum | **P5.7** Declara e gera a guia do INSS · catálogo 4.7 |
| 🔴 | **Colaboradores (admissão, ativo, demissão)** | 🔴 ninguém | não existe em lugar nenhum | **P1.1** Monta a fatura do ciclo |
| 🔴 | **Como o RBT12 se comporta na empresa nova** | 🔴 ninguém | regra, não campo | **P1.2** O preço mudou neste ciclo? · **P2.1** Apura e emite a guia do mês |

**🟡 Inscrição municipal (CCM) na Prefeitura de BH** · ninguém combinou

🔴 Sem CCM não se emite NFS-e em BH. O P3 inteiro é o processo com relógio correndo (Res. CGSN 191/2026 obriga o Emissor Nacional a partir de 01/11/2026) e depende de um número que nasce fora dos dois trechos mapeados. Nenhuma tela do flow coleta, nenhum passo de processo produz.

**🟡 Data e hora do aceite do contrato de serviço** · ninguém combinou

🔴 É a ÂNCORA DO CICLO DE COBRANÇA inteiro, travada pelo Pedro em 11/09: assinou dia 8, o ciclo vira todo dia 8, pra sempre. A tela existe e o aceite acontece (checkbox no E9), mas 'existe o checkbox' e 'a data fica gravada e chega até nós' são coisas diferentes. Se esse carimbo não atravessar a fronteira, o P1 não sabe quando fechar a primeira fatura, e não há como recalcular depois.

**🟡 Mandato de cobrança recorrente (cartão tokenizado)** · ninguém combinou

🔴 O E9 cobra a ABERTURA, que é pagamento único. A mensalidade do P1.4 é cobrança RECORRENTE: exige tokenizar o cartão e guardar o mandato, o que é outra integração e muda o escopo PCI. Foi exatamente isso que derrubou o Asaas em 08/09. Se o cartão do E9 não deixar mandato, o cliente vai ter que cadastrar forma de pagamento DE NOVO no primeiro ciclo, logo depois de ter pago a abertura.

**🔴 Conta bancária da PJ (ou o extrato dela)** · ninguém produz

🔴 É o único caminho conhecido pro vermelho do P5. O P5.8 pergunta se o pró-labore foi EFETIVAMENTE PAGO, e o dinheiro vai da empresa pro sócio sem passar por nós nem pelo governo: não há API. O preço de errar está medido — considerar pago o que só foi lançado gera glosa do Fator R, reclassificação pro Anexo V e multa (6% virando 15,5%). Hoje o único rastro previsto é o extrato que o cliente envia até o 5º dia útil (cláusula 5.4).

**🔴 Dependentes para IRRF** · ninguém produz

Entra direto no cálculo do IRRF do pró-labore, e o líder tem. Não é gap de constituição (não vai pra Junta nem pro DBE), é gap do app interno: o lugar natural é o cadastro do sócio depois que a empresa abre, não mais uma pergunta antes do pagamento.

**🔴 Colaboradores (admissão, ativo, demissão)** · ninguém produz

O P1.1 já soma 'R$ 39 por colaborador ATIVO' na fatura, pelas cláusulas 7.2 e 7.4 — cobra mesmo sem movimento. Mas nada na constituição cria colaborador, e nenhum processo desenhado transforma alguém em ativo. A linha da fatura existe e a origem dela não. Não é dado de handoff: é processo faltando (candidato a P6).

**🔴 Como o RBT12 se comporta na empresa nova** · ninguém produz

Empresa recém-aberta não tem 12 meses de receita: a legislação manda proporcionalizar. Isso muda a alíquota do P2.1 nos primeiros meses e a faixa de preço do P1.2. Não é dado que alguém capta, é regra que ninguém escreveu — e sem ela o primeiro DAS da empresa sai de um cálculo que não foi decidido.


## 4. As perguntas, por quem responde

> Nenhuma destas se resolve deduzindo. A regra de 05/09 vale igual aqui: regra de órgão, de contrato ou de integração **não se deduz, se pergunta**.

### Pra time do dev

- **Inscrição municipal (CCM) na Prefeitura de BH** — A inscrição municipal (CCM) entra em algum ponto do que vocês automatizaram, ou ela cai no trecho assistido junto com as assinaturas? Sem ela o app não emite a primeira nota.
- **Data e hora do aceite do contrato de serviço** — O aceite do contrato no E9 grava data e hora com o texto aceito, e isso vem no que vocês entregam pra gente? É o dado que define o dia da cobrança de todos os ciclos seguintes.
- **Mandato de cobrança recorrente (cartão tokenizado)** — O pagamento da abertura no E9 deixa um meio de pagamento salvo pra cobrança recorrente, ou é transação única? Se for única, a primeira mensalidade vai pedir cartão outra vez.

### Pra Mauro

- **Conta bancária da PJ (ou o extrato dela)** — Pra saber que o pró-labore foi pago de verdade, a gente fica no extrato que o cliente manda (cláusula 5.4) ou vale perguntar a conta PJ na abertura e buscar Open Finance read-only depois? É o que separa Anexo III de Anexo V.
- **Como o RBT12 se comporta na empresa nova** — Nos primeiros 12 meses, qual é a regra de proporcionalização do RBT12 que a gente adota pro DAS e pra faixa de preço? É o cálculo do primeiro imposto de todo cliente novo.

### Pra Pedro

- **Dependentes para IRRF** — Dependentes de IRRF ficam de fora do MVP (o cálculo sai sem dedução) ou entram como campo no perfil do sócio, dentro do portal?
- **Colaboradores (admissão, ativo, demissão)** — A folha de colaborador (admissão → ativo → demissão) entra no MVP? O P1.1 já cobra por colaborador ativo e não existe nada que crie um.

## 5. Passos que NÃO dependem da constituição

> Informativo, não é defeito: a maioria dos passos nasce do uso do app, não da abertura. Serve pra ver o tamanho real da dependência.

44 passos: P4.1 · P4.2 · P4.3 · P4.5 · P4.6 · P4.7 · P4.8 · P4.9 · P4.10 · P4.12 · P4.13 · P4.14 · P4.15 · P4.16 · P4.17 · P4.18 · P4.19 · P4.20 · P4.21 · P4.22 · P4.23 · P1.3 · P1.5 · P1.6 · P1.7 · P1.8 · P1.9 · P1.10 · P2.2 · P2.3 · P2.4 · P2.5 · P2.6 · P2.7 · P3.1 · P3.2 · P3.6 · P3.7 · P3.8 · P3.10 · P5.4 · P5.5 · P5.10 · P5.11

## Nota de fonte

Gerado de `dados-handoff.mjs`, com as referências validadas contra `flow/flow-data.mjs` (ids de tela) e `processos/processos-data.mjs` (ids de passo). Referência quebrada derruba o gerador em vez de envelhecer calada. A fronteira dos três trechos foi dita pelo Pedro em 12/09.
