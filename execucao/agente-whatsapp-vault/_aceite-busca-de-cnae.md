---
tipo: contrato
status: vivo
data: 2026-09-24
assunto: aceite-busca-cnae
autoridade: contrato
deriva_de_codigo: [hermes-v2-sidecar/seed/05-cnae-nomes-honestos.sql, pesquisa/cnae-matriz/cnae-leo.csv]
tags: [agente, leo, cnae, busca, aceite, vps]
---

# ✅ Critério de aceite — a busca de CNAE do Léo

> 🪟 **Jurisdição.** Isto é **critério de aceite, não desenho**: diz o que precisa ser verdade, não como fazer. A escolha de índice, peso, função e ordenação é do VPS — é lá que o banco existe e é lá que se mede. O que não pode é um caso desta lista continuar quebrado.
>
> Escrito em 24/09, depois de lapidar os 87 títulos amigáveis e medir o que sobra.

## O problema, em uma frase

A `fatos.consultar_cnae` compara a frase do cliente contra **um campo de 36 caracteres em média**, e ignora os **542 caracteres por CNAE** onde estão as palavras que a pessoa realmente digita.

```sql
WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
   OR c.codigo = regexp_replace(p_busca, '\D', '', 'g')
```

| Campo | Média | Na busca? |
|---|---|---|
| `titulo_amigavel` | 36 chars, **só nos 87** | ✅ único |
| `descricao` (título oficial) | 44 chars | 🟡 só como reserva, quando o amigável é nulo |
| `atividades` (termos de busca) | **542 chars, nos 1.332** | 🔴 **não** |
| `descricao_amigavel` | 83 chars | 🔴 não |
| `subclasse_observacoes` | 493 chars | 🔴 não |

## Por que isso é mais grave do que parece

Os **1.245 CNAEs que a gente não atende não têm título amigável** — por desenho, porque a voz amigável foi escrita só para os 87. A busca cai no título oficial deles, que é linguagem de IBGE e não fala como ninguém: `SERVIÇOS ADVOCATÍCIOS` não casa com *advogado*, `ATIVIDADE ODONTOLÓGICA` não casa com *dentista*.

🔴 **E a consequência não é devolver vazio — é devolver um CNAE nosso.** Medido em 24/09, 3 de 6 frases de quem a gente **não** atende voltaram com um CNAE que a gente **atende** no primeiro lugar:

```
"tenho um restaurante"  →  1º  Restauração de obras de arte   (atende = sim)
"vendo roupa"           →  1º  Aluguel de roupas, joias       (atende = sim)
"faço obra"             →  1º  Restauração de obras de arte   (atende = sim)
"sou advogado"          →  🔴 nada
"sou engenheiro"        →  🔴 nada
"sou dentista"          →  1º  Agenciamento de atletas e artistas
```

🔑 O `motivo_nao_atende`, construído em 24/09 para os 1.245, **nunca é acionado**: o CNAE certo não aparece, o Léo lê `atende_me = sim` no topo e diz que atende. No pior caso a empresa abre com o CNAE errado.

## ⚠️ E a solução óbvia tem um furo — medido antes de propor

Pôr o `atividades` na busca **não é ganho puro**. Ele é uma lista de termos com **referência cruzada para outros CNAEs**, e trazer isso sem peso cria falso positivo novo:

```
"dentista"     → 4 CNAEs têm o termo, e o 1º é FABRICAÇÃO DE PRODUTOS QUÍMICOS
"restaurante"  → 9 CNAEs, e o 1º é FABRICAÇÃO DE ARTIGOS DE VIDRO
```

É o mesmo erro que eu cometi em 24/09 de manhã casando regex de lei contra o `atividades`: **101 mudanças, quase todas lixo** — `CONSTRUÇÃO DE RODOVIAS` virou Anexo III porque a lista dela continha *"instalação de"*.

🔴 **E existe um terceiro buraco que campo nenhum resolve:** a palavra **`psicólogo` não existe em lugar nenhum da tabela** — nem no título oficial, nem no amigável, nem nos 542 caracteres de termos. Profissão inteira invisível por ausência de dado, não por peso de busca.

---

# O que precisa ser verdade

## A1 · Quem a gente atende é achado pela palavra que usa
Cada frase abaixo devolve, **em primeiro lugar**, o CNAE indicado.

