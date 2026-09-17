---
name: legalize-semaforo-mede-desenho-nao-insumo
description: "12/09 - o semaforo do /processos responde \"sabemos o que fazer\", nunca \"temos com que fazer\"; 8 passos verdes dependiam de insumo sem entrega combinada e nasceu o selo de insumo."
metadata: 
  node_type: memory
  type: project
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-12T16:04:56.782Z
---

🔴 **Dois eixos, e até 12/09 só um estava na tela.** O semáforo 🟢🟡🔴 do
`/processos` responde *"a gente sabe o que fazer aqui?"*. Ele **nunca** respondeu
*"a gente tem com que fazer?"*.

O achado veio do handoff de dados (`produto/me/devs/gerador/`), que cruzou o que a
constituição coleta com o que os passos consomem: **8 passos 🟢 verdes dependem
de insumo sem entrega combinada**.

- `P3.5` é verde e **não emite nota nenhuma** sem CCM e sem certificado
- `P4.24` / `P4.11` / `P1.1` são verdes e **não sabem que dia cobrar** sem a data
  do aceite do contrato
- `P2.1`, `P5.7`, `P3.9`, `P3.11` dependem do certificado A1, que vem da parceira

**O que mudou:** o cartão ganhou selo `⚠ N` na faixa do topo, **âmbar sólido
mesmo sobre faixa verde** (a dissonância é a mensagem), e o painel lista o que o
passo come com o estado de cada insumo. Fonte única: `dados-handoff.mjs`, lido
pelo `gerar-processos.mjs`. **Não existe segundo inventário.**

⚠️ **Fronteira do selo:** ele diz que o insumo **não tem entrega combinada**, não
que é impossível. "Nasce depois" é o CNPJ, que existe e vem do trecho assistido:
falta combinado, não desenho.

🔴 **Dado não vira cartão** (decisão do Pedro, 12/09): é pré-condição, não etapa.
Virar nó inventaria sequência onde só existe dependência, e a tabela de saídas
passaria a auditar caminho que não é caminho.

Doutrina: `_doutrina-processos.md` §7.1. Ver
[[legalize-fronteira-abertura-time-dev]] e [[legalize-processo-antes-da-tela]].
