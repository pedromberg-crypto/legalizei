---
tipo: historico
status: vivo
data: 2026-07-17
assunto: limpeza-cnae-e-pills
tags: [cnae, escopo, ux, n4, mockup, achado]
---

# 🔎 A lista de CNAE estava furada na raiz + as pills do N4

> Flow longo, começou em 16/07 e virou a noite. Começou em "arruma o espaçamento do mockup"
> e terminou achando que **a lista do que a Legalizei atende nunca foi uma lista do que a
> Legalizei atende**.

## 🔥 O achado que manda em tudo: ausência de recusa lida como presença de atendimento

Os **460 atendidos** (e os **260 de serviço** que saíram deles) nunca foram verificados.
A cadeia real, reconstruída nesta sessão:

1. **Não existe página de CNAEs atendidos na Contabilizei.** Nunca existiu.
2. O que existe é `suporte.contabilizei.com.br/.../204678699-Atividades-não-atendidas`:
   **17 categorias RECUSADAS**, por categoria, não por CNAE. É uma lista de **NÃOs**.
3. Os 460 saíram da **inversão** disso: mapeou-se as 17 recusas em seção/divisão e
   **tudo que sobrou virou "atende"**.
4. **Prova documental:** os 460 carregam todos a mesma string de justificativa, literal:
   `presumido (serviço/comércio leve no Simples; validar)`. **Nos 460.** O campo pedia
   validação e ninguém validou.

`8422-1/00 DEFESA` está em "atende" porque o Ministério da Defesa não está entre as 17
coisas que a Contabilizei recusa. Óbvio que não está: por que uma página de suporte diria
"não atendemos as Forças Armadas"?

**Não é desleixo, é inversão lógica.** E explica de uma vez o que vinha aparecendo como
achado solto a cada prompt (chamada do Pedro, e ele estava certo).

**O mapeamento das 17 também falhou**, e dá pra provar sem opinião:
- item 3 = **"Cartórios"** → `6912-5/00 CARTÓRIOS` saiu **"atende"**;
- item 8 = **"Gráficas (impressão de material)"** → as 5 "edição integrada à impressão" saíram **"atende"**.
Recusas explícitas, nomeadas, que passaram.

## 🧹 Limpeza dos 260 (proposta, não veredito)

`node pesquisa/cnae-matriz/classificar-260.js` → [[limpeza-260-servico]]

| | Qtd | Quem decide |
|---|---|---|
| ⛔ impossível | **45** | Pedro (factual: ninguém abre ME assim) |
| 🕓 duvidoso | **91** | Larissa/Mauro, em 7 baldes com **pergunta fechada** cada |
| ✅ "real" | **124** | sobreviveu. **Não é validado: é não-refutado** |

**Política:** na dúvida vai pra `duvidoso`, nunca pra `impossivel`. Duvidoso volta da fila;
impossível some da lista.

⚠️ **Os 124 NÃO são lista validada.** Nenhum contador olhou. O Pedro chamou de "já validados
e confirmados" e foi corrigido na hora: tratar **não-refutado** como **confirmado** é
exatamente o que produziu `DEFESA` na lista. O crivo dos especialistas em contabilidade é o
próximo passo, e o Pedro já encaminhou.

**Achado dentro do achado:** o balde `deveria-ser-condicional` tem **10 CNAEs que exigem
conselho e estão marcados "atende"** (corretagem/CRECI, leiloeiro, clínica geriátrica,
agronomia/CREA). **Os 68 condicionais também estão furados.** E agora custa dinheiro: com a
cobrança no N9, o corretor escreve "corretagem de imóveis" no N4, o lookup diz 🟢, ele
**paga**, e só depois aparece o CRECI. É o "cobrar de quem não pode abrir" que a reordenação
foi feita pra matar (UX-21).

## 🔴 Isto respinga no dev

O `cnae-lookup-b1.json` entregue 15/07 sai das **mesmas 1332 subclasses pela mesma regra**.
A triagem que ele está codando responde **"atende, passa liso"** pra `8422-1/00 DEFESA`.
O 🔴 de "avisar o dev" deixou de ser só "o contrato mudou": **os dados também estão furados**.

## 🏷️ Pills do N4 — o debate

