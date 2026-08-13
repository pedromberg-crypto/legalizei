---
tipo: derivado
status: vivo
data: 2026-08-12
assunto: estrategia-marketing
deriva_de: [mercado-bh-regional, insights-estrategicos, matriz-comparativa, posicionamento, metodologia-personas, estrategia-organica, mecanicas-engajamento, economia-preco-cac, funil-conversao, estrutura-funil-trafego, validacao-ideia]
tags: [marketing, estrategia, validacao, reuniao]
---

# 🧭 Estratégia de marketing — leitura completa pra validação

> **Pra quê:** sentar com o **Pedro Puntel** (gestor de tráfego) e passar ponto a ponto pela estratégia de marketing **inteira**, não só a parte de mídia paga. Ele entra como par de validação estratégica: cada bloco termina numa pergunta de validação, e a saída esperada é confirmar, ajustar ou derrubar o que está escrito.
>
> **O que este doc NÃO é:** não é briefing de campanha, não é pedido de proposta de mídia. É o retrato do que já está travado no vault, reordenado em linha lógica pra debate.
>
> **Regra que vale aqui:** todo número tem fonte e grau de confiança. 🟢 travado · 🟡 estimativa/placeholder · 🔴 pendente ou frágil. Número sem fonte não entra.

**Ordem dos 12 blocos:** mercado → concorrência → posicionamento → tom de voz → personas → mensagens → conteúdo → economia → funil → canais → métricas → riscos.

---

## 1. Mercado & oportunidade

### O tamanho da coisa

| Dado | Valor | Fonte | Conf. |
|---|---:|---|---|
| ME/EPP no Simples pagantes (Brasil) | ~7,4 milhões | Receita Federal, dez/2024 | 🟢 |
| Penetração do líder (Contabilizei) | ~50 mil (~0,7%) | [[PESQUISA-MERCADO]] §A/I | 🟢 |
| Aberturas de empresa por mês (Brasil) | ~417 mil | REDESIM | 🟢 |
| Empresas ativas em BH (oficial) | 388.073 (18% de MG) | REDESIM/Prefeitura BH, jan/2023 | 🟢 datado |
| Empresas ativas em BH (bases comerciais) | ~460-545 mil | Econodata/EmpresAqui/cnpj.biz, 2026 | 🟡 metodologias variam |
| MEI em BH | ~260 mil | Prefeitura BH/SEBRAE | 🟡 |
| **Recorte ICP em BH** (ME serviço Simples, não-MEI) | **~100-175 mil** | estimativa [[mercado-bh-regional]] | 🟡 |
| Tempo de abertura em BH | 11h (vs 22h Brasil, 14h SP) | REDESIM/Prefeitura BH | 🟢 |
| Posição de BH em aberturas | 3ª capital do país | REDESIM | 🟢 |

### A leitura

1. **Penetração de 0,7% do líder = mercado aberto, não saturado.** Mesmo com ~R$1 bilhão de capital de risco por trás (SoftBank R$320mi em 2021 + Warburg Pincus ~R$700mi em 2024), a Contabilizei não fechou o mercado. Isso não é mercado maduro em consolidação; é mercado ainda por ser servido.
2. **Regionalizar não encolhe a oportunidade.** A meta do MVP é 25-30 clientes fundadores em 3 meses. BH sozinha tem ~100-175 mil empresas no ICP. **0,1% do ICP de BH já é 100-175 clientes** — múltiplo da meta.
3. **BH valida por dois lados ao mesmo tempo:** tamanho (centenas de milhares no perfil) E facilidade operacional (abertura em 11h, a mais rápida do país). Não é "começar pequeno" — é começar no lugar mais fácil e grande o bastante.
4. **As atividades-top de BH são exatamente o nosso perfil:** salão/beleza, varejo vestuário, apoio administrativo, treinamento. Não estamos forçando um ICP contra a realidade da cidade.

### Ressalva honesta

O recorte de ~100-175 mil é **estimativa por faixa**, não número cravado. O dado preciso sairia de puxar a base aberta da Receita (CNPJ) filtrando município=BH + CNAE do perfil + Simples + porte ME. Está mapeado como pendência técnica, não foi feito ainda.

> **❓ Pergunta de validação**
> A leitura "mercado aberto, não saturado" se sustenta na experiência dele? Ou estamos otimistas demais ao tratar 0,7% de penetração como espaço livre em vez de sinal de que o produto é difícil de vender?

---

## 2. Concorrência — o que o mercado erra

Mapeamos 6 concorrentes diretos + indiretos + aspiracionais, com captura de páginas públicas (Playwright, 2026-07-09) e teardown da plataforma logada do líder (Pedro é cliente).

### Quem está no jogo

| Player | Origem | Tipo | Preço entrada | Diferencial de modelo |
|---|---|---|---:|---|
| **Legalizai** | BH/MG (Legalize Digital, 22 anos) | — | R$139 ME · R$49,90 MEI | preço fechado + humano na entrada + hiperlocal BH |
| Contabilizei | Nacional (SP, 2013) | Direto | R$139-195 (escala por faturamento) | maior escala, SEO dominante, margem real em corretagem |
| Agilize | Nacional | Direto | R$259 (fixo, 20% off permanente) | único preço fixo (por volume, não faturamento) |
| Contaja | MG (CRC MG) | Direto | R$137 Simples · R$49,90 MEI | piso de preço do setor, à la carte agressivo |
| Facilite | Nacional + Estônia | Direto | R$199,90 | wedge nicho Airbnb/temporada, venda consultiva |
| Contabilivre | SP-interior | Direto | R$209 (gated) | device de marca "#livre", tudo formulário |
| Marvee | SC (Blumenau) | Indireto | sob consulta (ticket alto) | BPO financeiro, escala por franquia |
| **Planilha/caderno/contador tradicional** | — | **Indireto** | R$0 direto, custo oculto | **o concorrente real** ([[PESQUISA-MERCADO]] §K) |
| ContaAzul / Nubank | Nacional | Aspiracional | — | referência de craft/UX, não disputa o mesmo orçamento |

