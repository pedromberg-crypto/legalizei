---
name: legalize-suite-teste-flutter-personas
description: 14/09 - nasce execucao/testes-flutter/ com 20 personas (24 desde 17/09); a P01 rodou ate o E9.1P e a parede e 404 puro. As restantes pararam por pedido do Pedro.
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-17T18:05:04.407Z
---

`execucao/testes-flutter/` e o **contrato de teste** entre o vault e o app Flutter: `variaveis-entrada-me.md` (22 variaveis do flow E1→A5.H, dominio lido do codigo real) e `personas-entrada-me.md` (**20 personas**, 14 base uma por categoria da taxonomia de pills + 6 extras de saida).

**O cruzamento medido:** teto cartesiano 31,3 bi · alcancavel 10,2 bi (−67,5%) · par-a-par 70-112 · **piso 1-wise = 14**, e e 14 porque a maior variavel e a categoria.

**Comecou do zero** (so os nomes herdados) porque das 19 antigas em `_arquivo/motor-testes/personas/` **so 6 rodavam**: `6201-5/00` nao existe na matriz (4 personas), `7020-4/00` exige conselho (5), `bloq-3socios` e `bloq-exterior` morreram em 29/08 (teto virou 4 socios; a pergunta do exterior virou lembrete), e capital/natureza/faixas envelheceram em 31/08 e 01/09.

🎯 **Proporcao fiscal corrigida pra 10 `III-fixo` × 4 `fator-r-dinamico`** — dos 87 CNAEs atendidos, **65 sao III-fixo** (Fator R nao muda nada) e so 15 sao dinamicos. O elenco antigo testava a excecao.

**Estado em 14/09 — PARADO por pedido do Pedro.** A P01 rodou **15 nos, E1 → E9.1P**, e parou numa parede que e **404 puro**, provado por curl com 2 controles: `dev/payments/{id}/simulate` responde igual a uma rota inventada (`NOT_FOUND`, "Cannot POST <path>", roteador do Nest antes de qualquer guard), enquanto rota real e fechada responde 401 com code de dominio. A `api-app` condiciona a rota a `NODE_ENV != production`. 🔑 **Depois do E9 nao existe backend:** a Fase 6 (29 nos, as 2 assinaturas, o A5.H) e **mock em memoria por construcao**.

**3 fios abertos pra quando voltar:** (a) destravar o E9 — a saida boa e a `api-app` registrar a rota no dev da AWS; (b) 🆔 **os CPFs foram gerados por script com DV valido, e DV valido nao garante que nao pertence a ninguem** — falta perguntar se a consulta de CPF na Receita e real ou mock no Flutter, e se for real trocar pelos 3 classicos; (c) escopo da proxima leva (recomendacao: as 19 ate o E9.1P).

**Os achados moram no repo deles** (`docs/achados/README.md`, A-001 a A-009), nao duplicar. Ver [[legalize-prototipo-nextjs-nao-descreve-flutter]].

## 🔴 17/09 — os dois arquivos estavam UM DIA atrasados, e isso bastou

Sao de **14/09** e nao passaram pela migracao de escopo de 15-17/09. O Pedro pediu a conferencia (*"confere se conflita com o que travamos depois"*) e conflitava em 3 pontos:

1. *"Nao barramos por faturamento"* contra **EPP fora** (13/09 + 17/09). A mesma pessoa ouvia "nao atendo" do Leo no WhatsApp e era aceita no app.
2. O **`GATE_DE_ENTRADA`** de 15/09 nunca chegou ao catalogo de variaveis, embora o comentario dele diga *"quem constroi a pergunta e o flow de entrada"*. Ver [[legalize-gate-elegibilidade-simples]].
3. *"Titular e sempre 49"* contra o impedimento do servidor publico.

**Nascem as P21 a P24** (20 → **24 personas**): acima do teto · servidor publico unipessoal · pejotizacao · V1+V3 na mesma pessoa. 🔑 **Nenhuma tem tela: rodar prova a AUSENCIA**, e o resultado e achado, nao bug de teste. As 4 ficam **fora** da conta do piso 1-wise, igual aos gates de cidade e atividade: elas terminam o flow em vez de preenche-lo.

💳 **O preco esperado no E7 mudou:** **R$99/mes nos 3 primeiros meses**, R$139 a partir do 4o, e o endereco fiscal segue como **item de linha separado** de R$49 (R$148 nas P03/P08/P13). Ver [[legalize-preco-lancamento-29-99]].
