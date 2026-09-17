---
tipo: verdade
status: vivo
dominio: matriz
data: 2026-09-09
assunto: dependencia-externa-api-me-simples
autoridade: fonte-verdade
tags: [produto, api, dependencia, automacao, fiscal]
---

# 🔌 Matriz de dependência externa — o que precisamos ir buscar fora

> 🧭 **Autoridade:** esta nota manda em **do que cada funcionalidade depende de terceiros** e em **o que já sabemos do caminho técnico**.
> O que existe e qual a cobertura é [[_catalogo]]. O desenho de cada uma é `produto/me/viver/funcionalidades/specs/<nome>.md`.
> Hub da frente: [[HOME-produto]].
>
> 🔒 **A regra que criou esta matriz** (Pedro, 08/09): *"não adianta falar dessas funcionalidades sem validar o que temos de API disponível realmente"*. Por isso aqui **só** entra o que depende de terceiro. O que a gente resolve com dado interno ou documento do cliente é problema de programação, não de matriz, e fica fora de propósito.
>
> 🔄 Extraído de `produto/me/viver/portal/funcionalidades-me-simples.md` em 09/09/2026.

## ✅ O QUE A VERIFICAÇÃO DE 09/09 MUDOU

> Duas pesquisas rodaram em 09/09: a [[2026-09-09-rotina-me-simples-bh|rotina completa]] e, em cima dela, uma [[2026-09-09-verificacao-auditoria-tributaria|verificação em fonte primária]] que **derrubou 6 afirmações**. O que está abaixo já está aplicado nas tabelas deste arquivo.
>
> ⚠️ **Limite:** a verificação é uma **segunda fonte, não uma terceira**. Os atos de 2026 que ela cita (Res. CGSN 186, 190 e 191/2026, Ato Conjunto RFB/CGIBS nº 4/2026, Portarias SMFA 084 e 088/2025) **não foram conferidos em Diário Oficial**. Antes de virar cláusula ou travar arquitetura cara, abrir o ato publicado.

### 🔴 Dois prazos correndo

| Prazo | Data | O que é | Fonte alegada |
|---|:--:|---|---|
| **Simples Híbrido** | **30/09/2026** | Janela para optar por apurar CBS/IBS **fora** do DAS, gerando crédito ao cliente B2B. Efeitos no 1º semestre de 2027, com arrependimento até novembro. **Decisão de negócio, não de app** | LC 214/2025 art. 41 §3º · Res. CGSN 186 e 190/2026 |
| **Emissor Nacional de NFS-e** | **01/11/2026** | Toda ME/EPP do Simples passa a emitir obrigatoriamente pelo Emissor Nacional. **Se sobrepõe ao cronograma municipal de BH** (que era 01/02/2026 pela Portaria 088/2025, e não 01/01 como a 1ª pesquisa dizia) | Res. CGSN 191/2026 |

### 🟢 O maior risco técnico do produto caiu: o PGDAS-D TEM API

O **Serpro Integra Contador** cobre **PGDAS-D, DEFIS, eSocial e DCTFWeb**, e **não exige procuração e-CAC** quando se usa o certificado A1 da própria empresa. Custo relatado: **~R$300/mês por escritório** no pacote inicial, R$1.200/mês de tabela.

Isso mata o pior cenário que a matriz apontava: gerar o DAS por automação de navegador, que não escala e quebra quando o governo muda o HTML.

E a **API do Emissor Nacional de NFS-e é RESTful, gratuita, com Swagger público**, autenticando por token. Ou seja: **a comparação de fornecedores de NFS-e (Focus, PlugNotas, eNotas, NFE.io) deixou de ser necessária.** O caminho é a API nacional.

### ❌ As 6 afirmações derrubadas

