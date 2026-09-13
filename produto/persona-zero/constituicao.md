---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-13
assunto: persona-zero
tags: [produto, persona-zero, constituicao, dados-reais, sensivel]
---

# 🧪 Persona zero · Os dados da constituição, reais

> 🔒 **ESTE ARQUIVO TEM DADO PESSOAL EM CLARO.** Decisão do Pedro em 13/09, com a ressalva de sempre: só ele mexe no vault. **Não colar em prompt de agente, em vault do Léo, em handoff pro dev nem em issue.** Quem precisar da forma, referencia a estrutura em `app/src/lib/conferencia-dados.ts`; quem precisar do valor, abre aqui.

## Por que este arquivo existe

Provocação do Pedro, 13/09: *"me usar como a persona 1 de fato, com características travadas, pois temos TODAS as minhas informações necessárias e temos todas as ações feitas pela Contabilizei para me atender — que é exatamente parte das funcionalidades que já travamos como core."*

O método muda de eixo. Até aqui varremos por **categoria** (Notas, Impostos, Pró-labore…), perguntando *"o que essa função precisa fazer?"*. A partir daqui varremos por **ordem de execução real**, perguntando *"o que aconteceu com esta empresa, nesta data, e o que o contador fez em resposta?"*. A conta paga do Pedro na Contabilizei é uma implementação **completa, correta e datada** do nosso MLP inteiro, aplicada à nossa persona ideal, por uma casa de 13 anos.

Este é o **arquivo 1**: o ponto zero da linha do tempo, a constituição do CNPJ em **12/12/2025**. Os próximos seguem o calendário dele, mês a mês, até hoje.

🔑 **O que ele instancia:** o schema de constituição de ME já existe e é gerado — **90 campos em 19 telas**, na ordem de coleta, em `app/src/lib/conferencia-dados.ts` (saído de `execucao/flow/flow-data.mjs`). Este arquivo não inventa campo: pega esses 90 e pergunta *"qual é o valor real do Pedro?"*.

---

## 🏷️ A etiqueta de três vias (regra deste estudo, travada 13/09)

O líder é **evidência, não autoridade**. "A Contabilizei fez assim" mistura três coisas que precisam sair separadas em toda linha, senão em três semanas temos um clone com os defeitos junto:

| | Etiqueta | O que é | O que fazemos |
|:--:|---|---|---|
| ⚖️ | **Obrigação legal** | a lei ou o órgão manda; ele só obedece | **copiar**, citando a lei — nunca ele |
| 🏢 | **Decisão deles** | escolha de produto, legítima e não obrigatória | **decidir de novo**, do zero |
| 🐛 | **Defeito ou interesse deles** | bug, ou receita disfarçada de serviço | **não copiar** |

**Não é teoria — já rejeitamos os três.** "Pagar o DAS pelo app" morreu em 27/07 (🏢). A trava de distribuição de lucro por débito federal o Pedro matou em 13/09 com *"não é nosso papel regular"* (🏢, e ruim). O centavo exibido ≠ cobrado é 🐛 deles, e eu quase transformei em regra nossa. Os ~43 serviços à-la-carte são 🐛 de interesse.

---

## 1 · A identidade, medida

Tudo abaixo tem fonte. Nada aqui é suposição.

| Campo | Valor real | Fonte |
|---|---|---|
| **Razão social** | PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA | Cartão CNPJ 26/05/2026 · aceites 19/01/2026 |
| **Nome fantasia** | BERG CONSULTORIA EM MARKETING | Cartão CNPJ (título do estabelecimento) |
| **CNPJ** | 64.037.271/0001-02 | Cartão CNPJ · chave da NFS-e nº 6 |
| **Data de abertura** | **12/12/2025** | Cartão CNPJ |
| **Situação cadastral** | ATIVA | Cartão CNPJ |
| **Porte** | ME | Cartão CNPJ |
| **Natureza jurídica** | **206-2** Sociedade Empresária Limitada | Cartão CNPJ |
| **CNAE principal** | **73.19-0-04** Consultoria em publicidade | Cartão CNPJ |
| **CNAE secundários** | **NENHUM** | Cartão CNPJ |
| **Sócios** | **UNIPESSOAL** — nenhum sócio | Pedro, 13/09 |
| **Endereço** | R Corinto, 202, **APT 601**, Serra, Belo Horizonte / MG | Cartão CNPJ |
| **Município IBGE** | 3106200 | chave de acesso da NFS-e |
| **Alvará** | **DISPENSADO** (Res. CGSIM 51/2019) | marcado no próprio Cartão CNPJ |
| **Conselho de classe** | nenhum — atividade não regulamentada | Cartão CNPJ (CNAE) |
| **Inscrição Municipal (CCM)** | **17240640017** | painel "Dados da empresa e banco", 09/07 |
| **Regime tributário** | Simples Nacional, **Anexo III, 6%** | recibo PGDAS-D + Lei 12.741 na nota + aritmética do ISS |
| **Certificado digital** | Emitido **22/12/2025 16:49** por **AC SAFEWEB**, validade **22/12/2026** | e-mails AC SAFEWEB, 13/09 + painel da conta, 09/07 |
| **Contato na Receita** | MEUCNPJ@CONTABILIZEI.COM.BR · (41) 9788-0145 | Cartão CNPJ |
| **Contador atual** | Contabilizei | — |

