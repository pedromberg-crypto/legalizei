---
name: legalize-processo-antes-da-tela
description: Método travado 11/09 — desenha o PROCESSO antes da tela; inventário de tela é cego pro que falta e virou fase 3
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-11T13:33:43.067Z
---

**Ordem travada: processo → tela → inventário.** Decidido pelo Pedro em 2026-09-11, revogando o plano de inventariar as 26 telas do portal primeiro.

**Why:** **inventário de tela só enxerga o que ESTÁ na tela. É cego pro que falta.** A prova saiu no primeiro pré-voo: achei "a `/mais/plano` não conhece fatura vencida" **por acaso**, porque tinha lido o modelo do líder duas horas antes. Sem a coincidência eu teria marcado 12 capacidades, dado a tela por inventariada, e o buraco continuaria invisível — agora **com selo de "verificado" por cima**, que é pior que buraco nenhum.

**How to apply:**
- Fonte: `execucao/processos/processos-data.mjs`. Gerador cospe **duas saídas**: `/processos` (board visual pro Pedro) e `PROCESSOS.md` (nota pro dev). Nunca editar as saídas.
- Passo tem **5 campos fixos**: `quem` · `faz` · `fala` · `ve` · `luz`. `faz` e `ve` em português comum (o Pedro disse que não domina jargão de programação); `fala` é a **única** coluna técnica, e é onde vai endpoint. Passo que só se explica com jargão está grande demais: quebra em dois.
- Semáforo: 🟢 sabemos e dá · 🟡 falta decidir · 🔴 não sabemos. 🔴 **não se pinta de verde por otimismo** — "acho que dá" é amarelo, "deve existir uma API" é vermelho. O gerador **recusa** amarelo/vermelho sem a dúvida escrita, e recusa verde que carrega dúvida.
- 🔑 **Os vermelhos são o produto do trabalho, não o defeito.** Processo que sai todo verde na primeira passada não foi desenhado, foi copiado.
- 🔴 **O inventário nasce da NOSSA TELA pra fora, não da lista do líder pra dentro.** Foi olhar pela lista dele que deixou `/mais/relatorios` e `/mais/servicos` invisíveis por um mês e meio.

**Fase 3 (inventário de capacidades com `data-cap`) não morreu, foi adiada:** congelar hoje uma tela com preço errado e botão que não baixa seria congelar o defeito. Doutrina em `produto/_doutrina-capacidades.md`.

⚠️ **Protege capacidade, não qualidade** — mesma fronteira da trava de anatomia do MEI.

Regras completas: `execucao/processos/_doutrina-processos.md`, que tem uma seção de **memória com os meus erros datados**, a pedido do Pedro ("não quero ver erro básico se repetindo").

Relacionado: [[legalize-cobranca-fatura-competencia]], [[legalize-pasta-produto-fonte-verdade]], [[legalize-replica-de-tela-se-porta]], [[legalize-nao-rodar-e2e-sem-pedir]].
