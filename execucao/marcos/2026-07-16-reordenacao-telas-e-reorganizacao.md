---
tipo: historico
status: congelado
data: 2026-07-16
assunto: marco-do-dia
tags: [marco, flow, reordenacao, motor, design-system, vault, auditoria]
---

# 🏁 2026-07-16 (2ª sessão) — o flow inverteu, as telas nasceram, a casa foi arrumada

> Sessão longa. Começou pra "construir as telas do B2" e virou outra coisa: a ordem do flow
> morreu no meio, o motor foi reescrito duas vezes, o vault foi reorganizado e as duas
> primeiras telas de produto nasceram em código. Registro do que ficou.

## 1. 🔄 A reordenação (a decisão-mãe do dia)

**O Pedro achou o erro, não eu.** O flow cobrava no **T16**, depois de **15 telas de esforço**:
> *"imagina alguém passar por todos esses processos e ver valores apenas múltiplas telas tensas,
> para talvez pensar: á, achei que fosse mais barato!"*

**Novo:** gate CNAE → **teaser** → **paga (N9)** → todo o B2 dentro do app. Telas **N1–N25**.
→ [[reordenacao-flow-cobranca-cedo]] · mapa T→N em [[indice-autoridade]]

**Correção de rota no debate:** "preço mostrado tarde" ≠ "preço cobrado tarde". São doenças
diferentes; a reordenação cura as duas, mas **só com o teaser** — sem ele a gente copiaria o
funil de quem **não tem o que demonstrar** e jogaria fora o próprio diferencial.

**O T18 rachou em dois** (o melhor subproduto): **aceite do contrato (N8, reversível, CDC art.49)**
× **termo irreversível (N20, onde a máquina liga)**. Estavam colados por acidente de ordenação —
a gente alegava "serviço exaurido" no momento em que nada tinha sido executado.

## 2. 🔍 As 2 capturas do líder (o que destravou tudo)

O Pedro colou print a print o funil real da Contabilizei **e recuperou os documentos do próprio
CNPJ**, aberto por eles em dez/2025. Não é teardown de fora: é o caso real, com datas e boletos.
→ [[2026-07-16-funil-abertura-ate-pagamento]] · [[2026-07-16-pos-pagamento-operacao-real]]

| Achado | Fato |
|---|---|
| **Cobram na 3ª tela** | nome, e-mail, celular, categoria (dropdown de 13), endereço, CPF. **Zero validação de elegibilidade** |
| **Sem gate de CNAE** | dropdown grosseiro com escape hatch. Confirma: eles cobram cedo **porque não têm o que demonstrar** |
| **O "portal" é um Zendesk** | 4 tickets cobrem a abertura inteira. Nosso T20/N21 não é "melhor": é categoria que eles não têm |
| **🔥 Pedem pra DESABILITAR o 2FA do gov.br** | por escrito, em e-mail padrão. A automação deles não lida com 2FA |
| **8 resets de senha em 72h** | o e-mail de boas-vindas manda entrar via "Esqueci minha senha". Não é bug do usuário: é o fluxo oficial |
| **TFLF R$168,48 no dia ~40** | 4 dias pra pagar, **correção monetária já embutida**. Não citada no checkout |
| **Dispensas = AUTODECLARAÇÃO** | declararam em nome do cliente que ele "instalará medidas contra incêndio". Ele não sabe |
| **Prazo real** | pagou 10/12 → CNPJ **12/12** → alvará 15/12 → dispensas **02/01** → taxa **19/01** |

**A tese que saiu disso: a cauda é o produto.** Eles abrem o CNPJ em 2 dias — não se ganha aí.
Some do dia 17/12 ao dia 40.

## 3. ⚙️ Motor: v0.2.3 → **v0.4.0** (19 personas, 2 flows, 19/19)

- **Ordem nova** (ENTRADA→B1→**B3**→**B2**→B4) · passos novos: `b1.triagem` `b1.faturamento`
  `b1.teaser` `b2.consenso` `b2.termo` `b4.dispensas`
- **🆕 flow #2 `migrar`** — blind spot mais antigo do vault (*"metade do mercado, zero testado"*).
  **Achado ao construir:** o flow #1 **não tinha porta pra ele** (o fork mandava "já tenho CNPJ"
  pro login, mas quem troca de contador **não tem conta**). Riscos exclusivos: **TTRT depende do
  contador ANTIGO validar** (pausa com terceiro **hostil**, cliente já pago) e **passivo herdado**.
