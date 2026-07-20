---
name: legalize-telas-padrao-layout
description: padrão de layout travado (título fixo/corpo rola/CTA fixo) + shell 100dvh + 17 pills N4 + mockup por arquétipo; **wizard N1–N9 inteiro em código, 26 telas, nenhum grupo vazio**
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

**A2 lapidado + A3 CONSTRUÍDO (19/07).** **A2 mudou de tese:** o card **vende reconhecimento, não economia** — **nenhum número fiscal fica nele** (6% ancora a `promessa-quebrada`; 15,5% assusta a `cida` antes de ela saber que há alavanca; "6% a 11,2%" esconderia o risco, que é a jogada do concorrente). A alíquota que estava lá **estava errada** (dizia "Anexo III" fixo; o real é III/V + `fator_r`). **Exclusão virou ROTEAMENTO** — achado do Pedro, confirmado no dataset: os vizinhos (inclusive design gráfico `7410-2/99`) são atendidos, **mesmo anexo**; dizer "não entra" mentia sobre o produto. Agora a pergunta é *"é a sua principal ou é adicional?"* → adicional vira secundário (N14), e o fecho é **derivado do dado** (`mesmo-imposto`/`muda-imposto`/`fora`). De 7 blocos → **5, uma gaveta só**. **Selo 64px centralizado nos 3 estados** (check/relógio/pessoa; **🔴 usa info, não danger**). **Captura de lead** nas saídas com o contexto junto (UX-35); "oferta especial" **vetada** (preço deferido). **A3:** `components/teaser.tsx` + 3 rotas (`swap` número fechado · `fator-r` **faixa começando em R$0** = o que desarma a promessa-quebrada · `servico` **sem número**) + **N17** `(app)/dossie/cnae-otimo`. Valores **derivados** da `lib/fiscal`. **17 telas no `/mockup`.**

**Falta:** A7 Espera · A9 Saída (já 80% dentro do A2 — fatorar na 3ª ocorrência) · **N18: entregar o ótimo como DEFAULT** e esconder o slider atrás de "e se eu me pagar diferente?" · rodar A1/A2/A3 contra as 19 personas. Marcos: [[2026-07-19-veredito-a3-e-pesquisa-fiscal-primaria]] · [[2026-07-17-telas-a1-a2-construidas]] *(datado errado, é 19/07)*. Ver Pedro-confere-UI-sozinho em [[legalize-pedro-confere-ui-sozinho]].

---

**Estado (19/07, 5º flow): O WIZARD INTEIRO EXISTE.** 13 telas novas → **26 no `/mockup`, 8 grupos, nenhum vazio**. Entrada N1–N3 (`(wizard)/splash|welcome|entrada`) · Dinheiro N6–N9 (`conta|plano|contrato|pagamento`) · A7 Espera (`(app)/retomar|aguardando`) · A9 Saída (`(wizard)/saida/exterior|socios`) · login (`(wizard)/login`, **sem número N** — saída terminal A1, grupo "Fora do flow"). Falta a cauda N19–N25. → [[2026-07-19-telas-n1-n9-espera-e-saida]]

**O DS cresceu (regra dos 3 batendo):** `ui/tela.tsx` (TelaHeader/Titulo/Corpo/Rodape/Aviso) e `ui/form.tsx` (Campo/Texto) **saíram do dossiê** e viraram DS quando o N6–N9 passou a usar o mesmo esqueleto fora do dossiê; `dossie/campos.tsx` re-exporta, e as 7 telas de coleta não foram tocadas. `Card` trocou `tint: boolean` por **`tom: neutro|marca|sucesso`** (booleano só sabia responder "coral ou branco"; a pergunta é que TIPO de card é). Novos compartilhados: `lottie.tsx` (runtime + player com **driver manual de frame** — rAF congela em iframe offscreen) · `logo.tsx` (**3** variantes: padrao/escura/negativa) · `marcas-sociais.tsx` · `lista-passos.tsx` · **`lib/passos.ts`**.

**⚠️ A LIÇÃO DO FLOW: número inventado em dois lugares diverge.** A P1 dizia "3 de 6" e a P2 "5 de 9", lado a lado na mesma esteira — o Pedro pegou de olho. Virou `lib/passos.ts` (fonte única, **10 passos**, 9 sem CNAE ótimo). Mesmo padrão do rótulo de faixa em 5 arquivos e da dívida declarada do `lib/fiscal`. **Contagem de passos é promessa de esforço:** duas telas discordando derruba a confiança em todos os outros números, inclusive os fiscais.

**Regras de copy que o flow travou:** ① o maior número da tela tem que ser o **melhor argumento**, não a maior soma (N7: "Grátis" > R$463,51, que era repasse + mensalidade somados sem serem a mesma natureza). ② **trava de negócio se explica pelo efeito no cliente, nunca pela nossa proteção** ("é a nossa garantia de não gastar antes de receber" levanta a pergunta que ninguém fez). ③ **apresentação não pode alterar o que o cliente entende que deve** ("o próximo passo é só esse" mentia com 6 pela frente). ④ lista é **mapa**: nome + estado, sem legenda item a item.
