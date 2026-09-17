---
tipo: referencia
status: vivo
data: 2026-09-15
assunto: prompt-elegibilidade-ao-simples
tags: [pesquisa, prompt, gemini, simples, elegibilidade, gate, socio]
---

# 🔎 Prompt de pesquisa — quem PODE ser nosso cliente (o gate que não existe)

> 🧭 **Como usar:** colar no **Gemini com Google Search**.
>
> 🎯 **Por que existe:** em 15/09 o Pedro levantou o caso do sócio que participa de outra empresa. A intuição estava certa — é gate —, mas o motivo que ele deu (*"o Simples só aceita sócio CPF, nunca CNPJ"*) é **outra regra**. E ao procurar no vault, achei o buraco: temos a triagem de impedimento do **MEI** inteira, e **nada** para o ME.
>
> 🔴 **O que isso significa hoje:** o nosso flow de abertura de ME **não tem gate de elegibilidade ao Simples**. Perguntamos o vínculo INSS do sócio (e aceitamos "sócio de outro CNPJ" como resposta) só para calcular o teto do INSS — nunca para checar se a empresa **pode** optar. Dá para vender um plano, abrir a empresa e o Simples ser indeferido depois.
>
> ⚠️ **Escopo:** é pesquisa de **norma**, não de canal. Não repete nada da rodada da DEFIS.

---

## O prompt

```
Você é um especialista em elegibilidade e vedações ao Simples Nacional.
Responda em português do Brasil, com fonte primária e citação literal.

═══════════════════════════════════════════════════════════════════
CONTEXTO TRAVADO — responda SOMENTE dentro deste recorte
═══════════════════════════════════════════════════════════════════

Estamos construindo o gate de entrada de um app que abre empresas. Antes de
cobrar do cliente, precisamos saber se a empresa dele PODE optar pelo Simples.

A empresa que queremos atender é:
· Microempresa (ME), faturamento até R$ 360.000/ano
· Prestadora de SERVIÇO não regulamentado (consultoria, publicidade, TI,
  design, ensino, tradução) — sem conselho de classe
· Sede em Belo Horizonte/MG, sem filiais
· De 1 a 4 sócios, TODOS pessoa física residentes no Brasil
· Sem nenhum funcionário
· Anexo III ou V

NÃO responda sobre: MEI, EPP, Lucro Presumido, Lucro Real, comércio,
indústria, atividades regulamentadas.

NÃO PREENCHA LACUNA COM PLAUSIBILIDADE. Se algo depende de consulta caso a
caso, diga isso. Se a informação vier de blog e não de norma, declare.

═══════════════════════════════════════════════════════════════════
FORMATO OBRIGATÓRIO DE CADA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. Resposta direta (uma frase)
2. Dispositivo legal (lei, artigo, parágrafo, inciso)
3. Citação LITERAL, entre aspas
4. Vigência em setembro de 2026
5. Confiança: ALTA / MÉDIA / BAIXA
6. 🔑 A PERGUNTA QUE O APP DEVE FAZER ao cliente para detectar este caso,
   escrita em português de gente, sem jargão

═══════════════════════════════════════════════════════════════════
P1 · AS VEDAÇÕES DO ART. 3º §4º DA LC 123/2006, UMA A UMA
═══════════════════════════════════════════════════════════════════

1.1 · Liste TODOS os incisos do art. 3º §4º da LC 123/2006, com o texto
      literal de cada um, e diga para cada um se ele pode ou não atingir
      uma ME de serviço com 1 a 4 sócios pessoa física.

1.2 · Sócio pessoa física que JÁ É SÓCIO de outra empresa: em que
      situações isso impede o Simples da nova empresa? Importa o
      percentual de participação? Importa o faturamento somado das duas?
      Importa se a outra empresa é ou não optante pelo Simples?

1.3 · Sócio pessoa física que é ADMINISTRADOR de outra empresa (mesmo
      sem ser sócio dela): impede?

1.4 · Sócio que é TITULAR de um MEI ativo: impede a nova ME de optar
      pelo Simples? E o contrário — abrir a ME obriga a baixar o MEI?

1.5 · Qual é exatamente o limite de faturamento SOMADO quando um sócio
      participa de mais de uma empresa? Como se calcula, e o que
      acontece quando estoura?

1.6 · Sócio com emprego CLT em outra empresa: impede alguma coisa no
      Simples? (Nossa leitura é que NÃO impede nada e só afeta o teto do
      INSS da pessoa — confirme ou corrija.)

1.7 · Sócio aposentado, servidor público, ou estrangeiro residente:
      alguma vedação para a ME (não para o MEI)?

═══════════════════════════════════════════════════════════════════
P2 · QUANDO E COMO O IMPEDIMENTO APARECE
═══════════════════════════════════════════════════════════════════

2.1 · O impedimento por participação em outra empresa é verificado
      AUTOMATICAMENTE na hora da opção pelo Simples, ou só aparece em
      fiscalização posterior?

2.2 · Se a opção for INDEFERIDA, o que acontece com a empresa recém
      aberta? Ela fica em qual regime? Há prazo para regularizar ou
      contestar?

2.3 · Existe alguma consulta PRÉVIA (portal, API, serviço do SERPRO) que
      permita saber, antes de abrir, se aquele CPF tem impedimento?

2.4 · A empresa pode ser EXCLUÍDA do Simples no meio do ano por conta de
      um sócio que entrou depois? A partir de quando vale a exclusão?

2.5 · Quais dessas vedações são detectáveis por um CADASTRO bem feito
      (perguntando ao cliente) e quais só por consulta a base de dados?

═══════════════════════════════════════════════════════════════════
P3 · O QUE MUDA COM A ENTRADA DE UM SÓCIO NOVO
═══════════════════════════════════════════════════════════════════

3.1 · Entrando um sócio novo numa ME já aberta e optante, que
      obrigações nascem? (alteração contratual, DBE, eSocial, e o quê
      mais)

3.2 · O sócio que entra no meio do ano passa a receber pró-labore a
      partir de quando? Isso afeta o Fator R de quais competências?

3.3 · E quando um sócio SAI: o que acontece com o pró-labore dele no
      Fator R dos meses já passados? A folha histórica muda?

═══════════════════════════════════════════════════════════════════
FECHAMENTO
═══════════════════════════════════════════════════════════════════

Monte uma tabela final: vedação · norma · atinge nosso perfil? ·
detectável por pergunta no cadastro? · a pergunta em português de gente.

E declare quais respostas não têm norma clara.
```

---

## Onde o retorno entra

| | |
|---|---|
| Captura literal | `pesquisa/fontes/2026-09-XX-elegibilidade-simples-LITERAL.md`, 100% |
| P1 → | vira o **gate de elegibilidade do ME**, que hoje não existe no flow |
| P2 → | decide se o gate é pergunta, consulta de API, ou os dois |
| P3 → | fecha o **B3** do `_cobertura-das-vidas` (sócio que entra ou sai no meio da vida) |

## Links
[[PENDENCIAS]] · [[_cobertura-das-vidas]] · [[dados-coletados-abertura-ate-viabilidade]] · [[prompt-pesquisa-defis-e-canais]]
