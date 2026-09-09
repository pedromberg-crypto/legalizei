---
name: legalize-metodo-teardown-funcionalidade
description: "09/09: teardown na conta paga do Pedro, só leitura. Ler o DOM antes de clicar, refazer toda aritmética, e seguir a funcionalidade até onde ela vira guia."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T15:01:08.336Z
---

**Destrinchar UMA funcionalidade até o fim, na conta logada da Contabilizei, rendeu mais que semanas de leitura por fora.** Método completo em `produto/_metodo.md`.

**Why:** o pró-labore parecia um campo de valor, mas é o nó onde Fator R, INSS, eSocial e IRPF se cruzam. Desenhá-lo destravou de uma vez o cálculo de imposto, o calendário e o informe anual.

**How to apply:**
- 🔒 **Conta de PRODUÇÃO.** Ler, expandir, filtrar, selecionar rádio pra revelar conteúdo e sair sem confirmar. **Nunca** salvar, confirmar, recalcular, pagar ou preencher com dado real. Registrar no cabeçalho da evidência o que foi tocado.
- **Escolher pelo que destrava**, não pelo que é fácil: quantas outras funcionalidades esta responde?
- **Varrer o caminho inteiro.** O que mais rendeu não estava na tela do pró-labore: estava em `Impostos a pagar` e numa página **sem entrada no menu** (só link de rodapé) com a matemática toda.
- **`get_page_text` ANTES de clicar.** Devolve os modais que ainda não abriram; foi assim que saíram o algoritmo, a política multi-sócio, o anti-nudge e a trava de saída.
- **Refazer toda aritmética.** Foi o que virou observação em achado: 178,31 ÷ 1.621 = 11% provou que o "DARF Unificado" é a guia do INSS do pró-labore.
- 🔴 **Nunca ratificar dado fiscal por tela de concorrente.** A tabela do IRRF deles ficou marcada como NÃO ratificada.
- **Fechar com desenho**, nunca resumo: o que copiamos, o que fazemos diferente, e as fórmulas que viram teste unitário.

Relacionado: [[legalize-pasta-produto-fonte-verdade]] · [[legalize-contabilizei-dossie-coverage]] · [[legalize-pedro-confere-ui-sozinho]]
