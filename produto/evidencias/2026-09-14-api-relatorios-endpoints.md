---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, api, endpoint, arquitetura, sensivel]
---

# 🔌 A camada de API da aba Relatórios

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** conta logada, 14/09/2026. Chamadas feitas direto no `fetch` da própria sessão, lendo a resposta crua. **Nenhum PDF foi rebaixado ou relido** — esta nota é sobre o *contrato da API*, não sobre o conteúdo dos recibos (esse está em [[2026-09-14-declaracoes-mensais-serie-completa]] e [[2026-09-14-declaracao-anual-e-informe-de-rendimentos]]).

🔑 **Por que isto é ouro e a leitura do PDF não é:** o PDF diz *quanto* deu. O endpoint diz **quando o cálculo acontece, quem dispara, o que o sistema considera "pronto" e o que ele guarda**. É a engenharia por trás do número.

---

## 1 · 📋 Os endpoints, um a um

Base: `https://app.contabilizei.com.br/api/`. Autenticação por **cookie de sessão** (`credentials: include`), sem token no header — é sessão de aplicação, não API pública.

### Declarações

| Método | Rota | O que devolve |
|---|---|---|
| `GET` | `/plataforma/declaracao/mensal/declaracoes/{mes}/{ano}` | lista de declarações da competência |
| `GET` | `/plataforma/declaracao/anual/declaracoes/{ano}` | lista de declarações do **exercício** |

🔑 **A rota mensal é parametrizada por mês e ano na URL, sem corpo e sem filtro.** Ou seja: **uma chamada por competência**. Não existe endpoint de série — quem quiser os 9 meses faz 9 chamadas. É a razão pela qual a tela tem um seletor de mês em vez de uma tabela.

### Informe de Rendimentos / Lucro

| Método | Rota | O que devolve |
|---|---|---|
| `GET` | `/plataforma/informerendimento/recuperardadosdistribuicaocliente` | saldo de lucro, sócios, trava e data-limite |
| `GET` | `/plataforma/informerendimento/listSocioInformeRendimentos/{ano}` | sócios elegíveis ao informe |
| `GET` | `/plataforma/informerendimento/clientedistribuilucro?ano={ano}` | se o cliente distribui lucro |
| `POST` | `/plataforma/informerendimento/historico` | **telemetria** — grava que a tela foi vista |

### Plataforma / estado da conta

| Método | Rota | O que devolve |
|---|---|---|
| `GET` | `/plataforma/parametrosEmpresa/list/` | **as 21 feature flags do CNPJ** (§3) |
| `GET` | `/plataforma/aceite/list?idEmpresa={id}` | aceites de termo pendentes/dados |
| `GET` | `/plataforma/inadimplencia/consultasituacaomensalidadeempresa` | situação da mensalidade |
| `GET` | `/plataforma/menu/get` · `/appshell/get` · `/appbar/get` | montagem da casca |
| `GET` | `/plataforma/dadosempresa/badge` | contadores dos badges |
| `GET` | `/multiusuario/status/servico` | status do módulo multiusuário |

---

## 2 · 🔑 Os quatro achados de contrato

### 2.1 · O nome do recibo é DETERMINÍSTICO

Resposta de `mensal/declaracoes/8/2026`:

```json
[{"tipo":{"id":"PGDAS","sigla":"PGDAS","descricao":"…"},
  "situacao":"TRANSMITIDO",
  "listaReciboGD":["64037271000102/2026/08/PGDASD-RECIBO-64037271202608001.pdf"],
  "mensagem":null}]
```

O caminho decompõe em regra:

```
{CNPJ completo}/{ano}/{mês}/{SIGLA}-RECIBO-{raiz do CNPJ}{ano}{mês}{sequencial}.pdf
 64037271000102 / 2026 / 08 / PGDASD-RECIBO- 64037271  2026  08   001
```

