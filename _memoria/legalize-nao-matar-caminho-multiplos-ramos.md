---
name: legalize-nao-matar-caminho-multiplos-ramos
description: "11/09 travado — não corrigir um ramo matando outro; todo nó depois de uma bifurcação é compartilhado, e o gerar-processos simula os caminhos pra provar."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2688ec1e-65f2-4a08-be2f-0e4bac11906a
  modified: 2026-09-11T15:08:23.365Z
---

🔴 **Travado em 11/09, a pedido do Pedro:** *"parece que você não está sabendo lidar com múltiplos caminhos, e nesse trabalho isso será o mais comum de todos. Preciso que a gente não mate um caminho corrigindo outro."*

O placar que gerou a regra: **o P4.6 foi reescrito três vezes num dia, e as três correções foram dele.** Na terceira eu propus REMOVER um nó que continuava vivo no ramo de até R$ 50.

**A raiz é enquadramento, não desatenção:** eu tratava o nó como espaço a preencher dentro do caminho que estava na minha cabeça, em vez de perguntar quantos caminhos passam por ele. Num processo com bifurcação, **todo nó depois da primeira decisão é potencialmente compartilhado**.

🔑 **"A pergunta morreu" ≠ "o trabalho morreu".** Nó que perde a pergunta vira passo; só some quando perde também o trabalho.

Duas regras estruturais que saíram junto:
1. **A unidade de decisão é uma mudança que deixa o grafo VÁLIDO** — não se fatia mudança em pedaços que, aceitos sozinhos, matam um caminho. A religação anda no mesmo pacote da mudança que a exige.
2. **Operação ambígua por construção pede primitivo próprio.** "Trocar o rótulo de uma aresta" escrito como apagar-e-recriar com as mesmas pontas gerou linha duplicada no board E apagou as duas no simulador. Virou `rotula`.

**Why:** regra escrita não bastou — a §5 da doutrina ("sintoma repetido = bug de raiz") já existia e eu errei três vezes no mesmo nó, no mesmo dia. O que segura é a máquina conferir.

**How to apply:** antes de mexer em nó ou aresta, responder por escrito: quantos ramos passam aqui · o que o nó faz para CADA ramo · se eu mudar isto, o outro ramo ainda chega ao fim. E rodar `node execucao/processos/gerar-processos.mjs`, que simula três cenários (base · todas aceitas · **cada uma sozinha com as dependências que declara**) e reporta só o que piorou em relação à base. Na estreia achou 45 avisos reais. Doutrina §6.4. Ver [[legalize-doutrina-processos-nao-se-enche-sozinha]] e [[legalize-replica-de-tela-se-porta]].