### Os 5 erros estruturais que o mercado comete

**1. Humano é upsell em 100% dos concorrentes diretos.**
Contador/gerente nomeado só aparece no tier caro: Contabilizei R$395, Agilize R$450, Contabilivre R$359, Facilite Black R$1.249,90. E a pergunta mais repetida nos FAQs deles é literalmente *"vocês têm contador DE VERDADE?"* — a ferida de confiança nº1 da categoria, que eles próprios criaram e depois cobram pra curar.

**2. Transparência de preço é sempre semi.**
"A partir de", ajuste pós-contato, formulário gated (Facilite, Contabilivre), asterisco de regime até na Agilize (o único com número fixo, mas só dentro do Simples). **Nenhum dos 5 crava o número final na tela.**

**3. Custo de saída é escondido por todos.**
Contaja: baixa R$1.359, migração MEI→ME R$1.399 — enterrado no FAQ. Nenhum precifica saída na vitrine. Barato pra entrar, caro pra sair.

**4. "Grátis" é CAC disfarçado, não generosidade.**
Abertura grátis em quase todos = isca de recorrência. A Contabilizei vai além: subsidia mensalidade pra vender corretagem (saúde PJ, banco, benefícios). **A margem real dela não está no R$/mês** — o que significa que ela pode queimar preço num terreno onde nós não podemos segui-la.

**5. Craft quebrado é epidêmico.**
Facilite exibindo "0+ Clientes · 0+ NPS", Agilize com "+0 anos" (JS que não disparou), Contaja com cookie banner tapando a tabela de preço e seção "na mídia" vazia, Contabilivre em azul-Bootstrap genérico. Numa categoria que lida com dinheiro, isso vaza credibilidade.

### O que isso vira em ação

Craft impecável é diferenciação quase de graça — ninguém investe nisso hoje. E não brigar em R$/mês onde o líder ganha em outro lugar: ganhar em confiança e experiência, não em corrida de fundo de preço.

> **❓ Pergunta de validação**
> Esses 5 são de fato fraquezas exploráveis, ou algum deles é assim porque o mercado já testou e o caminho contrário não funciona? (Ex.: se humano na entrada fosse viável no ticket baixo, alguém já teria feito?)

---

## 3. Posicionamento

### Statement

> **Para o autônomo que virou PJ prestador de serviço** (marketing, TI, consultoria, beleza, saúde) **e vive com medo de errar e pagar imposto a mais**, a Legalizai é a **contabilidade digital que fala a sua língua e cuida do chato pra você** — ao contrário do escritório tradicional (lento, formal, distante) e do app frio dos concorrentes digitais (sem humano no plano de entrada, preço com asterisco), a Legalizai tem **contador de verdade desde o primeiro plano e preço fechado, sem surpresa.**

### Categoria mental

**NÃO é:**
- ❌ Escritório de contabilidade tradicional (formal, lento, contabilês)
- ❌ App de contabilidade frio/autoridade distante — a categoria que a Contabilizei ocupa, vitrine de cross-sell em vez de foco no job do cliente

**É:**
- ✅ **Contabilidade digital humana.** Tecnologia é o meio (agilidade, preço, clareza); o humano por trás (contador CRC real) é o fim que resolve a ansiedade nº1 da categoria: *"isso aqui tem gente de verdade?"*

### Os 5 diferenciais cravados

| # | Diferencial | Por que ninguém tem |
|---|---|---|
| 1 | **Preço fechado, sem asterisco** | nenhum dos 5 diretos crava número final na tela; o valor da tela é o valor da fatura |
| 2 | **Humano no plano de ENTRADA, não upsell** | nos 5, contador nomeado só no tier R$359-700+ |
| 3 | **Hiperlocal BH/MG operacional** | Contaja é mineira, mas ninguém trata ISS-BH, alvará PBH e Junta MG como parte do produto; 22 anos de operação local é vantagem que digital-native nacional não replica rápido |
| 4 | **Mobile-first de verdade** | "mobile-first" é discurso em todo o setor, quebrado na prática |
| 5 | **Custo de saída declarado** | ninguém precifica baixa/migração na vitrine; declarar de cara é fosso de confiança que ninguém abriu |

### O claim de marketing

**"A única contabilidade 100% digital de verdade"** — travado 13/07, guerrilha comparativa direta (usa as cores dos rivais, nunca nome/logo).

⚠️ **Ressalva de honestidade interna:** é claim de posicionamento, não descrição operacional. Internamente, ~15-20% dos casos ainda exige intervenção humana. O diferencial real não é "zero humano" — é ser sincero desde a entrada e ter humano quando precisa, ao contrário de quem esconde isso atrás de tier caro.

### Elevator pitch (30s, texto oficial travado 13/07)

> "Contabilidade digital pra quem vive de prestar serviço. Você cuida do negócio pelo celular, a gente cuida da papelada, nativo digital, apoiado por um escritório com mais de 20 anos em BH/MG."

> **❓ Pergunta de validação**
> O posicionamento está afiado ou soa genérico? Alguém de fora entende em 10 segundos por que somos diferentes, ou os 5 diferenciais só fazem sentido pra quem já conhece o setor por dentro?

---

## 4. Arquétipo & tom de voz

### O arquétipo

- **Aliado leve/vitorioso** (dominante) — o cliente é o herói, a marca é o aliado humano que carrega o chato. Responde direto à ferida *"tem contador de verdade?"* e ocupa a ponta quente-humana que está **vazia** no espectro de tom do setor.
- **Parceiro de confiança** (secundário) — fala de igual pra igual, nunca de cima.
- **NÃO é o Sábio distante** — contabilês, autoridade fria. É exatamente o espaço que a Contabilizei ocupa.

### Os traços que sustentam

