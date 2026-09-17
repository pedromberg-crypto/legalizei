---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, contrato-social, jucemg, sensivel]
---

# 📜 O contrato social da persona zero — 7 páginas, lidas 100%

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Arquivo:** `~/Downloads/Pedro Maia contrato_social.pdf` · **7 páginas** · **PDF escaneado sem camada de texto** (extração devolveu 6 caracteres), lido por renderização a 170 dpi e leitura visual página a página.

**Registro:** NIRE **3121729858-9** · nº **31217298589** em **12/12/2025** · protocolo **25/809.585-7** · Módulo Integrador **MGP2501074342** · autenticação `4DF7801AD7DFFE9F9E99797E3F79FACAB3DC91CE` · cópia autenticada 26/12/2025 por Marinely de Paula Bomfim, Secretária-Geral.

---

## 1 · ✅ REGISTRO AUTOMÁTICO CONFIRMADO — e ratifica nossa decisão de 31/08

Página 6, **Termo de Autenticação**, texto literal:

> *"o ato empresarial protocolado sob o nº 25/809.585-7 em 12/12/2025 […] **teve seu registro deferido automaticamente**, sob o nº 31217298589 em 12/12/2025, conforme o permissivo legal descrito nos **§§ 3º e 4º do art. 42, da Lei Federal nº 13.874, de 2019**."*

🔑 **Isto é a validação da decisão de arquitetura mais cara que tomamos no flow.** Em 31/08, pelos 141 prints da gravação da JUCEMG, concluímos que **anexar procuração ou qualquer anexo derruba a elegibilidade ao Registro Automático** — e por isso o contrato é sempre o **padrão do Integrador, sem anexo e sem cláusula extra**, e a procuração e-CAC saiu do flow de constituição.

O caso real fez exatamente isso e **foi deferido automaticamente**. Uma decisão tomada por leitura de tela, três meses depois confirmada por documento de órgão com base legal nomeada.

### ⏱️ E dá o número do prazo: **66 minutos**

| Hora | Evento |
|---|---|
| 11/12/2025 | Contrato assinado (Belo Horizonte) |
| 12/12 **08:28** | E-mail *"Hora de assinar os documentos"* |
| 12/12 **09:34** | **Deferido automaticamente** — assinado por Vinicius Barbosa Mourão, Servidor Público |

**Do "hora de assinar" ao CNPJ registrado: 1 hora e 6 minutos.** Junto com os **40 segundos** da viabilidade (medidos no nosso RPA), fecha a conta dos "24h em BH" que o Pedro afirmou: o processo é praticamente instantâneo, e o tempo real é **espera humana**, não órgão.

⚠️ **Efeitos do registro retroagem a 11/12/2025** (data da assinatura), embora o registro seja de 12/12. É por isso que a Cláusula Quarta diz *"a sociedade iniciará suas atividades em 11/12/2025"* e o Cartão CNPJ traz abertura em 12/12. **Duas datas legítimas e diferentes para "quando a empresa nasceu"** — e o nosso flow só conhece uma.

---

## 2 · 🔴 O objeto social é MENOR do que o nosso — não maior (segue aberto)

**Cláusula Segunda, íntegra:**

> *"O objeto social será **CONSULTORIA EM PUBLICIDADE**."*

É só isso. O nome oficial da subclasse CNAE, sem preâmbulo e sem cauda.

Nosso `OBJETO_SOCIAL` monta:
```
Prestação de serviços de <principal>, podendo também exercer <secundárias>.
```

🔴 **Erramos por excesso em duas frentes:** o *"Prestação de serviços de"* não existe no contrato real, e a oração *"podendo também exercer …"* também não — e é ela que gera o bug da lista vazia registrado ontem (*"…consultoria em publicidade, podendo também exercer ."*).

✅ **Mas o princípio de 04/09 estava certo:** usar o **nome oficial do IBGE**, não apelido de tela. O contrato usa exatamente a descrição da subclasse. 🔑 A correção é **encurtar o template**, não trocar a fonte. E o comentário do nosso próprio código explica por que isso importa: *"objeto divergente do CNAE do DBE é o ponto de falha nº 1 da JUCEMG"*.

