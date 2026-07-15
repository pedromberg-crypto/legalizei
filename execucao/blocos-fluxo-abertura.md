---
tipo: spec
data: 2026-07-14
status: em-construcao
tags: [produto, spec, blocos, onboarding, caminho-critico]
---

# 🧱 Blocos do fluxo de abertura — contrato de interface Pedro↔Dev

> Especificação dos BLOCOS do onboarding/abertura: onde o fluxo roda sozinho, **onde PAUSA** (assinatura / externo / humano) e **o que retoma**. Objetivo: matar o vai-e-volta Pedro↔Dev — o Dev modela a máquina de estados sem precisar perguntar. Derivado de [[2026-07-13-plano-sequencia-pm]]. Lapidação bloco a bloco (Pedro + Claude).

## 📚 Fontes-verdade
Toda decisão aqui cita a origem. Onde as atas conflitam ou faltam, marca-se `🟡 pendente`.
- [[processo-abertura-empresa-bh]] — passo a passo validado fase a fase + matriz de responsabilidades U/S/C/Ó
- [[2026-07-09-conversa-izabela]] — ata: abertura BH, gargalos, custos, sequência mesclada
- [[2026-07-13-conversa-karla]] — ata DP+fiscal: pró-labore, Fator R, duplo vínculo, eSocial, acessórias
- [[fluxo-abertura-portais-pedro-dev]] — passo × portal × URL × tem-API
- [[orgaos-sistemas-abertura-bh]] — sistema por passo
- 🟡 **Larissa (fiscal)** — pendente: anexos diferentes (tributa pela maior × pela nota), acessórias, acessória estadual MG

## 🧭 Convenções
- **BLOCO** = corrida máxima de passos que o app roda sozinho, sem parar.
- **PAUSA** = ponto onde o fluxo para e espera algo fora do controle do app. Tipos: **assinatura** · **externo** (órgão/parceiro) · **humano** (interno Legalize) · **pagamento**.
- Toda pausa precisa de 5 respostas: **tipo · gatilho de retomada · o que o cliente vê · SLA · fallback se travar**.
- **Retoma** = a máquina de estados. Cada bloco = um status por empresa, persistido. Regra dura: sobreviver dias pausado + retomar idempotente (não duplicar CNPJ).

## 🔤 Terminologia
- **CNAE** (principal / secundário) — padronizado. O termo "KINAE" (transcrição Plaud) foi **aposentado** 2026-07-14; era o CNAE atendido / principal.

---

# 🧩 BLOCO 1 — Porta de entrada / Qualificação
**Job:** uma pergunta binária — *"esse cliente é pra gente?"* — com o mínimo de fricção. Roda 100% no app, sem portal externo. Enquadramento fino NÃO é aqui (é o Bloco 2).

## Passos

| # | Passo | O que é / por que | Ator |
|---|---|---|---|
| 1 | Cliente descreve o que faz | Linguagem humana ("faço design e tráfego"), não código fiscal | cliente + IA |
| 2 | **Mapeamento CNAE (mini-loop, ver abaixo)** | Traduz descrição → CNAE confiante, desambiguando quando preciso | IA (+cliente) |
| 3 | Atalho "já sei meu CNAE" | Quem sabe o código pula a entrevista e digita direto | cliente |
| 4 | Filtro por regime (lookup na whitelist) | Confere se o CNAE cabe no recorte (serviço + Simples + não-regulada) | sistema |
| 5 | **Veredito** (3 saídas) | O binário do bloco | sistema |
| 6 | **Só se 🟢:** convida a criar conta | Conta vem DEPOIS do "sim" — mostra valor antes de pedir cadastro | cliente |

## Passo 2 — Mapeamento CNAE com desambiguação (o coração do bloco)
A tradução linguagem→CNAE **não é 1 tiro**. É um mini-loop com score de confiança. Motivo: resolver CNAE de fala vaga é difícil, e o **falso 🔴 (mandar embora quem a gente atenderia) é o pior erro possível** — cliente pagante perdido por uma palavra.

| | Sub-passo | O que faz |
|---|---|---|
| 2a | Mapeia descrição → CNAE(s) **+ score de confiança** | ex: "material de construção" → 46xx (representação) OU 47xx (varejo) |
| 2b | Alta confiança + sem fork → segue | vai direto ao veredito |
| 2c | Ambíguo OU fork cruza a linha atende/não → **pergunta** | desambiguação em linguagem humana, expondo a bifurcação |
| 2d | Resposta → CNAE confiante → veredito | agora sim decide |
| 2e | Ainda incerto após 1–2 perguntas → **fallback humano** | fila de "incerto"; **nunca 🔴 automático** |

