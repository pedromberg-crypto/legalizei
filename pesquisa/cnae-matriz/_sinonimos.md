---
tipo: contrato
status: vivo
data: 2026-09-24
assunto: sinonimos-de-busca-cnae
autoridade: contrato
deriva_de_codigo: [pesquisa/cnae-matriz/cnae-aliases.json]
tags: [cnae, busca, leo, sinonimos]
---

# 🏷️ Os sinônimos de busca — e a regra que decide o que entra

> Fonte: `cnae-aliases.json`. Carregado em `fatos.cnae_sinonimos` pelo
> `seed/carregar-cnae.ts`, e consultado **antes** de qualquer similaridade —
> quando bate, devolve com score 1.00 e para.

## Por que esta camada existe

Duas razões, e as duas foram medidas em 24/09:

**1 · Palavra que não existe em campo nenhum.** `psicólogo` não aparece no título oficial, nem no amigável, nem nos **542 caracteres** de termos do IBGE. 🔑 Nenhum índice, peso ou embedding acha palavra que ninguém escreveu.

**2 · Palavra que existe e leva pro lugar errado.** *"vendo roupa"* devolvia `7723-3/00 Aluguel de roupa, fantasia, traje de noiva` — com `atende_me = true`. O casamento é legítimo: *roupa* está mesmo no título. O que falta é a busca saber que **"vendo" significa comércio**.

---

# 🔴 A regra: sinônimo é FRASE, não verbo solto

Eu ia mapear `vendo`, `venda`, `revenda` e `comercializo` direto para comércio. Medi antes, e o tiro sairia pela culatra: **4 dos 87 CNAEs que a casa atende têm venda na própria atividade.**

| CNAE | | O que quebraria |
|---|---|---|
| `7312-2/00` | Venda e aluguel de espaço publicitário e outdoor | *"vendo espaço publicitário"* |
| `7319-0/02` | Promoção de vendas | *"faço promoção de venda"* |
| `7490-1/04` | Representação comercial e intermediação de negócios | *"comercializo para terceiros"* |
| `5911-1/02` | Produção de vídeo publicitário e comercial de TV | *"faço comercial de TV"* |

🔑 **Um alias amplo trocaria uma violação de A3 por um falso negativo pior** — dizer *"não atendemos"* a um cliente que a casa **atende**. Errar para "não atendemos" é barato quando a pessoa **não é** cliente; é caríssimo quando ela é.

## Então o critério para entrar é este

| | |
|---|---|
| ✅ **Substantivo de profissão que não existe na tabela** | `psicologo`, `personal trainer` |
| ✅ **Frase inteira, com o objeto junto** | `vendo roupa`, não `vendo` |
| ✅ **Verbo sem ambiguidade nenhuma** | `revenda`, `revendo` — ninguém revende serviço |
| 🔴 **Verbo solto que uma atividade nossa também usa** | `vendo`, `venda`, `comercializo` |

⚠️ E **todo termo novo passa pelo teste antes de entrar**: se ele casa com algum dos 87, não entra. O `npm run teste:cnae` guarda isso.

---

# A lista de hoje

| Termo | → CNAE | Por quê |
|---|---|---|
| `psicologo` · `psicóloga` · `psicologia` | `8650-0/03` | 🔴 palavra ausente da tabela inteira. Cai em `exige-conselho` |
| `personal trainer` · `personal` | `9313-1/00` | idem. Cai em `exige-alvara-previo` |
| `vendo roupa` · `vendo roupas` | `4781-4/00` | 🔴 devolvia *Aluguel de roupa*, que a casa atende |
| `revenda` · `revendo` | `4789-0/99` | comércio sem ambiguidade |

🔑 **Os quatro primeiros apontam para CNAE que a casa NÃO atende, e isso é o certo:** a resposta útil é a **recusa com motivo**, e ela só acontece se o CNAE certo for encontrado.

## O que fica de fora, e é decisão consciente

*"vendo comida"*, *"vendo bolo"*, *"vendo artesanato"* e o resto do universo de **"vendo + coisa"** não estão aqui. Cobrir isso por alias é jogo de whack-a-mole, e o lugar certo é a **regra do agente** (`tools-def.ts`): quando o título devolvido não é o que a pessoa disse, ele **pergunta** em vez de cravar.

⏳ Se o padrão aparecer no uso real, o certo não é alongar esta lista — é a busca aprender que verbo de venda pesa contra atividade de serviço. Isso é mudança de busca, com critério de aceite, e não sinônimo.
