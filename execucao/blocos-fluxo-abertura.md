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
Inputs: **CNAE principal + faturamento estimado + pró-labore**.
- **Fator R:** folha (incl. pró-labore) ≥ **28% do faturamento** → **Anexo III (6%)**; senão **Anexo V (15,5%)**. (Karla)
- **Simulador A × B** (transparente):

| | Cenário A | Cenário B |
|---|---|---|
| Pró-labore | mínimo (1 salário mín.) | maior (≥28% faturamento) |
| Anexo | V | III |
| Alíquota | 15,5% | 6% |
| Custo extra | — | INSS 11% + IR sobre o pró-labore maior |
| Resultado | mostra qual **compensa de fato** | decisão informada |

- **Transparência de custo (regra dura Karla):** mostrar **custo da folha (INSS+IR) + pró-labore líquido** explícito. Dor histórica: cliente não sabia do custo → pedia aumento só pra baixar imposto → cancelava/reemitia guia = retrabalho.

## Faturamento estimado = faixa guiada (NÃO campo aberto)
**Insight:** faturamento estimado **não é campo legal** — não entra em DBE/contrato/registro (esses usam capital social). É **input de simulação/plano**, não valor jurídico. Zero a mais estraga a *decisão*, não o *CNPJ*. E a empresa nem existe ainda → é chute honesto; faixa é mais honesta que precisão falsa. 🟡 confirmar com Izabela que nenhum doc de abertura captura receita estimada.

| Camada | Como | Por quê |
|---|---|---|
| 1. Faixas ancoradas | botões/slider nos limiares reais (teto Simples + limiar Fator R + tiers do plano). Ex: "até 10k" · "10–20k" · "20–30k" · "30k+" | resolução só onde muda decisão; zero risco de zero a mais |
| 2. Default inteligente | IA já chega com faixa marcada, cruzando **CNAE + solo/sócios** | menos fricção, "me conhece" |
| 3. Slider fino (opcional) | arrasta dentro da faixa se quiser resolução pro simulador | precisão sob demanda |

Simulador usa **ponto médio da faixa** + mostra **sensibilidade** ("na ponta de cima, o Fator R já compensa"). O que importa = de que lado dos 28% cai. Se um dia permitir digitação: máscara R$ + bounds (rejeita acima do teto) + confirm-back anti-zero-a-mais.

## Validações travadas (Karla)
- Pró-labore **mínimo = 1 salário mínimo** (🟡 confirmar valor vigente, anti-guru).
- **Sócio NÃO pode ser CLT da própria empresa** → bloqueio no form.
- Duplo vínculo → se bater teto INSS, não recolhe pró-labore pra ele.

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

# 🚧 Blocos 3+ (a lapidar)
- **Bloco 3 — Cobrança (gateway):** onboard antes do pagamento; só cobra após enquadrar. 1ª pausa de pagamento. → a especificar.
- **Blocos 4+ — Constituição:** DBE → JUCEMG → assinatura GOV.BR → registro/taxa → CNPJ → CRC → certificado A1 → credenciamento NFS-e. Pausas externas pesadas (JUCEMG 5 dias sem API, certificado). → a especificar.

# ❓ Abertos / pendências
- 🟡 Larissa (fiscal): anexos diferentes (pela maior × pela nota) — afeta enquadramento do B2.
- Construir o Mapa de Confusão CNAE completo (a partir da matriz) — tarefa candidata.
- Nome definitivo do "Mapa de Confusão" (provisório).

## Links
- [[2026-07-13-plano-sequencia-pm]] · [[processo-abertura-empresa-bh]] · [[2026-07-09-conversa-izabela]] · [[2026-07-13-conversa-karla]] · [[fluxo-abertura-portais-pedro-dev]] · [[cnae-atendidos-e-nao-atendidos]] · [[kanban-legalizei]] · [[HOME]]