| A 1ª pesquisa dizia | O correto | Efeito no produto |
|---|---|---|
| Exclusão do Simples: **90 dias** para regularizar | **30 dias** após a ciência (LC 123 art. 31 §2º). A ciência tácita no DTE-SN é em 45 dias | 🔴 **Grave.** Um alerta programado para 90 dias perderia o prazo do cliente. A vigília tem que contar 30 |
| DEFIS em atraso: multa mínima de R$200 | **Não existe multa** pelo atraso da DEFIS | Não provisionar multa. Mas **existe trava**: sem a DEFIS do ano anterior, o PGDAS-D de março em diante **não transmite** |
| Res. CGSN 183/2025 endureceu a multa do PGDAS-D | **A fonte anterior alucinou.** A resolução existe, mas trata da Secretaria-Executiva do CGSN | Não implementar regra punitiva baseada nela |
| Cancelar NFS-e exige CPF/CNPJ do tomador | **Revogado** pela Portaria SMFA 088/2025 | Dá para cancelar nota de tomador não identificado. O prazo de **730 dias** procede |
| BH dispensa a DES para o Simples | **Não é irrestrita**: quem tem dedução na base de cálculo ou sofre retenção continua obrigado | Não assumir dispensa pelo perfil tributário |
| Salário mínimo R$1.412 | **R$1.621** (Decreto 12.797/2025) | ✅ Nosso `lib/fiscal.ts` já usa 1.621 |

### 📅 O calendário correto (vira regra de código)

A regra de deslocamento **muda por tributo**, e é armadilha real: no mesmo mês uma guia vence dia 22 e outra dia 18.

| Obrigação | Vence | Se cair em dia não útil | Fonte |
|---|:--:|---|---|
| eSocial (eventos periódicos) e DCTFWeb | dia **15** | **antecipa** | Manual eSocial · IN RFB 2.005/2021 |
| **DAS** e transmissão do **PGDAS-D** | dia **20** | **PRORROGA** | Res. CGSN 140/2018 art. 40 §3º |
| DARF de INSS/IRRF e **FGTS Digital** | dia **20** | **ANTECIPA** | IN RFB 2.005/2021 art. 13 |
| **DEFIS** | 31/03 | anual | Res. CGSN 140/2018 art. 72 §1º · ⚠️ extinta a partir de 2027, absorvida pelo PGDAS-D |

### 🔑 Fator R: a regra que vira teste unitário

- **Fórmula:** folha dos últimos 12 meses ÷ receita bruta dos últimos 12 meses. **≥ 28% → Anexo III (6%)**, senão Anexo V (15,5%). Aferição **mensal**, no PGDAS-D (Res. CGSN 140/2018 art. 26).
- **ENTRA no numerador:** salário CLT · pró-labore · 13º · férias + 1/3 · FGTS · **CPP, mesmo paga embutida no DAS** (detalhe que a maioria dos sistemas ignora e que ajuda a bater os 28%).
- **NÃO ENTRA:** distribuição de lucros · autônomo · prestador PJ · PAT · estagiário.
- 🔴 **A armadilha, e ela é nova:** a folha só conta se foi **efetivamente PAGA** (regime de caixa), enquanto a receita é competência. Recibo de pró-labore sem trânsito financeiro gera **glosa do Fator R, reclassificação para o Anexo V e multa** — a Receita cruza EFD-Reinf com DCTFWeb para pegar isso. O app **não pode** considerar pró-labore lançado e não pago.

### 🚫 Confirmado que NÃO se aplica (economia de engenharia)

- **Dispensado de:** ECD, ECF, EFD-Contribuições, SPED Fiscal, SINTEGRA. A **DIRF foi extinta** (virou eSocial + EFD-Reinf).
- **Sem obrigação estadual:** prestador de serviço puro em BH, sem CNAE de comércio, indústria ou transporte intermunicipal, **não tem Inscrição Estadual** e está isento de EFD ICMS/IPI e DeSTDA. O app **não deve disparar alerta estadual** para esse perfil.
- ⚠️ Isso **esvazia o item 8.6** (regularização de Inscrição Estadual) para o nosso ICP: ele não tem IE para regularizar.

### 🆕 Duas funcionalidades que a verificação revelou, e não estavam na lista

| # | Funcionalidade | Por que é obrigatória | Cobertura |
|---|---|---|:--:|
| **5.7** | **Monitorar o domicílio eletrônico (DTE-SN)** | É a caixa onde chega o **Termo de Exclusão do Simples**, e a ciência é **presumida em 45 dias** mesmo sem ninguém ler. Depois disso são só 30 dias para regularizar. Se ninguém lê, a empresa é excluída à revelia. Dá para consultar em background com o A1 | 🔴 não existe |
| **5.8** | **Trava da DEFIS** | Sem a DEFIS do ano anterior transmitida, o PGDAS-D de março em diante **não transmite**. Não é multa, é bloqueio. O app precisa saber disso antes de março | 🔴 não existe |

