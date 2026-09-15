---
name: legalize-piloto-pro-labore-automatico
description: 15/09 — o produto AJUSTA o pro-labore sozinho em vez de avisar; e manutencao nao e recuperacao
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-15T11:15:16.604Z
---

🏢 **O ajuste automático de pró-labore é funcionalidade nossa, decidida pelo Pedro em 15/09:** *"não é sobre avisar cedo ou tarde, é sobre também aplicar a regra de ajuste automático de pró-labore desde o início para os usuários, eles não precisam saber sobre isso… a Contabilizei foi ajustando para manter tudo certo e para mim foi a melhor coisa, pois eu continuei me preocupando apenas em pagar as guias e emitir as minhas NF."*

`execucao/motor-fiscal/piloto-pro-labore.mjs` + `verificar-piloto.mjs`, **41 conferências**.

🔑 **Por que tinha que ser AÇÃO e não alerta:** o Fator R é retrovisor (ver [[legalize-fator-r-e-retrovisor]]). O pró-labore de hoje só vale em `m+1…m+12`, então alerta chega tarde **por construção**. A única intervenção que funciona é pagar o valor certo desde o mês 1.

**Em quem encosta:** só nos **15** CNAEs `fator-r-dinamico`. Nos **65** `III-fixo` devolve `atua: false` e **proíbe a tela de falar em 28%** (mentiria por omissão). Nos **7** `requer-revisao`, se recusa em vez de chutar.

## 🔴 Os dois achados que os testes produziram

**(1) Manutenção ≠ recuperação.** A 1ª versão mandou pagar **R$72.169 num mês só** — matematicamente certa, insana como recomendação: tentava consertar um ano de atraso numa competência. Agora são dois números que a tela **nunca funde**: `sugerido` (o sustentável, `alvo × receita do mês`, forma fechada) e `paraVirarJa` (quitar o déficit), com a data da virada ao lado. Quem escolhe o salto é o sócio.

**(2) Pagar o sustentável compensa em 100% da faixa do ME.** Varredura receita R$2 mil-30 mil × RBT12 R$24 mil-360 mil: pior saldo **+R$163/mês**. 🔑 É o que autoriza pilotar no automático **sem perguntar** — no nosso escopo a resposta nunca é "não". O teste derruba a rodada se deixar de ser verdade: a autorização é **condicional**, não permanente.

⚠️ **Fronteira com [[legalize-trava-persona-produto]]** (INFORMAR, nunca TUTELAR): ajustar sozinho não é tutela — tutelar é reter decisão do cliente; isto é executar o serviço contratado. O número é explicável na tela e o cliente pode sobrepor.

**Why:** sem essa camada o motor sabia apurar o Anexo V e não sabia evitá-lo — e evitar é o produto.

**How to apply:** ao desenhar tela de pró-labore, nunca fundir `sugerido` com `paraVirarJa`, e nunca falar em 28% para CNAE `III-fixo`. Os 5 limites declarados vivem em `LIMITES_DO_PILOTO`; 3 têm dono fora de mim (PP3 Mauro, PP4 Larissa, PP5 produto).

Relacionado: [[legalize-motor-fiscal-apurador-existe]] · [[legalize-anexo-v-duas-lacunas]] · [[legalize-regua-de-prova-fonte-oficial]].