| Traço | Como se manifesta |
|---|---|
| **Humano** | fala como gente, não como órgão público |
| **Transparente** | mostra custo e prazo na cara, sem surpresa |
| **Proativo** | avisa antes, resolve antes, não empurra o problema pro cliente |
| **Descomplicado** | traduz o contabilês; 1 toque em vez de 6 cliques |
| **Confiável** | segurança séria por trás da leveza — leve na cara, sólido no motor |

### Como fala / como não fala

**Fala:** "Sua empresa está em dia ✅" · "Falta só isso, vence dia 15" · "Legalizei! 🎉"
**Não fala:** "Prezado contribuinte" · "DARF Unificado disponível" · "obrigação acessória pendente"

**Regra de ouro:** todo termo técnico vem **traduzido OU escondido**. O cliente nunca precisa saber o que é NBS pra emitir a nota. Isso está operacionalizado, não é intenção: existe um [[glossario-tecnico-humano]] com ~40 termos mapeados (CNAE, DAS, Fator R, Anexo III, pró-labore, JUCEMG...) cada um com "o que é" + "como o produto fala" + "onde aparece".

**Exemplos reais do glossário:**

| Termo cru | Como a marca fala |
|---|---|
| Fator R | "o número que decide se você paga menos imposto" |
| DAS | "sua guia do mês" |
| Anexo III | "a tabela mais barata pra prestador de serviço" |
| Pró-labore | "o que você tira pra você todo mês" |
| JUCEMG | "a Junta" (nunca a sigla sozinha) |
| Situação cadastral | "se sua empresa está ativa hoje" |

### Registro muda por persona, arquétipo nunca muda

Mesma doutrina do produto: **densidade muda a apresentação, jamais a obrigação.** Nenhuma persona recebe um arquétipo diferente — todas ouvem o mesmo Aliado, em volume diferente:

| Persona | Registro |
|---|---|
| **A — Direto** | eficiente, sem enrolação — o aliado que anda rápido porque sabe que ela já sabe o que faz |
| **B — Construindo** | parceria/crescimento — o aliado que comemora ela crescer, não trata como upsell |
| **C — Mão na mão** | paciência reforçada — o mesmo aliado, dose mais alta de "eu fico do seu lado" |

### As regras duras (não negociáveis)

- ❌ **Nunca usar travessão** (`—`) em copy pública. Vale pra tudo: LinkedIn, IG, LP, wizard, deck, bio.
- ❌ **Nunca citar concorrente por nome.** A guerrilha usa cor e silhueta, não logo.
- ❌ **Nunca vender tecnologia em vez do resultado.** É o erro que a Facilite comete (narrativa "TouchTech/IA" com 1 dev no time real). Temos PM+dev de verdade, mas a comunicação é sobre o job resolvido, não sobre stack.
- ❌ **Nunca número sem fonte.** Já corrigimos isso internamente uma vez ("1 milhão de assinantes da Contabilizei" era falso; real ~50 mil).
- ❌ **Nunca contabilês sem tradução.**

### Regra de checagem operacional

Copy nova responde: *"isso soa Sábio distante (contabilês, autoridade fria) ou Aliado (resolve, cuida, fala de igual pra igual)?"* antes de publicar. Se soar Sábio distante, reescreve.

> **❓ Pergunta de validação**
> O tom é distintivo de verdade, ou é o mesmo "amigável e próximo" que todo mundo do setor diz ter? O que falta pra ter voz própria reconhecível sem o logo do lado?

---

## 5. Personas — 3 dorsais

### Como o sistema funciona

Aqui **comprador = usuário sempre** (o dono do CNPJ que assina é quem usa o app todo dia), diferente do modelo genérico que separa "quem paga" de "quem recebe".

Duas camadas vivas: **dorsais** (personas canônicas, permanentes, mudam só por decisão registrada) e **volantes** (recortes ocasionais de campanha, temporários — 9 já mapeadas, todas 🟡 hipótese).

### As 3 dorsais

#### 🅰️ Persona A — "Direto" · 32-42 anos · o freelancer que virou PJ
> *"Já sei o que eu faço, só preciso que a burocracia não me atrase."*

| | |
|---|---|
| **Perfil** | dev, consultor, designer — serviço intelectual, alta familiaridade digital |
| **Idade** | 32-42 (bracket dominante nacional 30-39 = 29,9%, IBGE) 🟢 |
| **Canal** | Google Search alta intenção + indicação de outros freelancers 🟡 |
| **Oferta** | ME (atividade intelectual costuma ser vedada ao MEI) 🟢 |
| **Volume-hipótese** | 35-40% 🔴 (validar no V0) |
| **Objeção principal** | *"Contabilidade online não vai entender minha operação"* |
| **Contorno** | mostrar profundidade fiscal real (Fator R, Anexo certo) na cara, nunca esconder atrás de "fale com um especialista" |
| **Gatilho-momento** | virar PJ pela 1ª vez, ou contador atual não entende dinâmica de freelancer digital |
| **LTV-hipótese** | alta — atrito de troca é psicológico; forte propensão a indicar em comunidades de dev/freela |

#### 🅱️ Persona B — "Construindo" · 35-50 anos · a profissional de serviço que cresceu do MEI
> *"Cresci demais pro MEI, mas não quero perder o jeito pessoal que sempre tive com meus clientes."*

| | |
|---|---|
| **Perfil** | cabeleireira, esteticista, personal, nutricionista — serviço estético/manual |
| **Idade** | 35-50 (brackets 40-49 = 25,5% + parte do 50+) 🟢 |
| **Canal** | **Instagram — 83% de presença no setor beleza**, o maior de qualquer nicho mapeado 🟢 |
| **Oferta** | MEI→ME na transição por desenquadramento (teto R$81k/ano) 🟢 |
| **Volume-hipótese** | 30-35% — beleza sozinha é 9% de todos os MEIs do Brasil (~1,3mi) 🟡 |
| **Objeção principal** | *"Vou virar só mais um número, vou perder o atendimento pessoal"* |
| **Contorno** | humano no plano de entrada é resposta direta, não upsell |
| **Gatilho-momento** | proximidade do teto MEI (~R$6.750/mês) — sinal de intenção de alto valor |
| **Criativo** | imagem humana real, evitar stock corporativo; acolhedor sem infantilizar |

