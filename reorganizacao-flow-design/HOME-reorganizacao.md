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

**✅ TRAVADO 30/07 — as 2 autoridades são #1 e #5, e AMBAS JÁ EXISTEM:**
- **Autoridade #1 (onboarding, abrir+migrar):** `execucao/flow/flow-data.mjs` → `mapa-flow-mermaid.md`.
- **Autoridade #2 (dentro do app / home, dia-2):** `execucao/portal/portal-data.mjs` → `mapa-portal-mermaid.md`. O próprio arquivo já se autodeclara isso no cabeçalho ("FONTE-ÚNICA DO PORTAL") — só nunca tinha sido promovido a par formal do #1 nesta reorganização.

Mesma gramática nos dois (nó/rota/status/validado), mesmo mecanismo (gerador + drift-check + versionado). **Não é preciso criar nada do zero** — a estrutura já existe.

⚠️ **Mas nenhuma das duas está atualizada de verdade, e isso bloqueia elas servirem como autoridade hoje:**
- **#1 é v9 de 28/07** — verificado 30/07: ainda tem o nó `MIG` como placeholder ("Flow #2 · Migração<br/>não construído"), o que é **falso** desde ontem (as 9 telas M1-M5 existem em `wizard-migrar.tsx`). Também não reflete a redução do N21 (9→3 status) nem o swap P0↔N24 — o grafo para no N23→ATIVA, o P0 nem existe como nó.
- **#5 é v1 de 27/07** — não sofreu mudança desde então (nenhum marco tocou o portal em 28-30/07); mais provável de estar corrente, mas não reconferido linha a linha.
- Isso é o **mesmo atraso crônico do motor de testes (#3)**, só que no mapa em vez do QA. Regenerar #1 (editar `flow-data.mjs` + rodar `gerar-mapa.mjs`) é pré-requisito pra ele valer como autoridade de verdade — fica registrado como execução pendente, fora desta pasta de reorganização.

## 🗺️ Visão por categoria (orientação rápida — 30/07)

A tabela funcional está abaixo (numerada, com Estado+Sugestão). Esta é só pra não se perder: mesmos 14 itens, agrupados por assunto.

### 🧵 FLOW
| # | Arquivo | Veredito |
|---|---|---|
| 1 | `flow-data.mjs` + `mapa-flow-mermaid.md` | 🟢 autoridade única |
| 2 | `mapa-ramificacoes-flow.md` | 🔴 remover |
| 3 | `motor-testes/flow-schema.js` | 🟡 debate aberto — reclassificar como QA, não fonte |
| 4 | `CRM_app/mapa-flow-mermaid.md` | 🟢 mantém, satélite do #1 — 🟡 falta decidir a mecânica do link |
| 5 | `portal-data.mjs` + `mapa-portal-mermaid.md` | 🟢 mantém separado (assunto dia-2) |
| 6 | `blocos-fluxo-abertura.md` | 🟢 mantém, spec de intenção |
| 14 | `legalizeiapp/PRODUCT.md` | 🟢 mantém, spec de produto |

### 🖼️ TELAS
| # | Arquivo | Veredito |
|---|---|---|
| 7 | `mapa-telas-mobile.md` | 🟡 debate aberto — não checado se duplica o #1 |
| 8 | `spec-telas-entrada-b1-b2` / `b3-b4` | 🟢 mantém, porquê de cada campo |
| 9 | `auditoria-copy-flow.md` + `metodo-varredura-flow.md` | 🟢 mantém, ferramenta ativa |
| 15 | `/mockup` `/mockup-home` `/mockup-inicio` `/mockup-v2` `/apresentacao` (rotas Next) | 🟢 código fica em `app/`, ganha índice-satélite em `marca/` |

### 🎨 DESIGN
| # | Arquivo | Veredito |
|---|---|---|
| 10 | `design-system.md`+`.html`+`paleta-cores`+`simbolo-exploracao`+`decisoes-marca` | 🟢 3 camadas travadas — 🟡 falta absorver do #11 + decidir raio 16×18 |
| 11 | `legalizeiapp/DESIGN.md` | 🟡 migra pro #10, depois aposenta |
| 12 | `CRM_app/DESIGN.md` | 🟢 mantém, modelo-exemplo de adaptação |

### ✅ Fechado / fora do escopo
- **#13** (`C:\Obsidian Legalizei`) — não é item nosso, vira pergunta ao dev.
- `CRM_app`: banco/schema/migrations — fora do escopo (Pedro não decide backend).

**Restam 4 pontas soltas antes do veredito geral:** #3 (reclassificar motor de testes) · #7 (checar redundância) · #4 (mecânica do link) · #10 (raio 16×18, decisão sua).

## 📊 O levantamento (29-30/07)

Garimpado de 3 repos: `legalize` (este vault), `legalizeiapp` (produto real, monorepo, parado em 21/07), `CRM_app` (painel interno, 29/07). Confirmado: Obsidian está aberto e sincronizado neste vault agora (`.obsidian` ativo, registro do app aponta pra cá).

| # | Arquivo/sistema | Onde mora | Domínio | Estado | Sugestão (pendente de veredito) |
|---|---|---|---|---|---|
| 1 | `execucao/flow/flow-data.mjs` + `gerar-mapa.mjs` → `mapa-flow-mermaid.md` | `legalize` | Flow | v9, 28/07 — gerado, 2 dias atrás do código | **MANTER como autoridade única de flow.** Único gerado (não escrito à mão), tem drift-check embutido. Só precisa rodar de novo. |
| 2 | `execucao/mapa-ramificacoes-flow.md` | `legalize` | Flow | 16/07, escrito à mão, o mais velho | ✅ **TRAVADO 30/07 — REMOVER.** Conteúdo já vive no #1. |
| 3 | `execucao/motor-testes/flow-schema.js` | `legalize` | Flow (teste) | Cronicamente atrasado (já era assim antes de 29/07) | **MANTER, re-classificar**: não é doc de flow, é motor de QA. Não devia competir como "fonte" — devia LER do #1. Reescrever é código, não doc; sinalizado, não decidido. |
| 4 | `reunioes/mapa-flow-mermaid.md` | `CRM_app` | Flow | Cópia colada da v8 (28/07) do #1 | ✅ **TRAVADO 30/07 — MANTER, papel redefinido.** Vira o mapa-mental-irmão do Flow #1 (onboarding), exigido pela missão. ⚠️ Hoje é cópia estática (v8) — pra cumprir a missão precisa parar de ser cópia e virar link vivo pro #1. Não é mais "autoridade" nenhuma. |
| 5 | `execucao/portal/portal-data.mjs` + `mapa-portal-mermaid.md` | `legalize` | Flow (app interno/dia-2) | v1, 27/07, gerado, sistema irmão do #1 | ✅ **TRAVADO 30/07 — É A AUTORIDADE #2** (dentro do app/home), par formal do #1 (onboarding). Já se autodeclara "FONTE-ÚNICA DO PORTAL" no próprio cabeçalho. Provavelmente corrente (sem mudança de portal em 28-30/07), não reconferido linha a linha. |
| 6 | `execucao/blocos-fluxo-abertura.md` | `legalize` | Flow (spec B1-B4) | Spec original, conceitual | **MANTER como spec de intenção** — quem manda em detalhe-de-tela é o #1, não este. |
| 7 | `execucao/mapa-telas-mobile.md` | `legalize` | Telas (inventário) | Inventário próprio | **Checar se soma algo que o #1 não cobre.** Provável duplicata da tabela "validação tela por tela". |
| 8 | `execucao/spec-telas-entrada-b1-b2.md` / `spec-telas-b3-b4-aterrissagem.md` | `legalize` | Telas (spec de campo) | Specs originais das telas | **MANTER** — "porquê de cada campo", nível que o mapa não carrega. Não concorre com o #1. |
| 9 | `execucao/auditoria-copy-flow.md` + `metodo-varredura-flow.md` | `legalize` | Telas (copy) | Ferramenta de lapidação de texto | **MANTER** — ferramenta ativa (usada 29/07). Fora do escopo desta reorganização. |
| 10 | `marca/identidade-visual/design-system.md` + `design-system.html` + `paleta-cores.md` + `simbolo-exploracao.md` + `decisoes-marca.md` | `legalize` | Design | `.md` 16/07 · `.html` 30/07 (975 linhas, 4x maior, não listado antes) | ✅ **TRAVADO 30/07 — 3 CAMADAS, não 1 arquivo.** Ver estrutura abaixo. `.html` era um **4º artefato nunca listado** — achado na varredura desta sessão. |
| 11 | `DESIGN.md` (D19) | `legalizeiapp` | Design | 12/07 (handoff), mas descreve componente JÁ CONSTRUÍDO no código real | **VERIFICADO 30/07 — NÃO é só "pedaço do #10".** Cor/tipo/raio batem hex-a-hex (confirma origem comum). Carrega 3 coisas que faltam no #10: (1) spec de componente real ligado a arquivo do código (`BotaoPrimario`, `Stepper`, `MolduraCelular`, catálogo de Lottie); (2) física de spring motion (`stiffness/damping/mass`) — **não existe em nenhum arquivo nosso**, só aqui; (3) raio de card em 18 (nosso `.md` diz 16 — **conflito real, não fusão automática**). **Migra pro #10 antes de aposentar o #11.** |
| 12 | `DESIGN.md` | `CRM_app` | Design | Deriva do #11 (12/07), explícito | **VERIFICADO 30/07 — NÃO é redundância, é adaptação legítima.** Reusa só a camada de token (cor/tipo/raio/espaço); constrói componente 100% próprio pra uma superfície que não existe no produto (desktop denso: sidebar, KPI, funil, tabela). **MANTER como está** — é o modelo-exemplo do padrão "fonte + variação linkada" que a missão do flow também quer. |
| 13 | `C:\Obsidian Legalizei` (+ `Decisoes-Travadas-ADR.md`, `Plano-Mestre-Construcao-App.md`, `Spec-Onboarding-Fases-0-1.md`, `Handoff-Cores-Fonte-Dev.md`, `CNAEs-Atendidos...md`, `Painel - LEGALIZEI.md`) | Referenciado pelo `CLAUDE.md` do `legalizeiapp` | Flow + Design + Produto | **Path não existe nesta máquina**; `legalizeiapp` nem está clonado aqui (só foi lido via GitHub) | ✅ **FECHADO 30/07 — não é item de reorganização nossa.** Provável vault local do dev, na máquina dele — fora do alcance e do escopo (flow/telas/design deste produto, não a máquina de terceiro). **Vira pergunta direta ao dev**: aquele ADR/Spec diverge do que já travamos aqui (12 decisões de 28/07 + as de 30/07)? Mesmo risco do [[legalize-handoff-dev-repo]]. |
| 14 | `legalizeiapp/PRODUCT.md` | `legalizeiapp` | Flow/Produto | Curto, register/platform/users/purpose | **MANTER** — spec de produto acima de tela, complementa o #6. |
| 15 | `/mockup` · `/mockup-home` · `/mockup-inicio` · `/mockup-v2` · `/apresentacao` (rotas Next.js) | `legalize/app/src/app/` | Telas (vitrine) | Nunca listadas nesta tabela; rodam no `next dev` | ✅ **TRAVADO 30/07 — CÓDIGO FICA, ÍNDICE MIGRA.** São wrappers finos que importam componentes reais (fidelidade-por-construção) — mover o arquivo pra `marca/` quebraria a rota E o elo com o produto. **Ganham índice-satélite em `marca/`** que linka `localhost:3000/...` de cada uma + o que cada uma mostra. Mesmo padrão fonte+satélite do #4/#10. |

### Fora do escopo (registro, não mexo)

`CRM_app`: `schema.sql`, `supabase/migrations/`, `reunioes/modelagem-futuras-tabelas.md`, `reunioes/HANDOFF-modelagem.md` — banco, RLS, migrations. Existem, organizados no próprio repo deles. Não entram nesta reorganização.

## 🏛️ Estrutura travada do #10 (design system, 3 camadas)

`marca/` inteira é a casa conceitual do design (pipeline já correto: naming → conceito → referências → identidade-visual). Dentro de `identidade-visual/`:

1. **`design-system.html` = fonte de verdade RENDERIZADA (o "o quê").** Tokens + componentes vivos + tema escuro verificado. Pra fechar isso de fato precisa **absorver do #11**: mapeamento componente→arquivo real, física de spring motion (`stiffness/damping/mass` — hoje não existe em nenhum arquivo nosso), catálogo de Lottie, e **resolver o conflito de raio de card (16 no nosso `.md` × 18 no #11)** — decisão do Pedro, não fusão automática.
2. **`design-system.md` = camada de GOVERNANÇA (o "porquê").** Não some — carrega o que HTML renderizado não carrega bem: 2 shells + 5 pausas, 4 regras duras, arquétipos de tela, métrica anti-guru, as 2 telas-farol, "protótipo é colhido, não portado". Vira **satélite linkado** do `.html` (mesmo padrão fonte+variação-linkada do #4).
3. **`paleta-cores.md` + `simbolo-exploracao.md` = histórico, já resolvidos.** Carregam o "por que coral venceu" / "por que esse símbolo" — rationale que nem `.md` nem `.html` têm hoje. Não apagar: viram **apêndice linkado** no rodapé do `.html`, sem duplicar conteúdo.

SVGs ficam soltos como asset, referenciados de todo canto.

## 🎯 Próximos passos propostos (aguardando confirmação)

1. **#2 e #4 somem** — redundância morta assim que o #1 for fonte única.
2. **Executar a estrutura de 3 camadas do #10** (link bidirecional `.md`↔`.html`, absorver as 3 lacunas do #11, decidir o raio 16×18).
3. **Criar o índice-satélite do #15** em `marca/` linkando as 5 rotas.
4. ~~#13 fica em aberto~~ ✅ fechado 30/07 — vira pergunta direta ao dev, fora da reorganização.

## 🔗 Conexão Telas × Design (31/07)

Pergunta do Pedro: a categoria Telas já se conecta com Design? **Sim, e mais forte do que parecia — 3 conexões reais, já existentes no material, não propostas:**

1. **#9 (`metodo-varredura-flow.md`) CITA #10 explicitamente como fonte.** As regras da varredura de copy (travessão zero · coral nunca é estado · número sem fonte não entra · botão `min-h-12`...) são herdadas de `[[design-system]]`/`[[decisoes-marca]]`. **E tem retorno:** achado repetido 3× (regra dos 3) vira item do design-system — Telas alimenta Design de volta.
2. **#8 (specs de tela) cita `[[design-system]] §0`** duas vezes (`spec-telas-b3-b4-aterrissagem.md`) pra justificar a aposentadoria da barra de progresso do wizard na cauda.
3. **#15 (rotas reais)** é a conexão mecânica óbvia: todo componente consome os tokens do design-system via Tailwind — é o que faz o app "parecer o mesmo lugar".

**1 gap achado (não conexão, ausência):** nem #9 nem #8 citam `marca/conceito/conceito-marca.md` (tom de voz, arquétipo "Aliado leve/vitorioso"). Copy herda a regra **mecânica** (visual/DS) mas não a regra de **voz**. Fica registrado, sem ação decidida ainda.

## 🎨 Storybook — vitrine viva do design system (31/07)

**Decisão travada:** o #10 (design system) ganha uma 4ª camada — não mais só `.html`+`.md`+`paleta`+`decisoes-marca`, agora **Storybook** é a fonte de verdade RENDERIZADA dos componentes (substitui a tentativa manual dentro do `.html` e o `/componentes` do Next, que tinha legenda errada + 2 órfãos + 27 só-exploração, achado na varredura de ontem).

**Setup:** `@storybook/nextjs-vite` (recomendado, RSC quase não se aplica — 29/37 arquivos de `components/` já são `"use client"`, os 8 que não são são puramente apresentacionais). Mesmo repo `legalizei`, sem duplicar componente. Tailwind conectado (`preview.tsx` importa `globals.css`). Boilerplate genérico removido.

**16 componentes com story, cobrindo TODO o DS promovido + os 3 achados em produção real:**
- `DS/Button` (5 variantes+full+disabled) · `DS/Card` (3 tons) · `DS/StatusIcon` (5 estados) · `DS/Aviso` (4 variantes) · `DS/Esqueleto de tela` (composição título-fixo/corpo-rola/CTA-fixo)
- `DS/Form/*` — Campo, Texto, Checkbox, Opções (linha+coluna), Select
- `Produção/*` — `Vigilancia` (`/impostos`), `QuemCuida` + `AprendaGradiente` (P0 home-dia1), `LinhaNota` (home + `/notas`)

`tsc`+`eslint` limpos em tudo · `npm run build-storybook` validado 2x (antes e depois do cleanup do boilerplate).

**`design-system.html` atualizado:** as 7 seções hand-coded (Logo→Linha de nota) viram **"· histórico"** na nav + banner novo (`#storybook-aviso`) explicando que a fonte de verdade agora é o Storybook. Conteúdo NÃO apagado — fica de fallback offline (o Storybook precisa do `npm run storybook` ou de um deploy pra existir; o `.html` continua abrindo sem nada instalado).

**31/07 — cobertura COMPLETADA (achado do Pedro: só tinha feito os átomos, faltavam as TELAS de verdade).** Conferido: 16 arquivos de `components/` sem story nenhuma — exatamente onde moram as telas reais (entrada, gate, veredito, painel, saída, dinheiro B3, dossiê B4 completo, cauda N19-N22+P0, migrar M1-M6 inteiro) + utilitários (logo, lottie, confetti, campo-município, enviar-sheet, lista-passos, marcas-sociais). **Todos os 16 ganharam story** — total agora **31 arquivos**, zero lacuna entre "componente aprovado" e "tem no Storybook". `tsc`+`eslint` limpos, build validado depois de cada lote (não só no fim). Confirma resposta à pergunta do Pedro: **sim, telas completas entram no Storybook**, não só átomos — mesmo princípio (código real, zero cópia), namespace `Telas/` separado de `DS/` e `Produção/`.

**31/07 — N1 (Splash) + N2 (Welcome, 3 slides) extraídos e adicionados.** Não estavam extraídos como o resto (viviam soltos dentro do `page.tsx`, únicos 2 casos) — agora `components/splash.tsx`/`welcome.tsx`, page vira wrapper fino, mesmo padrão de todo o resto. 🐛 **Achado na extração:** CTA "Começar" do último slide do Welcome não navegava (`avancar()` retornava cedo, mesma classe de CTA morto já corrigida 3x nesta sessão) — corrigido com `onSeguir` opcional. Total agora **33 arquivos**. Logo ganhou story `TodasAsVariantes` (compilado das 3), mesmo padrão do Button/Card/Aviso.

**🕓 Pendente — decisão do Pedro, não executei sem confirmar:** deploy no Vercel como projeto NOVO e separado do app (mesmo repo, root `app/`, build `npm run build-storybook`, output `storybook-static`). Não commitei um `vercel.json` dentro de `app/` de propósito: risco real de colidir com a config do projeto Vercel do app principal SE ele também tiver root `app/` — mais seguro configurar via dashboard do novo projeto (Build/Output/Install Command), não via arquivo commitado. `/componentes` (Next) e as 27 exploração não-produção do acervo **não foram apagados** — ficaram fora do escopo de hoje (decisão maior, destrutiva, pendente de confirmação separada).

## 📜 Log de decisões

> Cada linha = 1 veredito fechado nesta reorganização. Atualiza só quando travar de verdade, não a cada mensagem.

- **30/07 — Missão final travada:** ao fim, só 2 arquivos de flow (onboarding + dentro do app), cada um com mapa-mental irmão linkado. Toda decisão de flow parte de um dos 2.
- **30/07 — #2 (`mapa-ramificacoes-flow.md`) TRAVADO: remover.** Execução (deletar o arquivo de fato) fica pra quando o veredito geral fechar, por regra da própria reorganização.
- **30/07 — #4 (cópia do CRM) TRAVADO: manter, papel redefinido.** Vira o mapa-mental-irmão do Flow #1. Pendência: hoje é cópia estática (v8), precisa virar link vivo — como fazer isso (arquivo linkado? script que puxa?) ainda não foi decidido.
- **30/07 — #10 TRAVADO: `marca/` é a casa conceitual inteira do design, em 3 camadas.** `.html` = fonte renderizada ("o quê") · `.md` = governança ("porquê"), satélite linkado, não some · `paleta-cores`/`simbolo-exploracao` = histórico, apêndice linkado. Pendência de execução: absorver do #11 (mapeamento componente→código, spring motion, catálogo Lottie) + **decidir o raio de card (16 × 18, conflito real)** antes de #11 poder sair de cena.
- **30/07 — #12 TRAVADO: manter como está.** Não é redundância — é adaptação legítima pra outra superfície (CRM desktop). Vira o modelo a repetir pro padrão flow-fonte + flow-linkado.
- **30/07 — AS 2 AUTORIDADES DE FLOW TRAVADAS: #1 (onboarding) + #5 (dentro do app/home), par formal.** Ambas já existem, mesmo mecanismo (gerador+drift-check+versionado) — não é criação do zero. Mas #1 está 2 sessões atrasado (ainda trata migrar como placeholder, não reflete N21/P0 de ontem) e precisa regenerar antes de valer como autoridade; #5 provavelmente corrente, não reconferido.
- **30/07 — #1 e #5 REGENERADOS (execução, não só debate).** `flow-data.mjs` → v10: `MIG` placeholder virou **M1-M6 reais** (rotas rastreadas por `router.push`/`onSeguir` no código, não inferidas) + edge de saída regulada/Mauro reaproveitando VW/VC; N21 renomeado (3 status); N3 atualizado (flow #2 deixou de ser "não existe"). `portal-data.mjs` → v2: corrigido o rótulo de P0 (era `/certificado`, o correto é `/home-dia1`, mesmo erro do print de ontem). **2 rotas órfãs achadas rastreando navegação real:** `/certificado` e `/ativa` (N24) — nenhum `push`/`href` no código aponta mais pra elas desde o swap; ficaram mortas. `gerar-mapa.mjs` limpo (drift só em rotas de outros domínios, esperado); `gerar-mapa-portal.mjs` **zero drift**.
- **30/07 — as 2 rotas órfãs APAGADAS de verdade (confirmado pelo Pedro).** `app/(app)/certificado/` e `app/(app)/ativa/` removidas + `AtivaView`/`CertificadoView`/`PassoCard`/`LIBERA_CERTIFICADO` limpos de `wizard-cauda.tsx` (não só desativados — deletados, com os imports órfãos `useState`/`StatusIcon` que sobraram). `flow-data.mjs` v11 + `portal-data.mjs` v3 regenerados de novo pra trocar a flag ⚠️ ÓRFÃO por 🗑️ REMOVIDO. `tsc` + `eslint` limpos.
- **31/07 — CRUZAMENTO #1 (flow-data.mjs) × `/apresentacao` feito, achado: ENCAIXE (`/encaixe`) existia na autoridade + produção mas tinha SAÍDO da demo em 29/07 por redundância (veredito 🟢 ganhou cards clicáveis, as 2 telas perguntavam a mesma coisa) — a apresentação já tinha achado isso, produção não tinha seguido. Pedro confirmou: página não usada mais.** REMOÇÃO REAL feita, não só marcada: rota `/encaixe` apagada, `EncaixeView` deletada de `components/encaixe.tsx` (`ConteudoCnae`/`OutrasOpcoes`/`encaixeDeResultado` ficam — `VereditoView` usa direto), `/gate/page.tsx` reescrito (veredito → triagem direto, sem a etapa "encaixe"), tile do `/mockup` removido, nó `ENC` tirado do `flow-data.mjs` (v12, `VA→N4T` direto). `tsc`+`eslint` limpos em todos os arquivos tocados.
- **30/07 — #13 FECHADO: não é item nosso de reorganização.** `C:\Obsidian Legalizei` não existe nesta máquina e `legalizeiapp` nem está clonado aqui. Vira pergunta direta ao dev (divergiu do que travamos?), não entra na execução desta reorganização.
- **30/07 — #15 TRAVADO: código das vitrines (`/mockup`, `/mockup-home`, `/mockup-inicio`, `/mockup-v2`, `/apresentacao`) FICA em `app/src/app/`** — mover quebraria a rota Next.js e o elo de fidelidade-por-construção com os componentes reais. `marca/` ganha um índice-satélite que linka as 5 rotas (`localhost:3000/...`) + o que cada uma mostra. Execução (criar o arquivo) pendente até o veredito geral fechar.
