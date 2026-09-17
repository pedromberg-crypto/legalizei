---
tipo: referencia
status: vivo
data: 2026-09-15
assunto: prompt-pro-labore-por-socio
tags: [pesquisa, prompt, gemini, pro-labore, socio, inss, irrf]
---

# 🔎 Prompt de pesquisa — o pró-labore quando há mais de um sócio

> 🧭 **Como usar:** colar no **Gemini com Google Search**. O Pedro roda fora e cola o retorno ([[legalize-pesquisa-grande-via-gemini]]).
>
> 🎯 **É a 3ª rodada.** A 1ª fechou RBT12, ISS retido e sublimite. A 2ª fechou IRRF, CPP no Fator R e o calendário. Esta fecha o que a varredura de 15/09 provou ser **genuinamente novo**: os itens **70, 71 e 72** de [[PENDENCIAS]].
>
> 🔴 **Por que é urgente:** a P1 confirma o conserto de um erro que cobrava **R$2.077 a mais** por mês numa empresa de 4 sócios. A P2 decide se a tela pergunta o pró-labore **valor por valor** ou só o total. A P3 decide quem entra no `sociosComProLabore` de **8 das 16 personas**.
>
> ⚠️ **O que NÃO entra nesta rodada:** tudo que já está encerrado (`_encerrados.mjs`) ou já tem número na fila. A varredura mostrou que 7 das 10 dúvidas que eu tinha escrito já estavam respondidas — esta rodada só carrega as 3 que sobraram.

---

## O prompt

