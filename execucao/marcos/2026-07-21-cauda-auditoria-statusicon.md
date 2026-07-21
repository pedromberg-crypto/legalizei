---
tipo: marco
status: vivo
data: 2026-07-21
assunto: cauda-b4-auditoria-copy-statusicon
tags: [produto, ux, copy, flow, ds, marco]
---

# 🏁 7º flow (21/07) — a cauda construída + a máquina de auditar copy

> O flow de abertura passou a existir **ponta a ponta** em código, e ganhou uma máquina viva de lapidar a própria copy. Nada mexeu em backend/dado: é **copy + DS**. Tudo `tsc`+eslint limpo, mockup renderiza.

## 1. A cauda B4 construída (o flow ficou inteiro)
Faltava tudo entre o pagamento e a empresa ativa. Nasceu:
- **N19 revisar** (`/revisar`) — recap read-only do dossiê antes do irreversível; "Ajustar" por bloco (contrato de interação: edit-and-return, não re-anda o flow).
- **N20 termo** (`/termo`) — o commit irreversível. **Reenquadrado (framing A):** como a cobrança subiu (paga no N9), "a taxa não volta" lia "paguei de novo?"; a tela agora reconhece que **você já pagou** e é o ponto sem volta. Política de cancelamento aberta (conteúdo legal nunca em expander).
- **N21 painel** (`/painel`) + **REC** (`/painel/recusa`) — timeline de 9 etapas dos órgãos, 4 estados (feito/girando/a-fazer/recusa). Recusa de órgão = recuperação dentro do pipeline (persona `erro-orgao` do motor).
- **N22 assinatura** (`/assinatura`) — GOV.BR + procuração e-CAC + consenso/convite do 2º sócio (UX-44/UX-20). Dobra o check de nível GOV.BR (N23 inline).
- **N24 empresa ativa** (`/ativa`) — dia-2: CNPJ + 3 primeiros passos (1ª nota, 1º DAS, certificado) + loop estimativa→realidade. Bandeira, não troféu.

Componente compartilhado `components/painel.tsx`. Dois grupos novos no `/mockup` (B4 + dia-2). `flow-data.mjs` → **v3, sem drift**. Falta só o **flow #2 (migrar)**.

## 2. Auditoria de copy viva + rubrica (o método)
Duas notas-ferramenta em `execucao/flow/`:
- **[[auditoria-copy-flow]]** — a ÂNCORA de adaptação. Índice de telas **auto-gerado** por `node execucao/flow/gerar-indice-telas.mjs` (do `flow-data`), com link de código `<...>` (route-groups têm parênteses) + rota viva; achados com **ID estável + status** (🔲→✅); inventário-prova por tela.
- **[[metodo-varredura-flow]]** — a RUBRICA VIVA. **11 dimensões D1–D11**, 2 câmeras: D1–D6 mecânicas (agente) + D7–D11 críticas (Pedro/eu). Evolui pela **regra dos 3**: achado crítico recorrente → dimensão; componente que D7 pega 3× → item do DS.

## 3. 4 rodadas de lapidação no flow inteiro
- **R1–R7** redundância cross-screen (idempotência, taxa-repasse, "22 anos", carimbo, "não é malandragem", bloqueio exterior, "sem letra miúda").
- **K1–K10** olhar crítico (anti-guru "8 dias" inventado no N21, negativa que meu R3 criou, celebração do N24, checkbox unificado, "Ajustar", footer sticky, legenda×botão, etc.).
- **M1–M3** informação massiva (N20 taxa 3×→1×, N17 pré-explicava o N18, N8 card 3→2 pontos).
- **V1–V11** varredura pesada (rubrica inteira nas 3 telas do M). **A rubrica se provou:** V6 pegou um fix incompleto — o R5 só tinha arrumado o TÍTULO do aviso do N17, o corpo ainda ecoava o N5.

Fechou redundância + massa. **Sobra:** o **F-round (F1–F6, frases negativas)** + **V4** (o aceite do N20 nomear a taxa não-reembolsável → **Larissa**).

## 4. StatusIcon promovido ao DS
Provocação do Pedro: P1/P2 (`ListaPassos`) e N21/REC (`PainelView`) mostram status, por que não unificar? **Resposta: unifica o ÁTOMO, não o SENTIDO.** `ui/status.tsx` = 1 vocabulário de 5 estados que os dois compõem; os wrappers seguem separados porque a **agência é oposta** — SUA vez de preencher (dossiê) × vez do ÓRGÃO de processar (constituição). Borrar faria "Tirar o CNPJ" ler como tarefa do cliente (o `lib/passos` já avisava: "sua vez × nossa vez"). Matou o check verde copiado em **5 arquivos**. Ficam locais: destino "empresa constituída" (marca de meta) + cadeado da idempotência (decorativo).

Bônus: o **N24** tinha o confete da marca parado no meio da tela cobrindo texto (o Confetti resolve num check coral — feito pra substituir o CTA do veredito). Trocado por **entrada comemorativa** (card sobe + selo verde dá pop com overshoot). Confetti segue no veredito.

## Aberto / próximo
- **F-round (F1–F6)** — as frases negativas do caminho feliz (N24 "não some", N6 "ainda não cobramos", N15 "não precisa decorar", etc.).
- **V4 → Larissa** — redação jurídica do aceite do N20.
- 🕓 antigos: 91 CNAE (Larissa) · 45 impossíveis (Pedro) · preço · prazo de fidelidade · flow #2 (migrar) não construído.

## Links
[[auditoria-copy-flow]] · [[metodo-varredura-flow]] · [[legalize-telas-padrao-layout]] · [[legalize-auditoria-copy-rubrica]] · [[mapa-flow-mermaid]] · [[design-system]] · [[HOME]]
