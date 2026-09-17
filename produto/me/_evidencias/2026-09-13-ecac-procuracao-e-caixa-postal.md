---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-13
assunto: persona-zero
tags: [produto, persona-zero, evidencia, ecac, procuracao, sensivel]
---

# 🏛️ e-CAC da persona zero — a procuração que a Contabilizei tem, e a caixa postal

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** conta e-CAC do Pedro, logada por ele, varredura **só leitura** em 13/09/2026.
**Perfis usados:** Titular (CPF 088.561.916-10) e **Responsável Legal de 64.037.271/0001-02**.

---

## 1 · ⚖️ A mecânica do acesso, confirmada na tela

Fechou a dúvida do Pedro (*"como cadastro meu CNPJ no gov.br com o certificado?"*) com texto de órgão, não com dedução:

1. **Não existe conta gov.br de CNPJ.** A conta é do cidadão. Texto oficial do `gov.br/governodigital`: *"uma identificação que comprova em meios digitais que você é você… disponível para todos os cidadãos brasileiros"*.
2. **O certificado digital não vincula empresa: ele eleva o nível da conta.** Mesma fonte, sobre o nível máximo: *"obtida por validação de documento de identidade civil, por provedor de identidade, e validação biométrica em base governamental ou por meio de certificado digital"*.
3. **O e-CAC não aceita mais login por certificado.** A tela de `cav.receita.fazenda.gov.br/autenticacao/login` só oferece gov.br.
4. **O vínculo com o CNPJ não se cadastra — já existe.** Em "Alterar perfil de acesso" as três opções são: **Responsável Legal do CNPJ perante a RFB** · Procurador de pessoa física - CPF · Procurador de pessoa jurídica - CNPJ. Bastou digitar o CNPJ e o perfil trocou, porque o Pedro é o representante no QSA.
5. 🕓 **Migração anunciada:** *"Em breve, o acesso ao e-CAC será desativado. Os serviços digitais da Receita Federal passarão a ser acessados exclusivamente pelo portal Serviços da Receita Federal."* Vale pro nosso roadmap de integração: o e-CAC clássico tem prazo.
6. 🐛 E o portal novo (`servicos.receitafederal.gov.br`) tem o próprio link **"Caixa Postal" quebrado (404)**. A migração está em curso e mal costurada.

---

## 2 · 🔴 A procuração: 5 anos, TODOS os serviços, inclusive confissão de débitos

**Documento lido 100%** — `~/Downloads/Página de Autenticação.pdf`, 2 páginas, **2.278 caracteres**, extração `pypdf`.

| | |
|---|---|
| **Outorgante** | PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA · 64.037.271/0001-02 |
| **Outorgado** | **CONTABILIZEI CONTABILIDADE LTDA** · 34.346.830/0001-97 · Curitiba/PR |
| **Assinada em** | **08/01/2026** |
| **Válida até** | **08/01/2031** (5 anos) |
| **Situação** | Ativa |
| **Código de localização** | ARGR.X5HX.96CHE.FT31 |

### Texto literal das duas cláusulas que importam

> "Estou ciente de que esta autorização tem força de procuração e permite que a pessoa autorizada pratique **todos os atos válidos em nome da pessoa jurídica** acima qualificada, como **requerer, tomar ciência, assinar, recorrer e desistir**, exclusivamente por meio dos serviços digitais abaixo relacionados."

> **Serviços Autorizados**
> "**Todos os serviços existentes e os que vierem a permitir autorização de acesso**, para todos os fins de representação legal, **inclusive confissão de débitos**, durante o período de validade da autorização."

### O que isso significa, sem suavizar

⚖️ **A procuração em si é obrigação prática**, não abuso: sem ela o contador não transmite declaração nem toma ciência de intimação. Copiar é inevitável.

🏢 **Mas a AMPLITUDE é decisão deles, e é o máximo possível:**
- **"Todos os serviços existentes e os que vierem a permitir"** — procuração aberta, que se expande sozinha para serviços que ainda não existem
- **"inclusive confissão de débitos"** — o poder de reconhecer dívida tributária em nome da empresa
- **5 anos**, o prazo máximo
- **"tomar ciência"** — é o que permite que eles leiam e deem ciência das intimações do DTE. Combinado com o `MEUCNPJ@CONTABILIZEI.COM.BR` do Cartão CNPJ, **o cliente pode nunca ver o que a Receita mandou**

🔴 **A decisão que isso força pra nós, e que nunca foi tomada:** qual o escopo da NOSSA procuração. As opções existem no próprio e-CAC (dá pra marcar serviços específicos em vez de "todos"). Escolher "todos + confissão de débitos + 5 anos" é conveniência operacional nossa paga com poder do cliente. **Não é copiar ou não copiar a procuração — é escolher a largura dela.**