```
Você é um especialista em Simples Nacional, em contribuição previdenciária de
sócio e em retenção de IRRF sobre pró-labore. Responda em português do Brasil,
com fonte primária e citação literal.

═══════════════════════════════════════════════════════════════════
CONTEXTO TRAVADO — responda SOMENTE dentro deste recorte
═══════════════════════════════════════════════════════════════════

A empresa é sempre:
· Microempresa (ME) optante pelo Simples Nacional
· Anexo III ou Anexo V, NUNCA Anexo I, II ou IV
· Prestadora de SERVIÇO não regulamentado (consultoria, publicidade,
  TI, design, ensino, tradução). Sem conselho de classe
· Sediada em Belo Horizonte / Minas Gerais
· De 1 a 4 sócios, TODOS pessoa física domiciliados no Brasil
· SEM NENHUM FUNCIONÁRIO. Só sócios.
· Faturamento até R$ 360.000/ano (teto do ME)
· Competência de referência: 2026. Salário mínimo R$1.621,00.
  Teto do INSS R$8.475,55 (Portaria Interministerial MPS/MF 13/2026)

NÃO responda sobre: Lucro Presumido, Lucro Real, MEI, EPP como regime
permanente, folha de empregado, Anexo I/II/IV, ICMS, comércio.

Se a resposta divergir conforme o número de sócios, diga isso explicitamente.
Se não houver norma clara e a prática de mercado divergir, diga que não há, e
descreva as duas correntes com quem defende cada uma. NÃO PREENCHA LACUNA COM
PLAUSIBILIDADE — prefiro "não há norma" a uma resposta bonita e não amparada.

═══════════════════════════════════════════════════════════════════
FORMATO OBRIGATÓRIO DE CADA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. Resposta direta (uma frase, sem rodeio)
2. Dispositivo legal (lei, artigo, parágrafo, inciso, alínea)
3. Citação LITERAL do dispositivo, entre aspas
4. Vigência em setembro de 2026 (e se muda em 2027)
5. Confiança: ALTA (norma primária) / MÉDIA (IN, SC, manual) /
   BAIXA (doutrina, prática de mercado)
6. Exemplo numérico com os valores do contexto acima

═══════════════════════════════════════════════════════════════════
P1 · O TETO DO INSS E A TABELA DO IRRF SÃO POR PESSOA OU POR EMPRESA?
═══════════════════════════════════════════════════════════════════

Empresa com 4 sócios, todos sócios-administradores, cada um recebendo
R$3.500,00 de pró-labore no mês. Folha total de pró-labore: R$14.000,00.

1.1 · A contribuição previdenciária do segurado (11%) incide sobre o
      pró-labore DE CADA SÓCIO até o teto individual de R$8.475,55, ou
      sobre a soma de R$14.000,00 até um teto único?

1.2 · A tabela progressiva do IRRF se aplica ao rendimento DE CADA SÓCIO
      individualmente, ou ao total pago pela empresa?

1.3 · Existe alguma hipótese em que se calcula sobre o TOTAL da empresa?

1.4 · Faça as duas contas para o exemplo acima (4 × R$3.500) e diga qual
      é a correta, em reais, com INSS e IRRF separados.

CONTEXTO DO PORQUÊ: o nosso sistema estava somando os pró-labores e
calculando como se fosse uma pessoa só. Nesse exemplo ele cobrava
R$3.617,19 onde nós calculamos que o correto seja R$1.540,00. Precisamos
saber se a correção está certa.

═══════════════════════════════════════════════════════════════════
P2 · O PRÓ-LABORE PODE SER DESIGUAL ENTRE OS SÓCIOS?
═══════════════════════════════════════════════════════════════════

2.1 · O pró-labore pode ser distribuído de forma DESIGUAL entre sócios
      que exercem funções diferentes? Há vedação?

2.2 · O valor do pró-labore de cada sócio precisa guardar proporção com
      o PERCENTUAL DE PARTICIPAÇÃO no capital social? (Nossa leitura é
      que NÃO, porque pró-labore remunera trabalho e a quota governa a
      distribuição de lucro — confirme ou corrija.)

2.3 · Qual formalidade o pagamento desigual exige: previsão no contrato
      social, ata de reunião de sócios, deliberação anual, ou basta o
      registro em folha e no eSocial?

2.4 · Existe risco fiscal em dividir IGUAL quando o trabalho é
      desigual — por exemplo, caracterização de distribuição disfarçada
      de lucro para o sócio que trabalha menos?

2.5 · Na prática de escritório contábil, qual é o caso mais comum:
      pró-labore igual entre sócios, ou proporcional à função?

CONTEXTO DO PORQUÊ: o nosso aplicativo hoje pergunta só o valor TOTAL do
pró-labore e assume divisão igual. Se desigual for comum, precisamos
perguntar valor por sócio. E isso não é cosmético: R$14.000 divididos em
R$7.000+R$7.000 geram IRRF diferente de R$11.000+R$3.000.

═══════════════════════════════════════════════════════════════════
P3 · "ADMINISTRAR" É A MESMA COISA QUE "PRESTAR SERVIÇO À SOCIEDADE"?
═══════════════════════════════════════════════════════════════════

A Lei 8.212/1991 art. 12, V, "f" define como segurado obrigatório o
sócio que PRESTA SERVIÇO à sociedade. O nosso aplicativo, na abertura da
empresa, pergunta apenas QUEM ADMINISTRA (o que vira a qualificação 49 ×
22 no DBE da Receita).

3.1 · Sócio que TRABALHA na empresa mas NÃO é administrador é segurado
      obrigatório como contribuinte individual, e portanto deve receber
      pró-labore?

3.2 · Sócio que É ADMINISTRADOR mas efetivamente não trabalha (cargo
      formal) é obrigado a receber pró-labore?

3.3 · Como se prova, perante a fiscalização, que um sócio presta ou não
      presta serviço à sociedade? O que o fisco olha?

3.4 · Empresa com 3 sócios, 1 administrador e 2 que trabalham sem serem
      administradores: quantos pró-labores devem existir?

3.5 · Qual é o risco de pagar pró-labore a sócio que NÃO presta serviço:
      glosa da despesa, autuação previdenciária, ou nenhum?

CONTEXTO DO PORQUÊ: precisamos saber se a nossa pergunta de cadastro
("quem administra?") é suficiente ou se precisamos de uma segunda
pergunta ("quem trabalha na empresa?"). Isso decide quantos pró-labores
o sistema calcula, e portanto o Fator R e o enquadramento no Anexo III
ou V.

═══════════════════════════════════════════════════════════════════
FECHAMENTO
═══════════════════════════════════════════════════════════════════

Ao final, liste em uma tabela:
· cada sub-pergunta
· a resposta em uma linha
· o dispositivo
· a confiança (ALTA / MÉDIA / BAIXA)

E declare separadamente: quais destas perguntas NÃO TÊM norma clara e
dependem de decisão do contador responsável.
```

---

## Onde o retorno entra

| | |
|---|---|
| Captura literal | `pesquisa/fontes/2026-09-15-pro-labore-por-socio-LITERAL.md` (100% do texto, regra de [[legalize-leitura-integral-documento]]) |
| P1 → | ratifica ou derruba `darfDaFolha()` · fecha o item **70** |
| P2 → | decide se a tela pergunta valor por sócio · fecha o item **71** |
| P3 → | decide `sociosComProLabore` e se falta pergunta no cadastro · fecha o item **72** |

⚠️ **Etiqueta de 3 vias na leitura do retorno:** ⚖️ obrigação legal (copiar citando a lei) · 🏢 decisão de negócio (decidir do zero) · 🐛 prática de mercado sem amparo (não copiar). O Gemini tende a apresentar as três com a mesma segurança — foi assim que a "SC COSIT 17/2021" entrou como se fosse pacífica em 13/09 e teve que ser desfeita em 14/09.

## Links
[[PENDENCIAS]] · [[_duvidas-contador]] · [[prompt-pesquisa-fechamento-motor-fiscal]] · [[_achados-do-motor]]
