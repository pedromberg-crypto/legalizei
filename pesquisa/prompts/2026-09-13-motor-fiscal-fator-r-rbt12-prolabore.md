---
tipo: operacao
status: vivo
data: 2026-09-13
assunto: prompt-pesquisa-motor-fiscal
autoridade: derivado
tags: [pesquisa, fiscal, fator-r, rbt12, pro-labore, gemini]
---

# Prompt · Pesquisa 1 — O motor fiscal (Fator R · RBT12 · pró-labore em mês zero)

> 🧭 **O que é:** o texto literal colado no Google Gemini (modo busca) em 13/09/2026.
> O Pedro roda fora da sessão e traz o retorno — regra do vault desde 05/08.
>
> 🔒 A trava de persona (`execucao/processos/_persona.mjs`) está DENTRO do prompt, no topo.
> Sem ela o retorno vem com comércio, EPP, MEI e Lucro Presumido misturados, e foi
> exatamente assim que nasceu o erro do plano de saúde do sócio em 13/09.

**As três perguntas destravam:** o numerador do Fator R (motor), o RBT12 de empresa nova
(a maioria dos nossos clientes) e o `L3`/`L4` do mapa de pró-labore.

---

## O texto do prompt

```
Preciso de uma pesquisa fiscal brasileira com FONTE PRIMÁRIA, para fundamentar o
cálculo de um software de contabilidade. Responda com rigor de contador, não com
resumo de blog.

═══════════════════════════════════════════════════════════════════
CONTEXTO — E ELE É UMA TRAVA, NÃO UMA PREFERÊNCIA
═══════════════════════════════════════════════════════════════════

Todas as respostas devem valer EXCLUSIVAMENTE para este contribuinte:

  • Microempresa (ME) optante pelo SIMPLES NACIONAL
  • Atividade de SERVIÇO, tributada no ANEXO III ou no ANEXO V
  • Com ou sem Fator R
  • De 1 a 4 sócios, todos pessoa física domiciliada no Brasil
  • Sediada em Belo Horizonte ou em outro município de Minas Gerais
  • Atividade NÃO regulamentada (sem conselho de classe)
  • Emite NFS-e de serviço, ISS municipal

NÃO responda sobre, e me avise se eu estiver pedindo algo que só existe fora disto:
  ✗ Anexo I, II ou IV
  ✗ comércio, indústria, ICMS
  ✗ MEI
  ✗ EPP (empresa de pequeno porte)
  ✗ Lucro Presumido ou Lucro Real
  ✗ atividades regulamentadas

Se a regra for DIFERENTE para algum desses, diga apenas "difere, e está fora do
escopo" — não desenvolva.

═══════════════════════════════════════════════════════════════════
PERGUNTA 1 — O QUE COMPÕE O NUMERADOR DO FATOR R
═══════════════════════════════════════════════════════════════════

O Fator R é a razão entre a folha de salários dos últimos 12 meses e a receita bruta
dos últimos 12 meses, com limiar de 28% (LC 123/2006, art. 18, §5º-J e §24).

Preciso da composição EXATA do numerador, item a item:

1.1 O que ENTRA na "folha de salários incluídos encargos":
    a) salários de empregados — confirmar
    b) pró-labore de sócio — confirmar
    c) 13º salário — entra? no mês do pagamento ou rateado?
    d) férias e o terço constitucional — entram?
    e) FGTS — entra como "encargo"?
    f) 🔴 A CONTRIBUIÇÃO PREVIDENCIÁRIA PATRONAL (CPP) — ESTA É A PERGUNTA
       CENTRAL. No Anexo III e no Anexo V a CPP está DENTRO do DAS, não é
       recolhida em guia separada. Nesse caso ela pode ser somada ao numerador
       do Fator R como "encargo"? Ou só conta a CPP efetivamente recolhida
       à parte? Cite o dispositivo e diga se há divergência entre a letra da
       lei, a Resolução CGSN e as Soluções de Consulta da RFB.
    g) contribuição previdenciária DESCONTADA do segurado (parte do empregado
       e do contribuinte individual) — entra?

1.2 O que NÃO entra, de forma expressa:
    a) pagamento a autônomo por RPA
    b) pagamento a prestador PJ
    c) estagiário
    d) distribuição de lucro
    e) aluguel pago ao sócio

1.3 🔴 REGIME DE APURAÇÃO — CRÍTICO PARA NÓS:
    O numerador considera o valor PAGO (regime de caixa) ou o valor DEVIDO /
    declarado (regime de competência)?
    Em outras palavras: pró-labore declarado no eSocial mas NÃO pago em dinheiro
    ao sócio conta no Fator R? Qual a consequência se a Receita identificar isso
    (glosa, reclassificação para o Anexo V, multa)? Cite a base legal e, se
    houver, autuação ou Solução de Consulta sobre o tema.

═══════════════════════════════════════════════════════════════════
PERGUNTA 2 — RBT12 DE EMPRESA COM MENOS DE 13 MESES
═══════════════════════════════════════════════════════════════════

Empresa constituída há menos de 12 meses não tem 12 meses de receita para formar
o RBT12.

2.1 Qual é a regra exata de proporcionalização nos meses 1 a 12? Cite o
    dispositivo (LC 123/2006 art. 18 §§1º e 2º, art. 3º, e a Resolução CGSN
    vigente em 2026, informando o número dela).

2.2 Escreva a FÓRMULA, explicitamente:
    a) no primeiro mês de atividade
    b) do segundo ao décimo segundo mês
    c) a partir do décimo terceiro mês
    Diga se o mês de abertura conta inteiro ou proporcional aos dias.

2.3 Como esse RBT12 proporcionalizado entra na fórmula da alíquota efetiva
    [(RBT12 × alíquota nominal) − parcela a deduzir] ÷ RBT12? Qual RBT12 vai
    em cada posição da fórmula?

2.4 🔴 E O FATOR R NO MESMO PERÍODO? A janela de 12 meses do Fator R também é
    proporcionalizada para empresa nova, ou ela usa só os meses existentes?
    Esta é a pergunta que menos encontro respondida e é a que mais nos afeta.

2.5 CONFERÊNCIA NUMÉRICA. Rode este caso hipotético e mostre a conta:
    • Empresa de serviço, ME no Simples, aberta em 12/12/2025
    • Anexo V
    • Receita de R$ 10.000,00 por mês, todos os meses, sem exceção
    • Competência de apuração: setembro/2026 (10º mês de atividade)
    Qual é o RBT12, qual é a alíquota efetiva, e quanto sai de DAS?
    Mostre cada passo da aritmética.

═══════════════════════════════════════════════════════════════════
PERGUNTA 3 — PRÓ-LABORE EM MÊS SEM FATURAMENTO
═══════════════════════════════════════════════════════════════════

3.1 O pagamento de pró-labore ao sócio administrador é OBRIGATÓRIO todo mês, ou
    é obrigatório apenas quando há remuneração efetivamente paga ou creditada?
    Cite a base legal (Lei 8.212/91 art. 12 V "f" e art. 22 III, e o que a
    Instrução Normativa RFB vigente diz).

3.2 Se a empresa não fatura nada em um mês, ela pode deixar de pagar pró-labore
    naquele mês sem infração?

3.3 Se pode: o que CONTINUA obrigatório mesmo sem pró-labore?
    • eSocial — qual evento, e existe declaração de "sem movimento"?
    • DCTFWeb — precisa transmitir?
    • Há multa por ausência de declaração, mesmo zerada? Qual valor?

3.4 Existe VALOR MÍNIMO quando o pró-labore é pago? É o salário mínimo vigente?
    E existe teto? Confirme o teto de contribuição do INSS vigente em 2026, com
    o valor e a portaria que o fixou.

3.5 Sócio que NÃO é administrador e não trabalha na empresa (apenas quotista)
    precisa receber pró-labore?

3.6 Qual o EFEITO de um mês com pró-labore zero sobre o Fator R dos 12 meses?
    O mês zerado entra na média como zero, ou é desconsiderado da janela?

3.7 Há alguma regra ou entendimento da Receita sobre pró-labore
    DESPROPORCIONALMENTE BAIXO em relação ao faturamento — isto é, existe risco
    de desconsideração ou arbitramento por pagar pouco de propósito para reduzir
    tributo?

═══════════════════════════════════════════════════════════════════
COMO EU PRECISO DA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. FONTE PRIMÁRIA SEMPRE, com o dispositivo citado: LC 123/2006 (artigo e
   parágrafo), Resolução CGSN (número, ano e artigo), Lei 8.212/91, Instrução
   Normativa RFB (número e ano), Solução de Consulta COSIT (número e ano).
   Não aceito "de acordo com especialistas" nem link de blog contábil como base.

2. INFORME A VIGÊNCIA. Diga se a regra citada está em vigor em SETEMBRO DE 2026,
   e sinalize qualquer alteração recente (2025 ou 2026) que tenha mudado o que
   valia antes.

3. SEPARE O QUE É PACÍFICO DO QUE É CONTROVERSO. Onde houver divergência entre
   doutrina, entendimento da RFB e decisões do CARF, diga explicitamente:
   "ponto controverso", apresente as duas posições e indique qual é a mais
   conservadora.

4. SE NÃO SOUBER, DIGA QUE NÃO SABE. Prefiro um "não localizei fonte primária
   sobre isto" do que uma resposta plausível sem lastro. Vou virar código com
   isso, e número errado aqui vira imposto errado para cliente real.

5. ESTRUTURE assim: resposta direta → base legal com o artigo → observação
   prática, se houver. Nessa ordem, para cada item numerado acima.
```

---

## Por que estas três, juntas

Moram todas na **LC 123 art. 18**, então uma busca resolve as três — e as três travam coisas diferentes:

| | Trava | Item do mapa |
|---|---|---|
| 1 | O numerador do Fator R. Se a CPP conta e não somarmos, jogamos cliente pro Anexo V sem necessidade: 6% vira 15,5% | `L4`, `L10`, e o motor de 7 regras |
| 2 | O RBT12 de empresa nova, que é **a maioria dos nossos clientes** — o produto nasce da constituição | `I5`, alíquota efetiva, hipótese dos 5,99987% |
| 3 | Se o mês sem faturamento tem escolha ou obrigação | `L3` e `L4` |

E a **1.3** (caixa x competência) é a que responde o `L12`, o único vermelho da categoria: *o pró-labore foi declarado ou foi pago?*

## Links
- [[PERSONA]] · [[FUNCIONALIDADES]] · `execucao/processos/cru/prolabore.mjs`
- Pesquisa 2, ainda não escrita: distribuição de lucro (Lei 15.270/2025, teto de isenção, como declarar sem extrato)