⚠️ O **5.7 é o mais grave dos dois**: é o único ponto do produto onde o silêncio custa a empresa do cliente.

---

## 🔌 MATRIZ DE DEPENDÊNCIA EXTERNA — o que precisamos ir buscar no mercado

> 🔵 **Pedido do Pedro (08/09):** *"não adianta a gente falar de todas essas funcionalidades sem de fato validar o que temos de API disponível realmente"*. Esta tabela existe pra a gente **não conversar sobre funcionalidade que um órgão trava**.
>
> 🔒 **Regra de entrada:** só entra aqui o que depende de **alguém de fora** (órgão, provedor, parceiro). Tudo que a gente resolve com **dado interno + programação** ficou de fora de propósito: já está resolvido, é só construir.
>
> **Ficaram de fora 27 das 51** (1.1, 1.2, 1.3, 1.5, 1.6, 2.1, 2.3, 2.5, 2.6, 2.8, 3.2, 3.6, 3.8, 3.9, 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 5.1, 5.3, 5.4, 5.6, 6.1, 6.4, 7.4, 7.6, 7.7). Entre elas está o **pró-labore interativo**, que é o nosso diferencial-âncora: ele é 100% engine própria e não depende de ninguém.
>
> **Coluna "sabemos?":** 🟢 confirmado com fonte · 🟡 indício, não verificado · 🔴 não sabemos, precisa vasculhar a documentação.

### A. Sem isso não há produto (bloqueiam o core)

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 3.1 | **Emitir NFS-e** | transmitir a nota ao Ambiente de Dados Nacional (ADN) e receber número, PDF e XML | **Emissor Nacional** (Serpro/RFB) | 🟢 **RESOLVIDO em 09/09.** A Res. CGSN 191/2026 obriga toda ME/EPP do Simples ao **Emissor Nacional a partir de 01/11/2026**, sobrepondo-se ao cronograma de BH. A API é **RESTful, gratuita, com Swagger público**, autenticada por token, usando o A1 da empresa | 🟢 | ⚠️ **Não comparar mais fornecedores** (Focus, PlugNotas, eNotas, NFE.io): o caminho é a API nacional. Ler o Swagger e o manual do ADN |
| 3.3 | Baixar PDF e XML da nota | recuperar o documento emitido | Emissor Nacional (ADN) | Sai junto da emissão | 🟢 | resolve junto com o 3.1 |
| 3.4 | Cancelar ou substituir nota | cancelamento por API | Emissor Nacional / PBH | 🟢 **Prazo de 730 dias** (2 anos) da emissão. Exige inscrição municipal regular e ausência de bloqueio da autoridade fiscal. ⚠️ A exigência de CPF/CNPJ do tomador **foi revogada** pela Portaria SMFA 088/2025: dá para cancelar nota de tomador não identificado | 🟢 | Portaria SMFA 075/2025 art. 5º, com a redação da 088/2025 |
| 2.2 | **Emitir a guia do DAS** | transmitir a apuração e gerar o DAS | Receita Federal (PGDAS-D) | 🟢 **RESOLVIDO em 09/09.** O **Serpro Integra Contador** tem API REST oficial para PGDAS-D e DEFIS, e **não exige procuração e-CAC** com o A1 da própria empresa. Custo relatado: ~R\$300/mês por escritório no pacote inicial, R\$1.200 de tabela. Mata o cenário de automação de navegador | 🟢 | contratar na loja Serpro · confirmar o preço vigente e o limite de requisições |
| 5.2 | **Transmitir as declarações** (DEFIS, DCTFWeb) | entregar a obrigação ao governo | Receita Federal | 🟢 **RESOLVIDO em 09/09.** O Integra Contador cobre **DEFIS, DCTFWeb e eSocial**. ⚠️ SPED, ECD, ECF e EFD-Contribuições **não se aplicam** a este perfil | 🟢 | mesmo contrato do 2.2 |
| 6.2 | **Certificado digital A1** | emissão com videochamada de validação | Certificadora (ICP-Brasil) | 🟢 **Modelo travado em 22/07:** a parceira executa tudo fora do app, e um funcionário dela sobe o arquivo no nosso sistema com acesso escopado | 🟢 | **qual parceira ainda não foi definida** · como é o portal/API de emissão em lote |

