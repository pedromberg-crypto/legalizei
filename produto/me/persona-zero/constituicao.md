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

🔑 **O que ele instancia:** o schema de constituição de ME já existe e é gerado — **90 campos em 19 telas**, na ordem de coleta, em `app/src/lib/conferencia-dados.ts` (saído de `produto/_flow/flow-data.mjs`). Este arquivo não inventa campo: pega esses 90 e pergunta *"qual é o valor real do Pedro?"*.

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
| Categoria de atividade | U | **4 · Marketing e publicidade** (⚠️ são **14** categorias, não 15) | `taxonomia-pills-n4.md` |
| Logradouro/bairro/município/UF | API | Serra · Belo Horizonte · MG | Cartão CNPJ |

⚠️ **O endereço é APARTAMENTO, e ele mora nele.** É exatamente o gate que subiu pro E3.4 em 01/09 (casa/apartamento + "você mora aqui?"), com a saída do endereço fiscal pra quem não mora. A persona zero passa pelo caminho **mais restrito** do gate, o que é bom: é o caso que a gente mais precisa ver funcionando.

### E5T · Triagem de sócios · `/gate?etapa=triagem`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Quantidade de sócios | U | **1** (só o titular) | Pedro, 13/09 |
| Quem administra | U | não se pergunta com 1 sócio | regra do C3 |
| É a 1ª empresa que abre? | U | ⚪ fora de escopo — não interfere | Pedro, 13/09 |

### E5F · Faixa de faturamento · `/gate?etapa=faixa`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Faixa de faturamento mensal | U | ⚪ **dado interno, e não é buraco** — ver decisão abaixo | Pedro, 13/09 |

🔑 **Vale medir depois:** o real dele nos 9 meses foi `0 · 0 · 12.000 · 12.000 · 12.000 · 0 · 12.000 · 0 · 7.910 · 9.895`. Média ~7.500/mês, com 4 meses zerados. **Se ele tivesse declarado a faixa pelo mês bom, teria errado a própria expectativa em 40%.** É argumento pra pergunta de faixa ser sobre expectativa anual, não mensal — mas ainda é 1 caso, não regra.

### E6 · Criar conta · `/conta`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Nome | U | PEDRO MAIA BERG DE OLIVEIRA | aceites |
| **CPF** | U | **088.561.916-10** | Central de Sócios, 13/09 |
| Telefone · e-mail | U | **(31) 99405-4307** · **pedromberg@gmail.com** | Portal JUCEMG |
| Senha | U | ⚪ fora de escopo (não é dado de negócio) | — |
| Código de verificação (8 díg.) | U | mecânica nossa, sem correspondente | — |

### E6.1 / E6.2 · Código e divergência de CPF
Mecânica nossa. **Não tem correspondente no caso real** — não houve divergência de CPF na constituição dele. Fica sem prova.

### E9 · Pagamento + contrato · `/pagamento`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Aceite do contrato | U | **19/01/2026**, com registro de IP e CPF | aceites LITERAL |
| Método de pagamento | U | ⚪ fora de escopo — não interfere na varredura de processos | Pedro, 13/09 |
| Dados de cartão / titular / fatura | U | ⚪ fora de escopo — e é dado que a gente não quer guardar | Pedro, 13/09 |
| CPF com MEI ativo | API | não se aplica — sem impedimento | — |

🔴 **A data do aceite é a âncora de cobrança, e o caso real ACENDE a luz.** A empresa abriu **12/12/2025** e o aceite registrado é de **19/01/2026** — 38 dias depois. Se o ciclo de cobrança ancora no aceite, ele ancora **depois** da empresa existir. Isso é exatamente a pergunta 🔴 que ficou aberta pro time do dev em 12/09 (*"a data/hora do aceite atravessa o handoff?"*), e aqui ela ganha um caso concreto onde as duas datas **não coincidem**. ⚠️ Não sei ainda se o aceite de 19/01 é o da contratação ou o de um documento anual — é a primeira coisa a checar na varredura.

### C0 / C0.0 · Sua atividade · `/dossie/atividade`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Descrição da atividade (texto livre) | U | insumo, não resultado — o que importa é o CNAE abaixo | — |
| CNAE principal derivado | API/U | **7319-0/04** Consultoria em publicidade | Cartão CNPJ |
| "Atividade exercida no local?" | A | Não (sempre) — ✅ **CONFERIDO** | Alvará 2025098844: "Atividades NÃO exercidas no local" |

🔑 **Teste de ouro pro nosso motor de CNAE.** Ele é PM/dev que faz "desenvolvimento de produto digital e gestão de equipe" (o texto do serviço na NFS-e nº 6) e terminou em **consultoria em publicidade**. Vale rodar o nosso motor com a descrição real e ver se chega no mesmo CNAE — e se não chegar, quem está certo. ⚠️ Não é conferência de UI: é a única funcionalidade nossa que dá pra testar contra um resultado real já homologado por um órgão.

