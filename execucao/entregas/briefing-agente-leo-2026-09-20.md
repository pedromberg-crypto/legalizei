---
tipo: briefing
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [execucao, entrega, leo, briefing, contexto, custo, arquitetura]
---

# Briefing — o agente Léo: onde estamos e o que estamos caçando

**Para quem é:** outra IA, ou outra janela, que precisa entrar nesta frente sem
histórico. Lido inteiro, este documento substitui a conversa.

⚠️ **Dados sensíveis omitidos de propósito:** IP do servidor, números de telefone e
chaves de API não estão aqui. Quem precisar deles pede ao Pedro.

---

## 1. O negócio, em cinco linhas

**Legalizai** é um app de contabilidade digital para **ME de serviço no Simples
Nacional**, geo **Belo Horizonte/MG**. Sociedade entre **Pedro** (PM e sócio, dev solo)
e **Mauro** (dono de um escritório contábil de 22 anos em BH). Negócio fechado em
07/07/2026. Concorrente de referência: Contabilizei.

🔒 **Escopo travado, e ele muda a regra, não é etiqueta:** ME no Simples, **Anexos III
e V**, com ou sem Fator R · atividade de **serviço** · **1 a 4 sócios** pessoa física
no Brasil · sócio **sem benefício algum**. **Fora:** Anexo I (comércio), Anexo II
(indústria), Anexo IV, Lucro Presumido, Lucro Real, EPP (só como porta de saída),
regularização de passivo. MEI entra como regime atendido, com motor próprio.

**Estado do produto:** pré-lançamento. O app não tem link de download. A conversão de
hoje é a lista de espera.

---

## 2. O que é o Léo

**Agente de atendimento por WhatsApp.** Personagem: um **suricato-sentinela**,
primeira pessoa, PT-BR, vigilante fundido com astuto. A personalidade é **travada pelo
Pedro** e não está em discussão em nenhuma otimização.

🔴 **O Léo NÃO está com cliente.** Está só com a equipe interna (3 contatos). **Nunca
priorize um item argumentando "está machucando usuário agora"** — não existe usuário.

**O que ele é hoje, honestamente:** ~70% bot bem escrito, ~30% agente. O que é agente
de verdade: escolher qual documento abrir, se recuperar de erro de nome de arquivo,
entender intenção com gíria e erro de escrita, variar a fala. **O que está desligado e
seria agente:** memória entre conversas, ação própria (cron), consulta a dado do
cliente, e a ferramenta `consultar_cnae` (prometida desde julho, nunca implementada).

---

## 3. A pilha técnica

| camada | o que é |
|---|---|
| **Servidor** | VPS Hostinger KVM 2 · 2 vCPU · 7,8 GB RAM · **sem GPU** · **sem swap** · Ubuntu 24.04 · carga 0,00 |
| **Runtime do agente** | **Hermes Agent** (`/usr/local/lib/hermes-agent/`), perfil em `~/.hermes/profiles/leo/` |
| **Canal** | ponte WhatsApp em Node (baileys), rodando dentro do gateway |
| **Modelo (produção)** | **`gemini-3.1-flash-lite`** via API do Google. Trocado em 20/09 |
| **Modelo (anterior)** | `gemma4:31b` na Ollama Cloud — **cota mensal estourada em 19/09 (HTTP 429)** |
| **Estado** | SQLite em `state.db` (42 MB): `messages`, `sessions`, `session_model_usage`, `gateway_routing` |
| **Plugins ativos** | `leo-formatador` (filtro de saída) e `leo-cadencia` (quebra em 2 mensagens, **só no WhatsApp**) |

**Conceitos do Hermes que importam:**

* **`skill_view(name, file_path)`** — a única forma de ler documento. **Não tem busca e
  não lê seção:** devolve o arquivo inteiro. Tem dedup por sessão.
* **Carregamento sob demanda** — só o `SOUL.md` e o `description` de cada skill ficam
  sempre no contexto.
* 🔑 **O `description` de cada skill é truncado em 57 chars + "..."** no catálogo. O
  `description` da **categoria** passa inteiro. Isso não está documentado em lugar
  óbvio e custou muito tempo para descobrir.