🔑 **O certificado vence 22/12/2026, dez dias depois do 1º aniversário da empresa.** Foi emitido junto da constituição, com validade de 1 ano. É a primeira renovação obrigatória do ciclo de vida do cliente e **não está em lugar nenhum do nosso mapa** — nem como aviso, nem como cobrança, nem como processo.

---

## 2 · Os 90 campos, na ordem de coleta

Legenda de origem, herdada do schema: **[U]** o cliente digita · **[A]** nós preenchemos automático · **[API]** vem de consulta.

### E3.3 · Seus dados · `/dados`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Nome completo | U | PEDRO MAIA BERG DE OLIVEIRA | aceites 19/01/2026 |
| E-mail | U | **pedromberg@gmail.com** | "Meu cadastro", Portal JUCEMG, 13/09 |
| Telefone | U | **(31) 99405-4307** | "Meu cadastro", Portal JUCEMG, 13/09 |
| Consentimento de privacidade | U | implícito ao continuar | — |

### E3.2 · MEI × ME · `/entrada?intencao=abrir`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Regime autodeclarado | U | **ME** | Cartão CNPJ (porte) |

### E3.4 · Endereço + categoria · `/endereco`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Endereço da empresa | U | R Corinto, 202, APT 601, Serra, BH | Cartão CNPJ |
| CEP | U | **30.220-310** | Cartão CNPJ literal |
| Categoria de atividade (1 das 15) | U | 🕳️ **buraco** — qual das nossas 15 pills cobre "consultoria em publicidade"? | — |
| Logradouro/bairro/município/UF | API | Serra · Belo Horizonte · MG | Cartão CNPJ |

⚠️ **O endereço é APARTAMENTO, e ele mora nele.** É exatamente o gate que subiu pro E3.4 em 01/09 (casa/apartamento + "você mora aqui?"), com a saída do endereço fiscal pra quem não mora. A persona zero passa pelo caminho **mais restrito** do gate, o que é bom: é o caso que a gente mais precisa ver funcionando.

### E5T · Triagem de sócios · `/gate?etapa=triagem`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Quantidade de sócios | U | **1** (só o titular) | Pedro, 13/09 |
| Quem administra | U | não se pergunta com 1 sócio | regra do C3 |
| É a 1ª empresa que abre? | U | 🕳️ **buraco** (opcional) | — |

### E5F · Faixa de faturamento · `/gate?etapa=faixa`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Faixa de faturamento mensal | U | 🕳️ **buraco** — o que ele declarou em 12/2025 | — |

🔑 **Vale medir depois:** o real dele nos 9 meses foi `0 · 0 · 12.000 · 12.000 · 12.000 · 0 · 12.000 · 0 · 7.910 · 9.895`. Média ~7.500/mês, com 4 meses zerados. **Se ele tivesse declarado a faixa pelo mês bom, teria errado a própria expectativa em 40%.** É argumento pra pergunta de faixa ser sobre expectativa anual, não mensal — mas ainda é 1 caso, não regra.

### E6 · Criar conta · `/conta`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Nome | U | PEDRO MAIA BERG DE OLIVEIRA | aceites |
| **CPF** | U | **088.561.916-10** | Central de Sócios, 13/09 |
| Telefone · e-mail · senha | U | 🕳️ **buraco** | — |
| Código de verificação (8 díg.) | U | mecânica nossa, sem correspondente | — |

