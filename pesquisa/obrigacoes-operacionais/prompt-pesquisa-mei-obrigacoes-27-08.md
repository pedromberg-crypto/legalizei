---
tipo: prompt-externo
status: vivo
data: 2026-08-28
assunto: prompt-pesquisa-mei-obrigacoes
tags: [pesquisa, mei, fiscal, trabalhista, prompt-gemini]
---

# 🔎 Prompt de pesquisa (Google Search / Gemini Pro) — obrigações operacionais do MEI

> Rodar fora desta sessão (Gemini Pro, Google Search ativo), colar o resultado de volta aqui. Mesmo padrão do resto do vault (`legalize-pesquisa-grande-via-gemini`, e o prompt irmão que já rendeu `pesquisa/cnae-matriz/resultado-pesquisa-fundamentos-cnae-27-08.md`).
>
> **Por que existe:** já rodei uma pesquisa própria (3 frentes, WebSearch/WebFetch) sobre as obrigações mensais/anuais do MEI e o que muda pro ME depois. A maioria fechou com fonte oficial direta, mas sobrou um punhado de pontos com fonte fraca ou nenhuma (marcados 🟡/🔴 abaixo, dentro dos blocos). Este prompt cobre o assunto INTEIRO de novo (não só os gaps) — pra cruzar tudo, confirmar o que já achei e fechar o que ficou pendente.

## Prompt (copiar tudo abaixo)

