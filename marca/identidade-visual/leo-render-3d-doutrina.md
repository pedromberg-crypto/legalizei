---
tipo: doutrina
status: vivo — v0.2, template real do Pedro incorporado 29/08
data: 2026-08-29
assunto: leo-render-3d
tags: [marca, personagem, leo, visual, doutrina, prompt]
---

# 🦦 Doutrina de render 3D do Léo

> **O que este doc é:** template reutilizável de prompt pra gerar imagens estáticas do Léo (PNG sem fundo) nas telas de Welcome e onde mais fizer sentido. Quem manda em QUEM é o Léo (personalidade, traços físicos, o que ele ironiza) continua sendo `marca/personagem-leo.md` — este doc só trata do RENDER (estilo/cor/composição), não redigita nada de personalidade.

## 0. Duas famílias de asset — NÃO confundir (correção 29/08)

- **Família A — ícones flat glossy** (ex: `app/public/icones/faixa-*-coral.png`/`*-creme.png`, cédulas de dinheiro): glossy soft-clay/plástico brilhante, bordas grossas, brilho especular suave. Escopo: ícone pequeno isolado, sem cenário.
- **Família B — render de cena 3D completo** (Léo + ambiente, ex: as 3 imagens do Welcome): **matte** o tempo todo, personagem E ambiente/props, sem brilho especular forte em nada. Esta é a família que este doc trata a partir daqui.

Eu confundi as duas nas primeiras rodadas (pedindo "glossy" pros livros de uma cena que devia ser toda matte) — corrigido.

## 1. Template real (Pedro, 29/08) — fonte primária, usar esta estrutura em todo prompt de cena

Prompt de produção que já gerou o carrossel do `legalizai-site` (`lp/_lab/index.html`, 6 cards). Estrutura fixa, 7 blocos, nessa ordem:

1. **Style** — clay-render matte + instrução de VARIAR ângulo/pose a cada nova cena (nunca repetir a mesma composição da cena anterior).
2. **Character** — referência à imagem anexada como o personagem EXATO (preservar design/proporções/cor/traço facial), só pose/ângulo/luz mudam. Figurino variável por cena (ex: gravata-borboleta some quando "informal na mesa").
3. **Pose** — ação específica da cena, sempre "mid-action", nunca pose estática de apresentação.
4. **Camera** — enquadramento (mais fechado que corpo inteiro), ângulo 3/4 (nunca frontal-simétrico), altura dos olhos do personagem, sensação candid.
5. **Scene** — ambiente + 1 detalhe simbólico pequeno e secundário (o ícone de robô riscado é recorrente na série = "não robô"), tela do monitor com ícone abstrato (nunca texto legível/logo real), fundo simples que degradê pra sombra nas bordas (nunca 2 janelas simétricas).
6. **Color palette** — bloco fixo, mesmo texto sempre: fundo `#1C1610` matte, acento coral `#F2643C`, creme `#F5EFE6` só como highlight mínimo.
7. **Composition** — retrato 4:5, rosto do personagem na metade superior, terço inferior livre (reservado pro texto que entra depois por cima), enquadramento mais fechado/íntimo que uma foto de corpo inteiro.

Regra fechada: nunca texto real legível, nunca logo/ícone de app real, nada competindo visualmente com o personagem.

Exemplo real (card 2, Léo sentado com headset de telemarketing):

