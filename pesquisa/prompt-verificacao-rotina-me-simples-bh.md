---
tipo: prompt-pesquisa
status: pronto-pra-rodar
data: 2026-09-09
assunto: verificacao-rotina-me-simples-bh
tags: [pesquisa, prompt, gemini, verificacao, fiscal, nfse, esocial, bh]
---

# 🔎 Prompt — VERIFICAÇÃO dos dados-base do Simples Nacional

> **O que é:** segunda rodada sobre [[2026-09-09-rotina-me-simples-bh]]. A primeira trouxe bastante coisa boa, mas com base legal não conferida, um número desatualizado e uma seção ilegível. Este prompt **não pede pesquisa nova**: pede que cada afirmação seja confirmada ou derrubada **em fonte primária, com citação literal do dispositivo**.
>
> **Por que importa:** essas afirmações vão virar regra de código (calendário de vencimento, cálculo de Fator R, escolha de fornecedor de NFS-e). Errar aqui não é errar um texto: é gerar guia na data errada e multa pro cliente.
>
> **Como usar:** colar o bloco abaixo no Google Search Pro do Gemini.

---

## O prompt (copiar daqui pra baixo)

```
Você é um auditor de conformidade tributária. Sua tarefa NÃO é escrever um
relatório novo: é VERIFICAR afirmações específicas, uma por uma, em fonte
primária, e me dizer quais estão certas e quais estão erradas.

# CONTEXTO
As afirmações abaixo vieram de uma pesquisa anterior e vão virar regra de
software de contabilidade. O perfil é: Microempresa (ME) optante pelo Simples
Nacional, PRESTADORA DE SERVIÇO, sediada em BELO HORIZONTE/MG, Anexo III ou V,
1 ou 2 sócios com pró-labore, de zero a poucos empregados CLT.

# COMO RESPONDER (formato obrigatório)
Para CADA item numerado, responda exatamente nesta estrutura:

  VEREDITO: CONFIRMADO / PARCIALMENTE CORRETO / INCORRETO / NÃO ENCONTRADO
  FONTE: nome do ato normativo, número, artigo e data de publicação
  CITAÇÃO: o trecho literal do dispositivo que sustenta o veredito
  O QUE MUDA: se for parcial ou incorreto, qual é a informação correta
  VIGÊNCIA: a regra está em vigor hoje? Tem data de mudança marcada?

Se não encontrar fonte primária, escreva NÃO ENCONTRADO. **Não preencha com
fonte secundária (blog, portal de notícia, site de escritório de contabilidade)
sem avisar que é secundária.** Prefiro um "não encontrado" a uma citação frágil.

# AS AFIRMAÇÕES A VERIFICAR

## Bloco 1 — Prazos e deslocamento de datas

1. O DAS do Simples Nacional vence no dia 20 do mês seguinte ao da apuração, e
   quando o dia 20 cai em sábado, domingo ou feriado bancário o prazo é
   PRORROGADO para o primeiro dia útil seguinte. Fonte alegada: Resolução CGSN
   nº 140/2018, art. 40, caput e § 3º.

2. Para FGTS, IRRF e contribuição previdenciária (DCTFWeb), o vencimento também
   é dia 20, mas quando cai em dia não útil o prazo é ANTECIPADO para o dia útil
   anterior. Ou seja, a regra de deslocamento é OPOSTA à do DAS.

3. A transmissão dos eventos periódicos do eSocial e da DCTFWeb vence no dia 15
   do mês seguinte, com antecipação em dia não útil.

4. A DEFIS é anual, com prazo até 31 de março do ano seguinte.

## Bloco 2 — Multas e exclusão

5. O atraso no PGDAS-D gera multa de 2% ao mês sobre os tributos apurados,
   limitada a 20%, com valor mínimo de R$ 50,00 por competência.

6. O atraso na DEFIS gera multa mínima de R$ 200,00, mais R$ 100,00 por grupo
   de 10 informações omitidas ou incorretas.

7. O atraso na DCTFWeb gera multa mínima de R$ 200,00 quando sem movimento e
   R$ 500,00 quando há remuneração declarada.

8. No processo de Exclusão do Simples Nacional por débitos: a ciência do Termo
   de Exclusão é presumida em 45 dias da disponibilização no domicílio
   tributário eletrônico, e a empresa tem 90 dias para regularizar antes de a
   exclusão produzir efeitos.

9. Existe uma Resolução CGSN nº 183/2025 que teria endurecido a aplicação
   automática de multa por atraso no PGDAS-D a partir de 2026. Esta resolução
   existe? Se sim, o que ela determina exatamente?

## Bloco 3 — NFS-e em Belo Horizonte (o item mais importante desta lista)

10. As Portarias SMFA nº 075/2025 e nº 088/2025, da Prefeitura de Belo
    Horizonte, obrigam TODAS as pessoas jurídicas prestadoras de serviço
    estabelecidas no município a emitir NFS-e exclusivamente pelo Emissor
    Nacional a partir de 1º de janeiro de 2026. Estas portarias existem? Qual o
    texto exato e o cronograma? O BHISS Digital foi descontinuado para este
    perfil, ou ainda funciona em paralelo?

11. Existe uma Resolução CGSN nº 191 que teria obrigado ME e EPP a adotar o
    Emissor Nacional de NFS-e. Ela existe? Qual o número correto e o que ela
    determina?

12. O cancelamento de NFS-e em Belo Horizonte pode ser feito por API em até 730
    dias (2 anos) da emissão, condicionado a: inscrição municipal regular, CPF
    ou CNPJ do tomador preenchido na nota, e ausência de bloqueio da autoridade
    fiscal. Fonte alegada: Portaria SMFA nº 075/2025, art. 5º.

13. Uma empresa recém-aberta em BH fica IMPEDIDA de emitir nota fiscal enquanto
    a Inscrição Municipal estiver com situação "inapta" ou "suspensa", e isso é
    um bloqueio real na API. Confirme, e explique: qual é o procedimento exato
    para regularizar a Inscrição Municipal em BH, quanto tempo leva, o que é
    exigido, e se existe AIDF (ou equivalente digital) separado disso.

14. A Prefeitura de BH DISPENSA os prestadores optantes pelo Simples Nacional
    da entrega da DES (Declaração Eletrônica de Serviços).

## Bloco 4 — Fator R

15. O Fator R é a Folha de Salários dos últimos 12 meses dividida pela Receita
    Bruta dos últimos 12 meses; se o resultado for igual ou maior que 28%, as
    receitas do mês corrente são tributadas pelo Anexo III em vez do Anexo V.
    A verificação é MENSAL, não anual. Fonte alegada: Resolução CGSN nº 140/2018,
    art. 26.

16. ENTRAM no numerador do Fator R: salários de empregados CLT, pró-labore dos
    sócios, 13º salário, férias e o terço constitucional, FGTS dos empregados,
    e a Contribuição Previdenciária Patronal.

17. NÃO ENTRAM no numerador: distribuição de lucros aos sócios, pagamentos a
    autônomos, pagamentos a prestadores PJ, PAT, e bolsa de estagiário.

18. Confirme os itens 16 e 17 um a um, porque cada inclusão indevida gera Fator
    R falso, mudança indevida de anexo e autuação. Diga também se há algum item
    controverso ou com entendimento divergente da Receita.

## Bloco 5 — O que o certificado e-CNPJ A1 permite (bloco técnico)

Aqui preciso de documentação TÉCNICA (manual de integração, portal do
desenvolvedor, documentação de web service), não de artigo explicativo.

19. Com o certificado e-CNPJ A1 da própria empresa, um software de terceiro
    pode transmitir eventos ao eSocial (S-1200, S-1299) via web service, sem
    procuração eletrônica adicional? Qual a documentação oficial disso?

20. O mesmo para: DCTFWeb (transmissão e emissão do DARF), FGTS Digital
    (emissão da guia com QR Code Pix) e PGDAS-D (transmissão da apuração e
    geração do DAS).

21. **CRÍTICO:** existe API OFICIAL para transmitir a apuração do PGDAS-D e
    gerar o DAS? Ou o PGDAS-D só existe como portal web, exigindo automação de
    navegador? Se existir API, ela é do Serpro (Integra Contador)? Qual o custo
    por chamada e o modelo de contratação?

22. O que o Serpro "Integra Contador" cobre exatamente hoje? Liste os serviços
    disponíveis, o preço, e se exige procuração e-CAC ou aceita o A1 da própria
    empresa.

23. Existe API oficial para o Emissor Nacional de NFS-e? Qual a documentação
    (Swagger, manual de integração), como é a autenticação, e ela é gratuita?

## Bloco 6 — Reforma tributária (a parte que ficou ilegível antes)

Responda de forma DIRETA e curta, sem prosa.

24. A LC 214/2025 mantém o Simples Nacional para ME prestadora de serviço?

25. Existe a opção de a empresa do Simples apurar CBS e IBS "por fora" do DAS
    (o chamado Simples Híbrido), para gerar crédito ao cliente B2B?

26. **URGENTE:** a janela para exercer essa opção em 2026 seria de 1º a 30 de
    SETEMBRO de 2026, com efeitos em 2027. Isso está correto? Qual a fonte, e o
    prazo já passou ou está aberto? Se estiver aberto, o que exatamente a
    empresa precisa fazer, e onde?

27. A DEFIS será extinta e absorvida pelo PGDAS-D a partir de 2027?

28. O que muda na NOTA FISCAL de serviço do Simples entre 2026 e 2027 (novos
    campos, novo layout, destaque de CBS/IBS)? Um app precisa mudar o emissor?

## Bloco 7 — Lacunas que a pesquisa anterior não cobriu

29. Qual o valor do salário mínimo vigente em 2026? (A pesquisa anterior usou
    R$ 1.412,00, que é de 2024.)

30. Como funciona a competência "sem movimento": o que a empresa precisa
    declarar no mês em que não fatura nada, e no ano inteiro sem faturamento?

31. Empresa aberta no meio do mês: qual é a primeira obrigação, e a partir de
    qual competência ela declara?

32. Quem é obrigado a reter ISS na fonte em Belo Horizonte, e em que casos o
    prestador do Simples sofre a retenção? Como isso é informado no PGDAS-D
    para não gerar bitributação? Fonte alegada: Lei Municipal 8.725/2003, art. 20.

33. Como funciona o domicílio tributário eletrônico (DTE-SN federal e o
    equivalente municipal de BH): um software pode consultar as mensagens
    automaticamente com o A1, ou exige login humano? Essa é a caixa onde chega
    o Termo de Exclusão do item 8, então é crítica.

34. Existem obrigações ESTADUAIS (SEF-MG) para prestador de serviço sediado em
    BH que não presta serviço sujeito a ICMS? Ou ele é totalmente isento de
    obrigação estadual?

# REGRA FINAL

Se em algum ponto você discordar da afirmação original, diga isso com todas as
letras e explique por quê. Eu prefiro descobrir agora que a pesquisa anterior
errou do que descobrir depois de codificar. Não tente ser gentil com a fonte
anterior.

Português do Brasil, sem prosa ornamental. Tabelas e listas.
```