🕓 **Pendência real:** com **duas ou mais** CNAEs, o contrato precisa listar todas — e não temos caso real para ver a forma. Não inventar; perguntar ao Ademar ou achar um segundo contrato.

---

## 3 · 🕓 O órgão aceita CNH no lugar do RG (evolução futura)

**Qualificação, íntegra:**

> *"PEDRO MAIA BERG DE OLIVEIRA, nacionalidade **BRASILEIRA**, **Empresário**, **Solteiro(a)**, data de nascimento **07/09/1993**, nº do CPF 088.561.916-10, **documento de identidade 05960222142, DETRAN, MG**, com domicílio / residência a RUA CORINTO, número 202, APT 601, bairro / distrito SERRA, município BELO HORIZONTE - MINAS GERAIS, CEP 30.220-310."*

O Pedro informou ontem **RG MG 17113036 · SSP MG**. O que foi para o contrato foi **05960222142 · DETRAN · MG** — o número de registro da **CNH**.

🔒 **DECISÃO (Pedro, 14/09): o rótulo "RG" fica como está.** Não é correção pendente.

🕓 **Fica registrado como evolução futura:** aceitar a **CNH como validador legal** do campo. O caso real mostra que o órgão aceita (o contrato saiu com `05960222142 · DETRAN · MG`) e a própria líder instrui *"tenha em mãos o **RG ou CNH**"*. Quando fizer sentido, o campo vira **"documento de identidade + órgão + UF"** com as duas opções.

---

## 4 · 📊 O placar dos 22 valores ⚙️ dobrou: **12 conferidos**

| Campo | Nosso | Real | |
|---|---|---|:--:|
| 🔒 Capital social | **R$ 10.000** (travado) | R$ 1.000 | 🏢 |
| 🔒 Natureza jurídica (regra) | **SLU se sem sócio** (travado) | 206-2 LTDA | 🏢 |
| 🔒 Metragem | **20 m²** (travado) | 5 m² | 🏢 |
| **Valor nominal da cota** | **R$ 1,00** | **R$ 1,00** (1.000 quotas) | ✅ |
| **Profissão** | **"Empresário"** | **"Empresário"** | ✅ |
| **Testemunhas** | **Nenhuma** | **nenhuma** | ✅ |
| **Código do ato** | **090 Constituição** | **090 CONTRATO** | ✅ |
| **Evento de enquadramento** | **315** | **315 ENQUADRAMENTO DE MICROEMPRESA**, qtde 1 | ✅ |
| **Natureza jurídica (código)** | **2062** | **2062** | ✅ |
| **Nº de vias** | 1 | **1** | ✅ |
| Acesso ao endereço | Pedestre | Pedestres | ✅ |
| Atividade exercida no local | Não | NÃO exercida | ✅ |
| Atividade inócua ou virtual | Sim | inócuo ou virtual | ✅ |
| **Tipo de contrato** | Padrão · **15 cláusulas** | Padrão · **16 cláusulas** | ⚠️ |

**12 de 22 conferidos · 8 iguais · 3 DIVERGÊNCIAS DELIBERADAS · 1 impreciso.**

> 🔒 **TRAVADO POR DECISÃO DO PEDRO (14/09).** As três "divergências" **não são erros nossos** — são **escolhas de negócio**, e ficam como estão:
> - **Capital social R$ 10.000** (líder usa R$1.000) — mantido
> - **Natureza jurídica SLU** no unipessoal (líder usa 206-2 LTDA) — mantido
> - **Metragem 20 m²** (líder usa 5 m²) — mantido
>
> **Não reabrir, não listar como erro.** O valor do líder é referência, não gabarito — é a etiqueta 🏢 *decisão deles* da doutrina deste estudo, aplicada a nós mesmos.
>
> 🔒 **O rótulo "RG" também fica** como está. 🕓 Aceitar **CNH como validador legal** entra como evolução futura, não como correção.

🔑 **O padrão se manteve e ficou mais claro:** todos os **códigos de órgão** que cravamos estão certos (090, 315, 2062, 1 via) — porque foram lidos dos prints. As três divergências são **escolhas nossas, travadas** (capital, metragem, SLU) — não erros. ⚠️ O único item de fato impreciso é a contagem de cláusulas: são **16** (Primeira a Décima Sexta), e nossos docs dizem 15 em 3 lugares.

