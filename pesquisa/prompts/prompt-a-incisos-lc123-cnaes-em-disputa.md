---
tipo: operacao
status: vivo
data: 2026-09-24
assunto: prompt-incisos-lc123-cnaes-disputa
deriva_de: [lc123-art18-anexos-taxativo, cnae-liso-servico]
tags: [cnae, prompt, pesquisa, simples-nacional, fator-r, gemini]
---

# 🔍 Prompt A — os incisos da LC 123 em disputa

> Para rodar no Gemini com Google Search e colar o resultado de volta. Sai da [[_fila-correcoes]], itens 4, 5, 6 e 13.
>
> 🔑 **O prompt encolheu depois de ler as subclasses do IBGE.** Eram 6 disputas; 4 se resolveram no vault (bloco B abaixo, que vai junto só como conferência). **Sobraram 2 perguntas de verdade** — e são as que valem dinheiro: mexem em 3 dos 87 CNAEs que atendemos, na diferença entre **6% e 15,5%**.

---

## 📋 O prompt (copiar daqui para baixo)

---

Você é consultor tributário especializado em Simples Nacional. Preciso enquadrar atividades específicas nos anexos da **Lei Complementar 123/2006, art. 18** (redação vigente, pós-LC 155/2016).

**Contexto do meu negócio:** contabilidade digital para **microempresa prestadora de serviço, optante pelo Simples Nacional, em Belo Horizonte/MG**. Trabalho só com **Anexo III e Anexo V** — Anexo I, II e IV estão fora do meu escopo por decisão de negócio.

**O que eu já tenho mapeado, e você não precisa repetir:**

- **§5º-B, incisos I a XV e XVII** → Anexo III sempre, Fator R não entra.
- **§5º-C** → Anexo IV (construção, vigilância, limpeza, advocacia).
- **§5º-B XVI, XVIII a XXI + todo o §5º-D** → Anexo III por padrão, cai para V se o Fator R < 28%.
- **§5º-I, incisos II a XI** → Anexo V por padrão, sobe para III se o Fator R ≥ 28%.
- **§5º-I, inciso XII** → cláusula de varredura: *"outras atividades de prestação de serviços decorrentes de exercício de atividade intelectual, de natureza técnica, científica, desportiva, artística ou cultural, profissão regulamentada ou não, desde que não sujeitas à tributação nos Anexos III ou IV"*.
- **§5º-F** → residual: serviço sem previsão expressa em nenhum dos acima → Anexo III fixo.

**Regra da resposta, e ela importa mais que a conclusão:**

1. Toda afirmação precisa vir com **fonte citada**: artigo/parágrafo/inciso da LC 123, número de **Solução de Consulta COSIT/RFB**, ato do CGSN, ou decisão do CARF. Sem fonte, não me serve.
2. Onde **não existir** fonte específica, diga **"não localizei fonte específica"** e explique o raciocínio por analogia, marcado como analogia. **Prefiro um "não sei" honesto a uma resposta fechada sem lastro.**
3. Se houver divergência entre fontes, mostre os dois lados e diga qual prevalece, e por quê.
4. Não me diga qual anexo é "mais vantajoso". Quero o **enquadramento correto**, não o mais barato.

---

### 🔴 PERGUNTA 1 — Promoção de vendas e marketing direto são "publicidade" para o §5º-I X?

Esta é a mais importante: são duas atividades que eu **já atendo hoje**, classificadas por mim como **Anexo III fixo pelo residual §5º-F**, e desconfio que estejam erradas.

O §5º-I, inciso X, nomeia **"jornalismo e publicidade"**. E as duas subclasses do IBGE usam a palavra *publicidade* na própria definição:

| CNAE | Descrição oficial | O que a subclasse do IBGE diz que ela compreende |
|---|---|---|
| **7319-0/02** | Promoção de vendas | *"a promoção de vendas e **a publicidade** no local da venda"* · *"a distribuição ou entrega de material publicitário (fulfillment)"* |
| **7319-0/03** | Marketing direto | *"**a publicidade** por mala direta, por telefone, em visitas de representantes"* |

O que me faz duvidar: na mesma classe `7319-0`, eu classifiquei **7319-0/04 (consultoria em publicidade)** e **7319-0/99 (outras atividades de publicidade n.e.)** como sujeitas ao Fator R, e **7319-0/01 (criação de estandes para feiras)** também — pelo §5º-D IX. Ou seja, **a mesma classe está partida**, e a linha que separa é justamente "isso é serviço de publicidade ou é execução operacional?".

**Responda:**
- **a)** `7319-0/02` promoção de vendas: cai no §5º-I X (Fator R) ou no §5º-F (III fixo)? Com fonte.
- **b)** `7319-0/03` marketing direto: idem.
- **c)** Existe **critério jurídico firmado** que separe *"prestar serviço de publicidade"* (intelectual, Fator R) de *"executar ação promocional/distribuir material"* (operacional, III fixo)? Se existe, qual é e onde está escrito?
- **d)** Há Solução de Consulta COSIT tratando de agência de marketing, promotora de vendas, ou empresa de marketing direto no Simples? Quais números?

---

### 🔴 PERGUNTA 2 — Agência de notícias é "jornalismo" para o §5º-I X?

CNAE **6391-7/00**, também já atendido por mim, também classificado como **III fixo pelo §5º-F**.

A subclasse do IBGE diz: *"a atividade de agências de notícias cuja função é a **coleta, síntese e difusão de materiais para os meios de comunicação** (textos, fotos, filmes, etc.)"*. E declara que **NÃO** compreende as atividades de **jornalistas independentes (9002-7/01)** nem de **fotógrafos independentes (7420-0/01)**.