#### 🅲 Persona C — "Precisa de mão na mão" · 50+ anos · quem não cresceu com celular
> *"Não confio em fazer isso sozinha no aplicativo. Se travar, quero saber que tem alguém do outro lado."*

| | |
|---|---|
| **Perfil** | professor autônomo, artesão, serviço tradicional formalizando — baixa familiaridade digital |
| **Idade** | 50+ (24,5% dos MEIs nacionais — 4º maior bracket, **nada marginal**) 🟢 |
| **Canal** | WhatsApp pessoal + indicação familiar; baixa presença em redes 🟡 |
| **Volume-hipótese** | 20-25% 🟡 |
| **Objeção principal** | *"Vou travar sozinha e não vou ter quem me ajude"* |
| **Contorno** | modo assistido + humano de verdade acessível (não chatbot) |
| **Gatilho-momento** | pressão externa (cliente pede nota fiscal) mais do que ambição de crescer |
| **Exclusão de linguagem** | zero "startup"/"disrupção" — são imigrantes digitais, não nativos |
| **LTV-hipótese** | potencialmente altíssima (baixíssimo churn) mas exige onboarding assistido |

### Matriz mestre — ocasião × persona × oferta × mensagem

| Ocasião/contexto | Persona | Oferta | Mensagem-âncora | Canal |
|---|---|---|---|---|
| Virando PJ pela 1ª vez | A | ME | "Resolve rápido, sem enrolação, sem pagar imposto a mais" | Google Search |
| Batendo no teto do MEI | B | ME (transição) | "Cresça sem perder o atendimento pessoal" | Instagram + indicação |
| Formalizando por exigência externa, insegura com tecnologia | C | MEI/ME simples | "A gente explica cada passo, sem pressa" | WhatsApp/indicação |
| Já tem CNPJ, contador atual falhou | A, B ou C | ME (flow migrar) | "Troque sem dor de cabeça, sem perder nada" | indicação + Search |

**Nota:** o "migrante insatisfeito" **não virou dorsal própria** — é contexto/ocasião que cruza as 3, não um segmento demográfico à parte.

### Quem NÃO é público (anti-persona)

- Empresas fora do nicho serviço/Simples (indústria, comércio pesado, Lucro Real)
- Lucro Presumido — bloqueado no fluxo, motor fiscal diferente, sem pesquisa dedicada
- Comprador só-preço sem fit de valor — quem quer o Contaja de R$137 com à la carte, não o "preço fechado"

### Lacuna assumida

Nenhuma dorsal cobre o **MEI puro que nunca vai virar ME** (baixo ticket, alto volume). Já flagrado como a oferta mais frágil na economia. Decisão de tratá-lo como volante ou 4ª dorsal está adiada até o V0 trazer volume real.

> **❓ Pergunta de validação**
> As 3 dorsais cobrem o mercado real ou tem gente óbvia de fora? Alguma delas está inflada — existe no papel mas não aparece na rua na proporção que estimamos?

---

## 6. Mensagens-âncora & promessa

### O JTBD consolidado (hipótese a validar)

> *"Quando estou com medo de errar com o fisco e pagar imposto a mais, quero uma contabilidade que fale a minha língua e resolva o chato sem eu precisar entender de contabilidade, pra eu poder tocar meu negócio em paz."*

### A promessa central

**"A gente carrega o chato; ele toca o sonho."** O cliente não quer *entender contabilidade* — quer estar em dia, sem medo de multa, sem perder tempo.

### As mensagens por ângulo de diferencial

| Ângulo | Hook | Ancorado em |
|---|---|---|
| Preço fechado | "Sem 'a partir de'. O preço que você vê é o que você paga." | nenhum concorrente crava preço final |
| Humano na entrada | "Contador de verdade desde o primeiro plano, não só quando você paga mais." | ferida de confiança nº1 do setor |
| Hiperlocal BH | "A gente sabe o que é ISS de BH sem você ter que explicar." | 22 anos de operação local |
| Garantia | "7 dias pra mudar de ideia. Dinheiro de volta, sem letra miúda." | CDC art.49, já é contratual |
| Crescimento (B) | "Cresça sem perder o atendimento pessoal." | objeção "virar só mais um número" |
| Urgência (A) | "CNPJ pronto rápido, sem perder o contrato." | volante dev-freelancer com contrato na mão |

### Frases-gatilho por contexto de produto

| Contexto | Gatilho |
|---|---|
| Empresa em dia | "Sua empresa está em dia ✅" |
| Vencimento próximo | "Falta só isso, vence dia 15" |
| Conquista/marco | "Legalizei! 🎉" |

### O que a marca se recusa a prometer

- ❌ Não promete "zero humano" (seria mentira — 15-20% dos casos exige intervenção)
- ❌ Não simula escassez sem prazo real ("se não há prazo real, não simular escassez")
- ❌ Não promete volume de conteúdo que a produção não sustenta ("começar honesto, subir depois")
- ❌ Não esconde custo de saída, taxa de governo ou fidelidade

### Taglines em disputa (não travadas)

- "Sua empresa em dia, sem dor de cabeça."
- "A burocracia é com a gente."
- "Legalizei — e pronto."
- "Contabilidade que fala a sua língua."

> **❓ Pergunta de validação**
> Cada mensagem resolve dor de verdade ou tem benefício genérico no meio? Alguma promete o que a operação ainda não entrega com segurança?

---

## 7. Pilares de conteúdo & orgânico

### A tese

Orgânico roda **em paralelo** ao tráfego pago, nunca esperando ele — os dois se alimentam. Perfil frio raramente ganha alcance sozinho.

**Canal primário: Instagram**, escolhido por dado, não achismo — 64% de presença no público-alvo geral, **83% no setor beleza** (Persona B). LinkedIn fica em 6% de adoção: secundário, só vale pra Persona A se sobrar recurso.