### C5 · CNAE secundários · `/dossie/cnae-secundarios`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| CNAEs secundários (até 15) | U | **NENHUM** | Cartão CNPJ |

### C1 · Seus dados · `/dossie/socio`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| Nome / CPF / endereço (confirma do E6) | U | nome ✅ · CPF **088.561.916-10** · endereço pessoal ✅ **igual ao da empresa** | Pedro, 13/09 |
| 🔒 RG + órgão emissor | U | **MG 17113036 · SSP MG** — rótulo "RG" **MANTIDO** (Pedro, 14/09). 🕓 Aceitar **CNH como validador legal** fica como evolução futura. O contrato do caso real usou a CNH (05960222142 · DETRAN · MG) | Pedro + contrato social |
| Data de nascimento | U | **07/09/1993** | Pedro, 13/09 |
| Nacionalidade | U | **Brasileiro** | Pedro, 13/09 |
| Estado civil (+ regime de bens) | U | **Solteiro** — sem regime de bens | Pedro, 13/09 |
| Representante na Receita | A | o próprio Pedro | Cartão CNPJ |
| Profissão | A | "Empresário" — ✅ **CONFERIDO** | Contrato social |
| Qualificação (cód. 49) | A | Sócio-Administrador | nossa automação |
| Endereço pessoal (CEP → autofill) | API | **CEP 30.220-310** · R Corinto 202 APT 601, Serra, BH/MG | Pedro + Cartão CNPJ |

✅ **CONFIRMADO 13/09: o endereço pessoal É o mesmo da empresa.** 🔑 Nosso flow trata como **duas coletas separadas** (E3.4 para a empresa, C1 para a pessoa). Na persona zero — sócio único que abre a empresa em casa — é a **mesma digitação duas vezes**. Vale um "é o mesmo endereço?" com o valor já preenchido. ⚠️ Não vale derivar sozinho: quem usa endereço fiscal da Legalizai tem os dois diferentes por construção.

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
| Índice cadastral do IPTU | U | (único campo do cliente) | ✅ **108020 006A0264** — Alvará 2025098844 |
| Objeto social (via C7) | U | gerado automático | 🐛 no e-mail da líder saiu como `*\|OBJETO_SOCIAL\|*` |
| Forma de atuação | A | Atividade Desenvolvida Fora do Estabelecimento | ⚙️ **nunca conferido** |
| Tipo de unidade | A | Produtiva | ⚙️ **nunca conferido** |
| 🔒 **Metragem** | A | **20 m²** — **DECISÃO TRAVADA** (Pedro, 14/09) | líder usa 5 m². Divergência **deliberada**, não erro |
| 🔒 **Capital social** | A | **R$ 10.000,00** — **DECISÃO TRAVADA** (Pedro, 14/09) | líder usa R$1.000. Divergência **deliberada**, não erro |
| Valor nominal de cotas | A | R$ 1,00 | ✅ **CONFERIDO** — 1.000 quotas × R$1,00 |
| Acesso ao endereço | A | Pedestre | ✅ **CONFERIDO** — Alvará: "Tipo de acesso: Pedestres" |
| Atividade inócua ou virtual? | A | Sim (sempre) | ✅ **CONFERIDO** — Dispensa Bombeiros: "ambiente inócuo ou virtual" |
| Edificação nova? | A | Não (sempre) | ⚙️ **nunca conferido** |
| Capital integralizado? | A | Sim (sempre) | ✅ **CONFERIDO** — "integralizadas, neste ato, em moeda corrente do País" |

🔴 **Esta tela é a mais cega das 19, e é a que mais chuta.** Dez campos, nove deles preenchidos por nós com valor fixo, e **zero medidos contra o caso real**. O capital social de R$10.000 é o exemplo: é número que a gente escolheu, ele está no contrato social de verdade do Pedro, e nunca comparamos. Todos esses valores estão no **contrato social dele**, que é 1 documento — e resolve a tela inteira de uma vez.

### C7 · Nome / razão social · `/dossie/nome`
| Campo | Origem | Valor real | Fonte |
|---|:--:|---|---|
| 3 opções de razão social | U | a vencedora foi o **nome civil + atividade**. ⚠️ A líder avisa que *"nossos especialistas podem ter feito alterações"* — muda sem perguntar | Cartão CNPJ + e-mail 11/12 |
| 🔴 Objeto social | U | Real: **"CONSULTORIA EM PUBLICIDADE"** — só o nome IBGE da subclasse. Nosso template erra **por excesso** ("Prestação de serviços de…, podendo também exercer…") | Contrato social, Cláusula Segunda |
| Nome fantasia | U | **BERG CONSULTORIA EM MARKETING** | Cartão CNPJ |
| Data de início das atividades | A | dia do preenchimento, nunca retroativa | 12/12/2025 |