### E6.1 / E6.2 · Código e divergência de CPF
Mecânica nossa. **Não tem correspondente no caso real** — não houve divergência de CPF na constituição dele. Fica sem prova.

### E9 · Pagamento + contrato · `/pagamento`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Aceite do contrato | U | **19/01/2026**, com registro de IP e CPF | aceites LITERAL |
| Método de pagamento | U | 🕳️ **buraco** | — |
| Dados de cartão / titular / fatura | U | 🕳️ **buraco** (e é dado que a gente não precisa guardar) | — |
| CPF com MEI ativo | API | não se aplica — sem impedimento | — |

🔴 **A data do aceite é a âncora de cobrança, e o caso real ACENDE a luz.** A empresa abriu **12/12/2025** e o aceite registrado é de **19/01/2026** — 38 dias depois. Se o ciclo de cobrança ancora no aceite, ele ancora **depois** da empresa existir. Isso é exatamente a pergunta 🔴 que ficou aberta pro time do dev em 12/09 (*"a data/hora do aceite atravessa o handoff?"*), e aqui ela ganha um caso concreto onde as duas datas **não coincidem**. ⚠️ Não sei ainda se o aceite de 19/01 é o da contratação ou o de um documento anual — é a primeira coisa a checar na varredura.

### C0 / C0.0 · Sua atividade · `/dossie/atividade`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Descrição da atividade (texto livre) | U | 🕳️ **buraco** | — |
| CNAE principal derivado | API/U | **7319-0/04** Consultoria em publicidade | Cartão CNPJ |
| "Atividade exercida no local?" | A | Não (sempre) | nossa automação |

🔑 **Teste de ouro pro nosso motor de CNAE.** Ele é PM/dev que faz "desenvolvimento de produto digital e gestão de equipe" (o texto do serviço na NFS-e nº 6) e terminou em **consultoria em publicidade**. Vale rodar o nosso motor com a descrição real e ver se chega no mesmo CNAE — e se não chegar, quem está certo. ⚠️ Não é conferência de UI: é a única funcionalidade nossa que dá pra testar contra um resultado real já homologado por um órgão.

### C5 · CNAE secundários · `/dossie/cnae-secundarios`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| CNAEs secundários (até 15) | U | **NENHUM** | Cartão CNPJ |

### C1 · Seus dados · `/dossie/socio`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Nome / CPF / endereço (confirma do E6) | U | nome ✅ · CPF **088.561.916-10** ✅ · endereço pessoal 🕳️ | Central de Sócios, 13/09 |
| RG + órgão emissor | U | 🕳️ **buraco** | — |
| Data de nascimento | U | 🕳️ **buraco** | — |
| Nacionalidade | U | 🕳️ (presumível brasileira, **não medida**) | — |
| Estado civil (+ regime de bens) | U | 🕳️ **buraco** | — |
| Representante na Receita | A | o próprio Pedro | Cartão CNPJ |
| Profissão | A | "Empresário" | nossa automação |
| Qualificação (cód. 49) | A | Sócio-Administrador | nossa automação |
| Endereço pessoal (CEP → autofill) | API | 🕳️ **buraco** | — |

⚠️ **O endereço pessoal dele pode ser o mesmo da empresa** (R Corinto 202 APT 601 é residência, e ele mora nela). Se for, é um caso que o nosso flow trata como duas coletas separadas — vale medir se dá pra derivar.

### C2 · Vínculo INSS · `/dossie/vinculo`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Já contribui INSS por fora? | U | **NÃO** — o líder chama de *"Vínculo empregatício ou sócio (Duplo vínculo)"* e o valor é `Não` | Central de Sócios, 13/09 |

🔑 **Não é campo secundário: decide o pró-labore.** Ele paga R$1.621 (o piso). Se houvesse vínculo CLT por fora, a conta do INSS mudaria. A resposta está no histórico da conta.

### C3 / C3.3 · Sócios · `/dossie/socios`
**Não se aplica** — unipessoal. Todos os campos de sócio extra, a lista de administradores, a qualificação 49×22 e o rateio de quotas ficam **sem prova neste caso**.

