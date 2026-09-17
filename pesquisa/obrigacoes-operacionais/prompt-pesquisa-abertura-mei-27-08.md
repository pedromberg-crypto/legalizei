---
tipo: operacao
status: vivo
data: 2026-08-27
assunto: prompt-pesquisa-abertura-mei
tags: [pesquisa, mei, abertura, constituicao, api, prompt-gemini, flow]
---

# 🔎 Prompt de pesquisa (Google Search / Gemini Pro) — abertura/constituição de MEI

> Rodar fora desta sessão (Gemini Pro, Google Search ativo), colar o resultado de volta. Mesmo padrão do resto do vault (`legalize-pesquisa-grande-via-gemini`) e do prompt irmão [[prompt-pesquisa-mei-obrigacoes-27-08]] (obrigações **depois** de aberto — este aqui é a **abertura em si**).
>
> **Por que existe:** hoje o flow de entrada do app abre **ME do Simples Nacional** ponta a ponta (E1→C7→A5). O ramo MEI existe no E3.2 (tela "MEI × ME") mas **só serve pro Migrar** — quem escolhe "abrir MEI" não tem caminho. Esta pesquisa é o insumo pra construir esse ramo.
>
> **O que a pesquisa precisa entregar pra ser útil:** (a) se dá pra automatizar por API; (b) se não dá, o passo a passo oficial com **dado por dado** que o governo exige — porque cada dado vira campo de tela e cada etapa vira nó do flow.

## Prompt (copiar tudo abaixo)