### Os 2 ativos diferenciais que ninguém tem

1. **Simulador de Fator R aberto e grátis.** A engine já está pronta e testada. Nenhum concorrente oferece isso aberto — o mais perto (Contabilivre) esconde atrás de e-book gated. Vira motor de conteúdo educativo real, não genérico.
2. **Fundador construindo em público.** Pedro é PM+dev, não agência terceirizada. Já previsto no checklist de imersão (6-9 posts fundadores).

### Divisão da pauta

| Bloco | % pauta | Função | Tom |
|---|---:|---|---|
| **Afeto/Marca** | 40% | conexão, topo de funil | leve, humano, relatable |
| **Diferencial/Prova/Oferta** | 40% | quebra objeção + prova + venda | direto, dado na cara |
| **Comunidade/UGC** | 20% | participação, prova social nascente | acolhedor |

> Produto novo, sem base de clientes ainda → mais peso em prova/diferencial do que uma marca madura levaria.

### Os 9 pilares

| # | Pilar | Bloco | Funil |
|---|---|---|---|
| 1 | Bastidor fundador ("building in public") | Afeto | topo |
| 2 | Dor educativa relatable ("aquele susto com o DAS") | Afeto | topo, salvável |
| 3 | Cultural/relatable (piada leve sobre burocracia) | Afeto | topo, share |
| 4 | Diferencial vs mercado (4 ângulos rotativos) | Diferencial | meio |
| 5 | Oferta/conversão (sempre com garantia visível) | Diferencial | fundo |
| 6 | Prova/reação (founder-made até ter depoimento real) | Diferencial | fundo |
| 7 | Bastidor/processo (mostrar o contador CRC real) | Diferencial | meio |
| 8 | Simulador Fator R aberto | Comunidade | topo/meio |
| 9 | Participativo (caixinha de perguntas) | Comunidade | meio |

### A mecânica-âncora: "Pergunta que ninguém explica"

Caixinha semanal no Stories pedindo a dúvida de contabilidade mais constrangedora que a pessoa tem. Curadoria vira post educativo ("Traduzindo o contabilês"), sempre anonimizado.

```
Stories: "qual sua dúvida que você tem vergonha de perguntar pro contador?"
   ↓ público responde → [1] banco de matéria-prima REAL (não inventada)
   ↓ curadoria das 3-5 melhores → vira carrossel/vídeo
   ↓ "marca quem também tem essa dúvida" → [2] alcance emprestado + [3] prova de utilidade
   ↓ quem perguntou vira lead quente → [4] DM com o simulador Fator R
```

**Ouro escondido:** quem perguntou e não foi respondido publicamente continua com a dúvida — vira lista de lead quente pra DM direta. Captura de lead disfarçada de utilidade genuína.

### Escada de CTA (não fecha todo post vendendo)

| Estágio do post | CTA canônico |
|---|---|
| Topo emocional puro | nenhum funil, só engajamento |
| Topo/meio | "simule seu Fator R grátis" |
| Prova | "veja como funciona, sem compromisso" |
| Meio→fundo | "assine sem fidelidade-surpresa" |
| Fundo (só sazonal/promo) | "garantia de 7 dias, comece agora" |

### Gatilhos emocionais (70% evergreen · 30% sazonal)

**Evergreen:** medo de errar com o fisco · alívio da conquista ("Legalizei!") · vergonha de não entender contabilês · urgência de prazo bloqueado · orgulho de virar PJ.
**Sazonais:** DASN-SIMEI (maio) · IRPF (mar-mai) · virada de ano · Dia do Empreendedor · votação do PLP 108/2021 (reativo).

### Cadência e produção — o gargalo declarado

**3 posts/semana** (2 estáticos/carrossel semi-automatizados + 1 vídeo curto manual), stories quando houver algo real. **Não força diário.**

⚠️ **Gargalo real: edição de vídeo.** Pedro cobre PM+dev+growth; produção é júnior. A cadência foi desenhada pra não saturar isso — "começar honesto, subir depois", não prometer volume que quebra.

### Regras travadas

- Cap de 20% da pauta vendendo fora de janela de promoção
- Garantia 7 dias em todo post de venda (é contratual, não promessa de marketing)
- Tom agressivo no **argumento** (dado contra a opacidade do setor), emocional na **embalagem**
- Promo sem prazo falso

> **❓ Pergunta de validação**
> A divisão 40/40/20 faz sentido pra marca nova sem base de clientes, ou estamos pesados demais no bloco de prova que ainda não temos matéria-prima pra sustentar?

---

## 8. Economia — preço, CAC, LTV

> ⚠️ **Doc parcial por decisão consciente.** O honorário contábil real (maior custo variável do negócio) está **fora do cálculo** — depende de dado do Mauro. Toda margem aqui é **teto inflado**, não número final.

### Preço travado

| Oferta | Preço | Histórico | Conf. |
|---|---:|---|---|
| **ME** | **R$139,00/mês** | revisado de R$195 → R$139 em 05/08 | 🟢 travado |
| **MEI** | R$49,90/mês | placeholder desde 16/07, não revisado | 🟡 |

**Leitura de posicionamento de preço:** o ME caiu 28,7% e saiu da faixa Contabilizei (R$195) pra chegar perto da Contaja (R$137, entrada mais barata do mercado). Reposiciona a régua **mais perto do challenger barato do que do líder.**

### Custo e margem (parcial)

| | ME (R$139) | MEI (R$49,90) |
|---|---:|---:|
| Receita bruta | R$139,00 | R$49,90 |
| (−) Custo técnico conhecido (API R$10 + sistemas R$5) | R$15,00 | R$15,00 |
| **= Sobra técnica** | **R$124,00** | **R$34,90** |
| % sobre receita | 89,2% | 69,9% |

🔴 **Ainda fora da conta:** honorário contábil (Mauro), taxa de transação Asaas, imposto sobre faturamento próprio.

