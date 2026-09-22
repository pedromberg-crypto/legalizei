---
name: legalize-base-do-leo-fatiador-e-ondas
description: "22/09 - o fatiador descartava 5.922 chars (tudo antes do 1o ##), incluindo a tabela inteira do dossie. Tres ondas: preambulo vira secao, doutrina sai pro RULES, 04 vira uma secao por objecao. 63 -> 100 trechos, e o teste de busca de 9/10 para 12/12."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-22T18:40:26.129Z
---

🔴 **O `fatiarNota` corta no `##` e descarta tudo antes do primeiro** (`.slice(1)`). Eram **5.922 caracteres invisíveis** para a busca, e era ali que moravam as regras mais vermelhas: **a tabela inteira dos 14 campos do dossiê** (o `08` tinha um `##` só, e ele é o que diz *o que a gente NÃO pergunta* — a nota respondia justamente a pergunta que não estava indexada), o *"a ferramenta de CNAE ainda não está ligada"* e o *"R$ 19 e R$ 79 expiraram"*.

**As três ondas, cada uma medida antes e depois:**

| | O quê | Efeito |
|---|---|---|
| 1 | preâmbulo de 11 notas vira `##` — **zero palavra reescrita**, `33 insertions(+)` | 63 → 74 trechos |
| 2 | **doutrina sai do RAG** pro `RULES` §10 (8 preâmbulos que eram instrução para o agente, não resposta para cliente) · o `04` vira **uma seção por objeção** (eram 3 blocos com 19 perguntas dentro) · o §4 do `05`, com 4.145 chars, vira 4A/4B/4C/4D | 74 → 100, média 633 chars |
| 3 | conteúdo novo: **as 6 objeções de preço que a base nunca teve**, e as 11 respostas que o Pedro curou | a única falha real do teste sai de 🔴 para ✅ em 1º |

**O teste de busca (`scripts/provar-busca.mjs`)**, que nasceu neste dia: 9/10 → **12/12 entre os 4, zero falha**. 🔑 E a métrica que decide é **"entre os N"**, não "em 1º": a tool devolve 4 e o modelo lê os 4. Em 22/09 escrevi um critério de sucesso impossível — pedi que o teto de 2 trechos por nota fizesse "em 1º" subir, e o filtro `posicao_na_nota <= 2` **nunca alcança o 1º colocado**, porque o mais próximo globalmente é sempre o primeiro dentro da própria nota.

⚠️ **O teto de 2 por nota existe porque o `04` virou 24% da base** e seus títulos são perguntas de cliente em primeira pessoa — a mesma forma gramatical da consulta. Ele passava a ganhar **por forma, não por assunto**, e chegou a ocupar as 4 vagas, empurrando a resposta certa (que estava a 0,048 do corte) para fora.

🔑 **Quatro consertos no carregador**, no mesmo dia: id por **conteúdo** e não por posição (com índice, inserir seção no meio faz o upsert gravar texto novo sobre id de outro assunto) · a carga **apaga o que sumiu** (antes só fazia upsert, e linha removida do markdown ficava para sempre) · **portão de contagem** para as notas em `seed/contagem-esperada.json` · fatia curta **avisa** em vez de sumir.

⚠️ **Quatro números eram apagados pela sanitização sem ter onde ser consultados** — limiar do Fator R, piso do pró-labore, INSS do sócio e custo de mercado do certificado. Nasceu `fatos.parametro_fiscal`, devolvida pelo `estimar_das`. Ver [[legalize-descricao-de-tool-nao-move-chamada]].