* **`context_engine`** (desligado) — tem `select_context()` que substitui a lista de
  mensagens, `prune_tool_results_only()` que descarta payload antigo sem chamar LLM, e
  `on_turn_complete()` que indexa estado de roteamento.
* **Toolsets disponíveis e desligados:** `file` (traz `search_files` do ripgrep e
  `read_file` com `offset`/`limit`), `session_search`, `cronjob`, `connections`.
  ⚠️ `file` traz junto `write_file` e `patch`, e **o Hermes roda como root**.

---

## 4. A documentação que o agente consulta

Fonte-verdade: **`execucao/agente-whatsapp-vault/` no repo**. O VPS é cópia; o
`sync-vps.sh` sincroniza com `diff` obrigatório e backup.

```
00-SOUL-personalidade.md   23.297  ⬆ sempre no prompt. Personalidade + gate de leitura
skills-legalizai/
  DESCRIPTION.md            1.759  ⬆ passa INTEIRO. Gatilhos + os 13 caminhos válidos
  atendimento/SKILL.md     10.856  procedimento, piso da conversa
  vendas/SKILL.md          19.403  🔴 maior arquivo, 5% de aproveitamento
  escalacao/SKILL.md        9.224  passar para humano
  base-legalizai/
    SKILL.md                  949  esvaziado em 20/09 (era índice de 2.763)
    references/00..12      65.700  as 13 notas de conhecimento
_testes/
  casos.yaml               21.293  58 casos de 1 turno
  casos-conversados.yaml    ~9.000 3 conversas de 12 turnos (novo, 20/09)
  runner/rodar_testes.py   ~15.700 cópia versionada do runner
```

**Regras duras da documentação:**
1. Número mora em **um arquivo só**, e o `SOUL` **nunca** guarda número.
2. **Nada de instrução de sistema** no meio do conhecimento.
3. **Bastidor não entra no corpo** (caminho, changelog, nome de ferramenta).
4. **Sem travessão** em nenhum arquivo — regra dura de marca.
5. **Regra nova nasce com caso de teste no mesmo commit.**

---

## 5. O problema que estamos caçando

**Não é qualidade. É custo de caminho.** As respostas já estão num nível satisfatório;
o Pedro as chama de "boas, não excelentes".

**O diagnóstico, em três números medidos:**

| | |
|---|---|
| razão prompt/resposta num `"oi"` | **373 para 1** |
| fração dos tokens que encosta na resposta | **0,57%** num "oi", **0,165%** numa pergunta de alíquota |
| aproveitamento do que é carregado | **37% a 44%** (contado com viés a favor) |

🔑 **A lei que explica tudo:** o que entra no contexto **nunca sai** e é reenviado em
toda chamada seguinte. Numa conversa real de 8 turnos, o **turno 8 custou mais que o
turno 1 sem abrir documento nenhum**.

🔑 **E o corolário:** a diferença entre a pergunta mais simples e a mais complexa é de
**27%**. O piso é quase tudo. **Otimizar a pergunta difícil rende pouco; matar o piso da
fácil rende tudo.**

---

## 6. O que já foi medido e mudado (18 a 20/09)

### O ponto de partida
Bateria de 58 casos no `gemma4:31b`: **2,43M tokens por rodada**, 157 chamadas.
**68% disso era o prefixo, repetido 157 vezes.** O `10-CONTRATO` tinha sido aberto **1
vez em 632**; o índice `base-legalizai`, **434 vezes**, das quais **308 só para traduzir
nome de arquivo em caminho**.

### As três versões do pacote

| | o que mudou |
|---|---|
| **v10** | o pacote de 19/09, sem mudança nossa |
| **v11** | `description` cortados para caber nos 57 chars · **caminho completo** nas tabelas · índice esvaziado · os 13 caminhos válidos no `DESCRIPTION.md` da categoria |
| **v12** | `platform_hints` resolve a briga de formato · blocos de prompt de agente de codificação desligados · `memory` e `tts` fora · skill `hermes-agent` desabilitada · **gate de leitura sobe para o `SOUL`** |

