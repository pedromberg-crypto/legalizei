---
tipo: criterio-de-aceite
status: aberto
data: 2026-09-22
assunto: agente-whatsapp-vault
destino: janela-da-VPS
tags: [leo, rag, buscar_base, aceite, lastro]
---

# 🎯 Critério de aceite · a resposta passa a ter lastro

> 📌 **Isto é um critério de aceite, não um desenho.** Pela trava 1 do
> `hermes-v2-sidecar/CLAUDE.md` §1.3, **onde o código mora é decisão da janela
> da VPS.** O que está aqui é o que precisa ser verdade quando terminar, e como
> se mede. Se o melhor caminho for outro, o caminho é seu — o número é meu.

## O problema, medido

Rodada `e2e-2026-09-22-185426-curta`, 28 turnos com medição por chamada:

| tool | oferecida | **chamada** |
|---|---:|---:|
| `buscar_base` | 28 | **0** |
| `consultar_cnae` | 24 | **0** |
| `estimar_das` | 22 | **0** |
| `consultar_links` | 28 | **1** |

**15 turnos sem tool nenhuma.** Em 4 deles o Léo afirmou sem base e errou
(`baldes-2026-09-22-turnos-sem-tool.md`). Em outros 9 ele **acertou de
memória** — que é o mesmo mecanismo, com sorte no lugar do erro.

🔑 **Dois dos quatro erros já foram fechados por código** (o filtro de
endereços). **Os outros dois têm a resposta escrita na base, palavra por
palavra, e o Léo não abriu:**

| caso | o que ele disse | o que a base diz |
|---|---|---|
| `venda-insistencia` 2 | *"no plano ME o processo é o mesmo, eu cuido de tudo"* | `07` §1: no MEI o certificado **não vem incluso**, paga à parte |
| `campo-dossie-iptu` 1 | *"com o número **eu verifico** se o imóvel atende ao **zoneamento**"* | `03` §1: o índice **localiza o imóvel**; quem analisa é a **Prefeitura**, e zoneamento é imóvel comercial |

⚠️ **Por isso a correção não é escrever mais base.** A base já responde. O
degrau quebrado é a consulta.

🔴 **E já está medido duas vezes que descrição não move chamada:** o
`consultar_links` foi reescrito no molde da tool mais chamada, com gatilho na
língua do cliente, e deu **0 de 27** — inclusive nos 4 turnos com o gatilho
nomeado. Quatro tools dizem "OBRIGATÓRIA" e estão em zero absoluto. **O que
move decisão é código.**

## ✅ O que precisa ser verdade quando terminar

| # | Critério | Como se mede | Hoje |
|---|---|---|---|
| **A1** | 🔴 **Nenhuma resposta de conteúdo sai sem lastro.** Turno que afirma preço, prazo, escopo, elegibilidade, regra de órgão ou capacidade do plano teve consulta à base antes | `buscar_base` **chamada** na suíte curta | **0 de 28** |
| **A2** | **Os dois casos param de errar.** `venda-insistencia` 2 e `campo-dossie-iptu` 1 passam a refletir o que a nota diz | releitura do balde 3 na rodada seguinte | 2 erros |
| **A3** | **Turnos sem tool alguma caem.** O balde 2 ("acertou de memória", 9 turnos) é sorte, não sistema — ele também precisa encolher | contagem de `(nenhuma)` no relatório | 15 de 28 |
| **A4** | ⚠️ **O custo não estoura e o cache não quebra.** Consulta a mais é token a mais; o que não pode é o prefixo do cache se invalidar | `taxaDeAcerto` ≥ 90% · custo por caso ≤ US$ 0,004 | 96,4% · US$ 0,00136 |
| **A5** | **O placar não cai.** Lastro que piora a resposta não é lastro, é ruído | placar da suíte curta ≥ 18/20, lido com o ruído de ±3 declarado | 18/20 |
| **A6** | **Chamada sem efeito continua visível.** Se a consulta rodar e voltar vazia, isso é buraco de conteúdo e tem que aparecer como tal, não como sucesso | colunas `chamada` × `com efeito` | já existe |

## ⚠️ O que este pedido NÃO autoriza

- **Mexer em `bridge.js`, `.service` ou na pasta de sessão** (§1). Nada aqui
  precisa disso.
- **Reescrever descrição de tool como conserto principal.** Já foi medido duas
  vezes; se entrar, entra como acessório de uma mudança de código, não no lugar
  dela.
- **Escrever base nova para resolver A2.** As duas respostas já existem. Se a
  consulta chegar e o texto estiver errado, isso é achado — vai para a
  `reports/_fila.md`, não para esta rodada.

## 📦 Como entregar

Uma rodada, um pacote (§1.2). No fim: `reports/` com a rodada nova e a
comparação dos seis critérios acima contra a linha "Hoje".

🗂️ **Achado fora do pedido vai para `reports/_fila.md` e a rodada segue**
(trava 3 do §1.3). A única exceção é achado que torne o pedido **impossível ou
sem sentido** — aí pare e diga, como no filtro que mediria zero no `server.ts`.

## Autonomia desta rodada

Dentro de `router.ts`, `server.ts`, `tools*.ts`, `db.ts`, `testes/`, `seed/` e
`scripts/`: **decida o desenho e vá até o fim sem pedir aprovação** (trava 2).