---

## As 34 afirmações, e por que cada bloco existe

| Bloco | O que valida | Por que importa pro app |
|---|---|---|
| **1. Prazos** | dia 20 prorroga (DAS) × antecipa (FGTS/DARF); eSocial dia 15 | Vira **regra de código** do calendário. Errar aqui gera guia na data errada e multa pro cliente |
| **2. Multas e exclusão** | valores mínimos, prazo de 45 + 90 dias | Alimenta a vigília preditiva (item 5.4). Alerta sem prazo certo é alerta que assusta à toa |
| **3. NFS-e em BH** | 🔥 as portarias que obrigam o **Emissor Nacional** desde 01/01/2026 | **Decide o fornecedor.** Se procede, não integramos BHISS nem agregador: é API nacional única com o A1. Muda o item 3.1 da matriz |
| **4. Fator R** | o que entra e o que não entra na folha | Vira **fórmula no `lib/fiscal.ts`**. Incluir lucro isento por engano gera anexo errado e multa de ofício de 75% |
| **5. Certificado A1** | o que dá pra fazer sem procuração, e **se o PGDAS-D tem API** | O item 21 é o mais decisivo de todos: se o PGDAS-D não tem API, gerar o DAS vira automação de navegador, que não escala |
| **6. Reforma** | a janela de setembro de 2026 | Se estiver aberta, é **este mês**. E a pesquisa anterior ficou ilegível justamente aqui |
| **7. Lacunas** | sem movimento, primeiro mês, retenção de ISS, domicílio eletrônico, estadual | Casos que o app vai encontrar no primeiro cliente e que ninguém mapeou |

## O que muda dependendo da resposta

- **Item 10 CONFIRMADO** → o item 3.1 da matriz de dependência sai de 🟡 com 5 candidatos para 🟢 com um caminho só (Emissor Nacional). Economiza a pesquisa de fornecedor de NFS-e inteira.
- **Item 21 NEGATIVO** (PGDAS-D sem API) → o item 2.2 vira o maior risco técnico do produto, e "gerar a guia do DAS" deixa de ser automatizável de verdade.
- **Item 26 ABERTO** → decisão comercial urgente com o Mauro, neste mês.
- **Itens 16 e 17** → viram teste unitário do cálculo de Fator R.

## Links
- [[2026-09-09-rotina-me-simples-bh]] (a pesquisa verificada) · [[prompt-pesquisa-rotina-me-simples-bh]] (o prompt que a gerou) · [[funcionalidades-me-simples]] · [[fiscal-simples-bh-2026]] · [[HOME]]