🔑 **O caminho do documento é calculável, não consultável.** Quem conhece CNPJ + competência + tipo prevê o nome do arquivo. Para nós isso é **decisão de arquitetura, não detalhe**: se o nome é derivável, o armazenamento não precisa de tabela de índice — mas também significa que **a única coisa que protege o documento é a assinatura da URL**, nunca a imprevisibilidade do caminho.

### 2.2 · O mesmo campo tem DOIS formatos

| Rota | `listaReciboGD` contém |
|---|---|
| **mensal** | caminho **relativo** (`64037271000102/2026/08/…pdf`) |
| **anual** | **URL absoluta assinada** (`https://storage.googleapis.com/contabilizei-obrigacoes-prod/…`) |

🐛 **Duas equipes, dois contratos, um nome de campo.** O front tem que saber de qual rota veio para decidir se concatena o bucket ou não. É dívida técnica visível de fora — e é exatamente o tipo de coisa que a nossa regra de **capacidade declarada** existe para evitar ([[legalize-portal-lista-consolidada]]).

📦 **Bucket revelado:** `contabilizei-obrigacoes-prod` no Google Cloud Storage. Um bucket único, ambiente no nome, obrigações de todos os clientes juntas, segregação por prefixo de CNPJ.

### 2.3 · `{ano}` na rota anual é EXERCÍCIO, não ano-calendário

`anual/declaracoes/**2026**` devolve a **DEFIS do ano-calendário 2025**. `anual/declaracoes/2025` devolve **lista vazia**.

⚠️ É a mesma pegadinha das duas datas de nascimento da empresa ([[acionaveis]] §D1/D2): **o sistema tem dois eixos de tempo e usa o mesmo nome para os dois.** Quando desenharmos nossa tela de declarações, o rótulo precisa dizer *qual* ano — o que a declaração cobre, ou em que ano ela foi entregue.

### 2.4 · Ausência devolve `[]`, não erro

Competências antes da empresa existir (`mensal/8/2025`) e exercícios sem entrega (`anual/2025`) devolvem **HTTP 200 com array vazio**. `9/2026` também: setembro ainda não foi emitido.

✅ Bom desenho, e vale copiar: **"não existe" não é falha.** A tela distingue *vazio* de *quebrado* sem tratar exceção.

---

## 3 · 🔑🔑 As 21 feature flags por CNPJ — a arquitetura de produto deles, exposta

`GET /api/plataforma/parametrosEmpresa/list/` devolve, **por empresa**, o estado de 21 chaves:

| Chave | Valor na persona zero | O que revela |
|---|---|---|
| `VERSAO_JORNADA_ABERTURA` | `V3` | a jornada de abertura é **versionada**, e há pelo menos 3 |
| `DASHBOARD_VERSION` | `V2` | home também versionada por cliente |
| `CHAVE_TESTE_AB_ONBOARDING` | `FORA_DO_TESTE` | **teste A/B de onboarding rodando**, com clientes fora do teste marcados |
| `CHAVE_ROLLOUT_VITRINE_UPSELL` | `BULLET` | o **upsell tem rollout nomeado** — a camada à-la-carte é feature, não página |
| `CHAVE_CERTIFICADORA_TRANSPARENTE` | `V3-SAFEWEB` | a certificadora é **trocável por flag**; a Safeweb é a corrente |
| `CHAVE_SIMULADOR_IMPOSTOS_AVANCADO` | `LIBERADO` | simulador é liberado caso a caso |
| `_CHAVE_ROLLOUT_IRRF_INSS_ESOCIAL` | `null` | rollout **começado e não atribuído** |
| `RESOLUCAO_DEBITOS_IMPOSTOS_2025` | `NENHUM:NAO_POSSUI_IMPOSTOS_DEVIDOS` | chave **com ano no nome** — campanha de safra vira parâmetro permanente |
| `PAGAMENTO_RECORRENTE` / `_CONTA` | `V1recorrente` / `true` | cobrança recorrente também versionada |
| `CENTRAL_SOCIO_PROLABORE_HABILITADO` | `true` | pró-labore é **módulo habilitável**, não parte fixa |
| `NOVO_EMISSOR_NF_HABILITADO` | `true` | migração pro emissor nacional é flag por cliente |
| `BETA_CONTA_CONTABILIZEI` | `true` | conta digital em beta, e o Pedro está nele |
| `PRE_ABERTURA_CONTA_DIGITAL_KYC` | `true` | KYC **antes** da abertura |
| `CARD_PROLABORE_V2_PRIMEIRA_VISUALIZACAO` | `false` | granularidade até **"já viu este card?"** |
| `PLANOS_BANNER_FOLHA_VISUALIZOU` | `2026-09-09T14:29:12.838Z` | e às vezes guarda **timestamp**, não booleano |
| `CHAVE_ONBOARDING_PLATAFORMA_INICIADO` / `_FINALIZADO` | `true` / `true` | onboarding com começo e fim registrados |
| `TIMELINE_FINALIZADA` | `true` | a timeline de abertura tem estado terminal |
| `RESPONDER_NPS` | `false` | NPS é agendado por flag |