```
Soft clay-render 3D illustration, matte rounded materials, gentle studio global
illumination, minimal product-illustration style, no hard specular highlights.
Same render quality, material feel and color palette as the reference scenes
already established for this series — but a DIFFERENT camera angle and pose
than previous scenes in the series (vary this every time: don't repeat the
same symmetrical standing-behind-a-counter composition).

Character: use the attached reference image as the exact character — a meerkat
mascot wearing a coral polo shirt with a small white rounded checkmark badge
on the chest, round glasses. Preserve its design, proportions, colors and
facial features precisely; only adapt pose, angle and lighting to this new
scene. This time: NO bow tie (it's off-duty/casual at the desk), wearing a
chunky retro telemarketing-style headset with a small mic boom instead. Pose:
sitting at a desk, leaning slightly forward and to one side, actively
engaged — one paw resting near the headset mic as if mid-conversation, warm
animated expression (mouth slightly open, talking), the other paw resting on
the desk near the keyboard. Genuine mid-action feel, not a static
presentation pose.

Camera: closer and tighter than a full-body shot — frame from mid-torso up,
character and their computer screen filling most of the frame. Shoot from a
slight 3/4 angle (not perfectly frontal-symmetrical), camera roughly at the
character's eye level or just below, so it feels like a candid moment, not a
posed product shot.

Scene: a compact desk, mostly OUT of frame except its near edge — a chunky
rounded-corner monitor sits on it, screen glowing softly, showing a simple
abstract chat-bubble icon with a checkmark inside (no readable text, no real
messaging-app logo). A small keyboard hints at the bottom edge of frame. One
tiny symbolic detail somewhere small and secondary (on the monitor stand or
desk edge): a tiny robot-head icon etched with a diagonal slash through it,
matching the crossed-out-icon motif used across this series. Background stays
simple and soft — a hint of the same dark wall and a sliver of warm window
light out of focus behind, not a full symmetrical window pair this time (let
it fall off into soft shadow at the edges of frame).

Color palette — dark-dominant, matching the series: desk, wall and monitor
housing in deep warm near-black charcoal / dark ink (#1C1610, matte). Vivid
warm coral-orange (#F2643C) as accent: the character's polo, the checkmark
glow on screen, one small trim detail on the headset or monitor edge. A small
amount of warm cream/off-white (#F5EFE6) only as a tiny highlight — never a
dominant surface.

Composition: portrait orientation, 4:5 aspect ratio. Character's face and
headset stay in the upper half of the frame, well clear of the bottom third
(reserved for text overlay later) — but framed closer/tighter than a full
standing figure, more intimate.

No readable real text/typography anywhere. No real brand logos or app icons.
Clean, uncluttered, nothing else competing with the character for attention.
```

## 2. Regra de composição — recorte de fundo é o teste, não o resultado final

Toda cena é gerada COM fundo (ambiente/mesa/parede escura), mas o teste real é: **remove o fundo mentalmente, a composição ainda fecha?**

- Léo sempre ANCORADO em algo sólido que fica DENTRO do próprio corpo/silhueta dele ou que ele segura/toca diretamente — nunca um objeto solto flutuando ao lado dele que dependia do chão/mesa pra fazer sentido espacial.
- Composição fecha como um "sticker" de sujeito único: sem elemento cortado na borda que fique estranho sem contexto, sem sombra desenhada que vire mancha esquisita depois do recorte.
- Se o ambiente tiver mobília, ele PRECISA estar em contato físico com ela (sentado, apoiado, segurando), nunca só "no mesmo cômodo" solto no meio do ar composicionalmente.
- ⚠️ O template real (§1) já resolve isso de outro jeito pro Welcome especificamente: como as imagens agora são fundo FULL-BLEED por trás do card inteiro (não um PNG recortado sem fundo), esse teste de "remove o fundo" deixa de valer pro Welcome — lá a foto fica inteira, com gradiente escuro por cima. Continua valendo pra qualquer asset que precise ser um PNG solto (ex: ícone isolado, não cena).

## 3. Variedade de expressão/pose — obrigatório na série, catálogo aberto

Personalidade não muda (`personagem-leo.md` §7: nunca fofinho, nunca Sábio distante, adulto/esperto), mas a EXPRESSÃO e a POSE mudam por peça pra não cansar visualmente numa sequência — o próprio template (§1, bloco Style) já exige isso ("vary this every time"). Traços físicos fixos (não inventar de novo a cada prompt, §12 do doc do personagem):

- Suricato porte normal da espécie, pelagem creme-castanho com máscara escura ao redor dos olhos.
- Camisa polo coral (`#F2643C`) com o **badge branco arredondado do check** (símbolo da Legalizai) no peito — não é um "L", é o check. Corrigido 29/08, ver `personagem-leo.md` §12.
- Óculos redondos de aro fino. Gravata-borboleta preta É OPCIONAL por cena (o próprio template varia isso: "informal na mesa" tira a gravata).
- Expressão-base: "olhos atentos, leve sorriso de canto, nunca boca aberta/espalhafatoso" de repouso, mas cada cena pode variar pra algo mais "mid-action" (ex: falando, sorrindo largo numa saudação) desde que não vire bobo/inocente.

