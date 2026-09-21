---
tipo: marco
status: fechado
data: 2026-09-21
assunto: agente-whatsapp
tags: [leo, sidecar, producao, arquitetura, migracao]
---

# O Léo trocou de motor, e a lição não foi a arquitetura

Em 21/09, às **02:20:51**, o `leo-sidecar` entrou no ar e o `hermes-gateway-leo`
saiu. O agente de WhatsApp deixou de rodar no Hermes/Python com documentos lidos
por inteiro e passou a rodar em Node com Postgres, tool calling e pgvector.

A arquitetura está descrita em `hermes-v2-sidecar/` e os 28 relatórios da rodada
em `hermes-v2-sidecar/reports/`. Este marco registra o que **não** está lá: o que
o dia ensinou.

## 🔑 Regra negativa não impede alucinação. Obrigar a consulta, sim.

Foi medido quatro vezes, no mesmo dia, com o mesmo formato:

| defeito | o que existia | o que resolveu |
|---|---|---|
| presumiu o faturamento do cliente | regra §3.2, com o exemplo ❌ literal dentro | `consultar_escopo` obrigatória antes de diagnosticar |
| negou a fidelidade de 12 meses | o número estava na base, a regra mandava ler | descrição de `consultar_contrato` nomeando a SITUAÇÃO |
| afirmou ação que não executou | nenhuma régua cobria | proibição + a tool que dá o link de verdade |
| reabriu oferta já resolvida | §6 dizia que oferta recusada não se repete | regra de objeção encerrada |

🔴 **O caso mais didático:** a regra que proibia presumir faturamento entrou em
produção às 02:47 e foi desobedecida às **02:48**, com a frase exata que ela
proíbe, que estava escrita como exemplo ❌ dentro da própria regra.

A conclusão que fica: quando o modelo tem o dado de cabeça, mais uma frase no
prompt não compete com a memória dele. O que compete é **não deixar o caminho
existir**: a resposta passa a depender de uma consulta.

⚠️ E isso não é regra geral de LLM, é o que se mediu aqui, num modelo pequeno,
em quatro casos. Vale como hipótese forte, não como lei.

## O que muda no jeito de corrigir

Antes, defeito de comportamento virava linha nova no documento. Agora a primeira
pergunta é outra: **existe tool que devolva esse dado, e ela é obrigatória?**

Três consequências práticas:

* **Dado que o agente precisa afirmar mora em tabela, não em texto.** Os links
  viraram `fatos.link` depois de ele reescrever de memória
  `instagram.com/legalizai` no lugar de `instagram.com/legalizai.app/`. String
  exata não admite paráfrase.
* **Nome de campo é parte do prompt.** `atende_mei` significava "a CASA atende" e
  foi lido como "a LEI permite": o agente afirmou a um cliente que adestrador não
  pode ser MEI, enquanto a matriz dizia `mei_permitido: true` na mesma linha.
* **A régua precisa medir o que ele AFIRMA TER FEITO**, não só o que diz. "Já te
  coloquei na Lista VIP" passou por todas as checagens existentes.

## 🔴 O defeito mais caro não foi achado por teste nenhum

Nos turnos 7 e 10 de uma conversa real, o Léo mandou o cliente **assinar no
site**. O produto está em pré-lançamento e não existe checkout: ele mandou a
pessoa bater numa porta fechada, duas vezes, justamente nos dois momentos em que
ela disse sim.

Nenhuma regra proibia. Nenhuma regex cobria. **Só apareceu porque um humano leu a
conversa inteira.**

⚠️ É a mesma fronteira de sempre neste vault: trava pega vocabulário e estrutura,
nunca raciocínio. O olho do Pedro no print continua sendo a última camada.

## O que a migração ensinou de infraestrutura

O desenho blue-green pedido não se aplicava: **não há servidor web nem webhook**.
A conexão é Baileys, sessão pareada por QR, WebSocket de saída. A costura era o
contrato HTTP local da ponte.

🔑 E o detalhe que definiu o plano inteiro: a fila da ponte é **em memória e de
leitura destrutiva** (`splice`). A favor, isso garante que mensagem que chega
durante a troca de cérebro fica na fila. Contra, proíbe rodar dois cérebros em
paralelo, porque quem chega primeiro leva a mensagem. Não existia "sombra com
tráfego real" contra a mesma ponte.

## Custo, com número

Context caching explícito: **91,5% de acerto, 78,2% de economia**. Uma conversa
comercial completa de dez turnos custa **US$ 0,0152**.

**Custo não é o gargalo deste produto.** O gargalo é aderência, e sempre foi.

⚠️ Falta medir o **armazenamento** do cache por hora, que não aparece no
`usageMetadata` e não tem fonte no repo. Para rodada de teste é desprezível;
para produção 24/7, a conta é outra.

## 🔴 A dívida aberta deste marco

O código que **está atendendo cliente** não está no repositório. `PERSONA.md`,
`RULES.md`, `server.ts`, `tools-def.ts`, `e2e.ts`, `relatorio.ts`, um cartão
reescrito e a coluna `tokens_cache` vivem só em `/opt/hermes-v2-sidecar` na VPS.

Os 28 relatórios descrevem um código que não possuímos. Trazer isso é a primeira
coisa da próxima janela.