**Regra de ouro:** a IA NUNCA dá veredito em cima de baixa confiança. Dúvida = pergunta. Dúvida persistente = humano. Nunca bounce por achismo.

**Assimetria de erro:**
| Erro | Consequência | Gravidade |
|---|---|---|
| Falso 🔴 (bounce quem atende) | perde pagante por suposição | 🔴🔴🔴 catastrófico |
| Falso 🟢 (deixa entrar quem não cabe) | pega no Bloco 2, redireciona | 🟡 recuperável |

## Passo 4 — Filtro por regime
O cliente **nunca escolhe regime**: ICP travado em **Simples** (ME serviço). O filtro é guarda invisível, já cozida na whitelist (~300 CNAE), com 3 critérios empilhados:

| Critério | Pergunta | Falhou → |
|---|---|---|
| 1. É serviço? | Comércio/indústria/folha pesada? | 🔴 |
| 2. É elegível ao Simples? | CNAE impeditivo ao Simples (LC 123)? | 🔴 |
| 3. É não-regulamentada? | Exige conselho + RT (CRM/OAB/CREA/CRO)? | 🟡 |

Passou nos 3 = está na whitelist = 🟢. Fonte: filtro CNAE por regime validado pela Izabela ("escolheu Simples → só CNAE que pode Simples"); recorte ~400→~300 e reguladas fora (Karla).

## Passo 5 — Veredito e roteamento

| Veredito | Destino | O que captura | Lógica |
|---|---|---|---|
| 🟢 **Atende** | Bloco 2 (app) | conta + segue | é o produto (serviço puro Simples) |
| 🟡 **Regulamentada** | **Waitlist do produto (só)** | contato + CNAE + atividade | futuro alvo do app; automatizar depois. NÃO vai pro Mauro por ora |
| 🔴 **Não atende** ("maiores": comércio/indústria) | **Comercial do Mauro (contábil tradicional)** | nome, contato, atividade | nunca será alvo do app → monetiza no escritório |

Lógica do roteamento: **waitlist = futuros clientes DO app; Mauro = quem nunca será do app.** O 🔴 vira canal de aquisição do negócio tradicional (ninguém que bate na porta é desperdiçado).

## Fim do Bloco 1
- **Não tem pausa externa/assinatura/humano** no happy path — é **fork instantâneo** (decisão em segundos). Exceção: o fallback humano (2e) é uma micro-pausa interna de validação, fora do caminho feliz.
- A 1ª pausa de verdade (cobrança / GOV.BR) só aparece nos blocos seguintes.

## 🛠️ Implicações pro Dev (o que o B1 exige de infra)
1. CNAE-mapping com **score de confiança** exposto (não é string→string).
2. **Prompts de desambiguação** por par traiçoeiro (vêm do Mapa de Confusão CNAE, abaixo).
3. **Fila de fallback humano** ("incerto") no B1 — infra, não só mensagem.
4. **Captura de dados + roteamento** pro comercial (🔴 → Mauro) e waitlist (🟡) — notificação/CRM interno.

## ✅ Decisões travadas nesta rodada (2026-07-14)
- Conta criada **depois** do veredito 🟢 (fricção mínima).
- B1 = só binário atende/não. Enquadramento fino (Fator R, secundários, pró-labore) = Bloco 2.
- Ambiguidade **nunca** vira 🔴 automático → pergunta → humano.
- 🟡 regulamentada → waitlist do produto (não vai pro Mauro).
- 🔴 não atende → comercial do Mauro.

---

# 🗺️ Mapa de Confusão CNAE (seed)
> ⏳ **PENDÊNCIA DO BLOCO 1 — a construir (deferido de propósito p/ não desviar foco, 2026-07-14).** Abaixo só a semente. Construir o mapa completo (a partir da matriz CNAE) é pré-requisito pra a IA do B1 estar "MEGA treinada" e o falso 🔴 sumir.
>
> Tabela dos **pares traiçoeiros**: frase vaga que esconde bifurcação onde uma leitura atende e a outra não. Uso duplo: **treino da IA** + **guarda-corpo** (bateu num par → a IA é obrigada a perguntar). Antídoto do falso 🔴. Pode virar nota própria quando crescer.

