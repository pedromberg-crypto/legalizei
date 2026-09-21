---
tipo: diretrizes
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [producao, arquitetura, regras, agente]
---

# CLAUDE.md · as diretrizes de ouro do Léo v2

Este arquivo vale para qualquer agente ou pessoa que edite este repositório.
Ele foi escrito em 21/09/2026, no dia em que o motor novo entrou em produção.
A partir dessa data nenhuma mudança aqui é acadêmica: existe um número de
WhatsApp ao vivo atendendo cliente real do outro lado.

As cinco regras abaixo não são preferências de estilo. Cada uma existe porque o
caminho contrário já custou dinheiro, tempo ou uma conversa ruim com cliente.

---

## 1. PRODUÇÃO

> Este ambiente está ao vivo. **NUNCA** altere `server.ts`, `bridge.js` ou
> arquivos `.service` sem autorização expressa.

Esses três são a camada que segura a conexão com o WhatsApp. `server.ts` é o
processo que consome a fila; `bridge.js` é a ponte Baileys que detém a sessão
pareada; os `.service` são o que o systemd usa para subir os dois.

O motivo de `bridge.js` estar nesta lista é específico: a pasta de sessão é um
aparelho registrado no WhatsApp. Quebrá-la não se conserta com `git revert` —
exige re-parear por QR, presencialmente, com o número fora do ar até alguém
escanear.

Autorização expressa significa uma pessoa dizendo "pode mexer nesse arquivo",
não uma tarefa cujo cumprimento implica mexer nele.

## 2. ARQUITETURA

> O `router.ts` é uma função pura de 4 trilhas. Não adicione complexidade
> cíclica nele. A inteligência mora no Prompt e nas Tools, não no IF/ELSE do
> código.

As quatro trilhas são `escalonamento`, `fora_escopo`, `tecnico` e `comercial`
(ver `tipos.ts`). O roteador escolhe uma, entrega as tools daquela trilha
(`TOOLS_POR_SAIDA` em `tools-def.ts`) e sai da frente.

Um `if` novo dentro do roteador parece barato e é o começo da máquina de
estados que ninguém consegue testar depois. Se uma situação nova não cabe nas
quatro trilhas, isso é conversa de arquitetura, não um `else if`.

## 3. MUTAÇÕES DE COMPORTAMENTO

> Se o Léo estiver errando uma resposta, a correção **DEVE** ser feita primeiro
> melhorando a descrição da tool (`tools-def.ts`), editando o `RULES.md` ou
> ajustando o RAG. Alterar código TypeScript para consertar texto é proibido.

A ordem de tentativa, sempre:

1. A descrição da tool em `tools-def.ts` — o modelo escolhe a tool pela
   descrição, então tool errada quase sempre é descrição fraca.
2. O `RULES.md` — regra de redação e de postura.
3. O RAG — cartões e notas de conhecimento, se o que falta é fato.

Só depois disso, e com o defeito já isolado, se discute código. Resposta ruim
consertada com `if` no TypeScript é regra que existe em um lugar onde ninguém
vai procurar, e que o próximo ajuste de prompt vai contradizer sem perceber.

## 4. TESTES E2E

> Testes rodam em memória. O comando `npm run e2e` **nunca** deve vazar para a
> ponte HTTP real.

O E2E monta suas próprias `Deps` em memória (`depsDeTeste`, em `testes/e2e.ts`)
e de propósito não grava em `conversa.mensagem`. Rodada de teste não suja o
histórico de produção, e cada caso precisa de sessão limpa para poder repetir.

As tools continuam batendo no banco de verdade — isso é intencional, é o que o
teste existe para exercitar. O que não pode acontecer é o E2E falar com a ponte
em `127.0.0.1:3000`: ali existe um número de WhatsApp real, e mensagem de teste
que vaza para lá chega em cliente.

## 5. CACHING

> Qualquer alteração no array de mensagens do Gemini deve preservar a estrutura
> exata para não quebrar o Context Caching (custa 1/10 do preço).

O preço em vigor está em `testes/contador.ts`: `cachePorMilhao` é um décimo de
`entradaPorMilhao`. A rodada de 21/09 às 00:04 mediu −80,3% de custo depois do
cache explícito.

O cache casa por prefixo idêntico. Trocar a ordem de dois blocos, inserir uma
linha no topo do sistema ou mudar espaçamento invalida o prefixo inteiro, e a
rodada seguinte paga preço cheio sem nenhum erro aparecer no log. O sintoma é
sempre o mesmo: a conta sobe e o placar não muda.

Depois de mexer no array, confira `taxaDeAcerto` no relatório da rodada. Se
caiu para perto de zero, o prefixo quebrou.

---

## O que ler antes de mudar qualquer coisa

| quero | leia |
|---|---|
| a persona e a voz | `PERSONA.md` |
| as regras de redação e postura | `RULES.md` |
| o que o produto faz | `CARTOES-PRODUTO.md` |
| o que cada suíte de teste prova | `testes/README.md` |
| quanto custou e o que o gasto comprou | `reports/` |
