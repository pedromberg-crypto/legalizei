---
name: legalize-reuniao-rua-satelite-9
description: "Reunião gravada \"Rua Satélite 9\" (28/07) cruzada contra o flow → 12 decisões travadas E IMPLEMENTADAS (não só documentadas). Gate de cidade BH-MG novo em N3, veredito 🔴 virou 3 vias (waitlist/Mauro/descarta), N6 front-load de dados pessoais (N10 vira confirmação), IPTU obrigatório no N13, REC retry automático, DAE definitivo = cliente paga (sem tela nova, repasse é timing de backend pós-viabilidade). 2 itens ficaram tentativos (3+sócios↔waitlist, descartar saída-exterior) — Pedro disse \"estou pensando\", não travar sem confirmação."
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-28T19:05:23.715Z
  originSessionId: 879b8d71-f7ed-423d-b2cc-81cea99f165f
---

**Gatilho:** cruzamento dos 17 dados reais exigidos pra constituir empresa na JUCEMG (empresa/sócio/endereço) contra as telas N1–N18 — achou 4 campos faltando + 1 duplicado — virou pauta de reunião gravada. A ata (.md trazido pelo Pedro) foi cruzada célula a célula contra o flow.

**As 12 decisões, todas no `flow-data.mjs` v9 e implementadas em código** (detalhe completo em [[2026-07-28-reuniao-rua-satelite-9]]):
1. N3 = 3 rotas confirmadas (abrir/migrar/já-cliente) — nada mudou.
2. CNAE travado, não vira "KINAI".
3. **N3 ganhou gate de cidade** — MLP só atende Belo Horizonte/MG, trava antes de "abrir"/"migrar".
4. **Veredito 🔴 virou 3 vias**: waitlist (regulamentado) · "Contato especial" (Mauro atende) · **novo** "Fora de escopo" (ninguém atende, decline sem formulário).
5. Atalho "já sei meu CNAE" em N4.
6. **N6 virou front-load**: nome/CPF/telefone/endereço migraram do N10 pra cá + validação por código. N10 virou confirmação.
7. Waitlist ganhou campo CNAE pretendido.
8. **N13: IPTU obrigatório travado** (sem ele não passa na JUCEMG — era opcional).
9. **REC: retry automático** pelas 3 opções de nome do N16 antes de pedir ajuda.
10. **DAE definitivo: cliente paga, como já estava.** "Empresa paga" = alternativa documentada (`?cenario=empresa-paga`), não implementada em produção.

**Erro meu corrigido na hora:** propus uma tela nova de pagamento pós-viabilidade pro cenário do DAE. Pedro corrigiu: não precisa — cliente paga tudo junto no N9 como hoje, a Legalizai só *segura* o valor e repassa à JUCEMG depois que a viabilidade aprova. É timing de backend, invisível, zero tela nova.

**Ficaram tentativos, NÃO travados** (Pedro: "estou pensando"): (a) juntar a saída 3+sócios com a waitlist; (b) descartar a saída dedicada de sócio-exterior (ela tem conteúdo jurídico LC123 art.17 já revisado — não apagar sem confirmação final).

**Consequência que fica valendo:** [[legalize-motor-testes-arquitetura]] (as 19 personas) ficou desatualizado de novo — não reflete nenhuma dessas 12 mudanças. Reconciliar é validação própria.