⚠️ **O 3.1 e o 2.2 são os dois que decidem o produto.** Sem emitir nota e sem gerar guia não existe app de contabilidade, existe um painel bonito. Todo o §2 e o §3 penduram neles.

### B. É o nosso diferencial, e depende de fora

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 2.4 | **Saber que o imposto foi pago, sem perguntar** | descobrir que a guia foi quitada | banco do cliente **ou** Receita | 🔴 **O maior buraco do produto.** Nenhum caminho testado. É o gap nº 1 do líder e o que sustenta a promessa de não perguntar "você pagou?" | 🔴 | (a) **Open Finance** read-only, com consentimento; (b) consulta de **arrecadação/DARF pago no e-CAC**, via Serpro; (c) conciliação manual do time, que não escala |
| 5.5 | Verificação de pendências e situação fiscal | consultar a situação da empresa nos órgãos | RF, PGFN, PBH | 🟡 Dois caminhos agora: **InfoSimples** (quase só consulta, que aqui serve) ou o próprio **Integra Contador**, que já teremos contratado e faz consulta a pendências do Simples | 🟡 | comparar preço por chamada entre os dois antes de contratar mais um fornecedor |
| 5.7 | **Monitorar o domicílio eletrônico (DTE-SN)** | ler a caixa onde chega o **Termo de Exclusão do Simples** | Receita Federal | 🟢 **RESOLVIDO EM 15/09: o InfoSimples tem `ECAC / Caixa Postal`.** Era o mais grave do arquivo — ciência **presumida em 45 dias** mesmo sem ninguém abrir, e depois só **30 dias** para regularizar. 🔑 E o caminho apareceu no fornecedor que a gente já ia contratar, não num novo | 🟢 | **InfoSimples `ecac/caixa-postal`** |

### C. Vendáveis à-la-carte (a receita além da mensalidade)