Minha dúvida é exatamente essa exclusão: se o IBGE separa "agência de notícias" de "jornalista independente", isso significa que a agência **não** exerce jornalismo para efeito do §5º-I X? Ou a separação do IBGE é só de classificação estatística e, para a LC 123, a atividade-fim continua sendo jornalismo?

**Responda:**
- **a)** `6391-7/00` cai no §5º-I X (Fator R) ou no §5º-F (III fixo)? Com fonte.
- **b)** A pessoa jurídica que explora atividade jornalística, sem ser jornalista pessoa física, está alcançada pelo §5º-I X?
- **c)** Existe Solução de Consulta sobre agência de notícias, assessoria de imprensa ou produtora de conteúdo jornalístico no Simples?

---

### 🟢 BLOCO B — quatro que eu já resolvi. Confirme ou derrube.

Não preciso de pesquisa longa aqui. Quero **um parágrafo por item**, dizendo se concorda, e se discordar, com qual fonte.

| # | CNAE | Meu enquadramento | Meu raciocínio |
|---|---|---|---|
| **B1** | **8020-0/02** Outras atividades de serviços de segurança | **Anexo III fixo, §5º-B IX** | O título sugere vigilância (§5º-C VI, Anexo IV), mas a subclasse do IBGE diz que ela compreende *"a **instalação, reparação, reconstrução e ajuste mecânico de cofres, trancas e travas de segurança**"* — é serralheria/chaveiro, não guarda patrimonial. E o §5º-B IX nomeia *"instalação, reparos e manutenção em geral"*. |
| **B2** | **9329-8/04** Exploração de jogos eletrônicos recreativos | **Anexo III fixo, §5º-F** | Estava como Fator R pelo §5º-D IV, que trata de *"elaboração de programas de computador, **inclusive jogos eletrônicos**"*. Mas a subclasse diz *"a **exploração de estabelecimentos** de jogos eletrônicos recreativos"* — é operar fliperama, não desenvolver software. Todos os irmãos da classe (sinuca, boliche, discoteca) são III. |
| **B3** | **7210-0/00** P&D experimental em ciências físicas e naturais | **Fator R, §5º-I VI** | O §5º-I VI nomeia **"pesquisa"** entre os serviços técnicos. Se você entender que não cabe no VI, entendo que cabe no **§5º-I XII** (atividade intelectual de natureza técnica e científica) — nos dois casos o resultado é Fator R. Quero saber **qual inciso**, não só o anexo. |
| **B4** | **7220-7/00** P&D experimental em ciências sociais e humanas | **Fator R, §5º-I VI ou XII** | Mesma lógica de B3. A subclasse cita *sociologia, economia, psicologia, direito, linguística, arqueologia*. Aqui o "técnica" do VI pesa menos e o "científica" do XII pesa mais. |

---

### 🔎 BLOCO C — duas checagens de vigência, curtas

- **C1.** A tabela de **alíquotas de ISS por CNAE/CTISS da Prefeitura de Belo Horizonte** que eu uso foi baixada do site da Fazenda municipal em **27/08/2026**. Houve alteração da **Lei Municipal 8.725/2003** ou da tabela de CTISS depois dessa data? Se sim, o que mudou e onde está publicado?
- **C2.** Para **2026**, qual o valor mensal exato do **DAS-MEI** de **prestador de serviço** (INSS 5% do salário mínimo + ISS), e qual o **salário mínimo vigente** usado no cálculo? Cite o ato que fixou.

---

### 📦 Formato da resposta

Para cada item (1a, 1b, 1c, 1d, 2a, 2b, 2c, B1-B4, C1, C2), devolva:

```
ITEM:        <código>
VEREDITO:    <Anexo III fixo | Fator R (III↔V) | Anexo IV | não localizei fonte específica>
INCISO:      <§5º-X, inciso Y>
FONTE:       <LC 123 art.18 §... | SC COSIT nº .../ano | Res. CGSN 140/2018 art... | Acórdão CARF ...>
CONFIANÇA:   <fonte direta | analogia | sem fonte>
POR QUÊ:     <até 4 linhas>
CONTRA:      <o argumento do outro lado, se existir>
```

No fim, uma lista só com **tudo que você NÃO conseguiu fundamentar em fonte oficial** — é essa lista que eu levo para o contador.

---

## 🎯 O que fazer com o retorno

| Resposta | Ação |
|---|---|
| **1a/1b = Fator R** | 🔴 **2 dos 87 mudam de 6% para poder ser 15,5%.** Corrige `cnae-matriz-v2.csv`, ADR, e o `piloto-pro-labore` passa a pilotar mais 2 |
| **1a/1b = III fixo** | confirma o que está, e o §5º-F ganha um precedente citável para os outros 51 residuais |
| **2a** | 1 dos 87, mesmo efeito |
| **B1-B4** | se confirmar, aplico direto; se derrubar, vira linha de ADR com a fonte dele |
| **C1/C2** | destrava os itens 3 e 10 da [[_fila-correcoes]] |
| **"não localizei fonte"** | vai para a fila do contador, junto com as 4 perguntas de [[2026-09-18-validacoes-cnae-para-contador]] |

⚠️ **Nada entra na tabela direto do retorno.** Resposta de LLM com busca é insumo, não fonte — mesma régua de [[legalize-regua-de-prova-fonte-oficial]]: quem fecha a regra é o documento citado, não quem citou.
