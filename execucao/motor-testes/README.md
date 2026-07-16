# Motor de testes de fluxo — Legalizei

Testa a **lógica** dos fluxos do app (abertura de CNPJ e, depois, portal) rápido e barato: sem UI, sem gastar token de IA. Node puro, zero dependência.

> Arquitetura travada em [[2026-07-15-spec-telas-e-motor-testes]]. Personas: [[casos-teste-fluxo-cnae]].
>
> ⚠️ **v0.3.0 (2026-07-16) — A ORDEM MUDOU.** Fonte da lógica agora é **[[reordenacao-flow-cobranca-cedo]]** (telas N1–N25), que reordenou [[spec-telas-entrada-b1-b2]] + [[spec-telas-b3-b4-aterrissagem]] + [[blocos-fluxo-abertura]]. Execução: **ENTRADA → B1 → B3 → B2 → B4 → B4.5**. Os nomes dos blocos são os mesmos; **a cobrança subiu**. Ver B3 antes de B2 no relatório é o ponto, não um bug.

## Rodar

```bash
node run.js reta                 # flow #1 (abertura)
node run.js migra-limpo          # flow #2 (migrar) — o motor escolhe o schema por meta.flow
node run.js ajuste <passo> "<frase>" "<fonte>"   # registra um ajuste no livro-caixa
```

Exit code: `0` = PASS, `1` = FAIL, `2` = erro de uso.

## Peças

| Arquivo | O que é |
|---|---|
| `flow-schema.js` | **FLOW #1 — abertura.** O fluxo como **dados** (passos declarativos). Ordem v0.3.x: ENTRADA → B1 → **B3** → **B2** → B4 → B4.5. Números fiscais aterrados em [[fiscal-simples-bh-2026]] (config `FISCAL`). A IA de CNAE **não roda aqui**: vem dublada pela persona. |
| `flow-migrar.js` | **FLOW #2 — migrar** (quem já tem CNPJ e troca de contador). Era blind spot desde 15/07 (*"metade do mercado, zero testado"*). Reusa `FISCAL` do #1. |
| `personas/<id>.json` | Fixture: `respostas` (durável, cross-flow) + `eventos` (pausas roteirizadas) + `esperado` (trilha + veredito + status). |
| `run.js` | Motor headless. Percorre o schema, simula pausas, compara com o esperado, grava a corrida sozinho. |
| `historico-testes.jsonl` | Livro-caixa append-only. Duas linhas: `corrida` (o runner grava) e `ajuste` (tuning com fonte). |

## Livro-caixa (append-only)

Uma linha por evento, discriminada por `tipo`:

- **corrida:** `test_id · persona · persona_seq · flow · data · versao_flow · resultado · trilha`
- **ajuste:** `ajuste_id · test_id · passo · frase · fonte`

`fonte` é a ponte pro cruzamento de dados (link `[[concorrente / reunião / lei]]`). `test_id` é global e pra sempre.

## Como cresce (sem reescrever o motor)

- **Nova persona:** cria `personas/<id>.json`. Nada mais.
- **Mais telas do fluxo:** adiciona passos em `flow-schema.js` e sobe a `versao`. As personas duráveis já trazem as respostas prontas.
- **Novo flow (portal, notas, vencimentos):** vira outro schema. Motor é genérico; livro-caixa já tem a coluna `flow`. Abertura = flow #1.

## Convenção do schema

Cada passo: `pula_se` (condicional exclusiva não roda), `valida` (barra o fluxo), `deriva` (lógica → `{ resultado, dados?, veredito_b1?, termina? }`). Pausa = evento na persona, testando parar/esperar/retomar idempotente — não o órgão.

## Estado

### ✅ FLOW #2 — MIGRAR (v0.1.0, 2026-07-16) · **3 personas, 3 PASS**

Blind spot mais antigo do vault (*"metade do mercado, zero testado"*, desde 15/07) — agora existe. Esqueleto do [[fiscal-simples-bh-2026]] #14: **Distrato → TTRT CRC-MG → DBE Evento 232 → procuração e-CAC nova**.

**🔴 Achado da construção: o flow #1 não tinha porta pra cá.** O `entrada.fork` mandava quem escolhe "já tenho CNPJ" pra `saiu-fluxo` (login) — mas quem quer **trocar de contador não tem conta**. Metade do mercado batia numa porta escrita "faça login". O `m0.fork` corrige, e isso obriga a separar 3 coisas hoje coladas num botão só: *sou cliente* (login) × *tenho CNPJ e quero trocar* (migrar) × *tenho CNPJ e só quero cotar*.

