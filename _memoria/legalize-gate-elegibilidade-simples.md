---
name: legalize-gate-elegibilidade-simples
description: 15/09 — o gate de elegibilidade ao Simples do ME não existia; 4 vedações nos atingem e a pejotização é crítica
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-17T18:05:14.159Z
---

🔴 **O flow de ME não tinha gate de elegibilidade ao Simples.** Tínhamos a triagem de impedimento do **MEI** inteira e **nada** para o ME. Dava para vender o plano, abrir a empresa na Junta e a opção ser **indeferida depois** — e aí ela nasce no **Lucro Presumido**.

Descoberto porque o Pedro levantou o caso do sócio que participa de outra empresa. A intuição estava certa; o motivo que ele deu (*"o Simples só aceita CPF, nunca CNPJ"*) é **outra regra** — aquilo é o inciso I; o caso dele são os incisos III a V.

Registrado em `GATE_DE_ENTRADA`, no `ciclo-do-cnpj.mjs`.

## Dos 12 incisos do art. 3º §4º, **8 não nos alcançam** — sobram 4

| | inciso | detalhe que importa |
|---|---|---|
| **V1** | III — sócio em outra empresa **do Simples** | 🔑 o **percentual não importa**: 0,1% já engatilha a soma |
| **V2** | IV — sócio em empresa **fora** do Simples | aqui importa: só **acima de 10%** |
| **V3** | V — sócio **administrador** de outra empresa, mesmo sem ser dono | — |
| **V4** | **XI — pejotização** | 🔴 **RISCO CRÍTICO** |

Os três primeiros só disparam com **receita global > R$4,8 milhões**.

🔴 **O XI é o que dói:** *"pessoalidade, subordinação e habitualidade, cumulativamente"* — TI, design e consultoria são exatamente as atividades que atraem fiscalização de vínculo disfarçado. E é a única que a autodeclaração pega mal.

**Fora do §4º:** MEI ativo não impede abrir, mas **obriga baixar antes** (Res. CGSN 140/2018 art. 115 §2º IV). Servidor público ativo pode ser quotista, **não pode administrar**.

## 🔑 Não existe API de consulta prévia por CPF

A pesquisa declarou a **ausência normativa**: o REDESIM/SERPRO recusa avaliação preditiva fora da posse do CNPJ. **O gate é 100% autodeclaração** — dá para perguntar bem e registrar, não dá para conferir. Mesma doutrina da Carta de Responsabilidade.

## ✅ E confirmou duas coisas nossas

**CLT não é vedação** — declarado após varrer LC 123 arts. 3º, 15, 17, 30, 31 e a Res. CGSN 140/2018: *"total inexistência de comando jurídico"*. Fecha a confusão que veio do card de **preço** do líder (que junta CLT e sociedade em outra empresa por motivo comercial, não fiscal).

E confirma o desenho do motor **sem mexer em código**: sócio que **entra** afeta o Fator R já na competência da formalização; sócio que **sai** não apaga nada — o pró-labore dele segue no Fator R por 12 meses.

**Why:** é o único buraco que custa dinheiro **antes** de o cliente existir — vende, abre, e a opção cai.

**How to apply:** o gate é pergunta de cadastro, não consulta. Cada vedação já tem a pergunta em português de gente no `GATE_DE_ENTRADA`.

## 🔴 17/09 — a pergunta ainda nao existe em tela nenhuma

Medido ao cruzar o gate com o catalogo de variaveis do flow de entrada ([[legalize-suite-teste-flutter-personas]]):

| | Status no app |
|---|---|
| **V1** | 🟡 o fato e captado no **C2**, mas como `vinculo INSS: socio-outro-cnpj`, ou seja **para o teto do INSS**. Ninguem pergunta a receita da outra empresa |
| **V2 · V3 · V4** | ❌ nao perguntados |
| **O1** (MEI ativo) | ✅ vem por API |
| **O2** (servidor publico) | ❌ nao perguntado, e `servidor-publico` **nem existe** no dominio do vinculo INSS |

🔑 **O V1 e o caso mais traicoeiro: o dado JA ESTA na tela**, colhido com outro proposito. Nao falta captura, falta **consequencia**.

🔴 **O2 quebra a regra "titular e sempre 49"** dos campos internos: servidor publico ativo e quotista e nao administrador, entao com socio vira `22` no titular, e **unipessoal vira RECUSA** (SLU sem administrador nao existe).

Viraram as personas **P21 a P24**. Enquanto nao houver tela, rodar cada uma **prova a ausencia**.

Literal: `pesquisa/fontes/2026-09-15-elegibilidade-simples-LITERAL.md`.
Relacionado: [[legalize-ciclo-do-cnpj-e-canais]] · [[legalize-escopo-me-simples-anexos-3-5]].