### 🔑 A cronologia, que muda uma hipótese nossa

| Data | Evento |
|---|---|
| **12/12/2025** | CNPJ nasce |
| **08/01/2026** | procuração assinada (**27 dias depois**) |
| **19/01/2026** | aceite do contrato de prestação de serviços (**38 dias depois**) |

⚖️ **Valida a decisão de 05/09** de tirar a procuração e-CAC do flow de constituição: ela é **pós-CNPJ por necessidade** (não existe procuração de PJ que ainda não tem CNPJ). O líder faz exatamente assim.

⚠️ **Mas abre uma pergunta nova:** a procuração veio **antes** do aceite do contrato. O cliente outorgou poder amplo 11 dias antes de aceitar o contrato de serviço. Não sei se é ordem real ou artefato de quando cada documento foi registrado. 🕓 Checar.

---

## 3 · 📬 A caixa postal (DTE) — 4 mensagens, **4 não lidas**

Perfil PJ, `Aplicacao.aspx?id=00006`. Contadores da tela: **Não lidas 4 · Total 4**.

| Remetente | Assunto | Enviada | Exibição até | 1ª leitura |
|---|---|---|---|---|
| Receita Federal do Brasil | Bem-vindo ao Caixa Postal! | 13/09/2026 | — | **—** |
| Receita Federal do Brasil | 🔴 **Painel de Conformidade - Intimação nº 19445629** | **20/08/2026** | 17/08/2041 | **—** |

⚠️ **Só consegui ler 2 das 4 linhas** — as outras duas ficaram abaixo da dobra e a tabela vive num iframe que o `innerText` não alcança. Fica como pendência explícita, conforme a Regra de Leitura Integral.

🔴 **Uma intimação de 20/08/2026 está sem primeira leitura há 24 dias.** Pode ser rotina (o Painel de Conformidade emite avisos automáticos de inconsistência), mas o fato relevante pro produto é outro: **o dono da empresa não sabe que ela existe**, e quem tem poder de tomar ciência é o contador.

🔑 **É o argumento mais forte que já apareceu pro nosso diferencial nº 2, a vigília.** Não é "avisar do DAS", é **"a Receita te escreveu"**. O líder tem procuração pra ler, tem o e-mail oficial no Cartão CNPJ, e mesmo assim a mensagem está não lida na caixa do cliente. Espelhar o DTE dentro do app é funcionalidade que **não existe em nenhuma das nossas 8 categorias** e que nenhum teardown de tela tinha achado.

---

## 4 · 🔴 Uma procuração de PF que o Pedro precisa reconhecer

No perfil **CPF** (não no da empresa), autorizações concedidas:

| Para quem | CPF/CNPJ | Validade | Situação |
|---|---|---|---|
| **ATTEMPO SOLUCOES CONTABEIS LTDA** | 01.386.616/0001-05 | **27/01/2030** | **Ativa** |
| DENISE MAIA DE ANDRADE OLIVEIRA | 462.885.116-68 | 22/08/2025 | Expirada |

Recebidas: FERNANDA OLIMPIO FARIAS (141.664.636-16), expirada.

⚠️ **ATTEMPO não é a Contabilizei** (que é 34.346.830/0001-97 e 20.182.807/0001-08, os dois CNPJs lidos no contrato em 10/09). A validade 27/01/2030 sugere outorga em **janeiro de 2025** — quase um ano **antes** da empresa existir, então é de outra relação, provavelmente contador anterior de pessoa física.

**Não é achado de produto, é achado pro Pedro:** procuração ativa de PF até 2030 para um escritório. Vale conferir se ainda faz sentido. Não toquei em "Restringir" nem "Cancelar".

---

## 5 · O que ficou de fora

| | Pendência |
|:--:|---|
| 🔴 | **2 das 4 mensagens** da caixa postal não lidas por mim (abaixo da dobra, iframe) |
| 🔴 | **Conteúdo da Intimação nº 19445629** — não abri, porque abrir registra a **data de 1ª leitura** e isso tem efeito jurídico de ciência. **Decisão do Pedro**, não minha |
| 🟡 | Declarações transmitidas (PGDAS-D, DEFIS) na fonte da Receita, pra cruzar com o painel do líder |
| 🟡 | Situação fiscal / certidões da empresa |
| 🔴 | **Contrato social** — segue sem aparecer; não está no e-CAC (é Junta Comercial) nem no portal do líder |

## Links
[[constituicao]] · [[2026-09-13-cartao-cnpj-persona-zero-LITERAL]] · [[PERSONA]] · [[legalize-regra-de-orgao-nao-se-deduz]] · [[HOME]]