| # | Funcionalidade | O ato que acontece FORA | Dono do ato | O que sabemos hoje | Sabemos? | Candidatos a investigar |
|---|---|---|---|---|:--:|---|
| 6.6 | Manter os dados da empresa sincronizados | consultar o cadastro do CNPJ | Receita Federal | 🟢 O caso mais comum e mais resolvido de API no Brasil | 🟢 | **InfoSimples `receita-federal/cnpj`** · BrasilAPI (grátis, sem SLA) |
| 3.5 | Autopreencher o tomador PJ pelo CNPJ | mesma consulta do 6.6 | Receita Federal | 🟢 idem | 🟢 | mesmo do 6.6 |
| 6.3 | Emissão de CND | emitir certidão negativa | RF/PGFN · SEF-MG · PBH | 🟡 A federal é a mais provável de ter caminho; estadual e municipal são o de sempre | 🟡 | **InfoSimples** (federal) · SEF-MG e PBH a mapear |
| 2.7 | Recalcular guia vencida | recalcular com juros e multa e reemitir | Receita Federal | 🟢 Segue o 2.2, que foi resolvido: mesma API do Integra Contador | 🟢 | mesmo contrato do 2.2 |
| 4.5 | Guia do INSS do pró-labore | declarar a remuneração e gerar o DARF | eSocial → DCTFWeb | 🟢 **RESOLVIDO em 09/09.** O caminho é eSocial (evento S-1200 do pró-labore) → DCTFWeb → DARF numerado, tudo coberto pelo Integra Contador com o A1 | 🟢 | mesmo contrato do 2.2 |
| 4.8 | Alterar pró-labore já processado | retificar obrigação acessória já entregue | Receita Federal | 🟡 Retificação exige contador. Provável que siga humano | 🟡 | verificar se a retificação é programática via Serpro |
| 6.5 | DECORE | protocolar no CRC | CRC-MG | 🟢 Ato privativo do contador, protocolado no conselho. **Não automatizável** | 🟢 | confirmar se o CRC-MG tem portal com API, só pra reduzir digitação |
| 8.1 | Alteração contratual (sócio, CNAE, endereço) | alterar o registro na Junta, na RF e na Prefeitura | **JUCEMG** + RF + PBH | 🟢 **A JUCEMG NÃO TEM API** (gargalo registrado em 09/07). O InfoSimples faz junta de SP, não de MG | 🟢 | reconfirmar se abriu API desde então · senão, RPA/Playwright, que não escala |
| 8.2 | Baixa de empresa | dar baixa na Junta e na RF | **JUCEMG** + RF | mesmo gargalo do 8.1 | 🟢 | idem |
| 8.7 | Alteração de porte ME/EPP | alterar na Junta | **JUCEMG** | mesmo gargalo | 🟢 | idem |
| 8.4 | Alvará (obtenção ou renovação) | pedido na prefeitura | **PBH** (ALF, SISDRAM) | 🔴 Consta como "a mapear" desde 09/07 | 🔴 | ALF PBH · SISDRAM: existe API ou só portal? |
| 8.8 | **Inscrição Municipal ativa** (o antigo AIDF) | ter a Inscrição Municipal regular em BH | **PBH** | 🔴 **CONFIRMADO como bloqueio real e severo.** Inscrição "inapta" ou "suspensa" gera **rejeição automática na API** do Emissor Nacional. A AIDF em papel foi **suspensa** (Portaria SMFA 084/2025): não há plano B. Regularizar exige **ALF + TFLF** via Redesim/PBH, e leva de 48h a várias semanas | 🟢 | ⚠️ **Não é serviço vendável, é pré-condição.** O app precisa checar a situação cadastral ANTES de deixar emitir, e explicar o erro em vez de devolver falha de API |
| 8.5 | CPOM/CEPOM | cadastro no município de destino | prefeitura de outro município | 🔴 Cada município tem portal próprio | 🔴 | levantar antes os municípios mais comuns dos nossos clientes |
| 8.6 | Regularização de Inscrição Estadual | regularizar na SEFAZ | **SEF-MG** | ⚪ **NÃO SE APLICA ao nosso ICP.** Prestador de serviço puro em BH, sem CNAE de comércio, indústria ou transporte intermunicipal, **não tem Inscrição Estadual**. O app não deve nem disparar alerta estadual para esse perfil | 🟢 | sai do catálogo, salvo se o escopo abrir para comércio |

### D. Infraestrutura (tem trilha própria, fora desta matriz)

| # | Funcionalidade | Dono | Situação |
|---|---|---|---|
| 7.1–7.3, 7.5 | Cobrança da mensalidade e dos avulsos | gateway de pagamento | 🔄 Em decisão. O Asaas saiu e há reunião marcada com o **Pagar.me**. Ver [[2026-09-08-provedores-pagamento-saas-br]] |
| 2.9 | Débito automático do DAS | banco | 🔵 backlog, e depende do 2.4 |
| 3.7 | Importar notas emitidas fora do app | prefeitura | 🔵 backlog, e depende de o município expor consulta |

---

## 🎯 A lista de investigação — o que sobrou depois da verificação

🔄 **Reescrita em 09/09.** A lista anterior tinha 7 itens e 10 dependências em 🔴. A [[2026-09-09-verificacao-auditoria-tributaria|verificação em fonte primária]] resolveu as duas primeiras (que eram as que travavam tudo) e **matou uma comparação de fornecedores inteira**.

### Resolvido: é contratar e ler documentação

| | O que fazer | Custo conhecido | Destrava |
|---|---|---|---|
| ✅ | **Contratar o Serpro Integra Contador** | ~R$300/mês por escritório no pacote inicial; R$1.200 de tabela | 2.2 (DAS) · 5.2 (DEFIS, DCTFWeb, eSocial) · 2.7 (recálculo) · 4.5 (INSS do pró-labore) |
| ✅ | **Ler o Swagger do Emissor Nacional de NFS-e** | gratuita | 3.1 (emitir) · 3.3 (PDF/XML) · 3.4 (cancelar) |

⚠️ **A comparação de fornecedores de NFS-e foi cancelada.** Focus NFe, PlugNotas, eNotas e NFE.io deixaram de fazer sentido: a partir de **01/11/2026** o caminho obrigatório é a API nacional, direto.

### Ainda aberto, em ordem

