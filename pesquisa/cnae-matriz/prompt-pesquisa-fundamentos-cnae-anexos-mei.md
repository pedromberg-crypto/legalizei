---
tipo: operacao
status: vivo
data: 2026-08-27
assunto: prompt-pesquisa-cnae-anexos-mei
tags: [pesquisa, cnae, fiscal, simples-nacional, mei, prompt-gemini]
---

# 🔎 Prompt de pesquisa (Google Search / Gemini Pro) — fundamentos de CNAE, Anexos III/V, Fator R e MEI

> Rodar fora desta sessão (Gemini Pro, Google Search ativo), colar o resultado de volta aqui. Mesmo padrão do resto do vault (`legalize-pesquisa-grande-via-gemini`). **Esta pesquisa é a base pra reclassificar de verdade a `cnae-matriz/` — ela é guia E validador ao mesmo tempo, então a exigência de fonte é mais dura que o normal.**

## Prompt (copiar tudo abaixo)

```
Preciso de uma pesquisa técnica e jurídico-fiscal sobre CNAE, Simples Nacional e MEI no Brasil.
Este material vai virar a base de decisão de um produto real (escolha de CNAE pra abertura de
empresa), então a EXIGÊNCIA DE FONTE é máxima: use SOMENTE fontes de altíssima confiabilidade —
Receita Federal, Comitê Gestor do Simples Nacional (CGSN) e suas Resoluções, Lei Complementar
123/2006 e alterações, IBGE/CONCLA (Comissão Nacional de Classificação), Portal do Empreendedor
(gov.br), Diário Oficial da União. NÃO use blogs de contabilidade, sites de escritórios privados,
Reclame Aqui ou fóruns — se a única fonte que achar for desse tipo, diga explicitamente que não
achou fonte oficial, não cite a fonte não-oficial como se fosse válida. Toda afirmação numérica ou
de regra precisa vir com a fonte (nome do órgão + lei/resolução/artigo específico, com link se
possível) ou ser marcada como "não encontrei fonte oficial pra isso".

Preciso de respostas estruturadas pros seguintes blocos:

## BLOCO 1 — Mecânica do Anexo III × Anexo V (Simples Nacional)
1. Base legal exata (LC 123/2006, quais artigos/parágrafos) que define quando uma atividade de
   serviço cai no Anexo III vs Anexo V.
2. Existe uma lista OFICIAL de CNAEs/atividades que caem SEMPRE no Anexo III, sem depender de
   Fator R? Se sim, cite a fonte e, se possível, alguns exemplos.
3. Existe uma lista OFICIAL de CNAEs/atividades que caem SEMPRE no Anexo V, sem depender de
   Fator R? Mesma pergunta.
4. Quais CNAEs/atividades são elegíveis ao FATOR R (ou seja, podem migrar entre Anexo III e V
   dependendo da proporção folha de pagamento/faturamento)? Existe uma lista oficial dessas
   atividades, ou é definido por outro critério (natureza do serviço, por exemplo)?

## BLOCO 2 — Fator R, a fórmula exata
5. Fórmula oficial exata do Fator R (o que é numerador, o que é denominador, período de apuração
   — últimos 12 meses?).
6. O que EXATAMENTE conta como "folha de pagamento" pro cálculo: só salário CLT? Inclui
   pró-labore dos sócios? Inclui encargos (INSS patronal, FGTS)? Cite a base legal/normativa
   exata que define isso.
7. Com que frequência o Fator R é recalculado/reavaliado (mensal? anual? no início de cada
   ano-calendário com base no ano anterior?).
8. Existe uma margem de segurança oficial recomendada, ou isso é só boa prática de mercado
   (nesse caso, diga que é boa prática, não regra)?

## BLOCO 3 — MEI: por que a lista de CNAEs é diferente do Simples ME
9. Onde está a lista OFICIAL de CNAEs elegíveis ao MEI (Portal do Empreendedor / Resolução CGSIM
   ou CGSN específica)? Link direto se possível.
10. Por que essa lista é mais restrita que "atende ao Simples Nacional geral"? Existe uma
    explicação oficial de por que certas atividades servem pro Simples ME mas NÃO pro MEI
    (ex.: atividade intelectual/regulamentada, natureza do serviço, outro critério)?
11. Me dê 5-10 exemplos REAIS e verificáveis de CNAEs que atendem ao Simples ME mas NÃO são
    elegíveis ao MEI, com a fonte de cada um.
12. O MEI tem algum sistema de enquadramento em Anexo (III/V) e Fator R como o Simples geral tem,
    ou o MEI paga um valor fixo mensal (DAS-MEI) independente disso? Explique a diferença de
    lógica tributária entre MEI e Simples ME nesse ponto.

## BLOCO 4 — Risco municipal / dispensa de vistoria (contexto complementar)
13. Existe uma classificação NACIONAL oficial de "atividade de baixo risco" (Resolução CGSIM,
    REDESIM) que dispensa vistoria prévia pra abertura, e ela é vinculada ao CNAE? Como funciona
    a relação entre "CNAE de baixo risco" e a possibilidade de usar endereço residencial como
    endereço fiscal sem inspeção comercial?

Formato de saída: 1 seção por bloco, respondendo cada pergunta numerada, sempre com a fonte
específica (órgão + norma + artigo, e link se disponível). Onde não achar fonte oficial, escreva
claramente "não encontrei fonte oficial" em vez de preencher com estimativa ou fonte fraca.
```

## ✅ Resultado (colado 27/08)

Resultado completo em [[resultado-pesquisa-fundamentos-cnae-27-08]] — já cruzado contra `fundamentos-cnae.md` (ratificou, 2 hipóteses 🔑 confirmadas) e contra `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` (bate, sem contradição). Próximo passo: cruzar contra o resto da `cnae-matriz/` (matriz original, tabela Contabilizei, complexidade de abertura) — ver `pesquisa/estado-atual-pesquisa-cnae.md`.

## Links
- [[fundamentos-cnae]] — atualizada (v2) com as ratificações.
- [[resultado-pesquisa-fundamentos-cnae-27-08]] — resultado bruto + cruzamento.
- `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` — motor que consome essa lógica.
