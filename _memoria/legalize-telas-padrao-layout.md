---
name: legalize-telas-padrao-layout
description: padrão de layout travado do app (título fixo/corpo rola/CTA fixo) + shell height:100dvh + 17 pills N4 + mockup por arquétipo; telas destravadas pra construir
metadata: 
  node_type: memory
  type: project
  originSessionId: 601a6913-bbd4-4193-878a-0bfa86ca2923
---

Padrão de layout do app travado 2026-07-17. Regra dura pra TODA tela do wizard/app:

**3 partes: título+subtítulo FIXOS / corpo ROLA / CTA FIXO.** Toda tela alta precisa de `overflow-y-auto` no corpo (scrollbar escondida no mobile). Aplicado no `/gate` (todas etapas) e `/simulador`.

**Fix de raiz:** `.app-page` (globals.css) virou `height:100dvh` (era `min-height`, que deixava a página crescer e rolar tudo — quebrava o single-scroll no iPhone SE). Com teto real, `flex-1 min-h-0` obriga a região interna a rolar sozinha e o CTA fica na thumb zone.

**N4 (`/gate`):** **17 pills** de reconhecimento (derivadas dos 103 serviço-liso, [[legalize-cnae-complexidade-abertura]]) acima do input; **pill estreita não valida** (afunila pra IA, pessoa ainda descreve). As pills são a região rolável, com **fade-mask dinâmico** (só desbota a ponta com mais) + **input de altura fixa** (não estica; pills absorvem a variação de tela). Decisão do Pedro: granular (17) > enxuto (~6), pra achabilidade.

**`/mockup` = esteira por arquétipo** (A1 Pergunta · A2 Veredito · A3 Número · A7 Espera · A9 Saída); cada um horizontal com clicar-segurar-arrastar (o iframe engole arrasto que começa no vidro → arrasta pela moldura/legenda). A1 agora tem 8 telas (N4 + N10–N16), N18 em A3; A2/A7/A9 aguardando.

**Estado (17/07, 4º flow): A1 CONSTRUÍDO.** As 7 telas de coleta do dossiê nasceram em código — `app/src/app/(app)/dossie/` (shell APP, pós-pagamento): N10 socio · N11 vinculo · N12 socios · N13 empresa · N14 cnae-secundarios · N15 natureza · N16 nome. Componentes de FORM **locais** ao dossiê em `dossie/campos.tsx` (TelaHeader/Titulo/Corpo/Rodape encodam o esqueleto 3-partes mecanicamente; Campo/Texto/OpcoesLinha/OpcoesColuna/Select/Aviso) — **NÃO promovidos ao DS** (regra dos 3: só o que está nas 2 farol). IA dublada (mocks marcados 🚧). Cada tela carrega sua regra de spec (T6–T12): CPF-situação, regime→cônjuge UX-30, teto-FOLGA UX-24/27, limite-2, upsell-endereço (preço FAKE), secundário-comércio-avisa, guard-rail SLU×sócio (LTDA-solo permitido = fato CNPJ Pedro), viabilidade-nome.

**A2 · Veredito TAMBÉM construído (mesmo flow):** o veredito 🟢/🟡/🔴 foi **extraído do gate pra fonte única** `app/src/components/veredito.tsx` (o gate importa dela — muda num lugar, muda nos dois); 3 rotas `(wizard)/veredito/{atende,waitlist,nao-atende}` na esteira A2. 🟡/🔴 saem pelo **template de saída graciosa (A9)**, a fatorar quando A9 existir. **Confete da marca no CTA 🟢:** `app/src/components/confetti.tsx` (burst LOCALIZADO sobre o botão, não full-screen; botão encolhe `scale(.18)`; refazer some instantâneo) + runtime lottie-web **zero-install** carregado sob demanda de `app/public/lottie/` (asset colhido do protótipo). Guarda anti-trava + respeita reduced-motion.

**Decisões deste flow:** (a) **fade de scroll = affordance, NÃO gate** — recusei travar o CTA até rolar (rolar≠ler, puniria a Cida/UX-12, quebraria UX-48); fade mecânico no `Corpo`; gate real só pra consentimento (N8/N20 via checkbox). (b) **dropdown custom** (fim do `<select>` nativo, a lista de options não é estilizável). (c) **fix `useTypewriter`** → `useSyncExternalStore` destravou o reduced-motion de verdade (antes só matava CSS). `tsc`+eslint limpos em tudo.

**Falta:** rodar A1 (7 telas) contra as 19 personas · **A3 Número** (N5 teaser + N17 CNAE ótimo) = próximo arquétipo · A7 Espera · A9 Saída. Marco: [[2026-07-17-telas-a1-a2-construidas]]. Ver Pedro-confere-UI-sozinho em [[legalize-pedro-confere-ui-sozinho]].