```
Preciso de uma pesquisa técnica sobre o processo COMPLETO de abertura/constituição de um
MEI (Microempreendedor Individual) no Brasil, com foco específico em Belo Horizonte/MG.
Este material vai virar a base de um sistema real que vai abrir empresas pra clientes de
verdade (hoje o sistema já abre ME optante pelo Simples Nacional e queremos passar a abrir
MEI também), então a EXIGÊNCIA DE FONTE é máxima.

Use SOMENTE fontes de altíssima confiabilidade: Portal do Empreendedor / gov.br/empresas-e-negocios,
Receita Federal (gov.br/receitafederal), Redesim (gov.br/redesim), Comitê para Gestão da Rede
Nacional para a Simplificação do Registro e da Legalização de Empresas e Negócios (CGSIM) e suas
Resoluções, Comitê Gestor do Simples Nacional (CGSN) e suas Resoluções, Lei Complementar 123/2006
e alterações, Código Civil (Lei 10.406/2002), Junta Comercial de Minas Gerais (JUCEMG),
Prefeitura de Belo Horizonte (pbh.gov.br), Sebrae (apenas material oficial/institucional),
Diário Oficial da União, planalto.gov.br. NÃO use blogs de contabilidade, sites de escritórios
privados, Jusbrasil, fóruns ou notícias de portal. Se a única fonte que achar for desse tipo,
diga explicitamente "não encontrei fonte oficial pra isso" — não cite a fonte fraca como se
fosse válida. Toda afirmação de regra, prazo, custo ou campo obrigatório precisa vir com a
fonte específica (órgão + norma + artigo, com link se possível).

Preciso de respostas estruturadas pros seguintes blocos.

## BLOCO 1 — Existe automação / API? (esta é a pergunta mais importante)

1. Existe alguma API oficial, webservice, ou integração programática que permita a um
   sistema de terceiro ABRIR (formalizar) um MEI em nome de uma pessoa, sem que ela
   precise acessar manualmente o Portal do Empreendedor? Procure especificamente por:
   API do Portal do Empreendedor, API/webservice da Redesim, integração via
   gov.br/conecta, API do Simples Nacional, ou qualquer convênio de integração previsto
   em Resolução do CGSIM.
2. Se NÃO existe API pública/aberta, existe algum programa oficial de credenciamento,
   convênio ou parceria (com a Receita Federal, com o CGSIM, com a Redesim, com juntas
   comerciais, ou com o Sebrae) que dê a empresas privadas acesso programático ou
   semi-automatizado a esse processo? Quais os requisitos declarados para entrar?
3. Existe alguma API oficial para as etapas ADJACENTES à abertura, mesmo que não para a
   abertura em si — por exemplo: consulta de disponibilidade/viabilidade, consulta de
   ocupações permitidas ao MEI, consulta de situação cadastral do CNPJ recém-criado,
   emissão do Certificado da Condição de Microempreendedor Individual (CCMEI)?
4. Se a resposta a tudo acima for "não existe", diga isso claramente e de forma direta.
   Não invente alternativa. Nesse caso, confirme qual é o ÚNICO canal oficial de
   formalização do MEI hoje (o Portal do Empreendedor via gov.br?) e se existe canal
   alternativo oficial (aplicativo móvel, atendimento presencial em Sala do
   Empreendedor, unidade Sebrae).

## BLOCO 2 — Quem pode abrir, e quem pode abrir POR outra pessoa

5. Quais são os requisitos legais de ELEGIBILIDADE de uma pessoa física pra se
   formalizar como MEI? Traga a lista completa com base legal, incluindo (confirme ou
   corrija cada item): não ser sócio, administrador ou titular de outra empresa; não ter
   mais de um MEI; limite de faturamento; limite de 1 empregado; a questão do servidor
   público (federal é vedado? estadual/municipal depende de legislação própria?);
   restrições para aposentados por invalidez; restrições para pensionistas ou
   beneficiários de programas sociais (BPC, Bolsa Família); situação de estrangeiro
   residente.
6. É juridicamente possível que um TERCEIRO (uma empresa de contabilidade, por exemplo)
   realize a formalização do MEI em nome do cliente? Qual o instrumento que autoriza
   isso — procuração pública, procuração particular, procuração eletrônica via e-CAC,
   ou cadastro de contador no Portal do Empreendedor?
7. Especificamente sobre a PROCURAÇÃO ELETRÔNICA do e-CAC (Receita Federal): ela cobre o
   ato de ABERTURA do MEI, ou só atos posteriores (declarações, parcelamentos,
   consultas)? Quais serviços exatamente ela habilita em relação ao MEI? Existe uma
   lista oficial de serviços procuráveis?
8. O acesso ao Portal do Empreendedor exige conta gov.br de qual nível (Bronze, Prata ou
   Ouro)? Se exige Prata/Ouro, o que a pessoa precisa fazer pra elevar o nível, e isso
   pode ser feito remotamente? Um terceiro pode operar com a conta gov.br do cliente
   (isso é permitido pelos termos de uso, ou é vedado)?
9. Existe alguma exigência de CERTIFICADO DIGITAL (e-CPF ou e-CNPJ, ICP-Brasil) em
   qualquer etapa da ABERTURA do MEI? Se não é exigido na abertura, em que momento
   posterior ele passa a ser necessário ou útil pro MEI (emissão de nota, eSocial,
   procuração, acesso a sistema de órgão)?

## BLOCO 3 — O passo a passo oficial da abertura (as fases)

10. Descreva o processo oficial de formalização do MEI em ETAPAS SEQUENCIAIS, do início
    ao fim, indicando pra cada etapa: (a) o que acontece; (b) em qual sistema/portal;
    (c) qual órgão é responsável; (d) se é instantâneo ou tem prazo; (e) se pode ser
    feito por terceiro ou só pelo titular.
11. O CNPJ do MEI é emitido NA HORA, ao final do preenchimento, ou existe prazo de
    análise/deferimento? Se é imediato, confirme com fonte oficial.
12. O MEI passa por análise de VIABILIDADE (consulta prévia de nome e endereço) como
    acontece na abertura de ME via Redesim/Junta Comercial, ou esse passo não existe
    pro MEI? Se não existe, confirme a ausência explicitamente.
13. O MEI é registrado na JUNTA COMERCIAL (JUCEMG)? Existe registro de empresário
    individual, NIRE, ou o CCMEI substitui isso? Qual a base legal?
14. Existe CONTRATO SOCIAL ou qualquer ato constitutivo a ser redigido/assinado no MEI?
    Se não existe, confirme e diga qual documento faz esse papel (CCMEI?).
15. Qual a natureza jurídica atribuída ao MEI no CNPJ (código 213-5 "Empresário
    Individual"?), e ela é escolhida pelo usuário ou preenchida automaticamente?

## BLOCO 4 — Dado por dado: exatamente o que o formulário pede

16. Liste, CAMPO A CAMPO, todos os dados que o Portal do Empreendedor exige no formulário
    de formalização do MEI. Preciso da lista literal e completa, não de um resumo. Separe
    em grupos (dados pessoais do titular, dados de contato, atividade, endereço do
    negócio, endereço residencial, dados fiscais/tributários, declarações e aceites).
    Pra cada campo, diga se é obrigatório ou opcional.
17. Especificamente sobre a ATIVIDADE: o MEI escolhe entre uma lista fechada de
    OCUPAÇÕES (não CNAEs livres). Confirme isso, diga onde essa lista oficial vive
    (Anexo XI da Resolução CGSN 140/2018?), quantas ocupações tem hoje, e como se dá o
    mapeamento ocupação → CNAE. É possível escolher mais de uma ocupação (uma principal
    + secundárias)? Qual o limite de ocupações secundárias?
18. Sobre o ENDEREÇO: o formulário pede endereço comercial e endereço residencial
    separadamente? É permitido usar o endereço residencial como endereço da empresa?
    Existe alguma validação de zoneamento/uso do solo na hora da formalização, ou isso
    é verificado só depois pelo município?
19. Sobre o NOME da empresa: o MEI tem razão social fixa (nome civil do titular + número
    do CNPJ) ou pode escolher? Pode registrar nome fantasia no ato da formalização?
20. O formulário exige informar CAPITAL SOCIAL? Se sim, existe valor mínimo ou é livre?
21. O formulário exige alguma declaração de que a pessoa não se enquadra nas vedações
    (não ser sócio de outra empresa, etc.)? Essa declaração é verificada
    automaticamente contra bases da Receita, ou é autodeclaratória sob responsabilidade
    do titular?
22. Existe algum dado exigido que a pessoa comum tipicamente NÃO tem em mãos e precisa
    buscar (número do título de eleitor, número do recibo da última declaração de IRPF,
    inscrição imobiliária/IPTU do imóvel, número de matrícula, código de acesso)?
    Liste todos.

## BLOCO 5 — Camada municipal e licenciamento (Belo Horizonte / MG)

23. Depois de obter o CNPJ, quais são as obrigações MUNICIPAIS do MEI em Belo Horizonte?
    Preciso especificamente de: inscrição municipal (CCM ou equivalente) — é automática
    via integração Redesim ou exige requerimento separado? Alvará de localização e
    funcionamento — o MEI tem alvará provisório automático, definitivo, ou dispensa?
    Qual a base legal municipal (lei/decreto de BH)?
24. Existe classificação de RISCO da atividade (baixo risco dispensado de vistoria
    prévia) aplicável ao MEI em BH? Qual a norma (Resolução CGSIM nº 51/2019 e a
    legislação municipal correspondente)? O que muda na prática entre baixo risco e
    demais níveis, pro MEI?
25. O MEI em BH precisa de inscrição estadual (SEFAZ/MG)? Em que casos (só comércio/
    indústria com ICMS, ou também serviço)? Como se solicita?
26. Existe alguma taxa municipal, estadual ou federal cobrada na ABERTURA do MEI?
    Confirme se a formalização é gratuita e se existe cobrança em qualquer etapa
    subsequente obrigatória (TFLF, taxa de alvará, taxa de licenciamento em BH).

## BLOCO 6 — Depois da abertura: o que o MEI precisa fazer pra operar de fato

27. Logo após a formalização, quais são os passos que o MEI precisa cumprir antes de
    poder emitir a primeira nota fiscal e operar legalmente? Liste em ordem.
28. O MEI precisa de algum cadastro adicional pra emitir NFS-e pelo sistema nacional
    (gov.br/nfse)? Existe etapa de adesão/credenciamento, ou o acesso é automático a
    partir do CNPJ + conta gov.br?
29. Existe algum prazo legal entre a abertura e a primeira obrigação (primeiro DAS,
    primeira declaração)? Se o MEI abre em determinado mês, quando vence o primeiro
    DAS-MEI?
30. Como o MEI obtém o CCMEI (Certificado da Condição de MEI) e o Cartão CNPJ? São
    documentos distintos? Podem ser emitidos por terceiro?

## BLOCO 7 — Erros, recusas e casos de exceção

31. Quais são os motivos mais comuns de BLOQUEIO ou RECUSA na formalização do MEI
    (segundo fonte oficial): CPF irregular na Receita, pendência de declaração de IRPF,
    já ser sócio de outra empresa, ocupação não permitida, endereço inválido? Traga a
    lista com o que a fonte oficial informa e, se possível, a mensagem/erro
    correspondente.
32. Se a pessoa já tem um CNPJ (de ME ou de outro MEI), o que acontece? Existe processo
    de conversão/migração, ou ela precisa baixar/alterar o anterior primeiro?
33. É possível ABRIR um MEI já com ocupação que exija registro em conselho profissional
    ou licença específica? Ou essas ocupações estão simplesmente fora da lista do MEI?
34. Depois de aberto, qual o prazo e o processo pra ALTERAR dados (ocupação, endereço,
    nome fantasia)? É gratuito? Pode ser feito por terceiro?

## BLOCO 8 — Comparativo direto MEI × ME (Simples Nacional)

35. Monte uma tabela comparando o processo de abertura de MEI × abertura de ME optante
    pelo Simples Nacional, nas seguintes dimensões: canal/portal usado, necessidade de
    consulta de viabilidade, registro em Junta Comercial, ato constitutivo, exigência de
    contador, custo/taxas, prazo até o CNPJ, necessidade de certificado digital,
    inscrição municipal, alvará.
36. Existe alguma etapa presente na abertura de ME que simplesmente NÃO EXISTE no MEI?
    E o contrário — alguma etapa exclusiva do MEI que não existe no ME?

Formato de saída: 1 seção por bloco, respondendo cada pergunta numerada, sempre com a fonte
específica (órgão + norma + artigo, com link se disponível). Nos blocos 4 e 8, use listas e
tabelas literais, não texto corrido — preciso poder transformar isso diretamente em campos
de formulário e etapas de sistema. Onde não achar fonte oficial, escreva claramente "não
encontrei fonte oficial" em vez de preencher com estimativa.
```