```
Preciso de uma pesquisa técnica sobre as obrigações fiscais e trabalhistas mensais e
anuais do MEI (Microempreendedor Individual) no Brasil, incluindo o que muda quando a
empresa deixa de ser MEI e vira ME optante pelo Simples Nacional. Este material vai virar
a base de um sistema real que vai gerenciar essas obrigações pra clientes de verdade, então
a EXIGÊNCIA DE FONTE é máxima: use SOMENTE fontes de altíssima confiabilidade — Receita
Federal (gov.br/receitafederal), Portal gov.br/empresas-e-negocios, Comitê Gestor do Simples
Nacional (CGSN) e suas Resoluções, Lei Complementar 123/2006 e alterações, eSocial
(gov.br/esocial), Caixa Econômica Federal / FGTS Digital (gov.br/trabalho-e-emprego),
CLT (planalto.gov.br), Portarias do Ministério do Trabalho, Diário Oficial da União. NÃO
use blogs de contabilidade, sites de escritórios privados, Jusbrasil, Reclame Aqui ou
fóruns — se a única fonte que achar for desse tipo, diga explicitamente que não achou
fonte oficial, não cite a fonte não-oficial como se fosse válida. Toda afirmação numérica
ou de regra precisa vir com a fonte (nome do órgão + lei/resolução/artigo específico, com
link se possível) ou ser marcada como "não encontrei fonte oficial pra isso".

Preciso de respostas estruturadas pros seguintes blocos:

## BLOCO 1 — Obrigação contábil e guarda de documento (MEI)
1. Confirme a base legal exata que dispensa o MEI de escrituração contábil/fiscal
   completa (é o art. 106, §1º da Resolução CGSN nº 140/2018?).
2. Existe alguma exigência formal de "livro caixa" ou controle mínimo de receita
   específica pro MEI (diferente da exigência de livro-caixa que vale pra ME/EPP geral,
   arts. 26 §2º e 27 da LC 123/2006)? Se não existe pro MEI, confirme essa ausência.
3. Qual o prazo de guarda obrigatório de nota fiscal (emitida e recebida) pro MEI —
   é o prazo decadencial tributário padrão (5 anos, CTN art. 173/150 §4º) ou existe
   norma específica?

## BLOCO 2 — DAS-MEI (guia mensal)
4. Confirme os valores vigentes em 2026 do DAS-MEI: INSS (5% sobre o salário mínimo
   vigente, hoje R$1.621 → R$81,05?), ICMS (R$1,00 fixo, comércio/indústria) e ISS
   (R$5,00 fixo, serviço). Confirme se um MEI de serviço PURO paga só INSS+ISS
   (R$86,05/mês) sem o ICMS.
5. Data de vencimento: confirme se é sempre dia 20 do mês subsequente. Se o dia 20
   cair em sábado, domingo ou feriado nacional, a data antecipa ou posterga? Qual a
   fonte oficial exata dessa regra (resolução do CGSN, portaria)?
6. Qual o percentual EXATO de multa e juros de mora por atraso no pagamento do
   DAS-MEI? Base legal específica (não a regra geral de tributos federais, se houver
   regra própria do Simples/MEI).

## BLOCO 3 — Emissão de Nota Fiscal (MEI)
7. Confirme a regra oficial: venda/serviço pra pessoa física dispensa nota fiscal
   (salvo pedido do cliente); venda/serviço pra pessoa jurídica EXIGE nota fiscal
   sempre. Fonte exata (Resolução CGSN, art. 106 §1º?).
8. O portal nacional de NFS-e (gov.br/nfse) já foi adotado pela Prefeitura de Belo
   Horizonte? Existe uma data de adesão anunciada? Se BH ainda usa sistema próprio
   (BHISS Digital ou equivalente), confirme isso também.
9. Existe alguma diferença na obrigatoriedade de nota fiscal dependendo do tipo de
   atividade (serviço vs comércio) além do que já foi perguntado no item 7?

## BLOCO 4 — DASN-SIMEI (declaração anual)
10. Confirme o nome oficial e o prazo (31 de maio do ano seguinte) da declaração
    anual do MEI.
11. O formulário da DASN-SIMEI em si pede a separação entre receita bruta recebida
    de PESSOA FÍSICA e de PESSOA JURÍDICA, ou essa separação só existe no "Relatório
    Mensal de Receitas Brutas" (preenchimento mensal, não a declaração anual)? Preciso
    entender exatamente ONDE esse dado (PF x PJ) é reportado oficialmente.
12. Qual o percentual EXATO de multa por atraso ou omissão na entrega da DASN-SIMEI?
    Existe um valor mínimo e um teto (ex: 2% ao mês, limitado a 20% do total ou
    mínimo de R$50)? Base legal específica.
13. Quais as consequências práticas de não entregar a DASN-SIMEI (bloqueio de
    certidão negativa, impedimento de baixa da empresa, outra penalidade
    administrativa)?

## BLOCO 5 — Teto de faturamento e desenquadramento (MEI)
14. Confirme o valor ATUAL (segunda metade de 2026) do teto anual de faturamento do
    MEI — ainda é R$81.000/ano (LC 123 art. 18-A)? O PLP 186/2026 (que propõe elevar
    pra R$110k/R$140k) já foi sancionado como lei, ou continua em tramitação? Data da
    última movimentação legislativa que encontrar.
15. Confirme a fórmula exata de proporcionalidade do teto pra quem abre o MEI no meio
    do ano (R$6.750 × número de meses de atividade, contando o mês de abertura como
    mês inteiro mesmo se abriu no último dia?).
16. Confirme com base legal EXATA (artigo/resolução) a regra de desenquadramento:
    (a) excesso de até 20% do teto → desenquadramento só a partir de 1º de janeiro do
    ano SEGUINTE, sem juros/multa sobre a diferença; (b) excesso acima de 20% →
    desenquadramento retroativo (à data de abertura, se ocorrer no próprio ano de
    abertura; ou a 1º de janeiro do ano-calendário, se ocorrer em ano subsequente),
    com incidência de juros e multa sobre a diferença de tributos devidos como ME.
17. Existe alguma ferramenta oficial do governo (Portal do Empreendedor, app MEI,
    e-CAC) que monitore e alerte o MEI sobre a proximidade do teto de faturamento
    durante o ano, ou isso é inteiramente manual/responsabilidade do contribuinte?

## BLOCO 6 — MEI com o único funcionário permitido
18. Confirme a base legal exata do limite de 1 empregado pro MEI (LC 123, art. 18-C).
19. Confirme a alíquota de CPP (Contribuição Patronal Previdenciária) REDUZIDA de 3%
    que o MEI paga sobre a folha desse empregado (em vez dos 20% do regime geral).
    Encontre a fonte primária exata — é o Ato Declaratório Executivo CODAC nº 49/2009?
    Ainda está em vigor em 2026, ou foi substituído por norma mais recente?
20. Confirme que o MEI-empregador usa o Módulo Simplificado do eSocial (o mesmo do
    empregador doméstico) e liste os eventos obrigatórios (admissão, folha mensal,
    férias, afastamento, desligamento) com o prazo de cada um.
21. Confirme que o FGTS (8% sobre a remuneração) do empregado do MEI é recolhido via
    guia gerada pelo próprio eSocial (DAE), e NÃO pelo "FGTS Digital" (a modernização
    que atinge empresas em geral desde 2024/2025) — ou seja, MEI ficou fora dessa
    migração? Confirme com fonte da Caixa ou do Ministério do Trabalho.
22. A guia do MEI-empregador é única (INSS 3% + FGTS 8% + IRRF, se houver retenção)?
    Confirme o vencimento (dia 20 do mês seguinte à competência) e a regra de
    antecipação/postergação se cair em dia não útil.
23. Confirme os prazos exatos: 13º salário (1ª parcela até 30/11, 2ª até 20/12);
    aviso de férias (mínimo 30 dias de antecedência, CLT art. 135) e pagamento (até
    2 dias antes do início do período, com 1/3 constitucional); exame admissional
    (antes do início do trabalho, CLT art. 168); exame demissional (prazo de 10 dias
    contados da rescisão — confirme se ainda é a Portaria MTE nº 1.031/2018 que rege
    isso, ou se foi atualizada).

## BLOCO 7 — O que muda no ME/Simples Nacional com mais de 1 empregado
24. Confirme que a CPP no Simples Nacional geral (não-MEI) é EMBUTIDA na alíquota do
    DAS pros Anexos I, II, III e V (uma guia só, sem GPS/DARF separado pra folha), e
    que APENAS o Anexo IV tem CPP separada (20% sobre a folha, via DCTFWeb/DARF).
    Fonte exata da Receita Federal.
25. Confirme que o Fator R decide entre Anexo III e V, mas NÃO muda a mecânica de CPP
    entre eles (os dois têm CPP embutida no DAS) — só o Anexo IV é diferente nesse
    ponto.
26. Confirme que não existe teto de NÚMERO de empregados pro ME/Simples (diferente do
    MEI, travado em 1) — o único teto é de faturamento (LC 123, art. 3º: R$4,8
    milhões/ano).
27. Existe alguma obrigação trabalhista adicional que só passa a valer a partir de um
    certo NÚMERO de empregados (ex: CIPA — Comissão Interna de Prevenção de Acidentes
    — obrigatória a partir de quantos empregados, conforme NR-5, e isso depende do
    grau de risco da atividade)? Traga o limiar exato se encontrar, por grau de risco.

Formato de saída: 1 seção por bloco, respondendo cada pergunta numerada, sempre com a
fonte específica (órgão + norma + artigo, e link se disponível). Onde não achar fonte
oficial, escreva claramente "não encontrei fonte oficial" em vez de preencher com
estimativa ou fonte fraca.
```

## O que fazer com o resultado

Cola o resultado de volta nesta conversa — a partir daí cruzo com a pesquisa própria já feita (3 frentes, WebSearch/WebFetch, 27-28/08) e fechamos juntos o que confirma, o que corrige e o que ainda fica pendente. Depois disso vira documentação fonte-primária (mesmo padrão do CNAE) + mapeamento de funcionalidade pro portal MEI.

## Links
- `pesquisa/cnae-matriz/prompt-pesquisa-fundamentos-cnae-anexos-mei.md` — mesmo padrão, assunto irmão (fundamentos de CNAE).
- `app/src/lib/fiscal.ts` — motor que vai consumir esses dados quando virarem produto.