**Por que o flow #2 é fiscalmente MELHOR que o #1:** empresa com 12+ meses usa **histórico REAL**, sem proporcionalizar (CGSN 140/18 art. 26). No #1 o teaser é promessa em cima de faixa — daí nasceu a `promessa-quebrada`. Aqui é **diagnóstico**, com o número dele. **`TEASER_PISO` e o risco de promessa quebrada não se aplicam ao #2.** E não há taxa de governo (a empresa já existe): o choque do UX-54 (~R$625 na 3ª tela) também some.

**Riscos exclusivos do #2** (nenhum tem irmão no #1):
- **`m4.ttrt`** — o TTRT no CRC-MG **depende do contador ANTIGO validar**. Todas as pausas do #1 esperam órgão (neutro) ou o próprio cliente; esta espera **um concorrente contrariado**, que está perdendo o cliente pra nós. Persona `migra-refem`.
- **`m4.pendencias`** — a empresa chega **com passado**: DAS atrasado, DEFIS vencida, dívida ativa. O #14 diz que a responsabilidade do período antigo é do contador anterior, mas **a dívida é da empresa**. Persona `migra-passivo`.
- **`m2.honestidade`** — se o contador atual já faz tudo certo, a resposta honesta é "seu enquadramento está correto" e vende-se **serviço**, não economia inexistente. É o UX-49 do #1 aplicado aqui.

| Persona | Testa |
|---|---|
| `migra-limpo` | golden path. Fator R real 8,1% → **paga R$1.900/mês a mais do que precisa**. O plano de R$195 se paga 9x |
| `migra-refem` | contador antigo **não valida o TTRT** → bloqueado com o cliente **já pago** |
| `migra-passivo` | R$4.800 de DAS + DEFIS + dívida ativa → migra, mas o motor **marca antes de assumir** |

**🟡 Pendência D (fila-Larissa, herdada da pesquisa):** o nº da resolução CFC (o Gemini escreveu "1.590/2020" mas a própria lista de refs dele cita CFC 987/2003 e 1493/2015 → possível citação trocada) e o código **"Evento 232"** contra o Coletor Redesim oficial. **Verificar em fonte primária antes de codar pra valer.** O motor testa a mecânica, não crava a citação.

### ✅ FLOW #1 — v0.3.2 (2026-07-16) · **16 personas, 16 PASS**

**v0.3.2 — auditoria spec × motor.** A rodada #5 achou 2 itens ✅ na spec que nunca viraram código; a auditoria varreu os 48 e achou **5**:
| Item | Prometia | O motor fazia |
|---|---|---|
| **UX-39** | "não cravar 28%, mirar ~30% de colchão" | usava `FATOR_R_LIMIAR` = **0.28 exato** — **dava o conselho que a spec proíbe**, e dizia "já otimizado" pra quem estava em 28,0% |
| **UX-24** | "as duas telas **não podem ser ilhas**: o ótimo consome o CLT" | simulador **sem uma referência a CLT** |
| **UX-06** | "**nunca trocar em silêncio**" + opt-in + trilha de auditoria | calculava o swap e **assumia a adoção**, contando economia que a cliente nunca escolheu |
| UX-25 | custo do pró-labore **por sócio** | 🔴 ausente (exige array de sócios na persona) |
| UX-30 | comunhão universal → dispara anuência do cônjuge | 🔴 detecta o regime, não dispara nada |

Os 3 primeiros: **corrigidos** (`FATOR_R_MARGEM`, `custoProLabore`, `adota_cnae_otimo`). Os 2 últimos: 🔴 abertos.

### ✅ v0.3.1 — rodada #5 de UX

**A cobrança subiu.** Gate CNAE → teaser de economia → **paga** → todo o dossiê dentro do app. Motivo e evidência em [[reordenacao-flow-cobranca-cedo]].

**Passos novos:**
| Passo | Tela | O que faz |
|---|---|---|
| `b1.triagem` | N4 | **fail-fast (UX-21) antes do dinheiro**: sócio no exterior · 3+ sócios. O UX-21 já mandava perguntar isso no B1, mas o motor v0.2.x só barrava lá no B2 — com cobrança no N9, isso viraria cobrar de quem não pode abrir |
| `b1.faturamento` | N4 | faixa guiada que alimenta o teaser |
| `b1.teaser` | N5 | **o pilar**: entrega a PROVA (existe economia, tem número) sem o produto. Carimbo UX-26 obrigatório |
| `b2.termo` | N20 | **termo irreversível** — a outra metade do T18, que rachou. Aqui a máquina liga e o dinheiro de governo sai |
| `b4.dispensas` | N21 | sanitária + bombeiros, com **consentimento informado** da autodeclaração. Furo exposto pela captura: no caso real foram **o gargalo** (18 dias, última etapa) |