| Frase vaga | Leitura 🟢 atende | Leitura 🔴/🟡 | Pergunta-chave |
|---|---|---|---|
| "vendo material de construção" | representação comercial (serviço) | loja/varejo 🔴 | representa/intermedeia ou tem estoque próprio? |
| "trabalho com imóveis" | administração de imóveis (serviço) | corretor 🟡 (CRECI) / incorporação | administra/faz serviço ou corta comissão de venda? |
| "conserto celular" | reparo (serviço) | comércio de peças/aparelhos 🔴 | conserta ou vende aparelho? |
| "faço unha e cabelo" | serviço de estética | comércio de cosméticos 🔴 | atende cliente ou revende produto? |
| "faço bolo/doces" | confeitaria sob encomenda 🟡 | indústria/comércio alimentício 🔴 | encomenda artesanal ou produção/loja? |
| "dou aula / treino" | ensino, cursos livres (serviço) | (baixo risco, geralmente atende) | — |

---

# 🧩 BLOCO 2 — Coleta + Enquadramento (IACA)
**Job:** cliente já 🟢 e logado. Entrevista tributária + coleta de **tudo** pra constituir. **Output = "dossiê de constituição"** completo (alimenta os blocos de constituição). Cobre Fase 0 (coleta) + Fase 1 (definições) da Izabela. Self-service, no ritmo do cliente.

## Sub-wizard (ordem)
> ⚠️ Ordem = **candidata a A/B**: engajamento cedo (simulador antes do "chato") × coletar dados primeiro. Decisão: começar com **simulador cedo** e medir.

| # | Sub-passo | O que coleta / faz | Fonte |
|---|---|---|---|
| 2.1 | Dados do sócio | nome, CPF, RG, **estado civil + regime de casamento se casado**, endereço, contato | Izabela Fase 0 |
| 2.2 | Duplo vínculo CLT | campo "tem outro emprego CLT?" + **valor da remuneração** (obrigatório) + aviso teto INSS | Karla (LGPD: sistema não puxa vínculo de 3º) |
| 2.3 | +sócios (se houver) | dados completos de **todos** | Izabela |
| 2.4 | Dados da empresa | endereço + **guardar índice cadastral IPTU** + **capital social real** | Izabela |
| 2.5 | CNAE | principal (vem do B1) + **secundários sugeridos pela IA** (cliente edita) | Izabela + plano |
| 2.6 | Natureza jurídica | **IA recomenda default** (SLU p/ solo) + explicação; cliente confirma/muda | Izabela (escolha do cliente) |
| 2.7 | Razão social + nome fantasia | nomes + checagem de viabilidade prévia | Izabela |
| 2.8 | **Simulador Fator R + pró-labore** (clímax) | define Anexo III×V + pró-labore | Karla |
| 2.9 | Revisão do dossiê | cliente confere → handoff pro Bloco 3 (cobrança) | — |

## Detalhes de UX travados
- **2.5 secundários:** IA sugere sozinha; card traz **pill de prova social** ("Comum como secundário nessa atividade" / "Quem faz [X] costuma incluir esse também"). Cliente aceita/remove.
- **2.6 natureza jurídica:** default recomendado pela IA (não dropdown seco).

