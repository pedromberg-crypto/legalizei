---
tipo: marco
status: vivo
data: 2026-09-19
assunto: agente-leo
autoridade: memoria
tags: [marco, agente, leo, whatsapp, prompt, rag]
---

# O Léo respondia de memória porque o prompt entregava o número

**19/09/2026.** Pedido do Pedro: *"analise a documentação"* do pacote que alimenta o Léo no Ollama. Leitura integral, **18 arquivos, 137.700 caracteres, 100%** (regra de [[legalize-leitura-integral-documento]]). Diagnóstico conjunto com a janela do VPS, que trouxe a medição de runtime que eu não tinha.

## O achado central

O `10-CONTRATO-GARANTIA-CANCELAMENTO` foi aberto **1 vez em 632** chamadas de `skill_view`, e essa única vez foi um teste ad-hoc, não a bateria. O `08-MAPA-DO-DOSSIE`, **zero vezes**.

A causa não era o modelo desobedecer. Estava no `SOUL:276`, arquivo que fica **sempre no contexto**:

> 🔴 **Contrato, fidelidade, multa, cancelamento e garantia: leia `10-CONTRATO` antes de responder, sempre.** [...] Condição que pesa contra o cliente (**fidelidade de 12 meses, multa de 30% do saldo**) se diz na entrada, com o número

**A linha que manda abrir o arquivo entregava os dois números do arquivo.** O modelo lia, já sabia, não abria. E do ponto de vista dele isso não é responder de memória: está escrito no prompt.

O mesmo defeito estava em `vendas` (aberto 314×, guardava os 4 preços, os 2 tetos, a data em 5 lugares e os números da fidelidade) e em `04-QUEBRA-OBJECOES`.

## O custo real disso

Os **7 dias de arrependimento** existem **só** no `10`. Não estão no `SOUL`, não estão no `vendas`.

Então o agente vinha respondendo fidelidade com a parte que assusta (12 meses, multa de 30%) e **omitindo a que tranquiliza**, porque a fonte da parte boa era o arquivo que ele não abria. Nunca por má-fé do documento: por arquitetura de contexto.

## O que a bateria não via

51 casos, e **nenhum** de fidelidade, cancelamento ou garantia. As 17 sessões que tocaram o assunto eram **todas o mesmo caso `venda-irritado`**.

Por isso o documento mais caro de errar era o menos consultado e ninguém notou — até um humano perguntar no WhatsApp.

## O segundo eixo: aderência ≠ consulta

Das 3 falhas da bateria de 19/09, **2 não eram falta de consulta**:

* `comercio-gate-saida` falhou **depois de já ter aberto o `09`** (2º arquivo mais consultado, 124×). Violou duas regras 🔴 que viviam no **§5 de um arquivo de 10 KB**: comeu os canais e pescou uma atividade de serviço que o cliente não citou.
* `venda-insistencia` tinha a regra de cadência no `vendas` §3 **e** no `SOUL`. Não aderiu.
* `regime-indefinido` era o `USER.md` (ver abaixo), não documento.

🔑 **Isso separa a correção em duas.** Tirar número do `SOUL` resolve **consulta**. Posição e brevidade resolvem **aderência**. Foi por isso que o `09` virou dois arquivos: fatos ficam no `09`, "como recusar" vai pro `12-GATE-DE-SAIDA`, com as 4 regras que mais falham em §1 a §4.

## O que veio da janela do VPS

Medição que eu não tinha, e que derrubou duas hipóteses minhas:

* **`skill_view` existe e funciona.** Eu suspeitei que o pacote fosse escrito para um runtime de Skills que o Ollama não teria. Errado: 1.525 chamadas medidas.
* **`num_ctx` não é o gargalo.** Meu suspeito nº 1. Sem sinal de aperto: 0 compactações, 0 truncagens, e o endpoint serve 131k para outro modelo.
* **`skill_view` não trunca.** Segundo bug que eu suspeitei e não existe.

E trouxe um achado que vale mais que tudo isso: 🔴 **o `USER.md` injeta o perfil do Pedro em toda conversa**, inclusive de cliente real. Profissão, faturamento, atividade paralela e um trauma pessoal. O modelo já usou como se fosse do interlocutor (*"como designer com faturamento de 10k por mês"*, dito a quem não falou nenhum dos dois). É **por perfil, não por contato**, e o subsistema que escreve nele já vazou mensagem pro cliente uma vez. Não é otimização de documento: é vazamento de dado entre conversas.

## O que mudou

| | antes | depois |
|---|---|---|
| `SOUL.md` | 32.675 chars | **21.805** (−33%) |
| system prompt base | 40.937 chars | **~31.300** |
| número da Legalizai fora das notas | `SOUL`, `vendas`, `04` | **nenhum** |
| `09-ESCOPO` | 10.105 chars, 13 🔴 | **5.201** + `12-GATE-DE-SAIDA` |
| casos de teste | 51 | **58** |
| cópias do vault | 2, divergindo | **1**, no repo |

Commits: `a184759` · `eb1c8ae` · `26e905a`.

## O que ficou aberto

* 🔴 **O limiar dos 54 CNAEs.** Dos 87 atendidos como ME: 24 `alta`, 56 `media`, 7 `baixa`. O `11` §3 autoriza afirmar só com `alta`; o `09` §4 autoriza os 65 `III-fixo`, e **54 desses são `media`**. Decisão do Pedro com a contadora — escolher o limiar corta ou libera 72% da capacidade de resposta.
* 🔴 **Quatro pendências de runtime, todas do dev:** `USER.md`; `_SKILL_VIEW_PRUNE_MIN_CHARS` em 5.000 com 7 das 13 notas acima disso; roteador determinístico que force o `10` quando o assunto for fidelidade; e **4.859 chars de diretivas do Google** no prompt de um modelo Ollama.
* **A cota free do Ollama estourou.** Prompt de pesquisa de provedores em `Downloads/prompt-gemini-provedores-llm-2026-09.md`, com a pergunta de privacidade isolada — free tier costuma treinar com os dados, e o agente recebe CPF sem pedir.
* **Self-host morreu nas duas máquinas.** VPS sem GPU (2 vCPU, 7,8 GB); notebook com RTX 3050 de 6 GB não comporta nenhum dos candidatos (`gemma4:31b`, `nemotron-3-ultra`, `gpt-oss:120b`). A máquina local serve para **loop de iteração com um 8B**, poupando cota para o comparativo.

## A lição que generaliza

**Documento não conserta modelo que não abre o documento.**

Três camadas, e elas são independentes:
1. o valor existir num lugar só (**corrigido hoje**)
2. o modelo decidir consultar (**hoje depende dele; roteador resolve**)
3. o modelo obedecer ao que leu (**posição e brevidade**)

Relacionado: [[legalize-agente-whatsapp-vault-isolado]] · [[legalize-numero-no-prompt-mata-consulta]] · [[legalize-leitura-integral-documento]] · [[legalize-nao-rodar-e2e-sem-pedir]]