### A correção que mudou a estratégia

O primeiro cálculo (05/08) errou de conceito: comparou CAC-alvo contra a sobra de **1 mês só**, dando R$40,92 (ME) e R$11,52 (MEI) — número abaixo até do custo de **1 lead** no mercado real. Contabilidade é assinatura recorrente; CAC se mede contra **LTV**.

| Horizonte | CAC-alvo ME (33% do LTV) | CAC-alvo MEI |
|---|---:|---:|
| 1 mês (cálculo original, errado) | R$40,92 | R$11,52 |
| 12 meses | R$491,04 | R$138,20 |
| **24 meses** | **R$982,08** | **R$276,41** |

### Confronto com o mercado real

| Benchmark | Valor | Fonte |
|---|---:|---|
| CAC típico do nicho contábil BR (5% conversão) | R$500-4.000 | Gemini deep research, 07/07 |
| CAC SMB internacional (proxy) | R$1.500-7.300 | idem |
| CPL SaaS B2B Brasil | R$80-400 mediana | idem |
| CPL Google Search alta intenção | R$15-50 | idem |
| Payback no ticket R$139-195 com CAC R$1.000 | 5-7 meses | cruzamento |

### As 3 implicações estratégicas

1. **Canais caros de topo (CPL R$200-400) provavelmente não fecham a conta** com a margem atual, a não ser que a conversão lead→cliente fique bem acima da média do setor ou a retenção passe de 24 meses.
2. **Canais baratos ganham peso estrutural, não "quando der":** Search de alta intenção, orgânico/SEO, indicação. Viram prioridade, não plano B.
3. **MEI segue sendo a oferta mais frágil** (CAC-alvo R$138-276 mesmo em 24m). Se o honorário por cliente ficar perto de R$34,90, **o plano MEI pode não sustentar CAC nenhum.**

### A pendência crítica única

**Honorário contábil real (Mauro)** é o próximo dado que destrava CAC de verdade. Até lá, os números aqui servem como **teto de teste pequeno**, nunca meta de escala.

> **❓ Pergunta de validação**
> O preço de R$139 posiciona onde queremos (challenger sério, não briga de fundo de preço)? E a economia atual comporta a estratégia de canal desenhada nos blocos anteriores, ou algum bloco já está pedindo dinheiro que a margem não tem?

---

## 9. Funil & jornada de conversão

### A jornada completa

```
[Descoberta] → [Interesse] → [Consideração] → [MOMENTO DECISIVO]
→ [Compra] → [Entrega] → [Compartilhamento] → [Upsell]
```

### O achado que define o desenho: o momento decisivo é a conversa humana

**Não é trial, não é prévia, não é landing page.** É a conversa no WhatsApp. Confirmado pelo padrão do nicho: a dúvida específica (*"vocês fazem folha de 1 funcionário no plano de R$139?"*) se resolve em tempo real, e é ali que a decisão acontece.

**Consequência prática:** o anúncio leva **direto pro WhatsApp**, não pra landing com formulário pesado. Reduz fricção e barateia a fase de aprendizado do algoritmo.

### Etapa a etapa

| Etapa | O que precisa acontecer | Métrica | Referência |
|---|---|---|---|
| **Descoberta** | Meta geo BH, Instagram orgânico, indicação, Search (V1) | CPM | R$18-35 geo BH |
| **Interesse** | ad → WhatsApp direto; proposta clara: preço fechado + humano real | CPL | R$40-80 (estimativa nicho) |
| **Consideração** | quebra de objeção em tempo real; resposta humana rápida | taxa de resposta | sem benchmark próprio |
| **Momento decisivo** | qualidade da resposta humana + prova de CRC + garantia 7 dias | conversão lead→cliente | ~10,8% ME · MEI não perseguir |
| **Compra** | assinatura cartão/PIX, sem cadastro redundante | abandono de checkout | medir no V0 |
| **Entrega** | onboarding guiado + confirmação celebrativa ("Legalizei! 🎉") | — | vira matéria-prima do pilar 6 |
| **Compartilhamento** | indicação em comunidade profissional (B) e de freelancers (A) | taxa de referral | só após base real |
| **Upsell** | transição MEI→ME (gatilho: teto R$81k/ano) | taxa de upsell | ocasião de maior valor do setor |

**Ciclo de venda:** 15-45 dias (padrão B2B financeiro). Exceção: abertura urgente (contrato na mão) pode fechar em dias.

### O funil desqualifica sozinho — de propósito

O produto recusa na própria tela: fora de BH/MG (ME), CNAE não atendido ou regulamentado, 3+ sócios, sócio no exterior, Lucro Presumido. Isso é feature de honestidade, mas **muda como se mede CPL** — lead bruto ≠ lead que o produto aceita.

### O elemento de risco zero

Garantia de 7 dias (CDC art.49) citada no anúncio e reafirmada na conversa. **Já é contratual, não é promessa de marketing.**

> **❓ Pergunta de validação**
> Apostar a conversão na conversa humana está certo, ou perdemos gente por não ter caminho self-service pra quem não quer falar com ninguém? (Persona A é justamente quem tende a preferir resolver sozinha.)

---

## 10. Canais & prioridade

### O mapa completo, com o porquê de cada corte

| Canal | Status | Razão |
|---|---|---|
| **Instagram orgânico** | ✅ prioridade 1 | 83% de presença no setor da Persona B; sustenta e converte no tempo certo |
| **Meta Ads** (objetivo Mensagens) | ✅ prioridade 1 paga | melhor conversão B2B do nicho (4,68% vs 3,46% Google), CPM geo BH menor |
| **WhatsApp / indicação** | ✅ estrutural | domina 72-74% das vendas desse público; único caminho da Persona C |
| **Google Search alta intenção** | 🟡 V1 | CPL R$15-50 (o mais barato do mapa) mas mínimo real R$1.500-3.000/mês não cabe junto no budget V0 |
| **SEO/conteúdo** | 🟡 estrutural, longo prazo | ganha peso pela economia (canal barato), mas não entrega no horizonte do V0 |
| **TikTok Ads** | ❌ descartado | budget mínimo R$2.000-4.500 alto pra fase; demografia jovem incompatível (idade média do público 40,8 anos) |
| **LinkedIn Ads** | ❌ descartado por ora | CPC/CPM proibitivo pro ticket R$139; penetração de só 6% no público geral; revisar só se Persona A justificar com dado real |

