---
tipo: teardown
concorrente: Agilize
data: 2026-07-09
gatilho: paginas-publicas
tags: [concorrente, marca]
---
# Páginas públicas — Agilize (foco: Pricing)

> Fonte: print `marca-img/planos.png` (página `/contabilidade-online/`, 1440×11417) + texto/hex extraídos (`_brand_capture2.json` › `agilize`). Toggle capturado em **Serviço** (relevante pro ICP Legalizei = ME serviço Simples). Nada aqui é inventado — preços, limites e copy vêm da captura.

## 💰 Pricing

A Agilize é, no setor, a **única que estampa mensalidade FIXA em número redondo na vitrine** — enquanto Contabilizei, ContaJá & cia. mostram "a partir de R$X" (preço-piso que escala). É o diferencial estrutural da marca. Vale destrinchar o que ele realmente é.

### Os três tiers (toggle **Serviço**, Simples Nacional, com "20% de desconto" já aplicado)

| Plano | Ribbon | Promessa | "De" (âncora) | **Por (cobrado)** | Escala por |
|-------|--------|----------|----------------|-------------------|------------|
| **Basic** | BENEFÍCIOS EXCLUSIVOS | "quem precisa de suporte, autonomia e agilidade no dia a dia" | R$ 324,00 | **R$ 259,00/mês** | folha até 3 pessoas |
| **Unique** ⭐ (destacado) | ESPECIALISTA DEDICADO | "gerente de conta dedicado para sua empresa" | R$ 562,00 | **R$ 450,00/mês** | folha até 5, 100 NF, 40 operações/mês, 2 contas bancárias |
| **Unique Plus** | (sem ribbon) | "operação maior e mais demandas financeiras" | R$ 875,00 | **R$ 700,00/mês** | 800 NF, 100 operações/mês, 3 contas |

Todos: **desconto "20%" permanente** (badge idêntico nos três) + botão **"Contratar"** em verde-menta (`#21e3a3`).

### O que MUDA entre os tiers (a mecânica real)
- **Basic → Unique** não é "mais features contábeis", é **gente**: entra o **gerente de conta dedicado** (atendimento até 21h), consultoria contábil, IRPF incluso, folha de 3→5 pessoas, e começam os **limites de volume** (até 100 NF, 40 operações/mês, 2 contas bancárias, notas em qualquer município).
- **Unique → Plus** não muda a natureza do serviço, só **estica os tetos de volume**: 100→800 notas fiscais, 40→100 operações/mês, 2→3 contas bancárias. É upgrade de capacidade, não de tipo.
- Perk lifestyle transversal (nos 3): **"acesso a consultas, academias e estúdios com WellHub e Starbem"**, marcado como **"Exclusivo"** — benefício de bem-estar embutido num produto contábil, para inflar valor percebido sem mexer no preço.

### Âncora / transparência — a leitura crítica do "fixo"
1. **"Fixo" tem um asterisco grande.** Rodapé: *"Valores válidos para empresas do Simples Nacional. Para Lucro Presumido, fale com os especialistas."* Ou seja: o preço só é fixo/público **dentro do Simples**. Saiu disso → volta pro modelo opaco "orçamento sob consulta" que a marca finge não ter. A bandeira de transparência tem uma **fronteira invisível**.
2. **Não é "fixo" — é fixo-por-tier-de-VOLUME.** Os tetos (nº de NF, folha, operações, contas) fazem o cliente pular de tier quando cresce a **operação**. A diferença esperta vs. os concorrentes: a Agilize escala pelo **custo de servir** (quanto trabalho o cliente dá), não pelo **faturamento** dele. É mais justo e defensável — não pune quem fatura mais, cobra por quem dá mais trabalho. Mas o marketing vende "fixo" e quem estoura o limite de notas é empurrado pra upgrade — **atrito potencial**, irônico num produto cujo território é "chega de surpresas".
3. **O "de R$324 → por R$259" é âncora/decoy, não promoção.** O badge "20% de desconto" é **idêntico e permanente** nos três planos. Se o desconto nunca sai, o preço real é 259 e o 324 riscado é **ficção de ancoragem** — existe só pra fabricar percepção de economia. Numa marca que vende honestidade, é a peça mais frágil da vitrine.
4. **Arquitetura decoy clássica.** O **Unique (450)** é o único destacado (borda roxa + ribbon "ESPECIALISTA DEDICADO"), ladeado por um Basic barato e um Plus caro-e-sem-destaque (700). O Plus existe menos pra vender e mais pra fazer o 450 **parecer o meio-termo racional**. E abaixo dos cards: *"Procurando um plano mais simples para dar o primeiro passo? Saiba mais aqui"* — há um **4º plano de entrada escondido**, tirado da vitrine pra não canibalizar o Basic 259.

