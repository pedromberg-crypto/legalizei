---
tipo: prompt-pesquisa
status: vivo
data: 2026-09-19
assunto: agente-whatsapp-vault
tags: [pesquisa, prompt, leo, ollama, hermes, vps, avaliacao, custo]
---

# Prompt de pesquisa — o motor do Léo e como testá-lo sem queimar cota

> Substitui o `prompt-gemini-provedores-llm-2026-09.md` (Downloads, 19/09), que
> perguntava só "qual provedor". Este pergunta **como rodar e lapidar o agente
> na estrutura que já temos** (VPS + Hermes + Ollama), e trata provedor como um
> dos sete blocos, não como a pergunta.
>
> Rodar no Gemini com Google Search ativado. Salvar a resposta como `.md` em
> Downloads e colar de volta na sessão do Claude Code.

---

Você é um pesquisador técnico. Preciso de um levantamento **atual (setembro de 2026)** e **verificável** sobre como operar, documentar, avaliar e baratear um agente de LLM em produção, dentro de uma infraestrutura que **já existe e não vai mudar**.

**Regra dura de formato: todo dado vem com fonte (URL), data da informação e grau de confiança (alta/média/baixa).** Dado sem fonte não entra na resposta, entra na seção de lacunas do final. Se um número mudou recentemente ou você não conseguiu confirmar, diga isso explicitamente em vez de estimar. Não arredonde cota nem preço de cabeça.

⚠️ **Não proponha trocar a arquitetura.** A decisão de manter VPS + Hermes + Ollama está tomada. Respostas do tipo "migre para X framework" não servem. O que serve é: o que essa pilha já sabe fazer e nós não estamos usando, e o que se pluga nela sem reescrita.

## Contexto do sistema (tudo abaixo é medido, não estimado)

Agente de atendimento por WhatsApp, português do Brasil, empresa de contabilidade digital em Belo Horizonte. Nome interno: Léo.

**Infraestrutura, que fica como está:**
- VPS KVM 2 da Hostinger, **sem GPU**.
- Runtime de agente chamado **Hermes**: perfis em `~/.hermes/profiles/<agente>/`, memórias em `memories/USER.md`, estado em SQLite (`state.db`, com tabela `session_model_usage`), skills em disco lidas sob demanda por uma ferramenta `skill_view`, e uma variável de ambiente `_SKILL_VIEW_PRUNE_MIN_CHARS` que poda do histórico o conteúdo de skill acima de N caracteres quando a conversa compacta.
- **Ollama Cloud** como provedor de inferência. Modelo em produção: `gemma4:31b`. Plano Free, **cota estourada em 19/09**.
- Conector de WhatsApp para o canal real; a bateria de testes roda por **CLI**, não pelo WhatsApp.

**Formato da documentação do agente (é isto que queremos avaliar):**
- Um `SOUL.md` de **21.805 caracteres** com personalidade, tom e regras duras. **Sempre no contexto, em toda chamada.**
- Quatro skills (`atendimento`, `vendas`, `escalacao`, `base-legalizai`). Só o `description` de cada uma fica sempre no contexto.
- **13 notas de referência** (`00` a `12`), de 3.021 a 7.229 caracteres cada, lidas sob demanda via `skill_view`. São o conhecimento: preços, regras de órgãos públicos, cálculo fiscal, contrato, escopo.
- System prompt base completo: **~30.662 caracteres** depois de um corte de 33% em 19/09.
- Princípio já travado por nós: **número mora em uma nota só, e nunca no `SOUL`** — porque valor escrito no que está sempre no contexto faz o modelo responder sem abrir a nota. Medido: a nota de contrato foi aberta **1 vez em 632** chamadas de `skill_view` enquanto o `SOUL` entregava os números dela.

**Consumo medido (18 e 19/09/2026, números do provedor):**
- 2.142 chamadas de API, **35.461.516 tokens**, 771 sessões, 100% originadas em CLI de teste.
- Input novo 5.941.398 · **cache read (prompt re-lido) 29.406.688, ou 83%** · output 113.430, ou **0,3%**.
- Média de **16.555 tokens por chamada**.
- Uma rodada da bateria de 58 casos custa **~2.572.861 tokens**, ou **44.360 tokens por caso**.
- Cada caso faz de 0 a 6 chamadas de `skill_view`.
- A cota Free morreu com `HTTP 429` de limite mensal, em 2 dias de teste.