`node pesquisa/cnae-matriz/taxonomia-pills.js` → [[taxonomia-pills-n4]] (`rascunho`)

9 pills cobrindo os 124, zero órfão. **3 delas são lata de lixo** e a tabela expôs:
`Consultoria e apoio a empresas` junta consultoria em gestão com **aluguel de roupa de festa,
fotocópia e lan house**; `Limpeza, manutenção e reparos` junta paisagismo com **reboque,
água por caminhão e conserto de relógio**; `Beleza e pets` tem **agência matrimonial**.
Existem porque forcei cobertura dos 124, não porque alguém pensa assim.

### 🟢 A decisão que saiu do debate: **a pill ESTREITA, não valida**

O Pedro propôs inverter a prioridade (pill primária → "te atendemos" → pagamento; texto como
escape secundário), inspirado no líder. **A inversão foi aceita. O "já dar como validada"
morreu.** Convergiu em: **pill → "descreve um pouco mais o que você faz" → IA cruza → tela de
aceite → pagamento.**

**Por que o "valida" morreu, com evidência do motor, não opinião:**
- **`instrutora` (Ivete)** é a persona do CNAE-ótimo. Os 2 CNAEs dela caem em **pills
  diferentes**: `7020-4/00` consultoria (Fator R → V, **15,5%**) está em `Consultoria`;
  `8599-6/04` treinamento (§5º-B → III, **6%**) está em `Educação`. O arquivo dela diz
  *"não sabe que o código escolhido muda o imposto"*. Pill-valida = **a escolha da pill vira a
  escolha do CNAE**, feita por quem não pode fazê-la, e ela **paga** antes de o motor poder
  contradizê-la. A feature-âncora desarmada na 1ª tela.
- **`camaleao` (Carla)**: *"sabe o que faz mas descreve de um jeito que confunde"*. Se erra ao
  **descrever**, erra mais ao **se encaixar na nossa caixa** — auto-classificação exige
  conhecer a fronteira da NOSSA taxonomia. **Descrever é mais fácil que saber em qual gaveta
  você está.** A pill pergunta o mais difícil parecendo o mais fácil.
- **Buraco estrutural:** as pills nasceram só dos 124 🟢, então **toda pill é 🟢 por
  construção** — o conjunto não expressa 🟡 nem 🔴. **100% do risco de elegibilidade mora no
  escape.** A nutricionista não acha a pill dela, toca `Beleza, bem-estar e pets` "perto o
  suficiente" → 🟢 → paga → não dá pra abrir.
- **A simplicidade do líder é financiada por call center.** Nossa captura:
  *"o risco de elegibilidade é transferido pro pós-pagamento e absorvido pelo atendimento
  humano (...) o humano é o plano B do funil"*. Por isso o dropdown deles tem Medicina e
  Advocacia: dizem sim pra todos e resolvem no braço. Importar o funil sem o call center =
  importar o passivo sem a mitigação, e ele cai no Mauro sem estar orçado.

**A favor da pill, e é real:** a **`cida`** (61 anos, *"usa o celular só pra WhatsApp e foto"*)
ganha com pill. Ela é quem paga a conta de exigir a frase. Registrado, não varrido.

**Pedro fechou** (17/07): abrir empresa é sério, qualquer persona gasta o pouco tempo de
escrever uma frase, porque ela também quer sucesso na abertura.