### O resultado, A/B no mesmo modelo e no mesmo dia

| métrica | v10 | v11 | **v12** | v10 → v12 |
|---|---|---|---|---|
| chamadas de API | 18 | 12 | **9** | **−50%** |
| tokens por caso | 18.822 | 12.341 | **10.106** | **−46%** |
| custo da rodada (5 casos) | US$ 0,0280 | US$ 0,0189 | **US$ 0,0146** | **−48%** |
| índice aberto | 4 | 0 | **0** | |
| placar | 3/5 | 4/5 | **5/5** | |

**O `"oi"` isolado: 2 chamadas e 16.770 tokens → 1 chamada e 8.987. −46%.**

### 🔑 O achado que mais mudou a qualidade

O trailer de produção do WhatsApp mandava *"write markdown freely, bullets included"*
enquanto o SOUL proibia tabela, título e travessão — e o `leo-formatador` desfazia
depois. **Três camadas discordando sobre a mesma coisa.**

Corrigido por `agent.platform_hints`, que agora diz que as regras do `SOUL.md` são
autoritativas. **O caso que reprovava por verbosidade em todas as rodadas caiu de 366
para 209 chars e passou.** As respostas encurtaram porque **pararam de receber ordem
contrária** — não porque o modelo melhorou.

---

## 7. Os testes: duas suítes, jobs diferentes

| suíte | formato | mede | custo/rodada |
|---|---|---|---|
| **Curta** | 18 casos de 1 turno | conhecimento, regressão, **atribuição** | **US$ 0,03** |
| **Conversada** | **3 conversas × 12 turnos** | curva de custo, acúmulo, **condução** | **US$ 0,082** |

**Por que as duas, e não uma:** turno em conversa custa ~2× um caso isolado (o acúmulo
é reenviado). E quando um turno falha no meio de uma conversa, **não dá para saber se foi
a nota, o contexto acumulado ou algo de três turnos atrás**. Conversa mede custo e
condução; caso isolado é onde se acha o culpado.

**Como rodar** (no VPS, em `/root/Leo-Agente/testes/`):
```bash
./rodar_testes.py -m gemini-3.1-flash-lite -p gemini -j 1 -c <ids>
LEO_PERFIL=leo-v10 ./rodar_testes.py ...   # perfil com o pacote antigo, para A/B
```

**Schema de asserção por turno** (adicionado em 20/09): o campo `esperado` é uma lista
**paralela** a `turnos`. A entrada i vale para a resposta do turno i, e a falha sai com
endereço (`t7: faltou /281/`). Antes disso o runner só verificava a **última** resposta,
o que tornava conversa longa inútil como teste.

### O que a suíte conversada achou na primeira rodada

🔴 **O agente inventou uma regra jurídica.** Perguntado "sou designer e faturo 12 mil",
respondeu *"sua atividade é intelectual e não pode ser MEI"*. **Designer não está na
lista de intelectuais regulamentadas**, e o `05-DICIONARIO` §4C proíbe explicitamente
especular sobre a lista do MEI. **Ele abriu a nota que proíbe especular e especulou.**
O caminho certo era por faturamento: 12 mil/mês = 144 mil/ano, acima do teto de 81 mil.

**A bateria de 58 casos nunca pegaria isso:** ela testa "vocês atendem?" e "faturo 15
mil" em casos separados, e nenhum força o agente a **justificar** por que é ME.

---

## 8. Régua de método (vale para quem continuar)

1. 🔴 **Não rodar bateria por iniciativa própria.** Autorização é por pedido, nunca por
   sessão ou por assunto.
2. 🔴 **Documento de alto grau se lê INTEIRO**, 100% literal, e se declara quanto foi
   lido.
3. **Número sem fonte não entra.** Sempre valor + fonte + confiança.
4. 🔴 **Placar não é métrica confiável.** Piso de ruído medido: **amplitude de 3 pontos,
   σ 1,07** em 9 rodadas do mesmo pacote. **Diferença de até 3 pontos é ruído.**
