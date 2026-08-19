---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilivre
gatilho: paginas-publicas
tags: [concorrente, marca]
---
# Páginas públicas — Contabilivre

> Fonte dura: prints `marca-img/planos.png`, `marca-img/sobre.png`, `marca-img/faq.png` + `_brand_capture2.json` › `contabilivre`. **Conferência dos prints (as labels dos arquivos enganam):**
> - `planos.png` = **`/planos/`** — página real de preços. ✅ é o que diz.
> - `sobre.png` = **`materiais.contabilivre.com.br/ebook-fator-r-do-simples-nacional`** — **NÃO é institucional. É landing de captura de e-book grátis (isca).** ⚠️
> - `faq.png` = **`/fale-com-a-gente/`** — **NÃO é FAQ. É a página de CONTATO** (form + telefones + reviews). ⚠️
> Tudo abaixo ancorado nesses dados; leitura/inferência marcada.

## 💰 Pricing (tiers R$209/359, o que incluem, transparência)

Dois planos **visíveis** na tabela, ambos "**A partir de**" (âncora de piso, não preço final) e ambos com "**Abertura Grátis***" (asterisco):

| | **Pro** — R$ 209,00/mês | **Enterprise** — R$ 359,00/mês (tag *"Melhor custo benefício"*) |
|---|---|---|
| Pró-labore | até **3** sócios ✓ | até **4** sócios ✓ |
| Folha de pagamento (até 2 func.) | ✗ | ✓ |
| Atendimento e-mail/telefone + WhatsApp | ✓ | ✓ |
| Emissor de NF ilimitado* (self-service) | ✓ | ✓ |
| Conta PJ gratuita | ✓ | ✓ |
| Certificado e-CNPJ A1 (agenda+instala) | ✓ | ✓ |
| Faturamento coberto | até **R$60 mil/mês** | até **R$150 mil/mês** |
| Open Finance | até 2 contas ✓ | até 3 contas ✓ |
| App iOS/Android | ✓ | ✓ |
| **NF emitidas pela equipe deles** (até 15/mês) | ✗ | ✓ |
| Levantamento de pendências (sob demanda) | ✗ | ✓ |
| Relatório de Desempenho Trimestral | ✗ | ✓ |
| **Reunião trimestral com contador responsável** | ✗ | ✓ |

**Leitura do gap Pro→Enterprise:** o R$209 é **software puro self-service**; toda a **camada humana + operação-por-eles** (contador te atende de fato, alguém emite tua NF, relatório, folha) só entra no R$359. O "contador responsável" está **paywall no topo**.

**Transparência — média/fraca:**
- **"A partir de"** + **simulador que exige form completo** (Estado, Cidade, Atividade, Nome, E-mail, Celular → *"Simular agora!"*) pra ver **o teu** preço. O número da vitrine não é o teu número.
- **Preços segmentados por toggle** (Abrir Empresa / Trocar de Contador / MEI · Empresa de **Serviço** / **Comércio**) — R$209/359 é de uma fatia; muda conforme atividade.
- **Terceiro tier escondido:** rodapé discreto *"Buscando por um plano mais acessível? Conheça nosso **Plano Basic** — Clique Aqui"*. O plano barato é **deliberadamente mantido fora da tabela** — clássico anchoring/decoy: mostra dois, esconde o barato pra você não ancorar embaixo.
- **Asteriscos por todo lado:** "Abertura Grátis*", "emissor ilimitado*", "15 notas*", "Informações Complementares*". Condições em letra miúda = ding de confiança.

## 📖 Marca / história (o "#livre"/movimento; e a "sobre" que é isca de e-book)

- **Device central = o "#" (hashtag).** Nome **Contáb**il + **livre** → "venha ser **#livre**" / "Por que nós te deixamos **#livre**". O `#` gigante em outline aparece no herói de `/planos` e de `/fale-com-a-gente`. Transforma o nome numa **tag social** e tenta virar **movimento/comunidade**: *"Nós criamos um jeito único de fazer contabilidade e queremos compartilhar essa **revolução** com você"*, *"já revolucionamos a vida de milhares de empresas, desburocratizando processos"*. É a melhor ideia da marca (ver `marca.md`).
- **Logo:** o "co" de Contabilivre é estilizado como um **toggle/interruptor verde** (pílula + bolinha) = "ligar o digital / ligar a liberdade" (inferência de leitura).
- **Paleta consistente entre páginas:** verde-limão `#57d300` (assinatura) + ciano `#13b5ea` (apoio "tech") + tint `#e7ffe7` + petróleo `#0b6156`. Coerente com o capture da landing.
- **Pilares verbais** (na `/planos`): *"Porque não tem burocracia"*, *"Porque somos apaixonados por contabilidade e tecnologia"*, *"Porque nós temos a melhor tecnologia"*, *"Por que nós te deixamos #livre"*.