## Motor de enquadramento (a parte inteligente)
Inputs: **CNAE principal + faturamento estimado + pró-labore**. Números aterrados em [[fiscal-simples-bh-2026]] (bloco CONSOLIDADO). **Saída = projeção "estimativa"** (empresa nova não tem Fator R real; #3).
- **Fator R:** folha (incl. pró-labore) ≥ **28% do faturamento** → **Anexo III (6%)**; senão **Anexo V (15,5%)**. (Karla + #2/#8)
- **Simulador A × B × Ótimo** (transparente):

| | Cenário A | Cenário B | **Ótimo (recomendado)** |
|---|---|---|---|
| Pró-labore | mínimo (R$1.621) | maior (≥28% faturamento) | o menor que cruza 28% **e** fica ≤ R$5.000 |
| Anexo | V | III | III |
| Alíquota | 15,5% | 6% | 6% |
| Custo extra | INSS 11% (~R$178) | INSS 11% (máx R$932,31) **+ IRRF só acima de R$5k** | INSS 11% · **IRRF = ZERO** |
| Resultado | mostra qual **compensa de fato** | decisão informada | **economia máxima com imposto mínimo** |

- **⚠️ Correção-chave (Lei 15.270/2025):** o IRRF é **ZERO até ~R$5.000/mês de pró-labore**. O simulador **não pode inflar o custo do cenário B com IRRF que não existe** — isso fazia o Anexo III parecer mais caro do que é. Base [[fiscal-simples-bh-2026]] #2/#9.
- **Pró-labore ótimo (o diferencial):** a IA calcula o pró-labore que **cruza 28% (vira Anexo III) e fica sob R$5k (zero IRRF)** e mostra a economia mensal vs. Anexo V. Conselho que o contador tradicional cobra caro. → vira **feature-âncora do B2**.
- **Transparência de custo (regra dura Karla):** mostrar **custo da folha (INSS 11% + IRRF real) + pró-labore líquido** explícito. Dor histórica: cliente não sabia do custo → pedia aumento só pra baixar imposto → cancelava/reemitia guia = retrabalho.
- **🟡 Depende da Larissa:** se a **CPP embutida no DAS entra no numerador** (ponto B), o pró-labore necessário pra bater 28% muda → o "ótimo" recalcula. Ver [[perguntas-larissa-fiscal]].

## Faturamento estimado = faixa guiada (NÃO campo aberto)
**Insight:** faturamento estimado **não é campo legal** — não entra em DBE/contrato/registro (esses usam capital social). É **input de simulação/plano**, não valor jurídico. Zero a mais estraga a *decisão*, não o *CNPJ*. E a empresa nem existe ainda → é chute honesto; faixa é mais honesta que precisão falsa. 🟡 confirmar com Izabela que nenhum doc de abertura captura receita estimada.

| Camada | Como | Por quê |
|---|---|---|
| 1. Faixas ancoradas | botões/slider nos limiares reais (teto Simples + limiar Fator R + tiers do plano). Ex: "até 10k" · "10–20k" · "20–30k" · "30k+" | resolução só onde muda decisão; zero risco de zero a mais |
| 2. Default inteligente | IA já chega com faixa marcada, cruzando **CNAE + solo/sócios** | menos fricção, "me conhece" |
| 3. Slider fino (opcional) | arrasta dentro da faixa se quiser resolução pro simulador | precisão sob demanda |

Simulador usa **ponto médio da faixa** + mostra **sensibilidade** ("na ponta de cima, o Fator R já compensa"). O que importa = de que lado dos 28% cai. Se um dia permitir digitação: máscara R$ + bounds (rejeita acima do teto) + confirm-back anti-zero-a-mais.

## Validações travadas (Karla)
- Pró-labore **mínimo = 1 salário mínimo = R$1.621** (2026, [[fiscal-simples-bh-2026]] #9; reconferir jan/27).
- **Sócio NÃO pode ser CLT da própria empresa** → bloqueio no form.
- Duplo vínculo → INSS do pró-labore incide sobre a **folga `teto − salário CLT`**; só zera se CLT já ≥ **R$8.475,55** (não é binário — #6).

## Pausa?
- **Sem pausa externa/assinatura/humano.** Casa com decisão #3 do [[2026-07-13-alinhamento-pedro-dev-leonam|alinhamento]] ("wizard flui sem o time até a assinatura").
- Única pausa = **soft, self-service: salvar & retomar** (coleta de 2 sócios + IPTU + capital raramente cabe em 1 sessão). Estado persistido.
- **Fim** = dossiê completo → handoff pro **Bloco 3 (cobrança)**. Output do enquadramento (economia do Fator R) vira o **gancho de venda** do B3.

## 🛠️ Implicações pro Dev
1. Motor de enquadramento (Fator R) como serviço reusável (simulador + apuração futura).
2. Persistência de rascunho (salvar & retomar) por empresa.
3. Sugestão de secundários pela IA + pills contextuais.
4. Faixa guiada com default cruzado (CNAE+sócios) — não input numérico livre.
5. Framework de A/B (ordem do wizard) desde o início.

## ✅ Decisões travadas nesta rodada (2026-07-14)
- Natureza jurídica: IA recomenda default (SLU p/ solo), cliente confirma.
- Ordem do wizard: simulador **cedo** (engajamento) → **candidato a A/B**.
- Secundários: IA sugere + pill de prova social; cliente edita.
- Faturamento: **faixa guiada + default inteligente + slider opcional**, nunca campo aberto (não é valor legal).
- 🟡 anexos diferentes (pela maior × pela nota) = bloqueio parcial do motor, pendente Larissa.

---

# 🧩 BLOCO 3 — Cobrança (gateway)
**Job:** cliente enquadrado (dossiê pronto no B2) vira **pagante**. Converte o valor já mostrado (economia do Fator R) em **assinatura recorrente + aceite de contrato**. É a **1ª pausa de dinheiro** do fluxo. Regra do modelo operacional: onboarda e enquadra ANTES de pedir cartão; o app só gasta dinheiro real com órgão/certificado (B4+) **depois** de pago.

## Fontes-verdade do B3
- [[2026-07-14-escopo-servico-mensalidade]] — teardown Contabilizei: abertura "grátis" (só taxas de governo), escopo da "Contabilidade completa", certificado incluso.
- [[2026-07-08-planos-servico]] — snapshot de pricing do líder (âncora, tiers, "ideal até R$50 mil/mês").
- CDC **art. 49** (direito de arrependimento 7 dias) + exceção do serviço já executado — jurisprudência. Fontes web citadas na leitura de 14/07 (Galícia Educação, Jurídico.ai, Migalhas).
- [Contajá — política de cancelamento](https://contaja.com.br/politica-de-cancelamento-e-estorno/) e termos Contabilizei (fidelidade 12m + multa 30%) — benchmark de blindagem.

## Passos

| # | Passo | O que é / por que | Ator |
|---|---|---|---|
| 1 | Recap do valor | reprisa economia do Fator R (B2) + "o que você leva" (abertura + contabilidade completa mensal) | sistema |
| 2 | Escolha do plano | tiers ancorados na faixa de faturamento do B2; **vitrine mostra só o preço mensal** | cliente |
| 3 | Detalhe de custos | separa **honorário (mensalidade)** de **taxas de governo** (repasse, guia à parte, não reembolsável) | sistema |
| 4 | **Aceite do contrato** + autorização de início | contrato-como-produto (honorários) + termo de ciência de início de serviço. **Pausa de assinatura** | cliente |
| 5 | Método de pagamento | cartão / Pix / boleto (**Asaas**) | cliente |
| 6 | **PAUSA de pagamento** | espera confirmação do gateway | gateway |
| 7 | Confirmado → destrava B4 | "pagamento ok, começamos sua abertura agora" | sistema |

## D1 — O que se cobra (modelo travado)
Espelha o líder ([[2026-07-14-escopo-servico-mensalidade]]): **abertura "grátis"** (não se cobra o trabalho de abrir) — a receita é a **mensalidade**. A **1ª mensalidade já é o pagamento do 1º mês** do cliente (não é taxa de setup separada).
- **Taxas de governo** (DARE JUCEMG etc.) = **repasse**, guia emitida à parte, **não reembolsável** (dinheiro que sai pro Estado).
- **Certificado digital** incluso no plano (norma de mercado) — custo a absorver/repassar, decisão de infra.
- Vitrine mostra **só o valor mensal** (D3): *price framing / âncora* — seguir o líder, base em psicologia de preço (confiança média; % de lift não cravado sem fonte primária).

## As duas pausas do B3

**Pausa A — Assinatura do contrato + autorização de início**

| Campo | Definição |
|---|---|
| tipo | assinatura |
| gatilho retomada | contrato aceito + termo de início autorizado (clique/assinatura eletrônica) |
| cliente vê | contrato de honorários + termo de ciência ("ao iniciar, taxas de governo não voltam") |
| SLA | instantâneo (in-app) |
| fallback | não aceita → não avança; salva rascunho, reengaja |

**Pausa B — Pagamento**

| Campo | Definição |
|---|---|
| tipo | pagamento |
| gatilho retomada | **webhook Asaas** = pago/confirmado (idempotente — não duplica cobrança/abertura) |
| cliente vê | checkout → "pagamento confirmado, abertura iniciada" |
| SLA | cartão instantâneo · Pix seg/min · **boleto 1–3 dias úteis** (compensa, atrasa abertura) |
| fallback | cartão recusado → retry/troca método · boleto não pago em N dias → dunning → expira → reengaja/waitlist |

**Boleto (D4):** aceito, mas **fora do happy path** — quem quer abrir rápido usa cartão/Pix (destrava na hora). Boleto só destrava B4 após compensação.

## D5 — Política de cancelamento (blindagem em 4 camadas) 🔒
Problema resolvido: *"cliente cancela em 7 dias mas o CNPJ já foi aberto — ganha empresa de graça?"* A lei tem exceção pra serviço exaurido; os líderes já blindam. Regra Legalizei:

| Camada | O quê | Mata qual risco |
|---|---|---|
| 1 | **Autorização expressa de início** antes de constituir (termo no passo 4) | ativa a **exceção do art. 49** (serviço executado com anuência ≠ arrependimento devolutivo) |
| 2 | **Taxas de governo não reembolsáveis** (repasse ao Estado) | nunca se perde o gasto de terceiro |
| 3 | **Fidelidade + multa proporcional** ancorada na emissão do CNPJ (espelha Contabilizei: 12m + 30% sobre parcelas restantes) | abertura subsidiada, não doada — 🟡 **prazo pendente** (ver abaixo) |
| 4 | **Só constituir (B4) DEPOIS do pagamento confirmado** — já é o desenho do fluxo | nunca gasta antes de receber |

Resultado: cancela **em 7 dias antes de abrir** → devolve mensalidade, sem prejuízo (nada gasto ainda). Cancela **depois de aberto** → art. 49 não cobre serviço exaurido + retém taxa + cobra multa. Ninguém ganha CNPJ de graça.
> Base legal: CDC art. 49 (7 dias, contratação fora do estabelecimento) + jurisprudência que afasta arrependimento quando o serviço se exauriu com autorização expressa. Confiança: 🟢 no prazo/regra; 🟡 na exceção (análise caso a caso, boa-fé). **Redação jurídica do termo/contrato = tarefa Mauro/Larissa.**

## Pausa? (resumo)
- **Duas pausas internas:** assinatura (instantânea) + pagamento (instantâneo a 3 dias conforme método). Nenhuma externa de órgão ainda — essas começam no B4.
- **Fim** = pagamento confirmado → handoff pro **Bloco 4 (constituição)**.

## 🛠️ Implicações pro Dev
1. Integração **Asaas**: assinatura recorrente + cartão/Pix/boleto + **webhook idempotente** de confirmação.
2. Máquina de estados: `aguardando-assinatura` → `aguardando-pagamento` → `pago` (só `pago` destrava B4). Sobrevive dias pausado.
3. **Cobrança à parte** das taxas de governo (guia separada) — não some no valor do plano.
4. **Dunning** (boleto/cartão falho): lembretes + expiração + reengajamento.
5. Persistir **aceite do contrato + termo de início** com timestamp (prova pra camada 1 do cancelamento).
6. Tiers do plano cruzados com a **faixa de faturamento do B2**.

## ✅ Decisões travadas nesta rodada (2026-07-14)
- **D1:** abertura "grátis"; **1ª mensalidade = 1º mês**; taxas de governo = repasse à parte, não reembolsável; certificado incluso. Espelha o líder.
- **D2: Asaas** (gateway travado).
- **D3:** vitrine mostra **só o mensal** (price framing) — segue o líder.
- **D4:** boleto aceito, fora do happy path.
- **D5:** política de cancelamento = **4 camadas de blindagem** (autorização expressa + taxa não reembolsável + fidelidade/multa + pagamento antes de constituir).

## 🟡 Pendências do B3
- **Prazo da fidelidade** (12m como o líder? menos, pra vender mais fácil?) — Pedro validará **mais pra frente** (14/07).
- **Redação jurídica** do contrato-como-produto + termo de início de serviço → Mauro/Larissa.
- Custos reais de terceiros pra montar o repasse: taxa JUCEMG **~R$268,51 (LTDA padrão) / R$134,26 (EI)** ([[fiscal-simples-bh-2026]] #10; Izabela citou ~R$288 — reconciliar) · certificado A1 **R$209–229/ano** (Izabela). TFLF BH anual 🟡 valor exato.
- Escopo exato do "mensal" Legalizei vs. guia à parte — refinar contra [[2026-07-14-escopo-servico-mensalidade]].

---

# 🚧 Blocos 4+ (a lapidar)
- **Blocos 4+ — Constituição:** DBE → JUCEMG → assinatura GOV.BR → registro/taxa → CNPJ → CRC → certificado A1 → credenciamento NFS-e. Pausas externas pesadas (JUCEMG 5 dias sem API, certificado). → a especificar.

# ❓ Abertos / pendências
- 🟡 Larissa (fiscal): anexos diferentes (pela maior × pela nota) — afeta enquadramento do B2.
- Construir o Mapa de Confusão CNAE completo (a partir da matriz) — tarefa candidata.
- Nome definitivo do "Mapa de Confusão" (provisório).

## Links
- [[2026-07-13-plano-sequencia-pm]] · [[processo-abertura-empresa-bh]] · [[2026-07-09-conversa-izabela]] · [[2026-07-13-conversa-karla]] · [[fluxo-abertura-portais-pedro-dev]] · [[cnae-atendidos-e-nao-atendidos]] · [[kanban-legalizei]] · [[HOME]]
