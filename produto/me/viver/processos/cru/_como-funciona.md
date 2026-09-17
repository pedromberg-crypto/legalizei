---
tipo: verdade
status: vivo
data: 2026-09-12
assunto: modo-cru-varredura-por-categoria
autoridade: fonte-verdade
tags: [execucao, processos, metodo, cru]
---

# 🥩 Modo cru — varredura por categoria

> 🧭 **Autoridade:** manda no MÉTODO da varredura crua. O desenho completo (com API, tela e semáforo) continua em [[_doutrina-processos]], e ele **não foi revogado** — foi adiado.

## Por que existe

Travado em 12/09, provocação do Pedro:

> *"Cada movimentada mínima que fazemos gera uma movimentação e leitura absurda de diversas pontas de diversos lados diferentes e eu juro que nessa leva eu quero de fato desenhar os processos, agora não me interfere saber se tem tela, se tá na tela, se não tem tela, não quero saber se ela vai funcionar dia 1 ou dia 90."*

Ele estava certo, e o diagnóstico é mecânico: **três das cinco colunas da doutrina são perguntas de fora.** "Com quem fala" é API. "O que a pessoa vê" é tela. O semáforo 🟢🟡🔴 mede *"sabemos e dá"*, que arrasta as duas de volta. Sobravam duas colunas de processo de verdade — e, pior, o gerador **obrigava** a responder as de fora pra aceitar o registro das de dentro (`fala` vazio derrubava a rodada; passo amarelo exigia dúvida escrita).

🔑 **A frase do Pedro que organiza tudo:** *"independente de quem vai executar — API, humano ou usuário — o processo e suas variáveis precisam ser executadas."* Se isso é verdade, quem executa pode esperar.

## As regras

1. **A unidade é a CATEGORIA**, não o processo. São as 8 do PDF de 58 funcionalidades ([[FUNCIONALIDADES]]). Uma categoria por vez, até o fim.
2. **Dois campos obrigatórios:** `o` (o que acontece) e, quando for decisão, `variavel` + `saidas`. Nada de quem dispara, com quem fala, o que a pessoa vê.
3. **Sem semáforo.** No lugar, uma marca que é de dentro: **`fechado`** (toda variável tem todas as saídas escritas) × **`aberto`** (falta saída). Isso se mede sem saber nada de API, tela ou prazo.
4. 🔴 **Fronteira é NOTA, não aresta.** Saiu da categoria? `saiPara: "impostos · a receita entra na apuração"`. Não ligar. As ligações são a fase final, e é lá que ganham sentido.
5. **Toda funcionalidade da categoria tem que ser tocada.** Cada nó declara o que `cobre`, e o gerador avisa qual item da lista a varredura não encostou.
6. **`ja:` aponta pro passo que já existe** no formato completo (P1–P6). Não é duplicata: é o mapa dizendo *"esse pedaço já foi desenhado lá"*. No fim da varredura a gente decide se absorve ou mantém os dois.

## O que eu PARO de fazer na varredura

- cruzar com tela e com o handoff de dados a cada passo
- exigir `fonte` por passo — só quando a variável em si estiver em dúvida
- abrir evidência do líder pra tudo
- oferecer sugestão com ✓/✕ no meio da varredura

## O que continua valendo

- **A tabela de saídas.** Ela responde *"toda condicional tem todas as respostas?"*, que é o coração do modo cru, não a burocracia dele.
- **Não matar um caminho consertando outro** ([[_doutrina-processos]] §6.4).
- **Palavra, nunca glifo** (§2.1) e **uma nota = um assunto**.

## ⚠️ A ressalva declarada

"O que acontece" sem "quem faz" às vezes **esconde uma variável**: *"confere se a nota foi aceita"* é 1 passo se for API e 3 se for humano conferindo. A varredura **não pergunta quem faz**, mas quando a granularidade depender disso o nó leva `⚠️ pode virar mais de um passo` na `nota`. Não trava, e evita refazer na fase de conexão.

## Ordem das categorias

Começou por **🧾 Notas fiscais** por três motivos: é a que o Pedro conhece de cor, já tem P3 e P6 pra absorver, e é a que **alimenta todas as outras** (a receita nasce ali), então as notas de fronteira das próximas categorias já nascem certas.

## Links
- [[FUNCIONALIDADES]] · [[_doutrina-processos]] · [[PROCESSOS]]