**⚠️ A "sobre" NÃO existe como página institucional — é isca de conteúdo.** O print `sobre.png` é uma **landing de e-book grátis** (`materiais.contabilivre...`), headline *"**#E-book Grátis** — Fator R do Simples Nacional: Sua empresa pode pagar menos imposto!"*, com **form de captura** (Nome, Email, Estado, Cidade, WhatsApp, **captcha matemático "1+7=?"**, consent) → *"BAIXAR E-BOOK GRÁTIS"*. Copyright **2024** (página mais antiga, subdomínio de materiais). A "história institucional" real deles é só um parágrafo no **rodapé** ("Somos apaixonados por contabilidade, tecnologia e inovação..."), não uma página. **Jogada de marketing de conteúdo:** o Fator R é a dor **perfeita** pro ICP ME-serviço (Anexo III ~6% vs Anexo V ~15,5%) — usam a promessa "pague menos imposto" como **ímã de lead qualificado**, não como educação genuína. Note o **`#`** reaproveitado até no "**#**E-book" — consistência do device.

## 🔎 Achados não solicitados (OLHO CRÍTICO)

1. **Tudo é formulário — modelo "sales-assisted disfarçado de self-service".** Cada página captura: `/planos` = simulador-form; "sobre" = ebook-form; `/fale-com-a-gente` = contato-form; chat = "Iniciar conversa"-form; rodapé = newsletter-form. **Você não consegue ver preço e comprar** — precisa ser capturado antes. Isso denuncia que a venda ainda passa por humano/WhatsApp, apesar do discurso "digital".
2. **O contador humano é upsell, não base.** Combinando com o pricing: no R$209 **não há** reunião com contador, relatório nem alguém emitindo tua NF. Quem paga barato fica **sozinho com o app**. A relação humana — justamente o que ME-serviço mais quer — é a alavanca de R$359.
3. **Empresa de SP interior servindo nacional — sem pegada local.** Rodapé: **CNPJ 22.934.193/0001-90**, **CRC 2SP033617** (registro SP), telefones **DDD 14** (região de Bauru/interior-SP). Zero presença em BH/MG. Também: disclaimer *"empresa privada... não possui vínculo com órgãos governamentais"* (anti-confusão) e link **"File for LLMs"** no rodapé (têm arquivo AEO/llms para IA — jogada moderna de SEO). Prova social: **+150 avaliações Google, ~4 estrelas**, selos Sectigo + ReclameAQUI + badges App Store/Google Play.

## 🎯 Pro Legalizai Story Book

1. **Preço sem pedágio de lead.** O maior atrito deles é obrigar form pra ver preço. Legalizai Story Book ganha com **um número claro na tela em 30s** (calculadora sem captura obrigatória de contato). Honestidade "sem asterisco" é território livre — eles poluíram tudo de `*`.
2. **Coloque o contador humano NA BASE (ou um check-in humano periódico já no plano de entrada).** É o buraco declarado do R$209. ME-serviço não quer só software, quer não se sentir abandonado. Esse é o eixo de diferenciação de produto **e** de marca.
3. **Transforme a isca deles em ferramenta pública.** O e-book Fator R é gated e datado (2024). Legalizai Story Book pode ter um **simulador Fator R aberto e gratuito** (Anexo III vs V, quanto você economiza) → capta por **utilidade/SEO**, não por muro de form. Vira autoridade onde eles só coletam e-mail.
4. **Ângulo local BH como fosso.** Eles são genéricos/SP. Legalizai Story Book: onboarding BH-específico (Junta MG, ISS-BH, alvará PBH), número/atendimento regional. Presença local = confiança que firma nacional-online não replica barato.
5. **Table-stakes a igualar (não são diferenciais):** app iOS/Android, Conta PJ, Open Finance, emissor de NF, abertura grátis, selos SSL/ReclameAQUI, "File for LLMs"/AEO. Já é baseline do setor — entregar isso só te põe no jogo.
6. **Não brigue por "liberdade/verde".** Contabilivre já é dona de "**livre**" + verde-limão (device `#` forte). Território adjacente e mais forte pra Legalizai Story Book: **regularidade/estar em dia/tranquilidade** ("legalizado, sem medo") — ver aprendizado 5 do `marca.md`.

## ⏳ Ressalvas (páginas mislabeled)

- **`sobre.png` NÃO é institucional** → é **landing de e-book grátis** (isca de conteúdo, subdomínio `materiais.`, 2024). Não trate como "quem somos".
- **`faq.png` NÃO é FAQ** → é **`/fale-com-a-gente/` = CONTATO** (form Enviar Mensagem + WhatsApp Comercial + Atendimento + Ouvidoria + Financeiro + reviews Google). **Não há prova de FAQ público** neste conjunto de prints.
- **`planos.png` ✅ confere** com `/planos/`, mas os preços R$209/359 são "**A partir de**", segmentados por toggle, e o **preço real é gated no simulador** (+ existe **Plano Basic** oculto). Não cite R$209/359 como "o preço", e sim como piso de vitrine.
- Preços/tiers são de **2026-07-09**; "A partir de" ⇒ tratar como âncora, não valor firme.

## Links
- [[contabilivre]] · [[marca|referências]] · [[conceito-marca]]
