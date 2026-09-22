---
tipo: relatorio-analise
status: gerado
data: 2026-09-22
assunto: hermes-v2-sidecar
tags: [sidecar, leo, tools, alucinacao]
---

# Os 15 turnos sem tool, em tres baldes

Fonte: `_testes-saida/e2e-2026-09-22-175701-curta.json`, suite curta, 28 turnos
com medicao por chamada. Custo desta analise: **zero** — e releitura do JSON.

Criterio de balde 3: afirmou preco, prazo, escopo, LINK ou elegibilidade sem
consultar, e errou ou nao tinha base.

| balde | turnos |
|---|---:|
| Nao precisava | **2** |
| Precisava e acertou (de memoria) | **9** |
| 🔴 Precisava e errou, ou afirmou sem base | **4** |

## 🔴 Balde 3, com as falas literais

### 1 · `vc-mentiu`, turno 2 — LINK INVENTADO — trilha `escalonamento`

> Se quiser entrar, o endereço é este: https://legalizai.com.br/lista-de-espera/
> e o nosso Instagram é https://www.instagram.com/legalizai.app/

O endereco real, em `fatos.link`: `https://www.legalizai.com.br/em-breve`.
Errou o caminho E o `www.`. O Instagram saiu certo. `consultar_links` estava na
mesa (a trilha `escalonamento` o oferece) e nao foi chamado.

🔴 E o defeito exato que a tabela `fatos.link` foi criada para impedir, e a
frase do `seed/04-links.sql` descreve o que aconteceu: "leu o trecho da nota e
REESCREVEU de cabeca".

### 2 · `venda-escada`, turno 3 — LINK SEM `www.` — trilha `tecnico`

> O site é https://legalizai.com.br/. No Instagram a gente posta as novidades:
> https://www.instagram.com/legalizai.app/

`fatos.link` diz `https://www.legalizai.com.br`. Faltou o `www.`, e e
literalmente o caso que o comentario da coluna `url` preve: "nao encurtar, nao
tirar o https, nao 'limpar' o final". Ofereceu a lista e nao entregou o link
dela.

### 3 · `venda-insistencia`, turno 2 — CAPACIDADE SEM A CONDICAO DO PLANO

> No MEI, eu gero a guia todo mês e te entrego pronta. Você só precisa acessar
> o app e pagar.
>
> No plano ME, o processo é o mesmo: eu cuido de tudo e te aviso quando a guia
> estiver disponível.

`07-OBRIGACOES-MENSAIS` §1: "Pro **nosso app trabalhar por ela** (emitir guia,
agir nos sistemas dos orgaos), o certificado **e necessario**, e no plano MEI
ele **nao vem incluso**: quem e MEI **paga a parte**."

A afirmacao sobre o ME esta certa. A sobre o MEI vende como incluso um servico
que exige custo extra — e a condicao omitida e comercial.

### 4 · `campo-dossie-iptu`, turno 1 — REGRA DE ORGAO TROCADA

> Preciso do número do IPTU para confirmar se a prefeitura de BH permite que a
> sua empresa seja aberta no endereço residencial.
>
> Algumas atividades e locais possuem regras específicas de zoneamento e, com o
> número, eu verifico se o seu imóvel atende às exigências para o registro do
> CNPJ.

`03-REGRAS-DOS-ORGAOS` §1: o indice cadastral "e o dado que **valida aquele
endereco na constituicao** — sem ele a Prefeitura nao localiza o imovel, e o
processo para". Zoneamento aparece para **imovel comercial**, nao residencial.

Duas trocas: a razao (localizar o imovel virou verificar permissao) e o sujeito
(a Prefeitura analisa, e ele disse "eu verifico"). A nota tem instrucao literal
contra isso: "O que a Prefeitura analisa e o enderecos, nao voce."

## Balde 1 — nao precisava (2)

| caso | turno |
|---|---|
| `saudacao-sequencia` 1 | "Olá / Oi / Oiiii" → "Olá! Como posso te ajudar hoje?" |
| `regime-indefinido` 1 | Pediu faturamento e regime ANTES de estimar. Nao afirmou nada — e o comportamento certo. |

## Balde 2 — precisava e acertou de memoria (9)

`vc-mentiu` 1 · `aceite-medo-nota` 1 · `contabiles-frequencia` 1, 2 e 3 ·
`venda-irritado` 1 · `link-app-pre-lancamento` 1 · `leo-em-nome-do-app` 1 ·
`venda-insistencia` 3.

Conferidos um a um contra a base: pre-lancamento sem link de loja, DAS,
pro-labore, obrigacao acessoria, multa e juros do governo, emissao de nota nos
dois planos, calculo e emissao da guia no ME, e passivo fora de escopo. Todos
certos. Deu certo de memoria — nao por consulta.

## ⚠️ Achado transversal: "Lista VIP" nao existe

Aparece em tres turnos (`vc-mentiu` 1, `venda-escada` 3, `link-app-pre-lancamento` 1).
Na base o nome e **lista de espera**, sempre. Nao entrou no balde 3 porque o
fato central de cada um desses turnos esta certo, mas e nome de canal inventado,
e nome de canal e vizinho de link.

## O que isto aponta

Dos 4 do balde 3, **2 sao de link**. `consultar_links`: oferecido 28, chamado 0.

A unica tool com obrigacao escrita na descricao, `consultar_escopo`, e a mais
chamada (6). As quatro em zero absoluto — `consultar_links`, `buscar_base`,
`consultar_cnae`, `buscar_cartao` — nao tem.
