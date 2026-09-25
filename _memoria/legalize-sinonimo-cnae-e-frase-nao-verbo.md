---
name: legalize-sinonimo-cnae-e-frase-nao-verbo
description: "24/09 travado - sinonimo de busca CNAE e frase com objeto, nunca verbo solto; 4 dos 87 tem venda na propria atividade."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-25T02:18:03.748Z
---

O critério de entrada de um sinônimo em `pesquisa/cnae-matriz/cnae-aliases.json` (contrato legível em `_sinonimos.md`):

- ✅ **substantivo de profissão ausente da tabela inteira** — `psicologo`, `personal trainer`
- ✅ **frase inteira, com o objeto junto** — `vendo roupa`, nunca `vendo`
- ✅ **verbo sem ambiguidade nenhuma** — `revenda`, `revendo`
- 🔴 **verbo solto que uma atividade nossa também usa** — `vendo`, `venda`, `comercializo`

**Why:** eu ia mapear `vendo`/`venda`/`comercializo` direto para comércio. Medi antes e o tiro sairia pela culatra: **4 dos 87 CNAEs que a casa atende têm venda na própria atividade** — `7312-2/00` (venda de espaço publicitário), `7319-0/02` (promoção de vendas), `7490-1/04` (representação comercial), `5911-1/02` (comercial de TV). O alias amplo trocaria uma violação de A3 por um falso negativo **pior**: dizer "não atendemos" a quem a casa atende. Errar para "não atendemos" é barato quando a pessoa não é cliente; é caríssimo quando ela é.

**How to apply:** todo termo novo passa pelo `npm run teste:cnae` antes de entrar — se casar com algum dos 87, não entra. Os três casos-guarda (`vendo espaco publicitario`, `faco promocao de vendas`, `sou representante comercial`) existem para derrubar quem alargar o alias um dia.

🟡 **`sou representante comercial` não cobra código de propósito.** A ambiguidade é real: `7490-1/04` (representação em geral, serviço, a casa atende) × `4512-9/01` (representante de **veículos**, comércio, não atende), e as duas são leituras legítimas da mesma frase. Quem desempata é a pessoa, e a regra do verbo no `tools-def.ts` manda o Léo perguntar. O caso guarda só que nenhum alias sequestre a frase (checagem sobre `achou_por`).

⏳ Se "vendo + coisa" virar padrão no uso real, o certo **não** é alongar a lista de alias — é a busca aprender que verbo de venda pesa contra atividade de serviço. Isso é mudança de busca, com critério de aceite. Ver [[legalize-busca-cnae-tres-camadas]].
