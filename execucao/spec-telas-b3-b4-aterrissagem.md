---
tipo: spec
data: 2026-07-15
status: em-construcao
tags: [produto, ux, telas, spec, b3, b4, aterrissagem, dia-2, cobranca, constituicao]
---

# 🛬 Spec de telas — B3 (cobrança) + B4 (constituição) + Aterrissagem (dia-2)

> Continuação downstream de [[spec-telas-entrada-b1-b2]] (que cobre Entrada+B1+B2). Fecha **a cauda do flow** — onde as personas de jornada longa perdiam % ([[compilado-ux-flow]] rodada #2/#3). Casa com [[blocos-fluxo-abertura]] (lógica de B3/B4) + [[fiscal-simples-bh-2026]] (números). Valores concretos ficam 🟡 *confirmar* (anti-guru): trava a **mecânica**, não o número.
>
> 🔧 **Nasce da rodada de UX #3 (2026-07-15):** este doc É o **UX-36** — trata B3+B4+dia-2 como **uma surface única de aterrissagem**, absorvendo os 4 🟡 que estavam soltos nas notas transversais da spec anterior (UX-19 dia-2 · UX-20 co-founder · UX-28 assistido · UX-31 e-CAC) + as pausas proativas (UX-18) + a "conta da abertura" (UX-33) + idempotência visível (UX-38). IDs em [[compilado-ux-flow]].
> 🔧 **Rodada de UX #4 (2026-07-15, 4ª ordem — recuperação/decisão):** a cauda ganhou **failure-state / ação sua** no painel (UX-40, T20), **consenso multi-sócio antes do commit** (UX-44, T21), **re-engajamento proativo** no dunning (UX-45, T19) e **loop estimativa→realidade** na aterrissagem (UX-41, T23). Alguns têm 🟡 de dependência (persona de erro / CRM / portal).

## Legenda das colunas
- **Campo/Elemento** = o que aparece na tela · **Entrada** = como preenche · **Validação & margem** = aceita/rejeita/tolera · **IA / microdetalhe** = comportamento esperto, default, micro-interação.

---

## 💳 B3 — Cobrança

### Tela 16 — 3.1 Recap + "Conta da abertura" (UX-33)
> Antes de pedir dinheiro, **fechar a conta na cara do cliente** — o custo total de abrir, num lugar só. Hoje os custos vivem espalhados (taxa de governo no B4, certificado no fim, mensalidade no plano). Consolidar mata a ansiedade de "quanto isso vai me custar de verdade".

| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Recap do enquadramento | leitura | — | Puxa do B2: CNAE, natureza, anexo estimado, economia do Fator R/CNAE ótimo. Gancho: "por isso vale a pena" |
| **A conta da abertura (UX-33)** | leitura | **obrigatório antes do aceite** | Bloco único, em R$, separando **3 baldes**: (1) **o que é grátis** — honorário de abertura Legalizei = R$0; (2) **taxas de governo** (passam direto, não é nossa margem): DAE JUCEMG **~R$268,51** 🟡 + eventuais; (3) **o que é recorrente** — 1ª mensalidade (nosso plano ~R$195 🟡 *a travar*) + endereço fiscal se marcou o upsell (~R$60/mês 🟡) + certificado A1 (via parceiro 🟡). **Nunca esconder o repasse de governo dentro do preço** — mostrar que é do Estado, não nosso |
| "O que vou pagar HOJE × recorrente" | leitura | — | Duas colunas: **hoje** (governo + 1ª mensal) × **todo mês** (mensalidade). O leigo precisa separar o gasto único do fixo |
| Transparência do "grátis" | leitura | — | Explicar que "abertura grátis" = **honorário zero**, não "governo zero" — a taxa da junta existe e é do governo. Honestidade evita a sensação de pegadinha lá no B4 |

### Tela 17 — 3.2 Plano + método de pagamento
| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Plano | card (faixa) | — | Plano único ~R$195 🟡; add-on de endereço fiscal injetado automático se veio marcado do B2 (T9) |
| Método | cartão / boleto / Pix | Cartão recusado → retry + fallback; boleto → **fora do happy path** (abertura só começa quando compensar) | Cartão = destrava o B4 na hora; boleto = aguardando-pagamento (ver dunning na T19) |

### Tela 18 — 3.3 Aceite + termo irreversível
> Aterra a diretriz UX-17 (rodada #1) na tela concreta. É o pico de ansiedade do leigo (Cida/reta).

| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Contrato de serviço | leitura + aceite | Checkbox explícito | Resumo humano em 3 bullets acima do jurídico; link pro contrato completo |
| Termo de início (irreversível) | leitura + aceite | Botão único grande | Explicar em **1 linha** que **as taxas de governo não voltam** depois que a abertura começa (CDC art.49 + exceção de serviço iniciado). Sem letra miúda |
| Política de cancelamento | leitura | — | As 4 camadas ([[blocos-fluxo-abertura]] B3) em linguagem humana; não enterrar |

### Tela 19 — 3.4 Pagamento + dunning
| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Confirmação | ação | Cartão pago → destrava B4 | Recibo imediato |
| Dunning (boleto/Pix não compensado) | estado | Não destrava B4 até compensar | **Deixar explícito que a abertura só começa quando o pagamento cair** — o cliente (knife) volta depois; estado "aguardando pagamento" claro, sem sensação de travou |
| **Re-engajamento proativo (UX-45)** | push/WhatsApp | — | Dunning não pode ser só passivo. Quando o boleto está pra vencer, **puxar o cliente de volta com contexto fiscal**: "seu boleto vence em X · seu enquadramento ótimo ainda economiza ~R$Y/mês · retoma?". Carrinho abandonado **com o gancho da economia**, não um lembrete seco. 🟡 depende de régua de CRM/notificação |

---

## 🏛️ B4 — Constituição (assíncrono, com estado visível)

### Tela 20 — 4.0 Painel de acompanhamento (o coração do B4)
> O B4 é **longo e assíncrono** (junta, receita, prefeitura, certificado — dias). Sem um painel, o cliente que pagou acha que "comprou e nada acontece". Este painel resolve UX-18 (pausas proativas), UX-38 (idempotência visível) e ancora UX-32 (mapa da jornada) na reta final.

| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Timeline de etapas | leitura | — | Cada etapa do pipeline como um passo com estado: viabilidade → DBE → registro JUCEMG → DAE → CNPJ → Simples → certificado → inscrição municipal/NFS-e → ativação fiscal (e-CAC). **Verde = feito · girando = em andamento · cinza = a fazer** |
| **Estado de falha / ação sua (UX-40)** | leitura + ação | — | Falta o **4º estado: vermelho**. Órgão externo pode **recusar** (nome reprovado na JUCEMG apesar da prévia · DAE que volta · pendência de documento). O passo fica **vermelho com "precisamos de você"** + a ação concreta (reescolher nome, reenviar doc, refazer pagamento) — recuperação **dentro** do pipeline assíncrono, nunca um limbo "em andamento" que na verdade travou. Com 2 sócios, dizer **de qual sócio** é a pendência. 🟡 *validação completa exige a persona de erro recuperável (UX-37, blind spot)* |
| **Estado visível a cada pausa (UX-18)** | leitura | — | Toda espera de órgão externo mostra **"estamos abrindo, leva ~X dias"** + aviso **proativo por WhatsApp** quando anda. O cliente nunca acha que travou ou perdeu o dinheiro |
| **Idempotência visível (UX-38)** | leitura | — | Faixa fixa de garantia: **"seu progresso está salvo. Não cobramos de novo nem abrimos nada duas vezes."** O motor já é idempotente na retomada; aqui a UI finalmente **comunica** isso. Mata o medo de quem pagou e fechou o app |
| Estimativa de conclusão | leitura | — | "Previsão de CNPJ ativo: ~X dias úteis" — expectativa honesta, atualizada a cada etapa |
| Notificação multi-sócio | push/WhatsApp | — | Se há 2 sócios, o andamento vai pros **dois** (não só pro dono da conta) — o sócio de fora (Otávio/Elisa) não desconfia que travou |

### Tela 21 — 4.1 Convite do 2º sócio (UX-20 — co-founder)
> O fluxo até aqui é single-user, mas o registro exige **os dois sócios** confirmando dados e assinando. Sem esta tela, trava esperando quem nunca abriu o app.

| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Só aparece se >1 sócio | — | pula se solo | — |
| Convite pro 2º sócio | link/WhatsApp/e-mail | Contato válido | Link próprio pro 2º sócio **confirmar os próprios dados** (não o dono digita por ele) e assinar. Estado "aguardando o sócio X" visível pro dono |
| Confirmação de dados pelo 2º sócio | form leve | Mesmas validações do 2.1 (CPF/situação) | O 2º sócio revisa o que foi preenchido sobre ele; corrige se precisar |
| **Consenso antes do commit (UX-44)** | aprovação dupla | pagamento/registro só liberam com os dois de acordo | O flow **não pode assumir que os sócios concordam**. Antes do commit (pagamento + aceite), o 2º sócio (Elisa/Otávio) **revisa e aprova** dossiê + custo + **split de pró-labore**. Aceite **explícito dos dois** — nunca o dono clicando por todos. Sociedade quebra quando um decide e o outro descobre a conta depois |
| Anuência do cônjuge (se aplicável) | aceite | Só se comunhão universal (flag do B2 T6) | Já foi **avisado cedo** no B2 (UX-30); aqui é a execução da assinatura do cônjuge |

### Tela 22 — 4.2 Assinatura GOV.BR + procuração e-CAC (UX-31)
| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Nível da conta GOV.BR | verificação | Exige **prata/ouro** | Já **detectado e guiado no B1** (UX-29); aqui só confirma. Se ainda bronze → guia rápido de upgrade antes de assinar |
| Assinatura do contrato social | ação (GOV.BR) | Assinatura válida dos sócios | Deep-link pro GOV.BR; volta idempotente |
| **Procuração e-CAC explicada (UX-31)** | leitura + aceite | — | 1 linha antes do aceite: **"é o que deixa o Legalizei pagar seu DAS e cuidar das obrigações por você — com limite e revogável quando quiser."** Tira a opacidade do "estou dando poderes pra quem?" |

---

## 🛬 Aterrissagem — dia-2 (UX-19)

### Tela 23 — 5.1 Empresa ativa + primeiros passos
> **O flow não acaba no troféu.** "Empresa ativa" é uma **ponte**, não a linha de chegada — sobretudo pro leigo (Cida/reta) que não sabe operar. Esta tela transforma o ✅ em "e agora, faça isto".

| Campo/Elemento | Entrada | Validação & margem | IA / microdetalhe |
|---|---|---|---|
| Confirmação "empresa ativa" | leitura | — | CNPJ + dados-chave; celebração curta, **não é o fim** |
| **Primeiros passos (UX-19)** | checklist | — | 3 cards acionáveis: **(1) sua 1ª nota** (como/onde emitir NFS-e) · **(2) seu 1º DAS** (quando vence, quanto, pago pelo app) · **(3) seu certificado** (onde está, pra que serve). Handoff **ativo** pro portal, não um "boa sorte" |
| Tutorial guiado da 1ª nota | opcional (guiado) | — | Pro leigo/Cida: passo a passo da 1ª emissão, letra grande, podendo fazer junto de alguém (ver modo assistido) |
| Canal humano fixo | link | — | WhatsApp de suporte sempre visível — o produto **começa** aqui, não termina |
| **Loop estimativa → realidade (UX-41)** | acompanhamento (dia-2+) | — | O simulador do B2 prometeu **"estimativa"**. Fechar o loop: passados **1-2 meses operando**, o app volta com o **Fator R real** ("sua folha real deu X · seu enquadramento está certo / dá pra ajustar aqui") e faz **revisão periódica** ("seu CNAE ainda é o mais barato pro seu mix atual?"). Otimização não é evento único do onboarding, é **manutenção** — senão a promessa da estimativa fica no ar. 🟡 vive no portal (pós-abertura) |

---

## Notas transversais (B3→B4→dia-2)
- **🎛️ Densidade: universal por padrão, profundidade sob demanda (UX-48 — decisão 2026-07-16).** Vale igual nesta cauda: **trilha única**, sem "modo leigo" × "modo avançado". **Universal pra todos:** botão único grande no aceite (T18) · zero jargão · estado visível a cada pausa (T20) · recap ao reabrir. **Expander pra todos (default fechado):** detalhe por etapa do pipeline (T20) · memória do cálculo na revisão do custo (T16). **⚠️ Exceção que NÃO é negociável:** o **conteúdo legal** (contrato, termo irreversível, política de cancelamento, procuração e-CAC) é **idêntico e integralmente visível pras duas coortes** — nunca pode ficar atrás de um expander nem variar por perfil. Densidade muda apresentação, jamais obrigação. **Ritmo/layout** (tutorial guiado da 1ª nota × checklist seco, T23) fica **não construído** até haver dado → [[spec-instrumentacao-flow]].
- **Modo assistido / ajuda de confiança (UX-28):** o comportamento real da persona leiga (Cida) é **passar o app pra um parente terminar**. Vale em toda esta cauda (aceite, assinatura, 1ª nota): permitir **handoff a alguém de confiança** — continua de onde parou, **sem recomeçar e sem a titular perder o controle da conta**. Depende de decisão de arquitetura de conta (🟡 a modelar), mas a diretriz fica travada aqui.
- **Mapa da jornada (UX-32):** a barra de progresso do wizard **continua** nesta cauda — o cliente sempre vê onde está no arco entrada→ativa, quanto falta e o custo já assumido.
- **Idempotência é lei aqui:** todo retomar (pós-pausa, pós-boleto, pós-assinatura) restaura o estado e **revalida dados perecíveis** (UX-23) — nunca cobra nem abre em duplicidade.
- **Sem travessão · erros inline · microcopy que ensina** — herdados da spec B1/B2.

## 🟡 Pendências desta spec
- Preço do **nosso** plano (~R$195 é benchmark Contabilizei, não o nosso travado) · preço do **endereço fiscal** · custo do **certificado** (parceiro).
- Valor exato da **DAE JUCEMG** (motor usa ~R$268,51 — reconferir tabela vigente).
- **Arquitetura de conta** pro modo assistido (UX-28) + convite de 2º sócio (UX-20): modelo de múltiplos usuários numa mesma abertura.
- Redação jurídica do contrato + termo (Mauro/Larissa).

## Links
- [[spec-telas-entrada-b1-b2]] · [[blocos-fluxo-abertura]] · [[compilado-ux-flow]] · [[fiscal-simples-bh-2026]] · [[plano-padrao-195-referencia]] · [[mapa-telas-mobile]] · [[HOME]]