### O que isto ensina para o nosso produto

1. 🔑 **Tudo que é caro de decidir virou flag por CNPJ.** Certificadora, emissor de NF, versão da jornada, upsell, cobrança. Eles **não** decidem no código: decidem no dado, por cliente. É o oposto do nosso `flow-data.mjs`, que é global.
2. ⚠️ **Preferência de UI e regra de negócio moram na MESMA tabela.** `CARD_..._PRIMEIRA_VISUALIZACAO` (cosmético) convive com `CHAVE_CERTIFICADORA_TRANSPARENTE` (define quem emite o certificado). Misturar os dois é armadilha: quem limpa "flags antigas" pode derrubar uma regra fiscal.
3. 🐛 **`RESOLUCAO_DEBITOS_IMPOSTOS_2025`** — chave com ano cravado no nome. Em 2027 existirá a de 2026, e a de 2025 fica para sempre. É dívida por construção.
4. ✅ **`RESOLUCAO_DEBITOS_IMPOSTOS_2025 = NENHUM:NAO_POSSUI_IMPOSTOS_DEVIDOS`** prova que a persona zero **não tem débito nenhum** — e derruba minha leitura de que a aba de Informe estaria travada por pendência (era modal escondido no DOM, não estado de tela). Correção registrada em [[2026-09-14-declaracao-anual-e-informe-de-rendimentos]].

---

## 4 · 🕓 O que a varredura de API NÃO achou

| Procurado | Resultado |
|---|---|
| Endpoint de **cálculo** do DAS / PGDAS | ❌ não aparece no front — o cálculo é server-side, fechado |
| Endpoint que devolva a **memória de cálculo** (base, alíquota, repartição) | ❌ só o PDF do recibo tem |
| Endpoint de **série** (vários meses de uma vez) | ❌ não existe |
| Chamada disparada ao **selecionar sócio** no dropdown do Informe | ❌ **nenhuma** — todos os dados vêm no load da página |
| Chamada ao clicar **"Pré-visualizar"** | ❌ **nenhuma** — idem |

🔑 **A conclusão que interessa:** a tela é um **leitor de resultado**, não um motor. Todo cálculo acontece em lote, no servidor, antes de alguém abrir a tela — o que bate com os recibos transmitidos de madrugada em horário de lote ([[2026-09-14-declaracoes-mensais-serie-completa]]). ⚠️ Então **a equação não vai sair de engenharia reversa da API**: vai sair do PDF do recibo, da lei, e do Mauro. A API nos dá a **arquitetura**; ela não nos dá a **conta**.

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-14-declaracoes-mensais-serie-completa]] · [[2026-09-14-declaracao-anual-e-informe-de-rendimentos]] · [[legalize-api-antes-de-funcionalidade]] · [[legalize-metodo-teardown-funcionalidade]] · [[HOME]]
