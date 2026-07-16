---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
gatilho: paginas-publicas
tags: [concorrente, marca]
---

# Contabilizei — teardown de páginas públicas

Análise de 4 páginas capturadas: `/como-funciona` (tabela de preços real), `/saude` (cross-sell de benefícios), `/contabilidade-online` (hub de blog/SEO) e landing principal. Prints em `contabilizei/marca-img/`. Dados em `_brand_capture2.json` → seção `contabilizei`.

Posicionamento-âncora do site inteiro, repetido em rodapé: **"O maior escritório de contabilidade do Brasil"** · **"DESDE 2013"** · tagline "Simplificando a vida de quem empreende no Brasil e potencializando histórias de sucesso." Paleta: azul-royal `#0033b7` + navy `#002868` + ciano-elétrico `#04f7f7` (accent) + cinza-ardósia `#5f748b` (texto). Marca corporativa, fria, confiável, "grande demais pra errar".

## 💰 Pricing

Preços **públicos e reais** (raro no setor — Facilite e outros escondem atrás de "fale com especialista"). Página `/como-funciona` traz a tabela com seletor **"Empresas de serviço | Empresas de comércio"** — e a aba default é *Empresas de serviço*, exatamente o ICP do Legalizei.

| Tier | Âncora (riscada) | Preço real | Posicionamento | Isca embutida |
|---|---|---|---|---|
| **Padrão** | ~~R$ 280~~ | **R$ 195/mês** | "Certificado digital básico incluso" | entrada |
| **Multibenefícios** ⭐ badge *"Melhor custo benefício"* | ~~R$ 320~~ | **R$ 225/mês** | "Pacote de benefícios exclusivos no plano" | cross-sell saúde/academia |
| **Experts Essencial** badge *"Atendimento dedicado"* | ~~R$ 515~~ | **R$ 395/mês** | "Assessor e analista dedicados" | humano = premium |

Todos os valores são **"a partir de"** — o preço final "é ajustado conforme o faturamento" e só aparece depois do cadastro/contato. Semi-transparência: a manchete é honesta, mas o número que você paga de fato fica na cortina.

**Táticas de preço identificadas:**
- **Âncora permanente riscada em TODOS os tiers** (280→195, 320→225, 515→395). O "de R$X" quase certamente nunca é cobrado — é dispositivo psicológico pra fazer 195 parecer oferta. Desconto que nunca termina = não é desconto, é preço.
- **Charm pricing logo abaixo de barreiras redondas**: 195 (< 200), 395 (< 400). Ancoragem cognitiva clássica.
- **Decoy no meio, não no barato**: o tier destacado (badge + borda azul) é o do MEIO (R$225), não o mais barato — e é justamente o que abre a porta do cross-sell (Multibenefícios). A arquitetura empurra você pro plano que monetiza depois.
- **Humano dedicado como upsell premium** (só no Experts R$395). "Assessor e analista dedicados" é vendido como luxo, não como padrão.
- **Taxas de abertura reposicionadas como "grátis" via comparação**: a landing tem tabela "Média de mercado × Contabilizei" — Certificado digital R$100-200 → **ZERO**, Consultoria/documentação R$100-400 → **ZERO**, Taxas do governo R$70-500 → **ZERO**. Manchete hero: **"Economize até R$ 4 mil por ano"**. Enquadram o custo do concorrente genérico ("média de mercado") pra fazer o próprio parecer de graça — o preço da mensalidade recorrente some do enquadramento.

## 📖 Marca / história

- **Humanização por rosto + CRC**: toda pessoa mostrada tem nome + número de registro CRC no crachá (Charles Gularte CRC PR-045113/O-7, Daniela Coragem, Caio Louzada etc.). Combo poderoso: humaniza E prova legitimidade regulatória ("contadores de verdade", "o maior time de contadores certificados do Brasil"). Repetem CRC no rodapé também.
- **Tom**: institucional, seguro, adulto. Vende *escala como confiança* ("o maior", "+10 anos", "100 mil clientes" — tem até artigo de blog "100 mil clientes: um marco feito de vocação"). Não é caloroso, é sólido.
- **Sinais de confiança empilhados**: DESDE 2013 no logo do rodapé, registro no CRC, nota **4,7** com reviews do Google, depoimentos nomeados, logos de parceiros premium na página de saúde (Alice, Sami, Amil, SulAmérica, Bradesco Saúde, Unimed) — pega emprestado o brilho das grandes operadoras.
- **Promessa de serviço concreta** (não vaga): "Atendimento via telefone, chat e e-mail até às 18h e **WhatsApp até às 22h**". Especificidade = credibilidade; a maioria dos concorrentes diz só "suporte rápido".

## ❓ FAQ / como funciona (linguagem)

O maior aprendizado de linguagem está aqui. As perguntas do FAQ são escritas na **voz do medo do cliente iniciante**, não em jargão contábil:

- "A Contabilizei tem contadores **de verdade**?"
- "A Contabilizei **é confiável**?"
- "Preciso **sair de casa** para abrir minha empresa?"
- "Quanto em média custa um contador?" · "O que está incluso na mensalidade?"