**Catálogo de poses já usadas** (atualizar a cada imagem aprovada):
- Card 2 (referência do Pedro, já em produção no `legalizai-site`): sentado à mesa, headset de telemarketing, conversando, uma pata perto do microfone, outra no teclado.
- ✅ 29/08 — Slide 1 Welcome (aprovado, `card-teste-welcome-1.jpg`): mesma mesa/headset/monitor do card 2, mas variação pedida: sentado recostado, acenando com uma pata pro espectador (saudação, não ligação em andamento), outra pata apoiada na mesa. Ângulo 3/4 do lado oposto ao card 2.
  - ⚠️ **Armadilha nova**: espelhar (`flop`) a imagem depois de gerada INVERTE os checkmarks (badge do peito, ícone da tela) — ficam de cabeça pra baixo/ao contrário, quebra a marca. Nunca espelhar em pós-produção pra variar o lado do enquadramento: gerar a pose já no lado certo direto no prompt (ex: "waving with the LEFT paw" / "monitor on the right side of frame").
- ✅ 29/08 — Slide 3 Welcome (aprovado, `card-teste-welcome-3.jpg`): mesma mesa/monitor/robô-riscado da série, segurando uma placa de preço com "$" e sorriso de canto sabido, apontando pra ela. Anexadas 2 referências na geração (PNG do Léo + imagem aprovada do slide 1), manteve a mesa/monitor consistentes sem precisar espelhar nada.
- ✅ 29/08 — Slide 2 Welcome (aprovado, `card-teste-welcome-2.jpg`): mesma mesa/monitor/robô-riscado da série, 1 pata em cada uma das 2 pastas (nova × usada), monitor mostra ícone de fork (3 setas + check) em vez do ícone genérico pedido no prompt — variação aceita, ainda bate com o tema "caminhos diferentes, mesmo cuidado". **Série de Welcome fechada: os 3 slides têm agora a mesma mesa/monitor/personagem, só variando pose/prop/ângulo.**

## 4. Armadilhas já mordidas — histórico (correção 29/08)

⚠️ **Correção importante**: nas rodadas de teste ANTES de eu ler o template real (§1), eu insisti (errado) que o badge do peito devia ser um "L" geométrico, e marquei 2 gerações como "logo errado" quando na verdade estavam certas (é o check, não o L). Mantendo o histórico abaixo só pelos OUTROS aprendizados que continuam válidos, com nota de correção onde o "erro de logo" apontado não era erro de verdade.

- ~~**Logo errado**: virou um "L" cursivo~~ — **não era erro real**, eu que pedia a coisa errada. O badge é o check (símbolo Legalizai), branco, arredondado, pequeno. Válido continuar pedindo: tom simples, sem script/decorativo.
- **Livros/props realistas demais**: saiu foto-realista (couro real, texto de lombada legível). Continua válido: props também ficam matte/simplificados, sem texto legível, sem textura realista — mesma régua do personagem (§0, Família B é tudo matte).
- **Expressão "boba" em vez de astuta**: sorriso genérico/pleasant deixa cara de personagem fofinho de criança. Precisa nomear explicitamente o registro desejado por cena (confiante, malicioso, caloroso etc.), nunca deixar a expressão em aberto.
- **Máscara escura ao redor dos olhos sumiu** numa geração — traço FIXO de identidade (§12 do `personagem-leo.md`), reforçar sempre, nunca assumir que o modelo mantém sozinho.
- **Perda de ancoragem física** (personagem "flutuando" perto de objetos sem tocar) — vale só pra cenas onde ele interage com mobília solta; o template real (§1) já ancora isso na própria mesa/pose descrita.
- **Cabeça grande/estilo plush cartoon** — reforçar proporção natural da espécie quando a geração desviar pra esse lado.
- **Pedestal/plataforma solta surgindo do nada** embaixo dos pés — proibir explicitamente quando a cena for em pé sem mesa: sem base/plinto, pés tocam o chão ou o objeto diretamente.