1. **🔴 Status de pagamento (2.4)** — segue sendo **o maior buraco do produto**, e agora é o único item do bloco B sem caminho. Open Finance contra consulta de arrecadação no e-CAC. É decisão de **arquitetura**, não de fornecedor.
2. **🔴 Monitorar o DTE-SN (5.7, novo)** — ciência presumida em 45 dias, 30 dias para regularizar depois. **É o único ponto do produto onde o silêncio custa a empresa do cliente.** Primeira pergunta: o Integra Contador expõe o DTE-SN, ou precisa de outro caminho?
3. **🔴 Municipais de BH (8.4 alvará, 8.5 CPOM)** — ALF, SISDRAM e os portais dos municípios vizinhos. Único 🔴 que sobrou fora do bloco B.
4. **🟡 InfoSimples × Integra Contador (5.5, 6.3)** — o InfoSimples era o candidato natural. Agora que o Integra Contador já vai ser contratado, comparar preço por chamada **antes** de somar um segundo fornecedor.
5. **🟡 Retificação de obrigação já entregue (4.8)** — o Integra Contador cobre, ou segue humano?
6. **⚪ JUCEMG** — segue sem API, e isso **não mudou**. Atinge 8.1, 8.2 e 8.7, que são os avulsos mais caros. Se seguir assim, são humanos e o preço tem que refletir isso.

### 🔴 Fora da matriz, mas com prazo correndo

- **Simples Híbrido: janela de opção até 30/09/2026.** Decisão de negócio com o Mauro, não de app.
- **Emissor Nacional obrigatório em 01/11/2026.** Se a gente pretende emitir nota em produção este ano, essa é a data que manda no roadmap.

⚠️ **A ressalva que continua de pé:** a verificação é uma **segunda fonte, não uma terceira**. Os atos de 2026 citados não foram conferidos em Diário Oficial. Antes de assinar contrato com o Serpro ou travar arquitetura, abrir o ato publicado.

---

## 📊 O placar da matriz, recontado em 09/09

São **23 linhas** na matriz (fora o bloco D, que é infraestrutura e tem trilha própria).

| | antes (08/09) | agora (09/09) |
|---|:--:|:--:|
| 🟢 sabemos o caminho | 8 | **16** |
| 🟡 indício, falta confirmar | 6 | 3 |
| 🔴 não sabemos | **10** | **4** |

Os que sobram em 🔴: **2.4** (status de pagamento), **8.4** (alvará) e **8.5** (CPOM). 🟢 O **5.7** (DTE-SN) saiu em 15/09: o InfoSimples tem `ECAC / Caixa Postal`.

⚠️ Duas ressalvas de leitura:
- **8.6 saiu do jogo por outro motivo:** prestador de serviço puro em BH **não tem Inscrição Estadual**. Não é "resolvido", é **não se aplica**.
- **8.8 virou 🟢 sem virar boa notícia:** a gente sabe o caminho, e o caminho diz que **inscrição municipal irregular derruba a emissão na API**. É pré-condição, não serviço vendável.

⚠️ A coluna "como automatizar" da tabela principal foi escrita **antes** desta verificação. Onde as duas divergirem, **vale a matriz**: ela tem fonte, a outra é hipótese.

---

## ⚠️ As 3 dependências que travam virar produto

Herdadas da matriz de 22/07 e ainda de pé:

1. **🔧 O motor contábil mensal** — quem calcula o DAS, gera as declarações e fecha a competência. **Metade da coluna "como automatizar" desta tabela depende dele.** O portal é uma janela; sem o motor, tudo é mock.
2. **🏛️ O status de pagamento (2.4)** — sem resolver, a gente cai no "confirme que pagou" do líder, que é exatamente o que a gente critica.
3. **🤝 O parceiro do certificado** — modelo travado (eles executam, a gente valida e libera), parceiro específico ainda não.

## 🔌 O que já sabemos das APIs

🔄 **Reescrita em 09/09.** A versão anterior desta tabela ficou defasada em dois dias e chegou a **contradizer a própria matriz acima** (dava Asaas como travado e Focus NFe como candidato). Ficam registradas as duas linhas mortas no fim, para ninguém reabrir por engano.