🐛 **BUG NOSSO, achado pela persona zero (13/09).** O `OBJETO_SOCIAL` no `mock.ts` é:

```
Prestação de serviços de ${CNAE principal}, podendo também exercer ${secundárias.join(", ")}.
```

**Não há guarda para lista vazia.** A persona zero tem **zero CNAEs secundários**, então o texto sai:

> *"Prestação de serviços de consultoria em publicidade, podendo também exercer ."*

🔴 **E o comentário do próprio arquivo diz por que isso é grave:** *"objeto divergente do CNAE do DBE é o ponto de falha nº 1 da JUCEMG"* (`pesquisa/exigencias-jucemg.md`). CNAE único não é caso raro — é o **mais comum** no ME de serviço, e é o da persona zero. O correto sem secundária é encerrar em *"consultoria em publicidade."*, sem a oração pendurada.

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

## 4 · 📍 O placar dos 90 campos

🔄 **Atualizado 13/09 depois da rodada de preenchimento com o Pedro.** O `🕳️ buraco` deixou de existir como categoria: tudo que faltava ou foi preenchido, ou foi declarado fora de escopo desta varredura.

| | Categoria | Nº | O que significa |
|:--:|---|---:|---|
| ✅ | **Medidos** | **37** | temos o valor real, com fonte |
| ⚪ | **Fora de escopo desta varredura** | **7** | não interferem no levantamento de processos |
| ⚙️ | **Automação nossa, NUNCA conferida** | **22** | 🔴 **a zona de risco** |
| 🚫 | **Não se aplicam a este caso** | **24** | unipessoal, sem divergência de CPF, sem sócio extra |
| | **TOTAL** | **90** | |

### 🔴 Os 22 nunca conferidos são o que sobrou de risco

São valores que **nós cravamos** e nunca comparamos com nada: **C4 (8)** forma de atuação · tipo de unidade · metragem 20m² · valor nominal de cotas · acesso ao endereço · atividade inócua · edificação nova · capital integralizado · **RPA (10)** tipo de evento 101 · código do ato 090 · telefone sem 9º dígito · SPE · tipo de contrato · testemunhas · endereço de correspondência · requerente do DAE · telas do DBE puladas · polling de protocolo · **C1 (3)** profissão "Empresário" · qualificação 49 · tradução do regime de bens · **C0 (1)** "atividade exercida no local = Não".

🔴 **Placar dessa categoria: 2 conferidos, 2 errados.**

| Campo | Nosso | Real |
|---|---|---|
| **Capital social** | R$ 10.000,00 | **R$ 1.000,00** |
| **Natureza jurídica** (unipessoal) | SLU (230-5) | **206-2 LTDA** |

⚠️ Dois pra dois não é amostra suficiente para concluir que o resto está errado. **Mas é suficiente para parar de tratar essa coluna como "provavelmente ok".** É "não sabemos", e o que medimos até agora errou.

🔑 **O contrato social resolve a maior parte dela de uma vez** — capital, quotas, integralização, administração e testemunhas estão todos lá. É por isso que ele continua sendo a peça mais valiosa em aberto (pedido à Contabilizei em 13/09; alternativa é a certidão paga da JUCEMG, ato **31217298589**).

### 📊 Decisão travada: a faixa de faturamento é DADO INTERNO

Pedro, 13/09:

> *"esse a gente sempre usará apenas como dado interno, pois na constituição da empresa isso começa zerado. Então a pessoa coloca apenas um valor simbólico, ou pode até colocar que não sabe quanto faturará ainda — e pra gente também não é um problema, pois nossas funcionalidades e cruzamento de dados são em cima de fato do que a pessoa emite de NF."*

🔑 **Muda o peso da pergunta, não a pergunta.** A faixa do E5F **não alimenta cálculo nenhum**: RBT12, anexo, Fator R e alíquota saem todos da **nota emitida**, não da expectativa declarada. Então "não sei ainda" é resposta válida e não degrada nada.

⚠️ E isso **enterra uma hipótese minha de hoje de manhã**: eu tinha sugerido que a pergunta de faixa deveria ser sobre expectativa anual em vez de mensal, porque o real do Pedro (`0 · 0 · 12k · 12k · 12k · 0 · 12k · 0 · 7,9k · 9,9k`) faria qualquer declaração mensal errar feio. A observação sobre a variação continua verdadeira; a conclusão não se sustenta, porque o número **não é usado para nada que dependa de precisão**.

### ⚪ Os 7 fora de escopo

| Tela | Campo | Por quê |
|---|---|---|
| E9 | método de pagamento · cartão · titular · endereço da fatura (4) | não interferem na varredura de processos, e cartão a gente não quer guardar |
| C4 | índice cadastral do IPTU | temos o endereço completo |
| E5T | é a 1ª empresa que abre | não interfere |
| E6 | senha | não é dado de negócio |

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
