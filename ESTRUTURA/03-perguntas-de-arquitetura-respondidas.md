---
tipo: resposta
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [estrutura, leo, agente, arquitetura, rag, escalacao, orquestracao]
---

# 03 — Quatro perguntas de arquitetura, respondidas com o que existe

**Origem:** quatro perguntas recebidas de fora (20/09), sobre routing, RAG, máquina de
estado e orquestração. **Respondido em 2026-09-20**, commit `69f2acb`, medindo o repo,
não lembrando.

🔑 **Régua adotada na resposta:** dizer o que existe, o que não existe e o que existe
desligado — sem transformar pendência em plano nem lacuna em intenção. Três das quatro
respostas são "não existe", e é assim que elas foram entregues.

Ver [[01-arvore-de-arquivos]] (o que existe em disco) e
[[02-arquitetura-vs-realidade]] (o diagrama caixa por caixa).

---

## 1. Classificação de Estado (Routing)

> **Pergunta:** Como o sistema diferencia um usuário de um prospect no instante zero no
> WhatsApp? Há uma automação via webhook fazendo um lookup do número de telefone em um
> CRM ou banco de dados antes que a primeira mensagem atinja o LLM, ou você está
> esperando que a IA descubra isso conversando?

**Não existe.** Não há webhook, lookup de telefone, CRM ou banco de clientes antes do
LLM. A configuração do runtime tem `platform_toolsets.whatsapp: [skills]` — a lista
inteira é essa. Nenhuma conexão com dado de cliente está ligada.

A distinção usuário × prospect hoje é 100% conversacional, e nem isso está formalizado:
`grep` por "prospect", "lead" ou "é cliente" nos 214.788 caracteres do vault devolve
**zero ocorrência**. O agente não tem o conceito.

Contexto que explica a lacuna, e não a desculpa: o produto está em **pré-lançamento**, o
app não tem link de download, e a conversão de hoje é lista de espera. O agente não está
com cliente — está com a equipe interna, 3 contatos. Ou seja, ainda não existe base de
usuário pra consultar, o que torna a classificação de estado uma pendência de
arquitetura, não um bug em produção.

O que existe de "roteamento" é outra coisa, e vale não confundir: é o roteamento **de
assunto para documento**, feito pelo próprio LLM. Nenhum roteamento de pessoa para
trilha.

---

## 2. Aterramento de Dados (RAG)

> **Pergunta:** No nicho contábil, onde não há margem para erros, como a base de
> conhecimento técnica está construída? As regras de negócios e manuais do aplicativo
> estão vetorizados em um banco de dados externo para consulta pontual, ou você tentou
> inserir todas as diretrizes no prompt de sistema do agente?

Não é nenhuma das duas opções. Não há vetorização, embedding ou banco externo, e também
não está tudo no system prompt.

A arquitetura é **seleção de arquivo por roteamento semântico + leitura integral**:

* Sempre no contexto: `SOUL.md` (23.297 chars) + o `description` da categoria (1.869) =
  **25.166 chars**, 11,7% do vault.
* Sob demanda: 4 skills de procedimento (40.935) e **13 notas de conhecimento**
  (69.123), abertas por `skill_view(skill, file_path)`.
* A ferramenta **não tem busca e não lê seção**: devolve o arquivo inteiro, com dedup
  por sessão.
* O índice é escrito à mão: uma tabela "pergunta do cliente → caminho do arquivo" na
  skill de atendimento, mais os 13 caminhos válidos no `description` da categoria, que
  passa inteiro no prompt.

A precisão no nicho não vem de recuperação, vem de regra dura: número mora em **um
arquivo só**, o `SOUL` **nunca** guarda número (ele foi a causa raiz do bug de
setembro — entregava a regra de fidelidade no próprio prompt, e a nota do contrato foi
aberta **1 vez em 632 chamadas**), e o enquadramento de CNAE tem gate por confiança —
só a faixa `alta`, 118 de 1.332 códigos, autoriza o agente a afirmar.

Os números medidos do custo desse desenho: razão prompt/resposta de **373 para 1** num
"oi", **0,57%** dos tokens encostando na resposta, aproveitamento de **37% a 44%** do
que é carregado.