## 4.1. Prompt gerado — Slide 3 Welcome (29/08, ✅ aprovado, `card-teste-welcome-3.jpg`)

Tema: "Contabilês eu ironizo. Susto no boleto eu não deixo passar." / preço único sem pegadinha. Continuidade proposital: mesma mesa dos slides 1 e 2 (série coesa), variação de pose/ângulo/prop.

```
Soft clay-render 3D illustration, matte rounded materials, gentle studio global
illumination, minimal product-illustration style, no hard specular highlights.
Same render quality, material feel and color palette as the reference scenes
already established for this series — but a DIFFERENT camera angle and pose
than previous scenes in the series (vary this every time: don't repeat the
waving-at-headset-desk composition already used).

Character: use the attached reference image as the exact character — a meerkat
mascot wearing a coral polo shirt with a small white rounded checkmark badge
on the chest, round glasses. Preserve its design, proportions, colors and
facial features precisely; only adapt pose, angle and lighting to this new
scene. Same casual off-duty styling (no bow tie, no headset this time).

Pose: sitting at the same style of desk, leaning slightly toward the camera
with a sly, knowing half-smile (proud, a little mischievous, like he just
caught something), holding up a small rounded price-tag-shaped object in one
paw at chest height, tilted slightly toward the viewer, with the other paw
pointing at a small smiley/no-asterisk symbol on the tag as if showing it off
proudly. Genuine "look, no trick" moment, not a static presentation pose.

Camera: closer and tighter than a full-body shot, frame from mid-torso up,
character and the price tag filling most of the frame. Shoot from a slight
3/4 angle, from the OPPOSITE side used in the greeting scene, camera roughly
at the character's eye level, candid feel, not a posed product shot.

Scene: the same compact desk, mostly out of frame except its near edge — the
same chunky rounded-corner monitor glows softly in the background, showing a
simple abstract price-tag icon (no readable text, no numbers, no real
currency symbol). One tiny symbolic detail somewhere small and secondary (on
the monitor stand or desk edge): the same tiny robot-head icon etched with a
diagonal slash through it, matching the crossed-out-icon motif used across
this series. Background stays simple and soft — a hint of the same dark wall
and a sliver of warm window light out of focus, falling into soft shadow at
the frame edges.

Color palette — dark-dominant, matching the series: desk, wall and monitor
housing in deep warm near-black charcoal / dark ink (#1C1610, matte). Vivid
warm coral-orange (#F2643C) as accent: the character's polo, the price tag
prop, the icon glow on screen. A small amount of warm cream/off-white
(#F5EFE6) only as a tiny highlight, never a dominant surface.

Composition: portrait orientation, 4:5 aspect ratio. Character's face and the
price tag stay in the upper half of the frame, clear of the bottom third
(reserved for text overlay later), framed closer/tighter, intimate.

No readable real text/typography anywhere. No real brand logos or app icons,
no real currency symbols or numbers. Clean, uncluttered, nothing else
competing with the character for attention.
```

O que espero: mantém a mesma mesa/monitor dos slides 1 e 2 (série visualmente coesa, mesmo "escritório" do Léo), mas troca o prop pra uma placa de preço (callback ao card 1 original "Preço fechado, sem asterisco"), pose de "olha, sem pegadinha" em vez de segurar a placa esticada acima da cabeça (que era mais still/pose de produto). Ângulo trocado (lado oposto do slide 1) pra não repetir enquadramento. Reforcei "no real currency symbols or numbers" porque preço é o tema mais fácil de vazar texto/número sem querer.

## 4.2. Prompt gerado — Slide 2 Welcome (29/08, ✅ aprovado, `card-teste-welcome-2.jpg`)

Tema: "Abrindo do zero ou já com CNPJ rodando." / "Empresa nova ou já rodando com outro contador, eu vigio do mesmo jeito." — aquece o fork (E3, abrir × migrar) sem virar pergunta. Mesma mesa/monitor da série (slides 1 e 3), prop novo: 2 pastas lado a lado (nova × já existente).