### Por que concentrar em vez de espalhar

Meta pede ~50 eventos de conversão por conjunto a cada 7 dias pra sair da fase de aprendizado. Com R$3.500/mês (V0), rodar Meta + Google ao mesmo tempo deixa **os dois abaixo do mínimo de aprendizado.** Decisão: V0 inteiro em Meta; Google entra no V1 (R$5.000/mês).

### As 3 frentes

| Frente | Budget V0 | Objetivo |
|---|---|---|
| **1 — Reconhecimento** | orgânico, sem verba paga | topo de funil via Instagram |
| **2 — Captação** | R$3.500/mês (100% Meta) | fundo de funil, ad→WhatsApp, geo BH |
| **3 — Parcerias** | permuta/indicação, sem cash | CAC efetivo baixo via comunidades profissionais |

### Divisão por segmento

| Seg | Persona | % budget | Racional |
|---|---|---:|---|
| S-1 | A — Direto | 45% | maior conversão esperada, decide rápido, CAC-alvo mais folgado |
| S-2 | B — Construindo | 40% | maior volume de mercado, mas resistência de preço maior |
| S-3 | C — Mão na mão | **0%** | **não roda pago frio** — decide por indicação/confiança pessoal, não por anúncio |
| reserva | teste de criativo | 15% | ângulo novo sem comprometer o conjunto principal |

### 🔴 MEI não recebe campanha paga fria dedicada

Cruzamento de 2 pesquisas independentes: MEI precisaria de **~30% de conversão lead→cliente** pra fechar CAC via tráfego frio — *"irreal"* nas palavras da própria pesquisa de mercado. **MEI entra só como upsell natural de dentro do funil ME, ou por orgânico/indicação.**

### Restrições operacionais que amarram canal

- **Geo:** ME só atende BH/MG hoje; MEI não tem essa restrição. Rodar ME fora de BH/MG queima verba em lead que o produto recusa na 2ª tela.
- **Repasse tributário Meta de 12,15%** (jan/2026): R$1.000 nominal = R$878,50 de mídia efetiva.
- **Nunca escalar >20%/semana** num conjunto.

> **❓ Pergunta de validação**
> O mix de canais é coerente com as personas e com o ticket? Algum canal foi cortado cedo demais — em especial LinkedIn pra Persona A, e SEO, que a economia diz ser estruturalmente o mais adequado mas não aparece com peso no plano?

---

## 11. Métricas & o que conta como sucesso

### Dois gates diferentes (não confundir)

**Gate 1 — validação por pesquisa secundária** (o que já sabemos, sem gastar): **aprovado 07/07**, negócio fechado com o Mauro.
**Gate 2 — gate empírico do V0** (dado primário, tráfego real): **números ainda não travados.**

### Gate 1 — o placar honesto

| Critério | Sinal | Leitura |
|---|---|---|
| Mercado existe | 🟢 | 7,4mi ME/EPP, líder em 0,7% |
| Brecha real | 🟢 | 3 variáveis que ninguém atende juntas |
| **Ticket viável** | **🔴** | **CAC-alvo na ponta baixa do mercado, antes do honorário entrar** |
| Concorrência batível | 🟢 | Legalize já tem contador/compliance montados |
| Canal de aquisição | 🟡 | canal claro, mas mais restrito que antes |
| Produção viável | 🟢 | R$186k/5 meses, dentro da faixa de mercado |
| Ticket de teste | 🟢 | V0 = R$40-46k, 2 meses, sem software |

**Veredito: 🟡 GO com ressalva forte — 4 verde · 2 amarelo · 1 vermelho.** Foi rebaixado em 05/08 (era 5/7 verde) depois do achado do CAC. Não derruba a ideia; **derruba a estratégia de canal caro de topo.**

### Gate 2 — os thresholds que faltam travar

| Critério | Threshold | Status |
|---|---|---|
| Custo por resposta qualificada (instant form) | < R$X | 🔴 X não definido |
| % opt-in na lista de espera | > Y% | 🔴 Y não definido |
| Intenção de pagamento na landing quente | > Z% | 🔴 Z não definido |
| De M ligações, confirmam dor + topam preço | ≥ K | 🔴 M/K não definidos |
| Spike técnico confirma viabilidade | sim/não | 🔴 não rodado |

Regra do próprio plano: *"calibrar no mês 1, acordar com o Mauro ANTES do teste"* — **ainda não aconteceu.**

**Veredito de 3 cores já definido:** 🟢 GO V1 · 🟡 1 ciclo de correção (2-3 semanas, ~R$3-5k) · 2× amarelo = 🔴 NO-GO (economiza ~R$122k de build).

### O que o V0 mede e o que ele NÃO mede

**Mede:** intenção, dor, objeção, ranking de diferenciais, custo de captar atenção.
**Não mede:** retenção real, churn, LTV verdadeiro. **Sem cartão no V0** por decisão (empresa em constituição + cartão frio = falso vermelho). Cartão entra no mês 3, na pré-venda fundador (cap 15-25 vagas).

### KPIs do orgânico

Prioridade declarada: **save > share/DM > comentário.** Post de topo não força funil — ganha no save/share, converte via remarketing depois.

> **❓ Pergunta de validação**
> Estamos medindo as coisas certas? O que, na experiência dele, provaria rápido que a estratégia funciona ou falha — e falta algum indicador que a gente nem está olhando?

---

## 12. Riscos & pontos frágeis

### Risco 1 — Economia do MEI pode não fechar 🔴