- **Auditoria spec×motor: 5 itens ✅ que nunca viraram código.** O pior (UX-39): a spec manda
  *"não cravar 28%, mirar 30%"* e o motor **cravava 28%** — dava o conselho oposto ao da spec.
  Corrigidos 3 (UX-39, UX-24, UX-06); UX-25 e UX-30 seguem 🔴.
- **Rodada #5 de UX** (1ª no flow novo): o tabuleiro caiu de 88-95% → 63-100% e voltou a 83-100%
  após os fixes. **UX-49** foi o grave: o teaser não cobria `cida`/`govbr-bronze` (CNAE Anexo III
  direto) — **as duas leigas, o nicho declarado, iam pro checkout sem argumento nenhum.**
  **UX-50:** a reordenação **revogou o UX-44 em silêncio**.

## 4. 🧱 Design System + as 2 telas em código

**Método travado:** fundação **larga**, componente **estreito**. Critério: *"decidir sem conhecer
o portal é aposta?"*. → [[design-system]]

- **2 shells:** wizard (N1–N9, modo, sem nav, **sem pausa**) × app (N10+, a casa, nasce no N9).
  Viraram **route groups** — a fronteira é estrutural, não convenção.
- **UX-32 aposentado** (reverte item da rodada #3).
- **O raio veio do logo** (símbolo tem raio ≈0,27×lado → `radius-md` 12). A régua já existia.
- **Atrito mecânico:** primitivo **não** vira classe utilitária. `bg-coral-500` **não existe** —
  verificado no CSS gerado. *Governança solo é mecânica, não social.*
- **Farol: N4 + N18** (as antigas T7+T14 tinham virado N11+N18, **as duas dentro do app**).
- **Sem Figma** (decisão do Pedro): desenha direto no código. `/mockup` vira a ferramenta de review.

## 5. 🧭 A reorganização (provocação do Pedro)

> *"vejo com muita frequência vc falando: essa tal coisa passou despercebido, errei em tal coisa...
> não temos tempo pra esses delírios."*

**Nove "achei agora" num dia.** Todos por sorte. A medição derrubou minha hipótese (as fontes
**não** eram ilhas: `BASE-ESTRATEGICA` tem 15 backlinks). Os problemas reais:
1. **Gravidade invertida** — o morto tinha 5× mais backlinks que o vivo (22 × 4)
2. **Dependência não rastreada** — 7 dos 9 eram *"X dependia de Y e ninguém sabia"*
3. **Vocabulário improvisado** — 20 status, 25 tipos, 106 notas sem status

**Feito:** [[indice-autoridade]] · [[fila-validacao-humana]] · `verificar.js` · junction da memória
(**ideia do Pedro** — eu tinha apresentado falso dilema) · 138 notas migradas · **links 56 → 4**.

**Auditoria multi-agente** (5 eixos, Opus 4.8, cético por achado): **26 brutos → 13 confirmados,
13 derrubados**. Nenhum é decisão errada. Fixes 1–3 aplicados.

## 6. 🎯 Os padrões (valem mais que os achados)

1. **O `/fechar` atualiza uma ponta e esquece a outra.** UX-44, UX-32, tiers do B3: mesma doença.
2. **`deriva_de` não protege** — aviso genérico (13 arquivos de uma vez) vira ruído.
3. **🔥 Fato do concorrente vestido de fato nosso.** O `ARGUMENTO_SERVICO` promete *"CNPJ em ~2 dias"*
   medido na operação **da Contabilizei**. O CNPJ é do Pedro; **a operação medida não é nossa**
   (a nossa é 5 dias, RPA). Passa por todos os filtros: é datado, tem documento, tem número.
4. **Cache que auto-carrega apodrece em silêncio** — a memória entra **antes** do índice.
5. **Regra existe, código não tem** — a rota `incerto` tinha caso de teste e se perdeu na migração.
6. **O vício do 🔴** — inflar bloqueio. Corrigido: hoje há **um** 🔴 real.

## 7. Links
[[reordenacao-flow-cobranca-cedo]] · [[indice-autoridade]] · [[fila-validacao-humana]] ·
[[design-system]] · [[compilado-ux-flow]] · [[2026-07-16-funil-abertura-ate-pagamento]] ·
[[2026-07-16-pos-pagamento-operacao-real]] · [[HOME]]