5. 🔴 **O placar inclui conserto de plugin.** O `leo-formatador` roda também na bateria
   (`LEO_FORMATADOR_FORCAR=1`) e vale **1 a 2 pontos por rodada**. O `contabiles-frequencia`
   **reprovou 11 vezes em 11 pelo modelo** e o relatório mostrou ✅ nas 11.
6. **A fonte-verdade é o repo**, o VPS é cópia. Editar lá e não sincronizar recria o bug
   das duas cópias divergindo, que custou semanas em setembro.
7. **Medir antes de reorganizar**, e escrever a previsão **antes** de aplicar.

---

## 9. Onde estamos, e o que está aberto

### Fechado
Passos 1 a 3 aplicados e medidos (v12) · suíte conversada construída e rodada ·
runner com asserção por turno · perfil `leo-v10` para A/B · relatório versionado em
`_testes/relatorios/`.

### 🔴 Aberto, por ordem de valor

| # | item | tamanho |
|---|---|---|
| 1 | **`vendas` tem 19.403 chars e 5% de aproveitamento.** Não foi aberto em nenhum dos 5 casos curtos nem nas 3 conversas | maior objeto morto |
| 2 | **`atendimento` tem 12.591 chars e abre em 100% das conversas** — ataca o lado caro (input novo é 82% da conta) | maior objeto vivo |
| 3 | **O agente especula sobre a lista do MEI** — é aderência, não rota | qualidade |
| 4 | Tags do frontmatter + `buscar_base` — as tags **já existem e são 100% inertes** | arquitetura |
| 5 | Classificador de mensagem (padrão documentado pelo Google, ~US$ 0,0001/chamada) | arquitetura |
| 6 | Descarte via `prune_tool_results_only` | **~10%**, e não mais que isso: o cache já cobra 1/10 do reenvio |
| 7 | Curadoria via `on_turn_complete` + versionamento do pacote | produto |

### ⚠️ Armadilhas conhecidas
* Erro de provedor (HTTP 429/404) **vira caso reprovado**: o runner pontua a mensagem
  de erro como resposta do Léo. Sempre conferir o texto antes de acreditar num placar ruim.
* O runner lê o `state.db` do perfil `leo`, fixo. Rodada em outro perfil reporta
  "0 ferramentas" mesmo tendo usado.
* `gemini-2.5-flash` e `gemini-2.5-flash-lite` dão **404, "no longer available to new
  users"**, apesar de aparecerem no `ListModels`.
* `gemma-4-31b-it` é grátis no Google mas o limite é **16.000 tokens de input por
  minuto**, e uma chamada nossa usa ~10.200. Inviável como bancada.
* **Apagar sessão no banco não basta:** o gateway mantém a sessão e o cache de dedup em
  memória. **Tem que reiniciar o gateway depois de apagar**, senão a medição vem contaminada.
* Os dois plugins brigam: o `leo-formatador` converte tabela em lista, e o
  `leo-cadencia` **desiste de quebrar em duas mensagens se houver lista**.

---

## 10. Preços e a régua de custo

Razão medida: **3,747 chars por token** (115,9M chars contra 30,9M tokens, validada em
662 sessões).

| modelo | in/M | out/M | cache/M | disponível? |
|---|---|---|---|---|
| **`gemini-3.1-flash-lite`** | **0,25** | 1,50 | **0,025** | ✅ **em uso** |
| `gemini-3.5-flash-lite` | 0,30 | 2,50 | 0,03 | ✅ |
| `gemini-3.8-flash` | 0,75 | 3,75 | 0,075 | ✅ |
| `gemma-4-31b-it` | grátis | grátis | **sem cache** | ⚠️ 16k TPM |
| `gemini-2.5-*` | 0,10 / 0,30 | | | ❌ 404 |

**Escala:** 50 mil usuários ≈ 230M tokens/mês ≈ **US$ 34/mês** no `3.1-flash-lite`.
**Custo não é o risco deste produto.**

🔑 **A métrica certa não é token nem dólar. É `custo por decisão útil`:** quanto de cada
documento carregado apareceu na resposta. Hoje: **37% a 44%**.

> **Economia aqui não é cortar inteligência. É parar de carregar o que a inteligência
> não usou.**
