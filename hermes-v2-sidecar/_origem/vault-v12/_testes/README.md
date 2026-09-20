---
tipo: verdade
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [execucao, agente, whatsapp, leo, teste, bateria]
---

# Bateria de testes do Léo

🔴 **Esta pasta NÃO sobe pro VPS como skill.** Só `skills-legalizai/` é o que o agente lê em runtime. O `casos.yaml` é a régua que mede o agente, não conteúdo que ele consulta.

## O arquivo

`casos.yaml` — **58 casos**, em 19/09/2026. Cada caso nasceu de uma falha real, não de imaginação: as primeiras 20 vieram das conversas de WhatsApp de 16/09, as do meio dos aceites do handoff de 17/09, e as últimas 7 do ciclo de 19/09.

Roda pelo `rodar_testes.py`, no repo do agente no VPS.

## Schema

| Campo | O que é |
|---|---|
| `id` | identificador único |
| `itens` | aponta para `exports/melhorias-humanizacao-leo.md` (pode ser vazio) |
| `turnos` | mensagens do cliente, em sequência na mesma sessão |
| `deve` | regex que a **última** resposta precisa conter, sem diferenciar maiúsculas |
| `nao_deve` | regex que a última resposta não pode conter |
| `avaliar` | critério de leitura humana. **Não entra no placar** |
| `max_chars` / `min_chars` | trava de tamanho da resposta |

Além disso, toda resposta passa por 13 checagens globais em todos os turnos (tabela, título, citação, LaTeX, travessão, link não permitido, inglês, português de Portugal, vazamento técnico, frase proibida, impaciência, promessa de envio, nega fidelidade) e pelo teto de 8 linhas.

## 🔄 Sincronia

**A fonte-verdade é aqui**, igual ao vault. Mesma regra e mesmo motivo: antes de 19/09 o vault tinha duas cópias divergindo, e foi assim que dado errado sobreviveu semanas.

* Caso novo escrito aqui → sobe pro VPS.
* Caso novo escrito direto no VPS → volta pra cá **no mesmo dia**.
* Divergiu? A contagem acima (58) é a checagem mais barata que existe.

## ⚠️ Como ler o placar

**A bateria é flaky.** Em 19/09, quatro rodadas seguidas do `gemma4:31b` deram **51, 49, 48, 51** e as falhas não se repetiram entre elas. Uma rodada verde depois de uma mudança **não prova nada**: precisa de 3 ou mais rodadas e comparação de distribuição, senão a gente comemora ruído.

🔴 **Suspeita aberta sobre a origem da oscilação:** a bateria roda com `-j 6` e o plano Free do Ollama Cloud é **1 requisição concorrente**. Antes de usar o placar pra escolher modelo, vale uma rodada `-j 1` contra uma `-j 6`: se a variância cair, o baseline inteiro precisa ser com `-j 1`.

⚠️ **O baseline de 51/49/48/51 morreu em 19/09.** Ele é de um SOUL que não existe mais (encolheu 33%, e preço, fidelidade e data saíram dele e do `vendas`). Comparar modelo novo contra aquele número mistura modelo com documento.

🔴 **Vários casos checam número por regex** (`valores`, `aceite-preco`, `teto-com-valor`, `aceite-epp`, `venda-recusa`, `venda-escada`). Até 19/09 o agente passava neles copiando do `SOUL` e do `vendas`. Agora esses números vivem só nas notas, então esses casos passaram a medir *"ele abriu a nota?"*. **Se falharem na próxima rodada, olhe as ferramentas chamadas antes de concluir que o pacote piorou:** é mais provável que a bateria tenha ficado honesta.

## Buracos conhecidos

* **Não existe agregação por skill.** O `casos.yaml` não marca skill alvo. Adicionar um campo `skill:` é meia hora e passaria a dar taxa de acerto por área.
* **`avaliar` não entra no placar.** Os casos de leitura humana (`tom-cliente-neutro`, `humor-recorrente`, `imposto-exige-fechado`) dependem de alguém ler.
* **Cobertura desigual das notas.** Até 19/09 nenhum caso tocava contrato/garantia/cancelamento (o `10` era aberto 1 vez em 632) nem campo do dossiê (o `08`, zero vezes). Os 7 casos de 19/09 fecham isso. Notas ainda pouco exercitadas: `02-PRODUTO-E-USABILIDADE` (2 aberturas) e `03-REGRAS-DOS-ORGAOS` (7).