🔴 E o furo que importa: numa suíte conversada, o agente **abriu a nota que proíbe
especular sobre a lista do MEI e especulou mesmo assim** ("designer é atividade
intelectual e não pode ser MEI" — falso). É falha de **aderência**, não de recuperação.
Vector DB não teria evitado.

---

## 3. Mapeamento de Escalonamento (State Machine)

> **Pergunta:** Como você está quantificando o progresso do lead na venda? Quais são os
> gatilhos exatos (semânticos ou de pontuação) que determinam que o lead está pronto
> para a conversão ou que a IA esgotou seus argumentos e precisa acionar um encerramento
> ou transferência para um humano?

**Não há quantificação de progresso, pontuação de lead, nem estágio instrumentado.**
Não existe máquina de estado.

O que existe é uma **lista dura de gatilhos semânticos**, avaliada pelo LLM, em 4
famílias:

1. **Julgamento que não é nosso** — valor fechado de imposto ou pró-labore quando a
   pessoa recusa a estimativa; anexo ou alíquota exata de um CNAE específico;
   interpretação de cláusula.
2. **Dinheiro já perdido** — multa recebida, cobrança indevida ou em duplicidade, guia
   paga errada, dado errado descoberto depois do protocolo na Junta.
3. **Decisão comercial fora da tabela** — cancelamento, reembolso, negociação de multa,
   desconto fora da lista de ofertas, empresa com passivo.
4. **Pessoa** — pediu humano, irritação escalando, ameaça de processo ou exposição,
   acusação de golpe que não cedeu à prova.

Três regras de precedência travadas, que são o que de fato faz o desenho funcionar:

* **"Não tente mais uma vez."** Um gatilho basta. Não existe tentativa antes de passar a
  bola.
* **O gatilho vence a pergunta de preço, mesmo na mesma frase.** "Tomei multa do meu
  contador, quanto custa aí?" é escalação: acolhe o prejuízo, avisa, e não passa tabela.
* **Fora do escopo NÃO é escalação.** EPP, comércio, indústria, Lucro Presumido, fora de
  BH, 5+ sócios: nenhum atendente resolve o que o produto não faz. É *gate de saída*,
  com régua própria.

Existe também a lista inversa — o que **não** é gatilho e o agente responde sozinho —,
porque escalar demais lota o time.

🟡 O que falta, e está declarado como pendente no próprio documento: **a fila de destino
não existe**. A tabela assunto → destino (contador com CRC, comercial, financeiro,
operação, atendimento prioritário) está marcada como proposta aguardando ok. Enquanto
isso, tudo escala para um canal humano único. Não há handoff técnico implementado, só a
mensagem avisando que um atendente assume a conversa.

E não há evento de conversão porque não há o que converter ainda: pré-lançamento, lista
de espera.

---

## 4. Camada de Orquestração

> **Pergunta:** Qual middleware gerencia o tráfego entre o WhatsApp, as bases de dados e
> a IA? Você está utilizando plataformas de automação visual para estruturar a lógica
> condicional e reter o histórico das chamadas (memória) entre os subagentes?

**Nenhuma plataforma visual.** Sem n8n, Make, Typebot ou Dify. O middleware é um runtime
de agente em código: **Hermes Agent**, com perfil próprio no servidor.

| camada | o que é |
|---|---|
| Servidor | VPS Hostinger KVM 2 · 2 vCPU · 7,8 GB RAM · **sem GPU** · sem swap · Ubuntu 24.04 |
| Runtime | Hermes Agent, perfil dedicado do agente |
| Canal | ponte WhatsApp em Node (baileys), rodando dentro do gateway |
| Modelo | `gemini-3.1-flash-lite`, fallback `gemini-3.5-flash-lite` |
| Estado | SQLite (42 MB): `messages`, `sessions`, `session_model_usage`, `gateway_routing` |
| Plugins | `leo-formatador` (filtro de saída) e `leo-cadencia` (quebra em 2 mensagens) |

Sobre memória e subagentes, que é o núcleo da pergunta:

* **Não há memória long-term.** O toolset `memory` existe no catálogo do Hermes e está
  **fora** da lista de toolsets ligados — foi removido de propósito. Zero memória entre
  conversas.
* **Não há subagentes.** Nenhum MCP ligado, nenhuma delegação.
* **O `context_engine` existe e está desligado.** Ele traria `select_context()`,
  `prune_tool_results_only()` e `on_turn_complete()`. Nunca foi ativado.
* A única memória é o **histórico da sessão do WhatsApp, reenviado inteiro a cada
  turno**. É a lei de custo do sistema: numa conversa real de 8 turnos, o turno 8 custou
  mais que o turno 1 **sem abrir documento nenhum**.

⚠️ Um detalhe de produção que vale o aviso: os dois plugins se atrapalham. O formatador
converte tabela em lista, e o de cadência desiste de quebrar a resposta em duas
mensagens se houver lista.

Sobre custo, já que ele costuma ser o argumento pra arquitetura mais enxuta: a razão
medida é de **3,747 caracteres por token** (115,9M chars contra 30,9M tokens, 662
sessões), e 50 mil usuários dariam ≈ 230M tokens/mês ≈ **US$ 34/mês**. **Custo não é o
risco deste produto.** O risco é aderência.

---

## O que as quatro respostas dizem juntas

As perguntas cobrem 4 camadas. **Três voltaram "não existe"** (classificação de estado,
memória/subagentes, máquina de estado) e **uma voltou "existe, mas não é o que se
supõe"** (RAG, que aqui é índice escrito à mão + leitura integral).

🔑 A leitura honesta: o que está construído é **documentação bem organizada com um
roteador fraco**. O que falta não é conteúdo — são as camadas de estado. E o próximo
ganho não está em recuperar melhor, está em **aderir** ao que já foi recuperado, que é
onde o único defeito de qualidade medido apareceu.

🔴 Nada disso é fila de trabalho. O agente não está com cliente, então nenhum item aqui
tem urgência de produção — ver [[legalize-agente-whatsapp-vault-isolado]]. A ordem de
valor medida está no [[briefing-agente-leo-2026-09-20]] §9.
