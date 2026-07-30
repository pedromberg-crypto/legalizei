---
tipo: hub
status: vivo
data: 2026-07-30
assunto: reorganizacao-flow-telas-design
tags: [reorganizacao, flow, telas, design-system, meta]
---

# 🧭 Reorganização — Flow, Telas, Design System

> **Regra travada (30/07):** enquanto este veredito não fechar, **só esta pasta é editada.** Nenhum arquivo de flow, doc, ou design system listado abaixo é tocado até termos decisão explícita aqui. Debate e validação acontecem nesta nota (ou notas-filhas dela); execução só depois.
>
> **Escopo do Pedro nesta frente:** flow, telas e design system. **Banco de dados e backend estão fora** — não decide, não mexe, não este momento.

## 🎯 Missão final (30/07)

No fim desta reorganização, existem **exatamente 2 arquivos de verdade de flow**:
1. **Flow de onboarding** (abertura da empresa, N1-N24).
2. **Flow dentro do aplicativo** (uso recorrente, pós-ativação).

**Toda decisão de flow, daqui pra frente, parte da leitura de um destes 2.** Nenhum terceiro arquivo compete como fonte.

Cada um dos 2 tem um **arquivo-irmão de visualização em mapa mental, linkado a ele** (não copiado). O modelo de "arquivo-fonte + variação-linkada-pra-outro-contexto" (achado no #12, ver abaixo) é o padrão a repetir, não a exceção.

**Candidato natural a "flow #2 (dentro do app)": item #5** (`portal-data.mjs` + `mapa-portal-mermaid.md`) — já existe, já é gerado, já seria exatamente isso. **Não travado ainda, é observação pra quando chegarmos nele.**

## 📊 O levantamento (29-30/07)

Garimpado de 3 repos: `legalize` (este vault), `legalizeiapp` (produto real, monorepo, parado em 21/07), `CRM_app` (painel interno, 29/07). Confirmado: Obsidian está aberto e sincronizado neste vault agora (`.obsidian` ativo, registro do app aponta pra cá).

| # | Arquivo/sistema | Onde mora | Domínio | Estado | Sugestão (pendente de veredito) |
|---|---|---|---|---|---|
| 1 | `execucao/flow/flow-data.mjs` + `gerar-mapa.mjs` → `mapa-flow-mermaid.md` | `legalize` | Flow | v9, 28/07 — gerado, 2 dias atrás do código | **MANTER como autoridade única de flow.** Único gerado (não escrito à mão), tem drift-check embutido. Só precisa rodar de novo. |
| 2 | `execucao/mapa-ramificacoes-flow.md` | `legalize` | Flow | 16/07, escrito à mão, o mais velho | ✅ **TRAVADO 30/07 — REMOVER.** Conteúdo já vive no #1. |
| 3 | `execucao/motor-testes/flow-schema.js` | `legalize` | Flow (teste) | Cronicamente atrasado (já era assim antes de 29/07) | **MANTER, re-classificar**: não é doc de flow, é motor de QA. Não devia competir como "fonte" — devia LER do #1. Reescrever é código, não doc; sinalizado, não decidido. |
| 4 | `reunioes/mapa-flow-mermaid.md` | `CRM_app` | Flow | Cópia colada da v8 (28/07) do #1 | ✅ **TRAVADO 30/07 — MANTER, papel redefinido.** Vira o mapa-mental-irmão do Flow #1 (onboarding), exigido pela missão. ⚠️ Hoje é cópia estática (v8) — pra cumprir a missão precisa parar de ser cópia e virar link vivo pro #1. Não é mais "autoridade" nenhuma. |
| 5 | `execucao/portal/portal-data.mjs` + `mapa-portal-mermaid.md` | `legalize` | Flow (portal/dia-2) | 28/07, gerado, sistema irmão do #1 | **MANTER separado** — assunto diferente (abertura × portal), já segue a mesma disciplina (gerado, versionado). Sem ação. |
| 6 | `execucao/blocos-fluxo-abertura.md` | `legalize` | Flow (spec B1-B4) | Spec original, conceitual | **MANTER como spec de intenção** — quem manda em detalhe-de-tela é o #1, não este. |
| 7 | `execucao/mapa-telas-mobile.md` | `legalize` | Telas (inventário) | Inventário próprio | **Checar se soma algo que o #1 não cobre.** Provável duplicata da tabela "validação tela por tela". |
| 8 | `execucao/spec-telas-entrada-b1-b2.md` / `spec-telas-b3-b4-aterrissagem.md` | `legalize` | Telas (spec de campo) | Specs originais das telas | **MANTER** — "porquê de cada campo", nível que o mapa não carrega. Não concorre com o #1. |
| 9 | `execucao/auditoria-copy-flow.md` + `metodo-varredura-flow.md` | `legalize` | Telas (copy) | Ferramenta de lapidação de texto | **MANTER** — ferramenta ativa (usada 29/07). Fora do escopo desta reorganização. |
| 10 | `marca/identidade-visual/design-system.md` + `paleta-cores.md` + `decisoes-marca.md` | `legalize` | Design | Nosso, autoral, 16/07 | ✅ **TRAVADO 30/07 — FONTE DE VERDADE.** Mas ⚠️ **precisa ABSORVER** o que só existe no #11 (ver achado abaixo) antes de #11 poder ser aposentado de verdade. |
| 11 | `DESIGN.md` (D19) | `legalizeiapp` | Design | 12/07 (handoff), mas descreve componente JÁ CONSTRUÍDO no código real | **VERIFICADO 30/07 — NÃO é só "pedaço do #10".** Cor/tipo/raio batem hex-a-hex (confirma origem comum). Mas carrega 3 coisas que o #10 NÃO tem: (1) spec de componente real ligado a arquivo do código (`BotaoPrimario`, `Stepper`, `MolduraCelular`, catálogo de Lottie); (2) física de spring motion (`stiffness/damping/mass`) — o #10 só tem duração em ms; (3) raio de card em 18 (não 16). **Essa parte precisa migrar pro #10 antes de aposentar o #11**, senão perde decisão que já é realidade no produto. |
| 12 | `DESIGN.md` | `CRM_app` | Design | Deriva do #11 (12/07), explícito | **VERIFICADO 30/07 — NÃO é redundância, é adaptação legítima.** Reusa só a camada de token (cor/tipo/raio/espaço); constrói componente 100% próprio pra uma superfície que não existe no produto (desktop denso: sidebar, KPI, funil, tabela). **MANTER como está** — é o modelo-exemplo do padrão "fonte + variação linkada" que a missão do flow também quer. |
| 13 | `C:\Obsidian Legalizei` (+ `Decisoes-Travadas-ADR.md`, `Plano-Mestre-Construcao-App.md`, `Spec-Onboarding-Fases-0-1.md`, `Handoff-Cores-Fonte-Dev.md`, `CNAEs-Atendidos...md`, `Painel - LEGALIZEI.md`) | Referenciado pelo `CLAUDE.md` do `legalizeiapp` | Flow + Design + Produto | **Path não existe nesta máquina** | **Aberto — pergunta pro Pedro.** Máquina do dev? Nome antigo deste vault? Nunca existiu? Sem isso não sei se são 5 fontes de flow ou 1 já contada 2x. |
| 14 | `legalizeiapp/PRODUCT.md` | `legalizeiapp` | Flow/Produto | Curto, register/platform/users/purpose | **MANTER** — spec de produto acima de tela, complementa o #6. |

### Fora do escopo (registro, não mexo)

`CRM_app`: `schema.sql`, `supabase/migrations/`, `reunioes/modelagem-futuras-tabelas.md`, `reunioes/HANDOFF-modelagem.md` — banco, RLS, migrations. Existem, organizados no próprio repo deles. Não entram nesta reorganização.

## 🎯 Próximos passos propostos (aguardando confirmação)

1. **#2 e #4 somem** — redundância morta assim que o #1 for fonte única.
2. **#10 × #11 se confrontam** — descobre se "design system" é 1 coisa ou 2 que já brigam.
3. **#13 fica em aberto** até o Pedro responder o que é aquele path.

## 📜 Log de decisões

> Cada linha = 1 veredito fechado nesta reorganização. Atualiza só quando travar de verdade, não a cada mensagem.

- **30/07 — Missão final travada:** ao fim, só 2 arquivos de flow (onboarding + dentro do app), cada um com mapa-mental irmão linkado. Toda decisão de flow parte de um dos 2.
- **30/07 — #2 (`mapa-ramificacoes-flow.md`) TRAVADO: remover.** Execução (deletar o arquivo de fato) fica pra quando o veredito geral fechar, por regra da própria reorganização.
- **30/07 — #4 (cópia do CRM) TRAVADO: manter, papel redefinido.** Vira o mapa-mental-irmão do Flow #1. Pendência: hoje é cópia estática (v8), precisa virar link vivo — como fazer isso (arquivo linkado? script que puxa?) ainda não foi decidido.
- **30/07 — #10 TRAVADO: fonte de verdade do design system.** Pendência: precisa absorver 3 blocos que só existem no #11 (spec de componente real, física de spring motion, raio-de-card 18) antes de #11 poder sair de cena.
- **30/07 — #12 TRAVADO: manter como está.** Não é redundância — é adaptação legítima pra outra superfície (CRM desktop). Vira o modelo a repetir pro padrão flow-fonte + flow-linkado.
