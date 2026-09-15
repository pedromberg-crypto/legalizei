---
tipo: referencia
status: vivo
data: 2026-09-14
assunto: prompt-lacunas-motor-fiscal
tags: [pesquisa, prompt, gemini, fiscal, motor]
---

# 🔎 Prompt de pesquisa — as 3 lacunas do motor fiscal

> 🧭 **Como usar:** colar no **Gemini com Google Search**, o Pedro roda fora e cola o retorno. Não pesquisar direto na sessão ([[legalize-pesquisa-grande-via-gemini]]).
>
> 🎯 **Por que existe:** o apurador (`execucao/motor-fiscal/apurador.mjs`) nasceu em 14/09 batendo com a Receita ao centavo, e declarou 3 lacunas no próprio código. Estas são elas. A **L1 bloqueia hoje**: o motor recusa `rbt12 = 0` em vez de chutar, e isso atinge todo cliente no 1º ano — que é a maioria, porque o produto nasce da constituição.
>
> 🔒 **O prompt carrega o escopo travado dentro dele.** Sem isso a resposta vem genérica (comércio, Lucro Presumido, Anexo I, EPP) e não serve. Fonte do escopo: `execucao/processos/_persona.mjs` e `_escopo.mjs`.

---

## O prompt

```
Você é um especialista em Simples Nacional. Responda em português do Brasil,
com fonte primária e citação literal do dispositivo legal.

═══════════════════════════════════════════════════════════════════
CONTEXTO TRAVADO — responda SOMENTE dentro deste recorte
═══════════════════════════════════════════════════════════════════

A empresa é sempre:
· Microempresa (ME) optante pelo Simples Nacional
· Anexo III ou Anexo V (com ou sem Fator R), NUNCA Anexo I, II ou IV
· Prestadora de SERVIÇO, nunca comércio, nunca indústria
· Atividade NÃO regulamentada (sem conselho de classe)
· Sediada em Belo Horizonte ou em Minas Gerais
· De 1 a 4 sócios, todos pessoa física domiciliados no Brasil
· Sem clientes no exterior e sem sócios no exterior
· Pode ter funcionário CLT, mas o caso padrão é sem nenhum

NÃO responda sobre: Lucro Presumido, Lucro Real, MEI, EPP como regime
permanente, comércio, indústria, ICMS, substituição tributária,
atividades regulamentadas, empresas com sócio pessoa jurídica.

Se alguma pergunta só fizer sentido fora deste recorte, DIGA ISSO em vez
de responder por analogia.

═══════════════════════════════════════════════════════════════════
FORMATO OBRIGATÓRIO DE CADA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. A resposta direta, em uma frase
2. O DISPOSITIVO LEGAL: lei/resolução, artigo, parágrafo e inciso
3. A CITAÇÃO LITERAL do texto legal, entre aspas, sem paráfrase
4. A DATA DE VIGÊNCIA e se houve alteração recente
5. GRAU DE CONFIANÇA: alta (texto legal na mão) / média (fonte
   secundária oficial) / baixa (interpretação)
6. Um EXEMPLO NUMÉRICO com os números que eu der abaixo

Não use tabela de blog, portal de contabilidade nem material de
concorrente como fonte primária. Se só houver isso, marque confiança
baixa e diga qual dispositivo precisaria ser lido.

═══════════════════════════════════════════════════════════════════
PERGUNTA 1 — RBT12 DE EMPRESA EM INÍCIO DE ATIVIDADE  🔴 BLOQUEIA
═══════════════════════════════════════════════════════════════════

Base: Resolução CGSN nº 140/2018, art. 24 (e os parágrafos que tratam
de início de atividade), além da LC 123/2006 art. 18.

1.1 Qual a fórmula EXATA do RBT12 nos primeiros 12 meses de atividade?
    Quero as três situações separadas:
    (a) o PRIMEIRO mês de atividade
    (b) do 2º ao 12º mês
    (c) a partir do 13º mês

1.2 Na média dos meses anteriores, a receita do PRÓPRIO mês que está
    sendo apurado entra no cálculo, ou só os meses já encerrados?

1.3 🔴 Mês com receita ZERO entra na média como zero, ou é excluído do
    divisor? Isso muda a alíquota e eu não posso deduzir.

1.4 🔴 Qual data marca o "início de atividade" para esta contagem?
    Existem três datas diferentes numa constituição real, e preciso
    saber qual delas manda:
    (a) a data de assinatura do contrato social
    (b) a data do registro na Junta Comercial
    (c) a data de início de atividades declarada no CNPJ/DBE
    Se forem datas distintas, qual prevalece e por quê?

1.5 A mesma regra de anualização vale para a FOLHA no cálculo do
    Fator R (Res. CGSN 140/2018 art. 26 §4º)? A fórmula é idêntica à
    da receita, ou muda em algum ponto?

EXEMPLO NUMÉRICO PARA 1.1 A 1.4 — use estes números reais:
Empresa constituída em dezembro/2025. Receita mensal, em reais:
dez/25: 0 · jan/26: 0 · fev: 12.000 · mar: 12.000 · abr: 12.000 ·
mai: 0 · jun: 0 · jul: 0 · ago: 7.910
Pergunto: qual o RBT12 e qual a alíquota efetiva aplicáveis na
competência de AGOSTO/2026? Mostre a conta.

═══════════════════════════════════════════════════════════════════
PERGUNTA 2 — ISS RETIDO NA FONTE PELO TOMADOR
═══════════════════════════════════════════════════════════════════

Base: LC 116/2003 art. 3º e art. 6º · LC 123/2006 art. 21 §4º ·
legislação municipal de Belo Horizonte.

2.1 Quando o tomador retém o ISS, o prestador optante pelo Simples
    DEDUZ esse valor do DAS, ou paga o DAS cheio e o ISS retido é
    tributo a mais?

2.2 Como a retenção é informada no PGDAS-D? Existe campo próprio? O
    valor do DAS gerado muda, ou só a composição interna dele?

2.3 🔴 No nosso caso concreto: a empresa é de Belo Horizonte e presta
    serviço para um tomador em OUTRO município de Minas Gerais.
    Quem retém, para qual município o ISS é devido, e o que muda no
    DAS da empresa?

2.4 Quais situações tornam a retenção OBRIGATÓRIA (e não opcional)
    para serviços de consultoria, publicidade, TI, design, ensino e
    tradução — que são as atividades do nosso recorte?

2.5 Belo Horizonte tem regra municipal própria de retenção que vá além
    da LC 116? Se sim, qual a lei e o que ela acrescenta?

EXEMPLO NUMÉRICO: mesma empresa, Anexo III, faixa 1 (alíquota efetiva
6%), receita de R$ 7.910 no mês, ISS retido pelo tomador. Quanto sai
de DAS e quanto sai de ISS? Mostre as duas contas, com e sem retenção.

═══════════════════════════════════════════════════════════════════
PERGUNTA 3 — SUBLIMITE ESTADUAL
═══════════════════════════════════════════════════════════════════

Base: LC 123/2006 art. 19 e art. 20.

3.1 Qual o valor do sublimite vigente em MINAS GERAIS em 2026, e qual
    o ato que o fixou?

3.2 🔴 A pergunta que decide se isto entra no nosso produto: uma
    empresa de porte ME, cujo teto de receita é R$ 360.000/ano, pode
    em ALGUMA hipótese ser alcançada pelo sublimite? Se a resposta for
    não, diga "não se aplica ao porte ME" explicitamente — é uma
    resposta válida e eu preciso dela por escrito.

3.3 Se a empresa ultrapassar o teto do ME durante o ano e passar a
    EPP, em que momento o sublimite passa a valer, e o que muda no
    recolhimento do ISS?

3.4 O sublimite tem efeito sobre o ISS de empresa de SERVIÇO, ou só
    sobre o ICMS de comércio e indústria? (Preciso saber se a pergunta
    3 é sequer relevante para nós.)

═══════════════════════════════════════════════════════════════════
FECHAMENTO
═══════════════════════════════════════════════════════════════════

Ao final, liste em uma seção separada:
· Qualquer ponto em que você respondeu por interpretação e não por
  texto legal literal
· Qualquer alteração legislativa de 2025 ou 2026 que afete as três
  perguntas
· O que você NÃO conseguiu confirmar em fonte primária
```

---

## O que fazer com o retorno

1. **Salvar o texto literal** em `pesquisa/` com a data, antes de parafrasear ([[legalize-leitura-integral-documento]]).
2. **Cada número entra com fonte e confiança.** Número sem dispositivo legal não vira código.
3. **A L1 vira implementação direta** no `apurador.mjs`: hoje a função `aliquotaEfetiva` lança erro com `rbt12 = 0`, e o erro cita a lacuna.
4. **Se a 3.2 voltar "não se aplica ao porte ME"**, a L3 fecha sem virar código — e isso é ganho, não perda.
5. ⚠️ **A 1.4 conversa com um achado nosso:** a persona zero tem **três datas** (01/12 admissão do sócio · 11/12 assinatura e efeitos · 12/12 Junta e CNPJ), e os itens **44**, **45** e **46** de [[PENDENCIAS]] já mandam guardá-las separadas. A resposta diz qual delas o motor usa.

## Links
[[PENDENCIAS]] · [[PERSONA]] · [[anexo-iii-simples]] · [[anexo-v-simples]] · [[legalize-pesquisa-grande-via-gemini]]