---

## 5 · 🔑 O que as 16 cláusulas entregam e nosso mapa não tinha

**Cláusula Nona — o exercício social encerra em 31 de dezembro**, e o administrador presta contas com *"inventário, balanço patrimonial e balanço de resultado econômico"*. **Cláusula Décima:** os sócios têm **quatro meses** após o fim do exercício para deliberar sobre as contas. 🔑 Isso é o calendário anual do cliente, escrito no contrato dele, e amarra direto com a Carta de Responsabilidade (CFC 1.590/2020) e com a DEFIS.

**Cláusula Décima Terceira — o pró-labore é FACULTATIVO no contrato:** *"Os sócios poderão, de comum acordo, fixar uma retirada mensal, a título de 'pro labore', observadas as disposições regulamentares pertinentes."* ⚠️ **"Poderão", não "deverão"** — e o e-mail educativo deles de 25/12 diz o oposto (*"ele é obrigatório"*). As duas coisas convivem: o contrato não obriga, a legislação previdenciária sim. 🔑 Explica por que o pró-labore da persona zero **só começou em março**: contratualmente, nada o obrigava a começar antes.

**Cláusula Décima Primeira — a declaração de ME está DENTRO do contrato:** *"declara(m) que o movimento da receita bruta anual não excederá o limite fixado no inciso I do art. 3º da LC nº 123/2006, e que não se enquadra em qualquer das hipóteses de exclusão do § 4º do art. 3º"*. 🔑 O enquadramento não é só um evento (315) na capa: é **declaração assinada pelo sócio**. Muda o peso do nosso gate de faixa de faturamento — que o Pedro classificou ontem como "dado interno".

**Cláusula Oitava — administração:** poderes de representação ativa e passiva, judicial e extrajudicial; **vedado** usar o nome empresarial em atividades estranhas ao objeto, e **onerar ou alienar imóveis sem autorização dos outros sócios**. ✅ Bate com o que mapeamos em 01/09 sobre administração.

**Cláusula Décima Quinta — o administrador declara não estar impedido** (condenação criminal, crime falimentar, peculato, contra o sistema financeiro, contra relações de consumo…). 🕓 Nosso flow nunca pergunta isso, e é declaração sob as penas da lei.

**Cláusula Décima Sexta — foro de Belo Horizonte.**

---

## 6 · ✍️ Assinante único: só o sócio. Nenhum contador na Junta.

Tanto a **Capa de Processo** quanto o **Documento Principal** listam **um assinante**: `088.561.916-10 — PEDRO MAIA BERG DE OLIVEIRA`.

✅ Ratifica a arquitetura de assinaturas mapeada em 05/09: a assinatura da **Junta** é dos **sócios**; o contador entra na **Receita/DBE**, que é outro ato. E confirma que a 1ª assinatura é do próprio sócio via gov.br, sem certificado — como o Pedro corrigiu ontem.

⚠️ O formulário de Requerimento (página 1) tem *"Representante Legal da Empresa: Nome ___ Assinatura ___ Telefone ___"* **em branco** — é campo de via física que o Registro Digital não usa.

---

## 7 · Dados novos para o dossiê

| Campo | Valor |
|---|---|
| NIRE | **3121729858-9** (registro nº 31217298589) |
| Protocolo JUCEMG | **25/809.585-7** |
| Processo Módulo Integrador | **MGP2501074342** |
| Nº FCN/REMP | MGP2501074342 |
| Módulo Integrador (versão) | **15** |
| Código de barras do contrato | MG96889242 |
| Chave de segurança de validação | `y20W` |
| Data de assinatura | **11/12/2025** |
| Data do registro | **12/12/2025 09:34** |
| Efeitos do registro | **11/12/2025** |
| Início das atividades (cláusula 4ª) | **11/12/2025** |
| Documento de identidade | **05960222142 · DETRAN · MG** (CNH) |
| Quotas | **1.000 × R$ 1,00 = R$ 1.000,00**, integralizadas no ato, em moeda corrente |

## Links
[[constituicao]] · [[2026-09-13-cadeia-de-emails-da-abertura]] · [[2026-09-13-documentos-municipais-da-abertura]] · [[legalize-gravacao-jucemg-fonte-primaria]] · [[HOME]]