## O que fazer com o resultado

Colar de volta na sessão. A partir daí:
1. Cruzo com o flow atual (`execucao/flow/flow-data.mjs`, nós E1→C7→A5) — o que reaproveita, o que bifurca, o que é tela nova.
2. Viro documentação fonte-primária (mesmo padrão de [[mei-obrigacoes-operacionais]]).
3. Adapto/crio o ramo MEI do flow de constituição, com as telas e a captação de dado que a pesquisa apontar.

## Contexto do flow atual (pra referência ao cruzar)

Hoje o flow de constituição de **ME** coleta, nesta ordem: C0 atividade/CNAE · C1 dados do sócio · C2 vínculo INSS · C3 sócios · C4 dados da empresa · C5 CNAE secundários · C6 natureza jurídica · C7 nome/razão social → A1 revisar · A2 termo irreversível · A3 painel de status · A3.2 certificado digital · A4 assinatura dos sócios · A5 home dia-1.

**Hipóteses a confirmar/derrubar com a pesquisa:** no MEI, C3 (sócios) e C6 (natureza jurídica) provavelmente somem; C7 (nome) provavelmente vira só nome fantasia; C5 (CNAE secundários) vira ocupações secundárias com limite; A4 (assinatura) provavelmente some; A3 (painel de espera) pode sumir se o CNPJ sai na hora — o que mudaria bastante a experiência (e a percepção de valor do que a gente cobra).

## Links
- [[prompt-pesquisa-mei-obrigacoes-27-08]] — prompt irmão (obrigações depois de aberto).
- [[mei-obrigacoes-operacionais]] · [[mei-mapeamento-funcionalidades]]
- `produto/me/entrar/constituir/processo-abertura-empresa-bh.md` — o equivalente já mapeado pro ME.
- `produto/me/entrar/constituir/orgaos-sistemas-abertura-bh.md` — órgãos/sistemas do processo de ME.
