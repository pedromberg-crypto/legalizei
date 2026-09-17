---
name: legalize-modo-cru-varredura-categoria
description: "12/09 - o Pedro parou a esteira de processos; nasceu o modo cru, varredura por categoria sem tela, sem API e sem semaforo."
metadata: 
  node_type: memory
  type: project
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-12T21:43:36.028Z
---

🥩 **Modo cru, travado em 12/09.** Provocação do Pedro: *"esse formato de
validação está sendo confuso; nessa leva eu quero de fato desenhar os
processos, agora não me interfere saber se tem tela, se vai funcionar dia 1 ou
dia 90."*

**Ele estava certo, e o diagnóstico é mecânico:** três das cinco colunas da
doutrina de processos são **perguntas de FORA** — "com quem fala" é API, "o que
a pessoa vê" é tela, e o semáforo mede *"sabemos e dá"*, que arrasta as duas de
volta. Pior: o gerador **obrigava** a responder as de fora pra aceitar o
registro das de dentro (`fala` vazio derrubava a rodada).

**As regras:**
1. A unidade é a **CATEGORIA** do PDF de 58 ([[legalize-pasta-produto-fonte-verdade]]), não o processo.
2. Dois campos obrigatórios: `o` (o que acontece) e, em decisão, `variavel` + `saidas`.
3. **Sem semáforo.** No lugar: `fechado` (toda variável tem todas as saídas) × `aberto`.
4. 🔴 **Fronteira é NOTA, não aresta.** `saiPara: "impostos · a receita entra na apuração"`. Ligar agora seria adivinhar; as conexões são a fase final.
5. Toda funcionalidade da categoria tem que ser tocada (campo `cobre`).
6. `ja:` aponta pro passo que já existe no formato completo (P1–P6) — não é duplicata.

**Onde vive:** `produto/me/viver/processos/cru/` — fonte por categoria, `gerar-cru.mjs`,
regras em `_como-funciona.md`. Vista no `/processos` por um grupo próprio no
seletor. O formato completo **não foi revogado, foi adiado**.

🔒 **Escopo virou DADO + SCRIPT no mesmo dia:** ME do Simples, Anexos III e V,
com ou sem Fator R. `_escopo.mjs` é a fonte e `verificar-escopo.mjs` roda dentro
dos 3 geradores. Ver [[legalize-escopo-me-simples-anexos-3-5]].

**Ordem das categorias:** Notas primeiro (fechada em 12/09), 🏠 **Home por
último** — decisão do Pedro, porque ela é a leitura de todas as outras e no fim
nasce precisa.