### C4 · Dados da empresa · `/dossie/empresa`
| Campo | Origem | Nosso valor fixo | Valor real do Pedro |
|---|:--:|---|---|
| Índice cadastral do IPTU | U | (único campo do cliente) | 🕳️ **buraco** |
| Forma de atuação | A | Atividade Desenvolvida Fora do Estabelecimento | 🕳️ não medido |
| Tipo de unidade | A | Produtiva | 🕳️ não medido |
| Metragem | A | **20 m² fixo** | 🕳️ não medido |
| **Capital social** | A | **R$ 10.000,00 fixo** | 🕳️ **buraco — e é o mais importante da tela** |
| Valor nominal de cotas | A | R$ 1,00 | 🕳️ não medido |
| Acesso ao endereço | A | Pedestre | 🕳️ não medido |
| Atividade inócua ou virtual? | A | Sim (sempre) | 🕳️ não medido |
| Edificação nova? | A | Não (sempre) | 🕳️ não medido |
| Capital integralizado? | A | Sim (sempre) | 🕳️ não medido |

🔴 **Esta tela é a mais cega das 19, e é a que mais chuta.** Dez campos, nove deles preenchidos por nós com valor fixo, e **zero medidos contra o caso real**. O capital social de R$10.000 é o exemplo: é número que a gente escolheu, ele está no contrato social de verdade do Pedro, e nunca comparamos. Todos esses valores estão no **contrato social dele**, que é 1 documento — e resolve a tela inteira de uma vez.

### C7 · Nome / razão social · `/dossie/nome`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| 3 opções de razão social | U | a vencedora foi o **nome civil + atividade** (padrão automático da Junta) | Cartão CNPJ |
| Objeto social | U | 🕳️ **buraco** (está no contrato social) | — |
| Nome fantasia | U | **BERG CONSULTORIA EM MARKETING** | Cartão CNPJ |
| Data de início das atividades | A | dia do preenchimento, nunca retroativa | 12/12/2025 |

🔑 **A razão social dele não foi escolhida, foi derivada.** "PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA" é nome civil completo + ramo. Nosso C7 pede **3 opções criativas por ordem de prioridade** — e o caso real sugere que a maioria termina no padrão automático. Vale medir se a tela de 3 opções resolve um problema que existe.

### RPA · Fora de tela
14 campos de automação (natureza jurídica, códigos de ato, evento de enquadramento, testemunhas, contato enviado aos órgãos…). **Um deles tem divergência dura contra o caso real** — próxima seção.

---

## 3 · 🔴 Onde a NOSSA automação diverge do caso real

São quatro. Cada uma é decisão pendente, não bug.

### 3.1 · Natureza jurídica no unipessoal: 206-2 × 230-5
Nosso RPA manda **SLU se sem sócio · LTDA se com sócio** (automático, sem pergunta). O Cartão CNPJ do Pedro, unipessoal, traz **206-2 Sociedade Empresária Limitada** — não a SLU (230-5).

⚖️ **É legítimo:** desde 2019 uma limitada pode ter um sócio só. Mas nossa regra e o caso real **discordam**, e nunca decidimos qual usar. É pergunta pro Ademar, do tipo que a regra de 05/09 manda perguntar em vez de deduzir.

### 3.2 · O contato oficial na Receita é do CONTADOR
Cartão CNPJ: `MEUCNPJ@CONTABILIZEI.COM.BR` · `(41) 9788-0145` (DDD de Curitiba, sede deles). Nosso RPA já faz **igual**: *"e-mail e telefone de contato (DBE/Integrador) = sempre o nosso, nunca o do cliente"*.

🏢 **É decisão deles, e a gente copiou sem debater.** Tem lado operacional real (comunicação da Receita não pode se perder na caixa do cliente) e lado de retenção real (sair da casa exige alterar o cadastro federal). ⚠️ Está copiado no nosso RPA hoje. **Vira decisão explícita ou vira dark pattern por omissão.**

### 3.3 · A tela C4 inteira é chute não conferido
Ver a tabela acima. Nove valores fixos, zero medidos. Resolve com o contrato social.

### 3.4 · A CCM existe, e é o 🔴 do handoff
`17240640017`. A inscrição municipal **não está em nenhum dos trechos do handoff** (nem no do dev, nem no assistido, nem no da parceira) — e sem ela o P3 não emite nota. O caso real prova duas coisas: **existe** (não é opcional em BH) e **alguém a obteve** na constituição dele. Descobrir **quando** e **como** ela apareceu na conta é item de alta prioridade da varredura.

---

## 4 · 🕳️ Os buracos, e onde cada um está

Nada aqui é "não sei": é "sei onde está e ainda não abri".