Antecipam ceticismo ("isso é real? são contadores reais?") e fricção física ("tenho que me deslocar?"). Explicam o "como funciona" em **3 passos numerados em linguagem de leigo** — (1) Orientamos você nas escolhas [CNAE, tipo de empresa, taxas]; (2) Realizamos a abertura; (3) Cuidamos da contabilidade mês a mês. Traduzem jargão (CNAE, certificado digital, Fator R) sem assumir que você sabe. Este é o modelo direto pra "linguagem humana" do Legalizei.

## 🔎 Achados não solicitados (OLHO CRÍTICO)

**1. O "grátis" é o cavalo de Troia do modelo de negócio — não é generosidade, é CAC.**
"Abrir empresa grátis" está em TODO lugar. Eles dão de graça a abertura (serviço pontual, alta fricção, margem ruim) pra capturar a **assinatura mensal recorrente** (o motor de LTV). A abertura é lead-magnet/loss-leader. Toda a GTM gira nisso. Decisão obrigatória pro Legalizei: igualar o wedge do "abre grátis" ou diferenciar por outro eixo — porque contra o líder você não ganha o mesmo jogo pelo mesmo preço.

**2. A contabilidade é só a praia de desembarque — o negócio real é virar o "SO financeiro" do PJ pequeno (e a margem está na corretagem, não nos R$195).**
A página `/saude` revela que a Contabilizei virou marketplace: plano de saúde PJ, academias (tipo Gympass), psicologia/nutrição, Banco PJ, cobrança de clientes, certificado digital, emissor NF. A contabilidade é a porta; o dinheiro grande está na **comissão de corretagem de plano de saúde** (margem de corretor é gorda) e no bundle de benefícios. Por isso o tier destacado é o "Multibenefícios". Eles não competem por preço de mensalidade — subsidiam a mensalidade pra vender o resto. **Implicação estratégica:** brigar em R$/mês com a Contabilizei é brigar no terreno onde eles ganham dinheiro noutro lugar. O Legalizei precisa de tese própria de monetização OU aceitar competir num nicho onde escala de marketplace não importa (hiper-local, consultivo).

**3. Eles JÁ dominam o SEO do seu ICP exato — inclusive BH por nome.**
A página `/contabilidade-online` não é "sobre nós": é um **hub de blog gigante** com centenas de artigos de cauda longa + calculadoras (PJ×CLT, Fator R, custo de abrir CNPJ, RPA, Reforma Tributária). E tem artigo dedicado **"Como abrir empresa em BH: tudo que você precisa saber"**, além de BH aparecer nas "cidades com condições especiais de abertura" e na lista de Minas Gerais. Ou seja: pra "abrir empresa BH" / "contador BH", a Contabilizei provavelmente já rankeia forte. **Isso é fosso.** O Legalizei não vence por SEO genérico de cauda curta contra um gigante com 10 anos de domínio — precisa de ângulo (geo-hiperlocal + conteúdo que a máquina nacional não faz: prefeitura de BH, Junta MG, alíquota ISS BH por CNAE, casos reais locais). As calculadoras deles também são captura de lead disfarçada de ferramenta grátis — padrão a copiar.

**Bônus — fraqueza explorável:** "O maior" é escala, não intimidade. Apesar de mirar BH no SEO, não há rosto/presença local; o onboarding joga todo mundo no self-serve (escolha o plano → cadastro). Marca fria, nacional, impessoal. Sobra flanco pra um **BH-nativo, humano, que te chama pelo nome e faz onboarding consultivo** — transformando o "assessor dedicado" que eles cobram R$395 (premium) no *padrão* do Legalizei.

## 🎯 Pro Legalizei

- **Não brigue no wedge "abre grátis" pelo mesmo preço.** É a arma de aquisição do líder e ela é subsidiada por corretagem que você não tem. Escolha outro eixo: humano-por-padrão + local.
- **Espelhe a honestidade de preço, mate o "a partir de".** A transparência (mostrar número) é força relativa da Contabilizei — mas o "ajustado conforme faturamento" ainda esconde. Legalizei pode ganhar prometendo **preço fechado, sem surpresa** ("o valor da tela é o valor da fatura").
- **Vire o premium deles em table stakes.** "Assessor e analista dedicados" é o tier de R$395. Faça do contato humano nomeado o baseline da marca — é o contraste mais nítido contra o gigante impessoal.
- **Roube o padrão de FAQ na voz do medo.** Escreva o site inteiro respondendo "é confiável? são contadores de verdade? preciso me deslocar?" — não em contabilês.
- **Ataque o SEO por geo-hiperlocal, não por cauda curta.** Conteúdo que a máquina nacional não produz: ISS por CNAE em BH, passo a passo Junta Comercial MG, alvará da prefeitura de BH. Copie o formato "calculadora grátis = captura de lead".
- **Cuidado com o crachá CRC.** É prova de legitimidade barata e eficaz — o Legalizei precisa exibir registro CRC + rostos reais desde o dia 1, ou parece amador ao lado deles.

## Links
- [[contabilizei]] · [[marca|referências]] · [[conceito-marca]]