| Fonte | Cobre | Confiança |
|---|---|---|
| **Serpro / Integra Contador** | PGDAS-D · DEFIS · DCTFWeb · eSocial. Não exige procuração e-CAC com o A1 da empresa | 🟢 caminho confirmado, **contrato ainda não assinado**. ~R$300/mês por escritório no pacote inicial |
| **Emissor Nacional de NFS-e (ADN)** | Emitir, consultar e cancelar NFS-e. REST, gratuita, Swagger público | 🟢 caminho confirmado. **Obrigatório a partir de 01/11/2026** |
| **InfoSimples** | 🔄 **Catálogo relido em 15/09, e o resumo antigo ("quase só consulta") era grosso demais.** Ele **EMITE** alguns documentos: `SICALC / Gerar DARF`, `Emissão de DAS de MEI`, `CND Federal 2ª via`, `Guia de Parcelamento SIMEI`. E **CONSULTA** muito do que precisamos: `ECAC / Caixa Postal` (🟢 resolve o **5.7**), `ECAC / DCTF WEB`, `Situação Fiscal`, `Agenda Tributária`, `CNPJ`, `Simples Nacional`, `PER/DCOMP`, CNDs | 🟢 **contratar** — ver o quadro abaixo do que ele NÃO resolve |

#### 🔴 O que o InfoSimples **não** resolve, e a razão é estrutural

| | Por quê |
|---|---|
| **2.2 · DAS do ME** | A emissão que ele tem é **de MEI**. O DAS de ME/EPP **nasce da transmissão do PGDAS-D**, que tem *"caráter declaratório, constituindo confissão de dívida"*. **Quem não transmite a declaração não pode emitir a guia** — não é lacuna de catálogo, é como o tributo funciona |
| **5.8 · Trava da DEFIS** | Mesma razão: transmitir declaração, não consultar |
| **4.5 · DARF do pró-labore** | 🟡 **A conferir.** Ele tem `SICALC / Gerar DARF`, mas o SICALC gera DARF de **pagamento espontâneo**; o INSS do pró-labore sai como **DARF numerado** pelo caminho eSocial (S-1200) → DCTFWeb. São coisas diferentes, e confundir seria repetir o erro do "quase só consulta" |

🔑 **A leitura que muda o plano:** o Integra Contador continua necessário, mas **por menos coisas**. Ele fica com o que exige **transmitir** (PGDAS-D, DEFIS, eSocial, DCTFWeb); o InfoSimples cobre **ler** e alguns documentos avulsos. Não competem — **se complementam**, e a fronteira entre eles é *transmitir × consultar*.
| **Pagar.me** | Cobrança da mensalidade e dos avulsos | 🟡 em avaliação, reunião sendo marcada. Ver [[2026-09-08-provedores-pagamento-saas-br]] |
| **Open Finance** | Conciliação bancária read-only (um dos caminhos do 2.4) | 🔴 não investigado |
| **e-CAC / consulta de arrecadação** | O outro caminho do 2.4. O líder tem algo assim, com atraso declarado de ~30 dias | 🔴 não investigado. Ver [[2026-09-09-contabilizei-pro-labore]] |
| **DTE-SN** | Caixa onde chega o Termo de Exclusão (5.7) | 🔴 não mapeado. Verificar se o Integra Contador expõe |
| **JUCEMG** | Alteração contratual, baixa | 🔴 **sem API**, e isso não mudou. Gargalo conhecido dos avulsos caros |
| **ALF PBH / SISDRAM** | Alvará, taxas municipais, inscrição municipal | 🔴 a mapear. Trava o 8.8, que é pré-condição pra emitir nota |

❌ **Linhas mortas, não reabrir:**
- **Asaas** — fora desde 08/09. O formato de intermediação dele nos jogaria pro escopo PCI. Ver [[legalize-gateway-asaas-fora]].
- **Focus NFe · PlugNotas · eNotas · NFE.io** — a comparação foi cancelada em 09/09. Com o Emissor Nacional obrigatório, o caminho é a API federal direto.

⚠️ **Anti-guru, e vale pra tabela inteira:** 🟢 aqui significa **"sabemos o caminho"**, nunca "está integrado". Nenhuma linha foi testada contra API real. Antes de virar promessa pro Mauro ou estimativa pro dev, cada uma precisa de um teste de chamada.