**A bateria:**
- 58 casos em YAML. Cada caso tem turnos de cliente, regex `deve` / `nao_deve`, travas `max_chars` / `min_chars`, e um critério `avaliar` de leitura humana que **hoje não entra no placar**.
- Mais 13 checagens globais determinísticas em toda resposta: tabela, título, citação, LaTeX, travessão, link não permitido, inglês, português de Portugal, vazamento técnico, frase proibida, impaciência, promessa de envio, negação de fidelidade. E teto de 8 linhas.
- 🔴 **A bateria é instável:** quatro rodadas seguidas do mesmo modelo com o mesmo pacote deram **51, 49, 48, 51 de 51**, e as falhas **não se repetiram** entre rodadas. Roda com `-j 6` contra um plano de **1 requisição concorrente**.
- Sinal de que o modelo maior não é melhor aqui: `gpt-oss:120b` deu **9/16** contra **12/16** do `gpt-oss:20b`, no mesmo pacote.

**Restrição de orçamento:** não há recurso para comparativo caro. Toda recomendação precisa vir com o custo em tokens ou em dólares de executá-la.

**Dado sensível:** o agente conversa com clientes reais sobre abertura de empresa e **recebe CPF e dado pessoal sem pedir**. Legislação aplicável: LGPD (Brasil).

---

## Bloco 1 — Ollama Cloud, planos pagos

Esta é a pergunta mais imediata, porque a infra fica.

1. **Quais são os planos pagos da Ollama Cloud em setembro de 2026?** Nome, preço mensal, e **a cota exata de cada um** — tokens por mês, requisições por minuto, requisições concorrentes. Número, não adjetivo. Se a Ollama não publica o teto de tokens, diga isso com todas as letras.
2. 🔴 **Qual é a lista completa de modelos que o plano pago de entrada (~US$ 20/mês) libera?** Nome e tamanho de cada um.
3. **Há modelos da família DeepSeek disponíveis na Ollama Cloud?** Quais versões, e em qual plano. Confirme se são os pesos abertos da DeepSeek servidos pela Ollama, e **não** a API da própria DeepSeek.
4. **Confirme ou refute:** a Ollama Cloud só serve modelos de **peso aberto**, e portanto **não oferece Gemini nem Claude em plano nenhum**, por serem pesos fechados. Se estiver errado, cite a fonte.
5. **A Ollama Cloud faz prompt caching?** Como o cache hit é cobrado ou contabilizado contra a cota, e qual o TTL. Isto é decisivo: 83% do nosso consumo é prefixo repetido.
6. 🔴 **Privacidade:** os termos da Ollama Cloud permitem uso de prompts e respostas para treino? Responda **separadamente para o tier gratuito e o pago**, com o trecho e o link do termo. Onde ficam os servidores.
7. **Tool calling** na Ollama Cloud: quais dos modelos oferecidos têm function calling confiável, e há relato público de falha em algum deles.

## Bloco 2 — Hermes: o que a pilha já sabe fazer e talvez não estejamos usando

O runtime se chama **Hermes** e tem as características descritas no contexto (profiles, `skill_view`, `state.db` SQLite, `_SKILL_VIEW_PRUNE_MIN_CHARS`, memórias por perfil em `USER.md`).

1. **Identifique o projeto.** Qual projeto open source ou produto isso é, quem mantém, versão atual em setembro de 2026, repositório e documentação. Se houver mais de um projeto chamado Hermes na área de agentes, diga qual bate com essas características e qual não bate.
2. **Recursos que ele oferece e que um operador costuma deixar desligado:** roteamento determinístico antes do turno, cache de prefixo local, replay de sessão, registro de ferramentas, limites de poda, múltiplos perfis com backends diferentes, modo de avaliação em lote.
3. 🔴 **Ele permite trocar o backend de modelo por perfil ou por sessão** (por exemplo: um perfil no Ollama, outro num endpoint compatível com OpenAI), **sem reescrever as skills**? Como se configura.
4. **Como se faz replay de conversas gravadas** nesse runtime — reprocessar sessões do `state.db` contra um modelo novo, ou revalidar respostas já salvas sem chamar modelo nenhum.
5. **O parâmetro de poda** (`_SKILL_VIEW_PRUNE_MIN_CHARS` ou equivalente): qual o default, o que exatamente ele poda, e qual a prática recomendada quando a base de conhecimento tem notas de 3k a 7k caracteres.
6. **Vazamento entre conversas:** o `USER.md` do perfil é injetado em **toda** conversa, inclusive com interlocutores diferentes. Isso é comportamento pretendido do projeto? Existe memória **por contato** em vez de por perfil? Como quem usa em produção resolve isso.