| Frase | CNAE esperado | Hoje |
|---|---|---|
| `sou sapateiro` | `9529-1/01` | ✅ passa |
| `relojoeiro` | `9529-1/03` | ✅ passa |
| `sou cantor` | `9001-9/02` | ✅ passa |
| `sou tradutor` | `7490-1/01` | ✅ passa |
| `faço sites` | `6201-5/02` Web design | 🔴 **falha** — devolve Hospedagem e Portal, que são III fixo, e o Web design é **Fator R** |
| `aluguel de pula-pula` | `7721-7/00` | 🔴 **falha** — perde por 0.02 para Aluguel de material médico |
| `sou personal trainer` | nenhum dos 87 | 🔴 hoje devolve lixo; ver A3 |

> 🔑 As duas primeiras falhas são **fiscais, não de UX**: mandam a pessoa para o anexo errado, e a diferença é **6% × 15,5%**.

## A2 · Quem a gente NÃO atende é achado, e recebe a recusa certa
Cada frase devolve, em primeiro lugar, um CNAE com `atende_me = nao`, e o `motivo_nao_atende` correspondente.

| Frase | CNAE esperado | Motivo esperado | Hoje |
|---|---|---|---|
| `sou advogado` | `6911-7/01` | `anexo-iv` | 🔴 devolve nada |
| `sou engenheiro` | `7112-0/00` | — | 🔴 devolve nada |
| `sou dentista` | `8630-5/04` | `exige-alvara-previo` | 🔴 devolve Agenciamento de atletas |
| `tenho um restaurante` | divisão 56 | `comercio-ou-industria` | 🔴 devolve **Restauração de obras de arte**, que é nosso |
| `vendo roupa` | `4781-4/00` | `comercio-ou-industria` | 🔴 devolve **Aluguel de roupas**, que é nosso |

🔴 **A3 é a regra que sustenta as duas:** nunca devolver um CNAE `atende_me = sim` em primeiro lugar para quem descreveu atividade que a gente não atende. **Errar para o lado de "não atendemos" é barato; errar para o lado de "atendemos" abre empresa errada.**

## A3 · Vazio honesto é melhor que resposta errada
Quando nenhum candidato passa de um piso de semelhança, a função devolve **zero linhas**, e o Léo diz que não encontrou e pede mais detalhe. Hoje ela devolve **sempre 5**, mesmo quando o melhor tem 0.04.

> Caso de prova: `tiro xerox` devolvia `Consultoria em TI` com **0.04** antes da lapidação. Nenhum piso teria deixado isso sair.

## A4 · Nada do que já funciona pode piorar
As 31 frases de `pesquisa/cnae-matriz/testar-busca.mjs` que hoje acertam em 1º continuam acertando em 1º. **Regressão aqui derruba a entrega**, mesmo que os casos novos passem.

## A5 · O termo cruzado não pode ganhar do título
Se `atividades` entrar na busca, um CNAE que casa **só** por termo cruzado nunca fica à frente de um que casa pelo título.

> Caso de prova: `dentista` não pode devolver `FABRICAÇÃO DE PRODUTOS QUÍMICOS` à frente de `ATIVIDADE ODONTOLÓGICA`. `restaurante` não pode devolver `FABRICAÇÃO DE ARTIGOS DE VIDRO`.

## A6 · O que não está em campo nenhum precisa aparecer em algum
`psicólogo` não existe na tabela inteira. Enquanto não existir, nenhuma mudança de busca acha. Isso não é trabalho do VPS — é dado, e sai daqui. **Fica declarado para não ser confundido com falha de busca.**

---

# Como medir

O `pesquisa/cnae-matriz/testar-busca.mjs` reproduz localmente a matemática do `pg_trgm` (mesmo acolchoamento, mesmo Jaccard, mesmo limiar 0.6) e roda contra o `cnae-leo.csv` e o `cnae-leo-1332.csv`.

⚠️ **É aproximação, não é o Postgres.** Serve para escolher entre dois títulos aqui no vault. **Quem mede de verdade é o VPS**, contra o banco, e é de lá que sai o veredito de cada item acima.

> 🕓 **Uma pergunta que precisa ser respondida antes de desenhar:** vale investir na busca lexical, ou é hora de usar embedding? A coluna `conhecimento.nota` já usa `vector(768)` com `gemini-embedding-001` e HNSW cosine — a infraestrutura existe. Semântica resolveria `psicólogo` e `personal trainer` sem depender de a palavra estar escrita. 🔴 **Mas cuidado com a regra de arquitetura já travada:** `fatos` é relacional e chamado por tool, nunca vetorizado; misturar os dois regimes é decisão de arquitetura, não de busca.

---

## Links
[[_aceite-lastro-na-resposta]] · [[_fila-correcoes]] · [[legalize-regua-de-prova-fonte-oficial]]