### Fixo vs. escala-por-faturamento (o trade-off real)
- **A favor da Agilize:** previsibilidade e comparabilidade. O cliente sabe exatamente quanto paga, some a ansiedade do "quanto vai me custar?", e é trivial comparar ("R$259, ponto" vs. "simule seu faturamento" dos outros). Forte pra conversão.
- **Contra:** deixa dinheiro na mesa com cliente de alto faturamento (paga o mesmo 259 que um pequeno) — recuperado em parte pelos tiers de volume. E o "fixo" só é honesto **até** o Simples; fora disso, o modelo opaco volta.

## 🔎 Achados não solicitados (OLHO CRÍTICO)

- **Contadores de autoridade quebram no print: "+0 anos", "+0 mil empreendedores", "+0 mil empresas abertas".** São counters animados por JS (contam de 0 no scroll) que não dispararam na captura. Real, mas revela um **risco de UX de produção**: se o JS falha no cliente, a página exibe "+0 anos de experiência de mercado" — o oposto da prova social pretendida. Prova social que depende de JS pra não parecer bug é frágil.
- **Prova social sólida onde renderiza:** "4.7 / +2100 avaliações" (bloco de depoimentos), "+50 mil empreendedores", claim de pioneirismo "**primeira contabilidade online do Brasil**", diretor com nome e cargo (Alberto Vila Nova, Diretor de Operações) e selo CRC. Densidade alta — coerente com a tese de que cor ousada (roxo) exige lastro de confiança na mesma dose.
- **Copy do topo mira a dor certa, mas confunde dois "preços".** Headline: *"Chega de surpresas no pagamento de impostos, pouca clareza e suporte que nunca resolve."* A "surpresa" prometida-eliminada é de **impostos** (que escalam com faturamento — governo, não a Agilize controla), mas a marca ancora o discurso na **mensalidade fixa** (fee dela). São coisas diferentes; o cliente pode ler "meus impostos serão fixos", o que é falso. Brecha de expectativa.
- **Verde-menta no botão "Contratar" sobre card lilás/branco** = contraste de ação altíssimo e disciplinado (o verde só aparece em CTA). Sistema de 2 cores (roxo = marca, verde = ação) confirmado também na página de planos.
- **Página `/contabilidade-online/` é uma landing de "trocar de contador"**, não a home — headline e passos ("Análise → Envio de documentações → Tudo pronto") são todos sobre **migração de escritório**, não abertura. O motor de aquisição aqui é **roubar cliente de contador tradicional**, não pegar quem abre empresa.

## 🎯 Pro Legalizei

1. **Preço fixo e único é a arma de aquisição certa pro ICP ME Serviço Simples** — remove a fricção nº1 ("quanto vou pagar / vou ter surpresa?"). Mas fazer o que a Agilize **não** faz: fixo **de verdade**, sem asterisco de regime e sem desconto-âncora permanente. Posicionamento de honestidade radical — *"R$X/mês, sempre. Sem asterisco, sem 'fale com especialista'."* — ataca exatamente a brecha da Agilize.
2. **Escalar por custo-de-servir (nº de notas / folha), não por faturamento, é o modelo correto** — copiar isso da Agilize. Mas comunicar os limites com clareza brutal na vitrine, pra não recriar a "surpresa de upgrade" que o setor promete matar.
3. **Menu enxuto com decoy consciente:** 1 plano destacado no meio, no máximo 3. Pro MLP focado em BH, considerar lançar com **1 plano só** (simplicidade radical: "um preço, tudo incluso") e só depois abrir tiers — vira mensagem, não só tabela.
4. **Matar o "20% permanente".** Se der desconto, que seja real e temporário; senão, cobrar o número cheio com orgulho. Numa marca de transparência, âncora falsa é passivo, não ativo.
5. **Prova social desde o dia 1**, e que **não dependa de JS pra existir** (evitar o "+0 anos"). Números hard-coded ou renderizados no servidor.

## ⏳ Pendente (sobre/faq não capturados)
- `/sobre` e `/faq` **não foram capturados** — roteamento JS da Agilize resistiu à captura (`_brand_capture2.json` › `agilize.sobre` e `agilize.faq` = `"link nao encontrado"`).
- Faltam, portanto: história/fundação/time (sobre), objeções tratadas e linguagem de FAQ (dúvidas de troca de contador, prazos, o que está incluso).
- A landing `/contabilidade-online/` **tem** uma seção "Perguntas Frequentes" no rodapé (visível no print) e um bloco "Está com dúvidas sobre a troca de contador?" — capturar num segundo passe se precisar do conteúdo do FAQ sem depender da rota `/faq`.

## Links
- [[agilize]] · [[marca|referências]] · [[conceito-marca]]