```
Soft clay-render 3D illustration, matte rounded materials, gentle studio global
illumination, minimal product-illustration style, no hard specular highlights.
Same render quality, material feel and color palette as the reference scenes
already established for this series — but a DIFFERENT camera angle and pose
than previous scenes in the series (vary this every time: don't repeat the
waving pose or the price-tag pose already used).

Character: use the attached reference image as the exact character — a meerkat
mascot wearing a coral polo shirt with a small white rounded checkmark badge
on the chest, round glasses. Preserve its design, proportions, colors and
facial features precisely; only adapt pose, angle and lighting to this new
scene. Same casual off-duty styling (no bow tie, no headset).

Pose: sitting at the same style of desk, warm reassuring smile (open,
welcoming, not sly this time), one paw resting on a small thin closed folder
on one side of the desk (crisp, new-looking) and the other paw resting on a
slightly thicker, more worn folder on the other side (older, well-used) —
both folders equally close to him, as if saying "either one, same care."
Relaxed, balanced posture, not favoring one side.

Camera: closer and tighter than a full-body shot, frame from mid-torso up,
character and both folders filling most of the frame. Shoot from a slight
3/4 angle, more centered/frontal than the previous two scenes but still not
perfectly symmetrical, camera roughly at the character's eye level, candid
feel, not a posed product shot.

Scene: the same compact desk, mostly out of frame except its near edge — the
same chunky rounded-corner monitor glows softly in the background, showing a
simple abstract icon of two small paths merging into one checkmark (no
readable text, no real app icon). One tiny symbolic detail somewhere small
and secondary (on the monitor stand or desk edge): the same tiny robot-head
icon etched with a diagonal slash through it, matching the crossed-out-icon
motif used across this series. Background stays simple and soft — a hint of
the same dark wall and a sliver of warm window light out of focus, falling
into soft shadow at the frame edges.

Color palette — dark-dominant, matching the series: desk, wall and monitor
housing in deep warm near-black charcoal / dark ink (#1C1610, matte). Vivid
warm coral-orange (#F2643C) as accent: the character's polo, one trim detail
on each folder, the icon glow on screen. A small amount of warm cream/
off-white (#F5EFE6) only as a tiny highlight, never a dominant surface.

Composition: portrait orientation, 4:5 aspect ratio. Character's face and
both folders stay in the upper half of the frame, clear of the bottom third
(reserved for text overlay later), framed closer/tighter, intimate.

No readable real text/typography anywhere. No real brand logos or app icons,
no real currency symbols or numbers. Clean, uncluttered, nothing else
competing with the character for attention.
```

O que espero: mantém a mesma mesa/monitor/robô-riscado da série (slides 1 e 3), prop novo (2 pastas, nova × usada) visualiza literalmente "empresa nova OU já rodando" sem precisar de texto, gesto simétrico/equilibrado (nem favorece um lado) reforça "eu vigio do mesmo jeito" sem parecer escolha difícil. Ângulo mais frontal que os outros 2 (que foram left/right), pra variar mas sem repetir nenhuma das 2 poses já aprovadas. Anexar as 2 referências de novo (PNG do Léo + uma das imagens já aprovadas) pra manter mesa/monitor consistentes.

## 5. Fluxo de trabalho

1. Eu (Claude) escrevo o prompt (usando a estrutura do §1), Pedro revisa.
2. Pedro gera a imagem numa ferramenta externa (nanobanana ou equivalente), sempre **anexando o Léo de referência em alta resolução** junto do prompt, pra manter consistência de personagem entre gerações.
3. Aprovado, eu registro a pose usada no catálogo (§3) e sigo pro próximo prompt já sabendo o que não repetir.

## Cross-refs

- Personalidade/traços físicos travados: [[personagem-leo]] (`marca/personagem-leo.md`)
- Paleta de marca: `marca/identidade-visual/paleta-cores.md`
- Copy das 3 telas de Welcome na voz do Léo: `app/src/components/welcome.tsx`