| # | O que falta | Onde está | Peso |
|:--:|---|---|:--:|
| 1 | **Contrato social** — capital, objeto, cláusulas, integralização, quotas | 🔴 **NÃO está no portal.** Procurado em 13/09 nas duas áreas de documentos: `DOCUMENTOS_CONTABEIS` é upload do cliente (10 tipos, todos com 0 arquivos) e não há download de contrato social em lugar nenhum. **O Pedro precisa ter o arquivo** (e-mail da constituição, Junta, ou gov.br) | 🔴 resolve a C4 e a C7 quase inteiras |
| 2 | Qualificação civil — RG, nascimento, estado civil, nacionalidade | 🔴 **não existe em tela na plataforma** (só o CPF). Vem do contrato social | 🔴 resolve a C1 inteira |
| ✅ 3 | ~~Cartão CNPJ literal~~ | **FECHADO 13/09** — 1.912 car., 100%, em [[2026-09-13-cartao-cnpj-persona-zero-LITERAL]] | — |
| 4 | Índice cadastral do IPTU | IPTU do imóvel / contrato social | 🟡 |
| ✅ 5 | ~~E-mail e telefone do cadastro~~ | **FECHADOS 13/09** no Portal JUCEMG | — |
| ✅ 6 | ~~Vínculo INSS por fora~~ | **FECHADO 13/09 — Não** | — |
| 7 | O que ele declarou de faixa de faturamento em 12/2025 | onboarding da conta, se ainda existir | 🟡 |
| 8 | Descrição livre da atividade que virou o CNAE | onboarding da conta | 🟡 testa o motor de CNAE |
| 9 | Natureza do aceite de 19/01/2026 (contratação × documento anual) | aba Contrato | 🔴 é a âncora de cobrança |
| 10 | 🆕 Por que não houve pró-labore em dez/jan/fev | Central de Sócios / atendimento | 🟡 |
| 11 | 🆕 Status real do certificado digital (card da home × painel de 09/07) | painel de dados da conta | 🟡 |
| ✅ 12 | ~~Contrato social no e-mail~~ | **DESCARTADO 13/09** — varrida a caixa certa (`pedromberg@`): marcador Contabilizei tem 44 e-mails e **zero anexos**. A líder nunca entregou. Ver [[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]] | — |
| 🔴 13 | 🆕 **Certidão de Inteiro Teor da JUCEMG** — ato **31217298589**, aprovado 12/12/2025, imagem 798 KB, único ato da empresa | Portal JUCEMG → Serviços WEB (pago, DAE) | 🔴 **é o único caminho que sobrou** |

🔴 **O contrato social é o gargalo, e não está na plataforma.** Sozinho ele fecha a C4 inteira (9 valores que hoje são chute nosso), o objeto social da C7 e a qualificação civil da C1 — ~25 dos 90 campos. Depende do Pedro ter o arquivo.

---

## 4.1 · 🔍 O que a varredura da conta entregou (13/09)

Conta logada, só leitura. Sete achados, nenhum previsto quando abri.

### ✅ Três buracos fechados
| Campo | Valor | Onde estava |
|---|---|---|
| **CPF do titular** | 088.561.916-10 | Central de Sócios (`#/socio/central`) |
| **CEP** | 30.220-310 | Cartão CNPJ literal |
| **Vínculo INSS (C2)** | **Não** | Central de Sócios |
| Dependentes | 0 | Central de Sócios |

### 🔑 O pró-labore só começa em MARÇO/2026
O histórico da conta vai de **março/2026** até agosto — nada em dezembro, janeiro e fevereiro. A empresa abriu **12/12/2025**. São **quase 3 meses de CNPJ ativo sem pró-labore nenhum**.

Nosso mapa não tem esse estado. O flow entrega a empresa aberta e o portal já pressupõe pró-labore configurado; **o intervalo entre "CNPJ existe" e "primeiro pró-labore" não existe em lugar nenhum**. E é o intervalo em que todo cliente nosso vai nascer, porque o produto começa na constituição. ⚠️ Falta descobrir se foi decisão do Pedro ou default deles.

### 🏢 O líder oferece "não ter pró-labore em meses sem faturamento" — e isso briga com o Fator R
Opção literal na Central de Sócios: *"Não quero ter pró-labore cadastrado em meses sem faturamento."*