## Bloco 3 — Arquitetura de documentação para agente: o que é estado da arte hoje

A pergunta de fundo: **a qualidade da resposta depende mais do modelo ou do formato da documentação?** E o nosso formato está certo?

1. **Carregamento sob demanda (skills, progressive disclosure, tool-based retrieval) contra RAG por embedding contra colocar tudo no system prompt:** o que a evidência de 2026 diz sobre qual formato dá melhor aderência a regra, para base de conhecimento pequena (13 documentos, ~65 KB no total). Cite benchmark ou estudo, não opinião de blog.
2. 🔴 **Posição da regra dentro do documento importa?** Temos evidência interna de que regras críticas enterradas no §5 de um arquivo de 10 KB são violadas mesmo depois de o agente **abrir** o arquivo. Isso tem nome na literatura (lost in the middle, primacy/recency, atenção posicional)? O que se recomenda: documento curto e vários, ou documento longo com as regras no topo?
3. **Tamanho de system prompt:** existe evidência de degradação de aderência acima de certo tamanho? Os nossos ~30.662 caracteres são muito, pouco ou irrelevante para modelos de 20B a 120B?
4. **Regra negativa** ("nunca faça X", "não use travessão", "não invente link") é notoriamente mal seguida. O que funciona melhor em 2026: regra negativa, reformulação positiva, few-shot com par errado/certo, ou validação pós-geração? Temos hoje pares ❌/✅ e um banco de falas.
5. 🔴 **Modelo maior nem sempre é melhor em seguir instrução:** medimos `gpt-oss:120b` pior que `gpt-oss:20b` no mesmo pacote. Isso é fenômeno conhecido? Em que condições um modelo menor supera um maior em aderência a instrução longa?
6. **Como se escreve documentação para um modelo pequeno** (20B a 31B) em oposição a um grande: o que precisa estar explícito, o que pode ser inferido, quanto de justificativa vale a pena manter.
7. **Português do Brasil:** quais modelos abertos de 2026 escrevem PT-BR natural sem escorregar para português de Portugal, e isso se corrige por prompt ou é característica do modelo.

## Bloco 4 — Avaliar agente sem queimar cota

Este é o bloco mais importante para nós. Gastamos **35 milhões de tokens em 2 dias** para rodar 14 baterias durante o desenvolvimento.

1. **Qual é a prática recomendada de pirâmide de testes para agente de LLM em 2026?** O que se valida sem chamar modelo, o que se valida com modelo barato, o que exige o modelo de produção.
2. 🔴 **Validação offline contra transcrições salvas:** temos 2.142 respostas gravadas no `state.db`. Existe ferramenta ou padrão estabelecido para reprocessar checagens determinísticas (regex, tamanho, formato, vocabulário proibido) contra um corpus salvo, a custo zero? Nomes de ferramentas, com link.
3. 🔴 **Instabilidade de bateria:** o que a literatura recomenda para distinguir regressão real de ruído, quando quatro rodadas idênticas dão 51/49/48/51? Quantas rodadas para significância, que teste estatístico, e como se classifica um caso como flaky e se aposenta do placar.
4. **Concorrência:** rodar com `-j 6` contra um provedor de 1 requisição concorrente pode, por si só, produzir variação de resultado (timeout, retry, resposta truncada, corte de contexto)? Ou o placar instável indica outra coisa?
5. **Seleção de subconjunto:** como se escolhe uma micro-bateria de 12 a 15 casos que preserve o poder de discriminação de uma bateria de 58. Há método publicado (item discrimination, cobertura por capacidade, information gain)?
6. **LLM como juiz:** estado da arte em setembro de 2026 para julgar critério subjetivo (tom, empatia, naturalidade) que hoje exige leitura humana. Qual modelo se usa como juiz, qual o viés conhecido, quanto custa, e qual a concordância medida com humano.
7. **Frameworks de avaliação de agente** que funcionem com runtime próprio e provedor arbitrário compatível com OpenAI: promptfoo, DeepEval, Langfuse, Braintrust, Inspect, RAGAS, ou o que existir em 2026. Para cada um: é open source, roda local, aceita endpoint arbitrário, tem free tier, e faz replay offline.
8. **Custo por caso:** existe prática de instrumentar custo por caso de teste e orçar a bateria antes de rodar? Como se faz.

## Bloco 5 — Loop de iteração barato, e a pergunta do canal