**Mudanças de lógica:**
- `b3.pagamento` — **CPF valida elegibilidade** (mesmo campo que o gateway já exige, dois usos): irregular **não cobra**, roteia. E **boleto não termina mais o flow**: entra no app, faz o B2, trava em `b2.revisao` (export) + `b2.termo` (execução) até compensar.
- `b3.aceite` — só o **contrato** (reversível, CDC art.49 limpo). O irreversível desceu pro `b2.termo`.
- `b2.socio` / `b2.socios` — guard-rails de exterior e 3+ sócios **subiram** pra `b1.triagem`.
- 🐛 **bug corrigido (existia desde a v0.2.x):** o simulador decidia o anexo **só pela folha**, ignorando o CNAE. CNAE III-por-padrão (8599-6/04, SC Cosit 205/14) **já é Anexo III sem Fator R** — o motor dizia "Anexo V" pra quem já estava em III e recomendava pró-labore ótimo desnecessário. Campo novo: `cnae_anexo_padrao`.
- 🐛 **as 2 alavancas são alternativas, não cumulativas** (`max`, não soma): trocar de CNAE **ou** subir o pró-labore ([[cnae-fiscalmente-otimo]]). Somar inflaria a economia prometida.

**Personas 14 → 16:**
- **2 intactas:** `camaleao` · `fronteira` (saem no veredito 🟡, o gate não mudou).
- **10 remapeadas** (só a ordem): `reta` · `cida` · `reta-direto` · `sociedade` · `monstro` · `instrutora` · `govbr-bronze` · `bloq-cltpropria` · `bloq-3socios` · `bloq-exterior`. As duas últimas **param mais cedo** (`b1.triagem` em vez do B2) — a spec dizia que sim, o motor não fazia.
- **1 lógica nova:** `knife` — boleto entra no app, faz o dossiê, para em `b2.termo` (era `b3.pagamento`).
- **2 novas:** **`promessa-quebrada`** (guarda-corpo do teaser: fatura R$40k, só tira R$3k, o ótimo exigiria R$11.200 → caminho não existe → teaser prometeu R$3.800, real R$0, **e ela já pagou**) · **`cpf-irregular`** (CPF suspenso barra no N9 **sem cobrar**).

**Campos novos na persona:** `cnae_anexo_padrao` (`III`|`V`) · `pro_labore_teto` (máximo que ela pode se pagar; ausente = sem teto) · `b2_termo_aceite`.

### Histórico
- **v0.2.3 (15/07):** blind spots do [[mapa-ramificacoes-flow]]. Evento `recusa` no `run.js` (irmão da `pausa`): 🔴 recuperável **dentro** do pipeline, sem crash nem limbo. Branch de viabilidade indeferida (B6) + GOV.BR bronze (B7).
- **`reta-direto` (16/07):** não modela gente, modela uma **promessa**. É a `reta` byte a byte com `coorte_experiencia: "ja_abriu"`, esperando trilha idêntica. Guarda-corpo da **UX-48**: prova que a coorte é **dado puro** e nunca vaza pra lógica. Se um passo do schema um dia ler a coorte, este teste denuncia.
- **v0.2.0:** cobertura B1→B4→B4.5. Simulador com os números do consolidado fiscal.

### 🟡 Pendências
- **`FISCAL.TEASER_PISO` (0.5) não foi ratificado.** É o piso de desvio teaser × real que separa "estimativa" de promessa quebrada. Decisão de produto → [[reordenacao-flow-cobranca-cedo]].
- **`b2.natureza` sob suspeita:** o caso real (CNPJ do Pedro) saiu **LTDA num solo**. Se SLU é LTDA de sócio único (mesma natureza 206-2), o guard-rail está errado. Pergunta pra Larissa.
- **`b4.taxa`:** DAE JUCEMG ~R$268,51 × R$288 (Izabela), aberto desde 09/07.
- Simulador roda como **"estimativa"** até a Larissa fechar A/B/C ([[perguntas-larissa-fiscal]]) — sobretudo o ponto B (CPP-no-DAS), que afina o pró-labore ótimo.