🔴 **É decisão deles, e é perigosa.** A pesquisa de 13/09 fechou que o Fator R é **regime de caixa**: o numerador só conta o que foi **pago**. Mês sem faturar já ajuda sozinho (o denominador para); mas **deixar de pagar** o pró-labore trava o numerador e empurra o Fator R pra baixo. A opção é apresentada como economia e pode custar o Anexo. Se a gente replicar, replica com o aviso — ou não replica.

### ✅ O desconto do pró-labore é 11% exato, e bate com o DARF
`1.621,00 × 11% = 178,31` (mar-ago) e `3.360,00 × 11% = 369,60` (mar-abr). O `R$ 178,31` aparece igual no card "DARF UN…" da home. ⚖️ É INSS do contribuinte individual, alíquota legal — copiar.

### ✅ A DEFIS de 2025 foi TRANSMITIDA, com recibo para baixar
`#/declaracoes-anuais` → **"DEFIS - Recibo · TRANSMITIDO · Baixar recibo"**. ⚖️ Obrigação anual, e o líder entrega o comprovante. **A DEFIS não está em nenhuma das nossas 8 categorias** — é a primeira confirmação prática de que o recorte funcional tem furo no eixo temporal, que era a aposta do método.

### 🧩 São DOIS apps, não um
`app.contabilizei.com.br/painel-de-controle/` (novo, home e rotinas) e `app.contabilizei.com.br/sistema/` (legado, declarações mensais/anuais/informe de rendimentos). Navegar de um pro outro **troca o app inteiro**, com header e menu diferentes. 🐛 Não é decisão de produto, é dívida técnica exposta ao cliente — e é exatamente o tipo de costura que a gente pode não ter.

### 🐛 A qualificação civil não existe em tela nenhuma
Varri a Central de Sócios inteira (2.469 caracteres, lidos 100%): **só o CPF aparece**. RG, data de nascimento, estado civil, regime de bens e nacionalidade **não são exibidos em lugar nenhum da plataforma**, mesmo sendo dados que o cliente entregou na constituição e que estão no contrato social. ⚠️ Nosso C1 coleta os cinco. Ou o líder guarda e não mostra, ou não guarda — as duas respostas mudam o nosso desenho, e nenhuma delas dá pra ler daqui.

### ⚠️ Contradição pendente sobre o certificado digital
A home de hoje mostra o card *"Emita o seu certificado digital… sem ele, você deve emitir as notas no site da prefeitura"* com botão **"Emitir certificado grátis"**. Mas o painel de 09/07 registrava **Certificado Digital [Ativo] · Validade 22/12/2026**, e a NFS-e nº 6 foi emitida **pela plataforma** em 12/09. Os três fatos não fecham. 🕓 Checar antes de virar conclusão.

---

## 5 · 🚫 O que este caso NÃO prova

Guarda-corpo travado com o Pedro em 13/09: ausência de evidência **não** é ausência de requisito. Foi assim que nasceu o "plano de saúde do sócio". A persona zero é 1 empresa; a persona travada admite mais.

| O que fica sem prova | Por quê |
|---|---|
| **2, 3 ou 4 sócios** | ele é unipessoal — o C3, o C3.1, o C3.3, a lista de administradores e o rateio de quotas ficam mudos |
| **Anexo V** | ele está no III |
| **Fator R virando no meio do ano** | o dele nunca virou |
| **Chegar perto do teto** | ~R$66 mil em 9 meses, longe dos R$360 mil |
| **Folha de colaborador** | nenhum funcionário, *"meu plano nem permite"* |
| **Múltiplas notas no mês** | 1 nota/mês, numeração sem pulo |
| **CNAE secundário** | nenhum |
| **Atividade regulamentada / conselho** | não é |
| **Casa (× apartamento) e endereço fiscal** | ele é apartamento onde reside |
| **MEI e migração** | fora do escopo padrão |

⚠️ **A leitura do Pedro, registrada:** *"muitas dessas variáveis carregam características e dados que são compartilhados, então a leitura do meu caso 100% é uma descoberta de dados que de qualquer forma ainda é muito rica."* Concordo — e a lista acima existe justamente para que o compartilhado seja **aproveitado** sem que o não-compartilhado seja **presumido**. Cada categoria da linha do tempo fecha repetindo a sua própria versão desta tabela, e é essa lista que vai pro Mauro.

---

## Links
[[PERSONA]] · [[_doutrina-capacidades]] · [[HANDOFF-DADOS]] · [[2026-09-13-teardown-prolabore-e-pgdas-conta-real]] · [[_inventario-documentos]] · [[HOME]]