A oferta MEI (R$49,90) tem sobra técnica de R$34,90 **antes** do honorário contábil. Se o honorário por cliente chegar perto disso, o plano não sustenta CAC nenhum. Já flagrado por 2 fontes independentes.
**Defesa atual:** MEI fora do tráfego pago frio; entra por orgânico/indicação e como upsell do funil ME.

### Risco 2 — Honorário contábil real ainda fora da conta 🔴

É o maior custo variável de um negócio de contabilidade e **não está em nenhum cálculo deste doc.** Toda margem, todo CAC-alvo e todo ponto de equilíbrio aqui são **teto inflado**.
**Defesa atual:** usar os números como teto de teste pequeno, nunca meta de escala. Destrava quando o Mauro entregar o dado.

### Risco 3 — Líder bem financiado 🟡

Contabilizei tem SoftBank (R$320mi, 2021) + Warburg Pincus (~R$700mi, 2024) — pode queimar caixa por muito mais tempo que qualquer entrante bootstrapped. E a margem real dela está em corretagem (saúde PJ, banco), não na mensalidade: ela pode subsidiar preço num terreno onde não podemos segui-la.
**Defesa:** não competir em volume de mídia/SEO; competir em nicho hiperlocal + humano de entrada, onde capital não compra vantagem automática.

### Risco 4 — Teto do MEI pode subir 🟡

PLP 108/2021 propõe elevar o teto pra R$130-134 mil/ano. Votação prevista pra jul/2026 **não confirmada** (vale ainda em ago/2026). Se aprovado: mais gente fica MEI por mais tempo → enfraquece o gatilho "vire ME", que é a conversão mais lucrativa do setor. Faca de dois gumes (também aumenta a base MEI que eventualmente precisa de mais serviço).
**Defesa:** precificação e segmentação preveem os 2 cenários; comunicar sempre como "proposta", nunca como "já vigente".

### Risco 5 — Desconfiança estrutural da categoria 🟡

*"Vocês têm contador DE VERDADE?"* é a pergunta nº1 em todos os FAQs concorrentes. A ansiedade é **estrutural da categoria**, não específica de um player — e nós entramos como marca nova e desconhecida, o que agrava.
**Defesa:** prova de humano real (nome, foto, CRC) cedo na jornada, não só como resposta de FAQ.

### Risco 6 — Gargalo de produção de conteúdo 🟡

Pedro cobre PM + dev + growth + design. Produção de vídeo é júnior. A cadência de 3 posts/semana foi desenhada pra não quebrar isso, mas **a estratégia orgânica depende de um recurso que já está no limite.**
**Defesa atual:** cadência honesta desde o início, subir gradual. Sem defesa estrutural (não há segundo produtor).

### Risco 7 — Sem base de clientes, sem prova social 🟡

40% da pauta é "diferencial/prova", mas o pilar 6 (prova/reação) só tem material founder-made (Pedro mostrando o próprio CNPJ) até existir depoimento real.
**Defesa:** honestidade declarada — usar founder-made e não fabricar prova social.

### Risco 8 — Marca nova em categoria de dinheiro 🟡

Contabilidade lida com dinheiro e com risco legal do cliente. Marca desconhecida parte com desvantagem de confiança que craft e transparência mitigam, mas não zeram.
**Defesa:** craft impecável (diferenciação quase de graça, ninguém investe nisso) + transparência radical (preço fechado, custo de saída declarado, garantia contratual).

> **❓ Pergunta de validação**
> Qual desses riscos mata a estratégia se acontecer? E tem risco grande que a gente simplesmente não viu — na experiência dele com esse tipo de operação?

---

## 📌 Fechamento — o que precisa sair desta conversa

| Saída esperada | Status hoje |
|---|---|
| Posicionamento e tom validados ou ajustados | 🟢 escrito, aguardando olhar externo |
| Personas confirmadas ou corrigidas | 🟡 3 dorsais fechadas, volumes são hipótese |
| Pilares de conteúdo aprovados | 🟢 escrito |
| Mix de canais validado | 🟡 concentração em Meta é decisão de budget, não de convicção |
| Thresholds do gate V0 travados (X/Y/Z/M/K) | 🔴 **pendência mais antiga aberta** |
| Riscos priorizados | 🟡 8 mapeados, sem ranking de gravidade |

### Pendências que não dependem desta reunião

- **Honorário contábil real (Mauro)** — destrava CAC de verdade
- **Precificação MEI (R$49,90)** — segue placeholder, precisa revisão
- **Contas Google Ads / Meta Ads** — setup técnico ainda pendente
- **Tracking de UTM no CRM** — backfill é impossível; se a campanha subir antes, a atribuição do período se perde pra sempre

---

## Cross-refs

**Mercado:** [[mercado-bh-regional]] · [[PESQUISA-MERCADO]] · [[perfil-microempreendedor-mercado]]
**Concorrência:** [[matriz-comparativa]] · [[insights-estrategicos]] · [[_sintese-paginas-publicas]] · [[2026-07-21-dossie-plataforma-logada]]
**Marca:** [[posicionamento]] · `marca/conceito/conceito-marca.md` · `marca/decisoes-marca.md` · [[glossario-tecnico-humano]] · [[exemplos-copy-por-tela]]
**Público:** [[metodologia-personas]] · [[persona-a-servico-intelectual]] · [[persona-b-servico-estetico]] · [[persona-c-baixa-familiaridade-digital]]
**Orgânico:** [[estrategia-organica]] · [[mecanicas-engajamento]]
**Economia:** [[economia-preco-cac]] · [[benchmark-padrao-195]]
**Funil/canais:** [[funil-conversao]] · [[estrutura-funil-trafego]] · [[frente-1-captacao-meta-bh]] · [[trafego-pago-contabilidade-mercado]]
**Gate:** [[validacao-ideia]] · `BASE-ESTRATEGICA.md` §13
**Pauta operacional da reunião:** [[2026-08-05-pauta-reuniao-gestor-trafego]]
