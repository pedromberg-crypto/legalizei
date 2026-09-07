---
name: legalize-replica-de-tela-se-porta
description: "07/09: replicar tela do ME no MEI se faz PORTANDO a anatomia, não remontando no espírito dela; 5 telas erradas no mesmo dia geraram a trava verificar-anatomia-mei.mjs"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-07T22:55:46.701Z
---

Quando o Pedro pede "a mesma tela do ME, com a copy do MEI", o trabalho é
**portar a anatomia**: abrir o componente original e copiar o esqueleto
(wrappers, ordem, primitivos do DS, classes de layout). Montar uma tela que
*faz a mesma coisa* não é replicar — e ele percebe em 1 print.

Em 07/09 ele pegou **5 telas** seguidas pela mesma raiz, em 3 rodadas de
correção: M7 remontada com `Rolagem`+`Rodape` no lugar do esqueleto da C0
(chegou comprimida); cartão de ocupação com a pill à esquerda, cinza e com
jargão de órgão; M6.1 com lista plana onde o E9.1 tem acordeão de blocos;
M7.S com a busca no topo em vez de fixa no rodapé; telas de status escuras com
um `TelaHeader` que o `PainelView` não renderiza no escuro.

**Why:** cada tela isolada "funcionava". O defeito só aparece com as duas lado
a lado, e quem fazia essa comparação era o Pedro — trabalho de pessoa pra achar
o que um script acha em 1 segundo. E ele derrubou minhas duas defesas: a de
citar uma decisão antiga como exceção ("4 etapas não pedem agrupamento", de
28/08, anterior ao acordeão virar padrão) e a de dizer que já tinha revisado.

**How to apply:**
1. Antes de escrever, LEIA o componente do ME e liste o esqueleto. Não confie
   na descrição dele nem na memória do que ele faz.
2. Rode `node execucao/flow/verificar-anatomia-mei.mjs` (roda sozinha junto com
   o `gerar-mapa.mjs`). Diferença não declarada em `DIVERGENCIAS_OK` é defeito;
   declarada, é decisão com motivo escrito.
3. Peça compartilhada > cópia: `_timeline-blocos.tsx` e `_cartao-ocupacao.tsx`
   existem pra as telas do ramo não divergirem **entre si**.
4. A trava pega ESTRUTURA. Espaçamento, token de cor e copy continuam sendo
   olho humano no print — não afirme que está fiel só porque ela passou.
5. Se ele apontar o mesmo tipo de defeito 2 vezes, pare de corrigir a tela e
   corrija a origem. Ver [[legalize-metodo-alteracao-tela-travado]].