1. 🔴 **Rodar um modelo pequeno localmente só para iterar na documentação:** hardware disponível é um notebook com **RTX 3050 de 6 GB de VRAM**. Quais modelos de 2026 rodam nisso com **tool calling funcionando**, em qual quantização, e com que perda de qualidade. Seja específico: nome, quantização, VRAM necessária, tokens por segundo esperados.
2. **Vale iterar documentação contra um modelo de 7B a 8B local e só depois validar no modelo de produção?** O sinal de um modelo pequeno local prevê o comportamento do modelo grande, ou os erros são de natureza diferente? Se houver estudo sobre correlação entre modelos em suíte de aderência, cite.
3. **A pergunta do canal:** nossa bateria já roda por CLI, não pelo WhatsApp. **Mudar o canal de teste (Telegram, web, simulador) reduz custo de alguma forma**, ou o custo está integralmente na chamada ao modelo e o canal é irrelevante? Responda direto. Se houver algum ganho real em testar por outro canal (por exemplo, ambiente de sandbox gratuito de alguma plataforma), diga qual e quanto.
4. **Testar com humanos sem gastar cota de produção:** existe padrão de ambiente de homologação para agente de atendimento, com canal separado e usuários internos, que seja barato?

## Bloco 6 — Prompt caching, e o custo por turno de verdade

Nosso perfil de consumo é **83% prefixo idêntico**. Preço de tabela por milhão de tokens não descreve o nosso custo.

1. **Para cada um de: Google Gemini API, DeepSeek API, Anthropic Claude API, OpenAI, Groq, Together, Fireworks, OpenRouter e Ollama Cloud paga** — o cache de prefixo existe? É automático ou precisa ser declarado? Qual o desconto do cache hit em relação ao input normal? Qual o TTL? Há custo de escrita no cache?
2. **Compatibilidade com a API da OpenAI**, para trocar de backend sem reescrever cliente.
3. **Latência a partir do Brasil** e região de servidor. Alvo: resposta em até 7 segundos.
4. **Preço de input, output e cache hit** do modelo mais barato com tool calling confiável de cada provedor.
5. **Janela de contexto** e limite de tokens por requisição.

## Bloco 7 — Privacidade, isolada

Independente de provedor: **em setembro de 2026, qual é a prática de mercado quanto a treinar com os dados do usuário?**

1. É regra geral que o tier gratuito treina e o pago não? Cite exemplos com link do termo.
2. Existe provedor com tier gratuito que **garante contratualmente** não treinar?
3. 🔴 **Para o caso específico da Ollama Cloud e da DeepSeek API:** os termos permitem treino? Onde ficam os servidores? Há versão com DPA ou addendum de não-treino?
4. Há decisão, orientação ou precedente da **ANPD** sobre usar API de LLM de terceiro com dado pessoal de cliente brasileiro?
5. O que costuma ser exigido para uso com dado pessoal: DPA, addendum, tier enterprise, região específica, anonimização prévia?
6. **Padrão de redação/mascaramento antes de enviar ao modelo:** existe prática estabelecida de retirar CPF e dado pessoal do prompt antes da chamada, e ferramenta pronta para PT-BR?

---

## Formato da resposta

1. **Bloco 1 em tabela**, uma linha por plano da Ollama Cloud, com cota, modelos, caching e termo de treino.
2. **Bloco 6 em tabela**, uma linha por provedor, com as 5 colunas: caching e desconto · compatível com OpenAI · latência do Brasil · preço input/output/cache · contexto.
3. **Blocos 2, 3, 4, 5 e 7 em prosa curta**, com os dados citados e link.
4. **Três recomendações separadas, porque são três decisões diferentes:**
   - **onde iterar** (mudança de documentação, dezenas de vezes por dia, sinal barato)
   - **onde rodar o baseline** (bateria cheia, poucas vezes, precisa ser o modelo de produção)
   - **quem é o cérebro em produção** (privacidade é requisito, ≤7s, tool calling confiável)
5. **Seção obrigatória: "As 3 coisas que eu mudaria primeiro"** — ordenadas por retorno sobre esforço, cada uma com o custo estimado de executar e o ganho esperado em tokens ou em placar. Nada de lista de 15 itens.
6. 🔴 **Seção final obrigatória: "O que não consegui confirmar".** Todo dado sem fonte, desatualizado ou com documentação ambígua. **Esta seção não pode vir vazia** — se vier, algo foi preenchido por suposição.