### ⛔ Pills guiadas (sub-pills de CNAE): descartado
1. Descrição de CNAE não é rótulo humano (*"Desenvolvimento e Licenciamento de Programas de
   Computador Não Customizáveis"*).
2. **14 dos 124 são literalmente "(outros)"** — o IBGE já usou o escape.
3. 🔥 **Não dá pra mostrar a consequência.** Os 124 têm `anexo_base` **idêntico**
   (`"III/IV/V*"`) e `fator_r`/`aliquota_inicial` **vazios nos 124**. Guiar entre `6201-5/01` e
   `6311-9/00` sem dizer o que muda = todo o ônus, zero benefício.
4. O problema da Ivete **se repete dentro da pill** (em Tecnologia, `6201-5/01` × `6311-9/00`
   é família de swap do MVP).
5. Power user já resolvido: o protótipo tem **"já sei meu CNAE", código direto**.

### 🐛 Guarda-corpo construído pro design errado
`taxonomia-pills.js` obriga **todo CNAE a ter pill**, porque foi codado quando pill era
**promessa**. No design convergido pill é **rampa** e o veredito vem do texto + IA, então CNAE
sem pill deixou de ser bug. **Ele precisa inverter:** não é "todo CNAE tem pill", é
**"toda pill só aponta pra CNAE 🟢"**. Isso liberta a taxonomia de cobrir os 124 → as 3 latas
de lixo somem → sobram **~6 pills de reconhecimento**. **Não construído.**

## 🍞 A pista que ficou quente (é por aqui que a próxima janela continua)

`contabilizei.com.br/contabilidade-online/cnae/` tem as colunas
**CNAE · Descrição · Anexo · Fator R · Alíquota · Contabilizei Atende** — exatamente o que
falta na nossa matriz (`fator_r` e `aliquota_inicial` **vazios nos 1332**; `anexo_base` com a
mesma string genérica em todos).

**Não temos a lista.** O que está salvo é OCR de uma **imagem** (`cnae-tabela-seo-ocr-raw.txt`,
46KB, 12 tiles): **369 códigos únicos**, dígitos corrompidos (`6203100`→`4203100`,
`6204000`→`4204000`, `4ó_IóQQQ`), texto derretido, **colunas descoladas** (alinhar
código↔descrição↔alíquota é chute posicional), linhas duplicadas.

⚠️ E a página **marca recusa também**: aparece um **"Não atende"** em `9529-1/05`. A leitura
antiga de que ela "é só SEO, marca quase tudo Atende" pode valer no atacado, mas **tem sinal
ali**. O Pedro abriu os sites e ia guiar a extração quando a janela fechou.

## 📱 As telas (o outro flow da sessão)

- **`/mockup` virou simulador de aparelho.** A v1 desenhava a Dynamic Island como **adesivo**
  e o app pintava embaixo dela. Agora a moldura **injeta `--safe-top`/`--safe-bottom` dentro
  do iframe** (via `<style>` no head; inline no `<html>` dava hydration mismatch, porque o
  `<html>` é do RootLayout). Seletor de aparelho (15 Pro Max 430×932 · 13 mini · SE), zoom, e
  um A/B **"Respeitando ⇄ Ignorando"** que prova que a inset é real.
- 🐛 **`env()` era código morto em todo lugar.** Sem `viewport-fit=cover` no root layout, o
  `env(safe-area-inset-*)` devolve **0 até num iPhone real**. O `.app-footer-cta` prometia
  thumb zone e entregava o CTA colado na barra de gesto. Nunca disparou desde que foi escrito.
- **Safe area virou `--safe-top`/`--safe-bottom`** (default `env()`): não é primitivo nem
  semântico, é medida do vidro. No RN isso é `useSafeAreaInsets()`.
- 🐛 **Bug de escala:** a 75% a moldura encolhia e o vidro não (o div do `transform` herdava a
  largura do wrapper já encolhido). Consertado em 2 camadas: caixa transformada em tamanho
  natural + moldura com `width: fit-content` (**a moldura se mede pelo vidro, nunca pelo pai**).
- **N4:** `rows={4}` era altura de iPhone pequeno e deixava **~495px de vazio** no 932.
  Caixa virou `flex-1` (**o vazio virou a caixa**); título segue **ancorado no topo** de
  propósito (arquétipo A1-PERGUNTA: centralizar faz o h1 pular entre etapas).
- **Typewriter:** frases inteiras em 1ª pessoa no lugar de rótulo; `RITMO` nomeado
  (digita 55→62ms, segura 1600→**2800**ms, apaga 30→20ms). Cada exemplo: ~2,4s → **~6,9s**.
- **"Fisioterapia" saiu do placeholder**: é regulamentada, cai na waitlist. Sugerir o que a
  gente recusa 2 telas depois é convidar pra porta fechada.

## Links
[[limpeza-260-servico]] · [[taxonomia-pills-n4]] · [[cnae-atendidos-e-nao-atendidos]] ·
[[cnae-cobertura]] · [[fila-validacao-humana]] · [[design-system]] · [[reordenacao-flow-cobranca-cedo]]
